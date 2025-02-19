import { Global, Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
