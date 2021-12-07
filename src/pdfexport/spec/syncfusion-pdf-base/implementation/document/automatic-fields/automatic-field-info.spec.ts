/**
 * spec document for PdfPageNumberFieldInfo.ts class
 */
import { PdfAutomaticFieldInfo } from '../../../../../src/implementation/document/automatic-fields/automatic-field-info';
import { PdfPageNumberField } from '../../../../../src/implementation/document/automatic-fields/pdf-page-number-field';
import { PdfFont, PdfFontFamily, PdfStandardFont, PointF } from '../../../../../src/index';
describe('PdfPageNumberFieldInfo.ts',()=> {
    describe('Constructor initializing',()=> {
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        let pageNumber : PdfPageNumberField = new PdfPageNumberField(font)
        let obj1 : PdfAutomaticFieldInfo = new PdfAutomaticFieldInfo(pageNumber, new PointF(20, 10), 2, 3);
        let obj2 : PdfAutomaticFieldInfo = new PdfAutomaticFieldInfo(obj1);
        it('Set Location(null)', () => {
            obj1.location = null;
            expect(obj1.location).toBeNull();
        })
        it('Set Field(null)', () => {
            obj1.field = null;
            expect(obj1.field).toBeNull();
        })
        it('Set ScalingY(null)', () => {
            obj1.scalingY = null;
            expect(obj1.scalingY).toBeNull();
        })
        it('Set ScalingX(null)', () => {
            obj1.scalingX = null;
            expect(obj1.scalingX).toBeNull();
        })
    })
})