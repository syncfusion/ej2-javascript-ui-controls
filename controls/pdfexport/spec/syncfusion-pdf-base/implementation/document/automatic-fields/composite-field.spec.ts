/**
 * spec document for PdfCompositeField.ts class
 */
import { PdfCompositeField } from '../../../../../src/implementation/document/automatic-fields/composite-field';
import { PdfPageNumberField } from '../../../../../src/implementation/document/automatic-fields/pdf-page-number-field';
import { PdfPageCountField } from '../../../../../src/implementation/document/automatic-fields/page-count-field';
import { PdfFont, PdfFontFamily, PdfStandardFont, PdfSolidBrush, RectangleF, PointF, SizeF } from '../../../../../src/index';
import { PdfStringFormat, PdfTextAlignment, PdfPage, PdfColor } from '../../../../../src/index';
import { PdfDocument, PdfNumberStyle, PdfPen } from '../../../../../src/index';
describe('PdfCompositeField.ts',()=> {
    describe('Constructor initializing',()=> {
        //Create a new document.
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        document.pages.add();
        document.pages.add();
        document.pages.add();
        //Create a new font.
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let compositeField : PdfCompositeField = new PdfCompositeField(font, brush, "Page {0} of {1}", null);
        compositeField.bounds = new RectangleF(0, 0, 500, 100);
        // Draw page number for each page in the pages array.
        for (let i : number = 0; i < document.pages.count; i++) {
            compositeField.draw(document.pages.getPageByIndex(i).graphics, new PointF(10, 20));
        }
        it('compositeField.getValue(page.graphics) - composite field with null', () => {
            expect(function (): void {compositeField.getValue(page.graphics)}).toThrowError();
        })
        it('compositeField.getValue(page.graphics) - automatic fields as null', () => {
            compositeField.automaticFields = null;
            expect(compositeField.getValue(page.graphics)).toEqual('Page {0} of {1}');
        })
        let compositeField2 : PdfCompositeField = new PdfCompositeField(font, brush, "Page {0} of {1}", null);
        compositeField2.bounds = new RectangleF(0, 0, 500, 100);
        it('compositeField.getValue(page.graphics) - composite field with text as "testing"', () => {
            compositeField2.text = 'testing';
            compositeField2.automaticFields = null;
            expect(compositeField2.getValue(page.graphics)).toEqual('testing');
        })
    })
})