import { PdfDestinationMode, PdfRotationAngle, PdfTextStyle } from './enumerator';
import { _PdfCrossReference } from './pdf-cross-reference';
import { PdfDocument } from './pdf-document';
import { PdfDestination, _PdfDestinationHelper, PdfPage } from './pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from './pdf-primitives';
import { _checkRotation, _getPageIndex, _isNullOrUndefined, _parseColor } from './utils';
import { PdfColor, Size } from './pdf-type';
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
    _color: PdfColor;
    _isExpanded: boolean = false;
    _namedDestination: PdfNamedDestination;
    _title: string;
    _textStyle: PdfTextStyle;
    _isLoadedBookmark: boolean = false;
    _reference: _PdfReference;
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
     * Gets the boolean flag indicating whether the bookmark is expanded or not.
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
        if (this._dictionary && this._dictionary.has('Count')) {
            return (this._dictionary.get('Count') >= 0);
        } else {
            return this._isExpanded;
        }
    }
    /**
     * Sets the boolean flag indicating whether the bookmark is expanded or not.
     *
     * @param {boolean} value whether the bookmark is expanded or not.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the boolean flag indicating whether the bookmark is expanded or not
     * bookmark.isExpanded = true;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set isExpanded(value: boolean) {
        this._isExpanded = value;
        if (this.count > 0 && this._dictionary) {
            this._dictionary.update('Count', value ? this._bookMarkList.length : (-this._bookMarkList.length));
        }
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
        if (_isNullOrUndefined(this._bookMarkList) && this._bookMarkList.length > 0 && index < this._bookMarkList.length) {
            bookmark = this._bookMarkList[<number>index];
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
    /**
     * Creates and adds a new outline to the PDF document.
     *
     * @param {string} title The title of the outline.
     * @returns {PdfBookmark} PDF bookmark.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Add a new outline to the PDF document
     * let bookmark: PdfBookmark = bookmarks.add('Introduction');
     * // Sets destination to the bookmark
     * bookmark.destination = new PdfDestination(page, {x: 10, y: 10});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(title: string): PdfBookmark
    /**
     * Adds a new outline (bookmark) with title and optional properties to the PDF document .
     *
     * @param {string} title The title of the bookmark.
     * @param {object} [options] Optional parameters for the bookmark.
     * @param {PdfDestination} [options.destination] The destination within the PDF.
     * @param {PdfNamedDestination} [options.namedDestination] A named destination reference.
     * @param {PdfColor} [options.color] The color of the bookmark text.
     * @param {PdfTextStyle} [options.textStyle] The style of the bookmark text.
     * @returns {PdfBookmark} The newly created PDF bookmark.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Add a new bookmark with destination
     * let bookmark: PdfBookmark = document.bookmarks.add('Introduction', {
     *    destination: new PdfDestination(page, { x: 10, y: 10 }, { zoom: 1 }),
     *    namedDestination: new PdfNamedDestination('First', new PdfDestination(page, { x: 0, y: 10 }, {zoom: 1 })),
     *    color: { r: 0, g: 0, b: 255 },
     *    textStyle: PdfTextStyle.bold});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(title: string, options: {
        destination?: PdfDestination,
        namedDestination?: PdfNamedDestination,
        color?: PdfColor,
        textStyle?: PdfTextStyle
    }): PdfBookmark
    /**
     * Insert a new outline to the PDF document at specified index.
     *
     * @param {string} title The title of the outline.
     * @param {index} index The index to insert.
     * @returns {PdfBookmark} PDF bookmark.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Add a new outline to the PDF document
     * let bookmark: PdfBookmark = bookmarks.add('Introduction');
     * // Sets destination to the bookmark
     * bookmark.destination = new PdfDestination(page, {x: 10, 10});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(title: string, index: number): PdfBookmark
    /**
     * Adds a new outline (bookmark) to the PDF document.
     *
     * @param {string} title The title of the bookmark.
     * @param {number} index The index at which to insert the bookmark.
     * @param {object} [options] Optional parameters for the bookmark.
     * @param {PdfDestination} [options.destination] The destination within the PDF.
     * @param {PdfNamedDestination} [options.namedDestination] A named destination reference.
     * @param {PdfColor} [options.color] The color of the bookmark text.
     * @param {PdfTextStyle} [options.textStyle] The style of the bookmark text.
     * @returns {PdfBookmark} The newly created PDF bookmark.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Add a new bookmark with destination
     * let bookmark: PdfBookmark = document.bookmarks.add('Introduction', 0, {
     *    destination: new PdfDestination(page, { x: 10, y: 10 }, {zoom: 1 }),
     *    namedDestination: new PdfNamedDestination('First', new PdfDestination(page, { x: 0, y: 10 }, {zoom: 1 })),
     *    color: { r: 0, g: 0, b: 255 },
     *    textStyle: PdfTextStyle.bold});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(title: string, index: number, options: {
        destination?: PdfDestination,
        namedDestination?: PdfNamedDestination,
        color?: PdfColor,
        textStyle?: PdfTextStyle
    }): PdfBookmark
    add(title: string, arg2?: number | {
        destination?: PdfDestination,
        namedDestination?: PdfNamedDestination,
        color?: PdfColor,
        textStyle?: PdfTextStyle,
    }, options?: {
        destination?: PdfDestination,
        namedDestination?: PdfNamedDestination,
        color?: PdfColor,
        textStyle?: PdfTextStyle,
    }): PdfBookmark {
        let bookmark: PdfBookmark;
        let index: number;
        if (typeof arg2 !== 'undefined' && arg2 !== null && typeof arg2 === 'number') {
            index = arg2;
        } else if (arg2 && typeof arg2 === 'object') {
            options = arg2;
        }
        if (this._dictionary) {
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.update('Parent', this._reference);
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, dictionary);
            bookmark = new PdfBookmark(dictionary, this._crossReference);
            bookmark._reference = reference;
            bookmark.title = title;
            if (typeof index === 'undefined') {
                if (this.count === 0) {
                    this._dictionary.update('First', reference);
                    this._dictionary.update('Last', reference);
                } else {
                    const last: PdfBookmark = this.at(this.count - 1);
                    this._dictionary.update('Last', reference);
                    if (last && last._reference) {
                        dictionary.update('Prev', last._reference);
                        last._dictionary.update('Next', reference);
                    }
                }
                this._bookMarkList.push(bookmark);
            } else {
                if (index < 0 || index > this.count) {
                    throw new Error('Index out of range');
                }
                if (this.count === 0) {
                    this._dictionary.update('First', reference);
                    this._dictionary.update('Last', reference);
                    this._bookMarkList.push(bookmark);
                } else if (index === this.count) {
                    const last: PdfBookmark = this.at(this.count - 1);
                    this._dictionary.update('Last', reference);
                    if (last && last._reference) {
                        dictionary.update('Prev', last._reference);
                        last._dictionary.update('Next', reference);
                    }
                    this._bookMarkList.push(bookmark);
                } else if (index === 0) {
                    const first: PdfBookmark = this.at(0);
                    this._dictionary.update('First', reference);
                    if (first && first._reference) {
                        dictionary.update('Next', first._reference);
                        first._dictionary.update('Prev', reference);
                    }
                    this._updateBookmarkList(index, bookmark);
                } else {
                    const next: PdfBookmark = this.at(index);
                    const prev: PdfBookmark = this.at(index - 1);
                    if (prev && prev._reference && next && next._reference) {
                        dictionary.update('Prev', prev._reference);
                        prev._dictionary.update('Next', reference);
                        next._dictionary.update('Prev', reference);
                        dictionary.update('Next', next._reference);
                    }
                    this._updateBookmarkList(index, bookmark);
                }
            }
            this._updateCount();
        }
        if (options && bookmark) {
            if ('textStyle' in options && _isNullOrUndefined(options.textStyle)) {
                bookmark.textStyle = options.textStyle;
            }
            if ('color' in options && _isNullOrUndefined(options.color)) {
                bookmark.color = options.color;
            }
            if ('destination' in options && _isNullOrUndefined(options.destination)) {
                bookmark.destination = options.destination;
            }
            if ('namedDestination' in options && _isNullOrUndefined(options.namedDestination)) {
                bookmark.namedDestination = options.namedDestination;
            }
        }
        return bookmark;
    }
    /**
     * Remove specified bookmark from the document.
     *
     * @param {string} title The title of the outline.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Remove specified bookmark from the document.
     * bookmarks.remove('Introduction');
     * // Sets destination to the bookmark
     * bookmark.destination = new PdfDestination(page, {x: 10, 10});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(title: string): void
    /**
     * Remove the bookmark from the document at the specified index.
     *
     * @param {number} index The index.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Access the first page of the PDF
     * let page: PdfPage = document.getPage(0);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Remove the bookmark from the document at the index 1.
     * bookmarks.remove(1);
     * // Sets destination to the bookmark
     * bookmark.destination = new PdfDestination(page, {x: 10, 10});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    remove(index: number): void
    remove(value: string | number): void {
        if (typeof value === 'string') {
            for (let i: number = this._bookMarkList.length - 1; i >= 0; i--) {
                const bookmark: PdfBookmark = this.at(i);
                if (bookmark.title === value) {
                    this.remove(i);
                } else if (bookmark.count > 0) {
                    bookmark.remove(value);
                }
            }
        } else {
            if (value >= 0 && value < this.count) {
                if (this.count === 1) {
                    this._removeFirst(this._dictionary);
                    this._removeLast(this._dictionary);
                    this._removeCount(this._dictionary);
                    this._bookMarkList = [];
                } else {
                    if (value === 0) {
                        const next: PdfBookmark = this.at(value + 1);
                        if (this._dictionary && next && next._reference) {
                            this._removePrevious(next._dictionary);
                            this._dictionary.update('First', next._reference);
                        }
                    } else if (value === this.count - 1) {
                        const prev: PdfBookmark = this.at(value - 1);
                        if (this._dictionary && prev && prev._reference) {
                            this._removeNext(prev._dictionary);
                            this._dictionary.update('Last', prev._reference);
                        }
                    } else {
                        const prev: PdfBookmark = this.at(value - 1);
                        const next: PdfBookmark = this.at(value + 1);
                        if (prev && prev._reference && next && next._reference) {
                            prev._dictionary.update('Next', next._reference);
                            next._dictionary.update('Prev', prev._reference);
                        }
                    }
                    this._updateBookmarkList(value);
                    if (this._dictionary) {
                        this._updateCount();
                    }
                }
            }
        }
    }
    /**
     * Removes all the bookmark from the collection.
     *
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Remove all the bookmark from the collection.
     * bookmarks.clear();
     * // Get count after removal of all outlines.
     * let count: number = bookmarks.count;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    clear(): void {
        this._removeFirst(this._dictionary);
        this._removeLast(this._dictionary);
        this._removeCount(this._dictionary);
        this._bookMarkList = [];
    }
    _removeFirst(dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.has('First')) {
            delete dictionary._map.First;
            dictionary._updated = true;
        }
    }
    _removeLast(dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.has('Last')) {
            delete dictionary._map.Last;
            dictionary._updated = true;
        }
    }
    _removeNext(dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.has('Next')) {
            delete dictionary._map.Next;
            dictionary._updated = true;
        }
    }
    _removePrevious(dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.has('Prev')) {
            delete dictionary._map.Prev;
            dictionary._updated = true;
        }
    }
    _removeCount(dictionary: _PdfDictionary): void {
        if (dictionary && dictionary.has('Count')) {
            delete dictionary._map.Count;
            dictionary._updated = true;
        }
    }
    _updateBookmarkList(index: number, bookmark?: PdfBookmark): void {
        const updatedList: PdfBookmark[] = [];
        let i: number = 0;
        if (typeof bookmark === 'undefined') {
            this._bookMarkList.forEach((entry: PdfBookmark) => {
                if (i !== index) {
                    updatedList.push(entry);
                } else {
                    const reference: _PdfReference = entry._reference;
                    if (reference && this._crossReference._cacheMap.has(reference)) {
                        this._crossReference._cacheMap.get(reference)._updated = false;
                    }
                }
                i++;
            });
        } else {
            this._bookMarkList.forEach((entry: PdfBookmark) => {
                if (i === index) {
                    updatedList.push(bookmark);
                }
                updatedList.push(entry);
                i++;
            });
        }
        this._bookMarkList = updatedList;
    }
    _updateCount(): void {
        if (this.isExpanded || !this._dictionary.has('Count')) {
            this._dictionary.update('Count', this._bookMarkList.length);
        } else {
            this._dictionary.update('Count', -this._bookMarkList.length);
        }
    }
    _reproduceTree(): void {
        let firstBookmark: PdfBookmark = this._getBookmark(this);
        let isBookmark: boolean = (firstBookmark) ? true : false;
        while (isBookmark && firstBookmark._dictionary) {
            this._bookMarkList.push(firstBookmark);
            firstBookmark = firstBookmark._next;
            isBookmark = (firstBookmark) ? true : false;
        }
    }
    _getBookmark(bookmarkBase: PdfBookmarkBase, isFirst: boolean = true): PdfBookmark {
        const bookmarkBaseDictionary: _PdfDictionary = bookmarkBase._dictionary;
        let bookMark: PdfBookmark;
        if (bookmarkBaseDictionary && bookmarkBaseDictionary.has(isFirst ? 'First' : 'Last')) {
            const reference: _PdfReference = bookmarkBaseDictionary._get(isFirst ? 'First' : 'Last');
            if (_isNullOrUndefined(reference)) {
                const bookMarkDictionary: _PdfDictionary = this._crossReference._fetch(reference);
                if (bookMarkDictionary) {
                    bookMark = new PdfBookmark(bookMarkDictionary, this._crossReference);
                    bookMark._reference = reference;
                }
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
        if (this._dictionary && !this._dictionary.has('Dest') && this._dictionary.has('A')) {
            const actionDictionary: _PdfDictionary = this._dictionary.get('A');
            if (actionDictionary && actionDictionary.has('D')) {
                const destinationArray: any[] = actionDictionary.getRaw('D'); // eslint-disable-line
                this._dictionary.update('Dest', destinationArray);
            }
        }
        this._isLoadedBookmark = true;
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
     * // Gets the destination
     * let destination: PdfDestination = bookmark.destination;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get destination(): PdfDestination {
        if (!this._destination) {
            const namedDestination: PdfNamedDestination = this._obtainNamedDestination();
            const destinationHelper: _PdfDestinationHelper = new _PdfDestinationHelper(this._dictionary, 'Dest');
            this._destination = destinationHelper._obtainDestination();
            if (!this._destination && namedDestination && namedDestination.destination) {
                return namedDestination.destination;
            }
        }
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
     * // Set the destination
     * bookmark.destination = new PdfDestination(page, {x: 100, 200});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destination(value: PdfDestination) {
        if (value) {
            value._parent = this;
            value._isBookmark = true;
            this._destination = value;
            this._destination._initializePrimitive();
        }
    }
    /**
     * Gets the named destination.
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
     * Sets the named destination.
     *
     * @param {PdfNamedDestination} value Named destination.
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
    set namedDestination(value: PdfNamedDestination) {
        if (this._namedDestination !== value && this._dictionary) {
            this._namedDestination = value;
            const dictionary: _PdfDictionary = new _PdfDictionary(this._crossReference);
            dictionary.update('D', value.title);
            dictionary.update('S', _PdfName.get('GoTo'));
            const reference: _PdfReference = this._crossReference._getNextReference();
            this._crossReference._cacheMap.set(reference, dictionary);
            this._dictionary.update('A', reference);
        }
    }
    /**
     * Gets the bookmark title.
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
            if (this._dictionary && this._dictionary.has('Title')) {
                this._title = this._dictionary.get('Title');
            } else {
                this._title = '';
            }
        }
        return this._title;
    }
    /**
     * Sets the bookmark title.
     *
     * @param {string} value Bookmark title.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the bookmark title
     * bookmark.title = 'Syncfusion';
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set title(value: string) {
        this._title = value;
        if (this._dictionary) {
            this._dictionary.update('Title', value);
        }
    }
    /**
     * Gets the bookmark color.
     *
     * @returns {PdfColor} Bookmark color.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Gets the bookmark color
     * let color: PdfColor = bookmark.color;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): PdfColor {
        if (this._color === null || typeof this._color === 'undefined') {
            if (this._dictionary && this._dictionary.has('C')) {
                this._color = _parseColor(this._dictionary.getArray('C'));
            }
        }
        return (this._color) ? this._color : {r: 0, g: 0, b: 0};
    }
    /**
     * Sets the bookmark color.
     *
     * @param {PdfColor} value Bookmark color.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the bookmark color
     * bookmark.color = {r: 255, g: 0, b: 0};
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set color(value: PdfColor) {
        this._color = value;
        if (this._dictionary) {
            this._dictionary.update('C', [Number.parseFloat((value.r / 255).toFixed(7)),
                Number.parseFloat((value.g / 255).toFixed(7)),
                Number.parseFloat((value.b / 255).toFixed(7))]);
        }
    }
    /**
     * Gets the text style.
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
     * Sets the text style.
     *
     * @param {PdfTextStyle} value Text style.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the textStyle
     * bookmark.textStyle = PdfTextStyle.italic;
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set textStyle(value: PdfTextStyle) {
        this._textStyle = value;
        this._updateTextStyle(value);
    }
    get _next(): PdfBookmark {
        let nextBookmark: PdfBookmark;
        if (this._dictionary && this._dictionary.has('Next')) {
            const reference: _PdfReference = this._dictionary._get('Next');
            if (_isNullOrUndefined(reference)) {
                const dictionary: _PdfDictionary = this._crossReference._fetch(reference);
                if (dictionary) {
                    nextBookmark = new PdfBookmark(dictionary, this._crossReference);
                    nextBookmark._reference = reference;
                }
            }
        }
        return nextBookmark;
    }
    _updateTextStyle(value: PdfTextStyle): void {
        if (value === PdfTextStyle.regular) {
            if (this._dictionary && this._dictionary.has('F')) {
                delete this._dictionary._map.F;
            }
        } else if (this._dictionary) {
            this._dictionary.update('F', value);
        }
    }
    _obtainTextStyle(): PdfTextStyle{
        let style: PdfTextStyle = PdfTextStyle.regular;
        if (this._dictionary && this._dictionary.has('F')) {
            const flag: number = this._dictionary.get('F');
            let flagValue: number = 0;
            if (typeof flag !== 'undefined' && flag !== null) {
                flagValue = flag;
            }
            style |= flagValue as PdfTextStyle;
        }
        return style;
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
            if (dictionary) {
                if (dictionary.has('A')) {
                    const action: _PdfDictionary = dictionary.get('A');
                    if (action && action.has('D')) {
                        destination = action.get('D');
                    }
                } else if (dictionary.has('Dest')) {
                    destination = dictionary.get('Dest');
                }
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
                    if (namedDestinations && namedDestinations.length > 0) {
                        const entry: PdfNamedDestination = namedDestinations.find((dest: PdfNamedDestination) => dest._title === value);
                        if (entry) {
                            destination = entry;
                            namedDestination = entry;
                        }
                    }
                }
            }
        }
        return namedDestination;
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
     * @param {string} title The title.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the named destination
     * bookmark.namedDestination = new PdfNamedDestination('Chapter 1');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(title: string)
    /**
     * Initializes a new instance of the `PdfNamedDestination` class.
     *
     * @param {string} title The title.
     * @param {PdfDestination} destination Destination page.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Get the bookmarks
     * let bookmarks: PdfBookmarkBase = document.bookmarks;
     * // Gets the bookmark at the specified index
     * let bookmark: PdfBookmark = bookmarks.at(0) as PdfBookmark;
     * // Sets the named destination
     * bookmark.namedDestination = new PdfNamedDestination('Chapter 1', new PdfDestination(
     * page: document.getPage(0), {
     * location: { x: 50, y: 50 }});
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(title: string, destination: PdfDestination)
    /**
     * Initializes a new instance of the `PdfNamedDestination` class.
     *
     * @private
     * @param {_PdfDictionary} dictionary Destination dictionary.
     * @param {_PdfCrossReference} crossReference Cross reference.
     *
     */
    constructor(dictionary: _PdfDictionary, crossReference: _PdfCrossReference)
    constructor(arg1: string | _PdfDictionary, arg2?: _PdfCrossReference | PdfDestination) {
        if (arg1 instanceof _PdfDictionary && arg2 instanceof _PdfCrossReference) {
            this._dictionary = arg1;
            this._crossReference = arg2;
        } else if (typeof arg1 === 'string') {
            this._initialize();
            this.title = arg1;
            if (arg2 && arg2 instanceof PdfDestination) {
                this.destination = arg2;
            }
        }
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
     * namedDestination.destination = new PdfDestination(page, {x: 100, 200});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    set destination(value: PdfDestination) {
        if (value) {
            value._parent = this;
            value._isBookmark = false;
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
        if (value !== this._title && this._dictionary) {
            const previousTitle: string = this._title;
            this._title = value;
            this._dictionary.update('Title', value);
            this._dictionary._updated = true;
            this._updateNamedDestinationTitle(value, previousTitle);
        }
    }
    _updateNamedDestinationTitle(value: string, previousTitle: string): void {
        const crossReference: _PdfCrossReference = this._crossReference;
        if (crossReference && crossReference._document) {
            const document: PdfDocument = crossReference._document;
            const catalogDictionary: _PdfDictionary = document._catalog._catalogDictionary;
            if (catalogDictionary && catalogDictionary.has('Names')) {
                const names: _PdfDictionary = catalogDictionary.get('Names');
                if (names && names.has('Dests')) {
                    const dests: _PdfDictionary = names.get('Dests');
                    if (dests && dests.has('Names')) {
                        const namesValue: any[] = dests.get('Names'); // eslint-disable-line
                        const index: number = namesValue.indexOf(previousTitle);
                        if (index !== -1) {
                            namesValue.splice(index, 1, value);
                            delete dests._map.Names;
                            dests.update('Names', namesValue);
                            dests._updated = true;
                        }
                    }
                }
            }
        }
    }
    _initialize(): void {
        this._dictionary = new _PdfDictionary();
        this._dictionary.update('S', _PdfName.get('GoTo'));
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
                    destinationArray.forEach((entry: any) => { // eslint-disable-line
                        this._findDestination(entry);
                    });
                }
            }
        }
    }
    private _findDestination(destination: _PdfDictionary): void {
        if (destination) {
            if (destination.has('Names')) {
                this._addCollection(destination);
            } else if (destination.has('Kids')) {
                const kids: any = destination.getArray('Kids'); // eslint-disable-line
                if (kids && Array.isArray(kids) && kids.length > 0) {
                    kids.forEach((entry: any) => { // eslint-disable-line
                        this._findDestination(entry);
                    });
                }
            }
        }
    }
    _addCollection(destination: _PdfDictionary): void {
        let elements: any = destination.getRaw('Names'); // eslint-disable-line
        let ref: any[]; // eslint-disable-line
        if (elements && elements instanceof _PdfReference) {
            ref = this._crossReference._fetch(elements);
        }
        if (ref && Array.isArray(ref) && ref.length > 0) {
            elements = ref;
        }
        if (elements && Array.isArray(elements) && elements.length > 0) {
            for (let i: number = 1; i < elements.length; i = i + 2) {
                let dictionary: _PdfDictionary;
                let reference: any = elements[i];// eslint-disable-line
                if (reference && reference instanceof _PdfReference) {
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
                    let destArray: any[]; // eslint-disable-line
                    if (value) {
                        namedDestination._title = value;
                        if (dictionary.has('D')) {
                            destArray = dictionary.get('D');
                            destinationObject = new PdfDestination();
                            let pageRef: _PdfReference = destArray[0]; // eslint-disable-line
                            if (pageRef && destArray && destArray[0] instanceof _PdfReference) {
                                const pageDictionary: _PdfDictionary = this._crossReference._fetch(pageRef);
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
                    if (destArray[1] instanceof _PdfName) {
                        let left: number;
                        let height: number;
                        let zoom: number;
                        const mode: string = destArray[1].name;
                        const page: PdfPage = destinationObject.page;
                        switch (mode) {
                        case 'Fit':
                            destinationObject._destinationMode = PdfDestinationMode.fitToPage;
                            break;
                        case 'XYZ':
                            destinationObject._destinationMode = PdfDestinationMode.location;
                            if (destArray.length > 2) {
                                left = destArray[2];
                            }
                            if (destArray.length > 3) {
                                height = destArray[3] as number;
                            }
                            if (destArray.length > 4) {
                                zoom = destArray[4];
                            }
                            if (page) {
                                const size: Size = page.size;
                                let topValue: number = (height === null || typeof height === 'undefined') ? 0 : size.height - height;
                                const leftValue: number = (left === null || typeof left === 'undefined') ? 0 : left;
                                destinationObject._location = {x: leftValue, y: topValue};
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
                            if (destArray.length >= 3) {
                                height = destArray[2];
                            }
                            if (page) {
                                const size: Size = page.size;
                                const topValue: number = (height === null || typeof height === 'undefined') ? 0 : size.height - height;
                                destinationObject._location = {x: 0, y: topValue};
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
                    destinationObject._isBookmark = false;
                    namedDestination._destination = destinationObject;
                    this._namedDestinations.push(namedDestination);
                }
            }
        }
    }
}
