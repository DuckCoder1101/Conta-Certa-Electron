import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IService, IServiceFormDTO } from '@t/dtos';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

import ModalBase from '@modals/ModalBase';
import SaveButton from '../form/SaveButton';

import { useServices } from '@hooks/useServices';

interface Props {
  open: boolean;
  client: IService | null;
  onClose: (success: boolean) => void;
}

export default function ServiceModal({ open, onClose, client: service }: Props) {
  // Tradução
  const { t } = useTranslation();

  const { save } = useServices();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<IServiceFormDTO>({
    defaultValues: {
      name: '',
      value: 1,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      service || {
        name: '',
        value: 1,
      },
    );
    setFormError(null);
  }, [open, service, reset]);

  const saveService = handleSubmit(async (data) => {
    data.name = data.name.trim();

    const { success, error } = await save(data);
    if (error && error.status === 400) {
      return setFormError(t(error.code, error.params));
    }

    setFormError(null);
    onClose(success);
  });

  return (
    <ModalBase title={t(service ? 'services.modal.edit-service' : 'services.modal.new-service')} isOpen={open} onClose={() => onClose(false)}>
      {/* Form */}
      <form className="mx-auto grid max-h-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2" onSubmit={saveService}>
        {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold text-danger">{formError}</p>}

        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('services.form.name.label')}</label>
          <input
            title={t('services.form.name.tip')}
            className="w-full rounded-lg border border-border bg-input p-2 text-text-primary outline-none focus:ring-2 focus:ring-brand"
            {...register('name', { required: true })}
          />
        </div>

        {/* Valor */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('services.form.value.label')}</label>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <NumericFormat
                title={t('services.form.value.tip')}
                thousandSeparator="."
                decimalSeparator=","
                prefix={t('global.money-prefix')}
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

        <div className="col-span-full flex items-center justify-center md:justify-end">
          <SaveButton type="submit" />
        </div>
      </form>
    </ModalBase>
  );
}
