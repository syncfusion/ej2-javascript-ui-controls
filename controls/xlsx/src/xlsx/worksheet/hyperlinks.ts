/**
 * Worksheet hyperlinks (`CT_Hyperlinks` / `CT_Hyperlink`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.47 `hyperlink` / §18.3.1.48 `hyperlinks`
 * - transitional sml.xsd `CT_Hyperlink` / `CT_Hyperlinks` / `CT_Worksheet`
 * - officeDocument relationships `…/relationships/hyperlink`
 * - docs/specs/hyperlinks.md; docs/ooxml-mapping/hyperlinks.md; API-RULES R1.5 / R5.1
 *
 * External targets materialize as sheet-part relationships with
 * `TargetMode="External"` on flush (never fetched). Internal targets use
 * `@location` only. Empty collection omits the parent element.
 */

import {
    formatA1Range,
    parseA1,
    parseA1Range, CellCoord, CellRange
} from '../address/cell-address';
import {
    InvalidArgumentError,
    InvalidHyperlinkError
} from '../core/errors';
import {
    HYPERLINK_REL_TYPE_TRANSITIONAL,
    isHyperlinkRelationshipType
} from '../core/package/constants';
import { OpcRelationship } from '../core/package/relationships';
import {
    attrsToXmlExcluding,
    escapeXml,
    parseAttrMap
} from '../core/xml/minimal-xml';

/**
 * Specifies the kind of destination a hyperlink points to — a web page, a
 * file, a network path, or a location in the same workbook.
 */
export type HyperlinkType = 'url' | 'file' | 'unc' | 'workbook';

/**
 * Describes a clickable link attached to a cell, pointing to a web page,
 * file, or another location in the workbook.
 *
 * XlsIO map: `target`↔Address, `displayText`↔TextToDisplay, `tooltip`↔ScreenTip,
 * `type`↔Type, `subAddress`↔SubAddress.
 */
export interface CellHyperlink {
    /**
     * The link's destination: a web address, a file path, or a location in the
     * workbook such as `Sheet1!A1`.
     */
    target: string;
    /**
     * The friendly text shown for the link. When set on a cell, this text also
     * becomes the cell's visible value.
     */
    displayText?: string;
    /** The small text shown when the pointer hovers over the link. */
    tooltip?: string;
    /**
     * The kind of destination the link points to — web page, file, network
     * path, or a place in this workbook. Omit to have it detected from the
     * target.
     */
    type?: HyperlinkType;
    /**
     * An optional specific place inside the target document, such as a
     * bookmark or sheet reference. Combine with an external `target` to
     * deep-link into another file.
     */
    subAddress?: string;
}

/**
 * Represents a clickable hyperlink in a worksheet, letting you set its
 * destination, display text, and tooltip.
 */
export interface Hyperlink {
    /**
     * The cell or range the link is attached to, written as a normalized
     * A1-style address.
     */
    readonly ref: string;
    /**
     * Where the link points — for example a web address like
     * `'https://example.com'`, a file path, or a place inside the workbook
     * such as `'Sheet2!A1'`.
     */
    target: string;
    /**
     * The visible link text. Setting it on a link attached to a single cell
     * also updates that cell's value.
     */
    displayText: string | undefined;
    /** The text shown when hovering over the link. */
    tooltip: string | undefined;
    /**
     * Whether the link points outside the workbook (`'external'`, like a web
     * page or file) or to a place inside it (`'internal'`, like another
     * sheet). See {@link type} for the finer-grained link kind.
     */
    readonly kind: 'external' | 'internal';
    /**
     * What the link points to: a web address (`'url'`), a file (`'file'`), a
     * network path (`'unc'`), or a place in this workbook (`'workbook'`).
     */
    readonly type: HyperlinkType;
    /**
     * A specific location inside the target — for example a cell range on
     * another sheet. Used together with an external `target` when the link
     * must also point to a place inside it.
     */
    subAddress: string | undefined;
}

/**
 * Represents the collection of hyperlinks in a worksheet, letting you add,
 * list, and remove links.
 */
export interface Hyperlinks {
    /** The number of hyperlinks on the worksheet. */
    readonly count: number;
    /**
     * Get all hyperlinks as a list, in the order they appear on the
     * worksheet.
     *
     * @returns the current hyperlinks.
     */
    list(): ReadonlyArray<Hyperlink>;
    /**
     * Get the hyperlink at a zero-based position, in the order the links
     * appear on the worksheet.
     *
     * @param index - The zero-based position of the hyperlink.
     * @returns the hyperlink at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): Hyperlink;
    /**
     * Add a hyperlink to the worksheet.
     *
     * @param ref - The cell or range the link is attached to, written as an
     *   A1-style address.
     * @param target - Where the link points - for example a web address,
     *   file path, or a place inside the workbook such as `'Sheet2!A1'`.
     * @param displayText - The visible link text. For a link on a single cell, this
     *   also becomes the cell's value.
     * @param tooltip - The text shown when hovering over the link.
     * @param type - What the link points to: `'url'`, `'file'`, `'unc'`, or
     *   `'workbook'`. Inferred from `target` when omitted.
     * @param subAddress - A specific location inside the target (optional with
     *   external targets).
     * @returns the newly created hyperlink.
     * @throws InvalidArgumentError when required fields are wrong type
     * @throws InvalidHyperlinkError when ref/target invalid
     */
    add(
        ref: string,
        target: string,
        displayText?: string,
        tooltip?: string,
        type?: HyperlinkType,
        subAddress?: string,
    ): Hyperlink;
    /**
     * Remove the hyperlink at a zero-based position.
     *
     * @param index - The zero-based position of the hyperlink to remove.
     * @throws InvalidArgumentError when the index is out of range
     */
    removeAt(index: number): void;
    /**
     * Remove a hyperlink previously returned by this collection.
     *
     * @param link - The hyperlink to remove.
     * @throws InvalidArgumentError when the link was not created by this
     *   collection
     */
    remove(link: Hyperlink): void;
    /** Remove every hyperlink from the worksheet. */
    clear(): void;
    /**
     * All hyperlinks whose ref contains the cell, file order.
     * Used by the cell hyperlink property path; not part of the public API.
     *
     * @private
     * @throws InvalidAddressError when address is not a single cell
     */
    findByCell(address: string): ReadonlyArray<Hyperlink>;
}

