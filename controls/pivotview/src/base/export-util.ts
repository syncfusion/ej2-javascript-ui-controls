import { IAxisSet } from './engine';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 *
 * @hidden
 */

export class PivotExportUtil {
    public static getClonedPivotValues(pivotValues: IAxisSet[][]): IAxisSet[][] {
        const clonedSets: IAxisSet[][] = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i as number]) {
                clonedSets[i as number] = [];
                for (let j: number = 0; j < pivotValues[i as number].length; j++) {
                    if (pivotValues[i as number][j as number]) {
                        clonedSets[i as number][j as number] =
                            this.getClonedPivotValueObj(pivotValues[i as number][j as number] as { [key: string]: Object });
                    }
                }
            }
        }
        return clonedSets;
    }

    private static getClonedPivotValueObj(data: { [key: string]: Object }): { [key: string]: Object } {
        let keyPos: number = 0;
        let framedSet: { [key: string]: Object } = {};
        if (!(data === null || data === undefined)) {
            const fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos as number]] = data[fields[keyPos as number]];
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    public static isContainCommonElements(collection1: Object[], collection2: Object[]): boolean {
        for (let i: number = 0, cnt: number = collection1.length; i < cnt; i++) {
            for (let j: number = 0, lnt: number = collection2.length; j < lnt; j++) {
                if (collection2[j as number] === collection1[i as number]) {
                    return true;
                }
            }
        }
        return false;
    }
}
