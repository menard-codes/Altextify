import prisma from "app/db.server";
import { BulkSaveStatus } from "../types";
import { bulkSaveIdGenerator } from "app/routes/api.bulk-save-alt-texts/utils";
import { altTextBulkSaveQueue } from "background-jobs/queues/alt-text-bulk-save.queue";

export async function getJobData({
  jobId,
  page,
}: {
  jobId: string;
  page: number;
}) {
  const job = await prisma.job.findFirst({ where: { id: jobId } });

  if (!job) return null;

  // Get bulk save status if not auto-save
  let bulkSaveStatus: BulkSaveStatus = "Auto-Save";
  if (!job.autoSave) {
    const bulkSaveJobId = bulkSaveIdGenerator(jobId);
    const bulkSaveJob = await altTextBulkSaveQueue.getJob(bulkSaveJobId);

    if (!bulkSaveJob) {
      bulkSaveStatus = "Not Started";
    } else {
      const bulkSaveState = await bulkSaveJob.getState();
      switch (bulkSaveState) {
        case "active": {
          bulkSaveStatus = "In Progress";
          break;
        }
        case "completed": {
          bulkSaveStatus = "Completed";
          break;
        }
        case "failed": {
          bulkSaveStatus = "Failed";
          break;
        }
        default: {
          bulkSaveStatus = "Not Started";
          break;
        }
      }
    }
  }

  // Get distinct productIds with pagination
  const take = 10;
  const skip = (page - 1) * take;
  const generatedAltTexts = await prisma.generatedAltText.findMany({
    where: { jobId },
    omit: { jobId: true },
    skip,
    take,
  });

  // Get total number of unique products for pagination
  const totalGeneratedAltTexts = await prisma.generatedAltText.count({
    where: { jobId },
  });

  return {
    job,
    generatedAltTexts: generatedAltTexts,
    itemsPerPage: take,
    totalGeneratedAltTexts,
    bulkSaveStatus,
  };
}
