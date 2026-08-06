import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

interface UsePaginatedListOptions {
  fetcher: (query: string, page: number, pageSize: number) => Promise<any>;
  pageSize: number;
  debounceMs?: number;
  onError?: (message: string) => void;
}

export const usePaginatedList = ({ fetcher, pageSize, debounceMs = 300, onError }: UsePaginatedListOptions) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const query = useDebouncedValue(searchTerm, debounceMs);

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const requestIdRef = useRef(0);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const load = useCallback(
    (p: number, q: string) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      return fetcher(q, p, pageSize)
        .then((r) => {
          if (requestId !== requestIdRef.current) return;
          setItems(r.items);
          setTotalPages(r.totalPages);
        })
        .catch(() => {
          if (requestId === requestIdRef.current) onErrorRef.current?.("Не удалось загрузить данные");
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoading(false);
        });
    },
    [fetcher, pageSize]
  );

  useEffect(() => {
    load(page, query);
  }, [page, query, load]);

  const reload = useCallback(() => load(page, query), [load, page, query]);

  return { items, totalPages, page, setPage, searchTerm, setSearchTerm, loading, reload };
};
