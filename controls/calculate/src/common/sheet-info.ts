import { CalculateSheetInfo } from './interface';

/**
 * Find sheet index by internal sheet token name (e.g. 'Sheet1').
 *
 * @hidden
 * @param {string} name - Sheet token name.
 * @param {CalculateSheetInfo[]} info - Host sheet info list.
 * @returns {number} - Sheet index, or -1 when not found.
 */
export function getSheetIndexByName(name: string, info: CalculateSheetInfo[]): number {
    const len: number = info.length;
    for (let i: number = 0; i < len; i++) {
        if (info[i as number].sheet.toUpperCase() === name.toUpperCase()) {
            return info[i as number].index;
        }
    }
    return -1;
}
