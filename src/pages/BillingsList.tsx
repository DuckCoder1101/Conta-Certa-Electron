import { useContext, useEffect, useMemo, useState } from 'react';
import { IBilling } from '@t/dtos';

import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import AppLayout from '@components/AppLayout';
import BillingModal from '@modals/BillingModal';
import DangerHoldButton from '@components/form/DangerHoldButton';

import { formatDate, formatMoney } from '@utils/formatters';

import { GlobalEventsContext } from '@contexts/GlobalEventsContext';
import { SettingsContext } from '@contexts/SettingsContext';

import { useBillings } from '@hooks/useBillings';
import { useInfiniteScroll } from '@hooks/useInfinityScroll';

export default function BillingsList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  // Contexto global
  const { setError } = useContext(GlobalEventsContext);
  const { fetchAll, remove } = useBillings();

  // Filtro digitado
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll com filtro
  const { items: billings, load, handleScroll } = useInfiniteScroll<IBilling>((offset) => fetchAll(offset, 30, filter).then((r) => r.data ?? []));

  // Lista de linhas
  const rows = useMemo(() => {
    return billings.map((b) => ({
      id: b.id,
      client: b.client?.name ?? '-',
      status: t(`billing.status.${b.status}`),
      statusColor: b.status == 'paid' ? 'text-green-500' : 'text-red-500',
      totalFee: formatMoney(b.totalFee, settings?.language ?? ''),
      dueDate: formatDate(b.dueDate),
      paidAt: formatDate(b.paidAt),
    }));
  }, [billings, t, settings]);

  // Aplica filtro SEM resetar scroll automaticamente
  useEffect(() => {
    load(0); // reseta quando filtro mudar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const deleteBilling = async (id: number) => {
    const result = await remove(id);

    if (!result.success && result.error) {
      return setError(result.error.message);
    }

    load();
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalBilling, setModalBilling] = useState<IBilling | null>(null);

  const openModal = (id?: number) => {
    setModalBilling(billings.find((b) => b.id === id) ?? null);
    setIsModalOpen(true);
  };

  // RENDER
  return (
    <AppLayout>
      {/* MODAIS */}
      <BillingModal
        open={isModalOpen}
        billing={modalBilling}
        onClose={(success, error) => {
          setIsModalOpen(false);

          if (success) {
            load();
          } else if (error) {
            setError(error);
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('billing.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 block items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
            <IoMdSearch />
          </span>

          <input
            type="search"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder={t('billing.list.tools.search-placeholder')}
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title={t('billing.list.tools.new-billing')}
          className="ms-auto flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
        >
          <FaPlus />
        </button>
      </form>

      {/* TABELA */}
      <div className="w-full overflow-x-auto">
        <table onScroll={handleScroll} className="w-full min-w-[900px] table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="border-b bg-sidebar-hover2 text-left text-sidebar-text">
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.client')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.total-value')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.status')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.pait-at')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.due-date')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className="max-w-[180px] truncate whitespace-nowrap px-4 py-3" title={b.client}>
                  {b.client}
                </td>

                <td className="max-w-[100px] truncate whitespace-nowrap px-4 py-3" title={b.totalFee}>
                  {b.totalFee}
                </td>

                <td className={`max-w-[120px] truncate whitespace-nowrap px-4 py-3 ${b.statusColor}`}>{b.status}</td>

                <td className="max-w-[120px] truncate whitespace-nowrap px-4 py-3" title={b.paidAt}>
                  {b.paidAt}
                </td>

                <td className="max-w-[120px] truncate whitespace-nowrap px-4 py-3" title={b.dueDate}>
                  {b.dueDate}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(b.id)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteBilling(b.id)} duration={600} />
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
