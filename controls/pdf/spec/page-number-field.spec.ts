import { PdfNumberStyle } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfPageNumberField } from
    '../src/pdf/core/graphics/automatic-fields/page-number-field';
describe('982023 PdfPageNumberField constructor mutation coverage', () => {
    it('982023 - should preserve number style supplied through constructor properties', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: PdfNumberStyle.lowerLatin
        };
        // Act
        const field: PdfPageNumberField =
            new PdfPageNumberField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.lowerLatin);
        expect(field._numberStyle).toBe(PdfNumberStyle.lowerLatin);
    });
    it('982023 - should retain default number style when constructor number style is undefined', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: undefined
        };
        // Act
        const field: PdfPageNumberField =
            new PdfPageNumberField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).not.toBeUndefined();
    });
});
describe('982023 PdfPageNumberField _getValue mutation coverage', () => {
    it('982023 - should return second page number for valid graphics and page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const graphics: PdfGraphics = secondPage.graphics;
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        // Act
        const result: string = field._getValue(graphics);
        // Assert
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe('2');
        document.destroy();
    });
    it('982023 - should return default page number when graphics is unavailable', () => {
        // Arrange
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const result: string = field._getValue(null);
        // Assert
        expect(result).toBe('1');
    });
    it('982023 - should return default page number when graphics has no page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        const originalGetPageFromGraphics:
            (currentGraphics: PdfGraphics) => PdfPage =
            field._getPageFromGraphics;
        field._getPageFromGraphics =
            (_currentGraphics: PdfGraphics): PdfPage => {
                return null;
            };
        // Act
        const result: string = field._getValue(graphics);
        field._getPageFromGraphics = originalGetPageFromGraphics;
        // Assert
        expect(result).toBe('1');
        document.destroy();
    });
    it('982023 - should return default page number when page cross reference is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const graphics: PdfGraphics = secondPage.graphics;
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        const originalCrossReference = secondPage._crossReference;
        secondPage._crossReference = null;
        // Act
        const result: string = field._getValue(graphics);
        secondPage._crossReference = originalCrossReference;
        // Assert
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe('1');
        document.destroy();
    });
    it('982023 - should return default page number when cross reference document is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const graphics: PdfGraphics = secondPage.graphics;
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        const crossReference = secondPage._crossReference;
        const originalDocument: PdfDocument =
            crossReference._document as PdfDocument;
        crossReference._document = null;
        // Act
        const result: string = field._getValue(graphics);
        crossReference._document = originalDocument;
        // Assert
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe('1');
        document.destroy();
    });
});
describe('982023 PdfPageNumberField _internalLoadedGetValue mutation coverage', () => {
    it('982023 - should return second page number for a valid loaded page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        // Act
        const result: string =
            field._internalLoadedGetValue(secondPage);
        // Assert
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe('2');
        expect(result).not.toBe('0');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should apply configured number style to loaded page number', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const result: string =
            field._internalLoadedGetValue(secondPage);
        // Assert
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe('b');
        expect(result).not.toBe('a');
        document.destroy();
    });
    it('982023 - should return default page number when loaded page is unavailable', () => {
        // Arrange
        const field: PdfPageNumberField = new PdfPageNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const result: string =
            field._internalLoadedGetValue(null);
        // Assert
        expect(result).toBe('1');
    });
});