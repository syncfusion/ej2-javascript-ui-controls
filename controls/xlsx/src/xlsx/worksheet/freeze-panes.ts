/**
 * Worksheet freeze panes (`CT_SheetViews` / `CT_SheetView` / `CT_Pane`).
 *
 * Citations:
 * - ECMA-376-1 sheet views / pane
 * - transitional sml.xsd `CT_SheetViews`, `CT_SheetView`, `CT_Pane`, `ST_PaneState`
 * - docs/specs/freeze-panes.md; docs/ooxml-mapping/freeze-panes.md
 * - API-RULES R1.4 (`pane` → `sheet.freeze`)
 * - XlsIO `FreezePanes` / `RemovePanes` (anchor = first unfrozen cell)
 *
 * `sheetViews` is a before-sheetData child. Empty frozen model omits pane;
 * empty sheetViews omits the parent when never present and not authored.
 */

import { formatA1, formatA1Range, parseA1, parseA1Range } from '../address/cell-address';
import { InvalidAddressError, InvalidArgumentError } from '../core/errors';
import { attrsToXmlExcluding, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';

/** Pane state values from `ST_PaneState`. */
export type PaneState = 'frozen' | 'split' | 'frozenSplit';

/** Active pane corner from `ST_Pane`. */
export type ActivePane = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

/**
 * Controls which rows and columns of a worksheet stay visible while
 * scrolling, letting you freeze or unfreeze panes.
 */
export interface FreezePanes {
    /** Whether rows and/or columns are frozen on the sheet. */
    readonly isFrozen: boolean;
    /**
     * The number of frozen columns; `0` when no columns are frozen.
     */
    readonly columns: number;
    /** The number of frozen rows; `0` when no rows are frozen. */
    readonly rows: number;
    /**
     * The first cell that scrolls — the cell just beyond the frozen rows and
     * columns, like `'C3'` when two columns and two rows are frozen.
     * `undefined` when nothing is frozen.
     */
    readonly topLeftCell: string | undefined;
    /**
     * Freeze everything left of and above a cell by giving that cell's
     * address. For example, `freezeAt('C3')` keeps columns A–B and rows 1–2
     * fixed while the rest of the sheet scrolls.
     *
     * @param anchor - The first cell that should scroll, like `'C3'`.
     */
    freezeAt(anchor: string): void;
    /**
     * Freeze the first few rows and/or columns of the sheet. At least one of
     * the counts must be greater than `0`.
     *
     * @param options - Rows and/or columns to freeze; `topLeftCell` anchors
     *   the counts when omitted.
     */
    freezePanes(options: { rows?: number; columns?: number; topLeftCell?: string }): void;
    /** Unfreeze the sheet, letting every row and column scroll again. */
    unfreeze(): void;
}

/**
 * Wire model for sheetViews (primary view + optional opaque siblings).
 *
 * @private
 */
export interface SheetViewsModel {
    /** Whether a sheetViews element was present or has been authored. */
    readonly present: boolean;
    /** Primary sheetView attributes excluding modeled structure. */
    readonly primaryExtraAttrsXml: string;
    /** `sheetView@workbookViewId` (required by schema; default `"0"`). */
    readonly workbookViewId: string;
    /**
     * Primary `sheetView@showGridLines` (`CT_SheetView` xsd:boolean,
     * optional, XSD default `true`).
     *
     * - `undefined` — attribute absent (schema default `true` applies).
     * - `false` — gridlines hidden (emitted as `showGridLines="0"`).
     * - `true` — explicit setting on a **loaded** view (preserved and
     *   re-emitted as `showGridLines="1"`); authoring never sets `true`,
     *   because resetting to the default means removing the attribute.
     *
     * Citation: transitional `sml.xsd` L2341; ECMA-376-1 §18.3.1.87.
     */
    readonly showGridLines?: boolean;
    /**
     * Primary `sheetView@showRowColHeaders` (`CT_SheetView` xsd:boolean,
     * optional, XSD default `true`).
     *
     * - `undefined` — attribute absent (schema default `true` applies).
     * - `false` — row/column headers hidden (emitted as `showRowColHeaders="0"`).
     * - `true` — explicit setting on a **loaded** view (preserved and
     *   re-emitted as `showRowColHeaders="1"`); authoring never sets `true`,
     *   because resetting to the default means removing the attribute.
     *
     * Citation: transitional `sml.xsd` L2342; ECMA-376-1 §18.3.1.87.
     */
    readonly showRowColHeaders?: boolean;
    /**
     * Primary `sheetView@showZeros` (`CT_SheetView` xsd:boolean,
     * optional, XSD default `true`).
     *
     * - `undefined` — attribute absent (schema default `true` applies).
     * - `false` — zero values hidden (emitted as `showZeros="0"`).
     * - `true` — explicit setting on a **loaded** view (preserved and
     *   re-emitted as `showZeros="1"`); authoring never sets `true`,
     *   because resetting to the default means removing the attribute.
     *
     * Citation: transitional `sml.xsd` L2343; ECMA-376-1 §18.3.1.87.
     */
    readonly showZeros?: boolean;
    /**
     * Primary `sheetView@rightToLeft` (`CT_SheetView` xsd:boolean,
     * optional, XSD default `false`).
     *
     * - `undefined` — attribute absent (schema default `false` applies).
     * - `true` — RTL enabled (emitted as `rightToLeft="1"`).
     * - `false` — explicit setting on a **loaded** view (preserved and
     *   re-emitted as `rightToLeft="0"`); authoring never sets `false`,
     *   because resetting to the default means removing the attribute.
     *
     * Citation: transitional `sml.xsd` L2344; ECMA-376-1 §18.3.1.87.
     */
    readonly rightToLeft?: boolean;
    /**
     * Primary `sheetView@zoomScale` (`CT_SheetView` xsd:unsignedInt,
     * optional, XSD default `100`).
     *
     * - `undefined` — attribute absent (schema default `100` applies).
     * - any other non-negative integer — emitted as `zoomScale="N"`.
     * - Authoring the schema default (`100`) removes the attribute;
     *   a **loaded** explicit `100` is preserved and re-emitted.
     *
     * Citation: transitional `sml.xsd` L2353; ECMA-376-1 §18.3.1.87.
     */
    readonly zoomScale?: number;
    /**
     * Normalized A1 of the primary `sheetView@topLeftCell` (`ST_CellRef`,
     * optional, no default). Absent means the attribute was not stored —
     * `A1` is not invented. Invalid lexical forms stay in
     * {@link primaryExtraAttrsXml}.
     *
     * Citation: transitional sml.xsd `CT_SheetView` L2351; ECMA-376-1
     * §18.3.1.87. Not `pane/@topLeftCell`.
     */
    readonly topLeftCell?: string;
    /**
     * Normalized A1 `sqref` of the primary sheetView's topLeft selection
     * (`CT_Selection`, ECMA-376-1 §18.3.1.78). Absent means no modeled
     * selection element — the schema default `A1` is not invented when the
     * element itself is absent.
     */
    readonly selectedRange?: string;
    /**
     * Opaque non-pane children of the primary sheetView (extra `selection`
     * elements, pivotSelection, extLst) in stored order. The first topLeft /
     * pane-default `selection` is lifted into {@link selectedRange} and is
     * not in this list.
     */
    readonly primaryOtherChildrenXml: ReadonlyArray<string>;
    /** Full opaque sheetView elements after the primary (file order). */
    readonly extraSheetViewsXml: ReadonlyArray<string>;
    /** Pane model when a pane child exists or was authored. */
    readonly pane: PaneModel | undefined;
    /** Extra attributes on sheetViews root. */
    readonly rootExtraAttrsXml: string;
}

/**
 * Wire pane fields.
 *
 * @private
 */
export interface PaneModel {
    readonly xSplit: number;
    readonly ySplit: number;
    readonly topLeftCell: string | undefined;
    /**
     * Raw `pane/@topLeftCell` when it is present but not a valid `ST_CellRef`.
     * Kept so a no-op save does not repair it. Absent when the attribute was
     * lifted into {@link topLeftCell} or was not stored.
     */
    readonly topLeftCellRaw?: string;
    readonly activePane: ActivePane | undefined;
    readonly state: PaneState | undefined;
    /** Extra pane attributes. */
    readonly extraAttrsXml: string;
}

/**
 * Host notifications for freeze mutations.
 *
 * @private
 */
export interface FreezePanesHost {
    markDirty(): void;
}

const EMPTY_VIEWS: SheetViewsModel = {
    present: false,
    primaryExtraAttrsXml: '',
    workbookViewId: '0',
    primaryOtherChildrenXml: [],
    extraSheetViewsXml: [],
    pane: undefined,
    rootExtraAttrsXml: ''
};

/**
 * CT_Worksheet local names that appear **before** `sheetViews`.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const SHEET_VIEWS_PREDECESSORS: ReadonlyArray<string> = ['sheetPr', 'dimension'];

/**
 * CT_Worksheet local names that appear **after** `sheetViews` and before sheetData.
 */
export const SHEET_VIEWS_SUCCESSORS_BEFORE_SHEET_DATA: ReadonlyArray<string> = ['sheetFormatPr', 'cols'];

const SV_PRED: Set<string> = new Set(SHEET_VIEWS_PREDECESSORS);
const SV_SUCC: Set<string> = new Set(SHEET_VIEWS_SUCCESSORS_BEFORE_SHEET_DATA);

/**
 * Index at which to insert serialized `sheetViews` among before-sheetData siblings.
 *
 * @param {string} beforeSheetDataLocals - The beforeSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findSheetViewsInsertIndex(beforeSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < beforeSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = beforeSheetDataLocals[i];
        if (name !== undefined && SV_PRED.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < beforeSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = beforeSheetDataLocals[i];
        if (name !== undefined && SV_SUCC.has(name)) {
            return i;
        }
    }
    return beforeSheetDataLocals.length;
}

/**
 * Mutable freeze-panes store bound to a worksheet.
 *
 * @private
 */
export class FreezePanesImpl implements FreezePanes {
    private model: SheetViewsModel = { ...EMPTY_VIEWS };
    private host: FreezePanesHost | undefined;

    /**
     * Creates an instance.
     *
     * @param {SheetViewsModel} initial - The initial parameter.
     */
    public constructor(initial?: SheetViewsModel) {
        if (initial !== undefined) {
            this.model = cloneViews(initial);
        }
    }

    /**
     * bindHost method.
     *
     * @param {FreezePanesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: FreezePanesHost): void {
        this.host = host;
    }

    /**
     * replaceFromParse method.
     *
     * @param {SheetViewsModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: SheetViewsModel): void {
        this.model = cloneViews(model);
    }

    /**
     * toModel method.
     *
     * @returns {SheetViewsModel} - Returns the result.
     */
    public toModel(): SheetViewsModel {
        return cloneViews(this.model);
    }

    /**
     * Effective on-screen gridline visibility of the primary view. Absent `showGridLines` means the XSD default `true` (sml.xsd L2341).
     *
     * @returns {boolean} - Returns the result.
     */
    public getGridLinesVisible(): boolean {
        return this.model.showGridLines !== false;
    }

    /**
     * Author gridline visibility on the primary view. Setting `false` emits `showGridLines="0"`; setting `true` removes the attribute (schema default `true`), so only a genuinely hidden view carries it.
     *
     * @param {boolean} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    public setGridLinesVisible(value: boolean): void {
        const visible: boolean = Boolean(value);
        // Effective-visibility no-op: preserves a loaded explicit `"1"` untouched
        // (setting `true` on a visible sheet must not rewrite its wire form).
        if (this.getGridLinesVisible() === visible) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const { showGridLines: _removed, ...rest } = previous;
        // `visible === true` here means the previous state was `false` — reset
        // to the schema default by omitting the key entirely.
        const next: SheetViewsModel = visible ? { ...rest, present: true } : { ...rest, present: true, showGridLines: false };
        this.model = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Effective on-screen row/column header visibility of the primary view. Absent `showRowColHeaders` means the XSD default `true` (sml.xsd L2342).
     *
     * @returns {boolean} - Returns the result.
     */
    public getRowColumnHeadersVisible(): boolean {
        return this.model.showRowColHeaders !== false;
    }

    /**
     * Author row/column header visibility on the primary view. Setting `false` emits `showRowColHeaders="0"`; setting `true` removes the attribute (schema default `true`), so only a genuinely hidden-headers view carries it.
     *
     * @param {boolean} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    public setRowColumnHeadersVisible(value: boolean): void {
        const visible: boolean = Boolean(value);
        // Effective-value no-op: preserves a loaded explicit `"1"` untouched
        // (setting `true` on a headers-visible sheet must not rewrite its wire form).
        if (this.getRowColumnHeadersVisible() === visible) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const { showRowColHeaders: _removed, ...rest } = previous;
        // `visible === true` here means the previous state was `false` — reset
        // to the schema default by omitting the key entirely.
        const next: SheetViewsModel = visible ? { ...rest, present: true } : { ...rest, present: true, showRowColHeaders: false };
        this.model = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Effective on-screen zero-value display of the primary view. Absent `showZeros` means the XSD default `true` (sml.xsd L2343).
     *
     * @returns {boolean} - Returns the result.
     */
    public getDisplayZeros(): boolean {
        return this.model.showZeros !== false;
    }

    /**
     * Author zero-value display on the primary view. Setting `false` emits `showZeros="0"`; setting `true` removes the attribute (schema default `true`), so only a genuinely hidden-zeros view carries it.
     *
     * @param {boolean} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    public setDisplayZeros(value: boolean): void {
        const show: boolean = Boolean(value);
        // Effective-value no-op: preserves a loaded explicit `"1"` untouched
        // (setting `true` on a zeros-visible sheet must not rewrite its wire form).
        if (this.getDisplayZeros() === show) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const { showZeros: _removed, ...rest } = previous;
        // `show === true` here means the previous state was `false` — reset
        // to the schema default by omitting the key entirely.
        const next: SheetViewsModel = show ? { ...rest, present: true } : { ...rest, present: true, showZeros: false };
        this.model = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Effective right-to-left layout of the primary view. Absent `rightToLeft` means the XSD default `false` (sml.xsd L2344).
     *
     * @returns {boolean} - Returns the result.
     */
    public getRightToLeft(): boolean {
        return this.model.rightToLeft === true;
    }

    /**
     * Author right-to-left layout on the primary view. Setting `true` emits `rightToLeft="1"`; setting `false` removes the attribute (schema default `false`), so only an enabled view carries it.
     *
     * @param {boolean} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    public setRightToLeft(value: boolean): void {
        const rtl: boolean = Boolean(value);
        // Effective-value no-op: preserves a loaded explicit `"0"` untouched
        // (setting `false` on an LTR sheet must not rewrite its wire form).
        if (this.getRightToLeft() === rtl) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const { rightToLeft: _removed, ...rest } = previous;
        // `rtl === false` here means the previous state was `true` — reset
        // to the schema default by omitting the key entirely.
        const next: SheetViewsModel = rtl ? { ...rest, present: true, rightToLeft: true } : { ...rest, present: true };
        this.model = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Effective zoom percentage of the primary view. Absent `zoomScale` means the XSD default `100` (sml.xsd L2353).
     *
     * @returns {number} - Returns the result.
     */
    public getZoom(): number {
        return this.model.zoomScale != null ? this.model.zoomScale : 100;
    }

    /**
     * Author zoom percentage on the primary view. Values other than `100` emit `zoomScale="N"`; setting `100` removes the attribute (schema default), so only a non-default zoom carries it. A loaded explicit `100` is preserved when the effective value is unchanged.
     *
     * @param {number} value - The value parameter.
     * @returns {void} - Returns the result.
     */
    public setZoom(value: number): void {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new InvalidArgumentError('Zoom must be a finite number');
        }
        if (!Number.isInteger(value) || value < 0) {
            throw new InvalidArgumentError('Zoom must be an integer >= 0 (sheetView@zoomScale xsd:unsignedInt)');
        }
        // Effective-value no-op: preserves a loaded explicit `100` untouched
        // (setting `100` on a default-zoom sheet must not rewrite its wire form).
        if (this.getZoom() === value) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const { zoomScale: _removed, ...rest } = previous;
        // `value === 100` here means the previous state was non-default — reset
        // to the schema default by omitting the key entirely.
        const next: SheetViewsModel = value === 100 ? { ...rest, present: true } : { ...rest, present: true, zoomScale: value };
        this.model = next;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Normalized A1 of the primary `sheetView@topLeftCell`. Absent attribute
     * is `undefined` (no schema default).
     *
     * @returns {string | undefined} - Returns the result.
     * @private
     */
    public getViewTopLeftCell(): string | undefined {
        return this.model.topLeftCell;
    }

    /**
     * Author or clear the primary view scroll anchor. `undefined` removes
     * only that attribute. Does not create or edit `pane`.
     *
     * @param {string | undefined} value - The value parameter.
     * @returns {void} - Returns the result.
     * @private
     */
    public setViewTopLeftCell(value: string | undefined): void {
        if (value === undefined) {
            if (this.model.topLeftCell === undefined) {
                return;
            }
            const previous: SheetViewsModel = cloneViews(this.model);
            const rest: SheetViewsModel = omitViewTopLeftCell(previous);
            this.model = { ...rest, present: true };
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }
        if (this.model.topLeftCell === value) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        this.model = { ...previous, present: true, topLeftCell: value };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Normalized A1 of `pane/@topLeftCell` for any pane state. `undefined`
     * when there is no pane, the attribute is absent, or the stored lexical
     * form is not a cell reference (that form stays opaque).
     *
     * @returns {string | undefined} - Returns the result.
     * @private
     */
    public getPaneTopLeftCell(): string | undefined {
        const pane: PaneModel | undefined = this.model.pane;
        if (pane === undefined || pane.topLeftCellRaw !== undefined) {
            return undefined;
        }
        return pane.topLeftCell;
    }

    /**
     * Author or clear `pane/@topLeftCell` without changing split, state, or
     * active pane. Requires an existing pane — this does not invent a split
     * or a freeze. `undefined` removes only the attribute (including an
     * opaque invalid lexical form).
     *
     * @param {string | undefined} value - The value parameter.
     * @returns {void} - Returns the result.
     * @private
     */
    public setPaneTopLeftCell(value: string | undefined): void {
        const pane: PaneModel | undefined = this.model.pane;
        if (pane === undefined) {
            throw new InvalidArgumentError(
                'paneTopLeftCell requires an existing pane; it does not create a freeze or split'
            );
        }
        if (value === undefined) {
            if (pane.topLeftCell === undefined && pane.topLeftCellRaw === undefined) {
                return;
            }
            const previous: SheetViewsModel = cloneViews(this.model);
            const live: PaneModel | undefined = previous.pane;
            if (live === undefined) {
                return;
            }
            this.model = {
                ...previous,
                present: true,
                pane: omitPaneTopLeft(live)
            };
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }
        if (pane.topLeftCell === value && pane.topLeftCellRaw === undefined) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        const live: PaneModel | undefined = previous.pane;
        if (live === undefined) {
            throw new InvalidArgumentError(
                'paneTopLeftCell requires an existing pane; it does not create a freeze or split'
            );
        }
        this.model = {
            ...previous,
            present: true,
            pane: { ...omitPaneTopLeftRaw(live), topLeftCell: value }
        };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Normalized A1 address of the primary view's topLeft selection
     * (`selection@sqref`). Absent selection element means `undefined` (the
     * schema default `A1` is not invented). A loaded element with omitted
     * `sqref` is left opaque and is not lifted.
     *
     * @returns {string | undefined} - Returns the result.
     * @private
     */
    public getSelectedRange(): string | undefined {
        return this.model.selectedRange;
    }

    /**
     * Author or clear the primary view's topLeft selection. `undefined`
     * removes only that modeled element; sibling selections, pane, and view
     * flags stay. A value emits `sqref` and `activeCell` (range origin).
     * `pane` and `activeCellId` stay omitted (schema defaults `topLeft` / `0`).
     *
     * @param {string | undefined} value - The value parameter.
     * @returns {void} - Returns the result.
     * @private
     */
    public setSelectedRange(value: string | undefined): void {
        if (value === undefined) {
            if (this.model.selectedRange === undefined) {
                return;
            }
            const previous: SheetViewsModel = cloneViews(this.model);
            const rest: SheetViewsModel = omitSelectedRange(previous);
            this.model = { ...rest, present: true };
            if (this.host != null) {
                this.host.markDirty();
            }
            return;
        }
        if (this.model.selectedRange === value) {
            return;
        }
        const previous: SheetViewsModel = cloneViews(this.model);
        this.model = { ...previous, present: true, selectedRange: value };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets isFrozen.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isFrozen(): boolean {
        const state: PaneState = this.model.pane == null ? undefined : this.model.pane.state;
        return state === 'frozen' || state === 'frozenSplit';
    }

    /**
     * Gets columns.
     *
     * @returns {number} - Returns the result.
     */
    public get columns(): number {
        if (!this.isFrozen) {
            return 0;
        }
        const x: number = ((__t: number): number => (__t != null ? __t : 0))(this.model.pane == null ? undefined : this.model.pane.xSplit);
        return Number.isFinite(x) ? Math.max(0, Math.floor(x)) : 0;
    }

    /**
     * Gets rows.
     *
     * @returns {number} - Returns the result.
     */
    public get rows(): number {
        if (!this.isFrozen) {
            return 0;
        }
        const y: number = ((__t: number): number => (__t != null ? __t : 0))(this.model.pane == null ? undefined : this.model.pane.ySplit);
        return Number.isFinite(y) ? Math.max(0, Math.floor(y)) : 0;
    }

    /**
     * Gets topLeftCell.
     *
     * @returns {string} - Returns the result.
     */
    public get topLeftCell(): string | undefined {
        return this.getPaneTopLeftCell();
    }

    /**
     * freezeAt method.
     *
     * @param {string} anchor - The anchor parameter.
     * @returns {void} - Returns the result.
     */
    public freezeAt(anchor: string): void {
        if (typeof anchor !== 'string') {
            throw new InvalidArgumentError('Freeze anchor must be a string');
        }
        let coord: any;
        try {
            coord = parseA1(anchor);
        } catch (err) {
            throw new InvalidAddressError(`Invalid freeze anchor "${anchor}"`, {
                cause: err
            });
        }
        const columns: number = coord.col - 1;
        const rows: number = coord.row - 1;
        if (columns <= 0 && rows <= 0) {
            throw new InvalidArgumentError('Freeze anchor A1 freezes nothing; use a cell below and/or right of the freeze region');
        }
        this.applyFreeze(rows, columns, formatA1(coord.row, coord.col));
    }

    /**
     * freezePanes method.
     *
     * @param {Object} options - The options parameter.
     * @param {*} [options.rows] - Optional rows field.
     * @param {*} [options.columns] - Optional columns field.
     * @param {*} [options.topLeftCell] - Optional topLeftCell field.
     * @returns {void} - Returns the result.
     */
    public freezePanes(options: { rows?: number; columns?: number; topLeftCell?: string }): void {
        if (options === null || typeof options !== 'object') {
            throw new InvalidArgumentError('Freeze options must be an object');
        }
        const rows: number = normalizeCount(options.rows, 'rows');
        const columns: number = normalizeCount(options.columns, 'columns');
        if (rows === 0 && columns === 0) {
            throw new InvalidArgumentError('Freeze requires rows > 0 and/or columns > 0');
        }
        let topLeft: string;
        if (options.topLeftCell !== undefined) {
            if (typeof options.topLeftCell !== 'string') {
                throw new InvalidArgumentError('topLeftCell must be a string');
            }
            try {
                const c: any = parseA1(options.topLeftCell);
                topLeft = formatA1(c.row, c.col);
            } catch (err) {
                throw new InvalidAddressError(`Invalid topLeftCell "${options.topLeftCell}"`, { cause: err });
            }
        } else {
            topLeft = formatA1(rows + 1, columns + 1);
        }
        this.applyFreeze(rows, columns, topLeft);
    }

    /**
     * unfreeze method.
     *
     * @returns {void} - Returns the result.
     */
    public unfreeze(): void {
        if (this.model.pane === undefined && !this.model.present) {
            return;
        }
        this.model = {
            ...this.model,
            present: true,
            pane: undefined
        };
        // If nothing left to show (no extra views/children and never had other attrs),
        // still keep present so serializer can drop empty sheetViews cleanly.
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * applyFreeze method.
     *
     * @param {number} rows - The rows parameter.
     * @param {number} columns - The columns parameter.
     * @param {string} topLeftCell - The topLeftCell parameter.
     * @returns {void} - Returns the result.
     */
    private applyFreeze(rows: number, columns: number, topLeftCell: string): void {
        const activePane: ActivePane = defaultActivePane(columns, rows);
        const {
            showGridLines: previousGridLines,
            showRowColHeaders: previousShowRowColHeaders,
            showZeros: previousShowZeros,
            rightToLeft: previousRightToLeft,
            zoomScale: previousZoomScale
        } = this.model;
        this.model = {
            present: true,
            primaryExtraAttrsXml: this.model.primaryExtraAttrsXml,
            workbookViewId: this.model.workbookViewId.trim().length > 0 ? this.model.workbookViewId : '0',
            ...(previousGridLines === undefined ? {} : { showGridLines: previousGridLines }),
            ...(previousShowRowColHeaders === undefined ? {} : { showRowColHeaders: previousShowRowColHeaders }),
            ...(previousShowZeros === undefined ? {} : { showZeros: previousShowZeros }),
            ...(previousRightToLeft === undefined ? {} : { rightToLeft: previousRightToLeft }),
            ...(previousZoomScale === undefined ? {} : { zoomScale: previousZoomScale }),
            ...(this.model.selectedRange === undefined
                ? {}
                : { selectedRange: this.model.selectedRange }),
            primaryOtherChildrenXml: [...this.model.primaryOtherChildrenXml],
            extraSheetViewsXml: [...this.model.extraSheetViewsXml],
            rootExtraAttrsXml: this.model.rootExtraAttrsXml,
            pane: {
                xSplit: columns,
                ySplit: rows,
                topLeftCell,
                activePane,
                state: 'frozen',
                extraAttrsXml: ((__t: string): string => (__t != null ? __t : ''))(
                    this.model.pane == null ? undefined : this.model.pane.extraAttrsXml
                )
            }
        };
        if (this.host != null) {
            this.host.markDirty();
        }
    }
}

/**
 * Parse a `sheetViews` element into a model.
 *
 * @param {string} xml - The xml parameter.
 * @returns {SheetViewsModel} - Returns the result.
 */
export function parseSheetViewsXml(xml: string): SheetViewsModel {
    const rootAttrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(xml));
    const rootExtraAttrsXml: string = attrsToXmlExcluding(rootAttrs, new Set());
    const children: string[] = splitTopLevelLocal(elementInnerLocal(xml));
    const sheetViews: string[] = children.filter((c: string): boolean => elementLocalNameLocal(c) === 'sheetView');
    if (sheetViews.length === 0) {
        return {
            present: true,
            primaryExtraAttrsXml: '',
            workbookViewId: '0',
            primaryOtherChildrenXml: [],
            extraSheetViewsXml: [],
            pane: undefined,
            rootExtraAttrsXml
        };
    }
    const primary: string = sheetViews[0] != null ? sheetViews[0] : '';
    const extraSheetViewsXml: string[] = sheetViews.slice(1);
    const primaryAttrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(primary));
    const workbookViewIdRaw: string = primaryAttrs.get('workbookViewId');
    const workbookViewId: string = workbookViewIdRaw !== undefined ? workbookViewIdRaw : '0';
    const showGridLines: boolean = parseSheetViewBooleanAttr(primaryAttrs.get('showGridLines'));
    const showRowColHeaders: boolean = parseSheetViewBooleanAttr(primaryAttrs.get('showRowColHeaders'));
    const showZeros: boolean = parseSheetViewBooleanAttr(primaryAttrs.get('showZeros'));
    const rightToLeft: boolean = parseSheetViewBooleanAttr(primaryAttrs.get('rightToLeft'));
    const zoomScale: number = parseSheetViewUnsignedIntAttr(primaryAttrs.get('zoomScale'));
    // A modeled (valid) value is strip-managed; an invalid lexical form stays
    // in the opaque extras bag so a no-op save preserves it verbatim
    // (`.agent/policies/ooxml.md` — parsers do not repair or invent values).
    const primaryExclude: Set<string> = new Set(['workbookViewId']);
    if (showGridLines !== undefined || primaryAttrs.get('showGridLines') === undefined) {
        primaryExclude.add('showGridLines');
    }
    if (showRowColHeaders !== undefined || primaryAttrs.get('showRowColHeaders') === undefined) {
        primaryExclude.add('showRowColHeaders');
    }
    if (showZeros !== undefined || primaryAttrs.get('showZeros') === undefined) {
        primaryExclude.add('showZeros');
    }
    if (rightToLeft !== undefined || primaryAttrs.get('rightToLeft') === undefined) {
        primaryExclude.add('rightToLeft');
    }
    if (zoomScale !== undefined || primaryAttrs.get('zoomScale') === undefined) {
        primaryExclude.add('zoomScale');
    }
    const viewTopLeftCell: string | undefined = parseSheetViewCellRef(primaryAttrs.get('topLeftCell'));
    // Invalid lexical stays in the opaque bag. A valid ref, or an absent
    // attribute, is strip-managed so authoring can rewrite only this attr.
    if (viewTopLeftCell !== undefined || primaryAttrs.get('topLeftCell') === undefined) {
        primaryExclude.add('topLeftCell');
    }
    const primaryExtraAttrsXml: string = attrsToXmlExcluding(primaryAttrs, primaryExclude);
    const primaryChildren: string[] = splitTopLevelLocal(elementInnerLocal(primary));
    let pane: PaneModel | undefined;
    let selectedRange: string | undefined;
    const primaryOtherChildrenXml: string[] = [];
    for (const child of primaryChildren) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'pane') {
            pane = parsePane(child);
            continue;
        }
        // First topLeft / pane-default selection is modeled. Further selection
        // elements (other panes, or a second topLeft) stay opaque in file order.
        // CT_SheetView allows up to four selection children (sml.xsd).
        if (local === 'selection' && selectedRange === undefined) {
            const lifted: string | undefined = tryLiftTopLeftSelection(child);
            if (lifted !== undefined) {
                selectedRange = lifted;
                continue;
            }
        }
        primaryOtherChildrenXml.push(child);
    }
    return {
        present: true,
        primaryExtraAttrsXml,
        workbookViewId,
        ...(viewTopLeftCell === undefined ? {} : { topLeftCell: viewTopLeftCell }),
        ...(showGridLines === undefined ? {} : { showGridLines }),
        ...(showRowColHeaders === undefined ? {} : { showRowColHeaders }),
        ...(showZeros === undefined ? {} : { showZeros }),
        ...(rightToLeft === undefined ? {} : { rightToLeft }),
        ...(zoomScale === undefined ? {} : { zoomScale }),
        ...(selectedRange === undefined ? {} : { selectedRange }),
        primaryOtherChildrenXml,
        extraSheetViewsXml,
        pane,
        rootExtraAttrsXml
    };
}

/**
 * Serialize sheetViews, or `undefined` when absent and empty.
 *
 * @param {SheetViewsModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
export function serializeSheetViewsXml(model: SheetViewsModel): string | undefined {
    if (!model.present) {
        return undefined;
    }
    const hasPane: boolean = model.pane !== undefined;
    const hasGridLinesFlag: boolean = model.showGridLines !== undefined;
    const hasRowColHeadersFlag: boolean = model.showRowColHeaders !== undefined;
    const hasShowZerosFlag: boolean = model.showZeros !== undefined;
    const hasRightToLeftFlag: boolean = model.rightToLeft !== undefined;
    const hasViewTopLeft: boolean = model.topLeftCell !== undefined;
    const hasZoomFlag: boolean = model.zoomScale !== undefined;
    const hasSelection: boolean = model.selectedRange !== undefined;
    const hasOther: boolean =
        model.primaryOtherChildrenXml.length > 0 ||
        model.extraSheetViewsXml.length > 0 ||
        model.primaryExtraAttrsXml.trim().length > 0 ||
        model.rootExtraAttrsXml.trim().length > 0;
    // Authoring unfreeze with no other content → omit entire sheetViews.
    // A modeled `showGridLines` / `showRowColHeaders` / `showZeros` / `rightToLeft` / `zoomScale`
    // value is authored/parsed content and keeps the element alive (emit
    // non-default flags / preserve explicit loaded defaults).
    if (
        !hasPane &&
        !hasOther &&
        !hasGridLinesFlag &&
        !hasRowColHeadersFlag &&
        !hasShowZerosFlag &&
        !hasRightToLeftFlag &&
        !hasViewTopLeft &&
        !hasZoomFlag &&
        !hasSelection
    ) {
        return undefined;
    }

    const viewAttrs: string[] = [`workbookViewId="${escapeXml(model.workbookViewId || '0')}"`];
    if (model.showGridLines === false) {
        viewAttrs.push('showGridLines="0"');
    } else if (model.showGridLines === true) {
        viewAttrs.push('showGridLines="1"');
    }
    // XSD attribute order: showGridLines → showRowColHeaders → showZeros
    // (transitional sml.xsd CT_SheetView L2341–L2343).
    if (model.showRowColHeaders === false) {
        viewAttrs.push('showRowColHeaders="0"');
    } else if (model.showRowColHeaders === true) {
        viewAttrs.push('showRowColHeaders="1"');
    }
    if (model.showZeros === false) {
        viewAttrs.push('showZeros="0"');
    } else if (model.showZeros === true) {
        viewAttrs.push('showZeros="1"');
    }
    if (model.rightToLeft === true) {
        viewAttrs.push('rightToLeft="1"');
    } else if (model.rightToLeft === false) {
        viewAttrs.push('rightToLeft="0"');
    }
    if (model.zoomScale !== undefined) {
        viewAttrs.push(`zoomScale="${model.zoomScale}"`);
    }
    // topLeftCell precedes zoomScale in the XSD, but this serializer keeps
    // the existing flag/zoom order and emits the modeled cell ref before
    // opaque extras. Citation: transitional sml.xsd CT_SheetView L2351.
    if (model.topLeftCell !== undefined) {
        viewAttrs.push(`topLeftCell="${escapeXml(model.topLeftCell)}"`);
    }
    if (model.primaryExtraAttrsXml.trim().length > 0) {
        viewAttrs.push(model.primaryExtraAttrsXml.trim());
    }

    const inner: string[] = [];
    if (model.pane !== undefined) {
        inner.push(serializePane(model.pane));
    }
    // CT_SheetView sequence: pane, then selection, then pivotSelection, extLst
    // (transitional sml.xsd). Modeled topLeft selection is emitted before the
    // remaining opaque children.
    if (model.selectedRange !== undefined) {
        inner.push(serializeTopLeftSelection(model.selectedRange));
    }
    for (const c of model.primaryOtherChildrenXml) {
        inner.push(c);
    }

    let primaryView: string;
    if (inner.length === 0) {
        primaryView = `<sheetView ${viewAttrs.join(' ')}/>`;
    } else {
        primaryView = `<sheetView ${viewAttrs.join(' ')}>${inner.join('')}</sheetView>`;
    }

    const parts: string[] = [];
    const rootExtra: string = model.rootExtraAttrsXml.trim().length > 0 ? ` ${model.rootExtraAttrsXml.trim()}` : '';
    parts.push(`<sheetViews${rootExtra}>`);
    parts.push(primaryView);
    for (const extra of model.extraSheetViewsXml) {
        parts.push(extra);
    }
    parts.push('</sheetViews>');
    return parts.join('');
}

/**
 * parsePane function.
 *
 * @param {string} el - The el parameter.
 * @returns {PaneModel} - Returns the result.
 */
function parsePane(el: string): PaneModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(el));
    const xSplit: number = parseSplit(attrs.get('xSplit'));
    const ySplit: number = parseSplit(attrs.get('ySplit'));
    const topLeftRaw: string = attrs.get('topLeftCell');
    let topLeftCell: string | undefined;
    let topLeftCellRaw: string | undefined;
    if (topLeftRaw !== undefined && topLeftRaw.trim().length > 0) {
        const normalized: string | undefined = parseSheetViewCellRef(topLeftRaw);
        if (normalized !== undefined) {
            topLeftCell = normalized;
        } else {
            // Do not repair. The raw form is re-emitted until the caller sets
            // a valid cell or clears the attribute.
            topLeftCellRaw = topLeftRaw;
        }
    }
    const activeRaw: string = attrs.get('activePane');
    const activePane: ActivePane = parseActivePane(activeRaw);
    const stateRaw: string = attrs.get('state');
    const state: PaneState = parsePaneState(stateRaw);
    const extraAttrsXml: string = attrsToXmlExcluding(attrs, new Set(['xSplit', 'ySplit', 'topLeftCell', 'activePane', 'state']));
    return {
        ...(topLeftCellRaw === undefined ? {} : { topLeftCellRaw }),
        xSplit,
        ySplit,
        topLeftCell,
        activePane,
        state,
        extraAttrsXml
    };
}

