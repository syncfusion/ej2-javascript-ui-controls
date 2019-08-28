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