import { PdfCertificationFlag, CryptographicStandard, DigestAlgorithm, RevocationType, RevocationStatus, PdfRotationAngle } from '../../../enumerator';
import { PdfSignatureField } from '../../../form/field';
import { _PdfCrossReference } from '../../../pdf-cross-reference';
import { PdfDocument } from '../../../pdf-document';
import { PdfPage } from '../../../pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../../../pdf-primitives';
import { _areArrayEqual, _byteArrayToHexString, _bytesToHex, _decode, _getNewGuidString, _isNullOrUndefined, _parseTimestampToken, _setMatrix, _stringToBytes } from '../../../utils';
import { _PdfCertificate } from './../pdf-certificate';
import { _PdfX509Certificate, _PdfX509Certificates } from '../x509/x509-certificate';
import { _PdfSignatureDictionary } from './signature-dictionary';
import { PdfCertificateInformation, PdfSignatureOptions } from './signature-properties';
import { _PdfX509CertificateParser } from '../x509/x509-certificate-parser';
import { _PdfSignaturePrivateKey } from './signature-privatekey';
import { _PdfCryptographicMessageSyntaxSigner } from './cryptographic-signer';
import { PdfForm } from '../../../form/form';
import { ExternalSignatureCallback, LongTermValidationCallback, PdfSignerCertificate, PdfX509CertificateProperties, Rectangle, TimestampCallback, TimestampInformation } from './../../../pdf-type';
import { Save } from '@syncfusion/ej2-file-utils';
import { _Sha1 } from '../../encryptors/secureHash-algorithm1';
import { _PdfRevocationList } from '../ocsp/revocation';
import { _PdfOcsp } from '../ocsp/ocsp-client';
import { _PdfStream, _PdfContentStream } from '../../../base-stream';
import { _PdfUniqueEncodingElement } from '../asn1/unique-encoding-element';
import { _ConstructionType, _TagClassType, _UniversalType } from '../asn1/enumerator';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { _PdfOcspResponseHelper } from '../ocsp/ocsp-response';
import { _PdfOcspHelper } from '../ocsp/ocsp-response-utils';
import { _PdfRevocationResponse } from '../ocsp/ocsp-response-model';
import { _Sha384, _Sha512 } from '../../encryptors/secureHash-algorithm512';
import { _Sha256 } from '../../encryptors/secureHash-algorithm256';
import { PdfTemplate } from '../../../graphics/pdf-template';
import { PdfAppearance } from '../../../annotations/pdf-appearance';
import { PdfFontFamily, PdfFontStyle, PdfStandardFont } from '../../../fonts/pdf-standard-font';
import { PdfBrush, PdfGraphicsState } from '../../../graphics/pdf-graphics';
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
    /**
     * The underlying signature dictionary representing the PDF signature object.
     *
     * @private
     */
    _signatureDictionary: _PdfSignatureDictionary;
    /**
     * The signature field associated with this signature.
     *
     * @private
     */
    _signatureField: PdfSignatureField;
    /**
     * Reference used for catalog permission updates when certifying.
     *
     * @private
     */
    _reference: _PdfReference;
    /**
     * The certificate wrapper parsed from provided PFX or signature dictionary.
     *
     * @private
     */
    _certificate: _PdfCertificate;
    /**
     * Reason text supplied for the signature.
     *
     * @private
     */
    _reason: string;
    /**
     * The page the signature applies to.
     *
     * @private
     */
    _page: PdfPage;
    /**
     * Location information supplied for the signature.
     *
     * @private
     */
    _locationInfo: string;
    /**
     * Contact information supplied for the signature.
     *
     * @private
     */
    _contactInfo: string;
    /**
     * The digest algorithm used for the signature.
     *
     * @private
     */
    _digestAlgorithm: DigestAlgorithm;
    /**
     * The cryptographic standard in use (CMS/CAdES).
     *
     * @private
     */
    _cryptographicStandard: CryptographicStandard;
    /**
     * Whether the signature should be visible in the document.
     *
     * @private
     */
    _visible: boolean = true;
    /**
     * Document permissions applied when certifying the document.
     *
     * @private
     */
    _documentPermissions: PdfCertificationFlag;
    /**
     * The date when the document was signed.
     *
     * @private
     */
    _signedDate: Date;
    /**
     * The name used for the signature (signed name).
     *
     * @private
     */
    _signedName: string;
    /**
     * External certificate chain provided for external signing scenarios.
     *
     * @private
     */
    _externalChain: Array<_PdfX509Certificate> = [];
    /**
     * Whether the field is locked (signature lock dictionary present).
     *
     * @private
     */
    _isLocked: boolean = false;
    /**
     * Whether the signature has been applied.
     *
     * @private
     */
    _signed: boolean = false;
    /**
     * Whether certificates should be appended to existing certificate collection.
     *
     * @private
     */
    _appendCertificates: boolean = false;
    /**
     * Cross reference table for the PDF document being signed.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Bounds for the visible signature appearance.
     *
     * @private
     */
    _bounds: Rectangle;
    /**
     * Whether this signature certifies the document.
     *
     * @private
     */
    _certify: boolean;
    /**
     * Parsed certificate information for display and inspection.
     *
     * @private
     */
    _certificateInfo: PdfCertificateInformation;
    /**
     * Callback used for external signing operations.
     *
     * @private
     */
    _externalSignatureCallback: ExternalSignatureCallback;
    _ranges: number[] = [];
    /**
     * Indicates whether a timestamp token is present on the signature.
     *
     * @private
     */
    _hasTimeStamp: boolean = false;
    /**
     * Raw timestamp token bytes when present.
     *
     * @private
     */
    _timeStampTokenBytes: Uint8Array;
    /**
     * When true, the signature represents timestamp-only content.
     *
     * @private
     */
    _isTimestampOnly: boolean = false;
    /**
     * Callback used to request a timestamp from a TSA.
     *
     * @private
     */
    _timestampCallback: TimestampCallback;
    /**
     * Document Security Store (DSS) dictionary associated with the signature.
     *
     * @private
     */
    _dssDictionary: _PdfDictionary;
    /**
     * Raw signature content bytes extracted from the PDF signature field.
     *
     * @private
     */
    _signatureContentBytes: Uint8Array;
    /**
     * Collection of Certificate Revocation List (CRL) byte arrays
     * used for long‑term validation.
     *
     * @private
     */
    _crlBytes: Uint8Array[];
    /**
     * Indicates whether Long‑Term Validation (LTV) is enabled.
     *
     * @private
     */
    _enableLtv: boolean = false;
    /**
     * The PDF document associated with the signature operation.
     *
     * @private
     */
    _document: PdfDocument;
    /**
     * Callback invoked to retrieve long‑term validation data such as
     * OCSP responses or CRLs.
     *
     * @private
     */
    _ltvCallback: LongTermValidationCallback;
    /**
     * Indicates whether validation appearance is enabled for the signature.
     *
     * @private
     */
    _enabledValiadtionAppearance: boolean = false;
    /**
     * Initializes a new instance of the `PdfSignature` class.
     *
     * @private
     */
    public constructor() {
        this._digestAlgorithm = DigestAlgorithm.sha256;
        this._cryptographicStandard = CryptographicStandard.cms;
        this._documentPermissions = PdfCertificationFlag.forbidChanges;
    }
    /**
     * Gets whether the signature has a validation appearance.
     *
     * ```typescript
     * // Load an existing signed PDF document.
     * const document: PdfDocument = new PdfDocument(data);
     * // Get the signature field.
     * const signatureField: PdfSignatureField = document.form.fieldAt(0) as PdfSignatureField;
     * // Get the signature.
     * const signature: PdfSignature = signatureField.getSignature();
     * // Check whether the signature contains a validation appearance.
     * const hasValidationAppearance: boolean = signature.isValidationAppearanceEnabled;
     * // Destroy the document.
     * document.destroy();
     * ```
     *
     * @returns {boolean} `true` if the signature has a validation appearance; otherwise, `false`.
     */
    get isValidationAppearanceEnabled(): boolean {
        return this._signed ? this._getValidationAppearance() : this._enabledValiadtionAppearance;
    }
    /**
     * Sets whether the signature has a validation appearance.
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
     * // Enable the validation appearance for the signature.
     * sign.isValidationAppearanceEnabled = true;
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {boolean} value Specifies whether the signature should display the validation appearance.
     */
    set isValidationAppearanceEnabled(value: boolean) {
        this._enabledValiadtionAppearance = value;
    }
    /**
     * Creates a new PDF signature using a callback function for external signing.
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
     *
     * @param {Function} callBack - A callback function that computes the signed document hash for external signature.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     */
    public static create(callBack: ExternalSignatureCallback, options: PdfSignatureOptions): PdfSignature
    /**
     * Creates a new PDF signature using a callback function for external signing.
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
     *
     * @param {Function} callBack - A callback function that computes the signed document hash for external signature.
     * @param {Uint8Array[]} publicCertificates - An array of public certificates.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     */
    public static create(callBack: ExternalSignatureCallback,
        publicCertificates: Uint8Array[],
        options: PdfSignatureOptions): PdfSignature
    /**
     * Creates a new PDF signature using PFX certificate data and a password.
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
     *
     * @param {Uint8Array | string} pfxData - The PFX certificate data.
     * @param {string} password - The password for the certificate.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @returns {PdfSignature} - The created PDF signature instance.
     */
    public static create(pfxData: Uint8Array | string, password: string, options: PdfSignatureOptions): PdfSignature;
    /**
     * Creates a new PDF signature with timestamp using a PFX certificate and timestamp callback.
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
     * // Create a timestamp callback
     * async function timestampCallback(request: Uint8Array): Promise<{ response: Uint8Array }> {
     *     // Implement timestamp response logic here
     *     return new Uint8Array(); // Placeholder return
     * }
     * // Create a new signature using PFX data, private key and call back function for timestamp
     * const sign: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, timestampCallback);
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * await document.saveAsync('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array | string} pfxData - The PFX certificate data.
     * @param {string} password - The password for the certificate.
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @param {Function} timestamp Callback function that accesses TSA server and returns timestamp response for the request bytes.
     * @returns {PdfSignature} - The created PDF signature instance.
     */
    public static create(pfxData: Uint8Array | string, password: string, options: PdfSignatureOptions,
        timestamp: TimestampCallback): PdfSignature;
    /**
     * Creates a new PDF timestamp signature using the provided signature and timestamp callback.
     *
     * @remarks
     * This creates a timestamp signature (also known as a document timestamp) for the PDF document.
     * Callback function is used to obtain the timestamp from a trusted timestamp authority (TSA) server.
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
     * // Create a timestamp callback
     * async function timestampCallback(request: Uint8Array): Promise<{ response: Uint8Array }> {
     *     // Implement timestamp response logic here
     *     return new Uint8Array(); // Placeholder return
     * }
     * // Create a new signature using signature options and call back function for timestamp
     * const sign: PdfSignature = PdfSignature.create({ cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 }, timestampCallback);
     * // Sets the signature to the field
     * field.setSignature(sign);
     * // Add the field into PDF form
     * form.add(field);
     * // Save the document
     * await document.saveAsync('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfSignatureOptions} options - Configuration options for the signature.
     * @param {Function} timestampCallback Callback function that accesses TSA server and returns timestamp response for the request bytes.
     * @returns {PdfSignature} - The created PDF signature instance.
     */
    public static create(options: PdfSignatureOptions, timestampCallback: TimestampCallback): PdfSignature;
    public static create(arg1: Uint8Array | string | ExternalSignatureCallback | PdfSignatureOptions,
                         arg2: string | Uint8Array[] | PdfSignatureOptions | TimestampCallback,
                         arg3?: PdfSignatureOptions, arg4?: TimestampCallback): PdfSignature {
        const signature: PdfSignature = new PdfSignature();
        initializeTelemetryFeature('DigitalSignature', 'PDFLibrary');
        if (arg1 instanceof Uint8Array || typeof arg1 === 'string') {
            const data: Uint8Array = arg1 instanceof Uint8Array ? arg1 : (_decode(arg1 as string) as Uint8Array);
            if (!data || data.length === 0) {
                throw new Error('Certificate data is required.');
            }
            const password: string = arg2 as string;
            if (password === null || typeof password === 'undefined' || password.length === 0) {
                throw new Error('Password is required to open the certificate.');
            }
            const certificate: _PdfCertificate = new _PdfCertificate(data, password);
            signature._certificate = certificate;
            signature._certificateInfo = {
                issuerName: certificate._issuerName,
                serialNumber: certificate._serialNumber,
                subjectName: certificate._subjectName,
                validFrom: certificate._validFrom,
                validTo: certificate._validTo,
                version: certificate._version
            };
            if (arg3) {
                signature._applySignatureOptions(arg3 as PdfSignatureOptions);
            }
            if (arg4 && typeof arg4 === 'function') {
                signature._timestampCallback = arg4 as TimestampCallback;
            }
            return signature;
        }
        if (typeof arg1 === 'function') {
            signature._externalSignatureCallback = arg1 as ExternalSignatureCallback;
            if (Array.isArray(arg2)) {
                const publicCerts: Uint8Array[] = arg2 as Uint8Array[];
                for (const data of publicCerts) {
                    if (data && data.length > 0) {
                        signature._externalChain.push(new _PdfX509CertificateParser()._readCertificate(data));
                    }
                }
                if (arg3) {
                    signature._applySignatureOptions(arg3 as PdfSignatureOptions);
                }
                if (arg4 && typeof arg4 === 'function') {
                    signature._timestampCallback = arg4 as TimestampCallback;
                }
                return signature;
            }
            if (arg2 && typeof arg2 === 'object') {
                signature._applySignatureOptions(arg2 as PdfSignatureOptions);
                if (arg3 && typeof arg3 === 'function') {
                    signature._timestampCallback = arg3 as TimestampCallback;
                }
                return signature;
            }
            return signature;
        }
        if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)) {
            signature._applySignatureOptions(arg1 as PdfSignatureOptions);
            if (arg2 && typeof arg2 === 'function') {
                signature._timestampCallback = arg2 as TimestampCallback;
            }
            signature._isTimestampOnly = true;
            return signature;
        }
        if ((arg1 === null || typeof arg1 === 'undefined') && (arg2 === null || typeof arg2 === 'undefined')
            && arg3 && arg4 && typeof arg4 === 'function') {
            signature._applySignatureOptions(arg3 as PdfSignatureOptions);
            signature._timestampCallback = arg4 as TimestampCallback;
            signature._isTimestampOnly = true;
            return signature;
        }
        throw new Error('Cannot create signature due to invalid arguments.');
    }
    /**
     * Gets the date when the PDF was signed.
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
     *
     * @returns {Date} - The signed date.
     */
    public getSignedDate(): Date {
        return this._signedDate;
    }
    /**
     * Gets the certificate information associated with the PDF signature.
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
     *
     * @returns {PdfCertificateInformation} - The certificate information.
     */
    public getCertificateInformation() : PdfCertificateInformation {
        return this._certificateInfo;
    }
    /**
     * Gets the options for configuring a digital signature in a PDF document.
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
     *
     * @returns {PdfSignatureOptions} The options for configuring a digital signature in a PDF document.
     */
    public getSignatureOptions(): PdfSignatureOptions {
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
     */
    public static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        options?: {
            password?: string,
            timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean
        }
    ): Uint8Array;
    /**
     * Replaces an empty signature field in a PDF document with externally signed data.
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
     *
     * @param {Uint8Array} inputPdfData - The PDF document data.
     * @param {string} signatureName - The name of the signature field to replace.
     * @param {Uint8Array} signedData - The externally signed content to embed.
     * @param {DigestAlgorithm} algorithm - The digest algorithm used to hash the PDF content.
     * @param {Uint8Array[]} publicCertificates - Optional array of public certificate data used for signing.
     * @param {string} outputPdfName - The name of the output file where the signed PDF will be saved.
     * @param {object} options - Configuration options for signature replacement.
     * @param {string} options.password - Optional password to open the PDF if it's encrypted.
     * @param {Uint8Array} options.timestampData - Optional timestamp token data to embed in the signature.
     * @param {boolean} options.skipSignatureEncoding - If true, skips encoding the signature; defaults to false.
     * @returns {void} Returns nothing.
     */
    public static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        outputPdfName: string,
        options?: {
            password?: string,
            timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean
        }
    ): void;
    public static replaceEmptySignature(
        inputPdfData: Uint8Array,
        signatureName: string,
        signedData: Uint8Array,
        algorithm: DigestAlgorithm,
        publicCertificates: Uint8Array[],
        arg6: string | {
            password?: string, timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean
        },
        arg7?: {
            password?: string, timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean
        }
    ): Uint8Array | void {
        if (!(inputPdfData instanceof Uint8Array) || inputPdfData.length === 0 &&
            !(signedData instanceof Uint8Array) || signedData.length === 0) {
            throw new Error('Invalid Uint8Array: Data is either not a Uint8Array or is empty.');
        }
        if (typeof signatureName !== 'string' && signatureName !== '') {
            throw new Error('Signature field name is required');
        }
        const _externalChain: Array<_PdfX509Certificate> = [];
        let options: {
            password?: string, publicCertificates?: Uint8Array[], timestampData?: Uint8Array,
            skipSignatureEncoding?: boolean
        };
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
    /**
     * Enables Long-Term Validation for the signature using a callback.
     *
     * ```typescript
     * // Load the document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the first page of the document
     * let page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * let form: PdfForm = document.form;
     * // Get an existing signature field
     * let field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * //Create new signature
     * let signature: PdfSignature = PdfSignature.create(certData, password, { cryptographicStandard: CryptographicStandard.cms, digestAlgorithm: DigestAlgorithm.sha256 });
     * // Set signature to the field
     * field.setSignature(signature);
     * // Create an Long-Term Validation callback to fetch responses
     * async function longTermValidationCallback(url: string, requestBytes?: Uint8Array):
     *  Promise<{ response: Uint8Array }> {
     *          //  Implement Long-Term Validation response retrieval here
     *           return new Uint8Array(); // Placeholder return
     * }
     * //  Enable Long-Term Validation using the callback
     * let ltvEnabled: boolean = await signature.enableLTV(longTermValidationCallback);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {LongTermValidationCallback} ltvCallback - Callback to retrieve OCSP/CRL responses.
     * @returns {Promise<boolean>} Indicates whether LTV was enabled.
     */
    async enableLTV(ltvCallback: LongTermValidationCallback): Promise<boolean>;
    /**
     * Enables Long-Term Validation using the certificate chain and callback.
     *
     * ```typescript
     * // Load the document
     * const document: PdfDocument = new PdfDocument(data);
     * // Access the PDF form
     * const form: PdfForm = document.form;
     * // Get an existing signature field
     * const field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Get the signature
     * const signature: PdfSignature = field.getSignature();
     * // Create an LTV callback to fetch OCSP/CRL responses
     * async function longTermValidationCallback(url: string, requestBytes?: Uint8Array):
     *  Promise<{ response: Uint8Array }> {
     *          //  Implement LTV response retrieval here
     *           return new Uint8Array(); // Placeholder return
     * }
     * // Enable LTV using the certificate chain and callback
     * const ltvEnabled: boolean = await signature.enableLTV(publicCertificates, longTermValidationCallback);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array[]} certificates - Certificate chain for validation.
     * @param {LongTermValidationCallback} ltvCallback - Callback to retrieve OCSP/CRL responses.
     * @returns {Promise<boolean>} Indicates whether LTV was enabled.
     */
    async enableLTV(certificates: Uint8Array[], ltvCallback: LongTermValidationCallback): Promise<boolean>;
    /**
     * Enables Long-Term  validation using the public certificates, specified revocation mode and callback.
     *
     * ```typescript
     * // Load the document
     * const document: PdfDocument = new PdfDocument(data);
     * // Access the PDF form
     * const form: PdfForm = document.form;
     * // Get an existing signature field
     * const field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Get the signature
     * const signature: PdfSignature = field.getSignature();
     * // Create an LTV callback to fetch OCSP/CRL responses
     * async function longTermValidationCallback(url: string, requestBytes?: Uint8Array):
     *  Promise<{ response: Uint8Array }> {
     *          //  Implement LTV response retrieval here
     *           return new Uint8Array(); // Placeholder return
     * }
     * // Enable LTV using public certificates, revocation mode and callback
     * const ltvEnabled: boolean = await signature.enableLTV(publicCertificates, RevocationType.crl, longTermValidationCallback);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array[]} certificates - Certificate chain for validation.
     * @param {RevocationType} type - Revocation mode.
     * @param {LongTermValidationCallback} ltvCallback - Callback to retrieve revocation responses.
     * @returns {Promise<boolean>} Indicates whether LTV was enabled.
     */
    async enableLTV(certificates: Uint8Array[], type: RevocationType,
        ltvCallback: LongTermValidationCallback): Promise<boolean>;
    /**
     * Enables Long-Term Validation using the certificate chain, revocation type,
     * and additional flag to include public certificates inside the document along with callback.
     *
     * ```typescript
     * // Load the document
     * const document: PdfDocument = new PdfDocument(data);
     * // Gets the first page of the document
     * const page: PdfPage = document.getPage(0);
     * // Access the PDF form
     * const form: PdfForm = document.form;
     * // Get an existing signature field
     * const field: PdfSignatureField = form.fieldAt(0) as PdfSignatureField;
     * // Get the signature
     * const signature: PdfSignature = field.getSignature();
     * // Create an LTV callback to fetch OCSP/CRL responses
     * async function longTermValidationCallback(url: string, requestBytes?: Uint8Array):
     *   Promise<{ response: Uint8Array }> {
     *     // Implement LTV response retrieval here
     *     return { response: new Uint8Array() }; // Placeholder return
     * }
     * // Enable LTV and include public certificates
     * const ltvEnabled: boolean = await signature.enableLTV(
     *   [publicCertificates],
     *   RevocationType.crl,
     *   true,
     *   longTermValidationCallback
     * );
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {Uint8Array[]} certificates - Certificate chain for validation.
     * @param {RevocationType} type - Revocation mode.
     * @param {boolean} includePublicCertificates - Indicates whether to embed public certificates in the document.
     * @param {LongTermValidationCallback} ltvCallback - Callback to retrieve revocation responses.
     * @returns {Promise<boolean>} Indicates whether LTV was enabled.
     */
    async enableLTV(certificates: Uint8Array[], type: RevocationType, includePublicCertificates: boolean,
        ltvCallback: LongTermValidationCallback): Promise<boolean>;
    async enableLTV(arg1?: Uint8Array[] | LongTermValidationCallback, arg2?: RevocationType | LongTermValidationCallback,
                    arg3?: boolean | LongTermValidationCallback, arg4?: LongTermValidationCallback): Promise<boolean> {
        let certificates: Uint8Array[] = [];
        let type: RevocationType = RevocationType.ocspAndCrl;
        let includePublicCertificates: boolean = false;
        let ltvCallback: LongTermValidationCallback;
        const isRevocationTypeLocal = (value: any): boolean => { // eslint-disable-line
            if (value === null || typeof value === 'undefined') {
                return false;
            }
            if (typeof value === 'number') {
                return typeof RevocationType[value as number] !== 'undefined';
            }
            if (typeof value === 'string') {
                return typeof (RevocationType as any)[value] !== 'undefined'; // eslint-disable-line
            }
            return false;
        };
        if (typeof arg1 === 'function') {
            ltvCallback = arg1;
        } else if (Array.isArray(arg1) && typeof arg2 === 'function') {
            certificates = arg1;
            ltvCallback = arg2;
        } else if (Array.isArray(arg1) && arg2 !== undefined && typeof arg3 === 'function') {
            certificates = arg1;
            if (isRevocationTypeLocal(arg2)) {
                type = arg2 as RevocationType;
            }
            ltvCallback = arg3 as LongTermValidationCallback;
        } else if (Array.isArray(arg1) && arg2 !== undefined && typeof arg3 === 'boolean' && typeof arg4 === 'function') {
            certificates = arg1;
            if (isRevocationTypeLocal(arg2)) {
                type = arg2 as RevocationType;
            }
            includePublicCertificates = arg3;
            ltvCallback = arg4;
        } else if (Array.isArray(arg1) || typeof arg1 === 'undefined') {
            certificates = Array.isArray(arg1) ? arg1 : [];
            if (typeof arg2 !== 'undefined' && typeof arg2 !== 'function') {
                const maybe: any = arg2; // eslint-disable-line
                if (typeof maybe === 'number' && typeof RevocationType[maybe as number] !== 'undefined') {
                    type = maybe as RevocationType;
                }
            }
            if (typeof arg3 === 'boolean') {
                includePublicCertificates = arg3;
            }
        } else {
            throw new Error('Invalid arguments passed to enableLTV.');
        }
        this._ltvCallback = ltvCallback;
        this._enableLtv = true;
        const x509CertificateList: _PdfX509Certificate[] = [];
        if (certificates && Array.isArray(certificates) && certificates.length > 0) {
            for (const data of certificates) {
                const publicCertificate: Uint8Array = data as Uint8Array;
                if (publicCertificate && publicCertificate.length > 0) {
                    x509CertificateList.push(new _PdfX509CertificateParser()._readCertificate(publicCertificate));
                }
            }
            return await this._getLTVData(x509CertificateList, type, includePublicCertificates);
        }
        if (this._certificate && this._certificate._publicKeyCryptographyCertificate) {
            let certificateAlias: string = '';
            this._certificate._publicKeyCryptographyCertificate._keys.forEach((keyEntry: any, alias: string) => { // eslint-disable-line
                if (keyEntry && certificateAlias === '') {
                    certificateAlias = alias;
                }
            });
            const chains: _PdfX509Certificates[] =
                this._certificate._publicKeyCryptographyCertificate._getCertificateChain(certificateAlias);
            for (let i: number = 0; i < chains.length; i++) {
                x509CertificateList.push(chains[i as number]._certificate);
            }
            return await this._getLTVData(x509CertificateList, type, includePublicCertificates);
        }
        if (this._certificate && this._certificate._chains) {
            return await this._getLTVData(this._certificate._chains, type, includePublicCertificates);
        }
        return Promise.resolve(false);
    }
    /**
     * Indicates whether the signature has a validation appearance.
     *
     * @private
     * @returns {boolean} True if a validation appearance exists; otherwise, false.
     */
    _getValidationAppearance(): boolean {
        try {
            if (!this._signed || !this._signatureField) {
                return false;
            }
            let widgetDictionary: _PdfDictionary;
            const fieldDictionary: _PdfDictionary = this._signatureField._dictionary;
            if (fieldDictionary && fieldDictionary.has('Kids')) {
                const kids: _PdfReference[] = fieldDictionary.get('Kids');
                if (kids && kids.length > 0) {
                    widgetDictionary = this._crossReference._fetch(kids[0]);
                }
            } else if (this._signatureField._widgetAnnot) {
                widgetDictionary = this._signatureField._widgetAnnot._dictionary;
            }
            if (!widgetDictionary) {
                return false;
            }
            const apDictionary: _PdfDictionary = widgetDictionary.get('AP');
            if (!apDictionary) {
                return false;
            }
            const appearance: _PdfStream = apDictionary.get('N');
            if (!appearance || !appearance.dictionary) {
                return false;
            }
            const resources: _PdfDictionary = appearance.dictionary.get('Resources');
            if (!resources) {
                return false;
            }
            const xObjects: _PdfDictionary = resources.get('XObject');
            if (!xObjects) {
                return false;
            }
            const frm: _PdfStream = xObjects.get('FRM');
            if (!frm || !frm.dictionary) {
                return false;
            }
            const frmResources: _PdfDictionary = frm.dictionary.get('Resources');
            if (!frmResources) {
                return false;
            }
            const frmXObjects: _PdfDictionary = frmResources.get('XObject');
            if (!frmXObjects) {
                return false;
            }
            return frmXObjects.has('n0') &&
                frmXObjects.has('n1') &&
                frmXObjects.has('n2') &&
                frmXObjects.has('n3') &&
                frmXObjects.has('n4');
        } catch {
            return false;
        }
    }
    /**
     * Creates and applies a validation appearance to the signature field.
     *
     * @private
     * @returns {void}
     */
    _setValidationAppearance(): void {
        if (!this._signatureField || !this._signatureField._crossReference || !this._bounds ||
            this._bounds.width <= 0 || this._bounds.height <= 0) {
            return;
        }
        const templateSize: Rectangle = this._bounds;
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const scale: number[] = this._findScale(templateSize.width, templateSize.height);
        const crossReference: _PdfCrossReference = this._signatureField._crossReference;
        if (!this._page && this._signatureField._page) {
            this._page = this._signatureField._page;
        }
        const appearance: PdfAppearance = this._signatureField.getAppearance();
        if (!appearance || !appearance.normal) {
            return;
        }
        appearance.normal._isSignatureAppearanceValidation = true;
        this._disableValidationStreamCompression(appearance.normal);
        const isRotated: boolean = this._page && (this._page.rotation === PdfRotationAngle.angle90 ||
            this._page.rotation === PdfRotationAngle.angle270);
        const validationAppearance: PdfTemplate = new PdfTemplate({x: 0, y: 0, width: templateSize.width, height: templateSize.height },
                                                                  crossReference);
        validationAppearance._key = 'FRM';
        this._disableValidationStreamCompression(validationAppearance);
        validationAppearance.graphics._sw._clear();
        const templateN0: PdfTemplate = new PdfTemplate({x: 0, y: 0, width: 100, height: 100}, crossReference);
        templateN0._key = 'n0';
        this._disableValidationStreamCompression(templateN0);
        templateN0.graphics._sw._clear();
        templateN0.graphics._sw._write('% DSBlank');
        const state: PdfGraphicsState = validationAppearance.graphics.save();
        if (isRotated) {
            validationAppearance.graphics.rotateTransform(-90);
            validationAppearance.graphics.drawTemplate(templateN0, {x: 0, y: 0, width: 100, height: 100});
        } else {
            validationAppearance.graphics.drawTemplate(templateN0, {x: 0, y: -100, width: 100, height: 100});
        }
        validationAppearance.graphics.restore(state);
        const templateN1: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: 100, height: 100}, crossReference);
        templateN1._key = 'n1';
        this._disableValidationStreamCompression(templateN1);
        const data: string = 'cQoxIEcKMSBnCjAuMSAwIDAgMC4xIDkgMCBjbQowIEogMCBqIDQgTSBbXTAgZAoxIGkKMCBnCjMxMyAyOTIgbQozMTMgNDA0IDMyNSA0NTMgNDMyIDUyOSBjCjQ3OCA1NjEgNTA0IDU5NyA1MDQgNjQ1IGMKNTA0IDczNiA0NDAgNzYwIDM5MSA3NjAgYwoyODYgNzYwIDI3MSA2ODEgMjY1IDYyNiBjCjI2NSA2MjUgbAoxMDAgNjI1IGwKMTAwIDgyOCAyNTMgODk4IDM4MSA4OTggYwo0NTEgODk4IDY3OSA4NzggNjc5IDY1MCBjCjY3OSA1NTUgNjI4IDQ5OSA1MzggNDM1IGMKNDg4IDM5OSA0NjcgMzc2IDQ2NyAyOTIgYwozMTMgMjkyIGwKaAozMDggMjE0IDE3MCAtMTY0IHJlCmYKMC40NCBHCjEuMiB3CjEgMSAwIHJnCjI4NyAzMTggbQoyODcgNDMwIDI5OSA0NzkgNDA2IDU1NSBjCjQ1MSA1ODcgNDc4IDYyMyA0NzggNjcxIGMKNDc4IDc2MiA0MTQgNzg2IDM2NSA3ODYgYwoyNjAgNzg2IDI0NSA3MDcgMjM5IDY1MiBjCjIzOSA2NTEgbAo3NCA2NTEgbAo3NCA4NTQgMjI3IDkyNCAzNTUgOTI0IGMKNDI1IDkyNCA2NTMgOTA0IDY1MyA2NzYgYwo2NTMgNTgxIDYwMiA1MjUgNTEyIDQ2MSBjCjQ2MiA0MjUgNDQxIDQwMiA0NDEgMzE4IGMKMjg3IDMxOCBsCmgKMjgyIDI0MCAxNzAgLTE2NCByZQpCClE=';
        templateN1.graphics._sw._clear();
        const decodedStream: string = atob(data);
        templateN1.graphics._sw._write('% DSUnkown\n' + decodedStream);
        const state0: PdfGraphicsState = validationAppearance.graphics.save();
        const minValue: number = Math.min(templateSize.width, templateSize.height);
        if (isRotated) {
            validationAppearance.graphics.rotateTransform(-90);
            const maximumValue: number = Math.max(templateSize.width, templateSize.height);
            const point: { x: number; y: number } = templateSize.width > templateSize.height ? { x: 0, y: (maximumValue - minValue) / 2 }
                : { x: (maximumValue - minValue) / 2, y: 0};
            validationAppearance.graphics.drawTemplate(templateN1, { x: point.x, y: point.y,
                width: minValue, height: minValue });
        } else {
            const point: { x: number; y: number } = templateSize.width > templateSize.height
                ? { x: (templateSize.width - minValue) / 2, y: -templateSize.height }
                : { x: templateSize.width - minValue, y: (-templateSize.height - minValue) / 2 };
            validationAppearance.graphics.drawTemplate(templateN1, { x: point.x, y: point.y, width: minValue, height: minValue});
        }
        validationAppearance.graphics.restore(state0);
        const appearanceLayer: PdfTemplate = appearance._getAppearanceLayer();
        if (!appearanceLayer) {
            return;
        }
        appearanceLayer._key = 'n2';
        this._disableValidationStreamCompression(appearanceLayer);
        const state1: PdfGraphicsState = validationAppearance.graphics.save();
        if (isRotated) {
            validationAppearance.graphics.rotateTransform(-90);
            validationAppearance.graphics.drawTemplate(appearanceLayer, {x: 0, y: templateSize.width / 4,
                width: appearanceLayer.size.width, height: appearanceLayer.size.height }
            );
        } else {
            validationAppearance.graphics.drawTemplate(appearanceLayer, {x: 0, y: -( templateSize.height - templateSize.height / 4),
                width: appearanceLayer.size.width, height: appearanceLayer.size.height});
        }
        validationAppearance.graphics.restore(state1);
        const templateN3: PdfTemplate = new PdfTemplate({x: 0, y: 0, width: 100, height: 100}, crossReference);
        templateN3._key = 'n3';
        this._disableValidationStreamCompression(templateN3);
        templateN3.graphics._sw._clear();
        templateN3.graphics._sw._write('% DSBlank\r\n');
        const state2: PdfGraphicsState = validationAppearance.graphics.save();
        validationAppearance.graphics.scaleTransform(scale[0], scale[0]);
        if (isRotated) {
            validationAppearance.graphics.rotateTransform(-90);
            validationAppearance.graphics.drawTemplate(templateN3, {x: 0, y: 0, width: 100, height: 100});
        } else {
            validationAppearance.graphics.drawTemplate(templateN3, {x: scale[1], y: -(100 + scale[2]), width: 100, height: 100});
        }
        validationAppearance.graphics.restore(state2);
        let templateN4: PdfTemplate;
        if (isRotated) {
            templateN4 = new PdfTemplate({x: 0, y: 0, width: templateSize.height, height: templateSize.width / 4}, crossReference);
        } else {
            templateN4 = new PdfTemplate({x: 0, y: 0, width: templateSize.width, height: templateSize.height / 4}, crossReference);
        }
        templateN4._key = 'n4';
        this._disableValidationStreamCompression(templateN4);
        const defaultN4Value: string = 'Signature Not Verified';
        font._size = 9.81352;
        font.style = PdfFontStyle.regular;
        const validationTextBrush: PdfBrush = new PdfBrush({r: 0, g: 0, b: 0});
        templateN4.graphics.drawString(defaultN4Value, font, {x: 0, y: 0, width: 0, height: 0}, undefined, validationTextBrush);
        const state3: PdfGraphicsState = validationAppearance.graphics.save();
        if (isRotated) {
            validationAppearance.graphics.rotateTransform(-90);
            validationAppearance.graphics.drawTemplate(templateN4, {x: 0, y: 0, width: templateN4.size.width,
                height: templateN4.size.height });
        } else {
            validationAppearance.graphics.drawTemplate(templateN4, {x: 0, y: -templateSize.height, width: templateN4.size.width,
                height: templateN4.size.height});
        }
        validationAppearance.graphics.restore(state3);
        this._disableValidationStreamCompression(validationAppearance);
        const stream: _PdfContentStream = validationAppearance.graphics._sw._stream;
        if (stream) {
            let validationStreamData: string = stream.getString();
            validationStreamData = this._reviseSignatureValidationStream(validationStreamData);
            validationAppearance.graphics._sw._clear();
            validationAppearance.graphics._sw._write(validationStreamData);
            if (!validationStreamData.endsWith('\r') && !validationStreamData.endsWith('\n')) {
                validationAppearance.graphics._sw._write('\r\n');
            }
        }
        this._disableValidationStreamCompression(validationAppearance);
        _setMatrix(validationAppearance);
        appearance._isCompletedValidationAppearance = true;
        appearance.normal.graphics._sw._clear();
        appearance.normal.graphics.drawTemplate(validationAppearance, { x: 0, y: -templateSize.height, width: templateSize.width,
            height: templateSize.height });
        this._disableValidationStreamCompression(appearance.normal);
    }
    /**
     * Disables stream compression for the specified template.
     *
     * @param {PdfTemplate} template - The template whose content stream compression is disabled.
     * @private
     * @returns {void}
     */
    _disableValidationStreamCompression(template: PdfTemplate): void {
        if (template && template._content) {
            template._content._isCompress = false;
        }
    }
    /**
     * Revises the validation appearance stream content.
     *
     * @param {string} validationStreamData - The validation appearance stream data.
     * @returns {string} The revised stream data.
     * @private
     */
    _reviseSignatureValidationStream(validationStreamData: string): string {
        if (validationStreamData.includes('\r\n')) {
            validationStreamData = validationStreamData.replace(/\r\n/g, ' ');
        }
        if (validationStreamData.includes('Q Q ')) {
            validationStreamData = validationStreamData.replace(/Q Q /g, 'Q Q\r\n');
        }
        return validationStreamData;
    }
    /**
     * Calculates the scale and position values for the validation appearance.
     *
     * @param {number} templateWidth - The template width.
     * @param {number} templateHeight - The template height.
     * @returns {number[]} The calculated scale values.
     * @private
     */
    _findScale(templateWidth: number, templateHeight: number): number[] {
        const scale: number[] = [0, 0, 0];
        scale[0] = Math.min(templateWidth, templateHeight) * 0.9;
        scale[1] = (templateWidth - scale[0]) / 2;
        scale[2] = (templateHeight - scale[0]) / 2;
        scale[0] /= 100;
        return scale;
    }
    /**
     * Applies provided signature options to this signature instance.
     *
     * @private
     * @param {PdfSignatureOptions} [options] Options for signature configuration.
     * @returns {void} nothing.
     */
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
            if (typeof options.isValidationAppearanceEnabled === 'boolean') {
                this.isValidationAppearanceEnabled = options.isValidationAppearanceEnabled;
            }
        }
    }
    /**
     * Initializes internal state from an existing signature dictionary and field.
     *
     * @private
     * @param {_PdfDictionary} dictionary The signature dictionary object.
     * @param {PdfSignatureField} field The signature field associated with the dictionary.
     * @returns {void} nothing.
     */
    _initializeInternals(dictionary: _PdfDictionary, field: PdfSignatureField): void {
        this._crossReference = field._crossReference;
        this._signed = true;
        this._signatureField = field;
        const subFilter: Record<string, CryptographicStandard> = {
            'adbe.pkcs7.detached': CryptographicStandard.cms,
            'ETSI.CAdES.detached': CryptographicStandard.cades
        };
        if (!this._signatureDictionary) {
            this._signatureDictionary = new _PdfSignatureDictionary(dictionary, this);
        }
        if (dictionary.has('SubFilter')) {
            const filter: _PdfName = dictionary.get('SubFilter');
            const kind: CryptographicStandard = filter.name ? subFilter[filter.name] : undefined;
            if (kind === CryptographicStandard.cades) {
                this._cryptographicStandard = CryptographicStandard.cades;
            }
        }
        if (dictionary.has('Contents')) {
            const arr: any = dictionary.get('ByteRange'); // eslint-disable-line
            this._ranges = this._toNumberArray(arr);
            this._digestAlgorithm = this._signatureDictionary._parseDigestAlgorithm();
            try {
                if (this._ranges && this._ranges.length > 0 && this._signatureDictionary && this._signatureDictionary._cmsSigner) {
                    const pdfBytes: Uint8Array = this._crossReference._document._rawBytes;
                    if (pdfBytes && pdfBytes.length) {
                        const eContent: Uint8Array = this._buildFromByteRange(pdfBytes, this._ranges);
                        this._signatureDictionary._cmsSigner._signedData = eContent;
                        this._signatureDictionary._cmsSigner._rsaData = eContent;
                    }
                }
            } catch (e) {
                throw new Error(e.message);
            }
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
            this._ranges = this._toNumberArray(arr);
            if (this._ranges && this._ranges.length > 0) {
                let hasPermission: boolean = false;
                const catalog: _PdfDictionary = this._crossReference._document._catalog._catalogDictionary;
                if (catalog && catalog.has('Perms')) {
                    const permission: _PdfDictionary = catalog.get('Perms');
                    if (permission && permission.has('DocMDP')) {
                        const docPermission: _PdfDictionary = permission.get('DocMDP');
                        if (docPermission && docPermission.has('ByteRange')) {
                            const byteRange: any = docPermission.get('ByteRange'); // eslint-disable-line
                            const range: number[] = this._toNumberArray(byteRange);
                            if (range && this._ranges &&
                                range.length === this._ranges.length &&
                                range.every((v: number, i: number) => v === this._ranges[<number>i])) {
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
        if (field._dictionary && field._dictionary.has('Lock')) {
            const lock: _PdfDictionary = field._dictionary.get('Lock');
            if (lock) {
                this._isLocked = true;
            }
        } else if (field._dictionary && field._dictionary.has('Kids') && this._crossReference) {
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
        this._enabledValiadtionAppearance = this._getValidationAppearance();
    }
    /**
     * Converts an array-like object into a number array if possible.
     *
     * @private
     * @param {any} arr The array-like input to convert.
     * @returns {number[]} The converted number array or `undefined` when conversion is not possible.
     */
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
    /**
     * Checks whether the provided object id corresponds to a certificated signature in the document.
     *
     * @private
     * @param {any} objId Object identifier to check.
     * @returns {boolean} True when the object id refers to a certificated signature.
     */
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
    /**
     * Ensures catalog permissions are updated when beginning a save operation for certified signatures.
     *
     * @private
     * @returns {void} nothing.
     */
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
    /**
     * Adds a lock dictionary to the signature field to lock form fields when signing.
     *
     * @private
     * @returns {void} nothing.
     */
    _lockSignature(): void {
        const lockDictionary: _PdfDictionary = new _PdfDictionary();
        lockDictionary.update('Type', _PdfName.get('SigFieldLock'));
        lockDictionary.update('Action', _PdfName.get('All'));
        lockDictionary.update('P', PdfCertificationFlag.forbidChanges);
        if (this._signatureField && this._signatureField._crossReference) {
            const ref: _PdfReference = this._signatureField._crossReference._getNextReference();
            this._signatureField._crossReference._cacheMap.set(ref, lockDictionary);
            this._signatureField._dictionary.update('Lock', ref);
        }
    }
    /**
     * Creates a new signature dictionary for the provided document and signature instance.
     *
     * @private
     * @param {PdfDocument} document The PDF document the dictionary belongs to.
     * @param {PdfSignature} signature The signature instance to back the dictionary.
     * @returns {_PdfSignatureDictionary} The created signature dictionary.
     */
    _createDictionary(document: PdfDocument, signature: PdfSignature): _PdfSignatureDictionary {
        return new _PdfSignatureDictionary(document, signature);
    }
    /**
     * Gathers and builds Long-Term Validation (LTV) data for the provided certificate chain.
     *
     * @private
     * @async
     * @param {_PdfX509Certificate[]} x509CertificateList Certificate chain used to build LTV validation data.
     * @param {RevocationType} revocationType Specifies which revocation information to collect (OCSP, CRL, or both).
     * @param {boolean} includePublicCertificates Indicates whether to include encoded public certificates in the DSS.
     * @returns {Promise<boolean>} Resolves to `true` if the required LTV data was collected/prepared successfully; otherwise, `false`.
     */
    async _getLTVData(x509CertificateList: _PdfX509Certificate[], revocationType: RevocationType,
                      includePublicCertificates: boolean): Promise<boolean> {
        const crls: _PdfRevocationList = new _PdfRevocationList();
        const ocspClient: _PdfOcsp = new _PdfOcsp();
        const crlCollection: Uint8Array[] = [];
        const ocspCollection: Uint8Array[] = [];
        const certCollection: Uint8Array[] = [];
        let isLtv: boolean = true;
        if (includePublicCertificates) {
            for (let i: number = 0; i < x509CertificateList.length; i++) {
                const cert: _PdfX509Certificate = x509CertificateList[<number>i];
                if (cert) {
                    certCollection.push(cert._getEncoded());
                }
            }
        }
        for (let k: number = 0; k < x509CertificateList.length; ++k) {
            const cert: _PdfX509Certificate = x509CertificateList[<number>k];
            if (cert._structure._toBeSignedCertificate._issuer._equals(cert._structure._toBeSignedCertificate._subject)) {
                continue;
            }
            let isCRLorOCSPembedded: boolean = false;
            let ocspEnc: Uint8Array;
            if (ocspClient && revocationType !== RevocationType.crl) {
                ocspClient._ltvCallback = this._ltvCallback;
                ocspEnc = await ocspClient._getEncodedOcspResponse(cert, this._getRoot(cert, x509CertificateList));
                if (ocspEnc) {
                    ocspCollection.push(this._buildOcspResponse(ocspEnc));
                    isCRLorOCSPembedded = true;
                }
            }
            const needCrl: boolean =
                revocationType === RevocationType.crl ||
                revocationType === RevocationType.ocspAndCrl ||
                (revocationType === RevocationType.ocspOrCrl && !ocspEnc);
            if (crls && needCrl) {
                crls._ltvCallback = this._ltvCallback;
                const cims: Uint8Array[] = await crls._getEncoded(cert);
                if (cims && cims.length > 0) {
                    for (const cim of cims) {
                        let dup: boolean = false;
                        for (const existing of crlCollection) {
                            if (_areArrayEqual(existing, cim)) {
                                dup = true;
                                isCRLorOCSPembedded = true;
                                break;
                            }
                        }
                        if (!dup) {
                            crlCollection.push(cim);
                            isCRLorOCSPembedded = true;
                        }
                    }
                }
            }
            if (!isCRLorOCSPembedded && isLtv) {
                isLtv = false;
            }
        }
        if (this._externalSignatureCallback){
            if (this._crlBytes.length === 0 && crlCollection.length > 0) {
                this._crlBytes = crlCollection;
            }
        }
        this._getDssDetails(crlCollection, ocspCollection, certCollection);
        if (this._dssDictionary && this._document && this._document._catalog)
        {
            if (this._dssDictionary._isNew) {
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, this._dssDictionary);
                this._document._catalog._catalogDictionary.set('DSS', reference);
            }
            this._dssDictionary._updated = true;
            this._document._catalog._catalogDictionary._updated = true;
            this._crossReference._allowCatalog = true;
        }
        return isLtv;
    }
    /**
     * Gets the issuer (root or parent) certificate for the given X.509 certificate
     * from the provided certificate collection.
     *
     * @private
     * @param {_PdfX509Certificate} cert The certificate whose issuer is to be resolved.
     * @param {_PdfX509Certificate[]} certs The collection of certificates to search.
     * @returns {_PdfX509Certificate} The issuer certificate if found and verified; otherwise, `null`.
     */
    _getRoot(cert: _PdfX509Certificate, certs: _PdfX509Certificate[]): _PdfX509Certificate {
        for (let i: number = 0; i < certs.length; i++) {
            const parent: _PdfX509Certificate = certs[<number>i];
            if (!(cert._structure._toBeSignedCertificate._issuer._equals(parent._structure._toBeSignedCertificate._subject))) {
                continue;
            }
            cert._verify(parent._getPublicKey());
            return parent;
        }
        return null;
    }
    /**
     * Builds a DER‑encoded OCSP response structure from a basic OCSP response.
     *
     * @private
     * @param {Uint8Array} basicOcspResponse The encoded BasicOCSPResponse bytes.
     * @returns {Uint8Array} DER‑encoded OCSPResponse byte array.
     */
    _buildOcspResponse(basicOcspResponse: Uint8Array): Uint8Array {
        const ocspBasicOid: _PdfUniqueEncodingElement = this._createPrimitive(_UniversalType.objectIdentifier, this._encodeObjectIdentifier('1.3.6.1.5.5.7.48.1.1'));
        const responseOctet: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.octetString,
            new Uint8Array(basicOcspResponse)
        );
        const responseBytesSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        responseBytesSeq._setSequence([ocspBasicOid, responseOctet]);
        const responseBytesTagged: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.context,
            _ConstructionType.constructed,
            0,
            responseBytesSeq
        );
        const responseStatus: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.primitive,
            _UniversalType.enumerated
        );
        responseStatus._setEnumerated(0);
        const ocspResponseSeq: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement(
            _TagClassType.universal,
            _ConstructionType.constructed,
            _UniversalType.sequence
        );
        ocspResponseSeq._setSequence([responseStatus, responseBytesTagged]);
        return ocspResponseSeq._toBytes();
    }
    /**
     * Creates a primitive ASN.1 encoding element with the specified tag and value.
     *
     * @private
     * @param {number} tag The universal ASN.1 tag number to assign.
     * @param {Uint8Array} value The raw value bytes for the primitive element.
     * @returns {_PdfUniqueEncodingElement} The created primitive encoding element.
     */
    _createPrimitive(tag: number, value: Uint8Array): _PdfUniqueEncodingElement {
        const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        element._tagClass = _TagClassType.universal;
        element._construction = _ConstructionType.primitive;
        element._setTagNumber(tag);
        element._setValue(value);
        return element;
    }
    /**
     * Encodes an object identifier (OID) string into its ASN.1 DER byte representation.
     *
     * @private
     * @param {string} oidString The dotted‑decimal object identifier string (e.g. `"1.3.6.1.5.5.7.48.1.1"`).
     * @returns {Uint8Array} The DER‑encoded byte representation of the object identifier.
     */
    _encodeObjectIdentifier(oidString: string): Uint8Array {
        const parts: number[] = oidString.split('.').map(Number);
        const bytes: number[] = [];
        bytes.push(parts[0] * 40 + parts[1]);
        for (let i: number = 2; i < parts.length; i++) {
            let value: number = parts[<number>i];
            if (value < 128) {
                bytes.push(value);
            } else {
                const temp: number[] = [];
                while (value > 0) {
                    temp.unshift(value & 0x7F);
                    value >>>= 7;
                }
                for (let j: number = 0; j < temp.length - 1; j++) {
                    temp[<number>j] |= 0x80;
                }
                bytes.push(...temp);
            }
        }
        return new Uint8Array(bytes);
    }
    /**
     * Builds or updates the Document Security Store (DSS) with LTV validation details.
     *
     * @private
     * @param {Uint8Array[]} crlCollection Collection of DER‑encoded CRL byte arrays.
     * @param {Uint8Array[]} ocspCollection Collection of DER‑encoded OCSP response byte arrays.
     * @param {Uint8Array[]} certCollection Collection of DER‑encoded X.509 certificate byte arrays.
     * @returns {boolean} Returns `true` if DSS details were created or updated; otherwise, `false`.
     */
    _getDssDetails(crlCollection: Uint8Array[], ocspCollection: Uint8Array[],
                   certCollection: Uint8Array[]): boolean {
        if (crlCollection.length === 0 && ocspCollection.length === 0 && certCollection.length === 0) {
            return false;
        }
        this._crossReference = this._signatureField._crossReference;
        this._document = this._signatureField._crossReference._document;
        if (this._document && this._document._catalog &&
            this._document._catalog._catalogDictionary.has('DSS')) {
            this._dssDictionary = this._document._catalog._catalogDictionary.get('DSS');
        }
        if (typeof this._dssDictionary === 'undefined' || this._dssDictionary === null) {
            this._dssDictionary = new _PdfDictionary(this._crossReference);
            this._dssDictionary._isNew = true;
        }
        let ocspArray: _PdfReference[] = [];
        let crlArray: _PdfReference[] = [];
        let certsArray: _PdfReference[] = [];
        const hasOcspList: string[] = [];
        const hasCrlList: string[] = [];
        const hasCertList: string[] = [];
        let ocspRef: _PdfReference;
        let crlRef: _PdfReference;
        let vriRef: _PdfReference;
        let certRef: _PdfReference;
        let vriDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        if (this._dssDictionary.has('OCSPs')) {
            const dssOcsp: _PdfReference[] = this._dssDictionary.get('OCSPs');
            if (dssOcsp && dssOcsp.length > 0) {
                ocspRef = this._dssDictionary.getRaw('OCSPs');
                ocspArray = dssOcsp;
            }
            if (Array.isArray(ocspArray) && ocspArray.length > 0) {
                for (let i: number = 0; i < ocspArray.length; i++) {
                    const ocspStream: _PdfStream = this._crossReference._fetch(ocspArray[<number>i]);
                    const data: Uint8Array = ocspStream.getBytes();
                    hasOcspList.push(this._getHexString(data));
                }
            }
        }
        if (this._dssDictionary.has('CRLs')) {
            const dsscrl: _PdfReference[] = this._dssDictionary.get('CRLs');
            if (Array.isArray(dsscrl) && dsscrl.length > 0) {
                crlRef = this._dssDictionary.getRaw('CRLs');
                crlArray = dsscrl;
            }
            if (Array.isArray(crlArray) && crlArray.length > 0) {
                for (let i: number = 0; i < crlArray.length; i++) {
                    const crlStream: _PdfStream = this._crossReference._fetch(crlArray[<number>i]);
                    const data: Uint8Array = crlStream.getBytes();
                    hasCrlList.push(this._getHexString(data));
                }
            }
        }
        if (this._dssDictionary.has('VRI')) {
            const dssVri: _PdfDictionary = this._dssDictionary.get('VRI');
            vriRef = this._dssDictionary.getRaw('VRI');
            if (typeof dssVri !== 'undefined' && dssVri !== null) {
                vriDictionary = dssVri;
            }
        }
        if (this._dssDictionary.has('Certs')) {
            const dssCerts: _PdfReference[] = this._dssDictionary.get('Certs');
            if (Array.isArray(dssCerts) && dssCerts.length > 0) {
                certsArray = dssCerts;
                certRef = this._dssDictionary.getRaw('Certs');
            }
            if (Array.isArray(certsArray) && certsArray.length > 0) {
                for (let i: number = 0; i < certsArray.length; i++) {
                    const certStream: any = this._crossReference._fetch(certsArray[<number>i]); // eslint-disable-line
                    const data: Uint8Array = certStream.getBytes();
                    hasCertList.push(this._getHexString(data));
                }
            }
        }
        for (let i: number = 0; i < ocspCollection.length; i++) {
            const newBytes: Uint8Array = ocspCollection[<number>i];
            const hash: string = this._getHexString(newBytes);
            if (hasOcspList.indexOf(hash) === -1) {
                const content: _PdfContentStream = new _PdfContentStream(Array.from(newBytes));
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, content);
                ocspArray.push(reference);
                hasOcspList.push(hash);
            }
        }
        for (let i: number = 0; i < crlCollection.length; i++) {
            const newBytes: Uint8Array = crlCollection[<number>i];
            const hash: string = this._getHexString(newBytes);
            if (hasCrlList.indexOf(hash) === -1) {
                const content: _PdfContentStream = new _PdfContentStream(Array.from(newBytes));
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, content);
                crlArray.push(reference);
                hasCrlList.push(hash);
            }
        }
        for (let i: number = 0; i < certCollection.length; i++) {
            const newBytes: Uint8Array = certCollection[<number>i];
            const hash: string = this._getHexString(newBytes);
            if (hasCertList.indexOf(hash) === -1) {
                const content: _PdfContentStream = new _PdfContentStream(Array.from(newBytes));
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, content);
                certsArray.push(reference);
                hasCertList.push(hash);
            }
        }
        let ocspReference: _PdfReference;
        let crlReference: _PdfReference;
        let vriReference: _PdfReference;
        let certReference: _PdfReference;
        if (ocspRef && crlRef) {
            ocspReference = ocspRef;
            crlReference = crlRef;
            vriReference = vriRef;
            certReference = certRef;
        } else {
            ocspReference = this._crossReference._getNextReference();
            crlReference = this._crossReference._getNextReference();
            vriReference = this._crossReference._getNextReference();
            certReference = this._crossReference._getNextReference();
        }
        const vriDataDictionary: _PdfDictionary = new _PdfDictionary();
        this._crossReference._cacheMap.set(ocspReference, ocspArray);
        vriDataDictionary.set('OCSP', ocspReference);
        this._crossReference._cacheMap.set(crlReference, crlArray);
        vriDataDictionary.set('CRL', crlReference);
        const vriDataReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(vriDataReference, vriDataDictionary);
        vriDataDictionary._updated = true;
        vriDictionary.set(this._getVRIName().toUpperCase(), vriDataReference);
        vriDictionary._updated = true;
        this._dssDictionary.set('OCSPs', ocspReference);
        this._dssDictionary.set('CRLs', crlReference);
        this._crossReference._cacheMap.set(vriReference, vriDictionary);
        this._dssDictionary.set('VRI', vriReference);
        if (certCollection.length > 0) {
            this._crossReference._cacheMap.set(certReference, certsArray);
            this._dssDictionary.set('Certs', certReference);
        }
        hasCertList.length = 0;
        hasCrlList.length = 0;
        hasOcspList.length = 0;
        return true;
    }
    /**
     * Generates a unique VRI (Validation Related Information) name.
     *
     * @private
     * @returns {string} Hexadecimal string representing the generated VRI name.
     */
    private _getVRIName(): string {
        const nameData: Uint8Array = _stringToBytes(_getNewGuidString()) as Uint8Array;
        const algorithm: Uint8Array = new _Sha1()._hash(nameData, 0, nameData.length);
        return _byteArrayToHexString(algorithm);
    }
    /**
     * Computes a SHA‑256 hash of the given data and returns it as a hexadecimal string.
     *
     * @private
     * @param {Uint8Array} data The input byte array to be hashed.
     * @returns {string} Hexadecimal representation of the SHA‑256 hash.
     */
    private _getHexString(data: Uint8Array): string {
        const encodedData: Uint8Array = new _Sha256()._hash(data, 0, data.length);
        return _bytesToHex(encodedData);
    }
    /**
     * Builds the signed document content from the specified byte ranges.
     *
     * @param {Uint8Array} pdfBytes The raw PDF document bytes.
     * @param {number[]} byteRange The byte range array that defines the signed portions of the document.
     * @returns {Uint8Array} A byte array containing the concatenated signed content.
     * @private
     */
    _buildFromByteRange(pdfBytes: Uint8Array, byteRange: number[]): Uint8Array {
        const parts: Uint8Array[] = [];
        for (let i: number = 0; i < byteRange.length; i += 2) {
            const start: number = byteRange[<number>i];
            const len: number = byteRange[i + 1];
            parts.push(pdfBytes.subarray(start, start + len));
        }
        const total: number = parts.reduce((s: any , p: any ) => s + p.length, 0); // eslint-disable-line
        const out: Uint8Array = new Uint8Array(total);
        let pos: number = 0;
        for (const p of parts) {
            out.set(p, pos);
            pos += p.length;
        }
        return out;
    }
    /**
     * Validates the timestamp authority (TSA) certificate chain at the specified timestamp time.
     *
     * @param {any[]} tsaCerts The collection of TSA certificates used to build the certificate chain.
     * @param {Date} timestampTime The timestamp generation time used for certificate validation.
     * @returns {boolean} true if the TSA certificate chain is valid and trusted; otherwise, false.
     * @private
     */
    _validateTsaCertificateChain(tsaCerts: any[], timestampTime: Date): boolean { // eslint-disable-line
        try {
            if (!tsaCerts || tsaCerts.length === 0) {
                return false;
            }
            let extractedCerts: any[] = []; // eslint-disable-line
            for (let i: number = 0; i < tsaCerts.length; i++) {
                const cert: any = tsaCerts[<number>i]; // eslint-disable-line
                if (cert && cert._structure) {
                    extractedCerts.push(cert);
                }
            }
            if (extractedCerts.length === 0) {
                return false;
            }
            const leaf: any = extractedCerts[0]; // eslint-disable-line
            const intermediates: any[] = extractedCerts.length > 1 ? extractedCerts.slice(1) : []; // eslint-disable-line
            const validationTime: Date =
                (timestampTime instanceof Date && !isNaN(timestampTime.getTime()))
                    ? timestampTime
                    : new Date();
            const rootCollection: any[] = this._signatureField._trustedRoots || []; // eslint-disable-line
            if (!rootCollection || rootCollection.length === 0) {
                return true;
            }
            const chainResult: any = // eslint-disable-line
                this._signatureField._buildAndValidateCertificateChain(
                    leaf,
                    intermediates,
                    rootCollection,
                    validationTime
                );
            if (!chainResult.trusted) {
                return false;
            }
            try {
                if (this._signatureField._cmsSigner && this._signatureField._cmsSigner._hasTimestampExtendedKeyUsage &&
                    !this._signatureField._cmsSigner._hasTimestampExtendedKeyUsage(leaf)) {
                    return false;
                }
            } catch {
                /* Ignore */
            }
            return true;
        } catch (error) {
            return true;
        }
    }
    /**
     * Validates embedded OCSP response from DSS dictionary.
     *
     * @private
     * @param {Uint8Array} ocspBytes OCSP response bytes
     * @returns {RevocationStatus} Revocation status from OCSP response
     */
    _validateLtvOcsp(ocspBytes: Uint8Array): RevocationStatus {
        try {
            const ocspHelper: any = new _PdfOcspResponseHelper(ocspBytes); // eslint-disable-line
            let responseObj: any; // eslint-disable-line
            if (ocspHelper._status === 0) {
                responseObj = ocspHelper._getResponseObject();
            } else {
                try {
                    const element: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
                    element._fromBytes(ocspBytes);
                    const structure: _PdfOcspHelper = new _PdfOcspHelper();
                    responseObj = new _PdfRevocationResponse(structure._getOcspStructure(element));
                } catch {
                    return RevocationStatus.unknown;
                }
            }
            if (!responseObj || !responseObj._responses || responseObj._responses.length === 0) {
                return RevocationStatus.unknown;
            }
            const singleResponse: any = responseObj._responses[0]; // eslint-disable-line
            if (!singleResponse) {
                return RevocationStatus.unknown;
            }
            const statusObj: any = singleResponse._certStatus !== null && typeof singleResponse._certStatus !== 'undefined' // eslint-disable-line
                ? singleResponse._certStatus
                : singleResponse._certificateStatus;
            if (!statusObj) {
                return RevocationStatus.unknown;
            }
            const statusTag: number = typeof statusObj._tag === 'number'
                ? statusObj._tag
                : typeof statusObj._tagNumber === 'number'
                    ? statusObj._tagNumber
                    : -1;
            switch (statusTag) {
            case 0:
                return RevocationStatus.good;
            case 1:
                return RevocationStatus.revoked;
            default:
                return RevocationStatus.unknown;
            }
        } catch {
            return RevocationStatus.unknown;
        }
    }
    /**
     * Verifies the embedded timestamp token and returns timestamp validation information.
     *
     * @returns {TimestampInformation} The timestamp validation result containing timestamp details,
     * certificate information, and validation status.
     * @private
     */
    _verifyTimeStampCore(): TimestampInformation {
        try {
            const token: Uint8Array = this._signatureField._extractTimestampToken();
            if (!token) {
                return null;
            }
            const isDocTimestamp: boolean = this._signatureField._isDocumentTimestamp();
            const tstInfo: any = _parseTimestampToken(token); // eslint-disable-line
            const timestampTime: Date = this._signatureField._extractTimestampTime(tstInfo);
            let dataToHash: Uint8Array = new Uint8Array(0);
            if (isDocTimestamp) {
                dataToHash = this._crossReference._document._rawBytes || new Uint8Array(0);
            } else {
                dataToHash = (this._signatureField._cmsSigner && (this._signatureField._cmsSigner as any)._signedData) // eslint-disable-line
                    ? (this._signatureField._cmsSigner as any)._signedData : new Uint8Array(0); // eslint-disable-line
            }
            const imprint: any = tstInfo.messageImprint; // eslint-disable-line
            const hashedMessage: Uint8Array = imprint.hashedMessage;
            let computedDigest: Uint8Array = new Uint8Array(0);
            const tsaCerts: any[] = this._signatureField._cmsSigner._extractTsaCertificates(token); // eslint-disable-line
            const tsaSignerCertificates: PdfSignerCertificate[] = tsaCerts
                ? tsaCerts.map((c: any): PdfSignerCertificate => { // eslint-disable-line
                    const p: PdfX509CertificateProperties = c._extractProperties();
                    return { certificate: p };
                })
                : undefined;
            if (imprint && dataToHash.length > 0) {
                const algOid: string = imprint.hashAlgorithm;
                if (algOid === '1.3.14.3.2.26') {
                    computedDigest = new _Sha1()._hash(dataToHash, 0, dataToHash.length);
                } else if (algOid === '2.16.840.1.101.3.4.2.1') {
                    computedDigest = new _Sha256()._hash(dataToHash, 0, dataToHash.length);
                } else if (algOid === '2.16.840.1.101.3.4.2.2') {
                    computedDigest = new _Sha384()._hash(dataToHash, 0, dataToHash.length);
                } else if (algOid === '2.16.840.1.101.3.4.2.3') {
                    computedDigest = new _Sha512()._hash(dataToHash, 0, dataToHash.length);
                }
            }
            let imprintValid: boolean = false;
            if (computedDigest && hashedMessage && computedDigest.length === hashedMessage.length) {
                imprintValid = true;
                for (let i: number = 0; i < computedDigest.length; i++) {
                    if (computedDigest[<number>i] !== hashedMessage[<number>i]) {
                        imprintValid = false;
                        break;
                    }
                }
            }
            const _makeTsaCertProps = (rawCert: any): PdfX509CertificateProperties | undefined => { // eslint-disable-line
                if (!rawCert) {
                    return undefined;
                }
                const p: PdfX509CertificateProperties = rawCert._extractProperties();
                return p;
            };
            if (isDocTimestamp && !imprintValid) {
                return {
                    isDocumentTimestamp: isDocTimestamp,
                    isValid: false,
                    timestampTime: timestampTime,
                    timestampPolicyId: tstInfo.policy,
                    certificate: _makeTsaCertProps(tsaCerts[0]),
                    signerCertificates: tsaSignerCertificates
                };
            }
            const isSignatureValid: boolean = this._signatureField._cmsSigner._verifyTsaSignature(token);
            if (!isSignatureValid) {
                return {
                    isDocumentTimestamp: isDocTimestamp,
                    isValid: false,
                    timestampTime: timestampTime,
                    timestampPolicyId: tstInfo.policy,
                    certificate: _makeTsaCertProps(tsaCerts[0]),
                    signerCertificates: tsaSignerCertificates
                };
            }
            if (!tsaCerts || tsaCerts.length === 0) {
                return {
                    isDocumentTimestamp: isDocTimestamp,
                    isValid: false,
                    timestampTime: timestampTime,
                    timestampPolicyId: tstInfo.policy,
                    certificate: undefined,
                    signerCertificates: tsaSignerCertificates
                };
            }
            const chainValidity: boolean = this._validateTsaCertificateChain(tsaCerts, timestampTime);
            return {
                isDocumentTimestamp: isDocTimestamp,
                isValid: chainValidity,
                timestampTime: timestampTime,
                timestampPolicyId: tstInfo.policy,
                certificate: _makeTsaCertProps(tsaCerts[0]),
                signerCertificates: tsaSignerCertificates
            };
        } catch (error) {
            return {
                isDocumentTimestamp: false,
                isValid: false,
                timestampTime: new Date(0),
                timestampPolicyId: '',
                certificate: undefined,
                signerCertificates: undefined
            };
        }
    }
}
