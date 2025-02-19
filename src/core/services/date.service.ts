// src/date/date.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  getCurrentDate(): Date {
    return new Date();
  }

  getDateWithOffset(offsetDays: number): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + offsetDays);
    return currentDate;
  }

  getDateWithOffsetWithoutTime(
    offsetDays: number,
    offsetMonth: number,
    offsetYears: number,
  ): Date {
    const date = new Date();
    return new Date(
      date.getFullYear() - offsetYears,
      date.getMonth() - offsetMonth,
      date.getDate() - offsetDays,
    );
  }
}