/**
 * serializePane function.
 *
 * @param {PaneModel} pane - The pane parameter.
 * @returns {string} - Returns the result.
 */
function serializePane(pane: PaneModel): string {
    const attrs: string[] = [];
    if (pane.xSplit !== 0) {
        attrs.push(`xSplit="${formatSplit(pane.xSplit)}"`);
    }
    if (pane.ySplit !== 0) {
        attrs.push(`ySplit="${formatSplit(pane.ySplit)}"`);
    }
    if (pane.topLeftCellRaw !== undefined && pane.topLeftCellRaw.length > 0) {
        attrs.push(`topLeftCell="${escapeXml(pane.topLeftCellRaw)}"`);
    } else if (pane.topLeftCell !== undefined && pane.topLeftCell.length > 0) {
        attrs.push(`topLeftCell="${escapeXml(pane.topLeftCell)}"`);
    }
    if (pane.activePane !== undefined) {
        attrs.push(`activePane="${pane.activePane}"`);
    }
    if (pane.state !== undefined) {
        attrs.push(`state="${pane.state}"`);
    }
    if (pane.extraAttrsXml.trim().length > 0) {
        attrs.push(pane.extraAttrsXml.trim());
    }
    if (attrs.length === 0) {
        return '<pane/>';
    }
    return `<pane ${attrs.join(' ')}/>`;
}

