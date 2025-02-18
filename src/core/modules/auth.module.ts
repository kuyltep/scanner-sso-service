import { Global, Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
