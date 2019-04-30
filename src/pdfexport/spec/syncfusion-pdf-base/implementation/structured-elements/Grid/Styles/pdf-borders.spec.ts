/**
 * spec document for PdfBorders.ts class
 */
import { PdfPen, PdfColor } from "../../../../../../src/index";
import { PdfBorders, PdfPaddings } from "../../../../../../src/implementation/structured-elements/grid/styles/pdf-borders";

describe('PdfBorders.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfBorders = new PdfBorders();
        it('-left != undefined', () => {
            expect(t1.left).not.toBeUndefined();
        })
        it('-Set left', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0 ,0 ,0));
            t1.left = value;
            expect(t1.left).not.toBeUndefined();
        })
        it('-right != undefined', () => {
            expect(t1.right).not.toBeUndefined();
        })
        it('-Set right', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0 ,0 ,0));
            t1.right = value;
            expect(t1.right).not.toBeUndefined();
        })
        it('-top != undefined', () => {
            expect(t1.top).not.toBeUndefined();
        })
        it('-Set top', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0 ,0 ,0));
            t1.top = value;
            expect(t1.top).not.toBeUndefined();
        })
        it('-bottom != undefined', () => {
            expect(t1.bottom).not.toBeUndefined();
        })
        it('-Set bottom', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0 ,0 ,0));
            t1.bottom = value;
            expect(t1.bottom).not.toBeUndefined();
        })
        it('-IsAll == false', () => {
            t1.all = new PdfPen(new PdfColor(0, 0, 255));
            expect(t1.isAll).toBeTruthy();
        })
        it('-Set all', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0 ,0 ,0));
            t1.all = value;
            expect(t1.all).toBeUndefined();
        })
    })
})

describe('PdfPaddings.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfPaddings = new PdfPaddings();
        it('-left != undefined', () => {
            expect(t1.left).not.toBeUndefined();
        })
        it('-Set left', () => {
            t1.left = 5;
            expect(t1.left).toEqual(5);
        })
        it('-right != undefined', () => {
            expect(t1.right).not.toBeUndefined();
        })
        it('-Set right', () => {
            t1.right = 3;
            expect(t1.right).toEqual(3);
        })
        it('-top != undefined', () => {
            expect(t1.top).not.toBeUndefined();
        })
        it('-Set top', () => {
            t1.top = 4;
            expect(t1.top).toEqual(4);
        })
        it('-bottom != undefined', () => {
            expect(t1.bottom).not.toBeUndefined();
        })
        it('-Set bottom', () => {
            t1.bottom = 2;
            expect(t1.bottom).toEqual(2);
        })
        it('-Set all', () => {
            t1.all = 10;
            expect(t1.all).toBeUndefined();
        })
        let t2 : PdfPaddings = new PdfPaddings(10, 10, 10, 10);
    })
})