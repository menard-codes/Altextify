import { BulkSaveStatus } from "../../types";
import CreatedTime from "./CreatedTime.component";
import FinishedTime from "./FinishedTime.component";
import ProcessedTime from "./ProcessedTime.component";
import AutoSave from "./Status/AutoSave.component";
import Completed from "./Status/Completed.component";
import Failed from "./Status/Failed.component";
import InProgress from "./Status/InProgress.component";
import NotStarted from "./Status/NotStarted.component";

type TimelineParams = {
  createdAt: Date;
  finishedOn: Date | null;
  processedOn: Date | null;
  bulkSaveStatus: BulkSaveStatus;
};

export default function Timeline({
  createdAt,
  finishedOn,
  processedOn,
  bulkSaveStatus,
}: TimelineParams) {
  return (
    <div className="mb-12 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Job Timeline
      </h2>
      <div className="space-y-4">
        <CreatedTime createdAt={createdAt} />

        {processedOn && <ProcessedTime processedOn={processedOn} />}

        {finishedOn && <FinishedTime finishedOn={finishedOn} />}

        {bulkSaveStatus === "Auto-Save" && <AutoSave />}

        {bulkSaveStatus === "Not Started" && <NotStarted />}

        {bulkSaveStatus === "In Progress" && <InProgress />}

        {bulkSaveStatus === "Failed" && <Failed />}

        {bulkSaveStatus === "Completed" && <Completed />}
      </div>
    </div>
  );
}