/**
 * parseSplit function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseSplit(raw: string | undefined): number {
    if (raw === undefined || raw.trim().length === 0) {
        return 0;
    }
    const n: number = Number(raw);
    if (!Number.isFinite(n) || n < 0) {
        return 0;
    }
    return n;
}

/**
 * formatSplit function.
 *
 * @param {number} n - The n parameter.
 * @returns {string} - Returns the result.
 */
function formatSplit(n: number): string {
    if (Number.isInteger(n)) {
        return String(n);
    }
    return String(n);
}

/**
 * parseActivePane function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {*} - Returns the result.
 */
function parseActivePane(raw: string | undefined): ActivePane | undefined {
    if (raw === undefined) {
        return undefined;
    }
    switch (raw) {
    case 'bottomLeft':
    case 'bottomRight':
    case 'topLeft':
    case 'topRight':
        return raw;
    default:
        return undefined;
    }
}

/**
 * parsePaneState function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {*} - Returns the result.
 */
function parsePaneState(raw: string | undefined): PaneState | undefined {
    if (raw === undefined) {
        return undefined;
    }
    switch (raw) {
    case 'frozen':
    case 'split':
    case 'frozenSplit':
        return raw;
    default:
        return undefined;
    }
}

/**
 * defaultActivePane function.
 *
 * @param {number} columns - The columns parameter.
 * @param {number} rows - The rows parameter.
 * @returns {ActivePane} - Returns the result.
 */
