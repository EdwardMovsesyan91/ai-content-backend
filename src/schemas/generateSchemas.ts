import { z } from "zod";

export const generateSchema = z.object({
  topic: z.string().min(3, "Topic is required"),
  style: z.string().min(3, "Style is required"),
});
