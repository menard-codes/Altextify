import { z } from "zod";

export const BulkAltSaveSchema = z.object({
  altTextGenJobId: z.string(),
});

export type BulkAltSave = z.infer<typeof BulkAltSaveSchema>;
