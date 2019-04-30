/**
 * spec document for PdfCatalog.ts class
 */
import { PdfCatalog } from '../../../../src/implementation/document/pdf-catalog';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfSectionCollection } from '../../../../src/implementation/pages/pdf-section-collection';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfReference, PdfReferenceHolder } from '../../../../src/implementation/primitives/pdf-reference';

//import { PdfPage } from '../../../../src/implementation/Pages/PdfPage';
describe('PdfCatalog.ts',()=> {
    describe('Constructor initializing',()=> {
        let dictionaryProperties : DictionaryProperties = new DictionaryProperties();
        let t1 : PdfCatalog = new PdfCatalog();
        it('-Pages != undefined', () => {
            expect(t1.pages).not.toBeUndefined();
        })
        it('-Pages != null', () => {
            expect(t1.pages).not.toBeNull();
        })
        it('-t1.Items.setValue(DictionaryProperties.Type,new PdfName.PdfName("Catalog")) is called', () => {
            expect(t1.items.getValue(dictionaryProperties.type)).toEqual(new PdfName("Catalog"));
        })
        let sc:PdfSectionCollection = new PdfSectionCollection(new PdfDocument);
        t1.pages = sc;
        it('-t1.Pages == sc', () => {
            expect(t1.pages).toEqual(sc);
        })
        it('-t1.Items.setValue(DictionaryProperties.DictionaryProperties.Pages,new Reference.PdfReferenceHolder(value)) is called', () => {
            expect(t1.items.getValue(dictionaryProperties.pages)).toEqual(new PdfReferenceHolder(sc));
        })
    })
    describe('Constructor initializing',()=> {
        let t1 : PdfCatalog = new PdfCatalog();
        it('-Pages != undefined', () => {
            expect(t1.pages).not.toBeUndefined();
        })
    })
})