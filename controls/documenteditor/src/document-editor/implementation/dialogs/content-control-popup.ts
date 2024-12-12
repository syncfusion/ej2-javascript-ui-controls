import { createElement, isNullOrUndefined, classList } from '@syncfusion/ej2-base';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';
import { FieldElementBox, TextFormField, FormField, DropDownFormField, CheckBoxFormField, ContentControl, ContentControlListItems } from '../viewer/page';
import { Point } from '../editor/editor-helper';
import { DateTimePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { DocumentEditor } from '../../document-editor';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextFormFieldType } from '../../base/types';
import { afterFormFieldFillEvent, FormFieldFillEventArgs } from '../../base/index';

/**
 * @private
 */
export class ContentControlPopUp {
    private target: HTMLElement;
    // private textBoxContainer: HTMLElement;
    // private textBoxInput: HTMLInputElement;
    // private numberInput: HTMLInputElement;
    // private dateInput: HTMLInputElement;
    private dropDownInput: HTMLInputElement;
    // private numbericInput: HTMLElement;
    private popupObject: Popup;
    private owner: DocumentEditor;
    private contenControl: ContentControl;
    // private textBoxInstance: TextBox;
    // private numericTextBoxInstance: NumericTextBox;
    // private datePickerInstance: DateTimePicker;
    private ddlInstance: DropDownList;
    private dataPickerOkButton: Button;
    private popupElement: HTMLElement;
    private dropDownDiv: HTMLElement;
    private textBoxButtonDiv: HTMLElement;
    private textBoxOkButton: HTMLButtonElement;
    private textBoxCancelButton: HTMLButtonElement;

    private applyDropDownFormFieldValueHandler: EventListenerOrEventListenerObject = this.onapplyDropDownFormFieldValue.bind(this);
    private closeButtonClickedHandler: EventListenerOrEventListenerObject = this.onCloseButtonClicked.bind(this);
    /**
     * @param {DocumentEditor} owner - Specifies the document editor.
     * @private
     */
    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    private initPopup(): void {
        this.popupElement = createElement('div', { className: 'e-de-form-popup' });
        // this.textBoxContainer = this.initTextBoxInput();
        // popupElement.appendChild(this.textBoxContainer);
        // popupElement.appendChild(this.initNumericTextBox());
        // popupElement.appendChild(this.initDatePicker());
        this.popupElement.appendChild(this.initDropDownList());
        this.target = this.popupElement;
        this.owner.documentHelper.viewerContainer.appendChild(this.popupElement);
    }

    // private initTextBoxInput(): HTMLElement {
    //     const textBoxDiv: HTMLElement = createElement('div', { className: 'e-de-txt-field' });
    //     const textBoxInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
    //     const textBox: TextBox = new TextBox();
    //     this.textBoxInput = textBoxInput;
    //     const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
    //     const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     textBoxOkButton.addEventListener('click', this.applyTextFormFieldValue);
    //     textBoxCancelButton.addEventListener('click', this.closeButton);
    //     textBoxDiv.appendChild(textBoxInput);
    //     textBoxButtonDiv.appendChild(textBoxOkButton);
    //     textBoxButtonDiv.appendChild(textBoxCancelButton);
    //     textBoxDiv.appendChild(textBoxButtonDiv);
    //     textBox.appendTo(textBoxInput);
    //     new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, textBoxOkButton);
    //     new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
    //     this.textBoxInstance = textBox;
    //     return textBoxDiv;
    // }

