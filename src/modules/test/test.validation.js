import { z } from "zod";

export const createTestSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});