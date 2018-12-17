import { HijriParser } from '@syncfusion/ej2-base';

/**
 * Calendar functionalities
 */
export interface CalendarUtil {
    firstDateOfMonth(date: Date): Date;
    lastDateOfMonth(date: Date): Date;
    isMonthStart(date: Date): boolean;
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
}

export class Islamic implements CalendarUtil {
    public firstDateOfMonth(date: Date): Date {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian(hDate.year as number, hDate.month as number, 1);
        return gDate;
    }
    public lastDateOfMonth(dt: Date): Date {
        let hDate: { [key: string]: Object } = HijriParser.getHijriDate(dt) as { [key: string]: Object };
        let gDate: Date = HijriParser.toGregorian(hDate.year as number, hDate.month as number, this.getDaysInMonth(
            hDate.month as number, hDate.year as number));
        let finalGDate: Date = new Date(gDate.getTime());
        new Date(finalGDate.setDate(finalGDate.getDate() + 1));
        let finalHDate: { [key: string]: object } = HijriParser.getHijriDate(finalGDate) as { [key: string]: Object };
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
        let hijriDate: { [key: string]: Object } = HijriParser.getHijriDate(date) as { [key: string]: Object };
        return (hijriDate.date === 1);
    }
    private isLeapYear(year: number): boolean {
        return (14 + 11 * year) % 30 < 11;
    }
    private getDaysInMonth(month: number, year: number): number {
        let length: number = 0;
        length = 29 + ((month + 1) % 2);
        if (month === 11 && this.isLeapYear(year)) {
            length++;
        }
        return length;
    }
}
