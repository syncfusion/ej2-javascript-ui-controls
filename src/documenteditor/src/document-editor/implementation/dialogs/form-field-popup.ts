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

    private popupElement: HTMLElement;
    private textBoxDiv: HTMLElement;
    private textBoxButtonDiv: HTMLElement;
    private textBoxOkButton: HTMLButtonElement;
    private textBoxCancelButton: HTMLButtonElement;
    private numericDiv: HTMLElement;
    private textBoxButtonNumericDiv: HTMLElement;
    private textBoxOkButtonNumeric: HTMLButtonElement;
    private textBoxCancelButtonNumeric: HTMLButtonElement;
    private dateDiv: HTMLElement;
    private textBoxButtonDateDiv: HTMLElement;
    private textBoxOkButtonDate: HTMLButtonElement;
    private textBoxCancelButtonDate: HTMLButtonElement;
    private dropDownDiv: HTMLElement;
    private textBoxButtonDropDownDiv: HTMLElement;
    private textBoxOkButtonDropDown: HTMLButtonElement;
    private textBoxCancelButtonDropDown: HTMLButtonElement;

    private applyTextFormFieldValueClickHandler: EventListenerOrEventListenerObject = this.onApplyTextFormFieldValueClick.bind(this);
    private textBoxKeyPressEventHandler: EventListenerOrEventListenerObject = this.onTextBoxKeyPressEventHandler.bind(this);
    // eslint-disable-next-line max-len
    private applyDropDownFormFieldValueClickHandler: EventListenerOrEventListenerObject = this.onApplyDropDownFormFieldValueClick.bind(this);
    private closeButtonClickHandler: EventListenerOrEventListenerObject = this.onCloseButtonClick.bind(this);
    private applyDateFormFieldValueClickHandler: EventListenerOrEventListenerObject = this.onApplyDateFormFieldValueClick.bind(this);
    private applyNumberFormFieldValueClickHandler: EventListenerOrEventListenerObject = this.onApplyNumberFormFieldValueClick.bind(this);
    private numericTextBoxKeyPressEventHandler: EventListenerOrEventListenerObject = this.onNumericTextBoxKeyPressEventHandler.bind(this);
    private datePickerKeyPressEventHandler: EventListenerOrEventListenerObject = this.onDatePickerKeyPressEventHandler.bind(this);
    /**
     * @param {DocumentEditor} owner - Specifies the document editor.
     * @private
     */
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    private initPopup(): void {
        this.popupElement = createElement('div', { className: 'e-de-form-popup' });
        this.textBoxContainer = this.initTextBoxInput();
        this.popupElement.appendChild(this.textBoxContainer);
        this.popupElement.appendChild(this.initNumericTextBox());
        this.popupElement.appendChild(this.initDatePicker());
        this.popupElement.appendChild(this.initDropDownList());
        this.target = this.popupElement;
        this.owner.documentHelper.viewerContainer.appendChild(this.popupElement);
    }

    private initTextBoxInput(): HTMLElement {
        this.textBoxDiv = createElement('div', { className: 'e-de-txt-field' });
        const textBoxInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const textBox: TextBox = new TextBox();
        this.textBoxInput = textBoxInput;
        this.textBoxInput.addEventListener('keypress', this.textBoxKeyPressEventHandler);
        this.textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        this.textBoxOkButton = createElement('button') as HTMLButtonElement;
        this.textBoxCancelButton = createElement('button') as HTMLButtonElement;
        this.textBoxOkButton.addEventListener('click', this.applyTextFormFieldValueClickHandler);
        this.textBoxCancelButton.addEventListener('click', this.closeButtonClickHandler);
        this.textBoxDiv.appendChild(textBoxInput);
        this.textBoxButtonDiv.appendChild(this.textBoxOkButton);
        this.textBoxButtonDiv.appendChild(this.textBoxCancelButton);
        this.textBoxDiv.appendChild(this.textBoxButtonDiv);
        textBox.appendTo(textBoxInput);
        new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, this.textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, this.textBoxCancelButton);
        this.textBoxInstance = textBox;
        return this.textBoxDiv;
    }

    private initNumericTextBox(): HTMLElement {
        this.numericDiv = createElement('div', { className: 'e-de-num-field' });
        const numberInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const numericTextBox: NumericTextBox = new NumericTextBox();
        this.numberInput = numberInput;
        this.numberInput.addEventListener('keypress', this.numericTextBoxKeyPressEventHandler);
        this.textBoxButtonNumericDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        this.textBoxOkButtonNumeric = createElement('button') as HTMLButtonElement;
        this.textBoxCancelButtonNumeric = createElement('button') as HTMLButtonElement;
        this.textBoxOkButtonNumeric.addEventListener('click', this.applyNumberFormFieldValueClickHandler);
        this.textBoxCancelButtonNumeric.addEventListener('click', this.closeButtonClickHandler);
        this.numericDiv.appendChild(numberInput);
        this.textBoxButtonNumericDiv.appendChild(this.textBoxOkButtonNumeric);
        this.textBoxButtonNumericDiv.appendChild(this.textBoxCancelButtonNumeric);
        this.numericDiv.appendChild(this.textBoxButtonNumericDiv);
        numericTextBox.appendTo(numberInput);
        new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, this.textBoxOkButtonNumeric);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, this.textBoxCancelButtonNumeric);
        this.numericTextBoxInstance = numericTextBox;
        return this.numericDiv;
    }

    private initDatePicker(): HTMLElement {
        this.dateDiv = createElement('div', { className: 'e-de-date-field' });
        const dateInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        /* eslint-disable-next-line max-len */
        const datePicker: DateTimePicker = new DateTimePicker({ strictMode: true, change: this.enableDisableDatePickerOkButton });
        this.dateInput = dateInput;
        this.dateInput.addEventListener('keypress', this.datePickerKeyPressEventHandler);
        this.textBoxButtonDateDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        this.textBoxOkButtonDate = createElement('button') as HTMLButtonElement;
        this.textBoxCancelButtonDate = createElement('button') as HTMLButtonElement;
        this.textBoxOkButtonDate.addEventListener('click', this.applyDateFormFieldValueClickHandler);
        this.textBoxCancelButtonDate.addEventListener('click', this.closeButtonClickHandler);
        this.dateDiv.appendChild(dateInput);
        this.textBoxButtonDateDiv.appendChild(this.textBoxOkButtonDate);
        this.textBoxButtonDateDiv.appendChild(this.textBoxCancelButtonDate);
        this.dateDiv.appendChild(this.textBoxButtonDateDiv);
        datePicker.appendTo(dateInput);
        this.dataPickerOkButton = new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, this.textBoxOkButtonDate);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, this.textBoxCancelButtonDate);
        this.datePickerInstance = datePicker;
        return this.dateDiv;
    }

    private initDropDownList(): HTMLElement {
        this.dropDownDiv = createElement('div', { className: 'e-de-ddl-field' });
        const dropDownInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const ddl: DropDownList = new DropDownList();
        this.dropDownInput = dropDownInput;
        this.textBoxButtonDropDownDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        this.textBoxOkButtonDropDown = createElement('button') as HTMLButtonElement;
        this.textBoxCancelButtonDropDown = createElement('button') as HTMLButtonElement;
        this.textBoxOkButtonDropDown.addEventListener('click', this.applyDropDownFormFieldValueClickHandler);
        this.textBoxCancelButtonDropDown.addEventListener('click', this.closeButtonClickHandler);
        this.dropDownDiv.appendChild(dropDownInput);
        this.textBoxButtonDropDownDiv.appendChild(this.textBoxOkButtonDropDown);
        this.textBoxButtonDropDownDiv.appendChild(this.textBoxCancelButtonDropDown);
        this.dropDownDiv.appendChild(this.textBoxButtonDropDownDiv);
        ddl.appendTo(dropDownInput);
        new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, this.textBoxOkButtonDropDown);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, this.textBoxCancelButtonDropDown);
        this.ddlInstance = ddl;
        return this.dropDownDiv;
    }
    private onApplyTextFormFieldValueClick(): void {
        this.applyTextFormFieldValue();
    }
    private onTextBoxKeyPressEventHandler(args: KeyboardEvent): void {
        if (args.key === 'Enter') {
            this.applyTextFormFieldValue();
        }
    }
    /**
     * @returns {void}
     */
    private applyTextFormFieldValue = (): void => {
        this.owner.editorModule.updateFormField(this.formField, this.textBoxInstance.value);
        this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
        this.hidePopup();
    };
    private onApplyNumberFormFieldValueClick(): void {
        this.applyNumberFormFieldValue();
    }
    private onNumericTextBoxKeyPressEventHandler(args: KeyboardEvent): void {
        if (args.key === 'Enter') {
            this.applyNumberFormFieldValue();
        }
    }
    /**
     * @returns {void}
     */
    private applyNumberFormFieldValue = (): void => {
        this.owner.editorModule.updateFormField(this.formField, this.numberInput.value.toString());
        this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
        this.hidePopup();
    };
    private onApplyDateFormFieldValueClick(): void {
        this.applyDateFormFieldValue();
    }
    private onDatePickerKeyPressEventHandler(args: KeyboardEvent): void {
        if (args.key === 'Enter') {
            this.applyDateFormFieldValue();
        }
    }
    /**
     * @returns {void}
     */
    private applyDateFormFieldValue = (): void => {
        if (!isNullOrUndefined(this.datePickerInstance.value)) {
            this.owner.editorModule.updateFormField(this.formField, this.dateInput.value);
            this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
            this.hidePopup();
        }
    };
    private onApplyDropDownFormFieldValueClick(): void {
        this.applyDropDownFormFieldValue();
    }
    /**
     * @returns {void}
     */
    private applyDropDownFormFieldValue = (): void => {
        this.owner.editorModule.updateFormField(this.formField, this.ddlInstance.index);
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
            this.owner.selectionModule.selectField();
            if (isNullOrUndefined(this.target)) {
                this.initPopup();
            }
            classList(this.target, [], ['e-de-txt-form', 'e-de-num-form', 'e-de-date-form', 'e-de-ddl-form']);
            const formFieldData: FormField = formField.formFieldData;
            if (formFieldData) {
                if (formFieldData instanceof TextFormField) {
                    let resultText: string = formField.resultText;
                    const rex: RegExp = RegExp(this.owner.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    const maxLength: number = formFieldData.maxLength;
                    const formFieldType: TextFormFieldType = formFieldData.type;
                    let inputElement: HTMLInputElement;
                    resultText = resultText ? resultText : '';
                    if (formFieldType === 'Text' || formFieldType === 'Calculation') {
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
                    this.ddlInstance.refresh();
                    this.ddlInstance.dataSource = formFieldData.dropdownItems;
                    this.ddlInstance.index = formFieldData.selectedIndex;
                    setTimeout(() => {
                        this.ddlInstance.showPopup();
                    }, 50);
                }
                const left: number = this.owner.selectionModule.getLeftInternal(formField.line, formField, 0);
                const lineHeight: number = formField.line.height * this.owner.documentHelper.zoomFactor;
                const position: Point = this.owner.selectionModule.getTooltipPosition(formField.line, left, this.target, true);
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
    private onCloseButtonClick(): void {
        this.closeButton();
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
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        if (this.formField) {
            this.formField.destroy();
        }
        this.formField = undefined;
        this.owner = undefined;
        this.removeEvents();
        this.removeElements();
    }
    private removeEvents(): void {
        if (this.textBoxOkButton) {
            this.textBoxOkButton.removeEventListener('click', this.applyTextFormFieldValueClickHandler);
        }
        if (this.textBoxCancelButton) {
            this.textBoxCancelButton.removeEventListener('click', this.closeButtonClickHandler);
        }
        if (this.textBoxOkButtonNumeric) {
            this.textBoxOkButtonNumeric.removeEventListener('click', this.applyNumberFormFieldValueClickHandler);
        }
        if (this.textBoxCancelButtonNumeric) {
            this.textBoxCancelButtonNumeric.removeEventListener('click', this.closeButtonClickHandler);
        }
        if (this.textBoxOkButtonDate) {
            this.textBoxOkButtonDate.removeEventListener('click', this.applyDateFormFieldValueClickHandler);
        }
        if (this.textBoxCancelButtonDate) {
            this.textBoxCancelButtonDate.removeEventListener('click', this.closeButtonClickHandler);
        }
        if (this.textBoxOkButtonDropDown) {
            this.textBoxOkButtonDropDown.removeEventListener('click', this.applyDropDownFormFieldValueClickHandler);
        }
        if (this.textBoxCancelButtonDropDown) {
            this.textBoxCancelButtonDropDown.removeEventListener('click', this.closeButtonClickHandler);
        }
        if (this.textBoxInput) {
            this.textBoxInput.removeEventListener('keypress', this.textBoxKeyPressEventHandler);
        }
        if (this.numberInput) {
            this.numberInput.removeEventListener('keypress', this.numericTextBoxKeyPressEventHandler);
        }
        if (this.dateInput) {
            this.dateInput.removeEventListener('keypress', this.datePickerKeyPressEventHandler);
        }
    }
    private removeElements(): void {
        if (this.popupElement){
            this.popupElement.remove();
            this.popupElement = undefined;
        }
        if (this.textBoxDiv){
            this.textBoxDiv.remove();
            this.textBoxDiv = undefined;
        }
        if (this.textBoxButtonDiv){
            this.textBoxButtonDiv.remove();
            this.textBoxButtonDiv = undefined;
        }
        if (this.textBoxOkButton){
            this.textBoxOkButton.remove();
            this.textBoxOkButton = undefined;
        }
        if (this.textBoxCancelButton){
            this.textBoxCancelButton.remove();
            this.textBoxCancelButton = undefined;
        }
        if (this.numericDiv){
            this.numericDiv.remove();
            this.numericDiv = undefined;
        }
        if (this.textBoxButtonNumericDiv){
            this.textBoxButtonNumericDiv.remove();
            this.textBoxButtonNumericDiv = undefined;
        }
        if (this.textBoxOkButtonNumeric){
            this.textBoxOkButtonNumeric.remove();
            this.textBoxOkButtonNumeric = undefined;
        }
        if (this.textBoxCancelButtonNumeric){
            this.textBoxCancelButtonNumeric.remove();
            this.textBoxCancelButtonNumeric = undefined;
        }
        if (this.dateDiv){
            this.dateDiv.remove();
            this.dateDiv = undefined;
        }
        if (this.textBoxButtonDateDiv){
            this.textBoxButtonDateDiv.remove();
            this.textBoxButtonDateDiv = undefined;
        }
        if (this.textBoxOkButtonDate){
            this.textBoxOkButtonDate.remove();
            this.textBoxOkButtonDate = undefined;
        }
        if (this.textBoxCancelButtonDate){
            this.textBoxCancelButtonDate.remove();
            this.textBoxCancelButtonDate = undefined;
        }
        if (this.dropDownDiv){
            this.dropDownDiv.remove();
            this.dropDownDiv = undefined;
        }
        if (this.textBoxButtonDropDownDiv){
            this.textBoxButtonDropDownDiv.remove();
            this.textBoxButtonDropDownDiv = undefined;
        }
        if (this.textBoxOkButtonDropDown){
            this.textBoxOkButtonDropDown.remove();
            this.textBoxOkButtonDropDown = undefined;
        }
        if (this.textBoxCancelButtonDropDown){
            this.textBoxCancelButtonDropDown.remove();
            this.textBoxCancelButtonDropDown = undefined;
        }
        if (this.target){
            this.target.remove();
            this.target = undefined;
        }
        if (this.textBoxContainer){
            this.textBoxContainer.remove();
            this.textBoxContainer = undefined;
        }
        if (this.textBoxInput){
            this.textBoxInput.remove();
            this.textBoxInput = undefined;
        }
        if (this.numberInput){
            this.numberInput.remove();
            this.numberInput = undefined;
        }
        if (this.dateInput){
            this.dateInput.remove();
            this.dateInput = undefined;
        }
        if (this.dropDownInput){
            this.dropDownInput.remove();
            this.dropDownInput = undefined;
        }
        if (this.numbericInput){
            this.numbericInput.remove();
            this.numbericInput = undefined;
        }
        if (this.popupObject){
            this.popupObject.destroy();
            this.popupObject = undefined;
        }
        if (this.textBoxInstance){
            this.textBoxInstance.destroy();
            this.textBoxInstance = undefined;
        }
        if (this.numericTextBoxInstance){
            this.numericTextBoxInstance.destroy();
            this.numericTextBoxInstance = undefined;
        }
        if (this.datePickerInstance){
            this.datePickerInstance.destroy();
            this.datePickerInstance = undefined;
        }
        if (this.ddlInstance){
            this.ddlInstance.destroy();
            this.ddlInstance = undefined;
        }
        if (this.dataPickerOkButton){
            this.dataPickerOkButton.destroy();
            this.dataPickerOkButton = undefined;
        }
    }
}
