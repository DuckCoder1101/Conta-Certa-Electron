import React, { useContext, useEffect, useRef, useState } from 'react';
import { IClient, IAppResponseDTO } from '@t/dtos';

import Sidebar from '@components/Sidebar';
import DangerHoldButton from '@components/DangerHoldButton';
import ClientModal from '@components/ClientModal';
import { formatCnpj, formatCpf, formatMoney, formatPhone } from '@utils/formatters';

// Ícones
import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';
import { GlobalEventsContext } from '@/contexts/GlobalEventsContext';

export default function ClientsList() {
  // Contexto global
  const { setError } = useContext(GlobalEventsContext);

  // Clientes
  const [clients, setClients] = useState<IClient[]>([]);

  // Paginação e filtro
  const [filter, setFilter] = useState<string>('');
  const isLoading = useRef<boolean>(false);
  const [offset, setOffset] = useState(0);
  const limit = 30;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalClient, setModalClient] = useState<IClient | null>(null);

  // Carrega os clientes
  const loadClients = async (newOffset: number) => {
    if (isLoading.current) return;
    isLoading.current = true;

    const { data, error } = (await window.api.invoke('fetch-clients', offset, limit, filter)) as IAppResponseDTO<IClient[]>;

    if (data) {
      setClients(data);
      setOffset(newOffset);
    } else if (error) {
      setError(error.message);
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

  // Abre o modal
  const OpenModal = (client: IClient | null = null) => {
    setModalClient(client);
    setIsModalOpen(true);
  };

  // Atualiza a lista
  useEffect(() => {
    loadClients(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Requisita importação de clientes
  const ImportClients = () => {
    window.api.send('import-clients-csv');
  };

  // Deletar cliente
  const DeleteClient = async (clientId: number) => {
    const { success, error } = (await window.api.invoke('delete-client', clientId)) as IAppResponseDTO<IClient>;

    if (!success && error) {
      return setError(error.message);
    }

    loadClients(offset);
  };

  return (
    <div className="m-0 flex min-h-screen bg-light-bg p-0">
      {/* MODAL DE CLIENTE */}
      <ClientModal
        open={isModalOpen}
        client={modalClient}
        onClose={(success, error) => {
          setIsModalOpen(false);
          if (success) loadClients(offset);
          else if (error) setError(error);
        }}
      />

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <div className="w-full bg-light-bg2 py-8 px-4 text-light-text">
        <h2 className="mt-5 text-center text-2xl font-semibold">SEUS CLIENTES</h2>

        {/* BARRA DE BUSCA */}
        <form className="my-5 flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg">
          <div className="flex flex-grow items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
              <IoMdSearch />
            </span>

            <input
              type="search"
              placeholder="BUSCAR CLIENTES POR NOME, CPF E CNPJ"
              onChange={(e) => setFilter(e.currentTarget.value)}
              className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
            />
          </div>

          <button
            type="button"
            onClick={() => OpenModal()}
            title="Cadastrar cliente"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaPlus />
          </button>

          <button
            type="button"
            onClick={() => ImportClients()}
            title="Importar clientes"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaFileUpload />
          </button>
        </form>

        {/* TABELA */}
        <table className="w-full table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="border-b bg-sidebar-hover2 text-left text-sidebar-text">
              <th className="px-4 py-3 font-semibold">CPF</th>
              <th className="px-4 py-3 font-semibold">CNPJ</th>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Telefone</th>
              <th className="px-4 py-3 text-center font-semibold">Honorário</th>
              <th className="px-4 py-3 text-center font-semibold">Vencimento</th>
              <th className="px-4 py-3 text-center font-semibold">Ações</th>
            </tr>
          </thead>

          <tbody onScroll={handleScroll}>
            {clients.map((client, i) => (
              <tr key={i} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className="max-w-[130px] truncate whitespace-nowrap px-4 py-3" title={formatCpf(client.cpf)}>
                  {formatCpf(client.cpf)}
                </td>

                <td className="max-w-[130px] truncate whitespace-nowrap px-4 py-3" title={formatCnpj(client.cnpj) ?? '-'}>
                  {formatCnpj(client.cnpj) ?? '-'}
                </td>

                <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-3" title={client.name}>
                  {client.name}
                </td>

                <td className="max-w-[200px] truncate whitespace-nowrap px-4 py-3" title={client.email ?? ''}>
                  {client.email}
                </td>

                <td className="max-w-[140px] truncate whitespace-nowrap px-4 py-3" title={formatPhone(client.phone)}>
                  {formatPhone(client.phone)}
                </td>

                <td className="px-4 py-3 text-center">{formatMoney(client.fee)}</td>
                <td className="px-4 py-3 text-center">{client.feeDueDay}</td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => OpenModal(client)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => DeleteClient(client.id)} seconds={1} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
