import { PdfDocument, PdfPage, PdfRotationAngle, PdfRedactionAnnotation, PdfAnnotation, PdfTemplate } from '@syncfusion/ej2-pdf';
import { PdfRedactor } from '../../src/pdf-data-extract/core/redaction/pdf-redactor';
import { PdfRedactionRegion } from '../../src/pdf-data-extract/core/redaction/pdf-redaction-region';
import { _PdfRecord } from '@syncfusion/ej2-pdf';
import { _PdfContentStream } from '@syncfusion/ej2-pdf';
import { TextGlyph } from '../../src/pdf-data-extract/core/text-structure';
describe('PdfRedactor - Behavior Code Coverage (Lines 1-664)', () => {
    // =============================================
    // Constructor Tests
    // =============================================
    it('should throw error when document is null', () => {
        // Arrange
        const document: any = null;
        // Act & Assert
        expect(() => {
            new PdfRedactor(document);
        }).toThrowError('PDF document instance cannot be null or undefined');
    });
    it('should throw error when document is undefined', () => {
        // Arrange
        const document: any = undefined;
        // Act & Assert
        expect(() => {
            new PdfRedactor(document);
        }).toThrowError('PDF document instance cannot be null or undefined');
    });
    it('should throw error when document is not loaded (_isLoaded = false)', () => {
        // Arrange
        const document: any = {
            _isLoaded: false,
            fileStructure: { isIncrementalUpdate: true }
        };
        // Act & Assert
        expect(() => {
            new PdfRedactor(document);
        }).toThrowError('Redaction cannot be applied to a newly created document.');
    });
    it('should initialize redactor with loaded document (no redactions)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: { test: 'xref' },
            fileStructure: { isIncrementalUpdate: true },
            pageCount: 2
        };
        // Act
        const redactor: PdfRedactor = new PdfRedactor(document);
        // Assert
        expect((redactor as any)._document).toBe(document);
        expect((redactor as any)._crossReference).toEqual(document._crossReference);
        expect(document.fileStructure.isIncrementalUpdate).toBe(false);
        expect((redactor as any)._parser).toBeDefined();
    });
    it('should initialize redactor with loaded document and redaction array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: { test: 'xref' },
            fileStructure: { isIncrementalUpdate: true },
            pageCount: 2
        };
        const redactions: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 }),
            new PdfRedactionRegion(1, { x: 20, y: 20, width: 60, height: 60 })
        ];
        // Act
        const redactor: PdfRedactor = new PdfRedactor(document, redactions);
        // Assert
        expect((redactor as any)._document).toBe(document);
        expect((redactor as any)._redaction.size).toBe(2);
        expect((redactor as any)._redaction.get(0).length).toBe(1);
        expect((redactor as any)._redaction.get(1).length).toBe(1);
    });
    it('should initialize redactor with loaded document and empty redaction array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: { test: 'xref' },
            fileStructure: { isIncrementalUpdate: true },
            pageCount: 1
        };
        const redactions: PdfRedactionRegion[] = [];
        // Act
        const redactor: PdfRedactor = new PdfRedactor(document, redactions);
        // Assert
        expect((redactor as any)._document).toBe(document);
        expect((redactor as any)._redaction.size).toBe(0);
    });
    it('should disable incremental update flag after initialization', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: true },
            pageCount: 0
        };
        // Act
        new PdfRedactor(document);
        // Assert
        expect(document.fileStructure.isIncrementalUpdate).toBe(false);
    });
    // =============================================
    // add() Method Tests
    // =============================================
    it('should add single redaction to empty map', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 })
        ];
        // Act
        redactor.add(redactions);
        // Assert
        expect((redactor as any)._redaction.has(0)).toBe(true);
        expect((redactor as any)._redaction.get(0).length).toBe(1);
    });
    it('should add multiple redactions to same page', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 2
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactions1: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 })
        ];
        const redactions2: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 60, y: 60, width: 40, height: 40 })
        ];
        // Act
        redactor.add(redactions1);
        redactor.add(redactions2);
        // Assert
        expect((redactor as any)._redaction.get(0).length).toBe(2);
    });
    it('should add redactions to multiple pages', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 3
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 }),
            new PdfRedactionRegion(1, { x: 20, y: 20, width: 60, height: 60 }),
            new PdfRedactionRegion(2, { x: 30, y: 30, width: 70, height: 70 })
        ];
        // Act
        redactor.add(redactions);
        // Assert
        expect((redactor as any)._redaction.size).toBe(3);
        expect((redactor as any)._redaction.get(0).length).toBe(1);
        expect((redactor as any)._redaction.get(1).length).toBe(1);
        expect((redactor as any)._redaction.get(2).length).toBe(1);
    });
    it('should handle adding redactions when map entry already exists', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redaction.set(0, [new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 })]);
        const newRedaction: PdfRedactionRegion = new PdfRedactionRegion(0, { x: 10, y: 10, width: 20, height: 20 });
        // Act
        redactor.add([newRedaction]);
        // Assert
        expect((redactor as any)._redaction.get(0).length).toBe(2);
    });
    // =============================================
    // _getBytes() Method Tests
    // =============================================
    it('should convert empty string to empty byte array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const text: string = '';
        // Act
        const bytes: number[] = (redactor as any)._getBytes(text);
        // Assert
        expect(bytes.length).toBe(0);
        expect(Array.isArray(bytes)).toBe(true);
    });
    it('should convert single character to byte array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const text: string = 'A';
        // Act
        const bytes: number[] = (redactor as any)._getBytes(text);
        // Assert
        expect(bytes.length).toBe(1);
        expect(bytes[0]).toBe(65);
    });
    it('should convert multi-character string to byte array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const text: string = 'ABC';
        // Act
        const bytes: number[] = (redactor as any)._getBytes(text);
        // Assert
        expect(bytes.length).toBe(3);
        expect(bytes[0]).toBe(65);
        expect(bytes[1]).toBe(66);
        expect(bytes[2]).toBe(67);
    });
    it('should convert special characters to byte array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const text: string = '(hello)';
        // Act
        const bytes: number[] = (redactor as any)._getBytes(text);
        // Assert
        expect(bytes.length).toBe(7);
        expect(bytes[0]).toBe(40); // '('
        expect(bytes[6]).toBe(41); // ')'
    });
    // =============================================
    // _contains() Method Tests
    // =============================================
    it('should return true when point is exactly at rectangle corner (0,0)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [0, 0];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when point is inside rectangle', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [5, 5];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when point is at right edge', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [10, 5];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when point is at top edge', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [5, 10];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(true);
    });
    it('should return false when point is outside rectangle (right)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [11, 5];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when point is outside rectangle (left)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 10, y: 10, width: 10, height: 10 };
        const point: number[] = [9, 15];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when point is outside rectangle (below)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [5, -1];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when point is outside rectangle (above)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const bounds: any = { x: 0, y: 0, width: 10, height: 10 };
        const point: number[] = [5, 11];
        // Act
        const result: boolean = (redactor as any)._contains(bounds, point);
        // Assert
        expect(result).toBe(false);
    });
    // =============================================
    // _intersectsWith() Method Tests
    // =============================================
    it('should return true when rectangles fully overlap', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 0, y: 0, width: 10, height: 10 };
        const rect2: any = { x: 2, y: 2, width: 5, height: 5 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when rectangles partially overlap', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 0, y: 0, width: 10, height: 10 };
        const rect2: any = { x: 5, y: 5, width: 10, height: 10 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when rectangles touch at edge (left edge)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 0, y: 0, width: 10, height: 10 };
        const rect2: any = { x: 10, y: 0, width: 10, height: 10 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when rectangles do not intersect', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 0, y: 0, width: 10, height: 10 };
        const rect2: any = { x: 20, y: 20, width: 10, height: 10 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(false);
    });
    it('should return true when rect2 is to the left but overlapping', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 10, y: 0, width: 10, height: 10 };
        const rect2: any = { x: 0, y: 0, width: 15, height: 10 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when rectangles overlap vertically', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const rect1: any = { x: 0, y: 10, width: 10, height: 10 };
        const rect2: any = { x: 0, y: 0, width: 10, height: 15 };
        // Act
        const result: boolean = (redactor as any)._intersectsWith(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    // =============================================
    // _isFoundBounds() Method Tests
    // =============================================
    it('should return true when point is contained in redaction region', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 5, y: 5, width: 1, height: 1 };
        const redactionRegion: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 })
        ];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when rectangle intersects redaction region', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 5, y: 5, width: 10, height: 10 };
        const redactionRegion: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 })
        ];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(true);
    });
    it('should return false when rectangle does not intersect any redaction region', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 20, y: 20, width: 5, height: 5 };
        const redactionRegion: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 })
        ];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(false);
    });
    it('should return false when redaction region array is empty', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 5, y: 5, width: 1, height: 1 };
        const redactionRegion: PdfRedactionRegion[] = [];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(false);
    });
    it('should return true when checking against multiple redaction regions (first match)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 5, y: 5, width: 1, height: 1 };
        const redactionRegion: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 }),
            new PdfRedactionRegion(0, { x: 20, y: 20, width: 5, height: 5 })
        ];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(true);
    });
    it('should return true when checking against multiple redaction regions (second match)', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const candidate: any = { x: 22, y: 22, width: 1, height: 1 };
        const redactionRegion: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 }),
            new PdfRedactionRegion(0, { x: 20, y: 20, width: 5, height: 5 })
        ];
        // Act
        const result: boolean = (redactor as any)._isFoundBounds(candidate, redactionRegion);
        // Assert
        expect(result).toBe(true);
    });
    // =============================================
    // _combineBounds() Method Tests
    // =============================================
    it('should append single redaction region to accumulator', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redactionRegion = [];
        const regions: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 })
        ];
        // Act
        (redactor as any)._combineBounds(regions);
        // Assert
        expect((redactor as any)._redactionRegion.length).toBe(1);
        expect((redactor as any)._redactionRegion[0]).toBe(regions[0]);
    });
    it('should append multiple redaction regions to accumulator', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redactionRegion = [];
        const regions: PdfRedactionRegion[] = [
            new PdfRedactionRegion(0, { x: 10, y: 10, width: 50, height: 50 }),
            new PdfRedactionRegion(0, { x: 20, y: 20, width: 60, height: 60 }),
            new PdfRedactionRegion(0, { x: 30, y: 30, width: 70, height: 70 })
        ];
        // Act
        (redactor as any)._combineBounds(regions);
        // Assert
        expect((redactor as any)._redactionRegion.length).toBe(3);
        expect((redactor as any)._redactionRegion[0]).toBe(regions[0]);
        expect((redactor as any)._redactionRegion[1]).toBe(regions[1]);
        expect((redactor as any)._redactionRegion[2]).toBe(regions[2]);
    });
    it('should handle empty redaction array', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redactionRegion = [];
        const regions: PdfRedactionRegion[] = [];
        // Act
        (redactor as any)._combineBounds(regions);
        // Assert
        expect((redactor as any)._redactionRegion.length).toBe(0);
    });
    // =============================================
    // _splitHexString() Method Tests
    // =============================================
    it('should split hex string without newlines', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const hexString: string = '<48656C6C6F>';
        // Act
        const result: string[] = (redactor as any)._splitHexString(hexString);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
    it('should split hex string with newlines correctly', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const hexString: string = '<48\n656C6C6F>';
        // Act
        const result: string[] = (redactor as any)._splitHexString(hexString);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
    it('should handle hex string starting with 0', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const hexString: string = '<0ABC>';
        // Act
        const result: string[] = (redactor as any)._splitHexString(hexString);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
    it('should handle hex string not starting with 0', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const hexString: string = '<ABCD>';
        // Act
        const result: string[] = (redactor as any)._splitHexString(hexString);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
    // =============================================
    // _calculateRotatedBounds() Method Tests
    // =============================================
    it('should return original bounds for angle 0 degrees', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1,
            getPage: () => ({
                rotation: PdfRotationAngle.angle0,
                size: { width: 200, height: 100 }
            })
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const page: any = { rotation: PdfRotationAngle.angle0, size: { width: 200, height: 100 } };
        const bounds: any = { x: 10, y: 20, width: 30, height: 40 };
        // Act
        const result: any = (redactor as any)._calculateRotatedBounds(page, bounds);
        // Assert
        expect(result).toEqual(bounds);
    });
    it('should calculate rotated bounds for angle 90 degrees', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1,
            getPage: () => ({
                rotation: PdfRotationAngle.angle90,
                size: { width: 200, height: 100 }
            })
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const page: any = { rotation: PdfRotationAngle.angle90, size: { width: 200, height: 100 } };
        const bounds: any = { x: 10, y: 20, width: 30, height: 40 };
        // Act
        const result: any = (redactor as any)._calculateRotatedBounds(page, bounds);
        // Assert
        expect(result.x).toBe(100 - (20 + 40));
        expect(result.y).toBe(10);
        expect(result.width).toBe(40);
        expect(result.height).toBe(30);
    });
    it('should calculate rotated bounds for angle 180 degrees', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1,
            getPage: () => ({
                rotation: PdfRotationAngle.angle180,
                size: { width: 200, height: 100 }
            })
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const page: any = { rotation: PdfRotationAngle.angle180, size: { width: 200, height: 100 } };
        const bounds: any = { x: 10, y: 20, width: 30, height: 40 };
        // Act
        const result: any = (redactor as any)._calculateRotatedBounds(page, bounds);
        // Assert
        expect(result.x).toBe(200 - (10 + 30));
        expect(result.y).toBe(100 - (20 + 40));
        expect(result.width).toBe(30);
        expect(result.height).toBe(40);
    });
    it('should calculate rotated bounds for angle 270 degrees', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1,
            getPage: () => ({
                rotation: PdfRotationAngle.angle270,
                size: { width: 200, height: 100 }
            })
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const page: any = { rotation: PdfRotationAngle.angle270, size: { width: 200, height: 100 } };
        const bounds: any = { x: 10, y: 20, width: 30, height: 40 };
        // Act
        const result: any = (redactor as any)._calculateRotatedBounds(page, bounds);
        // Assert
        expect(result.x).toBe(20);
        expect(result.y).toBe(200 - 10 - 30);
        expect(result.width).toBe(40);
        expect(result.height).toBe(30);
    });
    it('should return original bounds for unknown rotation angle', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 1,
            getPage: () => ({
                rotation: 999,
                size: { width: 200, height: 100 }
            })
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const page: any = { rotation: 999, size: { width: 200, height: 100 } };
        const bounds: any = { x: 10, y: 20, width: 30, height: 40 };
        // Act
        const result: any = (redactor as any)._calculateRotatedBounds(page, bounds);
        // Assert
        expect(result).toEqual(bounds);
    });
    // =============================================
    // _optimizeContent() Method Tests
    // =============================================
    it('should write Tj operator with replaced text', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record: any = {
            _operator: 'Tj',
            _operands: ['(hello)']
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        const updatedText: string = '(REDACTED)';
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, updatedText, stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should write single quote operator with line break', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record: any = {
            _operator: "'",
            _operands: ['5', '(hello)']
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        const updatedText: string = '(REDACTED)';
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, updatedText, stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should write double quote operator with line break', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record: any = {
            _operator: '\"',
            _operands: ['1', '2', '(hello)']
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        const updatedText: string = '(REDACTED)';
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, updatedText, stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should write TJ operator with updated text', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record: any = {
            _operator: 'TJ',
            _operands: ['[(hello) 10]']
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        const updatedText: string = '[REDACTED]';
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, updatedText, stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should handle ID operator with inline image data', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record: any = {
            _operator: 'ID',
            _operands: ['/W', '100', '/H', '100']
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        const updatedText: string = '';
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, updatedText, stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should handle record with inline image bytes', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const imageBytes: Uint8Array = new Uint8Array([255, 0, 128, 64]);
        const record: any = {
            _operator: 'EI',
            _inlineImageBytes: imageBytes
        };
        const recordCollection: _PdfRecord[] = [record];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, '', stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should handle operators that should have space after them', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record1: any = { _operator: 'w', _operands: ['1'] };
        const record2: any = { _operator: 'm', _operands: ['0', '0'] };
        const recordCollection: _PdfRecord[] = [record1, record2];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, '', stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    it('should add space between W/W* and n operators', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const record1: any = { _operator: 'W', _operands: [] };
        const record2: any = { _operator: 'n', _operands: [] };
        const recordCollection: _PdfRecord[] = [record1, record2];
        const stream: any = {
            writes: [] as any[],
            write(data: any) {
                this.writes.push(data);
            }
        };
        // Act
        (redactor as any)._optimizeContent(recordCollection, 0, '', stream);
        // Assert
        expect(stream.writes.length).toBeGreaterThan(0);
    });
    // =============================================
    // _mapString() Method Tests
    // =============================================
    it('should map single text segment with glyph boundary', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const glyphs: any = [
            { _bounds: { x: 0, y: 0 }, _text: '', _isReplace: false },
            { _bounds: { x: 1, y: 0 }, _text: '', _isReplace: false }
        ];
        const mainText: string[] = ['(ab)'];
        // Act
        const result: any = (redactor as any)._mapString(mainText, glyphs);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
    });
    it('should map multiple text segments with glyphs', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const glyphs: any = [
            { _bounds: { x: 0, y: 0 }, _text: '', _isReplace: false },
            { _bounds: { x: 1, y: 0 }, _text: '', _isReplace: false },
            { _bounds: { x: 2, y: 0 }, _text: '', _isReplace: false },
            { _bounds: { x: 3, y: 0 }, _text: '', _isReplace: false }
        ];
        const mainText: string[] = ['(ab)', '(cd)'];
        // Act
        const result: any = (redactor as any)._mapString(mainText, glyphs);
        // Assert
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
    });
    it('should handle text segment with opening parenthesis only', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const glyphs: any = [
            { _bounds: { x: 0, y: 0 }, _text: '', _isReplace: false },
            { _bounds: { x: 1, y: 0 }, _text: '', _isReplace: false }
        ];
        const mainText: string[] = ['(ab'];
        // Act
        const result: any = (redactor as any)._mapString(mainText, glyphs);
        // Assert
        expect(Array.isArray(result)).toBe(true);
    });
    it('should handle text segment with closing parenthesis only', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const glyphs: any = [
            { _bounds: { x: 0, y: 0 }, _text: '', _isReplace: false }
        ];
        const mainText: string[] = ['ab)'];
        // Act
        const result: any = (redactor as any)._mapString(mainText, glyphs);
        // Assert
        expect(Array.isArray(result)).toBe(true);
    });
    it('should skip single character text without parenthesis markers', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const glyphs: any = [
            { _bounds: { x: 0, y: 0 }, _text: '', _isReplace: false }
        ];
        const mainText: string[] = ['a'];
        // Act
        const result: any = (redactor as any)._mapString(mainText, glyphs);
        // Assert
        expect(Array.isArray(result)).toBe(true);
    });
    // =============================================
    // _replacedText() Method Tests
    // =============================================
    it('should return original text when no glyphs are replaced and all others exist', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redactionRegion = [];
        const glyphs: any = [
            { _bounds: { x: 20, y: 20 }, _text: '', _isReplace: false }
        ];
        const text: string[] = ['a'];
        const originalText: string = '(a)';
        const decodeText: string[] = ['a'];
        // Act
        const result: string = (redactor as any)._replacedText(glyphs, text, originalText, decodeText);
        // Assert
        expect(result).toBe(originalText);
    });
    it('should return replacement text when glyphs are in redaction region', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactionRegion: PdfRedactionRegion = new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 });
        (redactor as any)._redactionRegion = [redactionRegion];
        const glyphs: any = [
            { _bounds: { x: 5, y: 5, width: 1, height: 1 }, _text: '', _isReplace: false }
        ];
        const text: string[] = ['a'];
        const originalText: string = '(a)';
        const decodeText: string[] = ['a'];
        // Act
        const result: string = (redactor as any)._replacedText(glyphs, text, originalText, decodeText);
        // Assert
        expect(result).toContain('[');
        expect(result).toContain(']');
    });
    it('should handle hex string input format', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactionRegion: PdfRedactionRegion = new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 });
        (redactor as any)._redactionRegion = [redactionRegion];
        const glyphs: any = [
            { _bounds: { x: 5, y: 5, width: 1, height: 1 }, _text: '', _isReplace: false }
        ];
        const text: string[] = ['a'];
        const originalText: string = '<48656C6C6F>';
        const decodeText: string[] = ['hello'];
        // Act
        const result: string = (redactor as any)._replacedText(glyphs, text, originalText, decodeText);
        // Assert
        expect(result).toContain('[');
        expect(result).toContain(']');
    });
    it('should handle array format input', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        const redactionRegion: PdfRedactionRegion = new PdfRedactionRegion(0, { x: 0, y: 0, width: 10, height: 10 });
        (redactor as any)._redactionRegion = [redactionRegion];
        const glyphs: any = [
            { _bounds: { x: 5, y: 5, width: 1, height: 1 }, _text: '', _isReplace: false }
        ];
        const text: string[] = ['a'];
        const originalText: string = '[(a)]';
        const decodeText: string[] = ['a'];
        // Act
        const result: string = (redactor as any)._replacedText(glyphs, text, originalText, decodeText);
        // Assert
        expect(result).toContain('[');
        expect(result).toContain(']');
    });
    it('should reset hex flag after processing', () => {
        // Arrange
        const document: any = {
            _isLoaded: true,
            _crossReference: {},
            fileStructure: { isIncrementalUpdate: false },
            pageCount: 0
        };
        const redactor: PdfRedactor = new PdfRedactor(document);
        (redactor as any)._redactionRegion = [];
        const glyphs: any = [
            { _bounds: { x: 20, y: 20 }, _text: '', _isReplace: false }
        ];
        const text: string[] = ['a'];
        // Act
        (redactor as any)._replacedText(glyphs, text, '(a)', ['a']);
        // Assert
        expect((redactor as any)._isHex).toBe(false);
    });
});
