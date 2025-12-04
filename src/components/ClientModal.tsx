import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IClient, IClientFormDTO } from '@t/dtos';
import { NumericFormat } from 'react-number-format';

// Ícones
import { MdClose } from 'react-icons/md';

import InputMask from 'react-input-mask';
import ModalBase from '@components/ModalBase';
import { useClients } from '@hooks/useClients';
import SaveButton from './SaveButton';

interface Props {
  open: boolean;
  client: IClient | null;
  onClose: (success: boolean, errorMessage: string | null) => void;
}

export default function ClientModal({ open, onClose, client }: Props) {
  const { save } = useClients();
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

  const saveClient = handleSubmit(async (data) => {
    data.name = data.name.trim();
    data.email = data.email?.trim() || null;

    data.cpf = data.cpf?.match(/\d/g)?.join('') || null;
    data.cnpj = data.cnpj?.match(/\d/g)?.join('') || null;
    data.phone = data.phone?.match(/\d/g)?.join('') ?? '';

    const { success, error } = await save(data);

    if (error && error.status === 400) {
      return setFormError(error.message);
    }

    setFormError(null);
    onClose(success, error?.message ?? null);
  });

  return (
    <ModalBase isOpen={open} onClose={() => onClose(false, null)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-6 text-center text-2xl font-semibold">{client ? 'Editar cliente' : 'Cadastrar cliente'}</h2>
        <button onClick={() => onClose(false, null)} className="text-xl font-bold hover:text-red-400">
          <MdClose />
        </button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {formError && <p className="col-span-full text-center text-red-400">{formError}</p>}

        {/* CPF */}
        <div>
          <label className="mb-1 block text-sm font-semibold">CPF</label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <InputMask
                mask="999.999.999-99"
                className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* CNPJ */}
        <div>
          <label className="mb-1 block text-sm font-semibold">CNPJ</label>
          <Controller
            name="cnpj"
            control={control}
            render={({ field }) => (
              <InputMask
                mask="99.999.999/9999-99"
                className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Nome</label>
          <input className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500" {...register('name', { required: true })} />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Email</label>
          <input type="email" className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500" {...register('email')} />
        </div>

        {/* Telefone */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Telefone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputMask mask="(99) 99999-9999" className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500" {...field} />
            )}
          />
        </div>

        {/* Honorário */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Honorário</label>
          <Controller
            name="fee"
            control={control}
            render={({ field }) => (
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$"
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                value={field.value}
                onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
        </div>

        {/* Vencimento */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Vencimento</label>
          <input
            type="number"
            min={1}
            max={31}
            className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
            {...register('feeDueDay', { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Botão */}
        <div className="col-span-full mt-4 flex justify-end">
          <SaveButton onClick={saveClient} />
        </div>
      </form>
    </ModalBase>
  );
}
