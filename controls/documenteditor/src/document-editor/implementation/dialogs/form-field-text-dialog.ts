import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper } from '../viewer';
import { FieldElementBox, ElementBox, TextFormField } from '../viewer/page';
import { NumericTextBox, NumericFocusEventArgs, NumericBlurEventArgs, ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList, ComboBox, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { TextFormFieldType } from '../../base/types';
import { HelperMethods } from '../editor/editor-helper';

/**
 * Form field text dialog is used to modify the value in text form field.
 */
export class TextFormFieldDialog {
    private target: HTMLElement;
    private owner: DocumentEditor;
    private defaultTextInput: HTMLInputElement;
    private maxLengthNumber: NumericTextBox;
    private tooltipTextInput: HTMLInputElement;
    private bookmarkTextInput: HTMLInputElement;
    private fillInEnable: CheckBox;
    private defaultTextLabel: HTMLElement;
    private defaultTextDiv: HTMLElement;
    private textFormatLabel: HTMLElement;
    private typeDropDown: DropDownList;
    private textFormatDropDown: ComboBox;
    private fieldBegin: FieldElementBox;

    private localObj: L10n;

    /**
     * @param {DocumentHelper} owner - Specifies the document helper.
     * @private
     */
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    private get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }

    private getModuleName(): string {
        return 'TextFormFieldDialog';
    }
    /* eslint-disable  */
    /**
     * @private
     * @param {L10n} locale - Specifies the locale.
     * @returns {void}
     */
    private initTextDialog(localValue: L10n, isRtl?: boolean): void {
        this.target = createElement('div');
        let dialogDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let firstDiv: HTMLElement = createElement('div', { className: 'e-de-div-seperate-dlg' });
        let typeDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        this.defaultTextDiv = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        let typeLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Type')
        });
        let typeDropDownList: HTMLInputElement = createElement('input') as HTMLInputElement;
        let typeDropDownitems: string[] = ['Regular text', 'Number', 'Date'];
        this.typeDropDown = new DropDownList({
            dataSource: typeDropDownitems,
            popupHeight: '150px',
            value: 'Regular text',
            change: this.changeTypeDropDown.bind(this)
        });
        this.defaultTextLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Default text')
        });
        this.defaultTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', styles: 'margin-top:3px' }) as HTMLInputElement;
        let secondDiv: HTMLElement = createElement('div', { className: 'e-de-div-seperate-dlg' });
        let maxLengthDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        let maxLengthLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Maximum length')
        });
        let maxLength: HTMLInputElement = createElement('input') as HTMLInputElement;
        this.maxLengthNumber = new NumericTextBox({
            format: 'n', value: 0, min: 0, max: 32767, width: '100%', enablePersistence: false,
            change: function (args: NumericChangeEventArgs): void {
                if (!args.value) {
                    this.element.value = 'Unlimited';
                }
            },
            focus: function (args: NumericFocusEventArgs): void {
                if (!args.value) {
                    this.element.value = 'Unlimited';
                }
            },
            blur: function (args: NumericBlurEventArgs): void {
                if (!args.value) {
                    let proxy: NumericTextBox = this;
                    setTimeout((): void => {
                        proxy.element.value = 'Unlimited';
                    }, 0);
                }
            },
        });
        let textFromatDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        this.textFormatLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Text format')
        });
        let textFormatList: HTMLInputElement = createElement('input') as HTMLInputElement;
        let formatDropDownitems: string[] = ['Uppercase', 'Lowercase', 'FirstCapital', 'Titlecase'];
        this.textFormatDropDown = new ComboBox({
            dataSource: formatDropDownitems,
            popupHeight: '150px',
            allowCustom: true,
            showClearButton: false,
            change: this.updateTextFormtas.bind(this)
        });
        this.textFormatDropDown.focus = (): void => {
            (this.textFormatDropDown.element as HTMLInputElement).select();
        };
        let fileSettingsLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Field settings')
        });
        let thirdDiv: HTMLElement = createElement('div', { className: 'e-de-div-seperate-dlg' });
        let toolTipTotalDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        let bookmarkTotalDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        let toolTipHeadingLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Tooltip')
        });
        this.tooltipTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let bookmarkHeadingLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Name')
        });
        this.bookmarkTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let fillInEnableDiv: HTMLElement = createElement('div');
        let fillInEnableEle: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
        this.fillInEnable = new CheckBox({
            cssClass: 'e-de-ff-dlg-check',
            label: localValue.getConstant('Fillin enabled'),
            enableRtl: isRtl
        });
        if (isRtl) {
            typeDiv.classList.add('e-de-rtl');
            maxLengthDiv.classList.add('e-de-rtl');
            toolTipTotalDiv.classList.add('e-de-rtl');
            bookmarkTotalDiv.classList.add('e-de-rtl');
        }

        this.target.appendChild(dialogDiv);

        dialogDiv.appendChild(firstDiv);
        firstDiv.appendChild(typeDiv);
        typeDiv.appendChild(typeLabel);
        typeDiv.appendChild(typeDropDownList);
        this.typeDropDown.appendTo(typeDropDownList);
        firstDiv.appendChild(this.defaultTextDiv);
        this.defaultTextDiv.appendChild(this.defaultTextLabel);
        this.defaultTextDiv.appendChild(this.defaultTextInput);

        dialogDiv.appendChild(secondDiv);
        secondDiv.appendChild(maxLengthDiv);
        maxLengthDiv.appendChild(maxLengthLabel);
        maxLengthDiv.appendChild(maxLength);
        this.maxLengthNumber.appendTo(maxLength);
        secondDiv.appendChild(textFromatDiv);
        textFromatDiv.appendChild(this.textFormatLabel);
        textFromatDiv.appendChild(textFormatList);
        this.textFormatDropDown.appendTo(textFormatList);

        dialogDiv.appendChild(fileSettingsLabel);
        dialogDiv.appendChild(thirdDiv);
        thirdDiv.appendChild(toolTipTotalDiv);
        toolTipTotalDiv.appendChild(toolTipHeadingLabel);
        toolTipTotalDiv.appendChild(this.tooltipTextInput);
        thirdDiv.appendChild(bookmarkTotalDiv);
        bookmarkTotalDiv.appendChild(bookmarkHeadingLabel);
        bookmarkTotalDiv.appendChild(this.bookmarkTextInput);

        dialogDiv.appendChild(fillInEnableDiv);
        fillInEnableDiv.appendChild(fillInEnableEle);
        this.fillInEnable.appendTo(fillInEnableEle);
    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        this.localObj = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.localObj.setLocale(this.documentHelper.owner.locale);
        if (isNullOrUndefined(this.target)) {
            this.initTextDialog(this.localObj, this.documentHelper.owner.enableRtl);
        }
        this.loadTextDialog();
        this.documentHelper.dialog.header = this.localObj.getConstant('Text Form Field');
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = '448px';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
            click: this.insertTextField,
            buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
        }];
        this.documentHelper.dialog.show();
    }

    /**
     * @private
     * @param {ChangeEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    public changeTypeDropDown(args: ChangeEventArgs): void {
        if (args.isInteracted) {
            this.defaultTextInput.value = '';
            this.textFormatDropDown.value = '';
        }
        if (args.value === 'Regular text') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default text');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Text format');
            this.textFormatDropDown.dataSource = ['Uppercase', 'Lowercase', 'FirstCapital', 'Titlecase'];
        } else if (args.value === 'Number') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default number');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Number format');
            this.textFormatDropDown.dataSource = ['0', '0.00', '#,##0', '#,##0.00', '$#,##0.00;($#,##0.00)', '0%'];
        } else if (args.value === 'Date') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default date');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Date format');
            this.textFormatDropDown.dataSource = ['M/d/yyyy', 'dddd, MMMM d, yyyy', 'MMMM d, yyyy', 'M/d/yy', 'yyyy-MM-dd', 'd-MMM-yy',
                'M.d.yyyy', 'MMM. d, yy', 'd MMMM yyyy', 'MMMM yy', 'MMM-yy', 'M/d/yyyy h:mm am/pm', 'M/d/yyyy h:mm:ss am/pm', 'h:mm am/pm', 'h:mm:ss am/pm',
                'HH:mm', 'HH:mm:ss'];
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public loadTextDialog(): void {
        let inline: ElementBox = this.owner.selection.getCurrentFormField();
        if (inline instanceof FieldElementBox) {
            this.fieldBegin = inline;
            let data: TextFormField = inline.formFieldData as TextFormField;
            if (data.maxLength > 0) {
                this.maxLengthNumber.value = data.maxLength;
            } else {
                this.maxLengthNumber.value = 0;
                this.maxLengthNumber.element.value = 'Unlimited';
            }
            if (data.type === 'Date') {
                this.typeDropDown.value = 'Date';
            } else if (data.type === 'Number') {
                this.typeDropDown.value = 'Number';
            } else {
                this.typeDropDown.value = 'Regular text';
            }
            if (data.format) {
                this.textFormatDropDown.value = data.format;
            } else {
                this.textFormatDropDown.value = '';
            }
            (this.defaultTextInput as HTMLInputElement).value = !isNullOrUndefined(data.defaultValue) ? data.defaultValue : '';
            this.fillInEnable.checked = data.enabled;
            (this.tooltipTextInput as HTMLInputElement).value = !isNullOrUndefined(data.helpText) ? data.helpText : '';
            (this.bookmarkTextInput as HTMLInputElement).value = !isNullOrUndefined(data.name) ? data.name : '';
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public updateTextFormtas = (): void => {
        let defautText: string = this.updateFormats(this.defaultTextInput.value) as string;
        (this.defaultTextInput as HTMLInputElement).value = !isNullOrUndefined(defautText) ? defautText : '';
    }

    private updateFormats(value: string): string {
        let format: string = isNullOrUndefined(this.textFormatDropDown.value) ? '' : this.textFormatDropDown.value.toString();

        if (this.typeDropDown.value === 'Regular text') {
            return HelperMethods.formatText(format, value);
        }
        if (this.typeDropDown.value === 'Number') {
            let data: string = HelperMethods.formatNumber(format, value);
            if (!(data.toString() === 'NaN')) {
                return data;
            }
            return '';
        }
        if (this.typeDropDown.value === 'Date') {
            return HelperMethods.formatDate(format, value);
        }

        return '';
    }

    /**
     * @private
     * @returns {void}
     */
    public onCancelButtonClick = (): void => {
        this.documentHelper.dialog.hide();
    }

    /**
     * @private
     * @returns {boolean} returns is valid date format.
     */
    public isValidDateFormat(): boolean {
        let value: string = this.defaultTextInput.value;
        if (value !== '') {
            let date: Date = new Date(value);
            if (isNaN(date.getDate())) {
                return false;
            }
        }
        return true;
    }

    /**
     * @private
     * @returns {void}
     */
    public insertTextField = (): void => {
        let valid: boolean = true;
        if (this.typeDropDown.value === 'Date') {
            valid = this.isValidDateFormat();
        }
        if (valid) {
            this.updateTextFormtas();
            if (this.defaultTextInput.value.length > this.maxLengthNumber.value && !isNullOrUndefined(this.maxLengthNumber.value) &&
                this.maxLengthNumber.value !== 0) {
                DialogUtility.alert({
                    content: 'The maximum length value must be equal or greater than the length of the default text.',
                    showCloseIcon: true,
                    closeOnEscape: true,
                    position: { X: 'center', Y: 'center' },
                    animationSettings: { effect: 'Zoom' }
                });
            } else {
                let type: TextFormFieldType;
                if (this.typeDropDown.value === 'Date') {
                    type = 'Date';
                } else if (this.typeDropDown.value === 'Number') {
                    type = 'Number';
                } else {
                    type = 'Text';
                }
                let format: string = this.textFormatDropDown.value as string;

                let formField: TextFormField = new TextFormField();
                formField.type = type;
                formField.defaultValue = this.defaultTextInput.value;
                formField.maxLength = this.maxLengthNumber.value;
                formField.format = !isNullOrUndefined(format) ? format : '';
                formField.name = this.bookmarkTextInput.value;
                formField.helpText = this.tooltipTextInput.value;
                formField.enabled = this.fillInEnable.checked;
                this.owner.editor.editFormField('Text', formField);
                this.closeTextField();
            }
        } else {
            DialogUtility.alert({
                content: 'A valid date or time is required',
                showCloseIcon: true,
                closeOnEscape: true,
                position: { X: 'center', Y: 'center' },
                animationSettings: { effect: 'Zoom' }
            });
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private closeTextField = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.dialog.element.style.pointerEvents = '';
    }
    /**
     * @private
     * @returns {void}
     */
    private destroy(): void {
        let textDialogTarget: HTMLElement = this.target;
        if (textDialogTarget) {
            if (textDialogTarget.parentElement) {
                textDialogTarget.parentElement.removeChild(textDialogTarget);
            }
            this.target = undefined;
        }
        if (this.maxLengthNumber) {
            this.maxLengthNumber.destroy();
            this.maxLengthNumber = undefined;
        }
        if (this.fillInEnable) {
            this.fillInEnable.destroy();
            this.fillInEnable = undefined;
        }
        if (this.typeDropDown) {
            this.typeDropDown.destroy();
            this.typeDropDown = undefined;
        }
        if (this.textFormatDropDown) {
            this.textFormatDropDown.destroy();
            this.textFormatDropDown = undefined;
        }
        this.owner = undefined;
        this.defaultTextInput = undefined;
        this.tooltipTextInput = undefined;
        this.bookmarkTextInput = undefined;
        this.defaultTextLabel = undefined;
        this.defaultTextDiv = undefined;
        this.textFormatLabel = undefined;
    }
}