import { Workbook, getSheetName, getSheet, SheetModel, RowModel, CellModel, getSheetIndexFromId, ColumnModel, setCell, getTypeFromFormat, isHiddenRow, isHiddenCol } from '../index';
import { getCell, getSheetIndex, NumberFormatArgs, checkFormulaRef, parseFormulaArgument, sheetRenameUpdate } from '../index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, AggregateArgs, clearFormulaDependentCells, formulaInValidation, ValidationModel, LocaleNumericSettings, applyCF, getCellRefValue, commputeFormulaValue, getAutoDetectFormatParser, calculateFormula } from '../common/index';
import { Calculate, ValueChangedArgs, CalcSheetFamilyItem, FormulaInfo, CommonErrors, getAlphalabel } from '../../calculate/index';
import { IFormulaColl } from '../../calculate/common/interface';
import { isNullOrUndefined, getNumericObject, L10n } from '@syncfusion/ej2-base';
import { Deferred } from '@syncfusion/ej2-data';
import { DefineNameModel, getCellAddress, getFormattedCellObject, isNumber, checkIsFormula, removeUniquecol, checkUniqueRange } from '../common/index';
import { getRangeAddress, InsertDeleteEventArgs, getRangeFromAddress, isCellReference, refreshInsertDelete, getUpdatedFormulaOnInsertDelete } from '../common/index';
import { getUniqueRange, DefineName, selectionComplete, DefinedNameEventArgs, getRangeIndexes, InvalidFormula, getSwapRange } from '../common/index';
import { FormulaCalculateArgs, updateSheetFromDataSource, ExtendedRange, importModelUpdate } from '../common/index';
import { formulaBarOperation } from '../../spreadsheet/common/event';
import { locale } from '../../spreadsheet/common/constant';

