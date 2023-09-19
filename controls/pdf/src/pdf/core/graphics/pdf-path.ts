import { PdfPen} from './pdf-graphics';
import { _getBezierArc } from './../utils';
import { PdfFillMode } from './../enumerator';
export class _PdfPath {
    _fillMode: PdfFillMode;
    _points: Array<number[]>;
    _pathTypes: _PathPointType[];
    _pen: PdfPen;
    _isStart: boolean;
    _isRoundedRectangle: boolean = false;
    constructor() {
        this._fillMode = PdfFillMode.winding;
        this._points = [];
        this._pathTypes = [];
        this._isStart = true;
    }
    get _lastPoint(): number[] {
        const value: number[] = [0, 0];
        const count: number = this._points.length;
        if (this._points.length > 0) {
            value[0] = this._points[(count - 1)][0];
            value[1] = this._points[(count - 1)][0];
        }
        return value;
    }
    _addLine(x1: number, y1: number, x2: number, y2: number): void {
        this._addPoints([x1, y1, x2, y2], _PathPointType.line);
    }
    _addLines(linePoints: Array<number[]>): void {
        let start: number[] = linePoints[0];
        if (linePoints.length === 1) {
            this._addPoint(linePoints[0], _PathPointType.line);
        } else {
            for (let i: number = 1; i < linePoints.length; i++) {
                const last: number[] = linePoints[Number.parseInt(i.toString(), 10)];
                this._addLine(start[0], start[1], last[0], last[1]);
                start = last;
            }
        }
    }
    _addPoints(points: number[], type: _PathPointType, start?: number, end?: number): void {
        const startIndex: number = (typeof start !== 'undefined') ? start : 0;
        const endIndex: number = (typeof end !== 'undefined') ? end : points.length;
        for (let i: number = startIndex; i < endIndex; i++) {
            const point: number[] = [points[Number.parseInt(i.toString(), 10)], points[i + 1]];
            if (i === startIndex) {
                if (this._points.length === 0 || this._isStart) {
                    this._addPoint(point, _PathPointType.start);
                    this._isStart = false;
                } else if (this._isRoundedRectangle && (point[0] !== this._lastPoint[0] || point[1] !== this._lastPoint[1])) {
                    this._addPoint(point, _PathPointType.line);
                } else if (point[0] !== this._lastPoint[0] && point[1] !== this._lastPoint[1]) {
                    this._addPoint(point, _PathPointType.line);
                }
            } else {
                this._addPoint(point, type);
            }
            i++;
        }
    }
    _addPoint(points: number[], type: _PathPointType): void {
        this._points.push(points);
        this._pathTypes.push(type);
    }
    _addArc(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number): void {
        const points: number[] = _getBezierArc(x, y, x + width, y + height, startAngle, sweepAngle);
        for (let i: number = 0; i < points.length; ++i) {
            const list: number[] = [points[Number.parseInt(i.toString(), 10)],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i]];
            this._addPoints(list, _PathPointType.bezier);
        }
    }
    _addRectangle(x: number, y: number, width: number, height: number): void {
        this._startFigure();
        this._addPoints([x, y, x + width, y, x + width, y + height, x, y + height], _PathPointType.line);
        this._closeFigure();
    }
    _addPolygon(points: Array<number[]>): void {
        const newPoints: number[] = [];
        points.forEach((element: number[]) => {
            newPoints.push(element[0], element[1]);
        });
        this._startFigure();
        this._addPoints(newPoints, _PathPointType.line);
        this._closeFigure();
    }
    _addEllipse(x: number, y: number, width: number, height: number): void {
        this._startFigure();
        this._addArc(x, y, width, height, 0, 360);
        this._closeFigure();
    }
    _addBezierPoints(pointsCollection: number[][]): void {
        if (pointsCollection.length < 4) {
            throw Error('Incorrect size of array points');
        }
        const bound: number = 3;
        let index: number = 0;
        let start: number[] = pointsCollection[Number.parseInt(index.toString(), 10)];
        index++;
        while ((index + bound) <= pointsCollection.length) {
            const inner1: number[] = pointsCollection[Number.parseInt(index.toString(), 10)];
            index++;
            const inner2: number[] = pointsCollection[Number.parseInt(index.toString(), 10)];
            index++;
            const end: number[] = pointsCollection[Number.parseInt(index.toString(), 10)];
            index++;
            this._addBezier(start[0], start[1], inner1[0], inner1[1], inner2[0], inner2[1], end[0], end[1]);
            start = end;
        }
    }
    _addBezier(x: number, y: number, firstX: number, firstY: number, secondX: number, secondY: number, endX: number, endY: number): void {
        const points: Array<number> = [];
        points.push(x);
        points.push(y);
        points.push(firstX);
        points.push(firstY);
        points.push(secondX);
        points.push(secondY);
        points.push(endX);
        points.push(endY);
        this._addPoints(points, _PathPointType.bezier);
    }
    _closeFigure(index?: number): void {
        if (typeof index !== 'undefined') {
            let type: _PathPointType = this._pathTypes[Number.parseInt(index.toString(), 10)];
            type |= _PathPointType.closePath;
            this._pathTypes[Number.parseInt(index.toString(), 10)] = type;
        } else {
            if (this._points.length > 0) {
                this._closeFigure(this._points.length - 1);
            }
            this._startFigure();
        }
    }
    _startFigure(): void {
        this._isStart = true;
    }
    _getBounds(): number[] {
        let bounds: number[] = [0, 0, 0, 0];
        if (this._points.length > 0) {
            let xmin: number = this._points[0][0];
            let xmax: number = this._points[0][0];
            let ymin: number = this._points[0][1];
            let ymax: number = this._points[0][1];
            for (let i: number = 1; i < this._points.length; ++i) {
                const point: number[] = this._points[Number.parseInt(i.toString(), 10)];
                xmin = Math.min(point[0], xmin);
                xmax = Math.max(point[0], xmax);
                ymin = Math.min(point[1], ymin);
                ymax = Math.max(point[1], ymax);
            }
            bounds = [xmin, ymin, xmax - xmin, ymax - ymin];
        }
        return bounds;
    }
}
export enum _PathPointType {
    start = 0,
    line = 1,
    bezier = 3,
    pathTypeMask = 7,
    dashMode = 16,
    pathMarker = 32,
    closePath = 128
}
