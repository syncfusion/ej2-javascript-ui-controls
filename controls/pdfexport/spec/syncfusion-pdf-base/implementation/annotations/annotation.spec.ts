/**
 * spec document for PdfAnnotation.ts class
 */
import { PointF, PdfDocumentLinkAnnotation, PdfAnnotation } from "../../../../src/index";
import { RectangleF, SizeF, PdfPage, PdfDocument, PdfColor, PdfColorSpace } from "../../../../src/index";

describe('PdfAnnotation.ts', () => {
    describe('Constructor initializing',()=> {
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(50, 50));
        let t1 : PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(rect);
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let color : PdfColor = new PdfColor(0, 0, 255);
        t1.color = color;
        it('-color == Blue', () => {
            expect(t1.color).toEqual(color);
        })
        page.graphics.colorSpace = PdfColorSpace.Rgb;
        t1.setPage(page);
        it('-page != undefined', () => {
            expect(t1.page).not.toBeUndefined();
        })
        it('-page == page object set by t1.setPage(page)', () => {
            expect(t1.page).toEqual(page);
        })
        it('-color != undefined', () => {
            expect(t1.color).not.toBeUndefined();
        })
        t1.color = color;
        it('-color == Blue', () => {
            expect(t1.color).toEqual(color);
        })
        it('-innerColor != undefined', () => {
            expect(t1.innerColor).not.toBeUndefined();
        })
        t1.innerColor = color;
        it('-innerColor == Blue', () => {
            expect(t1.innerColor).toEqual(color);
        })
        it('-bounds != undefined', () => {
            expect(t1.bounds).not.toBeUndefined();
        })
        
        it('-text != undefined', () => {
            expect(t1.text).not.toBeUndefined();
        })
        it('-text == test', () => {
            expect(t1.text).toEqual('');
        })
        it('-Dictionary != undefined', () => {
            expect(t1.dictionary).not.toBeUndefined();
        })
        it('-font != undefined', () => {
            t1.font = null;
            expect(t1.font).not.toBeUndefined();
        })
        it('-brush != undefined', () => {
            t1.brush = null;
            expect(t1.brush).not.toBeUndefined();
        })
        it('-stringFormat != undefined', () => {
            t1.stringFormat = null;
            expect(t1.stringFormat).not.toBeUndefined();
        })
        t1.beginSave();
    })
})