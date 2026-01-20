import { authenticate } from "app/shopify.server";
import { bulkAltTextGenQueue } from "background-jobs/queues/alt-text-generation.queue";
import { useEffect } from "react";
import {
  data,
  LoaderFunctionArgs,
  useLoaderData,
  useRevalidator,
} from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticate.admin(request);

  const jobId = params.id;
  const job = await bulkAltTextGenQueue.getJob(jobId ?? "");

  if (!job) {
    throw data("Bulk alt text generation Job was not found", { status: 404 });
  }

  const state = await job.getState();
  const progress = job.progress;
  return data({
    jobId,
    state,
    progress,
  });
}

export default function Page() {
  const { jobId, progress, state } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (state === "completed" || state === "failed") {
      return;
    }

    const interval = setInterval(async () => {
      await revalidator.revalidate();
    }, 2000);

    return () => clearInterval(interval);
  }, [state, revalidator]);

  return (
    <div>
      <h1>Job ID: {jobId}</h1>
      <p>
        {/* TODO: Progress needs further configuration as it always display 0 */}
        <strong>Progress:</strong> {progress.toString()}
      </p>
      <p>
        <strong>Status: {state}</strong>
      </p>
    </div>
  );
}
