import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ExcelFilterBase } from '../common/excel-filter-base';
import { CheckBoxFilter } from './checkbox-filter';
/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilter extends CheckBoxFilter {

    protected parent: IGrid;
    public excelFilterBase: ExcelFilterBase;

    /**
     * Constructor for excelbox filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object) {
        super(parent, filterSettings, serviceLocator);
        this.parent = parent;
        this.excelFilterBase = new ExcelFilterBase(parent, filterSettings, customFltrOperators);
    }

    /** 
     * To destroy the excel filter.
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        this.excelFilterBase.closeDialog();
    }

    public openDialog(options: IFilterArgs): void {
        this.excelFilterBase.openDialog(options);
    }

    public closeDialog(): void {
        this.excelFilterBase.closeDialog();
    }

    /* tslint:disable-next-line:max-line-length */
    public filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        matchCase?: boolean, ignoreAccent?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {
        /* tslint:disable-next-line:max-line-length */
        this.excelFilterBase.filterByColumn(fieldName, firstOperator, firstValue, predicate, matchCase, ignoreAccent, secondOperator, secondValue);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }

}
