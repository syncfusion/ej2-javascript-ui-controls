/**
 * spec document for PdfOperators.ts class
 */
import { Operators } from '../../../../src/implementation/input-output/pdf-operators';
describe('PdfOperators.ts',()=> {
    describe('Constructor initializing',()=> {
        let t1 : Operators = new Operators();
        it('- Operators.obj', () => {
            expect(Operators.obj).not.toBeUndefined();
        })
    })
})