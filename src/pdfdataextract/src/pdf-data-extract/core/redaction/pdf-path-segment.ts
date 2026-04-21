import { Point } from '@syncfusion/ej2-pdf';

export class _PdfPathFigure {
    _segments: _PdfPathSegment[];
    _isClosed: boolean;
    _isFilled: boolean;
    _startPoint: Point;
    constructor() {
        this._segments = [];
        this._isClosed = false;
        this._isFilled = false;
        this._startPoint = { x: 0, y: 0 };
    }
    _clone(): _PdfPathFigure {
        const pathFigure: _PdfPathFigure = new _PdfPathFigure();
        pathFigure._isClosed = this._isClosed;
        pathFigure._isFilled = this._isFilled;
        pathFigure._startPoint = { ...this._startPoint };
        for (const segment of this._segments) {
            pathFigure._segments.push(segment._clone());
        }
        return pathFigure;
    }
}
export abstract class _PdfPathSegment {
    abstract _clone(): _PdfPathSegment;
}
export class _PdfLineSegment extends _PdfPathSegment {
    _point: Point;
    constructor(point: Point = { x: 0, y: 0 }) {
        super();
        this._point = point;
    }
    _clone(): _PdfPathSegment {
        return new _PdfLineSegment({ ...this._point });
    }
}
export class _PdfBezierSegment extends _PdfPathSegment {
    _point1: Point;
    _point2: Point;
    _point3: Point;
    constructor(
        point1: Point = { x: 0, y: 0 },
        point2: Point = { x: 0, y: 0 },
        point3: Point = { x: 0, y: 0 }
    ) {
        super();
        this._point1 = point1;
        this._point2 = point2;
        this._point3 = point3;
    }
    _clone(): _PdfPathSegment {
        return new _PdfBezierSegment(
            { ...this._point1 },
            { ...this._point2 },
            { ...this._point3 }
        );
    }
}
