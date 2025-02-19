import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from 'src/common/dtos/auth/user.login.dto';
import { ExceptionService } from './exception.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from 'src/common/dtos/auth/user.register.dto';
import { ConfigService } from './config.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly exceptionService: ExceptionService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateJwtToken(user: User) {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });
    return token;
  }

  public async loginUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.getUserByUnique(userLoginDto.login);

    if (!user) {
      throw this.exceptionService.unauthorizedException(
        'Invalid user was provided',
      );
    }

    const isCompare = await bcrypt.compare(
      userLoginDto.password,
      user.password,
    );

    if (!isCompare) {
      throw this.exceptionService.unauthorizedException(
        'Invalid password was provided',
      );
    }

    const token = await this.generateJwtToken(user);

    return { access_token: token };
  }

  public async registerUser(userRegisterDto: UserRegisterDto) {
    return await this.userService.createUser(userRegisterDto);
  }

  public async refreshToken(authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw this.exceptionService.unauthorizedException(
        'Invalid token was provided',
      );
    }

    const token = authorization.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.getJwtSecret(),
    });

    const isTokenAboutToExpire = this.isTokenAboutToExpire(payload.exp);

    if (isTokenAboutToExpire) {
      const user = await this.userService.getUserByUnique(payload.sub, false);
      if (!user) {
        throw this.exceptionService.unauthorizedException('User not found');
      }
      const newAccessToken = await this.jwtService.signAsync({
        id: user.id,
        role: user.role,
      });
      return { access_token: newAccessToken };
    } else {
      return { access_token: token };
    }
  }

  private isTokenAboutToExpire(expirationTime: number): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = expirationTime - currentTime;

    return timeRemaining < 3600;
  }
}
