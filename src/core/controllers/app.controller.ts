import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';

@Controller('app')
export class AppController {
  @Public()
  @Get('/health')
  public getAppHealth() {
    return { message: 'ok' };
  }
}
