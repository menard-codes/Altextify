import SummaryStats from "./SummaryStats.component";
import ScanDetails from "./ScanDetails.component";
import ScanActions from "./ScanActions.component";
import DashboardTip from "./DashboardTip.component";

type ScanReportParams = {
  report: {
    imagesWithAltText: number;
    totalImages: number;
    lastScan: Date;
    shop: string;
  };
  isPostingScanJob: boolean;
  handleRescan: () => void;
};

export default function ScanReport({
  report: { imagesWithAltText, totalImages, lastScan, shop },
  isPostingScanJob,
  handleRescan,
}: ScanReportParams) {
  const altTextPercentage = Math.round((imagesWithAltText / totalImages) * 100);

  return (
    <div className="space-y-6">
      <SummaryStats
        imagesWithAltText={imagesWithAltText}
        totalImages={totalImages}
        altTextPercentage={altTextPercentage}
      />

      <div className="rounded-lg border border-border bg-card p-6">
        <ScanDetails
          altTextPercentage={altTextPercentage}
          lastScan={lastScan}
          shop={shop}
        />

        <ScanActions
          isPostingScanJob={isPostingScanJob}
          handleRescan={handleRescan}
        />
      </div>

      <DashboardTip />
    </div>
  );
}
