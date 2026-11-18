/**
 * Worksheet data validations (`CT_DataValidations` / `CT_DataValidation`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.33 `dataValidations`
 * - transitional sml.xsd `CT_DataValidations` / `CT_DataValidation` /
 *   `ST_DataValidationType` / `ST_DataValidationOperator` /
 *   `ST_DataValidationErrorStyle` / `ST_DataValidationImeMode` / `ST_Sqref`
 * - docs/specs/data-validations.md; docs/ooxml-mapping/data-validations.md
 *
 * Formulas are opaque text (never evaluated). `showListDropdown` is inverted
 * only at the wire (`showDropDown=true` hides the list UI). Overlapping target
 * addresses are allowed. Empty collection omits the parent element.
 *
 * Authoring default: {@link DataValidations.add} takes the target range and
 * returns a live handle; configure type, formulas, messages, and flags on the
 * handle. New rules start with `showErrorMessage = true`, matching Excel/XlsIO
 * ("Show error alert after invalid data is entered"). The XSD wire-level
 * default for `showErrorMessage` is `false` (attribute omitted), but this
 * library's authoring API opts new rules in explicitly instead of silently
 * mirroring the omitted-attribute default.
 */

import { formatA1Range, parseA1, parseA1Range, CellCoord, CellRange } from '../address/cell-address';
import { normalizeFormulaExpression } from '../cell/formula';
import { InvalidArgumentError, InvalidDataValidationError } from '../core/errors';
import { escapeXml, unescapeXml } from '../core/xml/minimal-xml';

/**
 * Specifies what kind of input a validation rule accepts, such as whole
 * numbers, dates, or a list of values.
 */
export type DataValidationType = 'none' | 'whole' | 'decimal' | 'list' | 'date' | 'time' | 'textLength' | 'custom';

/**
 * Specifies the comparison a validation rule applies to entered values,
 * such as between or greater than.
 */
export type DataValidationOperator =
    'between' | 'notBetween' | 'equal' | 'notEqual' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual';

/**
 * Specifies what happens when a user enters invalid data: block it, warn,
 * or just inform.
 */
export type DataValidationErrorStyle = 'stop' | 'warning' | 'information';

/**
 * Controls the behavior of a device's input method editor (IME) when the
 * validated cell is selected.
 *
 * Wire/preserve detail for `ST_DataValidationImeMode` — not part of the
 * shipped package surface (`stripInternal`).
 *
 * @private
 */
export type DataValidationImeMode =
    | 'noControl'
    | 'off'
    | 'on'
    | 'disabled'
    | 'hiragana'
    | 'fullKatakana'
    | 'halfKatakana'
    | 'fullAlpha'
    | 'halfAlpha'
    | 'fullHangul'
    | 'halfHangul';

