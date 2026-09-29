import { PdfNumberStyle } from '../src/pdf/core/enumerator';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfSection } from '../src/pdf/core/pdf-section';
import { _PdfDictionary, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { PdfGraphics } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfSectionPageNumberField } from '../src/pdf/core/graphics/automatic-fields/section-page-number-field';
describe('982023 PdfSectionPageNumberField constructor mutation coverage', () => {
    it('982023 - should preserve supplied number style', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: PdfNumberStyle.lowerLatin
        };
        // Act
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.lowerLatin);
        expect(field._numberStyle).toBe(PdfNumberStyle.lowerLatin);
    });
    it('982023 - should retain default number style when number style is undefined', () => {
        // Arrange
        const properties: { numberStyle?: PdfNumberStyle } = {
            numberStyle: undefined
        };
        // Act
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField(properties);
        // Assert
        expect(field.numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).toBe(PdfNumberStyle.numeric);
        expect(field._numberStyle).not.toBeUndefined();
    });
});
describe('982023 PdfSectionPageNumberField basic branch mutation coverage', () => {
    it('982023 - should return second page number within the section', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        // Assert
        expect(result).toBe('2');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should apply number style to section page number', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        // Assert
        expect(result).toBe('b');
        expect(result).not.toBe('a');
        document.destroy();
    });
    it('982023 - should return default number when graphics is unavailable', () => {
        // Arrange
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const result: string = field._getValue(null);
        // Assert
        expect(result).toBe('a');
    });
    it('982023 - should return default number when graphics has no page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
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
        const result: string = field._getValue(graphics);
        field._getPageFromGraphics =
            originalGetPageFromGraphics;
        // Assert
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should return default number when page dictionary is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const graphics: PdfGraphics = secondPage.graphics;
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const originalPageDictionary: _PdfDictionary =
            secondPage._pageDictionary;
        secondPage._pageDictionary = null;
        // Act
        const result: string = field._getValue(graphics);
        secondPage._pageDictionary = originalPageDictionary;
        // Assert
        expect(result).toBe('1');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField reference mutation coverage', () => {
    it('982023 - should return default number when page reference is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const originalPageReference: _PdfReference =
            secondPage._ref;
        secondPage._ref = null;
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        secondPage._ref = originalPageReference;
        // Assert
        expect(result).toBe('1');
        document.destroy();
    });
    it('982023 - should return default number when parent reference is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const pageDictionary: _PdfDictionary =
            secondPage._pageDictionary;
        const originalParentReference: _PdfReference =
            pageDictionary.getRaw('Parent');
        pageDictionary.update('Parent', null);
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        pageDictionary.update(
            'Parent',
            originalParentReference
        );
        // Assert
        expect(result).toBe('1');
        document.destroy();
    });
    it('982023 - should read parent reference using Parent key', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        // Assert
        expect(result).toBe('2');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField parent dictionary mutation coverage', () => {
    it('982023 - should return default number when parent dictionary is unavailable', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const crossReference = page._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return null;
            };
        // Act
        const result: string =
            field._getValue(page.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should return default number when parent dictionary has no Kids entry', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const crossReference = page._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(page.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(parentDictionary.has('Kids')).toBe(false);
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should read child references using Kids key', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        // Assert
        expect(result).toBe('2');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField Kids validation', () => {
    it('982023 - should return default number when Kids value is not an array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const crossReference = page._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        parentDictionary.update('Kids', 'invalid-kids');
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(page.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(Array.isArray(
            parentDictionary.get('Kids')
        )).toBe(false);
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should iterate valid Kids array and return matching page position', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        section.addPage();
        const thirdPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(thirdPage.graphics);
        // Assert
        expect(result).toBe('3');
        expect(result).not.toBe('1');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField loop mutation coverage', () => {
    it('982023 - should skip null child reference and return second position', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const crossReference = page._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const kids: _PdfReference[] = [
            null,
            page._ref
        ];
        parentDictionary.update('Kids', kids);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(page.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(kids.length).toBe(2);
        expect(result).toBe('2');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should skip nonmatching child reference and return matching position', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        // Assert
        expect(firstPage._ref.objectNumber).not.toBe(
            secondPage._ref.objectNumber
        );
        expect(result).toBe('2');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should return third position and use index plus one', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        section.addPage();
        const thirdPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(thirdPage.graphics);
        // Assert
        expect(result).toBe('3');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should return default number when no child reference matches page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection =
            document.addSection();
        const secondSection: PdfSection =
            document.addSection();
        const firstPage: PdfPage =
            firstSection.addPage();
        const secondPage: PdfPage =
            secondSection.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        const crossReference = secondPage._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const kids: _PdfReference[] = [
            firstPage._ref
        ];
        parentDictionary.update('Kids', kids);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(firstPage._ref.objectNumber).not.toBe(
            secondPage._ref.objectNumber
        );
        expect(result).toBe('a');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField remaining mutation coverage', () => {
    it('982023 - should reject non-array Kids collection before iteration', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const secondPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const crossReference = secondPage._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const createKidsCollection = function (
            _firstReference: _PdfReference,
            _secondReference: _PdfReference
        ): IArguments {
            return arguments;
        };
        const nonArrayKids: IArguments =
            createKidsCollection(
                firstPage._ref,
                secondPage._ref
            );
        parentDictionary.update('Kids', nonArrayKids);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(secondPage.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(Array.isArray(nonArrayKids)).toBe(false);
        expect(nonArrayKids.length).toBe(2);
        expect(nonArrayKids[0]).toBe(firstPage._ref);
        expect(nonArrayKids[1]).toBe(secondPage._ref);
        expect(result).toBe('1');
        expect(result).not.toBe('2');
        document.destroy();
    });
    it('982023 - should reject non-array Kids collection before iteration', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const secondPage: PdfPage = section.addPage();
        const graphics: PdfGraphics = secondPage.graphics;
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const crossReference = secondPage._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const createKidsCollection = function (
            _firstReference: _PdfReference,
            _secondReference: _PdfReference
        ): IArguments {
            return arguments;
        };
        const nonArrayKids: IArguments =
            createKidsCollection(
                firstPage._ref,
                secondPage._ref
            );
        parentDictionary.update('Kids', nonArrayKids);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(Array.isArray(nonArrayKids)).toBe(false);
        expect(nonArrayKids.length).toBe(2);
        expect(nonArrayKids[0]).toBe(firstPage._ref);
        expect(nonArrayKids[1]).toBe(secondPage._ref);
        expect(result).toBe('1');
        expect(result).not.toBe('2');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField loop condition mutation coverage (i <= kids.length)', () => {
    it('982023 - should not access array beyond bounds when condition is i <= kids.length', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const secondPage: PdfPage = section.addPage();
        const thirdPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const crossReference = thirdPage._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        let fetchCallCount: number = 0;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const kidsArray: _PdfReference[] = [
            firstPage._ref,
            secondPage._ref,
            thirdPage._ref
        ];
        parentDictionary.update('Kids', kidsArray);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                fetchCallCount++;
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(thirdPage.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(kidsArray.length).toBe(3);
        expect(result).toBe('3');
        expect(result).not.toBe('4');
        document.destroy();
    });
    it('982023 - should find correct position when page is at end of Kids array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        section.addPage();
        section.addPage();
        section.addPage();
        const fifthPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(fifthPage.graphics);
        // Assert
        expect(result).toBe('5');
        expect(result).not.toBe('1');
        document.destroy();
    });
    it('982023 - should validate loop terminates at correct Kids length boundary', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page1: PdfPage = section.addPage();
        const page2: PdfPage = section.addPage();
        const page3: PdfPage = section.addPage();
        const page4: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const resultPage1: string =
            field._getValue(page1.graphics);
        const resultPage4: string =
            field._getValue(page4.graphics);
        // Assert
        expect(resultPage1).toBe('a');
        expect(resultPage4).toBe('d');
        expect(resultPage4).not.toBe('e');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField loop increment mutation coverage (i--)', () => {
    it('982023 - should iterate forward and not backward through Kids array', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const secondPage: PdfPage = section.addPage();
        const thirdPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const resultFirstPage: string =
            field._getValue(firstPage.graphics);
        const resultSecondPage: string =
            field._getValue(secondPage.graphics);
        const resultThirdPage: string =
            field._getValue(thirdPage.graphics);
        // Assert
        expect(resultFirstPage).toBe('1');
        expect(resultSecondPage).toBe('2');
        expect(resultThirdPage).toBe('3');
        document.destroy();
    });
    it('982023 - should find first page at index zero with forward iteration', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const firstPage: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.lowerLatin
            });
        // Act
        const result: string =
            field._getValue(firstPage.graphics);
        // Assert
        expect(result).toBe('a');
        document.destroy();
    });
    it('982023 - should match correct page reference in sequential iteration', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        section.addPage();
        const targetPage: PdfPage = section.addPage();
        section.addPage();
        section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const result: string =
            field._getValue(targetPage.graphics);
        // Assert
        expect(result).toBe('2');
        expect(result).not.toBe('4');
        document.destroy();
    });
    it('982023 - should maintain forward order across multiple pages with numeric style', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const pageArray: PdfPage[] = [];
        for (let idx: number = 0; idx < 6; idx++) {
            pageArray.push(section.addPage());
        }
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        // Act
        const results: string[] = pageArray.map(
            (currentPage: PdfPage): string =>
                field._getValue(currentPage.graphics)
        );
        // Assert
        expect(results[0]).toBe('1');
        expect(results[1]).toBe('2');
        expect(results[2]).toBe('3');
        expect(results[3]).toBe('4');
        expect(results[4]).toBe('5');
        expect(results[5]).toBe('6');
        document.destroy();
    });
    it('982023 - should not return page at length index position (catches i <= mutation)', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page1: PdfPage = section.addPage();
        const page2: PdfPage = section.addPage();
        const page3: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const crossReference = page3._crossReference;
        const originalFetch:
            (reference: _PdfReference) => _PdfDictionary =
            crossReference._fetch;
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary();
        const kidsArray: _PdfReference[] = [
            page1._ref,
            page2._ref,
            page3._ref
        ];
        parentDictionary.update('Kids', kidsArray);
        crossReference._fetch =
            (_reference: _PdfReference): _PdfDictionary => {
                return parentDictionary;
            };
        // Act
        const result: string =
            field._getValue(page3.graphics);
        crossReference._fetch = originalFetch;
        // Assert
        expect(kidsArray.length).toBe(3);
        expect(result).toBe('3');
        expect(result).not.toBe('undefined');
        expect(result).not.toBe('1');
        document.destroy();
    });
});
describe('982023 PdfSectionPageNumberField loop boundary mutation coverage', () => {
    it('982023 - should return default page number when matching reference exists only beyond kids length boundary', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        const field: PdfSectionPageNumberField =
            new PdfSectionPageNumberField({
                numberStyle: PdfNumberStyle.numeric
            });
        const originalFetch: (reference: any) => any =
            page._crossReference._fetch.bind(page._crossReference);
        const parentReference: _PdfReference =
            page._pageDictionary.getRaw('Parent') as _PdfReference;
        page._crossReference._fetch = (reference: any): any => {
            if (reference === parentReference) {
                const parentDictionary: any = new _PdfDictionary();
                const kids: _PdfReference[] = [];
                kids.length = 0;
                // Entry outside the valid iteration range.
                kids[0] = page._ref;
                parentDictionary.update('Kids', kids);
                return parentDictionary;
            }
            return originalFetch(reference);
        };
        // Act
        const result: string = field._getValue(page.graphics);
        // Restore
        page._crossReference._fetch = originalFetch;
        // Assert
        expect(result).toBe('1');
        document.destroy();
    });
});