import { z } from "zod";

export const healthSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.string().datetime()
});

export type HealthResponse = z.infer<typeof healthSchema>;
