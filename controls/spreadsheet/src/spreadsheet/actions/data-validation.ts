import { Spreadsheet, DialogBeforeOpenEventArgs, editAlert, IOffset, IViewport, completeAction } from '../index';
import { isValidation, checkDateFormat, applyCellFormat, activeCellChanged } from '../../workbook/common/event';
import { getCell, setCell } from '../../workbook/base/cell';
import { CellModel } from '../../workbook/base/cell-model';
import { FormValidatorModel, FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, EventHandler, remove, closest, isNullOrUndefined, select, Browser } from '@syncfusion/ej2-base';
import { Dialog } from '../services/dialog';
import { dialog, locale, initiateDataValidation, invalidData, editOperation, keyUp, focus } from '../common/index';
import { formulaBarOperation, removeDataValidation, CellValidationEventArgs } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { isHiddenRow, setRow, ColumnModel, beginAction, ActionEventArgs, getSwapRange, checkColumnValidation } from '../../workbook/index';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getRangeIndexes, getIndexesFromAddress, getCellIndexes, cellValidation, updateCell, isInMultipleRange } from '../../workbook/common/index';
import { CellFormatArgs, DefineNameModel, ExtendedRange, getData, isCellReference, parseLocaleNumber } from '../../workbook/index';
import { DropDownList, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { DialogModel, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { ValidationModel, ValidationType, CellStyleModel, getSheet, getSheetIndex, Workbook, checkIsFormula } from '../../workbook/index';
import { getColumn, isLocked, getRowsHeight, getColumnsWidth, validationHighlight, ValidationOperator, formulaInValidation, InvalidFormula } from '../../workbook/index';

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

    private removeValidationHandler(eventArgs: { isAction: boolean, range?: string, isCol?: boolean }): void {
        let sheet: SheetModel; let range: string;
        const args: { range?: string, cancel: boolean, isColSelected?: boolean } = { cancel: false, isColSelected: eventArgs.isCol };
        let actualRange: string = eventArgs.range;
        if (eventArgs.range && eventArgs.range.includes('!')) {
            range = eventArgs.range;
            sheet = getSheet(this.parent, getSheetIndex(this.parent, range.split('!')[0]));
            if (!sheet) {
                return;
            }
        } else {
            sheet = this.parent.getActiveSheet();
            range = sheet.name + '!';
            if (eventArgs.range) {
                range += eventArgs.range;
            } else {
                const rangeArgs: { range: string, isColSelected: boolean } = this.getRange(sheet.selectedRange);
                range += rangeArgs.range;
                args.isColSelected = rangeArgs.isColSelected;
            }
        }
        actualRange = sheet.selectedRange;
        args.range = range;
        if (eventArgs.isAction) {
            this.parent.notify(beginAction, { eventArgs: args, action: 'removeValidation' });
        }
        if (!args.cancel) {
            let isListValidation: boolean; let modelObj: CellModel | ColumnModel;
            let actCelIdx: number[];
            if (sheet.name === this.parent.getActiveSheet().name) {
                actCelIdx = getCellIndexes(sheet.activeCell);
                const indexes: number[] = getSwapRange(getRangeIndexes(actualRange));
                if (actCelIdx[0] >= indexes[0] && actCelIdx[1] >= indexes[1] && actCelIdx[0] <= indexes[2] && actCelIdx[1] <= indexes[3]) {
                    modelObj = args.isColSelected ? getColumn(sheet, actCelIdx[1]) || {} :
                        getCell(actCelIdx[0], actCelIdx[1], sheet, false, true);
                    isListValidation = modelObj.validation && modelObj.validation.type === 'List';
                }
            }
            this.parent.notify(cellValidation, { range: range, isRemoveValidation: true, viewport: this.parent.viewport });
            if (isListValidation && !modelObj.validation) {
                const td: HTMLElement = this.parent.getCell(actCelIdx[0], actCelIdx[1]);
                if (td && td.getElementsByClassName('e-validation-list')[0]) {
                    this.listObj.destroy();
                    td.removeChild(td.getElementsByClassName('e-validation-list')[0]);
                }
            }
            if (eventArgs.isAction) {
                delete args.cancel;
                this.parent.notify(completeAction, { eventArgs: args, action: 'removeValidation' });
            }
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

    private invalidDataHandler(args: { isRemoveHighlight: boolean, range?: string, isPublic?: boolean }): void {
        const eventArgs: { range: string, cancel: boolean } = { range: args.range || this.parent.dataValidationRange, cancel: false };
        if (!eventArgs.range) {
            return;
        }
        let actionArgs: ActionEventArgs;
        if (!args.isPublic) {
            actionArgs = { eventArgs: eventArgs, action: args.isRemoveHighlight ? 'removeHighlight' : 'addHighlight' };
            this.parent.notify(beginAction, actionArgs);
            if (eventArgs.cancel) {
                return;
            }
        }
        if (args.isRemoveHighlight) {
            this.parent.removeInvalidHighlight(eventArgs.range);
        } else {
            this.parent.addInvalidHighlight(eventArgs.range);
        }
        if (!args.isPublic) {
            this.parent.notify(completeAction, actionArgs);
        }
    }

    private listHandler(): void {
        if (this.parent.allowDataValidation) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const indexes: number[] = getCellIndexes(sheet.activeCell);
            const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
            const tdEle: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
            if (!tdEle) { return; }
            if (document.getElementsByClassName('e-validation-list')[0]) {
                remove(document.getElementsByClassName('e-validation-list')[0]);
                this.data = [];
            }
            const validation: ValidationModel = (cell && cell.validation) || (sheet.columns && sheet.columns[indexes[1]] &&
                sheet.columns[indexes[1]].validation);
            if (validation && validation.type === 'List') {
                if (validation.address && !isInMultipleRange(validation.address, indexes[0], indexes[1])) {
                    return;
                }
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
                    const parent: Element = tdEle.getElementsByClassName('e-wrap-content')[0] || tdEle;
                    parent.insertBefore(ddlCont, parent.firstChild);
                    const dataSource: { [key: string]: Object }[] = this.updateDataSource(cell, validation);
                    this.listObj = new DropDownList({
                        index: this.setDropDownListIndex(dataSource, cell),
                        dataSource: dataSource,
                        fields: { text: 'text', value: 'id' },
                        width: '0px',
                        popupHeight: '200px',
                        change: () => this.listValueChange(this.listObj.text),
                        open: (args: PopupEventArgs) => {
                            args.popup.offsetX = - (tdEle.offsetWidth - 20) + 4;
                            args.popup.offsetY = -13;
                            args.popup.element.style.width = tdEle.offsetWidth - 1 + 'px';
                            // Positioning popup in mobile device based on transform css applied on virtual element as suggested by dropdown team
                            if (Browser.isDevice && this.parent.scrollModule) {
                                const offset: { left: IOffset, top: IOffset } = this.parent.scrollModule.offset;
                                const viewport: IViewport = this.parent.viewport;
                                args.popup.offsetY += viewport.topIndex ? offset.top.size -
                                    getRowsHeight(sheet, viewport.topIndex + 1, offset.top.idx, true) : 0;
                                args.popup.offsetX += viewport.leftIndex ? offset.left.size -
                                    getColumnsWidth(sheet, viewport.leftIndex + 1, offset.left.idx, true) : 0;
                                args.popup.refresh();
                                args.popup.element.style.width = tdEle.offsetWidth - 1 + 'px';
                            }
                        },
                        close: (args: PopupEventArgs): void => {
                            if (args.event && ((args.event as KeyboardEvent).keyCode === 13 ||
                                ((args.event as KeyboardEvent).altKey && (args.event as KeyboardEvent).keyCode === 38))) {
                                (args.event as KeyboardEvent).preventDefault();
                                (args.event as KeyboardEvent).stopPropagation();
                            }
                            focus(this.parent.element);
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

    private setDropDownListIndex(dataSource: { [key: string]: Object }[], cell: CellModel): number {
        if (cell && cell.value) {
            for (let dataIdx: number = 0, len: number = dataSource.length; dataIdx < len; dataIdx++) {
                if (dataSource[dataIdx as number].text === cell.value.toString()) {
                    return dataIdx;
                }
            }
        }
        return null;
    }

    private updateDataSource(cell: CellModel, validation: ValidationModel): { [key: string]: Object }[] {
        this.data = [];
        let count: number = 0;
        const definedNames: DefineNameModel[] = this.parent.definedNames;
        let value: string = validation.value1;
        const isRange: boolean = value.indexOf('=') !== -1;
        if (definedNames.length > 0 && isRange) {
            const listValue: string = value.split('=')[1];
            for (let idx: number = 0, len: number = definedNames.length; idx < len; idx++) {
                if (definedNames[idx as number].name === listValue) {
                    let definedNameRange: string = definedNames[idx as number].refersTo;
                    // eslint-disable-next-line
                    while (definedNameRange.includes("'")) {
                        // eslint-disable-next-line
                        definedNameRange = definedNameRange.replace("'", '');
                    }
                    value = definedNameRange;
                }
            }
        }
        if (isRange) {
            const sheet: SheetModel = value.indexOf('!') > -1 ?
                getSheet(this.parent as Workbook, getSheetIndex(this.parent as Workbook, value.split('=')[1].split('!')[0])) : this.parent.getActiveSheet();
            const address: string = value.indexOf('!') > -1 ? value.split('!')[1] : value.split('=')[1];
            const activeSheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.name !== activeSheet.name) {
                let isNotLoaded: boolean; const selectedRange: number[] = getRangeIndexes(activeSheet.selectedRange);
                sheet.ranges.forEach((range: ExtendedRange): void => {
                    if (!range.info || !range.info.loadedRange || !range.info.loadedRange.length) { isNotLoaded = true; return; }
                });
                if (isNotLoaded) {
                    this.parent.showSpinner();
                    getData(this.parent, `${sheet.name}!${address}`).then((): void => {
                        this.parent.hideSpinner();
                        if (activeSheet.name === this.parent.getActiveSheet().name) {
                            const curRange: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
                            if (curRange[0] === selectedRange[0] && curRange[1] === selectedRange[1]) {
                                this.listObj.dataSource = this.updateDataSource(cell, validation); this.listObj.dataBind();
                            }
                        }
                    });
                }
            }
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
                if (!sheet.rows[rowIdx as number]) { setRow(sheet, rowIdx, {}); }
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (!sheet.rows[rowIdx as number].cells) { setCell(rowIdx, colIdx, sheet, {}); }
                    count += 1;
                    cell = sheet.rows[rowIdx as number].cells[colIdx as number];
                    const data: string = this.parent.getDisplayText(cell) || '';
                    this.data.push({ text: data, id: 'list-' + count });
                }
            }
        } else {
            const listValues: string[] = value.split(',');
            for (let idx: number = 0; idx < listValues.length; idx++) {
                count += 1;
                this.data.push({ text: listValues[idx as number], id: 'list-' + count });
            }
        }
        return this.data;
    }

    private listValueChange(value: string): void {
        this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: value });
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cellIdx: number[] = getIndexesFromAddress(sheet.activeCell);
        const cellObj: CellModel = Object.assign({}, getCell(cellIdx[0], cellIdx[1], sheet));
        if (sheet.isProtected && isLocked(cellObj, getColumn(sheet, cellIdx[1]))) {
            this.parent.notify(editAlert, null);
        } else {
            if (this.parent.isEdit) { this.parent.closeEdit(); }
            const args: { value: string, oldValue: string, address: string, cancel: boolean } = { value: value, oldValue: cellObj.value, address: sheet.name + '!' + sheet.activeCell, cancel: false };
            this.parent.notify(beginAction, { action: 'cellSave', eventArgs: args });
            if (args.cancel) {
                return;
            }
            updateCell(
                this.parent, sheet, { cell: { value: value }, rowIdx: cellIdx[0], colIdx: cellIdx[1], valChange: true, lastCell: true,
                    uiRefresh: true, checkCF: true });
            this.parent.notify(completeAction, { action: 'cellSave', eventArgs: { value: value, oldValue: cellObj.value, address: sheet.name + '!' + sheet.activeCell } });
        }
    }

    private getRange(range: string): { range: string , isColSelected: boolean } {
        const indexes: number[] = getRangeIndexes(range);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const maxRowCount: number = sheet.rowCount;
        const maxColCount: number = sheet.colCount;
        let isColSelected: boolean;
        if (indexes[2] === maxRowCount - 1 && indexes[0] === 0) {
            range = range.replace(/[0-9]/g, '');
            isColSelected = true;
        } else if (indexes[3] === maxColCount - 1 && indexes[2] === 0) {
            range = range.replace(/\D/g, '');
        }
        return { range: range, isColSelected: isColSelected };
    }

    private initiateDataValidationHandler(okClick?: boolean, noClick?: boolean): void {
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
        const indexes: number[] = getSwapRange(getRangeIndexes(range));
        range = this.getRange(range).range;
        const validationArgs : { moreValidation: boolean, extendValidation: boolean} = this.validateRange(indexes, sheet);
        if (!validationArgs.extendValidation && !validationArgs.moreValidation || okClick) {
            for (let rowIdx: number = indexes[0]; rowIdx <= indexes[2]; rowIdx++) {
                if (sheet.rows[rowIdx as number]) {
                    for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                        if (sheet.rows[rowIdx as number].cells && sheet.rows[rowIdx as number].cells[colIdx as number]) {
                            cell = sheet.rows[rowIdx as number].cells[colIdx as number];
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
            if (isNew) {
                for (let i: number = indexes[1]; i <= indexes[3]; i++) {
                    const column: ColumnModel = getColumn(sheet, i);
                    if (column && column.validation) {
                        isNew = false;
                        type = column.validation.type;
                        operator = column.validation.operator;
                        value1 = column.validation.value1;
                        value2 = column.validation.value2;
                        ignoreBlank = !isNullOrUndefined(column.validation.ignoreBlank) ?
                            column.validation.ignoreBlank : ignoreBlank;
                        inCellDropDown = !isNullOrUndefined(column.validation.inCellDropDown) ?
                            column.validation.inCellDropDown : inCellDropDown;
                    }
                }
            }
            if (!this.parent.element.querySelector('.e-datavalidation-dlg')) {
                const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                dialogInst.show({
                    width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-datavalidation-dlg',
                    header: l10n.getConstant('DataValidation'),
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'ValidationDialog', element: args.element,
                            target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                        if (noClick) { isNew = true; }
                        dialogInst.dialogInstance.content =
                            this.dataValidationContent(isNew, type, operator, value1, value2, ignoreBlank, inCellDropDown, range);
                        dialogInst.dialogInstance.dataBind();
                        focus(this.parent.element);
                    },
                    buttons: [{
                        buttonModel: {
                            content: l10n.getConstant('ClearAll'),
                            cssClass: 'e-btn e-clearall-btn e-flat'
                        },
                        click: (): void => {
                            dialogInst.dialogInstance.content =
                                this.dataValidationContent(true, type, operator, value1, value2, ignoreBlank, inCellDropDown, range);
                            dialogInst.dialogInstance.dataBind();
                        }
                    },
                    {
                        buttonModel: {
                            content: l10n.getConstant('Apply'), isPrimary: true
                        },
                        click: (): void => {
                            this.dlgClickHandler(dialogInst);
                        }
                    }]
                });
                dialogInst.dialogInstance.refresh();
            }
        } else {
            if (validationArgs.moreValidation) { this.moreValidationDlg(); }
            if (validationArgs.extendValidation) { this.extendValidationDlg(); }
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
        const cellRangeText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
        cellRangeText.innerText = l10n.getConstant('CellRange');
        const cellRangeEle: HTMLElement = this.parent.createElement('input', {
            className: 'e-input',
            attrs: { value: range, 'aria-label': l10n.getConstant('CellRange') }
        });
        cellRangeCont.appendChild(cellRangeText);
        cellRangeCont.appendChild(cellRangeEle);
        const allowCont: HTMLElement = this.parent.createElement('div', { className: 'e-allow' });
        const dataCont: HTMLElement = this.parent.createElement('div', { className: 'e-data' });
        allowDataCont.appendChild(allowCont);
        allowDataCont.appendChild(dataCont);
        const allowText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
        allowText.innerText = l10n.getConstant('Allow');
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
            { text: l10n.getConstant('GreaterThan'), id: 'operator-5' },
            { text: l10n.getConstant('LessThan'), id: 'operator-6' },
            { text: l10n.getConstant('GreaterThanOrEqualTo'), id: 'operator-7' },
            { text: l10n.getConstant('LessThanOrEqualTo'), id: 'operator-8' }
        ];
        const allowSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
        if (type) {
            type = this.FormattedType(type);
        }
        let allowIdx: number = 0;
        if (!isNew) {
            for (let idx: number = 0; idx < this.typeData.length; idx++) {
                if (type === this.FormattedType(this.typeData[idx as number].text as string)) {
                    allowIdx = idx;
                    break;
                }
            }
        }
        if (isNew || type !== 'List') {
            let dataIdx: number = 0;
            const dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            dataText.innerText = l10n.getConstant('Data');
            const dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
            if (!isNew) {
                for (let idx: number = 0; idx < this.operatorData.length; idx++) {
                    if (operator === this.FormattedValue(this.operatorData[idx as number].text as string)) {
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
        if (isNew || (listObj.value !== l10n.getConstant('List') && (this.dataList.value === l10n.getConstant('Between') || this.dataList.value === l10n.getConstant('NotBetween')))) {
            const minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            const maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            const minimumText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            minimumText.innerText = l10n.getConstant('Minimum');
            const maximumText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            maximumText.innerText = l10n.getConstant('Maximum');
            const minimumInp: HTMLElement = this.parent.createElement('input', {
                id: 'minvalue',
                className: 'e-input', attrs: { value: value1, 'aria-label': l10n.getConstant('Minimum') }
            });
            const maximumInp: HTMLElement = this.parent.createElement('input', {
                id: 'maxvalue',
                className: 'e-input', attrs: { value: value2, 'aria-label': l10n.getConstant('Maximum') }
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
        } else if (!isNew && type === 'List') {
            const valueText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            valueText.innerText = l10n.getConstant('Sources');
            const valueEle: HTMLElement = this.parent.createElement('input', { className: 'e-input', attrs: { value: value1 } });
            valuesCont.appendChild(valueText);
            valuesCont.appendChild(valueEle);
        } else {
            const valueText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            valueText.innerText = l10n.getConstant('Value');
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

    private validateRange(indexes: number[], sheet: SheetModel): { moreValidation: boolean, extendValidation: boolean } {
        let moreValidation: boolean = false; let extendValidation: boolean = false;
        const type: string[] = []; const operator: string[] = []; const value1: string[] = []; const value2: string[] = [];
        for (let rowIndex: number = indexes[0]; rowIndex <= indexes[2]; rowIndex++) {
            if (sheet.rows[rowIndex as number]) {
                for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                    if (sheet.rows[rowIndex as number].cells && sheet.rows[rowIndex as number].cells[colIdx as number]) {
                        const cell: CellModel = sheet.rows[rowIndex as number].cells[colIdx as number];
                        if (cell.validation) {
                            type.push(cell.validation.type);
                            operator.push(cell.validation.operator);
                            value1.push(cell.validation.value1);
                            value2.push(cell.validation.value2);
                        }
                    }
                }
            }
        }
        for (let i: number = indexes[1]; i <= indexes[3]; i++) {
            const column: ColumnModel = getColumn(sheet, i);
            if (column && column.validation) {
                type.push(column.validation.type);
                operator.push(column.validation.operator);
                value1.push(column.validation.value1);
                value2.push(column.validation.value2);
            }
        }
        let tmp: string[] = [];
        for (let i: number = 0; i < type.length; i++) {
            if (tmp.indexOf(type[i as number]) === -1) {
                tmp.push(type[i as number]);
            }
        }
        if (tmp.length > 1) { moreValidation = true; }
        if (!moreValidation) {
            tmp = [];
            for (let j: number = 0; j < operator.length; j++) {
                if (tmp.indexOf(operator[j as number]) === -1) {
                    tmp.push(operator[j as number]);
                }
            }
            if (tmp.length > 1) {
                moreValidation = true;
            }
        }
        if (!moreValidation) {
            tmp = [];
            for (let j: number = 0; j < value1.length; j++) {
                if (tmp.indexOf(value1[j as number]) === -1) {
                    tmp.push(value1[j as number]);
                }
            }
            if (tmp.length > 1) { moreValidation = true; }
        }
        if (!moreValidation) {
            tmp = [];
            for (let j: number = 0; j < value2.length; j++) {
                if (tmp.indexOf(value2[j as number]) === -1) {
                    tmp.push(value2[j as number]);
                }
            }
            if (tmp.length > 1) {
                moreValidation = true;
            }
        }
        if (!moreValidation) {
            let count: number = 0; let cellCount: number = 0;
            for (let startRow: number = indexes[0]; startRow <= indexes[2]; startRow++) {
                if (sheet.rows[startRow as number]) {
                    for (let colIdx: number = indexes[1]; colIdx <= indexes[3]; colIdx++) {
                        if (sheet.rows[startRow as number].cells && sheet.rows[startRow as number].cells[colIdx as number]) {
                            const cell: CellModel = sheet.rows[startRow as number].cells[colIdx as number];
                            cellCount++;
                            if (cell.validation) {
                                count++;
                            }
                        }
                    }
                }
            }
            if (count === 0) {
                for (let i: number = indexes[1]; i <= indexes[3]; i++) {
                    const column: ColumnModel = getColumn(sheet, i);
                    if (column && column.validation) {
                        count++;
                    }
                }
            }
            if (count > 0 && cellCount > 1 && count !== cellCount) {
                extendValidation = true;
            }
        }
        return { moreValidation: moreValidation, extendValidation: extendValidation};
    }

    private moreValidationDlg(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let skip: boolean = false;
        const dlg: DialogModel = {
            width: 350, isModal: true, showCloseIcon: true, cssClass: 'e-goto-dlg',
            header: l10n.getConstant('Spreadsheet'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'MoreValidation',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = l10n.getConstant('MoreValidation'); dialogInst.dialogInstance.dataBind();
                focus(this.parent.element);
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                },
                click: (): void => {
                    dialogInst.hide();
                    skip = true;
                }
            }], close: (): void => {
                if (skip) {
                    this.initiateDataValidationHandler(true);
                    skip = false;
                } else {
                    dialogInst.hide();
                }
            }
        };
        dialogInst.show(dlg);
    }

    private extendValidationDlg(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let skip: boolean = false; let noClick: boolean = false;
        const dlg: DialogModel = {
            width: 550, isModal: true, showCloseIcon: true, cssClass: 'e-goto-dlg',
            header: l10n.getConstant('Spreadsheet'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'ExtendValidation',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = l10n.getConstant('ExtendValidation'); dialogInst.dialogInstance.dataBind();
                focus(this.parent.element);
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Yes'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                },
                click: (): void => {
                    dialogInst.hide();
                    skip = true;
                }
            },
            {
                buttonModel: {
                    content: l10n.getConstant('No'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                },
                click: (): void => {
                    dialogInst.hide();
                    skip = true;
                    noClick = true;
                }
            }], close: (): void => {
                if (skip) {
                    this.initiateDataValidationHandler(true, noClick);
                    skip = false;
                } else {
                    dialogInst.hide();
                }
            }
        };
        dialogInst.show(dlg);
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
        if (listObj.value === l10n.getConstant('List')) {
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
                const dataText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
                dataText.innerText = l10n.getConstant('Data');
                const dataSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
                dataCont.appendChild(dataText);
                dataCont.appendChild(dataSelectEle);
                listObj1.appendTo(dataSelectEle);
            }
        }
        if (listObj.value !== l10n.getConstant('List') && (listObj1.value === l10n.getConstant('Between') || listObj1.value === l10n.getConstant('NotBetween'))) {
            const minimumCont: HTMLElement = this.parent.createElement('div', { className: 'e-minimum' });
            const maximumCont: HTMLElement = this.parent.createElement('div', { className: 'e-maximum' });
            valuesCont.appendChild(minimumCont);
            valuesCont.appendChild(maximumCont);
            const minimumText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            minimumText.innerText = l10n.getConstant('Minimum');
            const maximumText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            maximumText.innerText = l10n.getConstant('Maximum');
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
            const valueText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
            valueText.innerText = listObj.value === l10n.getConstant('List') ? l10n.getConstant('Sources') : l10n.getConstant('Value');
            const valueEle: HTMLElement = listObj.value === l10n.getConstant('List') ? this.parent.createElement('input', {
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
        let errorMsg: string;
        const dlgEle: HTMLElement = this.parent.element.querySelector('.e-datavalidation-dlg');
        const dlgFooter: HTMLElement = dlgEle.querySelector('.e-footer-content');
        const dlgContEle: HTMLElement = dlgEle.getElementsByClassName('e-dlg-content')[0].
            getElementsByClassName('e-validation-dlg')[0] as HTMLElement;
        const allowData: HTMLElement = dlgContEle.getElementsByClassName('e-allowdata')[0] as HTMLElement;
        const allowEle: HTMLElement = allowData.getElementsByClassName('e-allow')[0].getElementsByTagName('input')[0];
        const dataEle: HTMLElement = allowData.getElementsByClassName('e-data')[0].getElementsByTagName('input')[0];
        const values: HTMLElement = dlgContEle.getElementsByClassName('e-values')[0] as HTMLElement;
        const valueArr: string[] = [];
        valueArr[0] = values.getElementsByTagName('input')[0].value;
        valueArr[1] = values.getElementsByTagName('input')[1] ? values.getElementsByTagName('input')[1].value : '';
        parseLocaleNumber(valueArr, this.parent.locale);
        const ignoreBlank: boolean = (dlgContEle.querySelector('.e-ignoreblank .e-checkbox') as HTMLInputElement).checked;
        const inCellDropDown: boolean = allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper') ?
            allowData.querySelector('.e-data').querySelector('.e-checkbox-wrapper').querySelector('.e-check') ? true : false : null;
        const range: string = (dlgContEle.querySelector('.e-cellrange').getElementsByTagName('input')[0] as HTMLInputElement).value;
        let operator: string;
        let type: string = (allowEle as HTMLInputElement).value;
        type = this.FormattedType(type);
        if (dataEle) {
            operator = (dataEle as HTMLInputElement).value;
            operator = this.FormattedValue(operator);
        }
        let rangeAdd: string[] = [];
        const valArr: string[] = [];
        if (valueArr[0] !== '') {
            valArr.push(valueArr[0]);
        }
        if (valueArr[1] !== '') {
            valArr.push(valueArr[1]);
        }
        let isValid: boolean = true;
        if (type === 'List') {
            if (valueArr[0].indexOf('=') !== -1) {
                if (valueArr[0].indexOf(':') !== -1) {
                    const address: string = valueArr[0].indexOf('!') > -1 ? valueArr[0].split('!')[1] : valueArr[0].split('=')[1];
                    const isSheetNameValid: boolean = valueArr[0].indexOf('!') > -1 ?
                        getSheetIndex(this.parent as Workbook, valueArr[0].split('=')[1].split('!')[0]) > -1 : true;
                    rangeAdd = address.split(':');
                    const isSingleCol: boolean = address.match(/[a-z]/gi) ?
                        rangeAdd[0].replace(/[0-9]/g, '') === rangeAdd[1].replace(/[0-9]/g, '') : false;
                    const isSingleRow: boolean = address.match(/\d/g) ?
                        rangeAdd[0].replace(/\D/g, '') === rangeAdd[1].replace(/\D/g, '') : false;
                    isValid = isSheetNameValid ? (isSingleCol ? true : isSingleRow ? true : false) : false;
                    if (!isValid) {
                        errorMsg = l10n.getConstant('DialogError');
                    }
                }
            } else if (valueArr[0].length > 256) {
                isValid = false;
                errorMsg = l10n.getConstant('ListLengthError');
            }
        }
        if (isValid) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const format: string = type;
            const validDlg: { isValidate: boolean, errorMsg: string } = this.isDialogValidator(valArr, format, operator);
            if (operator === 'Between') {
                if (!isNaN(parseFloat(valueArr[0])) && !isNaN(parseFloat(valueArr[1])) &&
                    parseFloat(valueArr[0]) > parseFloat(valueArr[1])) {
                    validDlg.isValidate = false;
                    validDlg.errorMsg = l10n.getConstant('MinMaxError');
                }
            }
            errorMsg = validDlg.errorMsg;
            isValid = validDlg.isValidate;
            if (isValid) {
                const indexes: number[] = getCellIndexes(sheet.activeCell);
                let cell: CellModel = getCell(indexes[0], indexes[1], sheet, false, true);
                const isListValidationApplied: boolean = cell.validation && cell.validation.type === 'List';
                const args: CellValidationEventArgs = { range: sheet.name + '!' + range, value1: valueArr[0], value2: valueArr[1],
                    ignoreBlank: ignoreBlank, type: <ValidationType>type, operator: <ValidationOperator>operator, inCellDropDown:
                    inCellDropDown, cancel: false };
                this.parent.notify(beginAction, { eventArgs: args, action: 'validation' });
                if (!args.cancel) {
                    this.parent.notify(
                        cellValidation, { rules: { type: args.type, operator: args.operator, value1: args.value1, value2: args.value2,
                            ignoreBlank: args.ignoreBlank, inCellDropDown: args.inCellDropDown }, range: args.range });
                    cell = getCell(indexes[0], indexes[1], sheet, false, true);
                    if (cell.validation) {
                        if (isListValidationApplied) {
                            const tdEle: HTMLElement = this.parent.getCell(indexes[0], indexes[1]);
                            if (tdEle && tdEle.getElementsByClassName('e-validation-list')[0]) {
                                this.listObj.destroy();
                                tdEle.removeChild(tdEle.getElementsByClassName('e-validation-list')[0]);
                            }
                        }
                        if (cell.validation.type === 'List') {
                            this.listHandler();
                        }
                    }
                    delete args.cancel;
                    if (!document.getElementsByClassName('e-validation-error-dlg')[0]) {
                        if (dialogInst.dialogInstance) {
                            dialogInst.dialogInstance.hide();
                        } else {
                            dialogInst.hide();
                        }
                    }
                    this.parent.notify(completeAction, { eventArgs: args, action: 'validation' });
                }
            }
        }
        if (!isValid) {
            const errorEle: HTMLElement = this.parent.createElement('div', { className: 'e-dlg-error', id: 'e-invalid' });
            errorEle.innerText = errorMsg;
            values.appendChild(errorEle);
            dlgFooter.querySelector('.e-primary').setAttribute('disabled', 'true');
        }
    }

    private FormattedValue(value: string): string {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        switch (value) {
        case l10n.getConstant('Between'):
            value = 'Between';
            break;
        case l10n.getConstant('NotBetween'):
            value = 'NotBetween';
            break;
        case l10n.getConstant('EqualTo'):
            value = 'EqualTo';
            break;
        case l10n.getConstant('NotEqualTo'):
            value = 'NotEqualTo';
            break;
        case l10n.getConstant('GreaterThan'):
            value = 'GreaterThan';
            break;
        case l10n.getConstant('LessThan'):
            value = 'LessThan';
            break;
        case l10n.getConstant('GreaterThanOrEqualTo'):
            value = 'GreaterThanOrEqualTo';
            break;
        case l10n.getConstant('LessThanOrEqualTo'):
            value = 'LessThanOrEqualTo';
            break;
        default:
            value = 'Between';
            break;
        }
        return value;
    }

    private FormattedType(value: string): string {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        switch (value) {
        case l10n.getConstant('WholeNumber'):
            value = 'WholeNumber';
            break;
        case l10n.getConstant('Decimal'):
            value = 'Decimal';
            break;
        case l10n.getConstant('Date'):
            value = 'Date';
            break;
        case l10n.getConstant('TextLength'):
            value = 'TextLength';
            break;
        case l10n.getConstant('List'):
            value = 'List';
            break;
        case l10n.getConstant('Time'):
            value = 'Time';
            break;
        default:
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
                const value: string = checkIsFormula(values[idx as number]) ? this.parent.computeExpression(
                    values[idx as number]).toString() : values[idx as number];
                formValidation = this.formatValidation(value, type, true);
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

    private isValidationHandler(
        args: { value: string, range: number[], sheetIdx: number, td?: HTMLElement }): { isValidate: boolean, errorMsg: string } {
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
        } else if (checkColumnValidation(column, args.range[0], args.range[1])) {
            validation = column.validation;
        }
        if (validation) {
            let value1: string | number = validation.value1;
            let value2: string | number = validation.value2;
            if (checkIsFormula(value1) && validation.type !== 'List') {
                value1 = this.parent.computeExpression(value1).toString();
            }
            if (checkIsFormula(value2) && validation.type !== 'List') {
                value2 = this.parent.computeExpression(value2).toString();
            }
            if (checkIsFormula(args.value) && validation.type !== 'List') {
                args.value = this.parent.computeExpression(args.value).toString();
            }
            let value: string | number = args.value;
            const opt: string = validation.operator || 'Between';
            const type: string = validation.type || 'WholeNumber';
            const ignoreBlank: boolean = isNullOrUndefined(validation.ignoreBlank) ? true : validation.ignoreBlank;
            if (ignoreBlank && enterValue === '') {
                isValidate = true;
            } else {
                const formValidation: { isValidate: boolean, errorMsg: string } = this.formatValidation(args.value, type);
                isValidate = formValidation.isValidate;
                errorMsg = formValidation.errorMsg;
                if (isValidate) {
                    isValidate = false;
                    if (type === 'Date' || type === 'Time') {
                        args.value = args.value.toString().slice(args.value.toString().indexOf(' ') + 1, args.value.length);
                        for (let idx: number = 0; idx < 3; idx++) {
                            args.value = idx === 0 ? args.value : idx === 1 ? value1 : value2;
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
                            let updatedVal: string = dateEventArgs.updatedVal as string;
                            updatedVal = updatedVal === '' ? args.value : updatedVal;
                            if (idx === 0) {
                                value = updatedVal;
                            } else if (idx === 1) {
                                value1 = updatedVal;
                            } else {
                                value2 = updatedVal;
                            }
                        }
                    } else if (validation.type === 'TextLength') {
                        const dateEventArgs: { [key: string]: string | number } = {
                            value: args.value,
                            rowIndex: args.range[0],
                            colIndex: args.range[1],
                            sheetIndex: args.sheetIdx,
                            updatedVal: ''
                        };
                        this.parent.notify(checkDateFormat, dateEventArgs);
                        const updatedVal: string = dateEventArgs.updatedVal as string;
                        if (updatedVal !== '') {
                            value = updatedVal.toString().length.toString();
                        } else {
                            value = args.value.toString().length.toString();
                        }
                    }
                    if (type === 'List') {
                        if (value1.indexOf('=') !== -1) {
                            for (let idx: number = 0; idx < this.data.length; idx++) {
                                if (args.value.toString() === this.data[idx as number].text) {
                                    isValidate = true;
                                }
                            }
                        } else {
                            const values: string[] = (value1 as string).split(',');
                            for (let idx: number = 0; idx < values.length; idx++) {
                                if (args.value.toString() === values[idx as number]) {
                                    isValidate = true;
                                }
                            }
                        }
                        if (!isValidate && ignoreBlank && args.value.toString() === '') {
                            isValidate = true;
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
        }
        errorMsg = l10n.getConstant('ValidationError');
        if (isValidate && ((cell && cell.validation && cell.validation.isHighlighted) || (column && column.validation && column.validation.isHighlighted))) {
            const style: CellStyleModel = this.parent.getCellStyleValue(['backgroundColor', 'color'], [args.range[0], args.range[1]]);
            if (!isHiddenRow(sheet, args.range[0])) {
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: style, rowIdx: args.range[0], colIdx: args.range[1], isHeightCheckNeeded: true, manualUpdate: true,
                    onActionUpdate: true, td: args.td
                });
            }}
        return { isValidate: isValidate, errorMsg: errorMsg };
    }

    private checkDataValidation(
        args: { value: string, range: number[], sheetIdx: number, isCell: boolean, td?: HTMLElement, isValid?: boolean }): void {
        const cell: CellModel = getCell(args.range[0], args.range[1], this.parent.getActiveSheet());
        args.td = args.td || this.parent.getCell(args.range[0], args.range[1]);
        args.sheetIdx = args.sheetIdx || this.parent.activeSheetIndex;
        const formulaArgs : InvalidFormula = { skip: false, value: '' };
        if (cell && cell.validation) {
            if (checkIsFormula(cell.validation.value1) &&
            !isCellReference(cell.validation.value1.substring(1, cell.validation.value1.length)) &&
            cell.validation.value1.indexOf('(') > - 1) {
                let val: string = cell.validation.value1;
                val = val.substring(val.indexOf('=') + 1, val.indexOf('('));
                formulaArgs.value = val.toUpperCase();
                this.parent.notify(formulaInValidation, formulaArgs);
            }
            if (!formulaArgs.skip && checkIsFormula(cell.validation.value2) &&
            !isCellReference(cell.validation.value2.substring(1, cell.validation.value2.length)) &&
            cell.validation.value1.indexOf('(') > - 1) {
                let val2: string = cell.validation.value2;
                val2 = val2.substring(val2.indexOf('=') + 1, val2.indexOf('('));
                formulaArgs.value = val2.toUpperCase();
                this.parent.notify(formulaInValidation, formulaArgs);
            }
        }
        if (!formulaArgs.skip) {
            const isValid: { isValidate: boolean, errorMsg: string } = this.isValidationHandler({
                value: args.value, range: args.range, sheetIdx: args.sheetIdx, td: args.td
            });
            if (!isValid.isValidate && args.isCell) {
                this.validationErrorHandler(isValid.errorMsg);
            }
            args.isValid = isValid.isValidate;
        }
    }

    private formatValidation(value: string, type: string, isDialogValidator?: boolean): { isValidate: boolean, errorMsg: string } {
        const sheetPanel: HTMLElement = this.parent.element.getElementsByClassName('e-sheet-panel')[0] as HTMLElement;
        let errorMsg: string;
        const formEle: HTMLElement = this.parent.createElement('form', { id: 'formId', className: 'form-horizontal' });
        const inputEle: HTMLElement = this.parent.createElement('input', { id: 'e-validation' });
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
                    'validation': { regex: /^-?\d*\.?[0]*$/ }
                },
                customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                    errorMsg = error.innerText;
                }
            };
            break;
        case 'TextLength':
            if (isDialogValidator) {
                options = {
                    rules: {
                        'validation': { regex: /^\d*\.?[0]*$/ }
                    },
                    customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                        errorMsg = error.innerText;
                    }
                };
            }
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
                style: { backgroundColor: '#ffff00', color: '#ff0000' }, rowIdx: rowIdx, colIdx: colIdx, td: args.td
            });
        } else if (isRemoveHighlightedData) {
            const style: CellStyleModel =
                this.parent.getCellStyleValue(['backgroundColor', 'color'], [rowIdx, colIdx]);
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: rowIdx, colIdx: colIdx, td: args.td
            });
        }

    }

    private validationErrorHandler(error: string): void {
        const el: HTMLElement = document.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.element.querySelector('.e-validation-error-dlg')) {
            const erroDialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            const disableCancel: boolean = false;
            const dlgModel: DialogModel = {
                width: 400, height: 200, isModal: true, showCloseIcon: true, cssClass: 'e-validation-error-dlg',
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
                window.getSelection().selectAllChildren(el);
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
