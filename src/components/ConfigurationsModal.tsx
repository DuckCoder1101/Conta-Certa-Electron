import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';

import ModalBase from './ModalBase';
import SaveButton from './SaveButton';

import { IAppResponseDTO } from '@t/dtos';
import IConfiguration from '@t/configuration';

interface Props {
  open: boolean;
  onClose: (success: boolean, error: string | null) => void;
}

export default function ConfigurationsModal({ open, onClose }: Props) {
  const { register, handleSubmit, reset } = useForm<IConfiguration>({
    values: {
      autoBilling: true,
      autoUpdate: true,
      language: 'pt-BR',
      theme: 'dark',
    },
  });

  const saveConfiguration = handleSubmit(async (data) => {
    const { success, error } = (await window.api.invoke('set-settings', data)) as IAppResponseDTO<null>;
    onClose(success, error?.message ?? 'Erro desconhecido!');
  });

  useEffect(() => {
    if (!open) return
 
    (async () => {
      const { success, data, error } = (await window.api.invoke('get-settings')) as IAppResponseDTO<IConfiguration>;

      if (!success) {
        onClose(success, error?.message ?? 'Error desconhecido!');
      } else if (data) {
        reset({
          autoBilling: data.autoBilling,
          autoUpdate: data.autoUpdate,
          language: data.language,
          theme: data.theme,
        });
      }
    })();

  }, [open, reset, onClose]);

  return (
    <ModalBase isOpen={open} onClose={() => onClose(false, null)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-6 text-center text-2xl font-semibold">Configurações</h2>
        <button onClick={() => onClose(false, null)} className="text-xl font-bold hover:text-red-400">
          <MdClose />
        </button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block">Linguagem: </label>
          <select {...register('language', { required: true })} className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pt-BR">Português</option>
            <option value="en-US">Inglês</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">Tema: </label>
          <select {...register('theme', { required: true })} className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500">
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
            <option value="system">Padrão do sistema</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">Faturamentos automáticos: </label>
          <input type="checkbox" {...register('autoBilling')} />
        </div>

        <div>
          <label className="mb-1 block">Atualizações atuamáticas: </label>
          <input type="checkbox" {...register('autoUpdate')} />
        </div>

        <div className="col-span-full flex items-center justify-center">
          <SaveButton onClick={saveConfiguration} />
        </div>
      </form>
    </ModalBase>
  );
}
