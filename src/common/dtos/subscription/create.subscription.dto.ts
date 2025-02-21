import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(SubscriptionType)
  type: SubscriptionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  template_id: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  start_date?: Date = new Date();

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  scans: number;
}
