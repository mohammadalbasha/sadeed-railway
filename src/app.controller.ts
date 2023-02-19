import { Controller, Get } from '@nestjs/common';
import { IsNotGraphQL } from './modules/common/auth/decorators/isNotGraphQL.decorator';

@Controller()
export class AppController {
  @IsNotGraphQL()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }


  private start: number;

  constructor() {
      this.start = Date.now();
  }

  @IsNotGraphQL()
  @Get('healthcheck')
  async healthcheck() {
      const now = Date.now();
      return {
          status: 'API Online',
          uptime: Number((now - this.start) / 1000).toFixed(0),
      };
  }
}
