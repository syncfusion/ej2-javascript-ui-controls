import { Workbook, getSheetName, getSheet, SheetModel, RowModel, CellModel, getSheetIndexByName, getSheetIndexFromId } from '../base/index';
import { getSingleSelectedRange, getCell, getSheetIndex } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, AggregateArgs, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CalcSheetFamilyItem, FormulaInfo, CommonErrors, getAlphalabel } from '../../calculate/index';
import { IFormulaColl } from '../../calculate/common/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DefineNameModel, getCellAddress, getFormattedCellObject, isNumber, checkIsFormula, removeUniquecol } from '../common/index';
import { workbookEditOperation, getRangeAddress, InsertDeleteEventArgs, getRangeFromAddress, isCellReference } from '../common/index';
import { getUniqueRange, DefineName } from '../common/index';


/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
export class WorkbookFormula {
    private parent: Workbook;
    private calcID: number;
    public uniqueOBracket: string = String.fromCharCode(129);
    public uniqueCBracket: string = String.fromCharCode(130);
    public uniqueCSeparator: string = String.fromCharCode(131);
    public uniqueCOperator: string = String.fromCharCode(132);
    public uniquePOperator: string = String.fromCharCode(133);
    public uniqueSOperator: string = String.fromCharCode(134);
    public uniqueMOperator: string = String.fromCharCode(135);
    public uniqueDOperator: string = String.fromCharCode(136);
    public uniqueModOperator: string = String.fromCharCode(137);
    public uniqueConcateOperator: string = String.fromCharCode(138);
    public uniqueEqualOperator: string = String.fromCharCode(139);
    public uniqueExpOperator: string = String.fromCharCode(140);
    public uniqueGTOperator: string = String.fromCharCode(141);
    public uniqueLTOperator: string = String.fromCharCode(142);
    public calculateInstance: Calculate;
    private sheetInfo: { visibleName: string, sheet: string, index: number }[] = [];
    /**
     * Constructor for formula module in Workbook.
     *
     * @param {Workbook} workbook - Specifies the workbook.
     * @private
     */
    constructor(workbook: Workbook) {
        this.parent = workbook;
        this.init();
    }

    private init(): void {
        this.addEventListener();
        this.initCalculate();
        this.registerSheet();
    }

