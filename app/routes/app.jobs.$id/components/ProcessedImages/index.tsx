import { $Enums } from "@prisma/client";
import { BulkSaveStatus } from "../../types";
import BulkSave from "./BulkSave.component";
import ProcessedImagesTable from "./ProcessedImagesTable";
import usePaginateProcessedImages from "../../hooks/usePaginateProcessedImages";

type ProcessedImagesParams = {
  generatedAltTexts: {
    id: string;
    generatedAltText: string;
    imageId: string;
    originalAltText: string;
    url: string;
    productId: string;
    productName: string;
    variantId: string | null;
  }[];
  autoSave: boolean;
  jobId: string;
  itemsPerPage: number;
  totalGeneratedAltTexts: number;
  status: $Enums.JobStatus;
  bulkSaveStatus: BulkSaveStatus;
};

export default function ProcessedImages({
  jobId,
  generatedAltTexts,
  autoSave,
  itemsPerPage,
  totalGeneratedAltTexts,
  status,
  bulkSaveStatus,
}: ProcessedImagesParams) {
  const { handlePageChange, isChangingPage, pageEnd, pageStart, currentPage } =
    usePaginateProcessedImages({ itemsPerPage, totalGeneratedAltTexts });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Generated Alt Texts ({generatedAltTexts.length})
        </h2>
        <div className="flex items-center gap-4">
          {!autoSave && (
            <BulkSave
              jobId={jobId}
              bulkSaveStatus={bulkSaveStatus}
              status={status}
            />
          )}
          {totalGeneratedAltTexts > 1 && (
            <p className="text-sm text-muted-foreground">
              Showing {pageStart} to {pageEnd} of {totalGeneratedAltTexts}
            </p>
          )}
        </div>
      </div>

      <ProcessedImagesTable
        generatedAltTexts={generatedAltTexts}
        jobAutoSave={autoSave}
        bulkSaveStatus={bulkSaveStatus}
        pagination={{
          currentPage,
          isChangingPage,
          pageEnd,
          totalGeneratedAltTexts,
          handlePageChange,
        }}
      />
    </div>
  );
}
