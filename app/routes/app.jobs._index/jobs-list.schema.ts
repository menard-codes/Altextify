import { z } from "zod";

export const JobsListSearchParamsSchema = z.object({
  status: z
    .union([
      z.literal("all"),
      z.literal("waiting"),
      z.literal("active"),
      z.literal("completed"),
      z.literal("failed"),
    ])
    .default("all"),
  sort: z
    .union([z.literal("date:asc"), z.literal("date:desc")])
    .default("date:desc"),
  page: z.int().min(1).default(1),
});

type JobsListSearchParams = z.infer<typeof JobsListSearchParamsSchema>;
export type JobsListStatus = JobsListSearchParams["status"];
export type JobsListSort = JobsListSearchParams["sort"];
