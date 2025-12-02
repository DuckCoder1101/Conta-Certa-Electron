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
    <aside className="bg-sidebar-bg border-sidebar-border text-sidebar-text flex min-h-screen min-w-[260px] flex-col border-r p-4">
      {/* TÍTULO */}
      <h2 className="mb-6 text-center text-xl font-semibold tracking-wide text-white">Conta Certa</h2>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {/* Início */}
        <Link to="/" className="hover:bg-sidebar-hover flex items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <FaHouseChimney />
          Início
        </Link>

        {/* CLIENTES */}
        <button onClick={() => toggle('clients')} className="hover:bg-sidebar-hover flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <IoPeople />
          Clientes
        </button>

        {open === 'clients' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/clients/list" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaList />
              Listar clientes
            </Link>

            <Link to="/clients/new" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaPlus />
              Cadastrar cliente
            </Link>
          </div>
        )}

        {/* FATURAMENTOS */}
        <button onClick={() => toggle('billings')} className="hover:bg-sidebar-hover flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <MdOutlineAttachMoney />
          Faturamentos
        </button>

        {open === 'billings' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/billings/list" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaList />
              Listar faturamentos
            </Link>

            <Link to="/billings/new" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaPlus />
              Cadastrar faturamento
            </Link>
          </div>
        )}

        {/* SERVIÇOS */}
        <button onClick={() => toggle('services')} className="hover:bg-sidebar-hover flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <IoIosBriefcase />
          Serviços
        </button>

        {open === 'services' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/services/list" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaList />
              Listar serviços
            </Link>

            <Link to="/services/new" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <FaPlus />
              Cadastrar serviço
            </Link>
          </div>
        )}

        {/* RELATÓRIOS */}
        <button onClick={() => toggle('reports')} className="hover:bg-sidebar-hover flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <HiDocumentReport />
          Relatórios
        </button>

        {open === 'reports' && (
          <div className="flex animate-fadeIn flex-col gap-1 pl-4">
            <Link to="/reports/financial" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <MdAttachMoney />
              Relatórios financeiros
            </Link>

            <Link to="/reports/general" className="hover:bg-sidebar-hover2 flex items-center gap-2 rounded py-2">
              <IoIosStats />
              Estatísticas gerais
            </Link>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        <button className="hover:bg-sidebar-hover flex items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <FaGear />
          Configurações
        </button>
      </nav>

      {/* RODAPÉ */}
      <div className="mt-auto pt-4">
        <button className="hover:bg-sidebar-hover flex items-center gap-2 rounded-md px-2 py-3 transition hover:text-white">
          <GrLogin />
          Entrar
        </button>
      </div>
    </aside>
  );
}
