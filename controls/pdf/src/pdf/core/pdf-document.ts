import { _PdfStream } from './base-stream';
import { _PdfCrossReference } from './pdf-cross-reference';
import { _Linearization } from './pdf-parser';
import { _isWhiteSpace, FormatError, _decode } from './utils';
import { _PdfCatalog } from './pdf-catalog';
import { _PdfDictionary, _PdfReference, _isName, _PdfName, _clearPrimitiveCaches } from './pdf-primitives';
import { PdfDestination, PdfPage } from './pdf-page';
import { Save } from '@syncfusion/ej2-file-utils';
import { DataFormat, PdfPermissionFlag, PdfTextAlignment, PdfPageOrientation, PdfRotationAngle } from './enumerator';
import { PdfForm } from './form/form';
import { PdfField } from './form/field';
import { PdfBrush, PdfGraphics } from './graphics/pdf-graphics';
import { PdfFontFamily, PdfFontStyle, PdfStandardFont } from './fonts/pdf-standard-font';
import { PdfStringFormat, PdfVerticalAlignment } from './fonts/pdf-string-format';
import { _ExportHelper, _XfdfDocument } from './import-export/xfdf-document';
import { _JsonDocument } from './import-export/json-document';
import { _FdfDocument } from './import-export/fdf-document';
import { PdfBookmark, PdfNamedDestination, PdfBookmarkBase, _PdfNamedDestinationCollection } from './pdf-outline';
import { _XmlDocument } from './import-export/xml-document';
import { PdfFileStructure } from './pdf-file-structure';
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
    private _pages: Map<number, PdfPage>;
    private _linear: _Linearization;
    private _pageCount: number;
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
    constructor(data: string | Uint8Array, password?: string) {
        if (!data) {
            throw new Error('PDF data cannot be undefined or null');
        }
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
        if (catalog && catalog._catalogDictionary.has('Outlines')) {
            const outlines: _PdfDictionary = catalog._catalogDictionary.get('Outlines');
            if (outlines) {
                this._bookmarkBase = new PdfBookmarkBase(outlines, this._crossReference);
                if (outlines.has('First')) {
                    this._bookmarkBase._reproduceTree();
                }
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
            promise = _catalog.getPageDictionary(pageIndex);
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
        this._updatePageSettings(sectionDictionary, settings);
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
                this._catalog._topPagesDictionary.update('Kids', [sectionReference]);
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
                        this._updatePageCount(parentDictionary, 1);
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
    _checkPageNumber(index: number): void {
        if (index < 0 || index > this.pageCount) {
            throw new Error('Index out of range');
        }
    }
    _updatePageCount(dictionary: _PdfDictionary, valueToIncrement: number): void {
        dictionary.update('Count', dictionary.get('Count') + valueToIncrement);
        if (dictionary.has('Parent')) {
            const parentDictionary: _PdfDictionary = dictionary.get('Parent');
            if (parentDictionary && parentDictionary.get('Type').name === 'Pages') {
                this._updatePageCount(parentDictionary, valueToIncrement);
            }
        }
    }
    _updatePageSettings(dictionary: _PdfDictionary, settings: PdfPageSettings): void {
        const bounds: number[] = [0, 0, settings.size[0], settings.size[1]];
        dictionary.update('MediaBox', bounds);
        dictionary.update('CropBox', bounds);
        let rotate: number = Math.floor(settings.rotation as number) * 90;
        if (rotate >= 360) {
            rotate = rotate % 360;
        }
        dictionary.update('Rotate', rotate);
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
                for (let i: number = 0; i < bookmarks.length; i++) {
                    const bookmark: PdfBookmarkBase = bookmarks[Number.parseInt(i.toString(), 10)];
                    if (bookmark) {
                        const bookmarkDictionary: _PdfDictionary = bookmark._dictionary;
                        if (bookmarkDictionary) {
                            if (bookmarkDictionary.has('A')) {
                                bookmarkDictionary.update('A', null);
                            }
                            bookmarkDictionary.update('Dest', null);
                        }
                    }
                }
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
    }
    _removeParent(referenceToRemove: _PdfReference, dictionary: _PdfDictionary): void {
        if (dictionary.has('Parent')) {
            const parentReference: _PdfReference = dictionary._get('Parent');
            const parentDictionary: _PdfDictionary = this._crossReference._fetch(parentReference);
            if (parentDictionary && parentDictionary.has('Kids')) {
                let kids: _PdfReference[] = parentDictionary.get('Kids');
                if (kids.length === 1 && parentDictionary && parentDictionary.get('Type').name === 'Pages') {
                    this._removeParent(parentReference, parentDictionary);
                } else {
                    kids = kids.filter((item: _PdfReference) => item !== referenceToRemove);
                    parentDictionary.update('Kids', kids);
                    this._updatePageCount(parentDictionary, -1);
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
                const pageDictionary: _PdfDictionary = namedPages[Number.parseInt(i.toString(), 10)];
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
            this.removePage(pagesToRemove[Number.parseInt(i.toString(), 10)]);
        }
        const newkids: _PdfReference[] = [];
        const newPages: Map<number, PdfPage> = new Map<number, PdfPage>();
        const parentReference: _PdfReference = this._catalog._catalogDictionary._get('Pages');
        for (let i: number = 0; i < sortedArray.length; i++) {
            const indexPage: PdfPage = this.getPage(ascendingOrder.indexOf(sortedArray[Number.parseInt(i.toString(), 10)]));
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
        }
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
     * let xfdf: Uint8Array = document.exportFormData(‘formData.xfdf’);
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
        this._pages.clear();
        this._pages = undefined;
        this._startXrefSignature = undefined;
        this._stream = undefined;
        this._form = undefined;
        _clearPrimitiveCaches();
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
            const obj: any = _crossReference._fetch(ref); // eslint-disable-line
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
            return _catalog.getPageDictionary(pageIndex);
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
                        graphics.drawRectangle(0, 0, page.size[0], 33.75, new PdfBrush([255, 255, 255]));
                        graphics.restore();
                        graphics.save();
                        graphics.setTransparency(0.50);
                        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12, PdfFontStyle.regular);
                        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center, PdfVerticalAlignment.middle);
                        graphics.drawString('Created with a trial version of Syncfusion Essential PDF',
                                            font,
                                            [0, 0, page.size[0], 33.75],
                                            null,
                                            new PdfBrush([0, 0, 0]),
                                            format);
                        graphics.restore();
                    } catch (e) { } // eslint-disable-line
                }
            }
        }
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
     * settings.exportName = ‘JobApplication’.
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
 * pageSettings.size = [595, 842];
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
    _size: number[] = [595, 842];
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
     * pageSettings.size = [595, 842];
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
    constructor() {
        this._orientation = PdfPageOrientation.portrait;
        this._size = [595, 842];
        this._margins = new PdfMargins();
        this._rotation = PdfRotationAngle.angle0;
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
     * pageSettings.size = [842, 595];
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
     * @returns {number[]} The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page
     * let page: PdfPage = document.getPage(0);
     * // Gets the width and height of the PDF page as number array
     * let size: number[] = page.size;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get size(): number[] {
        return this._size;
    }
    /**
     * Sets the width and height of the page.
     *
     * @param {number[]} value The width and height of the page as number array.
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Create a new PDF page settings instance
     * let pageSettings: PdfPageSettings = new PdfPageSettings();
     * // Sets the page size
     * pageSettings.size = [595, 842];
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
    set size(value: number[]) {
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
    _updateSize(size: number[]): void
    _updateSize(orientation: PdfPageOrientation): void
    _updateSize(value: number[] | PdfPageOrientation): void {
        let pageOrientation: PdfPageOrientation;
        let pageSize: number[];
        if (Array.isArray(value)) {
            pageOrientation = this.orientation;
            pageSize = value;
        } else {
            pageOrientation = value;
            pageSize = this._size;
        }
        if (pageOrientation === PdfPageOrientation.portrait) {
            this._size = [Math.min(pageSize[0], pageSize[1]), Math.max(pageSize[0], pageSize[1])];
        } else {
            this._size = [Math.max(pageSize[0], pageSize[1]), Math.min(pageSize[0], pageSize[1])];
        }
    }
    _updateOrientation(): void {
        this._orientation = (this._size[1] >= this._size[0]) ? PdfPageOrientation.portrait : PdfPageOrientation.landscape;
    }
    _getActualSize(): number[] {
        const width: number = this._size[0] - (this._margins._left + this._margins._right);
        const height: number = this._size[1] - (this._margins._top + this._margins._bottom);
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
 * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
     * pageSettings.size = [595, 842];
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
