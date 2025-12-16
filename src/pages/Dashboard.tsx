import { useContext, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { GlobalEventsContext } from '@/contexts/GlobalEventsContext';

import { useBillings } from '@/hooks/useBillings';
import { useClients } from '@/hooks/useClients';

import AppLayout from '@/components/AppLayout';
import { formatMoney } from '@/utils/formatters';
import { useTranslation } from 'react-i18next';

interface ChartRow {
  ym: string;
  monthLabel: string;
  expected: number;
  paid: number;
  pending: number;
}

export default function Dashboard() {
  // Traduções
  const { t } = useTranslation();

  const { setError } = useContext(GlobalEventsContext);

  const { count: countAllClients } = useClients();
  const { fetchAllResumes: fetchAllBillings } = useBillings();

  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalPending, setTotalPending] = useState<number>(0);

  const [chartRows, setChartRows] = useState<ChartRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dateToYearMonth = (dateStr: string | null) => {
    if (!dateStr) return null;

    const full = new Date(dateStr);
    return `${full.getFullYear()}-${full.getMonth() + 1}`;
  };

  const yearMonthToLabel = (ym: string) => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m - 1).toLocaleString('pt-BR', { month: 'short' });
  };

  const load = async () => {
    setIsLoading(true);

    await fetchClients();
    await fetchBillings();

    setIsLoading(false);
  };

  const fetchClients = async () => {
    const { data, error } = await countAllClients();

    if (data) {
      setTotalClients(data);
    } else if (error) {
      setError(error.message);
    }
  };

  const fetchBillings = async () => {
    const { data, error } = await fetchAllBillings();

    if (data) {
      const paid = data.filter((b) => b.status === 'paid');
      const pending = data.filter((b) => b.status === 'pending');

      setTotalPaid(paid.reduce((acc, b) => acc + b.totalFee, 0));
      setTotalPending(pending.reduce((acc, b) => acc + b.totalFee, 0));

      const map: Record<string, { expected: number; paid: number; pending: number }> = {};

      for (const billing of data) {
        const dueYM = dateToYearMonth(billing.dueDate);
        const paidAtYM = dateToYearMonth(billing.paidAt);

        if (dueYM) {
          map[dueYM] ??= { expected: 0, paid: 0, pending: 0 };
          map[dueYM].expected += billing.totalFee;

          if (billing.status === 'pending') {
            map[dueYM].pending += billing.totalFee;
          }
        }

        if (paidAtYM && billing.status === 'paid') {
          map[paidAtYM] ??= { expected: 0, paid: 0, pending: 0 };
          map[paidAtYM].paid += billing.totalFee;
        }
      }

      const rows: ChartRow[] = Object.entries(map)
        .map(([ym, values]) => ({
          ym,
          monthLabel: yearMonthToLabel(ym),
          expected: values.expected,
          paid: values.paid,
          pending: values.pending,
        }))
        .sort((a, b) => (a.ym > b.ym ? 1 : -1));

      setChartRows(rows);
    } else if (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      {isLoading && <h2 className="col-span-full mt-6 text-center text-2xl font-semibold md:mt-12">{t('dashboard.loading-info')}</h2>}
      {!isLoading && (
        <div className="flex h-full flex-col">
          <h2 className="col-span-full mb-6 text-center text-2xl font-semibold">{t('dashboard.general')}</h2>

          {/* CARDS */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
            <div className="rounded-md bg-sidebar-hover2 p-6 shadow transition hover:bg-sidebar-hover">
              <p className="text-lg font-semibold text-white">{t('dashboard.clients-count')}</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">{totalClients}</p>
            </div>

            <div className="rounded-md bg-sidebar-hover2 p-6 shadow transition hover:bg-sidebar-hover">
              <p className="text-lg font-semibold text-white">{t('dashboard.total-paid')}</p>
              <p className="mt-2 text-2xl font-bold text-green-400">{formatMoney(totalPaid)}</p>
            </div>

            <div className="rounded-md bg-sidebar-hover2 p-6 shadow transition hover:bg-sidebar-hover">
              <p className="text-lg font-semibold text-white">{t('dashboard.total-pending')}</p>
              <p className="mt-2 text-2xl font-bold text-red-400">{formatMoney(totalPending)}</p>
            </div>
          </div>

          {/* GRÁFICO */}
          <div className="mt-10 min-h-[400px] flex-grow rounded-md bg-sidebar-hover2 p-10 shadow">
            <h2 className="mb-4 text-xl font-semibold text-white">{t('dashboard.month-info')}</h2>

            <div className="h-full w-full p-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRows}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="monthLabel" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const nameMap: Record<string, string> = {
                        expected: t('dashboard.month.total-expected'),
                        paid: t('dashboard.month.total-billed'),
                        pending: t('dashboard.month.total-pending'),
                      };
                      const displayName = nameMap[name] ?? name;
                      return [formatMoney(value), displayName];
                    }}
                    labelFormatter={(label) => `Mês: ${label}`}
                    isAnimationActive={false}
                  />
                  <Legend
                    formatter={(value: string) => {
                      const labelMap: Record<string, string> = {
                        expected: 'Esperado',
                        paid: 'Pago',
                        pending: 'Não pago',
                      };
                      return labelMap[value] ?? value;
                    }}
                  />

                  <Line type="linear" dataKey="expected" name="Esperado" stroke="#3b82f6" strokeWidth={2} dot />
                  <Line type="linear" dataKey="paid" name="Pago" stroke="#10b981" strokeWidth={2} dot />
                  <Line type="linear" dataKey="pending" name="Não pago" stroke="#ef4444" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
