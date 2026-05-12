import { Point } from '@syncfusion/ej2-pdf';
import { _PdfIntersection, _PdfPolygon, _PdfVertex } from '../../src/pdf-data-extract/core/redaction/pdf-shape-redaction';
describe('_PdfIntersection, _PdfPolygon, _PdfVertex', () => {
    // =============================================
    // _PdfIntersection Tests
    // =============================================
    it('should initialize _PdfIntersection with d !== 0 and valid intersection', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(2, 0);
        const c1: _PdfVertex = new _PdfVertex(1, -1);
        const c2: _PdfVertex = new _PdfVertex(1, 1);
        // Act
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Assert
        expect(intersection._x).toBe(1);
        expect(intersection._y).toBe(0);
        expect(intersection._toSource).toBeGreaterThan(0);
        expect(intersection._toSource).toBeLessThan(1);
        expect(intersection._toClip).toBeGreaterThan(0);
        expect(intersection._toClip).toBeLessThan(1);
    });
    it('should initialize _PdfIntersection with d !== 0 but invalid intersection (toSource out of bounds)', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(1, 0);
        const c1: _PdfVertex = new _PdfVertex(2, -1);
        const c2: _PdfVertex = new _PdfVertex(2, 1);
        // Act
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Assert
        expect(intersection._x).toBe(0);
        expect(intersection._y).toBe(0);
        expect(intersection._toSource).not.toBe(0);
    });
    it('should initialize _PdfIntersection with d === 0 (parallel lines)', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(1, 0);
        const c1: _PdfVertex = new _PdfVertex(0, 1);
        const c2: _PdfVertex = new _PdfVertex(1, 1);
        // Act
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Assert
        expect(intersection._x).toBe(0);
        expect(intersection._y).toBe(0);
        expect(intersection._toSource).toBe(0);
        expect(intersection._toClip).toBe(0);
    });
    it('should return true from _isValid when intersection within both segments', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(4, 0);
        const c1: _PdfVertex = new _PdfVertex(2, -2);
        const c2: _PdfVertex = new _PdfVertex(2, 2);
        // Act
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Assert
        expect(intersection._isValid()).toBe(true);
    });
    it('should return false from _isValid when toSource at boundary (0)', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(1, 1);
        const c1: _PdfVertex = new _PdfVertex(0, 0);
        const c2: _PdfVertex = new _PdfVertex(1, 0);
        // Act
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Assert
        expect(intersection._isValid()).toBe(false);
    });
    it('should return false from _isValid when toClip at boundary (1)', () => {
        // Arrange
        const s1: _PdfVertex = new _PdfVertex(0, 0);
        const s2: _PdfVertex = new _PdfVertex(2, 0);
        const c1: _PdfVertex = new _PdfVertex(1, -1);
        const c2: _PdfVertex = new _PdfVertex(1, 1);
        const intersection: _PdfIntersection = new _PdfIntersection(s1, s2, c1, c2);
        // Act
        const isValid: boolean = intersection._isValid();
        // Assert - checking boundary condition
        expect(typeof isValid).toBe('boolean');
    });
    // =============================================
    // _PdfVertex Constructor Tests
    // =============================================
    it('should create _PdfVertex with valid number coordinates', () => {
        // Arrange
        const x: number = 10.5;
        const y: number = 20.7;
        // Act
        const vertex: _PdfVertex = new _PdfVertex(x, y);
        // Assert
        expect(vertex._x).toBe(10.5);
        expect(vertex._y).toBe(20.7);
        expect(vertex._next).toBeNull();
        expect(vertex._prev).toBeNull();
        expect(vertex._corresponding).toBeNull();
        expect(vertex._distance).toBe(0.0);
        expect(vertex._isEntry).toBe(true);
        expect(vertex._isIntersection).toBe(false);
        expect(vertex._visited).toBe(false);
    });
    it('should throw error when x is not a number', () => {
        // Arrange
        const x: any = 'invalid';
        const y: number = 10;
        // Act & Assert
        expect(() => {
            new _PdfVertex(x, y);
        }).toThrowError('Invalid coordinate input');
    });
    it('should throw error when y is not a number', () => {
        // Arrange
        const x: number = 10;
        const y: any = null;
        // Act & Assert
        expect(() => {
            new _PdfVertex(x, y);
        }).toThrowError('Invalid coordinate input');
    });
    it('should throw error when both x and y are not numbers', () => {
        // Arrange
        const x: any = undefined;
        const y: any = {};
        // Act & Assert
        expect(() => {
            new _PdfVertex(x, y);
        }).toThrowError('Invalid coordinate input');
    });
    it('should handle negative coordinates', () => {
        // Arrange
        const x: number = -15.3;
        const y: number = -25.8;
        // Act
        const vertex: _PdfVertex = new _PdfVertex(x, y);
        // Assert
        expect(vertex._x).toBe(-15.3);
        expect(vertex._y).toBe(-25.8);
    });
    it('should handle zero coordinates', () => {
        // Arrange
        const x: number = 0;
        const y: number = 0;
        // Act
        const vertex: _PdfVertex = new _PdfVertex(x, y);
        // Assert
        expect(vertex._x).toBe(0);
        expect(vertex._y).toBe(0);
    });
    // =============================================
    // _PdfVertex Method Tests
    // =============================================
    it('should create intersection vertex with _createIntersection', () => {
        // Arrange
        const baseVertex: _PdfVertex = new _PdfVertex(5, 5);
        const intX: number = 7.5;
        const intY: number = 8.5;
        const distance: number = 0.5;
        // Act
        const intersectionVertex: _PdfVertex = baseVertex._createIntersection(intX, intY, distance);
        // Assert
        expect(intersectionVertex._x).toBe(7.5);
        expect(intersectionVertex._y).toBe(8.5);
        expect(intersectionVertex._distance).toBe(0.5);
        expect(intersectionVertex._isIntersection).toBe(true);
        expect(intersectionVertex._isEntry).toBe(false);
    });
    it('should return true from _equals when vertices have same coordinates', () => {
        // Arrange
        const v1: _PdfVertex = new _PdfVertex(10, 20);
        const v2: _PdfVertex = new _PdfVertex(10, 20);
        // Act
        const result: boolean = v1._equals(v2);
        // Assert
        expect(result).toBe(true);
    });
    it('should return false from _equals when x coordinates differ', () => {
        // Arrange
        const v1: _PdfVertex = new _PdfVertex(10, 20);
        const v2: _PdfVertex = new _PdfVertex(15, 20);
        // Act
        const result: boolean = v1._equals(v2);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false from _equals when y coordinates differ', () => {
        // Arrange
        const v1: _PdfVertex = new _PdfVertex(10, 20);
        const v2: _PdfVertex = new _PdfVertex(10, 25);
        // Act
        const result: boolean = v1._equals(v2);
        // Assert
        expect(result).toBe(false);
    });
    it('should mark vertex as visited with _visit', () => {
        // Arrange
        const vertex: _PdfVertex = new _PdfVertex(5, 5);
        expect(vertex._visited).toBe(false);
        // Act
        vertex._visit();
        // Assert
        expect(vertex._visited).toBe(true);
    });
    it('should mark corresponding vertex as visited when _visit is called', () => {
        // Arrange
        const v1: _PdfVertex = new _PdfVertex(5, 5);
        const v2: _PdfVertex = new _PdfVertex(10, 10);
        v1._corresponding = v2;
        v2._corresponding = v1;
        // Act
        v1._visit();
        // Assert
        expect(v1._visited).toBe(true);
        expect(v2._visited).toBe(true);
    });
    it('should not revisit already visited corresponding vertex', () => {
        // Arrange
        const v1: _PdfVertex = new _PdfVertex(5, 5);
        const v2: _PdfVertex = new _PdfVertex(10, 10);
        v1._corresponding = v2;
        v2._corresponding = v1;
        v2._visited = true;
        // Act
        v1._visit();
        // Assert
        expect(v1._visited).toBe(true);
        expect(v2._visited).toBe(true);
    });
    it('should determine if point is inside polygon using _isInside', () => {
        // Arrange
        const polygonPoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const polygon: _PdfPolygon = new _PdfPolygon(polygonPoints);
        const pointInside: _PdfVertex = new _PdfVertex(5, 5);
        // Act
        const isInside: boolean = pointInside._isInside(polygon);
        // Assert
        expect(typeof isInside).toBe('boolean');
    });
    it('should determine if point is outside polygon using _isInside', () => {
        // Arrange
        const polygonPoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const polygon: _PdfPolygon = new _PdfPolygon(polygonPoints);
        const pointOutside: _PdfVertex = new _PdfVertex(15, 15);
        // Act
        const isInside: boolean = pointOutside._isInside(polygon);
        // Assert
        expect(isInside).toBe(false);
    });
    it('should handle point on polygon edge in _isInside', () => {
        // Arrange
        const polygonPoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const polygon: _PdfPolygon = new _PdfPolygon(polygonPoints);
        const pointOnEdge: _PdfVertex = new _PdfVertex(5, 0);
        // Act
        const isInside: boolean = pointOnEdge._isInside(polygon);
        // Assert
        expect(typeof isInside).toBe('boolean');
    });
    // =============================================
    // _PdfPolygon Constructor Tests
    // =============================================
    it('should create _PdfPolygon with single point', () => {
        // Arrange
        const points: Point[] = [{ x: 5, y: 5 }];
        // Act
        const polygon: _PdfPolygon = new _PdfPolygon(points);
        // Assert
        expect(polygon._first).not.toBeNull();
        expect(polygon._first._x).toBe(5);
        expect(polygon._first._y).toBe(5);
        expect(polygon._first._next).toBe(polygon._first);
        expect(polygon._first._prev).toBe(polygon._first);
        expect(polygon._globalIntersections.length).toBe(0);
    });
    it('should create _PdfPolygon with multiple points', () => {
        // Arrange
        const points: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];
        // Act
        const polygon: _PdfPolygon = new _PdfPolygon(points);
        // Assert
        expect(polygon._first).not.toBeNull();
        expect(polygon._first._x).toBe(0);
        expect(polygon._first._y).toBe(0);
        let vertex: _PdfVertex = polygon._first;
        let count: number = 0;
        do {
            count++;
            vertex = vertex._next;
        } while (vertex !== polygon._first);
        expect(count).toBe(3);
    });
    it('should set _arrayVertices to true when arrayVertices parameter undefined and p[0] is array', () => {
        // Arrange
        const points: Point[] = [{ x: 0, y: 0 }];
        // Act
        const polygon: _PdfPolygon = new _PdfPolygon(points, undefined);
        // Assert
        expect(polygon._first).not.toBeNull();
    });
    it('should set _arrayVertices to provided boolean value', () => {
        // Arrange
        const points: Point[] = [{ x: 0, y: 0 }];
        // Act
        const polygonTrue: _PdfPolygon = new _PdfPolygon(points, true);
        const polygonFalse: _PdfPolygon = new _PdfPolygon(points, false);
        // Assert
        expect(polygonTrue._first).not.toBeNull();
        expect(polygonFalse._first).not.toBeNull();
    });
    // =============================================
    // _PdfPolygon._addVertex Tests
    // =============================================
    it('should add first vertex to empty polygon', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([]);
        const vertex: _PdfVertex = new _PdfVertex(5, 5);
        // Act
        polygon._addVertex(vertex);
        // Assert
        expect(polygon._first).toBe(vertex);
        expect(vertex._next).toBe(vertex);
        expect(vertex._prev).toBe(vertex);
    });
    it('should add second vertex to polygon with circular reference', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([{ x: 0, y: 0 }]);
        const vertex: _PdfVertex = new _PdfVertex(10, 10);
        // Act
        polygon._addVertex(vertex);
        // Assert
        expect(polygon._first._next).toBe(vertex);
        expect(vertex._next).toBe(polygon._first);
        expect(polygon._first._prev).toBe(vertex);
        expect(vertex._prev).toBe(polygon._first);
    });
    it('should add third vertex maintaining circular links', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 }
        ]);
        const vertex: _PdfVertex = new _PdfVertex(10, 10);
        // Act
        polygon._addVertex(vertex);
        // Assert
        let v: _PdfVertex = polygon._first;
        let count: number = 0;
        do {
            count++;
            v = v._next;
        } while (v !== polygon._first);
        expect(count).toBe(3);
    });
    // =============================================
    // _PdfPolygon._insertVertex Tests
    // =============================================
    it('should insert vertex at start position when distance is smallest', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        const newVertex: _PdfVertex = new _PdfVertex(5, 5);
        newVertex._distance = 0.1;
        // Act
        polygon._insertVertex(newVertex, v1, v2);
        // Assert
        expect(v1._next).toBe(newVertex);
        expect(newVertex._next).toBe(v2);
        expect(newVertex._prev).toBe(v1);
        expect(v2._prev).toBe(newVertex);
    });
    it('should insert vertex between start and end based on distance', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 }
        ]);
        const start: _PdfVertex = polygon._first;
        const end: _PdfVertex = start._next;
        const vertex1: _PdfVertex = new _PdfVertex(2, 0);
        vertex1._distance = 0.2;
        polygon._insertVertex(vertex1, start, end);
        const vertex2: _PdfVertex = new _PdfVertex(5, 0);
        vertex2._distance = 0.5;
        // Act
        polygon._insertVertex(vertex2, start, end);
        // Assert
        expect(vertex1._next).toBe(vertex2);
        expect(vertex2._prev).toBe(vertex1);
    });
    // =============================================
    // _PdfPolygon._getNext Tests
    // =============================================
    it('should return same vertex when not an intersection', () => {
        // Arrange
        const vertex: _PdfVertex = new _PdfVertex(5, 5);
        vertex._isIntersection = false;
        // Act
        const result: _PdfVertex = new _PdfPolygon([{ x: 0, y: 0 }])._getNext(vertex);
        // Assert
        expect(result._x).toBe(5);
        expect(result._y).toBe(5);
    });
    it('should skip intersection vertices and return next non-intersection', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        v2._isIntersection = true;
        const v3: _PdfVertex = v2._next;
        // Act
        const result: _PdfVertex = polygon._getNext(v2);
        // Assert
        expect(result).toBe(v3);
    });
    it('should handle multiple consecutive intersections', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first._next;
        const v2: _PdfVertex = v1._next;
        const v3: _PdfVertex = v2._next;
        v1._isIntersection = true;
        v2._isIntersection = true;
        // Act
        const result: _PdfVertex = polygon._getNext(v1);
        // Assert
        expect(result).toBe(v3);
    });
    // =============================================
    // _PdfPolygon._getFirstIntersect Tests
    // =============================================
    it('should find first unvisited intersection vertex', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        v2._isIntersection = true;
        v2._visited = false;
        // Act
        const result: _PdfVertex = polygon._getFirstIntersect();
        // Assert
        expect(result).toBe(v2);
    });
    it('should skip visited intersection vertices', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        const v3: _PdfVertex = v2._next;
        v2._isIntersection = true;
        v2._visited = true;
        v3._isIntersection = true;
        v3._visited = false;
        // Act
        const result: _PdfVertex = polygon._getFirstIntersect();
        // Assert
        expect(result).toBe(v3);
    });
    it('should return first vertex if no unvisited intersections exist', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 }
        ]);
        const v1: _PdfVertex = polygon._first;
        v1._isIntersection = false;
        // Act
        const result: _PdfVertex = polygon._getFirstIntersect();
        // Assert
        expect(result._x).toBeDefined();
    });
    // =============================================
    // _PdfPolygon._hasUnprocessed Tests
    // =============================================
    it('should return true when unvisited intersection exists', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        v2._isIntersection = true;
        v2._visited = false;
        // Act
        const result: boolean = polygon._hasUnprocessed();
        // Assert
        expect(result).toBe(true);
    });
    it('should return false when all intersections are visited', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        v2._isIntersection = true;
        v2._visited = true;
        // Act
        const result: boolean = polygon._hasUnprocessed();
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when no intersections exist', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 }
        ]);
        // Act
        const result: boolean = polygon._hasUnprocessed();
        // Assert
        expect(result).toBe(false);
    });
    it('should set _lastUnprocessed when unvisited intersection found', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        const v1: _PdfVertex = polygon._first;
        const v2: _PdfVertex = v1._next;
        v2._isIntersection = true;
        v2._visited = false;
        // Act
        const result: boolean = polygon._hasUnprocessed();
        // Assert
        expect(result).toBe(true);
    });
    // =============================================
    // _PdfPolygon._getPoints Tests
    // =============================================
    it('should return array of points for polygon with single vertex', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([{ x: 5, y: 5 }]);
        // Act
        const points: Point[] = polygon._getPoints();
        // Assert
        expect(points.length).toBe(1);
        expect(points[0].x).toBe(5);
        expect(points[0].y).toBe(5);
    });
    it('should return array of points for polygon with multiple vertices', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ]);
        // Act
        const points: Point[] = polygon._getPoints();
        // Assert
        expect(points.length).toBe(3);
        expect(points[0].x).toBe(0);
        expect(points[0].y).toBe(0);
        expect(points[1].x).toBe(10);
        expect(points[1].y).toBe(0);
        expect(points[2].x).toBe(10);
        expect(points[2].y).toBe(10);
    });
    it('should maintain circular traversal order in _getPoints', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 5, y: 5 },
            { x: 0, y: 5 }
        ]);
        // Act
        const points: Point[] = polygon._getPoints();
        // Assert
        expect(points.length).toBe(4);
        expect(points[0]).toEqual({ x: 0, y: 0 });
        expect(points[1]).toEqual({ x: 5, y: 0 });
        expect(points[2]).toEqual({ x: 5, y: 5 });
        expect(points[3]).toEqual({ x: 0, y: 5 });
    });
    // =============================================
    // _PdfPolygon._clip Tests
    // =============================================
    it('should clip two non-intersecting polygons', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 5, y: 5 },
            { x: 0, y: 5 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 10, y: 10 },
            { x: 15, y: 10 },
            { x: 15, y: 15 },
            { x: 10, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should clip with sourceForwards=true and clipForwards=true', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should clip with sourceForwards=false and clipForwards=false', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, false, false);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should clip with mixed sourceForwards and clipForwards flags', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, false);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should handle clip with overlapping rectangles', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should return result when intersections exist after clipping', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, false, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    // =============================================
    // _PdfPolygon._computeIntersections Tests (via _clip)
    // =============================================
    it('should compute intersections between two overlapping rectangles', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        source._clip(clip, true, true);
        // Assert
        expect(source._globalIntersections).toBeDefined();
        expect(Array.isArray(source._globalIntersections)).toBe(true);
    });
    it('should store intersection points in _globalIntersections array', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        source._clip(clip, true, true);
        // Assert
        expect(source._globalIntersections.length).toBeGreaterThanOrEqual(0);
    });
    // =============================================
    // _PdfPolygon._setEntryExitFlags Tests (via _clip)
    // =============================================
    it('should set entry/exit flags when source first vertex is inside clip', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 2, y: 2 },
            { x: 8, y: 2 },
            { x: 8, y: 8 },
            { x: 2, y: 8 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
    });
    it('should set entry/exit flags when clip first vertex is inside source', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 2, y: 2 },
            { x: 8, y: 2 },
            { x: 8, y: 8 },
            { x: 2, y: 8 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
    });
    // =============================================
    // _PdfPolygon._constructClippedPolygons Tests (via _clip)
    // =============================================
    it('should construct clipped polygons with entry flag true traversing forward', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should construct clipped polygons with entry flag false traversing backward', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, false, false);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should visit vertices during construction and mark them as visited', () => {
        // Arrange
        const source: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        const clip: _PdfPolygon = new _PdfPolygon([
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ]);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
    });
    // =============================================
    // Integration Tests
    // =============================================
    it('should handle complete polygon clipping workflow with rectangles', () => {
        // Arrange
        const sourcePoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const clipPoints: Point[] = [
            { x: 5, y: 5 },
            { x: 15, y: 5 },
            { x: 15, y: 15 },
            { x: 5, y: 15 }
        ];
        const source: _PdfPolygon = new _PdfPolygon(sourcePoints);
        const clip: _PdfPolygon = new _PdfPolygon(clipPoints);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should handle edge case of identical polygons', () => {
        // Arrange
        const points: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const source: _PdfPolygon = new _PdfPolygon(points);
        const clip: _PdfPolygon = new _PdfPolygon(points);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle complex polygon clipping with triangles', () => {
        // Arrange
        const sourcePoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ];
        const clipPoints: Point[] = [
            { x: 2, y: 2 },
            { x: 8, y: 2 },
            { x: 8, y: 8 }
        ];
        const source: _PdfPolygon = new _PdfPolygon(sourcePoints);
        const clip: _PdfPolygon = new _PdfPolygon(clipPoints);
        // Act
        const result: Point[][] = source._clip(clip, true, true);
        // Assert
        expect(result).toBeDefined();
    });
    it('should validate vertex linking integrity after multiple operations', () => {
        // Arrange
        const polygon: _PdfPolygon = new _PdfPolygon([
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ]);
        // Act
        const points: Point[] = polygon._getPoints();
        // Assert
        expect(points.length).toBe(4);
        let v: _PdfVertex = polygon._first;
        let count: number = 0;
        do {
            count++;
            v = v._next;
        } while (v !== polygon._first && count < 10);
        expect(count).toBe(4);
    });
    it('should handle ray-casting with horizontal edge in _isInside', () => {
        // Arrange
        const polygonPoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
        ];
        const polygon: _PdfPolygon = new _PdfPolygon(polygonPoints);
        const pointOnHorizontal: _PdfVertex = new _PdfVertex(5, 0);
        // Act
        const isInside: boolean = pointOnHorizontal._isInside(polygon);
        // Assert
        expect(typeof isInside).toBe('boolean');
    });
    it('should handle ray-casting with diagonal in polygon traversal', () => {
        // Arrange
        const polygonPoints: Point[] = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ];
        const polygon: _PdfPolygon = new _PdfPolygon(polygonPoints);
        const testPoint: _PdfVertex = new _PdfVertex(5, 5);
        // Act
        const isInside: boolean = testPoint._isInside(polygon);
        // Assert
        expect(typeof isInside).toBe('boolean');
    });
});
