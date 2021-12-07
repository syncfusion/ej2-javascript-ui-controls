/**
 * spec document for PdfTextWebLink.ts class
 */

import { PdfTextWebLink, PointF, PdfFontFamily, PdfStringFormat, PdfColor, RectangleF, SizeF } from "../../../../src/implementation/index";
import { PdfDocument, PdfPage, PdfGraphics, PdfStandardFont, PdfWordWrapType, PdfSolidBrush } from "../../../../src/index";

describe('PdfTextWebLink.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfTextWebLink = new PdfTextWebLink();
        it('-Url != undefined', () => {
            expect(t1.url).not.toBeUndefined();
        })
        it('-Set Url', () => {
            t1.url = 'www.google.com';
            expect(t1.url).toEqual('www.google.com');
        })
        it('Set Url', () => {
            expect(function (): void {t1.url = ''; }).toThrowError();
        })
        let document1 : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document1.pages.add();
        let graphics : PdfGraphics = page1.graphics;
        let font1 : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 12);
        t1.text = 'test';
        t1.font = font1;
        t1.draw(page1, new PointF(10, 10));
        t1.draw(graphics, new PointF(10, 10));

        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let stringFormat1 : PdfStringFormat = new PdfStringFormat();
        stringFormat1.wordWrap = PdfWordWrapType.Word;
        let hyperlink01 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink01.font = font;
        hyperlink01.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink01.stringFormat = stringFormat1;
        hyperlink01.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink01.url = 'https://www.syncfusion.com/';
        hyperlink01.draw
        hyperlink01.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
        let hyperlink02 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink02.font = font;
        hyperlink02.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink02.stringFormat = stringFormat1;
        hyperlink02.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink02.url = 'https://www.syncfusion.com/';
        hyperlink02.draw(page, new PointF(20, 300));
        let hyperlink03 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink03.font = font;
        hyperlink03.text = 'Syncfusion';
        hyperlink03.stringFormat = stringFormat1;
        hyperlink03.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink03.url = 'https://www.syncfusion.com/';
        hyperlink03.draw(page, new PointF(20, 300));
        let hyperlink04 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink04.font = font;
        hyperlink04.text = 'Syncfusion';
        hyperlink04.stringFormat = stringFormat1;
        hyperlink04.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink04.url = 'https://www.syncfusion.com/';
        hyperlink04.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
        let stringFormat2 : PdfStringFormat = new PdfStringFormat();
        stringFormat2.wordWrap = PdfWordWrapType.Character;
        let hyperlink11 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink11.font = font;
        hyperlink11.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink11.stringFormat = stringFormat2;
        hyperlink11.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink11.url = 'https://www.syncfusion.com/';
        hyperlink11.draw
        hyperlink11.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
        let hyperlink12 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink12.font = font;
        hyperlink12.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink12.stringFormat = stringFormat2;
        hyperlink12.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink12.url = 'https://www.syncfusion.com/';
        hyperlink12.draw(page, new PointF(20, 300));
        let hyperlink13 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink13.font = font;
        hyperlink13.text = 'Syncfusion';
        hyperlink13.stringFormat = stringFormat2;
        hyperlink13.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink13.url = 'https://www.syncfusion.com/';
        hyperlink13.draw(page, new PointF(20, 300));
        let hyperlink14 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink14.font = font;
        hyperlink14.text = 'Syncfusion';
        hyperlink14.stringFormat = stringFormat2;
        hyperlink14.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink14.url = 'https://www.syncfusion.com/';
        hyperlink14.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
        let hyperlink : PdfTextWebLink = new PdfTextWebLink();
        hyperlink.font = font;
        hyperlink.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink.url = 'https://www.syncfusion.com/';
        hyperlink.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
        let hyperlink2 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink2.font = font;
        hyperlink2.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati';
        hyperlink2.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink2.url = 'https://www.syncfusion.com/';
        hyperlink2.draw(page, new PointF(20, 300));
        let hyperlink3 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink3.font = font;
        hyperlink3.text = 'Syncfusion';
        hyperlink3.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink3.url = 'https://www.syncfusion.com/';
        hyperlink3.draw(page, new PointF(20, 300));
        let hyperlink4 : PdfTextWebLink = new PdfTextWebLink();
        hyperlink4.font = font;
        hyperlink4.text = 'Syncfusion';
        hyperlink4.brush = new PdfSolidBrush(new PdfColor(255, 0, 0));
        hyperlink4.url = 'https://www.syncfusion.com/';
        hyperlink4.draw(page, new RectangleF(new PointF(0, 0), new SizeF(400, 100)));
    })
})