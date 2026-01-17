import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { IAppResponse } from '@t/AppResponse';
import { IBilling } from '@t/Schemas';
import { IBillingFormDTO, IBillingResumeDTO, IServiceBillingFormDTO } from '@t/DTOs';

import { AlertsContext } from '@contexts/AlertsContext';

import { useServices } from '@hooks/useServices';

export function useBillings() {
  const { showToast } = useContext(AlertsContext);
  const { t } = useTranslation();

  const { fetch: fetchServices } = useServices();

  const fetch = async (offset: number, limit: number, filter: string) => {
    const data = (await window.api.invoke('fetch-billings', offset, limit, filter)) as IAppResponse<IBilling[]>;

    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.billings.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const fetchResumes = async () => {
    const data = (await window.api.invoke('fetch-billings-resume')) as IAppResponse<IBillingResumeDTO[]>;

    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.billings.fetch-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const save = async (billing: IBillingFormDTO) => {
    const data = (await window.api.invoke('save-billing', billing)) as IAppResponse<null>;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.billings.save-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const remove = async (id: number) => {
    const data = (await window.api.invoke('delete-billing', id)) as IAppResponse<null>;
    if (data.error && data.error.status != 400) {
      showToast({
        type: 'error',
        title: t('toasts.billings.remove-error.title'),
        message: t(`errors:${data.error.code}`, data.error.params),
      });
    }

    return data;
  };

  const prepareServices = async (billing: IBilling | null): Promise<IServiceBillingFormDTO[]> => {
    const { data } = await fetchServices(0, Infinity, '');
    if (!data) return [];

    const result: IServiceBillingFormDTO[] = [];

    if (billing) {
      billing.serviceBillings.forEach((s) => result.push({ ...s }));

      data.forEach((s) => {
        const exists = result.some((x) => x.serviceOriginId === s.id);
        if (!exists) {
          result.push({
            name: s.name,
            value: s.value,
            quantity: 0,
            serviceOriginId: s.id,
          });
        }
      });
    } else {
      data.forEach((s) =>
        result.push({
          name: s.name,
          value: s.value,
          quantity: 0,
          serviceOriginId: s.id,
        }),
      );
    }

    return result;
  };

  return { fetch, fetchResumes, save, remove, prepareServices };
}
