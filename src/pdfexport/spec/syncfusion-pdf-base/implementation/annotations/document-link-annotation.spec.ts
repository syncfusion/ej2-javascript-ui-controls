/**
 * spec document for PdfDocumentLinkAnnotation.ts class
 */

import { PdfDocumentLinkAnnotation, RectangleF } from "../../../../src/implementation/index";
import { PdfDestination, PdfPage, PdfDocument, PdfColor, PdfDictionary } from "../../../../src/index";
import { PdfNumber, IPdfPrimitive, SizeF, PointF } from "../../../../src/index";

describe('PdfDocumentLinkAnnotation.ts', () => {
    describe('Constructor initializing',()=> {
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(30, 30));
        let t1 : PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(rect);
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let dest : PdfDestination = new PdfDestination(page);
        let rectangle : RectangleF;
        let t2 : PdfDocumentLinkAnnotation = new PdfDocumentLinkAnnotation(rectangle, dest);
        it('-Destination != undefined', () => {
            expect(t1.destination).not.toBeUndefined();
        })
        it('-Set Destination', () => {
            t1.destination = dest
            expect(t1.destination).not.toBeUndefined();
        })
        it('-bounds != undefined', () => {
            expect(t1.bounds).not.toBeUndefined();
        })
        it('-Set bounds', () => {
            t1.bounds = new RectangleF(new PointF(10, 10), new SizeF(40, 40));
            expect(t1.bounds).not.toBeUndefined();
        })
        it('-page != undefined', () => {
            expect(t1.page).not.toBeUndefined();
        })
        it('-text != undefined', () => {
            expect(t1.text).not.toBeUndefined();
        })
        it('-Set text', () => {
            t1.text = 'test';
            expect(t1.text).toEqual('test');
        })
        it('-dictionary != undefined', () => {
            expect(t1.dictionary).not.toBeUndefined();
        })
        it('-Set dictionary', () => {
            t1.dictionary = new PdfDictionary();
            expect(t1.dictionary).not.toBeUndefined();
        })
        t1.setPage(page);
        it('-Set element', () => {
            expect(t1.element).not.toBeUndefined();
        })
        t1.beginSave();
    })
})