import { FetcherWithComponents } from "react-router";

type ScanShopAltTextsParams = {
  fetcher: FetcherWithComponents<unknown>;
};

export function scanShopAltTexts({ fetcher }: ScanShopAltTextsParams) {
  const apiEndpoint = "/api/scan-alt-texts";
  fetcher.submit(
    {},
    {
      method: "POST",
      action: apiEndpoint,
    },
  );
}
