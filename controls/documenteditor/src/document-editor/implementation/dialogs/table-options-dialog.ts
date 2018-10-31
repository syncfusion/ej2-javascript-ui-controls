import { LayoutViewer } from '../index';
import { Dialog } from '@syncfusion/ej2-popups';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat } from '../index';
import { isNullOrUndefined, L10n, createElement, setCulture } from '@syncfusion/ej2-base';
import { SelectionTableFormat } from '../index';
import { TableWidget } from '../viewer/page';
import { CellOptionsDialog } from './index';

/**
 * The Table options dialog is used to modify default cell margins and cell spacing of selected table.
 */
export class TableOptionsDialog {
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
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
    }
    /**
     * @private
     */
    get tableFormat(): WTableFormat {
        if (isNullOrUndefined(this.tableFormatIn)) {
            return this.tableFormatIn = new WTableFormat();
        }
        return this.tableFormatIn;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'TableOptionsDialog';
    }
    /**
     * @private
     */
    public initTableOptionsDialog(localValue: L10n): void {
        let instance: LayoutViewer = this.owner;
        this.target = createElement('div', {
            id: this.owner.owner.containerId + '_insertCellMarginsDialog', className: 'e-de-table-options-dlg'
        });
        this.owner.owner.element.appendChild(this.target);
        let innerDiv: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 475px;position: relative;height: 180px;' });
        let innerDivLabel: HTMLElement = createElement('Label', {
            id: this.target.id + '_innerDivLabel', className: 'e-de-cell-dia-options-label',
            innerHTML: localValue.getConstant('Default cell margins')
        });
        innerDiv.appendChild(innerDivLabel);
        CellOptionsDialog.getCellMarginDialogElements(this, innerDiv, localValue);
        let div: HTMLDivElement = <HTMLDivElement>createElement('div', { styles: 'width: 475px; position: relative;' });
        let cellSpaceLabel: HTMLElement = createElement('Label', {
            className: 'e-de-cell-dia-options-label',
            id: this.target.id + '_cellSpaceLabel'
        });
        cellSpaceLabel.innerHTML = localValue.getConstant('Default cell spacing');
        div.appendChild(cellSpaceLabel);
        let table2: HTMLTableElement = <HTMLTableElement>createElement('TABLE', {
            styles: 'height: 30px;padding-bottom: 15px;'
        });
        let tr3: HTMLTableRowElement = <HTMLTableRowElement>createElement('tr');
        let td5: HTMLTableCellElement = <HTMLTableCellElement>createElement('td');
        let allowSpaceCheckBox: HTMLInputElement = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'checkbox' }, id: this.target.id + '_cellcheck'
        });
        let td6: HTMLTableCellElement = <HTMLTableCellElement>createElement('td', { styles: 'padding-left: 15px;', });
        this.cellspacingTextBox = <HTMLInputElement>createElement('input', {
            attrs: { 'type': 'text' }, id: this.target.id + '_cellspacing'
        });
        td5.appendChild(allowSpaceCheckBox);
        td6.appendChild(this.cellspacingTextBox); tr3.appendChild(td5); tr3.appendChild(td6);
        table2.appendChild(tr3);
        div.appendChild(table2);
        let divBtn: HTMLDivElement = document.createElement('div');
        this.target.appendChild(div);
        this.target.appendChild(divBtn);
        this.cellSpaceTextBox = new NumericTextBox({
            value: 0, min: 0, max: 264.5, width: 150,
            decimals: 2, enablePersistence: false
        });
        this.cellSpaceTextBox.appendTo(this.cellspacingTextBox);
        this.allowSpaceCheckBox = new CheckBox({
            label: localValue.getConstant('Allow spacing between cells'),
            change: this.changeAllowSpaceCheckBox,
            cssClass: 'e-de-tbl-margin-sub-header',
        });
        this.allowSpaceCheckBox.appendTo(allowSpaceCheckBox);
    }
    /**
     * @private
     */
    public loadCellMarginsDialog(): void {
        let tableFormat: SelectionTableFormat = this.owner.selection.tableFormat;
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
     */
    public applyTableCellProperties = (): void => {
        let tableFormat: SelectionTableFormat = this.owner.selection.tableFormat;
        if (!isNullOrUndefined(this.bottomMarginBox.value || this.leftMarginBox.value
            || this.rightMarginBox.value || this.topMarginBox.value || this.cellSpaceTextBox.value)
            && (tableFormat.bottomMargin !== this.bottomMarginBox.value
                || tableFormat.leftMargin !== this.leftMarginBox.value
                || tableFormat.rightMargin !== this.rightMarginBox.value
                || tableFormat.topMargin !== this.topMarginBox.value
                || tableFormat.cellSpacing !== this.cellSpaceTextBox.value)) {
            this.owner.owner.tablePropertiesDialogModule.isTableOptionsUpdated = true;
            this.applyTableOptions(this.tableFormat);
            this.owner.owner.tablePropertiesDialogModule.applyTableSubProperties();
        }
        this.closeCellMarginsDialog();
    }
    /**
     * @private
     */
    public applySubTableOptions(tableFormat: WTableFormat): void {
        this.owner.owner.editorHistory.initComplexHistory(this.owner.selection, 'TableMarginsSelection');
        this.applyTableOptionsHistory(tableFormat);
        if (!isNullOrUndefined(this.owner.owner.editorHistory.currentHistoryInfo)) {
            this.owner.owner.editorHistory.updateComplexHistory();
        }
    }
    /**
     * @private
     */
    public applyTableOptionsHelper(tableFormat: WTableFormat): void {
        this.applySubTableOptionsHelper(tableFormat);
    }
    /**
     * @private
     */
    public applyTableOptionsHistory(tableFormat: WTableFormat): void {
        this.owner.owner.editorModule.initHistory('TableOptions');
        this.applySubTableOptionsHelper(tableFormat);
    }
    /**
     * @private
     */
    public applySubTableOptionsHelper(tableFormat: WTableFormat): void {
        let ownerTable: TableWidget = this.owner.selection.start.currentWidget.paragraph.associatedCell.ownerTable;
        ownerTable = ownerTable.combineWidget(this.owner) as TableWidget;
        let currentTableFormat: WTableFormat = ownerTable.tableFormat;
        if (!isNullOrUndefined(this.owner.owner.editorHistory.currentBaseHistoryInfo)) {
            this.owner.owner.editorHistory.currentBaseHistoryInfo.addModifiedTableOptions(currentTableFormat);
        }
        currentTableFormat.cellSpacing = tableFormat.cellSpacing;
        currentTableFormat.leftMargin = tableFormat.leftMargin;
        currentTableFormat.topMargin = tableFormat.topMargin;
        currentTableFormat.rightMargin = tableFormat.rightMargin;
        currentTableFormat.bottomMargin = tableFormat.bottomMargin;
        this.owner.owner.tablePropertiesDialogModule.calculateGridValue(ownerTable);
    }
    /**
     * @private
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
     */
    public closeCellMarginsDialog = (): void => {
        this.owner.dialog.hide();
        this.owner.dialog.element.style.pointerEvents = '';
        this.owner.updateFocus();
    }
    /**
     * @private
     */
    public show(): void {
        let documentLocale: L10n = new L10n('documenteditor', this.owner.owner.defaultLocale);
        documentLocale.setLocale(this.owner.owner.locale);
        setCulture(this.owner.owner.locale);
        if (!this.target) {
            this.initTableOptionsDialog(documentLocale);
        }
        this.loadCellMarginsDialog();
        this.owner.dialog.header = documentLocale.getConstant('Table Options');
        this.owner.dialog.content = this.target;
        this.owner.dialog.beforeOpen = undefined;
        this.owner.dialog.position = { X: 'center', Y: 'center' };
        //  this.owner.dialog.cssClass = 'e-de-table-margin-size';
        this.owner.dialog.height = 'auto';
        this.owner.dialog.width = 'auto';
        this.owner.dialog.open = undefined;
        this.owner.dialog.beforeOpen = this.owner.updateFocus;
        this.owner.dialog.close = this.removeEvents;
        this.owner.dialog.buttons = [{
            click: this.applyTableCellProperties,
            buttonModel: { content: documentLocale.getConstant('Ok'), cssClass: 'e-flat e-table-cell-okay', isPrimary: true }
        },
        {
            click: this.closeCellMarginsDialog,
            buttonModel: { content: documentLocale.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-cancel' }
        }];
        this.owner.dialog.dataBind();
        this.owner.dialog.show();
    }
    /**
     * @private
     */
    public changeAllowSpaceCheckBox = (): void => {
        if (this.allowSpaceCheckBox.checked) {
            this.cellSpaceTextBox.enabled = true;
        } else {
            this.cellSpaceTextBox.enabled = false;
        }
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
        this.owner = undefined;
        this.cellspacingTextBox = undefined;
        this.allowSpaceCheckBox = undefined;
    }
}