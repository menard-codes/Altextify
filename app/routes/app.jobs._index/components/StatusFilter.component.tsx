import { useEffect, useState } from "react";
import { useLocation, useNavigation, useSearchParams } from "react-router";

export default function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status") ?? "all";
  const [currentStatus, setCurrentStatus] = useState(selectedStatus);

  useEffect(() => {
    if (selectedStatus !== currentStatus) {
      setSearchParams((prev) => {
        prev.set("status", currentStatus);
        return prev;
      });
    }
  }, [currentStatus, selectedStatus, setSearchParams]);

  const navigation = useNavigation();
  const location = useLocation();
  const isChangingFilter =
    navigation.state !== "idle" &&
    navigation.location.pathname === location.pathname;

  return (
    <div className="flex gap-2 flex-wrap">
      {(["all", "waiting", "active", "completed", "failed"] as const).map(
        (status) => (
          <button
            key={status}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              currentStatus === status
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setCurrentStatus(status)}
            disabled={isChangingFilter}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ),
      )}
    </div>
  );
}
