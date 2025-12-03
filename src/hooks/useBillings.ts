import { IAppResponseDTO, IBilling, IBillingFormDTO, IBillingResumeDTO, IService, IServiceBillingFormDTO } from '@/@types/dtos';

export function useBillings() {
  const fetchAll = async (offset: number, limit: number, filter: string) => {
    return (await window.api.invoke('fetch-all-billings', offset, limit, filter)) as IAppResponseDTO<IBilling[]>;
  };

  const fetchAllResumes = async () => {
    return (await window.api.invoke('fetch-all-billings-resume')) as IAppResponseDTO<IBillingResumeDTO[]>;
  };

  const save = async (billing: IBillingFormDTO) => {
    return (await window.api.invoke('save-billing', billing)) as IAppResponseDTO<null>;
  };

  const remove = async (id: number) => {
    return (await window.api.invoke('delete-billing', id)) as IAppResponseDTO<null>;
  };

  const fetchServices = async () => {
    return (await window.api.invoke('fetch-services')) as IAppResponseDTO<IService[]>;
  };

  const prepareServices = async (billing: IBilling | null): Promise<IServiceBillingFormDTO[]> => {
    const { data } = await fetchServices();
    if (!data) return [];

    const result: IServiceBillingFormDTO[] = [];

    if (billing) {
      billing.serviceBillings.forEach((s) => result.push({ ...s }));

      data.forEach((s) => {
        const exists = result.some((x) => x.serviceOriginId === s.id);
        if (!exists) {
          result.push({
            id: null,
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
          id: null,
          name: s.name,
          value: s.value,
          quantity: 0,
          serviceOriginId: s.id,
        }),
      );
    }

    return result;
  };

  return { fetchAll, fetchAllResumes, save, remove, fetchServices, prepareServices };
}
