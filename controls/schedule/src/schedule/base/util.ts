/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, remove, isNullOrUndefined  } from '@syncfusion/ej2-base';
import { View } from './type';
import { EventSpacingValues, StackLayout, SpacingFrame } from './interface';

/**
 * Schedule common utilities
 */

export const WEEK_LENGTH: number = 7;
export const DEFAULT_WEEKS: number = 6;
export const MS_PER_DAY: number = 86400000;
export const MS_PER_MINUTE: number = 60000;

/**
 * The list of views that support the Event Buffer feature. Includes the three
 * timeline views with a horizontal time axis (`TimelineDay`, `TimelineWeek`,
 * `TimelineWorkWeek`) and the three vertical views (`Day`, `Week`, `WorkWeek`)
 * where the time axis is vertical. Buffer DOM rendering, appointment
 * width/height extension, drag/resize geometry compensation, and buffered
 * overlap/conflict detection are only active when the current view is one of
 * these six views AND `timeScale.enable` is `true`.
 *
 * @private
 */
const BUFFER_SUPPORTED_VIEWS: View[] = [
    'TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'Day', 'Week', 'WorkWeek'
];

/**
 * Returns `true` when the supplied view name is a buffer-supported view — a
 * timeline view with a horizontal time axis (`TimelineDay`, `TimelineWeek`,
 * `TimelineWorkWeek`) or a vertical view (`Day`, `Week`, `WorkWeek`). This is
 * the single source of truth used by the renderers (`TimelineEvent`,
 * `VerticalEvent`), the event base (`EventBase`), the schedule class
 * (`Schedule`), and the editor window (`EventWindow`) to decide whether
 * buffer-related behaviour (DOM, geometry, overlap, editor inputs) applies.
 *
 * Note: This helper checks the view name only. Callers that also need to honour the
 * `timeScale.enable` gate must combine the result with an explicit check (e.g.
 * `isBufferView(viewName) && timeScale.enable`).
 *
 * @param {View} viewName The view name to check.
 * @returns {boolean} True when the view is a buffer-supported view.
 * @private
 */
export function isBufferView(viewName: View): boolean {
    return BUFFER_SUPPORTED_VIEWS.indexOf(viewName) !== -1;
}

/**
 * Validates and coerces a buffer value into a non-negative integer (minutes).
 * Returns `0` for `null`, `undefined`, strings, decimals, negatives, and any
 * non-number value. This is the single source of truth used by both the
 * renderer-side (`TimelineEvent`) and the shared event base (`EventBase`) so
 * buffer minutes are always validated through one consistent rule.
 *
 * @param {any} value The raw buffer value (from the event field).
 * @returns {number} The buffer duration in minutes, or 0 when invalid.
 * @private
 */
export function getValidBufferMinutes(value: any): number {
    return typeof value === 'number' && isFinite(value) && value >= 0 && Math.floor(value) === value ? value : 0;
}

/**
 * Converts a raw event spacing value to a valid number of pixels.
 * A finite number greater than or equal to 0 is returned as given, and a finite non-negative numeric string is converted.
 * Any other value is silently treated as 0, so the layout never throws.
 *
 * @param {any} value The raw spacing value (gap, leadingSpace or trailingSpace).
 * @returns {number} The valid spacing in pixels, or 0 when the value is invalid.
 * @private
 */
export function sanitizeSpacing(value: any): number {
    const result: number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
    return isFinite(result) && result >= 0 ? result : 0;
}

/**
 * Resolves each event spacing field on its own: the view value first, then the component value, then null (the built-in space).
 * A set field is sanitised, so it is never negative or NaN.
 *
 * @param {Record<string, any>} viewSpacing The `eventSpacing` of the active view, which includes a zoom preset.
 * @param {Record<string, any>} componentSpacing The `eventSpacing` of the component.
 * @returns {EventSpacingValues} The resolved gap, leadingSpace and trailingSpace.
 * @private
 */
