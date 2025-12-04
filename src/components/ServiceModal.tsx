import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IService, IServiceFormDTO } from '@t/dtos';
import { NumericFormat } from 'react-number-format';

// Ícones
import { MdClose } from 'react-icons/md';

import ModalBase from '@components/ModalBase';
import SaveButton from './SaveButton';

import { useServices } from '@/hooks/useServices';

interface Props {
  open: boolean;
  client: IService | null;
  onClose: (success: boolean, errorMessage: string | null) => void;
}

export default function ServiceModal({ open, onClose, client: service }: Props) {
  const { save } = useServices();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<IServiceFormDTO>({
    defaultValues: {
      name: '',
      value: 1,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        service || {
          name: '',
          value: 1,
        },
      );
      setFormError(null);
    }
  }, [open, service, reset]);

  const saveService = handleSubmit(async (data) => {
    data.name = data.name.trim();

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
        <h2 className="mb-6 text-center text-2xl font-semibold">{service ? 'Editar serviço' : 'Cadastrar serviço'}</h2>
        <button onClick={() => onClose(false, null)} className="text-xl font-bold hover:text-red-400">
          <MdClose />
        </button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {formError && <p className="col-span-full text-center text-red-400">{formError}</p>}

        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Nome</label>
          <input className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500" {...register('name', { required: true })} />
        </div>

        {/* Valor */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Valor</label>
          <Controller
            name="value"
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

        {/* Botão */}
        <div className="col-span-full mt-4 flex justify-end">
          <SaveButton onClick={saveService} />
        </div>
      </form>
    </ModalBase>
  );
}
