import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';

import { IAppResponseDTO, IClient, IClientFormDTO } from '@/@types/dtos';

import ErrorModal from '@/components/ErrorModal';
import Sidebar from '@/components/Sidebar';

export default function ClientForm() {
  const [error, setError] = useState<string | null>(null);
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

  const SaveClient = handleSubmit(async (data) => {
    data.name = data.name.trim();
    data.email = data.email?.trim() || null;

    data.cpf = data.cpf?.match(/\d/g)?.join('') || null;
    data.cnpj = data.cnpj?.match(/\d/g)?.join('') || null;
    data.phone = data.phone?.match(/\d/g)?.join('') ?? '';

    const { error } = (await window.api.invoke('save-client', data)) as IAppResponseDTO<IClient>;

    if (error && error.status === 400) {
      return setFormError(error.message);
    }

    reset({
      cpf: '',
      cnpj: '',
      name: '',
      phone: '',
      email: '',
      fee: 1,
      feeDueDay: 1,
    });
  });

  return (
    <div className="m-0 flex min-h-screen bg-light-bg p-0">
      {/* MODAIS */}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <div className="d-flex justify-center align-middle flex-grow bg-light-bg2 p-6 text-light-text">
        <h2 className="mb-8 mt-2 text-center text-3xl font-bold tracking-wide">Cadastrar Clientes</h2>

        <form className="mx-auto grid max-w-5xl grid-cols-1 gap-6 rounded-xl p-8 shadow-lg backdrop-blur-md md:grid-cols-2">
          {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold text-red-400">{formError}</p>}

          {/* CPF */}
          <div>
            <label className="mb-1 block text-sm font-semibold">CPF</label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <InputMask mask="999.999.999-99" className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" value={field.value || ''} onChange={field.onChange} />
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
                <InputMask mask="99.999.999/9999-99" className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" value={field.value || ''} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Nome */}
          <div>
            <label className="mb-1 block text-sm font-semibold">Nome</label>
            <input
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-hover p-3 text-sidebar-text outline-none focus:ring-2 focus:ring-blue-500"
              {...register('name', { required: true })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-hover p-3 text-sidebar-text outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email')}
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="mb-1 block text-sm font-semibold">Telefone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  mask="(99) 99999-9999"
                  className="w-full rounded-lg border border-sidebar-border bg-sidebar-hover p-3 text-sidebar-text outline-none focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
          </div>

          {/* Honorário */}
          <div>
            <label className="mb-1 block text-sm font-semibold">Honorário</label>
            <input
              type="number"
              min={1}
              step="0.01"
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-hover p-3 text-sidebar-text outline-none focus:ring-2 focus:ring-blue-500"
              {...register('fee', { required: true, valueAsNumber: true })}
            />
          </div>

          {/* Vencimento */}
          <div>
            <label className="mb-1 block text-sm font-semibold">Vencimento</label>
            <input
              type="number"
              min={1}
              max={31}
              className="w-full rounded-lg border border-sidebar-border bg-sidebar-hover p-3 text-sidebar-text outline-none focus:ring-2 focus:ring-blue-500"
              {...register('feeDueDay', { required: true, valueAsNumber: true })}
            />
          </div>

          {/* Botão */}
          <div className="col-span-full mt-4 flex justify-end">
            <button type="button" onClick={SaveClient} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700">
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
