import { useFetcher, useNavigate, useNavigation } from "react-router";
import { action } from "../../../api.bulk-generate-alt/route";
import { useCallback, useEffect } from "react";
import { bulkGenerateAltTexts } from "../../services/alt-generate.api";

type ScanActionsParams = {
  isPostingScanJob: boolean;
  handleRescan: () => void;
};

export default function ScanActions({
  isPostingScanJob,
  handleRescan,
}: ScanActionsParams) {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();

  useEffect(() => {
    const genAltFetcherData = fetcher.data;
    const genAltFetcherState = fetcher.state;
    if (genAltFetcherState === "idle" && genAltFetcherData?.job.id) {
      navigate(`/app/jobs/${genAltFetcherData.job.id}`);
    }
  }, [fetcher, navigate]);

  const handleBulkGenerateAltTexts = useCallback(() => {
    bulkGenerateAltTexts({ fetcher: fetcher });
  }, [fetcher]);

  const isBulkGenerating =
    fetcher.state !== "idle" || navigation.state !== "idle";

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleBulkGenerateAltTexts}
        disabled={isBulkGenerating || isPostingScanJob}
        className="flex-1 rounded-lg bg-linear-to-r from-accent to-primary px-4 py-3 font-medium text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/30 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isBulkGenerating ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-amber-50 border-y-teal-700 animate-spin"></div>
            Generating Alt Texts...
          </>
        ) : (
          "Generate Alt Texts"
        )}
      </button>
      <button
        onClick={handleRescan}
        disabled={isPostingScanJob || isBulkGenerating}
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
