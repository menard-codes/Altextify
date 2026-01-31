import { z } from "zod";

export function getURLSearchParams({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const searchParamsObject = Object.fromEntries(searchParams);
  return z
    .object({
      page: z.int().default(1),
    })
    .safeParse({
      ...searchParamsObject,
      page: Number(searchParams.get("page") ?? 1),
    });
}
