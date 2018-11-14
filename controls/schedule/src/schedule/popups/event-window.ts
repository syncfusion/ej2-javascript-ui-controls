import { createElement, L10n, isNullOrUndefined, addClass, remove, EventHandler, extend, append, EmitType } from '@syncfusion/ej2-base';
import { cldrData, removeClass, getValue, getDefaultDateObject } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { CheckBox, ChangeEventArgs, Button, RadioButton } from '@syncfusion/ej2-buttons';
import { Dialog, BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import {
    DropDownList, FilteringEventArgs, MultiSelect, ChangeEventArgs as ddlChangeEventArgs,
    MultiSelectChangeEventArgs
} from '@syncfusion/ej2-dropdowns';
import { Input, FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, DateTimePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { Schedule } from '../base/schedule';
import { EJ2Instance, EventFieldsMapping, PopupOpenEventArgs, TdData, CellClickEventArgs } from '../base/interface';
import { CurrentAction } from '../base/type';
import { Timezone, timezoneData } from '../timezone/timezone';
import { FieldValidator } from './form-validator';
import { RecurrenceEditor } from '../../recurrence-editor/recurrence-editor';
import { ResourcesModel } from '../models/resources-model';
import * as cls from '../base/css-constant';
import * as event from '../base/constant';
import * as util from '../base/util';

const EVENT_FIELD: string = 'e-field';
const REPEAT_CONTAINER_CLASS: string = 'e-recurrence-container';
const REPEAT_BUTTON_ICON_CLASS: string = 'e-recurrence-edit';
const REPEAT_BUTTON_CLASS: string = 'e-recurrence-edit-button';
const REPEAT_DIALOG_CLASS: string = 'e-recurrence-dialog';
const HIDE_STYLE_CLASS: string = 'e-hide';

/**
 * Event editor window
 */
export class EventWindow {
    private parent: Schedule;
    public dialogObject: Dialog;
    private element: HTMLElement;
    private fields: EventFieldsMapping;
    private l10n: L10n;
    private eventData: { [key: string]: Object };
    private fieldValidator: FieldValidator;
    private recurrenceEditor: RecurrenceEditor;
    private repeatDialogObject: Dialog;
    private repeatTempRule: string;
    private repeatRule: string;
    private repeatStatus: CheckBox;
    private buttonObj: Button;
    private repeatStartDate: Date;
    private cellClickAction: boolean;
    private localTimezoneName: string;
    private duration: number;

    /**
     * Constructor for event window
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fields = this.parent.eventFields;
        this.fieldValidator = new FieldValidator();
        let timezone: Timezone = new Timezone();
        this.localTimezoneName = timezone.getLocalTimezoneName();
        this.renderEventWindow();
    }

    private renderEventWindow(): void {
        let dialogContent: HTMLElement = this.getEventWindowContent() as HTMLElement;
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        if (this.parent.isAdaptive) {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                content: dialogContent,
                cssClass: cls.EVENT_WINDOW_DIALOG_CLASS + ' ' + cls.DEVICE_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                    this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>',
                height: '100%',
                isModal: true,
                showCloseIcon: false,
                target: document.body,
                visible: false,
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        } else {
            this.dialogObject = new Dialog({
                animationSettings: { effect: 'Zoom' },
                buttons: [{
                    buttonModel: { content: this.l10n.getConstant('deleteButton'), cssClass: cls.EVENT_WINDOW_DELETE_BUTTON_CLASS },
                    click: this.eventDelete.bind(this)
                }, {
                    buttonModel: {
                        content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary ' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS,
                        isPrimary: true
                    },
                    click: this.eventSave.bind(this)
                }, {
                    buttonModel: { cssClass: cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS, content: this.l10n.getConstant('cancelButton') },
                    click: this.dialogClose.bind(this)
                }],
                content: dialogContent,
                cssClass: cls.EVENT_WINDOW_DIALOG_CLASS,
                enableRtl: this.parent.enableRtl,
                header: '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>',
                isModal: true,
                showCloseIcon: true,
                target: document.body,
                visible: false,
                width: '500px',
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this)
            });
        }
        this.dialogObject.appendTo(this.element);
        addClass([this.element.parentElement], cls.EVENT_WINDOW_DIALOG_CLASS + '-container');
        if (this.parent.isAdaptive) {
            EventHandler.add(this.element.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS), 'click', this.dialogClose, this);
            EventHandler.add(this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_ICON_CLASS), 'click', this.eventSave, this);
        }
        this.applyFormValidation();
    }

    public refresh(): void {
        this.destroy();
        this.renderEventWindow();
    }

    public openEditor(data: Object, type: CurrentAction, isEventData?: boolean): void {
        this.parent.quickPopup.quickPopupHide(true);
        if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            removeClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
        }
        switch (type) {
            case 'Add':
                this.cellClickAction = !isEventData;
                this.parent.activeCellsData = data as CellClickEventArgs;
                this.onCellDetailsUpdate(data as { [key: string]: Object });
                break;
            case 'Save':
            case 'EditOccurrence':
            case 'EditSeries':
                if (type === 'EditOccurrence' && !this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
                    addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
                }
                this.cellClickAction = false;
                this.onEventDetailsUpdate(<{ [key: string]: Object }>data);
                break;
        }
    }

    public setDialogContent(): void {
        this.dialogObject.content = this.getEventWindowContent();
        this.dialogObject.dataBind();
    }

    private onBeforeOpen(args: BeforeOpenEventArgs): void {
        let eventProp: PopupOpenEventArgs = {
            type: 'Editor',
            data: this.eventData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element) as HTMLElement
        };
        if (this.cellClickAction) {
            eventProp.duration = this.getSlotDuration();
        }
        this.parent.trigger(event.popupOpen, eventProp);
        args.cancel = eventProp.cancel;
        this.duration = this.cellClickAction ? eventProp.duration : null;
        this.refreshDateTimePicker(this.duration);
        if (this.cellClickAction && eventProp.duration !== this.getSlotDuration() && isNullOrUndefined(this.parent.editorTemplate)) {
            let startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            let endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(startObj.value.getTime() + (util.MS_PER_MINUTE * eventProp.duration));
            endObj.dataBind();
        }
    }

    private onBeforeClose(): void {
        this.parent.eventBase.focusElement();
    }

    private getEventWindowContent(): HTMLElement {
        let container: HTMLElement = createElement('div', { className: cls.FORM_CONTAINER_CLASS });
        let form: HTMLFormElement = createElement('form', {
            id: this.parent.element.id + 'EditForm',
            className: cls.FORM_CLASS,
            attrs: { onsubmit: 'return false;' }
        }) as HTMLFormElement;
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            append(this.parent.getEditorTemplate()(), form);
        } else {
            let content: HTMLElement = this.getDefaultEventWindowContent();
            form.appendChild(content);
        }
        container.appendChild(form);
        return container;
    }

    private getDefaultEventWindowContent(): HTMLElement {
        let parentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_DIALOG_PARENT_CLASS);
        let titleLocationDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS);
        let titleDiv: HTMLElement = this.renderTextBox(cls.SUBJECT_CLASS);
        let locationDiv: HTMLElement = this.renderTextBox(cls.LOCATION_CLASS);
        titleLocationDiv.appendChild(titleDiv);
        titleLocationDiv.appendChild(locationDiv);
        let startEndDateTimeDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_START_END_DIV_CLASS);
        let startDateTimeDiv: HTMLElement = this.renderDateTimePicker(cls.EVENT_WINDOW_START_CLASS, this.onTimeChange.bind(this));
        let endDateTimeDiv: HTMLElement = this.renderDateTimePicker(cls.EVENT_WINDOW_END_CLASS);
        startEndDateTimeDiv.appendChild(startDateTimeDiv);
        startEndDateTimeDiv.appendChild(endDateTimeDiv);
        let timezoneParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        let startTimezoneDiv: HTMLElement = this.renderDropDown(cls.EVENT_WINDOW_START_TZ_CLASS);
        let endTimezoneDiv: HTMLElement = this.renderDropDown(cls.EVENT_WINDOW_END_TZ_CLASS);
        timezoneParentDiv.appendChild(startTimezoneDiv);
        timezoneParentDiv.appendChild(endTimezoneDiv);
        let allDayTimezoneDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS);
        let allDayDiv: HTMLElement = this.renderCheckBox(cls.EVENT_WINDOW_ALL_DAY_CLASS);
        let timezoneDiv: HTMLElement = this.renderCheckBox(cls.TIME_ZONE_CLASS);
        allDayTimezoneDiv.appendChild(allDayDiv);
        allDayTimezoneDiv.appendChild(timezoneDiv);
        let repeatParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_REPEAT_DIV_CLASS);
        let repeatDiv: HTMLElement = this.renderCheckBox(cls.EVENT_WINDOW_REPEAT_CLASS);
        let repeatEditConainer: HTMLElement = createElement('span', { className: REPEAT_CONTAINER_CLASS });
        let button: HTMLElement = createElement('button', {
            className: REPEAT_BUTTON_CLASS,
            attrs: { type: 'button', 'title': this.l10n.getConstant('editRecurrence') }
        });
        this.buttonObj = new Button({ iconCss: REPEAT_BUTTON_ICON_CLASS + ' e-icons', cssClass: 'e-medium ' + this.parent.cssClass });
        repeatEditConainer.appendChild(button);
        this.buttonObj.appendTo(button);
        repeatDiv.appendChild(repeatEditConainer);
        repeatParentDiv.appendChild(repeatDiv);
        let description: HTMLElement = this.createDivElement(cls.DESCRIPTION_CLASS + '-row');
        let descriptionDiv: HTMLElement = this.renderTextBox(cls.DESCRIPTION_CLASS);
        description.appendChild(descriptionDiv);
        parentDiv.appendChild(titleLocationDiv);
        parentDiv.appendChild(startEndDateTimeDiv);
        parentDiv.appendChild(allDayTimezoneDiv);
        parentDiv.appendChild(timezoneParentDiv);
        parentDiv.appendChild(repeatParentDiv);
        if (!this.parent.isAdaptive) {
            this.createRecurrenceEditor(parentDiv);
        } else {
            EventHandler.add(button, 'click', this.loadRecurrenceEditor, this);
        }
        if (this.parent.resources.length > 0) {
            let resourceParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_RESOURCES_DIV_CLASS);
            for (let i: number = 0; i < this.parent.resourceBase.resourceCollection.length; i++) {
                resourceParentDiv.appendChild(this.renderMultiSelect(i));
            }
            parentDiv.appendChild(resourceParentDiv);
        }
        parentDiv.appendChild(description);
        let submit: HTMLElement = createElement('button', { attrs: { type: 'hidden', title: 'submit', style: 'display:none' } });
        parentDiv.appendChild(submit);
        return parentDiv;
    }

    private createRecurrenceEditor(parentDiv: HTMLElement): void {
        let recurrenceEditor: HTMLElement = this.createDivElement();
        parentDiv.appendChild(recurrenceEditor);
        this.recurrenceEditor = this.renderRecurrenceEditor();
        this.recurrenceEditor.appendTo(recurrenceEditor);
    }

    private createDivElement(className?: string): HTMLElement {
        return createElement('div', { className: className });
    }

    private createInputElement(className: string, fieldName: string, type?: string): HTMLElement {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', name: fieldName, value: '',
                title: ((this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))) === '') ?
                    fieldName : this.l10n.getConstant(fieldName.charAt(0).toLowerCase() + fieldName.slice(1))
            }
        });
    }

    private getSlotDuration(): number {
        return this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
    }

    private renderDateTimePicker(value: string, changeEvent?: EmitType<ChangedEventArgs>): HTMLElement {
        let dateTimeDiv: HTMLElement = this.createDivElement(value + '-container');
        let fieldName: string = this.getFieldName(value);
        let dateTimeInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        dateTimeDiv.appendChild(dateTimeInput);
        let dateTimePicker: DateTimePicker = new DateTimePicker({
            change: changeEvent,
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            floatLabelType: 'Always',
            format: (isNullOrUndefined(this.parent.dateFormat) ?
                this.getFormat('dateFormats') : this.parent.dateFormat) + ' ' + this.getFormat('timeFormats'),
            placeholder: this.getFieldLabel(value),
            step: this.getSlotDuration(),
            value: new Date(), width: '100%'
        });
        dateTimePicker.appendTo(dateTimeInput);
        return dateTimeDiv;
    }

    public refreshDateTimePicker(duration?: number): void {
        let startEndElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.EVENT_WINDOW_START_CLASS + ',.' +
            cls.EVENT_WINDOW_END_CLASS));
        startEndElement.forEach((element: HTMLElement) => {
            let instance: DateTimePicker = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as DateTimePicker;
            instance.step = duration || this.getSlotDuration();
            instance.dataBind();
        });
    }

    private onTimeChange(): void {
        let startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
        if (startObj.element.parentElement.classList.contains('e-input-focus')) {
            let endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            let duration: number = 0;
            if (this.cellClickAction) {
                duration = util.MS_PER_MINUTE * this.duration;
            } else {
                duration = (<Date>this.eventData[this.fields.endTime]).getTime() - (<Date>this.eventData[this.fields.startTime]).getTime();
            }
            endObj.value = new Date(startObj.value.getTime() + duration);
            endObj.dataBind();
        }
    }

    private renderMultiSelect(index: number): HTMLElement {
        let resourceData: ResourcesModel = this.parent.resourceBase.resourceCollection[index];
        let fieldName: string = resourceData.field;
        let value: string = 'e-' + fieldName;
        let labelValue: string = resourceData.title;
        let resourceDiv: HTMLElement = this.createDivElement(value + '-container' + ' ' + 'e-resources');
        let resourceInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        resourceDiv.appendChild(resourceInput);
        let resourceTemplate: string = '<div class="e-resource-template"><div class="e-resource-color" style="background-color:${' +
            resourceData.colorField + '}"></div><div class="e-resource-text">${' + resourceData.textField + '}</div></div>';
        if (resourceData.allowMultiple) {
            let listObj: MultiSelect = new MultiSelect({
                cssClass: this.parent.cssClass || '',
                dataSource: resourceData.dataSource as { [key: string]: Object }[],
                change: this.onMultiselectResourceChange.bind(this),
                itemTemplate: resourceTemplate,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                mode: 'Box'
            });
            listObj.appendTo(resourceInput);
        } else {
            let drowDownList: DropDownList = new DropDownList({
                cssClass: this.parent.cssClass || '',
                change: this.onDropdownResourceChange.bind(this),
                dataSource: resourceData.dataSource as { [key: string]: Object }[],
                enableRtl: this.parent.enableRtl,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'title': labelValue, 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                itemTemplate: resourceTemplate
            });
            drowDownList.appendTo(resourceInput);
        }
        return resourceDiv;
    }

    private renderDropDown(value: string): HTMLElement {
        let fieldName: string = this.getFieldName(value);
        let timezoneDiv: HTMLElement = this.createDivElement(value + '-container');
        let timezoneInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        timezoneDiv.appendChild(timezoneInput);
        let drowDownList: DropDownList = new DropDownList({
            allowFiltering: true,
            change: this.onTimezoneChange,
            cssClass: this.parent.cssClass || '',
            dataSource: timezoneData,
            enableRtl: this.parent.enableRtl,
            fields: { text: 'Text', value: 'Value' },
            filterBarPlaceholder: 'Search Timezone',
            filtering: (e: FilteringEventArgs) => {
                let query: Query = new Query();
                query = (e.text !== '') ? query.where('Text', 'contains', e.text, true) : query;
                e.updateData(timezoneData, query);
            },
            htmlAttributes: { 'title': this.getFieldLabel(value), 'name': fieldName },
            floatLabelType: 'Always',
            placeholder: this.getFieldLabel(value),
            popupHeight: '230px',
        });
        drowDownList.appendTo(timezoneInput);
        return timezoneDiv;
    }

    private onMultiselectResourceChange(args: MultiSelectChangeEventArgs): void {
        if (!args.value || !this.parent.activeViewOptions.group.byGroupID || this.parent.resources.length <= 1) {
            return;
        }
        let resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let i: number = 0; i < resourceCollection.length; i++) {
            if (resourceCollection[i].field === args.element.getAttribute('name') && i < resourceCollection.length - 1) {
                let resObject: MultiSelect | DropDownList = this.createInstance(i);
                let datasource: { [key: string]: Object }[] = [];
                for (let j: number = 0; j < args.value.length; j++) {
                    let resourceData: Object[] = resourceCollection[i + 1].dataSource as Object[];
                    let query: Query = new Query().where(resourceCollection[i + 1].groupIDField, 'equal', args.value[j]);
                    let filter: Object = new DataManager({ json: resourceData }).executeLocal(query)[0];
                    let groupId: number = (<{ [key: string]: Object }>filter)[resourceCollection[i + 1].idField] as number;
                    let filterRes: { [key: string]: Object }[] = this.filterDatasource(i, groupId);
                    datasource = datasource.concat(filterRes);
                }
                resObject.dataSource = datasource;
                resObject.dataBind();
            }
        }
    }

    private createInstance(index: number): MultiSelect | DropDownList {
        let resourceData: { [key: string]: object } = this.parent.resourceBase.resourceCollection[index + 1] as { [key: string]: object };
        let resObject: MultiSelect | DropDownList = (this.element.querySelector('.e-' + resourceData.field) as EJ2Instance).
            ej2_instances[0] as MultiSelect | DropDownList;
        return resObject;
    }

    private onDropdownResourceChange(args: ddlChangeEventArgs): void {
        if (!args.value || this.parent.resources.length <= 1 || !this.parent.activeViewOptions.group.byGroupID) {
            return;
        }
        let resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let i: number = 0; i < resourceCollection.length; i++) {
            if ((i < resourceCollection.length - 1) && resourceCollection[i].field === args.element.getAttribute('name')) {
                let resObj: MultiSelect | DropDownList = this.createInstance(i);
                let groupId: number = (args.itemData as { [key: string]: Object })[resourceCollection[i].idField] as number;
                resObj.dataSource = this.filterDatasource(i, groupId);
                resObj.dataBind();
                let resValue: string = resObj.dataSource[0][resourceCollection[i + 1].idField] as string;
                resObj.value = (resourceCollection[i + 1].allowMultiple) ? [resValue] : resValue;
                resObj.dataBind();
            }
        }
    }

    private filterDatasource(index: number, groupId: number | string): { [key: string]: Object }[] {
        let resourceData: ResourcesModel = this.parent.resourceBase.resourceCollection[index + 1];
        let query: Query = new Query().where(resourceData.groupIDField as string, 'equal', groupId);
        let filter: Object[] = new DataManager({ json: resourceData.dataSource as Object[] }).executeLocal(query);
        return filter as { [key: string]: Object }[];
    }

    private onTimezoneChange(): void {
        if (this.element.getAttribute('name') === 'StartTimezone') {
            let startTimezoneObj: DropDownList =
                (document.querySelector('.' + cls.EVENT_WINDOW_START_TZ_CLASS) as EJ2Instance).ej2_instances[0] as DropDownList;
            let endTimezoneObj: DropDownList =
                (document.querySelector('.' + cls.EVENT_WINDOW_END_TZ_CLASS) as EJ2Instance).ej2_instances[0] as DropDownList;
            endTimezoneObj.value = startTimezoneObj.value;
            endTimezoneObj.dataBind();
        }
    }

    private renderCheckBox(value: string): HTMLElement {
        let checkBoxDiv: HTMLElement = this.createDivElement(value + '-container');
        let fieldName: string = this.getFieldName(value);
        let checkBoxInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        checkBoxDiv.appendChild(checkBoxInput);
        let checkBox: CheckBox = new CheckBox({
            change: this.onChange.bind(this),
            cssClass: value + ' ' + this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            label: this.getFieldLabel(value)
        });
        checkBox.appendTo(checkBoxInput);
        checkBoxInput.setAttribute('name', fieldName);
        if (fieldName === 'Repeat') {
            this.repeatStatus = checkBox;
        }
        return checkBoxDiv;
    }

    private renderTextBox(value: string): HTMLElement {
        let textBoxDiv: HTMLElement = this.createDivElement(value + '-container');
        let fieldName: string = this.getFieldName(value);
        let elementType: string = (value === cls.DESCRIPTION_CLASS) ? 'textarea' : 'input';
        let textBoxInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName, elementType);
        textBoxDiv.appendChild(textBoxInput);
        Input.createInput({
            element: textBoxInput as HTMLInputElement,
            floatLabelType: 'Always',
            properties: {
                enableRtl: this.parent.enableRtl,
                placeholder: this.getFieldLabel(value)
            }
        });
        return textBoxDiv;
    }

    private getFieldName(name: string): string {
        let fieldName: string = '';
        switch (name) {
            case cls.SUBJECT_CLASS:
                fieldName = this.fields.subject;
                break;
            case cls.LOCATION_CLASS:
                fieldName = this.fields.location;
                break;
            case cls.EVENT_WINDOW_START_CLASS:
                fieldName = this.fields.startTime;
                break;
            case cls.EVENT_WINDOW_END_CLASS:
                fieldName = this.fields.endTime;
                break;
            case cls.DESCRIPTION_CLASS:
                fieldName = this.fields.description;
                break;
            case cls.EVENT_WINDOW_ALL_DAY_CLASS:
                fieldName = this.fields.isAllDay;
                break;
            case cls.EVENT_WINDOW_START_TZ_CLASS:
                fieldName = this.fields.startTimezone;
                break;
            case cls.EVENT_WINDOW_END_TZ_CLASS:
                fieldName = this.fields.endTimezone;
                break;
            case cls.TIME_ZONE_CLASS:
                fieldName = 'Timezone';
                break;
            case cls.EVENT_WINDOW_REPEAT_CLASS:
                fieldName = 'Repeat';
                break;
        }
        return fieldName;
    }

    private getFieldLabel(fieldName: string): string {
        let labelText: string = '';
        switch (fieldName) {
            case cls.SUBJECT_CLASS:
                labelText = this.parent.editorTitles.subject;
                break;
            case cls.LOCATION_CLASS:
                labelText = this.parent.editorTitles.location;
                break;
            case cls.DESCRIPTION_CLASS:
                labelText = this.parent.editorTitles.description;
                break;
            case cls.EVENT_WINDOW_START_CLASS:
                labelText = this.parent.editorTitles.startTime;
                break;
            case cls.EVENT_WINDOW_END_CLASS:
                labelText = this.parent.editorTitles.endTime;
                break;
            case cls.EVENT_WINDOW_START_TZ_CLASS:
                labelText = this.parent.editorTitles.startTimezone;
                break;
            case cls.EVENT_WINDOW_END_TZ_CLASS:
                labelText = this.parent.editorTitles.endTimezone;
                break;
            case cls.EVENT_WINDOW_REPEAT_CLASS:
                labelText = this.parent.editorTitles.recurrenceRule;
                break;
            case cls.EVENT_WINDOW_ALL_DAY_CLASS:
                labelText = this.parent.editorTitles.isAllDay;
                break;
            case cls.TIME_ZONE_CLASS:
                labelText = this.l10n.getConstant('timezone');
                break;
        }
        return labelText;
    }

    private onChange(args: ChangeEventArgs): void {
        let target: HTMLTableCellElement = (args.event.target) as HTMLTableCellElement;
        if (target.classList.contains(cls.EVENT_WINDOW_ALL_DAY_CLASS)) {
            this.onAllDayChange(args.checked);
        } else if (target.classList.contains(cls.TIME_ZONE_CLASS)) {
            this.timezoneChangeStyle(args.checked);
        } else if (target.classList.contains(cls.EVENT_WINDOW_REPEAT_CLASS)) {
            this.onRepeatChange(args.checked);
        }
    }

    private renderRepeatDialog(): void {
        let element: HTMLElement = createElement('div');
        this.repeatDialogObject = new Dialog({
            header: this.l10n.getConstant('recurrence'),
            visible: false,
            content: '<div class="e-rec-editor"></div>',
            closeOnEscape: true,
            width: '90%',
            buttons: [{
                click: this.repeatSaveDialog.bind(this),
                buttonModel: { content: this.l10n.getConstant('save'), cssClass: 'e-save', isPrimary: true }
            },
            { click: this.repeatCancelDialog.bind(this), buttonModel: { cssClass: 'e-cancel', content: this.l10n.getConstant('cancel') } }],
            target: this.element,
            animationSettings: { effect: 'Zoom' },
            enableRtl: this.parent.enableRtl,
            isModal: true,
            cssClass: REPEAT_DIALOG_CLASS,
            open: this.repeatOpenDialog.bind(this)
        });
        this.element.appendChild(element);
        this.repeatDialogObject.appendTo(element);
        this.createRecurrenceEditor(<HTMLElement>this.repeatDialogObject.element.querySelector('.e-rec-editor'));
    }

    private loadRecurrenceEditor(): void {
        this.repeatDialogObject.show();
        if (this.recurrenceEditor && this.repeatRule) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
        }
    }

    private onRepeatChange(state: boolean): void {
        if (state) {
            if (!this.repeatDialogObject) {
                this.renderRepeatDialog();
            }
            this.recurrenceEditor.setProperties({ startDate: <Date>this.repeatStartDate, selectedType: 0 });
            this.loadRecurrenceEditor();
        } else {
            if (this.repeatDialogObject) {
                this.repeatDialogObject.hide();
            }
            this.repeatRule = '';
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(this.repeatRule);
                this.updateRepeatLabel(this.repeatRule);
            }
            let element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
        }
    }

    private repeatSaveDialog(): void {
        this.repeatRule = this.recurrenceEditor.getRecurrenceRule();
        let element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
        if (this.recurrenceEditor.getRecurrenceRule()) {
            removeClass([element], HIDE_STYLE_CLASS);
        } else {
            addClass([element], HIDE_STYLE_CLASS);
            this.repeatStatus.setProperties({ checked: false });
        }
        this.updateRepeatLabel(this.repeatRule);
        this.closeRepeatDialog();
    }

    private closeRepeatDialog(): void {
        this.repeatDialogObject.hide();
    }

    private repeatCancelDialog(): void {
        this.closeRepeatDialog();
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(this.repeatTempRule);
        }
        if (!this.repeatTempRule) {
            this.repeatStatus.setProperties({ checked: false });
        }
    }

    private repeatOpenDialog(): void {
        this.repeatTempRule = this.recurrenceEditor.getRecurrenceRule();
    }

    private onCellDetailsUpdate(event: { [key: string]: Object }): void {
        this.element.querySelector('.' + cls.FORM_CLASS).removeAttribute('data-id');
        this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('newEvent');
        let eventObj: { [key: string]: Object } = {};
        if (this.cellClickAction) {
            if (event.subject) {
                eventObj[this.fields.subject] = event.subject;
            }
            eventObj[this.fields.startTime] = event.startTime;
            eventObj[this.fields.endTime] = event.endTime;
            eventObj[this.fields.isAllDay] = event.isAllDay;
            if (this.parent.resources.length > 0 || this.parent.activeViewOptions.group.resources.length > 0) {
                this.parent.resourceBase.setResourceValues(eventObj, false);
            }
        } else {
            this.parent.activeCellsData = {
                startTime: <Date>(event.startTime || event[this.fields.startTime]),
                endTime: <Date>(event.endTime || event[this.fields.endTime]),
                isAllDay: <boolean>(event.isAllDay || event[this.fields.isAllDay]),
                element: <HTMLElement>event.element,
                groupIndex: <number>event.groupIndex
            };
            eventObj = event;
        }
        eventObj.Timezone = false;
        this.repeatStartDate = <Date>eventObj[this.fields.startTime];
        this.repeatRule = '';
        this.showDetails(eventObj);
        let deleteButton: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
        if (deleteButton) {
            addClass([deleteButton], cls.DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setProperties({ startDate: <Date>eventObj[this.fields.startTime], selectedType: 0 });
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            let element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
            this.updateRepeatLabel(this.repeatRule);
        }
        this.dialogObject.show();
    }

    private applyFormValidation(): void {
        let getValidationRule: Function = (rules: Object) => (rules && Object.keys(rules).length > 0) ? rules : undefined;
        let form: HTMLFormElement = this.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        let rules: { [key: string]: Object } = {};
        rules[this.parent.eventSettings.fields.subject.name] = getValidationRule(this.parent.eventSettings.fields.subject.validation);
        rules[this.parent.eventSettings.fields.location.name] = getValidationRule(this.parent.eventSettings.fields.location.validation);
        rules[this.parent.eventSettings.fields.startTime.name] = getValidationRule(this.parent.eventSettings.fields.startTime.validation);
        rules[this.parent.eventSettings.fields.endTime.name] = getValidationRule(this.parent.eventSettings.fields.endTime.validation);
        rules[this.parent.eventSettings.fields.description.name] =
            getValidationRule(this.parent.eventSettings.fields.description.validation);
        this.fieldValidator.renderFormValidator(form, rules, this.element);
    }

    private showDetails(eventData: { [key: string]: Object }): void {
        let eventObj: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, eventData, null, true);
        this.trimAllDay(eventObj);
        this.eventData = eventObj;
        let formelement: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        let keyNames: string[] = Object.keys(eventObj);
        for (let curElement of formelement) {
            let columnName: string = curElement.name;
            let isCustomElement: boolean = (curElement.classList.contains('e-multiselect') ||
                curElement.classList.contains('e-dropdownlist'));
            if (!isNullOrUndefined(columnName) || isCustomElement) {
                if (columnName === '' && isCustomElement) {
                    columnName = this.getColumnName(curElement);
                    curElement.setAttribute('name', columnName);
                }
                if (keyNames.indexOf(columnName) !== -1) {
                    this.setValueToElement(curElement as HTMLElement, eventObj[columnName] as string);
                } else {
                    this.setDefaultValueToElement(curElement as HTMLElement);
                }
            }
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            this.onAllDayChange(eventObj[this.fields.isAllDay] as boolean);
            let timezoneObj: CheckBox = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD) as CheckBox;
            if (!(isNullOrUndefined(eventObj[this.fields.startTimezone]) && isNullOrUndefined(eventObj[this.fields.endTimezone]))) {
                timezoneObj.checked = true;
                timezoneObj.dataBind();
            }
            this.timezoneChangeStyle(timezoneObj.checked);
            delete eventObj.Timezone;
        }
    }

    private getColumnName(element: HTMLInputElement): string {
        let isDropDownList: boolean = element.classList.contains('e-dropdownlist');
        let inputCollection: HTMLInputElement[] = isDropDownList ? [].slice.call(element.parentElement.children) :
            [].slice.call(element.parentElement.parentElement.children);
        let collection: HTMLInputElement[] = inputCollection.filter((item: HTMLInputElement) => item.name);
        return (collection.length > 0) ? collection[0].name : '';
    }

    private onAllDayChange(allDayStatus: boolean): void {
        let startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
        let endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
        let timezoneDiv: HTMLElement = this.element.querySelector('.e-time-zone-container') as HTMLElement;
        let format: string;
        if (allDayStatus) {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') : this.parent.dateFormat;
            addClass(this.element.querySelectorAll('.e-time-icon'), cls.EVENT_WINDOW_ICON_DISABLE_CLASS);
            addClass([timezoneDiv], cls.DISABLE_CLASS);
            if (this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)) {
                removeClass([this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], cls.ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        } else {
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') + ' ' + this.getFormat('timeFormats') :
                this.parent.dateFormat + ' ' + this.getFormat('timeFormats');
            removeClass(this.element.querySelectorAll('.e-time-icon'), cls.EVENT_WINDOW_ICON_DISABLE_CLASS);
            removeClass([timezoneDiv], cls.DISABLE_CLASS);
            if ((this.element.querySelector('.e-checkbox-wrapper .e-time-zone') as HTMLInputElement).checked) {
                addClass([this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS)], cls.ENABLE_CLASS);
            }
            startObj.format = endObj.format = format;
        }
        if (this.cellClickAction) { this.updateDateTime(allDayStatus, startObj, endObj); }
        startObj.dataBind();
        endObj.dataBind();
    }

    private updateDateTime(allDayStatus: boolean, startObj: DateTimePicker, endObj: DateTimePicker): void {
        let startDate: Date; let endDate: Date;
        if (allDayStatus) {
            startDate = util.resetTime(new Date(this.parent.activeCellsData.startTime.getTime()));
            if (this.parent.activeCellsData.isAllDay) {
                let temp: number = util.addDays(new Date((<Date>this.parent.activeCellsData.endTime).getTime()), -1).getTime();
                endDate = (+this.parent.activeCellsData.startTime > temp) ? this.parent.activeCellsData.endTime : new Date(temp);
            } else {
                endDate = util.resetTime(new Date(this.parent.activeCellsData.endTime.getTime()));
            }
        } else {
            startDate = new Date(this.parent.activeCellsData.startTime.getTime());
            if (this.parent.currentView === 'Month' || this.parent.currentView === 'MonthAgenda' || this.parent.activeCellsData.isAllDay) {
                let startHour: Date = this.parent.globalize.parseDate(this.parent.workHours.start, { skeleton: 'Hm' });
                startDate.setHours(startHour.getHours(), startHour.getMinutes(), startHour.getSeconds());
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(util.MS_PER_MINUTE * this.getSlotDuration());
            } else {
                endDate = new Date(this.parent.activeCellsData.endTime.getTime());
            }
        }
        startObj.value = startDate;
        endObj.value = endDate;
        startObj.dataBind();
        endObj.dataBind();
    }

    private getFormat(formatType: string): string {
        let format: string;
        if (this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject());
        } else {
            format = getValue('main.' + '' + this.parent.locale + '.dates.calendars.gregorian.' + formatType + '.short', cldrData);
        }
        return format;
    }

    private onEventDetailsUpdate(eventObj: { [key: string]: Object }): void {
        if (!this.parent.isAdaptive) {
            removeClass([this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS)], cls.DISABLE_CLASS);
        }
        this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('editEvent');
        this.element.querySelector('.' + cls.FORM_CLASS).setAttribute('data-id', eventObj[this.fields.id].toString());
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            eventObj = <{ [key: string]: Object }>extend({}, eventObj, null, true);
            let timezoneObj: CheckBox = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD) as CheckBox;
            let timezoneValue: boolean;
            if (eventObj[this.fields.startTimezone] || eventObj[this.fields.endTimezone]) {
                timezoneValue = true;
                this.parent.eventBase.timezoneConvert(eventObj);
            } else {
                timezoneValue = false;
            }
            eventObj.Timezone = timezoneValue;
            timezoneObj.checked = timezoneValue;
            timezoneObj.dataBind();
        }
        this.showDetails(eventObj);
        if (eventObj[this.fields.recurrenceRule] && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(<string>eventObj[this.fields.recurrenceRule], <Date>eventObj[this.fields.startTime]);
        } else if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule('');
        }
        this.repeatStartDate = <Date>eventObj[this.fields.startTime];
        this.repeatRule = '';
        if (eventObj[this.fields.recurrenceRule]) {
            if (this.recurrenceEditor) {
                this.recurrenceEditor.setRecurrenceRule(
                    <string>eventObj[this.fields.recurrenceRule], <Date>eventObj[this.fields.startTime]);
            }
            this.repeatRule = <string>eventObj[this.fields.recurrenceRule];
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            let element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule]) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            } else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        }
        if (this.parent.readonly && !this.parent.isAdaptive) {
            let saveButton: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            ((saveButton as EJ2Instance).ej2_instances[0] as Button).disabled = true;
            let deleteButton: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_DELETE_BUTTON_CLASS);
            ((deleteButton as EJ2Instance).ej2_instances[0] as Button).disabled = true;
        }
        this.dialogObject.show();
    }

    private renderRecurrenceEditor(): RecurrenceEditor {
        return new RecurrenceEditor({
            cssClass: this.parent.cssClass,
            dateFormat: this.parent.dateFormat,
            enableRtl: this.parent.enableRtl,
            firstDayOfWeek: this.parent.firstDayOfWeek,
            locale: this.parent.locale
        });
    }

    private updateRepeatLabel(repeatRule: string): void {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        let data: string = repeatRule ?
            (this.l10n.getConstant('repeats') + ' ' + this.recurrenceEditor.getRuleSummary(repeatRule)) : this.l10n.getConstant('repeat');
        this.repeatStatus.setProperties({ label: data });
    }

    private dialogClose(): void {
        this.dialogObject.hide();
        this.fieldValidator.destroyToolTip();
        this.resetFormFields();
        if (!this.parent.isAdaptive && this.recurrenceEditor) {
            this.recurrenceEditor.resetFields();
        }
    }

    private timezoneChangeStyle(value: boolean): void {
        let timezoneDiv: HTMLElement = this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS) as HTMLElement;
        if (value) {
            addClass([timezoneDiv], cls.ENABLE_CLASS);
            let startTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_START_TZ_CLASS) as DropDownList;
            let endTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_END_TZ_CLASS) as DropDownList;
            let timezone: { [key: string]: Object; }[] = startTimezoneObj.dataSource as { [key: string]: Object; }[];
            if (!startTimezoneObj.value || !this.parent.timezone) {
                let found: boolean = timezone.some((tz: { [key: string]: Object }) => { return tz.Value === this.localTimezoneName; });
                if (!found) {
                    timezone.push({ Value: this.localTimezoneName, Text: this.localTimezoneName });
                    startTimezoneObj.dataSource = timezone;
                    endTimezoneObj.dataSource = timezone;
                    startTimezoneObj.dataBind();
                    endTimezoneObj.dataBind();
                }
            }
            startTimezoneObj.value = startTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            endTimezoneObj.value = endTimezoneObj.value || this.parent.timezone || this.localTimezoneName;
            startTimezoneObj.dataBind();
            endTimezoneObj.dataBind();
        } else {
            removeClass([timezoneDiv], cls.ENABLE_CLASS);
        }
    }

    private resetFormFields(): void {
        let formelement: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (let index: number = 0, len: number = formelement.length; index < len; index++) {
            let columnName: string = formelement[index].name;
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                this.setDefaultValueToElement(formelement[index] as HTMLElement);
            }
        }
    }

    public eventSave(alert?: string): void {
        let alertType: string;
        let formElement: Element = this.element.querySelector('.' + cls.FORM_CLASS);
        if (formElement && formElement.classList.contains('e-formvalidator') &&
            !((formElement as EJ2Instance).ej2_instances[0] as FormValidator).validate()) {
            return;
        }
        let eventObj: { [key: string]: Object } =
            extend({}, this.getObjectFromFormData(cls.EVENT_WINDOW_DIALOG_CLASS)) as { [key: string]: Object };
        if (!eventObj.Timezone) {
            eventObj[this.fields.startTimezone] = null;
            eventObj[this.fields.endTimezone] = null;
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            delete eventObj.Timezone;
            delete eventObj.Repeat;
            if (!eventObj[this.fields.startTime] || !eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('invalidDateError');
                return;
            }
            if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('startEndError');
                return;
            }
        }
        if (this.recurrenceEditor && this.recurrenceEditor.value && this.recurrenceEditor.value !== '') {
            alertType = this.recurrenceValidation(<Date>eventObj[this.fields.startTime], <Date>eventObj[this.fields.endTime], alert);
            if (!isNullOrUndefined(alertType)) {
                this.parent.quickPopup.openRecurrenceValidationAlert(alertType);
                return;
            }
        }
        let eventId: string = this.getEventIdFromForm();
        this.setDefaultValueToObject(eventObj);
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.startTime] = util.resetTime(new Date((<Date>eventObj[this.fields.startTime]).getTime()));
            eventObj[this.fields.endTime] = util.addDays(util.resetTime(new Date((<Date>eventObj[this.fields.endTime]).getTime())), 1);
        }
        let ruleData: string = this.recurrenceEditor ? this.recurrenceEditor.getRecurrenceRule() : null;
        eventObj[this.fields.recurrenceRule] = ruleData ? ruleData : undefined;
        let isResourceEventExpand: boolean = (this.parent.activeViewOptions.group.resources.length > 0 || this.parent.resources.length > 0)
            && !this.parent.activeViewOptions.group.allowGroupEdit;
        if (!isNullOrUndefined(eventId)) {
            let eveId: number | string = this.parent.eventBase.getEventIDType() === 'string' ? eventId : parseInt(eventId, 10);
            let editedData: { [key: string]: Object } = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
                where(this.fields.id, 'equal', eveId))[0] as { [key: string]: Object };
            eventObj = extend({}, editedData, eventObj) as { [key: string]: Object };
            let currentAction: CurrentAction;
            if (!isNullOrUndefined(editedData[this.fields.recurrenceRule])) {
                currentAction = this.parent.currentAction;
                if (this.parent.currentAction === 'EditOccurrence') {
                    if (!eventObj[this.fields.recurrenceID]) {
                        eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                        eventObj.Guid = (<{ [key: string]: Object }>this.parent.activeEventData.event).Guid;
                    } else {
                        eveId = eventObj[this.fields.recurrenceID] as number;
                        currentAction = null;
                    }
                    if (this.editOccurrenceValidation(eveId, eventObj)) {
                        this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                        return;
                    }
                }
                if (this.parent.currentAction === 'EditSeries' || eventObj[this.fields.id] !== editedData[this.fields.id]) {
                    eventObj[this.fields.recurrenceID] = editedData[this.fields.id];
                }
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, 'Save', currentAction);
            } else {
                this.parent.saveEvent(eventObj, currentAction);
            }
        } else {
            this.parent.currentAction = 'Add';
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, this.parent.currentAction);
            } else {
                eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                this.parent.addEvent(eventObj);
            }
        }
        this.dialogObject.hide();
    }

    public getObjectFromFormData(className: string): { [key: string]: Object } {
        let formElement: HTMLInputElement[] = this.getFormElements(className);
        let eventObj: { [key: string]: Object } = {};
        for (let currentElement of formElement) {
            let columnName: string = currentElement.name;
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                eventObj[columnName] = this.getValueFromElement(currentElement as HTMLElement);
            }
        }
        return eventObj;
    }

    public setDefaultValueToObject(eventObj: { [key: string]: Object }): void {
        if (!isNullOrUndefined(eventObj[this.fields.subject])) {
            eventObj[this.fields.subject] = eventObj[this.fields.subject] || this.parent.eventSettings.fields.subject.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.location])) {
            eventObj[this.fields.location] = eventObj[this.fields.location] || this.parent.eventSettings.fields.location.default;
        }
        if (!isNullOrUndefined(eventObj[this.fields.description])) {
            eventObj[this.fields.description] = eventObj[this.fields.description] || this.parent.eventSettings.fields.description.default;
        }
    }

    private recurrenceValidation(startDate: Date, endDate: Date, alert: string): string {
        let alertMessage: string;
        let recEditor: RecurrenceEditor = this.recurrenceEditor;
        let interval: number = (this.getInstance('e-repeat-interval.e-numerictextbox') as NumericTextBox).value;
        if (alert !== this.l10n.getConstant('ok')) {
            if (this.parent.currentAction === 'EditSeries' &&
                !isNullOrUndefined(this.eventData[this.parent.eventFields.recurrenceException])) {
                alertMessage = 'seriesChangeAlert';
            }
            if ((this.getInstance('e-end-on-left .e-ddl .e-dropdownlist') as DropDownList).value === 'until' &&
                (this.getInstance('e-end-on-date .e-datepicker') as DatePicker).value
                < recEditor.startDate) {
                alertMessage = 'wrongPattern';
            }
            if (isNullOrUndefined(alertMessage)) {
                switch (recEditor.value.split(';')[0].split('=')[1]) {
                    case 'DAILY':
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= (interval * 24))) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'WEEKLY':
                        let types: string[] = recEditor.value.split(';')[1].split('=')[1].split(',');
                        let obj: { [key: string]: Object } = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
                        let temp: number[] = [];
                        let tempDiff: number[] = [];
                        for (let index: number = 0; index < types.length * (interval + 1); index++) {
                            temp[index] =
                                (types.length > index) ? <number>obj[types[index]] : temp[index - types.length] + (7 * interval);
                        }
                        let tempvalue: number[] = temp.sort((a: number, b: number) => a - b);
                        for (let index: number = 1; index < tempvalue.length; index++) {
                            tempDiff.push(tempvalue[index] - tempvalue[index - 1]);
                        }
                        if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= Math.min.apply(Math, tempDiff) * 24)
                            || isNullOrUndefined(interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'MONTHLY':
                        if ((this.getInstance('e-month-expander-checkbox-wrapper .e-radio') as RadioButton).checked
                            && [29, 30, 31].indexOf(parseInt(recEditor.value.split(';')[1].split('=')[1], 10)) !== -1) {
                            alertMessage = 'dateValidation';
                        } else if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                    case 'YEARLY':
                        if (endDate.getTime() >= new Date(+startDate).setFullYear(startDate.getFullYear() + interval)) {
                            alertMessage = 'createError';
                        }
                        break;
                }
            }
        } else {
            if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
                alertMessage = 'createError';
            }
            if (isNullOrUndefined(alertMessage)) {
                this.parent.quickPopup.quickDialog.hide();
            }
        }
        return alertMessage;
    }

    private getRecurrenceIndex(recColl: { [key: string]: Object }[], event: { [key: string]: Object }): number {
        let recIndex: number;
        for (let index: number = 0; index < recColl.length; index++) {
            if (event[this.fields.startTime].valueOf() === recColl[index][this.fields.startTime].valueOf()) {
                recIndex = index;
                break;
            }
        }
        return recIndex;
    }
    private trimAllDay(data: { [key: string]: Object }): void {
        if (data[this.fields.isAllDay]) {
            let temp: number = util.addDays(new Date(+data[this.fields.endTime]), -1).getTime();
            data[this.fields.endTime] = (+data[this.fields.startTime] > temp) ? data[this.fields.endTime] : new Date(temp);
        }
    }
    public editOccurrenceValidation(eventId: string | number, currentData: { [key: string]: Object }, editData?: { [key: string]: Object })
        : boolean {
        if (editData === void 0) { editData = this.eventData; }
        let recurColl: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.parent.getOccurrencesByID(eventId);
        let excludedDatas: { [key: string]: Object }[] = new DataManager({ json: this.parent.eventsData }).executeLocal(new Query().
            where(this.fields.recurrenceID, 'equal', eventId)) as { [key: string]: Object }[];
        excludedDatas.map((data: Object) => recurColl.push(extend({}, data) as { [key: string]: Object }));
        currentData = extend({}, currentData) as { [key: string]: Object };
        this.trimAllDay(currentData);
        for (let data of recurColl) {
            this.trimAllDay(data);
        }
        this.parent.eventBase.sortByTime(recurColl);
        let index: number = this.getRecurrenceIndex(recurColl, editData);
        if (isNullOrUndefined(index)) {
            return false;
        }
        if (index === 0) {
            if (!isNullOrUndefined(recurColl[index + 1])) {
                return (!(new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)));
            }
            return false;
        } else {
            if (index === recurColl.length - 1) {
                if (!(new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                    new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0))) {
                    return true;
                }
            } else if (!((new Date(+recurColl[index - 1][this.fields.endTime]).setHours(0, 0, 0, 0) <
                new Date(+currentData[this.fields.startTime]).setHours(0, 0, 0, 0)) &&
                (new Date(+recurColl[index + 1][this.fields.startTime]).setHours(0, 0, 0, 0) >
                    new Date(+currentData[this.fields.endTime]).setHours(0, 0, 0, 0)))) {
                return true;
            }
        }
        return false;
    }

    private resourceSaveEvent(eventObj: { [key: string]: Object }, action?: CurrentAction, currentAction?: CurrentAction): void {
        let lastResouceData: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
        let resourceData: string[] | number[] = eventObj[lastResouceData.field] as string[] | number[];
        resourceData = (resourceData instanceof Array) ? resourceData : [resourceData];
        let lastlevel: TdData[] = this.parent.resourceBase.lastResourceLevel;
        let eventList: { [key: string]: Object }[] = [];
        for (let i: number = 0; i < resourceData.length; i++) {
            let events: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, eventObj, null, true);
            events[this.fields.id] = this.parent.eventBase.getEventMaxID();
            let temp: { [key: string]: Object }[] = [];
            let addValues: Function = () => {
                if (action === 'Save' && i === resourceData.length - 1) {
                    if (temp.length > 0) {
                        temp[0][this.fields.id] = eventObj[this.fields.id];
                        for (let k: number = 1; k < temp.length; k++) {
                            temp[k][this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                            eventList.push(temp[k]);
                            this.parent.saveEvent(temp[0], currentAction);
                        }
                    } else {
                        events[this.fields.id] = eventObj[this.fields.id];
                        this.parent.saveEvent(events, currentAction);
                    }
                } else {
                    if (temp.length > 0) {
                        for (let j: number = 0; j < temp.length; j++) {
                            temp[j][this.fields.id] = this.parent.eventBase.getEventMaxID(j);
                            eventList.push(temp[j]);
                        }
                    } else {
                        events[this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                        eventList.push(events);
                    }
                }
            };
            if (this.parent.activeViewOptions.group.byGroupID && (!isNullOrUndefined(lastlevel))) {
                let lastResource: { [key: string]: Object }[] = lastResouceData.dataSource as { [key: string]: Object }[];
                let index: number = util.findIndexInData(lastResource, lastResouceData.idField, resourceData[i] as string);
                let groupId: object = lastResource[index][lastResouceData.groupIDField];
                let filter: TdData = lastlevel.filter((obj: TdData) => obj.resourceData[lastResouceData.idField] === resourceData[i]).
                    filter((obj: TdData) => obj.resourceData[lastResouceData.groupIDField] === groupId)[0];
                let groupOrder: number[] | string[] = filter.groupOrder;
                for (let index: number = 0; index < this.parent.resourceBase.resourceCollection.length; index++) {
                    let field: string = this.parent.resourceBase.resourceCollection[index].field;
                    events[field] = ((groupOrder[index] as String) instanceof Array) ? groupOrder[index][0] : groupOrder[index];
                }
                addValues();
            } else {
                for (let index: number = 0; index < this.parent.resourceBase.resourceCollection.length - 1; index++) {
                    let field: string = this.parent.resourceBase.resourceCollection[index].field;
                    if (events[field] instanceof Array && (events[field] as Object[]).length > 1) {
                        for (let k: number = 0; k < (events[field] as Object[]).length; k++) {
                            let event: { [key: string]: Object } = <{ [key: string]: Object }>extend({}, events, null, true);
                            event[field] = (eventObj[field] as { [key: string]: Object })[k];
                            event[lastResouceData.field] = resourceData[i];
                            temp.push(event);
                        }
                    } else {
                        if (temp.length === 0) {
                            events[field] = (eventObj[field] instanceof Array) ?
                                (eventObj[field] as { [key: string]: Object })[0] : eventObj[field];
                            events[lastResouceData.field] = resourceData[i];
                        } else {
                            for (let l: number = 0; l < temp.length; l++) {
                                temp[l][field] = (eventObj[field] instanceof Array) ?
                                    (eventObj[field] as { [key: string]: Object })[0] : eventObj[field];
                            }
                        }
                    }
                }
                events[lastResouceData.field] = resourceData[i];
                addValues();
            }
        }
        if (eventList.length > 0) {
            for (let event of eventList) {
                event[this.fields.recurrenceException] = null;
                event[this.fields.recurrenceID] = null;
            }
            this.parent.addEvent(eventList);
        }
    }

    private getEventIdFromForm(): string {
        return this.element.querySelector('.' + cls.FORM_CLASS).getAttribute('data-id');
    }

    private getFormElements(className: string): HTMLInputElement[] {
        if (className === cls.EVENT_WINDOW_DIALOG_CLASS) {
            return [].slice.call(this.element.querySelectorAll('.' + EVENT_FIELD));
        }
        return [].slice.call(this.parent.element.querySelectorAll('.' + className + ' .' + EVENT_FIELD));
    }

    private getValueFromElement(element: HTMLElement): number | string | Date | boolean | string[] | number[] {
        let value: number | string | Date | boolean | string[] | number[];
        if (element.classList.contains('e-datepicker')) {
            value = ((element as EJ2Instance).ej2_instances[0] as DatePicker).value as Date;
        } else if (element.classList.contains('e-datetimepicker')) {
            value = ((element as EJ2Instance).ej2_instances[0] as DateTimePicker).value as Date;
        } else if (element.classList.contains('e-dropdownlist')) {
            value = ((element as EJ2Instance).ej2_instances[0] as DropDownList).value as string | number;
        } else if (element.classList.contains('e-multiselect')) {
            value = ((element as EJ2Instance).ej2_instances[0] as MultiSelect).value as string[] | number[];
        } else if (element.classList.contains('e-checkbox')) {
            value = ((element as EJ2Instance).ej2_instances[0] as CheckBox).checked as boolean;
        } else {
            if ((element as HTMLInputElement).type === 'checkbox') {
                value = (element as HTMLInputElement).checked as boolean;
            } else {
                value = (element as HTMLInputElement).value as string;
            }
        }
        return value;
    }

    private setValueToElement(element: HTMLElement, value: number | string | Date | boolean | number[] | string[]): void {
        if (element.classList.contains('e-datepicker')) {
            let instance: DatePicker = (element as EJ2Instance).ej2_instances[0] as DatePicker;
            instance.value = <Date>value;
            instance.dataBind();
        } else if (element.classList.contains('e-datetimepicker')) {
            let instance: DateTimePicker = (element as EJ2Instance).ej2_instances[0] as DateTimePicker;
            instance.value = <Date>value;
            instance.dataBind();
        } else if (element.classList.contains('e-dropdownlist')) {
            let instance: DropDownList = (element as EJ2Instance).ej2_instances[0] as DropDownList;
            instance.value = <string>value;
            instance.dataBind();
        } else if (element.classList.contains('e-multiselect')) {
            let instance: MultiSelect = (element as EJ2Instance).ej2_instances[0] as MultiSelect;
            instance.value = [];
            instance.value = <string[]>((value instanceof Array) ? value : [value]);
            instance.dataBind();
        } else if (element.classList.contains('e-checkbox')) {
            let instance: CheckBox = (element as EJ2Instance).ej2_instances[0] as CheckBox;
            instance.checked = <boolean>value;
            instance.dataBind();
        } else {
            if ((element as HTMLInputElement).type !== 'checkbox') {
                (element as HTMLInputElement).value = <string>value || '';
            } else {
                (element as HTMLInputElement).checked = <boolean>value;
            }
        }
    }

    private setDefaultValueToElement(element: HTMLElement): void {
        if (element.classList.contains('e-datepicker')) {
            let instance: DatePicker = (element as EJ2Instance).ej2_instances[0] as DatePicker;
            instance.value = new Date();
            instance.dataBind();
        } else if (element.classList.contains('e-datetimepicker')) {
            let instance: DateTimePicker = (element as EJ2Instance).ej2_instances[0] as DateTimePicker;
            instance.value = new Date();
            instance.dataBind();
        } else if (element.classList.contains('e-dropdownlist')) {
            let instance: DropDownList = (element as EJ2Instance).ej2_instances[0] as DropDownList;
            instance.value = null;
            instance.dataBind();
        } else if (element.classList.contains('e-multiselect')) {
            let instance: MultiSelect = (element as EJ2Instance).ej2_instances[0] as MultiSelect;
            instance.value = [];
            instance.dataBind();
        } else if (element.classList.contains('e-checkbox')) {
            let instance: CheckBox = (element as EJ2Instance).ej2_instances[0] as CheckBox;
            instance.checked = false;
            instance.dataBind();
        } else {
            if ((element as HTMLInputElement).type === 'checkbox') {
                (element as HTMLInputElement).checked = false;
            } else {
                (element as HTMLInputElement).value = '';
            }
        }
    }

    private getInstance(className: string): Object {
        return (this.element.querySelector('.' + className) as EJ2Instance).ej2_instances[0];
    }

    private eventDelete(): void {
        switch (this.parent.currentAction) {
            case 'EditOccurrence':
                let fields: EventFieldsMapping = this.parent.eventFields;
                if (!isNullOrUndefined((<{ [key: string]: Object }>this.parent.activeEventData.event)[fields.recurrenceRule])) {
                    this.parent.currentAction = 'DeleteOccurrence';
                } else {
                    this.parent.currentAction = 'Delete';
                }
                break;
            case 'EditSeries':
                this.parent.currentAction = 'DeleteSeries';
                break;
        }
        this.dialogObject.hide();
        this.parent.quickPopup.openDeleteAlert();
    }

    public getRecurrenceEditorInstance(): RecurrenceEditor {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        return this.recurrenceEditor;
    }

    private destroyComponents(): void {
        let formelement: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (let element of formelement) {
            let instance: CheckBox | DatePicker | DateTimePicker | DropDownList | MultiSelect;
            if (element.classList.contains('e-datetimepicker')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as DateTimePicker;
            } else if (element.classList.contains('e-datepicker')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as DatePicker;
            } else if (element.classList.contains('e-checkbox')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as CheckBox;
            } else if (element.classList.contains('e-dropdownlist')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as DropDownList;
            } else if (element.classList.contains('e-multiselect')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as MultiSelect;
            }
            if (instance) {
                instance.destroy();
            }
        }
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
    }

    /**
     * To destroy the event window.
     * @return {void}
     * @private
     */
    public destroy(): void {
        if (this.recurrenceEditor) {
            this.recurrenceEditor.destroy();
        }
        this.destroyComponents();
        this.fieldValidator.destroy();
        if (this.repeatDialogObject) {
            this.repeatDialogObject.destroy();
            remove(this.repeatDialogObject.element);
        }
        if (this.dialogObject) {
            this.dialogObject.destroy();
            this.dialogObject = null;
        }
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
    }
}