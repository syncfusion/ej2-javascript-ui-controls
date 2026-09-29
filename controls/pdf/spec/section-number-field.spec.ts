import { PdfNumberStyle } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfSection } from '../src/pdf/core/pdf-section';
import { PdfSectionNumberField } from '../src/pdf/core/graphics/automatic-fields/section-number-field';
import { PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
import { _PdfTemplateValuePair, Size } from '../src/pdf/core/pdf-type';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';
import { PdfMultipleValueField } from '../src/pdf/core/graphics/automatic-fields/multiple-value-field';
describe('982023 PdfSectionNumberField constructor', () => {
    it('982023 - should preserve numberStyle supplied through constructor properties', () => {
        // Arrange
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const numberStyle: PdfNumberStyle = field.numberStyle;
        // Assert
        expect(numberStyle).toBe(PdfNumberStyle.lowerLatin);
    });
});
describe('982023 PdfSectionNumberField _getValue', () => {
    it('982023 - should return the second section number for a page with a valid page dictionary', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const secondSection: PdfSection = document.addSection();
        firstSection.addPage();
        const secondSectionPage: PdfPage = secondSection.addPage();
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const result: string = field._getValue(secondSectionPage.graphics);
        // Assert
        expect(result).toBe('b');
        document.destroy();
    });
    it('982023 - should return the first section number for a page in the first section', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const firstSectionPage: PdfPage = firstSection.addPage();
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const result: string = field._getValue(firstSectionPage.graphics);
        // Assert
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should return the default section number when the page dictionary is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const secondSection: PdfSection = document.addSection();
        firstSection.addPage();
        const secondSectionPage: PdfPage = secondSection.addPage();
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        const graphics: PdfGraphics = secondSectionPage.graphics;
        const pageDictionary = secondSectionPage._pageDictionary;
        secondSectionPage._pageDictionary = undefined;
        // Act
        const result: string = field._getValue(graphics);
        // Assert
        expect(result).toBe('a');
        // Restore
        secondSectionPage._pageDictionary = pageDictionary;
        document.destroy();
    });
});
describe('982023 PdfSectionNumberField mutation coverage', () => {
    it('982023 - should retain default number style when constructor numberStyle is undefined', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: undefined
        };
        // Act
        const field: PdfSectionNumberField =
            new PdfSectionNumberField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.numeric);
        expect((field as any)._numberStyle).toBe(PdfNumberStyle.numeric);
        expect((field as any)._numberStyle).not.toBeUndefined();
    });
    it('982023 - should return the first section number when section index is zero', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const firstSectionPage: PdfPage = firstSection.addPage();
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const sectionIndex: number = firstSectionPage._getSectionIndex();
        const result: string = field._getValue(firstSectionPage.graphics);
        // Assert
        expect(sectionIndex).toBe(0);
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should return the second section number from valid section branch', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        const secondSection: PdfSection = document.addSection();
        firstSection.addPage();
        const secondSectionPage: PdfPage = secondSection.addPage();
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.lowerLatin
        });
        // Act
        const sectionIndex: number = secondSectionPage._getSectionIndex();
        const result: string = field._getValue(secondSectionPage.graphics);
        // Assert
        expect(sectionIndex).toBe(1);
        expect(result).toBe('b');
        document.destroy();
    });
    it('982023 - should use valid section branch when section index equals zero', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfSectionNumberField = new PdfSectionNumberField({
            numberStyle: PdfNumberStyle.numeric
        });
        const originalGetSectionIndex: () => number =
            page._getSectionIndex;
        let conversionCount: number = 0;
        const boundarySectionIndex = {
            valueOf: (): number => {
                conversionCount++;
                return conversionCount === 1 ? 0 : 1;
            }
        };
        page._getSectionIndex = (): number => {
            return boundarySectionIndex as any;
        };
        // Act
        const result: string = field._getValue(graphics);
        page._getSectionIndex = originalGetSectionIndex;
        // Assert
        expect(conversionCount).toBe(2);
        expect(result).toBe('2');
        document.destroy();
    });
});
describe('982023 PdfMultipleValueField drawString mutation coverage', () => {
    it('982023 - should not call drawString when resolved value is empty', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string =
            field._getValue;
        const originalDrawString = PdfGraphics.prototype.drawString;
        let drawStringCount: number = 0;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return '';
        };
        PdfGraphics.prototype.drawString = function (): void {
            drawStringCount++;
        };
        // Act
        field._performDraw(graphics, { x: 30, y: 40 });
        const cachedPair: _PdfTemplateValuePair =
            field._templateValueMap.get(graphics)!;
        field._getValue = originalGetValue;
        PdfGraphics.prototype.drawString = originalDrawString;
        // Assert
        expect(drawStringCount).toBe(0);
        expect(cachedPair).toBeDefined();
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.value).toBe('');
        expect(field._templateValueMap.size).toBe(1);
        document.destroy();
    });
    it('982023 - should render non-empty value using complete template bounds', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string =
            field._getValue;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return 'Rendered value';
        };
        // Act
        field._performDraw(graphics, { x: 25, y: 35 });
        const cachedPair: _PdfTemplateValuePair =
            field._templateValueMap.get(graphics)!;
        const templateSize: Size = field._obtainSize();
        const expectedTemplate: PdfTemplate = new PdfTemplate({
            x: 0,
            y: 0,
            width: templateSize.width,
            height: templateSize.height
        });
        expectedTemplate.graphics.drawString(
            'Rendered value',
            field._obtainFont(),
            {
                x: 0,
                y: 0,
                width: templateSize.width,
                height: templateSize.height
            },
            field._obtainBrush()
        );
        const actualContentBytes: number[] =
            cachedPair.template._content._bytes;
        const expectedContentBytes: number[] =
            expectedTemplate._content._bytes;
        let actualContent: string = '';
        let expectedContent: string = '';
        for (let index: number = 0;
            index < actualContentBytes.length; index++) {
            actualContent += String.fromCharCode(
                actualContentBytes[index]
            );
        }
        for (let index: number = 0;
            index < expectedContentBytes.length; index++) {
            expectedContent += String.fromCharCode(
                expectedContentBytes[index]
            );
        }
        const resourceIdentifier: RegExp =
            /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
        const normalizedActualContent: string =
            actualContent.replace(resourceIdentifier, 'resource-id');
        const normalizedExpectedContent: string =
            expectedContent.replace(resourceIdentifier, 'resource-id');
        field._getValue = originalGetValue;
        // Assert
        expect(cachedPair).toBeDefined();
        expect(cachedPair.value).toBe('Rendered value');
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.template.size.width).toBe(templateSize.width);
        expect(cachedPair.template.size.height).toBe(templateSize.height);
        expect(actualContentBytes.length).toBeGreaterThan(42);
        expect(expectedContentBytes.length).toBeGreaterThan(42);
        expect(normalizedActualContent).toBe(
            normalizedExpectedContent
        );
        document.destroy();
    });
    it('982023 - should retain only template initialization content when value is empty', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        const originalGetValue: (currentGraphics: PdfGraphics) => string =
            field._getValue;
        field._getValue = (_currentGraphics: PdfGraphics): string => {
            return '';
        };
        // Act
        field._performDraw(graphics, { x: 30, y: 40 });
        const cachedPair: _PdfTemplateValuePair =
            field._templateValueMap.get(graphics)!;
        const templateSize: Size = field._obtainSize();
        const expectedTemplate: PdfTemplate = new PdfTemplate({
            x: 0,
            y: 0,
            width: templateSize.width,
            height: templateSize.height
        });
        const expectedGraphics: PdfGraphics =
            expectedTemplate.graphics;
        const actualContentBytes: number[] =
            cachedPair.template._content._bytes;
        const expectedContentBytes: number[] =
            expectedTemplate._content._bytes;
        let actualContent: string = '';
        let expectedContent: string = '';
        for (let index: number = 0;
            index < actualContentBytes.length; index++) {
            actualContent += String.fromCharCode(
                actualContentBytes[index]
            );
        }
        for (let index: number = 0;
            index < expectedContentBytes.length; index++) {
            expectedContent += String.fromCharCode(
                expectedContentBytes[index]
            );
        }
        field._getValue = originalGetValue;
        // Assert
        expect(cachedPair).toBeDefined();
        expect(cachedPair.template).toBeDefined();
        expect(cachedPair.value).toBe('');
        expect(expectedGraphics).toBeDefined();
        expect(actualContentBytes.length).toBe(42);
        expect(actualContentBytes.length).toBe(
            expectedContentBytes.length
        );
        expect(actualContent).toBe(expectedContent);
        expect(actualContent).toContain(
            '% Change co-ordinate system to left/top.'
        );
        expect(field._templateValueMap.size).toBe(1);
        document.destroy();
    });
});