import { PdfFreeTextAnnotation } from "../src/pdf/core/annotations/annotation";
import { CryptographicStandard, DigestAlgorithm, PdfCertificationFlag, SignatureStatus } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfCheckBoxField, PdfSignatureField, PdfTextBoxField } from "../src/pdf/core/form/field";
import { PdfBrush } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { _decode } from "../src/pdf/core/utils";
import { certchain_1, pdf_pfx, WF_55836 } from "./certificate-input.spec";
import { tenPagesInput } from "./signature-validation-input.spec";

describe('983221 - Signature validation', () => {
    it('983221 - Page content modification validation', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certchain_1;
        const password = 'moorthy';
        const sign: PdfSignature = PdfSignature.create(
            certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let update1 = document.save();
        document = new PdfDocument(update1);
        page = document.getPage(0);
        page.graphics.drawString('hello', new PdfStandardFont(PdfFontFamily.helvetica, 12), { x: 50, y: 200, width: 200, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 1 }));
        let update2 = document.save();
        document = new PdfDocument(update2);
        field = document.form.fieldAt(0) as PdfSignatureField;
        let result = field.validateSignature();
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.cryptographicStandard).toEqual(CryptographicStandard.cms);
        expect(result.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.signatureName).toEqual('field');
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        document.destroy();
    });
    it('983221 - Remove page and validate the signature', () => {
        let document: PdfDocument = new PdfDocument(tenPagesInput);
        let page = document.getPage(0);
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = WF_55836;
        const password = 'syncfusion';
        const sign: PdfSignature = PdfSignature.create(
            certData, password, {
            cryptographicStandard: CryptographicStandard.cades,
            digestAlgorithm: DigestAlgorithm.sha256,
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let update1 = document.save();
        document = new PdfDocument(update1);
        expect(document.pageCount).toEqual(10);
        document.removePage(5);
        let update2 = document.save();
        document = new PdfDocument(update2);
        field = document.form.fieldAt(0) as PdfSignatureField;
        let result = field.validateSignature();
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.cryptographicStandard).toEqual(CryptographicStandard.cades);
        expect(result.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.signatureName).toEqual('field');
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        document.destroy();
    })
    it('983221 - Annotation modification validation', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData =  pdf_pfx;
        const password = 'syncfusion';
        const sign: PdfSignature = PdfSignature.create(
            certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let annot: PdfFreeTextAnnotation = new PdfFreeTextAnnotation({ x: 50, y: 100, width: 100, height: 50 });
        annot.name = 'Free text annotation';
        annot.color = { r: 255, g: 0, b: 0 };
        page.annotations.add(annot);
        let update1 = document.save();
        document = new PdfDocument(update1);
        page = document.getPage(0);
        annot = page.annotations.at(0) as PdfFreeTextAnnotation;
        annot.name = 'Edited Name';
        let update2 = document.save();
        document = new PdfDocument(update2);
        field = document.form.fieldAt(0) as PdfSignatureField;
        let result = field.validateSignature();
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.signatureName).toEqual('field');
        expect(result.cryptographicStandard).toEqual(CryptographicStandard.cms);
        expect(result.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        document.destroy();
    });
    it('983221 - Form Field modification validation', () => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = pdf_pfx;
        const password = 'syncfusion';
        const sign: PdfSignature = PdfSignature.create(
            certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let textbox: PdfTextBoxField = new PdfTextBoxField(page, 'FirstName', { x: 10, y: 10, width: 100, height: 50 });
        document.form.add(textbox);
        let update1 = document.save();
        document = new PdfDocument(update1);
        page = document.getPage(0);
        textbox = document.form.fieldAt(1) as PdfTextBoxField;
        textbox.color = { r: 0, g: 255, b: 255 };
        let update2 = document.save();
        document = new PdfDocument(update2);
        field = document.form.fieldAt(0) as PdfSignatureField;
        let result = field.validateSignature();
        expect(result.isDocumentModified).toBeTruthy();
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.signatureName).toEqual('field');
        expect(result.cryptographicStandard).toEqual(CryptographicStandard.cms);
        expect(result.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        document.destroy();
    });
    it('983221 - Lock based validation', () => {
        let document = new PdfDocument();
        let page = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = WF_55836;
        const password = 'syncfusion';
        const sign: PdfSignature = PdfSignature.create(
            certData, password, {
            cryptographicStandard: CryptographicStandard.cms,
            digestAlgorithm: DigestAlgorithm.sha256,
            isLocked: true
        },
        );
        document.form.add(field);
        field.setSignature(sign);
        let update2 = document.save();
        document = new PdfDocument(update2);
        field = document.form.fieldAt(0) as PdfSignatureField;
        let result = field.validateSignature();
        expect(result.isDocumentModified).toBeFalsy();
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.signatureName).toEqual('field');
        expect(result.cryptographicStandard).toEqual(CryptographicStandard.cms);
        expect(result.digestAlgorithm).toEqual(DigestAlgorithm.sha256);
        expect(result.signatureStatus).toEqual(SignatureStatus.invalid);
        document.destroy();
    });
});