/**
 * spec document for PdfCollection.ts class
 */
import { PdfCollection, IPdfWrapper } from "../../../../src/index";

describe('PdfCollection.ts', () => {
    describe('Constructor initializing',()=> {
        // let t1 : PdfCollection = new PdfCollection();
        // let array : IPdfWrapper[];
        // t1.CopyTo(array, 1);
        let t2 : PdfCollection = new PdfCollection();
        it('-List != undefined', () => {
            expect(t2.list).not.toBeUndefined();
        })
        let t3 : PdfCollection = new PdfCollection();
        it('-Count != 0', () => {
            expect(t3.count).toEqual(0);
        })
    })
})