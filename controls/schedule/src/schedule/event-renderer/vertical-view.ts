/* eslint-disable @typescript-eslint/no-explicit-any */
import { append, createElement, extend, EventHandler, Animation, formatUnit, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined, setStyleAttribute, remove, removeClass, addClass } from '@syncfusion/ej2-base';
import { EventSpacingValues, SpacingFrame, EventFieldsMapping, ElementData, EventRenderedArgs, TdData, EventClickArgs, BufferTemplateArgs, CloneFrame } from '../base/interface';
import { Schedule } from '../base/schedule';
import { View } from '../base/type';
import { EventBase } from './event-base';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
import { VerticalEventSpacing } from './vertical-event-spacing';

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
    private moreIndicatorsMap: Array<{ key: string; info: Record<string, any> }> = [];
    private spacing: VerticalEventSpacing | null = null;
    private allDayLevels: Array<{ element: HTMLElement; index: number }> = [];
    private allDayFrameKey: string = '';
    private allDayCellTop: number = 0;
    private allDayLevelHeight: number = 0;

    constructor(parent: Schedule) {
        super(parent);
        this.element = this.parent.activeView.getPanel();
        this.spacing = this.createSpacing();
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
        this.allDayLevels = [];
        this.allDayFrameKey = '';
        if (this.spacing) {
            this.spacing.resetAllDay();
        }
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

    /**
     * Returns `true` when the Event Buffer feature is active for the current vertical view
     * (Day/Week/WorkWeek with `timeScale.enable` true and `eventSettings.enableBuffer` true).
     * Single gate for every buffer-related branch inside `VerticalEvent` — mirrors the
     * `useBuffer` computation in the timeline renderer so both renderers activate the
     * feature under identical conditions.
     *
     * @returns {boolean} True when buffer rendering applies for this render pass.
     * @private
     */
    private isBufferPath(): boolean {
        return !!(this.parent.eventSettings.enableBuffer &&
            (this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View)));
    }

    /**
     * Computes the pixel heights of the leading (before) and trailing (after)
     * buffer regions for a vertically rendered spanned event.
     * 1. Boundary gating:
     *    - If isTop is true, no before buffer is rendered.
     *    - If isBottom is true, no after buffer is rendered.
     * 2. Schedule window clamp:
     *    - Buffers are rendered only when they fall within the renderable
     *    schedule window.
     *
     * @param {Record<string, any>} record Event record that contains buffer fields.
     * @param {Date} pieceStart Clamped start time of the current rendered piece.
     * @param {Date} pieceEnd Clamped end time of the current rendered piece.
     * @param {{startHour: Date, endHour: Date}} schedule Renderable schedule window.
     * @returns {{beforeHeight: number, afterHeight: number}} Buffer region heights in pixels.
     * @private
     */
    private getBufferHeights(record: Record<string, any>, pieceStart: Date, pieceEnd: Date,
                             schedule: { [key: string]: Date }) : { beforeHeight: number; afterHeight: number } {
        const result: { beforeHeight: number; afterHeight: number } = { beforeHeight: 0, afterHeight: 0 };
        if (!this.isBufferPath()) {
            return result;
        }
        const fields: EventFieldsMapping = this.parent.eventFields;
        const data: Record<string, any> = (record && record.data) ? record.data as Record<string, any> : record;
        const bufferBefore: number = util.getValidBufferMinutes(data[fields.bufferBefore]);
        const bufferAfter: number = util.getValidBufferMinutes(data[fields.bufferAfter]);
        const pxPerMin: number = (this.cellHeight * this.slotCount) / this.interval;
        if (bufferBefore > 0 && pxPerMin > 0) {
            const bufferStartTime: Date = new Date(pieceStart.getTime() - bufferBefore * util.MS_PER_MINUTE);
            if (bufferStartTime >= schedule.startHour && bufferStartTime < schedule.endHour) {
                result.beforeHeight = bufferBefore * pxPerMin;
            }
        }
        if (bufferAfter > 0 && pxPerMin > 0) {
            const bufferEndTime: Date = new Date(pieceEnd.getTime() + bufferAfter * util.MS_PER_MINUTE);
            if (bufferEndTime <= schedule.endHour && bufferEndTime > schedule.startHour) {
                result.afterHeight = bufferAfter * pxPerMin;
            }
        }
        return result;
    }

    private appendEvent(eventObj: Record<string, any>, appointmentElement: HTMLElement, index: number, appLeft: string): void {
        const appointmentWrap: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS + '[id="' + cls.APPOINTMENT_WRAPPER_CLASS + '-' + index + '"]');
        if (!isNullOrUndefined(appLeft)) {
            if (this.parent.enableRtl) {
                setStyleAttribute(appointmentElement, { 'right': appLeft });
            } else {
                setStyleAttribute(appointmentElement, { 'left': appLeft });
            }
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
            const appLeft: string = eventObj.IsBlock ? '1px' : '0px';
            this.appendEvent(eventObj, appointmentElement, index, appLeft);
        }
    }

    private filterEventsByOverlapGroups(eventList: Record<string, any>[], maxEventStack: number, groupIndex: number, dayIndex: number,
                                        dayCount: number, resource: number): Record<string, any>[] {
        if (maxEventStack === 0 || eventList.length === 0) {
            return eventList;
        }
        for (let i: number = 0; i < eventList.length; i++) {
            const item: Record<string, any> = eventList[parseInt(i.toString(), 10)];
            if (!item.__id) {
                item.__id = i;
            }
        }
        const overlapGroupList: Record<string, any>[][] = [];
        for (const currentEvent of eventList) {
            const seedGroup: Record<string, any>[] = [currentEvent];
            const overlapGroup: Record<string, any>[] = [];
            for (const comparedEvent of eventList) {
                const isOverlapping: boolean = seedGroup.some((e: Record<string, any>) =>
                    !(comparedEvent.StartTime >= e.EndTime || comparedEvent.EndTime <= e.StartTime));
                if (isOverlapping) {
                    overlapGroup.push(comparedEvent);
                }
            }
            overlapGroupList.push(overlapGroup);
        }
        const finalEventList: Record<string, any>[] = [];
        const currentVisibleEventBuffer: Record<string, any>[] = [];
        const visibleEventIdSet: Set<number> = new Set();
        const hiddenEventIdSet: Set<number> = new Set();
        const indicatorsForThisSlot: Array<{ key: string; info: Record<string, any> }> = [];
        for (const overlapGroup of overlapGroupList) {
            const orderedGroupEvents: Record<string, any>[] = overlapGroup
                .slice()
                .sort((a: Record<string, any>, b: Record<string, any>) => {
                    const startDiff: number = a.StartTime.getTime() - b.StartTime.getTime();
                    return startDiff !== 0 ? startDiff : (a.__id - b.__id);
                });
            for (const candidateEvent of orderedGroupEvents) {
                const overlappingVisibleEvents: Record<string, any>[] = currentVisibleEventBuffer.filter(
                    (e: Record<string, any>) => !(candidateEvent.StartTime >= e.EndTime || candidateEvent.EndTime <= e.StartTime)
                );
                const eventId: number = candidateEvent.__id;
                if (!visibleEventIdSet.has(eventId) && !hiddenEventIdSet.has(eventId) && overlappingVisibleEvents.length < maxEventStack) {
                    finalEventList.push(candidateEvent);
                    currentVisibleEventBuffer.push(candidateEvent);
                    visibleEventIdSet.add(eventId);
                }
            }
            const hiddenEventsInGroup: Record<string, any>[] = overlapGroup
                .filter((e: Record<string, any>) => !visibleEventIdSet.has(e.__id) && !hiddenEventIdSet.has(e.__id));
            if (hiddenEventsInGroup.length > 0) {
                const indicatorStartTime: Date = new Date(Math.min(...hiddenEventsInGroup.map((e: Record<string, any>) =>
                    e.StartTime.getTime())));
                const indicatorEndTime: Date = new Date(Math.max(...hiddenEventsInGroup.map((e: Record<string, any>) =>
                    e.EndTime.getTime())));
                const indicatorKey: string = `${indicatorStartTime.getTime()}_${indicatorEndTime.getTime()}_${groupIndex}_${dayCount}_${resource}`;
                const indicatorInfo: Record<string, any> = {
                    hiddenEvents: hiddenEventsInGroup,
                    hiddenEventCount: hiddenEventsInGroup.length,
                    startTime: indicatorStartTime,
                    endTime: indicatorEndTime,
                    groupIndex: groupIndex,
                    dayIndex: dayIndex,
                    dayCount: dayCount,
                    resource: resource
                };
                indicatorsForThisSlot.push({ key: indicatorKey, info: indicatorInfo });
                for (const hiddenEvent of hiddenEventsInGroup) {
                    hiddenEventIdSet.add(hiddenEvent.__id);
                }
            }
        }
        for (const event of eventList) {
            if (!visibleEventIdSet.has(event.__id) && !hiddenEventIdSet.has(event.__id)) {
                finalEventList.push(event);
                visibleEventIdSet.add(event.__id);
            }
        }
        for (const indicator of indicatorsForThisSlot) {
            this.moreIndicatorsMap.push({ key: indicator.key, info: indicator.info });
        }
        for (const event of finalEventList) {
            delete event.__id;
        }
        return finalEventList;
    }

    private renderMoreIndicator(indicatorInfo: Record<string, any>, dayIndex: number, resource: number, dayCount: number): void {
        const hiddenCount: number = indicatorInfo.hiddenEventCount || 0;
        if (hiddenCount === 0) {
            return;
        }
        const index: number = this.getDayIndex(dayIndex, resource, dayCount);
        const indicatorKey: string = `${indicatorInfo.startTime.getTime()}_${indicatorInfo.endTime.getTime()}_${indicatorInfo.groupIndex}_${indicatorInfo.dayCount}_${indicatorInfo.resource}`;
        const appointmentWrapper: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS + '[id="' + cls.APPOINTMENT_WRAPPER_CLASS + '-' + index + '"]');
        if (appointmentWrapper) {
            const existingIndicator: HTMLElement = appointmentWrapper.querySelector(`[data-indicator-key="${indicatorKey}"]`);
            if (existingIndicator) {
                EventHandler.remove(existingIndicator, 'click', this.onMoreIndicatorClick);
                remove(existingIndicator);
            }
        }
        const indicatorElement: HTMLElement = createElement('div', {
            className: cls.MAX_EVENT_STACK_INDICATOR_CLASS + ' ' + cls.MORE_INDICATOR_CLASS,
            attrs: {
                'tabindex': '0',
                'role': 'button',
                'aria-label': `${hiddenCount} ${this.parent.localeObj.getConstant('moreEvents')}`,
                'data-indicator-key': indicatorKey,
                'data-hidden-count': hiddenCount.toString()
            }
        });
        const startDate: Date = indicatorInfo.startTime;
        const endDate: Date = indicatorInfo.endTime;
        const top: number = this.getTopValue(startDate);
        const height: number = this.getHeight(startDate, endDate);
        setStyleAttribute(indicatorElement, {
            'top': top + 'px',
            'height': height + 'px'
        });
        const badgeOffset: string = this.spacing ? this.spacing.getBadgeOffset() : '0%';
        if (this.parent.enableRtl) {
            indicatorElement.style.left = badgeOffset;
        }
        else {
            indicatorElement.style.right = badgeOffset;
        }
        indicatorElement.innerHTML = `+${hiddenCount}`;
        EventHandler.add(indicatorElement, 'click', this.onMoreIndicatorClick, this);
        appointmentWrapper.appendChild(indicatorElement);
    }

    private onMoreIndicatorClick(e: Event): void {
        const target: HTMLElement = e.target as HTMLElement;
        const indicatorKey: string = target.getAttribute('data-indicator-key');
        if (indicatorKey) {
            const indicator: { key: string; info: Record<string, any> }
                = this.moreIndicatorsMap.find((item: { key: string; info: Record<string, any> }) => item.key === indicatorKey);
            if (indicator) {
                const indicatorInfo: Record<string, any> = indicator.info;
                const hiddenEvents: Record<string, any>[] = indicatorInfo.hiddenEvents;
                this.showMorePopup(hiddenEvents, indicatorInfo.startTime, indicatorInfo.endTime, e);
            }
        }
    }

    private showMorePopup(hiddenEvents: Record<string, any>[], startDate: Date, endDate: Date, e: Event): void {
        if (this.parent.quickPopup) {
            const target: Element = closest((e.target as Element), '.' + cls.MORE_INDICATOR_CLASS);
            const groupIndex: string = target.getAttribute('data-group-index');
            const moreArgs: EventClickArgs = { date: startDate, event: hiddenEvents, element: e.target } as EventClickArgs;
            this.parent.quickPopup.moreEventClick(moreArgs, endDate, groupIndex);
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
                    const maxEventStack: number = this.parent.activeViewOptions.maxEventStack || 0;
                    if (eventType !== 'allDayEvents' && this.isBufferPath()) {
                        this.sortEventsByReservedStart(filterEvents);
                    }
                    if (maxEventStack > 0 && !this.parent.eventSettings.enableMaxHeight) {
                        const normalEvents: Record<string, any>[] = [];
                        const allDayEventsInDay: Record<string, any>[] = [];
                        for (const event of filterEvents) {
                            if (this.isAllDayAppointment(event)) {
                                allDayEventsInDay.push(event);
                            } else {
                                normalEvents.push(event);
                            }
                        }
                        let finalEventList: Record<string, any>[] = [];
                        const currentDayIndicators: Array<{ key: string; info: Record<string, any> }> = [];
                        if (normalEvents.length > 0) {
                            finalEventList =
                                this.filterEventsByOverlapGroups(normalEvents, maxEventStack,
                                                                 parseInt(resource.toString(), 10), day,
                                                                 dateCount, parseInt(resource.toString(), 10));
                            for (const indicator of this.moreIndicatorsMap) {
                                const indicatorInfo: Record<string, any> = indicator.info;
                                if (indicatorInfo.dayIndex === day && indicatorInfo.dayCount === dateCount &&
                                    indicatorInfo.resource === parseInt(resource.toString(), 10)) {
                                    currentDayIndicators.push(indicator);
                                }
                            }
                        } else {
                            finalEventList = normalEvents;
                        }
                        for (const event of allDayEventsInDay) {
                            if (this.parent.resourceBase) {
                                this.setValues(event, resource);
                            }
                            if (eventType === 'allDayEvents') {
                                this.renderAllDayEvents(event, day, resource, dateCount, false, allDayRowTop, appHeight);
                            } else {
                                this.allDayEvents.push(extend({}, event, null, true) as Record<string, any>);
                            }
                            this.cssClass = null;
                            this.groupOrder = null;
                        }
                        for (const event of finalEventList) {
                            if (this.parent.resourceBase) {
                                this.setValues(event, resource);
                            }
                            if (eventType === 'allDayEvents') {
                                if (!this.isAllDayAppointment(event)) {
                                    continue;
                                }
                            } else {
                                if (this.parent.eventSettings.enableMaxHeight) {
                                    if (this.getOverlapIndex(event, day, false, resource) > 0) {
                                        continue;
                                    }
                                }
                                this.renderNormalEvents(event, day, resource, dateCount);
                                const appointmentWrapper: HTMLElement = this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS + '[id="' + cls.APPOINTMENT_WRAPPER_CLASS + '-' + dateCount + '"]');
                                if (appointmentWrapper) {
                                    const existingIndicators: HTMLElement[] = [].slice.call(appointmentWrapper.querySelectorAll('.' + cls.MORE_INDICATOR_CLASS));
                                    for (const existingIndicator of existingIndicators) {
                                        const indicatorKey: string = existingIndicator.getAttribute('data-indicator-key');
                                        const foundIndicator: { key: string; info: Record<string, any> } =
                                            currentDayIndicators
                                                .find((item: { key: string; info: Record<string, any> }) => item.key === indicatorKey);
                                        if (!foundIndicator) {
                                            EventHandler.remove(existingIndicator, 'click', this.onMoreIndicatorClick);
                                            remove(existingIndicator);
                                        }
                                    }
                                }
                            }
                            this.cssClass = null;
                            this.groupOrder = null;
                        }
                        for (const indicator of currentDayIndicators) {
                            const indicatorInfo: Record<string, any> = indicator.info;
                            this.renderMoreIndicator(indicatorInfo, day, resource, dateCount);
                        }
                    }
                    else
                    {
                        this.cleanupMoreIndicators();
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
                    }
                } else {
                    for (const event of filterEvents) {
                        if (this.isAllDayAppointment(event)) {
                            this.allDayEvents.push(extend({}, event, null, true) as Record<string, any>);
                        }
                    }
                }
                if (this.spacing && eventType !== 'allDayEvents') {
                    this.spacing.finishColumn(this.getDayIndex(day, resource, dateCount));
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
            const indicatorBottom: string | null = this.spacing ? this.spacing.getAllDayIndicatorBottom(this.allDayLevelHeight) : null;
            if (indicatorBottom !== null) {
                (moreIndicatorElement as HTMLElement).style.bottom = indicatorBottom;
            }
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
        const eventDates: Record<string, Date> = this.updateEventMinimumDuration(schedule, event[field.startTime], event[field.endTime]);
        event[field.startTime] = eventDates.startDate;
        event[field.endTime] = eventDates.endDate;
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
                        if (this.spacing) {
                            this.allDayCellTop = cellTop;
                            this.allDayLevelHeight = eventHeight;
                            this.allDayLevels.push({ element: appointmentElement, index: allDayIndex });
                        }
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
                        this.setAllDayRowHeight(allDayRowHeight, this.spacing ? this.layoutAllDayLevels() : 0);
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
            const tempData: Record<string, any> = this.spacing ? { appWidth: null, appLeft: null } : this.adjustOverlapElements(argsData);
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
            const isBufferRender: boolean = !inline && this.isBufferPath();
            let beforeHeight: number = 0;
            let afterHeight: number = 0;
            if (isBufferRender) {
                const bufferHeights: { beforeHeight: number; afterHeight: number } =
                    this.getBufferHeights(eventObj, eStart, eEnd, schedule);
                beforeHeight = bufferHeights.beforeHeight;
                afterHeight = bufferHeights.afterHeight;
            }
            setStyleAttribute(appointmentElement, {
                'width': (this.isSingleColumn() ? '100%' : tempData.appWidth),
                'height': (appHeight + beforeHeight + afterHeight) + 'px', 'top': (topValue - beforeHeight) + 'px'
            });
            if (this.spacing) {
                const wrapperIndex: number = this.getDayIndex(dayIndex, resource, dayCount);
                this.spacing.layoutGroup(record, appointmentElement, appIndex, wrapperIndex, this.overlapEvents);
                if (inline) {
                    this.spacing.finishColumn(wrapperIndex);
                }
            }
            if (isBufferRender && (beforeHeight || afterHeight)) {
                this.renderEventBuffers(appointmentElement, eventObj, resource, beforeHeight, afterHeight);
                this.offsetEventContent(appointmentElement, beforeHeight, afterHeight, appHeight);
                this.offsetResizeHandlers(appointmentElement, beforeHeight, afterHeight);
            }
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
            if (isBufferRender && (beforeHeight || afterHeight)) {
                this.refreshBufferColors(appointmentElement);
            }
            this.wireAppointmentEvents(appointmentElement, eventObj);
        }
    }

    /**
     * Renders the before/after buffer regions as direct children of the parent appointment
     * element for the vertical views (Day/Week/WorkWeek). Mirrors the timeline renderer's
     * `renderEventBuffers` but anchors on the VERTICAL time axis: the `before` (leading)
     * buffer is pinned to the TOP edge (`top:0`) because earlier times are visually ABOVE,
     * and the `after` (trailing) buffer is pinned to the BOTTOM edge (`bottom:0`) because
     * later times are visually BELOW. RTL only mirrors the horizontal placement of the
     * buffers (the appointment is width-shared in %), so each buffer keeps
     * `left:0; right:0` to span the full appointment width — no horizontal edge swap is
     * needed (unlike the timeline renderer where the reading direction determines which
     * visual edge the leading buffer occupies).
     * Each buffer div carries `e-event-buffer` + the `e-event-buffer-before` /
     * `e-event-buffer-after` modifier class, a localized `aria-label` (via the shared
     * `getBufferAriaLabel` L10n composition) and a `data-buffer-duration` attribute —
     * identical DOM contract to the timeline buffers.
     *
     * @param {HTMLElement} appointmentElement The parent appointment DOM element.
     * @param {Record<string, any>} eventData The source event record (used by bufferTemplate).
     * @param {number} resource The resource index used for resourceData lookup.
     * @param {number} beforeHeight Pixel height of the leading (before) buffer region.
     * @param {number} afterHeight Pixel height of the trailing (after) buffer region.
     * @returns {void}
     * @private
     */
    private renderEventBuffers(appointmentElement: HTMLElement, eventData: Record<string, any>, resource: number,
                               beforeHeight: number, afterHeight: number): void {
        if (!this.isBufferPath()) {
            return;
        }
        const bufferColor: string = this.getBufferColor(appointmentElement);
        const bufferTextColor: string = this.getBufferTextColor(appointmentElement);
        const fields: EventFieldsMapping = this.parent.eventFields;
        const data: Record<string, any> = (eventData && eventData.data) ? eventData.data as Record<string, any> : eventData;
        const bufferBefore: number = util.getValidBufferMinutes(data[fields.bufferBefore]);
        const bufferAfter: number = util.getValidBufferMinutes(data[fields.bufferAfter]);
        if (beforeHeight && bufferBefore) {
            const before: HTMLElement = createElement('div', {
                className: cls.EVENT_BUFFER_CLASS + ' ' + cls.EVENT_BUFFER_BEFORE_CLASS,
                attrs: {
                    'data-buffer-duration': bufferBefore.toString(),
                    'aria-label': this.getBufferAriaLabel('before', bufferBefore)
                }
            });
            setStyleAttribute(before, {
                'position': 'absolute', 'top': '0', 'left': '0', 'right': '0', 'height': beforeHeight + 'px',
                'background-color': bufferColor, 'color': bufferTextColor, 'opacity': '0.7',
                'z-index': '0', 'pointer-events': 'none'
            });
            this.renderBufferTemplate(before, eventData, resource, 'before');
            appointmentElement.appendChild(before);
        }
        if (afterHeight && bufferAfter) {
            const after: HTMLElement = createElement('div', {
                className: cls.EVENT_BUFFER_CLASS + ' ' + cls.EVENT_BUFFER_AFTER_CLASS,
                attrs: {
                    'data-buffer-duration': bufferAfter.toString(),
                    'aria-label': this.getBufferAriaLabel('after', bufferAfter)
                }
            });
            setStyleAttribute(after, {
                'position': 'absolute', 'bottom': '0', 'left': '0', 'right': '0', 'height': afterHeight + 'px',
                'background-color': bufferColor, 'color': bufferTextColor, 'opacity': '0.7',
                'z-index': '0', 'pointer-events': 'none'
            });
            this.renderBufferTemplate(after, eventData, resource, 'after');
            appointmentElement.appendChild(after);
        }
    }

    /**
     * Shifts the parent event's content (`.e-appointment-details`) down by the leading
     * buffer height so the subject/time content stays inside the parent-event zone rather
     * than being overlapped by the before-buffer rendered at the appointment's top edge.
     * Mirrors the timeline renderer's `appointmentDetails` width/left offset.
     *
     * @param {HTMLElement} appointmentElement The parent appointment DOM element.
     * @param {number} beforeHeight Pixel height of the leading buffer region.
     * @param {number} afterHeight Pixel height of the trailing buffer region.
     * @param {number} appHeight Pixel height of the parent-event zone.
     * @returns {void}
     * @private
     */
    private offsetEventContent(appointmentElement: HTMLElement, beforeHeight: number, afterHeight: number, appHeight: number): void {
        const appointmentDetails: HTMLElement = appointmentElement.querySelector('.' + cls.APPOINTMENT_DETAILS) as HTMLElement;
        if (appointmentDetails && (beforeHeight || afterHeight)) {
            setStyleAttribute(appointmentDetails, {
                'top': beforeHeight + 'px', 'height': appHeight + 'px', 'position': 'absolute', 'left': '0', 'right': '0', 'overflow': 'hidden', 'z-index': '1'
            });
        }
    }

    /**
     * Shifts the parent event's top/bottom resize handlers inward by the corresponding
     * buffer height so the resize handles visually sit at the parent event's edges rather
     * than at the outer buffer edges (vertical counterpart of the timeline renderer's
     * `offsetResizeHandlers`). The handlers were originally pinned to the top/bottom of
     * the (tallened) appointment element by {@link EventBase.renderResizeHandler}; an
     * inline `transform` slides them inward without altering their DOM anchor or breaking
     * the resize module's `closest('.e-event-resize')` lookup. When buffers are absent
     * the transform resolves to a no-op, so existing flows behave exactly as before.
     * RTL does not affect vertical handle offsets (the time axis is vertical in both
     * directions).
     *
     * @param {HTMLElement} appointmentElement The parent appointment DOM element.
     * @param {number} beforeHeight Pixel height of the leading buffer region.
     * @param {number} afterHeight Pixel height of the trailing buffer region.
     * @returns {void}
     * @private
     */
    private offsetResizeHandlers(appointmentElement: HTMLElement, beforeHeight: number, afterHeight: number): void {
        if (!this.parent.resizeModule || !this.parent.allowResizing) {
            return;
        }
        const topHandler: HTMLElement = appointmentElement.querySelector(
            '.' + cls.EVENT_RESIZE_CLASS + '.' + cls.TOP_RESIZE_HANDLER) as HTMLElement;
        const bottomHandler: HTMLElement = appointmentElement.querySelector(
            '.' + cls.EVENT_RESIZE_CLASS + '.' + cls.BOTTOM_RESIZE_HANDLER) as HTMLElement;
        if (topHandler) {
            setStyleAttribute(topHandler, {
                'transform': 'translateY(' + beforeHeight + 'px)',
                'z-index': '10'
            });
        }
        if (bottomHandler) {
            setStyleAttribute(bottomHandler, {
                'transform': 'translateY(-' + afterHeight + 'px)',
                'z-index': '10'
            });
        }
    }

    /**
     * Renders the user-configured `bufferTemplate` content into the given buffer region
     * element (vertical-view counterpart of the timeline renderer's template path). When
     * no template is configured on `eventSettings.bufferTemplate`, this is a no-op and
     * the default lighter-shade background already applied through inline styles remains
     * visible. Uses `this.parent.getBufferTemplate()` with the same template id and
     * `BufferTemplateArgs` payload as the timeline renderer so template authors get an
     * identical contract across all six buffer views.
     *
     * @param {HTMLElement} bufferElement The buffer region element to render into.
     * @param {Record<string, any>} eventData The source event record passed as template `data`.
     * @param {number} resource The resource index used for resourceData lookup.
     * @param {'before' | 'after'} bufferType The buffer region kind.
     * @returns {void}
     * @private
     */
    private renderBufferTemplate(bufferElement: HTMLElement, eventData: Record<string, any>, resource: number,
                                 bufferType: 'before' | 'after'): void {
        if (isNullOrUndefined(this.parent.eventSettings.bufferTemplate)) {
            return;
        }
        const template: Function = this.parent.getBufferTemplate();
        if (!template) {
            return;
        }
        let resourceData: Record<string, any>;
        if (this.parent.resourceBase && this.parent.resourceBase.renderedResources) {
            const res: TdData = this.parent.resourceBase.renderedResources[parseInt(resource.toString(), 10)];
            resourceData = res ? res.resourceData : undefined;
        } else {
            resourceData = undefined;
        }
        const templateArgs: BufferTemplateArgs = {
            data: eventData,
            resourceData: resourceData,
            bufferType: bufferType
        };
        const templateId: string = this.parent.element.id + '_bufferTemplate';
        const templateElements: HTMLElement[] = [].slice.call(
            template(templateArgs, this.parent, 'bufferTemplate', templateId, false, undefined, undefined, this.parent.root));
        if (templateElements && templateElements.length > 0) {
            append(templateElements, bufferElement);
        }
        this.parent.renderTemplates();
    }

    /**
     * Creates the spacing helper for this render. It runs from the constructor after `element` is set.
     *
     * @returns {VerticalEventSpacing | null} The helper, or null when no spacing field is set for the active view.
     */
    private createSpacing(): VerticalEventSpacing | null {
        const values: EventSpacingValues | null = util.spacingIfSet(this.parent.getEventSpacing());
        return values ? new VerticalEventSpacing(this.parent, this.element, values, this.isSingleColumn()) : null;
    }

    /**
     * Tells whether every event takes the whole column: enableMaxHeight, or allowOverlap turned off.
     *
     * @returns {boolean} True when events do not share a column.
     */
    private isSingleColumn(): boolean {
        return this.parent.eventSettings.enableMaxHeight || !this.parent.activeViewOptions.allowOverlap;
    }

    /**
     * The single-column frame of the active view, used to size the drag clone so the preview matches the column an event
     * would be dropped into. It is null without event spacing.
     *
     * @returns {CloneFrame | null} The inline offset and width of one full-width column, or null.
     */
    public getCloneFrame(): CloneFrame | null {
        return this.spacing ? this.spacing.getCloneFrame() : null;
    }

    private getEventWidth(): string {
        const width: number =
                (isNullOrUndefined(this.parent.activeViewOptions.maxEventStack) || this.parent.activeViewOptions.maxEventStack === 0)
                    ? (this.parent.currentView === 'Day' ? 97 : 94)
                    : (this.parent.isAdaptive ? (this.parent.currentView === 'Day' ? 75 : 50)
                        : (this.parent.currentView === 'Day' ? 75 : 70));
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
        if (!isAllDay && this.isBufferPath()) {
            return this.getBufferedOverlapIndex(record, resource);
        }
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
                let filterList: Record<string, any>[] = [];
                const processedIds: Set<any> = new Set();
                queue.push(obj);
                processedIds.add(obj[fieldMapping.id]);
                filterList.push(obj);
                while (queue.length > 0) {
                    const currentObj: Record<string, any> = queue.shift() as Record<string, any>;
                    const currentObjEndTime: number = currentObj[fieldMapping.endTime].getTime();
                    const currentObjStartTime: number = currentObj[fieldMapping.startTime].getTime();
                    for (const data of appointmentList) {
                        const dataStartTime: number = data[fieldMapping.startTime].getTime();
                        const dataEndTime: number = data[fieldMapping.endTime].getTime();
                        if (dataStartTime >= currentObjEndTime) {
                            break;
                        }
                        if (!processedIds.has(data[fieldMapping.id])) {
                            if (dataEndTime > currentObjStartTime && dataStartTime < currentObjEndTime) {
                                filterList.push(data);
                                processedIds.add(data[fieldMapping.id]);
                                queue.push(data);
                            }
                        }
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

    /**
     * Buffer-aware stacking-index computation for the Event Buffer feature in the vertical
     * views (Day/Week/WorkWeek). Mirrors the timeline renderer's `getBufferedOverlapIndex`
     * pipeline (`renderedEvents[resource]` → bidirectional overlap list →
     * `getSmallestMissingNumber`) but compares each already-rendered event's buffered
     * reserved range against the new record's buffered reserved range using the full
     * range-overlap test (`existingStart < newEnd && existingEnd > newStart`) — instead of
     * the "contains the new start" tests used by the base `getOverlapIndex`, which miss
     * the case where the new event's reserved start is EARLIER than an existing event's
     * reserved start while the two reserved ranges still overlap.
     * Also populates `this.overlapEvents` / `this.overlapList` the same way the base
     * method does, so the downstream width-sharing math (`adjustOverlapElements`) keeps
     * working unchanged for buffered events.
     * Only invoked when {@link isBufferPath} is true — the non-buffer path keeps the
     * existing `getOverlapIndex` flow, which remains correct for non-buffered stacking.
     *
     * @param {Record<string, any>} record The new event record (rendered wrapper) being stacked.
     * @param {number} resource The resource index whose rendered events to compare against.
     * @returns {number} The stacking level index (0-based) for the new event.
     * @private
     */
    private getBufferedOverlapIndex(record: Record<string, any>, resource: number): number {
        const appointmentList: Record<string, any>[] = !isNullOrUndefined(this.renderedEvents[parseInt(resource.toString(), 10)]) ?
            this.renderedEvents[parseInt(resource.toString(), 10)] : [];
        const newRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(record);
        const newStart: number = newRange.start.getTime();
        const newEnd: number = newRange.end.getTime();
        const overlapped: Record<string, any>[] = [];
        this.overlapEvents = [];
        for (const app of appointmentList) {
            const appRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(app);
            if (appRange.start.getTime() < newEnd && appRange.end.getTime() > newStart) {
                overlapped.push(app);
            }
        }
        const eventsList: Record<string, any>[] = [];
        this.overlapList = overlapped;
        for (const event of overlapped) {
            const index: number = <number>event.Index;
            if (isNullOrUndefined(this.overlapEvents[parseInt(index.toString(), 10)])) {
                this.overlapEvents[parseInt(index.toString(), 10)] = [event];
            } else {
                this.overlapEvents[parseInt(index.toString(), 10)].push(event);
            }
            eventsList.push(event);
        }
        if (eventsList.length > 0) {
            const appLevel: number[] = eventsList.map((obj: Record<string, any>): number => obj.Index) as number[];
            const appIndex: number = this.getSmallestMissingNumber(appLevel);
            return (appIndex === -1) ? 0 : appIndex;
        }
        return 0;
    }

    /**
     * Buffer-aware sort applied to a day's filtered (timed) events just before the
     * per-event render loop, so events are rendered in reserved-start order: an event
     * whose reserved start (`StartTime − bufferBefore`) precedes another's renders first
     * and claims the top stacking level, even when its raw StartTime is later — matching
     * the user's mental model that the "earlier-reserved" event appears on top. Mirrors
     * the timeline renderer's `sortSpannedEvents` override, implemented inline here
     * because `VerticalEvent` extends `EventBase` (not `MonthEvent`) so the base hook is
     * not inherited. Tie-break ordering matches `EventBase.sortByDateTime`:
     *   1. Smaller buffered reserved-start first.
     *   2. Falling back to smaller raw StartTime.
     *   3. Falling back to smaller duration.
     * No-op when the buffer path is inactive — non-buffered render order is untouched.
     *
     * @param {Record<string, any>[]} filterEvents The day's filtered timed events to re-sort in place.
     * @returns {void}
     * @private
     */
    private sortEventsByReservedStart(filterEvents: Record<string, any>[]): void {
        if (!this.isBufferPath() || !filterEvents || filterEvents.length < 2) {
            return;
        }
        const fields: EventFieldsMapping = this.parent.eventFields;
        filterEvents.sort((a: Record<string, any>, b: Record<string, any>): number => {
            const aRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(a);
            const bRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(b);
            const reservedDelta: number = aRange.start.getTime() - bRange.start.getTime();
            if (reservedDelta !== 0) {
                return reservedDelta;
            }
            const startDelta: number = new Date(a[fields.startTime] as Date).getTime() -
                new Date(b[fields.startTime] as Date).getTime();
            if (startDelta !== 0) {
                return startDelta;
            }
            return (new Date(a[fields.endTime] as Date).getTime() - new Date(a[fields.startTime] as Date).getTime()) -
                (new Date(b[fields.endTime] as Date).getTime() - new Date(b[fields.startTime] as Date).getTime());
        });
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

    /**
     * Places the levels of the all-day row with event spacing for the levels the row shows now (three while collapsed, all while expanded).
     * The frame is reduced when the row would grow taller than a third of the schedule, so the levels already placed move when the
     * frame changes with the level count; otherwise only the level that was just added is placed.
     *
     * @returns {number} The pixels that the spacing adds to the legacy row height.
     */
    private layoutAllDayLevels(): number {
        const levels: number = (!this.parent.uiStateValues.expand && this.allDayLevel > 2) ? 3 : this.allDayLevel + 1;
        const frame: SpacingFrame = this.spacing.getAllDayFrame(levels, this.allDayLevelHeight);
        const key: string = frame.gap + '|' + frame.lead;
        const targets: Array<{ element: HTMLElement; index: number }> =
            key === this.allDayFrameKey ? this.allDayLevels.slice(-1) : this.allDayLevels;
        this.allDayFrameKey = key;
        for (const level of targets) {
            level.element.style.top = formatUnit(this.spacing.getAllDayTop(this.allDayCellTop, level.index, this.allDayLevelHeight, frame));
        }
        return this.spacing.getAllDayExtra(frame, levels);
    }

    private setAllDayRowHeight(height: number, extra: number = 0): void {
        const dateHeader: HTMLElement = (this.parent.element.querySelector('.' + cls.DATE_HEADER_WRAP_CLASS) as HTMLElement);
        if (this.parent.height === 'auto' || !this.parent.enableAllDayScroll) {
            addClass([dateHeader], cls.ALLDAY_APPOINTMENT_AUTO);
        }
        const allDayRow: HTMLElement = (this.parent.element.querySelector('.' + cls.ALLDAY_ROW_CLASS) as HTMLElement);
        allDayRow.style.height = '';
        const rowSize: string = extra !== 0 ? 'calc(' + (height / 12) + 'em + ' + extra + 'px)' : (height / 12) + 'em';
        if (this.parent.uiStateValues.expand && this.parent.height !== 'auto' && this.parent.enableAllDayScroll) {
            allDayRow.style.height = rowSize;
            this.parent.eventBase.allDayExpandScroll(dateHeader);
        } else {
            for (const element of this.allDayElement) {
                (<HTMLElement>element).style.height = rowSize;
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
        let extra: number = 0;
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
        extra = this.spacing && this.allDayLevels.length > 0 ? this.layoutAllDayLevels() : 0;
        this.setAllDayRowHeight(rowHeight, extra);
        this.animation.animate(this.allDayElement[0] as HTMLElement);
        this.addOrRemoveClass();
        this.animation.animate(target);
    }

    private animationUiUpdate(): void {
        this.parent.notify(events.contentReady, {});
    }

    private cleanupMoreIndicators(): void {
        if (this.element) {
            const moreIndicators: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.MAX_EVENT_STACK_INDICATOR_CLASS));
            for (const indicator of moreIndicators) {
                EventHandler.remove(indicator, 'click', this.onMoreIndicatorClick);
                remove(indicator);
            }
        }
        this.moreIndicatorsMap = null;
    }

    public destroy(): void {
        if (!this.parent || this.parent && this.parent.isDestroyed) { return; }
        this.cleanupMoreIndicators();
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
        this.moreIndicatorsMap = null;
        this.spacing = null;
        this.allDayLevels = null;
        super.destroy();
    }
}
