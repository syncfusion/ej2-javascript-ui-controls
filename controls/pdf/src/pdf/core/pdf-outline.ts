import { PdfDestinationMode, PdfRotationAngle, PdfTextStyle } from './enumerator';
import { _PdfCrossReference } from './pdf-cross-reference';
import { PdfDocument } from './pdf-document';
import { PdfDestination, PdfPage } from './pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';
import { _checkRotation, _getPageIndex, _parseColor } from './utils';
/**
 * Represents a base class for all bookmark objects.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get bookmarks
 * let bookmarks: PdfBookmarkBase = document.bookmarks;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBookmarkBase {
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    _bookMarkList: PdfBookmark[] = [];
    _destination: PdfDestination;
    _color: number[];
    _isExpanded: boolean = false;
    _namedDestination: PdfNamedDestination;
    _namedDestinations: _PdfNamedDestinationCollection;
    _title: string;
    _textStyle: PdfTextStyle;
    _isLoadedBookmark: boolean = false;
    /**
     * Initializes a new instance of the `PdfBookmarkBase` class.
     *
     * @private
     * @param {_PdfDictionary} dictionary Outline dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference.
     *
     */
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference) {
        this._dictionary = dictionary;
        this._crossReference = crossReference;
    }
    /**
     * Gets the bookmark count (Read only).
     *
     * @returns {number} Number of bookmarks.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Get bookmark count
     * let bookmarkCount: number = bookmarks.count;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get count(): number {
        if (this._isLoadedBookmark && this._bookMarkList.length === 0) {
            this._reproduceTree();
        }
        return this._bookMarkList.length;
    }
    /**
     * Gets the `PdfBookmark` at the specified index.
     *
     * @param {number} index Bookmark index.
     * @returns {PdfBookmark} Bookmark at the specified index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Get bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    at(index: number): PdfBookmark {
        let bookmark: PdfBookmark;
        if (index < 0 || index >= this.count) {
            throw Error('Index out of range.');
        }
        if (this._bookMarkList.length > 0 && index < this._bookMarkList.length) {
            bookmark = this._bookMarkList[Number.parseInt(index.toString(), 10)];
        }
        return bookmark;
    }
    /**
     * Gets the boolean flag indicating whether `PdfBookmark` is present or not.
     *
     * @param {PdfBookmark} outline Bookmark.
     * @returns {boolean} whether the bookmark is present or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Get the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the boolean flag indicating whether `PdfBookmark` is present or not.
     * let isPresent: boolean = bookmarks.contains(bookmark);
     * // Destroy the document
     * document.destroy();
     * ```
     */
    contains(outline: PdfBookmark): boolean {
        return this._bookMarkList.indexOf(outline) !== -1;
    }
    _reproduceTree(): void {
        let bookmark: PdfBookmark = this._getFirstBookmark(this);
        let isBookmark: boolean = (bookmark) ? true : false;
        while (isBookmark && bookmark._dictionary) {
            this._bookMarkList.push(bookmark);
            bookmark = bookmark._next;
            isBookmark = (bookmark) ? true : false;
        }
    }
    _getFirstBookmark(bookmarkBase: PdfBookmarkBase): PdfBookmark {
        const bookmarkBaseDictionary: _PdfDictionary = bookmarkBase._dictionary;
        let bookMark: PdfBookmark;
        if (bookmarkBaseDictionary && bookmarkBaseDictionary.has('First')) {
            const bookMarkDictionary: _PdfDictionary = bookmarkBaseDictionary.get('First');
            if (bookMarkDictionary) {
                bookMark = new PdfBookmark(bookMarkDictionary, this._crossReference);
            }
        }
        return bookMark;
    }
}
/**
 * Represents a bookmark in a PDF document
 *
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the bookmarks
 * let bookmarks: PdfBookmarkBase = document.bookmarks;
 * // Gets the bookmark at the specified index
 * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfBookmark extends PdfBookmarkBase {
    /**
     * Initializes a new instance of the `PdfBookmark` class.
     *
     * @private
     * @param {_PdfDictionary} dictionary Bookmark dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference.
     *
     */
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference) {
        super(dictionary, crossReference);
        if (!this._dictionary.has('Dest') && this._dictionary.has('A')) {
            const actionDictionary: _PdfDictionary = this._dictionary.get('A');
            if (actionDictionary && actionDictionary.has('D')) {
                const destinationArray: any[] = actionDictionary.getRaw('D'); // eslint-disable-line
                this._dictionary.update('Dest', destinationArray);
            }
        }
        this._isLoadedBookmark = true;
    }
    /**
     * Gets the destination (Read only).
     *
     * @returns {PdfDestination} Page destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the destination
     * let destination: PdfDestination = bookmark.destination;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destination(): PdfDestination {
        let value: PdfDestination;
        const namedDestination: PdfNamedDestination = this._obtainNamedDestination();
        if (namedDestination === null || typeof namedDestination === 'undefined') {
            value = this._obtainDestination();
        }
        return value;
    }
    /**
     * Gets the named destination (Read only).
     *
     * @returns {PdfNamedDestination} Named destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the named destination
     * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get namedDestination(): PdfNamedDestination {
        if (this._namedDestination === null || typeof this._namedDestination === 'undefined') {
            this._namedDestination = this._obtainNamedDestination();
        }
        return this._namedDestination;
    }
    /**
     * Gets the bookmark title (Read only).
     *
     * @returns {string} Bookmark title.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the bookmark title
     * let bookmarkTitle: string = bookmark.title;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get title(): string {
        if (this._title === null || typeof this._title === 'undefined') {
            this._title = this._obtainTitle();
        }
        return this._title;
    }
    /**
     * Gets the bookmark color (Read only).
     *
     * @returns {number[]} Bookmark color.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the bookmark color
     * let color: number[] = bookmark.color;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): number[] {
        if (this._color === null || typeof this._color === 'undefined') {
            if (this._dictionary.has('C')) {
                this._color = _parseColor(this._dictionary.getArray('C'));
            }
        }
        return (this._color) ? this._color : [0, 0, 0];
    }
    /**
     * Gets the textStyle (Read only).
     *
     * @returns {PdfTextStyle} Text style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the textStyle
     * let textStyle: PdfTextStyle = bookmark.textStyle;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get textStyle(): PdfTextStyle {
        if (this._textStyle === null || typeof this._textStyle === 'undefined') {
            this._textStyle = this._obtainTextStyle();
        }
        return this._textStyle;
    }
    /**
     * Gets the boolean flag indicating whether the bookmark is expanded or not (Read only).
     *
     * @returns {boolean} whether the bookmark is expanded or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the boolean flag indicating whether the bookmark is expanded or not
     * let isExpanded: boolean = bookmark.isExpanded;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isExpanded(): boolean {
        if (this._dictionary.has('Count')) {
            const value: number = this._dictionary.get('Count');
            if (value >= 0) {
                return true;
            }
        }
        return this._isExpanded;
    }
    get _next(): PdfBookmark {
        let nextBookmark: PdfBookmark;
        if (this._dictionary.has('Next')) {
            const dictionary: _PdfDictionary = this._dictionary.get('Next');
            if (dictionary) {
                nextBookmark = new PdfBookmark(dictionary, this._crossReference);
            }
        }
        return nextBookmark;
    }
    _obtainTextStyle(): PdfTextStyle{
        let style: PdfTextStyle = PdfTextStyle.regular;
        if (this._dictionary.has('F')) {
            const flag: number = this._dictionary.get('F');
            let flagValue: number = 0;
            if (typeof flag !== 'undefined' && flag !== null) {
                flagValue = flag;
            }
            style |= flagValue as PdfTextStyle;
        }
        return style;
    }
    _obtainTitle(): string {
        let value: string = '';
        if (this._dictionary.has('Title')) {
            value = this._dictionary.get('Title');
        }
        return value;
    }
    _obtainNamedDestination(): PdfNamedDestination {
        const document: PdfDocument = this._crossReference._document;
        let destinationCollection: _PdfNamedDestinationCollection;
        if (document) {
            destinationCollection = document._destinationCollection;
        }
        let destination: any; // eslint-disable-line
        let namedDestination: PdfNamedDestination;
        if (destinationCollection) {
            const dictionary: _PdfDictionary = this._dictionary;
            if (dictionary.has('A')) {
                const action: _PdfDictionary = dictionary.get('A');
                if (action.has('D')) {
                    destination = action.get('D');
                }
            } else if (dictionary.has('Dest')) {
                destination = dictionary.get('Dest');
            }
            if (destination) {
                let value: string;
                if (destination instanceof _PdfName) {
                    value = destination.name;
                } else if (typeof destination === 'string') {
                    value = destination;
                }
                if (value) {
                    const namedDestinations: PdfNamedDestination[] = destinationCollection._namedDestinations;
                    for (let i: number = 0; i < namedDestinations.length; i++) {
                        namedDestination = namedDestinations[Number.parseInt(i.toString(), 10)];
                        if (namedDestination._title === value) {
                            destination = namedDestination;
                            break;
                        }
                    }
                }
            }
        }
        return namedDestination;
    }
    _obtainDestination(): PdfDestination {
        const bookMarkDictionary: _PdfDictionary = this._dictionary;
        let page: PdfPage;
        if (bookMarkDictionary && bookMarkDictionary.has('Dest')) {
            const destinationArray: any[] = bookMarkDictionary.getArray('Dest'); // eslint-disable-line
            const loadedDocument: PdfDocument = this._crossReference._document;
            let mode: _PdfName;
            if (destinationArray && Array.isArray(destinationArray) && destinationArray.length > 0) {
                const value: any = destinationArray[0]; // eslint-disable-line
                let left: number;
                let height: number;
                let bottom: number;
                let right: number;
                let zoom: number;
                if (typeof value === 'number') {
                    const pageNumber: number = destinationArray[0];
                    if (pageNumber >= 0) {
                        const document: PdfDocument = this._crossReference._document;
                        if (document && document.pageCount > pageNumber) {
                            page = document.getPage(pageNumber);
                        }
                        if (destinationArray.length > 1) {
                            mode = destinationArray[1];
                        }
                        if (mode && mode.name === 'XYZ') {
                            if (destinationArray.length > 2) {
                                left = destinationArray[2];
                            }
                            if (destinationArray.length > 3) {
                                height = destinationArray[3];
                            }
                            if (destinationArray.length > 4) {
                                zoom = destinationArray[4];
                            }
                            if (page) {
                                const topValue: number = (height === null || typeof height === 'undefined') ? 0 : page.size[1] - height;
                                const leftValue: number = (left === null || typeof left === 'undefined') ? 0 : left;
                                if (page.rotation !== PdfRotationAngle.angle0) {
                                    _checkRotation(page, height, left);
                                }
                                this._destination = new PdfDestination(page, [leftValue, topValue]);
                                this._destination._index = pageNumber;
                                this._destination.zoom = (typeof zoom !== 'undefined' && zoom !== null) ? zoom : 0;
                                if (left === null || height === null || zoom === null || typeof left === 'undefined'
                                     || typeof height === 'undefined' || typeof zoom === 'undefined') {
                                    this._destination._setValidation(false);
                                }
                            }
                        }
                    }
                }
                if (value instanceof _PdfDictionary) {
                    const pageDictionary: _PdfDictionary = value;
                    let index: number;
                    if (loadedDocument && pageDictionary) {
                        index = _getPageIndex(loadedDocument, pageDictionary);
                    }
                    if (typeof index !== 'undefined' && index !== null && index >= 0) {
                        page = loadedDocument.getPage(index);
                    }
                    if (destinationArray.length > 1) {
                        mode = destinationArray[1];
                    }
                    if (mode) {
                        if (mode.name === 'XYZ') {
                            if (destinationArray.length > 2) {
                                left = destinationArray[2];
                            }
                            if (destinationArray.length > 3) {
                                height = destinationArray[3] as number;
                            }
                            if (destinationArray.length > 4) {
                                zoom = destinationArray[4];
                            }
                            if (page) {
                                let topValue: number = (height === null || typeof height === 'undefined') ? 0 : page.size[1] - height;
                                const leftValue: number = (left === null || typeof left === 'undefined') ? 0 : left;
                                if (page.rotation !== PdfRotationAngle.angle0) {
                                    topValue = _checkRotation(page, height, left);
                                }
                                this._destination = new PdfDestination(page, [leftValue, topValue]);
                                this._destination._index = index;
                                this._destination.zoom = (typeof zoom !== 'undefined' && zoom !== null) ? zoom : 0;
                                if (left === null || height === null || zoom === null || typeof left === 'undefined' ||
                                     typeof height === 'undefined' || typeof zoom === 'undefined') {
                                    this._destination._setValidation(false);
                                }
                            }
                        } else {
                            if (mode.name === 'FitR') {
                                if (destinationArray.length > 2) {
                                    left = destinationArray[2];
                                }
                                if (destinationArray.length > 3) {
                                    bottom = destinationArray[3];
                                }
                                if (destinationArray.length > 4) {
                                    right = destinationArray[4];
                                }
                                if (destinationArray.length > 5) {
                                    height = destinationArray[5];
                                }
                                if (page) {
                                    left = (left === null || typeof left === 'undefined') ? 0 : left;
                                    bottom = (bottom === null || typeof bottom === 'undefined') ? 0 : bottom;
                                    height = (height === null || typeof height === 'undefined') ? 0 : height;
                                    right = (right === null || typeof right === 'undefined') ? 0 : right;
                                    this._destination = new PdfDestination(page, [left, bottom, right, height]);
                                    this._destination._index = index;
                                    this._destination.mode = PdfDestinationMode.fitR;
                                }
                            } else if (mode.name === 'FitBH' || mode.name === 'FitH') {
                                if (destinationArray.length >= 3) {
                                    height = destinationArray[2];
                                }
                                if (typeof index !== 'undefined' && index !== null && index >= 0) {
                                    page = loadedDocument.getPage(index);
                                }
                                if (page && page.size) {
                                    const topValue: number = (height === null || typeof height === 'undefined') ? 0 : page.size[1] - height;
                                    this._destination = new PdfDestination(page, [0, topValue]);
                                    this._destination._index = index;
                                    this._destination.mode = PdfDestinationMode.fitH;
                                    if (height === null || typeof height === 'undefined') {
                                        this._destination._setValidation(false);
                                    }
                                }
                            } else {
                                if (page && mode.name === 'Fit') {
                                    this._destination = new PdfDestination(page);
                                    this._destination._index = index;
                                    this._destination.mode = PdfDestinationMode.fitToPage;
                                }
                            }
                        }
                    }
                }
            }
        }
        return this._destination;
    }
}
/**
 * Represents a named destination in a PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Get the bookmarks
 * let bookmarks: PdfBookmarkBase = document.bookmarks;
 * // Gets the bookmark at the specified index
 * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
 * // Gets the named destination
 * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfNamedDestination {
    _destination: PdfDestination;
    _title: string;
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    /**
     * Initializes a new instance of the `PdfNamedDestination` class.
     *
     * @private
     * @param {_PdfDictionary} dictionary Destination dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference.
     *
     */
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference) {
        this._dictionary = dictionary;
        this._crossReference = crossReference;
    }
    /**
     * Gets the destination.
     *
     * @returns {PdfDestination} Page destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the named destination
     * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
     * // Gets the destination
     * let destination: PdfDestination = namedDestination.destination;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destination(): PdfDestination {
        return this._destination;
    }
    /**
     * Sets the destination.
     *
     * @param {PdfDestination} value destination.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the named destination
     * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
     * // Set the destination
     * namedDestination.destination = new PdfDestination(page, [100, 200]);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destination(value: PdfDestination) {
        if (value) {
            value._parent = this;
            this._destination = value;
            this._destination._initializePrimitive();
        }
    }
    /**
     * Gets the title.
     *
     * @returns {string} title.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the named destination
     * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
     * // Gets the title
     * let title: string = namedDestination.title;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get title(): string {
        return this._title;
    }
    /**
     * Sets the title.
     *
     * @param {string} value title.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the named destination
     * let namedDestination: PdfNamedDestination = bookmark.namedDestination;
     * // Set the title
     * namedDestination.title = 'Syncfusion';
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set title(value: string) {
        if (value !== this._title) {
            this._title = value;
            this._dictionary.update('Title', value);
            this._dictionary._updated = true;
        }
    }
}
export class _PdfNamedDestinationCollection {
    _dictionary: _PdfDictionary;
    _crossReference: _PdfCrossReference;
    _namedDestinations: PdfNamedDestination[] = [];
    constructor()
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference)
    constructor(dictionary?: _PdfDictionary, crossReference?: _PdfCrossReference) {
        if (dictionary) {
            this._dictionary = dictionary;
        }
        if (crossReference) {
            this._crossReference = crossReference;
        }
        if (dictionary && dictionary.has('Dests')) {
            const destination: _PdfDictionary = dictionary.get('Dests');
            if (destination) {
                if (destination.has('Names')) {
                    this._addCollection(destination);
                } else if (destination.has('Kids')) {
                    const destinationArray: any[] = destination.getArray('Kids'); // eslint-disable-line
                    for (let i: number = 0; i < destinationArray.length; i++) {
                        const destinationElement: _PdfDictionary = destinationArray[Number.parseInt(i.toString(), 10)];
                        this._addCollection(destinationElement);
                    }
                }
            }
        }
    }
    _addCollection(destination: _PdfDictionary): void {
        let elements: any = destination.getRaw('Names'); // eslint-disable-line
        let ref: any[]; // eslint-disable-line
        let dictionary: _PdfDictionary;
        if (elements instanceof _PdfReference) {
            ref = this._crossReference._fetch(elements);
        }
        if (ref && Array.isArray(ref) && ref.length > 0) {
            elements = ref;
        }
        if (elements && Array.isArray(elements) && elements.length > 0) {
            for (let i: number = 1; i < elements.length; i = i + 2) {
                let reference: any = elements[i];// eslint-disable-line
                if (reference instanceof _PdfReference) {
                    const destinationArray: any[] = this._crossReference._fetch(reference); // eslint-disable-line
                    if (destinationArray && Array.isArray(destinationArray) && destinationArray.length > 0) {
                        dictionary = new _PdfDictionary();
                        dictionary.update('D', destinationArray);
                    } else {
                        dictionary = this._crossReference._fetch(reference);
                    }
                } else if ((dictionary === null || typeof dictionary === 'undefined') && Array.isArray(reference)) {
                    dictionary = new _PdfDictionary();
                    dictionary.update('D', reference);
                }
                if (dictionary) {
                    const namedDestination: PdfNamedDestination = new PdfNamedDestination(dictionary, this._crossReference);
                    const value: string = elements[i - 1];
                    let destinationObject: PdfDestination;
                    let destinationArray: any[]; // eslint-disable-line
                    if (value) {
                        namedDestination._title = value;
                        if (dictionary.has('D')) {
                            destinationArray = dictionary.get('D');
                            destinationObject = new PdfDestination();
                            const reference: _PdfReference = destinationArray[0];
                            if (destinationArray && destinationArray[0] instanceof _PdfReference) {
                                const pageDictionary: _PdfDictionary = this._crossReference._fetch(reference);
                                const loadedDocument: PdfDocument = this._crossReference._document;
                                let index: number;
                                if (loadedDocument && pageDictionary) {
                                    index = _getPageIndex(loadedDocument, pageDictionary);
                                    if (typeof index !== 'undefined' && index !== null && index >= 0) {
                                        destinationObject._index = index;
                                        destinationObject.page = loadedDocument.getPage(index);
                                    }
                                }
                            }
                        }
                    }
                    if (destinationArray[1] instanceof _PdfName) {
                        let left: number;
                        let height: number;
                        let zoom: number;
                        const mode: string = destinationArray[1].name;
                        const page: PdfPage = destinationObject.page;
                        switch (mode) {
                        case 'Fit':
                            destinationObject._destinationMode = PdfDestinationMode.fitToPage;
                            break;
                        case 'XYZ':
                            destinationObject._destinationMode = PdfDestinationMode.location;
                            if (destinationArray.length > 2) {
                                left = destinationArray[2];
                            }
                            if (destinationArray.length > 3) {
                                height = destinationArray[3] as number;
                            }
                            if (destinationArray.length > 4) {
                                zoom = destinationArray[4];
                            }
                            if (page) {
                                const size: number[] = page.size;
                                let topValue: number = (height === null || typeof height === 'undefined') ? 0 : size[1] - height;
                                const leftValue: number = (left === null || typeof left === 'undefined') ? 0 : left;
                                destinationObject._location = [leftValue, topValue];
                                if (page.rotation !== PdfRotationAngle.angle0) {
                                    topValue = _checkRotation(page, height, left);
                                }
                                destinationObject._zoom = (typeof zoom !== 'undefined' && zoom !== null) ? zoom : 0;
                                if (left === null || height === null || zoom === null || typeof left === 'undefined'
                                     || typeof height === 'undefined' || typeof zoom === 'undefined') {
                                    destinationObject._isValid = false;
                                }
                            }
                            break;
                        case 'FitH':
                        case 'FitBH':
                            destinationObject._destinationMode = PdfDestinationMode.fitH;
                            if (destinationArray.length >= 3) {
                                height = destinationArray[2];
                            }
                            if (page) {
                                const size: number[] = page.size;
                                const topValue: number = (height === null || typeof height === 'undefined') ? 0 : size[1] - height;
                                destinationObject._location = [0, topValue];
                            }
                            if (height === null || typeof height === 'undefined') {
                                destinationObject._isValid = false;
                            }
                            break;
                        case 'FitR':
                            destinationObject._destinationMode = PdfDestinationMode.fitR;
                            break;
                        }
                    }
                    destinationObject._parent = namedDestination;
                    namedDestination._destination = destinationObject;
                    this._namedDestinations.push(namedDestination);
                }
            }
        }
    }
}
