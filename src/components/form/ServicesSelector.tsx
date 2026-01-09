import { IServiceBillingFormDTO } from '@/@types/dtos';
import { FaPlus } from 'react-icons/fa6';

interface Props {
  services: IServiceBillingFormDTO[];
  onChange: (index: number, qty: number) => void;
  className?: string;
}

export function ServicesSelector({ services, onChange, className }: Props) {
  return (
    <ul className={`flex flex-col gap-2 md:overflow-y-auto ${className}`}>
      {services.map((s, index) => (
        <li key={s.serviceOriginId} className="bg-sidebar-hover flex items-center justify-between rounded p-2">
          <div>
            <p className="font-medium text-text-primary">{s.name}</p>
            <p className="text-xs text-text-primary opacity-60">R$ {s.value.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange(index, Math.max(0, s.quantity - 1))}
              className="bg-sidebar-hover2 hover:bg-sidebar-bg rounded px-2 py-1"
            >
              -
            </button>

            <input
              type="number"
              min={0}
              className="bg-sidebar-hover2 w-16 rounded p-1 text-center outline-none"
              value={s.quantity}
              onChange={(e) => onChange(index, Number(e.target.value))}
            />

            <button type="button" onClick={() => onChange(index, s.quantity + 1)} className="bg-sidebar-hover2 hover:bg-sidebar-bg rounded px-2 py-1">
              <FaPlus />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
