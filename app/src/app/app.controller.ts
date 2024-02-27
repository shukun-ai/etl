import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getData() {
    return 'hello world';
  }
}
