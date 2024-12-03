/**
 * spec document for PdfSectionPageCollection.ts class
 */
import { PdfSectionPageCollection, PdfSection, PdfPage, PdfDocument } from '../../../../src/index';
describe('PdfSectionPageCollection.ts',()=>{
    describe('Constructor initializing',()=>{
        let document : PdfDocument = new PdfDocument();
        let section : PdfSection = document.sections.add() as PdfSection;
        let page : PdfPage = section.pages.add();
        it('-new PdfSectionPageCollection(null) = Error', () => {
            expect(function () {let t2 : PdfSectionPageCollection = new PdfSectionPageCollection(null)}).toThrowError();
        })
    })
})