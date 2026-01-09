import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ModalBase from '@modals/ModalBase';
import SaveButton from '../form/SaveButton';

import ISettings from '@t/settings';
import { SettingsContext } from '@contexts/SettingsContext';

interface Props {
  open: boolean;
  onClose: (success: boolean, error: string | null) => void;
}

export default function SettingsModal({ open, onClose }: Props) {
  const { settings, updateSettings } = useContext(SettingsContext);

  const { register, handleSubmit, reset } = useForm<ISettings>({
    values: {
      autoBilling: true,
      autoUpdate: true,
      autoBackup: true,
      language: 'pt-BR',
      theme: 'dark',
    },
  });

  const saveConfiguration = handleSubmit(async (data) => {
    if (data) {
      updateSettings?.(data);
    }
  });

  useEffect(() => {
    if (!open || !settings) return;
    reset(settings);
  }, [open, reset, settings]);

  return (
    <ModalBase title="Configurações" isOpen={open} onClose={() => onClose(false, null)}>
      {/* Form */}
      <form className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2" onSubmit={saveConfiguration}>
        <div>
          <label className="mb-1 block">Linguagem: </label>
          <select
            {...register('language', { required: true })}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="pt-BR">Português</option>
            <option value="en-US">Inglês</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block">Tema: </label>
          <select
            {...register('theme', { required: true })}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
            <option value="system">Padrão do sistema</option>
          </select>
        </div>

        <div className="col-span-2 mt-2 flex">
          <label>Faturamentos mensais: </label>
          <input type="checkbox" {...register('autoBilling')} className="ms-auto h-4 w-4" />
        </div>

        <div className="col-span-2 flex">
          <label>Atualizações automáticas: </label>
          <input type="checkbox" {...register('autoUpdate')} className="ms-auto h-4 w-4" />
        </div>

        <div className="col-span-2 flex">
          <label>Backups diários: </label>
          <input type="checkbox" {...register('autoBackup')} className="ms-auto h-4 w-4" />
        </div>

        <div className="col-span-full mt-4 flex items-center justify-center">
          <SaveButton type="submit" />
        </div>
      </form>
    </ModalBase>
  );
}
