import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ModalBase from '@/components/ModalBase';
import { IAppResponseDTO, IBilling, IBillingFormDTO, IClient, IClientResumeDTO, IService, IServiceBillingFormDTO } from '@t/dtos';

import { MdClose } from 'react-icons/md';

interface Props {
  open: boolean;
  billing: IBilling | null;
  onClose: (success: boolean, errorMessage: string | null) => void;
}

export default function BillingModal({ open, billing, onClose }: Props) {
  const [formError, setFormError] = useState<string | null>(null);

  const [clients, setClients] = useState<IClientResumeDTO[]>([]);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset, setValue, watch } = useForm<IBillingFormDTO>({
    values: {
      id: null,
      clientId: -1,
      fee: 1,
      status: 'pending',
      paidAt: null,
      dueDate: new Date().toLocaleDateString(),
      serviceBillings: [],
    },
  });

  const status = watch('status');
  const clientId = watch('clientId');
  const [servicesBilling, setServicesBilling] = useState<IServiceBillingFormDTO[]>([]);

  const filteredClients = clients.filter((c) => c.name.toLowerCase().startsWith(search.toLowerCase()));

  // Fetch resumido de clientes
  const fetchClientResumes = async () => {
    setValue('clientId', -1);

    const { data, error } = (await window.api.invoke('fetch-clients-resume')) as IAppResponseDTO<IClientResumeDTO>;

    if (error) return setFormError(error.message);
    if (data && Array.isArray(data)) setClients(data);
  };

  // Buscar cliente completo e atualizar campos
  useEffect(() => {
    (async () => {
      const now = new Date();

      if (clientId != null && clientId != -1) {
        const { data, error } = (await window.api.invoke('fetch-client-by-id', clientId)) as IAppResponseDTO<IClient>;

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
  }, [clientId, setValue]);

  // Fetch dos serviços + merge com billing (se editando)
  const prepareServices = async (billing: IBilling | null) => {
    const { data, error } = (await window.api.invoke('fetch-services')) as IAppResponseDTO<IService>;

    if (error) return setFormError(error.message);
    if (!Array.isArray(data)) return;

    const allServices = data ?? [];
    const result: IServiceBillingFormDTO[] = [];

    if (billing) {
      // serviços já existentes no billing
      billing.serviceBillings.forEach((s) =>
        result.push({
          id: s.id,
          name: s.name,
          value: s.value,
          quantity: s.quantity,
          serviceOriginId: s.serviceOriginId,
        }),
      );

      // serviços novos (ainda não incluídos)
      allServices.forEach((s) => {
        const exists = result.some((x) => x.serviceOriginId === s.id);
        if (!exists) {
          result.push({
            id: null,
            name: s.name,
            value: s.value,
            quantity: 0,
            serviceOriginId: s.id,
          });
        }
      });
    } else {
      // criação nova → todas quantidades 0
      allServices.forEach((s) =>
        result.push({
          id: null,
          name: s.name,
          value: s.value,
          quantity: 0,
          serviceOriginId: s.id,
        }),
      );
    }

    setServicesBilling(result);
  };

  // Quando abrir modal
  useEffect(() => {
    (async () => {
      if (!open) return;

      setFormError(null);

      await fetchClientResumes();
      prepareServices(billing);

      if (billing) {
        reset({
          id: billing.id,
          clientId: billing.client.id,
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
    if (status === "pending") {
      setValue("paidAt", null);
    }
  }, [status, setValue]);

  // Salvar cobrança
  const saveBilling = handleSubmit(async (data) => {
    if (!clientId) return;

    data.clientId = clientId;
    data.serviceBillings = servicesBilling; // carregar serviços modificados

    const { success, error } = (await window.api.invoke('save-billing', data)) as IAppResponseDTO<IBilling>;

    if (!success && error) return setFormError(error.message);

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
        <h2 className="text-xl font-semibold uppercase">{billing ? 'Editar Conta' : 'Cadastrar Conta'}</h2>
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
          <input className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {/* Lista */}
          <select {...register('clientId', { required: true, setValueAs: (v) => Number(v) })} className="mt-2 max-h-48 w-full overflow-auto rounded bg-sidebar-hover p-2 outline-none">
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
          <input type="number" step={0.01} min={1} {...register('fee', { required: true })} className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" />
        </div>

        {/* status */}
        <div>
          <label className="mb-1 block">Status:</label>
          <select {...register('status', { required: true })} className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none">
            <option value="pending">Pendente</option>
            <option value="paid">Paga</option>
          </select>
        </div>

        {/* pago em */}
        <div>
          <label className="mb-1 block">Data de Pagamento:</label>
          <input type="date" {...register('paidAt', { required: status === 'paid' })} disabled={status === 'pending'} className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" />
        </div>

        {/* vencimento */}
        <div>
          <label className="mb-1 block">Data de Vencimento:</label>
          <input type="date" {...register('dueDate', { required: true })} className="w-full rounded bg-sidebar-hover p-2 text-sidebar-text outline-none" />
        </div>

        {/* SERVIÇOS */}
        <div className="col-span-full mt-2">
          <label className="mb-1 block">Serviços:</label>

          <ul className="flex flex-col gap-2">
            {servicesBilling.map((s, index) => (
              <li key={s.serviceOriginId} className="flex items-center justify-between rounded bg-sidebar-hover p-2">
                <div>
                  <p className="font-medium text-sidebar-text">{s.name}</p>
                  <p className="text-xs text-sidebar-text opacity-60">R$ {s.value.toFixed(2)}</p>
                </div>

                {/* CONTROLES DE QUANTIDADE */}
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded bg-sidebar-hover2 px-2 py-1 text-sidebar-text hover:bg-sidebar-bg" onClick={() => updateQuantity(index, Math.max(0, s.quantity - 1))}>
                    -
                  </button>

                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded bg-sidebar-hover2 p-1 text-center text-sidebar-text outline-none"
                    value={s.quantity}
                    onChange={(e) => updateQuantity(index, Number(e.target.value))}
                  />

                  <button type="button" className="rounded bg-sidebar-hover2 px-2 py-1 text-sidebar-text hover:bg-sidebar-bg" onClick={() => updateQuantity(index, s.quantity + 1)}>
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </form>

      {/* FOOTER */}
      <div className="mt-6 text-right">
        <button onClick={saveBilling} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Salvar Conta
        </button>
      </div>
    </ModalBase>
  );
}
