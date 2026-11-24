import { DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { WordDocument } from '../document/document';
import { FeatureInline } from '../document/feature-inline';
import { ParagraphItem, ParagraphItemOwner } from '../document/paragraph-item';
import { Paragraph } from '../document/paragraph';
import {
    FeatureInlineParagraphItem, TextRange
} from '../document/text-range';
import { isWml, wmlAttr, wmlElement } from '../document/wml';
import {
    featureId,
    registerFeature,
    registerFeatureInlineHandler,
    registerFeatureMaterializeHandler,
    visitParagraphsInDocumentOrder
} from '../../core/registry/index';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';

const BOOKMARKS: FeatureId = featureId('bookmarks');

/**
 * Attributes the bookmark model consumes; everything else is residual.
 *
 * @private
 */
const MODELED_ATTRIBUTE_LOCAL_NAMES: ReadonlyArray<string> = [
    'id',
    'name',
    'colFirst',
    'colLast'
];

function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}

function isWmlAttribute(a: OpenXmlAttribute): boolean {
    return a.prefix === 'w' || a.namespaceUri === '' || a.namespaceUri.indexOf('wordprocessingml') >= 0;
}

/**
 * Residual attributes for lossless serialize.
 *
 * Modeled local names are omitted only when their values were successfully
 * consumed. Invalid modeled values stay residual so they round-trip.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {ReadonlySet<string>} consumedLocalNames - The consumed local names.
 * @returns {OpenXmlAttribute[]} The result.
 * @private
 */
function residualAttributesOf(el: OpenXmlElement, consumedLocalNames: ReadonlySet<string>): OpenXmlAttribute[] {
    return el.attributes.filter((a: OpenXmlAttribute) => {
        if (a.localName === 'space' && a.prefix === 'xml') {
            return false;
        }
        if (isWmlAttribute(a) && MODELED_ATTRIBUTE_LOCAL_NAMES.indexOf(a.localName) !== -1) {
            return !consumedLocalNames.has(a.localName);
        }
        return true;
    });
}

function parseBookmarkId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}

function parseColumnIndex(raw: string | undefined): number | undefined {
    return parseBookmarkId(raw);
}

/**
 * Whether `name` is usable as `w:name` (non-empty after rejecting whitespace-only).
 *
 * @param {string} name - The name.
 * @returns {boolean} The result.
 * @private
 */
function isValidBookmarkName(name: string): boolean {
    if (name.length === 0) {
        return false;
    }
    // Reject whitespace-only names (Word authoring parity).
    for (let i: number = 0; i < name.length; i += 1) {
        const c: number = name.charCodeAt(i);
        if (c !== 0x20 && c !== 0x09 && c !== 0x0a && c !== 0x0d) {
            return true;
        }
    }
    return false;
}

function assertValidBookmarkName(name: string): void {
    if (!isValidBookmarkName(name)) {
        throw new DocxError('content/invalid-bookmark', 'Bookmark name must not be empty');
    }
}

/**
 * Normalize a bookmark name for case-insensitive comparison.
 * Converts to lowercase for matching purposes.
 *
 * @param {string} name - The name to normalize
 * @returns {string} Normalized name (lowercase)
 * @private
 */
function normalizeBookmarkName(name: string): string {
    return name.toLowerCase();
}

function assertNonNegativeInteger(value: number, label: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || Math.floor(value) !== value) {
        throw new DocxError('content/invalid-bookmark', label + ' must be a non-negative integer');
    }
}

/**
 * Represents the start of a bookmark in a document.
 *
 * A bookmark start must be paired with a corresponding {@link BookmarkEnd}. It can be inserted directly into {@link Paragraph.items}.
 *
 * @example
 * ```ts
 * const bookmark = new BookmarkStart('CustomerDetails');
 * paragraph.items.add(bookmark);
 * ```
 * @public
 */
export class BookmarkStart extends ParagraphItem {
    private bookmarkIdValue: number;
    private readonly nameValue: string;
    private firstColumnValue: number;
    private lastColumnValue: number;
    private readonly residual: OpenXmlAttribute[];

    /**
     * Discriminant for paragraph items collection type checking.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+, newer than this project's compiler
    readonly type: 'bookmarkStart' = 'bookmarkStart';

    /**
     * Create a bookmark start marker with a name.
     *
     * Public API: allocates pending negative ID that will be materialized at save time.
     *
     * @param name - Bookmark name (`w:name`); must be non-empty, not whitespace-only
     * @throws {@link DocxError} with code `content/invalid-bookmark` if name is invalid
     * @public
     */
    constructor(name: string);
    /**
     * @private
     */
    constructor(
        /**
         * Gets or sets the name.
         */
        name: string,
        bookmarkId: number,
        /**
         * Gets or sets the first column.
         */
        firstColumn: number,
        /**
         * Gets or sets the last column.
         */
        lastColumn: number,
        residualAttributes: OpenXmlAttribute[]
    );
    /**
     * Initializes a new instance of the BookmarkStart class.
     *
     * @param {string} name - Specifies the name.
     * @param {number} bookmarkId - Specifies the bookmark id.
     * @param {number} firstColumn - Specifies the first column.
     * @param {number} lastColumn - Specifies the last column.
     * @param {OpenXmlAttribute[]} residualAttributes - Specifies the residual attributes.
     */
    constructor(
        /**
         * Gets or sets the name.
         */
        name: string,
        bookmarkId?: number,
        /**
         * Gets or sets the first column.
         */
        firstColumn?: number,
        /**
         * Gets or sets the last column.
         */
        lastColumn?: number,
        residualAttributes?: OpenXmlAttribute[]
    ) {
        super();
        assertValidBookmarkName(name);
        this.nameValue = name;
        this.bookmarkIdValue = bookmarkId !== undefined ? bookmarkId : -1;
        this.firstColumnValue = firstColumn !== undefined ? firstColumn : -1;
        this.lastColumnValue = lastColumn !== undefined ? lastColumn : -1;
        if (residualAttributes) {
            this.residual = residualAttributes.slice();
        } else {
            this.residual = [];
        }
    }

