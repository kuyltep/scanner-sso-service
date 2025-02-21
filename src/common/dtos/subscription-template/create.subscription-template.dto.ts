import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SubscriptionType)
  type: SubscriptionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  version?: number;
}
