/**
 * spec document for PdfPageSettings.ts class
 */
import { PdfPageSettings } from '../../../../src/implementation/pages/pdf-page-settings';
import { PdfPageSize } from '../../../../src/implementation/pages/pdf-page-size';
import { PdfPageOrientation, PdfPageRotateAngle } from '../../../../src/implementation/pages/enum';
import { PdfMargins, PointF, SizeF } from "../../../../src/index";
describe('PdfPageSettings.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfPageSettings = new PdfPageSettings();
        it('-Size != PdfPageSize.A4', () => {
            expect(t1.size).toEqual(PdfPageSize.a4);
        })
        it('-Set Size', () => {
            t1.size = PdfPageSize.a4;
            expect(t1.size).not.toBeUndefined();
        })
        it('-orientation != PdfPageOrientation.Portrait', () => {
            expect(t1.orientation).toEqual(PdfPageOrientation.Portrait);
        })
        it('-Set orientation', () => {
            t1.orientation = PdfPageOrientation.Portrait;
            expect(t1.orientation).toEqual(PdfPageOrientation.Portrait);
            t1.orientation = PdfPageOrientation.Landscape;
        })
        it('-Set rotate', () => {
            t1.rotate = PdfPageRotateAngle.RotateAngle180;
            expect(t1.rotate).toEqual(PdfPageRotateAngle.RotateAngle180);
            t1.rotate = PdfPageRotateAngle.RotateAngle0;
        })
        it('-margins != undefined', () => {
            expect(t1.margins).not.toBeUndefined();
        })
        it('-Set margins', () => {
            t1.margins = new PdfMargins();
            expect(t1.margins).not.toBeUndefined();
        })
        it('-width != undefined', () => {
            expect(t1.width).not.toBeUndefined();
        })
        it('-Set width', () => {
            t1.width = 50;
            expect(t1.width).not.toBeUndefined();
        })
        it('-height != undefined', () => {
            expect(t1.height).not.toBeUndefined();
        })
        it('-Set height', () => {
            t1.height = 50;
            expect(t1.height).not.toBeUndefined();
        })
        it('-origin != undefined', () => {
            expect(t1.origin).not.toBeUndefined();
        })
        it('-Set origin', () => {
            t1.origin = new PointF();
            expect(t1.origin).not.toBeUndefined();
        })
        it('-this.Clone() method calling', () => {
            let settings : PdfPageSettings = new PdfPageSettings();
            settings.margins = t1.margins.clone();
            expect(settings).not.toBeUndefined();
        })
        t1.getActualSize();
        let t2 : PdfPageSettings = new PdfPageSettings();
        t2.orientation = PdfPageOrientation.Portrait;
        it('-Set Size', () => {
            t2.size = PdfPageSize.a3;
        })
        it('this.GetActualSize() method calling', () => {
            let width : number;
            let height : number;
            let size : SizeF = new SizeF(width, height);
            expect(size).not.toBeUndefined();
        })
    })
})