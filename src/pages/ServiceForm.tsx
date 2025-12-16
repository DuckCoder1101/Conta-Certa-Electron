import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IServiceFormDTO } from '@t/dtos';
import { NumericFormat } from 'react-number-format';

import AppLayout from '@/components/AppLayout';
import SaveButton from '@components/SaveButton';

import { useServices } from '@/hooks/useServices';
import { useTranslation } from 'react-i18next';

export default function ServiceForm() {
  // Traduções
  const { t } = useTranslation();

  const { save } = useServices();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<IServiceFormDTO>({
    defaultValues: {
      name: '',
      value: 1,
    },
  });

  const saveService = handleSubmit(async (data) => {
    data.name = data.name.trim();

    const { error } = await save(data);
    if (error && error.status === 400) {
      return setFormError(error.message);
    }

    setFormError(null);
    reset();
  });

  return (
    <AppLayout>
      <h2 className="col-span-full mb-6 text-center text-2xl font-semibold">{t('services.form.title')}</h2>
      <form className="mx-auto grid max-h-full grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {formError && <p className="col-span-full mb-2 text-center text-sm font-semibold text-red-400">{formError}</p>}

        {/* Nome */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('services.form.name')}</label>
          <input className="w-full rounded-lg border border-sidebar-border bg-light-input p-2 text-black outline-none focus:ring-2 focus:ring-blue-500" {...register('name', { required: true })} />
        </div>

        {/* Valor */}
        <div>
          <label className="mb-1 block text-sm font-semibold">{t('services.form.value')}</label>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix={t('global.money-prefix')}
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

        <div className="col-span-full flex justify-center md:justify-end items-center">
          <SaveButton onClick={saveService} />
        </div>
      </form>
    </AppLayout>
  );
}
