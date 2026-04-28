import { CryptographicStandard, DigestAlgorithm } from '../src/pdf/core/enumerator';
import { PdfSignatureField } from '../src/pdf/core/form/field';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfSignature } from '../src/pdf/core/security/digital-signature/signature/pdf-signature';
import { PDfpfx } from './inputs.spec';
describe('Stability - issues', () => {
    it('1010353 - Signature lock property issue', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const sign: PdfSignature = PdfSignature.create(
            PDfpfx, 'password123', {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            isLocked: true
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let update1 = document.save();
        document = new PdfDocument(update1);
        field = document.form.fieldAt(0) as PdfSignatureField;
        expect(field._dictionary.has('Lock')).toBeTruthy();
        const lock = field._dictionary.get('Lock');
        expect(lock.get('Action').name).toEqual('All');
        expect(lock.get('P')).toEqual(1);
        expect(lock.get('Type').name).toEqual('SigFieldLock');
        document.destroy();
    });
});