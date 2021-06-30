import { Spreadsheet, DialogBeforeOpenEventArgs, editAlert, IOffset, IViewport } from '../index';
import { isValidation, checkDateFormat, applyCellFormat, workbookEditOperation, activeCellChanged, validationHighlight } from '../../workbook/common/event';
import { getCell, setCell } from '../../workbook/base/cell';
import { CellModel } from '../../workbook/base/cell-model';
import { FormValidatorModel, FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, EventHandler, remove, closest, isNullOrUndefined, select, Browser } from '@syncfusion/ej2-base';
import { Dialog } from '../services/dialog';
import { dialog, locale, initiateDataValidation, invalidData, ICellRenderer, editOperation, keyUp, focus } from '../common/index';
import { formulaBarOperation, removeDataValidation } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { setRow } from '../../workbook/base/row';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes } from '../../workbook/common/address';
import { CellFormatArgs } from '../../workbook/common/interface';
import { DropDownList, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { DialogModel, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { ValidationModel, ValidationType, ValidationOperator, CellStyleModel, getSheet, getSheetIndex, ColumnModel, Workbook } from '../../workbook/index';
import { getColumn, isLocked, getRowsHeight, getColumnsWidth } from '../../workbook/index';

/**
 * Represents Data Validation support for Spreadsheet.
 */
export class DataValidation {
    private parent: Spreadsheet;
    private data: { [key: string]: Object }[] = [];
    private listObj: DropDownList;
    private dataList: DropDownList;
    private typeData: { [key: string]: Object }[];
    private operatorData: { [key: string]: Object }[];

    /**
     * Constructor for the Spreadsheet Data Validation module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet Data Validation module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Data Validation module.
     *
     * @returns {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        const dataValPopup: HTMLElement = select('#' + this.parent.element.id + '_datavalidation-popup');
        if (dataValPopup) { dataValPopup.remove(); }
        this.parent = null;
    }

    private addEventListener(): void {
        EventHandler.add(this.parent.element, 'dblclick', this.listOpen, this);
        EventHandler.add(document, 'mousedown', this.mouseDownHandler, this);
        this.parent.on(initiateDataValidation, this.initiateDataValidationHandler, this);
        this.parent.on(invalidData, this.invalidDataHandler, this);
        this.parent.on(isValidation, this.checkDataValidation, this);
        this.parent.on(activeCellChanged, this.listHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(removeDataValidation, this.removeValidationHandler, this);
        this.parent.on(validationHighlight, this.InvalidElementHandler, this);
    }

    private removeEventListener(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.listOpen);
        EventHandler.remove(document, 'mousedown', this.mouseDownHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateDataValidation, this.initiateDataValidationHandler);
            this.parent.off(invalidData, this.invalidDataHandler);
            this.parent.off(isValidation, this.checkDataValidation);
            this.parent.off(activeCellChanged, this.listHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(removeDataValidation, this.removeValidationHandler);
            this.parent.off(validationHighlight, this.InvalidElementHandler);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private removeValidationHandler(e: MouseEvent): void {
        const range: string = this.getRange(this.parent.getActiveSheet().selectedRange);
        this.parent.removeDataValidation(range);
    }

    private mouseDownHandler(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const parEle: HTMLElement = closest(target, '.e-ddl') as HTMLElement;
        if (parEle && parEle.getAttribute('id') === this.parent.element.id + 'listValid_popup') {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: target.innerText });
        }
    }

    private keyUpHandler(e: KeyboardEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        if (closest(target, '.e-values') && dlgEle && e.keyCode !== 13) {
            const valuesCont: HTMLElement = dlgEle.querySelector('.e-values');
            const errorEle: HTMLElement = valuesCont.querySelector('.e-dlg-error');
            const footerCont: HTMLElement = dlgEle.querySelector('.e-footer-content');
            const primaryBut: HTMLElement = footerCont.querySelector('.e-primary');
            if (primaryBut.hasAttribute('disabled')) {
                primaryBut.removeAttribute('disabled');
            }
            if (errorEle) {
                valuesCont.removeChild(errorEle);
            }
        }
    }

    private listOpen(e: MouseEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        if (this.listObj && target.classList.contains('e-cell') && target.querySelector('.e-validation-list')) {
            this.listObj.showPopup();
        }
    }

    private invalidDataHandler(args: { isRemoveHighlight: boolean }): void {
        if (args.isRemoveHighlight) {
            this.parent.removeInvalidHighlight();
        } else {
            this.parent.addInvalidHighlight();
        }
    }

    private listHandler(): void {
        if (this.parent.allowDataValidation) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const indexes: number[] = getCellIndexes(sheet.activeCell);
            const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
            const column: ColumnModel = getColumn(sheet, indexes[1]);
            const tdEle: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
            let validation: ValidationModel;
            if (!tdEle) {
                return;
            }
            if (document.getElementsByClassName('e-validation-list')[0]) {
                remove(document.getElementsByClassName('e-validation-list')[0]);
                this.data = [];
            }
            if (cell && cell.validation) {
                validation = cell.validation;
            } else if (column && column.validation) {
                validation = column.validation;
            }
            if (validation && validation.type === 'List') {
                validation.ignoreBlank = !isNullOrUndefined(validation.ignoreBlank) ? validation.ignoreBlank : true;
                validation.inCellDropDown = !isNullOrUndefined(validation.inCellDropDown) ?
                    validation.inCellDropDown : true;
                if (validation.inCellDropDown) {
                    const ddlCont: HTMLElement = this.parent.createElement('div', { className: 'e-validation-list' });
                    const ddlEle: HTMLElement = this.parent.createElement('input', { id: this.parent.element.id + 'listValid' });
                    ddlCont.appendChild(ddlEle);
                    if (!validation.inCellDropDown) {
                        ddlCont.style.display = 'none';
                    }
                    tdEle.insertBefore(ddlCont, tdEle.firstChild);
                    const dataSource: { [key: string]: Object }[] = this.updateDataSource(cell, validation);
                    this.listObj = new DropDownList({
                        index: this.setDropDownListIndex(dataSource, cell, validation),
                        dataSource: dataSource,
                        fields: { text: 'text', value: 'id' },
                        width: '0px',
                        popupWidth: tdEle.offsetWidth - 1,
                        popupHeight: '200px',
                        change: () => { this.listValueChange(this.listObj.text); },
                        open: (args: PopupEventArgs) => {
                            args.popup.offsetX = - (tdEle.offsetWidth - 20) + 4;
                            args.popup.offsetY = -13;
                            // Positioning popup in mobile device based on transform css applied on virtual element as suggested by dropdown team
                            if (Browser.isDevice && this.parent.scrollModule) {
                                const offset: { left: IOffset, top: IOffset } = this.parent.scrollModule.offset;
                                const viewport: IViewport = this.parent.viewport;
                                args.popup.offsetY += viewport.topIndex ? offset.top.size -
                                    getRowsHeight(sheet, viewport.topIndex + 1, offset.top.idx, true) : 0;
                                args.popup.offsetX += viewport.leftIndex ? offset.left.size -
                                    getColumnsWidth(sheet, viewport.leftIndex + 1, offset.left.idx, true) : 0;
                                args.popup.refresh();
                            }
                        }
                    });
                    this.listObj.appendTo('#' + this.parent.element.id + 'listValid');
                }
            }
            if (cell && cell.validation) {
                cell.validation = validation;
            }
        }
    }

    private setDropDownListIndex(dataSource: { [key: string]: Object }[], cell: CellModel, validation: ValidationModel): number {
        if (cell && cell.value) {
            for (let dataIdx: number = 0, len: number = dataSource.length; dataIdx < len; dataIdx++) {
                if (dataSource[dataIdx].text === cell.value.toString()) {
                    return dataIdx;
                }
            }
        }
        return null;
    }

    private updateDataSource(cell: CellModel, validation: ValidationModel): { [key: string]: Object }[] {
        this.data = [];
        let count: number = 0;
        const value: string = validation.value1;
        const isRange: boolean = value.indexOf('=') !== -1;
        if (isRange) {
            const sheet: SheetModel = value.indexOf('!') > -1 ?
                getSheet(this.parent as Workbook, getSheetIndex(this.parent as Workbook, value.split('=')[1].split('!')[0])) : this.parent.getActiveSheet();
            const address: string = value.indexOf('!') > -1 ? value.split('!')[1] : value.split('=')[1];
            let indexes: number[];
            const range: string[] = address.split(':');
            if ((range[0].match(/[a-z]+$/ig) && range[1].match(/[a-z]+$/ig)) || (range[0].match(/^[0-9]/g) && range[1].match(/^[0-9]/g))) {
                const addressInfo: { startIdx: number, endIdx: number, isCol: boolean } = this.parent.getIndexes(address);
                if (addressInfo.isCol) {
                    indexes = [0, addressInfo.startIdx, sheet.usedRange.rowIndex, addressInfo.startIdx];
                } else {
                    indexes = [addressInfo.startIdx, 0, addressInfo.startIdx, sheet.usedRange.colIndex];
                }
            } else {
                indexes = getRangeIndexes(address);
            }
            for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (!sheet.rows[rowIdx]) { setRow(sheet, rowIdx, {}); }
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (!sheet.rows[rowIdx].cells) { setCell(rowIdx, colIdx, sheet, {}); }
                    count += 1;
                    cell = sheet.rows[rowIdx].cells[colIdx];
                    const data: string = this.parent.getDisplayText(cell) || '';
                    if (validation.ignoreBlank && data === '') { continue; }
                    this.data.push({ text: data, id: 'list-' + count });
                }
            }
        } else {
            const listValues: string[] = value.split(',');
            for (let idx: number = 0; idx < listValues.length; idx++) {
                count += 1;
                this.data.push({ text: listValues[idx], id: 'list-' + count });
            }
        }
        return this.data;
    }

    private listValueChange(value: string): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cellIdx: number[] = getIndexesFromAddress(sheet.activeCell);
        const cellObj: CellModel = Object.assign({}, getCell(cellIdx[0], cellIdx[1], sheet));
        if (sheet.isProtected && isLocked(cellObj, getColumn(sheet, cellIdx[1]))) {
            this.parent.notify(editAlert, null);
        } else {
            this.parent.notify(
                workbookEditOperation,
                { action: 'updateCellValue', address: sheet.activeCell, value: value });
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cellIdx);
            this.parent.trigger('cellSave', {
                value: value, oldValue: cellObj && cellObj.value, address: sheet.name + '!' + sheet.activeCell,
                displayText: this.parent.getDisplayText(getCell(cellIdx[0], cellIdx[1], sheet))
            });
        }
    }

    private getRange(range: string): string {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const indexes: number[] = getRangeIndexes(range);
        const maxRowCount: number = sheet.rowCount;
        const maxColCount: number = sheet.colCount;
        if (indexes[2] === maxRowCount - 1 && indexes[0] === 0) {
            range = range.replace(/[0-9]/g, '');
        } else if (indexes[3] === maxColCount - 1 && indexes[2] === 0) {
            range = range.replace(/\D/g, '');
        }
        return range;
    }

    private initiateDataValidationHandler(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let type: string;
        let operator: string;
        let value1: string;
        let value2: string;
        let ignoreBlank: boolean = true;
        let inCellDropDown: boolean = true;
        let isNew: boolean = true;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel;
        let range: string = sheet.selectedRange;
        const indexes: number[] = getRangeIndexes(range);
        range = this.getRange(range);
        for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
            if (sheet.rows[rowIdx]) {
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (sheet.rows[rowIdx].cells && sheet.rows[rowIdx].cells[colIdx]) {
                        cell = sheet.rows[rowIdx].cells[colIdx];
                        if (cell.validation) {
                            isNew = false;
                            type = cell.validation.type;
                            operator = cell.validation.operator;
                            value1 = cell.validation.value1;
                            value2 = cell.validation.value2;
                            ignoreBlank = !isNullOrUndefined(cell.validation.ignoreBlank) ?
                                cell.validation.ignoreBlank : ignoreBlank;
                            inCellDropDown = !isNullOrUndefined(cell.validation.inCellDropDown) ?
                                cell.validation.inCellDropDown : inCellDropDown;
                        }
                    }
                }
            }
        }
        if (!this.parent.element.querySelector('.e-datavalidation-dlg')) {
            const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogInst.show({
                width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-datavalidation-dlg',
                header: l10n.getConstant('DataValidation'),
                target: document.querySelector('.e-control.e-spreadsheet') as HTMLElement,
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'ValidationDialog', element: args.element,
                        target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content =
                        this.dataValidationContent(isNew, type, operator, value1, value2, ignoreBlank, inCellDropDown, range);
                    dialogInst.dialogInstance.dataBind();
                    focus(this.parent.element);
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('CLEARALL'),
                        cssClass: 'e-btn e-clearall-btn e-flat'
                    },
                    click: (): void => {
                        dialogInst.dialogInstance.content =
                            this.dataValidationContent(true, type, operator, value1, value2, ignoreBlank, inCellDropDown, range);
                        dialogInst.dialogInstance.dataBind();
                        focus(this.parent.element);
                    }
                },
                {
                    buttonModel: {
                        content: l10n.getConstant('APPLY'), isPrimary: true
                    },
                    click: (): void => {
                        this.dlgClickHandler(dialogInst);
                    }
                }]
            });
            dialogInst.dialogInstance.refresh();
        }
    }

    private dataValidationContent(
        isNew: boolean, type: string, operator: string, val1: string, val2: string, ignoreBlank: boolean,
        inCellDropDown: boolean, range: string): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const value1: string = isNew ? '0' : val1;
        const value2: string = isNew ? '0' : val2;
        const dlgContent: HTMLElement = this.parent.createElement('div', { className: 'e-validation-dlg' });
        const cellRangeCont: HTMLElement = this.parent.createElement('div', { className: 'e-cellrange' });
        const allowDataCont: HTMLElement = this.parent.createElement('div', { className: 'e-allowdata' });
        const valuesCont: HTMLElement = this.parent.createElement('div', { className: 'e-values' });
        const ignoreBlankCont: HTMLElement = this.parent.createElement('div', { className: 'e-ignoreblank' });
        dlgContent.appendChild(cellRangeCont);
        dlgContent.appendChild(allowDataCont);
        dlgContent.appendChild(valuesCont);
        dlgContent.appendChild(ignoreBlankCont);
        const cellRangeText: HTMLElement = this.parent.createElement(
            'span', { className: 'e-header', innerHTML: l10n.getConstant('CellRange') });
        const cellRangeEle: HTMLElement = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: range }
        });
        cellRangeCont.appendChild(cellRangeText);
        cellRangeCont.appendChild(cellRangeEle);
        const allowCont: HTMLElement = this.parent.createElement('div', { className: 'e-allow' });
        const dataCont: HTMLElement = this.parent.createElement('div', { className: 'e-data' });
        allowDataCont.appendChild(allowCont);
        allowDataCont.appendChild(dataCont);
        const allowText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Allow') });
        this.typeData = [
            { text: l10n.getConstant('WholeNumber'), id: 'type-1' },
            { text: l10n.getConstant('Decimal'), id: 'type-2' },
            { text: l10n.getConstant('Date'), id: 'type-3' },
            { text: l10n.getConstant('Time'), id: 'type-4' },
            { text: l10n.getConstant('TextLength'), id: 'type-5' },
            { text: l10n.getConstant('List'), id: 'type-6' }
        ];
        this.operatorData = [
            { text: l10n.getConstant('Between'), id: 'operator-1' },
            { text: l10n.getConstant('NotBetween'), id: 'operator-2' },
            { text: l10n.getConstant('EqualTo'), id: 'operator-3' },
            { text: l10n.getConstant('NotEqualTo'), id: 'operator-4' },
            { text: l10n.getConstant('Greaterthan'), id: 'operator-5' },
            { text: l10n.getConstant('Lessthan'), id: 'operator-6' },
            { text: l10n.getConstant('GreaterThanOrEqualTo'), id: 'operator-7' },
            { text: l10n.getConstant('LessThanOrEqualTo'), id: 'operator-8' }
        ];
        const allowSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
        let allowIdx: number = 0;
        if (!isNew) {
            for (let idx: number = 0; idx < this.typeData.length; idx++) {
                if (type === (this.typeData[idx].text as string).replace(' ', '')) {
                    allowIdx = idx;
                    break;
                }
            }
        }
        if (isNew || type !== 'List') {
            let dataIdx: number = 0;
            const dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Data') });
            const dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
            if (!isNew) {
                for (let idx: number = 0; idx < this.operatorData.length; idx++) {
                    if (operator === this.FormattedValue(this.operatorData[idx].text as string)) {
                        dataIdx = idx;
                        break;
                    }
                }
            }
            dataCont.appendChild(dataText);
            dataCont.appendChild(dataSelectEle);
            this.dataList = new DropDownList({
                dataSource: this.operatorData,
                index: dataIdx,
                popupHeight: '200px',
                change: () => { this.userInput(listObj, this.dataList); }
            });
            this.dataList.appendTo(dataSelectEle);
        } else {
            const ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle);
            const ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: inCellDropDown });
            ignoreBlankObj.appendTo(ignoreBlankEle);
        }
        allowCont.appendChild(allowText);
        allowCont.appendChild(allowSelectEle);
        const listObj: DropDownList = new DropDownList({
            dataSource: this.typeData,
            index: allowIdx,
            popupHeight: '200px',
            change: () => { this.userInput(listObj, this.dataList); }
        });
        listObj.appendTo(allowSelectEle);
        if (isNew || (listObj.value !== 'List' && (this.dataList.value === 'Between' || this.dataList.value === 'Not between'))) {
            const minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            const maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            const minimumText: HTMLElement =
                this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Minimum') });
            const maximumText: HTMLElement =
                this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Maximum') });
            const minimumInp: HTMLElement = this.parent.createElement('input', {
                id: 'minvalue',
                className: 'e-input', attrs: { value: value1 }
            });
            const maximumInp: HTMLElement = this.parent.createElement('input', {
                id: 'maxvalue',
                className: 'e-input', attrs: { value: value2 }
            });
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
            const numericMin: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('#minvalue');
            const numericMax: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('#maxvalue');
        } else if (!isNew || type === ' List') {
            const valueText: HTMLElement = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Sources')
            });
            const valueEle: HTMLElement = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        } else {
            const valueText: HTMLElement = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Value')
            });
            const valueEle: HTMLElement = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
        const isChecked: boolean = ignoreBlank;
        const ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
        ignoreBlankCont.appendChild(ignoreBlankEle);
        const ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('IgnoreBlank'), checked: isChecked });
        ignoreBlankObj.appendTo(ignoreBlankEle);
        return dlgContent;
    }

    private userInput(listObj: DropDownList, listObj1: DropDownList): void {
        const dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        const dlgCont: HTMLElement = dlgEle.querySelector('.e-validation-dlg');
        const allowDataCont: HTMLElement = dlgCont.querySelector('.e-allowdata');
        const valuesCont: HTMLElement = dlgCont.querySelector('.e-values');
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dataCont: HTMLElement = allowDataCont.querySelector('.e-data');
        while (valuesCont.lastChild) {
            valuesCont.removeChild(valuesCont.lastChild);
        }
        if (listObj.value === 'List') {
            while (dataCont.lastChild) {
                dataCont.removeChild(dataCont.lastChild);
            }
            const ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle);
            const ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: true });
            ignoreBlankObj.appendTo(ignoreBlankEle);
        } else {
            if (dataCont.getElementsByClassName('e-checkbox-wrapper')[0]) {
                while (dataCont.lastChild) {
                    dataCont.removeChild(dataCont.lastChild);
                }
                const dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Data' });
                const dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
                dataCont.appendChild(dataText);
                dataCont.appendChild(dataSelectEle);
                listObj1.appendTo(dataSelectEle);
            }
        }
        if (listObj.value !== 'List' && (listObj1.value === 'Between' || listObj1.value === 'Not between')) {
            const minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            const maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            const minimumText: HTMLElement =
                this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Minimum') });
            const maximumText: HTMLElement =
                this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Maximum') });
            const minimumInp: HTMLElement = this.parent.createElement('input', { id: 'min', className: 'e-input', attrs: { value: '0' } });
            const maximumInp: HTMLElement = this.parent.createElement('input', { id: 'max', className: 'e-input', attrs: { value: '0' } });
            const numericMin: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('min');
            const numericMax: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('max');
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
        } else {
            const text: string = listObj.value === 'List' ? l10n.getConstant('Sources') : l10n.getConstant('Value');
            const valueText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: text });
            const valueEle: HTMLElement = listObj.value === 'List' ? this.parent.createElement('input', {
                className: 'e-input',
                attrs: { placeholder: 'Enter value' }
            }) :
                this.parent.createElement('input', { className: 'e-input', attrs: { value: '0' } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
    }

    private dlgClickHandler(dialogInst: Dialog): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let isValidList: boolean = true;
        let errorMsg: string;
        const dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        const dlgFooter: HTMLElement = dlgEle.querySelector('.e-footer-content');
        const dlgContEle: HTMLElement = dlgEle.getElementsByClassName('e-dlg-content')[0].
            getElementsByClassName('e-validation-dlg')[0] as HTMLElement;
        const allowData: HTMLElement = dlgContEle.getElementsByClassName('e-allowdata')[0] as HTMLElement;
        const allowEle: HTMLElement = allowData.getElementsByClassName('e-allow')[0].getElementsByTagName('input')[0];
        const dataEle: HTMLElement = allowData.getElementsByClassName('e-data')[0].getElementsByTagName('input')[0];
        const values: HTMLElement = dlgContEle.getElementsByClassName('e-values')[0] as HTMLElement;
        const value1: string = values.getElementsByTagName('input')[0].value;
        const value2: string = values.getElementsByTagName('input')[1] ? values.getElementsByTagName('input')[1].value : '';
        const ignoreBlank: boolean = dlgContEle.querySelector('.e-ignoreblank').querySelector('.e-checkbox-wrapper').
            getAttribute('aria-checked') === 'true' ? true : false;
        const inCellDropDown: boolean = allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper') ?
            allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper').querySelector('.e-check') ? true : false : null;
        const range: string = (dlgContEle.querySelector('.e-cellrange').getElementsByTagName('input')[0] as HTMLInputElement).value;
        let operator: string;
        let type: string = (allowEle as HTMLInputElement).value;
        if (dataEle) {
            operator = (dataEle as HTMLInputElement).value;
            operator = this.FormattedValue(operator);
        }
        if (type) {
            type = type.replace(' ', '');
        }
        let rangeAdd: string[] = [];
        const valArr: string[] = [];
        if (value1 !== '') {
            valArr.push(value1);
        }
        if (value2 !== '') {
            valArr.push(value2);
        }
        if (type === 'List') {
            if (value1.indexOf('=') !== -1) {
                if (value1.indexOf(':') !== -1) {
                    const address: string = value1.indexOf('!') > -1 ? value1.split('!')[1] : value1.split('=')[1];
                    const isSheetNameValid: boolean = value1.indexOf('!') > -1 ?
                        getSheetIndex(this.parent as Workbook, value1.split('=')[1].split('!')[0]) > -1 : true;
                    rangeAdd = address.split(':');
                    const isSingleCol: boolean = address.match(/[a-z]/gi) ?
                        rangeAdd[0].replace(/[0-9]/g, '') === rangeAdd[1].replace(/[0-9]/g, '') : false;
                    const isSingleRow: boolean = address.match(/\d/g) ?
                        rangeAdd[0].replace(/\D/g, '') === rangeAdd[1].replace(/\D/g, '') : false;
                    isValidList = isSheetNameValid ? (isSingleCol ? true : isSingleRow ? true : false) : false;
                    if (!isValidList) {
                        errorMsg = l10n.getConstant('DialogError');
                    }
                }
            } else if (value1.length > 256) {
                isValidList = false;
                errorMsg = l10n.getConstant('ListLengthError');
            }
        }
        if (type !== 'List' || isValidList) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const format: string = type;
            const validDlg: { isValidate: boolean, errorMsg: string } = this.isDialogValidator(valArr, format, operator);
            errorMsg = validDlg.errorMsg;
            isValidList = validDlg.isValidate;
            if (isValidList) {
                const indexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
                if (sheet && sheet.rows[indexes[0]] && sheet.rows[indexes[0]].cells[indexes[1]] &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation.type === 'List') {
                    const tdEle: HTMLElement = this.parent.getMainContent().
                        getElementsByTagName('tr')[indexes[0]].getElementsByClassName('e-cell')[indexes[1]] as HTMLElement;
                    if (tdEle && tdEle.getElementsByClassName('e-validation-list')[0]) {
                        tdEle.removeChild(tdEle.getElementsByClassName('e-validation-list')[0]);
                        this.listObj.destroy();
                    }
                }
                const rules: ValidationModel = {
                    type: type as ValidationType, operator: operator as ValidationOperator,
                    value1: value1, value2: value2, ignoreBlank: ignoreBlank, inCellDropDown: inCellDropDown
                };
                this.parent.addDataValidation(rules, range);
                if (type === 'List' && isValidList) {
                    this.listHandler();
                }
                if (!document.getElementsByClassName('e-validationerror-dlg')[0]) {
                    if (dialogInst.dialogInstance) {
                        dialogInst.dialogInstance.hide();
                    } else {
                        dialogInst.hide();
                    }
                }
            }
        }
        if (!isValidList) {
            const errorEle: HTMLElement = this.parent.createElement('div', {
                className: 'e-dlg-error', id: 'e-invalid', innerHTML: errorMsg
            });
            values.appendChild(errorEle);
            dlgFooter.querySelector('.e-primary').setAttribute('disabled', 'true');
        }
    }

    private FormattedValue(value: string): string {
        switch (value) {
        case 'Between':
            value = 'Between';
            break;
        case 'Not between':
            value = 'NotBetween';
            break;
        case 'Equal to':
            value = 'EqualTo';
            break;
        case 'Not equal to':
            value = 'NotEqualTo';
            break;
        case 'Greater than':
            value = 'GreaterThan';
            break;
        case 'Less than':
            value = 'LessThan';
            break;
        case 'Greater than or equal to':
            value = 'GreaterThanOrEqualTo';
            break;
        case 'Less than or equal to':
            value = 'LessThanOrEqualTo';
            break;
        default:
            value = 'Between';
            break;
        }
        return value;
    }

    private isDialogValidator(values: string[], type: string, operator: string): { isValidate: boolean, errorMsg: string } {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let count: number = 0;
        let isEmpty: boolean = false;
        let formValidation: { isValidate: boolean, errorMsg: string };
        if (type === 'List') {
            isEmpty = values.length > 0 ? false : true;
        } else {
            if (operator === 'Between' || operator === 'NotBetween') {
                isEmpty = values.length === 2 ? false : true;
            } else {
                isEmpty = values.length > 0 ? false : true;
            }
        }
        if (!isEmpty) {
            for (let idx: number = 0; idx < values.length; idx++) {
                formValidation = this.formatValidation(values[idx], type);
                if (formValidation.isValidate) {
                    count = count + 1;
                } else {
                    break;
                }
            }
            formValidation.isValidate = count === values.length ? true : false;
        } else {
            formValidation = { isValidate: false, errorMsg: l10n.getConstant('EmptyError') };
        }
        return { isValidate: formValidation.isValidate, errorMsg: formValidation.errorMsg };
    }

    private isValidationHandler(args: { value: string, range: number[], sheetIdx: number }): { isValidate: boolean, errorMsg: string } {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.value = args.value ? args.value : '';
        let isValidate: boolean;
        let errorMsg: string;
        const enterValue: string | number = args.value;
        const sheet: SheetModel = this.parent.sheets[args.sheetIdx];
        let validation: ValidationModel;
        const cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        const column: ColumnModel = getColumn(sheet, args.range[1]);
        if (cell && cell.validation) {
            validation = cell.validation;
        } else if (column && column.validation) {
            validation = column.validation;
        }
        if (validation) {
            let value: string | number = args.value;
            let value1: string | number = validation.value1;
            let value2: string | number = validation.value2;
            const opt: string = validation.operator;
            const type: string = validation.type;
            const ignoreBlank: boolean = !isNullOrUndefined(validation.ignoreBlank) ? validation.ignoreBlank : true;
            const formValidation: { isValidate: boolean, errorMsg: string } = this.formatValidation(args.value, type);
            isValidate = formValidation.isValidate;
            errorMsg = formValidation.errorMsg;
            if (isValidate) {
                isValidate = false;
                if (type === 'Date' || type === 'Time') {
                    args.value = args.value.slice(args.value.indexOf(' ')+1, args.value.length);
                    for (let idx: number = 0; idx <= 3; idx++) {
                        args.value = idx === 0 ? args.value : idx === 1 ? validation.value1 : validation.value2;
                        const dateEventArgs: { [key: string]: string | number } = {
                            value: args.value,
                            rowIndex: args.range[0],
                            colIndex: args.range[1],
                            sheetIndex: args.sheetIdx,
                            updatedVal: ''
                        };
                        if (args.value !== '') {
                            this.parent.notify(checkDateFormat, dateEventArgs);
                        }
                        const updatedVal: string = dateEventArgs.updatedVal as string;
                        if (idx == 0 && updatedVal == '') {
                            value = args.value;
                        } else if (idx == 0) {
                            value = updatedVal;
                        } else if (idx == 1) {
                            value1 = updatedVal;
                        } else {
                            value2 = updatedVal;
                        }
                    }
                } else if (validation.type === 'TextLength') {
                    value = args.value.toString().length.toString();
                }
                if (type === 'List') {
                    if (value1.indexOf('=') !== -1) {
                        for (let idx: number = 0; idx < this.data.length; idx++) {
                            if (args.value.toString() === this.data[idx].text) {
                                isValidate = true;
                            }
                        }
                    } else {
                        const values: string[] = (value1 as string).split(',');
                        for (let idx: number = 0; idx < values.length; idx++) {
                            if (args.value.toString() === values[idx]) {
                                isValidate = true;
                            }
                        }
                    }
                } else {
                    if (type === 'Decimal' || type === 'Time') {
                        value = parseFloat(value.toString());
                        value1 = parseFloat(value1.toString());
                        value2 = value2 ? parseFloat(value2.toString()) : null;
                    } else {
                        value = parseInt(value.toString(), 10);
                        value1 = parseInt(value1.toString(), 10);
                        value2 = value2 ? parseInt(value2.toString(), 10) : null;
                    }
                    switch (opt) {
                    case 'EqualTo':
                        if (value === value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'NotEqualTo':
                        if (value !== value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'Between':
                        if (value >= value1 && value <= value2) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'NotBetween':
                        if (value >= value1 && value <= value2) {
                            isValidate = false;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = true;
                        }
                        break;
                    case 'GreaterThan':
                        if (value > value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'LessThan':
                        if (value < value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'GreaterThanOrEqualTo':
                        if (value >= value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    case 'LessThanOrEqualTo':
                        if (value <= value1) {
                            isValidate = true;
                        } else if (ignoreBlank && enterValue === '') {
                            isValidate = true;
                        } else {
                            isValidate = false;
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        }
        errorMsg = l10n.getConstant('ValidationError');
        if (isValidate) {
            const style: CellStyleModel = this.parent.getCellStyleValue(['backgroundColor', 'color'], [args.range[0], args.range[1]]);
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: args.range[0],
                colIdx: args.range[1], isHeightCheckNeeded: true, manualUpdate: true,
                onActionUpdate: true
            });
        }
        return { isValidate: isValidate, errorMsg: errorMsg };
    }

    private checkDataValidation(args: { value: string, range: number[], sheetIdx: number, isCell: boolean }): void {
        const isValid: { isValidate: boolean, errorMsg: string } = this.isValidationHandler({
            value: args.value, range: args.range, sheetIdx: args.sheetIdx
        });
        if (!isValid.isValidate && args.isCell) {
            this.validationErrorHandler(isValid.errorMsg);
        }
        this.parent.allowDataValidation = isValid.isValidate;
    }

    private formatValidation(value: string, type: string): { isValidate: boolean, errorMsg: string } {
        const sheetPanel: HTMLElement = this.parent.element.getElementsByClassName('e-sheet-panel')[0] as HTMLElement;
        let errorMsg: string;
        const formEle: HTMLElement = this.parent.createElement('form', {
            id: 'formId',
            className: 'form-horizontal'
        });
        const inputEle: HTMLElement = this.parent.createElement('input', {
            id: 'e-validation', innerHTML: value
        });
        inputEle.setAttribute('name', 'validation');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('value', value);

        formEle.appendChild(inputEle);
        sheetPanel.appendChild(formEle);

        let options: FormValidatorModel;
        switch (type) {
        case 'Date':
            options = {
                rules: {
                    'validation': { date: true }
                },
                customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                    errorMsg = error.innerText;
                }
            };
            break;
        case 'Decimal':
            options = {
                rules: {
                    'validation': { number: true }
                },
                customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                    errorMsg = error.innerText;
                }
            };
            break;
        case 'WholeNumber':
            options = {
                rules: {
                    'validation': { regex: /^\d*\.?[0]*$/ }
                },
                customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                    errorMsg = error.innerText;
                }
            };
            break;
        default:
            break;
        }
        const formObj: FormValidator = new FormValidator('#formId', options);
        const isValidate: boolean = formObj.validate();
        sheetPanel.removeChild(sheetPanel.getElementsByClassName('form-horizontal')[0]);
        return { isValidate: isValidate, errorMsg: errorMsg };
    }

    private InvalidElementHandler(
        args: { isRemoveHighlightedData: boolean, rowIdx: number, colIdx: number, td?: HTMLElement }): void {
        const rowIdx: number = args.rowIdx;
        const colIdx: number = args.colIdx;
        const isRemoveHighlightedData: boolean = args.isRemoveHighlightedData;
        if (!isRemoveHighlightedData) {
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: { backgroundColor: '#ffff00', color: '#ff0000' }, rowIdx: rowIdx, colIdx: colIdx, cell: args.td
            });
        } else if (isRemoveHighlightedData) {
            const style: CellStyleModel =
                this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]);
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: rowIdx, colIdx: colIdx, cell: args.td
            });
        }

    }

    private validationErrorHandler(error: string): void {
        const el: HTMLElement = document.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.element.querySelector('.e-validationerror-dlg')) {
            const erroDialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            const disableCancel: boolean = false;
            const dlgModel: DialogModel = {
                width: 400, height: 200, isModal: true, showCloseIcon: true, cssClass: 'e-validationerror-dlg',
                target: document.querySelector('.e-control.e-spreadsheet') as HTMLElement,
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'ValidationErrorDialog',
                        element: args.element, target: args.target, cancel: args.cancel, content: error
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        this.errorDlgHandler(erroDialogInst, 'Cancel');
                        args.cancel = true;
                    }
                    el.focus();
                    erroDialogInst.dialogInstance.content = dlgArgs.content; erroDialogInst.dialogInstance.dataBind();
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Retry'), isPrimary: true
                    },
                    click: (): void => {
                        this.errorDlgHandler(erroDialogInst, 'Retry');
                    }
                },
                {
                    buttonModel: {
                        content: l10n.getConstant('Cancel')
                    },
                    click: (): void => {
                        this.errorDlgHandler(erroDialogInst, 'Cancel');
                    }
                }]
            };
            erroDialogInst.show(dlgModel, disableCancel);
        }
    }

    private errorDlgHandler(errorDialogInst: Dialog, buttonName: string): void {
        if (buttonName === 'Retry') {
            const el: HTMLElement = document.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
            errorDialogInst.hide();
            if (el.innerText) {
                const range: Range = document.createRange();
                range.setStart(el.childNodes[0], 0);
                range.setEnd(el.childNodes[0], el.innerText.length);
                const selection: Selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                if (this.listObj) {
                    this.listObj.showPopup();
                }
            }
        } else {
            const indexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
            const cell: CellModel  = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
            const value: string = cell ? this.parent.getDisplayText(cell) : '';
            this.parent.notify(editOperation, {
                action: 'cancelEdit', value: value, refreshFormulaBar: true,
                refreshEditorElem: true, isAppend: false, trigEvent: true
            });
            errorDialogInst.hide();
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'dataValidation';
    }
}