    /**
     * Create a bookmark start marker from parsed OOXML.
     *
     * @param {number} bookmarkId - Parsed w:id value (non-negative)
     * @param {string} name - Parsed w:name value
     * @param {Object} options - Optional parsed attributes
     * @returns {BookmarkStart} Parsed BookmarkStart
     * @private
     */
    static createFromOpenXml(
        bookmarkId: number,
        /**
         * Gets or sets the name.
         */
        name: string,
        options?: {
            readonly firstColumn?: number;
            readonly lastColumn?: number;
            readonly residualAttributes?: ReadonlyArray<OpenXmlAttribute>;
        }
    ): BookmarkStart {
        if (!isValidBookmarkName(name)) {
            throw new DocxError('content/invalid-bookmark', 'Invalid bookmark name from XML');
        }
        return new BookmarkStart(
            name,
            bookmarkId,
            options !== undefined && options.firstColumn !== undefined ? options.firstColumn : -1,
            options !== undefined && options.lastColumn !== undefined ? options.lastColumn : -1,
            options !== undefined && options.residualAttributes !== undefined ? Array.from(options.residualAttributes) : []
        );
    }

    /**
     * Bookmark identifier shared with the paired end marker (`w:id`).
     * Negative when pending materialization; non-negative after save.
     *
     * @private
     */
    get bookmarkId(): number {
        return this.bookmarkIdValue;
    }

    /**
     * Gets the bookmark name. Read-only; set at construction.
     *
     * @returns {string} The bookmark name.
     */
    get name(): string {
        return this.nameValue;
    }

    /**
     * Gets or sets the zero-based first table column of the bookmark.
     *
     * `-1` means the attribute is absent. Assigning `-1` or `undefined` clears it.
     *
     * @private
     */
    get firstColumn(): number {
        return this.firstColumnValue;
    }
    set firstColumn(value: number | undefined) {
        this.mutate();
        if (value === undefined) {
            this.firstColumnValue = -1;
        } else {
            assertNonNegativeInteger(value, 'firstColumn');
            this.firstColumnValue = value;
        }
    }

    /**
     * Gets or sets the zero-based last table column of the bookmark.
     *
     * `-1` means the attribute is absent. Assigning `-1` or `undefined` clears it.
     *
     * @private
     */
    get lastColumn(): number {
        return this.lastColumnValue;
    }
    set lastColumn(value: number | undefined) {
        this.mutate();
        if (value === undefined) {
            this.lastColumnValue = -1;
        } else {
            assertNonNegativeInteger(value, 'lastColumn');
            this.lastColumnValue = value;
        }
    }

    /**
     * Assigns the package `w:id` used to pair start and end markers.
     *
     * @param {number} bookmarkId - The bookmark id.
     * @returns {void} Nothing is returned.
     * @private
     */
    setBookmarkId(bookmarkId: number): void {
        this.bookmarkIdValue = bookmarkId;
    }

    /**
     * Whether this marker still holds a temporary negative id before save materialization.
     *
     * @returns {boolean} The result.
     * @private
     */
    isPendingBookmarkId(): boolean {
        return this.bookmarkIdValue < 0;
    }

    /**
     * @returns {ReadonlyArray<OpenXmlAttribute>} The result.
     * @private
     * Residual attributes preserved for lossless serialization.
     */
    residualAttributes(): ReadonlyArray<OpenXmlAttribute> {
        return this.residual;
    }

    /**
     * Serializes this marker to `w:bookmarkStart`.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [
            wmlAttr('id', String(this.bookmarkIdValue)),
            wmlAttr('name', this.nameValue)
        ];
        if (this.firstColumnValue >= 0) {
            attributes.push(wmlAttr('colFirst', String(this.firstColumnValue)));
        }
        if (this.lastColumnValue >= 0) {
            attributes.push(wmlAttr('colLast', String(this.lastColumnValue)));
        }
        attributes.push(...this.residual);
        return wmlElement('bookmarkStart', { attributes });
    }
}

/**
 * Represents the end of a bookmark in a document.
 *
 * A bookmark end closes the bookmark range opened by the corresponding {@link BookmarkStart}. It can be inserted directly into {@link Paragraph.items}.
 *
 * @example
 * ```ts
 * const bookmarkEnd = new BookmarkEnd('CustomerDetails');
 * paragraph.items.add(bookmarkEnd);
 * ```
 * @public
 */
export class BookmarkEnd extends ParagraphItem {
    private bookmarkIdValue: number;
    private readonly nameValue: string;
    private isAfterParagraphMarkValue: boolean = false;
    private isAfterTableMarkValue: boolean = false;
    private isAfterCellMarkValue: boolean = false;
    private isAfterRowMarkValue: boolean = false;

