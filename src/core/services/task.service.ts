import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class TaskService {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Cron(CronExpression.EVERY_12_HOURS)
  public async renewFreeSubscriptions() {
    await this.subscriptionService.renewSubscriptions({
      ids: [],
      type: 'FREE',
    });
  }
}
