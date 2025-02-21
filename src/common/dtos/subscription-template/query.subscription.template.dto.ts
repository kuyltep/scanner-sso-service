import { SubscriptionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PageQueryDto } from '../user/user.query.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionTemplateQueryDto extends PageQueryDto {
  @ApiProperty({ required: false, enum: SubscriptionType })
  @IsOptional()
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  min_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  max_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  min_limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  max_limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  version?: number;
}
