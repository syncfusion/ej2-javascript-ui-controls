/**
 * Classic cell notes (sticky comments) — text balloons anchored to worksheet cells.
 *
 * Use {@link Worksheet.comments} or the cell helpers {@link Cell.comment} /
 * {@link Cell.addComment} to add, read, and remove notes. Each note has author,
 * text, visibility, and optional width/height. Package parts are written on save.
 *
 * For modern Excel discussion threads with replies, see threaded comments instead.
 *
 * Citations:
 * - ECMA-376-1 §18.7 `comments` / `authors` / `author` / `comment`
 * (`CT_Comments`, `CT_Comment` `@ref` + `@authorId`, child `CT_Rst`)
 * - ECMA-376-1 content-type table
 * `application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml`
 * - ECMA-376-4 relationships table
 * `http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments`
 * (Strict twin `http://purl.oclc.org/ooxml/officeDocument/relationships/comments`)
 * - ECMA-376-4 §19.4.2.12 ClientData Note example (`t202`, `#ffffe1`,
 * `Row`/`Column` 0-based, `Visible`) and ECMA-376-1 Annex L.5.5.2
 * - docs/specs/comments.md; docs/requirements/comments.md;
 * docs/api/COMMENTS-PROPOSAL.md (accepted v1)
 *
 * @private
 */

import { formatA1, formatA1Range, parseA1, CellCoord, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidCommentError } from '../core/errors';
import { COMMENTS_CONTENT_TYPE, COMMENTS_REL_TYPE_TRANSITIONAL, isCommentsRelationshipType } from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { normalizePartName, partNamesEqual } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { Emu, isLength, lengthToEmu, Length } from '../core/length';
import { decodeUtf8, encodeUtf8, escapeXml, escapeXmlText, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';
import { FormControlsImpl } from './form-controls';

/** Default note box 100.8 pt × 60.6 pt, matching the size MS Excel writes for a new note. */
const DEFAULT_NOTE_WIDTH_EMU: number = Math.round(100.8 * 12_700);
const DEFAULT_NOTE_HEIGHT_EMU: number = Math.round(60.6 * 12_700);

/** Default column width (64px) and row height (20px) used for note anchor geometry. */
const NOTE_DEFAULT_COL_PX: number = 64;
const NOTE_DEFAULT_ROW_PX: number = 20;

/** Comment note textbox shape type (t202). Citation: ECMA-376-4 note example. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const NOTE_SHAPE_TYPE_ID: '_x0000_t202' = '_x0000_t202';

/**
 * Options when adding a classic cell note with {@link Comments.add} or {@link Cell.addComment}.
 *
 * Provide either {@link ref} (A1 address) or {@link row} and {@link column} (1-based).
 * On a cell helper, the target cell is already known so those fields are omitted.
 *
 * @private
 */
export interface AddCommentOptions {
    /** Cell address in A1 form (for example `"B2"`). */
    readonly ref?: string;
    /** 1-based row number of the anchor cell. */
    readonly row?: number;
    /** 1-based column number of the anchor cell. */
    readonly column?: number;
    /** Note body text. Default empty. */
    readonly text?: string;
    /** Display name of the author. Default empty. */
    readonly author?: string;
    /** Whether the note box is shown without hovering. Default follows Excel defaults. */
    readonly isVisible?: boolean;
    /** Width of the note box (use length helpers such as `Pt` / `Px`). */
    readonly width?: Length;
    /** Height of the note box (use length helpers such as `Pt` / `Px`). */
    readonly height?: Length;
}

/**
 * One classic sticky note on a cell.
 *
 * Change text, author, visibility, or size; call {@link delete} to remove the note.
 */
export interface Comment {
    /** A1 address of the anchor cell. */
    readonly address: string;
    /** 1-based row of the anchor cell. */
    readonly row: number;
    /** 1-based column of the anchor cell. */
    readonly column: number;
    /** Note body text. */
    text: string;
    /** Author display name. */
    author: string;
    /** Whether the note is shown without hovering. */
    isVisible: boolean;
    /** Width of the note box. */
    width: Length;
    /** Height of the note box. */
    height: Length;
    /**
     * `true` when this entry is Excel's legacy placeholder for a threaded
     * comment, not a classic sticky note.
     *
     * Excel stores one comments-part comment per top-level thread with author
     * `tc={guid}` ([MS-XLSX] §2.3.7.3). Those rows appear in
     * {@link Worksheet.comments} beside real notes. The discussion itself is
     * {@link Worksheet.threadedComments}.
     */
    readonly isThreadedComments: boolean;
    /** Remove this note from the worksheet. */
    delete(): void;
}

/**
 * All classic cell notes on a worksheet ({@link Worksheet.comments}).
 */
export interface Comments {
    /** Number of notes on the sheet. */
    readonly length: number;
    /** Iterate every note. */
    [Symbol.iterator](): IterableIterator<Comment>;
    /** Note at a zero-based index. */
    item(index: number): Comment;
    /** Add a note; the target cell is required via `ref` or `row`/`column`. */
    add(options: AddCommentOptions): Comment;
    /** Remove a note by handle, A1 address, or zero-based index. */
    remove(target: Comment | string | number): void;
    /** Note at an A1 address, or `undefined` if none. */
    get(ref: string): Comment | undefined;
    /** Note at a 1-based row and column, or `undefined` if none. */
    get(row: number, column: number): Comment | undefined;
    /** Whether the cell at an A1 address has a note. */
    has(ref: string): boolean;
    /** Whether the cell at a 1-based row and column has a note. */
    has(row: number, column: number): boolean;
}

/** Internal entry for one note. @private */
export interface CommentEntry {
    /** 0-based row. */
    row0: number;
    /** 0-based col. */
    col0: number;
    text: string;
    author: string;
    isVisible: boolean;
    widthEmu: number;
    heightEmu: number;
}

/** Host notifications + package access for the comments model. @private */
export interface CommentsHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
}

