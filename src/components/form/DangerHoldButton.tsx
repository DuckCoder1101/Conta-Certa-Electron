import React, { useRef, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

interface Props {
  duration: number;
  onComplete: () => void;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function DangerHoldButton({ duration, onComplete }: Props) {
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const animate = (time: number) => {
    const elapsed = time - startRef.current;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${eased})`;
    }

    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const startHold = (e: React.PointerEvent) => {
    cancelHold();
    completedRef.current = false;
    startRef.current = performance.now();

    // 🔒 garante todos os eventos
    e.currentTarget.setPointerCapture(e.pointerId);

    rafRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    if (completedRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (progressRef.current) {
      progressRef.current.style.transform = 'scaleX(0)';
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      className="relative flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-md bg-danger text-white hover:opacity-90"
    >
      <div ref={progressRef} className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-black/30" />

      <FaTrash className="relative z-10" />
    </button>
  );
}
