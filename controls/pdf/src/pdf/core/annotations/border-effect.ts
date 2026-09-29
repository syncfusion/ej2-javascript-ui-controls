import { _PdfTransformationMatrix, PdfGraphics } from '../graphics/pdf-graphics';
import { _fromRectangle } from '../utils';
import { Rectangle, Point } from './../pdf-type';
/**
 * Renders a cloud-style border effect for ellipse annotations in a PDF document.
 * Computes the bumpy arc geometry, bounding box, and writes path operators to the graphics stream.
 *
 * @private
 */
export class _CloudBorderEffect {
    /**
     * The rectangle updated after computing the cloud layout offsets.
     *
     * @private
     */
    _updatedRectangle: Rectangle;
    /**
     * Minimum X coordinate of the current bounding box.
     *
     * @private
     */
    _boundingBoxMinX: number = 0;
    /**
     * Minimum Y coordinate of the current bounding box.
     *
     * @private
     */
    _boundingBoxMinY: number = 0;
    /**
     * Indicates whether the path writer has been initialized with a starting point.
     *
     * @private
     */
    _isWriter: boolean = false;
    /**
     * Maximum X coordinate of the current bounding box.
     *
     * @private
     */
    _boundingBoxMaxX: number = 0;
    /**
     * Maximum Y coordinate of the current bounding box.
     *
     * @private
     */
    _boundingBoxMaxY: number = 0;
    /**
     * The PDF graphics context used to write path and drawing operators.
     *
     * @private
     */
    _graphics: PdfGraphics;
    /**
     * Cloud border intensity level that controls arc radius and density.
     *
     * @private
     */
    _intensity: number;
    /**
     * Width of the annotation border stroke.
     *
     * @private
     */
    _borderWidth: number;
    /**
     * Source rectangle defining the annotation bounds before layout adjustment.
     *
     * @private
     */
    _cloudRectangle: Rectangle;
    /**
     * Initializes a new cloud border effect with the given graphics context and layout parameters.
     *
     * @param {PdfGraphics} graphics - The graphics stream to write path operators to.
     * @param {number} intensity - Cloud intensity that scales arc radius.
     * @param {number} borderWidth - Stroke width of the annotation border.
     * @param {Rectangle} cloudRect - Bounding rectangle of the annotation.
     * @private
     */
    constructor(graphics: PdfGraphics, intensity: number, borderWidth: number, cloudRect: Rectangle) {
        this._graphics = graphics;
        this._intensity = intensity;
        this._borderWidth = borderWidth;
        this._cloudRectangle = cloudRect;
    }
    /**
     * Computes the rectangle adjusted relative to the bounding box extents.
     * Returns a border-offset rectangle when both width and height are zero.
     *
     * @returns {Rectangle} The adjusted rectangle in bounding-box local coordinates.
     * @private
     */
    _getAdjustedRectangle(): Rectangle {
        if (this._cloudRectangle.width === 0 && this._cloudRectangle.height === 0) {
            const borderOffset: number = this._borderWidth / 2;
            return {x: borderOffset, y: borderOffset, width: this._borderWidth, height: this._borderWidth};
        }
        const rect: Rectangle = (this._updatedRectangle && (this._updatedRectangle.width !== 0 || this._updatedRectangle.height !== 0
        )) ? this._updatedRectangle : this._cloudRectangle;
        const rectValue: number[] = _fromRectangle(rect);
        const left: number = rectValue[0] - this._boundingBoxMinX;
        const bottom: number = rectValue[1] - this._boundingBoxMinY;
        const right: number = this._boundingBoxMaxX - rectValue[2];
        const top: number = this._boundingBoxMaxY - rectValue[3];
        return { x: left, y: bottom, width: right - left, height: top - bottom };
    }
    /**
     * Builds and writes the complete cloud border path to the graphics stream.
     * Computes the adjusted rectangle, draws the cloud arcs, then closes the path.
     *
     * @returns {void}
     * @private
     */
    _createCloudBorder(): void {
        this._updatedRectangle = this._updateRectangle({ x: 0, y: 0, width: 0, height: 0 }, 0);
        const left: number = this._updatedRectangle.x;
        const bottom: number = this._updatedRectangle.y;
        const right: number = left + this._updatedRectangle.width;
        const top: number = bottom + this._updatedRectangle.height;
        this._drawCloudBorderStyle(left, bottom, right, top);
        this._close();
    }
    /**
     * Normalizes the cloud rectangle and applies the given inset offsets to produce
     * the final layout rectangle used for drawing.
     *
     * @param {Rectangle} rd - Optional inset rectangle; ignored when both dimensions are zero.
     * @param {number} minimum - Minimum inset value applied when rd is absent or zero.
     * @returns {Rectangle} The inset-adjusted layout rectangle.
     * @private
     */
    _updateRectangle(rd: Rectangle, minimum: number): Rectangle {
        let rectangleLeft: number = this._cloudRectangle.x;
        let rectangleBottom: number = this._cloudRectangle.y;
        let rectangleRight: number = this._cloudRectangle.x + this._cloudRectangle.width;
        let rectangleTop: number = this._cloudRectangle.y + this._cloudRectangle.height;
        rectangleLeft = Math.min(rectangleLeft, rectangleRight);
        rectangleBottom = Math.min(rectangleBottom, rectangleTop);
        rectangleRight = Math.max(rectangleLeft, rectangleRight);
        rectangleTop = Math.max(rectangleBottom, rectangleTop);
        let rdLeftValue: number;
        let rdBottomValue: number;
        let rdRightValue: number;
        let rdTopValue: number;
        if (rd && (rd.width !== 0 || rd.height !== 0)) {
            rdLeftValue = Math.max(rd.x, minimum);
            rdBottomValue = Math.max(rd.y, minimum);
            rdRightValue = Math.max(rd.x + rd.width, minimum);
            rdTopValue = Math.max(rd.y + rd.height, minimum);
        } else {
            rdLeftValue = minimum;
            rdBottomValue = minimum;
            rdRightValue = minimum;
            rdTopValue = minimum;
        }
        rectangleLeft += rdLeftValue;
        rectangleBottom += rdBottomValue;
        rectangleRight -= rdRightValue;
        rectangleTop -= rdTopValue;
        return {
            x: rectangleLeft,
            y: rectangleBottom,
            width: rectangleRight - rectangleLeft,
            height: rectangleTop - rectangleBottom
        };
    }
    /**
     * Expands the tracked bounding box to include the given point coordinates.
     *
     * @param {number} x - X coordinate of the point to include.
     * @param {number} y - Y coordinate of the point to include.
     * @returns {void}
     * @private
     */
    _updateBoundingBox(x: number, y: number): void {
        this._boundingBoxMinX = Math.min(this._boundingBoxMinX, x);
        this._boundingBoxMinY = Math.min(this._boundingBoxMinY, y);
        this._boundingBoxMaxX = Math.max(this._boundingBoxMaxX, x);
        this._boundingBoxMaxY = Math.max(this._boundingBoxMaxY, y);
    }
    /**
     * Returns a rectangle that tightly encloses all points recorded in the bounding box.
     *
     * @returns {Rectangle} The current bounding box as a rectangle.
     * @private
     */
    _getRectangleBounds(): Rectangle {
        return {
            x: this._boundingBoxMinX,
            y: this._boundingBoxMinY,
            width: this._boundingBoxMaxX - this._boundingBoxMinX,
            height: this._boundingBoxMaxY - this._boundingBoxMinY
        };
    }
    /**
     * Retrieves the bounding box enclosing the entire cloud border path.
     *
     * @returns {Rectangle} The bounding box rectangle.
     * @private
     */
    _getBoundingBox(): Rectangle {
        return this._getRectangleBounds();
    }
    /**
     * Creates a transformation matrix that translates by the negative of the given origin.
     * Used to shift the cloud path into its local coordinate space.
     *
     * @param {number} minX - X translation offset (negated internally).
     * @param {number} minY - Y translation offset (negated internally).
     * @returns {_PdfTransformationMatrix} The resulting translation matrix.
     * @private
     */
    _getTranslateInstance(minX: number, minY: number): _PdfTransformationMatrix {
        const matrix: _PdfTransformationMatrix = new _PdfTransformationMatrix();
        matrix._translate(-minX, -minY);
        return matrix;
    }
    /**
     * Approximates an ellipse as a polyline by flattening four cubic Bézier segments.
     * The resulting point array forms a closed loop used for cloud arc placement.
     *
     * @param {number} left - Left edge of the ellipse bounding box.
     * @param {number} bottom - Bottom edge of the ellipse bounding box.
     * @param {number} right - Right edge of the ellipse bounding box.
     * @param {number} top - Top edge of the ellipse bounding box.
     * @returns {Point[]} Ordered polyline points approximating the ellipse perimeter.
     * @private
     */
    _flattenEllipsePoints(left: number, bottom: number, right: number, top: number): Point[] {
        const rx: number = (right - left) / 2;
        const ry: number = (top - bottom) / 2;
        const cx: number = left + rx;
        const cy: number = bottom + ry;
        const k: number = 0.5522847498307936;
        const ox: number = rx * k;
        const oy: number = ry * k;
        const segments: Point[][] = [
            [
                { x: cx + rx, y: cy },
                { x: cx + rx, y: cy + oy },
                { x: cx + ox, y: cy + ry },
                { x: cx, y: cy + ry }
            ],
            [
                { x: cx, y: cy + ry },
                { x: cx - ox, y: cy + ry },
                { x: cx - rx, y: cy + oy },
                { x: cx - rx, y: cy }
            ],
            [
                { x: cx - rx, y: cy },
                { x: cx - rx, y: cy - oy },
                { x: cx - ox, y: cy - ry },
                { x: cx, y: cy - ry }
            ],
            [
                { x: cx, y: cy - ry },
                { x: cx + ox, y: cy - ry },
                { x: cx + rx, y: cy - oy },
                { x: cx + rx, y: cy }
            ]
        ];
        const points: Point[] = [];
        for (const curve of segments) {
            this._flattenBezier(
                curve[<number>0],
                curve[<number>1],
                curve[<number>2],
                curve[<number>3],
                0.5,
                points
            );
        }
        points.push(points[0]);
        return points;
    }
    /**
     * Recursively subdivides a cubic Bézier curve until it is flat within the given tolerance,
     * then appends the endpoint to the output array.
     *
     * @param {Point} p0 - Curve start point.
     * @param {Point} p1 - First control point.
     * @param {Point} p2 - Second control point.
     * @param {Point} p3 - Curve end point.
     * @param {number} tolerance - Maximum allowed deviation used to test flatness.
     * @param {Point[]} output - Accumulator array that receives the flattened points.
     * @returns {void}
     * @private
     */
    _flattenBezier(p0: Point, p1: Point, p2: Point, p3: Point, tolerance: number, output: Point[]): void {
        if (this._isFlatEnough(p0, p1, p2, p3, tolerance)) {
            if (output.length === 0) {
                output.push(p0);
            }
            output.push(p3);
            return;
        }
        const p01: Point = this._mid(p0, p1);
        const p12: Point = this._mid(p1, p2);
        const p23: Point = this._mid(p2, p3);
        const p012: Point = this._mid(p01, p12);
        const p123: Point = this._mid(p12, p23);
        const p0123: Point = this._mid(p012, p123);
        this._flattenBezier(
            p0, p01, p012, p0123,
            tolerance, output
        );
        this._flattenBezier(p0123, p123, p23, p3, tolerance, output);
    }
    /**
     * Computes the midpoint between two 2-D points.
     *
     * @param {Point} p1 - First point.
     * @param {Point} p2 - Second point.
     * @returns {Point} The midpoint of p1 and p2.
     * @private
     */
    _mid(p1: Point, p2: Point): Point {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
    }
    /**
     * Determines whether a cubic Bézier curve is flat enough to be approximated as a straight line
     * within the given squared tolerance using the convex-hull deviation test.
     *
     * @param {Point} p0 - Curve start point.
     * @param {Point} p1 - First control point.
     * @param {Point} p2 - Second control point.
     * @param {Point} p3 - Curve end point.
     * @param {number} tolerance - Flatness threshold; the curve is considered flat when the deviation is within this value.
     * @returns {boolean} True when the curve deviates less than the tolerance, false otherwise.
     * @private
     */
    _isFlatEnough(p0: Point, p1: Point, p2: Point, p3: Point, tolerance: number): boolean {
        const ux: number = 3 * p1.x - 2 * p0.x - p3.x;
        const uy: number = 3 * p1.y - 2 * p0.y - p3.y;
        const vx: number = 3 * p2.x - 2 * p3.x - p0.x;
        const vy: number = 3 * p2.y - 2 * p3.y - p0.y;
        const d: number = Math.max(ux * ux + uy * uy, vx * vx + vy * vy);
        return d <= tolerance * tolerance * 16;
    }
    /**
     * Closes the current path with the `h` operator and expands the bounding box
     * outward by half the border width to account for stroke overhang.
     *
     * @returns {void}
     * @private
     */
    _close(): void {
        this._graphics._sw._writeOperator('h');
        if (this._borderWidth > 0) {
            const offset: number = this._borderWidth / 2;
            this._boundingBoxMinX -= offset;
            this._boundingBoxMinY -= offset;
            this._boundingBoxMaxX += offset;
            this._boundingBoxMaxY += offset;
        }
    }
    /**
     * Calculates the radius of each cloud bump arc based on the intensity and border width.
     *
     * @returns {number} The computed cloud arc radius.
     * @private
     */
    _calculateCloudRadius(): number {
        return (4.75 * this._intensity + 0.5 * this._borderWidth);
    }
    /**
     * Draws the full cloud border style by distributing evenly-spaced bump arcs around
     * the flattened ellipse perimeter. Falls back to a plain ellipse when intensity is
     * zero, the rectangle is too small, or the computed radius is below the minimum threshold.
     *
     * @param {number} left - Left edge of the layout rectangle.
     * @param {number} bottom - Bottom edge of the layout rectangle.
     * @param {number} right - Right edge of the layout rectangle.
     * @param {number} top - Top edge of the layout rectangle.
     * @returns {void}
     * @private
     */
    _drawCloudBorderStyle(left: number, bottom: number, right: number, top: number): void {
        if (this._intensity <= 0) {
            this._drawEllipseAnnotation(left, bottom, right, top);
        }
        const width: number = right - left;
        const height: number = top - bottom;
        const radius: number = this._calculateCloudRadius();
        const radiusOffset: number = Math.sin(12 * (Math.PI / 180)) * radius - 1.5;
        if (width > 2 * radiusOffset) {
            left += radiusOffset;
            right -= radiusOffset;
        } else {
            const midPoint: number = (left + right) / 2;
            left = midPoint - 0.1;
            right = midPoint + 0.1;
        }
        if (height > 2 * radiusOffset) {
            top -= radiusOffset;
            bottom += radiusOffset;
        } else {
            const midPoint: number = (top + bottom) / 2;
            top = midPoint + 0.1;
            bottom = midPoint - 0.1;
        }
        const flatEllipse: Point[] = this._flattenEllipsePoints(left, bottom, right, top);
        let numberOfPoints: number = flatEllipse.length;
        if (numberOfPoints < 2) {
            return;
        }
        let totalLength: number = 0;
        for (let i: number = 1; i < numberOfPoints; i++) {
            totalLength += this._obtainDistance(
                flatEllipse[i - 1],
                flatEllipse[<number>i]
            );
        }
        const cosineOfAngle34: number = Math.cos(34 * (Math.PI / 180));
        let curlDistance: number = 2 * cosineOfAngle34 * radius;
        const numberOfCurves: number = Math.ceil(totalLength / curlDistance);
        if (numberOfCurves < 2) {
            this._drawEllipseAnnotation(left, bottom, right, top);
            return;
        }
        curlDistance = totalLength / numberOfCurves;
        let adjustedRadius: number = curlDistance / (2 * cosineOfAngle34);
        if (adjustedRadius < 0.5) {
            adjustedRadius = 0.5;
            curlDistance = 2 * cosineOfAngle34 * adjustedRadius;
        }
        else if (adjustedRadius < 3.0) {
            this._drawEllipseAnnotation(left, bottom, right, top);
            return;
        }
        const curveCenterPoints: Point[] = [];
        let lengthLeft: number = 0;
        const comparisonTolerance: number = this._borderWidth * 0.10;
        for (let i: number = 0; i + 1 < numberOfPoints; i++) {
            const point1: Point = flatEllipse[<number>i];
            const point2: Point = flatEllipse[i + 1];
            const dx: number = point2.x - point1.x;
            const dy: number = point2.y - point1.y;
            const length: number = this._obtainDistance(point1, point2);
            if (length === 0) {
                continue;
            }
            let lengthPending: number = length + lengthLeft;
            if (lengthPending >= curlDistance - comparisonTolerance ||
                i === numberOfPoints - 2) {
                const cos: number = dx / length;
                const sin: number = dy / length;
                let distance: number = curlDistance - lengthLeft;
                do {
                    const x: number = point1.x + distance * cos;
                    const y: number = point1.y + distance * sin;
                    if (curveCenterPoints.length < numberOfCurves) {
                        curveCenterPoints.push({x, y});
                    }
                    lengthPending -= curlDistance;
                    distance += curlDistance;
                } while (lengthPending >= curlDistance - comparisonTolerance);
                lengthLeft = Math.max(0, lengthPending);
            }
            else {
                lengthLeft += length;
            }
        }
        numberOfPoints = curveCenterPoints.length;
        let previousAngle: number = 0;
        let previousAlpha: number = 0;
        for (let i: number = 0; i < numberOfPoints; i++) {
            let nextIndex: number = i + 1;
            if (i + 1 >= numberOfPoints) {
                nextIndex = 0;
            }
            const point: Point = curveCenterPoints[<number>i];
            const pointNext: Point = curveCenterPoints[<number>nextIndex];
            if (i === 0) {
                const pointPrev: Point = curveCenterPoints[numberOfPoints - 1];
                previousAngle = Math.atan2(point.y - pointPrev.y, point.x - pointPrev.x);
                previousAlpha = this._calculateEllipseParameters(pointPrev, point, adjustedRadius, curlDistance);
            }
            const angleCurve: number = Math.atan2(pointNext.y - point.y, pointNext.x - point.x);
            const alpha: number = this._calculateEllipseParameters(point, pointNext, adjustedRadius, curlDistance);
            this._drawCornerCurve(previousAngle, angleCurve, adjustedRadius, point.x,
                                  point.y, alpha, previousAlpha, !this._isWriter);
            previousAngle = angleCurve;
            previousAlpha = alpha;
        }
    }
    /**
     * Computes the angular half-opening (alpha) of a cloud arc ellipse segment
     * given the chord length between two consecutive center points.
     *
     * @param {Point} point - Start center point of the arc segment.
     * @param {Point} pointNext - End center point of the arc segment.
     * @param {number} radius - Radius of the arc.
     * @param {number} curlAdvance - Ideal arc chord length (curl distance).
     * @returns {number} The arc half-angle in radians; defaults to 34° when chord length is zero.
     * @private
     */
    _calculateEllipseParameters(point: Point, pointNext: Point, radius: number, curlAdvance: number): number {
        const length: number = this._obtainDistance(point, pointNext);
        if (length === 0) {
            return 34 * (Math.PI / 180);
        }
        const e: number = length - curlAdvance;
        const arg: number = (curlAdvance / 2 + e / 2) / radius;
        return (arg < -1 || arg > 1) ? 0 : Math.acos(arg);
    }
    /**
     * Writes the two arc segments that form a single cloud bump at a given center point.
     * The first segment covers the entry notch and the second sweeps the main bump arc.
     *
     * @param {number} previousAngle - Tangent angle arriving at the center from the previous point.
     * @param {number} curveAngle - Tangent angle leaving the center toward the next point.
     * @param {number} radius - Radius of the bump arc circle.
     * @param {number} centerX - X coordinate of the bump arc center.
     * @param {number} centerY - Y coordinate of the bump arc center.
     * @param {number} rotationAngle - Half-angle offset for the exit arc.
     * @param {number} previousRotationAngle - Half-angle offset for the entry arc.
     * @param {boolean} addMoveTo - When true, begins the path with a moveTo before the first segment.
     * @returns {void}
     * @private
     */
    _drawCornerCurve(previousAngle: number, curveAngle: number, radius: number, centerX: number, centerY: number,
                     rotationAngle: number, previousRotationAngle: number, addMoveTo: boolean): void {
        let a: number = previousAngle + Math.PI + previousRotationAngle;
        let b: number = previousAngle + Math.PI + previousRotationAngle - (22 * Math.PI / 180);
        this._calculateArcSegment(a, b, centerX,
                                  centerY, radius, radius, undefined, addMoveTo);
        a = b;
        b = curveAngle - rotationAngle;
        this._calculateArc(a, b, radius, radius, centerX, centerY, undefined, false);
    }
    /**
     * Computes the Euclidean distance between two 2-D points.
     *
     * @param {Point} point1 - First point.
     * @param {Point} point2 - Second point.
     * @returns {number} The straight-line distance between the two points.
     * @private
     */
    _obtainDistance(point1: Point, point2: Point): number {
        const dx: number = point1.x - point2.x;
        const dy: number = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Emits a moveTo path operator at the given coordinates, initializing or updating
     * the bounding box depending on whether the writer has been started.
     * Y is negated to convert from PDF to graphics coordinate space.
     *
     * @param {number} x - X coordinate of the new path start point.
     * @param {number} y - Y coordinate of the new path start point.
     * @returns {void}
     * @private
     */
    _moveTo(x: number, y: number): void {
        if (this._isWriter) {
            this._updateBoundingBox(x, y);
        } else {
            this._startWriter(x, y);
        }
        this._graphics._sw._beginPath(x, -y);
    }
    /**
     * Initializes the bounding box from the given starting point, sets the writer flag,
     * and emits the round-join line-join operator to the graphics stream.
     *
     * @param {number} x - X coordinate of the initial bounding box seed point.
     * @param {number} y - Y coordinate of the initial bounding box seed point.
     * @returns {void}
     * @private
     */
    _startWriter(x: number, y: number): void {
        this._boundingBoxMinX = x;
        this._boundingBoxMinY = y;
        this._boundingBoxMaxX = x;
        this._boundingBoxMaxY = y;
        this._isWriter = true;
        this._graphics._sw._writeOperator('2 j');
    }
    /**
     * Emits a cubic Bézier curveTo path operator for three control/endpoint pairs,
     * updating the bounding box for each point. Y coordinates are negated for the
     * graphics coordinate conversion.
     *
     * @param {number} x1 - X coordinate of the first control point.
     * @param {number} y1 - Y coordinate of the first control point.
     * @param {number} x2 - X coordinate of the second control point.
     * @param {number} y2 - Y coordinate of the second control point.
     * @param {number} x3 - X coordinate of the endpoint.
     * @param {number} y3 - Y coordinate of the endpoint.
     * @returns {void}
     * @private
     */
    _curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._updateBoundingBox(x1, y1);
        this._updateBoundingBox(x2, y2);
        this._updateBoundingBox(x3, y3);
        this._graphics._sw._writePoint(x1, -y1);
        this._graphics._sw._writePoint(x2, -y2);
        this._graphics._sw._writePoint(x3, -y3);
        this._graphics._sw._writeOperator('c');
    }
    /**
     * Computes and emits (or collects) a single Bézier arc segment spanning the given
     * angular range around the specified ellipse center. Optionally emits a moveTo for
     * the segment start when `isMoveTo` is true.
     *
     * @param {number} startAngle - Start angle of the arc in radians.
     * @param {number} endAngle - End angle of the arc in radians.
     * @param {number} centerX - X coordinate of the ellipse center.
     * @param {number} centerY - Y coordinate of the ellipse center.
     * @param {number} radiusX - Horizontal radius of the ellipse.
     * @param {number} radiusY - Vertical radius of the ellipse.
     * @param {Point[]} [pointList] - Optional point accumulator; when provided, points are pushed instead of emitted.
     * @param {boolean} [isMoveTo=false] - When true, emits or records a moveTo before the curve.
     * @returns {void}
     * @private
     */
    _calculateArcSegment(
        startAngle: number, endAngle: number, centerX: number, centerY: number, radiusX: number,
        radiusY: number, pointList?: Point[], isMoveTo: boolean = false): void {
        const cosA: number = Math.cos(startAngle);
        const sinA: number = Math.sin(startAngle);
        const cosB: number = Math.cos(endAngle);
        const sinB: number = Math.sin(endAngle);
        const denominator: number = Math.sin((endAngle - startAngle) / 2);
        if (denominator === 0) {
            if (isMoveTo) {
                const pointX: number = centerX + radiusX * cosA;
                const pointY: number = centerY + radiusY * sinA;
                if (pointList) {
                    pointList.push({x: pointX, y: pointY});
                } else {
                    this._moveTo(pointX, pointY);
                }
            }
            return;
        }
        const bezierControlPoint: number = 1.333333333 * (1 - Math.cos((endAngle - startAngle) / 2)) / denominator;
        const point1X: number = centerX + radiusX * (cosA - bezierControlPoint * sinA);
        const point1Y: number = centerY + radiusY * (sinA + bezierControlPoint * cosA);
        const point2X: number = centerX + radiusX * (cosB + bezierControlPoint * sinB);
        const point2Y: number = centerY + radiusY * (sinB - bezierControlPoint * cosB);
        const point3X: number = centerX + radiusX * cosB;
        const point3Y: number = centerY + radiusY * sinB;
        if (isMoveTo) {
            const pointX: number = centerX + radiusX * cosA;
            const pointY: number = centerY + radiusY * sinA;
            if (pointList) {
                pointList.push({x: pointX, y: pointY});
            } else {
                this._moveTo(pointX, pointY);
            }
        }
        if (pointList) {
            pointList.push({x: point1X, y: point1Y});
            pointList.push({x: point2X, y: point2Y});
            pointList.push({x: point3X, y: point3Y});
        } else {
            this._curveTo(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        }
    }
    /**
     * Draws or collects a full arc by splitting it into at most π/2 radian segments
     * and forwarding each to `_calculateArcSegment`. Handles angle normalization to
     * ensure the sweep is always positive.
     *
     * @param {number} startAngle - Start angle of the arc in radians.
     * @param {number} endAngle - End angle of the arc in radians.
     * @param {number} radiusX - Horizontal radius of the arc ellipse.
     * @param {number} radiusY - Vertical radius of the arc ellipse.
     * @param {number} centerX - X coordinate of the arc center.
     * @param {number} centerY - Y coordinate of the arc center.
     * @param {Point[]} [pointList] - Optional point accumulator; when provided, points are pushed instead of emitted.
     * @param {boolean} [isMoveTo=true] - When true, emits or records a moveTo at the arc start.
     * @returns {void}
     * @private
     */
    _calculateArc(
        startAngle: number,
        endAngle: number,
        radiusX: number,
        radiusY: number,
        centerX: number,
        centerY: number,
        pointList?: Point[],
        isMoveTo: boolean = true): void {
        const angleIncrement: number = Math.PI / 2;
        const startX: number = radiusX * Math.cos(startAngle) + centerX;
        const startY: number = radiusY * Math.sin(startAngle) + centerY;
        let pendingAngle: number = endAngle - startAngle;
        while (pendingAngle < 0) {
            pendingAngle += 2 * Math.PI;
        }
        const sweepAngle: number = pendingAngle;
        let completedAngle: number = 0;
        if (isMoveTo) {
            if (pointList) {
                pointList.push({x: startX, y: startY});
            } else {
                this._moveTo(startX, startY);
            }
        }
        while (pendingAngle > angleIncrement) {
            this._calculateArcSegment(startAngle + completedAngle, startAngle + completedAngle +
                angleIncrement, centerX, centerY, radiusX, radiusY, pointList);
            completedAngle += angleIncrement;
            pendingAngle -= angleIncrement;
        }
        if (pendingAngle > 0) {
            this._calculateArcSegment(startAngle + completedAngle, startAngle + sweepAngle,
                                      centerX, centerY, radiusX, radiusY, pointList);
        }
    }
    /**
     * Draws a full ellipse as the annotation appearance by delegating to `_calculateArc`
     * with a 0 to 2π sweep. Used as a fallback when cloud arcs cannot be placed.
     *
     * @param {number} left - Left edge of the ellipse bounding box.
     * @param {number} bottom - Bottom edge of the ellipse bounding box.
     * @param {number} right - Right edge of the ellipse bounding box.
     * @param {number} top - Top edge of the ellipse bounding box.
     * @returns {void}
     * @private
     */
    _drawEllipseAnnotation(left: number, bottom: number, right: number, top: number): void {
        const radiusX: number = Math.abs(right - left) / 2;
        const radiusY: number = Math.abs(top - bottom) / 2;
        const centerX: number = (left + right) / 2;
        const centerY: number = (bottom + top) / 2;
        this._calculateArc(0, 2 * Math.PI, radiusX, radiusY,
                           centerX, centerY, undefined, true);
    }
}
