import React, { useState, useCallback, useRef } from 'react';

type Direction = 'up' | 'down';

export function useInfiniteScroll<T>(fetchFn: (offset: number, limit: number) => Promise<T[]>, pageSize: number = 30) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  const lastScrollTopRef = useRef(0);

  const load = useCallback(
    async (direction: Direction) => {
      if (loadingRef.current || !hasMoreRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      const offset = direction === 'down' ? offsetRef.current : Math.max(offsetRef.current - pageSize, 0);

      const data = await fetchFn(offset, pageSize);
      setItems(data);

      if (direction === 'down') {
        offsetRef.current += data.length;
      } else {
        offsetRef.current -= data.length;
      }

      hasMoreRef.current = data.length === pageSize;

      loadingRef.current = false;
      setLoading(false);
    },
    [fetchFn, pageSize],
  );

  const handleScroll = useCallback(
    async (e: React.UIEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      const scrollingDown = scrollTop > lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      const nearBottom = scrollHeight - scrollTop <= clientHeight * 1.5;
      const nearTop = scrollTop <= clientHeight * 0.5;

      if (scrollingDown && nearBottom) {
        await load('down');
      }

      if (!scrollingDown && nearTop && offsetRef.current > pageSize) {
        await load('up');
      }
    },
    [load, pageSize],
  );

  const reset = useCallback(() => {
    setItems([]);
    offsetRef.current = 0;
    hasMoreRef.current = true;
  }, []);

  const reload = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const data = await fetchFn(offsetRef.current - pageSize, pageSize);
    setItems(data);

    loadingRef.current = false;
    setLoading(false);
  }, [fetchFn, pageSize]);

  return {
    items,
    loading,
    handleScroll,
    reset,
    reload,
  };
}
