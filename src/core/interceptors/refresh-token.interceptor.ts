import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApiService } from 'src/core/sso/services/auth.api.service';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthApiService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data) => {
        try {
          const newAccessToken =
            await this.authService.refreshTokenIfNeeded(request);

          if (newAccessToken) {
            response.setHeader('x-new-access-token', newAccessToken);
          }
          return data;
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }),
    );
  }
}
