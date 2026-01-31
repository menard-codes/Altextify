import { $Enums } from "@prisma/client";
import { BulkSaveStatus } from "../../types";
import StatusCard from "./StatusCard.component";
import AltTextsGeneratedCard from "./AltTextsGeneratedCard.component";
import DurationCard from "./DurationCard.component";
import LastUpdatedCard from "./LastUpdatedCard.component";

type JobMetadataParams = {
  status: $Enums.JobStatus;
  bulkSaveStatus: BulkSaveStatus;
  totalGeneratedAltTexts: number;
  createdAt: Date;
  finishedOn: Date | null;
};

export default function JobMetadata({
  status,
  bulkSaveStatus,
  totalGeneratedAltTexts,
  createdAt,
  finishedOn,
}: JobMetadataParams) {
  return (
    <div className="mb-12 grid gap-6 lg:grid-cols-4">
      <StatusCard status={status} bulkSaveStatus={bulkSaveStatus} />
      <AltTextsGeneratedCard totalGeneratedAltTexts={totalGeneratedAltTexts} />
      <DurationCard createdAt={createdAt} finishedOn={finishedOn} />
      <LastUpdatedCard createdAt={createdAt} finishedOn={finishedOn} />
    </div>
  );
}