    /**
     * Discriminant for paragraph items collection type checking.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+, newer than this project's compiler
    readonly type: 'bookmarkEnd' = 'bookmarkEnd';

    /**
     * Create a bookmark end marker with a name.
     *
     * Public API: allocates pending negative ID that will be materialized at save time.
     *
     * @param name - Bookmark name; empty string is accepted, but non-empty values
     *               must be non-whitespace-only. Read-only; set at construction.
     * @throws {@link DocxError} with code `content/invalid-bookmark` if name is
     *         non-empty but invalid (whitespace-only)
     * @public
     */
    constructor(name: string);
    /**
     * @private
     */
    constructor(name: string, bookmarkId: number);
    /**
     * Initializes a new instance of the BookmarkEnd class.
     *
     * @param {string} name - Specifies the name.
     * @param {number} bookmarkId - Specifies the bookmark id.
     */
    constructor(name: string, bookmarkId?: number) {
        super();
        if (name.length > 0) {
            assertValidBookmarkName(name);
        }
        this.nameValue = name;
        this.bookmarkIdValue = bookmarkId !== undefined ? bookmarkId : -1;
    }

    /**
     * Create a bookmark end marker from parsed OOXML.
     *
     * Internal factory: used by the deserialization layer.
     *
     * @param {number} bookmarkId - Parsed w:id value (non-negative)
     * @param {string} name - Optional parsed name (empty string if omitted)
     * @returns {BookmarkEnd} Parsed BookmarkEnd
     * @private
     */
    static createFromOpenXml(
        bookmarkId: number,
        /**
         * Gets or sets the name.
         */
        name?: string
    ): BookmarkEnd {
        return new BookmarkEnd(name !== undefined ? name : '', bookmarkId);
    }

    /**
     * Bookmark identifier shared with the paired start marker (`w:id`).
     * Negative when pending materialization; non-negative after save.
     *
     * @private
     */
    get bookmarkId(): number {
        return this.bookmarkIdValue;
    }

    /**
     * Gets the bookmark name, read-only; set at construction.
     *
     * Empty string is allowed on the end marker (schema has no `w:name`
     * on `bookmarkEnd`). Pairing always uses internal id, never this name.
     *
     * @returns {string} The bookmark name (possibly empty).
     */
    get name(): string {
        return this.nameValue;
    }

    /**
     * Assigns the package `w:id` used to pair start and end markers.
     *
     * @param {number} bookmarkId - The bookmark id.
     * @returns {void} Nothing is returned.
     * @private
     */
    setBookmarkId(bookmarkId: number): void {
        this.bookmarkIdValue = bookmarkId;
    }

    /**
     * Whether this marker still holds a temporary negative id before save materialization.
     *
     * @returns {boolean} The result.
     * @private
     */
    isPendingBookmarkId(): boolean {
        return this.bookmarkIdValue < 0;
    }

    /**
     * Whether this bookmark marker should be serialized after the previous
     * paragraph's closing mark (when at body level, between paragraphs).
     *
     * When true, the marker is positioned after the `w:p` element of the
     * previous paragraph. When false (default), it's positioned within or
     * before paragraph content.
     *
     * @returns {boolean} The result.
     * @private
     */
    get isAfterParagraphMark(): boolean {
        return this.isAfterParagraphMarkValue;
    }

    /**
     * Set whether this bookmark marker should be serialized after the previous
     * paragraph's closing mark.
     *
     * @param {boolean} value - True if after paragraph mark, false if before/within
     * @returns {void} Nothing is returned.
     * @private
     */
    set isAfterParagraphMark(value: boolean) {
        this.isAfterParagraphMarkValue = value;
    }

    /**
     * Whether this bookmark marker should be placed in the last paragraph of
     * the last cell of a table (when a bookmark ends after a table).
     *
     * When true, this end marker is positioned in the last table cell's last
     * paragraph rather than in the body or current paragraph.
     *
     * @returns {boolean} The result.
     * @private
     */
    get isAfterTableMark(): boolean {
        return this.isAfterTableMarkValue;
    }

    /**
     * Set whether this bookmark marker should be placed after a table.
     *
     * @param {boolean} value - True if after table, false otherwise
     * @returns {void} Nothing is returned.
     * @private
     */
    set isAfterTableMark(value: boolean) {
        this.isAfterTableMarkValue = value;
    }

    /**
     * Whether this bookmark marker should be placed in the last paragraph of a
     * table cell (when a bookmark ends after a cell boundary).
     *
     * When true, this end marker is positioned in the last paragraph of the cell
     * rather than in the body or other location.
     *
     * @returns {boolean} The result.
     * @private
     */
    get isAfterCellMark(): boolean {
        return this.isAfterCellMarkValue;
    }

    /**
     * Set whether this bookmark marker should be placed after a cell.
     *
     * @param {boolean} value - True if after cell, false otherwise
     * @returns {void} Nothing is returned.
     * @private
     */
    set isAfterCellMark(value: boolean) {
        this.isAfterCellMarkValue = value;
    }