/**
 * Internal wire entry for one `hyperlink`.
 *
 * @private
 */
export interface HyperlinkEntry {
    ranges: CellRange[];
    /** External URI when kind is external. */
    externalTarget: string | undefined;
    /** Internal location when kind is internal (no leading `#`). */
    location: string | undefined;
    /** Loaded / assigned relationship id; rewritten on flush for externals. */
    relationshipId: string | undefined;
    display: string | undefined;
    tooltip: string | undefined;
    /** Extra attributes excluding modeled ones (XML fragment, no leading space). */
    extraAttrsXml: string;
}

/**
 * Ordered entries for worksheet XML model.
 *
 * @private
 */
export interface HyperlinksModel {
    readonly entries: ReadonlyArray<HyperlinkEntry>;
}

/**
 * Host notifications for hyperlink mutations.
 *
 * @private
 */
export interface HyperlinksHost {
    markDirty(): void;
    /**
     * Apply XlsIO TextToDisplay to a single cell (set visible value).
     * Optional so unit-level stores without a sheet still work.
     */
    applyDisplayText?(address: string, text: string): void;
}

/**
 * Classified target for authoring.
 *
 * @private
 */
export interface ClassifiedHyperlinkTarget {
    readonly kind: 'external' | 'internal';
    readonly type: HyperlinkType;
    readonly externalTarget: string | undefined;
    readonly location: string | undefined;
}

/**
 * Mutable hyperlinks store.
 *
 * @private
 */
export class HyperlinksImpl implements Hyperlinks {
    private readonly entries: HyperlinkEntry[] = [];
    private readonly handles: Map<HyperlinkEntry, HyperlinkHandle> = new Map<HyperlinkEntry, HyperlinkHandle>();
    private host: HyperlinksHost | undefined;

    /**
     * Creates a new instance.
     *
     * @param {HyperlinksModel} [initial] - initial value.
     */
    public constructor(initial?: HyperlinksModel) {
        if (initial !== undefined) {
            this.applyModel(initial);
        }
    }

    /**
     * bindHost function.
     *
     * @param {HyperlinksHost} host - host value.
     * @returns {void} Nothing.
     * @private
     */
    public bindHost(host: HyperlinksHost): void {
        this.host = host;
    }

    /**
     * Gets count.
     *
     * @returns {number} Function result.
     */
    public get count(): number {
        return this.entries.length;
    }

    /**
     * list function.
     *
     * @returns {*} Function result.
     */
    public list(): ReadonlyArray<Hyperlink> {
        return this.entries.map((e: HyperlinkEntry) => this.handleFor(e));
    }

    /**
     * get function.
     *
     * @param {number} index - index value.
     * @returns {Hyperlink} Function result.
     */
    public get(index: number): Hyperlink {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(
                `Hyperlink index ${String(index)} is out of range`
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: HyperlinkEntry = this.entries[index];
        if (entry === undefined) {
            throw new InvalidArgumentError(
                `Hyperlink index ${String(index)} is out of range`
            );
        }
        return this.handleFor(entry);
    }

    /**
     * add function.
     *
     * @param {string} ref - ref value.
     * @param {string} target - target value.
     * @param {string} [displayText] - displayText value.
     * @param {string} [tooltip] - tooltip value.
     * @param {HyperlinkType} [type] - type value.
     * @param {string} [subAddress] - subAddress value.
     * @returns {Hyperlink} Function result.
     */
    public add(
        ref: string,
        target: string,
        displayText?: string,
        tooltip?: string,
        type?: HyperlinkType,
        subAddress?: string
    ): Hyperlink {
        const entry: HyperlinkEntry = createEntryFromArgs(ref, target, displayText, tooltip, type, subAddress);
        this.entries.push(entry);
        if (this.host != null) { this.host.markDirty(); }
        this.maybeApplyDisplayText(entry);
        return this.handleFor(entry);
    }

    /**
     * removeAt function.
     *
     * @param {number} index - index value.
     * @returns {void} Nothing.
     */
    public removeAt(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(
                `Hyperlink index ${String(index)} is out of range`
            );
        }
        const [removed] = this.entries.splice(index, 1);
        if (removed !== undefined) {
            this.handles.delete(removed);
        }
        if (this.host != null) { this.host.markDirty(); }
    }

    /**
     * remove function.
     *
     * @param {Hyperlink} link - link value.
     * @returns {void} Nothing.
     */
    public remove(link: Hyperlink): void {
        if (!(link instanceof HyperlinkHandle)) {
            throw new InvalidArgumentError(
                'remove(link) requires a handle from this collection'
            );
        }
        const idx: number = this.entries.indexOf(link.entry);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        this.handles.delete(link.entry);
        if (this.host != null) { this.host.markDirty(); }
    }

