/**
 * spec document for PdfBoolean.ts class
 */
import { PdfStream, PdfStreamWriter, IPdfWriter, PdfCrossTable } from "../../../../src/index";
import { PdfBoolean } from "../../../../src/implementation/primitives/index";

describe('PdfBoolean.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfBoolean = new PdfBoolean(true);
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('-Set Status', () => {
            t1.status = 1;
            expect(t1.status).toEqual(1);
        })
        it('-IsSaving == false', () => {
            expect(t1.isSaving).toBeFalsy();
        })
        it('-Set IsSaving', () => {
            t1.isSaving = true;
            expect(t1.isSaving).toBeTruthy();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 1;
            expect(t1.objectCollectionIndex).toEqual(1);
        })
        it('-Position == -1', () => {
            expect(t1.position).toEqual(-1);
        })
        it('-Set Position', () => {
            t1.position = 1;
            expect(t1.position).toEqual(1);
        })
        it('-ClonedObject != undefined', () => {
            expect(t1.clonedObject).not.toBeUndefined();
        })
        let stream : PdfStream = new PdfStream();
        let streamWriter : PdfStreamWriter = new PdfStreamWriter(stream);
        let writer : IPdfWriter = streamWriter;
        t1.save(writer);
        it('-this.Save(IPdfWriter) method calling', () => {
            expect(t1.save(writer)).toBeUndefined();
        })
        let crossTable : PdfCrossTable = new PdfCrossTable();
        t1.clone(crossTable);
        let t2 : PdfBoolean = new PdfBoolean(false);
        t2.save(writer);
    })
})