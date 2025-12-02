import { useEffect, useRef, useState } from 'react';
import { IBilling, IAppResponseDTO } from '@t/dtos';

import Sidebar from '@/components/Sidebar';
import ErrorModal from '@/components/ErrorModal';

import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus } from 'react-icons/fa6';
import BillingModal from '@/components/BillingModal';
import DangerHoldButton from '@/components/DangerHoldButton';

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
});

export default function BillingsList() {
  const [error, setError] = useState<string | null>(null);
  const [billings, setBillings] = useState<IBilling[]>([]);

  // Paginação e filtro
  const [filter, setFilter] = useState<string>('');
  const isLoading = useRef<boolean>(false);
  const [offset, setOffset] = useState(0);
  const limit = 30;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalBilling, setModalBilling] = useState<IBilling | null>(null);

  // FETCH BASE
  const loadBillings = async (newOffset: number) => {
    if (isLoading.current) return;
    isLoading.current = true;

    const { data, error } = (await window.api.invoke('fetch-all-billings', offset, limit, filter)) as IAppResponseDTO<IBilling[]>;

    if (error) {
      setError(error.message);
    }

    if (data && Array.isArray(data)) {
      setBillings(data);
      setOffset(newOffset);
    }

    isLoading.current = false;
  };

  // Atualiza a lista sempre que o scroll mudar
  const handleScroll = async (e: React.UIEvent) => {
    const el = e.currentTarget;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    const atTop = el.scrollTop < 50;

    if (atBottom) {
      loadBillings(offset + limit);
    } else if (atTop && offset > 0) {
      loadBillings(Math.max(offset - limit, 0));
    }
  };

  // Abre o modal
  const openModal = (billing: IBilling | null = null) => {
    setModalBilling(billing);
    setIsModalOpen(true);
  };

  // Atualiza a lista
  useEffect(() => {
    loadBillings(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // DELETAR
  const deleteBilling = async (id: number) => {
    const { success, error } = (await window.api.invoke('delete-billing', id)) as IAppResponseDTO<IBilling>;

    if (!success && error) return setError(error.message);

    loadBillings(offset);
  };

  // RENDER
  return (
    <div className="flex min-h-screen bg-light-bg p-0">
      {/* MODAIS */}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      <BillingModal
        open={isModalOpen}
        billing={modalBilling}
        onClose={(success, error) => {
          setIsModalOpen(false);
          if (success) loadBillings(offset);
          else if (error) setError(error);
        }}
      />

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <div className="flex-grow bg-light-bg2 p-4 text-light-text">
        <h2 className="mt-5 text-center text-2xl font-semibold">SUAS COBRANÇAS</h2>

        {/* BARRA DE BUSCA */}
        <form className="my-5 flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-hover p-2 shadow-sm hover:bg-sidebar-bg">
          <IoMdSearch className="mx-1 text-xl text-sidebar-text" />
          <input
            type="search"
            className="w-full bg-transparent text-sidebar-text outline-none placeholder:text-light-placeholder"
            placeholder="BUSCAR POR CLIENTE"
            onChange={(ev) => setFilter(ev.target.value)}
          />

          <button
            type="button"
            onClick={() => openModal()}
            title="Cadastrar cobrança"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-hover2 text-white transition hover:bg-sidebar-hover"
          >
            <FaPlus />
          </button>
        </form>

        {/* TABELA */}
        <table className="w-full table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="border-b bg-sidebar-hover2 text-left text-sidebar-text">
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Valor</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Pagamento</th>
              <th className="px-4 py-3 font-semibold">Vencimento</th>
              <th className="px-4 py-3 text-center font-semibold">Ações</th>
            </tr>
          </thead>

          <tbody onScroll={handleScroll}>
            {billings.map((b, i) => (
              <tr key={i} className="border-b text-sidebar-text odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2">
                <td className="px-4 py-3">{b.client.name}</td>
                <td className="px-4 py-3">{b.fee}</td>
                <td className="px-4 py-3">{b.status === 'paid' ? 'PAGO' : 'PENDENTE'}</td>
                <td className="px-4 py-3">{b.paidAt ? dateFormat.format(b.paidAt) : '-'}</td>
                <td className="px-4 py-3">{dateFormat.format(b.dueDate)}</td>

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
    </div>
  );
}
