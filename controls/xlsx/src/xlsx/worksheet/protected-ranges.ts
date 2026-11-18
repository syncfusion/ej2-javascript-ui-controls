/**
 * Allow-edit ranges — named cell areas users may still edit while the sheet is protected.
 *
 * Access via {@link Worksheet.protectedRanges}. Add a range with a unique name and an
 * A1 address (or multi-area list). Optionally set a password so only people who know it
 * can edit that range in Excel. Empty collections are omitted when saving.
 *
 * This library stores the ranges in the file; it does not enforce locks at runtime.
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.71 (`protectedRange`) / §18.3.1.72 (`protectedRanges`)
 * - transitional sml.xsd `CT_ProtectedRanges` / `CT_ProtectedRange` (~L2911–2928)
 * - `CT_Worksheet` sequence: after `sheetProtection`, before `scenarios`
 * - MS-OI29500 §2.1.643 (name uniqueness, charset, length; sqref ≥ 1 area)
 * - docs/specs/protected-ranges.md; docs/ooxml-mapping/protected-ranges.md
 */

import { formatA1Range, parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidProtectionError } from '../core/errors';
import { escapeXml, unescapeXml } from '../core/xml/minimal-xml';
import { hashPasswordModern, verifyPasswordModern } from './sheet-protection';

/** MS-OI29500 §2.1.643 name length (Office). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const NAME_MAX_LENGTH: 255 = 255;

/**
 * Values used when adding an allow-edit range with {@link ProtectedRanges.add}.
 */
export interface ProtectedRangeInput {
    /** Unique name for this range on the sheet (required). */
    readonly name: string;
    /**
     * Cells the user may edit, in A1 form (required).
     * Multiple areas can be space-separated (for example `"A1:B2 D4:E5"`).
     */
    readonly sqref: string;
    /** Optional password required in Excel to edit this range. */
    readonly password?: string;
}

/**
 * One allow-edit range on a protected sheet.
 *
 * Changing {@link name}, {@link sqref}, or the password updates the sheet for the next save.
 */
export interface ProtectedRange {
    /** Unique name of this range on the sheet. */
    name: string;
    /** Cell areas this range covers, in normalized A1 form. */
    sqref: string;
    /** `true` when a password is set on this range. */
    readonly hasPassword: boolean;
    /**
     * Set or replace the range password. Pass `undefined` or `""` to clear it.
     *
     * @throws InvalidArgumentError when a non-string password is provided
     */
    setPassword(password: string | undefined): void;
    /**
     * Check whether a candidate password matches this range’s password.
     *
     * @returns {*} `true` when the password matches
     * @throws InvalidProtectionError when there is no password, only a legacy password, or the candidate is wrong
     */
    verifyPassword(password: string): boolean;
}

/**
 * Collection of allow-edit ranges on a worksheet ({@link Worksheet.protectedRanges}).
 */
export interface ProtectedRanges {
    /** How many ranges are defined. */
    readonly count: number;
    /** All ranges, in the order they appear in the file / were added. */
    list(): ReadonlyArray<ProtectedRange>;
    /** Range at a zero-based index. */
    get(index: number): ProtectedRange;
    /** Find a range by exact name (case-sensitive), or `undefined` if missing. */
    getByName(name: string): ProtectedRange | undefined;
    /**
     * Add a new allow-edit range.
     *
     * @throws InvalidArgumentError when required fields are missing or the wrong type
     * @throws InvalidProtectionError when the name is invalid or already used
     */
    add(input: ProtectedRangeInput): ProtectedRange;
    /** Remove the range at a zero-based index. */
    removeAt(index: number): void;
    /** Remove a range previously returned by this collection. */
    remove(range: ProtectedRange): void;
    /** Remove every allow-edit range. */
    clear(): void;
}

/**
 * Internal wire entry for one `protectedRange`.
 *
 * @private
 */
export interface ProtectedRangeEntry {
    name: string;
    ranges: CellRange[];
    algorithmName: string | undefined;
    hashValue: string | undefined;
    saltValue: string | undefined;
    spinCount: number | undefined;
    /** Legacy ST_UnsignedShortHex — preserve-only; never authored. */
    legacyPassword: string | undefined;
    /** Optional attribute `securityDescriptor` (preserve). */
    securityDescriptorAttr: string | undefined;
    /** Child `securityDescriptor` element text (preserve; Office ignores). */
    securityDescriptorElements: string[];
    /** Extra attributes excluding modeled ones (XML fragment, no leading space). */
    extraAttrsXml: string;
}

