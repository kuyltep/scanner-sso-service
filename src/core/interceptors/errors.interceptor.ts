import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { logger } from 'src/common/utils/logger';

@Injectable()
export class ErorrsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        logger.error(
          JSON.stringify(error?.response ? error.response.data : error),
        );
        if (error.response && error.response.data) {
          throw new HttpException(
            error.response.data,
            error.response.data.status || error.response.status,
          );
        } else {
          throw new HttpException('Internal Server Error', 500);
        }
      }),
    );
  }
}
