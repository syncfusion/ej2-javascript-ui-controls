import { VisibleRangeModel } from '../../common/model/interface';
/**
 * Method for calculating coefficient.
 *
 * @private
 * @param {number} value - The value to calculate the coefficient.
 * @param {VisibleRangeModel} range - The visible range model.
 * @param {boolean} inversed - Indicates whether the range is inversed.
 * @returns {number} - The calculated coefficient.
 */
export function rangeValueToCoefficient(value: number, range: VisibleRangeModel, inversed: boolean): number {
    const result: number = (value - <number>range.min) / (range.delta);
    return inversed ? (1 - result) : result;
}
/**
 * Calculates the coefficient for the x-location.
 *
 * @private
 * @param {number} x - The value to calculate the coefficient.
 * @param {VisibleRangeModel} range - The visible range model.
 * @param {number} size - The size for calculate the coefficient.
 * @param {boolean} inversed - Indicates whether the range is inversed.
 * @returns {number} - The calculated coefficient.
 */
export function getXLocation(
    x: number, range: VisibleRangeModel, size: number, inversed: boolean
): number {
    x = rangeValueToCoefficient(x, range, inversed);
    return x * size;
}
/**
 * Method for calculating range value by x point.
 *
 * @private
 * @param {number} value - The value for which to calculate the range value.
 * @param {number} size - The size used for calculating the coefficient.
 * @param {VisibleRangeModel} range - The visible range model.
 * @param {boolean} inversed - Indicates whether the range is inversed.
 * @returns {number} - The calculated range value.
 */
export function getRangeValueXByPoint(
    value: number, size: number, range: VisibleRangeModel, inversed: boolean
): number {
    const actualValue: number = !inversed ? value / size : (1 - (value / size));
    return actualValue * (range.delta) + range.min;
}
/**
 * Method for calculating the exact data.
 *
 * @private
 * @param {DataPoint[]} points - The array of data points.
 * @param {number} start - The start value of the range.
 * @param {number} end - The end value of the range.
 * @returns {DataPoint[]} - The calculated data points within the range.
 */
export function getExactData(points: DataPoint[], start: number, end: number): DataPoint[] {
    const selectedData: DataPoint[] = [];
    points.map((point: DataPoint) => {
        if (point.xValue >= start && point.xValue <= end) {
            selectedData.push({
                'x': point.x,
                'y': point.y
            });
        }
    });
    return selectedData;
}

/**
 * Methods for calculating the nearest value.
 *
 * @private
 * @param {number[]} values - The array of values.
 * @param {number} point - The point for which to find the nearest value.
 * @returns {number} - The nearest value.
 */
export function getNearestValue(values: number[], point: number): number {
    return values.reduce((prev: number, curr: number) => {
        return (Math.abs(curr - point) < Math.abs(prev - point) ? curr : prev);
    });
}


/**
 * Data point
 *
 * @public
 */
export class DataPoint {
    /** point x. */
    public x: Object;
    /** point y. */
    public y: Object;
    /** point x value. */
    public xValue?: number;
    /** point y value. */
    public yValue?: number;
    /** point visibility. */
    public visible?: boolean;


    constructor(x: Object, y: Object, xValue?: number, yValue?: number, visible: boolean = true) {
        this.x = x;
        this.y = y;
        this.xValue = xValue;
        this.visible = visible;
    }
}
