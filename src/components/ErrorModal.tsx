import ModalBase from '@/components/ModalBase';

interface Props {
  error: string;
  onClose?: () => void;
}

export default function ErrorModal({ error, onClose }: Props) {
  return (
    <ModalBase isOpen={true} onClose={onClose}>
      <h2 className="mb-3 text-xl font-semibold">Erro inesperado</h2>
      <p className="mb-4 text-red-400">{error}</p>

      <div className="text-right">
        <button onClick={onClose} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Fechar
        </button>
      </div>
    </ModalBase>
  );
}