/**
 * Drop a modeled selection without a rest binding. TypeScript 3.3 excess
 * property checks reject a destructured remainder as SheetViewsModel.
 *
 * @param {SheetViewsModel} model - The model parameter.
 * @returns {SheetViewsModel} - Returns the result.
 */
function omitSelectedRange(model: SheetViewsModel): SheetViewsModel {
    return {
        present: model.present,
        primaryExtraAttrsXml: model.primaryExtraAttrsXml,
        workbookViewId: model.workbookViewId,
        ...(model.showGridLines === undefined ? {} : { showGridLines: model.showGridLines }),
        ...(model.showRowColHeaders === undefined ? {} : { showRowColHeaders: model.showRowColHeaders }),
        ...(model.showZeros === undefined ? {} : { showZeros: model.showZeros }),
        ...(model.topLeftCell === undefined ? {} : { topLeftCell: model.topLeftCell }),
        ...(model.rightToLeft === undefined ? {} : { rightToLeft: model.rightToLeft }),
        ...(model.zoomScale === undefined ? {} : { zoomScale: model.zoomScale }),
        primaryOtherChildrenXml: [...model.primaryOtherChildrenXml],
        extraSheetViewsXml: [...model.extraSheetViewsXml],
        pane: model.pane === undefined ? undefined : { ...model.pane },
        rootExtraAttrsXml: model.rootExtraAttrsXml
    };
}

