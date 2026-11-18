import { Point } from '@syncfusion/ej2-pdf';

/**
 * Represents an intersection point between two polygon edges with parametric positions.
 *
 * @private
 */
export class _PdfIntersection {
    /**
     * Intersection X coordinate.
     *
     * @private
     */
    _x: number;
    /**
     * Intersection Y coordinate.
     *
     * @private
     */
    _y: number;
    /**
     * Parametric position along the source edge.
     *
     * @private
     */
    _toSource: number;
    /**
     * Parametric position along the clip edge.
     *
     * @private
     */
    _toClip: number;
    constructor(s1: _PdfVertex, s2: _PdfVertex, c1: _PdfVertex, c2: _PdfVertex) {
        this._x = 0.0;
        this._y = 0.0;
        this._toSource = 0.0;
        this._toClip = 0.0;
        const d: number =
            (c2._y - c1._y) * (s2._x - s1._x) - (c2._x - c1._x) * (s2._y - s1._y);
        if (d !== 0) {
            this._toSource =
            ((c2._x - c1._x) * (s1._y - c1._y) - (c2._y - c1._y) * (s1._x - c1._x)) / d;
            this._toClip =
                ((s2._x - s1._x) * (s1._y - c1._y) - (s2._y - s1._y) * (s1._x - c1._x)) / d;
            if (this._isValid()) {
                this._x = s1._x + this._toSource * (s2._x - s1._x);
                this._y = s1._y + this._toSource * (s2._y - s1._y);
            }
        }
    }
    /**
     * Returns whether the intersection lies strictly within both segments (0..1).
     *
     * @private
     * @returns {boolean} `true` if valid; otherwise, `false`.
     */
    _isValid(): boolean {
        return (
            0 < this._toSource &&
            this._toSource < 1 &&
            0 < this._toClip &&
            this._toClip < 1
        );
    }
}
/**
 * Polygon helper for clipping paths against redaction rectangles.
 *
 * @private
 */
