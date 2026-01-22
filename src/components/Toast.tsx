import { useEffect, useRef } from 'react';

import { MdClose, MdError } from 'react-icons/md';
import { IoInformationCircle, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { IToastInfo } from '@t/Toast';

interface Props {
  info: IToastInfo;
  onClose: (id: string) => void;
}

export default function Toast({ info, onClose }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    // Modo de temporizador
    if (info.type === 'progress') {
      const barProgress = Math.min(1, Math.max(0, info.progress!));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${barProgress})`;
      }

      if (barProgress >= 1) {
        onClose(info.id!);
      }
    } else {
      let rafId: number;
      const tick = (now: number) => {
        const elapsedTime = now - startRef.current;
        const barProgress = Math.max(0, 1 - elapsedTime / 5000);

        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${barProgress})`;
        }

        if (elapsedTime >= 5000) {
          onClose(info.id!);
        } else {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }
  }, [info.id, info.type, info.progress, onClose]);

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
