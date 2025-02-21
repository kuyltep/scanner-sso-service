import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus, SubscriptionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class PageQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page_number?: number = 0;
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page_size?: number = 20;
}

export class UserQueryDto extends PageQueryDto {
  @ApiProperty({
    required: false,
    enum: SubscriptionStatus,
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscription_status?: SubscriptionStatus;
  @ApiProperty({
    required: false,
    enum: SubscriptionType,
  })
  @IsOptional()
  @IsEnum(SubscriptionType)
  subscription_type?: SubscriptionType;
}
