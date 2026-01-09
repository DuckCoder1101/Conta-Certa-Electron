import React, { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalBase({ isOpen, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Abrir/Fechar modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Fechar ao clicar fora
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const closeOnBackdrop = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isOutside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

      if (isOutside) onClose?.();
    };

    const close = () => {
      onClose?.();
    };

    dialog.addEventListener('click', closeOnBackdrop);
    dialog.addEventListener('cancel', close); // ESC

    return () => {
      dialog.removeEventListener('click', closeOnBackdrop);
      dialog.removeEventListener('cancel', close);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl border-0 bg-surface-muted p-6 text-text-primary shadow-xl backdrop:backdrop-blur-sm open:animate-fadeIn"
    >
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-center text-2xl font-semibold">{title}</h2>
          <button onClick={() => onClose?.()} className="text-xl font-bold hover:text-danger">
            <MdClose />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
