import { Controller } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
