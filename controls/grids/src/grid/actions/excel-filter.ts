import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs, FilterUI } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ExcelFilterBase } from '../common/excel-filter-base';
import { CheckBoxFilter } from './checkbox-filter';
import { IXLFilter } from '../common/filter-interface';
import * as events from '../base/constant';

/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilter extends CheckBoxFilter {

    protected parent: IGrid;
    public excelFilterBase: ExcelFilterBase;
    public isresetFocus: boolean;

    /**
     * Constructor for excelbox filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object) {
        super(parent, filterSettings, serviceLocator);
        this.parent = parent;
        this.isresetFocus = true;
        this.excelFilterBase = new ExcelFilterBase(parent as IXLFilter, customFltrOperators);
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
        if (this.isresetFocus) {
            this.parent.notify(events.restoreFocus, {});
        }
    }

    /* tslint:disable-next-line:max-line-length */
    public filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        matchCase?: boolean, ignoreAccent?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {
        /* tslint:disable-next-line:max-line-length */
        this.excelFilterBase.filterByColumn(fieldName, firstOperator, firstValue, predicate, matchCase, ignoreAccent, secondOperator, secondValue);
    }

    /**
     * @hidden
     */
    public getFilterUIInfo(): FilterUI {
        return this.excelFilterBase.getFilterUIInfo();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }

}