    /**
     * clear function.
     *
     * @returns {void} Nothing.
     */
    public clear(): void {
        if (this.entries.length === 0) {
            return;
        }
        this.entries.length = 0;
        this.handles.clear();
        if (this.host != null) { this.host.markDirty(); }
    }

    /**
     * findByCell function.
     *
     * @param {string} address - address value.
     * @returns {*} Function result.
     * @private
     */
    public findByCell(address: string): ReadonlyArray<Hyperlink> {
        const coord: CellCoord = parseA1(address);
        const out: Hyperlink[] = [];
        for (const e of this.entries) {
            if (cellInRanges(coord, e.ranges)) {
                out.push(this.handleFor(e));
            }
        }
        return out;
    }

    /**
     * Replace contents from parse (does not mark dirty).
     *
     * @param {HyperlinksModel} model - model value.
     * @returns {void} Nothing.
     * @private
     */
    public replaceFromParse(model: HyperlinksModel): void {
        this.applyModel(model);
    }

    /**
     * Snapshot for serialize (before relationship materialization mutates rIds).
     *
     * @returns {HyperlinksModel} Function result.
     * @private
     */
    public toModel(): HyperlinksModel {
        return {
            entries: this.entries.map(cloneEntry)
        };
    }

    /**
     * Assign sheet-local external relationship ids and return the hyperlink-type
     * relationships to write. Mutates entries in place; caller merges with
     * non-hyperlink sheet rels. R5.1 — materialize only on flush/save.
     *
     * @param {*} existingSheetRels - existingSheetRels value.
     * @returns {*} Function result.
     * @private
     */
    public materializeExternalRelationships(
        existingSheetRels: ReadonlyArray<OpcRelationship>
    ): {
            readonly entries: ReadonlyArray<HyperlinkEntry>;
            readonly hyperlinkRels: ReadonlyArray<OpcRelationship>;
            readonly retainedRels: ReadonlyArray<OpcRelationship>;
        } {
        const retained: OpcRelationship[] = existingSheetRels.filter(
            (r: OpcRelationship) => !isHyperlinkRelationshipType(r.type)
        );
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

        const hyperlinkRels: OpcRelationship[] = [];
        for (const e of this.entries) {
            if (e.externalTarget !== undefined && e.externalTarget.length > 0) {
                maxNum += 1;
                const id: string = `rId${maxNum}`;
                e.relationshipId = id;
                hyperlinkRels.push({
                    id,
                    type: HYPERLINK_REL_TYPE_TRANSITIONAL,
                    target: e.externalTarget,
                    targetMode: 'External',
                    resolvedTarget: e.externalTarget
                });
            } else {
                e.relationshipId = undefined;
            }
        }

        return {
            entries: this.entries.map(cloneEntry),
            hyperlinkRels,
            retainedRels: retained
        };
    }

    /**
     * Set or clear the hyperlink for a single cell (cell property path).
     * Removes existing links that contain the cell, then optionally adds one.
     *
     * @param {string} address - address value.
     * @param {CellHyperlink | undefined} value - value value.
     * @returns {void} Nothing.
     * @private
     */
    public setForCell(address: string, value: CellHyperlink | undefined): void {
        const coord: CellCoord = parseA1(address);
        const ref: string = formatA1Range({
            startRow: coord.row,
            startCol: coord.col,
            endRow: coord.row,
            endCol: coord.col
        });

        // Remove every link covering this cell (cell property is single-cell authoring).
        for (let i: number = this.entries.length - 1; i >= 0; i -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: HyperlinkEntry = this.entries[i];
            if (e !== undefined && cellInRanges(coord, e.ranges)) {
                this.handles.delete(e);
                this.entries.splice(i, 1);
            }
        }

        if (value === undefined) {
            if (this.host != null) { this.host.markDirty(); }
            return;
        }
        if (value === null || typeof value !== 'object') {
            throw new InvalidArgumentError('Cell hyperlink must be an object or undefined');
        }
        const entry: HyperlinkEntry = createEntryFromArgs(
            ref,
            value.target,
            value.displayText,
            value.tooltip,
            value.type,
            value.subAddress
        );
        this.entries.push(entry);
        if (this.host != null) { this.host.markDirty(); }
        this.maybeApplyDisplayText(entry);
    }

    /**
     * First hyperlink covering the cell, as {@link CellHyperlink}.
     *
     * @param {string} address - address value.
     * @returns {CellHyperlink | undefined} Function result.
     * @private
     */
    public getForCell(address: string): CellHyperlink | undefined {
        const found: ReadonlyArray<Hyperlink> = this.findByCell(address);
        const first: Hyperlink = found[0];
        if (first === undefined) {
            return undefined;
        }
        const out: CellHyperlink = { target: first.target };
        if (first.displayText !== undefined) {
            out.displayText = first.displayText;
        }
        if (first.tooltip !== undefined) {
            out.tooltip = first.tooltip;
        }
        out.type = first.type;
        if (first.subAddress !== undefined) {
            out.subAddress = first.subAddress;
        }
        return out;
    }

    /**
     * Hyperlinks whose ref intersects the given range bounds, file order.
     *
     * @param {CellRange} range - range value.
     * @returns {*} Function result.
     * @private
     */
    public findIntersecting(range: CellRange): ReadonlyArray<Hyperlink> {
        const out: Hyperlink[] = [];
        for (const e of this.entries) {
            if (rangesIntersect(range, e.ranges)) {
                out.push(this.handleFor(e));
            }
        }
        return out;
    }

