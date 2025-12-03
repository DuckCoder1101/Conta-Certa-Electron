import { IServiceBillingFormDTO } from '@/@types/dtos';
import { FaPlus } from 'react-icons/fa6';

interface Props {
  services: IServiceBillingFormDTO[];
  onChange: (index: number, qty: number) => void;
}

export function ServicesSelector({ services, onChange }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {services.map((s, index) => (
        <li key={s.serviceOriginId} className="flex items-center justify-between rounded bg-sidebar-hover p-2">
          <div>
            <p className="font-medium text-sidebar-text">{s.name}</p>
            <p className="text-xs text-sidebar-text opacity-60">R$ {s.value.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onChange(index, Math.max(0, s.quantity - 1))} className="rounded bg-sidebar-hover2 px-2 py-1 hover:bg-sidebar-bg">
              -
            </button>

            <input type="number" min={0} className="w-16 rounded bg-sidebar-hover2 p-1 text-center outline-none" value={s.quantity} onChange={(e) => onChange(index, Number(e.target.value))} />

            <button type="button" onClick={() => onChange(index, s.quantity + 1)} className="rounded bg-sidebar-hover2 px-2 py-1 hover:bg-sidebar-bg">
              <FaPlus />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
