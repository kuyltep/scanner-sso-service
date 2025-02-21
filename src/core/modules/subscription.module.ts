import { Global, Module } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionController } from '../controllers/subscription.controller';

@Global()
@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
