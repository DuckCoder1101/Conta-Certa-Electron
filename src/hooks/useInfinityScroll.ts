import { useState, useCallback, useRef } from 'react';

export function useInfiniteScroll<T>(fetchFn: (offset: number) => Promise<T[]>, pageSize: number = 30) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // GUARDAMOS o offset atual em um ref
  const offsetRef = useRef(0);

  const load = useCallback(
    async (offset?: number) => {
      if (loading) return;

      setLoading(true);

      // Se offset não foi passado → mantém o atual
      const realOffset = offset ?? offsetRef.current;

      // Se offset = 0 → reset
      if (offset === 0) {
        setItems([]);
        offsetRef.current = 0;
      }

      const data = await fetchFn(realOffset);

      if (offset === 0) {
        // reset total
        setItems(data);
      } else if (offset === undefined) {
        // load sem mudar offset
        // substitui os itens mas com mesmo offset
        setItems(data);
      } else {
        // append normal
        setItems((prev) => [...prev, ...data]);
      }

      // Atualiza hasMore
      setHasMore(data.length >= pageSize);

      // Avança offset somente se foi carregamento incremental
      if (offset !== undefined && offset !== 0) {
        offsetRef.current = realOffset + data.length;
      }

      setLoading(false);
    },
    [fetchFn, loading, pageSize],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTableSectionElement>) => {
      const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
      const nearBottom = scrollHeight - scrollTop <= clientHeight * 1.5;

      if (nearBottom && !loading && hasMore) {
        load(offsetRef.current); // load incremental
      }
    },
    [load, loading, hasMore],
  );

  return {
    items,
    loading,
    load,
    hasMore,
    handleScroll,
  };
}
