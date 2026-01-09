import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { IAppResponseDTO, IClient, IClientFormDTO, IClientResumeDTO } from '@t/dtos';

import { AlertsContext } from '@contexts/AlertsContext';

export function useClients() {
  const { addToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const fetch = async (offset: number, limit: number, filter: string) => {
    const data = (await window.api.invoke('fetch-clients', offset, limit, filter)) as IAppResponseDTO<IClient[]>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'fetch-clients-error',
        type: 'error',
        title: t('toasts.clients.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const count = async (): Promise<IAppResponseDTO<number>> => {
    const data = (await window.api.invoke('count-clients')) as IAppResponseDTO<number>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'count-clients-error',
        type: 'error',
        title: t('toasts.clients.count-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const fetchResumes = async () => {
    const data = (await window.api.invoke('fetch-clients-resume')) as IAppResponseDTO<IClientResumeDTO[]>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'fetch-client-resumes-error',
        type: 'error',
        title: t('toasts.clients.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const fetchById = async (id: number) => {
    const data = (await window.api.invoke('fetch-client-by-id', id)) as IAppResponseDTO<IClient>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'fetch-client-by-id-error',
        type: 'error',
        title: t('toasts.clients.fetch-by-id-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const save = async (client: IClientFormDTO) => {
    const data = (await window.api.invoke('save-client', client)) as IAppResponseDTO<null>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'save-client-error',
        type: 'error',
        title: t('toasts.clients.save-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const remove = async (id: number) => {
    const data = (await window.api.invoke('delete-client', id)) as IAppResponseDTO<null>;
    if (data.error && data.error.status != 400) {
      addToast({
        id: 'remove-client-error',
        type: 'error',
        title: t('toasts.clients.remove-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  return { fetch, count, fetchResumes, fetchById, save, remove };
}
