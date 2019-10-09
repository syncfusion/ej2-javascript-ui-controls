/**
 * spec document for PdfCrossTable.ts class
 */
import { PdfCrossTable, RegisteredObject } from '../../../../src/implementation/input-output/pdf-cross-table';
import { PdfStream } from '../../../../src/implementation/primitives/pdf-stream';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfReference } from '../../../../src/implementation/primitives/pdf-reference';
describe('PdfCrossTable.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfCrossTable = new PdfCrossTable();
        it('-IsMerging == undefined', () => {
            expect(t1.isMerging).toBeUndefined();
        })
        // if(t1.CrossTable == null)
        // {
        //     it('-t1.Trailer != undefined', () => {
        //         expect(t1.Trailer).toBeUndefined();
        //     })
        // }
        // else
        // {
        //     it('-t1.Trailer == new Stream.PdfStream()', () => {
        //         expect(t1.Trailer).toEqual(new PdfStream());
        //     })
        // }
        it('-IsMerging == undefined', () => {
            expect(t1.isMerging).toBeUndefined();
        })
        it('-IsMerging == undefined', () => {
            expect(t1.isMerging).toBeUndefined();
        })
        it('-Document == undefined', () => {
            expect(t1.document).not.toBeUndefined();
        })
        it('-PdfObjects == undefined', () => {
            expect(t1.pdfObjects).not.toBeUndefined();
        })
        let t2 : PdfDocument = new PdfDocument();
        t1.document = t2
        it('-t1.m_Items == t1.Document.PdfObjects', () => {
            expect(t1.pdfObjects).toEqual(t1.document.pdfObjects);
        })
        it('-Document == t2', () => {
            expect(t1.document).toEqual(t2);
        })
        t1.count = 10;
        it('-Count == 10', () => {
            expect(t1.count).toEqual(10);
        })
        let tempCount:number = t1.count;
        it('-NextObjNumber == tempCount+1', () => {
            expect(t1.nextObjNumber).toEqual(tempCount+1);
        })
        // it('-PageCorrespondance != null', () => {
        //     expect(t1.PageCorrespondance).not.toBeNull();
        // })
        // it('-PageCorrespondance != undefined', () => {
        //     expect(t1.PageCorrespondance).not.toBeUndefined();
        // })
        // it('-PrevReference != null', () => {
        //     expect(t1.PageCorrespondance).not.toBeNull();
        // })
        // it('-PrevReference != undefined', () => {
        //     expect(t1.PageCorrespondance).not.toBeUndefined();
        // })
    })
    let tempReference : PdfReference = new PdfReference(10,0);
    let t2 : RegisteredObject = new RegisteredObject(10,tempReference);
    it('-ObjectNumber != undefined', () => {
        expect(t2.objectNumber).not.toBeUndefined();
    })
})