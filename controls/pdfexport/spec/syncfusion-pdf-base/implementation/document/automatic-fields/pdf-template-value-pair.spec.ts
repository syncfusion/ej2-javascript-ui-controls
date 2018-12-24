/**
 * spec document for PdfTemplateValuePair.ts class
 */
import { PdfTemplateValuePair } from '../../../../../src/implementation/document/automatic-fields/pdf-template-value-pair';
describe('PdfTemplateValuePair.ts',()=> {
    describe('Constructor initializing',()=> {
        let pageTemplate : PdfTemplateValuePair = new PdfTemplateValuePair();
        it('Set Template(null)', () => {
            pageTemplate.template = null;
            expect(pageTemplate.template).toBeNull();
        })
        it('Set Value(null)', () => {
            pageTemplate.value = null;
            expect(pageTemplate.value).toBeNull();
        })
    })
})