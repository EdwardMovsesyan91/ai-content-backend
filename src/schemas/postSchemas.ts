import { z } from "zod";

export const savePostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  isDraft: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});
