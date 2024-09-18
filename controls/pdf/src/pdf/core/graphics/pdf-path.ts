import { PdfPen, PdfBrush } from './pdf-graphics';
import { _getBezierArc } from './../utils';
import { PdfFillMode, PathPointType } from './../enumerator';
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
 * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
 * // Create a new PDF path
 * let path: PdfPath = new PdfPath();
 * // Add a line to the Graphics path
 * path.addLine(10, 250, 200, 250);
 * // Draw the path on the PDF page
 * graphics.drawPath(path, pen);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPath {
    _points: Array<number[]> = [];
    _pathTypes: PathPointType[] = [];
    _pen: PdfPen;
    _brush: PdfBrush;
    _fillMode: PdfFillMode;
    _isStart: boolean;
    _isXps: boolean;
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a line to the Graphics path
     * path.addLine(10, 250, 200, 250);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(points: Array<number[]>, pathTypes: PathPointType[])
    constructor(points?: Array<number[]>, pathTypes?: PathPointType[]) {
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
     * @returns {number[]} The value of the last point.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Get the last point of the path.
     * let lastPoint: number[] = path.lastPoint;
     * // Draw the path on the PDF page.
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get lastPoint(): number[] {
        const value: number[] = [0, 0];
        const count: number = this._points.length;
        if (this._points.length > 0) {
            value[0] = this._points[count - 1][0];
            value[1] = this._points[count - 1][1];
        }
        return value;
    }
    /**
     * Gets the array of points that represent the x and y coordinates defining the path.
     *
     * @returns {Array<number[]>} An array of arrays of numbers, where each inner array represents a set of points.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Get the path points of the path
     * let pathPoints: Array<number[]> = path.pathPoints;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pathPoints(): Array<number[]> {
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Get the path types of the path
     * let pathTypes: PathPointType[] = path.pathTypes;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Get the fill mode of the path
     * let fillMode: PdfFillMode = path.fillMode;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
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
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Set the fill mode of the path
     * path.fillMode = PdfFillMode.alternate;
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fillMode(mode: PdfFillMode) {
        this._fillMode = mode;
    }
    /**
     * Appends the specified path to this one.
     *
     * @param {PdfPath} path The path to append.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Get the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new PDF path
     * let path1: PdfPath = new PdfPath();
     * // Add path points and path type
     * let path2: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * path1.addPath(path2);
     * // Draw the path on the PDF page
     * graphics.drawPath(path1, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPath(path: PdfPath): void;
    /**
     * Appends the specified path points and their types to this path.
     *
     * @param {Array<number[]>} pathPoints The path points to append.
     * @param {PathPointType[]} pathPointTypes The types of the path points.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new PDF path
     * let path1: PdfPath = new PdfPath();
     * // Add path points and their types
     * path1.addPath([[50, 50], [100, 100]], [PathPointType.start, PathPointType.line]);
     * // Draw the path on the PDF page
     * graphics.drawPath(path1, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPath(pathPoints: Array<number[]>, pathPointTypes: PathPointType[]): void;
    addPath(arg1: PdfPath | Array<number[]>, arg2?: PathPointType[]): void {
        if (arg1 instanceof PdfPath) {
            this._addPath(arg1._points, arg1._pathTypes);
        } else if (Array.isArray(arg1) && Array.isArray(arg2)) {
            this._addPath(arg1, arg2);
        }
    }
    _addPath(pathPoints: Array<number[]>, pathTypes: PathPointType[]): void {
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
            this._points.push([...pathPoints[Number.parseInt(i.toString(), 10)]]);
            this._pathTypes.push(pathTypes[Number.parseInt(i.toString(), 10)]);
        }
    }
    /**
     * Adds a line segment to the path.
     *
     * @param {number} x1 The x-coordinate of the starting point of the line.
     * @param {number} y1 The y-coordinate of the starting point of the line.
     * @param {number} x2 The x-coordinate of the ending point of the line.
     * @param {number} y2 The y-coordinate of the ending point of the line.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a line segment to the path
     * path.addLine(10, 250, 200, 250);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addLine(x1: number, y1: number, x2: number, y2: number): void {
        this._addPoints([x1, y1, x2, y2], PathPointType.line);
    }
    _addLines(linePoints: Array<number[]>): void {
        let start: number[] = linePoints[0];
        if (linePoints.length === 1) {
            this._addPoint(linePoints[0], PathPointType.line);
        } else {
            for (let i: number = 1; i < linePoints.length; i++) {
                const last: number[] = linePoints[Number.parseInt(i.toString(), 10)];
                this.addLine(start[0], start[1], last[0], last[1]);
                start = last;
            }
        }
    }
    _addPoints(points: number[], type: PathPointType, start?: number, end?: number): void {
        const startIndex: number = (typeof start !== 'undefined') ? start : 0;
        const endIndex: number = (typeof end !== 'undefined') ? end : points.length;
        for (let i: number = startIndex; i < endIndex; i += 2) {
            const point: number[] = [points[Number.parseInt(i.toString(), 10)], points[i + 1]];
            if (i === startIndex) {
                if (this._points.length === 0 || this._isStart) {
                    this._addPoint(point, PathPointType.start);
                    this._isStart = false;
                } else if (this._isRoundedRectangle && (point[0] !== this.lastPoint[0] || point[1] !== this.lastPoint[1])) {
                    this._addPoint(point, PathPointType.line);
                } else if (point[0] !== this.lastPoint[0] && point[1] !== this.lastPoint[1]) {
                    this._addPoint(point, PathPointType.line);
                }
            } else {
                this._addPoint(point, type);
            }
        }
    }
    _addPoint(point: number[], type: PathPointType): void {
        this._points.push(point);
        this._pathTypes.push(type);
    }
    /**
     * Adds an arc within a bounding rectangle using the angles that define the start and sweep of the arc.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangular region.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangular region.
     * @param {number} width The width of the rectangular region.
     * @param {number} height The height of the rectangular region.
     * @param {number} startAngle The start angle of the arc.
     * @param {number} sweepAngle The angle between start angle and the end of the arc.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(readFromResources('Empty.pdf'));
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a Bezier curve to the path
     * path.addBezier(10, 100, 50, 150, 150, 150, 200, 100);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addArc(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number): void {
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
            this._addPoints(list, PathPointType.bezier);
        }
    }
    /**
     * Adds a rectangle to the path.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangle.
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a rectangle to the path
     * path.addRectangle(10, 20, 50, 100);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addRectangle(x: number, y: number, width: number, height: number): void {
        this.startFigure();
        this._addPoints([x, y, x + width, y, x + width, y + height, x, y + height], PathPointType.line);
        this.closeFigure();
    }
    /**
     * Adds a polygon to the path.
     *
     * @param {Array<number[]>} points The points of the polygon, where each point is an array of two numbers representing the x and y coordinates.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a polygon to the path
     * path.addPolygon([[200, 10], [300, 100], [150, 100], [200, 10]]);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPolygon(points: Array<number[]>): void {
        const newPoints: number[] = [];
        points.forEach((element: number[]) => {
            newPoints.push(element[0], element[1]);
        });
        this.startFigure();
        this._addPoints(newPoints, PathPointType.line);
        this.closeFigure();
    }
    /**
     * Adds an ellipse to the path.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the rectangular region that bounds the ellipse.
     * @param {number} y The y-coordinate of the upper-left corner of the rectangular region that bounds the ellipse.
     * @param {number} width The width of the bounding rectangle for the ellipse.
     * @param {number} height The height of the bounding rectangle for the ellipse.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add an ellipse to the path
     * path.addEllipse(200, 200, 100, 50);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addEllipse(x: number, y: number, width: number, height: number): void {
        this.startFigure();
        this.addArc(x, y, width, height, 0, 360);
        this.closeFigure();
    }
    /**
     * Adds a Bezier curve to the path using specified coordinates for the start point, two control points, and the end point.
     *
     * @param {number} startX The x-coordinate of the starting point of the Bezier curve.
     * @param {number} startY The y-coordinate of the starting point of the Bezier curve.
     * @param {number} firstX The x-coordinate of the first control point of the Bezier curve.
     * @param {number} firstY The y-coordinate of the first control point of the Bezier curve.
     * @param {number} secondX The x-coordinate of the second control point of the Bezier curve.
     * @param {number} secondY The y-coordinate of the second control point of the Bezier curve.
     * @param {number} endX The x-coordinate of the ending point of the Bezier curve.
     * @param {number} endY The y-coordinate of the ending point of the Bezier curve.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a Bezier curve to the path
     * path.addBezier(100, 100, 150, 150, 50, 250, 100, 300);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addBezier(startX: number,
              startY: number,
              firstX: number,
              firstY: number,
              secondX: number,
              secondY: number,
              endX: number,
              endY: number): void {
        const points: number[] = [startX, startY, firstX, firstY, secondX, secondY, endX, endY];
        this._addPoints(points, PathPointType.bezier);
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
            this.addBezier(start[0], start[1], inner1[0], inner1[1], inner2[0], inner2[1], end[0], end[1]);
            start = end;
        }
    }
    /**
     * Adds a pie slice to the path.
     *
     * @param {number} x The x-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} y The y-coordinate of the upper-left corner of the bounding rectangle.
     * @param {number} width The width of the bounding rectangle.
     * @param {number} height The height of the bounding rectangle.
     * @param {number} startAngle The angle in degrees measured clockwise from the x-axis to the start of the pie slice.
     * @param {number} sweepAngle The angle in degrees measured clockwise from the startAngle parameter to the end of the pie slice.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Add a pie slice to the path
     * path.addPie(0, 20, 100, 100, 270, 45);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPie(x: number, y: number, width: number, height: number, startAngle: number, sweepAngle: number): void {
        this.startFigure();
        this.addArc(x, y, width, height, startAngle, sweepAngle);
        this._addPoint([x + width / 2, y + height / 2], PathPointType.line);
        this.closeFigure();
    }
    /**
     * Starts a new figure in the path.
     *
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath();
     * // Start a new figure in the path
     * path.startFigure();
     * // Add some path points (optional)
     * path.addLine(50, 50, 100, 50);
     * // Draw the path on the PDF page
     * graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    startFigure(): void {
        this._isStart = true;
    }
    /**
     * Closes all open figures in the path.
     *
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Close all open figures
     * path.closeFigure();
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    closeFigure(): void;
    /**
     * Closes all non-closed figures in the path.
     *
     * @param {number} index The optional index of the figure to close. If not provided, the last figure is closed.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Close the figure at index 1
     * path.closeFigure(1);
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    closeFigure(index: number): void;
    closeFigure(index?: number): void {
        if (typeof index !== 'undefined') {
            let type: PathPointType = this._pathTypes[Number.parseInt(index.toString(), 10)];
            type |= PathPointType.closePath;
            this._pathTypes[Number.parseInt(index.toString(), 10)] = type;
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
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the graphics object of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen
     * let pen: PdfPen = new PdfPen([0, 0, 0], 1);
     * // Create a new brush
     * let brush: PdfBrush = new PdfBrush([0, 255, 255]);
     * // Create a new PDF path
     * let path: PdfPath = new PdfPath([[50, 50], [100, 50], [100, 100], [50, 100], [50, 50]], [0, 1, 1, 1, 1]);
     * // Close all non-closed figures
     * path.closeAllFigures();
     * // Draw the path on the PDF page
     * page.graphics.drawPath(path, pen, brush);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    closeAllFigures(): void {
        for (let i: number = 0; i < this._points.length; ++i) {
            const pointType: PathPointType = this._pathTypes[Number.parseInt(i.toString(), 10)];
            let flag: boolean = false;
            if (i !== 0 && pointType === PathPointType.start) {
                this.closeFigure(i - 1);
                flag = true;
            } else if (i === this._pathTypes.length - 1 && !flag && this._isXps) {
                if (this._points[0][0] === this._points[Number.parseInt(i.toString(), 10)][0] &&
                    this._points[0][1] === this._points[Number.parseInt(i.toString(), 10)][1]) {
                    this.closeFigure(i);
                }
            }
        }
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
