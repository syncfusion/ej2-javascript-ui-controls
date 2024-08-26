/**
 * spec document for PdfCatchCollection.ts class
 */
import { PdfCacheCollection, PdfFont, PdfFontFamily, PdfStandardFont } from "../../../../src/index";

describe('PdfCacheCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfCacheCollection = new PdfCacheCollection();
        let font1 : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
        let font2 : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
        let font3 : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10);
        t1.search(font1);
        t1.removeGroup(t1.getGroup(font1));
        t1.createNewGroup();
        t1.search(font2);
        t1.getGroup(null);
        t1.removeGroup(null);
    })
})