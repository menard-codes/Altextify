import { z } from "zod";

export const ProductImageAltGenSchema = z.object({
  autoSave: z.boolean(),
  generatedAltTextId: z.string(),
});

export type ProductImageAltGen = z.infer<typeof ProductImageAltGenSchema>;
