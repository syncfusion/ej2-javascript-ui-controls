/**
 * spec document for PdfPageLayer.ts class
 */
import { PdfPageLayer, PdfStream, PdfPage, PdfDocument } from "../../../../src/index";
describe('PdfPageLayer.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let stream : PdfStream = new PdfStream();
        let t1 : PdfPageLayer = new PdfPageLayer(page);
        let t2 : PdfPageLayer = new PdfPageLayer(page, stream);
        let t3 : PdfPageLayer = new PdfPageLayer(page, true);
        it('-ColorSpace == 0', () => {
            expect(t1.colorSpace).toEqual(0);
        })
        it('-layerId == undefined', () => {
            expect(t1.layerId).toBeUndefined();
        })
        it('-Set layerId', () => {
            t1.layerId = 'test';
            expect(t1.layerId).toEqual('test');
        })
        it('-name == undefined', () => {
            expect(t1.name).toBeUndefined();
        })
        it('-visible == true', () => {
            expect(t1.visible).toBeTruthy();
        })
        it('-Set visible', () => {
            t1.visible = true;
            expect(t1.visible).toBeTruthy();
        })
        it('-layers != undefined & if part calling', () => {
            expect(t1.layers).not.toBeUndefined();
        })
        it('-layers != undefined & else part calling', () => {
            expect(t1.layers).not.toBeUndefined();
        })
        t1.add();
        it('-this.constructor(PdfPage, PdfStream as null)', () => {
            expect(function (): void {t2 = new PdfPageLayer(page, null);}).toThrowError();
        })
        it('-this.constructor(PdfPage as null, PdfStream)', () => {
            expect(function (): void {t2 = new PdfPageLayer(null, stream);}).toThrowError();
        })
        t1.page.origin.x = -1;
        t1.graphics;
        t2.page.origin.y = -1;
        t2.graphics;
        t3.page.origin.x = 10;
        t3.page.origin.y = 15;
        t3.graphics;
    })
})