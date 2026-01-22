import React from 'react';
import { useTranslation } from 'react-i18next';

import { IColumn, RowActions, ITableEntity } from '@t/Table';

interface Props<T extends ITableEntity> {
  columns: IColumn<T>[];
  data: T[];
  actions?: RowActions<T>;
  onScroll?: (ev: React.UIEvent) => void;
  loading: boolean;
  emptyMessage: string;
}

export default function AppTable<T extends ITableEntity>({
  columns,
  data,
  actions,
  onScroll,
  loading,
  emptyMessage,
}: Props<T>) {
  const { t } = useTranslation();

  return (
    <div onScroll={onScroll} className="overflow-auto">
      <table className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
        <thead>
          <tr className="border-b bg-surface text-text-primary">
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-4 py-3 text-${col.align ?? 'left'} max-w-[${col.width}]`}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 font-semibold">{t('global.table.actions.title')}</th>}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-text-placeholder">
                {t('global.table.loading-message')}
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-text-placeholder">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row) => (
              <tr
                key={row.id}
                className="odd:bg-sidebar-bg even:bg-sidebar-hover border-b text-text-primary hover:bg-surface-muted"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    title={String(row[col.key])}
                    className={`px-4 py-3 text-${col.align ?? 'left'} max-w-[${col.width}] truncate whitespace-nowrap`}
                  >
                    {col.render?.(row[col.key], row) ?? String(row[col.key])}
                  </td>
                ))}

                {actions && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
