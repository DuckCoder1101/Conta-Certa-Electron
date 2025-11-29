import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
	Billing,
	BillingFormDTO,
	FetchDataDTO,
	Service,
	ClientResumeDTO,
	ServiceBillingFormDTO,
	SaveDataResponseDTO,
} from '@t/dtos';
import Sidebar from '@components/navbar/Navbar';
import ErrorModal from '@/components/errorModal/ErrorModal';

export default function BillsList() {
	const dateFormmat = new Intl.DateTimeFormat('pt-BR', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
	});

	// Erros
	const [error, setError] = useState<string | null>(null);

	// Faturamentos, servicos e clientes
	const [billings, setBillings] = useState<Billing[]>([]);
	const [servicesBilling, setServicesBilling] = useState<ServiceBillingFormDTO[]>([]);
	const [clients, setClients] = useState<ClientResumeDTO[]>([]);

	// Titulo do modal de registro
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

	// Modal
	const modalRef = useRef<HTMLDivElement | null>(null);
	const modalInstance = useRef<bootstrap.Modal | null>(null);

	// Form e gatilhos
	const { register, handleSubmit, reset, control } = useForm<BillingFormDTO>();
	const status = useWatch({ control, name: 'status' });

	// Busca os faturamentos
	const fetchBillings = async () => {
		console.log('Fetching billings.');

		const { data, error } = (await window.api.invoke(
			'fetch-billings-full'
		)) as FetchDataDTO<Billing>;

		if (!data) {
			return setError(error);
		}

		setBillings(data);
	};

	// Busca os servicos
	const fetchServices = async () => {
		console.log('Fetching services.');

		const { data, error } = (await window.api.invoke('fetch-services')) as FetchDataDTO<Service>;

		if (!data) {
			return setError(error);
		}

		return data;
	};

	// Busca os clientes-resumo
	const fetchClients = async () => {
		console.log('Fetching clients.');

		const { data, error } = (await window.api.invoke(
			'fetch-clients-resume'
		)) as FetchDataDTO<ClientResumeDTO>;

		if (!data) {
			return setError(error);
		}

		setClients(data);
	};

	// Prepara todos a lista de servicos para o modal
	const prepareBillingServices = async (billing: Billing | null) => {
		const services = (await fetchServices()) ?? [];
		const newServicesBilling: ServiceBillingFormDTO[] = [];

		// Adiciona os servicos do faturamento atual
		if (billing) {
			for (const { id, name, value, quantity, serviceOriginId } of billing.serviceBillings) {
				newServicesBilling.push({
					id,
					name,
					value,
					quantity,
					serviceOriginId,
				});
			}
		}

		// Adiciona o restante dos serviços
		for (const { id, name, value } of services) {
			newServicesBilling.push({
				id: null,
				name,
				quantity: 0,
				serviceOriginId: id,
				value,
			});
		}

		setServicesBilling(newServicesBilling);
	};

	// Inicia o modal e requisita os faturamentos
	useEffect(() => {
		fetchBillings();
		if (!modalRef.current) return;

        const modalEl = modalRef.current;
        modalInstance.current = new window.bootstrap.Modal(modalRef.current);
        
        const HandleHidden = () => {
            setClients([]);
            setServicesBilling([]);
        };

        modalEl.addEventListener("hidden.bs.modal", HandleHidden);

        return () => {
            modalEl.removeEventListener("hidden.bs.modal", HandleHidden);
        };
	}, []);

	// Abre modal de registro/edicao
	const OpenBillingModal = async (billing: Billing | null = null) => {
		if (!modalInstance.current) return;

		await Promise.all([await prepareBillingServices(billing), await fetchClients()]);

		if (billing) {
			setModalMode('edit');
			reset(billing);
		} else {
			setModalMode('create');
			reset({
				clientId: -1,
				fee: 1,
				status: 'pending',
				dueDate: new Date(),
				paidAt: null,
				serviceBillings: [],
			});
		}
	};

	// Salva o faturamento
	const SaveBilling = handleSubmit(async (data) => {
		const { success, error } = (await window.api.invoke(
			'save-billing',
			data
		)) as SaveDataResponseDTO;

		if (!success) {
			return setError(error);
		}

		fetchBillings();
		modalInstance.current?.hide();
	});

	return (
		<div className='d-flex m-0 p-0 min-vh-1j00'>
			{/* MODAL DE ERROS GERAIS */}
			{error && <ErrorModal error={error} onClose={() => setError(null)} />}

			{/* MODAL DE CADASTRO / ALTERACAO */}
			<div className='modal fade' ref={modalRef} id='client-modal' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h2 className='modal-title fs-5'>
								{modalMode === 'create' ? 'Cadastrar cobrança' : 'Editar cobrança'}
							</h2>
							<button className='btn-close' data-bs-dismiss='modal'></button>
						</div>

						<div className='modal-body'>
							<form className='row g-3'>
								{/* Cliente */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Cliente:</label>
									<select {...register('clientId', { required: true })} required>
										<option value={-1} selected disabled>
											Selecione um cliente
										</option>

										{clients.map((c) => (
											<option value={c.id}>{c.name}</option>
										))}
									</select>
								</div>

								{/* Valor */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Valor:</label>
									<input
										type='number'
										step={0.01}
										min={1}
										{...register('fee', { required: true })}
										required
									/>
								</div>

								{/* Status */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Status:</label>
									<select {...register('status', { required: true })} required>
										<option value='pending' selected>
											Pendente
										</option>
										<option value='paid'>Paga</option>
									</select>
								</div>

								{/* Data pagamento */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Data de pagamento:</label>
									<input
										type='date'
										disabled={status === 'pending'}
										{...register('paidAt')}
										required={status === 'paid'}
									/>
								</div>

								{/* Data vencimento */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Data de vencimento:</label>
									<input type='date' {...register('dueDate', { required: true })} required />
								</div>

								{/* Servicos extras */}
								<div className='col-12 col-md-12'>
									<label className='form-label'>Serviços extras:</label>
									<ul className='d-flex flex-column'>
										{servicesBilling.map((s, i) => (
											<li className='d-flex justify-content-between' key={i}>
												<strong>{s.name}</strong>
												<input
													type='number'
													className='form-control mt-1'
													key={i}
													onChange={(ev) => (s.quantity = parseInt(ev.target.value, 10))}
												/>
											</li>
										))}
									</ul>
								</div>
							</form>
						</div>

						<div className='modal-footer'>
							<button className='btn btn-primary' onClick={SaveBilling}>
								Salvar Cobrança
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* BARRA DE NAVEGAÇÃO */}
			<Sidebar />

			{/* LISTA */}
			<div className='flex-grow-1 bg-body-secondary p-4'>
				<h2 className='text-center'>SEUS CLIENTES</h2>

				<form>
					<div className='input-group mt-5'>
						<i className='input-group-text bi bi-search'></i>
						<input type='search' className='form-control' placeholder='Buscar cliente...' />

						<button type='button' className='btn btn-primary' onClick={() => OpenBillingModal()}>
							<i className='bi bi-plus-lg'></i>
						</button>
					</div>
				</form>

				<table className='table table-striped shadow-sm mt-2'>
					<thead>
						<tr className='text-center'>
							<th scope='col'>Cliente</th>
							<th scope='col'>Valor</th>
							<th scope='col'>Status</th>
							<th scope='col'>Data de pagamento</th>
							<th scope='col'>Data de vencimento</th>
							<th scope='col'>Ações</th>
						</tr>
					</thead>
					<tbody>
						{billings.map((billing, i) => (
							<tr key={i}>
								<th scope='row'>{billing.client.name}</th>
								<td>{billing.fee}</td>
								<td>{billing.status === 'paid' ? 'PAGO' : 'PENDENTE'}</td>
								<td>{billing.paidAt ? dateFormmat.format(billing.paidAt) : ''}</td>
								<td>{dateFormmat.format(billing.dueDate)}</td>
								<td className='d-flex justify-content-center gap-2'>
									<button className='btn btn-secondary' onClick={() => OpenBillingModal(billing)}>
										<i className='bi bi-pencil-fill' />
									</button>

									<button className='btn btn-danger'>
										<i className='bi bi-trash-fill' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
