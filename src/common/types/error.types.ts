import { HttpExceptionOptions } from '@nestjs/common';

export type ErrorMessageType = string | object;

export type ErrorCauseType = string | HttpExceptionOptions;
