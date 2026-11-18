/**
 * Worksheet sort state (`CT_SortState` / `CT_SortCondition`).
 *
 * Citations:
 * - ECMA-376-1 5th ed. §18.3.1.91 `sortCondition`, §18.3.1.92 `sortState`
 * - transitional sml.xsd `CT_SortState` ~L151–160, `CT_SortCondition`
 *   ~L161–171, `ST_SortBy` ~L172–179, `ST_SortMethod` ~L181–187
 * - `CT_Worksheet` sequence: `autoFilter` → **`sortState`** →
 *   `dataConsolidate` (~L2182–2186)
 * - docs/requirements/sort-state.md; docs/specs/sort-state.md;
 *   docs/ooxml-mapping/sort-state.md
 *
 * This feature is the **state record** Excel persists after a user sort.
 * It never sorts, moves, or rewrites cell data. Unsupported content
 * (unknown attributes/children, `extLst`, unparsable refs, `sortCondition`
 * overflow beyond the schema's `maxOccurs="64"`) round-trips opaquely in
 * relative order; invalid lexical forms stay untouched on no-op saves.
 */

import { formatA1Range, parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidSortStateError } from '../core/errors';
import { attrsToXmlExcluding, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';
import { IconSetType } from './conditional-formatting';

/**
 * Specifies what a sort level compares — cell values, cell colors, font
 * colors, or icons.
 */
export type SortBy = 'value' | 'cellColor' | 'fontColor' | 'icon';

/** Specifies the collation method used when sorting East-Asian text. */
export type SortMethod = 'stroke' | 'pinYin' | 'none';

/**
 * Represents one sort level in a recorded sort, letting you set its
 * direction and what it compares, such as cell values or colors.
 *
 * Mutating setters mark the sheet dirty. Authoring keeps at most one
 * modeled condition (each {@link DataSorter.add} replaces prior entries);
 * loaded multi-condition records keep file order (§18.3.1.91).
 */
export interface SortCondition {
    /**
     * The part of the data the condition sorts, written as an A1-style
     * reference (e.g. `'A1:C10'`). Authored conditions always match the parent
     * {@link DataSorter.range}; on load, foreign files may use a narrower key
     * column inside that range.
     */
    readonly range: string;
    /**
     * Whether the sort goes from highest to lowest instead of lowest to
     * highest. Default `false`.
     */
    isDescending: boolean;
    /**
     * What the sort compares when ordering entries — normal cell values
     * (`'value'`, the default) or their formatting (`'cellColor'`,
     * `'fontColor'`, `'icon'`).
     */
    sortBy: SortBy;
    /**
     * A custom order to sort by, given as a comma-separated list — for
     * example `'Low,Medium,High'` — or `undefined` for none. Stored as
     * text and never evaluated.
     */
    customList: string | undefined;
    /**
     * Raw `dxfId` read from the file when `sortBy` is a color sort;
     * `undefined` when absent. Data only — this feature never allocates or
     * renumbers stylesheet `dxfs`.
     *
     * @private
     */
    readonly dxfId: number | undefined;
    /**
     * Icon set family when `@iconSet` is present (`CT_SortCondition/@iconSet`,
     * schema default `3Arrows`); `undefined` when the attribute is absent.
     *
     * @private
     */
    readonly iconSet: IconSetType | undefined;
    /**
     * Zero-based icon index (`@iconId`) or `undefined` when absent.
     *
     * @private
     */
    readonly iconId: number | undefined;
}

/**
 * Represents the sort settings recorded for a range of cells, letting you
 * define how its rows or columns should be ordered.
 */
export interface DataSorter {
    /**
     * The range of data to sort, written as an A1-style reference
     * (e.g. `'A1:C10'`). The sort conditions defined on this sorter apply to
     * this same range.
     */
    readonly range: string;
    /**
     * Whether the sort rearranges columns (left to right) instead of rows
     * (top to bottom). Default `false`.
     */
    isColumnSort: boolean;
    /**
     * Whether the sort treats uppercase and lowercase letters as different
     * when comparing text. Default `false`.
     */
    isCaseSensitive: boolean;
    /**
     * Internal OOXML collation method (`CT_SortState/@sortMethod`). Preserved
     * during load/save but not part of the application-facing sorting API.
     *
     * @private
     */
    sortMethod: SortMethod;
    /**
     * The number of sort conditions currently defined on this sorter, in the
     * order they apply.
     */
    readonly count: number;
    /**
     * Get all current sort conditions as a list, in the order they apply.
     *
     * @returns {*} the current sort conditions.
     */
    list(): ReadonlyArray<SortCondition>;
    /**
     * Define the sort condition for this sorter, which sorts the given cell
     * range. Any previously defined conditions are removed first, so the new
     * condition is the only one that applies.
     *
     * @param range - The range of data to sort, as an A1-style reference
     *   (e.g. `'A1:C10'`).
     * @returns {Object} the newly created sort condition — set its direction,
     *   comparison, and custom order on the returned handle.
     * @throws InvalidArgumentError when `range` is empty or not a string
     * @throws InvalidSortStateError when `range` is not a valid A1 range
     */
    add(range: string): SortCondition;
    /**
     * Get the sort condition at a zero-based position, in the order the
     * conditions apply.
     *
     * @param index - The zero-based position of the sort condition.
     * @returns {*} the sort condition at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): SortCondition;
    /**
     * Remove a sort condition previously returned by this sorter.
     *
     * @param condition - The sort condition to remove.
     * @throws InvalidArgumentError when the condition was not created by this
     *   sorter, or no longer belongs to it (for example after its state was
     *   replaced or the workbook reloaded)
     */
    remove(condition: SortCondition): void;
    /**
     * Remove the sort condition at a zero-based position.
     *
     * @param index - The zero-based position of the sort condition to remove.
     * @throws InvalidArgumentError when the index is out of range
     */
    removeAt(index: number): void;
    /**
     * Remove every sort condition from this sorter. The sorter itself and its
     * settings are kept.
     */
    clear(): void;
}

/**
 * Internal modeled `CT_SortCondition` entry.
 *
 * Tri-state booleans: `undefined` = attribute absent (XSD default);
 * explicit `true`/`false` round-trip their lexical form.
 *
 * @private
 */
export interface SortConditionEntry {
    readonly range: CellRange;
    readonly descending: boolean | undefined;
    readonly sortBy: SortBy | undefined;
    readonly customList: string | undefined;
    readonly dxfId: number | undefined;
    readonly iconSet: IconSetType | undefined;
    readonly iconId: number | undefined;
    /** Extra attributes (unknown, plus invalid lexicals excluded from model). */
    readonly extraAttrsXml: string;
    /**
     * Whole-element backup for an unparsable-but-preserved condition: emits
     * verbatim, never exposed in the public list. Modeled entries have
     * `undefined` (they own their fields + `extraAttrsXml`).
     */
    readonly xml: string | undefined;
}

/**
 * Wire model for the worksheet-level `sortState` element.
 *
 * @private
 */
export interface SortStateModel {
    readonly present: boolean;
    /** Parsed `CT_SortState/@ref` (required attr). */
    readonly range: CellRange | undefined;
    readonly columnSort: boolean | undefined;
    readonly caseSensitive: boolean | undefined;
    readonly sortMethod: SortMethod | undefined;
    /** Modeled conditions (≤ 64 on load; application/file order). */
    readonly conditions: ReadonlyArray<SortConditionEntry>;
    /**
     * Opaque children in relative order: `extLst`, unknown children, the
     * modeled-overflow `sortCondition` count beyond `maxOccurs="64"`, and
     * unparsable conditions kept verbatim.
     */
    readonly extraChildrenXml: ReadonlyArray<string>;
    /** Extra attributes (unknown, plus invalid lexicals excluded from model). */
    readonly extraAttrsXml: string;
    /**
     * Whole-element backup when the root `ref` is unparsable-but-preserved:
     * emits verbatim; public `dataSorter` reads as `undefined`. Modeled states
     * have `undefined`.
     */
    readonly xml: string | undefined;
}

/** Absent sort state: nothing emitted, every public read is `undefined`. */
const EMPTY_MODEL: SortStateModel = {
    present: false,
    range: undefined,
    columnSort: undefined,
    caseSensitive: undefined,
    sortMethod: undefined,
    conditions: [],
    extraChildrenXml: [],
    extraAttrsXml: '',
    xml: undefined
};

/**
 * Host notifications for sort-state mutations.
 *
 * @private
 */
export interface SortStateHost {
    markDirty(): void;
}

/**
 * Mutable sort-state store owning the modeled conditions and flags.
 * Live handles stay valid across index shifts (the owner re-points them on
 * removal) and die on model replacement (`addDataSorter` on the same sheet,
 * reload, whole-state removal) via a generation token.
 *
 * @private
 */
export class SortStateImpl implements DataSorter {
    private model: SortStateModel;
    private host: SortStateHost | undefined;
    /**
     * Generation token bumped on every model replacement (`authorState`,
     * `replaceFromParse`, `clearState`, `set authorState`-equivalent paths).
     * Handles minted against an older generation refuse to mutate — a replaced
     * or reloaded state must never accept writes through stale handles.
     */
    private generation: number = 0;

    /**
     * Creates an instance.
     *
     * @param {SortStateModel} initial - The initial parameter.
     */
    public constructor(initial?: SortStateModel) {
        this.model = initial !== undefined ? cloneModel(initial) : EMPTY_MODEL;
    }

    /**
     * bindHost method.
     *
     * @param {SortStateHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: SortStateHost): void {
        this.host = host;
    }

    /**
     * Gets isPresent.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isPresent(): boolean {
        return this.model.present;
    }

    /**
     * Current generation for handle-minting (internal).
     *
     * @returns {number} - Returns the result.
     */
    public get currentGeneration(): number {
        return this.generation;
    }

    /**
     * Gets range.
     *
     * @returns {string} - Returns the result.
     */
    public get range(): string {
        this.assertPresent();
        const range: CellRange = this.model.range;
        if (range === undefined) {
            throw new InvalidSortStateError('Sort state has no parsed range');
        }
        return formatA1Range(range);
    }

    /**
     * Gets isColumnSort.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isColumnSort(): boolean {
        this.assertPresent();
        return this.model.columnSort === true;
    }

    /**
     * Sets isColumnSort.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isColumnSort(value: boolean) {
        this.assertPresent();
        if (this.isColumnSort === value) {
            return;
        }
        this.model = {
            ...this.model,
            columnSort: value ? true : undefined
        };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets isCaseSensitive.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isCaseSensitive(): boolean {
        this.assertPresent();
        return this.model.caseSensitive === true;
    }

    /**
     * Sets isCaseSensitive.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isCaseSensitive(value: boolean) {
        this.assertPresent();
        if (this.isCaseSensitive === value) {
            return;
        }
        this.model = {
            ...this.model,
            caseSensitive: value ? true : undefined
        };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets sortMethod.
     *
     * @returns {SortMethod} - Returns the result.
     */
    public get sortMethod(): SortMethod {
        this.assertPresent();
        return this.model.sortMethod != null ? this.model.sortMethod : 'none';
    }

    /**
     * Sets sortMethod.
     *
     * @param {SortMethod} value - The value parameter.
     */
    public set sortMethod(value: SortMethod) {
        this.assertPresent();
        assertSortMethod(value);
        if (this.sortMethod === value) {
            return;
        }
        this.model = {
            ...this.model,
            sortMethod: value === 'none' ? undefined : value
        };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets count.
     *
     * @returns {number} - Returns the result.
     */
    public get count(): number {
        this.assertPresent();
        return this.model.conditions.length;
    }

    /**
     * list method.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<SortCondition> {
        this.assertPresent();
        return this.model.conditions.map((e: SortConditionEntry): SortCondition => toPublicCondition(e));
    }

    /**
     * add method.
     *
     * @param {string} range - The range parameter.
     * @returns {SortCondition} - Returns the result.
     */
    public add(range: string): SortCondition {
        this.assertPresent();
        const conditionRange: CellRange = parseStateRange(range);
        const entry: SortConditionEntry = {
            range: conditionRange,
            descending: undefined,
            sortBy: undefined,
            customList: undefined,
            dxfId: undefined,
            iconSet: undefined,
            iconId: undefined,
            extraAttrsXml: '',
            xml: undefined
        };
        // Single authored condition: drop any previous modeled entries (including
        // multi-condition records loaded from foreign files) before inserting.
        this.generation += 1;
        this.handles.clear();
        this.model = { ...this.model, conditions: [entry] };
        if (this.host != null) {
            this.host.markDirty();
        }
        return this.mintHandle(0);
    }

    /**
     * get method.
     *
     * @param {number} index - The index parameter.
     * @returns {SortCondition} - Returns the result.
     */
    public get(index: number): SortCondition {
        this.assertPresent();
        assertConditionIndex(index, this.model.conditions.length);
        return this.mintHandle(index);
    }

    /**
     * remove method.
     *
     * @param {SortCondition} condition - The condition parameter.
     * @returns {void} - Returns the result.
     */
    public remove(condition: SortCondition): void {
        this.assertPresent();
        if (condition === undefined || condition === null) {
            throw new InvalidArgumentError('remove expects a sort condition handle');
        }
        const handle: SortConditionHandle = condition as SortConditionHandle;
        if (handle.state !== this || typeof handle.assertSameGeneration !== 'function') {
            throw new InvalidArgumentError('remove expects a condition created by this sort state');
        }
        // Dead generation (replaced state / reload) or detached handle.
        handle.assertSameGeneration();
        handle.remove();
    }

    /**
     * removeAt method.
     *
     * @param {number} index - The index parameter.
     * @returns {void} - Returns the result.
     */
    public removeAt(index: number): void {
        this.assertPresent();
        const conditions: ReadonlyArray<SortConditionEntry> = this.model.conditions;
        assertConditionIndex(index, conditions.length);
        const next: SortConditionEntry[] = conditions.slice();
        next.splice(index, 1);
        this.model = { ...this.model, conditions: next };
        this.retargetHandlesAfterRemoval(index);
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * clear method.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        this.assertPresent();
        if (this.model.conditions.length === 0) {
            return;
        }
        this.model = { ...this.model, conditions: [] };
        this.detachLiveHandles();
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Replace contents from parse (does not mark dirty). Kills live handles: the reloaded model is a different record set.
     *
     * @param {*} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: SortStateModel | undefined): void {
        this.model = model === undefined ? EMPTY_MODEL : cloneModel(model);
        this.generation += 1;
        this.handles.clear();
    }

    /**
     * Author a fresh state, replacing any existing record (the schema allows at most one `sortState` per worksheet). Kills live handles from the replaced record.
     *
     * @param {string} rangeText - The rangeText parameter.
     * @returns {void} - Returns the result.
     */
    public authorState(rangeText: string): void {
        const range: CellRange = parseStateRange(rangeText);
        this.model = {
            present: true,
            range,
            columnSort: undefined,
            caseSensitive: undefined,
            sortMethod: undefined,
            conditions: [],
            extraChildrenXml: [],
            extraAttrsXml: '',
            xml: undefined
        };
        this.generation += 1;
        this.handles.clear();
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Remove the state entirely; the element stops being emitted on save. Kills live handles.
     *
     * @returns {void} - Returns the result.
     */
    public clearState(): void {
        if (!this.model.present) {
            return;
        }
        this.model = EMPTY_MODEL;
        this.generation += 1;
        this.handles.clear();
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Snapshot for serialize.
     *
     * @returns {SortStateModel} - Returns the result.
     */
    public toModel(): SortStateModel {
        return cloneModel(this.model);
    }

    /**
     * Mutate one modeled condition by index (host handle writer).
     *
     * @param {number} index - The index parameter.
     * @param {any} mutate - The mutate parameter.
     * @param {boolean} isNoOp - The isNoOp parameter.
     * @returns {void} - Returns the result.
     */
    public writeConditionMutation(index: number, mutate: (entry: SortConditionEntry) => SortConditionEntry, isNoOp: boolean): void {
        this.assertPresent();
        const conditions: ReadonlyArray<SortConditionEntry> = this.model.conditions;
        assertConditionIndex(index, conditions.length);
        if (isNoOp) {
            return;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const target: SortConditionEntry = conditions[index];
        if (target === undefined) {
            return;
        }
        const next: SortConditionEntry[] = conditions.slice();
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        next[index] = mutate(target);
        this.model = { ...this.model, conditions: next };
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * assertPresent method.
     *
     * @returns {void} - Returns the result.
     */
    private assertPresent(): void {
        if (!this.model.present) {
            throw new InvalidSortStateError('Worksheet has no sort state; author one first');
        }
    }

    /** Live handles minted against the current generation, by index. */
    private readonly handles: Set<SortConditionHandle> = new Set<SortConditionHandle>();

    /**
     * mintHandle method.
     *
     * @param {number} index - The index parameter.
     * @returns {SortConditionHandle} - Returns the result.
     */
    private mintHandle(index: number): SortConditionHandle {
        const handle: SortConditionHandle = new SortConditionHandle(this, index, this.generation);
        this.handles.add(handle);
        return handle;
    }

    /**
     * Drop every live handle (called on model replacement).
     *
     * @returns {void} - Returns the result.
     */
    private detachLiveHandles(): void {
        this.generation += 1;
        this.handles.clear();
    }

    /**
     * After removal at `removedIndex`, shift still-live handles above it down one and detach the removed index's handles.
     *
     * @param {number} removedIndex - The removedIndex parameter.
     * @returns {void} - Returns the result.
     */
    private retargetHandlesAfterRemoval(removedIndex: number): void {
        for (const handle of this.handles) {
            handle.shiftForRemovalAt(removedIndex);
        }
    }

    /**
     * Remove a live handle from the registry (its own `remove` completed).
     *
     * @param {SortConditionHandle} handle - The handle parameter.
     * @returns {void} - Returns the result.
     */
    public unregisterHandle(handle: SortConditionHandle): void {
        this.handles.delete(handle);
    }

    /**
     * modelRange method.
     *
     * @returns {CellRange} - Returns the result.
     */
    private modelRange(): CellRange {
        const range: CellRange = this.model.range;
        if (range === undefined) {
            throw new InvalidSortStateError('Sort state has no parsed range');
        }
        return range;
    }
}

const SORT_BY_VALUES: ReadonlyArray<SortBy> = ['value', 'cellColor', 'fontColor', 'icon'];
const SORT_METHODS: ReadonlyArray<SortMethod> = ['stroke', 'pinYin', 'none'];

/**
 * Valid `ST_IconSetType` member set. Citation: transitional sml.xsd
 * `ST_IconSetType` enumeration.
 */
const ICON_SET_KINDS: ReadonlyArray<IconSetType> = [
    '3Arrows',
    '3ArrowsGray',
    '3Flags',
    '3TrafficLights1',
    '3TrafficLights2',
    '3Signs',
    '3Symbols',
    '3Symbols2',
    '4Arrows',
    '4ArrowsGray',
    '4RedToBlack',
    '4Rating',
    '4TrafficLights',
    '5Arrows',
    '5ArrowsGray',
    '5Rating',
    '5Quarters'
];

/**
 * isSortByValue function.
 *
 * @param {*} value - The value parameter.
 * @returns {boolean} - Returns the result.
 */
function isSortByValue(value: unknown): value is SortBy {
    return SORT_BY_VALUES.indexOf(value as SortBy) >= 0;
}

/**
 * assertSortMethod function.
 *
 * @param {SortMethod} value - The value parameter.
 * @returns {void} - Returns the result.
 */
function assertSortMethod(value: SortMethod): void {
    if (SORT_METHODS.indexOf(value) < 0) {
        throw new InvalidSortStateError(`Unknown sort method "${String(value)}" (expected stroke | pinYin | none)`);
    }
}

/**
 * parseStateRange function.
 *
 * @param {string} rangeText - The rangeText parameter.
 * @returns {CellRange} - Returns the result.
 */
function parseStateRange(rangeText: string): CellRange {
    const trimmed: string = rangeText === undefined || rangeText === null ? '' : String(rangeText).trim();
    if (trimmed.length === 0) {
        throw new InvalidArgumentError('Sort state range must be a non-empty string');
    }
    try {
        return parseA1Range(trimmed);
    } catch (err) {
        throw new InvalidSortStateError(`Sort state range "${trimmed}" is not a valid A1 range`, {
            cause: err
        });
    }
}

/**
 * assertConditionIndex function.
 *
 * @param {number} index - The index parameter.
 * @param {number} length - The length parameter.
 * @returns {void} - Returns the result.
 */
function assertConditionIndex(index: number, length: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= length) {
        throw new InvalidArgumentError(`Sort condition index must be an integer in [0, ${String(length)}) (received ${String(index)})`);
    }
}

/**
 * CT_Worksheet locals that appear **before** `sortState` after `sheetData`
 * (schema sequence order; `autoFilter` is the nearest predecessor).
 */
export const SORT_STATE_PREDECESSORS: ReadonlyArray<string> = [
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter'
];

/**
 * CT_Worksheet locals that appear **after** `sortState`.
 */
export const SORT_STATE_SUCCESSORS: ReadonlyArray<string> = [
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks',
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

const PREDECESSOR_SET: ReadonlySet<string> = new Set(SORT_STATE_PREDECESSORS);
const SUCCESSOR_SET: ReadonlySet<string> = new Set(SORT_STATE_SUCCESSORS);

/**
 * Index at which to insert the serialized `sortState` among after-sheetData siblings. Prefer: after the last known predecessor present; else before the first known successor; else append. Unknown elements keep relative order.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findSortStateInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && PREDECESSOR_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && SUCCESSOR_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse a worksheet-level `sortState` element. Unparsable root ref → whole-element opaque backup (`present: false`, `xml` set) so a no-op save preserves it. Invalid modeled-attribute lexicals stay in `extraAttrsXml` verbatim.
 *
 * @param {string} sortStateXml - The sortStateXml parameter.
 * @returns {SortStateModel} - Returns the result.
 */
export function parseSortStateXml(sortStateXml: string): SortStateModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(sortStateXml));
    const refRaw: string = attrs.get('ref');
    let range: CellRange | undefined;
    if (refRaw !== undefined && refRaw.trim().length > 0) {
        try {
            range = parseA1Range(refRaw);
        } catch {
            range = undefined;
        }
    }
    if (range === undefined) {
        // Required attribute missing/unparseable: preserve the whole element.
        return {
            present: false,
            range: undefined,
            columnSort: undefined,
            caseSensitive: undefined,
            sortMethod: undefined,
            conditions: [],
            extraChildrenXml: [],
            extraAttrsXml: '',
            xml: sortStateXml
        };
    }

    const columnSort: boolean = parseXsdBooleanOptional(attrs.get('columnSort'));
    const caseSensitive: boolean = parseXsdBooleanOptional(attrs.get('caseSensitive'));
    const sortMethodRaw: string = attrs.get('sortMethod');
    const sortMethod: SortMethod =
        sortMethodRaw !== undefined && SORT_METHODS.indexOf(sortMethodRaw as SortMethod) >= 0 ? (sortMethodRaw as SortMethod) : undefined;

    const exclude: Set<string> = new Set(['ref']);
    if (columnSort !== undefined || attrs.get('columnSort') === undefined) {
        exclude.add('columnSort');
    }
    if (caseSensitive !== undefined || attrs.get('caseSensitive') === undefined) {
        exclude.add('caseSensitive');
    }
    if (sortMethod !== undefined || sortMethodRaw === undefined) {
        exclude.add('sortMethod');
    }
    const extraAttrsXml: string = attrsToXmlExcluding(attrs, exclude);

    const conditions: SortConditionEntry[] = [];
    const extraChildrenXml: string[] = [];
    const children: string[] = splitTopLevelLocal(elementInnerLocal(sortStateXml));
    let modeledCount: number = 0;
    for (const child of children) {
        if (elementLocalNameLocal(child) !== 'sortCondition') {
            // extLst / unknown children: preserve opaquely in relative order.
            extraChildrenXml.push(child);
            continue;
        }
        if (modeledCount >= MAX_MODELED_SORT_CONDITIONS) {
            // Schema maxOccurs="64": extra conditions are preserved verbatim.
            extraChildrenXml.push(child);
            continue;
        }
        const entry: SortConditionEntry = parseSortConditionEntry(child);
        if (entry === undefined) {
            // Unparsable condition: preserve verbatim (not exposed publicly).
            extraChildrenXml.push(child);
            continue;
        }
        conditions.push(entry);
        modeledCount += 1;
    }

    return {
        present: true,
        range,
        columnSort,
        caseSensitive,
        sortMethod,
        conditions,
        extraChildrenXml,
        extraAttrsXml,
        xml: undefined
    };
}

/** Schema `maxOccurs` for `sortCondition` (sml.xsd ~L152). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const MAX_MODELED_SORT_CONDITIONS: 64 = 64;

/**
 * parseSortConditionEntry function.
 *
 * @param {string} child - The child parameter.
 * @returns {*} - Returns the result.
 */
function parseSortConditionEntry(child: string): SortConditionEntry | undefined {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(child));
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

    const descending: boolean = parseXsdBooleanOptional(attrs.get('descending'));
    const sortByRaw: string = attrs.get('sortBy');
    const sortBy: SortBy = sortByRaw !== undefined && isSortByValue(sortByRaw) ? sortByRaw : undefined;
    const customList: string = attrs.get('customList');
    const dxfId: number = parseUnsignedIntOptional(attrs.get('dxfId'));
    const iconSetRaw: string = attrs.get('iconSet');
    const iconSet: IconSetType =
        iconSetRaw !== undefined && ICON_SET_KINDS.indexOf(iconSetRaw as IconSetType) >= 0 ? (iconSetRaw as IconSetType) : undefined;
    const iconId: number = parseUnsignedIntOptional(attrs.get('iconId'));

    const exclude: Set<string> = new Set(['ref']);
    if (descending !== undefined || attrs.get('descending') === undefined) {
        exclude.add('descending');
    }
    if (sortBy !== undefined || sortByRaw === undefined) {
        exclude.add('sortBy');
    }
    if (customList !== undefined) {
        exclude.add('customList');
    }
    if (dxfId !== undefined || attrs.get('dxfId') === undefined) {
        exclude.add('dxfId');
    }
    if (iconSet !== undefined || iconSetRaw === undefined) {
        exclude.add('iconSet');
    }
    if (iconId !== undefined || attrs.get('iconId') === undefined) {
        exclude.add('iconId');
    }
    const extraAttrsXml: string = attrsToXmlExcluding(attrs, exclude);

    return {
        range,
        descending,
        sortBy,
        customList,
        dxfId,
        iconSet,
        iconId,
        extraAttrsXml,
        xml: undefined
    };
}

/**
 * Serialize a sort-state model, or `undefined` when absent and no backup. Attribute order follows the XSD declaration order; children are modeled conditions then opaque preserves in relative order.
 *
 * @param {SortStateModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
export function serializeSortStateXml(model: SortStateModel): string | undefined {
    if (!model.present) {
        if (model.xml !== undefined) {
            return model.xml;
        }
        return undefined;
    }
    if (model.range === undefined) {
        return model.xml != null ? model.xml : undefined;
    }
    const attrs: string[] = [];
    if (model.columnSort === true) {
        attrs.push('columnSort="1"');
    } else if (model.columnSort === false) {
        attrs.push('columnSort="0"');
    }
    if (model.caseSensitive === true) {
        attrs.push('caseSensitive="1"');
    } else if (model.caseSensitive === false) {
        attrs.push('caseSensitive="0"');
    }
    if (model.sortMethod !== undefined) {
        attrs.push(`sortMethod="${escapeXml(model.sortMethod)}"`);
    }
    attrs.push(`ref="${escapeXml(formatA1Range(model.range))}"`);
    if (model.extraAttrsXml.trim().length > 0) {
        attrs.push(model.extraAttrsXml.trim());
    }

    const modeled: string[] = model.conditions
        .slice(0, MAX_MODELED_SORT_CONDITIONS)
        .map((e: SortConditionEntry): string => serializeSortCondition(e));
    // Modeled overflow beyond the schema cap re-emits from the whole-element
    // backup (`parseSortStateXml` caps modeled entries at 64 and pushes the
    // rest into `extraChildrenXml` verbatim; `SortStateImpl.add` never
    // appends beyond the cap because it validates against a bounded list).
    const overflow: string[] = [];
    for (const e of model.conditions.slice(MAX_MODELED_SORT_CONDITIONS)) {
        if (e.xml !== undefined) {
            overflow.push(e.xml);
        } else {
            overflow.push(serializeSortCondition(e));
        }
    }

    const inner: string[] = [...modeled, ...model.extraChildrenXml, ...overflow];
    if (inner.length === 0) {
        // Childless state: self-close (matches Office emission style).
        return `<sortState ${attrs.join(' ')}/>`;
    }
    const parts: string[] = [`<sortState ${attrs.join(' ')}>`];
    parts.push(...inner);
    parts.push('</sortState>');
    return parts.join('');
}

/**
 * serializeSortCondition function.
 *
 * @param {SortConditionEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeSortCondition(e: SortConditionEntry): string {
    if (e.xml !== undefined) {
        return e.xml;
    }
    const attrs: string[] = [];
    if (e.descending === true) {
        attrs.push('descending="1"');
    } else if (e.descending === false) {
        attrs.push('descending="0"');
    }
    if (e.sortBy !== undefined) {
        attrs.push(`sortBy="${escapeXml(e.sortBy)}"`);
    }
    attrs.push(`ref="${escapeXml(formatA1Range(e.range))}"`);
    if (e.customList !== undefined) {
        attrs.push(`customList="${escapeXml(e.customList)}"`);
    }
    if (e.dxfId !== undefined) {
        attrs.push(`dxfId="${e.dxfId}"`);
    }
    if (e.iconSet !== undefined) {
        attrs.push(`iconSet="${escapeXml(e.iconSet)}"`);
    }
    if (e.iconId !== undefined) {
        attrs.push(`iconId="${e.iconId}"`);
    }
    if (e.extraAttrsXml.trim().length > 0) {
        attrs.push(e.extraAttrsXml.trim());
    }
    return `<sortCondition ${attrs.join(' ')}/>`;
}

/**
 * Snapshot entry for a live handle (public view).
 *
 * @param {SortConditionEntry} e - The e parameter.
 * @returns {SortCondition} - Returns the result.
 */
function toPublicCondition(e: SortConditionEntry): SortCondition {
    return {
        range: formatA1Range(e.range),
        isDescending: e.descending === true,
        sortBy: e.sortBy != null ? e.sortBy : 'value',
        customList: e.customList,
        dxfId: e.dxfId,
        iconSet: e.iconSet,
        iconId: e.iconId
    };
}

/**
 * cloneModel function.
 *
 * @param {SortStateModel} m - The m parameter.
 * @returns {SortStateModel} - Returns the result.
 */
function cloneModel(m: SortStateModel): SortStateModel {
    return {
        present: m.present,
        range: m.range === undefined ? undefined : { ...m.range },
        columnSort: m.columnSort,
        caseSensitive: m.caseSensitive,
        sortMethod: m.sortMethod,
        conditions: m.conditions.map(cloneEntry),
        extraChildrenXml: [...m.extraChildrenXml],
        extraAttrsXml: m.extraAttrsXml,
        xml: m.xml
    };
}

/**
 * cloneEntry function.
 *
 * @param {SortConditionEntry} e - The e parameter.
 * @returns {SortConditionEntry} - Returns the result.
 */
function cloneEntry(e: SortConditionEntry): SortConditionEntry {
    return {
        range: { ...e.range },
        descending: e.descending,
        sortBy: e.sortBy,
        customList: e.customList,
        dxfId: e.dxfId,
        iconSet: e.iconSet,
        iconId: e.iconId,
        extraAttrsXml: e.extraAttrsXml,
        xml: e.xml
    };
}

/**
 * Parsing-coercible xsd:boolean lexical forms used by Office (`"1"`/`"0"`/`"true"`/`"false"`). Invalid/absent → `undefined` (attribute treated as absent for the modeled field; the raw lexical stays in extras).
 *
 * @param {string} raw - The raw parameter.
 * @returns {boolean} - Returns the result.
 */
function parseXsdBooleanOptional(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return undefined;
}

/**
 * parseUnsignedIntOptional function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseUnsignedIntOptional(raw: string | undefined): number | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const t: string = raw.trim();
    if (t.length === 0 || !/^\d+$/.test(t)) {
        return undefined;
    }
    const n: number = Number(t);
    if (!Number.isInteger(n) || n < 0) {
        return undefined;
    }
    return n;
}

/* ── minimal local XML helpers (mirror merged-cells / freeze-panes) ── */

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
    const gt: number = trimmed.indexOf('>');
    if (gt < 0) {
        return '';
    }
    const open: string = trimmed.slice(0, gt);
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<[A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?([\s\S]*)$/.exec(open);
    return m !== null && m[1] !== undefined ? m[1].trim() : '';
}

/**
 * elementInnerLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInnerLocal(el: string): string {
    const trimmed: string = el.trim();
    const firstGt: number = trimmed.indexOf('>');
    if (firstGt < 0) {
        return '';
    }
    if (trimmed[firstGt - 1] === '/') {
        return '';
    }
    const close: number = trimmed.lastIndexOf('</');
    if (close < 0 || close <= firstGt) {
        return '';
    }
    return trimmed.slice(firstGt + 1, close);
}

/**
 * splitTopLevelLocal function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelLocal(s: string): string[] {
    const out: string[] = [];
    let i: number = 0;
    const str: string = s;
    while (i < str.length) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        while (i < str.length && /\s/.test(str[i] != null ? str[i] : '')) {
            i += 1;
        }
        if (i >= str.length) {
            break;
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        if (str[i] !== '<') {
            break;
        }
        const start: number = i;
        let depth: number = 0;
        let j: number = i;
        while (j < str.length) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            if (str[j] === '<') {
                if (str.startsWith('<!--', j)) {
                    const end: number = str.indexOf('-->', j + 4);
                    j = end < 0 ? str.length : end + 3;
                    continue;
                }
                if (str.startsWith('<![CDATA[', j)) {
                    const end: number = str.indexOf(']]>', j + 9);
                    j = end < 0 ? str.length : end + 3;
                    continue;
                }
                const next: string = str[j + 1];
                if (next === '/') {
                    depth -= 1;
                    const gt: number = str.indexOf('>', j);
                    j = gt < 0 ? str.length : gt + 1;
                    if (depth === 0) {
                        break;
                    }
                    continue;
                }
                const gt: number = str.indexOf('>', j);
                if (gt < 0) {
                    j = str.length;
                    break;
                }
                const openTag: string = str.slice(j, gt + 1);
                const selfClose: boolean = openTag.endsWith('/>');
                if (!selfClose) {
                    depth += 1;
                }
                j = gt + 1;
                if (selfClose && depth === 0) {
                    break;
                }
                continue;
            }
            j += 1;
        }
        out.push(str.slice(start, j));
        i = j;
    }
    return out;
}

/**
 * Live per-condition handle bound to its owning {@link SortStateImpl} by
 * index and generation. Route mutations through the owning state so model
 * snapshots stay the single source of truth. Handles survive index shifts
 * (the owning state re-points them) and die on model replacement / removal.
 *
 * @private
 */
class SortConditionHandle implements SortCondition {
    /** Owning state token for cross-state `remove` rejection. */
    public readonly state: SortStateImpl;
    private readonly owner: SortStateImpl;
    /** Generation this handle was minted against. */
    private readonly generation: number;
    private index: number;
    private detached: boolean = false;

    /**
     * Creates an instance.
     *
     * @param {SortStateImpl} owner - The owner parameter.
     * @param {number} index - The index parameter.
     * @param {number} generation - The generation parameter.
     */
    public constructor(owner: SortStateImpl, index: number, generation: number) {
        this.owner = owner;
        this.state = owner;
        this.index = index;
        this.generation = generation;
    }

    /**
     * Gets range.
     *
     * @returns {string} - Returns the result.
     */
    public get range(): string {
        this.assertNotDetached();
        return ((__t: string): string => (__t != null ? __t : ''))(
            ((__t: SortCondition): string => (__t == null ? undefined : __t.range))(this.owner.list()[this.index])
        );
    }

    /**
     * Gets isDescending.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDescending(): boolean {
        this.assertNotDetached();
        return ((__t: SortCondition): boolean => (__t == null ? undefined : __t.isDescending))(this.owner.list()[this.index]) === true;
    }

    /**
     * Sets isDescending.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isDescending(value: boolean) {
        this.assertNotDetached();
        const prev: boolean = this.isDescending;
        this.owner.writeConditionMutation(
            this.index,
            (e: SortConditionEntry): any => ({ ...e, descending: value ? true : undefined }),
            prev === value
        );
    }

    /**
     * Gets sortBy.
     *
     * @returns {SortBy} - Returns the result.
     */
    public get sortBy(): SortBy {
        this.assertNotDetached();
        return ((__t: SortBy): SortBy => (__t != null ? __t : 'value'))(
            ((__t: SortCondition): SortBy => (__t == null ? undefined : __t.sortBy))(this.owner.list()[this.index])
        );
    }

    /**
     * Sets sortBy.
     *
     * @param {SortBy} value - The value parameter.
     */
    public set sortBy(value: SortBy) {
        this.assertNotDetached();
        if (!isSortByValue(value)) {
            throw new InvalidSortStateError(`Unknown sort-by kind "${String(value)}" (expected value | cellColor | fontColor | icon)`);
        }
        const prev: SortBy = this.sortBy;
        this.owner.writeConditionMutation(
            this.index,
            (e: SortConditionEntry): any => ({
                ...e,
                sortBy: value === 'value' ? undefined : value
            }),
            prev === value
        );
    }

    /**
     * Gets customList.
     *
     * @returns {string} - Returns the result.
     */
    public get customList(): string | undefined {
        this.assertNotDetached();
        return ((__t: SortCondition): string => (__t == null ? undefined : __t.customList))(this.owner.list()[this.index]);
    }

    /**
     * Sets customList.
     *
     * @param {string} value - The value parameter.
     */
    public set customList(value: string | undefined) {
        this.assertNotDetached();
        if (value !== undefined && typeof value !== 'string') {
            throw new InvalidSortStateError('Sort condition customList must be a string');
        }
        const prev: string = this.customList;
        this.owner.writeConditionMutation(this.index, (e: SortConditionEntry): any => ({ ...e, customList: value }), prev === value);
    }

    /**
     * Preserved OOXML metadata (`CT_SortCondition/@dxfId`). Read-only load data; not part of the application-facing sorting API.
     *
     * @returns {number} - Returns the result.
     */
    public get dxfId(): number | undefined {
        this.assertNotDetached();
        return ((__t: SortCondition): number => (__t == null ? undefined : __t.dxfId))(this.owner.list()[this.index]);
    }

    /**
     * Preserved OOXML metadata (`CT_SortCondition/@iconSet`). Read-only load data; not part of the application-facing sorting API.
     *
     * @returns {*} - Returns the result.
     */
    public get iconSet(): IconSetType | undefined {
        this.assertNotDetached();
        return ((__t: SortCondition): IconSetType => (__t == null ? undefined : __t.iconSet))(this.owner.list()[this.index]);
    }

    /**
     * Preserved OOXML metadata (`CT_SortCondition/@iconId`). Read-only load data; not part of the application-facing sorting API.
     *
     * @returns {number} - Returns the result.
     */
    public get iconId(): number | undefined {
        this.assertNotDetached();
        return ((__t: SortCondition): number => (__t == null ? undefined : __t.iconId))(this.owner.list()[this.index]);
    }

    /**
     * Detach this handle from the owning state and remove its condition.
     *
     * @returns {void} - Returns the result.
     */
    public remove(): void {
        this.assertNotDetached();
        this.owner.unregisterHandle(this);
        this.owner.removeAt(this.index);
        this.detached = true;
    }

    /**
     * Generation/attachment check used by {@link SortStateImpl.remove} before delegating: rejects handles from a replaced or reloaded state.
     *
     * @returns {void} - Returns the result.
     */
    public assertSameGeneration(): void {
        this.assertNotDetached();
        if (this.generation !== this.owner.currentGeneration) {
            throw new InvalidArgumentError(
                'remove expects a condition created by the current sort state (the state was replaced or reloaded)'
            );
        }
    }

    /**
     * Owner callback after a removal at `removedIndex`: shift this handle's index down when it sat above the removal; detach when it WAS the removal target (detached handles are filtered from the registry lazily).
     *
     * @param {number} removedIndex - The removedIndex parameter.
     * @returns {void} - Returns the result.
     */
    public shiftForRemovalAt(removedIndex: number): void {
        if (this.detached) {
            return;
        }
        if (this.index === removedIndex) {
            this.detached = true;
            this.owner.unregisterHandle(this);
            return;
        }
        if (this.index > removedIndex) {
            this.index -= 1;
        }
    }

    /**
     * assertNotDetached method.
     *
     * @returns {void} - Returns the result.
     */
    private assertNotDetached(): void {
        if (this.detached || this.generation !== this.owner.currentGeneration || this.index >= this.owner.count) {
            throw new InvalidSortStateError(
                'Sort condition handle is no longer attached (the state was replaced/reloaded or the condition was removed)'
            );
        }
    }
}
