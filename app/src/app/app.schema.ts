import { z } from "zod";

export const appSchema = z.object({
    limit: z.string().optional().default('10').transform((val) => parseInt(val, 10)),
    offset: z.string().optional().default('0').transform((val) => parseInt(val, 10)),
    minUpdatedAt: z.string().optional().transform((val) => val ? new Date(val) : new Date(2000, 0, 26, 0, 0, 0, 0)),
    maxUpdatedAt: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
  });

export type AppSchema = z.infer<typeof appSchema>;
