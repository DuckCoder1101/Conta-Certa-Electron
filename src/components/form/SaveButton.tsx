import { FaSave } from 'react-icons/fa';

interface Props {
  onClick: () => void;
}

export default function SaveButton({ onClick }: Props) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 h-min">
      <FaSave />
      Salvar
    </button>
  );
}