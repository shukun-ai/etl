import { z } from "zod";

export const configSchema = z.object({
    sources: z.record(z.string(), z.object({
        url: z.string(),
        orgName: z.string(),
        accessToken: z.string().optional()
    })),
    destination: z.object({
        host: z.string(),
        port: z.number().int(),
        database: z.string(),
        username: z.string(),
        password: z.string().optional()
    })
});

export type ConfigSchema = z.infer<typeof configSchema>;