    // private initNumericTextBox(): HTMLElement {
    //     const numericDiv: HTMLElement = createElement('div', { className: 'e-de-num-field' });
    //     const numberInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
    //     const numericTextBox: NumericTextBox = new NumericTextBox();
    //     this.numberInput = numberInput;
    //     const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
    //     const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     textBoxOkButton.addEventListener('click', this.applyNumberFormFieldValue);
    //     textBoxCancelButton.addEventListener('click', this.closeButton);
    //     numericDiv.appendChild(numberInput);
    //     textBoxButtonDiv.appendChild(textBoxOkButton);
    //     textBoxButtonDiv.appendChild(textBoxCancelButton);
    //     numericDiv.appendChild(textBoxButtonDiv);
    //     numericTextBox.appendTo(numberInput);
    //     new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, textBoxOkButton);
    //     new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
    //     this.numericTextBoxInstance = numericTextBox;
    //     return numericDiv;
    // }

    // private initDatePicker(): HTMLElement {
    //     const dateDiv: HTMLElement = createElement('div', { className: 'e-de-date-field' });
    //     const dateInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
    //     /* eslint-disable-next-line max-len */
    //     const datePicker: DateTimePicker = new DateTimePicker({ strictMode: true, change: this.enableDisableDatePickerOkButton });
    //     this.dateInput = dateInput;
    //     const textBoxButtonDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-action-button' });
    //     const textBoxOkButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     const textBoxCancelButton: HTMLButtonElement = createElement('button') as HTMLButtonElement;
    //     textBoxOkButton.addEventListener('click', this.applyDateFormFieldValue);
    //     textBoxCancelButton.addEventListener('click', this.closeButton);
    //     dateDiv.appendChild(dateInput);
    //     textBoxButtonDiv.appendChild(textBoxOkButton);
    //     textBoxButtonDiv.appendChild(textBoxCancelButton);
    //     dateDiv.appendChild(textBoxButtonDiv);
    //     datePicker.appendTo(dateInput);
    //     this.dataPickerOkButton = new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, textBoxOkButton);
    //     new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
    //     this.datePickerInstance = datePicker;
    //     return dateDiv;
    // }

