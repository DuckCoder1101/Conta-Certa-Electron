import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { MdClose } from 'react-icons/md';

import ModalBase from '@components/ModalBase';
import SaveButton from '../SaveButton';

import { IBilling, IBillingFormDTO, IClientResumeDTO, IServiceBillingFormDTO } from '@t/dtos';

import { GlobalEventsContext } from '@contexts/GlobalEventsContext';

import { useClients } from '@hooks/useClients';
import { useBillings } from '@hooks/useBillings';
import { ServicesSelector } from './ServicesSelector';

interface Props {
  open: boolean;
  billing: IBilling | null;
  onClose: (success: boolean, errorMessage: string | null) => void;
}

export default function BillingModal({ open, billing, onClose }: Props) {
  const { fetchResume, fetchById } = useClients();
  const { prepareServices, save } = useBillings();

  const { setError } = useContext(GlobalEventsContext);
  const { register, handleSubmit, reset, setValue, watch, control } = useForm<IBillingFormDTO>({
    values: {
      id: null,
      clientId: -1,
      fee: 1,
      status: 'pending',
      paidAt: null,
      dueDate: new Date().toISOString().split('T')[0],
      serviceBillings: [],
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [clients, setClients] = useState<IClientResumeDTO[]>([]);
  const [search, setSearch] = useState('');
  const status = watch('status');
  const clientId = watch('clientId');
  const [servicesBilling, setServicesBilling] = useState<IServiceBillingFormDTO[]>([]);
  const filteredClients = clients.filter((c) => c.name.toLowerCase().startsWith(search.toLowerCase()));

  // Buscar cliente completo e atualizar campos
  useEffect(() => {
    (async () => {
      const now = new Date();

      if (clientId != null && clientId != -1) {
        const { data, error } = await fetchById(clientId);

        if (error) return setFormError(error.message);
        if (!data || Array.isArray(data)) return;

        // Dados padrão do cliente
        now.setDate(data.feeDueDay);

        setValue('fee', data.fee);
        setValue('dueDate', now.toISOString().split('T')[0]);
      } else {
        setValue('fee', 0);
        setValue('dueDate', now.toISOString().split('T')[0]);
      }
    })();
  }, [clientId, setValue, fetchById]);

  // Quando abrir modal
  useEffect(() => {
    (async () => {
      if (!open) return;

      setFormError(null);

      const { data, error } = await fetchResume();

      if (data) {
        setClients(data);
      } else if (error) {
        setError(error.message);
      }

      prepareServices(billing);

      if (billing) {
        reset({
          id: billing.id,
          clientId: billing.client?.id ?? -1,
          fee: billing.fee,
          status: billing.status,
          dueDate: billing.dueDate,
          paidAt: billing.status === 'paid' ? billing.paidAt! : null,
        });

        setServicesBilling(billing.serviceBillings);
      } else {
        reset({
          id: null,
          clientId: -1,
          fee: 1,
          status: 'pending',
          paidAt: null,
          dueDate: new Date().toISOString().split('T')[0],
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Quanto o status do pagamento muda para pendente, reseta o valor da data
  useEffect(() => {
    if (status === 'pending') {
      setValue('paidAt', null);
    }
  }, [status, setValue]);

  // Salvar cobrança
  const saveBilling = handleSubmit(async (data) => {
    if (clientId === null || clientId === -1) return;

    data.clientId = clientId;
    data.serviceBillings = servicesBilling; // carregar serviços modificados

    const { success, error } = await save(data);
    if (!success && error) return setFormError(error.message);

    setFormError(null);
    onClose(true, null);
  });

  // Atualiza quantidade dos serviços
  const updateQuantity = (index: number, qty: number) => {
    setServicesBilling((prev) => {
      const copy = [...prev];
      copy[index].quantity = qty;
      return copy;
    });
  };

  return (
    <ModalBase isOpen={open} onClose={() => onClose(false, null)}>
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-6 text-center text-2xl font-semibold uppercase">{billing ? 'Editar Conta' : 'Cadastrar Conta'}</h2>
        <button onClick={() => onClose(false, null)} className="text-xl font-bold hover:text-red-400">
          <MdClose />
        </button>
      </div>

      {formError && <p className="mb-3 text-center text-red-400">{formError}</p>}

      {/* FORM */}
      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Cliente */}
        <div className="col-span-full">
          <label className="mb-1 block">Cliente:</label>

          {/* Busca */}
          <input
            className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none placeholder:text-black focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Lista */}
          <select
            {...register('clientId', { required: true, setValueAs: (v) => Number(v) })}
            disabled={billing != null}
            className="mt-2 max-h-48 w-full rounded-xl border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={-1}>Selecione um cliente</option>
            {filteredClients.map(({ id, name }, i) => (
              <option key={i} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* fee */}
        <div>
          <label className="mb-1 block">Valor:</label>
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

        {/* status */}
        <div>
          <label className="mb-1 block">Status:</label>
          <select {...register('status', { required: true })} className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pending">Pendente</option>
            <option value="paid">Paga</option>
          </select>
        </div>

        {/* pago em */}
        <div>
          <label className="mb-1 block">Data de Pagamento:</label>
          <input
            type="date"
            {...register('paidAt', { required: status === 'paid' })}
            disabled={status === 'pending'}
            className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* vencimento */}
        <div>
          <label className="mb-1 block">Data de Vencimento:</label>
          <input
            type="date"
            {...register('dueDate', { required: true })}
            className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SERVIÇOS */}
        <div className="col-span-full mt-2">
          <label className="mb-1 block">Serviços:</label>
          <ServicesSelector services={servicesBilling} onChange={updateQuantity} />
        </div>
      </form>

      {/* FOOTER */}
      <div className="mt-6 text-right">
        <SaveButton onClick={saveBilling} />
      </div>
    </ModalBase>
  );
}
