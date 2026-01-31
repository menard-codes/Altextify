import { z } from "zod";

export const NewJobSchema = z.object({
  name: z.string(),
  scope: z.union([
    z.literal("allProducts"),
    z.literal("selectedProducts"),
    z.literal("selectedCollections"),
  ]),
  scopeIdentifiers: z.array(z.string()),
  onlyGenerateMissingAlt: z.boolean(),
  autoSave: z.boolean(),
});

export type NewJob = z.infer<typeof NewJobSchema>;

export type NewJobForm = {
  name: string;
  scope: NewJob["scope"];
  scopeIdentifiers: {
    id: string;
    name: string;
    previewImage: string;
  }[];
  onlyGenerateMissingAlt: boolean;
  autoSave: boolean;
};
