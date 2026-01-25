import prisma from "app/db.server";
import { authenticate } from "app/shopify.server";
import { BULK_ALT_TEXT_GENERATION } from "background-jobs/constants/queue-names";
import { bulkAltTextGenQueue } from "background-jobs/queues/alt-text-generation.queue";
import { ActionFunctionArgs, data } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  if (request.method.toUpperCase() !== "POST") {
    throw data("Method not allowed", { status: 405 });
  }

  // TODO: This could be improved: option to only generate alt texts to those missing alts
  const jobRecord = await prisma.job.create({
    data: {
      shop: session.shop,
    },
  });
  await bulkAltTextGenQueue.add(
    BULK_ALT_TEXT_GENERATION,
    {
      shop: session.shop,
    },
    {
      jobId: jobRecord.id,
    },
  );

  return data({
    job: {
      id: jobRecord.id,
    },
  });
}
