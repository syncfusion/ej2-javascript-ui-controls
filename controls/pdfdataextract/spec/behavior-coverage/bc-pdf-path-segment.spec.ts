import { Point } from '@syncfusion/ej2-pdf';
import { _PdfPathFigure, _PdfPathSegment, _PdfLineSegment, _PdfBezierSegment } from '../../src/pdf-data-extract/core/redaction/pdf-path-segment';
describe('_PdfPathFigure._clone', () => {
    it('should initialize all properties in constructor with default values', () => {
        // Arrange
        const expectedSegmentsLength: number = 0;
        const expectedIsClosed: boolean = false;
        const expectedIsFilled: boolean = false;
        const expectedStartPoint: Point = { x: 0, y: 0 };
        // Act
        const pathFigure: _PdfPathFigure = new _PdfPathFigure();
        // Assert
        expect(pathFigure._segments).toBeDefined();
        expect(pathFigure._segments.length).toBe(expectedSegmentsLength);
        expect(pathFigure._isClosed).toBe(expectedIsClosed);
        expect(pathFigure._isFilled).toBe(expectedIsFilled);
        expect(pathFigure._startPoint).toBeDefined();
        expect(pathFigure._startPoint.x).toBe(expectedStartPoint.x);
        expect(pathFigure._startPoint.y).toBe(expectedStartPoint.y);
        expect(Array.isArray(pathFigure._segments)).toBe(true);
    });
    it('should clone path figure with empty segments array', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isClosed = false;
        original._isFilled = false;
        original._startPoint = { x: 0, y: 0 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned).not.toBe(original);
        expect(cloned._segments).toBeDefined();
        expect(cloned._segments.length).toBe(0);
        expect(cloned._isClosed).toBe(original._isClosed);
        expect(cloned._isFilled).toBe(original._isFilled);
        expect(cloned._startPoint).toEqual(original._startPoint);
        expect(cloned._startPoint).not.toBe(original._startPoint);
        expect(cloned._segments).not.toBe(original._segments);
    });
    it('should clone path figure with single line segment', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const lineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 10, y: 20 });
        original._segments.push(lineSegment);
        original._isClosed = true;
        original._isFilled = true;
        original._startPoint = { x: 5, y: 15 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(1);
        expect(cloned._segments[0]).toBeDefined();
        expect(cloned._segments[0]).not.toBe(original._segments[0]);
        expect(cloned._isClosed).toBe(true);
        expect(cloned._isFilled).toBe(true);
        expect(cloned._startPoint.x).toBe(5);
        expect(cloned._startPoint.y).toBe(15);
        expect(cloned._startPoint).not.toBe(original._startPoint);
    });
    it('should clone path figure with single bezier segment', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 }
        );
        original._segments.push(bezierSegment);
        original._isClosed = false;
        original._isFilled = true;
        original._startPoint = { x: 100, y: 200 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(1);
        expect(cloned._segments[0]).toBeDefined();
        expect(cloned._segments[0]).not.toBe(bezierSegment);
        expect(cloned._isClosed).toBe(false);
        expect(cloned._isFilled).toBe(true);
        expect(cloned._startPoint.x).toBe(100);
        expect(cloned._startPoint.y).toBe(200);
    });
    it('should clone path figure with multiple mixed segments', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const lineSegment1: _PdfLineSegment = new _PdfLineSegment({ x: 10, y: 20 });
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 30, y: 40 },
            { x: 50, y: 60 },
            { x: 70, y: 80 }
        );
        const lineSegment2: _PdfLineSegment = new _PdfLineSegment({ x: 90, y: 100 });
        original._segments.push(lineSegment1);
        original._segments.push(bezierSegment);
        original._segments.push(lineSegment2);
        original._isClosed = true;
        original._isFilled = true;
        original._startPoint = { x: 0, y: 0 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(3);
        expect(cloned._segments[0]).not.toBe(lineSegment1);
        expect(cloned._segments[1]).not.toBe(bezierSegment);
        expect(cloned._segments[2]).not.toBe(lineSegment2);
        expect(cloned._isClosed).toBe(true);
        expect(cloned._isFilled).toBe(true);
        expect(cloned._startPoint.x).toBe(0);
        expect(cloned._startPoint.y).toBe(0);
        expect(cloned._segments).not.toBe(original._segments);
    });
    it('should preserve isClosed property as true after clone', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isClosed = true;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._isClosed).toBe(true);
        expect(cloned._isClosed).toBe(original._isClosed);
    });
    it('should preserve isFilled property as true after clone', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isFilled = true;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._isFilled).toBe(true);
        expect(cloned._isFilled).toBe(original._isFilled);
    });
    it('should create independent clone with separate start point reference', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._startPoint = { x: 42, y: 84 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        cloned._startPoint.x = 100;
        cloned._startPoint.y = 200;
        // Assert
        expect(cloned._startPoint.x).toBe(100);
        expect(cloned._startPoint.y).toBe(200);
        expect(original._startPoint.x).toBe(42);
        expect(original._startPoint.y).toBe(84);
    });
    it('should create independent clone with separate segments array reference', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const lineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 5, y: 10 });
        original._segments.push(lineSegment);
        // Act
        const cloned: _PdfPathFigure = original._clone();
        const newLineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 15, y: 25 });
        cloned._segments.push(newLineSegment);
        // Assert
        expect(cloned._segments.length).toBe(2);
        expect(original._segments.length).toBe(1);
        expect(cloned._segments).not.toBe(original._segments);
    });
    it('should deep clone each segment in the array', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const segment1: _PdfLineSegment = new _PdfLineSegment({ x: 1, y: 1 });
        const segment2: _PdfLineSegment = new _PdfLineSegment({ x: 2, y: 2 });
        original._segments.push(segment1);
        original._segments.push(segment2);
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments[0]).not.toBe(segment1);
        expect(cloned._segments[1]).not.toBe(segment2);
        expect(cloned._segments[0] instanceof _PdfLineSegment).toBe(true);
        expect(cloned._segments[1] instanceof _PdfLineSegment).toBe(true);
    });
    it('should handle path figure with negative coordinate values in startPoint', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._startPoint = { x: -50, y: -100 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._startPoint.x).toBe(-50);
        expect(cloned._startPoint.y).toBe(-100);
        expect(cloned._startPoint).not.toBe(original._startPoint);
    });
    it('should handle path figure with decimal coordinate values in startPoint', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._startPoint = { x: 10.5, y: 20.75 };
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._startPoint.x).toBe(10.5);
        expect(cloned._startPoint.y).toBe(20.75);
        expect(cloned._startPoint).not.toBe(original._startPoint);
    });
});
describe('_PdfLineSegment', () => {
    it('should initialize with default point in constructor', () => {
        // Arrange
        const expectedPoint: Point = { x: 0, y: 0 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment();
        // Assert
        expect(lineSegment._point).toBeDefined();
        expect(lineSegment._point.x).toBe(expectedPoint.x);
        expect(lineSegment._point.y).toBe(expectedPoint.y);
    });
    it('should initialize with custom point in constructor', () => {
        // Arrange
        const customPoint: Point = { x: 25, y: 50 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(customPoint);
        // Assert
        expect(lineSegment._point).toBeDefined();
        expect(lineSegment._point.x).toBe(25);
        expect(lineSegment._point.y).toBe(50);
    });
    it('should clone line segment with default point', () => {
        // Arrange
        const original: _PdfLineSegment = new _PdfLineSegment();
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned).not.toBe(original);
        expect(cloned instanceof _PdfLineSegment).toBe(true);
        expect((cloned as _PdfLineSegment)._point.x).toBe(0);
        expect((cloned as _PdfLineSegment)._point.y).toBe(0);
    });
    it('should clone line segment with custom point', () => {
        // Arrange
        const customPoint: Point = { x: 15, y: 35 };
        const original: _PdfLineSegment = new _PdfLineSegment(customPoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned).not.toBe(original);
        expect((cloned as _PdfLineSegment)._point.x).toBe(15);
        expect((cloned as _PdfLineSegment)._point.y).toBe(35);
        expect((cloned as _PdfLineSegment)._point).not.toBe(original._point);
    });
    it('should create independent clone with separate point reference', () => {
        // Arrange
        const customPoint: Point = { x: 10, y: 20 };
        const original: _PdfLineSegment = new _PdfLineSegment(customPoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        (cloned as _PdfLineSegment)._point.x = 100;
        (cloned as _PdfLineSegment)._point.y = 200;
        // Assert
        expect((cloned as _PdfLineSegment)._point.x).toBe(100);
        expect((cloned as _PdfLineSegment)._point.y).toBe(200);
        expect(original._point.x).toBe(10);
        expect(original._point.y).toBe(20);
    });
    it('should clone line segment with negative coordinates', () => {
        // Arrange
        const negativePoint: Point = { x: -30, y: -60 };
        const original: _PdfLineSegment = new _PdfLineSegment(negativePoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfLineSegment)._point.x).toBe(-30);
        expect((cloned as _PdfLineSegment)._point.y).toBe(-60);
        expect((cloned as _PdfLineSegment)._point).not.toBe(original._point);
    });
    it('should clone line segment with decimal coordinates', () => {
        // Arrange
        const decimalPoint: Point = { x: 10.25, y: 20.75 };
        const original: _PdfLineSegment = new _PdfLineSegment(decimalPoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfLineSegment)._point.x).toBe(10.25);
        expect((cloned as _PdfLineSegment)._point.y).toBe(20.75);
        expect((cloned as _PdfLineSegment)._point).not.toBe(original._point);
    });
    it('should clone line segment with zero coordinates', () => {
        // Arrange
        const zeroPoint: Point = { x: 0, y: 0 };
        const original: _PdfLineSegment = new _PdfLineSegment(zeroPoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfLineSegment)._point.x).toBe(0);
        expect((cloned as _PdfLineSegment)._point.y).toBe(0);
        expect((cloned as _PdfLineSegment)._point).not.toBe(original._point);
    });
    it('should clone line segment with large coordinate values', () => {
        // Arrange
        const largePoint: Point = { x: 999999, y: 888888 };
        const original: _PdfLineSegment = new _PdfLineSegment(largePoint);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfLineSegment)._point.x).toBe(999999);
        expect((cloned as _PdfLineSegment)._point.y).toBe(888888);
        expect((cloned as _PdfLineSegment)._point).not.toBe(original._point);
    });
    it('should extend _PdfPathSegment abstract class', () => {
        // Arrange
        const lineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 5, y: 10 });
        // Act & Assert
        expect(lineSegment instanceof _PdfPathSegment).toBe(true);
        expect(typeof lineSegment._clone).toBe('function');
    });
});
describe('_PdfBezierSegment', () => {
    it('should initialize with default points in constructor', () => {
        // Arrange
        const expectedPoint: Point = { x: 0, y: 0 };
        // Act
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment();
        // Assert
        expect(bezierSegment._point1).toBeDefined();
        expect(bezierSegment._point1.x).toBe(expectedPoint.x);
        expect(bezierSegment._point1.y).toBe(expectedPoint.y);
        expect(bezierSegment._point2).toBeDefined();
        expect(bezierSegment._point2.x).toBe(expectedPoint.x);
        expect(bezierSegment._point2.y).toBe(expectedPoint.y);
        expect(bezierSegment._point3).toBeDefined();
        expect(bezierSegment._point3.x).toBe(expectedPoint.x);
        expect(bezierSegment._point3.y).toBe(expectedPoint.y);
    });
    it('should initialize with custom points in constructor', () => {
        // Arrange
        const point1: Point = { x: 10, y: 20 };
        const point2: Point = { x: 30, y: 40 };
        const point3: Point = { x: 50, y: 60 };
        // Act
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Assert
        expect(bezierSegment._point1.x).toBe(10);
        expect(bezierSegment._point1.y).toBe(20);
        expect(bezierSegment._point2.x).toBe(30);
        expect(bezierSegment._point2.y).toBe(40);
        expect(bezierSegment._point3.x).toBe(50);
        expect(bezierSegment._point3.y).toBe(60);
    });
    it('should clone bezier segment with default points', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment();
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned).not.toBe(original);
        expect(cloned instanceof _PdfBezierSegment).toBe(true);
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(0);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(0);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(0);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(0);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(0);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(0);
    });
    it('should clone bezier segment with custom points', () => {
        // Arrange
        const point1: Point = { x: 5, y: 10 };
        const point2: Point = { x: 15, y: 25 };
        const point3: Point = { x: 35, y: 45 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(5);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(10);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(15);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(25);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(35);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(45);
    });
    it('should create independent clone with separate point1 reference', () => {
        // Arrange
        const point1: Point = { x: 10, y: 20 };
        const point2: Point = { x: 30, y: 40 };
        const point3: Point = { x: 50, y: 60 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        (cloned as _PdfBezierSegment)._point1.x = 100;
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(100);
        expect(original._point1.x).toBe(10);
        expect((cloned as _PdfBezierSegment)._point1).not.toBe(original._point1);
    });
    it('should create independent clone with separate point2 reference', () => {
        // Arrange
        const point1: Point = { x: 10, y: 20 };
        const point2: Point = { x: 30, y: 40 };
        const point3: Point = { x: 50, y: 60 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        (cloned as _PdfBezierSegment)._point2.y = 200;
        // Assert
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(200);
        expect(original._point2.y).toBe(40);
        expect((cloned as _PdfBezierSegment)._point2).not.toBe(original._point2);
    });
    it('should create independent clone with separate point3 reference', () => {
        // Arrange
        const point1: Point = { x: 10, y: 20 };
        const point2: Point = { x: 30, y: 40 };
        const point3: Point = { x: 50, y: 60 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        (cloned as _PdfBezierSegment)._point3.x = 999;
        (cloned as _PdfBezierSegment)._point3.y = 888;
        // Assert
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(999);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(888);
        expect(original._point3.x).toBe(50);
        expect(original._point3.y).toBe(60);
        expect((cloned as _PdfBezierSegment)._point3).not.toBe(original._point3);
    });
    it('should clone bezier segment with negative coordinates in all points', () => {
        // Arrange
        const point1: Point = { x: -10, y: -20 };
        const point2: Point = { x: -30, y: -40 };
        const point3: Point = { x: -50, y: -60 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(-10);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(-20);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(-30);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(-40);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(-50);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(-60);
    });
    it('should clone bezier segment with decimal coordinates in all points', () => {
        // Arrange
        const point1: Point = { x: 10.5, y: 20.75 };
        const point2: Point = { x: 30.25, y: 40.5 };
        const point3: Point = { x: 50.125, y: 60.875 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(10.5);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(20.75);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(30.25);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(40.5);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(50.125);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(60.875);
    });
    it('should clone bezier segment with mixed coordinate values', () => {
        // Arrange
        const point1: Point = { x: 10, y: -20.5 };
        const point2: Point = { x: 0, y: 40 };
        const point3: Point = { x: -30.75, y: 0 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(10);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(-20.5);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(0);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(40);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(-30.75);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(0);
    });
    it('should clone bezier segment with large coordinate values', () => {
        // Arrange
        const point1: Point = { x: 999999, y: 888888 };
        const point2: Point = { x: 777777, y: 666666 };
        const point3: Point = { x: 555555, y: 444444 };
        const original: _PdfBezierSegment = new _PdfBezierSegment(point1, point2, point3);
        // Act
        const cloned: _PdfPathSegment = original._clone();
        // Assert
        expect((cloned as _PdfBezierSegment)._point1.x).toBe(999999);
        expect((cloned as _PdfBezierSegment)._point1.y).toBe(888888);
        expect((cloned as _PdfBezierSegment)._point2.x).toBe(777777);
        expect((cloned as _PdfBezierSegment)._point2.y).toBe(666666);
        expect((cloned as _PdfBezierSegment)._point3.x).toBe(555555);
        expect((cloned as _PdfBezierSegment)._point3.y).toBe(444444);
    });
    it('should extend _PdfPathSegment abstract class', () => {
        // Arrange
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 }
        );
        // Act & Assert
        expect(bezierSegment instanceof _PdfPathSegment).toBe(true);
        expect(typeof bezierSegment._clone).toBe('function');
    });
    it('should initialize with mixed default and custom points', () => {
        // Arrange
        const point1: Point = { x: 5, y: 10 };
        // Act
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(point1);
        // Assert
        expect(bezierSegment._point1.x).toBe(5);
        expect(bezierSegment._point1.y).toBe(10);
        expect(bezierSegment._point2.x).toBe(0);
        expect(bezierSegment._point2.y).toBe(0);
        expect(bezierSegment._point3.x).toBe(0);
        expect(bezierSegment._point3.y).toBe(0);
    });
    it('should initialize with two custom and one default point', () => {
        // Arrange
        const point1: Point = { x: 5, y: 10 };
        const point2: Point = { x: 15, y: 25 };
        // Act
        const bezierSegment: _PdfBezierSegment = new _PdfBezierSegment(point1, point2);
        // Assert
        expect(bezierSegment._point1.x).toBe(5);
        expect(bezierSegment._point1.y).toBe(10);
        expect(bezierSegment._point2.x).toBe(15);
        expect(bezierSegment._point2.y).toBe(25);
        expect(bezierSegment._point3.x).toBe(0);
        expect(bezierSegment._point3.y).toBe(0);
    });
});
describe('Lines 40-55: _PdfPathFigure._clone method', () => {
    it('should clone path figure with empty segments array (0 iterations)', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isClosed = true;
        original._isFilled = false;
        original._startPoint = { x: 10, y: 20 };
        const expectedSegmentsLength: number = 0;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned).not.toBe(original);
        expect(cloned._segments).toBeDefined();
        expect(cloned._segments.length).toBe(expectedSegmentsLength);
        expect(cloned._isClosed).toBe(true);
        expect(cloned._isFilled).toBe(false);
        expect(cloned._startPoint.x).toBe(10);
        expect(cloned._startPoint.y).toBe(20);
        expect(cloned._startPoint).not.toBe(original._startPoint);
    });
    it('should clone path figure with single segment (1 iteration)', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const segment: _PdfLineSegment = new _PdfLineSegment({ x: 5, y: 15 });
        original._segments.push(segment);
        original._isClosed = false;
        original._isFilled = true;
        original._startPoint = { x: 25, y: 35 };
        const expectedSegmentsLength: number = 1;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(expectedSegmentsLength);
        expect(cloned._segments[0]).toBeDefined();
        expect(cloned._segments[0]).not.toBe(segment);
        expect(cloned._isClosed).toBe(false);
        expect(cloned._isFilled).toBe(true);
        expect(cloned._startPoint.x).toBe(25);
        expect(cloned._startPoint.y).toBe(35);
        expect(cloned._segments).not.toBe(original._segments);
    });
    it('should clone path figure with multiple segments (multiple iterations)', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const segment1: _PdfLineSegment = new _PdfLineSegment({ x: 1, y: 2 });
        const segment2: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 3, y: 4 },
            { x: 5, y: 6 },
            { x: 7, y: 8 }
        );
        const segment3: _PdfLineSegment = new _PdfLineSegment({ x: 9, y: 10 });
        original._segments.push(segment1);
        original._segments.push(segment2);
        original._segments.push(segment3);
        original._isClosed = true;
        original._isFilled = true;
        original._startPoint = { x: 100, y: 200 };
        const expectedSegmentsLength: number = 3;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(expectedSegmentsLength);
        expect(cloned._segments[0]).not.toBe(segment1);
        expect(cloned._segments[1]).not.toBe(segment2);
        expect(cloned._segments[2]).not.toBe(segment3);
        expect(cloned._isClosed).toBe(true);
        expect(cloned._isFilled).toBe(true);
        expect(cloned._startPoint.x).toBe(100);
        expect(cloned._startPoint.y).toBe(200);
    });
    it('should copy isClosed property correctly in clone', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isClosed = true;
        const expectedValue: boolean = true;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._isClosed).toBe(expectedValue);
        expect(cloned._isClosed).toBe(original._isClosed);
    });
    it('should copy isFilled property correctly in clone', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._isFilled = true;
        const expectedValue: boolean = true;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._isFilled).toBe(expectedValue);
        expect(cloned._isFilled).toBe(original._isFilled);
    });
    it('should create independent startPoint copy with object spread', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        original._startPoint = { x: 50, y: 75 };
        const originalX: number = original._startPoint.x;
        const originalY: number = original._startPoint.y;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        cloned._startPoint.x = 999;
        cloned._startPoint.y = 888;
        // Assert
        expect(cloned._startPoint.x).toBe(999);
        expect(cloned._startPoint.y).toBe(888);
        expect(original._startPoint.x).toBe(originalX);
        expect(original._startPoint.y).toBe(originalY);
        expect(cloned._startPoint).not.toBe(original._startPoint);
    });
    it('should return new _PdfPathFigure instance from clone', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned instanceof _PdfPathFigure).toBe(true);
        expect(typeof cloned._clone).toBe('function');
    });
    it('should push cloned segments into new segments array during loop', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const lineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 11, y: 22 });
        original._segments.push(lineSegment);
        const initialLength: number = original._segments.length;
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments.length).toBe(initialLength);
        expect(cloned._segments.length).toBe(1);
        expect(Array.isArray(cloned._segments)).toBe(true);
    });
    it('should call _clone on each segment during loop iteration', () => {
        // Arrange
        const original: _PdfPathFigure = new _PdfPathFigure();
        const segment1: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 }
        );
        const segment2: _PdfLineSegment = new _PdfLineSegment({ x: 4, y: 5 });
        original._segments.push(segment1);
        original._segments.push(segment2);
        // Act
        const cloned: _PdfPathFigure = original._clone();
        // Assert
        expect(cloned._segments[0] instanceof _PdfBezierSegment).toBe(true);
        expect(cloned._segments[1] instanceof _PdfLineSegment).toBe(true);
        expect(cloned._segments[0]).not.toBe(segment1);
        expect(cloned._segments[1]).not.toBe(segment2);
    });
});
describe('Lines 86-95: _PdfLineSegment constructor', () => {
    it('should initialize _point property with default point parameter', () => {
        // Arrange
        const expectedX: number = 0;
        const expectedY: number = 0;
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment();
        // Assert
        expect(lineSegment._point).toBeDefined();
        expect(lineSegment._point.x).toBe(expectedX);
        expect(lineSegment._point.y).toBe(expectedY);
        expect(typeof lineSegment._point).toBe('object');
    });
    it('should initialize _point property with custom point parameter', () => {
        // Arrange
        const customPoint: Point = { x: 42, y: 84 };
        const expectedX: number = 42;
        const expectedY: number = 84;
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(customPoint);
        // Assert
        expect(lineSegment._point).toBeDefined();
        expect(lineSegment._point.x).toBe(expectedX);
        expect(lineSegment._point.y).toBe(expectedY);
        expect(lineSegment._point).toBe(customPoint);
    });
    it('should call super() to invoke parent constructor', () => {
        // Arrange
        const customPoint: Point = { x: 15, y: 30 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(customPoint);
        // Assert
        expect(lineSegment instanceof _PdfLineSegment).toBe(true);
        expect(typeof lineSegment._clone).toBe('function');
    });
    it('should assign custom point directly to _point property', () => {
        // Arrange
        const testPoint: Point = { x: 100, y: 200 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(testPoint);
        // Assert
        expect(lineSegment._point.x).toBe(100);
        expect(lineSegment._point.y).toBe(200);
        expect(lineSegment._point).toBe(testPoint);
    });
    it('should handle negative coordinates in constructor parameter', () => {
        // Arrange
        const negativePoint: Point = { x: -50, y: -100 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(negativePoint);
        // Assert
        expect(lineSegment._point.x).toBe(-50);
        expect(lineSegment._point.y).toBe(-100);
    });
    it('should handle decimal coordinates in constructor parameter', () => {
        // Arrange
        const decimalPoint: Point = { x: 10.5, y: 20.75 };
        // Act
        const lineSegment: _PdfLineSegment = new _PdfLineSegment(decimalPoint);
        // Assert
        expect(lineSegment._point.x).toBe(10.5);
        expect(lineSegment._point.y).toBe(20.75);
    });
    it('should have _clone method available on instance', () => {
        // Arrange
        const lineSegment: _PdfLineSegment = new _PdfLineSegment({ x: 5, y: 10 });
        // Act
        const cloneMethod: Function = lineSegment._clone;
        // Assert
        expect(cloneMethod).toBeDefined();
        expect(typeof cloneMethod).toBe('function');
    });
});
describe('Lines 130-142: _PdfBezierSegment._clone method', () => {
    it('should clone bezier segment with three object spreads of default points', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment();
        const expectedX: number = 0;
        const expectedY: number = 0;
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned).toBeDefined();
        expect(cloned instanceof _PdfBezierSegment).toBe(true);
        expect(cloned._point1.x).toBe(expectedX);
        expect(cloned._point1.y).toBe(expectedY);
        expect(cloned._point2.x).toBe(expectedX);
        expect(cloned._point2.y).toBe(expectedY);
        expect(cloned._point3.x).toBe(expectedX);
        expect(cloned._point3.y).toBe(expectedY);
    });
    it('should clone bezier segment with three object spreads of custom points', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 }
        );
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned._point1.x).toBe(10);
        expect(cloned._point1.y).toBe(20);
        expect(cloned._point2.x).toBe(30);
        expect(cloned._point2.y).toBe(40);
        expect(cloned._point3.x).toBe(50);
        expect(cloned._point3.y).toBe(60);
    });
    it('should create independent point1 copy with object spread operator', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 }
        );
        // Act
        const cloned: any = original._clone();
        cloned._point1.x = 999;
        cloned._point1.y = 888;
        // Assert
        expect(cloned._point1.x).toBe(999);
        expect(cloned._point1.y).toBe(888);
        expect(original._point1.x).toBe(10);
        expect(original._point1.y).toBe(20);
        expect(cloned._point1).not.toBe(original._point1);
    });
    it('should create independent point2 copy with object spread operator', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 }
        );
        // Act
        const cloned: any = original._clone();
        cloned._point2.x = 777;
        cloned._point2.y = 666;
        // Assert
        expect(cloned._point2.x).toBe(777);
        expect(cloned._point2.y).toBe(666);
        expect(original._point2.x).toBe(30);
        expect(original._point2.y).toBe(40);
        expect(cloned._point2).not.toBe(original._point2);
    });
    it('should create independent point3 copy with object spread operator', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 }
        );
        // Act
        const cloned: any = original._clone();
        cloned._point3.x = 555;
        cloned._point3.y = 444;
        // Assert
        expect(cloned._point3.x).toBe(555);
        expect(cloned._point3.y).toBe(444);
        expect(original._point3.x).toBe(50);
        expect(original._point3.y).toBe(60);
        expect(cloned._point3).not.toBe(original._point3);
    });
    it('should return new _PdfBezierSegment instance from clone', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 5, y: 6 }
        );
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned).not.toBe(original);
        expect(cloned instanceof _PdfBezierSegment).toBe(true);
        expect(typeof cloned._clone).toBe('function');
    });
    it('should handle negative coordinates in all three cloned points', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: -10, y: -20 },
            { x: -30, y: -40 },
            { x: -50, y: -60 }
        );
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned._point1.x).toBe(-10);
        expect(cloned._point1.y).toBe(-20);
        expect(cloned._point2.x).toBe(-30);
        expect(cloned._point2.y).toBe(-40);
        expect(cloned._point3.x).toBe(-50);
        expect(cloned._point3.y).toBe(-60);
    });
    it('should handle decimal coordinates in all three cloned points', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 10.5, y: 20.75 },
            { x: 30.25, y: 40.5 },
            { x: 50.125, y: 60.875 }
        );
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned._point1.x).toBe(10.5);
        expect(cloned._point1.y).toBe(20.75);
        expect(cloned._point2.x).toBe(30.25);
        expect(cloned._point2.y).toBe(40.5);
        expect(cloned._point3.x).toBe(50.125);
        expect(cloned._point3.y).toBe(60.875);
    });
    it('should create proper _PdfBezierSegment from constructor call with spreads', () => {
        // Arrange
        const original: _PdfBezierSegment = new _PdfBezierSegment(
            { x: 5, y: 10 },
            { x: 15, y: 25 },
            { x: 35, y: 45 }
        );
        // Act
        const cloned: any = original._clone();
        // Assert
        expect(cloned.constructor.name).toBe('_PdfBezierSegment');
        expect(cloned._point1).toBeDefined();
        expect(cloned._point2).toBeDefined();
        expect(cloned._point3).toBeDefined();
    });
});
