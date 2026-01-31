import { NewJobSchema } from "../new-job.schema";
import { z } from "zod";
import { HttpResponse } from "types/http-response.type";
import prisma from "app/db.server";
import { bulkAltTextGenQueue } from "background-jobs/queues/alt-text-generation.queue";
import { BULK_ALT_TEXT_GENERATION } from "background-jobs/constants/queue-names";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function createNewJob(request: Request, shop: string) {
  const rawBody = await request.json();
  const parsedBody = NewJobSchema.safeParse(rawBody);

  if (parsedBody.error) {
    const errorDetails = z.treeifyError(parsedBody.error);
    return {
      type: "error",
      details: errorDetails,
    } as HttpResponse<undefined, typeof errorDetails>;
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        shop,
        ...parsedBody.data,
      },
    });

    // Add to queue
    await bulkAltTextGenQueue.add(
      BULK_ALT_TEXT_GENERATION,
      { shop },
      { jobId: newJob.id },
    );

    return {
      type: "success",
      data: newJob,
    } as HttpResponse<typeof newJob, undefined>;
  } catch (error) {
    // Check by error code instead of instanceof
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as PrismaClientKnownRequestError;

      if (prismaError.code === "P2002") {
        const errorDetails = {
          properties: {
            name: {
              errors: ["A job with this name already exists"],
            },
          },
        };
        return {
          type: "error",
          details: errorDetails,
        } as HttpResponse<undefined, typeof errorDetails>;
      }
    }
    throw error;
  }
}