/**
 * Container-level attrs + entries for worksheet XML model.
 *
 * @private
 */
export interface ProtectedRangesModel {
    readonly extraAttrsXml: string;
    readonly entries: ReadonlyArray<ProtectedRangeEntry>;
}

/**
 * Host notifications for protected-range mutations.
 *
 * @private
 */
export interface ProtectedRangesHost {
    markDirty(): void;
}

/**
 * Mutable protected-ranges store.
 *
 * @private
 */
export class ProtectedRangesImpl implements ProtectedRanges {
    private readonly entries: ProtectedRangeEntry[] = [];
    private readonly handles: Map<ProtectedRangeEntry, ProtectedRangeHandle> = new Map<ProtectedRangeEntry, ProtectedRangeHandle>();
    private host: ProtectedRangesHost | undefined;
    private _extraAttrsXml: string = '';

    /**
     * Creates an instance.
     *
     * @param {ProtectedRangesModel} initial - The initial parameter.
     */
    public constructor(initial?: ProtectedRangesModel) {
        if (initial !== undefined) {
            this.applyModel(initial);
        }
    }

    /**
     * bindHost method.
     *
     * @param {ProtectedRangesHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: ProtectedRangesHost): void {
        this.host = host;
    }

    /**
     * Gets count.
     *
     * @returns {number} - Returns the result.
     */
    public get count(): number {
        return this.entries.length;
    }

