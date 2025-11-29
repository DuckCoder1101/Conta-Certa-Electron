import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';

import { Client, ClientFormDTO, FetchDataDTO, SaveDataResponseDTO } from '@t/dtos';
import { formatCnpj, formatCpf, formatPhone } from '@utils/Formatters';
import Sidebar from '@components/navbar/Navbar';
import ErrorModal from '@/components/errorModal/ErrorModal';
import DangerHoldButton from '@/components/dangerHoldButton/DangerHoldButton';

export default function ClientsList() {
	// Erros
	const [error, setError] = useState<string | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	// Clientes
	const [clients, setClients] = useState<Client[]>([]);
	const [editingClientId, setEditingClientId] = useState<number | undefined>();

	// Paginação
	const isLoading = useRef<boolean>(false);
	const [offset, setOffset] = useState(0);
	const limit = 30;

	// Titulo do modal de registro
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

	// Modal
	const modalRef = useRef<HTMLDivElement | null>(null);
	const modalInstance = useRef<bootstrap.Modal | null>(null);

	// useForm
	const { register, handleSubmit, reset, control } = useForm<ClientFormDTO>({
		defaultValues: {
			cpf: '',
			cnpj: '',
			name: '',
			email: '',
			phone: '',
			fee: 1,
			feeDueDay: 1,
		},
	});

	// Carrega os clientes
	const loadClients = async (newOffset: number) => {
		if (isLoading.current) return;
		isLoading.current = true;

		const { data, error } = (await window.api.invoke(
			'load-clients',
			offset,
			limit
		)) as FetchDataDTO<Client>;

		if (data) {
			setClients(data);
			setOffset(newOffset);
		} else if (error) {
			setError(error);
		}

		isLoading.current = false;
	};

	// Atualiza a lista sempre que o scroll mudar
	const handleScroll = async (e: React.UIEvent) => {
		const el = e.currentTarget;

		const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
		const atTop = el.scrollTop < 50;

		if (atBottom) {
			loadClients(offset + limit);
		} else if (atTop && offset > 0) {
			loadClients(Math.max(offset - limit, 0));
		}
	};

	// Inicia o modal e requisita os clientes
	useEffect(() => {
		loadClients(offset);

		if (modalRef.current) {
			modalInstance.current = new window.bootstrap.Modal(modalRef.current);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Abrir modal de cadastro
	const OpenClientModal = (client: Client | null = null) => {
		if (!modalInstance.current) return;

		if (client) {
			setEditingClientId(client.id);
			setModalMode('edit');
			reset(client);
		} else {
			setEditingClientId(undefined);
			setModalMode('create');
			reset({
				cpf: '',
				cnpj: '',
				name: '',
				email: '',
				phone: '',
				fee: 1,
				feeDueDay: 1,
			});
		}

		modalInstance.current.show();
	};

	// Salvar cliente
	const SaveClient = handleSubmit(async (data) => {
		// Restrições e filtros
		data.name = data.name.trim();
		data.email = data.email.trim();
		data.cpf = data.cpf.match(/\d/g)?.join('') ?? '';
		data.cnpj = data.cnpj.match(/\d/g)?.join('') ?? '';
		data.phone = data.phone.match(/\d/g)?.join('') ?? '';

		// Verifica se existe CPF ou CNPJ
		if (data.cpf.length == 0 && data.cnpj.length == 0) {
			return setFormError('O Cliente deve possuir ao menos um CPF ou CNPJ válidos!');
		}

		// Verifica o CPF
		if (data.cpf.length > 0 && data.cpf.length != 11) {
			return setFormError('CPF inválido!');
		}

		// Verifica o CNPJ
		if (data.cnpj.length > 0 && data.cnpj.length != 14) {
			return setFormError('CNPJ inválido!');
		}

		// Verifica o telefone
		if (data.phone.length != 11) {
			return setFormError('Número de telefone inválido!');
		}

		const { success, error } = (await window.api.invoke('save-client', {
			id: editingClientId,
			...data,
		})) as SaveDataResponseDTO;

		if (!success) {
			return setError(error);
		}

		loadClients(offset);
		modalInstance.current?.hide();
	});

	const DeleteClient = async (clientId: number) => {
		const { success, error } = (await window.api.invoke(
			'delete-client',
			clientId
		)) as SaveDataResponseDTO;

		if (!success) {
			return setError(error);
		}

		loadClients(offset);
	};

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
								{modalMode === 'create' ? 'Cadastrar cliente' : 'Editar cliente'}
							</h2>
							<button className='btn-close' data-bs-dismiss='modal'></button>
						</div>

						<div className='modal-body'>
							<form className='row g-3'>
								{/* Mensagem de erro */}
								{formError && <p className='text-danger mb-0 mt-3 text-center'>Erro: {error}</p>}

								{/* CPF */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>CPF:</label>
									<Controller
										name='cpf'
										control={control}
										render={({ field }) => (
											<InputMask
												mask='999.999.999-99'
												className='form-control'
												value={field.value}
												readOnly={modalMode === 'edit'}
												onChange={field.onChange}
											/>
										)}
									/>
								</div>

								{/* CNPJ */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>CPNJ:</label>
									<Controller
										name='cnpj'
										control={control}
										render={({ field }) => (
											<InputMask
												mask='99.999.999/9999-99'
												className='form-control'
												value={field.value}
												readOnly={modalMode === 'edit'}
												onChange={field.onChange}
											/>
										)}
									/>
								</div>

								{/* Nome */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Nome:</label>
									<input
										className='form-control'
										{...register('name', { required: true })}
										required
									/>
								</div>

								{/* Email */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Email:</label>
									<input
										className='form-control'
										type='email'
										{...register('email', { required: true })}
										required
									/>
								</div>

								{/* Telefone */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Telefone:</label>
									<Controller
										name='phone'
										control={control}
										render={({ field }) => (
											<InputMask
												mask='(99) 99999-9999'
												className='form-control'
												value={field.value}
												readOnly={modalMode === 'edit'}
												onChange={field.onChange}
											/>
										)}
									/>
								</div>

								{/* Honorário */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Honorário:</label>
									<input
										type='number'
										step='0.01'
										min={1}
										className='form-control'
										{...register('fee', { required: true, valueAsNumber: true })}
										required
									/>
								</div>

								{/* Vencimento */}
								<div className='col-12 col-md-6'>
									<label className='form-label'>Vencimento:</label>
									<input
										type='number'
										min={1}
										max={31}
										className='form-control'
										{...register('feeDueDay', { required: true, valueAsNumber: true })}
										required
									/>
								</div>
							</form>
						</div>

						<div className='modal-footer'>
							<button className='btn btn-primary' onClick={SaveClient}>
								Salvar Cliente
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

						<button type='button' className='btn btn-primary' onClick={() => OpenClientModal()}>
							<i className='bi bi-plus-lg'></i>
						</button>
					</div>
				</form>

				<table className='table table-striped shadow-sm mt-2'>
					<thead>
						<tr className='text-center'>
							<th scope='col'>CPF</th>
							<th scope='col'>CNPJ</th>
							<th scope='col'>Nome</th>
							<th scope='col'>Email</th>
							<th scope='col'>Telefone</th>
							<th scope='col'>Honorário</th>
							<th scope='col'>Vencimento</th>
							<th scope='col'>Ações</th>
						</tr>
					</thead>
					<tbody onScroll={handleScroll}>
						{clients.map((client, i) => (
							<tr key={i}>
								<th className='text-center' scope='row'>
									{formatCpf(client.cpf)}
								</th>
								<th className='text-center' scope='row'>
									{formatCnpj(client.cnpj)}
								</th>
								<td className='text-center'>{client.name}</td>
								<td className='text-center'>{client.email}</td>
								<td className='text-center'>{formatPhone(client.phone)}</td>
								<td className='text-center'>{client.fee}</td>
								<td className='text-center'>{client.feeDueDay}</td>

								<td className='d-flex justify-content-center gap-2'>
									<button className='btn btn-secondary' onClick={() => OpenClientModal(client)}>
										<i className='bi bi-pencil-fill' />
									</button>

									<DangerHoldButton onComplete={() => DeleteClient(client.id)} seconds={1} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
