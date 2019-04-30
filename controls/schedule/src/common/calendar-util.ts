import { HijriParser, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Calendar functionalities
 */
export type CalendarType = 'Islamic' | 'Gregorian';

export interface CalendarUtil {
    firstDateOfMonth(date: Date): Date;
    lastDateOfMonth(date: Date): Date;
    isMonthStart(date: Date): boolean;
    getLeapYearDaysCount(): number;
    getYearDaysCount(date: Date, interval: number): number;
    getMonthDaysCount(date: Date): number;
    getDate(date: Date): number;
    getMonth(date: Date): number;
    getFullYear(date: Date): number;
    getYearLastDate(date: Date, interval: number): Date;
    getMonthStartDate(date: Date): Date;
    getMonthEndDate(date: Date): Date;
    getExpectedDays(date: Date, days: number[]): number[];
    setDate(dateObj: Date, date: number): void;
    setValidDate(date1: Date, interval: number, startDate: number, month?: number, date2?: Date): void;
    setMonth(date: Date, interval: number, startDate: number): void;
    addYears(date: Date, interval: number, month: number): void;
    isSameMonth(date1: Date, date2: Date): boolean;
    checkMonth(date: Date, months: Number[]): boolean;
    compareMonth(date1: Date, date2: Date): boolean;
    isSameYear(date1: Date, date2: Date): boolean;
    isLastMonth(date: Date): boolean;
    isLeapYear(year: number, interval: number): boolean;
}

export class Gregorian implements CalendarUtil {
    public firstDateOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth());
    }
    public lastDateOfMonth(dt: Date): Date {
        return new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    }
    public isMonthStart(date: Date): boolean {
        return (date.getDate() === 1);
    }
    public getLeapYearDaysCount(): number {
        return 366;
    }
    public getYearDaysCount(date: Date, interval: number): number {
        return ((date.getFullYear() + interval) % 4 === 0) ? 366 : 365;
    }
    public getDate(date: Date): number {
        return date.getDate();
    }
    public getMonth(date: Date): number {
        return (date.getMonth() + 1);
    }
    public getFullYear(date: Date): number {
        return date.getFullYear();
    }
    public getYearLastDate(date: Date, interval: number): Date {
        return new Date(date.getFullYear() + interval, 0, 0);
    }
    public getMonthDaysCount(date: Date): number {
        return this.lastDateOfMonth(date).getDate();
    }
    public getMonthStartDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes());
    }
    public getMonthEndDate(date: Date): Date {
        date.setDate(1);
        return new Date(date.setMonth(date.getMonth() + 1));
    }
    public getExpectedDays(date: Date, days: number[]): number[] {
        return days;
    }
    public setDate(dateObj: Date, date: number): void {
        dateObj.setDate(date);
    }
    public setValidDate(date: Date, interval: number, startDate: number, monthValue?: number, beginDate?: Date): void {
        if (!isNullOrUndefined(beginDate)) {
            date.setMonth((beginDate ? monthValue : date.getMonth()) + interval);
        } else {
            date.setMonth(date.getMonth() + interval, startDate);
        }
    }
    public setMonth(date: Date, interval: number, startDate: number): void {
        date.setFullYear(date.getFullYear());
        date.setMonth(interval - 1);
        date.setDate(startDate);
    }
    public addYears(date: Date, interval: number): void {
        date.setFullYear(date.getFullYear() + interval);
    }
    public isSameMonth(date1: Date, date2: Date): boolean {
        return (date1.getMonth() === date2.getMonth());
    }
    public checkMonth(date: Date, months: Number[]): boolean {
        return (months.indexOf(date.getMonth() + 1) === -1);
    }
    public compareMonth(date1: Date, date2: Date): boolean {
        return (date1.getMonth() > date2.getMonth());
    }
    public isSameYear(date1: Date, date2: Date): boolean {
        return (date1.getFullYear() === date2.getFullYear());
    }
    public isLastMonth(date: Date): boolean {
        return (date.getMonth() === 11);
    }
    public isLeapYear(year: number, interval: number): boolean {
        return ((year + interval) % 4 === 0);
    }
}

