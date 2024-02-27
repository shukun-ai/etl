import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplateController } from './template.controller';
import { QueryController } from './query.controller';

@Module({
  imports: [],
  controllers: [AppController, TemplateController, QueryController],
  providers: [AppService],
})
export class AppModule {}
