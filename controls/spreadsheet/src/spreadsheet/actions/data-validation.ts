import { Spreadsheet } from '../index';
import { isValidation, checkDateFormat, applyCellFormat, workbookEditOperation, activeCellChanged } from '../../workbook/common/event';
import { getCell, setCell } from '../../workbook/base/cell';
import { CellModel } from '../../workbook/base/cell-model';
import { FormValidatorModel, FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, EventHandler, remove, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '../services/dialog';
import { dialog, locale, initiateDataValidation, invalidData, ICellRenderer, editOperation, keyUp } from '../common/index';
import { formulaBarOperation } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { setRow } from '../../workbook/base/row';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes } from '../../workbook/common/address';
import { CellFormatArgs } from '../../workbook/common/interface';
import { DropDownList, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { DialogModel } from '@syncfusion/ej2-popups';
import { ValidationModel, ValidationType, ValidationOperator } from '../../workbook';

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
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Data Validation module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        let dataValPopup: HTMLElement = document.querySelector('#' + this.parent.element.id + '_datavalidation-popup');
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
    }

    private removeEventListener(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.listOpen);
        EventHandler.remove(document, 'mousedown', this.mouseDownHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateDataValidation, this.initiateDataValidationHandler);
            this.parent.off(invalidData, this.invalidDataHandler);
            this.parent.off(isValidation, this.checkDataValidation);
            this.parent.off(activeCellChanged, this.listHandler);
            this.parent.on(keyUp, this.keyUpHandler, this);
        }
    }

    private mouseDownHandler(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        let parEle: HTMLElement = closest(target, '.e-ddl') as HTMLElement;
        if (parEle && parEle.getAttribute('id') === 'listValid_popup' ) {
            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: target.innerText });
            }
    }

    private keyUpHandler(e: KeyboardEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
        let dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        if (closest(target, '.e-values') && dlgEle && e.keyCode !== 13) {
            let valuesCont: HTMLElement = dlgEle.querySelector('.e-values');
            let errorEle: HTMLElement = valuesCont.querySelector('.e-dlg-error');
            let footerCont: HTMLElement = dlgEle.querySelector('.e-footer-content');
            let primaryBut: HTMLElement = footerCont.querySelector('.e-primary');
            if (primaryBut.hasAttribute('disabled')) {
                primaryBut.removeAttribute('disabled');
            }
            if (errorEle) {
                valuesCont.removeChild(errorEle);
            }
        }
    }

    private listOpen(e: MouseEvent): void {
        let target: HTMLElement = e.target as HTMLElement;
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
            let sheet: SheetModel = this.parent.getActiveSheet();
            let mainCont: HTMLElement = this.parent.getMainContent() as HTMLElement;
            let indexes: number[] = getCellIndexes(sheet.activeCell);
            let colIdx: number = indexes[1];
            let rowIdx: number = indexes[0];
            if (this.parent.scrollSettings.enableVirtualization) {
                rowIdx = rowIdx >= this.parent.viewport.topIndex ?
                    rowIdx - this.parent.viewport.topIndex : rowIdx;
                colIdx = colIdx >= this.parent.viewport.leftIndex ?
                    colIdx - this.parent.viewport.leftIndex : colIdx;
            }
            let cell: CellModel = getCell(rowIdx, colIdx, sheet);
            let tr: HTMLElement = mainCont.getElementsByTagName('tr')[rowIdx];
            if (cell && tr) {
                let tdEle: HTMLElement = tr.getElementsByClassName('e-cell')[colIdx] as HTMLElement;
                if (!tdEle) {
                    return;
                }
                if (document.getElementsByClassName('e-validation-list')[0]) {
                    remove(document.getElementsByClassName('e-validation-list')[0]);
                    this.data = [];
                }
                if (cell.validation && cell.validation.type === 'List') {
                    cell.validation.ignoreBlank = !isNullOrUndefined(cell.validation.ignoreBlank) ? cell.validation.ignoreBlank : true;
                    cell.validation.inCellDropDown = !isNullOrUndefined(cell.validation.inCellDropDown) ?
                     cell.validation.inCellDropDown : true;
                    if (cell.validation.inCellDropDown) {
                    let ddlCont: HTMLElement = this.parent.createElement('div', { className: 'e-validation-list' });
                    let ddlEle: HTMLElement = this.parent.createElement('input', { id: 'listValid' });
                    ddlCont.appendChild(ddlEle);
                    if (!cell.validation.inCellDropDown) {
                        ddlCont.style.display = 'none';
                    }
                    tdEle.insertBefore(ddlCont, tdEle.firstChild);
                    this.listObj = new DropDownList({
                        index: 0,
                        dataSource: this.data,
                        fields: { text: 'text', value: 'id' },
                        width: '0px',
                        popupWidth: '200px',
                        popupHeight: '200px',
                        beforeOpen: () => {
                            this.listObj.popupWidth = tdEle.offsetWidth - 1;
                            this.data = [];
                            this.updateDataSource(this.listObj, cell);
                        },
                        change: () => { this.listValueChange(this.listObj.text); },
                        open: (args: PopupEventArgs) => {
                            args.popup.offsetX = - (tdEle.offsetWidth - 20) + 4;
                            args.popup.offsetY = -13;
                        }
                    });
                    this.listObj.appendTo('#listValid');
                }
            }
            }
        }
    }

    private updateDataSource(listObj: DropDownList, cell: CellModel): void {
        let count: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let value: string = cell.validation.value1.toUpperCase();
        let isRange: boolean = value.indexOf('=') !== -1 ? true : false;
        if (isRange) {
            let indexes: number[] = getRangeIndexes(value);
            for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (!sheet.rows[rowIdx]) { setRow(sheet, rowIdx, {}); }
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (!sheet.rows[rowIdx].cells) { setCell(rowIdx, colIdx, sheet, {}); }
                    count += 1;
                    cell = sheet.rows[rowIdx].cells[colIdx];
                    let data: string = this.parent.getDisplayText(cell) ? this.parent.getDisplayText(cell) : '';
                    this.data.push({ text: data, id: 'list-' + count });
                }
            }
        } else {
            let listValues: string[] = cell.validation.value1.split(',');
            for (let idx: number = 0; idx < listValues.length; idx++) {
                count += 1;
                this.data.push({ text: listValues[idx], id: 'list-' + count });
            }
        }
        listObj.dataSource = this.data;
    }

    private listValueChange(value: string): void {
        let cellIdx: number[] = getIndexesFromAddress(this.parent.getActiveSheet().activeCell);
        this.parent.notify(
            workbookEditOperation,
            { action: 'updateCellValue', address: this.parent.getActiveSheet().activeCell, value: value });
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cellIdx);
    }

    private initiateDataValidationHandler(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let type: string;
        let operator: string;
        let value1: string;
        let value2: string;
        let ignoreBlank: boolean = true;
        let inCellDropDown: boolean = true;
        let isNew: boolean = true;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel;
        let indexes: number[] = getRangeIndexes(sheet.selectedRange);
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
                            ignoreBlank = cell.validation.ignoreBlank;
                            inCellDropDown = cell.validation.inCellDropDown;
                        }
                    }
                }
            }
        }
        if (!this.parent.element.querySelector('.e-datavalidation-dlg')) {
            let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogInst.show({
                width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-datavalidation-dlg',
                header: l10n.getConstant('DataValidation'),
                target: document.querySelector('.e-control.e-spreadsheet') as HTMLElement,
                beforeOpen: (): void => {
                    dialogInst.dialogInstance.content =
                        this.dataValidationContent(isNew, type, operator, value1, value2, ignoreBlank, inCellDropDown);
                    dialogInst.dialogInstance.dataBind();
                    this.parent.element.focus();
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('CLEARALL'),
                        cssClass: 'e-btn e-clearall-btn e-flat'
                    },
                    click: (): void => {
                        dialogInst.dialogInstance.content =
                            this.dataValidationContent(true, type, operator, value1, value2, ignoreBlank, inCellDropDown);
                        dialogInst.dialogInstance.dataBind();
                        this.parent.element.focus();
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

    // tslint:disable-next-line:max-func-body-length
    private dataValidationContent(
        isNew: boolean, type: string, operator: string, val1: string, val2: string, ignoreBlank: boolean,
        inCellDropDown: boolean): HTMLElement {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let value1: string = isNew ? '0' : val1;
        let value2: string = isNew ? '0' : val2;
        let dlgContent: HTMLElement = this.parent.createElement('div', { className: 'e-validation-dlg' });
        let cellRangeCont: HTMLElement = this.parent.createElement('div', { className: 'e-cellrange' });
        let allowDataCont: HTMLElement = this.parent.createElement('div', { className: 'e-allowdata' });
        let valuesCont: HTMLElement = this.parent.createElement('div', { className: 'e-values' });
        let ignoreBlankCont: HTMLElement = this.parent.createElement('div', { className: 'e-ignoreblank' });
        dlgContent.appendChild(cellRangeCont);
        dlgContent.appendChild(allowDataCont);
        dlgContent.appendChild(valuesCont);
        dlgContent.appendChild(ignoreBlankCont);
        let cellRangeText: HTMLElement = this.parent.createElement(
            'span', { className: 'e-header', innerHTML: l10n.getConstant('CellRange') });
        let cellRangeEle: HTMLElement = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: this.parent.getActiveSheet().selectedRange }
        });
        cellRangeCont.appendChild(cellRangeText);
        cellRangeCont.appendChild(cellRangeEle);
        let allowCont: HTMLElement = this.parent.createElement('div', { className: 'e-allow' });
        let dataCont: HTMLElement = this.parent.createElement('div', { className: 'e-data' });
        allowDataCont.appendChild(allowCont);
        allowDataCont.appendChild(dataCont);
        let allowText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Allow') });
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
        let allowSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
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
            let dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: l10n.getConstant('Data') });
            let dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
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
            let ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle);
            let ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: inCellDropDown });
            ignoreBlankObj.appendTo(ignoreBlankEle);
        }
        allowCont.appendChild(allowText);
        allowCont.appendChild(allowSelectEle);
        let listObj: DropDownList = new DropDownList({
            dataSource: this.typeData,
            index: allowIdx,
            popupHeight: '200px',
            change: () => { this.userInput(listObj, this.dataList); }
        });
        listObj.appendTo(allowSelectEle);
        if (isNew || (listObj.value !== 'List' && (this.dataList.value === 'Between' || this.dataList.value === 'Not between'))) {
            let minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            let maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            let minimumText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Minimum' });
            let maximumText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Maximum' });
            let minimumInp: HTMLElement = this.parent.createElement('input', {
                id: 'minvalue',
                className: 'e-input', attrs: { value: value1 }
            });
            let maximumInp: HTMLElement = this.parent.createElement('input', {
                id: 'maxvalue',
                className: 'e-input', attrs: { value: value2 }
            });
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
            let numericMin: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('#minvalue');
            let numericMax: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('#maxvalue');
        } else if (!isNew || type === ' List') {
            let valueText: HTMLElement = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Sources')
            });
            let valueEle: HTMLElement = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        } else {
            let valueText: HTMLElement = this.parent.createElement('span', {
                className: 'e-header', innerHTML: l10n.getConstant('Value')
            });
            let valueEle: HTMLElement = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
        let isChecked: boolean = ignoreBlank;
        let ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
        ignoreBlankCont.appendChild(ignoreBlankEle);
        let ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('IgnoreBlank'), checked: isChecked });
        ignoreBlankObj.appendTo(ignoreBlankEle);
        return dlgContent;
    }

    private userInput(listObj: DropDownList, listObj1: DropDownList): void {
        let dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        let dlgCont: HTMLElement = dlgEle.querySelector('.e-validation-dlg');
        let allowDataCont: HTMLElement = dlgCont.querySelector('.e-allowdata');
        let valuesCont: HTMLElement = dlgCont.querySelector('.e-values');
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dataCont: HTMLElement = allowDataCont.querySelector('.e-data');
        let opeEle: HTMLElement = dataCont.querySelector('.e-valid-input');
        while (valuesCont.lastChild) {
            valuesCont.removeChild(valuesCont.lastChild);
        }
        if (listObj.value === 'List') {
            while (dataCont.lastChild) {
                dataCont.removeChild(dataCont.lastChild);
            }
            let ignoreBlankEle: HTMLElement = this.parent.createElement('input', { className: 'e-checkbox' });
            dataCont.appendChild(ignoreBlankEle);
            let ignoreBlankObj: CheckBox = new CheckBox({ label: l10n.getConstant('InCellDropDown'), checked: true });
            ignoreBlankObj.appendTo(ignoreBlankEle);
        } else {
            if (dataCont.getElementsByClassName('e-checkbox-wrapper')[0]) {
                while (dataCont.lastChild) {
                    dataCont.removeChild(dataCont.lastChild);
                }
                let dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Data' });
                let dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
                dataCont.appendChild(dataText);
                dataCont.appendChild(dataSelectEle);
                listObj1.appendTo(dataSelectEle);
            }
        }
        if (listObj.value !== 'List' && (listObj1.value === 'Between' || listObj1.value === 'Not between')) {
            let minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            let maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            let minimumText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Minimum' });
            let maximumText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'Maximum' });
            let minimumInp: HTMLElement = this.parent.createElement('input', { id: 'min', className: 'e-input', attrs: { value: '0' } });
            let maximumInp: HTMLElement = this.parent.createElement('input', { id: 'max', className: 'e-input', attrs: { value: '0' } });
            let numericMin: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMin.appendTo('min');
            let numericMax: NumericTextBox = new NumericTextBox({
                value: 0
            });
            numericMax.appendTo('max');
            minimumCont.appendChild(minimumText);
            minimumCont.appendChild(minimumInp);
            maximumCont.appendChild(maximumText);
            maximumCont.appendChild(maximumInp);
        } else {
            let text: string = listObj.value === 'List' ? l10n.getConstant('Sources') : l10n.getConstant('Value');
            let valueText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: text });
            let valueEle: HTMLElement = listObj.value === 'List' ? this.parent.createElement('input', {
                className: 'e-input',
                attrs: { placeholder: 'Enter value' }
            }) :
                this.parent.createElement('input', { className: 'e-input', attrs: { value: '0' } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        }
    }

    private dlgClickHandler(dialogInst: Dialog): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let isValidList: boolean = true;
        let errorMsg: string;
        let dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        let dlgFooter: HTMLElement = dlgEle.querySelector('.e-footer-content');
        let dlgContEle: HTMLElement = dlgEle.getElementsByClassName('e-dlg-content')[0].
            getElementsByClassName('e-validation-dlg')[0] as HTMLElement;
        let allowData: HTMLElement = dlgContEle.getElementsByClassName('e-allowdata')[0] as HTMLElement;
        let allowEle: HTMLElement = allowData.getElementsByClassName('e-allow')[0].getElementsByTagName('input')[0];
        let dataEle: HTMLElement = allowData.getElementsByClassName('e-data')[0].getElementsByTagName('input')[0];
        let values: HTMLElement = dlgContEle.getElementsByClassName('e-values')[0] as HTMLElement;
        let value1: string = values.getElementsByTagName('input')[0].value;
        let value2: string = values.getElementsByTagName('input')[1] ? values.getElementsByTagName('input')[1].value : '';
        let ignoreBlank: boolean = dlgContEle.querySelector('.e-ignoreblank').querySelector('.e-checkbox-wrapper').
            getAttribute('aria-checked') === 'true' ? true : false;
        let inCellDropDown: boolean = allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper') ?
            allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper').querySelector('.e-check') ? true : false : null;
        let range: string = (dlgContEle.querySelector('.e-cellrange').getElementsByTagName('input')[0] as HTMLInputElement).value;
        let cell: CellModel;
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
        let valArr: string[] = [];
        if (value1 !== '') {
            valArr.push(value1);
        }
        if (value2 !== '') {
            valArr.push(value2);
        }
        if (type === 'List') {
            if (value1.indexOf('=') !== -1) {
                if (value1.indexOf(':') !== -1) {
                    rangeAdd = value1.split(':');
                    let arr1: string[] = rangeAdd;
                    let arr2: string[] = rangeAdd;
                    let isSingleCol: boolean = arr1[0].replace(/[0-9]/g, '').replace('=', '') ===
                        arr1[1].replace(/[0-9]/g, '') ? true : false;
                    let isSingleRow: boolean = arr2[0].replace(/\D/g, '').replace('=', '') === arr2[1].replace(/\D/g, '') ? true : false;
                    isValidList = isSingleCol ? true : isSingleRow ? true : false;
                    if (!isValidList) {
                        errorMsg = l10n.getConstant('DialogError');
                    }
                }
            }
        }
        if (type !== 'List' || isValidList) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            let format: string = type;
            let validDlg: { isValidate: boolean, errorMsg: string } = this.isDialogValidator(valArr, format, operator);
            errorMsg = validDlg.errorMsg;
            isValidList = validDlg.isValidate;
            if (isValidList) {
                let indexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
                if (sheet && sheet.rows[indexes[0]] && sheet.rows[indexes[0]].cells[indexes[1]] &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation &&
                    sheet.rows[indexes[0]].cells[indexes[1]].validation.type === 'List') {
                    let tdEle: HTMLElement = this.parent.getMainContent().
                        getElementsByTagName('tr')[indexes[0]].getElementsByClassName('e-cell')[indexes[1]] as HTMLElement;
                    if (tdEle && tdEle.getElementsByClassName('e-validation-list')[0]) {
                        tdEle.removeChild(tdEle.getElementsByClassName('e-validation-list')[0]);
                        this.listObj.destroy();
                    }
                }
                let rules: ValidationModel = {
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
            let errorEle: HTMLElement = this.parent.createElement('div', {
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
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
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
        formValidation = {isValidate: false, errorMsg: l10n.getConstant('EmptyError') };
    }
        return { isValidate: formValidation.isValidate, errorMsg: formValidation.errorMsg };
    }

    // tslint:disable-next-line:max-func-body-length
    private isValidationHandler(args: { value: string, range: number[], sheetIdx: number }): { isValidate: boolean, errorMsg: string } {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        args.value = args.value ? args.value : '';
        let isValidate: boolean;
        let errorMsg: string;
        let enterValue: string | number = args.value;
        let sheet: SheetModel = this.parent.sheets[args.sheetIdx - 1];
        let cell: CellModel = getCell(args.range[0], args.range[1], sheet);
        let value: string | number = args.value;
        let value1: string | number = cell.validation.value1;
        let value2: string | number = cell.validation.value2;
        let opt: string = cell.validation.operator;
        let type: string = cell.validation.type;
        let ignoreBlank: boolean = cell.validation.ignoreBlank;
        let formValidation: { isValidate: boolean, errorMsg: string } = this.formatValidation(args.value, type);
        isValidate = formValidation.isValidate;
        errorMsg = formValidation.errorMsg;
        if (isValidate) {
            isValidate = false;
            if (type === 'Date' || type === 'Time') {
                for (let idx: number = 0; idx <= 3; idx++) {
                    args.value = idx === 0 ? args.value : idx === 1 ? cell.validation.value1 : cell.validation.value2;
                    let dateEventArgs: { [key: string]: string | number } = {
                        value: args.value,
                        rowIndex: args.range[0],
                        colIndex: args.range[1],
                        sheetIndex: args.sheetIdx,
                        updatedVal: ''
                    };
                    if (args.value !== '') {
                        this.parent.notify(checkDateFormat, dateEventArgs);
                    }
                    let updatedVal: string = dateEventArgs.updatedVal as string;
                    if (idx === 0) {
                        value = type === 'Date' ? updatedVal : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    } else if (idx === 1) {
                        value1 = type === 'Date' ? updatedVal : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    } else {
                        value2 = type === 'Date' ? updatedVal : updatedVal.slice(updatedVal.indexOf('.') + 1, updatedVal.length);
                    }
                }
            } else if (cell.validation.type === 'TextLength') {
                value = args.value.toString().length.toString();
            }
            if (type === 'List') {
                if (value1.indexOf('=') !== -1) {
                    for (let idx: number = 0; idx < this.data.length; idx++) {
                        if (args.value === this.data[idx].text) {
                            isValidate = true;
                        }
                    }
                } else {
                    let values: string[] = (value1 as string).split(',');
                    for (let idx: number = 0; idx < values.length; idx++) {
                        if (args.value === values[idx]) {
                            isValidate = true;
                        }
                    }
                }
            } else {
                if (type === 'Decimal') {
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
        errorMsg = l10n.getConstant('ValidationError');
        if (isValidate && cell.style && cell.style.backgroundColor === '#ffff00' && cell.style.color === '#ff0000') {
            cell.style.backgroundColor = ''; cell.style.color = '';
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: { backgroundColor: '', color: '' }, rowIdx: args.range[0],
                colIdx: args.range[1], isHeightCheckNeeded: true, manualUpdate: true,
                onActionUpdate: true
            });
        }
        return { isValidate: isValidate, errorMsg: errorMsg };
    }

    private checkDataValidation(args: { value: string, range: number[], sheetIdx: number, isCell: boolean }): void {
        let isValid: { isValidate: boolean, errorMsg: string } = this.isValidationHandler({
            value: args.value, range: args.range, sheetIdx: args.sheetIdx
        });
        if (!isValid.isValidate && args.isCell) {
            this.validationErrorHandler(isValid.errorMsg);
        }
        this.parent.allowDataValidation = isValid.isValidate;
    }

    private formatValidation(value: string, type: string): { isValidate: boolean, errorMsg: string } {
        let sheetPanel: HTMLElement = this.parent.element.getElementsByClassName('e-sheet-panel')[0] as HTMLElement;
        let isValidate: boolean;
        let errorMsg: string;
        let formEle: HTMLElement = this.parent.createElement('form', {
            id: 'formId',
            className: 'form-horizontal'
        });
        let inputEle: HTMLElement = this.parent.createElement('input', {
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
                        'validation': { date: true },
                    },
                    customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                        errorMsg = error.innerText;
                    }
                };
                break;
            case 'Decimal':
                options = {
                    rules: {
                        'validation': { number: true },
                    },
                    customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                        errorMsg = error.innerText;
                    }
                };
                break;
            case 'WholeNumber':
                options = {
                    rules: {
                        'validation': { regex: /^\d*\.?[0]*$/ },
                    },
                    customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                        errorMsg = error.innerText;
                    }
                };
                break;
            default:
                break;
        }
        let formObj: FormValidator = new FormValidator('#formId', options);
        isValidate = formObj.validate();
        sheetPanel.removeChild(sheetPanel.getElementsByClassName('form-horizontal')[0]);
        return { isValidate: isValidate, errorMsg: errorMsg };
    }

    private validationErrorHandler(error: string): void {
        let el: HTMLElement = document.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.element.querySelector('.e-validationerror-dlg')) {
            let erroDialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            let disableCancel: boolean = false;
            let dlgModel: DialogModel = {
                width: 400, height: 200, isModal: true, showCloseIcon: true, cssClass: 'e-validationerror-dlg',
                target: document.querySelector('.e-control.e-spreadsheet') as HTMLElement,
                beforeOpen: (): void => {
                    el.focus();
                    erroDialogInst.dialogInstance.content = error; erroDialogInst.dialogInstance.dataBind();
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Retry'), isPrimary: true,
                    },
                    click: (): void => {
                        this.errorDlgHandler(erroDialogInst, 'Retry');
                    }
                },
                {
                    buttonModel: {
                        content: l10n.getConstant('Cancel'),
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
            let el: HTMLElement = document.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
            let mainCont: HTMLElement = this.parent.getMainContent() as HTMLElement;
            errorDialogInst.hide();
            if (el.innerText) {
                let range: Range = document.createRange();
                range.setStart(el.childNodes[0], 0);
                range.setEnd(el.childNodes[0], el.innerText.length);
                let selection: Selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                if (this.listObj) {
                    this.listObj.showPopup();
                }
            }
        } else {
            let indexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
            let value: string = this.parent.getDisplayText(this.parent.getActiveSheet().rows[indexes[0]].cells[indexes[1]]);
            this.parent.notify(editOperation, {
                action: 'cancelEdit', value: value, refreshFormulaBar: true,
                refreshEditorElem: true, isAppend: false, trigEvent: true
            });
            errorDialogInst.hide();
        }
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'dataValidation';
    }
}