    /**
     * Whether this bookmark marker should be placed in the last paragraph of the
     * last cell of a table row (when a bookmark ends after a row boundary).
     *
     * When true, this end marker is positioned in the last cell's last paragraph
     * of that row rather than in the body or other location.
     *
     * @returns {boolean} The result.
     * @private
     */
    get isAfterRowMark(): boolean {
        return this.isAfterRowMarkValue;
    }

    /**
     * Set whether this bookmark marker should be placed after a row.
     *
     * @param {boolean} value - True if after row, false otherwise
     * @returns {void} Nothing is returned.
     * @private
     */
    set isAfterRowMark(value: boolean) {
        this.isAfterRowMarkValue = value;
    }

    /**
     * Serializes this marker to `w:bookmarkEnd`.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('bookmarkEnd', {
            attributes: [wmlAttr('id', String(this.bookmarkIdValue))]
        });
    }
}

/**
 * Represents a bookmark in a document.
 *
 * A bookmark is defined by a {@link BookmarkStart} marker and, optionally,
 * a corresponding {@link BookmarkEnd} marker. This class provides a unified
 * view over the bookmark and exposes its properties without owning the
 * underlying bookmark markup.
 *
 * @public
 */
export class Bookmark {
    private readonly startMarkerValue: BookmarkStart;
    private readonly endMarkerValue: BookmarkEnd | undefined;
    /**
     * @param {BookmarkStart} start - The start marker.
     * @param {BookmarkEnd} end - The end marker, or undefined for start-only bookmarks.
     * @private
     */
    constructor(start: BookmarkStart, end?: BookmarkEnd) {
        this.startMarkerValue = start;
        this.endMarkerValue = end;
    }
    /**
     * Gets the bookmark name. Read-only on the pair view.
     */
    get name(): string {
        return this.startMarkerValue.name;
    }
    /**
     * Gets the start marker for this bookmark.
     */
    get bookmarkStart(): BookmarkStart {
        return this.startMarkerValue;
    }
    /**
     * Gets the end marker for this bookmark, or undefined for start-only bookmarks.
     */
    get bookmarkEnd(): BookmarkEnd | undefined {
        return this.endMarkerValue;
    }
    /**
     * Gets or sets the zero-based first table column. Returns -1 when absent, not undefined.
     */
    get firstColumn(): number {
        return this.startMarkerValue.firstColumn;
    }
    set firstColumn(value: number | undefined) {
        this.startMarkerValue.firstColumn = value;
    }
    /**
     * Gets or sets the zero-based last table column. Returns -1 when absent, not undefined.
     */
    get lastColumn(): number {
        return this.startMarkerValue.lastColumn;
    }
    set lastColumn(value: number | undefined) {
        this.startMarkerValue.lastColumn = value;
    }

    /**
     * Identifier shared by the start and end markers (`w:id`).
     *
     * @private
     */
    get bookmarkId(): number {
        return this.startMarkerValue.bookmarkId;
    }
    /**
     * Start marker (internal alias of {@link bookmarkStart}).
     *
     * @private
     */
    get startMarker(): BookmarkStart {
        return this.startMarkerValue;
    }
    /**
     * End marker (internal alias of {@link bookmarkEnd}).
     *
     * @private
     */
    get endMarker(): BookmarkEnd | undefined {
        return this.endMarkerValue;
    }
}

type BookmarkMarker = BookmarkStart | BookmarkEnd;

function parseBookmarkStart(element: OpenXmlElement): BookmarkStart | undefined {
    if (!isWml(element, 'bookmarkStart')) {
        return undefined;
    }
    const bookmarkIdRaw: number | undefined = parseBookmarkId(wmlAttribute(element, 'id'));
    const name: string | undefined = wmlAttribute(element, 'name');
    if (bookmarkIdRaw === undefined || name === undefined || !isValidBookmarkName(name)) {
        return undefined;
    }
    const consumed: Set<string> = new Set<string>();
    consumed.add('id');
    consumed.add('name');
    const firstColumnRaw: string | undefined = wmlAttribute(element, 'colFirst');
    const firstColumn: number | undefined = parseColumnIndex(firstColumnRaw);
    if (firstColumnRaw !== undefined && firstColumn !== undefined) {
        consumed.add('colFirst');
    }
    const lastColumnRaw: string | undefined = wmlAttribute(element, 'colLast');
    const lastColumn: number | undefined = parseColumnIndex(lastColumnRaw);
    if (lastColumnRaw !== undefined && lastColumn !== undefined) {
        consumed.add('colLast');
    }
    return BookmarkStart.createFromOpenXml(bookmarkIdRaw, name, {
        firstColumn: firstColumn,
        lastColumn: lastColumn,
        residualAttributes: residualAttributesOf(element, consumed)
    });
}

function parseBookmarkEnd(element: OpenXmlElement): BookmarkEnd | undefined {
    if (!isWml(element, 'bookmarkEnd')) {
        return undefined;
    }
    const bookmarkIdRaw: number | undefined = parseBookmarkId(wmlAttribute(element, 'id'));
    if (bookmarkIdRaw === undefined) {
        return undefined;
    }
    return BookmarkEnd.createFromOpenXml(bookmarkIdRaw);
}

/**
 * Public API: Try to parse a bookmark start from an OpenXML element.
 * Used by paragraph parsing to create direct ParagraphItem instances.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {BookmarkStart | undefined} The result.
 * @private
 */
export function tryParseBookmarkStart(element: OpenXmlElement): BookmarkStart | undefined {
    return parseBookmarkStart(element);
}

/**
 * Public API: Try to parse a bookmark end from an OpenXML element.
 * Used by paragraph parsing to create direct ParagraphItem instances.
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {BookmarkEnd | undefined} The result.
 * @private
 */
export function tryParseBookmarkEnd(element: OpenXmlElement): BookmarkEnd | undefined {
    return parseBookmarkEnd(element);
}

/**
 * Collect bookmark markers from all paragraphs in document order
 * (main story + nested feature paragraphs such as table cells).
 *
 * Bookmarks may be stored as:
 * 1. Direct ParagraphItems (BookmarkStart, BookmarkEnd extending ParagraphItem)
 * 2. Wrapped in FeatureInlineParagraphItem (legacy, for backward compatibility)
 *
 * @param {WordDocument} document - The document.
 * @returns {BookmarkMarker[]} The result.
 * @private
 */
function collectBookmarkMarkersInDocumentOrder(document: WordDocument): BookmarkMarker[] {
    const markers: BookmarkMarker[] = [];
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        const content: ParagraphItem[] = paragraph.items.toArray();
        for (const item of content) {
            if (item === undefined) {
                continue;
            }

            // Handle direct bookmark items (new approach)
            if (item instanceof BookmarkStart || item instanceof BookmarkEnd) {
                markers.push(item);
                continue;
            }

            // Handle wrapped feature inline items (legacy, for backward compatibility)
            if (item instanceof FeatureInlineParagraphItem) {
                if (item.value instanceof BookmarkStart || item.value instanceof BookmarkEnd) {
                    markers.push(item.value);
                }
            }
        }
    });
    return markers;
}

