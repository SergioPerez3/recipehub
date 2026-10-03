function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <nav className="pagination" aria-label="Paginación">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
        ‹ Anterior
      </button>

      {pages.map((number) => (
        <button
          key={number}
          className={number === page ? "active" : ""}
          aria-current={number === page ? "page" : undefined}
          onClick={() => onPageChange(number)}
        >
          {number + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        Siguiente ›
      </button>
    </nav>
  );
}

export default Pagination;