    /**
     * To destroy the formula module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
        this.parent.on(getUniqueRange, this.getUniqueRange, this);
        this.parent.on(removeUniquecol, this.removeUniquecol, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
            this.parent.off(getUniqueRange, this.getUniqueRange);
            this.parent.off(removeUniquecol, this.removeUniquecol);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'workbookFormula';
    }

    private initCalculate(): void {
        this.calculateInstance = new Calculate(this.parent);
        this.calcID = this.calculateInstance.createSheetFamilyID();
        this.calculateInstance.setTreatEmptyStringAsZero(true);
        this.calculateInstance.grid = this.parent.getActiveSheet().id.toString();
    }
    private performFormulaOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        const formulas: Map<string, IFormulaColl> = this.calculateInstance.getLibraryFormulas();
        const formulaInfo: IFormulaColl[] = (Array.from(formulas.values()));
        let collection: string[];
        let length: number;
        switch (action) {
        case 'getLibraryFormulas':
            args.formulaCollection = Array.from(formulas.keys());
            break;
        case 'getFormulaCategory':
            collection = ['All'];
            for (let i: number = 1; i < Array.from(formulas.values()).length; i++) {
                if (collection.indexOf(formulaInfo[i].category) < 0) {
                    collection.push(formulaInfo[i].category);
                }
            }
            args.categoryCollection = collection; break;
        case 'dropDownSelectFormulas':
            for (let i: number = 0; i < Array.from(formulas.values()).length; i++) {
                if (args.selectCategory === formulaInfo[i].category) {
                    args.formulaCollection[i] = Array.from(formulas.keys())[i];
                }
            }
            break;
        case 'getFormulaDescription':
            for (let i: number = 0; i < Array.from(formulas.values()).length; i++) {
                if (args.selectedList === Array.from(formulas.keys())[i]) {
                    args.description = formulaInfo[i].description;
                }
            }
            break;
        case 'registerSheet':
            this.registerSheet(<number>args.sheetIndex, <number>args.sheetCount);
            if (args.isImport) {
                this.updateSheetInfo();
            }
            break;
        case 'unRegisterSheet':
            this.unRegisterSheet(<number>args.sheetIndex, <number>args.sheetCount, <boolean>args.propertyChange); break;
        case 'refreshCalculate':
            if (<boolean>args.isFormula) {
                args.value = this.autoCorrectFormula(
                    <string>args.value, <number>args.rowIndex, <number>args.colIndex, <number>args.sheetIndex);
            }
            this.refreshCalculate(
                <number>args.rowIndex, <number>args.colIndex, <string>args.value,
                <boolean>args.isFormula, <number>args.sheetIndex, <boolean>args.isRefreshing
            );
            args.value = args.value ? args.value.toString().split('-*').join('-').split('/*').join('/').split('*/').
                join('*').split('-/').join('-').split('*+').join('*').split('+*').join('+') : args.value;
            break;
        case 'getArgumentSeparator':
            args.argumentSeparator = this.calculateInstance.getParseArgumentSeparator();
            break;
        case 'addDefinedName':
            args.isAdded = this.addDefinedName(<DefineNameModel>args.definedName, false, <number>args.index);
            break;
        case 'removeDefinedName':
            args.isRemoved = this.removeDefinedName(<string>args.definedName, <string>args.scope);
            break;
        case 'initiateDefinedNames':
            this.initiateDefinedNames();
            break;
        case 'renameUpdation':
            this.renameUpdation(<string>args.value, <number>args.sheetId);
            break;
        case 'addSheet':
            this.sheetInfo.push({ visibleName: <string>args.visibleName, sheet: <string>args.sheetName, index: <number>args.index });
            break;
        case 'getSheetInfo':
            args.sheetInfo = this.sheetInfo;
            break;
        case 'deleteSheetTab':
            length = this.sheetInfo.length;
            for (let i: number = 0; i < length; i++) {
                if (this.sheetInfo[i].index === (args.index as number)) {
                    args.sheetName = this.sheetInfo[i].sheet; this.sheetInfo.splice(i, 1); break;
                }
            }
            this.calculateInstance.unregisterGridAsSheet((args.index as number - 1).toString(), args.index);
            this.calculateInstance.tokenCount = this.calculateInstance.tokenCount - 1;
            this.sheetDeletion(<string>args.sheetName, <number>args.index, <number>args.index);
            break;
        case 'getReferenceError':
            args.refError = this.referenceError(); break;
        case 'getAlpha':
            args.col = getAlphalabel(<number>args.col);
            break;
        case 'addCustomFunction':
            this.addCustomFunction(<string | Function>args.functionHandler, <string>args.functionName);
            break;
        case 'computeExpression':
            args.calcValue = this.calculateInstance.computeExpression(<string>args.formula);
            break;
        case 'registerGridInCalc':
            this.calculateInstance.grid = <string>args.sheetID; break;
        case 'refreshInsDelFormula':
            this.refreshInsDelFormula(<InsertDeleteEventArgs>args.insertArgs);
            break;
        case 'refreshNamedRange':
            this.refreshNamedRange(<InsertDeleteEventArgs>args.insertArgs);
            break;
        }
    }
    private referenceError(): string {
        return this.calculateInstance.getErrorStrings()[CommonErrors.ref];
    }
    private getSheetInfo(): { visibleName: string, sheet: string }[] {
        return this.sheetInfo;
    }
    private addCustomFunction(functionHandler: string | Function, functionName: string): void {
        this.calculateInstance.defineFunction(functionName, functionHandler);
    }
    private updateSheetInfo(): void {
        this.sheetInfo = [];
        this.parent.sheets.forEach((sheet: SheetModel, idx: number) => {
            this.sheetInfo.push({ visibleName: sheet.name, sheet: 'Sheet' + sheet.id, index: idx });
        });
    }

    private getUniqueRange(args: { [key: string]: string[] }): void {
        args.range = this.calculateInstance.uniqueRange;
    }

    private removeUniquecol(): void {
        const cellAddr: string = this.parent.getActiveSheet().activeCell;
        for (let i: number = 0; i < this.calculateInstance.uniqueRange.length; i++) {
            if (this.calculateInstance.uniqueRange[i].split(':')[0] === cellAddr) {
                const range: number[] = getRangeIndexes(this.calculateInstance.uniqueRange[i]);
                this.calculateInstance.uniqueRange.splice(i, 1);
                for (let j: number = range[0]; j <= range[2]; j++) {
                    for (let k: number = range[1]; k <= range[3]; k++) {
                        const cell: CellModel = getCell(j, k, this.parent.getActiveSheet());
                        cell.formula = '';
                        this.parent.updateCell({ value: '', formula: ''}, getRangeAddress([j, k]));
                    }
                }
            }
        }
    }

    private sheetDeletion(delSheetName: string, sheetId: number, index: number): void {
        const dependentCell: Map<string, string[]> = this.calculateInstance.getDependentCells();
        const cellRef: string[] = [];
        let fInfo: FormulaInfo = null;
        let formulaVal: string = '';
        let rowId: number; let colId: number;
        dependentCell.forEach((value: string[], key: string) => {
            cellRef.push(key);
        });
        this.removeSheetTokenIndex(formulaVal, index);
        for (let i: number = 0; i < cellRef.length; i++) {
            const dependentCellRef: string[] = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (let j: number = 0; j < dependentCellRef.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCellRef[j]);
                sheetId = parseInt(dependentCellRef[j].split('!')[1], 10) + 1;
                if (!isNullOrUndefined(fInfo) && sheetId > -1) {
                    formulaVal = fInfo.formulaText;
                    if (formulaVal.toUpperCase().indexOf(delSheetName.toUpperCase()) > -1) {
                        formulaVal = formulaVal.toUpperCase().split(delSheetName.toUpperCase() +
                            this.calculateInstance.sheetToken).join(this.referenceError());
                        rowId = this.calculateInstance.rowIndex(dependentCellRef[j]);
                        colId = this.calculateInstance.colIndex(dependentCellRef[j]);
                        this.updateDataContainer([rowId - 1, colId - 1], { value: formulaVal, sheetId: sheetId, visible: false });
                        this.calculateInstance.refresh(fInfo.getParsedFormula());
                    }
                }
                if (delSheetName.split('Sheet')[1] === cellRef[i].split('!')[1]) {
                    this.calculateInstance.getFormulaInfoTable().delete(cellRef[i]);
                    this.calculateInstance.clearFormulaDependentCells(cellRef[i]);
                }
            }
        }
    }
    private removeSheetTokenIndex(value: string, index: number): string {
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(this.calculateInstance.grid);
        family.sheetNameToToken.delete(index.toString());
        family.sheetNameToParentObject.delete(index.toString());
        family.parentObjectToToken.delete(index.toString());
        family.tokenToParentObject.delete('!' + (index - 1).toString() + '!');
        return value;
    }

    private renameUpdation(name: string, sheetIdx: number): void {
        const dependentCellRef: Map<string, string[]> = this.calculateInstance.getDependentCells();
        const cellRef: string[] = [];
        let fInfo: FormulaInfo;
        let formulaVal: string = '';
        const savedTokens: number[] = [];
        let isSheetRenamed: boolean = false;
        let rowIndex: number; let colIndex: number; let sheetIndex: number;
        dependentCellRef.forEach((value: string[], key: string) => {
            cellRef.push(key);
        });
        for (let i: number = 0; i < this.sheetInfo.length; i++) {
            if (this.sheetInfo[i].index === sheetIdx) {
                this.sheetInfo[i].visibleName = name;
                break;
            }
        }
        const sheetNames: { visibleName: string, sheet: string }[] = this.sheetInfo;
        for (let i: number = 0; i < cellRef.length; i++) {
            const dependentCells: string[] = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (let j: number = 0; j < dependentCells.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCells[j]);
                formulaVal = fInfo.formulaText;
                for (let s: number = 0; s < sheetNames.length; s++) {
                    if (sheetNames[s].visibleName !== sheetNames[s].sheet) {
                        const name: string = sheetNames[s].sheet.toUpperCase();
                        if (formulaVal.toUpperCase().indexOf(name) > -1) {
                            formulaVal = formulaVal.toUpperCase().split(name).join(s + '/');
                            savedTokens.push(s);
                            isSheetRenamed = true;
                        }
                    }
                }
                if (isSheetRenamed) {
                    for (let k: number = 0; k < savedTokens.length; k++) {
                        formulaVal = formulaVal.split(savedTokens[k].toString() + '/').join(sheetNames[savedTokens[k]].visibleName);
                    }
                    rowIndex = this.calculateInstance.rowIndex(dependentCells[j]);
                    colIndex = this.calculateInstance.colIndex(dependentCells[j]);
                    sheetIndex = getSheetIndexByName(
                        this.parent, ('Sheet') + (parseInt(dependentCells[j].split('!')[1], 10) + 1), this.sheetInfo);
                    this.updateDataContainer([rowIndex - 1, colIndex - 1], { value: formulaVal, sheetId: sheetIndex, visible: true });
                }
            }
        }
    }

    private updateDataContainer(indexes: number[], data: { value: string, sheetId: number, visible?: boolean }): void {
        const rowIndex: number = indexes[0];
        const colIndex: number = indexes[1];
        let sheetData: RowModel[];
        let rowData: RowModel;
        let colObj: CellModel;
        const len: number = this.parent.sheets.length;
        for (let i: number = 0; i < len; i++) {
            if (this.parent.sheets[i].id === data.sheetId) {
                sheetData = this.parent.sheets[i].rows;
                break;
            }
        }
        if (!isNullOrUndefined(data)) {
            if (rowIndex in sheetData) {
                rowData = sheetData[rowIndex];
                if (colIndex in rowData.cells) {
                    colObj = rowData.cells[colIndex];
                    colObj.formula = data.value;
                    colObj.value = data.visible ? colObj.value : this.referenceError();
                } else {
                    rowData.cells[colIndex] = colObj = {};
                }
            } else {
                rowData = sheetData[rowIndex] = {};
                rowData[colIndex] = colObj = {};
            }
        }
    }

    private parseSheetRef(value: string): string {
        let regx: RegExp;
        // eslint-disable-next-line no-useless-escape
        const escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,.{}|\":<>~_-]', 'g');
        let i: number = 0;
        const sheetCount: number = this.parent.sheets.length;
        const temp: number[] = [];
        temp.length = 0;
        let regxTemp: RegExp; let searchIdx: number; let idx: number; let valSearchIdx: number; let regxVisible: RegExp;
        const sheetInfo: { visibleName: string, sheet: string }[] = this.getSheetInfo();
        const exp: string = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        for (i = 0; i < sheetCount; i++) {
            if (sheetInfo[i].sheet !== sheetInfo[i].visibleName) {
                regx = new RegExp(sheetInfo[i].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                idx = i;
                if (value.match(regx)) {
                    for (let j: number = i + 1; j < sheetCount; j++) {
                        regxTemp = new RegExp(sheetInfo[j].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                        searchIdx = value.search(regxTemp); valSearchIdx = value.search(regx);
                        if (searchIdx > -1 && (searchIdx < valSearchIdx || (searchIdx === valSearchIdx && sheetInfo[j].visibleName.length >
                            sheetInfo[i].visibleName.length))) {
                            regxVisible = new RegExp('Sheet', 'gi');
                            if (sheetInfo[j].visibleName.search(regxVisible) !== 0) {
                                regx = regxTemp; idx = j;
                            }
                        }
                    }
                    value = value.replace(regx, idx + '/');
                    temp.push(idx);
                }
            }
        }
        i = 0;
        while (i < temp.length) {
            regx = new RegExp(temp[i] + '/' + exp, 'gi');
            value = value.replace(regx, sheetInfo[temp[i]].sheet);
            i++;
        }
        return value;
    }

    private registerSheet(sheetIndex: number = 0, sheetCount: number = this.parent.sheets.length): void {
        let id: string;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.registerGridAsSheet(id, id, this.calcID);
            sheetIndex++;
        }
    }

    private unRegisterSheet(
        sheetIndex: number = 0, sheetCount: number = this.parent.sheets.length, propertyChange?: boolean): void {
        let id: string;
        this.calculateInstance.tokenCount = 0;
        if (propertyChange) {
            this.calculateInstance.unregisterGridAsSheet(id, id, propertyChange);
        } else {
            while (sheetIndex < sheetCount) {
                id = getSheet(this.parent, sheetIndex).id + '';
                this.calculateInstance.unregisterGridAsSheet(id, id);
                sheetIndex++;
            }
        }
    }

    private refreshCalculate(
        rowIdx: number, colIdx: number, value: string, isFormula: boolean, sheetIdx: number, isRefreshing: boolean): void {
        const sheet: SheetModel = isNullOrUndefined(sheetIdx) ? this.parent.getActiveSheet() : getSheet(this.parent, sheetIdx);
        let sheetName: string = sheet.id + '';
        if (isFormula) {
            value = this.parseSheetRef(value);
            const cellArgs: ValueChangedArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            const usedRange: number[] = [sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
            this.calculateInstance.valueChanged(sheetName, cellArgs, true, usedRange, isRefreshing);
            const referenceCollection: string[] = this.calculateInstance.randCollection;
            if (this.calculateInstance.isRandomVal === true) {
                let rowId: number;
                let colId: number;
                let refValue: string = '';
                if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
                    referenceCollection.length) {
                    for (let i: number = 0; i < this.calculateInstance.randomValues.size; i++) {
                        rowId = this.calculateInstance.rowIndex(referenceCollection[i]);
                        colId = this.calculateInstance.colIndex(referenceCollection[i]);
                        refValue = this.calculateInstance.randomValues.get(referenceCollection[i]);
                        sheetName = (parseFloat(this.calculateInstance.getSheetToken(
                            referenceCollection[i]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                        const tempArgs: ValueChangedArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        } else {
            const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetName);
            let cellRef: string = getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
            if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                cellRef = family.parentObjectToToken.get(sheetName) + cellRef;
            }
            if (this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
                this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                if (this.calculateInstance.getDependentCells().has(cellRef)) {
                    this.calculateInstance.clearFormulaDependentCells(cellRef);
                }
            }
            this.calculateInstance.getComputedValue().clear();
            this.calculateInstance.refresh(cellRef);
            this.calculateInstance.refreshRandValues(cellRef);
        }
        this.calculateInstance.cell = '';
        const updatedCell: CellModel = getCell(rowIdx, colIdx, this.parent.getActiveSheet());
        if (updatedCell && value && value.toString().toUpperCase().indexOf('=SUM(') === 0) {
            const errorStrings: string[] = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!', 'invalid arguments'];
            const val: string = value.toString().toUpperCase().replace('=SUM', '').replace('(', '').replace(')', '').split(':')[0];
            if (isCellReference(val)) {
                const index: number[] = getRangeIndexes(val);
                const fCell: CellModel = getCell(index[0], index[1], this.parent.getActiveSheet());
                if (fCell && fCell.value && fCell.format &&
                    errorStrings.indexOf(updatedCell.value) < 0 && errorStrings.indexOf(fCell.value) < 0) {
                    updatedCell.format = fCell.format;
                }
            }
        }
    }

    private autoCorrectFormula(formula: string, rowIdx: number, colIdx: number, sheetIdx: number): string {
        if (!isNullOrUndefined(formula)) {
            formula = formula.toString();
            if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
                formula += ')';
            }
            let isEqual: boolean;
            if (formula.indexOf('=') === 0) {
                formula = formula.slice(1); isEqual = true;
            }
            const lessEq: RegExpMatchArray = formula.match(/</g);
            const greaterEq: RegExpMatchArray = formula.match(/>/g);
            const equal: RegExpMatchArray = formula.match(/=/g);
            if (lessEq) {
                let lessOp: string = '';
                for (let i: number = 0; i < lessEq.length; i++) {
                    lessOp = lessOp + lessEq[i];
                }
                formula = formula.replace(lessOp, '<');
            }
            if (greaterEq) {
                let greaterOp: string = '';
                for (let j: number = 0; j < greaterEq.length; j++) {
                    greaterOp = greaterOp + greaterEq[j];
                }
                formula = formula.replace(greaterOp, '>');
            }
            if (equal) {
                let equalOp: string = '';
                for (let c: number = 0; c < equal.length; c++) {
                    equalOp = equalOp + equal[c];
                }
                formula = formula.split(equalOp).join('=');
            }
            formula = isEqual ? '=' + formula : formula;
            if (lessEq || greaterEq || equal) {
                getCell(
                    rowIdx, colIdx, isNullOrUndefined(sheetIdx) ? this.parent.getActiveSheet() : getSheet(
                    this.parent, sheetIdx)).formula = formula;
            }
        }
        return formula;
    }

    private initiateDefinedNames(): void {
        const definedNames: DefineNameModel[] = this.parent.definedNames;
        let i: number = 0;

        while (i < definedNames.length) {
            const definedname: DefineNameModel = definedNames[i];
            const refersTo: string = this.parseSheetRef(definedname.refersTo);
            let range: string = getRangeFromAddress(refersTo);
            let cellRef: boolean = false;
            const isLink: boolean = refersTo.indexOf('http:') > -1 ? true : (refersTo.indexOf('https:') > -1 ? true : false);
            range = range.split('$').join('');
            range = range.split('=').join('');
            if (range.indexOf(':') > -1) {
                const rangeSplit: string[] = range.split(':');
                if (isCellReference(rangeSplit[0]) && isCellReference(rangeSplit[1])) {
                    cellRef = true;
                }
            } else if (range.indexOf(':') < 0) {
                if (isCellReference(range)) {
                    cellRef = true;
                }
            }
            if (isLink) {
                cellRef = false;
            }
            if (cellRef) {
                this.addDefinedName(definedname, true);
            } else {
                this.removeDefinedName(definedname.name, definedname.scope);
                i--;
            }
            i++;
        }
    }

    /**
     * @hidden
     * Used to add defined name to workbook.
     *
     * @param {DefineNameModel} definedName - Define named range.
     * @param {boolean} isValidate - Specify the boolean value.
     * @returns {boolean} - Used to add defined name to workbook.
     */
    private addDefinedName(definedName: DefineNameModel, isValidate: boolean, index?: number): boolean {
        if (index === undefined || index < -1) { index = this.parent.definedNames.length; }
        let isAdded: boolean = true;
        let sheetIdx: number;
        let name: string = definedName.name;
        if (definedName.refersTo.indexOf('!') < 0) {
            let sheetName: string = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            definedName.refersTo = sheetName + '!' + ((definedName.refersTo.indexOf('=') < 0) ?
                definedName.refersTo : definedName.refersTo.split('=')[1]);
        }
        const visibleRefersTo: string = definedName.refersTo;
        const refersTo: string = this.parseSheetRef(definedName.refersTo);
        if (definedName.scope) {
            sheetIdx = getSheetIndex(this.parent, definedName.scope);
            if (sheetIdx > -1) {
                name = getSheetName(this.parent, sheetIdx) + '!' + name;
            }
        } else {
            definedName.scope = '';
        }
        if (!definedName.comment) { definedName.comment = ''; }
        //need to extend once internal sheet value changes done.
        if (!isValidate && this.checkIsNameExist(definedName.name, definedName.scope)) {
            isAdded = false;
        } else {
            this.calculateInstance.addNamedRange(name, refersTo[0] === '=' ? refersTo.substr(1) : refersTo);
            if (refersTo[0] !== '=') {
                definedName.refersTo = '=' + visibleRefersTo;
            }
            if (this.parent.definedNames.indexOf(definedName) < 0) {
                this.parent.definedNames.splice(index, 0, definedName);
            }
        }
        return isAdded;
    }

    /**
     * @hidden
     * Used to remove defined name from workbook.
     *
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     * @returns {boolean} - To Return the bool value.
     */
    private removeDefinedName(name: string, scope: string): boolean {
        let isRemoved: boolean = false;
        const index: number = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            let calcName: string = name;
            if (scope) {
                const sheetIdx: number = getSheetIndex(this.parent, scope);
                if (sheetIdx) {
                    calcName = getSheetName(this.parent, sheetIdx) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            this.parent.definedNames.splice(index, 1);
            isRemoved = true;
        }
        return isRemoved;
    }

    private checkIsNameExist(name: string, sheetName?: string): boolean {
        const isExist: boolean = this.parent.definedNames.some((key: DefineNameModel) => {
            return key.name === name && (sheetName ? key.scope === sheetName : key.scope === '');
        });
        return isExist;
    }

    private getIndexFromNameColl(definedName: string, scope: string = ''): number {
        let index: number = -1;
        this.parent.definedNames.filter((name: DefineNameModel, idx: number) => {
            if (name.name === definedName && name.scope === scope) {
                index = idx;
            }
        });
        return index;
    }

    private toFixed(value: string): string {
        const num: number = Number(value);
        if (Math.round(num) !== num) { value = num.toFixed(2); }
        return value;
    }

    private aggregateComputation(args: AggregateArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let range: string = getSingleSelectedRange(sheet);
        const indexes: number[] = getRangeIndexes(range.split(':')[1]);
        let i: number; let calcValue: string;
        const formulaVal: string[] = ['SUM', 'AVERAGE', 'MIN', 'MAX'];
        const formatedValues: string[] = [];
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = `A1:${getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex)}`;
        }
        const actCell: number[] = getRangeIndexes(sheet.activeCell);
        const actCellModel: CellModel = sheet.rows[actCell[0]] ? sheet.rows[actCell[0]].cells ?
            sheet.rows[actCell[0]].cells[actCell[1]] : {} : {};
        const actCellfrmt: string = (actCellModel) ? actCellModel.format : '';
        let cellValue: string;
        const cellCol: string | string[] = this.calculateInstance.getCellCollection(range);
        for (i = 0; i < cellCol.length; i++) {
            cellValue = this.calculateInstance.getValueFromArg(cellCol[i]);
            if (isNumber(cellValue)) { args.countOnly = false; break; }
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count || args.countOnly) { return; }
        for (i = 0; i < 4; i++) {
            calcValue = this.toFixed(this.calculateInstance.getFunction(formulaVal[i])(range));
            const eventArgs: { [key: string]: string | number | boolean } = {
                formattedText: calcValue,
                value: calcValue,
                format: actCellfrmt,
                onLoad: true
            };
            if (actCellfrmt) {
                this.parent.notify(getFormattedCellObject, eventArgs);
                calcValue = eventArgs.formattedText as string;
            }
            formatedValues.push(calcValue);
        }
        args.Sum = formatedValues[0]; args.Avg = formatedValues[1];
        args.Min = formatedValues[2]; args.Max = formatedValues[3];
    }

    private clearFormula(args: ClearFormulaArgs): void {
        if (this.parent.activeSheetIndex === args.sheetIdx) {
            args.rowIdx = (args.type === 'Row') ? (args.status === 'insert') ? (args.rowIdx >= args.startIdx)
                ? args.rowIdx - args.count : args.rowIdx : args.rowIdx + args.count : args.rowIdx;
            args.colIdx = (args.type === 'Column') ? (args.status === 'insert') ? (args.colIdx >= args.startIdx) ?
                args.colIdx - args.count : args.colIdx : args.colIdx + args.count : args.colIdx;
        }
        const cellRef: string = '!' + args.sheetIdx + '!' + getAlphalabel((args.colIdx === -1 ?
            (args.colIdx + 2) : (args.colIdx + 1))) + (args.rowIdx === -1 ? (args.rowIdx + 2) : (args.rowIdx + 1));
        this.calculateInstance.getFormulaInfoTable().delete(cellRef);
        this.calculateInstance.clearFormulaDependentCells(cellRef);
    }

    private refreshFormula(formulaValue: string, count: number, status: string, type: string, startIdx: number, sheetIdx: number): string {
        let diff: number;
        let diff1: number;
        let val: string = formulaValue;
        let nAlpha: string;
        let range: number[] = [];
        const actSheet: SheetModel = this.parent.getActiveSheet();
        const deleteIdxs: number[] = [];
        let i: number;
        let splitFormula: string[] = [];
        let fArg: string;
        let ridx: number;
        let pVal: string;
        if (checkIsFormula(val)) {
            if (status === 'delete') {
                for (i = 1; i <= count; i++) {
                    deleteIdxs.push(startIdx + i); }
            }
            splitFormula = this.parseFormula(val);
            for (i = 0; i < splitFormula.length; i++) {
                fArg = splitFormula[i].trim();
                if (this.calculateInstance.isCellReference(fArg)) {
                    pVal = i && splitFormula[i - 1].trim();
                    if (pVal && pVal[pVal.length - 1] === '!') {
                        pVal = pVal.replace(/['!]/g, '');
                        if (pVal !== actSheet.name) {
                            continue;
                        }
                    } else if (parseInt(pVal, 10) === 0 && pVal[pVal.length - 1] === undefined) {
                        if ((actSheet.id - 1) !== sheetIdx) { continue; }
                    }
                    range = getRangeIndexes(fArg);
                    diff = (type === 'Column') ? (status === 'insert') ? range[3] + count : range[3] - count :
                        (status === 'insert') ? range[2] + count : range[2] - count;
                    diff1 = (type === 'Column') ? (status === 'insert') ? range[1] + count : range[1] - count :
                        (status === 'insert') ? range[0] + count : range[0] - count;
                    diff1 = (type === 'Column') ? (startIdx > range[1]) ? range[1] : diff1 : (startIdx > range[0]) ? range[0] : diff1;
                    diff = (type === 'Column') ? (startIdx > range[3]) ? range[3] : diff : (startIdx > range[2]) ? range[2] : diff;
                    if (diff1 > -1) {
                        nAlpha = (type === 'Column') ? getRangeAddress([range[0], diff1, range[2], diff]).split(':')[0] :
                            getRangeAddress([diff1, range[1], diff, range[3]]).split(':')[0];
                    } else {
                        nAlpha = '#REF!';
                    }
                    if (status === 'delete') {
                        ridx = parseInt(type === 'Row' ? fArg.replace(/[A-Z]/g, '') : (fArg.replace(/[0-9]/g, '')), 10);
                        if (deleteIdxs.indexOf(ridx) > -1) {
                            nAlpha = '#REF!';
                        }
                    }
                    splitFormula[i] = nAlpha;
                }
            }
            val = '=' + splitFormula.join('');
        }
        return val;
    }

    private refreshDelete(args: InsertDeleteEventArgs): void {
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(args.sheet.id.toString());
        let cellRef: string; let dependentCells: string[] = [];
        for (let i: number = 0; i <= args.sheet.usedRange.rowIndex; i++) {
            for (let j: number = 0; j <= args.sheet.usedRange.colIndex; j++) {
                cellRef = getColumnHeaderText(j + 1) + (i + 1);
                if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                    cellRef = family.parentObjectToToken.get(args.sheet.id.toString()) + cellRef;
                }
                if (this.calculateInstance.getDependentCells().has(cellRef)) {
                    [].slice.call(this.calculateInstance.getDependentCells().get(cellRef)).forEach((dependentCell: string) => {
                        if (this.calculateInstance.getFormulaInfoTable().has(dependentCell)) {
                            this.calculateInstance.getFormulaInfoTable().delete(dependentCell);
                        }
                        this.calculateInstance.clearFormulaDependentCells(dependentCell);
                        if (dependentCells.indexOf(dependentCell) === -1) { dependentCells.push(dependentCell); }
                    });
                }
            }
        }
        let token: string; let sheet: SheetModel; let idx: number;  let cellIndex: number[]; let index: number[]; let cell: CellModel;
        let splitFormula: string[]; let ref: string; let diff: number; let newFormula: string;
        dependentCells.forEach((cellRef: string): void => {
            token = cellRef.substring(0, cellRef.lastIndexOf(this.calculateInstance.sheetToken) + 1);
            if (family.tokenToParentObject.has(token)) {
                idx = getSheetIndexFromId(this.parent, Number(family.tokenToParentObject.get(token)));
                if (idx === undefined) { idx = this.parent.activeSheetIndex; }
            } else {
                idx = this.parent.activeSheetIndex;
            }
            sheet = getSheet(this.parent, idx);
            cellIndex = getRangeIndexes(cellRef.substring(cellRef.lastIndexOf(this.calculateInstance.sheetToken) + 1));
            if (args.modelType === 'Row') {
                if (cellIndex[0] >= args.startIndex && cellIndex[2] <= args.endIndex) { return; }
            } else {
                if (cellIndex[1] >= args.startIndex && cellIndex[3] <= args.endIndex) { return; }
            }
            cell = getCell(cellIndex[0], cellIndex[1], sheet);
            if (cell.formula && checkIsFormula(cell.formula)) {
                splitFormula = this.parseFormula(cell.formula, true);
                for (let i: number = 0; i < splitFormula.length; i++) {
                    ref = splitFormula[i].trim();
                    if (this.calculateInstance.isCellReference(ref)) {
                        index = getRangeIndexes(ref);
                        if (args.modelType === 'Row') {
                            diff = index[0] - args.startIndex;
                            if (diff > 0) {
                                if (index[0] > args.endIndex) {
                                    diff = (args.endIndex - args.startIndex) + 1;
                                    if (diff > 0) { index[0] -= diff; }
                                } else {
                                    index[0] -= diff;
                                }
                            }
                            if (args.startIndex <= index[2]) {
                                if (args.endIndex <= index[2]) {
                                    index[2] -= (args.endIndex - args.startIndex) + 1;
                                } else {
                                    index[2] -= (index[2] - args.startIndex) + 1;
                                }
                            }
                            splitFormula[i] = index[2] < index[0] ? this.calculateInstance.getErrorStrings()[CommonErrors.ref] :
                                this.getAddress(index);
                        } else {
                            diff = index[1] - args.startIndex;
                            if (diff > 0) {
                                if (index[1] > args.endIndex) {
                                    diff = (args.endIndex - args.startIndex) + 1;
                                    if (diff > 0) { index[1] -= diff; }
                                } else {
                                    index[1] -= diff;
                                }
                            }
                            if (args.startIndex <= index[3]) {
                                if (args.endIndex <= index[3]) {
                                    index[3] -= (args.endIndex - args.startIndex) + 1;
                                } else {
                                    index[3] -= (index[3] - args.startIndex) + 1;
                                }
                            }
                            splitFormula[i] = index[3] < index[1] ? this.calculateInstance.getErrorStrings()[CommonErrors.ref] :
                                this.getAddress(index);
                        }
                    }
                }
                newFormula = '=' + splitFormula.join('');
                if (cell.formula !== newFormula) {
                    cell.formula = newFormula; cell.value = null;
                }
            }
        });
    }

    private getAddress(index: number[]): string {
        return (index[0] === index[2] && index[1] === index[3] ? getCellAddress(index[0], index[1]) : getRangeAddress(index));
    }

    private refreshInsDelFormula(args: InsertDeleteEventArgs): void {
        let count: number;
        let sheet: SheetModel;
        const sheets: SheetModel[] = this.parent.sheets;
        const sheetLen: number = sheets.length;
        if (isNullOrUndefined(args.activeSheetIndex)) { args.activeSheetIndex = this.parent.activeSheetIndex; }
        const sheetName: string = this.parent.sheets[args.activeSheetIndex].name;
        let address: number[];
        let cell: CellModel;
        let s: number;
        let updatedFormulaVal: string;
        if (args.name === 'delete') {
            this.refreshDelete(args); return;
        }
        for (s = 0; s < sheetLen; s++) {
            count = args.model.length;
            sheet = this.parent.sheets[s];
            address = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
            for (let i: number = address[2]; i >= address[0]; i--) {
                if (args.modelType === 'Row' && i >= args.startIndex && i <= args.endIndex) { continue; }
                for (let j: number = address[1]; j <= address[3]; j++) {
                    if (args.modelType === 'Column' && i >= args.startIndex && i <= args.endIndex) { continue; }
                    cell = getCell(i, j, sheet);
                    if (cell && cell.formula && checkIsFormula(cell.formula)) {
                        if (args.activeSheetIndex !== s && !cell.formula.includes(sheetName)) {
                            continue;
                        }
                        this.clearFormula({
                            rowIdx: i, colIdx: j, sheetIdx: s, count: count, status: args.name,
                            type: args.modelType, startIdx: args.startIndex
                        });
                        updatedFormulaVal = this.refreshFormula(cell.formula, count, args.name, args.modelType, args.startIndex, s);
                        if (updatedFormulaVal.indexOf('UNIQUE') === - 1) {
                            this.parent.notify(
                                workbookEditOperation,
                                {
                                    action: 'updateCellValue', address: [i, j, i,
                                        j], value: updatedFormulaVal, sheetIndex: s
                                });
                        }
                    }
                }
            }
        }
    }

    private parseFormula(formula: string, rangeRef?: boolean): string[] {
        let temp: string;
        let str: string | number;
        let i: number = 0;
        const arr: string[] = [];
        let formulaVal: string[] | string = [];
        formulaVal = this.markSpecialChar(formula.replace('=', ''), rangeRef);
        formulaVal = rangeRef ? formulaVal.split(/\(|\)|=|\^|>|<|,|\+|-|\*|\/|%|&/g) :
            formulaVal.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        const len: number = formulaVal.length;
        while (i < len) {
            temp = formulaVal[i];
            if (!temp) {
                i++;
                continue;
            }
            if (temp.length === 1) {
                arr.push(this.isUniqueChar(temp) ? this.getUniqueCharVal(temp) : temp);
            } else {
                str = temp[0];
                if (temp.indexOf('!') > 0) {
                    if (this.isUniqueChar(str)) {
                        arr.push(this.getUniqueCharVal(str));
                        temp = temp.substr(1);
                    }
                    str = temp.indexOf('!') + 1;
                    arr.push(temp.substr(0, str));
                    arr.push(temp.substr(str));
                } else if (this.isUniqueChar(str)) {
                    arr.push(this.getUniqueCharVal(str));
                    arr.push(temp.substr(1));
                } else {
                    arr.push(temp);
                }
            }
            i++;
        }
        return arr;
    }
    private getUniqueCharVal(formula: string): string {
        switch (formula) {
        case this.uniqueOBracket:
            return '(';
        case this.uniqueCBracket:
            return ')';
        case this.uniqueCSeparator:
            return ',';
        case this.uniqueCOperator:
            return ':';
        case this.uniquePOperator:
            return '+';
        case this.uniqueSOperator:
            return '-';
        case this.uniqueMOperator:
            return '*';
        case this.uniqueDOperator:
            return '/';
        case this.uniqueModOperator:
            return '%';
        case this.uniqueConcateOperator:
            return '&';
        case this.uniqueEqualOperator:
            return '=';
        case this.uniqueExpOperator:
            return '^';
        case this.uniqueGTOperator:
            return '>';
        case this.uniqueLTOperator:
            return '<';
        }
        return '';
    }
    private isUniqueChar(formula: string | number): boolean {
        const code: number = (formula as string).charCodeAt(formula as number);
        return code >= 129 && code <= 142;
    }

    private markSpecialChar(formula: string, rangeRef?: boolean): string {
        formula = formula.replace(/\(/g, '(' + this.uniqueOBracket).replace(/\)/g, ')' + this.uniqueCBracket);
        if (rangeRef) {
            formula = formula.replace(/,/g, ',' + this.uniqueCSeparator);
        } else {
            formula = formula.replace(/,/g, ',' + this.uniqueCSeparator).replace(/:/g, ':' + this.uniqueCOperator);
        }
        formula = formula.replace(/\+/g, '+' + this.uniquePOperator).replace(/-/g, '-' + this.uniqueSOperator);
        formula = formula.replace(/\*/g, '*' + this.uniqueMOperator).replace(/\//g, '/' + this.uniqueDOperator);
        formula = formula.replace(/&/g, '&' + this.uniqueConcateOperator);
        formula = formula.replace(/=/g, '=' + this.uniqueEqualOperator);
        formula = formula.replace(/\^/g, '^' + this.uniqueExpOperator);
        formula = formula.replace(/>/g, '>' + this.uniqueGTOperator).replace(/</g, '<' + this.uniqueLTOperator);
        return formula.replace(/%/g, '%' + this.uniqueModOperator);
    }

    private refreshNamedRange(args: InsertDeleteEventArgs): void {
        if (args.definedNames && args.definedNames.length) {
            args.definedNames.forEach((definedName: DefineNameModel): void => {
                this.parent.removeDefinedName(definedName.name, definedName.scope);
                this.parent.addDefinedName(definedName);
            });
            return;
        }
        const len: number = this.parent.definedNames.length;
        if (!len) { return; }
        const definedNames: DefineNameModel[] = Object.assign({}, this.parent.definedNames);
        let range: number[]; let sheetName: string; let splitedRef: string[]; let definedName: DefineNameModel; let changed: boolean;
        for (let i: number = 0; i < len; i++) {
            definedName = definedNames[i]; splitedRef = definedName.refersTo.split('!'); sheetName = splitedRef[0].split('=')[1];
            if (sheetName !== args.sheet.name) { continue; }
            range = getRangeIndexes(splitedRef[1]); changed = false;
            if (args.name === 'insert') {
                if (args.modelType === 'Row') {
                    if (args.index <= range[0]) { range[0] += args.model.length; changed = true; }
                    if (args.index <= range[2]) { range[2] += args.model.length; changed = true; }
                } else if (args.modelType === 'Column') {
                    if (args.index <= range[1]) { range[1] += args.model.length; changed = true; }
                    if (args.index <= range[3]) { range[3] += args.model.length; changed = true; }
                }
                this.updateDefinedNames(definedName, sheetName, range, changed);
            } else {
                if (args.modelType === 'Row') {
                    const startDiff: number = range[0] - args.startIndex;
                    if (startDiff > 0) { range[0] -= startDiff; changed = true; }
                    if (args.startIndex <= range[2]) {
                        if (args.endIndex <= range[2]) {
                            range[2] -= args.deletedModel.length;
                        } else {
                            range[2] -= (range[2] - args.startIndex) + 1;
                        }
                        changed = true;
                    }
                    this.updateDefinedNames(definedName, sheetName, range, changed, [range[0], range[2]], args);
                } else if (args.modelType === 'Column') {
                    const startDiff: number = range[1] - args.startIndex;
                    if (startDiff > 0) { range[1] -= startDiff; changed = true; }
                    if (args.startIndex <= range[3]) {
                        if (args.endIndex <= range[3]) {
                            range[3] -= args.deletedModel.length;
                        } else {
                            range[3] -= (range[3] - args.startIndex) + 1;
                        }
                        changed = true;
                    }
                    this.updateDefinedNames(definedName, sheetName, range, changed, [range[1], range[3]], args);
                }
            }
        }
    }

    private updateDefinedNames(
        definedName: DefineNameModel, sheetName: string, range: number[], changed: boolean, idx?: number[],
        args?: InsertDeleteEventArgs): void {
        if (!changed) { return; }
        const index: number = this.parent.definedNames.indexOf(definedName);
        this.parent.removeDefinedName(definedName.name, definedName.scope);
        if (idx) {
            let oldDefinedName: DefineNameModel = { name: definedName.name, comment: definedName.comment, refersTo: definedName.refersTo,
                scope: definedName.scope };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            oldDefinedName = new DefineName(this.parent as any, 'definedNames', oldDefinedName, true);
            if (args.definedNames) {
                args.definedNames.push(oldDefinedName);
            } else {
                args.definedNames = [oldDefinedName];
            }
            if (idx[1] < idx[0]) { return; }
        }
        definedName.refersTo = sheetName + '!' + getRangeAddress(range);
        this.parent.notify(workbookFormulaOperation, { action: 'addDefinedName', definedName: definedName, isAdded: false, index: index });
    }
}

interface ClearFormulaArgs {
    rowIdx: number;
    colIdx: number;
    sheetIdx: number;
    count: number;
    status: string;
    type: string;
    startIdx: number;
}