    /**
     * Remove every hyperlink whose ref intersects the range.
     *
     * @param {CellRange} range - range value.
     * @returns {void} Nothing.
     * @private
     */
    public removeIntersecting(range: CellRange): void {
        let changed: boolean = false;
        for (let i: number = this.entries.length - 1; i >= 0; i -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: HyperlinkEntry = this.entries[i];
            if (e !== undefined && rangesIntersect(range, e.ranges)) {
                this.handles.delete(e);
                this.entries.splice(i, 1);
                changed = true;
            }
        }
        if (changed) {
            if (this.host != null) { this.host.markDirty(); }
        }
    }

    /**
     * applyModel function.
     *
     * @param {HyperlinksModel} model - model value.
     * @returns {void} Nothing.
     */
    private applyModel(model: HyperlinksModel): void {
        this.entries.length = 0;
        this.handles.clear();
        for (const e of model.entries) {
            this.entries.push(cloneEntry(e));
        }
    }

    /**
     * handleFor function.
     *
     * @param {HyperlinkEntry} entry - entry value.
     * @returns {Hyperlink} Function result.
     */
    private handleFor(entry: HyperlinkEntry): Hyperlink {
        let h: HyperlinkHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new HyperlinkHandle(entry, {
                markDirty: () => (this.host == null ? undefined : this.host.markDirty()),
                applyDisplayText: (address: string, text: string) => {
                    if (this.host != null && this.host.applyDisplayText != null) {
                        this.host.applyDisplayText(address, text);
                    }
                }
            });
            this.handles.set(entry, h);
        }
        return h;
    }

    /**
     * maybeApplyDisplayText function.
     *
     * @param {HyperlinkEntry} entry - entry value.
     * @returns {void} Nothing.
     */
    private maybeApplyDisplayText(entry: HyperlinkEntry): void {
        const display: string = entry.display;
        const host: HyperlinksHost = this.host;
        if (display === undefined || host == null || host.applyDisplayText == null) {
            return;
        }
        const single: string = singleCellAddressFromRanges(entry.ranges);
        if (single !== undefined) {
            host.applyDisplayText(single, display);
        }
    }
}

interface HyperlinkHandleHost {
    markDirty(): void;
    applyDisplayText(address: string, text: string): void;
}

/**
 * Live mutable handle bound to an entry.
 */
class HyperlinkHandle implements Hyperlink {
    /** @private */
    public readonly entry: HyperlinkEntry;
    private readonly host: HyperlinkHandleHost;

    /**
     * Creates a new instance.
     *
     * @param {HyperlinkEntry} entry - entry value.
     * @param {HyperlinkHandleHost} host - host value.
     */
    public constructor(entry: HyperlinkEntry, host: HyperlinkHandleHost) {
        this.entry = entry;
        this.host = host;
    }

    /**
     * Gets ref.
     *
     * @returns {string} Function result.
     */
    public get ref(): string {
        return formatHyperlinkRef(this.entry.ranges);
    }

    /**
     * Gets target.
     *
     * @returns {string} Function result.
     */
    public get target(): string {
        return publicTargetFromEntry(this.entry);
    }

    /**
     * target function.
     *
     * @param {string} value - value value.
     */
    public set target(value: string) {
    // Preserve SubAddress only when this entry already has an external target.
    // Workbook-only links store the jump in `location` (that is the Address).
        const sub: string =
      this.entry.externalTarget !== undefined ? this.entry.location : undefined;
        applyClassifiedTarget(
            this.entry,
            classifyTarget(value, sub !== undefined ? { subAddress: sub } : undefined)
        );
        this.host.markDirty();
    }

    /**
     * Gets displayText.
     *
     * @returns {string | undefined} Function result.
     */
    public get displayText(): string | undefined {
        return this.entry.display;
    }

    /**
     * displayText function.
     *
     * @param {string | undefined} value - value value.
     */
    public set displayText(value: string | undefined) {
        this.entry.display = normalizeOptionalString(value);
        this.host.markDirty();
        if (this.entry.display !== undefined) {
            const single: string = singleCellAddressFromRanges(this.entry.ranges);
            if (single !== undefined) {
                this.host.applyDisplayText(single, this.entry.display);
            }
        }
    }

    /**
     * Gets tooltip.
     *
     * @returns {string | undefined} Function result.
     */
    public get tooltip(): string | undefined {
        return this.entry.tooltip;
    }

    /**
     * tooltip function.
     *
     * @param {string | undefined} value - value value.
     */
    public set tooltip(value: string | undefined) {
        this.entry.tooltip = normalizeOptionalString(value);
        this.host.markDirty();
    }

    /**
     * Gets kind.
     *
     * @returns {'external' | 'internal'} Function result.
     */
    public get kind(): 'external' | 'internal' {
        return this.entry.externalTarget !== undefined ? 'external' : 'internal';
    }

    /**
     * Gets type.
     *
     * @returns {HyperlinkType} Function result.
     */
    public get type(): HyperlinkType {
        return typeFromEntry(this.entry);
    }

    /**
     * Gets subAddress.
     *
     * @returns {string | undefined} Function result.
     */
    public get subAddress(): string | undefined {
    // Public subAddress is the location when it is not already the primary target
    // (external + location), or when type is workbook and target is empty external.
        if (this.entry.externalTarget !== undefined) {
            return this.entry.location;
        }
        return undefined;
    }