/** Comments materialize result for worksheet flush bookkeeping. @private */
export interface CommentsMaterializeResult {
    /** Relationships to pass on (comments rel re-added when present). */
    readonly sheetRels: ReadonlyArray<OpcRelationship>;
}

/**
 * One top-level threaded-comment anchor to publish in the same comments part
 * as classic notes. [MS-XLSX] §2.3.7.3 — author string `tc={uid}`.
 *
 * @private
 */
export interface ThreadedCommentPlaceholder {
    /** Cell A1 of the top-level thread. */
    readonly ref: string;
    /** Braced thread id (same form as the threaded-comment `id`). */
    readonly threadId: string;
    /** Opening thread text copied into the legacy comments part. Replies are not copied. */
    readonly text?: string;
}

/**
 * Mutable classic-notes collection for one worksheet.
 *
 * @private
 */
export class CommentsImpl implements Comments {
    private readonly entries: CommentEntry[] = [];
    private readonly handles: Map<CommentEntry, CommentHandle> = new Map<CommentEntry, CommentHandle>();
    /** Shared sheet-scoped author list (append-only). */
    private authors: string[] = [];
    private host: CommentsHost | undefined;
    private formControls: FormControlsImpl | undefined;
    private commentsPartName: string | undefined;
    private commentsRelId: string | undefined;
    private loadedFromPackage: boolean = false;
    private overlayActive: boolean = false;

    /**
     * bindHost method.
     *
     * @param {CommentsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: CommentsHost): void {
        this.host = host;
    }

    /**
     * Wire the shared VML host (single VML writer). @private
     *
     * @param {FormControlsImpl} formControls - The formControls parameter.
     * @returns {void} - Returns the result.
     */
    public bindFormControls(formControls: FormControlsImpl): void {
        this.formControls = formControls;
    }

    /**
     * Gets length.
     *
     * @returns {number} - Returns the result.
     */
    public get length(): number {
        return this.entries.length;
    }

    /**
     * [Symbol.iterator] method.
     *
     * @returns {Object} - Returns the result.
     */
    public [Symbol.iterator](): IterableIterator<Comment> {
        // Iterate live entries so handleFor keys match the stored model
        // (snapshot clones would break Map identity for mutations).
        let index: number = 0;
        const live: CommentEntry[] = this.entries;
        return {
            next: (): IteratorResult<Comment> => {
                if (index >= live.length) {
                    return { done: true, value: undefined as unknown as Comment };
                }
                // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
                const entry: CommentEntry = live[index];
                index += 1;
                if (entry === undefined) {
                    return { done: true, value: undefined as unknown as Comment };
                }
                return { done: false, value: this.handleFor(entry) };
            },
            /**
             * [Symbol.iterator] method.
             *
             * @returns {Object} - Returns the result.
             */
            [Symbol.iterator](): IterableIterator<Comment> {
                return this;
            }
        };
    }

    /**
     * item method.
     *
     * @param {number} index - The index parameter.
     * @returns {Comment} - Returns the result.
     */
    public item(index: number): Comment {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: CommentEntry = this.entries[index];
        if (!Number.isInteger(index) || index < 0 || entry === undefined) {
            throw new InvalidArgumentError(`Comment index ${String(index)} is out of range`);
        }
        return this.handleFor(entry);
    }

    /**
     * add method.
     *
     * @param {AddCommentOptions} options - The options parameter.
     * @returns {Comment} - Returns the result.
     */
    public add(options: AddCommentOptions): Comment {
        const entry: CommentEntry = this.createEntryFromOptions(options);
        this.entries.push(entry);
        this.ensureAuthor(entry.author);
        if (this.host != null) {
            this.host.markDirty();
        }
        return this.handleFor(entry);
    }

    /**
     * remove method.
     *
     * @param {Object} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public remove(target: Comment | string | number): void {
        if (typeof target === 'string') {
            const coord: CellCoord = parseA1(target);
            const idx: number = this.indexOfCell(coord.row, coord.col);
            if (idx < 0) {
                return;
            }
            const [removed] = this.entries.splice(idx, 1);
            if (removed !== undefined) {
                this.handles.delete(removed);
            }
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }
        if (typeof target === 'number') {
            if (!Number.isInteger(target) || target < 0 || target >= this.entries.length) {
                throw new InvalidArgumentError(`Comment index ${String(target)} is out of range`);
            }
            const [removed] = this.entries.splice(target, 1);
            if (removed !== undefined) {
                this.handles.delete(removed);
            }
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }
        if (target === null || typeof target !== 'object' || !(target instanceof CommentHandle)) {
            throw new InvalidArgumentError('remove(target) requires a Comment handle, A1 ref, or 0-based index');
        }
        const entry: CommentEntry = target.entry;
        const idx: number = this.entries.indexOf(entry);
        if (idx < 0) {
            throw new InvalidCommentError('Comment is not on this worksheet');
        }
        this.entries.splice(idx, 1);
        this.handles.delete(entry);
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * get method.
     *
     * @param {Object} a - The a parameter.
     * @param {number} b - The b parameter.
     * @returns {*} - Returns the result.
     */
    public get(a: string | number, b?: number): Comment | undefined {
        const coord: CellCoord =
            typeof a === 'string'
                ? parseA1(a)
                : typeof a === 'number' && typeof b === 'number'
                    ? (formatA1(a, b), { row: a, col: b })
                    : undefined;
        if (coord === undefined) {
            throw new InvalidArgumentError('get() requires an A1 ref or 1-based (row, column)');
        }
        const entry: CommentEntry = this.entryAt(coord.row, coord.col);
        return entry === undefined ? undefined : this.handleFor(entry);
    }

