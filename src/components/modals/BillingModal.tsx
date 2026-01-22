import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

import ModalBase from '@components/modals/ModalBase';
import SaveButton from '../form/SaveButton';

import { IBilling } from '@t/Schemas';
import { IBillingFormDTO, IClientResumeDTO } from '@t/DTOs';

import { useClients } from '@hooks/useClients';
import { useBillings } from '@hooks/useBillings';

interface Props {
  open: boolean;
  billing: IBilling | null;
  onClose: (success: boolean, error: string | null) => void;
}

export default function BillingModal({ open, billing, onClose }: Props) {
  // Tradução
  const { t } = useTranslation();

  const { fetchResumes, fetchById } = useClients();
  const { save } = useBillings();

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<IBillingFormDTO>({
    values: {
      clientId: -1,
      fee: 1,
      status: 'pending',
      paidAt: null,
      dueDate: new Date().toISOString().split('T')[0],
      serviceBillings: [],
    },
  });

  // Erro de formulário, lista de clientes e barra de busca
  const [formError, setFormError] = useState<string | null>(null);
  const [clients, setClients] = useState<IClientResumeDTO[]>([]);
  const [search, setSearch] = useState('');

  // Status e ID de cliente
  const status = watch('status');
  const clientId = watch('clientId');

  const filteredClients = clients.filter((c) => c.name.toLowerCase().startsWith(search.toLowerCase()));

  // Busca o cliente quando o ID selecionado muda
  useEffect(() => {
    (async () => {
      const now = new Date();

      if (clientId != null && clientId != -1) {
        const { data, error } = await fetchById(clientId);

        if (error) {
          return setFormError(t(error.code, error.params));
        }

        if (!data || Array.isArray(data)) return;

        now.setDate(data.feeDueDay);

        setValue('fee', data.fee);
        setValue('dueDate', now.toISOString().split('T')[0]);
      } else {
        setValue('fee', 0);
        setValue('dueDate', now.toISOString().split('T')[0]);
      }
    })();
  }, [clientId, setValue, fetchById, t]);

  // Preenche ou limpa os campos do formulário
  useEffect(() => {
    if (!open) return;
    (async () => {
      setFormError(null);

      const { data } = await fetchResumes();
      if (!data) return;

      setClients(data);

      if (billing) {
        reset({
          id: billing.id,
          clientId: billing.client?.id ?? -1,
          fee: billing.fee,
          status: billing.status,
          dueDate: billing.dueDate,
          paidAt: billing.status === 'paid' ? billing.paidAt! : null,
        });
      } else {
        reset({
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

  // Limpa a data de pagamento para status pendente
  useEffect(() => {
    if (status === 'pending') {
      setValue('paidAt', null);
    }
  }, [status, setValue]);

  // Salva o faturamento
  const saveBilling = handleSubmit(async (data) => {
    if (clientId === null || clientId === -1) return;

    data.clientId = clientId;
    const { error } = await save(data);

    if (error && error.status != 500) {
      return setFormError(t(error.code, error.params));
    }

    setFormError(null);
    onClose(true, null);
  });

  return (
    <ModalBase
      title={t(billing ? 'billing.modal.edit-billing' : 'billing.modal.new-billing')}
      isOpen={open}
      onClose={() => onClose(false, null)}
    >
      {formError && <p className="mb-3 text-center text-danger">{formError}</p>}

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
            {filteredClients.map(({ id, name }) => (
              <option key={id} value={id}>
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
        </div>

        <div className="col-span-full flex items-center justify-center">
          <SaveButton type="submit" />
        </div>
      </form>
    </ModalBase>
  );
}