function collectBookmarkIds(document: WordDocument, visit: (bookmarkId: number) => void): void {
    const markers: BookmarkMarker[] = collectBookmarkMarkersInDocumentOrder(document);
    for (const marker of markers) {
        visit(marker.bookmarkId);
    }
}

function usedBookmarkIds(document: WordDocument): Set<number> {
    const used: Set<number> = new Set<number>();
    collectBookmarkIds(document, (bookmarkId: number) => {
        used.add(bookmarkId);
    });
    return used;
}

function allocatePendingBookmarkId(document: WordDocument): number {
    const used: Set<number> = usedBookmarkIds(document);
    let candidate: number = -1;
    while (used.has(candidate)) {
        candidate -= 1;
    }
    return candidate;
}

function materializeBookmarkIds(document: WordDocument): void {
    // Get all paired bookmarks in document order
    const bookmarks: ReadonlyArray<Bookmark> = bookmarksInDocument(document);

    // Determine the next available ID after existing parsed bookmarks
    let nextId: number = 0;
    collectBookmarkIds(document, (bookmarkId: number) => {
        if (bookmarkId >= 0 && bookmarkId >= nextId) {
            nextId = bookmarkId + 1;
        }
    });

    // Assign the same ID to each bookmark pair
    for (const bookmark of bookmarks) {
        // Only materialize pending bookmarks (ID < 0)
        if (bookmark.bookmarkStart.isPendingBookmarkId()) {
            // Both start and end get the same ID
            bookmark.bookmarkStart.setBookmarkId(nextId);
            if (bookmark.bookmarkEnd !== undefined) {
                bookmark.bookmarkEnd.setBookmarkId(nextId);
            }
            nextId += 1;
        }
    }

    // Handle orphan bookmarks (unpaired starts/ends that weren't in pairs list)
    const pairedStarts: Set<BookmarkStart> = new Set<BookmarkStart>();
    const pairedEnds: Set<BookmarkEnd> = new Set<BookmarkEnd>();
    for (const bookmark of bookmarks) {
        pairedStarts.add(bookmark.bookmarkStart);
        if (bookmark.bookmarkEnd !== undefined) {
            pairedEnds.add(bookmark.bookmarkEnd);
        }
    }

    // Assign IDs to any orphan markers
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        for (const item of paragraph.items) {
            // Handle direct bookmark items
            if (item instanceof BookmarkStart && !pairedStarts.has(item) && item.isPendingBookmarkId()) {
                item.setBookmarkId(nextId);
                nextId += 1;
            }
            if (item instanceof BookmarkEnd && !pairedEnds.has(item) && item.isPendingBookmarkId()) {
                item.setBookmarkId(nextId);
                nextId += 1;
            }

            // Handle wrapped feature inline items (legacy)
            if (!(item instanceof FeatureInlineParagraphItem)) {
                continue;
            }
            if (item.value instanceof BookmarkStart && !pairedStarts.has(item.value) && item.value.isPendingBookmarkId()) {
                item.value.setBookmarkId(nextId);
                nextId += 1;
            }
            if (item.value instanceof BookmarkEnd && !pairedEnds.has(item.value) && item.value.isPendingBookmarkId()) {
                item.value.setBookmarkId(nextId);
                nextId += 1;
            }
        }
    });
}

