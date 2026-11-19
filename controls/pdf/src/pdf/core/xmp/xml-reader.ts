import { PdfXmpMetadata } from './pdf-xmp-metadata';
import { PdfXmpLangArray, PdfXmpDimensionsStruct, PdfXmpThumbnail } from '../pdf-document-helper';
import { PdfSchema } from './pdf-schema';
import { PdfDublinCoreSchema } from './pdf-dublin-core-schema';
import { PdfPagedTextSchema } from './pdf-paged-text-schema';
import { PdfRightsManagementSchema } from './pdf-rights-management-schema';
import { PdfBasicJobTicketSchema } from './pdf-basic-job-ticket-schema';
import { PdfCustomSchema } from './pdf-custom-schema';
import { _bytesToString } from '../utils';
/**
 * Internal XML reader for parsing XMP metadata from PDF streams.
 * Reads RDF/XML format and reconstructs PdfXmpMetadata with all schemas.
 *
 * @private
 */
export class _XmlReader {
    private _xmlDoc: Document;
    private _xmp: PdfXmpMetadata;
    /**
     * Loads and parses XML data from a byte array or string.
     *
     * @private
     * @param {Uint8Array | string} data The XML data to parse.
     * @returns {void}
     */
    _load(data: Uint8Array | string): void {
        let pdfString: string;
        if (data instanceof Uint8Array) {
            pdfString = _bytesToString(data);
        } else {
            pdfString = data;
        }
        const start:  number = pdfString.lastIndexOf('<?xpacket begin');
        if (start === -1) {
            throw new Error('XMP metadata not found in PDF');
        }
        const end: number = pdfString.indexOf('<?xpacket end=', start);
        if (end === -1) {
            throw new Error('XMP metadata not found in PDF');
        }
        const xmlString: string = pdfString.substring(start, pdfString.indexOf('?>', end) + 2);
        const parser: DOMParser = new DOMParser();
        this._xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        this._validate(this._xmlDoc);
    }
    /**
     * Validates the parsed XML document for errors.
     *
     * @private
     * @param {Document} doc The XML document to validate.
     * @returns {void}
     */
    private _validate(doc: Document): void {
        const parserError: Element = doc.querySelector('parsererror');
        if (parserError) {
            const errorText: string = parserError.textContent || 'Unknown parse error';
            throw new Error('Invalid XMP XML: ' + errorText);
        }
    }
    /**
     * Parses the loaded XML document into a PdfXmpMetadata object.
     *
     * @private
     * @returns {PdfXmpMetadata} The parsed metadata object.
     */
    _parseXmp(): PdfXmpMetadata {
        this._xmp = new PdfXmpMetadata();
        const rdfRoot: Element = this._getRdfRoot();
        const descriptions: HTMLCollectionOf<Element> = rdfRoot.getElementsByTagNameNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'Description');
        for (let i: number = 0; i < descriptions.length; i++) {
            this._parseSchemaNode(descriptions.item(i));
        }
        return this._xmp;
    }
    /**
     * Locates the rdf:RDF root element in the XML document.
     *
     * @private
     * @returns {Element} The rdf:RDF element.
     */
    private _getRdfRoot(): Element {
        if (!this._xmlDoc) {
            throw new Error('XML document not loaded');
        }
        const rdfElements: HTMLCollectionOf<Element> = this._xmlDoc.getElementsByTagNameNS(
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'RDF'
        );
        if (rdfElements.length === 0) {
            throw new Error('rdf:RDF element not found in XMP metadata');
        }
        return rdfElements[0];
    }
    /**
     * Parses a single rdf:Description node and routes to appropriate schema parser.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseSchemaNode(node: Element): void {
        const attributes: NamedNodeMap = node.attributes;
        for (let i: number = 0; i < attributes.length; i++) {
            const attr: Attr = attributes.item(i);
            if (attr.name.startsWith('xmlns:')) {
                const prefix: string = attr.name.substring(6);
                const namespaceUri: string = attr.value;
                this._mapSchema(prefix, namespaceUri, node);
            }
        }
    }
    /**
     * Routes schema parsing based on namespace URI.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _mapSchema(prefix: string, ns: string, node: Element): void {
        switch (ns) {
        case 'http://purl.org/dc/elements/1.1/':
            this._parseDublinCore(node);
            break;
        case 'http://ns.adobe.com/xap/1.0/':
            this._parseBasic(node);
            break;
        case 'http://ns.adobe.com/pdf/1.3/':
            this._parsePdf(node);
            break;
        case 'http://ns.adobe.com/xap/1.0/t/pg/':
            this._parsePagedText(node);
            break;
        case 'http://ns.adobe.com/xap/1.0/rights/':
            this._parseRights(node);
            break;
        case 'http://ns.adobe.com/xap/1.0/bj/':
            this._parseJobTicket(node);
            break;
        case 'http://ns.adobe.com/pdfx/1.3/':
            this._parseInternalCustom(prefix, ns, node);
            break;
        default:
            this._parseCustom(prefix, ns, node);
            break;
        }
    }
    /**
     * Parses Basic XMP schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseBasic(node: Element): void {
        const schema: any = this._xmp.basicSchema; //eslint-disable-line
        const creatorTool: string = this._getValue(node, 'CreatorTool');
        if (creatorTool) {
            schema.creatorTool = creatorTool;
        }
        const label: string = this._getValue(node, 'Label');
        if (label) {
            schema.label = label;
        }
        const nickname: string = this._getValue(node, 'Nickname');
        if (nickname) {
            schema.nickname = nickname;
        }
        const baseUrl: string = this._getValue(node, 'BaseURL');
        if (baseUrl) {
            schema.baseUrl = baseUrl;
        }
        const createDate: Date = this._getDate(node, 'CreateDate');
        if (createDate) {
            schema.createDate = createDate;
        }
        const modifyDate: Date = this._getDate(node, 'ModifyDate');
        if (modifyDate) {
            schema.modifyDate = modifyDate;
        }
        const metadataDate: Date = this._getDate(node, 'MetadataDate');
        if (metadataDate) {
            schema.metadataDate = metadataDate;
        }
        const advisory: string[] = this._getArray(node, 'Advisory');
        if (advisory.length > 0) {
            schema.advisory = advisory;
        }
        const identifier: string[] = this._getArray(node, 'Identifier');
        if (identifier.length > 0) {
            schema.identifier = identifier;
        }
        const thumbnails: PdfXmpThumbnail[] = this._getThumbnails(node, 'Thumbnails');
        if (thumbnails.length > 0) {
            schema.thumbnails = thumbnails;
        }
        const rating: string[] = this._getArray(node, 'Rating');
        if (rating.length > 0) {
            schema.rating = rating.map((r: string) => parseFloat(r));
        }
    }
    /**
     * Parses Dublin Core schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseDublinCore(node: Element): void {
        const schema: PdfDublinCoreSchema = this._xmp.dublinCoreSchema;
        const contributor: string[] = this._getArray(node, 'contributor');
        if (contributor.length > 0) {
            schema.contributor = contributor;
        }
        const creator: string[] = this._getArray(node, 'creator');
        if (creator.length > 0) {
            schema.creator = creator;
        }
        const date: string[] = this._getArray(node, 'date');
        if (date.length > 0) {
            schema.date = date;
        }
        const publisher: string[] = this._getArray(node, 'publisher');
        if (publisher.length > 0) {
            schema.publisher = publisher;
        }
        const relation: string[] = this._getArray(node, 'relation');
        if (relation.length > 0) {
            schema.relation = relation;
        }
        const subject: string[] = this._getArray(node, 'subject');
        if (subject.length > 0) {
            schema.subject = subject;
        }
        const type: string[] = this._getArray(node, 'type');
        if (type.length > 0) {
            schema.type = type;
        }
        const title: PdfXmpLangArray = this._getLangArray(node, 'title');
        if (Object.keys(title).length > 0) {
            schema.title = title;
        }
        const description: PdfXmpLangArray = this._getLangArray(node, 'description');
        if (Object.keys(description).length > 0) {
            schema.description = description;
        }
        const rights: PdfXmpLangArray = this._getLangArray(node, 'rights');
        if (Object.keys(rights).length > 0) {
            schema.rights = rights;
        }
        const coverage: string = this._getValue(node, 'coverage');
        if (coverage) {
            schema.coverage = coverage;
        }
        const identifier: string = this._getValue(node, 'identifier');
        if (identifier) {
            schema.identifier = identifier;
        }
        const source: string = this._getValue(node, 'source');
        if (source) {
            schema.source = source;
        }
        const format: string = this._getValue(node, 'format');
        if (format) {
            schema.format = format;
        }
    }
    /**
     * Parses PDF schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parsePdf(node: Element): void {
        const schema: PdfSchema = this._xmp.pdfSchema;
        const keywords: string = this._getValue(node, 'Keywords');
        if (keywords) {
            schema.keywords = keywords;
        }
        const producer: string = this._getValue(node, 'Producer');
        if (producer) {
            schema.producer = producer;
        }
        const pdfVersion: string = this._getValue(node, 'PDFVersion');
        if (pdfVersion) {
            schema.pdfVersion = pdfVersion;
        }
    }
    /**
     * Parses Paged-Text schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parsePagedText(node: Element): void {
        const schema: PdfPagedTextSchema = this._xmp.pagedTextSchema;
        const pageCount : string = this._getValue(node, 'NPages');
        if (pageCount ) {
            schema.pageCount  = parseInt(pageCount , 10);
        }
        const maxPageSizeElement: Element = this._findChildElement(node, 'MaxPageSize');
        if (maxPageSizeElement) {
            const descriptionElement: Element = this._findDirectChild(maxPageSizeElement, 'Description');
            if (descriptionElement) {
                const w: string = this._getValue(descriptionElement, 'w');
                const h: string = this._getValue(descriptionElement, 'h');
                const unit: string = this._getValue(descriptionElement, 'unit');
                if (w && h) {
                    const dimensions: PdfXmpDimensionsStruct = {
                        width: parseFloat(w),
                        height: parseFloat(h)
                    };
                    if (unit) {
                        dimensions.unit = unit;
                    }
                    schema.maxPageSize = dimensions;
                }
            }
        }
        const fonts: string[] = this._getArray(node, 'Fonts');
        if (fonts.length > 0) {
            schema.fonts = fonts;
        }
        const plateNames: string[] = this._getArray(node, 'PlateNames');
        if (plateNames.length > 0) {
            schema.plateNames = plateNames;
        }
        const colorants: string[] = this._getArray(node, 'Colorants');
        if (colorants.length > 0) {
            schema.colorants = colorants;
        }
    }
    /**
     * Parses Rights Management schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseRights(node: Element): void {
        const schema: PdfRightsManagementSchema = this._xmp.rightsManagementSchema;
        const certificateUrl : string = this._getValue(node, 'Certificate');
        if (certificateUrl) {
            schema.certificateUrl  = certificateUrl ;
        }
        const webStatement: string = this._getValue(node, 'WebStatement');
        if (webStatement) {
            schema.webStatement = webStatement;
        }
        const marked: string = this._getValue(node, 'Marked');
        if (marked) {
            schema.isMarked = marked === 'True';
        }
        const owners: string[] = this._getArray(node, 'Owner');
        if (owners.length > 0) {
            schema.owners = owners;
        }
        const usageTerms: PdfXmpLangArray = this._getLangArray(node, 'UsageTerms');
        if (Object.keys(usageTerms).length > 0) {
            (schema as any)._setProperty('xmpRights:UsageTerms', usageTerms); //eslint-disable-line
        }
    }
    /**
     * Parses Basic Job Ticket schema properties.
     *
     * @private
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseJobTicket(node: Element): void {
        const schema: PdfBasicJobTicketSchema = this._xmp.basicJobTicketSchema;
        const jobRef: string[] = this._getArray(node, 'JobRef');
        if (jobRef.length > 0) {
            schema.jobRef = jobRef;
        }
    }
    /**
     * Parses custom schema properties.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseInternalCustom(prefix: string, ns: string, node: Element): void {
        const customSchema: PdfCustomSchema = new PdfCustomSchema(this._xmp, prefix, ns);
        const children: NodeListOf<Element> = node.querySelectorAll('*');
        for (let i: number = 0; i < children.length; i++) {
            const child: Element = children.item(i);
            if (child.prefix === prefix || child.localName.startsWith(prefix + ':')) {
                const key: string = child.localName.replace(prefix + ':', '');
                const value: string = child.textContent || '';
                customSchema.customData.set(key, value);
            }
        }
        if (customSchema.customData.size > 0) {
            this._xmp._customSchema = customSchema;
        }
    }
    /**
     * Parses custom schema properties.
     *
     * @private
     * @param {string} prefix The namespace prefix.
     * @param {string} ns The namespace URI.
     * @param {Element} node The rdf:Description element.
     * @returns {void}
     */
    private _parseCustom(prefix: string, ns: string, node: Element): void {
        const customSchema: PdfCustomSchema = new PdfCustomSchema(this._xmp, prefix, ns);
        const children: NodeListOf<Element> = node.querySelectorAll('*');
        for (let i: number = 0; i < children.length; i++) {
            const child: Element = children.item(i);
            if (child.prefix === prefix || child.localName.startsWith(prefix + ':')) {
                const key: string = child.localName.replace(prefix + ':', '');
                const value: string = child.textContent || '';
                customSchema.customData.set(key, value);
            }
        }
    }
    /**
     * Gets a single text value from a child element.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} tag The local name of the child element.
     * @returns {string} The text content or undefined.
     */
    private _getValue(node: Element, tag: string): string {
        const child: Element = this._findChildElement(node, tag);
        if (child) {
            const textContent: string = child.textContent ? child.textContent.trim() : '';
            if (textContent) {
                return textContent;
            }
        }
        const attr: string = node.getAttribute(this._getAttributeName(node, tag));
        if (attr) {
            return attr;
        }
        return undefined;
    }
    /**
     * Gets the full attribute name for a tag, checking all possible namespace prefixes.
     *
     * @private
     * @param {Element} node The element to check.
     * @param {string} localName The local name to search for.
     * @returns {string} The attribute name or null.
     */
    private _getAttributeName(node: Element, localName: string): string {
        const attributes: NamedNodeMap = node.attributes;
        for (let i: number = 0; i < attributes.length; i++) {
            const attr: Attr = attributes.item(i);
            if (attr.localName === localName) {
                return attr.name;
            }
        }
        return null;
    }
    /**
     * Gets a Date value from a child element.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} tag The local name of the child element.
     * @returns {Date} The parsed date or undefined.
     */
    private _getDate(node: Element, tag: string): Date {
        const value: string = this._getValue(node, tag);
        if (value) {
            const date: Date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return undefined;
    }
    /**
     * Gets an array of string values from an rdf:Bag or rdf:Seq container.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} tag The local name of the property element.
     * @returns {string[]} Array of string values.
     */
    private _getArray(node: Element, tag: string): string[] {
        const result: string[] = [];
        const child: Element = this._findChildElement(node, tag);
        if (child) {
            const bag: Element = this._findDirectChild(child, 'Bag') || this._findDirectChild(child, 'Seq');
            if (bag) {
                const items: Element[] = this._findDirectChildren(bag, 'li');
                for (const item of items) {
                    const text: string = item.textContent;
                    if (text) {
                        result.push(text.trim());
                    }
                }
            }
        }
        return result;
    }
    /**
     * Gets a multilingual array (language map) from an rdf:Alt container.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} tag The local name of the property element.
     * @returns {PdfXmpLangArray} Language map object.
     */
    private _getLangArray(node: Element, tag: string): PdfXmpLangArray {
        const result: PdfXmpLangArray = {};
        const child: Element = this._findChildElement(node, tag);
        if (child) {
            const alt: Element = this._findDirectChild(child, 'Alt');
            if (alt) {
                const items: Element[] = this._findDirectChildren(alt, 'li');
                for (const item of items) {
                    const lang: string = item.getAttribute('xml:lang');
                    const text: string = item.textContent;
                    if (lang && text && lang !== '__proto__' && lang !== 'constructor' && lang !== 'prototype') {
                        result[String(lang)] = text.trim();
                    }
                }
            }
        }
        return result;
    }
    /**
     * Gets an array of structured thumbnail objects from an rdf:Bag container.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} tag The local name of the property element.
     * @returns {PdfXmpThumbnail[]} Array of thumbnail structures.
     */
    private _getThumbnails(node: Element, tag: string): PdfXmpThumbnail[] {
        const result: PdfXmpThumbnail[] = [];
        const child: Element = this._findChildElement(node, tag);
        if (child) {
            const bag: Element = this._findDirectChild(child, 'Bag');
            if (bag) {
                const items: Element[] = this._findDirectChildren(bag, 'li');
                for (const item of items) {
                    const width: string = this._getValue(item, 'width') || this._getValue(item, 'Width');
                    const height: string = this._getValue(item, 'height') || this._getValue(item, 'Height');
                    const format: string = this._getValue(item, 'format') || this._getValue(item, 'Format');
                    const image: string = this._getValue(item, 'image') || this._getValue(item, 'Image');
                    if (width && height && format && image) {
                        const thumbnail: PdfXmpThumbnail = {
                            width: parseInt(width, 10),
                            height: parseInt(height, 10),
                            format: format,
                            image: image
                        };
                        result.push(thumbnail);
                    }
                }
            }
        }
        return result;
    }
    /**
     * Finds a child element by local name (case-insensitive for namespaces).
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} localName The local name to search for.
     * @returns {Element} The found element or null.
     */
    private _findChildElement(node: Element, localName: string): Element {
        const children: HTMLCollection = node.children;
        for (let i: number = 0; i < children.length; i++) {
            const child: Element = children.item(i) as Element;
            if (child.localName === localName) {
                return child;
            }
        }
        return null;
    }
    /**
     * Finds a direct child element by local name.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} localName The local name to search for.
     * @returns {Element} The found element or null.
     */
    private _findDirectChild(node: Element, localName: string): Element {
        const children: HTMLCollection = node.children;
        for (let i: number = 0; i < children.length; i++) {
            const child: Element = children.item(i) as Element;
            if (child.localName === localName) {
                return child;
            }
        }
        return null;
    }
    /**
     * Finds all direct child elements with the specified local name.
     *
     * @private
     * @param {Element} node The parent element.
     * @param {string} localName The local name to search for.
     * @returns {Element[]} Array of matching elements.
     */
    private _findDirectChildren(node: Element, localName: string): Element[] {
        const result: Element[] = [];
        const children: HTMLCollection = node.children;
        for (let i: number = 0; i < children.length; i++) {
            const child: Element = children.item(i) as Element;
            if (child.localName === localName) {
                result.push(child);
            }
        }
        return result;
    }
}
