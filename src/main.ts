import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from './core/modules/swagger.module';
import { AppModule } from './core/modules/app.module';
import { ConfigService } from './core/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const swagger = app.get(SwaggerModule);
  swagger.use(app);
  swagger.config();

  const config = app.get(ConfigService);
  const port = config.getAppPort();

  await app.listen(port);
}
bootstrap();
