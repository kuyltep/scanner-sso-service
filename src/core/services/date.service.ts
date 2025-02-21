// src/date/date.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  getCurrentDate(): Date {
    return new Date();
  }

  getDateWithOffset(
    offsetDays: number,
    offsetMonth: number,
    offsetYears: number,
  ): Date {
    const date = new Date();
    return new Date(
      date.getFullYear() + offsetYears,
      date.getMonth() + offsetMonth,
      date.getDate() + offsetDays,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
  }

  getDateWithOffsetWithoutTime(
    offsetDays: number,
    offsetMonth: number,
    offsetYears: number,
  ): Date {
    const date = new Date();
    return new Date(
      date.getFullYear() + offsetYears,
      date.getMonth() + offsetMonth,
      date.getDate() + offsetDays,
    );
  }
}