    /**
     * subAddress function.
     *
     * @param {string | undefined} value - value value.
     */
    public set subAddress(value: string | undefined) {
        const normalized: string = normalizeOptionalString(value);
        if (normalized !== undefined && normalized.startsWith('#')) {
            const loc: string = normalized.slice(1).trim();
            if (loc.length === 0) {
                throw new InvalidHyperlinkError('Internal hyperlink location must be non-empty');
            }
            this.entry.location = loc;
        } else {
            this.entry.location = normalized;
        }
        // Pure workbook jump: location is the only payload — keep external cleared.
        if (this.entry.externalTarget === undefined && this.entry.location === undefined) {
            throw new InvalidHyperlinkError('Hyperlink must have a target or subAddress');
        }
        this.host.markDirty();
    }
}

/**
 * Options that refine {@link classifyTarget} (explicit Type / SubAddress).
 */
export interface ClassifyTargetOptions {
    readonly type?: HyperlinkType;
    readonly subAddress?: string;
}

/**
 * Classify authoring target into external URI vs internal location + Type.
 * Rules (docs/specs/hyperlinks.md; XlsIO ExcelHyperLinkType):
 * 1. empty target → error (unless explicit workbook + subAddress only — not used here)
 * 2. explicit `type` overrides inference when provided
 * 3. `#…` / sheet jump / named-range → workbook (`location`)
 * 4. UNC → unc; file: / drive / relative path → file; else scheme URI → url
 *
 * @param {string} raw - raw value.
 * @param {ClassifyTargetOptions} [options] - options value.
 * @returns {ClassifiedHyperlinkTarget} Function result.
 * @throws InvalidHyperlinkError | InvalidArgumentError
 */
export function classifyTarget(
    raw: string,
    options?: ClassifyTargetOptions
): ClassifiedHyperlinkTarget {
    if (typeof raw !== 'string') {
        throw new InvalidArgumentError('Hyperlink target must be a string');
    }
    const target: string = raw.trim();
    if (target.length === 0) {
        throw new InvalidHyperlinkError('Hyperlink target must be non-empty');
    }

    const sub: string = normalizeSubAddress((options == null ? undefined : options.subAddress));
    const explicitType: HyperlinkType = (options == null ? undefined : options.type);

    if (explicitType !== undefined) {
        validateHyperlinkType(explicitType);
    }

    // Explicit workbook: always internal location (target may be Sheet!A1 or name).
    if (explicitType === 'workbook') {
        const location: string = stripHash(target);
        return {
            kind: 'internal',
            type: 'workbook',
            externalTarget: undefined,
            location: (sub != null ? sub : location)
        };
    }

    if (target.startsWith('#')) {
        const location: string = target.slice(1).trim();
        if (location.length === 0) {
            throw new InvalidHyperlinkError('Internal hyperlink location must be non-empty');
        }
        return {
            kind: 'internal',
            type: 'workbook',
            externalTarget: undefined,
            location: (sub != null ? sub : location)
        };
    }

    // Sheet jump: Sheet1!A1 / 'My Sheet'!A1 (and ranges).
    if (looksLikeInternalLocation(target)) {
        return {
            kind: 'internal',
            type: 'workbook',
            externalTarget: undefined,
            location: (sub != null ? sub : target)
        };
    }

    // Same-sheet A1 / A1:B2 location (no sheet prefix, no scheme, no path).
    if (looksLikeSameSheetLocation(target)) {
        return {
            kind: 'internal',
            type: 'workbook',
            externalTarget: undefined,
            location: (sub != null ? sub : target)
        };
    }

    // UNC before scheme / file heuristics.
    if (isUncPath(target) || explicitType === 'unc') {
        return {
            kind: 'external',
            type: 'unc',
            externalTarget: target,
            location: sub
        };
    }

    if (explicitType === 'file' || isFileTarget(target)) {
        return {
            kind: 'external',
            type: 'file',
            externalTarget: target,
            location: sub
        };
    }

    if (explicitType === 'url') {
        return {
            kind: 'external',
            type: 'url',
            externalTarget: target,
            location: sub
        };
    }

    // URI with scheme (http:, https:, mailto:, etc.) → url (file: already handled).
    // No /u flag — tsconfig target is es5 (unicode flag needs es6+).
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)) {
        return {
            kind: 'external',
            type: 'url',
            externalTarget: target,
            location: sub
        };
    }

    // Relative / bare path without scheme → file (XlsIO File).
    return {
        kind: 'external',
        type: 'file',
        externalTarget: target,
        location: sub
    };
}

/**
 * validateHyperlinkType function.
 *
 * @param {string} type - type value.
 * @returns {void} Nothing.
 */
function validateHyperlinkType(type: string): void {
    if (type !== 'url' && type !== 'file' && type !== 'unc' && type !== 'workbook') {
        throw new InvalidArgumentError(
            'Hyperlink type must be \'url\' | \'file\' | \'unc\' | \'workbook\''
        );
    }
}

/**
 * normalizeSubAddress function.
 *
 * @param {string | undefined} value - value value.
 * @returns {string | undefined} Function result.
 */
function normalizeSubAddress(value: string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('Hyperlink subAddress must be a string');
    }
    const trimmed: string = value.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    return stripHash(trimmed);
}

/**
 * stripHash function.
 *
 * @param {string} value - value value.
 * @returns {string} Function result.
 */
function stripHash(value: string): string {
    if (value.startsWith('#')) {
        const loc: string = value.slice(1).trim();
        if (loc.length === 0) {
            throw new InvalidHyperlinkError('Internal hyperlink location must be non-empty');
        }
        return loc;
    }
    return value;
}

