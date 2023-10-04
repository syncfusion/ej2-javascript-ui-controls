/**
 * spec document for PdfPageBase.ts class
 */
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { PdfResources, PdfDocument, PdfPage, PdfPageLayer } from "../../../../src/index";
describe('PdfPageBase.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfDictionary = new PdfDictionary();
        let document : PdfDocument = new PdfDocument();
        let t2 : PdfPage = document.pages.add();
        it('Set defaultLayerIndex', () => {
            expect(function (): void {t2.defaultLayerIndex = 0; }).toThrowError();
        })
        it('Set defaultLayerIndex == 0 & get defaultLayerIndex == 0', () => {
            expect(t2.layers).not.toBeUndefined();
            t2.layers.add(new PdfPageLayer(t2));
            expect(t2.layers.count).toEqual(1);
            t2.defaultLayerIndex = 0;
            expect(t2.defaultLayerIndex).toEqual(0);
        })
        let resources : PdfResources = new PdfResources(t1);
        t2.setResources(resources);
    })
})