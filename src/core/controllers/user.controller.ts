import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { UserUpdateDto } from 'src/common/dtos/user/user.update.dto';
import { GetUserDto, GetUsersDto } from 'src/common/dtos/user/user.get.dto';
import { UserQueryDto } from 'src/common/dtos/user/user.query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExtraModels(UserUpdateDto, GetUsersDto, GetUserDto)
  @Get('')
  @ApiResponse({
    isArray: true,
    schema: {
      $ref: getSchemaPath(GetUsersDto),
    },
  })
  public async getUsersByQuery(@Query() query: UserQueryDto) {
    return await this.userService.getUsersByQuery(query);
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

  @Get('profile')
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(GetUserDto),
    },
  })
  public async getUserProfile(@User('sub') sub: string) {
    return await this.userService.getUserById(sub);
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
    return this.userService.updateUserById(sub, userUpdateData);
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
    return this.userService.updateUserById(id, userUpdateDto);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Удалить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно удален',
  })
  public async deleteProfile(@User('sub') sub: string) {
    return this.userService.deleteUserById(sub);
  }

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
    return this.userService.deleteUserById(id);
  }
}
