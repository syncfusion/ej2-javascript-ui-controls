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

    private innerDiv: HTMLDivElement;
    private innerDivLabel: HTMLElement;
    private div: HTMLDivElement;
    private cellSpaceLabel: HTMLElement;
    private table2: HTMLTableElement;
    private tr3: HTMLTableRowElement;
    private td5: HTMLTableCellElement;
    private allowSpaceCheckBox1: HTMLInputElement;
    private td6: HTMLTableCellElement;
    private divBtn: HTMLDivElement;
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
        this.innerDiv = <HTMLDivElement>createElement('div');
        this.innerDivLabel = createElement('Label', {
            id: this.target.id + '_innerDivLabel', className: 'e-de-para-dlg-heading',
            innerHTML: localValue.getConstant('Default cell margins')
        });
        this.innerDiv.appendChild(this.innerDivLabel);
        CellOptionsDialog.getCellMarginDialogElements(this, this.innerDiv, localValue, false);
        this.div = <HTMLDivElement>createElement('div');
        this.cellSpaceLabel = createElement('Label', {
            className: 'e-de-para-dlg-heading',
            id: this.target.id + '_cellSpaceLabel'
        });
        this.cellSpaceLabel.innerHTML = localValue.getConstant('Default cell spacing');
        this.div.appendChild(this.cellSpaceLabel);
        this.table2 = <HTMLTableElement>createElement('TABLE', {
            styles: 'height: 30px;'
        });
        this.tr3 = <HTMLTableRowElement>createElement('tr');
        this.td5 = <HTMLTableCellElement>createElement('td');
        this.allowSpaceCheckBox1 = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_cellcheck'
        });
        let td6Padding: string;
        if (isRtl) {
            td6Padding = 'padding-right:25px;';
        } else {
            td6Padding = 'padding-left:25px;';
        }
        this.td6 = <HTMLTableCellElement>createElement('td', { styles: td6Padding });
        this.cellspacingTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_cellspacing'
        });
        this.td5.appendChild(this.allowSpaceCheckBox1);
        this.td6.appendChild(this.cellspacingTextBox); this.tr3.appendChild(this.td5); this.tr3.appendChild(this.td6);
        this.table2.appendChild(this.tr3);
        this.div.appendChild(this.table2);
        this.divBtn = document.createElement('div');
        this.target.appendChild(this.div);
        this.target.appendChild(this.divBtn);
        this.cellSpaceTextBox = new NumericTextBox({
            value: 0, min: 0, max: 264.5, width: 174,
            decimals: 2, enablePersistence: false
        });
        this.cellSpaceTextBox.appendTo(this.cellspacingTextBox);
        this.allowSpaceCheckBox = new CheckBox({
            label: localValue.getConstant('Allow spacing between cells'),
            change: this.changeAllowSpaceCheckBox,
            enableRtl: isRtl,
            cssClass: 'e-de-tbl-margin-sub-header'
        });
        this.allowSpaceCheckBox.appendTo(this.allowSpaceCheckBox1);
        this.allowSpaceCheckBox1.setAttribute('aria-label',localValue.getConstant('Allow spacing between cells'));
        this.cellspacingTextBox.setAttribute('aria-label','cell spacing');
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
    public applySubTableOptions(tableFormat: WTableFormat, sourceTable?: TableWidget): void {
        this.documentHelper.owner.editorHistoryModule.initComplexHistory(this.documentHelper.selection, 'TableMarginsSelection');
        this.applyTableOptionsHistory(tableFormat, sourceTable);
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistoryModule.currentHistoryInfo)) {
            this.documentHelper.owner.editorHistoryModule.updateComplexHistory();
        }
    }
    /**
     * @private
     * @param {WTableFormat} tableFormat Specifies table format.
     * @returns {void}
     */
    public applyTableOptionsHelper(tableFormat: WTableFormat): void {
        this.applySubTableOptionsHelper(tableFormat, undefined);
    }

    private applyTableOptionsHistory(tableFormat: WTableFormat, sourceTable: TableWidget): void {
        this.documentHelper.owner.editorModule.initHistory('TableOptions');
        this.applySubTableOptionsHelper(tableFormat, sourceTable);
    }

    private applySubTableOptionsHelper(tableFormat: WTableFormat, ownerTable: TableWidget): void {
        if(isNullOrUndefined(ownerTable)) {
            ownerTable = this.documentHelper.selection.start.currentWidget.paragraph.associatedCell.ownerTable;
            ownerTable = ownerTable.combineWidget(this.documentHelper.owner.viewer) as TableWidget;
        }
        const currentTableFormat: WTableFormat = ownerTable.tableFormat;
        if (!isNullOrUndefined(this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo)) {
            this.documentHelper.owner.editorHistoryModule.currentBaseHistoryInfo.addModifiedTableOptions(currentTableFormat);
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
        tableFormat.cellSpacing = this.cellSpaceTextBox.value;
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
            this.cellSpaceTextBox.value = 0;
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
        if (this.tableFormatIn) {
            this.tableFormatIn.destroy();
            this.tableFormatIn = undefined;
        }
        this.removeElements();
        this.dialog = undefined;
        this.target = undefined;
        this.documentHelper = undefined;
        this.cellspacingTextBox = undefined;
        this.allowSpaceCheckBox = undefined;
    }
    private removeElements(): void {
        if (this.innerDiv) {
            this.innerDiv.remove();
            this.innerDiv = undefined;
        }
        if (this.innerDivLabel) {
            this.innerDivLabel.remove();
            this.innerDivLabel = undefined;
        }
        if (this.div) {
            this.div.remove();
            this.div = undefined;
        }
        if (this.cellSpaceLabel) {
            this.cellSpaceLabel.remove();
            this.cellSpaceLabel = undefined;
        }
        if (this.table2) {
            this.table2.remove();
            this.table2 = undefined;
        }
        if (this.tr3) {
            this.tr3.remove();
            this.tr3 = undefined;
        }
        if (this.td5) {
            this.td5.remove();
            this.td5 = undefined;
        }
        if (this.allowSpaceCheckBox1) {
            this.allowSpaceCheckBox1.remove();
            this.allowSpaceCheckBox1 = undefined;
        }
        if (this.td6) {
            this.td6.remove();
            this.td6 = undefined;
        }
        if (this.divBtn) {
            this.divBtn.remove();
            this.divBtn = undefined;
        }
    }
}
