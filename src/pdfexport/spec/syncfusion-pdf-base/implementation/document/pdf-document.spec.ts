/**
 * spec document for PdfDocument.ts class
 */
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfSectionCollection } from '../../../../src/implementation/pages/pdf-section-collection';
import { PdfDocumentPageCollection } from '../../../../src/implementation/pages/pdf-document-page-collection';
import { PdfPageSettings } from '../../../../src/implementation/pages/pdf-page-settings';
import { PdfMainObjectCollection } from '../../../../src/implementation/input-output/pdf-main-object-collection';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
import { PdfCatalog } from '../../../../src/implementation/document/pdf-catalog';
import { PdfPage } from '../../../../src/implementation/pages/pdf-page';
import { PdfColorSpace, PdfDocumentTemplate } from "../../../../src/index";
describe('PdfDocument.ts',()=>{
    describe('Constructor initializing',()=>{
        // beforeEach((done: Function) => {
        //     let t1 : PdfDocument = new PdfDocument()
        //     let encoding: Encoding = new Encoding(false);
        //     encoding.type = EncodingType.Ansi;
        //     let streamWriter:StreamWriter = new StreamWriter(encoding);
        //     t1.DocSave(streamWriter,"test1.pdf",true);
        //     setTimeout(() => { done(); }, 100);
        // });
        it('-PdfDocument.Cache != undefined', () => {
            expect(PdfDocument.cache).not.toBeUndefined();
        })
        let t1 : PdfDocument = new PdfDocument();
        it('-DefaultFont != undefined', () => {
            expect(PdfDocument.defaultFont).not.toBeUndefined();
        })
        it('-Sections != undefined', () => {
            expect(t1.sections).not.toBeUndefined();
        })
        it('-pages != undefined', () => {
            expect(t1.pages).not.toBeUndefined();
        })
        PdfDocument.cache = null;
        it('-Cache != undefined', () => {
            expect(PdfDocument.cache).not.toBeUndefined();
        })
        it('-colorSpace != undefined', () => {
            expect(t1.colorSpace).not.toBeUndefined();
        })
        it('-Set colorSpace', () => {
            t1.colorSpace = PdfColorSpace.Rgb;
            expect(t1.colorSpace).toEqual(PdfColorSpace.Rgb);
        })
        it('-Set colorSpace', () => {
            t1.colorSpace = PdfColorSpace.Cmyk;
            expect(t1.colorSpace).toEqual(PdfColorSpace.Cmyk);
        })
        it('-Set colorSpace', () => {
            t1.colorSpace = PdfColorSpace.GrayScale
            expect(t1.colorSpace).toEqual(PdfColorSpace.GrayScale);
        })
        it('-Set colorSpace', () => {
            t1.colorSpace = PdfColorSpace.Indexed
            expect(t1.colorSpace).not.toBeUndefined();
        })
        it('template != undefined', () => {
            expect(t1.template).not.toBeUndefined();
        })
        PdfDocument.enableCache = true;
         it('-Set template', () => {
            t1.template = new PdfDocumentTemplate();
            expect(t1.template).not.toBeUndefined();
        })
        it('-pageSettings != undefined', () => {
            expect(t1.pageSettings).not.toBeUndefined();
        })
        it('-Set pageSettings', () => {
            t1.pageSettings = new PdfPageSettings();
            expect(t1.pageSettings).not.toBeUndefined();
        })
        let objects : PdfMainObjectCollection = new PdfMainObjectCollection();
        it('-this.SetMainObjectCollection(objects) method calling', () => {
            t1.setMainObjectCollection(objects);
            expect(t1.pdfObjects).not.toBeUndefined();
        })
        let crossTable : PdfCrossTable = new PdfCrossTable();
        crossTable.isMerging = false;
        crossTable.document = t1;
        it('-this.SetCrossTable(crossTable) method calling', () => {
            expect(t1.crossTable).not.toBeUndefined();
        })
        let catalog : PdfCatalog = new PdfCatalog();
        it('-t1.SetCatalog(catalog) method calling', () => {
            t1.setCatalog(catalog);
            expect(t1.catalog).not.toBeUndefined();
        })
        objects.add(catalog);
        it('-objects.Add(catalog) method calling', () => {
            expect(objects.items(objects.count-1)).not.toBeUndefined();
        })
        it('-t1.m_sections == new SectionCollection.PdfSectionCollection(this)', () => {
            expect(t1.sections).toEqual(new PdfSectionCollection(t1));
        })
        it('-this.m_pages == new DocumentPageCollection.PdfDocumentPageCollection(this)', () => {
            expect(t1.pages).toEqual(new PdfDocumentPageCollection(t1));
        })
        // afterAll(() => {
        //     let t1 : PdfDocument = new PdfDocument()
        //     let encoding: Encoding = new Encoding(false);
        //     encoding.type = EncodingType.Ansi;
        //     let streamWriter:StreamWriter = new StreamWriter(encoding);
        //     t1.DocSave(streamWriter,"test1.pdf",true);
        // });

        let document2 : PdfDocument = new PdfDocument();
        it('-document2.DocSave(null, test.pdf, false) == Error & CheckPagesPresence ', () => {
            expect(function (): void {document2.docSave(null, 'test.pdf', false); }).toThrowError();
        })
        // it('SaveAsBlob', (done) => {
        //     let pdfdocument: PdfDocument = new PdfDocument();
        //     let page: PdfPage = pdfdocument.pages.add();
        //     pdfdocument.save().then((pdfBlob: {blobData: Blob}) => {
        //         let dataUrl: string = window.URL.createObjectURL(pdfBlob.blobData);
        //         let dwlLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
        //         dwlLink.download = 'SaveAsBlob.pdf';
        //         dwlLink.href = dataUrl;
        //         let event: MouseEvent = document.createEvent('MouseEvent');
        //         event.initEvent('click', true, true);
        //         dwlLink.dispatchEvent(event);
        //         setTimeout((): void => {
        //             window.URL.revokeObjectURL(dataUrl);
        //         });
        //     });
        //     setTimeout(function (): void {            
        //         expect('').toEqual('');
        //         done();
        //     }, 50);
    
        // });
    })
})