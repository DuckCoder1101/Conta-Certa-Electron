import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatMoney, formatPhone } from '@utils/formatters';

// Ícones
import { IoMdSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';

import { SettingsContext } from '@contexts/SettingsContext';

import { useInfiniteScroll } from '@hooks/useInfinityScroll';
import { useClients } from '@hooks/useClients';

import AppLayout from '@components/AppLayout';
import AppTable from '@components/AppTable';

import EditButton from '@components/form/EditButton';
import DeleteHoldButton from '@components/form/DeleteHoldButton';

import ClientModal from '@modals/ClientModal';

import { Client } from '@shared/Types';

import { IColumn } from '@t/Table';
import { ClientTableDTO } from '@shared/DTOs';

export default function ClientsList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  const { fetch, remove } = useClients();

  // Filtro digitado
  const [filter, setFilter] = useState('');

  // Infinite scroll
  const {
    items: clients,
    loading,
    handleScroll,
    reload,
  } = useInfiniteScroll<Client>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  // Colunas da tabela
  const columns: IColumn<ClientTableDTO>[] = [
    { key: 'name', header: t('client.list.table.name'), width: '180px' },
    { key: 'document', header: t('client.list.table.cpf'), width: '130px' },
    { key: 'documentType', header: t('client.list.table.cnpj'), width: '130px' },
    { key: 'email', header: t('client.list.table.email'), width: '200px' },
    { key: 'phone', header: t('client.list.table.phone'), width: '130px' },
    { key: 'fee', header: t('client.list.table.fee'), width: '130px', align: 'center' },
    { key: 'feeDueDay', header: t('client.list.table.dueDate'), width: '130px', align: 'center' },
  ];

  // Linhas da tabela
  const rows = useMemo(() => {
    return clients.map((c) => ({
      id: c.id,
      name: c.name,
      document: '',
      documentType: '',
      email: c.email ?? '-',
      phone: formatPhone(c.phone),
      fee: formatMoney(c.fee, settings?.language ?? 'pt-BR', t('global.currency')),
      feeDueDay: String(c.feeDueDay),
    }));
  }, [clients, settings?.language, t]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<Client | null>(null);
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
    const { success } = await remove(clientId);
    if (success) {
      await reload();
    }
  };

  // Busca os clientes a primeira vez, e quando muda o filtro
  useEffect(() => {
    (async () => await reload())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <AppLayout>
      <ClientModal
        open={isModalOpen}
        client={modalClient}
        onClose={async (success) => {
          setIsModalOpen(false);
          if (success) {
            await reload();
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('client.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 flex items-center gap-3 rounded-md border border-border bg-surface p-2 shadow-sm hover:bg-surface-muted">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-text-primary">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder={t('client.list.toolbar.search-placeholder')}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openModal()}
            title={t('client.list.toolbar.new-client')}
            className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-text-primary transition hover:bg-surface"
          >
            <FaPlus />
          </button>

          <button
            type="button"
            onClick={importClients}
            title={t('client.list.toolbar.import-clients')}
            className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-text-primary transition hover:bg-surface"
          >
            <FaFileUpload />
          </button>
        </div>
      </form>

      {/* TABELA */}
      <AppTable
        onScroll={handleScroll}
        columns={columns}
        data={rows}
        loading={loading}
        emptyMessage={t('client.list.table.empty')}
        actions={(client) => (
          <>
            <EditButton onClick={() => openModal(client.id)} />
            <DeleteHoldButton onComplete={() => deleteClient(client.id)} duration={600} />
          </>
        )}
      />
    </AppLayout>
  );
}