function allocateBookmarkId(document: WordDocument): number {
    return allocatePendingBookmarkId(document);
}

/** Stable Bookmark identity for a start marker while its paired end is unchanged. */
const bookmarkByStart: WeakMap<BookmarkStart, Bookmark> = new WeakMap<BookmarkStart, Bookmark>();

/**
 * Pair starts to ends in document order using ID (for parsed DOCX) or name normalization.
 *
 * For each start:
 * - If both start and end have non-negative IDs (from parsed DOCX), pair by ID
 * - If markers have pending negative IDs, pair by normalized name in document order
 *
 * Pairing strategy:
 * - For each start, find the first subsequent unpaired end with matching ID or normalized name
 * - Duplicate starts before an end: first start pairs; later starts remain unpaired
 * - Orphan ends remain unpaired and are not included in the returned list
 * - All markers stay in the DOM
 *
 * @param {ReadonlyArray<BookmarkMarker>} markers - The markers.
 * @returns {Bookmark[]} The result.
 * @private
 */
function pairBookmarks(markers: ReadonlyArray<BookmarkMarker>): Bookmark[] {
    const pairedEnd: Set<BookmarkEnd> = new Set<BookmarkEnd>();
    const ranges: Bookmark[] = [];
    for (const [i, marker] of markers.entries()) {
        if (!(marker instanceof BookmarkStart)) {
            continue;
        }
        const start: BookmarkStart = marker;
        const startNormalized: string = normalizeBookmarkName(start.name);
        for (let j: number = i + 1; j < markers.length; j += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const candidate: BookmarkMarker = markers[j];
            if (!(candidate instanceof BookmarkEnd)) {
                continue;
            }
            if (pairedEnd.has(candidate)) {
                continue;
            }
            // Match by ID if both are materialized (>= 0), otherwise by normalized name
            const pairsByIdMatch: boolean = start.bookmarkId >= 0 &&
                                             candidate.bookmarkId >= 0 &&
                                             candidate.bookmarkId === start.bookmarkId;
            const pairsByNameMatch: boolean = normalizeBookmarkName(candidate.name) === startNormalized;
            if (!pairsByIdMatch && !pairsByNameMatch) {
                continue;
            }
            pairedEnd.add(candidate);
            let bookmark: Bookmark = bookmarkByStart.get(start);
            if (bookmark === undefined || bookmark.bookmarkEnd !== candidate) {
                bookmark = new Bookmark(start, candidate);
                bookmarkByStart.set(start, bookmark);
            }
            ranges.push(bookmark);
            break;
        }
    }
    return ranges;
}

/**
 * All paired bookmarks in document order of their start markers.
 *
 * Orphan start/end markers are omitted from the list but remain in the DOM
 * and continue to serialize.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<Bookmark>} The result.
 * @private
 */
export function bookmarksInDocument(document: WordDocument): ReadonlyArray<Bookmark> {
    return pairBookmarks(collectBookmarkMarkersInDocumentOrder(document));
}

/**
 * Named bookmarks whose start marker lives in `paragraph`, in document order.
 *
 * Cross-paragraph bookmarks are included when their **start** is in this
 * paragraph. Orphans are omitted.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<Bookmark>} The result.
 * @private
 */
export function bookmarksInParagraph(paragraph: Paragraph): ReadonlyArray<Bookmark> {
    const document: WordDocument = paragraph.owningDocument();
    const all: ReadonlyArray<Bookmark> = bookmarksInDocument(document);
    const found: Bookmark[] = [];
    for (const bookmark of all) {
        const startLoc: BookmarkMarkerLocation = locateBookmarkMarker(document, bookmark.bookmarkStart);
        if (startLoc !== undefined && startLoc.paragraph === paragraph) {
            found.push(bookmark);
        }
    }
    return found;
}

/**
 * First paired bookmark whose name matches case-insensitively, document order.
 *
 * Comparison is case-insensitive using lowercase normalization.
 *
 * @param {WordDocument} document - The document.
 * @param {string} name - The name (case-insensitive).
 * @returns {Bookmark | undefined} The result.
 * @private
 */
export function bookmarkByName(document: WordDocument, name: string): Bookmark | undefined {
    const normalized: string = normalizeBookmarkName(name);
    const all: ReadonlyArray<Bookmark> = bookmarksInDocument(document);
    for (const bookmark of all) {
        if (normalizeBookmarkName(bookmark.name) === normalized) {
            return bookmark;
        }
    }
    return undefined;
}

/**
 * Host location of a modeled bookmark marker (paragraph inline only).
 *
 * @private
 */
type BookmarkMarkerLocation = {
    readonly paragraph: Paragraph;
    readonly index: number;
};

/**
 * Locate a bookmark marker among paragraph inlines (document-wide walk).
 *
 * Checks both direct bookmark items and wrapped feature inline items.
 *
 * @param {WordDocument} document - The document.
 * @param {BookmarkStart | BookmarkEnd} marker - The marker.
 * @returns {BookmarkMarkerLocation | undefined} The result.
 * @private
 */
