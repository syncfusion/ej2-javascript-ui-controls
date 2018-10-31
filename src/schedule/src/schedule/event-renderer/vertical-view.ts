import { append, createElement, extend, EventHandler, prepend, Animation, formatUnit } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove, removeClass, addClass } from '@syncfusion/ej2-base';
import { DataManager, Query, Predicate } from '@syncfusion/ej2-data';
import { EventFieldsMapping, ElementData, EventRenderedArgs, TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
import { EventBase } from './event-base';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

/**
 * Vertical view appointment rendering
 */
export class VerticalEvent extends EventBase {
    private dateRender: Date[][] = [];
    private renderedEvents: Object[][] = [];
    private renderedAllDayEvents: Object[][] = [];
    private overlapEvents: Object[][] = [];
    private moreEvents: Object[] = [];
    private overlapList: Object[] = [];
    private allDayEvents: Object[] = [];
    private slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    private allDayLevel: number = 0;
    private startHour: Date = this.parent.activeView.getStartHour();
    private endHour: Date = this.parent.activeView.getEndHour();
    private element: HTMLElement;
    private allDayElement: Element[];
    private animation: Animation;
    private fields: EventFieldsMapping;
    private cellHeight: number;
    private resources: TdData[];
    /**
     * Constructor for vertical view
     */
    constructor(parent: Schedule) {
        super(parent);
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.animation = new Animation({ progress: this.animationUiUpdate.bind(this) });
        this.addEventListener();
    }

    public renderAppointments(): void {
        let wrapperElements: HTMLElement[] =
            [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS + ',.' + cls.ROW_COUNT_WRAPPER_CLASS));
        wrapperElements.forEach((element: HTMLElement) => remove(element));
        this.allDayElement = [].slice.call(this.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
        this.setAllDayRowHeight(0);
        if (this.parent.eventsProcessed.length === 0) {
            return;
        }
        let expandCollapse: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
        EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        this.renderedEvents = [];
        this.renderedAllDayEvents = [];
        this.resources = (this.parent.activeViewOptions.group.resources.length > 0) ? this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel : [];
        this.cellHeight = (this.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement).offsetHeight;
        this.dateRender[0] = this.parent.activeView.renderDates;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.resources.forEach((resource: TdData, index: number) => this.dateRender[index] = resource.renderDates);
        }
        this.renderEvents('normalEvents');
        if (this.allDayEvents.length > 0) {
            this.allDayEvents = this.allDayEvents.filter((item: { [key: string]: Object }, index: number, arr: Object[]) => {
                return index === arr.map((item: { [key: string]: Object }) => item.Guid).indexOf(item.Guid);
            });
            removeClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
            this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }));
            this.renderEvents('allDayEvents');
        }
        this.parent.notify(events.contentReady, {});
        addClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
    }

    private renderEvents(eventType: string): void {
        removeClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
        let eventCollection: Object[] = (eventType === 'allDayEvents') ? this.sortByDateTime(this.allDayEvents) : undefined;
        let resources: number[] = this.getResourceList();
        let dateCount: number = 0;
        for (let resource of resources) {
            let renderDates: Date[] = this.dateRender[resource];
            for (let day: number = 0, length: number = renderDates.length; day < length; day++) {
                this.renderedEvents = [];
                let startDate: Date = new Date(renderDates[day].getTime());
                let endDate: Date = util.addDays(renderDates[day], 1);
                let filterEvents: Object[] = this.filterEvents(startDate, endDate, eventCollection, this.resources[resource]);
                for (let event of filterEvents) {
                    if (this.parent.resourceBase) {
                        this.setValues(event as { [key: string]: Object }, resource);
                    }
                    if (eventType === 'allDayEvents') {
                        this.renderAllDayEvents(<{ [key: string]: Object }>event, day, resource, dateCount);
                    } else {
                        if (this.isAllDayAppointment(<{ [key: string]: Object }>event)) {
                            this.allDayEvents.push(extend({}, event, null, true));
                        } else {
                            this.renderNormalEvents(<{ [key: string]: Object }>event, day, resource, dateCount);
                        }
                    }
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    }

    private setValues(event: { [key: string]: Object }, resourceIndex: number): void {
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.cssClass = this.resources[resourceIndex].cssClass;
            this.groupOrder = this.resources[resourceIndex].groupOrder;
        } else {
            this.cssClass = this.parent.resourceBase.getCssClass(event);
        }
    }

    private getResourceList(): number[] {
        let resources: number[] = Array.apply(null, {
            length: (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) ?
                this.resources.length : 1
        }).map((value: number, index: number) => { return index; });
        return resources;
    }

    private createAppointmentElement(record: { [key: string]: Object }, isAllDay: boolean, data: Object, resource: number): HTMLElement {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let recordSubject: string = (record[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[fieldMapping.id],
                'data-guid': record.Guid as string,
                'role': 'button',
                'tabindex': '0',
                'aria-readonly': 'false',
                'aria-selected': 'false',
                'aria-grabbed': 'true',
                'aria-label': recordSubject
            }
        });
        let appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let resourceIndex: number = this.parent.isAdaptive ? this.parent.uiStateValues.groupIndex : resource;
            appointmentWrapper.setAttribute('data-group-index', resourceIndex.toString());
        }
        let templateElement: HTMLElement[];
        let eventData: { [key: string]: Object } = <{ [key: string]: Object }>data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            templateElement = this.parent.getAppointmentTemplate()(record);
        } else {
            let appointmentSubject: HTMLElement = createElement('div', { className: cls.SUBJECT_CLASS, innerHTML: recordSubject });
            if (isAllDay) {
                if (record[fieldMapping.isAllDay]) {
                    templateElement = [appointmentSubject];
                } else {
                    templateElement = [];
                    let appointmentStartTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.startTime] as Date)
                    });
                    let appointmentEndTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.endTime] as Date),
                    });
                    addClass([appointmentSubject], 'e-text-center');
                    if (!eventData.isLeft) {
                        templateElement.push(appointmentStartTime);
                    }
                    templateElement.push(appointmentSubject);
                    if (!eventData.isRight) {
                        templateElement.push(appointmentEndTime);
                    }
                }
            } else {
                let timeStr: string = this.parent.getTimeString(record[fieldMapping.startTime] as Date) + ' - ' +
                    this.parent.getTimeString(record[fieldMapping.endTime] as Date);
                let appointmentTime: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                    innerHTML: timeStr,
                });
                let appointmentLocation: HTMLElement = createElement('div', {
                    className: cls.LOCATION_CLASS,
                    innerHTML: (record[fieldMapping.location] || this.parent.eventSettings.fields.location.default || '') as string
                });
                templateElement = [appointmentSubject, appointmentTime, appointmentLocation];
            }
        }
        append(templateElement, appointmentDetails);
        if (!this.parent.isAdaptive && !isNullOrUndefined(record[fieldMapping.recurrenceRule])) {
            let iconClass: string = (record[fieldMapping.id] === record[fieldMapping.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            let recurrenceIcon: HTMLElement = createElement('div', { className: cls.ICON + ' ' + iconClass });
            isAllDay ? appointmentDetails.appendChild(recurrenceIcon) : appointmentWrapper.appendChild(recurrenceIcon);
        }
        this.renderSpannedIcon(isAllDay ? appointmentDetails : appointmentWrapper, eventData);
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        this.applyResourceColor(appointmentWrapper, record, 'backgroundColor', this.groupOrder);
        this.renderResizeHandler(appointmentWrapper, eventData);
        return appointmentWrapper;
    }

    private createMoreIndicator(allDayRow: HTMLElement[], count: number, currentDay: number): void {
        let index: number = currentDay + count;
        let countWrapper: HTMLElement = allDayRow[index] as HTMLElement;
        if (countWrapper.childElementCount <= 0) {
            let innerCountWrap: Element = createElement('div', {
                className: cls.ROW_COUNT_WRAPPER_CLASS,
                id: cls.ROW_COUNT_WRAPPER_CLASS + '-' + index.toString()
            });
            let moreIndicatorElement: Element = createElement('div', {
                className: cls.MORE_INDICATOR_CLASS,
                attrs: { 'tabindex': '0', 'data-index': index.toString(), 'data-count': '1' },
                innerHTML: '+1&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'))
            });
            innerCountWrap.appendChild(moreIndicatorElement);
            countWrapper.appendChild(innerCountWrap);
            EventHandler.add(moreIndicatorElement, 'click', this.rowExpandCollapse, this);
        } else {
            let countCell: HTMLElement = countWrapper.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
            let moreCount: number = parseInt(countCell.getAttribute('data-count'), 10) + 1;
            countCell.setAttribute('data-count', moreCount.toString());
            countCell.innerHTML = countCell.innerHTML.replace(/[0-9]/g, moreCount.toString());
        }
    }

    private renderSpannedIcon(element: HTMLElement, spanEvent: { [key: string]: Object }): void {
        let iconElement: HTMLElement = createElement('div', { className: cls.EVENT_INDICATOR_CLASS + ' ' + cls.ICON });
        if (spanEvent.isLeft) {
            let iconLeft: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconLeft], cls.EVENT_ICON_LEFT_CLASS);
            prepend([iconLeft], element);
        }
        if (spanEvent.isRight) {
            let iconRight: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconRight], cls.EVENT_ICON_RIGHT_CLASS);
            append([iconRight], element);
        }
        if (spanEvent.isTop) {
            let iconTop: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconTop], cls.EVENT_ICON_UP_CLASS);
            prepend([iconTop], element);
        }
        if (spanEvent.isBottom) {
            let iconBottom: HTMLElement = iconElement.cloneNode() as HTMLElement;
            addClass([iconBottom], cls.EVENT_ICON_DOWN_CLASS);
            append([iconBottom], element);
        }
    }

    private isSpannedEvent(record: { [key: string]: Object }, day: number, resource: number): { [key: string]: Object } {
        let currentDate: Date = util.resetTime(this.dateRender[resource][day]);
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let startEndHours: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let event: { [key: string]: Object } = extend({}, record, null, true) as { [key: string]: Object };
        event.isSpanned = { isBottom: false, isTop: false };
        if ((<Date>record[fieldMapping.startTime]).getTime() < startEndHours.startHour.getTime()) {
            event[fieldMapping.startTime] = startEndHours.startHour;
            (event.isSpanned as { [key: string]: Object }).isTop = true;
        }
        if ((<Date>record[fieldMapping.endTime]).getTime() > startEndHours.endHour.getTime()) {
            event[fieldMapping.endTime] = startEndHours.endHour;
            (event.isSpanned as { [key: string]: Object }).isBottom = true;
        }
        return event;
    }

    private renderAllDayEvents(eventObj: { [key: string]: Object }, dayIndex: number, resource: number, dayCount: number): void {
        let currentDates: Date[] = this.dateRender[resource];
        if (this.parent.activeViewOptions.group.byDate) {
            this.slots[0] = [this.dateRender[resource][dayIndex].getTime()];
            currentDates = [this.dateRender[resource][dayIndex]];
        }
        let record: { [key: string]: Object } = this.splitEvent(eventObj, currentDates)[0];
        let allDayRowCell: Element = this.element.querySelector('.' + cls.ALLDAY_CELLS_CLASS + ':first-child');
        let cellTop: number = (<HTMLElement>allDayRowCell).offsetTop;
        let eStart: Date = new Date((record[this.parent.eventFields.startTime] as Date).getTime());
        let eEnd: Date = new Date((record[this.parent.eventFields.endTime] as Date).getTime());
        let appWidth: number = 0; let appLeft: string = '0%'; let topValue: number = 1; let appLevel: number = 0;
        let isDateRange: boolean = currentDates[0].getTime() <= eStart.getTime() &&
            util.addDays(currentDates.slice(-1)[0], 1).getTime() >= eStart.getTime();
        if (eStart <= eEnd && isDateRange) {
            let isAlreadyRendered: Object[] = [];
            if (this.renderedAllDayEvents[resource]) {
                isAlreadyRendered = this.renderedAllDayEvents[resource].filter((event: { [key: string]: Object }) =>
                    event.Guid === eventObj.Guid);
                if (this.parent.activeViewOptions.group.byDate) {
                    isAlreadyRendered = isAlreadyRendered.filter((event: { [key: string]: Object }) =>
                        event[this.parent.eventFields.startTime] >= currentDates[dayIndex] &&
                        event[this.parent.eventFields.endTime] <= util.addDays(new Date(+currentDates[dayIndex]), 1)
                    );
                }
            }
            if (isAlreadyRendered.length === 0) {
                let allDayDifference: number = (record.data as { [key: string]: Object }).count as number;
                let allDayIndex: number = this.getOverlapIndex(record, dayIndex, true, resource);
                record.Index = allDayIndex;
                this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
                let widthAdjustment: number = (<{ [key: string]: Object }>record.data).isRight ? 0 :
                    this.parent.currentView === 'Day' ? 4 : 7;
                if (allDayDifference >= 0) {
                    appWidth = (allDayDifference * 100) - widthAdjustment;
                }
                if (isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                    this.renderedAllDayEvents[resource] = [];
                }
                this.renderedAllDayEvents[resource].push(extend({}, record, null, true));
                let allDayRow: HTMLElement[] = [].slice.call(this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).children);
                let wIndex: number = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
                let eventWrapper: Element = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS +
                    ':nth-child(' + (wIndex + 1) + ')');
                let appointmentElement: HTMLElement = this.createAppointmentElement(eventObj, true, record.data, resource);
                addClass([appointmentElement], cls.ALLDAY_APPOINTMENT_CLASS);
                let args: EventRenderedArgs = { data: eventObj, element: appointmentElement, cancel: false };
                this.parent.trigger(events.eventRendered, args);
                if (args.cancel) {
                    return;
                }
                eventWrapper.appendChild(appointmentElement);
                let appHeight: number = appointmentElement.offsetHeight;
                topValue += (allDayIndex === 0 ? cellTop : (cellTop + (allDayIndex * appHeight))) + 1;
                setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': topValue + 'px' });
                if (allDayIndex > 1) {
                    this.moreEvents.push(appointmentElement);
                    for (let count: number = 0, length: number = allDayDifference; count < length; count++) {
                        this.createMoreIndicator(allDayRow, count, wIndex);
                    }
                }
                allDayRowCell.setAttribute('data-count', this.allDayLevel.toString());
                let allDayRowHeight: number = ((!this.parent.uiStateValues.expand && this.allDayLevel > 2) ?
                    (3 * appHeight) : ((this.allDayLevel + 1) * appHeight)) + 4;
                this.setAllDayRowHeight(allDayRowHeight);
                this.addOrRemoveClass();
                this.wireAppointmentEvents(appointmentElement, true);
            }
        }
    }

    private renderNormalEvents(eventObj: { [key: string]: Object }, dayIndex: number, resource: number, dayCount: number): void {
        let record: { [key: string]: Object } = this.isSpannedEvent(eventObj, dayIndex, resource);
        let eStart: Date = record[this.fields.startTime] as Date;
        let eEnd: Date = record[this.fields.endTime] as Date;
        let appWidth: string = '0%'; let appLeft: string = '0%'; let topValue: number = 0;
        let currentDate: Date = util.resetTime(new Date(this.dateRender[resource][dayIndex].getTime()));
        let schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let isHourRange: boolean = eEnd.getTime() > schedule.startHour.getTime() && eStart.getTime() < schedule.endHour.getTime();
        let isSameRange: boolean = schedule.startHour.getTime() <= eStart.getTime() &&
            (<Date>eventObj[this.fields.startTime]).getTime() >= schedule.startHour.getTime() &&
            (<Date>eventObj[this.fields.endTime]).getTime() < schedule.endHour.getTime() && eStart.getTime() === eEnd.getTime();
        if (eStart <= eEnd && (isHourRange || isSameRange)) {
            let appHeight: number = (eEnd.getTime() - eStart.getTime()) / (60 * 1000) * (this.cellHeight * this.slotCount) / this.interval;
            appHeight = (appHeight < this.cellHeight) ? this.cellHeight : appHeight;
            if (eStart.getTime() > schedule.startHour.getTime()) {
                topValue = this.getTopValue(eStart, dayIndex, resource);
            }
            let appIndex: number = this.getOverlapIndex(record, dayIndex, false, resource);
            record.Index = appIndex;
            this.overlapList.push(record);
            if (this.overlapList.length > 1) {
                if (isNullOrUndefined(this.overlapEvents[appIndex])) {
                    this.overlapEvents[appIndex] = [];
                }
                this.overlapEvents[appIndex].push(record);
            } else {
                this.overlapEvents = [];
                this.overlapEvents.push([record]);
            }
            let width: number = this.parent.currentView === 'Day' ? 97 : 94;
            appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
            let argsData: ElementData = {
                index: appIndex, left: appLeft, width: appWidth,
                day: dayIndex, dayIndex: dayCount, record: record, resource: resource
            };
            let tempData: { [key: string]: Object } = this.adjustOverlapElements(argsData);
            appWidth = (tempData.appWidth) as string;
            if (isNullOrUndefined(this.renderedEvents[resource])) {
                this.renderedEvents[resource] = [];
            }
            this.renderedEvents[resource].push(extend({}, record, null, true));
            let appointmentWrap: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS));
            let appointmentElement: HTMLElement = this.createAppointmentElement(eventObj, false, record.isSpanned, resource);
            setStyleAttribute(appointmentElement, { 'width': tempData.appWidth, 'height': appHeight + 'px', 'top': topValue + 'px' });
            let iconHeight: number = appointmentElement.querySelectorAll('.' + cls.EVENT_INDICATOR_CLASS).length * 15;
            let maxHeight: number = appHeight - 40 - iconHeight;
            let subjectElement: HTMLElement = appointmentElement.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (!this.parent.isAdaptive && subjectElement) {
                subjectElement.style.maxHeight = formatUnit(maxHeight);
            }
            if (this.parent.enableRtl) {
                setStyleAttribute(appointmentElement, { 'right': tempData.appLeft });
            } else {
                setStyleAttribute(appointmentElement, { 'left': tempData.appLeft });
            }
            let index: number = this.parent.activeViewOptions.group.byDate ? (this.resources.length * dayIndex) + resource : dayCount;
            let args: EventRenderedArgs = { data: eventObj, element: appointmentElement, cancel: false };
            this.parent.trigger(events.eventRendered, args);
            if (args.cancel) {
                return;
            }
            appointmentWrap[index].appendChild(appointmentElement);
            this.wireAppointmentEvents(appointmentElement, false);
        }
    }

    private getTopValue(date: Date, day: number, resource: number): number {
        let startEndHours: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(this.dateRender[resource][day]), this.startHour, this.endHour);
        let startHour: Date = startEndHours.startHour;
        let diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (diffInMinutes * this.cellHeight * this.slotCount) / this.interval;
    }

    private getOverlapIndex(record: { [key: string]: Object }, day: number, isAllDay: boolean, resource: number): number {
        let fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let predicate: Predicate; let eventsList: Object[] = []; let appIndex: number = -1; this.overlapEvents = [];
        if (isAllDay) {
            if (!isNullOrUndefined(this.renderedAllDayEvents[resource])) {
                let date: Date = util.resetTime(new Date(this.dateRender[resource][day].getTime()));
                eventsList = this.renderedAllDayEvents[resource].filter((app: { [key: string]: Object }) =>
                    util.resetTime(<Date>app[fieldMapping.startTime]).getTime() <= date.getTime() &&
                    util.resetTime(<Date>app[fieldMapping.endTime]).getTime() >= date.getTime());
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    eventsList = this.filterEventsByResource(this.resources[resource], eventsList);
                }
            }
        } else {
            let appointmentList: Object[] = !isNullOrUndefined(this.renderedEvents[resource]) ? this.renderedEvents[resource] : [];
            let appointment: Object[] = [];
            predicate = new Predicate(fieldMapping.endTime, 'greaterthan', <Date>record[fieldMapping.startTime]).
                and(new Predicate(fieldMapping.startTime, 'lessthan', <Date>record[fieldMapping.endTime]));
            this.overlapList = new DataManager({ json: appointmentList }).executeLocal(new Query().where(predicate));
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                this.overlapList = this.filterEventsByResource(this.resources[resource], this.overlapList);
            }
            this.overlapList.forEach((obj: { [key: string]: Object }) => {
                predicate = new Predicate(fieldMapping.endTime, 'greaterthanorequal', <Date>obj[fieldMapping.startTime]).
                    and(new Predicate(fieldMapping.startTime, 'lessthanorequal', <Date>obj[fieldMapping.endTime]));
                let filterList: Object[] = new DataManager({ json: appointmentList }).executeLocal(new Query().where(predicate));
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    filterList = this.filterEventsByResource(this.resources[resource], filterList);
                }
                let collection: Object[] = this.overlapList.filter((val: Object) => filterList.indexOf(val) === -1);
                return appointment.concat(collection);
            });
            this.overlapList = this.overlapList.concat(appointment);
            eventsList = this.overlapList;
            for (let event of eventsList) {
                let record: { [key: string]: Object } = event as { [key: string]: Object };
                let index: number = <number>record.Index;
                (isNullOrUndefined(this.overlapEvents[index])) ? this.overlapEvents[index] = [event] :
                    this.overlapEvents[index].push(event);
            }
        }
        if (eventsList.length > 0) {
            let appLevel: Object[] = eventsList.map((obj: { [key: string]: Object }) => obj.Index);
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    private adjustOverlapElements(args: ElementData): { [key: string]: Object } {
        let data: { [key: string]: Object } = { appWidth: args.width, appLeft: args.left };
        for (let i: number = 0, length1: number = this.overlapEvents.length; i < length1; i++) {
            if (!isNullOrUndefined(this.overlapEvents[i])) {
                for (let j: number = 0, length2: number = this.overlapEvents[i].length; j < length2; j++) {
                    let dayCount: number = this.parent.activeViewOptions.group.byDate ? (this.resources.length * args.day) + args.resource :
                        args.dayIndex;
                    let element: HTMLElement = this.element.querySelector('#e-appointment-wrapper-' + dayCount) as HTMLElement;
                    if (element.childElementCount > 0) {
                        let eleGuid: string = (<{ [key: string]: Object }>this.overlapEvents[i][j]).Guid as string;
                        if (element.querySelectorAll('div[data-guid="' + eleGuid + '"]').length > 0 && eleGuid !== args.record.Guid) {
                            let apps: HTMLElement = element.querySelector('div[data-guid="' + eleGuid + '"]') as HTMLElement;
                            if (parseFloat(args.width) <= parseFloat(apps.style.width)) {
                                (this.parent.enableRtl) ? apps.style.right = ((parseFloat(args.width) + 1) * i) + '%' :
                                    apps.style.left = ((parseFloat(args.width) + 1) * i) + '%';
                                apps.style.width = ((parseFloat(args.width))) + '%';
                                data.appWidth = apps.style.width;
                            }
                        } else {
                            let appWidth: string = args.width;
                            if (isNullOrUndefined(this.overlapEvents[i - 1])) {
                                let width: number = this.parent.currentView === 'Day' ? 97 : 94;
                                appWidth = ((width - this.overlapEvents.length) / this.overlapEvents.length) + '%';
                            }
                            data.appWidth = appWidth;
                            data.appLeft = ((parseInt(appWidth, 0) + 1) * args.index) + '%';
                        }
                    }
                }
            }
        }
        return data;
    }

    private setAllDayRowHeight(height: number): void {
        for (let element of this.allDayElement) {
            (<HTMLElement>element).style.height = (height / 12) + 'em';
        }
        this.animation.animate(this.allDayElement[0] as HTMLElement);
    }

    private addOrRemoveClass(): void {
        this.moreEvents.filter((element: HTMLElement) => {
            if (!this.parent.uiStateValues.expand && this.allDayLevel > 2) {
                addClass([element], cls.EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '-1');
            } else {
                removeClass([element], cls.EVENT_COUNT_CLASS);
                element.setAttribute('tabindex', '0');
            }
        });
        let moreEventCount: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        if (this.parent.uiStateValues.expand) {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
        } else {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
        }
        (this.allDayLevel > 2) ? removeClass([moreEventCount], cls.DISABLE_CLASS) : addClass([moreEventCount], cls.DISABLE_CLASS);
        let countCell: Element[] = [].slice.call(this.element.querySelectorAll('.' + cls.ROW_COUNT_WRAPPER_CLASS));
        countCell.filter((element: Element) => {
            (!this.parent.uiStateValues.expand && this.allDayLevel > 2) ? removeClass([element], cls.DISABLE_CLASS) :
                addClass([element], cls.DISABLE_CLASS);
        });
    }

    private getEventHeight(): number {
        let eventElement: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CLASS, styles: 'visibility:hidden' });
        let eventWrapper: Element = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS + ':first-child');
        eventWrapper.appendChild(eventElement);
        let height: number = eventElement.offsetHeight;
        eventElement.remove();
        return height;
    }

    private rowExpandCollapse(): void {
        let target: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        this.parent.uiStateValues.expand = target.classList.contains(cls.APPOINTMENT_ROW_EXPAND_CLASS);
        let rowHeight: number;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', 'Collapse-all-day-section');
            target.setAttribute('aria-label', 'Collapse section');
            rowHeight = ((this.allDayLevel + 1) * this.getEventHeight()) + 4;
        } else {
            target.setAttribute('title', 'Expand-all-day-section');
            target.setAttribute('aria-label', 'Expand section');
            rowHeight = (3 * this.getEventHeight()) + 4;
        }
        this.setAllDayRowHeight(rowHeight);
        this.addOrRemoveClass();
        this.animation.animate(target);
    }

    private animationUiUpdate(): void {
        this.parent.notify(events.contentReady, {});
    }
}
