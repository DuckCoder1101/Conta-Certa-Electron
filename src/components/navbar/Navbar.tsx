import { Link } from 'react-router-dom';

import './navbar.css';

export default function Navbar() {

	return (
		<header className='sidebar text-white p-3 m-0 min-vh-100 d-flex flex-column'>
			{/* TÍTULO DO APP */}
			<h3 className='text-center mb-4'>Conta Certa</h3>

			{/* MENU */}
			<div className='accordion accordion-flush' id='sidebar-menu'>
				{/* INÍCIO / DASHBOARD */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<Link to='/' className='accordion-button collapsed py-3'>
							<i className='ms-2 bi bi-house sidebar-icon'></i>
							Início
						</Link>
					</h2>
				</div>

				{/* CLIENTES */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button
							className='accordion-button collapsed'
							data-bs-toggle='collapse'
							data-bs-target='#clients-options'
							aria-expanded='false'
							aria-controls='clients-options'>
							<i className='ms-2 bi bi-people sidebar-icon'></i>
							Clientes
						</button>
					</h2>

					<div id='clients-options' className='accordion-collapse collapse'>
						<div className='accordion-body'>
							<Link to='/clients/list' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-list sidebar-icon'></i>
								Lista de clientes
							</Link>

							<Link to='/clients/new' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-person-plus sidebar-icon'></i>
								Cadastrar cliente
							</Link>
						</div>
					</div>
				</div>

				{/* COBRANÇAS */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button
							className='accordion-button collapsed'
							data-bs-toggle='collapse'
							data-bs-target='#billing-options'
							aria-expanded='false'
							aria-controls='billing-options'>
							<i className='ms-2 bi bi-cash-coin sidebar-icon'></i>
							Cobranças
						</button>
					</h2>

					<div id='billing-options' className='accordion-collapse collapse'>
						<div className='accordion-body'>
							<Link to='/billings/list' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-receipt sidebar-icon'></i>
								Todas as cobranças
							</Link>

							<Link to='/billings/new' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-plus-circle sidebar-icon'></i>
								Nova cobrança
							</Link>
						</div>
					</div>
				</div>

				{/* SERVIÇOS */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button
							className='accordion-button collapsed'
							data-bs-toggle='collapse'
							data-bs-target='#services-options'
							aria-expanded='false'
							aria-controls='services-options'>
							<i className='ms-2 bi bi-briefcase sidebar-icon'></i>
							Serviços
						</button>
					</h2>

					<div id='services-options' className='accordion-collapse collapse'>
						<div className='accordion-body'>
							<Link to='/services/list' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-collection sidebar-icon'></i>
								Listar serviços
							</Link>

							<Link to='/services/new' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-plus-lg sidebar-icon'></i>
								Cadastrar serviço
							</Link>
						</div>
					</div>
				</div>

				{/* RELATÓRIOS */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button
							className='accordion-button collapsed'
							data-bs-toggle='collapse'
							data-bs-target='#reports-options'
							aria-expanded='false'
							aria-controls='reports-options'>
							<i className='ms-2 bi bi-graph-up sidebar-icon'></i>
							Relatórios
						</button>
					</h2>

					<div id='reports-options' className='accordion-collapse collapse'>
						<div className='accordion-body'>
							<Link to='/reports/financial' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-file-earmark-bar-graph sidebar-icon'></i>
								Relatórios financeiros
							</Link>

							<Link to='/reports/general' className='d-block text-white py-1'>
								<i className='ms-2 bi bi-clipboard-data sidebar-icon'></i>
								Estatísticas gerais
							</Link>
						</div>
					</div>
				</div>

				{/* CONFIGURAÇÕES */}
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button className='accordion-button collapsed'>
							<i className='ms-2 bi bi-gear sidebar-icon'></i>
							Configurações
						</button>
					</h2>
				</div>
			</div>

			{/* RODAPÉ */}
			<div className='mt-auto pt-3'>
				<div className='accordion-item text-white'>
					<h2 className='accordion-header'>
						<button className='accordion-button collapsed py-3'>
							<i className='ms-2 bi bi-person sidebar-icon'></i>
							Entrar
						</button>
					</h2>
				</div>
			</div>
		</header>
	);
}
