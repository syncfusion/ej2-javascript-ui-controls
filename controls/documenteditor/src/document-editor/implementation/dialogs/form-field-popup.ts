import { createElement, isNullOrUndefined, classList } from '@syncfusion/ej2-base';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';
import { FieldElementBox, TextFormField, FormField, DropDownFormField, CheckBoxFormField } from '../viewer/page';
import { Point } from '../editor/editor-helper';
import { DateTimePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { DocumentEditor } from '../../document-editor';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextFormFieldType } from '../../base/types';
import { afterFormFieldFillEvent, FormFieldFillEventArgs } from '../../base/index';

/**
 * @private
 */
export class FormFieldPopUp {
    private target: HTMLElement;
    private textBoxContainer: HTMLElement;
    private textBoxInput: HTMLInputElement;
    private numberInput: HTMLInputElement;
    private dateInput: HTMLInputElement;
    private dropDownInput: HTMLInputElement;
    private numbericInput: HTMLElement;
    private popupObject: Popup;
    private owner: DocumentEditor;
    private formField: FieldElementBox;
    private textBoxInstance: TextBox;
    private numericTextBoxInstance: NumericTextBox;
    private datePickerInstance: DateTimePicker;
    private ddlInstance: DropDownList;
    private dataPickerOkButton: Button;
    /**
     * @param {DocumentEditor} owner - Specifies the document editor.
     * @private
     */
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    private initPopup(): void {
        const popupElement: HTMLElement = createElement('div', { className: 'e-de-form-popup' });
        this.textBoxContainer = this.initTextBoxInput();
        popupElement.appendChild(this.textBoxContainer);
        popupElement.appendChild(this.initNumericTextBox());
        popupElement.appendChild(this.initDatePicker());
        popupElement.appendChild(this.initDropDownList());
        this.target = popupElement;
        this.owner.documentHelper.viewerContainer.appendChild(popupElement);
    }

