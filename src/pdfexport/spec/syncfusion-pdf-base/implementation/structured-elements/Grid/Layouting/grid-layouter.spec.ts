/**
 * spec document for PdfGrid.ts class
 */
import { PdfStandardFont, PdfWordWrapType, PdfSolidBrush } from "../../../../../../src/index";
import { PdfDocument, PdfPage, PdfLayoutFormat, PdfGraphics, PdfLayoutResult } from "../../../../../../src/index";
import { PdfCancelEventArgs, BeginPageLayoutEventArgs, EndPageLayoutEventArgs } from "../../../../../../src/index";
import { PdfGridBeginCellDrawEventArgs, PdfGridEndCellDrawEventArgs } from "../../../../../../src/index";
import { PdfGridEndPageLayoutEventArgs, PdfGridBeginPageLayoutEventArgs } from "../../../../../../src/index";
import { PdfGridLayoutFormat, PdfGrid, RowLayoutResult, PdfGridLayoutResult } from "../../../../../../src/index";
import { PdfGridStyle, PdfGridCellStyle } from "../../../../../../src/index";
import { PdfGridRow } from "../../../../../../src/index";
import { PdfPen, PdfColor, PdfStringFormat, PdfLayoutParams } from "../../../../../../src/index";
import { RectangleF, PointF, SizeF, PdfBitmap } from '../../../../../../src/index';

describe('PdfGridLayoutFormat.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfGridLayoutFormat = new PdfGridLayoutFormat();
        let layout : PdfLayoutFormat = new PdfLayoutFormat();
        let t2 : PdfGridLayoutFormat = new PdfGridLayoutFormat(layout);
    })
})

describe('RowLayoutResult.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : RowLayoutResult = new RowLayoutResult();
        it('-isFinish == false', () => {
            expect(t1.isFinish).toBeFalsy();
        })
        it('-Set isFinish', () => {
            t1.isFinish = false;
            expect(t1.isFinish).toBeFalsy();
        })
        it('-bounds != undefined', () => {
            expect(t1.bounds).not.toBeUndefined();
        })
        it('-Set bounds', () => {
            let value : RectangleF = new RectangleF();
            t1.bounds = value;
            expect(t1.bounds).not.toBeUndefined();
        })
    })
})

describe('PdfGridLayoutResult.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 20));
        let t1 : PdfGridLayoutResult = new PdfGridLayoutResult(page, rect);
    })
})

describe('PdfGridBeginCellDrawEventArgs.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let style : PdfGridCellStyle = new PdfGridCellStyle();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 20));
        let t1 : PdfGridBeginCellDrawEventArgs = new PdfGridBeginCellDrawEventArgs(graphics,2, 2, rect, 'grid test', style);
        it('-cellIndex == 2', () => {
            expect(t1.cellIndex).toEqual(2);
        })
        it('-value != undefined', () => {
            expect(t1.value).not.toBeUndefined();
        })
        it('-skip == false', () => {
            expect(t1.value).toEqual('grid test');
        })
        it('-Set skip', () => {
            t1.skip = true;
            expect(t1.skip).toBeTruthy();
        })
        it('-Set style', () => {
            t1.style = style;
            expect(t1.style).not.toBeUndefined();
        })
    })
})

describe('PdfGridEndCellDrawEventArgs.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let graphics : PdfGraphics = page.graphics;
        let style : PdfGridCellStyle = new PdfGridCellStyle();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 20));
        let t1 : PdfGridEndCellDrawEventArgs = new PdfGridEndCellDrawEventArgs(graphics,2, 2, rect, 'grid test', style);
        it('-style != undefined', () => {
            expect(t1.style).not.toBeUndefined();
        })
    })
})

describe('PdfCancelEventArgs.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfCancelEventArgs = new PdfCancelEventArgs();
        it('-Set cancel', () => {
            t1.cancel = false;
            expect(t1.cancel).toBeFalsy();
        })
    })
})

describe('BeginPageLayoutEventArgs.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 20));
        let t1 : BeginPageLayoutEventArgs = new BeginPageLayoutEventArgs(rect, page);
        it('-Set bounds', () => {
            t1.bounds = rect;
            expect(t1.bounds).not.toBeUndefined();
        })
        it('-page != undefined', () => {
            expect(t1.page).not.toBeUndefined();
        })
    })
})

describe('EndPageLayoutEventArgs.ts', () => {
    describe('Constructor initializing',()=> {
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 20));
        let result : PdfLayoutResult = new PdfLayoutResult(page, rect);
        let t1 : EndPageLayoutEventArgs = new EndPageLayoutEventArgs(result);
        it('-nextPage == undefined', () => {
            expect(t1.nextPage).toBeUndefined();
        })
    })
})