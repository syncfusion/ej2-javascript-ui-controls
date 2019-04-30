/**
 * spec document for PdfSectionCollection.ts class
 */
import { PdfSectionCollection } from '../../../../src/implementation/pages/pdf-section-collection';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfNumber } from '../../../../src/implementation/primitives/pdf-number';
import { PdfArray } from '../../../../src/implementation/primitives/pdf-array';
import { RectangleF, PointF } from '../../../../src/implementation/drawing/pdf-drawing';
import { PdfSection } from '../../../../src/index';
describe('PdfSectionCollection.ts',()=>{
    describe('Constructor initializing',()=>{
        let dictionaryProperties : DictionaryProperties = new DictionaryProperties();
        let t1 : PdfDocument = new PdfDocument()
        let t2 : PdfSectionCollection = new PdfSectionCollection(t1)
        it('-Document != undefined', () => {
            expect(t2.document).not.toBeUndefined();
        })
        it('-t2.element.DictionaryProperties.DictionaryProperties.Type == new Name.PdfName("Pages")', () => {
            expect((t2.element as PdfDictionary).items.getValue(dictionaryProperties.type)).toEqual(new PdfName("Pages"));
        })
        it('-t2.element.DictionaryProperties.DictionaryProperties.Kids == new PdfArray.PdfArray()', () => {
            expect((t2.element as PdfDictionary).items.getValue(dictionaryProperties.kids)).toEqual(new PdfArray());
        })
        it('-t2.element.DictionaryProperties.DictionaryProperties.Count == new PdfNumber.PdfNumber(0)', () => {
            expect((t2.element as PdfDictionary).items.getValue(dictionaryProperties.count)).toEqual(new PdfNumber(0));
        })
        it('-t2.element.DictionaryProperties.DictionaryProperties.Type == new Name.PdfName("Pages")', () => {
            expect((t2.element as PdfDictionary).items.getValue(dictionaryProperties.resources)).toEqual(new PdfDictionary());
        })
        let bounds : RectangleF = new RectangleF(new PointF(),t2.document.pageSettings.size);
        it('-t2.element.DictionaryProperties.DictionaryProperties.MediaBox == PdfArray.PdfArray.FromRectangle(bounds)', () => {
            expect((t2.element as PdfDictionary).items.getValue(dictionaryProperties.mediaBox)).toEqual(PdfArray.fromRectangle(bounds));
        })
        it('-this.PdfSectionCollection(number) method calling', () => {
            expect(function() : void {t2.pdfSectionCollection(-1); }).toThrowError();
        })
    })
})