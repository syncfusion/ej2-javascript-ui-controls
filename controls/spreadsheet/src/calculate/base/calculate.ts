/* tslint:disable-next-line:max-line-length */
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
    /* tslint:disable-next-line:no-any */
    get libraryFormulas(): any {
        return this.lFormulas;
    }
    /* tslint:disable-next-line:no-any */
    set libraryFormulas(formulaColl: any) {
        this.lFormulas.set
            (formulaColl.fName, { handler: formulaColl.handler, category: formulaColl.category, description: formulaColl.description });
    }
    /** @hidden */
    public storedData: Map<string, FormulaInfo> = new Map<string, FormulaInfo>();
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
    public tic: string = '\"';
    /** @hidden */
    public singleTic: string = '\'';
    /** @hidden */
    public trueValue: string = 'TRUE';
    /** @hidden */
    public falseValue: string = 'FALSE';
    private parseDecimalSeparator: string = '.';
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
     * @default true
     */
    @Property(true)
    public includeBasicFormulas: boolean;

    /**
     * Triggers when the calculation caught any errors.
     * @event 
     */
    @Event()
    public onFailure: EmitType<FailureEventArgs>;

    /**
     * Base constructor for creating Calculate library.
     */
    constructor(parent?: Object) {
        super(null, null);
        let moduleLoader: ModuleLoader = new ModuleLoader(this);
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
     * @returns string
     */
    public getParseArgumentSeparator(): string {
        let seperator: string = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    }

    /**
     * To set the argument separator to split the formula arguments.
     * @param {string} value - Argument separator based on the culture. 
     * @returns void
     */
    public setParseArgumentSeparator(value: string): void {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    }

    /**
     * To get the date separator to split the date value.
     * @returns string
     */
    public getParseDateTimeSeparator(): string {
        return this.parseDateTimeSeparator;
    }

    /**
     * To set whether the empty string is treated as zero or not.
     * @param {boolean} value
     * @returns boolean
     */
    public setTreatEmptyStringAsZero(value: boolean): void {
        this.treatEmptyStringAsZero = value;
    }

    /**
     * To get whether the empty string is treated as zero or not.
     * @returns boolean
     */
    public getTreatEmptyStringAsZero(): boolean {
        return this.treatEmptyStringAsZero;
    }

    /**
     * To set the date separator to split the date value.
     * @param {string} value - Argument separator based on the culture. 
     * @returns void
     */
    public setParseDateTimeSeparator(value: string): void {
        this.parseDateTimeSeparator = value;
    }

    /**
     * To provide the array of modules needed.
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        return getModules(this);
    }

    /**
     * Dynamically injects the required modules to the library.
     * @hidden
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
     * @hidden
     */
    public getInjectedModules(): Function[] {
        return this.injectedModules;
    }

    public onPropertyChanged(newProp: CalculateModel, oldProp: CalculateModel): void {
        /** code snippets */
    }

    protected getModuleName(): string {
        return 'calculate';
    }

    /** @hidden */
    public getFormulaCharacter(): string {
        return '=';
    }

    /** @hidden */
    public isUpperChar(text: string): boolean {
        let charCode: number = text.charCodeAt(0);
        return ((charCode > 64) && (charCode < 91));
    }

    private resetKeys(): void {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    }

    /**
     * @hidden
     */
    public updateDependentCell(cellRef: string): void {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        let cell: string = this.cell;
        if (cell !== this.emptyString) {
            if (family.sheetNameToParentObject !== null) {
                let token: string = family.parentObjectToToken.get(this.grid);
                if (cell.indexOf(this.sheetToken) === -1) {
                    cell = token + cell;
                }
                if (cellRef.indexOf(this.sheetToken) === -1) {
                    cellRef = token + cellRef;
                }
            }

            if (this.getDependentCells().has(cellRef)) {
                let formulaCells: string[] = this.getDependentCells().get(cellRef);
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
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        if (family.sheetNameToParentObject != null && cell1.indexOf(this.sheetToken) === -1) {
            let token: string = family.parentObjectToToken.get(this.grid);
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
     */
    public getDependentCells(): Map<string, string[]> {
        if (this.isSheetMember()) {
            let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
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
     */
    public getDependentFormulaCells(): Map<string, Map<string, string>> {
        if (this.isSheetMember()) {
            let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
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
     * @returns Map<string, Function>
     */
    public getLibraryFormulas(): Map<string, IFormulaColl> {
        return this.lFormulas;
    }

    /**
     * To get library function.
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns Function
     */
    public getFunction(libFormula: string): Function {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        } else {
            return null;
        }
    }

    /** @hidden */
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
            let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
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
     * @private
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
     * @returns void
     */
    public getParseDecimalSeparator(): string {
        let seperator: string = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    }

    /**
     * To get the formula text.
     * @param {string} value - Specifies the decimal separator value.
     * @returns void
     */
    public setParseDecimalSeparator(value: string): void {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    }

    /** @hidden */
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

    /** @hidden */
    public getSheetID(grd: Object): number {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            let token: string = family.parentObjectToToken.get(grd);
            token = token.split(this.sheetToken).join(this.emptyString);
            let id: number = this.parseFloat(token);
            if (!this.isNaN(id)) {
                return id;
            }
        }
        return -1;
    }

    /** @hidden */
    public parseFloat(value: string | number): number {
        return Number(value);
    }

    /**
     * To get the row index of the given cell.
     * @param {string} cell - Cell address for getting row index.
     * @returns number
     */
    public rowIndex(cell: string): number {
        let i: number = 0;
        let result: number;
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
        result = parseInt(cell.substring(i), 10);
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
     * @param {string} cell - Cell address for getting column index.
     * @returns number
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
            let charCode: number = cell[j].charCodeAt(0);
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
     * @hidden
     */
    public getErrorStrings(): string[] {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!'];
        }
        return this.errorStrings;
    }

    /** @hidden */
    public substring(text: string, startIndex: number, length?: number): string {
        return text.substring(startIndex, length + startIndex);
    }

    /** @hidden */
    public isChar(c: string): boolean {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    }

    /** @hidden */
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
        let i: number = this.modelToSheetID.get(model);
        if (!this.sheetFamiliesList.has(i)) {
            this.sheetFamiliesList.set(i, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(i);
    }

    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns void
     */
    public setKeyValue(key: string, value: string | number): void {
        key = key.toUpperCase();
        let str: string = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf(this.leftBrace) === 0) {
            this.storedData.set(key, new FormulaInfo());
            this.keyToRowsMap.set(key, this.keyToRowsMap.size + 1);
            this.rowsToKeyMap.set(this.rowsToKeyMap.size + 1, key);
        }
        let fInfo: FormulaInfo = this.storedData.get(key);
        if (fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() !== str) {
            let s1: string = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            let formulaDependent: Map<string, string> = this.getDependentFormulaCells().get(s1);
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
     */
    public clearFormulaDependentCells(cell: string): void {
        let dependentFormula: Map<string, string> = this.getDependentFormulaCells().get(cell);
        if (dependentFormula != null) {
            dependentFormula.forEach((value: string, key: string) => {
                let s: string = key;
                let dependent: string[] = this.getDependentCells().get(s);
                this.arrayRemove(dependent, cell);
                if (dependent.length === 0) {
                    this.getDependentCells().delete(s);
                }
            });
            this.getDependentFormulaCells().delete(cell);
        }
    }

    private arrayRemove(array: string[], value: string): string[] {
        let index: number = array.indexOf(value);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return array;
    }

    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for getting the corresponding value.
     * @returns string | number
     */
    public getKeyValue(key: string): string | number {
        key = key.toUpperCase();
        if (this.storedData.has(key) !== null) {
            let fInfo: FormulaInfo = this.storedData.get(key);
            let fText: string = fInfo.getFormulaText();
            if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
                this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
                fText = fText.substring(1);
                try {
                    fInfo.setParsedFormula(this.parser.parseFormula(fText, key));
                } catch (ex) {
                    let args: FailureEventArgs = {
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
                    let args: FailureEventArgs = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    let errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
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
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @param {number} sheetIndex - Defined scope for the specified name. Default - Workbook scope.
     * @returns boolean
     */
    public addNamedRange(name: string, range: string): boolean {
        let sheetScopeName: string[] = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
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
     * @param {string} name - Name of the specified named range.
     * @returns boolean
     */
    public removeNamedRange(name: string): boolean {
        name = name.toUpperCase();
        if (this.namedRanges.get(name) != null) {
            this.namedRanges.delete(name);
            return true;
        }
        return false;
    }

    /** @hidden */
    public convertAlpha(col: number): string {
        let arrCol: string[] = [];
        let n: number = 0;
        let charText: string = 'A';
        while (col > 0) {
            col--;
            let aCharValue: number = charText.charCodeAt(0);
            arrCol[n] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        return arrCol.join('');
    }

    /** @hidden */
    public getCellCollection(cellRange: string): string[] | string {
        if (cellRange.indexOf(':') < 0) {
            if (!this.isCellReference(cellRange)) {
                return cellRange.split(this.getParseArgumentSeparator());
            } else {
                cellRange = cellRange + ':' + cellRange;
            }
        }
        let token: string = this.emptyString;
        let sheetTokenIndex: number = cellRange.indexOf(this.sheetToken);
        if (sheetTokenIndex > -1) {
            let index: number = sheetTokenIndex;
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
        let cells: string[] = [];
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
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns string | number
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
                    let sFormula: string = parsedText.substring(lastIndexOfq, i + 1);
                    let libFormula: string = sFormula.split(this.leftBracket)[0].split('q').join(this.emptyString);
                    let args: string[] = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                        .split(this.getParseArgumentSeparator());
                    if (this.getLibraryFormulas().get(libFormula.toUpperCase()).isCustom) {
                        let j: number = 0;
                        let customArgs: string[] = [];
                        for (j = 0; j < args.length; j++) {
                            customArgs.push(this.getValueFromArg(args[j]));
                        }
                        args = customArgs;
                    }
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.name] :
                        this.getFunction(libFormula)(...args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        let q: number = this.findLastIndexOfq(fNested);
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
            let args: FailureEventArgs = { message: ex.message, exception: ex, isForceCalculable: false, computeForceCalculate: false };
            this.trigger('onFailure', args);
            let errorMessage: string = (typeof args.exception === 'string') ? args.exception : args.message;
            formulatResult = (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
        }
        return formulatResult;
    }

    /** @hidden */
    public computeSumIfAndAvgIf(range: string[]): number[] | string {
        if (isNullOrUndefined(range) || range[0] === this.emptyString || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let argArr: string[] = range;
        let argCount: number = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let rangevalue: string = argArr[0];
        let criteria: string = argArr[1].trim();
        criteria = criteria.split(this.tic).join(this.emptyString);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
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
        let checkCriteria: number = this.parseFloat(criteria);
        let criteriaRangeArray: string = argArr[0];
        let sumRange: string[] | string = this.getCellCollection(argCount > 2 ? argArr[2] : rangevalue);
        let criteriaRange: string[] | string = this.getCellCollection(criteriaRangeArray);
        let result: number[] = this.getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, opt);
        return [result[0], result[1]];
    }

    /** @hidden */
    public computeLookup(range: string[]): string {
        if (range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let checkCrte: string[] = [];
        let findMaxVal: string[] | string = [];
        let argArr: string[] = range;
        let argCount: number = argArr.length;
        let criterias: string = argArr[0].split(this.tic).join(this.emptyString);
        let rangevalue: string = argArr[1];
        let lookupRangeArray: string = argCount === 2 ? rangevalue : argArr[2];
        let criteriaRange: string[] | string = this.getCellCollection(argArr[1]);
        let lookupRange: string[] | string = this.getCellCollection(lookupRangeArray);
        for (let i: number = 0; i < criteriaRange.length; i++) {
            findMaxVal[i] = this.getValueFromArg(criteriaRange[i]).split(this.tic).join('');
        }
        let s: string[] = findMaxVal.toString().split(this.getParseArgumentSeparator());
        let maxVal: number = this.parseFloat(s[s.sort().length - 1]);
        let minVal: number = this.parseFloat(s[0]);
        for (let j: number = 0; j < criteriaRange.length; j++) {
            checkCrte[j] = this.getValueFromArg(criteriaRange[j]).split(this.tic).join('');
            if (criterias === checkCrte[j]) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            } else if (this.parseFloat(criterias) === this.parseFloat(checkCrte[j])) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            } else if (this.parseFloat(criterias) < minVal) {
                return this.getErrorStrings()[CommonErrors.na];
            } else if (this.parseFloat(criterias) > maxVal) {
                let index: number = findMaxVal.indexOf(maxVal.toString());
                return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
            }
        }
        if (findMaxVal.indexOf(criterias) < 0) {
            let temp: string[] = [];
            for (let n: number = 0; n < s.length; n++) {
                if (this.parseFloat(criterias) > this.parseFloat(s[n])) {
                    temp.push(s[n]);
                }
            }
            let index: number = findMaxVal.indexOf(temp[temp.length - 1]);
            return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
        }
        return this.getErrorStrings()[CommonErrors.na];
    }

    public computeVLookup(range: string[]): string {
        let argArr: string[] = range;
        let findMaxValue: string[] | string = [];
        let lookupValue: string = argArr[0].split(this.tic).join('');
        if (lookupValue.indexOf(':') > - 1) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        if (this.isCellReference(lookupValue)) {
            lookupValue = this.getValueFromArg(lookupValue);
        }
        if (argArr[1].indexOf(':') < - 1) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        let lookupRange: string[] | string = [];
        let firstCol: string = '';
        let secCol: string = '';
        if (this.isCellReference(argArr[1])) {
            lookupRange = this.getCellCollection(argArr[1]);
            if (argArr[1].indexOf(':') > - 1) {
                let index: number = argArr[1].indexOf(':');
                for (let i: number = 0; i < index; i++) {
                    let tempCell: string = this.isChar(argArr[1][i]) ? argArr[1][i] : '';
                    firstCol = firstCol + tempCell;
                }
                for (let j: number = index; j < argArr[1].length; j++) {
                    let tempCell2: string = this.isChar(argArr[1][j]) ? argArr[1][j] : '';
                    secCol = secCol + tempCell2;
                }
            }
        }
        let lookupCol: number = this.colIndex(firstCol) + this.parseFloat(argArr[2]);
        if (lookupCol > this.colIndex(secCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        if (lookupCol === this.colIndex(firstCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        let lookupCell: string = this.convertAlpha(lookupCol);
        argArr[3] = isNullOrUndefined(argArr[3]) ? this.trueValue : argArr[3].split(this.tic).join('');
        let cellValue: string = '';
        for (let i: number = 0; i < lookupRange.length; i++) {
            findMaxValue[i] = this.getValueFromArg(lookupRange[i]).split(this.tic).join('');
        }
        let s: string[] = findMaxValue.toString().split(this.getParseArgumentSeparator());
        let maxValue: number = this.parseFloat(s[s.sort().length - 1]);
        let minValue: number = this.parseFloat(s[0]);
        for (let j: number = 0; j < lookupRange.length; j++) {
            cellValue = this.getValueFromArg(lookupRange[j]);
            if (argArr[3].toUpperCase() === this.trueValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                } else if (this.parseFloat(lookupValue) === this.parseFloat(cellValue)) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                } else if (this.parseFloat(lookupValue) < minValue) {
                    return this.getErrorStrings()[CommonErrors.na];
                } else if (this.parseFloat(lookupValue) > maxValue) {
                    let index: number = findMaxValue.indexOf(maxValue.toString());
                    return this.getValueFromArg(lookupCell + index).split(this.tic).join('');
                }
            }
            if (argArr[3] === this.falseValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j);
                }
            }
        }
        return this.getErrorStrings()[CommonErrors.na];
    }

    public findWildCardValue(lookVal: string, cellValue: string): string {
        let finalText: string = '';
        if (lookVal.indexOf('?') > -1) {
            let index: number = lookVal.indexOf('?');
            let checStr1: string = lookVal[index - 1];
            let checStr2: string = lookVal[index + 1];
            if (cellValue.indexOf(checStr1) > -1 && cellValue.indexOf(checStr2) > -1) {
                let newIndex: number = cellValue.indexOf(checStr1);
                if (cellValue[newIndex] === checStr1 && cellValue[newIndex + 2] === checStr2) {
                    finalText = lookVal;
                } else {
                    finalText = cellValue;
                }

            } else {
                finalText = cellValue;
            }
        } else if (lookVal.indexOf('*') > -1) {
            let index: number = lookVal.indexOf('*');
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
            let leftVal: number = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            let rightVal: number = right === '' ? -1 : cellValue.indexOf(right);
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
    /* tslint:disable-next-line */
    public getComputeSumIfValue(criteriaRange: string[] | string, sumRange: string[] | string, criteria: string, checkCriteria: number, op: string): number[] {
        let sum: number = 0;
        let count: number = 0;
        switch (op) {
            case this.parser.tokenEqual: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (value === criteria && val === checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    } else if (value === criteria) {
                        let sumRangeVal: string | number = sumRange[i];
                        sumRangeVal = this.getValueFromArg(sumRangeVal);
                        sum = this.parseFloat(sumRangeVal.toString());
                        count = count + 1;
                    }
                }
            }
                break;
            case this.parser.tokenLess: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (val < checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
                break;
            case this.parser.tokenGreater: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (val > checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
                break;
            case this.parser.tokenLessEq: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (val <= checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
                break;
            case this.parser.tokenGreaterEq: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (val >= checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
                break;
            case this.parser.tokenNotEqual: {
                for (let i: number = 0; i < criteriaRange.length; i++) {
                    let value: string = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                    let val: number = this.parseFloat(value);
                    if (value !== criteria && val !== checkCriteria) {
                        let value1: string = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                        let val1: number = this.parseFloat(value1);
                        sum = sum + val1;
                        count = count + 1;
                    }
                }
            }
                break;
        }
        return [sum, count];
    }

    /** @hidden */
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
        let ranges: string[] = args;
        for (let i: number = 0; i < ranges.length; i++) {
            if (ranges[i] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.value];
            }
            if (ranges[i].indexOf(':') > -1 && this.isCellReference(ranges[i])) {
                let cells: string[] | string = this.getCellCollection(ranges[i]);
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
                let tempdate: number = Date.parse(value.split(this.tic).join(''));
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

    /** @hidden */
    // To strip out the tic from the formula arguments.
    public removeTics(text: string): string {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    }

    /** @hidden */
    public getCellFrom(range: string): string {
        let cellRange: string = '';
        let cells: string[] = range.indexOf(':') > -1 ? range.split(':') : [range];
        //this.getCellsFromArgs(range);
        let last: number = cells.length - 1;
        let r1: number = this.rowIndex(cells[0]);
        let x: number;
        if (r1 === this.rowIndex(cells[last])) {
            let c1: number = this.colIndex(cells[0]);
            let c2: number = this.colIndex(cells[last]);
            let c: number = this.colIndex(this.cell);
            if (c >= c1 && c <= c2) {
                cellRange = getAlphalabel(c).toString() + r1.toString();
            }
        } else if (this.colIndex(cells[0]) === this.colIndex(cells[last])) {
            x = this.colIndex(cells[0]);
            let r2: number = this.rowIndex(cells[last]);
            let r: number = this.rowIndex(this.cell);
            if (r >= r1 && r <= r2) {
                cellRange = getAlphalabel(x).toString() + r.toString();
            }
        }
        return cellRange;
    }

    /* tslint:disable-next-line:max-func-body-length */
    private computeValue(pFormula: string): string {
        try {
            let stack: string[] = [];
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
                    while (i < pFormula.length && this.isDigit(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s);
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
                        let char: string = pFormula[i];
                        s = s + char;
                        i = i + 1;
                    }
                    while ( i < pFormula.length && this.isDigit(pFormula[i])) {
                        let digit: string = pFormula[i];
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
                    let leftIdx: number = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    let j: number = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
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
                    let stackValue: string = stack[0];
                    let value: number = this.parseFloat(stackValue);
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

    /** @hidden */
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

    /** @hidden */
    public computeStoreCells(sCell: StoredCellInfo): string[] {
        let cellValue: string | string[] = sCell.cellValue;
        let cellRanges: string[] = sCell.cellRange;
        let criterias: string[] = sCell.criteria;
        let argArr: string[] = sCell.argArray;
        let isCriteria: string = sCell.isCriteria;
        let storeCell: string[] = sCell.storedCells;
        let isCountIfs: string = sCell.isCountIfS;
        let i: number = sCell.countVal;
        let rangeLength: string[] | string = isCriteria === this.trueValue ? storeCell : cellValue;
        let tempStoredCell: string[] = [];
        for (let j: number = 0; j < rangeLength.length; j++) {
            let stack: string[] = [];
            let cellVal: string = this.getValueFromArg(cellValue[j]);
            let criteria: string;
            let newCell: string = '';
            criteria = argArr[2].split(this.tic).join(this.emptyString);
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
                    let k: number = cellRanges[i].indexOf(':');
                    newCell = this.substring(cellRanges[i], k);
                    while (!this.isDigit(newCell[newCount])) {
                        newCount = newCount + 1;
                    }
                }
                let cellAlpha: string = this.substring(cell, count);
                let newCellAlpha: string = this.substring(newCell, newCount);
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
        let argArr: string[] = range;
        let argCount: number = argArr.length;
        if (argCount < 2 || argCount > 127) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        let cellRanges: string[] | string = [];
        let criterias: string[] | string = [];
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
        let len: number[] = [];
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
            let sCell: StoredCellInfo = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        // Compare criteria and convert the new cell ranges.
        let startRange: number;
        startRange = isCountIfs === this.trueValue ? 0 : 2;
        for (let i: number = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i]);
            let sCell: StoredCellInfo = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
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
                let k: number = cellRanges[0].indexOf(':');
                newCell = this.substring(cellRanges[0], k);
                while (!this.isDigit(newCell[newCount])) {
                    newCount = newCount + 1;
                }
            }
            let cellAlpha: string = this.substring(cell, count);
            let newCellAlpha: string = this.substring(newCell, newCount);
            cellvalue = storedCell[j].split(cellAlpha).join(newCellAlpha);
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            } else {
                let argValue: string = this.getValueFromArg(cellvalue);
                sum = sum + parseFloat(argValue === '' ? '0' : argValue);
            }
        }
        if (isAvgIfs === this.trueValue) {
            sum = sum / cellvalue.length;
        }
        return sum;
    }
    private processNestedFormula(pText: string, sFormula: string, fResult: string | number): string {
        let lastIndexq: number = this.findLastIndexOfq(pText);
        let interiorCalcFString: string = pText.split(sFormula).join('n' + fResult);
        return interiorCalcFString;
    }

    /** @hidden */
    public isNaN(value: string | number): boolean {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    }

    /** @hidden */
    public fromOADate(doubleNumber: number): Date {
        let result: Date = new Date();
        result.setTime((doubleNumber * this.millisecondsOfaDay) + Date.parse(this.oaDate.toString()));
        return result;
    }

    /** @hidden */
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
        let dateTime: number = Date.parse(year.toString() + this.getParseDateTimeSeparator() + month.toString() +
            this.getParseDateTimeSeparator() + day.toString());
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    }

    /** @hidden */
    public toOADate(dateTime: Date): number {
        let result: number = (dateTime.getTime() - Date.parse(this.oaDate.toString())) / this.millisecondsOfaDay;
        return result;
    }

    /** @hidden */
    public calculateDate(date: string): string {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    }

    /** @hidden */
    public isTextEmpty(s: string): boolean {
        return s === null || s === '';
    }

    /** @hidden */
    public isDigit(text: string): boolean {
        let charCode: number = text.charCodeAt(0);
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
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns string
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
            /* tslint:disable:max-line-length */
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
        let symbolArray: string[] = ['+', '-', '/', '*', ')', ')', '{'];
        if ((this.parser.indexOfAny(s, symbolArray) === -1 && this.isUpperChar(s[0])) || s[0] === this.sheetToken) {
            if (s !== this.trueValue && s !== this.falseValue && this.isCellReference(s)) {
                let f: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
                if (f.sheetNameToParentObject !== null && f.sheetNameToParentObject.size > 0 && s.indexOf(this.sheetToken) === -1) {
                    let token: string = f.parentObjectToToken.get(this.grid);
                    s = token + s;
                }
            }
            if (s === this.cell) {
                let dependent: string[] = this.getDependentCells().get(s);
                if (dependent != null && dependent.indexOf(s) > -1) {
                    this.arrayRemove(dependent, s);
                }
                if (!this.getDependentFormulaCells().has(this.cell)) {
                    this.clearFormulaDependentCells(this.cell);
                }
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

    /* tslint:disable-next-line */
    public isDate(date: any): Date {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            let dateval: Date = new Date(Date.parse(date));
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
        let start: number = 0;
        let end: number = 0;
        let j: number = 0;
        let numArr: number[] = [89, 71, 69];
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
            let cellNum: number = this.parseFloat(text.substring(end, text.length));
            if (cellNum < 1048576) { // Maximum number of rows in excel.
                return true;
            }
        }
        return false;
    }

    /** @hidden */
    /* tslint:disable-next-line */
    public parseDate(date: any): any {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            let d: number = parseInt(date, 10);
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

    /** @hidden */
    public isCellReference(args: string): boolean {
        if (args === this.emptyString) {
            return false;
        }
        args = args.trim();
        args = this.setTokensForSheets(args);
        let sheetToken1: string = this.getSheetToken(args);
        let containsBoth: boolean = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join(this.emptyString);
        }
        let isAlpha: boolean = false;
        let isNum: boolean = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        let charArray: string[] = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
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

    /** @hidden */
    public setTokensForSheets(text: string): string {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        let sortedSheetNamesCollection: string[] = this.getSortedSheetNames();
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
            let textSplit: string[] = text.split('');
            textSplit[1] = (parseInt(textSplit[1], 10) + 1).toString();
            text = textSplit.join('');
        }
        return text;
    }

    private getParentObjectCellValue(val: string): string | number {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        let i: number = val.lastIndexOf(this.sheetToken);
        let row: number = 0;
        let col: number = 0;
        let grid: Object = this.grid;
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(grid);
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
        let saveCell: string = (this.cell === '' || this.cell === null) ? '' : this.cell;
        this.cell = val;
        if (saveCell === this.cell) {
            throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference];
        }
        let cValue: string | number = this.getParentCellValue(row, col, this.grid);
        this.grid = grid;
        this.cell = saveCell;
        return cValue;
    }

    private getParentCellValue(row: number, col: number, grd: Object): number | string {
        let alreadyComputed: boolean = false;
        // formulainfotable
        let cValue: number | string;
        /* tslint:disable-next-line */
        if ((this.parentObject as any).getValueRowCol === undefined) {
            cValue = this.getValueRowCol(this.getSheetID(grd), row, col);
        } else {
            /* tslint:disable-next-line */
            cValue = (this.parentObject as any).getValueRowCol(this.getSheetID(grd), row, col);
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
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns string
     */
    public getValueRowCol(grid: Object, row: number, col: number): string {
        let key: string = this.rowsToKeyMap.get(row).toString();
        let result: string = this.getKeyValue(key).toString();
        if (result != null && result[result.length - 1] === ('%') && result.length > 1) {
            let d: number = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    }

    /**
     * To add custom library formula.
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns void
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
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     */
    public valueChanged(grid: string, changeArgs: ValueChangedArgs, isCalculate?: boolean): void {
        let pgrid: string = grid;
        this.grid = grid;
        let isComputedValueChanged: boolean = true;
        let isCompute: boolean = true;
        let calcFamily: CalcSheetFamilyItem = this.getSheetFamilyItem(pgrid);
        let cellTxt: string = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            let token: string = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        let argVal: string = changeArgs.getValue().toUpperCase();
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
                    let cValue: string | number = this.computeFormula(formula.getParsedFormula());
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
                /* tslint:disable */
                if ((this.parentObject as any).setValueRowCol === undefined) {
                    this.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                } else {
                    (this.parentObject as any).setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                }
                /* tslint:enable */
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

    /** @hidden */
    public getComputedValue(): Map<string, string | number> {
        if (this.computedValues === null) {
            this.computedValues = new Map<string, string | number>();
        }
        return this.computedValues;
    }

    /**
     * @hidden 
     */
    public setValueRowCol(value: number, formulaValue: string | number, row: number, col: number): void {
        /* No Implementation */
    }

    private getSortedSheetNames(): string[] {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            let arr: string[] = [];
            family.sheetNameToToken.forEach((value: string, key: string) => {
                arr.push(key);
                arr.sort();
            });
            this.sortedSheetNames = arr;
            this.sortedSheetNames.sort();
        }
        return this.sortedSheetNames;
    }

    /** @hidden */
    public getErrorLine(error: string): string {
        /* tslint:disable-next-line */
        let errorStack: string[] = (error as any).stack ? (error as any).stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    }

    /** @hidden */
    public createSheetFamilyID(): number {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    }

    /** @hidden */
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
        let argArr: string[] = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        for (let i: number = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                let cellValue: string[] | string = this.getCellCollection(argArr[i]);
                for (let j: number = 0; j < cellValue.length; j++) {
                    argVal = this.getValueFromArg(cellValue[j]);
                    if (this.getErrorStrings().indexOf(argVal) > -1) {
                        return argVal;
                    }
                    let cellVal: number = this.parseFloat(argVal);
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
                let val: string;
                val = this.getValueFromArg(argArr[i]);
                if (this.getErrorStrings().indexOf(val) > -1) {
                    return val;
                }
                let cellVal: number = this.parseFloat(val);
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

    /** @hidden */
    public calculateAvg(args: string[]): string {
        let sumCell: number = 0;
        let argArr: string[] = args;
        let cellVal: string[] | string = [];
        let avgVal: number = 0;
        let countNum: number = 0;
        let countNum1: number = 0;
        for (let k: number = 0; k < argArr.length; k++) {
            if (argArr[k].indexOf(':') > -1 && this.isCellReference(argArr[k])) {
                countNum = 0;
                cellVal = this.getCellCollection(argArr[k]);
                avgVal = 0;
                for (let i: number = 0; i < cellVal.length; i++) {
                    let value: string = this.getValueFromArg(cellVal[i]);
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
                let value: string = this.getValueFromArg(argArr[k].split(this.tic).join(''));
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
     */
    public registerGridAsSheet(refName: string, model: Object | string, sheetFamilyID: number): string {
        if (isNullOrUndefined(this.modelToSheetID)) {
            this.modelToSheetID = new Map<Object, number>();
        }
        if (isNullOrUndefined(this.modelToSheetID.get(model))) {
            this.modelToSheetID.set(model, sheetFamilyID);
        }
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(model);
        family.isSheetMember = true;
        let tempRef: string = refName.toUpperCase();
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
            let token: string = family.sheetNameToToken.get(tempRef);
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
        } else {
            let token: string = this.sheetToken + this.tokenCount.toString() + this.sheetToken;
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
     */
    public unregisterGridAsSheet(refName: string, model: string | Object): void {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(model);
        let refName1: string = refName.toUpperCase();
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.has(refName1)) {
            family.sheetNameToParentObject.delete(refName1);
            let token: string = family.sheetNameToToken.get(refName1);
            family.sheetNameToToken.delete(refName1);
            family.tokenToParentObject.delete(token);
            family.parentObjectToToken.delete(model);
        }
    };

    /**
     * @hidden
     */
    public computeExpression(formula: string): string| number {
        let parsedFormula: string = this.parser.parseFormula(formula);
        let calcValue: string | number = this.computeFormula(parsedFormula);
        return calcValue;
    };

    private isSheetMember(): CalcSheetFamilyItem | boolean {
        let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    }

    /**
     * To dispose the calculate engine.
     * @returns void
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
            let family: CalcSheetFamilyItem = this.getSheetFamilyItem(this.grid);
            this.dependencyLevel = this.dependencyLevel + 1;
            try {
                let dependentCells: string[] = this.getDependentCells().get(cellRef);
                let i: number;
                for (i = 0; i < dependentCells.length; i++) {
                    let dCell: string = dependentCells[i];
                    let token: string = this.getSheetToken(dCell);

                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                    }
                    try {
                        let rowIdx: number = this.rowIndex(dCell);
                        let colIdx: number = this.colIndex(dCell);
                        let formulaInfo: FormulaInfo = this.getFormulaInfoTable().get(dCell);
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
     */
    public getFormulaText(): string {
        return this.formulaText;
    }
    /**
     * @hidden
     */
    public setFormulaText(value: string): void {
        this.formulaText = value;
    }
    /**
     * @hidden
     */
    public getFormulaValue(): string | number {
        return this.formulaValue;
    }
    /**
     * @hidden
     */
    public setFormulaValue(value: string | number): void {
        this.formulaValue = value;
    }
    /**
     * @hidden
     */
    public getParsedFormula(): string {
        return this.parsedFormula;
    }
    /**
     * @hidden
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
 */

export function getAlphalabel(col: number): string {
    let cols: string[] = [];
    let n: number = 0;
    let charText: string = 'A';
    while (col > 0 && n < 9) {
        col--;
        let aCharNo: number = charText.charCodeAt(0);
        cols[n] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    let chs: string[] = [];
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
        this.setValue = (value: number): void => {
            value = value;
        };
        return this;
    }
}