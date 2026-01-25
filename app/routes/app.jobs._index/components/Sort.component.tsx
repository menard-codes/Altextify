import { useEffect, useState } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";

export default function Sort() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "date:desc";
  const [sortState, setSortState] = useState(sort);

  useEffect(() => {
    if (sort !== sortState) {
      setSearchParams((prev) => {
        prev.set("sort", sortState);
        return prev;
      });
    }
  }, [sortState, sort, setSearchParams]);

  const navigation = useNavigation();
  const location = useLocation();
  const isChangingSort =
    navigation.state !== "idle" &&
    navigation.location.pathname === location.pathname;

  return (
    <select
      name="sort"
      value={sortState}
      onInput={(e) => setSortState(e.currentTarget.value)}
      disabled={isChangingSort}
      className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <option value="date:desc">Sort: Newest First</option>
      <option value="date:asc">Sort: Oldest First</option>
    </select>
  );
}
