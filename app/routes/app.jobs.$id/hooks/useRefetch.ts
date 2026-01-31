import { $Enums } from "@prisma/client";
import { useEffect } from "react";
import { useRevalidator } from "react-router";
import { BulkSaveStatus } from "../types";

/**
 * Reloads the page data unless the job's status is completed,
 * and/or the alt texts have been saved.
 */
export default function useRefetch({
  status,
  bulkSaveStatus,
}: {
  status: $Enums.JobStatus;
  bulkSaveStatus: BulkSaveStatus;
}) {
  const revalidator = useRevalidator();

  useEffect(() => {
    if (status === "completed" || status === "failed") {
      if (
        (["Auto-Save", "Completed", "Failed"] as BulkSaveStatus[]).includes(
          bulkSaveStatus,
        )
      )
        // Skip auto-fetch if bulk save is autosave, completed, or failed
        return;
    }

    const interval = setInterval(async () => {
      await revalidator.revalidate();
    }, 2000);

    return () => clearInterval(interval);
  }, [status, revalidator, bulkSaveStatus]);
}
