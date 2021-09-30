/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * Specifies Circular-Gauge axis-render Helper methods
 */

import { Range } from '../axes/axis';

/**
 * Function to get range color from value for circular gauge.
 *
 * @param {number} value - Specifies the value.
 * @param {Range[]} ranges - Specifies the ranges.
 * @param {string} color - Specifies the color.
 * @returns {string} - Returns the color.
 * @private
 */
export function getRangeColor(value: number, ranges: Range[], color: string): string {
    let min: number = 0;
    let max: number = 0;
    const currentRange: Range[] = ranges.filter((range: Range) => {
        min = Math.min(range.start, range.end);
        max = Math.max(range.start, range.end);
        return (value >= min && max >= value);
    });
    return currentRange.length ? currentRange[0].rangeColor : color;
}