    /**
     * has method.
     *
     * @param {Object} a - The a parameter.
     * @param {number} b - The b parameter.
     * @returns {boolean} - Returns the result.
     */
    public has(a: string | number, b?: number): boolean {
        const coord: CellCoord =
            typeof a === 'string'
                ? parseA1(a)
                : typeof a === 'number' && typeof b === 'number'
                    ? (formatA1(a, b), { row: a, col: b })
                    : undefined;
        if (coord === undefined) {
            throw new InvalidArgumentError('has() requires an A1 ref or 1-based (row, column)');
        }
        return this.entryAt(coord.row, coord.col) !== undefined;
    }

    // ── Cell wiring ────────────────────────────────────────────────────────────

    /**
     * Cell-path add (cell receiver is the target). @private
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @param {AddCommentOptions} options - The options parameter.
     * @returns {Comment} - Returns the result.
     */
    public addForCell(row: number, col: number, options: AddCommentOptions): Comment {
        const entry: CommentEntry = this.createEntryFromOptions({
            ...options,
            row,
            column: col
        });
        this.entries.push(entry);
        this.ensureAuthor(entry.author);
        if (this.host != null) {
            this.host.markDirty();
        }
        return this.handleFor(entry);
    }

    /**
     * Cell-path handle (no copy semantics; live). @private
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @returns {*} - Returns the result.
     */
    public getForCell(row: number, col: number): Comment | undefined {
        const entry: CommentEntry = this.entryAt(row, col);
        return entry === undefined ? undefined : this.handleFor(entry);
    }

