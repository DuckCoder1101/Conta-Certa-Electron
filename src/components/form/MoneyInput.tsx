import { Controller, Control } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

interface MoneyInputProps {
  control: Control;
  name: string;
  label?: string;
  className?: string;
}

export function MoneyInput({ control, name, label, className }: MoneyInputProps) {
  return (
    <div className="w-full">
      {label && <label className="mb-1 block font-semibold">{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            value={field.value}
            onValueChange={(v) => field.onChange(v.floatValue ?? 0)}
            className={className}
          />
        )}
      />
    </div>
  );
}
