/**
 * spec document for PdfActionLinkAnnotation.ts class
 */
import { PdfUriAnnotation, PdfActionLinkAnnotation, PdfAction, PdfUriAction } from "../../../../src/index";
import { RectangleF } from "../../../../src/index";

describe('PdfActionLinkAnnotation.ts', () => {
    describe('Constructor initializing',()=> {
        let rect : RectangleF = new RectangleF();
        let t1 : PdfActionLinkAnnotation = new PdfUriAnnotation(rect);
        let action : PdfAction = t1.getSetAction() as PdfAction;
        t1.getSetAction(action as PdfAction);
        it('-Action != undefined', () => {
            expect(t1.getSetAction()).not.toBeUndefined();
        })
    })
})