import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
/**
 * The Table dialog is used to insert table at selection.
 */
export class TableDialog {
    private columnsCountBox: HTMLInputElement;
    private rowsCountBox: HTMLInputElement;
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private columnValueTexBox: NumericTextBox;
    private rowValueTextBox: NumericTextBox;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'TableDialog';
    }
    /**
     * @private
     */
    public initTableDialog(localValue: L10n): void {
        let instance: TableDialog = this;
        let id: string = this.documentHelper.owner.containerId + '_insert_Table';
        this.target = createElement('div', { id: id, className: 'e-de-insert-table' });
        let parentDiv: HTMLElement = createElement('div');

        let columnContainer: HTMLElement = createElement('div', {
            className: 'e-de-insert-table-dlg-sub-header', innerHTML: localValue.getConstant('Number of columns')
        });
        let columnValue: HTMLElement = createElement('div', { className: 'e-de-insert-table-dlg-input' });
        this.columnsCountBox = createElement('input', {
            attrs: { type: 'text' }, id: this.documentHelper.owner.containerId + '_column'
        }) as HTMLInputElement;
        columnValue.appendChild(this.columnsCountBox);

        let rowContainer: HTMLElement = createElement('div', {
            className: 'e-de-insert-table-dlg-sub-header', innerHTML: localValue.getConstant('Number of rows')
        });
        let rowValue: HTMLElement = createElement('div');
        this.rowsCountBox = createElement('input', {
            attrs: { type: 'text' }, id: this.documentHelper.owner.containerId + 'row'
        }) as HTMLInputElement;
        rowValue.appendChild(this.rowsCountBox);

        parentDiv.appendChild(columnContainer);
        parentDiv.appendChild(columnValue);
        parentDiv.appendChild(rowContainer);
        parentDiv.appendChild(rowValue);

        this.target.appendChild(parentDiv);

        this.columnsCountBox.addEventListener('keyup', instance.keyUpInsertTable);
        this.rowsCountBox.addEventListener('keyup', instance.keyUpInsertTable);

        this.rowValueTextBox = new NumericTextBox({
            format: '#',
            value: 2,
            min: 1,
            max: 32767,
            enablePersistence: false
        });
        this.rowValueTextBox.appendTo(this.rowsCountBox);
        this.columnValueTexBox = new NumericTextBox({
            format: '#',
            value: 2,
            min: 1,
            max: 63,
            enablePersistence: false
        });
        this.columnValueTexBox.appendTo(this.columnsCountBox);
    }
    /**
     * @private
     */
    public show(): void {
        let localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initTableDialog(localValue);
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        this.documentHelper.dialog.header = localValue.getConstant('Insert Table');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.buttons = [{
            click: this.onInsertTableClick,
            buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-table-ok', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-table-cancel' }
        }];
        this.rowValueTextBox.value = 2;
        this.columnValueTexBox.value = 2;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     */
    public keyUpInsertTable = (event: KeyboardEvent): void => {
        if (event.keyCode === 13) {
            if (this.rowsCountBox.value !== '' && this.columnsCountBox.value !== '') {
                this.onInsertTableClick();
            }
        }
    }
    /**
     * @private
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
    }
    /**
     * @private
     */
    public onInsertTableClick = (): void => {
        let rowCount: number = this.rowValueTextBox.value;
        let columnCount: number = this.columnValueTexBox.value;
        if (!(isNullOrUndefined(rowCount) && isNullOrUndefined(columnCount))) {
            this.documentHelper.owner.editor.insertTable(rowCount, columnCount);
        }
        this.documentHelper.dialog.hide();
    }
    /**
     * @private
     */
    public destroy(): void {
        if (this.columnsCountBox) {
            if (this.columnsCountBox.parentElement) {
                this.columnsCountBox.parentElement.removeChild(this.columnsCountBox);
            }
            this.columnsCountBox = undefined;
        }
        if (this.rowsCountBox) {
            if (this.rowsCountBox.parentElement) {
                this.rowsCountBox.parentElement.removeChild(this.rowsCountBox);
            }
            this.rowsCountBox = undefined;
        }
        if (this.columnValueTexBox) {
            this.columnValueTexBox.destroy();
            this.columnValueTexBox = undefined;
        }
        if (this.rowValueTextBox) {
            this.rowValueTextBox.destroy();
            this.rowValueTextBox = undefined;
        }
        this.columnsCountBox = undefined;
        this.rowsCountBox = undefined;
        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (let i: number = 0; i < this.target.childNodes.length; i++) {
                this.target.removeChild(this.target.childNodes[i]);
                i--;
            }
            this.target = undefined;
        }
    }
}