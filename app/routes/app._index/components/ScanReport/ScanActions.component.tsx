import { Link } from "react-router";

type ScanActionsParams = {
  isPostingScanJob: boolean;
  handleRescan: () => void;
};

export default function ScanActions({
  isPostingScanJob,
  handleRescan,
}: ScanActionsParams) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <Link
        to="/app/new-job"
        className="flex-1 rounded-lg bg-linear-to-r from-accent to-primary px-4 py-3 font-medium text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/30 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
      >
        Generate Alt Texts
      </Link>
      <button
        onClick={handleRescan}
        disabled={isPostingScanJob}
        className="flex-1 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-medium text-primary transition-all hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isPostingScanJob ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            Re-scanning...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Re-scan
          </>
        )}
      </button>
    </div>
  );
}
