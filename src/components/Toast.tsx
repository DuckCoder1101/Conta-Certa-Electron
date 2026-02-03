import { useEffect, useRef } from 'react';

import { MdClose, MdError } from 'react-icons/md';
import { IoCheckmarkCircle, IoInformationCircle, IoWarning } from 'react-icons/io5';

import { IToastInfo } from '@t/Toast';

interface Props {
  info: IToastInfo;
  onClose: (id: string) => void;
}

export default function Toast({ info, onClose }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number>(0);

  // Inicializa o start
  useEffect(() => {
    startRef.current = performance.now();
  }, []);

  // Toast de progresso
  useEffect(() => {
    if (info.type !== 'progress') return;

    const progress = Math.min(1, Math.max(0, info.progress ?? 0));

    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`;
    }

    if (progress >= 1) {
      onClose(info.id!);
    }
  }, [info.progress, info.id, info.type, onClose]);

  // Toast com timer
  useEffect(() => {
    if (info.type === 'progress') return;

    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.max(0, 1 - elapsed / 5000);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      if (elapsed >= 5000) {
        onClose(info.id!);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    startRef.current = performance.now();
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [info.id, info.type, onClose]);

  // Atualiza o startRef
  useEffect(() => {
    startRef.current = performance.now();
  }, [info.id]);

  return (
    <div className="w-[220px] rounded-md border border-border bg-surface p-3 text-text-primary shadow-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-semibold">{info.title}</h2>

        <button onClick={() => onClose(info.id!)} className="text-text-muted hover:text-danger">
          <MdClose />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="text-lg">
          {info.type === 'info' && <IoInformationCircle className="text-info" />}
          {info.type === 'success' && <IoCheckmarkCircle className="text-success" />}
          {info.type === 'warning' && <IoWarning className="text-warning" />}
          {info.type === 'error' && <MdError className="text-danger" />}
        </span>

        <p className="text-text-secondary">{info.message}</p>
      </div>

      {/* Progress */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          ref={barRef}
          className="h-full origin-left bg-brand will-change-transform"
          style={{ transform: 'scaleX(1)' }}
        />
      </div>
    </div>
  );
}
