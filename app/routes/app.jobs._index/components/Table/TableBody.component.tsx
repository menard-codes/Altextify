import { $Enums } from "@prisma/client";
import { BulkSaveStatus } from "app/routes/app.jobs.$id/types";
import { useNavigate } from "react-router";

type TableBodyParams = {
  jobs: {
    id: string;
    name: string;
    autoSave: boolean;
    bulkSaveStatus: BulkSaveStatus;
    status: $Enums.JobStatus;
    createdAt: Date;
    processedOn: Date | null;
    finishedOn: Date | null;
    _count: {
      generatedAltTexts: number;
    };
  }[];
};

export default function TableBody({ jobs }: TableBodyParams) {
  const getStatusColor = (
    status: $Enums.JobStatus,
    bulkSaveStatus: BulkSaveStatus,
  ) => {
    switch (status) {
      case "completed":
        if (bulkSaveStatus === "Auto-Save" || bulkSaveStatus === "Completed") {
          return "text-green-600 bg-green-50 border border-green-200";
        }

        switch (bulkSaveStatus) {
          case "Failed":
          case "Not Started": {
            return "text-yellow-600 bg-yellow-50 border border-yellow-200";
          }
          case "In Progress":
          default: {
            return "text-primary bg-primary/10 border border-primary/30";
          }
        }
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

  const getStatusIcon = (
    status: $Enums.JobStatus,
    bulkSaveStatus: BulkSaveStatus,
  ) => {
    switch (status) {
      case "completed": {
        if (bulkSaveStatus === "Auto-Save" || bulkSaveStatus === "Completed") {
          return (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          );
        }

        switch (bulkSaveStatus) {
          case "Failed":
          case "Not Started": {
            return (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
                  clipRule="evenodd"
                />
              </svg>
            );
          }
          case "In Progress":
          default: {
            return (
              <svg
                className="h-4 w-4 animate-spin"
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
          }
        }
      }
      case "active":
        return (
          <svg
            className="h-4 w-4 animate-spin"
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
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "failed":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getStatusText = (
    status: $Enums.JobStatus,
    bulkSaveStatus: BulkSaveStatus,
  ) => {
    if (status === "completed") {
      if (bulkSaveStatus === "Auto-Save" || bulkSaveStatus === "Completed")
        return "Completed";

      return "Pending Save";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (createdAt: Date, finishedOn?: Date) => {
    if (!finishedOn) return "-";
    const seconds = Math.floor(
      (finishedOn.getTime() - createdAt.getTime()) / 1000,
    );
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const navigate = useNavigate();

  return jobs.map((job, index) => (
    <tr
      key={job.id}
      className={`border-b border-border/50 cursor-pointer transition-all duration-150 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 ${
        index % 2 === 0 ? "bg-background/50" : ""
      }`}
      onClick={() => navigate(`/app/jobs/${job.id}`)}
    >
      <td className="px-6 py-4 text-sm">{job.name}</td>
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${getStatusColor(job.status, job.bulkSaveStatus)}`}
        >
          {getStatusIcon(job.status, job.bulkSaveStatus)}
          {getStatusText(job.status, job.bulkSaveStatus)}
        </div>
      </td>
      <td className="px-6 py-4 text-xs">
        {job.autoSave ? "Auto-Save" : "Manual Save"}
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">
        {formatDate(job.createdAt)}
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">
        {job.processedOn ? formatDate(job.processedOn) : "-"}
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">
        {job.finishedOn ? formatDate(job.finishedOn) : "-"}
      </td>
      <td className="px-6 py-4 text-xs font-medium text-foreground text-center">
        {job._count.generatedAltTexts}
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground text-center">
        {calculateDuration(job.createdAt, job.finishedOn || undefined)}
      </td>
    </tr>
  ));
}