/**
 * Lift a `selection` element that belongs to the topLeft pane.
 *
 * Returns the normalized A1 address, or `undefined` when the element must
 * stay opaque (non-topLeft `pane`, non-empty element content, or an
 * `sqref` this library will not rewrite). Parsers do not repair.
 *
 * Citations: ECMA-376-1 §18.3.1.78; transitional sml.xsd `CT_Selection`;
 * `[MS-OI29500]` §2.1.649 (omitted `activeCell` defaults to A1 in Excel).
 *
 * @param {string} el - The el parameter.
 * @returns {string | undefined} - Returns the result.
 */
function tryLiftTopLeftSelection(el: string): string | undefined {
    const trimmed: string = el.trim();
    if (!/\/\s*>$/.test(trimmed)) {
        return undefined;
    }
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(trimmed));
    const pane: string | undefined = attrs.get('pane');
    if (pane !== undefined && pane !== 'topLeft') {
        return undefined;
    }
    const sqrefRaw: string | undefined = attrs.get('sqref');
    // Omitted or empty sqref is the schema default A1, but lifting it would
    // rewrite the element (and invent activeCell). Leave it opaque.
    if (sqrefRaw === undefined || sqrefRaw.trim().length === 0) {
        return undefined;
    }
    const parts: string[] = sqrefRaw.trim().split(/\s+/);
    if (parts.length !== 1) {
        return undefined;
    }
    let address: string;
    try {
        address = formatA1Range(parseA1Range(parts[0]));
    } catch (_err) {
        return undefined;
    }
    const activeCell: string | undefined = attrs.get('activeCell');
    if (activeCell !== undefined) {
        let active: string;
        try {
            const coord: { row: number; col: number } = parseA1(activeCell);
            active = formatA1(coord.row, coord.col);
        } catch (_err) {
            return undefined;
        }
        const origin: string = address.indexOf(':') < 0 ? address : address.slice(0, address.indexOf(':'));
        if (active !== origin) {
            return undefined;
        }
    }
    const activeCellId: string | undefined = attrs.get('activeCellId');
    if (activeCellId !== undefined && activeCellId !== '0') {
        return undefined;
    }
    const known: Set<string> = new Set(['pane', 'sqref', 'activeCell', 'activeCellId']);
    const extras: string = attrsToXmlExcluding(attrs, known);
    if (extras.trim().length > 0) {
        return undefined;
    }
    if (pane === 'topLeft') {
        return undefined;
    }
    return address;
}

