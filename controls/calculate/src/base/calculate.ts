/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValue, INotifyPropertyChanged, EmitType, Event, NotifyPropertyChanges, Base, isNullOrUndefined, isUndefined, L10n } from '@syncfusion/ej2-base';
import { BasicFormulas } from './../formulas/index';
import { CalculateModel } from './calculate-model';
import { CommonErrors, FormulasErrorsStrings } from '../common/enum';
import { IFormulaCollection, FailureEventArgs, StoredCellInfo, ICalculateHost, CalculateSheetInfo, CalculateDateParseResult } from '../common/interface';
import { getRangeIndexes, getCellIndexes, getCellAddress, getRangeAddress } from '../common/address';
import { isDateTime } from '../common/number-date';
import { getSheetIndexByName } from '../common/sheet-info';
import { createSortComparer } from '../common/sort';
import { calculateDefaultLocale } from '../common/l10n';
import { Parser } from './parser';

const maxRows: number = 1048576;
const maxCols: number = 16384;

/**
 * Excel-compatible formula calculation engine.
 *
 * Register sheets, named ranges, and cell values, then evaluate formulas with
 * {@link Calculate.computeFormula} or refresh dependent cells after edits.
 *
 * Built-in library functions are registered by {@link BasicFormulas} (math, text,
 * logical, lookup, financial, statistical, engineering, and ECMA-376 extensions).
 *
 * @remarks
 * Integrate with a workbook by passing an {@link ICalculateHost} to the constructor,
 * or use standalone key/value storage via {@link Calculate.setKeyValue}.
 *
 * @example
 * ```ts
 * import { Calculate } from '@syncfusion/ej2-calculate';
 *
 * const engine = new Calculate();
 * engine.setKeyValue('A1', '10');
 * engine.setKeyValue('A2', '20');
 * const sum = engine.computeFormula('=SUM(A1:A2)'); // '30'
 * engine.destroy();
 * ```
 */

@NotifyPropertyChanges
export class Calculate extends Base<HTMLElement> implements INotifyPropertyChanged {
    private lFormulas: Map<string, IFormulaCollection> = new Map<string, IFormulaCollection>();
    /**
     * Registered library formula collection (name → handler metadata).
     *
     * Prefer {@link getLibraryFormulas} for read access. The setter accepts a single
     * formula registration payload used during built-in and custom registration.
     *
     * @hidden
     * @returns {any} - Registered library formula collection.
     */
    get libraryFormulas(): any {
        return this.lFormulas;
    }
    set libraryFormulas(formulaColl: any) {
        this.lFormulas.set(
            formulaColl.fName, {
                handler: formulaColl.handler,
                category: formulaColl.category,
                description: formulaColl.description,
                syntax: formulaColl.syntax
            });
    }
    /** @hidden */
    public storedData: Map<string, FormulaInfo> = new Map<string, FormulaInfo>();
    /** @hidden */
    public actCell: string;
    private keyToRowsMap: Map<string, number> = new Map<string, number>();
    private rowsToKeyMap: Map<number, string> = new Map<number, string>();
    /** @hidden */
    public rightBracket: string = String.fromCharCode(161);
    /** @hidden */
    public leftBracket: string = String.fromCharCode(162);
    /** @hidden */
    public sheetToken: string = '!';
    /**
     * Active cell reference currently being evaluated (may include a sheet token).
     *
     * @hidden
     */
    public cell: string = '';
    private cellPrefix: string = '!0!A';
    private treatEmptyStringAsZero: boolean = false;
    /** @hidden */
    public parentObject: Object | Calculate;
    /** @hidden */
    public tic: string = '"';
    /** @hidden */
    public singleTic: string = '\'';
    /** @hidden */
    public trueValue: string = 'TRUE';
    /** @hidden */
    public falseValue: string = 'FALSE';
    private parseDecimalSeparator: string = '.';
    /** @hidden */
    public spreadSheetUsedRange: number[];
    /** @hidden */
    public arithMarker: string = String.fromCharCode(180);
    /** @hidden */
    public arithMarker2: string = this.arithMarker + this.arithMarker;
    private dependentCells: Map<string, string[]> = null;
    private dependentFormulaCells: Map<string, Map<string, string>> = null;
    /**
     * Minimum numeric bound used by library formulas that clamp results.
     *
     * @hidden
     */
    public minValue: number = Number.MIN_SAFE_INTEGER;
    /**
     * Maximum numeric bound used by library formulas that clamp results.
     *
     * @hidden
     */
    public maxValue: number = Number.MAX_SAFE_INTEGER;
    /**
     * Formula category labels used by Insert Function UI integrations.
     * The `'All'` entry is localized via Syncfusion {@link L10n} (key `CategoryAll`).
     *
     * @hidden
     */
    public categoryCollection: string[] = ['All'];
    /**
     * Nesting depth counter used while walking formula dependencies.
     *
     * @hidden
     */
    public dependencyLevel: number = 0;
    /**
     * Syncfusion L10n instance for localizable calculate prose (not Excel tokens).
     *
     * @hidden
     */
    private l10n: L10n;
    /** @hidden */
    public randomValues: Map<string, string> = new Map<string, string>();
    /** @hidden */
    public isRandomVal: boolean = false;
    /** @hidden */
    public randCollection: string[] = [];
    /** @hidden */
    public dependencyCollection: string[] = [];
    /** @hidden */
    public uniqueRange: string[] = [];
    private uniqueCells: string[];
    /** @hidden */
    public sortRange: string[] = [];
    private sortCells: string[];

    /**
     * Parser and engine failure messages indexed by {@link FormulasErrorsStrings}.
     *
     * Prose entries are localized via {@link L10n} / {@link setLocale}. Excel error
     * tokens in this array (`#NAME?`, `#CIRCULARREF!`, `#SPILL!`, `#DIV/0!`) stay
     * English for workbook compatibility.
     *
     * @hidden
     */
    public formulaErrorStrings: string[] = [];
    private errorStrings: string[] = null;
    /** @hidden */
    public grid: Object | Calculate;
    /** @hidden */
    public parser: Parser;
    private parseArgumentSeparator: string = ',';
    private dateTime1900: Date = new Date(1900, 0, 1, 0, 0, 0);
    private isParseDecimalSeparatorChanged: boolean = false;
    private isArgumentSeparatorChanged: boolean = false;
    private sheetFamilyID: number = 0;
    private defaultFamilyItem: CalcSheetFamilyItem = null;
    private sheetFamiliesList: Map<number, CalcSheetFamilyItem> = null;
    private modelToSheetID: Map<Object, number> = null;
    /** @hidden */
    public tokenCount: number = 0;
    private sortedSheetNames: string[] = null;
    private tempSheetPlaceHolder: string = String.fromCharCode(133);
    /** @hidden */
    public namedRanges: Map<string, string> = new Map<string, string>();
    private formulaInfoTable: Map<string, FormulaInfo> = null;
    private millisecondsOfaDay: number = 24 * 60 * 60 * 1000;
    private parseDateTimeSeparator: string = '/';
    /** Keys currently being evaluated via {@link getKeyValue} (guards row-map recursion). */
    private evaluatingKeys: Set<string> = new Set<string>();

    /**
     * Fired when formula parsing or evaluation fails.
     *
     * @event onFailure
     */
    @Event()
    public onFailure: EmitType<FailureEventArgs>;

    /**
     * Creates a Calculate engine and registers built-in formulas.
     *
     * @param {Object} parent - Optional host implementing {@link ICalculateHost} (for example a workbook),
     * or omit for a standalone engine that stores values with {@link setKeyValue}.
     */

    constructor(parent?: Object | ICalculateHost) {
        super(null, null);
        const host: ICalculateHost = parent as ICalculateHost;
        const locale: string = (host && host.locale) ? host.locale : 'en-US';
        this.l10n = new L10n('calculate', calculateDefaultLocale, locale);
        this.refreshLocalizedStrings();
        new BasicFormulas(this);
        this.parentObject = isNullOrUndefined(parent) ? this : parent;
        this.grid = this.parentObject;
        this.parser = new Parser(this);
    }

    /**
     * Applies culture-specific prose for parser/engine messages and category labels.
     *
     * Excel error tokens (`#VALUE!`, …), `TRUE`/`FALSE`, and English function names
     * are not localized.
     *
     * @hidden
     * @param {string} locale - Culture id (for example `"fr-FR"`). Defaults to host `locale` or `"en-US"`.
     * @returns {void}
     */
    public setLocale(locale?: string): void {
        const host: ICalculateHost = this.parentObject as ICalculateHost;
        const next: string = locale || (host && host.locale) || 'en-US';
        this.l10n.setLocale(next);
        this.refreshLocalizedStrings();
    }

    /**
     * Rebuilds {@link formulaErrorStrings} and {@link categoryCollection} from L10n.
     *
     * @hidden
     * @returns {void}
     */
    private refreshLocalizedStrings(): void {
        const t: (key: string) => string = (key: string): string => this.l10n.getConstant(key);
        this.formulaErrorStrings = [
            t('OperatorsCannotStartWithExpression'),
            t('CannotParse'),
            t('BadLibrary'),
            t('InvalidCharInFrontOf'),
            t('NumberContains2DecimalPoints'),
            t('ExpressionCannotEndWithAnOperator'),
            t('InvalidCharactersFollowingWithOperator'),
            t('InvalidCharInNumber'),
            t('MismatchedParentheses'),
            t('UnknownFormulaName'),
            t('RequiresASingleArgument'),
            t('Requires3Args'),
            t('InvalidMathArgument'),
            t('Requires2Args'),
            '#NAME?',
            t('TooComplex'),
            '#CIRCULARREF!',
            t('MissingFormula'),
            t('ImproperFormula'),
            t('InvalidExpression'),
            t('CellEmpty'),
            t('BadFormula'),
            t('EmptyExpression'),
            '',
            t('MismatchedTics'),
            t('WrongNumberArguments'),
            t('InvalidArguments'),
            t('IterationsDoNotConverge'),
            t('AlreadyRegistered'),
            t('CalculationOverflow'),
            t('MissingSheet'),
            t('CannotParseUnderscore'),
            t('ExpressionCannotEndWithAnOperatorUnderscore'),
            '#SPILL!',
            '#DIV/0!'
        ];
        this.categoryCollection = [t('CategoryAll')];
    }

    /**
     * Returns sheet metadata from the calculate host when available.
     *
     * @returns {Object} - Sheet info entries from {@link ICalculateHost.getSheetInfo}, or an empty array.
     * @hidden
     */

    public getHostSheetInfo(): CalculateSheetInfo[] {
        const host: ICalculateHost = this.parentObject as ICalculateHost;
        if (host && typeof host.getSheetInfo === 'function') {
            return host.getSheetInfo() || [];
        }
        return [];
    }

    /**
     * Parses a date/time string via the host when {@link ICalculateHost.parseDate} is implemented.
     *
     * @param {string | number | boolean | Object} value - Date or time text to parse.
     * @returns {Object} - Host parse result, or an empty object when no host parser is available.
     * @hidden
     */

    public hostParseDate(value: string): CalculateDateParseResult {
        const host: ICalculateHost = this.parentObject as ICalculateHost;
        if (host && typeof host.parseDate === 'function') {
            return host.parseDate(value) || {};
        }
        return {};
    }

    /**
     * Gets the culture-aware separator used to split formula arguments (typically `,` or `;`).
     *
     * @hidden
     * @returns {string} - Argument separator string.
     */

    public getParseArgumentSeparator(): string {
        const seperator: string = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    }

    /**
     * Sets the separator used to split formula arguments.
     *
     * @param {string | number | boolean | Object} value - Argument separator for the current culture (for example `,` or `;`).
     * @returns {void}
     */

    public setParseArgumentSeparator(value: string): void {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    }

    /**
     * Gets the date/time component separator used when parsing date literals.
     *
     * @hidden
     * @returns {Date | Object} - Date/time separator string (default `/`).
     */

    public getParseDateTimeSeparator(): string {
        return this.parseDateTimeSeparator;
    }

    /**
     * Controls whether empty string cell values are treated as numeric zero in calculations.
     *
     * @param {string | number | boolean | Object} value - When `true`, empty strings coerce to `0`.
     * @returns {void}
     */

    public setTreatEmptyStringAsZero(value: boolean): void {
        this.treatEmptyStringAsZero = value;
    }

    /**
     * Returns whether empty string values are treated as numeric zero.
     *
     * @hidden
     * @returns {string | number} - `true` when empty strings coerce to `0`.
     */

    public getTreatEmptyStringAsZero(): boolean {
        return this.treatEmptyStringAsZero;
    }

    /**
     * Sets the date/time component separator used when parsing date literals.
     *
     * @hidden
     * @param {string | number | boolean | Object} value - Separator character or string (for example `/` or `-`).
     * @returns {void}
     */

    public setParseDateTimeSeparator(value: string): void {
        this.parseDateTimeSeparator = value;
    }

