/**
 * spec document for PdfPageSize.ts class
 */
import { PdfPageSize } from '../../../../src/implementation/pages/pdf-page-size';
describe('PdfOperators.ts',()=> {
    describe('Constructor initializing',()=> {
        let t1 : PdfPageSize = new PdfPageSize();
        it('- Operators.obj', () => {
            expect(PdfPageSize.a0).not.toBeUndefined();
        })
    })
})