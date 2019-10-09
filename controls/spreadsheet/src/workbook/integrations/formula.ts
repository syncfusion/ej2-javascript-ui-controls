import { Workbook, getSheetName, getSheetIndex, getSheet, SheetModel } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, AggregateArgs, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CalcSheetFamilyItem } from '../../calculate/index';
import { IFormulaColl } from '../../calculate/common/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DefineNameModel, getCellAddress } from '../common/index';

/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
export class WorkbookFormula {
    private parent: Workbook;
    private calcID: number;

    public calculateInstance: Calculate;

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
        this.initiateDefinedNames();
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
        }
    }

    private registerSheet(
        sheetIndex: number = 0, sheetCount: number = this.parent.sheets.length): void {
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
            sheetIdx = this.parent.activeSheetTab;
        }
        sheetIdx--;
        let sheetName: string = getSheet(this.parent, sheetIdx).id + '';

        if (isFormula) {
            let cellArgs: ValueChangedArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            let referenceCollection: string[]  = this.calculateInstance.randCollection;
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
    }

    private autoCorrectFormula(formula: string): string {
        if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
            formula += ')';
        }
        return formula;
    }

    private initiateDefinedNames(): void {
        let definedNames: DefineNameModel[] = this.parent.definedNames;
        let len: number = definedNames.length;
        let i: number = 0;

        while (i < len) {
            let definedname: DefineNameModel = definedNames[i];
            this.addDefinedName(definedname);
            i++;
        }
    }

    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    private addDefinedName(definedName: DefineNameModel): boolean {
        let isAdded: boolean = true;
        let sheetIdx: number = null;
        let name: string = definedName.name;
        let refersTo: string = definedName.refersTo;
        if (definedName.scope) {
            sheetIdx = getSheetIndex(this.parent, definedName.scope);
            if (sheetIdx) {
                name = getSheetName(this.parent, sheetIdx - 1) + '!' + name;
            }
        } else {
            definedName.scope = '';
        }
        if (!definedName.comment) { definedName.comment = ''; }
        //need to extend once internal sheet value changes done.
        if (this.checkIsNameExist(definedName.name, definedName.scope)) {
            isAdded = false;
        } else {
            this.calculateInstance.addNamedRange(name, refersTo[0] === '=' ? refersTo.substr(1) : refersTo);
            if (refersTo[0] !== '=') {
                definedName.refersTo = '=' + refersTo;
            }
            this.parent.definedNames.push(definedName);
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
                    calcName = getSheetName(this.parent, sheetIdx - 1) + '!' + name;
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
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = `A1:${getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex)}`;
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count) { return; }
        args.Sum = this.toFixed(this.calculateInstance.getFunction('SUM')(range));
        args.Avg = this.toFixed(this.calculateInstance.getFunction('AVERAGE')(range));
        args.Min = this.toFixed(this.calculateInstance.getFunction('MIN')(range));
        args.Max = this.toFixed(this.calculateInstance.getFunction('MAX')(range));
    }
}
