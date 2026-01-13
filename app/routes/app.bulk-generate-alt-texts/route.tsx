import { authenticate } from "app/shopify.server";
import { type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  return null;
}

export default function Page() {
  return <p>Hello World</p>;
}
