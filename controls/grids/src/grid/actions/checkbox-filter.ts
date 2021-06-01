import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { isActionPrevent } from '../base/util';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { IXLFilter } from '../common/filter-interface';
import { Column } from '../models/column';

/**
 * @hidden
 * `CheckBoxFilter` module is used to handle filtering action.
 */
export class CheckBoxFilter {

    protected parent: IGrid;
    public checkBoxBase: CheckBoxFilterBase;
    public isresetFocus: boolean;

    /**
     * Constructor for checkbox filtering module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @param {FilterSettings} filterSettings - specifies the filtersettings
     * @param {ServiceLocator} serviceLocator - specifies the ServiceLocator
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.isresetFocus = true;
        this.checkBoxBase = new CheckBoxFilterBase(parent as IXLFilter);
        this.addEventListener();
    }

    /**
     * To destroy the check box filter.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.checkBoxBase.closeDialog();
    }

    public openDialog(options: IFilterArgs): void {
        this.checkBoxBase.openDialog(options);
        this.parent.log('column_type_missing', { column: options.column });
    }

    public closeDialog(): void {
        this.destroy();
        if (this.isresetFocus) {
            this.parent.notify(events.restoreFocus, {});
        }
    }

    protected closeResponsiveDialog(): void {
        this.checkBoxBase.closeDialog();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'checkboxFilter';
    }

    private actionBegin(args: Object): void {
        this.parent.trigger(events.actionBegin, args);
    }

    private actionComplete(args: Object): void {
        this.parent.trigger(events.actionComplete, args);
    }

    private actionPrevent(args: { cancel: boolean }): void {
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, args);
            args.cancel = true;
        }
    }

    protected clearCustomFilter(col: Column): void {
        this.checkBoxBase.clearFilter(col);
    }

    protected applyCustomFilter(): void {
        this.checkBoxBase.fltrBtnHandler();
        this.checkBoxBase.closeDialog();
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.cBoxFltrBegin, this.actionBegin, this);
        this.parent.on(events.cBoxFltrComplete, this.actionComplete, this);
        this.parent.on(events.fltrPrevent, this.actionPrevent, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.cBoxFltrBegin, this.actionBegin);
        this.parent.off(events.cBoxFltrComplete, this.actionComplete);
        this.parent.off(events.fltrPrevent, this.actionPrevent);
    }

}
