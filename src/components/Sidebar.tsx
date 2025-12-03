import { useState } from 'react';
import { Link } from 'react-router-dom';

// Ícones
import { FaGear, FaHouseChimney, FaList, FaPlus } from 'react-icons/fa6';
import { GrLogin } from 'react-icons/gr';
import { HiDocumentReport } from 'react-icons/hi';
import { IoIosBriefcase, IoIosStats } from 'react-icons/io';
import { IoPeople } from 'react-icons/io5';
import { MdAttachMoney, MdOutlineAttachMoney } from 'react-icons/md';

export default function Sidebar() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (menu: string) => {
    setOpen(open === menu ? null : menu);
  };

  return (
    <aside className="flex min-h-screen min-w-[260px] flex-col border-r border-sidebar-border bg-sidebar-bg p-4 text-sidebar-text">
      {/* TÍTULO */}
      <h2 className="mb-6 text-center text-2xl font-semibold tracking-wide text-white uppercase">Conta Certa</h2>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {/* Início */}
        <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <FaHouseChimney />
          Início
        </Link>

        {/* CLIENTES */}
        <button onClick={() => toggle('clients')} className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <IoPeople />
          Clientes
        </button>

        {open === 'clients' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/clients/list" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaList />
              Listar clientes
            </Link>

            <Link to="/clients/new" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaPlus />
              Cadastrar cliente
            </Link>
          </div>
        )}

        {/* FATURAMENTOS */}
        <button onClick={() => toggle('billings')} className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <MdOutlineAttachMoney />
          Faturamentos
        </button>

        {open === 'billings' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/billings/list" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaList />
              Listar faturamentos
            </Link>

            <Link to="/billings/new" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaPlus />
              Cadastrar faturamento
            </Link>
          </div>
        )}

        {/* SERVIÇOS */}
        <button onClick={() => toggle('services')} className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <IoIosBriefcase />
          Serviços
        </button>

        {open === 'services' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/services/list" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaList />
              Listar serviços
            </Link>

            <Link to="/services/new" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <FaPlus />
              Cadastrar serviço
            </Link>
          </div>
        )}

        {/* RELATÓRIOS */}
        <button onClick={() => toggle('reports')} className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <HiDocumentReport />
          Relatórios
        </button>

        {open === 'reports' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/reports/financial" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <MdAttachMoney />
              Relatórios financeiros
            </Link>

            <Link to="/reports/general" className="flex items-center gap-2 rounded py-2 hover:bg-sidebar-hover2">
              <IoIosStats />
              Estatísticas gerais
            </Link>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        <button className="flex items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <FaGear />
          Configurações
        </button>
      </nav>

      {/* RODAPÉ */}
      <div className="mt-auto pt-4">
        <button className="flex items-center gap-2 rounded-md px-2 py-3 transition hover:bg-sidebar-hover hover:text-white">
          <GrLogin />
          Entrar
        </button>
      </div>
    </aside>
  );
}
