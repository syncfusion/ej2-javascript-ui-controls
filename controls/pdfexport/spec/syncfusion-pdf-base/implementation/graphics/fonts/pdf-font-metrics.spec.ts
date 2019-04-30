/**
 * spec document for PdfFontMetrics.ts class
 */
import { PdfFontMetrics, PdfStringFormat, PdfSubSuperScript, StandardWidthTable } from "../../../../../src/index";

describe('PdfFontMetrics.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfFontMetrics = new PdfFontMetrics();
        let format : PdfStringFormat = new PdfStringFormat();
        format.subSuperScript = PdfSubSuperScript.SuperScript;
        t1.isUnicodeFont = false;
        t1.getHeight(format);
        t1.getSize(format);
        let format2 : PdfStringFormat = new PdfStringFormat();
        format2.subSuperScript = PdfSubSuperScript.SubScript;
        t1.getSize(format2);
        t1.clone();
    })
})
describe('StandardWidthTable.ts', () => {
    describe('Constructor initializing',()=> {
        let width : number[] = [50, 10];
        let standardWidthTable : StandardWidthTable = new StandardWidthTable(width);
        // it('-this.constructor(number[])', () => {
        //     expect(function (): void {standardWidthTable = null; }).toThrowError();
        // })
        standardWidthTable.items(0);
        it('-this.Items(number)', () => {
            expect(function (): void {standardWidthTable.items(-1); }).toThrowError();
        })
        it('-Length == 2', () => {
            expect(standardWidthTable.length).toEqual(2);
        })
        standardWidthTable.clone();
        standardWidthTable.toArray();
        it('-new StandardWidthTable(null)', () => {
            expect(function (): void {new StandardWidthTable(null);}).toThrowError();
        })
    })
})