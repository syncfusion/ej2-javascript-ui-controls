import { PdfDynamicField } from '../../src/pdf/core/graphics/automatic-fields/dynamic-field';
import { PdfSingleValueField } from '../../src/pdf/core/graphics/automatic-fields/single-value-field';
import { PdfDocument } from '../../src/pdf/core/pdf-document';
import { PdfPage } from '../../src/pdf/core/pdf-page';
import { PdfFont, PdfFontFamily, PdfStandardFont } from "../../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat } from "../../src/pdf/core/fonts/pdf-string-format";
import { PdfAutomaticField } from "../../src/pdf/core/graphics/automatic-fields/automatic-field";
import { PdfStaticField } from "../../src/pdf/core/graphics/automatic-fields/static-field";
import { PdfBrush, PdfGraphics } from "../../src/pdf/core/graphics/pdf-graphics";
import { PdfTemplate } from "../../src/pdf/core/graphics/pdf-template";
import { Point, Rectangle, Size } from "../../src/pdf/core/pdf-type";
describe('982023 PdfSingleValueField _performDraw mutation coverage', () => {
    it('982023 - should use null cached document when graphics has no page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const drawingPage: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Page unavailable';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return null;
        };
        // Act
        field._performDraw(drawingPage.graphics, { x: 10, y: 20 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._cachedValue).toBe('Page unavailable');
        expect(field._cachedDocument).toBeNull();
        document.destroy();
    });
    it('982023 - should use null cached document when page has no cross reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const drawingPage: PdfPage = document.addPage();
        const fieldPage: PdfPage = document.addPage();
        const crossReference = fieldPage._crossReference;
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Cross reference unavailable';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return fieldPage;
        };
        fieldPage._crossReference = null;
        // Act
        field._performDraw(drawingPage.graphics, { x: 10, y: 20 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        fieldPage._crossReference = crossReference;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._cachedValue).toBe('Cross reference unavailable');
        expect(field._cachedDocument).toBeNull();
        document.destroy();
    });
    it('982023 - should cache the document obtained from the page cross reference', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Document value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        // Act
        field._performDraw(page.graphics, { x: 15, y: 25 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._cachedValue).toBe('Document value');
        expect(field._cachedDocument).toBe(document);
        document.destroy();
    });
    it('982023 - should create template when cached template is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Initial value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        field._template = null;
        field._cachedValue = 'Initial value';
        field._cachedDocument = document;
        // Act
        field._performDraw(page.graphics, { x: 20, y: 30 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._cachedValue).toBe('Initial value');
        expect(field._cachedDocument).toBe(document);
        document.destroy();
    });
    it('982023 - should reuse template when value and document remain unchanged', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Reusable value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        field._performDraw(page.graphics, { x: 10, y: 10 });
        const cachedTemplate: PdfTemplate = field._template;
        // Act
        field._performDraw(page.graphics, { x: 30, y: 40 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBe(cachedTemplate);
        expect(field._cachedValue).toBe('Reusable value');
        expect(field._cachedDocument).toBe(document);
        document.destroy();
    });
    it('982023 - should replace template when cached value changes', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        let fieldValue: string = 'First value';
        field._getValue = (_graphics: PdfGraphics): string => {
            return fieldValue;
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        field._performDraw(page.graphics, { x: 10, y: 10 });
        const firstTemplate: PdfTemplate = field._template;
        fieldValue = 'Second value';
        // Act
        field._performDraw(page.graphics, { x: 20, y: 20 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._template).not.toBe(firstTemplate);
        expect(field._cachedValue).toBe('Second value');
        expect(field._cachedDocument).toBe(document);
        document.destroy();
    });
    it('982023 - should replace template when cached document changes', () => {
        // Arrange
        const firstDocument: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = firstDocument.addPage();
        const secondDocument: PdfDocument = new PdfDocument();
        const secondPage: PdfPage = secondDocument.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        let fieldPage: PdfPage = firstPage;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Shared value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return fieldPage;
        };
        field._performDraw(firstPage.graphics, { x: 10, y: 10 });
        const firstTemplate: PdfTemplate = field._template;
        fieldPage = secondPage;
        // Act
        field._performDraw(secondPage.graphics, { x: 20, y: 20 });
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._template).toBeDefined();
        expect(field._template).not.toBe(firstTemplate);
        expect(field._cachedValue).toBe('Shared value');
        expect(field._cachedDocument).toBe(secondDocument);
        firstDocument.destroy();
        secondDocument.destroy();
    });
    it('982023 - should recreate template when cached value differs and template is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Current value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        field._template = null;
        field._cachedValue = 'Previous value';
        field._cachedDocument = document;
        // Act
        field._performDraw(page.graphics, { x: 25, y: 35 });
        const createdTemplate: PdfTemplate = field._template;
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(createdTemplate).toBeDefined();
        expect(field._cachedValue).toBe('Current value');
        expect(field._cachedDocument).toBe(document);
        document.destroy();
    });
    it('982023 - should create template with the complete obtained size', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfSingleValueField = new PdfSingleValueField();
        const originalGetValue: (graphics: PdfGraphics) => string = field._getValue;
        const originalGetPageFromGraphics: (graphics: PdfGraphics) => PdfPage = field._getPageFromGraphics;
        const expectedSize: Size = field._obtainSize();
        field._getValue = (_graphics: PdfGraphics): string => {
            return 'Bounds value';
        };
        field._getPageFromGraphics = (_graphics: PdfGraphics): PdfPage => {
            return page;
        };
        // Act
        field._performDraw(page.graphics, { x: 40, y: 50 });
        const template: PdfTemplate = field._template;
        field._getValue = originalGetValue;
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(field._cachedValue).toBe('Bounds value');
        expect(template).toBeDefined();
        expect(template.graphics).toBeDefined();
        expect(template.size.width).toBe(48.472);
        expect(template.size.height).toBe(9.248000000000001);
        document.destroy();
    });
});
describe('982023 PdfSingleValueField generated constructor', () => {
    it('982023 - should create PdfSingleValueField with inherited behavior', () => {
        // Arrange
        const field: PdfSingleValueField = new PdfSingleValueField();
        // Act
        const result: string = field._getValue({} as PdfGraphics);
        // Assert
        expect(field instanceof PdfSingleValueField).toBe(true);
        expect(field instanceof PdfDynamicField).toBe(true);
        expect(result).toBe('');
        expect(typeof field._initializeBase).toBe('function');
        expect(typeof field._performDraw).toBe('function');
    });
});
