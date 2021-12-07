/**
 * spec document for PdfSolidBrush.ts class
 */
import { PdfColor, PdfSolidBrush, PdfStream, PdfStreamWriter, GetResourceEventHandler, PdfColorSpace } from "../../../../../src/index";
describe('PdfSolidBrush.ts', () => {
    describe('Constructor initializing',()=> {
        let color : PdfColor = new PdfColor();
        let t1 : PdfSolidBrush = new PdfSolidBrush(color);
        let t2 : PdfSolidBrush = new PdfSolidBrush(color);
        it('-Set Color', () => {
            t1.color = color;
            expect(t1.color).not.toBeUndefined();
        })
        let stream : PdfStream = new PdfStream();
        let streamWriter: PdfStreamWriter = new PdfStreamWriter(stream);
        t1.resetChanges(streamWriter);
        it('-this.resetChanges(PdfStreamWriter) method calling', () => {
            expect(t1.resetChanges(streamWriter)).toBeUndefined();
        })
        let resources : GetResourceEventHandler;
        let value : PdfColorSpace.Rgb;
        let brush : PdfSolidBrush = null;
        it('-this.monitorChanges(PdfBrush, PdfStreamWriter,GetResourceEventHandler,boolean, PdfColorSpace) method calling', () => {
            expect(function (): void {t1.monitorChanges(t2, null, resources, true, value); }).toThrowError();
        })
        t1.monitorChanges(brush, streamWriter, resources, true, value);
        t1.monitorChanges(new PdfSolidBrush(new PdfColor(0, 255, 255)), streamWriter, resources, true, value);
    })
})