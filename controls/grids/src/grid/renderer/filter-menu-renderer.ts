import { isNullOrUndefined, getValue, L10n, remove } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { IGrid, IValueFormatter, IFilterArgs, EJ2Intance } from '../base/interface';
import { PredicateModel } from '../base/grid-model';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Column } from '../models/column';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { FlMenuOptrUI } from './filter-menu-operator';
import { StringFilterUI } from './string-filter-ui';
import { NumberFilterUI } from './number-filter-ui';
import { BooleanFilterUI } from './boolean-filter-ui';
import { DateFilterUI } from './date-filter-ui';
import { getFilterMenuPostion, parentsUntil, appendChildren } from '../base/util';
import * as events from '../base/constant';

/**
 * `filter menu` render boolean column.
 * @hidden
 */
export class FilterMenuRenderer {
    private parent: IGrid;
    private filterObj: Filter;
    private serviceLocator: ServiceLocator;
    private dlgDiv: HTMLElement;
    private l10n: L10n;
    public dlgObj: Dialog;
    private valueFormatter: IValueFormatter;
    private filterSettings: FilterSettings;
    private customFilterOperators: Object;
    private dropOptr: DropDownList;
    private flMuiObj: FlMenuOptrUI;
    private col: Column;
    private isDialogOpen: boolean = false;

    private colTypes: Object = {
        'string': StringFilterUI, 'number': NumberFilterUI, 'date': DateFilterUI, 'boolean': BooleanFilterUI, 'datetime': DateFilterUI
    };
    constructor(
        parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object,
        fltrObj?: Filter) {
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.customFilterOperators = customFltrOperators;
        this.filterObj = fltrObj;
        this.flMuiObj = new FlMenuOptrUI(this.parent, this.customFilterOperators, this.serviceLocator);
        this.l10n = this.serviceLocator.getService<L10n>('localization');
    }

    private openDialog(args: IFilterArgs): void {
        this.col = this.parent.getColumnByField(args.field);
        if (isNullOrUndefined(this.col.filter) || (isNullOrUndefined(this.col.filter.type) || this.col.filter.type === 'Menu')) {///
            this.renderDlgContent(args.target, this.col);
        }

    }

    private closeDialog(): void {
        if (!this.dlgObj) { return; }
        let elem: Element = document.getElementById(this.dlgObj.element.id);
        if (this.dlgObj && !this.dlgObj.isDestroyed && elem) {
            this.parent.notify(events.filterMenuClose, { field: this.col.field });
            this.isDialogOpen = false;
            this.dlgObj.destroy();
            remove(elem);
        }
    }

    private renderDlgContent(target: Element, column: Column): void {
        let args: Object = {
            requestType: events.filterBeforeOpen, filterModel: this,
            columnName: column.field, columnType: column.type
        };
        this.parent.trigger(events.actionBegin, args);

        let mainDiv: HTMLElement = this.parent.createElement('div', { className: 'e-flmenu-maindiv', id: column.uid + '-flmenu' });
        this.dlgDiv = this.parent.createElement('div', { className: 'e-flmenu', id: column.uid + '-flmdlg' });
        this.parent.element.appendChild(this.dlgDiv);
        this.dlgObj = new Dialog({
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            created: this.dialogCreated.bind(this, target, column),
            position: this.parent.element.classList.contains('e-device') ? { X: 'center', Y: 'center' } : { X: '', Y: '' },
            target: this.parent.element.classList.contains('e-device') ? document.body : this.parent.element,
            buttons: [{
                click: this.filterBtnClick.bind(this, column),
                buttonModel: {
                    content: this.l10n.getConstant('FilterButton'), isPrimary: true, cssClass: 'e-flmenu-okbtn'
                }
            },
            {
                click: this.clearBtnClick.bind(this, column),
                buttonModel: { content: this.l10n.getConstant('ClearButton'), cssClass: 'e-flmenu-cancelbtn' }
            }],
            content: mainDiv,
            width: (!isNullOrUndefined(parentsUntil(target, 'e-bigger'))) || this.parent.element.classList.contains('e-device') ? 260 : 250,
            animationSettings: { effect: 'None' },
            cssClass: 'e-filter-popup'
        });
        this.dlgObj.appendTo(this.dlgDiv);
    }

    private dialogCreated(target: Element, column: Column): void {
        if (!Browser.isDevice) {
            getFilterMenuPostion(target, this.dlgObj, this.parent);
        }
        this.renderFilterUI(target, column);
        this.parent.notify(events.filterDialogCreated, {});
        this.dlgObj.element.style.maxHeight = '350px';
        this.dlgObj.show();
        if (!column.filterTemplate) {
            this.writeMethod(column, this.dlgObj.element.querySelector('#' + column.uid + '-flmenu'));
        }
        let args: Object = {
            requestType: events.filterAfterOpen,
            filterModel: this, columnName: column.field, columnType: column.type
        };
        this.isDialogOpen = true;
        this.parent.trigger(events.actionComplete, args);

    }

