import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { TemplateController } from './template.controller';
import { QueryController } from './query.controller';

@Module({
  imports: [],
  controllers: [AppController, TemplateController, QueryController],
  providers: [],
})
export class AppModule {}
