import { Point } from '@syncfusion/ej2-pdf';

/**
 * Represents a path figure consisting of line/curve segments.
 *
 * @private
 */
export class _PdfPathFigure {
    /**
     * Collection of path segments forming this figure.
     *
     * @private
     */
    _segments: _PdfPathSegment[];
    /**
     * Indicates whether the figure is closed.
     *
     * @private
     */
    _isClosed: boolean;
    /**
     * Indicates whether the figure is filled.
     *
     * @private
     */
    _isFilled: boolean;
    /**
     * Starting point of the figure.
     *
     * @private
     */
    _startPoint: Point;
    constructor() {
        this._segments = [];
        this._isClosed = false;
        this._isFilled = false;
        this._startPoint = { x: 0, y: 0 };
    }
    /**
     * Creates a deep clone of the path figure and its segments.
     *
     * @private
     * @returns {_PdfPathFigure} Cloned path figure.
     */
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
/**
 * Base class for path segments used in PDF drawing.
 *
 * @private
 */
export abstract class _PdfPathSegment {
    /**
     * Clones the segment.
     *
     * @private
     * @returns {_PdfPathSegment} New cloned segment.
     */
    abstract _clone(): _PdfPathSegment;
}
/**
 * Represents a straight line segment in a PDF path.
 *
 * @private
 */
export class _PdfLineSegment extends _PdfPathSegment {
    /**
     * Destination point of the line segment.
     *
     * @private
     */
    _point: Point;
    constructor(point: Point = { x: 0, y: 0 }) {
        super();
        this._point = point;
    }
    /**
     * Clones this line segment.
     *
     * @private
     * @returns {_PdfPathSegment} Cloned line segment.
     */
    _clone(): _PdfPathSegment {
        return new _PdfLineSegment({ ...this._point });
    }
}
/**
 * Represents a cubic Bézier curve segment in a PDF path.
 *
 * @private
 */
export class _PdfBezierSegment extends _PdfPathSegment {
    /**
     * First control point.
     *
     * @private
     */
    _point1: Point;
    /**
     * Second control point.
     *
     * @private
     */
    _point2: Point;
    /**
     * Third control point.
     *
     * @private
     */
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
    /**
     * Clones the Bézier segment.
     *
     * @private
     * @returns {_PdfPathSegment} Cloned Bézier segment.
     */
    _clone(): _PdfPathSegment {
        return new _PdfBezierSegment(
            { ...this._point1 },
            { ...this._point2 },
            { ...this._point3 }
        );
    }
}
