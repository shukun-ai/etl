import {
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';

import { z } from 'zod';
import { SourceSchema, getSource, readConfig } from './config';
import { AxiosAdaptor, SourceRequester } from '@shukun/api';

@Controller()
export class QueryController {

  @Get('/query/:sourceName/:atomName')
  async getData(
    @Param('sourceName') sourceName: string,
    @Param('atomName') atomName: string,
    @Query() dto: unknown
  ) {
    const props = dtoSchema.parse(dto);
    const config = await readConfig();
    const source = getSource(config, sourceName);

    const rows = await this.fetchSource(source, atomName, props);

    return rows.map(row => {
      const { _id, __v, ...props } = row;

      return {
        ...props,
        id: _id,
      }
    });
  }

  private async fetchSource(
    source: SourceSchema,
    atomName: string,
    props: DtoSchema
  ) {
    const adaptor = new AxiosAdaptor({
      baseUrl: source.baseUrl,
      retries: 3,
      onOrgName: () => source.orgName,
      onAccessToken: () => source.accessToken,
    });
    const requester = new SourceRequester(adaptor, atomName);
    const metadata = await requester.query({
      limit: props.limit,
      skip: props.offset,
      filter: {
        updatedAt: {
          $gte: props.minUpdatedAt.toISOString(),
          $lte: props.maxUpdatedAt.toISOString(),
        },
      }
    });

    return metadata.data.value;
  }
}

const dtoSchema = z.object({
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10)),
  offset: z
    .string()
    .optional()
    .default('0')
    .transform((val) => parseInt(val, 10)),
  minUpdatedAt: z
    .string()
    .optional()
    .transform((val) =>
      val ? new Date(val) : new Date(2000, 0, 26, 0, 0, 0, 0)
    ),
  maxUpdatedAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
});

type DtoSchema = z.infer<typeof dtoSchema>;
