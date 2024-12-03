/**
 * spec document for PdfTransparency.ts class
 */
import { PdfTransparency, PdfBlendMode } from '../../../../src/index';

describe('PdfTransparency.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfTransparency = new PdfTransparency(0, 1, PdfBlendMode.Normal);
        it('-element != undefined', () => {
            expect(t1.element).not.toBeUndefined();
        })
    })
})