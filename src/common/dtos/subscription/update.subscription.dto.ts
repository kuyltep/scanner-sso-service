import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  scans?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end_date?: Date;
}

export class ChangeTemplateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  template_id: string;
}
