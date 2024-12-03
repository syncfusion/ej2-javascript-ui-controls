/**
 * spec document for PdfStringLayouter.ts class
 */
import { PdfStringLayoutResult, PdfPage, PdfPageSettings } from "../../../../../src/index";
import { PdfStringLayouter, PdfStandardFont, PdfFontFamily, PdfStringFormat } from "../../../../../src/index";
import { RectangleF, PointF, SizeF, PdfWordWrapType } from "../../../../../src/index";

describe('PdfStringLayouter.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfStringLayouter = new PdfStringLayouter();
        let t2 : PdfStringLayoutResult;
        let fontFamily : PdfFontFamily.Courier;
        let page : PdfPageSettings = new PdfPageSettings();
        let font : PdfStandardFont = new PdfStandardFont(fontFamily, 10);
        let font1 : PdfStandardFont = new PdfStandardFont(fontFamily, 100);
        let format : PdfStringFormat = new PdfStringFormat('alignment');
        let rect : RectangleF = new RectangleF(new PointF(10, 20), new SizeF(20, 20));
        it('-text == null', () => {
            expect(function (): void {t2 = t1.layout(null, font, format, new SizeF(20, 20), false, new SizeF(0, 0))}).toThrowError();
        })
        it('-font == null', () => {
            expect(function (): void {t2 = t1.layout('test', null, format, new SizeF(20, 20), false, new SizeF(0, 0))}).toThrowError();
        })
        it('-text == empty string', () => {
            expect(function (): void {t2 = t1.layout('', font, format, new SizeF(20, 20), false, new SizeF(0, 0))}).not.toThrowError();
        })
        it('-text == testing with size(0,0)', () => {
            expect(function (): void {t2 = t1.layout('testing', font, format, new SizeF(0,0), false, new SizeF(0, 0))}).not.toThrowError();
        })
        it('-text == size.height < font.size', () => {
            expect(function (): void {t2 = t1.layout('testing', font, format, new RectangleF(40, 600, 100, 40), false, new SizeF(0, 0))}).not.toThrowError();
        })
        it('-text == size.height < font.size', () => {
            let format2 : PdfStringFormat = new PdfStringFormat('alignment');
            format2.wordWrap = PdfWordWrapType.None;
            expect(function (): void {t2 = t1.layout('testing With Testing With Testing, testing With Testing With Testing', font, format2, new RectangleF(40, 600, 100, 40), false, new SizeF(0, 0))}).not.toThrowError();
        })
    })
})