import { PdfPen, PdfBrush } from './pdf-graphics';
import { _getBezierArc } from './../utils';
import { PdfFillMode, PathPointType } from './../enumerator';
import { Point, Rectangle } from './../pdf-type';
/**
 * Implements graphics path, which is a sequence of primitive graphics elements.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the first page
 * let page: PdfPage = document.getPage(0);
 * // Gets the graphics object of the PDF page
 * let graphics: PdfGraphics = page.graphics;
 * // Create a new pen
 * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
 * // Create a new PDF path
 * let path: PdfPath = new PdfPath();
 * // Add a line to the Graphics path
 * path.addLine({x: 10, y: 250}, {x: 200, y: 250});
 * // Draw the path on the PDF page
 * graphics.drawPath(path, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 *
 */
export class PdfPath {
    /**
     * Ordered list of points that compose the path.
     *
     * @private
     */
    _points: Array<Point> = [];
    /**
     * Path point type flags for each point in the path.
     *
     * @private
     */
    _pathTypes: PathPointType[] = [];
    /**
     * Pen used to stroke the path.
     *
     * @private
     */
    _pen: PdfPen;
    /**
     * Brush used to fill the path.
     *
     * @private
     */
    _brush: PdfBrush;
    /**
     * Fill rule applied to the path.
     *
     * @private
     */
    _fillMode: PdfFillMode;
    /**
     * Indicates whether the next segment starts a new sub path.
     *
     * @private
     */
    _isStart: boolean;
    /**
     * Indicates whether this path belongs to XPS content.
     *
     * @private
     */
    _isXps: boolean;
    /**
     * Indicates whether this path represents a rounded rectangle.
     *
     * @private
     */
    _isRoundedRectangle: boolean = false;
    /**
     * Initializes a new instance of the `PdfPath` class.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a line to the Graphics path
     * path.addLine({x: 10, y: 250}, {x: 200, y: 250});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfPath` class using a series of points and path types.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    public constructor(points: Array<Point>, pathTypes: PathPointType[])
    public constructor(points?: Array<Point>, pathTypes?: PathPointType[]) {
        this._fillMode = PdfFillMode.winding;
        this._isStart = true;
        this._isXps = false;
        this._brush = undefined;
        this._pen = undefined;
        if (points && pathTypes) {
            if (Array.isArray(points) && Array.isArray(pathTypes)) {
                this._points = points;
                this._pathTypes = pathTypes;
            } else {
                throw new Error('Invalid constructor arguments.');
            }
        } else {
            this._points = [];
            this._pathTypes = [];
        }
    }
    /**
     * Gets the last point of the path.
     *
     * @returns {Point} The value of the last point.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Get the last point of the path.
     * let lastPoint: Point = path.lastPoint;
     * // Draw the path on the PDF page.
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    get lastPoint(): Point {
        const value: Point = {x: 0, y: 0};
        const count: number = this._points.length;
        if (this._points.length > 0) {
            value.x = this._points[count - 1].x;
            value.y = this._points[count - 1].y;
        }
        return value;
    }
    /**
     * Gets the array of points that represent the x and y coordinates defining the path.
     *
     * @returns {Array<Point>} An array of arrays of numbers, where each inner array represents a set of points.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Get the path points of the path
     * let pathPoints: Array<Point> = path.pathPoints;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    get pathPoints(): Array<Point> {
        return this._points;
    }
    /**
     * Gets the types of the corresponding points in the path.
     *
     * @returns {PathPointType[]} An array of `PathPointType` objects representing the types of each path point.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, b: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Get the path types of the path
     * let pathTypes: PathPointType[] = path.pathTypes;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    get pathTypes(): PathPointType[] {
        return this._pathTypes;
    }
    /**
     * Gets the fill mode.
     *
     * @returns {PdfFillMode} The fill mode of the PDF path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Get the fill mode of the path
     * let fillMode: PdfFillMode = path.fillMode;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    get fillMode(): PdfFillMode {
        return this._fillMode;
    }
    /**
     * Sets the fill mode.
     *
     * @param {PdfFillMode} mode The fill mode of the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Set the fill mode of the path
     * path.fillMode = PdfFillMode.alternate;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     */
    set fillMode(mode: PdfFillMode) {
        this._fillMode = mode;
    }
    /**
     * Appends the specified path to this one.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new PDF path
     * let path1: PdfPath = new PdfPath();
     * // Add path points and path type
     * let path2: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * path1.addPath(path2);
     * // Draw the path on the PDF page
     * graphics.drawPath(path1, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfPath} path The path to append.
     */
    public addPath(path: PdfPath): void;
    /**
     * Appends the specified path points and their types to this path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new PDF path
     * let path1: PdfPath = new PdfPath();
     * // Add path points and their types
     * path1.addPath([{x: 50, y: 50}, {x: 100, y: 100}], [PathPointType.start, PathPointType.line]);
     * // Draw the path on the PDF page
     * graphics.drawPath(path1, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Array<Point>} pathPoints The path points to append.
     * @param {PathPointType[]} pathPointTypes The types of the path points.
     * @returns {void} Nothing
     */
    public addPath(pathPoints: Array<Point>, pathPointTypes: PathPointType[]): void;
    public addPath(arg1: PdfPath | Array<Point>, arg2?: PathPointType[]): void {
        if (arg1 instanceof PdfPath) {
            this._addPath(arg1._points, arg1._pathTypes);
        } else if (Array.isArray(arg1) && Array.isArray(arg2)) {
            this._addPath(arg1, arg2);
        }
    }
    /**
     * Appends points and point types to this path after validating counts and indices.
     *
     * @private
     * @param {Array<Point>} pathPoints The points to add.
     * @param {PathPointType[]} pathTypes The types to add (same length).
     * @returns {void}
     * @throws {Error} If arrays are null/empty, lengths mismatch, or index invalid.
     */
    _addPath(pathPoints: Array<Point>, pathTypes: PathPointType[]): void {
        if (!pathPoints || pathPoints.length === 0) {
            throw new Error('Path points cannot be null or undefined.');
        }
        if (!pathTypes || pathTypes.length === 0) {
            throw new Error('Path types cannot be null or undefined.');
        }
        if (pathPoints.length !== pathTypes.length) {
            throw new Error('The argument arrays should be of equal length.');
        }
        for (let i: number = 0; i < pathPoints.length; i++) {
            if (i >= pathPoints.length || i < 0) {
                throw new Error('Index' + i + 'is out of bounds.');
            }
            const p: Point = pathPoints[<number>i];
            if (Array.isArray(p)) {
                this._points.push({ x: p[0], y: p[1] });
            } else {
                this._points.push(p);
            }
            this._pathTypes.push(pathTypes[<number>i]);
        }
    }
    /**
     * Adds a line segment to the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a line segment to the path
     * path.addLine({x: 10, y: 250}, {x: 200, y: 250});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Point} start The (x,y) coordinates of the starting point of the line.
     * @param {Point} end The (x,y) coordinates of the ending point of the line.
     * @returns {void} Nothing
     */
    public addLine(start: Point, end: Point): void {
        this._addPoints([start.x, start.y, end.x, end.y], PathPointType.line);
    }
    /**
     * Adds a polyline defined by consecutive points. A single point yields a degenerate line.
     *
     * @private
     * @param {Point[]} linePoints The polyline points.
     * @returns {void}
     */
    _addLines(linePoints: Point[]): void {
        let start: Point = linePoints[0];
        if (linePoints.length === 1) {
            this._addPoint(start, PathPointType.line);
        } else {
            for (let i: number = 1; i < linePoints.length; i++) {
                const last: Point = linePoints[<number>i];
                this.addLine(start, last);
                start = last;
            }
        }
    }
    /**
     * Adds points from a numeric tuple array, marking the first
     * point of a figure as `start`, and subsequent points with the given `type`.
     *
     * @private
     * @param {number[]} points Flat array of point coordinates.
     * @param {PathPointType} type Type for non-first points (e.g., line, bezier).
     * @param {number} [start=0] Start index in `points`.
     * @param {number} [end=points.length] End index (exclusive) in `points`.
     * @returns {void}
     */
    _addPoints(points: number[], type: PathPointType, start?: number, end?: number): void {
        const startIndex: number = (typeof start !== 'undefined') ? start : 0;
        const endIndex: number = (typeof end !== 'undefined') ? end : points.length;
        for (let i: number = startIndex; i < endIndex; i += 2) {
            const point: Point = {x: points[<number>i], y: points[i + 1]};
            if (i === startIndex) {
                if (this._points.length === 0 || this._isStart) {
                    this._addPoint(point, PathPointType.start);
                    this._isStart = false;
                } else if (this._isRoundedRectangle && (point.x !== this.lastPoint.x || point.y !== this.lastPoint.y)) {
                    this._addPoint(point, PathPointType.line);
                } else if (point.x !== this.lastPoint.x && point.y !== this.lastPoint.y) {
                    this._addPoint(point, PathPointType.line);
                }
            } else {
                this._addPoint(point, type);
            }
        }
    }
    /**
     * Appends a single point with the specified path type.
     *
     * @private
     * @param {Point} point The point to add.
     * @param {PathPointType} type The path type (start/line/bezier).
     * @returns {void}
     */
    _addPoint(point: Point, type: PathPointType): void {
        this._points.push(point);
        this._pathTypes.push(type);
    }
    /**
     * Adds an arc within a bounding rectangle using the angles that define the start and sweep of the arc.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(readFromResources('Empty.pdf'));
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a arc to the path
     * path.addArc({x: 10, y: 10, width: 100, height: 200}, 90, 270);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Rectangle} bounds The bounding rectangle.
     * @param {number} startAngle The start angle of the arc.
     * @param {number} sweepAngle The angle between start angle and the end of the arc.
     * @returns {void} Nothing
     */
    public addArc(bounds: Rectangle, startAngle: number, sweepAngle: number): void {
        const points: number[] = _getBezierArc(bounds.x, bounds.y, bounds.x + bounds.width,
                                               bounds.y + bounds.height, startAngle, sweepAngle);
        for (let i: number = 0; i < points.length; ++i) {
            const list: number[] = [points[<number>i],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i],
                points[++i]];
            this._addPoints(list, PathPointType.bezier);
        }
    }
    /**
     * Adds a rectangle to the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a rectangle to the path
     * path.addRectangle({x: 10, y: 20, width: 50, height: 100});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Rectangle} bounds The bounding rectangle.
     * @returns {void} Nothing
     */
    public addRectangle(bounds: Rectangle): void {
        this.startFigure();
        this._addPoints([bounds.x, bounds.y, bounds.x + bounds.width, bounds.y, bounds.x + bounds.width,
            bounds.y + bounds.height, bounds.x, bounds.y + bounds.height], PathPointType.line);
        this.closeFigure();
    }
    /**
     * Adds a polygon to the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a polygon to the path
     * path.addPolygon([{x: 200, y: 10}, {x: 300, y: 100}, {x: 150, y: 100}, {x: 200, y: 10}]);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Array<Point>} points The points of the polygon, where each point representing the x and y coordinates.
     * @returns {void} Nothing
     */
    public addPolygon(points: Array<Point>): void {
        const newPoints: number[] = [];
        for (let i: number = 0; i < points.length; i++) {
            const element: Point = points[<number>i];
            newPoints.push(element.x, element.y);
        }
        this.startFigure();
        this._addPoints(newPoints, PathPointType.line);
        this.closeFigure();
    }
    /**
     * Adds an ellipse to the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add an ellipse to the path
     * path.addEllipse({x: 200, y: 200, width: 100, height: 50});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Rectangle} bounds The bounds of the ellipse.
     * @returns {void} Nothing
     */
    public addEllipse(bounds: Rectangle): void {
        this.startFigure();
        this.addArc(bounds, 0, 360);
        this.closeFigure();
    }
    /**
     * Adds a Bezier curve to the path using specified coordinates for the start point, two control points, and the end point.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a Bezier curve to the path
     * path.addBezier({x: 100, y: 100}, {x: 150, y: 150}, {x: 50, y: 250}, {x: 100, y: 300});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Point} start The (x, y) coordinates of the starting point of the Bezier curve.
     * @param {Point} first The (x, y) coordinates of the first control point of the Bezier curve.
     * @param {Point} second The (x, y) coordinates of the second control point of the Bezier curve.
     * @param {Point} end The (x, y) coordinates of the ending point of the Bezier curve.
     * @returns {void} Nothing
     */
    public addBezier(start: Point,
                     first: Point,
                     second: Point,
                     end: Point): void {
        const points: number[] = [start.x, start.y, first.x, first.y, second.x, second.y, end.x, end.y];
        this._addPoints(points, PathPointType.bezier);
    }
    /**
     * Adds a series of cubic Bezier segments from a point tuple collection.
     *
     * @private
     * @param {{number}} pointsCollection An array of `[x, y]` arrays in Bezier quads.
     * @returns {void}
     * @throws {Error} If the collection has fewer than 4 entries.
     */
    _addBezierPoints(pointsCollection: number[][]): void {
        if (pointsCollection.length < 4) {
            throw Error('Incorrect size of array points');
        }
        const bound: number = 3;
        let index: number = 0;
        let start: number[] = pointsCollection[<number>index];
        index++;
        while ((index + bound) <= pointsCollection.length) {
            const inner1: number[] = pointsCollection[<number>index];
            index++;
            const inner2: number[] = pointsCollection[<number>index];
            index++;
            const end: number[] = pointsCollection[<number>index];
            index++;
            this.addBezier({x: start[0], y: start[1]}, {x: inner1[0], y: inner1[1]}, {x: inner2[0], y: inner2[1]}, {x: end[0], y: end[1]});
            start = end;
        }
    }
    /**
     * Adds a pie slice to the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a pie slice to the path
     * path.addPie({x: 0, y: 20, width: 100, height: 100}, 270, 45);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Rectangle} bounds The bounding rectangle.
     * @param {number} startAngle The angle in degrees measured clockwise from the x-axis to the start of the pie slice.
     * @param {number} sweepAngle The angle in degrees measured clockwise from the startAngle parameter to the end of the pie slice.
     * @returns {void} Nothing
     */
    public addPie(bounds: Rectangle, startAngle: number, sweepAngle: number): void {
        this.startFigure();
        this.addArc(bounds, startAngle, sweepAngle);
        this._addPoint({x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2}, PathPointType.line);
        this.closeFigure();
    }
    /**
     * Starts a new figure in the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([{r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Start a new figure in the path
     * path.startFigure();
     * // Add some path points (optional)
     * path.addLine({x: 50, y: 50}, {x: 100, y: 50});
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void} Nothing
     */
    public startFigure(): void {
        this._isStart = true;
    }
    /**
     * Closes all open figures in the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Close all open figures
     * path.closeFigure();
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void} Nothing
     */
    public closeFigure(): void;
    /**
     * Closes all non-closed figures in the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Close the figure at index 1
     * path.closeFigure(1);
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {number} index The optional index of the figure to close. If not provided, the last figure is closed.
     * @returns {void} Nothing
     */
    public closeFigure(index: number): void;
    public closeFigure(index?: number): void {
        if (typeof index !== 'undefined') {
            let type: PathPointType = this._pathTypes[<number>index];
            type |= PathPointType.closePath;
            this._pathTypes[<number>index] = type;
        } else {
            if (this._points.length > 0) {
                this.closeFigure(this._points.length - 1);
            }
            this.startFigure();
        }
    }
    /**
     * Closes all non-closed figures in the path.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush({r: 0, g: 255, b: 255});
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([{x: 50, y: 50}, {x: 100, y: 50}, {x: 100, y: 100}, {x: 50, y: 100}, {x: 50, y: 50}], [0, 1, 1, 1, 1]);
     * // Close all non-closed figures
     * path.closeAllFigures();
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void} Nothing
     */
    public closeAllFigures(): void {
        for (let i: number = 0; i < this._points.length; ++i) {
            const pointType: PathPointType = this._pathTypes[<number>i];
            let flag: boolean = false;
            if (i !== 0 && pointType === PathPointType.start) {
                this.closeFigure(i - 1);
                flag = true;
            } else if (i === this._pathTypes.length - 1 && !flag && this._isXps) {
                if (this._points[0].x === this._points[<number>i].x &&
                    this._points[0].y === this._points[<number>i].y) {
                    this.closeFigure(i);
                }
            }
        }
    }
    /**
     * Computes the axis-aligned bounding box of the current path points.
     *
     * @private
     * @returns {number[]} The bounds as `[x, y, width, height]`, or `[0,0,0,0]` if empty.
     */
    _getBounds(): number[] {
        let bounds: number[] = [0, 0, 0, 0];
        if (this._points.length > 0) {
            let xmin: number = this._points[0].x;
            let xmax: number = this._points[0].x;
            let ymin: number = this._points[0].y;
            let ymax: number = this._points[0].y;
            for (let i: number = 1; i < this._points.length; i++) {
                const point: Point = this._points[<number>i];
                xmin = Math.min(point.x, xmin);
                xmax = Math.max(point.x, xmax);
                ymin = Math.min(point.y, ymin);
                ymax = Math.max(point.y, ymax);
            }
            bounds = [xmin, ymin, xmax - xmin, ymax - ymin];
        }
        return bounds;
    }
}
