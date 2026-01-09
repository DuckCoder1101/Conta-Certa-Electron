import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IoMdSearch, IoMdFolderOpen } from 'react-icons/io';
import { MdBackup } from 'react-icons/md';

import { useBackups } from '@hooks/useBackups';

import { AlertsContext } from '@contexts/AlertsContext';

import AppLayout from '@components/AppLayout';
import { useInfiniteScroll } from '@hooks/useInfinityScroll';

import { BackupMeta } from '@t/backup';
import { formatDate } from '@utils/formatters';
import DangerHoldButton from '@components/form/DangerHoldButton';

export default function BackupsList() {
  // Traduções
  const { t } = useTranslation();

  // Toasts
  const { addToast } = useContext(AlertsContext);

  // Backups hook
  const { fetch, generate } = useBackups();

  // Filtro
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll
  const { items: backups, load, handleScroll } = useInfiniteScroll<BackupMeta>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  // Load
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Rows
  const rows = useMemo(() => {
    return backups.map((b) => ({
      id: b.id,
      size: `${b.size} MB`,
      createdAt: formatDate(b.createdAt),
      source: t(`backup.source.${b.source}`),
    }));
  }, [backups, t]);

  // New backup
  const generateBackup = async () => {
    // Aviso de geração iniciada
    addToast({
      title: t('backups.toasts.started.title'),
      message: t('backups.toasts.started.message'),
      type: 'info',
      id: 'backup-generation-started',
    });

    const { success } = await generate();

    if (success) {
      await load();

      // Aviso de sucesso
      addToast({
        title: t('backups.toasts.success.title'),
        type: 'success',
        message: t('backups.toasts.success.message'),
        id: 'backup-generation-success',
      });
    }
  };

  // Delete backup
  const deleteBackup = async (backupId: string) => {};

  // Open backups folder
  const openBackupFolder = (backupId?: string) => {};

  return (
    <AppLayout>
      <h2 className="mt-5 text-center text-2xl font-semibold">{t('backup.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="bg-sidebar-hover my-5 block items-center gap-3 rounded-md border border-border p-2 shadow-sm hover:bg-surface-muted md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-text-primary">
            <IoMdSearch />
          </span>

          <input
            type="search"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder={t('backup.list.tools.search-placeholder')}
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => generateBackup()}
          title={t('backup.list.tools.generate-backup')}
          className="bg-sidebar-hover2 ms-auto flex h-10 w-10 items-center justify-center rounded-md text-text-primary transition hover:bg-surface-muted"
        >
          <MdBackup />
        </button>
      </form>

      <div className="w-full overflow-x-auto">
        <table onScroll={handleScroll} className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="bg-sidebar-hover2 border-b text-left text-text-primary">
              <th className="px-4 py-3 font-semibold">{t('backup.list.table.created-at')}</th>
              <th className="px-4 py-3 font-semibold">{t('backup.list.table.size')}</th>
              <th className="px-4 py-3 font-semibold">{t('backup.list.table.source')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="odd:bg-sidebar-bg eveSn:bg-sidebar-hover border-b text-text-primary hover:bg-surface-muted">
                <td className="max-w-[180px] truncate whitespace-nowrap px-4 py-3" title={b.createdAt}>
                  {b.createdAt}
                </td>

                <td className="max-w-[100px] truncate whitespace-nowrap px-4 py-3" title={b.size}>
                  {b.size}
                </td>

                <td className="max-w-[120px] truncate whitespace-nowrap px-4 py-3" title={b.source}>
                  {b.source}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openBackupFolder(b.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-text-primary transition hover:opacity-90"
                    >
                      <IoMdFolderOpen />
                    </button>

                    <DangerHoldButton onComplete={() => deleteBackup(b.id)} duration={600} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
