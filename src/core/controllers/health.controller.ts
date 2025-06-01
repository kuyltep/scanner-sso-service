import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '../services/config.service';
import { Public } from '../decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly configService: ConfigService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'app_health',
          `http://localhost:${this.configService.getAppPort()}/app/health`,
        ),
      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 750),
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 150),
    ]);
  }
}
