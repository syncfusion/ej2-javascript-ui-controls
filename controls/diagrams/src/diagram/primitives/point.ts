import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { PointModel } from './point-model';

/**
 * Defines and processes coordinates
 */
export class Point extends ChildProperty<Point> {
    /**
     * Sets the x-coordinate of a position
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Sets the y-coordinate of a position
     * @default 0
     */
    @Property(0)
    public y: number;

    /**
     * equals method \
     *
     * @returns { boolean } equals method .\
     * @param {PointModel} point1 - provide the point1 value.
     * @param {PointModel} point2 - provide the point1 value.
     *
     * @private
     */
    public static equals(point1: PointModel, point2: PointModel): boolean {
        if (point1 === point2) { return true; }
        if (!point1 || !point2) { return false; }
        return !point1 || !point2 || point1.x === point2.x && point1.y === point2.y;
    }

    /**
     * isEmptyPoint method \
     *
     * @returns { boolean } isEmptyPoint method .\
     * @param {PointModel} point - provide the points value.
     *
     * @private
     */
    public static isEmptyPoint(point: PointModel): boolean {
        if (point.x && point.y) {
            return false;
        }
        return true;
    }
    // public add(point1: PointModel, point2: PointModel): PointModel {
    //     return { x: point1.x + point2.x, y: point1.y + point2.y };
    // }
    // public subtract(point1: PointModel, point2: PointModel): PointModel {
    //     return { x: point1.x - point2.x, y: point1.y - point2.y };
    // }
    // public multiply(point1: PointModel, point2: PointModel): PointModel {
    //     return {
    //         x: point1.x * point2.x, y: point1.y * point2.y
    //     };
    // }
    // public crossProduct(point1: PointModel, point2: PointModel): PointModel {
    //     return {
    //         x: point1.x * point2.y, y: point2.x * point1.y
    //     };
    // }

    // public offset(offsetX: number, offsetY: number): void {
    //     this.x += offsetX;
    //     this.y += offsetY;
    // }

    // public rotate(angle: number): PointModel {
    //     let c: number = Math.cos(angle);
    //     let s: number = Math.sin(angle);
    //     return {
    //         x: c * this.x - s * this.y, y: s * this.x + c * this.y
    //     };
    // }

    // public distance(point2: PointModel): number {
    //     return Math.sqrt(Math.pow(this.x - point2.x, 2) + Math.pow(this.y - point2.y, 2));
    // }
    /**
     * transform method \
     *
     * @returns { PointModel } transform method .\
     * @param {PointModel} point - provide the points value.
     * @param {number} angle - provide the points value.
     * @param {number} length - provide the points value.
     *
     * @private
     */
    public static transform(point: PointModel, angle: number, length: number): PointModel {
        const pt: PointModel = { x: 0, y: 0 };
        pt.x = Math.round((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100;
        pt.y = Math.round((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100;
        return pt as Point;
    }

    /**
     * findLength method \
     *
     * @returns { number } findLength method .\
     * @param {PointModel} s - provide the points value.
     * @param {PointModel} e - provide the points value.
     *
     * @private
     */
    public static findLength(s: PointModel, e: PointModel): number {
        const length: number = Math.sqrt(Math.pow((s.x - e.x), 2) + Math.pow((s.y - e.y), 2));
        return length;
    }

    /**
     * findAngle method \
     *
     * @returns { number } findAngle method .\
     * @param {PointModel} point1 - provide the points value.
     * @param {PointModel} point2 - provide the points value.
     *
     * @private
     */
    public static findAngle(point1: PointModel, point2: PointModel): number {
        let angle: number = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        angle = (180 * angle / Math.PI);
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    /**
     * distancePoints method \
     *
     * @returns { number } distancePoints method .\
     * @param {PointModel} pt1 - provide the points value.
     * @param {PointModel} pt2 - provide the points value.
     *
     * @private
     */
    public static distancePoints(pt1: PointModel, pt2: PointModel): number {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }


    /**
     * getLengthFromListOfPoints method \
     *
     * @returns { number } getLengthFromListOfPoints method .\
     * @param {PointModel[]} points - provide the points value.
     *
     * @private
     */
    public static getLengthFromListOfPoints(points: PointModel[]): number {
        let length: number = 0;
        for (let j: number = 0; j < points.length - 1; j++) {
            length += this.distancePoints(points[j], points[j + 1]);
        }
        return length;
    }

    /**
     * adjustPoint method \
     *
     * @returns { PointModel } adjustPoint method .\
     * @param {PointModel} source - provide the points value.
     * @param {PointModel} target - provide the points value.
     * @param {boolean} isStart - provide the isStart value.
     * @param {number} length - provide the length value.
     *
     * @private
     */
    public static adjustPoint(source: PointModel, target: PointModel, isStart: boolean, length: number): PointModel {
        let pt: PointModel = isStart ? { x: source.x, y: source.y } : { x: target.x, y: target.y };
        let angle: number;
        if (source.x === target.x) {
            if (source.y < target.y && isStart || source.y > target.y && !isStart) {
                pt.y += length;
            } else {
                pt.y -= length;
            }

        } else if (source.y === target.y) {
            if (source.x < target.x && isStart || source.x > target.x && !isStart) {
                pt.x += length;
            } else {
                pt.x -= length;
            }
        } else {
            if (isStart) {
                angle = this.findAngle(source, target);
                pt = this.transform(source, angle, length);
            } else {
                angle = this.findAngle(target, source);
                pt = this.transform(target, angle, length);
            }
        }
        return pt;
    }

    /**
     * direction method \
     *
     * @returns { string } direction method .\
     * @param {PointModel} pt1 - provide the points value.
     * @param {PointModel} pt2 - provide the points value.
     *
     * @private
     */
    public static direction(pt1: PointModel, pt2: PointModel): string {
        if (Math.abs(pt2.x - pt1.x) > Math.abs(pt2.y - pt1.y)) {
            return pt1.x < pt2.x ? 'Right' : 'Left';
        } else {
            return pt1.y < pt2.y ? 'Bottom' : 'Top';
        }
    }

    //Move these methods to util
    //public CompareTo(point: PointModel): number {
    //    let result: number = this.X.CompareTo(point.X);
    //    return result != 0 ? result : this.Y.CompareTo(point.Y);
    //}
    //public CompareOnYAxis(point: PointModel): number {
    //    let result: number = this.X.CompareTo(point.X);
    //    return result != 0 ? result : this.Y.CompareTo(point.Y);
    //}
    //public CompareOnXAxis(point: PointModel): number {
    //    let result: number = this.Y.CompareTo(point.Y);
    //    return result != 0 ? result : this.X.CompareTo(point.X);
    //}
    // public round(): void {
    //     this.x = Math.round(this.x);
    //     this.y = Math.round(this.y);
    // }

    /**
     * getClassName method \
     *
     * @returns { string } getClassName method .\
     *
     * @private
     */
    public getClassName(): string {
        return 'Point';
    }

}

