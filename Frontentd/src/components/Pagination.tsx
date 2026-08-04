import { Pagination as BsPagination } from "react-bootstrap";

const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) pages.push(1, "…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) pages.push("…", totalPages);

  return (
    <BsPagination className="justify-content-center mt-4">
      <BsPagination.Prev disabled={page <= 1} onClick={() => onChange(page - 1)} />
      {pages.map((p, i) =>
        p === "…" ? (
          <BsPagination.Ellipsis key={`e${i}`} disabled />
        ) : (
          <BsPagination.Item key={p} active={p === page} onClick={() => onChange(p)}>
            {p}
          </BsPagination.Item>
        )
      )}
      <BsPagination.Next disabled={page >= totalPages} onClick={() => onChange(page + 1)} />
    </BsPagination>
  );
};

export default Pagination;
