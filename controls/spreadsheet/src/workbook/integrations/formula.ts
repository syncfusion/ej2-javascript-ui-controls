/* tslint:disable-next-line:max-line-length */
import { Workbook, getSheetName, getSheetIndex, getSheet, SheetModel, RowModel, CellModel, getSheetIndexByName, getCell } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, AggregateArgs, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CalcSheetFamilyItem, FormulaInfo, CommonErrors, getAlphalabel } from '../../calculate/index';
import { IFormulaColl } from '../../calculate/common/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DefineNameModel, getCellAddress, getFormattedCellObject, isNumber, checkIsFormula} from '../common/index';
import { workbookEditOperation, getRangeAddress, InsertDeleteEventArgs, getRangeFromAddress, isCellReference } from '../common/index';


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
     * @return {void}
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
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
        }
    }

    /**
     * Get the module name.
     * @returns string
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
        let action: string = <string>args.action;
        let formulas: Map<string, IFormulaColl> = this.calculateInstance.getLibraryFormulas();
        let formulaInfo: IFormulaColl[] = (Array.from(formulas.values()));
        switch (action) {
            case 'getLibraryFormulas':
                args.formulaCollection = Array.from(formulas.keys());
                break;
            case 'getFormulaCategory':
                let collection: string[] = ['All'];
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
                this.unRegisterSheet(<number>args.sheetIndex, <number>args.sheetCount); break;
            case 'refreshCalculate':
                args.value = this.autoCorrectFormula(<string>args.value);
                this.refreshCalculate(
                    <number>args.rowIndex, <number>args.colIndex, <string>args.value,
                    <boolean>args.isFormula, <number>args.sheetIndex
                );
                break;
            case 'getArgumentSeparator':
                args.argumentSeparator = this.calculateInstance.getParseArgumentSeparator();
                break;
            case 'addDefinedName':
                args.isAdded = this.addDefinedName(<DefineNameModel>args.definedName);
                break;
            case 'removeDefinedName':
                args.isRemoved = this.removeDefinedName(
                    <string>args.definedName, <string>args.scope
                );
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
                let length: number = this.sheetInfo.length;
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
                this.refreshNamedRange(<InsertDeleteEventArgs>args.insertArgs, action);
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

    private sheetDeletion(delSheetName: string, sheetId: number, index: number): void {
        let dependentCell: Map<string, string[]> = this.calculateInstance.getDependentCells();
        let cellRef: string[] = [];
        let fInfo: FormulaInfo = null;
        let formulaVal: string = '';
        let rowId: number; let colId: number;
        dependentCell.forEach((value: string[], key: string) => {
            cellRef.push(key);
        });
        this.removeSheetTokenIndex(formulaVal, index);
        for (let i: number = 0; i < cellRef.length; i++) {
            let dependentCellRef: string[] = this.calculateInstance.getDependentCells().get(cellRef[i]);
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
        let family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(this.calculateInstance.grid);
        family.sheetNameToToken.delete(index.toString());
        family.sheetNameToParentObject.delete(index.toString());
        family.parentObjectToToken.delete(index.toString());
        family.tokenToParentObject.delete('!' + (index - 1).toString() + '!');
        return value;
    }

    private renameUpdation(name: string, sheetIdx: number): void {
        let dependentCellRef: Map<string, string[]> = this.calculateInstance.getDependentCells();
        let cellRef: string[] = [];
        let fInfo: FormulaInfo;
        let formulaVal: string = '';
        let savedTokens: number[] = [];
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
        let sheetNames: { visibleName: string, sheet: string }[] = this.sheetInfo;
        for (let i: number = 0; i < cellRef.length; i++) {
            let dependentCells: string[] = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (let j: number = 0; j < dependentCells.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCells[j]);
                formulaVal = fInfo.formulaText;
                for (let s: number = 0; s < sheetNames.length; s++) {
                    if (sheetNames[s].visibleName !== sheetNames[s].sheet) {
                        let name: string = sheetNames[s].sheet.toUpperCase();
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
        let rowIndex: number = indexes[0];
        let colIndex: number = indexes[1];
        let sheetData: RowModel[];
        let rowData: RowModel;
        let colObj: CellModel;
        let len: number = this.parent.sheets.length;
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
        let escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,.{}|\":<>~_-]', 'g');
        let i: number = 0;
        let sheetCount: number = this.parent.sheets.length;
        let temp: number[] = [];
        temp.length = 0;
        let sheetInfo: { visibleName: string, sheet: string }[] = this.getSheetInfo();
        let exp: string = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        for (i = 0; i < sheetCount; i++) {
            if (sheetInfo[i].sheet !== sheetInfo[i].visibleName) {
                regx = new RegExp(sheetInfo[i].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                if (value.match(regx)) {
                    value = value.replace(regx, i + '/');
                    temp.push(i);
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
        sheetIndex: number = 0, sheetCount: number = this.parent.sheets.length): void {
        let id: string;
        this.calculateInstance.tokenCount = 0;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.unregisterGridAsSheet(id, id);
            sheetIndex++;
        }
    }

    private refreshCalculate(rowIdx: number, colIdx: number, value: string, isFormula: boolean, sheetIdx: number): void {
        if (sheetIdx === undefined) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        let sheetName: string = getSheet(this.parent, sheetIdx).id + '';
        if (isFormula) {
            value = this.parseSheetRef(value);
            let cellArgs: ValueChangedArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            let referenceCollection: string[] = this.calculateInstance.randCollection;
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
                        let tempArgs: ValueChangedArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        } else {
            let family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetName);
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
    }

    private autoCorrectFormula(formula: string): string {
        if (!isNullOrUndefined(formula)) {
            formula = formula.toString();
            if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
                formula += ')';
            }
        }
        return formula;
    }

    private initiateDefinedNames(): void {
        let definedNames: DefineNameModel[] = this.parent.definedNames;
        let i: number = 0;

        while (i < definedNames.length) {
            let definedname: DefineNameModel = definedNames[i];
            let refersTo: string = this.parseSheetRef(definedname.refersTo);
            let range: string = getRangeFromAddress(refersTo);
            let cellRef: boolean = false;
            range = range.split('$').join('');
            range = range.split('=').join('');
            if (range.indexOf(':') > -1) {
                let rangeSplit: string[] = range.split(':');
                if (isCellReference(rangeSplit[0]) && isCellReference(rangeSplit[1])) {
                    cellRef = true;
                }
            } else if (range.indexOf(':') < 0) {
                if (isCellReference(range)) {
                    cellRef = true;
                }
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
     * @param {DefineNameModel} name - Define named range.
     */
    private addDefinedName(definedName: DefineNameModel, isValidate?: boolean): boolean {
        let isAdded: boolean = true;
        let sheetIdx: number;
        let name: string = definedName.name;
        if (definedName.refersTo.indexOf('!') < 0) {
            let sheetName: string = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            definedName.refersTo = sheetName + '!' + ((definedName.refersTo.indexOf('=') < 0) ?
                definedName.refersTo : definedName.refersTo.split('=')[1]);
        }
        let visibleRefersTo: string = definedName.refersTo;
        let refersTo: string = this.parseSheetRef(definedName.refersTo);
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
                this.parent.definedNames.push(definedName);
            }
        }
        return isAdded;
    }

    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    private removeDefinedName(name: string, scope: string): boolean {
        let isRemoved: boolean = false;
        let index: number = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            let calcName: string = name;
            if (scope) {
                let sheetIdx: number = getSheetIndex(this.parent, scope);
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
        let isExist: boolean = this.parent.definedNames.some((key: DefineNameModel) => {
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
        let num: number = Number(value);
        if (Math.round(num) !== num) { value = num.toFixed(2); }
        return value;
    }

    private aggregateComputation(args: AggregateArgs): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: string = sheet.selectedRange;
        let indexes: number[] = getRangeIndexes(range.split(':')[1]);
        let i: number; let calcValue: string;
        let formulaVal: string[] = ['SUM', 'AVERAGE', 'MIN', 'MAX'];
        let formatedValues: string[] = [];
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = `A1:${getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex)}`;
        }
        let actCell: number[] = getRangeIndexes(sheet.activeCell);
        let actCellModel: CellModel = sheet.rows[actCell[0]] ? sheet.rows[actCell[0]].cells ?
            sheet.rows[actCell[0]].cells[actCell[1]] : {} : {};
        let actCellfrmt: string = (actCellModel) ? actCellModel.format : '';
        let cellValue: string;
        let cellCol: string | string[] = this.calculateInstance.getCellCollection(range);
        for (i = 0; i < cellCol.length; i++) {
            cellValue = this.calculateInstance.getValueFromArg(cellCol[i]);
            if (isNumber(cellValue)) { args.countOnly = false; break; }
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count || args.countOnly) { return; }
        for (i = 0; i < 4; i++) {
            calcValue = this.toFixed(this.calculateInstance.getFunction(formulaVal[i])(range));
            let eventArgs: { [key: string]: string | number | boolean } = {
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
        let cellRef: string = '!' + args.sheetIdx + '!' + getAlphalabel((args.colIdx === -1 ?
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
        let actSheet: SheetModel = this.parent.getActiveSheet();
        let deleteIdxs: number[] = [];
        let i: number;
        let splitFormula: string[] = [];
        let fArg: string;
        let ridx: number;
        let hasREFVal: boolean = false;
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
                        hasREFVal = true;
                    }
                    if (status === 'delete') {
                        ridx = parseInt(type === 'Row' ? fArg.replace(/[A-Z]/g, '') : (fArg.replace(/[0-9]/g, '')), 10);
                        if (deleteIdxs.indexOf(ridx) > -1) {
                            nAlpha = '#REF!';
                            hasREFVal = true;
                        }
                    }
                    splitFormula[i] = nAlpha;
                }
            }
            val = '=' + splitFormula.join('');
        }
        return val;
    }

    private refreshInsDelFormula(args: InsertDeleteEventArgs): void {
        let count: number;
        let sheet: SheetModel;
        let sheets: SheetModel[] = this.parent.sheets;
        let sheetLen: number = sheets.length;
        let address: number[];
        let cell: CellModel;
        let s: number;
        let updatedFormulaVal: string;
        for (s = 0; s < sheetLen; s++) {
            count = args.model.length;
            sheet = this.parent.sheets[s];
            address = [0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
            for (let i: number = address[2]; i >= address[0]; i--) {
                for (let j: number = address[1]; j <= address[3]; j++) {
                    cell = getCell(i, j, sheet);
                    if (cell && cell.formula && checkIsFormula(cell.formula)) {
                        this.clearFormula({
                            rowIdx: i, colIdx: j, sheetIdx: s, count: count, status: args.name,
                            type: args.modelType, startIdx: args.startIndex
                        });
                        updatedFormulaVal = this.refreshFormula(cell.formula, count, args.name, args.modelType, args.startIndex, s);
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

    private parseFormula(formula: string): string[] {
        let temp: string;
        let str: string | number;
        let len: number;
        let i: number = 0;
        let arr: string[] = [];
        let formulaVal: string[] | string = [];
        formulaVal = this.markSpecialChar(formula.replace('=', ''));
        formulaVal = formulaVal.split(/\(|\)|=|\^|>|<|,|:|\+|-|\*|\/|%|&/g);
        len = formulaVal.length;
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
        let code: number = (formula as string).charCodeAt(formula as number);
        return code >= 129 && code <= 142;
    }

    private markSpecialChar(formula: string): string {
        formula = formula.replace(/\(/g, '(' + this.uniqueOBracket).replace(/\)/g, ')' + this.uniqueCBracket);
        formula = formula.replace(/,/g, ',' + this.uniqueCSeparator).replace(/:/g, ':' + this.uniqueCOperator);
        formula = formula.replace(/\+/g, '+' + this.uniquePOperator).replace(/-/g, '-' + this.uniqueSOperator);
        formula = formula.replace(/\*/g, '*' + this.uniqueMOperator).replace(/\//g, '/' + this.uniqueDOperator);
        formula = formula.replace(/&/g, '&' + this.uniqueConcateOperator);
        formula = formula.replace(/=/g, '=' + this.uniqueEqualOperator);
        formula = formula.replace(/\^/g, '^' + this.uniqueExpOperator);
        formula = formula.replace(/>/g, '>' + this.uniqueGTOperator).replace(/</g, '<' + this.uniqueLTOperator);
        return formula.replace(/%/g, '%' + this.uniqueModOperator);
    }

    private refreshNamedRange(args: InsertDeleteEventArgs, action: string): void {
        let isChanged: boolean = false;
        let modelDefinedNames: DefineNameModel[] = this.parent.definedNames;
        let definedNames: DefineNameModel[] = Object.assign({}, modelDefinedNames);
        let definedName: DefineNameModel;
        let definedNameCnt: number = modelDefinedNames.length;
        let range: string;
        let rangeIndex: number[];
        let count: number;
        let startIndex: number;
        let endIndex: number;
        let newIndex: number[]; let newRange: string;
        let sheetName: string;
        let sheetIndex: number;
        let sheet: SheetModel;
        for (let idx: number = 0; idx < definedNameCnt; idx++) {
            definedName = definedNames[idx];
            range = definedNames[idx].refersTo.split('!')[1];
            rangeIndex = getRangeIndexes(range);
            sheetName = definedName.refersTo.split('!')[0].split('=')[1];
            sheetIndex = getSheetIndex(this.parent, sheetName.replace(/'/g, ''));
            sheet = getSheet(this.parent, sheetIndex);
            if (sheetIndex === this.parent.activeSheetIndex) {
                if (args.name === 'insert') {
                    count = args.model.length;
                    startIndex = args.index;
                    endIndex = args.index + count;
                    if (args.modelType === 'Row') { // for above the named range index
                        if ((rangeIndex[0] >= endIndex) || (rangeIndex[0] >= startIndex && rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0] + count, rangeIndex[1], rangeIndex[2] + count, rangeIndex[3]];
                            isChanged = true;
                        } else if ((rangeIndex[0] <= startIndex && rangeIndex[2] >= startIndex) || (rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2] + count, rangeIndex[3]];
                            isChanged = true;
                        }
                    } else if (args.modelType === 'Column') {
                        if ((rangeIndex[1] >= endIndex) || (rangeIndex[1] >= startIndex && rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1] + count, rangeIndex[2], rangeIndex[3] + count];
                            isChanged = true;
                        } else if ((rangeIndex[1] <= startIndex && rangeIndex[3] >= startIndex) || (rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2], rangeIndex[3] + count];
                            isChanged = true;
                        }
                    }
                } else {
                    count = args.deletedModel.length;
                    startIndex = args.startIndex;
                    endIndex = args.endIndex;
                    if (args.modelType === 'Row') { // for above the named range index
                        if ((rangeIndex[0] >= endIndex) || (rangeIndex[0] >= startIndex && rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0] - count, rangeIndex[1], rangeIndex[2] - count, rangeIndex[3]];
                            isChanged = true;
                        } else if ((rangeIndex[0] <= startIndex && rangeIndex[2] >= startIndex) || (rangeIndex[2] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2] - count, rangeIndex[3]];
                            isChanged = true;
                        }
                    } else if (args.modelType === 'Column') {
                        if ((rangeIndex[1] >= endIndex) || (rangeIndex[1] >= startIndex && rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1] - count, rangeIndex[2], rangeIndex[3] - count];
                            isChanged = true;
                        } else if ((rangeIndex[1] <= startIndex && rangeIndex[3] >= startIndex) || (rangeIndex[3] >= endIndex)) {
                            newIndex = [rangeIndex[0], rangeIndex[1], rangeIndex[2], rangeIndex[3] - count];
                            isChanged = true;
                        }
                    }
                }
                if (isChanged) {
                    newRange = getRangeAddress(newIndex);
                    definedName.refersTo = sheetName + '!' + newRange;
                    this.parent.removeDefinedName(definedName.name, definedName.scope);
                    let eventArgs: { [key: string]: Object } = {
                        action: 'addDefinedName', definedName: definedName, isAdded: false
                    };
                    this.parent.notify(workbookFormulaOperation, eventArgs);
                }
            }
            modelDefinedNames = definedNames;
        }
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
