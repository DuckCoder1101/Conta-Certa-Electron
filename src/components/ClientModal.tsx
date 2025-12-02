import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IAppResponseDTO, IClient, IClientFormDTO } from '@t/dtos';

// Ícones
import { MdClose } from 'react-icons/md';

import InputMask from 'react-input-mask';
import ModalBase from '@/components/ModalBase';

interface Props {
  open: boolean;
  client: IClient | null;
  onClose: (success: boolean, errorMessage: string | null) => void;
}

export default function ClientModal({ open, onClose, client }: Props) {
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<IClientFormDTO>({
    defaultValues: {
      cpf: '',
      cnpj: '',
      name: '',
      email: '',
      phone: '',
      fee: 1,
      feeDueDay: 1,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        client || {
          cpf: '',
          cnpj: '',
          name: '',
          email: '',
          phone: '',
          fee: 1,
          feeDueDay: 1,
        },
      );
      setFormError(null);
    }
  }, [open, client, reset]);

  const SaveClient = handleSubmit(async (data) => {
    data.name = data.name.trim();
    data.email = data.email?.trim() || null;

    data.cpf = data.cpf?.match(/\d/g)?.join('') || null;
    data.cnpj = data.cnpj?.match(/\d/g)?.join('') || null;
    data.phone = data.phone?.match(/\d/g)?.join('') ?? '';

    const { success, error } = (await window.api.invoke('save-client', {
      id: client?.id,
      ...data,
    })) as IAppResponseDTO<IClient>;

    if (error && error.status === 400) {
      return setFormError(error.message);
    }

    onClose(success, error?.message ?? null);
  });

  return (
    <ModalBase isOpen={open} onClose={() => onClose(false, null)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{client ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
        <button onClick={() => onClose(false, null)} className="text-xl font-bold hover:text-red-400">
          <MdClose />
        </button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {formError && <p className="col-span-full text-center text-red-400">{formError}</p>}

        {/* CPF */}
        <div>
          <label className="mb-1 block">CPF:</label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <InputMask
                mask="999.999.999-99"
                className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none"
                value={field.value || ''}
                readOnly={client != null}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* CNPJ */}
        <div>
          <label className="mb-1 block">CNPJ:</label>
          <Controller
            name="cnpj"
            control={control}
            render={({ field }) => (
              <InputMask
                mask="99.999.999/9999-99"
                className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none"
                value={field.value || ''}
                readOnly={client != null}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Nome */}
        <div>
          <label className="mb-1 block">Nome:</label>
          <input className="w-full rounded bg-sidebar-hover p-2 outline-none" {...register('name', { required: true })} />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block">Email:</label>
          <input type="email" className="w-full rounded bg-sidebar-hover p-2 outline-none" {...register('email', { required: false })} />
        </div>

        {/* Telefone */}
        <div>
          <label className="mb-1 block">Telefone:</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => <InputMask mask="(99) 99999-9999" className="w-full rounded bg-sidebar-hover p-2 outline-none" value={field.value} onChange={field.onChange} />}
          />
        </div>

        {/* Honorário */}
        <div>
          <label className="mb-1 block">Honorário:</label>
          <input type="number" min={1} step="0.01" className="w-full rounded bg-sidebar-hover p-2 outline-none" {...register('fee', { required: true, valueAsNumber: true })} />
        </div>

        {/* Vencimento */}
        <div>
          <label className="mb-1 block">Vencimento:</label>
          <input type="number" min={1} max={31} className="w-full rounded bg-sidebar-hover p-2 outline-none" {...register('feeDueDay', { required: true, valueAsNumber: true })} />
        </div>
      </form>

      <div className="mt-6 text-right">
        <button onClick={SaveClient} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Salvar Cliente
        </button>
      </div>
    </ModalBase>
  );
}
