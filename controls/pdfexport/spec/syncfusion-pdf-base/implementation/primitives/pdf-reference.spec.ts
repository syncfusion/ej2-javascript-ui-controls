/**
 * spec document for PdfReference.ts class
 */
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { ObjectStatus } from '../../../../src/implementation/input-output/enum';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
//import { PdfCatalog } from './../Document/PdfCatalog';
import { PdfPageBase } from '../../../../src/implementation/pages/pdf-page-base';
import { PdfPage } from '../../../../src/implementation/pages/pdf-page';
import { PdfSection } from '../../../../src/implementation/pages/pdf-section';
import { PdfSectionCollection } from '../../../../src/implementation/pages/pdf-section-collection';
import { IPdfWrapper } from '../../../../src/interfaces/i-pdf-wrapper';
import { IPdfWriter } from '../../../../src/interfaces/i-pdf-writer';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
import { PdfMainObjectCollection } from '../../../../src/implementation/input-output/pdf-main-object-collection';
import { PdfStream } from '../../../../src/implementation/primitives/pdf-stream';
import { PdfArray } from '../../../../src/implementation/primitives/pdf-array';
import { PdfNumber } from '../../../../src/implementation/primitives/pdf-number';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfReference, PdfReferenceHolder } from '../../../../src/implementation/primitives/pdf-reference';
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
describe('PdfReference.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfReference = new PdfReference(10,0);
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('-Set Status', () => {
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
        it('-IsSaving == undefined', () => {
            expect(t1.isSaving).toBeUndefined();
        })
        it('-Set IsSaving', () => {
            t1.isSaving = false;
            expect(t1.isSaving).toEqual(false);
        })
        it('-ObjectCollectionIndex == -1', () => {
            expect(t1.objectCollectionIndex).toEqual(-1);
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 10;
            expect(t1.objectCollectionIndex).toEqual(10);
        })
        it('-ObjNum == 10', () => {
            expect(t1.objNumber).toEqual(10);
        })
        it('-GenNum == 0', () => {
            expect(t1.genNumber).toEqual(0);
        })
        it('-Clone() method calling', () => {
            let tempInput : PdfCrossTable = new PdfCrossTable();
            let tempOutput : IPdfPrimitive = t1.clone(tempInput);
            expect(tempOutput).toEqual(null);
        })
    })
    describe('Constructor initializing',()=>{
        let t1 : PdfReference = new PdfReference('10','0');
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('-Position == -1', () => {
            expect(t1.position).toEqual(-1);
        })
        it('-ClonedObject == null', () => {
            expect(t1.clonedObject).toBeNull();
        })
        it('-IsSaving == undefined', () => {
            expect(t1.isSaving).toBeUndefined();
        })
        it('-ObjectCollectionIndex == -1', () => {
            expect(t1.objectCollectionIndex).toEqual(-1);
        })
        it('-ObjNum == 10', () => {
            expect(t1.objNumber).toEqual(10);
        })
        it('-GenNum == 0', () => {
            expect(t1.genNumber).toEqual(0);
        })
    })
})
describe('PdfReferenceHolder.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfReference = new PdfReference(10,0);
        let t2 : PdfReferenceHolder = new PdfReferenceHolder(t1)
        it('-Status == undefined', () => {
            expect(t2.status).toBeUndefined();
        })
        it('-Set Status', () => {
            t2.status = ObjectStatus.None;
            expect(t2.status).toEqual(ObjectStatus.None);
        })
        it('-Position == -1', () => {
            expect(t2.position).toEqual(-1);
        })
        it('-Set Position', () => {
            t2.position = 11;
            expect(t2.position).toEqual(11);
        })
        it('-ClonedObject == null', () => {
            expect(t2.clonedObject).toBeNull();
        })
        it('-IsSaving == undefined', () => {
            expect(t2.isSaving).toBeUndefined();
        })
        it('-Set IsSaving', () => {
            t2.isSaving = false;
            expect(t2.isSaving).toEqual(false);
        })
        it('-ObjectCollectionIndex == -1', () => {
            expect(t2.objectCollectionIndex).toEqual(-1);
        })
        it('-Set ObjectCollectionIndex', () => {
            t2.objectCollectionIndex = 10;
            expect(t2.objectCollectionIndex).toEqual(10);
        })
        it('-Object != undefined', () => {
            expect(t2.object).not.toBeUndefined();
        })
        it('-Reference == undefined', () => {
            expect(t2.reference).toBeUndefined();
        })
        it('-Index != undefined', () => {
            expect(t2.index).not.toBeUndefined();
        })
        it('-element != undefined', () => {
            expect(t2.element).not.toBeUndefined();
        })
        it('-Clone() method calling', () => {
            let tempInput : PdfCrossTable = new PdfCrossTable();
            let tempOutput : IPdfPrimitive = t2.clone(tempInput);
        })
    })
})