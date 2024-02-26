import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { AppService } from './app.service';

import { appSchema } from './app.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/db/:dbName/collection/:collectionName')
  async getData(
    @Param('dbName') dbName: string,
    @Param('collectionName') collectionName: string,
    @Query()
    queries: {
      limit: string;
      offset: string;
      minUpdatedAt: string;
      maxUpdatedAt: string;
    }
  ) {
    const parsedQueries = this.getQueries(queries);
    const rows = await this.appService.getData(
      { dbName, collectionName },
      parsedQueries
    );
    return rows;
  }

  getQueries(queries: unknown) {
    try {
      const parsedQueries = appSchema.parse(queries);
      return parsedQueries;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
