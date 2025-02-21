import { SubscriptionStatus, SubscriptionType } from '@prisma/client';

export class UserQueryDto {
  page_number?: number = 0;
  page_size?: number = 20;
  subscription_id?: string;
  subscription_status?: SubscriptionStatus;
  subscription_type?: SubscriptionType;
}
