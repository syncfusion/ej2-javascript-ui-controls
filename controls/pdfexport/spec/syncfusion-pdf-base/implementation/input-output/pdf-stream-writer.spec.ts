/**
 * spec document for PdfStreamWriter.ts class
 */
import { PdfStreamWriter, PdfFontFamily, PdfStream, PointF, PdfName, PdfFont, PdfStandardFont } from '../../../../src/index';
describe('PdfStreamWriter.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfStreamWriter = new PdfStreamWriter(new PdfStream());
        t1.setGraphicsState('testing');
        t1.clipPath(true);
        t1.closeFillStrokePath(true);
        t1.closeFillStrokePath(false);
        t1.fillPath(true);
        t1.fillPath(false);
        t1.fillStrokePath(true);
        t1.fillStrokePath(false);
        t1.endPath();
        t1.closeFillPath(true);
        t1.closeFillPath(false);
        t1.closeStrokePath();
        t1.startNextLine();
        t1.startNextLine(new PointF(10, 10));
        t1.appendLineSegment(new PointF(10, 10));
        t1.showNextLineText('testing', true);
        t1.showNextLineText('testing', false);
        it('-SetColorSpace(null, false) - throw error', () => {
            expect(function (): void {t1.setColorSpace(null, false)}).toThrowError();
        })
        it('-ModifyCtm(null) - throw error', () => {
            expect(function (): void {t1.modifyCtm(null)}).toThrowError();
        })
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 10)
        t1.setFont(font, 'testing', 20);
        it('-SetFont(null, new PdfName(testing) - throw error', () => {
            expect(function (): void {t1.setFont(null, new PdfName('testing'), 20)}).toThrowError();
        })
        it('-ShowNextLineText(empty string, true) - throw error', () => {
            expect(function (): void {t1.showNextLineText('', true)}).toThrowError();
        })
        it('-ShowNextLineText(null) - throw error', () => {
            expect(function (): void {t1.showNextLineText(null)}).toThrowError();
        })
        it('-WriteComment(empty string) - throw error', () => {
            expect(function (): void {t1.writeComment('')}).toThrowError();
        })
        t1.setLineDashPattern([1, 2, 3], 2);
        it('Position != undefined', () => {
            expect(t1.position).not.toBeUndefined();
        })
        it('Length != undefined', () => {
            expect(t1.length).not.toBeUndefined();
        })
        it('Document == null', () => {
            expect(t1.document).toBeNull();
        })
    })
})