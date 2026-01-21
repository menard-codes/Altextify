import { authenticate } from "app/shopify.server";
import { BulkUpdateImageAltTextsProgress } from "background-jobs/processors/alt-text-gen/types";
import { StepStatus } from "background-jobs/processors/types/shared";
import { bulkAltTextGenQueue } from "background-jobs/queues/alt-text-generation.queue";
import { ReactElement, useEffect } from "react";
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
  const progress = job.progress as BulkUpdateImageAltTextsProgress;
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

  const statusBadge: Record<
    typeof state,
    "info" | "neutral" | "warning" | "success" | "critical" | "auto" | "caution"
  > = {
    waiting: "neutral",
    "waiting-children": "neutral",
    delayed: "warning",
    prioritized: "info",
    active: "info",
    completed: "success",
    failed: "critical",
    unknown: "caution",
  };
  const statusIcon: Record<StepStatus, ReactElement> = {
    Pending: <s-icon tone="neutral" type="clock-revert"></s-icon>,
    "In Progress": <s-icon tone="info" type="replay"></s-icon>,
    Completed: <s-icon tone="success" type="check-circle-filled"></s-icon>,
    Cancelled: <s-icon tone="caution" type="x"></s-icon>,
    Failed: <s-icon tone="critical" type="alert-octagon-filled"></s-icon>,
  };

  const JobStep = ({ step, status }: { step: string; status: StepStatus }) => (
    <div>
      <s-paragraph>
        {statusIcon[status]}
        {step}
      </s-paragraph>
    </div>
  );
  const JobStepsProgress = Object.keys(progress)
    .map((i) => +i)
    .sort((a, b) => a - b)
    .map((step) => {
      const { status, stepName } = progress[step];
      return <JobStep key={step} status={status} step={stepName} />;
    });

  return (
    <div>
      <h1>Job ID: {jobId}</h1>
      <s-badge tone={statusBadge[state]}>{state}</s-badge>
      <h2>Progress</h2>
      {JobStepsProgress}
    </div>
  );
}