    /**
     * list method.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<ProtectedRange> {
        return this.entries.map((e: ProtectedRangeEntry): ProtectedRange => this.handleFor(e));
    }

    /**
     * get method.
     *
     * @param {number} index - The index parameter.
     * @returns {ProtectedRange} - Returns the result.
     */
    public get(index: number): ProtectedRange {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(`Protected range index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: ProtectedRangeEntry = this.entries[index];
        if (entry === undefined) {
            throw new InvalidArgumentError(`Protected range index ${String(index)} is out of range`);
        }
        return this.handleFor(entry);
    }

    /**
     * getByName method.
     *
     * @param {string} name - The name parameter.
     * @returns {*} - Returns the result.
     */
    public getByName(name: string): ProtectedRange | undefined {
        if (typeof name !== 'string') {
            throw new InvalidArgumentError('Protected range name must be a string');
        }
        for (const e of this.entries) {
            if (e.name === name) {
                return this.handleFor(e);
            }
        }
        return undefined;
    }

    /**
     * add method.
     *
     * @param {ProtectedRangeInput} input - The input parameter.
     * @returns {ProtectedRange} - Returns the result.
     */
    public add(input: ProtectedRangeInput): ProtectedRange {
        if (input === null || typeof input !== 'object') {
            throw new InvalidArgumentError('Protected range input must be an object');
        }
        const entry: ProtectedRangeEntry = createEntryFromInput(input);
        assertNameUnique(entry.name, this.entries, undefined);
        this.entries.push(entry);
        if (this.host != null) {
            this.host.markDirty();
        }
        return this.handleFor(entry);
    }

    /**
     * removeAt method.
     *
     * @param {number} index - The index parameter.
     * @returns {void} - Returns the result.
     */
    public removeAt(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(`Protected range index ${String(index)} is out of range`);
        }
        const [removed] = this.entries.splice(index, 1);
        if (removed !== undefined) {
            this.handles.delete(removed);
        }
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * remove method.
     *
     * @param {ProtectedRange} range - The range parameter.
     * @returns {void} - Returns the result.
     */
    public remove(range: ProtectedRange): void {
        if (!(range instanceof ProtectedRangeHandle)) {
            throw new InvalidArgumentError('remove(range) requires a handle from this collection');
        }
        const idx: number = this.entries.indexOf(range.entry);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        this.handles.delete(range.entry);
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
        if (this.entries.length === 0) {
            return;
        }
        this.entries.length = 0;
        this.handles.clear();
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Replace contents from parse (does not mark dirty).
     *
     * @param {ProtectedRangesModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: ProtectedRangesModel): void {
        this.applyModel(model);
    }

    /**
     * Snapshot for serialize.
     *
     * @returns {ProtectedRangesModel} - Returns the result.
     */
    public toModel(): ProtectedRangesModel {
        return {
            extraAttrsXml: this._extraAttrsXml,
            entries: this.entries.map(cloneEntry)
        };
    }

    /**
     * applyModel method.
     *
     * @param {ProtectedRangesModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    private applyModel(model: ProtectedRangesModel): void {
        this.entries.length = 0;
        this.handles.clear();
        this._extraAttrsXml = model.extraAttrsXml;
        for (const e of model.entries) {
            this.entries.push(cloneEntry(e));
        }
    }

    /**
     * handleFor method.
     *
     * @param {ProtectedRangeEntry} entry - The entry parameter.
     * @returns {ProtectedRange} - Returns the result.
     */
    private handleFor(entry: ProtectedRangeEntry): ProtectedRange {
        let h: ProtectedRangeHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new ProtectedRangeHandle(entry, {
                markDirty: (): void => (this.host == null ? undefined : this.host.markDirty()),
                assertUnique: (name: string, self: ProtectedRangeEntry): void => assertNameUnique(name, this.entries, self)
            });
            this.handles.set(entry, h);
        }
        return h;
    }
}

/**
 * HandleHost.
 */
interface HandleHost {
    markDirty(): void;
    assertUnique(name: string, self: ProtectedRangeEntry): void;
}

/**
 * Live mutable handle bound to an entry.
 */
class ProtectedRangeHandle implements ProtectedRange {
    /** @private */
    public readonly entry: ProtectedRangeEntry;
    private readonly host: HandleHost;

    /**
     * Creates an instance.
     *
     * @param {ProtectedRangeEntry} entry - The entry parameter.
     * @param {HandleHost} host - The host parameter.
     */
    public constructor(entry: ProtectedRangeEntry, host: HandleHost) {
        this.entry = entry;
        this.host = host;
    }

    /**
     * Gets name.
     *
     * @returns {string} - Returns the result.
     */
    public get name(): string {
        return this.entry.name;
    }

    /**
     * Sets name.
     *
     * @param {string} value - The value parameter.
     */
    public set name(value: string) {
        const normalized: string = requireAuthoringName(value);
        this.host.assertUnique(normalized, this.entry);
        this.entry.name = normalized;
        this.host.markDirty();
    }

    /**
     * Gets sqref.
     *
     * @returns {string} - Returns the result.
     */
    public get sqref(): string {
        return formatProtectedSqref(this.entry.ranges);
    }

    /**
     * Sets sqref.
     *
     * @param {string} value - The value parameter.
     */
    public set sqref(value: string) {
        this.entry.ranges = parseProtectedSqref(value);
        this.host.markDirty();
    }

    /**
     * Gets hasPassword.
     *
     * @returns {boolean} - Returns the result.
     */
    public get hasPassword(): boolean {
        return entryHasPassword(this.entry);
    }

    /**
     * setPassword method.
     *
     * @param {string} password - The password parameter.
     * @returns {void} - Returns the result.
     */
    public setPassword(password: string | undefined): void {
        if (password === undefined || password.length === 0) {
            this.entry.algorithmName = undefined;
            this.entry.hashValue = undefined;
            this.entry.saltValue = undefined;
            this.entry.spinCount = undefined;
            this.entry.legacyPassword = undefined;
            this.host.markDirty();
            return;
        }
        if (typeof password !== 'string') {
            throw new InvalidArgumentError('Protected range password must be a string');
        }
        const hashed: any = hashPasswordModern(password);
        this.entry.algorithmName = hashed.algorithmName;
        this.entry.hashValue = hashed.hashValue;
        this.entry.saltValue = hashed.saltValue;
        this.entry.spinCount = hashed.spinCount;
        this.entry.legacyPassword = undefined;
        this.host.markDirty();
    }

    /**
     * verifyPassword method.
     *
     * @param {string} password - The password parameter.
     * @returns {boolean} - Returns the result.
     */
    public verifyPassword(password: string): boolean {
        if (typeof password !== 'string') {
            throw new InvalidArgumentError('Protected range password must be a string');
        }
        if (!entryHasPassword(this.entry)) {
            throw new InvalidProtectionError('This protected range has no password');
        }
        const hasModern: boolean =
            this.entry.hashValue !== undefined &&
            this.entry.hashValue.length > 0 &&
            this.entry.saltValue !== undefined &&
            this.entry.saltValue.length > 0;
        if (!hasModern) {
            throw new InvalidProtectionError('Legacy protected-range password cannot be verified cryptographically');
        }
        const spin: number = this.entry.spinCount !== undefined && Number.isFinite(this.entry.spinCount) ? this.entry.spinCount : 0;
        const ok: boolean = verifyPasswordModern(password, this.entry.saltValue as string, this.entry.hashValue as string, spin);
        if (!ok) {
            throw new InvalidProtectionError('Incorrect password');
        }
        return true;
    }
}

/* ── authoring helpers ────────────────────────────────────────────────── */

/**
 * createEntryFromInput function.
 *
 * @param {ProtectedRangeInput} input - The input parameter.
 * @returns {ProtectedRangeEntry} - Returns the result.
 */
function createEntryFromInput(input: ProtectedRangeInput): ProtectedRangeEntry {
    if (typeof input.name !== 'string') {
        throw new InvalidArgumentError('Protected range name must be a string');
    }
    if (typeof input.sqref !== 'string') {
        throw new InvalidArgumentError('Protected range sqref must be a string');
    }
    const name: string = requireAuthoringName(input.name);
    const ranges: CellRange[] = parseProtectedSqref(input.sqref);

    let algorithmName: string | undefined;
    let hashValue: string | undefined;
    let saltValue: string | undefined;
    let spinCount: number | undefined;

    if (input.password !== undefined && input.password.length > 0) {
        if (typeof input.password !== 'string') {
            throw new InvalidArgumentError('Protected range password must be a string');
        }
        const hashed: any = hashPasswordModern(input.password);
        algorithmName = hashed.algorithmName;
        hashValue = hashed.hashValue;
        saltValue = hashed.saltValue;
        spinCount = hashed.spinCount;
    }

    return {
        name,
        ranges,
        algorithmName,
        hashValue,
        saltValue,
        spinCount,
        legacyPassword: undefined,
        securityDescriptorAttr: undefined,
        securityDescriptorElements: [],
        extraAttrsXml: ''
    };
}

/**
 * Validate an allow-edit range name under Office authoring rules (MS-OI29500 §2.1.643).
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
export function validateProtectedRangeName(name: string): string {
    return requireAuthoringName(name);
}

/**
 * requireAuthoringName function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function requireAuthoringName(value: string): string {
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('Protected range name must be a string');
    }
    if (value.length === 0) {
        throw new InvalidProtectionError('Protected range name must be non-empty');
    }
    if (value.length > NAME_MAX_LENGTH) {
        throw new InvalidProtectionError(`Protected range name must be at most ${String(NAME_MAX_LENGTH)} characters`);
    }
    // MS-OI29500 §2.1.643: start with a letter; remaining letters, numbers,
    // spaces, underscores, periods, backslashes, or question marks.
    if (!isValidProtectedRangeName(value)) {
        throw new InvalidProtectionError(
            'Protected range name must start with a letter and contain only letters, numbers, spaces, underscores, periods, backslashes, or question marks'
        );
    }
    return value;
}

/**
 * Office name charset check (authoring).
 *
 * @param {string} name - The name parameter.
 * @returns {boolean} - Returns the result.
 */
export function isValidProtectedRangeName(name: string): boolean {
    if (name.length === 0 || name.length > NAME_MAX_LENGTH) {
        return false;
    }
    // Prefer Unicode letter class when available.
    try {
        if (!/^\p{L}/u.test(name)) {
            return false;
        }
        return /^[\p{L}\p{N} _.\\?]+$/u.test(name);
    } catch {
        // Environments without Unicode property escapes: ASCII-extended fallback.
        if (!/^[A-Za-z]/.test(name)) {
            return false;
        }
        return /^[A-Za-z0-9 _.\\?]+$/.test(name);
    }
}

/**
 * assertNameUnique function.
 *
 * @param {string} name - The name parameter.
 * @param {Object} entries - The entries parameter.
 * @param {*} self - The self parameter.
 * @returns {void} - Returns the result.
 */
function assertNameUnique(name: string, entries: ReadonlyArray<ProtectedRangeEntry>, self: ProtectedRangeEntry | undefined): void {
    for (const e of entries) {
        if (self !== undefined && e === self) {
            continue;
        }
        if (e.name === name) {
            throw new InvalidProtectionError(`Protected range name "${name}" is already used on this worksheet`);
        }
    }
}

/**
 * Parse multi-area A1 sqref for protected ranges.
 *
 * @param {string} sqref - The sqref parameter.
 * @returns {CellRange[]} - Returns the result.
 */
export function parseProtectedSqref(sqref: string): CellRange[] {
    if (typeof sqref !== 'string') {
        throw new InvalidArgumentError('Protected range sqref must be a string');
    }
    const trimmed: string = sqref.trim();
    if (trimmed.length === 0) {
        throw new InvalidProtectionError('Protected range sqref must be non-empty');
    }
    const tokens: string[] = trimmed.split(/\s+/).filter((t: string): boolean => t.length > 0);
    if (tokens.length === 0) {
        throw new InvalidProtectionError('Protected range sqref must contain at least one area');
    }
    const ranges: CellRange[] = [];
    for (const token of tokens) {
        try {
            ranges.push(parseA1Range(token));
        } catch (err) {
            throw new InvalidProtectionError(`Invalid protected range sqref area "${token}"`, { cause: err });
        }
    }
    return ranges;
}

/**
 * Format ranges as space-separated compact A1 sqref.
 *
 * @param {Object} ranges - The ranges parameter.
 * @returns {string} - Returns the result.
 */
export function formatProtectedSqref(ranges: ReadonlyArray<CellRange>): string {
    return ranges.map((r: CellRange): string => formatA1Range(r)).join(' ');
}

/**
 * entryHasPassword function.
 *
 * @param {ProtectedRangeEntry} e - The e parameter.
 * @returns {boolean} - Returns the result.
 */
function entryHasPassword(e: ProtectedRangeEntry): boolean {
    if (e.hashValue !== undefined && e.hashValue.length > 0 && e.saltValue !== undefined && e.saltValue.length > 0) {
        return true;
    }
    return e.legacyPassword !== undefined && e.legacyPassword.length > 0;
}

/**
 * cloneEntry function.
 *
 * @param {ProtectedRangeEntry} e - The e parameter.
 * @returns {ProtectedRangeEntry} - Returns the result.
 */
function cloneEntry(e: ProtectedRangeEntry): ProtectedRangeEntry {
    return {
        name: e.name,
        ranges: e.ranges.map((r: CellRange): { startRow: number; startCol: number; endRow: number; endCol: number } => ({
            startRow: r.startRow,
            startCol: r.startCol,
            endRow: r.endRow,
            endCol: r.endCol
        })),
        algorithmName: e.algorithmName,
        hashValue: e.hashValue,
        saltValue: e.saltValue,
        spinCount: e.spinCount,
        legacyPassword: e.legacyPassword,
        securityDescriptorAttr: e.securityDescriptorAttr,
        securityDescriptorElements: [...e.securityDescriptorElements],
        extraAttrsXml: e.extraAttrsXml
    };
}

/* ── CT_Worksheet insert order ────────────────────────────────────────── */

/**
 * CT_Worksheet local names that appear **before** `protectedRanges` after sheetData.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const PROTECTED_RANGES_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = ['sheetCalcPr', 'sheetProtection'];

/**
 * CT_Worksheet local names that appear **after** `protectedRanges`.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const PROTECTED_RANGES_SUCCESSORS: ReadonlyArray<string> = [
    'scenarios',
    'autoFilter',
    'sortState',
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

const PR_PRED: Set<string> = new Set(PROTECTED_RANGES_PREDECESSORS_AFTER_SHEET_DATA);
const PR_SUCC: Set<string> = new Set(PROTECTED_RANGES_SUCCESSORS);

/**
 * Index at which to insert serialized `protectedRanges` among after-sheetData siblings.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findProtectedRangesInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && PR_PRED.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && PR_SUCC.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/* ── parse / serialize ────────────────────────────────────────────────── */

/**
 * Empty model (no protected ranges).
 *
 * @private
 */
export const EMPTY_PROTECTED_RANGES: ProtectedRangesModel = {
    extraAttrsXml: '',
    entries: []
};

/**
 * Parse `protectedRanges` element XML into a model. Soft-skips individual bad children (missing name/sqref).
 *
 * @param {string} xml - The xml parameter.
 * @returns {ProtectedRangesModel} - Returns the result.
 */
export function parseProtectedRangesXml(xml: string): ProtectedRangesModel {
    const openAttrs: string = elementOpenAttrsLocal(xml);
    const attrs: Map<string, string> = parseAttrMapLocal(openAttrs);
    const extraAttrsXml: string = attrsToXmlExcludingLocal(attrs, new Set());

    const inner: string = elementInnerLocal(xml);
    const children: string[] = splitTopLevelLocal(inner);
    const entries: ProtectedRangeEntry[] = [];
    for (const child of children) {
        if (elementLocalNameLocal(child) !== 'protectedRange') {
            continue;
        }
        const parsed: ProtectedRangeEntry = parseOneRange(child);
        if (parsed !== undefined) {
            entries.push(parsed);
        }
    }
    return { extraAttrsXml, entries };
}

/**
 * parseOneRange function.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseOneRange(el: string): ProtectedRangeEntry | undefined {
    const openAttrs: string = elementOpenAttrsLocal(el);
    const attrs: Map<string, string> = parseAttrMapLocal(openAttrs);

    const nameRaw: string = attrs.get('name');
    if (nameRaw === undefined || nameRaw.length === 0) {
        return undefined;
    }
    const sqrefRaw: string = attrs.get('sqref');
    if (sqrefRaw === undefined || sqrefRaw.trim().length === 0) {
        return undefined;
    }

    let ranges: CellRange[];
    try {
        ranges = parseProtectedSqref(sqrefRaw);
    } catch {
        return undefined;
    }

    const algorithmName: string = attrs.get('algorithmName');
    const hashValue: string = attrs.get('hashValue');
    const saltValue: string = attrs.get('saltValue');
    const spinRaw: string = attrs.get('spinCount');
    let spinCount: number | undefined;
    if (spinRaw !== undefined && spinRaw.trim().length > 0) {
        const n: number = Number.parseInt(spinRaw, 10);
        if (Number.isFinite(n) && n >= 0) {
            spinCount = n;
        }
    }
    const legacyPassword: string = attrs.get('password');
    const securityDescriptorAttr: string = attrs.get('securityDescriptor');

    const extraAttrsXml: string = attrsToXmlExcludingLocal(
        attrs,
        new Set(['name', 'sqref', 'password', 'algorithmName', 'hashValue', 'saltValue', 'spinCount', 'securityDescriptor'])
    );

    const securityDescriptorElements: string[] = [];
    const inner: string = elementInnerLocal(el);
    for (const child of splitTopLevelLocal(inner)) {
        if (elementLocalNameLocal(child) === 'securityDescriptor') {
            securityDescriptorElements.push(unescapeXml(elementInnerLocal(child)));
        }
    }

    return {
        name: nameRaw,
        ranges,
        algorithmName: algorithmName !== undefined && algorithmName.length > 0 ? algorithmName : undefined,
        hashValue: hashValue !== undefined && hashValue.length > 0 ? hashValue : undefined,
        saltValue: saltValue !== undefined && saltValue.length > 0 ? saltValue : undefined,
        spinCount,
        legacyPassword: legacyPassword !== undefined && legacyPassword.length > 0 ? legacyPassword : undefined,
        securityDescriptorAttr:
            securityDescriptorAttr !== undefined && securityDescriptorAttr.length > 0 ? securityDescriptorAttr : undefined,
        securityDescriptorElements,
        extraAttrsXml
    };
}

/**
 * Serialize model to a `protectedRanges` element, or `undefined` when empty.
 *
 * @param {ProtectedRangesModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
export function serializeProtectedRangesXml(model: ProtectedRangesModel): string | undefined {
    if (model.entries.length === 0) {
        return undefined;
    }
    const attrParts: string[] = [];
    if (model.extraAttrsXml.trim().length > 0) {
        attrParts.push(model.extraAttrsXml.trim());
    }
    const open: string = attrParts.length > 0 ? `<protectedRanges ${attrParts.join(' ')}>` : '<protectedRanges>';
    const parts: string[] = [open];
    for (const e of model.entries) {
        parts.push(serializeOneRange(e));
    }
    parts.push('</protectedRanges>');
    return parts.join('');
}

/**
 * serializeOneRange function.
 *
 * @param {ProtectedRangeEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeOneRange(e: ProtectedRangeEntry): string {
    const attrs: string[] = [];
    attrs.push(`name="${escapeXml(e.name)}"`);
    attrs.push(`sqref="${escapeXml(formatProtectedSqref(e.ranges))}"`);
    if (e.legacyPassword !== undefined && e.legacyPassword.length > 0) {
        attrs.push(`password="${escapeXml(e.legacyPassword)}"`);
    }
    if (e.algorithmName !== undefined && e.algorithmName.length > 0) {
        attrs.push(`algorithmName="${escapeXml(e.algorithmName)}"`);
    }
    if (e.hashValue !== undefined && e.hashValue.length > 0) {
        attrs.push(`hashValue="${escapeXml(e.hashValue)}"`);
    }
    if (e.saltValue !== undefined && e.saltValue.length > 0) {
        attrs.push(`saltValue="${escapeXml(e.saltValue)}"`);
    }
    if (e.spinCount !== undefined) {
        attrs.push(`spinCount="${String(e.spinCount)}"`);
    }
    if (e.securityDescriptorAttr !== undefined && e.securityDescriptorAttr.length > 0) {
        attrs.push(`securityDescriptor="${escapeXml(e.securityDescriptorAttr)}"`);
    }
    if (e.extraAttrsXml.trim().length > 0) {
        attrs.push(e.extraAttrsXml.trim());
    }

    const children: string[] = [];
    for (const sd of e.securityDescriptorElements) {
        children.push(`<securityDescriptor>${escapeXml(sd)}</securityDescriptor>`);
    }

    const open: string = `<protectedRange ${attrs.join(' ')}`;
    if (children.length === 0) {
        return `${open}/>`;
    }
    return `${open}>${children.join('')}</protectedRange>`;
}

/* ── minimal local XML helpers (mirror data-validations, avoid cycles) ── */

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
 * escapeRegExpLocal function.
 *
 * @param {string} s - The s parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExpLocal(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
 * parseAttrMapLocal function.
 *
 * @param {string} attrText - The attrText parameter.
 * @returns {string} - Returns the result.
 */
function parseAttrMapLocal(attrText: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    const re: RegExp = /([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    for (;;) {
        const m: RegExpExecArray = re.exec(attrText);
        if (m === null) {
            break;
        }
        const name: string = m[1];
        if (name === undefined) {
            continue;
        }
        const raw: string = ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[3]);
        const value: string = unescapeXml(raw);
        map.set(name, value);
        const local: string = name.includes(':') ? name.slice(name.indexOf(':') + 1) : name;
        if (!map.has(local)) {
            map.set(local, value);
        }
    }
    return map;
}

/**
 * attrsToXmlExcludingLocal function.
 *
 * @param {string} attrs - The attrs parameter.
 * @param {string} exclude - The exclude parameter.
 * @returns {string} - Returns the result.
 */
function attrsToXmlExcludingLocal(attrs: Map<string, string>, exclude: Set<string>): string {
    const parts: string[] = [];
    const seen: Set<string> = new Set<string>();
    for (const [k, v] of attrs) {
        if (exclude.has(k)) {
            continue;
        }
        const local: string = k.includes(':') ? k.slice(k.indexOf(':') + 1) : k;
        if (exclude.has(local)) {
            continue;
        }
        // Prefer unprefixed key once; skip duplicate prefixed/local pairs.
        if (seen.has(local) || seen.has(k)) {
            continue;
        }
        // Skip the alternate form if we already emitted this local name.
        if (k.includes(':') && attrs.has(local) && seen.has(local)) {
            continue;
        }
        seen.add(k);
        seen.add(local);
        parts.push(`${k}="${escapeXml(v)}"`);
    }
    return parts.join(' ');
}
