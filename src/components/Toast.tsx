import { useEffect } from 'react';
import { MdClose, MdError } from 'react-icons/md';
import { IoInformationCircle, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';

interface Props {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: (id: string) => void;
}

export default function Toast({ id, title, message, type, onClose }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timeout);
  }, [id, onClose]);

  return (
    <div className="w-[220px] rounded-md border border-border bg-surface p-3 text-text-primary shadow-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>

        <button onClick={() => onClose(id)} className="text-text-muted hover:text-danger">
          <MdClose />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="text-lg">
          {type === 'info' && <IoInformationCircle className="text-info" />}
          {type === 'success' && <IoCheckmarkCircle className="text-success" />}
          {type === 'warning' && <IoWarning className="text-warning" />}
          {type === 'error' && <MdError className="text-danger" />}
        </span>

        <p className="text-text-secondary">{message}</p>
      </div>

      {/* Progress */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className="animate-toast-progress h-full bg-brand" />
      </div>
    </div>
  );
}
