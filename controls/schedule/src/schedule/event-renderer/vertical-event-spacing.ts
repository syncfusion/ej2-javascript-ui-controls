/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { EventSpacingValues, SpacingFrame, CloneFrame } from '../base/interface';
import * as util from '../base/util';
import * as cls from '../base/css-constant';

interface SpacingPart { px: number; pct: number; }

interface ColumnParts { gap: SpacingPart; lead: SpacingPart; trail: SpacingPart; stack: boolean; legacy: number; }

interface ColumnReserve { px: number; pct: number; }

interface PlacedEvent { element: HTMLElement; index: number; count: number; }

interface ColumnState { lead: number; trail: number; placed: Record<string, PlacedEvent>; }

/** Minimum width of one event in CSS pixels (SCH-JS-025). An event never gets narrower than half of its width without spacing either. */
const MIN_EVENT_WIDTH: number = 24;
/** Width of the +N badge as a percentage of the column, as set by the theme (.e-event-indicator-badge). */
const BADGE_WIDTH_PERCENT: number = 20;

/** The row without spacing leaves 2 px above the first level and 2 px below the last. */
const ALLDAY_BUILT_IN_SPACE: number = 2;
/** The all-day row shows three levels while it is collapsed. */
const ALLDAY_COLLAPSED_LEVELS: number = 3;
/** The all-day row may take this share of the schedule height at most (one third). */
const ALLDAY_HEIGHT_SHARE: number = 3;

const round: (value: number) => number = (value: number): number => parseFloat(value.toFixed(4));

/**
 * Event spacing for the Day, Week and WorkWeek views: the columns of the time area and the levels of the all-day row.
 * The vertical event renderer owns one instance per render and only calls it when at least one spacing field is set,
 * so without spacing none of this code runs.
 *
 * @private
 */
export class VerticalEventSpacing {
    private parent: Schedule;
    private element: HTMLElement;
    private values: EventSpacingValues;
    private single: boolean;
    private parts: ColumnParts;
    private extents: Record<number, number> = {};
    private columns: Record<number, ColumnState> = {};
    private allDayLimit: number | null = null;

    /**
     * @param {Schedule} parent The schedule that owns the view.
     * @param {HTMLElement} element The panel of the active view that holds the appointment wrappers.
     * @param {EventSpacingValues} values The resolved spacing, with at least one field set.
     * @param {boolean} single True when every event takes the whole column (allowOverlap false or enableMaxHeight).
     */
    constructor(parent: Schedule, element: HTMLElement, values: EventSpacingValues, single: boolean) {
        this.parent = parent;
        this.element = element;
        this.values = values;
        this.single = single;
        this.parts = this.getParts();
    }

    /**
     * Gap, leading and trailing space of a column as a pixel part and a percentage part of the column.
     * A field the application sets is in pixels. A field it leaves unset keeps today's percentage, so setting one field does not move the others.
     *
     * @returns {ColumnParts} The gap, leading and trailing parts, whether maxEventStack reserves a slot for the +N badge,
     * and the percentage of the column that the layout without spacing shares between the events.
     */
    private getParts(): ColumnParts {
        const isDay: boolean = this.parent.currentView === 'Day';
        const single: boolean = this.single;
        const stack: boolean = !single && (this.parent.activeViewOptions.maxEventStack || 0) > 0;
        let legacy: number = isDay ? 97 : 94;
        if (stack) {
            legacy = this.parent.isAdaptive ? (isDay ? 75 : 50) : (isDay ? 75 : 70);
        }
        let trailPct: number = isDay ? 4 : 7;
        if (single) {
            trailPct = 0;
        } else if (stack) {
            trailPct = this.parent.isAdaptive ? (isDay ? 5 : 30) : (isDay ? 5 : 10);
        }
        return {
            gap: this.values.gap !== null ? { px: this.values.gap, pct: 0 } : { px: 0, pct: single ? 0 : 1 },
            lead: { px: this.values.leadingSpace !== null ? this.values.leadingSpace : 0, pct: 0 },
            trail: this.values.trailingSpace !== null ? { px: this.values.trailingSpace, pct: 0 } : { px: 0, pct: trailPct },
            stack: stack,
            legacy: legacy
        };
    }

