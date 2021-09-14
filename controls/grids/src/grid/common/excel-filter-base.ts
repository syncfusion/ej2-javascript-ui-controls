import { EventHandler, remove, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate, Deferred } from '@syncfusion/ej2-data';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { DropDownList, AutoComplete, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { RadioButton, CheckBox } from '@syncfusion/ej2-buttons';
import {
    distinctStringValues, isComplexField, getComplexFieldID, getCustomDateFormat, applyBiggerTheme,
    performComplexDataOperation, registerEventHandlers, removeEventHandlers, clearReactVueTemplates
} from '../base/util';
import { Column } from '../models/column';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { OffsetPosition } from '@syncfusion/ej2-popups';
import { parentsUntil, appendChildren, extend, eventPromise } from '../base/util';
import { IFilterArgs, EJ2Intance, FilterUI } from '../base/interface';
import * as events from '../base/constant';
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { PredicateModel } from '../base/grid-model';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import { IXLFilter, FilterStateObj } from '../common/filter-interface';
import * as literals from '../base/string-literals';

/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilterBase extends CheckBoxFilterBase {
    //Internal variables
    private dlgDiv: HTMLElement;
    private dlgObj: Dialog;
    private customFilterOperators: Object;
    private optrData: Object;
    private menuItem: MenuItemModel;
    private menu: Element;
    private cmenu: HTMLUListElement;
    protected menuObj: ContextMenu;
    private isCMenuOpen: boolean;
    private firstOperator: string;
    private secondOperator: string;
    private childRefs: object[] = [];
    private eventHandlers: { [x: string]: { [y: string]: Function } } = {};
    private isDevice: boolean = false;

    /**
     * Constructor for excel filtering module
     *
     * @param {IXLFilter} parent - parent details
     * @param {Object} customFltrOperators - operator details
     * @hidden
     */
    constructor(parent?: IXLFilter, customFltrOperators?: Object) {
        super(parent);
        this.customFilterOperators = customFltrOperators;
        this.isExcel = true;
    }

    private getCMenuDS(type: string, operator?: string): MenuItemModel[] {
        const options: { number?: string[], date?: string[], string?: string[], datetime?: string[] } = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter']
        };
        options.date = options.number;
        options.datetime = options.number;
        const model: MenuItemModel[] = [];
        for (let i: number = 0; i < options[type].length; i++) {
            if (options[type][i].length) {
                if (operator) {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...',
                        iconCss: 'e-icons e-icon-check ' + (operator === options[type][i].toLowerCase() ? '' : 'e-emptyicon')
                    });
                } else {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...'
                    });
                }
            } else {
                model.push({ separator: true });
            }
        }
        return model;
    }

    /**
     * To destroy the filter bar.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.dlg) {
            this.unwireExEvents();
            super.closeDialog();
        }
        if (!this.isDevice && this.menuObj) {
            const li: HTMLElement = this.menuObj.element.querySelector('li.e-focused');
            if (!(li && parentsUntil(li, 'e-excel-menu'))) {
                this.destroyCMenu();
            }
        }
        if (this.dlgObj && !this.dlgObj.isDestroyed) {
            this.removeDialog();
        }
    }

    private createMenu(type: string, isFiltered: boolean, isCheckIcon: boolean, eleOptions?: IFilterArgs ): void {
        const options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateTimeFilter', number: 'NumberFilter' };
        this.menu = this.parent.createElement('div', { className: 'e-contextmenu-wrapper' });
        if (this.parent.enableRtl) {
            this.menu.classList.add('e-rtl');
        } else {
            this.menu.classList.remove('e-rtl');
        }
        const ul: Element = this.parent.createElement('ul');
        const icon: string = isFiltered ? 'e-excl-filter-icon e-filtered' : 'e-excl-filter-icon';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.parent.allowSorting && (this.parent as any).getModuleName() === 'grid'
            && !this.options.isResponsiveFilter) {
            const hdrele: string = this.parent.getColumnHeaderByUid(eleOptions.uid).getAttribute('aria-sort');
            const colIsSort: object = this.parent.getColumnByField(eleOptions.field).allowSorting;
            const isAsc: string = (!colIsSort || hdrele === 'ascending') ? 'e-disabled e-excel-ascending' : 'e-excel-ascending';
            const isDesc: string = (!colIsSort || hdrele === 'descending') ? 'e-disabled e-excel-descending' : 'e-excel-descending';
            const ascName: string = (type === 'string') ? this.getLocalizedLabel('SortAtoZ') : (type === 'datetime' || type === 'date') ?
                this.getLocalizedLabel('SortByOldest') : this.getLocalizedLabel('SortSmallestToLargest');
            const descName: string = (type === 'string') ? this.getLocalizedLabel('SortZtoA') : (type === 'datetime' || type === 'date') ?
                this.getLocalizedLabel('SortByNewest') : this.getLocalizedLabel('SortLargestToSmallest') ;
            ul.appendChild(this.createMenuElem(ascName, isAsc, 'e-sortascending'));
            ul.appendChild(this.createMenuElem(descName, isDesc, 'e-sortdescending'));
            const separator: Element = this.parent.createElement('li', { className: 'e-separator e-menu-item e-excel-separator'});
            ul.appendChild(separator);
        }
        if (!this.options.isResponsiveFilter) {
            ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        }
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(
                this.getLocalizedLabel(options[type]), 'e-submenu',
                isCheckIcon && this.ensureTextFilter() ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
        this.parent.notify(events.beforeFltrcMenuOpen, { element: this.menu });
        this.parent.notify(events.refreshCustomFilterClearBtn, { isFiltered: isFiltered });
    }

    private createMenuElem(val: string, className?: string, iconName?: string, isSubMenu?: boolean): Element {
        const li: Element = this.parent.createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = val;
        li.insertBefore(this.parent.createElement('span', { className: 'e-menu-icon e-icons ' + iconName }), li.firstChild);
        if (isSubMenu) {
            li.appendChild(this.parent.createElement('span', { className: 'e-icons e-caret' }));
        }
        return li;
    }

    private wireExEvents(): void {
        EventHandler.add(this.dlg, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.dlg, 'click', this.clickExHandler, this);
    }

    private unwireExEvents(): void {
        EventHandler.remove(this.dlg, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.dlg, 'click', this.clickExHandler);
    }

    private clickExHandler(e: MouseEvent): void {
        const options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateTimeFilter', number: 'NumberFilter' };
        const menuItem: HTMLElement = parentsUntil(e.target as Element, 'e-menu-item') as HTMLElement;
        if (menuItem) {
            if (this.getLocalizedLabel('ClearFilter') === menuItem.innerText.trim()) {
                this.clearFilter();
                this.closeDialog();
            } else if (this.options.isResponsiveFilter
                && this.getLocalizedLabel(options[this.options.type]) === menuItem.innerText.trim()) {
                this.hoverHandler(e);
            }
        }
    }

    private destroyCMenu(): void {
        this.isCMenuOpen = false;
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
            remove(this.cmenu);
            this.parent.notify(events.renderResponsiveCmenu, { target: null, header: '', isOpen: false, col: this.options.column });
        }
    }
    private hoverHandler(e: MouseEvent): void {
        if (this.options.isResponsiveFilter && e.type === 'mouseover') {
            return;
        }
        const target: Element = (e.target as Element).querySelector('.e-contextmenu');
        const li: Element = parentsUntil(e.target as Element, 'e-menu-item');
        const focused: Element = this.menu.querySelector('.e-focused');
        let isSubMenu: boolean;
        if (focused) {
            focused.classList.remove('e-focused');
        }
        if (li) {
            li.classList.add('e-focused');
            isSubMenu = li.classList.contains('e-submenu');
        }
        if (target) {
            return;
        }
        if (!isSubMenu) {
            const submenu: Element = this.menu.querySelector('.e-submenu');
            if (!isNullOrUndefined(submenu)) {
                submenu.classList.remove('e-selected');
            }
            this.destroyCMenu();
        }
        const selectedMenu: string = this.ensureTextFilter();
        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            const menuOptions: ContextMenuModel = {
                items: this.getCMenuDS(this.options.type, selectedMenu ? selectedMenu.replace(/\s/g, '') : undefined),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this),
                enableRtl: this.parent.enableRtl,
                beforeClose: this.preventClose.bind(this),
                cssClass: this.options.isResponsiveFilter ? 'e-res-contextmenu-wrapper' : ''
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            const client: ClientRect = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            const pos: OffsetPosition = { top: 0, left: 0 };
            if (this.options.isResponsiveFilter) {
                const options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateTimeFilter', number: 'NumberFilter' };
                const content: HTMLElement = document.querySelector('.e-responsive-dialog > .e-dlg-header-content');
                const height: number = content.offsetHeight + 4;
                this.menuObj.element.style.height = 'calc(100% - ' + height + 'px)';
                this.menuObj.open(height, 0, document.body);
                const header: string = this.getLocalizedLabel(options[this.options.type]);
                this.parent.notify(events.renderResponsiveCmenu, {
                    target: this.menuObj.element.parentElement, header: header, isOpen: true
                });
            } else {
                if (Browser.isDevice) {
                    this.isDevice = true;
                    const contextRect: ClientRect = this.getContextBounds();
                    pos.top = (window.innerHeight - contextRect.height) / 2;
                    pos.left = (window.innerWidth - contextRect.width) / 2;
                    this.closeDialog();
                    this.isDevice = false;
                } else {
                    pos.top = Browser.isIE ? window.pageYOffset + client.top : window.scrollY + client.top;
                    pos.left = this.getCMenuYPosition(this.dlg);
                }
                this.menuObj.open(pos.top, pos.left, e.target as HTMLElement);
            }
            applyBiggerTheme(this.parent.element, this.menuObj.element.parentElement);
        }
    }

    private ensureTextFilter(): string {
        let selectedMenu: string;
        const predicates: PredicateModel[] = this.existingPredicate[this.options.field];
        if (predicates && predicates.length === 2) {
            if (predicates[0].operator === 'greaterthanorequal' && predicates[1].operator === 'lessthanorequal') {
                selectedMenu = 'between';
            } else {
                selectedMenu = 'customfilter';
            }
        } else {
            if (predicates && predicates.length === 1) {
                this.optrData = this.customFilterOperators[this.options.type + 'Operator'];
                selectedMenu = predicates[0].operator;
            }
        }
        return selectedMenu;
    }

    private preventClose(args: BeforeOpenCloseMenuEventArgs): void {
        if (this.options && this.options.isResponsiveFilter && args.event) {
            const target: Element = (<Element>args.event.target);
            const isFilterBack: boolean = target.classList.contains('e-resfilterback')
                || target.classList.contains('e-res-back-btn') || target.classList.contains('e-menu-item');
            args.cancel = !isFilterBack;
        } else {
            if (args.event instanceof MouseEvent && (<Element>args.event.target).classList.contains('e-submenu')) {
                args.cancel = true;
            }
        }
    }

    private getContextBounds(): ClientRect {
        this.menuObj.element.style.display = 'block';
        return this.menuObj.element.getBoundingClientRect();
    }
    private getCMenuYPosition(target: Element): number {
        const contextWidth: number = this.getContextBounds().width;
        const targetPosition: ClientRect = target.getBoundingClientRect();
        const leftPos: number = targetPosition.right + contextWidth - this.parent.element.clientWidth;
        let targetBorder: number = (target as HTMLElement).offsetWidth - (target as HTMLElement).clientWidth;
        targetBorder = targetBorder ? targetBorder + 1 : 0;
        return (leftPos < 1) ? (targetPosition.right + 1 - targetBorder) : (targetPosition.left - contextWidth - 1 + targetBorder);
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
        this.dialogObj.dataBind();
        const filterLength: number = (this.existingPredicate[options.field] && this.existingPredicate[options.field].length) ||
            this.options.filteredColumns.filter((col: Predicate) => {
                return this.options.field === col.field;
            }).length;
        this.createMenu(options.type, filterLength > 0, (filterLength === 1 || filterLength === 2), options);
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        if (this.parent.enableRtl) {
            this.dlg.classList.add('e-rtl');
        }
        this.dlg.classList.remove('e-checkboxfilter');
        this.cmenu = this.parent.createElement('ul', { className: 'e-excel-menu' }) as HTMLUListElement;
        this.parent.notify(events.filterDialogCreated, {});
        this.wireExEvents();
    }

    public closeDialog(): void {
        this.destroy();
    }

    private selectHandler(e: MenuEventArgs): void {
        if (e.item) {
            this.parent.notify(events.filterCmenuSelect, {});
            this.menuItem = e.item;
            this.renderDialogue(e);
        }
    }

    /**
     * @hidden
     * @param {MenuEventArgs} e - event args
     * @returns {void}
     */
    public renderDialogue(e?: MenuEventArgs): void {
        const target: HTMLElement = e ? e.element as HTMLElement : undefined;
        const column: string = this.options.field;
        const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
        const mainDiv: HTMLElement = this.parent.createElement('div', {
            className: 'e-xlfl-maindiv',
            id: isComplex ? complexFieldName + '-xlflmenu' : column + '-xlflmenu'
        });
        this.dlgDiv = this.parent.createElement('div', {
            className: 'e-xlflmenu',
            id: isComplex ? complexFieldName + '-xlfldlg' : column + '-xlfldlg'
        });
        if (this.options.isResponsiveFilter) {
            const responsiveCnt: HTMLElement = document.querySelector('.e-resfilter > .e-dlg-content > .e-xl-customfilterdiv');
            responsiveCnt.appendChild(this.dlgDiv);
        } else {
            this.parent.element.appendChild(this.dlgDiv);
        }
        this.dlgObj = new Dialog({
            header: this.getLocalizedLabel('CustomFilter'),
            isModal: true,
            overlayClick: this.removeDialog.bind(this),
            showCloseIcon: true,
            closeOnEscape: false,
            target: document.body,
            // target: this.parent.element,
            visible: false,
            enableRtl: this.parent.enableRtl,
            open: () => {
                const row: HTMLTableRowElement = this.dlgObj.element.querySelector('table.e-xlfl-table>tr') as HTMLTableRowElement;
                if (this.options.column.filterTemplate) {
                    (row.querySelector('#' + this.options.column.field + '-xlfl-frstvalue') as HTMLElement).focus();
                } else {
                    //(row.cells[1].querySelector('input:not([type=hidden])') as HTMLElement).focus();
                }
            },
            close: this.removeDialog.bind(this),
            created: this.createdDialog.bind(this, target, column),
            buttons: [{
                click: this.filterBtnClick.bind(this, column),
                buttonModel: {
                    content: this.getLocalizedLabel('OKButton'), isPrimary: true, cssClass: 'e-xlfl-okbtn'
                }
            },
            {
                click: this.removeDialog.bind(this),
                buttonModel: { content: this.getLocalizedLabel('CancelButton'), cssClass: 'e-xlfl-cancelbtn' }
            }],
            content: mainDiv,
            width: 430,
            animationSettings: { effect: 'None' }
        });
        const isStringTemplate: string = 'isStringTemplate';
        this.dlgObj[isStringTemplate] = true;
        this.renderResponsiveDialog();
        this.dlgDiv.setAttribute('aria-label', this.getLocalizedLabel('CustomFilterDialogARIA'));
        this.childRefs.push(this.dlgObj);
        this.dlgObj.appendTo(this.dlgDiv);
    }

    private renderResponsiveDialog(): void {
        if (this.options.isResponsiveFilter) {
            const rowResponsiveDlg: Element = document.querySelector('.e-row-responsive-filter');
            if (rowResponsiveDlg) {
                rowResponsiveDlg.classList.remove('e-row-responsive-filter');
            }
            this.dlgObj.buttons = [{}];
            this.dlgObj.header = undefined;
            this.dlgObj.position = { X: '', Y: '' };
            this.dlgObj.target = document.querySelector('.e-resfilter > .e-dlg-content > .e-xl-customfilterdiv') as HTMLElement;
            this.dlgObj.width = '100%';
            this.dlgObj.isModal = false;
            this.dlgObj.showCloseIcon = false;
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public removeDialog(): void {
        this.parent.notify(events.customFilterClose, {});
        if ((this.parent.isReact || this.parent.isVue) && this.parent.destroyTemplate !== undefined) {
            clearReactVueTemplates(this.parent, ['filterTemplate']);
        }
        this.removeObjects(this.childRefs);
        remove(this.dlgDiv);
        this.parent.notify(events.filterDialogClose, {});
    }

    private createdDialog(target: Element, column: string): void {
        this.renderCustomFilter(target, column);
        this.dlgObj.element.style.left = '0px';
        if (!this.options.isResponsiveFilter) {
            this.dlgObj.element.style.top = '0px';
        } else {
            const content: HTMLElement = document.querySelector('.e-responsive-dialog > .e-dlg-header-content');
            const height: number = content.offsetHeight + 4;
            this.dlgObj.element.style.top = height + 'px';
        }
        if (!this.options.isResponsiveFilter && Browser.isDevice && window.innerWidth < 440) {
            this.dlgObj.element.style.width = '90%';
        }
        this.parent.notify(events.beforeCustomFilterOpen, { column: column, dialog: this.dialogObj });
        this.dlgObj.show();
        applyBiggerTheme(this.parent.element, this.dlgObj.element.parentElement);
    }

    private renderCustomFilter(target: Element, column: string): void {
        const dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-xlfl-maindiv');

        const dlgFields: HTMLElement = this.parent.createElement('div', { innerHTML: this.getLocalizedLabel('ShowRowsWhere'), className: 'e-xlfl-dlgfields' });
        dlgConetntEle.appendChild(dlgFields);

        //column name
        const fieldSet: HTMLElement = this.parent.createElement('div', { innerHTML: this.options.displayName, className: 'e-xlfl-fieldset' });
        dlgConetntEle.appendChild(fieldSet);

        this.renderFilterUI(column, dlgConetntEle);
    }

    /**
     * @hidden
     * @param {string} col - Defines column details
     * @returns {void}
     */
    public filterBtnClick(col: string): void {
        const isComplex: boolean = !isNullOrUndefined(col) && isComplexField(col);
        const complexFieldName: string = !isNullOrUndefined(col) && getComplexFieldID(col);
        const colValue: string = isComplex ? complexFieldName : col;
        const fValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstvalue')).ej2_instances[0];
        const fOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstoptr')).ej2_instances[0];
        const sValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndvalue')).ej2_instances[0];
        const sOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndoptr')).ej2_instances[0];
        let checkBoxValue: boolean;
        if (this.options.type === 'string') {
            const checkBox: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlflmtcase')).ej2_instances[0];
            checkBoxValue = checkBox.checked;
        }
        const andRadio: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + 'e-xlfl-frstpredicate')).ej2_instances[0];
        let predicate: string = (andRadio.checked ? 'and' : 'or');
        if (sValue.value === null) {
            predicate = 'or';
        }
        this.filterByColumn(
            this.options.field, fOperator.value as string, fValue.value, predicate,
            checkBoxValue, this.options.ignoreAccent, sOperator.value as string, sValue.value);
        this.removeDialog();
    }
    /**
     * @hidden
     * Filters grid row by column name with given options.
     *
     * @param {string} fieldName - Defines the field name of the filter column.
     * @param {string} firstOperator - Defines the first operator by how to filter records.
     * @param {string | number | Date | boolean} firstValue - Defines the first value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param {boolean} matchCase - If ignore case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param {boolean} ignoreAccent - If ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @param {string} secondOperator - Defines the second operator by how to filter records.
     * @param {string | number | Date | boolean} secondValue - Defines the first value which is used to filter records.
     * @returns {void}
     */
    public filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        matchCase?: boolean, ignoreAccent?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {
        const col: Column = this.parent.getColumnByField ? this.parent.getColumnByField(fieldName) : this.options.column;
        const field: string = this.isForeignColumn(col) ? col.foreignKeyValue : fieldName;
        const fColl: PredicateModel[] = [];
        let mPredicate: Predicate;
        fColl.push({
            field: field,
            predicate: predicate,
            matchCase: matchCase,
            ignoreAccent: ignoreAccent,
            operator: firstOperator as string,
            value: firstValue,
            type: this.options.type
        });
        const arg: {
            instance: ExcelFilterBase, handler: Function, cancel: boolean, arg1: string, arg2: string,
            arg3: string, arg4: string, arg5: boolean, arg6: boolean, arg7: string, arg8: string
        } = {
            instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: firstOperator, arg3: firstValue as string, arg4: predicate,
            arg5: matchCase, arg6: ignoreAccent, arg7: secondOperator, arg8: secondValue as string, cancel: false
        };
        this.parent.notify(events.fltrPrevent, arg);
        if (arg.cancel) {
            return;
        }
        mPredicate = new Predicate(field, firstOperator.toLowerCase(), firstValue, !matchCase, ignoreAccent);
        if (!isNullOrUndefined(secondValue) && !isNullOrUndefined(secondOperator)) {
            fColl.push({
                field: field,
                predicate: predicate,
                matchCase: matchCase,
                ignoreAccent: ignoreAccent,
                operator: secondOperator as string,
                value: secondValue,
                type: this.options.type
            });
            // eslint-disable-next-line max-len
            mPredicate = (mPredicate as Object)[predicate](field, secondOperator.toLowerCase(), secondValue as string, !matchCase, ignoreAccent);
        }
        const args: Object = {
            action: 'filtering', filterCollection: fColl, field: this.options.field,
            ejpredicate: mPredicate, actualPredicate: fColl
        };
        if (this.isForeignColumn(col)) {
            this.foreignKeyFilter(args, fColl, mPredicate);
        } else {
            this.options.handler(args);
        }
    }
    // eslint-disable-next-line max-len
    private renderOperatorUI(column: string, table: HTMLElement, elementID: string, predicates: PredicateModel[], isFirst?: boolean): { fieldElement: HTMLElement, operator: string } {

        const fieldElement: HTMLElement = this.parent.createElement('tr', { className: 'e-xlfl-fields' });
        table.appendChild(fieldElement);

        const xlfloptr: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-optr' });
        fieldElement.appendChild(xlfloptr);

        const optrDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-optrdiv' });

        const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        const optrInput: HTMLElement = this.parent
            .createElement('input', { id: isComplex ? complexFieldName + elementID : column + elementID });

        optrDiv.appendChild(optrInput);
        xlfloptr.appendChild(optrDiv);
        const optr: string = this.options.type + 'Operator';
        const dropDatasource: { [key: string]: Object }[] = this.customFilterOperators[optr];
        this.optrData = dropDatasource;
        let selectedValue: string = this.dropSelectedVal(this.options.column as Column, predicates, isFirst);

        //Trailing three dots are sliced.
        let menuText: string = '';
        if (this.menuItem) {
            menuText = this.menuItem.text.slice(0, -3);
            if (menuText !== this.getLocalizedLabel('CustomFilter')) {
                selectedValue = isFirst ? menuText : undefined;
            }
            if (menuText === this.getLocalizedLabel('Between')) {
                selectedValue = this.getLocalizedLabel(isFirst ? 'GreaterThanOrEqual' : 'LessThanOrEqual');
            }
        }
        const col: Column = this.options.column as Column;
        const dropOptr: DropDownList = new DropDownList(extend(
            {
                dataSource: dropDatasource,
                fields: { text: 'text', value: 'value' },
                text: selectedValue,
                enableRtl: this.parent.enableRtl
            },
            col.filter.params));
        this.childRefs.push(dropOptr);
        const evt: object = { 'open': this.dropDownOpen.bind(this), 'change': this.dropDownValueChange.bind(this) };
        registerEventHandlers(optrInput.id, [literals.open, literals.change], evt, this);
        dropOptr.addEventListener(literals.open, this.eventHandlers[optrInput.id][literals.open]);
        dropOptr.addEventListener(literals.change, this.eventHandlers[optrInput.id][literals.change]);
        dropOptr.appendTo(optrInput);
        const operator: string = this.getSelectedValue(selectedValue);
        return { fieldElement, operator };
    }

    private removeHandlersFromComponent(component: DropDownList | AutoComplete): void {
        if (component.element.classList.contains('e-dropdownlist')) {
            removeEventHandlers(component, [literals.open, literals.change], this);
        } else if (component.element.classList.contains('e-autocomplete')) {
            removeEventHandlers(component, [events.actionComplete, literals.focus], this);
        }
    }

    private dropDownOpen(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    }

    private dropDownValueChange(args: ChangeEventArgs): void {
        if (args.element.id.includes('-xlfl-frstoptr')) {
            this.firstOperator = args.value.toString();
        } else {
            this.secondOperator = args.value.toString();
        }
    }

    /**
     * @hidden
     * @returns {FilterUI} returns filter UI
     */
    public getFilterUIInfo(): FilterUI {
        return { firstOperator: this.firstOperator, secondOperator: this.secondOperator, field: this.options.field };
    }

    private getSelectedValue(text: string): string {
        const selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('text', 'equal', text));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].value : '';
    }
    private dropSelectedVal(col: Column, predicates: PredicateModel[], isFirst?: boolean): string {
        let operator: string;
        if (predicates && predicates.length > 0) {
            operator = predicates.length === 2 ?
                (isFirst ? predicates[0].operator : predicates[1].operator) :
                (isFirst ? predicates[0].operator : undefined);
        } else if (isFirst && col.type === 'string' && !col.filter.operator) {
            operator = 'startswith';
        } else {
            operator = isFirst ? col.filter.operator || 'equal' : undefined;
        }
        return this.getSelectedText(operator);
    }
    private getSelectedText(operator: string): string {
        const selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('value', 'equal', operator));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
    }

    private renderFilterUI(column: string, dlgConetntEle: Element): void {
        const predicates: PredicateModel[] = this.existingPredicate[column];
        const table: HTMLElement = this.parent.createElement('table', { className: 'e-xlfl-table' });
        dlgConetntEle.appendChild(table);

        const colGroup: HTMLElement = this.parent.createElement(literals.colGroup);
        colGroup.innerHTML = '<col style="width: 50%"></col><col style="width: 50%"></col>';
        table.appendChild(colGroup);

        //Renders first dropdown
        let optr: { fieldElement: HTMLElement, operator: string } = this.renderOperatorUI(column, table, '-xlfl-frstoptr', predicates, true);
        this.firstOperator = optr.operator;

        //Renders first value
        this.renderFlValueUI(column, optr, '-xlfl-frstvalue', predicates, true);

        const predicate: HTMLElement = this.parent.createElement('tr', { className: 'e-xlfl-predicate' });
        table.appendChild(predicate);

        //Renders first radion button
        this.renderRadioButton(column, predicate, predicates);

        //Renders second dropdown
        optr = this.renderOperatorUI(column, table, '-xlfl-secndoptr', predicates, false);
        this.secondOperator = optr.operator;

        //Renders second text box
        this.renderFlValueUI(column, optr, '-xlfl-secndvalue', predicates, false);
    }
    private renderRadioButton(column: string, tr: HTMLElement, predicates: PredicateModel[]): void {

        const td: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-radio', attrs: { 'colSpan': '2' } });
        tr.appendChild(td);

        const radioDiv: HTMLElement = this.parent
            .createElement('div', { className: 'e-xlfl-radiodiv', attrs: { 'style': 'display: inline-block' } });

        const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
        const frstpredicate: HTMLInputElement = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-frstpredicate' : column + 'e-xlfl-frstpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        const secndpredicate: HTMLInputElement = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-secndpredicate' : column + 'e-xlfl-secndpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        //appends into div
        radioDiv.appendChild(frstpredicate);
        radioDiv.appendChild(secndpredicate);
        td.appendChild(radioDiv);

        if (this.options.type === 'string') {
            this.renderMatchCase(column, tr, td, '-xlflmtcase', predicates);
        }

        // Initialize AND RadioButton component.
        const andRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('AND'), name: 'default', checked: true, enableRtl: this.parent.enableRtl });
        this.childRefs.push(andRadio);

        // Initialize OR RadioButton component.
        const orRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('OR'), name: 'default', enableRtl: this.parent.enableRtl });
        this.childRefs.push(orRadio);

        const flValue: string = predicates && predicates.length === 2 ? predicates[1].predicate as string : 'and';
        if (flValue === 'and') {
            andRadio.checked = true;
            orRadio.checked = false;
        } else {
            orRadio.checked = true;
            andRadio.checked = false;
        }

        // Render initialized RadioButton.
        andRadio.appendTo(frstpredicate);
        orRadio.appendTo(secndpredicate);

        andRadio.element.nextElementSibling.classList.add('e-xlfl-radio-and');
        orRadio.element.nextElementSibling.classList.add('e-xlfl-radio-or');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private removeObjects(elements: any[]): void {
        for (const obj of elements) {
            if (obj && !obj.isDestroyed) {
                this.removeHandlersFromComponent(obj);
                obj.destroy();
            }
        }
    }

    // eslint-disable-next-line max-len
    private renderFlValueUI(column: string, optr: { fieldElement: HTMLElement, operator: string }, elementId: string, predicates: PredicateModel[], isFirst?: boolean): void {

        const value: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-value' });
        optr.fieldElement.appendChild(value);

        const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        const valueDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-valuediv' });
        const isFilteredCol: boolean = this.options.filteredColumns.some((col: Column) => { return column === col.field; });
        const fltrPredicates: Object[] = this.options.filteredColumns.filter((col: Column) => col.field === column);
        if (this.options.column.filterTemplate) {
            let data: Object = {};
            const columnObj: Column = this.options.column as Column;
            if (isFilteredCol && elementId) {
                data = this.getExcelFilterData(elementId, data, columnObj, predicates, fltrPredicates);
            }
            const isReactCompiler: boolean = this.parent.isReact && typeof (this.options.column.filterTemplate) !== 'string';
            const tempID: string = this.parent.element.id + columnObj.uid + 'filterTemplate';
            if (isReactCompiler) {
                (this.options.column as Column).getFilterTemplate()(data, this.parent, 'filterTemplate', tempID, null, null, valueDiv);
                this.parent.renderTemplates();
            } else {
                const element: Element[] = (this.options.column as Column).getFilterTemplate()(data, this.parent, 'filterTemplate', tempID);
                appendChildren(valueDiv, element);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((this.parent as any).isAngular ? valueDiv.children[0] : valueDiv.querySelector('input')).id = isComplex ?
                complexFieldName + elementId : column + elementId;
            value.appendChild(valueDiv);
        } else {
            const valueInput: Element = this.parent
                .createElement('input', { id: isComplex ? complexFieldName + elementId : column + elementId });

            valueDiv.appendChild(valueInput);
            value.appendChild(valueDiv);

            let flValue: string | number | Date | boolean;
            let predicate: PredicateModel;
            if (predicates && predicates.length > 0) {
                predicate = predicates.length === 2 ?
                    (isFirst ? predicates[0] : predicates[1]) :
                    (isFirst ? predicates[0] : undefined);

                flValue = (predicate && predicate.operator === optr.operator) ? predicate.value : undefined;
                if (isNullOrUndefined(flValue)) {
                    flValue = undefined;
                }
            }
            const types: Object = {
                'string': this.renderAutoComplete.bind(this),
                'number': this.renderNumericTextBox.bind(this),
                'date': this.renderDate.bind(this),
                'datetime': this.renderDateTime.bind(this)
            };
            types[this.options.type](this.options, column, valueInput, flValue, this.parent.enableRtl);
        }
    }

    private getExcelFilterData(
        elementId?: string, data?: Object, columnObj?: Column,
        predicates?: PredicateModel[], fltrPredicates?: Object[]): Object {
        const predIndex: number = elementId === '-xlfl-frstvalue' ? 0 : 1;
        if (elementId === '-xlfl-frstvalue' || fltrPredicates.length > 1) {
            data = { column: predicates instanceof Array ? predicates[predIndex] : predicates };
            const indx: number = this.options.column.columnData && fltrPredicates.length > 1 ?
                (this.options.column.columnData.length === 1 ? 0 : 1) : predIndex;
            data[this.options.field] = columnObj.foreignKeyValue ? this.options.column.columnData[indx][columnObj.foreignKeyValue] :
                ((<HTMLInputElement>fltrPredicates[indx]) as { value?: string | boolean | Date }).value;
            if (this.options.foreignKeyValue) {
                data[this.options.foreignKeyValue] = this.options.column.columnData[indx][columnObj.foreignKeyValue];
            }
        }
        return data;
    }

    // eslint-disable-next-line max-len
    private renderMatchCase(column: string, tr: HTMLElement, matchCase: HTMLElement, elementId: string, predicates: PredicateModel[]): void {
        const matchCaseDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-matchcasediv', attrs: { 'style': 'display: inline-block' } });

        const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        const matchCaseInput: HTMLInputElement = this.parent.createElement(
            'input',
            { id: isComplex ? complexFieldName + elementId : column + elementId, attrs: { 'type': 'checkbox' } }
        ) as HTMLInputElement;

        matchCaseDiv.appendChild(matchCaseInput);
        matchCase.appendChild(matchCaseDiv);

        const flValue: boolean = predicates && predicates.length > 0 ?
            (predicates && predicates.length === 2 ? predicates[1].matchCase : predicates[0].matchCase) :
            false;

        // Initialize Match Case check box.
        const checkbox: CheckBox = new CheckBox({
            label: this.getLocalizedLabel('MatchCase'),
            enableRtl: this.parent.enableRtl, checked: flValue
        });
        this.childRefs.push(checkbox);

        // Render initialized CheckBox.
        checkbox.appendTo(matchCaseInput);
    }

    // eslint-disable-next-line max-len
    private renderDate(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        const format: string = getCustomDateFormat(options.format, options.type);
        const datePicker: DatePicker = new DatePicker(extend(
            {
                format: format,
                cssClass: 'e-popup-flmenu',
                placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
                width: '100%',
                enableRtl: isRtl,
                value: new Date(fValue as string),
                locale: this.parent.locale
            },
            options.column.filter.params));
        this.childRefs.push(datePicker);
        datePicker.appendTo(inputValue);
    }

    // eslint-disable-next-line max-len
    private renderDateTime(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        const format: string = getCustomDateFormat(options.format, options.type);
        const dateTimePicker: DateTimePicker = new DateTimePicker(extend(
            {
                format: format,
                cssClass: 'e-popup-flmenu',
                placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
                width: '100%',
                enableRtl: isRtl,
                value: new Date(fValue as string),
                locale: this.parent.locale
            },
            options.column.filter.params));
        this.childRefs.push(dateTimePicker);
        dateTimePicker.appendTo(inputValue);
    }

    private completeAction(e: { result: string[] }): void {
        e.result = distinctStringValues(e.result);
    }

    // eslint-disable-next-line max-len
    private renderNumericTextBox(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        const numericTextBox: NumericTextBox = new NumericTextBox(extend(
            {
                format: options.format as string,
                placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
                enableRtl: isRtl,
                value: fValue as number,
                locale: this.parent.locale
            },
            options.column.filter.params));
        this.childRefs.push(numericTextBox);
        numericTextBox.appendTo(inputValue);
    }

    // eslint-disable-next-line max-len
    private renderAutoComplete(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        const colObj: Column = this.options.column as Column;
        const isForeignColumn: boolean = this.isForeignColumn(colObj);
        const dataSource: Object = isForeignColumn ? colObj.dataSource : options.dataSource;
        const fields: Object = { value: isForeignColumn ? colObj.foreignKeyValue : column };
        const actObj: AutoComplete = new AutoComplete(extend(
            {
                dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource as object),
                fields: fields,
                query: this.getQuery(),
                sortOrder: 'Ascending',
                locale: this.parent.locale,
                cssClass: 'e-popup-flmenu',
                autofill: true,
                placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
                enableRtl: isRtl,
                text: fValue as string
            },
            colObj.filter.params));
        if (dataSource && 'result' in dataSource) {
            const defObj: FilterStateObj = eventPromise({ requestType: 'stringfilterrequest' }, this.getQuery());
            this.parent.trigger(events.dataStateChange, defObj.state);
            const def: Deferred = defObj.deffered;
            def.promise.then((e: Object[]) => {
                actObj.dataSource = new DataManager(e);
            });
        }
        this.childRefs.push(actObj);
        const evt: object = { 'actionComplete': this.acActionComplete(actObj, column), 'focus': this.acFocus(actObj, column, options, inputValue) };
        registerEventHandlers(inputValue.id, [events.actionComplete, literals.focus], evt, this);
        actObj.addEventListener(literals.focus, this.eventHandlers[inputValue.id][literals.focus]);
        actObj.addEventListener(events.actionComplete, this.eventHandlers[inputValue.id][events.actionComplete]);
        actObj.appendTo(inputValue);
    }

    private acActionComplete(actObj: AutoComplete, column: string): Function {
        return (e: { result: { [key: string]: Object; }[] }) => {
            const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
            e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                return arr.map((mapObject: Object) => {
                    return isComplex ? performComplexDataOperation(actObj.fields.value, mapObject)
                        : mapObject[actObj.fields.value];
                }).indexOf(isComplex ? performComplexDataOperation(actObj.fields.value, obj) :
                    obj[actObj.fields.value]) === index;
            });
        };
    }

    private acFocus(actObj: AutoComplete, column: string, options: IFilterArgs, inputValue: HTMLElement): Function {
        return () => {
            const isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
            const complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
            const columnvalue: string = isComplex ? complexFieldName : column;
            actObj.filterType = ((<EJ2Intance>this.dlgDiv.querySelector('#' + columnvalue +
                (inputValue.id === (columnvalue + '-xlfl-frstvalue') ?
                    '-xlfl-frstoptr' :
                    '-xlfl-secndoptr')
            )).ej2_instances[0] as DropDownList).value as 'Contains';
            actObj.ignoreCase = options.type === 'string' ?
                !((<EJ2Intance>this.dlgDiv.querySelector('#' + columnvalue + '-xlflmtcase')).ej2_instances[0] as CheckBox).checked :
                true;
            actObj.filterType = !isNullOrUndefined(actObj.filterType) ? actObj.filterType :
                'equal' as 'StartsWith' | 'Contains' | 'EndsWith';
        };
    }
}
