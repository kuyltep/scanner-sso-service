import { ApiProperty } from '@nestjs/swagger';
import { PageQueryDto } from '../user/user.query.dto';
import { SubscriptionStatus, SubscriptionType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class QuerySubscriptionDto extends PageQueryDto {
  @ApiProperty({ required: false, enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({ required: false, enum: SubscriptionType })
  @IsOptional()
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;
}

export class QuerySubscriptionRenewDto {
  @ApiProperty({ required: false, isArray: true, type: String })
  @IsOptional()
  @Transform(({ value }) => (value && value.length ? value.split(',') : []))
  ids: string[] = [];

  @ApiProperty({ required: false, enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty({ required: false, enum: SubscriptionType })
  @IsOptional()
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;
}