    private initDropDownList(): HTMLElement {
        this.dropDownDiv = createElement('div', { className: 'e-de-ddl-field' });
        const dropDownInput: HTMLInputElement = createElement('input', { className: 'e-de-txt-form' }) as HTMLInputElement;
        const ddl: DropDownList = new DropDownList({ fields: { text: 'value' } });
        this.dropDownInput = dropDownInput;
        this.textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        this.textBoxOkButton = createElement('button') as HTMLButtonElement;
        this.textBoxCancelButton = createElement('button') as HTMLButtonElement;
        this.textBoxOkButton.addEventListener('click', this.applyDropDownFormFieldValueHandler);
        this.textBoxCancelButton.addEventListener('click', this.closeButtonClickedHandler);
        this.dropDownDiv.appendChild(dropDownInput);
        this.textBoxButtonDiv.appendChild(this.textBoxOkButton);
        this.textBoxButtonDiv.appendChild(this.textBoxCancelButton);
        this.dropDownDiv.appendChild(this.textBoxButtonDiv);
        ddl.appendTo(dropDownInput);
        new Button({ cssClass: 'e-de-save e-primary', iconCss: 'e-de-save-icon' }, this.textBoxOkButton);
        new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, this.textBoxCancelButton);
        this.ddlInstance = ddl;
        return this.dropDownDiv;
    }

    // /**
    //  * @returns {void}
    //  */
    // private applyTextFormFieldValue = (): void => {
    //     this.owner.editorModule.updateFormField(this.formField, this.textBoxInstance.value);
    //     this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
    //     this.hidePopup();
    // };
    // /**
    //  * @returns {void}
    //  */
    // private applyNumberFormFieldValue = (): void => {
    //     this.owner.editorModule.updateFormField(this.formField, this.numberInput.value.toString());
    //     this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
    //     this.hidePopup();
    // };
    // /**
    //  * @returns {void}
    //  */
    // private applyDateFormFieldValue = (): void => {
    //     if (!isNullOrUndefined(this.datePickerInstance.value)) {
    //         this.owner.editorModule.updateFormField(this.formField, this.dateInput.value);
    //         this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: this.formField.resultText, isCanceled: false });
    //         this.hidePopup();
    //     }
    // };
    private onapplyDropDownFormFieldValue(): void {
        this.applyDropDownFormFieldValue();
    }
    /**
     * @returns {void}
     */
    private applyDropDownFormFieldValue = (): void => {
        // this.owner.editorModule.updateFormField(this.formField, this.ddlInstance.index);
        // this.owner.trigger(afterFormFieldFillEvent, { 'fieldName': this.formField.formFieldData.name, value: (this.formField.formFieldData as DropDownFormField).selectedIndex, isCanceled: false });
        this.owner.editorModule.dropDownChange(this.contenControl, this.ddlInstance.text);
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
    public showPopUp(formField: ContentControl): void {
        if (formField) {
            this.contenControl = formField;
            if (isNullOrUndefined(this.target)) {
                this.initPopup();
            }
            classList(this.target, [], ['e-de-txt-form', 'e-de-num-form', 'e-de-date-form', 'e-de-ddl-form']);
            classList(this.target, ['e-de-ddl-form'], []);
            this.ddlInstance.refresh();
            /* eslint-disable  */
            const convertedItems: { [key: string]: Object; }[] = formField.contentControlProperties.contentControlListItems.map(item  => {
                const convertedItem: { [key: string]: Object } = {};
                for (const prop in item) {
                    convertedItem[`${prop}`] = item[`${prop}`];
                }
                return convertedItem;
            });
            this.ddlInstance.dataSource = convertedItems;
            setTimeout(() => {
                this.ddlInstance.showPopup();
            }, 50);

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
    }
    private onCloseButtonClicked(): void {
        this.closeButton();
    }
    /**
     * @private
     * @returns {void}
     */
    private closeButton = (): void => {
        // const field: FieldElementBox = this.formField;
        this.hidePopup();
    };
    /**
     * @private
     * @returns {void}
     */
    public hidePopup = (): void => {
        this.contenControl = undefined;
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
        if (this.contenControl) {
            this.contenControl.destroy();
        }
        this.removeEvents();
        this.removeElements();
        this.contenControl = undefined;
        this.owner = undefined;
    }
    private removeEvents(): void {
        if (this.textBoxOkButton) {
            this.textBoxOkButton.removeEventListener('click', this.applyDropDownFormFieldValueHandler);
        }
        if (this.textBoxCancelButton) {
            this.textBoxCancelButton.removeEventListener('click', this.closeButtonClickedHandler);
        }
    }
    private removeElements(): void {
        if (this.target) {
            this.target.remove();
        }
        if (this.dataPickerOkButton && this.dataPickerOkButton.element && this.dataPickerOkButton.element.parentNode) { 
            this.dataPickerOkButton.destroy();
            this.dataPickerOkButton = undefined;
        }
        if (this.ddlInstance) {
            this.ddlInstance.destroy();
            this.ddlInstance = undefined;
        }
        if (this.dataPickerOkButton) {
            this.dataPickerOkButton.destroy();
            this.dataPickerOkButton = undefined;
        }
        if (this.popupElement) {
            this.popupElement.remove();
            this.popupElement = undefined;
        }
        if (this.dropDownDiv) {
            this.dropDownDiv.remove();
            this.dropDownDiv = undefined;
        }
        if (this.textBoxButtonDiv) {
            this.textBoxButtonDiv.remove();
            this.textBoxButtonDiv = undefined;
        }
        if (this.textBoxOkButton) {
            this.textBoxOkButton.remove();
            this.textBoxOkButton = undefined;
        }
        if (this.textBoxCancelButton) {
            this.textBoxCancelButton.remove();
            this.textBoxCancelButton = undefined;
        }
        this.target = undefined;
        this.dropDownInput = undefined;
        this.ddlInstance = undefined;
        this.dropDownDiv = undefined;
        this.textBoxButtonDiv = undefined;
        this.textBoxOkButton = undefined;
        this.textBoxCancelButton = undefined;
    }
}
