export interface IDateProvider {
  compareInHours(startDate: Date, endDate: Date): number;
  dateNow(): Date;
  compareInDays(startDate: Date, endDate: Date): number;
  addDays(days: number): Date;
}
