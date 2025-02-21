import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { GetSubscriptionDto } from '../subscription/subscription.get.dto';

export class GetUsersDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  subscription_id: string;
  @ApiProperty()
  created_at: Date;
}

export class GetUserDto extends GetUsersDto {
  @ApiProperty()
  subscription: GetSubscriptionDto;
}
