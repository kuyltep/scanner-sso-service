import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, SubscriptionType } from '@prisma/client';

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

export class GetSubscriptionTemplateDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  type: SubscriptionType;
  @ApiProperty()
  price: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  version: number;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}

export class GetSubscriptionDto extends GetSubscriptionsDto {
  @ApiProperty()
  template: GetSubscriptionTemplateDto;
}
