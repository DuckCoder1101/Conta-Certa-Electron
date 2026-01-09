import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { IAppResponseDTO, IService, IServiceFormDTO } from '@t/dtos';

import { AlertsContext } from '@contexts/AlertsContext';

export function useServices() {
  const { addToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const fetch = async (offset: number, limit: number, filter: string): Promise<IAppResponseDTO<IService[]>> => {
    const data = (await window.api.invoke('fetch-services', offset, limit, filter)) as IAppResponseDTO<IService[]>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'fetch-services-error',
        type: 'error',
        title: t('toasts.services.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const save = async (service: IServiceFormDTO): Promise<IAppResponseDTO<null>> => {
    const data = (await window.api.invoke('save-service', service)) as IAppResponseDTO<null>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'save-service-error',
        type: 'error',
        title: t('toasts.services.save-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const remove = async (id: number): Promise<IAppResponseDTO<null>> => {
    const data = (await window.api.invoke('delete-service', id)) as IAppResponseDTO<null>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'remove-service-error',
        type: 'error',
        title: t('toasts.services.remove-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  return { fetch, save, remove };
}
