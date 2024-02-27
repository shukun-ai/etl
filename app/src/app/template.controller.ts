import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { SourceRequester, AxiosAdaptor } from '@shukun/api';
import { MetadataSchema } from '@shukun/schema';
import { metadatasToTemplate } from './template.convertor';
import { stringify } from 'yaml';
import { SourceSchema, getSource, readConfig } from './config';

@Controller()
export class TemplateController {
  @Get('/generate')
  async generate(@Query() dto: unknown, @Res() response: Response,) {
    const { sourceName } = dtoSchema.parse(dto);
    const config = await readConfig();
    const source = getSource(config, sourceName);
    const metadatas: MetadataSchema[] = [];

    for (const atom of Object.keys(source.metadatas)) {
        const metadata = await this.fetchAtom(source, atom);
        metadatas.push(metadata);
    }

    const template = metadatasToTemplate(metadatas, {
        sourceName: sourceName
    });

    const yaml = stringify(template);

    return response
      .set('Content-Type', 'text/yaml')
      .send(yaml);
  }

  private async fetchAtom (source: SourceSchema, atomName: string): Promise<MetadataSchema> {
    const adaptor = new AxiosAdaptor({
        baseUrl: source.baseUrl,
        retries: 3,
        onOrgName: () => source.orgName,
        onAccessToken: () => source.accessToken
    })
    const requester = new SourceRequester(adaptor, atomName);
    const metadata = await requester.metadata();

    return metadata.data.value
  }
}

const dtoSchema = z.object({
  sourceName: z.string()
});
