import { useRef, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface Props {
  seconds: number;
  onComplete: () => void;
}

export default function DangerHoldButton({ seconds = 3, onComplete }: Props) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);

  const startHold = () => {
    let p = 0;
    const step = 100 / (seconds * 20); // 20 updates por segundo

    intervalRef.current = setInterval(() => {
      p += step;
      setProgress(p);

      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current!);
        onComplete();
      }
    }, 50);
  };

  const cancelHold = () => {
    clearInterval(intervalRef.current!);
    setProgress(0);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      className="relative flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-md bg-red-600 text-white transition hover:bg-red-700"
    >
      {/* Progresso */}
      <div
        className="pointer-events-none absolute inset-0 bg-black/20"
        style={{
          width: `${progress}%`,
          transition: 'width 50ms linear',
        }}
      ></div>

      {/* Ícone */}
      <FaTrash className="relative z-10" />
    </button>
  );
}