    /**
     * Cell-path remove. @private
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @returns {void} - Returns the result.
     */
    public removeForCell(row: number, col: number): void {
        const idx: number = this.indexOfCell(row, col);
        if (idx < 0) {
            return;
        }
        const [removed] = this.entries.splice(idx, 1);
        if (removed !== undefined) {
            this.handles.delete(removed);
        }
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    // ── Load / flush ───────────────────────────────────────────────────────────

    /**
     * Replace contents from parse (does not mark dirty). @private
     *
     * @param {*} model - model value.
     * @returns {void} Nothing.
     */
    public replaceFromParse(model: { readonly entries: ReadonlyArray<CommentEntry>; readonly authors: ReadonlyArray<string> }): void {
        this.entries.length = 0;
        this.handles.clear();
        for (const e of model.entries) {
            this.entries.push({ ...e });
        }
        this.authors = [...model.authors];
    }

    /**
     * Serialize the comments part XML (root + authors + commentList). @private
     *
     * @returns {string} - Returns the result.
     */
    public toCommentsXml(): string | undefined {
        if (this.entries.length === 0) {
            return undefined;
        }
        return serializeCommentsXml(this.snapshotEntries(), this.authors);
    }

    /**
     * Load comments model from the package (sheet rels). Call during `ensureSheetDataLoaded` **after** form controls have loaded their VML part so note-chrome correlation can run.
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} sheetPartName - The sheetPartName parameter.
     * @returns {void} - Returns the result.
     */
    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.handles.clear();
        this.authors = [];
        this.commentsPartName = undefined;
        this.commentsRelId = undefined;
        this.loadedFromPackage = true;
        this.overlayActive = false;

        if (sheetPartName === undefined) {
            return;
        }
        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPartName);
        const rel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isCommentsRelationshipType(r.type));
        if (rel === undefined) {
            return;
        }
        this.commentsRelId = rel.id;
        const partName: string = normalizePartName(rel.resolvedTarget);
        this.commentsPartName = partName;
        const part: any = pkg.getPart(partName);
        if (part === undefined) {
            return;
        }
        const xml: string = decodeUtf8(part.data);
        const { authors, entries } = parseCommentsPart(xml);
        this.authors = authors;
        for (const e of entries) {
            this.entries.push(e);
        }
        this.correlateNoteChrome();
    }

    /**
     * Overlay note chrome from the loaded VML (isVisible / size).
     *
     * @returns {void} - Returns the result.
     */
    private correlateNoteChrome(): void {
        const fc: FormControlsImpl = this.formControls;
        if (fc === undefined) {
            return;
        }
        const chrome: Map<string, any> = fc.noteChromeByKey();
        for (const e of this.entries) {
            const info: any = chrome.get(`${e.row0}:${e.col0}`);
            if (info === undefined) {
                continue;
            }
            e.isVisible = info.isVisible;
            if (info.widthEmu !== undefined) {
                e.widthEmu = info.widthEmu;
            }
            if (info.heightEmu !== undefined) {
                e.heightEmu = info.heightEmu;
            }
        }
    }

    /**
     * Materialize the comments part + relationship and inject the note overlay. Call during worksheet flush **before** formControls.materializeOnFlush.
     *
     * @param {Object} existingSheetRels - The existingSheetRels parameter.
     * @param {FormControlsImpl} formControls - The formControls parameter.
     * @returns {CommentsMaterializeResult} - Returns the result.
     */
    public materializeOnFlush(
        existingSheetRels: ReadonlyArray<OpcRelationship>,
        formControls: FormControlsImpl,
        threadedPlaceholders?: ReadonlyArray<ThreadedCommentPlaceholder>
    ): CommentsMaterializeResult {
        const placeholders: ReadonlyArray<ThreadedCommentPlaceholder> =
            threadedPlaceholders != null ? threadedPlaceholders : [];
        const retained: OpcRelationship[] = existingSheetRels.filter((r: OpcRelationship): boolean => !isCommentsRelationshipType(r.type));

        if (this.entries.length === 0 && placeholders.length === 0) {
            // Empty model: drop the part + rel when we wrote it earlier (or the
            // package had one and every note was deleted).
            if (this.commentsPartName !== undefined) {
                const dropHost: CommentsHost = this.host;
                if (dropHost != null) {
                    dropHost.package.removePart(this.commentsPartName);
                }
                this.commentsPartName = undefined;
                this.commentsRelId = undefined;
            }
            formControls.setCommentNoteShapes([]);
            this.overlayActive = true;
            return { sheetRels: retained };
        }

        const host: CommentsHost = this.host;
        const sheetPartName: string = host == null ? undefined : host.sheetPartName;
        if (host === undefined || sheetPartName === undefined) {
            return { sheetRels: retained };
        }

        const sorted: CommentEntry[] = this.snapshotEntries();
        const shapeIds: number[] = [];
        for (let i: number = 0; i < sorted.length; i++) {
            shapeIds.push(formControls.allocateNoteShapeId());
        }
        const xml: string = serializeCommentsXml(sorted, this.authors, placeholders, shapeIds);
        const claimed: string | undefined =
            this.commentsPartName != null
                ? this.commentsPartName
                : claimUnreferencedCommentsPart(host.package, sheetPartName);
        const partName: string = claimed != null ? claimed : allocateCommentsPartName(host.package);
        this.commentsPartName = partName;
        host.package.setPart(partName, encodeUtf8(xml), COMMENTS_CONTENT_TYPE);

        let maxNum: number = 0;
        for (const r of retained) {
            const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
            if (m !== null && m[1] !== undefined) {
                const n: number = Number.parseInt(m[1], 10);
                if (Number.isFinite(n) && n > maxNum) {
                    maxNum = n;
                }
            }
        }
        let relId: string = this.commentsRelId;
        if (relId === undefined || retained.some((r: OpcRelationship): boolean => r.id === relId)) {
            maxNum += 1;
            relId = `rId${maxNum}`;
        }
        this.commentsRelId = relId;

        const target: string = relativeTargetFromSheetToComments(sheetPartName, partName);
        const commentsRel: OpcRelationship = {
            id: relId,
            type: COMMENTS_REL_TYPE_TRANSITIONAL,
            target,
            // Absolute resolved part name for package bookkeeping (mirrors
            // resolveRelationshipTarget semantics for sibling-directory targets).
            resolvedTarget: partName
        };

        const overlay: string[] = buildNoteShapeOverlay(sorted, shapeIds);
        const threadNotes: string[] = [];
        for (const p of placeholders) {
            const addr: { row0: number; col0: number } | undefined = noteAnchorFromRef(p.ref);
            if (addr === undefined) {
                continue;
            }
            threadNotes.push(serializeNoteShapeXml(
                {
                    row0: addr.row0,
                    col0: addr.col0,
                    author: '',
                    text: '',
                    isVisible: false,
                    widthEmu: DEFAULT_NOTE_WIDTH_EMU,
                    heightEmu: DEFAULT_NOTE_HEIGHT_EMU
                },
                formControls.allocateNoteShapeId()
            ));
        }
        formControls.setCommentNoteShapes([...overlay, ...threadNotes]);
        this.overlayActive = true;
        return { sheetRels: [...retained, commentsRel] };
    }

    /**
     * Ensure the shared author list contains `author` (append-only).
     *
     * @param {string} author - The author parameter.
     * @returns {void} - Returns the result.
     */
    private ensureAuthor(author: string): void {
        if (this.authors.indexOf(author) < 0) {
            this.authors.push(author);
        }
    }

    /**
     * entryAt method.
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @returns {*} - Returns the result.
     */
    private entryAt(row: number, col: number): CommentEntry | undefined {
        for (const e of this.entries) {
            if (e.row0 === row - 1 && e.col0 === col - 1) {
                return e;
            }
        }
        return undefined;
    }

    /**
     * indexOfCell method.
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @returns {number} - Returns the result.
     */
    private indexOfCell(row: number, col: number): number {
        for (let i: number = 0; i < this.entries.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: CommentEntry = this.entries[i];
            if (e !== undefined && e.row0 === row - 1 && e.col0 === col - 1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * snapshotEntries method.
     *
     * @returns {CommentEntry[]} - Returns the result.
     */
    public snapshotEntries(): CommentEntry[] {
        return this.entries.map((e: CommentEntry): any => ({ ...e }));
    }

    /**
     * handleFor method.
     *
     * @param {CommentEntry} entry - The entry parameter.
     * @returns {Comment} - Returns the result.
     */
    private handleFor(entry: CommentEntry): Comment {
        let h: CommentHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new CommentHandle(
                entry,
                (): void => {
                    this.onChange();
                },
                (): void => {
                    this.removeEntry(entry);
                }
            );
            this.handles.set(entry, h);
        }
        return h;
    }

    /**
     * Raise dirty after entry mutation.
     *
     * @returns {void} - Returns the result.
     */
    private onChange(): void {
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Remove a known entry (handle.delete path).
     *
     * @param {CommentEntry} entry - The entry parameter.
     * @returns {void} - Returns the result.
     */
    private removeEntry(entry: CommentEntry): void {
        const idx: number = this.entries.indexOf(entry);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        this.handles.delete(entry);
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * createEntryFromOptions method.
     *
     * @param {AddCommentOptions} options - The options parameter.
     * @returns {CommentEntry} - Returns the result.
     */
    private createEntryFromOptions(options: AddCommentOptions): CommentEntry {
        if (options === null || typeof options !== 'object') {
            throw new InvalidArgumentError('Comment options must be an object');
        }
        const target: CellCoord = resolveTarget(options);
        const existing: CommentEntry = this.entryAt(target.row, target.col);
        if (existing !== undefined) {
            throw new InvalidCommentError(`Cell ${formatA1(target.row, target.col)} already has a comment`);
        }
        const text: string = options.text === undefined ? '' : String(options.text);
        const author: string = options.author === undefined ? '' : String(options.author);
        const isVisible: boolean = options.isVisible === true;
        const widthEmu: number = options.width === undefined ? DEFAULT_NOTE_WIDTH_EMU : requirePositiveEmu(options.width, 'width');
        const heightEmu: number = options.height === undefined ? DEFAULT_NOTE_HEIGHT_EMU : requirePositiveEmu(options.height, 'height');
        return {
            row0: target.row - 1,
            col0: target.col - 1,
            text,
            author,
            isVisible,
            widthEmu,
            heightEmu
        };
    }
}

// ── Handle ────────────────────────────────────────────────────────────────────

/**
 * CommentHandle class.
 */
class CommentHandle implements Comment {
    /** @private */
    public readonly entry: CommentEntry;
    private readonly onChange: () => void;
    private readonly onDelete: () => void;

    /**
     * Creates an instance.
     *
     * @param {CommentEntry} entry - The entry parameter.
     * @param {any} onChange - The onChange parameter.
     * @param {any} onDelete - The onDelete parameter.
     */
    public constructor(entry: CommentEntry, onChange: () => void, onDelete: () => void) {
        this.entry = entry;
        this.onChange = onChange;
        this.onDelete = onDelete;
    }

    /**
     * Gets address.
     *
     * @returns {string} - Returns the result.
     */
    public get address(): string {
        return formatA1(this.entry.row0 + 1, this.entry.col0 + 1);
    }

    /**
     * Gets row.
     *
     * @returns {number} - Returns the result.
     */
    public get row(): number {
        return this.entry.row0 + 1;
    }

    /**
     * Gets column.
     *
     * @returns {number} - Returns the result.
     */
    public get column(): number {
        return this.entry.col0 + 1;
    }

    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('Comment text must be a string');
        }
        this.entry.text = value;
        this.onChange();
    }

    /**
     * Gets author.
     *
     * @returns {string} - Returns the result.
     */
    public get author(): string {
        return this.entry.author;
    }

    /**
     * Sets author.
     *
     * @param {string} value - The value parameter.
     */
    public set author(value: string) {
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('Comment author must be a string');
        }
        this.entry.author = value;
        this.onChange();
    }

    /**
     * Gets isVisible.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isVisible(): boolean {
        return this.entry.isVisible;
    }

    /**
     * Sets isVisible.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isVisible(value: boolean) {
        this.entry.isVisible = value === true;
        this.onChange();
    }

    /**
     * Gets width.
     *
     * @returns {Length} - Returns the result.
     */
    public get width(): Length {
        return Emu(Math.round(this.entry.widthEmu));
    }

    /**
     * Sets width.
     *
     * @param {Length} value - The value parameter.
     */
    public set width(value: Length) {
        this.entry.widthEmu = requirePositiveEmu(value, 'width');
        this.onChange();
    }

    /**
     * Gets height.
     *
     * @returns {Length} - Returns the result.
     */
    public get height(): Length {
        return Emu(Math.round(this.entry.heightEmu));
    }

    /**
     * Sets height.
     *
     * @param {Length} value - The value parameter.
     */
    public set height(value: Length) {
        this.entry.heightEmu = requirePositiveEmu(value, 'height');
        this.onChange();
    }

    /**
     * Legacy threaded-comment placeholder (`author` is `tc={guid}`).
     * Same rule the save path uses to keep foreign notes and rebuild placeholders.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isThreadedComments(): boolean {
        return this.entry.author.startsWith('tc=');
    }

    /**
     * delete method.
     *
     * @returns {void} - Returns the result.
     */
    public delete(): void {
        this.onDelete();
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * resolveTarget function.
 *
 * @param {AddCommentOptions} options - The options parameter.
 * @returns {CellCoord} - Returns the result.
 */
function resolveTarget(options: AddCommentOptions): CellCoord {
    const hasRef: boolean = options.ref !== undefined;
    const hasRowCol: boolean = options.row !== undefined && options.column !== undefined;
    if (hasRef && hasRowCol) {
        throw new InvalidCommentError('Comment target must be either ref or row+column, not both');
    }
    if (hasRef) {
        return parseA1(String(options.ref));
    }
    if (hasRowCol) {
        const row: number = options.row;
        const col: number = options.column;
        if (typeof row !== 'number' || typeof col !== 'number' || !Number.isInteger(row) || !Number.isInteger(col)) {
            throw new InvalidCommentError('Comment row/column must be integers');
        }
        formatA1(row, col);
        return { row, col };
    }
    throw new InvalidCommentError('Comment target required: ref or row+column');
}

/**
 * requirePositiveEmu function.
 *
 * @param {Length} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function requirePositiveEmu(value: Length, label: string): number {
    if (!isLength(value)) {
        throw new InvalidArgumentError(`${label} must be a Length (Px/Pt/Cm/…)`);
    }
    const emu: number = lengthToEmu(value);
    if (emu <= 0) {
        throw new InvalidArgumentError(`${label} must be positive`);
    }
    return Math.round(emu);
}

/**
 * allocateCommentsPartName function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */

/**
 * A comments part present in the package but not targeted by any sheet relationship.
 * Excel templates sometimes ship `comments1.xml` (and its content type) without a
 * worksheet `comments` relationship. Allocating `comments2.xml` then leaves both
 * parts in the package. Reuse the unreferenced part instead.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @param {string} sheetPartName - The sheetPartName parameter.
 * @returns {string | undefined} - Returns the result.
 */
export function claimUnreferencedCommentsPart(pkg: OpcPackage, sheetPartName: string): string | undefined {
    const referenced: Set<string> = new Set<string>();
    for (const source of pkg.partNames()) {
        if (!source.toLowerCase().endsWith('.xml') || source.toLowerCase().indexOf('/worksheets/') < 0) {
            continue;
        }
        if (partNamesEqual(source, sheetPartName)) {
            continue;
        }
        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(source);
        for (const rel of rels) {
            if (isCommentsRelationshipType(rel.type) && rel.resolvedTarget !== undefined) {
                referenced.add(normalizePartName(rel.resolvedTarget).toLowerCase());
            }
        }
    }
    const candidates: string[] = [];
    for (const name of pkg.partNames()) {
        const normalized: string = normalizePartName(name);
        if (!/^\/xl\/comments\d+\.xml$/i.test(normalized)) {
            continue;
        }
        if (referenced.has(normalized.toLowerCase())) {
            continue;
        }
        const ct: string | undefined = pkg.contentType(normalized);
        if (ct !== undefined && ct !== COMMENTS_CONTENT_TYPE) {
            continue;
        }
        candidates.push(normalized);
    }
    candidates.sort((a: string, b: string): number => a.localeCompare(b));
    return candidates.length > 0 ? candidates[0] : undefined;
}

function allocateCommentsPartName(pkg: OpcPackage): string {
    const existing: Set<string> = new Set(pkg.partNames().map((n: string): string => n.toLowerCase()));
    for (let i: number = 1; i < 10_000; i += 1) {
        const name: string = `/xl/comments${i}.xml`;
        if (!existing.has(name.toLowerCase())) {
            return name;
        }
    }
    throw new InvalidArgumentError('Could not allocate a comments part name');
}

/**
 * Relative relationship target from a worksheet part to a comments part. Example: `/xl/worksheets/sheet1.xml` → `/xl/comments1.xml` = `../comments1.xml`.
 *
 * @param {string} sheetPartName - The sheetPartName parameter.
 * @param {string} commentsPartName - The commentsPartName parameter.
 * @returns {string} - Returns the result.
 */
function relativeTargetFromSheetToComments(sheetPartName: string, commentsPartName: string): string {
    const sheet: string = normalizePartName(sheetPartName);
    const comments: string = normalizePartName(commentsPartName);
    const sheetSlash: number = sheet.lastIndexOf('/');
    const sheetDir: string = sheetSlash <= 0 ? '/' : sheet.slice(0, sheetSlash + 1);
    if (comments.startsWith(sheetDir)) {
        return comments.slice(sheetDir.length);
    }
    const fromSegs: string[] = sheetDir.split('/').filter((s: string): boolean => s.length > 0);
    const toSegs: string[] = comments.replace(/^\//, '').split('/');
    let i: number = 0;
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    while (i < fromSegs.length && i < toSegs.length - 1 && fromSegs[i] === toSegs[i]) {
        i += 1;
    }
    const ups: number = fromSegs.length - i;
    const down: string = toSegs.slice(i).join('/');
    const prefix: string = ups > 0 ? `${'../'.repeat(ups)}` : '';
    return `${prefix}${down}`;
}

/**
 * Parse authors + commentList from a comments part XML string. @private
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
export function parseCommentsXml(xml: string): {
    readonly authors: string[];
    readonly entries: CommentEntry[];
} {
    return parseCommentsPart(xml);
}

// ── comments part parse/serialize ─────────────────────────────────────────────

/**
 * ParsedCommentsPart.
 */
interface ParsedCommentsPart {
    readonly authors: string[];
    readonly entries: CommentEntry[];
}

/**
 * parseCommentsPart function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {ParsedCommentsPart} - Returns the result.
 */
function parseCommentsPart(xml: string): ParsedCommentsPart {
    const authors: string[] = [];
    const entries: CommentEntry[] = [];
    const trimmed: string = xml.replace(/^\uFEFF/, '').replace(/<\?xml[^?]*\?>\s*/i, '');

    const authorsMatch: RegExpExecArray = /<authors[^>]*>([\s\S]*?)<\/authors\s*>/i.exec(trimmed);
    if (authorsMatch !== null && authorsMatch[1] !== undefined) {
        const authorRe: RegExp = /<author[^>]*>([\s\S]*?)<\/author\s*>/gi;
        let m: any;
        // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
        while ((m = authorRe.exec(authorsMatch[1])) !== null) {
            if (m[1] !== undefined) {
                authors.push(unescapeXml(stripTags(m[1])));
            }
        }
    }

    const commentListMatch: RegExpExecArray = /<commentList[^>]*>([\s\S]*?)<\/commentList\s*>/i.exec(trimmed);
    if (commentListMatch !== null && commentListMatch[1] !== undefined) {
        const commentRe: RegExp = /<comment\s+([^>]*?)(?:\/>|>([\s\S]*?)<\/comment\s*>)/gi;
        let m: any;
        // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
        while ((m = commentRe.exec(commentListMatch[1])) !== null) {
            const attrsRaw: string = m[1] != null ? m[1] : '';
            const body: string = m[2] != null ? m[2] : '';
            const attrs: Map<string, string> = parseAttrMap(attrsRaw);
            const ref: string = attrs.get('ref');
            if (ref === undefined) {
                continue; // soft-skip malformed entry
            }
            let coord: CellCoord;
            try {
                coord = parseA1(ref);
            } catch {
                continue; // soft-skip bad ref
            }
            const authorIdRaw: string = attrs.get('authorId');
            const authorId: number = authorIdRaw === undefined ? undefined : Number.parseInt(authorIdRaw, 10);
            const author: string =
                authorId !== undefined && Number.isInteger(authorId) && authorId >= 0 && authorId < authors.length
                    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
                    ? authors[authorId] != null
                        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
                        ? authors[authorId]
                        : ''
                    : '';
            const text: string = extractCommentText(body);
            entries.push({
                row0: coord.row - 1,
                col0: coord.col - 1,
                text,
                author,
                isVisible: false,
                widthEmu: DEFAULT_NOTE_WIDTH_EMU,
                heightEmu: DEFAULT_NOTE_HEIGHT_EMU
            });
        }
    }
    return { authors, entries };
}

/**
 * Concat of plain + run `t` content inside a CT_Rst (flatten to plain).
 *
 * @param {string} commentBody - The commentBody parameter.
 * @returns {string} - Returns the result.
 */
function extractCommentText(commentBody: string): string {
    const textMatch: RegExpExecArray = /<text[^>]*>([\s\S]*?)<\/text\s*>/i.exec(commentBody);
    if (textMatch === null || textMatch[1] === undefined) {
        return '';
    }
    const inner: string = textMatch[1];
    const parts: string[] = [];
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const tRe: RegExp = /<t(?:\s[^>]*)?>([\s\S]*?)<\/t\s*>/gi;
    let m: any;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((m = tRe.exec(inner)) !== null) {
        if (m[1] !== undefined) {
            parts.push(unescapeXml(stripTags(m[1])));
        }
    }
    return parts.join('');
}

/**
 * serializeCommentsXml function.
 *
 * @param {Object} entries - The entries parameter.
 * @param {string} authorsIn - The authorsIn parameter.
 * @returns {string} - Returns the result.
 */
function serializeCommentsXml(
    entries: ReadonlyArray<CommentEntry>,
    authorsIn: ReadonlyArray<string>,
    placeholders?: ReadonlyArray<ThreadedCommentPlaceholder>,
    shapeIds?: ReadonlyArray<number>
): string {
    const sorted: CommentEntry[] = [...entries].sort((a: CommentEntry, b: CommentEntry): number =>
        a.row0 !== b.row0 ? a.row0 - b.row0 : a.col0 - b.col0
    );

    // Authors are append-only: emit the full shared list in order (never
    // renumber / never drop intermediate indices that might still be referenced
    // by external tooling). Ensure every entry author is present.
    const authors: string[] = [...authorsIn];
    for (const e of sorted) {
        if (authors.indexOf(e.author) < 0) {
            authors.push(e.author);
        }
    }

    const commentLines: string[] = [];
    for (let i: number = 0; i < sorted.length; i++) {
        const e: CommentEntry = sorted[i];
        let idx: number = authors.indexOf(e.author);
        if (idx < 0) {
            authors.push(e.author);
            idx = authors.length - 1;
        }
        const range: CellRange = {
            startRow: e.row0 + 1,
            startCol: e.col0 + 1,
            endRow: e.row0 + 1,
            endCol: e.col0 + 1
        };
        const ref: string = formatA1Range(range);
        // Do not emit comment/@shapeId. Excel opens the note from the VML
        // shape id; a shapeId on the classic note but not on the tc={uid}
        // sibling is rejected as a corrupt comments part.
        void shapeIds;
        commentLines.push(
            `<comment ref="${escapeXml(ref)}" authorId="${String(idx)}">` +
                `<text>${serializeClassicNoteText(e.text)}</text>` +
                '</comment>'
        );
    }

    // [MS-XLSX] §2.3.7.3 — one empty-body comment per top-level thread.
    // Author is `tc={uid}` and is appended so existing authorId values stay stable.
    const extras: ReadonlyArray<ThreadedCommentPlaceholder> = placeholders != null ? placeholders : [];
    for (const p of extras) {
        const author: string = `tc=${p.threadId}`;
        let idx: number = authors.indexOf(author);
        if (idx < 0) {
            authors.push(author);
            idx = authors.length - 1;
        }
        const ref: string = p.ref.length > 0 ? p.ref : 'A1';
        const body: string = p.text != null && p.text.length > 0 ? serializeClassicNoteText(p.text) : '';
        commentLines.push(
            `<comment ref="${escapeXml(ref)}" authorId="${String(idx)}"><text>${body}</text></comment>`
        );
    }

    const authorLines: string[] = ['<authors>'];
    for (const a of authors) {
        authorLines.push(`<author>${escapeXmlText(a)}</author>`);
    }
    authorLines.push('</authors>');

    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        `${authorLines.join('')}` +
        `<commentList>${commentLines.join('')}</commentList>` +
        '</comments>'
    );
}

/**
 * serializeTXml function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
/**
 * Classic note body as Excel writes it: one formatted run, Tahoma 9pt.
 * Citation: ECMA-376 CT_Rst / CT_RPrElt; Excel note default font.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function noteAnchorFromRef(ref: string): { row0: number; col0: number } | undefined {
    if (ref.length === 0) {
        return undefined;
    }
    try {
        const addr: any = parseA1(ref);
        return { row0: addr.row - 1, col0: addr.col - 1 };
    } catch {
        return undefined;
    }
}

function serializeClassicNoteText(text: string): string {
    return (
        `<r><rPr><sz val="9"/><rFont val="Tahoma"/><charset val="0"/></rPr>${serializeTXml(text)}</r>`
    );
}

/**
 * serializeTXml function.
 *
 * @param {string} text - The text parameter.
 * @returns {string} - Returns the result.
 */
function serializeTXml(text: string): string {
    const space: '' | ' xml:space="preserve"' =
        text.length > 0 && (/^\s|\s$/.test(text) || text.includes('\n') || text.includes('\t')) ? ' xml:space="preserve"' : '';
    return `<t${space}>${escapeXml(text)}</t>`;
}

/**
 * Strip nested markup; keeps text nodes only.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function stripTags(value: string): string {
    return value.replace(/<[^>]+>/g, '');
}

// ── VML note overlay ──────────────────────────────────────────────────────────

/**
 * buildNoteShapeOverlay function.
 *
 * @param {Object} entries - The entries parameter.
 * @param {FormControlsImpl} formControls - The formControls parameter.
 * @returns {string[]} - Returns the result.
 */
function buildNoteShapeOverlay(entries: ReadonlyArray<CommentEntry>, shapeIds: ReadonlyArray<number>): string[] {
    if (entries.length === 0) {
        return [];
    }
    const out: string[] = [NOTE_SHAPETYPE_XML];
    for (let i: number = 0; i < entries.length; i++) {
        const shapeId: number | undefined = shapeIds[i];
        if (shapeId === undefined) {
            continue;
        }
        out.push(serializeNoteShapeXml(entries[i], shapeId));
    }
    return out;
}

/** Citation: ECMA-376-4 note shape + ClientData example; Annex L.5.5.2. */
const NOTE_SHAPETYPE_XML: string =
    `<v:shapetype id="${NOTE_SHAPE_TYPE_ID}" coordsize="21600,21600" o:spt="202" ` +
    'path="m,l,21600r21600,l21600,xe">' +
    '<v:stroke joinstyle="miter"/>' +
    '<v:path gradientshapeok="t" o:connecttype="rect"/>' +
    '</v:shapetype>';

/**
 * serializeNoteShapeXml function.
 *
 * @param {CommentEntry} e - The e parameter.
 * @param {number} shapeId - The shapeId parameter.
 * @returns {string} - Returns the result.
 */
function serializeNoteShapeXml(e: CommentEntry, shapeId: number): string {
    const widthPx: number = Math.max(1, Math.round(e.widthEmu / 9_525));
    const heightPx: number = Math.max(1, Math.round(e.heightEmu / 9_525));
    const widthPt: number = e.widthEmu / 12_700;
    const heightPt: number = e.heightEmu / 12_700;
    // Excel sizes a note from x:Anchor (left col/off, top row/off, right col/off, bottom row/off),
    // with offsets inside their cell. Start beside the cell and walk cells to reach the size.
    const startCol: number = e.col0 + 1;
    const startRow: number = Math.max(e.row0 - 1, 0);
    const startColOff: number = 15;
    const startRowOff: number = 2;
    const endCol: number = startCol + Math.floor((startColOff + widthPx) / NOTE_DEFAULT_COL_PX);
    const endColOff: number = (startColOff + widthPx) % NOTE_DEFAULT_COL_PX;
    const endRow: number = startRow + Math.floor((startRowOff + heightPx) / NOTE_DEFAULT_ROW_PX);
    const endRowOff: number = (startRowOff + heightPx) % NOTE_DEFAULT_ROW_PX;
    const marginLeftPt: number = (startCol * NOTE_DEFAULT_COL_PX + startColOff) * 0.75;
    const marginTopPt: number = (startRow * NOTE_DEFAULT_ROW_PX + startRowOff) * 0.75;
    const styleParts: string[] = [
        'position:absolute',
        `margin-left:${formatPtStr(marginLeftPt)}pt`,
        `margin-top:${formatPtStr(marginTopPt)}pt`,
        `width:${formatPtStr(widthPt)}pt`,
        `height:${formatPtStr(heightPt)}pt`,
        'z-index:1'
    ];
    if (!e.isVisible) {
        styleParts.push('visibility:hidden');
    }
    const anchor: string = `${startCol}, ${startColOff}, ${startRow}, ${startRowOff}, ${endCol}, ${endColOff}, ${endRow}, ${endRowOff}`;
    const kids: string[] = [
        '<x:MoveWithCells/>',
        '<x:SizeWithCells/>',
        `<x:Anchor>${anchor}</x:Anchor>`,
        '<x:AutoFill>False</x:AutoFill>',
        `<x:Row>${e.row0}</x:Row>`,
        `<x:Column>${e.col0}</x:Column>`
    ];
    if (e.isVisible) {
        kids.push('<x:Visible/>');
    }
    return (
        `<v:shape id="_x0000_s${shapeId}" type="#${NOTE_SHAPE_TYPE_ID}" ` +
        `style="${escapeXml(styleParts.join(';'))}" fillcolor="#ffffe1" ` +
        'o:insetmode="auto">' +
        '<v:fill color2="#ffffe1"/>' +
        '<v:shadow on="t" color="black" obscured="t"/>' +
        '<v:path o:connecttype="none"/>' +
        '<v:textbox style="mso-direction-alt:auto"><div style="text-align:left"></div></v:textbox>' +
        `<x:ClientData ObjectType="Note">${kids.join('')}</x:ClientData>` +
        '</v:shape>'
    );
}

/**
 * formatPtStr function.
 *
 * @param {number} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function formatPtStr(value: number): string {
    const r: number = Math.round(value * 100) / 100;
    return String(r);
}