export function resolveEventSpacing(
    viewSpacing: Record<string, any>, componentSpacing: Record<string, any>
): EventSpacingValues {
    const resolve: (field: string) => number | null = (field: string): number | null => {
        const raw: any = viewSpacing && !isNullOrUndefined(viewSpacing[`${field}`]) ? viewSpacing[`${field}`] :
            componentSpacing ? componentSpacing[`${field}`] : null;
        return isNullOrUndefined(raw) ? null : sanitizeSpacing(raw);
    };
    return { gap: resolve('gap'), leadingSpace: resolve('leadingSpace'), trailingSpace: resolve('trailingSpace') };
}

/**
 * Returns the spacing when at least one of its fields is set, otherwise null, so a renderer can keep its unchanged layout path.
 *
 * @param {EventSpacingValues} spacing The resolved spacing of the active view, or null when the view ignores spacing.
 * @returns {EventSpacingValues | null} The spacing, or null when no field is set.
 * @private
 */
export function spacingIfSet(spacing: EventSpacingValues | null): EventSpacingValues | null {
    return spacing && (spacing.gap !== null || spacing.leadingSpace !== null || spacing.trailingSpace !== null) ? spacing : null;
}

/**
 * Tells whether a change to `views` only touches `eventSpacing`, so the layout can be refreshed without rebuilding the views.
 * The change is an eventSpacing-only change when both arrays have the same length, every entry is equal once `eventSpacing` is
 * removed, and at least one `eventSpacing` differs.
 *
 * @param {Object} changed The new `views` value from onPropertyChanged.
 * @param {Object} previous The old `views` value from onPropertyChanged.
 * @returns {boolean} True when only eventSpacing changed in at least one view.
 * @private
 */
export function isEventSpacingOnlyChange(changed: unknown, previous: unknown): boolean {
    if (!Array.isArray(changed) || !Array.isArray(previous) || changed.length === 0 || changed.length !== previous.length) {
        return false;
    }
    const withoutSpacing: (view: unknown) => string = (view: unknown): string => JSON.stringify(view, (key: string, value: unknown) =>
        key === 'eventSpacing' ? undefined : typeof value === 'function' ? 'fn:' + String(value) : value);
    const spacingOf: (view: unknown) => string = (view: unknown): string =>
        JSON.stringify(view && typeof view === 'object' ? (view as Record<string, unknown>).eventSpacing : undefined);
    let spacingChanged: boolean = false;
    for (let i: number = 0; i < changed.length; i++) {
        if (withoutSpacing(changed[parseInt(i.toString(), 10)]) !== withoutSpacing(previous[parseInt(i.toString(), 10)])) {
            return false;
        }
        spacingChanged = spacingChanged ||
            spacingOf(changed[parseInt(i.toString(), 10)]) !== spacingOf(previous[parseInt(i.toString(), 10)]);
    }
    return spacingChanged;
}

/**
 * Reduces event spacing to the last value that fits, so a value that is too large for its track never pushes events out of it.
 * The spacing (leading space, trailing space and `gapCount` gaps) may take at most `budget` pixels. A set that fits is returned as it is.
 * Otherwise the gap gives way first, down to the space the leading and trailing values leave. When that is not enough the gap is 0 and
 * the larger of leading and trailing space is cut down towards the smaller one, and when the smaller one alone takes half the budget both get half.
 * A value that is not the cause of the excess keeps its value, and a huge value ends at the same result as a larger one.
 *
 * @param {number} budget The pixels of the track that spacing may use. It is the track extent minus what the events need.
 * @param {number} gapCount The number of gaps between the events that the track holds.
 * @param {number} gap The space between two adjacent events, in pixels.
 * @param {number} lead The space before the first event, in pixels.
 * @param {number} trail The space after the last event, in pixels.
 * @returns {SpacingFrame} The gap, lead and trail that fit, never negative.
 * @private
 */
