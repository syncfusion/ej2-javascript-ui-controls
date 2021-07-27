/* eslint-disable */
import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat } from '../index';
import { isNullOrUndefined, L10n, createElement } from '@syncfusion/ej2-base';
import { SelectionTableFormat } from '../index';
import { TableWidget } from '../viewer/page';
import { CellOptionsDialog } from './index';
import { DocumentHelper } from '../viewer';

/**
 * The Table options dialog is used to modify default cell margins and cell spacing of selected table.
 */
export class TableOptionsDialog {
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    /**
     * @private
     */
    public dialog: Dialog;
    /**
     * @private
     */
    public target: HTMLElement;
    private cellspacingTextBox: HTMLElement;
    private allowSpaceCheckBox: CheckBox;
    private cellSpaceTextBox: NumericTextBox;
    /**
     * @private
     */
    public leftMarginBox: NumericTextBox;
    /**
     * @private
     */
    public topMarginBox: NumericTextBox;
    /**
     * @private
     */
    public rightMarginBox: NumericTextBox;
    /**
     * @private
     */
    public bottomMarginBox: NumericTextBox;
    /**
     * @private
     */
    public tableFormatIn: WTableFormat;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper.
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    /**
     * @private
     * @returns {WTableFormat} - Returns table format.
     */
    public get tableFormat(): WTableFormat {
        if (isNullOrUndefined(this.tableFormatIn)) {
            return this.tableFormatIn = new WTableFormat();
        }
        return this.tableFormatIn;
    }

