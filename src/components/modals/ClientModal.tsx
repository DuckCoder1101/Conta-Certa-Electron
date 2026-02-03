import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

import ModalBase from '@/components/modals/ModalBase';
import SaveButton from '../form/SaveButton';

import { useClients } from '@hooks/useClients';

import { Client } from '@shared/Types';
import { ClientFormDTO } from '@shared/DTOs';

interface Props {
  open: boolean;
  client: Client | null;
  onClose: (success: boolean) => void;
}

export default function ClientModal({ open, onClose, client }: Props) {
  // Tradução
  const { t } = useTranslation();

  const { save } = useClients();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<ClientFormDTO>({
    defaultValues: {
      document: '',
      name: '',
      email: '',
      phone: '',
      fee: 1,
      feeDueDay: 1,
    },
  });

  useEffect(() => {
    if (!open) return;

    reset(
      client || {
        document: '',
        name: '',
        email: '',
        phone: '',
        fee: 1,
        feeDueDay: 1,
      },
    );
    setFormError(null);
  }, [open, client, reset]);

  const saveClient = handleSubmit(async (data) => {
    data.name = data.name.trim();
    data.email = data.email?.trim() || null;

    data.document = data.document.match(/\d/g)?.join('') ?? '';
    data.phone = data.phone?.match(/\d/g)?.join('') ?? '';

    const { success, error } = await save(data);

    if (error && error.status === 400) {
      return setFormError(t(error.code, error.params));
    }

    setFormError(null);
    onClose(success);
  });

  return (
    <ModalBase
      title={t(client ? 'client.modal.edit-client' : 'client.modal.new-client')}
      isOpen={open}
      onClose={() => onClose(false)}
    >
      {/* Form */}
      <form className="mx-auto grid max-h-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2" onSubmit={saveClient}>
        {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold text-danger">{formError}</p>}

        {/* Documento */}

        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('client.form.name.label')}</label>
          <input
            title={t('client.form.name.tip')}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('name', { required: true })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('client.form.email.label')}</label>
          <input
            title={t('client.form.email.tip')}
            type="email"
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('email')}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('client.form.phone.label')}</label>
          <input
            type={'tel'}
            title={t('client.form.fee.tip')}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('phone', { required: true })}
          />
        </div>

        {/* Honorário */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('client.form.fee.label')}</label>
          <Controller
            name="fee"
            control={control}
            render={({ field }) => (
              <NumericFormat
                title={t('client.form.fee.tip')}
                thousandSeparator="."
                decimalSeparator=","
                prefix={t('global.currency-prefix')}
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

        {/* Vencimento */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('client.form.dueDate.label')}</label>
          <input
            title={t('client.form.dueDate.tip')}
            type="number"
            min={1}
            max={31}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('feeDueDay', { required: true, valueAsNumber: true })}
          />
        </div>

        {/* Botão */}
        <div className="col-span-full flex items-center justify-center md:justify-end">
          <SaveButton type="submit" />
        </div>
      </form>
    </ModalBase>
  );
}
