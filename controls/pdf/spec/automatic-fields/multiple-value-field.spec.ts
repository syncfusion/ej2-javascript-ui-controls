import { PdfDocument } from '../../src/pdf/core/pdf-document';
import { PdfPage } from '../../src/pdf/core/pdf-page';
import { PdfGraphics } from '../../src/pdf/core/graphics/pdf-graphics';
import { PdfTemplate } from '../../src/pdf/core/graphics/pdf-template';
import { PdfMultipleValueField } from '../../src/pdf/core/graphics/automatic-fields/multiple-value-field';
import { _PdfTemplateValuePair, Size } from '../../src/pdf/core/pdf-type';
describe('982023 PdfMultipleValueField constructor and _performDraw mutations', () => {
    it('982023 - should initialize template value map in constructor', () => {
        // Arrange
        // Act
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        // Assert
        expect(field._templateValueMap instanceof Map).toBe(true);
        expect(field._templateValueMap.size).toBe(0);
    });
    it('982023 - should replace cached template when cached value changes', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string = field._getValue;
        const previousTemplate: PdfTemplate = new PdfTemplate({
            x: 0,
            y: 0,
            width: 20,
            height: 20
        });
        const previousPair: _PdfTemplateValuePair = {
            template: previousTemplate,
            value: 'Previous value'
        };
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return 'Current value';
        };
        field._templateValueMap.set(graphics, previousPair);
        // Act
        field._performDraw(graphics, { x: 10, y: 20 });
        const currentPair: _PdfTemplateValuePair = field._templateValueMap.get(graphics);
        field._getValue = originalGetValue;
        // Assert
        expect(currentPair).toBeDefined();
        expect(currentPair).not.toBe(previousPair);
        expect(currentPair.template).toBeDefined();
        expect(currentPair.template).not.toBe(previousTemplate);
        expect(currentPair.value).toBe('Current value');
        document.destroy();
    });
    it('982023 - should reuse cached template when cached value is unchanged', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string = field._getValue;
        const cachedTemplate: PdfTemplate = new PdfTemplate({
            x: 0,
            y: 0,
            width: 20,
            height: 20
        });
        const cachedPair: _PdfTemplateValuePair = {
            template: cachedTemplate,
            value: 'Cached value'
        };
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return 'Cached value';
        };
        field._templateValueMap.set(graphics, cachedPair);
        // Act
        field._performDraw(graphics, { x: 15, y: 25 });
        const resultPair: _PdfTemplateValuePair = field._templateValueMap.get(graphics);
        field._getValue = originalGetValue;
        // Assert
        expect(resultPair).toBe(cachedPair);
        expect(resultPair.template).toBe(cachedTemplate);
        expect(resultPair.value).toBe('Cached value');
        expect(field._templateValueMap.size).toBe(1);
        document.destroy();
    });
    it('982023 - should create and cache template when graphics has no cached value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string = field._getValue;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return 'New value';
        };
        // Act
        field._performDraw(graphics, { x: 20, y: 30 });
        const cachedPair: _PdfTemplateValuePair = field._templateValueMap.get(graphics);
        field._getValue = originalGetValue;
        // Assert
        expect(cachedPair).toBeDefined();
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.value).toBe('New value');
        expect(field._templateValueMap.size).toBe(1);
        document.destroy();
    });
    it('982023 - should render non-empty value in a complete template', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string = field._getValue;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return 'Rendered value';
        };
        // Act
        field._performDraw(graphics, { x: 25, y: 35 });
        const expectedSize: Size = field._obtainSize();
        const cachedPair: _PdfTemplateValuePair = field._templateValueMap.get(graphics);
        field._getValue = originalGetValue;
        // Assert
        expect(cachedPair).toBeDefined();
        expect(cachedPair.value).toBe('Rendered value');
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.template.graphics).toBeDefined();
        expect(cachedPair.template.size.width).toBe(expectedSize.width);
        expect(cachedPair.template.size.height).toBe(expectedSize.height);
        document.destroy();
    });
    it('982023 - should cache empty value without replacing resolved value', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string = field._getValue;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return '';
        };
        // Act
        field._performDraw(graphics, { x: 30, y: 40 });
        const expectedSize: Size = field._obtainSize();
        const cachedPair: _PdfTemplateValuePair = field._templateValueMap.get(graphics);
        field._getValue = originalGetValue;
        // Assert
        expect(cachedPair).toBeDefined();
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.template.graphics).toBeDefined();
        expect(cachedPair.template.size.width).toBe(expectedSize.width);
        expect(cachedPair.template.size.height).toBe(expectedSize.height);
        expect(cachedPair.value).toBe('');
        expect(field._templateValueMap.size).toBe(1);
        document.destroy();
    });
});
