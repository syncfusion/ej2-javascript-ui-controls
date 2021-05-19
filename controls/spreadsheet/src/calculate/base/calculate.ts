/* eslint-disable @typescript-eslint/no-explicit-any */
import { getValue, INotifyPropertyChanged, EmitType, Event, ModuleDeclaration, NotifyPropertyChanges, Base, Property, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { BasicFormulas } from './../formulas/index';
import { CalculateModel } from './calculate-model';
import { getModules, ModuleLoader } from '../common/index';
import { CommonErrors, FormulasErrorsStrings } from '../common/enum';
import { IFormulaColl, FailureEventArgs, StoredCellInfo } from '../common/interface';
import { Parser } from './parser';

/**
 * Represents the calculate library.
 */
@NotifyPropertyChanges
export class Calculate extends Base<HTMLElement> implements INotifyPropertyChanged {
    private lFormulas: Map<string, IFormulaColl> = new Map<string, IFormulaColl>();
    get libraryFormulas(): any {
        return this.lFormulas;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    set libraryFormulas(formulaColl: any) {
        this.lFormulas.set(
            formulaColl.fName, { handler: formulaColl.handler, category: formulaColl.category, description: formulaColl.description });
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
    private emptyString: string = '';
    private leftBrace: string = '{';
    private rightBrace: string = '}';
    public cell: string = this.emptyString;
    private cellPrefix: string = '!0!A';
    private treatEmptyStringAsZero: boolean = false;
    /** @hidden */
    public parentObject: Object | Calculate;
    /** @hidden */
    // eslint-disable-next-line no-useless-escape
    public tic: string = '\"';
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
    public minValue: number = Number.MIN_SAFE_INTEGER;
    public maxValue: number = Number.MAX_SAFE_INTEGER;
    public categoryCollection: string[] = ['All'];
    private dependencyLevel: number = 0;
    private refreshedCells: Map<string, string[]> = new Map<string, string[]>();
    private computedValues: Map<string, string | number> = null;
    /** @hidden */
    public randomValues: Map<string, string> = new Map<string, string>();
    /** @hidden */
    public isRandomVal: boolean = false;
    /** @hidden */
    public randCollection: string[] = [];

    /**
     * @hidden
     */
    public formulaErrorStrings: string[] = [
        'binary operators cannot start an expression',
        'cannot parse',
        'bad library',
        'invalid char in front of',
        'number contains 2 decimal points',
        'expression cannot end with an operator',
        'invalid characters following an operator',
        'invalid character in number',
        'mismatched parentheses',
        'unknown formula name',
        'requires a single argument',
        'requires 3 arguments',
        'invalid Math argument',
        'requires 2 arguments',
        '#NAME?',
        'too complex',
        'circular reference: ',
        'missing formula',
        'improper formula',
        'invalid expression',
        'cell empty',
        'bad formula',
        'empty expression',
        '',
        'mismatched string quotes',
        'wrong number of arguments',
        'invalid arguments',
        'iterations do not converge',
        'Control is already registered',
        'Calculation overflow',
        'Missing sheet',
        'cannot_parse',
        'expression_cannot_end_with_an_operator'
    ];
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
    protected injectedModules: Function[];
    private formulaInfoTable: Map<string, FormulaInfo> = null;
    private oaDate: Date = new Date(1899, 11, 30);
    private millisecondsOfaDay: number = 24 * 60 * 60 * 1000;
    private parseDateTimeSeparator: string = '/';

    /**
     * Specifies a value that indicates whether the basic formulas need to be included.
     *
     * @default true
     */
    @Property(true)
    public includeBasicFormulas: boolean;

    /**
     * Triggers when the calculation caught any errors.
     *
     * @event anEvent
     */
    @Event()
    public onFailure: EmitType<FailureEventArgs>;

    /**
     * Base constructor for creating Calculate library.
     *
     * @param {Object} parent - specify the parent
     */
    constructor(parent?: Object) {
        super(null, null);
        const moduleLoader: ModuleLoader = new ModuleLoader(this);
        if (this.includeBasicFormulas) {
            Calculate.Inject(BasicFormulas);
        }
        if (this.injectedModules && this.injectedModules.length) {
            moduleLoader.inject(this.requiredModules(), this.injectedModules);
        }
        this.parentObject = isNullOrUndefined(parent) ? this : parent;
        this.grid = this.parentObject;
        this.parser = new Parser(this);
    }

    /**
     * To get the argument separator to split the formula arguments.
     *
     * @returns {string} - To get the argument separator to split the formula arguments.
     */
    public getParseArgumentSeparator(): string {
        const seperator: string = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    }

    /**
     * To set the argument separator to split the formula arguments.
     *
     * @param {string} value - Argument separator based on the culture.
     * @returns {void} - To set the argument separator to split the formula arguments.
     */
    public setParseArgumentSeparator(value: string): void {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    }

    /**
     * To get the date separator to split the date value.
     *
     * @returns {string} - To get the date separator to split the date value.
     */
    public getParseDateTimeSeparator(): string {
        return this.parseDateTimeSeparator;
    }

    /**
     * To set whether the empty string is treated as zero or not.
     *
     * @param {boolean} value - specify the boolean.
     * @returns {void} - To set whether the empty string is treated as zero or not.
     */
    public setTreatEmptyStringAsZero(value: boolean): void {
        this.treatEmptyStringAsZero = value;
    }

    /**
     * To get whether the empty string is treated as zero or not.
     *
     * @returns {boolean} - To get whether the empty string is treated as zero or not.
     */
    public getTreatEmptyStringAsZero(): boolean {
        return this.treatEmptyStringAsZero;
    }

    /**
     * To set the date separator to split the date value.
     *
     * @param {string} value - Argument separator based on the culture.
     * @returns {void} - To set the date separator to split the date value.
     */
    public setParseDateTimeSeparator(value: string): void {
        this.parseDateTimeSeparator = value;
    }

    /**
     * To provide the array of modules needed.
     *
     * @hidden
     * @returns {ModuleDeclaration[]} - To provide the array of modules needed.
     */
    public requiredModules(): ModuleDeclaration[] {
        return getModules(this);
    }

    /**
     * Dynamically injects the required modules to the library.
     *
     * @hidden
     * @param {Function[]} moduleList - Specify the module list
     * @returns {void} - Dynamically injects the required modules to the library.
     */
    public static Inject(...moduleList: Function[]): void {
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (let j: number = 0; j < moduleList.length; j++) {
            if (this.prototype.injectedModules.indexOf(moduleList[j]) === -1) {
                this.prototype.injectedModules.push(moduleList[j]);
            }
        }
    }

    /**
     * Get injected modules
     *
     * @hidden
     * @returns {Function[]} - get Injected Modules
     */
    public getInjectedModules(): Function[] {
        return this.injectedModules;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: CalculateModel, oldProp: CalculateModel): void {
        /** code snippets */
    }

    protected getModuleName(): string {
        return 'calculate';
    }

    /**
     * @hidden
     * @returns {string} - get Formula Character.
     */
    public getFormulaCharacter(): string {
        return '=';
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @returns {boolean} - Returns boolean value.
     */
    public isUpperChar(text: string): boolean {
        const charCode: number = text.charCodeAt(0);
        return ((charCode > 64) && (charCode < 91));
    }

    private resetKeys(): void {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    }

    /**
     * @hidden
     * @param {string} cellRef -  specify the cell reference
     * @returns {void} - update Dependent Cell
     */
    public updateDependentCell(cellRef: string): void {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        let cell: string = this.cell;
        if (cell !== this.emptyString) {
            if (family.sheetNameToParentObject !== null) {
                const token: string = family.parentObjectToToken.get(this.grid);
                if (cell.indexOf(this.sheetToken) === -1) {
                    cell = token + cell;
                }
                if (cellRef.indexOf(this.sheetToken) === -1) {
                    cellRef = token + cellRef;
                }
            }

            if (this.getDependentCells().has(cellRef)) {
                const formulaCells: string[] = this.getDependentCells().get(cellRef);
                if (formulaCells.indexOf(cell) < 0) {
                    formulaCells.push(cell);
                }
            } else {
                this.getDependentCells().set(cellRef, [cell]);
            }
            this.addToFormulaDependentCells(cellRef);
        }
    }

    private addToFormulaDependentCells(cellRef: string): void {
        let cell1: string = this.cell;
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        if (family.sheetNameToParentObject != null && cell1.indexOf(this.sheetToken) === -1) {
            const token: string = family.parentObjectToToken.get(this.grid);
            cell1 = token + cell1;
        }
        if (!this.getDependentFormulaCells().has(cell1)) {
            this.getDependentFormulaCells().set(cell1, new Map());
            this.getDependentFormulaCells().get(cell1).set(cellRef, cellRef);
        } else if (!(this.getDependentFormulaCells().get(cell1)).has(cellRef)) {
            this.getDependentFormulaCells().get(cell1).set(cellRef, cellRef);
        }
    }

    /**
     * @hidden
     * @returns {Map<string, string[]>} - get Dependent Cells
     */
    public getDependentCells(): Map<string, string[]> {
        if (this.isSheetMember()) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentCells == null) {
                family.sheetDependentCells = new Map<string, string[]>();
            }
            return family.sheetDependentCells;
        } else {
            if (this.dependentCells == null) {
                this.dependentCells = new Map<string, string[]>();
            }
            return this.dependentCells;
        }
    }

    /**
     * @hidden
     * @returns {Map<string, Map<string, string>>} - get Dependent Formula Cells
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
     * To get library formulas collection.
     *
     * @returns {Map<string, Function>} - To get library formulas collection.
     */
    public getLibraryFormulas(): Map<string, IFormulaColl> {
        return this.lFormulas;
    }

    /**
     * To get library function.
     *
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns {Function} - To get library function.
     */
    public getFunction(libFormula: string): Function {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        } else {
            return null;
        }
    }

    /**
     * @hidden
     * @param {string} val - specify the value.
     * @returns {Date} - convert integer to date.
     */
    public intToDate(val: string): Date {
        let dateVal: number = Number(val);
        dateVal = (dateVal > 0 && dateVal < 1) ? (1 + dateVal) : (dateVal === 0) ? 1 : dateVal;
        if (dateVal > 60) {
            dateVal -= 1; // Due to leap year issue of 1900 in MSExcel.
        }

        return new Date(((dateVal - 1) * (1000 * 3600 * 24)) + new Date('01/01/1900').getTime());
    }

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
     * To get the formula text.
     *
     * @private
     * @param {string} key - specify the key.
     * @returns {string} - To get the formula text.
     */
    private getFormula(key: string): string {
        key = key.toUpperCase();
        if (this.storedData.has(key)) {
            return this.storedData.get(key).getFormulaText();
        }
        return '';
    }

    /**
     * To get the formula text.
     *
     * @returns {void} - To get the formula text.
     */
    public getParseDecimalSeparator(): string {
        const seperator: string = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    }

    /**
     * To get the formula text.
     *
     * @param {string} value - Specifies the decimal separator value.
     * @returns {void} - To get the formula text.
     */
    public setParseDecimalSeparator(value: string): void {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    }

    /**
     * @hidden
     * @param {string} cellRef -  specify the cell reference
     * @returns {string} - get sheet token.
     */
    public getSheetToken(cellRef: string): string {
        let i: number = 0;
        let temp: string = this.emptyString;
        if (i < cellRef.length && cellRef[i] === this.sheetToken) {
            i++;
            while (i < cellRef.length && cellRef[i] !== this.sheetToken) {
                i++;
            }
            temp = cellRef.substring(0, i + 1);
        }
        if (i < cellRef.length) {
            return temp;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    }

    /**
     * @hidden
     * @param {Object} grd - specify the id
     * @returns {number} - get sheet id.
     */
    public getSheetID(grd: Object): number {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            let token: string = family.parentObjectToToken.get(grd);
            if (token) {
                token = token.split(this.sheetToken).join(this.emptyString);
                const id: number = this.parseFloat(token);
                if (!this.isNaN(id)) {
                    return id;
                }
            }
        }
        return -1;
    }

    /**
     * @hidden
     * @param {string | number} value - specify the value.
     * @returns {number} - parse float
     */
    public parseFloat(value: string | number): number {
        return Number(value);
    }

    /**
     * To get the row index of the given cell.
     *
     * @param {string} cell - Cell address for getting row index.
     * @returns {number} - To get the row index of the given cell.
     */
    public rowIndex(cell: string): number {
        let i: number = 0;
        let isLetter: boolean = false;
        if (i < cell.length && cell[i] === this.sheetToken) {
            i++;
            while (i < cell.length && cell[i] !== this.sheetToken) {
                i++;
            }
            i++;
        }
        while (i < cell.length && this.isChar(cell[i])) {
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
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    }

    /**
     * To get the column index of the given cell.
     *
     * @param {string} cell - Cell address for getting column index.
     * @returns {number} - To get the column index of the given cell.
     */
    public colIndex(cell: string): number {
        let j: number = 0;
        let k: number = 0;
        cell = cell.toUpperCase();
        if (j < cell.length && cell[j] === this.sheetToken) {
            j++;
            while (j < cell.length && cell[j] !== this.sheetToken) {
                j++;
            }
            j++;
        }
        while (j < cell.length && this.isChar(cell[j])) {
            const charCode: number = cell[j].charCodeAt(0);
            k = k * 26 + charCode - 64;
            j++;
        }
        if (k === 0) {
            return -1;
        }
        return k;
    }

    /**
     * To get the valid error strings.
     *
     * @hidden
     * @returns {string[]} - to get error strings.
     */
    public getErrorStrings(): string[] {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!'];
        }
        return this.errorStrings;
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @param {number} startIndex - specify the start index
     * @param {number} length - specify the length
     * @returns {string} - Returns sub string
     */
    public substring(text: string, startIndex: number, length?: number): string {
        return text.substring(startIndex, length + startIndex);
    }

    /**
     * @hidden
     * @param {string} c - specify the characer of the string
     * @returns {boolean} - Return the boolean type
     */
    public isChar(c: string): boolean {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    }

    /**
     * @hidden
     * @param {Object} model - specify the model
     * @returns {CalcSheetFamilyItem} - get Sheet Family Item.
     */
    public getSheetFamilyItem(model: Object): CalcSheetFamilyItem {
        if (this.sheetFamilyID === 0) {
            if (this.defaultFamilyItem == null) {
                this.defaultFamilyItem = new CalcSheetFamilyItem();
            }
            return this.defaultFamilyItem;
        }
        if (this.sheetFamiliesList == null) {
            this.sheetFamiliesList = new Map<number, CalcSheetFamilyItem>();
        }
        const i: number = this.modelToSheetID.get(model);
        if (!this.sheetFamiliesList.has(i)) {
            this.sheetFamiliesList.set(i, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(i);
    }

    /**
     * Register a key value pair for formula.
     *
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns {void} - Register a key value pair for formula.
     */
    public setKeyValue(key: string, value: string | number): void {
        key = key.toUpperCase();
        const str: string = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf(this.leftBrace) === 0) {
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
     * @hidden
     * @param {string} cell - specify the cell
     * @returns {void} - clears the  Formula Dependent Cells.
     */
    public clearFormulaDependentCells(cell: string): void {
        const dependentFormula: Map<string, string> = this.getDependentFormulaCells().get(cell);
        if (dependentFormula != null) {
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

    private arrayRemove(array: string[], value: string): string[] {
        const index: number = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }

    /**
     * Register a key value pair for formula.
     *
     * @param {string} key - Key for getting the corresponding value.
     * @returns {string | number} - to get key value.
     */
    public getKeyValue(key: string): string | number {
        key = key.toUpperCase();
        if (this.storedData.has(key) !== null) {
            const fInfo: FormulaInfo = this.storedData.get(key);
            let fText: string = fInfo.getFormulaText();
            if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
                this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
                fText = fText.substring(1);
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
            }
            return this.storedData.get(key).getFormulaValue();
        } else {
            return this.emptyString;
        }
    }

    public getNamedRanges(): Map<string, string> {
        return this.namedRanges;
    }

    /**
     * Adds a named range to the NamedRanges collection.
     *
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @returns {boolean} - Adds a named range to the NamedRanges collection.
     */
    public addNamedRange(name: string, range: string): boolean {
        const sheetScopeName: string[] = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            if (!family.parentObjectToToken.get(sheetScopeName[0])) {
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
     * Remove the specified named range form the named range collection.
     *
     * @param {string} name - Name of the specified named range.
     * @returns {boolean} - Remove the specified named range form the named range collection.
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
     * @hidden
     * @param {number} col - specify the column
     * @returns {string} - to convert the alpha.
     */
    public convertAlpha(col: number): string {
        const arrCol: string[] = [];
        let n: number = 0;
        const charText: string = 'A';
        while (col > 0) {
            col--;
            const aCharValue: number = charText.charCodeAt(0);
            arrCol[n] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        const arr: string[] = [];
        for (let i: number = 0; i < n; i++) {
            arr[n - i - 1] = arrCol[i];
        }
        return arr.join('');
    }

    /**
     * @hidden
     * @param {string} cellRange - specify the cell range.
     * @returns {string} - to get cell collection.
     */
    public getCellCollection(cellRange: string): string[] | string {
        if (cellRange.indexOf(':') < 0) {
            if (!this.isCellReference(cellRange)) {
                return cellRange.split(this.getParseArgumentSeparator());
            } else {
                cellRange = cellRange + ':' + cellRange;
            }
        }
        let token: string = this.emptyString;
        const sheetTokenIndex: number = cellRange.indexOf(this.sheetToken);
        if (sheetTokenIndex > -1) {
            const index: number = sheetTokenIndex;
            let s: number = index + 1;
            while (s < cellRange.length) {
                if (cellRange[s] === this.sheetToken) {
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
            while (k >= 0 && this.isDigit(cellRange[k])) {
                k--;
            }
        }
        row1 = this.rowIndex(this.substring(cellRange, 0, i));
        row2 = this.rowIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        col1 = this.colIndex(this.substring(cellRange, 0, i));
        col2 = this.colIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
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
                cells[c] = token + this.emptyString + this.convertAlpha(j) + i.toString();
                c++;
            }
        }
        return cells;
    }

    /**
     * Compute the given formula.
     *
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns {string | number} - compute the given formula
     */
    public computeFormula(formulaText: string): string | number {
        let parsedText: string;
        let lastIndexOfq: number;
        let formulatResult: string | number;
        let nestedFormula: boolean = false;
        let fNested: string;
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
            if (parsedText !== this.emptyString && lastIndexOfq > -1) {
                let i: number = lastIndexOfq + 1;
                while (i > -1) {
                    if (parsedText[i] !== this.rightBracket) {
                        i++;
                        continue;
                    }
                    const sFormula: string = parsedText.substring(lastIndexOfq, i + 1);
                    const libFormula: string = sFormula.split(this.leftBracket)[0].split('q').join(this.emptyString);
                    let args: string[];
                    if (this.getLibraryFormulas().get(libFormula.toUpperCase()).isCustom) {
                        args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                        .split(this.getParseArgumentSeparator());
                        let j: number = 0;
                        const customArgs: string[] = [];
                        for (j = 0; j < args.length; j++) {
                            customArgs.push(this.getValueFromArg(args[j]));
                        }
                        args = customArgs;
                    } else {
                        args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                            .replace(',n', ',').split(this.getParseArgumentSeparator());
                        if (sFormula.includes(this.getParseArgumentSeparator() + this.tic)) {
                            let joinIdx: number = null;
                            for (let k: number = 0; k < args.length; k++) {
                                if (args[k] && args[k][0] === this.tic && args[k][args[k].length - 1] !== this.tic) { joinIdx = k; }
                                if (joinIdx !== null && joinIdx === k - 1 && args[k][0] != this.tic && args[k][args[k].length - 1] ===
                                    this.tic) {
                                    args[joinIdx] = args[joinIdx] + this.getParseArgumentSeparator() + args[k];
                                    args.splice(k, 1); joinIdx = null;
                                }
                            }
                        }
                    }
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.name] :
                        this.getFunction(libFormula)(...args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        const q: number = this.findLastIndexOfq(fNested);
                        if (q === 0) {
                            nestedFormula = false;
                        }
                        if (q === -1) {
                            formulatResult = this.computeValue(fNested);
                        }
                        lastIndexOfq = i = q;
                        parsedText = fNested;
                        continue;
                    }
                    break;
                }
            } else if (this.formulaErrorStrings.indexOf(parsedText) > -1) {
                formulatResult = parsedText;
            } else if (parsedText !== this.emptyString && lastIndexOfq === -1) {
                formulatResult = this.computeValue(parsedText);
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
     * @hidden
     * @param {string[]} range - specify the range
     * @returns {number[] | string} - to compute if and average if.
     */
    public computeSumIfAndAvgIf(range: string[]): number[] | string {
        if (isNullOrUndefined(range) || range[0] === this.emptyString || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        const argArr: string[] = range;
        for (let i: number = 0; i < argArr.length; i++) {
            if (this.isCellReference(argArr[i]) && isNullOrUndefined(argArr[i].match(/[0-9]/)) && argArr[i].indexOf('!') < 0) {
                const splitArray: string[] = argArr[i].split(':');
                argArr[i] = splitArray[0] + '1' + ':' + splitArray[1] + this.spreadSheetUsedRange[0];
            }
        }
        const argCount: number = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        const rangevalue: string = argArr[0];
        let criteria: string = argArr[1].trim();
        criteria = criteria.split(this.tic).join(this.emptyString);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        const isAsterisk: boolean = criteria.includes('*');
        let criteriaValue: string = isAsterisk ? criteria.replace(/\*/g, '').trim() : criteria;
        criteriaValue = this.isCellReference(criteriaValue) ? this.getValueFromArg(criteriaValue) : criteria;
        if (isAsterisk) {
            if (criteria[0] === '*') { criteriaValue = '*' + criteriaValue; }
            if (criteria[criteria.length - 1] === '*') { criteriaValue += '*'; }
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
        const checkCriteria: number = this.parseFloat(criteria);
        const criteriaRangeArray: string = argArr[0];
        const sumRange: string[] | string = this.getCellCollection(argCount > 2 ? argArr[2] : rangevalue);
        const criteriaRange: string[] | string = this.getCellCollection(criteriaRangeArray);
        const result: number[] = this.getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, opt, isAsterisk);
        return [result[0], result[1]];
    }

    // Commented unused method
    // /**
    //  * @hidden
    //  * @param {string[]} range - specify the range
    //  * @returns {string} - to compute lookup
    //  */
    // public computeLookup(range: string[]): string {
    //     if (range.length === 0) {
    //         return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
    //     }
    //     const checkCrte: string[] = [];
    //     const findMaxVal: string[] | string = [];
    //     const argArr: string[] = range;
    //     const argCount: number = argArr.length;
    //     const criterias: string = argArr[0].split(this.tic).join(this.emptyString);
    //     const rangevalue: string = argArr[1];
    //     const lookupRangeArray: string = argCount === 2 ? rangevalue : argArr[2];
    //     const criteriaRange: string[] | string = this.getCellCollection(argArr[1]);
    //     const lookupRange: string[] | string = this.getCellCollection(lookupRangeArray);
    //     for (let i: number = 0; i < criteriaRange.length; i++) {
    //         findMaxVal[i] = this.getValueFromArg(criteriaRange[i]).split(this.tic).join('');
    //     }
    //     const s: string[] = findMaxVal.toString().split(this.getParseArgumentSeparator());
    //     const maxVal: number = this.parseFloat(s[s.sort().length - 1]);
    //     const minVal: number = this.parseFloat(s[0]);
    //     for (let j: number = 0; j < criteriaRange.length; j++) {
    //         checkCrte[j] = this.getValueFromArg(criteriaRange[j]).split(this.tic).join('');
    //         if (criterias === checkCrte[j]) {
    //             return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
    //         } else if (this.parseFloat(criterias) === this.parseFloat(checkCrte[j])) {
    //             return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
    //         } else if (this.parseFloat(criterias) < minVal) {
    //             return this.getErrorStrings()[CommonErrors.na];
    //         } else if (this.parseFloat(criterias) > maxVal) {
    //             const index: number = findMaxVal.indexOf(maxVal.toString());
    //             return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
    //         }
    //     }
    //     if (findMaxVal.indexOf(criterias) < 0) {
    //         const temp: string[] = [];
    //         for (let n: number = 0; n < s.length; n++) {
    //             if (this.parseFloat(criterias) > this.parseFloat(s[n])) {
    //                 temp.push(s[n]);
    //             }
    //         }
    //         const index: number = findMaxVal.indexOf(temp[temp.length - 1]);
    //         return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
    //     }
    //     return this.getErrorStrings()[CommonErrors.na];
    // }

    // public computeVLookup(range: string[]): string {
    //     const argArr: string[] = range;
    //     const findMaxValue: string[] | string = [];
    //     let lookupValue: string = argArr[0].split(this.tic).join('');
    //     if (lookupValue.indexOf(':') > - 1) {
    //         return this.getErrorStrings()[CommonErrors.value];
    //     }
    //     if (this.isCellReference(lookupValue)) {
    //         lookupValue = this.getValueFromArg(lookupValue);
    //     }
    //     if (argArr[1].indexOf(':') < - 1) {
    //         return this.getErrorStrings()[CommonErrors.na];
    //     }
    //     let lookupRange: string[] | string = [];
    //     let firstCol: string = '';
    //     let secCol: string = '';
    //     if (this.isCellReference(argArr[1])) {
    //         lookupRange = this.getCellCollection(argArr[1]);
    //         if (argArr[1].indexOf(':') > - 1) {
    //             const index: number = argArr[1].indexOf(':');
    //             for (let i: number = 0; i < index; i++) {
    //                 const tempCell: string = this.isChar(argArr[1][i]) ? argArr[1][i] : '';
    //                 firstCol = firstCol + tempCell;
    //             }
    //             for (let j: number = index; j < argArr[1].length; j++) {
    //                 const tempCell2: string = this.isChar(argArr[1][j]) ? argArr[1][j] : '';
    //                 secCol = secCol + tempCell2;
    //             }
    //         }
    //     }
    //     const lookupCol: number = this.colIndex(firstCol) + this.parseFloat(argArr[2]);
    //     if (lookupCol > this.colIndex(secCol)) {
    //         return this.getErrorStrings()[CommonErrors.na];
    //     }
    //     if (lookupCol === this.colIndex(firstCol)) {
    //         return this.getErrorStrings()[CommonErrors.na];
    //     }
    //     const lookupCell: string = this.convertAlpha(lookupCol);
    //     argArr[3] = isNullOrUndefined(argArr[3]) ? this.trueValue : argArr[3].split(this.tic).join('');
    //     let cellValue: string = '';
    //     for (let i: number = 0; i < lookupRange.length; i++) {
    //         findMaxValue[i] = this.getValueFromArg(lookupRange[i]).split(this.tic).join('');
    //     }
    //     const s: string[] = findMaxValue.toString().split(this.getParseArgumentSeparator());
    //     const maxValue: number = this.parseFloat(s[s.sort().length - 1]);
    //     const minValue: number = this.parseFloat(s[0]);
    //     for (let j: number = 0; j < lookupRange.length; j++) {
    //         cellValue = this.getValueFromArg(lookupRange[j]);
    //         if (argArr[3].toUpperCase() === this.trueValue) {
    //             if (lookupValue === cellValue) {
    //                 return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
    //             } else if (this.parseFloat(lookupValue) === this.parseFloat(cellValue)) {
    //                 return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
    //             } else if (this.parseFloat(lookupValue) < minValue) {
    //                 return this.getErrorStrings()[CommonErrors.na];
    //             } else if (this.parseFloat(lookupValue) > maxValue) {
    //                 const index: number = findMaxValue.indexOf(maxValue.toString());
    //                 return this.getValueFromArg(lookupCell + index).split(this.tic).join('');
    //             }
    //         }
    //         if (argArr[3] === this.falseValue) {
    //             if (lookupValue === cellValue) {
    //                 return this.getValueFromArg(lookupCell + j);
    //             }
    //         }
    //     }
    //     return this.getErrorStrings()[CommonErrors.na];
    // }

    public findWildCardValue(lookVal: string, cellValue: string): string {
        let finalText: string = '';
        if (lookVal.indexOf('?') > -1) {
            const index: number = lookVal.indexOf('?');
            const checStr1: string = lookVal[index - 1];
            const checStr2: string = lookVal[index + 1];
            if (cellValue.indexOf(checStr1) > -1 && cellValue.indexOf(checStr2) > -1) {
                const newIndex: number = cellValue.indexOf(checStr1);
                if (cellValue[newIndex] === checStr1 && cellValue[newIndex + 2] === checStr2) {
                    finalText = lookVal;
                } else {
                    finalText = cellValue;
                }

            } else {
                finalText = cellValue;
            }
        } else if (lookVal.indexOf('*') > -1) {
            const index: number = lookVal.indexOf('*');
            let left: string = '';
            let right: string = '';
            let compRight: string = this.falseValue;
            let compLeft: string = this.falseValue;
            for (let i: number = index - 1; i >= 0; i--) {
                left = left + lookVal[i];
                compLeft = this.trueValue;
            }
            for (let i: number = index + 1; i < lookVal.length; i++) {
                right = right + lookVal[i];
                compRight = this.trueValue;
            }
            const leftVal: number = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            const rightVal: number = right === '' ? -1 : cellValue.indexOf(right);
            if (leftVal > -1 || rightVal > -1) {
                if (compLeft === this.trueValue) {
                    finalText = (left.split('').reverse().join('') === cellValue.substr(0, left.length)) ? lookVal : cellValue;
                } else if (compRight === this.trueValue) {
                    finalText = (right === cellValue.substring(cellValue.length - right.length, cellValue.length)) ? lookVal : cellValue;
                }
            } else {
                finalText = cellValue;
            }
        }
        return finalText;
    }

    /** @hidden */
    /* eslint-disable-next-line */
    public getComputeSumIfValue(criteriaRange: string[] | string, sumRange: string[] | string, criteria: string, checkCriteria: number, op: string, isAsterisk: boolean): number[] {
        let sum: number = 0;
        let count: number = 0;
        const isFirst: boolean = isAsterisk && criteria && criteria[0] === '*';
        switch (op) {
        case this.parser.tokenEqual: {
            const criteriaValue: string = isAsterisk ? criteria.replace(/\*/g, '') : criteria;
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (value === criteria && val === checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                } else if (value === criteria) {
                    sum = sum + this.getValueFromRange(sumRange, i);
                    count = count + 1;
                } else if (isAsterisk && criteriaValue && value) {
                    if (criteria[0] === '*' && criteriaValue.length <= value.length && criteriaValue === value.slice(
                        0, criteriaValue.length)) {
                        sum = sum + this.getValueFromRange(sumRange, i);
                        count = count + 1;
                    }
                    if (criteria[criteria.length - 1] === '*' && criteriaValue.length <= value.length && criteriaValue ===
                        value.slice(value.length - criteriaValue.length, value.length)) {
                        sum = sum + this.getValueFromRange(sumRange, i);
                        count = count + 1;
                    }
                }
            }
        }
            break;
        case this.parser.tokenLess: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val < checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                }
            }
        }
            break;
        case this.parser.tokenGreater: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val > checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                }
            }
        }
            break;
        case this.parser.tokenLessEq: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val <= checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                }
            }
        }
            break;
        case this.parser.tokenGreaterEq: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (val >= checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                }
            }
        }
            break;
        case this.parser.tokenNotEqual: {
            for (let i: number = 0; i < criteriaRange.length; i++) {
                const value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                const val: number = this.parseFloat(value);
                if (value !== criteria && val !== checkCriteria) {
                    const value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                    const val1: number = this.parseFloat(value1);
                    sum = sum + val1;
                    count = count + 1;
                }
            }
        }
            break;
        }
        return [sum, count];
    }

    private getValueFromRange(sumRange: string[] | string, index: number): number {
        let sumRangeVal: string | number = sumRange[index];
        sumRangeVal = this.getValueFromArg(sumRangeVal);
        return this.parseFloat(sumRangeVal.toString());
    }

    /**
     * @hidden
     * @param {string[]} args - specifies the args
     * @param {string} op - specify the operator.
     * @returns {string} - Compute and or.
     */
    public computeAndOr(args: string[], op: string): string {
        let result: boolean = op === 'and' ? true : false;
        let value: string;
        let parseVal: number;
        if (args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let l: number = 0, len: number = args.length; l < len; l++) {
            if (args[l].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        const ranges: string[] = args;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[i] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.value];
            }
            if (ranges[i].indexOf(':') > -1 && this.isCellReference(ranges[i])) {
                const cells: string[] | string = this.getCellCollection(ranges[i]);
                for (let j: number = 0; j < cells.length; j++) {
                    if (this.getErrorStrings().indexOf(cells[j]) > -1) {
                        return cells[j];
                    } else if (cells[j][0] === this.tic) {
                        return this.getErrorStrings()[CommonErrors.name];
                    }
                    value = this.getValueFromArg(cells[j]);
                    if (value === '') {
                        value = this.trueValue;
                    }
                    if (this.getErrorStrings().indexOf(value) > -1) {
                        return value;
                    }
                    parseVal = this.parseFloat(value);
                }
            } else {
                value = this.getValueFromArg(ranges[i]).split(this.tic).join('').toUpperCase();
                if (this.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                const tempdate: number = Date.parse(value.split(this.tic).join(''));
                if (!isNaN(tempdate)) {
                    result = true;
                } else if (!(value === this.trueValue || value === this.falseValue)) {
                    return this.getErrorStrings()[CommonErrors.value].toString();
                }
                parseVal = this.parseFloat(value);
            }
            result = op === 'and' ? (result && ((value === this.trueValue) || !(isNaN(parseVal)))) :
                (result || ((value === this.trueValue) || !(isNaN(parseVal))));
        }
        return result ? this.trueValue : this.falseValue;
    }

    /**
     * @hidden
     * @param {string} text - specify the text
     * @returns {string} - to strip out the tic from the formula arguments.
     */
    // To strip out the tic from the formula arguments.
    public removeTics(text: string): string {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    }

    /**
     * @hidden
     * @param {string} range - specify the range
     * @returns {string} - to get cell from the range.
     */
    public getCellFrom(range: string): string {
        let cellRange: string = '';
        const cells: string[] = range.indexOf(':') > -1 ? range.split(':') : [range];
        //this.getCellsFromArgs(range);
        const last: number = cells.length - 1;
        const r1: number = this.rowIndex(cells[0]);
        let x: number;
        if (r1 === this.rowIndex(cells[last])) {
            const c1: number = this.colIndex(cells[0]);
            const c2: number = this.colIndex(cells[last]);
            const c: number = this.colIndex(this.cell);
            if (c >= c1 && c <= c2) {
                cellRange = getAlphalabel(c).toString() + r1.toString();
            }
        } else if (this.colIndex(cells[0]) === this.colIndex(cells[last])) {
            x = this.colIndex(cells[0]);
            const r2: number = this.rowIndex(cells[last]);
            const r: number = this.rowIndex(this.cell);
            if (r >= r1 && r <= r2) {
                cellRange = getAlphalabel(x).toString() + r.toString();
            }
        }
        return cellRange;
    }

    private computeValue(pFormula: string): string {
        try {
            const stack: string[] = [];
            let i: number = 0;
            let sheet: string = '';
            stack.length = 0;
            while (i < pFormula.length) {
                let uFound: boolean = pFormula[i] === 'u';    // for 3*-2
                if (pFormula[i] === this.arithMarker) {
                    i = i + 1;
                    continue;
                } else if (this.isDigit(pFormula[i])) {
                    let s: string = this.emptyString;
                    while (i < pFormula.length && (this.isDigit(pFormula[i]) || pFormula[i] === this.parseDecimalSeparator)) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s);
                    if (!pFormula[i]) {
                        return stack.toString();
                    }
                }
                if (pFormula[i] === this.sheetToken) {
                    sheet = pFormula[i];
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.sheetToken) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                    if (i < pFormula.length) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                } else if (this.isUpperChar(pFormula[i])) {
                    let s: string = this.emptyString;
                    let textName: string = '';
                    while ( i < pFormula.length && this.isUpperChar(pFormula[i])) {
                        const char: string = pFormula[i];
                        s = s + char;
                        i = i + 1;
                    }
                    while ( i < pFormula.length && this.isDigit(pFormula[i])) {
                        const digit: string = pFormula[i];
                        s = s + digit;
                        i = i + 1;
                    }
                    if (i < pFormula.length && pFormula[i] === ':') {
                        s = s + pFormula[i];
                        i = i + 1;
                        if (i < pFormula.length && pFormula[i] === this.sheetToken) {
                            s = s + pFormula[i];
                            i = i + 1;
                            while (i < pFormula.length && pFormula[i] !== this.sheetToken) {
                                s = s + pFormula[i];
                                i = i + 1;
                            }
                        }
                        while (i < pFormula.length && this.isUpperChar(pFormula[i])) {
                            s = s + pFormula[i];
                            i = i + 1;
                        }
                        while (i < pFormula.length && this.isDigit(pFormula[i])) {
                            s = s + pFormula[i];
                            i = i + 1;
                        }
                        s = sheet + this.getCellFrom(s);
                    } else {
                        s = sheet + s;
                    }
                    textName = this.getParentObjectCellValue(s).toString();
                    if (typeof textName === 'string' && this.getErrorStrings().indexOf(textName) > -1) {
                        return textName;
                    }
                    stack.push(textName);
                } else if (pFormula[i] === 'q') {
                    const leftIdx: number = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    const j: number = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
                    pFormula = this.substring(pFormula, i + leftIdx + 2, j - 1);
                } else if (pFormula[i] === this.tic[0]) {
                    let s: string = pFormula[i].toString();
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s.split(this.tic).join(this.emptyString));
                    i = i + 1;
                } else if (pFormula[i] === '%' && stack.length > 0) {
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
                } else if (pFormula[i] === this.tic[0] || pFormula[i] === '|') {
                    let s: string = pFormula[i].toString();
                    i++;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s + this.tic);
                    i += 1;
                } else {
                    switch (pFormula[i]) {
                    case '#':
                        {
                            let errIndex: number = 0;
                            if (this.getErrorStrings().indexOf(pFormula.substring(i)) > -1) {
                                if (pFormula.indexOf('!') === -1 || pFormula.substring(i).indexOf('!') === -1) {
                                    errIndex = pFormula.indexOf('#N/A') > -1 ?
                                        (pFormula.indexOf('#N/A') + 4 + i) : pFormula.indexOf('?') + 1 + i;
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
                            if (pFormula.substring(i).indexOf('Infinity') === 0) {
                                s = 'Infinity';
                                i += s.length;
                            } else {
                                if (pFormula[i] === 'u' || uFound) {
                                    s = '-';
                                    if (!uFound) {
                                        i = i + 1;
                                    } else {
                                        uFound = false;
                                    }
                                }
                                while (i < pFormula.length && (this.isDigit(pFormula[i]))
                                    || pFormula[i] === this.getParseDecimalSeparator()) {
                                    s = s + pFormula[i];
                                    i = i + 1;
                                }
                                if (i < pFormula.length && pFormula[i] === '%') {
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
                            stack.push(s);
                        }
                        break;
                    case this.parser.tokenAdd:
                        {
                            this.getValArithmetic(stack, 'add');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenSubtract:
                        {
                            this.getValArithmetic(stack, 'sub');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenMultiply:
                        {
                            this.getValArithmetic(stack, 'mul');
                            i = i + 1;
                        }
                        break;
                    case this.parser.tokenDivide:
                        {
                            this.getValArithmetic(stack, 'div');
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
                            this.processLogical(stack, 'notEq');
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
                            this.processLogical(stack, 'equal');
                            i = i + 1;
                        }
                        break;
                    default: {
                        return this.getErrorStrings()[CommonErrors.value];
                    }
                    }
                }
            }
            if (stack.length === 0) {
                return this.emptyString;
            } else {
                let s: string = this.emptyString;
                let countValue: number = stack.length;
                while (countValue > 0) {
                    s = stack.pop() + s;
                    if (s === this.emptyString && this.isCellReference(pFormula) &&
                        this.getTreatEmptyStringAsZero()) {
                        return '0';
                    }
                    countValue--;
                }
                return s;
            }
        } catch (ex) {
            if (this.getErrorStrings().indexOf(ex) > -1 || this.formulaErrorStrings.indexOf(ex) > -1) {
                throw ex;
            }
            throw new FormulaError(this.formulaErrorStrings[FormulasErrorsStrings.invalid_expression]);
        }
    }

    private getValArithmetic(stack: string[], operator: string): void {
        let num1: string = stack.pop();
        num1 = num1 === this.emptyString ? '0' : num1;
        let num: number = Number(num1);
        if (isNaN(num)) {
            if (num1 === this.getErrorStrings()[CommonErrors.divzero]) {
                throw this.getErrorStrings()[CommonErrors.divzero];
            } else {
                throw this.getErrorStrings()[CommonErrors.value];
            }
        }
        let num2: string = stack.pop();
        num2 = num2 === this.emptyString ? (stack.length ? stack.pop() : '0') : num2;
        num = Number(num2);
        if (isNaN(num)) {
            if (num1 === this.getErrorStrings()[CommonErrors.divzero]) {
                throw this.getErrorStrings()[CommonErrors.divzero];
            } else {
                throw this.getErrorStrings()[CommonErrors.value];
            }
        }
        if (operator === 'add') {
            stack.push((Number(num2) + Number(num1)).toString());
        }
        if (operator === 'sub') {
            stack.push((Number(num2) - Number(num1)).toString());
        }
        if (operator === 'mul') {
            stack.push((Number(num2) * Number(num1)).toString());
        }
        if (operator === 'div') {
            if (this.isNaN(this.parseFloat(num1)) || this.isNaN(this.parseFloat(num2))) {
                stack.push(this.getErrorStrings()[CommonErrors.value]);
            } else if (this.parseFloat(num1) === 0) {
                stack.push(this.getErrorStrings()[CommonErrors.divzero]);
            } else {
                stack.push((Number(num2) / Number(num1)).toString());
            }
        }
    }

    /**
     * @hidden
     * @param {string[]} stack - specify the stack
     * @param {string} operator - specify the operator.
     * @returns {string} - To process the logical.
     */
    public processLogical(stack: string[], operator: string): string {
        let val1: string;
        let val2: string;
        let value1: number | string;
        let value2: number | string;
        if (operator !== 'and' && operator !== 'equal') {
            val1 = stack.pop();
            val2 = stack.pop();
            value1 = val1.indexOf(this.tic) > -1 ? val1 : this.parseFloat(val1);
            value2 = val2.indexOf(this.tic) > -1 ? val2 : this.parseFloat(val2);
        }
        let result: string;
        if (operator === 'less') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 < value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) < 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greater') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 > value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) > 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'lessEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 <= value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) <= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greaterEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 >= value1) ? this.trueValue : this.falseValue;
            } else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) >= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'notEq') {
            result = (val2 !== val1) ? this.trueValue : this.falseValue;
        }
        if (operator === 'and') {
            val1 = stack.pop().toString();
            val2 = '';
            if (stack.length > 0) {
                val2 = stack.pop().toString();
            }
            result = this.emptyString + val2 + val1 + this.emptyString;
            result = result.split(this.tic).join('');
        }
        if (operator === 'equal') {
            val1 = stack.pop().toString();
            val2 = stack.pop().toString();
            if (val2 === '' && val1 !== '') {
                val2 = '0';
            }
            result = val1 === val2 ? this.trueValue : this.falseValue;
        }
        if (operator === 'or') {
            result = Math.pow(this.parseFloat(value2), this.parseFloat(value1)).toString();
        }
        stack.push(result);
        return result;
    }

    /**
     * @hidden
     * @param {StoredCellInfo} sCell - specified the cell information
     * @returns {string[]} - compute stored cells
     */
    public computeStoreCells(sCell: StoredCellInfo): string[] {
        const cellValue: string | string[] = sCell.cellValue;
        const cellRanges: string[] = sCell.cellRange;
        const criterias: string[] = sCell.criteria;
        const argArr: string[] = sCell.argArray;
        let isCriteria: string = sCell.isCriteria;
        let storeCell: string[] = sCell.storedCells;
        const isCountIfs: string = sCell.isCountIfS;
        const i: number = sCell.countVal;
        const rangeLength: string[] | string = isCriteria === this.trueValue ? storeCell : cellValue;
        let tempStoredCell: string[] = [];
        for (let j: number = 0; j < rangeLength.length; j++) {
            const stack: string[] = [];
            let cellVal: string = this.getValueFromArg(cellValue[j]);
            let criteria: string;
            let newCell: string = '';
            criteria = argArr[2].split(this.tic).join(this.emptyString);
            criteria = this.isCellReference(criteria) ? this.getValueFromArg(criteria) : criteria;
            isCriteria = isCountIfs === this.trueValue ? this.trueValue : isCriteria;
            if (isCriteria === this.trueValue) {
                let cell: string = '';
                let count: number = 0;
                let newCount: number = 0;
                storeCell[j] = isCountIfs === this.trueValue && i === 0 ? cellValue[j] : storeCell[j];
                cell = storeCell[j];
                // convert the new cell ranges  for find in range with criteria.
                while (!this.isDigit(cell[count])) {
                    count = count + 1;
                }
                if (this.isCellReference(cellRanges[i]) && cellRanges[i].indexOf(':') > -1) {
                    const k: number = cellRanges[i].indexOf(':');
                    newCell = this.substring(cellRanges[i], k);
                    while (!this.isDigit(newCell[newCount])) {
                        newCount = newCount + 1;
                    }
                }
                const cellAlpha: string = this.substring(cell, count);
                const newCellAlpha: string = this.substring(newCell, newCount);
                newCell = storeCell[j].split(cellAlpha).join(newCellAlpha);
                cellVal = this.getValueFromArg(newCell);
                criteria = isCountIfs === this.trueValue ? criterias[i].split(this.tic).join(this.emptyString) :
                    criterias[i - 1].split(this.tic).join(this.emptyString);
            }
            let op: string = 'equal';
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
            if (criteria.indexOf('*') > -1 || criteria.indexOf('?') > -1) {
                cellVal = this.findWildCardValue(criteria, cellVal);
            }
            stack.push(cellVal.toLowerCase());
            stack.push(criteria.toLowerCase());
            if (this.processLogical(stack, op) === this.trueValue) {
                if (isCriteria === this.falseValue) {
                    tempStoredCell.push(cellValue[j]);
                } else {
                    tempStoredCell.push(newCell);
                }
            }
        }
        storeCell = tempStoredCell;
        tempStoredCell = [];
        return storeCell;
    }
    public computeIfsFormulas(range: string[], isCountIfs?: string, isAvgIfs?: string): string | number {
        if (isNullOrUndefined(range) || range[0] === '' || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        const argArr: string[] = range;
        const argCount: number = argArr.length;
        if (argCount < 2 || argCount > 127) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellRanges: string[] | string = [];
        const criterias: string[] | string = [];
        let storedCell: string[] | string = [];
        let storedCellLength: number = 0;
        let sum: number = 0;
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                cellRanges.push(argArr[i]);
            } else {
                criterias.push(argArr[i]);
            }
        }
        cellRanges = cellRanges.toString().split(',,').join(',');
        cellRanges = cellRanges.split(this.getParseArgumentSeparator());
        const len: number[] = [];
        for (let i: number = 0; i < cellRanges.length; i++) {
            len.push(this.getCellCollection(cellRanges[i]).length);
        }
        for (let j: number = 0; j < len.length; j++) {
            if (len[j] && len[j + 1] && len[j] !== len[j + 1]) {
                return this.getErrorStrings()[CommonErrors.value];
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
                return isAvgIfs === this.trueValue ? this.getErrorStrings()[CommonErrors.divzero] : 0;
            }
        }
        // Compare criteria and convert the new cell ranges.
        const startRange: number = isCountIfs === this.trueValue ? 0 : 2;
        for (let i: number = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i]);
            const sCell: StoredCellInfo = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        let avgValCount = 0;
        for (let j: number = 0; j < storedCell.length; j++) {
            // convert the new cell ranges  for find sum in range 0(first range)
            let cell: string = '';
            let newCell: string = '';
            let count: number = 0;
            let newCount: number = 0;
            cell = storedCell[j];
            while (!this.isDigit(cell[count])) {
                count = count + 1;
            }
            if (this.isCellReference(cellRanges[0]) && cellRanges[0].indexOf(':') > -1) {
                const k: number = cellRanges[0].indexOf(':');
                newCell = this.substring(cellRanges[0], k);
                while (!this.isDigit(newCell[newCount])) {
                    newCount = newCount + 1;
                }
            }
            const cellAlpha: string = this.substring(cell, count);
            const newCellAlpha: string = this.substring(newCell, newCount);
            cellvalue = storedCell[j].split(cellAlpha).join(newCellAlpha);
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            } else {
                avgValCount++;
                const argValue: string = this.getValueFromArg(cellvalue);
                sum = sum + parseFloat(argValue === '' ? '0' : argValue);
            }
        }
        if (isAvgIfs === this.trueValue) { sum = sum / avgValCount; }
        return sum;
    }
    private processNestedFormula(pText: string, sFormula: string, fResult: string | number): string {
        const interiorCalcFString: string = pText.split(sFormula).join('n' + fResult);
        return interiorCalcFString;
    }

    /**
     * @hidden
     * @param {string | number} value - Specify the value
     * @returns {boolean} -  Returns boolean value
     */
    public isNaN(value: string | number): boolean {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    }

    /**
     * @hidden
     * @param {number} doubleNumber - To specify the double number
     * @returns {Date} - Returns date.
     */
    public fromOADate(doubleNumber: number): Date {
        const result: Date = new Date();
        result.setTime((doubleNumber * this.millisecondsOfaDay) + Date.parse(this.oaDate.toString()));
        return result;
    }

    /**
     * @hidden
     * @param {number} year - Specify the year.
     * @param {number} month - Specify the month.
     * @param {number} day - Specify the day.
     * @returns {number} -  to get serial date from date.
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
                tempDay = new Date(year, month, 1, -1).getDate();
                day = tempDay - day;
            }
        }
        const dateTime: number = Date.parse(year.toString() + this.getParseDateTimeSeparator() + month.toString() +
            this.getParseDateTimeSeparator() + day.toString());
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    }

    /**
     * @hidden
     * @param {Date} dateTime - Specify the date Time
     * @returns {number} -  returns to date.
     */
    public toOADate(dateTime: Date): number {
        const result: number = (dateTime.getTime() - Date.parse(this.oaDate.toString())) / this.millisecondsOfaDay;
        return result;
    }

    /**
     * @hidden
     * @param {string} date - Specify the date
     * @returns {string} -  returns calculate Date
     */
    public calculateDate(date: string): string {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    }

    /**
     * @hidden
     * @param {string} s - Specify the s
     * @returns {boolean} -  returns boolean value.
     */
    public isTextEmpty(s: string): boolean {
        return s === null || s === '';
    }

    /**
     * @hidden
     * @param {string} text - Specify the text
     * @returns {boolean} -  returns boolean value.
     */
    public isDigit(text: string): boolean {
        const charCode: number = text.charCodeAt(0);
        if ((charCode > 47) && (charCode < 58)) {
            return true;
        }
        return false;
    }

    private findLastIndexOfq(fString: string): number {
        return fString.lastIndexOf('q');
    }

    /**
     * To get the exact value from argument.
     *
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns {string} - To get the exact value from argument.
     */
    public getValueFromArg(arg: string): string {
        arg = arg.trim();
        let s: string | number = arg;
        let dateTime: Date = this.dateTime1900;
        let pObjCVal: string | number = s;
        if (isNullOrUndefined(s) || this.isTextEmpty(s)) {
            return s;
        } else if (arg[0] === this.tic || arg[0] === this.singleTic) {
            dateTime = this.isDate(arg.split(this.tic).join(''));
            if (this.isNaN(this.parseFloat(arg.split(this.tic).join(''))) && !isNullOrUndefined(dateTime) &&
                !this.isNaN(dateTime.getDate()) && this.dateTime1900 <= dateTime) {
                return this.toOADate(dateTime).toString();
            }
            return arg;
        } else {
            arg = arg.split('u').join('-');
            if (!this.isUpperChar(s[0]) && (this.isDigit(s[0]) || s[0] === this.getParseDecimalSeparator() || s[0] === '-' || s[0] === 'n')) {
                if (s[0] === 'n') {
                    s = s.substring(1);
                    if (s.indexOf('"n') > - 1) {
                        s = s.replace('"n', '"');
                    }
                }
                return s;
            }
        }
        const symbolArray: string[] = ['+', '-', '/', '*', ')', ')', '{'];
        if ((this.parser.indexOfAny(s, symbolArray) === -1 && this.isUpperChar(s[0])) || s[0] === this.sheetToken) {
            if (s !== this.trueValue && s !== this.falseValue && this.isCellReference(s)) {
                const f: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
                if (f.sheetNameToParentObject !== null && f.sheetNameToParentObject.size > 0 && s.indexOf(this.sheetToken) === -1) {
                    const token: string = f.parentObjectToToken.get(this.grid);
                    s = token + s;
                }
            }
            if (s === this.cell) {
                const dependent: string[] = this.getDependentCells().get(s);
                if (dependent != null && dependent.indexOf(s) > -1) {
                    this.arrayRemove(dependent, s);
                }
                if (!this.getDependentFormulaCells().has(this.cell)) {
                    this.clearFormulaDependentCells(this.cell);
                }
                // eslint-disable-next-line no-throw-literal
                throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference] + s;
            }
            pObjCVal = this.getParentObjectCellValue(s);
            this.updateDependentCell(s);
            return pObjCVal.toString();
        }
        if (this.getErrorStrings().indexOf(arg) > -1) {
            return arg;
        }
        return this.computeValue(pObjCVal.toString());
    }

    /* eslint-disable-next-line */
    public isDate(date: any): Date {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            const dateval: Date = new Date(Date.parse(date));
            if (dateval >= this.dateTime1900) {
                return dateval;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    private isValidCellReference(text: string): boolean {
        const start: number = 0;
        let end: number = 0;
        let j: number = 0;
        const numArr: number[] = [89, 71, 69];
        let cellTxt: string = this.emptyString;
        if (this.namedRanges.has(text)) {
            return false;
        }
        for (let i: number = 0; i < text.length; i++) {
            if (this.isChar(text[i])) {
                end++;
            }
        }
        cellTxt = text.substring(start, end);
        if (cellTxt.length < 4) {
            while (j < cellTxt.length) {
                if (!isNullOrUndefined(cellTxt[j]) && cellTxt[j].charCodeAt(0) < numArr[j]) {
                    j++;
                    continue;
                } else if (isNullOrUndefined(cellTxt[j]) && j > 0) {
                    break;
                } else {
                    return false;
                }
            }
            const cellNum: number = this.parseFloat(text.substring(end, text.length));
            if (cellNum < 1048576) { // Maximum number of rows in excel.
                return true;
            }
        }
        return false;
    }

    /** @hidden */
    /* eslint-disable-next-line */
    public parseDate(date: any): any {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            const d: number = parseInt(date, 10);
            if (d < 0) {
                return this.getErrorStrings()[CommonErrors.num];
            }
            if (d <= 60) {
                return new Date(this.dateTime1900.getTime() + (d - 1) * 86400000);
            }
            return new Date(this.dateTime1900.getTime() + (d - 2) * 86400000);
        }
        if (typeof date === 'string') {
            date = new Date(date);
            if (!this.isNaN(date)) {
                return date;
            }
        }
        return this.getErrorStrings()[CommonErrors.value];
    }

    /**
     * @hidden
     * @param {string} args - Specify the args
     * @returns {boolean} - Returns boolean value.
     */
    public isCellReference(args: string): boolean {
        if (args === this.emptyString) {
            return false;
        }
        args = args.trim();
        args = this.setTokensForSheets(args);
        const sheetToken1: string = this.getSheetToken(args);
        let containsBoth: boolean = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join(this.emptyString);
        }
        let isAlpha: boolean = false;
        let isNum: boolean = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        const charArray: string[] = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
        for (let c: number = 0; c < charArray.length; c++) {
            if (this.isChar(charArray[c])) {
                isAlpha = true;
            } else if (this.isDigit(charArray[c])) {
                isNum = true;
            } else if (charArray[c] === ':') {
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
            if (containsBoth && isAlpha && isNum) {
                return true;
            } else if (((isAlpha && !isNum) || (!isAlpha && isNum)) && !containsBoth) {
                return true;
            } else {
                return false;
            }
        }
        if (isAlpha && isNum && args.indexOf(this.tic) === -1) {
            return true;
        }
        return false;
    }

    /**
     * @hidden
     * @param {string} text - Specify the text.
     * @returns {string} - set Tokens For Sheets.
     */
    public setTokensForSheets(text: string): string {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        const sortedSheetNamesCollection: string[] = this.getSortedSheetNames();
        if (sortedSheetNamesCollection != null) {
            for (let n: number = 0; n < sortedSheetNamesCollection.length; n++) {
                let token: string = family.sheetNameToToken.get(sortedSheetNamesCollection[n]);
                token = token.split(this.sheetToken).join(this.tempSheetPlaceHolder);
                let s: string = this.singleTic + 'SHEET' + sortedSheetNamesCollection[n] + this.singleTic + this.sheetToken;
                if (text.indexOf(s) === -1) {
                    s = 'SHEET' + sortedSheetNamesCollection[n] + this.sheetToken;
                }
                text = text.split(s).join(token);
                s = sortedSheetNamesCollection[n] + this.sheetToken;
                text = text.split(s).join(token);
            }
        }
        text = text.split(this.tempSheetPlaceHolder).join(this.sheetToken);
        if (text.indexOf('!!') > -1) {
            text = text.replace('!!', '!');
            const textSplit: string[] = text.split('');
            textSplit[1] = (parseInt(textSplit[1], 10) + 1).toString();
            text = textSplit.join('');
        }
        return text;
    }

    private getParentObjectCellValue(val: string): string | number {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        const i: number = val.lastIndexOf(this.sheetToken);
        let row: number = 0;
        let col: number = 0;
        const grid: Object = this.grid;
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
        if (i > -1 && family.tokenToParentObject !== null) {
            this.grid = family.tokenToParentObject.get(val.substring(0, i + 1));
            row = this.rowIndex(val);
            col = this.colIndex(val);
        } else if (i === -1) {
            let j: number = 0;
            while (j < val.length && this.isChar(val[j])) {
                j++;
            }
            if (j === val.length) {
                val = val.toLowerCase();
                return val === '' ? this.getErrorStrings()[CommonErrors.value] : this.getErrorStrings()[CommonErrors.name];
            } else {
                row = this.rowIndex(val);
                col = this.colIndex(val);
                if (family.isSheetMember && family.parentObjectToToken != null) {
                    val = family.parentObjectToToken.get(this.grid) + val;
                }
            }
        }
        const saveCell: string = (this.cell === '' || this.cell === null) ? '' : this.cell;
        this.cell = val;
        if (saveCell === this.cell) {
            throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference];
        }
        const cValue: string | number = this.getParentCellValue(row, col, this.grid, saveCell, grid);
        this.grid = grid;
        this.cell = saveCell;
        return cValue;
    }

    private getParentCellValue(row: number, col: number, grd: Object, fromCell: string, fromCellGrid: Object): number | string {
        // formulainfotable
        let cValue: number | string;
        if ((this.parentObject as any).getValueRowCol === undefined) {
            cValue = this.getValueRowCol(this.getSheetID(grd), row, col);
        } else {
            if (fromCell) { fromCell = fromCellGrid === grd ? '' : fromCell + this.getSheetID(fromCellGrid); }
            cValue = (this.parentObject as any).getValueRowCol(this.getSheetID(grd), row, col, fromCell);
            return isNullOrUndefined(cValue) ? this.emptyString : cValue.toString();
        }
        if (cValue === '' || cValue === undefined) {
            cValue = '';
        }
        // if (cValue[cValue.length - 1] == ("%") && !this.isNaN(d)) {
        //     cValue = (Number(d) / 100).toString();
        // }
        return cValue;
    }

    /**
     * Getting the formula result.
     *
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns {string} - Getting the formula result.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getValueRowCol(grid: Object, row: number, col: number): string {
        const key: string = this.rowsToKeyMap.get(row).toString();
        let result: string = this.getKeyValue(key).toString();
        if (result != null && result[result.length - 1] === ('%') && result.length > 1) {
            const d: number = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    }

    /**
     * To add custom library formula.
     *
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns {void} - To add custom library formula.
     */
    public defineFunction(formulaName: string, functionName: string | Function): void {
        if (typeof functionName === 'string') {
            functionName = getValue(functionName, window);
        }
        formulaName = formulaName.toUpperCase();
        this.libraryFormulas.set(formulaName, { handler: functionName as Function, isCustom: true });
    }

    /**
     * Specifies when changing the value.
     *
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     * @param {number[]} usedRangeCol - Specify the used range collection.
     * @returns {void} - Specifies when changing the value.
     */
    public valueChanged(grid: string, changeArgs: ValueChangedArgs, isCalculate?: boolean, usedRangeCol?: number[]): void {
        const pgrid: string = grid; this.spreadSheetUsedRange = usedRangeCol;
        this.grid = grid;
        let isComputedValueChanged: boolean = true;
        let isCompute: boolean = true;
        const calcFamily: CalcSheetFamilyItem = this.getSheetFamilyItem(pgrid);
        let cellTxt: string = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        this.actCell = cellTxt;
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            const token: string = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        const argVal: string = changeArgs.getValue().toUpperCase();
        if (argVal.indexOf('=RAND()') > - 1 || argVal.indexOf('RAND()') > - 1 || argVal.indexOf('=RANDBETWEEN(') > - 1 ||
            argVal.indexOf('RANDBETWEEN(') > - 1 || this.randomValues.has(cellTxt)) {
            let randStrVal: string = this.randCollection.toString();
            if (!this.randomValues.has(cellTxt)) {
                this.randomValues.set(cellTxt, changeArgs.getValue());
                this.randCollection.push(cellTxt);
                this.isRandomVal = true;
            } else if (this.randomValues.has(cellTxt)) {
                if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > - 1 ||
                    argVal.indexOf('RANDBETWEEN(') > - 1) {
                    this.randomValues.set(cellTxt, changeArgs.getValue());
                } else if (changeArgs.getValue().toUpperCase() !== this.randomValues.get(cellTxt.toUpperCase())) {
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
        if (changeArgs.getValue() && changeArgs.getValue()[0] === this.getFormulaCharacter()) {
            this.cell = cellTxt;
            let formula: FormulaInfo;
            if (!isNullOrUndefined(isCompute)) {
                isCompute = isCalculate;
            }
            if (this.getFormulaInfoTable().has(cellTxt)) {
                formula = this.getFormulaInfoTable().get(cellTxt);
                if (changeArgs.getValue() !== formula.getFormulaText() || formula.getParsedFormula() == null) {
                    formula.setFormulaText(changeArgs.getValue());
                    if (this.getDependentFormulaCells().has(this.cell)) {
                        this.clearFormulaDependentCells(this.cell);
                    }
                    try {
                        formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                    } catch (ex) {
                        formula.setFormulaValue(ex);
                        isCompute = false;
                    }
                }
                if (isCompute) {
                    this.parser.isFormulaParsed = true;
                    const cValue: string | number = this.computeFormula(formula.getParsedFormula());
                    isComputedValueChanged = (cValue !== formula.getFormulaValue());
                    formula.setFormulaValue(cValue);
                }
            } else {
                formula = new FormulaInfo();
                formula.setFormulaText(changeArgs.getValue());
                if (!this.getDependentFormulaCells().has(cellTxt)) {
                    this.getDependentFormulaCells().set(cellTxt, new Map<string, string>());
                }
                try {
                    formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                } catch (ex) {
                    formula.setFormulaValue(ex);
                    isCompute = false;
                }
                if (isCompute) {
                    formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                }
                if (this.getFormulaInfoTable().has(cellTxt)) {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                } else {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                }
            }
            if (isCompute) {
                /* eslint-disable */
                if ((this.parentObject as any).setValueRowCol === undefined) {
                    this.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                } else {
                    (this.parentObject as any).setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
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
            this.getDependentCells().get(cellTxt).toString() !== cellTxt) {
            this.getComputedValue().clear();
            this.refresh(cellTxt);
        }
    }

    /**
     * @hidden
     * @returns {Map<string, string | number>} - To get computed value.
     */
    public getComputedValue(): Map<string, string | number> {
        if (this.computedValues === null) {
            this.computedValues = new Map<string, string | number>();
        }
        return this.computedValues;
    }

    /**
     * @hidden
     * @param {number} value - specify the value
     * @param {string | number} formulaValue -  specify the formula value.
     * @param {number} row - specify the row
     * @param {number} col - specify the col.
     * @returns {void} - to set value row and column.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setValueRowCol(value: number, formulaValue: string | number, row: number, col: number): void {
        /* No Implementation */
    }

    private getSortedSheetNames(): string[] {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            const arr: string[] = [];
            family.sheetNameToToken.forEach((value: string, key: string) => {
                arr.push(key);
                arr.sort();
            });
            this.sortedSheetNames = arr;
            this.sortedSheetNames.sort();
            if (this.sortedSheetNames.length > 9 && this.sortedSheetNames[0].includes('1') && this.sortedSheetNames[1].includes('10')) {
                this.sortedSheetNames.splice(this.sortedSheetNames.indexOf('2'), 0, this.sortedSheetNames[0]);
                this.sortedSheetNames.splice(0, 1);
            }
        }
        return this.sortedSheetNames;
    }

    /**
     * @hidden
     * @param {string} error -  specify the string
     * @returns {string} - to get error line.
     */
    public getErrorLine(error: string): string {
        /* eslint-disable-next-line */
        let errorStack: string[] = (error as any).stack ? (error as any).stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    }

    /** @hidden
     * @returns {number} - to return the sheet id
     */
    public createSheetFamilyID(): number {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    }

    /**
     * @hidden
     * @param {string[]} args - Specify the args.
     * @param {string} operation - Specify the operation.
     * @returns {string} - To compute min max.
     */
    public computeMinMax(args: string[], operation: string): string {
        let result: number;
        let argVal: string;
        let countStrVal: number = 0;
        if (isNullOrUndefined(args) || args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (let k: number = 0, len: number = args.length; k < len; k++) {
            if (args[k].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        result = (operation === 'max') ? this.minValue : this.maxValue;
        const argArr: string[] = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                const cellValue: string[] | string = this.getCellCollection(argArr[i]);
                for (let j: number = 0; j < cellValue.length; j++) {
                    argVal = this.getValueFromArg(cellValue[j]);
                    if (this.getErrorStrings().indexOf(argVal) > -1) {
                        return argVal;
                    }
                    const cellVal: number = this.parseFloat(argVal);
                    if (argVal === '' || this.isNaN(this.parseFloat(cellVal))) {
                        countStrVal = countStrVal + 1;
                        if (countStrVal === cellValue.length) {
                            result = 0;
                        }
                        continue;
                    } else {
                        result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                    }
                }
            } else {
                const val: string = this.getValueFromArg(argArr[i]);
                if (this.getErrorStrings().indexOf(val) > -1) {
                    return val;
                }
                const cellVal: number = this.parseFloat(val);
                if (val === '' || this.isNaN(this.parseFloat(cellVal))) {
                    countStrVal = countStrVal + 1;
                    if (countStrVal === argVal.length) {
                        result = 0;
                    }
                    continue;
                } else {
                    result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                }
            }
        }
        return result.toString();
    }

    /**
     * @hidden
     * @param {string[]} args - Specify the args.
     * @returns {string} - to calculate average.
     */
    public calculateAvg(args: string[]): string {
        let sumCell: number = 0;
        const argArr: string[] = args;
        let cellVal: string[] | string = [];
        let avgVal: number = 0;
        let countNum: number = 0;
        const countNum1: number = 0;
        for (let k: number = 0; k < argArr.length; k++) {
            if (argArr[k].indexOf(':') > -1 && this.isCellReference(argArr[k])) {
                countNum = 0;
                cellVal = this.getCellCollection(argArr[k]);
                avgVal = 0;
                for (let i: number = 0; i < cellVal.length; i++) {
                    const value: string = this.getValueFromArg(cellVal[i]);
                    if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                        continue;
                    }
                    avgVal = avgVal + this.parseFloat(value);
                    countNum = countNum + 1;
                }
                if (countNum === 0) {
                    return this.getErrorStrings()[CommonErrors.divzero];
                }
                avgVal = avgVal / countNum;
                sumCell = avgVal + sumCell;
            } else {
                if (argArr[k].indexOf(this.tic) > -1) {
                    if (isNaN(parseFloat(argArr[k].split(this.tic).join('')))) {
                        return this.getErrorStrings()[CommonErrors.value];
                    }
                }
                if (argArr[k].length === 0) {
                    argArr[k] = '1';
                }
                const value: string = this.getValueFromArg(argArr[k].split(this.tic).join(''));
                if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                    return this.getErrorStrings()[CommonErrors.name];
                }
                sumCell = sumCell + this.parseFloat(value);
            }
        }
        return (sumCell / (argArr.length - countNum1)).toString();
    }

    /**
     * @hidden
     * @param {string} refName - specify the reference name.
     * @param {Object | string } model - model - Specify the model.model
     * @param {number} sheetFamilyID - specify the sheet family id.
     * @returns {string} - register Grid As Sheet.
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
        return refName;
    }

    /**
     * @hidden
     * @param {string} refName - Specify the reference name
     * @param {string | Object} model - Specify the model
     * @param {boolean} unRegisterAll - Un registed all the availbe model.
     * @returns {void} - To un register grid sheet.
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
                if (unRegisterAll) { family.sheetDependentCells = new Map<string, string[]>(); }
            }
        });
    }

    /**
     * @hidden
     * @param {string} formula - Specify the formula
     * @returns {string | number} - To compute the expression.
     */
    public computeExpression(formula: string): string| number {
        const parsedFormula: string = this.parser.parseFormula(formula);
        const calcValue: string | number = this.computeFormula(parsedFormula);
        return calcValue;
    }

    private isSheetMember(): CalcSheetFamilyItem | boolean {
        const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    }

    /**
     * To dispose the calculate engine.
     *
     * @returns {void} - To dispose the calculate engine.
     */
    public dispose(): void {
        this.resetKeys();
        // this.dependentCells.clear();
        // this.dependentFormulaCells.clear();
        this.namedRanges.clear();
        // this.sheetFamiliesList.clear();
        this.lFormulas.clear();
    }

    public refreshRandValues(cellRef: string): void {
        let rowIdx: number;
        let colIdx: number;
        let value: string | number;
        let tokenRef: string = '';
        let stringCollection: string = this.randCollection.toString();
        let family: CalcSheetFamilyItem;
        if (this.randomValues.has(cellRef)) {
            this.randomValues.delete(cellRef);
            stringCollection = stringCollection.split(cellRef + this.parseArgumentSeparator).join('').split(
                this.parseArgumentSeparator + cellRef).join('').split(cellRef).join('');
            if (this.randomValues.size === 0 && stringCollection === '') {
                this.randomValues.clear();
                this.randCollection = [];
            } else {
                this.randCollection = stringCollection.split(this.parseArgumentSeparator);
            }
        }
        for (let i: number = 0; i < this.randomValues.size; i++) {
            rowIdx = this.rowIndex(this.randCollection[i]);
            colIdx = this.colIndex(this.randCollection[i]);
            tokenRef = (parseFloat(this.getSheetToken(this.randCollection[i]).split(this.sheetToken).join('')) + 1).toString();
            family = this.getSheetFamilyItem(tokenRef);
            this.grid = family.sheetNameToParentObject.get(tokenRef);
            value = this.randomValues.get(this.randCollection[i]);
            value = this.computeFormula(value);
            if ((<{ setValueRowCol: Function }>this.parentObject).setValueRowCol === undefined) {
                this.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            } else {
                (<{ setValueRowCol: Function }>this.parentObject).setValueRowCol(
                    this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            }
        }
    }

    public refresh(cellRef: string): void {
        if (this.dependencyLevel === 0) {
            this.refreshedCells.clear();
        }
        if (this.getDependentCells().has(cellRef) && this.getDependentCells().get(cellRef) !== null) {
            const family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            this.dependencyLevel = this.dependencyLevel + 1;
            try {
                const dependentCells: string[] = this.getDependentCells().get(cellRef);
                let i: number;
                for (i = 0; i < dependentCells.length; i++) {
                    const dCell: string = dependentCells[i];
                    const token: string = this.getSheetToken(dCell);

                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                    }
                    try {
                        const rowIdx: number = this.rowIndex(dCell);
                        const colIdx: number = this.colIndex(dCell);
                        const formulaInfo: FormulaInfo = this.getFormulaInfoTable().get(dCell);
                        let result: string | number;
                        if (formulaInfo) {
                            this.cell = dCell;
                            if (!this.getComputedValue().has(dCell)) {
                                this.parser.isFormulaParsed = true;
                                result = this.computeFormula(formulaInfo.getParsedFormula());
                                this.computedValues.set(dCell, result);
                            } else {
                                result = this.getComputedValue().get(dCell);
                            }
                            formulaInfo.setFormulaValue(result);
                        }
                        if ((<{ setValueRowCol: Function }>this.parentObject).setValueRowCol === undefined) {
                            this.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        } else {
                            (<{ setValueRowCol: Function }>this.parentObject).setValueRowCol(
                                this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        }
                        if (!this.refreshedCells.has(dCell)) {
                            this.refreshedCells.set(dCell, []);
                            this.refresh(dCell);
                        }
                    } catch (ex) {
                        continue;
                    }
                }
            } finally {
                this.grid = family.tokenToParentObject.get(this.getSheetToken(cellRef));
                this.dependencyLevel--;
                if (this.dependencyLevel === 0) {
                    this.refreshedCells.clear();
                }
            }
        }
    }
}

/** @hidden */
export class FormulaError {
    /**
     * @hidden
     */
    public message: string;
    public formulaCorrection: boolean = false;
    constructor(errorMessage: string, formulaAutoCorrection?: boolean) {
        this.message = errorMessage;
        this.formulaCorrection = formulaAutoCorrection;
    }

}

/** @hidden */
export class FormulaInfo {
    /**
     * @hidden
     */
    public calcID: number = Number.MIN_VALUE + 1;
    /**
     * @hidden
     */
    public formulaText: string;
    private formulaValue: string | number;
    private parsedFormula: string;
    private calcID1: number = Number.MIN_VALUE + 1;
    /**
     * @hidden
     * @returns {void} - To get Formula Text
     */
    public getFormulaText(): string {
        return this.formulaText;
    }
    /**
     * @hidden
     * @param {string} value - Specify the value
     * @returns {void} - To set Formula Text
     */
    public setFormulaText(value: string): void {
        this.formulaText = value;
    }
    /**
     * @hidden
     * @returns {string} - To get Formula Value
     */
    public getFormulaValue(): string | number {
        return this.formulaValue;
    }
    /**
     * @hidden
     * @param {string | number} value - Specify the value
     * @returns {void} - To set Parsed Formula
     */
    public setFormulaValue(value: string | number): void {
        this.formulaValue = value;
    }
    /**
     * @hidden
     * @returns {string} - To get Parsed Formula
     */
    public getParsedFormula(): string {
        return this.parsedFormula;
    }
    /**
     * @hidden
     * @param {string} value - Specify the value
     * @returns {void} - To set Parsed Formula
     */
    public setParsedFormula(value: string): void {
        this.parsedFormula = value;
    }
}

/** @hidden */
export class CalcSheetFamilyItem {
    /**
     * @hidden
     */
    public isSheetMember: boolean = false;
    /**
     * @hidden
     */
    public parentObjectToToken: Map<Object, string> = new Map<Object, string>();
    /**
     * @hidden
     */
    public sheetDependentCells: Map<string, string[]> = new Map<string, string[]>();
    /**
     * @hidden
     */
    public sheetDependentFormulaCells: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    /**
     * @hidden
     */
    public sheetNameToParentObject: Map<string, Object> = new Map<string, Object>();
    /**
     * @hidden
     */
    public sheetNameToToken: Map<string, string> = new Map<string, string>();
    /**
     * @hidden
     */
    public tokenToParentObject: Map<string, Object> = new Map<string, Object>();
    /**
     * @hidden
     */
    public sheetFormulaInfotable: Map<string, FormulaInfo> = new Map<string, FormulaInfo>();
}

/**
 * @hidden
 * @param {number} col - Specify the column
 * @returns {string} - To returns get Alphalabel.
 */
export function getAlphalabel(col: number): string {
    const cols: string[] = [];
    let n: number = 0;
    const charText: string = 'A';
    while (col > 0 && n < 9) {
        col--;
        const aCharNo: number = charText.charCodeAt(0);
        cols[n] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    const chs: string[] = [];
    for (let i: number = 0; i < n; i++) {
        chs[n - i - 1] = cols[i];
    }
    return chs.join('');
}

export class ValueChangedArgs {
    /** @hidden */
    public row: number;
    /** @hidden */
    public col: number;
    /** @hidden */
    public value: number | string;
    /** @hidden */
    public getRowIndex: Function;
    /** @hidden */
    public setRowIndex: Function;
    /** @hidden */
    public getColIndex: Function;
    /** @hidden */
    public setColIndex: Function;
    /** @hidden */
    public getValue: Function;
    /** @hidden */
    public setValue: Function;
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
        this.getValue = (): number | string => {
            return value;
        };
        // this.setValue = (value: number): void => {
        //     value = value;
        // };
        return this;
    }
}
