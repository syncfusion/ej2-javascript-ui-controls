/**
 * spec document for PdfStandardFont.ts class
 */
import { PdfFont, PdfStandardFont, PdfStringFormat, PdfFontStyle, PdfFontFamily } from "../../../../../src/index";

describe('PdfStandardFont.ts', () => {
    describe('Constructor initializing',()=>{
        let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
        let t1 : PdfStandardFont = new PdfStandardFont(font, PdfFontStyle.Italic);
        let format : PdfStringFormat = new PdfStringFormat();
        it('-this.GetLineWidth(string, PdfStringFormat) method calling', () => {
            expect(function (): void {t1.getLineWidth(null, format); }).toThrowError();
        })
        format.characterSpacing = 5;
        t1.getLineWidth('Testing', format);
        //CheckStyle() calling - if loop
        let font2 : PdfFont = new PdfStandardFont(PdfFontFamily.ZapfDingbats, PdfFontStyle.Regular);
        //CheckStyle() calling - else loop
        let font3 : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, PdfFontStyle.Regular);
        font2.equalsTo(font3);
        font2.equalsTo(font2);
        font2.equalsTo(null);
        font3.metrics.name = 'Helvetica';
        it('-font3.Name == Helvetica', () => {
            expect(font3.name).toEqual('Helvetica');
        })
        font3.getLineWidth('Testing', format);
    })
})