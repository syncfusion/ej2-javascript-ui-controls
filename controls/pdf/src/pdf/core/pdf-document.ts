import { _PdfStream } from './base-stream';
import { _PdfCrossReference } from './pdf-cross-reference';
import { _Linearization } from './pdf-parser';
import { _isWhiteSpace, FormatError, _decode, _getNewGuidString, _isNullOrUndefined, _updatePageSettings, _updatePageCount, _convertDateToString, _convertStringToDate, _getCjkEncoding, _getCjkDescendantFont, _resolveStandardFontFamily, _resolveCjkFontFamily, _bytesToHex } from './utils';
import { _PdfCatalog } from './pdf-catalog';
import { _PdfDictionary, _PdfReference, _isName, _PdfName, _clearPrimitiveCaches } from './pdf-primitives';
import { PdfDestination, PdfPage } from './pdf-page';
import { Save } from '@syncfusion/ej2-file-utils';
import { DataFormat, PdfPermissionFlag, PdfTextAlignment, PdfPageOrientation, PdfRotationAngle } from './enumerator';
import { PdfForm } from './form/form';
import { PdfField } from './form/field';
import { PdfBrush, PdfGraphics } from './graphics/pdf-graphics';
import { _FontData, _PdfCjkStandardFontMetricsFactory, _PdfFontPrimitive, _PdfStandardFontMetricsFactory, PdfCjkFontFamily, PdfCjkStandardFont, PdfFont, PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfTrueTypeFont } from './fonts/pdf-standard-font';
import { PdfStringFormat, PdfVerticalAlignment } from './fonts/pdf-string-format';
import { _ExportHelper, _XfdfDocument } from './import-export/xfdf-document';
import { _JsonDocument } from './import-export/json-document';
import { _FdfDocument } from './import-export/fdf-document';
import { PdfBookmark, PdfNamedDestination, PdfBookmarkBase, _PdfNamedDestinationCollection } from './pdf-outline';
import { _XmlDocument } from './import-export/xml-document';
import { PdfFileStructure } from './pdf-file-structure';
import { _PdfMergeHelper } from './pdf-merge';
import { PdfPageImportOptions } from './pdf-page-import-options';
import { PdfLayerCollection } from './layers/layer-collection';
import { PdfSection } from './pdf-section';
import { PdfDocumentInformation } from './pdf-document-information';
import { _PdfFontMetrics } from './fonts/pdf-font-metrics';
import { _UnicodeTrueTypeFont } from './fonts/unicode-true-type-font';
import { _MD5 } from './security/encryptors/messageDigest5';
import { PdfSignature } from './security/digital-signature/signature/pdf-signature';
import { Size } from './pdf-type';
/**
 * Represents a PDF document and can be used to parse an existing PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Access first page
 * let page: PdfPage = document.getPage(0);
 * // Flatten annotations and form fields
 * document.flatten = true;
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfDocument {
    _stream: _PdfStream;
    _crossReference: _PdfCrossReference;
    _catalog: _PdfCatalog;
    _fileStructure: PdfFileStructure;
    private _headerSignature: Uint8Array = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
    private _startXrefSignature: Uint8Array = new Uint8Array([0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66]);
    private _endObjSignature: Uint8Array = new Uint8Array([0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a]);
    private _version: string = '';
    _pages: Map<number, PdfPage>;
    private _linear: _Linearization;
    _pageCount: number;
    private _flatten: boolean;
    _permissions: PdfPermissionFlag = PdfPermissionFlag.default;
    _form: PdfForm;
    _bookmarkBase: PdfBookmarkBase;
    _namedDestinationCollection: _PdfNamedDestinationCollection;
    _isEncrypted: boolean = false;
    _isUserPassword: boolean = false;
    _hasUserPasswordOnly: boolean = false;
    _encryptOnlyAttachment: boolean = false;
    _encryptMetaData: boolean = false;
    _isExport: boolean = false;
    private _allowCustomData: boolean = false;
    _bookmarkHashTable: Map<PdfPage, PdfBookmarkBase[]>;
    _targetIndex: number;
    _isDuplicatePage: boolean = false;
    _mergeHelperCache: Map<string, _PdfMergeHelper>;
    _uniqueID: string;
    _isSplitDocument: boolean = false;
    private _layers: PdfLayerCollection;
    _optionalContentDictionaries: _PdfReference[] = [];
    _order: (_PdfReference | _PdfReference[])[] = [];
    _on: _PdfReference[] = [];
    _off: _PdfReference[] = [];
    _as: _PdfReference[] = [];
    _printLayer: _PdfReference[] = [];
    _isLoaded: boolean = true;
    _fontCollection: Map<string, _PdfFontPrimitive>;
    _startXRefParsedCache: number[];
    private _revisions: number[];
    /*
     * An event triggered during the splitting process, providing access to split PDF data and split index.
     *
     * @returns Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    splitEvent: Function;
    /**
     * Creates a new PDF document
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a new page
     * let page: PdfPage = document.addPage();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Draw line on the page graphics.
     * graphics.drawLine(pen, {x: 10, y: 10}, {x: 100, y: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfDocument` class.
     *
     * @param {string} data PDF data as Base64 string.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Flatten annotations and form fields
     * document.flatten = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: string)
    /**
     * Initializes a new instance of the `PdfDocument` class with password.
     *
     * @param {string} data PDF data as Base64 string.
     * @param {string} password Password to decrypt PDF.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Flatten annotations and form fields
     * document.flatten = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: string, password: string)
    /**
     * Initializes a new instance of the `PdfDocument` class.
     *
     * @param {Uint8Array} data PDF data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Flatten annotations and form fields
     * document.flatten = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: Uint8Array)
    /**
     * Initializes a new instance of the `PdfDocument` class with password.
     *
     * @param {Uint8Array} data PDF data as byte array.
     * @param {string} password Password to decrypt PDF.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Flatten annotations and form fields
     * document.flatten = true;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(data: Uint8Array, password: string)
    constructor(data?: string | Uint8Array, password?: string) {
        this._fontCollection = new Map();
        if (data) {
            this._stream = new _PdfStream(typeof data === 'string' ? _decode(data) : data);
            this._fileStructure = new PdfFileStructure();
            this._crossReference = new _PdfCrossReference(this, password);
            this._pages = new Map<number, PdfPage>();
            this._checkHeader();
            this._crossReference._setStartXRef(this._startXRef);
            try {
                this._parse(false);
            }
            catch (e) {
                if (e.name === 'XRefParseException') {
                    this._parse(true);
                } else {
                    throw e;
                }
            }
            this._crossReference._version = this._version;
        } else {
            this._isLoaded = false;
            this._stream = new _PdfStream([]);
            this._version = '1.4';
            this._fileStructure = new PdfFileStructure();
            this._fileStructure.isIncrementalUpdate = false;
            this._crossReference = new _PdfCrossReference(this);
            this._crossReference._version = this._version;
            this._crossReference._nextReferenceNumber = 1;
            const catalogDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            catalogDictionary.update('Type', _PdfName.get('Catalog'));
            const catalogReference: _PdfReference = this._crossReference._getNextReference();
            catalogDictionary.objId = catalogReference.objectNumber + ' ' + catalogReference.generationNumber;
            this._crossReference._cacheMap.set(catalogReference, catalogDictionary);
            const trailerDictionary: _PdfDictionary = new _PdfDictionary();
            trailerDictionary.update('Root', catalogReference);
            this._crossReference._trailer = trailerDictionary;
            this._crossReference._root = catalogDictionary;
            const topPagesDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            topPagesDictionary.update('Type', _PdfName.get('Pages'));
            topPagesDictionary.update('Kids', []);
            topPagesDictionary.update('Count', 0);
            const topPagesReference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(topPagesReference, topPagesDictionary);
            catalogDictionary.update('Pages', topPagesReference);
            this._catalog = new _PdfCatalog(this._crossReference);
            this._pages = new Map<number, PdfPage>();
        }
    }
    get _allowImportCustomData(): boolean {
        return this._allowCustomData;
    }
    set _allowImportCustomData(value: boolean) {
        this._allowCustomData = value;
    }
    get _linearization(): _Linearization {
        if (!this._linear) {
            let value: _Linearization;
            try {
                value = new _Linearization(this._stream);
            } catch (err) { } // eslint-disable-line
            this._linear = value;
        }
        return this._linear;
    }
    get _startXRef(): number {
        const stream: _PdfStream = this._stream;
        let startXRef: number = 0;
        if (this._linearization && this._linearization.isValid) {
            stream.reset();
            if (this._find(stream, this._endObjSignature)) {
                startXRef = stream.position + 6 - stream.start;
            }
        } else {
            const step: number = 1024;
            const startXRefLength: number = this._startXrefSignature.length;
            let found: boolean = false;
            let position: number = stream.end;
            while (!found && position > 0) {
                position -= step - startXRefLength;
                if (position < 0) {
                    position = 0;
                }
                stream.position = position;
                found = this._find(stream, this._startXrefSignature, step, true);
            }
            if (found) {
                stream.skip(9);
                let ch: number;
                do {
                    ch = stream.getByte();
                } while (_isWhiteSpace(ch));
                let str: string = '';
                while (ch >= 0x20 && ch <= 0x39) {
                    str += String.fromCharCode(ch);
                    ch = stream.getByte();
                }
                startXRef = parseInt(str, 10);
                if (isNaN(startXRef)) {
                    startXRef = 0;
                }
            }
        }
        return startXRef;
    }
    /**
     * Gets a value indicating whether the document is encrypted. (Read Only).
     *
     * @returns {boolean} A boolean value indicates whether the document is encrypted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets a value indicating whether the document is encrypted.
     * let isEncrypted: boolean = document.isEncrypted;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isEncrypted(): boolean {
        return this._isEncrypted;
    }
    /**
     * Gets a value indicating whether the document is decrypted using the user password. (Read only).
     *
     * @returns {boolean} A boolean value indicates whether the document is decrypted using the user password.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets a value indicating whether the document is decrypted using the user password
     * let isUserPassword: boolean = document.isUserPassword;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isUserPassword(): boolean {
        return this._isUserPassword;
    }
    /**
     * Gets the page count (Read only).
     *
     * @returns {number} Number of pages
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the page count
     * let count: number = document.pageCount;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageCount(): number {
        if (typeof this._pageCount === 'undefined') {
            this._pageCount = 0;
            if (this._linearization && this._linearization.isValid) {
                this._pageCount = this._linearization.pageCount;
            } else {
                this._pageCount = this._catalog.pageCount;
            }
        }
        return this._pageCount;
    }
    /**
     * Gets the PDF form fields included in the document (Read only).
     *
     * @returns {PdfForm} Form object
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access loaded form
     * let form: PdfForm = document.form;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get form(): PdfForm {
        if (typeof this._form === 'undefined') {
            this._form = new PdfForm(this._catalog.acroForm, this._crossReference);
        }
        return this._form;
    }
    /**
     * Gets the boolean flag to flatten the annotations and form fields.
     *
     * @returns {boolean} Flag to flatten
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the flatten value applied
     * let flatten: boolean = document.flatten;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get flatten(): boolean {
        return this._flatten;
    }
    /**
     * Sets the boolean flag to flatten the annotations and form fields.
     *
     * @param {boolean} value to flatten
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Flatten PDF annotations and form fields
     * document.flatten = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set flatten(value: boolean) {
        this._flatten = value;
    }
    /**
     * Gets the permission flag of the PDF document (Read only).
     *
     * @returns {PdfPermissionFlag} permission flag. Default value is PdfPermissionFlag.default.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the permission flag
     * let permission: PdfPermissionFlag = document.permissions;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get permissions(): PdfPermissionFlag {
        if (this._crossReference) {
            const flag: number = this._crossReference._permissionFlags;
            if (typeof flag !== 'undefined') {
                this._permissions = (flag & ~ -3904) as PdfPermissionFlag;
            }
        }
        return this._permissions;
    }
    /**
     * Gets the bookmarks (Read only).
     *
     * @returns {PdfBookmarkBase} Bookmarks.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bookmarks(): PdfBookmarkBase {
        const catalog: _PdfCatalog = this._catalog;
        if (catalog) {
            if (catalog._catalogDictionary.has('Outlines')) {
                const reference: _PdfReference = catalog._catalogDictionary._get('Outlines');
                const outlines: _PdfDictionary = catalog._catalogDictionary.get('Outlines');
                if (outlines) {
                    this._bookmarkBase = new PdfBookmarkBase(outlines, this._crossReference);
                    this._bookmarkBase._reference = reference;
                    if (outlines.has('First')) {
                        this._bookmarkBase._reproduceTree();
                    }
                }
            } else {
                const outlines: _PdfDictionary = new _PdfDictionary(this._crossReference);
                const reference: _PdfReference = this._crossReference._getNextReference();
                this._crossReference._cacheMap.set(reference, outlines);
                catalog._catalogDictionary.update('Outlines', reference);
                this._crossReference._allowCatalog = true;
                this._bookmarkBase = new PdfBookmarkBase(outlines, this._crossReference);
                this._bookmarkBase._reference = reference;
            }
        }
        return this._bookmarkBase;
    }
    /**
     * Gets the internal structure of the PDF document.
     *
     * @returns {PdfFileStructure} The internal structure of the PDF document.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the internal file structure of the PDF document
     * let fileStructure: PdfFileStructure = document.fileStructure;
     * // Get the cross reference type
     * let type: PdfCrossReferenceType = fileStructure.crossReferenceType;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fileStructure(): PdfFileStructure {
        return this._fileStructure;
    }
    /**
     * Gets the collection of `PdfLayer` from the document.
     *
     * @returns {PdfLayerCollection} Layer collection.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Access the collection of layers in the document
     * let layers: PdfLayerCollection = document.layers;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get layers(): PdfLayerCollection {
        if (!this._layers) {
            this._layers = new PdfLayerCollection(this);
        }
        return this._layers;
    }
    /**
     * Gets an array of revision numbers for the PDF document.
     *
     * @returns {number[]} - The list of revisions in the document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Retrieve all revision indexes of the PDF document
     * let revisions: number[] = document.getRevisions();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getRevisions(): number[] {
        if (!this._isLoaded) {
            return undefined;
        }
        if (this._revisions) {
            return this._revisions;
        }
        const startCrossReferences: number[] = this._startXRefParsedCache
            ? this._startXRefParsedCache.sort((a: number, b: number) => a - b)
            : [];
        if (startCrossReferences.length === 0) {
            return (this._revisions = []);
        }
        const eofSig: Uint8Array = new Uint8Array([0x25, 0x25, 0x45, 0x4F, 0x46]);
        const stream: _PdfStream = this._stream;
        const endOfFileSign: number[] = [];
        startCrossReferences.forEach((entry: number) => {
            stream.position = entry;
            const remaining: number = stream.end - stream.position;
            if (remaining < eofSig.length || !this._find(stream, eofSig, remaining, false)) {
                return;
            }
            let j: number = stream.position + eofSig.length;
            stream.position = j;
            if (stream.position < stream.end) {
                const nextCharacter: number = stream.getByte();
                if (nextCharacter === 0x0d) {
                    j++;
                    if (stream.position < stream.end && stream.getByte() === 0x0a) {
                        j++;
                    }
                } else if (nextCharacter === 0x0a) {
                    j++;
                }
            }
            endOfFileSign.push(j);
        });
        return (this._revisions = endOfFileSign);
    }
    /**
     * Embed a standard font into the PDF document.
     *
     * @param {PdfFontFamily} fontFamily The font family.
     * @param {number} size The font size.
     * @param {PdfFontStyle } style The font style.
     * @returns {PdfStandardFont} The embedded font object.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Embed a font into the PDF document.
     * const embedFont = document.embedFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
     * // Draw string using embed font.
     * page.graphics.drawString('value', embedFont, {x: 10, y: 10, width: 100, height: 100}, new PdfBrush({r: 255, g: 0, b: 0}));
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    embedFont(fontFamily: PdfFontFamily, size: number, style: PdfFontStyle): PdfStandardFont;
    /**
     * Embed a Cjk font into the PDF document.
     *
     * @param {PdfCjkFontFamily} fontFamily The Cjk font family.
     * @param {number} size The font size.
     * @param {PdfFontStyle} style The font style.
     * @param {boolean} isCjk Set to true by default to embed the font as a CJK font.
     * @returns {PdfCjkStandardFont} The embedded font object.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Embed a font into the PDF document with CJK embedding enabled.
     * const embedFont = document.embedFont(PdfCjkFontFamily.hanyangSystemsGothicMedium, 14, PdfFontStyle.bold, true);
     * // Draw string using embed font.
     * page.graphics.drawString('value', embedFont, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    embedFont(fontFamily: PdfCjkFontFamily, size: number, style: PdfFontStyle, isCjk: true): PdfCjkStandardFont;
    /**
     * Embed a true type font into the PDF document.
     *
     * @param {Uint8Array} fontData The font data as byte array.
     * @param {number} size The font size.
     * @param {object} options Optional object containing font style options.
     * @param {boolean} options.shouldUnderline Indicates whether the font should be rendered with an underline style.
     * @param {boolean} options.shouldStrikeout Indicates whether the font should be rendered with a strikeout style.
     * @return {PdfTrueTypeFont} The embedded font object.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Embed a font into the PDF document.
     * let embedFont = document.embedFont(fontData, 14, { shouldUnderline: true });
     * // Draw string using embed font.
     * page.graphics.drawString('value', embedFont, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    embedFont(fontData: Uint8Array, size: number, options?: {shouldUnderline?: boolean, shouldStrikeout?: boolean}): PdfTrueTypeFont;
    /**
     * Embed a true type font into the PDF document.
     *
     * @param {string } fontData The font data as base64 string.
     * @param {number} size The font size.
     * @param {object} options Optional object containing font style options.
     * @param {boolean} options.shouldUnderline Indicates whether the font should be rendered with an underline style.
     * @param {boolean} options.shouldStrikeout Indicates whether the font should be rendered with a strikeout style.
     * @return {PdfTrueTypeFont} The embedded font object.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Embed a font into the PDF document.
     * let embedFont = document.embedFont(fontData, 14, { shouldStrikeout: true });
     * // Draw string using embed font.
     * page.graphics.drawString('value', embedFont, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    embedFont(fontData: string, size: number, options?: {shouldUnderline?: boolean, shouldStrikeout?: boolean}): PdfTrueTypeFont;
    embedFont(arg1: PdfFontFamily | PdfCjkFontFamily | Uint8Array | string,
              arg2: PdfFontStyle | number,
              arg3: number | boolean | { shouldUnderline?: boolean; shouldStrikeout?: boolean },
              arg4?: number | boolean): PdfFont {
        let key: string;
        let primitive: _PdfFontPrimitive;
        if (typeof arg1 === 'string' || arg1 instanceof Uint8Array) {
            const fontData: Uint8Array = typeof arg1 === 'string' ? _decode(arg1) as Uint8Array : arg1;
            const size: number = arg2 as number;
            const options: { shouldUnderline?: boolean; shouldStrikeout?: boolean } = arg3 as { shouldUnderline?: boolean;
                shouldStrikeout?: boolean };
            primitive = this._getOrCreateFontPrimitive(key, { type: 'ttf', data: fontData });
            this._fontCollection.set(key, primitive);
            let style: PdfFontStyle = PdfFontStyle.regular;
            if (options && options.shouldUnderline) {
                style = PdfFontStyle.underline;
            }
            if (options && options.shouldStrikeout) {
                style = PdfFontStyle.strikeout;
            }
            return new PdfTrueTypeFont(fontData, size, style, primitive);
        }
        const fontFamily: any = arg1; // eslint-disable-line
        const style: PdfFontStyle = arg3 as PdfFontStyle;
        const size: number = arg2 as number;
        let isCjk: boolean = false;
        if (typeof arg4 === 'boolean') {
            isCjk = arg4;
        }
        if (isCjk) {
            const cjkFamily: PdfCjkFontFamily = fontFamily as PdfCjkFontFamily;
            key = `cjk_${cjkFamily}_${style}`;
            primitive = this._getOrCreateFontPrimitive(key, { type: 'cjk', family: cjkFamily, style });
        } else {
            const standardFamily: PdfFontFamily = fontFamily as PdfFontFamily;
            key = `standard_${standardFamily}_${style}`;
            primitive = this._getOrCreateFontPrimitive(key, { type: 'standard', family: standardFamily, style });
        }
        return this._createFontFromPrimitive(primitive, size, style);
    }
    _getOrCreateFontPrimitive(key: string, fontData: _FontData): _PdfFontPrimitive {
        if (this._fontCollection.has(key)) {
            return this._fontCollection.get(key);
        }
        let dictionary: _PdfDictionary = new _PdfDictionary();
        let primitive: _PdfFontPrimitive;
        switch (fontData.type) {
        case 'standard': {
            const metrics: _PdfFontMetrics = _PdfStandardFontMetricsFactory._getMetrics(fontData.family,
                                                                                        fontData.style);
            dictionary._updated = true;
            dictionary.set('Type', _PdfName.get('Font'));
            dictionary.set('Subtype', _PdfName.get('Type1'));
            dictionary.set('BaseFont', new _PdfName(metrics._postScriptName));
            if (fontData.family !== PdfFontFamily.symbol && fontData.family !== PdfFontFamily.zapfDingbats) {
                dictionary.set('Encoding', new _PdfName('WinAnsiEncoding'));
            }
            primitive = { dictionary, metrices: metrics };
            break;
        }
        case 'cjk': {
            const metrics: _PdfFontMetrics = _PdfCjkStandardFontMetricsFactory._getMetrics(fontData.family,
                                                                                           fontData.style);
            dictionary._updated = true;
            dictionary.set('Type', _PdfName.get('Font'));
            dictionary.set('Subtype', _PdfName.get('Type0'));
            dictionary.set('BaseFont', new _PdfName(metrics._postScriptName));
            dictionary.set('Encoding', _getCjkEncoding(fontData.family));
            dictionary.set('DescendantFonts', _getCjkDescendantFont(fontData.family, fontData.style, metrics));
            primitive = { dictionary, metrices: metrics };
            break;
        }
        case 'ttf': {
            const fontInternal: _UnicodeTrueTypeFont = new _UnicodeTrueTypeFont(fontData.data);
            fontInternal._createInternals();
            dictionary = fontInternal._getInternals();
            fontInternal._metrics._isUnicodeFont = true;
            primitive = {dictionary, metrices: fontInternal._metrics, fontInternal};
            break;
        }
        default:
            throw new Error('Unsupported font type.');
        }
        this._fontCollection.set(key, primitive);
        return primitive;
    }
    _createFontFromPrimitive(primitive: _PdfFontPrimitive, size: number, style: PdfFontStyle): PdfFont {
        const subtype: string = primitive.dictionary.get('Subtype').name;
        const baseFontName: string = primitive.dictionary.get('BaseFont').name;
        let font: PdfFont;
        switch (subtype) {
        case 'Type1':
            font = new PdfStandardFont(_resolveStandardFontFamily(baseFontName), size, style, primitive);
            break;
        case 'Type0':
            font = new PdfCjkStandardFont(_resolveCjkFontFamily(baseFontName), size, style, primitive);
            break;
        default:
            throw new Error(`Unsupported font subtype: ${subtype}`);
        }
        font.style = style;
        return font;
    }
    _computeFontHash(fontData: Uint8Array): string {
        const md5: _MD5 = new _MD5();
        const hashBytes: Uint8Array = md5.hash(fontData, 0, fontData.length);
        return _bytesToHex(hashBytes);
    }
    /**
     * Gets the `PdfPage` at the specified index.
     *
     * @param {number} pageIndex Page index.
     * @returns {PdfPage} PDF page at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access first page
     * let page: PdfPage = document.getPage(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getPage(pageIndex: number): PdfPage {
        if (pageIndex < 0 || pageIndex >= this.pageCount) {
            throw new Error('Invalid page index');
        }
        const cachedPage: PdfPage = this._pages.get(pageIndex);
        if (cachedPage) {
            return cachedPage;
        }
        const { _catalog, _linearization } = this;
        let promise: {dictionary: _PdfDictionary, reference: _PdfReference};
        if (_linearization && _linearization.isValid && _linearization.pageFirst === pageIndex) {
            promise = this._getLinearizationPage(pageIndex);
        } else {
            promise = _catalog._getPageDictionary(pageIndex);
        }
        const page: PdfPage = new PdfPage(
            this._crossReference,
            pageIndex,
            promise.dictionary,
            promise.reference
        );
        this._pages.set(pageIndex, page);
        return page;
    }
    /**
     * Creates a new page with default page settings and adds it to the collection.
     *
     * @returns {PdfPage} PDF page at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add a new PDF page
     * let page: PdfPage = document.addPage();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPage(): PdfPage
    /**
     * Creates a new page with default settings and inserts it into the collection at the specified page index.
     *
     * @param {number} index Page index.
     * @returns {PdfPage} PDF page at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create and insert a new PDF page at 5th index
     * let page: PdfPage = document.addPage(5);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPage(index: number): PdfPage
    /**
     * Creates a new page with specified page settings and adds it to the collection.
     *
     * @param {PdfPageSettings} pageSettings Page settings.
     * @returns {PdfPage} PDF page at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPage(pageSettings: PdfPageSettings): PdfPage
    /**
     * Creates a new page with specified page settings and inserts it into the collection at the specified page index.
     *
     * @param {number} index Page index.
     * @param {PdfPageSettings} pageSettings Page settings.
     * @returns {PdfPage} PDF page at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Create and insert a new PDF page at 5th index with specified page settings
     * page = document.addPage(5, pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addPage(index: number, pageSettings: PdfPageSettings): PdfPage
    addPage(arg1?: number | PdfPageSettings, arg2?: PdfPageSettings): PdfPage {
        let settings: PdfPageSettings;
        let pageIndex: number;
        if (typeof arg2 !== 'undefined') {
            settings = arg2;
            pageIndex = arg1 as number;
            this._checkPageNumber(pageIndex);
        } else if (typeof arg1 === 'undefined') {
            settings = new PdfPageSettings();
            pageIndex = this.pageCount;
        } else if (arg1 instanceof PdfPageSettings) {
            settings = arg1;
            pageIndex = this.pageCount;
        } else {
            settings = new PdfPageSettings();
            pageIndex = arg1;
            this._checkPageNumber(pageIndex);
        }
        const sectionDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        sectionDictionary.update('Type', _PdfName.get('Pages'));
        sectionDictionary.update('Count', 1);
        _updatePageSettings(sectionDictionary, settings);
        const sectionReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(sectionReference, sectionDictionary);
        sectionDictionary.objId = sectionReference.toString();
        const pageDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
        pageDictionary.update('Type', _PdfName.get('Page'));
        const pageReference: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(pageReference, pageDictionary);
        pageDictionary.objId = pageReference.toString();
        pageDictionary.update('Parent', sectionReference);
        sectionDictionary.update('Kids', [pageReference]);
        if (this.pageCount === 0) {
            const parentReference: _PdfReference = this._catalog._catalogDictionary._get('Pages');
            if (parentReference && this._catalog._topPagesDictionary) {
                let isUpdated: boolean = false;
                if (this._catalog._topPagesDictionary.has('Kids')) {
                    const kids: _PdfReference[] = this._catalog._topPagesDictionary.get('Kids');
                    if (kids) {
                        kids.push(sectionReference);
                        this._catalog._topPagesDictionary.update('Kids', kids);
                        isUpdated = true;
                    }
                }
                if (!isUpdated) {
                    this._catalog._topPagesDictionary.update('Kids', [sectionReference]);
                }
                this._catalog._topPagesDictionary.update('Count', 1);
                sectionDictionary.update('Parent', parentReference);
            } else {
                this._catalog._catalogDictionary.update('Pages', sectionReference);
            }
            this._pages = new Map<number, PdfPage>();
            this._pageCount = 1;
        } else {
            const lastPage: PdfPage = this.getPage(pageIndex === this.pageCount ? (pageIndex - 1) : pageIndex);
            if (lastPage && lastPage._pageDictionary) {
                const parentReference: _PdfReference = lastPage._pageDictionary._get('Parent');
                const parentDictionary: _PdfDictionary = this._crossReference._fetch(parentReference);
                if (parentDictionary && parentDictionary.has('Kids')) {
                    let kids: _PdfReference[] = parentDictionary.get('Kids');
                    if (kids) {
                        if (pageIndex === this.pageCount) {
                            kids.push(sectionReference);
                        } else {
                            const newKids: _PdfReference[] = [];
                            kids.forEach((entry: _PdfReference) => {
                                if (entry === lastPage._ref) {
                                    newKids.push(sectionReference);
                                }
                                newKids.push(entry);
                            });
                            kids = newKids;
                            this._updatePageCache(pageIndex);
                        }
                        parentDictionary.update('Kids', kids);
                        sectionDictionary.update('Parent', parentReference);
                        _updatePageCount(parentDictionary, 1);
                        this._pageCount = this.pageCount + 1;
                    }
                }
            }
        }
        const result: PdfPage = new PdfPage(this._crossReference, pageIndex, pageDictionary, pageReference);
        result._pageSettings = settings;
        result._isNew = true;
        this._pages.set(pageIndex, result);
        return result;
    }
    /**
     * Creates a new section with default page settings.
     *
     * @returns {PdfSection} section of document
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a new section to the document
     * let section: PdfSection = document.addSection();
     * // Add a new page to the section
     * let page: PdfPage = section.addPage();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Draw line on the page graphics.
     * graphics.drawLine(pen, {x: 10, y: 10}, {x: 100, y: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addSection(): PdfSection
    /**
     * Creates a new section with custom page settings.
     *
     * @param {PdfPageSettings} settings Settings of the section.
     * @returns {PdfSection} section of document
     *
     * ```typescript
     * // Create an new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new section to the document with page settings
     * let section: PdfSection = document.addSection(pageSettings);
     * // Add a new page to the section
     * let page: PdfPage = section.addPage();
     * // Gets the graphics of the PDF page
     * let graphics: PdfGraphics = page.graphics;
     * // Create a new pen.
     * let pen: PdfPen = new PdfPen({r: 0, g: 0, b: 0}, 1);
     * // Draw line on the page graphics.
     * graphics.drawLine(pen, {x: 10, y: 10}, {x: 100, y: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    addSection(settings: PdfPageSettings): PdfSection
    addSection(settings ?: PdfPageSettings): PdfSection {
        let result: PdfSection;
        if (!this._isLoaded) {
            const pageSettings: PdfPageSettings = settings ? settings : new PdfPageSettings();
            result = new PdfSection(this, pageSettings);
        }
        return result;
    }
    /**
     * Removes the specified page.
     *
     * @param {PdfPage} page The page to remove.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Removes the specified page
     * document.removePage(page);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removePage(page: PdfPage): void
    /**
     * Removes the page from the specified index.
     *
     * @param {number} index The page index to remove.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Removes the first page
     * document.removePage(0);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    removePage(index: number): void
    removePage(argument: PdfPage | number): void {
        const targetPage: PdfPage = (argument instanceof PdfPage) ? argument : this.getPage(argument);
        this._removePage(targetPage);
    }
    /**
     * Gets the document information of the PDF.
     *
     * @returns {PdfDocumentInformation} Document information.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Gets the document information of the PDF
     * let documentProperties: PdfDocumentInformation = document.getDocumentInformation();
     * // Gets the title of the PDF document
     * let title = documentProperties.title;
     * // Gets the author of the PDF document
     * let author = documentProperties.author;
     * // Gets the subject of the PDF document
     * let subject = documentProperties.subject;
     * // Gets the keywords of the PDF document
     * let keywords = documentProperties.keywords;
     * // Gets the creator of the PDF document
     * let creator = documentProperties.creator;
     * // Gets the producer of the PDF document
     * let producer = documentProperties.producer;
     * // Gets the language of the PDF document
     * let language = documentProperties.language;
     * // Gets the creation date of the PDF document
     * let creationDate = documentProperties.creationDate;
     * // Gets the modification date of the PDF document
     * let modificationDate = documentProperties.modificationDate;
     * document.destroy();
     * ```
     */
    public getDocumentInformation(): PdfDocumentInformation {
        const infoDict: _PdfDictionary = this._getInfoDictionary(false);
        const catalogDictionary: _PdfDictionary = this._catalog._catalogDictionary;
        const result: PdfDocumentInformation = {};
        if (!infoDict) {
            return result;
        }
        result.title = this._readInfoString(infoDict, 'Title');
        result.author = this._readInfoString(infoDict, 'Author');
        result.subject = this._readInfoString(infoDict, 'Subject');
        result.keywords = this._readInfoString(infoDict, 'Keywords');
        result.creator = this._readInfoString(infoDict, 'Creator');
        result.producer = this._readInfoString(infoDict, 'Producer');
        result.language = this._readInfoString(catalogDictionary, 'Lang');
        const creation: string = this._readInfoString(infoDict, 'CreationDate');
        if (typeof creation === 'string') {
            result.creationDate = _convertStringToDate(creation);
        }
        const mod: string = this._readInfoString(infoDict, 'ModDate');
        if (typeof mod === 'string') {
            result.modificationDate = _convertStringToDate(mod);
        }
        return result;
    }
    private _readInfoString(dict: _PdfDictionary, key: string): string | undefined {
        if (dict && !dict.has(key)) {
            return undefined;
        }
        const value: any = dict.get(key); // eslint-disable-line
        return typeof value === 'string' ? value : undefined;
    }
    /**
     * Sets the document information of the PDF.
     *
     * @param {PdfDocumentInformation} information Fields to set.
     * @returns {void} Returns nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets the document information of the PDF
     * document.setDocumentInformation({
     *   author: 'Syncfusion',
     *   modificationDate: Date.now(),
     *   creator: 'Essential PDF',
     *   keywords: 'PDF',
     *   subject: 'Document information DEMO',
     *   title: 'Essential PDF Sample',
     *   producer: 'Syncfusion PDF'
     * });
     * // Save the document
     * document.save('output.pdf);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public setDocumentInformation(information: PdfDocumentInformation): void {
        const infoDict: _PdfDictionary = this._getInfoDictionary(true);
        const catalogDictionary: _PdfDictionary = this._catalog._catalogDictionary;
        this._writeInfoString(infoDict, 'Title', information.title);
        this._writeInfoString(infoDict, 'Author', information.author);
        this._writeInfoString(infoDict, 'Subject', information.subject);
        this._writeInfoString(infoDict, 'Keywords', information.keywords);
        this._writeInfoString(infoDict, 'Creator', information.creator);
        this._writeInfoString(infoDict, 'Producer', information.producer);
        this._writeInfoString(catalogDictionary, 'Lang', information.language);
        this._writeInfoDate(infoDict, 'CreationDate', information.creationDate);
        this._writeInfoDate(infoDict, 'ModDate', information.modificationDate);
        infoDict._updated = true;
    }
    _writeInfoString(dict: _PdfDictionary, key: string, value?: string): void {
        if (value !== null && typeof value === 'string') {
            dict.update(key, value);
        }
    }
    _writeInfoDate(dict: _PdfDictionary, key: string, value?: Date): void {
        if (value && value instanceof Date) {
            dict.update(key, _convertDateToString(value));
        }
    }
    private _getInfoDictionary(createIfMissing: boolean): _PdfDictionary {
        let trailer: _PdfDictionary;
        if (this._crossReference && this._crossReference._trailer) {
            trailer = this._crossReference._trailer;
        }
        if (!trailer) {
            return undefined;
        }
        if (trailer.has('Info')) {
            const raw: any = trailer.get('Info'); // eslint-disable-line
            if (raw instanceof _PdfReference) {
                const dict: _PdfDictionary = this._crossReference._fetch(raw);
                return dict;
            } else if (raw instanceof _PdfDictionary) {
                return raw;
            }
        }
        if (!createIfMissing) {
            return undefined;
        }
        const info: _PdfDictionary = new _PdfDictionary(this._crossReference);
        const infoRef: _PdfReference = this._crossReference._getNextReference();
        this._crossReference._cacheMap.set(infoRef, info);
        info.objId = infoRef.toString();
        trailer.update('Info', infoRef);
        return info;
    }
    _checkPageNumber(index: number): void {
        if (index < 0 || index > this.pageCount) {
            throw new Error('Index out of range');
        }
    }
    _updatePageCache(index: number, isIncrement: boolean = true): void {
        const updatedData: Map<number, PdfPage> = new Map<number, PdfPage>();
        for (let i: number = this.pageCount - 1; i >= 0; i--) {
            const page: PdfPage = this.getPage(i);
            if (isIncrement) {
                if (i >= index) {
                    updatedData.set(i + 1, page);
                    page._pageIndex = i + 1;
                } else {
                    updatedData.set(i, page);
                }
            } else {
                if (i > index) {
                    updatedData.set(i - 1, page);
                    page._pageIndex = i - 1;
                } else if (i !== index) {
                    updatedData.set(i, page);
                }
            }
        }
        this._pages = updatedData;
        if (!isIncrement) {
            this._pageCount = this._pages.size;
        }
    }
    _removePage(pageToRemove: PdfPage): void {
        const bookMarkMap: Map<PdfPage, PdfBookmarkBase[]> = this._parseBookmarkDestination();
        if (bookMarkMap && bookMarkMap.has(pageToRemove)) {
            const bookmarks: PdfBookmarkBase[] = bookMarkMap.get(pageToRemove);
            if (bookmarks) {
                bookmarks.forEach((bookmark: PdfBookmarkBase) => {
                    if (bookmark && bookmark._dictionary) {
                        if (bookmark._dictionary) {
                            if (bookmark._dictionary.has('A')) {
                                bookmark._dictionary.update('A', null);
                            }
                            bookmark._dictionary.update('Dest', null);
                        }
                    }
                });
            }
        }
        this._removePageTemplates(pageToRemove);
        for (let i: number = this.form.count - 1; i >= 0; --i) {
            const field: PdfField = this.form.fieldAt(i);
            if (field && field.page === pageToRemove) {
                this.form.removeFieldAt(i);
            }
        }
        this._updatePageCache(pageToRemove._pageIndex, false);
        this._removeParent(pageToRemove._ref, pageToRemove._pageDictionary);
        if (this._crossReference._cacheMap.has(pageToRemove._ref)) {
            pageToRemove._pageDictionary._updated = false;
        }
        if (this.pageCount === 0) {
            this._catalog._topPagesDictionary.update('Kids', []);
        }
    }
    _removeParent(referenceToRemove: _PdfReference, dictionary: _PdfDictionary): void {
        if (dictionary.has('Parent')) {
            const parentReference: _PdfReference = dictionary._get('Parent');
            const parentDictionary: _PdfDictionary = this._crossReference._fetch(parentReference);
            if (parentDictionary && parentDictionary.has('Kids')) {
                let kids: _PdfReference[] = parentDictionary.get('Kids');
                if (_isNullOrUndefined(kids) && kids.length === 1 && parentDictionary && parentDictionary.get('Type').name === 'Pages') {
                    this._removeParent(parentReference, parentDictionary);
                } else {
                    kids = kids.filter((item: _PdfReference) => item !== referenceToRemove);
                    parentDictionary.update('Kids', kids);
                    _updatePageCount(parentDictionary, -1);
                }
            }
        }
    }
    _parseBookmarkDestination(): Map<PdfPage, PdfBookmarkBase[]> {
        let current: PdfBookmarkBase = this.bookmarks;
        if (typeof this._bookmarkHashTable === 'undefined' && current) {
            this._bookmarkHashTable = new Map<PdfPage, PdfBookmarkBase[]>();
            const stack: {index: number, kids: PdfBookmarkBase[]}[] = [];
            let nodeInformation: {index: number, kids: PdfBookmarkBase[]} = {index: 0, kids: current._bookMarkList};
            do {
                for (; nodeInformation.index < nodeInformation.kids.length; ) {
                    current = nodeInformation.kids[nodeInformation.index];
                    const namedDestination: PdfNamedDestination = (current as PdfBookmark).namedDestination;
                    if (namedDestination) {
                        if (namedDestination.destination) {
                            const page: PdfPage = namedDestination.destination.page;
                            let list: PdfBookmarkBase[] = this._bookmarkHashTable.get(page);
                            if (!list) {
                                list = [];
                            }
                            list.push(current);
                            this._bookmarkHashTable.set(page, list);
                        }
                    } else {
                        const destination: PdfDestination = (current as PdfBookmark).destination;
                        if (destination) {
                            const page: PdfPage = destination.page;
                            let list: PdfBookmarkBase[] = this._bookmarkHashTable.get(page);
                            if (!list) {
                                list = [];
                            }
                            list.push(current);
                            this._bookmarkHashTable.set(page, list);
                        }
                    }
                    nodeInformation.index += 1;
                    if (current.count > 0) {
                        stack.push(nodeInformation);
                        nodeInformation = {index: 0, kids: current._bookMarkList};
                        continue;
                    }
                }
                if (stack.length > 0) {
                    nodeInformation = stack.pop();
                    while (nodeInformation.index === nodeInformation.kids.length && stack.length > 0) {
                        nodeInformation = stack.pop();
                    }
                }
            } while (nodeInformation.index < nodeInformation.kids.length);
        }
        return this._bookmarkHashTable;
    }
    _removePageTemplates(page: PdfPage): void {
        let dictionary: _PdfDictionary;
        if (this._catalog._catalogDictionary.has('Names')) {
            dictionary = this._catalog._catalogDictionary.get('Names');
            if (dictionary) {
                this._removeInternalTemplates(dictionary, 'Pages', page);
                this._removeInternalTemplates(dictionary, 'Templates', page);
            }
        }
    }
    _removeInternalTemplates(dictionary: _PdfDictionary, key: string, page: PdfPage): void {
        if (dictionary.has(key)) {
            const namedObject: _PdfDictionary = dictionary.get(key);
            if (namedObject && namedObject.has('Names')) {
                const nameCollection: _PdfDictionary[] = namedObject.getArray('Names');
                if (nameCollection && nameCollection.length > 0) {
                    const namedPageCollection: _PdfDictionary[] = this._getUpdatedPageTemplates(nameCollection, page);
                    const namedPageDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                    namedPageDictionary.update('Names', namedPageCollection);
                    const reference: _PdfReference = this._crossReference._getNextReference();
                    this._crossReference._cacheMap.set(reference, namedPageDictionary);
                    namedPageDictionary.objId = reference.toString();
                    dictionary.update(key, reference);
                }
            }
        }
    }
    _getUpdatedPageTemplates(namedPages: _PdfDictionary[], page: PdfPage): _PdfDictionary[] {
        if (namedPages.length > 0) {
            for (let i: number = 1; i <= namedPages.length; i = i + 2) {
                const pageDictionary: _PdfDictionary = namedPages[<number>i];
                if (pageDictionary && page._pageDictionary === pageDictionary) {
                    namedPages.pop();
                    namedPages.pop();
                    return namedPages;
                }
            }
        }
        return namedPages;
    }
    /**
     * Reorders the pages in the PDF document.
     *
     * @param {number[]} orderArray The page sequence to arrange the pages.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Reorders the pages in the PDF document
     * document.reorderPages([3, 2, 1]);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    reorderPages(orderArray: number[]): void {
        orderArray.forEach((pageNumber: number) => {
            this._checkPageNumber(pageNumber);
        });
        const sortedArray: number[] = this._sortedArray(orderArray);
        const ascendingOrder: number[] = orderArray.slice().sort((a: number, b: number) => a - b);
        const inputArray: number[] = Array.from({ length: this.pageCount }, (_: number, i: number) => i);
        const pagesToRemove: number[] = inputArray.filter((element: number) => sortedArray.indexOf(element) === -1);
        for (let i: number = pagesToRemove.length - 1; i >= 0; i--) {
            this.removePage(pagesToRemove[<number>i]);
        }
        const newkids: _PdfReference[] = [];
        const newPages: Map<number, PdfPage> = new Map<number, PdfPage>();
        const parentReference: _PdfReference = this._catalog._catalogDictionary._get('Pages');
        sortedArray.forEach((sortedItem: number, i: number) => {
            const indexPage: PdfPage = this.getPage(ascendingOrder.indexOf(sortedItem));
            indexPage._pageIndex = i;
            newPages.set(i, indexPage);
            const sectionDictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            sectionDictionary.update('Type', _PdfName.get('Pages'));
            sectionDictionary.update('Count', 1);
            sectionDictionary.update('Parent', parentReference);
            const sectionReference: _PdfReference = this._crossReference._getNextReference();
            sectionDictionary.objId = sectionReference.toString();
            sectionDictionary.update('Kids', [indexPage._ref]);
            newkids.push(sectionReference);
            let parentDictionary: _PdfDictionary = indexPage._pageDictionary.get('Parent');
            while (parentDictionary && parentDictionary.get('Type').name === 'Pages') {
                parentDictionary.forEach((key: string, value: any) => { // eslint-disable-line
                    switch (key) {
                    case 'Parent':
                    case 'Kids':
                    case 'Type':
                    case 'Count':
                        break;
                    case 'Resources':
                        this._cloneResources(parentDictionary.get('Resources'), sectionDictionary);
                        break;
                    default:
                        if (!sectionDictionary.has(key)) {
                            sectionDictionary.update(key, value);
                        }
                        break;
                    }
                });
                if (parentDictionary.has('Parent')) {
                    parentDictionary = parentDictionary.get('Parent');
                } else {
                    break;
                }
            }
            this._crossReference._cacheMap.set(sectionReference, sectionDictionary);
            const pageSection: _PdfDictionary = this._crossReference._fetch(indexPage._ref);
            pageSection.update('Parent', sectionReference);
        });
        this._pages = newPages;
        if (this._catalog) {
            const parentDictionary: _PdfDictionary = this._catalog._topPagesDictionary;
            if (parentDictionary && parentDictionary.has('Kids')) {
                let kids: _PdfReference[] = parentDictionary.get('Kids');
                kids = newkids;
                parentDictionary.update('Kids', kids);
            }
        }
    }
    _sortedArray(order: number[]): number[] {
        const sortedArray: number[] = [];
        order.forEach((num: number) => {
            if (sortedArray.indexOf(num) === -1) {
                sortedArray.push(num);
            }
        });
        return sortedArray;
    }
    _cloneResources(source: _PdfDictionary, target: _PdfDictionary): void {
        if (!target.has('Resources')) {
            target.update('Resources', source);
        } else {
            const resourceDictionary: _PdfDictionary = target.get('Resources');
            source.forEach((key: string, value: any) => { // eslint-disable-line
                if (resourceDictionary.has(key)) {
                    this._cloneInnerResources(key, value, resourceDictionary);
                } else {
                    resourceDictionary.update(key, value);
                }
            });
        }
    }
    _cloneInnerResources(key: string, value: any, resourceDictionary: _PdfDictionary): void { // eslint-disable-line
        if (value instanceof _PdfDictionary) {
            const oldObject: _PdfDictionary = resourceDictionary.get(key);
            if (oldObject) {
                let hasNew: boolean = false;
                oldObject.forEach((innerKey: string, innerValue: any) => { // eslint-disable-line
                    if (!oldObject.has(innerKey)) {
                        oldObject.update(innerKey, innerValue);
                        hasNew = true;
                    }
                });
                if (hasNew) {
                    resourceDictionary._updated = true;
                }
            } else {
                resourceDictionary.update(key, value);
            }
        } else if (Array.isArray(value)) {
            const oldArray: any[] = resourceDictionary.get(key); // eslint-disable-line
            if (oldArray) {
                let hasNew: boolean = false;
                value.forEach((entry: any) => { // eslint-disable-line
                    if (oldArray.indexOf(entry) === -1) {
                        oldArray.push(entry);
                        hasNew = true;
                    }
                });
                if (hasNew) {
                    resourceDictionary._updated = true;
                }
            } else {
                resourceDictionary.update(key, value);
            }
        }
    }
    /**
     * Saves the modified document.
     *
     * @returns {Uint8Array} Saved PDF data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Save the document
     * let data: Uint8Array = document.save();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    save(): Uint8Array
    /**
     * Saves the modified document to the specified filename.
     *
     * @param {string} filename Specifies the filename to save the output pdf document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Save the document
     * document.save('Output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    save(filename: string): void
    save(filename?: string): Uint8Array | void {
        if (!this._isLoaded && this.pageCount === 0) {
            this.addSection().addPage();
        }
        this._doPostProcess(this._flatten);
        if (typeof filename === 'string') {
            Save.save(filename, new Blob([this._crossReference._save()], { type: 'application/pdf' }));
        } else {
            return this._crossReference._save();
        }
    }
    /**
     * Saves the document to the specified output stream and return the stream as Blob.
     *
     * @returns {Promise<{ blobData: Blob }>} Saved PDF data as `Blob`.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Save the document
     * let data: Promise<{ blobData: Blob }> = document.saveAsBlob();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public saveAsBlob(): Promise<{ blobData: Blob }> {
        return new Promise((resolve: Function) => {
            const obj: {blobData: Blob} = {blobData: new Blob([this._crossReference._save()], { type: 'application/pdf' })};
            resolve(obj);
        });
    }
    /**
     * Exports the annotations from the PDF document.
     *
     * @returns {Uint8Array} Exported annotation data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the annotations from the PDF document.
     * let data: Uint8Array = document.exportAnnotations();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportAnnotations(): Uint8Array
    /**
     * Exports the annotations from the PDF document.
     *
     * @param {PdfAnnotationExportSettings} settings Annotation export settings.
     * @returns {Uint8Array} Exported annotation data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * settings.dataFormat = DataFormat.json;
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportAnnotations(settings: PdfAnnotationExportSettings): Uint8Array
    /**
     * Exports the annotations from the PDF document.
     *
     * @param {string} filename Output file name.
     * @returns {void} Exports the annotations from the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the annotations from the PDF document.
     * document.exportAnnotations('annotations.xfdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportAnnotations(filename: string): void
    /**
     * Exports the annotations from the PDF document.
     *
     * @param {string} filename Output file name.
     * @param {PdfAnnotationExportSettings} settings Annotation export settings.
     * @returns {void} Exports the annotations from the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * settings.dataFormat = DataFormat.json;
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations('annotations.json', settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportAnnotations(filename: string, settings: PdfAnnotationExportSettings): void
    exportAnnotations(arg1?: string | PdfAnnotationExportSettings, arg2?: PdfAnnotationExportSettings): Uint8Array | void {
        this._isExport = true;
        this._doPostProcessOnAnnotations();
        let helper: _ExportHelper;
        let settings: PdfAnnotationExportSettings;
        if (arg1 && arg1 instanceof PdfAnnotationExportSettings) {
            settings = arg1;
        } else if (arg2 && arg2 instanceof PdfAnnotationExportSettings) {
            settings = arg2;
        }
        if (settings) {
            if (settings.dataFormat === DataFormat.xfdf) {
                helper = new _XfdfDocument();
            } else if (settings.dataFormat === DataFormat.json) {
                helper = new _JsonDocument();
            } else if (settings.dataFormat === DataFormat.fdf) {
                helper = new _FdfDocument();
            } else {
                return undefined;
            }
            helper.exportAppearance = settings.exportAppearance;
        } else {
            helper = new _XfdfDocument();
        }
        const result: Uint8Array = helper._exportAnnotations(this);
        if (arg1 && typeof arg1 === 'string') {
            Save.save(arg1, new Blob([result], { type: 'text/plain' }));
        } else {
            return result;
        }
    }
    /**
     * Exports the form data from the PDF document.
     *
     * @returns {Uint8Array} Exported form data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the form data from the PDF document.
     * let data: Uint8Array = document.exportFormData();
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportFormData(): Uint8Array
    /**
     * Exports the form data from the PDF document.
     *
     * @param {PdfFormFieldExportSettings} settings Form field export settings.
     * @returns {Uint8Array} Exported form data as byte array.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * settings.dataFormat = DataFormat.json;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportFormData(settings: PdfFormFieldExportSettings): Uint8Array
    /**
     * Exports the form data from the PDF document.
     *
     * @param {string} filename Output file name.
     * @returns {void} Exports the form data from the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Export form field to XFDF format
     * let xfdf: Uint8Array = document.exportFormData('formData.xfdf');
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportFormData(filename: string): void
    /**
     * Exports the form data from the PDF document.
     *
     * @param {string} filename Output file name.
     * @param {PdfFormFieldExportSettings} settings Form field export settings.
     * @returns {void} Exports the form data from the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * settings.dataFormat = DataFormat.json;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData('formData.json', settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    exportFormData(filename: string, settings: PdfFormFieldExportSettings): void
    exportFormData(arg1?: string | PdfFormFieldExportSettings, arg2?: PdfFormFieldExportSettings): Uint8Array | void {
        this._doPostProcessOnFormFields();
        let helper: _ExportHelper;
        let settings: PdfFormFieldExportSettings;
        if (arg1 && arg1 instanceof PdfFormFieldExportSettings) {
            settings = arg1;
        } else if (arg2 && arg2 instanceof PdfFormFieldExportSettings) {
            settings = arg2;
        }
        if (settings) {
            if (settings.dataFormat === DataFormat.xfdf) {
                helper = new _XfdfDocument(settings.exportName);
            } else if (settings.dataFormat === DataFormat.json) {
                helper = new _JsonDocument(settings.exportName);
            } else if (settings.dataFormat === DataFormat.fdf) {
                helper = new _FdfDocument(settings.exportName);
            } else if (settings.dataFormat === DataFormat.xml) {
                helper = new _XmlDocument(settings.exportName);
            } else {
                return undefined;
            }
            helper._asPerSpecification = settings.asPerSpecification;
        } else {
            helper = new _XfdfDocument();
            helper._asPerSpecification = false;
        }
        if (arg1 && typeof arg1 === 'string') {
            Save.save(arg1, new Blob([helper._exportFormFields(this)], { type: 'text/plain' }));
        } else {
            return helper._exportFormFields(this);
        }
    }
    /**
     * Imports the annotations from the PDF document.
     *
     * @param {string} data annotations data as base64 string.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the annotations to the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Imports annotations from to the PDF document.
     * document.importAnnotations('annotations.json', DataFormat.json);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    importAnnotations(data: string, dataFormat: DataFormat): void
    /**
     * Imports the annotations from the PDF document.
     *
     * @param {Uint8Array} data annotations data as byte array.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the annotations to the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Imports annotations from to the PDF document.
     * document.importAnnotations(annotations, DataFormat.json);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    importAnnotations(data: Uint8Array, dataFormat: DataFormat): void
    importAnnotations(data: string | Uint8Array, dataFormat: DataFormat): void {
        if (dataFormat === DataFormat.xfdf) {
            const xfdf: _XfdfDocument = new _XfdfDocument();
            xfdf._importAnnotations(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
        } else if (dataFormat === DataFormat.json) {
            const json: _JsonDocument = new _JsonDocument();
            json._importAnnotations(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
        } else if (dataFormat === DataFormat.fdf) {
            const fdf: _FdfDocument = new _FdfDocument();
            fdf._importAnnotations(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
        }
    }
    /**
     * Imports the form data from the PDF document.
     *
     * @param {string} data Form data as base64 string.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the form data to the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Imports form data from to the PDF document.
     * document.importFormData('formData.json', DataFormat.json);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    importFormData(data: string, dataFormat: DataFormat): void
    /**
     * Imports the form data from the PDF document.
     *
     * @param {Uint8Array} data Form data as byte array.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the form data to the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Imports form data from to the PDF document.
     * document.importFormData(data, DataFormat.json);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    importFormData(data: Uint8Array, dataFormat: DataFormat): void
    importFormData(data: string | Uint8Array, dataFormat: DataFormat): void {
        if (this.form.count > 0) {
            if (dataFormat === DataFormat.xfdf) {
                const xfdf: _XfdfDocument = new _XfdfDocument();
                xfdf._importFormData(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
            } else if (dataFormat === DataFormat.json) {
                const json: _JsonDocument = new _JsonDocument();
                json._importFormData(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
            } else if (dataFormat === DataFormat.fdf) {
                const fdf: _FdfDocument = new _FdfDocument();
                fdf._importFormData(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
            } else if (dataFormat === DataFormat.xml) {
                const xml: _XmlDocument = new _XmlDocument();
                xml._importFormData(this, (typeof data === 'string') ? _decode(data) as Uint8Array : data);
            }
        }
    }
    /**
     * Disposes the current instance of `PdfDocument` class.
     *
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    public destroy(): void {
        if (this._crossReference) {
            this._crossReference._destroy();
            this._crossReference = undefined;
        }
        if (this._catalog) {
            this._catalog._destroy();
            this._catalog = undefined;
        }
        this._endObjSignature = undefined;
        this._headerSignature = undefined;
        if (this._pages && this._pages.size > 0) {
            this._pages.forEach((value: PdfPage) => {
                value._destroy();
            });
        }
        if (this._pages) {
            this._pages.clear();
            this._pages = undefined;
        }
        this._startXrefSignature = undefined;
        this._stream = undefined;
        if (this._form) {
            this._form._fontCache = undefined;
            this._form = undefined;
        }
        this._fontCollection.clear();
        _clearPrimitiveCaches();
        if (this._mergeHelperCache) {
            if (this._mergeHelperCache.size > 0) {
                this._mergeHelperCache.forEach((value: _PdfMergeHelper) => {
                    if (value) {
                        value._objectDispose();
                    }
                });
            }
            this._mergeHelperCache.clear();
            this._mergeHelperCache = undefined;
        }
    }
    get _destinationCollection(): _PdfNamedDestinationCollection {
        if (this._namedDestinationCollection === null || typeof this._namedDestinationCollection === 'undefined') {
            if (this._catalog._catalogDictionary.has('Names')) {
                const names: _PdfDictionary = this._catalog._catalogDictionary.get('Names');
                this._namedDestinationCollection = new _PdfNamedDestinationCollection(names, this._crossReference);
            } else {
                this._namedDestinationCollection = new _PdfNamedDestinationCollection();
            }
        }
        return this._namedDestinationCollection;
    }
    _getLinearizationPage(pageIndex: number): {dictionary: _PdfDictionary, reference: _PdfReference} {
        const { _catalog, _linearization, _crossReference } = this;
        const ref: _PdfReference = _PdfReference.get(_linearization.objectNumberFirst, 0);
        try {
            let obj: any = _crossReference._fetch(ref); // eslint-disable-line
            if (obj instanceof _PdfDictionary) {
                const type: _PdfName = obj.get('Type');
                if (_isName(type, 'Page') || (!obj.has('Type') && !obj.has('Kids'))) {
                    if (!_catalog.pageKidsCountCache.has(ref)) {
                        _catalog.pageKidsCountCache.put(ref, 1);
                    }
                    if (!_catalog.pageIndexCache.has(ref)) {
                        _catalog.pageIndexCache.put(ref, 0);
                    }
                    return {dictionary: obj, reference: ref};
                }
            }
            throw new FormatError('The Linearization dictionary does not point to a valid Page dictionary.');
        } catch (reason) {
            return _catalog._getPageDictionary(pageIndex);
        }
    }
    _checkHeader(): void {
        const stream: _PdfStream = this._stream;
        stream.reset();
        if (!this._find(stream, this._headerSignature)) {
            return;
        }
        stream.moveStart();
        let version: string = '';
        let ch: number = stream.getByte();
        while (ch > 0x20) {
            if (version.length >= 12) {
                break;
            }
            version += String.fromCharCode(ch);
            ch = stream.getByte();
        }
        if (!this._version) {
            this._version = version.substring(5);
            if (this._version === '%PDF-1.3' || this._version === '%PDF-1.0' || this._version === '%PDF-1.1'
                || this._version === '%PDF-1.2') {
                this.fileStructure.isIncrementalUpdate = false;
            }
        }
    }
    _parse(recoveryMode: boolean): void {
        this._crossReference._parse(recoveryMode);
        this._catalog = new _PdfCatalog(this._crossReference);
        if (this._catalog.version) {
            this._version = this._catalog.version;
        }
    }
    _find(stream: _PdfStream, signature: Uint8Array, limit: number = 1024, backwards: boolean = false): boolean {
        const signatureLength: number = signature.length;
        const scanBytes: Uint8Array = stream.peekBytes(limit);
        const scanLength: number = scanBytes.length - signatureLength;
        if (scanLength <= 0) {
            return false;
        }
        if (backwards) {
            const signatureEnd: number = signatureLength - 1;
            let position: number = scanBytes.length - 1;
            while (position >= signatureEnd) {
                let j: number = 0;
                while (j < signatureLength && scanBytes[position - j] === signature[signatureEnd - j]) {
                    j++;
                }
                if (j >= signatureLength) {
                    stream.position += position - signatureEnd;
                    return true;
                }
                position--;
            }
        } else {
            let position: number = 0;
            while (position <= scanLength) {
                let j: number = 0;
                while (j < signatureLength && scanBytes[position + j] === signature[j]) { // eslint-disable-line
                    j++;
                }
                if (j >= signatureLength) {
                    stream.position += position;
                    return true;
                }
                position++;
            }
        }
        return false;
    }
    _doPostProcess(isFlatten: boolean = false): void {
        this._doPostProcessOnFormFields(isFlatten);
        this._doPostProcessOnAnnotations(isFlatten);
    }
    _doPostProcessOnFormFields(isFlatten: boolean = false) : void {
        if (this._catalog._catalogDictionary.has('AcroForm')) {
            this.form._doPostProcess(isFlatten);
            if (isFlatten) {
                const formObject: _PdfReference | _PdfDictionary = this._catalog._catalogDictionary.getRaw('AcroForm');
                const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
                dictionary._updated = true;
                if (formObject instanceof _PdfReference) {
                    this._crossReference._cacheMap.set(formObject, dictionary);
                } else {
                    this.form._dictionary = dictionary;
                    this._crossReference._allowCatalog = true;
                }
                this.form._clear();
            }
            if (this.form._isDefaultAppearance) {
                this.form._dictionary.update('NeedAppearances', this.form._isDefaultAppearance);
            } else if (!this.form._isDefaultAppearance && this.form._dictionary.has('NeedAppearances') && this.form._isNeedAppearances) {
                this.form._dictionary.update('NeedAppearances', false);
            } else if (!this.form._isDefaultAppearance && this.form._dictionary.has('NeedAppearances')) {
                this.form._dictionary.update('NeedAppearances', this.form.needAppearances);
            }
        }
    }
    _doPostProcessOnAnnotations(isFlatten: boolean = false): void {
        for (let i: number = 0; i < this.pageCount; i++) {
            const page: PdfPage = this.getPage(i);
            page.annotations._isExport = this._isExport;
            page.annotations._doPostProcess(isFlatten);
            if (isFlatten) {
                if (page._pageDictionary.has('Annots')) {
                    delete page._pageDictionary._map.Annots;
                    page._pageDictionary._updated = true;
                }
                page.annotations._clear();
            }
        }
    }
    _addWatermarkText(): void {
        if (this.pageCount > 0) {
            for (let index: number = 0; index < this._pageCount; index++) {
                const page: PdfPage = this.getPage(index);
                if (page) {
                    try {
                        const graphics: PdfGraphics = page.graphics;
                        graphics.save();
                        graphics.setTransparency(0.20);
                        graphics.drawRectangle({x: 0, y: 0, width: page.size.width, height: 33.75}, new PdfBrush({r: 255, g: 255, b: 255}));
                        graphics.restore();
                        graphics.save();
                        graphics.setTransparency(0.50);
                        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
                        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
                        graphics.drawString('Created with a trial version of Syncfusion Essential PDF',
                                            font,
                                            {x: 0, y: 0, width: page.size.width, height: 33.75},
                                            null,
                                            new PdfBrush({r: 0, g: 0, b: 0}),
                                            format);
                        graphics.restore();
                    } catch (e) { } // eslint-disable-line
                }
            }
        }
    }
    /**
     * Import the pages specified by the start and end index into the current document's pages collection.
     *
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @param {number} startIndex Start page index. The default value is 0.
     * @param {number} endIndex End page index. The default value is the index of the last page in the source document.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     *
     * ```typescript
     * // Load an existing PDF document
     * let destination: PdfDocument = new PdfDocument(data1);
     * // Load another existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(data2);
     * // Import 5 pages from page index 2 to 6 into the destination document.
     * destination.importPageRange(sourceDocument, 2, 6);
     * // Save the output PDF
     * destination.save('Output.pdf');
     * // Destroy the documents
     * destination.destroy();
     * sourceDocument.destroy();
     * ```
     */
    importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number): void
    /**
     * Import the pages specified by start and end index into the current document's pages collection.
     *
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @param {number} startIndex Start page index. The default value is 0.
     * @param {number} endIndex End page index. The default value is the index of the last page in the source document.
     * @param {PdfPageImportOptions} options Options to customize the support of import PDF pages.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     *
     * ```typescript
     * // Load an existing PDF document
     * let destination: PdfDocument = new PdfDocument(data1);
     * // Load another existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(data2);
     * // Options to customize the support of import PDF pages.
     * let options: PdfPageImportOptions = new PdfPageImportOptions();
     * // Sets the target page index to import
     * options.targetIndex = 3;
     * // Import 5 pages from page index 2 to 6 into the destination document and insert them at index 3.
     * destination.importPageRange(sourceDocument, 2, 6, options);
     * // Save the output PDF
     * destination.save('Output.pdf');
     * // Destroy the documents
     * destination.destroy();
     * sourceDocument.destroy();
     * ```
     */
    importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number, options?: PdfPageImportOptions): void
    importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number, options?: PdfPageImportOptions): void {
        if (startIndex > endIndex || startIndex >= sourceDocument.pageCount) {
            throw new Error('The start index is greater then the end index, which might indicate the error in the program.');
        }
        this._importPages(sourceDocument, startIndex, endIndex, options);
    }
    _importPages(sourceDocument: PdfDocument, startIndex: number, endIndex: number, options?: PdfPageImportOptions): void {
        let sourceOCProperties: _PdfDictionary;
        let correspondancePagecount: number = 0;
        let ocProperties : _PdfDictionary;
        if (typeof options !== 'undefined' && typeof options.targetIndex === 'number') {
            if (options.targetIndex > this.pageCount) {
                throw new Error('The target index is out of range.');
            }
            this._targetIndex = options.targetIndex;
        }
        const pageReference: Map<_PdfDictionary, PdfPage> = new Map<_PdfDictionary, PdfPage>();
        if (!this._isDuplicatePage) {
            for (let index: number = 0; index < sourceDocument.pageCount; index++) {
                const sourcepage: PdfPage = sourceDocument.getPage(index);
                pageReference.set(sourcepage._pageDictionary, null);
            }
        }
        let helper: _PdfMergeHelper;
        if (!this._mergeHelperCache) {
            this._mergeHelperCache = new Map<string, _PdfMergeHelper>();
        }
        if (!sourceDocument._uniqueID) {
            sourceDocument._uniqueID = _getNewGuidString();
        }
        if (this._mergeHelperCache.has(sourceDocument._uniqueID)) {
            helper = this._mergeHelperCache.get(sourceDocument._uniqueID);
        } else {
            helper = new _PdfMergeHelper(this._crossReference, this, sourceDocument, pageReference, options);
            this._mergeHelperCache.set(sourceDocument._uniqueID, helper);
        }
        let isLayersPresent: boolean = false;
        if ((!this ._isDuplicatePage && sourceDocument._catalog._catalogDictionary.has('OCProperties')) || (typeof options !== 'undefined' && !options.optimizeResources)) {
            isLayersPresent = true;
            sourceOCProperties = sourceDocument._catalog._catalogDictionary.get('OCProperties');
            ocProperties = new _PdfDictionary(this._crossReference);
            helper._writeObject(sourceDocument, ocProperties, sourceOCProperties, sourceOCProperties, 'OCProperties', null, null);
            ocProperties._updated = true;
        }
        for (let i: number = startIndex; i <= endIndex; i++) {
            const page: PdfPage = sourceDocument.getPage(i);
            sourceDocument.form._doPostProcess(sourceDocument.flatten, page);
            if (page.annotations.count > 0) {
                page.annotations._doPostProcess(sourceDocument.flatten);
                if (sourceDocument.flatten) {
                    if (page._pageDictionary.has('Annots')) {
                        delete page._pageDictionary._map.Annots;
                        page._pageDictionary._updated = true;
                    }
                    page.annotations._clear();
                }
            }
            if (sourceDocument._isSplitDocument) {
                helper._importPages(page, this._targetIndex, isLayersPresent, this._isDuplicatePage, options,
                                    sourceDocument._isSplitDocument);
            } else {
                helper._importPages(page, this._targetIndex, isLayersPresent, this._isDuplicatePage, options);
            }
            correspondancePagecount++;
            if (typeof this._targetIndex === 'number') {
                ++this._targetIndex;
            }
        }
        if (!this._isDuplicatePage) {
            helper._fixDestinations(sourceDocument);
        }
        helper._exportBookmarks(sourceDocument, correspondancePagecount);
        helper._mergeFormFieldsWithDocument();
        if ((isLayersPresent && !this._isDuplicatePage) || (typeof options !== 'undefined' && !options.optimizeResources)){
            helper._importLayers(ocProperties, true);
        }
        helper._objectDispose();
        this._isDuplicatePage = false;
    }
    /**
     * Copy the specific page and insert it as the next page
     *
     * @param {number} pageIndex Target page index to import.
     *
     * ```typescript
     * // Load an existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(data1);
     * // Copy the second page and add it as third page
     * sourceDocument.importPage(1);
     * // Save the output PDF
     * sourceDocument.save('Output.pdf');
     * // Destroy the documents
     * sourceDocument.destroy();
     * ```
     */
    importPage(index: number): void
    /**
     * Copy the specific page and insert it at the specified target page index and page rotation.
     *
     * @param {number} pageIndex Target page index to import.
     * @param {PdfPageImportOptions} options Options to customize the support of import PDF pages.
     *
     * ```typescript
     * // Load an existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(readFromResources('PDF_Succinctly.pdf'));
     * // Options to customize the support of import PDF pages.
     * let options: PdfPageImportOptions = new PdfPageImportOptions();
     * // Sets the target page index to import
     * options.targetIndex = 1;
     * // Sets the rotation angle of the page to import
     * options.rotation = PdfRotationAngle.angle180;
     * // Copy the first page and add it as second page with page rotation
     * sourceDocument.importPage(0, options);
     * // Save the output PDF
     * let output = sourceDocument.save();
     * write('863764-86.pdf', output);
     * // Destroy the documents
     * sourceDocument.destroy();
     * ```
     */
    importPage(index: number, options: PdfPageImportOptions): void
    /**
     * Import the specified page into the current document pages collection as the last page
     *
     * @param {PdfPage} page Page to import.
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     *
     * ```typescript
     * // Load an existing PDF document
     * let destination: PdfDocument = new PdfDocument(data1);
     * // Load another existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(data2);
     * // Access first page of the source document
     * let pageToImport: PdfPage = sourceDocument.getPage(0);
     * // Import the page into the destination document as the last page.
     * destination.importPage(pageToImport, sourceDocument);
     * // Save the output PDF
     * destination.save('Output.pdf');
     * // Destroy the documents
     * destination.destroy();
     * sourceDocument.destroy();
     * ```
     */
    importPage(page: PdfPage, sourceDocument: PdfDocument): void
    /**
     * Create a new page with default settings and insert it into the collection at the specified page index.
     *
     * @param {PdfPage} page Page to import.
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @param {PdfPageImportOptions} options Options to customize the support of import PDF pages.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     *
     * ```typescript
     * // Load an existing PDF document
     * let destination: PdfDocument = new PdfDocument(data1);
     * // Load another existing PDF document
     * let sourceDocument: PdfDocument = new PdfDocument(data2);
     * // Access first page of the source document
     * let pageToImport: PdfPage = sourceDocument.getPage(0);
     * // Options to customize the support of import PDF pages.
     * let options: PdfPageImportOptions = new PdfPageImportOptions();
     * // Sets the target page index to import
     * options.targetIndex = 5;
     * // Imports the page into destination document as 5th page
     * destination.importPage(pageToImport, sourceDocument, options);
     * // Save the output PDF
     * destination.save('Output.pdf');
     * // Destroy the documents
     * destination.destroy();
     * sourceDocument.destroy();
     * ```
     */
    importPage(page: PdfPage, sourceDocument: PdfDocument, options?: PdfPageImportOptions): void
    importPage(arg1?: PdfPage | number, arg2?: PdfDocument | PdfPageImportOptions, options?: PdfPageImportOptions): void {
        if (typeof arg1 === 'number') {
            this._isDuplicatePage = true;
            if (arg2 instanceof PdfPageImportOptions) {
                this._importPages(this, arg1, arg1, arg2);
            } else {
                this._importPages(this, arg1, arg1);
            }
        } else if (arg1 instanceof PdfPage && arg2 instanceof PdfDocument) {
            const index: number = arg1._pageIndex;
            this.importPageRange(arg2, index, index, options);
        }
    }
    /**
     * Splitting a PDF file into individual pages.
     *
     * @returns {void} Nothing
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document into individual pages
     * document.split();
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    split(): void {
        this.splitByFixedNumber(1);
    }
    /**
     * Splits the PDF document into parts, each containing a maximum number of pages specified.
     *
     * @param {number} fixedNumber specifies the maximum number of pages in each split PDF. The default value is 1.
     * @returns {void} Nothing
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    splitByFixedNumber(fixedNumber: number): void {
        const pageCount: number = this.pageCount;
        if (this.splitEvent && pageCount >= fixedNumber && fixedNumber > 0) {
            let splitIndex: number = 0;
            for (let tempValue: number = 0; tempValue < pageCount; tempValue += fixedNumber) {
                const endIndex: number = Math.min(tempValue + fixedNumber - 1, pageCount - 1);
                const pdfData: Uint8Array = this._importDocumentPages(tempValue, endIndex);
                this._invokeSplitEvent(splitIndex, pdfData);
                splitIndex++;
            }
        } else {
            throw new Error('Invalid split number. Split number should be greater than zero and less than or equal to page count.');
        }
    }
    /**
     * Splits the PDF document into multiple parts based on the specified page ranges.
     *
     * @param {Array<number[]>} ranges The two dimensional number array specified for start and end page indexes to split PDF documents.
     * @returns {void} Nothing
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by page ranges specified
     * document.splitByPageRanges([[0, 4], [5, 9]]);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    splitByPageRanges(ranges: number[][]): void {
        const pageCount: number = this.pageCount;
        if (this.splitEvent) {
            let splitIndex: number = 0;
            ranges.forEach((range: number[]) => {
                if (Array.isArray(range) && range.length < 2) {
                    throw new Error('Invalid page range. Start and end page indexes should be specified.');
                }
                const start: number = range[0];
                const end: number = range[1];
                if (start < 0 || end < 0 || start >= pageCount || end >= pageCount || start > end) {
                    throw new Error(`Invalid page range: start (${start}) and end (${end}).`);
                }
                const pdfData: Uint8Array = this._importDocumentPages(start, end);
                this._invokeSplitEvent(splitIndex, pdfData);
                splitIndex++;
            });
        }
    }
    private _importDocumentPages(startIndex: number, endIndex: number): Uint8Array {
        this._isSplitDocument = true;
        const document: PdfDocument = new PdfDocument();
        for (let i: number = startIndex; i <= endIndex; i++) {
            const page: PdfPage = this.getPage(i);
            document.importPage(page, this);
        }
        const result: Uint8Array = document.save();
        document.destroy();
        return result;
    }
    private _invokeSplitEvent(splitIndex: number, pdfData: Uint8Array): void {
        const args: PdfDocumentSplitEventArgs = new PdfDocumentSplitEventArgs(splitIndex, pdfData);
        this.splitEvent(this, args);
    }
    _getSignature(dictionary: _PdfDictionary, field: any): PdfSignature { // eslint-disable-line
        const signature: PdfSignature = new PdfSignature();
        signature._initializeInternals(dictionary, field);
        return signature;
    }
}
/**
 * Represents annotation export settings.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Sets export data format as JSON type to annotation export settings
 * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
 * // Set the data format defined in annotation export settings
 * settings.dataFormat = DataFormat.json;
 * // Export annotations to JSON format
 * let json: Uint8Array = document.exportAnnotations(settings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfAnnotationExportSettings {
    _format: DataFormat = DataFormat.xfdf;
    _exportAppearance: boolean = false;
    /**
     * Gets the data format defined in annotation export settings.
     *
     * @returns {DataFormat} - Returns the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations(settings);
     * // Get the data format defined in annotation export settings
     * let dataFormat: DataFormat = settings.dataFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get dataFormat(): DataFormat {
        return this._format;
    }
    /**
     * Sets the data format defined in annotation export settings.
     *
     * @param {DataFormat} format - Specifies the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets export data format as JSON type to annotation export settings
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Set the data format defined in annotation export settings
     * settings.dataFormat = DataFormat.json;
     * // Export annotations to JSON format
     * let json: Uint8Array = document.exportAnnotations(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set dataFormat(format: DataFormat) {
        this._format = format;
    }
    /**
     * Gets the boolean value indicating whether the appearance of a particular object can be exported or not.
     *
     * @returns {boolean} - Returns the boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets the annotation export settings with enabled export appearance.
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Export annotations to XFDF format
     * let xfdf: Uint8Array = document.exportAnnotations(settings);
     * // Get the boolean value indicating whether the appearance of a particular object can be exported or not
     * let appearance: boolean = settings.exportAppearance;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportAppearance(): boolean {
        return this._exportAppearance;
    }
    /**
     * Sets the boolean value indicating whether the appearance of a particular object can be exported or not.
     *
     * @param {boolean} value - The boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Sets the annotation export settings with enabled export appearance.
     * let settings: PdfAnnotationExportSettings = new PdfAnnotationExportSettings();
     * // Set the boolean value indicating whether the appearance of a particular object can be exported or not
     * settings.exportAppearance = true;
     * // Export annotations to XFDF format
     * let xfdf: Uint8Array = document.exportAnnotations(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportAppearance(value: boolean) {
        this._exportAppearance = value;
    }
}
/**
 * Represents form fields export settings.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Sets the form field data export settings with output data format.
 * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
 * // Set the data format defined in form field export settings.
 * settings.dataFormat = DataFormat.json;
 * // Export form field to JSON format
 * let json: Uint8Array = document.exportFormData(settings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfFormFieldExportSettings {
    _format: DataFormat = DataFormat.xfdf;
    _exportName: string = '';
    _asPerSpecification: boolean = true;
    /**
     * Gets the data format defined in form field export settings.
     *
     * @returns {DataFormat} - Returns the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the data format defined in form field export settings
     * let dataFormat: DataFormat = settings.dataFormat;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get dataFormat(): DataFormat {
        return this._format;
    }
    /**
     * Sets the data format defined in form field export settings.
     *
     * @param {DataFormat} format - Specifies the data format.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with output data format.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the data format defined in form field export settings.
     * settings.dataFormat = DataFormat.json;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set dataFormat(format: DataFormat) {
        this._format = format;
    }
    /**
     * Gets the export name defined in form field export settings.
     *
     * @returns {string} - Returns the string value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with export name.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the export name defined in form field export settings
     * let name: boolean = settings.exportName;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get exportName(): string {
        return this._exportName;
    }
    /**
     * Sets the export name defined in form field export settings.
     *
     * @param {string} name - Specifies the export name of the form.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the form field data export settings with export name.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the export name defined in form field export settings.
     * settings.exportName = 'JobApplication'.
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set exportName(name: string) {
        this._exportName = name;
    }
    /**
     * Gets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     *
     * @returns {boolean} - Returns the boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Get the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let asPerSpecification: boolean = settings.asPerSpecification;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get asPerSpecification(): boolean {
        return this._asPerSpecification;
    }
    /**
     * Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     *
     * @param {boolean} value - The boolean value.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Sets the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * let settings: PdfFormFieldExportSettings = new PdfFormFieldExportSettings();
     * // Set the boolean value indicating whether the data in a form field can be exported based on a certain specification.
     * settings.asPerSpecification = true;
     * // Export form field to JSON format
     * let json: Uint8Array = document.exportFormData(settings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set asPerSpecification(value: boolean) {
        this._asPerSpecification = value;
    }
}
/**
 * The class provides various settings related to PDF pages.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new PDF page settings instance
 * let pageSettings: PdfPageSettings = new PdfPageSettings();
 * // Sets the margins
 * pageSettings.margins = new PdfMargins(40);
 * // Sets the page size
 * pageSettings.size = {width: 595, height: 842};
 * // Sets the page orientation
 * pageSettings.orientation = PdfPageOrientation.landscape;
 * // Add a new PDF page with page settings
 * page = document.addPage(pageSettings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfPageSettings {
    _orientation: PdfPageOrientation ;
    _size: Size = {width: 595, height: 842};
    _isOrientation: boolean = false;
    _margins: PdfMargins;
    _rotation: PdfRotationAngle;
    /**
     * Initializes a new instance of the `PdfPageSettings` class
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     *
     * @param {object} [options] Optional settings to initialize the page.
     * @param {PdfPageOrientation} [options.orientation] Page orientation.
     * @param {Size} [options.size] Page size.
     * @param {PdfMargins} [options.margins] Page margins.
     * @param {PdfRotationAngle} [options.rotation] Page rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings with custom options
     * let pageSettings = new PdfPageSettings({
     *   orientation: PdfPageOrientation.landscape,
     *   size: { width: 842, height: 595 },
     *   margins: new PdfMargins(40),
     *   rotation: PdfRotationAngle.angle90
     * });
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(options: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
    /**
     * Initializes a new instance of the `PdfPageSettings` class.
     *
     * @param {object} [options] Optional settings to initialize the page.
     * @param {PdfPageOrientation} [options.orientation] Page orientation.
     * @param {Size} [options.size] Page size.
     * @param {PdfMargins} [options.margins] Page margins.
     * @param {PdfRotationAngle} [options.rotation] Page rotation angle.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings with custom options
     * let pageSettings = new PdfPageSettings({
     *   orientation: PdfPageOrientation.landscape,
     *   size: { width: 842, height: 595 },
     *   margins: new PdfMargins(40),
     *   rotation: PdfRotationAngle.angle90
     * });
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(options?: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
    {
        if (options && 'orientation' in options && options.orientation !== null && typeof options.orientation !== 'undefined') {
            this.orientation = options.orientation;
        } else {
            this._orientation = PdfPageOrientation.portrait;
        }
        if (options && 'size' in options && options.size !== null && typeof options.size !== 'undefined') {
            this.size = options.size;
        } else {
            this._size = {width: 595, height: 842};
        }
        if (options && 'margins' in options && options.margins !== null && typeof options.margins !== 'undefined') {
            this.margins = options.margins;
        } else {
            this._margins = new PdfMargins();
        }
        if (options && 'rotation' in options && options.rotation !== null && typeof options.rotation !== 'undefined') {
            this.rotation = options.rotation;
        } else {
            this._rotation = PdfRotationAngle.angle0;
        }
    }
    /**
     * Gets the orientation of the page.
     *
     * @returns {PdfPageOrientation} The orientation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page size
     * pageSettings.size = {width: 842, height: 595};
     * // Gets the page orientation
     * let orientation: PdfPageOrientation = pageSettings.orientation;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get orientation(): PdfPageOrientation {
        return this._orientation;
    }
    /**
     * Sets the orientation of the page.
     *
     * @param {PdfPageOrientation} value The orientation.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set orientation(value: PdfPageOrientation) {
        this._isOrientation = true;
        if (this._orientation !== value) {
            this._orientation = value;
            this._updateSize(value);
        }
    }
    /**
     * Gets the size of the page.
     *
     * @returns {Size} The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the width and height of the PDF page as number array
     * let size: Size = page.size;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): Size {
        return this._size;
    }
    /**
     * Sets the width and height of the page.
     *
     * @param {Size} value The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set size(value: Size) {
        if (this._isOrientation) {
            this._updateSize(value);
        } else {
            this._size = value;
            this._updateOrientation();
        }
    }
    /**
     * Gets the margin value of the page.
     *
     * @returns {PdfMargins} PDF margins
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the margins
     * let margins: PdfMargins = pageSettings.margins;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get margins(): PdfMargins {
        return this._margins;
    }
    /**
     * Sets the margin value of the page.
     *
     * @param {PdfMargins} value PDF margins
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set margins(value: PdfMargins) {
        this._margins = value;
    }
    /**
     * Gets the rotation angle of the PDF page.
     *
     * @returns {PdfRotationAngle} PDF rotation angle
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the rotation angle
     * let rotation: PdfRotationAngle = pageSettings.rotation;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get rotation(): PdfRotationAngle {
        return this._rotation;
    }
    /**
     * Sets the rotation angle of the PDF page.
     *
     * @param {PdfRotationAngle} value PDF rotation angle
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the rotation angle
     * pageSettings.rotation = PdfRotationAngle.angle90;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set rotation(value: PdfRotationAngle) {
        this._rotation = value;
        if (value >= 4) {
            this._rotation = (value % 4) as PdfRotationAngle;
        }
    }
    _updateSize(size: Size): void
    _updateSize(orientation: PdfPageOrientation): void
    _updateSize(value: Size | PdfPageOrientation): void {
        let pageOrientation: PdfPageOrientation;
        let pageSize: Size;
        if (typeof value !== 'number' && 'width' in value && 'height' in value && typeof value.width !== 'undefined' && typeof value.height !== 'undefined') {
            pageOrientation = this.orientation;
            pageSize = value;
        } else {
            pageOrientation = value as PdfPageOrientation;
            pageSize = this._size;
        }
        if (pageOrientation === PdfPageOrientation.portrait) {
            this._size = {width: Math.min(pageSize.width, pageSize.height), height: Math.max(pageSize.width, pageSize.height)};
        } else {
            this._size = {width: Math.max(pageSize.width, pageSize.height), height: Math.min(pageSize.width, pageSize.height)};
        }
    }
    _updateOrientation(): void {
        this._orientation = (this._size.height >= this._size.width) ? PdfPageOrientation.portrait : PdfPageOrientation.landscape;
    }
    _getActualSize(): number[] {
        const width: number = this._size.width - (this._margins._left + this._margins._right);
        const height: number = this._size.height - (this._margins._top + this._margins._bottom);
        return [width, height];
    }
}
/**
 * A class representing PDF page margins.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new PDF page settings instance
 * let pageSettings: PdfPageSettings = new PdfPageSettings();
 * // Sets the margins
 * pageSettings.margins = new PdfMargins(40);
 * // Sets the page size
 * pageSettings.size = {width: 595, height: 842};
 * // Sets the page orientation
 * pageSettings.orientation = PdfPageOrientation.landscape;
 * // Add a new PDF page with page settings
 * page = document.addPage(pageSettings);
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfMargins {
    _left: number;
    _right: number;
    _top: number;
    _bottom: number;
    /**
     * Initializes a new instance of the `PdfMargins` class.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor()
    /**
     * Initializes a new instance with specified margin values for each page side.
     *
     * @param {number} all The margin value for each side of the page.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * pageSettings.margins = new PdfMargins(40);
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(all: number)
    constructor(all?: number) {
        if (typeof all === 'undefined') {
            this._left = this._right = this._top = this._bottom = 40;
        } else {
            this._left = this._right = this._top = this._bottom = all;
        }
    }
    /**
     * Gets the left margin value of the page.
     *
     * @returns {number} Left margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the left margin
     * let left: number = pageSettings.margins.left;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get left(): number {
        return this._left;
    }
    /**
     * Sets the left margin value of the page.
     *
     * @param {number} value Left margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set left(value: number) {
        this._left = value;
    }
    /**
     * Gets the right margin value of the page.
     *
     * @returns {number} Right margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the right margin
     * let right: number = pageSettings.margins.right;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get right(): number {
        return this._right;
    }
    /**
     * Sets the right margin value of the page.
     *
     * @param {number} value - Right margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set right(value: number) {
        this._right = value;
    }
    /**
     * Gets the top margin value of the page.
     *
     * @returns {number} Top margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the top margin
     * let top: number = pageSettings.margins.top;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get top(): number {
        return this._top;
    }
    /**
     *Sets the top margin value of the page.
     *
     * @param {number} value Top margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set top(value: number) {
        this._top = value;
    }
    /**
     * Get the bottom margin value of the page.
     *
     * @returns {number} Bottom margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Gets the bottom margin
     * let bottom: number = pageSettings.margins.bottom;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bottom(): number {
        return this._bottom;
    }
    /**
     * Sets the bottom margin value of the page.
     *
     * @param {number} value Bottom margin.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the margins
     * let margins: PdfMargins = new PdfMargins();
     * margins.left = 40;
     * margins.right = 40;
     * margins.top = 20;
     * margins.bottom = 20;
     * pageSettings.margins = margins;
     * // Sets the page size
     * pageSettings.size = {width: 595, height: 842};
     * // Sets the page orientation
     * pageSettings.orientation = PdfPageOrientation.landscape;
     * // Add a new PDF page with page settings
     * page = document.addPage(pageSettings);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set bottom(value: number) {
        this._bottom = value;
    }
}
/**
 * Public class to provide data for the document split event, including the split index and PDF data.
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * document.splitEvent = documentSplitEvent;
 * // Split PDF document by fixed number of pages
 * document.splitByFixedNumber(1);
 * // Event to invoke while splitting PDF document data
 * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
 *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
 * }
 * // Destroy the document
 * document.destroy();
 */
