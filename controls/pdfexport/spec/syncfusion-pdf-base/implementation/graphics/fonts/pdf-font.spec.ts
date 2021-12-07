/**
 * spec document for PdfFont.ts class
 */
import { PdfFont, PdfFontFamily, PdfStandardFont, PdfStringFormat, IPdfPrimitive, IPdfCache } from '../../../../../src/index';

describe('PdfFont.ts', () => {
    describe('Constructor initializing',()=> {
        let fontFamily : PdfFontFamily = PdfFontFamily.Courier;
        let t1 : PdfStandardFont = new PdfStandardFont(fontFamily, 10);
        it('-Bold == false', () => {
            expect(t1.bold).toBeFalsy();
        })
        it('-Italic == false', () => {
            expect(t1.italic).toBeFalsy();
        })
        t1.getInternals();
        it('-SetInternals(IPdfPrimitive) method calling)', () => {
             expect(function (): void {t1.setInternals(null); }).toThrowError();
        })

        it('-MeasureString() calling)', () => {
            let t2 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
            let format : PdfStringFormat = new PdfStringFormat();
            expect(function (): void {t2.measureString(null, format);}).toThrowError();        
        })
        // let format : PdfStringFormat = new PdfStringFormat();
        // t1.MeasureString('test', format);
        // let value : number;
        // t1.MeasureString('test', format, value, value);
        // let size : Unit.SizeF = new Unit.SizeF();
        // let size1 : Unit.SizeF;
        // t1.MeasureString('test', size1);
        // let stringFormat : PdfStringFormat;
        // // let alignment : PdfTextAlignment;
        // t1.MeasureString('test', size, stringFormat);
        // t1.MeasureString('test', size, format, 10, 10);
        // let t2 : PdfStandardFont = new PdfStandardFont(fontFamily, 10);
        // t1.MeasureString('test', 10);
        // t1.MeasureString('test', 10, format);
        // t1.MeasureString('test', new Unit.SizeF(50, 50));
        // it('-t1.MeasureString(null, 10);)', () => {
        //      expect(function (): void {t1.MeasureString(null, 10);}).toThrowError();        
        // })
        // let obj : IPdfCache;
        // t1.EqualsTo(obj);
    })
})