export class Islamic implements CalendarUtil {
    public firstDateOfMonth(date: Date): Date {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian(hDate.year as number, hDate.month as number, 1);
        return gDate;
    }
    public lastDateOfMonth(date: Date): Date {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        let gDate: Date = HijriParser.toGregorian(hDate.year as number, hDate.month as number, this.getDaysInMonth(
            hDate.month as number, hDate.year as number));
        let finalGDate: Date = new Date(gDate.getTime());
        new Date(finalGDate.setDate(finalGDate.getDate() + 1));
        let finalHDate: { [key: string]: object } = this.getHijriDate(finalGDate);
        if (hDate.month === finalHDate.month) {
            return finalGDate;
        }
        finalHDate = HijriParser.getHijriDate(gDate) as { [key: string]: Object };
        if (hDate.month === finalHDate.month) {
            return gDate;
        }
        return new Date(gDate.setDate(gDate.getDate() - 1));
    }
    public isMonthStart(date: Date): boolean {
        let hijriDate: { [key: string]: Object } = this.getHijriDate(date);
        return (hijriDate.date === 1);
    }
    public getLeapYearDaysCount(): number {
        return 355;
    }
    public getYearDaysCount(date: Date, interval: number): number {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        return this.isLeapYear((hDate.year as number), interval) ? 355 : 354;
    }
    public getDate(date: Date): number {
        let hijriDate: { [key: string]: Object } = this.getHijriDate(date);
        return hijriDate.date as number;
    }
    public getMonth(date: Date): number {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        return hDate.month as number;
    }
    public getFullYear(date: Date): number {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        return hDate.year as number;
    }
    public getYearLastDate(date: Date, interval: number): Date {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian((hDate.year as number) + interval, 1, 0);
        return gDate;
    }
    public getMonthDaysCount(date: Date): number {
        let maxDate: Date = this.lastDateOfMonth(date);
        let hijriDate: { [key: string]: Object } = this.getHijriDate(maxDate);
        return hijriDate.date as number;
    }
    public getMonthStartDate(date: Date): Date {
        let firstDate: Date = this.firstDateOfMonth(date);
        return new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate(), date.getHours(), date.getMinutes());
    }
    public getMonthEndDate(date: Date): Date {
        let lastDate: Date = this.lastDateOfMonth(date);
        lastDate.setDate(lastDate.getDate() + 1);
        return new Date(lastDate.setMonth(lastDate.getMonth()));
    }
    public getExpectedDays(date: Date, days: number[]): number[] {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        let day: number[] = [];
        for (let i: number = 0; i < days.length; i++) {
            let gDate: Date = HijriParser.toGregorian(hDate.year as number, (hDate.month as number), days[i]);
            day.push(gDate.getDate());
        }
        return day;
    }
    public setDate(dateObj: Date, date: number): void {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(dateObj) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian((hDate.year as number), (hDate.month as number), date);
        this.updateDateObj(dateObj, gDate);
    }
    public setValidDate(date: Date, interval: number, startDate: number, monthValue?: number, beginDate?: Date): void {
        let firstDate: Date = (!isNullOrUndefined(beginDate)) ? this.firstDateOfMonth(beginDate) : date;
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(firstDate) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian(hDate.year as number, (hDate.month as number) + interval, startDate);
        this.updateDateObj(date, gDate);
    }
    public setMonth(date: Date, interval: number, startDate: number): void {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian((hDate.year as number), interval, startDate);
        this.updateDateObj(date, gDate);
    }
    public addYears(date: Date, interval: number, monthValue: number): void {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian((hDate.year as number) + interval, monthValue, 1);
        this.updateDateObj(date, gDate);
    }
    public isSameMonth(date1: Date, date2: Date): boolean {
        let currentHijri: { [key: string]: Object } = this.getHijriDate(date1);
        let tempHijri: { [key: string]: Object } = this.getHijriDate(date2);
        return (currentHijri.month === tempHijri.month);
    }
    public checkMonth(date: Date, months: Number[]): boolean {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        return (months.indexOf(hDate.month as number) === -1);
    }
    public compareMonth(date1: Date, date2: Date): boolean {
        let hDate: { [key: string]: Object } = this.getHijriDate(date1);
        let hDate1: { [key: string]: Object } = this.getHijriDate(date2);
        return (hDate.month > hDate1.month);
    }
    public isSameYear(date1: Date, date2: Date): boolean {
        let hDate: { [key: string]: Object } = this.getHijriDate(date1);
        let hDate1: { [key: string]: Object } = this.getHijriDate(date2);
        return (hDate.year === hDate1.year);
    }
    public isLastMonth(date: Date): boolean {
        let hDate: { [key: string]: Object } = this.getHijriDate(date);
        return ((hDate.month as number) === 12);
    }
    private updateDateObj(date: Date, gDate: Date): void {
        date.setFullYear(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
    }
    public isLeapYear(year: number, interval: number): boolean {
        return (14 + 11 * (year + interval)) % 30 < 11;
    }
    private getDaysInMonth(month: number, year: number): number {
        let length: number = 0;
        length = 29 + ((month + 1) % 2);
        if (month === 11 && this.isLeapYear(year, 0)) {
            length++;
        }
        return length;
    }
    private getHijriDate(date: Date): { [key: string]: Object } {
        return HijriParser.getHijriDate(date) as { [key: string]: Object };
    }
}
