import { useRef, useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

interface Props {
  seconds: number;
  onComplete: () => void;
}

export default function DangerHoldButton({ seconds = 3, onComplete }: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);

  const startHold = () => {
    let progress = 0;
    const step = 100 / (seconds * 20);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      progress += step;
      setProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalRef.current!);
        onComplete();
      }
    }, 50);
  };

  const cancelHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  // limpeza em caso de desmontagem
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
          transition: 'width 50ms linear',
        }}
      ></div>

      <FaTrash className="relative z-10" />
    </button>
  );
}