/**
 * isUncPath function.
 *
 * @param {string} target - target value.
 * @returns {boolean} Function result.
 */
function isUncPath(target: string): boolean {
    return target.startsWith('\\\\') || target.startsWith('//');
}

/**
 * isFileTarget function.
 *
 * @param {string} target - target value.
 * @returns {boolean} Function result.
 */
function isFileTarget(target: string): boolean {
    if (/^file:/i.test(target)) {
        return true;
    }
    // Windows drive path: C:\… or C:/…
    if (/^[a-zA-Z]:[\\/]/.test(target)) {
        return true;
    }
    // Relative path with separators (not a URI scheme).
    if (
        !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target) &&
    (target.includes('\\') || target.includes('/'))
    ) {
        return true;
    }
    return false;
}

/**
 * Derive XlsIO Type from a stored entry (API-only; not an OOXML attribute).
 *
 * @param {HyperlinkEntry} entry - entry value.
 * @returns {HyperlinkType} Function result.
 */
function typeFromEntry(entry: HyperlinkEntry): HyperlinkType {
    if (entry.externalTarget === undefined) {
        return 'workbook';
    }
    const t: string = entry.externalTarget;
    if (isUncPath(t)) {
        return 'unc';
    }
    if (isFileTarget(t)) {
        return 'file';
    }
    return 'url';
}

/**
 * CT_Worksheet local names that appear **before** `hyperlinks` after sheetData.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`
 * (`dataValidations` → `hyperlinks` → `printOptions`).
 */
export const HYPERLINKS_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations'
];

/**
 * CT_Worksheet local names that appear **after** `hyperlinks`.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const HYPERLINKS_SUCCESSORS: ReadonlyArray<string> = [
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing',
    'legacyDrawing',
    'legacyDrawingHF',
    'drawingHF',
    'picture',
    'oleObjects',
    'controls',
    'webPublishItems',
    'tableParts',
    'extLst'
];

const HL_PRED_SET: ReadonlySet<string> = new Set(
    HYPERLINKS_PREDECESSORS_AFTER_SHEET_DATA
);
const HL_SUCC_SET: ReadonlySet<string> = new Set(HYPERLINKS_SUCCESSORS);

/**
 * Index at which to insert serialized `hyperlinks` among after-sheetData siblings.
 *
 * @param {*} afterSheetDataLocals - afterSheetDataLocals value.
 * @returns {number} Function result.
 */
export function findHyperlinksInsertIndex(
    afterSheetDataLocals: ReadonlyArray<string>
): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && HL_PRED_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && HL_SUCC_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse `hyperlinks` element XML into a model.
 * Soft-skips individual bad children (keep valid siblings).
 * Resolves `r:id` against sheet relationships when provided.
 *
 * @param {string} xml - xml value.
 * @param {*} [sheetRelsById] - sheetRelsById value.
 * @returns {HyperlinksModel} Function result.
 * @private
 */
export function parseHyperlinksXml(
    xml: string,
    sheetRelsById?: ReadonlyMap<string, OpcRelationship>
): HyperlinksModel {
    const inner: string = elementInnerLocal(xml);
    const children: string[] = splitTopLevelLocal(inner);
    const entries: HyperlinkEntry[] = [];
    for (const child of children) {
        if (elementLocalNameLocal(child) !== 'hyperlink') {
            continue;
        }
        const parsed: HyperlinkEntry = parseOneHyperlink(child, sheetRelsById);
        if (parsed !== undefined) {
            entries.push(parsed);
        }
    }
    return { entries };
}

/**
 * Serialize model to a `hyperlinks` element, or `undefined` when empty.
 * Caller must materialize `relationshipId` on external entries first.
 *
 * @param {HyperlinksModel} model - model value.
 * @returns {string | undefined} Function result.
 * @private
 */
export function serializeHyperlinksXml(
    model: HyperlinksModel
): string | undefined {
    if (model.entries.length === 0) {
        return undefined;
    }
    const parts: string[] = ['<hyperlinks>'];
    for (const e of model.entries) {
        parts.push(serializeOneHyperlink(e));
    }
    parts.push('</hyperlinks>');
    return parts.join('');
}

/**
 * parseOneHyperlink function.
 *
 * @param {string} el - el value.
 * @param {*} sheetRelsById - sheetRelsById value.
 * @returns {HyperlinkEntry | undefined} Function result.
 */