function locateBookmarkMarker(
    document: WordDocument,
    marker: BookmarkStart | BookmarkEnd
): BookmarkMarkerLocation | undefined {
    let found: BookmarkMarkerLocation | undefined;
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        if (found !== undefined) {
            return;
        }
        const content: ParagraphItem[] = paragraph.items.toArray();
        for (const [i, item] of content.entries()) {
            if (item === undefined) {
                continue;
            }

            // Check for direct bookmark item
            if (item === marker) {
                found = { paragraph: paragraph, index: i };
                return;
            }

            // Check for wrapped feature inline item
            if (
                item instanceof FeatureInlineParagraphItem &&
                item.value === marker
            ) {
                found = { paragraph: paragraph, index: i };
                return;
            }
        }
    });
    return found;
}

/**
 * Remove a bookmark marker from its paragraph.
 * Handles both direct ParagraphItem and wrapped FeatureInline cases.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {BookmarkStart | BookmarkEnd} marker - The marker.
 * @returns {void}
 * @private
 */
function removeBookmarkMarker(paragraph: Paragraph, marker: BookmarkStart | BookmarkEnd): void {
    // First try to find and remove as a direct item
    try {
        const index: number = paragraph.items.indexOf(marker);
        if (index >= 0) {
            paragraph.items.removeAt(index);
            return;
        }
    } catch (e) {
        // indexOf might fail, continue to next approach
    }

    // Try to remove as wrapped feature inline (legacy path)
    try {
        paragraph.removeFeatureInline(marker as any);
    } catch (e) {
        throw new DocxError('content/unknown-bookmark', 'Bookmark marker is not in this paragraph');
    }
}

/**
 * Remove start and end markers of a paired bookmark; enclosed content is kept.
 *
 * Markers may live in different paragraphs. Throws
 * {@link DocxError} `content/unknown-bookmark` when either marker is missing.
 *
 * @param {WordDocument} document - The document.
 * @param {Bookmark} bookmark - The bookmark.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeBookmark(document: WordDocument, bookmark: Bookmark): void {
    const startLoc: BookmarkMarkerLocation = locateBookmarkMarker(document, bookmark.bookmarkStart);
    const endLoc: BookmarkMarkerLocation = locateBookmarkMarker(document, bookmark.bookmarkEnd);
    if (startLoc === undefined || endLoc === undefined) {
        throw new DocxError('content/unknown-bookmark', 'Bookmark markers are not in this document');
    }
    // Remove higher document-order index first when same paragraph so indices stay valid.
    if (startLoc.paragraph === endLoc.paragraph) {
        if (endLoc.index > startLoc.index) {
            removeBookmarkMarker(endLoc.paragraph, bookmark.bookmarkEnd);
            // Relocate start after end is removed
            const startReloc: BookmarkMarkerLocation = locateBookmarkMarker(document, bookmark.bookmarkStart);
            if (startReloc === undefined) {
                throw new DocxError('content/unknown-bookmark', 'Bookmark start marker is not in this document');
            }
            removeBookmarkMarker(startReloc.paragraph, bookmark.bookmarkStart);
        }
        else {
            removeBookmarkMarker(startLoc.paragraph, bookmark.bookmarkStart);
            // Relocate end after start is removed
            const endReloc: BookmarkMarkerLocation = locateBookmarkMarker(document, bookmark.bookmarkEnd);
            if (endReloc === undefined) {
                throw new DocxError('content/unknown-bookmark', 'Bookmark end marker is not in this document');
            }
            removeBookmarkMarker(endReloc.paragraph, bookmark.bookmarkEnd);
        }
    }
    else {
        // Different paragraphs — order does not affect indices across hosts.
        removeBookmarkMarker(endLoc.paragraph, bookmark.bookmarkEnd);
        removeBookmarkMarker(startLoc.paragraph, bookmark.bookmarkStart);
    }
    bookmarkByStart.delete(bookmark.bookmarkStart);
}

/**
 * Live query collection of paired bookmarks on a {@link WordDocument}.
 *
 * Members are stable {@link Bookmark} views for the current start/end pairing.
 * Index properties refresh on {@link count} / mutation helpers.
 *
 * @private
 */
export class BookmarkCollection implements Iterable<Bookmark> {
    readonly [index: number]: Bookmark;

