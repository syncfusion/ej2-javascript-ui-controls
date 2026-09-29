import { PdfNumberStyle } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfSection } from '../src/pdf/core/pdf-section';
import { PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfSectionPageCountField } from
    '../src/pdf/core/graphics/automatic-fields/section-page-count-field';
describe('982023 PdfSectionPageCountField constructor mutation coverage', () => {
    it('982023 - should retain default number style when constructor number style is undefined', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: undefined
        };
        // Act
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).not.toBeUndefined();
    });
});
describe('982023 PdfSectionPageCountField _getValue mutation coverage', () => {
    it('982023 - should return complete page count for valid graphics and section', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        section.addPage();
        section.addPage();
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const sectionIndex: number = firstPage._getSectionIndex();
        const result: string =
            field._getValue(firstPage.graphics);
        // Assert
        expect(sectionIndex).toBe(0);
        expect(section._pageCount).toBe(3);
        expect(result).toBe('3');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should format complete section page count using configured number style', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        section.addPage();
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const result: string =
            field._getValue(firstPage.graphics);
        // Assert
        expect(section._pageCount).toBe(2);
        expect(result).toBe('b');
        expect(result).not.toBe('a');
        document.destroy();
    });
    it('982023 - should return default count when graphics is unavailable', () => {
        // Arrange
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const result: string =
            field._getValue(null);
        // Assert
        expect(result).toBe('a');
    });
    it('982023 - should return default count when graphics has no page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const originalGetPageFromGraphics:
            (currentGraphics: PdfGraphics) => PdfPage =
            field._getPageFromGraphics;
        field._getPageFromGraphics =
            (_currentGraphics: PdfGraphics): PdfPage => {
                return null;
            };
        // Act
        const result: string =
            field._getValue(graphics);
        field._getPageFromGraphics =
            originalGetPageFromGraphics;
        // Assert
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should use section page count when first section index is zero', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        section.addPage();
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const sectionIndex: number =
            firstPage._getSectionIndex();
        const result: string =
            field._getValue(firstPage.graphics);
        // Assert
        expect(sectionIndex).toBe(0);
        expect(section._pageCount).toBe(2);
        expect(result).toBe('2');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should return default count when section index is negative', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        section.addPage();
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.numeric
            });
        const originalGetSectionIndex: () => number =
            page._getSectionIndex;
        page._getSectionIndex = (): number => {
            return -1;
        };
        document._sections[-1] = section;
        // Act
        const result: string =
            field._getValue(page.graphics);
        page._getSectionIndex = originalGetSectionIndex;
        delete document._sections[-1];
        // Assert
        expect(section._pageCount).toBe(2);
        expect(result).toBe('1');
        expect(result).not.toBe('2');
        document.destroy();
    });
    it('982023 - should return default count when resolved section is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const secondSection: PdfSection = document.addSection();
        firstSection.addPage();
        const secondSectionPage: PdfPage =
            secondSection.addPage();
        secondSection.addPage();
        const field: PdfSectionPageCountField =
            new PdfSectionPageCountField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const sectionIndex: number =
            secondSectionPage._getSectionIndex();
        const originalSection: PdfSection =
            document._sections[sectionIndex];
        document._sections[sectionIndex] = undefined;
        // Act
        const result: string =
            field._getValue(secondSectionPage.graphics);
        document._sections[sectionIndex] = originalSection;
        // Assert
        expect(sectionIndex).toBe(1);
        expect(result).toBe('a');
        document.destroy();
    });
});