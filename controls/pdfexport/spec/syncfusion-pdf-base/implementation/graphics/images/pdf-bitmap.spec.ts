/**
 * spec document for PdfBitmap.ts class
 */

import { PdfBitmap } from "../../../../../src/implementation/graphics/images/pdf-bitmap";

describe('PdfBitmap.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfBitmap = new PdfBitmap('test');
        t1.save();
    })
})