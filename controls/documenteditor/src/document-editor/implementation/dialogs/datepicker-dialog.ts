import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ContentControl, DocumentHelper } from '../viewer';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { Calendar, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { Dialog } from '@syncfusion/ej2-popups';
import { DocumentEditorContainer } from '../../../document-editor-container';
import { Editor } from '../editor';

/**
 * The DateContent dialog is used to display calendar
 */
export class DatePickerDialog {
    private calendar: Calendar;
    private target: HTMLElement;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;
    private localeValue: L10n;
    /**
     * @param {DocumentHelper} documentHelper - Specifies the document helper
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }

    private getModuleName(): string {
        return 'DateContentDialog';
    }
    /**
     * @private
     * @param {L10n} localValue - Specified the locale value.
     * @returns {void}
     */
    public initDateContentDialog(localValue: L10n): void {
        this.target = createElement('div');
        const parentDiv: HTMLElement = createElement('div');
        this.target.appendChild(parentDiv);
        const calendar: Calendar = new Calendar({
            change: this.valueChange.bind(this)
        });
        if (this.documentHelper.owner.editor.dateValue){
            calendar.value = new Date(this.documentHelper.owner.editor.dateValue);
        }
        calendar.appendTo(parentDiv);
        if (this.documentHelper.owner.editor.dateValue){
            calendar.value = new Date(this.documentHelper.owner.editor.dateValue);
        }
        //parentDiv.append(calendar);

    }

    private valueChange(args: ChangedEventArgs): void {
        if (args.event){
            const value : string = args.value.toLocaleDateString();
            const contenControl : ContentControl = this.documentHelper.owner.editor.getContentControl();
            this.documentHelper.owner.editor.dropDownChange(contenControl, value);
            this.documentHelper.hideDialog();
        }
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
            this.initDateContentDialog(localValue);
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        this.documentHelper.dialog.header = localValue.getConstant('Datepicker Content Control');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.dataBind();
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
    public destroy(): void {
        if (this.calendar){
            this.calendar.destroy();
            this.calendar = undefined;
        }
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