function parseOneHyperlink(
    el: string,
    sheetRelsById: ReadonlyMap<string, OpcRelationship> | undefined
): HyperlinkEntry | undefined {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(el));
    const refRaw: string = attrs.get('ref');
    if (refRaw === undefined || refRaw.trim().length === 0) {
        return undefined;
    }
    let range: CellRange;
    try {
        range = parseA1Range(refRaw);
    } catch {
        return undefined;
    }

    const relId: string = (attrs.get('id') != null ? attrs.get('id') : attrs.get('r:id'));
    const locationAttr: string = attrs.get('location');
    const display: string = attrs.get('display');
    const tooltip: string = attrs.get('tooltip');

    let externalTarget: string | undefined;
    let relationshipId: string | undefined;
    if (relId !== undefined && relId.length > 0) {
        relationshipId = relId;
        const rel: OpcRelationship = (sheetRelsById == null ? undefined : sheetRelsById.get(relId));
        if (rel !== undefined && isHyperlinkRelationshipType(rel.type)) {
            externalTarget = rel.target;
        } else if (rel !== undefined) {
            // Non-hyperlink type — still expose target text for debugging load
            externalTarget = rel.target;
        }
    // Missing rel: keep relationshipId + location if any; external stays unset
    }

    let location: string | undefined =
    locationAttr !== undefined && locationAttr.trim().length > 0
        ? locationAttr.trim()
        : undefined;

    // Need at least external or location to be useful; if only dangling r:id, soft-skip.
    if (externalTarget === undefined && location === undefined) {
        return undefined;
    }

    // Prefer single kind for storage consistency when both present: keep both on
    // wire fields but public kind prefers external when externalTarget is set.
    if (externalTarget !== undefined) {
    // external wins for kind; location may still serialize if present (rare).
    } else if (location !== undefined && location.startsWith('#')) {
        location = location.slice(1);
    }

    const extraAttrsXml: string = attrsToXmlExcluding(
        attrs,
        new Set(['ref', 'id', 'r:id', 'location', 'display', 'tooltip'])
    );

    return {
        ranges: [range],
        externalTarget,
        location: externalTarget !== undefined ? location : location,
        relationshipId,
        display: display !== undefined && display.length > 0 ? display : undefined,
        tooltip: tooltip !== undefined && tooltip.length > 0 ? tooltip : undefined,
        extraAttrsXml
    };
}

/**
 * serializeOneHyperlink function.
 *
 * @param {HyperlinkEntry} e - e value.
 * @returns {string} Function result.
 */
function serializeOneHyperlink(e: HyperlinkEntry): string {
    const ref: string = formatHyperlinkRef(e.ranges);
    const attrs: string[] = [`ref="${escapeXml(ref)}"`];
    if (e.relationshipId !== undefined && e.relationshipId.length > 0) {
        attrs.push(`r:id="${escapeXml(e.relationshipId)}"`);
    }
    if (e.location !== undefined && e.location.length > 0) {
        attrs.push(`location="${escapeXml(e.location)}"`);
    }
    if (e.tooltip !== undefined && e.tooltip.length > 0) {
        attrs.push(`tooltip="${escapeXml(e.tooltip)}"`);
    }
    if (e.display !== undefined && e.display.length > 0) {
        attrs.push(`display="${escapeXml(e.display)}"`);
    }
    if (e.extraAttrsXml.trim().length > 0) {
        attrs.push(e.extraAttrsXml.trim());
    }
    return `<hyperlink ${attrs.join(' ')}/>`;
}

/**
 * createEntryFromArgs function.
 *
 * @param {string} ref - ref value.
 * @param {string} target - target value.
 * @param {string} [displayText] - displayText value.
 * @param {string} [tooltip] - tooltip value.
 * @param {HyperlinkType} [type] - type value.
 * @param {string} [subAddress] - subAddress value.
 * @returns {HyperlinkEntry} Function result.
 */
function createEntryFromArgs(
    ref: string,
    target: string,
    displayText?: string,
    tooltip?: string,
    type?: HyperlinkType,
    subAddress?: string
): HyperlinkEntry {
    if (typeof ref !== 'string') {
        throw new InvalidArgumentError('Hyperlink ref must be a string');
    }
    if (typeof target !== 'string') {
        throw new InvalidArgumentError('Hyperlink target must be a string');
    }
    const refTrim: string = ref.trim();
    if (refTrim.length === 0) {
        throw new InvalidHyperlinkError('Hyperlink ref must be non-empty');
    }
    let range: CellRange;
    try {
        range = parseA1Range(refTrim);
    } catch (err) {
        throw new InvalidHyperlinkError(`Invalid hyperlink ref "${ref}"`, {
            cause: err
        });
    }

    const classified: ClassifiedHyperlinkTarget = classifyTarget(target, {
        ...(type !== undefined ? { type } : {}),
        ...(subAddress !== undefined ? { subAddress } : {})
    });
    const entry: HyperlinkEntry = {
        ranges: [range],
        externalTarget: classified.externalTarget,
        location: classified.location,
        relationshipId: undefined,
        display: normalizeOptionalString(displayText),
        tooltip: normalizeOptionalString(tooltip),
        extraAttrsXml: ''
    };
    return entry;
}

/**
 * applyClassifiedTarget function.
 *
 * @param {HyperlinkEntry} entry - entry value.
 * @param {ClassifiedHyperlinkTarget} classified - classified value.
 * @returns {void} Nothing.
 */
function applyClassifiedTarget(
    entry: HyperlinkEntry,
    classified: ClassifiedHyperlinkTarget
): void {
    entry.externalTarget = classified.externalTarget;
    entry.location = classified.location;
    // r:id rewritten on flush
    entry.relationshipId = undefined;
}

/**
 * publicTargetFromEntry function.
 *
 * @param {HyperlinkEntry} entry - entry value.
 * @returns {string} Function result.
 */
function publicTargetFromEntry(entry: HyperlinkEntry): string {
    if (entry.externalTarget !== undefined) {
        return entry.externalTarget;
    }
    return (entry.location != null ? entry.location : '');
}

/**
 * formatHyperlinkRef function.
 *
 * @param {*} ranges - ranges value.
 * @returns {string} Function result.
 */
function formatHyperlinkRef(ranges: ReadonlyArray<CellRange>): string {
    if (ranges.length === 0) {
        return 'A1';
    }
    // CT_Hyperlink@ref is a single ST_Ref (not multi-area sqref).
    const first: CellRange = ranges[0];
    if (first === undefined) {
        return 'A1';
    }
    return formatA1Range(first);
}