export function fitSpacing(budget: number, gapCount: number, gap: number, lead: number, trail: number): SpacingFrame {
    if (budget <= 0) {
        return { gap: 0, lead: 0, trail: 0 };
    }
    if (lead + trail + gapCount * gap <= budget) {
        return { gap: gap, lead: lead, trail: trail };
    }
    const remaining: number = budget - lead - trail;
    if (gapCount > 0 && remaining >= 0) {
        return { gap: remaining / gapCount, lead: lead, trail: trail };
    }
    const kept: number = gapCount > 0 ? 0 : gap;
    const low: number = Math.min(lead, trail);
    if (low * 2 >= budget) {
        return { gap: kept, lead: budget / 2, trail: budget / 2 };
    }
    return lead <= trail ? { gap: kept, lead: lead, trail: budget - lead } : { gap: kept, lead: budget - trail, trail: trail };
}

/**
 * Computes the level layout of an event track on its block axis (all-day row, Month, Timeline and TimelineYear rows).
 * Level i starts at lead + i * (level + gap). When every level fits (lead + n * level + (n - 1) * gap + trail is less than the area),
 * all levels are visible and no indicator is needed. Otherwise the visible levels are the largest k for which the last visible level,
 * one gap, the indicator and the trailing space still fit, and the indicator sits one gap after level k with the trailing space free below it.
 *
 * @param {number} area The extent of the track on the block axis, in pixels. It is ignored when auto is true.
 * @param {number} levels The number of levels the track needs.
 * @param {number} level The height of one level, in pixels.
 * @param {number} gap The space between two adjacent levels, in pixels.
 * @param {number} lead The space before the first level, in pixels.
 * @param {number} trail The space after the last level or the indicator, in pixels.
 * @param {number} indicator The height of the more indicator, in pixels.
 * @param {boolean} auto True when the track grows to fit its levels, so every level is visible.
 * @param {boolean} reserveIndicator True to keep the indicator slot reserved even when every level fits, as the layout does when trailing space is unset.
 * @param {number} maxLevels A fixed number of visible levels (maxEventsPerRow). When it is set and fewer than the levels needed, exactly this many levels are visible and the indicator stays in the slot at the bottom of the row that the row height reserves.
 * @returns {StackLayout} The top of each level, the visible level count, the top of the indicator (null when not shown) and the height that fits all levels.
 * @private
 */
export function getStackLayout(
    area: number, levels: number, level: number, gap: number, lead: number, trail: number, indicator: number, auto: boolean,
    reserveIndicator: boolean = false, maxLevels: number = 0
): StackLayout {
    const top: (index: number) => number = (index: number): number => lead + index * (level + gap);
    const slot: number = reserveIndicator ? indicator : 0;
    const height: number = (levels > 0 ? lead + levels * level + (levels - 1) * gap + trail : lead + trail) + slot;
    if (levels <= 0) {
        return { top: top, visible: 0, indicatorTop: null, height: height };
    }
    if (maxLevels > 0 && levels > maxLevels) {
        return { top: top, visible: maxLevels, indicatorTop: null, height: height };
    }
    if (auto || height < area) {
        return { top: top, visible: levels, indicatorTop: null, height: height };
    }
    let visible: number = 1;
    for (let k: number = levels - 1; k >= 1; k--) {
        if (lead + k * level + (k - 1) * gap + gap + indicator + trail < area) {
            visible = k;
            break;
        }
    }
    return { top: top, visible: visible, indicatorTop: top(visible), height: height };
}

/**
 * Method to get height from element
 *
 * @param {Element} container Accepts the DOM element
 * @param {string} elementClass Accepts the element class
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the height of the element
 */
export function getElementHeightFromClass(container: Element, elementClass: string, isTransformed?: boolean): number {
    let height: number = 0;
    const el: HTMLElement = createElement('div', { className: elementClass }).cloneNode() as HTMLElement;
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    height = getElementHeight(el, isTransformed);
    remove(el);
    return height;
}

