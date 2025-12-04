import { IAppResponseDTO, IService, IServiceFormDTO } from '@/@types/dtos';

export function useServices() {
  const fetchAll = async (offset: number, limit: number, filter: string): Promise<IAppResponseDTO<IService[]>> => {
    return (await window.api.invoke('fetch-services', offset, limit, filter)) as IAppResponseDTO<IService[]>;
  };

  const save = async (data: IServiceFormDTO): Promise<IAppResponseDTO<null>> => {
    return (await window.api.invoke('save-service', data)) as IAppResponseDTO<null>;
  };

  const remove = async (id: number): Promise<IAppResponseDTO<null>> => {
    return (await window.api.invoke('delete-service', id)) as IAppResponseDTO<null>;
  };

  return { fetchAll, save, remove };
}