    /**
     * Syncfusion property-change hook (no-op for Calculate; required by {@link INotifyPropertyChanged}).
     *
     * @param {Object} newProp - Updated model properties.
     * @param {Object} oldProp - Previous model properties.
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: CalculateModel, oldProp: CalculateModel): void {
        /** code snippets */
    }

    /**
     * Gets the module name of the Calculate engine.
     *
     * @returns {string} - Returns "calculate" as the component module name.
     */
    public getModuleName(): string {
        return 'calculate';
    }

    /**
     * Returns the leading character that marks a formula expression (always `=`).
     *
     * @returns {string} - Formula prefix character.
     * @hidden
     */

    public getFormulaCharacter(): string {
        return '=';
    }

    /**
     * Returns whether the first character of `text` is an uppercase A–Z letter.
     *
     * @param {string} text - Text to inspect.
     * @returns {string} - `true` when the first character is uppercase ASCII A-Z.
     * @hidden
     */

    public isUpperChar(text: string): boolean {
        const charCode: number = text.charCodeAt(0);
        return charCode > 64 && charCode < 91;
    }

    private resetKeys(): void {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    }

    /**
     * Records a dependency from the active formula cell to `cellRef` and detects circular references.
     *
     * @param {string} cellRef - Dependent cell reference (may include a sheet token).
     * @throws When a circular reference is detected.
     * @hidden
     * @returns {void}
     */

    public updateDependentCell(cellRef: string): void {
        let formulaCell: string = this.cell;
        if (formulaCell !== '') {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            if (family.sheetNameToParentObject) {
                if (!formulaCell.includes(this.sheetToken)) {
                    formulaCell = family.parentObjectToToken.get(this.grid) + formulaCell;
                }
                if (!cellRef.includes(this.sheetToken)) {
                    cellRef = family.parentObjectToToken.get(this.grid) + cellRef;
                }
            }
            if (formulaCell !== cellRef) {
                const dependentCellMap: Map<string, string[]> = this.getDependentCells();
                if (!dependentCellMap.has(cellRef)) {
                    dependentCellMap.set(cellRef, []);
                }
                const dependentCells: string[] = dependentCellMap.get(cellRef);
                if (dependentCells.indexOf(formulaCell) === -1) {
                    const formulaDependentCellMap: Map<string, Map<string, string>> = this.getDependentFormulaCells();
                    const cellRefObj: { [key: string]: boolean } = {};
                    const checkCircularReference: (refCell: string) => void = (refCell: string): void => {
                        if (formulaDependentCellMap.has(refCell)) {
                            const formalaRefCells: Map<string, string> = formulaDependentCellMap.get(refCell);
                            if (formalaRefCells.has(formulaCell)) {
                                throw this.formulaErrorStrings[FormulasErrorsStrings.CircularReference];
                            } else if (!cellRefObj[refCell as string]) {
                                cellRefObj[refCell as string] = true;
                                formalaRefCells.forEach((refCell: string): void => {
                                    checkCircularReference(refCell);
                                });
                            }
                        }
                    };
                    checkCircularReference(cellRef);
                    dependentCells.push(formulaCell);
                    if (!formulaDependentCellMap.has(formulaCell)) {
                        formulaDependentCellMap.set(formulaCell, new Map());
                        formulaDependentCellMap.get(formulaCell).set(cellRef, cellRef);
                    } else if (!formulaDependentCellMap.get(formulaCell).has(cellRef)) {
                        formulaDependentCellMap.get(formulaCell).set(cellRef, cellRef);
                    }
                }
            }
        }
    }

    /**
     * Returns the map of cell references to cells that depend on them.
     *
     * @returns {Object} - Dependency map keyed by referenced cell.
     * @hidden
     */

    public getDependentCells(): Map<string, string[]> {
        if (this.dependentCells == null) {
            this.dependentCells = new Map<string, string[]>();
        }
        return this.dependentCells;
    }

    /**
     * Returns the map of formula cells to the references they depend on.
     *
     * @returns {Object} - Nested map of formula cell → referenced cells.
     * @hidden
     */

    public getDependentFormulaCells(): Map<string, Map<string, string>> {
        if (this.isSheetMember()) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentFormulaCells == null) {
                family.sheetDependentFormulaCells = new Map<string, Map<string, string>>();
            }
            return family.sheetDependentFormulaCells;
        } else {
            if (this.dependentFormulaCells == null) {
                this.dependentFormulaCells = new Map<string, Map<string, string>>();
            }
            return this.dependentFormulaCells;
        }
    }

    /**
     * Returns the map of registered library formula names to their handlers and metadata.
     *
     * @hidden
     * @returns {Object} - Map keyed by uppercase Excel function name (for example `"SUM"`, `"XLOOKUP"`).
     */

    public getLibraryFormulas(): Map<string, IFormulaCollection> {
        return this.lFormulas;
    }

    /**
     * Returns the handler function for a registered library formula.
     *
     * @hidden
     * @param {string} libFormula - Excel function name (case-insensitive), for example `"SUM"`.
     * @returns {Function | null} - Bound `Compute*` handler, or `null` when the name is not registered.
     *
     * @example
     * ```ts
     * const sum = engine.getFunction('SUM');
     * ```
     */

    public getFunction(libFormula: string): Function {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        } else {
            return null;
        }
    }

    /**
     * Converts an Excel serial date value to a JavaScript `Date`.
     *
     * @param {string | number} val - Excel serial number as a string.
     * @returns {Date | Object} - Corresponding `Date` (accounts for the Excel 1900 leap-year quirk).
     * @hidden
     */

    public intToDate(val: string): Date {
        let dateVal: number = Number(val);
        dateVal = (dateVal > 0 && dateVal < 1) ? (1 + dateVal) : (dateVal === 0) ? 1 : dateVal;
        if (dateVal > 60) {
            dateVal -= 1; // Due to leap year issue of 1900 in MSExcel.
        }
        const startDate: Date = new Date('01/01/1900');
        const startDateUTC: number = Date.UTC(
            startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(),
            startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
        return new Date(new Date(((dateVal - 1) * (1000 * 3600 * 24)) + startDateUTC).toUTCString().replace(' GMT', ''));
    }

    /**
     * Returns the formula info table for the active sheet family (or the standalone engine table).
     *
     * @hidden
     * @returns {Object} - Map of cell token → {@link FormulaInfo}.
     */

    public getFormulaInfoTable(): Map<string, FormulaInfo> {
        if (this.isSheetMember()) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            if (family.sheetFormulaInfotable === null) {
                family.sheetFormulaInfotable = new Map<string, FormulaInfo>();
            }
            return family.sheetFormulaInfotable;
        } else {
            if (this.formulaInfoTable === null) {
                this.formulaInfoTable = new Map<string, FormulaInfo>();
            }
            return this.formulaInfoTable;
        }
    }

    /**
     * Gets the decimal separator used when parsing numeric literals.
     *
     * @hidden
     * @returns {string} - Decimal separator string (default `.`).
     */

    public getParseDecimalSeparator(): string {
        const seperator: string = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    }

    /**
     * Sets the decimal separator used when parsing numeric literals.
     *
     * @param {string | number | boolean | Object} value - Decimal separator for the current culture (for example `.` or `,`).
     * @returns {void}
     */

    public setParseDecimalSeparator(value: string): void {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    }

    /**
     * Extracts the sheet token prefix from a cell reference when present.
     *
     * @param {string} cellRef - Cell or range reference that may begin with a sheet token.
     * @returns {string} - Sheet token substring including delimiters, or an empty string.
     * @hidden
     */

    public getSheetToken(cellRef: string): string {
        let i: number = 0;
        let temp: string = '';
        if (i < cellRef.length && cellRef[i as number] === this.sheetToken) {
            i++;
            while (i < cellRef.length && cellRef[i as number] !== this.sheetToken) {
                i++;
            }
            temp = cellRef.substring(0, i + 1);
        }
        if (i < cellRef.length) {
            return temp;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.BadIndex];
    }

    /**
     * Resolves the sheet family id for a grid/parent object.
     *
     * @param {Object} grd - Grid or parent object registered with the engine.
     * @returns {string | number} - Sheet id, or `-1` when not registered.
     * @hidden
     */

    public getSheetID(grd: Object): number {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            let token: string = family.parentObjectToToken.get(grd);
            if (token) {
                token = token.split(this.sheetToken).join('');
                const id: number = this.parseFloat(token);
                if (!this.isNaN(id)) {
                    return id;
                }
            }
        }
        return -1;
    }

    /**
     * Parses a numeric string using the configured decimal separator.
     *
     * @hidden
     * @param {string | number | boolean | Object} value - Numeric text or number.
     * @returns {number} - Parsed number, or `NaN` when parsing fails.
     */

    public parseFloat(value: string | number): number {
        let convertedNum: number = Number(value);
        if (isNaN(convertedNum) && typeof value === 'string' && value.includes(',')) {
            convertedNum = Number(value.split(',').join(''));
        }
        return convertedNum;
    }

    /**
     * Returns the 1-based row index from a cell reference string.
     *
     * @hidden
     * @param {string} cell - Cell reference (optional sheet token allowed).
     * @returns {number} - Row number, or `-1` when invalid.
     */

    public rowIndex(cell: string): number {
        let i: number = 0;
        let isLetter: boolean = false;
        if (i < cell.length && cell[i as number] === this.sheetToken) {
            i++;
            while (i < cell.length && cell[i as number] !== this.sheetToken) {
                i++;
            }
            i++;
        }
        while (i < cell.length && this.isChar(cell[i as number])) {
            isLetter = true;
            i++;
        }
        const result: number = parseInt(cell.substring(i), 10);
        if (i < cell.length && !this.isNaN(result)) {
            return result;
        }
        if (isLetter) {
            return -1;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.BadIndex];
    }

    /**
     * Returns the 1-based column index from a cell reference string.
     *
     * @param {string} cell - Cell reference (optional sheet token allowed).
     * @returns {number} - Column number, or `-1` when invalid.
     * @hidden
     */

    public colIndex(cell: string): number {
        let j: number = 0;
        let k: number = 0;
        cell = cell.toUpperCase();
        if (j < cell.length && cell[j as number] === this.sheetToken) {
            j++;
            while (j < cell.length && cell[j as number] !== this.sheetToken) {
                j++;
            }
            j++;
        }
        while (j < cell.length && this.isChar(cell[j as number])) {
            const charCode: number = cell[j as number].charCodeAt(0);
            k = k * 26 + charCode - 64;
            j++;
        }
        if (k === 0) {
            return -1;
        }
        return k;
    }

    /**
     * Returns the Excel-compatible error tokens used by the engine (`#N/A`, `#VALUE!`, …).
     *
     * @returns {string[]} - Error string list indexed by {@link CommonErrors}.
     * @hidden
     */

    public getErrorStrings(): string[] {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!', '#CALC!'];
        }
        return this.errorStrings;
    }

    /**
     * Returns a substring with Excel-style optional length (defaults to remainder of `text`).
     *
     * @param {string} text - Source string.
     * @param {number} startIndex - Zero-based start index.
     * @param {number} length - Optional length; when omitted, returns through the end of `text`.
     * @returns {string} - Substring.
     * @hidden
     */

    public substring(text: string, startIndex: number, length?: number): string {
        return text.substring(startIndex, length + startIndex);
    }

    /**
     * Returns whether `c` is an alphabetic character (A–Z or a–z).
     *
     * @param {number} c - Single character or string whose first character is tested.
     * @returns {string | number} - `true` when alphabetic.
     * @hidden
     */

    public isChar(c: string): boolean {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    }

    /**
     * Returns the {@link CalcSheetFamilyItem} for a model/grid, creating family storage as needed.
     *
     * @param {Object} model - Parent grid or sheet model.
     * @param {string | number | Object} calcId - Optional explicit family id.
     * @returns {string | number} - Sheet family item for the model.
     * @hidden
     */

    public getSheetFamilyItem(model: Object, calcId?: number): CalcSheetFamilyItem {
        if (this.sheetFamilyID === 0) {
            if (this.defaultFamilyItem == null) {
                this.defaultFamilyItem = new CalcSheetFamilyItem();
            }
            return this.defaultFamilyItem;
        }
        if (this.sheetFamiliesList == null) {
            this.sheetFamiliesList = new Map<number, CalcSheetFamilyItem>();
        }
        if (calcId === undefined) {
            calcId = this.modelToSheetID.get(model);
        }
        if (!this.sheetFamiliesList.has(calcId)) {
            this.sheetFamiliesList.set(calcId, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(calcId);
    }

    /**
     * Stores a standalone key/value (or formula) for evaluation without a workbook host.
     *
     * When `value` starts with `=`, it is treated as a formula and evaluated by {@link getKeyValue}.
     *
     * @param {string} key - Cell-like key (for example `"A1"`).
     * @param {string | number | boolean | Object} value - Literal value or formula text.
     *
     * @example
     * ```ts
     * engine.setKeyValue('A1', '10');
     * engine.setKeyValue('B1', '=A1*2');
     * ```
     * @returns {void}
     */

    public setKeyValue(key: string, value: string | number): void {
        key = key.toUpperCase();
        const str: string = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf('{') === 0) {
            this.storedData.set(key, new FormulaInfo());
            this.keyToRowsMap.set(key, this.keyToRowsMap.size + 1);
            this.rowsToKeyMap.set(this.rowsToKeyMap.size + 1, key);
        }
        const fInfo: FormulaInfo = this.storedData.get(key);
        if (fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() !== str) {
            const s1: string = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            const formulaDependent: Map<string, string> = this.getDependentFormulaCells().get(s1);
            if (formulaDependent != null) {
                this.clearFormulaDependentCells(s1);
            }
        }
        if (str.length > 0 && str[0] === this.getFormulaCharacter()) {
            fInfo.setFormulaText(str);
        } else if (fInfo.getFormulaValue() !== str) {
            fInfo.setFormulaText('');
            fInfo.setParsedFormula('');
            fInfo.setFormulaValue(str);
        }
    }

    /**
     * Clears dependency graph entries for a formula cell.
     *
     * @param {string} cell - Formula cell token whose dependencies should be removed.
     * @hidden
     * @returns {void}
     */

    public clearFormulaDependentCells(cell: string): void {
        const dependentFormula: Map<string, string> = this.getDependentFormulaCells().get(cell);
        if (dependentFormula) {
            dependentFormula.forEach((value: string, key: string) => {
                const s: string = key;
                const dependent: string[] = this.getDependentCells().get(s);
                this.arrayRemove(dependent, cell);
                if (dependent.length === 0) {
                    this.getDependentCells().delete(s);
                }
            });
            this.getDependentFormulaCells().delete(cell);
        }
    }

    /**
     * Clears all stored key-value pairs from memory in standalone mode.
     *
     * @returns {void}
     */
    public clearKeys(): void {
        this.resetKeys();
    }

    private arrayRemove(array: string[], value: string): string[] {
        const index: number = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }

    /**
     * Returns the stored or computed value for a standalone key registered with {@link setKeyValue}.
     *
     * @param {string} key - Cell-like key (case-insensitive).
     * @returns {string} - Computed formula result or stored literal; empty string when missing.
     *
     * @example
     * ```ts
     * engine.setKeyValue('A1', '=1+2');
     * engine.getKeyValue('A1'); // '3'
     * ```
     */

    public getKeyValue(key: string): string | number {
        key = key.toUpperCase();
        if (!this.storedData.has(key)) {
            return '';
        }
        const fInfo: FormulaInfo = this.storedData.get(key);
        let fText: string = fInfo.getFormulaText();
        if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
            if (this.evaluatingKeys.has(key)) {
                return this.getErrorStrings()[CommonErrors.Ref];
            }
            this.evaluatingKeys.add(key);
            this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            fText = fText.substring(1);
            try {
                try {
                    fInfo.setParsedFormula(this.parser.parseFormula(fText, key));
                } catch (ex) {
                    const args: FailureEventArgs = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    fInfo.setFormulaValue(args.message);
                    return this.storedData.get(key).getFormulaValue();
                }
                try {
                    fInfo.setFormulaValue(this.computeFormula(fInfo.getParsedFormula()));
                } catch (ex) {
                    const args: FailureEventArgs = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    const errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
                }
            } finally {
                this.evaluatingKeys.delete(key);
            }
        }
        return this.storedData.get(key).getFormulaValue();
    }

    /**
     * Returns the named range map (name → range address).
     *
     * @hidden
     * @returns {Object} - Mutable map of named ranges.
     */

    public getNamedRanges(): Map<string, string> {
        return this.namedRanges;
    }

    /**
     * Adds or replaces a named range.
     *
     * @param {string} name - Range name (optionally `Sheet!Name` scoped).
     * @param {string} range - Address or formula text associated with the name.
     * @returns {string} - `true` when the name was registered; `false` when sheet scope could not be resolved.
     */

    public addNamedRange(name: string, range: string): boolean {
        const sheetScopeName: string[] = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            const sheetId: (Object | Calculate) = (this.getSheetId(this.grid)).toString();
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(sheetId);
            if (!family.parentObjectToToken.get(sheetId)) {
                return false;
            }
            name = sheetScopeName[0] + this.sheetToken + sheetScopeName[1].toUpperCase();
        } else {
            name = name.toUpperCase();
        }
        this.namedRanges.set(name, range);
        return true;
    }

    /**
     * Rewrites named-range keys after a sheet rename.
     *
     * @param {string} pName - Previous sheet name segment.
     * @param {string} name - New sheet name segment.
     * @hidden
     * @returns {void}
     */

    public updateNamedRange(pName: string, name: string): void {
        const updatedRange: Map<string, string> = new Map<string, string>();
        this.namedRanges.forEach((value: string, key: string) => {
            let updatedKey: string = key;
            if (key.includes(pName)) {
                const range: string[] = key.split('!');
                range[0] = name;
                updatedKey = range.join('!');
            }
            updatedRange.set(updatedKey, value);
        });
        this.namedRanges = updatedRange;
    }

    /**
     * Removes a named range by name.
     *
     * @param {string} name - Named range to remove (case-insensitive).
     * @returns {string} - `true` when the name existed and was removed.
     */

    public removeNamedRange(name: string): boolean {
        name = name.toUpperCase();
        if (this.namedRanges.get(name) != null) {
            this.namedRanges.delete(name);
            return true;
        }
        return false;
    }

    /**
     * Converts a 1-based column number to Excel column letters (`1` → `"A"`, `27` → `"AA"`).
     *
     * @param {number} col - 1-based column index.
     * @returns {string | number} - Column letters.
     * @hidden
     */

    public convertAlpha(col: number): string {
        const arrCol: string[] = [];
        let n: number = 0;
        const charText: string = 'A';
        while (col > 0) {
            col--;
            const aCharValue: number = charText.charCodeAt(0);
            arrCol[n as number] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        const arr: string[] = [];
        for (let i: number = 0; i < n; i++) {
            arr[n - i - 1] = arrCol[i as number];
        }
        return arr.join('');
    }

    /**
     * Expands a cell or range reference into an array of individual cell addresses.
     *
     * @param {string} cellRange - Single cell or `A1:B2`-style range (sheet token allowed).
     * @returns {string} - Cell address array, or the original string when not expandable.
     * @hidden
     */

    public getCellCollection(cellRange: string): string[] | string {
        if (cellRange.indexOf(':') < 0) {
            if (!this.isCellReference(cellRange)) {
                return cellRange.split(this.getParseArgumentSeparator());
            } else {
                cellRange = cellRange + ':' + cellRange;
            }
        }
        let token: string = '';
        const sheetTokenIndex: number = cellRange.indexOf(this.sheetToken);
        if (sheetTokenIndex > -1) {
            const index: number = sheetTokenIndex;
            let s: number = index + 1;
            while (s < cellRange.length) {
                if (cellRange[s as number] === this.sheetToken) {
                    token = cellRange.substr(0, s + 1);
                    break;
                }
                s++;
            }
        }
        let i: number = cellRange.indexOf(':');
        let row1: number;
        let row2: number;
        let col1: number;
        let col2: number;
        if (i > 0 && this.isChar(cellRange[i - 1])) {
            let k: number = i - 2;
            while (k >= 0 && this.isDigit(cellRange[k as number])) {
                k--;
            }
        }
        row1 = this.rowIndex(this.substring(cellRange, 0, i));
        row2 = this.rowIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        col1 = this.colIndex(this.substring(cellRange, 0, i));
        col2 = this.colIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        if (row1 >= maxRows || row2 >= maxRows || col1 >= maxCols || col2 >= maxCols) {
            return [this.getErrorStrings()[CommonErrors.Ref]];
        }
        if (row1 > row2) {
            i = row2;
            row2 = row1;
            row1 = i;
        }

        if (col1 > col2) {
            i = col2;
            col2 = col1;
            col1 = i;
        }
        const cells: string[] = [];
        let j: number;
        let c: number = 0;
        for (i = row1; i <= row2; i++) {
            for (j = col1; j <= col2; j++) {
                cells[c as number] = token + '' + this.convertAlpha(j) + i.toString();
                c++;
            }
        }
        return cells;
    }

    /**
     * Parses (when needed) and evaluates a formula expression.
     *
     * @hidden
     * @param {string} formulaText - Formula text (with or without leading `=`) or a pre-parsed token string.
     * @param {boolean} isFromComputeExpression - Internal flag when invoked from {@link computeExpression}.
     * @returns {string} - Computed value, or an Excel error token string on failure.
     *
     * @example
     * ```ts
     * engine.computeFormula('=SUM(1,2,3)'); // '6'
     * ```
     */

    public computeFormula(formulaText: string, isFromComputeExpression?: boolean): string | number {
        return this.calculateFormula(formulaText, false, isFromComputeExpression);
    }

    private calculateFormula(formulaText: string, refresh: boolean, isFromComputeExpression?: boolean): string | number {
        let parsedText: string;
        let lastIndexOfq: number;
        let formulatResult: string | number;
        let nestedFormula: boolean = false;
        let fNested: string;
        // Only short-circuit when a previously parsed formula is already marked as failed.
        // Fresh formula text must re-parse so one failure does not poison later computeFormula calls.
        if (this.parser.isError) {
            return formulaText;
        }
        if (!this.parser.isFormulaParsed) {
            parsedText = this.parser.parseFormula(formulaText);
        } else {
            parsedText = formulaText;
        }
        this.parser.isFormulaParsed = false;
        try {
            lastIndexOfq = this.findLastIndexOfq(parsedText);
            if (lastIndexOfq > 0) {
                nestedFormula = true;
            }
            if (parsedText !== '' && lastIndexOfq > -1) {
                let i: number = lastIndexOfq + 1;
                while (i > -1) {
                    if (parsedText[i as number] !== this.rightBracket) {
                        i++;
                        continue;
                    }
                    const sFormula: string = parsedText.substring(lastIndexOfq, i + 1);
                    const libFormula: string = sFormula.split(this.leftBracket)[0].split('q').join('');
                    let args: string[];
                    if (this.getLibraryFormulas().get(libFormula.toUpperCase()).isCustom) {
                        args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                            .split(this.getParseArgumentSeparator());
                        let j: number = 0;
                        const customArgs: string[] = [];
                        let cellCol: string[];
                        for (j = 0; j < args.length; j++) {
                            if (args[j as number].includes(':') && this.isCellReference(args[j as number])) {
                                cellCol = this.getCellCollection(args[j as number]) as string[];
                                if (cellCol.length > 1) {
                                    customArgs.push(args[j as number]);
                                    cellCol.forEach((cell: string): void => {
                                        this.updateDependentCell(cell);
                                    });
                                } else {
                                    customArgs.push(this.getValueFromArg(args[j as number]));
                                }
                            } else {
                                customArgs.push(this.getValueFromArg(args[j as number]));
                            }
                        }
                        args = customArgs;
                    } else {
                        const argStr: string = sFormula.substring(
                            sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket));
                        args = [];
                        const separator: string = this.getParseArgumentSeparator();
                        let parameter: string = ''; let isInString: boolean;
                        for (let idx: number = 0, len: number = argStr.length - 1; idx <= len; idx++) {
                            if (argStr[idx as number] === '"') {
                                isInString = !isInString;
                            }
                            if (argStr[idx as number] === separator && !isInString) {
                                args.push(parameter);
                                parameter = '';
                                if (idx === len) {
                                    args.push(parameter);
                                }
                            } else {
                                parameter += argStr[idx as number];
                                if (idx === len) {
                                    args.push(parameter);
                                }
                            }
                        }
                        if (!args.length) {
                            args = [''];
                        }
                        if (nestedFormula && libFormula) {
                            const formulas: string[] = ['IF', 'INDEX', 'SORT', 'T', 'EXACT',
                                'PROPER', 'DOLLAR', 'DATE', 'TEXT', 'ISNUMBER', 'TRIM', 'LEFT'];
                            if (formulas.some((formula: string): boolean => formula === libFormula)) {
                                args.push('nestedFormulaTrue');
                            }
                            if (libFormula === 'IF') {
                                args.push('nestedFormulaTrue');
                            }
                            if (libFormula === 'VLOOKUP' || libFormula === 'HLOOKUP') {
                                const parentQIdx: number = parsedText.lastIndexOf('q', lastIndexOfq - 1);
                                if (parentQIdx !== -1) {
                                    const formula: string = parsedText.substring(
                                        parentQIdx + 1, parsedText.lastIndexOf(this.leftBracket, lastIndexOfq - 1));
                                    const conditionalFormulas: string[] = ['IF', 'IFS', 'AND', 'OR', 'NOT'];
                                    if (conditionalFormulas.some((cFormula: string): boolean => cFormula === formula)) {
                                        args.push('conditionalFormulaTrue');
                                    }
                                }
                            }
                        }
                        if (isFromComputeExpression && libFormula === 'UNIQUE') { args.push('isComputeExp'); }
                    }
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.Name] :
                        this.getFunction(libFormula)(...args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        const q: number = this.findLastIndexOfq(fNested);
                        if (q === 0) {
                            nestedFormula = false;
                        }
                        if (q === -1) {
                            formulatResult = this.computeValue(fNested, refresh);
                        }
                        lastIndexOfq = i = q;
                        parsedText = fNested;
                        continue;
                    }
                    break;
                }
            } else if (this.formulaErrorStrings.indexOf(parsedText) > -1) {
                formulatResult = parsedText;
            } else if (parsedText !== '' && lastIndexOfq === -1) {
                formulatResult = this.computeValue(parsedText, refresh);
            }
        } catch (ex) {
            const args: FailureEventArgs = { message: ex.message, exception: ex, isForceCalculable: false, computeForceCalculate: false };
            this.trigger('onFailure', args);
            const errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
            formulatResult = (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
        }
        return formulatResult;
    }

    /**
     * Shared implementation for SUMIF / AVERAGEIF range evaluation.
     *
     * @param {string} range - Argument tokens for the conditional aggregate.
     * @param {boolean} isAvgIf - When `true`, computes AVERAGEIF semantics; otherwise SUMIF.
     * @returns {string} - Partial aggregate values or an error string.
     * @hidden
     */

    public computeSumIfAndAvgIf(range: string[], isAvgIf: boolean): number[] | string {
        if (isNullOrUndefined(range) || range[0] === '' || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = range;
        for (let i: number = 0; i < argArr.length; i++) {
            if (this.isCellReference(argArr[i as number]) && isNullOrUndefined(argArr[i as number].match(/[0-9]/)) &&
                argArr[i as number].indexOf('!') < 0) {
                const splitArray: string[] = argArr[i as number].split(':');
                argArr[i as number] = splitArray[0] + '1' + ':' + splitArray[1] + this.spreadSheetUsedRange[0];
            }
        }
        const argCount: number = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[1] === '') {
            return isAvgIf ? this.getErrorStrings()[CommonErrors.DivZero] : '0';
        }
        const rangevalue: string = argArr[0];
        const isStringVal: boolean = argArr[1].startsWith(this.tic) && argArr[1].endsWith(this.tic);
        let criteria: string = this.getANDComputedValue(argArr[1]);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.Value];
        }
        const isAsterisk: boolean = criteria.includes('*');
        const isQuestionMark: boolean = criteria.includes('?');
        let criteriaValue: string = isAsterisk ? criteria.replace(/\*/g, '').trim() : criteria;
        let isCellReferenceValue: boolean = false;
        if (!isStringVal && this.isCellReference(criteriaValue)) {
            criteriaValue = this.getValueFromArg(criteriaValue);
            isCellReferenceValue = true;
        }
        if (isAsterisk) {
            const asteriskIndex: number = criteria.indexOf('*');
            if (criteria[0] === '*') { criteriaValue = '*' + criteriaValue; }
            if (criteria[criteria.length - 1] === '*') { criteriaValue += '*'; }
            if (asteriskIndex > 0 && asteriskIndex < criteria.length - 1) {
                criteriaValue = criteria.substring(0, asteriskIndex) + '*' + criteria.substring(asteriskIndex + 1);
            }
        }
        criteria = criteriaValue;
        let opt: string = this.parser.tokenEqual;
        if (criteria.startsWith('<=')) {
            opt = this.parser.tokenLessEq;
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('>=')) {
            opt = this.parser.tokenGreaterEq;
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<>')) {
            opt = this.parser.tokenNotEqual;
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<')) {
            opt = this.parser.tokenLess;
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('>')) {
            opt = this.parser.tokenGreater;
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('=')) {
            opt = this.parser.tokenEqual;
            criteria = criteria.substring(1);
        }
        if ((!isStringVal && this.isCellReference(criteria) && !isCellReferenceValue) || criteria.includes(this.arithMarker) ||
            (criteria.includes(this.getParseDecimalSeparator()) && !isAsterisk && !isQuestionMark)) {
            criteria = this.getValueFromArg(criteria);
        }
        const checkCriteria: number = this.parseFloat(criteria);
        const criteriaRangeArray: string = argArr[0];
        let sumRange: string[] | string = this.getCellCollection(argCount > 2 ? argArr[2] : rangevalue);
        const criteriaRange: string[] | string = this.getCellCollection(criteriaRangeArray);
        if (sumRange[0] === '#REF!' || criteriaRange[0] === '#REF!') {
            return this.getErrorStrings()[CommonErrors.Name];
        }
        if (criteriaRange.length > sumRange.length) {
            const sumEndCol: number = this.colIndex(sumRange[sumRange.length - 1]) +
                this.colIndex(criteriaRange[criteriaRange.length - 1]) - this.colIndex(criteriaRange[0]);
            const sumrange: string[] = argArr[2].split(':');
            sumrange[1] = (this.convertAlpha(sumEndCol) + this.rowIndex(criteriaRange[criteriaRange.length - 1])).toString();
            sumRange = this.getCellCollection(sumrange.join(':'));
            if (sumRange[0] === '#REF!') {
                return this.getErrorStrings()[CommonErrors.Name];
            }
        }
        const result: number[] = this.getComputeSumIfValue(
            criteriaRange, sumRange, criteria.toLowerCase(), checkCriteria, opt, isAsterisk, isQuestionMark);
        return [result[0], result[1]];
    }

    /**
     * Shared LOOKUP evaluation helper used by library formula handlers.
     *
     * @param {string} range - LOOKUP argument tokens.
     * @returns {string} - Matched value or an error token.
     * @hidden
     */

    public computeLookup(range: string[]): string {
        let lookupArray: string; let matchArray: string;
        let lookupRange: string[] | string = []; let matchupRange: string[] | string = [];
        const checkCriteria: string[] = []; const findMaxVal: string[] | string = [];
        let lookupValue: string; let isArrayVector: boolean;
        const result: string[] | string = [];
        const argArr: string[] = range;
        const argCount: number = argArr.length;
        if (argCount === 1 || argCount > 3) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[1] === '' || argArr[2] === '') {
            return this.getErrorStrings()[CommonErrors.Value];
        }
        lookupValue = this.getValueFromArg(argArr[0]);
        if (argArr[0].indexOf(this.tic) > -1 && argArr[0].toUpperCase().split(this.tic).join('') !== this.trueValue &&
            argArr[0].toUpperCase().split(this.tic).join('') !== this.falseValue && this.isNaN(this.parseFloat(argArr[0].split(this.tic).join('')))) {
            lookupValue = lookupValue.split(this.tic).join('');
        }
        if (this.getErrorStrings().indexOf(lookupValue) > -1) { return lookupValue; }
        const rangeSplit: string[] = argArr[1].split(':');
        if (rangeSplit.length === 2 && this.isCellReference(rangeSplit[0]) && this.isCellReference(rangeSplit[1]) && argCount === 2) {
            const index: number = argArr[1].indexOf(':');
            let rowIdx: number = this.rowIndex(this.substring(argArr[1], 0, index));
            let colIdx: number = this.colIndex(this.substring(argArr[1], 0, index));
            let endRowIdx: number = this.rowIndex(this.substring(argArr[1], index + 1, index + argArr[1].length - index - 1));
            let endColIdx: number = this.colIndex(this.substring(argArr[1], index + 1, index + argArr[1].length - index - 1));
            if (rowIdx > endRowIdx) {
                [rowIdx, endRowIdx] = [endRowIdx, rowIdx];
            }
            if (colIdx > endColIdx) {
                [colIdx, endColIdx] = [endColIdx, colIdx];
            }
            let sheetIdx: string | number = '';
            if (argArr[1].indexOf('!') === 0) {
                sheetIdx = argArr[1]; sheetIdx = sheetIdx.replace('!', '');
                sheetIdx = sheetIdx.indexOf('!'); sheetIdx = argArr[1].substring(0, sheetIdx + 2);
            }
            const colCount: number = endColIdx - colIdx + 1;
            const rowCount: number = endRowIdx - rowIdx + 1;
            if (rowCount > colCount || rowCount === colCount) { // Taller than Wide. vlookup
                lookupArray = sheetIdx + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(colIdx) + endRowIdx;
                matchArray = sheetIdx + getAlphalabel(endColIdx) + rowIdx + ':' + getAlphalabel(endColIdx) + endRowIdx;
            } else if (rowCount < colCount) { // Wider than Tall. hlookup
                lookupArray = sheetIdx + getAlphalabel(colIdx) + rowIdx + ':' + getAlphalabel(endColIdx) + rowIdx;
                matchArray = sheetIdx + getAlphalabel(colIdx) + endRowIdx + ':' + getAlphalabel(endColIdx) + endRowIdx;
            }
            if (rowIdx !== endRowIdx || colIdx !== endColIdx) {
                isArrayVector = true;
            }
        }
        if (isArrayVector) {
            lookupRange = this.getCellCollection(lookupArray);
            matchupRange = this.getCellCollection(matchArray);
            if (lookupRange[0] === '#REF!' || matchupRange[0] === '#REF!') {
                return this.getErrorStrings()[CommonErrors.Name];
            }
        } else {
            lookupRange = this.getCellCollection(argArr[1]);
            const arrvalue: string = argCount === 2 ? argArr[1] : argArr[2];
            matchupRange = this.getCellCollection(arrvalue);
            if (lookupRange[0] === '#REF!' || matchupRange[0] === '#REF!') {
                return this.getErrorStrings()[CommonErrors.Name];
            }
            const lookupIndex: number[] = getRangeIndexes(argArr[1]);
            const matchIndex: number[] = getRangeIndexes(arrvalue);
            const isValidLookup: boolean = lookupIndex[1] === lookupIndex[3] ? true : lookupIndex[0] === lookupIndex[2];
            const isValidMatch: boolean = matchIndex[1] === matchIndex[3] ? true : matchIndex[0] === matchIndex[2];
            if (!isValidLookup || !isValidMatch) {
                return this.getErrorStrings()[CommonErrors.NA];
            }
        }
        for (let i: number = 0; i < lookupRange.length; i++) {
            findMaxVal.push(this.getValueFromArg(lookupRange[i as number]).split(this.tic).join(''));
        }
        const num: number[] = findMaxVal.map((value: string) => { return value === '' ? NaN : Number(value); }).sort((a: number, b: number) => a - b);
        const maxVal: number = num[num.length - 1];
        const minVal: number = num[0];
        const lookupVal: number = this.parseFloat(lookupValue);
        if (!this.isNaN(lookupVal)) {
            for (let a: number = 0; a < num.length; a++) {
                checkCriteria[a as number] = num[a as number].toString().split(this.tic).join('');
                if (!isNullOrUndefined(matchupRange[a as number]) && checkCriteria[a as number] !== '' && lookupVal === this.parseFloat(checkCriteria[a as number])) {
                    result.push(this.getValueFromArg(matchupRange[a as number]).split(this.tic).join('') || '0');
                }
            }
        } else {
            for (let j: number = 0; j < lookupRange.length; j++) {
                checkCriteria[j as number] = this.getValueFromArg(lookupRange[j as number]).split(this.tic).join('');
                if (!isNullOrUndefined(matchupRange[j as number]) && lookupValue !== '' && checkCriteria[j as number] !== '') {
                    if (lookupValue.toUpperCase() === checkCriteria[j as number].toUpperCase()) {
                        result.push(this.getValueFromArg(matchupRange[j as number]).split(this.tic).join('') || '0');
                    } else if (lookupValue.indexOf('*') > -1 || lookupValue.indexOf('?') > -1) {
                        let criteriaValue: string = lookupValue;
                        if (lookupValue.indexOf('*') > -1) {
                            criteriaValue = criteriaValue.replace(/\*/g, '').trim();
                            if (this.isCellReference(criteriaValue)) {
                                criteriaValue = this.getValueFromArg(criteriaValue);
                            }
                            const asteriskIndex: number = lookupValue.indexOf('*');
                            if (lookupValue[0] === '*') { criteriaValue = '*' + criteriaValue; }
                            if (lookupValue[lookupValue.length - 1] === '*') { criteriaValue += '*'; }
                            if (asteriskIndex > 0 && asteriskIndex < lookupValue.length - 1) {
                                criteriaValue = lookupValue.substring(0, asteriskIndex) + '*' + lookupValue.substring(asteriskIndex + 1);
                            }
                        }
                        const stack: string[] = [];
                        const wildcardResult: string = this.findWildCardValue(
                            criteriaValue.toLowerCase(), checkCriteria[j as number].toLowerCase());
                        stack.push(wildcardResult);
                        stack.push(lookupValue);
                        if (this.processLogical(stack, 'equal') === this.trueValue) {
                            result.push(this.getValueFromArg(matchupRange[j as number]).split(this.tic).join('') || '0');
                        }
                    }
                }
            }
        }
        if (result.length > 0) {
            return result[result.length - 1];
        }
        if (lookupVal > maxVal && !isNullOrUndefined(matchupRange[lookupRange.length - 1])) {
            return this.getValueFromArg(matchupRange[lookupRange.length - 1]).split(this.tic).join('') || '0';
        } else if (lookupVal < minVal) {
            return this.getErrorStrings()[CommonErrors.NA];
        }
        if (findMaxVal.indexOf(lookupValue.split(this.tic).join('')) < 0 && lookupValue !== this.trueValue && lookupValue !== this.falseValue) {
            if (!this.isNaN(lookupVal) && !this.isNaN(maxVal) && !this.isNaN(minVal)) {
                const temp: number[] = [];
                for (let b: number = 0; b < num.length; b++) {
                    if (lookupVal > num[b as number]) {
                        temp.push(num[b as number]);
                    }
                }
                const index: number = temp.length - 1;
                if (!isNullOrUndefined(matchupRange[index as number]) && index >= 0) {
                    return this.getValueFromArg(matchupRange[index as number]).split(this.tic).join('') || '0';
                }
            } else if (this.isNaN(lookupVal) && lookupValue !== '' && /^[a-zA-Z!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(lookupValue)) {
                const str: string[] = findMaxVal.sort();
                const index: number = this.findClosestMatch(lookupValue.split(this.tic).join(''), str);
                if (!isNullOrUndefined(matchupRange[index as number]) && index >= 0) {
                    return this.getValueFromArg(matchupRange[index as number]).split(this.tic).join('') || '0';
                }
            }
        }
        return this.getErrorStrings()[CommonErrors.NA];
    }

    /**
     * Shared VLOOKUP / HLOOKUP evaluation helper.
     *
     * @param {string} range - Lookup argument tokens.
     * @param {boolean} isVlookup - When `true` (default), uses VLOOKUP orientation; otherwise HLOOKUP.
     * @returns {string} - Matched value or an error token.
     * @hidden
     */

    public computeVHLookup(range: string[], isVlookup?: boolean): string {
        const argArr: string[] = range;
        let isConditionalFormula: boolean;
        if (argArr && argArr[argArr.length - 1] === 'conditionalFormulaTrue') {
            isConditionalFormula = true;
            argArr.pop();
        }
        if (isNullOrUndefined(argArr) || argArr.length < 3 || argArr.length > 4) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        if (argArr[1] === '') {
            return this.getErrorStrings()[CommonErrors.NA];
        }
        let lookupValue: string = this.getValueFromArg(argArr[0]);
        if (lookupValue) {
            if (lookupValue.includes(this.tic)) {
                const lookupVal: string = lookupValue.split(this.tic).join('');
                if (lookupVal && !this.isNumber(lookupVal)) {
                    const lookupValUpper: string = lookupVal.toUpperCase();
                    if (lookupValUpper !== this.trueValue && lookupValUpper !== this.falseValue) {
                        lookupValue = lookupVal;
                    }
                }
            }
        } else {
            lookupValue = '0';
        }
        const errorStrings: string[] = this.getErrorStrings();
        if (errorStrings.indexOf(lookupValue) > -1) {
            return lookupValue;
        }
        const colIdxVal: string = (this.getValueFromArg(argArr[2]) || '0').split(this.tic).join('').toUpperCase();
        const colNumIdx: number = this.parseFloat(colIdxVal === this.trueValue ? '1' : colIdxVal);
        if (colNumIdx < 1) {
            return errorStrings[CommonErrors.Value];
        }
        let isExactMatchLookup: boolean;
        if (argArr[3]) {
            argArr[3] = this.getValueFromArg(argArr[3]).split(this.tic).join('');
            if (errorStrings.indexOf(argArr[3]) > -1) {
                return argArr[3];
            }
            const rangeLookup: string = argArr[3].toUpperCase();
            if (rangeLookup === this.falseValue || argArr[3] === '0') {
                isExactMatchLookup = true;
            } else if (!(rangeLookup === this.trueValue || argArr[3] === '1')) {
                return errorStrings[CommonErrors.Value];
            }
        }
        const rangeArg: string = argArr[1];
        const rowSepMarker: string = this.tic + 'RSEP' + this.tic;
        const isInlineArray: boolean = rangeArg.includes(rowSepMarker) ||
            (rangeArg.startsWith('(') && rangeArg.endsWith(')') && rangeArg.includes(rowSepMarker));
        if (isInlineArray) {
            const innerStr: string = rangeArg.startsWith('(') && rangeArg.endsWith(')')
                ? rangeArg.substring(1, rangeArg.length - 1) : rangeArg;
            const rowBoundary: string = this.tic + 'RSEP' + this.tic;
            const colBoundary: string = this.tic + 'CSEP' + this.tic;
            const rows: string[][] = innerStr.split(rowBoundary).map((rowStr: string) => {
                return rowStr.split(colBoundary).map((cell: string) => {
                    if (cell.startsWith(this.tic) && cell.endsWith(this.tic)) {
                        return cell.substring(1, cell.length - 1);
                    }
                    if (this.isCellReference(cell.trim())) {
                        return this.getValueFromArg(cell.trim());
                    }
                    return cell.trim();
                });
            });
            const numRows: number = rows.length;
            const numCols: number = rows[0] ? rows[0].length : 0;
            const matchColIdx: number = colNumIdx - 1;
            if (isVlookup && numCols <= matchColIdx) {
                return errorStrings[CommonErrors.Ref];
            }
            if (!isVlookup && numRows <= matchColIdx) {
                return errorStrings[CommonErrors.Ref];
            }
            const lookupValUpper: string = lookupValue.toUpperCase();
            const iterCount: number = isVlookup ? numRows : numCols;
            for (let r: number = 0; r < iterCount; r++) {
                const cellVal: string = (isVlookup ? rows[r as number][0] : rows[0][r as number]) || '';
                const isMatch: boolean = this.isNumber(lookupValue) && this.isNumber(cellVal)
                    ? this.parseFloat(lookupValue) === this.parseFloat(cellVal) : cellVal.toUpperCase() === lookupValUpper;
                if (isMatch) {
                    const matchVal: string = isVlookup
                        ? (rows[r as number][matchColIdx as number] !== undefined ? rows[r as number][matchColIdx as number] : '')
                        : (rows[matchColIdx as number] !== undefined && rows[matchColIdx as number][r as number] !== undefined
                            ? rows[matchColIdx as number][r as number] : '');
                    return matchVal !== '' ? matchVal : '';
                }
            }
            return errorStrings[CommonErrors.NA];
        }
        const rangeArr: string[] = rangeArg.split(':');
        let startIdx: number; let endIdx: number; let idx: number; let grid: Object;
        let getLookupRangeValue: (idx: number) => string; let getMatchRangeValue: () => string;
        if (this.isCellReference(rangeArr[0]) && this.isCellReference(rangeArr[1])) {
            let rowIdx: number = this.rowIndex(rangeArr[0]);
            let colIdx: number = this.colIndex(rangeArr[0]);
            let endRowIdx: number = this.rowIndex(rangeArr[1]);
            let endColIdx: number = this.colIndex(rangeArr[1]);
            if (rowIdx > endRowIdx) {
                [rowIdx, endRowIdx] = [endRowIdx, rowIdx];
            }
            if (colIdx > endColIdx) {
                [colIdx, endColIdx] = [endColIdx, colIdx];
            }
            if (!(rowIdx > 0 && endRowIdx <= maxRows && colIdx > 0 && endColIdx <= maxCols)) {
                return this.getErrorStrings()[CommonErrors.Name];
            }
            grid = this.grid;
            let sheetToken: string = '';
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
            if (argArr[1].startsWith('!')) {
                sheetToken = argArr[1].substring(0, argArr[1].replace('!', '').indexOf('!') + 2);
                if (family.tokenToParentObject !== null) {
                    this.grid = family.tokenToParentObject.get(sheetToken);
                }
            }  else if (family.parentObjectToToken !== null) {
                sheetToken = family.parentObjectToToken.get(grid);
            }
            const sheetId: number = this.getSheetId(this.grid);
            const sheetInfo: CalculateSheetInfo[] = this.getHostSheetInfo();
            if (getSheetIndexByName('Sheet' + sheetId, sheetInfo) === -1) {
                this.grid = grid;
                return errorStrings[CommonErrors.Ref];
            }
            const getCellValue: (row: number, col: number, curCell: string) => string = this.getCellValueFn(grid, this.cell, sheetId, true);
            if (isVlookup) {
                const matchIndex: number = colIdx + colNumIdx - 1;
                if (matchIndex > endColIdx) {
                    return errorStrings[CommonErrors.Ref];
                }
                startIdx = rowIdx; endIdx = endRowIdx;
                const lookupColText: string = sheetToken + getAlphalabel(colIdx);
                getLookupRangeValue = (idx: number): string => {
                    return getCellValue(idx, colIdx, lookupColText + idx);
                };
                const matchColText: string = sheetToken + getAlphalabel(matchIndex);
                getMatchRangeValue = (): string => {
                    return getCellValue(idx, matchIndex, matchColText + idx) || (isConditionalFormula ? '""' : '0');
                };
            } else {
                const matchIndex: number = rowIdx + colNumIdx - 1;
                if (matchIndex > endRowIdx) {
                    return errorStrings[CommonErrors.Ref];
                }
                startIdx = colIdx; endIdx = endColIdx;
                let matchColText: string;
                getLookupRangeValue = (idx: number): string => {
                    matchColText = sheetToken + getAlphalabel(idx);
                    return getCellValue(rowIdx, idx, matchColText + rowIdx);
                };
                getMatchRangeValue = (): string => {
                    return getCellValue(matchIndex, idx, matchColText + matchIndex) || (isConditionalFormula ? '""' : '0');
                };
            }
        } else {
            return errorStrings[CommonErrors.Value];
        }
        let result: string; let lookupRangeVal: string;
        const matchedResult: string[] | string = [];
        if (isExactMatchLookup) {
            let isMatchFound: () => boolean;
            if (this.isNumber(lookupValue)) {
                const lookupNumVal: number = this.parseFloat(lookupValue);
                isMatchFound = (): boolean => {
                    return lookupNumVal === this.parseFloat(lookupRangeVal);
                };
            } else if (lookupValue.includes('*') || lookupValue.includes('?')) {
                let criteriaValue: string = lookupValue;
                const asteriskIndex: number = lookupValue.indexOf('*');
                if (asteriskIndex > -1) {
                    criteriaValue = criteriaValue.replace(/\*/g, '').trim();
                    if (this.isCellReference(criteriaValue)) {
                        criteriaValue = this.getValueFromArg(criteriaValue);
                    }
                    if (asteriskIndex === 0) {
                        criteriaValue = '*' + criteriaValue;
                    } else if (asteriskIndex === lookupValue.length - 1) {
                        criteriaValue += '*';
                    } else {
                        criteriaValue = lookupValue.substring(0, asteriskIndex) + '*' + lookupValue.substring(asteriskIndex + 1);
                    }
                }
                criteriaValue = criteriaValue.toLowerCase();
                isMatchFound = (): boolean => {
                    return this.processLogical(
                        [this.findWildCardValue(criteriaValue, lookupRangeVal.toLowerCase()), lookupValue], 'equal') === this.trueValue;
                };
            } else {
                const lookupValUpper: string = lookupValue.toUpperCase();
                isMatchFound = (): boolean => {
                    return lookupValUpper === lookupRangeVal.toUpperCase();
                };
            }
            for (idx = startIdx; idx <= endIdx; idx++) {
                lookupRangeVal = getLookupRangeValue(idx);
                if (lookupRangeVal && isMatchFound()) {
                    matchedResult.push(getMatchRangeValue());
                }
            }
            result = matchedResult.length ? matchedResult[0] : errorStrings[CommonErrors.NA];
        } else if (lookupValue.indexOf('*') > -1 || lookupValue.indexOf('?') > -1) {
            result = errorStrings[CommonErrors.NA];
        } else {
            let matchVal: number; let checkMatchFn: () => void;
            if (this.isNumber(lookupValue)) {
                const lookupNumVal: number = this.parseFloat(lookupValue);
                const comparer: Function = createSortComparer('');
                checkMatchFn = (): void => {
                    matchVal = comparer(
                        this.isNumber(lookupRangeVal) ? this.parseFloat(lookupRangeVal) : lookupRangeVal || null, lookupNumVal);
                };
            } else {
                const collator: Intl.Collator = new Intl.Collator(
                    (<{ locale?: string }>this.parentObject).locale || 'en-US', { sensitivity:  'base' });
                checkMatchFn = (): void => {
                    matchVal = (!lookupRangeVal || this.isNumber(lookupRangeVal)) ? null : collator.compare(lookupRangeVal, lookupValue);
                };
            }
            let skipCheck: boolean;
            for (idx = startIdx; idx <= endIdx; idx++) {
                lookupRangeVal = getLookupRangeValue(idx);
                if (!skipCheck) {
                    checkMatchFn();
                    if (matchVal === 0) {
                        matchedResult.push(getMatchRangeValue());
                    } else if (matchVal < 0) {
                        matchedResult.push(getMatchRangeValue());
                    } else if (matchVal > 0 && matchedResult.length) {
                        skipCheck = true;
                    }
                }
            }
            result = matchedResult.length ? matchedResult[matchedResult.length - 1] : errorStrings[CommonErrors.NA];
        }
        this.grid = grid;
        if (isConditionalFormula && typeof result === 'string' &&
            result.indexOf(this.getParseArgumentSeparator()) !== -1) {
            return this.tic + result + this.tic;
        }
        return result;
    }

    private findClosestMatch(searchValue: string, sortedArray: string[]): number {
        let start: number = 0;
        let end: number = sortedArray.length - 1;
        while (start <= end) {
            const mid: number = Math.floor((start + end) / 2);
            const midValue: string = sortedArray[mid as number];
            const compareResult: number = this.compareStrings(searchValue.toLowerCase(), midValue.toLowerCase());
            if (compareResult === 0) {
                return mid;
            } else if (compareResult === 1) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        // If no exact match is found, return the closest match based on the entire string
        for (let i: number = start - 1; i >= 0; i--) {
            if (this.compareStrings(searchValue.toLowerCase(), sortedArray[i as number].toLowerCase()) !== -1) {
                return i;
            }
        }
        return -1; // No match found
    }

    private compareStrings(str1: string, str2: string): number {
        const minLength: number = Math.min(str1.length, str2.length);
        for (let i: number = 0; i < minLength; i++) {
            const charCode1: number = str1.charCodeAt(i);
            const charCode2: number = str2.charCodeAt(i);
            if (charCode1 < charCode2) {
                return -1;
            } else if (charCode1 > charCode2) {
                return 1;
            }
        }
        // If all characters are the same up to the length of the shorter string, compare lengths
        if (str1.length < str2.length) {
            return -1;
        } else if (str1.length > str2.length) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Applies Excel-style wildcard matching (`*`, `?`, `~`) between criteria and a cell value.
     *
     * @param {string | number | Object} lookVal - Criteria pattern.
     * @param {string} cellValue - Candidate cell text.
     * @returns {string | number} - Match marker or original values used by lookup/criteria helpers.
     * @hidden
     */

    public findWildCardValue(lookVal: string, cellValue: string): string {
        let finalText: string = '';
        if (lookVal.indexOf('?') > -1) {
            const checkRegex: RegExp = RegExp(lookVal.replace(/\?/g, '[\\s\\S]'));
            if (cellValue.length === lookVal.length && this.isNaN(this.parseFloat(cellValue))) {
                if (cellValue.match(checkRegex)) {
                    finalText = lookVal;
                } else {
                    finalText = cellValue;
                }
            } else {
                finalText = cellValue;
            }
        } else if (lookVal.indexOf('*') > -1) {
            const index: number = lookVal.indexOf('*');
            let left: string = ''; let right: string = '';
            let compRight: string = this.falseValue;
            let compLeft: string = this.falseValue;
            for (let i: number = index - 1; i >= 0; i--) {
                left = left + lookVal[i as number];
                compLeft = this.trueValue;
            }
            for (let i: number = index + 1; i < lookVal.length; i++) {
                right = right + lookVal[i as number];
                compRight = this.trueValue;
            }
            const leftVal: number = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            const rightVal: number = right === '' ? -1 : cellValue.indexOf(right);
            if (leftVal > -1 || rightVal > -1) {
                const isLeft: boolean = left.split('').reverse().join('') === cellValue.substr(0, left.length);
                const isRight: boolean = right === cellValue.substring(cellValue.length - right.length, cellValue.length);
                if (compLeft === this.trueValue && compRight === this.trueValue &&
                    this.isNaN(this.parseFloat(left)) && this.isNaN(this.parseFloat(right))) {
                    finalText = isLeft && isRight ? lookVal : cellValue;
                } else if (compLeft === this.trueValue && this.isNaN(this.parseFloat(left))) {
                    finalText = isLeft ? lookVal : cellValue;
                } else if (compRight === this.trueValue && this.isNaN(this.parseFloat(right))) {
                    finalText = isRight ? lookVal : cellValue;
                }
            } else {
                if (lookVal.startsWith('*') && lookVal.endsWith('*')) {
                    const trimmedVal: string = lookVal.slice(1, -1);
                    if (trimmedVal !== '' && cellValue.includes(trimmedVal) && this.isNaN(this.parseFloat(trimmedVal))) {
                        cellValue = lookVal;
                    }
                }
                finalText = cellValue;
            }
        }
        return finalText;
    }

    /**
     * Evaluates criteria against a criteria range and aggregates matching sum-range values.
     *
     * @param {string} criteriaRange - Criteria cells.
     * @param {string} sumRange - Values to aggregate for matches.
     * @param {string} criteria - Criteria expression.
     * @returns {string | number} - Aggregate result details used by SUMIF-family formulas.
     * @hidden
     */

    public getComputeSumIfValue(criteriaRange: string[] | string, sumRange: string[] | string, criteria: string,
                                checkCriteria: number, op: string, isAsterisk: boolean, isQuestionMark: boolean): number[] {
        let sum: number = 0;
        let count: number = 0;
        // const isFirst: boolean = isAsterisk && criteria && criteria[0] === '*';
        switch (op) {
        case this.parser.tokenEqual: {
            const criteriaValue: string = isAsterisk ? criteria.replace(/\*/g, '') : criteria;
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const sumVal: number = this.getValueFromRange(sumRange, i);
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join('')).toLowerCase();
                const val: number = this.parseFloat(value);
                if (value === criteria && val === checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                } else if (value === criteria) {
                    if (!this.isNaN(sumVal)) {
                        sum = sum + sumVal;
                        count = count + 1;
                    }
                } else if (isAsterisk && criteriaValue && value && this.isNaN(this.parseFloat(value))) {
                    const asteriskIndex: number = criteria.indexOf('*');
                    if (criteria[0] === '*' && criteriaValue.length <= value.length && criteriaValue === value.slice(value.length - criteriaValue.length, value.length)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    } else if (criteria[criteria.length - 1] === '*' && criteriaValue.length <= value.length && criteriaValue === value.slice(0, criteriaValue.length)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    } else if (asteriskIndex > -1 && value.startsWith(criteria.substr(0, asteriskIndex))
                        && value.endsWith(criteria.substr(asteriskIndex + 1))) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    }
                } else if (isAsterisk && !criteriaValue && value && this.isNaN(this.parseFloat(value))) {
                    if (!this.isNaN(sumVal)) {
                        sum = sum + sumVal;
                        count = count + 1;
                    }
                } else if (isQuestionMark && criteriaValue && value && this.isNaN(this.parseFloat(value))) {
                    const checkRegex: RegExp = RegExp(criteriaValue.replace(/\?/g, '[\\s\\S]'));
                    if (value.length === criteria.length && value.match(checkRegex)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    }
                }
            }
        }
            break;
        case this.parser.tokenLess: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val < checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
        }
            break;
        case this.parser.tokenGreater: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val > checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
        }
            break;
        case this.parser.tokenLessEq: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val <= checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
        }
            break;
        case this.parser.tokenGreaterEq: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val >= checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
        }
            break;
        case this.parser.tokenNotEqual: {
            const criteriaValue: string = isAsterisk ? criteria.replace(/\*/g, '') : criteria;
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const sumVal: number = this.getValueFromRange(sumRange, i);
                const value: string = this.getValueFromArg(criteriaRange[i as number].split(this.tic).join('')).toLowerCase();
                const val: number = this.parseFloat(value);
                if (value !== criteria && val !== checkCriteria && !isAsterisk && !isQuestionMark) {
                    const value1: string = this.getValueFromArg(sumRange[i as number].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    if (!this.isNaN(val1)) {
                        sum = sum + val1;
                        count = count + 1;
                    }
                } else if (isAsterisk && criteriaValue && value && this.isNaN(this.parseFloat(value))) {
                    const asteriskIndex: number = criteria.indexOf('*');
                    if (criteria[0] === '*' && criteriaValue.length <= value.length && criteriaValue !== value.slice(value.length - criteriaValue.length, value.length)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    } else if (criteria[criteria.length - 1] === '*' && criteriaValue.length <= value.length && criteriaValue !== value.slice(0, criteriaValue.length)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    } else if (asteriskIndex > -1 && !value.startsWith(criteria.substr(0, asteriskIndex))
                        || !value.endsWith(criteria.substr(asteriskIndex + 1))) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    }
                } else if (isAsterisk && !criteriaValue && !this.isNaN(this.parseFloat(value))) {
                    if (!this.isNaN(sumVal)) {
                        sum = sum + sumVal;
                        count = count + 1;
                    }
                } else if (isQuestionMark && criteriaValue && value && this.isNaN(this.parseFloat(value))) {
                    const checkRegex: RegExp = RegExp(criteriaValue.replace(/\?/g, '[\\s\\S]'));
                    if (value.length !== criteria.length || !value.match(checkRegex)) {
                        if (!this.isNaN(sumVal)) {
                            sum = sum + sumVal;
                            count = count + 1;
                        }
                    }
                }
            }
        }
            break;
        }
        return [sum, count];
    }

    private getValueFromRange(sumRange: string[] | string, index: number): number {
        let sumRangeVal: string | number = sumRange[index as number];
        sumRangeVal = this.getValueFromArg(sumRangeVal);
        return this.parseFloat(sumRangeVal.toString());
    }

    /**
     * Evaluates AND / OR / NOT over argument tokens.
     *
     * @param {string[]} args - Logical argument tokens.
     * @param {string} op - Operation name (`"and"`, `"or"`, or `"not"`).
     * @returns {string} - `"TRUE"`, `"FALSE"`, or an error token.
     * @hidden
     */

    public computeAndOrNot(args: string[], op: string): string {
        const isAnd: boolean = op === 'and'; const isOr: boolean = op === 'or';
        const isNot: boolean = op === 'not';
        let result: boolean = (isAnd || isNot) ? true : false;
        let value: string; let parseVal: number;
        const resultant: string[] = [];
        const ranges: string[] = args;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[i as number] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.Value];
            }
            ranges[i as number] = ranges[i as number].startsWith('n') ? ranges[i as number].slice(1) : ranges[i as number];
            if (this.isCellReference(ranges[i as number])) {
                const cells: string[] | string = this.getCellCollection(ranges[i as number]);
                for (let j: number = 0; j < cells.length; j++) {
                    if (this.getErrorStrings().indexOf(cells[j as number]) > -1) {
                        return cells[j as number];
                    } else if (cells[j as number][0] === this.tic) {
                        return this.getErrorStrings()[CommonErrors.Name];
                    }
                    value = this.getValueFromArg(cells[j as number]);
                    if (this.getErrorStrings().indexOf(value) > -1) {
                        return value;
                    }
                    parseVal = this.parseFloat(value);
                    if (value === this.falseValue || (value !== '' && parseVal === 0) || (isNot && value === '')) {
                        resultant.push(this.falseValue);
                    } else if (value === this.trueValue || !isNaN(parseVal) && value !== '') {
                        resultant.push(this.trueValue);
                    } else if (value === '' || isNaN(parseVal)) {
                        resultant.push(this.getErrorStrings()[CommonErrors.Value]);
                    }
                }
            } else {
                value = this.getValueFromArg(ranges[i as number]).toUpperCase();
                if (this.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                parseVal = this.parseFloat(value);
                value = value.split(this.tic).join('');
                if (value === this.falseValue || ranges[i as number] === '' || (value !== '' && parseVal === 0)) {
                    resultant.push(this.falseValue);
                } else if (value === this.trueValue || !isNaN(parseVal) && value !== '') {
                    resultant.push(this.trueValue);
                } else if (value === '' || isNaN(parseVal)) {
                    resultant.push(this.getErrorStrings()[CommonErrors.Value]);
                }
            }
        }
        const containsOnlyValueError: boolean = resultant.every((item: string) => item === this.getErrorStrings()[CommonErrors.Value]);
        if (containsOnlyValueError) { return this.getErrorStrings()[CommonErrors.Value]; }
        for (let j: number = 0; j < resultant.length; j++) {
            if ((isAnd || isNot) && resultant[j as number] === this.falseValue) {
                result = false;
                break;
            }
            if (isOr && resultant[j as number] === this.trueValue) {
                result = true;
                break;
            }
        }
        result = isNot ? !result : result;
        return result ? this.trueValue : this.falseValue;
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @returns {string} - to strip out the tic from the formula arguments.
     */
    // To strip out the tic from the formula arguments.
    /**
     * Strips surrounding formula string quotes (`"...`) when present.
     *
     * @param {string} text - Possibly quoted text.
     * @returns {string} - Unquoted text.
     * @hidden
     */

    public removeTics(text: string): string {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    }

    /**
     * Returns the top-left cell address from a range string.
     *
     * @param {string} range - Range such as `A1:B2`.
     * @returns {string | number} - Starting cell address.
     * @hidden
     */

    public getCellFrom(range: string): string {
        let cellRange: string = '';
        const cells: string[] = range.indexOf(':') > -1 ? range.split(':') : [range];
        //this.getCellsFromArgs(range);
        const last: number = cells.length - 1;
        const r1: number = this.rowIndex(cells[0]);
        let x: number;
        if (r1 === this.rowIndex(cells[last as number])) {
            const c1: number = this.colIndex(cells[0]);
            const c2: number = this.colIndex(cells[last as number]);
            const c: number = this.colIndex(this.cell);
            if (c >= c1 && c <= c2) {
                cellRange = getAlphalabel(c).toString() + r1.toString();
            }
        } else if (this.colIndex(cells[0]) === this.colIndex(cells[last as number])) {
            x = this.colIndex(cells[0]);
            const r2: number = this.rowIndex(cells[last as number]);
            const r: number = this.rowIndex(this.cell);
            if (r >= r1 && r <= r2) {
                cellRange = getAlphalabel(x).toString() + r.toString();
            }
        }
        return cellRange;
    }

    private computeValue(pFormula: string, refresh: boolean, isIfError?: boolean): string {
        try {
            const stack: string[] = [];
            let i: number = 0;
            let sheet: string = '';
            stack.length = 0;
            const emptyStack: string[] = [];
            const decimalSep: string = this.getParseDecimalSeparator();
            while (i < pFormula.length) {
                let uFound: boolean = pFormula[i as number] === 'u';    // for 3*-2
                if (uFound) {
                    i = i + 1; // for the cell reference cases, like A1*-A2.
                }
                if (pFormula[i as number] === this.arithMarker) {
                    i = i + 1;
                    continue;
                } else if (this.isDigit(pFormula[i as number])) {
                    let s: string = '';
                    while (i < pFormula.length && (this.isDigit(pFormula[i as number]) ||
                        pFormula[i as number] === decimalSep)) {
                        s += pFormula[i as number] === decimalSep ? '.' : pFormula[i as number];
                        i = i + 1;
                    }
                    stack.push(s);
                    if (!pFormula[i as number]) {
                        return stack.toString();
                    }
                }
                if (pFormula[i as number] === this.sheetToken) {
                    sheet = pFormula[i as number];
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i as number] !== this.sheetToken) {
                        sheet = sheet + pFormula[i as number];
                        i = i + 1;
                    }
                    if (i < pFormula.length) {
                        sheet = sheet + pFormula[i as number];
                        i = i + 1;
                    }
                } else if (this.isUpperChar(pFormula[i as number])) {
                    let s: string = '';
                    let textName: string = '';
                    while (i < pFormula.length && this.isUpperChar(pFormula[i as number])) {
                        const char: string = pFormula[i as number];
                        s = s + char;
                        i = i + 1;
                    }
                    while (i < pFormula.length && this.isDigit(pFormula[i as number])) {
                        const digit: string = pFormula[i as number];
                        s = s + digit;
                        i = i + 1;
                    }
                    if (i < pFormula.length && pFormula[i as number] === ':') {
                        s = s + pFormula[i as number];
                        i = i + 1;
                        if (i < pFormula.length && pFormula[i as number] === this.sheetToken) {
                            s = s + pFormula[i as number];
                            i = i + 1;
                            while (i < pFormula.length && pFormula[i as number] !== this.sheetToken) {
                                s = s + pFormula[i as number];
                                i = i + 1;
                            }
                        }
                        while (i < pFormula.length && this.isUpperChar(pFormula[i as number])) {
                            s = s + pFormula[i as number];
                            i = i + 1;
                        }
                        while (i < pFormula.length && this.isDigit(pFormula[i as number])) {
                            s = s + pFormula[i as number];
                            i = i + 1;
                        }
                        s = sheet + this.getCellFrom(s);
                    } else {
                        s = sheet + s;
                    }
                    const parentCellValue: string | number = this.getParentObjectCellValue(s, refresh);
                    textName = isNullOrUndefined(parentCellValue) ? '' : parentCellValue.toString();
                    sheet = '';
                    if (typeof textName === 'string' && this.getErrorStrings().indexOf(textName) > -1) {
                        return textName;
                    }
                    if (uFound) {
                        if (!this.isNaN(this.parseFloat(textName))) {
                            textName = (-(this.parseFloat(textName))).toString();
                        } else {
                            textName = '-' + textName;
                        }
                    }
                    stack.push(textName);
                    if (textName === '') {
                        emptyStack[stack.length - 1] = '0';
                    }
                } else if (pFormula[i as number] === 'q') {
                    const leftIdx: number = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    const j: number = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
                    pFormula = this.substring(pFormula, i + leftIdx + 2, j - 1);
                } else if (pFormula[i as number] === this.tic[0]) {
                    let s: string = pFormula[i as number].toString();
                    i = i + 1;
                    const isNestedFormulaVal: boolean = pFormula[i - 2] === 'n' && pFormula[i as number] === this.tic[0];
                    while (i < pFormula.length && pFormula[i as number] !== this.tic[0]) {
                        s = s + pFormula[i as number];
                        i = i + 1;
                    }
                    const textName: string = s.split(this.tic).join('');
                    if (textName === this.trueValue || textName === this.falseValue ||
                        (!this.isNaN(this.parseFloat(textName)) && textName !== '')) {
                        stack.push(this.tic + textName + this.tic);
                    } else {
                        stack.push(textName);
                        if (textName === '' && isNestedFormulaVal) {
                            emptyStack[stack.length - 1] = '0';
                        }
                    }
                    i = i + 1;
                } else if (pFormula[i as number] === '%' && stack.length > 0) {
                    const stackValue: string = stack[0];
                    const value: number = this.parseFloat(stackValue);
                    if (!this.isNaN(value)) {
                        stack.pop();
                        stack.push((value / 100).toString());
                    }
                    i = i + 1;
                } else if ((pFormula.substring(i)).indexOf(this.trueValue) === 0) {
                    stack.push(this.trueValue);
                    i += this.trueValue.length;
                } else if (pFormula.substring(i).indexOf(this.falseValue) === 0) {
                    stack.push(this.falseValue);
                    i += this.falseValue.length;
                } else if (pFormula[i as number] === this.tic[0] || pFormula[i as number] === '|') {
                    let s: string = pFormula[i as number].toString();
                    i++;
                    while (i < pFormula.length && pFormula[i as number] !== this.tic[0]) {
                        s = s + pFormula[i as number];
                        i = i + 1;
                    }
                    stack.push(s + this.tic);
                    i += 1;
                } else {
                    if (pFormula[i as number] === ' ' && i < pFormula.length - 1) {
                        i += 1;
                        continue;
                    }
                    switch (pFormula[i as number]) {
                    case '#':
                        {
                            let errIndex: number = 0;
                            if (this.getErrorStrings().indexOf(pFormula.substring(i)) > -1) {
                                if (pFormula.indexOf('!') === -1 || pFormula.substring(i).indexOf('!') === -1) {
                                    errIndex = pFormula.indexOf('#N/A') > -1 ? (pFormula.indexOf('#N/A') + 4 + i) : pFormula.indexOf('?') + 1 + i;
                                } else {
                                    errIndex = pFormula.indexOf('!') + 1 + i;
                                }
                                stack.push(this.substring(pFormula, i, errIndex - i));
                            } else {
                                errIndex = i + 1;
                                stack.push(this.substring(pFormula, i, errIndex - i));
                            }
                            i = errIndex;
                        }
                        break;
                    case 'n':
                        {
                            i = i + 1;
                            let s: string = '';
                            if (pFormula[i as number] === 'n') {
                                continue;
                            }
                            if (pFormula.substring(i).indexOf('Infinity') === 0) {
                                s = 'Infinity';
                                i += s.length;
                            } else {
                                if (pFormula[i as number] === 'u' || uFound || pFormula[i as number] === '-') {
                                    s = '-';
                                    if (!uFound) {
                                        i = i + 1;
                                    } else {
                                        uFound = false;
                                    }
                                }
                                while (i < pFormula.length && (this.isDigit(pFormula[i as number]) ||
                                    (pFormula[i as number] === decimalSep || pFormula[i as number] === '.') ||
                                    pFormula[i as number] === '\n')) {
                                    s += pFormula[i as number] === decimalSep ? '.' : pFormula[i as number];
                                    i = i + 1;
                                }
                                if (i < pFormula.length && pFormula[i as number] === '%') {
                                    i = i + 1;
                                    if (s === '') {
                                        if (stack.length > 0) {
                                            const stackValue: string = stack[0];
                                            const value: number = this.parseFloat(stackValue);
                                            if (!this.isNaN(value)) {
                                                stack.pop();
                                                stack.push((value / 100).toString());
                                            }
                                        }
                                    } else {
                                        s = (this.parseFloat(s) / 100).toString();
                                    }
                                }
                            }
                            if (s) {
                                stack.push(s);
                            }
                        }
                        break;
                    case this.parser.tokenAdd:
                        {
                            this.getValArithmetic(stack, 'add', isIfError);
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenSubtract:
                        {
                            this.getValArithmetic(stack, 'sub', isIfError);
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenMultiply:
                        {
                            this.getValArithmetic(stack, 'mul', isIfError);
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenDivide:
                        {
                            this.getValArithmetic(stack, 'div', isIfError);
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenLess:
                        {
                            this.processLogical(stack, 'less');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenGreater:
                        {
                            this.processLogical(stack, 'greater');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenGreaterEq:
                        {
                            this.processLogical(stack, 'greaterEq');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenLessEq:
                        {
                            this.processLogical(stack, 'lessEq');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenNotEqual:
                        {
                            this.processLogical(stack, 'notEq', emptyStack);
                            emptyStack.length = 0;
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenOr:
                        {
                            this.processLogical(stack, 'or');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenAnd:
                        {
                            this.processLogical(stack, 'and');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenEqual:
                        {
                            this.processLogical(stack, 'equal', emptyStack);
                            emptyStack.length = 0;
                            i = i + 1;
                        }
                        break;
                    default: {
                        return this.getErrorStrings()[CommonErrors.Value];
                    }
                    }
                }
            }
            if (stack.length === 0) {
                return '';
            } else {
                let s: string = '';
                let countValue: number = stack.length;
                while (countValue > 0) {
                    const sCheck: string = stack.pop();
                    if (this.getErrorStrings().indexOf(sCheck) > -1) {
                        return sCheck;
                    } else {
                        s = sCheck + s;
                        if (s === '' && this.isCellReference(pFormula) &&
                            this.getTreatEmptyStringAsZero()) {
                            return '0';
                        }
                        countValue--;
                    }
                }
                return s;
            }
        } catch (ex) {
            if (this.getErrorStrings().indexOf(ex) > -1 || this.formulaErrorStrings.indexOf(ex) > -1) {
                throw ex;
            }
            throw new FormulaError(this.formulaErrorStrings[FormulasErrorsStrings.InvalidExpression]);
        }
    }

    private getValArithmetic(stack: string[], operator: string, isIfError?: boolean): void {
        let isErrorString: boolean = false;
        let num1: string = stack.pop();
        const decimalCount1: number = num1.indexOf('.') !== -1 ? num1.split('.')[1].length : 0;
        const factor1: number = Math.pow(10, decimalCount1);
        let num2: string = stack.pop();
        const decimalCount2: number = num2.indexOf('.') !== -1 ? num2.split('.')[1].length : 0;
        const factor2: number = Math.pow(10, decimalCount2);
        const bigFactor: number = factor1 >= factor2 ? factor1 : factor2;
        const factors: number = factor1 * factor2;
        num1 = num1 === this.trueValue ? '1' : (num1 === this.falseValue ? '0' : num1);
        num1 = num1 === '' ? '0' : (this.getErrorStrings().indexOf(num1.toString()) < 0 ? this.parseFloat(num1 + '').toString() : num1);
        let num: number = Number(num1);
        if (isNaN(num) && !isIfError) {
            isErrorString = true;
            if (num1 === this.getErrorStrings()[CommonErrors.DivZero]) {
                stack.push(this.getErrorStrings()[CommonErrors.DivZero]);
            } else {
                stack.push(this.getErrorStrings()[CommonErrors.Value]);
            }
        }
        num2 = num2 === this.trueValue ? '1' : (num2 === this.falseValue ? '0' : num2);
        num2 = num2 === '' ? '0' : (this.getErrorStrings().indexOf(num2.toString()) < 0 ? this.parseFloat(num2 + '').toString() : num2);
        num = Number(num2);
        if (isNaN(num) && !isIfError) {
            isErrorString = true;
            if (num2 === this.getErrorStrings()[CommonErrors.DivZero]) {
                stack.push(this.getErrorStrings()[CommonErrors.DivZero]);
            } else {
                stack.push(this.getErrorStrings()[CommonErrors.Value]);
            }
        }
        if (operator === 'add' && !isErrorString) {
            stack.push(((((Number(num2) * bigFactor) + (Number(num1) * bigFactor)) / bigFactor)).toString());
        }
        if (operator === 'sub' && !isErrorString) {
            stack.push(((((Number(num2) * bigFactor) - (Number(num1) * bigFactor)) / bigFactor)).toString());
        }
        if (operator === 'mul' && !isErrorString) {
            stack.push(((((Number(num2) * factor2) * (Number(num1) * factor1)) / factors)).toString());
        }
        if (operator === 'div' && !isErrorString) {
            if (this.isNaN(this.parseFloat(num1)) || this.isNaN(this.parseFloat(num2))) {
                stack.push(this.getErrorStrings()[CommonErrors.Value]);
            } else if (this.parseFloat(num1) === 0) {
                stack.push(this.getErrorStrings()[CommonErrors.DivZero]);
            } else {
                stack.push(((Number(num2) * factors) / (Number(num1) * factors)).toString());
            }
        }
    }

    /**
     * Applies a comparison operator to values on the evaluation stack.
     *
     * @param {string | number | Object} stack - Value stack.
     * @param {string | number | Object} operator - Comparison / logical operator token.
     * @param {string | number | Object} emptyStack - Optional alternate stack for empty handling.
     * @returns {string} - `"TRUE"`, `"FALSE"`, or an error token.
     * @hidden
     */

    public processLogical(stack: string[], operator: string, emptyStack?: string[]): string {
        let val1: string;
        let val2: string;
        let value1: number | string;
        let value2: number | string;
        let isOnlyAsterisk: boolean;
        let result: string;
        let isErrorString: boolean = false;
        if (operator !== 'and' && operator !== 'equal' && operator !== 'notEq') {
            val1 = stack.pop();
            val2 = stack.pop();
            if (this.getErrorStrings().indexOf(val1) > -1) {
                result = val1;
                isErrorString = true;
            } else if (this.getErrorStrings().indexOf(val2) > -1) {
                result = val2;
                isErrorString = true;
            }
            if (this.isNaN(this.parseFloat(val1)) && this.isNaN(this.parseFloat(val2))) {
                val1 = val1.toString().toLowerCase();
                val2 = val2.toString().toLowerCase();
            }
            if (!isNullOrUndefined(val1)) {
                value1 = val1.indexOf(this.tic) > -1 ? val1 : this.parseFloat(val1);
            }
            if (!isNullOrUndefined(val2)) {
                value2 = val2.indexOf(this.tic) > -1 ? val2 : this.parseFloat(val2);
            }
            if (val1 === '*' && this.isNaN(this.parseFloat(val2)) && val2 !== '') {
                isOnlyAsterisk = true;
            }
        }
        if (operator === 'less' && !isErrorString) {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 < value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) < 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greater' && !isErrorString) {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 > value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) > 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'lessEq' && !isErrorString) {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 <= value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) <= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greaterEq' && !isErrorString) {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 >= value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) >= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'and' && !isErrorString) {
            val1 = stack.pop().toString();
            val2 = '';
            if (stack.length > 0) {
                val2 = stack.pop().toString();
            }
            if (this.getErrorStrings().indexOf(val1) > -1) {
                result = val1;
            } else if (this.getErrorStrings().indexOf(val2) > -1) {
                result = val2;
            } else {
                result = '' + val2 + val1 + '';
                result = result.split(this.tic).join('');
            }
        }
        if ((operator === 'equal' || operator === 'notEq') && !isErrorString) {
            let emptyValue1: string;
            let emptyValue2: string;
            if (emptyStack) {
                emptyValue1 = emptyStack[stack.length - 1];
                val1 = stack.pop();
                emptyValue2 = emptyStack[stack.length - 1];
                val2 = stack.pop();
            } else {
                val1 = stack.pop();
                val2 = stack.pop();
            }
            if (this.getErrorStrings().indexOf(val1) > -1) {
                result = val1;
            } else if (this.getErrorStrings().indexOf(val2) > -1) {
                result = val2;
            } else {
                val1 = (val1 === 'TRUE') ? '1' : (val1 === 'FALSE') ? '0' : val1;
                val2 = (val2 === 'TRUE') ? '1' : (val2 === 'FALSE') ? '0' : val2;
                if (this.isNaN(this.parseFloat(val1)) && this.isNaN(this.parseFloat(val2))) {
                    val1 = val1.toString().toLowerCase();
                    val2 = val2.toString().toLowerCase();
                }
                if (val1 === '*' && this.isNaN(this.parseFloat(val2)) && val2 !== '') {
                    isOnlyAsterisk = true;
                }
                if (operator === 'equal') {
                    result = val1 === val2 || (emptyValue1 !== undefined && emptyValue1 === val2) ||
                        (emptyValue2 !== undefined && emptyValue2 === val1) || isOnlyAsterisk ? this.trueValue : this.falseValue;
                } else {
                    if (isOnlyAsterisk) {
                        result = this.falseValue;
                    } else {
                        result = val2 !== val1 && (!emptyValue1 || emptyValue1 !== val2) &&
                            (!emptyValue2 || emptyValue2 !== val1) ? this.trueValue : this.falseValue;
                    }
                }
            }
        }
        if (operator === 'or' && !isErrorString) {
            result = Math.pow(this.parseFloat(value2), this.parseFloat(value1)).toString();
            result = this.isNaN(this.parseFloat(result)) ? this.getErrorStrings()[CommonErrors.Value] : result;
        }
        stack.push(result);
        return result;
    }

    /**
     * Stores and expands cells for multi-criteria IFS formulas.
     *
     * @param {string} sCell - Stored cell info payload.
     * @returns {string | number} - Expanded stored cell list.
     * @hidden
     */

    public computeStoreCells(sCell: StoredCellInfo): string[] {
        const cellValue: string | string[] = sCell.cellValue;
        const cellRanges: string[] = sCell.cellRange;
        const criterias: string[] = sCell.criteria;
        const argArr: string[] = sCell.argArray;
        let isCriteria: string = sCell.isCriteria;
        let storeCell: string[] = sCell.storedCells;
        const isCountIfs: boolean = sCell.isCountIfS === this.trueValue;
        const i: number = sCell.countVal || 0;
        const rangeLength: string[] | string = isCriteria === this.trueValue ? storeCell : cellValue;
        let tempStoredCell: string[] = []; let criteria: string;
        for (let j: number = 0; j < rangeLength.length; j++) {
            const stack: string[] = [];
            let cellVal: string = this.getValueFromArg(cellValue[j as number]);
            const arrValue: string = argArr[isCountIfs ? (1 + (i * 2)) : (2 + i)];
            const isStringVal: boolean = arrValue.startsWith(this.tic) && arrValue.endsWith(this.tic);
            criteria = this.getANDComputedValue(arrValue.trim());
            const isAsterisk: boolean = criteria.includes('*');
            const isAsteriskOnly: boolean = criteria === '*' || criteria === '<>*';
            let criteriaValue: string = isAsterisk && !isAsteriskOnly ? criteria.replace(/\*/g, '').trim() : criteria;
            let isCellReferenceValue: boolean = false;
            if (!isStringVal && this.isCellReference(criteriaValue)) {
                criteriaValue = this.getValueFromArg(criteriaValue);
                isCellReferenceValue = true;
            }
            if (isAsterisk && !isAsteriskOnly) {
                const asteriskIndex: number = criteria.indexOf('*');
                if (criteria[0] === '*') { criteriaValue = '*' + criteriaValue; }
                if (criteria[criteria.length - 1] === '*') { criteriaValue += '*'; }
                if (asteriskIndex > 0 && asteriskIndex < criteria.length - 1) {
                    criteriaValue = criteria.substring(0, asteriskIndex) + '*' + criteria.substring(asteriskIndex + 1);
                }
            }
            criteria = criteriaValue;
            let newCell: string = '';
            isCriteria = isCountIfs ? this.trueValue : isCriteria;
            if (isCriteria === this.trueValue) {
                let cell: string = '';
                let count: number = 0;
                let newCount: number = 0;
                let prevCriteria: string;
                let prevCriteriaIdx: number[];
                let prevStoreCellIdx: number[];
                let criteriaRangeIndexes: number[];
                storeCell[j as number] = isCountIfs && !i ? cellValue[j as number] : storeCell[j as number];
                cell = storeCell[j as number];
                if (i) {
                    prevCriteria = cellRanges[i - 1];
                    prevCriteriaIdx = prevCriteria.indexOf('!') > -1 ? getRangeIndexes(prevCriteria.substring(prevCriteria.lastIndexOf('!') + 1)) : getRangeIndexes(prevCriteria);
                    prevStoreCellIdx = cell.indexOf('!') > -1 ? getCellIndexes(cell.substring(cell.lastIndexOf('!') + 1)) : getCellIndexes(cell);
                    criteriaRangeIndexes = cellRanges[i as number].indexOf('!') > -1 ?
                        getRangeIndexes(cellRanges[i as number].substring(cellRanges[i as number].lastIndexOf('!') + 1)) :
                        getRangeIndexes(cellRanges[i as number]);
                }
                const isCriteriaFromOtherSheet: boolean = cell.indexOf('!') > -1;
                let isSumFromOtherSheet: boolean;
                let sumRangeSheet: string = '';
                let criteriaRangeSheet: string = '';
                if (isCriteriaFromOtherSheet) {
                    criteriaRangeSheet = cell.substring(0, cell.lastIndexOf('!') + 1);
                    cell = cell.substring(cell.lastIndexOf('!') + 1);
                }
                // convert the new cell ranges  for find in range with criteria.
                while (!this.isDigit(cell[count as number])) {
                    count = count + 1;
                }
                if (this.isCellReference(cellRanges[i as number]) && cellRanges[i as number].indexOf(':') > -1) {
                    newCell = isCountIfs && !i ? (rangeLength[j as number].indexOf('!') > -1 ? rangeLength[j as number].substring(
                        rangeLength[j as number].lastIndexOf('!') + 1) : rangeLength[j as number]) : getCellAddress(
                        criteriaRangeIndexes[0] + (prevStoreCellIdx[0] - prevCriteriaIdx[0]), criteriaRangeIndexes[1] +
                            (prevStoreCellIdx[1] - prevCriteriaIdx[1]));
                    isSumFromOtherSheet = cellRanges[i as number].indexOf('!') > -1;
                    if (isSumFromOtherSheet) {
                        sumRangeSheet = cellRanges[i as number].substring(0, cellRanges[i as number].lastIndexOf('!') + 1);
                    }
                    while (!this.isDigit(newCell[newCount as number])) {
                        newCount = newCount + 1;
                    }
                }
                let cellAlpha: string = this.substring(cell, count);
                let newCellAlpha: string = this.substring(newCell, newCount);
                const cellNumeric: string = this.substring(cell, count, cell.length - count);
                const newCellNumeric: string = this.substring(newCell, newCount, newCell.length - count);
                if (isCriteriaFromOtherSheet) {
                    cellAlpha = criteriaRangeSheet + cellAlpha;
                    newCellAlpha = criteriaRangeSheet + newCellAlpha;
                }
                if (cellNumeric !== newCellNumeric) {
                    storeCell[j as number] = this.substring(
                        storeCell[j as number], isCriteriaFromOtherSheet ? (criteriaRangeSheet.length + count) : count) + newCellNumeric;
                }
                newCell = storeCell[j as number].split(cellAlpha).join(newCellAlpha);
                if (isSumFromOtherSheet) {
                    if (newCell.indexOf('!') > -1) {
                        newCell = newCell.substring(newCell.lastIndexOf('!') + 1);
                    }
                    newCell = sumRangeSheet + newCell;
                } else {
                    newCell = newCell.substring(newCell.lastIndexOf('!') + 1);
                }
                cellVal = this.getValueFromArg(newCell);
                criteria = isCountIfs ? criteria : this.getANDComputedValue(criterias[i - 1]);
            }
            let op: string = 'equal';
            const updatedCriteria: { op: string, criteria: string } = this.getOperatorAndCriteria(criteria, op);
            op = updatedCriteria.op;
            criteria = updatedCriteria.criteria;
            if ((!isStringVal && this.isCellReference(criteria) && (!isCellReferenceValue || (newCell !== '' && !isCountIfs))) || criteria.includes(this.arithMarker)) {
                criteria = this.getValueFromArg(criteria);
            }
            if (criteria.indexOf('*') > -1 || criteria.indexOf('?') > -1) {
                cellVal = this.findWildCardValue(criteria.toLowerCase(), cellVal.toLowerCase());
            }
            stack.push(cellVal.toLowerCase());
            stack.push(criteria.toLowerCase());
            if (this.processLogical(stack, op) === this.trueValue) {
                if (isCriteria === this.falseValue) {
                    tempStoredCell.push(cellValue[j as number]);
                } else {
                    tempStoredCell.push(newCell);
                }
            }
        }
        storeCell = tempStoredCell;
        tempStoredCell = [];
        return storeCell;
    }
    /**
     * Shared SUMIFS / AVERAGEIFS evaluation entry point.
     *
     * @param {string} range - Argument tokens for the IFS aggregate.
     * @param {boolean} isCountIfs - COUNTIFS marker when applicable.
     * @param {string} isAvgIfs - AVERAGEIFS marker when applicable.
     * @returns {string} - Aggregate result or error token.
     * @hidden
     */

    public computeIfsFormulas(range: string[], isCountIfs?: string, isAvgIfs?: string): string | number {
        if (isCountIfs === this.trueValue && (isNullOrUndefined(range) || range[0] === '' || range.length < 2 || range.length > 127 ||
            range.length % 2 !== 0)) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = range;
        const cellRanges: string[] = [];
        const criterias: string[] | string = [];
        let storedCell: string[] | string = [];
        let storedCellLength: number = 0;
        let sum: number = 0;
        for (let i: number = 0; i < argArr.length; i++) {
            if ((i === 0 || i % 2 === 1) && this.isCellReference(argArr[i as number])) {
                cellRanges.push(argArr[i as number].indexOf(':') > -1 ?
                    argArr[i as number].trim() : getRangeAddress(getRangeIndexes(argArr[i as number])));
            } else {
                criterias.push(argArr[i as number].trim());
            }
        }
        const len: number[] = [];
        for (let i: number = 0; i < cellRanges.length; i++) {
            len.push(this.getCellCollection(cellRanges[i as number]).length);
        }
        for (let j: number = 0; j < len.length; j++) {
            if (len[j as number] && len[j + 1] && len[j as number] !== len[j + 1]) {
                return this.getErrorStrings()[CommonErrors.Value];
            }
        }
        for (let k: number = 0; k < criterias.length; k++) {
            if (criterias[k as number] === '' || (this.isCellReference(criterias[k as number]) &&
                this.getValueFromArg(criterias[k as number]) === '')) {
                if (isAvgIfs === this.trueValue) {
                    return this.getErrorStrings()[CommonErrors.DivZero];
                }
                return 0;
            }
        }
        let cellvalue: string[] | string;
        let isCriteria: string;
        if (isCountIfs === this.falseValue) {
            isCriteria = this.falseValue;
            cellvalue = this.getCellCollection(cellRanges[1]);
            const sCell: StoredCellInfo = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return isAvgIfs === this.trueValue ? this.getErrorStrings()[CommonErrors.DivZero] : 0;
            }
        }
        // Compare criteria and convert the new cell ranges.
        const startRange: number = isCountIfs === this.trueValue ? 0 : 2;
        for (let i: number = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i as number]);
            const sCell: StoredCellInfo = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return isAvgIfs === this.trueValue ? this.getErrorStrings()[CommonErrors.DivZero] : 0;
            }
        }
        let avgValCount: number = 0;
        const sumRangeIndexes: number[] = cellRanges[0].indexOf('!') > -1 ?
            getRangeIndexes(cellRanges[0].substring(cellRanges[0].lastIndexOf('!') + 1)) : getRangeIndexes(cellRanges[0]);
        const lastCriteria: string = cellRanges[cellRanges.length - 1];
        const criteriaRangeIndexes: number[] = lastCriteria.indexOf('!') > -1 ?
            getRangeIndexes(lastCriteria.substring(lastCriteria.lastIndexOf('!') + 1)) : getRangeIndexes(lastCriteria);
        for (let j: number = 0; j < storedCell.length; j++) {
            // convert the new cell ranges  for find sum in range 0(first range)
            let cell: string = '';
            let newCell: string = '';
            let count: number = 0;
            let newCount: number = 0;
            cell = storedCell[j as number];
            const isCriteriaFromOtherSheet: boolean = cell.indexOf('!') > -1;
            let isSumFromOtherSheet: boolean;
            let sumRangeSheet: string = '';
            let criteriaRangeSheet: string = '';
            if (isCriteriaFromOtherSheet) {
                criteriaRangeSheet = cell.substring(0, cell.lastIndexOf('!') + 1);
                cell = cell.substring(cell.lastIndexOf('!') + 1);
            }
            while (!this.isDigit(cell[count as number])) {
                count = count + 1;
            }
            if (this.isCellReference(cellRanges[0]) && cellRanges[0].indexOf(':') > -1) {
                newCell = getCellAddress(sumRangeIndexes[0] + (getCellIndexes(
                    cell)[0] - criteriaRangeIndexes[0]), sumRangeIndexes[1] + (getCellIndexes(cell)[1] - criteriaRangeIndexes[1]));
                isSumFromOtherSheet =  cellRanges[0].indexOf('!') > -1;
                if (isSumFromOtherSheet) {
                    sumRangeSheet = cellRanges[0].substring(0, cellRanges[0].lastIndexOf('!') + 1);
                }
                while (!this.isDigit(newCell[newCount as number])) {
                    newCount = newCount + 1;
                }
            }
            let cellAlpha: string = this.substring(cell, count);
            let newCellAlpha: string = this.substring(newCell, newCount);
            const cellNumeric: string = this.substring(cell, count, cell.length - count);
            const newCellNumeric: string = this.substring(newCell, newCount, newCell.length - count);
            if (isCriteriaFromOtherSheet) {
                cellAlpha = criteriaRangeSheet + cellAlpha;
                newCellAlpha = criteriaRangeSheet + newCellAlpha;
            }
            if (cellNumeric !== newCellNumeric) {
                storedCell[j as number] = this.substring(
                    storedCell[j as number], isCriteriaFromOtherSheet ? (criteriaRangeSheet.length + count) : count) + newCellNumeric;
            }
            cellvalue = storedCell[j as number].split(cellAlpha).join(newCellAlpha);
            if (isSumFromOtherSheet) {
                if (cellvalue.indexOf('!') > -1) {
                    cellvalue = cellvalue.substring(cellvalue.lastIndexOf('!') + 1);
                }
                cellvalue = sumRangeSheet + cellvalue;
            } else {
                cellvalue = cellvalue.substring(cellvalue.lastIndexOf('!') + 1);
            }
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            } else {
                const argValue: string = this.getValueFromArg(cellvalue);
                const newArgValue: number = parseFloat(argValue === '' && isAvgIfs !== this.trueValue ? '0' : argValue);
                if (this.isNumber(newArgValue)) {
                    avgValCount++;
                    sum = sum + newArgValue;
                }
            }
        }
        if (isAvgIfs === this.trueValue) { sum = sum / avgValCount; }
        return sum;
    }

    /**
     * Shared COUNTIFS evaluation entry point.
     *
     * @param {string} range - COUNTIFS argument tokens.
     * @returns {string} - Count result or error token.
     * @hidden
     */

    public computeCountIfsFormulas(range: string[]): string | number {
        const prevGrid: Object = this.grid;
        if (isNullOrUndefined(range) || range[0] === '' || range.length < 2 || range.length > 127 ||
            range.length % 2 !== 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        const argArr: string[] = range;
        const cellRanges: string[] = [];
        const criterias: string[] | string = [];
        for (let i: number = 0; i < argArr.length; i++) {
            if (i % 2 === 0 && this.isCellReference(argArr[i as number])) {
                cellRanges.push(argArr[i as number].indexOf(':') > -1 ?
                    argArr[i as number].trim() : getRangeAddress(getRangeIndexes(argArr[i as number])));
            } else {
                criterias.push(argArr[i as number].trim());
            }
        }
        if (cellRanges.length !== criterias.length) {
            return this.getErrorStrings()[CommonErrors.Value];
        }
        const rangeIndexesArr: { startRow: number, startCol: number, endRow: number, endCol: number,
            getCellValue: (row: number, col: number, curCell: string) => string, grid: Object }[] = [];
        let grid: Object = this.grid;
        for (let i: number = 0; i < cellRanges.length; i++) {
            const [startRow, startCol, endRow, endCol] = getRangeIndexes(cellRanges[i as number]);
            let sheetToken: string = '';
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
            if (cellRanges[i as number].startsWith('!')) {
                sheetToken = cellRanges[i as number].substring(0, cellRanges[i as number].replace('!', '').indexOf('!') + 2);
                if (family.tokenToParentObject !== null) {
                    grid = family.tokenToParentObject.get(sheetToken);
                }
            }  else if (family.parentObjectToToken !== null) {
                sheetToken = family.parentObjectToToken.get(grid);
            }
            this.grid = grid;
            const sheetId: number = this.getSheetId(grid);
            const sheetInfo: CalculateSheetInfo[] = this.getHostSheetInfo();
            if (getSheetIndexByName('Sheet' + sheetId, sheetInfo) === -1) {
                this.grid = prevGrid;
                return this.getErrorStrings()[CommonErrors.Ref];
            }
            const getCellValue: (row: number, col: number, curCell: string) => string = this.getCellValueFn(grid, this.cell, sheetId, true);
            if (rangeIndexesArr.length > 0) {
                const baseRange: { startRow: number, startCol: number, endRow: number,
                    endCol: number } = rangeIndexesArr[rangeIndexesArr.length - 1];
                const baseRowCount: number = baseRange.endRow - baseRange.startRow + 1;
                const baseColCount: number = baseRange.endCol - baseRange.startCol + 1;
                if ((endRow - startRow + 1) !== baseRowCount || (endCol - startCol + 1) !== baseColCount) {
                    return this.getErrorStrings()[CommonErrors.Value];
                }
            }
            rangeIndexesArr.push({ startRow, startCol, endRow, endCol, getCellValue, grid });
        }
        for (let k: number = 0; k < criterias.length; k++) {
            if (criterias[k as number] === '') {
                this.grid = prevGrid;
                return 0;
            }
        }
        let filteredCells: {rowIdx: number, colIdx: number}[] = [];
        for (let i: number = 0; i < rangeIndexesArr.length; i++) {
            this.grid = prevGrid;
            let criteria: string = criterias[i as number];
            const isStringVal: boolean = criteria.startsWith(this.tic) && criteria.endsWith(this.tic);
            criteria = this.getANDComputedValue(criteria.trim());
            const isAsterisk: boolean = criteria.includes('*');
            const isAsteriskOnly: boolean = criteria === '*' || criteria === '<>*';
            let criteriaValue: string = isAsterisk && !isAsteriskOnly ? criteria.replace(/\*/g, '').trim() : criteria;
            let isCellReferenceValue: boolean = false;
            if (!isStringVal && this.isCellReference(criteriaValue)) {
                criteriaValue = this.getValueFromArg(criteriaValue);
                isCellReferenceValue = true;
            }
            if (isAsterisk && !isAsteriskOnly) {
                const asteriskIndex: number = criteria.indexOf('*');
                if (criteria[0] === '*') { criteriaValue = '*' + criteriaValue; }
                if (criteria[criteria.length - 1] === '*') { criteriaValue += '*'; }
                if (asteriskIndex > 0 && asteriskIndex < criteria.length - 1) {
                    criteriaValue = criteria.substring(0, asteriskIndex) + '*' + criteria.substring(asteriskIndex + 1);
                }
            }
            criteria = criteriaValue;
            let op: string = 'equal';
            const updatedCriteria: { op: string, criteria: string } = this.getOperatorAndCriteria(criteria, op);
            op = updatedCriteria.op;
            criteria = updatedCriteria.criteria;
            if ((!isStringVal && this.isCellReference(criteria) && !isCellReferenceValue) || criteria.includes(this.arithMarker)) {
                criteria = this.getValueFromArg(criteria);
            }
            const hasWildCards: boolean = criteria.indexOf('*') > -1 || criteria.indexOf('?') > -1;
            const { startRow, startCol, endRow, endCol, getCellValue } = rangeIndexesArr[i as number];
            const rangeGrid: Object = rangeIndexesArr[i as number].grid;
            this.grid = rangeGrid;
            let cellVal: string;
            if (i === 0) {
                for (let r: number = startRow; r <= endRow; r++) {
                    for (let c: number = startCol; c <= endCol; c++) {
                        cellVal = getCellValue(r + 1, c + 1, getCellAddress(r, c));
                        if (hasWildCards) {
                            cellVal = this.findWildCardValue(criteria.toLowerCase(), cellVal.toLowerCase());
                        }
                        if (this.processLogical([cellVal.toLowerCase(), criteria.toLowerCase()], op) === this.trueValue) {
                            filteredCells.push({ rowIdx: r, colIdx: c });
                        }
                    }
                }
            } else {
                const storedCells: { rowIdx: number, colIdx: number }[] = filteredCells;
                const previousRangeIdx: { startRow: number, startCol: number, endRow: number, endCol: number,
                    getCellValue: (row: number, col: number, curCell: string) => string } = rangeIndexesArr[i as number - 1];
                filteredCells = [];
                for (let j: number = 0; j < storedCells.length; j++) {
                    const updatedCell: { rowIdx: number, colIdx: number } = storedCells[j as number];
                    updatedCell.rowIdx = startRow + (updatedCell.rowIdx - previousRangeIdx.startRow);
                    updatedCell.colIdx = startCol + (updatedCell.colIdx - previousRangeIdx.startCol);
                    cellVal = getCellValue(updatedCell.rowIdx + 1, updatedCell.colIdx + 1,
                                           getCellAddress(updatedCell.rowIdx, updatedCell.colIdx));
                    if (hasWildCards) {
                        cellVal = this.findWildCardValue(criteria.toLowerCase(), cellVal.toLowerCase());
                    }
                    if (this.processLogical([cellVal.toLowerCase(), criteria.toLowerCase()], op) === this.trueValue) {
                        filteredCells.push({ rowIdx: updatedCell.rowIdx, colIdx: updatedCell.colIdx });
                    }
                }
            }
            if (filteredCells.length === 0) {
                this.grid = prevGrid;
                return 0;
            }
        }
        this.grid = prevGrid;
        return filteredCells.length;
    }

    private getOperatorAndCriteria(rawCriteria: string, op: string): { op: string, criteria: string } {
        let criteria: string = rawCriteria;
        if (criteria.startsWith('<=')) {
            op = 'lessEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('>=')) {
            op = 'greaterEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<>')) {
            op = 'notEq';
            criteria = criteria.substring(2);
        } else if (criteria.startsWith('<')) {
            op = 'less';
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('>')) {
            op = 'greater';
            criteria = criteria.substring(1);
        } else if (criteria.startsWith('=')) {
            op = 'equal';
            criteria = criteria.substring(1);
        }
        return { op, criteria };
    }

    private processNestedFormula(pText: string, sFormula: string, fResult: string | number): string {
        if (fResult && !fResult.toString().includes('"')) {
            const formulaEndIdx: number = pText.indexOf(sFormula) + sFormula.length;
            if (pText[formulaEndIdx as number] === '"' && this.getErrorStrings().indexOf(fResult.toString()) < 0 &&
                !this.isNumber(fResult) && fResult !== this.trueValue && fResult !== this.falseValue) {
                return pText.split(sFormula).join('"' + fResult + '"');
            }
        }
        return pText.split(sFormula).join('n' + fResult);
    }

    /**
     * Returns whether `value` is `NaN` after numeric coercion.
     *
     * @hidden
     * @param {string | number | boolean | Object} value - Value to test.
     * @returns {number} - `true` when not a number.
     */

    public isNaN(value: string | number): boolean {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    }

    /**
     * Returns whether `val` is numeric (including numeric strings).
     *
     * @hidden
     * @param {string | number} val - Value to test.
     * @returns {number} - `true` when numeric.
     */

    public isNumber(val: string | number): boolean {
        return val as number - parseFloat(val as string) >= 0;
    }

    /**
     * Converts an OLE Automation (Excel) serial date to a JavaScript `Date`.
     *
     * @hidden
     * @param {string | number | Object} doubleNumber - Excel serial date/time.
     * @returns {Date | Object} - JavaScript `Date`.
     */

    public fromOADate(doubleNumber: number): Date {
        doubleNumber = (doubleNumber > 0 && doubleNumber < 1) ? (1 + doubleNumber) : (doubleNumber === 0) ? 1 : doubleNumber;
        if (doubleNumber > 60) {
            doubleNumber -= 1; // Due to leap year issue of 1900 in MSExcel.
        }
        const result: Date = new Date('01/01/1900');
        const resultDateUTC: number = Date.UTC(result.getFullYear(), result.getMonth(), result.getDate(), result.getHours(),
                                               result.getMinutes(), result.getSeconds(), result.getMilliseconds());
        return new Date(new Date(((doubleNumber - 1) * (this.millisecondsOfaDay)) + resultDateUTC).toUTCString().replace(' GMT', ''));
    }

    /**
     * Builds an Excel serial date from year, month, and day components.
     *
     * @hidden
     * @param {number} year - Full year.
     * @param {number} month - Month number (1–12; Excel-style overflow allowed).
     * @param {number} day - Day of month (Excel-style overflow allowed).
     * @returns {number} - Excel serial date number.
     */

    public getSerialDateFromDate(year: number, month: number, day: number): number {
        let days: number = 0;
        if (year < 1900) {
            year += 1900;
        }
        let isValidMonth: boolean = false;
        while (!isValidMonth) {
            while (month > 12) {
                year++;
                month -= 12;
            }
            while (month < 1) {
                month += 12;
                year--;
            }
            isValidMonth = true;
            let tempDay: number = new Date(year, month, 1, -1).getDate();
            while (day > tempDay) {
                tempDay = new Date(year, month, 1, -1).getDate();
                month++;
                day -= tempDay;
                isValidMonth = false;
            }
            if (day < 1) {
                month--;
                if (month < 1) {
                    month = 12;
                    year--;
                }
                tempDay = new Date(year, month, 1, -1).getDate();
                day = tempDay + day;
                isValidMonth = false;
            }
        }
        const dateTime: number = Date.parse(`${year}/${month}/${day}`);
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    }

    /**
     * Converts a serial time fraction (or time string) to a `Date`.
     *
     * @param {string | number | boolean | Object} value - Time serial or text.
     * @returns {Date | Object} - `Date` representing the time of day.
     * @hidden
     */

    public intToTime(value: string | number): Date {
        const val: string[] | number[] = value.toString().split('.');
        if (!isNullOrUndefined(val[1])) {
            value = parseFloat(val[0] + 1 + '.' + val[1]) || value;
        }
        return this.intToDate(value.toString());
    }

    /**
     * Converts a JavaScript `Date` to an Excel OLE Automation serial number.
     *
     * @hidden
     * @param {string | number | Object} dateTime - Date/time to convert.
     * @param {boolean} isTime - When `true`, includes the time fraction.
     * @param {boolean} isTimeOnly - When `true`, treats the value as time without a date component.
     * @returns {number} - Excel serial number.
     */

    public toOADate(dateTime: Date, isTime?: boolean, isTimeOnly?: boolean): number {
        const startDate: Date = new Date('01/01/1900');
        const date: Date = isDateTime(dateTime) ? dateTime : new Date(dateTime);
        const startDateUTC: number = Date.UTC( startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(),
                                               startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
        const dateUTC: number = Date.UTC( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
                                          date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        const diffDays: number = ((dateUTC - startDateUTC) / (1000 * 3600 * 24));
        return (isTime ? diffDays : parseInt(diffDays.toString(), 10)) + (isTimeOnly ? 0 : (diffDays > 60 ? 2 : 1));
    }

    /**
     * Normalizes a date string for calculation.
     *
     * @param {number | string} date - Date text.
     * @returns {string} - Normalized date string.
     * @hidden
     */

    public calculateDate(date: string): string {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    }

    /**
     * Returns whether `s` is `null`, `undefined`, or an empty string.
     *
     * @hidden
     * @param {number | string} s - Text to test.
     * @returns {string | number} - `true` when empty.
     */

    public isTextEmpty(s: string): boolean {
        return s === null || s === '';
    }

    /**
     * Returns whether `text` consists only of digit characters `0`–`9`.
     *
     * @hidden
     * @param {string} text - Text to test.
     * @returns {string | number} - `true` when all characters are digits.
     */

    public isDigit(text: string): boolean {
        const charCode: number = text.charCodeAt(0);
        return charCode > 47 && charCode < 58;
    }

    /**
     * Evaluates a single AND condition token to `"TRUE"` / `"FALSE"`.
     *
     * @param {boolean | string | number} condition - Condition expression or cell token.
     * @returns {string} - Logical result string.
     * @hidden
     */

    public getANDComputedValue(condition: string): string {
        if (condition.startsWith(this.arithMarker) && condition.includes('c')) {
            condition = this.getValueFromArg(condition);
        }
        return condition.split(this.tic).join('');
    }

    private findLastIndexOfq(fString: string): number {
        let lastIndexOfq: number = fString.lastIndexOf('q');
        const lastIndexOflLeftBracket: number = fString.lastIndexOf(this.leftBracket);
        while (lastIndexOflLeftBracket < lastIndexOfq) {
            lastIndexOfq = fString.substring(0, lastIndexOfq).lastIndexOf('q');
        }
        return lastIndexOfq;
    }

    /**
     * Resolves a formula argument token to its computed display/value string.
     *
     * Handles cell references, nested formulas, literals, and named ranges.
     *
     * @hidden
     * @param {string | number} val - Argument token from the parser.
     * @param {boolean} isUnique - UNIQUE formula context.
     * @param {boolean} isIfError - IFERROR/IFNA context.
     * @param {boolean} isSubtotal - SUBTOTAL context.
     * @param {boolean} isIFFormula - IF formula context.
     * @returns {string} - Resolved value string.
     */

    public getValueFromArg(val: string, isUnique?: boolean, isIfError?: boolean, isSubtotal?: boolean, isIFFormula?: boolean): string {
        val = val.trim();
        if (!val || this.getErrorStrings().indexOf(val) > -1) {
            return val;
        }
        const firstChar: string = val[0];
        if (firstChar === this.tic || firstChar === this.singleTic) {
            let parsedVal: string = val.split(this.tic).join('');
            if (this.isNaN(this.parseFloat(parsedVal)) && !(isIFFormula && firstChar === this.tic && val.endsWith(this.tic))) {
                const dateTime: Date = this.isDate(parsedVal);
                if (dateTime && !this.isNaN(dateTime.getDate())) {
                    return this.toOADate(dateTime, true).toString();
                }
            }
            if (val.endsWith(this.tic)) {
                const decimalSep: string = this.getParseDecimalSeparator();
                if (decimalSep !== '.' && parsedVal.includes(decimalSep)) {
                    parsedVal = parsedVal.replace(decimalSep, '.');
                    if (this.isNumber(parsedVal)) {
                        val = parsedVal;
                    }
                }
            }
            return val;
        } else if (firstChar === 'u' && val.includes(this.arithMarker)) {
            // To parse - sign with brackets, cell references and nested formulas in the formula arguments. Ex: -(I13+I14+I12)/(-D2+D1) as arguments in formulas.
            val = this.parser.parseSimpleOperators(val.split('u').join('0-'), [this.parser.tokenSubtract], ['-']);
        } else {
            const isFirstCharUpper: boolean = this.isUpperChar(firstChar);
            if (!isFirstCharUpper) {
                const decimalSep: string = this.getParseDecimalSeparator();
                if (this.isDigit(firstChar) || firstChar === decimalSep || firstChar === '-' || firstChar === 'n') {
                    if (firstChar === 'n') {
                        val = val.substring(1);
                        if (val.indexOf('"n') > - 1) {
                            val = val.replace('"n', '"');
                        }
                    }
                    if (decimalSep !== '.' && val.includes(decimalSep)) {
                        const parsedVal: string = val.replace(decimalSep, '.');
                        if (this.isNumber(parsedVal)) {
                            val = parsedVal;
                        }
                    }
                    return val;
                }
            }
        }
        const tokenAvail: boolean = firstChar === this.sheetToken;
        if (tokenAvail || (this.isUpperChar(firstChar) && !['+', '-', '/', '*', ')', ')', '{'].some((opr: string) => val.includes(opr)))) {
            const isCellRef: boolean = this.isCellReference(val);
            if (isCellRef && !tokenAvail) {
                const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
                if (family.sheetNameToParentObject !== null && family.parentObjectToToken.has(this.grid)) {
                    val = family.parentObjectToToken.get(this.grid) + val;
                }
            }
            if (val === this.cell) {
                const dependent: string[] = this.getDependentCells().get(val);
                if (dependent != null && dependent.indexOf(val) > -1) {
                    this.arrayRemove(dependent, val);
                }
                if (!this.getDependentFormulaCells().has(this.cell)) {
                    this.clearFormulaDependentCells(this.cell);
                }
                if (!isUnique) {
                    throw new FormulaError(this.formulaErrorStrings[FormulasErrorsStrings.CircularReference]);
                }
            }
            const cellValue: string | number = this.getParentObjectCellValue(val, false, isUnique, isSubtotal);
            const result: string = isNullOrUndefined(cellValue) ? '' : cellValue.toString();
            if (isCellRef) {
                this.updateDependentCell(val);
            }
            return result;
        } else {
            return this.computeValue(val, false, isIfError);
        }
    }

    /**
     * Attempts to interpret `date` as a JavaScript `Date`.
     *
     * @hidden
     * @param {number | string} date - Date instance, serial, or valid text.
     * @returns {Date | Object} - `Date` when recognized; otherwise a false result used by callers.
     */

    public isDate(date: any): Date {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            let dateVal: Date;
            if (typeof date === 'string') {
                dateVal = this.checkDateFormat(date, false, true);
            } else {
                dateVal = new Date(Date.parse(date));
            }
            if (dateVal >= this.dateTime1900) {
                return dateVal;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
     * Parses a date-like value into a `Date` or intermediate representation.
     *
     * @param {number | string} date - Value to parse.
     * @returns {string | number} - Parsed date information.
     * @hidden
     */

    public parseDate(date: any): any {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            const d: number = parseInt(date, 10);
            if (d < 0) {
                return this.getErrorStrings()[CommonErrors.Num];
            }
            if (d <= 60) {
                return new Date(this.dateTime1900.getTime() + (d - 1) * 86400000);
            }
            return new Date(this.dateTime1900.getTime() + (d - 2) * 86400000);
        }
        if (typeof date === 'string') {
            date = this.checkDateFormat(date, true);
            if (!this.isNaN(date)) {
                return date;
            }
        }
        return this.getErrorStrings()[CommonErrors.Value];
    }

    /**
     * Validates and parses a date string using engine/host date rules.
     *
     * @param {number | string} date - Date text.
     * @param {string | number | Object} pvtParse - Private parse mode.
     * @param {string | number | Object} fromIsDate - When called from {@link isDate}.
     * @returns {Date | Object} - Parsed `Date` when valid.
     * @hidden
     */

    public checkDateFormat(date: string, pvtParse?: boolean, fromIsDate?: boolean): Date {
        const host: ICalculateHost = this.parentObject as ICalculateHost;
        if (host && typeof host.getModuleName === 'function' && host.getModuleName() === 'spreadsheet') {
            const dateEventArgs: CalculateDateParseResult = this.hostParseDate(date);
            if (dateEventArgs.isDate) {
                return dateEventArgs.dateObj;
            } else if (fromIsDate && !dateEventArgs.isTime) {
                return new Date(NaN);
            }
        }
        if (this.getErrorStrings().indexOf(date) > -1) {
            return new Date(NaN);
        }
        if (!pvtParse) {
            return new Date(Date.parse(date));
        }
        return new Date(date);
    }

    /**
     * Returns whether `args` looks like a valid cell or range reference.
     *
     * @hidden
     * @param {string[]} args - Text to test.
     * @returns {string} - `true` when the text is a cell/range reference.
     */

    public isCellReference(args: string): boolean {
        args = args.trim();
        if (args === '') {
            return false;
        }
        args = this.setTokensForSheets(args);
        const sheetToken1: string = this.getSheetToken(args);
        let containsBoth: boolean = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join('');
        }
        let isAlpha: boolean = false;
        let isNum: boolean = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        const charArray: string[] = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
        for (let c: number = 0; c < charArray.length; c++) {
            if (this.isChar(charArray[c as number])) {
                isAlpha = true;
            } else if (this.isDigit(charArray[c as number])) {
                isNum = true;
            } else if (charArray[c as number] === ':') {
                if (isAlpha && isNum) {
                    containsBoth = true;
                }
                isAlpha = false;
                isNum = false;
            } else {
                return false;
            }
        }
        if (args.indexOf(':') > -1 && args.indexOf(this.tic) === -1) {
            if (((containsBoth && isAlpha && isNum) || (((isAlpha && !isNum) || (!isAlpha && isNum)) && !containsBoth))) {
                return true;
            }
            else {
                return false;
            }
        }
        if (isAlpha && isNum && args.indexOf(this.tic) === -1 && this.isValidCell(args)) {
            return true;
        }
        return false;
    }

    /**
     * Rewrites sheet names in formula text to internal sheet tokens.
     *
     * @param {string} text - Formula text containing sheet names.
     * @returns {string} - Text with sheet tokens substituted.
     * @hidden
     */

    public setTokensForSheets(text: string): string {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        const sortedSheetNamesCollection: string[] = this.getSortedSheetNames();
        if (sortedSheetNamesCollection != null) {
            for (let n: number = 0; n < sortedSheetNamesCollection.length; n++) {
                let token: string = family.sheetNameToToken.get(sortedSheetNamesCollection[n as number]);
                token = token.split(this.sheetToken).join(this.tempSheetPlaceHolder);
                let s: string = this.singleTic + 'SHEET' + sortedSheetNamesCollection[n as number] + this.singleTic + this.sheetToken;
                if (text.indexOf(s) === -1) {
                    s = 'SHEET' + sortedSheetNamesCollection[n as number] + this.sheetToken;
                }
                text = text.split(s).join(token);
                s = sortedSheetNamesCollection[n as number] + this.sheetToken;
                text = text.split(s).join(token);
            }
        }
        text = text.split(this.tempSheetPlaceHolder).join(this.sheetToken);
        if (text.indexOf('!!') > -1) {
            text = text.replace('!!', '!');
            const textSplit: string[] = text.split('!');
            textSplit[1] = (parseInt(textSplit[1], 10) + 1).toString();
            text = textSplit.join('!');
        }
        return text;
    }

    private getParentObjectCellValue(val: string, refresh: boolean, isUnique?: boolean, isSubtotal?: boolean): string | number {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        const tokenIdx: number = val.lastIndexOf(this.sheetToken);
        const grid: Object = this.grid;
        let cellRef: string;
        if (tokenIdx > -1) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
            if (family.tokenToParentObject !== null) {
                this.grid = family.tokenToParentObject.get(val.substring(0, tokenIdx + 1));
                cellRef = val.substring(tokenIdx + 1);
            } else {
                return this.getErrorStrings()[CommonErrors.Value];
            }
        } else {
            let j: number = 0;
            while (j < val.length && this.isChar(val[j as number])) {
                j++;
            }
            if (j === val.length) {
                return val === '' ? this.getErrorStrings()[CommonErrors.Value] : this.getErrorStrings()[CommonErrors.Name];
            } else {
                cellRef = val;
                const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
                if (family.isSheetMember && family.parentObjectToToken != null) {
                    val = family.parentObjectToToken.get(this.grid) + val;
                }
            }
        }
        if (this.isDigit(cellRef[0])) {
            const alphabetStartIdx: number = cellRef.search(/[a-zA-Z]/);
            if (alphabetStartIdx > 0) {
                cellRef = cellRef.substring(alphabetStartIdx, cellRef.length) + cellRef.substring(0, alphabetStartIdx);
            }
        }
        const row: number = this.rowIndex(cellRef);
        const col: number = this.colIndex(cellRef);
        let result: string | number;
        if (!(row > 0 && row <= maxRows && col > 0 && col <= maxCols)) {
            result = this.getErrorStrings()[CommonErrors.Name];
        } else {
            const sheetId: number = this.getSheetId(this.grid);
            const sheetInfo: CalculateSheetInfo[] = this.getHostSheetInfo();
            if (sheetInfo.length && getSheetIndexByName('Sheet' + sheetId, sheetInfo) === -1) {
                this.grid = grid;
                return this.getErrorStrings()[CommonErrors.Ref];
            }
            result = this.getCellValueFn(grid, this.cell, sheetId, false, refresh, isUnique, isSubtotal)(row, col, val);
        }
        this.grid = grid;
        return isNullOrUndefined(result) ? '' : result;
    }

    /**
     * Returns a function that reads a cell value for the active grid context.
     *
     * @param {Object} grid - Grid / parent object providing cell values.
     * @param {string} actCell - Active cell reference for dependency tracking.
     * @param {string | number | Object} sheetId - Sheet id for the grid.
     * @param {string} updateDependentCell - When `true`, records dependents while reading.
     * @param {string | number | Object} refresh - Whether to refresh computed values while reading.
     * @param {boolean} isUnique - UNIQUE formula context.
     * @param {boolean} isSubtotal - SUBTOTAL formula context.
     * @returns {string} - Cell value getter `(row, col, curCell) => string`.
     * @hidden
     */
    public getCellValueFn(
        grid: Object, actCell: string, sheetId: number, updateDependentCell?: boolean, refresh?: boolean, isUnique?: boolean,
        isSubtotal?: boolean): (row: number, col: number, curCell: string) => string {
        let fromCell: string = actCell;
        if (fromCell) {
            fromCell = grid === this.grid ? '' :
                fromCell + ',' + (typeof grid === 'string' && Number(grid) > -1 ? grid : this.getSheetID(grid));
        }
        const getValueRowCol: Function = (<{ getValueRowCol?: Function }>this.parentObject).getValueRowCol.bind(this.parentObject) ||
            this.getValueRowCol.bind(this);
        return (row: number, col: number, curCell: string): string => {
            if (actCell === curCell && !isUnique) {
                throw this.formulaErrorStrings[FormulasErrorsStrings.CircularReference];
            }
            this.cell = curCell;
            let val: string | number = getValueRowCol(sheetId, row, col, fromCell, refresh, isUnique, isSubtotal);
            if (isNullOrUndefined(val)) {
                val = '';
            } else {
                val = val.toString();
                const decimalSep: string = this.getParseDecimalSeparator();
                if (decimalSep !== '.' && val.includes(decimalSep)) {
                    const parsedVal: string = val.replace(decimalSep, '.');
                    if (this.isNumber(parsedVal)) {
                        val = parsedVal;
                    }
                }
            }
            this.cell = actCell;
            if (updateDependentCell) {
                this.updateDependentCell(curCell);
            }
            return val;
        };
    }

    private isValidCell(args: string): boolean {
        const digitStartIdx: number = args.search(/\d/);
        if (digitStartIdx === 0) {
            const alphabetStartIdx: number = args.search(/[a-zA-Z]/);
            args = args.substring(alphabetStartIdx, args.length) + args.substring(0, alphabetStartIdx);
        }
        const row: number = this.rowIndex(args);
        const col: number = this.colIndex(args);
        return row > 0 && row <= maxRows && col > 0 && col <= maxCols;
    }

    /**
     * Returns the numeric sheet id for a registered grid object.
     *
     * @param {Object} grd - Grid / parent object.
     * @returns {string | number} - Sheet id.
     * @hidden
     */

    public getSheetId(grd: Object): number {
        return grd && typeof grd === 'string' && Number(grd) > -1 ? Number(grd) : this.getSheetID(grd) + 1;
    }

    /**
     * Getting the formula result.
     *
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns {string} - Getting the formula result.
     */

    /**
     * Reads a cell value from a grid at 1-based row/column indexes.
     *
     * @param {Object} grid - Grid / parent object.
     * @param {number} row - 1-based row index.
     * @param {number} col - 1-based column index.
     * @returns {string} - Cell value as a string.
     */
    public getValueRowCol(grid: Object, row: number, col: number): string {
        const address: string = (this.convertAlpha(col) + row.toString()).toUpperCase();
        if (this.storedData.has(address)) {
            const addressValue: string | number = this.getKeyValue(address);
            return isNullOrUndefined(addressValue) ? '' : addressValue.toString();
        }
        const mappedKey: string = this.rowsToKeyMap.get(row);
        if (isNullOrUndefined(mappedKey)) {
            return '';
        }
        const key: string = mappedKey.toString();
        const keyUpper: string = key.toUpperCase();
        // Row map is insertion-order based; ignore when it points at a different A1 cell.
        if (this.isCellReference(keyUpper) && keyUpper !== address) {
            return '';
        }
        // Avoid re-entering a formula key already on the getKeyValue evaluation stack.
        if (this.evaluatingKeys.has(keyUpper)) {
            return '';
        }
        let result: string | number = this.getKeyValue(key);
        if (isNullOrUndefined(result)) {
            return '';
        }
        result = result.toString();
        if (result !== '' && result[result.length - 1] === '%' && result.length > 1) {
            const d: number = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    }

    /**
     * Registers a custom formula in the library.
     *
     * @param {string} formulaName - Excel-facing function name to register.
     * @param {string} functionName - Handler function, or a global function name string.
     * @param {string | number | Object} formulaDescription - Description shown in Insert Function UI.
     * @param {string} category - Category label for Insert Function UI.
     * @param {string} [syntax] - Syntax information displayed along with the formula description.
     *
     * @example
     * ```ts
     * engine.defineFunction('DOUBLE', (x) => Number(x) * 2, 'Doubles a number', 'Custom');
     * engine.defineFunction('DOUBLE', (x) => Number(x) * 2, 'Doubles a number', 'Custom', 'DOUBLE(number)');
     * ```
     * @returns {void}
     */

    public defineFunction(formulaName: string, functionName: string | Function, formulaDescription: string,
                          category: string, syntax?: string): void {
        if (typeof functionName === 'string') {
            functionName = getValue(functionName, window);
        }
        formulaName = formulaName.toUpperCase();
        this.libraryFormulas.set(formulaName, {
            handler: functionName as Function, isCustom: true,
            description: formulaDescription, category: category,
            syntax: syntax
        });
    }

    /**
     * Notifies the engine that a cell value or formula changed and optionally recalculates dependents.
     *
     * @hidden
     * @param {Object} grid - Parent object / sheet reference name.
     * @param {string[]} changeArgs - Changed cell coordinates and formula/value.
     * @param {boolean} isCalculate - When `true`, recalculates the changed formula.
     * @param {string | number | Object} usedRangeCol - Used-range bounds for the sheet.
     * @param {string | number | Object} refresh - Whether to refresh computed values.
     * @param {string} sheetName - Visible sheet name for `actCell` tracking.
     * @param {boolean} isRandomFormula - Whether the change involves volatile random formulas.
     * @param {string} randomFormulaRefreshing - Whether random formulas are being refreshed.
     * @param {boolean} isDelete - Whether the change originates from a delete operation.
     * @param {string} deletedRange - Deleted range indexes when `isDelete` is `true`.
     * @param {string | number | Object} refreshDependentCells - Forces dependent refresh regardless of calculation mode.
     * @param {string | number | Object} action - Optional calculation action label (for example `"calculate"`).
     */

    public valueChanged(
        grid: string, changeArgs: ValueChangedArgs, isCalculate?: boolean, usedRangeCol?: number[], refresh?: boolean,
        sheetName?: string, isRandomFormula?: boolean, randomFormulaRefreshing?: boolean,
        isDelete?: boolean, deletedRange?: number[], refreshDependentCells?: boolean, action?: string): void {
        const pgrid: string = grid; this.spreadSheetUsedRange = usedRangeCol;
        this.grid = grid;
        let isComputedValueChanged: boolean = true;
        let isCompute: boolean = true;
        const calcFamily: CalcSheetFamilyItem = this.getSheetFamilyItem(pgrid);
        let cellTxt: string = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        this.actCell = sheetName + '!' + cellTxt;
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            const token: string = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        const argVal: string = changeArgs.getFormulaValue().toUpperCase();
        if (argVal.indexOf('=RAND()') > - 1 || argVal.indexOf('=NOW()') > -1 || argVal.indexOf('NOW()') > -1 || argVal.indexOf('RAND()') > - 1 || argVal.indexOf('=RANDBETWEEN(') > - 1 ||
            argVal.indexOf('RANDBETWEEN(') > - 1 || this.randomValues.has(cellTxt)) {
            let randStrVal: string = this.randCollection.toString();
            if (!this.randomValues.has(cellTxt)) {
                this.randomValues.set(cellTxt, changeArgs.getFormulaValue());
                this.randCollection.push(cellTxt);
                this.isRandomVal = true;
            } else if (this.randomValues.has(cellTxt)) {
                if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('=NOW()') > -1 || argVal.indexOf('NOW()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > - 1 ||
                    argVal.indexOf('RANDBETWEEN(') > - 1) {
                    this.randomValues.set(cellTxt, changeArgs.getFormulaValue());
                } else if (changeArgs.getFormulaValue().toUpperCase() !== this.randomValues.get(cellTxt.toUpperCase())) {
                    this.randomValues.delete(cellTxt);
                    randStrVal = randStrVal.split(cellTxt + this.parseArgumentSeparator).join('').split(
                        this.parseArgumentSeparator + cellTxt).join('').split(cellTxt).join('');
                    this.randCollection = randStrVal.split(this.parseArgumentSeparator);
                }
                if (this.randomValues.size === 0 && this.randCollection.length) {
                    this.isRandomVal = false;
                    this.randomValues.clear();
                    this.randCollection = [];
                }
            }
        }
        if (changeArgs.getFormulaValue() && changeArgs.getFormulaValue()[0] === this.getFormulaCharacter()) {
            this.cell = cellTxt;
            let formula: FormulaInfo;
            if (!isNullOrUndefined(isCompute)) {
                isCompute = isCalculate;
            }
            if (this.getFormulaInfoTable().has(cellTxt)) {
                formula = this.getFormulaInfoTable().get(cellTxt);
                if (changeArgs.getFormulaValue() !== formula.getFormulaText() || formula.getParsedFormula() == null) {
                    formula.setFormulaText(changeArgs.getFormulaValue());
                    if (this.getDependentFormulaCells().has(this.cell)) {
                        this.clearFormulaDependentCells(this.cell);
                    }
                    try {
                        formula.setParsedFormula(this.parser.parseFormula(changeArgs.getFormulaValue()));
                    } catch (ex) {
                        formula.setFormulaValue(ex);
                        isCompute = false;
                    }
                } else {
                    this.parser.isError = false;
                }
                if (isCompute) {
                    this.parser.isFormulaParsed = true;
                    const cValue: string | number = this.calculateFormula(formula.getParsedFormula(), refresh);
                    isComputedValueChanged = cValue !== formula.getFormulaValue() && (!(this.parentObject as { isEdit?: boolean }).isEdit ||
                        cValue !== this.formulaErrorStrings[FormulasErrorsStrings.CircularReference]);
                    formula.setFormulaValue(cValue);
                }
            } else {
                formula = new FormulaInfo();
                formula.setFormulaText(changeArgs.getFormulaValue());
                if (!this.getDependentFormulaCells().has(cellTxt)) {
                    this.getDependentFormulaCells().set(cellTxt, new Map<string, string>());
                }
                this.getFormulaInfoTable().set(cellTxt, formula);
                try {
                    formula.setParsedFormula(this.parser.parseFormula(changeArgs.getFormulaValue()));
                } catch (ex) {
                    formula.setFormulaValue(ex);
                    isCompute = false;
                }
                if (isCompute) {
                    const cValue: string | number = this.calculateFormula(formula.getParsedFormula(), refresh);
                    isComputedValueChanged = cValue !== this.formulaErrorStrings[FormulasErrorsStrings.CircularReference];
                    formula.setFormulaValue(cValue);
                }
            }
            if (isCompute) {
                /* eslint-disable */
                if ((this.parentObject as any).setValueRowCol === undefined) {
                    this.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                } else {
                    (this.parentObject as any).setValueRowCol(
                        this.getSheetId(pgrid), formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex(), formula.getFormulaText(), isRandomFormula);
                }
                /* eslint-enable */
            }
        } else if (this.getFormulaInfoTable().has(cellTxt)) {
            this.getFormulaInfoTable().delete(cellTxt);
            if (this.getDependentFormulaCells().has(cellTxt)) {
                this.clearFormulaDependentCells(cellTxt);
            }
        }
        if (isCompute && isComputedValueChanged && this.getDependentCells().has(cellTxt) &&
            ((this.parentObject as { calculationMode?: string, isEdit?: boolean }).calculationMode === 'Automatic' ||
                !(this.parentObject as { calculationMode?: string, isEdit?: boolean }).isEdit ||
                refreshDependentCells) && this.getDependentCells().get(cellTxt).toString() !== cellTxt) {
            this.refreshDependentCells(cellTxt, undefined, undefined, randomFormulaRefreshing, isDelete, deletedRange,
                                       refreshDependentCells, action);
        }
    }

    /**
     * @hidden
     * @param {number} value - specify the value
     * @param {string | number} formulaValue -  specify the formula value.
     * @param {number} row - specify the row
     * @param {number} col - specify the col.
     * @returns {void} - to set value row and column.
     */

    /**
     * Writes a computed value into standalone storage for the given sheet/row/column.
     *
     * @param {string | number | boolean | Object} value - Sheet id used to build the storage key.
     * @param {string | number | Object} formulaValue - Value to store.
     * @param {number} row - 1-based row index.
     * @param {number} col - 1-based column index.
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setValueRowCol(value: number, formulaValue: string | number, row: number, col: number): void {
        /* No Implementation */
    }

    private getSortedSheetNames(): string[] {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            if (this.sortedSheetNames != null) {
                return this.sortedSheetNames;
            }
            const arr: string[] = [];
            family.sheetNameToToken.forEach((_value: string, key: string) => {
                arr.push(key);
            });
            arr.sort((a: string, b: string) => b.length - a.length);
            this.sortedSheetNames = arr;
        }
        return this.sortedSheetNames;
    }

    /**
     * Extracts an error line/label from an exception message when present.
     *
     * @param {string} error - Error object or message.
     * @returns {string} - Error line text, or an empty string.
     * @hidden
     */

    public getErrorLine(error: string): string {
        /* eslint-disable-next-line */
        const errorStack: string[] = (error as any).stack ? (error as any).stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    }

    /**
     * Allocates a new sheet family id for registering grids as sheets.
     *
     * @returns {string | number} - New family id.
     * @hidden
     */

    public createSheetFamilyID(): number {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    }

    /**
     * Shared MIN / MAX evaluation over argument tokens.
     *
     * @param {string[]} args - Numeric argument tokens.
     * @param {string | number | Object} operation - `"min"` or `"max"`.
     * @returns {string} - Aggregate result string or error token.
     * @hidden
     */

    public computeMinMax(args: string[], operation: string): string {
        let result: number;
        let argVal: string;
        let isSubtotalFormula: boolean = false;
        if (args.length) {
            const lastArgument: string = args[args.length - 1];
            if (lastArgument === 'isSubtotal') {
                isSubtotalFormula = true;
                args.pop();
            }
        }
        if (isNullOrUndefined(args) || args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.WrongNumberArguments];
        }
        result = (operation === 'max') ? this.minValue : this.maxValue;
        for (let k: number = 0, len: number = args.length; k < len; k++) {
            if (args[k as number].split(this.tic).join('').trim() === '') {
                result = 0;
            }
        }
        const argArr: string[] = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.Value];
        }
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i as number].indexOf(':') > -1 && this.isCellReference(argArr[i as number])) {
                const cellValue: string[] | string = this.getCellCollection(argArr[i as number]);
                for (let j: number = 0; j < cellValue.length; j++) {
                    argVal = !isSubtotalFormula ? this.getValueFromArg(cellValue[j as number]) :
                        this.getValueFromArg(cellValue[j as number], null, null, true);
                    if (isSubtotalFormula && argVal.includes('SUBTOTAL(')) {
                        continue;
                    }
                    const cellVal: number = this.parseFloat(argVal);
                    if (argVal === '' || this.isNaN(this.parseFloat(cellVal)) || this.getErrorStrings().indexOf(argVal) > -1) {
                        continue;
                    } else {
                        result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                    }
                }
            } else {
                let val: string = !isSubtotalFormula ? this.getValueFromArg(argArr[i as number]) :
                    this.getValueFromArg(argArr[i as number], null, null, true);
                if (isSubtotalFormula && val.includes('SUBTOTAL(')) {
                    continue;
                }
                let cellVal: number = 0;
                const isCellRef: boolean = this.isCellReference(argArr[i as number]);
                const isEmptyCell: boolean = val === '' && isCellRef;
                const isStringCell: boolean = this.isNaN(this.parseFloat(val)) && isCellRef;
                const isBooleanCell: boolean = val === (this.trueValue || this.falseValue) && isCellRef;
                argArr[i as number] = argArr[i as number].startsWith('n') ? argArr[i as number].slice(1) : argArr[i as number];
                if (this.getErrorStrings().indexOf(val) > -1) { return val; }
                if (val === this.trueValue && argArr[i as number] === this.trueValue) {
                    val = '1';
                } else if (val === this.falseValue && argArr[i as number] === this.falseValue) {
                    val = '0';
                } else if ( isEmptyCell || isStringCell || isBooleanCell) {
                    continue;
                }
                if (val.indexOf('"') > -1) {
                    val = val.split(this.tic).join('');
                }
                if (this.isNaN(this.parseFloat(val))) {
                    return this.getErrorStrings()[CommonErrors.Value];
                }
                cellVal = this.parseFloat(val);
                result = operation === 'max' ? Math.max(result, cellVal) : Math.min(result, cellVal);
            }
        }
        if (result === this.minValue || result === this.maxValue) {
            result = 0;
        }
        return result.toString();
    }

    /**
     * Shared AVERAGE evaluation over argument tokens.
     *
     * @param {string[]} args - Numeric argument tokens.
     * @param {boolean} isSubtotalFormula - When `true`, applies SUBTOTAL visibility rules.
     * @returns {string} - Average as a string, or an error token.
     * @hidden
     */

    public calculateAvg(args: string[], isSubtotalFormula?: boolean): string {
        const argArr: string[] = args;
        let cellColl: string[] | string = [];
        let cellVal: string; let value: string;
        let avgVal: number = 0;
        let countNum: number = 0;
        for (let k: number = 0; k < argArr.length; k++) {
            if (this.isCellReference(argArr[k as number])) {
                if (argArr[k as number].indexOf(':') > -1) {
                    cellColl = this.getCellCollection(argArr[k as number]);
                    for (let i: number = 0; i < cellColl.length; i++) {
                        cellVal = !isSubtotalFormula ? this.getValueFromArg(cellColl[i as number]) :
                            this.getValueFromArg(cellColl[i as number], null, null, true);
                        if (isSubtotalFormula && cellVal.includes('SUBTOTAL(')) {
                            continue;
                        }
                        if (this.getErrorStrings().indexOf(cellVal) > -1) {
                            return cellVal;
                        } else if (isNullOrUndefined(cellVal) || isNaN(this.parseFloat(cellVal)) || cellVal === '') {
                            continue;
                        }
                        avgVal = avgVal + this.parseFloat(cellVal);
                        countNum = countNum + 1;
                    }
                } else {
                    cellVal = !isSubtotalFormula ? this.getValueFromArg(argArr[k as number]) :
                        this.getValueFromArg(argArr[k as number], null, null, true);
                    if (isSubtotalFormula && cellVal.includes('SUBTOTAL(')) {
                        continue;
                    }
                    if (this.getErrorStrings().indexOf(cellVal) > -1) {
                        return cellVal;
                    } else if (isNullOrUndefined(cellVal) || isNaN(this.parseFloat(cellVal)) || cellVal === '') {
                        continue;
                    }
                    avgVal = avgVal + this.parseFloat(cellVal);
                    countNum = countNum + 1;
                }
            } else {
                if (argArr[k as number].indexOf(this.tic) > -1) {
                    if (isNaN(this.parseFloat(argArr[k as number].split(this.tic).join(''))) ||
                        argArr[k as number].split(this.tic).join('').trim() === '') {
                        return this.getErrorStrings()[CommonErrors.Value];
                    }
                }
                if (argArr[k as number].length === 0 || args[k as number] === this.falseValue) {
                    argArr[k as number] = '0';
                }
                if (args[k as number] === this.trueValue) {
                    argArr[k as number] = '1';
                }
                value = this.getValueFromArg(argArr[k as number].split(this.tic).join(''));
                if (this.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                avgVal = avgVal + this.parseFloat(value);
                countNum = countNum + 1;
            }
        }
        if (countNum === 0) {
            return this.getErrorStrings()[CommonErrors.DivZero];
        }
        return (avgVal / countNum).toString();
    }

    /**
     * Registers a grid/model as a named sheet within a sheet family.
     *
     * @param {string} refName - Sheet reference name.
     * @param {Object} model - Grid / model object (or id string).
     * @param {string | number | Object} sheetFamilyID - Family id from {@link createSheetFamilyID}.
     * @returns {string} - Sheet token assigned to the model.
     */

    public registerGridAsSheet(refName: string, model: Object | string, sheetFamilyID: number): string {
        if (isNullOrUndefined(this.modelToSheetID)) {
            this.modelToSheetID = new Map<Object, number>();
        }
        if (isNullOrUndefined(this.modelToSheetID.get(model))) {
            this.modelToSheetID.set(model, sheetFamilyID);
        }
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(model);
        family.isSheetMember = true;
        const tempRef: string = refName.toUpperCase();
        if (family.parentObjectToToken.size === 0) {
            family.parentObjectToToken = new Map<Object, string>();
        }
        if (family.sheetNameToParentObject.size === 0) {
            family.sheetNameToParentObject = new Map<string, Object>();
        }
        if (family.sheetNameToToken.size === 0) {
            family.sheetNameToToken = new Map<string, string>();
        }
        if (family.tokenToParentObject.size === 0) {
            family.tokenToParentObject = new Map<string, Object>();
        }

        if (!isUndefined(family.sheetNameToParentObject.get(tempRef))) {
            const token: string = family.sheetNameToToken.get(tempRef);
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
        } else {
            const token: string = this.sheetToken + this.tokenCount.toString() + this.sheetToken;
            this.tokenCount++;
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
            family.sheetNameToToken.set(tempRef, token);
            family.sheetNameToParentObject.set(tempRef, model);
        }
        this.sortedSheetNames = null;
        return refName;
    }

    /**
     * Unregisters a sheet name (or all sheets) from a sheet family.
     *
     * @param {string} refName - Sheet reference name to remove.
     * @param {Object} model - Grid / model object associated with the sheet.
     * @param {Object} unRegisterAll - When `true`, removes all registered sheets for the model.
     * @returns {void}
     */

    public unregisterGridAsSheet(refName: string, model: string | Object, unRegisterAll?: boolean): void {
        let modelArr: string[] | Object[] = [model];
        if (unRegisterAll) {
            modelArr = [];
            if (!isNullOrUndefined(this.modelToSheetID)) {
                (this.modelToSheetID as Map<Object, number>).forEach((value: Object, key: string): void => {
                    modelArr.push(key);
                });
            }
        }
        modelArr.forEach((value: string | Object): void => {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(value);
            const refName1: string = (unRegisterAll ? <string>value : refName).toUpperCase();
            if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.has(refName1)) {
                family.sheetNameToParentObject.delete(refName1);
                const token: string = family.sheetNameToToken.get(refName1);
                family.sheetNameToToken.delete(refName1);
                family.tokenToParentObject.delete(token);
                family.parentObjectToToken.delete(value);
            }
            if (this.modelToSheetID && this.modelToSheetID.has(value)) {
                this.modelToSheetID.delete(value);
            }
        });
        this.sortedSheetNames = null;
    }

    /**
     * Parses and evaluates a formula expression in one call (always re-parses).
     *
     * @param {string} formula - Formula text to evaluate.
     * @param {boolean} isFromComputeExpression - Internal flag passed through to {@link computeFormula}.
     * @returns {string} - Computed value or error token.
     *
     * @example
     * ```ts
     * engine.computeExpression('=AVERAGE(1,2,3)'); // '2'
     * ```
     */

    public computeExpression(formula: string, isFromComputeExpression?: boolean): string | number {
        const parsedFormula: string = this.parser.parseFormula(formula);
        const calcValue: string | number = this.computeFormula(parsedFormula, isFromComputeExpression);
        return calcValue;
    }

    private isSheetMember(): CalcSheetFamilyItem | boolean {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    }

    /**
     * Releases engine state (stored values, named ranges, dependency graphs, sheet
     * families, volatile tracking, and library formulas).
     *
     * Call when the engine instance is no longer needed.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.resetKeys();
        if (this.dependentCells) {
            this.dependentCells.clear();
            this.dependentCells = null;
        }
        if (this.dependentFormulaCells) {
            this.dependentFormulaCells.clear();
            this.dependentFormulaCells = null;
        }
        if (this.formulaInfoTable) {
            this.formulaInfoTable.clear();
            this.formulaInfoTable = null;
        }
        this.namedRanges.clear();
        this.randomValues.clear();
        this.randCollection = [];
        this.dependencyCollection = [];
        this.uniqueRange = [];
        this.sortRange = [];
        this.sortedSheetNames = null;
        this.evaluatingKeys.clear();
        if (this.sheetFamiliesList) {
            this.sheetFamiliesList.forEach((family: CalcSheetFamilyItem): void => {
                if (family.sheetDependentFormulaCells) {
                    family.sheetDependentFormulaCells.clear();
                }
                if (family.sheetFormulaInfotable) {
                    family.sheetFormulaInfotable.clear();
                }
                if (family.tokenToParentObject) {
                    family.tokenToParentObject.clear();
                }
                if (family.parentObjectToToken) {
                    family.parentObjectToToken.clear();
                }
                if (family.sheetNameToParentObject) {
                    family.sheetNameToParentObject.clear();
                }
                if (family.sheetNameToToken) {
                    family.sheetNameToToken.clear();
                }
            });
            this.sheetFamiliesList.clear();
            this.sheetFamiliesList = null;
        }
        if (this.modelToSheetID) {
            this.modelToSheetID.clear();
            this.modelToSheetID = null;
        }
        this.defaultFamilyItem = null;
        this.lFormulas.clear();
        if (this.parser) {
            this.parser.destroy();
        }
        this.parentObject = null;
        this.grid = null;
        if (typeof (this as unknown as { destroy?: Function }).destroy === 'function') {
            try {
                (this as unknown as { destroy?: Function }).destroy();
            } catch (_e) {
                /* Base.destroy may require DOM; ignore in headless destroy */
            }
        }
    }

    /**
     * Recomputes volatile random formula cells tracked by the engine.
     *
     * @param {string} cellRef - Cell reference that triggered the refresh (removed from the random set when present).
     * @hidden
     * @returns {void}
     */

    public refreshRandValues(cellRef: string): void {
        let rowIdx: number;
        let colIdx: number;
        let value: string | number;
        let tokenRef: string = '';
        let family: CalcSheetFamilyItem;
        if (this.randomValues.has(cellRef)) {
            this.randomValues.delete(cellRef);
            const randIdx: number = this.randCollection.indexOf(cellRef);
            if (randIdx > -1) {
                this.randCollection.splice(randIdx, 1);
            }
            if (this.randomValues.size === 0 && !this.randCollection.length) {
                this.randomValues.clear();
                this.randCollection = [];
            }
        }
        for (let i: number = 0; i < this.randomValues.size; i++) {
            rowIdx = this.rowIndex(this.randCollection[i as number]);
            colIdx = this.colIndex(this.randCollection[i as number]);
            tokenRef = (parseFloat(this.getSheetToken(this.randCollection[i as number]).split(this.sheetToken).join('')) + 1).toString();
            family = this.getSheetFamilyItem(tokenRef);
            this.grid = family.sheetNameToParentObject.get(tokenRef);
            value = this.randomValues.get(this.randCollection[i as number]);
            value = this.computeFormula(value);
            if ((<{ setValueRowCol: Function }>this.parentObject).setValueRowCol === undefined) {
                this.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            } else {
                (<{ setValueRowCol: Function }>this.parentObject).setValueRowCol(
                    this.getSheetId(this.grid), value, rowIdx, colIdx);
            }
        }
    }

    /**
     * Recalculates cells that depend on `cellRef` according to calculation mode and options.
     *
     * @hidden
     * @param {string} cellRef - Changed cell reference.
     * @param {string} uniqueCell - Optional UNIQUE spill context cell to skip.
     * @param {string} dependentCell - Accumulator of already-refreshed dependents (used for recursion).
     * @param {boolean} isRandomFormula - Whether refresh is for volatile random formulas.
     * @param {boolean} isDelete - Whether refresh follows a delete.
     * @param {string} deletedRange - Deleted range indexes.
     * @param {string | number | Object} refreshDependentCells - Forces dependent updates.
     * @param {string | number | Object} action - Optional action label (for example `"calculate"`).
     */

    public refreshDependentCells(cellRef: string, uniqueCell?: string, dependentCell?: string[], isRandomFormula?: boolean,
                                 isDelete?: boolean, deletedRange?: number[], refreshDependentCells?: boolean, action?: string): void {
        let refreshCells: boolean;
        if (!dependentCell) {
            refreshCells = true;
            dependentCell = [];
        }
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        try {
            const dependentCells: string[] = this.getDependentCells().get(cellRef);
            if (dependentCells && dependentCells.length !== 0 &&
                ((this.parentObject as { calculationMode?: string, isEdit?: boolean }).calculationMode === 'Automatic' ||
                    refreshDependentCells || action === 'calculate')) {
                let i: number;
                for (i = 0; i < dependentCells.length; i++) {
                    const dCell: string = dependentCells[i as number];
                    if ((uniqueCell && dCell.indexOf(uniqueCell) > -1) || dCell === cellRef || dependentCell.indexOf(dCell) > -1) {
                        continue;
                    }
                    const token: string = this.getSheetToken(dCell);
                    const sheets: { name: string, id?: number, rows?: { cells?: { formula?: string }[] }[] }[] =
                        (this.parentObject as { sheets: { name: string }[] }).sheets;
                    let sheetIdx: number = (this.parentObject as { activeSheetIndex?: number }).activeSheetIndex;
                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                        const sheetId: number = Number(this.grid);
                        let sheetName: string = '';
                        if (!this.isNaN(sheetId) && sheets) {
                            for (let i: number = 0; i < sheets.length; i++) {
                                if (sheets[i as number].id === sheetId) {
                                    sheetName = sheets[i as number].name;
                                    sheetIdx = i;
                                }
                            }
                        }
                        this.actCell = sheetName + '!' + dCell.split(token)[1];
                    } else {
                        this.actCell = dCell.split(token)[1];
                    }
                    try {
                        const calculateFormula: Function = (cell: string, formulaInfo: FormulaInfo): void => {
                            if (formulaInfo) {
                                this.cell = cell;
                                this.parser.isFormulaParsed = true;
                                formulaInfo.setFormulaValue(this.calculateFormula(formulaInfo.getParsedFormula(), true));
                            }
                        };
                        const rowIdx: number = this.rowIndex(dCell);
                        const colIdx: number = this.colIndex(dCell);
                        const formulaInfo: FormulaInfo = this.getFormulaInfoTable().get(dCell);
                        if ((<{ setValueRowCol: Function }>this.parentObject).setValueRowCol === undefined) {
                            calculateFormula(dCell, formulaInfo);
                            this.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        } else {
                            const cell: { formula?: string } = sheets && sheets[sheetIdx as number].rows &&
                                sheets[sheetIdx as number].rows[rowIdx - 1] && sheets[sheetIdx as number].rows[rowIdx - 1].cells &&
                                sheets[sheetIdx as number].rows[rowIdx - 1].cells[colIdx - 1];
                            let val: string | number;
                            if (cell && cell.formula && cell.formula.toLowerCase().includes('unique')) {
                                if (!this.uniqueCells || this.uniqueCells.indexOf(dCell) === -1) {
                                    if (!this.uniqueCells) {
                                        this.uniqueCells = [];
                                    }
                                    this.uniqueCells.push(dCell);
                                    calculateFormula(dCell, formulaInfo);
                                    val = formulaInfo.getFormulaValue();
                                    this.uniqueCells.splice(this.uniqueCells.indexOf(dCell), 1);
                                    if (!this.uniqueCells.length) {
                                        this.uniqueCells = null;
                                    }
                                } else {
                                    continue;
                                }
                            } else if (cell && cell.formula && cell.formula.toLowerCase().includes('sort')) {
                                if (!this.sortCells || this.sortCells.indexOf(dCell) === -1) {
                                    if (!this.sortCells) {
                                        this.sortCells = [];
                                    }
                                    this.sortCells.push(dCell);
                                    calculateFormula(dCell, formulaInfo);
                                    val = formulaInfo.getFormulaValue();
                                    this.sortCells.splice(this.sortCells.indexOf(dCell), 1);
                                    if (!this.sortCells.length) {
                                        this.sortCells = null;
                                    }
                                } else {
                                    continue;
                                }
                            } else {
                                if (dependentCell.indexOf(dCell) === -1) {
                                    dependentCell.push(dCell);
                                }
                                val = null;
                            }
                            (<{ setValueRowCol: Function }>this.parentObject).setValueRowCol(
                                this.getSheetId(this.grid), val, rowIdx, colIdx, formulaInfo.getFormulaText());
                        }
                        this.refreshDependentCells(dCell, null, dependentCell, null, isDelete);
                    } catch (ex) {
                        continue;
                    }
                }
            }
            if (refreshCells) {
                if (!isDelete && deletedRange && deletedRange.length === 4) {
                    const token: string = this.getSheetToken(cellRef);
                    const deletedCell: string[] = [];
                    for (let sRIdx: number = deletedRange[0], eRIdx: number = deletedRange[2]; sRIdx <= eRIdx; sRIdx++) {
                        for (let sCIdx: number = deletedRange[1], eCIdx: number = deletedRange[3]; sCIdx <= eCIdx; sCIdx++) {
                            if (sRIdx === eRIdx && sCIdx === eCIdx) {
                                break;
                            }
                            const cell: string = token + getCellAddress(sRIdx, sCIdx);
                            this.refreshDependentCells(cell, null, dependentCell, null, isDelete);
                            deletedCell.push(cell);
                        }
                    }
                    const ranges: Set<string> = new Set(deletedCell);
                    if (dependentCell) {
                        dependentCell = dependentCell.filter((item: string) => !ranges.has(item));
                    }
                }
                const sheets: [{ id: number, rows: [{ cells: [{ value: string }] }] }] =
                    (<{ sheets: [{ id: number, rows: [{ cells: [{ value: string }] }] }] }>this.parentObject).sheets;
                if (!sheets) {
                    dependentCell = [];
                }
                dependentCell.forEach((cell: string): void => {
                    let sheetIdx: number;
                    const sheetId: number = this.getSheetId(family.tokenToParentObject.get(this.getSheetToken(cell)));
                    for (let idx: number = 0; idx < sheets.length; idx++) {
                        if (sheets[idx as number].id === sheetId) {
                            sheetIdx = idx;
                            break;
                        }
                    }
                    const rowIdx: number = this.rowIndex(cell) - 1;
                    const colIdx: number = this.colIndex(cell) - 1;
                    const cellObj: { value: string } = sheets[sheetIdx as number].rows[rowIdx as number] &&
                        sheets[sheetIdx as number].rows[rowIdx as number].cells[colIdx as number];
                    if (cellObj) {
                        (<{ notify: Function }>this.parentObject).notify(
                            'calculateFormula', { cell: cellObj, rowIdx: rowIdx, colIdx: colIdx, sheetIndex: sheetIdx, isDependentRefresh: true, isRandomFormula: isRandomFormula, action: action });
                    }
                });
            }
        } finally {
            if (this.getDependentCells().has(cellRef)) {
                this.grid = family.tokenToParentObject.get(this.getSheetToken(cellRef));
            }
        }
    }
}

