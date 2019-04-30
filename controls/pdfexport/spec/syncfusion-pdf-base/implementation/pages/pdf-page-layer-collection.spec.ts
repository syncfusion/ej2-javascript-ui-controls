/**
 * spec document for PdfPageLayerCollection.ts class
 */
import { PdfPageLayerCollection, PdfPageLayer, PdfPage, PdfDocument } from "../../../../src/index";

describe('PdfPageLayerCollection.ts', () => {
    describe('Constructor initializing',()=>{
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let page2 : PdfPage = document.pages.add();
        let pageLayer : PdfPageLayer = page.layers.add();
        let pageLayer2 : PdfPageLayer = page.layers.add();
        let t1 : PdfPageLayerCollection = new PdfPageLayerCollection();
        it('-this.Items(0, null) method calling', () => {
            expect(function (): void {t1.items(0, null);}).toThrowError();
        })
        it('-this.Items(0, pagelayer of another page) method calling', () => {
            expect(function (): void {t1.items(0, pageLayer);}).toThrowError();
        })
        // let t2 : PdfPageLayerCollection = new PdfPageLayerCollection(page);
        // let layer1 : PdfPageLayer = t1.add();
        // t1.Items(1, layer1);
        // it('-this.Items(number, PdfPageLayer) method calling', () => {
        //     expect(function (): void {t1.Items(null); }).toThrowError();
        // })
        it('-this.IndexOf(PdfPageLayer) method calling', () => {
            expect(function (): void {t1.indexOf(null); }).toThrowError();
        })
        // it('-PdfPageLayerCollection(null) - error', () => {
        //     expect(function (): void {new PdfPageLayerCollection(null)}).toThrowError();
        // })
        // let t2 : PdfPageLayerCollection = new PdfPageLayerCollection(page);
        // t2.IndexOf(pageLayer);
        it('-add(string) == 0', () => {
            expect(t1.add('test')).not.toBeUndefined;
        })
    })
})