export class _PdfPolygon {
    /**
     * First vertex in the closed linked list of vertices.
     *
     * @private
     */
    _first: _PdfVertex;
    private _vertices: number;
    private _lastUnprocessed: _PdfVertex;
    private _firstIntersect: _PdfVertex;
    private _arrayVertices: boolean;
    /**
     * Global intersections found while clipping.
     *
     * @private
     */
    _globalIntersections: Point[] = [];
    constructor(p: Point[], arrayVertices?: boolean) {
        this._first = null;
        this._vertices = 0;
        this._lastUnprocessed = null;
        this._arrayVertices =
            typeof arrayVertices === 'undefined' ? Array.isArray(p[0]) : arrayVertices;
        p.forEach((point: Point) => {
            this._addVertex(new _PdfVertex(point.x, point.y));
        });
    }
    /**
     * Appends a vertex to the polygon's circular list.
     *
     * @private
     * @param {_PdfVertex} vertex Vertex to add.
     * @returns {void} nothing.
     */
    _addVertex(vertex: _PdfVertex): void {
        if (this._first === null) {
            this._first = vertex;
            this._first._next = vertex;
            this._first._prev = vertex;
        } else {
            const next: _PdfVertex = this._first;
            const prev: _PdfVertex = next._prev;
            next._prev = vertex;
            vertex._next = next;
            vertex._prev = prev;
            if (prev) {
                prev._next = vertex;
            }
        }
        this._vertices++;
    }
    /**
     * Inserts an intersection vertex in order between two vertices.
     *
     * @private
     * @param {_PdfVertex} vertex Intersection vertex.
     * @param {_PdfVertex} start Start vertex of the edge.
     * @param {_PdfVertex} end End vertex of the edge.
     * @returns {void} nothing.
     */
    _insertVertex(vertex: _PdfVertex, start: _PdfVertex, end: _PdfVertex): void {
        let curr: _PdfVertex = start;
        while (!curr._equals(end) && curr._distance < vertex._distance) {
            curr = curr._next;
        }
        vertex._next = curr;
        const prev: _PdfVertex = curr._prev;
        vertex._prev = prev;
        if (prev) {
            prev._next = vertex;
        }
        curr._prev = vertex;
        this._vertices++;
    }
    /**
     * Returns the next non-intersection vertex from the given vertex.
     *
     * @private
     * @param {_PdfVertex} v Starting vertex.
     * @returns {_PdfVertex} The next source vertex.
     */
    _getNext(v: _PdfVertex): _PdfVertex {
        let c: _PdfVertex = v;
        while (c._isIntersection) {
            c = c._next;
        }
        return c;
    }
    /**
     * Finds the first unvisited intersection vertex to start a clipped polygon trace.
     *
     * @private
     * @returns {_PdfVertex} The first unvisited intersection vertex.
     */
    _getFirstIntersect(): _PdfVertex {
        let v: _PdfVertex = this._firstIntersect || this._first;
        do {
            if (v._isIntersection && !v._visited) {
                break;
            }
            v = v._next;
        } while (!v._equals(this._first));
        this._firstIntersect = v;
        return v;
    }
    /**
     * Determines whether there is at least one unvisited intersection vertex.
     *
     * @private
     * @returns {boolean} `true` if work remains; otherwise, `false`.
     */
    _hasUnprocessed(): boolean {
        let v: _PdfVertex = this._lastUnprocessed || this._first;
        do {
            if (v._isIntersection && !v._visited) {
                this._lastUnprocessed = v;
                return true;
            }
            v = v._next;
        } while (!v._equals(this._first));
        this._lastUnprocessed = null;
        return false;
    }
    /**
     * Returns the polygon's vertices as a point array.
     *
     * @private
     * @returns {Point[]} Polygon point list.
     */
    _getPoints(): Point[] {
        const points: Point[] = [];
        let v: _PdfVertex = this._first;
        do {
            points.push({ x: v._x, y: v._y });
            v = v._next;
        } while (v !== this._first);
        return points;
    }
    /**
     * Clips this polygon by `clip` polygon and returns resulting paths.
     *
     * @private
     * @param {_PdfPolygon} clip The clipping polygon.
     * @param {boolean} sourceForwards Initial source traversal direction flag.
     * @param {boolean} clipForwards Initial clip traversal direction flag.
     * @returns {Point} Resulting polygon rings.
     */
    _clip(clip: _PdfPolygon, sourceForwards: boolean, clipForwards: boolean): Point[][] {
        this._computeIntersections(clip);
        ({ sourceForwards, clipForwards } = this._setEntryExitFlags(clip, sourceForwards, clipForwards));
        const result: Point[][] = this._constructClippedPolygons();
        return result.length > 0 ? result : this._handleEmptyResult(clip);
    }
    private _computeIntersections(clip: _PdfPolygon): void {
        let sourceVertex: _PdfVertex = this._first;
        do {
            if (!sourceVertex._isIntersection) {
                let clipVertex: _PdfVertex = clip._first;
                do {
                    if (!clipVertex._isIntersection) {
                        const intersection: _PdfIntersection = new _PdfIntersection(
                            sourceVertex, this._getNext(sourceVertex._next),
                            clipVertex, clip._getNext(clipVertex._next)
                        );
                        if (intersection._isValid()) {
                            const sourceIntersection: _PdfVertex = sourceVertex._createIntersection(intersection._x,
                                                                                                    intersection._y,
                                                                                                    intersection._toSource);
                            const clipIntersection: _PdfVertex = clipVertex._createIntersection(intersection._x,
                                                                                                intersection._y,
                                                                                                intersection._toClip);
                            this._globalIntersections.push({ x: sourceIntersection._x, y: sourceIntersection._y });
                            sourceIntersection._corresponding = clipIntersection;
                            clipIntersection._corresponding = sourceIntersection;
                            this._insertVertex(sourceIntersection, sourceVertex, this._getNext(sourceVertex._next));
                            clip._insertVertex(clipIntersection, clipVertex, clip._getNext(clipVertex._next));
                        }
                    }
                    clipVertex = clipVertex._next;
                } while (!clipVertex._equals(clip._first));
            }
            sourceVertex = sourceVertex._next;
        } while (!sourceVertex._equals(this._first));
    }
    private _setEntryExitFlags(clip: _PdfPolygon, sourceForwards: boolean, clipForwards: boolean):
    { sourceForwards: boolean, clipForwards: boolean } {
        const sourceInClip: boolean = this._first._isInside(clip);
        const clipInSource: boolean = clip._first._isInside(this);
        sourceForwards = sourceForwards !== sourceInClip;
        clipForwards = clipForwards !== clipInSource;
        let sourceVertex: _PdfVertex = this._first;
        do {
            if (sourceVertex._isIntersection) {
                sourceVertex._isEntry = sourceForwards;
                sourceForwards = !sourceForwards;
            }
            sourceVertex = sourceVertex._next;
        } while (!sourceVertex._equals(this._first));
        let clipVertex: _PdfVertex = clip._first;
        do {
            if (clipVertex._isIntersection) {
                clipVertex._isEntry = clipForwards;
                clipForwards = !clipForwards;
            }
            clipVertex = clipVertex._next;
        } while (!clipVertex._equals(clip._first));
        return { sourceForwards, clipForwards };
    }
    private _constructClippedPolygons(): Point[][] {
        const list: Point[][] = [];
        while (this._hasUnprocessed()) {
            let current: _PdfVertex = this._getFirstIntersect();
            const clipped: _PdfPolygon = new _PdfPolygon([], this._arrayVertices);
            clipped._addVertex(new _PdfVertex(current._x, current._y));
            do {
                current._visit();
                if (current._isEntry) {
                    do {
                        current = current._next;
                        clipped._addVertex(new _PdfVertex(current._x, current._y));
                    } while (!current._isIntersection);
                } else {
                    do {
                        current = current._prev;
                        clipped._addVertex(new _PdfVertex(current._x, current._y));
                    } while (!current._isIntersection);
                }
                current = current._corresponding;
            } while (!current._visited);
            list.push(clipped._getPoints());
        }
        return list;
    }
    private _handleEmptyResult(clip: _PdfPolygon): Point[][] {
        const sourceInClip: boolean = this._first._isInside(clip);
        const clipInSource: boolean = clip._first._isInside(this);
        if (sourceInClip) {
            return [clip._getPoints(), this._getPoints()];
        } else if (clipInSource) {
            return [this._getPoints(), clip._getPoints()];
        } else {
            return [this._getPoints()];
        }
    }
}
/**
 * Vertex used by the polygon clipping algorithm with linked-list topology.
 *
 * @private
 */
