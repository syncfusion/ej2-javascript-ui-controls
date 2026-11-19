import { PdfXmpSchema } from './pdf-xmp-schema';
import { PdfXmpSchemaType } from '../enumerator';
import { PdfXmpMetadata } from './pdf-xmp-metadata';
import { PdfXmpThumbnail } from '../pdf-document-helper';
/**
 * Represents the Basic Schema.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the document properties
 * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
 * // Gets XMP metadata
 * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
 * // Sets creator tool
 * xmpMetadata.basicSchema.creatorTool = 'MyApp';
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBasicSchema extends PdfXmpSchema {
    private _creatorTool: string;
    private _label: string;
    private _nickname: string;
    private _baseUrl: string;
    private _createDate: Date;
    private _modifyDate: Date;
    private _metadataDate: Date;
    private _advisory: string[];
    private _identifier: string[];
    private _thumbnails: PdfXmpThumbnail[];
    private _rating: number[];
    /**
     * Initializes a new `PdfBasicSchema` instance.
     *
     * @private
     * @param {PdfXmpMetadata} xmp Optional parent PdfXmpMetadata reference.
     */
    constructor(xmp?: PdfXmpMetadata) {
        super(xmp);
        this._prefix = 'xap';
        this._name = 'Basic';
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
     * // Gets the basic schema from the XMP metadata
     * let basic: PdfBasicSchema = documentProperties.xmpMetadata.basicSchema;
     * // Gets the schema type
     * let schemaType: PdfXmpSchemaType = basic.schemaType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get schemaType(): PdfXmpSchemaType {
        return PdfXmpSchemaType.basic;
    }
    /**
     * Gets the creator tool.
     *
     * @returns {string} The creatorTool value.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access creator tool from basic schema
     * let creatorTool: string = xmpMetadata.basicSchema.creatorTool;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get creatorTool(): string {
        if (!this._creatorTool) {
            this._creatorTool = (this._getProperty('xap:CreatorTool') as string);
        }
        return this._creatorTool;
    }
    /**
     * Sets the creator tool.
     *
     * @param {string} value The creatorTool to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets creator tool
     * xmp.basicSchema.creatorTool = 'MyApp 1.0';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set creatorTool(value: string) {
        this._creatorTool = value;
        this._setProperty('xap:CreatorTool', value);
    }
    /**
     * Gets the label.
     *
     * @returns {string} The label.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access label from basic schema
     * let label: string = xmpMetadata.basicSchema.label;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get label(): string {
        if (!this._label) {
            this._label = (this._getProperty('xap:Label') as string);
        }
        return this._label;
    }
    /**
     * Sets the label.
     *
     * @param {string} value The label to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets label
     * xmp.basicSchema.label = 'Sample Label';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set label(value: string) {
        this._label = value;
        this._setProperty('xap:Label', value);
    }
    /**
     * Gets the nickname.
     *
     * @returns {string} The nickname.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access nickname from basic schema
     * let nickname: string = xmpMetadata.basicSchema.nickname;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get nickname(): string {
        if (!this._nickname) {
            this._nickname = (this._getProperty('xap:Nickname') as string);
        }
        return this._nickname;
    }
    /**
     * Sets the nickname.
     *
     * @param {string} value The nickname to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets nickname
     * xmp.basicSchema.nickname = 'My Document';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set nickname(value: string) {
        this._nickname = value;
        this._setProperty('xap:Nickname', value);
    }
    /**
     * Gets the base URL.
     *
     * @returns {string} The base URL.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access base URL from basic schema
     * let baseUrl: string = xmpMetadata.basicSchema.baseUrl;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get baseUrl(): string {
        if (!this._baseUrl) {
            this._baseUrl = (this._getProperty('xap:BaseURL') as string);
        }
        return this._baseUrl;
    }
    /**
     * Sets the base URL.
     *
     * @param {string} value The base URL to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets base URL
     * xmp.basicSchema.baseUrl = 'https://example.com';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set baseUrl(value: string) {
        this._baseUrl = value;
        this._setProperty('xap:BaseURL', value);
    }
    /**
     * Gets the creation date.
     *
     * @returns {Date} The creation date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access creation date from basic schema
     * let createDate: Date = xmpMetadata.basicSchema.createDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get createDate(): Date {
        if (!this._createDate) {
            this._createDate = (this._getProperty('xap:CreateDate') as Date);
        }
        return this._createDate;
    }
    /**
     * Sets the creation date.
     *
     * @param {Date} value The createDate value to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets creation date
     * xmp.basicSchema.createDate = new Date();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set createDate(value: Date) {
        this._createDate = value;
        this._setProperty('xap:CreateDate', value);
    }
    /**
     * Gets the modification date.
     *
     * @returns {Date} The modification date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access modification date from basic schema
     * let modifyDate: Date = xmpMetadata.basicSchema.modifyDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get modifyDate(): Date {
        if (!this._modifyDate) {
            this._modifyDate = (this._getProperty('xap:ModifyDate') as Date);
        }
        return this._modifyDate;
    }
    /**
     * Sets the modification date.
     *
     * @param {Date} value The modification date to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets modification date
     * xmp.basicSchema.modifyDate = new Date();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set modifyDate(value: Date) {
        this._modifyDate = value;
        this._setProperty('xap:ModifyDate', value);
    }
    /**
     * Gets the metadata date.
     *
     * @returns {Date} The metadata date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access metadata date from basic schema
     * let metadataDate: Date = xmpMetadata.basicSchema.metadataDate;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get metadataDate(): Date {
        if (!this._metadataDate) {
            this._metadataDate = (this._getProperty('xap:MetadataDate') as Date);
        }
        return this._metadataDate;
    }
    /**
     * Sets the metadata date.
     *
     * @param {Date} value The metadata date to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets metadata date
     * xmp.basicSchema.metadataDate = new Date();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set metadataDate(value: Date) {
        this._metadataDate = value;
        this._setProperty('xap:MetadataDate', value);
    }
    /**
     * Gets the advisory.
     *
     * @returns {string[]} The advisory.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access advisory from basic schema
     * let advisory: string[] = xmpMetadata.basicSchema.advisory;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get advisory(): string[] {
        if (!this._advisory) {
            this._advisory = (this._getProperty('xap:Advisory') as string[]);
        }
        return this._advisory;
    }
    /**
     * Sets the advisory.
     *
     * @param {string[]} value The advisory to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets advisory
     * xmp.basicSchema.advisory = ['Advisory 1', 'Advisory 2'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set advisory(value: string[]) {
        this._advisory = value;
        this._setProperty('xap:Advisory', value);
    }
    /**
     * Gets the identifier.
     *
     * @returns {string[]} The identifier.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access identifier from basic schema
     * let identifier: string[] = xmpMetadata.basicSchema.identifier;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get identifier(): string[] {
        if (!this._identifier) {
            this._identifier = (this._getProperty('xap:Identifier') as string[]);
        }
        return this._identifier;
    }
    /**
     * Sets the identifier.
     *
     * @param {string[]} value The identifier  to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets identifier
     * xmp.basicSchema.identifier = ['ID-001', 'ID-002'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set identifier(value: string[]) {
        this._identifier = value;
        this._setProperty('xap:Identifier', value);
    }
    /**
     * Gets the thumbnails.
     *
     * @returns {PdfXmpThumbnail[]} The thumbnails.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access thumbnails from basic schema
     * let thumbnails: PdfXmpThumbnail[] = xmpMetadata.basicSchema.thumbnails;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get thumbnails(): PdfXmpThumbnail[] {
        if (!this._thumbnails) {
            this._thumbnails = (this._getProperty('xap:Thumbnails') as PdfXmpThumbnail[]);
        }
        return this._thumbnails;
    }
    /**
     * Sets the thumbnails.
     *
     * @param {PdfXmpThumbnail[]} value The thumbnails to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Creates thumbnail array
     * let thumbnailArray: PdfXmpThumbnail[] = [{width: 10, height: 10, format: 'JPEG'}]
     * // Sets thumbnails (requires PdfXmpThumbnail objects)
     * xmp.basicSchema.thumbnails = thumbnailArray;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set thumbnails(value: PdfXmpThumbnail[]) {
        this._thumbnails = value;
        this._setProperty('xap:Thumbnails', value);
    }
    /**
     * Gets the rating.
     *
     * @returns {number[]} The rating.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Access rating from basic schema
     * let rating: number[] = xmpMetadata.basicSchema.rating;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rating(): number[] {
        if (this._rating) {
            return this._rating;
        }
        this._rating = this._getProperty('xap:Rating') as number[];
        return this._rating;
    }
    /**
     * Sets the rating.
     *
     * @param {number[]} value The rating to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets XMP metadata
     * let xmpMetadata: PdfXmpMetadata = documentProperties.xmpMetadata;
     * // Sets rating
     * xmp.basicSchema.rating = [5, 4, 3];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rating(value: number[]) {
        this._rating = value;
        this._setProperty('xap:Rating', value);
    }
}
