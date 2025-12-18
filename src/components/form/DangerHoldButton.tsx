import { useRef, useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

interface Props {
  duration: number;
  onComplete: () => void;
}

export default function DangerHoldButton({ duration, onComplete }: Props) {
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);

  const animate = (time: number) => {
    if (!startTimeRef.current) return;

    const elapsed = time - startTimeRef.current;
    
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const nextProgress = easeOut(elapsed / duration) * 100;

    setProgress(nextProgress);

    if (elapsed < duration) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      onComplete();
    }
  };

  const startHold = () => {
    cancelHold();
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;
    setProgress(0);
  };

  useEffect(() => {
    return () => cancelHold();
  }, []);

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      className="relative flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-md bg-red-600 text-white transition hover:bg-red-700"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-black/20"
        style={{
          width: `${progress}%`,
        }}
      />

      <FaTrash className="relative z-10" />
    </button>
  );
}
