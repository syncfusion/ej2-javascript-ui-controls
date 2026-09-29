import { DigestAlgorithm, RevocationStatus } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { PdfBrush } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfSignatureValidationOptions } from "../src/pdf/core/pdf-type";
import { _decode, _padStart } from "../src/pdf/core/utils";
import { digitalSignatureInput, intermediate0, intermediate1, pfx1, pfx2, revocationInput_1, revocationInput_2, rootCert } from "./signature-validation-input.spec";
describe('983221 - Revocation', () => {
    it('1003729 - UG Sample', () => {
        // Load the signed PDF document
        const document = new PdfDocument(revocationInput_1);
        // Retrieve the first signature field
        const signatureField = document.form.fieldAt(0) as PdfSignatureField;
        // Load the trusted root certificate data
        const certData = _decode(pfx1);
        // Validate the signature using the provided trusted certificate collection
        const result = signatureField.validateSignature({ trustedCertificates: [certData  as Uint8Array], passwords: ['syncfusion'] });
        // Accumulate all result details into a string variable
        let output: string = '';
        // --- Timestamp Information ---
        let isTimeStampSignature: boolean = false;
        if (result.timestampInformation !== null && result.timestampInformation !== undefined) {
            if (result.timestampInformation.isDocumentTimestamp) {
                isTimeStampSignature = true;
                output += 'Signature is a document timestamp signature.\n';
            }
            const signerCertificates = result.timestampInformation.signerCertificates;
            if (signerCertificates !== null && signerCertificates !== undefined && signerCertificates.length > 0) {
                output += `Retrieved ${signerCertificates.length} signer certificate(s).\n`;
            } else {
                output += 'No signer certificates found.\n';
            }
            const certificate2 = result.timestampInformation.certificate;
            if (certificate2 !== null && certificate2 !== undefined) {
                output += `Certificate Subject: ${certificate2.subject}\n`;
            } else {
                output += 'No certificate found.\n';
            }
            const dateTime: Date = result.timestampInformation.timestampTime;
            output += `Timestamp Date: ${dateTime}\n`;
            const policyID: string = result.timestampInformation.timestampPolicyId;
            if (policyID !== null && policyID !== undefined && policyID !== '') {
                output += `Timestamp Policy ID: ${policyID}\n`;
            } else {
                output += 'No Timestamp Policy ID found.\n';
            }
            const valid: boolean = result.timestampInformation.isValid;
            output += `Timestamp Validity: ${valid ? 'Valid' : 'Invalid'}\n`;
        } else {
            output += 'TimeStampInformation is null. Cannot retrieve timestamp details.\n';
        }
        // --- Signature Status and Document Modification ---
        const status = result.signatureStatus;
        const isModified: boolean = result.isDocumentModified;
        output += `Document modified: ${isModified}\n`;
        // --- LTV Verification Information ---
        const isLtvEnabled: boolean = result.ltvVerificationInformation.isLtvEmbedded;
        const isCrlEmbedded: boolean = result.ltvVerificationInformation.isCrlEmbedded;
        const isOcspEmbedded: boolean = result.ltvVerificationInformation.isOcspEmbedded;
        output += `LTV enabled: ${isLtvEnabled}\n`;
        output += `CRL embedded: ${isCrlEmbedded}\n`;
        output += `OCSP embedded: ${isOcspEmbedded}\n`;
        // --- Signature Certificate Details ---
        const certInfo = signatureField.getSignature().getCertificateInformation();
        const issuerName: string = certInfo.issuerName;
        const validFrom: Date = certInfo.validFrom;
        const validTo: Date = certInfo.validTo;
        const signatureAlgorithm: string = result.signatureAlgorithm;
        const digestAlgorithm = result.digestAlgorithm;
        if (digestAlgorithm === DigestAlgorithm.sha256) {
            output += `Digest Algorithm: sha256\n`;
        }
        output += `Issuer Name: ${issuerName}\n`;
        output += `Valid From: ${validFrom}\n`;
        output += `Valid To: ${validTo}\n`;
        output += `Signature Algorithm: ${signatureAlgorithm}\n`;
        
        // --- Revocation Details ---
        const revocationDetails = result.revocationResult;
        const revocationStatus = revocationDetails ? revocationDetails.ocspRevocationStatus : undefined;
        const isRevokedCRL: boolean = revocationDetails ? revocationDetails.isRevokedCRL : false;
        if (revocationStatus === RevocationStatus.none) {
            output += `Revocation Status: ${'none'}\n`;
        }
        output += `Is Revoked CRL: ${isRevokedCRL}\n`;
        // Draw the accumulated output string into a new PDF document
        const outputDoc = new PdfDocument();
        const page = outputDoc.addPage();
        const font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        page.graphics.drawString(output, font, { x: 10, y: 20, width: 500, height: 700 }, brush);
        const savedData = outputDoc.save();
        outputDoc.destroy();
        // Assertions
        expect(result.signatureStatus).toBeDefined();
        expect(result.isDocumentModified).toBeDefined();
        expect(result.ltvVerificationInformation).toBeDefined();
        expect(result.signatureAlgorithm).toBeDefined();
        expect(result.digestAlgorithm).toBeDefined();
        // revocationResult is undefined when validateRevocation is not requested (matches .NET behavior)
        expect(result.revocationResult).toBeDefined();
        expect(certInfo.issuerName).toBeDefined();
        document.destroy();
    });
    it('1003729 - SB Sample', () => {
        // Load the signed PDF document
        const loaded = new PdfDocument(digitalSignatureInput);
        // Retrieve the first signature field
        const signature = loaded.form.fieldAt(0) as PdfSignatureField;
        // Load trusted certificates (Root, Intermediate0, Intermediate1)
        const rootBytes = _decode(rootCert);
        const int0Bytes = _decode(intermediate0);
        const int1Bytes = _decode(intermediate1);
        // Validate the signature using the trusted certificate collection
        const result = signature.validateSignature({
            trustedCertificates: [rootBytes as Uint8Array, int0Bytes as Uint8Array, int1Bytes as Uint8Array]
        });
        // Enum-to-string maps (matching .NET output labels)
        const statusNames: Record<number, string> = { 0: 'Invalid', 1: 'Valid', 2: 'Unknown' };
        const digestNames: Record<number, string> = { 0: 'SHA1', 1: 'SHA256', 2: 'SHA384', 3: 'SHA512', 4: 'RIPEMD160' };
        const revocNames: Record<number, string> = { 0: 'None', 1: 'Good', 2: 'Unknown', 3: 'Revoked' };
        // Format date as .NET default: M/d/yyyy h:mm:ss tt (e.g. "2/3/2021 12:34:41 PM")
        // Uses UTC getters so output matches the stored UTC value regardless of local timezone
        const formatDate = (d: Date): string => {
            if (!d || !(d instanceof Date) || isNaN(d.getTime())) { return 'undefined'; }
            const month: number = d.getUTCMonth() + 1;
            const day: number = d.getUTCDate();
            const year: number = d.getUTCFullYear();
            let hours: number = d.getUTCHours();
            const minutes: string = _padStart(d.getUTCMinutes().toString(), 2, '0');
            const seconds: string = _padStart(d.getUTCSeconds().toString(), 2, '0');
            const ampm: string = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
        };
        // Build output matching .NET StringBuilder pattern
        let output: string = '';
        output += `Signature is ${statusNames[result.signatureStatus] ? statusNames[result.signatureStatus] : result.signatureStatus}\n`;
        output += '----------Validation Summary----------\n';
        if (result.isDocumentModified) {
            output += 'The document has been altered or corrupted since the signature was applied.\n';
        } else {
            output += 'The document has not been modified since the signature was applied.\n';
        }
        // Signature certificate details — use the leaf signer cert from signerCertificates
        const leafCert = result.signerCertificates && result.signerCertificates.length > 0
            ? result.signerCertificates[0].certificate : null;
        if (leafCert) {
            output += `Digitally signed by ${leafCert.subject}\n`;
            output += `Valid From : ${formatDate(leafCert.validFrom)}\n`;
            output += `Valid To : ${formatDate(leafCert.validTo)}\n`;
        }
        output += `Signature Algorithm : ${result.signatureAlgorithm}\n`;
        output += `Hash Algorithm : ${digestNames[result.digestAlgorithm] ? digestNames[result.digestAlgorithm] : result.digestAlgorithm}\n`;
        // Revocation details
        const ocspStatus = result.revocationResult ? result.revocationResult.ocspRevocationStatus : 0;
        output += `OCSP revocation status : ${revocNames[ocspStatus] ? revocNames[ocspStatus] : ocspStatus}\n`;
        output += '\n--------Revocation Information---------\n\n';
        // Iterate signerCertificates for OCSP/CRL details
        if (result.signerCertificates) {
            for (const signerCertificate of result.signerCertificates) {
                if (signerCertificate.ocspCertificate) {
                    output += '------------OCSP Certificate-------------\n\n';
                    for (const item of signerCertificate.ocspCertificate.certificates) {
                        output += `The OCSP Response was signed by ${item.subject}\n`;
                    }
                    output += `Is Embedded: ${signerCertificate.ocspCertificate.isEmbedded}\n`;
                    output += `ValidFrom: ${formatDate(signerCertificate.ocspCertificate.validFrom)}\n`;
                    output += `ValidTo: ${formatDate(signerCertificate.ocspCertificate.validTo)}\n\n`;
                    continue;
                }
                if (signerCertificate.crlCertificate) {
                    output += '------------CRL Certificate--------------\n\n';
                    for (const item of signerCertificate.crlCertificate.certificates) {
                        output += `The CRL was signed by ${item.subject}\n`;
                    }
                    output += `Is Embedded: ${signerCertificate.crlCertificate.isEmbedded}\n`;
                    output += `ValidFrom: ${formatDate(signerCertificate.crlCertificate.validFrom)}\n`;
                    output += `ValidTo: ${formatDate(signerCertificate.crlCertificate.validTo)}\n`;
                    break;
                }
            }
        }
        // Assertions
        expect(result.signatureStatus).toBeDefined();
        expect(result.isDocumentModified).toBeFalsy();
        expect(result.signatureAlgorithm).toEqual('RSA');
        expect(result.revocationResult).toBeDefined();
        expect(result.revocationResult.ocspRevocationStatus).toBeDefined();
        expect(leafCert).toBeDefined();
        expect(leafCert.issuer).toBeDefined();
        expect(result.signerCertificates).toBeDefined();
        expect(output).toBeTruthy();
         const outputDoc = new PdfDocument();
        const page = outputDoc.addPage();
        const font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const brush = new PdfBrush({ r: 0, g: 0, b: 0 });
        page.graphics.drawString(output, font, { x: 10, y: 20, width: 500, height: 700 }, brush);
        const savedData = outputDoc.save();
        outputDoc.destroy();
        loaded.destroy();
    });
     it('1003729 - validation 6', () => {
        const document = new PdfDocument(revocationInput_2);
        const certData = _decode(pfx2);
        const options: PdfSignatureValidationOptions = {
            trustedCertificates: [certData as Uint8Array],
            passwords: ['syncfusion']
        };
        const validationResult = document.form.validateSignatures(options);
        if (validationResult.results !== null && validationResult.results !== undefined) {
            expect(validationResult.results.length).toBeGreaterThan(0);
            validationResult.results.forEach(result => {
                expect(result.signatureName).toBeDefined();
                expect(result.isSignatureValid).toBeDefined();
                expect(result.signatureStatus).toBeDefined();
                expect(result.isDocumentModified).toBeDefined();
                expect(result.revocationResult).toBeDefined();
            });
        }
        expect(validationResult.isValid).toBeTruthy();
        document.destroy();
    });
})