/**
 * Emit a topLeft selection. `pane` and `activeCellId` are omitted (schema
 * defaults). `activeCell` is the range origin so Excel's highlight and
 * active cell agree.
 *
 * @param {string} address - The address parameter.
 * @returns {string} - Returns the result.
 */
function serializeTopLeftSelection(address: string): string {
    const origin: string = address.indexOf(':') < 0 ? address : address.slice(0, address.indexOf(':'));
    return `<selection activeCell="${escapeXml(origin)}" sqref="${escapeXml(address)}"/>`;
}

/**
 * defaultActivePane function.
 *
 * @param {number} columns - The columns parameter.
 * @param {number} rows - The rows parameter.
 * @returns {ActivePane} - Returns the result.
 */
function defaultActivePane(columns: number, rows: number): ActivePane {
    if (columns > 0 && rows > 0) {
        return 'bottomRight';
    }
    if (rows > 0) {
        return 'bottomLeft';
    }
    if (columns > 0) {
        return 'topRight';
    }
    return 'topLeft';
}

/**
 * normalizeCount function.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function normalizeCount(value: number | undefined, label: string): number {
    if (value === undefined) {
        return 0;
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new InvalidArgumentError(`Freeze ${label} must be a finite number`);
    }
    if (!Number.isInteger(value) || value < 0) {
        throw new InvalidArgumentError(`Freeze ${label} must be an integer >= 0`);
    }
    return value;
}
/**
 * cloneViews function.
 *
 * @param {SheetViewsModel} m - The m parameter.
 * @returns {SheetViewsModel} - Returns the result.
 */
