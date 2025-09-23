/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, L10n, isNullOrUndefined, addClass, remove, EventHandler, extend, append, EmitType, detach } from '@syncfusion/ej2-base';
import { cldrData, removeClass, getValue, getDefaultDateObject, closest, KeyboardEventArgs, SanitizeHtmlHelper, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { Query, Deferred } from '@syncfusion/ej2-data';
import { CheckBox, ChangeEventArgs, Button } from '@syncfusion/ej2-buttons';
import { Dialog, DialogModel, BeforeOpenEventArgs, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { DropDownList, FilteringEventArgs, MultiSelect, ChangeEventArgs as ddlChangeEventArgs, MultiSelectChangeEventArgs, PopupEventArgs } from '@syncfusion/ej2-dropdowns';
import { Input, FormValidator, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, DateTimePicker, ChangedEventArgs } from '@syncfusion/ej2-calendars';
import { Schedule } from '../base/schedule';
import { EJ2Instance, EventFieldsMapping, PopupOpenEventArgs, TdData, CellClickEventArgs, PopupCloseEventArgs, CallbackFunction } from '../base/interface';
import { CurrentAction } from '../base/type';
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
    private eventData: Record<string, any>;
    private eventCrudData: Record<string, any>;
    private fieldValidator: FieldValidator;
    private recurrenceEditor: RecurrenceEditor;
    private repeatDialogObject: Dialog;
    private repeatTempRule: string;
    private repeatRule: string;
    private repeatStatus: CheckBox;
    private buttonObj: Button;
    private repeatStartDate: Date;
    private cellClickAction: boolean;
    private duration: number;
    private isCrudAction: boolean;
    private eventWindowTime: Record<string, Date>;
    private isEnterKey: boolean;
    private dialogEvent: Event;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fields = this.parent.eventFields;
        this.eventWindowTime = { startTime: new Date(), endTime: new Date() };
        this.renderEventWindow();
    }

    private renderEventWindow(): void {
        this.element = createElement('div', { id: this.parent.element.id + '_dialog_wrapper' });
        this.parent.element.appendChild(this.element);
        const dialogModel: DialogModel = {
            animationSettings: { effect: 'Zoom' },
            content: this.getEventWindowContent(),
            cssClass: cls.EVENT_WINDOW_DIALOG_CLASS,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            height: this.parent.isAdaptive ? '100%' : 'auto',
            minHeight: '300px',
            isModal: true,
            showCloseIcon: this.parent.isAdaptive ? false : true,
            target: document.body,
            visible: false,
            width: '500px',
            beforeOpen: this.onBeforeOpen.bind(this),
            beforeClose: this.onBeforeClose.bind(this)
        };
        if (this.parent.isAdaptive) {
            dialogModel.cssClass = cls.EVENT_WINDOW_DIALOG_CLASS + ' ' + cls.DEVICE_CLASS;
            if (!this.parent.editorHeaderTemplate) {
                dialogModel.header = '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                    this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>';
            }
        } else {
            if (!this.parent.editorFooterTemplate) {
                this.renderDialogButtons(dialogModel);
            }
            if (!this.parent.editorHeaderTemplate) {
                dialogModel.header = '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>';
            }
        }
        this.dialogObject = new Dialog(dialogModel, this.element);
        if (this.dialogObject.element.querySelector('.e-dlg-closeicon-btn')) {
            this.dialogObject.element.querySelector('.e-dlg-closeicon-btn').setAttribute('title', this.l10n.getConstant('close'));
        }
        this.addEventHandlers();
        addClass([this.element.parentElement], cls.EVENT_WINDOW_DIALOG_CLASS + '-container');
        EventHandler.add(this.dialogObject.element, 'keydown', this.preventEventSave, this);
        this.applyFormValidation();
    }

    private renderDialogButtons(dialogButton: DialogModel | Dialog): void {
        dialogButton.buttons = [{
            buttonModel: {
                content: this.l10n.getConstant('deleteButton'), cssClass: cls.DELETE_EVENT_CLASS,
                disabled: !this.parent.eventSettings.allowDeleting || this.parent.readonly
            },
            click: this.eventDelete.bind(this)
        }, {
            buttonModel: {
                content: this.l10n.getConstant('saveButton'), cssClass: 'e-primary ' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS,
                isPrimary: true, disabled: !this.parent.eventSettings.allowAdding || this.parent.readonly
            },
            click: this.eventSave.bind(this)
        }, {
            buttonModel: { cssClass: cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS, content: this.l10n.getConstant('cancelButton') },
            click: this.dialogClose.bind(this)
        }];
    }

    private addEventHandlers(): void {
        const backIcon: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_BACK_ICON_CLASS);
        const saveIcon: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_ICON_CLASS);
        if (this.parent.isAdaptive && !isNullOrUndefined(backIcon) && !isNullOrUndefined(saveIcon)) {
            EventHandler.add(backIcon, 'click', this.dialogClose, this);
            EventHandler.add(saveIcon, 'click', this.eventSave, this);
        }
    }

    public refresh(): void {
        this.destroy(true);
        this.renderEventWindow();
    }

    public refreshRecurrenceEditor(): void {
        if (this.recurrenceEditor) {
            const recurrenceEditor: HTMLElement = this.recurrenceEditor.element;
            this.recurrenceEditor.destroy();
            this.createRecurrenceEditor(recurrenceEditor);
        }
    }

    public setRecurrenceEditor(recurrenceEditor: RecurrenceEditor): void {
        if (this.parent.editorTemplate) {
            this.recurrenceEditor = recurrenceEditor;
        }
    }

    public openEditor(data: Record<string, any>, type: CurrentAction, isEventData?: boolean, repeatType?: number): void {
        this.parent.currentAction = type;
        this.parent.removeNewEventElement();
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide(true);
        }
        this.parent.inlineModule.removeInlineAppointmentElement();
        if (type === 'Add') {
            let eventObj: Record<string, any> = {};
            this.cellClickAction = !isEventData;
            this.parent.activeCellsData = data as unknown as CellClickEventArgs;
            const event: Record<string, any> = data;
            if (this.cellClickAction) {
                this.convertToEventData(event, eventObj);
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
            data = eventObj;
        }
        if (!isNullOrUndefined(this.parent.editorHeaderTemplate)) {
            this.parent.resetTemplates(['editorHeaderTemplate']);
            if (this.parent.isAdaptive && !this.parent.editorFooterTemplate) {
                this.dialogObject.header = this.createAdaptiveHeaderElement(data);
            } else {
                this.dialogObject.header = this.getDialogHeader(data);
            }
        }
        if (!isNullOrUndefined(this.parent.editorFooterTemplate)) {
            this.parent.resetTemplates(['editorFooterTemplate']);
            this.dialogObject.footerTemplate = this.getDialogFooter(data);
        }
        if (!isNullOrUndefined(this.parent.editorHeaderTemplate) || !isNullOrUndefined(this.parent.editorFooterTemplate)) {
            this.dialogObject.dataBind();
            this.addEventHandlers();
        }
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            this.renderFormElements(this.element.querySelector('.e-schedule-form'), data, type, repeatType);
        } else {
            this.setEditorContent(data, type, repeatType);
        }
    }

    private setEditorContent(data: Record<string, any>, type: CurrentAction, repeatType: number): void {
        if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            removeClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.firstDayOfWeek = this.parent.activeViewOptions.firstDayOfWeek;
        }
        switch (type) {
        case 'Add':
            this.onCellDetailsUpdate(data, repeatType);
            break;
        case 'Save':
        case 'EditOccurrence':
        case 'EditSeries':
        case 'EditFollowingEvents':
            if (type === 'EditOccurrence' && !this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
                addClass([this.dialogObject.element.querySelector('.e-recurrenceeditor')], cls.DISABLE_CLASS);
            }
            this.cellClickAction = false;
            this.onEventDetailsUpdate(data);
            break;
        }
    }

    public setDialogContent(): void {
        this.dialogObject.content = this.getEventWindowContent();
        this.dialogObject.dataBind();
        this.applyFormValidation();
    }
    public setDialogHeader(): void {
        if (!isNullOrUndefined(this.parent.editorHeaderTemplate)) {
            this.parent.resetTemplates(['editorHeaderTemplate']);
            if (this.parent.isAdaptive && !this.parent.editorFooterTemplate) {
                this.dialogObject.header = this.createAdaptiveHeaderElement();
            }
            else {
                this.dialogObject.header = this.getDialogHeader();
            }
        } else if (this.parent.isAdaptive) {
            this.dialogObject.header = '<div class="e-title-header"><div class="e-back-icon e-icons"></div><div class="e-title-text">' +
                this.l10n.getConstant('newEvent') + '</div><div class="e-save-icon e-icons"></div></div>';
        } else {
            this.dialogObject.header = '<div class="e-title-text">' + this.l10n.getConstant('newEvent') + '</div>';
        }
        this.dialogObject.dataBind();
        this.addEventHandlers();
    }
    public setDialogFooter(): void {
        if (!isNullOrUndefined(this.parent.editorFooterTemplate)) {
            this.parent.resetTemplates(['editorFooterTemplate']);
            this.dialogObject.footerTemplate = this.getDialogFooter();
        } else if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorFooterTemplate)) {
            this.renderDialogButtons(this.dialogObject);
        } else if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorFooterTemplate)) {
            this.dialogObject.footerTemplate = null;
        }
        this.dialogObject.dataBind();
    }

    private createAdaptiveHeaderElement(data?: Record<string, any>): HTMLElement {
        const header: HTMLElement = createElement('div', { className: 'e-title-header' });
        const headerBackIcon: HTMLElement = createElement('div', { className: 'e-back-icon e-icons' });
        header.appendChild(headerBackIcon);
        const headerTemplate: HTMLElement = this.getDialogHeader(data);
        header.appendChild(headerTemplate);
        const headerSaveIcon: HTMLElement = createElement('div', { className: 'e-save-icon e-icons' });
        header.appendChild(headerSaveIcon);
        return header;
    }
    private getDialogHeader(args?: Record<string, any>): HTMLElement {
        let headerTemplate: Element[] = [];
        const headerTemplateId: string = this.parent.element.id + '_editorHeaderTemplate';
        const temHeaderDiv: HTMLElement = document.createElement('div');
        headerTemplate = [].slice.call(this.parent.getEditorHeaderTemplate()(args || {}, this.parent, 'editorHeaderTemplate', headerTemplateId, false));
        append(headerTemplate, temHeaderDiv);
        return temHeaderDiv;
    }

    private getDialogFooter(args?: Record<string, any>): HTMLElement {
        let footerTemplate: Element[] = [];
        const footerTemplateId: string = this.parent.element.id + '_editorFooterTemplate';
        const temFooterDiv: HTMLElement = document.createElement('div');
        footerTemplate = [].slice.call(this.parent.getEditorFooterTemplate()(args || {}, this.parent, 'editorFooterTemplate', footerTemplateId, false));
        append(footerTemplate, temFooterDiv);
        return temFooterDiv;
    }

    private preventEventSave(e: KeyboardEventArgs): void {
        if (this.parent && !this.parent.allowKeyboardInteraction && (e as KeyboardEventArgs).code === 'Enter') {
            this.isEnterKey = true;
        }
    }

    private onBeforeOpen(args: BeforeOpenEventArgs): Deferred {
        const endTime: number = this.eventData[this.fields.endTime].getTime();
        const eventProp: PopupOpenEventArgs = {
            type: 'Editor',
            data: this.eventData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element) as HTMLElement
        };
        if (this.cellClickAction) {
            eventProp.duration = this.getSlotDuration();
        }
        const saveObj: Button = this.getInstance(cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as unknown as Button;
        if (saveObj) {
            saveObj.disabled = !(this.cellClickAction ? this.parent.eventSettings.allowAdding : this.parent.eventSettings.allowEditing);
            saveObj.dataBind();
        }
        const deleteObj: Button = this.getInstance(cls.DELETE_EVENT_CLASS) as unknown as Button;
        if (deleteObj) {
            deleteObj.disabled = !this.parent.eventSettings.allowDeleting;
            deleteObj.dataBind();
        }
        const callBackPromise: Deferred = new Deferred();
        this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
            args.cancel = popupArgs.cancel;
            args.maxHeight = this.parent.isAdaptive ? 'max-content' : args.maxHeight;
            this.duration = this.cellClickAction ? popupArgs.duration : null;
            if (this.eventData[this.fields.endTime].getTime() === endTime && !this.cellClickAction &&
                (<Date>this.eventData[this.fields.endTime]).getHours() === 0 &&
                (<Date>this.eventData[this.fields.endTime]).getMinutes() === 0) {
                this.eventData = <Record<string, any>>extend({}, this.eventData, null, true);
                this.trimAllDay(this.eventData);
            }
            this.refreshDateTimePicker(this.duration);
            if (this.cellClickAction && popupArgs.duration !== this.getSlotDuration() && isNullOrUndefined(this.parent.editorTemplate)) {
                const startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as unknown as DateTimePicker;
                const endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as unknown as DateTimePicker;
                endObj.value = new Date(startObj.value.getTime() + (util.MS_PER_MINUTE * popupArgs.duration));
                endObj.dataBind();
            }
            if (this.parent.editorTemplate && this.element.querySelector('.e-recurrenceeditor') && !this.recurrenceEditor) {
                this.recurrenceEditor = this.getInstance('e-recurrenceeditor') as unknown as RecurrenceEditor;
            }
            callBackPromise.resolve(args);
        });
        return callBackPromise;
    }

    private onBeforeClose(args: BeforeCloseEventArgs): Deferred {
        if (args.isInteracted) {
            this.isCrudAction = false;
        }
        const eventProp: PopupCloseEventArgs = {
            type: 'Editor',
            event: args.event || this.dialogEvent,
            data: this.eventCrudData,
            cancel: false,
            element: this.element,
            target: (this.cellClickAction ? this.parent.activeCellsData.element : this.parent.activeEventData.element) as HTMLElement
        };
        const callBackPromise: Deferred = new Deferred();
        this.parent.trigger(event.popupClose, eventProp, (popupArgs: PopupCloseEventArgs) => {
            args.cancel = popupArgs.cancel;
            if (!popupArgs.cancel) {
                if (this.isCrudAction) {
                    args.cancel = this.processCrudActions(popupArgs.data);
                    this.isCrudAction = args.cancel;
                }
                if (!this.isCrudAction) {
                    this.resetForm();
                    this.parent.eventBase.focusElement(true);
                    this.eventCrudData = null;
                }
            }
            callBackPromise.resolve(args);
        });
        return callBackPromise;
    }

    private getEventWindowContent(): HTMLElement {
        const container: HTMLElement = createElement('div', { className: cls.FORM_CONTAINER_CLASS });
        const form: HTMLFormElement = createElement('form', {
            id: this.parent.element.id + 'EditForm',
            className: cls.FORM_CLASS
        }) as HTMLFormElement;
        form.onsubmit = () => { return false; };
        this.renderFormElements(form);
        container.appendChild(form);
        return container;
    }

    private renderFormElements(form: HTMLFormElement, args?: Record<string, any>, type?: CurrentAction, repeatType?: number): void {
        if (!isNullOrUndefined(this.parent.editorTemplate)) {
            if (args) {
                if (this.fieldValidator) {
                    this.fieldValidator.destroy();
                    this.fieldValidator = null;
                }
                if (this.recurrenceEditor) {
                    this.recurrenceEditor.destroy();
                    this.recurrenceEditor = null;
                }
                this.destroyComponents();
                this.parent.resetTemplates(['editorTemplate']);
                EventHandler.clearEvents(form);
                if (!this.parent.isReact) {
                    const formElements: HTMLElement[] = [].slice.call(form.children);
                    for (const element of formElements) {
                        remove(element);
                    }
                }
            }
            const templateId: string = this.parent.element.id + '_editorTemplate';
            const tempEle: HTMLElement[] =
                [].slice.call(this.parent.getEditorTemplate()(args || {}, this.parent, 'editorTemplate', templateId, false));
            append(tempEle, form);
            this.parent.renderTemplates(() => {
                if (this.element) {
                    this.applyFormValidation();
                    if (args) {
                        this.setEditorContent(args, type, repeatType);
                    }
                }
            });
        } else {
            form.appendChild(this.getDefaultEventWindowContent());
            if (args) {
                this.setEditorContent(args, type, repeatType);
            }
        }
    }

    private getDefaultEventWindowContent(): HTMLElement {
        const parentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_DIALOG_PARENT_CLASS);
        const titleLocationDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_TITLE_LOCATION_DIV_CLASS);
        parentDiv.appendChild(titleLocationDiv);
        titleLocationDiv.appendChild(this.renderTextBox(cls.SUBJECT_CLASS));
        titleLocationDiv.appendChild(this.renderTextBox(cls.LOCATION_CLASS));
        const startEndDateTimeDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_START_END_DIV_CLASS);
        parentDiv.appendChild(startEndDateTimeDiv);
        startEndDateTimeDiv.appendChild(this.renderDateTimePicker(cls.EVENT_WINDOW_START_CLASS, this.onTimeChange.bind(this)));
        startEndDateTimeDiv.appendChild(this.renderDateTimePicker(cls.EVENT_WINDOW_END_CLASS));
        const allDayTimezoneDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_ALLDAY_TZ_DIV_CLASS);
        parentDiv.appendChild(allDayTimezoneDiv);
        allDayTimezoneDiv.appendChild(this.renderCheckBox(cls.EVENT_WINDOW_ALL_DAY_CLASS));
        allDayTimezoneDiv.appendChild(this.renderCheckBox(cls.TIME_ZONE_CLASS));
        const timezoneParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS);
        parentDiv.appendChild(timezoneParentDiv);
        timezoneParentDiv.appendChild(this.renderDropDown(cls.EVENT_WINDOW_START_TZ_CLASS));
        timezoneParentDiv.appendChild(this.renderDropDown(cls.EVENT_WINDOW_END_TZ_CLASS));
        const repeatParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_REPEAT_DIV_CLASS);
        parentDiv.appendChild(repeatParentDiv);
        const repeatDiv: HTMLElement = this.renderCheckBox(cls.EVENT_WINDOW_REPEAT_CLASS);
        const repeatEditContainer: HTMLElement = createElement('span', { className: REPEAT_CONTAINER_CLASS });
        const button: HTMLElement = createElement('button', {
            className: REPEAT_BUTTON_CLASS,
            attrs: { type: 'button', 'title': this.l10n.getConstant('editRecurrence') }
        });
        this.buttonObj = new Button({ iconCss: REPEAT_BUTTON_ICON_CLASS + ' e-icons', cssClass: 'e-medium ' + this.parent.cssClass });
        repeatEditContainer.appendChild(button);
        this.buttonObj.appendTo(button);
        repeatDiv.appendChild(repeatEditContainer);
        repeatParentDiv.appendChild(repeatDiv);
        if (this.parent.isAdaptive) {
            EventHandler.add(button, 'click', this.loadRecurrenceEditor, this);
        } else {
            this.createRecurrenceEditor(parentDiv);
        }
        if (this.parent.resourceCollection.length > 0) {
            const resourceParentDiv: HTMLElement = this.createDivElement(cls.EVENT_WINDOW_RESOURCES_DIV_CLASS);
            for (const resource of this.parent.resourceBase.resourceCollection) {
                resourceParentDiv.appendChild(this.renderResourceDetails(resource));
            }
            parentDiv.appendChild(resourceParentDiv);
        }
        const description: HTMLElement = this.createDivElement(cls.DESCRIPTION_CLASS + '-row');
        description.appendChild(this.renderTextBox(cls.DESCRIPTION_CLASS));
        parentDiv.appendChild(description);
        const submit: HTMLElement = createElement('button', { attrs: { type: 'hidden', title: 'submit' } });
        submit.style.display = 'none';
        parentDiv.appendChild(submit);
        return parentDiv;
    }

    private createRecurrenceEditor(parentDiv: HTMLElement): void {
        const recurrenceEditor: HTMLElement = createElement('div', { id: this.parent.element.id + '_recurrence_editor' });
        parentDiv.appendChild(recurrenceEditor);
        this.recurrenceEditor = this.renderRecurrenceEditor();
        this.recurrenceEditor.appendTo(recurrenceEditor);
        this.updateMinMaxDateToEditor();
    }

    private createDivElement(className?: string): HTMLElement {
        return createElement('div', { className: className });
    }

    private createInputElement(className: string, fieldName: string, type?: string): HTMLElement {
        return createElement(type || 'input', {
            className: className, attrs: {
                type: 'text', name: fieldName, value: '', id: fieldName
            }
        });
    }

    private getSlotDuration(): number {
        return this.parent.activeViewOptions.timeScale.interval / this.parent.activeViewOptions.timeScale.slotCount;
    }

    private renderDateTimePicker(value: string, changeEvent?: EmitType<ChangedEventArgs>): HTMLElement {
        const dateTimeDiv: HTMLElement = this.createDivElement(value + '-container');
        const fieldName: string = this.getFieldName(value);
        const dateTimeInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        dateTimeDiv.appendChild(dateTimeInput);
        const dateTimePicker: DateTimePicker = new DateTimePicker({
            change: changeEvent,
            firstDayOfWeek: this.parent.activeViewOptions.firstDayOfWeek,
            calendarMode: this.parent.calendarMode,
            min: this.parent.minDate,
            max: new Date(new Date(+this.parent.maxDate).setHours(23, 59, 59)),
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            floatLabelType: 'Always',
            strictMode: true,
            timeFormat: this.parent.activeViewOptions.timeFormat,
            format: (isNullOrUndefined(this.parent.dateFormat) ?
                this.getFormat('dateFormats') : this.parent.dateFormat) + ' ' + this.parent.activeViewOptions.timeFormat,
            placeholder: this.getFieldLabel(value),
            step: this.getSlotDuration(),
            width: '100%'
        });
        dateTimePicker.appendTo(dateTimeInput);
        return dateTimeDiv;
    }

    public refreshDateTimePicker(duration?: number): void {
        const elementSelector: string = '.' + cls.EVENT_WINDOW_START_CLASS + ',.' + cls.EVENT_WINDOW_END_CLASS;
        const startEndElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll(elementSelector));
        for (const element of startEndElement) {
            const instance: DateTimePicker = ((<HTMLElement>element) as EJ2Instance).ej2_instances[0] as DateTimePicker;
            instance.firstDayOfWeek = this.parent.activeViewOptions.firstDayOfWeek;
            instance.timeFormat = this.parent.activeViewOptions.timeFormat;
            instance.step = duration || this.getSlotDuration();
            instance.dataBind();
        }
    }

    private onTimeChange(): void {
        const startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as unknown as DateTimePicker;
        if (startObj.element.parentElement.classList.contains('e-input-focus')) {
            const endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as unknown as DateTimePicker;
            let duration: number = 0;
            if (this.cellClickAction) {
                duration = util.MS_PER_MINUTE * this.duration;
                this.eventWindowTime.startTime = startObj.value;
            } else {
                duration = (<Date>this.eventData[this.fields.endTime]).getTime() - (<Date>this.eventData[this.fields.startTime]).getTime();
            }
            const endDate: Date = (isNullOrUndefined(startObj.value)) ? null : new Date(startObj.value.getTime() + duration);
            if (this.cellClickAction) {
                this.eventWindowTime.endTime = endDate;
            }
            endObj.value = endDate;
            endObj.dataBind();
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.updateRuleUntilDate(this.eventWindowTime.startTime);
        }
    }

    private renderResourceDetails(resourceData: ResourcesModel): HTMLElement {
        const fieldName: string = resourceData.field;
        const value: string = 'e-' + fieldName;
        const labelValue: string = resourceData.title;
        const resourceDiv: HTMLElement = this.createDivElement(value + '-container' + ' ' + 'e-resources');
        const resourceInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        resourceDiv.appendChild(resourceInput);
        const resourceTemplate: Function = function(data: any): string {
            return SanitizeHtmlHelper.sanitize(`<div class="e-resource-template">
                <div class="e-resource-color" data-resource-color="${data[resourceData.colorField]}"></div>
                <div class="e-resource-text">${data[resourceData.textField]}</div></div>`);
        };
        initializeCSPTemplate(resourceTemplate, resourceData);
        if (resourceData.allowMultiple) {
            const listObj: MultiSelect = new MultiSelect({
                enableRtl: this.parent.enableRtl,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                cssClass: this.parent.cssClass || '',
                dataSource: resourceData.dataSource as Record<string, any>[],
                change: this.onMultiselectResourceChange.bind(this),
                itemTemplate: resourceTemplate as any,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: {'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                mode: 'Box',
                open: (args: PopupEventArgs) => {
                    Promise.resolve().then(() => {
                        this.applyStylesAfterRender(args);
                    });
                }
            });
            listObj.appendTo(resourceInput);
        } else {
            const dropDownList: DropDownList = new DropDownList({
                cssClass: this.parent.cssClass || '',
                change: this.onDropdownResourceChange.bind(this),
                dataSource: resourceData.dataSource as Record<string, any>[],
                enableRtl: this.parent.enableRtl,
                fields: {
                    text: resourceData.textField,
                    value: resourceData.idField
                },
                htmlAttributes: { 'name': fieldName },
                floatLabelType: 'Always',
                placeholder: labelValue,
                popupHeight: '230px',
                popupWidth: '447px',
                itemTemplate: resourceTemplate as any,
                open: (args: PopupEventArgs) => {
                    Promise.resolve().then(() => {
                        this.applyStylesAfterRender(args);
                    });
                }
            });
            dropDownList.appendTo(resourceInput);
        }
        return resourceDiv;
    }

    private applyStylesAfterRender(args: PopupEventArgs): void {
        if (!args.popup || !args.popup.element) { return; }
        const resourceColors: NodeListOf<Element> = args.popup.element.querySelectorAll('.e-resource-color[data-resource-color]');
        resourceColors.forEach((element: Element) => {
            const color: string = element.getAttribute('data-resource-color');
            if (color) {
                (element as HTMLElement).style.backgroundColor = color;
            }
        });
    }

    private renderDropDown(value: string): HTMLElement {
        const fieldName: string = this.getFieldName(value);
        const timezoneDiv: HTMLElement = this.createDivElement(value + '-container');
        const timezoneInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        timezoneDiv.appendChild(timezoneInput);
        const dropDownList: DropDownList = new DropDownList({
            allowFiltering: true,
            change: this.onTimezoneChange.bind(this),
            cssClass: this.parent.cssClass || '',
            dataSource: this.parent.timezoneDataSource as any[],
            enableRtl: this.parent.enableRtl,
            fields: { text: 'Text', value: 'Value' },
            filterBarPlaceholder: this.parent.localeObj.getConstant('searchTimezone'),
            noRecordsTemplate: this.parent.localeObj.getConstant('noRecords'),
            filtering: (e: FilteringEventArgs) => {
                let query: Query = new Query();
                query = (e.text !== '') ? query.where('Text', 'contains', e.text, true) : query;
                e.updateData(this.parent.timezoneDataSource as any[], query);
            },
            htmlAttributes: { 'title': this.getFieldLabel(value), 'name': fieldName },
            floatLabelType: 'Always',
            placeholder: this.getFieldLabel(value),
            popupHeight: '230px'
        });
        dropDownList.appendTo(timezoneInput);
        return timezoneDiv;
    }

    private onMultiselectResourceChange(args: MultiSelectChangeEventArgs): void {
        if (!args.value || !this.parent.activeViewOptions.group.byGroupID || this.parent.resourceCollection.length <= 1) {
            return;
        }
        const resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        const fieldName: string = args.element.getAttribute('name') || this.getColumnName(args.element as HTMLInputElement);
        for (let i: number = 0; i < resourceCollection.length; i++) {
            if (resourceCollection[parseInt(i.toString(), 10)].field === fieldName && i < resourceCollection.length - 1) {
                const resObject: MultiSelect | DropDownList = this.createInstance(i);
                let datasource: Record<string, any>[] = [];
                for (let j: number = 0; j < args.value.length; j++) {
                    const resourceModel: ResourcesModel = resourceCollection[i + 1];
                    // eslint-disable-next-line max-len
                    const filter: Record<string, any> = (resourceModel.dataSource as Record<string, any>[]).filter((data: Record<string, any>) =>
                        data[resourceModel.groupIDField] === args.value[parseInt(j.toString(), 10)])[0];
                    const groupId: number = (!isNullOrUndefined(filter)) ?
                        filter[resourceCollection[i + 1].groupIDField] as number : null;
                    const filterRes: Record<string, any>[] = this.filterDatasource(i, groupId);
                    datasource = datasource.concat(filterRes);
                }
                resObject.dataSource = datasource;
                resObject.dataBind();
            }
        }
    }

    private createInstance(index: number): MultiSelect | DropDownList {
        const resourceData: Record<string, any> = this.parent.resourceBase.resourceCollection[index + 1] as Record<string, any>;
        const resObject: MultiSelect | DropDownList = (this.element.querySelector('.e-' + resourceData.field) as EJ2Instance).
            ej2_instances[0] as MultiSelect | DropDownList;
        resObject.clear();
        return resObject;
    }

    private onDropdownResourceChange(args: ddlChangeEventArgs): void {
        if (!args.value || this.parent.resourceCollection.length <= 1 || !this.parent.activeViewOptions.group.byGroupID) {
            return;
        }
        const fieldName: string = args.element.getAttribute('name') || this.getColumnName(args.element as HTMLInputElement);
        const resourceCollection: ResourcesModel[] = this.parent.resourceBase.resourceCollection;
        for (let i: number = 0; i < resourceCollection.length; i++) {
            if ((i < resourceCollection.length - 1) && resourceCollection[parseInt(i.toString(), 10)].field === fieldName) {
                const resObj: MultiSelect | DropDownList = this.createInstance(i);
                const groupId: number =
                    (args.itemData as Record<string, any>)[resourceCollection[parseInt(i.toString(), 10)].idField] as number;
                resObj.dataSource = this.filterDatasource(i, groupId);
                resObj.dataBind();
                const resValue: string = (resObj.dataSource.length > 0) ?
                    resObj.dataSource[0][resourceCollection[i + 1].idField] as string : null;
                resObj.value = (resourceCollection[i + 1].allowMultiple) ? [resValue] : resValue;
                resObj.dataBind();
            }
        }
    }

    private filterDatasource(index: number, groupId: number | string): Record<string, any>[] {
        const resourceData: ResourcesModel = this.parent.resourceBase.resourceCollection[index + 1];
        return (resourceData.dataSource as Record<string, any>[]).filter((data: Record<string, any>) =>
            data[resourceData.groupIDField] === groupId);
    }

    private onTimezoneChange(args: ddlChangeEventArgs): void {
        const fieldName: string = args.element.getAttribute('name') || this.getColumnName(args.element as HTMLInputElement);
        if (fieldName === this.parent.eventFields.startTimezone) {
            const startTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_START_TZ_CLASS) as unknown as DropDownList;
            const endTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_END_TZ_CLASS) as unknown as DropDownList;
            endTimezoneObj.value = startTimezoneObj.value;
            endTimezoneObj.dataBind();
        }
    }

    private renderCheckBox(value: string): HTMLElement {
        const checkBoxDiv: HTMLElement = this.createDivElement(value + '-container');
        const fieldName: string = this.getFieldName(value);
        const checkBoxInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName);
        checkBoxDiv.appendChild(checkBoxInput);
        const checkBox: CheckBox = new CheckBox({
            change: this.onChange.bind(this),
            cssClass: value + ' ' + this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
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
        const textBoxDiv: HTMLElement = this.createDivElement(value + '-container');
        const fieldName: string = this.getFieldName(value);
        const elementType: string = (value === cls.DESCRIPTION_CLASS) ? 'textarea' : 'input';
        const textBoxInput: HTMLElement = this.createInputElement(value + ' ' + EVENT_FIELD, fieldName, elementType);
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
        if (args.event && args.event.target) {
            const targetSelector: string = `.${cls.EVENT_WINDOW_ALL_DAY_CLASS},.${cls.TIME_ZONE_CLASS},.${cls.EVENT_WINDOW_REPEAT_CLASS}`;
            const target: Element = closest(args.event.target as Element, targetSelector);
            if (target.classList.contains(cls.EVENT_WINDOW_ALL_DAY_CLASS)) {
                this.onAllDayChange(args.checked);
            } else if (target.classList.contains(cls.TIME_ZONE_CLASS)) {
                this.timezoneChangeStyle(args.checked);
            } else if (target.classList.contains(cls.EVENT_WINDOW_REPEAT_CLASS)) {
                this.onRepeatChange(args.checked);
            }
        }
    }

    private renderRepeatDialog(): void {
        const element: HTMLElement = createElement('div');
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
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
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
            const element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            addClass([element], HIDE_STYLE_CLASS);
        }
    }

    private repeatSaveDialog(): void {
        this.repeatRule = this.recurrenceEditor.getRecurrenceRule();
        const element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
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

    private onCellDetailsUpdate(eventObj: Record<string, any>, repeatType: number): void {
        if (!this.parent.eventSettings.allowAdding) {
            return;
        }
        if (this.parent.isAdaptive && repeatType && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        this.element.querySelector('.' + cls.FORM_CLASS).removeAttribute('data-id');
        if (isNullOrUndefined(this.parent.editorHeaderTemplate)) {
            this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('newEvent');
        }
        eventObj.Timezone = false;
        this.repeatStartDate = <Date>eventObj[this.fields.startTime];
        this.repeatRule = '';
        if (!isNullOrUndefined(this.parent.eventSettings.fields.subject.default)) {
            eventObj[this.fields.subject] = this.parent.eventSettings.fields.subject.default;
        }
        if (!isNullOrUndefined(this.parent.eventSettings.fields.location.default)) {
            eventObj[this.fields.location] = this.parent.eventSettings.fields.location.default;
        }
        if (!isNullOrUndefined(this.parent.eventSettings.fields.description.default)) {
            eventObj[this.fields.description] = this.parent.eventSettings.fields.description.default;
        }
        this.showDetails(eventObj);
        if (eventObj[this.fields.recurrenceRule] && this.recurrenceEditor) {
            this.recurrenceEditor.setRecurrenceRule(<string>eventObj[this.fields.recurrenceRule], <Date>eventObj[this.fields.startTime]);
            this.repeatRule = <string>eventObj[this.fields.recurrenceRule];
        }
        const deleteButton: Element = this.element.querySelector('.' + cls.DELETE_EVENT_CLASS);
        if (deleteButton) {
            addClass([deleteButton], cls.DISABLE_CLASS);
        }
        if (this.recurrenceEditor) {
            this.recurrenceEditor.setProperties({
                startDate: <Date>eventObj[this.fields.startTime],
                selectedType: !isNullOrUndefined(repeatType) ? repeatType : !isNullOrUndefined(eventObj[this.fields.recurrenceRule]) ?
                    this.recurrenceEditor.selectedType : 0
            });
            this.repeatRule = this.recurrenceEditor.value;
        }
        if (this.parent.isAdaptive && isNullOrUndefined(this.parent.editorTemplate)) {
            const element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule] || repeatType) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            }
            else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        } else {
            const saveButton: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            this.disableButton(saveButton, false);
        }
        this.dialogObject.show();
    }

    public convertToEventData(cellsData: Record<string, any>, eventObj: Record<string, any>): void {
        if (!cellsData) { return; }
        if (cellsData.subject) {
            eventObj[this.fields.subject] = cellsData.subject;
        }
        eventObj[this.fields.startTime] = cellsData.startTime;
        eventObj[this.fields.endTime] = cellsData.endTime;
        eventObj[this.fields.isAllDay] = cellsData.isAllDay;
        if (cellsData.RecurrenceRule) {
            eventObj[this.fields.recurrenceRule] = cellsData.RecurrenceRule;
        }
        if (this.parent.resourceCollection.length > 0 || this.parent.activeViewOptions.group.resources.length > 0) {
            this.parent.resourceBase.setResourceValues(eventObj);
        }
    }

    private applyFormValidation(): void {
        const form: HTMLFormElement = this.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        if (!form) {
            return;
        }
        const getValidationRule: CallbackFunction = (rules: Record<string, any>) =>
            (rules && Object.keys(rules).length > 0) ? rules : undefined;
        const rules: Record<string, any> = {};
        const subjectRule: Record<string, any> = getValidationRule(this.parent.eventSettings.fields.subject.validation);
        if (!isNullOrUndefined(subjectRule)) {
            rules[this.parent.eventSettings.fields.subject.name] = subjectRule;
        }
        const locationRule: Record<string, any> = getValidationRule(this.parent.eventSettings.fields.location.validation);
        if (!isNullOrUndefined(locationRule)) {
            rules[this.parent.eventSettings.fields.location.name] = locationRule;
        }
        const startTimeRule: Record<string, any> = getValidationRule(this.parent.eventSettings.fields.startTime.validation);
        if (!isNullOrUndefined(startTimeRule)) {
            rules[this.parent.eventSettings.fields.startTime.name] = startTimeRule;
        }
        const endTimeRule: Record<string, any> = getValidationRule(this.parent.eventSettings.fields.endTime.validation);
        if (!isNullOrUndefined(endTimeRule)) {
            rules[this.parent.eventSettings.fields.endTime.name] = endTimeRule;
        }
        const descriptionRule: Record<string, any> = getValidationRule(this.parent.eventSettings.fields.description.validation);
        if (!isNullOrUndefined(descriptionRule)) {
            rules[this.parent.eventSettings.fields.description.name] = descriptionRule;
        }
        if (this.fieldValidator) {
            this.fieldValidator.destroy();
            this.fieldValidator = null;
        }
        this.fieldValidator = new FieldValidator();
        this.fieldValidator.renderFormValidator(form, rules, this.element, this.parent.locale);
    }

    private showDetails(eventData: Record<string, any>): void {
        this.eventData = eventData;
        const eventObj: Record<string, any> = <Record<string, any>>extend({}, eventData, null, true);
        const formElements: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        if ((!this.cellClickAction || this.cellClickAction && !isNullOrUndefined(this.parent.editorTemplate)) &&
            (<Date>eventObj[this.fields.endTime]).getHours() === 0 && (<Date>eventObj[this.fields.endTime]).getMinutes() === 0) {
            this.trimAllDay(eventObj);
        }
        const keyNames: string[] = Object.keys(eventObj);
        for (const curElement of formElements) {
            const columnName: string = curElement.name || this.getColumnName(curElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                if (keyNames.indexOf(columnName) !== -1) {
                    this.setValueToElement(curElement as HTMLElement, eventObj[`${columnName}`] as string);
                } else {
                    this.setDefaultValueToElement(curElement as HTMLElement);
                }
            }
        }
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            this.onAllDayChange(eventObj[this.fields.isAllDay] as boolean);
            const timezoneObj: CheckBox = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD) as unknown as CheckBox;
            if (!(isNullOrUndefined(eventObj[this.fields.startTimezone]) && isNullOrUndefined(eventObj[this.fields.endTimezone]))) {
                timezoneObj.checked = true;
                timezoneObj.dataBind();
            }
            this.timezoneChangeStyle(timezoneObj.checked);
            delete eventObj.Timezone;
        }
    }

    private getColumnName(element: HTMLInputElement): string {
        let attrName: string = element.getAttribute('data-name') || '';
        if (attrName === '') {
            let isDropDowns: boolean = false;
            let fieldSelector: string = '';
            if (element.classList.contains('e-dropdownlist')) {
                fieldSelector = 'e-ddl';
                isDropDowns = true;
            } else if (element.classList.contains('e-multiselect')) {
                fieldSelector = 'e-multiselect';
                isDropDowns = true;
            } else if (element.classList.contains('e-datetimepicker')) {
                fieldSelector = 'e-datetimepicker';
            } else if (element.classList.contains('e-datepicker')) {
                fieldSelector = 'e-datepicker';
            } else if (element.classList.contains('e-checkbox')) {
                fieldSelector = 'e-checkbox';
            } else if (element.classList.contains('e-numerictextbox')) {
                fieldSelector = 'e-numerictextbox';
            }
            const classSelector: string = isDropDowns ? `.${fieldSelector}:not(.e-control)` : `.${fieldSelector}`;
            const control: Element = closest(element, classSelector) || element.querySelector(`.${fieldSelector}`);
            if (control) {
                const attrEle: Element = control.querySelector('[name]');
                if (attrEle) {
                    attrName = (<HTMLInputElement>attrEle).name;
                }
            }
        }
        return attrName;
    }

    private onAllDayChange(allDayStatus: boolean): void {
        const startObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_START_CLASS) as unknown as DateTimePicker;
        const endObj: DateTimePicker = this.getInstance(cls.EVENT_WINDOW_END_CLASS) as unknown as DateTimePicker;
        const timezoneDiv: HTMLElement = this.element.querySelector('.e-time-zone-container') as HTMLElement;
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
            format = (isNullOrUndefined(this.parent.dateFormat)) ? this.getFormat('dateFormats') + ' ' +
                this.parent.activeViewOptions.timeFormat : this.parent.dateFormat + ' ' + this.parent.activeViewOptions.timeFormat;
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
        if (!isNullOrUndefined(this.recurrenceEditor)) {
            this.recurrenceEditor.updateRuleUntilDate(startObj.value);
        }
    }

    private updateDateTime(allDayStatus: boolean, startObj: DateTimePicker, endObj: DateTimePicker): void {
        let startDate: Date; let endDate: Date;
        if (isNullOrUndefined(this.eventWindowTime.startTime) && isNullOrUndefined(this.eventWindowTime.endTime)) { return; }
        if (allDayStatus) {
            startDate = util.resetTime(new Date(this.eventWindowTime.startTime.getTime()));
            if (this.parent.activeCellsData.isAllDay) {
                const temp: number = util.addDays(new Date((<Date>this.eventWindowTime.endTime).getTime()), -1).getTime();
                endDate = (+this.eventWindowTime.startTime > temp) ? this.eventWindowTime.endTime : new Date(temp);
            } else {
                endDate = util.resetTime(new Date(this.eventWindowTime.endTime.getTime()));
            }
        } else {
            const start: Date = this.parent.activeCellsData.startTime;
            startDate = new Date(this.eventWindowTime.startTime.getTime());
            startDate.setHours(start.getHours(), start.getMinutes(), start.getSeconds());
            if (this.parent.activeCellsData.isAllDay) {
                const startHour: Date = this.parent.getStartEndTime(this.parent.workHours.start);
                startDate.setHours(startHour.getHours(), startHour.getMinutes(), startHour.getSeconds());
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(util.MS_PER_MINUTE * this.getSlotDuration());
            } else {
                endDate = new Date(startDate.getTime());
                endDate.setMilliseconds(this.parent.activeCellsData.endTime.getTime() - this.parent.activeCellsData.startTime.getTime());
            }
        }
        this.eventWindowTime = { startTime: new Date(startDate.getTime()), endTime: new Date(endDate.getTime()) };
        startObj.value = startDate;
        endObj.value = endDate;
        startObj.dataBind();
        endObj.dataBind();
    }

    private getFormat(formatType: string): string {
        let format: string;
        if (isNullOrUndefined(this.parent.locale) || this.parent.locale === 'en' || this.parent.locale === 'en-US') {
            format = getValue(formatType + '.short', getDefaultDateObject(this.parent.getCalendarMode()));
        } else {
            format = getValue(`main.${this.parent.locale}.dates.calendars.${this.parent.getCalendarMode()}.${formatType}.short`, cldrData);
        }
        return format;
    }

    private onEventDetailsUpdate(eventObj: Record<string, any>): void {
        if (!this.parent.eventSettings.allowEditing) {
            return;
        }
        if (!this.parent.isAdaptive && isNullOrUndefined(this.parent.editorFooterTemplate)) {
            removeClass([this.element.querySelector('.' + cls.DELETE_EVENT_CLASS)], cls.DISABLE_CLASS);
        }
        if (isNullOrUndefined(this.parent.editorHeaderTemplate)) {
            this.element.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML = this.l10n.getConstant('editEvent');
        }
        this.element.querySelector('.' + cls.FORM_CLASS).setAttribute('data-id', eventObj[this.fields.id].toString());
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            eventObj = <Record<string, any>>extend({}, eventObj, null, true);
            const timezoneObj: CheckBox = this.getInstance(cls.TIME_ZONE_CLASS + '.' + EVENT_FIELD) as unknown as CheckBox;
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
            this.recurrenceEditor.setProperties({ startDate: eventObj[this.fields.startTime] });
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
            const element: HTMLElement = <HTMLElement>this.element.querySelector('.' + REPEAT_CONTAINER_CLASS);
            if (eventObj[this.fields.recurrenceRule]) {
                removeClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: true });
            } else {
                addClass([element], HIDE_STYLE_CLASS);
                this.repeatStatus.setProperties({ checked: false });
            }
            this.updateRepeatLabel(this.repeatRule);
        }
        const isDisable: boolean = (this.parent.readonly || eventObj[this.fields.isReadonly]) as boolean;
        if (!this.parent.isAdaptive) {
            const saveButton: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            const deleteButton: Element = this.element.querySelector('.' + cls.DELETE_EVENT_CLASS);
            this.disableButton(saveButton, isDisable);
            this.disableButton(deleteButton, isDisable);
        } else {
            const saveIcon: Element = this.element.querySelector('.' + cls.EVENT_WINDOW_SAVE_ICON_CLASS);
            if (saveIcon) {
                if (isDisable) {
                    addClass([saveIcon], cls.ICON_DISABLE_CLASS);
                } else {
                    removeClass([saveIcon], cls.ICON_DISABLE_CLASS);
                }
            }
        }
        this.dialogObject.show();
    }

    private disableButton(element: Element, value: boolean): void {
        if (element) {
            ((element as EJ2Instance).ej2_instances[0] as Button).disabled = value;
        }
    }

    private renderRecurrenceEditor(): RecurrenceEditor {
        return new RecurrenceEditor({
            calendarMode: this.parent.calendarMode,
            cssClass: this.parent.cssClass,
            dateFormat: this.parent.dateFormat,
            enableRtl: this.parent.enableRtl,
            firstDayOfWeek: this.parent.activeViewOptions.firstDayOfWeek,
            locale: this.parent.locale
        });
    }

    public updateMinMaxDateToEditor(): void {
        const startDate: Element = this.element.querySelector('.e-start');
        const endDate: Element = this.element.querySelector('.e-end');
        if (startDate && endDate) {
            const startObj: DatePicker = (startDate as EJ2Instance).ej2_instances[0] as DatePicker;
            const endObj: DatePicker = (endDate as EJ2Instance).ej2_instances[0] as DatePicker;
            startObj.min = this.parent.minDate;
            startObj.max = new Date(new Date(+this.parent.maxDate).setHours(23, 59, 59));
            endObj.min = this.parent.minDate;
            endObj.max = new Date(new Date(+this.parent.maxDate).setHours(23, 59, 59));
            startObj.dataBind();
            endObj.dataBind();
        }
        if (this.recurrenceEditor) {
            const untilDate: Element = this.recurrenceEditor.element.querySelector('.e-until-date');
            if (untilDate) {
                const untilObj: DatePicker = (untilDate as EJ2Instance).ej2_instances[0] as DatePicker;
                untilObj.min = this.parent.minDate;
                untilObj.max = this.parent.maxDate;
                untilObj.dataBind();
            }
        }
    }

    private updateRepeatLabel(repeatRule: string): void {
        if (this.parent.isAdaptive && !this.repeatDialogObject) {
            this.renderRepeatDialog();
        }
        const data: string = repeatRule ?
            (this.l10n.getConstant('repeats') + ' ' + this.recurrenceEditor.getRuleSummary(repeatRule)) : this.l10n.getConstant('repeat');
        this.repeatStatus.setProperties({ label: data });
    }

    public dialogClose(event?: Event): void {
        if (this.isEnterKey) {
            this.isEnterKey = false;
            return;
        }
        this.dialogEvent = event;
        this.isCrudAction = false;
        this.parent.activeEventData = { event: undefined, element: undefined };
        this.parent.currentAction = null;
        this.dialogObject.hide();
    }

    private resetForm(): void {
        this.fieldValidator.destroyToolTip();
        this.resetFormFields();
        if (!this.parent.isAdaptive && this.recurrenceEditor && !this.recurrenceEditor.isDestroyed) {
            this.recurrenceEditor.resetFields();
        }
    }

    private timezoneChangeStyle(value: boolean): void {
        const timezoneDiv: HTMLElement = this.element.querySelector('.' + cls.EVENT_WINDOW_TIME_ZONE_DIV_CLASS) as HTMLElement;
        const localTimezoneName: string = this.parent.tzModule.getLocalTimezoneName();
        if (value) {
            addClass([timezoneDiv], cls.ENABLE_CLASS);
            const startTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_START_TZ_CLASS) as unknown as DropDownList;
            const endTimezoneObj: DropDownList = this.getInstance(cls.EVENT_WINDOW_END_TZ_CLASS) as unknown as DropDownList;
            const timezone: Record<string, any>[] = startTimezoneObj.dataSource as Record<string, any>[];
            if (!startTimezoneObj.value || !this.parent.timezone) {
                const found: boolean = timezone.some((tz: Record<string, any>) => { return tz.Value === localTimezoneName; });
                if (!found) {
                    timezone.push({ Value: localTimezoneName, Text: localTimezoneName });
                    startTimezoneObj.dataSource = timezone;
                    endTimezoneObj.dataSource = timezone;
                    startTimezoneObj.dataBind();
                    endTimezoneObj.dataBind();
                }
            }
            startTimezoneObj.value = startTimezoneObj.value || this.parent.timezone || localTimezoneName;
            endTimezoneObj.value = endTimezoneObj.value || this.parent.timezone || localTimezoneName;
            startTimezoneObj.dataBind();
            endTimezoneObj.dataBind();
        } else {
            removeClass([timezoneDiv], cls.ENABLE_CLASS);
        }
    }

    private resetFormFields(): void {
        const formElement: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (const currentElement of formElement) {
            const columnName: string = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                this.setDefaultValueToElement(currentElement as HTMLElement);
            }
        }
    }

    public eventSave(event: Event, alert?: string): void {
        if (this.isEnterKey) {
            this.isEnterKey = false;
            return;
        }
        const formElement: Element = this.element.querySelector('.' + cls.FORM_CLASS);
        if (formElement && formElement.classList.contains('e-formvalidator') &&
            !((formElement as EJ2Instance).ej2_instances[0] as FormValidator).validate()) {
            return;
        }
        const dataCollection: Record<string, Record<string, any>> = this.getEventDataFromEditor();
        if (this.processEventValidation(dataCollection.tempData, alert)) {
            return;
        }
        this.eventCrudData = dataCollection.eventData;
        this.dialogEvent = event;
        this.isCrudAction = true;
        this.dialogObject.hide();
    }

    public getEventDataFromEditor(): Record<string, Record<string, any>> {
        const eventObj: Record<string, any> =
            extend({}, this.getObjectFromFormData(cls.EVENT_WINDOW_DIALOG_CLASS)) as Record<string, any>;
        if (!eventObj.Timezone) {
            eventObj[this.fields.startTimezone] = null;
            eventObj[this.fields.endTimezone] = null;
        }
        delete eventObj.Timezone;
        delete eventObj.Repeat;
        this.setDefaultValueToObject(eventObj);
        eventObj[this.fields.recurrenceRule] = this.recurrenceEditor ? this.recurrenceEditor.getRecurrenceRule() || null : undefined;
        const tempObj: Record<string, any> = extend({}, eventObj, null, true) as Record<string, any>;
        if (eventObj[this.fields.isAllDay]) {
            eventObj[this.fields.startTime] = (isNullOrUndefined(eventObj[this.fields.startTime])) ? null
                : util.resetTime(new Date((<Date>eventObj[this.fields.startTime]).getTime()));
            eventObj[this.fields.endTime] = (isNullOrUndefined(eventObj[this.fields.endTime])) ? null
                : util.addDays(util.resetTime(new Date((<Date>eventObj[this.fields.endTime]).getTime())), 1);
        }
        return { eventData: eventObj, tempData: tempObj };
    }

    private processEventValidation(eventObj: Record<string, any>, alert?: string): boolean {
        let alertType: string;
        if (isNullOrUndefined(this.parent.editorTemplate)) {
            if (!eventObj[this.fields.startTime] || !eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('invalidDateError');
                return true;
            }
            if (eventObj[this.fields.startTime] > eventObj[this.fields.endTime]) {
                this.parent.quickPopup.openValidationError('startEndError');
                return true;
            }
        }
        if (this.recurrenceEditor && this.recurrenceEditor.value && this.recurrenceEditor.value !== '') {
            if (this.parent.currentAction !== 'EditOccurrence') {
                alertType = this.recurrenceValidation(<Date>eventObj[this.fields.startTime], <Date>eventObj[this.fields.endTime], alert);
            }
            let isShowAlert: boolean = true;
            if (alertType === 'seriesChangeAlert' && this.parent.uiStateValues.isIgnoreOccurrence) {
                isShowAlert = false;
            }
            if (!isNullOrUndefined(alertType) && isShowAlert
                && ((!this.parent.enableRecurrenceValidation && alertType === 'wrongPattern') || this.parent.enableRecurrenceValidation)) {
                this.parent.quickPopup.openRecurrenceValidationAlert(alertType);
                return true;
            }
        }
        return false;
    }

    private processCrudActions(eventObj: Record<string, any>): boolean {
        this.parent.uiStateValues.isBlock = false;
        const resourceData: string[] | number[] = this.getResourceData(eventObj);
        const isResourceEventExpand: boolean = (this.parent.activeViewOptions.group.resources.length > 0 ||
            this.parent.resourceCollection.length > 0) && !this.parent.activeViewOptions.group.allowGroupEdit
            && !isNullOrUndefined(resourceData);
        const eventId: string = this.getEventIdFromForm();
        if (!isNullOrUndefined(eventId)) {
            let eveId: number | string = this.parent.eventBase.getEventIDType() === 'string' ? eventId : parseInt(eventId, 10);
            let editedData: Record<string, any> = this.parent.eventsData.filter((data: Record<string, any>) =>
                data[this.fields.id] === eveId)[0];
            if (isNullOrUndefined(editedData)) {
                editedData = this.parent.blockData.filter((data: Record<string, any>) =>
                    data[this.fields.id] === eveId)[0];
            }
            eventObj = extend({}, editedData, eventObj) as Record<string, any>;
            if (eventObj[this.fields.isReadonly]) {
                return false;
            }
            if (this.parent.eventBase.checkOverlap(eventObj)) {
                return true;
            }
            let currentAction: CurrentAction;
            if (!isNullOrUndefined(editedData[this.fields.recurrenceRule])) {
                currentAction = this.parent.currentAction;
                eventObj.Guid = (<Record<string, any>>this.parent.activeEventData.event).Guid;
                if (this.parent.currentAction === 'EditOccurrence') {
                    if (!eventObj[this.fields.recurrenceID]) {
                        eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                        eventObj.Guid = (<Record<string, any>>this.parent.activeEventData.event).Guid;
                    } else {
                        eveId = eventObj[this.fields.recurrenceID] as number;
                        currentAction = null;
                    }
                    if (this.parent.enableRecurrenceValidation && this.editOccurrenceValidation(eveId, eventObj)) {
                        return true;
                    }
                }
                if (this.parent.currentAction === 'EditSeries' || eventObj[this.fields.id] !== editedData[this.fields.id]) {
                    eventObj[this.fields.recurrenceID] = editedData[this.fields.id];
                } else if (this.parent.currentAction === 'EditFollowingEvents') {
                    eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                    eventObj[this.fields.followingID] = editedData[this.fields.id];
                }
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, 'Save', currentAction);
            } else {
                this.parent.saveEvent(eventObj, currentAction);
            }
        } else {
            this.parent.currentAction = 'Add';
            if (this.parent.eventBase.checkOverlap(eventObj)) {
                return true;
            }
            if (isResourceEventExpand) {
                this.resourceSaveEvent(eventObj, this.parent.currentAction);
            } else {
                eventObj[this.fields.id] = this.parent.eventBase.getEventMaxID();
                this.parent.addEvent(eventObj);
            }
        }
        return this.parent.uiStateValues.isBlock;
    }

    private getResourceData(eventObj: Record<string, any>): string[] | number[] {
        let resourceData: string[] | number[] = null;
        if (!isNullOrUndefined(this.parent.resourceBase) && !isNullOrUndefined(this.parent.resourceBase.resourceCollection)
            && this.parent.resourceBase.resourceCollection.length > 0) {
            const lastResourceData: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            resourceData = eventObj[lastResourceData.field] as string[] | number[];
        }
        return resourceData;
    }

    public getObjectFromFormData(className: string): Record<string, any> {
        const formElement: HTMLInputElement[] = this.getFormElements(className);
        const eventObj: Record<string, any> = {};
        for (const currentElement of formElement) {
            const columnName: string = currentElement.name || this.getColumnName(currentElement);
            if (!isNullOrUndefined(columnName) && columnName !== '') {
                eventObj[`${columnName}`] = this.getValueFromElement(currentElement as HTMLElement);
            }
        }
        return eventObj;
    }

    public setDefaultValueToObject(eventObj: Record<string, any>): void {
        if (!isNullOrUndefined(eventObj[this.fields.subject])) {
            eventObj[this.fields.subject] = eventObj[this.fields.subject] || this.parent.eventSettings.fields.subject.default
                || this.l10n.getConstant('addTitle');
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
        const recEditor: RecurrenceEditor = this.recurrenceEditor;
        const interval: number = (this.getInstance('e-repeat-interval.e-numerictextbox') as unknown as NumericTextBox).value;
        if (alert !== this.l10n.getConstant('ok')) {
            const activeEvent: Record<string, any> = <Record<string, any>>this.parent.activeEventData.event;
            let excludedEvents: Record<string, any>[] = [];
            if ((this.parent.currentAction === 'EditSeries' || this.parent.currentAction === 'EditFollowingEvents')
                && !isNullOrUndefined(activeEvent)) {
                const eventStartTime: string = activeEvent[this.parent.eventFields.startTime] as string;
                const seriesEvents: Record<string, any>[] = this.parent.eventBase.getSeriesEvents(this.eventData, eventStartTime);
                if (seriesEvents.length > 0) {
                    excludedEvents = this.parent.eventBase.getEditedOccurrences(seriesEvents, eventStartTime);
                } else {
                    const event: Record<string, any> = this.parent.eventBase.getEventById(
                        activeEvent[this.parent.eventFields.id] as string);
                    excludedEvents = this.parent.eventBase.getEditedOccurrences([event], eventStartTime);
                }
                if (this.parent.currentAction === 'EditSeries'
                    && !isNullOrUndefined(this.eventData[this.parent.eventFields.recurrenceException])) {
                    excludedEvents.push(this.eventData);
                }
            }
            if (excludedEvents.length > 0) {
                alertMessage = 'seriesChangeAlert';
            }
            if ((this.getInstance('e-end-on-left .e-ddl .e-dropdownlist') as unknown as DropDownList).value === 'until' &&
                (this.getInstance('e-end-on-date .e-datepicker') as unknown as DatePicker).value < startDate) {
                alertMessage = 'wrongPattern';
            }
            if (isNullOrUndefined(alertMessage)) {
                let types: string[] = recEditor.value.split(';')[1].split('=')[1].split(',');
                const obj: Record<string, any> = { 'SU': 0, 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5, 'SA': 6 };
                const temp: number[] = [];
                const tempDiff: number[] = [];
                let tempValue: number[];
                switch (recEditor.value.split(';')[0].split('=')[1]) {
                case 'DAILY':
                    if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) > (interval * 24))) {
                        alertMessage = 'createError';
                    }
                    break;
                case 'WEEKLY':
                    types = recEditor.value.split(';')[1].split('=')[1].split(',');
                    for (let index: number = 0; index < types.length * (interval + 1); index++) {
                        temp[parseInt(index.toString(), 10)] =
                            (types.length > index) ? <number>obj[types[parseInt(index.toString(), 10)]] :
                                temp[index - types.length] + (7 * interval);
                    }
                    tempValue = temp.sort((a: number, b: number) => a - b);
                    for (let index: number = 1; index < tempValue.length; index++) {
                        tempDiff.push(tempValue[parseInt(index.toString(), 10)] - tempValue[index - 1]);
                    }
                    if ((((endDate.getTime() - startDate.getTime()) / (1000 * 3600)) >= Math.min(...tempDiff) * 24)
                        || isNullOrUndefined(interval)) {
                        alertMessage = 'createError';
                    }
                    break;
                case 'MONTHLY':
                    if (endDate.getTime() >= new Date(+startDate).setMonth(startDate.getMonth() + interval)) {
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
        if (isNullOrUndefined(interval)) {
            alertMessage = 'createError';
        }
        return alertMessage;
    }

    private getRecurrenceIndex(recColl: Record<string, any>[], event: Record<string, any>): number {
        let recIndex: number;
        for (let index: number = 0; index < recColl.length; index++) {
            if (event[this.fields.startTime].valueOf() === recColl[parseInt(index.toString(), 10)][this.fields.startTime].valueOf()) {
                recIndex = index;
                break;
            }
        }
        return recIndex;
    }

    private trimAllDay(data: Record<string, any>): void {
        if (data[this.fields.isAllDay]) {
            const temp: number = util.addDays(new Date(+data[this.fields.endTime]), -1).getTime();
            data[this.fields.endTime] = (+data[this.fields.startTime] > temp) ? data[this.fields.endTime] : new Date(temp);
        }
    }

    public editOccurrenceValidation(eventId: string | number, currentData: Record<string, any>, editData?: Record<string, any>)
        : boolean {
        if (editData === void 0) { editData = this.eventData; }
        const recurColl: Record<string, any>[] = <Record<string, any>[]>this.parent.getOccurrencesByID(eventId);
        const excludedDatas: Record<string, any>[] = this.parent.eventsData.filter((data: Record<string, any>) =>
            data[this.fields.recurrenceID] === eventId) as Record<string, any>[];
        excludedDatas.map((data: Record<string, any>) => recurColl.push(extend({}, data) as Record<string, any>));
        currentData = extend({}, currentData) as Record<string, any>;
        this.trimAllDay(currentData);
        for (const data of recurColl) {
            this.trimAllDay(data);
        }
        this.parent.eventBase.sortByTime(recurColl);
        const index: number = this.getRecurrenceIndex(recurColl, editData);
        if (isNullOrUndefined(index)) {
            return false;
        }
        const currentStartTime: Date = new Date(+currentData[this.fields.startTime]);
        const currentEndTime: Date = new Date(+currentData[this.fields.endTime]);
        let nextStartTime: Date;
        let nextEndTime: Date;
        if (index !== recurColl.length - 1) {
            nextStartTime = new Date(+recurColl[index + 1][this.fields.startTime]);
            nextEndTime = new Date(+recurColl[index + 1][this.fields.endTime]);
        }
        const lastEndTime: Date = new Date(+recurColl[recurColl.length - 1][this.fields.endTime]);
        if (index === 0) {
            if (!isNullOrUndefined(recurColl[index + 1])) {
                if (!(nextStartTime.getTime() >= currentEndTime.getTime()) &&
                    (util.resetTime(lastEndTime).getTime() >=
                        util.resetTime(currentStartTime).getTime()) ||
                    util.resetTime(lastEndTime).getTime() < util.resetTime(currentStartTime).getTime()) {
                    this.parent.quickPopup.openRecurrenceValidationAlert('occurrenceAlert');
                    return true;
                } else if (!(util.resetTime(currentStartTime).getTime() <
                    util.resetTime(nextStartTime).getTime())) {
                    this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                    return true;
                }
            }
            return false;
        }
        else {
            const previousStartTime: Date = new Date(+recurColl[index - 1][this.fields.startTime]);
            const previousEndTime: Date = new Date(+recurColl[index - 1][this.fields.endTime]);
            if (index === recurColl.length - 1) {
                if (util.resetTime(new Date(+recurColl[(recurColl.length - 1) - index][this.fields.startTime])).getTime() >
                    util.resetTime(currentStartTime).getTime()) {
                    this.parent.quickPopup.openRecurrenceValidationAlert('occurrenceAlert');
                    return true;
                }
                else if (!((previousEndTime.getTime() <= currentStartTime.getTime()) &&
                    (util.resetTime(currentStartTime).getTime() > util.resetTime(previousStartTime).getTime()))) {
                    this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                    return true;
                }
            }
            else if (!(((
                util.resetTime(previousStartTime).getTime() < util.resetTime(currentStartTime).getTime()) ||
                util.resetTime(new Date(+recurColl[0][this.fields.startTime])).getTime() >
                util.resetTime(currentStartTime).getTime()) &&
                ((util.resetTime(nextStartTime).getTime() > util.resetTime(currentStartTime).getTime()) ||
                    (lastEndTime.getTime() < currentStartTime.getTime())))) {
                this.parent.quickPopup.openRecurrenceValidationAlert('sameDayAlert');
                return true;
            }
            else if (!(previousEndTime.getTime() <= currentStartTime.getTime() && nextStartTime.getTime() >=
                currentEndTime.getTime()) || (util.resetTime(nextEndTime).getTime() <
                    util.resetTime(currentStartTime).getTime()) ||
                (util.resetTime(previousStartTime).getTime() > util.resetTime(currentEndTime).getTime()) ||
                !(util.resetTime(currentStartTime).getTime() < util.resetTime(nextStartTime).getTime())) {
                this.parent.quickPopup.openRecurrenceValidationAlert('occurrenceAlert');
                return true;
            }
        }
        return false;
    }

    private resourceSaveEvent(eventObj: Record<string, any>, action?: CurrentAction, currentAction?: CurrentAction): void {
        const lastResourceData: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
        let resourceData: string[] | number[] = eventObj[lastResourceData.field] as string[] | number[];
        resourceData = (resourceData instanceof Array) ? resourceData.reverse() : [resourceData].reverse();
        const lastLevel: TdData[] = this.parent.resourceBase.lastResourceLevel;
        const eventList: Record<string, any>[] = [];
        for (let i: number = 0; i < resourceData.length; i++) {
            const events: Record<string, any> = <Record<string, any>>extend({}, eventObj, null, true);
            events[this.fields.id] = this.parent.eventBase.getEventMaxID();
            const temp: Record<string, any>[] = [];
            const addValues: CallbackFunction = () => {
                if (action === 'Save' && i === resourceData.length - 1) {
                    if (temp.length > 0) {
                        temp[0][this.fields.id] = eventObj[this.fields.id];
                        for (let k: number = 1; k < temp.length; k++) {
                            temp[parseInt(k.toString(), 10)][this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                            eventList.push(temp[parseInt(k.toString(), 10)]);
                            this.parent.saveEvent(temp[0], currentAction);
                        }
                    } else {
                        events[this.fields.id] = eventObj[this.fields.id];
                        this.parent.saveEvent(events, currentAction);
                    }
                } else {
                    if (temp.length > 0) {
                        for (let j: number = 0; j < temp.length; j++) {
                            temp[parseInt(j.toString(), 10)][this.fields.id] = this.parent.eventBase.getEventMaxID(j);
                            eventList.push(temp[parseInt(j.toString(), 10)]);
                        }
                    } else {
                        events[this.fields.id] = this.parent.eventBase.getEventMaxID(i);
                        eventList.push(events);
                    }
                }
            };
            if (this.parent.activeViewOptions.group.byGroupID && (!isNullOrUndefined(lastLevel))) {
                const lastResource: Record<string, any>[] = lastResourceData.dataSource as Record<string, any>[];
                const resCol: Record<string, any>[] = this.parent.resourceCollection as Record<string, any>[];
                let index: number;
                if (resCol.length > 1) {
                    index =
                    util.findIndexInData(lastResource, lastResourceData.idField, resourceData[parseInt(i.toString(), 10)] as string,
                                         events, resCol);
                } else {
                    index =
                        util.findIndexInData(lastResource, lastResourceData.idField, resourceData[parseInt(i.toString(), 10)] as string);
                }
                if (index < 0) {
                    return;
                }
                const groupId: Record<string, any> =
                    lastResource[parseInt(index.toString(), 10)][lastResourceData.groupIDField] as Record<string, any>;
                const filter: TdData = lastLevel.filter((obj: TdData) => obj.resourceData[lastResourceData.idField] ===
                    resourceData[parseInt(i.toString(), 10)]).
                    filter((obj: TdData) => obj.resourceData[lastResourceData.groupIDField] === groupId)[0];
                const groupOrder: number[] | string[] = filter.groupOrder;
                for (let index: number = 0; index < this.parent.resourceBase.resourceCollection.length; index++) {
                    const field: string = this.parent.resourceBase.resourceCollection[parseInt(index.toString(), 10)].field;
                    events[`${field}`] = ((groupOrder[parseInt(index.toString(), 10)] as any) instanceof Array) ? groupOrder[parseInt(index.toString(), 10)][0] :
                        groupOrder[parseInt(index.toString(), 10)];
                }
                addValues();
            } else {
                for (let index: number = 0; index < this.parent.resourceBase.resourceCollection.length - 1; index++) {
                    const field: string = this.parent.resourceBase.resourceCollection[parseInt(index.toString(), 10)].field;
                    if (events[`${field}`] instanceof Array && (events[`${field}`] as Record<string, any>[]).length > 1) {
                        for (let k: number = 0; k < (events[`${field}`] as Record<string, any>[]).length; k++) {
                            const event: Record<string, any> = <Record<string, any>>extend({}, events, null, true);
                            event[`${field}`] = (eventObj[`${field}`] as Record<string, any>)[parseInt(k.toString(), 10)];
                            event[lastResourceData.field] = resourceData[parseInt(i.toString(), 10)];
                            temp.push(event);
                        }
                    } else {
                        if (temp.length === 0) {
                            events[`${field}`] = (eventObj[`${field}`] instanceof Array) ?
                                (eventObj[`${field}`] as Record<string, any>)[0] : eventObj[`${field}`];
                            events[lastResourceData.field] = resourceData[parseInt(i.toString(), 10)];
                        } else {
                            for (let l: number = 0; l < temp.length; l++) {
                                temp[parseInt(l.toString(), 10)][`${field}`] = (eventObj[`${field}`] instanceof Array) ?
                                    (eventObj[`${field}`] as Record<string, any>)[0] : eventObj[`${field}`];
                            }
                        }
                    }
                }
                events[lastResourceData.field] = resourceData[parseInt(i.toString(), 10)];
                addValues();
            }
        }
        if (eventList.length > 0) {
            for (const event of eventList) {
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
        let elements: HTMLInputElement[] = [];
        if (className === cls.EVENT_WINDOW_DIALOG_CLASS) {
            elements = [].slice.call(this.element.querySelectorAll('.' + EVENT_FIELD));
        } else {
            elements = [].slice.call(this.parent.element.querySelectorAll('.' + className + ' .' + EVENT_FIELD));
        }
        return elements;
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
        } else if (element.classList.contains('e-numerictextbox')) {
            value = ((element as EJ2Instance).ej2_instances[0] as NumericTextBox).value as number;
        } else {
            if ((element as HTMLInputElement).type === 'checkbox') {
                value = (element as HTMLInputElement).checked as boolean;
            } else {
                value = this.parent.enableHtmlSanitizer ?
                    SanitizeHtmlHelper.sanitize((element as HTMLInputElement).value as string) : (element as HTMLInputElement).value;
            }
        }
        return value;
    }

    private setValueToElement(element: HTMLElement, value: number | string | Date | boolean | number[] | string[]): void {
        if (element.classList.contains('e-datepicker')) {
            const instance: DatePicker = (element as EJ2Instance).ej2_instances[0] as DatePicker;
            instance.value = <Date>value;
            instance.dataBind();
        } else if (element.classList.contains('e-datetimepicker')) {
            const instance: DateTimePicker = (element as EJ2Instance).ej2_instances[0] as DateTimePicker;
            if (instance.element.classList.contains(cls.EVENT_WINDOW_START_CLASS)) {
                this.eventWindowTime.startTime = new Date('' + value);
            } else {
                this.eventWindowTime.endTime = new Date('' + value);
            }
            instance.value = <Date>value;
            instance.dataBind();
        } else if (element.classList.contains('e-dropdownlist')) {
            const instance: DropDownList = (element as EJ2Instance).ej2_instances[0] as DropDownList;
            instance.value = <string>value;
            instance.dataBind();
        } else if (element.classList.contains('e-multiselect')) {
            const instance: MultiSelect = (element as EJ2Instance).ej2_instances[0] as MultiSelect;
            instance.value = [];
            instance.value = <string[]>((value instanceof Array) ? value : [value]);
            instance.dataBind();
        } else if (element.classList.contains('e-checkbox')) {
            const instance: CheckBox = (element as EJ2Instance).ej2_instances[0] as CheckBox;
            instance.checked = <boolean>value;
            instance.dataBind();
        } else if (element.classList.contains('e-numerictextbox')) {
            const instance: NumericTextBox = (element as EJ2Instance).ej2_instances[0] as NumericTextBox;
            instance.value = <number>value;
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
            const instance: DatePicker = (element as EJ2Instance).ej2_instances[0] as DatePicker;
            instance.value = this.parent.getCurrentTime();
            instance.dataBind();
        } else if (element.classList.contains('e-datetimepicker')) {
            const instance: DateTimePicker = (element as EJ2Instance).ej2_instances[0] as DateTimePicker;
            const dateValue: Date = this.parent.getCurrentTime();
            this.eventWindowTime = { startTime: dateValue, endTime: dateValue };
            instance.value = dateValue;
            instance.dataBind();
        } else if (element.classList.contains('e-dropdownlist')) {
            const instance: DropDownList = (element as EJ2Instance).ej2_instances[0] as DropDownList;
            instance.value = null;
            instance.dataBind();
        } else if (element.classList.contains('e-multiselect')) {
            const instance: MultiSelect = (element as EJ2Instance).ej2_instances[0] as MultiSelect;
            instance.value = [];
            instance.dataBind();
        } else if (element.classList.contains('e-checkbox')) {
            const instance: CheckBox = (element as EJ2Instance).ej2_instances[0] as CheckBox;
            instance.checked = false;
            instance.dataBind();
        } else if (element.classList.contains('e-numerictextbox')) {
            const instance: NumericTextBox = (element as EJ2Instance).ej2_instances[0] as NumericTextBox;
            instance.value = null;
            instance.dataBind();
        } else {
            if ((element as HTMLInputElement).type === 'checkbox') {
                (element as HTMLInputElement).checked = false;
            } else {
                (element as HTMLInputElement).value = '';
            }
        }
    }

    private getInstance(className: string): Record<string, any> {
        const element: HTMLElement = this.element.querySelector('.' + className) as HTMLElement;
        return element ? (element as EJ2Instance).ej2_instances[0] : null;
    }

    private eventDelete(event: Event): void {
        if (this.isEnterKey) {
            this.isEnterKey = false;
            return;
        }
        switch (this.parent.currentAction) {
        case 'EditOccurrence':
            if (!isNullOrUndefined((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule])) {
                this.parent.currentAction = 'DeleteOccurrence';
            } else {
                this.parent.currentAction = 'Delete';
            }
            break;
        case 'EditSeries':
            this.parent.currentAction = 'DeleteSeries';
            break;
        case 'Save':
            this.parent.currentAction = 'Delete';
            break;
        case 'EditFollowingEvents':
            if (!isNullOrUndefined((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule])) {
                this.parent.currentAction = 'DeleteFollowingEvents';
            }
            break;
        }
        this.dialogEvent = event;
        this.isCrudAction = false;
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
        const formElements: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (const element of formElements) {
            let instance: Record<string, any>[];
            if (element.classList.contains('e-datetimepicker')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            } else if (element.classList.contains('e-datepicker')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            } else if (element.classList.contains('e-checkbox')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            } else if (element.classList.contains('e-dropdownlist')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            } else if (element.classList.contains('e-multiselect')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            } else if (element.classList.contains('e-numerictextbox')) {
                instance = ((<HTMLElement>element) as EJ2Instance).ej2_instances;
            }
            if (instance && instance[0]) {
                (instance[0] as unknown as Schedule).destroy();
            }
        }
        if (this.buttonObj) {
            this.buttonObj.destroy();
        }
    }

    private detachComponents(): void {
        const formElements: HTMLInputElement[] = this.getFormElements(cls.EVENT_WINDOW_DIALOG_CLASS);
        for (const element of formElements) {
            detach(element);
        }
    }

    public destroy(isIgnore?: boolean): void {
        if (this.parent && !this.parent.isDestroyed) {
            this.parent.resetTemplates(['editorTemplate', 'editorHeaderTemplate', 'editorFooterTemplate']);
        }
        this.destroyComponents();
        if (this.recurrenceEditor) {
            this.recurrenceEditor.destroy();
            detach(this.recurrenceEditor.element);
            this.recurrenceEditor = null;
        }
        if (this.fieldValidator) {
            this.fieldValidator.destroy();
            this.fieldValidator = null;
        }
        if (this.repeatDialogObject) {
            this.repeatDialogObject.destroy();
            this.repeatDialogObject = null;
        }
        this.detachComponents();
        if (this.dialogObject) {
            if (this.dialogObject.element) {
                const form: HTMLFormElement = this.dialogObject.element.querySelector('form');
                util.removeChildren(form);
                detach(form);
                EventHandler.remove(this.dialogObject.element, 'keydown', this.preventEventSave);
            }
            this.dialogObject.destroy();
            this.dialogObject = null;
        }
        if (this.element) {
            remove(this.element);
            this.element = null;
        }
        if (!isIgnore) {
            this.l10n = null;
            this.parent = null;
            this.fields = null;
            this.buttonObj = null;
            this.repeatStatus = null;
            this.eventWindowTime = null;
            this.dialogEvent = null;
        }
    }

}
