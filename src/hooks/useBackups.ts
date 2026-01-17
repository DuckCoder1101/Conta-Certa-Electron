import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertsContext } from '@contexts/AlertsContext';

import { IAppResponse } from '@t/AppResponse';
import { IBackupMeta } from '@t/Schemas';

export function useBackups() {
  const { showToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const fetch = async (offset: number, limit: number, filter: string) => {
    const data = (await window.api.invoke('fetch-backups', offset, limit, filter)) as IAppResponse<IBackupMeta[]>;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.backups.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const generate = async () => {
    const data = (await window.api.invoke('generate-backup')) as IAppResponse;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.backups.generate-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  return { fetch, generate };
}
