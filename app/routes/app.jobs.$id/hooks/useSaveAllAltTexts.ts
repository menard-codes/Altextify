import { BulkAltSave } from "app/routes/api.bulk-save-alt-texts/BulkAltSaveSchema";
import { useCallback } from "react";
import { useFetcher } from "react-router";

export function useSaveAllAltTexts() {
  const fetcher = useFetcher();

  const handleBulkSaveAltTexts = useCallback(
    (bulkSavePayload: BulkAltSave) => {
      fetcher.submit(bulkSavePayload, {
        action: "/api/bulk-save-alt-texts",
        method: "POST",
        encType: "application/json",
      });
    },
    [fetcher],
  );

  const isSavingAll = fetcher.state !== "idle";

  return { isSavingAll, handleBulkSaveAltTexts };
}
