import { useRef, useState } from 'react';

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
			className='btn btn-danger position-relative overflow-hidden'
			onMouseDown={startHold}
			onMouseUp={cancelHold}
			onMouseLeave={cancelHold}>
				
			{/* background de progresso */}
			<div
				className='position-absolute top-0 start-0 h-100'
				style={{
					width: `${progress}%`,
					backgroundColor: 'rgba(0,0,0,0.25)', // overlay mais escuro
					pointerEvents: 'none',
					transition: 'width 50ms linear',
				}}></div>

			{/* ícone ou texto */}
			<i className='bi bi-trash-fill position-relative'></i>
		</button>
	);
}
