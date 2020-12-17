import { Calculate } from '../base';

/**
 * Represent the common codes for calculate
 */

export class CalculateCommon {
    private parent: Calculate;
    constructor(parent: Calculate) {
        this.parent = parent;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'calc-common';
    }

}
/**
 * To check whether the object is undefined.
 * @param {Object} value - To check the object is undefined
 * @return {boolean}
 * @private
 */
export function isUndefined(value: Object): boolean {
    return ('undefined' === typeof value);
}
/** @hidden */
export function getSkeletonVal(value: string): string {
    switch (value) {
        case 'dd-MMM-yyyy':
        case 'dd MMM yyyy':
            value = 'medium';
            break;
        case 'MMM-yyyy':
        case 'MMM yyyy':
            value = 'yMMM';
            break;
        case 'MM-dd-yyyy': //short
        case 'dd-MM-yyyy':
        case 'dd-MM-yy':
        case 'MM/dd/yyyy':
        case 'dd/MM/yyyy':
        case 'dd/MM/yy':
            value = 'short';
            break;
        case 'dddd MMMM dd yyyy': //long
        case 'dd MMMM yyyy':
        value = 'long';
            break;
        case 'd MMMM yyyy':
            value = 'yMMMd';
            break;
        case 'yyyy':
            value = 'y';
            break;
        case 'h:mm':
            value = 'Hm';
            break;
        case 'h:mm tt':
            value = 'hm';
            break;
        case 'h':
            value = 'H';
            break;
        case 'h tt':
            value = 'h';
            break;
        case 'dddd':
            value = 'E';
            break;
        case 'h:mm:ss tt':
            value = 'hms';
            break;
        case 'h:mm:ss':
            value = 'Hms';
            break;
        case 'd':
            value = 'd';
            break;
        case 'd dddd':
            value = 'Ed';
            break;
        case 'M':
            value = 'M';
            break;
        case 'Md':
            value = 'Md';
            break;
        case 'MMM':
            value = 'MMM';
            break;
        case 'ddd MMM d':
            value = 'MMMEd';
            break;
        case 'MMM d':
            value = 'MMMd';
            break;
        case 'M/yyyy':
            value = 'yM';
            break;
        default:
            value = '';
            break;
    }
    return value;
}