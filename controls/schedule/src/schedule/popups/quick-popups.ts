/* eslint-disable @typescript-eslint/no-explicit-any */
import { L10n, closest, EventHandler, isNullOrUndefined, formatUnit, append, AnimationModel, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { addClass, removeClass, createElement, remove, extend } from '@syncfusion/ej2-base';
import { Dialog, Popup, isCollide, ButtonPropsModel, BeforeCloseEventArgs } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { Input, FormValidator } from '@syncfusion/ej2-inputs';
import { Schedule } from '../base/schedule';
import { ResourcesModel } from '../models/models';
import { RecurrenceEditor } from '../../recurrence-editor/index';
import {
    CellClickEventArgs, EventClickArgs, EventFieldsMapping, PopupOpenEventArgs,
    EventRenderedArgs, EJ2Instance, TdData, PopupCloseEventArgs, CallbackFunction
} from '../base/interface';
import { PopupType, TemplateType } from '../base/type';
import { FieldValidator } from './form-validator';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

const EVENT_FIELD: string = 'e-field';

/**
 * Quick Popups interactions
 */
export class QuickPopups {
    private l10n: L10n;
    private parent: Schedule;
    private isMultipleEventSelect: boolean = false;
    public quickDialog: Dialog;
    public quickPopup: Popup;
    public morePopup: Popup;
    private fieldValidator: FieldValidator;
    private isCrudAction: boolean = false;
    public lastEvent: Record<string, any>;
    private dialogEvent: Event;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fieldValidator = new FieldValidator();
        this.render();
        this.addEventListener();
    }

    private render(): void {
        this.renderQuickPopup();
        this.renderMorePopup();
        this.renderQuickDialog();
    }

    private renderQuickPopup(): void {
        const quickPopupWrapper: HTMLElement = createElement('div', { className: cls.POPUP_WRAPPER_CLASS + ' e-popup-close', attrs: { role: 'dialog' } });
        if (this.parent.isAdaptive) {
            document.body.appendChild(quickPopupWrapper);
            addClass([quickPopupWrapper], cls.DEVICE_CLASS);
        } else {
            this.parent.element.appendChild(quickPopupWrapper);
        }
        this.quickPopup = new Popup(quickPopupWrapper, {
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            open: this.quickPopupOpen.bind(this),
            close: this.quickPopupClose.bind(this),
            hideAnimation: (this.parent.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
            showAnimation: (this.parent.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } :
                (this.parent.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'none', Y: 'fit' })),
            position: (this.parent.isAdaptive || this.parent.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1004 : 3)
        });
    }

    private renderMorePopup(): void {
        const moreEventPopup: string = `<div class="${cls.MORE_EVENT_POPUP_CLASS}"><div class="${cls.MORE_EVENT_HEADER_CLASS}">` +
            `<div class="${cls.MORE_EVENT_CLOSE_CLASS}" title="${this.l10n.getConstant('close')}" tabindex="0" role="button"></div>` +
            `<div class="${cls.MORE_EVENT_DATE_HEADER_CLASS}"><div class="${cls.MORE_EVENT_HEADER_DAY_CLASS}" id="${this.parent.element.id}_more_popup"></div>` +
            `<div class="${cls.MORE_EVENT_HEADER_DATE_CLASS} ${cls.NAVIGATE_CLASS}" tabindex="0" role="link"></div></div></div></div>`;
        const moreEventWrapper: HTMLElement = createElement('div', {
            className: cls.MORE_POPUP_WRAPPER_CLASS + ' e-popup-close',
            innerHTML: moreEventPopup
        });
        if (this.parent.isAdaptive) {
            document.body.appendChild(moreEventWrapper);
            addClass([moreEventWrapper], cls.DEVICE_CLASS);
        } else {
            this.parent.element.appendChild(moreEventWrapper);
        }
        this.morePopup = new Popup(moreEventWrapper, {
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'ZoomOut', duration: 300 },
            showAnimation: { name: 'ZoomIn', duration: 300 },
            open: this.morePopupOpen.bind(this),
            close: this.morePopupClose.bind(this),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } :
                (this.parent.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'flip', Y: 'flip' })),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1002 : 2)
        });
        this.morePopup.element.setAttribute('role', 'dialog');
        this.morePopup.element.setAttribute('aria-labelledby', this.parent.element.id + '_more_popup');
        const closeButton: HTMLButtonElement = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-round', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeButton, this.closeClick);
        EventHandler.add(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS), 'click', this.navigationClick, this);
    }

    private renderQuickDialog(): void {
        const buttonModel: ButtonPropsModel[] = [
            { buttonModel: { cssClass: 'e-quick-alertok e-flat', isPrimary: true }, click: this.dialogButtonClick.bind(this) },
            { buttonModel: { cssClass: 'e-quick-alertcancel e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this) },
            {
                buttonModel: { cssClass: 'e-quick-dialog-cancel e-disable e-flat', isPrimary: false },
                click: this.dialogButtonClick.bind(this)
            }];
        if (this.parent.eventSettings.editFollowingEvents) {
            const followingSeriesButton: ButtonPropsModel = {
                buttonModel: { cssClass: 'e-quick-alertfollowing e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this)
            };
            buttonModel.splice(1, 0, followingSeriesButton);
        }
        this.quickDialog = new Dialog({
            animationSettings: { effect: 'Zoom' },
            buttons: buttonModel,
            cssClass: cls.QUICK_DIALOG_CLASS,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            beforeClose: this.beforeQuickDialogClose.bind(this),
            isModal: true,
            position: { X: 'center', Y: 'center' },
            showCloseIcon: true,
            target: document.body,
            visible: false,
            width: 'auto'
        });
        const dialogElement: HTMLElement = createElement('div', { id: this.parent.element.id + 'QuickDialog' });
        this.parent.element.appendChild(dialogElement);
        this.quickDialog.appendTo(dialogElement);
        const okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.setAttribute('aria-label', this.l10n.getConstant('occurrence'));
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        const cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('series'));
            cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        if (this.quickDialog.element.querySelector('.e-dlg-closeicon-btn')) {
            this.quickDialog.element.querySelector('.e-dlg-closeicon-btn').setAttribute('title', this.l10n.getConstant('close'));
        }
    }

    // eslint-disable-next-line max-len
    private renderButton(className: string, iconName: string, isDisabled: boolean, element: HTMLButtonElement, clickEvent: CallbackFunction): void {
        const buttonObj: Button = new Button({
            cssClass: className,
            disabled: isDisabled,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            iconCss: iconName
        });
        buttonObj.appendTo(element);
        EventHandler.add(element, 'click', clickEvent, this);
        removeClass([element], cls.ICON);
    }

    private quickDialogClass(action: string): void {
        const classList: string[] = [
            cls.QUICK_DIALOG_OCCURRENCE_CLASS, cls.QUICK_DIALOG_SERIES_CLASS, cls.QUICK_DIALOG_DELETE_CLASS,
            cls.QUICK_DIALOG_CANCEL_CLASS, cls.QUICK_DIALOG_ALERT_BTN_CLASS, cls.DISABLE_CLASS
        ];
        const okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        const cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        const followingEventButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_FOLLOWING);
        removeClass([okButton, cancelButton], classList);
        addClass([this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_CANCEL_CLASS)], cls.DISABLE_CLASS);
        if (this.parent.eventSettings.editFollowingEvents) {
            addClass([followingEventButton], cls.DISABLE_CLASS);
            removeClass([this.quickDialog.element], cls.FOLLOWING_EVENTS_DIALOG);
        }
        switch (action) {
        case 'Recurrence':
            addClass([okButton], cls.QUICK_DIALOG_OCCURRENCE_CLASS);
            addClass([cancelButton], cls.QUICK_DIALOG_SERIES_CLASS);
            if (this.parent.eventSettings.editFollowingEvents) {
                removeClass([followingEventButton], cls.DISABLE_CLASS);
                addClass([this.quickDialog.element], cls.FOLLOWING_EVENTS_DIALOG);
                addClass([followingEventButton], cls.QUICK_DIALOG_FOLLOWING_EVENTS_CLASS);
            }
            break;
        case 'Delete':
            addClass([okButton], cls.QUICK_DIALOG_DELETE_CLASS);
            addClass([cancelButton], cls.QUICK_DIALOG_CANCEL_CLASS);
            break;
        case 'Alert':
            addClass([okButton], [cls.QUICK_DIALOG_ALERT_OK, cls.QUICK_DIALOG_ALERT_BTN_CLASS]);
            addClass([cancelButton], [cls.QUICK_DIALOG_ALERT_CANCEL, cls.DISABLE_CLASS]);
            break;
        }
    }

    private applyFormValidation(): void {
        const form: HTMLFormElement = this.quickPopup.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        const rules: Record<string, any> = {};
        rules[this.parent.eventSettings.fields.subject.name] = this.parent.eventSettings.fields.subject.validation;
        this.fieldValidator.renderFormValidator(form, rules, this.quickPopup.element, this.parent.locale);
    }

    public openRecurrenceAlert(): void {
        const editDeleteOnly: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (editDeleteOnly) {
            editDeleteOnly.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
            editDeleteOnly.setAttribute('aria-label', editDeleteOnly.innerHTML);
        }
        const editFollowingEventsOnly: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_FOLLOWING);
        if (editFollowingEventsOnly) {
            editFollowingEventsOnly.innerHTML = this.l10n.getConstant('editFollowingEvent');
            editFollowingEventsOnly.setAttribute('aria-label', editFollowingEventsOnly.innerHTML);
        }
        const editDeleteSeries: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (editDeleteSeries) {
            editDeleteSeries.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteSeries' : 'editSeries');
            editDeleteSeries.setAttribute('aria-label', editDeleteSeries.innerHTML);
        }
        this.quickDialog.content = this.l10n.getConstant('editContent');
        this.quickDialog.header = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteTitle' : 'editTitle');
        this.quickDialogClass('Recurrence');
        this.showQuickDialog('RecurrenceAlert');
    }

    public openRecurrenceValidationAlert(type: string): void {
        this.quickDialogClass('Alert');
        const okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        okButton.innerHTML = this.l10n.getConstant('ok');
        okButton.setAttribute('aria-label', okButton.innerHTML);
        const cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        cancelButton.innerHTML = this.l10n.getConstant('cancel');
        cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        this.quickDialog.header = this.l10n.getConstant('alert');
        let dialogCancel: Element;
        switch (type) {
        case 'wrongPattern':
            addClass([cancelButton], cls.DISABLE_CLASS);
            this.quickDialog.content = this.l10n.getConstant('wrongPattern');
            break;
        case 'createError':
            addClass([cancelButton], cls.DISABLE_CLASS);
            this.quickDialog.content = this.l10n.getConstant('createError');
            break;
        case 'sameDayAlert':
            addClass([cancelButton], cls.DISABLE_CLASS);
            this.quickDialog.content = this.l10n.getConstant('sameDayAlert');
            break;
        case 'seriesChangeAlert':
            dialogCancel = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_CANCEL_CLASS);
            removeClass([cancelButton, dialogCancel], cls.DISABLE_CLASS);
            this.quickDialog.content = this.l10n.getConstant('seriesChangeAlert');
            okButton.innerHTML = this.l10n.getConstant('yes');
            cancelButton.innerHTML = this.l10n.getConstant('no');
            dialogCancel.innerHTML = this.l10n.getConstant('cancel');
            break;
        case 'occurrenceAlert':
            addClass([cancelButton], cls.DISABLE_CLASS);
            this.quickDialog.content = this.l10n.getConstant('occurenceAlert');
            break;
        }
        if ((!this.parent.enableRecurrenceValidation && type === 'wrongPattern') || this.parent.enableRecurrenceValidation) {
            this.showQuickDialog('RecurrenceValidationAlert');
        }
    }

    public openDeleteAlert(): void {
        if (this.parent.activeViewOptions.readonly) {
            return;
        }
        const okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('delete');
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        const cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
            cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        this.quickDialog.content = ((<Record<string, any>[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleContent') : this.l10n.getConstant('deleteContent');
        this.quickDialog.header = ((<Record<string, any>[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleEvent') : this.l10n.getConstant('deleteEvent');
        this.quickDialogClass('Delete');
        this.showQuickDialog('DeleteAlert');
    }

    public openValidationError(type: string, eventData?: Record<string, any> | Record<string, any>[]): void {
        this.quickDialog.header = this.l10n.getConstant('alert');
        this.quickDialog.content = this.l10n.getConstant(type);
        const okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('ok');
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        const cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
            okButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        this.quickDialogClass('Alert');
        this.showQuickDialog(type === 'overlapAlert' ? 'OverlapAlert' : 'ValidationAlert', eventData);
    }

    private showQuickDialog(popupType: PopupType, eventData?: Record<string, any> | Record<string, any>[]): void {
        this.quickDialog.dataBind();
        const eventProp: PopupOpenEventArgs = {
            type: popupType, cancel: false, element: this.quickDialog.element,
            data: extend({}, (eventData || this.parent.activeEventData.event), null, true) as Record<string, any>
        };
        if (!this.parent.activeViewOptions.allowOverlap) {
            eventProp.overlapEvents = this.parent.overlapAppointments;
        }
        this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
            if (!popupArgs.cancel) {
                this.quickDialog.show();
            }
        });
    }

    private createMoreEventList(eventCollection: Record<string, any>[], groupOrder: string[], groupIndex: string): HTMLElement {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const moreEventContentEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_CONTENT_CLASS });
        let moreEventWrapperEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_WRAPPER_CLASS });
        if (eventCollection.length === 0) {
            moreEventWrapperEle = createElement('div', {
                className: cls.MORE_EVENT_CONTENT_CLASS,
                innerHTML: this.l10n.getConstant('emptyContainer')
            });
        } else {
            for (const eventData of eventCollection) {
                const eventText: string = (eventData[fields.subject] || this.parent.eventSettings.fields.subject.default
                    || this.parent.localeObj.getConstant('addTitle')) as string;
                const appointmentElement: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_CLASS,
                    attrs: {
                        'data-id': '' + eventData[fields.id],
                        'data-guid': eventData.Guid as string, 'role': 'button', 'tabindex': '0',
                        'aria-disabled': this.parent.eventBase.getReadonlyAttribute(eventData),
                        'aria-label': this.parent.getAnnouncementString(eventData)
                    }
                });
                if (eventData[fields.isReadonly]) {
                    addClass([appointmentElement], 'e-read-only');
                }
                let templateElement: HTMLElement[];
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    const tempId: string = this.parent.element.id + '_' + this.parent.activeViewOptions.eventTemplateName + 'eventTemplate';
                    templateElement = this.parent.getAppointmentTemplate()(eventData, this.parent, 'eventTemplate', tempId, false,
                                                                           undefined, undefined, this.parent.root);
                    append(templateElement, appointmentElement);
                } else {
                    appointmentElement.appendChild(createElement('div', { className: cls.SUBJECT_CLASS }));
                    this.parent.sanitize(eventText, appointmentElement.firstElementChild as HTMLElement);
                }
                if (!isNullOrUndefined(groupIndex)) {
                    appointmentElement.setAttribute('data-group-index', groupIndex);
                }
                if (!isNullOrUndefined(eventData[fields.recurrenceRule])) {
                    const iconClass: string = (eventData[fields.id] === eventData[fields.recurrenceID]) ?
                        cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
                    appointmentElement.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
                }
                const args: EventRenderedArgs = {
                    data: extend({}, eventData, null, true) as Record<string, any>,
                    element: appointmentElement, cancel: false
                };
                this.parent.trigger(event.eventRendered, args, (eventArgs: EventRenderedArgs) => {
                    if (!eventArgs.cancel) {
                        moreEventWrapperEle.appendChild(appointmentElement);
                        const isPreventCrud: boolean = this.parent.isAdaptive || this.parent.currentView === 'Year';
                        this.parent.eventBase.wireAppointmentEvents(appointmentElement, eventData, isPreventCrud);
                        this.parent.eventBase.applyResourceColor(appointmentElement, eventData, 'backgroundColor', groupOrder);
                    }
                });
            }
        }
        moreEventContentEle.appendChild(moreEventWrapperEle);
        return moreEventContentEle;
    }

    public tapHoldEventPopup(e: Event): void {
        const target: Element = closest(<HTMLElement>e.target, '.' + cls.APPOINTMENT_CLASS);
        this.parent.selectedElements = [];
        this.isMultipleEventSelect = true;
        this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        const guid: string = target.getAttribute('data-guid');
        const eventObj: Record<string, any> = this.parent.eventBase.getEventByGuid(guid);
        if (isNullOrUndefined(eventObj)) {
            return;
        }
        const eventTitle: string = (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string;
        const eventTemplate: string = `<div class="${cls.MULTIPLE_EVENT_POPUP_CLASS}"><div class="${cls.POPUP_HEADER_CLASS}">` +
            `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button>` +
            `<div class="${cls.SUBJECT_CLASS}">${eventTitle}</div>` +
            `<button class="${cls.EDIT_CLASS}" title="${this.l10n.getConstant('edit')}"></button>` +
            `<button class="${cls.DELETE_CLASS}" title="${this.l10n.getConstant('delete')}"></button></div></div>`;
        this.quickPopup.element.innerHTML = eventTemplate;
        const closeIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.closeClick);
        const readonly: boolean = this.parent.activeViewOptions.readonly || eventObj[this.parent.eventFields.isReadonly] as boolean;
        const editAction: boolean = !this.parent.eventSettings.allowEditing || readonly;
        const deleteAction: boolean = !this.parent.eventSettings.allowDeleting || readonly;
        const editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
        if (editIcon) {
            this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.EDIT_ICON_CLASS, editAction, editIcon, this.editClick);
        }
        const deleteIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
        if (deleteIcon) {
            this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.DELETE_ICON_CLASS, deleteAction, deleteIcon, this.deleteClick);
        }
        this.beforeQuickPopupOpen(target, this.parent.eventBase.getPageCoordinates(e as MouseEvent & TouchEvent));
    }

    private isCellBlocked(args: CellClickEventArgs): boolean {
        const tempObj: Record<string, any> = {};
        tempObj[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        tempObj[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        tempObj[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const targetCell: HTMLElement = args.element instanceof Array ? args.element[0] : args.element;
            const groupIndex: number = parseInt(targetCell.getAttribute('data-group-index'), 10);
            this.parent.resourceBase.setResourceValues(tempObj, isNaN(groupIndex) ? null : groupIndex);
        }
        return this.parent.eventBase.isBlockRange(tempObj);
    }

    private cellClick(args: CellClickEventArgs): void {
        const date: Date = new Date(args.startTime.getTime());
        if (!this.parent.showQuickInfo || !this.parent.eventSettings.allowAdding ||
            this.parent.currentView === 'MonthAgenda' || this.isCellBlocked(args) ||
            !this.parent.isMinMaxDate(new Date(date.setHours(0, 0, 0, 0)))) {
            this.quickPopupHide();
            return;
        }
        const targetEle: Element = !isNullOrUndefined(args.event) ? args.event.target as Element : args.element as Element;
        if (this.parent.isAdaptive) {
            this.quickPopupHide();
            let newEventClone: HTMLElement = this.parent.element.querySelector('.' + cls.NEW_EVENT_CLASS) as HTMLElement;
            if (isNullOrUndefined(newEventClone)) {
                newEventClone = createElement('div', {
                    className: cls.NEW_EVENT_CLASS,
                    innerHTML: `<div class="e-title">+ ${this.l10n.getConstant('newEvent')}</div>`
                });
            }
            const targetCell: Element = closest(targetEle, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS);
            if (targetCell) {
                targetCell.appendChild(newEventClone);
            }
            return;
        }
        const target: Element = closest(targetEle, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' +
            cls.HEADER_CELLS_CLASS);
        if (isNullOrUndefined(target) || targetEle.classList.contains(cls.MORE_INDICATOR_CLASS)) {
            return;
        }
        const isSameTarget: boolean = this.quickPopup.relateTo === target;
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            const subjectElement: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
            if (subjectElement) {
                subjectElement.focus();
            }
            return;
        } else if (this.quickPopup.element) {
            this.destroyPopupButtons('quickPopup');
        }
        const temp: Record<string, any> = {};
        temp[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        temp[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        temp[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        const quickCellPopup: HTMLElement = createElement('div', { className: cls.CELL_POPUP_CLASS });
        quickCellPopup.appendChild(this.getPopupHeader('Cell', temp));
        quickCellPopup.appendChild(this.getPopupContent('Cell', args, temp));
        quickCellPopup.appendChild(this.getPopupFooter('Cell', temp));
        this.quickPopup.element.setAttribute('aria-label', this.l10n.getConstant('newEvent'));
        const subjectElement: HTMLInputElement = quickCellPopup.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectElement) {
            Input.createInput({ element: subjectElement, properties: { placeholder: this.l10n.getConstant('addTitle') } });
        }
        if (!isNullOrUndefined(this.parent.eventSettings.fields.subject.default)) {
            subjectElement.value = this.parent.eventSettings.fields.subject.default;
        }
        const closeIcon: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        if (closeIcon) {
            this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.popupClose);
        }
        const moreButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS) as HTMLButtonElement;
        if (moreButton) {
            this.renderButton('e-flat', '', false, moreButton, this.detailsClick);
        }
        const saveButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.EVENT_CREATE_CLASS) as HTMLButtonElement;
        if (saveButton) {
            this.renderButton('e-flat e-primary', '', this.parent.activeViewOptions.readonly, saveButton, this.saveClick);
        }
        if (this.morePopup) { this.morePopup.hide(); }
        this.quickPopup.content = quickCellPopup;
        this.quickPopup.relateTo = target as HTMLElement;
        this.quickPopup.dataBind();
        this.beforeQuickPopupOpen(target, this.parent.eventBase.getPageCoordinates(args.event as MouseEvent & TouchEvent));
    }

    private isSameEventClick(events: EventClickArgs): boolean {
        const isSameTarget: boolean = this.quickPopup.relateTo === closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS);
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            const editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            if (editIcon) {
                editIcon.focus();
            }
            if (!this.parent.isAdaptive) {
                const editButton: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
                if (editButton) {
                    editButton.focus();
                }
            }
            return true;
        }
        return false;
    }

    private isQuickTemplate(type: TemplateType): boolean {
        return this.parent.quickInfoTemplates.templateType === 'Both' || this.parent.quickInfoTemplates.templateType === type;
    }

    private eventClick(events: EventClickArgs): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        if (!this.parent.showQuickInfo) { return; }
        if (this.parent.isAdaptive && this.isMultipleEventSelect) {
            this.updateTapHoldEventPopup(closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS));
        } else {
            const isSameTarget: boolean = this.isSameEventClick(events);
            this.parent.selectedElements = [];
            if (isSameTarget) {
                return;
            } else if (this.quickPopup.element) {
                this.destroyPopupButtons('quickPopup');
            }
            const eventData: Record<string, any> = <Record<string, any>>events.event;
            const quickEventPopup: HTMLElement = createElement('div', { className: cls.EVENT_POPUP_CLASS });
            quickEventPopup.appendChild(this.getPopupHeader('Event', eventData));
            quickEventPopup.appendChild(this.getPopupContent('Event', events, eventData));
            quickEventPopup.appendChild(this.getPopupFooter('Event', eventData));
            this.quickPopup.element.setAttribute('aria-label', this.l10n.getConstant('editEvent'));
            const readonly: boolean = this.parent.activeViewOptions.readonly || eventData[this.parent.eventFields.isReadonly] as boolean;
            const editAction: boolean = !this.parent.eventSettings.allowEditing || readonly;
            const deleteAction: boolean = !this.parent.eventSettings.allowDeleting || readonly;
            const editIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            const buttonClass: string = 'e-flat e-round e-small';
            if (editIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.EDIT_ICON_CLASS, editAction, editIcon, this.editClick);
            }
            const deleteIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
            if (deleteIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.DELETE_ICON_CLASS, deleteAction, deleteIcon, this.deleteClick);
            }
            const closeIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
            if (closeIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.popupClose);
            }
            const editButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
            if (editButton) {
                this.renderButton('e-flat e-primary', '', editAction, editButton, this.editClick);
            }
            const deleteButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLButtonElement;
            if (deleteButton) {
                this.renderButton('e-flat', '', deleteAction, deleteButton, this.deleteClick);
            }
            if (this.morePopup && !closest(<Element>events.element, '.' + cls.MORE_EVENT_WRAPPER_CLASS)) { this.morePopup.hide(); }
            this.quickPopup.content = quickEventPopup;
            this.quickPopup.relateTo = this.parent.isAdaptive ? document.body :
                closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS) as HTMLElement;
            this.quickPopup.dataBind();
            this.beforeQuickPopupOpen(events.element as Element, this.parent.eventBase.getPageCoordinates((events as any).originalEvent));
        }
    }

    private getPopupHeader(headerType: TemplateType, headerData: Record<string, any>): HTMLElement {
        const headerTemplate: HTMLElement = createElement('div', { className: cls.POPUP_HEADER_CLASS });
        if (this.isQuickTemplate(headerType) && this.parent.quickInfoTemplates.header) {
            const headerArgs: Record<string, any> =
                extend({}, headerData, { elementType: headerType.toLowerCase() }, true) as Record<string, any>;
            const templateId: string = this.parent.element.id;
            const headerTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesHeader()(headerArgs, this.parent, 'header', templateId + '_headerTemplate', false));
            append([].slice.call(headerTemp), headerTemplate);
        } else {
            let header: string;
            let args: Record<string, any>;
            switch (headerType) {
            case 'Cell':
                header = `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}"><button class="${cls.CLOSE_CLASS}" title=` +
                    `"${this.l10n.getConstant('close')}"></button></div>`;
                break;
            case 'Event':
                args = this.getFormattedString(headerData);
                header = `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}">` +
                    `<button class="${cls.EDIT_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('edit')}"></button>` +
                    `<button class="${cls.DELETE_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('delete')}"></button>` +
                    `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>` +
                    `<div class="${cls.SUBJECT_WRAP}"><div class="${cls.SUBJECT_CLASS} ${cls.TEXT_ELLIPSIS}" ` +
                    `title="${args.eventSubject ? args.eventSubject.replaceAll('"', '\'') : args.eventSubject}"></div></div >`;
                break;
            }
            const templateWrapper: HTMLElement = createElement('div', { innerHTML: header });
            if (headerType === 'Event') {
                const subjectText: HTMLElement = templateWrapper.querySelector('.' + cls.SUBJECT_CLASS);
                this.parent.sanitize(args.eventSubject, subjectText);
            }
            append([].slice.call(templateWrapper.childNodes), headerTemplate);
        }
        return headerTemplate;
    }

    private getPopupContent(type: TemplateType, args: CellClickEventArgs | EventClickArgs, data: Record<string, any>): HTMLElement {
        const contentTemplate: HTMLElement = createElement('div', { className: cls.POPUP_CONTENT_CLASS });
        if (this.isQuickTemplate(type) && this.parent.quickInfoTemplates.content) {
            const contentArgs: Record<string, any> =
                extend({}, data, { elementType: type.toLowerCase() }, true) as Record<string, any>;
            const templateId: string = this.parent.element.id;
            const contentTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesContent()(contentArgs, this.parent, 'content', templateId + '_contentTemplate', false));
            append([].slice.call(contentTemp), contentTemplate);
        } else {
            let content: string;
            let cellDetails: Record<string, any>;
            let argsData: Record<string, any>;
            const resourceText: string = this.getResourceText(args, type.toLowerCase());
            switch (type) {
            case 'Cell':
                cellDetails = this.getFormattedString(data);
                content = `<table class="${cls.POPUP_TABLE_CLASS}"><tbody><tr><td><form class="${cls.FORM_CLASS}">
                    <input class="${cls.SUBJECT_CLASS} ${EVENT_FIELD}" type="text" name=` +
                    `"${this.parent.eventFields.subject}" /></form></td></tr><tr><td><div class="${cls.DATE_TIME_CLASS}">` +
                    `<div class="${cls.DATE_TIME_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.DATE_TIME_DETAILS_CLASS} ` +
                    `${cls.TEXT_ELLIPSIS}">${cellDetails.details}</div></div>` +
                    `${this.parent.activeViewOptions.group.resources.length > 0 ? `<div class="${cls.RESOURCE_CLASS}">` +
                        `<div class="${cls.RESOURCE_ICON_CLASS} ${cls.ICON} "></div><div class="${cls.RESOURCE_DETAILS_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}"></div></div>` : ''}</td></tr></tbody></table>`;
                break;
            case 'Event':
                argsData = this.getFormattedString(data);
                content = '<div class="' + cls.DATE_TIME_CLASS + '"><div class="' + cls.DATE_TIME_ICON_CLASS + ' ' + cls.ICON +
                    '"></div><div class="' + cls.DATE_TIME_WRAPPER_CLASS + ' ' + cls.TEXT_ELLIPSIS + '"><div class="' +
                    cls.DATE_TIME_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' + argsData.details + '</div>';
                if (data[this.parent.eventFields.recurrenceRule]) {
                    content += '<div class="' + cls.RECURRENCE_SUMMARY_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                        this.getRecurrenceSummary(data) + '</div>';
                }
                content += '</div></div>';
                if (data[this.parent.eventFields.location]) {
                    content += '<div class="' + cls.LOCATION_CLASS + '"><div class="' + cls.LOCATION_ICON_CLASS + ' ' +
                    cls.ICON + '"></div><div class="' + cls.LOCATION_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '"></div></div>';
                }
                if (data[this.parent.eventFields.startTimezone] || data[this.parent.eventFields.endTimezone]) {
                    content += '<div class="' + cls.TIME_ZONE_CLASS + '"><div class="' + cls.TIME_ZONE_ICON_CLASS + ' ' + cls.ICON +
                        '"></div><div class="' + cls.TIME_ZONE_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                        this.getTimezone(data) + '</div></div>';
                }
                if (data[this.parent.eventFields.description]) {
                    content += '<div class="' + cls.DESCRIPTION_CLASS + '"><div class="' + cls.DESCRIPTION_ICON_CLASS + ' ' + cls.ICON +
                    '"></div><div class="' + cls.DESCRIPTION_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '"></div></div>';
                }
                if (this.parent.resourceCollection.length > 0) {
                    content += '<div class="' + cls.RESOURCE_CLASS + '"><div class="' + cls.RESOURCE_ICON_CLASS + ' ' + cls.ICON +
                    '"></div><div class="' + cls.RESOURCE_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '"></div></div>';
                }
                break;
            }
            const templateWrapper: HTMLElement = createElement('div', { innerHTML: content });
            const form: HTMLElement = templateWrapper.querySelector('form');
            if (form) {
                form.onsubmit = () => { return false; };
            }
            if (data[this.parent.eventFields.location]) {
                const locationDetails: HTMLElement = templateWrapper.querySelector('.' + cls.LOCATION_DETAILS_CLASS);
                if (!isNullOrUndefined(locationDetails)) {
                    this.parent.sanitize(data[this.parent.eventFields.location], locationDetails);
                }
            }
            if (data[this.parent.eventFields.description]) {
                const descriptionDetails: HTMLElement = templateWrapper.querySelector('.' + cls.DESCRIPTION_DETAILS_CLASS);
                if (!isNullOrUndefined(descriptionDetails)) {
                    this.parent.sanitize(data[this.parent.eventFields.description], descriptionDetails);
                }
            }
            if (resourceText) {
                const resourceDetails: HTMLElement = templateWrapper.querySelector('.' + cls.RESOURCE_DETAILS_CLASS);
                if (!isNullOrUndefined(resourceDetails)) {
                    this.parent.sanitize(resourceText, resourceDetails);
                }
            }
            append([].slice.call(templateWrapper.childNodes), contentTemplate);
        }
        return contentTemplate;
    }

    private getPopupFooter(footerType: TemplateType, footerData: Record<string, any>): HTMLElement {
        const footerTemplate: HTMLElement = createElement('div', { className: cls.POPUP_FOOTER_CLASS });
        if (this.isQuickTemplate(footerType) && this.parent.quickInfoTemplates.footer) {
            const footerArgs: Record<string, any> =
                extend({}, footerData, { elementType: footerType.toLowerCase() }, true) as Record<string, any>;
            const templateId: string = this.parent.element.id;
            const footerTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesFooter()(footerArgs, this.parent, 'footer', templateId + '_footerTemplate', false));
            append([].slice.call(footerTemp), footerTemplate);
        } else {
            let footer: string;
            switch (footerType) {
            case 'Cell':
                footer = `<button class="${cls.QUICK_POPUP_EVENT_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS}" title=` +
                    `"${this.l10n.getConstant('moreDetails')}">${this.l10n.getConstant('moreDetails')}</button>` +
                    `<button class="${cls.EVENT_CREATE_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('save')}">` +
                    `${this.l10n.getConstant('save')}</button>`;
                break;
            case 'Event':
                footer = `${this.parent.isAdaptive ? '' : `<button class="${cls.EDIT_EVENT_CLASS} ` +
                    `${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('edit')}">${this.l10n.getConstant('edit')}</button>` +
                    `<button class="${cls.DELETE_EVENT_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('delete')}">` +
                    `${this.l10n.getConstant('delete')}</button>`}`;
                break;
            }
            const templateWrapper: HTMLElement = createElement('div', { innerHTML: footer });
            append([].slice.call(templateWrapper.childNodes), footerTemplate);
        }
        return footerTemplate;
    }

    public getResourceText(args: CellClickEventArgs | EventClickArgs, type: string): string {
        if (this.parent.resourceCollection.length === 0) {
            return null;
        }
        let resourceValue: string = '';
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            const resourceCollection: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            const resourceData: Record<string, number>[] = resourceCollection.dataSource as Record<string, number>[];
            if (type === 'event') {
                const eventData: Record<string, any> = args.event as Record<string, any>;
                for (const data of resourceData) {
                    const resourceId: number | number[] = eventData[resourceCollection.field] as number | number[];
                    if (resourceId instanceof Array) {
                        if (resourceId.indexOf(data[resourceCollection.idField]) > -1) {
                            const id: number = resourceId[resourceId.indexOf(data[resourceCollection.idField])];
                            const resource: Record<string, number> = resourceData.filter((e: Record<string, number>) =>
                                e[resourceCollection.idField] === id)[0];
                            resourceValue += (resourceValue === '') ? resource[resourceCollection.textField] :
                                ', ' + resource[resourceCollection.textField];
                        }
                    } else if (data[resourceCollection.idField] === resourceId) {
                        resourceValue = data[resourceCollection.textField].toString();
                    }
                }
            } else {
                resourceValue = resourceData[0][resourceCollection.textField].toString();
            }
        } else {
            if (type === 'event') {
                const eventData: Record<string, any> = args.event as Record<string, any>;
                let resourceData: string[];
                let lastResource: ResourcesModel;
                for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
                    resourceData = eventData[this.parent.resourceBase.resourceCollection[parseInt(i.toString(), 10)].field] as string[];
                    if (!isNullOrUndefined(resourceData)) {
                        lastResource = this.parent.resourceBase.resourceCollection[parseInt(i.toString(), 10)];
                        break;
                    }
                }
                if (!Array.isArray(resourceData)) {
                    resourceData = [resourceData];
                }
                const resNames: string[] = [];
                const lastResourceData: Record<string, any>[] = lastResource.dataSource as Record<string, any>[];
                resourceData.forEach((value: string) => {
                    let text: string;
                    const i: number = util.findIndexInData(lastResourceData, lastResource.idField, value);
                    if (i > -1) {
                        text = lastResourceData[parseInt(i.toString(), 10)][lastResource.textField] as string;
                    }
                    if (text) { resNames.push(text); }
                });
                resourceValue = resNames.join(', ');
            } else {
                const argsData: CellClickEventArgs = args as CellClickEventArgs;
                const groupIndex: number = !isNullOrUndefined(argsData.groupIndex) ? argsData.groupIndex : 0;
                const resourceDetails: TdData = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex.toString(), 10)];
                resourceValue = resourceDetails.resourceData[resourceDetails.resource.textField] as string;
            }
        }
        return resourceValue;
    }

    private getFormattedString(eventData: Record<string, any>): Record<string, any> {
        const fields: EventFieldsMapping = this.parent.eventFields;
        const eventSubject: string = (eventData[fields.subject] || this.l10n.getConstant('noTitle')) as string;
        const startDate: Date = eventData[fields.startTime] as Date;
        const endDate: Date = eventData[fields.endTime] as Date;
        const startDateDetails: string = this.getDateFormat(startDate, 'long');
        const endDateDetails: string = (eventData[fields.isAllDay] && endDate.getHours() === 0 && endDate.getMinutes() === 0) ?
            this.getDateFormat(util.addDays(new Date(endDate.getTime()), -1), 'long') :
            this.getDateFormat(endDate, 'long');
        const startTimeDetail: string = this.parent.getTimeString(startDate);
        const endTimeDetail: string = this.parent.getTimeString(endDate);
        let details: string = '';
        const spanLength: number = endDate.getDate() !== startDate.getDate() &&
            (endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) < 24 ? 1 : 0;
        if (eventData[fields.isAllDay]) {
            details = startDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            if (((util.getUniversalTime(endDate) - util.getUniversalTime(startDate)) / util.MS_PER_DAY) > 1) {
                details += '&nbsp;-&nbsp;' + endDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            }
        } else if ((((util.getUniversalTime(endDate) - util.getUniversalTime(startDate)) / util.MS_PER_DAY) >= 1) || spanLength > 0) {
            details = startDateDetails + ' (' + startTimeDetail + ')' + '&nbsp;-&nbsp;' + endDateDetails + ' (' + endTimeDetail + ')';
        } else {
            details = startDateDetails + ' (' + (startTimeDetail + '&nbsp;-&nbsp;' + endTimeDetail) + ')';
        }
        return { eventSubject: eventSubject, details: details };
    }

    public moreEventClick(data: EventClickArgs, endDate: Date, groupIndex?: string): void {
        this.quickPopupHide(true);
        const moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        const selectedDate: string = ((data.date).getTime()).toString();
        const target: Element = closest(<Element>data.element, '.' + cls.MORE_INDICATOR_CLASS + ',.' + cls.WORK_CELLS_CLASS);
        const day: string = this.parent.globalize.formatDate(data.date, { format: 'E', calendar: this.parent.getCalendarMode() });
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DAY_CLASS).innerHTML = util.capitalizeFirstWord(day, 'single');
        const dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        dateElement.innerHTML = this.getDateFormat(data.date, 'd');
        dateElement.setAttribute('data-date', selectedDate);
        dateElement.setAttribute('data-end-date', endDate.getTime().toString());
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            dateElement.setAttribute('data-group-index', groupIndex);
            groupOrder = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)].groupOrder;
        }
        const moreEventElements: HTMLElement = this.createMoreEventList(data.event as Record<string, any>[], groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreEventElements);
        removeClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        if (util.resetTime(data.date).getTime() === util.resetTime(this.parent.getCurrentTime()).getTime()) {
            addClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        }
        if (!this.parent.isAdaptive) {
            if (this.parent.currentView.indexOf('Timeline') !== -1) {
                const gIndex: string = target.getAttribute('data-group-index');
                const startDate: Date = new Date(parseInt(target.getAttribute('data-start-date'), 10));
                startDate.setHours(startDate.getHours(), startDate.getMinutes(), 0);
                const tdDate: string = startDate.getTime().toString();
                if (isNullOrUndefined(gIndex)) {
                    this.morePopup.relateTo = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                        ' tbody tr td[data-date="' + tdDate + '"]') as HTMLElement;
                } else {
                    this.morePopup.relateTo = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                        ' tbody tr td[data-group-index="' + gIndex + '"][data-date="' + tdDate + '"]') as HTMLElement;
                    if (isNullOrUndefined(this.morePopup.relateTo)) {
                        const workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS +
                            ' tbody tr td[data-group-index="' + gIndex + '"]'));
                        for (let i: number = 0; i < workCells.length; i++) {
                            const date: string = workCells[parseInt(i.toString(), 10)].getAttribute('data-date');
                            if (date < tdDate) {
                                this.morePopup.relateTo = workCells[parseInt(i.toString(), 10)] as HTMLElement;
                            }
                        }
                    }
                }
            } else {
                this.morePopup.relateTo = closest(<Element>target, '.' + cls.WORK_CELLS_CLASS) as HTMLElement;
            }
        }
        this.parent.renderTemplates(() => {
            const eventProp: PopupOpenEventArgs = {
                type: 'EventContainer', cancel: false,
                element: this.morePopup.element, data: data as unknown as Record<string, any>
            };
            this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
                if (!popupArgs.cancel) {
                    this.morePopup.show();
                }
            });
        });
    }

    private saveClick(event: Event): void {
        this.applyFormValidation();
        this.dialogEvent = event;
        this.isCrudAction = true;
        this.quickPopupHide();
    }

    private detailsClick(event: Event): void {
        const subjectEle: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectEle && subjectEle.value !== '') {
            extend(this.parent.activeCellsData, { subject: subjectEle.value });
        }
        this.dialogEvent = event;
        this.isCrudAction = false;
        this.fieldValidator.destroyToolTip();
        this.quickPopupHide();
        this.parent.eventWindow.openEditor(this.parent.activeCellsData as unknown as Record<string, any>, 'Add');
    }

    private editClick(event: Event): void {
        this.dialogEvent = event;
        this.quickPopupHide(true);
        const data: Record<string, any> = this.parent.activeEventData.event as Record<string, any>;
        this.parent.currentAction = 'EditSeries';
        if (!isNullOrUndefined(data[this.parent.eventFields.recurrenceRule])) {
            this.parent.currentAction = 'EditOccurrence';
            this.openRecurrenceAlert();
        } else {
            this.parent.eventWindow.openEditor(data, this.parent.currentAction);
        }
    }

    public deleteClick(event: Event): void {
        this.dialogEvent = event;
        this.quickPopupHide(true);
        this.parent.currentAction = 'Delete';
        if ((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule]) {
            this.openRecurrenceAlert();
        } else {
            this.openDeleteAlert();
        }
    }
    private updateMoreEventContent(): void {
        if (this.morePopup.element.classList.contains('e-popup-close')) {
            return;
        }
        const moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        const dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        const startDate: Date = new Date(parseInt(dateElement.getAttribute('data-date'), 10));
        const endDate: Date = new Date(parseInt(dateElement.getAttribute('data-end-date'), 10));
        const groupIndex: string = dateElement.getAttribute('data-group-index');
        let data: TdData;
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            groupOrder = data.groupOrder;
        }
        const events: Record<string, any>[] = this.parent.eventBase.filterEvents(startDate, endDate, this.parent.eventsProcessed, data);
        const moreElement: HTMLElement = this.createMoreEventList(events, groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreElement);
    }

    private closeClick(event: Event): void {
        this.dialogEvent = event;
        if (this.parent.currentView === 'Year' && this.parent.activeCellsData && this.parent.activeCellsData.element) {
            this.parent.selectCell(this.parent.activeCellsData.element as HTMLTableCellElement);
        }
        this.quickPopupHide();
        this.morePopup.hide();
    }

    private dialogButtonClick(event: Event): void {
        this.dialogEvent = event;
        this.quickDialog.hide();
        const target: HTMLElement = event.target as HTMLElement;
        const cancelBtn: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        const eventData: Record<string, any> = this.parent.activeEventData.event as Record<string, any>;
        if (target.classList.contains(cls.QUICK_DIALOG_OCCURRENCE_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteOccurrence' : 'EditOccurrence';
            switch (this.parent.currentAction) {
            case 'EditOccurrence':
                this.parent.eventWindow.openEditor(eventData, this.parent.currentAction);
                break;
            case 'DeleteOccurrence':
                this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_FOLLOWING_EVENTS_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteFollowingEvents' : 'EditFollowingEvents';
            switch (this.parent.currentAction) {
            case 'EditFollowingEvents':
                this.parent.eventWindow.openEditor(eventData, this.parent.currentAction);
                break;
            case 'DeleteFollowingEvents':
                this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_SERIES_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteSeries' : 'EditSeries';
            switch (this.parent.currentAction) {
            case 'EditSeries':
                this.parent.eventWindow.openEditor(this.parent.eventBase.getParentEvent(eventData, true), this.parent.currentAction);
                break;
            case 'DeleteSeries':
                this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_DELETE_CLASS)) {
            this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
        } else if (!cancelBtn.classList.contains(cls.DISABLE_CLASS) && (target.classList.contains(cls.QUICK_DIALOG_ALERT_OK) ||
            (target.classList.contains(cls.QUICK_DIALOG_ALERT_CANCEL) && !cancelBtn.classList.contains(cls.QUICK_DIALOG_CANCEL_CLASS)))) {
            this.parent.uiStateValues.isIgnoreOccurrence = target.classList.contains(cls.QUICK_DIALOG_ALERT_CANCEL);
            this.parent.eventWindow.eventSave(event, this.l10n.getConstant('ok'));
        }
    }

    private updateTapHoldEventPopup(target: Element): void {
        const selectedElements: Element[] = this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        if (selectedElements.length > 0) {
            const eventObj: Record<string, any> = this.parent.eventBase.getEventByGuid(selectedElements[0].getAttribute('data-guid'));
            const titleContent: string = (selectedElements.length === 1) ?
                ((<Record<string, any>>eventObj)[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string :
                '(' + selectedElements.length + ')' + '&nbsp;' + this.l10n.getConstant('selectedItems');
            this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS).innerHTML = titleContent;
            if (selectedElements.length > 1) {
                addClass([this.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
            } else {
                removeClass([this.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
            }
        } else {
            this.parent.selectedElements = [];
            this.quickPopupHide();
        }
    }

    private getTimezone(event: Record<string, any>): string {
        let zoneDetails: string = '';
        zoneDetails += event[this.parent.eventFields.startTimezone] as string || '';
        zoneDetails += zoneDetails === '' ? '' : ' - ';
        zoneDetails += event[this.parent.eventFields.endTimezone] as string || '';
        return zoneDetails;
    }

    private getRecurrenceSummary(event: Record<string, any>): string {
        const recurrenceEditor: RecurrenceEditor = this.parent.eventWindow.getRecurrenceEditorInstance();
        if (recurrenceEditor) {
            const ruleSummary: string = recurrenceEditor.getRuleSummary(<string>event[this.parent.eventFields.recurrenceRule]);
            return ruleSummary.charAt(0).toUpperCase() + ruleSummary.slice(1);
        }
        return '';
    }

    private getDateFormat(date: Date, skeletonString: string): string {
        return util.capitalizeFirstWord(
            this.parent.globalize.formatDate(date, { skeleton: skeletonString, calendar: this.parent.getCalendarMode() }),
            'single'
        );
    }

    private getDataFromTarget(target: Element): Record<string, any> {
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            return this.parent.activeEventData.event as Record<string, any>;
        }
        // Deprecated cells data in quick popups
        const eventObj: Record<string, any> = {
            startTime: this.parent.activeCellsData.startTime,
            endTime: this.parent.activeCellsData.endTime,
            isAllDay: this.parent.activeCellsData.isAllDay,
            groupIndex: this.parent.activeCellsData.groupIndex
        };
        const cellsData: Record<string, any> = this.parent.activeCellsData as unknown as Record<string, any>;
        this.parent.eventWindow.convertToEventData(cellsData, eventObj);
        return eventObj;
    }

    private beforeQuickDialogClose(e: BeforeCloseEventArgs): void {
        const args: PopupCloseEventArgs = {
            event: e.event || this.dialogEvent,
            type: (isNullOrUndefined(this.parent.activeEventData.event)) ? 'ValidationAlert' :
                !isNullOrUndefined((<Record<string, any>>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule])
                    ? 'RecurrenceAlert' : 'DeleteAlert', cancel: false, data: this.parent.activeEventData.event as Record<string, any>,
            element: this.quickDialog.element
        };
        this.parent.trigger(event.popupClose, args, (popupCloseArgs: PopupCloseEventArgs) => {
            if (!popupCloseArgs.cancel) {
                this.parent.eventBase.focusElement(true);
            }
        });
    }

    private beforeQuickPopupOpen(target: Element, originalEvent: (MouseEvent & TouchEvent) | Touch): void {
        this.parent.renderTemplates(() => {
            const isEventPopup: Element = this.quickPopup.element.querySelector('.' + cls.EVENT_POPUP_CLASS);
            const popupType: PopupType = this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo';
            const eventProp: PopupOpenEventArgs = {
                type: popupType, cancel: false, data: extend({}, this.getDataFromTarget(target), null, true) as Record<string, any>,
                target: target, element: this.quickPopup.element
            };
            this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
                if (popupArgs.cancel) {
                    this.quickPopupHide();
                    this.destroyPopupButtons('quickPopup');
                    if (popupArgs.element.classList.contains(cls.POPUP_OPEN)) {
                        this.quickPopupClose();
                    }
                    util.removeChildren(this.quickPopup.element);
                    this.isMultipleEventSelect = false;
                } else {
                    const display: string = this.quickPopup.element.style.display;
                    this.quickPopup.element.style.display = 'block';
                    if (this.parent.isAdaptive) {
                        this.quickPopup.element.removeAttribute('style');
                        this.quickPopup.element.style.display = 'block';
                        this.quickPopup.element.style.height = formatUnit((popupType === 'EditEventInfo') ? 65 : window.innerHeight);
                    } else {
                        const isVirtualScroll: boolean =
                            this.parent.virtualScrollModule && this.parent.virtualScrollModule.isHorizontalScroll
                            && !isNullOrUndefined(closest(target, '.' + cls.CONTENT_TABLE_CLASS));
                        const conTable: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table');
                        this.quickPopup.offsetX = isVirtualScroll && !this.parent.enableRtl ? (util.getTranslateX(conTable) + 10) : 10;
                        this.quickPopup.offsetY = this.parent.virtualScrollModule && !this.parent.virtualScrollModule.isHorizontalScroll ?
                            this.quickPopup.offsetY : 0;
                        this.quickPopup.collision = { X: this.parent.enableRtl ? 'flip' : 'none', Y: 'fit' };
                        this.quickPopup.position = { X: this.parent.enableRtl ? 'left' : 'right', Y: this.parent.enableRtl ? 'bottom' : 'top' };
                        this.quickPopup.dataBind();
                        this.quickPopup.refreshPosition(null, true);
                        const collide: string[] = isCollide(this.quickPopup.element, this.parent.element);
                        if (collide.indexOf(this.parent.enableRtl ? 'left' : 'right') > -1) {
                            this.quickPopup.offsetX = -(target as HTMLElement).offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                            if (isVirtualScroll && !this.parent.enableRtl) {
                                this.quickPopup.offsetX = util.getTranslateX(conTable) + this.quickPopup.offsetX;
                            }
                            this.quickPopup.dataBind();
                            this.quickPopup.refreshPosition(null, true);
                            const leftCollide: string[] = isCollide(this.quickPopup.element, this.parent.element);
                            if (leftCollide.indexOf('left') > -1) {
                                this.quickPopup.position = { X: 'center', Y: 'center' };
                                this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                                this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                                this.quickPopup.dataBind();
                            }
                        }
                        if (this.parent.virtualScrollModule && !this.parent.virtualScrollModule.isHorizontalScroll && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                            const translateY: number = util.getTranslateY(conTable);
                            this.quickPopup.offsetY = translateY;
                            this.quickPopup.dataBind();
                            this.quickPopup.refreshPosition(null, true);
                        }
                        if (this.quickPopup.position.X === 'center' && this.quickPopup.position.Y === 'center' && !isNullOrUndefined(originalEvent) &&
                            (originalEvent as MouseEvent).clientX && (originalEvent as MouseEvent).clientY) {
                            const clientX: number = (originalEvent as MouseEvent).clientX;
                            const clientY: number = (originalEvent as MouseEvent).clientY;
                            const targetRect: ClientRect | DOMRect = target.getBoundingClientRect();
                            const offsetY: number = (originalEvent as MouseEvent).offsetY || Math.ceil(clientY - (targetRect as any).y);
                            const previousOffset: number = this.quickPopup.offsetY;
                            let collision: string[] = isCollide(this.quickPopup.element, target as HTMLElement);
                            const popupRect: ClientRect | DOMRect = this.quickPopup.element.getBoundingClientRect();
                            const targetEle: Element = document.elementFromPoint(clientX, clientY);
                            if (collision.indexOf('top') > -1 || collision.indexOf('bottom') > -1 || closest(targetEle, '.' + cls.POPUP_WRAPPER_CLASS)) {
                                if (popupRect.top <= clientY &&
                                    clientY <= popupRect.top + popupRect.height) {
                                    this.quickPopup.offsetY = previousOffset - popupRect.height - 10;
                                    this.quickPopup.dataBind();
                                    collision = isCollide(this.quickPopup.element, this.parent.element);
                                    if (collision.indexOf('top') > -1) {
                                        this.quickPopup.offsetY = previousOffset + offsetY + 10;
                                        this.quickPopup.dataBind();
                                    }
                                } else if (isCollide(this.quickPopup.element, this.parent.element).indexOf('bottom') > -1) {
                                    this.quickPopup.offsetY =
                                        previousOffset - offsetY - Math.ceil(popupRect.height) - 10;
                                    this.quickPopup.dataBind();
                                }
                            }
                        }
                    }
                    if (isEventPopup) {
                        this.applyEventColor();
                    }
                    this.quickPopup.element.style.display = display;
                    this.quickPopup.dataBind();
                    this.quickPopup.show();
                }
            });
        });
    }

    private applyEventColor(): void {
        let colorField: string = '';
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            colorField = this.parent.enableRtl ? 'border-right-color' : 'border-left-color';
        } else {
            colorField = 'background-color';
        }
        let color: string = (<HTMLElement>this.parent.activeEventData.element).style[<any>colorField];
        if (color === '') {
            return;
        }
        let colorEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_HEADER_CLASS) as HTMLElement;
        const footerEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
        if (footerEle && footerEle.offsetParent) {
            colorEle = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = `rgba(${color.match(/\d+/g).join()},0.3)`;
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    }

    private quickPopupOpen(): void {
        if (this.parent.isAdaptive) {
            this.quickPopup.element.style.top = '0px';
            return;
        }
        if (this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS)) {
            const subjectElement: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
            if (subjectElement) {
                subjectElement.focus();
            }
        } else {
            const editElement: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLInputElement;
            if (editElement) {
                editElement.focus();
            }
            const editIcon: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLInputElement;
            if (editIcon) {
                editIcon.focus();
            }
        }
    }

    private quickPopupClose(): void {
        this.parent.eventBase.focusElement();
        this.quickPopup.relateTo = '.' + cls.WORK_CELLS_CLASS;
        this.fieldValidator.destroyToolTip();
        if (this.quickPopup.element.querySelectorAll('.e-formvalidator').length) {
            this.fieldValidator.destroy();
        }
        this.destroyPopupButtons('quickPopup');
        util.removeChildren(this.quickPopup.element);
    }

    private morePopupOpen(): void {
        if (this.parent.isAdaptive) {
            this.morePopup.element.style.top = '0px';
            this.morePopup.element.style.left = '0px';
            this.morePopup.element.style.height = formatUnit(window.innerHeight);
            return;
        }
        (this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS) as HTMLElement).focus();
        this.morePopup.refreshPosition();
    }

    private morePopupClose(): void {
        const moreWrapper: Element = this.parent.element.querySelector('.' + cls.MORE_EVENT_WRAPPER_CLASS);
        if (moreWrapper) {
            remove(moreWrapper);
        }
    }

    private popupClose(event: Event): void {
        this.dialogEvent = event;
        this.isCrudAction = false;
        this.quickPopupHide(true);
    }

    public quickPopupHide(hideAnimation?: boolean): void {
        if (!this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            return;
        }
        const isCellPopup: Element = this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS);
        let popupData: Record<string, any>;
        if (isCellPopup) {
            const formvalidator: Element = this.quickPopup.element.querySelector('.e-formvalidator');
            if (this.isCrudAction && formvalidator &&
                !((formvalidator as EJ2Instance).ej2_instances[0] as FormValidator).validate()) {
                return;
            }
            const fields: EventFieldsMapping = this.parent.eventFields;
            const saveObj: Record<string, any> = this.parent.eventWindow.getObjectFromFormData(cls.POPUP_WRAPPER_CLASS);
            this.parent.eventWindow.setDefaultValueToObject(saveObj);
            saveObj[fields.id] = this.parent.eventBase.getEventMaxID();
            saveObj[fields.startTime] = this.parent.activeCellsData.startTime;
            saveObj[fields.endTime] = this.parent.activeCellsData.endTime;
            saveObj[fields.isAllDay] = this.parent.activeCellsData.isAllDay;
            if (this.parent.resourceBase) {
                this.parent.resourceBase.setResourceValues(saveObj);
            }
            popupData = saveObj;
        } else {
            popupData = this.parent.activeEventData.event as Record<string, any>;
        }
        const isEventPopup: Element = this.quickPopup.element.querySelector('.' + cls.EVENT_POPUP_CLASS);
        const args: PopupCloseEventArgs = {
            event: this.dialogEvent,
            type: this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo',
            cancel: false, data: popupData, element: this.quickPopup.element,
            target: (isCellPopup ? this.parent.activeCellsData.element : this.parent.activeEventData.element) as Element
        };
        this.parent.trigger(event.popupClose, args, (popupCloseArgs: PopupCloseEventArgs) => {
            if (!popupCloseArgs.cancel) {
                if (this.quickPopup.element.classList.contains('e-popup-open')) {
                    if (isCellPopup && this.isCrudAction) {
                        this.parent.currentAction = 'Add';
                        this.parent.crudModule.addEvent(popupCloseArgs.data);
                    }
                    if (hideAnimation) {
                        const animation: AnimationModel = this.quickPopup.hideAnimation;
                        this.quickPopup.hideAnimation = null;
                        this.quickPopup.hide();
                        this.quickPopup.hideAnimation = animation;
                    } else {
                        this.quickPopup.hide();
                    }
                    this.isMultipleEventSelect = false;
                    this.isCrudAction = false;
                }
            }
        });
    }

    private navigationClick(e: Event): void {
        const navigateEle: Element = closest((e.target as Element), '.' + cls.NAVIGATE_CLASS);
        if (!isNullOrUndefined(navigateEle)) {
            const date: Date = this.parent.getDateFromElement(e.currentTarget as HTMLTableCellElement);
            if (!isNullOrUndefined(date)) {
                this.closeClick(e);
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView(), e);
            }
        }
    }

    private documentClick(e: { event: Event }): void {
        const target: Element = e.event.target as Element;
        const isInsideDialog: boolean = !!closest(target, '.e-dialog');
        let classNames: string = '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.HEADER_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS +
            ',.' + cls.WORK_CELLS_CLASS + ',.' + cls.APPOINTMENT_CLASS;
        if (!isInsideDialog) {
            classNames += ',.e-popup';
        }
        const popupWrap: Element = this.parent.element.querySelector('.' + cls.POPUP_WRAPPER_CLASS);
        if ((popupWrap && popupWrap.childElementCount > 0 && !closest(target, classNames)) || !closest(target, classNames)) {
            this.quickPopupHide();
            this.parent.removeNewEventElement();
        }
        const tar: HTMLInputElement | null = this.parent.allowInline ? this.parent.inlineModule.getInlineElement() : null;
        if (tar && tar !== target) {
            this.parent.inlineModule.documentClick(tar);
        }
        if (closest(target, '.' + cls.APPOINTMENT_CLASS + ',.' + cls.HEADER_CELLS_CLASS)) {
            this.parent.removeNewEventElement();
        }
        const isQuickPopupClick: boolean | Element | null = closest(target, '.' + cls.POPUP_WRAPPER_CLASS) ||
            closest(target, '.' + cls.QUICK_DIALOG_CLASS);
        const isEditButton: boolean = target.classList.contains(cls.EDIT_EVENT_CLASS) ||
            target.classList.contains(cls.EDIT_CLASS) || target.classList.contains(cls.EDIT_ICON_CLASS);
        if (isEditButton || !isQuickPopupClick && !closest(target, '.' + cls.MORE_POPUP_WRAPPER_CLASS) && (target.classList &&
            !target.classList.contains(cls.MORE_INDICATOR_CLASS))
            && (!closest(target, '.' + cls.MORE_POPUP_WRAPPER_CLASS + '.' + cls.POPUP_OPEN))
            && !closest(target, '.' + cls.WORK_CELLS_CLASS)) {
            this.morePopup.hide();
        }
    }

    public onClosePopup(event?: Event): void {
        if (!isNullOrUndefined(event)) {
            this.dialogEvent = event;
        }
        this.quickPopupHide();
        if (isNullOrUndefined(event) || (!isNullOrUndefined(event) && (event as KeyboardEventArgs).action !== 'escape') ||
            (this.parent.inlineModule && this.parent.element.querySelector('.' + cls.INLINE_APPOINTMENT_CLASS))) {
            this.parent.eventBase.focusElement();
        }
    }

    private addEventListener(): void {
        this.parent.on(event.cellClick, this.cellClick, this);
        this.parent.on(event.eventClick, this.eventClick, this);
        this.parent.on(event.documentClick, this.documentClick, this);
        this.parent.on(event.dataReady, this.updateMoreEventContent, this);
    }

    private removeEventListener(): void {
        this.parent.off(event.cellClick, this.cellClick);
        this.parent.off(event.eventClick, this.eventClick);
        this.parent.off(event.documentClick, this.documentClick);
        this.parent.off(event.dataReady, this.updateMoreEventContent);
    }

    private destroyPopupButtons(popupName: string): void {
        const popup: Popup = popupName === 'quickPopup' ? this.quickPopup : this.morePopup;
        const buttonCollections: HTMLElement[] = [].slice.call(popup.element.querySelectorAll('.e-control.e-btn'));
        for (const button of buttonCollections) {
            const instance: Button = (button as EJ2Instance).ej2_instances ? (button as EJ2Instance).ej2_instances[0] as Button : null;
            if (instance) {
                instance.destroy();
            }
        }
        if (popupName === 'quickPopup') {
            const input: HTMLInputElement = popup.element.querySelector('input.' + cls.SUBJECT_CLASS);
            if (input) {
                input.remove();
            }
            const form: HTMLFormElement = this.quickPopup.element.querySelector('form.' + cls.FORM_CLASS);
            if (form) {
                util.removeChildren(form);
                form.remove();
            }
            this.parent.resetTemplates(['content', 'header', 'footer']);
        }
    }

    public refreshQuickDialog(): void {
        this.destroyQuickDialog();
        this.renderQuickDialog();
    }

    public refreshQuickPopup(): void {
        this.destroyQuickPopup();
        this.renderQuickPopup();
    }

    public refreshMorePopup(): void {
        this.destroyMorePopup();
        this.renderMorePopup();
    }

    private destroyQuickDialog(): void {
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog = null;
        }
    }

    private destroyQuickPopup(): void {
        if (this.quickPopup.element) {
            this.destroyPopupButtons('quickPopup');
            this.quickPopup.destroy();
            remove(this.quickPopup.element);
            this.quickPopup = null;
        }
    }

    private destroyMorePopup(): void {
        if (this.morePopup.element) {
            this.destroyPopupButtons('morePopup');
            this.morePopup.destroy();
            remove(this.morePopup.element);
            this.morePopup = null;
        }
    }

    public destroy(): void {
        if (this.quickPopup.element.querySelectorAll('.e-formvalidator').length) {
            this.fieldValidator.destroy();
        }
        this.removeEventListener();
        this.destroyQuickPopup();
        this.destroyMorePopup();
        this.destroyQuickDialog();
        this.dialogEvent = null;
        this.parent = null;
        this.l10n = null;
        this.isCrudAction = null;
        this.fieldValidator = null;
        this.isMultipleEventSelect = null;
    }

}
