import { useEffect, useRef } from 'react';

interface ErrorModalProps {
	error: string;
	onClose?: () => void;
}

export default function ErrorModal({ error, onClose }: ErrorModalProps) {
	const modalRef = useRef<HTMLDivElement | null>(null);

	const modalInstance = useRef<bootstrap.Modal | null>(null);
	const otherModalInstance = useRef<bootstrap.Modal | null>(null);

	const HandleCloseModal = () => {
		modalInstance.current?.hide();
		otherModalInstance.current?.show();
		onClose?.();
	};

	useEffect(() => {
		if (!modalRef.current) return;

		const el = modalRef.current;

		// Encontrar modal aberto
		const openModalEl = document.querySelector('.modal.show') as HTMLElement | null;

		if (openModalEl) {
			otherModalInstance.current = window.bootstrap.Modal.getOrCreateInstance(openModalEl);
			otherModalInstance.current.hide();
		}

		// Instanciar modal atual
		modalInstance.current = window.bootstrap.Modal.getOrCreateInstance(el);
		modalInstance.current.show();

		// Listener de closed
		const handleHidden = () => {
			otherModalInstance.current?.show();
		};

		el.addEventListener('hidden.bs.modal', handleHidden);

		return () => {
			el.removeEventListener('hidden.bs.modal', handleHidden);
		};
	}, []);

	return (
		<div className='modal fade' tabIndex={-1} ref={modalRef} style={{ zIndex: 2000 }}>
			<div className='modal-dialog modal-dialog-centered'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h2 className='modal-title fs-5'>Erro inesperado</h2>
						<button className='btn-close' onClick={HandleCloseModal}></button>
					</div>
					<div className='modal-body'>
						<p>{error}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
