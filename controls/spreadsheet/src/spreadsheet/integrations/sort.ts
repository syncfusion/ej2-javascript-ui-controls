import { Spreadsheet, ICellRenderer, initiateCustomSort, locale, dialog, getFilterRange, DialogBeforeOpenEventArgs, refreshFilterRange } from '../index';
import { applySort, completeAction, focus, FilterInfoArgs, getUpdateUsingRaf, isDiscontinuousRange } from '../index';
import { sortComplete, beforeSort, getFormattedCellObject, sortImport, workbookFormulaOperation, isImported } from '../../workbook/index';
import { getIndexesFromAddress, getSwapRange, SheetModel, getCell, inRange, SortCollectionModel, getSheet, getSheetIndex } from '../../workbook/index';
import { getColumnHeaderText, CellModel, getRangeAddress, initiateSort, beginAction, NumberFormatArgs } from '../../workbook/index';
import { SortEventArgs, BeforeSortEventArgs, SortOptions, applyCF, ApplyCFArgs, getRangeIndexes } from '../../workbook/common/index';
import { L10n, getUniqueID, getComponent, enableRipple, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { DropDownList, ChangeEventArgs as DropdownChangeEventArgs, FieldSettingsModel } from '@syncfusion/ej2-dropdowns';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { RadioButton, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs, ChangeArgs } from '@syncfusion/ej2-buttons';
import { ListView } from '@syncfusion/ej2-lists';

/**
 * `Sort` module is used to handle the sort action in Spreadsheet.
 */
export class Sort {
    private parent: Spreadsheet;

    /**
     * Constructor for sort module.
     *
     * @param {Spreadsheet} parent - Specifies the Spreadsheet instance.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module.
     *
     * @returns {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(applySort, this.applySortHandler, this);
        this.parent.on(sortComplete, this.sortCompleteHandler, this);
        this.parent.on(initiateCustomSort, this.initiateCustomSortHandler, this);
        this.parent.on(sortImport, this.sortImport, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applySort, this.applySortHandler);
            this.parent.off(sortComplete, this.sortCompleteHandler);
            this.parent.off(initiateCustomSort, this.initiateCustomSortHandler);
            this.parent.off(sortImport, this.sortImport);
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'sort';
    }

    /**
     * Validates the range and returns false when invalid.
     *
     * @returns {boolean} - Validates the range and returns false when invalid.
     */
    private isValidSortRange(): boolean {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        if (range[0] > sheet.usedRange.rowIndex || range[1] > sheet.usedRange.colIndex) {
            return false;
        }
        return true;
    }

    /**
     * sort while importing.
     *
     * @param {any} args - Specifies the args
     * @param {number} args.sheetIdx - Specifies the sheet index
     * @returns {void}
     */
    private sortImport(args ?: { sheetIdx: number}): void {
        const sort: SortCollectionModel[] = this.parent.sortCollection; let cell: HTMLElement;
        const rowId: number = this.parent.getActiveSheet().usedRange.rowIndex - 1;
        const sheetIdx: number = args ? args.sheetIdx : this.parent.activeSheetIndex;
        for (let j : number = 0; j < sort.length; j++) {
            if (sort[j as number].sheetIndex === sheetIdx) {
                for (let i: number = 0; i < rowId; i++) {
                    cell = this.parent.getCell(i, sort[j as number].columnIndex);
                    if (cell && cell.querySelector('.e-filter-icon')) {
                        if (sort[j as number].order === 'Ascending' || sort[j as number].order === 'OnTop') {
                            if (!cell.querySelector('.e-filter-icon').classList.contains('e-sortasc-filter')) {
                                cell.querySelector('.e-filter-icon').classList.add('e-sortasc-filter');
                            }
                        } else {
                            if (!cell.querySelector('.e-filter-icon').classList.contains('e-sortdesc-filter')) {
                                cell.querySelector('.e-filter-icon').classList.add('e-sortdesc-filter');
                            }
                        }
                        return;
                    }
                }
            }
        }
    }

    /**
     * Shows the range error alert dialog.
     *
     * @param {object} args - specify the args
     * @param {string} args.error - range error string.
     * @returns {void}
     */
    private sortRangeAlertHandler(args: { error: string }): void {
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        dialogInst.show({
            height: 180, width: 400, isModal: true, showCloseIcon: true,
            content: args.error,
            beforeOpen: (openArgs: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: args.error === l10n.getConstant('MultiRangeSortError') ? 'MultiRangeSortDialog' : 'SortRangeDialog',
                    content: args.error,
                    element: openArgs.element, target: openArgs.target, cancel: openArgs.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    openArgs.cancel = true;
                } else {
                    focus(this.parent.element);
                }
                dialogInst.dialogInstance.content = dlgArgs.content;
            }
        });
        this.parent.hideSpinner();
    }

    /**
     * Initiates the custom sort dialog.
     *
     * @returns {void}
     */
    private initiateCustomSortHandler(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (!this.isValidSortRange() || sheet.rows.length === 0) {
            this.sortRangeAlertHandler({ error: l10n.getConstant('SortOutOfRangeError') });
            return;
        }
        if (isDiscontinuousRange(sheet.selectedRange)) {
            this.sortRangeAlertHandler({ error: l10n.getConstant('MultiRangeSortError') });
            return;
        }
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let sortOptions: SortOptions;
        dialogInst.show({
            height: 400, width: 560, isModal: true, showCloseIcon: true, cssClass: 'e-customsort-dlg',
            header: l10n.getConstant('CustomSort'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'CustomSortDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.customSortContent(); dialogInst.dialogInstance.dataBind();
                focus(this.parent.element);
            },
            buttons: [{
                buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true },
                click: (): void => {
                    const element: HTMLElement = dialogInst.dialogInstance.content as HTMLElement;
                    const listview: ListView = getComponent(
                        element.getElementsByClassName('e-list-sort e-listview e-lib')[0] as HTMLElement, 'listview') as ListView;
                    const data: { [key: string]: string }[] = listview.dataSource as { [key: string]: string }[];
                    this.clearError();
                    const errorElem: HTMLElement = element.getElementsByClassName('e-sort-error')[0] as HTMLElement;
                    errorElem.style.display = 'block';
                    if (!this.validateError(data, element, errorElem)) {
                        sortOptions = { sortDescriptors: data, containsHeader:
                            (element.getElementsByClassName('e-sort-checkheader')[0] as HTMLInputElement).checked,
                        caseSensitive: (element.getElementsByClassName('e-sort-checkcase')[0] as HTMLInputElement).checked };
                        dialogInst.hide();
                    }
                }
            }],
            close: (): void => {
                if (sortOptions) { getUpdateUsingRaf((): void => this.applySortHandler({ sortOptions: sortOptions })); }
            }
        });
    }

    /**
     * Validates the errors of the sort criteria and displays the error.
     *
     * @param {Object} json - listview datasource.
     * @param {HTMLElement} dialogElem - dialog content element.
     * @param {HTMLElement} errorElem - element to display error.
     * @returns {boolean} - Return boolean value.
     */
    private validateError(json: { [key: string]: string }[], dialogElem: HTMLElement, errorElem: HTMLElement): boolean {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const hasEmpty: boolean = json.some((element: { [key: string]: string }) => element.field.toString() === '');
        if (hasEmpty) {
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown: HTMLElement) => {
                const hasError: boolean = !(<DropDownList>getComponent(dropDown, 'dropdownlist')).value;
                if (hasError) {
                    dropDown.parentElement.classList.add('e-error');
                }
                return hasError; //breaks the loop if only one error added.
            });
            errorElem.innerText = l10n.getConstant('SortEmptyFieldError');
            return true;
        }
        const temp: Set<string> = new Set();
        let duplicateField: string = '';
        const hasDuplicate: boolean = json.some((element: { [key: string]: string }) => {
            duplicateField = element.field.toString();
            return temp.size === temp.add(element.field).size;
        });
        let errorField: string = '';
        if (hasDuplicate) {
            let count: number = 0;
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown: HTMLElement) => {
                const dropDownList: DropDownList = <DropDownList>getComponent(dropDown, 'dropdownlist');
                if (dropDownList.value === duplicateField) {
                    dropDown.parentElement.classList.add('e-error');
                    errorField = dropDownList.text;
                    count++;
                }
                return count === 2; //breaks the loop when 2 errors added.
            });
            errorElem.innerText = '';
            const errorFieldEle: HTMLElement = this.parent.createElement('strong');
            errorFieldEle.innerText = errorField;
            errorElem.appendChild(errorFieldEle);
            errorElem.appendChild(document.createTextNode(l10n.getConstant('SortDuplicateFieldError')));
            return true;
        }
        return false;
    }

    /**
     * Creates all the elements and generates the dialog content element.
     *
     * @returns {HTMLElement} - Returns the dialog element.
     */
    private customSortContent(): HTMLElement {
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-sort-dialog' });
        const fields: { [key: string]: string }[] = this.getFields();
        const listId: string = getUniqueID('customSort');
        const listviewObj: ListView = this.getCustomListview(listId);
        this.setHeaderTab(dialogElem, listviewObj, fields);
        const contentElem: HTMLElement = this.parent.createElement('div', {
            className: 'e-sort-listsection',
            styles: ''
        });
        dialogElem.appendChild(contentElem);

        const listview: HTMLElement = this.parent.createElement('div', { className: 'e-list-sort', styles: '' });
        contentElem.appendChild(listview);
        listviewObj.createElement = this.parent.createElement;
        listviewObj.appendTo(listview);
        listview.removeAttribute('tabindex');
        this.renderListItem(listId, listviewObj, true, fields);

        const errorElem: HTMLElement = this.parent.createElement('div', { className: 'e-sort-error' });
        dialogElem.appendChild(errorElem);

        return dialogElem;
    }

    /**
     * Gets the fields data from the selected range.
     *
     * @returns {Object} - Gets the fields data from the selected range.
     */
    private getFields(): { [key: string]: string }[] {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getSwapRange(getIndexesFromAddress(sheet.selectedRange));
        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //for entire range
            range[0] = 0; range[1] = 0; range[3] = sheet.usedRange.colIndex;
            const args: { [key: string]: number[] | boolean } = { filterRange: [], hasFilter: false };
            this.parent.notify(getFilterRange, args);
            if (args.hasFilter && args.filterRange) {
                range[0] = args.filterRange[0];
            }
        }
        const fields: { [key: string]: string }[] = [];
        let text: string;
        let value: string;
        for (range[1]; range[1] <= range[3]; range[1]++) {
            const cell: CellModel = getCell(range[0], range[1], sheet);
            value = 'Column ' + getColumnHeaderText(range[1] + 1);
            if (cell && cell.value) {
                text = cell.value;
                if (cell.format) {
                    const eventArgs: NumberFormatArgs = { formattedText: text, value: text, format: cell.format, rowIndex: range[0],
                        colIndex: range[1] };
                    this.parent.notify(getFormattedCellObject, eventArgs);
                    text = eventArgs.formattedText as string;
                }
            } else {
                text = value;
            }
            fields.push({ text: text, value: value });
        }
        return fields;
    }

    /**
     * Creates the header tab for the custom sort dialog.
     *
     * @param {HTMLElement} dialogElem - dialog content element.
     * @param {ListView} listviewObj - listview instance.
     * @param {Object} fields - fields data.
     * @returns {void} - set header tab.
     */
    private setHeaderTab(dialogElem: HTMLElement, listviewObj: ListView, fields: { [key: string]: string }[]): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const headerTabElement: HTMLElement = this.parent.createElement('div', { className: 'e-sort-header' });
        dialogElem.appendChild(headerTabElement);
        const addButton: HTMLElement = this.parent.createElement(
            'button', { className: 'e-btn e-sort-addbtn e-flat', attrs: { 'type': 'button' } });
        addButton.innerText = l10n.getConstant('AddColumn');
        const footer: Element = this.parent.element.querySelector('.e-customsort-dlg .e-footer-content');
        footer.insertBefore(addButton, footer.firstElementChild);
        addButton.addEventListener('click', () => {
            if (listviewObj) {
                const listId: string = getUniqueID('customSort');
                listviewObj.addItem([{ id: listId, text: l10n.getConstant('ThenBy'), field: '', order: 'ascending' }]);
                this.renderListItem(listId, listviewObj, checkHeaderObj.checked, fields, true);
            }
        });
        const checkHeaderObj: CheckBox = new CheckBox({
            label: l10n.getConstant('ContainsHeader'),
            checked: true,
            change: (args: CheckBoxChangeEventArgs) => {
                const fieldsMap: FieldSettingsModel = args.checked ? { text: 'text', value: 'value' } : { text: 'value' };
                Array.prototype.forEach.call(
                    dialogElem.getElementsByClassName('e-sort-field e-dropdownlist e-lib'),
                    (dropDown: HTMLElement) => {
                        const dropDownListObj: DropDownList = getComponent(dropDown, 'dropdownlist') as DropDownList;
                        dropDownListObj.dataSource = null; //reset datasource.
                        dropDownListObj.dataSource = fields;
                        dropDownListObj.fields = fieldsMap;
                        dropDownListObj.dataBind();
                    });
            },
            cssClass: 'e-sort-headercheckbox'
        });
        const headerCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-sort-checkheader', attrs: { type: 'checkbox' }
        });
        headerTabElement.appendChild(headerCheckbox);
        checkHeaderObj.createElement = this.parent.createElement;
        checkHeaderObj.appendTo(headerCheckbox);

        const checkCaseObj: CheckBox = new CheckBox({
            label: l10n.getConstant('CaseSensitive'),
            checked: false,
            cssClass: 'e-sort-casecheckbox'
        });
        const caseCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-sort-checkcase', attrs: { type: 'checkbox' }
        });
        headerTabElement.appendChild(caseCheckbox);
        checkCaseObj.createElement = this.parent.createElement;
        checkCaseObj.appendTo(caseCheckbox);
    }

    /**
     * Creates a listview instance.
     *
     * @param {string} listId - unique id of the list item.
     * @returns {void}
     */
    private getCustomListview(listId: string): ListView {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const data: { [key: string]: string; }[] = [{ id: listId, text: l10n.getConstant('SortBy'), field: '', order: 'ascending' }];
        enableRipple(false);
        const listviewObj: ListView = new ListView({
            dataSource: data,
            fields: { id: 'id' },
            height: '100%',
            /* eslint-disable */
            template: initializeCSPTemplate( function(data: any): string {
                return ('<div class="e-sort-listwrapper">' +
                `<span class="text">${data.text}</span>` +
                '<div class="e-sort-row"><div class="e-sort-field"></div>' +
                '<div class="e-sort-order">' +
                `<span class="e-sort-ordertxt" style="display:none;">${data.order}</span></div>` +
                '<span class="e-icons e-sort-delete" tabindex="0"></span></div>');
            }) as any,
            /* eslint-enable */
            cssClass: 'e-sort-template'
        });
        return listviewObj;
    }

    /**
     * Triggers the click event for delete icon.
     *
     * @param {Element} element - current list item element.
     * @param {ListView} listviewObj - listview instance.
     * @returns {void}
     */
    private deleteHandler(element: Element, listviewObj: ListView): void {
        const iconEle: Element = element.getElementsByClassName('e-sort-delete')[0];
        //Event handler to bind the click event for delete icon
        iconEle.addEventListener('click', (): void => {
            if (element) {
                listviewObj.removeItem(element);
            }
        });
    }

    /**
     * Renders the dropdown and radio button components inside list item.
     *
     * @param {string} id - unique id of the list item.
     * @param {ListView} lvObj - listview instance.
     * @param {boolean} containsHeader - data contains header.
     * @param {string} fields - fields data.
     * @param {boolean} btn - boolean value.
     * @returns {void}
     */
    private renderListItem(id: string, lvObj: ListView, containsHeader: boolean, fields: { [key: string]: string }[], btn?: boolean): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const element: Element = lvObj.element.querySelector('li[data-uid=' + id + ']');
        const fieldsMap: FieldSettingsModel = containsHeader ? { text: 'text', value: 'value' } : { text: 'value' };
        const dropDown: Element = element.getElementsByClassName('e-sort-field')[0];
        const dropDownListObj: DropDownList = new DropDownList({
            dataSource: fields,
            width: 'auto',
            cssClass: 'e-sort-field-ddl',
            fields: fieldsMap,
            placeholder: l10n.getConstant('SelectAColumn'),
            change: (args: DropdownChangeEventArgs) => {
                if (!args.value) { return; }
                Array.prototype.some.call(lvObj.dataSource, (item: { [key: string]: string }) => {
                    if (item.id === id) {
                        item.field = args.value.toString().replace('Column ', '') as string;
                    }
                    return item.id === id; //breaks the loop when proper id found
                });
                this.clearError();
            }
        });
        dropDownListObj.createElement = this.parent.createElement;
        dropDownListObj.appendTo(dropDown as HTMLElement);
        if (!btn) {
            dropDownListObj.index = 0;
        }

        /* sort ascending radio button */
        const orderRadio: Element = element.getElementsByClassName('e-sort-order')[0];
        const ordertxtElem: HTMLElement = orderRadio.getElementsByClassName('e-sort-ordertxt')[0] as HTMLElement;
        const isAscending: boolean = ordertxtElem.innerText.toLocaleLowerCase() === 'ascending';
        const radiobutton: RadioButton = new RadioButton({
            label: l10n.getConstant('SortAscending'),
            name: 'sortAZ_' + id, value: 'ascending', checked: isAscending, cssClass: 'e-sort-radiobutton',
            change: (args: ChangeArgs) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        const radio: HTMLElement = this.parent.createElement('input', {
            id: 'orderAsc_' + id, className: 'e-sort-radioasc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio);
        radiobutton.createElement = this.parent.createElement;
        radiobutton.appendTo(radio);
        /* sort descending radio button */
        const radiobutton2: RadioButton = new RadioButton({
            label: l10n.getConstant('SortDescending'),
            name: 'sortAZ_' + id, value: 'descending', checked: !isAscending, cssClass: 'e-sort-radiobutton',
            change: (args: ChangeArgs) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        const radio2: HTMLElement = this.parent.createElement('input', {
            id: 'orderDesc_' + id, className: 'e-sort-radiodesc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio2);
        radiobutton2.createElement = this.parent.createElement;
        radiobutton2.appendTo(radio2);

        this.deleteHandler(element, lvObj);
    }

    /**
     * Sets the new value of the radio button.
     *
     * @param {ListView} listviewObj - listview instance.
     * @param {string} id - unique id of the list item.
     * @param {string} value - new value.
     * @returns {void}
     */
    private setRadioBtnValue(listviewObj: ListView, id: string, value: string): void {
        if (!value) { return; }
        Array.prototype.some.call(listviewObj.dataSource, (item: { [key: string]: string }) => {
            if (item.id === id) {
                item.order = value;
            }
            return item.id === id; //breaks the loop when proper id found
        });
    }

    /**
     *
     * Clears the error from the dialog.
     *
     * @returns {void}
     */
    private clearError(): void {
        const dialogElem: HTMLElement = document.getElementsByClassName('e-sort-dialog')[0] as HTMLElement;
        const errorElem: HTMLElement = dialogElem.getElementsByClassName('e-sort-error')[0] as HTMLElement;
        if (errorElem.style.display !== 'none' && errorElem.innerHTML !== '') {
            errorElem.style.display = 'none';
            Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-error'), (element: HTMLElement) => {
                element.classList.remove('e-error');
            });
        }
    }

    /**
     * Triggers sort events and applies sorting.
     *
     * @param {Object} args - Specifies the args.
     * @param {SortOptions} args.sortOptions - Specifies the sort options.
     * @param {string} args.range - Specifies the range.
     * @param {SortCollectionModel} args.previousSort - Specifies the previous sort collection.
     * @returns {void}
     */
    private applySortHandler(args: { sortOptions?: SortOptions, range?: string, previousSort?: SortCollectionModel }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let address: string = args && args.range || sheet.selectedRange;
        const range: number[] = getSwapRange(getIndexesFromAddress(address));
        const sortOptions: SortOptions = args && args.sortOptions || { sortDescriptors: {} };
        let isSingle: boolean = range[0] === range[2];
        const eventArgs: FilterInfoArgs = { filterRange: [], hasFilter: false, sheetIdx: this.parent.activeSheetIndex };
        this.parent.notify(getFilterRange, eventArgs);
        if (eventArgs.hasFilter && (isSingle ? inRange(<number[]>eventArgs.filterRange, range[0], range[1]) : (eventArgs.filterRange[0] ===
            range[0] && (this.parent.element.querySelector('.e-selectall.e-highlight') || (range[1] >= eventArgs.filterRange[1] && range[1]
                <= eventArgs.filterRange[3]) || (range[3] >= eventArgs.filterRange[1] && range[3] <= eventArgs.filterRange[3]))))) {
            range[0] = eventArgs.filterRange[0]; range[1] = eventArgs.filterRange[1];
            range[2] = sheet.usedRange.rowIndex; range[3] = sheet.usedRange.colIndex;
            sortOptions.containsHeader = !eventArgs.allowHeaderFilter; isSingle = false;
        }
        address = getRangeAddress(range);
        const beforeArgs: BeforeSortEventArgs = { range: address, sortOptions: sortOptions, cancel: false };
        this.parent.trigger(beforeSort, beforeArgs);
        if (beforeArgs.cancel) { return; }
        this.parent.notify(beginAction, { eventArgs: beforeArgs, action: 'beforeSort' });
        this.parent.showSpinner();
        const promise: Promise<SortEventArgs> = new Promise((resolve: Function) => { resolve((() => { /** */ })()); });
        const sortArgs: { promise: Promise<SortEventArgs>, args: { range: string, checkForHeader?: boolean, sortOptions: SortOptions },
            previousSort: SortCollectionModel } = { args: { range: beforeArgs.range, sortOptions: beforeArgs.sortOptions, checkForHeader:
                isSingle && address !== beforeArgs.range }, promise: promise, previousSort: args && args.previousSort };
        this.parent.notify(initiateSort, sortArgs);
        sortArgs.promise.then((sortArgs: SortEventArgs) => {
            this.sortCompleteHandler(sortArgs);
            this.parent.trigger(sortComplete, sortArgs);
            this.parent.notify(completeAction, { eventArgs: sortArgs, action: 'sorting' });
            if (document.activeElement.tagName === 'BODY') {
                focus(this.parent.element);
            }
            return Promise.resolve(sortArgs);
        }).catch((error: string) => {
            this.sortRangeAlertHandler({ error: error });
            return Promise.reject(error);
        });
    }

    /**
     *
     * Invoked when the sort action is completed.
     *
     * @param {SortEventArgs} args - Specifies the range and sort options.
     * @returns {void}
     */
    private sortCompleteHandler(args: SortEventArgs): void {
        let sheet: SheetModel;
        let range: number[];
        let sheetIdx: number = this.parent.activeSheetIndex;
        if (args.range.includes('!')) {
            const lastIndex: number = args.range.lastIndexOf('!');
            sheetIdx = getSheetIndex(this.parent, args.range.substring(0, lastIndex));
            sheet = getSheet(this.parent, sheetIdx);
            range = getRangeIndexes(args.range.substring(lastIndex + 1));
        } else {
            sheet = this.parent.getActiveSheet();
            range = getRangeIndexes(args.range);
        }
        for (let i: number = range[0]; i <= range[2]; i++) {
            for (let j: number = range[1]; j <= range[3]; j++) {
                this.parent.notify(workbookFormulaOperation, { action: 'refreshCalculate', rowIndex: i, colIndex: j });
            }
        }
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
            range, true, true, false, false, isImported(this.parent), undefined, undefined, undefined, true);
        if (sheetIdx === this.parent.activeSheetIndex && sheet.conditionalFormats && sheet.conditionalFormats.length) {
            this.parent.notify(applyCF, <ApplyCFArgs>{ indexes: range });
        }
        this.parent.hideSpinner();
        this.parent.notify(refreshFilterRange, null);
    }
}