export class _PdfVertex {
    /**
     * X coordinate.
     *
     * @private
     */
    _x: number;
    /**
     * Y coordinate.
     *
     * @private
     */
    _y: number;
    /**
     * Next vertex in the circular list.
     *
     * @private
     */
    _next: _PdfVertex;
    /**
     * Previous vertex in the circular list.
     *
     * @private
     */
    _prev: _PdfVertex;
    /**
     * Corresponding intersection vertex on the opposite polygon.
     *
     * @private
     */
    _corresponding: _PdfVertex;
    /**
     * Parametric distance along the edge for intersections.
     *
     * @private
     */
    _distance: number;
    /**
     * Indicates whether this intersection is an entry point.
     *
     * @private
     */
    _isEntry: boolean;
    /**
     * Indicates whether this vertex is an intersection.
     *
     * @private
     */
    _isIntersection: boolean;
    /**
     * Indicates whether this intersection vertex was visited.
     *
     * @private
     */
    _visited: boolean;
    constructor(x: number, y: number) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new Error('Invalid coordinate input');
        }
        const xCoord: number = x;
        const yCoord: number = y;
        this._x = xCoord;
        this._y = yCoord;
        this._next = null;
        this._prev = null;
        this._corresponding = null;
        this._distance = 0.0;
        this._isEntry = true;
        this._isIntersection = false;
        this._visited = false;
    }
    /**
     * Creates and returns an intersection vertex derived from this vertex edge.
     *
     * @private
     * @param {number} x Intersection X.
     * @param {number} y Intersection Y.
     * @param {number} distance Parametric distance along the edge.
     * @returns {_PdfVertex} The created intersection vertex.
     */
    _createIntersection(x: number, y: number, distance: number): _PdfVertex {
        const vertex: _PdfVertex = new _PdfVertex(x, y);
        vertex._distance = distance;
        vertex._isIntersection = true;
        vertex._isEntry = false;
        return vertex;
    }
    /**
     * Marks this vertex as visited, and propagates to the corresponding vertex.
     *
     * @private
     * @returns {void} nothing.
     */
    _visit(): void {
        this._visited = true;
        if (this._corresponding !== null && !this._corresponding._visited) {
            this._corresponding._visit();
        }
    }
    /**
     * Compares equality with another vertex .
     *
     * @private
     * @param {_PdfVertex} v Other vertex.
     * @returns {boolean} `true` if both coordinates match; otherwise, `false`.
     */
    _equals(v: _PdfVertex): boolean {
        return this._x === v._x && this._y === v._y;
    }
    /**
     * Determines whether this vertex lies inside the given polygon.
     *
     * @private
     * @param {_PdfPolygon} poly Polygon to test against.
     * @returns {boolean} `true` if inside; otherwise, `false`.
     */
    _isInside(poly: _PdfPolygon): boolean {
        let oddNodes: boolean = false;
        let vertex: _PdfVertex = poly._first;
        let next: _PdfVertex = vertex._next;
        const x: number = this._x;
        const y: number = this._y;
        do {
            if (
                ((vertex._y < y && next._y >= y) ||
                (next._y < y && vertex._y >= y)) &&
                (vertex._x <= x || next._x <= x)
            ) {
                oddNodes = (oddNodes !== (vertex._x + ((y - vertex._y) / (next._y - vertex._y)) * (next._x - vertex._x) < x));
            }
            vertex = vertex._next;
            next = vertex._next || poly._first;
        } while (!vertex._equals(poly._first));
        return oddNodes;
    }
}
