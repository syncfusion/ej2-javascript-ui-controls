/**
 * spec document for PdfName.ts class
 */
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { IPdfWriter } from '../../../../src/interfaces/i-pdf-writer';
import { IPdfWrapper } from '../../../../src/interfaces/i-pdf-wrapper';
import { Dictionary } from '../../../../src/implementation/collections/dictionary';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfArray } from '../../../../src/implementation/primitives/pdf-array';
import { PdfReference, PdfReferenceHolder } from '../../../../src/implementation/primitives/pdf-reference';
import { ObjectStatus } from '../../../../src/implementation/input-output/enum';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
import { Operators } from '../../../../src/implementation/input-output/pdf-operators';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
describe('PdfName.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfName = new PdfName();
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('Set Status', () => {
            t1.status = ObjectStatus.None;
            expect(t1.status).toEqual(ObjectStatus.None);
        })
        it('-Position == -1', () => {
            expect(t1.position).toEqual(-1);
        })
        it('-Set Position', () => {
            t1.position = 11;
            expect(t1.position).toEqual(11);
        })
        it('-ClonedObject == null', () => {
            expect(t1.clonedObject).toBeNull();
        })
        it('-IsSaving == false', () => {
            expect(t1.isSaving).toBeFalsy();
        })
        it('-Set IsSaving', () => {
            t1.isSaving == false;
            expect(t1.isSaving).toBeFalsy();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 10;
            expect(t1.objectCollectionIndex).toEqual(10);
        })
        it('-Value == undefined', () => {
            expect(t1.value).toBeUndefined();
        })
        it('-Set Value', () => {
            t1.value = 'testing';
            expect(t1.value).toEqual('testing');
        })
        it('-Set Value', () => {
            t1.value = null;
            expect(t1.value).toEqual(null);
        })
        it('-Clone() method calling', () => {
            let tempInput : PdfCrossTable = new PdfCrossTable();
            let tempOutput : IPdfPrimitive = t1.clone(tempInput);
        })
        let t2 : PdfName = new PdfName('testing');
        it('-Status == undefined', () => {
            expect(t2.status).toBeUndefined();
        })
        it('-Position == -1', () => {
            expect(t2.position).toEqual(-1);
        })
        it('-ClonedObject == null', () => {
            expect(t2.clonedObject).toBeNull();
        })
        it('-IsSaving == false', () => {
            expect(t2.isSaving).toBeFalsy();
        })
        it('-Set IsSaving', () => {
            t1.isSaving = false;
            expect(t2.isSaving).toBeFalsy();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t2.objectCollectionIndex).toBeUndefined();
        })
        it('-Value == testing', () => {
            expect(t2.value).toEqual('testing');
        })
        it('-Set Value', () => {
            t2.value = 'test';
            expect(t2.value).toEqual('test');
        })
    })
})