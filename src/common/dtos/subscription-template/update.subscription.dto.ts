import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateSubscriptionTemplateDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(SubscriptionType)
  type?: SubscriptionType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  version?: number;
}
