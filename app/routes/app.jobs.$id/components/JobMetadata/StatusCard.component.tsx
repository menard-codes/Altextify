import { $Enums } from "@prisma/client";
import { BulkSaveStatus } from "../../types";

type StatusCardParams = {
  status: $Enums.JobStatus;
  bulkSaveStatus: BulkSaveStatus;
};

export default function StatusCard({
  status,
  bulkSaveStatus,
}: StatusCardParams) {
  const getStatusColor = (status: $Enums.JobStatus) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border border-green-200";
      case "active":
        return "text-primary bg-primary/10 border border-primary/30";
      case "waiting":
      case "waitingChildren":
        return "text-yellow-600 bg-yellow-50 border border-yellow-200";
      case "delayed":
      case "prioritized":
      case "unknown":
        return "text-blue-600 bg-blue-50 border border-blue-200";
      case "failed":
        return "text-destructive bg-destructive/10 border border-destructive/30";
    }
  };

  const getStatusIcon = (status: $Enums.JobStatus) => {
    switch (status) {
      case "completed":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "active":
        return (
          <svg
            className="h-5 w-5 animate-spin"
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
        );
      case "waiting":
      case "waitingChildren":
      case "delayed":
      case "prioritized":
      case "unknown":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "failed":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getSaveStatusColor = (status?: BulkSaveStatus) => {
    switch (status) {
      case "Auto-Save":
      case "Completed":
        return "text-green-600 bg-green-50 border border-green-200";
      case "In Progress":
        return "text-primary bg-primary/10 border border-primary/30";
      case "Not Started":
        return "text-muted-foreground bg-secondary/50 border border-border/50";
      case "Failed":
        return "text-destructive bg-destructive/10 border border-destructive/30";
      default:
        return "text-muted-foreground bg-secondary/50 border border-border/50";
    }
  };

  const getSaveStatusIcon = (status?: BulkSaveStatus) => {
    switch (status) {
      case "Auto-Save":
      case "Completed":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "In Progress":
        return (
          <svg
            className="h-5 w-5 animate-spin"
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
        );
      case "Not Started":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Failed":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-sm font-semibold text-foreground">Job Status</h3>
      <div className="space-y-4">
        {/* Processing Status */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Processing
          </p>
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() +
              status.slice(1).replace(/-/g, " ")}
          </div>
        </div>

        {/* Save Status */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Saving
          </p>
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${getSaveStatusColor(bulkSaveStatus)}`}
          >
            {getSaveStatusIcon(bulkSaveStatus)}
            {bulkSaveStatus || "Not Set"}
          </div>
        </div>
      </div>
    </div>
  );
}
