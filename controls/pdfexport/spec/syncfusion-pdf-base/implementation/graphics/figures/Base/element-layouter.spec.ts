/**
 * spec document for TextLayouter.ts class
 */

import { PdfTextElement, TextLayouter, PdfLayoutParams, PdfLayoutFormat, PdfLayoutResult } from "../../../../../../src/implementation/index";
import { PdfDocument, PdfPage, RectangleF, PointF, SizeF } from "../../../../../../src/index";
import { PdfLayoutType, PdfLayoutBreakType } from "../../../../../../src/implementation/graphics/figures/enum";

describe('TextLayouter.ts', () => {
    describe('Constructor initializing',()=>{
        let textElement : PdfTextElement = new PdfTextElement();
        let t1 : TextLayouter = new TextLayouter(textElement);
        it('-Elements != undefined', () => {
            expect(t1.elements).not.toBeUndefined();
        })
        t1.getElement();
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        t1.getNextPage(page);
    })
})

describe('PdfLayoutFormat.ts', () => {
    describe('Constructor initializing',()=>{
        let t1 : PdfLayoutFormat = new PdfLayoutFormat();
        let t2 : PdfLayoutFormat = new PdfLayoutFormat(t1);
        it('-Layout != undefined', () => {
            expect(t1.layout).toBeUndefined();
        })
        it('-Set Layout', () => {
            t1.layout = PdfLayoutType.OnePage;
            expect(t1.layout).toEqual(PdfLayoutType.OnePage);
        })
        it('-Break != undefined', () => {
            expect(t1.break).toBeUndefined();
        })
        it('-Set Break', () => {
            t1.break = PdfLayoutBreakType.FitElement;
            expect(t1.break).toEqual(PdfLayoutBreakType.FitElement);
        })
        it('-PaginateBounds != undefined', () => {
            expect(t1.paginateBounds).not.toBeUndefined();
        })
        it('-Set PaginateBounds', () => {
            t1.paginateBounds = new RectangleF();
            expect(t1.paginateBounds).not.toBeUndefined();
        })
        it('-UsePaginateBounds == false', () => {
            expect(t1.usePaginateBounds).not.toBeUndefined();
        })
    })
})

describe('PdfLayoutParams.ts', () => {
    describe('Constructor initializing',()=>{
        let t1 : PdfLayoutParams = new PdfLayoutParams();
        it('-Page == undefined', () => {
            expect(t1.page).toBeUndefined();
        })
        it('-Set Page', () => {
            let value : PdfPage = new PdfPage();
            t1.page = value;
            expect(t1.page).not.toBeUndefined();
        })
        it('-Format == undefined', () => {
            expect(t1.format).toBeUndefined();
        })
        it('-Set Format', () => {
            t1.format = new PdfLayoutFormat();
            expect(t1.format).not.toBeUndefined();
        })
        // it('-Bounds != undefined', () => {
        //     expect(t1.Bounds).not.toBeUndefined();
        // })
        it('-Set Bounds', () => {
            t1.bounds = new RectangleF();
            expect(t1.bounds).not.toBeUndefined();
        })
    })
})

describe('PdfLayoutResult.ts', () => {
    describe('Constructor initializing',()=>{
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(30, 30));
        let t1 : PdfLayoutResult = new PdfLayoutResult(page, rect);
        it('-Page != undefined', () => {
            expect(t1.page).not.toBeUndefined();
        })
        it('-Bounds != undefined', () => {
            expect(t1.bounds).not.toBeUndefined();
        })
    })
})