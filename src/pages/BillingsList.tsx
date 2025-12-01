import { useEffect, useRef, useState } from 'react';
import { IBilling, IAppResponseDTO } from '@t/dtos';

import Sidebar from '@/components/Sidebar';
import ErrorModal from '@/components/ErrorModal';

import { IoMdSearch } from 'react-icons/io';
import { FaPencil, FaPlus, FaTrash } from 'react-icons/fa6';
import BillingModal from '@/components/BillingModal';

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
    <div className="bg-light-bg flex min-h-screen p-0">
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
      <div className="bg-light-bg2 text-light-text flex-grow p-4">
        <h2 className="mt-5 text-center text-2xl font-semibold">SUAS COBRANÇAS</h2>

        {/* BARRA DE BUSCA */}
        <form className="bg-sidebar-hover border-sidebar-border hover:bg-sidebar-bg my-5 flex items-center gap-3 rounded-md border p-2 shadow-sm">
          <IoMdSearch className="text-sidebar-text mx-1 text-xl" />
          <input
            type="search"
            className="text-sidebar-text placeholder:text-light-placeholder w-full bg-transparent outline-none"
            placeholder="BUSCAR POR CLIENTE"
            onChange={(ev) => setFilter(ev.target.value)}
          />

          <button
            type="button"
            onClick={() => openModal()}
            title="Cadastrar cobrança"
            className="bg-sidebar-hover2 hover:bg-sidebar-hover flex h-10 w-10 items-center justify-center rounded-md text-white transition"
          >
            <FaPlus />
          </button>
        </form>

        {/* TABELA */}
        <table className="w-full table-fixed border-collapse text-sm shadow-sm">
          <thead>
            <tr className="bg-sidebar-hover2 text-sidebar-text border-b text-left">
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
              <tr key={i} className="odd:bg-sidebar-bg even:bg-sidebar-hover hover:bg-sidebar-hover2 text-sidebar-text border-b">
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

                    <button onClick={() => deleteBilling(b.id)} className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700">
                      <FaTrash />
                    </button>
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
