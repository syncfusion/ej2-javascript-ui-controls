import { CryptographicStandard, DigestAlgorithm } from "./../src/pdf/core/enumerator";
import { PdfSignatureField } from "./../src/pdf/core/form/field";
import { PdfBitmap } from "./../src/pdf/core/graphics/images/pdf-bitmap";
import { PdfDocument } from "./../src/pdf/core/pdf-document";
import { PdfSignature } from "./../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { PDfpfx, template } from "./inputs.spec";
import { logo } from "./image-input.spec";

describe('Security', () => {
    type SigCase = { title: string; cryptographicStandard: CryptographicStandard; digestAlgorithm: DigestAlgorithm; };
    const cases = [
        { title: 'Digital Signature - sha256 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha256 },
        { title: 'Digital Signature - ripemd160 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.ripemd160 },
        { title: 'Digital Signature - sha384 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha384 },
        { title: 'Digital Signature - sha1 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha1 },
        { title: 'Digital Signature - sha512 -cades', cryptographicStandard: CryptographicStandard.cades, digestAlgorithm: DigestAlgorithm.sha512 },
        { title: 'Digital Signature - sha256 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 },
        { title: 'Digital Signature - ripemd160 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.ripemd160 },
        { title: 'Digital Signature - sha384 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha384 },
        { title: 'Digital Signature - sha1 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha1 },
        { title: 'Digital Signature - sha512 -cms', cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha512 }
    ];
    for (const tc of cases) {
        it(tc.title, () => {
            const pdf = new PdfDocument(template);
            expect(pdf).toBeDefined();
            const page = pdf.getPage(0);
            const sigX = 20;
            const sigY = 20;
            const sigW = 200;
            const sigH = 100;
            const signatureField = new PdfSignatureField(page, 'Signature', { x: sigX, y: sigY, width: sigW, height: sigH });
            const sigOptions = { cryptographicStandard: tc.cryptographicStandard, digestAlgorithm: tc.digestAlgorithm, contactInfo: 'johndoe@owned.us', locationInfo: 'Honolulu, Hawaii', reason: 'I am author of this document.' };
            const signature = PdfSignature.create(PDfpfx, 'password123', sigOptions);
            expect(signature).toBeDefined();
            signatureField.setSignature(signature);
            expect(signature._digestAlgorithm).toEqual(tc.digestAlgorithm);
            expect(signature._cryptographicStandard).toEqual(tc.cryptographicStandard);
            pdf.form.add(signatureField);
            if (logo) {
                const app = signatureField.getAppearance();
                const lx = 20;
                const ly = 20;
                const lw = 120;
                const lh = 50;
                const logoBmp = new PdfBitmap(logo);
                app.normal.graphics.drawImage(logoBmp, { x: lx, y: ly, width: lw, height: lh });
            }
            const bytes = pdf.save();
            pdf.destroy();
            const parsed = new PdfDocument(bytes);
            const parsedForm = parsed.form;
            const parsedSignatureField = parsedForm.fieldAt(parsedForm._fields.length - 1);
            const valueDictionary = parsedSignatureField._dictionary.get('V');
            const ByteRange = valueDictionary.get('ByteRange');
            expect(ByteRange).toBeDefined();
            expect(ByteRange.length).toEqual(4);
            expect(valueDictionary.get('ContactInfo')).toEqual('johndoe@owned.us');
            expect(valueDictionary.get('Location')).toEqual('Honolulu, Hawaii');
            expect(valueDictionary.get('Reason')).toEqual('I am author of this document.');
            expect(valueDictionary.get('Type').name).toEqual('Sig');
            expect(valueDictionary.get('Contents')).toBeDefined();
            parsed.destroy();
        });
    }

});