import { useCallback } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";

type PaginationParams = {
  totalCount: number;
  itemsPerPage: number;
};

export default function Pagination({
  totalCount,
  itemsPerPage,
}: PaginationParams) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => {
        if (nextPage !== currentPage) {
          prev.set("page", `${nextPage}`);
        }
        return prev;
      });
    },
    [setSearchParams, currentPage],
  );

  const pageStart = itemsPerPage > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const pageEnd = currentPage * itemsPerPage;

  const navigation = useNavigation();
  const location = useLocation();
  const isChangingPage =
    navigation.state !== "idle" &&
    navigation.location.pathname === location.pathname;

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {pageStart} to {pageEnd} of {totalCount} jobs
      </div>

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
            { length: Math.ceil(totalCount / 10) },
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
          disabled={pageEnd >= totalCount || isChangingPage}
          className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all cursor-pointer hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
