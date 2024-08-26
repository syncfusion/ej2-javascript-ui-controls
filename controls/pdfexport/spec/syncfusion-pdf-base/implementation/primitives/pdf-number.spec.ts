/**
 * spec document for PdfNumber.ts class
 */
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { ObjectStatus } from "../../../../src/implementation/input-output/enum";
import { PdfCrossTable } from "../../../../src/implementation/input-output/pdf-cross-table";
import { IPdfWriter } from "../../../../src/interfaces/i-pdf-writer";
import { PdfNumber } from '../../../../src/implementation/primitives/pdf-number';
describe('PdfPdfNumberNull.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfNumber = new PdfNumber(10);
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('- Set Status', () => {
            t1.status = ObjectStatus.None;
            expect(t1.status).toEqual(ObjectStatus.None);
        })
        it('-Position == -1', () => {
            expect(t1.position).toEqual(-1);
        })
        it('- Set Position', () => {
            t1.position = 11;
            expect(t1.position).toEqual(11);
        })
        it('-ClonedObject == null', () => {
            expect(t1.clonedObject).toBeNull();
        })
        it('-IsSaving == undefined', () => {
            expect(t1.isSaving).toBeUndefined();
        })
        it('- Set IsSaving', () => {
            t1.isSaving = false;
            expect(t1.isSaving).toEqual(false);
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 10;
            expect(t1.objectCollectionIndex).toEqual(10);
        })
        it('-IntValue == 10', () => {
            expect(t1.intValue).toEqual(10);
        })
        it('-IsInteger == undefined', () => {
            expect(t1.isInteger).toBeUndefined();
        })
        it('-Set IsInteger', () => {
            t1.isInteger = true;
            expect(t1.isInteger).toEqual(true);
        })
    })
})