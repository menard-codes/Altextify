import { authenticate } from "app/shopify.server";
import { data, LoaderFunctionArgs, useLoaderData } from "react-router";
import { HttpResponse } from "types/http-response.type";
import { z } from "zod";
import Header from "./components/Header.component";
import JobMetadata from "./components/JobMetadata";
import Timeline from "./components/Timeline";
import ProcessedImages from "./components/ProcessedImages";
import useRefetch from "./hooks/useRefetch";
import { getJobData } from "./server/get-job-data.server";
import { getURLSearchParams } from "./server/get-url-search-params.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const storeName = session.shop.replace(".myshopify.com", "");

  const searchParams = getURLSearchParams({ request });

  if (searchParams.error) {
    const errorDetails = z.treeifyError(searchParams.error);
    throw data(
      {
        type: "error",
        details: errorDetails,
      } as HttpResponse<undefined, typeof errorDetails>,
      { status: 400 },
    );
  }

  const jobId = params.id;
  const job = await getJobData({
    jobId: jobId ?? "",
    page: searchParams.data.page,
  });

  if (!job || !jobId) {
    throw data("Bulk alt text generation Job was not found", { status: 404 });
  }

  return data({
    ...job,
    storeName,
  });
}

export default function Page() {
  const {
    job,
    generatedAltTexts,
    totalGeneratedAltTexts,
    itemsPerPage,
    bulkSaveStatus,
    storeName,
  } = useLoaderData<typeof loader>();

  useRefetch({ status: job.status, bulkSaveStatus });

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/20">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-9 sm:px-8">
        <h2 className="mb-4 text-xl">
          <span className="font-bold">Task Name:</span> {job.name}
        </h2>

        <JobMetadata
          status={job.status}
          bulkSaveStatus={bulkSaveStatus}
          createdAt={job.createdAt}
          finishedOn={job.finishedOn}
          totalGeneratedAltTexts={totalGeneratedAltTexts}
        />

        <Timeline
          createdAt={job.createdAt}
          finishedOn={job.finishedOn}
          processedOn={job.processedOn}
          bulkSaveStatus={bulkSaveStatus}
        />

        <ProcessedImages
          jobId={job.id}
          autoSave={job.autoSave}
          bulkSaveStatus={bulkSaveStatus}
          generatedAltTexts={generatedAltTexts}
          itemsPerPage={itemsPerPage}
          status={job.status}
          storeName={storeName}
          totalGeneratedAltTexts={totalGeneratedAltTexts}
        />
      </main>
    </div>
  );
}