/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
export class WorkbookFormula {
    private parent: Workbook;
    private calcID: number;
    private uniqueOBracket: string = String.fromCharCode(129);
    private uniqueCBracket: string = String.fromCharCode(130);
    private uniqueCSeparator: string = String.fromCharCode(131);
    private uniqueCOperator: string = String.fromCharCode(132);
    private uniquePOperator: string = String.fromCharCode(133);
    private uniqueSOperator: string = String.fromCharCode(134);
    private uniqueMOperator: string = String.fromCharCode(135);
    private uniqueDOperator: string = String.fromCharCode(136);
    private uniqueModOperator: string = String.fromCharCode(137);
    private uniqueConcateOperator: string = String.fromCharCode(138);
    private uniqueEqualOperator: string = String.fromCharCode(139);
    private uniqueExpOperator: string = String.fromCharCode(140);
    private uniqueGTOperator: string = String.fromCharCode(141);
    private uniqueLTOperator: string = String.fromCharCode(142);
    private calculateInstance: Calculate;
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
        this.parent.customFormulaCollection.forEach((value: IFormulaColl, key: string) => {
            this.addCustomFunction(value.handler, key, value.description);
        });
    }

    /**
     * To destroy the formula module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.parent as any).refreshing) {
            this.clearAllUniqueFormulaValue();
            const formulaCollect: Map<string, IFormulaColl> = this.calculateInstance.getLibraryFormulas();
            formulaCollect.forEach((value: IFormulaColl, key: string) => {
                if (value.isCustom) {
                    this.parent.customFormulaCollection.set(key, { handler: value.handler, description: value.description });
                }
            });
        }
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        if (this.sheetInfo) { this.sheetInfo = []; }
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
        this.parent.on(getUniqueRange, this.getUniqueRange, this);
        this.parent.on(removeUniquecol, this.removeUniquecol, this);
        this.parent.on(clearFormulaDependentCells, this.clearFormulaDependentCells, this);
        this.parent.on(formulaInValidation, this.formulaInValidation, this);
        this.parent.on(refreshInsertDelete, this.refreshInsertDelete, this);
        this.parent.on(getUpdatedFormulaOnInsertDelete, this.getUpdatedFormulaOnInsertDelete, this);
        this.parent.on(checkFormulaRef, this.autoCorrectCellRef, this);
        this.parent.on(parseFormulaArgument, this.parseFormulaArgument, this);
        this.parent.on(getCellRefValue, this.getCellRefValue, this);
        this.parent.on(commputeFormulaValue, this.commputeFormulaValue, this);
        this.parent.on(sheetRenameUpdate, this.renameUpdation, this);
        this.parent.on(importModelUpdate, this.initFormulaOnImport, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
            this.parent.off(getUniqueRange, this.getUniqueRange);
            this.parent.off(removeUniquecol, this.removeUniquecol);
            this.parent.off(clearFormulaDependentCells, this.clearFormulaDependentCells);
            this.parent.off(formulaInValidation, this.formulaInValidation);
            this.parent.off(refreshInsertDelete, this.refreshInsertDelete);
            this.parent.off(getUpdatedFormulaOnInsertDelete, this.getUpdatedFormulaOnInsertDelete);
            this.parent.off(checkFormulaRef, this.autoCorrectCellRef);
            this.parent.off(parseFormulaArgument, this.parseFormulaArgument);
            this.parent.off(getCellRefValue, this.getCellRefValue);
            this.parent.off(commputeFormulaValue, this.commputeFormulaValue);
            this.parent.off(sheetRenameUpdate, this.renameUpdation);
            this.parent.off(importModelUpdate, this.initFormulaOnImport);
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
        this.calculateInstance.setParseArgumentSeparator(this.parent.listSeparator);
        const decimalSeparator: string = (getNumericObject(this.parent.locale) as LocaleNumericSettings).decimal;
        if (decimalSeparator !== '.' && this.parent.listSeparator !== decimalSeparator) {
            this.calculateInstance.setParseDecimalSeparator(decimalSeparator);
        }
    }

    private clearFormulaDependentCells(args: { cellRef?: string, isOpen?: boolean, clearFormulaInfo?: boolean }): void {
        if (args.isOpen as boolean) {
            this.calculateInstance.getDependentCells().clear();
            this.calculateInstance.getFormulaInfoTable().clear();
            this.calculateInstance.getDependentFormulaCells().clear();
            this.calculateInstance.uniqueRange = [];
            this.calculateInstance.dependencyCollection = [];
            return;
        }
        let cellRef: string = args.cellRef.split(':')[0];
        const sheetId: string = this.parent.getActiveSheet().id.toString();
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetId);
        if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
            cellRef = family.parentObjectToToken.get(sheetId) + cellRef;
        }
        if (args.clearFormulaInfo && this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
            this.calculateInstance.getFormulaInfoTable().delete(cellRef);
        }
        this.calculateInstance.clearFormulaDependentCells(cellRef);
    }

    private formulaInValidation(args: InvalidFormula): void {
        const col: IFormulaColl = this.calculateInstance.getLibraryFormulas().get(args.value);
        args.skip = isNullOrUndefined(col);
    }
    private performFormulaOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        let formulas: Map<string, IFormulaColl>;
        let formulaInfo: IFormulaColl[];
        if (action !== 'refreshCalculate') {
            formulas = this.calculateInstance.getLibraryFormulas();
            formulaInfo = (Array.from(formulas.values()));
        }
        let collection: string[];
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(args.sheetId);
        let l10n: L10n;
        switch (action) {
        case 'getLibraryFormulas':
            args.formulaCollection = Array.from(formulas.keys());
            break;
        case 'getFormulaCategory':
            collection = ['All'];
            for (let i: number = 1; i < Array.from(formulas.values()).length; i++) {
                if (collection.indexOf(formulaInfo[i as number].category) < 0) {
                    collection.push(formulaInfo[i as number].category);
                }
            }
            args.categoryCollection = collection; break;
        case 'dropDownSelectFormulas':
            l10n = this.parent.serviceLocator.getService(locale);
            for (let i: number = 0; i < Array.from(formulas.values()).length; i++) {
                const category: string = formulaInfo[i as number].category &&
                l10n.getConstant(formulaInfo[i as number].category.split(' ').join('').replace('&', ''));
                if (args.selectCategory === category) {
                    args.formulaCollection[i as number] = Array.from(formulas.keys())[i as number];
                }
            }
            break;
        case 'getFormulaDescription':
            for (let i: number = 0; i < Array.from(formulas.values()).length; i++) {
                if (args.selectedList === Array.from(formulas.keys())[i as number]) {
                    args.description = formulaInfo[i as number].description;
                    args.isCustom = formulaInfo[i as number].isCustom;
                }
            }
            break;
        case 'registerSheet':
            this.registerSheet(<number>args.sheetIndex, <number>args.sheetCount);
            break;
        case 'unRegisterSheet':
            this.unRegisterSheet(<number>args.sheetIndex, <number>args.sheetCount, <boolean>args.propertyChange,
                <boolean>args.isNewWorkBook);
            break;
        case 'initSheetInfo':
            this.updateSheetInfo(); break;
        case 'refreshCalculate':
            this.refreshCalculate(args);
            break;
        case 'refreshRandomFormula':
            this.refreshRandomFormula();
            this.calculateInstance.cell = '';
            break;
        case 'setArgumentSeparator':
            this.calculateInstance.setParseArgumentSeparator(this.parent.listSeparator);
            break;
        case 'addDefinedName':
            args.isAdded = this.addDefinedName(<DefineNameModel>args.definedName, false, <number>args.index, <boolean>args.isEventTrigger);
            break;
        case 'removeDefinedName':
            args.isRemoved = this.removeDefinedName(<string>args.definedName, <string>args.scope, <boolean>args.isEventTrigger);
            break;
        case 'initiateDefinedNames':
            this.initiateDefinedNames();
            break;
        case 'addSheet':
            this.sheetInfo.push({ visibleName: <string>args.visibleName, sheet: <string>args.sheetName, index: <number>args.sheetId });
            break;
        case 'getSheetInfo':
            args.sheetInfo = this.sheetInfo;
            break;
        case 'deleteSheetTab':
            for (let i: number = 0; i < this.sheetInfo.length; i++) {
                if (this.sheetInfo[i as number].index === <number>args.sheetId) {
                    const visibleName: string = this.sheetInfo[i as number].visibleName;
                    const sheetName: string = this.sheetInfo[i as number].sheet; this.sheetInfo.splice(i, 1);
                    const id: string = args.sheetId.toString();
                    this.sheetDeletion(sheetName, id);
                    this.calculateInstance.unregisterGridAsSheet(id, id);
                    this.definedNamesDeletion(visibleName);
                    break;
                }
            }
            break;
        case 'getReferenceError':
            args.refError = this.referenceError(); break;
        case 'getAlpha':
            args.col = getAlphalabel(<number>args.col);
            break;
        case 'addCustomFunction':
            this.addCustomFunction(<string | Function>args.functionHandler, <string>args.functionName, <string>args.formulaDescription );
            break;
        case 'computeExpression':
            args.calcValue = this.calculateInstance.computeExpression(<string>args.formula, <boolean>args.isFromComputeExpression);
            break;
        case 'registerGridInCalc':
            this.calculateInstance.grid = <string>args.sheetID;
            break;
        case 'dependentCellsAvailable':
        case 'checkFormulaAdded':
            if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                args.address = family.parentObjectToToken.get(args.sheetId) + args.address;
            }
            if (action === 'checkFormulaAdded') {
                args.added = this.calculateInstance.getFormulaInfoTable().has(<string>args.address);
            } else {
                args.isAvailable = this.calculateInstance.getDependentCells().has(<string>args.address);
            }
            break;
        case 'calculateNow':
            this.calculateNow(<{ sheets: SheetModel[], promise: Promise<object> }>args);
            break;
        case 'ClearDependentCellCollection':
            this.calculateInstance.getDependentFormulaCells().clear();
            this.calculateInstance.getDependentCells().clear();
            this.calculateInstance.getFormulaInfoTable().clear();
            break;
        }
    }
    private initFormulaOnImport(): void {
        this.registerSheet();
        this.calculateInstance.setParseArgumentSeparator(this.parent.listSeparator);
        this.updateSheetInfo();
        this.initiateDefinedNames();
    }
    private definedNamesDeletion(sheetName: string): void {
        const definedNames: DefineNameModel[] = this.parent.definedNames;
        if (definedNames && definedNames.length > 0) {
            for (let i: number = definedNames.length - 1; i >= 0; i--) {
                if (definedNames[i as number].refersTo.substring(1, definedNames[i as number].refersTo.lastIndexOf('!')).split('\'').join('') === sheetName) {
                    this.removeDefinedName(definedNames[i as number].name, definedNames[i as number].scope);
                }
            }
        }
    }
    private referenceError(): string {
        return this.calculateInstance.getErrorStrings()[CommonErrors.Ref];
    }
    private getSheetInfo(): { visibleName: string, sheet: string }[] {
        return this.sheetInfo;
    }
    private addCustomFunction(functionHandler: string | Function, functionName: string, formulaDescription: string): void {
        this.calculateInstance.defineFunction(functionName, functionHandler, formulaDescription);
    }
    private updateSheetInfo(): void {
        this.sheetInfo = [];
        this.parent.sheets.forEach((sheet: SheetModel) => {
            this.sheetInfo.push({ visibleName: sheet.name, sheet: 'Sheet' + sheet.id, index: sheet.id });
        });
    }

    private getSheetRefUpdateOnDelete(): (delSheetName: string, formula: string) => { value: string, isNamedRange?: boolean } {
        const definedNames: Map<string, string> = this.calculateInstance.namedRanges;
        let keyArray: string[]; let valueArray: string[]; let isDefinedNamesAvail: boolean;
        if (definedNames && definedNames.size) {
            isDefinedNamesAvail = true;
            keyArray = Array.from(definedNames.keys());
            valueArray = Array.from(definedNames.values());
        }
        return (delSheetName: string, formula: string): { value: string, isNamedRange?: boolean, isUpdate?: boolean } => {
            let isNamedRange: boolean;
            if (isDefinedNamesAvail && !formula.includes(delSheetName)) {
                formula = formula.replace(/\w+/g, (key: string) => {
                    const index: number = keyArray.indexOf(key);
                    if (index !== -1) {
                        isNamedRange = true;
                        return valueArray[index as number];
                    }
                    return key;
                });
            }
            const sheetName: string = delSheetName.toUpperCase();
            formula = formula.toUpperCase();
            let idx: number = formula.indexOf(sheetName);
            let isUpdate: boolean;
            while (idx > -1) {
                isUpdate = true;
                formula = formula.split(
                    (formula[idx - 1] === '\'' && formula[idx + sheetName.length] === '\'' ? `'${sheetName}'` : sheetName) +
                    this.calculateInstance.sheetToken).join(this.referenceError());
                idx = formula.indexOf(sheetName);
            }
            return { value: formula, isNamedRange, isUpdate: isUpdate };
        };
    }

    private sheetDeletion(delSheetName: string, sheetId: string): void {
        const dependentCell: Map<string, string[]> = this.calculateInstance.getDependentCells();
        let fInfo: FormulaInfo; let token: string;
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetId);
        const updateSheetRef: (delSheetName: string, formula: string) => { value: string, isNamedRange?: boolean } =
            this.getSheetRefUpdateOnDelete();
        let updatedInfo: { value: string, isNamedRange?: boolean, sheetId?: number, isUpdate?: boolean };
        dependentCell.forEach((dependentCellRefs: string[], cellRef: string) => {
            dependentCellRefs.forEach((dependentCellRef: string): void => {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCellRef);
                if (!isNullOrUndefined(fInfo)) {
                    updatedInfo = updateSheetRef(delSheetName, fInfo.formulaText);
                    if (updatedInfo.value !== fInfo.formulaText && updatedInfo.isUpdate) {
                        token = dependentCellRef.slice(0, dependentCellRef.lastIndexOf(this.calculateInstance.sheetToken) + 1);
                        updatedInfo.sheetId = family.tokenToParentObject.has(token) ? Number(family.tokenToParentObject.get(token)) :
                            parseInt(dependentCellRef.split('!')[1], 10) + 1;
                        this.updateDataContainer(
                            [this.calculateInstance.rowIndex(dependentCellRef) - 1, this.calculateInstance.colIndex(dependentCellRef) - 1],
                            updatedInfo);
                        this.calculateInstance.refresh(fInfo.getParsedFormula());
                    }
                }
                token = cellRef.slice(0, cellRef.lastIndexOf(this.calculateInstance.sheetToken) + 1);
                if (sheetId === (family.tokenToParentObject.has(token) ? family.tokenToParentObject.get(token) :
                    cellRef.split('!')[1])) {
                    this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                    this.calculateInstance.clearFormulaDependentCells(cellRef);
                }
            });
        });
    }

    private renameUpdation(args: { [key: string]: string }): void {
        const name: string = args.value; const pName: string = args.pName;
        let sheet: SheetModel; let cell: CellModel; const uPName: string = args.pName.toUpperCase();
        const escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,.{}|\\":<>~_-]', 'g');
        const exp: string = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        const regExp: RegExpConstructor = RegExp;
        const regx: RegExp = new regExp(pName.replace(escapeRegx, '\\$&') + exp, 'gi');
        const renameValidationSheetRef: Function = (validation: ValidationModel): void => {
            if (checkIsFormula(validation.value1) && validation.value1.toUpperCase().includes(uPName) && validation.value1.match(regx)) {
                validation.value1 = validation.value1.replace(regx, name);
            }
            if (checkIsFormula(validation.value2) && validation.value2.toUpperCase().includes(uPName) && validation.value2.match(regx)) {
                validation.value2 = validation.value2.replace(regx, name);
            }
        };
        this.sheetInfo.forEach((info: { visibleName: string }, index: number): void => {
            sheet = getSheet(this.parent, index);
            if (sheet && sheet.rows && sheet.rows.length) {
                for (let i: number = 0, rowLen: number = sheet.rows.length; i < rowLen; i++) {
                    if (sheet.rows[i as number] && sheet.rows[i as number].cells) {
                        for (let j: number = 0, cellsLen: number = sheet.rows[i as number].cells.length; j < cellsLen; j++) {
                            cell = getCell(i, j, sheet, false, true);
                            if (cell.formula && checkIsFormula(cell.formula) && cell.formula.toUpperCase().includes(uPName) &&
                                cell.formula.match(regx)) {
                                cell.formula = cell.formula.replace(regx, name);
                            }
                            if (cell.validation) {
                                renameValidationSheetRef(cell.validation);
                            }
                            if (cell.chart && cell.chart.length) {
                                cell.chart.forEach((chart: { range: string }) => {
                                    if (chart.range.includes('!')) {
                                        const tokenIdx: number = chart.range.lastIndexOf('!');
                                        let chartSheetRef: string = chart.range.substring(0, tokenIdx).toUpperCase();
                                        if (chartSheetRef.startsWith('\'') && chartSheetRef.endsWith('\'')) {
                                            chartSheetRef = chartSheetRef.slice(1, -1);
                                        }
                                        if (chartSheetRef === uPName) {
                                            chart.range = name + chart.range.substring(tokenIdx);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
            if (sheet && sheet.columns && sheet.columns.length) {
                let column: ColumnModel;
                for (let i: number = 0, colsLen: number = sheet.columns.length; i < colsLen; i++) {
                    column = sheet.columns[i as number];
                    if (column && column.validation) {
                        renameValidationSheetRef(column.validation);
                    }
                }
            }
            const definedNames: DefineNameModel[] = this.parent.definedNames;
            for (let i: number = 0; i < definedNames.length; i++) {
                if (checkIsFormula(definedNames[i as number].refersTo) && definedNames[i as number].refersTo.includes(pName) &&
                    definedNames[i as number].refersTo.match(regx)) {
                    definedNames[i as number].refersTo = definedNames[i as number].refersTo.replace(regx, name);
                    if (definedNames[i as number].scope.includes(pName)) {
                        definedNames[i as number].scope = name;
                    }
                }
            }
            this.calculateInstance.updateNamedRange(pName, name);
            if (info.visibleName === pName) { info.visibleName = name; }
        });
    }

    private updateDataContainer(
        indexes: number[], data: { value: string, sheetId?: number, isNamedRange?: boolean, visible?: boolean }): void {
        let sheet: SheetModel; let rowData: RowModel; let colObj: CellModel;
        for (let i: number = 0, len: number = this.parent.sheets.length; i < len; i++) {
            sheet = getSheet(this.parent, i);
            if (sheet.id === data.sheetId) {
                if (indexes[0] in sheet.rows) {
                    rowData = sheet.rows[indexes[0]];
                    if (indexes[1] in rowData.cells) {
                        colObj = rowData.cells[indexes[1]];
                        colObj.formula = data.isNamedRange ? colObj.formula : data.value;
                        if (data.visible) {
                            if (i === this.parent.activeSheetIndex && sheet.activeCell === getCellAddress(indexes[0], indexes[1])) {
                                this.parent.notify(selectionComplete, {});
                            }
                        } else if (this.parent.calculationMode === 'Automatic') {
                            colObj.value = this.referenceError();
                        }
                    } else {
                        rowData.cells[indexes[1]] = colObj = {};
                    }
                } else {
                    rowData = sheet.rows[indexes[0]] = {};
                    rowData[indexes[1]] = colObj = {};
                }
                break;
            }
        }
    }

    private parseSheetRef(value: string, addSheetQuotes?: boolean): string {
        let regx: RegExp;
        // eslint-disable-next-line no-useless-escape
        const escapeRegx: RegExp = new RegExp('[!@#$%^&()+=\';,.{}|\":<>~_-]', 'g');
        let i: number = 0;
        const sheetInfo: { visibleName: string, sheet: string }[] = this.getSheetInfo();
        const sheetCount: number = sheetInfo.length;
        const temp: number[] = [];
        temp.length = 0;
        let regxTemp: RegExp; let searchIdx: number; let idx: number; let valSearchIdx: number; let regxVisible: RegExp;
        const exp: string = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        const regExp: RegExpConstructor = RegExp;
        for (i = 0; i < sheetCount; i++) {
            if (sheetInfo[i as number].sheet !== sheetInfo[i as number].visibleName) {
                regx = new regExp(sheetInfo[i as number].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                idx = i;
                if (value.match(regx)) {
                    for (let j: number = i + 1; j < sheetCount; j++) {
                        if (sheetInfo[j as number].visibleName.includes(sheetInfo[i as number].visibleName)) {
                            regxTemp = new regExp(sheetInfo[j as number].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                            searchIdx = value.search(regxTemp); valSearchIdx = value.search(regx);
                            if (searchIdx > -1 && (searchIdx < valSearchIdx || (searchIdx === valSearchIdx &&
                                sheetInfo[j as number].visibleName.length > sheetInfo[i as number].visibleName.length))) {
                                regxVisible = new RegExp('Sheet', 'gi');
                                if (sheetInfo[j as number].visibleName.search(regxVisible) !== 0) {
                                    regx = regxTemp; idx = j;
                                }
                            }
                        }
                    }
                    value = value.replace(regx, idx + '/');
                    temp.push(idx);
                }
            }
        }
        i = 0;
        let sheetRef: string;
        while (i < temp.length) {
            regx = new regExp(temp[i as number] + '/' + exp, 'gi');
            sheetRef = addSheetQuotes ? '`' + sheetInfo[temp[i as number]].sheet + '`' : sheetInfo[temp[i as number]].sheet;
            value = value.replace(regx, sheetRef);
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
        sheetIndex: number = 0, sheetCount: number = this.parent.sheets.length, propertyChange?: boolean, isNewWorkBook?: boolean): void {
        let id: string;
        this.calculateInstance.tokenCount = 0;
        if (propertyChange) {
            this.calculateInstance.unregisterGridAsSheet(id, id, propertyChange);
        } else {
            if (isNewWorkBook) {
                for (let i: number = this.sheetInfo.length - 1; i >= 0; i--) {
                    const visibleName: string = this.sheetInfo[i as number].visibleName;
                    id = this.sheetInfo[i as number].index.toString();
                    this.calculateInstance.unregisterGridAsSheet(id, id);
                    this.definedNamesDeletion(visibleName);
                }
                this.clearFormulaDependentCells({ isOpen: true });
            } else {
                while (sheetIndex < sheetCount) {
                    id = getSheet(this.parent, sheetIndex).id + '';
                    this.calculateInstance.unregisterGridAsSheet(id, id);
                    sheetIndex++;
                }
            }
        }
    }

    private getUniqueRange(args: { [key: string]: string[] }): void {
        args.range = this.calculateInstance.uniqueRange;
    }

    private removeUniquecol(args?: { clearAll: boolean }): void {
        if (args && args.clearAll) {
            this.clearAllUniqueFormulaValue();
            return;
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        for (let i: number = 0; i < this.calculateInstance.uniqueRange.length; i++) {
            const uniqRngAddress: string[] = this.calculateInstance.uniqueRange[i as number].split(':')[0].split('!');
            if (uniqRngAddress[0] === sheet.name && uniqRngAddress[1] === sheet.activeCell ) {
                const range: number[] = getRangeIndexes(this.calculateInstance.uniqueRange[i as number]);
                this.calculateInstance.uniqueRange.splice(i, 1);
                for (let j: number = range[0]; j <= range[2]; j++) {
                    for (let k: number = range[1]; k <= range[3]; k++) {
                        const cell: CellModel = getCell(j, k, this.parent.getActiveSheet());
                        cell.formula = '';
                        this.parent.updateCellDetails({ value: '', formula: ''}, getRangeAddress([j, k]), undefined, undefined, true);
                    }
                }
            }
        }
    }

    /**
     * Perform the formula calculation.
     *
     * @param {FormulaCalculateArgs} args - Specifies the formula calculation options.
     * @param {number} args.rowIndex - The index of the row.
     * @param {number} args.colIndex - The index of the column.
     * @param {string} args.value - The value of the cell.
     * @param {boolean} args.isFormula - A flag indicating whether the value is a formula.
     * @param {number} args.sheetIdx - The index of the sheet.
     * @param {boolean} args.isRefreshing - A flag indicating whether the calculation is being refreshed.
     * @param {boolean} [args.isDependentRefresh] - An optional flag indicating whether the refresh is dependent.
     * @param {boolean} [args.isRandomFormula] - An optional flag indicating whether the formula is random.
     * @param {boolean} [args.isDelete] - An optional flag indicating whether is from delete cells.
     * @param {number[]} [args.deletedRange] - An optional range array indicating the deleted cells.
     * @returns {void}
     * @private
     */
    public refreshCalculate(args: FormulaCalculateArgs): void {
        args.sheet = isNullOrUndefined(args.sheetIndex) ? this.parent.getActiveSheet() : getSheet(this.parent, args.sheetIndex);
        const sheetId: string = args.sheet.id + '';
        const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetId);
        let cellRef: string = getColumnHeaderText(args.colIndex + 1) + (args.rowIndex + 1);
        if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
            cellRef = family.parentObjectToToken.get(sheetId) + cellRef;
        }
        if (args.isFormula) {
            this.calculateFormula(args, cellRef);
        } else {
            if (this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
                this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                this.calculateInstance.clearFormulaDependentCells(cellRef);
            }
            this.calculateInstance.refresh(cellRef, null, null, null, args.isDelete, args.deletedRange);
            if (this.parent.calculationMode === 'Automatic') {
                this.calculateInstance.refreshRandValues(cellRef);
            }
        }
        this.calculateInstance.cell = '';
        args.isFormulaDependent = this.calculateInstance.getDependentCells().has(cellRef);
        if (args.value) {
            args.value = args.value.toString().split('^+').join('^').split('&+').join('&');
        }
    }

    private calculateFormula(args: FormulaCalculateArgs, cellRef: string): void {
        const sheet: SheetModel = args.sheet;
        this.autoCorrectFormula(args, sheet);
        let value: string = args.value;
        if (args.isClipboard && value.toUpperCase().includes('UNIQUE')) {
            setCell(args.rowIndex, args.colIndex, sheet, { value: '' }, true);
        }
        let formula: string = value;
        value = this.parseSheetRef(value);
        const cellArgs: ValueChangedArgs = new ValueChangedArgs(args.rowIndex + 1, args.colIndex + 1, value);
        const usedRange: number[] = [sheet.usedRange.rowIndex, sheet.usedRange.colIndex];
        this.calculateInstance.valueChanged(
            sheet.id.toString(), cellArgs, true, usedRange, args.isRefreshing, sheet.name, args.isRandomFormula,
            null, args.isDelete, args.deletedRange, args.isDependentRefresh, args.action);
        if (this.calculateInstance.isRandomVal === true && !args.isRandomFormula && this.parent.calculationMode === 'Automatic') {
            this.refreshRandomFormula();
        }
        const updatedCell: CellModel = getCell(args.rowIndex, args.colIndex, sheet);
        if (updatedCell && formula && !args.isDependentRefresh) {
            formula = formula.toUpperCase();
            let formulaStr: string;
            if (formula.indexOf('=SUM(') === 0) {
                formulaStr = '=SUM(';
            } else if (formula.indexOf('=AVERAGE(') === 0) {
                formulaStr = '=AVERAGE(';
            } else if (formula.indexOf('=ROUNDDOWN(') === 0) {
                formulaStr = '=ROUNDDOWN(';
            } else if (formula.indexOf('=ROUNDUP(') === 0) {
                formulaStr = '=ROUNDUP(';
            } else if (formula.indexOf('=MOD(') === 0) {
                formulaStr = '=MOD(';
            }
            if (formulaStr) {
                formula = formula.replace(formulaStr, '');
                if (formula.includes(')')) {
                    formula = formula.slice(0, formula.lastIndexOf(')'));
                    let fStr: string; let idx: number;
                    while (formula.includes('(') && formula.includes(')')) {
                        idx = formula.indexOf('(');
                        fStr = formula.slice(idx + 1);
                        formula = formula.slice(0, idx) + (fStr.includes(')') ? fStr.slice(fStr.indexOf(')') + 1) : fStr);
                    }
                }
                const cellRefArr: string[] = formula.split(this.calculateInstance.getParseArgumentSeparator());
                let cellRef: string; let fCell: CellModel; let model: SheetModel; let sheetIdx: number;
                let sheetName: string; let index: number[];
                for (let idx: number = 0; idx < cellRefArr.length; idx++) {
                    cellRef = cellRefArr[idx as number].split(':')[0];
                    if (cellRef.includes('!')) {
                        sheetName = cellRef.substring(0, cellRef.lastIndexOf('!')).split('\'').join('');
                        cellRef = cellRef.substring(cellRef.lastIndexOf('!') + 1);
                    } else {
                        sheetName = '';
                    }
                    if (isCellReference(cellRef)) {
                        if (sheetName) {
                            sheetIdx = getSheetIndex(this.parent, sheetName);
                            model = sheetIdx !== undefined ? getSheet(this.parent, sheetIdx) : sheet;
                        } else {
                            model = sheet;
                        }
                        index = getRangeIndexes(cellRef);
                        fCell = getCell(index[0], index[1], model);
                        const format: string = getTypeFromFormat(updatedCell.format);
                        const excludedFormats: string[] = ['Number', 'Currency', 'LongDate', 'Time'];
                        if (fCell && fCell.format && (!updatedCell.format || (!args.fillType &&
                            (excludedFormats.every((fmt: string) => format !== fmt) &&
                                getTypeFromFormat(fCell.format) !== 'Number')))) {
                            updatedCell.format = fCell.format;
                            break;
                        }
                    }
                }
            } else {
                const depCells: Map<string, string> = this.calculateInstance.getDependentFormulaCells().get(cellRef);
                if (depCells && depCells.size && this.calculateInstance.getFormulaInfoTable().has(cellRef) &&
                    this.calculateInstance.getFormulaInfoTable().get(cellRef).getParsedFormula().lastIndexOf('q') === -1 &&
                    !updatedCell.format) {
                    let format: string; let fCell: CellModel; let sheetRef: string; let model: SheetModel; let sheetIdx: number;
                    let idx: number[]; const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(null, this.calcID);
                    depCells.forEach((cellRef: string) => {
                        if (!format) {
                            sheetRef = cellRef.slice(0, cellRef.lastIndexOf('!') + 1);
                            cellRef = cellRef.replace(sheetRef, '');
                            if (isCellReference(cellRef)) {
                                idx = getRangeIndexes(cellRef);
                                if (family.tokenToParentObject.has(sheetRef)) {
                                    sheetIdx = getSheetIndexFromId(this.parent, Number(family.tokenToParentObject.get(sheetRef)));
                                    model = sheetIdx !== undefined ? getSheet(this.parent, sheetIdx) : sheet;
                                } else {
                                    model = sheet;
                                }
                                fCell = getCell(idx[0], idx[1], model);
                                if (fCell && fCell.format) {
                                    format = fCell.format;
                                }
                            }
                        }
                    });
                    if (format) {
                        updatedCell.format = format;
                    }
                }
            }
        }
    }

    private refreshRandomFormula(): void {
        let rowId: number;
        let colId: number;
        let refValue: string = '';
        const referenceCollection: string[] = this.calculateInstance.randCollection;
        if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
            referenceCollection.length) {
            for (let i: number = 0; i < this.calculateInstance.randomValues.size; i++) {
                rowId = this.calculateInstance.rowIndex(referenceCollection[i as number]);
                colId = this.calculateInstance.colIndex(referenceCollection[i as number]);
                refValue = this.calculateInstance.randomValues.get(referenceCollection[i as number]);
                const sheetId: string = (parseFloat(this.calculateInstance.getSheetToken(
                    referenceCollection[i as number]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                const sheet: SheetModel = getSheet(this.parent, getSheetIndexFromId(this.parent, Number(sheetId)));
                if (sheet && getCell(rowId - 1, colId - 1, sheet).formula) {
                    const tempArgs: ValueChangedArgs = new ValueChangedArgs(rowId, colId, refValue);
                    this.calculateInstance.valueChanged(sheetId, tempArgs, true, undefined, undefined, undefined, false, true);
                }
            }
        }
    }

    private autoCorrectFormula(args: { value?: string, rowIndex?: number, colIndex?: number }, sheet: SheetModel): void {
        if (!isNullOrUndefined(args.value)) {
            let formula: string = args.value;
            formula = this.autoCorrectCellRef({ formula: args.value });
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
                    lessOp = lessOp + lessEq[i as number];
                }
                formula = formula.replace(lessOp, '<');
            }
            if (greaterEq) {
                let greaterOp: string = '';
                for (let j: number = 0; j < greaterEq.length; j++) {
                    greaterOp = greaterOp + greaterEq[j as number];
                }
                formula = formula.replace(greaterOp, '>');
            }
            if (equal) {
                let equalOp: string = '';
                for (let c: number = 0; c < equal.length; c++) {
                    equalOp = equalOp + equal[c as number];
                }
                formula = formula.split(equalOp).join('=');
            }
            formula = isEqual ? '=' + formula : formula;
            if (lessEq || greaterEq || equal) {
                getCell(args.rowIndex, args.colIndex, sheet).formula = formula;
            }
            args.value = formula;
        }
    }

    private correctCellReference(cellRef: string): { isInvalid: boolean, ref: string } {
        const cellRefArr: string[] = cellRef.split(':');
        let refArr: string[]; let sheetRefArr: string[]; let oprMatchArr: RegExpMatchArray; let isInvalid: boolean; let updatedRef: string;
        cellRefArr.forEach((cellAddr: string, idx: number): void => {
            sheetRefArr = cellAddr.split('!');
            cellRef = sheetRefArr[1] || cellAddr;
            updatedRef = null;
            if (cellRef.includes('&')) {
                refArr = cellRef.split('&');
                if (this.calculateInstance.isCellReference(refArr[1].split('$').join(''))) {
                    refArr[1] = this.getUpdatedCellRef(refArr[1]);
                    updatedRef = refArr.join('&');
                }
            } else if (this.calculateInstance.isCellReference(cellRef.split('$').join(''))) {
                updatedRef = this.getUpdatedCellRef(cellRef);
                if (sheetRefArr.length > 1) {
                    updatedRef = sheetRefArr[0] + '!' + updatedRef;
                }
            } else {
                oprMatchArr = cellAddr.match(/[/+\-*^><>=<=<>]+/g);
                if (oprMatchArr) {
                    refArr = cellAddr.split(oprMatchArr[0]);
                    for (let refIdx: number = 0; refIdx < refArr.length; refIdx++) {
                        sheetRefArr = refArr[refIdx as number].split('!');
                        cellRef = sheetRefArr[1] || sheetRefArr[0];
                        if (this.calculateInstance.isCellReference(cellRef.split('$').join(''))) {
                            refArr[refIdx as number] = this.getUpdatedCellRef(cellRef);
                            if (sheetRefArr.length > 1) {
                                refArr[refIdx as number] = sheetRefArr[0] + '!' + refArr[refIdx as number];
                            }
                        }
                    }
                    updatedRef = refArr.join(oprMatchArr[0]);
                }
            }
            if (updatedRef && updatedRef !== cellAddr) {
                isInvalid = true;
                cellRefArr[idx as number] = updatedRef;
            }
        });
        return { isInvalid: isInvalid, ref: cellRefArr.join(':') };
    }

    private autoCorrectCellRef(args: { formula: string, isInvalid?: boolean }): string {
        const rightParens: number = args.formula.lastIndexOf(')');
        let refCorrectObj: { isInvalid: boolean, ref: string };
        if (rightParens > -1 && args.formula.split(')').length === 2) {
            let leftParens: number = rightParens - 1;
            while (leftParens > -1 && args.formula[leftParens as number] !== '(') {
                if (args.formula[leftParens as number] === ')') {
                    return args.formula;
                }
                leftParens--;
            }
            if (leftParens > -1) {
                const formulaArgs: string = args.formula.substring(leftParens + 1, rightParens);
                const listSeparator: string = this.calculateInstance.getParseArgumentSeparator();
                const formulaArgsArr: string[] = formulaArgs.split(listSeparator);
                let isInValidRef: boolean;
                for (let argsIdx: number = 0; argsIdx < formulaArgsArr.length; argsIdx++) {
                    refCorrectObj = this.correctCellReference(formulaArgsArr[argsIdx as number]);
                    if (refCorrectObj.isInvalid) {
                        isInValidRef = true;
                        formulaArgsArr[argsIdx as number] = refCorrectObj.ref;
                    }
                }
                if (isInValidRef) {
                    args.formula = args.formula.split(formulaArgs).join(formulaArgsArr.join(listSeparator));
                    args.isInvalid = true;
                }
            }
        } else if (args.formula.startsWith('=') && !args.formula.includes(')')) {
            refCorrectObj = this.correctCellReference(args.formula.substring(1, args.formula.length));
            if (refCorrectObj.isInvalid) {
                args.formula =  '=' + refCorrectObj.ref;
                args.isInvalid = true;
            }
        }
        return args.formula;
    }

    private getUpdatedCellRef(cellRef: string): string {
        const orgCellRef: string = cellRef;
        cellRef = cellRef.trim();
        const isAbsolute: boolean = cellRef.indexOf('$') === 0;
        let alphabetStartIdx: number = cellRef.search(/[a-zA-Z]/);
        const digitStartIdx: number = cellRef.search(/\d/);
        alphabetStartIdx = isAbsolute ? alphabetStartIdx - 1 : alphabetStartIdx;
        if ((isAbsolute ? digitStartIdx > 1 : digitStartIdx > 0) && isNumber(cellRef.substring(digitStartIdx, cellRef.length))) {
            return orgCellRef;
        } else {
            return cellRef.substring(alphabetStartIdx, cellRef.length) + cellRef.substring(0, alphabetStartIdx);
        }
    }

    private initiateDefinedNames(): void {
        const definedNames: DefineNameModel[] = this.parent.definedNames;
        let i: number = 0;

        while (i < definedNames.length) {
            const definedname: DefineNameModel = definedNames[i as number];
            const refersTo: string = this.parseSheetRef(definedname.refersTo);
            let range: string = getRangeFromAddress(refersTo);
            let cellRef: boolean = false;
            const isLink: boolean = refersTo.indexOf('http:') > -1 ? true : (refersTo.indexOf('https:') > -1 ? true : false);
            range = range.split('$').join('');
            range = range.split('=').join('');
            if (range.indexOf(':') > -1) {
                const rangeSplit: string[] = range.split(':');
                if ((isCellReference(rangeSplit[0]) && isCellReference(rangeSplit[1])) ||
                    ((rangeSplit[0].match(/[0-9]/) && rangeSplit[1].match(/[0-9]/)) ||
                        (rangeSplit[0].toUpperCase().match(/[A-Z]/) && rangeSplit[1].toUpperCase().match(/[A-Z]/)))) {
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
                this.addDefinedName(definedname, true, undefined, true);
            } else {
                this.removeDefinedName(definedname.name, definedname.scope, true);
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
     * @param {number} index - Define named index.
     * @param {boolean} isEventTrigger - Specify the boolean value.
     * @returns {boolean} - Used to add defined name to workbook.
     */
    private addDefinedName(definedName: DefineNameModel, isValidate: boolean, index?: number, isEventTrigger?: boolean): boolean {
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
            definedName.scope = 'Workbook';
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
                this.parent.notify(formulaBarOperation, { action: 'setNameBoxValue', definedName: definedName });
            }
        }
        const eventArgs: DefinedNameEventArgs = { name: definedName.name, scope: definedName.scope, comment: definedName.comment,
            refersTo: definedName.refersTo, cancel: false };
        if (!isEventTrigger) {
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'addDefinedName' });
        }
        return isAdded;
    }

    /**
     * @hidden
     * Used to remove defined name from workbook.
     *
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     * @param {boolean} isEventTrigger - Specify the boolean value.
     * @returns {boolean} - To Return the bool value.
     */
    private removeDefinedName(name: string, scope: string, isEventTrigger?: boolean): boolean {
        let isRemoved: boolean = false;
        const scopeVal: string = !scope ? 'Workbook' : scope;
        const index: number = this.getIndexFromNameColl(name, scopeVal);
        if (index > -1) {
            let calcName: string = name;
            if (scope) {
                const sheetIdx: number = getSheetIndex(this.parent, scope);
                if (sheetIdx > -1) {
                    calcName = getSheetName(this.parent, sheetIdx) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            const removedName: DefineNameModel[] = this.parent.definedNames.splice(index, 1);
            this.parent.notify(formulaBarOperation, { action: 'setNameBoxValue', definedName: removedName[0], isRemove: true });
            if (!isEventTrigger) {
                const eventArgs: DefinedNameEventArgs = { name: name, scope: scopeVal, cancel: false };
                this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'removeDefinedName' });
            }
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

    private calculateNow(args: { sheets: SheetModel[], promise: Promise<object>, scope?: string }): void {
        const deferred: Deferred = new Deferred();
        args.promise = deferred.promise;
        let dependentCells: { [key: string]: boolean };
        const initCalculate: () => void = (): void => {
            let family: CalcSheetFamilyItem; let token: string; let sheetId: string; let cellRef: string;
            const options: FormulaCalculateArgs = { isRefreshing: true, action: 'calculate' };
            const formulaInfo: Map<string, FormulaInfo> = this.calculateInstance.getFormulaInfoTable();
            args.sheets.forEach((sheet: SheetModel): void => {
                sheetId = sheet.id.toString();
                family = this.calculateInstance.getSheetFamilyItem(sheetId);
                token = family.isSheetMember ? family.parentObjectToToken.get(sheetId) : '';
                this.parent.setSheetPropertyOnMute(sheet, 'isSheetCalculated', true);
                options.sheet = sheet;
                sheet.rows.forEach((row: RowModel, rowIdx: number): void => {
                    options.rowIndex = rowIdx;
                    if (row && row.cells) {
                        row.cells.forEach((cell: CellModel, colIdx: number): void => {
                            if (cell && checkIsFormula(cell.formula)) {
                                cellRef = token + getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
                                if (cell.value === undefined || cell.value === null || !formulaInfo.has(cellRef) || (dependentCells &&
                                    dependentCells[cellRef as string])) {
                                    options.colIndex = colIdx;
                                    options.value = cell.formula;
                                    this.calculateFormula(options, cellRef);
                                }
                            }
                        });
                    }
                });
            });
            deferred.resolve();
            this.calculateInstance.cell = '';
        };
        let totalLoadCount: number = args.sheets.length;
        const loadCompleteHandler: () => void = (): void => {
            totalLoadCount--;
            if (!totalLoadCount) {
                initCalculate();
                if (this.parent.calculationMode === 'Automatic' && args.scope === 'CalculateWorkbook') {
                    this.parent.setProperties({ calculationMode: 'Manual' }, true);
                }
                const sheet: SheetModel = this.parent.getActiveSheet();
                if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
                    this.parent.notify(applyCF, { indexes: [], isAction: true, refreshAll: true, isEdit: true });
                }
            }
        };
        const getDependentCellsCheckFn: (sheet: SheetModel) => Function = (sheet: SheetModel): (rowIdx: number, colIdx: number) => void => {
            const sheetId: string = sheet.id.toString();
            const family: CalcSheetFamilyItem = this.calculateInstance.getSheetFamilyItem(sheetId);
            const token: string = family.isSheetMember ? family.parentObjectToToken.get(sheetId) : '';
            dependentCells = {};
            const dependentCellsInfo: Map<string, string[]> = this.calculateInstance.getDependentCells();
            return (rowIdx: number, colIdx: number): void => {
                const cellAddr: string = token + getCellAddress(rowIdx, colIdx);
                if (dependentCellsInfo.has(cellAddr)) {
                    dependentCellsInfo.get(cellAddr).forEach((cellRef: string) => {
                        if (!dependentCells[cellRef as string]) {
                            dependentCells[cellRef as string] = true;
                        }
                    });
                }
            };
        };
        args.sheets.forEach((sheet: SheetModel): void => {
            if (sheet.ranges.some((range: ExtendedRange) => range.dataSource && (!range.info || !range.info.loadedRange ||
                !range.info.loadedRange.length))) {
                this.parent.notify(
                    updateSheetFromDataSource, { sheet: sheet, autoDetectFormat: true, loadFromStartCell: true,
                        updateDependentCellsCallback: getDependentCellsCheckFn(sheet), loadComplete: loadCompleteHandler });
            } else {
                loadCompleteHandler();
            }
        });
    }

    private toFixed(value: string): string {
        const num: number = Number(value);
        if (Math.round(num) !== num) { value = num.toFixed(2); }
        return value;
    }

    private commputeFormulaValue(args: { value: string }): void {
        const parsedSheetValue: string = this.parseSheetRef(args.value);
        args.value = this.calculateInstance.computeExpression(parsedSheetValue).toString();
    }

    private getCellRefValue(args: { value: string }): void {
        let sheetId: number;
        const sheetInfo: { visibleName: string, sheet: string }[] = this.getSheetInfo();
        const sheetCount: number = sheetInfo.length;
        const token: string = this.calculateInstance.sheetToken;
        const value: string = args.value;
        const tokenIndex: number = value.lastIndexOf(token);
        if (tokenIndex !== -1) {
            let sheetName: string = value.substring(0, tokenIndex);
            if (sheetName.length > 0 && sheetName[0] === this.calculateInstance.getFormulaCharacter()) {
                sheetName = sheetName.substring(1, args.value.length); // To get the sheetname without '=' symbol
            }
            for (let i: number = 0; i < sheetCount; i++) {
                if (sheetName.toUpperCase() === sheetInfo[i as number].visibleName.toUpperCase()) {
                    sheetId = i; break;
                }
            }
            args.value = this.calculateInstance.getValueFromArg(token + sheetId + token + value.substring(tokenIndex + 1).toUpperCase());
        } else if (value.length > 0 && value[0] === this.calculateInstance.getFormulaCharacter()) {
            args.value = this.calculateInstance.getValueFromArg(value.substring(1, args.value.length).toUpperCase());
        }
    }

    private aggregateComputation(args: AggregateArgs): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let totalCount: number = 0;
        let totalSum: number = 0;
        let numericCellsCount: number = 0;
        let overallMin: number = Number.POSITIVE_INFINITY;
        let overallMax: number = Number.NEGATIVE_INFINITY;
        let row: number; let col: number; let cell: CellModel;
        const autoDetectFormatFn: (cell: CellModel) => void = getAutoDetectFormatParser(this.parent);
        const performCalculation: () => void = (): void => {
            cell = getCell(row, col, sheet);
            if (!cell || isHiddenCol(sheet, col)) {
                return;
            }
            if (cell.formula && isNullOrUndefined(cell.value)) {
                this.parent.notify(calculateFormula, {
                    cell: cell, rowIdx: row, colIdx: col, sheetIndex: this.parent.activeSheetIndex
                });
            }
            autoDetectFormatFn(cell);
            if (cell.value || <unknown>cell.value === 0) {
                totalCount++;
                if (isNumber(cell.value)) {
                    args.countOnly = false;
                    const numValue: number = Number(cell.value);
                    totalSum += numValue;
                    numericCellsCount++;
                    overallMin = Math.min(overallMin, numValue);
                    overallMax = Math.max(overallMax, numValue);
                }
            }
        };
        let checkAndCalculate: () => void;
        const selectedRanges: string[] = sheet.selectedRange.split(' ');
        const cellAddress: Set<string> = new Set<string>();
        if (selectedRanges.length > 1) {
            checkAndCalculate = (): void => {
                const key: string = `${row}${col}`;
                if (cellAddress.has(key)) {
                    return;
                }
                cellAddress.add(key);
                performCalculation();
            };
        } else {
            checkAndCalculate = (): void => performCalculation();
        }
        selectedRanges.forEach((range: string) => {
            const indexes: number[] = getSwapRange(getRangeIndexes(range));
            if (indexes[2] > sheet.usedRange.rowIndex) {
                indexes[2] = sheet.usedRange.rowIndex;
            }
            if (indexes[3] > sheet.usedRange.colIndex) {
                indexes[3] = sheet.usedRange.colIndex;
            }
            for (row = indexes[0]; row <= indexes[2]; row++) {
                if (isHiddenRow(sheet, row)) {
                    continue;
                }
                for (col = indexes[1]; col <= indexes[3]; col++) {
                    checkAndCalculate();
                }
            }
        });
        args.Count = totalCount;
        if (!args.Count || args.countOnly) {
            return;
        }
        const finalAvg: number = numericCellsCount > 0 ? totalSum / numericCellsCount : 0;
        const aggregateValues: number[] = [totalSum, finalAvg, overallMin, overallMax];
        const formatedValues: string[] = [];
        const activeIndex: number[] = getRangeIndexes(sheet.activeCell);
        cell = getCell(activeIndex[0], activeIndex[1], sheet, false, true);
        aggregateValues.forEach((aggregateVal: number) => {
            let calcValue: string = aggregateVal.toString();
            if (cell.format && cell.format !== 'General') {
                const eventArgs: NumberFormatArgs = { formattedText: calcValue, value: calcValue, format: cell.format,
                    cell: { value: calcValue, format: cell.format } };
                this.parent.notify(getFormattedCellObject, eventArgs);
                calcValue = eventArgs.formattedText;
            } else {
                calcValue = this.toFixed(calcValue);
            }
            formatedValues.push(calcValue);
        });
        args.Sum = formatedValues[0];
        args.Avg = formatedValues[1];
        args.Min = formatedValues[2];
        args.Max = formatedValues[3];
        if ((totalCount - numericCellsCount) > numericCellsCount) {
            args.isMaxNonNumericCells = true;
        }
    }

    private refreshInsertDelete(args: InsertDeleteEventArgs): void {
        if (args.modelType === 'Sheet') {
            return;
        }
        const formulaDependentCells: Map<string, Map<string, string>> = this.calculateInstance.getDependentFormulaCells();
        let cell: CellModel;
        const sheetIndex: number = getSheetIndexFromId(this.parent, args.sheet.id);
        this.parent.sheets.forEach((sheet: SheetModel, index: number): void => {
            for (let i: number = 0, rowLen: number = sheet.usedRange.rowIndex; i <= rowLen; i++) {
                for (let j: number = 0, colLen: number = sheet.usedRange.colIndex; j <= colLen; j++) {
                    cell = getCell(i, j, sheet, false, true);
                    if (cell.formula && checkIsFormula(cell.formula)) {
                        if (index === sheetIndex) {
                            if (args.isInsert || !(args.modelType === 'Row' ? i >= args.startIndex && i <= args.endIndex :
                                j >= args.startIndex && j <= args.endIndex)) {
                                this.updateFormula(args, cell, i, j, sheetIndex);
                            }
                        } else if (cell.formula.includes(args.sheet.name)) {
                            this.updateFormula(args, cell, i, j, sheetIndex, true, sheet);
                        }
                    }
                }
            }
        });
        formulaDependentCells.clear();
        this.calculateInstance.getDependentCells().clear();
        this.calculateInstance.getFormulaInfoTable().clear();
        this.refreshNamedRange(args);
    }

    private getUpdatedFormulaOnInsertDelete(
        args: { insertDeleteArgs: InsertDeleteEventArgs, cell: CellModel, row?: number, col?: number, sheetIdx: number,
            otherSheet?: boolean, formulaSheet?: SheetModel, sheetNames?: string[], updateSheetRef?: Function }): void {
        if (args.sheetNames) {
            if (!args.updateSheetRef) {
                args.updateSheetRef = this.getSheetRefUpdateOnDelete();
            }
            const previousFormula: string = this.parseSheetRef(args.cell.formula, false);
            let formula: string = previousFormula;
            args.sheetNames.forEach((sheetName: string): void => {
                const updatedInfo: { value: string, isNamedRange?: boolean, isUpdate?: boolean} = args.updateSheetRef(sheetName, formula);
                if (updatedInfo.isUpdate) {
                    formula = updatedInfo.value;
                }
            });
            if (formula !== previousFormula) {
                args.cell.formula = formula;
            }
        } else {
            this.updateFormula(args.insertDeleteArgs, args.cell, args.row, args.col, args.sheetIdx, args.otherSheet, args.formulaSheet);
        }
    }

    private updateFormula(
        args: InsertDeleteEventArgs, cell: CellModel, row: number, col: number, sheetIdx: number, otherSheet?: boolean,
        formulaSheet?: SheetModel): void {
        let ref: string; let pVal: string; let index: number[]; let updated: boolean; let isRangeFormula: boolean;
        const containAlphabetAndDigit: RegExp = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)/g); let isValidCellReference: boolean; let isFullColumn: boolean;
        if (cell.formula && cell.formula.includes('UNIQUE') && cell.value !== '#SPILL!' && row !== undefined) {
            this.clearUniqueRange(row, col, formulaSheet || args.sheet);
        }
        const getAddress: () => string = (): string => {
            let range: string = (isAbsoluteRef ? '$' : '') + getColumnHeaderText(index[1] + 1) + (isAbsoluteRef ? '$' : '') + (index[0] + 1);
            if (index[0] !== index[2] || index[1] !== index[3]) {
                range += ':' + (isAbsoluteRef ? '$' : '') + getColumnHeaderText(index[3] + 1) + (isAbsoluteRef ? '$' : '') + (index[2] + 1);
            }
            return range;
        };
        const formulaArr: string[] = this.parseFormulaArgument({ formula: this.parseSheetRef(cell.formula, true), rangeRef: true });
        const sheetInfo: { visibleName: string, sheet: string }[] = this.getSheetInfo();
        let sheetName: string; let refChanged: boolean; let isAbsoluteRef: boolean;
        const isSingleRangeRef: boolean = !cell.formula.includes(this.parent.listSeparator);
        for (let i: number = 0; i < formulaArr.length; i++) {
            ref = formulaArr[i as number].trim();
            isAbsoluteRef = ref.includes('$');
            if (isAbsoluteRef) {
                ref = ref.replace(/[$]/g, '');
            }
            isValidCellReference = true;
            if (this.calculateInstance.isCellReference(ref)) {
                isRangeFormula = ref.includes(':');
                pVal = i && formulaArr[i - 1].trim();
                if (pVal && pVal[pVal.length - 1] === '!') {
                    pVal = pVal.replace(/['!]/g, '');
                    sheetName = sheetInfo[sheetIdx as number].sheet === sheetInfo[sheetIdx as number].visibleName ? args.sheet.name :
                        '`' + sheetInfo[sheetIdx as number].sheet + '`';
                    if (pVal !== sheetName) {
                        continue;
                    }
                } else if (otherSheet) {
                    continue;
                }
                if (!containAlphabetAndDigit.test(ref) && ref.indexOf(':') > -1) {
                    isValidCellReference = false;
                    isFullColumn = isNullOrUndefined(ref.match(/[0-9]/)) ? true : false;
                }
                index = getSwapRange(getRangeIndexes(ref));
                updated = this.parent.updateRangeOnInsertDelete(args, index, isRangeFormula, row, col, isAbsoluteRef, isSingleRangeRef);
                if (updated) {
                    formulaArr[i as number] = index[2] < index[0] || index[3] < index[1] ?
                        this.calculateInstance.getErrorStrings()[CommonErrors.Ref] : !isValidCellReference ?
                            (isFullColumn ? getRangeAddress(index).replace(/\d/g, '') : getRangeAddress(index).replace(/[a-zA-Z]/g, '')) : getAddress();
                    refChanged = true;
                }
            }
        }
        let newFormula: string = '=' + formulaArr.join('');
        if (refChanged) {
            let regx: RegExp; const regExp: RegExpConstructor = RegExp;
            sheetInfo.forEach((info: { visibleName: string, sheet: string }): void => {
                if (newFormula.includes('`' + info.sheet + '`')) {
                    regx = new regExp('`' + info.sheet + '`', 'gi');
                    newFormula = newFormula.replace(regx, info.visibleName);
                }
            });
            if (cell.formula !== newFormula) {
                cell.formula = newFormula;

                if (!(this.parent.calculationMode === 'Manual' && (args.isInsert || args.isDelete)) &&
                    !(cell.formula.includes('UNIQUE') && cell.value === '#SPILL!')) {
                    cell.value = null;
                }
            }
        }
    }

    private clearUniqueRange(row: number, col: number, sheet: SheetModel): void {
        const uniqueArgs: { cellIdx: number[], isUnique: boolean, uniqueRange: string, sheetName: string } =
        { cellIdx: [row, col, row, col], isUnique: false, uniqueRange: '', sheetName: sheet.name };
        this.parent.notify(checkUniqueRange, uniqueArgs);
        const range: number[] = getRangeIndexes(uniqueArgs.uniqueRange);
        for (let i: number = range[0]; i <= range[2]; i++) {
            for (let j: number = range[1]; j <= range[3]; j++) {
                delete getCell(i, j, sheet, false, true).value;
            }
        }
    }

    private clearAllUniqueFormulaValue(): void {
        const ranges: string[] = this.calculateInstance.uniqueRange;
        let cell: CellModel; let sheet: SheetModel; let range: number[];
        for (let i: number = 0; i < ranges.length; i++) {
            const lastIndex: number = ranges[i as number].lastIndexOf('!');
            sheet = getSheet(this.parent, getSheetIndex(this.parent, ranges[i as number].substring(0, lastIndex)));
            range = getRangeIndexes(ranges[i as number].substring(lastIndex + 1));
            cell = getCell(range[0], range[1], sheet);
            if (cell && cell.value === '#SPILL!') {
                continue;
            }
            for (let j: number = range[0]; j <= range[2]; j++) {
                for (let k: number = range[1]; k <= range[3]; k++) {
                    cell = getCell(j, k, sheet);
                    if (cell && cell.value) {
                        delete cell.value;
                    }
                }
            }
        }
    }

    private parseFormulaArgument(args: { formula: string, rangeRef?: boolean, formulaArr?: string[] }): string[] {
        let temp: string;
        let str: string | number;
        let i: number = 0;
        const arr: string[] = [];
        let formulaVal: string[] | string = this.markSpecialChar(args.formula.replace('=', ''), args.rangeRef);
        const regExp: RegExpConstructor = RegExp;
        const validCharRegx: RegExp = new regExp(args.rangeRef ? /\(|\)|=|\^|>|<|\+|-|\*|\/|%|&/g : /\(|\)|=|\^|>|<|:|\+|-|\*|\/|%|&/g);
        const sepRegx: RegExp = new regExp(this.parent.listSeparator, 'g');
        formulaVal = formulaVal.split(new regExp(validCharRegx.source + '|' + sepRegx.source, 'g'));
        const len: number = formulaVal.length;
        while (i < len) {
            temp = formulaVal[i as number];
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
                    arr.push(temp.substring(0, str));
                    temp = temp.substring(str);
                    str = temp.indexOf(':');
                    if (str > -1 && temp.indexOf('!') > str) {
                        arr.push(temp.substring(0, str));
                        arr.push(':');
                        temp = temp.substring(str + 1);
                        str = temp.indexOf('!') + 1;
                        arr.push(temp.substring(0, str));
                        arr.push(temp.substring(str));
                    } else {
                        arr.push(temp);
                    }
                } else if (this.isUniqueChar(str)) {
                    arr.push(this.getUniqueCharVal(str));
                    arr.push(temp.substr(1));
                } else {
                    arr.push(temp);
                }
            }
            i++;
        }
        args.formulaArr = arr;
        return arr;
    }

    private getUniqueCharVal(formula: string): string {
        switch (formula) {
        case this.uniqueOBracket:
            return '(';
        case this.uniqueCBracket:
            return ')';
        case this.uniqueCSeparator:
            return this.parent.listSeparator;
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
        const regEx: RegExpConstructor = RegExp;
        if (rangeRef) {
            formula = formula.replace(new regEx(this.parent.listSeparator, 'g'), this.parent.listSeparator + this.uniqueCSeparator);
        } else {
            formula = formula.replace(new regEx(this.parent.listSeparator, 'g'), this.parent.listSeparator + this.uniqueCSeparator).replace(
                /:/g, `:${this.uniqueCOperator}`);
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
        let range: number[]; let sheetName: string; let refAddress: string; let definedName: DefineNameModel; let updated: boolean;
        let checkSheetName: string; let rangeAddress: string;
        const containAlphabetAndDigit: RegExp = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)/g); let isValidCellReference: boolean; let isFullColumn: boolean;
        for (let i: number = 0; i < len; i++) {
            isValidCellReference = true;
            definedName = definedNames[i as number];
            const lastIndex: number = definedName.refersTo.lastIndexOf('!');
            refAddress = definedName.refersTo.substring(lastIndex + 1);
            sheetName = definedName.refersTo.substring(1, lastIndex);
            checkSheetName = sheetName;
            if (checkSheetName.match(/'/g)) { checkSheetName = checkSheetName.slice(1, -1); }
            if (checkSheetName !== args.sheet.name) { continue; }
            if (!containAlphabetAndDigit.test(refAddress) && refAddress.indexOf(':') > -1) {
                isValidCellReference = false;
                isFullColumn = isNullOrUndefined(refAddress.match(/[0-9]/)) ? true : false;
            }
            range = getRangeIndexes(refAddress);
            updated = this.parent.updateRangeOnInsertDelete(args, range);
            if (!isValidCellReference) {
                rangeAddress = isFullColumn ? getRangeAddress(range).replace(/\d/g, '') : getRangeAddress(range).replace(/[a-zA-Z]/g, '');
            } else {
                rangeAddress = getRangeAddress(range);
            }
            if (args.isInsert) {
                this.updateDefinedNames(definedName, sheetName, rangeAddress, updated);
            } else {
                if (args.modelType === 'Row') {
                    this.updateDefinedNames(definedName, sheetName, rangeAddress, updated, [range[0], range[2]], args);
                } else if (args.modelType === 'Column') {
                    this.updateDefinedNames(definedName, sheetName, rangeAddress, updated, [range[1], range[3]], args);
                }
            }
        }
    }

    private updateDefinedNames(
        definedName: DefineNameModel, sheetName: string, rangeAddress: string, changed: boolean, idx?: number[],
        args?: InsertDeleteEventArgs): void {
        if (!changed) { return; }
        const index: number = this.parent.definedNames.indexOf(definedName);
        const eventArgs: { [key: string]: Object } = {
            action: 'removeDefinedName',
            isRemoved: false,
            definedName: definedName.name,
            scope: definedName.scope,
            isEventTrigger: true
        };
        this.parent.notify(workbookFormulaOperation, eventArgs);
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
        definedName.refersTo = sheetName + '!' + rangeAddress;
        this.parent.notify(workbookFormulaOperation, { action: 'addDefinedName', definedName: definedName, isAdded: false, index: index, isEventTrigger: true });
        const refreshArgs: DefinedNameEventArgs = { name: definedName.name, scope: definedName.scope, comment: definedName.comment,
            refersTo: definedName.refersTo, cancel: false };
        this.parent.notify('actionComplete', { eventArgs: refreshArgs, action: 'refreshNamedRange' });
    }
}
