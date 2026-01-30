import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IoMdSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';

import AppLayout from '@components/AppLayout';
import AppTable from '@components/AppTable';

import DeleteHoldButton from '@components/form/DeleteHoldButton';
import EditButton from '@components/form/EditButton';

import BillingModal from '@modals/BillingModal';

import { SettingsContext } from '@contexts/SettingsContext';

import { useBillings } from '@hooks/useBillings';
import { useInfiniteScroll } from '@hooks/useInfinityScroll';

import { formatDate, formatMoney } from '@utils/formatters';

import { IBilling } from '@t/Schemas';
import { IBillingTableDTO } from '@t/DTOs';
import { IColumn } from '@t/Table';

export default function BillingsList() {
  // Traduções
  const { t } = useTranslation();

  // Configurações
  const { settings } = useContext(SettingsContext);

  // Contexto global
  const { fetch, remove } = useBillings();

  // Filtro digitado
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll
  const {
    items: billings,
    loading,
    handleScroll,
    reload,
  } = useInfiniteScroll<IBilling>((offset) => fetch(offset, 30, filter).then((r) => r.data ?? []));

  const columns: IColumn<IBillingTableDTO>[] = [
    { key: 'client', header: t('billing.list.table.client'), width: '180' },
    {
      key: 'status',
      header: t('billing.list.table.status'),
      width: '120px',
      render: (status) => (
        <span className={`${status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
          {t(`billing.status.${status}`)}
        </span>
      ),
    },
    { key: 'totalFee', header: t('billing.list.table.total-value'), width: '100px' },
    { key: 'dueDate', header: t('billing.list.table.due-date'), width: '120px' },
    { key: 'paidAt', header: t('billing.list.table.paid-at'), width: '120px' },
  ];

  // Linhas da tabela
  const rows: IBillingTableDTO[] = useMemo(() => {
    return billings.map((b) => ({
      id: b.id,
      client: b.client?.name ?? '-',
      status: b.status,
      totalFee: formatMoney(b.totalFee, settings?.language ?? 'pt-BR', t('global.currency')),
      dueDate: formatDate(b.dueDate, settings?.language ?? 'pt-BR'),
      paidAt: formatDate(b.paidAt, settings?.language ?? 'pt-BR'),
    }));
  }, [billings, settings]);

  const deleteBilling = async (id: number) => {
    const { success } = await remove(id);
    if (success) {
      await reload();
    }
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalBilling, setModalBilling] = useState<IBilling | null>(null);
  const openModal = (id?: number) => {
    setModalBilling(billings.find((b) => b.id === id) ?? null);
    setIsModalOpen(true);
  };

  // Busca os faturamentos a primeira vez, e quando muda o filtro
  useEffect(() => {
    (async () => await reload())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <AppLayout>
      {/* MODAIS */}
      <BillingModal
        open={isModalOpen}
        billing={modalBilling}
        onClose={async (success) => {
          setIsModalOpen(false);
          if (success) {
            await reload();
          }
        }}
      />

      <h2 className="mt-5 text-center text-2xl font-semibold">{t('billing.list.title')}</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 flex items-center gap-3 rounded-md border border-border bg-surface p-2 shadow-sm hover:bg-surface-muted">
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
        emptyMessage={t('billings.list.table.empty')}
        actions={(billing) => (
          <>
            <EditButton onClick={() => openModal(billing.id)} />
            <DeleteHoldButton onComplete={() => deleteBilling(billing.id)} duration={600} />
          </>
        )}
      />
    </AppLayout>
  );
}
