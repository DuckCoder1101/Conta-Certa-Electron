import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DangerHoldButton from '@components/form/DangerHoldButton';
import ClientModal from '@modals/ClientModal';

import { formatCnpj, formatCpf, formatMoney, formatPhone } from '@utils/formatters';

// Ícones
import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';

import { GlobalEventsContext } from '@contexts/GlobalEventsContext';
import { SettingsContext } from '@contexts/SettingsContext';

import { useInfiniteScroll } from '@hooks/useInfinityScroll';
import { useClients } from '@hooks/useClients';

import AppLayout from '@components/AppLayout';

import { IClient } from '@t/dtos';

export default function ClientsList() {
  // Traduções
  const { t } = useTranslation();

  const { setError } = useContext(GlobalEventsContext);
  const { settings } = useContext(SettingsContext);

  const { fetchAll, remove } = useClients();

  // Filtro digitado
  const [filter, setFilter] = useState('');

  // Infinite scroll usando Electron API
  const { items: clients, load, handleScroll } = useInfiniteScroll<IClient>((offset) => fetchAll(offset, 30, filter).then((r) => r.data ?? []));

  // Lista de linhas
  const rows = useMemo(() => {
    return clients.map((c) => ({
      ...c,
      email: c.email ?? '-',
      phone: formatPhone(c.phone),
      cpf: formatCpf(c.cpf),
      cnpj: formatCnpj(c.cnpj),
      fee: formatMoney(c.fee, settings?.language ?? ''),
    }));
  }, [clients, settings]);

  // Filtro -> reset
  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<IClient | null>(null);

  const openModal = (id?: number) => {
    setModalClient(clients.find((c) => c.id === id) ?? null);
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

    load();
  };

  return (
    <AppLayout>
      <ClientModal
        open={isModalOpen}
        client={modalClient}
        onClose={(success, error) => {
          setIsModalOpen(false);

          if (success) {
            load();
          } else if (error) {
            setError(error);
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('client.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 block items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder={t('client.list.toolbar.search-placeholder')}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openModal()}
            title={t('client.list.toolbar.new-client')}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaPlus />
          </button>

          <button
            type="button"
            onClick={importClients}
            title={t('client.list.toolbar.import-clients')}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaFileUpload />
          </button>
        </div>
      </form>

      {/* TABELA */}
      <div className="w-full overflow-x-auto">
        <table onScroll={handleScroll} className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="border-b bg-sidebar-hover2 text-left text-sidebar-text">
              <th className="px-4 py-3 font-semibold">CPF</th>
              <th className="px-4 py-3 font-semibold">CNPJ</th>
              <th className="px-4 py-3 font-semibold">{t('client.list.table.name')}</th>
              <th className="px-4 py-3 font-semibold">{t('client.list.table.email')}</th>
              <th className="px-4 py-3 font-semibold">{t('client.list.table.phone')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('client.list.table.fee')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('client.list.table.dueDate')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className="max-w-[130px] truncate whitespace-nowrap px-4 py-3" title={c.cpf}>
                  {formatCpf(c.cpf)}
                </td>

                <td className="max-w-[130px] truncate whitespace-nowrap px-4 py-3" title={c.cnpj}>
                  {c.cnpj}
                </td>

                <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-3" title={c.name}>
                  {c.name}
                </td>

                <td className="max-w-[200px] truncate whitespace-nowrap px-4 py-3" title={c.email}>
                  {c.email}
                </td>

                <td className="max-w-[140px] truncate whitespace-nowrap px-4 py-3" title={c.phone}>
                  {c.phone}
                </td>

                <td className="px-4 py-3 text-center" title={c.fee}>
                  {c.fee}
                </td>
                <td className="px-4 py-3 text-center" title={c.feeDueDay.toString()}>
                  {c.feeDueDay}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(c.id)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteClient(c.id)} duration={600} />
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
