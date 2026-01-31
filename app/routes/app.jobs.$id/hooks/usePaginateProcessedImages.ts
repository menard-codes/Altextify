import { useCallback } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";

export default function usePaginateProcessedImages({
  itemsPerPage,
  totalGeneratedAltTexts,
}: {
  itemsPerPage: number;
  totalGeneratedAltTexts: number;
}) {
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

  const navigation = useNavigation();
  const location = useLocation();

  const pageStart = itemsPerPage > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const pageEnd = Math.min(currentPage * itemsPerPage, totalGeneratedAltTexts);
  const isChangingPage =
    navigation.state !== "idle" &&
    navigation.location.pathname === location.pathname;

  return {
    currentPage,
    pageStart,
    pageEnd,
    isChangingPage,
    handlePageChange,
  };
}
