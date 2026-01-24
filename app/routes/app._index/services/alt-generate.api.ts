import { FetcherWithComponents } from "react-router";

type BulkGenerateAltTexts = {
  fetcher: FetcherWithComponents<unknown>;
};

export function bulkGenerateAltTexts({ fetcher }: BulkGenerateAltTexts) {
  const apiEndpoint = "/api/bulk-generate-alt";
  fetcher.submit(
    {},
    {
      method: "POST",
      action: apiEndpoint,
    },
  );
}
