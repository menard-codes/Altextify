import { authenticate } from "app/shopify.server";
import {
  data,
  LoaderFunctionArgs,
  useLoaderData,
  useRevalidator,
} from "react-router";
import { treeifyError } from "zod";
import { JobsListSearchParamsSchema } from "./jobs-list.schema";
import prisma from "app/db.server";
import { Prisma } from "@prisma/client";
import { useEffect } from "react";
import Header from "./components/Header.component";
import StatusFilter from "./components/StatusFilter.component";
import Sort from "./components/Sort.component";
import Pagination from "./components/Pagination.component";
import Table from "./components/Table";
import { BulkSaveStatus } from "../app.jobs.$id/types";
import { bulkSaveIdGenerator } from "../api.bulk-save-alt-texts/utils";
import { altTextBulkSaveQueue } from "background-jobs/queues/alt-text-bulk-save.queue";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const searchParamsObject = Object.fromEntries(searchParams);
  const parsedSearchParams = JobsListSearchParamsSchema.safeParse({
    ...searchParamsObject,
    page: Number(searchParams.get("page") ?? 1),
  });

  if (parsedSearchParams.error) {
    throw data({
      message: "Something went wrong",
      error: treeifyError(parsedSearchParams.error),
    });
  }

  const {
    data: { sort, status, page },
  } = parsedSearchParams;

  const limit = 10;
  const offset = (page - 1) * limit;

  const query: Prisma.JobFindManyArgs | Prisma.JobCountArgs = {
    where: {
      shop: session.shop,
      status: status !== "all" ? status : undefined,
    },
    orderBy: {
      createdAt: sort.split(":")[1] as "asc" | "desc",
    },
    take: limit,
    skip: offset,
  };

  const [jobs, totalCount] = await prisma.$transaction([
    prisma.job.findMany({
      ...(query as Prisma.JobFindManyArgs),
      select: {
        id: true,
        name: true,
        status: true,
        autoSave: true,
        createdAt: true,
        processedOn: true,
        finishedOn: true,
        _count: {
          select: {
            generatedAltTexts: true,
          },
        },
      },
    }),
    prisma.job.count(query as Prisma.JobCountArgs),
  ]);

  const jobsWithSaveStatus = await Promise.all(
    jobs.map(async (job) => {
      // Get bulk save status if not auto-save
      let bulkSaveStatus: BulkSaveStatus = "Auto-Save";
      if (!job.autoSave) {
        const bulkSaveJobId = bulkSaveIdGenerator(job.id);
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

      return {
        ...job,
        bulkSaveStatus,
      };
    }),
  );

  return data({
    jobs: jobsWithSaveStatus,
    totalCount,
    itemsPerPage: limit,
  });
}

export default function Page() {
  const { jobs, totalCount, itemsPerPage } = useLoaderData<typeof loader>();

  // Polling every 2s if there's at least one in progress job in current page
  const revalidator = useRevalidator();
  useEffect(() => {
    const hasActive = Boolean(jobs.find((job) => job.status === "active"));
    if (!hasActive) {
      return;
    }

    const interval = setInterval(async () => {
      await revalidator.revalidate();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobs, revalidator]);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Table Actions */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilter />
          <Sort />
        </div>

        <Table jobs={jobs} />

        <Pagination totalCount={totalCount} itemsPerPage={itemsPerPage} />
      </main>
    </div>
  );
}