const DV_TYPES: ReadonlySet<string> = new Set(['none', 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom']);

const DV_OPERATORS: ReadonlySet<string> = new Set([
    'between',
    'notBetween',
    'equal',
    'notEqual',
    'lessThan',
    'lessThanOrEqual',
    'greaterThan',
    'greaterThanOrEqual'
]);

const DV_ERROR_STYLES: ReadonlySet<string> = new Set(['stop', 'warning', 'information']);

const DV_IME_MODES: ReadonlySet<string> = new Set([
    'noControl',
    'off',
    'on',
    'disabled',
    'hiragana',
    'fullKatakana',
    'halfKatakana',
    'fullAlpha',
    'halfAlpha',
    'fullHangul',
    'halfHangul'
]);

/** XSD defaults for CT_DataValidation attributes. */
const DEFAULT_TYPE: DataValidationType = 'none';
const DEFAULT_OPERATOR: DataValidationOperator = 'between';
const DEFAULT_ERROR_STYLE: DataValidationErrorStyle = 'stop';
const DEFAULT_IME_MODE: DataValidationImeMode = 'noControl';

/**
 * Represents a data validation rule applied to cells, letting you control
 * what values users can enter and the prompts or error alerts they see.
 */
export interface DataValidation {
    /**
     * The cell or range the rule applies to, written as an A1-style address.
     * Multiple areas are separated by spaces (e.g. `'A1:A5 C1:C5'`). Assign a
     * new address to apply the rule to different cells.
     */
    address: string;
    /**
     * The kind of value the rule accepts — for example `'whole'` allows only
     * whole numbers, `'decimal'` only decimal numbers, and `'list'` only the
     * values in `listValues` or `firstFormula`. Default `'none'`.
     */
    type: DataValidationType;
    /**
     * How entered data is compared against `firstFormula` (and `secondFormula` when
     * `'between'` or `'notBetween'`). Default `'between'`.
     */
    operator: DataValidationOperator;
    /**
     * How Excel responds to invalid data: `'stop'` rejects the entry, while
     * `'warning'` and `'information'` let the user keep or discard it.
     * Default `'stop'`.
     */
    errorStyle: DataValidationErrorStyle;
    /**
     * The Input Method Editor (IME) behavior for the cells, used when entering
     * East-Asian text. Default `'noControl'`.
     * Wire detail — not part of the shipped package surface (`stripInternal`).
     *
     * @private
     */
    imeMode: DataValidationImeMode;
    /**
     * Whether blank cells are treated as valid input, bypassing the rule's
     * check. Default `false`.
     */
    allowBlank: boolean;
    /**
     * Whether the cell shows a dropdown arrow that lets users pick from the
     * list. Applies when `type` is `'list'`. Default `true`.
     */
    showListDropdown: boolean;
    /**
     * Whether Excel shows `prompt` (titled `promptTitle`, when set) when one
     * of the rule's cells is selected. Default `false`.
     */
    showInputMessage: boolean;
    /**
     * Whether Excel shows the error alert when invalid data is entered.
     * Default `true` on new rules.
     */
    showErrorMessage: boolean;
    /** The title of the error alert. */
    errorTitle: string | undefined;
    /** The message shown in the error alert when invalid data is entered. */
    error: string | undefined;
    /** The title of the input message. */
    promptTitle: string | undefined;
    /** The message shown next to a cell when it is selected. */
    prompt: string | undefined;
    /**
     * The value, cell reference, or formula that entered data is compared
     * against. For `'list'` rules this is the list source; for `'between'`
     * and `'notBetween'` it is the lower bound, paired with `secondFormula`.
     */
    firstFormula: string | undefined;
    /**
     * The upper bound paired with `firstFormula`, used only when `operator` is
     * `'between'` or `'notBetween'`.
     */
    secondFormula: string | undefined;
    /**
     * The values a user can pick from when `type` is `'list'`. Setting this
     * encodes the values into `firstFormula`; reading it decodes `firstFormula` back
     * into values when it is an inline quoted list.
     */
    listValues: ReadonlyArray<string> | undefined;
}

/**
 * Represents the collection of data validation rules on a worksheet, letting
 * you add, list, and remove rules.
 *
 * Overlapping target addresses are allowed; {@link add} always appends a
 * default rule for the given range. Configure type, formulas, messages, and
 * flags on the returned handle.
 */
export interface DataValidations {
    /** The number of data-validation rules on the worksheet. */
    readonly count: number;
    /**
     * Whether Excel suppresses input messages for the whole worksheet,
     * overriding each rule's own `showInputMessage`. Default `false`.
     */
    disablePrompts: boolean;
    /**
     * The horizontal position (in pixels) of the input-message prompt window,
     * relative to the workbook window. `undefined` leaves the placement to
     * Excel.
     *
     * @private
     */
    xWindow: number | undefined;
    /**
     * The vertical position (in pixels) of the input-message prompt window,
     * relative to the workbook window. `undefined` leaves the placement to
     * Excel.
     *
     * @private
     */
    yWindow: number | undefined;
    /**
     * Get all data-validation rules as a list, in the order they appear on
     * the worksheet.
     *
     * @returns {*} the current data-validation rules.
     */
    list(): ReadonlyArray<DataValidation>;
    /**
     * Get the data-validation rule at a zero-based position, in the order the
     * rules appear on the worksheet.
     *
     * @param index - The zero-based position of the rule.
     * @returns {*} the rule at `index`.
     * @throws InvalidArgumentError when the index is out of range
     */
    get(index: number): DataValidation;
    /**
     * Add a data-validation rule to the worksheet.
     *
     * @param input - The settings for the new rule, including the cells it
     *   applies to.
     * @returns {Object} the newly created rule.
     * @throws InvalidArgumentError when required fields are empty/wrong type
     * @throws InvalidDataValidationError when address/enums/list source invalid
     */
    add(address: string): DataValidation;
    /**
     * Remove the data-validation rule at a zero-based position.
     *
     * @param index - The zero-based position of the rule to remove.
     * @throws InvalidArgumentError when the index is out of range
     */
    removeAt(index: number): void;
    /**
     * Remove a data-validation rule previously returned by this collection.
     *
     * @param rule - The rule to remove.
     * @throws InvalidArgumentError when the rule was not created by this
     *   collection
     */
    remove(rule: DataValidation): void;
    /** Remove every data-validation rule from the worksheet. */
    clear(): void;
    /**
     * Check whether any rule applies to the given cell.
     *
     * @param address - The address of a single cell, like `'C3'`.
     * @returns {*} `true` when at least one rule's range contains the cell.
     * @private
     * @throws InvalidAddressError when address is not a single cell
     */
    has(address: string): boolean;
    /**
     * Get every rule that applies to the given cell, in worksheet order.
     *
     * @param address - The address of a single cell, like `'C3'`.
     * @returns {*} the rules whose range contains the cell.
     * @throws InvalidAddressError when address is not a single cell
     */
    findByCell(address: string): ReadonlyArray<DataValidation>;
}

/**
 * Internal wire entry for one `dataValidation`.
 *
 * @private
 */
export interface DataValidationEntry {
    ranges: CellRange[];
    type: DataValidationType;
    operator: DataValidationOperator;
    errorStyle: DataValidationErrorStyle;
    imeMode: DataValidationImeMode;
    allowBlank: boolean;
    /** Public intent (true = show dropdown). Wire showDropDown = !showListDropdown. */
    showListDropdown: boolean;
    showInputMessage: boolean;
    showErrorMessage: boolean;
    errorTitle: string | undefined;
    error: string | undefined;
    promptTitle: string | undefined;
    prompt: string | undefined;
    firstFormula: string | undefined;
    secondFormula: string | undefined;
    listValues: string[] | undefined;
    /** Extra attributes excluding modeled ones (XML fragment, no leading space). */
    extraAttrsXml: string;
}

/**
 * Container-level attrs + rules for worksheet XML model.
 *
 * @private
 */
export interface DataValidationsModel {
    readonly disablePrompts: boolean;
    readonly xWindow: number | undefined;
    readonly yWindow: number | undefined;
    readonly extraAttrsXml: string;
    readonly entries: ReadonlyArray<DataValidationEntry>;
}

/**
 * Host notifications for DV mutations.
 *
 * @private
 */
export interface DataValidationsHost {
    markDirty(): void;
}

/**
 * Mutable data-validations store.
 *
 * @private
 */
export class DataValidationsImpl implements DataValidations {
    private readonly entries: DataValidationEntry[] = [];
    private readonly handles: Map<DataValidationEntry, DataValidationHandle> = new Map<DataValidationEntry, DataValidationHandle>();
    private host: DataValidationsHost | undefined;
    private _disablePrompts: boolean = false;
    private _xWindow: number | undefined;
    private _yWindow: number | undefined;
    private _extraAttrsXml: string = '';

    /**
     * Creates an instance.
     *
     * @param {DataValidationsModel} initial - The initial parameter.
     */
    public constructor(initial?: DataValidationsModel) {
        if (initial !== undefined) {
            this.applyModel(initial);
        }
    }

    /**
     * bindHost method.
     *
     * @param {DataValidationsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: DataValidationsHost): void {
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
     * Gets disablePrompts.
     *
     * @returns {boolean} - Returns the result.
     */
    public get disablePrompts(): boolean {
        return this._disablePrompts;
    }

    /**
     * Sets disablePrompts.
     *
     * @param {boolean} value - The value parameter.
     */
    public set disablePrompts(value: boolean) {
        if (this._disablePrompts === value) {
            return;
        }
        this._disablePrompts = value;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets xWindow.
     *
     * @returns {number} - Returns the result.
     */
    public get xWindow(): number | undefined {
        return this._xWindow;
    }

    /**
     * Sets xWindow.
     *
     * @param {number} value - The value parameter.
     */
    public set xWindow(value: number | undefined) {
        if (this._xWindow === value) {
            return;
        }
        if (value !== undefined) {
            assertUnsignedInt(value, 'xWindow');
        }
        this._xWindow = value;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Gets yWindow.
     *
     * @returns {number} - Returns the result.
     */
    public get yWindow(): number | undefined {
        return this._yWindow;
    }

    /**
     * Sets yWindow.
     *
     * @param {number} value - The value parameter.
     */
    public set yWindow(value: number | undefined) {
        if (this._yWindow === value) {
            return;
        }
        if (value !== undefined) {
            assertUnsignedInt(value, 'yWindow');
        }
        this._yWindow = value;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * list method.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<DataValidation> {
        return this.entries.map((e: DataValidationEntry): DataValidation => this.handleFor(e));
    }

    /**
     * get method.
     *
     * @param {number} index - The index parameter.
     * @returns {DataValidation} - Returns the result.
     */
    public get(index: number): DataValidation {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(`Data validation index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: DataValidationEntry = this.entries[index];
        if (entry === undefined) {
            throw new InvalidArgumentError(`Data validation index ${String(index)} is out of range`);
        }
        return this.handleFor(entry);
    }

    /**
     * add method.
     *
     * @param {string} address - The address parameter.
     * @returns {DataValidation} - Returns the result.
     */
    public add(address: string): DataValidation {
        if (typeof address !== 'string' || address.trim().length === 0) {
            throw new InvalidArgumentError('Data validation address must be a non-empty string');
        }
        const entry: DataValidationEntry = createDefaultEntry(address);
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
            throw new InvalidArgumentError(`Data validation index ${String(index)} is out of range`);
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
     * @param {DataValidation} rule - The rule parameter.
     * @returns {void} - Returns the result.
     */
    public remove(rule: DataValidation): void {
        if (!(rule instanceof DataValidationHandle)) {
            throw new InvalidArgumentError('remove(rule) requires a handle from this collection');
        }
        const idx: number = this.entries.indexOf(rule.entry);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        this.handles.delete(rule.entry);
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
     * has method.
     *
     * @param {string} address - The address parameter.
     * @returns {boolean} - Returns the result.
     */
    public has(address: string): boolean {
        const coord: CellCoord = parseA1(address);
        return this.entries.some((e: DataValidationEntry): boolean => cellInSqref(coord, e.ranges));
    }

    /**
     * findByCell method.
     *
     * @param {string} address - The address parameter.
     * @returns {Object} - Returns the result.
     */
    public findByCell(address: string): ReadonlyArray<DataValidation> {
        const coord: CellCoord = parseA1(address);
        const out: DataValidation[] = [];
        for (const e of this.entries) {
            if (cellInSqref(coord, e.ranges)) {
                out.push(this.handleFor(e));
            }
        }
        return out;
    }

    /**
     * Replace contents from parse (does not mark dirty).
     *
     * @param {DataValidationsModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(model: DataValidationsModel): void {
        this.applyModel(model);
    }

    /**
     * Snapshot for serialize.
     *
     * @returns {DataValidationsModel} - Returns the result.
     */
    public toModel(): DataValidationsModel {
        return {
            disablePrompts: this._disablePrompts,
            xWindow: this._xWindow,
            yWindow: this._yWindow,
            extraAttrsXml: this._extraAttrsXml,
            entries: this.entries.map(cloneEntry)
        };
    }

    /**
     * applyModel method.
     *
     * @param {DataValidationsModel} model - The model parameter.
     * @returns {void} - Returns the result.
     */
    private applyModel(model: DataValidationsModel): void {
        this.entries.length = 0;
        this.handles.clear();
        this._disablePrompts = model.disablePrompts;
        this._xWindow = model.xWindow;
        this._yWindow = model.yWindow;
        this._extraAttrsXml = model.extraAttrsXml;
        for (const e of model.entries) {
            this.entries.push(cloneEntry(e));
        }
    }

    /**
     * handleFor method.
     *
     * @param {DataValidationEntry} entry - The entry parameter.
     * @returns {DataValidation} - Returns the result.
     */
    private handleFor(entry: DataValidationEntry): DataValidation {
        let h: DataValidationHandle = this.handles.get(entry);
        if (h === undefined) {
            h = new DataValidationHandle(entry, (): void => (this.host == null ? undefined : this.host.markDirty()));
            this.handles.set(entry, h);
        }
        return h;
    }
}

/**
 * Live mutable handle bound to an entry.
 */
class DataValidationHandle implements DataValidation {
    /** @private */
    public readonly entry: DataValidationEntry;
    private readonly markDirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {DataValidationEntry} entry - The entry parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(entry: DataValidationEntry, markDirty: () => void) {
        this.entry = entry;
        this.markDirty = markDirty;
    }

    /**
     * Gets address.
     *
     * @returns {string} - Returns the result.
     */
    public get address(): string {
        return formatSqref(this.entry.ranges);
    }

    /**
     * Sets address.
     *
     * @param {string} value - The value parameter.
     */
    public set address(value: string) {
        this.entry.ranges = parseSqref(value);
        this.markDirty();
    }

    /**
     * Gets type.
     *
     * @returns {DataValidationType} - Returns the result.
     */
    public get type(): DataValidationType {
        return this.entry.type;
    }

    /**
     * Sets type.
     *
     * @param {DataValidationType} value - The value parameter.
     */
    public set type(value: DataValidationType) {
        const next: DataValidationType = requireType(value);
        this.entry.type = next;
        // List source may be assigned after type; enforced when clearing sources
        // and on serialize. Decode inline CSV when firstFormula is already present.
        if (next === 'list' && this.entry.firstFormula !== undefined) {
            this.entry.listValues = tryDecodeListFormula(this.entry.firstFormula);
        } else if (next !== 'list') {
            this.entry.listValues = undefined;
        }
        this.markDirty();
    }

    /**
     * Gets operator.
     *
     * @returns {DataValidationOperator} - Returns the result.
     */
    public get operator(): DataValidationOperator {
        return this.entry.operator;
    }

    /**
     * Sets operator.
     *
     * @param {DataValidationOperator} value - The value parameter.
     */
    public set operator(value: DataValidationOperator) {
        this.entry.operator = requireOperator(value);
        this.markDirty();
    }

    /**
     * Gets errorStyle.
     *
     * @returns {DataValidationErrorStyle} - Returns the result.
     */
    public get errorStyle(): DataValidationErrorStyle {
        return this.entry.errorStyle;
    }

    /**
     * Sets errorStyle.
     *
     * @param {DataValidationErrorStyle} value - The value parameter.
     */
    public set errorStyle(value: DataValidationErrorStyle) {
        this.entry.errorStyle = requireErrorStyle(value);
        this.markDirty();
    }

    /**
     * Gets imeMode.
     *
     * @returns {DataValidationImeMode} - Returns the result.
     */
    public get imeMode(): DataValidationImeMode {
        return this.entry.imeMode;
    }

    /**
     * Sets imeMode.
     *
     * @param {DataValidationImeMode} value - The value parameter.
     */
    public set imeMode(value: DataValidationImeMode) {
        this.entry.imeMode = requireImeMode(value);
        this.markDirty();
    }

    /**
     * Gets allowBlank.
     *
     * @returns {boolean} - Returns the result.
     */
    public get allowBlank(): boolean {
        return this.entry.allowBlank;
    }

    /**
     * Sets allowBlank.
     *
     * @param {boolean} value - The value parameter.
     */
    public set allowBlank(value: boolean) {
        this.entry.allowBlank = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets showListDropdown.
     *
     * @returns {boolean} - Returns the result.
     */
    public get showListDropdown(): boolean {
        return this.entry.showListDropdown;
    }

    /**
     * Sets showListDropdown.
     *
     * @param {boolean} value - The value parameter.
     */
    public set showListDropdown(value: boolean) {
        this.entry.showListDropdown = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets showInputMessage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get showInputMessage(): boolean {
        return this.entry.showInputMessage;
    }

    /**
     * Sets showInputMessage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set showInputMessage(value: boolean) {
        this.entry.showInputMessage = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets showErrorMessage.
     *
     * @returns {boolean} - Returns the result.
     */
    public get showErrorMessage(): boolean {
        return this.entry.showErrorMessage;
    }

    /**
     * Sets showErrorMessage.
     *
     * @param {boolean} value - The value parameter.
     */
    public set showErrorMessage(value: boolean) {
        this.entry.showErrorMessage = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets errorTitle.
     *
     * @returns {string} - Returns the result.
     */
    public get errorTitle(): string | undefined {
        return this.entry.errorTitle;
    }

    /**
     * Sets errorTitle.
     *
     * @param {string} value - The value parameter.
     */
    public set errorTitle(value: string | undefined) {
        this.entry.errorTitle = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets error.
     *
     * @returns {string} - Returns the result.
     */
    public get error(): string | undefined {
        return this.entry.error;
    }

    /**
     * Sets error.
     *
     * @param {string} value - The value parameter.
     */
    public set error(value: string | undefined) {
        this.entry.error = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets promptTitle.
     *
     * @returns {string} - Returns the result.
     */
    public get promptTitle(): string | undefined {
        return this.entry.promptTitle;
    }

    /**
     * Sets promptTitle.
     *
     * @param {string} value - The value parameter.
     */
    public set promptTitle(value: string | undefined) {
        this.entry.promptTitle = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets prompt.
     *
     * @returns {string} - Returns the result.
     */
    public get prompt(): string | undefined {
        return this.entry.prompt;
    }

    /**
     * Sets prompt.
     *
     * @param {string} value - The value parameter.
     */
    public set prompt(value: string | undefined) {
        this.entry.prompt = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets firstFormula.
     *
     * @returns {string} - Returns the result.
     */
    public get firstFormula(): string | undefined {
        return this.entry.firstFormula;
    }

    /**
     * Sets firstFormula.
     *
     * @param {string} value - The value parameter.
     */
    public set firstFormula(value: string | undefined) {
        const next: string = normalizeOptionalFormula(value);
        if (this.entry.type === 'list') {
            assertListHasSource(this.entry.listValues, next);
            this.entry.firstFormula = next;
            this.entry.listValues = next !== undefined ? tryDecodeListFormula(next) : undefined;
        } else {
            this.entry.firstFormula = next;
        }
        this.markDirty();
    }

    /**
     * Gets secondFormula.
     *
     * @returns {string} - Returns the result.
     */
    public get secondFormula(): string | undefined {
        return this.entry.secondFormula;
    }

    /**
     * Sets secondFormula.
     *
     * @param {string} value - The value parameter.
     */
    public set secondFormula(value: string | undefined) {
        this.entry.secondFormula = normalizeOptionalFormula(value);
        this.markDirty();
    }

    /**
     * Gets listValues.
     *
     * @returns {string} - Returns the result.
     */
    public get listValues(): ReadonlyArray<string> | undefined {
        return this.entry.listValues !== undefined ? [...this.entry.listValues] : undefined;
    }

    /**
     * Sets listValues.
     *
     * @param {string} value - The value parameter.
     */
    public set listValues(value: ReadonlyArray<string> | undefined) {
        if (value === undefined) {
            if (this.entry.type === 'list') {
                assertListHasSource(undefined, this.entry.firstFormula);
            }
            this.entry.listValues = undefined;
            this.markDirty();
            return;
        }
        if (!Array.isArray(value)) {
            throw new InvalidArgumentError('listValues must be an array of strings');
        }
        const cleaned: string[] = value.map((v: any, i: number): string => {
            if (typeof v !== 'string') {
                throw new InvalidArgumentError(`listValues[${String(i)}] must be a string`);
            }
            return v;
        });
        if (cleaned.length === 0 && this.entry.type === 'list') {
            assertListHasSource(cleaned, this.entry.firstFormula);
        }
        this.entry.listValues = cleaned;
        this.entry.firstFormula = encodeListFormula(cleaned);
        if (this.entry.type === DEFAULT_TYPE) {
            this.entry.type = 'list';
        }
        this.markDirty();
    }
}

/**
 * Authoring defaults for {@link DataValidations.add}. `showErrorMessage` is true to match Excel/XlsIO UI (Error Alert enabled). Citation: corpus/interoperability/data-validations-basic — XlsIO rules carry `showErrorMessage="1"` even without an explicit error message.
 *
 * @param {string} address - The address parameter.
 * @returns {DataValidationEntry} - Returns the result.
 */
function createDefaultEntry(address: string): DataValidationEntry {
    return {
        ranges: parseSqref(address),
        type: DEFAULT_TYPE,
        operator: DEFAULT_OPERATOR,
        errorStyle: DEFAULT_ERROR_STYLE,
        imeMode: DEFAULT_IME_MODE,
        allowBlank: false,
        showListDropdown: true,
        showInputMessage: false,
        showErrorMessage: true,
        errorTitle: undefined,
        error: undefined,
        promptTitle: undefined,
        prompt: undefined,
        firstFormula: undefined,
        secondFormula: undefined,
        listValues: undefined,
        extraAttrsXml: ''
    };
}

/**
 * assertListHasSource function.
 *
 * @param {string} listValues - The listValues parameter.
 * @param {string} firstFormula - The firstFormula parameter.
 * @returns {void} - Returns the result.
 */
function assertListHasSource(listValues: ReadonlyArray<string> | undefined, firstFormula: string | undefined): void {
    const hasList: boolean = (listValues !== undefined && listValues.length > 0) || (firstFormula !== undefined && firstFormula.length > 0);
    if (!hasList) {
        throw new InvalidDataValidationError('List data validation requires listValues or a non-empty firstFormula');
    }
}

/**
 * cloneEntry function.
 *
 * @param {DataValidationEntry} e - The e parameter.
 * @returns {DataValidationEntry} - Returns the result.
 */
function cloneEntry(e: DataValidationEntry): DataValidationEntry {
    return {
        ranges: e.ranges.map((r: CellRange): { startRow: number; startCol: number; endRow: number; endCol: number } => ({ ...r })),
        type: e.type,
        operator: e.operator,
        errorStyle: e.errorStyle,
        imeMode: e.imeMode,
        allowBlank: e.allowBlank,
        showListDropdown: e.showListDropdown,
        showInputMessage: e.showInputMessage,
        showErrorMessage: e.showErrorMessage,
        errorTitle: e.errorTitle,
        error: e.error,
        promptTitle: e.promptTitle,
        prompt: e.prompt,
        firstFormula: e.firstFormula,
        secondFormula: e.secondFormula,
        listValues: e.listValues !== undefined ? [...e.listValues] : undefined,
        extraAttrsXml: e.extraAttrsXml
    };
}

/**
 * Parse multi-area `ST_Sqref` into ordered ranges.
 *
 * @param {string} sqref - The sqref parameter.
 * @returns {CellRange[]} - Returns the result.
 */
export function parseSqref(sqref: string): CellRange[] {
    const trimmed: string = sqref.trim();
    if (trimmed.length === 0) {
        throw new InvalidDataValidationError('Data validation address must be non-empty');
    }
    const tokens: string[] = trimmed.split(/\s+/).filter((t: string): boolean => t.length > 0);
    if (tokens.length === 0) {
        throw new InvalidDataValidationError('Data validation address must be non-empty');
    }
    const ranges: CellRange[] = [];
    for (const token of tokens) {
        try {
            ranges.push(parseA1Range(token));
        } catch (err) {
            throw new InvalidDataValidationError(`Invalid data validation address area "${token}"`, { cause: err });
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
export function formatSqref(ranges: ReadonlyArray<CellRange>): string {
    return ranges.map((r: CellRange): string => formatA1Range(r)).join(' ');
}

/**
 * Encode list values as Excel inline list formula (`"a,b,c"`). Quotes doubled inside values; whole formula wrapped in double quotes.
 *
 * @param {string} values - The values parameter.
 * @returns {string} - Returns the result.
 */
export function encodeListFormula(values: ReadonlyArray<string>): string {
    const body: string = values.map((v: string): string => v.replace(/"/g, '""')).join(',');
    return `"${body}"`;
}

/**
 * Decode Excel inline list formula when it is a quoted CSV; else undefined.
 *
 * @param {string} formula - The formula parameter.
 * @returns {string} - Returns the result.
 */
export function tryDecodeListFormula(formula: string): string[] | undefined {
    const t: string = formula.trim();
    if (t.length < 2 || t[0] !== '"' || t[t.length - 1] !== '"') {
        return undefined;
    }
    const inner: string = t.slice(1, -1);
    const parts: string[] = [];
    let cur: string = '';
    let i: number = 0;
    while (i < inner.length) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = inner[i];
        if (ch === '"') {
            if (inner[i + 1] === '"') {
                cur += '"';
                i += 2;
                continue;
            }
            // stray quote — treat as literal
            cur += ch;
            i += 1;
            continue;
        }
        if (ch === ',') {
            parts.push(cur);
            cur = '';
            i += 1;
            continue;
        }
        cur += ch != null ? ch : '';
        i += 1;
    }
    parts.push(cur);
    return parts;
}

/**
 * cellInSqref function.
 *
 * @param {CellCoord} coord - The coord parameter.
 * @param {Object} ranges - The ranges parameter.
 * @returns {boolean} - Returns the result.
 */
function cellInSqref(coord: CellCoord, ranges: ReadonlyArray<CellRange>): boolean {
    for (const r of ranges) {
        if (coord.row >= r.startRow && coord.row <= r.endRow && coord.col >= r.startCol && coord.col <= r.endCol) {
            return true;
        }
    }
    return false;
}

/**
 * requireType function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataValidationType} - Returns the result.
 */
function requireType(value: string): DataValidationType {
    if (!DV_TYPES.has(value)) {
        throw new InvalidDataValidationError(`Unknown data validation type "${value}"`);
    }
    return value as DataValidationType;
}

/**
 * requireOperator function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataValidationOperator} - Returns the result.
 */
function requireOperator(value: string): DataValidationOperator {
    if (!DV_OPERATORS.has(value)) {
        throw new InvalidDataValidationError(`Unknown data validation operator "${value}"`);
    }
    return value as DataValidationOperator;
}

/**
 * requireErrorStyle function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataValidationErrorStyle} - Returns the result.
 */
function requireErrorStyle(value: string): DataValidationErrorStyle {
    if (!DV_ERROR_STYLES.has(value)) {
        throw new InvalidDataValidationError(`Unknown data validation errorStyle "${value}"`);
    }
    return value as DataValidationErrorStyle;
}

/**
 * requireImeMode function.
 *
 * @param {string} value - The value parameter.
 * @returns {DataValidationImeMode} - Returns the result.
 */
function requireImeMode(value: string): DataValidationImeMode {
    if (!DV_IME_MODES.has(value)) {
        throw new InvalidDataValidationError(`Unknown data validation imeMode "${value}"`);
    }
    return value as DataValidationImeMode;
}

/**
 * normalizeOptionalString function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
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
 * normalizeOptionalFormula function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalFormula(value: string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('Formula must be a string');
    }
    const n: string = normalizeFormulaExpression(value);
    return n.length === 0 ? undefined : n;
}

/**
 * assertUnsignedInt function.
 *
 * @param {number} value - The value parameter.
 * @param {string} name - The name parameter.
 * @returns {void} - Returns the result.
 */
function assertUnsignedInt(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new InvalidArgumentError(`${name} must be a non-negative integer`);
    }
}

/**
 * CT_Worksheet local names that appear **before** `dataValidations` after sheetData.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const DATA_VALIDATIONS_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
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
    'conditionalFormatting'
];

/**
 * CT_Worksheet local names that appear **after** `dataValidations`.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const DATA_VALIDATIONS_SUCCESSORS: ReadonlyArray<string> = [
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

const DV_PRED_SET: ReadonlySet<string> = new Set(DATA_VALIDATIONS_PREDECESSORS_AFTER_SHEET_DATA);
const DV_SUCC_SET: ReadonlySet<string> = new Set(DATA_VALIDATIONS_SUCCESSORS);

/**
 * Index at which to insert serialized `dataValidations` among after-sheetData siblings.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findDataValidationsInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && DV_PRED_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && DV_SUCC_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse `dataValidations` element XML into a model. Soft-skips individual bad rules (keep valid siblings).
 *
 * @param {string} xml - The xml parameter.
 * @returns {DataValidationsModel} - Returns the result.
 */
export function parseDataValidationsXml(xml: string): DataValidationsModel {
    const openAttrs: string = elementOpenAttrsLocal(xml);
    const attrs: Map<string, string> = parseAttrMapLocal(openAttrs);
    const disablePrompts: boolean = parseBoolAttr(attrs.get('disablePrompts'), false);
    const xWindow: number = parseOptionalUnsigned(attrs.get('xWindow'));
    const yWindow: number = parseOptionalUnsigned(attrs.get('yWindow'));
    const extraAttrsXml: string = attrsToXmlExcludingLocal(attrs, new Set(['count', 'disablePrompts', 'xWindow', 'yWindow']));

    const inner: string = elementInnerLocal(xml);
    const children: string[] = splitTopLevelLocal(inner);
    const entries: DataValidationEntry[] = [];
    for (const child of children) {
        if (elementLocalNameLocal(child) !== 'dataValidation') {
            continue;
        }
        const parsed: DataValidationEntry = parseOneRule(child);
        if (parsed !== undefined) {
            entries.push(parsed);
        }
    }
    return {
        disablePrompts,
        xWindow,
        yWindow,
        extraAttrsXml,
        entries
    };
}

/**
 * parseOneRule function.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseOneRule(el: string): DataValidationEntry | undefined {
    const attrs: Map<string, string> = parseAttrMapLocal(elementOpenAttrsLocal(el));
    const sqrefRaw: string = attrs.get('sqref');
    if (sqrefRaw === undefined || sqrefRaw.trim().length === 0) {
        return undefined;
    }
    let ranges: CellRange[];
    try {
        ranges = parseSqref(sqrefRaw);
    } catch {
        return undefined;
    }

    const typeRaw: string = attrs.get('type');
    let type: DataValidationType = DEFAULT_TYPE;
    if (typeRaw !== undefined) {
        if (!DV_TYPES.has(typeRaw)) {
            return undefined;
        }
        type = typeRaw as DataValidationType;
    }

    const opRaw: string = attrs.get('operator');
    let operator: DataValidationOperator = DEFAULT_OPERATOR;
    if (opRaw !== undefined) {
        if (!DV_OPERATORS.has(opRaw)) {
            return undefined;
        }
        operator = opRaw as DataValidationOperator;
    }

    const esRaw: string = attrs.get('errorStyle');
    let errorStyle: DataValidationErrorStyle = DEFAULT_ERROR_STYLE;
    if (esRaw !== undefined) {
        if (!DV_ERROR_STYLES.has(esRaw)) {
            return undefined;
        }
        errorStyle = esRaw as DataValidationErrorStyle;
    }

    const imeRaw: string = attrs.get('imeMode');
    let imeMode: DataValidationImeMode = DEFAULT_IME_MODE;
    if (imeRaw !== undefined) {
        if (!DV_IME_MODES.has(imeRaw)) {
            return undefined;
        }
        imeMode = imeRaw as DataValidationImeMode;
    }

    const allowBlank: boolean = parseBoolAttr(attrs.get('allowBlank'), false);
    // Wire showDropDown=true means HIDE dropdown → public showListDropdown = !wire
    const showDropDownWire: boolean = parseBoolAttr(attrs.get('showDropDown'), false);
    const showListDropdown: boolean = !showDropDownWire;
    const showInputMessage: boolean = parseBoolAttr(attrs.get('showInputMessage'), false);
    const showErrorMessage: boolean = parseBoolAttr(attrs.get('showErrorMessage'), false);

    const errorTitle: string = attrs.get('errorTitle');
    const error: string = attrs.get('error');
    const promptTitle: string = attrs.get('promptTitle');
    const prompt: string = attrs.get('prompt');

    const extraAttrsXml: string = attrsToXmlExcludingLocal(
        attrs,
        new Set([
            'type',
            'errorStyle',
            'imeMode',
            'operator',
            'allowBlank',
            'showDropDown',
            'showInputMessage',
            'showErrorMessage',
            'errorTitle',
            'error',
            'promptTitle',
            'prompt',
            'sqref'
        ])
    );

    let firstFormula: string | undefined;
    let secondFormula: string | undefined;
    const inner: string = elementInnerLocal(el);
    for (const child of splitTopLevelLocal(inner)) {
        const local: string = elementLocalNameLocal(child);
        if (local === 'formula1') {
            firstFormula = unescapeXml(elementInnerLocal(child));
        } else if (local === 'formula2') {
            secondFormula = unescapeXml(elementInnerLocal(child));
        }
    }

    let listValues: string[] | undefined;
    if (type === 'list' && firstFormula !== undefined) {
        listValues = tryDecodeListFormula(firstFormula);
    }

    return {
        ranges,
        type,
        operator,
        errorStyle,
        imeMode,
        allowBlank,
        showListDropdown,
        showInputMessage,
        showErrorMessage,
        errorTitle,
        error,
        promptTitle,
        prompt,
        firstFormula: firstFormula !== undefined && firstFormula.length > 0 ? firstFormula : undefined,
        secondFormula: secondFormula !== undefined && secondFormula.length > 0 ? secondFormula : undefined,
        listValues,
        extraAttrsXml
    };
}

/**
 * Serialize model to a `dataValidations` element, or `undefined` when empty.
 *
 * @param {DataValidationsModel} model - The model parameter.
 * @returns {string} - Returns the result.
 */
export function serializeDataValidationsXml(model: DataValidationsModel): string | undefined {
    if (model.entries.length === 0) {
        return undefined;
    }
    for (const e of model.entries) {
        if (e.type === 'list') {
            assertListHasSource(e.listValues, e.firstFormula);
        }
    }
    const attrParts: string[] = [`count="${model.entries.length}"`];
    if (model.disablePrompts) {
        attrParts.push('disablePrompts="1"');
    }
    if (model.xWindow !== undefined) {
        attrParts.push(`xWindow="${model.xWindow}"`);
    }
    if (model.yWindow !== undefined) {
        attrParts.push(`yWindow="${model.yWindow}"`);
    }
    if (model.extraAttrsXml.trim().length > 0) {
        attrParts.push(model.extraAttrsXml.trim());
    }
    const parts: string[] = [`<dataValidations ${attrParts.join(' ')}>`];
    for (const e of model.entries) {
        parts.push(serializeOneRule(e));
    }
    parts.push('</dataValidations>');
    return parts.join('');
}

/**
 * serializeOneRule function.
 *
 * @param {DataValidationEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeOneRule(e: DataValidationEntry): string {
    const attrs: string[] = [];
    if (e.type !== DEFAULT_TYPE) {
        attrs.push(`type="${escapeXml(e.type)}"`);
    }
    if (e.errorStyle !== DEFAULT_ERROR_STYLE) {
        attrs.push(`errorStyle="${escapeXml(e.errorStyle)}"`);
    }
    if (e.imeMode !== DEFAULT_IME_MODE) {
        attrs.push(`imeMode="${escapeXml(e.imeMode)}"`);
    }
    if (e.operator !== DEFAULT_OPERATOR) {
        attrs.push(`operator="${escapeXml(e.operator)}"`);
    }
    if (e.allowBlank) {
        attrs.push('allowBlank="1"');
    }
    // Public showListDropdown false → wire showDropDown true (hide)
    if (!e.showListDropdown) {
        attrs.push('showDropDown="1"');
    }
    if (e.showInputMessage) {
        attrs.push('showInputMessage="1"');
    }
    if (e.showErrorMessage) {
        attrs.push('showErrorMessage="1"');
    }
    if (e.errorTitle !== undefined) {
        attrs.push(`errorTitle="${escapeXml(e.errorTitle)}"`);
    }
    if (e.error !== undefined) {
        attrs.push(`error="${escapeXml(e.error)}"`);
    }
    if (e.promptTitle !== undefined) {
        attrs.push(`promptTitle="${escapeXml(e.promptTitle)}"`);
    }
    if (e.prompt !== undefined) {
        attrs.push(`prompt="${escapeXml(e.prompt)}"`);
    }
    attrs.push(`sqref="${escapeXml(formatSqref(e.ranges))}"`);
    if (e.extraAttrsXml.trim().length > 0) {
        attrs.push(e.extraAttrsXml.trim());
    }

    const children: string[] = [];
    if (e.firstFormula !== undefined) {
        children.push(`<formula1>${escapeXml(e.firstFormula)}</formula1>`);
    }
    if (e.secondFormula !== undefined) {
        children.push(`<formula2>${escapeXml(e.secondFormula)}</formula2>`);
    }

    const open: string = `<dataValidation ${attrs.join(' ')}`;
    if (children.length === 0) {
        return `${open}/>`;
    }
    return `${open}>${children.join('')}</dataValidation>`;
}

/**
 * parseBoolAttr function.
 *
 * @param {string} raw - The raw parameter.
 * @param {boolean} defaultValue - The defaultValue parameter.
 * @returns {boolean} - Returns the result.
 */
function parseBoolAttr(raw: string | undefined, defaultValue: boolean): boolean {
    if (raw === undefined) {
        return defaultValue;
    }
    const v: string = raw.trim().toLowerCase();
    if (v === '1' || v === 'true') {
        return true;
    }
    if (v === '0' || v === 'false') {
        return false;
    }
    return defaultValue;
}

/**
 * parseOptionalUnsigned function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalUnsigned(raw: string | undefined): number | undefined {
    if (raw === undefined || raw.trim().length === 0) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}

/* ── minimal local XML helpers (mirror merged-cells, avoid cycles) ── */

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
        if (k === 'xmlns' || k.startsWith('xmlns:')) {
            continue;
        }
        if (seen.has(k)) {
            continue;
        }
        seen.add(k);
        parts.push(`${k}="${escapeXml(v)}"`);
    }
    return parts.join(' ');
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
