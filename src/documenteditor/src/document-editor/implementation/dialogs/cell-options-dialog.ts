import { LayoutViewer } from '../index';
import { TableOptionsDialog } from './index';
import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WCellFormat } from '../index';
import { isNullOrUndefined, L10n, createElement, setCulture } from '@syncfusion/ej2-base';
import { SelectionTableFormat, SelectionCellFormat } from '../index';
import { TableWidget, TableRowWidget, TableCellWidget } from '../viewer/page';
import { TextPosition } from '../selection/selection-helper';

/**
 * The Cell options dialog is used to modify margins of selected cells.
 */
export class CellOptionsDialog {
    /**
     * @private
     */
    public owner: LayoutViewer;
    /**
     * @private
     */
    public dialog: Dialog;
    /**
     * @private
     */
    public target: HTMLElement;
    private sameAsTableCheckBox: CheckBox;
    /**
     * @private
     */
    public sameAsTable: boolean;
    /**
     * @private
     */
    public topMarginBox: NumericTextBox;
    /**
     * @private
     */
    public leftMarginBox: NumericTextBox;
    /**
     * @private
     */
    public bottomMarginBox: NumericTextBox;
    /**
     * @private
     */
    public rightMarginBox: NumericTextBox;
    /**
     * @private
     */
    public cellFormatIn: WCellFormat;
    /**
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }
    /**
     * @private
     */
    get cellFormat(): WCellFormat {
        if (isNullOrUndefined(this.cellFormatIn)) {
            return this.cellFormatIn = new WCellFormat();
        }
        return this.cellFormatIn;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'CellOptionsDialog';
    }
    /**
     * @private
     */
    public initCellMarginsDialog(localValue: L10n): void {
        let instance: LayoutViewer = this.owner;
        this.target = createElement('div', {
            id: this.owner.owner.containerId + '_tableCellMarginsDialog', className: 'e-de-table-cell-margin-dlg'
        });
        this.owner.owner.element.appendChild(this.target);
        let innerDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 475px;position: relative;height: 165px;' });
        let innerDivLabel: HTMLElement = createElement('Label', {
            className: 'e-de-cell-dia-options-label', id: this.target.id + '_innerDivLabel'
        });
        innerDivLabel.innerHTML = localValue.getConstant('Cell margins');
        innerDiv.appendChild(innerDivLabel);
        let table: HTMLTableElement = <HTMLTableElement>createElement('TABLE', {
            styles: 'height: 40px;padding-bottom: 0px;', className: 'e-de-cell-margin-top'
        });
        let tr: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { className: 'e-de-tbl-btn-seperator' });
        let sameAsTableCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_sameAsCheckBox'
        });
        td.appendChild(sameAsTableCheckBox);
        tr.appendChild(td); table.appendChild(tr);
        innerDiv.appendChild(table);
        CellOptionsDialog.getCellMarginDialogElements(this, innerDiv, localValue);
        let divBtn: HTMLDivElement = document.createElement('div');
        this.target.appendChild(divBtn);
        this.sameAsTableCheckBox = new CheckBox({
            label: localValue.getConstant('Same as the whole table'),
            change: this.changeSameAsTable
        });
        this.sameAsTableCheckBox.appendTo(sameAsTableCheckBox);
        this.sameAsTableCheckBox.addEventListener('change', this.changeSameAsTable);
    }
    /**
     * @private
     */
    public show(): void {
        let localizeValue: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        localizeValue.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initCellMarginsDialog(localizeValue);
        }
        this.loadCellMarginsDialog();
        this.owner.dialog.header = localizeValue.getConstant('Cell Options');
        this.owner.dialog.position = { X: 'center', Y: 'top' };
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = undefined;
        this.owner.dialog.open = undefined;
        this.owner.dialog.close = this.removeEvents;
        this.owner.dialog.buttons = [{
            click: this.applyTableCellProperties,
            buttonModel: { content: localizeValue.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
        },
        {
            click: this.closeCellMarginsDialog,
            buttonModel: { content: localizeValue.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
        }];
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public removeEvents = (): void => {
        this.owner.dialog2.element.style.pointerEvents = '';
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public changeSameAsTable = (): void => {
        if (this.sameAsTableCheckBox.checked) {
            this.leftMarginBox.enabled = false;
            this.rightMarginBox.enabled = false;
            this.bottomMarginBox.enabled = false;
            this.topMarginBox.enabled = false;
        } else {
            this.leftMarginBox.enabled = true;
            this.rightMarginBox.enabled = true;
            this.bottomMarginBox.enabled = true;
            this.topMarginBox.enabled = true;
        }
    }
    /**
     * @private
     */
    public loadCellMarginsDialog(): void {
        let cellFormat: SelectionCellFormat = this.owner.selection.cellFormat;
        this.sameAsTable = isNullOrUndefined(cellFormat.leftMargin || cellFormat.topMargin
            || cellFormat.rightMargin || cellFormat.bottomMargin);
        if (this.sameAsTable) {
            let tableFormat: SelectionTableFormat = this.owner.selection.tableFormat;
            this.loadCellProperties(tableFormat, false, true);
        } else {
            this.loadCellProperties(cellFormat, true, false);
        }
    }
    private loadCellProperties(format: SelectionCellFormat | SelectionTableFormat, enableTextBox: boolean, enableCheckBox: boolean): void {
        this.leftMarginBox.value = format.leftMargin;
        this.rightMarginBox.value = format.rightMargin;
        this.topMarginBox.value = format.topMargin;
        this.bottomMarginBox.value = format.bottomMargin;
        this.leftMarginBox.enabled = enableTextBox;
        this.rightMarginBox.enabled = enableTextBox;
        this.topMarginBox.enabled = enableTextBox;
        this.bottomMarginBox.enabled = enableTextBox;
        this.sameAsTableCheckBox.checked = enableCheckBox;
    }
    /**
     * @private
     */
    public applyTableCellProperties = (): void => {
        let cellFormat: SelectionCellFormat = this.owner.selection.cellFormat;
        if (!isNullOrUndefined(this.bottomMarginBox.value || this.leftMarginBox.value
            || this.rightMarginBox.value || this.topMarginBox.value) &&
            (cellFormat.bottomMargin !== this.bottomMarginBox.value || cellFormat.leftMargin !== this.leftMarginBox.value
                || cellFormat.rightMargin !== this.rightMarginBox.value || cellFormat.topMargin !== this.topMarginBox.value)) {
            this.owner.owner.tablePropertiesDialogModule.isCellOptionsUpdated = true;
            this.applyTableOptions(this.cellFormat);
            this.owner.owner.tablePropertiesDialogModule.applyTableSubProperties();
        }
        this.closeCellMarginsDialog();
    }
    /**
     * @private
     */
    public applySubCellOptions(cellFormat: WCellFormat): void {
        this.owner.owner.editorHistory.initComplexHistory(this.owner.selection, 'CellMarginsSelection');
        this.owner.owner.editorModule.initHistory('CellOptions');
        /* tslint:disable:max-line-length */
        let startTable: TableWidget = this.owner.selection.start.paragraph.associatedCell.ownerTable;
        startTable = startTable.combineWidget(this.owner) as TableWidget;
        this.applyCellmarginsValue(this.owner.selection.start.paragraph.associatedCell.ownerRow.combineWidget(this.owner) as TableRowWidget, this.owner.selection.start, this.owner.selection.end, cellFormat);
        this.owner.owner.editorModule.reLayout(this.owner.selection, false);
        if (!isNullOrUndefined(this.owner.owner.editorHistory.currentHistoryInfo)) {
            this.owner.owner.editorHistory.updateComplexHistory();
        }
    }
    /**
     * @private
     */
    public applyCellmarginsValue(row: TableRowWidget, start: TextPosition, end: TextPosition, cellFormat: WCellFormat): void {
        this.applyCellMarginsInternal(row, cellFormat);
        if (end.paragraph.associatedCell.ownerRow === row) {
            return;
        }
        let newRow: TableRowWidget = row.nextWidget as TableRowWidget;
        if (!isNullOrUndefined(newRow)) {
            this.applyCellmarginsValue(newRow, start, end, cellFormat);
        }
    }
    private applyCellMarginsInternal(row: TableRowWidget, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(this.owner.owner.editorHistory.currentBaseHistoryInfo)) {
            let currentFormat: WCellFormat = (row.childWidgets[0] as TableCellWidget).cellFormat;
            /* tslint:disable:max-line-length */
            cellFormat = this.owner.owner.editorHistory.currentBaseHistoryInfo.addModifiedCellOptions(currentFormat, cellFormat, row.ownerTable);
        }
        if (!isNullOrUndefined(cellFormat)) {
            this.applyCellMarginsForCells(row, cellFormat);
        }
    }
    /**
     * @private
     */
    public applyCellMarginsForCells(row: TableRowWidget, cellFormat: WCellFormat): void {
        let rowCells: TableCellWidget[] = row.childWidgets as TableCellWidget[];
        this.iterateCells(rowCells, cellFormat);
    }
    /**
     * @private
     */
    public iterateCells(cells: TableCellWidget[], cellFormat: WCellFormat): void {
        for (let i: number = 0; i < cells.length; i++) {
            this.applySubCellMargins(cells[i].cellFormat, cellFormat);
        }
        this.owner.owner.tablePropertiesDialogModule.calculateGridValue(cells[0].ownerTable);
    }
    /**
     * @private
     */
    public applySubCellMargins(sourceFormat: WCellFormat, cellFormat: WCellFormat): void {
        sourceFormat.leftMargin = cellFormat.leftMargin;
        sourceFormat.topMargin = cellFormat.topMargin;
        sourceFormat.rightMargin = cellFormat.rightMargin;
        sourceFormat.bottomMargin = cellFormat.bottomMargin;
    }
    /**
     * @private
     */
    public applyTableOptions(cellFormat: WCellFormat): void {
        if (!this.sameAsTableCheckBox.checked) {
            cellFormat.leftMargin = this.leftMarginBox.value;
            cellFormat.topMargin = this.topMarginBox.value;
            cellFormat.bottomMargin = this.bottomMarginBox.value;
            cellFormat.rightMargin = this.rightMarginBox.value;
        }
    }
    /**
     * @private
     */
    public closeCellMarginsDialog = (): void => {
        this.owner.dialog.hide();
        this.owner.dialog.element.style.pointerEvents = '';
    }
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let y: number = 0; y < this.target.childNodes.length; y++) {
                this.target.removeChild(this.target.childNodes[y]);
                y--;
            }
            this.target = undefined;
        }
        this.dialog = undefined;
        this.target = undefined;
        this.owner = undefined;
        this.sameAsTableCheckBox = undefined;
    }
    /**
     * @private
     */
    public static getCellMarginDialogElements(dialog: CellOptionsDialog | TableOptionsDialog, div: HTMLDivElement, locale: L10n): void {
        if (!isNullOrUndefined(dialog)) {
            let table: HTMLTableElement = <HTMLTableElement>createElement('TABLE', { className: 'e-de-cell-margin-top' });
            let tr1: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr', { styles: 'height: 50px;color:black;' });
            let td1: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
            let topLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Top'), className: 'e-de-cell-dia-label-common',
                id: dialog.target.id + '_TopLabel'
            });
            let topTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%', id: dialog.target.id + '_Top'
            });
            td1.appendChild(topLabel); td1.appendChild(topTextBox);
            let td2: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { className: 'e-de-tbl-btn-seperator' });
            let leftLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Left'), className: 'e-de-cell-dia-label-common',
                id: dialog.target.id + '_leftLabel'
            });
            let leftTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_left'
            });
            td2.appendChild(leftLabel); td2.appendChild(leftTextBox);
            tr1.appendChild(td1); tr1.appendChild(td2);
            let tr2: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr', { styles: 'height: 50px;color:black;' });
            let td3: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'width:40%;' });
            let bottomLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Bottom'),
                className: 'e-de-cell-dia-label-common', id: dialog.target.id + '_bottomLabel'
            });
            let bottomTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_bottom'
            });
            td3.appendChild(bottomLabel); td3.appendChild(bottomTextBox);
            let td4: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'width:40%;' });
            let rightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Right'), id: dialog.target.id + '_rightLabel',
                className: 'e-de-cell-dia-label-common'
            });
            let rightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_right'
            });
            td4.appendChild(rightLabel); td4.appendChild(rightTextBox);
            tr2.appendChild(td3); tr2.appendChild(td4); table.appendChild(tr1);
            table.appendChild(tr2); div.appendChild(table);
            dialog.target.appendChild(div);
            dialog.topMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 150, decimals: 2,
                enablePersistence: false
            });
            dialog.topMarginBox.appendTo(topTextBox);
            dialog.leftMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 150,
                decimals: 2, enablePersistence: false
            });
            dialog.leftMarginBox.appendTo(leftTextBox);
            dialog.bottomMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 150, decimals: 2,
                enablePersistence: false
            });
            dialog.bottomMarginBox.appendTo(bottomTextBox);
            dialog.rightMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 150,
                decimals: 2, enablePersistence: false
            });
            dialog.rightMarginBox.appendTo(rightTextBox);
        }
    }
}