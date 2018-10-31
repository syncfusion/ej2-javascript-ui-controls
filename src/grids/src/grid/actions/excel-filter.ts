import { EventHandler, remove, Browser } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { parentsUntil, isActionPrevent, appendChildren } from '../base/util';
import { IGrid, IFilterArgs, EJ2Intance } from '../base/interface';
import * as events from '../base/constant';
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { ServiceLocator } from '../services/service-locator';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { isNullOrUndefined, L10n, } from '@syncfusion/ej2-base';
import { PredicateModel } from '../base/grid-model';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { DropDownList, AutoComplete } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { RadioButton, CheckBox } from '@syncfusion/ej2-buttons';
import { distinctStringValues, isComplexField, getComplexFieldID, getCustomDateFormat } from '../base/util';
import { Column } from '../models/column';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { OffsetPosition } from '@syncfusion/ej2-popups';
/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilter extends CheckBoxFilter {
    //Internal variables            
    private datePicker: DatePicker;
    private dateTimePicker: DateTimePicker;
    private actObj: AutoComplete;
    private numericTxtObj: NumericTextBox;
    private dlgDiv: HTMLElement;
    private l10n: L10n;
    private dlgObj: Dialog;
    private menuEle: HTMLUListElement;
    private customFilterOperators: Object;
    private dropOptr: DropDownList;
    private optrData: Object;
    private menuItem: MenuItemModel;
    private menu: Element;
    private cmenu: HTMLUListElement;
    protected menuObj: ContextMenu;
    private isCMenuOpen: boolean;

    /**
     * Constructor for excel filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object) {
        super(parent, filterSettings, serviceLocator);
        this.customFilterOperators = customFltrOperators;
        this.isExcel = true;
    }

    private getCMenuDS(type: string, operator?: string): MenuItemModel[] {
        let options: { number?: string[], date?: string[], string?: string[], datetime?: string[] } = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter'],
        };
        options.date = options.number;
        options.datetime = options.number;
        let model: MenuItemModel[] = [];
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
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        if (this.dlg) {
            this.unwireExEvents();
            super.destroy();
        }
        if (this.cmenu && this.cmenu.parentElement) {
            remove(this.cmenu);
        }
    }

    private createMenu(type: string, isFiltered: boolean, isCheckIcon: boolean): void {
        let options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateTimeFilter', number: 'NumberFilter' };
        this.menu = this.parent.createElement('div', { className: 'e-contextmenu-wrapper' });
        if (this.parent.enableRtl) {
            this.menu.classList.add('e-rtl');
        } else {
            this.menu.classList.remove('e-rtl');
        }
        let ul: Element = this.parent.createElement('ul');
        let icon: string = isFiltered ? 'e-excl-filter-icon e-filtered' : 'e-excl-filter-icon';
        ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(
                this.getLocalizedLabel(options[type]), 'e-submenu',
                isCheckIcon && this.ensureTextFilter() ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
    }

    private createMenuElem(val: string, className?: string, iconName?: string, isSubMenu?: boolean): Element {
        let li: Element = this.parent.createElement('li', { className: className + ' e-menu-item' });
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
        let menuItem: HTMLElement = parentsUntil(e.target as Element, 'e-menu-item') as HTMLElement;
        if (menuItem && this.getLocalizedLabel('ClearFilter') === menuItem.innerText.trim()) {
            this.clearFilter();
            this.closeDialog();
        }
    }


    private destroyCMenu(): void {
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
            remove(this.cmenu);
        }
    }
    private hoverHandler(e: MouseEvent): void {
        let target: Element = (e.target as Element).querySelector('.e-contextmenu');
        let li: Element = parentsUntil(e.target as Element, 'e-menu-item');
        let focused: Element = this.menu.querySelector('.e-focused');
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
            let submenu: Element = this.menu.querySelector('.e-submenu');
            if (!isNullOrUndefined(submenu)) {
                submenu.classList.remove('e-selected');
            }
            this.isCMenuOpen = false;
            this.destroyCMenu();
        }
        let selectedMenu: string = this.ensureTextFilter();
        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            let menuOptions: ContextMenuModel = {
                items: this.getCMenuDS(this.options.type, selectedMenu ? selectedMenu.replace(/\s/g, '') : undefined),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this),
                enableRtl: this.parent.enableRtl,
                beforeClose: this.preventClose
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            let client: ClientRect = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            let pos: OffsetPosition = { top: 0, left: 0 };
            if (Browser.isDevice) {
                let contextRect: ClientRect = this.getContextBounds(this.menuObj);
                pos.top = (window.innerHeight - contextRect.height) / 2;
                pos.left = (window.innerWidth - contextRect.width) / 2;
                this.closeDialog();
            } else {
                pos.top = client.top;
                pos.left = this.getCMenuYPosition(this.dlg, this.menuObj);
            }
            this.menuObj.open(pos.top, pos.left, e.target as HTMLElement);
        }
    }

    private ensureTextFilter(): string {
        let selectedMenu: string;
        let predicates: PredicateModel[] = this.existingPredicate[this.options.field];
        if (predicates && predicates.length === 2) {
            if (predicates[0].operator === 'greaterThanOrEqual' && predicates[1].operator === 'lessThanOrEqual') {
                selectedMenu = 'Between';
            } else {
                selectedMenu = 'CustomFilter';
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
        if (args.event instanceof MouseEvent && (<Element>args.event.target).classList.contains('e-submenu')) {
            args.cancel = true;
        }
    }

    private getContextBounds(context: ContextMenu): ClientRect {
        let elementVisible: string = this.menuObj.element.style.display;
        this.menuObj.element.style.display = 'block';
        return this.menuObj.element.getBoundingClientRect();
    }
    private getCMenuYPosition(target: Element, context: ContextMenu): number {
        let contextWidth: number = this.getContextBounds(context).width;
        let targetPosition: ClientRect = target.getBoundingClientRect();
        let leftPos: number = targetPosition.right + contextWidth - this.parent.element.clientWidth;
        return (leftPos < 1) ? (targetPosition.right + 1) : (targetPosition.left - contextWidth - 1);
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
        this.dialogObj.dataBind();
        let filterLength: number = (this.existingPredicate[options.field] && this.existingPredicate[options.field].length) ||
            this.options.filteredColumns.filter((col: Predicate) => {
                return this.options.field === col.field;
            }).length;
        this.createMenu(options.type, filterLength > 0, (filterLength === 1 || filterLength === 2));
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        this.dlg.classList.remove('e-checkboxfilter');
        this.cmenu = this.parent.createElement('ul', { className: 'e-excel-menu' }) as HTMLUListElement;
        this.wireExEvents();
    }

    public closeDialog(): void {
        super.closeDialog();
    }

    private selectHandler(e: MenuEventArgs): void {
        if (e.item) {
            this.menuItem = e.item;
            this.renderDialogue(e);
        }
    }
    private renderDialogue(e: MenuEventArgs): void {
        let target: HTMLElement = e.element as HTMLElement;
        let column: string = this.options.field;
        let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
        let mainDiv: HTMLElement = this.parent.createElement('div', {
            className: 'e-xlfl-maindiv',
            id: isComplex ? complexFieldName + '-xlflmenu' : column + '-xlflmenu'
        });
        this.dlgDiv = this.parent.createElement('div', {
            className: 'e-xlflmenu',
            id: isComplex ? complexFieldName + '-xlfldlg' : column + '-xlfldlg'
        });
        this.parent.element.appendChild(this.dlgDiv);
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
                let row: HTMLTableRowElement = this.dlgObj.element.querySelector('table.e-xlfl-table>tr') as HTMLTableRowElement;
                if (this.options.column.filterTemplate) {
                    (row.querySelector('#' + this.options.column.field + '-xlfl-frstvalue') as HTMLElement).focus();
                } else { (row.cells[1].querySelector('input:not([type=hidden])') as HTMLElement).focus(); }
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
            animationSettings: { effect: 'None' },
        });
        this.dlgObj.appendTo(this.dlgDiv);
    }
    private removeDialog(): void {
        this.removeObjects([this.dropOptr, this.datePicker, this.dateTimePicker, this.actObj, this.numericTxtObj, this.dlgObj]);
        remove(this.dlgDiv);
    }

    private createdDialog(target: Element, column: string): void {
        this.renderCustomFilter(target, column);
        this.dlgObj.element.style.left = '0px';
        this.dlgObj.element.style.top = '0px';
        if (Browser.isDevice && window.innerWidth < 440) {
            this.dlgObj.element.style.width = '90%';
        }
        this.dlgObj.show();
    }
    private renderCustomFilter(target: Element, column: string): void {
        let dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-xlfl-maindiv');

        /* tslint:disable-next-line:max-line-length */
        let dlgFields: HTMLElement = this.parent.createElement('div', { innerHTML: this.getLocalizedLabel('ShowRowsWhere'), className: 'e-xlfl-dlgfields' });
        dlgConetntEle.appendChild(dlgFields);

        //column name
        let fieldSet: HTMLElement = this.parent.createElement('div', { innerHTML: this.options.displayName, className: 'e-xlfl-fieldset' });
        dlgConetntEle.appendChild(fieldSet);

        this.renderFilterUI(column, dlgConetntEle);
    }
    private filterBtnClick(col: string): void {
        let isComplex: boolean = !isNullOrUndefined(col) && isComplexField(col);
        let complexFieldName: string = !isNullOrUndefined(col) && getComplexFieldID(col);
        let colValue: string = isComplex ? complexFieldName : col;
        let fValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstvalue')).ej2_instances[0];
        let fOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-frstoptr')).ej2_instances[0];
        let sValue: NumericTextBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndvalue')).ej2_instances[0];
        let sOperator: DropDownList = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlfl-secndoptr')).ej2_instances[0];
        let checkBoxValue: boolean;
        if (this.options.type === 'string') {
            let checkBox: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + '-xlflmtcase')).ej2_instances[0];
            checkBoxValue = checkBox.checked;
        }
        let andRadio: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + 'e-xlfl-frstpredicate')).ej2_instances[0];
        let orRadio: CheckBox = (<EJ2Intance>this.dlgDiv.querySelector('#' + colValue + 'e-xlfl-secndpredicate')).ej2_instances[0];
        let predicate: string = (andRadio.checked ? 'and' : 'or');
        if (sValue.value === null) {
            predicate = 'or';
        }
        this.filterByColumn(
            this.options.field, fOperator.value as string, fValue.value, predicate,
            checkBoxValue, this.parent.filterSettings.ignoreAccent, sOperator.value as string, sValue.value);
        this.removeDialog();
    }
    /**
     * Filters grid row by column name with given options.
     * @param {string} fieldName - Defines the field name of the filter column.
     * @param {string} firstOperator - Defines the first operator by how to filter records.
     * @param {string | number | Date | boolean} firstValue - Defines the first value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param {boolean} matchCase - If ignore case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param {boolean} ignoreAccent - If ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @param {string} secondOperator - Defines the second operator by how to filter records.
     * @param {string | number | Date | boolean} secondValue - Defines the first value which is used to filter records.
     */
    private filterByColumn(
        fieldName: string, firstOperator: string, firstValue: string | number | Date | boolean, predicate?: string,
        matchCase?: boolean, ignoreAccent?: boolean, secondOperator?: string, secondValue?: string | number | Date | boolean): void {
        let col: Column = this.parent.getColumnByField(fieldName);
        let field: string = col.isForeignColumn() ? col.foreignKeyValue : fieldName;
        let fColl: PredicateModel[] = [];
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
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, {
                instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: firstOperator, arg3: firstValue, arg4: predicate,
                arg5: matchCase, arg6: ignoreAccent, arg7: secondOperator, arg8: secondValue
            });
            return;
        }
        mPredicate = new Predicate(field, firstOperator.toLowerCase(), firstValue, !matchCase, ignoreAccent);
        if (secondValue) {
            secondOperator = !isNullOrUndefined(secondOperator) ? secondOperator as string : 'equal';
            fColl.push({
                field: field,
                predicate: predicate,
                matchCase: matchCase,
                ignoreAccent: ignoreAccent,
                operator: secondOperator as string,
                value: secondValue,
                type: this.options.type
            });
            /* tslint:disable-next-line:max-line-length */
            mPredicate = (mPredicate as Object)[predicate](field, secondOperator.toLowerCase(), secondValue as string, !matchCase, ignoreAccent);
        }
        let args: Object = {
            action: 'filtering', filterCollection: fColl, field: this.options.field,
            ejpredicate: mPredicate, actualPredicate: fColl
        };
        if (col.isForeignColumn()) {
            this.foreignKeyFilter(args, fColl, mPredicate);
        } else {
            this.options.handler(args);
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private renderOperatorUI(column: string, table: HTMLElement, elementID: string, predicates: PredicateModel[], isFirst?: boolean): { fieldElement: HTMLElement, operator: string } {

        let fieldElement: HTMLElement = this.parent.createElement('tr', { className: 'e-xlfl-fields' });
        table.appendChild(fieldElement);

        let xlfloptr: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-optr' });
        fieldElement.appendChild(xlfloptr);

        let optrDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-optrdiv' });

        let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        let optrInput: HTMLElement = this.parent
            .createElement('input', { id: isComplex ? complexFieldName + elementID : column + elementID });

        optrDiv.appendChild(optrInput);
        xlfloptr.appendChild(optrDiv);
        let optr: string = this.options.type + 'Operator';
        let dropDatasource: { [key: string]: Object }[] = this.customFilterOperators[optr];
        this.optrData = dropDatasource;
        let selectedValue: string = this.dropSelectedVal(column, predicates, isFirst);

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

        this.dropOptr = new DropDownList({
            dataSource: dropDatasource,
            fields: { text: 'text', value: 'value' },
            text: selectedValue,
            open: this.dropDownOpen.bind(this),
            enableRtl: this.parent.enableRtl
        });
        this.dropOptr.appendTo(optrInput);
        let operator: string = this.getSelectedValue(selectedValue);
        return { fieldElement, operator };
    }
    private dropDownOpen(args: { popup: Popup }): void {
        args.popup.element.style.zIndex = (this.dialogObj.zIndex + 1).toString();
    }
    private getSelectedValue(text: string): string {
        let selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('text', 'equal', text));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].value : '';
    }
    private dropSelectedVal(col: string, predicates: PredicateModel[], isFirst?: boolean): string {
        let operator: string;
        if (predicates && predicates.length > 0) {
            operator = predicates.length === 2 ?
                (isFirst ? predicates[0].operator : predicates[1].operator) :
                (isFirst ? predicates[0].operator : undefined);
        } else {
            operator = isFirst ? 'equal' : undefined;
        }
        return this.getSelectedText(operator);
    }
    private getSelectedText(operator: string): string {
        let selectedField: Object = new DataManager(this.optrData).executeLocal(
            new Query().where('value', 'equal', operator));
        return !isNullOrUndefined(selectedField[0]) ? selectedField[0].text : '';
    }

    private renderFilterUI(column: string, dlgConetntEle: Element): void {
        let predicates: PredicateModel[] = this.existingPredicate[column];
        let table: HTMLElement = this.parent.createElement('table', { className: 'e-xlfl-table' });
        dlgConetntEle.appendChild(table);

        let colGroup: HTMLElement = this.parent.createElement('colGroup');
        colGroup.innerHTML = '<col style="width: 50%"></col><col style="width: 50%"></col>';
        table.appendChild(colGroup);

        //Renders first dropdown
        /* tslint:disable-next-line:max-line-length */
        let optr: { fieldElement: HTMLElement, operator: string } = this.renderOperatorUI(column, table, '-xlfl-frstoptr', predicates, true);

        //Renders first value
        this.renderFlValueUI(column, optr, '-xlfl-frstvalue', predicates, true);

        let predicate: HTMLElement = this.parent.createElement('tr', { className: 'e-xlfl-predicate' });
        table.appendChild(predicate);

        //Renders first radion button
        this.renderRadioButton(column, predicate, predicates);

        //Renders second dropdown
        optr = this.renderOperatorUI(column, table, '-xlfl-secndoptr', predicates, false);
        //Renders second text box
        this.renderFlValueUI(column, optr, '-xlfl-secndvalue', predicates, false);
    }
    private renderRadioButton(column: string, tr: HTMLElement, predicates: PredicateModel[]): void {

        let td: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-radio', attrs: { 'colSpan': '2' } });
        tr.appendChild(td);

        let radioDiv: HTMLElement = this.parent
            .createElement('div', { className: 'e-xlfl-radiodiv', attrs: { 'style': 'display: inline-block' } });

        let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
        /* tslint:disable-next-line:max-line-length */
        let frstpredicate: HTMLInputElement = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-frstpredicate' : column + 'e-xlfl-frstpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        /* tslint:disable-next-line:max-line-length */
        let secndpredicate: HTMLInputElement = this.parent.createElement('input', { id: isComplex ? complexFieldName + 'e-xlfl-secndpredicate' : column + 'e-xlfl-secndpredicate', attrs: { 'type': 'radio' } }) as HTMLInputElement;

        //appends into div
        radioDiv.appendChild(frstpredicate);
        radioDiv.appendChild(secndpredicate);
        td.appendChild(radioDiv);

        if (this.options.type === 'string') {
            this.renderMatchCase(column, tr, td, '-xlflmtcase', predicates);
        }

        // Initialize AND RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        let andRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('AND'), name: 'default', cssClass: 'e-xlfl-radio-and', checked: true, enableRtl: this.parent.enableRtl });

        // Initialize OR RadioButton component.
        /* tslint:disable-next-line:max-line-length */
        let orRadio: RadioButton = new RadioButton({ label: this.getLocalizedLabel('OR'), name: 'default', cssClass: 'e-xlfl-radio-or', enableRtl: this.parent.enableRtl });

        let flValue: string = predicates && predicates.length === 2 ? predicates[1].predicate as string : 'and';
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
    }
    /* tslint:disable-next-line:no-any */
    private removeObjects(elements: any[]): void {
        for (let obj of elements) {
            if (obj && !obj.isDestroyed) {
                obj.destroy();
            }
        }
    }

    /* tslint:disable-next-line:max-line-length */
    private renderFlValueUI(column: string, optr: { fieldElement: HTMLElement, operator: string }, elementId: string, predicates: PredicateModel[], isFirst?: boolean): void {

        let value: HTMLElement = this.parent.createElement('td', { className: 'e-xlfl-value' });
        optr.fieldElement.appendChild(value);

        let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        let valueDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-valuediv' });
        let isFilteredCol: boolean = this.filterSettings.columns.some((col: Column) => { return column === col.field; });
        let fltrPredicates: Object[] = this.options.filteredColumns.filter((col: Column) => col.field === column);
        if (this.options.column.filterTemplate) {
            let data: Object = {};
            let columnObj: Column = this.parent.getColumnByField(column);
            if (isFilteredCol && elementId === '-xlfl-frstvalue') {
                data = { column: predicates instanceof Array ? predicates[0] : predicates };
                let indx: number = this.options.column.columnData && fltrPredicates.length > 1 ?
                    (this.options.column.columnData.length === 1 ? 0 : 1) : 0;
                data[this.options.field] = columnObj.foreignKeyValue ? this.options.column.columnData[indx][columnObj.foreignKeyValue] :
                    ((<HTMLInputElement>fltrPredicates[indx]) as { value?: string | boolean | Date }).value;
                if (this.options.foreignKeyValue) {
                    data[this.options.foreignKeyValue] = this.options.column.columnData[indx][columnObj.foreignKeyValue];
                }
            }
            let element: Element[] = this.options.column.getFilterTemplate()(data, this.parent, 'filterTemplate');
            appendChildren(valueDiv, element);
            valueDiv.children[0].id = isComplex ? complexFieldName + elementId : column + elementId;
            value.appendChild(valueDiv);
        } else {
            let valueInput: Element = this.parent
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
            }
            let types: Object = {
                'string': this.renderAutoComplete.bind(this),
                'number': this.renderNumericTextBox.bind(this),
                'date': this.renderDate.bind(this),
                'datetime': this.renderDateTime.bind(this)
            };
            types[this.options.type](this.options, column, valueInput, flValue, this.parent.enableRtl);
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private renderMatchCase(column: string, tr: HTMLElement, matchCase: HTMLElement, elementId: string, predicates: PredicateModel[]): void {

        /* tslint:disable-next-line:max-line-length */
        let matchCaseDiv: HTMLElement = this.parent.createElement('div', { className: 'e-xlfl-matchcasediv', attrs: { 'style': 'display: inline-block' } });

        let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
        let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);

        let matchCaseInput: HTMLInputElement = this.parent.createElement(
            'input',
            { id: isComplex ? complexFieldName + elementId : column + elementId, attrs: { 'type': 'checkbox' } }
        ) as HTMLInputElement;

        matchCaseDiv.appendChild(matchCaseInput);
        matchCase.appendChild(matchCaseDiv);

        let flValue: boolean = predicates && predicates.length > 0 ?
            (predicates && predicates.length === 2 ? predicates[1].matchCase : predicates[0].matchCase) :
            false;

        // Initialize Match Case check box.
        let checkbox: CheckBox = new CheckBox({
            label: this.getLocalizedLabel('MatchCase'),
            enableRtl: this.parent.enableRtl, checked: flValue
        });

        // Render initialized CheckBox.
        checkbox.appendTo(matchCaseInput);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderDate(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        let format: string = getCustomDateFormat(options.format, options.type);
        this.datePicker = new DatePicker({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
            width: '100%',
            enableRtl: isRtl,
            value: new Date(fValue as string),
        });
        this.datePicker.appendTo(inputValue);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderDateTime(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        let format: string = getCustomDateFormat(options.format, options.type);
        this.dateTimePicker = new DateTimePicker({
            format: format,
            cssClass: 'e-popup-flmenu',
            placeholder: this.getLocalizedLabel('CustomFilterDatePlaceHolder'),
            width: '100%',
            enableRtl: isRtl,
            value: new Date(fValue as string),
        });
        this.dateTimePicker.appendTo(inputValue);
    }

    private completeAction(e: { result: string[] }): void {
        e.result = distinctStringValues(e.result);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderNumericTextBox(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        this.numericTxtObj = new NumericTextBox({
            format: options.format as string,
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            value: fValue as number
        });
        this.numericTxtObj.appendTo(inputValue);
    }

    /* tslint:disable-next-line:max-line-length */
    private renderAutoComplete(options: IFilterArgs, column: string, inputValue: HTMLElement, fValue: string | number | Date | boolean, isRtl: boolean): void {
        let colObj: Column = this.parent.getColumnByField(column);
        let isForeignColumn: boolean = colObj.isForeignColumn();
        let dataSource: Object = isForeignColumn ? colObj.dataSource : options.dataSource;
        let fields: Object = { value: isForeignColumn ? colObj.foreignKeyValue : column };
        let actObj: AutoComplete = new AutoComplete({
            dataSource: dataSource instanceof DataManager ? dataSource : new DataManager(dataSource as object),
            fields: fields,
            query: this.parent.query.clone(),
            sortOrder: 'Ascending',
            locale: this.parent.locale,
            autofill: true,
            focus: () => {
                let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
                let complexFieldName: string = !isNullOrUndefined(column) && getComplexFieldID(column);
                let columnvalue: string = isComplex ? complexFieldName : column;
                actObj.filterType = ((<EJ2Intance>this.dlgDiv.querySelector('#' + columnvalue +
                    (inputValue.id === (columnvalue + '-xlfl-frstvalue') ?
                        '-xlfl-frstoptr' :
                        '-xlfl-secndoptr')
                )).ej2_instances[0] as DropDownList).value as 'StartsWith' | 'Contains' | 'EndsWith';
                actObj.ignoreCase = options.type === 'string' ?
                    !((<EJ2Intance>this.dlgDiv.querySelector('#' + columnvalue + '-xlflmtcase')).ej2_instances[0] as CheckBox).checked :
                    true;
                actObj.filterType = !isNullOrUndefined(actObj.filterType) ? actObj.filterType :
                    'equal' as 'StartsWith' | 'Contains' | 'EndsWith';
            },
            placeholder: this.getLocalizedLabel('CustomFilterPlaceHolder'),
            enableRtl: isRtl,
            actionComplete: (e: { result: { [key: string]: Object; }[] }) => {
                let isComplex: boolean = !isNullOrUndefined(column) && isComplexField(column);
                e.result = e.result.filter((obj: { [key: string]: Object; }, index: number, arr: { [key: string]: Object; }[]) => {
                    return arr.map((mapObject: Object) => {
                        return isComplex ? this.performComplexDataOperation(actObj.fields.value, mapObject)
                            : mapObject[actObj.fields.value];
                    }).indexOf(isComplex ? this.performComplexDataOperation(actObj.fields.value, obj) :
                        obj[this.actObj.fields.value]) === index;
                });
            },
            value: fValue as string
        });
        actObj.appendTo(inputValue);
        this.actObj = actObj;
    }

    private performComplexDataOperation(value: string, mapObject: Object): Object | string {
        let returnObj: Object | string;
        let length: number = value.split('.').length;
        let splits: string[] = value.split('.');
        let duplicateMap: Object | string = mapObject;
        for (let i: number = 0; i < length; i++) {
            returnObj = duplicateMap[splits[i]];
            duplicateMap = returnObj;
        }
        return returnObj;
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }

}
