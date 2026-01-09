import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FaPencil, FaPlus } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';

import AppLayout from '@components/AppLayout';
import DangerHoldButton from '@components/form/DangerHoldButton';
import ServiceModal from '@modals/ServiceModal';
import { IService } from '@t/dtos';

import { useServices } from '@/hooks/useServices';
import { useInfiniteScroll } from '@/hooks/useInfinityScroll';

import { formatMoney } from '@/utils/formatters';
import { SettingsContext } from '@/contexts/SettingsContext';

export default function ServicesList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  const { fetch, remove } = useServices();

  // Filtro
  const [filter, setFilter] = useState('');

  const { items: services, load, handleScroll } = useInfiniteScroll<IService>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  // Lista de linhas
  const rows = useMemo(() => {
    return services.map((s) => ({
      ...s,
      value: formatMoney(s.value, settings?.language ?? ''),
    }));
  }, [services, settings]);

  // Filtro -> reset
  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<IService | null>(null);

  const openModal = (id?: number) => {
    setModalClient(services.find((s) => s.id === id) ?? null);
    setIsModalOpen(true);
  };

  // Deletar cliente
  const deleteService = async (serviceId: number) => {
    const { success } = await remove(serviceId);
    if (success) {
      await load();
    }
  };

  return (
    <AppLayout>
      <ServiceModal
        open={isModalOpen}
        client={modalClient}
        onClose={(success) => {
          setIsModalOpen(false);
          if (success) {
            load();
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('services.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="bg-sidebar-hover my-5 block items-center gap-3 rounded-md border border-border p-2 shadow-sm hover:bg-surface-muted md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-text-primary">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder={t('services.list.toolbar.search-placeholder')}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title={t('services.list.toolbar-new-service')}
          className="bg-sidebar-hover2 ms-auto flex h-10 w-10 items-center justify-center rounded-md text-text-primary transition hover:bg-surface-muted"
        >
          <FaPlus />
        </button>
      </form>

      {/* TABELA */}
      <div className="w-full overflow-x-auto">
        <table onScroll={handleScroll} className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="bg-sidebar-hover2 border-b text-left text-text-primary">
              <th className="px-4 py-3 font-semibold">{t('services.list.table.name')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('services.list.table.value')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="odd:bg-sidebar-bg even:bg-sidebar-hover border-b text-text-primary hover:bg-surface-muted">
                <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-3" title={s.name}>
                  {s.name}
                </td>
                <td className="px-4 py-3 text-center" title={s.value}>
                  {s.value}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openModal(s.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-text-primary transition hover:opacity-90"
                    >
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteService(s.id)} duration={600} />
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
