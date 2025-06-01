import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import {
  UserChangePasswordDto,
  UserUpdateDto,
} from 'src/common/dtos/user/user.update.dto';
import { GetUserDto, GetUsersDto } from 'src/common/dtos/user/user.get.dto';
import { UserQueryDto } from 'src/common/dtos/user/user.query.dto';
import { Roles } from '../decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiBearerAuth('access-token')
@ApiExtraModels(UserUpdateDto, GetUsersDto, GetUserDto, UserChangePasswordDto)

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get('')
  @ApiResponse({
    isArray: true,
    schema: {
      items: {
        $ref: getSchemaPath(GetUsersDto),
      },
    },
  })
  public async getUsersByQuery(@Query() query: UserQueryDto) {
    return await this.userService.getUsersByQuery(query);
  }

  @Get('profile')
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(GetUserDto),
    },
  })
  public async getUserProfile(@User('sub') sub: string) {
    return await this.userService.getUserById(sub);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(GetUserDto),
    },
  })
  public async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }


  @Patch('change-password')
  @ApiOperation({ summary: 'Обновить пароль пользователя' })
  @ApiBody({
    schema: {
      $ref: getSchemaPath(UserChangePasswordDto),
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Пароль успешно обновлен ',
  })
  public async changePassword(
    @User('sub') sub: string,
    @Body() changePasswordDto: UserChangePasswordDto,
  ) {
    return await this.userService.changePassword(sub, changePasswordDto);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      $ref: getSchemaPath(UserUpdateDto),
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно обновлен',
    schema: {
      $ref: getSchemaPath(GetUsersDto),
    },
  })
  public async updateProfile(
    @User('sub') sub: string,
    @Body() userUpdateData: UserUpdateDto,
  ) {
    return await this.userService.updateUserById(sub, userUpdateData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID пользователя',
  })
  @ApiBody({
    schema: {
      type: 'object',
      $ref: getSchemaPath(UserUpdateDto),
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлен',
    schema: {
      $ref: getSchemaPath(GetUsersDto),
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  public async updateUserById(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return await this.userService.updateUserById(id, userUpdateDto);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Удалить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно удален',
  })
  public async deleteProfile(@User('sub') sub: string) {
    return await this.userService.deleteUserById(sub);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удален',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  public async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
}
