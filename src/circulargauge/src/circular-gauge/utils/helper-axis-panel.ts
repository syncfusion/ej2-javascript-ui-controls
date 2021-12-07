/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * Specifies Circular-Gauge axis-panel Helper methods
 */

/**
 * Function to calculate the sum of array values.
 *
 * @param {number} from - Specifies the from value.
 * @param {number} to - Specifies the to value.
 * @param {number[]} values - Specifies the number.
 * @returns {number} - Returns the number.
 * @private
 */
export function calculateSum(from: number, to: number, values: number[]): number {
    let sum: number = 0;
    const length: number = values.length;
    for (; from < length; from++) {
        sum += values[from];
    }
    return sum;
}