    private renderFilterUI(target: Element, col: Column): void {

        let dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-flmenu-maindiv');

        this.renderOperatorUI(dlgConetntEle, target, col);
        this.renderFlValueUI(dlgConetntEle, target, col);
    }

    private renderOperatorUI(dlgConetntEle: Element, target: Element, column: Column): void {
        this.flMuiObj.renderOperatorUI(dlgConetntEle, target, column, this.dlgObj);
    }

    private renderFlValueUI(dlgConetntEle: Element, target: Element, column: Column): void {
        let valueDiv: HTMLElement = this.parent.createElement('div', { className: 'e-flmenu-valuediv' });
        let fObj: Object = this.filterObj;
        dlgConetntEle.appendChild(valueDiv);
        let args: Object = { target: valueDiv, column: column, getOptrInstance: this.flMuiObj, dialogObj: this.dlgObj };
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[column.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (column.filterTemplate) {
            let fltrData: Object = {};
            fltrData[column.field] = (<{ values: Object }>fObj).values[column.field];
            if (column.foreignKeyValue) {
                fltrData[column.foreignKeyValue] = (<{ values: Object }>fObj).values[column.foreignKeyValue];
            }
            let col: string = 'column';
            fltrData[col] = column;
            let compElement: Element[] = column.getFilterTemplate()(fltrData, this.parent, 'filterTemplate');
            appendChildren(valueDiv, compElement);
        } else {
            if (!isNullOrUndefined(column.filter) && !isNullOrUndefined(column.filter.ui)
                && !isNullOrUndefined(column.filter.ui.create as Function)) {
                let temp: Function = column.filter.ui.create as Function;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                (temp as Function)({
                    column: column, target: valueDiv,
                    getOptrInstance: this.flMuiObj, dialogObj: this.dlgObj
                });
            } else {
                instanceofFilterUI.create({
                    column: column, target: valueDiv,
                    getOptrInstance: this.flMuiObj, localizeText: this.l10n, dialogObj: this.dlgObj
                });
            }
        }
    }


    private writeMethod(col: Column, dlgContentEle: Element): void {
        let flValue: string | number | Date | boolean;
        let target: Element = dlgContentEle.querySelector('.e-flmenu-valinput');
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        let columns: PredicateModel[] = this.filterSettings.columns;
        for (let column of columns) {
            if (col.field === column.field || col.foreignKeyValue === column.field) {
                flValue = column.value;
            }
        }
        if (!isNullOrUndefined(col.filter) && !isNullOrUndefined(col.filter.ui)
            && !isNullOrUndefined(col.filter.ui.write as Function)) {
            let temp: Function = col.filter.ui.write as Function;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            (temp as Function)({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        } else {
            instanceofFilterUI.write({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        }
    }

    private filterBtnClick(col: Column): void {
        let flValue: string | number | Date | boolean;
        let flOptrValue: string;
        let targ: HTMLInputElement = this.dlgObj.element.querySelector('.e-flmenu-valuediv input') as HTMLInputElement;
        flOptrValue = this.flMuiObj.getFlOperator();
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (col.filterTemplate) {
            let element: Element = this.dlgDiv.querySelector('.e-flmenu-valuediv');
            let fltrValue: string | boolean | Date;
            if ((<HTMLInputElement>element.children[0]).value) {
                fltrValue = (<HTMLInputElement>element.children[0]).value;
            } else {
                fltrValue = ((<EJ2Intance>(element.children[0] as Element)).ej2_instances[0] as { value?: string | boolean | Date }).value;
            }
            this.filterObj.filterByColumn(col.field, flOptrValue, fltrValue);
        } else {
            if (!isNullOrUndefined(col.filter) &&
                !isNullOrUndefined(col.filter.ui) && !isNullOrUndefined(col.filter.ui.read as Function)) {
                let temp: Function = col.filter.ui.read as Function;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                flValue = (temp as Function)({ element: targ, column: col, operator: flOptrValue, fltrObj: this.filterObj });
            } else {
                instanceofFilterUI.read(targ, col, flOptrValue, this.filterObj);

            }
        }
        let iconClass: string = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        let column: Element = this.parent.element.querySelector('[e-mappinguid="' + col.uid + '"]').parentElement;
        let flIcon: Element = column.querySelector(iconClass);
        if (flIcon) { flIcon.classList.add('e-filtered'); }
        this.closeDialog();
    }

    private clearBtnClick(column: Column): void {
        this.filterObj.removeFilteredColsByField(column.field);
        this.closeDialog();
        let iconClass: string = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        let col: Element = this.parent.element.querySelector('[e-mappinguid="' + column.uid + '"]').parentElement;
        let flIcon: Element = col.querySelector(iconClass);
        if (flIcon) {
            flIcon.classList.remove('e-filtered');
        }

    }

    public destroy(): void {
        this.closeDialog();
    }
}