import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Ícones
import {
  BsArrowCounterclockwise,
  BsBoxArrowInRight,
  BsBriefcase,
  BsCurrencyDollar,
  BsFileBarGraph,
  BsGear,
  BsGraphUp,
  BsHouseDoor,
  BsListUl,
  BsPeople,
  BsPersonPlus,
  BsPlus,
} from 'react-icons/bs';

import SettingsModal from '@modals/SettingsModal';

import { MenuOption } from '@t/Menu';

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
      icon: <BsHouseDoor />,
    },
    {
      name: 'Clientes',
      icon: <BsPeople />,
      items: [
        {
          name: 'Listar clientes',
          link: '/clients/list',
          icon: <BsListUl />,
        },
        {
          name: 'Cadastrar cliente',
          link: '/clients/new',
          icon: <BsPersonPlus />,
        },
      ],
    },
    {
      name: 'Faturamentos',
      icon: <BsCurrencyDollar />,
      items: [
        {
          name: 'Listar faturamentos',
          link: '/billings/list',
          icon: <BsListUl />,
        },
        {
          name: 'Cadastrar faturamentos',
          link: '/billings/new',
          icon: <BsPlus />,
        },
      ],
    },
    {
      name: 'Serviços',
      icon: <BsBriefcase />,
      items: [
        {
          name: 'Listar serviços',
          link: '/services/list',
          icon: <BsListUl />,
        },
        {
          name: 'Cadastrar serviços',
          link: '/services/new',
          icon: <BsPlus />,
        },
      ],
    },
    {
      name: 'Relatórios',
      icon: <BsFileBarGraph />,
      items: [
        {
          name: 'Relatorios financeiros',
          link: '/reports/financial',
          icon: <BsCurrencyDollar />,
        },
        {
          name: 'Estatísticas gerais',
          link: '/reports/general',
          icon: <BsGraphUp />,
        },
      ],
    },
    {
      name: 'Backups',
      link: '/backups',
      icon: <BsArrowCounterclockwise />,
    },
    {
      name: 'Configurações',
      icon: <BsGear />,
      action: () => setIsConfigModalOpen(true),
    },
    {
      name: 'Login',
      icon: <BsBoxArrowInRight />,
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
        <nav className="flex flex-col gap-1 font-normal">
          {sidebarOptions.map((item) => (
            <div key={item.name}>
              {/* Se for submenu */}
              {isSubmenu(item) ? (
                <>
                  <button
                    onClick={() => toggle(item.name)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-surface-muted"
                  >
                    <span className="text-[18px]">{item.icon}</span>
                    {item.name}
                  </button>

                  {open === item.name && (
                    <div className="flex animate-fadeIn flex-col gap-1 pl-5">
                      {item.items.map((sub) =>
                        sub.link ? (
                          <Link key={sub.name} to={sub.link} className="flex items-center gap-2 rounded py-2 hover:bg-surface-muted">
                            <span className="text-[18px]">{sub.icon}</span>
                            {sub.name}
                          </Link>
                        ) : (
                          <button key={sub.name} onClick={sub.action} className="flex items-center gap-2 rounded py-2 hover:bg-surface-muted">
                            <span className="text-[18px]">{sub.icon}</span>
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
                      <span className="text-[18px]">{item.icon}</span>
                      {item.name}
                    </Link>
                  ) : (
                    <button onClick={item.action} className="flex w-full items-center gap-2 rounded-md px-2 py-3 transition hover:bg-surface-muted">
                      <span className="text-[18px]">{item.icon}</span>
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