/**
 * Method to get width from element
 *
 * @param {Element} container Accepts the DOM element
 * @param {string} elementClass Accepts the element class
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the width of the element
 */
export function getElementWidthFromClass(container: Element, elementClass: string, isTransformed?: boolean): number {
    let width: number = 0;
    const el: HTMLElement = createElement('div', { className: elementClass }).cloneNode() as HTMLElement;
    el.style.visibility = 'hidden';
    el.style.position = 'absolute';
    container.appendChild(el);
    width = getElementWidth(el, isTransformed);
    remove(el);
    return width;
}

/**
 * Method to get translateY value
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {number} Returns the translateY value of given element
 */
export function getTranslateY(element: HTMLElement | Element): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return (<Record<string, any> & Window><unknown>window).WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m42 : 0;
}

/**
 * Method to get translateX value
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {number} Returns the translateX value of given element
 */
export function getTranslateX(element: HTMLElement | Element): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return (<Record<string, any> & Window><unknown>window).WebKitCSSMatrix ?
        new WebKitCSSMatrix(style.webkitTransform).m41 : 0;
}

/**
 * Method to get week first date
 *
 * @param {Date} date Accepts the date object
 * @param {number} firstDayOfWeek Accepts the first day of week number
 * @returns {Date} Returns the date object
 */
export function getWeekFirstDate(date: Date, firstDayOfWeek: number): Date {
    const date1: Date = new Date(date.getTime());
    firstDayOfWeek = (firstDayOfWeek - date1.getDay() + 7 * (-1)) % 7;
    return new Date(date1.setDate(date1.getDate() + (isNaN(firstDayOfWeek) ? 0 : firstDayOfWeek)));
}

/**
 * Method to get week last date
 *
 * @param {Date} date Accepts the date object
 * @param {number} firstDayOfWeek Accepts the first day of week number
 * @returns {Date} Returns the date object
 */
export function getWeekLastDate(date: Date, firstDayOfWeek: number): Date {
    const weekFirst: Date = getWeekFirstDate(date, firstDayOfWeek);
    const weekLast: Date = new Date(weekFirst.getFullYear(), weekFirst.getMonth(), weekFirst.getDate() + 6);
    return new Date(weekLast.getTime());
}

/**
 * Method to get first date of month
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function firstDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Method to get last date of month
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function lastDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Method to get week number
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the week number
 */
export function getWeekNumber(date: Date): number {
    const date1: number = new Date(date.getFullYear(), 0, 1).valueOf();
    const currentDate: number = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
    const dayOfYear: number = ((currentDate - date1 + MS_PER_DAY) / MS_PER_DAY);
    return Math.ceil(dayOfYear / 7);
}

/**
 * Method to get week middle date
 *
 * @param {Date} weekFirst Accepts the week first date object
 * @param {Date} weekLast Accepts the week last date object
 * @returns {Date} Returns the date object
 */
export function getWeekMiddleDate(weekFirst: Date, weekLast: Date): Date {
    return new Date(weekLast.valueOf() - ((weekLast.valueOf() - weekFirst.valueOf()) / 2));
}

/**
 * Method to set time to date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} time Accepts the milliseconds
 * @returns {Date} Returns the date object
 */
export function setTime(date: Date, time: number): Date {
    const tzOffsetBefore: number = date.getTimezoneOffset();
    const d: Date = new Date(date.getTime() + time);
    const tzOffsetDiff: number = d.getTimezoneOffset() - tzOffsetBefore;
    date.setTime(d.getTime() + tzOffsetDiff * MS_PER_MINUTE);
    return date;
}

/**
 * Method the reset hours in date object
 *
 * @param {Date} date Accepts the date object
 * @returns {Date} Returns the date object
 */
export function resetTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Method to get milliseconds from date object
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the milliseconds from date object
 */
export function getDateInMs(date: Date): number {
    const localOffset: number = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTimezoneOffset();
    const dateOffset: number = date.getTimezoneOffset();
    const timezoneOffset: number = dateOffset - localOffset;
    return ((date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime())
        - (timezoneOffset * 60 * 1000));
}

