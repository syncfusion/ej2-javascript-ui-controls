/**
 * spec document for PdfPen.ts class
 */

import { PdfPen, PdfLineJoin, PdfColor, PdfDashStyle, PdfColorSpace, PdfBrush, PdfStreamWriter, PdfStream, GetResourceEventHandler, PdfTransformationMatrix, PdfSolidBrush } from "../../../../src/index";
describe('PdfPen.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        it('-Color != undefined', () => {
            expect(t1.color).not.toBeUndefined();
        })
        it('-Set Color', () => {
            t1.color = new PdfColor();
            expect(t1.color).not.toBeUndefined();
        })
        it('-DashOffset != undefined', () => {
            expect(t1.dashOffset).not.toBeUndefined();
        })
        it('-Set dashStyle == null, and Get == 0', () => {
            t1.dashOffset = null;
            expect(t1.dashOffset).toEqual(0);
        })
        it('-Set dashStyle', () => {
            t1.dashStyle = PdfDashStyle.Custom;
            expect(t1.dashStyle).toEqual(PdfDashStyle.Custom);
            t1.dashStyle = PdfDashStyle.Dash;
            expect(t1.dashStyle).toEqual(PdfDashStyle.Dash);
             t1.dashStyle = PdfDashStyle.DashDot;
            expect(t1.dashStyle).toEqual(PdfDashStyle.DashDot);
            t1.dashStyle = PdfDashStyle.DashDotDot;
            expect(t1.dashStyle).toEqual(PdfDashStyle.DashDotDot);
             t1.dashStyle = PdfDashStyle.Dot;
            expect(t1.dashStyle).toEqual(PdfDashStyle.Dot);
            t1.dashStyle = PdfDashStyle.Solid;
            expect(t1.dashStyle).toEqual(PdfDashStyle.Solid);
        })
        it('-this.Clone()', () => {
            let pen : PdfPen = t1;
            expect(pen).not.toBeUndefined();
        })
        let color : PdfColor = new PdfColor();
        let t2 : PdfPen = new PdfPen(color);
        let brush : PdfSolidBrush = new PdfSolidBrush(color);
        let t3 : PdfPen = new PdfPen(brush, 10);

        it('-Set dashStyle', () => {
            let value : PdfDashStyle;
            t1.dashStyle = value;
            expect(t1.dashStyle).toEqual(PdfDashStyle.Solid);
        })

        let value : PdfColorSpace;
        let stream : PdfStream = new PdfStream();
        let streamWriter : PdfStreamWriter = new PdfStreamWriter(stream);
        let getResources : GetResourceEventHandler;
        let matrix : PdfTransformationMatrix = new PdfTransformationMatrix();
        t3.width = 3;
        t3.monitorChanges(t1, streamWriter, getResources, false, value, matrix);
        it('-monitorChanges() when mitterlimit > 0', () => {
            t3.miterLimit = 3;
            expect(t3.monitorChanges(t1, streamWriter, getResources, false, value, matrix)).toEqual(true);
        })
        it('-monitorChanges() when currentpen == null', () => {
            expect(t3.monitorChanges(null, streamWriter, getResources, false, value, matrix)).toEqual(true);
        })
        let t4 : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
        t4.dashPattern = [2, 3, 1];
        t4.lineJoin = PdfLineJoin.Bevel;
    })
})