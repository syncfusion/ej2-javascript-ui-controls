/**
 * spec document for PdfUriAnnotation.ts class
 */

import { PdfUriAnnotation, PdfAction, PdfUriAction } from "../../../../src/implementation/index";
import { RectangleF, PointF, SizeF } from "../../../../src/index";

describe('PdfUriAnnotation.ts', () => {
    describe('Constructor initializing',()=> {
        let rect : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(40, 50));
        let t1 : PdfUriAnnotation = new PdfUriAnnotation(rect);
        it('-uri != undefined', () => {
            expect(t1.uri).not.toBeUndefined();
        })
        it('-action != undefined', () => {
            expect(t1.action).not.toBeUndefined();
        })
        let value : PdfUriAction = new PdfUriAction('test');
        let uriAction : PdfUriAction = new PdfUriAction();
        it('-Set action', () => {   
            t1.action = value;
            expect(t1.action).not.toBeUndefined();
        })
        it('-Set Uri', () => {
            value.uri = 'uriAction';
            expect(value.uri).not.toBeUndefined();
        })
        it('-Next != undefined', () => {
            expect(value.next).not.toBeUndefined();
        })
        it('-Set Next', () => {
            uriAction.next = value;
            expect(uriAction.next).not.toBeUndefined();
        })
        let t2 : PdfUriAnnotation = new PdfUriAnnotation(rect, 'test');
    })
})