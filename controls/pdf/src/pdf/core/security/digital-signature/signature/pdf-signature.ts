import { PdfCertificationFlags, CryptographicStandard, DigestAlgorithm } from '../../../enumerator';
import { PdfSignatureField } from '../../../form/field';
import { _PdfCrossReference } from '../../../pdf-cross-reference';
import { PdfDocument } from '../../../pdf-document';
import { PdfPage } from '../../../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../../../pdf-primitives';
import { _bytesToHex, _decode, _isNullOrUndefined } from '../../../utils';
import { _PdfCertificate } from './../pdf-certificate';
import { _PdfX509Certificate } from '../x509/x509-certificate';
import { _PdfSignatureDictionary } from './signature-dictionary';
import { PdfCertificateInformation, PdfSignatureOptions } from './signature-properties';
import { _PdfX509CertificateParser } from '../x509/x509-certificate-parser';
import { _PdfSignaturePrivateKey } from './signature-privatekey';
import { _PdfCryptographicMessageSyntaxSigner } from './cryptographic-signer';
import { PdfForm } from '../../../form/form';
import { ExternalSignatureCallback, Rectangle } from './../../../pdf-type';
import { Save } from '@syncfusion/ej2-file-utils';
/**
 * 'PdfSignature' class represents a digital signature used for signing a PDF document.
 *
 * ```typescript
 * // Load the document
 * let document: PdfDocument = new PdfDocument(data);
 * // Gets the first page of the document
 * let page: PdfPage = document.getPage(0);
 * // Access the PDF form
 * let form: PdfForm = document.form;
 * // Create a new signature field
 * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
 * // Create a new signature using PFX data and private key
 * const sign: PdfSignature = PdfSignature.create({ cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, certData, password);
 * // Sets the signature to the field
 * field.setSignature(sign);
 * // Add the field into PDF form
 * form.add(field);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfSignature {
    _signatureDictionary: _PdfSignatureDictionary;
    _signatureField: PdfSignatureField;
    _reference: _PdfReference;
    _certificate: _PdfCertificate;
    _reason: string;
    _page: PdfPage;
    _locationInfo: string;
    _contactInfo: string;
    _digestAlgorithm: DigestAlgorithm;
    _cryptographicStandard: CryptographicStandard;
    _visible: boolean = true;
    _documentPermissions: PdfCertificationFlags;
    _isTimeStampOnly: boolean = false;
    _signedDate: Date;
    _signedName: string;
    _externalChain: Array<_PdfX509Certificate> = [];
    _isLocked: boolean = false;
    _signed: boolean = false;
    _appendCertificates: boolean = false;
    _crossReference: _PdfCrossReference;
    _bounds: Rectangle;
    _certify: boolean;
    _certificateInfo: PdfCertificateInformation;
    _externalSignatureCallback: ExternalSignatureCallback;
    /**
     * Initializes a new instance of the `PdfSignature` class.
     *
     * @private
     */
    constructor() {
        this._digestAlgorithm = DigestAlgorithm.sha256;
        this._cryptographicStandard = CryptographicStandard.cms;
        this._documentPermissions = PdfCertificationFlags.forbidChanges;
    }
    /**
     * Creates a new PDF signature using a callback function for external signing.
     *
     * @param {Function} callBack - A callback function that computes the signed document hash for external signature.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     *
     * @example
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 10, y: 10, width: 100, height: 50 });
     * // Define a callback function used for external signing
     * const externalSignatureCallback = (data: Uint8Array,
     *                                    options: {
     *                                      algorithm: DigestAlgorithm,
     *                                      cryptographicStandard: CryptographicStandard,
     *                                      }): {signedData: Uint8Array, timestampData?: Uint8Array}  => {
     *     // Implement external signing logic here
     *     return new Uint8Array(); // Placeholder return
     * };
     * // Create a new signature using external signing
     * const signature: PdfSignature = PdfSignature.create(externalSignatureCallback, {
     *     cryptographicStandard: CryptographicStandard.cms,
     *     algorithm: DigestAlgorithm.sha256
     * });
     * // Set the signature to the field
     * field.setSignature(signature);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    static create(callBack: ExternalSignatureCallback, options: PdfSignatureOptions): PdfSignature
    /**
     * Creates a new PDF signature using a callback function for external signing.
     *
     * @param {Function} callBack - A callback function that computes the signed document hash for external signature.
     * @param {Uint8Array[]} publicCertificates - An array of public certificates.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     *
     * @example
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 10, y: 10, width: 100, height: 50 });
     * // Define a callback function used for external signing
     * const externalSignatureCallback = (data: Uint8Array,
     *                                    options: {
     *                                      algorithm: DigestAlgorithm,
     *                                      cryptographicStandard: CryptographicStandard
     *                                      }): {signedData: Uint8Array, timestampData?: Uint8Array} => {
     *     // Implement external signing logic here
     *     return new Uint8Array(); // Placeholder return
     * };
     * // Create a new signature using external signing with public certificate collection
     * const signature: PdfSignature = PdfSignature.create(externalSignatureCallback,
     * publicCertificates, { cryptographicStandard: CryptographicStandard.cms,
     *     algorithm: DigestAlgorithm.sha256
     * });
     * // Set the signature to the field
     * field.setSignature(signature);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    static create(callBack: ExternalSignatureCallback,
        publicCertificates: Uint8Array[],
        options: PdfSignatureOptions): PdfSignature
    /**
     * Creates a new PDF signature using PFX certificate data and a password.
     *
     * @param {Uint8Array | string} pfxData - The PFX certificate data.
     * @param {string} password - The password for the certificate.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     *
     * @example
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Create a new signature using PFX data and private key
     * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    static create(pfxData: Uint8Array | string, password: string, options: PdfSignatureOptions): PdfSignature;
    static create(arg1: Uint8Array | string | ExternalSignatureCallback,
                  arg2: string | Uint8Array[] | PdfSignatureOptions,
                  arg3?: PdfSignatureOptions): PdfSignature {
        const signature: PdfSignature = new PdfSignature();
        if (arg1 instanceof Uint8Array || typeof arg1 === 'string') {
            const data: Uint8Array = arg1 instanceof Uint8Array ? arg1
                : (_decode(arg1) as Uint8Array);
            if (!data || data.length === 0) {
                throw new Error('Certificate data is required.');
            }
            if (typeof arg2 !== 'string' || !arg2) {
                throw new Error('Password is required to open the certificate.');
            }
            const certificate: _PdfCertificate = new _PdfCertificate(data, arg2);
            if (certificate) {
                signature._certificate = certificate;
                signature._certificateInfo = {
                    issuerName: certificate._issuerName,
                    serialNumber: certificate._serialNumber,
                    subjectName: certificate._subjectName,
                    validFrom: certificate._validFrom,
                    validTo: certificate._validTo,
                    version: certificate._version
                };
            }
            signature._applySignatureOptions(arg3);
        } else {
            signature._externalSignatureCallback = arg1;
            if (arg2 && Array.isArray(arg2) && arg2.length > 0) {
                for (const data of arg2) {
                    const publicCertificate: Uint8Array = data as Uint8Array;
                    if (publicCertificate && publicCertificate.length > 0) {
                        signature._externalChain.push(new _PdfX509CertificateParser()._readCertificate(publicCertificate));
                    }
                }
                signature._applySignatureOptions(arg3);
            } else {
                signature._applySignatureOptions(arg2 as PdfSignatureOptions);
            }
        }
        return signature;
    }
    /**
     * Gets the date when the PDF was signed.
     *
     * @returns {Date} - The signed date.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Create a new signature using PFX data and private key
     * const sign: PdfSignature = PdfSignature.create({ cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, certData, password);
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Gets the signed date
     * sign.getSignedDate();
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getSignedDate(): Date {
        return this._signedDate;
    }
    /**
     * Gets the certificate information associated with the PDF signature.
     *
     * @returns {PdfCertificateInformation} - The certificate information.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', {x: 10, y: 10, width: 100, height: 50});
     * // Create a new signature using PFX data and private key
     * const sign: PdfSignature = PdfSignature.create({ cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, certData, password);
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Gets the certificate information of the signature
     * const certificateInfo: PdfCertificateInformation = sign.getCertificateInformation();
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getCertificateInformation() : PdfCertificateInformation {
        return this._certificateInfo;
    }
    /**
     * Gets the options for configuring a digital signature in a PDF document.
     *
     * @returns {PdfSignatureOptions} The options for configuring a digital signature in a PDF document.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Gets the signature field
     * let field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Gets the PDF signature
     * let signature: PdfSignature = field.getSignature();
     * // Gets the signature options
     * let options: PdfSignatureOptions = signature.getSignatureOptions();
     * // Gets the cryptographic standard of the signature
     * let cryptographicStandard: CryptographicStandard = options.cryptographicStandard;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getSignatureOptions(): PdfSignatureOptions {
        const options: PdfSignatureOptions = {
            cryptographicStandard: this._cryptographicStandard,
            digestAlgorithm: this._digestAlgorithm,
            contactInfo: this._contactInfo,
            reason: this._reason,
            locationInfo: this._locationInfo,
            certify: this._certify,
            documentPermissions: this._documentPermissions,
            signedName: this._signedName,
            isLocked: this._isLocked
        };
        return options;
    }
    /**
     * Replaces an empty signature field in a PDF document with externally signed data.
     *
     * @param {Uint8Array} inputPdfData - The PDF document data.
     * @param {string} signatureName - The name of the signature field to replace.
     * @param {Uint8Array} signedData - The externally signed content to embed.
     * @param {DigestAlgorithm} algorithm - The digest algorithm used to hash the PDF content.
     * @param {Uint8Array[]} publicCertificates - Optional array of public certificate data used for signing.
     * @param {object} options - Configuration options for signature replacement.
     * @param {string} options.password - Optional password to open the PDF if it's encrypted.
     * @param {Uint8Array} options.timestampData - Optional timestamp token data to embeded in the signature.
     * @param {boolean} options.skipSignatureEncoding - Skips encoding the signature.
     * @returns {Uint8Array} The modified PDF document as a byte array.
     *
     * @example
     * ```typescript
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 10, y: 10, width: 100, height: 50 });
     * // placeholder for signed data
     * let signedData: Uint8Array;
     * // Define a callback function used for external signing
     * const externalSignatureCallback = (data: Uint8Array,
     *                                    options: {
     *                                      algorithm: DigestAlgorithm,
     *                                      cryptographicStandard: CryptographicStandard
     *                                      }): Void => {
     *     // Implement external signing logic here
     *     signedData = new Uint8Array(); // Placeholder return
     * };
     * // Create a new signature using external signing with public certificate collection
     * const signature: PdfSignature = PdfSignature.create({
     *     cryptographicStandard: CryptographicStandard.cms,
     *     algorithm: DigestAlgorithm.sha256
     * }, externalSignatureCallback,
     * publicCertificates);
     * // Set the signature to the field
     * field.setSignature(signature);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document data
     * const data: Uint8Array = document.save();
     * // Destroy the document
     * document.destroy();
     * // Replace the empty signature with externally signed hash and certificates
     * const signedDocumentData: Uint8Array = PdfSignature.replaceEmptySignature(data,
     *                                        'Signature',
     *                                        signedData,
     *                                        DigestAlgorithm.sha256,
     *                                        publicCertificates);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        options?: { password?: string,
            timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean}
    ): Uint8Array;
    /**
     * Replaces an empty signature field in a PDF document with externally signed data.
     *
     * @param {Uint8Array} inputPdfData - The PDF document data.
     * @param {string} signatureName - The name of the signature field to replace.
     * @param {Uint8Array} signedData - The externally signed content to embed.
     * @param {DigestAlgorithm} algorithm - The digest algorithm used to hash the PDF content.
     * @param {string} outputPdfName - The name of the output file where the signed PDF will be saved.
     * @param {object} options - Configuration options for signature replacement.
     * @param {string} options.password - Optional password to open the PDF if it's encrypted.
     * @param {Uint8Array[]} options.publicCertificates - Optional array of public certificate data used for signing.
     * @param {Uint8Array} options.timestampData - Optional timestamp token data to embed in the signature.
     * @param {boolean} options.skipSignatureEncoding - If true, skips encoding the signature; defaults to false.
     * @returns {void} Returns nothing.
     *
     * @example
     * ```typescript
     * let document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Create a new signature field
     * let field: PdfSignatureField = new PdfSignatureField(page, 'Signature', { x: 10, y: 10, width: 100, height: 50 });
     * // Define a callback function used for external signing
     * // placeholder for signed PDF data
     * let signedData: Uint8Array;
     * const externalSignatureCallback = (data: Uint8Array,
     *                                    options: {
     *                                      algorithm: DigestAlgorithm,
     *                                      cryptographicStandard: CryptographicStandard
     *                                      }): Void => {
     *     // Implement external signing logic here
     *     signedData = new Uint8Array(); // Placeholder return
     * };
     * // Create a new signature using external signing with public certificate collection
     * const signature: PdfSignature = PdfSignature.create({
     *     cryptographicStandard: CryptographicStandard.cms,
     *     algorithm: DigestAlgorithm.sha256
     * }, externalSignatureCallback,
     * publicCertificates);
     * // Set the signature to the field
     * field.setSignature(signature);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * const data: Uint8Array = document.save();
     * // Destroy the document
     * document.destroy();
     * // Replace the empty signature with externally signed hash and certificates
     * PdfSignature.replaceEmptySignature(data,
     *                                    'Signature',
     *                                    signedData,
     *                                    DigestAlgorithm.sha256
     *                                    'signed_output.pdf'
     *                                    publicCertificates);
     * ```
     */
    static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        outputPdfName: string,
        options?: { password?: string,
            timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean}
    ): void;
    static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        arg6: string | { password?: string, timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean },
        arg7?: { password?: string, timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean }
    ): Uint8Array | void {
        if (!(inputPdfData instanceof Uint8Array) || inputPdfData.length === 0 &&
            !(signedData instanceof Uint8Array) || signedData.length === 0) {
            throw new Error('Invalid Uint8Array: Data is either not a Uint8Array or is empty.');
        }
        if (typeof signatureName !== 'string' && signatureName !== '') {
            throw new Error('Signature field name is required');
        }
        const _externalChain: Array<_PdfX509Certificate> = [];
        let options: { password?: string, publicCertificates?: Uint8Array[], timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean };
        if (arg6 && typeof arg6 !== 'string') {
            options = arg6;
        } else {
            options = arg7;
        }
        if (publicCertificates && Array.isArray(publicCertificates)) {
            for (const data of publicCertificates) {
                const publicCertificatesData: Uint8Array = data as Uint8Array;
                if (publicCertificatesData && publicCertificatesData.length > 0) {
                    _externalChain.push(new _PdfX509CertificateParser()._readCertificate(publicCertificatesData));
                }
            }
        }
        if (!Array.isArray(_externalChain) || _externalChain.length === 0) {
            throw new Error('Invalid certificate chain: Expected a non-empty array of Certificate.');
        }
        let document: PdfDocument;
        let encodeSignature: boolean;
        if (options) {
            document = new PdfDocument(inputPdfData, options.password);
            encodeSignature = typeof options.skipSignatureEncoding === 'undefined' ||
            options.skipSignatureEncoding === null ||
            options.skipSignatureEncoding === false ? true : false;
        } else {
            document = new PdfDocument(inputPdfData);
            encodeSignature = true;
        }
        try {
            const form: PdfForm = document.form;
            let field: PdfSignatureField;
            for (let i: number = 0; i < form.count; i++) {
                if (form.fieldAt(i).name === signatureName) {
                    field = form.fieldAt(i) as PdfSignatureField;
                    break;
                }
            }
            if (!field) {
                throw new Error('Signature field name not found.');
            }
            let signatureDict: _PdfDictionary = field._dictionary;
            if (signatureDict && signatureDict.has('V')) {
                signatureDict = signatureDict.get('V');
                const byteRange: number[] = signatureDict.getArray('ByteRange') as number[];
                if (byteRange.length >= 4) {
                    const buf1: Uint8Array = inputPdfData.subarray(0, byteRange[1]);
                    const buf2: Uint8Array = inputPdfData.subarray(byteRange[2]);
                    const combined: Uint8Array = new Uint8Array(buf1.length + buf2.length);
                    combined.set(buf1, 0);
                    combined.set(buf2, buf1.length);
                    let signedContent: Uint8Array;
                    if (encodeSignature) {
                        let hashAlgorithm: string = '';
                        let externalSignature: _PdfSignaturePrivateKey;
                        let crlBytes: Uint8Array[];
                        let ocspByte: Uint8Array;
                        let chain: _PdfX509Certificate[];
                        if (_externalChain && _externalChain.length > 0) {
                            hashAlgorithm = DigestAlgorithm[<DigestAlgorithm>algorithm];
                            const pks: _PdfSignaturePrivateKey = new _PdfSignaturePrivateKey(hashAlgorithm);
                            externalSignature = pks;
                            chain = _externalChain;
                        }
                        const pkcs7: _PdfCryptographicMessageSyntaxSigner = new _PdfCryptographicMessageSyntaxSigner(null,
                                                                                                                     chain,
                                                                                                                     hashAlgorithm,
                                                                                                                     false);
                        const hash: Uint8Array = pkcs7._getDigestAlgorithm()._digest(combined, hashAlgorithm);
                        pkcs7._setSignedData(signedData, null, externalSignature._getEncryptionAlgorithm());
                        const subFilter: Record<string, CryptographicStandard> = {
                            'adbe.pkcs7.detached': CryptographicStandard.cms,
                            'ETSI.CAdES.detached': CryptographicStandard.cades
                        };
                        let cryptographicStandard: CryptographicStandard = CryptographicStandard.cms;
                        if (signatureDict.has('SubFilter')) {
                            const filter: _PdfName = signatureDict.get('SubFilter');
                            const kind: CryptographicStandard = filter.name ? subFilter[filter.name] : undefined;
                            if (kind === CryptographicStandard.cades) {
                                cryptographicStandard = CryptographicStandard.cades;
                            }
                        }
                        signedContent = pkcs7._sign(hash,
                                                    null,
                                                    ocspByte,
                                                    crlBytes,
                                                    cryptographicStandard,
                                                    hashAlgorithm);
                    }
                    let spaceAvailable: number = (byteRange[2] - byteRange[1]) - 2;
                    if ((spaceAvailable & 1) !== 0) {
                        throw new Error('Allocated space was not enough');
                    }
                    spaceAvailable = Math.floor(spaceAvailable / 2);
                    if (spaceAvailable < signedContent.length) {
                        throw new Error('Signature content space is not enough for signed bytes');
                    }
                    const hexEncodedSignature: string = _bytesToHex(signedContent);
                    const signatureStartPos: number = byteRange[1];
                    inputPdfData[<number>signatureStartPos] = '<'.charCodeAt(0) & 0xff;
                    for (let i: number = 0; i < hexEncodedSignature.length; i++) {
                        inputPdfData[signatureStartPos + 1 + i] = hexEncodedSignature.charCodeAt(i) & 0xff;
                    }
                    const signatureEndPos: number = signatureStartPos + 1 + hexEncodedSignature.length;
                    const paddingLength: number = byteRange[2] - signatureEndPos - 1;
                    if (paddingLength > 0) {
                        inputPdfData.fill('0'.charCodeAt(0) & 0xff, signatureEndPos, signatureEndPos + paddingLength);
                    }
                    inputPdfData[byteRange[2] - 1] = '>'.charCodeAt(0) & 0xff;
                }
            }
            if (arg6 && typeof arg6 === 'string') {
                Save.save(arg6, new Blob([inputPdfData], { type: 'application/pdf' }));
            } else {
                return inputPdfData;
            }
        } catch (error) {
            throw new Error(`Signing failed: ${error.message}`);
        } finally {
            document.destroy();
        }
    }
    _applySignatureOptions(options?: PdfSignatureOptions): void {
        if (options) {
            if (typeof options.cryptographicStandard !== 'undefined' && options.cryptographicStandard !== null) {
                this._cryptographicStandard = options.cryptographicStandard;
            }
            if (typeof options.digestAlgorithm !== 'undefined' && options.digestAlgorithm !== null) {
                this._digestAlgorithm = options.digestAlgorithm;
            }
            if (_isNullOrUndefined(options.contactInfo)) {
                this._contactInfo = options.contactInfo;
            }
            if (_isNullOrUndefined(options.reason)) {
                this._reason = options.reason;
            }
            if (_isNullOrUndefined(options.locationInfo)) {
                this._locationInfo = options.locationInfo;
            }
            if (typeof options.documentPermissions !== 'undefined' && options.documentPermissions !== null) {
                this._documentPermissions = options.documentPermissions;
            }
            if (_isNullOrUndefined(options.signedName)) {
                this._signedName = options.signedName;
            }
            if (typeof options.certify === 'boolean') {
                this._certify = options.certify;
            }
            if (typeof options.isLocked === 'boolean') {
                this._isLocked = options.isLocked;
            }
        }
    }
    _initializeInternals(dictionary: _PdfDictionary, field: PdfSignatureField): void {
        this._crossReference = field._crossReference;
        this._signed = true;
        this._signatureField = field;
        const subFilter: Record<string, CryptographicStandard> = {
            'adbe.pkcs7.detached': CryptographicStandard.cms,
            'ETSI.CAdES.detached': CryptographicStandard.cades
        };
        this._signatureDictionary = new _PdfSignatureDictionary(dictionary, this);
        if (dictionary.has('SubFilter')) {
            const filter: _PdfName = dictionary.get('SubFilter');
            const kind: CryptographicStandard = filter.name ? subFilter[filter.name] : undefined;
            if (kind === CryptographicStandard.cades) {
                this._cryptographicStandard = CryptographicStandard.cades;
            }
        }
        if (dictionary.has('Contents')) {
            this._digestAlgorithm = this._signatureDictionary._parseDigestAlgorithm();
            if (this._signatureDictionary._certificate) {
                const certificate: _PdfCertificate = this._signatureDictionary._certificate;
                if (certificate) {
                    this._certificate = certificate;
                    this._certificateInfo = {
                        issuerName: certificate._issuerName,
                        serialNumber: certificate._serialNumber,
                        subjectName: certificate._subjectName,
                        validFrom: certificate._validFrom,
                        validTo: certificate._validTo,
                        version: certificate._version
                    };
                }
            }
        }
        this._signedDate = this._signatureDictionary._parseSignedDate();
        this._signedName = this._signatureDictionary._parseDirect('Name');
        this._reason = this._signatureDictionary._parseDirect('Reason');
        this._locationInfo = this._signatureDictionary._parseDirect('Location');
        this._contactInfo = this._signatureDictionary._parseDirect('ContactInfo');
        if (dictionary.has('ByteRange')) {
            const arr: any = dictionary.get('ByteRange'); // eslint-disable-line
            const actualRange: number[] = this._toNumberArray(arr);
            if (actualRange && actualRange.length > 0) {
                let hasPermission: boolean = false;
                const catalog: _PdfDictionary = this._crossReference._document._catalog._catalogDictionary;
                if (catalog && catalog.has('Perms')) {
                    const permission: _PdfDictionary = catalog.get('Perms');
                    if (permission && permission.has('DocMDP')) {
                        const docPermission: _PdfDictionary = permission.get('DocMDP');
                        if (docPermission && docPermission.has('ByteRange')) {
                            const byteRange: any = docPermission.get('ByteRange'); // eslint-disable-line
                            const range: number[] = this._toNumberArray(byteRange);
                            if (range && actualRange &&
                                range.length === actualRange.length &&
                                range.every((v: number, i: number) => v === actualRange[<number>i])) {
                                hasPermission = true;
                            }
                        }
                    }
                }
                if (hasPermission && dictionary.has('Reference')) {
                    let primitive: _PdfDictionary = dictionary.get('Reference');
                    if (primitive && Array.isArray(primitive)) {
                        primitive = primitive[0];
                    }
                    if (primitive && primitive.has('TransformParams')) {
                        const transformParam: _PdfDictionary = primitive.get('TransformParams');
                        if (transformParam && transformParam.has('P')) {
                            this._documentPermissions = transformParam.get('P');
                        }
                    }
                }
            }
        }
        if (field._dictionary && field._dictionary.has('Kids') && this._crossReference) {
            const reference: _PdfReference[] = field._dictionary.get('Kids');
            const dictionary: _PdfDictionary = this._crossReference._cacheMap.get(reference[0]);
            if (dictionary && dictionary.has('Lock')) {
                const lock: _PdfDictionary = dictionary.get('Lock');
                if (lock) {
                    this._isLocked = true;
                }
            }
        }
        if (!this._certify && this._crossReference._document._isLoaded && this._crossReference._document._catalog) {
            this._certify = this._checkCertificated(dictionary.objId);
        }
    }
    _toNumberArray(arr: any): number[] { // eslint-disable-line
        if (!arr) {
            return undefined;
        }
        if (Array.isArray(arr)) {
            const values: number[] = arr.map((v: number) => (typeof v === 'number' ? v : Number(v)));
            return values.every((n: number) => Number.isFinite(n)) ? values : undefined;
        }
        return undefined;
    }
    _checkCertificated(objId: any): boolean { // eslint-disable-line
        let certificatedSignature: boolean = false;
        if (this._crossReference && this._crossReference._document) {
            const document: PdfDocument = this._crossReference._document;
            if (document._catalog && document._catalog._catalogDictionary && document._catalog._catalogDictionary.has('Perms')) {
                const perms: _PdfDictionary = document._catalog._catalogDictionary.get('Perms');
                if (perms && perms.has('DocMDP')) {
                    const documentPermissions: _PdfDictionary = perms.get('DocMDP');
                    if (documentPermissions && documentPermissions.objId && objId && documentPermissions.objId === objId) {
                        certificatedSignature = true;
                    }
                }
            }
        }
        return certificatedSignature;
    }
    _catalogBeginSave(): void {
        if (this._certify) {
            const document: PdfDocument = this._signatureField._crossReference._document;
            let permission: _PdfDictionary = document._catalog._catalogDictionary.get('Perms');
            if (typeof permission === 'undefined' || permission === null) {
                permission = new _PdfDictionary(this._crossReference);
                permission.update('DocMDP', this._reference);
                permission._updated = true;
                document._catalog._catalogDictionary.update('Perms', permission);
                document._catalog._catalogDictionary._updated = true;
            } else if (!permission.has('DocMDP')) {
                const ref: _PdfReference = this._crossReference._getNextReference();
                this._signatureField._crossReference._cacheMap.set(ref, this._signatureDictionary._dictionary);
                permission.set('DocMDP', ref);
                permission._updated = true;
            }
        }
    }
    _lockSignature(): void {
        const lockDictionary: _PdfDictionary = new _PdfDictionary();
        lockDictionary.update('Type', _PdfName.get('SigFieldLock'));
        lockDictionary.update('Action', _PdfName.get('All'));
        lockDictionary.update('P', PdfCertificationFlags.forbidChanges);
        if (this._signatureField && this._signatureField._crossReference) {
            const ref: _PdfReference = this._signatureField._crossReference._getNextReference();
            this._signatureField._crossReference._cacheMap.set(ref, lockDictionary);
            this._signatureField._widgetAnnot._dictionary.update('Lock', ref);
        }
    }
    _createDictionary(document: PdfDocument, signature: PdfSignature): _PdfSignatureDictionary {
        return new _PdfSignatureDictionary(document, signature);
    }
}
