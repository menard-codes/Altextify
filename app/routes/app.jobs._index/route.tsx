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

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const searchParamsObject = Object.fromEntries(searchParams);
  const parsedSearchParams =
    JobsListSearchParamsSchema.safeParse(searchParamsObject);

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
        status: true,
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

  return data({
    jobs,
    totalCount,
  });
}

export default function Page() {
  const { jobs, totalCount } = useLoaderData<typeof loader>();

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

        <Pagination totalCount={totalCount} itemsPerPage={jobs.length} />
      </main>
    </div>
  );
}
