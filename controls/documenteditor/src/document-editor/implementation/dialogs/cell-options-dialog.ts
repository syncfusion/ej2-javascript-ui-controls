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

    private innerDiv: HTMLDivElement;
    private innerDivLabel: HTMLElement;
    private table: HTMLTableElement;
    private tr: HTMLTableRowElement;
    private td: HTMLTableCellElement;
    private divBtn: HTMLDivElement;
    private table1: HTMLDivElement;

    private changeSameAsTableClickHandler: EventListener = this.onChangeSameAsTable.bind(this);
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
    private onChangeSameAsTable(): void {
        this.changeSameAsTable();
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
            className: 'e-de-table-cell-margin-dlg'
        });
        this.innerDiv = <HTMLDivElement>createElement('div');
        this.innerDivLabel = createElement('Label', {
            className: 'e-de-para-dlg-heading'
        });
        this.innerDivLabel.innerHTML = localValue.getConstant('Cell margins');
        this.innerDiv.appendChild(this.innerDivLabel);
        this.table = <HTMLTableElement>createElement('TABLE', {
            styles: 'padding-bottom: 8px;padding-top: 8px;', className: 'e-de-cell-margin-top'
        });
        this.tr = <HTMLTableRowElement>createElement('tr');
        this.td = <HTMLTableCellElement>createElement('td', { className: 'e-de-tbl-btn-separator' });
        const sameAsTableCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_sameAsCheckBox'
        });
        sameAsTableCheckBox.setAttribute('aria-label', localValue.getConstant('Same as the whole table'));
        this.td.appendChild(sameAsTableCheckBox);
        this.tr.appendChild(this.td); this.table.appendChild(this.tr);
        this.innerDiv.appendChild(this.table);
        CellOptionsDialog.getCellMarginDialogElements(this, this.innerDiv, localValue, true);
        this.divBtn = document.createElement('div');
        this.target.appendChild(this.divBtn);
        this.sameAsTableCheckBox = new CheckBox({
            label: localValue.getConstant('Same as the whole table'),
            change: this.changeSameAsTable,
            enableRtl: isRtl
        });
        sameAsTableCheckBox.setAttribute('aria-label', localValue.getConstant('Same as the whole table'));
        this.sameAsTableCheckBox.appendTo(sameAsTableCheckBox);
        this.sameAsTableCheckBox.addEventListener('change', this.changeSameAsTableClickHandler);
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
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
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
        this.documentHelper.owner.editorHistoryModule.initComplexHistory(this.documentHelper.selection, 'CellMarginsSelection');
        this.documentHelper.owner.editorModule.initHistory('CellOptions');
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo)) {
            this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.insertedFormat = cellFormat;
        }
        /* eslint-disable max-len */
        this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.combineWidget(this.owner);
        this.applyCellMarginValue(this.documentHelper.selection.start.paragraph.associatedCell.ownerRow.combineWidget(this.owner) as TableRowWidget, this.documentHelper.selection.start, this.documentHelper.selection.end, cellFormat);
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection, false);
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistoryModule.currentHistoryInfo)) {
            this.documentHelper.owner.editorHistoryModule.updateComplexHistory();
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
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo)) {
            const currentFormat: WCellFormat = (row.childWidgets[0] as TableCellWidget).cellFormat;
            /* eslint-disable max-len */
            cellFormat = this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.addModifiedCellOptions(currentFormat, cellFormat, row.ownerTable);
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
            this.applySubCellMargins(cells[parseInt(i.toString(), 10)].cellFormat, cellFormat);
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
                this.target.removeChild(this.target.childNodes[parseInt(y.toString(), 10)]);
                y--;
            }
            this.target = undefined;
        }
        this.removeElements();
        this.unWireEvents();
        this.dialog = undefined;
        this.target = undefined;
        this.documentHelper = undefined;
        this.sameAsTableCheckBox = undefined;
    }

    private removeElements(): void {
        if (this.table){
            this.table.remove();
            this.table = undefined;
        }
        if (this.innerDiv){
            this.innerDiv.remove();
            this.innerDiv = undefined;
        }
        if (this.innerDivLabel){
            this.innerDivLabel.remove();
            this.innerDivLabel = undefined;
        }
        if (this.tr){
            this.tr.remove();
            this.tr = undefined;
        }
        if (this.td){
            this.td.remove();
            this.td = undefined;
        }
        if (this.divBtn){
            this.divBtn.remove();
            this.divBtn = undefined;
        }
    }
    private unWireEvents(): void {
        if (this.sameAsTableCheckBox) {
            this.sameAsTableCheckBox.removeEventListener('change', this.changeSameAsTableClickHandler);
        }
    }
    /**
     * @private
     * @param {CellOptionsDialog | TableOptionsDialog} dialog - Specifies cell options dialog.
     * @param {HTMLDivElement} div - Specifies the html element.
     * @param {L10n} locale - Specifies the locale
     * @param {boolean} cellOptions - Specifies is cell options.
     * @returns {void}
     */
    public static getCellMarginDialogElements(dialog: CellOptionsDialog | TableOptionsDialog, div: HTMLDivElement, locale: L10n, cellOptions: boolean): void {
        if (!isNullOrUndefined(dialog)) {
            const table1: HTMLTableElement = <HTMLTableElement>createElement('div');
            const tr1: HTMLTableRowElement = <HTMLTableRowElement>createElement('div', { className: 'e-de-container-row' });
            const td1: HTMLTableCellElement = <HTMLTableCellElement>createElement('div', { className: 'e-de-subcontainer-left' });

            const topTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%'
            });
            // topTextBox.setAttribute('aria-label','TopMargin');
            td1.appendChild(topTextBox);
            const td2: HTMLTableCellElement = <HTMLTableCellElement>createElement('div', { className: 'e-de-subcontainer-right' });

            const leftTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%'
            });
            // leftTextBox.setAttribute('aria-label','LeftMargin');
            td2.appendChild(leftTextBox);
            tr1.appendChild(td1); tr1.appendChild(td2);
            const tr2: HTMLTableRowElement = <HTMLTableRowElement>createElement('div', { className: cellOptions ? 'e-de-dlg-row' : 'e-de-container-row' });
            const td3: HTMLTableCellElement = <HTMLTableCellElement>createElement('div', { className: 'e-de-subcontainer-left' });

            const bottomTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%'
            });
            // bottomTextBox.setAttribute('aria-label','BottomMargin');
            td3.appendChild(bottomTextBox);
            const td4: HTMLTableCellElement = <HTMLTableCellElement>createElement('div', { className: 'e-de-subcontainer-right' });

            const rightTextBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
                attrs: { 'type': 'text' }, styles: 'width:100%'
            });
            // rightTextBox.setAttribute('aria-label','RightMargin');
            td4.appendChild(rightTextBox);
            tr2.appendChild(td3); tr2.appendChild(td4); table1.appendChild(tr1);
            table1.appendChild(tr2);
            div.appendChild(table1);
            dialog.target.appendChild(div);
            dialog.topMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, decimals: 2,
                enablePersistence: false, placeholder: locale.getConstant('Top'),
                floatLabelType: 'Always'
            });
            dialog.topMarginBox.appendTo(topTextBox);
            dialog.leftMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, decimals: 2, enablePersistence: false, placeholder: locale.getConstant('Left'),
                floatLabelType: 'Always'
            });
            dialog.leftMarginBox.appendTo(leftTextBox);
            dialog.bottomMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, decimals: 2,
                enablePersistence: false, placeholder: locale.getConstant('Bottom'),
                floatLabelType: 'Always'
            });
            dialog.bottomMarginBox.appendTo(bottomTextBox);
            dialog.rightMarginBox = new NumericTextBox({
                value: 0, min: 0, max: 1584, decimals: 2, enablePersistence: false, placeholder: locale.getConstant('Right'),
                floatLabelType: 'Always'
            });
            dialog.rightMarginBox.appendTo(rightTextBox);
            rightTextBox.setAttribute('aria-labelledby', locale.getConstant('Right'));
            leftTextBox.setAttribute('aria-labelledby', locale.getConstant('Left'));
            bottomTextBox.setAttribute('aria-labelledby', locale.getConstant('Bottom'));
            topTextBox.setAttribute('aria-labelledby', locale.getConstant('Top'));
        }
    }
}