    private getWrapper(wrapperIndex: number): HTMLElement {
        return this.element.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS + '[id="' +
            cls.APPOINTMENT_WRAPPER_CLASS + '-' + wrapperIndex + '"]');
    }

    private getExtent(wrapperIndex: number): number {
        if (isNullOrUndefined(this.extents[parseInt(wrapperIndex.toString(), 10)])) {
            const wrapper: HTMLElement = this.getWrapper(wrapperIndex);
            this.extents[parseInt(wrapperIndex.toString(), 10)] = wrapper ? wrapper.offsetWidth : 0;
        }
        return this.extents[parseInt(wrapperIndex.toString(), 10)];
    }

    /**
     * What `count` columns reserve in a wrapper besides the events, as a pixel part and a percentage part: leading space, trailing space,
     * the gaps between the columns (plus one gap and the +N badge slot when maxEventStack is on).
     *
     * @param {number} count The number of columns in the collision group.
     * @param {SpacingFrame} frame The gap, leading and trailing space in pixels that apply.
     * @returns {ColumnReserve} The reserved pixels and the reserved percentage.
     */
    private getReserve(count: number, frame: SpacingFrame): ColumnReserve {
        const parts: ColumnParts = this.parts;
        const gapCount: number = (count - 1) + (parts.stack ? 1 : 0);
        return {
            px: frame.lead + frame.trail + gapCount * frame.gap,
            pct: parts.lead.pct + parts.trail.pct + gapCount * parts.gap.pct + (parts.stack ? BADGE_WIDTH_PERCENT : 0)
        };
    }

    /**
     * The spacing in pixels that `count` columns can use in a day column: the values the application set, reduced to the last
     * value that fits. An event keeps at least the smaller of the minimum event width and half of the width it has without spacing,
     * so a value that only makes the column a little tight is kept and a value that would squeeze the events is cut. The gap
     * gives way first, then leading and trailing space (see util.fitSpacing).
     *
     * @param {number} wrapperIndex The index of the appointment wrapper (day column).
     * @param {number} count The number of columns in the collision group.
     * @param {number} lead The leading space to start from, in pixels.
     * @param {number} trail The trailing space to start from, in pixels.
     * @returns {SpacingFrame} The gap, leading and trailing space that fit, in pixels.
     */
    private fitFor(wrapperIndex: number, count: number, lead: number, trail: number): SpacingFrame {
        const parts: ColumnParts = this.parts;
        const extent: number = this.getExtent(wrapperIndex);
        if (extent <= 0) {
            return { gap: parts.gap.px, lead: lead, trail: trail };
        }
        const gapCount: number = (count - 1) + (parts.stack ? 1 : 0);
        const reserve: ColumnReserve = this.getReserve(count, { gap: 0, lead: 0, trail: 0 });
        const builtIn: number = this.single ? extent : extent * Math.max(0, parts.legacy - count) / count / 100;
        const minWidth: number = Math.min(MIN_EVENT_WIDTH, builtIn / 2);
        return util.fitSpacing(extent * (100 - reserve.pct) / 100 - count * minWidth, gapCount, parts.gap.px, lead, trail);
    }

    /**
     * Sets the width and the inline offset of one event as calc() terms: column i of n, with n - 1 gaps, inside leading and trailing space.
     * When maxEventStack is on, the slot of the +N badge and one gap are reserved after the last column.
     *
     * @param {HTMLElement} element The appointment element to position.
     * @param {number} index The column index of the event inside its collision group.
     * @param {number} count The number of columns in the collision group.
     * @param {SpacingFrame} frame The gap, leading and trailing space in pixels to use.
     * @returns {void}
     */
    private applyFrame(element: HTMLElement, index: number, count: number, frame: SpacingFrame): void {
        const parts: ColumnParts = this.parts;
        const reserve: ColumnReserve = this.getReserve(count, frame);
        const widthPct: number = (100 - reserve.pct) / count;
        const widthPx: number = reserve.px / count;
        const offsetPct: number = parts.lead.pct + index * parts.gap.pct + widthPct * index;
        const offsetPx: number = frame.lead + index * frame.gap - widthPx * index;
        element.style.width = 'calc(' + round(widthPct) + '% - ' + round(widthPx) + 'px)';
        element.style[this.parent.enableRtl ? 'right' : 'left'] = 'calc(' + round(offsetPct) + '% + ' + round(offsetPx) + 'px)';
    }

    private place(column: ColumnState, wrapperIndex: number, guid: string, element: HTMLElement, index: number, count: number): void {
        column.placed[`${guid}`] = { element: element, index: index, count: count };
        const fit: SpacingFrame = this.fitFor(wrapperIndex, count, column.lead, column.trail);
        this.applyFrame(element, index, count, { gap: fit.gap, lead: column.lead, trail: column.trail });
    }

    /**
     * Positions every event of the collision group that the rendered event belongs to. An event that is already in the DOM is
     * moved to its new column, because adding a column changes the share of the others. Leading and trailing space of a day column
     * are the smallest that any of its groups needs, so all events of the column start at the same place.
     *
     * @param {Record<string, any>} record The event record that was just rendered.
     * @param {HTMLElement} element The appointment element of that event.
     * @param {number} index The column index of the event inside its collision group.
     * @param {number} wrapperIndex The index of the appointment wrapper (day column) that holds the event.
     * @param {Array} groups The collision group of the event, by column.
     * @returns {void}
     */
    public layoutGroup(
        record: Record<string, any>, element: HTMLElement, index: number, wrapperIndex: number,
        groups: Record<string, any>[][]
    ): void {
        const single: boolean = this.single;
        if (isNullOrUndefined(this.columns[parseInt(wrapperIndex.toString(), 10)])) {
            this.columns[parseInt(wrapperIndex.toString(), 10)] = { lead: this.parts.lead.px, trail: this.parts.trail.px, placed: {} };
        }
        const column: ColumnState = this.columns[parseInt(wrapperIndex.toString(), 10)];
        const count: number = single ? 1 : groups.length;
        const fit: SpacingFrame = this.fitFor(wrapperIndex, count, column.lead, column.trail);
        column.lead = Math.min(column.lead, fit.lead);
        column.trail = Math.min(column.trail, fit.trail);
        if (!single) {
            const wrapper: HTMLElement = this.getWrapper(wrapperIndex);
            for (let i: number = 0; i < count; i++) {
                for (const item of groups[parseInt(i.toString(), 10)] || []) {
                    const sibling: HTMLElement = item.Guid !== record.Guid && wrapper ?
                        wrapper.querySelector('div[data-guid="' + item.Guid + '"]') : null;
                    if (sibling) {
                        this.place(column, wrapperIndex, item.Guid as string, sibling, i, count);
                    }
                }
            }
        }
        this.place(column, wrapperIndex, record.Guid as string, element, single ? 0 : index, count);
    }

    /**
     * Called once the events of a column are laid out. The events of the column are placed once more with the final leading and
     * trailing space and each group's own gap. When the spacing had to be reduced to fit the column, the
     * +N badges of the column move to the reduced trailing space.
     *
     * @param {number} wrapperIndex The index of the appointment wrapper (day column).
     * @returns {void}
     */
    public finishColumn(wrapperIndex: number): void {
        const column: ColumnState = this.columns[parseInt(wrapperIndex.toString(), 10)];
        if (!column) {
            return;
        }
        delete this.columns[parseInt(wrapperIndex.toString(), 10)];
        let reduced: boolean = column.lead < this.parts.lead.px || column.trail < this.parts.trail.px;
        for (const guid of Object.keys(column.placed)) {
            const placed: PlacedEvent = column.placed[`${guid}`];
            const fit: SpacingFrame = this.fitFor(wrapperIndex, placed.count, column.lead, column.trail);
            reduced = reduced || fit.gap < this.parts.gap.px;
            this.applyFrame(placed.element, placed.index, placed.count, { gap: fit.gap, lead: column.lead, trail: column.trail });
        }
        if (!reduced) {
            return;
        }
        const wrapper: HTMLElement = this.getWrapper(wrapperIndex);
        const badges: HTMLElement[] = wrapper ? [].slice.call(wrapper.querySelectorAll('.' + cls.MAX_EVENT_STACK_INDICATOR_CLASS)) : [];
        for (const badge of badges) {
            badge.style[this.parent.enableRtl ? 'left' : 'right'] = 'calc(' + round(this.parts.trail.pct) + '% + ' + round(column.trail) + 'px)';
        }
    }

    /**
     * Offset of the +N badge from the inline-end edge: the trailing space, so the order along the inline axis is
     * last event, gap, badge, trailing space. A column whose spacing had to be reduced moves its badges in finishColumn.
     *
     * @returns {string} The CSS offset to apply to the badge.
     */
    public getBadgeOffset(): string {
        return 'calc(' + round(this.parts.trail.pct) + '% + ' + round(this.parts.trail.px) + 'px)';
    }

    /**
     * The single-column frame of the active view as an offset and a width, used to size the drag clone so the preview matches
     * the column an event would be dropped into.
     *
     * @returns {CloneFrame} The inline offset and width of one full-width column, with the spacing reduced the way the column reduces it.
     */
    public getCloneFrame(): CloneFrame {
        const fit: SpacingFrame = this.fitFor(0, 1, this.parts.lead.px, this.parts.trail.px);
        const probe: HTMLElement = createElement('div');
        this.applyFrame(probe, 0, 1, fit);
        return { offset: this.parent.enableRtl ? probe.style.right : probe.style.left, width: probe.style.width };
    }

    /**
     * The height that the all-day row may take: a third of the schedule. The row sits above the time area, so a taller row hides
     * the events and the time scale beneath it. It is 0 (no limit) when the schedule height is `auto`, because then the schedule grows with its content.
     *
     * @returns {number} The limit in pixels, or 0 for no limit.
     */
    private getAllDayLimit(): number {
        if (this.allDayLimit === null) {
            this.allDayLimit = this.parent.height === 'auto' ? 0 : this.parent.getElementHeight(this.parent.element) / ALLDAY_HEIGHT_SHARE;
        }
        return this.allDayLimit;
    }

    /**
     * Forgets the measured all-day limit. The renderer calls it before it lays out the all-day row again.
     *
     * @returns {void}
     */
    public resetAllDay(): void {
        this.allDayLimit = null;
    }

    /**
     * The gap, leading and trailing space of the all-day row for the number of levels it shows, in pixels. A field the application leaves
     * unset keeps today's value: no gap, 2 px above the first level and 2 px below the last (the legacy row height adds 4 px for the two).
     * When the levels plus their spacing would make the row taller than the limit, the spacing is reduced to the last value that fits
     * (see util.fitSpacing), but never below what the row without spacing has.
     *
     * @param {number} levels The number of levels the row shows.
     * @param {number} levelHeight The height of one level in pixels.
     * @returns {SpacingFrame} The gap, lead and trail of the all-day row.
     */
    public getAllDayFrame(levels: number, levelHeight: number): SpacingFrame {
        const frame: SpacingFrame = {
            gap: this.values.gap !== null ? this.values.gap : 0,
            lead: this.values.leadingSpace !== null ? this.values.leadingSpace : ALLDAY_BUILT_IN_SPACE,
            trail: this.values.trailingSpace !== null ? this.values.trailingSpace : ALLDAY_BUILT_IN_SPACE
        };
        const limit: number = this.getAllDayLimit();
        const rows: number = Math.max(levels, 1);
        if (limit <= 0 || levelHeight <= 0) {
            return frame;
        }
        const budget: number = Math.max(limit - rows * levelHeight, 2 * ALLDAY_BUILT_IN_SPACE);
        if (frame.lead + frame.trail + (rows - 1) * frame.gap <= budget) {
            return frame;
        }
        return util.fitSpacing(budget, rows - 1, frame.gap, frame.lead, frame.trail);
    }

    /**
     * The top of an all-day level: the cell top, the leading space and the levels above it with their gaps.
     *
     * @param {number} cellTop The top of the all-day row.
     * @param {number} levelIndex The index of the level.
     * @param {number} levelHeight The height of one level.
     * @param {SpacingFrame} frame The frame of the row from getAllDayFrame.
     * @returns {number} The top of the level in pixels.
     */
    public getAllDayTop(cellTop: number, levelIndex: number, levelHeight: number, frame: SpacingFrame): number {
        return cellTop + frame.lead + (levelIndex * (levelHeight + frame.gap));
    }

    /**
     * The pixels that event spacing adds to the all-day row height for the given number of levels, on top of the legacy height.
     * The legacy height already holds the default 2 px above and below the levels, so only the difference is added.
     *
     * @param {SpacingFrame} frame The frame of the row from getAllDayFrame.
     * @param {number} levels The number of levels the row shows.
     * @returns {number} The extra height in pixels.
     */
    public getAllDayExtra(frame: SpacingFrame, levels: number): number {
        return (frame.lead - ALLDAY_BUILT_IN_SPACE) + (Math.max(levels, 1) - 1) * frame.gap + (frame.trail - ALLDAY_BUILT_IN_SPACE);
    }

    /**
     * The distance of the all-day `+n` indicator from the end of the row. The trailing space sits between the row end and the
     * indicator, which fills the last level slot. Without a trailing space the indicator keeps its built-in place at the end of the row.
     * The indicator shows only while the row is collapsed to three levels, so it follows the frame of three levels.
     *
     * @param {number} levelHeight The height of one level in pixels.
     * @returns {string | null} The CSS `bottom` value, or null to keep the built-in position.
     */
    public getAllDayIndicatorBottom(levelHeight: number): string | null {
        return this.values.trailingSpace !== null ? this.getAllDayFrame(ALLDAY_COLLAPSED_LEVELS, levelHeight).trail + 'px' : null;
    }
}
