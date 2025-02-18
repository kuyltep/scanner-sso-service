import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from './services/config.service';
import { SwaggerModule } from './modules/swagger.module';
import { ValidationPipe } from '@nestjs/common';


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
