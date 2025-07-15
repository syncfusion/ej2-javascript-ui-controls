import { isNullOrUndefined, getValue, L10n, remove } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { IGrid, IValueFormatter, IFilterArgs, EJ2Intance, FilterUI, FilterMenuRendererArgs, ICustomOptr } from '../base/interface';
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
import { getFilterMenuPostion, parentsUntil, appendChildren, resetDialogAppend } from '../base/util';
import * as events from '../base/constant';
import { IXLFilter } from '../common/filter-interface';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';

/**
 * `filter menu` render boolean column.
 *
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
    private operator: Object[];
    private filterSettings: FilterSettings;
    public customFilterOperators: ICustomOptr;
    private dropOptr: DropDownList;
    private flMuiObj: FlMenuOptrUI;
    private col: Column;
    private isDialogOpen: boolean = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public menuFilterBase: any;
    public options: IFilterArgs;
    private maxHeight: string = '350px';
    private isMenuCheck: boolean = false;
    private currentDialogCreatedColumn: Column;

    private colTypes: Object = {
        'string': StringFilterUI, 'number': NumberFilterUI, 'date': DateFilterUI, 'dateonly': DateFilterUI, 'boolean': BooleanFilterUI, 'datetime': DateFilterUI
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
        this.menuFilterBase = new CheckBoxFilterBase(parent as IXLFilter);
    }

    protected clearCustomFilter(col: Column): void {
        this.clearBtnClick(col);
    }

    protected applyCustomFilter(args: { col: Column }): void {
        this.filterBtnClick(args.col);
    }

    private openDialog(args: IFilterArgs): void {
        this.options = args;
        this.col = this.parent.getColumnByField(args.field);
        if (isNullOrUndefined(this.col.filter) || (isNullOrUndefined(this.col.filter.type) || this.col.filter.type === 'Menu')) {///
            this.renderDlgContent(args.target, this.col);
        }

    }

    private closeDialog(target?: Element): void {
        if (!this.dlgObj) { return; }
        const elem: Element = document.getElementById(this.dlgObj.element.id);
        if (this.dlgObj && !this.dlgObj.isDestroyed && elem) {
            const argument: Object = { cancel: false, column: this.col, target: target, element: elem };
            if ((<{ cancel?: boolean }>argument).cancel) {
                this.parent.isColumnMenuFilterClosing = false;
                return;
            }
            this.parent.notify(events.filterMenuClose, argument);
            this.isDialogOpen = false;
            if (this.isMenuCheck) {
                this.menuFilterBase.unWireEvents();
                this.parent.off(events.cBoxFltrComplete, this.actionComplete);
                this.isMenuCheck = false;
            }
            const column: Column = this.col;
            if (!isNullOrUndefined(column.filter) && !isNullOrUndefined(column.filter.ui)
                && !isNullOrUndefined(column.filter.ui.destroy as Function)) {
                let temp: Function = column.filter.ui.destroy as Function;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                (temp as Function)();
            }
            if ((this.parent.isReact || this.parent.isVue) && this.col.filterTemplate && this.col.filterTemplate instanceof Function) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.parent as any).clearTemplate(['filterTemplate'], undefined, () => {
                    this.dlgObj.destroy();
                });
            }
            else {
                this.dlgObj.destroy();
                remove(elem);
            }
            if (!this.parent.showColumnChooser) {
                let gridPopup: HTMLElement = document.getElementById(this.parent.element.id + '_e-popup');
                if (!isNullOrUndefined(gridPopup)) {
                    remove(gridPopup);
                    gridPopup = null;
                }
            }
            if (!isNullOrUndefined(this.dlgObj['storeActiveElement'])) {
                this.dlgObj['storeActiveElement'].focus();
            }
        }
        this.parent.notify(events.filterDialogClose, {});
    }

    private renderDlgContent(target: Element, column: Column): void {
        const args: FilterMenuRendererArgs = {
            requestType: events.filterBeforeOpen,
            columnName: column.field, columnType: column.type
        };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        this.parent.trigger(events.actionBegin, args);

        const mainDiv: HTMLElement = this.parent.createElement('div', { className: 'e-flmenu-maindiv', id: column.uid + '-flmenu' });
        this.dlgDiv = this.parent.createElement('div', { className: 'e-flmenu', id: column.uid + '-flmdlg' });
        this.dlgDiv.setAttribute('aria-label', this.l10n.getConstant('FilterMenuDialogARIA'));
        if (this.parent.enableAdaptiveUI) {
            const responsiveCnt: HTMLElement = document.querySelector('.e-resfilter > .e-dlg-content > .e-mainfilterdiv');
            responsiveCnt.appendChild(this.dlgDiv);
        } else {
            this.parent.element.appendChild(this.dlgDiv);
        }
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
                    content: this.l10n.getConstant('FilterButton'), isPrimary: true,
                    cssClass: this.parent.cssClass ? 'e-flmenu-okbtn' + ' ' + this.parent.cssClass : 'e-flmenu-okbtn'
                }
            },
            {
                click: this.clearBtnClick.bind(this, column),
                buttonModel: { content: this.l10n.getConstant('ClearButton'),
                    cssClass: this.parent.cssClass ? 'e-flmenu-cancelbtn' + ' ' + this.parent.cssClass : 'e-flmenu-cancelbtn' }
            }],
            content: mainDiv,
            width: (!isNullOrUndefined(parentsUntil(target, 'e-bigger'))) || this.parent.element.classList.contains('e-device') ? 260 : 250,
            animationSettings: { effect: 'None' },
            cssClass: this.parent.cssClass ? 'e-filter-popup' + ' ' + this.parent.cssClass : 'e-filter-popup'
        });
        const isStringTemplate: string = 'isStringTemplate';
        this.dlgObj[`${isStringTemplate}`] = true;
        this.renderResponsiveDialog();
        this.dlgObj.appendTo(this.dlgDiv);
    }

    private renderResponsiveDialog(): void {
        const gObj: IGrid = this.parent;
        if (gObj.enableAdaptiveUI) {
            this.dlgObj.position = { X: '', Y: '' };
            this.dlgObj.target = document.querySelector('.e-resfilter > .e-dlg-content > .e-mainfilterdiv') as HTMLElement;
            this.dlgObj.width = '100%';
            this.dlgObj.isModal = false;
            this.dlgObj.buttons = [{}];
        }
    }

    private dialogCreated(target: Element, column: Column): void {
        if (!Browser.isDevice && target) {
            getFilterMenuPostion(target, this.dlgObj, this.parent);
        }
        else if (!this.options.isResponsiveFilter) {
            this.dlgObj.position = { X: 'center', Y: 'center' };
        }
        this.currentDialogCreatedColumn = column;
        this.renderFilterUI(target, column);
        if (!(column.isForeignColumn() && !(!isNullOrUndefined(column.filter) && !isNullOrUndefined(column.filter.ui)
            && !isNullOrUndefined(column.filter.ui.create as Function)))) {
            this.afterRenderFilterUI();
        }
        const isReactCompiler: boolean = this.parent.isReact && typeof (column.filterTemplate) !== 'string';
        const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
        if (!isNullOrUndefined(column.filterTemplate) && !(isReactCompiler || isReactChild) ) {
            (this.dlgDiv.querySelector('.e-flmenu-valuediv').firstElementChild as HTMLElement).focus();
            this.dlgDiv.querySelector('.e-flmenu-valuediv').firstElementChild.classList.add('e-input-focus');
        }
        else if (!isNullOrUndefined(this.dlgDiv.querySelector('.e-flmenu-input'))) {
            (this.dlgDiv.querySelector('.e-flmenu-input') as HTMLElement).focus();
            this.dlgDiv.querySelector('.e-flmenu-input').parentElement.classList.add('e-input-focus');
        }
    }

    /**
     * Function to notify filterDialogCreated and trigger actionComplete
     *
     * @returns {void}
     * @hidden
     */
    public afterRenderFilterUI(): void {
        const column: Column = this.currentDialogCreatedColumn;
        if (column.showColumnMenu) {
            this.parent.notify(events.filterDialogCreated, {});
        }
        if (this.parent.enableAdaptiveUI) {
            this.dlgObj.element.style.left = '0px';
            this.dlgObj.element.style.maxHeight = 'none';
        } else {
            this.dlgObj.element.style.maxHeight = this.maxHeight;
        }
        this.dlgObj.show();
        if ((this.parent.getContent().firstElementChild as HTMLElement).offsetHeight < this.dlgObj.element.offsetHeight &&
            !parentsUntil(this.parent.element, 'e-gantt-dialog')) {
            resetDialogAppend(this.parent, this.dlgObj);
        }
        const optrInput: HTMLInputElement = this.dlgObj.element.querySelector('.e-flm_optrdiv').querySelector('input');
        const valInput: HTMLInputElement = this.dlgObj.element.querySelector('.e-flmenu-valuediv').querySelector('input');
        if (optrInput.value === 'Empty' || optrInput.value === 'Not Empty' ||
            optrInput.value === 'Null' || optrInput.value === 'Not Null') {
            if (!isNullOrUndefined(valInput['ej2_instances'])) {
                valInput['ej2_instances'][0]['enabled'] = false ;
            } else {
                valInput.setAttribute('disabled', 'true');
            }
        }
        else if (!isNullOrUndefined(valInput && valInput.getAttribute('disabled'))) {
            if (!isNullOrUndefined(valInput['ej2_instances'])) {
                valInput['ej2_instances'][0]['enabled'] = true ;
            } else {
                valInput.removeAttribute('disabled');
            }
        }
        if (!column.filterTemplate) {
            this.writeMethod(column, this.dlgObj.element.querySelector('#' + column.uid + '-flmenu'));
        }
        const args: Object = {
            requestType: events.filterAfterOpen,
            columnName: column.field, columnType: column.type
        };
        const filterModel: string = 'filterModel';
        args[`${filterModel}`] = this;
        this.isDialogOpen = true;
        if (!this.isMenuCheck) {
            this.parent.trigger(events.actionComplete, args);
        }
    }

    private renderFilterUI(target: Element, col: Column): void {

        const dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-flmenu-maindiv');
        this.parent.log('column_type_missing', {column: col});
        this.renderOperatorUI(dlgConetntEle, target, col);
        this.renderFlValueUI(dlgConetntEle, target, col);
    }

    private renderOperatorUI(dlgConetntEle: Element, target: Element, column: Column): void {
        this.flMuiObj.renderOperatorUI(dlgConetntEle, target, column, this.dlgObj, this.filterObj.menuOperator);
    }

    private renderFlValueUI(dlgConetntEle: Element, target: Element, column: Column): void {
        const valueDiv: HTMLElement = this.parent.createElement('div', { className: 'e-flmenu-valuediv' });
        const fObj: Object = this.filterObj;
        dlgConetntEle.appendChild(valueDiv);
        const instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[column.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (column.filterTemplate) {
            const fltrData: Object = {};
            const valueInString: string = 'value';
            fltrData[column.field] = fltrData[`${valueInString}`] = (<{ values: Object }>fObj).values[column.field];
            if (column.foreignKeyValue) {
                fltrData[column.foreignKeyValue] = (<{ values: Object }>fObj).values[column.field];
                fltrData[column.field] = undefined;
            }
            const col: string = 'column';
            fltrData[`${col}`] = column;
            const isReactCompiler: boolean = this.parent.isReact && typeof (column.filterTemplate) !== 'string' &&
                !(column.filterTemplate.prototype && column.filterTemplate.prototype.CSPTemplate);
            const isReactChild: boolean = this.parent.parentDetails && this.parent.parentDetails.parentInstObj &&
                this.parent.parentDetails.parentInstObj.isReact;
            const tempID: string = this.parent.element.id + column.uid + 'filterTemplate';
            if (isReactCompiler || isReactChild) {
                column.getFilterTemplate()(fltrData, this.parent, 'filterTemplate', tempID, null, null, valueDiv);
                this.parent.renderTemplates();
            } else {
                const compElement: Element[] = column.getFilterTemplate()(
                    fltrData, this.parent, 'filterTemplate', tempID, null, null, null, this.parent.root);
                appendChildren(valueDiv, compElement);
            }
            if (this.isMenuCheck) {
                this.menuFilterBase.cBox = this.dlgObj.element.querySelector('.e-checkboxlist.e-fields');
                this.menuFilterBase.wireEvents();
                this.parent.on(events.cBoxFltrComplete, this.actionComplete, this);
                this.menuFilterBase.getAllData();
            }
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
        let flValue: string | number | Date | boolean | (string | number | boolean | Date)[];
        const target: Element = dlgContentEle.querySelector('.e-flmenu-valinput');
        const instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        const columns: PredicateModel[] = this.filterSettings.columns;
        for (const column of columns) {
            if (col.uid === column.uid) {
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
        const targ: HTMLInputElement = this.dlgObj.element.querySelector('.e-flmenu-valuediv input') as HTMLInputElement;
        const flOptrValue: string = this.flMuiObj.getFlOperator();
        const instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (col.filterTemplate) {
            const element: Element = this.dlgDiv.querySelector('.e-flmenu-valuediv');
            let fltrValue: string | boolean | Date;
            if ((<HTMLInputElement>element.children[0]).value) {
                fltrValue = (<HTMLInputElement>element.children[0]).value;
            } else {
                if (!isNullOrUndefined((<EJ2Intance>(element.children[0] as Element)).ej2_instances)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fltrValue = ((<EJ2Intance>(((this.parent as any).isAngular ? element.children[0] :
                        element.querySelector('input')) as Element)).ej2_instances[0] as { value?: string | boolean | Date }).value;
                } else {
                    const eControl: EJ2Intance = ((element.querySelector('.e-control') as Element) as EJ2Intance);
                    if (!isNullOrUndefined(eControl)) {
                        fltrValue = col.type === 'boolean' ? (eControl as { checked?: boolean }).checked :
                            !isNullOrUndefined(eControl.ej2_instances) ?
                                (eControl.ej2_instances[0] as { value?: string | boolean | Date }).value :
                                (eControl as { value?: string | boolean | Date }).value;
                    }
                }
            }
            this.filterObj.filterByColumn(col.field, flOptrValue, fltrValue);
        } else {
            if (!isNullOrUndefined(col.filter) &&
                !isNullOrUndefined(col.filter.ui) && !isNullOrUndefined(col.filter.ui.read as Function)) {
                let temp: Function = col.filter.ui.read as Function;
                if (typeof temp === 'string') {
                    temp = getValue(temp, window);
                }
                // eslint-disable-next-line
                flValue = (temp as Function)({ element: targ, column: col, operator: flOptrValue, fltrObj: this.filterObj });
            } else {
                instanceofFilterUI.read(targ, col, flOptrValue, this.filterObj);

            }
        }
        this.closeDialog();
        if (this.parent.showColumnMenu) {
            this.parent.notify(events.afterFilterColumnMenuClose, {});
        }
    }

    private closeResponsiveDialog(): void {
        this.closeDialog();
    }

    private clearBtnClick(column: Column): void {
        this.filterObj.removeFilteredColsByField(column.field);
        this.closeDialog();
        if (this.parent.showColumnMenu) {
            this.parent.notify(events.afterFilterColumnMenuClose, {});
        }
    }

    public destroy(): void {
        this.closeDialog();
    }

    /**
     * @returns {FilterUI} returns the filterUI
     * @hidden
     */
    public getFilterUIInfo(): FilterUI {
        return { field: this.col.field, operator: this.flMuiObj.getFlOperator()};
    }

    public getOperatorDropdown(): DropDownList {
        return this.flMuiObj.dropOptr;
    }

    public renderCheckBoxMenu(): HTMLElement {
        this.isMenuCheck = true;
        this.menuFilterBase.updateModel(this.options);
        this.menuFilterBase.getAndSetChkElem(this.options);
        this.dlgObj.buttons = [{
            click: this.menuFilterBase.btnClick.bind(this.menuFilterBase),
            buttonModel: {
                content: this.menuFilterBase.getLocalizedLabel('FilterButton'),
                cssClass: 'e-primary', isPrimary: true
            }
        },
        {
            click: this.menuFilterBase.btnClick.bind(this.menuFilterBase),
            buttonModel: { cssClass: 'e-flat', content: this.menuFilterBase.getLocalizedLabel('ClearButton') }
        }];
        this.menuFilterBase.dialogObj = this.dlgObj;
        this.menuFilterBase.dlg = this.dlgObj.element;
        this.menuFilterBase.dlg.classList.add('e-menucheckbox');
        this.menuFilterBase.dlg.classList.remove('e-checkboxfilter');
        this.maxHeight = '800px';
        return this.menuFilterBase.sBox.innerHTML;
    }
    private actionComplete(args: Object): void {
        if (this.isMenuCheck) {
            this.parent.trigger(events.actionComplete, args);
        }
    }
}
