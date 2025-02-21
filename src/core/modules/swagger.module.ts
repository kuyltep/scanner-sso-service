import { Global, INestApplication, Module } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule as NestSwaggerModule,
} from '@nestjs/swagger';
@Global()
@Module({ imports: [NestSwaggerModule] })
export class SwaggerModule {
  private app: INestApplication;

  public config() {
    const document = new DocumentBuilder()
      .setTitle('SSO service for smart shoe')
      .setDescription('API Operations for SSO service Smart Shoe')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token in the format: Bearer <token>',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const documentFactory = () =>
      NestSwaggerModule.createDocument(this.app, document, {
        autoTagControllers: true,
      });

    return NestSwaggerModule.setup('/documentation', this.app, documentFactory);
  }

  public use(app: INestApplication) {
    this.app = app;
  }
}
