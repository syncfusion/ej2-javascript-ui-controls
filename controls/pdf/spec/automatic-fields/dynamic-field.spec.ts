import { PdfDocument } from '../../src/pdf/core/pdf-document';
import { PdfPage } from '../../src/pdf/core/pdf-page';
import { PdfMultipleValueField } from '../../src/pdf/core/graphics/automatic-fields/multiple-value-field';
describe('982023 PdfDynamicField _getPageFromGraphics', () => {
    it('982023 - should return the exact page associated with graphics', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const field: PdfMultipleValueField = new PdfMultipleValueField();
        // Act
        const firstResult: PdfPage =
            field._getPageFromGraphics(firstPage.graphics);
        const secondResult: PdfPage =
            field._getPageFromGraphics(secondPage.graphics);
        // Assert
        expect(firstResult).toBe(firstPage);
        expect(firstResult).not.toBe(secondPage);
        expect(secondResult).toBe(secondPage);
        expect(secondResult).not.toBe(firstPage);
        document.destroy();
    });
});