import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IoMdFolderOpen, IoMdSearch } from 'react-icons/io';
import { MdBackup } from 'react-icons/md';

import { useBackupsList } from '@hooks/useBackupsList';
import { useInfiniteScroll } from '@hooks/useInfinityScroll';

import AppLayout from '@components/AppLayout';
import DeleteHoldButton from '@components/form/DeleteHoldButton';
import AppTable from '@components/AppTable';

import { formatBytes, formatDate } from '@utils/formatters';

import { TasksContext } from '@contexts/TasksContext';
import { SettingsContext } from '@contexts/SettingsContext';

import { IBackupMeta } from '@t/Schemas';
import { IColumn } from '@t/Table';
import { IBackupMetaTableDTO } from '@t/DTOs';

export default function BackupsList() {
  // Traduções
  const { t } = useTranslation();

  // Configuracoes
  const { settings } = useContext(SettingsContext);

  // Contexto de tasks
  const { startTask } = useContext(TasksContext);

  // Hook da lista de backups
  const { fetch } = useBackupsList();

  // Filtro
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll
  const {
    items: backups,
    loading,
    handleScroll,
    reload,
  } = useInfiniteScroll<IBackupMeta>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  const columns: IColumn<IBackupMetaTableDTO>[] = [
    { key: 'createdAt', header: t('backup.list.table.created-at'), width: '130' },
    { key: 'source', header: t('backup.list.table.source'), width: '130' },
    { key: 'size', header: t('backup.list.table.size'), width: '130' },
  ];

  // Linhas da tabela
  const rows: IBackupMetaTableDTO[] = useMemo(() => {
    return backups.map((b) => ({
      id: b.id,
      size: formatBytes(b.size!),
      createdAt: formatDate(b.createdAt, settings?.language ?? 'pt-BR'),
      source: t(`backup.source.${b.source}`),
    }));
  }, [backups, t, settings?.language]);

  // Gerar backup
  const generateBackup = async () => {
    startTask('SAVE_LOCAL_BACKUP');
  };

  // Deletar backup
  const deleteBackup = async (backupId: string) => {};

  // Abre a pasta de backups
  const openBackupFolder = (backupId?: string) => {};

  // Busca os backups a primeira vez, e quando muda o filtro
  useEffect(() => {
    (async () => await reload())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <AppLayout>
      <h2 className="mt-5 text-center text-2xl font-semibold">{t('backup.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 flex items-center gap-3 rounded-md border border-border bg-surface p-2 shadow-sm hover:bg-surface-muted">
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
          className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-text-primary transition hover:bg-surface"
        >
          <MdBackup />
        </button>
      </form>

      {/* TABELA */}
      <AppTable
        onScroll={handleScroll}
        columns={columns}
        data={rows}
        loading={loading}
        emptyMessage={t('backup.list.table.empty')}
        actions={(backup) => (
          <>
            <button
              onClick={() => openBackupFolder(backup.id)}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-text-primary transition hover:opacity-90"
            >
              <IoMdFolderOpen />
            </button>
            <DeleteHoldButton onComplete={() => deleteBackup(backup.id)} duration={600} />
          </>
        )}
      />
    </AppLayout>
  );
}
