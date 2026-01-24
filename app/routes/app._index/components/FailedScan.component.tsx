type FailedScanParams = {
  isPostingScanJob: boolean;
  handleRescan: () => void;
};

export default function FailedScan({
  isPostingScanJob,
  handleRescan,
}: FailedScanParams) {
  return (
    <div className="mb-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-4">
        <div className="mt-1 rounded-lg bg-destructive/20 p-2 text-destructive">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Scan Failed</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We encountered an error while scanning your store. Please try again
            or contact support if the problem persists.
          </p>
          <button
            onClick={handleRescan}
            disabled={isPostingScanJob}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPostingScanJob ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin"></div>
                Retrying...
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
                Try Again
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
