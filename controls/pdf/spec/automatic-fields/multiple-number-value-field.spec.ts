import { PdfMultipleNumberValueField } from
    '../../src/pdf/core/graphics/automatic-fields/multiple-number-value-field';
import {
    PdfCrossReferenceType,
    PdfNumberStyle
} from '../../src/pdf/core/enumerator';
import { PdfFileStructure } from '../../src/pdf/core/pdf-file-structure';
describe('PdfMultipleNumberValueField property mutations', () => {
    it('numberStyle getter returns the value assigned by the setter', () => {
        // Arrange
        const numberValueField: PdfMultipleNumberValueField =
            new PdfMultipleNumberValueField();
        const previousNumberStyle: PdfNumberStyle =
            numberValueField.numberStyle;
        const expectedNumberStyle: PdfNumberStyle =
            PdfNumberStyle.upperRoman;
        // Act
        numberValueField.numberStyle = expectedNumberStyle;
        // Assert
        expect(numberValueField.numberStyle).toBe(
            PdfNumberStyle.upperRoman
        );
        expect(numberValueField.numberStyle).toBe(
            expectedNumberStyle
        );
        expect(numberValueField._numberStyle).toBe(
            expectedNumberStyle
        );
        // Restore
        numberValueField.numberStyle = previousNumberStyle;
        expect(numberValueField.numberStyle).toBe(
            previousNumberStyle
        );
        expect(numberValueField._numberStyle).toBe(
            previousNumberStyle
        );
    });
    it('numberStyle setter updates each assigned number style', () => {
        // Arrange
        const numberValueField: PdfMultipleNumberValueField =
            new PdfMultipleNumberValueField();
        const previousNumberStyle: PdfNumberStyle =
            numberValueField.numberStyle;
        // Act
        numberValueField.numberStyle = PdfNumberStyle.lowerRoman;
        // Assert
        expect(numberValueField.numberStyle).toBe(
            PdfNumberStyle.lowerRoman
        );
        expect(numberValueField._numberStyle).toBe(
            PdfNumberStyle.lowerRoman
        );
        // Act
        numberValueField.numberStyle = PdfNumberStyle.upperRoman;
        // Assert
        expect(numberValueField.numberStyle).toBe(
            PdfNumberStyle.upperRoman
        );
        expect(numberValueField._numberStyle).toBe(
            PdfNumberStyle.upperRoman
        );
        // Restore
        numberValueField.numberStyle = previousNumberStyle;
        expect(numberValueField.numberStyle).toBe(
            previousNumberStyle
        );
        expect(numberValueField._numberStyle).toBe(
            previousNumberStyle
        );
    });
    it('numberStyle getter returns the value assigned through the setter', () => {
        // Arrange
        const numberValueField: PdfMultipleNumberValueField =
            new PdfMultipleNumberValueField();
        const previousNumberStyle: PdfNumberStyle =
            numberValueField.numberStyle;
        // Act
        numberValueField.numberStyle = PdfNumberStyle.upperRoman;
        // Assert
        expect(numberValueField.numberStyle).toBe(
            PdfNumberStyle.upperRoman
        );
        expect(numberValueField._numberStyle).toBe(
            PdfNumberStyle.upperRoman
        );
        // Act
        numberValueField.numberStyle = PdfNumberStyle.lowerRoman;
        // Assert
        expect(numberValueField.numberStyle).toBe(
            PdfNumberStyle.lowerRoman
        );
        expect(numberValueField._numberStyle).toBe(
            PdfNumberStyle.lowerRoman
        );
        // Restore
        numberValueField.numberStyle = previousNumberStyle;
        expect(numberValueField.numberStyle).toBe(
            previousNumberStyle
        );
        expect(numberValueField._numberStyle).toBe(
            previousNumberStyle
        );
    });
});