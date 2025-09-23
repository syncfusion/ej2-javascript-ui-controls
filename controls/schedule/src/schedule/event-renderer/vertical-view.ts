/* eslint-disable @typescript-eslint/no-explicit-any */
import { append, createElement, extend, EventHandler, Animation, formatUnit, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove, removeClass, addClass } from '@syncfusion/ej2-base';
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
    public dateRender: Date[][] = [];
    private renderedEvents: Record<string, any>[][] = [];
    private renderedAllDayEvents: Record<string, any>[][] = [];
    private overlapEvents: Record<string, any>[][] = [];
    private moreEvents: HTMLElement[] = [];
    private overlapList: Record<string, any>[] = [];
    private allDayEvents: Record<string, any>[] = [];
    private slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    public allDayLevel: number = 0;
    private startHour: Date = this.getStartEndHours(this.parent.activeViewOptions.startHour);
    private endHour: Date = this.getStartEndHours(this.parent.activeViewOptions.endHour);
    private element: HTMLElement;
    public allDayElement: HTMLElement[];
    private animation: Animation;
    public fields: EventFieldsMapping;
    public cellHeight: number;
    public resources: TdData[];
    private isResourceEventTemplate: boolean;

    constructor(parent: Schedule) {
        super(parent);
        this.element = this.parent.activeView.getPanel();
        this.fields = this.parent.eventFields;
        this.animation = new Animation({ progress: this.animationUiUpdate.bind(this) });
        this.addEventListener();
    }

    public renderAppointments(): void {
        if (isNullOrUndefined(this.parent)) { return; }

        if (this.parent.dragAndDropModule) {
            this.parent.dragAndDropModule.setDragArea();
        }

        this.isResourceEventTemplate = this.parent.isSpecificResourceEvents();
        const wrapperElements: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS +
            ',.' + cls.APPOINTMENT_CLASS + ',.' + cls.ROW_COUNT_WRAPPER_CLASS));
        const isDragging: boolean = (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) ? true : false;
        const hideWrapper: (wrapper: HTMLElement) => void = (wrapper: HTMLElement): void => {
            if ((this.parent as any).isReact && !isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                const appWrapper: Element = closest(wrapper, '.' + cls.DAY_WRAPPER_CLASS + ',.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS);
                if (appWrapper && !appWrapper.classList.contains(cls.APPOINTMENT_WRAPPER_HIDDEN_CLASS)) {
                    addClass([appWrapper], cls.APPOINTMENT_WRAPPER_HIDDEN_CLASS);
                }
            }
        };
        for (const wrapper of wrapperElements) {
            if (isDragging && !(wrapper.classList.contains(cls.ALLDAY_APPOINTMENT_CLASS) ||
                wrapper.classList.contains(cls.ROW_COUNT_WRAPPER_CLASS))) {
                const groupIndex: number = parseInt(wrapper.getAttribute('data-group-index'), 10);
                for (let j: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; j < len; j++) {
                    if (groupIndex === this.parent.crudModule.crudObj.sourceEvent[parseInt(j.toString(), 10)].groupIndex ||
                        groupIndex === this.parent.crudModule.crudObj.targetEvent[parseInt(j.toString(), 10)].groupIndex) {
                        hideWrapper(wrapper);
                        remove(wrapper);
                    }
                }
            } else {
                hideWrapper(wrapper);
                remove(wrapper);
            }
        }
        if (!this.element.querySelector('.' + cls.WORK_CELLS_CLASS)) {
            return;
        }
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.updateFocusedWorkCell();
        }
        this.allDayElement = [].slice.call(this.element.querySelectorAll('.' + cls.ALLDAY_CELLS_CLASS));
        this.setAllDayRowHeight(0);
        if (this.parent.eventsProcessed.length === 0 && this.parent.blockProcessed.length === 0) {
            return;
        }
        const expandCollapse: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        EventHandler.remove(expandCollapse, 'click', this.rowExpandCollapse);
        EventHandler.add(expandCollapse, 'click', this.rowExpandCollapse, this);
        this.renderedEvents = [];
        this.renderedAllDayEvents = [];
        this.initializeValues();
        this.processBlockEvents();
        this.renderEvents('normalEvents');
        if (this.allDayEvents.length > 0) {
            this.allDayEvents = this.allDayEvents.filter((item: Record<string, any>, index: number, arr: Record<string, any>[]) =>
                index === arr.map((item: Record<string, any>) => item.Guid).indexOf(item.Guid));
            removeClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
            this.slots.push(this.parent.activeView.renderDates.map((date: Date) => +date) as any);
            this.renderEvents('allDayEvents');
            this.animation.animate(this.allDayElement[0] as HTMLElement);
        }
        this.parent.notify(events.contentReady, {});
        addClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
        if (isDragging) {
            this.parent.crudModule.crudObj.isCrudAction = false;
        }
        this.parent.renderTemplates(() => {
            if (this.parent && (this.parent as any).isReact && this.parent.activeViewOptions.eventTemplate) {
                const wraps: Element[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_HIDDEN_CLASS));
                removeClass(wraps, cls.APPOINTMENT_WRAPPER_HIDDEN_CLASS);
            }
        });
    }

    public initializeValues(): void {
        this.resources = (this.parent.activeViewOptions.group.resources.length > 0) ? this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.lastResourceLevel : [];
        if (this.resources.length > 0 && this.parent.activeViewOptions.allowVirtualScrolling && this.parent.virtualScrollModule) {
            this.resources = this.parent.resourceBase.renderedResources;
        }
        this.cellHeight =
            parseFloat(this.parent.getElementHeight(this.parent.element.querySelector('.e-content-wrap tbody tr')).toFixed(2));
        this.dateRender[0] = this.parent.activeView.renderDates;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (let i: number = 0, len: number = this.resources.length; i < len; i++) {
                this.dateRender[parseInt(i.toString(), 10)] = this.resources[parseInt(i.toString(), 10)].renderDates;
            }
        }
    }

    public getHeight(start: Date, end: Date): number {
        let appHeight: number = (util.getUniversalTime(end) - util.getUniversalTime(start)) /
            util.MS_PER_MINUTE * (this.cellHeight * this.slotCount) / this.interval;
        appHeight = (appHeight <= 0) ? this.cellHeight : appHeight;
        return appHeight;
    }

    private appendEvent(eventObj: Record<string, any>, appointmentElement: HTMLElement, index: number, appLeft: string): void {
        const appointmentWrap: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS + '[id="' + cls.APPOINTMENT_WRAPPER_CLASS + '-' + index + '"]');
        if (this.parent.enableRtl) {
            setStyleAttribute(appointmentElement, { 'right': appLeft });
        } else {
            setStyleAttribute(appointmentElement, { 'left': appLeft });
        }
        const eventType: string = appointmentElement.classList.contains(cls.BLOCK_APPOINTMENT_CLASS) ? 'blockEvent' : 'event';
        const args: EventRenderedArgs = {
            data: extend({}, eventObj, null, true) as Record<string, any>,
            element: appointmentElement, cancel: false, type: eventType
        };
        this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
            if (!eventArgs.cancel) {
                appointmentWrap.appendChild(appointmentElement);
            }
        });
    }

    private processBlockEvents(): void {
        const resources: number[] = this.getResourceList();
        let dateCount: number = this.getStartCount();
        for (const resource of resources) {
            const renderDates: Date[] = this.dateRender[parseInt(resource.toString(), 10)];
            for (let day: number = 0, length: number = renderDates.length; day < length; day++) {
                const startDate: Date = new Date(renderDates[parseInt(day.toString(), 10)].getTime());
                const endDate: Date = util.resetTime(util.addDays(renderDates[parseInt(day.toString(), 10)], 1));
                const filterEvents: Record<string, any>[] =
                    this.filterEvents(startDate, endDate, this.parent.blockProcessed, this.resources[parseInt(resource.toString(), 10)]);
                for (const event of filterEvents) {
                    if (this.parent.resourceBase) {
                        this.setValues(event, resource);
                    }
                    this.renderBlockEvents(event, day, resource, dateCount);
                    this.cssClass = null;
                    this.groupOrder = null;
                }
                dateCount += 1;
            }
        }
    }

    private renderBlockEvents(eventObj: Record<string, any>, dayIndex: number, resource: number, dayCount: number): void {
        const spannedData: Record<string, any> = this.isSpannedEvent(eventObj, dayIndex, resource);
        const eStart: Date = spannedData[this.fields.startTime] as Date;
        const eEnd: Date = spannedData[this.fields.endTime] as Date;
        const currentDate: Date =
            util.resetTime(new Date(this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        if (eStart <= eEnd && this.isValidEvent(eventObj, eStart, eEnd, schedule) && this.isWorkDayAvailable(resource, eStart)) {
            let blockTop: string;
            let blockHeight: string;
            if (spannedData[this.fields.isAllDay]) {
                const contentWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table') as HTMLElement;
                blockHeight = formatUnit(contentWrap.offsetHeight);
                blockTop = formatUnit(0);
            } else {
                blockHeight = formatUnit(this.getHeight(eStart, eEnd));
                blockTop = formatUnit(this.getTopValue(eStart));
            }
            if (eventObj.IsBlock) {
                blockHeight = formatUnit(parseInt(blockHeight, 10) - 1);
            }
            const appointmentElement: HTMLElement = this.createBlockAppointmentElement(eventObj, resource, this.isResourceEventTemplate);
            const appWidth: string = eventObj.IsBlock ? '99%' : '100%';
            setStyleAttribute(appointmentElement, { 'width': appWidth, 'height': blockHeight, 'top': blockTop });
            const index: number = this.getDayIndex(dayIndex, resource, dayCount);
            const appLeft: string = eventObj.IsBlock ? '0.5px' : '0px';
            this.appendEvent(eventObj, appointmentElement, index, appLeft);
        }
    }

    private renderEvents(eventType: string): void {
        removeClass(this.allDayElement, cls.ALLDAY_ROW_ANIMATE_CLASS);
        const eventCollection: Record<string, any>[] = (eventType === 'allDayEvents') ? this.sortByDateTime(this.allDayEvents) : undefined;
        const resources: number[] = this.getResourceList();
        let dateCount: number = this.getStartCount();
        let isRender: boolean;
        const appHeight: number = eventType === 'allDayEvents' ? this.parent.getElementHeightFromClass(
            this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS), cls.APPOINTMENT_CLASS) : 0;
        const allDayRowTop: number = eventType === 'allDayEvents' && this.allDayElement.length > 0 ? this.allDayElement[0].offsetTop : 0;
        for (const resource of resources) {
            isRender = true;
            if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction && eventType !== 'allDayEvents'
                && !this.parent.uiStateValues.isGroupAdaptive) {
                if (this.parent.crudModule.crudObj.sourceEvent.filter((data: TdData) => data.groupIndex === resource).length === 0 &&
                    this.parent.crudModule.crudObj.targetEvent.filter((data: TdData) => data.groupIndex === resource).length === 0) {
                    isRender = false;
                }
            }
            this.slots = [];
            const renderDates: Date[] = this.dateRender[parseInt(resource.toString(), 10)];
            const renderedDate: Date[] = this.getRenderedDates(renderDates) || renderDates;
            this.slots.push(renderDates.map((date: Date) => { return +date; }) as any);
            for (let day: number = 0, length: number = renderDates.length; day < length &&
                renderDates[parseInt(day.toString(), 10)] <= renderedDate[renderedDate.length - 1]; day++) {
                this.renderedEvents = [];
                const startDate: Date = new Date(renderDates[parseInt(day.toString(), 10)].getTime());
                const endDate: Date = util.resetTime(util.addDays(renderDates[parseInt(day.toString(), 10)], 1));
                const filterEvents: Record<string, any>[] =
                    this.filterEvents(startDate, endDate, eventCollection, this.resources[parseInt(resource.toString(), 10)]);
                if (isRender) {
                    for (const event of filterEvents) {
                        if (this.parent.resourceBase) {
                            this.setValues(event, resource);
                        }
                        if (eventType === 'allDayEvents') {
                            this.renderAllDayEvents(event, day, resource, dateCount, false, allDayRowTop, appHeight);
                        } else {
                            if (this.isAllDayAppointment(event)) {
                                this.allDayEvents.push(extend({}, event, null, true) as Record<string, any>);
                            } else {
                                if (this.parent.eventSettings.enableMaxHeight) {
                                    if (this.getOverlapIndex(event, day, false, resource) > 0) {
                                        continue;
                                    }
                                }
                                this.renderNormalEvents(event, day, resource, dateCount);
                            }
                        }
                        this.cssClass = null;
                        this.groupOrder = null;
                    }
                } else {
                    for (const event of filterEvents) {
                        if (this.isAllDayAppointment(event)) {
                            this.allDayEvents.push(extend({}, event, null, true) as Record<string, any>);
                        }
                    }
                }
                dateCount += 1;
            }
        }
    }

    public getStartCount(): number {
        return this.parent.virtualScrollModule && this.parent.activeViewOptions.allowVirtualScrolling && this.parent.timeScale.enable ?
            parseInt(this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS).getAttribute('id').split('-').slice(-1)[0], 10) : 0;
    }

    private getDayIndex(dayIndex: number, resource: number, dayCount: number): number {
        if (!this.parent.activeViewOptions.group.byDate) {
            return dayCount;
        }
        if (this.parent.activeViewOptions.group.byDate && !this.parent.activeViewOptions.group.hideNonWorkingDays) {
            const renderedIndex: number =
                this.parent.resourceBase.lastResourceLevel[0].renderDates.indexOf(
                    this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)]);
            return (this.resources.length * renderedIndex) + resource;
        }
        let dateIndex: number = 0;
        const firstColumn: TdData[] = this.parent.activeView.colLevels[0];
        const currentDate: number = this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)].getTime();
        let currentResources: TdData[] = [];
        for (let i: number = 0; i < firstColumn.length; i++) {
            currentResources = this.parent.resourceBase.resourceDateTree[parseInt(i.toString(), 10)];
            if (currentDate === firstColumn[parseInt(i.toString(), 10)].date.getTime()) {
                break;
            }
            dateIndex = dateIndex + firstColumn[parseInt(i.toString(), 10)].colSpan;
        }
        const resIndex: number =
            currentResources.findIndex((x: TdData) => x.groupOrder.toString() ===
                this.resources[parseInt(resource.toString(), 10)].groupOrder.toString());
        if (resIndex < 0) {
            return dateIndex;
        }
        return dateIndex + resIndex;
    }

    private setValues(event: Record<string, any>, resourceIndex: number): void {
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.cssClass = this.resources[parseInt(resourceIndex.toString(), 10)].cssClass;
            this.groupOrder = this.resources[parseInt(resourceIndex.toString(), 10)].groupOrder;
        } else {
            this.cssClass = this.parent.resourceBase.getCssClass(event);
        }
    }

    private getResourceList(): number[] {
        // eslint-disable-next-line prefer-spread
        const resources: number[] = Array.apply(null, {
            length: (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) ?
                this.resources.length : 1
        }).map((value: number, index: number) => { return index; });
        return resources;
    }

    // eslint-disable-next-line max-len
    public createAppointmentElement(record: Record<string, any>, isAllDay: boolean, data: Record<string, any>, resource: number): HTMLElement {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        const recordSubject: string = (record[fieldMapping.subject] || this.parent.eventSettings.fields.subject.default
            || this.parent.localeObj.getConstant('addTitle')) as string;
        const appointmentWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[fieldMapping.id],
                'data-guid': record.Guid as string,
                'role': 'button',
                'tabindex': '0',
                'aria-disabled': this.parent.eventBase.getReadonlyAttribute(record),
                'aria-label': this.parent.getAnnouncementString(record)
            }
        });
        if (record[this.fields.isReadonly]) {
            addClass([appointmentWrapper], 'e-read-only');
        }
        const appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        appointmentWrapper.appendChild(appointmentDetails);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            const resourceIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : resource;
            appointmentWrapper.setAttribute('data-group-index', resourceIndex.toString());
        }
        let templateElement: HTMLElement[];
        const eventData: Record<string, any> = data;
        if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
            const elementId: string = this.parent.element.id + '_';
            const viewName: string = this.parent.activeViewOptions.eventTemplateName;
            const templateId: string = elementId + viewName + 'eventTemplate';
            const resIndex: number = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex : resource;
            const templateName: string = this.isResourceEventTemplate ? this.parent.getEventTemplateName(resIndex) : 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(record, this.parent, templateName, templateId, false,
                                                                   undefined, undefined, this.parent.root);
        } else {
            const appointmentSubject: HTMLElement = createElement('div', { className: cls.SUBJECT_CLASS });
            this.parent.sanitize(recordSubject, appointmentSubject);
            if (isAllDay) {
                if (record[fieldMapping.isAllDay]) {
                    templateElement = [appointmentSubject];
                } else {
                    templateElement = [];
                    const appointmentStartTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.startTime] as Date)
                    });
                    const appointmentEndTime: HTMLElement = createElement('div', {
                        className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                        innerHTML: this.parent.getTimeString(record[fieldMapping.endTime] as Date)
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
                const timeStr: string = this.parent.getTimeString(record[fieldMapping.startTime] as Date) + ' - ' +
                    this.parent.getTimeString(record[fieldMapping.endTime] as Date);
                const appointmentTime: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                    innerHTML: timeStr
                });
                const appointmentLocation: HTMLElement = createElement('div', { className: cls.LOCATION_CLASS });
                this.parent.sanitize((record[fieldMapping.location] || this.parent.eventSettings.fields.location.default || '') as string,
                                     appointmentLocation);
                templateElement = [appointmentSubject, appointmentTime, appointmentLocation];
            }
        }
        append(templateElement, appointmentDetails);
        if (!this.parent.isAdaptive &&
            (!isNullOrUndefined(record[fieldMapping.recurrenceRule]) || !isNullOrUndefined(record[fieldMapping.recurrenceID]))) {
            const iconClass: string = (record[fieldMapping.id] === record[fieldMapping.recurrenceID]) ?
                cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
            const recurrenceIcon: HTMLElement = createElement('div', { className: cls.ICON + ' ' + iconClass });
            if (isAllDay) {
                appointmentDetails.appendChild(recurrenceIcon);
            } else {
                appointmentWrapper.appendChild(recurrenceIcon);
            }
        }
        this.parent.eventBase.renderSpannedIcon(isAllDay ? appointmentDetails : appointmentWrapper, eventData);
        if (!isNullOrUndefined(this.cssClass)) {
            addClass([appointmentWrapper], this.cssClass);
        }
        this.applyResourceColor(appointmentWrapper, record, 'backgroundColor', this.groupOrder);
        this.renderResizeHandler(appointmentWrapper, eventData, record[this.fields.isReadonly] as boolean);
        return appointmentWrapper;
    }

    private createMoreIndicator(allDayRow: HTMLElement[], count: number, currentDay: number): void {
        const index: number = currentDay + count;
        const countWrapper: HTMLElement = allDayRow[parseInt(index.toString(), 10)] as HTMLElement;
        if (countWrapper.childElementCount <= 0) {
            const innerCountWrap: Element = createElement('div', {
                className: cls.ROW_COUNT_WRAPPER_CLASS,
                id: cls.ROW_COUNT_WRAPPER_CLASS + '-' + index.toString()
            });
            const moreIndicatorElement: Element = createElement('div', {
                className: cls.MORE_INDICATOR_CLASS,
                attrs: { 'tabindex': '0', 'data-index': index.toString(), 'data-count': '1' },
                innerHTML: '+1&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'))
            });
            innerCountWrap.appendChild(moreIndicatorElement);
            countWrapper.appendChild(innerCountWrap);
            EventHandler.add(moreIndicatorElement, 'click', this.rowExpandCollapse, this);
        } else {
            const countCell: HTMLElement = countWrapper.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
            const moreCount: number = parseInt(countCell.getAttribute('data-count'), 10) + 1;
            countCell.setAttribute('data-count', moreCount.toString());
            countCell.innerHTML = '+' + this.parent.globalize.formatNumber(moreCount) + '&nbsp;' + (this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('more'));
        }
    }

    public isSpannedEvent(record: Record<string, any>, day: number, resource: number): Record<string, any> {
        let currentDate: Date = util.resetTime(this.dateRender[parseInt(resource.toString(), 10)][parseInt(day.toString(), 10)]);
        const renderedDate: Date[] = this.getRenderedDates(this.dateRender[parseInt(resource.toString(), 10)]) || [currentDate];
        const currentDay: Date[] = renderedDate.filter((date: Date) => date.getDay() === day);
        if (currentDay.length === 0) {
            currentDate = util.resetTime(renderedDate[0]);
        }
        const field: EventFieldsMapping = this.parent.eventFields;
        const schedule: Record<string, Date> = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        const event: Record<string, any> = extend({}, record, null, true) as Record<string, any>;
        event.isSpanned = {
            isBottom: false, isTop: false,
            isSameDuration: event[field.startTime].getTime() === event[field.endTime].getTime()
        };
        if ((<Date>record[field.startTime]).getTime() < schedule.startHour.getTime()) {
            event[field.startTime] = schedule.startHour;
            (event.isSpanned as Record<string, any>).isTop = true;
        }
        if ((<Date>record[field.endTime]).getTime() > schedule.endHour.getTime()) {
            event[field.endTime] = schedule.endHour;
            (event.isSpanned as Record<string, any>).isBottom = true;
        }
        const eventDates: Record<string, Date> = this.updateEventMinimumDuration(schedule, event[field.startTime], event[field.endTime]);
        event[field.startTime] = eventDates.startDate;
        event[field.endTime] = eventDates.endDate;
        return event;
    }

    private isWorkDayAvailable(resource: number, start: Date): boolean {
        if (this.parent.activeViewOptions.group.hideNonWorkingDays && this.resources.length > 0) {
            const workDays: number[] =
                this.resources[parseInt(resource.toString(), 10)].
                    resourceData[this.resources[parseInt(resource.toString(), 10)].resource.workDaysField] ||
                this.parent.activeViewOptions.workDays;
            return workDays && workDays.indexOf(start.getDay()) >= 0;
        }
        return true;
    }

    // eslint-disable-next-line max-len
    public renderAllDayEvents(eventObj: Record<string, any>, dayIndex: number, resource: number, dayCount: number, inline: boolean, cellTop: number, eventHeight: number): void {
        let currentDates: Date[] = this.getRenderedDates(this.dateRender[parseInt(resource.toString(), 10)]) ||
            this.dateRender[parseInt(resource.toString(), 10)];
        if (this.parent.activeViewOptions.group.byDate) {
            (this.slots as any)[0] = [this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)].getTime()];
            currentDates = [this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)]];
        }
        const record: Record<string, any> = this.splitEvent(eventObj, currentDates)[0];
        const eStart: Date = new Date((record[this.parent.eventFields.startTime] as Date).getTime());
        const eEnd: Date = new Date((record[this.parent.eventFields.endTime] as Date).getTime());
        if (eStart.getTime() < this.parent.minDate.getTime() || eEnd.getTime() > this.parent.maxDate.getTime()) {
            return;
        }
        let appWidth: number = 0;
        let topValue: number = 1;
        const isDateRange: boolean = currentDates[0].getTime() <= eStart.getTime() &&
            util.addDays(currentDates.slice(-1)[0], 1).getTime() >= eStart.getTime();
        if (eStart <= eEnd && isDateRange && this.isWorkDayAvailable(resource, eStart)) {
            let isAlreadyRendered: Record<string, any>[] = [];
            if (this.renderedAllDayEvents[parseInt(resource.toString(), 10)]) {
                isAlreadyRendered = this.renderedAllDayEvents[parseInt(resource.toString(), 10)].filter((event: Record<string, any>) =>
                    event.Guid === eventObj.Guid);
                if (this.parent.activeViewOptions.group.byDate) {
                    isAlreadyRendered = isAlreadyRendered.filter((event: Record<string, any>) =>
                        event[this.parent.eventFields.startTime] >= currentDates[parseInt(dayIndex.toString(), 10)] &&
                        event[this.parent.eventFields.endTime] <=
                        util.addDays(new Date(+currentDates[parseInt(dayIndex.toString(), 10)]), 1)
                    );
                }
            }
            if (isAlreadyRendered.length === 0) {
                const allDayDifference: number = (record.data as Record<string, any>).count as number;
                const allDayIndex: number = this.getOverlapIndex(record, dayIndex, true, resource);
                record.Index = allDayIndex;
                this.allDayLevel = (this.allDayLevel < allDayIndex) ? allDayIndex : this.allDayLevel;
                const widthAdjustment: number = (<Record<string, any>>record.data).isRight ? 0 :
                    this.parent.currentView === 'Day' ? 4 : 7;
                if (allDayDifference >= 0) {
                    appWidth = (allDayDifference * 100) - (!this.parent.activeViewOptions.allowOverlap ? 0 : widthAdjustment);
                }
                if (isNullOrUndefined(this.renderedAllDayEvents[parseInt(resource.toString(), 10)])) {
                    this.renderedAllDayEvents[parseInt(resource.toString(), 10)] = [];
                }
                this.renderedAllDayEvents[parseInt(resource.toString(), 10)].push(extend({}, record, null, true) as Record<string, any>);
                const allDayRow: HTMLElement[] = [].slice.call(this.element.querySelector('.' + cls.ALLDAY_ROW_CLASS).children);
                const wIndex: number = this.getDayIndex(dayIndex, resource, dayCount);
                const eventWrapper: Element = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS +
                    ':nth-child(' + (wIndex + 1) + ')');
                let appointmentElement: HTMLElement;
                if (inline) {
                    appointmentElement = this.parent.inlineModule.createInlineAppointmentElement(eventObj);
                } else {
                    appointmentElement = this.createAppointmentElement(eventObj, true, record.data as Record<string, any>, resource);
                }
                addClass([appointmentElement], cls.ALLDAY_APPOINTMENT_CLASS);
                const eventData: Record<string, any> = extend({}, record.data, null, true);
                eventObj.data = eventData;
                const args: EventRenderedArgs = { data: eventObj, element: appointmentElement, cancel: false };
                this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
                    if (!eventArgs.cancel) {
                        eventWrapper.appendChild(appointmentElement);
                        topValue += (allDayIndex === 0 ? cellTop : (cellTop + (allDayIndex * eventHeight))) + 1;
                        setStyleAttribute(appointmentElement, { 'width': appWidth + '%', 'top': formatUnit(topValue) });
                        if (allDayIndex > 1) {
                            this.moreEvents.push(appointmentElement);
                            for (let count: number = 0, length: number = allDayDifference; count < length; count++) {
                                this.createMoreIndicator(allDayRow, count, wIndex);
                            }
                        }
                        this.allDayElement[0].setAttribute('data-count', this.allDayLevel.toString());
                        const allDayRowHeight: number = ((!this.parent.uiStateValues.expand && this.allDayLevel > 2) ?
                            (3 * eventHeight) : ((this.allDayLevel + 1) * eventHeight)) + 4;
                        this.setAllDayRowHeight(allDayRowHeight);
                        this.addOrRemoveClass();
                        this.wireAppointmentEvents(appointmentElement, eventObj);
                    }
                });
            }
        }
    }

    public renderNormalEvents(eventObj: Record<string, any>, dayIndex: number, resource: number, dayCount: number, inline?: boolean): void {
        const record: Record<string, any> = this.isSpannedEvent(eventObj, dayIndex, resource);
        const eStart: Date = record[this.fields.startTime] as Date;
        const eEnd: Date = record[this.fields.endTime] as Date;
        let appWidth: string = '0%'; const appLeft: string = '0%'; let topValue: number = 0;
        const currentDate: Date =
        util.resetTime(new Date(this.dateRender[parseInt(resource.toString(), 10)][parseInt(dayIndex.toString(), 10)].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        const isValidEvent: boolean = this.isValidEvent(eventObj, eStart, eEnd, schedule);
        if ((eStart.getTime() < this.parent.minDate.getTime()) || (eEnd.getTime() > (util.addDays(this.parent.maxDate, 1)).getTime())) {
            return;
        }
        if (eStart <= eEnd && isValidEvent && this.isWorkDayAvailable(resource, eStart)) {
            const appHeight: number = record.isSpanned.isSameDuration ? this.cellHeight : this.getHeight(eStart, eEnd);
            if (eStart.getTime() >= schedule.startHour.getTime()) {
                topValue = this.getTopValue(eStart);
            }
            const appIndex: number = this.getOverlapIndex(record, dayIndex, false, resource);
            record.Index = appIndex;
            this.overlapList.push(record);
            if (this.overlapList.length > 1) {
                if (isNullOrUndefined(this.overlapEvents[parseInt(appIndex.toString(), 10)])) {
                    this.overlapEvents[parseInt(appIndex.toString(), 10)] = [];
                }
                this.overlapEvents[parseInt(appIndex.toString(), 10)].push(record);
            } else {
                this.overlapEvents = [];
                this.overlapEvents.push([record]);
            }
            appWidth = this.getEventWidth();
            const argsData: ElementData = {
                index: appIndex, left: appLeft, width: appWidth,
                day: dayCount, dayIndex: dayIndex, record: record, resource: resource
            };
            const tempData: Record<string, any> = this.adjustOverlapElements(argsData);
            appWidth = (tempData.appWidth) as string;
            if (isNullOrUndefined(this.renderedEvents[parseInt(resource.toString(), 10)])) {
                this.renderedEvents[parseInt(resource.toString(), 10)] = [];
            }
            this.renderedEvents[parseInt(resource.toString(), 10)].push(extend({}, record, null, true) as Record<string, any>);
            let appointmentElement: HTMLElement;
            if (inline) {
                appointmentElement = this.parent.inlineModule.createInlineAppointmentElement(eventObj);
            } else {
                appointmentElement = this.createAppointmentElement(eventObj, false, record.isSpanned as Record<string, any>, resource);
            }
            setStyleAttribute(appointmentElement, {
                'width': (this.parent.eventSettings.enableMaxHeight || !this.parent.activeViewOptions.allowOverlap ? '100%' : tempData.appWidth),
                'height': appHeight + 'px', 'top': topValue + 'px'
            });
            const iconHeight: number = appointmentElement.querySelectorAll('.' + cls.EVENT_INDICATOR_CLASS).length * 15;
            const maxHeight: number = appHeight - 40 - iconHeight;
            const subjectElement: HTMLElement = appointmentElement.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (!this.parent.isAdaptive && subjectElement) {
                subjectElement.style.maxHeight = formatUnit(maxHeight);
            }
            const index: number = this.getDayIndex(dayIndex, resource, dayCount);
            const eventData: Record<string, any> = {};
            eventData[this.fields.startTime] = eventObj[this.fields.startTime];
            eventData[this.fields.endTime] = eventObj[this.fields.endTime];
            record.data = eventData;
            this.appendEvent(record, appointmentElement, index, tempData.appLeft as string);
            this.wireAppointmentEvents(appointmentElement, eventObj);
        }
    }

    private getEventWidth(): string {
        const width: number = this.parent.currentView === 'Day' ? 97 : 94;
        const tempWidth: number = ((width - this.overlapEvents.length) / this.overlapEvents.length);
        return (tempWidth < 0 ? 0 : tempWidth) + '%';
    }

    private getEventLeft(appWidth: string, index: number): string {
        const tempLeft: number = (parseFloat(appWidth) + 1) * index;
        return (tempLeft > 99 ? 99 : tempLeft) + '%';
    }

    private getStartEndHours(startEndTime: string): Date {
        if (!isNullOrUndefined(startEndTime) && startEndTime !== '') {
            const startEndDate: Date = new Date(2000, 0, 0, 0);
            const timeString: string[] = startEndTime.split(':');
            if (timeString.length === 2) {
                startEndDate.setHours(parseInt(timeString[0], 10), parseInt(timeString[1], 10), 0);
            }
            return startEndDate;
        }
        return null;
    }

    public getTopValue(date: Date): number {
        const startHour: Date = this.getStartEndHours(this.parent.activeViewOptions.startHour);
        const diffInMinutes: number = ((date.getHours() - startHour.getHours()) * 60) + (date.getMinutes() - startHour.getMinutes());
        return (this.parent.activeViewOptions.timeScale.enable) ? ((diffInMinutes * this.cellHeight * this.slotCount) / this.interval) : 0;
    }

    private getOverlapIndex(record: Record<string, any>, day: number, isAllDay: boolean, resource: number): number {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        let eventsList: Record<string, any>[] = []; let appIndex: number = -1; this.overlapEvents = [];
        if (isAllDay) {
            if (!isNullOrUndefined(this.renderedAllDayEvents[parseInt(resource.toString(), 10)])) {
                const date: Date =
                  util.resetTime(new Date(this.dateRender[parseInt(resource.toString(), 10)][parseInt(day.toString(), 10)].getTime()));
                eventsList = this.renderedAllDayEvents[parseInt(resource.toString(), 10)].filter((app: Record<string, any>) =>
                    util.resetTime(<Date>app[fieldMapping.startTime]).getTime() <= date.getTime() &&
                    util.resetTime(<Date>app[fieldMapping.endTime]).getTime() >= date.getTime());
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    eventsList = this.filterEventsByResource(this.resources[parseInt(resource.toString(), 10)], eventsList);
                }
            }
        } else {
            const appointmentList: Record<string, any>[] = !isNullOrUndefined(this.renderedEvents[parseInt(resource.toString(), 10)]) ?
                this.renderedEvents[parseInt(resource.toString(), 10)] : [];
            let appointment: Record<string, any>[] = [];
            const recordStart: Date = record[fieldMapping.startTime] as Date;
            const recordEnd: Date = record[fieldMapping.endTime] as Date;
            this.overlapList = appointmentList.filter((data: Record<string, any>) =>
                (data[fieldMapping.endTime] > recordStart && data[fieldMapping.startTime] <= recordEnd) ||
                (data[fieldMapping.startTime] >= recordEnd && data[fieldMapping.endTime] <= recordStart) ||
                (data[fieldMapping.endTime].getTime() === data[fieldMapping.startTime].getTime() &&
                    data[fieldMapping.startTime].getTime() === recordStart.getTime() && data[fieldMapping.endTime] < recordEnd));
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                this.overlapList = this.filterEventsByResource(this.resources[parseInt(resource.toString(), 10)], this.overlapList);
            }
            const queue: Record<string, any>[] = [];
            this.overlapList.forEach((obj: Record<string, any>) => {
                queue.push(obj);
                let filterList: Record<string, any>[] = [];
                const processedIds: Set<any> = new Set();
                while (queue.length > 0) {
                    const currentObj: Record<string, any> = queue.shift() as Record<string, any>;
                    const overlaps: Record<string, any>[] = appointmentList.filter((data: Record<string, any>) => {
                        return data[fieldMapping.endTime] > currentObj[fieldMapping.startTime] &&
                            data[fieldMapping.startTime] <= currentObj[fieldMapping.endTime] &&
                            !processedIds.has(data[fieldMapping.id]);
                    });
                    overlaps.forEach((overlap: Record<string, any>) => {
                        filterList.push(overlap);
                        processedIds.add(overlap[fieldMapping.id]);
                        queue.push(overlap);
                    });
                    if (processedIds.size < appointmentList.length - 1) {
                        break;
                    }
                }
                if (this.parent.activeViewOptions.group.resources.length > 0) {
                    filterList = this.filterEventsByResource(this.resources[parseInt(resource.toString(), 10)], filterList);
                }
                const collection: Record<string, any>[] = filterList.filter((val: Record<string, any>) =>
                    this.overlapList.indexOf(val) === -1);
                if (collection.length > 0) {
                    appointment = appointment.concat(collection);
                }
            });
            for (let i: number = 0; i < appointment.length - 1; i++) {
                for (let j: number = i + 1; j < appointment.length; j++) {
                    if (appointment[parseInt(i.toString(), 10)][fieldMapping.id] ===
                      appointment[parseInt(j.toString(), 10)][fieldMapping.id]) {
                        appointment.splice(j, 1); j--;
                    }
                }
            }
            this.overlapList = this.overlapList.concat(appointment);
            eventsList = this.overlapList;
            for (const event of eventsList) {
                const record: Record<string, any> = event;
                const index: number = <number>record.Index;
                if (isNullOrUndefined(this.overlapEvents[parseInt(index.toString(), 10)])) {
                    this.overlapEvents[parseInt(index.toString(), 10)] = [event];
                } else {
                    this.overlapEvents[parseInt(index.toString(), 10)].push(event);
                }
            }
        }
        if (!isAllDay) {
            eventsList = eventsList.filter((obj: Record<string, any>) => (obj[fieldMapping.startTime] === record[fieldMapping.startTime] &&
                obj[fieldMapping.endTime] > record[fieldMapping.endTime] || obj[fieldMapping.endTime] > record[fieldMapping.startTime] &&
                obj[fieldMapping.startTime] < record[fieldMapping.endTime] || obj[fieldMapping.endTime] === record[fieldMapping.startTime]
                && obj[fieldMapping.startTime] === record[fieldMapping.endTime]) ||
                ((obj[fieldMapping.startTime].getTime() === record[fieldMapping.startTime].getTime() &&
                    obj[fieldMapping.endTime].getTime() === record[fieldMapping.endTime].getTime())
                    || (obj[fieldMapping.startTime].getTime() === record[fieldMapping.startTime].getTime() &&
                        obj[fieldMapping.endTime].getTime() < record[fieldMapping.endTime].getTime() ||
                        obj[fieldMapping.endTime].getTime() > record[fieldMapping.endTime].getTime())));
        }
        if (eventsList.length > 0) {
            const appLevel: number[] = eventsList.map((obj: Record<string, any>) => obj.Index) as number[];
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    private adjustOverlapElements(args: ElementData): Record<string, any> {
        const data: Record<string, any> = { appWidth: args.width, appLeft: args.left };
        for (let i: number = 0, length1: number = this.overlapEvents.length; i < length1; i++) {
            if (!isNullOrUndefined(this.overlapEvents[parseInt(i.toString(), 10)])) {
                for (let j: number = 0, length2: number = this.overlapEvents[parseInt(i.toString(), 10)].length; j < length2; j++) {
                    const dayCount: number = this.getDayIndex(args.dayIndex, args.resource, args.day);
                    const element: HTMLElement = this.element.querySelector('#e-appointment-wrapper-' + dayCount) as HTMLElement;
                    if (element && element.childElementCount > 0) {
                        const eleGuid: string =
                        (<Record<string, any>>this.overlapEvents[parseInt(i.toString(), 10)][parseInt(j.toString(), 10)]).Guid as string;
                        if (element.querySelectorAll('div[data-guid="' + eleGuid + '"]').length > 0 && eleGuid !== args.record.Guid) {
                            const apps: HTMLElement = element.querySelector('div[data-guid="' + eleGuid + '"]') as HTMLElement;
                            if (parseFloat(args.width) <= parseFloat(apps.style.width)) {
                                if (this.parent.enableRtl) {
                                    apps.style.right = this.getEventLeft(args.width, i);
                                } else {
                                    apps.style.left = this.getEventLeft(args.width, i);
                                }
                                apps.style.width = ((parseFloat(args.width))) + '%';
                                data.appWidth = apps.style.width;
                            } else {
                                data.appWidth = apps.style.width;
                            }
                        } else {
                            let appWidth: string = args.width;
                            if (isNullOrUndefined(this.overlapEvents[i - 1])) {
                                appWidth = this.getEventWidth();
                            }
                            data.appWidth = appWidth;
                            data.appLeft = this.getEventLeft(appWidth, args.index);
                        }
                    }
                }
            }
        }
        return data;
    }

    private setAllDayRowHeight(height: number): void {
        const dateHeader: HTMLElement = (this.parent.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        if (this.parent.height === 'auto' || !this.parent.enableAllDayScroll) {
            addClass([dateHeader], cls.ALLDAY_APPOINTMENT_AUTO);
        }
        const allDayRow: HTMLElement = (this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement);
        allDayRow.style.height = '';
        if (this.parent.uiStateValues.expand && this.parent.height !== 'auto' && this.parent.enableAllDayScroll) {
            allDayRow.style.height = (height / 12) + 'em';
            this.parent.eventBase.allDayExpandScroll(dateHeader);
        } else {
            for (const element of this.allDayElement) {
                (<HTMLElement>element).style.height = (height / 12) + 'em';
            }
            removeClass([dateHeader], cls.ALLDAY_APPOINTMENT_SCROLL);
        }
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
        const moreEventCount: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        if (this.parent.uiStateValues.expand) {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
        } else {
            removeClass([moreEventCount], cls.APPOINTMENT_ROW_COLLAPSE_CLASS);
            addClass([moreEventCount], cls.APPOINTMENT_ROW_EXPAND_CLASS);
        }
        if (this.allDayLevel > 2) {
            removeClass([moreEventCount], cls.DISABLE_CLASS);
        } else {
            addClass([moreEventCount], cls.DISABLE_CLASS);
        }
        const countCell: Element[] = [].slice.call(this.element.querySelectorAll('.' + cls.ROW_COUNT_WRAPPER_CLASS));
        countCell.forEach((element: Element) => {
            if (!this.parent.uiStateValues.expand && this.allDayLevel > 2) {
                removeClass([element], cls.DISABLE_CLASS);
            } else {
                addClass([element], cls.DISABLE_CLASS);
            }
        });
    }

    private getEventHeight(): number {
        const eventElement: HTMLElement = createElement('div', { className: cls.APPOINTMENT_CLASS, styles: 'visibility:hidden' });
        const eventWrapper: Element = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_WRAPPER_CLASS + ':first-child');
        eventWrapper.appendChild(eventElement);
        const height: number = eventElement.offsetHeight;
        remove(eventElement);
        return height;
    }

    private rowExpandCollapse(): void {
        const target: HTMLElement = this.element.querySelector('.' + cls.ALLDAY_APPOINTMENT_SECTION_CLASS) as HTMLElement;
        this.parent.uiStateValues.expand = target.classList.contains(cls.APPOINTMENT_ROW_EXPAND_CLASS);
        let rowHeight: number;
        if (this.parent.uiStateValues.expand) {
            target.setAttribute('title', this.parent.localeObj.getConstant('collapseAllDaySection'));
            target.setAttribute('aria-label', this.parent.localeObj.getConstant('collapseAllDaySection'));
            rowHeight = ((this.allDayLevel + 1) * this.getEventHeight()) + 4;
        } else {
            target.setAttribute('title', this.parent.localeObj.getConstant('expandAllDaySection'));
            target.setAttribute('aria-label', this.parent.localeObj.getConstant('expandAllDaySection'));
            rowHeight = (3 * this.getEventHeight()) + 4;
            this.parent.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS).scrollTop = 0;
        }
        this.setAllDayRowHeight(rowHeight);
        this.animation.animate(this.allDayElement[0] as HTMLElement);
        this.addOrRemoveClass();
        this.animation.animate(target);
    }

    private animationUiUpdate(): void {
        this.parent.notify(events.contentReady, {});
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.removeEventListener();
        this.allDayElement = null;
        this.renderedAllDayEvents = null;
        this.renderedEvents = null;
        this.slotCount = null;
        this.interval = null;
        this.startHour = null;
        this.endHour = null;
        this.element = null;
        this.fields = null;
        this.animation = null;
        super.destroy();
    }

}
