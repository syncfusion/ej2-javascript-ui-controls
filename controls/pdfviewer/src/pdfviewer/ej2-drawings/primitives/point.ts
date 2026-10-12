import { Property, ChildProperty } from '@syncfusion/ej2-base'; /*externalscript*/
import { PointModel } from './point-model';

/**
 * @hidden
 * Defines and processes coordinates
 */
export class Point extends ChildProperty<Point> {
    /**
     * Sets the x-coordinate of a position
     *
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Sets the y-coordinate of a position
     *
     * @default 0
     */
    @Property(0)
    public y: number;

    /**
     * @param {PointModel} point1 - point1
     * @param {PointModel} point2 - point2
     * @private
     * @returns {boolean} - boolean
     */
    public static equals(point1: PointModel, point2: PointModel): boolean {
        if (point1 === point2) { return true; }
        if (!point1 || !point2) { return false; }
        return !point1 || !point2 || point1.x === point2.x && point1.y === point2.y;
    }

    /**
     * check whether the points are given
     *
     * @param {PointModel} point - point
     * @private
     * @returns {boolean} - boolean
     */
    public static isEmptyPoint(point: PointModel): boolean {
        if (point.x && point.y) {
            return false;
        }
        return true;
    }

    /**
     * @param {PointModel} point - point
     * @param {number} angle - angle
     * @param {number} length - length
     * @private
     * @returns {PointModel} - PointModel
     */
    public static transform(point: PointModel, angle: number, length: number): PointModel {
        const pt: PointModel = { x: 0, y: 0 };
        pt.x = Math.round((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100;
        pt.y = Math.round((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100;
        return pt as Point;
    }

    /**
     * @param {PointModel} s - s
     * @param {PointModel} e - e
     * @private
     * @returns {number} - number
     */
    public static findLength(s: PointModel, e: PointModel): number {
        const length: number = Math.sqrt(Math.pow((s.x - e.x), 2) + Math.pow((s.y - e.y), 2));
        return length;
    }

    /**
     * @param {PointModel} point1 - point1
     * @param {PointModel} point2 - point2
     * @private
     * @returns {number} - number
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
     * @param {PointModel} pt1 - pt1
     * @param {PointModel} pt2 - pt2
     * @private
     * @returns {number} - number
     */
    public static distancePoints(pt1: PointModel, pt2: PointModel): number {
        return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }

    /**
     * @param {PointModel[]} points - points
     * @private
     * @returns {number} - number
     */
    public static getLengthFromListOfPoints(points: PointModel[]): number {
        let length: number = 0;
        for (let j: number = 0; j < points.length - 1; j++) {
            length += this.distancePoints(points[parseInt(j.toString(), 10)], points[j + 1]);
        }
        return length;
    }

    /**
     * @param {PointModel} source - source
     * @param {PointModel} target - target
     * @param {boolean} isStart - isStart
     * @param {number} length - length
     * @private
     * @returns {PointModel} - PointModel
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
     * @param {PointModel} pt1 - pt1
     * @param {PointModel} pt2 - pt2
     * @private
     * @returns {string} - string
     */
    public static direction(pt1: PointModel, pt2: PointModel): string {
        if (Math.abs(pt2.x - pt1.x) > Math.abs(pt2.y - pt1.y)) {
            return pt1.x < pt2.x ? 'Right' : 'Left';
        } else {
            return pt1.y < pt2.y ? 'Bottom' : 'Top';
        }
    }

    /**
     * Returns the name of class Point
     *
     * @private
     * @returns {string} - string
     */
    public getClassName(): string {
        return 'Point';
    }

}
