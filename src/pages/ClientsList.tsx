import React, { useEffect, useRef, useState } from 'react';
import { IClient, IAppResponseDTO } from '@t/dtos';

import Sidebar from '@/components/Sidebar';
import ErrorModal from '@/components/ErrorModal';
import DangerHoldButton from '@/components/DangerHoldButton';
import ClientModal from '@components/ClientModal';

import { formatCnpj, formatCpf, formatPhone } from '@utils/Formatters';

// Ícones
import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';

export default function ClientsList() {
  // Erros
  const [error, setError] = useState<string | null>(null);

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

  // Abrir modal de importação
  const ImportClients = () => {};

  // Deletar cliente
  const DeleteClient = async (clientId: number) => {
    const { success, error } = (await window.api.invoke('delete-client', clientId)) as IAppResponseDTO<IClient>;

    if (!success && error) {
      return setError(error.message);
    }

    loadClients(offset);
  };

  return (
    <div className="bg-light-bg m-0 flex min-h-screen p-0">
      {/* MODAIS */}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

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
      <div className="bg-light-bg2 text-light-text flex-grow p-4">
        <h2 className="mt-5 text-center text-2xl font-semibold">SEUS CLIENTES</h2>

        {/* BARRA DE BUSCA */}
        <form className="bg-sidebar-hover border-sidebar-border my-5 flex items-center gap-3 rounded-md border p-2 shadow-sm hover:bg-sidebar-bg">
          <div className="flex flex-grow items-center gap-2">
            <IoMdSearch className="text-sidebar-text mx-1 text-xl" />

            <input
              type="search"
              className="text-sidebar-text placeholder:text-light-placeholder w-full bg-transparent outline-none"
              placeholder="BUSCAR CLIENTE POR NOME, CPF E CNPJ"
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => OpenModal()}
            title="Cadastrar cliente"
            className="bg-sidebar-hover2 hover:bg-sidebar-hover flex h-10 w-10 items-center justify-center rounded-md text-white transition"
          >
            <FaPlus />
          </button>

          <button
            type="button"
            onClick={() => ImportClients()}
            title="Importar clientes"
            className="bg-sidebar-hover2 hover:bg-sidebar-hover flex h-10 w-10 items-center justify-center rounded-md text-white transition"
          >
            <FaFileUpload />
          </button>
        </form>

        {/* TABELA */}
        <table className="w-full table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="bg-sidebar-hover2 text-sidebar-text text-left border-b">
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
              <tr key={i} className="odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2 text-sidebar-text border-b">
                <td className="px-4 py-3">{formatCpf(client.cpf)}</td>
                <td className="px-4 py-3">{formatCnpj(client.cnpj) || '-'}</td>
                <td className="px-4 py-3">{client.name}</td>
                <td className="px-4 py-3">{client.email}</td>
                <td className="px-4 py-3">{formatPhone(client.phone)}</td>

                <td className="px-4 py-3 text-center">{client.fee}</td>

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
