import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FaPlus } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';

import AppLayout from '@components/AppLayout';
import AppTable from '@components/AppTable';

import EditButton from '@components/form/EditButton';
import DeleteHoldButton from '@components/form/DeleteHoldButton';

import ServiceModal from '@modals/ServiceModal';

import { useServices } from '@/hooks/useServices';
import { useInfiniteScroll } from '@/hooks/useInfinityScroll';

import { SettingsContext } from '@/contexts/SettingsContext';

import { IService } from '@t/Schemas';
import { IServiceTableDTO } from '@t/DTOs';

import { formatMoney } from '@/utils/formatters';

import { IColumn } from '@t/Table';

export default function ServicesList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  const { fetch, remove } = useServices();

  // Filtro
  const [filter, setFilter] = useState('');

  const {
    items: services,
    loading,
    handleScroll,
    reload,
  } = useInfiniteScroll<IService>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  // Colunas da tabela
  const columns: IColumn<IServiceTableDTO>[] = [
    { key: 'name', header: t('service.list.table.name'), width: '', align: 'center' },
    { key: 'value', header: t('service.list.table.value'), width: '', align: 'center' },
  ];

  // Linhas da tabela
  const rows = useMemo(() => {
    return services.map((s) => ({
      id: s.id,
      name: s.name,
      value: formatMoney(s.value, settings?.language ?? 'pt-BR', t('global.currency')),
    }));
  }, [services, settings?.language, t]);

  // Busca os serviços a primeira vez, e quando muda o filtro
  useEffect(() => {
    (async () => await reload())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<IService | null>(null);
  const openModal = (id?: number) => {
    setModalClient(services.find((s) => s.id === id) ?? null);
    setIsModalOpen(true);
  };

  // Deletar serviço
  const deleteService = async (serviceId: number) => {
    const { success } = await remove(serviceId);
    if (success) {
      await reload();
    }
  };

  return (
    <AppLayout>
      <ServiceModal
        open={isModalOpen}
        client={modalClient}
        onClose={async (success) => {
          setIsModalOpen(false);
          if (success) {
            await reload();
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('service.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 flex items-center gap-3 rounded-md border border-border bg-surface p-2 shadow-sm hover:bg-surface-muted">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-text-primary">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder={t('service.list.toolbar.search-placeholder')}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title={t('service.list.toolbar-new-service')}
          className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-text-primary transition hover:bg-surface"
        >
          <FaPlus />
        </button>
      </form>

      {/* TABELA */}
      <AppTable
        onScroll={handleScroll}
        columns={columns}
        data={rows}
        loading={loading}
        emptyMessage={t('service.list.table.empty')}
        actions={(service) => (
          <>
            <EditButton onClick={() => openModal(service.id)} />
            <DeleteHoldButton onComplete={() => deleteService(service.id)} duration={600} />
          </>
        )}
      />
    </AppLayout>
  );
}
