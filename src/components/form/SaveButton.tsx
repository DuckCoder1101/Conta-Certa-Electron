import { FaSave } from 'react-icons/fa';

interface Props {
  type: 'button' | 'submit';
  onClick?: () => void;
}

export default function SaveButton({ type, onClick }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex h-min items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90"
    >
      <FaSave />
      Salvar
    </button>
  );
}
