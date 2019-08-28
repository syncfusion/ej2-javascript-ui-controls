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

    public static getClonedData(data: { [key: string]: Object }[]): { [key: string]: Object }[] {
        let clonedData: { [key: string]: Object }[] = [];
        if (data) {
            for (let item of data as { [key: string]: Object }[]) {
                let fields: string[] = Object.keys(item);
                let keyPos: number = 0;
                /* tslint:disable */
                let framedSet: any = {};
                /* tslint:enable */
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos]] = item[fields[keyPos]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    }

    public static inArray(value: Object, collection: Object[]): number {
        for (let i: number = 0, cnt: number = collection.length; i < cnt; i++) {
            if (collection[i] === value) {
                return i;
            }
        }
        return -1;
    }
}