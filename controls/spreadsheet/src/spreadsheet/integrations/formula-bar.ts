import { Spreadsheet } from '../base/index';
import { formulaBar, locale, enableFormulaInput, DialogBeforeOpenEventArgs, focus, getUpdateUsingRaf, dialog, isNavigationKey, isMouseDown } from '../common/index';
import { mouseUpAfterSelection, click } from '../common/index';
import { getRangeIndexes, getRangeFromAddress, getCellAddress, getCellIndexes } from './../../workbook/common/address';
import { CellModel, getSheetName, getSheet, SheetModel, checkIsFormula, Workbook, getCell, isCustomDateTime, isReadOnly, getRow } from '../../workbook/index';
import { updateSelectedRange, getSheetNameFromAddress, getSheetIndex, DefineNameModel, isLocked, getColumn } from '../../workbook/index';
import { ComboBox, DropDownList, SelectEventArgs as DdlSelectArgs } from '@syncfusion/ej2-dropdowns';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { rippleEffect, L10n, EventHandler, detach, Internationalization, isNullOrUndefined, select, getComponent } from '@syncfusion/ej2-base';
import { isUndefined, getNumericObject, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { editOperation, formulaBarOperation, keyDown, keyUp, formulaOperation, editAlert, editValue, renderInsertDlg, readonlyAlert, addressHandle } from '../common/event';
import { intToDate, isNumber } from '../../workbook/common/math';
import { Dialog } from '../services/dialog';
import { SelectEventArgs, ListView } from '@syncfusion/ej2-lists';
import { workbookFormulaOperation, selectionComplete, getData, getFormatFromType } from '../../workbook/index';
import { isFormulaBarEdit, removeAllChildren } from '../common/index';

/**
 * Represents Formula bar for Spreadsheet.
 */
export class FormulaBar {
    private parent: Spreadsheet;
    private comboBoxInstance: ComboBox;
    private insertFnRipple: Function;
    private categoryCollection: string[] = [];
    private formulaCollection: string[] = [];
    private categoryList: DropDownList;
    private formulaList: ListView;
    private dialog: Dialog;
    private isGoto: boolean = false;
    private isDevice: boolean;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'formulaBar';
    }

    private createFormulaBar(args: { uiUpdate?: boolean }): void {
        if (!this.parent.showFormulaBar && this.insertFnRipple) {
            this.destroy(); return;
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale); const id: string = this.parent.element.id;
        const isRTL: boolean = this.parent.enableRtl;
        const fBarWrapper: HTMLElement = this.parent.createElement('div', { className: 'e-formula-bar-panel' });
        if (!this.parent.isMobileView()) {
            const nameBox: HTMLElement = this.parent.createElement(
                'input', { id: id + '_name_box', attrs: { type: 'text' } });
            fBarWrapper.appendChild(nameBox);
            this.comboBoxInstance = new ComboBox({
                value: 'A1',
                cssClass: 'e-name-box',
                enableRtl: isRTL,
                width: '',
                noRecordsTemplate: initializeCSPTemplate(function (): string { return ''; }),
                fields: { text: 'name', value: 'refersTo' },
                beforeOpen: this.nameBoxBeforeOpen.bind(this),
                blur: this.nameBoxBlur.bind(this),
                select: this.nameBoxSelect.bind(this),
                open: () => {
                    if (this.isDevice) { (window as { browserDetails?: { isDevice?: boolean } }).browserDetails.isDevice = true; }
                },
                change: () => {
                    /** */
                }
            });
            this.comboBoxInstance.createElement = this.parent.createElement;
            this.comboBoxInstance.appendTo(nameBox);
            this.comboBoxInstance.element.parentElement.title = l10n.getConstant('NameBox');
        }
        const insertFnBtn: HTMLElement = fBarWrapper.appendChild(this.parent.createElement('button', {
            className: 'e-btn e-css e-flat e-icon-btn e-insert-function', attrs: { 'title': l10n.getConstant('InsertFunction'), 'type': 'button' }
        }));
        insertFnBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons' }));
        this.insertFnRipple = rippleEffect(fBarWrapper, { selector: '.e-insert-function' });
        fBarWrapper.appendChild(this.parent.createElement('div', { className: 'e-separator' }));
        const formulaBarLocale: string = l10n.getConstant('FormulaBar');
        const textarea: HTMLTextAreaElement = fBarWrapper.appendChild(this.parent.createElement('textarea', {
            className: 'e-formula-bar e-css', id: id + '_formula_input',
            attrs: { 'title': formulaBarLocale, 'aria-label': formulaBarLocale, 'spellcheck': 'false' }
        })) as HTMLTextAreaElement;
        textarea.rows = 1;
        if (this.parent.isMobileView()) {
            textarea.placeholder = l10n.getConstant('MobileFormulaBarPlaceHolder');
            EventHandler.add(textarea, 'focus', this.textAreaFocusIn, this);
            EventHandler.add(textarea, 'blur', this.textAreaFocusOut, this);
        } else {
            const text: string = l10n.getConstant('ExpandFormulaBar');
            fBarWrapper.appendChild(
                this.parent.createElement('span', { className: 'e-drop-icon e-icons', attrs: { 'title': text, 'role': 'button',
                    'tabindex': '-1', 'aria-label': text } }));
        }
        if (args && args.uiUpdate) {
            this.parent.element.insertBefore(fBarWrapper, document.getElementById(id + '_sheet_panel'));
        } else {
            this.parent.element.appendChild(fBarWrapper);
        }
    }
    private textAreaFocusIn(): void {
        const formulaPanel: Element = this.parent.element.querySelector('.e-formula-bar-panel');
        const tickBtn: HTMLElement = this.parent.createElement('button', { className: 'e-btn e-css e-flat e-icon-btn e-formula-submit', attrs: { 'type': 'button' } });
        tickBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-tick-icon' }));
        formulaPanel.classList.add('e-focused');
        formulaPanel.appendChild(tickBtn);
    }
    private textAreaFocusOut(): void {
        const formulaPanel: Element = this.parent.element.querySelector('.e-formula-bar-panel');
        formulaPanel.classList.remove('e-focused');
        detach(formulaPanel.querySelector('.e-formula-submit'));
    }
    private keyDownHandler(e: KeyboardEvent): void {
        const trgtElem: HTMLTextAreaElement = <HTMLTextAreaElement>e.target;
        if (this.parent.isEdit && (!this.parent.getActiveSheet().isProtected || (trgtElem.classList.contains('e-formula-bar') && !trgtElem.disabled))) {
            if ((checkIsFormula(trgtElem.value) || (trgtElem.validity && trgtElem.value.toString().indexOf('=') === 0)) &&
                (e.keyCode === 16 || e.keyCode === 17)) {
                return;
            }
            if (trgtElem.classList.contains('e-formula-bar') && (!e.shiftKey || (e.shiftKey && !isNavigationKey(e.keyCode)))) {
                this.parent.notify(
                    editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
            }
        }
    }
    private keyUpHandler(e: KeyboardEvent): void {
        if (this.parent.isEdit) {
            const trgtElem: HTMLTextAreaElement = <HTMLTextAreaElement>e.target;
            if (trgtElem.classList.contains('e-formula-bar')) {
                const eventArg: { editedValue: string, action: string } = { action: 'getCurrentEditValue', editedValue: '' };
                this.parent.notify(
                    editOperation, eventArg);
                if (eventArg.editedValue !== trgtElem.value && e.keyCode !== 16 && e.keyCode !== 17 &&
                    (!e.shiftKey || (e.shiftKey && !isNavigationKey(e.keyCode)))) {
                    this.parent.notify(
                        editOperation, { action: 'refreshEditor', value: trgtElem.value, refreshEditorElem: true });
                }
            }
        }
    }

    private nameBoxBeforeOpen(args: { [key: string]: Object }): void {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            args.cancel = true;
        } else {
            (<HTMLInputElement>this.comboBoxInstance.element).select();
            this.isDevice = (window as { browserDetails?: { isDevice?: boolean } }).browserDetails.isDevice;
            if (this.isDevice) { (window as { browserDetails?: { isDevice?: boolean } }).browserDetails.isDevice = false; }
        }
    }

    private nameBoxBlur(): void {
        if (this.comboBoxInstance.element.classList.contains('e-name-editing')) {
            this.comboBoxInstance.element.classList.remove('e-name-editing');
            this.updateValueAfterMouseUp();
        }
    }

    private nameBoxSelect(args: DdlSelectArgs): void {
        if (args.isInteracted && (!args.e || args.e.type !== 'keydown' || ((args.e as KeyboardEvent).keyCode !== 40 &&
            (args.e as KeyboardEvent).keyCode !== 38))) {
            const refersTo: string = (<DefineNameModel>args.itemData).refersTo.substr(1);
            const sheetIdx: number = getSheetIndex(this.parent as Workbook, getSheetNameFromAddress(refersTo));
            if (sheetIdx === undefined) { return; }
            let range: string = getRangeFromAddress(refersTo);
            const sheet: SheetModel = getSheet(this.parent as Workbook, sheetIdx);
            let left: string; let right: string;
            if (range.indexOf(':') === -1) {
                left = right = range.replace('$', '');
            } else {
                const colIndex: number = range.indexOf(':');
                left = range.substr(0, colIndex).replace('$', '');
                right = range.substr(colIndex + 1, range.length).replace('$', '');
            }
            if (right.match(/\D/g) && !right.match(/[0-9]/g) && left.match(/\D/g) && !left.match(/[0-9]/g)) {
                left = left + '1';
                right = right + sheet.rowCount;
                range = left + ':' + right;
            } else if (!right.match(/\D/g) && right.match(/[0-9]/g) && !left.match(/\D/g) && left.match(/[0-9]/g)) {
                left = getCellAddress(parseInt(left, 10) - 1, 0);
                right = getCellAddress(parseInt(right, 10) - 1, sheet.colCount - 1);
                range = left + ':' + right;
            }
            if (sheetIdx === this.parent.activeSheetIndex) {
                if (!this.parent.isEdit) {
                    this.parent.selectRange(range);
                }
                this.parent.notify(addressHandle, { range: range, isSelect: false, isMouseDown: false, isNameBoxSelect: true });
                focus(this.parent.element);
            } else {
                updateSelectedRange(this.parent as Workbook, range, sheet);
                this.parent.activeSheetIndex = sheetIdx;
                this.parent.notify(addressHandle, { range: range, isSelect: false, isMouseDown: false, isNameBoxSelect: true });
                focus(this.parent.element);
            }
        }
    }

    private formulaBarUpdateHandler(e: MouseEvent & TouchEvent): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: string[] = sheet.selectedRange.split(':');
        let address: string;
        const editArgs: { action: string, element: HTMLElement } = { action: 'getElement', element: null };
        this.parent.notify(editOperation, editArgs);
        const formulaBar: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
        if (e.type === 'mousemove' || e.type === 'pointermove') {
            const indexes1: number[] = getRangeIndexes(range[0]); const indexes2: number[] = getRangeIndexes(range[1]);
            address = `${Math.abs(indexes1[0] - indexes2[0]) + 1}R x ${Math.abs(indexes1[1] - indexes2[1]) + 1}C`;
            if (this.parent.isEdit) {
                if (e.target as Element && !(e.target as Element).classList.contains('e-spreadsheet-edit')) {
                    this.parent.notify(editValue, {});
                } else if (editArgs.element) {
                    formulaBar.value = editArgs.element.textContent;
                }
            }
        } else {
            address = range[0];
            const cellAddr: string = `${getSheetName(this.parent)}!${address}`;
            getData(this.parent, cellAddr, false, true).then((values: Map<string, CellModel>): void => {
                if (!this.parent) {
                    return;
                }
                (values as Map<string, CellModel>).forEach((cell: CellModel): void => {
                    const value: string = this.getFormulaBarValue(cell);
                    const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
                    this.parent.notify(editOperation, eventArgs);
                    const formulaInp: HTMLTextAreaElement =
                        (<HTMLTextAreaElement>document.getElementById(this.parent.element.id + '_formula_input'));
                    const previousVal: string = formulaInp.value;
                    formulaInp.value = value;
                    if (!eventArgs.editedValue || !checkIsFormula(eventArgs.editedValue.toString(), true)) {
                        this.parent.notify(editOperation, { action: 'refreshEditor', value: value, refreshEditorElem: true });
                    }
                    if (this.parent.isEdit) {
                        if (e.target && !(e.target as Element).classList.contains('e-spreadsheet-edit')) {
                            this.parent.notify(editValue, { isMouseDown: isMouseDown(e), formulaBarVal: previousVal });
                        } else if (editArgs.element) {
                            formulaBar.value = editArgs.element.textContent;
                        }
                    }
                });
            });
        }
        this.updateComboBoxValue(address);
    }
    private getFormulaBarValue(cell: CellModel): string {
        let value: string = '';
        if (cell) {
            if (cell.formula) {
                value = cell.formula;
            } else if (!isNullOrUndefined(cell.value) && cell.value !== '') {
                const option: { type?: string } = {};
                let type: string = cell.format && isCustomDateTime(cell.format, true, option, true) && option.type;
                if (type === 'date' || type === 'time' || type === 'datetime') {
                    const dateVal: Date = intToDate(Number(cell.value));
                    if (dateVal && dateVal.toString() !== 'Invalid Date' && dateVal.getFullYear() >= 1900) {
                        const intl: Internationalization = new Internationalization();
                        let time: string = getFormatFromType('Time');
                        if (time === 'h:mm:ss AM/PM') {
                            time = 'h:mm:ss a';
                        }
                        const format: string = cell.format.toLowerCase();
                        // isCustomDateTime returns as type 'time' for 'm', 'mm' and 'mmm' format, so we converting as 'date' type.
                        if (type === 'time' && format.includes('m') && !format.includes(':m') && !format.includes('m:') &&
                            !format.includes('[m') && !format.includes('am')) {
                            type = 'date';
                        }
                        const valArr: string[] = cell.value.toString().split('.');
                        const isDateTimeVal: boolean = valArr.length === 2;
                        const timeVal: Date = isDateTimeVal ? intToDate(parseFloat((valArr[0] + 1) + '.' + valArr[1]) ||
                            Number(cell.value)) : dateVal;
                        if (type === 'date') {
                            const dateObj: { type: string, format?: string, skeleton?: string } = { type: 'date' };
                            dateObj.skeleton = 'yMd';
                            value = intl.formatDate(dateVal, dateObj);
                            if (isDateTimeVal) {
                                value += ' ' + intl.formatDate(timeVal, { type: 'time', skeleton: 'medium', format: time });
                            }
                        } else {
                            if (Number(cell.value) >= 1 || type === 'datetime') {
                                value = intl.formatDate(dateVal, { type: 'date', skeleton: 'yMd' }) + ' ';
                            }
                            value += intl.formatDate(timeVal, { type: 'time', skeleton: 'medium', format: time });
                        }
                    }
                } else if (cell.format && cell.format.includes('%') && isNumber(cell.value)) {
                    value = this.parent.getDisplayText(cell);
                    if (!value.includes('%')) {
                        value = '';
                    }
                }
                if (!value) {
                    value = cell.value.toString();
                    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                        value = value.toUpperCase();
                    } else if (this.parent.locale !== 'en-US') {
                        const decimalSep: string = (getNumericObject(this.parent.locale) as { decimal: string }).decimal;
                        if (decimalSep !== '.' && isNumber(value) && value.includes('.')) {
                            value = value.replace('.', decimalSep);
                        }
                    }
                }
            } else if (cell.hyperlink) {
                value = typeof cell.hyperlink === 'string' ? cell.hyperlink : (cell.hyperlink.address || '');
            }
        }
        return value;
    }
    private updateValueAfterMouseUp(): void {
        this.updateComboBoxValue(this.parent.getActiveSheet().selectedRange.split(':')[0]);
    }
    private updateComboBoxValue(value: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: string = getSheetName(this.parent as Workbook) + '!' + sheet.selectedRange;
        const eventArgs: { action: string, range: string, definedName: DefineNameModel } = {
            action: 'getNameFromRange', range: range, definedName: null
        };
        this.parent.notify(formulaOperation, eventArgs);
        if (eventArgs.definedName) {
            value = eventArgs.definedName.name;
        }
        if (!this.parent.isMobileView()) {
            if (this.comboBoxInstance.text === value) { return; }
            this.comboBoxInstance.text = value;
            this.comboBoxInstance.dataBind();
        }
    }
    private disabletextarea(): void {
        const element: HTMLTextAreaElement = this.getFormulaBar();
        if (this.parent.getActiveSheet().isProtected && !this.parent.isEdit) {
            element.disabled = true;
        } else { element.disabled = false; }
    }

    private updateNameBoxValue(definedName: DefineNameModel, isRemove?: boolean): void {
        const id: string = this.parent.element.id;
        const comboBoxInstance: ComboBox = getComponent(this.parent.element.querySelector(`#${id}_name_box`) as HTMLElement, 'combobox') as ComboBox;
        const activeSheet: SheetModel = this.parent.getActiveSheet();
        if (isRemove) {
            if (comboBoxInstance.text === definedName.name) {
                comboBoxInstance.value = activeSheet.activeCell;
                comboBoxInstance.dataBind();
            }
        }
        else {
            const refRangeArr: string[] = definedName.refersTo.split('!');
            if (refRangeArr.length === 2 && definedName.refersTo.startsWith('=')) {
                const refSheetName: string = refRangeArr[0].split('=')[1].replace(/'/g, '');
                const referredRange: string = definedName.refersTo.split('!')[1];
                if (refSheetName === activeSheet.name && referredRange === activeSheet.selectedRange) {
                    comboBoxInstance.value = definedName.name;
                    comboBoxInstance.dataBind();
                }
            }
        }
    }

    private formulaBarScrollEdit(): void {
        const index: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
        const viewportIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().topLeftCell);
        if (index[0] < viewportIndexes[0]) {
            this.parent.goTo(this.parent.getActiveSheet().selectedRange);
            this.isGoto = true;
        }
        this.parent.notify(editOperation, { action: 'startEdit', refreshCurPos: false });
    }
    private formulaBarClickHandler(e: MouseEvent & TouchEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const isSheetProtected: boolean = sheet.isProtected;
        const range: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(range[0], range[1], sheet);
        const isCellLocked: boolean = isLocked(cell, getColumn(sheet, range[1]));
        if (target.classList.contains('e-drop-icon') && target.parentElement.classList.contains('e-formula-bar-panel')) {
            this.toggleFormulaBar(target);
        } else if (target.classList.contains('e-formula-bar')) {
            if (isReadOnly(cell, getColumn(sheet, range[1]), getRow(sheet, range[0]))) {
                this.parent.notify(readonlyAlert, null);
                return;
            }
            if ((!this.parent.isEdit && (!isSheetProtected || (isSheetProtected && !isCellLocked))) ||
                (this.parent.isEdit && isSheetProtected && !(target as HTMLTextAreaElement).disabled)) {
                this.formulaBarScrollEdit();
            } else if (isSheetProtected && isCellLocked) {
                this.parent.notify(editAlert, null);
            }
        } else if (target.parentElement && target.parentElement.classList.contains('e-name-box')) {
            if (target.classList.contains('e-ddl-icon')) {
                const eventArgs: { action: string, names: string[] } = { action: 'getNames', names: [] };
                this.parent.notify(formulaOperation, eventArgs);
                if ((this.comboBoxInstance.dataSource as Object[]).length !== eventArgs.names.length ||
                    this.comboBoxInstance.value === this.comboBoxInstance.text) {
                    const searchText: string = this.comboBoxInstance.text;
                    this.comboBoxInstance.dataSource = eventArgs.names;
                    const definedName: DefineNameModel = (eventArgs.names as DefineNameModel[]).find((
                        name: DefineNameModel) => name.name === searchText);
                    this.comboBoxInstance.value = definedName ? definedName.refersTo : this.comboBoxInstance.value;
                    this.comboBoxInstance.dataBind();
                }
            } else {
                this.comboBoxInstance.element.classList.add('e-name-editing');
                (<HTMLInputElement>this.comboBoxInstance.element).select();
            }
        }
        if (!isNullOrUndefined(target.offsetParent) && ((target.offsetParent.classList.contains('e-insert-function')) ||
            (target.classList.contains('e-insert-function')) || (this.parent.element.id + '_insert_function' === target.offsetParent.id)
            || (this.parent.element.id + '_insert_function' === target.id) ||
            target.parentElement.classList.contains('e-insert-function')
            || (this.parent.element.id + '_insert_function' === target.parentElement.id))) {
            this.renderInsertDlg();
        }
    }

    private renderInsertDlg(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const activeCell: number[] = getCellIndexes(sheet.activeCell);
        if (sheet.isProtected) {
            if (isLocked(getCell(activeCell[0], activeCell[1], sheet), getColumn(sheet, activeCell[1])) && !this.parent.isEdit) {
                this.parent.notify(editAlert, null);
                return;
            }
        }
        const cell: CellModel = getCell(activeCell[0], activeCell[1], sheet);
        if (isReadOnly(cell, getColumn(sheet, activeCell[1]), getRow(sheet, activeCell[0]))) {
            this.parent.notify(readonlyAlert, null);
            return;
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let isOpen: boolean = !this.parent.isEdit;
        const args: { [key: string]: Object } = { action: 'getCurrentEditValue', editedValue: '' };
        if (!isOpen) {
            const eventArgs: { [key: string]: Object } = { action: 'isFormulaEditing', isFormulaEdit: false };
            this.parent.notify(formulaOperation, eventArgs); isOpen = <boolean>eventArgs.isFormulaEdit;
            this.parent.notify(editOperation, args);
        }
        if (args.editedValue === '') {
            if (!this.parent.element.querySelector('.e-spreadsheet-function-dlg')) {
                if (args.editedValue === '') { this.parent.notify(editOperation, { action: 'refreshEditor', value: '=' }); }
                const formulaDescription: HTMLElement = this.parent.createElement(
                    'div', { className: 'e-formula-description', id: this.parent.element.id + '_description_content' });
                const categoryContent: HTMLElement = this.parent.createElement(
                    'div', { className: 'e-category-content', id: this.parent.element.id + '_category_content' });
                categoryContent.innerText = l10n.getConstant('PickACategory');
                const dropDownElement: HTMLElement = this.parent.createElement(
                    'input', { className: 'e-formula-category', id: this.parent.element.id + '_formula_category' });
                const listViewElement: HTMLElement = this.parent.createElement(
                    'div', { className: 'e-formula-list', id: this.parent.element.id + '_formula_list' });
                const descriptionContent: HTMLElement = this.parent.createElement('div', { className: 'e-description-content' });
                descriptionContent.innerText = l10n.getConstant('Description');
                const headerContent: HTMLElement = this.parent.createElement('div', { className: 'e-header-content' });
                headerContent.innerText = l10n.getConstant('InsertFunction');
                const categoryArgs: { action: string, categoryCollection: string[] } = { action: 'getFormulaCategory', categoryCollection: [] };
                this.parent.notify(workbookFormulaOperation, categoryArgs);
                this.categoryCollection = categoryArgs.categoryCollection;
                let categoryPopupOpen: boolean;
                this.categoryList = new DropDownList({
                    dataSource: this.categoryCollection, cssClass: 'e-ss-formula-category', index: 0, width: '285px', popupHeight: '210px',
                    enableRtl: this.parent.enableRtl,
                    select: this.dropDownSelect.bind(this),
                    open: () => categoryPopupOpen = true,
                    close: () => categoryPopupOpen = false
                });
                const listArgs: { action: string, formulaCollection: string[] } = { action: 'getLibraryFormulas', formulaCollection: [] };
                this.parent.notify(workbookFormulaOperation, listArgs);
                this.formulaCollection = listArgs.formulaCollection;
                this.formulaList = new ListView({
                    dataSource: this.formulaCollection.sort(),
                    enableRtl: this.parent.enableRtl,
                    actionComplete: this.updateFormulaList.bind(this),
                    select: this.listSelected.bind(this), width: '285px', height: '200px'
                });
                let isCancelled: boolean;
                this.dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
                this.dialog.show({
                    header: headerContent.outerHTML,
                    content: categoryContent.outerHTML + dropDownElement.outerHTML + listViewElement.outerHTML +
                    descriptionContent.outerHTML + formulaDescription.outerHTML,
                    width: '320px', height: '485px', cssClass: 'e-spreadsheet-function-dlg',
                    showCloseIcon: true, isModal: true,
                    enableRtl: this.parent.enableRtl,
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'InsertFunctionDialog', element: args.element, target: args.target, cancel: args.cancel };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            this.dialog.dialogInstance.setProperties({ beforeClose: undefined }, true);
                            isCancelled = args.cancel = true;
                        } else {
                            focus(this.parent.element);
                        }
                    },
                    open: this.dialogOpen.bind(this), beforeClose: this.dialogBeforeClose.bind(this), close: this.dialogClose.bind(this),
                    buttons: [
                        {
                            click: (event: KeyboardEvent): void => {
                                if (event && event.keyCode === 13 && !categoryPopupOpen) {
                                    return;
                                }
                                this.selectFormula();
                            },
                            buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true }
                        }]
                });
                if (isCancelled) {
                    this.categoryList = this.formulaList = null;
                } else {
                    this.categoryList.appendTo('#' + this.parent.element.id + '_formula_category');
                    this.formulaList.appendTo('#' + this.parent.element.id + '_formula_list');
                    EventHandler.add(this.formulaList.element, 'dblclick', this.formulaClickHandler, this);
                }
            }
        }
    }

    private toggleFormulaBar(target: HTMLElement): void {
        const parent: Element = target.parentElement; const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (parent.classList.contains('e-expanded')) {
            parent.classList.remove('e-expanded');
            (document.getElementById(this.parent.element.id + '_formula_input') as HTMLTextAreaElement).rows = 1;
            target.title = l10n.getConstant('ExpandFormulaBar');
            target.setAttribute('aria-label', l10n.getConstant('CollapseFormulaBar'));
        } else {
            parent.classList.add('e-expanded');
            (document.getElementById(this.parent.element.id + '_formula_input') as HTMLTextAreaElement).rows = 3;
            target.title = l10n.getConstant('CollapseFormulaBar');
            target.setAttribute('aria-label', l10n.getConstant('ExpandFormulaBar'));
        }
        this.parent.setPanelSize();
    }

    private dialogOpen(): void {
        getUpdateUsingRaf((): void => {
            const okBtn: HTMLElement = this.dialog.dialogInstance.element.querySelector('.e-footer-content .e-primary');
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            okBtn.setAttribute('aria-label', l10n.getConstant('InsertFunction') + ' ' + l10n.getConstant('Ok'));
            if (this.categoryList) {
                focus(this.categoryList.element);
            }
        });
    }

    private dialogClose(): void {
        const args: { [key: string]: Object } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, args);
        if (args.editedValue.toString().trim() === '=') {
            this.parent.notify(editOperation, { action: 'refreshEditor', value: '' });
        }
    }

    private dialogBeforeClose(): void {
        EventHandler.remove(this.formulaList.element, 'dblclick', this.formulaClickHandler);
        const dialogContentEle: HTMLElement = document.getElementsByClassName('e-spreadsheet-function-dlg')[0].
            querySelector('.e-dlg-content');
        dialogContentEle.parentNode.removeChild(dialogContentEle);
        this.categoryList.destroy();
        this.categoryList = null;
        this.formulaList.destroy();
        this.formulaList = null;
    }

    private selectFormula(): void {
        const formulaText: string | string[] | number | number[] = this.formulaList.getSelectedItems().text;
        const sheet: SheetModel = getSheet(this.parent as Workbook, this.parent.activeSheetIndex);
        if (this.parent.isEdit) {
            this.parent.notify(editOperation, {
                action: 'refreshEditor', value: formulaText + '(', refreshFormulaBar: true,
                refreshEditorElem: true, isAppend: true
            });
        } else {
            this.parent.notify(editOperation, { action: 'startEdit', value: '=' + formulaText + '(', address: sheet.activeCell });
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: '=' + formulaText + '(' });
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (this.dialog.dialogInstance as any).storeActiveElement = document.getElementById(this.parent.element.id + '_edit');
        this.dialog.hide();
    }
    private listSelected(args: SelectEventArgs): void {
        this.updateFormulaDescription();
        if (args.isInteracted && args.item) {
            (args.item as HTMLElement).focus();
        }
    }
    private updateFormulaList(): void {
        this.activeListFormula();
        this.updateFormulaDescription();
    }
    private dropDownSelect(args: SelectEventArgs): void {
        this.formulaCollection = [];
        const listArgs: { action: string, formulaCollection: string[] } = {
            action: 'getLibraryFormulas',
            formulaCollection: []
        };
        if (args.item.textContent === 'All') {
            this.parent.notify(workbookFormulaOperation, listArgs);
            this.formulaCollection = listArgs.formulaCollection;
        } else {
            const category: string = args.item.textContent;
            const selectArgs: { action: string, formulaCollection: string[], selectCategory: string } = {
                action: 'dropDownSelectFormulas',
                formulaCollection: [],
                selectCategory: category
            };
            this.parent.notify(workbookFormulaOperation, selectArgs);
            this.formulaCollection = selectArgs.formulaCollection;
        }
        this.formulaList.dataSource = this.formulaCollection.sort();
    }
    private activeListFormula(): void {
        const acListEle: HTMLElement = document.getElementById(this.parent.element.id + '_formula_list');
        const firstElement: Element = acListEle.children[0].children[0].firstElementChild;
        this.formulaList.selectItem(firstElement);
    }
    private updateFormulaDescription(): void {
        let selectedFormula: string | string[] | number | number[] = this.formulaList.getSelectedItems().text;
        const descriptionArgs: {
            action: string, description: string, selectedList: string | string[] | number | number[],
            isCustom: boolean
        } = {
            action: 'getFormulaDescription',
            description: '',
            selectedList: selectedFormula,
            isCustom: false
        };
        this.parent.notify(workbookFormulaOperation, descriptionArgs);
        const okBtn: HTMLElement = this.dialog.dialogInstance.element.querySelector('.e-footer-content .e-primary');
        if (okBtn.hasAttribute('aria-label')) {
            okBtn.removeAttribute('aria-label');
        }
        const descriptionArea: Element = document.getElementById(this.parent.element.id + '_description_content');
        selectedFormula = (selectedFormula === 'AND') ? 'CalculateAND' : (selectedFormula === 'OR') ? 'CalculateOR' : selectedFormula;
        descriptionArea.textContent = descriptionArgs.isCustom ? descriptionArgs.description :
            (this.parent.serviceLocator.getService(locale) as L10n).getConstant(selectedFormula as string);
    }
    private formulaClickHandler(args: MouseEvent & TouchEvent): void {
        const trgtElem: HTMLElement = <HTMLElement>args.target;
        const sheet: SheetModel = getSheet(this.parent as Workbook, this.parent.activeSheetIndex);
        if (trgtElem.offsetParent.classList.contains('e-text-content') || trgtElem.classList.contains('e-list-item')) {
            if (this.parent.isEdit) {
                this.parent.notify(editOperation, {
                    action: 'refreshEditor', value: trgtElem.innerText + '(', refreshFormulaBar: true,
                    refreshEditorElem: true, isAppend: true
                });
            } else {
                this.parent.notify(
                    editOperation, { action: 'startEdit', value: '=' + trgtElem.innerText + '(', address: sheet.activeCell });
                this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: '=' + trgtElem.innerText + '(' });
            }
            this.dialog.hide();
        }
    }

    private addEventListener(): void {
        this.parent.on(formulaBar, this.createFormulaBar, this);
        this.parent.on(click, this.formulaBarClickHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(renderInsertDlg, this.renderInsertDlg, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(selectionComplete, this.formulaBarUpdateHandler, this);
        this.parent.on(mouseUpAfterSelection, this.updateValueAfterMouseUp, this);
        this.parent.on(formulaBarOperation, this.editOperationHandler, this);
        this.parent.on(enableFormulaInput, this.disabletextarea, this);
        this.parent.on(isFormulaBarEdit, this.isFormulaBarEdit, this);
    }
    public destroy(): void {
        this.removeEventListener();
        if (this.comboBoxInstance) { this.comboBoxInstance.destroy(); }
        this.comboBoxInstance = null;
        this.categoryCollection = null;
        this.formulaCollection = null;
        this.dialog = null;
        this.isGoto = null;
        if (this.insertFnRipple) { this.insertFnRipple(); }
        this.insertFnRipple = null;
        const formulaPanel: Element = this.parent.element.querySelector('.e-formula-bar-panel');
        if (formulaPanel) {
            removeAllChildren(formulaPanel);
            detach(formulaPanel);
        }
        this.parent = null;
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(formulaBar, this.createFormulaBar);
            this.parent.off(click, this.formulaBarClickHandler);
            this.parent.off(renderInsertDlg, this.renderInsertDlg);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(selectionComplete, this.formulaBarUpdateHandler);
            this.parent.off(mouseUpAfterSelection, this.updateValueAfterMouseUp);
            this.parent.off(formulaBarOperation, this.editOperationHandler);
            this.parent.off(enableFormulaInput, this.disabletextarea);
            this.parent.off(isFormulaBarEdit, this.isFormulaBarEdit);
        }
    }

    private editOperationHandler(args: {
        action: string, element?: HTMLTextAreaElement, value?: string, cell?: CellModel,
        definedName: DefineNameModel, isRemove?: boolean
    }): void {
        switch (args.action) {
        case 'refreshFormulabar':
            if (args.cell) {
                this.getFormulaBar().value = this.getFormulaBarValue(args.cell);
            } else {
                this.getFormulaBar().value = isUndefined(args.value) ? '' : args.value;
            }
            break;
        case 'setNameBoxValue':
            this.updateNameBoxValue(args.definedName, args.isRemove);
            break;
        case 'getElement':
            args.element = this.getFormulaBar();
            break;
        }
    }
    private isFormulaBarEdit(args: { [key: string]: Object }): void {
        const edit: boolean = this.parent.isEdit;
        if (edit && this.isGoto) {
            args.isEdit = true;
        } else {
            args.isEdit = false;
        }
    }

    private getFormulaBar(): HTMLTextAreaElement {
        return select('#' + this.parent.element.id + '_formula_input', this.parent.element);
    }
}
