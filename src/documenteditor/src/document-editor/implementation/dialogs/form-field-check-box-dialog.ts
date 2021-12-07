import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RadioButton, ChangeArgs, CheckBox } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
import { DocumentHelper, ElementBox } from '../viewer';
import { FieldElementBox, CheckBoxFormField } from '../viewer/page';
import { NumericTextBox } from '@syncfusion/ej2-inputs';

/**
 * Form field checkbox dialog is used to modify the value in checkbox form field.
 */
export class CheckBoxFormFieldDialog {
    private target: HTMLElement;
    private owner: DocumentEditor;
    private autoButton: RadioButton;
    private exactButton: RadioButton;
    private notCheckedButton: RadioButton;
    private checkedButton: RadioButton;
    private bookmarkInputText: HTMLElement;
    private tooltipInputText: HTMLElement;
    private checBoxEnableElement: CheckBox;
    private exactlyNumber: NumericTextBox;
    private exactNumberDiv: HTMLElement;
    private fieldBegin: FieldElementBox;
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
        return 'CheckBoxFormFieldDialog';
    }
    /* eslint-disable */
    /**
     * @private
     * @param {L10n} locale - Specifies the locale.
     * @param {boolean} isRtl - Specifies is rtl.
     * @returns {void}
     */
    private initCheckBoxDialog(localValue: L10n, isRtl?: boolean): void {
        this.target = createElement('div');
        let dialogDiv: HTMLDivElement = createElement('div') as HTMLDivElement;
        let headingLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Check box size')
        });
        let autoDiv: HTMLElement = createElement('div', { className: 'e-de-ff-radio-scnd-div' }) as HTMLDivElement;
        let exactDiv: HTMLElement = createElement('div', { className: 'e-de-ff-radio-scnd-div' }) as HTMLDivElement;
        let autoEle: HTMLElement = createElement('input', { className: 'e-de-rtl-btn-div' });
        let exactEle: HTMLElement = createElement('input', { className: 'e-de-rtl-btn-div' });
        this.autoButton = new RadioButton({
            label: localValue.getConstant('Auto'), cssClass: 'e-small', change: this.changeBidirectional, checked: true,
            enableRtl: isRtl
        });
        this.exactButton = new RadioButton({
            label: localValue.getConstant('Exactly'), value: 'exact', cssClass: 'e-small', change: this.changeBidirectional,
            enableRtl: isRtl
        });
        this.exactNumberDiv = createElement('div', { className: 'e-de-ff-chck-exact' });
        let exactNumber: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        this.exactlyNumber = new NumericTextBox({
            format: 'n', value: 10, min: 1, max: 1584, enablePersistence: false, enabled: false, cssClass: 'e-de-check-exactnumbr-width',
            enableRtl: isRtl
        });
        let defaultValueLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Default value')
        });
        let notcheckDiv: HTMLElement = createElement('div', { className: 'e-de-ff-radio-div' }) as HTMLDivElement;
        let checkDiv: HTMLElement = createElement('div', { className: 'e-de-ff-radio-div' }) as HTMLDivElement;
        let notcheckEle: HTMLElement = createElement('input', { className: 'e-de-rtl-btn-div' });
        let checkEle: HTMLElement = createElement('input', { className: 'e-de-rtl-btn-div' });
        this.notCheckedButton = new RadioButton({
            label: localValue.getConstant('Not checked'), enableRtl: isRtl, cssClass: 'e-small', change: this.changeBidirect
        });
        this.checkedButton = new RadioButton({
            label: localValue.getConstant('Checked'), value: 'check', enableRtl: isRtl, cssClass: 'e-small',
            change: this.changeBidirect, checked: true
        });
        let fieldSettingsLabel: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Field settings')
        });
        let settingsTotalDiv: HTMLElement = createElement('div', { className: 'e-de-div-seperate-dlg' });
        let totalToolTipDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        let totalBookmarkDiv: HTMLElement = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        let toolTipLabelHeading: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Tooltip')
        });
        this.tooltipInputText = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let bookmarkLabelHeading: HTMLElement = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Name')
        });
        this.bookmarkInputText = createElement('input', { className: 'e-input e-bookmark-textbox-input' }) as HTMLInputElement;
        let checkBoxEnableDiv: HTMLElement = createElement('div');
        let checBoxEnableEle: HTMLInputElement = createElement('input', { attrs: { type: 'checkbox' } }) as HTMLInputElement;
        this.checBoxEnableElement = new CheckBox({
            cssClass: 'e-de-ff-dlg-check',
            label: localValue.getConstant('Check box enabled'),
            enableRtl: isRtl
        });
        if (isRtl) {
            autoDiv.classList.add('e-de-rtl');
            exactDiv.classList.add('e-de-rtl');
            this.exactNumberDiv.classList.add('e-de-rtl');
            notcheckDiv.classList.add('e-de-rtl');
            checkDiv.classList.add('e-de-rtl');
            totalToolTipDiv.classList.add('e-de-rtl');
            totalBookmarkDiv.classList.add('e-de-rtl');
        }

        this.target.appendChild(dialogDiv);

        dialogDiv.appendChild(defaultValueLabel);
        dialogDiv.appendChild(notcheckDiv);
        notcheckDiv.appendChild(notcheckEle);
        this.notCheckedButton.appendTo(notcheckEle);
        dialogDiv.appendChild(checkDiv);
        checkDiv.appendChild(checkEle);
        this.checkedButton.appendTo(checkEle);

        dialogDiv.appendChild(headingLabel);
        dialogDiv.appendChild(autoDiv);
        autoDiv.appendChild(autoEle);
        this.autoButton.appendTo(autoEle);
        dialogDiv.appendChild(exactDiv);
        exactDiv.appendChild(exactEle);
        this.exactButton.appendTo(exactEle);
        exactDiv.appendChild(this.exactNumberDiv);
        this.exactNumberDiv.appendChild(exactNumber);
        this.exactlyNumber.appendTo(exactNumber);


        dialogDiv.appendChild(fieldSettingsLabel);

        dialogDiv.appendChild(settingsTotalDiv);
        settingsTotalDiv.appendChild(totalToolTipDiv);
        settingsTotalDiv.appendChild(totalBookmarkDiv);

        totalToolTipDiv.appendChild(toolTipLabelHeading);
        totalToolTipDiv.appendChild(this.tooltipInputText);

        totalBookmarkDiv.appendChild(bookmarkLabelHeading);
        totalBookmarkDiv.appendChild(this.bookmarkInputText);

        dialogDiv.appendChild(checkBoxEnableDiv);
        checkBoxEnableDiv.appendChild(checBoxEnableEle);
        this.checBoxEnableElement.appendTo(checBoxEnableEle);

    }
    /**
     * @private
     * @returns {void}
     */
    public show(): void {
        let localObj: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localObj.setLocale(this.documentHelper.owner.locale);
        if (isNullOrUndefined(this.target)) {
            this.initCheckBoxDialog(localObj, this.documentHelper.owner.enableRtl);
        }
        this.loadCheckBoxDialog();
        this.documentHelper.dialog.header = localObj.getConstant('Check Box Form Field');
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = '400px';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
            click: this.insertCheckBoxField,
            buttonModel: { content: localObj.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
        },
        {
            click: this.onCancelButtonClick,
            buttonModel: { content: localObj.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
        }];
        this.documentHelper.dialog.show();
    }

    /**
     * @private
     * @returns {void}
     */
    public loadCheckBoxDialog(): void {
        let inline: ElementBox = this.owner.selection.getCurrentFormField();
        if (inline instanceof FieldElementBox) {
            this.fieldBegin = inline;
            let fieldData: CheckBoxFormField = this.fieldBegin.formFieldData as CheckBoxFormField;
            if (!fieldData.defaultValue) {
                this.checkedButton.checked = false;
                this.notCheckedButton.checked = true;
            } else {
                this.checkedButton.checked = true;
                this.notCheckedButton.checked = false;
            }

            if (fieldData.sizeType !== 'Auto') {
                this.exactButton.checked = true;
                this.autoButton.checked = false;
                this.exactlyNumber.enabled = true;
            } else {
                this.autoButton.checked = true;
                this.exactButton.checked = false;
                this.exactlyNumber.enabled = false;
            }

            if (fieldData.size) {
                this.exactlyNumber.value = fieldData.size;
            }

            if (fieldData.enabled) {
                this.checBoxEnableElement.checked = true;
            } else {
                this.checBoxEnableElement.checked = false;
            }

            if (fieldData.name && fieldData.name !== '') {
                (this.bookmarkInputText as HTMLInputElement).value = fieldData.name;
            } else {
                (this.bookmarkInputText as HTMLInputElement).value = '';
            }

            if (fieldData.helpText && fieldData.helpText !== '') {
                (this.tooltipInputText as HTMLInputElement).value = fieldData.helpText;
            } else {
                (this.tooltipInputText as HTMLInputElement).value = '';
            }
        }
    }

    /**
     * @private
     * @param {ChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    public changeBidirectional = (event: ChangeArgs): void => {
        if (event.value === 'exact') {
            this.autoButton.checked = !this.exactButton.checked;
            this.exactlyNumber.enabled = true;
        } else {
            this.exactButton.checked = !this.autoButton.checked;
            this.exactlyNumber.enabled = false;
        }
    }
    /**
     * @private
     * @param {ChangeArgs} event - Specifies the event args.
     * @returns {void}
     */
    public changeBidirect = (event: ChangeArgs): void => {
        if (event.value === 'check') {
            this.notCheckedButton.checked = !this.checkedButton.checked;
        } else {
            this.checkedButton.checked = !this.notCheckedButton.checked;
        }
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
     * @returns {void}
     */
    public insertCheckBoxField = (): void => {
        this.closeCheckBoxField();
        let checkBoxField: CheckBoxFormField = new CheckBoxFormField();
        checkBoxField.defaultValue = this.checkedButton.checked;
        checkBoxField.name = (this.bookmarkInputText as HTMLInputElement).value;
        checkBoxField.helpText = (this.tooltipInputText as HTMLInputElement).value;
        checkBoxField.checked = checkBoxField.defaultValue;
        checkBoxField.enabled = this.checBoxEnableElement.checked;
        if (this.exactButton.checked) {
            checkBoxField.sizeType = 'Exactly';
            checkBoxField.size = this.exactlyNumber.value;
        } else {
            checkBoxField.sizeType = 'Auto';
            checkBoxField.size = 11;
        }
        this.owner.editor.editFormField('CheckBox', checkBoxField);
    }
    /**
     * @private
     * @returns {void}
     */
    private closeCheckBoxField = (): void => {
        this.documentHelper.dialog.hide();
        this.documentHelper.dialog.element.style.pointerEvents = '';
    }
    /**
     * @private
     * @returns {void}
     */
    private destroy(): void {
        let checkBoxDialogTarget: HTMLElement = this.target;
        if (checkBoxDialogTarget) {
            if (checkBoxDialogTarget.parentElement) {
                checkBoxDialogTarget.parentElement.removeChild(checkBoxDialogTarget);
            }
            this.target = undefined;
        }
        this.owner = undefined;
        if (this.autoButton) {
            this.autoButton.destroy();
            this.autoButton = undefined;
        }
        if (this.exactButton) {
            this.exactButton.destroy();
            this.exactButton = undefined;
        }
        if (this.notCheckedButton) {
            this.notCheckedButton.destroy();
            this.notCheckedButton = undefined;
        }
        if (this.checkedButton) {
            this.checkedButton.destroy();
            this.checkedButton = undefined;
        }
        this.bookmarkInputText = undefined;
        this.tooltipInputText = undefined;
        if (this.checBoxEnableElement) {
            this.checBoxEnableElement.destroy();
            this.checBoxEnableElement = undefined;
        }
        if (this.exactlyNumber) {
            this.exactlyNumber.destroy();
            this.exactlyNumber = undefined;
        }
        this.exactNumberDiv = undefined;
    }
}