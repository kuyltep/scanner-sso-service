import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';
import { GetSubscriptionTemplateDto } from '../subscription-template/get.subscription.template.dto';

export class GetSubscriptionsDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  template_id: string;
  @ApiProperty()
  scans: number;
  @ApiProperty()
  start_date: Date;
  @ApiProperty()
  end_date: Date;
  @ApiProperty()
  status: SubscriptionStatus;
}

export class GetSubscriptionDto extends GetSubscriptionsDto {
  @ApiProperty()
  template: GetSubscriptionTemplateDto;
}
