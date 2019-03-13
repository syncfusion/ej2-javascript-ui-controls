import { IDataSet } from './engine';

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

    public static getClonedData(data: IDataSet[]): IDataSet[] {
        let clonedData: IDataSet[] = [];
        let fields: string[] = Object.keys(data[0]);
        for (let item of data) {
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
        return clonedData;
    }
}