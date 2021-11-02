import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

export class DayJSDateProvider implements IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number {
    const startDateUTC = this.dateToUTC(startDate);
    const endDateUTC = this.dateToUTC(endDate);

    return dayjs(endDateUTC).diff(startDateUTC, "hours");
  }

  private dateToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().utc().local().toDate();
  }
}
