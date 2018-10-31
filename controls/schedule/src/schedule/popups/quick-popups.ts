import { L10n, closest, EventHandler, isNullOrUndefined, formatUnit, append } from '@syncfusion/ej2-base';
import { addClass, removeClass, createElement, remove, extend, AnimationModel } from '@syncfusion/ej2-base';
import { Dialog, Popup, isCollide } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { Input, FormValidator } from '@syncfusion/ej2-inputs';
import { Schedule } from '../base/schedule';
import { RecurrenceEditor } from '../../recurrence-editor/index';
import {
    CellClickEventArgs, EventClickArgs, EventFieldsMapping, PopupOpenEventArgs, EventRenderedArgs, EJ2Instance, TdData
} from '../base/interface';
import { Crud } from '../actions/crud';
import { PopupType } from '../base/type';
import { FieldValidator } from './form-validator';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { ResourcesModel } from '../models/models';

const EVENT_FIELD: string = 'e-field';

/**
 * Quick Popups interactions
 */
export class QuickPopups {
    private l10n: L10n;
    private parent: Schedule;
    private crudAction: Crud;
    private isMultipleEventSelect: boolean = false;
    public quickDialog: Dialog;
    public quickPopup: Popup;
    public morePopup: Popup;
    private fieldValidator: FieldValidator;

