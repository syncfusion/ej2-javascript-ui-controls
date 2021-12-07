/**
 * spec document for PdfPageNumberField.ts class
 */
import { PdfPageNumberField } from '../../../../../src/implementation/document/automatic-fields/pdf-page-number-field';
import { PdfFont, PdfFontFamily, PdfStandardFont, PdfSolidBrush, RectangleF, PointF, SizeF } from '../../../../../src/index';
import { PdfStringFormat, PdfTextAlignment, PdfPage, PdfColor } from '../../../../../src/index';
import { PdfDocument, PdfNumberStyle, PdfPen } from '../../../../../src/index';
describe('PdfPageNumberField.ts',()=> {
    describe('Constructor initializing',()=> {
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let pageNumber1 : PdfPageNumberField = new PdfPageNumberField(font);
        let pageNumber2 : PdfPageNumberField = new PdfPageNumberField(font, new PdfSolidBrush(new PdfColor(0, 128, 0)));
        let pageNumber3 : PdfPageNumberField = new PdfPageNumberField(font, new RectangleF(10, 10, 50, 20));
        let pageNumber4 : PdfPageNumberField = new PdfPageNumberField(font);
        it('Set Font(null)', () => {
            pageNumber4.font = null;
            expect(pageNumber4.font).toBeNull();
        })
        it('Set Pen(null)', () => {
            pageNumber4.pen = null;
            expect(pageNumber4.pen).toBeNull();
        })
        it('Set Brush(null)', () => {
            pageNumber4.brush = null;
            expect(pageNumber4.brush).toBeNull();
        })
        it('Set Size(null)', () => {
            pageNumber4.size = new SizeF(10, 20);
            expect(pageNumber4.size).not.toBeUndefined();
        })
        it('Set Location(null)', () => {
            pageNumber4.location = new PointF(10, 20);
            expect(pageNumber4.location).not.toBeUndefined();
        })
        it('Set StringFormat(format)', () => {
            let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
            pageNumber4.stringFormat = format;
            expect(pageNumber4.stringFormat).not.toBeUndefined();
        })
        it('-pageNumber1.draw(null); - thrown error', () => {
            expect(function (): void {pageNumber1.draw(null); }).toThrowError();
        })
        it('-pageNumber1.draw(null, new PointF(10, 20)); - thrown error', () => {
            expect(function (): void {pageNumber1.draw(null, new PointF(10, 20)); }).toThrowError();
        })
        let document : PdfDocument = new PdfDocument();
        let pageNumber : PdfPageNumberField = new PdfPageNumberField(font, new PdfSolidBrush(new PdfColor(127, 255, 212)));
        pageNumber.numberStyle = PdfNumberStyle.LowerLatin;
        for (let i : number = 0; i < 2; i++) {
            let page : PdfPage = document.pages.add();
            pageNumber.draw(page.graphics, 10, 20);
        }
        let page1 : PdfPage = document.pages.add();
        it('-pageNumber.performDraw(page.graphics, new PointF(10, 20), 2, 3); - thrown error', () => {
            pageNumber.bounds = new RectangleF(0, 0, 0, 10)
            expect(function (): void {pageNumber.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).toThrowError();
        })
        it('-pageNumber.performDraw(page.graphics, new PointF(10, 20), 2, 3) - thrown error', () => {
            pageNumber.bounds = new RectangleF(0, 0, 20, 10)
            expect(function (): void {pageNumber.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
        it('GetBrush(null)', () => {
            pageNumber4.brush = null;
            expect(function (): void {pageNumber4.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
        it('GetFont(null)', () => {
            pageNumber4.font = null;
            expect(function (): void {pageNumber4.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
    })
})