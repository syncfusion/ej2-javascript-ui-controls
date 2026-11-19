import { PdfXmpSchema } from './pdf-xmp-schema';
import { PdfXmpSchemaType } from '../enumerator';
import { PdfXmpLangArray } from '../pdf-document-helper';
import { PdfXmpMetadata } from './pdf-xmp-metadata';
/**
 Represents standard Dublin Core metadata for document description.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the document properties
 * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
 * // Gets XMP metadata
 * let xmp: PdfXmpMetadata = documentProperties.xmpMetadata;
 * // Sets the creator
 * xmp.dublinCoreSchema.creator = ['Author Name'];
 * // Assign to documentProperties
 * documentProperties.xmpMetadata = xmp;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfDublinCoreSchema extends PdfXmpSchema {
    private _coverage: string;
    private _identifier: string;
    private _source: string;
    private _format: string;
    private _contributor: string[];
    private _creator: string[];
    private _date: string[];
    private _publisher: string[];
    private _relation: string[];
    private _subject: string[];
    private _type: string[];
    private _description: PdfXmpLangArray;
    private _rights: PdfXmpLangArray;
    private _title: PdfXmpLangArray;
    /**
     * Initializes a new `PdfDublinCoreSchema` instance.
     *
     * @private
     * @param {PdfXmpMetadata} xmp Optional parent PdfXmpMetadata reference.
     */
    constructor(xmp?: PdfXmpMetadata) {
        super(xmp);
        this._prefix = 'dc';
        this._name = 'DublinCore';
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
     * // Gets the dublincore schema from the XMP metadata
     * let dublincore: PdfDublinCoreSchema = documentProperties.xmpMetadata.dublinCoreSchema;
     * // Gets the schema type
     * let schemaType: PdfXmpSchemaType = dublincore.schemaType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get schemaType(): PdfXmpSchemaType {
        return PdfXmpSchemaType.dublinCore;
    }
    /**
     * Gets the list of contributor (rdf:Bag).
     *
     * @returns {string[]} The list of contributor.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access contributor from Dublin Core schema
     * let contributor: string[] = xmpMetadata.dublinCoreSchema.contributor;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get contributor(): string[] {
        if (!this._contributor) {
            this._contributor = (this._getProperty('dc:contributor') as string[]);
        }
        return this._contributor;
    }
    /**
     * Sets the list of contributor (rdf:Bag).
     *
     * @param {string[]} value The list of contributor to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets contributor
     * xmp.dublinCoreSchema.contributor = ['Contributor 1', 'Contributor 2'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set contributor(value: string[]) {
        this._contributor = value;
        this._setProperty('dc:contributor', value);
    }
    /**
     * Gets the list of creator (rdf:Seq).
     *
     * @returns {string[]} The list of creator.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access creator from Dublin Core schema
     * let creator: string[] = xmpMetadata.dublinCoreSchema.creator;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get creator(): string[] {
        if (!this._creator) {
            this._creator = (this._getProperty('dc:creator') as string[]);
        }
        return this._creator;
    }
    /**
     * Sets the list of creator (rdf:Seq).
     *
     * @param {string[]} value The list of creator to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets creator
     * xmp.dublinCoreSchema.creator = ['Author Name'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set creator(value: string[]) {
        this._creator = value;
        this._setProperty('dc:creator', value);
    }
    /**
     * Gets list of the date (rdf:Seq).
     *
     * @returns {string[]} The list of date.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access date from Dublin Core schema
     * let date: string[] = xmpMetadata.dublinCoreSchema.date;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get date(): string[] {
        if (!this._date) {
            this._date = (this._getProperty('dc:date') as string[]);
        }
        return this._date;
    }
    /**
     * Sets the list of date (rdf:Seq).
     *
     * @param {string[]} value The list of date to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets date
     * xmp.dublinCoreSchema.date = ['2024-01-15', '2024-02-20'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set date(value: string[]) {
        this._date = value;
        this._setProperty('dc:date', value);
    }
    /**
     * Gets the publishers (rdf:Bag).
     *
     * @returns {string[]} The publishers.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access publisher from Dublin Core schema
     * let publisher: string[] = xmpMetadata.dublinCoreSchema.publisher;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get publisher(): string[] {
        if (!this._publisher) {
            this._publisher = (this._getProperty('dc:publisher') as string[]);
        }
        return this._publisher;
    }
    /**
     * Sets the publishers (rdf:Bag).
     *
     * @param {string[]} value The publishers to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets publisher
     * xmp.dublinCoreSchema.publisher = ['Publisher Name'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set publisher(value: string[]) {
        this._publisher = value;
        this._setProperty('dc:publisher', value);
    }
    /**
     * Gets the list of relation (rdf:Bag).
     *
     * @returns {string[]} The list of relation.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access relation from Dublin Core schema
     * let relation: string[] = xmpMetadata.dublinCoreSchema.relation;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get relation(): string[] {
        if (!this._relation) {
            this._relation = (this._getProperty('dc:relation') as string[]);
        }
        return this._relation;
    }
    /**
     * Sets the list of relation (rdf:Bag).
     *
     * @param {string[]} value The list of relation to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets relation
     * xmp.dublinCoreSchema.relation = ['Related Document 1', 'Related Document 2'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set relation(value: string[]) {
        this._relation = value;
        this._setProperty('dc:relation', value);
    }
    /**
     * Gets the list of subject (rdf:Bag).
     *
     * @returns {string[]} The list of subject.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access subject from Dublin Core schema
     * let subject: string[] = xmpMetadata.dublinCoreSchema.subject;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get subject(): string[] {
        if (!this._subject) {
            this._subject = (this._getProperty('dc:subject') as string[]);
        }
        return this._subject;
    }
    /**
     * Sets the list of subject (rdf:Bag).
     *
     * @param {string[]} value The list of subject to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets subject
     * xmp.dublinCoreSchema.subject = ['Subject 1', 'Subject 2', 'Subject 3'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set subject(value: string[]) {
        this._subject = value;
        this._setProperty('dc:subject', value);
    }
    /**
     * Gets the list of type (rdf:Bag).
     *
     * @returns {string[]} The list of type.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access type from Dublin Core schema
     * let type: string[] = xmpMetadata.dublinCoreSchema.type;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get type(): string[] {
        if (!this._type) {
            this._type = (this._getProperty('dc:type') as string[]);
        }
        return this._type;
    }
    /**
     * Sets the list of type (rdf:Bag).
     *
     * @param {string[]} value The list of type to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets type
     * xmp.dublinCoreSchema.type = ['Report', 'Document'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set type(value: string[]) {
        this._type = value;
        this._setProperty('dc:type', value);
    }
    /**
     * Gets the title (rdf:Alt).
     *
     * @returns {PdfXmpLangArray} The title value.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access title from Dublin Core schema
     * let title: PdfXmpLangArray = xmpMetadata.dublinCoreSchema.title;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get title(): PdfXmpLangArray {
        if (!this._title) {
            this._title = (this._getProperty('dc:title') as PdfXmpLangArray);
        }
        return this._title;
    }
    /**
     * Sets the title (rdf:Alt).
     *
     * @param {PdfXmpLangArray} value The title to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets title
     * xmp.dublinCoreSchema.title = { 'en': 'Document Title', 'fr': 'Titre du Document' } as PdfXmpLangArray;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set title(value: PdfXmpLangArray) {
        this._title = value;
        this._setProperty('dc:title', value);
    }
    /**
     * Gets the description (rdf:Alt).
     *
     * @returns {PdfXmpLangArray} The description.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access description from Dublin Core schema
     * let description: PdfXmpLangArray = xmpMetadata.dublinCoreSchema.description;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get description(): PdfXmpLangArray {
        if (!this._description) {
            this._description = (this._getProperty('dc:description') as PdfXmpLangArray);
        }
        return this._description;
    }
    /**
     * Sets the description (rdf:Alt).
     *
     * @param {PdfXmpLangArray} value The description to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets description
     * xmp.dublinCoreSchema.description = { 'en': 'Document Description', 'fr': 'Description du Document' } as PdfXmpLangArray;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set description(value: PdfXmpLangArray) {
        this._description = value;
        this._setProperty('dc:description', value);
    }
    /**
     * Gets the rights (rdf:Alt).
     *
     * @returns {PdfXmpLangArray} The rights value.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access rights from Dublin Core schema
     * let rights: PdfXmpLangArray = xmpMetadata.dublinCoreSchema.rights;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rights(): PdfXmpLangArray {
        if (!this._rights) {
            this._rights = (this._getProperty('dc:rights') as PdfXmpLangArray);
        }
        return this._rights;
    }
    /**
     * Sets the rights (rdf:Alt).
     *
     * @param {PdfXmpLangArray} value The rights to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets rights
     * xmp.dublinCoreSchema.rights = { 'en': 'Copyright 2024', 'fr': 'Droits d\'auteur 2024' } as PdfXmpLangArray;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rights(value: PdfXmpLangArray) {
        this._rights = value;
        this._setProperty('dc:rights', value);
    }
    /**
     * Gets the coverage.
     *
     * @returns {string} The coverage.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access coverage from Dublin Core schema
     * let coverage: string = xmpMetadata.dublinCoreSchema.coverage;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get coverage(): string {
        if (!this._coverage) {
            this._coverage = (this._getProperty('dc:coverage') as string);
        }
        return this._coverage;
    }
    /**
     * Sets the coverage.
     *
     * @param {string} value The coverage to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets coverage
     * xmp.dublinCoreSchema.coverage = 'Global Coverage';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set coverage(value: string) {
        this._coverage = value;
        this._setProperty('dc:coverage', value);
    }
    /**
     * Gets the identifier.
     *
     * @returns {string} The identifier.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access identifier from Dublin Core schema
     * let identifier: string = xmpMetadata.dublinCoreSchema.identifier;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get identifier(): string {
        if (!this._identifier) {
            this._identifier = (this._getProperty('dc:identifier') as string);
        }
        return this._identifier;
    }
    /**
     * Sets the identifier.
     *
     * @param {string} value The identifier to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets identifier
     * xmp.dublinCoreSchema.identifier = 'DOC-2024-001';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set identifier(value: string) {
        this._identifier = value;
        this._setProperty('dc:identifier', value);
    }
    /**
     * Gets the source.
     *
     * @returns {string} The source.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access source from Dublin Core schema
     * let source: string = xmpMetadata.dublinCoreSchema.source;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get source(): string {
        if (!this._source) {
            this._source = (this._getProperty('dc:source') as string);
        }
        return this._source;
    }
    /**
     * Sets the source.
     *
     * @param {string} value The source to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets source
     * xmp.dublinCoreSchema.source = 'Original Document Source';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set source(value: string) {
        this._source = value;
        this._setProperty('dc:source', value);
    }
    /**
     * Gets the format.
     *
     * @returns {string} The format.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets XMP metadata
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access format from Dublin Core schema
     * let format: string = xmpMetadata.dublinCoreSchema.format;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get format(): string {
        if (!this._format) {
            this._format = (this._getProperty('dc:format') as string);
        }
        return this._format;
    }
    /**
     * Sets the format.
     *
     * @param {string} value The format to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets format
     * xmp.dublinCoreSchema.format = 'application/pdf';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set format(value: string) {
        this._format = value;
        this._setProperty('dc:format', value);
    }
}
