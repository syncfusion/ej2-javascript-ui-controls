import { _XmlWriter } from '../import-export/xml-writer';
import { PdfXmpSchema } from './pdf-xmp-schema';
import { PdfXmpSchemaType } from '../enumerator';
import { PdfXmpDimensionsStruct } from '../pdf-document-helper';
import { PdfXmpMetadata } from './pdf-xmp-metadata';
/**
 Represents metadata for paginated text structure in a PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Access the document properties
 * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
 * // Gets XMP metadata
 * let xmp: PdfXmpMetadata = documentProperties.xmpMetadata;
 * // Sets page count
 * xmp.pagedTextSchema.pageCount = 5;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPagedTextSchema extends PdfXmpSchema {
    private _pageCount: string;
    private _MaxPageSize: PdfXmpDimensionsStruct;
    private _fonts: string[];
    private _plateNames: string[];
    private _Colorants: string[];
    /**
     * Initializes a new `PdfPagedTextSchema` instance.
     *
     * @private
     * @param {PdfXmpMetadata} xmp Optional parent PdfXmpMetadata reference.
     */
    constructor(xmp?: PdfXmpMetadata) {
        super(xmp);
        this._prefix = 'xmpTPg';
        this._name = 'PagedText';
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
     * // Gets the paged text schema from the XMP metadata
     * let pageTextSchema: PdfPagedTextSchema = documentProperties.xmpMetadata.pagedTextSchema;
     * // Gets the schema type
     * let schemaType: PdfXmpSchemaType = pageTextSchema.schemaType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get schemaType(): PdfXmpSchemaType {
        return PdfXmpSchemaType.pagedText;
    }
    /**
     * Gets the page count.
     *
     * @returns {number} The number of pages.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access page count from paged text schema
     * let pageCount: number = xmpMetadata.pagedTextSchema.pageCount;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageCount(): number {
        if (typeof this._pageCount !== 'undefined') {
            return parseInt(this._pageCount, 10);
        }
        this._pageCount = this._getProperty('xmpTPg:NPages');
        return typeof this._pageCount !== 'undefined' ? parseInt(String(this._pageCount), 10) : 0;
    }
    /**
     * Sets the page count.
     *
     * @param {number} value The number of pages to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets page count
     * xmp.pagedTextSchema.pageCount = 10;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set pageCount(value: number) {
        this._pageCount = String(value);
        this._setProperty('xmpTPg:NPages', String(value));
    }
    /**
     * Gets the maximum page dimensions structure.
     *
     * @returns {PdfXmpDimensionsStruct} The maximum page dimensions.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access maximum page size from paged text schema
     * let maxPageSize: PdfXmpDimensionsStruct = xmpMetadata.pagedTextSchema.maxPageSize;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get maxPageSize(): PdfXmpDimensionsStruct {
        if (typeof this._MaxPageSize !== 'undefined') {
            return this._MaxPageSize;
        }
        return this._getProperty('xmpTPg:MaxPageSize') as PdfXmpDimensionsStruct;
    }
    /**
     * Sets the maximum page dimensions structure.
     *
     * @param {PdfXmpDimensionsStruct} value The maximum page dimensions to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets maximum page size
     * xmp.pagedTextSchema.maxPageSize = { width: 8.5, heigth: 11, unit: 'in' };
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set maxPageSize(value: PdfXmpDimensionsStruct) {
        this._MaxPageSize = value;
        this._setProperty('xmpTPg:MaxPageSize', value);
    }
    /**
     * Gets the fonts collection (rdf:Bag).
     *
     * @returns {string[]} The fonts collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access fonts from paged text schema
     * let fonts: string[] = xmpMetadata.pagedTextSchema.fonts;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fonts(): string[] {
        return this._fonts || (this._getProperty('xmpTPg:Fonts') as string[]) || [];
    }
    /**
     * Sets the fonts collection (rdf:Bag).
     *
     * @param {string[]} value The fonts collection to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets fonts
     * xmp.pagedTextSchema.fonts = ['Arial', 'Times New Roman', 'Helvetica'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set fonts(value: string[]) {
        this._fonts = value;
        this._setProperty('xmpTPg:Fonts', value);
    }
    /**
     * Gets the plate names (rdf:Seq).
     *
     * @returns {string[]} The plate names.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access plate names from paged text schema
     * let plateNames: string[] = xmpMetadata.pagedTextSchema.plateNames;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get plateNames(): string[] {
        return this._plateNames || (this._getProperty('xmpTPg:PlateNames') as string[]) || [];
    }
    /**
     * Sets the plate names (rdf:Seq).
     *
     * @param {string[]} value The plate names to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets plate names
     * xmp.pagedTextSchema.plateNames = ['CMYK Cyan', 'CMYK Magenta', 'CMYK Yellow', 'CMYK Black'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set plateNames(value: string[]) {
        this._plateNames = value;
        this._setProperty('xmpTPg:PlateNames', value);
    }
    /**
     * Gets the colorants (rdf:Seq).
     *
     * @returns {string[]} The colorants.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmpMetadata = documentProperties.xmpMetadata;
     * // Access colorants from paged text schema
     * let colorants: string[] = xmpMetadata.pagedTextSchema.colorants;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get colorants(): string[] {
        return this._Colorants || (this._getProperty('xmpTPg:Colorants') as string[]) || [];
    }
    /**
     * Sets the colorants (rdf:Seq).
     *
     * @param {string[]} value The colorants to set.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the document properties
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation(false);
     * // Gets the xmp metadata
     * let xmp = documentProperties.xmpMetadata;
     * // Sets colorants
     * xmp.pagedTextSchema.colorants = ['Cyan', 'Magenta', 'Yellow', 'Black'];
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set colorants(value: string[]) {
        this._Colorants = value;
        this._setProperty('xmpTPg:Colorants', value);
    }
    /**
     * Serializes all schema properties to RDF/XML using the provided writer.
     * Overrides the base method to handle the PdfXmpDimensionsStruct for maxPageSize.
     *
     * @private
     * @param {_XmlWriter} writer The XML writer to serialize into.
     * @returns {void}
     */
    _writeXml(writer: _XmlWriter): void {
        const xmpTPgNs: string = 'http://ns.adobe.com/xap/1.0/t/pg/';
        const rdfNs: string = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
        const stDimNs: string = 'http://ns.adobe.com/xap/1.0/sType/Dimensions#';
        if (typeof this._MaxPageSize !== 'undefined') {
            writer._writeStartElement('MaxPageSize', 'xmpTPg', xmpTPgNs);
            writer._writeStartElement('Description', 'rdf', rdfNs);
            writer._writeNamespaceDeclaration('stDim', stDimNs);
            writer._writeElementString('w', String(this._MaxPageSize.width), 'stDim', stDimNs);
            writer._writeElementString('h', String(this._MaxPageSize.height), 'stDim', stDimNs);
            if (typeof this._MaxPageSize.unit !== 'undefined') {
                writer._writeElementString('unit', this._MaxPageSize.unit, 'stDim', stDimNs);
            }
            writer._writeEndElement();
            writer._writeEndElement();
        }
        let keysArray: string[] = [];
        if (this._properties && typeof (this._properties as any).keys === 'function') { // eslint-disable-line
            keysArray = Array.from((this._properties as any).keys()); // eslint-disable-line
        }
        const keys: string[] = keysArray.sort();
        for (const key of keys) {
            if (key === 'xmpTPg:MaxPageSize') {
                continue;
            }
            const value: any = this._properties.get(key); // eslint-disable-line
            if (value === null || typeof value === 'undefined') {
                continue;
            }
            const colonIdx: number = key.indexOf(':');
            const localName: string = colonIdx >= 0 ? key.substring(colonIdx + 1) : key;
            const elemPrefix: string = colonIdx >= 0 ? key.substring(0, colonIdx) : '';
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    continue;
                }
                writer._writeStartElement(localName, elemPrefix, xmpTPgNs);
                const arrayType: string = key === 'xmpTPg:Colorants' || key === 'xmpTPg:PlateNames' ? 'Seq' : 'Bag';
                writer._writeStartElement(arrayType, 'rdf', rdfNs);
                for (const item of value) {
                    writer._writeElementString('li', String(item), 'rdf', rdfNs);
                }
                writer._writeEndElement();
                writer._writeEndElement();
            } else {
                writer._writeElementString(localName, String(value), elemPrefix, xmpTPgNs);
            }
        }
    }
}