    private initTextBoxInput(): HTMLElement {
        const textBoxDiv: HTMLElement = createElement('div', { className: 'e-de-txt-field' });
        const textBoxInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const textBox: TextBox = new TextBox();
        this.textBoxInput = textBoxInput;
        const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
        const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        textBoxOkButton.addEventListener('click', this.applyTextFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        textBoxDiv.appendChild(textBoxInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        textBoxDiv.appendChild(textBoxButtonDiv);
        textBox.appendTo(textBoxInput);
        new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.textBoxInstance = textBox;
        return textBoxDiv;
    }

    private initNumericTextBox(): HTMLElement {
        const numericDiv: HTMLElement = createElement('div', { className: 'e-de-num-field' });
        const numberInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const numericTextBox: NumericTextBox = new NumericTextBox();
        this.numberInput = numberInput;
        const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
        const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        textBoxOkButton.addEventListener('click', this.applyNumberFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        numericDiv.appendChild(numberInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        numericDiv.appendChild(textBoxButtonDiv);
        numericTextBox.appendTo(numberInput);
        new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.numericTextBoxInstance = numericTextBox;
        return numericDiv;
    }

    private initDatePicker(): HTMLElement {
        const dateDiv: HTMLElement = createElement('div', { className: 'e-de-date-field' });
        const dateInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        /* eslint-disable-next-line max-len */
        const datePicker: DateTimePicker = new DateTimePicker({ allowEdit: false, strictMode: true, change: this.enableDisableDatePickerOkButton });
        this.dateInput = dateInput;
        const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
        const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        textBoxOkButton.addEventListener('click', this.applyDateFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        dateDiv.appendChild(dateInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        dateDiv.appendChild(textBoxButtonDiv);
        datePicker.appendTo(dateInput);
        this.dataPickerOkButton = new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.datePickerInstance = datePicker;
        return dateDiv;
    }

    private initDropDownList(): HTMLElement {
        const dropDownDiv: HTMLElement = createElement('div', { className: 'e-de-ddl-field' });
        const dropDownInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const ddl: DropDownList = new DropDownList();
        this.dropDownInput = dropDownInput;
        const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
        const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
        textBoxOkButton.addEventListener('click', this.applyDropDownFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        dropDownDiv.appendChild(dropDownInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        dropDownDiv.appendChild(textBoxButtonDiv);
        ddl.appendTo(dropDownInput);
        new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.ddlInstance = ddl;
        return dropDownDiv;
    }

    /**
     * @returns {void}
     */
    private applyTextFormFieldValue = (): void => {
        this.owner.editor.updateFormField(this.formField, this.textBoxInstance.value);
        this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
        this.hidePopup();
    };
    /**
     * @returns {void}
     */
    private applyNumberFormFieldValue = (): void => {
        this.owner.editor.updateFormField(this.formField, this.numberInput.value.toString());
        this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
        this.hidePopup();
    };
    /**
     * @returns {void}
     */
    private applyDateFormFieldValue = (): void => {
        if (!isNullOrUndefined(this.datePickerInstance.value)) {
            this.owner.editor.updateFormField(this.formField, this.dateInput.value);
            this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
            this.hidePopup();
        }
    };
    /**
     * @returns {void}
     */
    private applyDropDownFormFieldValue = (): void => {
        this.owner.editor.updateFormField(this.formField, this.ddlInstance.index);
        this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: (this.formField.formFieldData as DropDownFormField).selectedIndex, isCanceled: false });
        this.hidePopup();
    };
    /**
     * @param {ChangedEventArgs} args - Specifies the event args.
     * @returns {void}
     */
    private enableDisableDatePickerOkButton = (args: ChangedEventArgs): void => {
        if (args.isInteracted) {
            this.dataPickerOkButton.disabled = false;
        }
    };
    /**
     * @private
     * @param {FieldElementBox} formField - Specifies the field element.
     * @returns {void}
     */
    public showPopUp(formField: FieldElementBox): void {
        if (formField) {
            this.formField = formField;
            this.owner.selection.selectField();
            if (isNullOrUndefined(this.target)) {
                this.initPopup();
            }
            classList(this.target, [], ['e-de-txt-form', 'e-de-num-form', 'e-de-date-form', 'e-de-ddl-form']);
            const formFieldData: FormField = formField.formFieldData;
            if (formFieldData) {
                if (formFieldData instanceof TextFormField) {
                    let resultText: string = formField.resultText;
                    const rex: RegExp = new RegExp(this.owner.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    const maxLength: number = formFieldData.maxLength;
                    const formFieldType: TextFormFieldType = formFieldData.type;
                    let inputElement: HTMLInputElement;
                    resultText = resultText ? resultText : '';
                    if (formFieldType === 'Text') {
                        classList(this.target, ['e-de-txt-form'], []);
                        inputElement = this.textBoxInput;
                        this.textBoxInstance.value = resultText;
                    } else if (formFieldData.type === 'Number') {
                        classList(this.target, ['e-de-num-form'], []);
                        inputElement = this.numberInput;
                        this.numericTextBoxInstance.format = formFieldData.format;
                        this.numericTextBoxInstance.value = parseFloat(resultText.replace(/,/gi, ''));
                    } else if (formFieldType === 'Date') {
                        classList(this.target, ['e-de-date-form'], []);
                        inputElement = this.dateInput;
                        let format: string = formFieldData.format;
                        if (format.indexOf('am/pm') !== -1) {
                            format = format.replace(/am\/pm/gi, 'a');
                        }
                        this.datePickerInstance.format = format;
                        this.datePickerInstance.value = new Date(resultText);
                        this.dataPickerOkButton.disabled = true;
                    }
                    if (inputElement) {
                        if (maxLength > 0) {
                            inputElement.maxLength = maxLength;
                        } else {
                            inputElement.removeAttribute('maxlength');
                        }
                        setTimeout(() => {
                            inputElement.focus();
                        });
                    }

                } else if (formFieldData instanceof DropDownFormField) {
                    classList(this.target, ['e-de-ddl-form'], []);
                    this.ddlInstance.dataSource = formFieldData.dropdownItems;
                    this.ddlInstance.index = formFieldData.selectedIndex;
                    setTimeout(() => {
                        this.ddlInstance.showPopup();
                    });
                }
                const left: number = this.owner.selection.getLeftInternal(formField.line, formField, 0);
                const lineHeight: number = formField.line.height * this.owner.documentHelper.zoomFactor;
                const position: Point = this.owner.selection.getTooltipPosition(formField.line, left, this.target, true);
                if (!this.popupObject) {
                    this.popupObject = new Popup(this.target, {
                        height: 'auto',
                        width: 'auto',
                        relateTo: this.owner.documentHelper.viewerContainer.parentElement,
                        position: { X: position.x, Y: position.y + lineHeight }
                    });
                }
                this.target.style.display = 'block';
                this.popupObject.show();
            }
            this.owner.documentHelper.isFormFilling = true;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    private closeButton = (): void => {
        const field: FieldElementBox = this.formField;
        this.hidePopup();
        const eventArgs: FormFieldFillEventArgs = { 'fieldName': field.formFieldData.name };
        if (field.formFieldData instanceof TextFormField) {
            eventArgs.value = field.resultText;
        } else if (field.formFieldData instanceof CheckBoxFormField) {
            eventArgs.value = field.formFieldData.checked;
        } else {
            eventArgs.value = (field.formFieldData as DropDownFormField).selectedIndex;
        }
        eventArgs.isCanceled = true;
        this.owner.trigger(afterFormFieldFillEvent, eventArgs);
    };
    /**
     * @private
     * @returns {void}
     */
    public hidePopup = (): void => {
        this.owner.documentHelper.isFormFilling = false;
        this.formField = undefined;
        if (this.target) {
            this.target.style.display = 'none';
        }
        if (this.popupObject) {
            this.popupObject.hide();
            this.popupObject.destroy();
            this.popupObject = undefined;
        }
    };
}