export class PdfDocumentSplitEventArgs {
    private _index: number;
    private _pdfData: Uint8Array;
    /*
     * Initializes a new instance of the `PdfDocumentSplitEventArgs` class.
     *
     * @param {number} splitIndex The fixed number to split PDF document pages. The default value is 1.
     * @param {Uint8Array} pdfData The byte array of the split PDF document data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *   Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    constructor(splitIndex: number, pdfData: Uint8Array) {
        this._index = splitIndex;
        this._pdfData = pdfData;
    }
    /*
     * Gets the byte array of the PDF document data.
     *
     * @returns {Uint8Array} The byte array of the PDF document data.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    get pdfData(): Uint8Array {
        return this._pdfData;
    }
    /*
     * Gets the split index of the PDF document.
     *
     * @returns {Uint8Array} The index that defines the number of event calls during the PDF document split.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * document.splitEvent = documentSplitEvent;
     * // Split PDF document by fixed number of pages
     * document.splitByFixedNumber(1);
     * // Event to invoke while splitting PDF document data
     * function documentSplitEvent(sender: PdfDocument, args: PdfDocumentSplitEventArgs): void {
     *  Save.save('output_' + args.splitIndex + '.pdf', new Blob([args.pdfData], { type: 'application/pdf' }));
     * }
     * // Destroy the document
     * document.destroy();
     */
    get index(): number {
        return this._index;
    }
}
