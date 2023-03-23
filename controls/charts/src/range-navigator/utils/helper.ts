/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
import { VisibleRangeModel } from '../../chart/axis/axis';
/**
 * Methods for calculating coefficient.
 */
/** @private */
export function rangeValueToCoefficient(value: number, range: VisibleRangeModel, inversed: boolean): number {
    const result: number = (value - <number>range.min) / (range.delta);
    return inversed ? (1 - result) : result;

}
/** @private */
export function getXLocation(
    x: number, range: VisibleRangeModel, size: number, inversed: boolean
): number {
    x = rangeValueToCoefficient(x, range, inversed);
    return x * size;
}


/** @private */
export function getRangeValueXByPoint(
    value: number, size: number, range: VisibleRangeModel, inversed: boolean
): number {
    const actualValue: number = !inversed ? value / size : (1 - (value / size));
    return actualValue * (range.delta) + range.min;
}

/** @private */
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

/** @private */
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
