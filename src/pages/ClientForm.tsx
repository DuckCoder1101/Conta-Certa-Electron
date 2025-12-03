import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';

import { IClientFormDTO } from '@t/dtos';

import { useClients } from '@hooks/useClients';

import { GlobalEventsContext } from '@contexts/GlobalEventsContext';

import AppLayout from '@components/AppLayout';
import SaveButton from '@/components/SaveButton';

export default function ClientForm() {
  const { setError } = useContext(GlobalEventsContext);

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

  const saveClient = handleSubmit(async (data) => {
    data.name = data.name.trim();
    data.email = data.email?.trim() || null;

    data.cpf = data.cpf?.match(/\d/g)?.join('') || null;
    data.cnpj = data.cnpj?.match(/\d/g)?.join('') || null;
    data.phone = data.phone?.match(/\d/g)?.join('') ?? '';

    const { success, error } = await save(data);
    if (!success && error) {
      if (error.status == 400) {
        setFormError(error.message);
      } else {
        setError(error.message);
      }
    } else {
      reset();
    }
  });

  return (
    <AppLayout>
      <form className="mx-auto grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <h2 className="col-span-full mb-6 text-center text-2xl font-semibold">Cadastrar clientes</h2>

        {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold text-red-400">{formError}</p>}

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
        <div className="col-span-full flex justify-center md:mt-4 md:justify-end">
          <SaveButton onClick={saveClient} />
        </div>
      </form>
    </AppLayout>
  );
}
