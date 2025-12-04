import { IAppResponseDTO, IClient, IClientFormDTO, IClientResumeDTO } from '@/@types/dtos';

export function useClients() {
  const fetchAll = async (offset: number, limit: number, filter: string) => {
    return (await window.api.invoke('fetch-clients', offset, limit, filter)) as IAppResponseDTO<IClient[]>;
  };

  const count = async (): Promise<IAppResponseDTO<number>> => {
    return (await window.api.invoke('count-clients')) as IAppResponseDTO<number>;
  } 

  const fetchResume = async () => {
    return (await window.api.invoke('fetch-clients-resume')) as IAppResponseDTO<IClientResumeDTO[]>;
  };

  const fetchById = async (id: number) => {
    return (await window.api.invoke('fetch-client-by-id', id)) as IAppResponseDTO<IClient>;
  };

  const save = async (data: IClientFormDTO) => {
    return (await window.api.invoke('save-client', data)) as IAppResponseDTO<null>;
  };

  const remove = async (id: number) => {
    return (await window.api.invoke('delete-client', id)) as IAppResponseDTO<null>;
  };

  return { fetchAll, count, fetchResume, fetchById, save, remove };
}
