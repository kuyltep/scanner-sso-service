import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UserChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  old_password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  new_password: string;
}
