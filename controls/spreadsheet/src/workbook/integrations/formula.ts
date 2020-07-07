/* tslint:disable-next-line:max-line-length */
import { Workbook, getSheetName, getSheetIndex, getSheet, SheetModel, RowModel, CellModel, getSheetIndexByName } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, AggregateArgs, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CalcSheetFamilyItem, FormulaInfo, CommonErrors, getAlphalabel } from '../../calculate/index';
import { IFormulaColl } from '../../calculate/common/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DefineNameModel, getCellAddress,  getFormattedCellObject, isNumber } from '../common/index';

/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
export class WorkbookFormula {
    private parent: Workbook;
    private calcID: number;

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
                args.categoryCollection = collection;
                break;
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
                this.unRegisterSheet(<number>args.sheetIndex, <number>args.sheetCount);
                break;
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
                        args.sheetName = this.sheetInfo[i].sheet;
                        this.sheetInfo.splice(i, 1);
                        break;
                    }
                }
                this.sheetDeletion(<string>args.sheetName, <number>args.index, <number>args.index);
                break;
            case 'getReferenceError':
                args.refError = this.referenceError();
                break;
            case 'getAlpha':
                args.col = getAlphalabel(<number>args.col);
                break;
            case 'addCustomFunction':
                this.addCustomFunction(<string | Function>args.functionHandler, <string>args.functionName);
                break;
            case 'computeExpression':
                args.calcValue = this.calculateInstance.computeExpression(<string>args.formula);
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
                sheetId = getSheetIndexByName(
                    this.parent, ('Sheet') + (parseInt(dependentCellRef[j].split('!')[1], 10) + 1), this.sheetInfo);
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
            }
        }
    }
    private removeSheetTokenIndex(value: string, index: number): string {
        let family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(this.calculateInstance.grid);
        family.sheetNameToToken.delete(index.toString());
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
        if (!sheetIdx) {
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
                this.calculateInstance.cell = '';
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
        let len: number = definedNames.length;
        let i: number = 0;

        while (i < len) {
            let definedname: DefineNameModel = definedNames[i];
            this.addDefinedName(definedname, true);
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
}