    /**
     * Constructor for QuickPopups
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.crudAction = new Crud(parent);
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
        let quickPopupWrapper: HTMLElement = createElement('div', { className: cls.POPUP_WRAPPER_CLASS + ' e-popup-close' });
        if (this.parent.isAdaptive) {
            document.body.appendChild(quickPopupWrapper);
            addClass([quickPopupWrapper], cls.DEVICE_CLASS);
        } else {
            this.parent.element.appendChild(quickPopupWrapper);
        }
        this.quickPopup = new Popup(quickPopupWrapper, {
            actionOnScroll: 'hide',
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            open: this.quickPopupOpen.bind(this),
            close: this.quickPopupClose.bind(this),
            hideAnimation: (this.parent.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
            showAnimation: (this.parent.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } : { X: 'none', Y: 'fit' }),
            position: (this.parent.isAdaptive ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1000 : 1)
        });
    }

    private renderMorePopup(): void {
        let moreEventPopup: string = `<div class="${cls.MORE_EVENT_POPUP_CLASS}"><div class="${cls.MORE_EVENT_HEADER_CLASS}">` +
            `<div class="${cls.MORE_EVENT_CLOSE_CLASS}" title="${this.l10n.getConstant('close')}" tabindex="0"></div>` +
            `<div class="${cls.MORE_EVENT_DATE_HEADER_CLASS}"><div class="${cls.MORE_EVENT_HEADER_DAY_CLASS}"></div>` +
            `<div class="${cls.MORE_EVENT_HEADER_DATE_CLASS} ${cls.NAVIGATE_CLASS}" tabindex="0"></div></div></div></div>`;
        let moreEventWrapper: HTMLElement = createElement('div', {
            className: cls.MORE_POPUP_WRAPPER_CLASS + ' e-popup-close',
            innerHTML: moreEventPopup
        });
        this.parent.element.appendChild(moreEventWrapper);
        this.morePopup = new Popup(moreEventWrapper, {
            targetType: 'relative',
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'ZoomOut', duration: 300 },
            showAnimation: { name: 'ZoomIn', duration: 300 },
            open: this.morePopupOpen.bind(this),
            close: this.morePopupClose.bind(this),
            collision: { X: 'flip', Y: 'flip' },
            viewPortElement: this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS) as HTMLElement,
            zIndex: 0
        });
        let closeButton: HTMLButtonElement = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-round', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeButton, this.closeClick);
        EventHandler.add(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS), 'click', this.navigationClick, this);
    }

    private renderQuickDialog(): void {
        this.quickDialog = new Dialog({
            animationSettings: { effect: 'Zoom' },
            buttons: [
                { buttonModel: { cssClass: 'e-quick-alertok e-flat', isPrimary: true }, click: this.dialogButtonClick.bind(this) },
                { buttonModel: { cssClass: 'e-quick-alertcancel e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this) }
            ],
            cssClass: cls.QUICK_DIALOG_CLASS,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            beforeClose: this.beforeQuickDialogClose.bind(this),
            isModal: true,
            position: { X: 'center', Y: 'center' },
            showCloseIcon: true,
            target: document.body,
            visible: false,
            width: 'auto'
        });
        let dialogElement: HTMLElement = createElement('div', { id: this.parent.element.id + 'QuickDialog' });
        this.parent.element.appendChild(dialogElement);
        this.quickDialog.appendTo(dialogElement);
        let okButton: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.setAttribute('aria-label', this.l10n.getConstant('occurrence'));
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('series'));
        }
    }

    private renderButton(className: string, iconName: string, isDisabled: boolean, element: HTMLButtonElement, clickEvent: Function): void {
        new Button({ cssClass: className, disabled: isDisabled, enableRtl: this.parent.enableRtl, iconCss: iconName }, element);
        EventHandler.add(element, 'click', clickEvent, this);
    }

    private quickDialogClass(action: string): void {
        let classList: string[] = [
            cls.QUICK_DIALOG_EDIT_EVENT_CLASS, cls.QUICK_DIALOG_EDIT_SERIES_CLASS, cls.QUICK_DIALOG_DELETE_CLASS,
            cls.QUICK_DIALOG_CANCEL_CLASS, cls.QUICK_DIALOG_ALERT_BTN_CLASS, cls.DISABLE_CLASS
        ];
        let okButton: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        removeClass([okButton, cancelButton], classList);
        switch (action) {
            case 'Recurrence':
                addClass([okButton], cls.QUICK_DIALOG_EDIT_EVENT_CLASS);
                addClass([cancelButton], cls.QUICK_DIALOG_EDIT_SERIES_CLASS);
                break;
            case 'Delete':
                addClass([okButton], cls.QUICK_DIALOG_DELETE_CLASS);
                addClass([cancelButton], cls.QUICK_DIALOG_CANCEL_CLASS);
                break;
            case 'Alert':
                addClass([okButton], cls.QUICK_DIALOG_ALERT_BTN_CLASS);
                addClass([cancelButton], cls.DISABLE_CLASS);
                break;
        }
    }

    private applyFormValidation(): void {
        let form: HTMLFormElement = this.quickPopup.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        let rules: { [key: string]: Object } = {};
        rules[this.parent.eventSettings.fields.subject.name] = this.parent.eventSettings.fields.subject.validation;
        this.fieldValidator.renderFormValidator(form, rules, this.quickPopup.element);
    }

    public openRecurrenceAlert(): void {
        let editDeleteOnly: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (editDeleteOnly) {
            editDeleteOnly.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        }
        let editDeleteSeries: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (editDeleteSeries) {
            editDeleteSeries.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteSeries' : 'editSeries');
        }
        this.quickDialog.content =
            this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteRecurrenceContent' : 'editContent');
        this.quickDialog.header = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
        this.quickDialogClass('Recurrence');
        this.showQuickDialog('RecurrenceAlert');
    }

    public openRecurrenceValidationAlert(type: string): void {
        let okButton: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        removeClass([okButton], cls.QUICK_DIALOG_EDIT_EVENT_CLASS);
        okButton.innerHTML = this.l10n.getConstant('ok');
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        cancelButton.innerHTML = this.l10n.getConstant('cancel');
        this.quickDialog.header = this.l10n.getConstant('alert');
        switch (type) {
            case 'wrongPattern':
                addClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('wrongPattern');
                break;
            case 'dateValidation':
                removeClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('recurrenceDateValidation');
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
                removeClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('seriesChangeAlert');
                break;
        }
        if (!cancelButton.classList.contains(cls.DISABLE_CLASS)) {
            addClass([cancelButton], 'e-quick-alert-cancelpresent');
        }
        this.showQuickDialog('RecurrenceValidationAlert');
    }

    public openDeleteAlert(): void {
        if (this.parent.activeViewOptions.readonly) {
            return;
        }
        let okButton: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('delete');
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialog.content = ((<{ [key: string]: Object }[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleContent') : this.l10n.getConstant('deleteContent');
        this.quickDialog.header = ((<{ [key: string]: Object }[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleEvent') : this.l10n.getConstant('deleteEvent');
        this.quickDialogClass('Delete');
        this.showQuickDialog('DeleteAlert');
    }

    public openValidationError(type: string): void {
        this.quickDialog.header = this.l10n.getConstant('alert');
        this.quickDialog.content = this.l10n.getConstant(type);
        let okButton: Element = this.quickDialog.element.querySelector('.e-quick-alertok');
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('ok');
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
        }
        this.quickDialogClass('Alert');
        this.showQuickDialog('ValidationAlert');
    }

    private showQuickDialog(popupType: PopupType): void {
        this.quickDialog.dataBind();
        let eventProp: PopupOpenEventArgs = {
            type: popupType, cancel: false, data: this.parent.activeEventData, element: this.quickDialog.element
        };
        this.parent.trigger(event.popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.quickDialog.show();
    }

    private createMoreEventList(eventCollection: { [key: string]: Object }[], groupOrder: string[], groupIndex: string): HTMLElement {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let moreEventContentEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_CONTENT_CLASS });
        let moreEventWrapperEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_WRAPPER_CLASS });
        if (eventCollection.length === 0) {
            moreEventWrapperEle = createElement('div', {
                className: cls.MORE_EVENT_CONTENT_CLASS,
                innerHTML: this.l10n.getConstant('emptyContainer')
            });
        } else {
            for (let eventData of eventCollection) {
                let eventText: string = (eventData[fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
                let appointmentEle: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_CLASS,
                    attrs: {
                        'data-id': '' + eventData[fields.id],
                        'data-guid': eventData.Guid as string, 'role': 'button', 'tabindex': '0', 'aria-readonly': 'false',
                        'aria-selected': 'false', 'aria-grabbed': 'true', 'aria-label': eventText
                    }
                });
                appointmentEle.appendChild(createElement('div', { className: cls.SUBJECT_CLASS, innerHTML: eventText }));
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    appointmentEle.setAttribute('data-group-index', groupIndex);
                }
                if (!isNullOrUndefined(eventData[fields.recurrenceRule])) {
                    let iconClass: string = (eventData[fields.id] === eventData[fields.recurrenceID]) ?
                        cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
                    appointmentEle.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
                }
                let args: EventRenderedArgs = { data: eventData, element: appointmentEle, cancel: false };
                this.parent.trigger(event.eventRendered, args);
                if (!args.cancel) {
                    moreEventWrapperEle.appendChild(appointmentEle);
                    this.parent.eventBase.wireAppointmentEvents(appointmentEle);
                    this.parent.eventBase.applyResourceColor(appointmentEle, eventData, 'backgroundColor', groupOrder);
                }
            }
        }
        moreEventContentEle.appendChild(moreEventWrapperEle);
        return moreEventContentEle;
    }

    private tapHoldEventPopup(args: { [key: string]: Object }): void {
        let target: Element = closest(<HTMLElement>(<{ [key: string]: Object }>args.event).target, '.' + cls.APPOINTMENT_CLASS);
        this.isMultipleEventSelect = false;
        this.parent.selectedElements = [];
        this.isMultipleEventSelect = true;
        this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        let guid: string = target.getAttribute('data-guid');
        let eventObj: { [key: string]: Object } = this.parent.eventBase.getEventByGuid(guid) as { [key: string]: Object };
        let eventTitle: string = (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string;
        let eventTemplate: string = `<div class="${cls.MULTIPLE_EVENT_POPUP_CLASS}"><div class="${cls.POPUP_HEADER_CLASS}">` +
            `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button>` +
            `<div class="${cls.SUBJECT_CLASS}">${eventTitle}</div>` +
            `<button class="${cls.EDIT_CLASS}" title="${this.l10n.getConstant('edit')}"></button>` +
            `<button class="${cls.DELETE_CLASS}" title="${this.l10n.getConstant('delete')}"></button></div></div>`;
        this.quickPopup.element.innerHTML = eventTemplate;
        let closeIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.closeClick);
        let editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.EDIT_ICON_CLASS, false, editIcon, this.editClick);
        let deleteIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.DELETE_ICON_CLASS, false, deleteIcon, this.deleteClick);
        this.beforeQuickPopupOpen(target);
    }

    private cellClick(args: CellClickEventArgs): void {
        if (!this.parent.showQuickInfo || this.parent.currentView === 'MonthAgenda' || this.parent.isAdaptive) {
            this.quickPopupHide();
            return;
        }
        let target: Element = closest((args.event.target as Element), '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' +
            cls.HEADER_CELLS_CLASS);
        if (isNullOrUndefined(target) || (args.event.target as Element).classList.contains(cls.MORE_INDICATOR_CLASS)) {
            return;
        }
        let isSameTarget: Boolean = this.quickPopup.relateTo === target;
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            let subjectElement: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
            if (subjectElement) {
                subjectElement.focus();
            }
            return;
        }
        let temp: { [key: string]: Object } = {};
        temp[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        temp[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        temp[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        let cellDetails: { [key: string]: Object } = this.getFormattedString(temp);
        let quickCellPopup: HTMLElement = createElement('div', { className: cls.CELL_POPUP_CLASS });
        let templateArgs: Object = extend({}, temp, { elementType: 'cell' }, true);
        if (this.parent.quickInfoTemplates.header) {
            append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickCellPopup);
        } else {
            let headerTemplate: HTMLElement = createElement('div', {
                className: cls.POPUP_HEADER_CLASS,
                innerHTML: `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}">` +
                    `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>`
            });
            quickCellPopup.appendChild(headerTemplate);
        }
        if (this.parent.quickInfoTemplates.content) {
            append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickCellPopup);
        } else {
            let tempStr: string = `<table class="${cls.POPUP_TABLE_CLASS}"><tbody><tr><td>` +
                `<form class="${cls.FORM_CLASS}" onsubmit="return false;"><input class="${cls.SUBJECT_CLASS} ${EVENT_FIELD}" type="text" ` +
                `name="${this.parent.eventFields.subject}" /></form></td></tr><tr><td><div class="${cls.DATE_TIME_CLASS}">` +
                `<div class="${cls.DATE_TIME_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.DATE_TIME_DETAILS_CLASS} ` +
                `${cls.TEXT_ELLIPSIS}">${cellDetails.details}</div></div>` +
                `${this.parent.activeViewOptions.group.resources.length > 0 ? `<div class="${cls.RESOURCE_CLASS}">` +
                    `<div class="${cls.RESOURCE_ICON_CLASS} ${cls.ICON} "></div><div class="${cls.RESOURCE_DETAILS_CLASS} ` +
                    `${cls.TEXT_ELLIPSIS}">${this.getResourceText(args, 'cell')}</div></div>` : ''}</td></tr></tbody></table>`;
            let contentTemplate: HTMLElement = createElement('div', {
                className: cls.POPUP_CONTENT_CLASS, innerHTML: tempStr
            });
            quickCellPopup.appendChild(contentTemplate);
        }
        if (this.parent.quickInfoTemplates.footer) {
            append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickCellPopup);
        } else {
            let footerTemplate: HTMLElement = createElement('div', {
                className: cls.POPUP_FOOTER_CLASS, innerHTML: `<button class="${cls.QUICK_POPUP_EVENT_DETAILS_CLASS + ' ' +
                    cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('moreDetails')}">${this.l10n.getConstant('moreDetails')}</button>` +
                    `<button class="${cls.EVENT_CREATE_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('save')}">` +
                    `${this.l10n.getConstant('save')}</button>`
            });
            quickCellPopup.appendChild(footerTemplate);
        }
        let subjectElement: HTMLInputElement = quickCellPopup.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectElement) {
            Input.createInput({ element: subjectElement, properties: { placeholder: this.l10n.getConstant('addTitle') } });
        }
        let closeIcon: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        if (closeIcon) {
            this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
        }
        let moreButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS) as HTMLButtonElement;
        if (moreButton) {
            this.renderButton('e-flat', '', false, moreButton, this.detailsClick);
        }
        let saveButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.EVENT_CREATE_CLASS) as HTMLButtonElement;
        if (saveButton) {
            this.renderButton('e-flat e-primary', '', this.parent.activeViewOptions.readonly, saveButton, this.saveClick);
        }
        this.quickPopup.content = quickCellPopup;
        this.quickPopup.dataBind();
        this.applyFormValidation();
        if (this.morePopup) { this.morePopup.hide(); }
        this.quickPopup.relateTo = target as HTMLElement;
        this.beforeQuickPopupOpen(target);
    }

    private isSameEventClick(events: EventClickArgs): boolean {
        let isSameTarget: Boolean = this.quickPopup.relateTo === closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS);
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            let editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            if (editIcon) {
                editIcon.focus();
            }
            if (!this.parent.isAdaptive) {
                let editButton: HTMLButtonElement =
                    this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
                if (editButton) {
                    editButton.focus();
                }
            }
            return true;
        }
        return false;
    }

    private eventClick(events: EventClickArgs): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        if (!this.parent.showQuickInfo) { return; }
        if (this.parent.isAdaptive && this.isMultipleEventSelect) {
            this.updateTapHoldEventPopup(closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS));
        } else {
            let isSameTarget: Boolean = this.isSameEventClick(events);
            if (isSameTarget) {
                return;
            }
            let eventData: { [key: string]: Object; } = <{ [key: string]: Object }>events.event;
            let args: { [key: string]: Object } = this.getFormattedString(eventData);
            let quickEventPopup: HTMLElement = createElement('div', { className: cls.EVENT_POPUP_CLASS });
            let templateArgs: Object = extend({}, eventData, { elementType: 'event' }, true);
            if (this.parent.quickInfoTemplates.header) {
                append(this.parent.getQuickInfoTemplatesHeader()(templateArgs), quickEventPopup);
            } else {
                let headerTemplate: HTMLElement = createElement('div', {
                    className: cls.POPUP_HEADER_CLASS,
                    innerHTML: `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}">` +
                        `<button class="${cls.EDIT_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('edit')}"></button>` +
                        `<button class="${cls.DELETE_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('delete')}"></button>` +
                        `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>` +
                        `<div class="${cls.SUBJECT_WRAP}"><div class="${cls.SUBJECT_CLASS} ${cls.TEXT_ELLIPSIS}" ` +
                        `title="${args.eventSubject}">${args.eventSubject}</div></div >`
                });
                quickEventPopup.appendChild(headerTemplate);
            }
            if (this.parent.quickInfoTemplates.content) {
                append(this.parent.getQuickInfoTemplatesContent()(templateArgs), quickEventPopup);
            } else {
                let tempStr: string = `<div class="${cls.DATE_TIME_CLASS}">` +
                    `<div class="${cls.DATE_TIME_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.DATE_TIME_WRAPPER_CLASS} ` +
                    `${cls.TEXT_ELLIPSIS}"><div class="${cls.DATE_TIME_DETAILS_CLASS} ${cls.TEXT_ELLIPSIS}">${args.details}</div>` +
                    `${eventData[this.parent.eventFields.recurrenceRule] ? `<div class="${cls.RECURRENCE_SUMMARY_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}">${this.getRecurrenceSummary(eventData)}</div>` : ''}</div></div>` +
                    `${eventData[this.parent.eventFields.location] ? `<div class="${cls.LOCATION_CLASS}"><div class="` +
                        `${cls.LOCATION_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.LOCATION_DETAILS_CLASS} ${cls.TEXT_ELLIPSIS}">` +
                        `${eventData[this.parent.eventFields.location]}</div></div>` : ''}` +
                    `${eventData[this.parent.eventFields.startTimezone] ||
                        eventData[this.parent.eventFields.endTimezone] ? `<div class="${cls.TIME_ZONE_CLASS}"><div class="` +
                        `${cls.TIME_ZONE_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.TIME_ZONE_DETAILS_CLASS} ${cls.TEXT_ELLIPSIS}">` +
                        `${this.getTimezone(eventData)} </div></div>` : ''}` +
                    `${eventData[this.parent.eventFields.description] ? `<div class="${cls.DESCRIPTION_CLASS}"><div class="` +
                        `${cls.DESCRIPTION_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.DESCRIPTION_DETAILS_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}">${eventData[this.parent.eventFields.description]}</div></div>` : ''}` +
                    `${this.parent.resources.length > 0 ? `<div class="${cls.RESOURCE_CLASS}"><div class="` +
                        `${cls.RESOURCE_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.RESOURCE_DETAILS_CLASS} ${cls.TEXT_ELLIPSIS}">` +
                        `${this.getResourceText(events, 'event')}</div></div>` : ''}`;
                let contentTemplate: HTMLElement = createElement('div', {
                    className: cls.POPUP_CONTENT_CLASS, innerHTML: tempStr
                });
                quickEventPopup.appendChild(contentTemplate);
            }
            if (this.parent.quickInfoTemplates.footer) {
                append(this.parent.getQuickInfoTemplatesFooter()(templateArgs), quickEventPopup);
            } else {
                let footerTemplate: HTMLElement = createElement('div', {
                    className: cls.POPUP_FOOTER_CLASS,
                    innerHTML: `${this.parent.isAdaptive ? '' : `<button class="${cls.EDIT_EVENT_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('edit')}">${this.l10n.getConstant('edit')}</button>` +
                        `<button class="${cls.DELETE_EVENT_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('delete')}">` +
                        `${this.l10n.getConstant('delete')}</button>`}`
                });
                quickEventPopup.appendChild(footerTemplate);
            }
            let readonly: boolean = this.parent.activeViewOptions.readonly;
            let editIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            if (editIcon) {
                this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.EDIT_ICON_CLASS, false, editIcon, this.editClick);
            }
            let deleteIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
            if (deleteIcon) {
                this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.DELETE_ICON_CLASS, readonly, deleteIcon, this.deleteClick);
            }
            let closeIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
            if (closeIcon) {
                this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.quickPopupHide);
            }
            let editButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
            if (editButton) {
                this.renderButton('e-flat e-primary', '', false, editButton, this.editClick);
            }
            let deleteButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLButtonElement;
            if (deleteButton) {
                this.renderButton('e-flat', '', readonly, deleteButton, this.deleteClick);
            }
            this.quickPopup.content = quickEventPopup;
            this.quickPopup.dataBind();
            if (this.morePopup && !closest(<Element>events.element, '.' + cls.MORE_EVENT_WRAPPER_CLASS)) { this.morePopup.hide(); }
            this.quickPopup.relateTo = this.parent.isAdaptive ? document.body :
                closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS) as HTMLElement;
            this.beforeQuickPopupOpen(events.element as Element);
        }
    }

    private getResourceText(args: CellClickEventArgs | EventClickArgs, type: string): string {
        let resourceValue: string = '';
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            let resourceCollection: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            let resourceData: { [key: string]: Object }[] = resourceCollection.dataSource as { [key: string]: Object }[];
            let resourceIndex: number = 0;
            let eventData: { [key: string]: Object } = args.event as { [key: string]: Object };
            resourceData.forEach((resource: { [key: string]: Object }, index: number) => {
                if (resource[resourceCollection.idField] === eventData[resourceCollection.field]) {
                    resourceIndex = index;
                }
            });
            resourceValue = resourceData[resourceIndex][resourceCollection.textField] as string;
        } else {
            if (type === 'event') {
                let eventData: { [key: string]: Object } = args.event as { [key: string]: Object };
                let resourceData: Object | string | number;
                let lastResource: ResourcesModel;
                for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
                    resourceData = eventData[this.parent.resourceBase.resourceCollection[i].field];
                    if (!isNullOrUndefined(resourceData)) {
                        lastResource = this.parent.resourceBase.resourceCollection[i];
                        break;
                    }
                }
                if (!Array.isArray(resourceData)) {
                    resourceData = [resourceData];
                }
                let resNames: string[] = [];
                let lastResourceData: { [key: string]: Object }[] = lastResource.dataSource as { [key: string]: Object }[];
                (resourceData as Object[]).map((value: string | number) => {
                    let i: number = util.findIndexInData(lastResourceData, lastResource.idField, value as string);
                    let text: string = lastResourceData[i][lastResource.textField] as string;
                    if (text) { resNames.push(text); }
                });
                resourceValue = resNames.join(', ');
            } else {
                let argsData: CellClickEventArgs = args as CellClickEventArgs;
                let groupIndex: number = !isNullOrUndefined(argsData.groupIndex) ? argsData.groupIndex : 0;
                let resourceDetails: TdData = this.parent.resourceBase.lastResourceLevel[groupIndex];
                resourceValue = resourceDetails.resourceData[resourceDetails.resource.textField] as string;
            }
        }
        return resourceValue;
    }

    private getFormattedString(eventData: { [key: string]: Object }): { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let eventSubject: string = (eventData[fields.subject] || this.l10n.getConstant('noTitle')) as string;
        let startDate: Date = eventData[fields.startTime] as Date;
        let endDate: Date = eventData[fields.endTime] as Date;
        let startDateDetails: string = this.getDateFormat(startDate, 'long');
        let endDateDetails: string = (eventData[fields.isAllDay] && endDate.getHours() === 0 && endDate.getMinutes() === 0) ?
            this.getDateFormat(util.addDays(new Date(endDate.getTime()), -1), 'long') : this.getDateFormat(endDate, 'long');
        let startTimeDetail: string = this.parent.getTimeString(startDate);
        let endTimeDetail: string = this.parent.getTimeString(endDate);
        let details: string;
        let allDayLength: number = (endDate.getTime() - startDate.getTime()) / util.MS_PER_DAY;
        let spanLength: number = endDate.getDate() !== startDate.getDate() &&
            (endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) < 24 ? 1 : 0;
        if (eventData[fields.isAllDay] || allDayLength >= 1 || spanLength > 0) {
            details = startDateDetails + ' (' +
                (eventData[fields.isAllDay] ? this.l10n.getConstant('allDay') : startTimeDetail) + ')';
            if (allDayLength > 1 || spanLength > 0) {
                details += '&nbsp;-&nbsp;' + endDateDetails + ' (' +
                    (eventData[fields.isAllDay] ? this.l10n.getConstant('allDay') : endTimeDetail) + ')';
            }
        } else {
            details = startDateDetails + ' (' + (startTimeDetail + '&nbsp;-&nbsp;' + endTimeDetail) + ')';
        }
        return { eventSubject: eventSubject, details: details };
    }

    public moreEventClick(data: EventClickArgs, endDate: Date, groupIndex?: string): void {
        this.quickPopupHide(true);
        let moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let selectedDate: string = ((data.date).getTime()).toString();
        let target: Element = closest(<Element>data.element, '.' + cls.MORE_INDICATOR_CLASS);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DAY_CLASS).innerHTML = this.getDateFormat(data.date, 'E');
        let dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        dateElement.innerHTML = this.getDateFormat(data.date, 'd');
        dateElement.setAttribute('data-date', selectedDate);
        dateElement.setAttribute('data-end-date', endDate.getTime().toString());
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            dateElement.setAttribute('data-group-index', groupIndex);
            groupOrder = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)].groupOrder;
        }
        let moreEventElements: HTMLElement = this.createMoreEventList(data.event as { [key: string]: Object }[], groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreEventElements);
        removeClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        if (util.resetTime(data.date).getTime() === util.resetTime(new Date()).getTime()) {
            addClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        }
        if (this.parent.currentView.indexOf('Timeline') !== -1) {
            let gIndex: string = target.getAttribute('data-group-index');
            let index: number = (isNullOrUndefined(gIndex)) ? 0 : parseInt(gIndex, 10);
            this.morePopup.relateTo = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                ' tbody tr:nth-child(' + (index + 1) + ') td[data-date="' + target.getAttribute('data-start-date') + '"]') as HTMLElement;
        } else {
            this.morePopup.relateTo = closest(<Element>target, '.' + cls.WORK_CELLS_CLASS) as HTMLElement;
        }
        let eventProp: PopupOpenEventArgs = { type: 'EventContainer', data: data, cancel: false, element: this.morePopup.element };
        this.parent.trigger(event.popupOpen, eventProp);
        if (eventProp.cancel) {
            return;
        }
        this.morePopup.show();
    }

    private saveClick(): void {
        if (!((this.quickPopup.element.querySelector('.' + cls.FORM_CLASS) as EJ2Instance).ej2_instances[0] as FormValidator).validate()) {
            return;
        }
        let fields: EventFieldsMapping = this.parent.eventFields;
        let saveObj: { [key: string]: Object } =
            extend({}, this.parent.eventWindow.getObjectFromFormData(cls.POPUP_WRAPPER_CLASS)) as { [key: string]: Object };
        this.parent.eventWindow.setDefaultValueToObject(saveObj);
        saveObj[fields.id] = this.parent.eventBase.getEventMaxID();
        saveObj[fields.startTime] = this.parent.activeCellsData.startTime;
        saveObj[fields.endTime] = this.parent.activeCellsData.endTime;
        saveObj[fields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.resourceBase) {
            this.parent.resourceBase.setResourceValues(saveObj, true);
        }
        this.parent.currentAction = 'Add';
        this.crudAction.addEvent(saveObj);
        this.quickPopupHide();
    }

    private detailsClick(): void {
        let subjectEle: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectEle && subjectEle.value !== '') {
            let args: CellClickEventArgs = <CellClickEventArgs>extend(this.parent.activeCellsData, { subject: subjectEle.value });
        }
        this.fieldValidator.destroyToolTip();
        this.quickPopupHide();
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    }

    private editClick(): void {
        this.quickPopupHide(true);
        let data: { [key: string]: Object } = this.parent.activeEventData.event as { [key: string]: Object };
        this.parent.currentAction = 'EditSeries';
        if (!isNullOrUndefined(data[this.parent.eventFields.recurrenceRule])) {
            this.parent.currentAction = 'EditOccurrence';
            this.openRecurrenceAlert();
        } else {
            this.parent.eventWindow.openEditor(data, this.parent.currentAction);
        }
    }

    public deleteClick(): void {
        this.quickPopupHide(true);
        this.parent.currentAction = 'Delete';
        if ((<{ [key: string]: Object }>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule]) {
            this.openRecurrenceAlert();
        } else {
            this.openDeleteAlert();
        }
    }
    private updateMoreEventContent(): void {
        if (this.morePopup.element.classList.contains('e-popup-close')) {
            return;
        }
        let moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        let startDate: Date = this.parent.getDateFromElement(dateElement);
        let endDate: Date = new Date(parseInt(dateElement.getAttribute('data-end-date'), 10));
        let groupIndex: string = dateElement.getAttribute('data-group-index');
        let data: TdData;
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            groupOrder = data.groupOrder;
        }
        let filteredEvents: Object[] = this.parent.eventBase.filterEvents(startDate, endDate, this.parent.eventsProcessed, data);
        let moreElement: HTMLElement = this.createMoreEventList(filteredEvents as { [key: string]: Object }[], groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreElement);
    }

    private closeClick(): void {
        this.quickPopupHide();
        this.morePopup.hide();
    }

    private dialogButtonClick(event: Event): void {
        let cancelButton: Element = this.quickDialog.element.querySelector('.e-quick-alertcancel');
        if ((<HTMLElement>event.target).classList.contains('e-quick-alertok') &&
            (cancelButton.classList.contains('e-quick-alert-cancelpresent'))) {
            removeClass([cancelButton], 'e-quick-alert-cancelpresent');
            this.parent.eventWindow.eventSave(this.l10n.getConstant('ok'));
            return;
        }
        this.quickDialog.hide();
        if ((<HTMLElement>event.target).classList.contains(cls.QUICK_DIALOG_EDIT_EVENT_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteOccurrence' : 'EditOccurrence';
            switch (this.parent.currentAction) {
                case 'EditOccurrence':
                    this.parent.eventWindow.openEditor(this.parent.activeEventData.event, this.parent.currentAction);
                    break;
                case 'DeleteOccurrence':
                    this.crudAction.deleteEvent(<{ [key: string]: Object }>this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        } else if ((<HTMLElement>event.target).classList.contains(cls.QUICK_DIALOG_EDIT_SERIES_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteSeries' : 'EditSeries';
            switch (this.parent.currentAction) {
                case 'EditSeries':
                    let parentEvent: { [key: string]: Object } =
                        this.parent.eventBase.getRecurrenceEvent(<{ [key: string]: Object }>this.parent.activeEventData.event);
                    this.parent.eventWindow.openEditor(parentEvent, this.parent.currentAction);
                    break;
                case 'DeleteSeries':
                    this.crudAction.deleteEvent(<{ [key: string]: Object }>this.parent.activeEventData.event, this.parent.currentAction);
                    break;
            }
        } else if ((<HTMLElement>event.target).classList.contains(cls.QUICK_DIALOG_DELETE_CLASS)) {
            this.crudAction.deleteEvent(this.parent.activeEventData.event, this.parent.currentAction);
        }
    }

    private updateTapHoldEventPopup(target: Element): void {
        let selectedElements: Element[] = this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        if (selectedElements.length > 0) {
            let eventObj: Object = this.parent.eventBase.getEventByGuid(selectedElements[0].getAttribute('data-guid'));
            let titleContent: string = (selectedElements.length === 1) ?
                ((<{ [key: string]: Object }>eventObj)[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string :
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

    private getTimezone(event: { [key: string]: Object; }): string {
        let zoneDetails: string = '';
        zoneDetails += event[this.parent.eventFields.startTimezone] as string || '';
        zoneDetails += zoneDetails === '' ? '' : ' - ';
        zoneDetails += event[this.parent.eventFields.endTimezone] as string || '';
        return zoneDetails;
    }

    private getRecurrenceSummary(event: { [key: string]: Object; }): string {
        let recurrenceEditor: RecurrenceEditor = this.parent.eventWindow.getRecurrenceEditorInstance();
        let ruleSummary: string = recurrenceEditor.getRuleSummary(<string>event[this.parent.eventFields.recurrenceRule]);
        return ruleSummary.charAt(0).toUpperCase() + ruleSummary.slice(1);
    }

    private getDateFormat(date: Date, formatString: string): string {
        return this.parent.globalize.formatDate(date, { skeleton: formatString });
    }

    private getDataFromTarget(target: Element): Object {
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            return this.parent.activeEventData.event;
        }
        return this.parent.activeCellsData;
    }

    private beforeQuickDialogClose(): void {
        this.parent.eventBase.focusElement();
    }

    private beforeQuickPopupOpen(target: Element): void {
        let isEventPopup: Element = this.quickPopup.element.querySelector('.' + cls.EVENT_POPUP_CLASS);
        let popupType: PopupType = this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo';
        let eventProp: PopupOpenEventArgs = {
            type: popupType, cancel: false, data: this.getDataFromTarget(target),
            target: target, element: this.quickPopup.element
        };
        this.parent.trigger(event.popupOpen, eventProp);
        if (eventProp.cancel) {
            this.destroyButtons();
            if (eventProp.element.classList.contains(cls.POPUP_OPEN)) {
                this.quickPopupClose();
            }
            this.quickPopup.element.innerHTML = '';
            return;
        }
        let display: string = this.quickPopup.element.style.display;
        this.quickPopup.element.style.display = 'block';
        if (this.parent.isAdaptive) {
            this.quickPopup.element.removeAttribute('style');
            this.quickPopup.element.style.display = 'block';
            this.quickPopup.element.style.height = formatUnit((popupType === 'EditEventInfo') ? 65 : window.innerHeight);
        } else {
            this.quickPopup.offsetX = 10;
            this.quickPopup.collision = { X: 'none', Y: 'fit' };
            this.quickPopup.position = { X: 'right', Y: 'top' };
            this.quickPopup.dataBind();
            this.quickPopup.refreshPosition(null, true);
            let collide: string[] = isCollide(this.quickPopup.element, this.parent.element);
            if (collide.indexOf(this.parent.enableRtl ? 'left' : 'right') > -1) {
                this.quickPopup.offsetX = -(target as HTMLElement).offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                this.quickPopup.dataBind();
                let leftCollide: string[] = isCollide(this.quickPopup.element, this.parent.element);
                if (leftCollide.indexOf('left') > -1) {
                    this.quickPopup.position = { X: 'center', Y: 'center' };
                    this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                    this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                    this.quickPopup.dataBind();
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

    private applyEventColor(): void {
        let color: string = (<HTMLElement>this.parent.activeEventData.element).style.backgroundColor;
        if (color === '') {
            return;
        }
        let colorEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_HEADER_CLASS) as HTMLElement;
        let footerEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
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
        if (this.parent.isAdaptive) { return; }
        if (this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS)) {
            let subjectElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (subjectElement) {
                (<HTMLInputElement>subjectElement).focus();
            }
        } else {
            let editElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLElement;
            if (editElement) {
                (<HTMLInputElement>editElement).focus();
            }
            let editIcon: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLElement;
            if (editIcon) {
                (<HTMLInputElement>editIcon).focus();
            }
        }
    }

    private quickPopupClose(): void {
        this.parent.eventBase.focusElement();
        this.quickPopup.relateTo = cls.WORK_CELLS_CLASS;
        this.fieldValidator.destroyToolTip();
        this.destroyButtons();
        this.quickPopup.element.innerHTML = '';
    }

    private morePopupOpen(): void {
        (this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS) as HTMLElement).focus();
        this.morePopup.refreshPosition();
    }

    private morePopupClose(): void {
        let moreWrapper: Element = this.parent.element.querySelector('.' + cls.MORE_EVENT_WRAPPER_CLASS);
        if (moreWrapper) {
            moreWrapper.remove();
        }
    }

    public quickPopupHide(hideAnimation?: Boolean): void {
        if (this.quickPopup.element.classList.contains('e-popup-open')) {
            if (hideAnimation) {
                let animation: AnimationModel = this.quickPopup.hideAnimation;
                this.quickPopup.hideAnimation = null;
                this.quickPopup.hide();
                this.quickPopup.hideAnimation = animation;
            } else {
                this.quickPopup.hide();
            }
            this.isMultipleEventSelect = false;
        }
    }

    private navigationClick(e: Event): void {
        let navigateEle: Element = closest((e.target as Element), '.' + cls.NAVIGATE_CLASS);
        if (!isNullOrUndefined(navigateEle)) {
            let date: Date = this.parent.getDateFromElement(e.currentTarget as HTMLTableCellElement);
            if (!isNullOrUndefined(date) && !this.parent.isAdaptive) {
                this.closeClick();
                this.parent.setProperties({ selectedDate: date }, true);
                this.parent.changeView(this.parent.getNavigateView());
            }
        }
    }

    private documentClick(e: { event: Event }): void {
        let target: Element = e.event.target as Element;
        let classNames: string = '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.HEADER_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS +
            ',.' + cls.WORK_CELLS_CLASS + ',.' + cls.APPOINTMENT_CLASS;
        if (!closest(target, classNames)) {
            this.quickPopupHide();
        }
        if (!closest(target, '.' + cls.MORE_POPUP_WRAPPER_CLASS) && !target.classList.contains(cls.MORE_INDICATOR_CLASS)
            && (!closest(target, '.' + cls.POPUP_OPEN))) {
            this.morePopup.hide();
        }
    }

    public onClosePopup(): void {
        this.quickPopupHide();
        this.parent.eventBase.focusElement();
    }

    private addEventListener(): void {
        this.parent.on(event.cellClick, this.cellClick, this);
        this.parent.on(event.eventClick, this.eventClick, this);
        this.parent.on(event.documentClick, this.documentClick, this);
        this.parent.on(event.dataReady, this.updateMoreEventContent, this);
        this.parent.on(event.tapHoldReady, this.tapHoldEventPopup, this);
    }

    private removeEventListner(): void {
        this.parent.off(event.cellClick, this.cellClick);
        this.parent.off(event.eventClick, this.eventClick);
        this.parent.off(event.documentClick, this.documentClick);
        this.parent.off(event.dataReady, this.updateMoreEventContent);
        this.parent.off(event.tapHoldReady, this.tapHoldEventPopup);
    }

    private destroyButtons(): void {
        let buttonCollections: HTMLElement[] = [].slice.call(this.quickPopup.element.querySelectorAll('.e-control.e-btn'));
        buttonCollections.forEach((button: HTMLElement) => {
            let instance: Button = (button as EJ2Instance).ej2_instances[0] as Button;
            if (instance) {
                instance.destroy();
            }
        });
    }

    public destroy(): void {
        this.fieldValidator.destroy();
        this.removeEventListner();
        this.destroyButtons();
        this.quickPopup.destroy();
        remove(this.quickPopup.element);
        this.morePopup.destroy();
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog.element = null;
        }
    }
}