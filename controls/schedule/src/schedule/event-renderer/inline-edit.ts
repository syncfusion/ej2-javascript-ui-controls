/* eslint-disable @typescript-eslint/no-explicit-any */
import { addClass, createElement, closest, remove, removeClass } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { CurrentAction } from '../base/type';
import { InlineClickArgs, TdData } from '../base/interface';
import { VerticalEvent } from '../event-renderer/vertical-view';
import { MonthEvent } from '../event-renderer/month';
import { TimelineEvent } from '../event-renderer/timeline-view';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';

/**
 * Inline Edit interactions
 */
export class InlineEdit {
    private parent: Schedule;

    constructor(parent: Schedule) {
        this.parent = parent;
        this.parent.on(events.inlineClick, this.inlineEdit, this);
    }

    private inlineEdit(args: InlineClickArgs): void {
        if (this.parent.quickPopup) {
            this.parent.quickPopup.quickPopupHide();
        }
        const moreWrapper: Element = this.parent.element.querySelector('.e-more-popup-wrapper ');
        if (moreWrapper && moreWrapper.classList.contains(cls.POPUP_OPEN)) {
           this.parent.quickPopup.morePopup.hide();
        }
        if (args.type === 'Cell') {
            this.removeInlineAppointmentElement();
            this.cellEdit(args);
        } else {
            if (this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) !==
                args.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
                this.removeInlineAppointmentElement();
            }
            this.eventEdit(args);
        }
    }

    private cellEdit(args: InlineClickArgs): void {
        const saveObj: Record<string, any> = this.generateEventData();
        let cellIndex: number = (args.element as HTMLTableCellElement).cellIndex;
        let count: number = this.getEventDaysCount(saveObj);
        if (count > 1) {
            count = Math.round(count);
            count--;
            cellIndex = cellIndex - count;
        }
        const start: number = util.resetTime(new Date('' + saveObj[this.parent.eventFields.startTime])).getTime();
        const end: number = util.resetTime(new Date('' + saveObj[this.parent.eventFields.endTime])).getTime();
        const resIndex: number = args.groupIndex || 0;
        if (this.parent.currentView === 'Day' || this.parent.currentView === 'Week' || this.parent.currentView === 'WorkWeek') {
            const dayIndex: number = (saveObj[this.parent.eventFields.startTime] as Date).getDay();
            this.createVerticalViewInline(saveObj, dayIndex, resIndex, cellIndex);
        } else if (this.parent.currentView === 'Month') {
            this.createMonthViewInline(saveObj, resIndex, start, end);
        } else {
            this.createTimelineViewInline(saveObj, start, end, resIndex);
        }
        const inlineSubject: Element = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            (inlineSubject as HTMLElement).focus();
        }
    }

    private eventEdit(args: InlineClickArgs): void {
        let inlineSubject: HTMLInputElement = args.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        let subject: string;
        if (inlineSubject) {
            subject = inlineSubject.value;
        } else {
            const subEle: HTMLElement = args.element.querySelector('.' + cls.SUBJECT_CLASS);
            const timeEle: HTMLElement = args.element.querySelector('.' + cls.APPOINTMENT_TIME);
            subject = subEle.innerText;
            inlineSubject = createElement('input', { className: cls.INLINE_SUBJECT_CLASS, attrs: { value: subject } }) as HTMLInputElement;
            addClass([subEle], cls.DISABLE_CLASS);
            if (closest(args.element, '.' + cls.MORE_POPUP_WRAPPER_CLASS)) {
                args.element.insertBefore(inlineSubject, subEle);
            } else if (['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) > -1) {
                const subjectWrap: Element = args.element.querySelector('.' + cls.SUBJECT_WRAP);
                subjectWrap.insertBefore(inlineSubject, subjectWrap.firstChild);
            } else {
                const elementSelector: string = ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'].indexOf(this.parent.currentView) > -1 ?
                    '.e-inner-wrap' : '.e-appointment-details';
                args.element.querySelector(elementSelector).insertBefore(inlineSubject, timeEle);
            }
        }
        inlineSubject.focus();
        inlineSubject.setSelectionRange(subject.length, subject.length);
    }

    private createVerticalViewInline(saveObj: Record<string, any>, dayIndex: number, resIndex: number, daysCount: number): void {
        const count: number = this.getEventDaysCount(saveObj);
        const verticalEvent: VerticalEvent = new VerticalEvent(this.parent);
        verticalEvent.initializeValues();
        const index: number = verticalEvent.dateRender[resIndex].map((date: Date) => date.getDay()).indexOf(dayIndex);
        if (count >= 1) {
            verticalEvent.allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
            verticalEvent.slots.push(...this.parent.activeView.renderDates.map((date: Date) => +date));
            const allDayElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_APPOINTMENT_CLASS));
            let allDayLevel: number = 0;
            if (allDayElements.length > 0) {
                allDayLevel = Math.floor(this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).getBoundingClientRect().height /
                    allDayElements[0].offsetHeight) - 1;
            }
            verticalEvent.allDayLevel = allDayLevel;
            verticalEvent.renderAllDayEvents(saveObj, index, resIndex, daysCount, this.parent.allowInline);
        } else {
            verticalEvent.renderNormalEvents(saveObj, index, resIndex, daysCount, this.parent.allowInline);
        }
    }

    private createMonthViewInline(saveObj: Record<string, any>, index: number, start: number, end: number): void {
        const count: number = this.getEventDaysCount(saveObj);
        const saveObject: Record<string, any> = this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        const monthEvent: MonthEvent = new MonthEvent(this.parent);
        monthEvent.dateRender = this.parent.activeView.renderDates;
        monthEvent.inlineValue = this.parent.allowInline;
        let renderDates: Date[] = this.parent.activeView.renderDates;
        let workDays: number[] = this.parent.activeViewOptions.workDays;
        let monthCellSelector: string = '.' + cls.WORK_CELLS_CLASS;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            monthCellSelector += '[data-group-index="' + index + '"]';
            const resourceData: TdData = this.parent.resourceBase.lastResourceLevel[index];
            renderDates = resourceData.renderDates;
            workDays = resourceData.workDays;
        }
        monthEvent.workCells = [].slice.call(this.parent.element.querySelectorAll(monthCellSelector));
        monthEvent.cellWidth = monthEvent.workCells[0].offsetWidth;
        monthEvent.cellHeight = monthEvent.workCells[0].offsetHeight;
        monthEvent.eventHeight = util.getElementHeightFromClass(this.parent.monthModule.element, cls.APPOINTMENT_CLASS);
        monthEvent.getSlotDates(workDays);
        const filteredDates: Date[] = monthEvent.getRenderedDates(renderDates);
        const splittedEvents: Record<string, any>[] = monthEvent.splitEvent(saveObject, filteredDates || renderDates);
        for (const eventData of splittedEvents) {
            monthEvent.renderEvents(eventData, index);
        }
        const inlineSubject: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        inlineSubject.focus();
    }

    private createTimelineViewInline(saveObj: Record<string, any>, start: number, end: number, resIndex: number): void {
        const count: number = this.getEventDaysCount(saveObj);
        const saveObject: Record<string, any> = this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        const timelineView: TimelineEvent = new TimelineEvent(this.parent, this.parent.activeViewOptions.timeScale.enable ? 'hour' : 'day');
        timelineView.dateRender = this.parent.activeView.renderDates;
        timelineView.eventContainers = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        const workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
        timelineView.inlineValue = this.parent.allowInline;
        timelineView.cellWidth = workCell.offsetWidth;
        timelineView.cellHeight = workCell.offsetHeight;
        const dayLength: number = this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr').length === 0 ?
            0 : this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        timelineView.slotsPerDay = dayLength / timelineView.dateRender.length;
        timelineView.eventHeight = util.getElementHeightFromClass(timelineView.element, cls.APPOINTMENT_CLASS);
        timelineView.renderEvents(saveObject, resIndex);
    }

    private getEventDaysCount(saveObj: Record<string, any>): number {
        const startDate: Date = saveObj[this.parent.eventFields.startTime] as Date;
        const endDate: Date = saveObj[this.parent.eventFields.endTime] as Date;
        const daysCount: number = Math.abs(endDate.getTime() - startDate.getTime()) / util.MS_PER_DAY;
        return daysCount;
    }

    private generateEventData(target?: HTMLTableCellElement): Record<string, any> {
        const inlineElement: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        const subject: string = inlineElement ? inlineElement.value : target ? target.innerHTML : '';
        const saveObj: Record<string, any> = {};
        saveObj[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
        saveObj[this.parent.eventFields.subject] = subject;
        saveObj[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        saveObj[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        saveObj[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        this.parent.eventWindow.setDefaultValueToObject(saveObj);
        if (this.parent.resourceBase) {
            this.parent.resourceBase.setResourceValues(saveObj, this.parent.activeCellsData.groupIndex);
        }
        return saveObj;
    }

    public documentClick(): void {
        const target: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        if (target && target.value !== '') {
            this.inlineCrudActions(target as HTMLTableCellElement & HTMLInputElement);
        }
    }

    public inlineCrudActions(target: HTMLTableCellElement): void {
        if (closest(target, '.' + cls.INLINE_APPOINTMENT_CLASS)) {
            const saveObj: Record<string, any> = this.generateEventData(target);
            this.parent.addEvent(saveObj);
        } else {
            const eventTarget: Element = closest(target, '.' + cls.APPOINTMENT_CLASS);
            const eventDetails: Record<string, any> = this.parent.getEventDetails(eventTarget) as Record<string, any>;
            eventDetails[this.parent.eventFields.subject] = (target as HTMLTableCellElement & HTMLInputElement).value;
            let currentAction: CurrentAction;
            if (eventDetails[this.parent.eventFields.id] === eventDetails[this.parent.eventFields.recurrenceID]) {
                currentAction = 'EditOccurrence';
                eventDetails[this.parent.eventFields.id] = this.parent.eventBase.getEventMaxID();
            }
            this.parent.saveEvent(eventDetails, currentAction);
        }
        this.removeInlineAppointmentElement();
    }

    public createInlineAppointmentElement(inlineData?: Record<string, any>): HTMLElement {
        const inlineAppointmentElement: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS + ' ' + cls.INLINE_APPOINTMENT_CLASS
        });
        const inlineDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        inlineAppointmentElement.appendChild(inlineDetails);
        const inline: HTMLElement = createElement('input', { className: cls.INLINE_SUBJECT_CLASS });
        inlineDetails.appendChild(inline);
        if (inlineData) {
            this.parent.eventBase.applyResourceColor(inlineAppointmentElement, inlineData, 'backgroundColor');
        }
        return inlineAppointmentElement;
    }

    public removeInlineAppointmentElement(): void {
        const inlineAppointment: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.INLINE_APPOINTMENT_CLASS));
        if (inlineAppointment.length > 0) {
            inlineAppointment.forEach((node: Element) => remove(node));
        }
        const inlineSubject: Element = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            const appointmentSubject: Element = closest(inlineSubject, '.' + cls.APPOINTMENT_CLASS);
            removeClass([appointmentSubject.querySelector('.' + cls.SUBJECT_CLASS)], cls.DISABLE_CLASS);
            remove(inlineSubject);
        }
    }

    public destroy(): void {
        this.parent.off(events.inlineClick, this.inlineEdit);
    }

}
