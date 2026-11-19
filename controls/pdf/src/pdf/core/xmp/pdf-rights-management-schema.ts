import { PdfXmpSchema } from './pdf-xmp-schema';
import { PdfXmpSchemaType } from '../enumerator';
import { PdfXmpLangArray } from '../pdf-document-helper';
import { PdfXmpMetadata } from './pdf-xmp-metadata';
/**
 * Represents metadata related to document rights and permissions.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the document properties
 * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
 * // Gets XMP metadata
 * let xmp: PdfXmpMetadata = documentProperties.xmpMetadata;
 * // Sets rights information
 * xmp.rightsManagementSchema.isMarked = true;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRightsManagementSchema extends PdfXmpSchema {
    private _certificate: string;
    private _webStatement: string;
    private _isMarked: boolean;
    private _owner: string[];
    private _usageTerms: PdfXmpLangArray;
    /**
     * Initializes a new `PdfRightsManagementSchema` instance.
     *
     * @private
     * @param {PdfXmpMetadata} xmp Optional parent PdfXmpMetadata reference.
     */
    constructor(xmp?: PdfXmpMetadata) {
        super(xmp);
        this._prefix = 'xmpRights';
        this._name = 'RightsManagement';
    }
    /**
     * Gets the schema type.
     *
     * @returns {PdfXmpSchemaType} The schema type.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the rights management schema from the XMP metadata
     * let rightSchema: PdfRightsManagementSchema = documentProperties.xmpMetadata.rightsManagementSchema;
     * // Gets the schema type
     * let schemaType: PdfXmpSchemaType = rightSchema.schemaType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get schemaType(): PdfXmpSchemaType {
        return PdfXmpSchemaType.rightsManagement;
    }
    /**
     * Gets the certificate URL.
     *
     * @returns {string} The certificate URL.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access certificate URL from rights management schema
     * let certificate: string = xmpMetadata.rightsManagementSchema.certificateUrl ;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get certificateUrl (): string {
        if (!this._certificate) {
            this._certificate = (this._getProperty('xmpRights:Certificate') as string);
        }
        return this._certificate;
    }
    /**
     * Sets the certificate URL.
     *
     * @param {string} value The certificate URL to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets certificate URL
     * xmp.rightsManagementSchema.certificateUrl  = 'https://example.com/certificate';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set certificateUrl (value: string) {
        this._certificate = value;
        this._setProperty('xmpRights:Certificate', value);
    }
    /**
     * Gets the web statement URL.
     *
     * @returns {string} The web statement URL.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access web statement URL from rights management schema
     * let webStatement: string = xmpMetadata.rightsManagementSchema.webStatement;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get webStatement(): string {
        if (!this._webStatement) {
            this._webStatement = (this._getProperty('xmpRights:WebStatement') as string);
        }
        return this._webStatement;
    }
    /**
     * Sets the web statement URL.
     *
     * @param {string} value The web statement URL to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets web statement URL
     * xmp.rightsManagementSchema.webStatement = 'https://example.com/rights';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set webStatement(value: string) {
        this._webStatement = value;
        this._setProperty('xmpRights:WebStatement', value);
    }
    /**
     * Gets whether the document is rights-marked.
     *
     * @returns {boolean} The rights-marked status.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access marked status from rights management schema
     * let isMarked: boolean = xmpMetadata.rightsManagementSchema.isMarked;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isMarked(): boolean {
        if (typeof this._isMarked !== 'undefined') {
            return this._isMarked;
        }
        const stored: any = this._getProperty('xmpRights:Marked'); // eslint-disable-line
        if (typeof stored === 'string') {
            return stored === 'True';
        }
        return false;
    }
    /**
     * Sets whether the document is rights-marked.
     *
     * @param {boolean} value The rights-marked status to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets rights-marked status
     * xmp.rightsManagementSchema.isMarked = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set isMarked(value: boolean) {
        this._isMarked = value;
        this._setProperty('xmpRights:Marked', value);
    }
    /**
     * Gets the list of owners(rdf:Bag).
     *
     * @returns {string[]} The list of owners.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access owners from rights management schema
     * let owners: string[] = xmpMetadata.rightsManagementSchema.owners;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get owners(): string[] {
        return this._owner || (this._getProperty('xmpRights:Owner') as string[]) || [];
    }
    /**
     * Sets the list of owners (rdf:Bag).
     *
     * @param {string[]} value The list of owners to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets the list of owners
     * xmp.rightsManagementSchema.owners = ['Owner 1', 'Owner 2'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set owners(value: string[]) {
        this._owner = value;
        this._setProperty('xmpRights:Owner', value);
    }
    /**
     * Gets the usage terms language (rdf:Alt).
     *
     * @returns {PdfXmpLangArray} The usage terms.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access usage terms from rights management schema
     * let usageTerms: PdfXmpLangArray = xmpMetadata.rightsManagementSchema.usageTerms;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get usageTerms(): PdfXmpLangArray {
        if (!this._usageTerms) {
            this._usageTerms = (this._getProperty('xmpRights:UsageTerms') as PdfXmpLangArray);
        }
        return this._usageTerms;
    }
    /**
     * Sets the usage terms language (rdf:Alt).
     *
     * @param {PdfXmpLangArray} value The usage terms to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets usage terms
     * xmp.rightsManagementSchema.usageTerms = { 'en': 'For internal use only', 'fr': 'Pour usage interne uniquement' } as PdfXmpLangArray;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set usageTerms(value: PdfXmpLangArray) {
        this._usageTerms = value;
        this._setProperty('xmpRights:UsageTerms', value);
    }
}