/**
 * cloneEntry function.
 *
 * @param {HyperlinkEntry} e - e value.
 * @returns {HyperlinkEntry} Function result.
 */
function cloneEntry(e: HyperlinkEntry): HyperlinkEntry {
    return {
        ranges: e.ranges.map((r: CellRange) => ({ ...r })),
        externalTarget: e.externalTarget,
        location: e.location,
        relationshipId: e.relationshipId,
        display: e.display,
        tooltip: e.tooltip,
        extraAttrsXml: e.extraAttrsXml
    };
}

/**
 * cellInRanges function.
 *
 * @param {CellCoord} coord - coord value.
 * @param {*} ranges - ranges value.
 * @returns {boolean} Function result.
 */
function cellInRanges(coord: CellCoord, ranges: ReadonlyArray<CellRange>): boolean {
    for (const r of ranges) {
        if (
            coord.row >= r.startRow &&
      coord.row <= r.endRow &&
      coord.col >= r.startCol &&
      coord.col <= r.endCol
        ) {
            return true;
        }
    }
    return false;
}

/**
 * rangesIntersect function.
 *
 * @param {CellRange} range - range value.
 * @param {*} ranges - ranges value.
 * @returns {boolean} Function result.
 */
function rangesIntersect(range: CellRange, ranges: ReadonlyArray<CellRange>): boolean {
    for (const r of ranges) {
        if (
            range.startRow <= r.endRow &&
      range.endRow >= r.startRow &&
      range.startCol <= r.endCol &&
      range.endCol >= r.startCol
        ) {
            return true;
        }
    }
    return false;
}

/**
 * A1 address when `ranges` is exactly one single cell; otherwise `undefined`.
 *
 * @param {*} ranges - ranges value.
 * @returns {string | undefined} Function result.
 */
function singleCellAddressFromRanges(
    ranges: ReadonlyArray<CellRange>
): string | undefined {
    if (ranges.length !== 1) {
        return undefined;
    }
    const r: CellRange = ranges[0];
    if (r === undefined) {
        return undefined;
    }
    if (r.startRow !== r.endRow || r.startCol !== r.endCol) {
        return undefined;
    }
    return formatA1Range(r);
}

/**
 * normalizeOptionalString function.
 *
 * @param {string | undefined} value - value value.
 * @returns {string | undefined} Function result.
 */
function normalizeOptionalString(value: string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('String attribute must be a string');
    }
    return value;
}

/**
 * True for sheet-style jumps without a URI scheme.
 * Examples: `Sheet1!A1`, `'My Sheet'!A1:B2`.
 *
 * @param {string} target - target value.
 * @returns {boolean} Function result.
 */
function looksLikeInternalLocation(target: string): boolean {
    if (!target.includes('!')) {
        return false;
    }
    // UNC / protocol-relative should not be treated as sheet jumps.
    if (target.startsWith('//') || target.startsWith('\\\\')) {
        return false;
    }
    return true;
}

/**
 * Same-sheet A1 / A1:B2 jump (no sheet name, no URI/path).
 * Named ranges without `!` require `type: 'workbook'` (ambiguous vs bare paths).
 *
 * @param {string} target - target value.
 * @returns {boolean} Function result.
 */
function looksLikeSameSheetLocation(target: string): boolean {
    if (
        target.includes('!') ||
    target.includes('/') ||
    target.includes('\\') ||
    target.includes('@')
    ) {
        return false;
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)) {
        return false;
    }
    try {
        parseA1Range(target);
        return true;
    } catch {
        return false;
    }
}

/* ── minimal local XML helpers ── */

/**
 * elementLocalNameLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementLocalNameLocal(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- static OOXML tag scanner; input is package XML not attacker-controlled regex
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string) => __t != null ? __t : '')(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const gt: number = trimmed.indexOf('>');
    if (gt < 0) {
        return '';
    }
    const open: string = trimmed.slice(0, gt);
    // eslint-disable-next-line security/detect-unsafe-regex -- static OOXML tag scanner; input is package XML not attacker-controlled regex
    const m: RegExpExecArray = /^<[A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?([\s\S]*)$/.exec(open);
    return m !== null && m[1] !== undefined ? m[1].trim() : '';
}

/**
 * findTagEndLocal function.
 *
 * @param {string} s - s value.
 * @param {number} from - from value.
 * @returns {number} Function result.
 */
function findTagEndLocal(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosingLocal function.
 *
 * @param {string} s - s value.
 * @param {string} localName - localName value.
 * @param {number} from - from value.
 * @returns {number} Function result.
 */
function findClosingLocal(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- pattern built from escaped fixed local names / OOXML tags
    const openPat: RegExp = new RegExp(
        `<([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}(?=[\\s>/])`,
        'g'
    );
    // eslint-disable-next-line security/detect-non-literal-regexp -- pattern built from escaped fixed local names / OOXML tags
    const closePat: RegExp = new RegExp(
        `</([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}\\s*>`,
        'g'
    );
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEndLocal(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementInnerLocal function.
 *
 * @param {string} el - el value.
 * @returns {string} Function result.
 */
function elementInnerLocal(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEndLocal(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * splitTopLevelLocal function.
 *
 * @param {string} s - s value.
 * @returns {string[]} Function result.
 */
function splitTopLevelLocal(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEndLocal(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalNameLocal(openTag);
        const close: number = findClosingLocal(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string) => x.trim()).filter((x: string) => x.length > 0);
}

/**
 * escapeRegExpLocal function.
 *
 * @param {string} value - value value.
 * @returns {string} Function result.
 */
function escapeRegExpLocal(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

