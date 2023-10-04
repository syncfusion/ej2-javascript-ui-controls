/**
 * spec document for PdfUnitConverter.ts class
 */
import { PdfGraphicsUnit, PointF, SizeF, RectangleF } from "../../../../src/index";
import { PdfUnitConverter } from "../../../../src/implementation/graphics/unit-convertor";

describe('PdfUnitConverter.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfUnitConverter = new PdfUnitConverter(10);
        let t2 : PdfUnitConverter = new PdfUnitConverter(20);
        let point : PointF = new PointF(10, 10);
        let size : SizeF = new SizeF(30, 30);
        let rect : RectangleF = new RectangleF(point, size);
        t1.convertUnits(10, PdfGraphicsUnit.Point, PdfGraphicsUnit.Pixel);
        t1.convertToPixels(10, PdfGraphicsUnit.Point);
        t1.convertToPixels(20, PdfGraphicsUnit.Centimeter);
        t1.convertToPixels(10, PdfGraphicsUnit.Inch);
        t1.convertToPixels(20, PdfGraphicsUnit.Millimeter);
    })
})