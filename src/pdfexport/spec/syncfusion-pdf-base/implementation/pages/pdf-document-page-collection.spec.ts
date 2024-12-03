/**
 * spec document for PdfDocumentPageCollection.ts class
 */
import { PdfDocument, PdfPage } from '../../../../src/index';
import { PdfDocumentPageCollection } from '../../../../src/implementation/pages/pdf-document-page-collection';
describe('PdfDocumentPageCollection.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfDocument = new PdfDocument();
        let page1 : PdfPage = t1.pages.add();
        let t3 : PdfDocument = new PdfDocument();
        let page2 : PdfPage = t3.pages.add();
        let t2 : PdfDocumentPageCollection = new PdfDocumentPageCollection(t1);
        it('-Count != undefined', () => {
            expect(t2.count).not.toBeUndefined();
        })
        it('-IndexOf(null) throws error', () => {
            expect(function (): void {t2.indexOf(null);}).toThrowError();
        })
        it('-t2.IndexOf(t3.Page) == -1', () => {
            expect(t2.indexOf(page2)).toEqual(-1);
        })
        it('-t2.GetPageByPageIndex(0)', () => {
            expect(t2.getPageByIndex(0)).not.toEqual(null);
        })
        it('-t2.GetPageByPageIndex(-1) -> throw error', () => {
            expect(function (): void {t2.getPageByIndex(-1);}).toThrowError();
        })
        it('-t2.Remove(page1) not throw Error & contains -> false', () => {
            expect(function (): void {t2.remove(page2)}).not.toThrowError();
        })
        it('-t2.Remove(page1) not throw Error', () => {
            expect(function (): void {t2.remove(page1)}).not.toThrowError();
        })
        it('-t2.Remove(null) throw Error', () => {
            expect(function (): void {t2.remove(null)}).toThrowError();
        })
    })
})