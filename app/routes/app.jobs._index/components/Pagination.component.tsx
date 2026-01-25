import { useEffect, useState } from "react";
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
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  useEffect(() => {
    if (currentPage !== currentPageState) {
      setSearchParams((prev) => {
        prev.set("page", currentPageState.toString());
        return prev;
      });
    }
  }, [currentPageState, currentPage, setSearchParams]);

  const pageStart =
    itemsPerPage > 0 ? (currentPageState - 1) * itemsPerPage + 1 : 0;
  const pageEnd = currentPageState * itemsPerPage;

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
          onClick={() => setCurrentPageState((prev) => Math.max(prev - 1, 1))}
          disabled={currentPageState === 1 || isChangingPage}
          className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <p className="grid place-items-center h-10 w-10 rounded-lg transition-all bg-primary text-primary-foreground font-semibold">
          {currentPageState}
        </p>

        <button
          onClick={() => setCurrentPageState((prev) => prev + 1)}
          disabled={pageEnd === totalCount || isChangingPage}
          className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
