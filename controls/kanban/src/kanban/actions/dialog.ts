import { append, createElement, remove, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { DropDownList, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { FormValidator, NumericTextBox, TextBox, Input } from '@syncfusion/ej2-inputs';
import { Dialog, DialogModel, BeforeOpenEventArgs, ButtonPropsModel, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { Kanban } from '../base/kanban';
import { DialogEventArgs, EJ2Instance } from '../base/interface';
import { CurrentAction } from '../base/type';
import { DialogFieldsModel } from '../models/index';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Dialog module is used to perform card actions.
 * @hidden
 */
export class KanbanDialog {
    private parent: Kanban;
    private dialogObj: Dialog;
    private element: HTMLElement;
    private formObj: FormValidator;
    private action: CurrentAction;
    private cardData: { [key: string]: Object };

    /**
     * Constructor for dialog module
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
    }

    public openDialog(action: CurrentAction, data?: { [key: string]: Object }): void {
        this.action = action;
        this.parent.activeCardData.data = data;
        this.renderDialog(data, action);
        this.dialogObj.show();
    }

    public closeDialog(): void {
        this.dialogObj.hide();
    }

    private renderDialog(args: { [key: string]: Object }, action: CurrentAction): void {
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        let dialogModel: DialogModel = {
            buttons: this.getDialogButtons(action),
            content: this.getDialogContent(args, action),
            cssClass: cls.DIALOG_CLASS,
            enableRtl: this.parent.enableRtl,
            header: this.parent.localeObj.getConstant(action === 'Add' ? 'addTitle' : action === 'Edit' ? 'editTitle' : 'deleteTitle'),
            height: this.parent.isAdaptive ? '100%' : 'auto',
            isModal: true,
            showCloseIcon: this.parent.isAdaptive ? false : true,
            target: document.body,
            width: (action === 'Delete') ? 400 : 350,
            visible: false,
            beforeOpen: this.onBeforeDialogOpen.bind(this),
            beforeClose: this.onBeforeDialogClose.bind(this)
        };
        this.dialogObj = new Dialog(dialogModel, this.element);
        if (action !== 'Delete') {
            this.applyFormValidation();
        }
    }

    private getDialogContent(args: { [key: string]: Object }, action: CurrentAction): HTMLElement | string {
        if (action === 'Delete') {
            return this.parent.localeObj.getConstant('deleteContent');
        } else {
            let container: HTMLElement = createElement('div', { className: cls.FORM_WRAPPER_CLASS });
            let form: HTMLFormElement = createElement('form', {
                id: this.parent.element.id + 'EditForm',
                className: cls.FORM_CLASS, attrs: { onsubmit: 'return false;' }
            }) as HTMLFormElement;
            if (this.parent.dialogSettings.template) {
                if (args) {
                    this.destroyComponents();
                    [].slice.call(form.childNodes).forEach((node: HTMLElement) => remove(node));
                }
                append(this.parent.templateParser(this.parent.dialogSettings.template)(args), form);
            } else {
                let dialogWrapper: HTMLElement = createElement('div', { className: cls.DIALOG_CONTENT_CONTAINER });
                form.appendChild(dialogWrapper);
                let table: HTMLElement = createElement('table');
                dialogWrapper.appendChild(table);
                let dialogFields: DialogFieldsModel[] = this.getDialogFields();
                for (let field of dialogFields) {
                    let tr: HTMLElement = createElement('tr');
                    table.appendChild(tr);
                    tr.appendChild(createElement('td', { className: 'e-label', innerHTML: field.text ? field.text : field.key }));
                    let td: HTMLElement = createElement('td');
                    tr.appendChild(td);
                    td.appendChild(this.renderComponents(field));
                }
            }
            container.appendChild(form);
            return container;
        }
    }

    private getDialogFields(): DialogFieldsModel[] {
        let fields: DialogFieldsModel[] = this.parent.dialogSettings.fields;
        if (fields.length === 0) {
            fields = [
                { text: 'ID', key: this.parent.cardSettings.headerField, type: 'Input' },
                { key: this.parent.keyField, type: 'DropDown' },
                { key: 'Estimate', type: 'Numeric' },
                { key: 'Summary', type: 'TextArea' }
            ];
            if (this.parent.cardSettings.priority) {
                fields.splice(fields.length - 1, 0, { key: this.parent.cardSettings.priority, type: 'Numeric' });
            }
            if (this.parent.swimlaneSettings.keyField) {
                fields.splice(fields.length - 1, 0, { key: 'Assignee', type: 'DropDown' });
            }
        }
        return fields;
    }

    private getDialogButtons(action: CurrentAction): ButtonPropsModel[] {
        let primaryButtonClass: string = action === 'Delete' ? 'e-dialog-yes' : action === 'Add' ? 'e-dialog-add' : 'e-dialog-edit';
        let flatButtonClass: string = action === 'Delete' ? 'e-dialog-no' : 'e-dialog-cancel';
        let dialogButtons: ButtonPropsModel[] = [
            {
                buttonModel: {
                    cssClass: 'e-flat ' + primaryButtonClass, isPrimary: true,
                    content: this.parent.localeObj.getConstant(action === 'Add' || action === 'Edit' ? 'save' : 'yes')
                },
                click: this.dialogButtonClick.bind(this)
            }, {
                buttonModel: {
                    cssClass: 'e-flat ' + flatButtonClass, isPrimary: false,
                    content: this.parent.localeObj.getConstant(action === 'Add' || action === 'Edit' ? 'cancel' : 'no')
                },
                click: this.dialogButtonClick.bind(this)
            }
        ];
        if (action === 'Edit') {
            let deleteButton: ButtonPropsModel = {
                buttonModel: { cssClass: 'e-flat e-dialog-delete', isPrimary: false, content: this.parent.localeObj.getConstant('delete') },
                click: this.dialogButtonClick.bind(this)
            };
            dialogButtons.splice(0, 0, deleteButton);
        }
        return dialogButtons;
    }

    private renderComponents(field: DialogFieldsModel): HTMLElement {
        let wrapper: HTMLElement = createElement('div', { className: field.key + '_wrapper' });
        let element: HTMLElement = createElement('input', { className: cls.FIELD_CLASS, attrs: { 'name': field.key } });
        wrapper.appendChild(element);
        let controlObj: DropDownList | NumericTextBox | TextBox;
        let fieldValue: Object = this.parent.activeCardData.data ? this.parent.activeCardData.data[field.key] : null;
        switch (field.type) {
            case 'DropDown':
                let dropDownOptions: DropDownListModel;
                if (field.key === this.parent.keyField) {
                    dropDownOptions = {
                        dataSource: [].slice.call(this.parent.columns),
                        fields: { text: 'headerText', value: 'keyField' },
                        value: fieldValue as string
                    };
                } else if (field.key === this.parent.swimlaneSettings.keyField) {
                    dropDownOptions = {
                        dataSource: [].slice.call(this.parent.layoutModule.kanbanRows),
                        fields: { text: 'textField', value: 'keyField' },
                        value: fieldValue as string
                    };
                }
                controlObj = new DropDownList(dropDownOptions);
                break;
            case 'Numeric':
                controlObj = new NumericTextBox({ value: fieldValue as number });
                break;
            case 'TextBox':
                controlObj = new TextBox({ value: fieldValue as string });
                break;
            case 'Input':
                if (fieldValue) {
                    (element as HTMLInputElement).value = fieldValue as string;
                }
                if (fieldValue && this.parent.cardSettings.headerField === field.key) {
                    Input.createInput({ element: element as HTMLInputElement, properties: { enabled: false } });
                } else {
                    Input.createInput({ element: element as HTMLInputElement });
                }
                break;
            case 'TextArea':
                remove(element);
                let divElement: HTMLElement = createElement('div', { className: 'e-float-input' });
                element = createElement('textarea', {
                    className: cls.FIELD_CLASS, attrs: { 'name': field.key, 'rows': '2' },
                    innerHTML: fieldValue as string
                });
                wrapper.appendChild(divElement).appendChild(element);
                break;
            default:
                break;
        }
        if (controlObj) {
            controlObj.appendTo(element);
        }
        return wrapper;
    }

    private onBeforeDialogOpen(args: BeforeOpenEventArgs): void {
        let eventProp: DialogEventArgs = {
            data: this.parent.activeCardData.data,
            cancel: false, element: this.element,
            target: this.parent.activeCardData.element,
            requestType: this.action
        };
        this.parent.trigger(events.dialogOpen, eventProp, (openArgs: DialogEventArgs) => args.cancel = openArgs.cancel);
    }

    private onBeforeDialogClose(args: BeforeCloseEventArgs): void {
        let formInputs: HTMLInputElement[] = this.getFormElements();
        let cardObj: { [key: string]: Object } = {};
        for (let input of formInputs) {
            let columnName: string = input.name || this.getColumnName(input);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                let value: string | number | boolean | Date | string[] | number[] = this.getValueFromElement(input as HTMLElement);
                if (columnName === this.parent.cardSettings.headerField) {
                    value = this.getIDType() === 'string' ? value : parseInt(value as string, 10);
                }
                cardObj[columnName] = value;
            }
        }
        let eventProp: DialogEventArgs = { data: cardObj, cancel: false, element: this.element, requestType: this.action };
        this.parent.trigger(events.dialogClose, eventProp, (closeArgs: DialogEventArgs) => {
            args.cancel = closeArgs.cancel;
            if (!closeArgs.cancel) {
                this.cardData = eventProp.data;
                this.destroy();
            }
        });
    }

    private getIDType(): string {
        if (this.parent.kanbanData.length !== 0) {
            return typeof ((<{ [key: string]: Object }>this.parent.kanbanData[0])[this.parent.cardSettings.headerField]);
        }
        return 'string';
    }

    private applyFormValidation(): void {
        let form: HTMLFormElement = this.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        let rules: { [key: string]: Object } = {};
        for (let field of this.parent.dialogSettings.fields) {
            rules[field.key] = (field.validationRules && Object.keys(field.validationRules).length > 0) ? field.validationRules : null;
        }
        this.formObj = new FormValidator(form, {
            rules: rules as { [name: string]: { [rule: string]: Object } },
            customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                let id: string = error.getAttribute('for');
                let elem: Element = this.element.querySelector('#' + id + '_Error');
                if (!elem) {
                    this.createTooltip(inputElement, error, id, '');
                }
            },
            validationComplete: (args: { status: string, inputName: string, element: HTMLElement, message: string }) => {
                let elem: HTMLElement = this.element.querySelector('#' + args.inputName + '_Error') as HTMLElement;
                if (elem) {
                    elem.style.display = (args.status === 'failure') ? '' : 'none';
                }
            }
        });
    }

    private createTooltip(element: Element, error: HTMLElement, name: string, display: string): void {
        let dlgContent: Element;
        let client: ClientRect;
        let inputClient: ClientRect = element.parentElement.getBoundingClientRect();
        if (this.element.classList.contains(cls.DIALOG_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        } else {
            dlgContent = this.element.querySelector('.e-kanban-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        let div: HTMLElement = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + cls.ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        let content: Element = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        let arrow: Element = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    }

    private destroyToolTip(): void {
        if (this.element) {
            this.element.querySelectorAll('.' + cls.ERROR_VALIDATION_CLASS).forEach((node: Element) => remove(node));
        }
        if (this.formObj && this.formObj.element) {
            this.formObj.reset();
        }
    }

    private dialogButtonClick(event: Event): void {
        let target: HTMLElement = (event.target as HTMLElement).cloneNode(true) as HTMLElement;
        let id: string = this.formObj.element.id;
        if (document.getElementById(id) && this.formObj.validate() &&
            (target.classList.contains('e-dialog-edit') || target.classList.contains('e-dialog-add'))) {
            this.dialogObj.hide();
            if (target.classList.contains('e-dialog-edit')) {
                this.parent.crudModule.updateCard(this.cardData);
            }
            if (target.classList.contains('e-dialog-add')) {
                this.parent.crudModule.addCard(this.cardData);
            }
            this.cardData = null;
        }
        if (!target.classList.contains('e-dialog-edit') && !target.classList.contains('e-dialog-add')) {
            this.dialogObj.hide();
            if (target.classList.contains('e-dialog-yes')) {
                this.parent.crudModule.deleteCard(this.parent.activeCardData.data);
            } else if (target.classList.contains('e-dialog-no')) {
                this.openDialog('Edit', this.parent.activeCardData.data);
            } else if (target.classList.contains('e-dialog-delete')) {
                this.openDialog('Delete', this.parent.activeCardData.data);
            }
        }
    }

    private getFormElements(): HTMLInputElement[] {
        let elements: HTMLInputElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.FIELD_CLASS));
        let validElements: HTMLInputElement[] = [];
        for (let element of elements) {
            if (element.classList.contains('e-control')) {
                validElements.push(element);
            } else if (element.querySelector('.e-control')) {
                validElements.push(element.querySelector('.e-control') as HTMLInputElement);
            } else {
                validElements.push(element);
            }
        }
        return validElements;
    }

    private getColumnName(element: HTMLInputElement): string {
        let attrName: string = element.getAttribute('data-name') || '';
        if (attrName === '') {
            let isDropDowns: boolean = false;
            let fieldSelector: string = '';
            if (element.classList.contains('e-dropdownlist') || element.classList.contains('e-multiselect')) {
                fieldSelector = element.classList.contains('e-dropdownlist') ? 'e-ddl' : 'e-multiselect';
                isDropDowns = true;
            } else if (element.classList.contains('e-numerictextbox')) {
                fieldSelector = 'e-numeric';
            }
            let classSelector: string = isDropDowns ? `.${fieldSelector}:not(.e-control)` : `.${fieldSelector}`;
            let control: Element = closest(element, classSelector) || element.querySelector(`.${fieldSelector}`);
            if (control) {
                let attrEle: Element = control.querySelector('[name]');
                if (attrEle) {
                    attrName = (<HTMLInputElement>attrEle).name;
                }
            }
        }
        return attrName;
    }

    private getValueFromElement(element: HTMLElement): number | string | Date | boolean | string[] | number[] {
        let value: number | string | Date | boolean | string[] | number[];
        let instance: Object[] = (element as EJ2Instance).ej2_instances;
        if (instance && instance.length > 0) {
            value = (instance[0] as { [key: string]: number | string | Date | boolean | string[] | number[] }).value ||
                (instance[0] as { [key: string]: number | string | Date | boolean | string[] | number[] }).checked;
        } else {
            value = (element as HTMLInputElement).value;
        }
        return value;
    }

    private destroyComponents(): void {
        let formelement: HTMLElement[] = this.getFormElements();
        for (let element of formelement) {
            let instance: Object[] = (element as EJ2Instance).ej2_instances;
            if (instance && instance.length > 0) {
                instance.forEach((node: Kanban) => node.destroy());
            }
        }
    }

    public destroy(): void {
        this.destroyToolTip();
        this.destroyComponents();
        if (this.dialogObj) {
            this.dialogObj.destroy();
            this.dialogObj = null;
            remove(this.element);
            this.element = null;
        }
    }

}