    private readonly document: WordDocument;
    private cachedLength: number = 0;
    /**
     * @param {WordDocument} document - The document.
     * @private
     */
    constructor(document: WordDocument) {
        this.document = document;
    }
    /**
     * Number of paired bookmarks in document order.
     *
     * @public
     */
    get count(): number {
        this.rebuildIndexProperties();
        return this.cachedLength;
    }
    /**
     * Bookmark at zero-based `index`, or `undefined` when out of range.
     *
     * @param {number} index - Specifies the index.
     * @returns {Bookmark | undefined} Returns the result.
     * @public
     */
    itemAt(index: number): Bookmark | undefined {
        const items: ReadonlyArray<Bookmark> = bookmarksInDocument(this.document);
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return items[index];
    }
    /**
     * Plain text between a bookmark's start and end markers (paragraphs joined by a line feed),
     * or `undefined` when no bookmark has that name.
     *
     * @param {string} name - The bookmark name (case-sensitive).
     * @returns {string | undefined} The text.
     * @private
     */
    getContent(name: string): string | undefined {
        const bookmark: Bookmark | undefined = this.findByName(name);
        if (bookmark === undefined) {
            return undefined;
        }
        let inside: boolean = false;
        let done: boolean = false;
        let started: boolean = false;
        let text: string = '';
        visitParagraphsInDocumentOrder(this.document, (paragraph: Paragraph) => {
            if (done) {
                return;
            }
            if (inside && started) {
                text += '\n';
            }
            for (const item of paragraph.items.toArray()) {
                if (done) {
                    break;
                }
                // Markers are direct paragraph items after load, or wrapped inlines when authored.
                const marker: unknown = item instanceof FeatureInlineParagraphItem ? item.value : item;
                if (marker === bookmark.startMarker) {
                    inside = true;
                } else if (marker === bookmark.endMarker) {
                    done = true;
                }
                else if (inside && item instanceof TextRange) {
                    text += item.text;
                    started = true;
                }
            }
        });
        return text;
    }
    /**
     * First bookmark whose name matches exactly (case-sensitive).
     *
     * @param {string} name - Specifies the name.
     * @returns {Bookmark | undefined} Returns the result.
     * @public
     */
    findByName(name: string): Bookmark | undefined {
        return bookmarkByName(this.document, name);
    }
    /**
     * Remove markers for `bookmark`; content between markers is preserved.
     *
     * @param {Bookmark} bookmark - Specifies the bookmark.
     * @returns {void} Nothing.
     * @throws DocxError `content/unknown-bookmark` when markers are detached.
     * @public
     */
    remove(bookmark: Bookmark): void {
        removeBookmark(this.document, bookmark);
        this.rebuildIndexProperties();
    }
    /**
     * Remove the bookmark at zero-based `index`.
     *
     * @param {number} index - Specifies the index.
     * @returns {void} Nothing.
     * @throws RangeError when `index` is out of range.
     * @public
     */
    removeAt(index: number): void {
        const items: ReadonlyArray<Bookmark> = bookmarksInDocument(this.document);
        if (index < 0 || index >= items.length) {
            throw new RangeError('Bookmark index ' + String(index) + ' is out of range');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        removeBookmark(this.document, items[index]!);
        this.rebuildIndexProperties();
    }
    /**
     * Remove every paired bookmark’s markers; content is preserved.
     *
     * @returns {void} Nothing.
     * @public
     */
    clear(): void {
        const items: Bookmark[] = bookmarksInDocument(this.document).slice();
        for (const bookmark of items) {
            removeBookmark(this.document, bookmark);
        }
        this.rebuildIndexProperties();
    }
    [Symbol.iterator](): Iterator<Bookmark> {
        const items: Bookmark[] = bookmarksInDocument(this.document).slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Bookmark> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Bookmark };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Bookmark = items[i]!;
                i += 1;
                return { done: false, value: value };
            }
        };
    }
    /**
     * Refresh numeric index properties from the current pairing.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    rebuildIndexProperties(): void {
        const items: ReadonlyArray<Bookmark> = bookmarksInDocument(this.document);
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                Object.defineProperty(this, key, {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    value: items[i],
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
            else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }
}
const bookmarkCollections: WeakMap<WordDocument, BookmarkCollection> = new WeakMap<WordDocument, BookmarkCollection>();

/**
 * Stable public {@link BookmarkCollection} for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {BookmarkCollection} The result.
 * @private
 */
export function bookmarkCollectionFor(document: WordDocument): BookmarkCollection {
    registerBookmarksFeature();
    const cached: BookmarkCollection = bookmarkCollections.get(document);
    if (cached !== undefined) {
        cached.rebuildIndexProperties();
        return cached;
    }
    const created: BookmarkCollection = new BookmarkCollection(document);
    created.rebuildIndexProperties();
    bookmarkCollections.set(document, created);
    return created;
}

Object.defineProperty(WordDocument.prototype, 'bookmarks', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): BookmarkCollection {
        return bookmarkCollectionFor(this);
    }
});

let registered: boolean = false;

/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetBookmarksFeatureForTests(): void {
    registered = false;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 * Register bookmark inline handlers. Idempotent.
 */
export function registerBookmarksFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: BOOKMARKS });
    registerFeatureInlineHandler({
        featureId: BOOKMARKS,
        wmlLocalName: 'bookmarkStart',
        tryParse(element: OpenXmlElement): BookmarkStart | undefined {
            return parseBookmarkStart(element);
        }
    });
    registerFeatureInlineHandler({
        featureId: BOOKMARKS,
        wmlLocalName: 'bookmarkEnd',
        tryParse(element: OpenXmlElement): BookmarkEnd | undefined {
            return parseBookmarkEnd(element);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: BOOKMARKS,
        materialize(document: WordDocument): void {
            materializeBookmarkIds(document);
        }
    });
}

/**
 * Whether paragraph inline content is a modeled bookmark start from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isBookmarkStartInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: BookmarkStart } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === BOOKMARKS &&
        inline.value instanceof BookmarkStart
    );
}

/**
 * Whether paragraph inline content is a modeled bookmark end from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isBookmarkEndInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: BookmarkEnd } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === BOOKMARKS &&
        inline.value instanceof BookmarkEnd
    );
}

registerAlwaysOnBodyFeatureBootstrap(() => {
    registerBookmarksFeature();
});
registerBookmarksFeature();
