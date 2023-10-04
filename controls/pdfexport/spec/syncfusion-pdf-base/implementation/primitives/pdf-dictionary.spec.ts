/**
 * spec document for PdfDictionary.ts class
 */
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { IPdfWriter } from '../../../../src/interfaces/i-pdf-writer';
import { IPdfWrapper } from '../../../../src/interfaces/i-pdf-wrapper';
import { Dictionary } from '../../../../src/implementation/collections/dictionary';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfArray } from '../../../../src/implementation/primitives/pdf-array';
import { PdfReference, PdfReferenceHolder } from '../../../../src/implementation/primitives/pdf-reference';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
import { Operators } from '../../../../src/implementation/input-output/pdf-operators';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
describe('PdfDictionary.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfDictionary = new PdfDictionary();
        it('-Items == new Dictionary<string,PdfPrimitives.IPdfPrimitive>()', () => {
            expect(t1.items).toEqual(new Dictionary<string,IPdfPrimitive>());
        })
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
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        // it('-GetChanged == false', () => {
        //     expect(t1.GetChanged).toEqual(false);
        // })
        it('-Count == Items.size()', () => {
            expect(t1.Count).toEqual(t1.items.size());
        })
        it('-Dictionary != undefined', () => {
            expect(t1.Dictionary).not.toBeUndefined();
        })
        it('-GetArchive() == true', () => {
            expect(t1.getArchive()).toBeTruthy();
        })
        it('-SetArchive(false)', () => {
            t1.setArchive(false);
            expect(t1.getArchive()).toBeFalsy();
        })
        it('-GetEncrypt() == true', () => {
            expect(t1.getEncrypt()).toBeTruthy();
        })
        it('-SetEncrypt(false)', () => {
            t1.setEncrypt(false);
            expect(t1.getEncrypt()).toBeFalsy();
        })
        it('-Clone() method calling', () => {
            let tempInput : PdfCrossTable = new PdfCrossTable();
            let tempOutput : IPdfPrimitive = t1.clone(tempInput);
        })
        it('-Remove() method calling', () => {
            t1.items.setValue('Name',new PdfName('Name'));
            t1.remove('Name');
        })
        let t2 : PdfDictionary = new PdfDictionary(t1);
        it('-Items == t1.Items', () => {
            expect(t2.items).toEqual(t1.items);
        })
        it('-Status == undefined', () => {
            expect(t2.status).toEqual(t1.status);
        })
        it('-Position == -1', () => {
            expect(t2.position).toEqual(-1);
        })
        it('-ClonedObject == null', () => {
            expect(t2.clonedObject).toBeNull();
        })
        it('-IsSaving == undefined', () => {
            expect(t2.isSaving).toBeUndefined();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t2.objectCollectionIndex).toBeUndefined();
        })
        // it('-GetChanged == true', () => {
        //     expect(t2.GetChanged).toEqual(true);
        // })
        it('-Count == Items.size()', () => {
            expect(t2.Count).toEqual(t1.items.size());
        })
        // it('-Dictionary == t1', () => {
        //     expect(t2.Dictionary).toEqual(t1.Dictionary);
        // })
        it('-GetArchive() == true', () => {
            expect(t2.getArchive()).toEqual(true);
        })
        it('-SetArchive(false)', () => {
            t2.setArchive(false);
            expect(t2.getArchive()).toEqual(false);
        })
        it('-GetEncrypt() == true', () => {
            expect(t2.getEncrypt()).toEqual(true);
        })
        it('-SetEncrypt(false)', () => {
            t2.setEncrypt(false);
            expect(t2.getEncrypt()).toEqual(false);
        })
        it('-ContainsKey(value)', () => {
            expect(t2.containsKey('Type')).toEqual(false);
        })
    })
})