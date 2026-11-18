import { _PdfContentStream, _PdfRecord, PdfPage, Point, Rectangle } from '@syncfusion/ej2-pdf';
import { _PdfPolygon } from './pdf-shape-redaction';
import { _TextProcessingMode } from '../enum';
import { _PdfBezierSegment, _PdfLineSegment, _PdfPathFigure } from './pdf-path-segment';
import { PdfRedactor } from './pdf-redactor';
import { PdfRedactionRegion } from './pdf-redaction-region';

/**
 * Parses path drawing operators and rewrites shapes that intersect redaction regions.
 *
 * @private
 */
export class _PdfShapeParser {
    private _currentLocation: number[];
    private _pathAccumulator: _PdfPathCommand[] = [];
    private _clearPathAccumulator(): void {
        this._pathAccumulator = [];
    }
    /**
     * Finds and emits path records for a redacted shape starting from index `i`.
     *
     * @private
     * @param {_PdfRecord[]} recordCollection The full record collection of the content stream.
     * @param {number} i The starting record index to scan from.
     * @param {PdfPage} page The page hosting the content.
     * @param {PdfRedactor} redaction The redactor owning state and helpers.
     * @param {_TextProcessingMode} mode Active processing mode.
     * @param {_PdfContentStream} stream Destination stream to receive rewritten commands.
     * @returns {number} The last processed record index or `-1` if nothing was emitted.
     */
    _findRedactPath(
        recordCollection: _PdfRecord[],
        i: number,
        page: PdfPage,
        redaction: PdfRedactor,
        mode: _TextProcessingMode,
        stream: _PdfContentStream
    ): number {
        let startCount: number = 1;
        let _currentPath: _PdfPathFigure;
        let bezierSegment: _PdfBezierSegment;
        for (let k: number = i; k < recordCollection.length; k++) {
            const record: _PdfRecord = recordCollection[<number>k];
            const value: string = record._operator.trim();
            const element: string[] = record._operands;
            if (
                value === _PdfPathCommands.drawStroke || value === _PdfPathCommands.drawCloseStroke ||
                value === _PdfPathCommands.fill || value === _PdfPathCommands.fillEvenOdd ||
                value === _PdfPathCommands.fillStroke || value === _PdfPathCommands.fillEvenOddStroke ||
                value === _PdfPathCommands.fillCloseStroke || value === _PdfPathCommands.fillEvenOddCloseStroke
            ) {
                if (mode !== _TextProcessingMode.redaction) {
                    this._clearPathAccumulator();
                    return -1;
                }
                let shapePaths: _PdfPathCommand[] = this._getGeometry(_currentPath);
                shapePaths = this._flattenIfNeeded(shapePaths);
                const fullPath: { commands: _PdfPathCommand[],
                    renderingMode: _PdfPathCommands } = { commands: shapePaths, renderingMode: value };
                const shapePoints: Point[][] = [this._extractPoints(fullPath.commands)];
                const _redaction: PdfRedactionRegion[] = redaction._redactionRegion;
                const {
                    updatedShapePoints,
                    intersectionsPoints,
                    isInSide,
                    isOutSide,
                    inSideRects,
                    totalRedactionPoints
                } = this._clipAgainstRedactions(shapePoints, _redaction, page);
                if (this._shouldSkipRendering(updatedShapePoints, fullPath.commands, isInSide)) {
                    this._clearPathAccumulator();
                    return -1;
                }
                const records: _PdfRecord[] = this._buildRenderingRecords(value,
                                                                          updatedShapePoints,
                                                                          intersectionsPoints,
                                                                          isInSide,
                                                                          isOutSide,
                                                                          inSideRects,
                                                                          totalRedactionPoints);
                if (records && records.length > 0 && !isOutSide) {
                    for (let j: number = 0; j < records.length; j++) {
                        redaction._optimizeContent(records, j, '', stream);
                    }
                }
                this._clearPathAccumulator();
                return k - 1;
            }
            switch (value) {
            case _PdfPathCommands.moveTo:
                startCount++;
                if (startCount === 2) {
                    _currentPath = new _PdfPathFigure();
                    _currentPath._startPoint = { x: Number(element[0]), y: Number(element[1]) };
                    this._currentLocation = [Number(element[0]), Number(element[1])];
                }
                break;
            case _PdfPathCommands.lineTo:
                if (startCount === 2) {
                    _currentPath._segments.push(new _PdfLineSegment({ x: Number(element[0]), y: Number(element[1]) }));
                }
                break;
            case _PdfPathCommands.curveTo:
                if (startCount === 2) {
                    bezierSegment = new _PdfBezierSegment();
                    bezierSegment._point1 = { x: Number(element[0]), y: Number(element[1]) };
                    bezierSegment._point2 = { x: Number(element[2]), y: Number(element[3]) };
                    bezierSegment._point3 = { x: Number(element[4]), y: Number(element[5]) };
                    _currentPath._segments.push(bezierSegment);
                }
                break;
            case _PdfPathCommands.curveToV:
                if (startCount === 2) {
                    bezierSegment = new _PdfBezierSegment();
                    bezierSegment._point1 = { x: this._currentLocation[0], y: this._currentLocation[1] };
                    bezierSegment._point2 = { x: Number(element[0]), y: Number(element[1]) };
                    bezierSegment._point3 = { x: Number(element[2]), y: Number(element[3]) };
                    _currentPath._segments.push(bezierSegment);
                }
                break;
            case _PdfPathCommands.curveToY:
                if (startCount === 2) {
                    bezierSegment = new _PdfBezierSegment();
                    bezierSegment._point1 = { x: Number(element[0]), y: Number(element[1]) };
                    bezierSegment._point2 = { x: Number(element[2]), y: Number(element[3]) };
                    bezierSegment._point3 = bezierSegment._point2;
                    _currentPath._segments.push(bezierSegment);
                }
                break;
            case _PdfPathCommands.closePath:
                if (_currentPath) {
                    _currentPath._isClosed = true;
                }
                break;
            default:
                return -1;
            }
        }
        return -1;
    }
    /**
     * Flattens curve segments to line segments when needed.
     *
     * @private
     * @param {_PdfPathCommand[]} shapePaths Path commands to inspect.
     * @returns {_PdfPathCommand[]} Flattened path commands if curves were present; otherwise unchanged.
     */
    private _flattenIfNeeded(shapePaths: _PdfPathCommand[]): _PdfPathCommand[] {
        for (let p: number = 0; p < shapePaths.length; p++) {
            if (shapePaths[<number>p].operator.indexOf('c') !== -1) {
                shapePaths = this._flattenPdfPathCommands(shapePaths);
                break;
            }
        }
        return shapePaths;
    }
    /* eslint-disable */
    /**
     * Clips the given shape point rings against all non-text redaction regions on the page.
     *
     * @private
     * @param {Point[][]} shapePoints Input shape rings.
     * @param {PdfRedactionRegion[]} redactions Redaction regions for the page.
     * @param {PdfPage} page Page providing size/transform hints.
     * @returns {{updatedShapePoints: Point[][], intersectionsPoints: Point[], isInSide: boolean, isOutSide: boolean, inSideRects: _PdfPathCommand[][], totalRedactionPoints: Point[][]}}
     * Clipped shape rings and classification context.
     */
    private _clipAgainstRedactions(shapePoints: Point[][], redactions: PdfRedactionRegion[], page: PdfPage): {
        updatedShapePoints: Point[][],
        intersectionsPoints: Point[],
        isInSide: boolean,
        isOutSide: boolean,
        inSideRects: _PdfPathCommand[][],
        totalRedactionPoints: Point[][]
    } {
        const intersectionsPoints: Point[] = [];
        const inSideRects: _PdfPathCommand[][] = [];
        const totalRedactionPoints: Point[][] = [];
        let isInSide: boolean = false;
        let isOutSide: boolean = false;
        for (const redaction of redactions) {
            if (redaction._isTextOnly) {
                continue;
            }
            const bounds: Rectangle = this._adjustRedactionBounds(redaction._bounds, shapePoints[0][0].y, page);
            const redactionPath: _PdfPathCommand[] = this._rectToPathCommands(bounds);
            const redactionPoints: Point[] = this._extractPoints(redactionPath);
            totalRedactionPoints.push(redactionPoints);
            const newNonRedactedPoints: Point[][] = [];
            for (const shape of shapePoints) {
                const source: _PdfPolygon = new _PdfPolygon(shape);
                const clipPoly: _PdfPolygon = new _PdfPolygon(redactionPoints);
                const clipped: Point[][] = source._clip(clipPoly, false, true);
                intersectionsPoints.push(...source._globalIntersections);
                newNonRedactedPoints.push(...clipped);
            }
            if (newNonRedactedPoints.length === 2) {
                if (this._pointsArraysEqual(newNonRedactedPoints[1], redactionPoints)) {
                    isInSide = true;
                    newNonRedactedPoints.splice(1, 1);
                    inSideRects.push(redactionPath);
                } else if (this._pointsArraysEqual(newNonRedactedPoints[0], redactionPoints)) {
                    isOutSide = true;
                    newNonRedactedPoints.splice(1, 1);
                }
            }
            shapePoints = newNonRedactedPoints;
        }
        return { updatedShapePoints: shapePoints, intersectionsPoints, isInSide, isOutSide, inSideRects, totalRedactionPoints };
    }
    /* eslint-enable */
    /**
     * Adjusts redaction bounds to the shape coordinate space.
     *
     * @private
     * @param {Rectangle} bounds Redaction bounds (page space).
     * @param {number} y Sample Y from current shape ring.
     * @param {PdfPage} page The page used for Y inversion.
     * @returns {Rectangle} Adjusted rectangle.
     */
    private _adjustRedactionBounds(bounds: Rectangle, y: number, page: PdfPage): Rectangle {
        const adjusted: Rectangle = { ...bounds };
        if (y < 0) {
            adjusted.y = -adjusted.y;
            adjusted.height = -adjusted.height;
        } else {
            adjusted.y = page.size.height - adjusted.y - adjusted.height;
        }
        return adjusted;
    }
    /**
     * Determines whether rendering should be skipped for a shape that remains unchanged and not inside a redaction.
     *
     * @private
     * @param {Point} shapePoints The possibly modified shape points.
     * @param {_PdfPathCommand} originalPoints The original path commands.
     * @param {boolean} isInSide Whether shape is fully inside a redaction region.
     * @returns {boolean} `true` to skip rendering; otherwise, `false`.
     */
    private _shouldSkipRendering(shapePoints: Point[][], originalPoints: _PdfPathCommand[], isInSide: boolean): boolean {
        return shapePoints.length === 0 ||
            shapePoints.length === 1 &&
            this._pointsArraysEqual(this._extractPoints(originalPoints), shapePoints[0]) &&
            !isInSide;
    }
    /**
     * Builds drawing records `_PdfRecord[]` from clipped shape rings for the operator.
     *
     * @private
     * @param {string} value The drawing operator (`S`, `s`, `f`, `f*`, `B`, etc).
     * @param {Point} shapePoints The shape rings to emit.
     * @param {Point} intersectionsPoints Intersections collected during clip.
     * @param {boolean} isInSide If shape was fully inside a redaction.
     * @param {boolean} isOutSide If shape was fully outside a redaction.
     * @param {_PdfPathCommand | undefined} inSideRects Paths for inside rectangles (when applicable).
     * @param {Point} totalRedactionPoints Accumulated redaction polygon points.
     * @returns {_PdfRecord} Records to write to the content stream.
     */
    private _buildRenderingRecords(
        value: string,
        shapePoints: Point[][],
        intersectionsPoints: Point[],
        isInSide: boolean,
        isOutSide: boolean,
        inSideRects: _PdfPathCommand[][] | undefined,
        totalRedactionPoints: Point[][]
    ): _PdfRecord[] {
        const records: _PdfRecord[] = [];
        if (value === _PdfPathCommands.drawStroke || value === _PdfPathCommands.drawCloseStroke) {
            if (!isOutSide) {
                shapePoints = this._removeRedactionPoints(this._removeDuplicatePoints(shapePoints), totalRedactionPoints);
                records.push(...this._buildRecords(this._convertPointsToPath(shapePoints, intersectionsPoints)));
                if (value === _PdfPathCommands.drawCloseStroke) {
                    records.push(new _PdfRecord('S', []));
                }
            }
        } else if (value === _PdfPathCommands.fill || value === _PdfPathCommands.fillEvenOdd) {
            records.push(...this._buildRecords(this._convertPointsToPath(shapePoints)));
            if (isInSide && inSideRects) {
                for (const rect of inSideRects) {
                    records.push(new _PdfRecord('h', []));
                    records.push(new _PdfRecord('f', []), new _PdfRecord('rg', ['1.000', '1.000', '1.000']));
                    records.push(...this._buildRecords(rect));
                }
            }
        } else {
            records.push(...this._buildRecords(this._convertPointsToPath(shapePoints)));
            if (!isOutSide) {
                if (isInSide) {
                    records.push(new _PdfRecord('h', []));
                }
                records.push(new _PdfRecord('f', []));
                shapePoints = this._removeRedactionPoints(this._removeDuplicatePoints(shapePoints), totalRedactionPoints);
                records.push(...this._buildRecords(this._convertPointsToPath(shapePoints, intersectionsPoints)));
                if (isInSide) {
                    records.push(new _PdfRecord('h', []));
                }
                records.push(new _PdfRecord('S', []));
            }
            if (isInSide && inSideRects) {
                for (const inSide of inSideRects) {
                    records.push(new _PdfRecord('f', []), new _PdfRecord('rg', ['1.000', '1.000', '1.000']));
                    records.push(...this._buildRecords(inSide), new _PdfRecord('f', []));
                }
            }
        }
        return records;
    }
    /**
     * Converts a parsed `_PdfPathFigure` into the flat path command list.
     *
     * @private
     * @param {_PdfPathFigure} figure The path figure with segments.
     * @returns {_PdfPathCommand[]} Accumulated path commands.
     */
    private _getGeometry(figure: _PdfPathFigure): _PdfPathCommand[] {
        this._pathAccumulator = [];
        const point: Point = { x: figure._startPoint.x, y: figure._startPoint.y };
        this._pathAccumulator.push({ operator: 'm', points: [ point ] });
        for (const segment of figure._segments) {
            if (segment instanceof _PdfLineSegment) {
                const line: _PdfLineSegment = segment as _PdfLineSegment;
                const points: Point = { x: line._point.x, y: line._point.y };
                this._pathAccumulator.push({ operator: 'l', points: [ points ] });
            } else if (segment instanceof _PdfBezierSegment) {
                const bezier: _PdfBezierSegment = segment as _PdfBezierSegment;
                const points: Point[] = [
                    { x: bezier._point1.x, y: bezier._point1.y },
                    { x: bezier._point2.x, y: bezier._point2.y },
                    { x: bezier._point3.x, y: bezier._point3.y }
                ];
                this._pathAccumulator.push({ operator: 'c', points: points });
            }
        }
        if (figure._isClosed) {
            this._pathAccumulator.push({ operator: 'h', points: [] });
        }
        return this._pathAccumulator;
    }
    /**
     * Validates that a rect operator is followed by drawable operators (not `n`).
     *
     * @private
     * @param {_PdfRecord[]} recordCollection Record list.
     * @param {number} i Index of the `re` equivalent sequence.
     * @returns {boolean} `true` if the rectangle is valid to emit; otherwise, `false`.
     */
    private _isValidRectangle(recordCollection: _PdfRecord[], i: number): boolean {
        for (const offset of [1, 2, 3]) {
            const item: _PdfRecord = recordCollection[i + offset];
            if (item && item._operator === 'n') {
                return false;
            }
        }
        return true;
    }
    /**
     * Emits path commands for a rectangle sequence, if valid.
     *
     * @private
     * @param {_PdfRecord[]} recordCollection Record list.
     * @param {number} i Index of the rectangle start.
     * @param {string[]} element Rectangle operands `[x, y, w, h]` as strings.
     * @returns {_PdfRecord[]} The generated path records; empty if not valid.
     */
    _processRectangle(recordCollection: _PdfRecord[], i: number, element: string[]): _PdfRecord[] {
        if (this._isValidRectangle(recordCollection, i)) {
            return this._generateRectanglePath(recordCollection, i, element);
        }
        return [];
    }
    /**
     * Converts rectangle operands into a sequence of move/line/close commands.
     *
     * @private
     * @param {_PdfRecord[]} recordCollection Record list (for lookahead).
     * @param {number} i Index at which the rect started.
     * @param {string[]} element Rectangle operands `[x, y, w, h]` as strings.
     * @returns {_PdfRecord[]} The path commands representing the rectangle.
     */
    private _generateRectanglePath(recordCollection: _PdfRecord[], i: number, element: string[]): _PdfRecord[] {
        const records: _PdfRecord[] = [];
        const rect: Rectangle = {
            x: parseFloat(element[0]),
            y: parseFloat(element[1]),
            width: parseFloat(element[2]),
            height: parseFloat(element[3])
        };
        const pathCommands: _PdfPathCommand[] = this._rectToPathCommands(rect);
        for (const cmd of pathCommands) {
            if (cmd.operator === 'h' && recordCollection[i + 1]._operator !== 'h') {
                records.push(new _PdfRecord('h', []));
            } else {
                for (const pt of cmd.points) {
                    const operands: string[] = [pt.x.toFixed(3), pt.y.toFixed(3)];
                    records.push(new _PdfRecord(cmd.operator, operands));
                }
            }
        }
        return records;
    }
    /**
     * Builds a rectangular path as a list of path commands.
     *
     * @private
     * @param {Rectangle} rect The rectangle specification.
     * @returns {_PdfPathCommand[]} Path commands for the rectangle.
     */
    private _rectToPathCommands(rect: Rectangle): _PdfPathCommand[] {
        return [
            {
                operator: 'm',
                points: [{ x: rect.x + rect.width, y: rect.y + rect.height }]
            },
            {
                operator: 'l',
                points: [{ x: rect.x, y: rect.y + rect.height }]
            },
            {
                operator: 'l',
                points: [{ x: rect.x, y: rect.y }]
            },
            {
                operator: 'l',
                points: [{ x: rect.x + rect.width, y: rect.y }]
            },
            {
                operator: 'h',
                points: []
            }
        ];
    }
    /**
     * Extracts a flat list of points from a sequence of path commands.
     *
     * @private
     * @param {_PdfPathCommand[]} commands Command list.
     * @returns {Point[]} Flattened points.
     */
    private _extractPoints(commands: _PdfPathCommand[]): Point[] {
        const points: Point[] = [];
        for (const cmd of commands) {
            points.push(...cmd.points);
        }
        return points;
    }
    /**
     * Returns whether a point matches any intersection point, exactly.
     *
     * @private
     * @param {Point} pt The point to check.
     * @param {Point[]} [polygonIntersections] Known intersection list.
     * @returns {boolean} `true` if the point is an intersection; otherwise, `false`.
     */
    private _isIntersecting(pt: Point, polygonIntersections?: Point[]): boolean {
        if (!polygonIntersections) {
            return false;
        }
        for (let i: number = 0; i < polygonIntersections.length; i++) {
            if (polygonIntersections[<number>i].x === pt.x && polygonIntersections[<number>i].y === pt.y) {
                return true;
            }
        }
        return false;
    }
    /**
     * Converts a set of point-rings to move/line path commands, optionally splitting at intersections.
     *
     * @private
     * @param {Point} input Rings to convert.
     * @param {Point} [polygonIntersections] Intersection points along the rings.
     * @returns {_PdfPathCommand[]} Path commands representing the rings.
     */
    private _convertPointsToPath(input: Point[][], polygonIntersections?: Point[]): _PdfPathCommand[] {
        const commands: _PdfPathCommand[] = [];
        const hasIntersections: boolean = polygonIntersections && polygonIntersections.length > 0;
        for (const points of input) {
            if (points.length === 0) {
                continue;
            }
            commands.push({ operator: 'm', points: [points[0]] });
            for (let i: number = 1; i < points.length; i++) {
                const prevPoint: Point = points[i - 1];
                const currentPoint: Point = points[<number>i];
                if (hasIntersections) {
                    const prevIsIntersect: boolean = this._isIntersecting(prevPoint, polygonIntersections);
                    const currIsIntersect: boolean = this._isIntersecting(currentPoint, polygonIntersections);
                    if (prevIsIntersect && currIsIntersect) {
                        commands.push({ operator: 'm', points: [currentPoint] });
                    } else {
                        commands.push({ operator: 'l', points: [currentPoint] });
                    }
                } else {
                    commands.push({ operator: 'l', points: [currentPoint] });
                }
            }
        }
        return commands;
    }
    /**
     * Flattens a cubic Bézier curve to a list of `segments` line points.
     *
     * @private
     * @param {Point} p0 Start point.
     * @param {Point} p1 First control point.
     * @param {Point} p2 Second control point.
     * @param {Point} p3 End point.
     * @param {number} [segments=8] Number of line segments to generate.
     * @returns {Point[]} The interpolated points on the curve.
     */
    private _flattenBezierCurve(p0: Point, p1: Point, p2: Point, p3: Point, segments: number = 8): Point[] {
        const points: Point[] = [];
        for (let i: number = 1; i <= segments; i++) {
            const t: number = i / segments;
            const mt: number = 1 - t;
            const x: number = mt * mt * mt * p0.x +
                    3 * mt * mt * t * p1.x +
                    3 * mt * t * t * p2.x +
                    t * t * t * p3.x;
            const y: number = mt * mt * mt * p0.y +
                    3 * mt * mt * t * p1.y +
                    3 * mt * t * t * p2.y +
                    t * t * t * p3.y;
            points.push({ x, y });
        }
        return points;
    }
    /**
     * Flattens all cubic curve  commands in a path into straight line segments.
     *
     * @private
     * @param {_PdfPathCommand[]} commands Path commands (with `m/l/c/h`).
     * @param {number} [segmentsPerCurve=8] Line segments per curve.
     * @returns {_PdfPathCommand[]} The flattened command list.
     */
    private _flattenPdfPathCommands(commands: _PdfPathCommand[], segmentsPerCurve: number = 8): _PdfPathCommand[] {
        const flattened: _PdfPathCommand[] = [];
        let currentPoint: Point;
        for (const cmd of commands) {
            if (cmd.operator === 'm') {
                flattened.push(cmd);
                currentPoint = cmd.points[0];
            } else if (cmd.operator === 'l') {
                flattened.push(cmd);
                currentPoint = cmd.points[0];
            } else if (cmd.operator === 'c') {
                if (!currentPoint) {
                    throw new Error('Invalid path: curve without current point');
                }
                const [cp1, cp2, endPoint] = cmd.points;
                const flattenedPoints: Point[] = this._flattenBezierCurve(currentPoint, cp1, cp2, endPoint, segmentsPerCurve);
                for (const pt of flattenedPoints) {
                    flattened.push({
                        operator: 'l',
                        points: [pt]
                    });
                }
                currentPoint = endPoint;
            } else if (cmd.operator === 'h') {
                flattened.push(cmd);
            }
        }
        return flattened;
    }
    /**
     * Deep-equality test for two point arrays.
     *
     * @private
     * @param {Point[]} a Left array.
     * @param {Point[]} b Right array.
     * @returns {boolean} `true` if the arrays are same length and equal point-wise.
     */
    private _pointsArraysEqual(a: Point[], b: Point[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((point: Point, i: any) => point.x === b[<number>i].x && //eslint-disable-line
            point.y === b[<number>i].y);
    }
    /**
     * Removes duplicate points within each ring while preserving the first occurrence.
     *
     * @private
     * @param {Point} pointsArrays Rings to process.
     * @returns {Point} Rings without duplicates.
     */
    private _removeDuplicatePoints(pointsArrays: Point[][]): Point[][] {
        return pointsArrays.map((points: Point[]) => {
            const uniquePoints: Set<string> = new Set<string>();
            return points.filter((pt: Point) => {
                const key: string = `${pt.x},${pt.y}`;
                if (uniquePoints.has(key)) {
                    return false;
                } else {
                    uniquePoints.add(key);
                    return true;
                }
            });
        });
    }
    /**
     * Removes points that belong to redaction rectangles to avoid retracing them.
     *
     * @private
     * @param {Point} nonRedactedPointsArray Rings to filter.
     * @param {Point} redactionPointsArray Redaction polygon rings.
     * @returns {Point} Filtered rings without redaction points.
     */
    private _removeRedactionPoints(
        nonRedactedPointsArray: Point[][],
        redactionPointsArray: Point[][]
    ): Point[][] {
        const redactionPoints: Set<string> = new Set<string>();
        for (const redactionArray of redactionPointsArray) {
            for (const pt of redactionArray) {
                redactionPoints.add(`${pt.x},${pt.y}`);
            }
        }
        const filteredPointsArray: Point[][] = nonRedactedPointsArray.map((points: Point[]) =>
            points.filter((pt: Point) => !redactionPoints.has(`${pt.x},${pt.y}`))
        );
        return filteredPointsArray;
    }
    /**
     * Builds `_PdfRecord[]` from a list of path commands.
     *
     * @private
     * @param {_PdfPathCommand[]} commands Path commands to convert.
     * @returns {_PdfRecord[]} Content stream records.
     */
    private _buildRecords(commands: _PdfPathCommand[]): _PdfRecord[] {
        const result: _PdfRecord[] = [];
        for (let a: number = 0; a < commands.length; a++) {
            const cmd: _PdfPathCommand = commands[<number>a];
            for (let b: number = 0; b < cmd.points.length; b++) {
                const pt: Point = cmd.points[<number>b];
                result.push(new _PdfRecord(cmd.operator, [pt.x.toFixed(3), pt.y.toFixed(3)]));
            }
        }
        return result;
    }
}
/**
 * A lightweight path command representation used by `_PdfShapeParser`.
 *
 * @private
 */
export type _PdfPathCommand = {
    operator: string;
    points: Point[];
};
/**
 * Internal PDF drawing operators used for path construction and rendering.
 *
 * @private
 */
enum _PdfPathCommands {
    drawStroke = 'S',
    drawCloseStroke = 's',
    fill = 'f',
    fillEvenOdd = 'f*',
    fillStroke = 'B',
    fillEvenOddStroke = 'B*',
    fillCloseStroke = 'b',
    fillEvenOddCloseStroke = 'b*',
    moveTo = 'm',
    lineTo = 'l',
    curveTo = 'c',
    curveToV = 'v',
    curveToY = 'y',
    closePath = 'h',
}
