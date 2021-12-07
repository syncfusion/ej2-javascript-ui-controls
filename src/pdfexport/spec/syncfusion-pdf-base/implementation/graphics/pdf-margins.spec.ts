/**
 * spec document for PdfMargins.ts class
 */
import { PdfMargins } from '../../../../src/implementation/graphics/pdf-margins';
describe('PdfMargins.ts',()=> {
    describe('Constructor initializing',()=> {
        let t1 : PdfMargins = new PdfMargins();
        t1.setMargins(10,20);
        it('-PdfMargins != undefined', () => {
            expect(t1.clone).not.toBeUndefined();
        })
        t1.setMargins(10,20,30,40);
        it('-PdfMargins != undefined', () => {
            expect(t1.clone).not.toBeUndefined();
        })
        it('-Left == 50', () => {
            t1.left = 50;
            expect(t1.left).toEqual(50);
        })
        it('-Right == 50', () => {
            t1.right = 50;
            expect(t1.right).toEqual(50);
        })
        it('-Top == 50', () => {
            t1.top = 50;
            expect(t1.top).toEqual(50);
        })
        it('-Bottom == 50', () => {
            t1.bottom = 50;
            expect(t1.bottom).toEqual(50);
        })
        it('-All == 25', () => {
            t1.all = 25;
            let isTrue : boolean = ((t1.left == 25) &&  (t1.right == 25) && (t1.top == 25) &&  (t1.bottom == 25));
            expect(isTrue).toEqual(true);
        })
    })
})