/**
 * spec document for PdfDestination.ts class
 */

import { PdfDestination, PdfDocument, PdfPage, PointF, SizeF, RectangleF } from "../../../../src/index";
import { PdfDestinationMode } from "../../../../src/implementation/general/enum";

describe('PdfDestination.ts', () => {
    describe('Constructor initializing',()=>{
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let t1 : PdfDestination = new PdfDestination(page);
        let t2 : PdfDestination = new PdfDestination(page, new PointF(10, 10));
        it('-Zoom == 0', () => {
            expect(t1.zoom).toEqual(0);
        })
        it('-Set Zoom', () => {
            t1.zoom = 3;
            expect(t1.zoom).toEqual(3);
        })
        it('-Page != undefined', () => {
            expect(t1.page).not.toBeUndefined();
        })
        it('-Set Page', () => {
            t1.page = page;
            expect(t1.page).not.toBeUndefined();
        })
        it('-Mode != undefined', () => {
            expect(t1.mode).not.toBeUndefined();
        })
        it('-Set Mode', () => {
            t1.mode = PdfDestinationMode.FitToPage;
            expect(t1.mode).toEqual(PdfDestinationMode.FitToPage);
        })
        it('-Location != undefined', () => {
            expect(t1.location).not.toBeUndefined();
        })
        it('-Set Location', () => {
            t1.location = new PointF(10, 10);
            expect(t1.location).toEqual(new PointF(10, 10));
        })
        it('-element != undefined', () => {
            expect(t1.element).not.toBeUndefined();
        })
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(40, 40));
        let t3 : PdfDestination = new PdfDestination(page, rect);
    })
})