/**
 * Formula parse/evaluation error raised by the Calculate engine.
 *
 * @hidden
 */

export class FormulaError {
    /** Human-readable error message. */
    public message: string;
    /** When `true`, the parser suggests an auto-corrected formula. */
    public formulaCorrection: boolean = false;
    /**
     * @param {string | number | Object} errorMessage - Error description.
     * @param {string} formulaAutoCorrection - Whether formula auto-correction is available.
     */
    constructor(errorMessage: string, formulaAutoCorrection?: boolean) {
        this.message = errorMessage;
        this.formulaCorrection = formulaAutoCorrection;
    }

}

/**
 * Cached formula text, parsed form, and computed value for a cell.
 *
 * @hidden
 */

export class FormulaInfo {
    /** Calculation generation id for cache invalidation. */
    public calcID: number = Number.MIN_VALUE + 1;
    /** Original formula text (including leading `=` when present). */
    public formulaText: string;
    private formulaValue: string | number;
    private parsedFormula: string;
    private calcID1: number = Number.MIN_VALUE + 1;
    /**
     * Returns the stored formula text for this cell.
     *
     * @returns {string} - Formula text, or `undefined` when unset.
     */

    public getFormulaText(): string {
        return this.formulaText;
    }
    /**
     * Sets the formula text for this cell.
     *
     * @param {string | number | boolean | Object} value - Formula text (typically including leading `=`).
     * @returns {void}
     */

