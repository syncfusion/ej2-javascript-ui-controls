/**
 * spec document for PdfStandardFontMetricsFactory.ts class
 */
import { PdfStandardFontMetricsFactory, PdfFontFamily, PdfFontStyle, PdfFont, PdfStandardFont  } from "../../../../../src/index";

describe('PdfStandardFontMetricsFactory.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfStandardFontMetricsFactory = new PdfStandardFontMetricsFactory();
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.Courier, PdfFontStyle.Bold, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.Courier, PdfFontStyle.Italic, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.ZapfDingbats, PdfFontStyle.Bold, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.TimesRoman, PdfFontStyle.Italic, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.Helvetica, PdfFontStyle.Bold, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.Helvetica, PdfFontStyle.Italic, 10);
        PdfStandardFontMetricsFactory.getMetrics(PdfFontFamily.Symbol, PdfFontStyle.Italic, 10);
    })
})