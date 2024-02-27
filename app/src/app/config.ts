import { BadRequestException } from "@nestjs/common";
import { readFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";

export const configSchema = z.object({
    sources: z.record(z.string(), z.object(
        {
            baseUrl: z.string(),
            orgName: z.string(),
            accessToken: z.string(),
            metadatas: z.record(z.string(), z.object({}))
        }
    )),
    convertorUrl: z.string(),
});

export type ConfigSchema = z.infer<typeof configSchema>;

export type SourceSchema = ConfigSchema['sources'][string];

export const readConfig = async (): Promise<ConfigSchema> => {
    const file = await readFile(join(process.cwd(), './config.json'), 'utf-8');
    return configSchema.parse(JSON.parse(file));
}

export const getSource = (config: ConfigSchema, sourceName: string) => {
    const source = config.sources[sourceName];
    if (!source) {
        throw new BadRequestException('No source');
    }
    return source;
}