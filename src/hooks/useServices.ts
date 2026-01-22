import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { IAppResponse } from '@t/AppResponse';
import { IService } from '@t/Schemas';
import { IServiceFormDTO } from '@t/DTOs';

import { AlertsContext } from '@contexts/AlertsContext';

export function useServices() {
  const { showToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const fetch = async (offset: number, limit: number, filter: string): Promise<IAppResponse<IService[]>> => {
    const data = (await window.api.invoke('fetch-services', offset, limit, filter)) as IAppResponse<IService[]>;
    if (data.error && data.error.status != 400) {
      showToast({
        title: t('toasts.services.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
        type: 'error',
      });
    }

    return data;
  };

  const save = async (service: IServiceFormDTO): Promise<IAppResponse<null>> => {
    const data = (await window.api.invoke('save-service', service)) as IAppResponse<null>;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.services.save-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const remove = async (id: number): Promise<IAppResponse<null>> => {
    const data = (await window.api.invoke('delete-service', id)) as IAppResponse<null>;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.services.remove-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  return { fetch, save, remove };
}