/**
 * Method to get date count between two dates
 *
 * @param {Date} startDate Accepts the date object
 * @param {Date} endDate Accepts the date object
 * @returns {number} Returns the date count
 */
export function getDateCount(startDate: Date, endDate: Date): number {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

/**
 * Method to add no of days in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfDays Accepts the number of days count
 * @returns {Date} Returns the date object
 */
export function addDays(date: Date, noOfDays: number): Date {
    date = new Date('' + date);
    return new Date(date.setDate(date.getDate() + noOfDays));
}

/**
 * Method to add no of months in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfMonths Accepts the number of month count
 * @returns {Date} Returns the date object
 */
export function addMonths(date: Date, noOfMonths: number): Date {
    date = new Date('' + date);
    const day: number = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + noOfMonths);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}

/**
 * Method to add no of years in date object
 *
 * @param {Date} date Accepts the date object
 * @param {number} noOfYears Accepts the number of month count
 * @returns {Date} Returns the date object
 */
export function addYears(date: Date, noOfYears: number): Date {
    date = new Date('' + date);
    const day: number = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + noOfYears);
    date.setDate(Math.min(day, getMaxDays(date)));
    return date;
}

/**
 * Method to get start and end hours
 *
 * @param {Date} date Accepts the date object
 * @param {Date} startHour Accepts the start hour date object
 * @param {Date} endHour Accepts the end hour date object
 * @returns {Object} Returns the start and end hour date objects
 */
export function getStartEndHours(date: Date, startHour: Date, endHour: Date): Record<string, Date> {
    const date1: Date = new Date(date.getTime());
    date1.setHours(startHour.getHours());
    date1.setMinutes(startHour.getMinutes());
    date1.setSeconds(startHour.getSeconds());
    let date2: Date = new Date(date.getTime());
    if (endHour.getHours() === 0) {
        date2 = addDays(date2, 1);
    } else {
        date2.setHours(endHour.getHours());
        date2.setMinutes(endHour.getMinutes());
        date2.setSeconds(endHour.getSeconds());
    }
    return { startHour: date1, endHour: date2 };
}

/**
 * Method to get month last date
 *
 * @param {Date} date Accepts the date object
 * @returns {number} Returns the month last date
 */
export function getMaxDays(date: Date): number {
    return lastDateOfMonth(date).getDate();
}

/**
 * Method to get days count between two dates
 *
 * @param {Date} startDate Accepts the date object
 * @param {Date} endDate Accepts the date object
 * @returns {number} Returns the days count
 */
export function getDaysCount(startDate: number, endDate: number): number {
    const strTime: Date = resetTime(new Date(startDate));
    const endTime: Date = resetTime(new Date(endDate));
    return Math.round((endTime.getTime() - strTime.getTime()) / MS_PER_DAY);
}

/**
 * Method to get date object from date string
 *
 * @param {string} date Accepts the date string
 * @returns {Date} Returns the date object
 */
export function getDateFromString(date: string): Date {
    return date.indexOf('Date') !== -1 ? new Date(parseInt(date.match(/\d+/g).toString(), 10)) :
        date.indexOf('T') !== -1 ? new Date(date) : new Date(date.replace(/-/g, '/'));
}

/** @private */
let scrollWidth: number = null;

/** @private */
let pixelRatio: number = null;

/**
 * Method to get scrollbar width
 *
 * @returns {number} Returns the scrollbar width
 * @private
 */
export function getScrollBarWidth(): number {
    if (scrollWidth !== null) { return scrollWidth; }
    if (pixelRatio === null) {
        pixelRatio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    }
    const divNode: HTMLElement = createElement('div');
    let value: number = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    const ratio: number = (devicePixelRatio) ? (devicePixelRatio.toFixed(2) === '1.10' || devicePixelRatio <= 1) ?
        Math.ceil(devicePixelRatio % 1) : Math.floor(devicePixelRatio % 1) : 0;
    value = (divNode.offsetWidth - divNode.clientWidth - ratio) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}

