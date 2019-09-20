import { IPivotValues } from './engine';

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

    public static getClonedPivotValues(pivotValues: IPivotValues): IPivotValues {
        let clonedSets: IPivotValues = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            clonedSets[i] = [];
            for (let j: number = 0; j < pivotValues[i].length; j++) {
                if (pivotValues[i][j]) {
                    clonedSets[i][j] = this.getClonedObj(pivotValues[i][j] as { [key: string]: Object });
                }
            }
        }
        return clonedSets;
    }
    private static getClonedObj(data: { [key: string]: Object }): { [key: string]: Object } {
        let keyPos: number = 0;
        /* tslint:disable */
        let framedSet: any = {};
        /* tslint:enable */
        if (!(data === null || data === undefined)) {
            let fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
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