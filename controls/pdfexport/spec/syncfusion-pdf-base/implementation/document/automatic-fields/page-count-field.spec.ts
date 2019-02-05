/**
 * spec document for PageCountField.ts class
 */
import { PdfPageCountField } from '../../../../../src/implementation/document/automatic-fields/page-count-field';
import { PdfFont, PdfFontFamily, PdfStandardFont, PdfSolidBrush, RectangleF, PointF, SizeF } from '../../../../../src/index';
import { PdfStringFormat, PdfTextAlignment, PdfPage, PdfColor } from '../../../../../src/index';
import { PdfDocument, PdfNumberStyle, PdfPen } from '../../../../../src/index';
describe('PageCountField.ts',()=> {
    describe('Constructor initializing',()=> {
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let pageCount1 : PdfPageCountField = new PdfPageCountField(font);
        let pageCount2 : PdfPageCountField = new PdfPageCountField(font, new PdfSolidBrush(new PdfColor(0, 128, 0)));
        let pageCount3 : PdfPageCountField = new PdfPageCountField(font, new RectangleF(10, 10, 50, 20));
        let pageCount4 : PdfPageCountField = new PdfPageCountField(font);
        it('Set Font(null)', () => {
            pageCount4.font = null;
            expect(pageCount4.font).toBeNull();
        })
        it('Set Pen(null)', () => {
            pageCount4.pen = null;
            expect(pageCount4.pen).toBeNull();
        })
        it('Set Brush(null)', () => {
            pageCount4.brush = null;
            expect(pageCount4.brush).toBeNull();
        })
        it('Set Size(null)', () => {
            pageCount4.size = new SizeF(10, 20);
            expect(pageCount4.size).not.toBeUndefined();
        })
        it('Set Location(null)', () => {
            pageCount4.location = new PointF(10, 20);
            expect(pageCount4.location).not.toBeUndefined();
        })
        it('Set StringFormat(format)', () => {
            let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
            pageCount4.stringFormat = format;
            expect(pageCount4.stringFormat).not.toBeUndefined();
        })
        it('-pageCount1.draw(null); - thrown error', () => {
            expect(function (): void {pageCount1.draw(null); }).toThrowError();
        })
        it('-pageCount1.draw(null, new PointF(10, 20)); - thrown error', () => {
            expect(function (): void {pageCount1.draw(null, new PointF(10, 20)); }).toThrowError();
        })
        let document : PdfDocument = new PdfDocument();
        let pageCount : PdfPageCountField = new PdfPageCountField(font, new PdfSolidBrush(new PdfColor(127, 255, 212)));
        pageCount.numberStyle = PdfNumberStyle.LowerLatin;
        for (let i : number = 0; i < 2; i++) {
            let page : PdfPage = document.pages.add();
            pageCount.draw(page.graphics, 10, 20);
        }
        let page1 : PdfPage = document.pages.add();
        it('-pageCount.performDraw(page.graphics, new PointF(10, 20), 2, 3) with width of 0 - thrown error', () => {
            pageCount.bounds = new RectangleF(0, 0, 0, 10)
            expect(function (): void {pageCount.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).toThrowError();
        })
        it('-pageCount.performDraw(page.graphics, new PointF(10, 20), 2, 3) with width of 20 - thrown error', () => {
            pageCount.bounds = new RectangleF(0, 0, 20, 10)
            expect(function (): void {pageCount.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
        it('GetBrush(null)', () => {
            pageCount4.brush = null;
            expect(function (): void {pageCount4.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
        it('GetFont(null)', () => {
            pageCount4.font = null;
            expect(function (): void {pageCount4.performDraw(page1.graphics, new PointF(10, 20), 2, 3); }).not.toThrowError();
        })
    })
})