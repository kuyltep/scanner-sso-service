import { Global, Module } from '@nestjs/common';
import { SubscriptionTemplateController } from '../controllers/subscription.template.controller';
import { SubscriptionTemplateService } from '../services/subscription.template.service';

@Global()
@Module({
  controllers: [SubscriptionTemplateController],
  providers: [SubscriptionTemplateService],
})
export class SubscriptionTemplateModule {}