    public setFormulaText(value: string): void {
        this.formulaText = value;
    }
    /**
     * Returns the last computed value for this cell.
     *
     * @returns {string} - Computed value or error token.
     */

    public getFormulaValue(): string | number {
        return this.formulaValue;
    }
    /**
     * Sets the computed value for this cell.
     *
     * @param {string | number | boolean | Object} value - Computed result.
     * @returns {void}
     */

    public setFormulaValue(value: string | number): void {
        this.formulaValue = value;
    }
    /**
     * Returns the parser token string for this cell's formula.
     *
     * @returns {string | number} - Parsed formula tokens.
     */

    public getParsedFormula(): string {
        return this.parsedFormula;
    }
    /**
     * Sets the parser token string for this cell's formula.
     *
     * @param {string | number | boolean | Object} value - Parsed formula tokens from {@link Parser.parseFormula}.
     * @returns {void}
     */

    public setParsedFormula(value: string): void {
        this.parsedFormula = value;
    }
}

/**
 * Per-family sheet registration and dependency tables used when multiple grids share an engine.
 *
 * @hidden
 */

export class CalcSheetFamilyItem {
    /** Whether this family participates in multi-sheet evaluation. */
    public isSheetMember: boolean = false;
    /** Maps parent grid objects to their sheet tokens. */
    public parentObjectToToken: Map<Object, string> = new Map<Object, string>();
    /** Formula dependency map scoped to this sheet family. */
    public sheetDependentFormulaCells: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    /** Maps sheet names to parent grid objects. */
    public sheetNameToParentObject: Map<string, Object> = new Map<string, Object>();
    /** Maps sheet names to sheet tokens. */
    public sheetNameToToken: Map<string, string> = new Map<string, string>();
    /** Maps sheet tokens to parent grid objects. */
    public tokenToParentObject: Map<string, Object> = new Map<string, Object>();
    /** Formula info table scoped to this sheet family. */
    public sheetFormulaInfotable: Map<string, FormulaInfo> = new Map<string, FormulaInfo>();
}

