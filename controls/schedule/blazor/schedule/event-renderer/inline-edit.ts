import { addClass, createElement, closest, remove, removeClass } from '@syncfusion/ej2-base';
import { VerticalEvent } from './vertical-view';
import { MonthEvent } from './month';
import { TimelineEvent } from './timeline-view';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { SfSchedule } from '../../schedule';

/**
 * Inline Edit interactions
 */
export class InlineEdit {
    private parent: SfSchedule;

    constructor(parent: SfSchedule) {
        this.parent = parent;
    }

    public inlineEdit(clickType: string, isTemplate: boolean, guid: string = null): void {
        if (clickType === 'Cell') {
            this.removeInlineAppointmentElement();
            this.cellEdit();
        } else {
            if (isTemplate) {
                return;
            }
            let activeEvent: HTMLElement = this.parent.element.querySelector('.e-appointment[data-guid="' + guid + '"]');
            if (this.parent.element.querySelector('.e-more-popup-wrapper') &&
                this.parent.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')) {
                activeEvent = this.parent.element.querySelector('.e-more-popup-wrapper .e-appointment[data-guid="' + guid + '"]');
            }
            if (this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) !==
                activeEvent.querySelector('.' + cls.INLINE_SUBJECT_CLASS)) {
                this.removeInlineAppointmentElement();
            }
            this.eventEdit(activeEvent);
        }
    }

    public cellEdit(): void {
        let saveObj: { [key: string]: Object } = this.generateEventData();
        let cellIndex: number = (this.parent.activeCellsData.element as HTMLTableCellElement).cellIndex;
        let count: number = this.getEventDaysCount(saveObj);
        if (count > 1) {
            count = Math.round(count);
            count--;
            cellIndex = cellIndex - count;
        }
        let start: number = new Date('' + saveObj.startTime).getTime();
        let end: number = new Date('' + saveObj.endTime).getTime();
        let resIndex: number = saveObj.groupIndex as number || 0;
        if (this.parent.options.currentView === 'Day' || this.parent.options.currentView === 'Week' ||
            this.parent.options.currentView === 'WorkWeek') {
            let dayIndex: number = (saveObj.startTime as Date).getDay();
            this.createVerticalViewInline(saveObj, dayIndex, resIndex, cellIndex);
        } else if (this.parent.options.currentView === 'Month') {
            this.createMonthViewInline(saveObj, resIndex, start, end);
        } else {
            this.createTimelineViewInline(saveObj, start, end, resIndex);
        }
        let inlineSubject: Element = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            (inlineSubject as HTMLElement).focus();
        }
    }

    public createInlineAppointmentElement(): HTMLElement {
        let inlineAppointmentElement: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS + ' ' + cls.INLINE_APPOINTMENT_CLASS
        });
        let inlineDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        inlineAppointmentElement.appendChild(inlineDetails);
        let inline: HTMLElement = createElement('input', { className: cls.INLINE_SUBJECT_CLASS });
        inlineDetails.appendChild(inline);
        return inlineAppointmentElement;
    }

    public removeInlineAppointmentElement(): void {
        let inlineAppointment: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.INLINE_APPOINTMENT_CLASS));
        if (inlineAppointment.length > 0) {
            inlineAppointment.forEach((node: Element) => remove(node));
        }
        let inlineSubject: Element = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS);
        if (inlineSubject) {
            let appointmentSubject: Element = closest(inlineSubject, '.' + cls.APPOINTMENT_CLASS);
            removeClass([appointmentSubject.querySelector('.' + cls.SUBJECT_CLASS)], cls.DISABLE_CLASS);
            remove(inlineSubject);
        }
    }

    private createVerticalViewInline(saveObj: { [key: string]: Object }, dayIndex: number, resIndex: number, daysCount: number): void {
        let count: number = this.getEventDaysCount(saveObj);
        let verticalEvent: VerticalEvent = new VerticalEvent(this.parent);
        verticalEvent.initializeValues();
        let index: number = 0;
        if (count >= 1) {
            verticalEvent.allDayElement = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
            let allDayElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.ALLDAY_APPOINTMENT_CLASS));
            let allDayLevel: number = 0;
            if (allDayElements.length > 0) {
                allDayLevel = Math.floor(this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).getBoundingClientRect().height /
                    allDayElements[0].offsetHeight) - 1;
            }
            verticalEvent.allDayLevel = allDayLevel;
            verticalEvent.renderAllDayEvents(saveObj, index, resIndex, daysCount);
        } else {
            verticalEvent.renderNormalEvents(saveObj, index, resIndex, daysCount);
        }
    }

    private createMonthViewInline(saveObj: { [key: string]: Object }, index: number, start: number, end: number): void {
        let count: number = this.getEventDaysCount(saveObj);
        let saveObject: { [key: string]: Object } = this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        let monthEvent: MonthEvent = new MonthEvent(this.parent);
        monthEvent.dateRender = this.parent.activeView.renderDates;
        let renderDates: Date[] = this.parent.activeView.renderDates;
        let workDays: number[] = this.parent.activeViewOptions.workDays;
        if (this.parent.activeCellsData.groupIndex >= 0) {
            monthEvent.workCells = [].slice.call(this.parent.element.querySelectorAll
                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + index + '"]'));
        } else {
            monthEvent.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        }
        monthEvent.cellWidth = monthEvent.workCells[0].offsetWidth;
        monthEvent.cellHeight = monthEvent.workCells[0].offsetHeight;
        monthEvent.eventHeight = util.getElementHeightFromClass(this.parent.element, cls.APPOINTMENT_CLASS);
        monthEvent.getSlotDates(workDays);
        let filteredDates: Date[] = monthEvent.getRenderedDates(renderDates);
        let splittedEvents: { [key: string]: Object }[] = monthEvent.splitEvent(saveObject, filteredDates || renderDates);
        for (let eventData of splittedEvents) {
            monthEvent.renderEvents(eventData, index);
        }
        let inlineSubject: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        inlineSubject.focus();
    }

    private createTimelineViewInline(saveObj: { [key: string]: Object }, start: number, end: number, resIndex: number): void {
        let count: number = this.getEventDaysCount(saveObj);
        let saveObject: { [key: string]: Object } =
            this.parent.eventBase.cloneEventObject(saveObj, start, end, count, false, false);
        let timelineView: TimelineEvent =
            new TimelineEvent(this.parent, this.parent.activeViewOptions.timeScale.enable ? 'hour' : 'day');
        timelineView.dateRender = this.parent.activeView.renderDates;
        timelineView.eventContainers = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        if (this.parent.activeCellsData.groupIndex >= 0) {
            timelineView.workCells = [].slice.call(this.parent.element.querySelectorAll
                ('.' + cls.WORK_CELLS_CLASS + '[data-group-index="' + resIndex + '"]'));
        } else {
            timelineView.workCells = [].slice.call(this.parent.element.querySelectorAll('.' + cls.WORK_CELLS_CLASS));
        }
        let workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
        timelineView.inlineValue = this.parent.options.allowInline;
        timelineView.cellWidth = workCell.offsetWidth;
        timelineView.cellHeight = workCell.offsetHeight;
        let dayLength: number = this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr').length === 0 ?
            0 : this.parent.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr')[0].children.length;
        timelineView.slotsPerDay = dayLength / timelineView.dateRender.length;
        timelineView.eventHeight = util.getElementHeightFromClass(timelineView.parent.element, cls.APPOINTMENT_CLASS);
        timelineView.renderEvents(saveObject, resIndex);
    }

    private getEventDaysCount(saveObj: { [key: string]: Object }): number {
        let startDate: Date = saveObj.startTime as Date;
        let endDate: Date = saveObj.endTime as Date;
        let daysCount: number = Math.abs(endDate.getTime() - startDate.getTime()) / util.MS_PER_DAY;
        return daysCount;
    }

    public generateEventData(target?: HTMLTableCellElement): { [key: string]: Object } {
        let inlineElement: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        let subject: string = inlineElement ? inlineElement.value : target ? target.innerHTML : '';
        let saveObj: { [key: string]: Object } = {};
        saveObj.subject = subject;
        saveObj.startTime = this.parent.activeCellsData.startTime;
        saveObj.endTime = this.parent.activeCellsData.endTime;
        saveObj.isAllDay = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeCellsData.groupIndex >= 0) {
            saveObj.groupIndex = this.parent.activeCellsData.groupIndex;
        }
        return saveObj;
    }

    private eventEdit(activeEvent: HTMLElement): void {
        let inlineSubject: HTMLInputElement = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS) as HTMLInputElement;
        let subject: string;
        if (inlineSubject) {
            subject = inlineSubject.value;
        } else {
            let subEle: HTMLElement = activeEvent.querySelector('.' + cls.SUBJECT_CLASS);
            let timeEle: HTMLElement = activeEvent.querySelector('.' + cls.APPOINTMENT_TIME);
            subject = subEle.innerText;
            inlineSubject = createElement('input', { className: cls.INLINE_SUBJECT_CLASS, attrs: { value: subject } }) as HTMLInputElement;
            addClass([subEle], cls.DISABLE_CLASS);
            if (closest(activeEvent, '.' + cls.MORE_POPUP_WRAPPER_CLASS)) {
                activeEvent.insertBefore(inlineSubject, subEle);
            } else if (['Agenda', 'MonthAgenda'].indexOf(this.parent.options.currentView) > -1) {
                let subjectWrap: Element = activeEvent.querySelector('.' + cls.SUBJECT_WRAP);
                subjectWrap.insertBefore(inlineSubject, subjectWrap.firstChild);
            } else {
                let elementSelector: string = ['TimelineWeek', 'TimelineMonth'].indexOf(this.parent.options.currentView) > -1 ?
                    '.e-inner-wrap' : '.e-appointment-details';
                activeEvent.querySelector(elementSelector).insertBefore(inlineSubject, timeEle);
            }
        }
        inlineSubject.focus();
        inlineSubject.setSelectionRange(subject.length, subject.length);
    }
}