function cloneViews(m: SheetViewsModel): SheetViewsModel {
    return {
        present: m.present,
        primaryExtraAttrsXml: m.primaryExtraAttrsXml,
        workbookViewId: m.workbookViewId,
        ...(m.showGridLines === undefined ? {} : { showGridLines: m.showGridLines }),
        ...(m.showRowColHeaders === undefined ? {} : { showRowColHeaders: m.showRowColHeaders }),
        ...(m.showZeros === undefined ? {} : { showZeros: m.showZeros }),
        ...(m.rightToLeft === undefined ? {} : { rightToLeft: m.rightToLeft }),
        ...(m.topLeftCell === undefined ? {} : { topLeftCell: m.topLeftCell }),
        ...(m.zoomScale === undefined ? {} : { zoomScale: m.zoomScale }),
        ...(m.selectedRange === undefined ? {} : { selectedRange: m.selectedRange }),
        primaryOtherChildrenXml: [...m.primaryOtherChildrenXml],
        extraSheetViewsXml: [...m.extraSheetViewsXml],
        pane: m.pane === undefined ? undefined : { ...m.pane },
        rootExtraAttrsXml: m.rootExtraAttrsXml
    };
}

/**
 * Drop the modeled view scroll anchor without inventing a default cell.
 *
 * @param {SheetViewsModel} model - The model parameter.
 * @returns {SheetViewsModel} - Returns the result.
 */
