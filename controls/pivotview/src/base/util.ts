/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */

export class PivotUtil {
    public static getType(value: Date): string {
        let val: string;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        return val;
    }

    public static resetTime(date: Date): Date {
        date.setHours(0, 0, 0, 0);
        return date;
    }
}