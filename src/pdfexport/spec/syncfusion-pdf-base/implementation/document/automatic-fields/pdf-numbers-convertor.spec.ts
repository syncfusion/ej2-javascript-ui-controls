/**
 * spec document for PdfNumbersConvertor.ts class
 */
import { PdfNumbersConvertor } from '../../../../../src/implementation/document/automatic-fields/pdf-numbers-convertor';
import { PdfNumberStyle } from '../../../../../src/index';
describe('PdfNumbersConvertor.ts',()=> {
    describe('Constructor initializing',()=> {
        let obj : PdfNumbersConvertor = new PdfNumbersConvertor();
        for (let i : number = 1; i < 26; i++) {
            PdfNumbersConvertor.convert(i, PdfNumberStyle.LowerLatin);
            PdfNumbersConvertor.convert(i, PdfNumberStyle.LowerRoman);
            PdfNumbersConvertor.convert(i, PdfNumberStyle.None);
            PdfNumbersConvertor.convert(i, PdfNumberStyle.Numeric);
            PdfNumbersConvertor.convert(i, PdfNumberStyle.UpperLatin);
            PdfNumbersConvertor.convert(i, PdfNumberStyle.UpperRoman);
        }
        PdfNumbersConvertor.convert(52, PdfNumberStyle.LowerLatin);
        PdfNumbersConvertor.convert(53, PdfNumberStyle.LowerLatin);
        it('-PdfNumbersConvertor.convert(0, PdfNumberStyle.LowerLatin) - thrown error', () => {
            expect(function (): void {PdfNumbersConvertor.convert(0, PdfNumberStyle.LowerLatin); }).toThrowError();
        })
    })
})