type PaginationParams = {
  totalGeneratedAltTexts: number;
  currentPage: number;
  isChangingPage: boolean;
  pageEnd: number;
  handlePageChange: (nextPage: number) => void;
};

export default function Pagination({
  totalGeneratedAltTexts,
  currentPage,
  isChangingPage,
  pageEnd,
  handlePageChange,
}: PaginationParams) {
  return (
    <>
      {/* Pagination */}
      {totalGeneratedAltTexts > 1 && (
        <div className="flex items-center justify-between gap-4 pt-6">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isChangingPage}
              className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all cursor-pointer hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from(
                { length: Math.ceil(totalGeneratedAltTexts / 10) },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-10 w-10 rounded-lg transition-all cursor-pointer ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  disabled={currentPage === page || isChangingPage}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={pageEnd >= totalGeneratedAltTexts || isChangingPage}
              className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all cursor-pointer hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
