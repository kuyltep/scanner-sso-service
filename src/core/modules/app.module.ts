import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { SwaggerModule } from './swagger.module';
import { HealthModule } from './health.module';
import { AppController } from '../controllers/app.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../services/config.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guard';
import { ExceptionModule } from './exception.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { AllExceptionsFilter } from '../filters/catch.filter';
import { PrismaModule } from './prisma.module';
import { DateModule } from './date.module';
import { SubscriptionModule } from './subscription.module';
import { SubscriptionTemplateModule } from './subscription.template.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule,
    SwaggerModule,
    HealthModule,
    PrismaModule,
    DateModule,
    ExceptionModule,
    AuthModule,
    UserModule,
    SubscriptionModule,
    SubscriptionTemplateModule,
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        signOptions: { expiresIn: configService.getExpiresIn() },
        secret: configService.getJwtSecret(),
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      useClass: RolesGuard,
      provide: APP_GUARD,
    },
    {
      useClass: AllExceptionsFilter,
      provide: APP_FILTER,
    },
  ],
})
export class AppModule {}
