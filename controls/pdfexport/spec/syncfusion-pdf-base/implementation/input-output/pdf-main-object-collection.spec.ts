/**
 * spec document for PdfMainObjectCollection.ts class
 */
import { PdfMainObjectCollection, ObjectInfo } from '../../../../src/implementation/input-output/pdf-main-object-collection';
import { Dictionary } from './../../../../src/implementation/collections/dictionary';
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
describe('PdfMainObjectCollection.ts',()=> {
    describe('Constructor initializing',()=> {
        let t1 : PdfMainObjectCollection = new PdfMainObjectCollection();
        it('- Count != undefined', () => {
            expect(t1.count).not.toBeUndefined();
        })
        it('- Count == 0', () => {
            expect(t1.count).toEqual(0);
        })
        it('-M_objectCollection != undefined', () => {
            expect(t1.objectCollections).not.toBeUndefined();
        })
        it('-M_objectCollection == new Array<ObjectInfo>()', () => {
            expect(t1.objectCollections).toEqual(new Array<ObjectInfo>());
        })
        it('-M_primitiveObjectCollection != undefined', () => {
            expect(t1.primitiveObjectCollection).not.toBeUndefined();
        })
        it('-M_primitiveObjectCollection != new Collection.Dictionary<IPdfPrimitive.IPdfPrimitive,number>()', () => {
            expect(t1.primitiveObjectCollection).toEqual(new Dictionary<IPdfPrimitive,number>());
        })
        it('-mainObjectCollection != undefined', () => {
            expect(t1.mainObjectCollection).not.toBeUndefined();
        })
        it('-mainObjectCollection == new Collection.Dictionary<number,ObjectInfo>()', () => {
            expect(t1.mainObjectCollection).toEqual(new Dictionary<number,ObjectInfo>());
        })
        it('-OutIsNew == undefined', () => {
            expect(t1.outIsNew).toBeUndefined();
        })
        let t2 : ObjectInfo = new ObjectInfo();
        t2.object = new PdfName('test');
    })
})