function omitViewTopLeftCell(model: SheetViewsModel): SheetViewsModel {
    return {
        present: model.present,
        primaryExtraAttrsXml: model.primaryExtraAttrsXml,
        workbookViewId: model.workbookViewId,
        ...(model.showGridLines === undefined ? {} : { showGridLines: model.showGridLines }),
        ...(model.showRowColHeaders === undefined ? {} : { showRowColHeaders: model.showRowColHeaders }),
        ...(model.showZeros === undefined ? {} : { showZeros: model.showZeros }),
        ...(model.rightToLeft === undefined ? {} : { rightToLeft: model.rightToLeft }),
        ...(model.zoomScale === undefined ? {} : { zoomScale: model.zoomScale }),
        ...(model.selectedRange === undefined ? {} : { selectedRange: model.selectedRange }),
        primaryOtherChildrenXml: [...model.primaryOtherChildrenXml],
        extraSheetViewsXml: [...model.extraSheetViewsXml],
        pane: model.pane === undefined ? undefined : { ...model.pane },
        rootExtraAttrsXml: model.rootExtraAttrsXml
    };
}

/**
 * Drop both pane scroll-anchor fields.
 *
 * @param {PaneModel} pane - The pane parameter.
 * @returns {PaneModel} - Returns the result.
 */
function omitPaneTopLeft(pane: PaneModel): PaneModel {
    return {
        xSplit: pane.xSplit,
        ySplit: pane.ySplit,
        topLeftCell: undefined,
        activePane: pane.activePane,
        state: pane.state,
        extraAttrsXml: pane.extraAttrsXml
    };
}

/**
 * Drop an opaque invalid pane cell ref, keeping a modeled address.
 *
 * @param {PaneModel} pane - The pane parameter.
 * @returns {PaneModel} - Returns the result.
 */
function omitPaneTopLeftRaw(pane: PaneModel): PaneModel {
    return {
        xSplit: pane.xSplit,
        ySplit: pane.ySplit,
        topLeftCell: pane.topLeftCell,
        activePane: pane.activePane,
        state: pane.state,
        extraAttrsXml: pane.extraAttrsXml
    };
}

/**
 * Parse `sheetView@topLeftCell` / `pane@topLeftCell` (`ST_CellRef`).
 * Returns a normalized A1 address, or `undefined` when absent or invalid.
 * Parsers do not repair an invalid lexical form.
 *
 * Citation: transitional sml.xsd `ST_CellRef`; ECMA-376-1 §18.18.7.
 *
 * @param {string | undefined} raw - The raw parameter.
 * @returns {string | undefined} - Returns the result.
 */
function parseSheetViewCellRef(raw: string | undefined): string | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    try {
        const c: { row: number; col: number } = parseA1(raw);
        return formatA1(c.row, c.col);
    } catch (_err) {
        return undefined;
    }
}

/**
 * Parse a `CT_SheetView` xsd:boolean lexical value (`showGridLines`, `rightToLeft`, and siblings that share the same lexical space). Accepts both lexical families the XSD allows (`"0"`/`"1"` and `"true"`/`"false"`, any case). Returns `undefined` for absent or non-boolean values: an invalid lexical form is dropped rather than repaired (parsers do not invent attribute values).
 *
 * @param {string | undefined} raw - The raw parameter.
 * @returns {boolean | undefined} - Returns the result.
 */
function parseSheetViewBooleanAttr(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    switch (raw.trim().toLowerCase()) {
    case '0':
    case 'false':
        return false;
    case '1':
    case 'true':
        return true;
    default:
        return undefined;
    }
}

/**
 * Parse a `CT_SheetView` xsd:unsignedInt lexical value (`zoomScale` and siblings that share the same lexical space). Accepts non-negative integer digit strings only. Returns `undefined` for absent or non-integer values: an invalid lexical form is dropped rather than repaired (parsers do not invent attribute values).
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseSheetViewUnsignedIntAttr(raw: string | undefined): number | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const trimmed: string = raw.trim();
    if (!/^\d+$/.test(trimmed)) {
        return undefined;
    }
    const n: number = Number(trimmed);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
        return undefined;
    }
    return n;
}

/* ── minimal local XML helpers ── */

/**
 * elementLocalNameLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalNameLocal(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

/**
 * findTagEndLocal function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
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
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosingLocal(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}\\s*>`, 'g');
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
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
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
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
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
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * escapeRegExpLocal function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExpLocal(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