    private getModuleName(): string {
        return 'TableOptionsDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specifies the locale value
     * @param {boolean} isRtl - Specifies the is rtl
     * @returns {void}
     */
    public initTableOptionsDialog(localValue: L10n, isRtl?: boolean): void {
        this.target = createElement('div', {
            id: this.documentHelper.owner.containerId + '_insertCellMarginsDialog', className: 'e-de-table-options-dlg'
        });
        const innerDiv: HTMLDivElement = <HTMLDivElement>createElement('div', {
            className: 'e-de-table-options-dlg-div'
        });
        const innerDivLabel: HTMLElement = createElement('Label', {
            id: this.target.id + '_innerDivLabel', className: 'e-de-cell-dia-options-label',
            innerHTML: localValue.getConstant('Default cell margins')
        });
        innerDiv.appendChild(innerDivLabel);
        CellOptionsDialog.getCellMarginDialogElements(this, innerDiv, localValue);
        const div: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 475px; position: relative;' });
        const cellSpaceLabel: HTMLElement = createElement('Label', {
            className: 'e-de-cell-dia-options-label',
            id: this.target.id + '_cellSpaceLabel'
        });
        cellSpaceLabel.innerHTML = localValue.getConstant('Default cell spacing');
        div.appendChild(cellSpaceLabel);
        const table2: HTMLTableElement = <HTMLTableElement>createElement('TABLE', {
            styles: 'height: 30px;'
        });
        const tr3: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        const td5: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        const allowSpaceCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_cellcheck'
        });
        let td6Padding: string;
        if (isRtl) {
            td6Padding = 'padding-right:15px;';
        } else {
            td6Padding = 'padding-left:14px;';
        }
        const td6: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: td6Padding });
        this.cellspacingTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_cellspacing'
        });
        td5.appendChild(allowSpaceCheckBox);
        td6.appendChild(this.cellspacingTextBox); tr3.appendChild(td5); tr3.appendChild(td6);
        table2.appendChild(tr3);
        div.appendChild(table2);
        const divBtn: HTMLDivElement = document.createElement('div');
        this.target.appendChild(div);
        this.target.appendChild(divBtn);
        this.cellSpaceTextBox = new NumericTextBox({
            value: 0, min: 0, max: 264.5, width: 163,
            decimals: 2, enablePersistence: false
        });
        this.cellSpaceTextBox.appendTo(this.cellspacingTextBox);
        this.allowSpaceCheckBox = new CheckBox({
            label: localValue.getConstant('Allow spacing between cells'),
            change: this.changeAllowSpaceCheckBox,
            enableRtl: isRtl,
            cssClass: 'e-de-tbl-margin-sub-header'
        });
        this.allowSpaceCheckBox.appendTo(allowSpaceCheckBox);
    }
    /**
     * @private
     * @returns {void}
     */
    public loadCellMarginsDialog(): void {
        const tableFormat: SelectionTableFormat = this.documentHelper.selection.tableFormat;
        this.cellSpaceTextBox.value = tableFormat.cellSpacing;
        this.bottomMarginBox.value = tableFormat.bottomMargin;
        this.topMarginBox.value = tableFormat.topMargin;
        this.rightMarginBox.value = tableFormat.rightMargin;
        this.leftMarginBox.value = tableFormat.leftMargin;
        if (tableFormat.cellSpacing > 0) {
            this.allowSpaceCheckBox.checked = true;
            this.cellSpaceTextBox.enabled = true;
        } else {
            this.allowSpaceCheckBox.checked = false;
            this.cellSpaceTextBox.enabled = false;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public applyTableCellProperties = (): void => {
        const tableFormat: SelectionTableFormat = this.documentHelper.selection.tableFormat;
        if (!isNullOrUndefined(this.bottomMarginBox.value || this.leftMarginBox.value
            || this.rightMarginBox.value || this.topMarginBox.value || this.cellSpaceTextBox.value)
            && (tableFormat.bottomMargin !== this.bottomMarginBox.value
                || tableFormat.leftMargin !== this.leftMarginBox.value
                || tableFormat.rightMargin !== this.rightMarginBox.value
                || tableFormat.topMargin !== this.topMarginBox.value
                || tableFormat.cellSpacing !== this.cellSpaceTextBox.value)) {
            this.documentHelper.owner.tablePropertiesDialogModule.isTableOptionsUpdated = true;
            this.applyTableOptions(this.tableFormat);
            this.documentHelper.owner.tablePropertiesDialogModule.applyTableSubProperties();
        }
        this.closeCellMarginsDialog();
    };

    /**
     * @private
     * @param {WTableFormat} tableFormat Specifies table format.
     * @returns {void}
     */
    public applySubTableOptions(tableFormat: WTableFormat): void {
        this.documentHelper.owner.editorHistory.initComplexHistory(this.documentHelper.selection, 'TableMarginsSelection');
        this.applyTableOptionsHistory(tableFormat);
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistory.currentHistoryInfo)) {
            this.documentHelper.owner.editorHistory.updateComplexHistory();
        }
    }
    /**
     * @private
     * @param {WTableFormat} tableFormat Specifies table format.
     * @returns {void}
     */
    public applyTableOptionsHelper(tableFormat: WTableFormat): void {
        this.applySubTableOptionsHelper(tableFormat);
    }

    private applyTableOptionsHistory(tableFormat: WTableFormat): void {
        this.documentHelper.owner.editorModule.initHistory('TableOptions');
        this.applySubTableOptionsHelper(tableFormat);
    }

    private applySubTableOptionsHelper(tableFormat: WTableFormat): void {
        let ownerTable: TableWidget = this.documentHelper.selection.start.currentWidget.paragraph.associatedCell.ownerTable;
        ownerTable = ownerTable.combineWidget(this.documentHelper.owner.viewer) as TableWidget;
        const currentTableFormat: WTableFormat = ownerTable.tableFormat;
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistory.currentBaseHistoryInfo)) {
            this.documentHelper.owner.editorHistory.currentBaseHistoryInfo.addModifiedTableOptions(currentTableFormat);
        }
        currentTableFormat.cellSpacing = tableFormat.cellSpacing;
        currentTableFormat.leftMargin = tableFormat.leftMargin;
        currentTableFormat.topMargin = tableFormat.topMargin;
        currentTableFormat.rightMargin = tableFormat.rightMargin;
        currentTableFormat.bottomMargin = tableFormat.bottomMargin;
        this.documentHelper.owner.tablePropertiesDialogModule.calculateGridValue(ownerTable);
    }

    /**
     * @private
     * @param {WTableFormat} tableFormat Specifies the table format
     */
    public applyTableOptions(tableFormat: WTableFormat): void {
        tableFormat.leftMargin = this.leftMarginBox.value;
        tableFormat.topMargin = this.topMarginBox.value;
        tableFormat.bottomMargin = this.bottomMarginBox.value;
        tableFormat.rightMargin = this.rightMarginBox.value;
        if (this.allowSpaceCheckBox.checked) {
            tableFormat.cellSpacing = this.cellSpaceTextBox.value;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public closeCellMarginsDialog = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.dialog.element.style.pointerEvents = '';
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const documentLocale: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        documentLocale.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initTableOptionsDialog(documentLocale, this.documentHelper.owner.enableRtl);
        }
        this.loadCellMarginsDialog();
        this.documentHelper.dialog.header = documentLocale.getConstant('Table Options');
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = undefined;
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        //  this.documentHelper.dialog.cssClass = 'e-de-table-margin-size';
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.open = undefined;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.removeEvents;
        this.documentHelper.dialog.buttons = [{
            click: this.applyTableCellProperties,
            buttonModel: { content: documentLocale.getConstant('Ok'), cssClass: 'e-flat e-table-cell-okay', isPrimary: true }
        },
        {
            click: this.closeCellMarginsDialog,
            buttonModel: { content: documentLocale.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-cancel' }
        }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public changeAllowSpaceCheckBox = (): void => {
        if (this.allowSpaceCheckBox.checked) {
            this.cellSpaceTextBox.enabled = true;
        } else {
            this.cellSpaceTextBox.enabled = false;
        }
    };
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
    public destroy(): void {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let p: number = 0; p < this.target.childNodes.length; p++) {
                this.target.removeChild(this.target.childNodes[p]);
                p--;
            }
            this.target = undefined;
        }
        this.dialog = undefined;
        this.target = undefined;
        this.documentHelper = undefined;
        this.cellspacingTextBox = undefined;
        this.allowSpaceCheckBox = undefined;
    }
}
