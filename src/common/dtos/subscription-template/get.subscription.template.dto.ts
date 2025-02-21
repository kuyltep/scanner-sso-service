import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';

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
