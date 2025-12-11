import { useContext, useEffect, useState } from 'react';
import { IBilling } from '@t/dtos';

import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';

import BillingModal from '@/components/billing/BillingModal';
import DangerHoldButton from '@components/DangerHoldButton';
import AppLayout from '@/components/AppLayout';

import { formatDate, formatMoney } from '@utils/formatters';

import { GlobalEventsContext } from '@/contexts/GlobalEventsContext';
import { useBillings } from '@/hooks/useBillings';
import { useInfiniteScroll } from '@/hooks/useInfinityScroll';

export default function BillingsList() {
  // Contexto global
  const { setError } = useContext(GlobalEventsContext);
  const { fetchAll, remove } = useBillings();

  // Filtro digitado
  const [filter, setFilter] = useState<string>('');

  // Infinite scroll com filtro
  const { items: billings, load, handleScroll } = useInfiniteScroll<IBilling>((offset) => fetchAll(offset, 30, filter).then((r) => r.data ?? []));

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

  const openModal = (billing?: IBilling) => {
    setModalBilling(billing ?? null);
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

      <h2 className="mt-5 text-center text-2xl font-semibold">Faturamentos</h2>

      {/* BARRA DE BUSCA */}
      <form className="my-5 block items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg md:flex">
        <div className="flex flex-grow items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center text-lg text-white">
            <IoMdSearch />
          </span>

          <input
            type="search"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            placeholder="Buscar por cliente, ou status"
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
          />
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          title="Cadastrar cobrança"
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
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Valor total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Pagamento</th>
              <th className="px-4 py-3 font-semibold">Vencimento</th>
              <th className="px-4 py-3 text-center font-semibold">Ações</th>
            </tr>
          </thead>

          <tbody onScroll={handleScroll}>
            {billings.map((b, i) => (
              <tr key={i} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className={`max-w-[180px] truncate whitespace-nowrap px-4 py-3 ${b.client === null ? 'text-red-500' : ''}`} title={b.client?.name ?? 'Cliente excluído'}>
                  {b.client?.name ?? 'Cliente excluído'}
                </td>

                <td className="max-w-[100px] truncate whitespace-nowrap px-4 py-3" title={formatMoney(b.totalFee)}>
                  {formatMoney(b.totalFee)}
                </td>

                <td className={`max-w-[120px] truncate whitespace-nowrap px-4 py-3 ${b.status === 'paid' ? 'text-green-500' : 'text-red-500'}`} title={b.status === 'paid' ? 'PAGO' : 'PENDENTE'}>
                  {b.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                </td>

                <td className="max-w-[120px] truncate whitespace-nowrap px-4 py-3" title={b.paidAt ? formatDate(b.paidAt) : '-'}>
                  {b.paidAt ? formatDate(b.paidAt) : '-'}
                </td>

                <td className="max-w-[120px] truncate whitespace-nowrap px-4 py-3" title={formatDate(b.dueDate)}>
                  {formatDate(b.dueDate)}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(b)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700">
                      <FaPencil />
                    </button>

                    <DangerHoldButton onComplete={() => deleteBilling(b.id)} seconds={1} />
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
