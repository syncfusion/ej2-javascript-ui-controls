/**
 * spec document for PdfDocumentBase.ts class
 */
import { PdfDocumentBase } from '../../../../src/implementation/document/pdf-document-base';
import { PdfMainObjectCollection } from '../../../../src/implementation/input-output/pdf-main-object-collection';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
import { PdfCatalog } from '../../../../src/implementation/document/pdf-catalog';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfReference } from "../../../../src/index";

describe('PdfDocumentBase.ts',()=> {
    describe('Constructor initializing',()=> {
        let t1 : PdfDocument = new PdfDocument();
        let t3 : PdfDocumentBase = new PdfDocumentBase(t1);
        it('-PdfObjects == undefined', () => {
            expect(t3.pdfObjects).toBeUndefined();
        })
        it('-crossTable == undefined', () => {
            expect(t3.crossTable).toBeUndefined();
        })
        it('-CurrentSavingObj != undefined', () => {
            expect(t3.currentSavingObj).toBeUndefined();
        })
        it('-Set CurrentSavingObj', () => {
            let reference : PdfReference = new PdfReference(10, 4);
            t3.currentSavingObj = reference;
            expect(t3.currentSavingObj).not.toBeUndefined();
        })
        it('-catalog == undefined', () => {
            expect(t3.catalog).toBeUndefined();
        })
    })
    describe('Public methods',()=> {
        let t1 : PdfDocument = new PdfDocument();
        let t2 : PdfDocumentBase = new PdfDocumentBase(t1);
        let t3 : PdfMainObjectCollection = new PdfMainObjectCollection();
        it('-this.SetMainObjectCollection() method calling', () => {
            t2.setMainObjectCollection(t3);
            expect(t2.pdfObjects).not.toBeUndefined();
        })
        let t4:PdfCrossTable = new PdfCrossTable();
        it('-this.PdfCrossTable() method calling', () => {
            t2.setCrossTable(t4);
            expect(t2.crossTable).not.toBeUndefined();
        })
        let t5:PdfCatalog = new PdfCatalog();
        it('-this.SetCatalog() method calling', () => {
            t2.setCatalog(t5);
            expect(t2.catalog).not.toBeUndefined();
        })
        it('-Set catalog()', () => {
            t2.catalog = t5;
            expect(t2.catalog).not.toBeUndefined();
        })
    })
})