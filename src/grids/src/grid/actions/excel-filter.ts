import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs, FilterUI } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { ExcelFilterBase } from '../common/excel-filter-base';
import { CheckBoxFilter } from './checkbox-filter';
import { IXLFilter } from '../common/filter-interface';
import * as events from '../base/constant';
import { Column } from '../models/column';

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
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {FilterSettings} filterSettings - specifies the Filtersettings
     * @param {ServiceLocator} serviceLocator - specifies the serviceLocator
     * @param {object} customFltrOperators - specifies the customFltrOperators
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
     *
     * @returns {void}
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

    protected clearCustomFilter(col: Column): void {
        this.excelFilterBase.clearFilter(col);
    }

    protected closeResponsiveDialog(isCustomFilter?: boolean): void {
        if (isCustomFilter) {
            this.excelFilterBase.removeDialog();
        } else {
            this.closeDialog();
        }
    }

    protected applyCustomFilter(args?: { col: Column, isCustomFilter: boolean }): void {
        if (!args.isCustomFilter) {
            this.excelFilterBase.fltrBtnHandler();
            this.excelFilterBase.closeDialog();
        } else {
            this.excelFilterBase.filterBtnClick(args.col.field);
        }
    }

    public filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        matchCase?: boolean, ignoreAccent?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {
        this.excelFilterBase.filterByColumn(
            fieldName, firstOperator, firstValue, predicate, matchCase, ignoreAccent, secondOperator, secondValue
        );
    }

    /**
     * @returns {FilterUI} returns the filterUI
     * @hidden
     */
    public getFilterUIInfo(): FilterUI {
        return this.excelFilterBase.getFilterUIInfo();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }
}
