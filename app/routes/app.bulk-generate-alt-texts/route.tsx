import { authenticate } from "app/shopify.server";
import { bulkAltTextGenQueue } from "background-jobs/queues/alt-text-generation.queue";
import { BULK_ALT_TEXT_GENERATION } from "background-jobs/constants/queue-names";
import {
  ActionFunctionArgs,
  data,
  Form,
  redirect,
  useLocation,
  useNavigation,
  type LoaderFunctionArgs,
} from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  if (request.method.toUpperCase() === "DELETE") {
    await bulkAltTextGenQueue.obliterate({ force: true });
    return data("Done");
  }

  if (request.method.toUpperCase() !== "POST") {
    throw data("Method not allowed", { status: 405 });
  }

  const job = await bulkAltTextGenQueue.add(BULK_ALT_TEXT_GENERATION, {
    shop: session.shop,
  });

  return redirect(`/app/jobs/${job.id}`);
}

export default function Page() {
  const location = useLocation();
  const navigation = useNavigation();

  const isNavigating = navigation.state !== "idle";
  const isSubmittingFormHere =
    isNavigating && navigation.location?.pathname === location.pathname;
  const isBulkGenerating =
    isSubmittingFormHere && navigation.formMethod === "POST";
  const isPurging = isSubmittingFormHere && navigation.formMethod === "DELETE";

  return (
    <div>
      <Form method="POST">
        <s-button type="submit" loading={isBulkGenerating} disabled={isPurging}>
          Bulk Alt Text Generate
        </s-button>
      </Form>
      <Form method="DELETE">
        <s-button type="submit" loading={isPurging} disabled={isBulkGenerating}>
          Purge queue
        </s-button>
      </Form>
    </div>
  );
}
