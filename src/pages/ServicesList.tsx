import { useContext, useEffect, useState } from 'react';

import { FaPencil, FaPlus } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';

import AppLayout from '@/components/AppLayout';
import DangerHoldButton from '@/components/DangerHoldButton';
import ServiceModal from '@/components/ServiceModal';

import { IService } from '@/@types/dtos';

import { GlobalEventsContext } from '@/contexts/GlobalEventsContext';

import { useServices } from '@/hooks/useServices';
import { useInfiniteScroll } from '@/hooks/useInfinityScroll';

import { formatMoney } from '@/utils/formatters';
import { useTranslation } from 'react-i18next';

export default function ServicesList() {
  // Traduções
  const { t } = useTranslation();

  const { setError } = useContext(GlobalEventsContext);

  const { fetchAll, remove } = useServices();

  // Filtro
  const [filter, setFilter] = useState('');

  const { items: services, load, handleScroll } = useInfiniteScroll<IService>((offset) => fetchAll(offset, 30, filter).then((r) => r.data ?? []));

  // Filtro -> reset
  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClient, setModalClient] = useState<IService | null>(null);

  const openModal = (service?: IService) => {
    setModalClient(service ?? null);
    setIsModalOpen(true);
  };

  // Deletar cliente
  const deleteService = async (serviceId: number) => {
    const { success, error } = await remove(serviceId);

    if (!success && error) {
      return setError(error.message);
    }

    load(); // reload mantendo offset
  };

  return (
    <AppLayout>
      <ServiceModal
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

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('services.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 block items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
            <IoMdSearch />
          </span>

          <input
            type="search"
            placeholder={t('services.list.toolbar.search-placeholder')}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title={t('services.list.toolbar-new-service')}
          className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
        >
          <FaPlus />
        </button>
      </form>

      {/* TABELA */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="border-b bg-sidebar-hover2 text-left text-sidebar-text">
              <th className="px-4 py-3 font-semibold">{t('services.list.table.name')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('services.list.table.value')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>

          <tbody onScroll={handleScroll}>
            {services.map((service, i) => (
              <tr key={i} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-3" title={service.name}>
                  {service.name}
                </td>
                <td className="px-4 py-3 text-center">{formatMoney(service.value)}</td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(service)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteService(service.id)} seconds={1} />
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
