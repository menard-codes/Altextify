import { authenticate } from "app/shopify.server";
import { ActionFunctionArgs, data } from "react-router";
import { BulkAltSaveSchema } from "./BulkAltSaveSchema";
import { z } from "zod";
import { HttpResponse } from "types/http-response.type";
import { altTextBulkSaveQueue } from "background-jobs/queues/alt-text-bulk-save.queue";
import { BULK_SAVE_ALT_TEXTS } from "background-jobs/constants/queue-names";
import { bulkSaveIdGenerator } from "./utils";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const method = request.method.toUpperCase();
  if (method !== "POST") {
    return data({ message: "Method Not Allowed" }, { status: 405 });
  }

  const shop = session.shop;
  const rawBody = await request.json();
  const parsedBody = BulkAltSaveSchema.safeParse(rawBody);

  if (parsedBody.error) {
    const errorDetails = z.treeifyError(parsedBody.error);
    return data(
      {
        type: "error",
        details: errorDetails,
      } as HttpResponse<undefined, typeof errorDetails>,
      { status: 400 },
    );
  }

  const bulkSaveJob = await altTextBulkSaveQueue.add(
    BULK_SAVE_ALT_TEXTS,
    {
      shop,
      altTextGenJobId: parsedBody.data.altTextGenJobId,
    },
    {
      jobId: bulkSaveIdGenerator(parsedBody.data.altTextGenJobId),
    },
  );

  const successData = {
    bulkSaveJob: {
      id: bulkSaveJob.id,
      status: await bulkSaveJob.getState(),
    },
  };

  return data({
    type: "success",
    data: successData,
  } as HttpResponse<typeof successData, undefined>);
}
