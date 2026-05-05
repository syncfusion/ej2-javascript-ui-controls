import { _PdfStream } from './base-stream';
import { _PdfCrossReference } from './pdf-cross-reference';
import { _Linearization } from './pdf-parser';
import { _isWhiteSpace, FormatError, _decode, _getNewGuidString, _isNullOrUndefined, _updatePageSettings, _updatePageCount, _convertDateToString, _convertStringToDate, _getCjkEncoding, _getCjkDescendantFont, _resolveStandardFontFamily, _resolveCjkFontFamily, _bytesToHex } from './utils';
import { _PdfCatalog } from './pdf-catalog';
import { _PdfDictionary, _PdfReference, _isName, _PdfName, _clearPrimitiveCaches } from './pdf-primitives';
import { PdfDestination, PdfPage } from './pdf-page';
import { Save } from '@syncfusion/ej2-file-utils';
import { DataFormat, PdfPermissionFlag, PdfTextAlignment, PdfPageOrientation, PdfRotationAngle, _PdfWordWrapType } from './enumerator';
import { PdfForm } from './form/form';
import { PdfField } from './form/field';
import { PdfBrush, PdfGraphics} from './graphics/pdf-graphics';
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
import { Rectangle, Size } from './pdf-type';
import { validateLicense } from '@syncfusion/ej2-base';
import { PdfUriAnnotation } from './annotations/annotation';
import { _LineInfo, _PdfStringLayouter, _PdfStringLayoutResult } from './fonts/string-layouter';
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
    /**
     * Underlying input/output byte stream of the document.
     *
     * @private
     */
    _stream: _PdfStream;
    /**
     * Cross reference table handler for resolving, writing, and caching indirect objects.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Catalog helper that exposes document level dictionaries like Pages, Outlines, etc.
     *
     * @private
     */
    _catalog: _PdfCatalog;
    /**
     * Internal structure options and cross reference writing settings.
     *
     * @private
     */
    _fileStructure: PdfFileStructure;
    private _headerSignature: Uint8Array = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
    private _startXrefSignature: Uint8Array = new Uint8Array([0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66]);
    private _endObjSignature: Uint8Array = new Uint8Array([0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a]);
    private _version: string = '';
    /**
     * Cache of instantiated `PdfPage` objects keyed by page index.
     *
     * @private
     */
    _pages: Map<number, PdfPage>;
    private _linear: _Linearization;
    /**
     * Cached document page count.
     *
     * @private
     */
    _pageCount: number;
    private _flatten: boolean;
    /**
     * Effective permission flags for the current document.
     *
     * @private
     */
    _permissions: PdfPermissionFlag = PdfPermissionFlag.default;
    /**
     * Form object wrapper for interacting with AcroForm fields.
     *
     * @private
     */
    _form: PdfForm;
    /**
     * Root bookmark outline of the document.
     *
     * @private
     */
    _bookmarkBase: PdfBookmarkBase;
    /**
     * Named destinations collection helper.
     *
     * @private
     */
    _namedDestinationCollection: _PdfNamedDestinationCollection;
    /**
     * Indicates whether the source document is encrypted.
     *
     * @private
     */
    _isEncrypted: boolean = false;
    /**
     * Indicates whether a user password was used to decrypt the document.
     *
     * @private
     */
    _isUserPassword: boolean = false;
    /**
     * Indicates whether only a user password is present for the document.
     *
     * @private
     */
    _hasUserPasswordOnly: boolean = false;
    /**
     * Indicates whether only attachments should be encrypted.
     *
     * @private
     */
    _encryptOnlyAttachment: boolean = false;
    /**
     * Indicates whether metadata needs to be encrypted.
     *
     * @private
     */
    _encryptMetaData: boolean = false;
    /**
     * Indicates whether the current operation is an export action (annotations/forms).
     *
     * @private
     */
    _isExport: boolean = false;
    private _allowCustomData: boolean = false;
    /**
     * Lookup table mapping pages to associated bookmark nodes for quick updates.
     *
     * @private
     */
    _bookmarkHashTable: Map<PdfPage, PdfBookmarkBase[]>;
    /**
     * Target insertion index used during import/merge operations.
     *
     * @private
     */
    _targetIndex: number;
    /**
     * Indicates that the current import operation is duplicating an existing page.
     *
     * @private
     */
    _isDuplicatePage: boolean = false;
    /**
     * Cache of merge helpers keyed by source document unique id.
     *
     * @private
     */
    _mergeHelperCache: Map<string, _PdfMergeHelper>;
    /**
     * Indicates that the current document is used during a split operation.
     *
     * @private
     */
    _uniqueID: string;
    /**
     * Indicates that the current document is used during a split operation.
     *
     * @private
     */
    _isSplitDocument: boolean = false;
    private _layers: PdfLayerCollection;
    /**
     * Optional content configuration dictionary references.
     *
     * @private
     */
    _optionalContentDictionaries: _PdfReference[] = [];
    /**
     * Optional content order array of OCG/OCMD references.
     *
     * @private
     */
    _order: (_PdfReference | _PdfReference[])[] = [];
    /**
     * Optional content groups to be set ON.
     *
     * @private
     */
    _on: _PdfReference[] = [];
    /**
     * Optional content groups to be set OFF.
     *
     * @private
     */
    _off: _PdfReference[] = [];
    /**
     * Optional content group/intent relationships.
     *
     * @private
     */
    _as: _PdfReference[] = [];
    /**
     * Optional content groups to be printed.
     *
     * @private
     */
    _printLayer: _PdfReference[] = [];
    /**
     * Indicates whether the document was loaded from an existing byte source.
     *
     * @private
     */
    _isLoaded: boolean = true;
    /**
     * Cache of created font primitives keyed by computed hash or descriptor.
     *
     * @private
     */
    _fontCollection: Map<string, _PdfFontPrimitive>;
    /**
     * Parsed positions of "startxref" markers encountered during reading.
     *
     * @private
     */
    _startXRefParsedCache: number[];
    private _revisions: number[];
    _isFormImport: boolean = false;
    /*
     * An event triggered during the splitting process, providing access to split PDF data and split index.
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
     * ```
     *
     * @returns Nothing.
     */
    public splitEvent: Function;
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
    public constructor()
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
    public constructor(data: string)
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
    public constructor(data: string, password: string)
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
    public constructor(data: Uint8Array)
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
    public constructor(data: Uint8Array, password: string)
    public constructor(data?: string | Uint8Array, password?: string) {
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
    /**
     * Gets whether custom data import is allowed.
     *
     * @private
     * @returns {boolean} `true` if importing custom data is allowed; otherwise, `false`.
     */
    get _allowImportCustomData(): boolean {
        return this._allowCustomData;
    }
    /**
     * Sets whether custom data import is allowed.
     *
     * @private
     * @param {boolean} value `true` to allow custom data import; otherwise, `false`.
     */
    set _allowImportCustomData(value: boolean) {
        this._allowCustomData = value;
    }
    /**
     * Gets the parsed linearization information if available.
     *
     * @private
     * @returns {_Linearization} The linearization helper if the document is linearized; otherwise, `undefined`.
     */
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
    /**
     * Locates and returns the byte offset of the startxref section.
     *
     * @private
     * @returns {number} The position of the last `startxref` marker; otherwise, 0 if not found.
     */
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
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Retrieve all revision indexes of the PDF document
     * let revisions: number[] = document.getRevisions();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number[]} - The list of revisions in the document.
     */
    public getRevisions(): number[] {
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
     *
     * @param {PdfFontFamily} fontFamily The font family.
     * @param {number} size The font size.
     * @param {PdfFontStyle } style The font style.
     * @returns {PdfStandardFont} The embedded font object.
     */
    public embedFont(fontFamily: PdfFontFamily, size: number, style: PdfFontStyle): PdfStandardFont;
    /**
     * Embed a Cjk font into the PDF document.
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
     *
     * @param {PdfCjkFontFamily} fontFamily The Cjk font family.
     * @param {number} size The font size.
     * @param {PdfFontStyle} style The font style.
     * @param {boolean} isCjk Set to true by default to embed the font as a CJK font.
     * @returns {PdfCjkStandardFont} The embedded font object.
     */
    public embedFont(fontFamily: PdfCjkFontFamily, size: number, style: PdfFontStyle, isCjk: true): PdfCjkStandardFont;
    /**
     * Embed a true type font into the PDF document.
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
     *
     * @param {Uint8Array} fontData The font data as byte array.
     * @param {number} size The font size.
     * @param {object} options Optional object containing font style options.
     * @param {boolean} options.shouldUnderline Indicates whether the font should be rendered with an underline style.
     * @param {boolean} options.shouldStrikeout Indicates whether the font should be rendered with a strikeout style.
     * @return {PdfTrueTypeFont} The embedded font object.
     */
    public embedFont(fontData: Uint8Array, size: number, options?: {shouldUnderline?: boolean, shouldStrikeout?: boolean}): PdfTrueTypeFont;
    /**
     * Embed a true type font into the PDF document.
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
     *
     * @param {string } fontData The font data as base64 string.
     * @param {number} size The font size.
     * @param {object} options Optional object containing font style options.
     * @param {boolean} options.shouldUnderline Indicates whether the font should be rendered with an underline style.
     * @param {boolean} options.shouldStrikeout Indicates whether the font should be rendered with a strikeout style.
     * @return {PdfTrueTypeFont} The embedded font object.
     */
    public embedFont(fontData: string, size: number, options?: {shouldUnderline?: boolean, shouldStrikeout?: boolean}): PdfTrueTypeFont;
    public embedFont(arg1: PdfFontFamily | PdfCjkFontFamily | Uint8Array | string,
                     arg2: PdfFontStyle | number,
                     arg3: number | boolean | { shouldUnderline?: boolean; shouldStrikeout?: boolean },
                     arg4?: number | boolean): PdfFont {
        let key: string;
        let primitive: _PdfFontPrimitive;
        if (typeof arg1 === 'string' || arg1 instanceof Uint8Array) {
            const fontData: Uint8Array = typeof arg1 === 'string' ? _decode(arg1) as Uint8Array : arg1;
            key = this._computeFontHash(fontData);
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
            const trueTypeFont: PdfTrueTypeFont = new PdfTrueTypeFont(fontData, size, style, primitive);
            trueTypeFont._document = this;
            return trueTypeFont;
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
    /**
     * Creates or retrieves a font primitive for the specified key and font data.
     *
     * @private
     * @param {string} key Unique key used to cache the font primitive.
     * @param {_FontData} fontData Font descriptor and/or data used to build a font primitive.
     * @returns {_PdfFontPrimitive} The created or cached font primitive.
     */
    _getOrCreateFontPrimitive(key: string, fontData: _FontData): _PdfFontPrimitive {
        if (typeof key === 'string' && this._fontCollection.has(key)) {
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
    /**
     * Creates a concrete `PdfFont` from a font primitive and style/size.
     *
     * @private
     * @param {_PdfFontPrimitive} primitive The source font primitive.
     * @param {number} size The font size.
     * @param {PdfFontStyle} style The font style.
     * @returns {PdfFont} The created font wrapper object.
     */
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
        font._document = this;
        return font;
    }
    /**
     * Computes a stable hash for font data (MD5 hex).
     *
     * @private
     * @param {Uint8Array} fontData Raw font bytes.
     * @returns {string} Hex-encoded MD5 hash of the font bytes.
     */
    _computeFontHash(fontData: Uint8Array): string {
        const md5: _MD5 = new _MD5();
        const hashBytes: Uint8Array = md5.hash(fontData, 0, fontData.length);
        return _bytesToHex(hashBytes);
    }
    /**
     * Gets the `PdfPage` at the specified index.
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
     *
     * @param {number} pageIndex Page index.
     * @returns {PdfPage} PDF page at the specified index.
     */
    public getPage(pageIndex: number): PdfPage {
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
     *
     * @returns {PdfPage} PDF page at the specified index.
     */
    public addPage(): PdfPage
    /**
     * Creates a new page with default settings and inserts it into the collection at the specified page index.
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
     *
     * @param {number} index Page index.
     * @returns {PdfPage} PDF page at the specified index.
     */
    public addPage(index: number): PdfPage
    /**
     * Creates a new page with specified page settings and adds it to the collection.
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
     *
     * @param {PdfPageSettings} pageSettings Page settings.
     * @returns {PdfPage} PDF page at the specified index.
     */
    public addPage(pageSettings: PdfPageSettings): PdfPage
    /**
     * Creates a new page with specified page settings and inserts it into the collection at the specified page index.
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
     *
     * @param {number} index Page index.
     * @param {PdfPageSettings} pageSettings Page settings.
     * @returns {PdfPage} PDF page at the specified index.
     */
    public addPage(index: number, pageSettings: PdfPageSettings): PdfPage
    public addPage(arg1?: number | PdfPageSettings, arg2?: PdfPageSettings): PdfPage {
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
     *
     * @returns {PdfSection} section of document
     */
    public addSection(): PdfSection
    /**
     * Creates a new section with custom page settings.
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
     *
     * @param {PdfPageSettings} settings Settings of the section.
     * @returns {PdfSection} section of document
     */
    public addSection(settings: PdfPageSettings): PdfSection
    public addSection(settings ?: PdfPageSettings): PdfSection {
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
     *
     * @param {PdfPage} page The page to remove.
     */
    public removePage(page: PdfPage): void
    /**
     * Removes the page from the specified index.
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
     *
     * @param {number} index The page index to remove.
     */
    public removePage(index: number): void
    public removePage(argument: PdfPage | number): void {
        const targetPage: PdfPage = (argument instanceof PdfPage) ? argument : this.getPage(argument);
        this._removePage(targetPage);
    }
    /**
     * Gets the document information of the PDF.
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
     *
     * @returns {PdfDocumentInformation} Document information.
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
     *
     * @param {PdfDocumentInformation} information Fields to set.
     * @returns {void} Returns nothing.
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
    /**
     * Writes a string value into the document information dictionary.
     *
     * @private
     * @param {_PdfDictionary} dict Target dictionary.
     * @param {string} key Info key to update.
     * @param {string} [value] String value to write if defined.
     * @returns {void} nothing.
     */
    _writeInfoString(dict: _PdfDictionary, key: string, value?: string): void {
        if (value !== null && typeof value === 'string') {
            dict.update(key, value);
        }
    }
    /**
     * Writes a date value into the document information dictionary.
     *
     * @private
     * @param {_PdfDictionary} dict Target dictionary.
     * @param {string} key Info key to update.
     * @param {Date} [value] Date value to write if provided.
     * @returns {void} nothing.
     */
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
    /**
     * Validates a page index against the current page count.
     *
     * @private
     * @param {number} index Zero-based page index to validate.
     * @returns {void} nothing.
     */
    _checkPageNumber(index: number): void {
        if (index < 0 || index > this.pageCount) {
            throw new Error('Index out of range');
        }
    }
    /**
     * Rebuilds the pages cache after insertion or removal and updates page indices.
     *
     * @private
     * @param {number} index The index at which pages were inserted or removed.
     * @param {boolean} [isIncrement=true] Set to `true` when inserting; set to `false` when removing.
     * @returns {void} nothing.
     */
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
    /**
     * Removes the specified page and updates bookmarks, templates, form fields, and page tree.
     *
     * @private
     * @param {PdfPage} pageToRemove The page to remove from the document.
     * @returns {void} nothing.
     */
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
    /**
     * Removes a page reference from its parents Kids array and updates page counts accordingly.
     *
     * @private
     * @param {_PdfReference} referenceToRemove The page indirect reference to remove.
     * @param {_PdfDictionary} dictionary The page dictionary whose parent will be updated.
     * @returns {void} nothing.
     */
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
    /**
     * Builds and returns a map of pages to the bookmarks that reference them.
     *
     * @private
     * @returns {Map<PdfPage, PdfBookmarkBase[]>} A map of pages to associated bookmark nodes.
     */
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
    /**
     * Removes template/name entries associated with the specified page from the names dictionary.
     *
     * @private
     * @param {PdfPage} page The page whose template/name entries should be removed.
     * @returns {void} nothing.
     */
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
    /**
     * Removes entries from a particular names tree (by key) that reference the specified page.
     *
     * @private
     * @param {_PdfDictionary} dictionary The root names dictionary.
     * @param {string} key The names tree key to update (for example, 'Pages' or 'Templates').
     * @param {PdfPage} page The page used to filter out entries.
     * @returns {void} nothing.
     */
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
    /**
     * Returns a filtered Names array with entries for the specified page removed.
     *
     * @private
     * @param {_PdfDictionary[]} namedPages The original Names array entries.
     * @param {PdfPage} page The page whose entries should be removed.
     * @returns {_PdfDictionary[]} The updated Names array without the specified page entries.
     */
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
     *
     * @param {number[]} orderArray The page sequence to arrange the pages.
     * @returns {void} Nothing.
     */
    public reorderPages(orderArray: number[]): void {
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
    /**
     * Returns a distinct array preserving the first occurrence order.
     *
     * @private
     * @param {number[]} order Array of page indexes to deduplicate.
     * @returns {number[]} The deduplicated array in original order.
     */
    _sortedArray(order: number[]): number[] {
        const sortedArray: number[] = [];
        order.forEach((num: number) => {
            if (sortedArray.indexOf(num) === -1) {
                sortedArray.push(num);
            }
        });
        return sortedArray;
    }
    /**
     * Clones resource dictionaries from source to target, merging entries where appropriate.
     *
     * @private
     * @param {_PdfDictionary} source Source resource dictionary.
     * @param {_PdfDictionary} target Target page/section dictionary to receive merged resources.
     * @returns {void} nothing.
     */
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
    /**
     * Merges nested resource entries (dictionaries or arrays) into a target resource dictionary.
     *
     * @private
     * @param {string} key Resource key to merge.
     * @param {any} value Incoming resource value (dictionary or array).
     * @param {_PdfDictionary} resourceDictionary Target resource dictionary to update.
     * @returns {void} nothing.
     */
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
     * Saves the modified document synchronously.
     *
     * @remarks
     * This method does **not** support embedding a timestamped digital signature.
     * To embed a timestamp from a trusted timestamp authority (TSA), use the asynchronous saveAsync() method.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Save the document
     * let data: Uint8Array = document.save();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Uint8Array} Saved PDF data as byte array.
     */
    public save(): Uint8Array
    /**
     * Saves the modified document to the specified filename.
     *
     * @remarks
     * This method does **not** support embedding a timestamped digital signature.
     * To embed a timestamp from a trusted timestamp authority (TSA), use the asynchronous saveAsync(filename) method.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Save the document
     * document.save('Output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {string} filename Specifies the filename to save the output pdf document.
     * @returns {void}
     */
    public save(filename: string): void
    public save(filename?: string): Uint8Array | void {
        if (!this._isLoaded && this.pageCount === 0) {
            this.addSection().addPage();
        }
        this._doPostProcess(this._flatten);
        if (!validateLicense('pdf')) {
            this._addWatermarkText();
        }
        if (typeof filename === 'string') {
            Save.save(filename, new Blob([this._crossReference._save()], { type: 'application/pdf' }));
        } else {
            return this._crossReference._save();
        }
    }
    /**
     * Saves the PDF document asynchronously and returns the resulting bytes.
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
     * const data = await document.saveAsync();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Promise<Uint8Array>} The saved PDF data as a byte array.
     */
    public async saveAsync(): Promise<Uint8Array>
    /**
     * Saves the PDF document asynchronously to the specified filename.
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
     * @param {string} filename The target filename to write the output PDF.
     * @returns {Promise<void>} Resolves when the file has been saved.
     */
    public async saveAsync(filename: string): Promise<void>
    public async saveAsync(filename?: string): Promise<void | Uint8Array> {
        if (!this._isLoaded && this.pageCount === 0) {
            this.addSection().addPage();
        }
        await Promise.resolve(this._doPostProcess(this._flatten));
        if (typeof filename === 'string') {
            const pdfBytes: Uint8Array = await this._crossReference._saveAsync();
            await Promise.resolve(
                Save.save(filename, new Blob([pdfBytes], { type: 'application/pdf' }))
            );
        } else {
            return await this._crossReference._saveAsync();
        }
    }
    /**
     * Saves the document to the specified output stream and return the stream as Blob.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Save the document
     * let data: Promise<{ blobData: Blob }> = document.saveAsBlob();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Promise<{ blobData: Blob }>} Saved PDF data as `Blob`.
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
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the annotations from the PDF document.
     * let data: Uint8Array = document.exportAnnotations();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Uint8Array} Exported annotation data as byte array.
     */
    public exportAnnotations(): Uint8Array
    /**
     * Exports the annotations from the PDF document.
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
     *
     * @param {PdfAnnotationExportSettings} settings Annotation export settings.
     * @returns {Uint8Array} Exported annotation data as byte array.
     */
    public exportAnnotations(settings: PdfAnnotationExportSettings): Uint8Array
    /**
     * Exports the annotations from the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the annotations from the PDF document.
     * document.exportAnnotations('annotations.xfdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {string} filename Output file name.
     * @returns {void} Exports the annotations from the PDF document.
     */
    public exportAnnotations(filename: string): void
    /**
     * Exports the annotations from the PDF document.
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
     *
     * @param {string} filename Output file name.
     * @param {PdfAnnotationExportSettings} settings Annotation export settings.
     * @returns {void} Exports the annotations from the PDF document.
     */
    public exportAnnotations(filename: string, settings: PdfAnnotationExportSettings): void
    public exportAnnotations(arg1?: string | PdfAnnotationExportSettings, arg2?: PdfAnnotationExportSettings): Uint8Array | void {
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
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Exports the form data from the PDF document.
     * let data: Uint8Array = document.exportFormData();
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {Uint8Array} Exported form data as byte array.
     */
    public exportFormData(): Uint8Array
    /**
     * Exports the form data from the PDF document.
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
     *
     * @param {PdfFormFieldExportSettings} settings Form field export settings.
     * @returns {Uint8Array} Exported form data as byte array.
     */
    public exportFormData(settings: PdfFormFieldExportSettings): Uint8Array
    /**
     * Exports the form data from the PDF document.
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
     *
     * @param {string} filename Output file name.
     * @returns {void} Exports the form data from the PDF document.
     */
    public exportFormData(filename: string): void
    /**
     * Exports the form data from the PDF document.
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
     *
     * @param {string} filename Output file name.
     * @param {PdfFormFieldExportSettings} settings Form field export settings.
     * @returns {void} Exports the form data from the PDF document.
     */
    public exportFormData(filename: string, settings: PdfFormFieldExportSettings): void
    public exportFormData(arg1?: string | PdfFormFieldExportSettings, arg2?: PdfFormFieldExportSettings): Uint8Array | void {
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
     *
     * @param {string} data annotations data as base64 string.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the annotations to the PDF document.
     */
    public importAnnotations(data: string, dataFormat: DataFormat): void
    /**
     * Imports the annotations from the PDF document.
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
     *
     * @param {Uint8Array} data annotations data as byte array.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the annotations to the PDF document.
     */
    public importAnnotations(data: Uint8Array, dataFormat: DataFormat): void
    public importAnnotations(data: string | Uint8Array, dataFormat: DataFormat): void {
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
     *
     * @param {string} data Form data as base64 string.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the form data to the PDF document.
     */
    public importFormData(data: string, dataFormat: DataFormat): void
    /**
     * Imports the form data from the PDF document.
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
     *
     * @param {Uint8Array} data Form data as byte array.
     * @param {DataFormat} dataFormat Data format of the input data.
     * @returns {void} Imports the form data to the PDF document.
     */
    public importFormData(data: Uint8Array, dataFormat: DataFormat): void
    public importFormData(data: string | Uint8Array, dataFormat: DataFormat): void {
        if (this._form && this._form._requiresPostProcessing) {
            this._doPostProcessOnFormFields();
        }
        this._isFormImport = true;
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
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {void} Nothing.
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
    /**
     * Lazily retrieves the named destination collection from the document catalog.
     *
     * @private
     * @returns {_PdfNamedDestinationCollection} The named destination collection.
     */
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
    /**
     * Retrieves the linearization page dictionary and reference for the given page index.
     *
     * @private
     * @param {number} pageIndex - The zero-based index of the page to retrieve.
     * @returns {{dictionary: _PdfDictionary, reference: _PdfReference}} returns reference .
     */
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
    /**
     * Validates and reads the document header to determine the PDF version and update file structure.
     *
     * @private
     * @returns {void} nothing.
     */
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
    /**
     * Parses cross-reference sections and builds the catalog.
     *
     * @private
     * @param {boolean} recoveryMode Set `true` to enable fallback parsing strategies.
     * @returns {void} nothing.
     */
    _parse(recoveryMode: boolean): void {
        this._crossReference._parse(recoveryMode);
        this._catalog = new _PdfCatalog(this._crossReference);
        if (this._catalog.version) {
            this._version = this._catalog.version;
        }
    }
    /**
     * Searches the given stream for a signature within a byte limit.
     *
     * @private
     * @param {_PdfStream} stream The stream to scan.
     * @param {Uint8Array} signature The byte signature to locate.
     * @param {number} [limit=1024] Max number of bytes to scan.
     * @param {boolean} [backwards=false] If `true`, scans from the end backwards.
     * @returns {boolean} `true` if the signature is found; otherwise, `false`.
     */
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
    /**
     * Performs post-processing for forms and annotations, optionally flattening them.
     *
     * @private
     * @param {boolean} [isFlatten=false] Set `true` to flatten annotations and form fields.
     * @returns {void} nothing.
     */
    _doPostProcess(isFlatten: boolean = false): void {
        this._doPostProcessOnFormFields(isFlatten);
        this._doPostProcessOnAnnotations(isFlatten);
    }
    /**
     * Finalizes form fields, optionally flattening and updating appearance flags.
     *
     * @private
     * @param {boolean} [isFlatten=false] Set `true` to flatten form fields.
     * @returns {void} nothing.
     */
    _doPostProcessOnFormFields(isFlatten: boolean = false) : void {
        if (this._catalog._catalogDictionary.has('AcroForm')) {
            this.form._doPostProcess(isFlatten);
            this.form._requiresPostProcessing = false;
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
    /**
     * Finalizes annotations for all pages, optionally flattening them.
     *
     * @private
     * @param {boolean} [isFlatten=false] Set `true` to flatten annotations.
     * @returns {void} nothing.
     */
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
    /**
     * Adds the evaluation watermark text to all pages when license validation fails.
     *
     * @private
     * @returns {void} nothing.
     */
    _addWatermarkText(): void {
        for (let i: number = 0; i < this.pageCount; i++) {
            this._addLincenseWaterMark(this.getPage(i), i === 0, i === this.pageCount - 1);
        }
    }
    /**
     * Add license watermark on the page.
     *
     * @private
     * @param { PdfPage } page PDF-page.
     * @param { boolean } isFirstPage It denotes it is a first page or not.
     * @param { boolean } isLastPage It denotes it is a last page or not.
     * @returns { void } Returns void
     */
    private _addLincenseWaterMark(page: PdfPage, isFirstPage: boolean, isLastPage: boolean): void {
        const diagonalText: string = 'Created with a trial version of Syncfusion PDF library.';
        const formatCenter: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
        let fontSize: number = 14;
        const graphics: PdfGraphics = page.graphics;
        const clientSize: Size = graphics.clientSize;
        if (page.size.width < 400) {
            fontSize = page.size.width * 0.035;
        }
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, fontSize, PdfFontStyle.regular);
        if (isFirstPage) {
            this._drawWatermarkOnPage(page, font, graphics, false);
        } else if (isLastPage) {
            this._drawWatermarkOnPage(page, font, graphics, true);
        }
        const textSize: Size = font.measureString(diagonalText, clientSize.width);
        const centerX: number = clientSize.width / 2;
        const centerY: number = clientSize.height / 2;
        graphics.save();
        if (!page._isNew && (page.rotation === PdfRotationAngle.angle90)) {
            graphics.translateTransform({ x: centerY, y: centerX });
        } else {
            graphics.translateTransform({ x: centerX, y: centerY });
        }
        graphics.setTransparency(0.5);
        if (page._isNew) {
            switch (page.rotation) {
            case PdfRotationAngle.angle90:
                graphics.rotateTransform(-135);
                break;
            case PdfRotationAngle.angle180:
                graphics.rotateTransform(-225);
                break;
            case PdfRotationAngle.angle270:
                graphics.rotateTransform(-315);
                break;
            default:
                graphics.rotateTransform(-45);
                break;
            }
        } else {
            graphics.rotateTransform(-45);
        }
        const x: number = textSize.width / 2;
        const y: number = textSize.height / 2;
        const x1: number = centerX - x;
        graphics.drawString(
            diagonalText,
            font,
            { x: -x, y: -(y / 2), width: clientSize.width - (x1 + x1), height: textSize.height },
            new PdfBrush({ r: 255, g: 0, b: 0 }),
            formatCenter
        );
        graphics.restore();
        graphics.restore();
    }
    /**
     * Draw the watermark in the header and footer of the page.
     *
     * @private
     * @param { PdfPage } page PDF-page.
     * @param { PdfStandardFont } font It denotes the font for the text added.
     * @param { PdfGraphics } graphics It denotes the graphis of the page.
     * @param { boolean } isLastPage It denotes it is a last page or not.
     * @returns { void } Returns voidgulp
     */
    private _drawWatermarkOnPage(page: PdfPage, font: PdfStandardFont, graphics: PdfGraphics, isLastPage: boolean): void {
        const watermarkHeaderText: string = 'Created with a trial version of Syncfusion PDF library or registered the wrong key in your application. To obtain the valid key, Click';
        const watermarkLinkText: string = 'here';
        const xPosition: number = 40;
        const yPostion: number = 10;
        const rotation: PdfRotationAngle = page.rotation;
        let size: Size =  page._isNew && (rotation === PdfRotationAngle.angle270 || rotation === PdfRotationAngle.angle90)
            ? {width: graphics.clientSize.width, height: graphics.clientSize.height - 70}
            : {width: graphics.clientSize.width - 70, height: graphics.clientSize.height};
        if (!page._isNew && (rotation === PdfRotationAngle.angle270 || rotation === PdfRotationAngle.angle90)) {
            size = { width: page.size.height - 70, height: page.size.width };
        }
        const textFormat: PdfStringFormat = new PdfStringFormat();
        textFormat._wordWrap = _PdfWordWrapType.word;
        const redBrush: PdfBrush = new PdfBrush({ r: 255, g: 0, b: 0 });
        const blueBrush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        const headerSize: Size = font.measureString(watermarkHeaderText);
        const linkSize: Size = font.measureString(watermarkLinkText);
        const lineHeight: number = headerSize.height;
        const availableWidth: number = (page._isNew && (rotation === PdfRotationAngle.angle270 || rotation === PdfRotationAngle.angle90))
            ? size.height : size.width;
        let currentX: number = rotation === PdfRotationAngle.angle90 && page._isNew ? xPosition - 70 : xPosition ;
        let currentY: number = isLastPage
            ? (page._isNew && (rotation === PdfRotationAngle.angle270 || rotation === PdfRotationAngle.angle90)
                ? size.width : size.height) - (page.orientation === PdfPageOrientation.landscape &&
                page.size.width === 420 || page.size.height === 420 ? lineHeight * 4 : lineHeight * 3) - yPostion : yPostion;
        if (page._isNew) {
            if (page.rotation !== PdfRotationAngle.angle0) {
                graphics.save();
                if (rotation === PdfRotationAngle.angle90) {
                    graphics.rotateTransform(-90);
                } else if (rotation === PdfRotationAngle.angle180) {
                    graphics.rotateTransform(-180);
                } else if (rotation === PdfRotationAngle.angle270) {
                    graphics.rotateTransform(-270);
                }
            }
        }
        const adjustBoundsForRotation: (rect: Rectangle) => Rectangle = (rect: Rectangle): Rectangle => {
            if (page._isNew) {
                if (rotation === PdfRotationAngle.angle90) {
                    return {
                        x: -(size.height - rect.x),
                        y: rect.y,
                        width: rect.height - xPosition,
                        height: rect.width
                    };
                }
                if (rotation === PdfRotationAngle.angle180) {
                    return {
                        x: -(graphics.clientSize.width - rect.x),
                        y: -(size.height - rect.y),
                        width: rect.width - xPosition,
                        height: rect.height
                    };
                }
                if (rotation === PdfRotationAngle.angle270) {
                    return {
                        x: rect.x,
                        y: -(size.width - rect.y),
                        width: rect.height - xPosition,
                        height: rect.width
                    };
                }
            }
            return rect;
        };
        const headerBounds: Rectangle = adjustBoundsForRotation({
            x: currentX,
            y: currentY,
            width: size.width,
            height: size.height
        });
        graphics.drawString(
            watermarkHeaderText,
            font,
            headerBounds,
            redBrush,
            textFormat
        );
        const layouter: _PdfStringLayouter = new _PdfStringLayouter();
        const headerLayoutResult: _PdfStringLayoutResult =
            layouter._layout(watermarkHeaderText, font, textFormat, [headerBounds.width, headerBounds.height]);
        const headerLines: _LineInfo[] = headerLayoutResult._layoutLines;
        const lastLine: _LineInfo = headerLines[headerLines.length - 1];
        currentX += lastLine._width + 5;
        if (headerLayoutResult._lineCount >= 2 ) {
            currentY += headerLayoutResult._lineHeight * (headerLayoutResult._lineCount - 1);
        }
        if (currentX + linkSize.width > availableWidth) {
            currentX = xPosition;
            currentY += headerLayoutResult._lineHeight;
        }
        const linkRect: Rectangle = {
            x: currentX,
            y: currentY,
            width: linkSize.width,
            height: linkSize.height
        };
        const rotatedLinkRect: Rectangle = adjustBoundsForRotation(linkRect);
        rotatedLinkRect.width += 70;
        graphics.drawString(
            watermarkLinkText,
            font,
            rotatedLinkRect,
            blueBrush,
            textFormat
        );
        rotatedLinkRect.width -= 70;
        let annotationRect: Rectangle;
        if (page._isNew) {
            switch (rotation) {
            case PdfRotationAngle.angle0:
                annotationRect = { ...linkRect };
                break;
            case PdfRotationAngle.angle90:
                annotationRect = {
                    x: linkRect.y,
                    y: size.height - linkRect.x - linkRect.width,
                    width: linkRect.height,
                    height: linkRect.width
                };
                break;
            case PdfRotationAngle.angle180:
                annotationRect = {
                    x: size.width - linkRect.x + 40,
                    y: size.height - linkRect.y - linkRect.height,
                    width: linkRect.width,
                    height: linkRect.height
                };
                break;
            case PdfRotationAngle.angle270:
                annotationRect = {
                    x: size.width - linkRect.y - linkRect.height,
                    y: linkRect.x,
                    width: linkRect.height,
                    height: linkRect.width
                };
                break;
            }
        } else {
            switch (rotation) {
            case PdfRotationAngle.angle0:
                annotationRect = { ...linkRect };
                break;
            case PdfRotationAngle.angle90:
                annotationRect = {
                    x: linkRect.y,
                    y: page.size.height - linkRect.x - linkRect.width,
                    width: linkRect.height,
                    height: linkRect.width
                };
                break;
            case PdfRotationAngle.angle180:
                annotationRect = {
                    x: page.size.width - linkRect.x - linkRect.width,
                    y: page.size.height - linkRect.y - linkRect.height,
                    width: linkRect.width,
                    height: linkRect.height
                };
                break;
            case PdfRotationAngle.angle270:
                annotationRect = {
                    x: page.size.width - linkRect.y - linkRect.height,
                    y: linkRect.x,
                    width: linkRect.height,
                    height: linkRect.width
                };
                break;
            }
        }
        const linkAnnotation: PdfUriAnnotation = new PdfUriAnnotation(annotationRect, 'http://www.syncfusion.com');
        linkAnnotation.border.width = 0;
        linkAnnotation.border.hRadius = 0;
        linkAnnotation.border.vRadius = 0;
        page.annotations.add(linkAnnotation);
        linkAnnotation._doPostProcess();
        if (page.rotation !== PdfRotationAngle.angle0 && page._isNew) {
            graphics.restore();
        } else {
            graphics.save();
        }
    }
    /**
     * Import the pages specified by the start and end index into the current document's pages collection.
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
     *
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @param {number} startIndex Start page index. The default value is 0.
     * @param {number} endIndex End page index. The default value is the index of the last page in the source document.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     */
    public importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number): void
    /**
     * Import the pages specified by start and end index into the current document's pages collection.
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
     *
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @param {number} startIndex Start page index. The default value is 0.
     * @param {number} endIndex End page index. The default value is the index of the last page in the source document.
     * @param {PdfPageImportOptions} options Options to customize the support of import PDF pages.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     */
    public importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number, options?: PdfPageImportOptions): void
    public importPageRange(sourceDocument: PdfDocument, startIndex: number, endIndex: number, options?: PdfPageImportOptions): void {
        if (startIndex > endIndex || startIndex >= sourceDocument.pageCount) {
            throw new Error('The start index is greater then the end index, which might indicate the error in the program.');
        }
        this._importPages(sourceDocument, startIndex, endIndex, options);
    }
    /**
     * Imports pages from the specified source document into this document.
     *
     * @private
     * @param {PdfDocument} sourceDocument - The source PDF document to import pages from.
     * @param {number} startIndex - The starting page index in the source document.
     * @param {number} endIndex - The ending page index in the source document.
     * @param {PdfPageImportOptions} [options] - Optional settings that control import behavior.
     * @returns {void} nothing.
     */
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
        const hasOCProps: boolean = sourceDocument._catalog._catalogDictionary.has('OCProperties');
        if (hasOCProps && (!this._isDuplicatePage || (options && !options.optimizeResources))) {
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
        if (isLayersPresent && (!this._isDuplicatePage || (options && !options.optimizeResources))) {
            helper._importLayers(ocProperties, true);
        }
        helper._objectDispose();
        this._isDuplicatePage = false;
    }
    /**
     * Copy the specific page and insert it as the next page
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
     *
     * @param {number} pageIndex Target page index to import.
     */
    public importPage(index: number): void
    /**
     * Copy the specific page and insert it at the specified target page index and page rotation.
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
     *
     * @param {number} pageIndex Target page index to import.
     * @param {PdfPageImportOptions} options Options to customize the support of import PDF pages.
     */
    public importPage(index: number, options: PdfPageImportOptions): void
    /**
     * Import the specified page into the current document pages collection as the last page
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
     *
     * @param {PdfPage} page Page to import.
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     */
    public importPage(page: PdfPage, sourceDocument: PdfDocument): void
    /**
     * Create a new page with default settings and insert it into the collection at the specified page index.
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
     *
     * @param {PdfPage} page Page to import.
     * @param {PdfDocument} sourceDocument PDF document to get pages to import.
     * @remarks The source document must be disposed of after the destination document is saved during the import function.
     */
    public importPage(page: PdfPage, sourceDocument: PdfDocument, options?: PdfPageImportOptions): void
    public importPage(arg1?: PdfPage | number, arg2?: PdfDocument | PdfPageImportOptions, options?: PdfPageImportOptions): void {
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
     * ```
     *
     * @returns {void} Nothing
     */
    public split(): void {
        this.splitByFixedNumber(1);
    }
    /**
     * Splits the PDF document into parts, each containing a maximum number of pages specified.
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
     * ```
     *
     * @param {number} fixedNumber specifies the maximum number of pages in each split PDF. The default value is 1.
     * @returns {void} Nothing
     */
    public splitByFixedNumber(fixedNumber: number): void {
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
     * ```
     *
     * @param {Array<number[]>} ranges The two dimensional number array specified for start and end page indexes to split PDF documents.
     * @returns {void} Nothing
     */
    public splitByPageRanges(ranges: number[][]): void {
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
    /**
     * Retrieves and initializes a PDF signature instance from the given dictionary and field.
     *
     * @private
     * @param {_PdfDictionary} dictionary - The signature dictionary from the PDF.
     * @param {any} field - The associated form field containing the signature.
     * @returns {PdfSignature} The initialized `PdfSignature` object.
     */
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
    /**
     * @private
     */
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
    /**
     * @private
     */
    _format: DataFormat = DataFormat.xfdf;
    /**
     * @private
     */
    _exportName: string = '';
    /**
     * @private
     */
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
    /**
     * @private
     */
    _size: Size = {width: 595, height: 842};
    /**
     * @private
     */
    _isOrientation: boolean = false;
    /**
     * @private
     */
    _margins: PdfMargins;
    /**
     * @private
     */
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
    public constructor()
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
    public constructor(options: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
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
    public constructor(options?: {orientation?: PdfPageOrientation, size?: Size, margins?: PdfMargins, rotation?: PdfRotationAngle})
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
    /**
     * Updates the page size based on the specified dimensions while respecting the current orientation.
     *
     * @private
     * @param {Size} size Page size with `width` and `height`.
     * @returns {void} nothing.
     */
    _updateSize(size: Size): void
    /**
     * Updates the page size by applying the specified orientation to the current size.
     *
     * @private
     * @param {PdfPageOrientation} orientation Page orientation to apply.
     * @returns {void} nothing.
     */
    _updateSize(orientation: PdfPageOrientation): void
    /**
     * Updates the page size using either a `Size` object or a `PdfPageOrientation`, normalizing width/height accordingly.
     *
     * @private
     * @param {Size | PdfPageOrientation} value The target size or orientation.
     * @returns {void} nothing.
     */
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
    /**
     * Recomputes the page orientation from the current size (portrait if height ≥ width; otherwise landscape).
     *
     * @private
     * @returns {void} nothing.
     */
    _updateOrientation(): void {
        this._orientation = (this._size.height >= this._size.width) ? PdfPageOrientation.portrait : PdfPageOrientation.landscape;
    }
    /**
     * Computes the drawable content size by subtracting margins from the page size.
     *
     * @private
     * @returns {number[]} A two-element array.
     */
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
    /**
     * Left margin value in points.
     *
     * @private
     */
    _left: number;
    /**
     * Right margin value in points.
     *
     * @private
     */
    _right: number;
    /**
     * Top margin value in points.
     *
     * @private
     */
    _top: number;
    /**
     * Bottom margin value in points.
     *
     * @private
     */
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
    public constructor()
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
    public constructor(all: number)
    public constructor(all?: number) {
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
