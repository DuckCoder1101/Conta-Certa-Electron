import { useContext, useEffect, useMemo, useState } from 'react';
import { IBilling } from '@t/dtos';

import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

import AppLayout from '@components/AppLayout';
import BillingModal from '@modals/BillingModal';
import DangerHoldButton from '@components/form/DangerHoldButton';

import { formatDate, formatMoney } from '@utils/formatters';

import { SettingsContext } from '@contexts/SettingsContext';

import { useBillings } from '@hooks/useBillings';
import { useInfiniteScroll } from '@hooks/useInfinityScroll';

export default function BillingsList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  // Contexto global
  const { fetch, remove } = useBillings();

  // Filtro digitado
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll com filtro
  const { items: billings, load, handleScroll } = useInfiniteScroll<IBilling>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  // Lista de linhas
  const rows = useMemo(() => {
    return billings.map((b) => ({
      id: b.id,
      client: b.client?.name ?? '-',
      status: t(`billing.status.${b.status}`),
      statusColor: b.status == 'paid' ? 'text-success' : 'text-danger',
      totalFee: formatMoney(b.totalFee, settings?.language ?? ''),
      dueDate: formatDate(b.dueDate),
      paidAt: formatDate(b.paidAt),
    }));
  }, [billings, t, settings]);

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const deleteBilling = async (id: number) => {
    const { success } = await remove(id);
    if (success) {
      await load();
    }
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
        onClose={(success) => {
          setIsModalOpen(false);

          if (success) {
            load();
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('billing.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="bg-sidebar-hover my-5 block items-center gap-3 rounded-md border border-border p-2 shadow-sm hover:bg-surface-muted md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-text-primary">
            <IoMdSearch />
          </span>

          <input
            type="search"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder={t('billing.list.tools.search-placeholder')}
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title={t('billing.list.tools.new-billing')}
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
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.client')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.total-value')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.status')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.paid-at')}</th>
              <th className="px-4 py-3 font-semibold">{t('billing.list.table.due-date')}</th>
              <th className="px-4 py-3 text-center font-semibold">{t('global.table.actions.title')}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="odd:bg-sidebar-bg even:bg-sidebar-hover border-b text-text-primary hover:bg-surface-muted">
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
                    <button
                      onClick={() => openModal(b.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-text-primary transition hover:opacity-90"
                    >
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
