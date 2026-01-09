import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

import { IBillingFormDTO, IClientResumeDTO, IServiceBillingFormDTO } from '@t/dtos';

import { ServicesSelector } from '@components/form/ServicesSelector';

import { useClients } from '@hooks/useClients';
import { useBillings } from '@hooks/useBillings';
import AppLayout from '@/components/AppLayout';
import SaveButton from '@/components/form/SaveButton';

export default function BillingForm() {
  // Traduções
  const { t } = useTranslation();

  const { fetchResumes, fetchById } = useClients();
  const { prepareServices, save } = useBillings();

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

        if (error) {
          return setFormError(t(error.code, error.params));
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  // Quando abrir modal
  useEffect(() => {
    (async () => {
      if (!open) return;

      setFormError(null);
      const { data } = await fetchResumes();

      if (data) {
        setClients(data);
      }

      setServicesBilling(await prepareServices(null));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quanto o status do pagamento muda para pendente, limpa o valor da data
  useEffect(() => {
    if (status === 'pending') {
      setValue('paidAt', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Salvar cobrança
  const saveBilling = handleSubmit(async (data) => {
    if (clientId === null || clientId === -1) return;

    data.clientId = clientId;
    data.serviceBillings = servicesBilling; // carregar serviços modificados

    const { success, error } = await save(data);

    if (!success && error?.status == 400) {
      return setFormError(t(error.code, error.params));
    }
    reset();
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
    <AppLayout>
      <h2 className="col-span-full text-center text-2xl font-semibold">{t('billing.form.title')}</h2>
      <form className="mx-auto grid max-h-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2" onSubmit={saveBilling}>
        {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold">{formError}</p>}

        {/* Cliente */}
        <div className="col-span-full">
          <label className="mb-1 block">{t('billing.form.client.label')}</label>

          {/* Busca */}
          <input
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none placeholder:text-text-primary focus:ring-2 focus:ring-brand"
            placeholder={t('billing.form.client.search-placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Lista */}
          <select
            {...register('clientId', { required: true, setValueAs: (v) => Number(v) })}
            className="mt-2 max-h-48 w-full rounded-xl border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
          >
            <option value={-1}>{t('billing.form.client.default-option')}</option>
            {filteredClients.map(({ id, name }, i) => (
              <option key={i} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* fee */}
        <div>
          <label className="mb-1 block">{t('billing.form.fee.label')}</label>
          <Controller
            name="fee"
            control={control}
            render={({ field }) => (
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix={t('global.money-prefix')}
                title={t('billing.form.fee.tip')}
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                value={field.value}
                onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
              />
            )}
          />
        </div>

        {/* status */}
        <div>
          <label className="mb-1 block">{t('billing.form.status.label')}</label>
          <select
            title={t('billing.form.status.tip')}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('status', { required: true })}
          >
            <option value="pending">{t('billing.status.pending')}</option>
            <option value="paid">{t('billing.status.paid')}</option>
          </select>
        </div>

        {/* pago em */}
        <div>
          <label className="mb-1 block">{t('billing.form.paidAt.label')}</label>
          <input
            title={t('billing.form.paidAt.tip')}
            type="date"
            disabled={status === 'pending'}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('paidAt', { required: status === 'paid' })}
          />
        </div>

        {/* vencimento */}
        <div>
          <label className="mb-1 block">{t('billing.form.feeDueDate.label')}</label>
          <input
            title={t('billing.form.feeDueDate.tip')}
            type="date"
            {...register('dueDate', { required: true })}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* SERVIÇOS */}
        <div className="col-span-full">
          <label className="mb-1 block">{t('billing.form.services.label')}</label>
          <ServicesSelector services={servicesBilling} onChange={updateQuantity} className="md:max-h-[250px]" />
        </div>

        <div className="col-span-full flex items-center justify-center">
          <SaveButton type="submit" />
        </div>
      </form>
    </AppLayout>
  );
}
