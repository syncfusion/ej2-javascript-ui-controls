/**
 * spec document for PdfArray.ts class
 */
import { PdfArray } from '../../../../src/implementation/primitives/pdf-array';
import { IPdfPrimitive } from '../../../../src/interfaces/i-pdf-primitives';
import { IPdfWriter } from '../../../../src/interfaces/i-pdf-writer';
import { ObjectStatus } from '../../../../src/implementation/input-output/enum';
import { PdfNumber } from '../../../../src/implementation/primitives/pdf-number';
import { Operators } from '../../../../src/implementation/input-output/pdf-operators';
import { PdfCrossTable } from '../../../../src/implementation/input-output/pdf-cross-table';
describe('PdfArray.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfArray = new PdfArray()
        it('-Elements != undefined', () => {
            expect(t1.elements).not.toBeUndefined();
        })
        it('-Elements == new Array<IPdfPrimitive.IPdfPrimitive>()', () => {
            expect(t1.elements).toEqual(new Array<IPdfPrimitive>());
        })
        it('-CrossTable == undefined', () => {
            expect(t1.CrossTable).toBeUndefined();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 11;
            expect(t1.objectCollectionIndex).toEqual(11);
        })
        it('-Position == -1', () => {
            expect(t1.position).toEqual(-1);
        })
        it('-Set Position', () => {
            t1.position = 10;
            expect(t1.position).toEqual(10);
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
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('-Set Status', () => {
            t1.status = ObjectStatus.None;
            expect(t1.status).toEqual(ObjectStatus.None);
        })
        it('-Count == Elements.length', () => {
            expect(t1.count).toEqual(t1.elements.length);
        })
        it('-Items(index) method calling', () => {
            let tempInput : PdfNumber = new PdfNumber(10);
            t1.add(tempInput);
            expect(t1.items(0)).toEqual(tempInput);
        })
        it('-contains(IPdfPrimitive) method calling', () => {
            let tempInput : PdfNumber = new PdfNumber(10);
            t1.add(tempInput);
            expect(t1.contains(tempInput)).toEqual(true);
        })
        it('-Clone() method calling', () => {
            let tempInput : PdfCrossTable = new PdfCrossTable();
            let tempOutput : IPdfPrimitive = t1.clone(tempInput);
        })
        // it('-Remove() method calling', () => {
        //     t1 = new PdfArray();
        //     let tempInput : PdfNumber = new PdfNumber(10);
        //     let tempInput2 : PdfNumber = new PdfNumber(20);
        //     t1.add(tempInput);
        //     t1.add(tempInput2);
        //     let tempCount : number = t1.Elements.length;
        //     t1.Remove(tempInput);
        //     expect(t1.contains(tempInput)).toEqual(false);
        // })
        let t2 : PdfArray = new PdfArray([100,200,300,400,500])
        it('-Elements != undefined', () => {
            expect(t2.elements).not.toBeUndefined();
        })
        let tempElements : Array<IPdfPrimitive> = new Array<IPdfPrimitive>();
        tempElements.push(new PdfNumber(100));
        tempElements.push(new PdfNumber(200));
        tempElements.push(new PdfNumber(300));
        tempElements.push(new PdfNumber(400));
        tempElements.push(new PdfNumber(500));
        // it('-Elements == tempElements->[100,200,300,400,500]', () => {
        //     expect(t2.Elements).toEqual(tempElements);
        // })
        it('-CrossTable == undefined', () => {
            expect(t2.CrossTable).toBeUndefined();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t2.objectCollectionIndex).toBeUndefined();
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
        it('-Status == undefined', () => {
            expect(t2.status).toBeUndefined();
        })
        it('-Count == Elements.length -> 5', () => {
            expect(t2.count).toEqual(t2.elements.length);
        })
        let t3 : PdfArray = new PdfArray(t2)
        it('-Elements != undefined', () => {
            expect(t3.elements).not.toBeUndefined();
        })
        // it('-Elements == tempElements->[100,200,300,400,500]', () => {
        //     expect(t3.Elements).toEqual(tempElements);
        // })
        it('-CrossTable == undefined', () => {
            expect(t3.CrossTable).toBeUndefined();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t3.objectCollectionIndex).toBeUndefined();
        })
        it('-Position == -1', () => {
            expect(t3.position).toEqual(-1);
        })
        it('-ClonedObject == null', () => {
            expect(t3.clonedObject).toBeNull();
        })
        it('-IsSaving == undefined', () => {
            expect(t3.isSaving).toBeUndefined();
        })
        it('-Status == undefined', () => {
            expect(t3.status).toBeUndefined();
        })
        it('-Count == Elements.length -> 5', () => {
            expect(t3.count).toEqual(t3.elements.length);
        })

        let array2 : PdfArray = new PdfArray();
        let number1 : PdfNumber = new PdfNumber(10);
        array2.add(number1);
        let number2 : PdfNumber = new PdfNumber(20);
        array2.add(number2);
        let number3 : PdfNumber = new PdfNumber(30);
        array2.add(number3);
        let number4 : PdfNumber = new PdfNumber(40);
        array2.add(number4);
        it('-array2.contains() == true', () => {
            expect(array2.contains(number1)).toEqual(true);
        })
        it('-array2.contains(null) == false', () => {
            expect(array2.contains(null)).toEqual(false);
        })
        let number5 : PdfNumber = new PdfNumber(50);
        array2.insert(1, number5);
        array2.remove(number5);
        array2.removeAt(2);

        let array3 : PdfArray = new PdfArray();
        let number : PdfNumber = new PdfNumber(10);
        array3.add(number);
        let number0 : PdfNumber = new PdfNumber(20);
        array3.add(number0);
        it('-array2.contains(null) == false', () => {
            expect(array3.contains(null)).toEqual(false);
        })
        array3.removeAt(4);
    })
})