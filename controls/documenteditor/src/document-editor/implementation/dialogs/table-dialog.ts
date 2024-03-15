import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentHelper } from '../viewer';
import { DialogUtility } from '@syncfusion/ej2-popups';
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
    private localeValue: L10n;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'TableDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specified the locale value.
     * @returns {void}
     */
    public initTableDialog(localValue: L10n): void {
        this.target = createElement('div', { className: 'e-de-insert-table' });
        const parentDiv: HTMLElement = createElement('div');

        const columnValue: HTMLElement = createElement('div', { className: 'e-de-container-row' });
        this.columnsCountBox = createElement('input', {
            attrs: { type: 'text' }
        }) as HTMLInputElement;
        columnValue.appendChild(this.columnsCountBox);
        this.columnsCountBox.setAttribute('aria-labelledby', localValue.getConstant('Insert Table'));

        const rowValue: HTMLElement = createElement('div');
        this.rowsCountBox = createElement('input', {
            attrs: { type: 'text' }
        }) as HTMLInputElement;
        rowValue.appendChild(this.rowsCountBox);

        parentDiv.appendChild(columnValue);
        parentDiv.appendChild(rowValue);
        this.target.appendChild(parentDiv);

        this.rowValueTextBox = new NumericTextBox({
            format: '#',
            value: 2,
            min: 1,
            strictMode: true,
            enablePersistence: false,
            placeholder: localValue.getConstant('Number of rows'),
            floatLabelType: 'Always'
        });
        this.rowValueTextBox.appendTo(this.rowsCountBox);
        this.rowsCountBox.setAttribute('aria-labelledby', localValue.getConstant('Number of rows'));
        this.columnValueTexBox = new NumericTextBox({
            format: '#',
            value: 2,
            min: 1,
            strictMode: true,
            enablePersistence: false,
            placeholder: localValue.getConstant('Number of columns'),
            floatLabelType: 'Always'
        });
        this.columnsCountBox.setAttribute('aria-labelledby',localValue.getConstant('Number of columns'));
        parentDiv.setAttribute('aria-labelledby', localValue.getConstant('Insert Table'));
        parentDiv.setAttribute('aria-describedby', localValue.getConstant('Insert Table'));
        this.columnValueTexBox.appendTo(this.columnsCountBox);
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        const localValue: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        this.localeValue = localValue;
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
        this.columnValueTexBox.focusIn();
        this.documentHelper.dialog.show();
    }
    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     * @returns {void}
     */
    public onInsertTableClick = (): void => {
        if (this.columnValueTexBox.value < 1 || this.columnValueTexBox.value > this.documentHelper.owner.documentEditorSettings.maximumColumns) {
            let columnAlertPopup: string = this.localeValue.getConstant('Number of columns must be between') + ' 1 ' + this.localeValue.getConstant('and') + ' ' + this.documentHelper.owner.documentEditorSettings.maximumColumns.toString();
            DialogUtility.alert(columnAlertPopup).enableRtl = this.documentHelper.owner.enableRtl;
            return;
        }
        if (this.rowValueTextBox.value < 1 || this.rowValueTextBox.value > this.documentHelper.owner.documentEditorSettings.maximumRows) {
            let rowAlertPopup: string = this.localeValue.getConstant('Number of rows must be between') + ' 1 ' + this.localeValue.getConstant('and') + ' ' + this.documentHelper.owner.documentEditorSettings.maximumColumns.toString();
            DialogUtility.alert(rowAlertPopup).enableRtl = this.documentHelper.owner.enableRtl;
            return;
        }
        if (this.rowValueTextBox.value <= this.documentHelper.owner.documentEditorSettings.maximumRows && this.columnValueTexBox.value <= this.documentHelper.owner.documentEditorSettings.maximumColumns) {
            const rowCount: number = this.rowValueTextBox.value;
            const columnCount: number = this.columnValueTexBox.value;
            if (!(isNullOrUndefined(rowCount) && isNullOrUndefined(columnCount))) {
                this.documentHelper.owner.editorModule.insertTable(rowCount, columnCount);
            }
            this.documentHelper.hideDialog();
        }
    };
    /**
     * @private
     * @returns {void}
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
                this.target.removeChild(this.target.childNodes[parseInt(i.toString(), 10)]);
                i--;
            }
            this.target = undefined;
        }
    }
}
