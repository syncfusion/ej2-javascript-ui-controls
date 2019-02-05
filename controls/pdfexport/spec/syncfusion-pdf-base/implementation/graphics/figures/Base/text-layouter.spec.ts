/**
 * spec document for TextLayouter.ts class
 */

import { PdfLayoutParams, TextLayouter, PdfTextElement, PdfTextLayoutResult, TextPageLayoutResult } from "../../../../../../src/implementation/index";
import { PdfDocument, PdfPage, PdfFont, PdfStandardFont } from "../../../../../../src/index";
import { PdfTextWebLink, RectangleF, PointF, SizeF } from "../../../../../../src/index";

describe('TextLayouter.ts', () => {
    describe('Constructor initializing',()=>{
        let textElement : PdfTextElement = new PdfTextElement();
        textElement.text = 'Testing \t';
        let t1 : TextLayouter = new TextLayouter(textElement);
        it('-Element != undefined', () => {
            expect(t1.element).not.toBeUndefined();
        })

        // let param1 : PdfLayoutParams = new PdfLayoutParams();
        // param1.Format.PaginateBounds = new RectangleF();
        // t1.GetPaginateBounds(param1);
        // let param2 : PdfLayoutParams = new PdfLayoutParams();
        // t1.GetPaginateBounds(param2);
    })
})

describe('PdfTextLayoutResult.ts', () => {
    describe('Constructor initializing',()=>{
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(50, 50));
        let t1 : PdfTextLayoutResult = new PdfTextLayoutResult(page, rect, 'test', rect);
        it('-Remainder != undefined', () => {
            expect(t1.remainder).not.toBeUndefined();
        })
        it('-LastLineBounds != undefined', () => {
            expect(t1.lastLineBounds).not.toBeUndefined();
        })
    })
})

describe('TextPageLayoutResult.ts', () => {
    describe('Constructor initializing',()=>{
        let t1 : TextPageLayoutResult = new TextPageLayoutResult();
    })
})