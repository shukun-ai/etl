import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/db/:dbName/collection/:collectionName')
  async getData(
    @Param('dbName') dbName: string,
    @Param('collectionName') collectionName: string,
  ) {
    const rows = await this.appService.getData({dbName, collectionName});
    return rows;
  }
}