/**
 * Method to reset scrollbar width
 *
 * @private
 * @returns {void}
 */
export function resetScrollbarWidth(): void {
    const zoomPixelRatio: number = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (pixelRatio && pixelRatio !== zoomPixelRatio) {
        scrollWidth = null;
        pixelRatio = zoomPixelRatio;
    }
}

/**
 * Method to find the index from data collection
 *
 * @param {Object} data Accepts the data as object
 * @param {string} field Accepts the field name
 * @param {string} value Accepts the value name
 * @param {Object} event Accepts the data as object
 * @param {Object[]} resourceCollection Accepts the data collections
 * @returns {number} Returns the index number
 */
// eslint-disable-next-line max-len
export function findIndexInData(data: Record<string, any>[], field: string, value: string, event?: Record<string, any>, resourceCollection?: Record<string, any>[]): number {
    for (let i: number = 0, length: number = data.length; i < length; i++) {
        if (data[parseInt(i.toString(), 10)][`${field}`] === value) {
            if (event) {
                const field: string = resourceCollection.slice(-2)[0].field as string;
                const res: string[] = (event[`${field}`] instanceof Array ? event[`${field}`] : [event[`${field}`]]) as string[];
                const resData: string = res.join(',');
                if (resData.includes(data[parseInt(i.toString(), 10)][(resourceCollection.slice(-1)[0] as any).groupIDField] as string)) {
                    return i;
                }
            } else {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Method to get element outer height
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @returns {number} Returns the outer height of the given element
 */
export function getOuterHeight(element: HTMLElement): number {
    const style: CSSStyleDeclaration = getComputedStyle(element);
    return element.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
}

/**
 * Method to remove child elements
 *
 * @param {HTMLElement | Element} element Accepts the DOM element
 * @returns {void}
 */
export function removeChildren(element: HTMLElement | Element): void {
    const elementChildren: HTMLElement[] | Element[] = [].slice.call(element.children);
    for (const elementChild of elementChildren) {
        element.removeChild(elementChild);
    }
}

/**
 * Method to check DST is present or not in date object
 *
 * @param {Date} date Accepts the date object
 * @returns {boolean} Returns the boolean value for either DST is present or not
 */
export function isDaylightSavingTime(date: Date): boolean {
    const jan: Date = new Date(date.getFullYear(), 0, 1);
    const jul: Date = new Date(date.getFullYear(), 6, 1);
    return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

/**
 * Method to get UTC time value from date
 *
 * @param {Date} date Accepts the date
 * @returns {number} Returns the UTC time value
 */
export function getUniversalTime(date: Date): number {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const day: number = date.getDate();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const seconds: number = date.getSeconds();
    const milliseconds: number = date.getMilliseconds();
    return Date.UTC(year, month, day, hours, minutes, seconds, milliseconds);
}

/**
 * Method to check the device
 *
 * @returns {boolean} Returns the boolean value for either device is present or not.
 */
export function isMobile(): boolean {
    return window.navigator.userAgent.toLowerCase().indexOf('mobi') > -1;
}

/**
 * Method to check the IPad device
 *
 * @returns {boolean} Returns the boolean value for either IPad device is present or not.
 */
export function isIPadDevice(): boolean {
    return window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1;
}

/**
 * Method to capitalize the first word in string
 *
 * @param {string} inputString Accepts the string value
 * @param {string} type Accepts the string type
 * @returns {string} Returns the output string
 */
export function capitalizeFirstWord(inputString: string, type: string): string {
    if (type === 'multiple') {
        inputString = inputString.split(' ').map((e: string) => e.charAt(0).toLocaleUpperCase() + e.substring(1)).join(' ');
    } else if (type === 'single') {
        if (inputString[0] >= '0' && inputString[0] <= '9') {
            const array: RegExpMatchArray = inputString.match(/[a-zA-Z]/);
            inputString = isNullOrUndefined(array) ? inputString :
                inputString.slice(0, array.index) + inputString[array.index].toLocaleUpperCase() + inputString.slice(array.index + 1);
        }
        inputString = inputString[0].toLocaleUpperCase() + inputString.slice(1);
    }
    return inputString;
}

/**
 * Method to get element cell width
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the width of the given element
 */
export function getElementWidth(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetWidth : element.getBoundingClientRect().width;
}

/**
 * Method to get element cell Height
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the Height of the given element
 */
export function getElementHeight(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetHeight : element.getBoundingClientRect().height;
}

/**
 * Method to get element cell Top
 *
 * @param {HTMLElement} element Accepts the DOM element
 * @param {boolean} isTransformed Accepts the boolean value that indicates the status of the transform style applied to the element
 * @returns {number} Returns the top value of the given element
 */
export function getElementTop(element: HTMLElement, isTransformed?: boolean): number {
    return isTransformed ? element.offsetTop : element.getBoundingClientRect().top;
}

/**
 * Returns the number of rows that follow the given row and belong to its subtree in the same list.
 *
 * @param {Object[]} rows Accepts the resource rows of one region in resource order.
 * @param {number} index Accepts the position of the parent row.
 * @returns {number} Returns the number of descendants present in the rows.
 * @private
 */
export function getDescendantCount(rows: { groupOrder?: string[] }[], index: number): number {
    const order: string[] = rows[parseInt(index.toString(), 10)].groupOrder;
    let count: number = 0;
    while (order && index + count + 1 < rows.length) {
        const next: string[] = rows[index + count + 1].groupOrder;
        const isChild: boolean = !!next && next.length > order.length &&
            order.every((id: string, level: number) => next[parseInt(level.toString(), 10)] === id);
        if (!isChild) {
            break;
        }
        count++;
    }
    return count;
}

/**
 * Converts a time within a day cell to an inline offset in pixels. The cell spans from `cellStart` to `cellEnd`,
 * so days that are longer or shorter because of daylight saving scale by their own length.
 *
 * @param {Date} time - Specifies the time to convert.
 * @param {Date} cellStart - Specifies the start of the day cell.
 * @param {Date} cellEnd - Specifies the end of the day cell.
 * @param {number} cellSize - Specifies the inline size of the cell in pixels.
 * @param {boolean} isRtl - Specifies whether the offset is measured from the right edge.
 * @returns {number} Returns the offset in pixels, measured from the inline start edge.
 * @private
 */
export function timeToOffset(time: Date, cellStart: Date, cellEnd: Date, cellSize: number, isRtl?: boolean): number {
    const span: number = cellEnd.getTime() - cellStart.getTime();
    const ratio: number = Math.min(Math.max((time.getTime() - cellStart.getTime()) / span, 0), 1);
    const offset: number = ratio * cellSize;
    return isRtl ? cellSize - offset : offset;
}

/**
 * Converts an inline offset in pixels within a day cell to a time. It is the inverse of `timeToOffset`.
 *
 * @param {number} offset - Specifies the offset in pixels from the inline start edge.
 * @param {Date} cellStart - Specifies the start of the day cell.
 * @param {Date} cellEnd - Specifies the end of the day cell.
 * @param {number} cellSize - Specifies the inline size of the cell in pixels.
 * @param {boolean} isRtl - Specifies whether the offset is measured from the right edge.
 * @returns {Date} Returns the time at the offset.
 * @private
 */
export function offsetToTime(offset: number, cellStart: Date, cellEnd: Date, cellSize: number, isRtl?: boolean): Date {
    const clamped: number = Math.min(Math.max(offset, 0), cellSize);
    const ratio: number = (isRtl ? cellSize - clamped : clamped) / cellSize;
    return new Date(cellStart.getTime() + Math.round(ratio * (cellEnd.getTime() - cellStart.getTime())));
}
