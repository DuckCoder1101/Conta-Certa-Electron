import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertsContext } from '@contexts/AlertsContext';

import { IAppResponseDTO } from '@t/dtos';
import { BackupMeta } from '@t/backup';

export function useBackups() {
  const { addToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const fetch = async (offset: number, limit: number, filter: string) => {
    const data = (await window.api.invoke('fetch-backups', offset, limit, filter)) as IAppResponseDTO<BackupMeta[]>;

    console.log(data.error);

    if (data.error && data.error.status != 400) {
      addToast({
        id: 'fetch-backups-error',
        type: 'error',
        title: t('toasts.backups.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const generate = async () => {
    const data = (await window.api.invoke('generate-backup')) as IAppResponseDTO;

    if (data.error && data.error.status != 400) {
      addToast({
        id: 'generate-backup-error',
        type: 'error',
        title: t('toasts.backups.generate-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  return { fetch, generate };
}
