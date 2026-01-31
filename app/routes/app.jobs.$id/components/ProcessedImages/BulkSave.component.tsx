import { $Enums } from "@prisma/client";
import { useSaveAllAltTexts } from "../../hooks/useSaveAllAltTexts";
import { BulkSaveStatus } from "../../types";

type BulkSaveParams = {
  jobId: string;
  status: $Enums.JobStatus;
  bulkSaveStatus: BulkSaveStatus;
};

export default function BulkSave({
  jobId,
  status,
  bulkSaveStatus,
}: BulkSaveParams) {
  const { handleBulkSaveAltTexts, isSavingAll } = useSaveAllAltTexts();

  return (
    <button
      onClick={() => handleBulkSaveAltTexts({ altTextGenJobId: jobId })}
      disabled={
        isSavingAll ||
        (status !== "completed" && status !== "failed") ||
        bulkSaveStatus === "In Progress" ||
        bulkSaveStatus === "Completed"
      }
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
        bulkSaveStatus === "Failed"
          ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20"
          : "bg-linear-to-r from-accent to-primary text-accent-foreground hover:shadow-lg hover:shadow-accent/30 disabled:opacity-60 disabled:cursor-not-allowed"
      }`}
    >
      {isSavingAll ? (
        <>
          <div className="h-3 w-3 rounded-full border-2 border-current/30 border-t-current animate-spin"></div>
          Saving All Alt Texts...
        </>
      ) : bulkSaveStatus === "Completed" ? (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          All Alt Texts Saved
        </>
      ) : bulkSaveStatus === "Failed" ? (
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
          Retry Saving All Alt Texts
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save All Alt Texts
        </>
      )}
    </button>
  );
}
