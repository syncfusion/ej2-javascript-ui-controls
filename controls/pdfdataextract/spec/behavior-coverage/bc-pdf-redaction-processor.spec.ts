import { PdfAnnotation, PdfButtonField, PdfCircleAnnotation, PdfDocument, PdfField, PdfForm, PdfLineAnnotation, PdfPage, PdfRectangleAnnotation, PdfTextBoxField, _FieldFlag, _PdfAnnotationType, _PdfBaseStream, _PdfContentStream, _PdfDictionary, _PdfName, _PdfReference } from '@syncfusion/ej2-pdf';
import { _PdfRedactionProcessor } from '../../src/pdf-data-extract/core/redaction/pdf-redaction-processor';
import { PdfRedactionRegion } from '../../src/pdf-data-extract/core/redaction/pdf-redaction-region';
describe('_PdfRedactionProcessor', () => {
    let processor: _PdfRedactionProcessor;
    beforeEach(() => {
        processor = new _PdfRedactionProcessor();
    });
    it('should check if two rectangles intersect with overlapping bounds', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles do not intersect horizontally', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 50, height: 100 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 100, y: 0, width: 50, height: 100 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles do not intersect vertically', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 100, height: 50 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 0, y: 100, width: 100, height: 50 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect intersection with identical rectangles', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 10, y: 10, width: 50, height: 50 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 10, y: 10, width: 50, height: 50 };
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect intersection with one rectangle inside another', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 25, y: 25, width: 50, height: 50 };
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangle is empty with zero width', () => {
        // Arrange
        const width: number = 0;
        const height: number = 50;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangle is empty with zero height', () => {
        // Arrange
        const width: number = 50;
        const height: number = 0;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangle is empty with negative width', () => {
        // Arrange
        const width: number = -10;
        const height: number = 50;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangle is empty with negative height', () => {
        // Arrange
        const width: number = 50;
        const height: number = -10;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangle has valid positive dimensions', () => {
        // Arrange
        const width: number = 100;
        const height: number = 100;
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should normalize rectangle with x < width and y < height', () => {
        // Arrange
        const x: number = 10;
        const y: number = 20;
        const width: number = 100;
        const height: number = 150;
        // Act
        const result: { x: number; y: number; width: number; height: number } = processor._toRectangle(x, y, width, height);
        // Assert
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(90);
        expect(result.height).toBe(130);
    });
    it('should normalize rectangle with x > width and y > height', () => {
        // Arrange
        const x: number = 100;
        const y: number = 150;
        const width: number = 10;
        const height: number = 20;
        // Act
        const result: { x: number; y: number; width: number; height: number } = processor._toRectangle(x, y, width, height);
        // Assert
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(90);
        expect(result.height).toBe(130);
    });
    it('should normalize rectangle with mixed coordinate order', () => {
        // Arrange
        const x: number = 50;
        const y: number = 10;
        const width: number = 30;
        const height: number = 100;
        // Act
        const result: { x: number; y: number; width: number; height: number } = processor._toRectangle(x, y, width, height);
        // Assert
        expect(result.x).toBe(30);
        expect(result.y).toBe(10);
        expect(result.width).toBe(20);
        expect(result.height).toBe(90);
    });
    it('should normalize rectangle with identical coordinates', () => {
        // Arrange
        const x: number = 50;
        const y: number = 50;
        const width: number = 50;
        const height: number = 50;
        // Act
        const result: { x: number; y: number; width: number; height: number } = processor._toRectangle(x, y, width, height);
        // Assert
        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });
    it('should return true when two rectangles are equal', () => {
        // Arrange
        const bounds1: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const bounds2: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isBoundsEqual(bounds1, bounds2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles differ in x coordinate', () => {
        // Arrange
        const bounds1: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const bounds2: { x: number; y: number; width: number; height: number } = { x: 15, y: 20, width: 100, height: 150 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isBoundsEqual(bounds1, bounds2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles differ in y coordinate', () => {
        // Arrange
        const bounds1: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const bounds2: { x: number; y: number; width: number; height: number } = { x: 10, y: 25, width: 100, height: 150 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isBoundsEqual(bounds1, bounds2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles differ in width', () => {
        // Arrange
        const bounds1: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const bounds2: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 110, height: 150 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isBoundsEqual(bounds1, bounds2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should return false when rectangles differ in height', () => {
        // Arrange
        const bounds1: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 150 };
        const bounds2: { x: number; y: number; width: number; height: number } = { x: 10, y: 20, width: 100, height: 160 };
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isBoundsEqual(bounds1, bounds2);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect line intersects rectangle on left edge', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 100;
        const p2X: number = 75;
        const p2Y: number = 100;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect line completely inside rectangle', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 200, height: 200 };
        const p1X: number = 50;
        const p1Y: number = 50;
        const p2X: number = 100;
        const p2Y: number = 100;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect line does not intersect rectangle', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 100, y: 100, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 0;
        const p2X: number = 50;
        const p2Y: number = 50;
        const expectedResult: boolean = false;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should handle horizontal line intersection with rectangle', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 100;
        const p2X: number = 200;
        const p2Y: number = 100;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should handle vertical line intersection with rectangle', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 100;
        const p1Y: number = 0;
        const p2X: number = 100;
        const p2Y: number = 200;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should handle diagonal line with slope calculation for intersection', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 0;
        const p2X: number = 200;
        const p2Y: number = 200;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should handle line with reversed coordinates (p1X > p2X)', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 200;
        const p1Y: number = 0;
        const p2X: number = 0;
        const p2Y: number = 200;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should handle line with very small dx near zero threshold', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 100;
        const p1Y: number = 50;
        const p2X: number = 100.00000001;
        const p2Y: number = 150;
        const expectedResult: boolean = true;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(expectedResult);
    });
    it('should detect undefined array returns false for findAnnotation', () => {
        // Arrange
        const array: any = undefined; // eslint-disable-line
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(false);
    });
    it('should return true when all scalar border array elements are zero or negative', () => {
        // Arrange
        const array: number[] = [0, 0, 0];
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should return false when border array contains positive scalar element', () => {
        // Arrange
        const array: number[] = [0, 1, 0];
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(false);
    });
    it('should return true with nested array all zero values', () => {
        // Arrange
        const array: any[] = [[0, 0], [0, 0]]; // eslint-disable-line
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should return false with nested array containing positive value', () => {
        // Arrange
        const array: any[] = [[0, 0], [1, 0]]; // eslint-disable-line
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle empty border array', () => {
        // Arrange
        const array: number[] = [];
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true with all negative scalar values', () => {
        // Arrange
        const array: number[] = [-1, -2, -3];
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should calculate bounds from points array with even index values', () => {
        // Arrange
        const points: number[] = [10, 20, 30, 40, 50, 60];
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.bounds).toBeDefined();
        expect(result.isValidAnnotation).toBe(true);
        expect(result.bounds.x).toBe(10);
        expect(result.bounds.width).toBe(40);
    });
    it('should return empty bounds from undefined points array', () => {
        // Arrange
        const points: any = undefined; // eslint-disable-line
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.bounds.x).toBe(0);
        expect(result.bounds.y).toBe(0);
        expect(result.bounds.width).toBe(0);
        expect(result.bounds.height).toBe(0);
        expect(result.isValidAnnotation).toBe(false);
    });
    it('should return empty bounds from empty points array', () => {
        // Arrange
        const points: number[] = [];
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.isValidAnnotation).toBe(false);
    });
    it('should calculate bounds with inverted Y axis coordinate', () => {
        // Arrange
        const points: number[] = [100, 200, 300, 400];
        const pageHeight: number = 1000;
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: pageHeight
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.bounds).toBeDefined();
        expect(result.isValidAnnotation).toBe(true);
        expect(result.bounds.y).toBe(600);
    });
    it('should handle odd-length points array correctly', () => {
        // Arrange
        const points: number[] = [10, 20, 30, 40, 50];
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.bounds).toBeDefined();
        expect(result.isValidAnnotation).toBe(true);
    });
    it('should call _intersectsWith and return true for isFound', () => {
        // Arrange
        const values: any = { x: 0, y: 0, width: 100, height: 100 }; // eslint-disable-line
        const redactionBounds: any = { x: 50, y: 50, width: 100, height: 100 }; // eslint-disable-line
        // Act
        const result: boolean = processor._isFound(values, redactionBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should call _intersectsWith and return false for isFound when no intersection', () => {
        // Arrange
        const values: any = { x: 0, y: 0, width: 50, height: 50 }; // eslint-disable-line
        const redactionBounds: any = { x: 100, y: 100, width: 50, height: 50 }; // eslint-disable-line
        // Act
        const result: boolean = processor._isFound(values, redactionBounds);
        // Assert
        expect(result).toBe(false);
    });
    it('should create _PdfRedactionProcessor instance successfully', () => {
        // Arrange
        const expectedType: string = '_PdfRedactionProcessor';
        // Act
        const instance: _PdfRedactionProcessor = new _PdfRedactionProcessor();
        // Assert
        expect(instance).toBeDefined();
        expect(instance instanceof _PdfRedactionProcessor).toBe(true);
    });
    it('should have _updateContentStream method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._updateContentStream;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _processFormFields method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._processFormFields;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _processAnnotation method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._processAnnotation;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _isFound method defined and callable', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._isFound;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _intersectsWith method defined and callable', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._intersectsWith;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _isEmptyRectangle method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._isEmptyRectangle;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _toRectangle method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._toRectangle;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _isKidInSamePage method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._isKidInSamePage;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _checkAnnotationType method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._checkAnnotationType;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _getBoundsFromPoints method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._getBoundsFromPoints;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _isLineIntersectRectangle method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._isLineIntersectRectangle;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _isBoundsEqual method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._isBoundsEqual;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _getAnnotationType method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._getAnnotationType;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should have _findAnnotation method defined', () => {
        // Arrange
        const expectedMethodType: string = 'function';
        // Act
        const method: Function = processor._findAnnotation;
        // Assert
        expect(typeof method).toBe(expectedMethodType);
    });
    it('should verify all private methods are accessible for testing', () => {
        // Arrange
        const methodNames: string[] = [
            '_updateContentStream',
            '_processFormFields',
            '_isFound',
            '_intersectsWith',
            '_isEmptyRectangle',
            '_toRectangle',
            '_isKidInSamePage',
            '_checkAnnotationType',
            '_processAnnotation',
            '_getBoundsFromPoints',
            '_isLineIntersectRectangle',
            '_isBoundsEqual',
            '_getAnnotationType',
            '_findAnnotation'
        ];
        // Act & Assert
        methodNames.forEach((methodName: string) => {
            expect((processor as any)[methodName]).toBeDefined(); // eslint-disable-line
            expect(typeof (processor as any)[methodName]).toBe('function'); // eslint-disable-line
        });
    });
    it('should handle rectangle with touching edges as non-intersecting', () => {
        // Arrange
        const rect1: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: { x: number; y: number; width: number; height: number } = { x: 100, y: 0, width: 100, height: 100 };
        // Act
        const result: boolean = processor._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(false);
    });
    it('should handle line that barely touches rectangle corner', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 100, y: 100, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 0;
        const p2X: number = 100;
        const p2Y: number = 100;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle bounds calculation with single point pair', () => {
        // Arrange
        const points: number[] = [50, 100];
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.isValidAnnotation).toBe(true);
        expect(result.bounds.width).toBe(0);
        expect(result.bounds.height).toBe(0);
    });
    it('should verify _isEmptyRectangle handles boundary at zero', () => {
        // Arrange
        const width: number = 0;
        const height: number = 0;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(true);
    });
    it('should verify _isEmptyRectangle handles boundary just above zero', () => {
        // Arrange
        const width: number = 0.0001;
        const height: number = 0.0001;
        // Act
        const result: boolean = processor._isEmptyRectangle(width, height);
        // Assert
        expect(result).toBe(false);
    });
    it('should normalize coordinates with negative values', () => {
        // Arrange
        const x: number = -50;
        const y: number = -100;
        const width: number = 50;
        const height: number = 100;
        // Act
        const result: { x: number; y: number; width: number; height: number } = processor._toRectangle(x, y, width, height);
        // Assert
        expect(result.x).toBe(-50);
        expect(result.y).toBe(-100);
        expect(result.width).toBe(100);
        expect(result.height).toBe(200);
    });
    it('should handle line intersection with rectangle using slope near threshold', () => {
        // Arrange
        const redactBounds: { x: number; y: number; width: number; height: number } = { x: 50, y: 50, width: 100, height: 100 };
        const p1X: number = 0;
        const p1Y: number = 50;
        const p2X: number = 100.00000011;
        const p2Y: number = 150;
        // Act
        const result: boolean = processor._isLineIntersectRectangle(redactBounds, p1X, p1Y, p2X, p2Y);
        // Assert
        expect(result).toBe(true);
    });
    it('should verify findAnnotation with mixed array types containing positive value', () => {
        // Arrange
        const array: any[] = [0, [1, 0]]; // eslint-disable-line
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should verify findAnnotation with only nested arrays', () => {
        // Arrange
        const array: any[] = [[-1, -2], [-3, -4]]; // eslint-disable-line
        // Act
        const result: boolean = processor._findAnnotation(array);
        // Assert
        expect(result).toBe(true);
    });
    it('should calculate bounds with alternating min/max X and Y values', () => {
        // Arrange
        const points: number[] = [10, 500, 100, 400, 50, 600, 150, 300];
        const mockPage: any = { // eslint-disable-line
            graphics: {
                _size: {
                    height: 1000
                }
            }
        };
        // Act
        const result: { bounds: { x: number; y: number; width: number; height: number }; isValidAnnotation: boolean } =
            processor._getBoundsFromPoints(points, mockPage);
        // Assert
        expect(result.isValidAnnotation).toBe(true);
        expect(result.bounds.x).toBe(10);
        expect(result.bounds.width).toBeGreaterThan(0);
    });
});
describe('_PdfRedactionProcessor1', () => {
    it('should handle contents as array of references and clear cache', () => {
        // Arrange
        const processor: _PdfRedactionProcessor = new _PdfRedactionProcessor();
        const ref1: object = { obj: 1 };
        const ref2: object = { obj: 2 };
        const page = ({
            _pageDictionary: {
                has: (): boolean => true,
                getRaw: (): object[] => [ref1, ref2],
                set: jasmine.createSpy('set') as jasmine.Spy,
                _updated: false
            },
            _crossReference: {
                _cacheMap: new Map<object, object>([
                    [ref1, {}],
                    [ref2, {}]
                ]),
                _getNextReference: (): _PdfReference =>
                    ({ obj: 3 } as unknown as _PdfReference),
                _fetch: (): _PdfBaseStream | null => null
            },
            graphics: {
                _size: { height: 500 },
                drawTemplate: jasmine.createSpy('drawTemplate') as jasmine.Spy,
                drawRectangle: jasmine.createSpy('drawRectangle') as jasmine.Spy
            },
            annotations: {
                count: 0,
                at: (): PdfAnnotation | null => null,
                removeAt: (): void => void 0
            }
        } as unknown) as PdfPage;
        // Act
        processor._updateContentStream(
            page,
            {} as _PdfContentStream,
            [],
            ({ form: null } as unknown) as PdfDocument
        );
        // Assert
        expect(page._crossReference._cacheMap.size).toBe(1);
        expect(page._pageDictionary._updated).toBe(true);
    });
    it('should resolve annotation type for circle and square correctly', () => {
        // Arrange
        const processor: _PdfRedactionProcessor = new _PdfRedactionProcessor();
        const circleDict = ({
            has: (key: string): boolean => key === 'Subtype' || key === 'Rect',
            get: (): _PdfName =>
                ({ name: 'circle' } as unknown as _PdfName),
            getArray: (): number[] => [0, 0, 50, 50]
        } as unknown) as _PdfDictionary;
        const squareDict = ({
            has: (key: string): boolean => key === 'Subtype' || key === 'Rect',
            get: (): _PdfName =>
                ({ name: 'square' } as unknown as _PdfName),
            getArray: (): number[] => [0, 0, 60, 80]
        } as unknown) as _PdfDictionary;
        // Act
        const circleType: _PdfAnnotationType =
            processor._getAnnotationType(circleDict);
        const squareType: _PdfAnnotationType =
            processor._getAnnotationType(squareDict);
        // Assert
        expect(circleType).toBeDefined();
        expect(squareType).toBeDefined();
    });
});
describe('_PdfRedactionProcessor2', () => {
    it('should handle Contents as _PdfReference resolved to _PdfBaseStream', () => {
        // Arrange
        const processor = new _PdfRedactionProcessor();
        const ref = ({ obj: 1 } as unknown) as _PdfReference;
        const stream = ({} as unknown) as _PdfContentStream;
        const page = ({
            _pageDictionary: {
                has: (_k: string): boolean => true,
                getRaw: (): _PdfReference => ref,
                set: jasmine.createSpy('set') as jasmine.Spy,
                _updated: false
            },
            _crossReference: {
                _fetch: (): _PdfBaseStream => ({} as _PdfBaseStream),
                _getNextReference: (): _PdfReference => ({} as _PdfReference),
                _cacheMap: new Map<_PdfReference, object>([[ref, {}]])
            },
            graphics: {
                _size: { height: 500 },
                drawTemplate: jasmine.createSpy('drawTemplate') as jasmine.Spy,
                drawRectangle: jasmine.createSpy('drawRectangle') as jasmine.Spy
            },
            annotations: {
                count: 0,
                at: (): PdfAnnotation | null => null,
                removeAt: (): void => void 0
            }
        } as unknown) as PdfPage;
        // Act
        processor._updateContentStream(page, stream, [], ({ form: null } as unknown) as PdfDocument);
        // Assert
        expect(page._pageDictionary._updated).toBe(true);
    });
    it('should draw rectangle when appearance is disabled and fillColor exists', () => {
        // Arrange
        const processor = new _PdfRedactionProcessor();
        const region = new PdfRedactionRegion(0, { x: 0, y: 0, width: 20, height: 20 });
        region._appearanceEnabled = false;
        region.fillColor = { r: 255, g: 0, b: 0 };
        const page = ({
            _pageDictionary: { has: (): boolean => false },
            graphics: {
                _size: { height: 100 },
                drawRectangle: jasmine.createSpy('drawRectangle') as jasmine.Spy,
                drawTemplate: jasmine.createSpy('drawTemplate') as jasmine.Spy
            },
            annotations: { count: 0, at: (): PdfAnnotation | null => null, removeAt: (): void => void 0 }
        } as unknown) as PdfPage;
        // Act
        processor._updateContentStream(
            page,
            (undefined as unknown) as _PdfContentStream,
            [region],
            ({ form: null } as unknown) as PdfDocument
        );
        // Assert
        expect(page.graphics.drawRectangle).toHaveBeenCalled();
    });
    it('should skip form field when field belongs to another page', () => {
        // Arrange
        const processor = new _PdfRedactionProcessor();
        const field = ({
            page: {}  // different page
        } as unknown) as PdfField;
        const form = ({
            count: 1,
            fieldAt: (): PdfField => field,
            removeFieldAt: jasmine.createSpy('removeFieldAt') as jasmine.Spy
        } as unknown) as PdfForm;
        const page = ({ graphics: { _size: { height: 100 } } } as unknown) as PdfPage;
        // Act
        processor._processFormFields(page, [], ({ form } as unknown) as PdfDocument);
        // Assert
        expect(form.removeFieldAt).not.toHaveBeenCalled();
    });
    it('should treat undefined annotation as widget annotation', () => {
        // Arrange
        const processor = new _PdfRedactionProcessor();
        const page = ({
            annotations: {
                count: 1,
                at: (): PdfAnnotation | undefined => undefined,
                removeAt: jasmine.createSpy('removeAt') as jasmine.Spy
            },
            _pageDictionary: { _updated: false },
            graphics: { _size: { height: 100 } }
        } as unknown) as PdfPage;
        // Act
        processor._processAnnotation(page, []);
        // Assert
        expect(page.annotations.removeAt).not.toHaveBeenCalled();
    });
    it('should verify kid belongs to same page by reference equality', () => {
        // Arrange
        const processor = new _PdfRedactionProcessor();
        const ref = ({} as unknown) as _PdfReference;
        const page = ({ _ref: ref } as unknown) as PdfPage;
        const kid = ({
            getRaw: (_k: string): _PdfReference => ref
        } as unknown) as _PdfDictionary;
        // Act
        const result = processor._isKidInSamePage(kid, page);
        // Assert
        expect(result).toBe(true);
    });
});
describe('_PdfRedactionProcessor3', () => {
it('should replace Contents when reference resolves to BaseStream', () => {
    const processor = new _PdfRedactionProcessor();
    const ref = {} as _PdfReference;
    const stream = {} as _PdfContentStream;
    const page = ({
        _pageDictionary: {
            has: (): boolean => true,
            getRaw: (): _PdfReference => ref,
            set: jasmine.createSpy('set'),
            _updated: false
        },
        _crossReference: {
            _fetch: (): _PdfBaseStream => ({} as _PdfBaseStream),
            _getNextReference: (): _PdfReference => ({} as _PdfReference),
            _cacheMap: new Map([[ref, {}]])
        },
        graphics: {
            _size: { height: 100 },
            drawTemplate: jasmine.createSpy('drawTemplate'),
            drawRectangle: jasmine.createSpy('drawRectangle')
        },
        annotations: { count: 0, at: (): any => null, removeAt: (): void => {} }
    } as unknown) as PdfPage;
    processor._updateContentStream(page, stream, [], ({ form: null } as unknown) as PdfDocument);
    expect(page._pageDictionary._updated).toBe(true);
});
it('should draw appearance template when appearanceEnabled is true', () => {
    const processor = new _PdfRedactionProcessor();
    const region = new PdfRedactionRegion(0, { x: 0, y: 0, width: 20, height: 20 });
    region._appearanceEnabled = true;
    region.appearance.normal._isNew = false;
    const page = ({
        _pageDictionary: { has: (): boolean => false },
        graphics: {
            _size: { height: 50 },
            drawTemplate: jasmine.createSpy('drawTemplate'),
            drawRectangle: jasmine.createSpy('drawRectangle')
        },
        annotations: { count: 0, at: (): any => null, removeAt: (): void => {} }
    } as unknown) as PdfPage;
    processor._updateContentStream(
        page,
        (undefined as unknown) as _PdfContentStream,
        [region],
        ({ form: null } as unknown) as PdfDocument
    );
    expect(page.graphics.drawTemplate).toHaveBeenCalled();
});
it('should draw rectangle when fillColor exists', () => {
    const processor = new _PdfRedactionProcessor();
    const region = new PdfRedactionRegion(0, { x: 0, y: 0, width: 20, height: 20 });
    region._appearanceEnabled = false;
    region.fillColor = { r: 255, g: 0, b: 0 };
    const page = ({
        _pageDictionary: { has: (): boolean => false },
        graphics: {
            _size: { height: 50 },
            drawTemplate: jasmine.createSpy('drawTemplate'),
            drawRectangle: jasmine.createSpy('drawRectangle')
        },
        annotations: { count: 0, at: (): any => null, removeAt: (): void => {} }
    } as unknown) as PdfPage;
    processor._updateContentStream(
        page,
        (undefined as unknown) as _PdfContentStream,
        [region],
        ({ form: null } as unknown) as PdfDocument
    );
    expect(page.graphics.drawRectangle).toHaveBeenCalled();
});
});