/**
 * Converts a 1-based column index to Excel column letters.
 *
 * @param {number} col - 1-based column index.
 * @returns {string | number} - Column letters (for example `1` → `"A"`).
 * @hidden
 */
export function getAlphalabel(col: number): string {
    const cols: string[] = [];
    let n: number = 0;
    const charText: string = 'A';
    while (col > 0 && n < 9) {
        col--;
        const aCharNo: number = charText.charCodeAt(0);
        cols[n as number] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    const chs: string[] = [];
    for (let i: number = 0; i < n; i++) {
        chs[n - i - 1] = cols[i as number];
    }
    return chs.join('');
}

/**
 * Arguments describing a cell value/formula change for {@link Calculate.valueChanged}.
 *
 * @hidden
 */

export class ValueChangedArgs {
    /** 1-based row index of the changed cell. */
    public row: number;
    /** 1-based column index of the changed cell. */
    public col: number;
    /** New formula text or literal value. */
    public value: number | string;
    /** Returns the 1-based row index. */
    public getRowIndex: Function;
    /** Updates the 1-based row index. */
    public setRowIndex: Function;
    /** Returns the 1-based column index. */
    public getColIndex: Function;
    /** Updates the 1-based column index. */
    public setColIndex: Function;
    /** Returns the formula/value associated with this change. */
    public getFormulaValue: Function;
    /**
     * @param {number} row - 1-based row index.
     * @param {number} col - 1-based column index.
     * @param {string | number | boolean | Object} value - Formula text or literal value.
     */
    constructor(row: number, col: number, value: number | string) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.getRowIndex = (): number => {
            return row;
        };
        this.setRowIndex = (value: number): void => {
            row = value;
        };
        this.getColIndex = (): number => {
            return col;
        };
        this.setColIndex = (value: number): void => {
            col = value;
        };
        this.getFormulaValue = (): number | string => {
            return value;
        };
        return this;
    }
}
