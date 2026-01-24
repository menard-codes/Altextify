import { authenticate } from "app/shopify.server";
import { ALT_TEXT_SCAN } from "background-jobs/constants/queue-names";
import { altTextScanQueue } from "background-jobs/queues/alt-text-scan.queue";
import { getScanJobId } from "background-jobs/workers/alt-text-scan.worker";
import { ActionFunctionArgs, data } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  if (request.method.toUpperCase() !== "POST") {
    throw data("Method not allowed", { status: 405 });
  }

  const scanJobId = getScanJobId(session.shop);
  const scanJob = await altTextScanQueue.getJob(scanJobId);

  const status = await scanJob?.getState();
  if (status === "completed" || status === "failed") {
    await scanJob?.remove();
  }

  await altTextScanQueue.add(
    ALT_TEXT_SCAN,
    {
      shop: session.shop,
    },
    {
      jobId: scanJobId,
    },
  );

  return data({ jobId: scanJobId });
}
