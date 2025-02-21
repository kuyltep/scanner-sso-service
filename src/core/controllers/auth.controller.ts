import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UserLoginDto } from 'src/common/dtos/auth/user.login.dto';
import { UserRegisterDto } from 'src/common/dtos/auth/user.register.dto';
@ApiExtraModels(UserLoginDto, UserRegisterDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiBody({
    required: true,
    schema: {
      $ref: getSchemaPath(UserLoginDto),
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async loginUser(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.loginUser(userLoginDto);
  }

  @ApiBody({
    required: true,
    schema: {
      $ref: getSchemaPath(UserRegisterDto),
    },
  })
  @Post('register')
  public async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return await this.authService.registerUser(userRegisterDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(@Req() req) {
    return await this.refreshToken(req.headers.authorization);
  }
}
