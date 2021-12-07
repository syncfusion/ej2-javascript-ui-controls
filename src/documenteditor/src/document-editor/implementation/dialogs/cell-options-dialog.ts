import { LayoutViewer } from '../index';
import { TableOptionsDialog } from './index';
import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WCellFormat } from '../index';
import { isNullOrUndefined, L10n, createElement } from '@syncfusion/ej2-base';
import { SelectionTableFormat, SelectionCellFormat } from '../index';
import { TableRowWidget, TableCellWidget } from '../viewer/page';
import { TextPosition } from '../selection/selection-helper';
import { DocumentHelper } from '../viewer';

/**
 * The Cell options dialog is used to modify margins of selected cells.
 */
export class CellOptionsDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
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
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    /**
     * @private
     * @returns {WCellFormat} - Returns cell format.
     */
    public get cellFormat(): WCellFormat {
        if (isNullOrUndefined(this.cellFormatIn)) {
            return this.cellFormatIn = new WCellFormat();
        }
        return this.cellFormatIn;
    }

    private getModuleName(): string {
        return 'CellOptionsDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    public initCellMarginsDialog(localValue: L10n, isRtl?: boolean): void {
        this.owner = this.documentHelper.owner.viewer;
        this.target = createElement('div', {
            id: this.documentHelper.owner.containerId + '_tableCellMarginsDialog', className: 'e-de-table-cell-margin-dlg'
        });
        const innerDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 504px;position: relative;height: auto;' });
        const innerDivLabel: HTMLElement = createElement('Label', {
            className: 'e-de-cell-dia-options-label', id: this.target.id + '_innerDivLabel'
        });
        innerDivLabel.innerHTML = localValue.getConstant('Cell margins');
        innerDiv.appendChild(innerDivLabel);
        const table: HTMLTableElement = <HTMLTableElement>createElement('TABLE', {
            styles: 'padding-bottom: 8px;padding-top: 8px;', className: 'e-de-cell-margin-top'
        });
        const tr: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        const td: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { className: 'e-de-tbl-btn-separator' });
        const sameAsTableCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_sameAsCheckBox'
        });
        td.appendChild(sameAsTableCheckBox);
        tr.appendChild(td); table.appendChild(tr);
        innerDiv.appendChild(table);
        CellOptionsDialog.getCellMarginDialogElements(this, innerDiv, localValue);
        const divBtn: HTMLDivElement = document.createElement('div');
        this.target.appendChild(divBtn);
        this.sameAsTableCheckBox = new CheckBox({
            label: localValue.getConstant('Same as the whole table'),
            change: this.changeSameAsTable,
            enableRtl: isRtl
        });
        this.sameAsTableCheckBox.appendTo(sameAsTableCheckBox);
        this.sameAsTableCheckBox.addEventListener('change', this.changeSameAsTable);
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localizeValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localizeValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initCellMarginsDialog(localizeValue, this.documentHelper.owner.enableRtl);
        }
        this.loadCellMarginsDialog();
        this.documentHelper.dialog.header = localizeValue.getConstant('Cell Options');
        this.documentHelper.dialog.position = { X: 'center', Y: 'top' };
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = undefined;
        this.documentHelper.dialog.open = undefined;
        this.documentHelper.dialog.close = this.removeEvents;
        this.documentHelper.dialog.buttons = [{
            click: this.applyTableCellProperties,
            buttonModel: { content: localizeValue.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
        },
        {
            click: this.closeCellMarginsDialog,
            buttonModel: { content: localizeValue.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
        }];
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public removeEvents = (): void => {
        this.documentHelper.dialog2.element.style.pointerEvents = '';
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
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
    };
    /**
     * @private
     * @returns {void}
     */
    public loadCellMarginsDialog(): void {
        const cellFormat: SelectionCellFormat = this.documentHelper.selection.cellFormat;
        this.sameAsTable = isNullOrUndefined(cellFormat.leftMargin || cellFormat.topMargin
            || cellFormat.rightMargin || cellFormat.bottomMargin);
        if (this.sameAsTable) {
            const tableFormat: SelectionTableFormat = this.documentHelper.selection.tableFormat;
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
     * @returns {void}
     */
    public applyTableCellProperties = (): void => {
        const cellFormat: SelectionCellFormat = this.documentHelper.selection.cellFormat;
        if (!isNullOrUndefined(this.bottomMarginBox.value || this.leftMarginBox.value
            || this.rightMarginBox.value || this.topMarginBox.value) &&
            (cellFormat.bottomMargin !== this.bottomMarginBox.value || cellFormat.leftMargin !== this.leftMarginBox.value
                || cellFormat.rightMargin !== this.rightMarginBox.value || cellFormat.topMargin !== this.topMarginBox.value)) {
            this.documentHelper.owner.tablePropertiesDialogModule.isCellOptionsUpdated = true;
            this.applyTableOptions(this.cellFormat);
            this.documentHelper.owner.tablePropertiesDialogModule.applyTableSubProperties();
        }
        this.closeCellMarginsDialog();
    };
    /**
     * @private
     * @param {WCellFormat} cellFormat Specifies cell format.
     * @returns {void}
     */
    public applySubCellOptions(cellFormat: WCellFormat): void {
        this.documentHelper.owner.editorHistory.initComplexHistory(this.documentHelper.selection, 'CellMarginsSelection');
        this.documentHelper.owner.editorModule.initHistory('CellOptions');
        /* eslint-disable max-len */
        this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.combineWidget(this.owner);
        this.applyCellMarginValue(this.documentHelper.selection.start.paragraph.associatedCell.ownerRow.combineWidget(this.owner) as TableRowWidget, this.documentHelper.selection.start, this.documentHelper.selection.end, cellFormat);
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection, false);
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistory.currentHistoryInfo)) {
            this.documentHelper.owner.editorHistory.updateComplexHistory();
        }
    }

    public applyCellMarginValue(row: TableRowWidget, start: TextPosition, end: TextPosition, cellFormat: WCellFormat): void {
        this.applyCellMarginsInternal(row, cellFormat);
        if (end.paragraph.associatedCell.ownerRow === row) {
            return;
        }
        const newRow: TableRowWidget = row.nextWidget as TableRowWidget;
        if (!isNullOrUndefined(newRow)) {
            this.applyCellMarginValue(newRow, start, end, cellFormat);
        }
    }
    private applyCellMarginsInternal(row: TableRowWidget, cellFormat: WCellFormat): void {
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistory.currentBaseHistoryInfo)) {
            const currentFormat: WCellFormat = (row.childWidgets[0] as TableCellWidget).cellFormat;
            /* eslint-disable max-len */
            cellFormat = this.documentHelper.owner.editorHistory.currentBaseHistoryInfo.addModifiedCellOptions(currentFormat, cellFormat, row.ownerTable);
        }
        if (!isNullOrUndefined(cellFormat)) {
            this.applyCellMarginsForCells(row, cellFormat);
        }
    }

    private applyCellMarginsForCells(row: TableRowWidget, cellFormat: WCellFormat): void {
        const rowCells: TableCellWidget[] = row.childWidgets as TableCellWidget[];
        this.iterateCells(rowCells, cellFormat);
    }

    private iterateCells(cells: TableCellWidget[], cellFormat: WCellFormat): void {
        for (let i: number = 0; i < cells.length; i++) {
            this.applySubCellMargins(cells[i].cellFormat, cellFormat);
        }
        this.documentHelper.owner.tablePropertiesDialogModule.calculateGridValue(cells[0].ownerTable);
    }

    private applySubCellMargins(sourceFormat: WCellFormat, cellFormat: WCellFormat): void {
        sourceFormat.leftMargin = cellFormat.leftMargin;
        sourceFormat.topMargin = cellFormat.topMargin;
        sourceFormat.rightMargin = cellFormat.rightMargin;
        sourceFormat.bottomMargin = cellFormat.bottomMargin;
    }

    private applyTableOptions(cellFormat: WCellFormat): void {
        if (!this.sameAsTableCheckBox.checked) {
            cellFormat.leftMargin = this.leftMarginBox.value;
            cellFormat.topMargin = this.topMarginBox.value;
            cellFormat.bottomMargin = this.bottomMarginBox.value;
            cellFormat.rightMargin = this.rightMarginBox.value;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public closeCellMarginsDialog = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.dialog.element.style.pointerEvents = '';
    };
    /**
     * @private
     * @returns {void}
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
        this.documentHelper = undefined;
        this.sameAsTableCheckBox = undefined;
    }
    /**
     * @private
     * @param {CellOptionsDialog | TableOptionsDialog} dialog - Specifies cell options dialog.
     * @param {HTMLDivElement} div - Specifies the html element.
     * @param {L10n} locale - Specifies the locale
     * @returns {void}
     */
    public static getCellMarginDialogElements(dialog: CellOptionsDialog | TableOptionsDialog, div: HTMLDivElement, locale: L10n): void {
        if (!isNullOrUndefined(dialog)) {
            const table: HTMLTableElement = <HTMLTableElement>createElement('TABLE', { className: 'e-de-cell-margin-top' });
            const tr1: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr', { styles: 'height: 50px;' });
            const td1: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
            const topLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Top'), className: 'e-de-cell-dia-label-common',
                id: dialog.target.id + '_TopLabel'
            });
            const topTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%', id: dialog.target.id + '_Top'
            });
            td1.appendChild(topLabel); td1.appendChild(topTextBox);
            const td2: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { className: 'e-de-tbl-btn-separator' });
            const leftLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Left'), className: 'e-de-cell-dia-label-common',
                id: dialog.target.id + '_leftLabel'
            });
            const leftTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_left'
            });
            td2.appendChild(leftLabel); td2.appendChild(leftTextBox);
            tr1.appendChild(td1); tr1.appendChild(td2);
            const tr2: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr', { styles: 'height: 50px;' });
            const td3: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'width:40%;' });
            const bottomLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Bottom'),
                className: 'e-de-cell-dia-label-common', id: dialog.target.id + '_bottomLabel'
            });
            const bottomTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_bottom'
            });
            td3.appendChild(bottomLabel); td3.appendChild(bottomTextBox);
            const td4: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'width:40%;' });
            const rightLabel: HTMLLabelElement = <HTMLLabelElement>createElement('label', {
                innerHTML: locale.getConstant('Right'), id: dialog.target.id + '_rightLabel',
                className: 'e-de-cell-dia-label-common'
            });
            const rightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' },
                styles: 'width:100%', id: dialog.target.id + '_right'
            });
            td4.appendChild(rightLabel); td4.appendChild(rightTextBox);
            tr2.appendChild(td3); tr2.appendChild(td4); table.appendChild(tr1);
            table.appendChild(tr2); div.appendChild(table);
            dialog.target.appendChild(div);
            dialog.topMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 175, decimals: 2,
                enablePersistence: false
            });
            dialog.topMarginBox.appendTo(topTextBox);
            dialog.leftMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 175,
                decimals: 2, enablePersistence: false
            });
            dialog.leftMarginBox.appendTo(leftTextBox);
            dialog.bottomMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 175, decimals: 2,
                enablePersistence: false
            });
            dialog.bottomMarginBox.appendTo(bottomTextBox);
            dialog.rightMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, width: 175,
                decimals: 2, enablePersistence: false
            });
            dialog.rightMarginBox.appendTo(rightTextBox);
        }
    }
}
