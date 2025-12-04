import { useContext, useEffect, useState } from 'react';
import { IClient } from '@t/dtos';

import DangerHoldButton from '@components/DangerHoldButton';
import ClientModal from '@components/ClientModal';

import { formatCnpj, formatCpf, formatMoney, formatPhone } from '@utils/formatters';

// Ícones
import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';

import { GlobalEventsContext } from '@/contexts/GlobalEventsContext';

import { useInfiniteScroll } from '@/hooks/useInfinityScroll';
import { useClients } from '@/hooks/useClients';
import AppLayout from '@/components/AppLayout';

export default function ClientsList() {
  const { setError } = useContext(GlobalEventsContext);

  const { fetchAll, remove } = useClients();

  // Filtro digitado
  const [filter, setFilter] = useState('');

  // Infinite scroll usando Electron API
  const { items: clients, load, handleScroll } = useInfiniteScroll<IClient>((offset) => fetchAll(offset, 30, filter).then((r) => r.data ?? []));

  // Filtro -> reset
  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<IClient | null>(null);

  const openModal = (client?: IClient) => {
    setModalClient(client ?? null);
    setIsModalOpen(true);
  };

  // Importar clientes
  const importClients = () => {
    window.api.send('import-clients-csv');
  };

  // Deletar cliente
  const deleteClient = async (clientId: number) => {
    const { success, error } = await remove(clientId);

    if (!success && error) {
      return setError(error.message);
    }

    load(); // reload mantendo offset
  };

  return (
    <AppLayout>
      <ClientModal
        open={isModalOpen}
        client={modalClient}
        onClose={(success, error) => {
          setIsModalOpen(false);

          if (success)
            load(); // atualiza mantendo offset
          else if (error) setError(error);
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">Clientes</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 block items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder="Buscar por nome, CPF ou CNPJ"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openModal()}
            title="Cadastrar cliente"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaPlus />
          </button>

          <button
            type="button"
            onClick={importClients}
            title="Importar clientes"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaFileUpload />
          </button>
        </div>
      </form>

      {/* TABELA */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
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
                    <button onClick={() => openModal(client)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteClient(client.id)} seconds={1} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
