import type { LoaderFunctionArgs } from "react-router";
import { data, useLoaderData } from "react-router";
import { authenticate } from "app/shopify.server";
import { getScanJobId } from "background-jobs/workers/alt-text-scan.worker";
import { altTextScanQueue } from "background-jobs/queues/alt-text-scan.queue";
import prisma from "app/db.server";
import Header from "./components/Header.component";
import FailedScan from "./components/FailedScan.component";

import DashboardLoader from "./components/DashboardLoader.component";

import "./styles.css";
import { useScan } from "./hooks/useScan";
import ScanReport from "./components/ScanReport";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  // get scan worker (state) or null
  const scanJobId = getScanJobId(session.shop);
  const scanJob = await altTextScanQueue.getJob(scanJobId);

  // get scan report
  const scanReport = await prisma.scanReport.findFirst({
    where: {
      shop: session.shop,
    },
  });

  return data({
    scan: {
      job: {
        status: await scanJob?.getState(),
      },
      report: scanReport,
    },
  });
};

export default function Index() {
  const { scan } = useLoaderData<typeof loader>();
  const { isPostingScanJob, isScanning, isFailedScan, handleRescan } = useScan({
    scanJobStatus: scan.job.status,
  });
  const loading = isPostingScanJob || isScanning;

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {loading && <DashboardLoader />}

        {isFailedScan && (
          <FailedScan
            isPostingScanJob={isPostingScanJob}
            handleRescan={handleRescan}
          />
        )}

        {scan.report && !loading && !isFailedScan && (
          <ScanReport
            report={scan.report}
            isPostingScanJob={isPostingScanJob}
            handleRescan={handleRescan}
          />
        )}
      </main>
    </div>
  );
}
