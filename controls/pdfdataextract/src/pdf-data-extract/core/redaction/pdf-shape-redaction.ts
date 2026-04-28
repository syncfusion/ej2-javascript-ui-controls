import { Point } from '@syncfusion/ej2-pdf';

export class _PdfIntersection {
    _x: number;
    _y: number;
    _toSource: number;
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
    _isValid(): boolean {
        return (
            0 < this._toSource &&
            this._toSource < 1 &&
            0 < this._toClip &&
            this._toClip < 1
        );
    }
}
export class _PdfPolygon {
    _first: _PdfVertex;
    private _vertices: number;
    private _lastUnprocessed: _PdfVertex;
    private _firstIntersect: _PdfVertex;
    private _arrayVertices: boolean;
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
    _getNext(v: _PdfVertex): _PdfVertex {
        let c: _PdfVertex = v;
        while (c._isIntersection) {
            c = c._next;
        }
        return c;
    }
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
    _getPoints(): Point[] {
        const points: Point[] = [];
        let v: _PdfVertex = this._first;
        do {
            points.push({ x: v._x, y: v._y });
            v = v._next;
        } while (v !== this._first);
        return points;
    }
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
export class _PdfVertex {
    _x: number;
    _y: number;
    _next: _PdfVertex;
    _prev: _PdfVertex;
    _corresponding: _PdfVertex;
    _distance: number;
    _isEntry: boolean;
    _isIntersection: boolean;
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
    _createIntersection(x: number, y: number, distance: number): _PdfVertex {
        const vertex: _PdfVertex = new _PdfVertex(x, y);
        vertex._distance = distance;
        vertex._isIntersection = true;
        vertex._isEntry = false;
        return vertex;
    }
    _visit(): void {
        this._visited = true;
        if (this._corresponding !== null && !this._corresponding._visited) {
            this._corresponding._visit();
        }
    }
    _equals(v: _PdfVertex): boolean {
        return this._x === v._x && this._y === v._y;
    }
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
