import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ExceptionCause,
  ExceptionMessage,
} from 'src/common/types/exception.types';

@Injectable()
export class ExceptionService {
  public unauthorizedException(
    message?: ExceptionMessage,
    cause?: ExceptionCause,
  ) {
    throw new UnauthorizedException(message, cause);
  }

  public internalServerError(
    message?: ExceptionMessage,
    cause?: ExceptionCause,
  ) {
    throw new InternalServerErrorException(message, cause);
  }

  public notFoundError(message?: ExceptionMessage, cause?: ExceptionCause) {
    throw new NotFoundException(message, cause);
  }

  public forbiddenException(
    message?: ExceptionMessage,
    cause?: ExceptionCause,
  ) {
    throw new ForbiddenException(message, cause);
  }

  public tooManyRequests(message?: ExceptionMessage) {
    throw new HttpException(message, 429);
  }
}
