import { VisibleRangeModel } from '../../chart/axis/axis';
/**
 * Methods for calculating coefficient.
 */
/** @private */
export function rangeValueToCoefficient(value: number, range: VisibleRangeModel, inversed: boolean): number {
    let result: number = (value - <number>range.min) / (range.delta);
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
    let actualValue: number = !inversed ? value / size : (1 - (value / size));
    return actualValue * (range.delta) + range.min;
}

/** @private */
export function getExactData(points: DataPoint[], start: number, end: number): DataPoint[] {
    let selectedData: DataPoint[] = [];
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


/** @private */
export class DataPoint {

    public x: Object;
    public y: Object;
    public xValue?: number;
    public yValue?: number;
    private visible?: boolean;

    constructor(x: Object, y: Object, xValue?: number, yValue?: number, visible: boolean = true) {
        this.x = x;
        this.y = y;
        this.xValue = xValue;
        this.visible = visible;
    }
}