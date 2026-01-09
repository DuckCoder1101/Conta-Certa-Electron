import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Ícones
import { FaGear, FaHouseChimney, FaList, FaPlus } from 'react-icons/fa6';
import { GrLogin } from 'react-icons/gr';
import { HiDocumentReport } from 'react-icons/hi';
import { IoIosBriefcase, IoIosStats } from 'react-icons/io';
import { IoPeople } from 'react-icons/io5';
import { MdAttachMoney, MdOutlineAttachMoney } from 'react-icons/md';
import { LuDatabaseBackup } from 'react-icons/lu';

import SettingsModal from '@modals/SettingsModal';

interface MenuLink {
  name: string;
  link?: string;
  action?: () => void;
  icon: React.JSX.Element;
}

interface Submenu {
  name: string;
  icon: React.JSX.Element;
  items: MenuLink[];
}

type MenuOption = MenuLink | Submenu;

const isSubmenu = (option: MenuOption) => 'items' in option;

export default function Sidebar() {
  const [open, setOpen] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  const onConfigModalClose = () => {
    setIsConfigModalOpen(false);
  };

  const toggle = (menu: string) => {
    setOpen(open === menu ? null : menu);
  };

  const sidebarOptions: MenuOption[] = [
    {
      name: 'Início',
      link: '/',
      icon: <FaHouseChimney />,
    },
    {
      name: 'Clientes',
      icon: <IoPeople />,
      items: [
        {
          name: 'Listar clientes',
          link: '/clients/list',
          icon: <FaList />,
        },
        {
          name: 'Cadastrar cliente',
          link: '/clients/new',
          icon: <FaPlus />,
        },
      ],
    },
    {
      name: 'Faturamentos',
      icon: <MdOutlineAttachMoney />,
      items: [
        {
          name: 'Listar faturamentos',
          link: '/billings/list',
          icon: <FaList />,
        },
        {
          name: 'Cadastrar faturamentos',
          link: '/billings/new',
          icon: <FaPlus />,
        },
      ],
    },
    {
      name: 'Serviços',
      icon: <IoIosBriefcase />,
      items: [
        {
          name: 'Listar serviços',
          link: '/services/list',
          icon: <FaList />,
        },
        {
          name: 'Cadastrar serviços',
          link: '/services/new',
          icon: <FaPlus />,
        },
      ],
    },
    {
      name: 'Relatórios',
      icon: <HiDocumentReport />,
      items: [
        {
          name: 'Relatorios financeiros',
          link: '/reports/financial',
          icon: <MdAttachMoney />,
        },
        {
          name: 'Estatísticas gerais',
          link: '/reports/general',
          icon: <IoIosStats />,
        },
      ],
    },
    {
      name: 'Backups',
      link: '/backups',
      icon: <LuDatabaseBackup />,
    },
    {
      name: 'Configurações',
      icon: <FaGear />,
      action: () => setIsConfigModalOpen(true),
    },
    {
      name: 'Login',
      icon: <GrLogin />,
      action: () => {},
    },
  ];

  return (
    <>
      {/* Modal de configurações */}
      <SettingsModal open={isConfigModalOpen} onClose={onConfigModalClose} />

      {/* Navbar */}
      <aside className="text-text flex min-h-screen min-w-[260px] flex-col border-r border-border bg-sidebar px-4 py-6">
        {/* TÍTULO */}
        <h2 className="text-text mb-6 text-center text-2xl font-semibold uppercase tracking-wide">Conta Certa</h2>

        {/* MENU DINÂMICO */}
        <nav className="flex flex-col gap-1">
          {sidebarOptions.map((item) => (
            <div key={item.name}>
              {/* 1️⃣ Se for submenu */}
              {isSubmenu(item) ? (
                <>
                  <button
                    onClick={() => toggle(item.name)}
                    className="hover:text-text flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-surface-muted"
                  >
                    {item.icon}
                    {item.name}
                  </button>

                  {open === item.name && (
                    <div className="flex animate-fadeIn flex-col gap-1 pl-4">
                      {item.items.map((sub) =>
                        sub.link ? (
                          <Link key={sub.name} to={sub.link} className="flex items-center gap-2 rounded py-2 hover:bg-surface-muted">
                            {sub.icon}
                            {sub.name}
                          </Link>
                        ) : (
                          <button key={sub.name} onClick={sub.action} className="flex items-center gap-2 rounded py-2 hover:bg-surface-muted">
                            {sub.icon}
                            {sub.name}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Se for MenuLink simples */
                <>
                  {item.link ? (
                    <Link to={item.link} className="flex items-center gap-2 rounded-md px-2 py-3 transition hover:bg-surface-muted">
                      {item.icon}
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="hover:text-text flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-surface-muted"
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
