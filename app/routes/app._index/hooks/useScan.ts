import { JobState } from "bullmq";
import { useCallback, useEffect } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { scanShopAltTexts } from "../services/scan.api";

type UseScanParams = {
  scanJobStatus: "unknown" | JobState | undefined;
};

/**
 * Encapsulates the scan logic for the Dashboard:
 * - Auto-scan (fresh install)
 * - Continuous checking of scan job status until it's complete
 * - Re-scan logic
 */
export function useScan({ scanJobStatus }: UseScanParams) {
  const scanFetcher = useFetcher();
  const isPostingScanJob = scanFetcher.state !== "idle";
  const isScanning =
    scanJobStatus !== "completed" && scanJobStatus !== "failed";
  const isFailedScan = scanJobStatus === "failed";

  const scanStoreImages = useCallback(() => {
    scanShopAltTexts({ fetcher: scanFetcher });
  }, [scanFetcher]);
  const handleRescan = useCallback(() => {
    if (scanJobStatus === "completed" || scanJobStatus === "failed") {
      scanStoreImages();
    }
  }, [scanJobStatus, scanStoreImages]);

  // ~ auto-scan if not yet scanning
  useEffect(() => {
    const hasNoScanJob = !scanJobStatus || scanJobStatus === "unknown";
    if (hasNoScanJob && !isPostingScanJob) {
      scanStoreImages();
    }
  }, [scanJobStatus, isPostingScanJob, scanStoreImages]);

  // ~ check scan job status every 2s until its complete/failed
  const revalidator = useRevalidator();
  useEffect(() => {
    const jobStatus = scanJobStatus;
    if (jobStatus === "completed" || jobStatus === "failed") {
      return;
    }
    const interval = setInterval(async () => {
      await revalidator.revalidate();
    }, 2000);
    return () => clearInterval(interval);
  }, [scanJobStatus, revalidator]);

  return {
    isPostingScanJob,
    isScanning,
    isFailedScan,
    handleRescan,
  };
}
