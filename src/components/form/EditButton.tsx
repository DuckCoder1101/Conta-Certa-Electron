import { FaPencil } from 'react-icons/fa6';

interface Props {
  onClick: () => void;
}

export default function EditButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-md bg-brand text-white hover:opacity-90"
    >
      <FaPencil size={12} />
    </button>
  );
}
