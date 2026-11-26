/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, setStyleAttribute, extend, EventHandler, createElement, append } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
import { MonthEvent } from './month';
import { TdData, BufferTemplateArgs, EventFieldsMapping, RowFrame, StackLayout } from '../base/interface';
import { View } from '../base/type';

const EVENT_GAP: number = 2;
const BLOCK_INDICATOR_WIDTH: number = 22;
const BLOCK_INDICATOR_HEIGHT: number = 18;
/**
 * Timeline view events render
 */
export class TimelineEvent extends MonthEvent {
    private startHour: Date = this.parent.activeView.getStartHour();
    private endHour: Date = this.parent.activeView.getEndHour();
    public slotCount: number = this.parent.activeViewOptions.timeScale.slotCount;
    private interval: number = this.parent.activeViewOptions.timeScale.interval;
    private day: number = 0;
    public eventContainers: HTMLElement[];
    private dayLength: number;
    public slotsPerDay: number;
    private content: HTMLElement;
    private rowIndex: number = 0;
    public inlineValue: boolean;
    private cellTops: number[] = [];

    constructor(parent: Schedule, type: string) {
        super(parent);
        this.renderType = type;
        this.eventContainers = this.parent.fixedRowsModule ?
            this.parent.fixedRowsModule.getEventContainers(this.element, cls.APPOINTMENT_CONTAINER_CLASS) :
            [].slice.call(this.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS));
        const tr: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CONTENT_TABLE_CLASS + ' tbody tr'));
        // A group summary row is merged by cell unit, so its cell count is not the work cell count of a day.
        const workRow: HTMLElement = tr.filter((row: HTMLElement) => !row.classList.contains(cls.GROUP_SUMMARY_ROW_CLASS))[0] || tr[0];
        this.dayLength = tr.length === 0 ? 0 : workRow.children.length;
        this.content = this.parent.element.querySelector('.' + cls.SCHEDULE_TABLE_CLASS + '.' + cls.CONTENT_TABLE_CLASS);
    }

    /**
     * The level layout of a resource row. A row is one track whose level count is the largest number of events that cover any one cell of it,
     * which the pre-pass in countCellEvents has counted before the events are placed.
     *
     * @param {number} minLevels The least number of levels to lay out, for a render that has no pre-pass (the inline editor).
     * @returns {StackLayout} The level layout from getStackLayout.
     */
    protected getTrackStackLayout(minLevels: number = 0): StackLayout {
        const frame: RowFrame = this.getRowFrame();
        const levels: number = this.cellEventCounts.reduce((max: number, count: number) => Math.max(max, count || 0), minLevels);
        const fixed: number = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight &&
            !this.parent.eventSettings.enableIndicator ? this.parent.activeViewOptions.maxEventsPerRow : 0;
        return util.getStackLayout(this.cellHeight, levels, this.eventHeight, frame.gap, frame.lead, frame.trail, this.moreIndicatorHeight,
                                   !!this.parent.rowAutoHeight, frame.reserve, fixed);
    }

    public getSlotDates(): void {
        this.slots = [];
        this.slots.push(this.parent.activeView.renderDates.map((date: Date) => { return +date; }) as any);
        if (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour') {
            this.renderType = 'day';
            const workCell: HTMLTableCellElement = this.content.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLTableCellElement;
            this.cellWidth = this.parent.getElementWidth(workCell) / +(workCell.getAttribute('colspan') || 1);
            this.slotsPerDay = 1;
        } else {
            this.slotsPerDay = (this.dayLength / this.dateRender.length);
        }
    }

    public getOverlapEvents(date: Date, appointments: Record<string, any>[]): Record<string, any>[] {
        const appointmentsList: Record<string, any>[] = [];
        const useBuffer: boolean = this.parent.eventSettings.enableBuffer &&
            (this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View));
        if (this.renderType === 'day') {
            for (const app of appointments) {
                if ((util.resetTime(<Date>app[this.fields.startTime]).getTime() <= util.resetTime(new Date(date.getTime())).getTime()) &&
                    (util.resetTime(<Date>app[this.fields.endTime]).getTime() >= util.resetTime(new Date(date.getTime())).getTime())) {
                    appointmentsList.push(app);
                }
            }
        } else {
            for (const app of appointments) {
                const eventData: Record<string, any> = app.data as Record<string, any>;
                let trimStart: Date = <Date>eventData.trimStartTime;
                let trimEnd: Date = <Date>eventData.trimEndTime;
                if (useBuffer) {
                    const buffered: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(app);
                    if (buffered && buffered.start && buffered.end) {
                        trimStart = buffered.start;
                        trimEnd = buffered.end;
                    }
                }
                if (((trimStart).getTime() <= date.getTime() &&
                    (trimEnd).getTime() > date.getTime()) ||
                    ((trimStart).getTime() === date.getTime() &&
                        (trimEnd).getTime() === date.getTime())) {
                    appointmentsList.push(app);
                }
            }
        }
        return appointmentsList;
    }

    public getSortComparerIndex(startDate: Date, endDate: Date): number {
        let appIndex: number = -1;
        const appointments: Record<string, any>[] = <Record<string, any>[]>this.renderedEvents;
        if (appointments.length > 0) {
            const appointmentsList: Record<string, any>[] = this.getOverlapSortComparerEvents(startDate, endDate, appointments);
            const appLevel: number[] = appointmentsList.map((obj: Record<string, any>) => obj.Index) as number[];
            appIndex = (appLevel.length > 0) ? this.getSmallestMissingNumber(appLevel) : 0;
        }
        return (appIndex === -1) ? 0 : appIndex;
    }

    public getOverlapSortComparerEvents(startDate: Date, endDate: Date, appointmentsCollection: Record<string, any>[]): Record<string, any>[] {
        const appointments: Record<string, any>[] = [];
        for (const app of appointmentsCollection) {
            if (this.renderType === 'day') {
                const start: number = util.resetTime(startDate).getTime();
                const end: number = util.resetTime(endDate).getTime();
                const appStart: number = util.resetTime(<Date>app[this.fields.startTime]).getTime();
                const appEnd: number = util.resetTime(<Date>app[this.fields.endTime]).getTime();
                const isEndOverlap : () => boolean = () => {
                    let endTime: number = (end - (util.getDateInMs(endDate) <= 0 ? util.MS_PER_DAY : 0));
                    endTime = start > endTime ? start : endTime;
                    return appEnd >= endTime && appStart <= endTime;
                };
                if (appStart <= start && appEnd >= start || isEndOverlap() || appStart > start && appEnd < end) {
                    appointments.push(app);
                }
            } else {
                const eventData: Record<string, any> = app.data as Record<string, any>;
                if (((eventData.trimStartTime.getTime() <= startDate.getTime()) && (startDate.getTime() < eventData.trimEndTime.getTime())) ||
                    ((startDate.getTime() <= eventData.trimStartTime.getTime()) && (eventData.trimStartTime.getTime() < endDate.getTime()))) {
                    appointments.push(app);
                }
            }
        }
        return appointments;
    }

    /**
     * Buffer-aware stacking-index computation for the Event Buffer feature.
     *
     * Mirrors the base {@link getIndex} pipeline (`renderedEvents` → overlap list →
     * `getSmallestMissingNumber`) but uses a **bidirectional range-overlap** test
     * (`existingStart < newEnd && existingEnd > newStart`) against each existing rendered
     * appointment's buffered reserved range and the new event's buffered reserved range —
     * instead of the "contains the new event's start time" test used by the base `getOverlapEvents`.
     *
     * Why a new helper instead of reusing `getOverlapEvents` + `getIndex`:
     * The base `getOverlapEvents(date, appointments)` returns appointments whose buffered
     * range *contains* `date` — i.e., `existingStart <= date < existingEnd`. This works for the
     * common case where the new event's reserved start lands inside an existing event's reserved
     * range, but it MISSES the scenario where the new event's reserved start is EARLIER than the
     * existing event's reserved start while the two reserved ranges still overlap (e.g., new event
     * reserved 7:45–10:00, existing Travel Prep reserved 8:00–9:45 → ranges overlap but
     * `8:00 <= 7:45` is false, so the existing event is not counted → the new event stacks at the
     * same row and visually overlaps). Full range-overlap correctly catches both directions.
     *
     * Only used by the Event Buffer feature — the non-buffer path (`enableBuffer=false` or
     * non-buffer view) keeps using the existing `getIndex(date)` / `getSortComparerIndex` flows,
     * which remain correct for the non-buffered scenarios they were designed for.
     *
     * @param {Record<string, any>} event The new event wrapper record being stacked (the `event` passed to `renderEvents`).
     * @returns {number} The stacking row index (0-based) for the new event.
     * @private
     */
    private getBufferedOverlapIndex(event: Record<string, any>): number {
        const appointments: Record<string, any>[] = <Record<string, any>[]>this.renderedEvents;
        if (appointments.length === 0) {
            return 0;
        }
        const newRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(event);
        const newStart: number = newRange.start.getTime();
        const newEnd: number = newRange.end.getTime();
        const overlapped: Record<string, any>[] = [];
        for (const app of appointments) {
            const appRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(app);
            if (appRange.start.getTime() < newEnd && appRange.end.getTime() > newStart) {
                overlapped.push(app);
            }
        }
        if (overlapped.length === 0) {
            return 0;
        }
        const appLevel: number[] = overlapped.map((obj: Record<string, any>): number => obj.Index) as number[];
        const appIndex: number = this.getSmallestMissingNumber(appLevel);
        return (appIndex === -1) ? 0 : appIndex;
    }

    /**
     * Buffer-aware spanned-events sort applied just before the per-event render loop in the
     * base {@link renderEventsHandler} (see hook call site in month.ts).
     *
     * Why: the base flow sorts spanned appointments by raw `StartTime` (filterEvents →
     * sortByTime), and `renderEvents` then assigns stacking rows (top → row 0) in that order.
     * For the Event Buffer feature, an event whose reserved-start (StartTime − bufferBefore)
     * precedes another's reserved-start should render first (and claim row 0) — even when its
     * raw StartTime is later, because the reserved time is what visually overlaps.
     *
     * Example: Travel Prep 8:30-9:30 (before=30 → reserved 8:00-9:45) and Customer Meeting
     * 10:00-12:30 (before=60 → reserved 9:00-13:15). Base order: Travel Prep first (8:30 < 10:00)
     * → Travel Prep claims row 0. If the user edits Customer Meeting's start/bufferBefore so its
     * reserved start moves to 7:45 (earlier than Travel Prep's 8:00), the base sort would STILL
     * place Travel Prep first (raw StartTime 8:30 < 10:00) → Customer Meeting stacks on row 1
     * (bottom). With this buffer-aware sort, Customer Meeting is moved ahead of Travel Prep and
     * claims row 0 (top), matching the user's mental model that the "earlier-reserved" event
     * should appear on top.
     *
     * Tie-break ordering (matches the existing {@link EventBase.sortByDateTime} rules):
     *   1. Smaller buffered reserved-start (StartTime − bufferBefore) first.
     *   2. Falling back to smaller StartTime (raw event start).
     *   3. Falling back to smaller duration (EndTime − StartTime) — same as sortByDateTime.
     *
     * Gating: when enableBuffer is false or the active view is not a buffer-supported timeline
     * view (TimelineDay/TimelineWeek/TimelineWorkWeek with timeScale enabled), this override
     * is a no-op so every non-buffered renderer keeps the existing `filterEvents` sort order.
     *
     * @param {Record<string, any>[]} spannedEvents The spanned appointments to re-sort in place.
     * @returns {void}
     */
    protected sortSpannedEvents(spannedEvents: Record<string, any>[]): void {
        if (!this.parent.eventSettings.enableBuffer ||
            !(this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View))) {
            return;
        }
        const fields: EventFieldsMapping = this.parent.eventFields;
        spannedEvents.sort((a: Record<string, any>, b: Record<string, any>): number => {
            const aRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(a);
            const bRange: { start: Date; end: Date } = this.parent.eventBase.getBufferedDateRange(b);
            const reservedDelta: number = aRange.start.getTime() - bRange.start.getTime();
            if (reservedDelta !== 0) {
                return reservedDelta;
            }
            const aData: Record<string, any> = (a && a.data) ? a.data as Record<string, any> : a;
            const bData: Record<string, any> = (b && b.data) ? b.data as Record<string, any> : b;
            const aStart: Date = new Date(aData[fields.startTime] as Date);
            const bStart: Date = new Date(bData[fields.startTime] as Date);
            const startDelta: number = aStart.getTime() - bStart.getTime();
            if (startDelta !== 0) {
                return startDelta;
            }
            const aDuration: number = aRange.end.getTime() - aRange.start.getTime();
            const bDuration: number = bRange.end.getTime() - bRange.start.getTime();
            return aDuration - bDuration;
        });
    }

    /**
     * @param {Date[]} dateRender Accepts the dates to render.
     * @param {number[]} workDays Accepts the work days.
     * @param {TdData} resData Accepts the resource row.
     * @returns {void}
     * @private
     */
    public renderEventsHandler(dateRender: Date[], workDays: number[], resData?: TdData): void {
        if (resData && this.parent.groupSummaryModule && this.parent.groupSummaryModule.isGroupRow(resData)) {
            return;
        }
        super.renderEventsHandler(dateRender, workDays, resData);
    }

    public renderResourceEvents(): void {
        this.removeHeightProperty(cls.RESOURCE_COLUMN_TABLE_CLASS);
        const selector: string = '.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' tbody tr';
        this.addCellHeight(selector, this.eventHeight, EVENT_GAP, this.moreIndicatorHeight, 0, false, this.spacing ? this.getRowFrame() : undefined);
        // The group summary rows take their final height before the row tops are read, or the events land off their rows.
        if (this.parent.groupSummaryModule) {
            this.parent.groupSummaryModule.syncHeights();
        }
        const fixedRows: TdData[] = this.parent.fixedRowsModule && !this.parent.uiStateValues.isGroupAdaptive ?
            this.parent.resourceBase.fixedResourceLevel : [];
        if (fixedRows.length > 0) {
            this.removeHeightProperty(cls.FIXED_RESOURCE_WRAP_CLASS);
            this.addCellHeight('.' + cls.FIXED_RESOURCE_WRAP_CLASS + ' tbody tr', this.eventHeight, EVENT_GAP, this.moreIndicatorHeight, 0, false);
        }
        const resources: TdData[] = this.parent.uiStateValues.isGroupAdaptive ?
            [this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex]] :
            this.parent.resourceBase.renderedResources;
        if (this.parent.crudModule && this.parent.crudModule.crudObj.isCrudAction) {
            for (let i: number = 0, len: number = this.parent.crudModule.crudObj.sourceEvent.length; i < len; i++) {
                const source: TdData = this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)];
                this.rowIndex = source.groupIndex;
                if (!this.parent.uiStateValues.isGroupAdaptive ||
                    (this.parent.uiStateValues.groupIndex === source.groupIndex && this.parent.uiStateValues.isGroupAdaptive)) {
                    this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, source);
                }
                if (this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)] && this.parent.crudModule.crudObj.sourceEvent[parseInt(i.toString(), 10)].groupIndex !==
                    this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)].groupIndex) {
                    const target: TdData = this.parent.crudModule.crudObj.targetEvent[parseInt(i.toString(), 10)];
                    this.rowIndex = target.groupIndex;
                    this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, target);
                }
            }
            this.parent.crudModule.crudObj.isCrudAction = false;
        } else {
            for (let i: number = 0; i < resources.length; i++) {
                this.rowIndex = fixedRows.length > 0 ? resources[parseInt(i.toString(), 10)].groupIndex : i;
                this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, resources[parseInt(i.toString(), 10)]);
            }
            for (const fixedRow of fixedRows) {
                this.rowIndex = fixedRow.groupIndex;
                this.renderEventsHandler(this.parent.activeView.renderDates, this.parent.activeViewOptions.workDays, fixedRow);
            }
        }
    }

    public renderEvents(event: Record<string, any>, resIndex: number, appointmentsList?: Record<string, any>[]): void {
        let startTime: Date = event[this.fields.startTime] as Date;
        let endTime: Date = event[this.fields.endTime] as Date;
        if ((startTime.getTime() < this.parent.minDate.getTime()) || (endTime.getTime() > this.parent.maxDate.getTime())) {
            return;
        }
        const eventData: Record<string, any> = event.data as Record<string, any>;
        startTime = this.getStartTime(event, eventData);
        endTime = this.getEndTime(event, eventData);
        const startEndHours: Record<string, Date> = util.getStartEndHours(event[this.fields.startTime], this.startHour, this.endHour);
        const eventDates: Record<string, Date> = this.updateEventMinimumDuration(startEndHours, startTime, endTime);
        startTime = eventDates.startDate;
        endTime = eventDates.endDate;
        this.day = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime())));
        if (this.day < 0) {
            return;
        }
        const cellTd: HTMLElement = this.getCellTd();
        const eventsPerRow: number = this.parent.rowAutoHeight ? 1 : this.parent.activeViewOptions.maxEventsPerRow;
        const useBuffer: boolean = this.parent.eventSettings.enableBuffer &&
            (this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View));
        const indexTime: Date = useBuffer
            ? this.parent.eventBase.getBufferedDateRange(event).start
            : startTime;
        let overlapCount: number;
        if (this.exactMode) {
            overlapCount = this.getExtentIndex(event);
        } else if (useBuffer) {
            overlapCount = this.getBufferedOverlapIndex(event);
        } else {
            overlapCount = (isNullOrUndefined(this.parent.eventSettings.sortComparer))
                ? this.getIndex(indexTime)
                : this.getSortComparerIndex(indexTime, endTime);
        }
        event.Index = overlapCount;
        const appHeight: number = this.eventHeight;
        const diffInDays: number = eventData.count as number;
        const eventObj: Record<string, any> = extend({}, event, null, true) as Record<string, any>;
        eventObj[this.fields.startTime] = eventData[this.fields.startTime];
        eventObj[this.fields.endTime] = eventData[this.fields.endTime];
        const currentDate: Date = util.resetTime(new Date(this.dateRender[this.day].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let isValidEvent: boolean = true;
        if (this.isDayProcess() || eventObj[this.fields.isAllDay]) {
            isValidEvent = true;
        } else {
            isValidEvent = this.isValidEvent(eventObj, startTime, endTime, schedule);
        }
        if (startTime <= endTime && isValidEvent) {
            let appWidth: number = this.getEventWidth(startTime, endTime, event[this.fields.isAllDay] as boolean, diffInDays);
            appWidth = this.renderType === 'day' ? appWidth - 2 : appWidth;
            let appLeft: number = 0;
            let appRight: number = 0;
            let position: number = this.getPosition(startTime, endTime, event[this.fields.isAllDay] as boolean, this.day);
            if (this.exactMode) {
                const geometry: Record<string, any> = this.getExactGeometry(
                    event, this.cellWidth, this.dateRender.length - this.day);
                position += geometry.offset as number;
                appWidth = (geometry.width as number) - (geometry.endsAtEdge ? 2 : 0);
            }
            appWidth = (appWidth <= 0) ? this.cellWidth : appWidth; // appWidth 0 when start and end time as same
            this.renderedEvents.push(extend({}, event, null, true) as Record<string, any>);
            if (isNullOrUndefined(this.cellTops[parseInt(resIndex.toString(), 10)])) {
                this.cellTops[parseInt(resIndex.toString(), 10)] = this.getRowTop(resIndex);
            }
            const top: number = this.cellTops[parseInt(resIndex.toString(), 10)];
            let appTop: number = (top + (this.maxHeight ? 0 : EVENT_GAP)) + (overlapCount * (appHeight + EVENT_GAP));
            appLeft = (this.parent.enableRtl) ? 0 : position;
            appRight = (this.parent.enableRtl) ? position : 0;
            let height: number = ((overlapCount + 1) * (appHeight + EVENT_GAP)) + this.moreIndicatorHeight;
            let renderApp: boolean = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight && !this.parent.eventSettings.enableIndicator
                ? overlapCount < eventsPerRow : this.maxOrIndicator ? overlapCount < 1 ? true : false : this.cellHeight > height;
            let layout: StackLayout = null;
            if (this.spacing) {
                layout = this.getTrackStackLayout(overlapCount + 1);
                appTop = top + layout.top(overlapCount);
                height = layout.height;
                const usesMaxEventsPerRow: boolean = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.rowAutoHeight &&
                    !this.parent.eventSettings.enableIndicator;
                if (!usesMaxEventsPerRow && !this.maxOrIndicator) {
                    renderApp = overlapCount < layout.visible;
                }
            }
            if (this.parent.rowAutoHeight || renderApp) {
                let appointmentElement: HTMLElement;
                if (isNullOrUndefined(this.inlineValue)) {
                    appointmentElement = this.createAppointmentElement(event, resIndex);
                } else {
                    appointmentElement = this.parent.inlineModule.createInlineAppointmentElement();
                }
                this.applyResourceColor(appointmentElement, event, 'backgroundColor', this.groupOrder);
                const isBufferRender: boolean = useBuffer;
                let beforeWidth: number = 0;
                let afterWidth: number = 0;
                let bufferBefore: number = 0;
                let bufferAfter: number = 0;
                let isFirstPiece: boolean = false;
                let isLastPiece: boolean = false;
                if (isBufferRender) {
                    bufferBefore = util.getValidBufferMinutes(eventData[this.fields.bufferBefore]);
                    bufferAfter = util.getValidBufferMinutes(eventData[this.fields.bufferAfter]);
                    isFirstPiece = !(eventData.isLeft as boolean);
                    isLastPiece = !(eventData.isRight as boolean);
                    const viewStart: Date = util.getStartEndHours(
                        util.resetTime(new Date(this.dateRender[0].getTime())), this.startHour, this.endHour).startHour;
                    const viewEnd: Date = util.getStartEndHours(
                        util.resetTime(new Date(this.dateRender[this.dateRender.length - 1].getTime())),
                        this.startHour, this.endHour).endHour;
                    const pxPerMin: number = (this.cellWidth * this.slotCount) / this.interval;
                    let effectiveBefore: number = isFirstPiece ? bufferBefore : 0;
                    if (effectiveBefore > 0) {
                        const bufferStartTime: Date = new Date(startTime.getTime() - bufferBefore * util.MS_PER_MINUTE);
                        if (!(bufferStartTime >= viewStart)) {
                            effectiveBefore = 0;
                        }
                    }
                    let effectiveAfter: number = isLastPiece ? bufferAfter : 0;
                    if (effectiveAfter > 0) {
                        const bufferEndTime: Date = new Date(endTime.getTime() + bufferAfter * util.MS_PER_MINUTE);
                        if (!(bufferEndTime <= viewEnd)) {
                            effectiveAfter = 0;
                        }
                    }
                    beforeWidth = effectiveBefore > 0 && pxPerMin > 0 ? (pxPerMin * effectiveBefore) : 0;
                    afterWidth = effectiveAfter > 0 && pxPerMin > 0 ? (pxPerMin * effectiveAfter) : 0;
                    appLeft = (this.parent.enableRtl) ? appLeft : appLeft - beforeWidth;
                    appRight = (this.parent.enableRtl) ? appRight - beforeWidth : appRight;
                }
                setStyleAttribute(appointmentElement, {
                    'width': (appWidth + beforeWidth + afterWidth) + 'px', 'left': appLeft + 'px', 'right': appRight + 'px', 'top': appTop + 'px'
                });
                if (isBufferRender) {
                    const pieceBufferBefore: number = isFirstPiece && beforeWidth > 0 ? bufferBefore : 0;
                    const pieceBufferAfter: number = isLastPiece && afterWidth > 0 ? bufferAfter : 0;
                    this.renderEventBuffers(appointmentElement, eventData, resIndex,
                                            pieceBufferBefore, pieceBufferAfter,
                                            beforeWidth, afterWidth);
                    const appointmentDetails: HTMLElement = appointmentElement.querySelector('.' + cls.APPOINTMENT_DETAILS) as HTMLElement;
                    if (appointmentDetails && (beforeWidth || afterWidth)) {
                        setStyleAttribute(appointmentDetails, {
                            'width': appWidth + 'px',
                            'left': this.parent.enableRtl ? 'auto' : beforeWidth + 'px',
                            'right': this.parent.enableRtl ? beforeWidth + 'px' : 'auto',
                            'position': 'absolute', 'z-index': '1'
                        });
                    }
                    if (beforeWidth || afterWidth) {
                        this.offsetResizeHandlers(appointmentElement, beforeWidth, afterWidth);
                    }
                }
                this.wireAppointmentEvents(appointmentElement, event);
                if (this.parent.rowAutoHeight) {
                    const conWrap: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
                    const conWidth: number = this.parent.getElementWidth(conWrap);
                    const isWithoutScroll: boolean = conWrap.offsetHeight === conWrap.clientHeight &&
                        conWrap.offsetWidth === conWrap.clientWidth;
                    this.renderEventElement(event, appointmentElement, cellTd);
                    const firstChild: HTMLElement = this.getFirstChild(resIndex);
                    this.updateCellHeight(firstChild, height);
                    if (isWithoutScroll &&
                        (conWrap.offsetWidth > conWrap.clientWidth || conWidth !== this.parent.getElementWidth(conWrap))) {
                        this.adjustAppointments(conWidth);
                    }
                } else {
                    this.renderEventElement(event, appointmentElement, cellTd);
                }
            } else {
                for (let i: number = 0; i < diffInDays; i++) {
                    const moreIndicator: HTMLElement = cellTd.querySelector('.' + cls.MORE_INDICATOR_CLASS) as HTMLElement;
                    let appPos: number = (this.parent.enableRtl) ? appRight : appLeft;
                    appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
                    const interval: number = this.interval / this.slotCount;
                    let startDate: Date = (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day' || i !== 0) ?
                        new Date(this.dateRender[this.day + i].getTime()) : new Date(startTime);
                    let endDate: Date = util.addDays(this.dateRender[this.day + i], 1);
                    if (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day') {
                        const position: number = this.getPosition(startDate, endDate, event[this.fields.isAllDay], (this.day + i));
                        this.renderTimelineMoreIndicator(startTime, startDate, endDate, appHeight, interval, resIndex, appointmentsList, top, appLeft, appRight, cellTd, moreIndicator, appPos, position);
                    } else {
                        const slotCount: number = (util.getUniversalTime(endTime) - util.getUniversalTime(startTime)) / util.MS_PER_MINUTE *
                            this.slotCount / this.interval;
                        for (let k: number = 0; k < slotCount; k++) {
                            startDate = (k === 0) ? new Date(startDate.getTime()) : new Date(startDate.getTime() + (60000 * interval));
                            if (slotCount < 1) {
                                startDate = this.adjustToNearestTimeSlot(startDate, interval);
                            }
                            endDate = new Date(startDate.getTime() + (60000 * interval));
                            if (slotCount >= 1 && endDate.getTime() > endTime.getTime()) {
                                break;
                            }
                            const position: number = this.getPosition(startDate, endDate, false, (this.day + i));
                            if (appPos > position) {
                                break;
                            }
                            appPos = position;
                            this.renderTimelineMoreIndicator(startTime, startDate, endDate, appHeight, interval, resIndex, appointmentsList, top, appLeft, appRight, cellTd, moreIndicator, appPos, position);
                        }
                    }
                }
            }
        }
        this.parent.renderTemplates();
    }

    private adjustToNearestTimeSlot(inputTime: Date, interval: number): Date {
        // Parse the input time
        const parsedTime: Date = new Date(inputTime);

        // Get the minutes of the input time in milliseconds
        const minutesInMilliseconds: number = parsedTime.getHours() * 60 * 60 * 1000 + parsedTime.getMinutes() * 60 * 1000;

        // Calculate the adjusted time in milliseconds (nearest time slot)
        const adjustedMinutesInMilliseconds: number = Math.floor(minutesInMilliseconds / (interval * 60 * 1000)) * (interval * 60 * 1000);

        // Create a new Date object with the adjusted time
        const adjustedTime: Date = new Date(parsedTime.getTime());
        adjustedTime.setHours(adjustedMinutesInMilliseconds / (60 * 60 * 1000) % 24);
        adjustedTime.setMinutes((adjustedMinutesInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));

        // Return the adjusted time in string format
        return adjustedTime;
    }

    /**
     * Renders the before/after buffer regions as direct children of the parent
     * appointment element when the Event Buffer feature is enabled for the current view.
     * Each buffer is a single div carrying both `e-event-buffer` and the
     * `e-event-buffer-before` / `e-event-buffer-after` modifier class, with a localized
     * `aria-label` (built from the Schedule L10n `quickInfoBufferBefore` / `quickInfoBufferAfter`
     * + `minute` / `minutes` constants so screen readers announce the buffer in the active
     * locale) and a `data-buffer-duration` attribute for programmatic access.
     *
     * RTL positioning: in LTR the `before` (leading) buffer sits at the visual left edge
     * (`left:0`) and the `after` (trailing) buffer at the right edge (`right:0`). In RTL the
     * visual reading direction is reversed, so the leading `before` buffer must sit at the
     * right edge (`right:0`) and the trailing `after` buffer at the left edge (`left:0`).
     * Anchoring via `left:0` / `right:0` (rather than insertBefore / appendChild) keeps each
     * buffer pinned to its intended visual edge regardless of DOM order, and ensures the
     * `bufferTemplate` content rendered into the buffer div appears in the correct
     * end (before-content on the leading side, after-content on the trailing side).
     *
     * @param {HTMLElement} appointmentElement The parent appointment DOM element.
     * @param {Record<string, any>} eventData The source event record (used by bufferTemplate).
     * @param {number} resIndex The resource row index used for resourceData lookup.
     * @param {number} bufferBefore Validated minutes to subtract from the event start.
     * @param {number} bufferAfter Validated minutes to add to the event end.
     * @param {number} beforeWidth Computed pixel width of the before-buffer region.
     * @param {number} afterWidth Computed pixel width of the after-buffer region.
     * @returns {void}
     * @private
     */
    private renderEventBuffers(appointmentElement: HTMLElement, eventData: Record<string, any>, resIndex: number,
                               bufferBefore: number, bufferAfter: number, beforeWidth: number, afterWidth: number): void {
        if (!this.parent.eventSettings.enableBuffer ||
            !(this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View)) || (!bufferBefore && !bufferAfter)) {
            return;
        }
        const bufferColor: string = this.getBufferColor(appointmentElement);
        const bufferTextColor: string = this.getBufferTextColor(appointmentElement);
        const isRtl: boolean = this.parent.enableRtl;
        if (bufferBefore) {
            const before: HTMLElement = createElement('div', {
                className: cls.EVENT_BUFFER_CLASS + ' ' + cls.EVENT_BUFFER_BEFORE_CLASS,
                attrs: {
                    'data-buffer-duration': bufferBefore.toString(),
                    'aria-label': this.getBufferAriaLabel('before', bufferBefore)
                }
            });
            setStyleAttribute(before, {
                'position': 'absolute', 'top': '0', 'height': '100%', 'width': beforeWidth + 'px',
                'background-color': bufferColor, 'color': bufferTextColor, 'opacity': '0.7',
                'z-index': '0', 'pointer-events': 'none'
            });
            setStyleAttribute(before, isRtl ? { 'right': '0' } : { 'left': '0' });
            this.renderBufferTemplate(before, eventData, resIndex, 'before');
            appointmentElement.appendChild(before);
        }
        if (bufferAfter) {
            const after: HTMLElement = createElement('div', {
                className: cls.EVENT_BUFFER_CLASS + ' ' + cls.EVENT_BUFFER_AFTER_CLASS,
                attrs: {
                    'data-buffer-duration': bufferAfter.toString(),
                    'aria-label': this.getBufferAriaLabel('after', bufferAfter)
                }
            });
            setStyleAttribute(after, {
                'position': 'absolute', 'top': '0', 'height': '100%', 'width': afterWidth + 'px',
                'background-color': bufferColor, 'color': bufferTextColor, 'opacity': '0.7',
                'z-index': '0', 'pointer-events': 'none'
            });
            setStyleAttribute(after, isRtl ? { 'left': '0' } : { 'right': '0' });
            this.renderBufferTemplate(after, eventData, resIndex, 'after');
            appointmentElement.appendChild(after);
        }
    }

    /**
     * Shifts the parent event's left/right resize handlers inward by the corresponding buffer
     * width so that the resize handles visually sit at the parent event's edges rather than at
     * the outer buffer edges. The handlers were originally created with `left:0` / `right:0` of
     * the (widened) appointment element by {@link EventBase.renderResizeHandler}; an inline
     * `transform` slides them inward without altering their DOM anchor or breaking the resize
     * module's `closest('.e-event-resize')` lookup. When buffers are absent
     * (`beforeWidth = afterWidth = 0`) the transform resolves to a no-op, so existing flows
     * (Day/Week/Month views, non-buffered timeline events) behave exactly as before.
     *
     * RTL consideration: in RTL mode the leading buffer sits on the right and the trailing
     * buffer on the left, so the left/right handler offsets are swapped accordingly.
     *
     * @param {HTMLElement} appointmentElement The parent .e-appointment element.
     * @param {number} beforeWidth Width (px) of the before-buffer region.
     * @param {number} afterWidth Width (px) of the after-buffer region.
     * @returns {void}
     * @private
     */
    private offsetResizeHandlers(appointmentElement: HTMLElement, beforeWidth: number, afterWidth: number): void {
        if (!this.parent.resizeModule || !this.parent.allowResizing) {
            return;
        }
        const isRtl: boolean = this.parent.enableRtl;
        const leftHandler: HTMLElement = appointmentElement.querySelector(
            '.' + cls.EVENT_RESIZE_CLASS + '.' + cls.LEFT_RESIZE_HANDLER) as HTMLElement;
        const rightHandler: HTMLElement = appointmentElement.querySelector(
            '.' + cls.EVENT_RESIZE_CLASS + '.' + cls.RIGHT_RESIZE_HANDLER) as HTMLElement;
        if (leftHandler) {
            const leftShift: number = isRtl ? afterWidth : beforeWidth;
            setStyleAttribute(leftHandler, {
                'transform': 'translateX(' + leftShift + 'px)',
                'z-index': '10'
            });
        }
        if (rightHandler) {
            const rightShift: number = isRtl ? beforeWidth : afterWidth;
            setStyleAttribute(rightHandler, {
                'transform': 'translateX(-' + rightShift + 'px)',
                'z-index': '10'
            });
        }
    }

    /**
     * Renders the user-configured `bufferTemplate` content into the given buffer region element.
     * When no template is configured on `eventSettings.bufferTemplate`, this is a no-op and the
     * default lighter-shade background already applied through inline styles remains visible.
     * Matches the EJ2 template-rendering pattern used by the event tooltip and appointment
     * template paths: uses `this.parent.getBufferTemplate()`, a stable template id suffixed
     * with the schedule element id, and `this.parent.renderTemplates()` for embedded
     * template compilation.
     *
     * @param {HTMLElement} bufferElement The buffer region element to render into.
     * @param {Record<string, any>} eventData The source event record passed as template `data`.
     * @param {number} resIndex The resource row index used for resourceData lookup.
     * @param {'before' | 'after'} bufferType The buffer region kind.
     * @returns {void}
     * @private
     */
    private renderBufferTemplate(bufferElement: HTMLElement, eventData: Record<string, any>, resIndex: number,
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
            const resource: TdData = this.parent.resourceBase.renderedResources[parseInt(resIndex.toString(), 10)];
            resourceData = resource ? resource.resourceData : undefined;
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
     * Overrides the base renderEventElement to re-apply the buffer color after the user's
     * `eventRendered` callback has run (which may set the appointment background color via a
     * custom Color field on the data source). The base implementation fires `eventRendered`
     * and appends the appointment element to the DOM; we then read the final computed color
     * and recolor all buffer regions so the buffer always matches the visible parent event color.
     *
     * @param {Record<string, any>} event The event wrapper record being rendered.
     * @param {HTMLElement} appointmentElement The parent appointment DOM element.
     * @param {Element} cellTd The target work-cell the appointment is appended to.
     * @returns {void}
     */
    public renderEventElement(event: Record<string, any>, appointmentElement: HTMLElement, cellTd: Element): void {
        super.renderEventElement(event, appointmentElement, cellTd);
        if (!this.parent.eventSettings.enableBuffer ||
            !(this.parent.activeViewOptions.timeScale.enable &&
                util.isBufferView(this.parent.activeViewOptions.option as View))) {
            return;
        }
        this.refreshBufferColors(appointmentElement);
    }

    private renderTimelineMoreIndicator(startTime: Date, startDate: Date, endDate: Date, appHeight: number, interval: number, resIndex: number, appointmentsList: Record<string, any>[], top: number, appLeft: number, appRight: number, cellTd: HTMLElement, moreIndicator: HTMLElement, appPos: number, position: number): void {
        appLeft = (this.parent.enableRtl) ? appRight = position : position;
        appPos = (this.parent.enableRtl) ? appRight : appLeft;
        appPos = (Math.floor(appPos / this.cellWidth) * this.cellWidth);
        if ((cellTd && isNullOrUndefined(moreIndicator)) ||
            (!this.isAlreadyAvail(appPos, cellTd))) {
            const startDateTime: Date = (this.parent.activeViewOptions.option === 'TimelineMonth' || this.renderType === 'day') ? new Date(+startTime) : startDate;
            const slotStartTime: Date =
                (new Date(startDateTime.setMinutes(Math.floor(startDateTime.getMinutes() / interval) * interval)));
            const slotEndTime: Date = new Date(slotStartTime.getTime() + (60000 * interval));
            let groupIndex: string;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(resIndex)) {
                groupIndex = resIndex.toString();
            }
            const filterEvents: Record<string, any>[] =
                this.getFilterEvents(startDate, endDate, slotStartTime, slotEndTime, groupIndex, appointmentsList);
            const appArea: number = this.cellHeight - this.moreIndicatorHeight;
            appHeight = this.withIndicator ? appArea - EVENT_GAP : appHeight;
            const renderedAppCount: number = Math.floor(appArea / (appHeight + EVENT_GAP));
            const track: StackLayout = this.spacing ? this.getTrackStackLayout() : null;
            const shown: number = track ? track.visible : renderedAppCount;
            const count: number = this.parent.activeViewOptions.maxEventsPerRow && !this.parent.eventSettings.enableIndicator
                ? filterEvents.length - this.parent.activeViewOptions.maxEventsPerRow : (filterEvents.length - shown) <= 0 ? 1
                    : filterEvents.length - shown;
            let moreIndicatorElement: HTMLElement;
            if (this.renderType === 'day') {
                moreIndicatorElement = this.getMoreIndicatorElement(count, startDate, endDate);
            } else {
                moreIndicatorElement = this.getMoreIndicatorElement(count, slotStartTime, slotEndTime);
            }
            if (!isNullOrUndefined(groupIndex)) {
                moreIndicatorElement.setAttribute('data-group-index', groupIndex);
            }
            let placedByStack: boolean = false;
            if (track) {
                if (track.indicatorTop !== null) {
                    moreIndicatorElement.style.top = (top + track.indicatorTop) + 'px';
                    placedByStack = true;
                }
            }
            if (!placedByStack) {
                // The indicator is anchored to the bottom of the row; the trailing space stays free below it.
                const trail: number = track ? this.getRowFrame().trail : 0;
                moreIndicatorElement.style.top = top + this.cellHeight - trail + 'px';
            }
            moreIndicatorElement.style.width = this.cellWidth + 'px';
            moreIndicatorElement.style.left = (Math.floor(appLeft / this.cellWidth) * this.cellWidth) + 'px';
            moreIndicatorElement.style.right = (Math.floor(appRight / this.cellWidth) * this.cellWidth) + 'px';
            if (!placedByStack) {
                moreIndicatorElement.style.transform = 'translateY(-100%)';
            }
            this.renderElement(cellTd, moreIndicatorElement);
            EventHandler.add(moreIndicatorElement, 'click', this.moreIndicatorClick, this);
        }
    }
    public updateCellHeight(cell: HTMLElement, height: number): void {
        const cellHeight: number = cell.style.height === '' ? this.cellHeight : parseInt(cell.style.height, 10);
        if (height > cellHeight) {
            setStyleAttribute(cell, { 'height': height + 'px' });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                const resourceCell: HTMLElement = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_TABLE_CLASS + ' ' + 'tbody td[data-group-index="' +
                    cell.getAttribute('data-group-index') + '"], .' + cls.FIXED_RESOURCE_WRAP_CLASS + ' tbody td[data-group-index="' +
                    cell.getAttribute('data-group-index') + '"]') as HTMLElement;
                if (resourceCell) {
                    setStyleAttribute(resourceCell, { 'height': height + 'px' });
                }
            }
            const monthHeader: HTMLElement = this.parent.element.querySelector('.e-month-header-wrapper table tr:nth-child(' +
                ((cell.parentElement as HTMLTableRowElement).rowIndex + 1) + ') td') as HTMLElement;
            if (monthHeader) {
                setStyleAttribute(monthHeader, { 'height': height + 'px' });
            }
        }
    }

    private getFirstChild(index: number): HTMLElement {
        const query: string = '.' + cls.CONTENT_TABLE_CLASS + ' tbody td';
        let groupIndex: string = '';
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            groupIndex = '[data-group-index="' + index.toString() + '"]';
        }
        const td: HTMLElement = this.parent.element.querySelector(query + groupIndex) as HTMLElement;
        if (!td && this.parent.fixedRowsModule) {
            return this.parent.element.querySelector('.' + cls.FIXED_CONTENT_TABLE_CLASS + ' tbody td' + groupIndex) as HTMLElement;
        }
        return td;
    }

    public updateBlockElements(): void {
        const blockElement: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_APPOINTMENT_CLASS));
        for (const element of blockElement) {
            const resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            const firstChild: HTMLElement = this.getFirstChild(resIndex);
            element.style.height = (firstChild.offsetHeight - 1) + 'px';
            const width: number = element.offsetWidth / firstChild.offsetWidth;
            element.style.width = (firstChild.offsetWidth * width) + 'px';
        }
        const blockIndicator: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.BLOCK_INDICATOR_CLASS));
        for (const element of blockIndicator) {
            const resIndex: number = parseInt(element.getAttribute('data-group-index'), 10);
            element.style.top = this.getRowTop(resIndex) +
                this.getFirstChild(resIndex).offsetHeight - BLOCK_INDICATOR_HEIGHT + 'px';
        }
    }

    public getStartTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        let startTime: Date = event[this.fields.startTime] as Date;
        const schedule: { [key: string]: Date } = util.getStartEndHours(startTime, this.startHour, this.endHour);
        if (this.isDayProcess()) {
            startTime = event[this.fields.startTime] as Date;
        } else {
            if (schedule.startHour.getTime() >= eventData[this.fields.startTime]) {
                startTime = schedule.startHour;
            } else if (schedule.endHour.getTime() <= eventData[this.fields.startTime]) {
                startTime = this.getNextDay(schedule.startHour, eventData);
            } else {
                startTime = eventData[this.fields.startTime] as Date;
            }
        }
        // To overcome the overflow
        eventData.trimStartTime = (event[this.fields.isAllDay]) ? schedule.startHour : eventData[this.fields.startTime];
        return startTime;
    }

    private getNextDay(startTime: Date, eventData: Record<string, any>): Date {
        let startDate: Date;
        for (let i: number = 1; i <= this.dateRender.length; i++) {
            startDate = util.addDays(startTime, i);
            if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()))) !== -1) {
                eventData.count = eventData.count as number - 1;
                return startDate;
            }
        }
        return startDate;
    }

    public getEndTime(event: Record<string, any>, eventData: Record<string, any>): Date {
        let endTime: Date = event[this.fields.endTime] as Date;
        const schedule: { [key: string]: Date } = util.getStartEndHours(endTime, this.startHour, this.endHour);
        if (this.isDayProcess()) {
            endTime = eventData[this.fields.endTime] as Date;
        } else {
            endTime = eventData[this.fields.endTime] as Date;
            if (schedule.endHour.getTime() <= eventData[this.fields.endTime] || event[this.fields.isAllDay]) {
                endTime = schedule.endHour;
            }
            if (schedule.startHour.getTime() >= eventData[this.fields.endTime].getTime() && !event[this.fields.isAllDay]) {
                endTime = this.getPreviousDay(schedule.startHour, schedule.endHour, eventData);
            }
        }
        // To overcome the overflow
        eventData.trimEndTime = (event[this.fields.isAllDay]) ? schedule.endHour : eventData[this.fields.endTime];
        return endTime;
    }

    private getPreviousDay(startTime: Date, endTime: Date, eventData: Record<string, any>): Date {
        for (let i: number = 1; i <= this.dateRender.length; i++) {
            let endDate: Date = util.addDays(endTime, -i);
            if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()))) !== -1) {
                endDate = util.resetTime(new Date(endDate.getTime()));
                endDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                const count: number = eventData.count as number;
                const actualEndTime: Date = eventData[this.fields.endTime] as Date;
                eventData.count = actualEndTime.getHours() !== 0 || actualEndTime.getMinutes() !== 0 ? count - 1 : count;
                return endDate;
            }
        }
        return eventData[this.fields.endTime];
    }

    public getEventWidth(startDate: Date, endDate: Date, isAllDay: boolean, count: number): number {
        if (this.renderType === 'day' || isAllDay) {
            return (count * this.slotsPerDay) * this.cellWidth;
        }
        if (this.isSameDay(startDate, endDate)) {
            return this.getSameDayEventsWidth(startDate, endDate);
        } else {
            return this.getSpannedEventsWidth(startDate, endDate, count);
        }
    }

    private getSameDayEventsWidth(startDate: Date, endDate: Date): number {
        return ((util.getUniversalTime(endDate) - util.getUniversalTime(startDate)) /
            util.MS_PER_MINUTE * (this.cellWidth * this.slotCount) / this.getIntervalInMinutes(startDate));
    }

    private getSpannedEventsWidth(startDate: Date, endDate: Date, diffInDays: number): number {
        const width: number = (diffInDays * this.slotsPerDay) * this.cellWidth;
        let endWidth: number;
        const start: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        const startWidth: number = this.getSameDayEventsWidth(start.startHour, startDate);
        if (this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endDate.getTime()))) === -1) {
            endWidth = 0;
        } else {
            const { startHour, endHour }: { [key: string]: Date } =
                util.getStartEndHours(util.resetTime(new Date(endDate.getTime())), this.startHour, this.endHour);
            const interval: number = this.interval / this.slotCount;
            const lastSlotEndTime: Date = this.getEndTimeOfLastSlot(startHour, endHour, interval);
            const adjustedEndDate: Date = endHour < lastSlotEndTime ? endHour : lastSlotEndTime;
            endWidth = this.getSameDayEventsWidth(endDate, adjustedEndDate);
            endWidth = ((this.slotsPerDay * this.cellWidth) === endWidth) ? 0 : endWidth;
        }
        const spannedWidth: number = startWidth + endWidth;
        return (width > spannedWidth) ? width - spannedWidth : width - startWidth;
    }

    private getEndTimeOfLastSlot(startHour: Date, endHour: Date, interval: number): Date {
        const dstOffset: number = ((endHour.getTimezoneOffset() - startHour.getTimezoneOffset()) * util.MS_PER_MINUTE);
        const minutesInDay: number = (endHour.getTime() - startHour.getTime() - dstOffset) / util.MS_PER_MINUTE;
        const lastSlotEndMinutes: number = Math.floor(minutesInDay / interval) * interval;
        const lastSlotEndTime: Date = new Date(startHour);
        lastSlotEndTime.setMinutes(lastSlotEndMinutes);
        return lastSlotEndTime;
    }

    private isSameDay(startTime: Date, endTime: Date): boolean {
        const startDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(startTime.getTime()) as Date));
        const endDay: number = this.parent.getIndexOfDate(this.dateRender, util.resetTime(new Date(endTime.getTime()) as Date));
        return (startDay === endDay);
    }

    private getAppointmentLeft(schedule: { [key: string]: Date }, startTime: Date, day: number): number {
        const slotTd: number = (this.isSameDay(startTime, schedule.startHour as Date)) ?
            ((util.getUniversalTime(startTime) - util.getUniversalTime(schedule.startHour)) /
                (util.MS_PER_MINUTE * this.getIntervalInMinutes(startTime))) * this.slotCount : 0;
        if (day === 0) {
            return slotTd;
        } else {
            const daySlot: number = Math.round(((util.getUniversalTime(schedule.endHour) - util.getUniversalTime(schedule.startHour)) /
                this.interval / util.MS_PER_MINUTE) * this.slotCount);
            return (daySlot * day) + slotTd;
        }
    }

    public getPosition(startTime: Date, endTime: Date, isAllDay: boolean, day: number): number {
        if (this.renderType === 'day' || isAllDay) {
            return (day * this.slotsPerDay) * this.cellWidth;
        }
        const currentDate: Date = util.resetTime(new Date(this.dateRender[parseInt(day.toString(), 10)].getTime()));
        const schedule: { [key: string]: Date } = util.getStartEndHours(currentDate, this.startHour, this.endHour);
        let cellIndex: number;
        if (schedule.endHour.getTime() <= endTime.getTime() && schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        } else if (schedule.endHour.getTime() <= endTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        } else if (schedule.startHour.getTime() >= startTime.getTime()) {
            cellIndex = this.getAppointmentLeft(schedule, schedule.startHour, day);
        } else {
            cellIndex = this.getAppointmentLeft(schedule, startTime, day);
        }
        return cellIndex * this.cellWidth;
    }

    private getFilterEvents(startDate: Date, endDate: Date, startTime: Date, endTime: Date, gIndex: string, eventsList?: Record<string, any>[]): Record<string, any>[] {
        if (this.renderType === 'day') {
            return this.getFilteredEvents(startDate, endDate, gIndex, eventsList);
        } else {
            return this.getFilteredEvents(startTime, endTime, gIndex, eventsList);
        }
    }

    private getIntervalInMinutes(startDate: Date): number {
        if (this.slotsPerDay !== 1) {
            return this.interval;
        }
        const hoursRange: { [key: string]: Date } =
            util.getStartEndHours(util.resetTime(new Date(startDate.getTime())), this.startHour, this.endHour);
        return (hoursRange.endHour.getTime() - hoursRange.startHour.getTime()) / util.MS_PER_MINUTE;
    }

    private isAlreadyAvail(appPos: number, cellTd: HTMLElement): boolean {
        const moreIndicator: HTMLElement[] = [].slice.call(cellTd.querySelectorAll('.' + cls.MORE_INDICATOR_CLASS));
        for (let i: number = 0; i < moreIndicator.length; i++) {
            let indicatorPos: string;
            if (moreIndicator) {
                indicatorPos = (this.parent.enableRtl) ? moreIndicator[parseInt(i.toString(), 10)].style.right : moreIndicator[parseInt(i.toString(), 10)].style.left;
            }
            if (parseInt(indicatorPos, 10) === Math.floor(appPos)) {
                return true;
            }
        }
        return false;
    }

    public getRowTop(resIndex: number): number {
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            const rowSelector: string = ' ' + 'tbody td[data-group-index="' + resIndex.toString() + '"]';
            return (<HTMLElement>(this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + rowSelector) ||
                this.parent.element.querySelector('.' + cls.FIXED_CONTENT_WRAP_CLASS + rowSelector))).offsetTop;
        }
        return 0;
    }

    public getCellTd(): HTMLElement {
        const wrapIndex: number = this.parent.uiStateValues.isGroupAdaptive ? 0 : this.rowIndex;
        return this.eventContainers[parseInt(wrapIndex.toString(), 10)] as HTMLElement;
    }

    public renderBlockIndicator(cellTd: HTMLElement, position: number, resIndex: number): void {
        // No need to render block icon for Year, Month and Week header rows
        if (this.parent.headerRows.length > 0 &&
            (this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Hour' ||
                this.parent.headerRows[this.parent.headerRows.length - 1].option !== 'Date')) {
            return;
        }
        position = (Math.floor(position / this.cellWidth) * this.cellWidth) + this.cellWidth - BLOCK_INDICATOR_WIDTH;
        if (!this.isAlreadyAvail(position, cellTd)) {
            const blockIndicator: HTMLElement = createElement('div', { className: 'e-icons ' + cls.BLOCK_INDICATOR_CLASS });
            if (this.parent.activeViewOptions.group.resources.length > 0) {
                blockIndicator.setAttribute('data-group-index', resIndex.toString());
            }
            if (this.parent.enableRtl) {
                blockIndicator.style.right = position + 'px';
            } else {
                blockIndicator.style.left = position + 'px';
            }
            blockIndicator.style.top = this.getRowTop(resIndex) + this.cellHeight - BLOCK_INDICATOR_HEIGHT + 'px';
            this.renderElement(cellTd, blockIndicator);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setMaxEventHeight(event: HTMLElement, cell: HTMLElement): void {
        if (this.spacing) {
            const frame: RowFrame = this.getRowFrame();
            setStyleAttribute(event, {
                'height': (this.cellHeight - frame.lead - frame.trail - (this.maxHeight || !frame.reserve ? 0 : this.moreIndicatorHeight)) + 'px'
            });
            return;
        }
        setStyleAttribute(event, {
            'height': (this.cellHeight - (this.maxHeight ? 0 : EVENT_GAP) - (this.maxHeight ? 0 : this.moreIndicatorHeight)) + 'px'
        });
    }

    protected isDayCellView(): boolean {
        return this.isDayProcess();
    }

    private isDayProcess(): boolean {
        if (this.parent.currentView === 'TimelineMonth' || !this.parent.activeViewOptions.timeScale.enable ||
        (this.parent.activeViewOptions.headerRows.length > 0 &&
            this.parent.activeViewOptions.headerRows.slice(-1)[0].option !== 'Hour')) {
            return true;
        }
        return false;
    }

    public destroy(): void {
        this.renderType = null;
        this.eventContainers = null;
        this.dayLength = null;
        this.content = null;
        super.destroy();
        this.parent = null;
    }

}
