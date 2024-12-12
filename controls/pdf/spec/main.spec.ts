import { PdfPage } from './../src/pdf/core/pdf-page';
import { PdfDocument } from './../src/pdf/core/pdf-document';
import { crossReferenceStream, crossReferenceTable, pdfSuccinctly, annotations, lineAnnotation } from './inputs.spec';
describe('Cross table parsing', () => {
    it('Cross Reference Stream', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceStream);
        expect(document).not.toBeUndefined();
        expect(document._startXRef).toEqual(997);
        expect(document.pageCount > 0).toBeTruthy();
        document._addWatermarkText();
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            expect(page).toBeDefined();
            expect(page._pageDictionary).toBeDefined();
            expect(page.annotations).toBeDefined();
        }
        document.destroy();
    });
    it('Cross Reference Table', () => {
        let document: PdfDocument = new PdfDocument(crossReferenceTable);
        expect(document).not.toBeUndefined();
        expect(document._startXRef).toEqual(1188);
        expect(document.pageCount).toEqual(1);
        document._addWatermarkText();
        for (let i: number = 0; i < document.pageCount; i++) {
            let page: PdfPage = document.getPage(i);
            expect(page).toBeDefined();
            expect(page._pageDictionary).toBeDefined();
            expect(page.annotations).toBeDefined();
        }
        document.destroy();
    });
});
describe('Succinctly document test', () => {
    it('PDF', () => {
        let document: PdfDocument = new PdfDocument(pdfSuccinctly);
        expect(document).not.toBeUndefined();
        let page: PdfPage = document.getPage(0);
        expect(page).toBeDefined();
        expect(page._pageDictionary).toBeDefined();
        document.destroy();
    });
});
describe('PDF writer test - no change', () => {
    it('PDF Demo sample - annotation', () => {
        let document: PdfDocument = new PdfDocument(annotations);
        expect(document).toBeDefined();
        let page: PdfPage = document.getPage(0);
        expect(page).toBeDefined();
        expect(page._pageDictionary).toBeDefined();
        expect(document.save().length > 0).toBeTruthy();
        document.destroy();
    });
    it('PDF base created - line annotation', () => {
        let document: PdfDocument = new PdfDocument(lineAnnotation);
        expect(document).toBeDefined();
        let page: PdfPage = document.getPage(0);
        expect(page).toBeDefined();
        expect(page._pageDictionary).toBeDefined();
        expect(document.save().length > 0).toBeTruthy();
        document.destroy();
    });
});
