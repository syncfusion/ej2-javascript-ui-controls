/**
 * To render and update event markers in Gantt
 */
import { Gantt } from '../base/gantt';
import { createElement, formatUnit, remove, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';
import { IEventMarkerInfo } from '../base/interface';
export class EventMarker {
    /**
     * Reference to the parent Gantt component instance.
     * @type {Gantt}
     */
    public parent: Gantt;

    /**
     * DOM container element for rendering event marker strips.
     * Holds all vertical marker lines positioned on the timeline.
     * @type {HTMLElement}
     */
    public eventMarkersContainer: HTMLElement;

    /**
     * Regex pattern for ISO date format detection (YYYY-MM-DD).
     * Cached at class level for performance optimization (avoids recompilation on each call).
     * @type {RegExp}
     * @readonly
     * @private
     */
    private readonly ISO_DATE_PATTERN: RegExp = /^\d{4}-\d{2}-\d{2}/;

    /**
     * Initializes the EventMarker renderer.
     * @param {Gantt} gantt - The parent Gantt component instance
     */
    constructor(gantt: Gantt) {
        this.parent = gantt;
        this.eventMarkersContainer = null;
    }
    /**
     * @returns {void} .
     * @private
     */
    public renderEventMarkers(): void {
        if (this.parent.eventMarkers && this.parent.eventMarkers.length > 0) {
            if (!this.parent.ganttChartModule.chartBodyContent.contains(this.eventMarkersContainer)) {
                this.eventMarkersContainer = createElement('div', {
                    className: cls.eventMarkersContainer
                });
                this.eventMarkersContainer.setAttribute('role', 'term');
                this.parent.ganttChartModule.chartBodyContent.appendChild(this.eventMarkersContainer);
            }
            this.eventMarkersContainer.innerHTML = '';
            this.getEventMarkersElements(this.eventMarkersContainer);
        } else {
            this.removeContainer();
        }
    }
    /**
     * @returns {void} .
     * @private
     */
    public removeContainer(): void {
        if (this.eventMarkersContainer) {
            remove(this.eventMarkersContainer);
            this.eventMarkersContainer = null;
        }
    }
    /**
     * Method to get event markers as html string
     *
     * @param {HTMLElement} container .
     * @returns {void} .
     */
    private getEventMarkersElements(container: HTMLElement): void {
        let left: number;
        let eventMarkerElement: HTMLElement;
        let spanElement: HTMLElement;
        let rightArrow: HTMLElement;
        let top: string;
        const eventMarkerCollection: IEventMarkerInfo[] = [];
        for (let i: number = 0; i < this.parent.eventMarkers.length; i++) {
            if (!isNullOrUndefined(this.parent.eventMarkers[i as number].day)) {
                let updatedDate: Date;
                const eventMarkerDate:  string | Date = this.parent.eventMarkers[i as number].day;
                this.parent['isFromEventMarker'] = true;
                if (eventMarkerDate instanceof Date) {
                    updatedDate = new Date(eventMarkerDate.getTime());
                } else {
                    const dateObject: Date = this.parent.globalize.parseDate(eventMarkerDate, { format: this.parent.getDateFormat(), type: 'dateTime' });
                    updatedDate = isNullOrUndefined(dateObject) &&
                    !isNaN(new Date(eventMarkerDate).getTime()) ? new Date(eventMarkerDate) : dateObject;
                }
                /**
                 * Timezone normalization for date-only event markers.
                 * Applies only when the user provided a date-only input (no explicit time).
                 * This ensures the marker renders at the correct timeline position regardless of timezone.
                 * For example: "2025-04-01" should display on April 1 in all timezones (IST, EST, UTC, etc).
                 * ISO dates parsed as UTC midnight are converted to local midnight to preserve visual date.
                 */
                if (this.isDateOnlyInput(eventMarkerDate, updatedDate) && !this.hasExplicitTime(eventMarkerDate)) {
                    updatedDate = this.normalizeToTimezone(updatedDate);
                }
                const formattedEventMarkerDate: Date = updatedDate;
                left = this.parent.dataOperation.getTaskLeft(
                    formattedEventMarkerDate, false, this.parent.defaultCalendarContext, true
                );
                top = this.parent.eventMarkers[i as number]['properties'].top;
                let heightException: boolean = true;
                if (this.parent.ganttHeight) {
                    heightException = parseFloat(top) <= (this.parent.ganttHeight - 155);
                }
                let markerTop: string = (top && parseFloat(top) >= 0 && heightException && top.includes('px')) ? top : '50px';
                if (!top && document.body.className.includes('e-bigger')) {
                    markerTop = `${parseFloat(markerTop) + 15}px`;
                }
                this.parent['isFromEventMarker'] = false;
                eventMarkerCollection.push({ id: i, left: left, label: this.parent.eventMarkers[i as number].label,
                    date: formattedEventMarkerDate,
                    top: markerTop });
                let align: string;
                if (this.parent.enableRtl) {
                    align = `right:${left}px;`;
                }
                else {
                    align = `left:${left}px;`;
                }
                eventMarkerElement = createElement('div', {
                    className: cls.eventMarkersChild, styles: `${align}  height:100%;`,
                    id: 'stripline' + i
                });
                if (this.parent.eventMarkers[i as number].label) {
                    spanElement = createElement('div', {
                        className: cls.eventMarkersSpan
                    });
                    const property: string = this.parent.disableHtmlEncode ? 'textContent' : 'innerHTML';
                    spanElement[property as string] = this.parent.eventMarkers[i as number].label;
                    if (this.parent.enableHtmlSanitizer && typeof(spanElement[property as string]) === 'string') {
                        spanElement[property as string] = SanitizeHtmlHelper.sanitize(spanElement[property as string]);
                    }
                    if (this.parent.enableRtl) {
                        spanElement.style.right = '5px';
                    }
                    else {
                        spanElement.style.left = '5px';
                    }
                    spanElement.style.setProperty('top', markerTop, 'important');
                    eventMarkerElement.appendChild(spanElement);
                    rightArrow = createElement('div', {
                        className: 'e-gantt-right-arrow'
                    });
                    const rightArrowTop: number = parseFloat(spanElement.style.top) < 10
                        ? parseFloat(spanElement.style.top) - 1
                        : parseFloat(spanElement.style.top);
                    if (document.body.className.includes('e-bigger')) {
                        rightArrow.style.setProperty('top', `${rightArrowTop + 8}px`, 'important');
                    } else {
                        rightArrow.style.setProperty('top', `${rightArrowTop + 10}px`, 'important');
                    }
                    eventMarkerElement.appendChild(rightArrow);
                }
                if (this.parent.eventMarkers[i as number].cssClass) {
                    eventMarkerElement.classList.add(this.parent.eventMarkers[i as number].cssClass);
                }
                eventMarkerElement.setAttribute('tabindex', '-1');
                eventMarkerElement.setAttribute('aria-label', this.parent.localeObj.getConstant('eventMarkers') + ' '
                    + (typeof this.parent.eventMarkers[i as number].day === 'string' ?
                        this.parent.eventMarkers[i as number].day :
                        this.parent.getFormatedDate(this.parent.eventMarkers[i as number].day as Date))
                    + ' ' + this.parent.eventMarkers[i as number].label);
                container.appendChild(eventMarkerElement);
            }
        }
        this.parent.eventMarkerColloction = eventMarkerCollection;
    }

    /**
     * Detects whether the user input represents a date-only value (no explicit time component).
     *
     * This method distinguishes between:
     * - **Date-only inputs**: "2025-04-01", new Date("2025-04-01"), new Date(2025, 3, 1)
     * - **Datetime inputs**: "2025-04-01T14:30:00", new Date(2025, 3, 1, 14, 30)
     *
     * For Date objects, it checks both local and UTC midnight to handle timezone offsets:
     * - Local midnight: Detects dates created with constructor (e.g., new Date(2025, 3, 1))
     * - UTC midnight: Detects ISO-parsed dates (e.g., new Date("2025-04-01"))
     *
     * @param {string | Date} input - The original user-provided event marker date
     * @param {Date} dateObj - The parsed Date object for comparison
     * @returns {boolean} true if input is date-only (no explicit time), false if explicit time provided
     *
     * @example
     * // String inputs
     * isDateOnlyInput("2025-04-01", dateObj) → true (date-only)
     * isDateOnlyInput("2025-04-01T14:30:00", dateObj) → false (explicit time)
     *
     * // Date objects (both timezone-aware cases)
     * isDateOnlyInput(new Date(2025, 3, 1), dateObj) → true (local midnight)
     * isDateOnlyInput(new Date("2025-04-01"), dateObj) → true (UTC midnight, ISO detected)
     *
     * @private
     */
    private isDateOnlyInput(input: string | Date, dateObj: Date): boolean {
        // Case 1: STRING date input
        if (typeof input === 'string') {
            // ISO or datetime string: "2025-04-01T00:00:00.000Z"
            if (input.includes('T')) {
                // For ISO format strings, check if UTC time is midnight
                return (
                    dateObj.getUTCHours() === 0 &&
                    dateObj.getUTCMinutes() === 0 &&
                    dateObj.getUTCSeconds() === 0
                );
            }
            // If string contains time separator (:) → explicit datetime
            if (input.includes(':')) {
                return false;
            }
            // Otherwise treat as date-only (handles non-ISO date strings)
            return true;
        }
        // Case 2: Date object input - must handle both timezone origins
        // Check 1: Local midnight (catches dates like new Date(2025, 3, 1))
        const isLocalMidnight: boolean = (
            dateObj.getHours() === 0 &&
            dateObj.getMinutes() === 0 &&
            dateObj.getSeconds() === 0 &&
            dateObj.getMilliseconds() === 0
        );
        // Check 2: UTC midnight (catches ISO-parsed dates like new Date("2025-04-01"))
        // These are parsed as UTC, so UTC being midnight indicates ISO origin
        const isUTCMidnight: boolean = (
            dateObj.getUTCHours() === 0 &&
            dateObj.getUTCMinutes() === 0 &&
            dateObj.getUTCSeconds() === 0
        );
        // Date is date-only if EITHER local OR UTC is midnight (not both, due to timezone offset)
        return isLocalMidnight || isUTCMidnight;
    }

    /**
     * Checks if the input string contains an explicit non-midnight time component.
     *
     * This method validates whether the user explicitly provided a specific time (not just midnight).
     * It only processes string inputs; Date objects are assumed to have implicit times.
     *
     * Time is considered "explicit" if:
     * - String contains a time separator ':' AND
     * - Extracted time is NOT 00:00:00 (midnight)
     *
     * Supports multiple time format separators:
     * - ISO format with 'T': "2025-04-01T14:30:00"
     * - Space separator: "2025-04-01 14:30:00"
     * - Locale formats with colons: "01-04-2025 14:30"
     *
     * @param {string | Date} input - The original user-provided event marker date
     * @returns {boolean} true if string has explicit non-midnight time, false otherwise
     *
     * @example
     * // Date-only strings (no explicit time)
     * hasExplicitTime("2025-04-01") → false (no time)
     * hasExplicitTime("2025-04-01T00:00:00") → false (midnight is implicit)
     *
     * // Datetime strings with explicit times
     * hasExplicitTime("2025-04-01T14:30:00") → true (explicit time)
     * hasExplicitTime("2025-04-01 07:15:30") → true (explicit time)
     *
     * // Date objects (not analyzed for time)
     * hasExplicitTime(new Date(2025, 3, 1, 14, 30)) → false (Date objects ignored)
     *
     * @private
     */
    private hasExplicitTime(input: string | Date): boolean {
        // Only analyze string inputs; Date objects are not considered to have explicit times
        if (typeof input !== 'string') {
            return false;
        }
        // Quick check: no ':' separator means no time component present
        if (!input.includes(':')) {
            return false;
        }
        // Extract time portion after separator (T or space)
        // Split by regex to handle both 'T' and space separators
        const timePart: string = input.split(/T|\s/)[1];
        // Parse time components (hours, minutes, seconds) with safe defaults
        const [hour = '0', minute = '0', second = '0'] = timePart.split(':');
        const hours: number = parseInt(hour, 10) || 0;
        const minutes: number = parseInt(minute, 10) || 0;
        const seconds: number = parseInt(second, 10) || 0;
        // Explicit time is only true if the time is NOT midnight (00:00:00)
        return !(hours === 0 && minutes === 0 && seconds === 0);
    }

    /**
     * Normalizes a date to local midnight while preserving the intended visual date.
     *
     * This method solves the timezone offset problem where ISO dates like "2025-04-01"
     * are parsed as UTC midnight but render at an offset time in local timezones.
     *
     * **Problem Example (IST timezone, UTC+5:30):**
     * - Input: "2025-04-01" (intended: April 1st)
     * - Parsed as: 2025-04-01 00:00:00 UTC
     * - Browser converts to: 2025-04-01 05:30:00 IST
     * - Without fix: getTaskLeft() uses 05:30 → renders April 1 afternoon ❌
     * - With fix: Normalizes to 00:00 IST → renders April 1 morning ✓
     *
     * **Algorithm:**
     * 1. Detects input origin (ISO string, ISO-parsed Date, or local Date)
     * 2. For ISO dates: Extract Y/M/D from UTC values
     * 3. For local dates: Extract Y/M/D from local values
     * 4. Reconstructs as local midnight: new Date(year, month, day, 0, 0, 0, 0)
     *
     * **Timezone Examples:**
     * - IST (UTC+5:30): April 1 UTC → April 1 00:00 IST
     * - EST (UTC-5): April 1 UTC → April 1 00:00 EST (not March 31)
     * - UTC (±0): April 1 UTC → April 1 00:00 UTC
     *
     * @param {Date} date - The parsed Date object to normalize
     * @param {string | Date} [input] - Optional original user input (helps detect ISO format strings)
     * @returns {Date} Date object representing local midnight of the visual date
     *
     * @example
     * // ISO string case
     * normalizeToTimezone(new Date("2025-04-01"), "2025-04-01")
     * → new Date(2025, 3, 1) (IST: 2025-04-01 00:00:00 IST)
     *
     * // ISO-parsed Date object case
     * normalizeToTimezone(new Date("2025-04-01"))
     * → Detects ISO origin via isISODateObject() → uses UTC values
     * → new Date(2025, 3, 1) (IST: 2025-04-01 00:00:00 IST)
     *
     * // Local Date object case
     * normalizeToTimezone(new Date(2025, 3, 1))
     * → Uses local values → new Date(2025, 3, 1) (unchanged, already correct)
     *
     * @private
     * @see isISODateObject For ISO-origin detection logic
     */
    private normalizeToTimezone(date: Date, input?: string | Date): Date {
        let year: number;
        let month: number;
        let day: number;
        // Case 1: ISO string input (YYYY-MM-DD format)
        // Use cached regex pattern for better performance
        if (typeof input === 'string' && this.ISO_DATE_PATTERN.test(input)) {
            // ISO format strings are parsed as UTC, so extract from UTC values
            year = date.getUTCFullYear();
            month = date.getUTCMonth();
            day = date.getUTCDate();
        }
        // Case 2: ISO-based Date object (e.g., new Date("2025-04-01"))
        // These are also parsed as UTC, detected by isISODateObject()
        else if (this.isISODateObject(date)) {
            // Extract Y/M/D from UTC to get the intended date
            year = date.getUTCFullYear();
            month = date.getUTCMonth();
            day = date.getUTCDate();
        }
        // Case 3: Local date formats or Date objects created with constructor
        // These use local time values directly
        else {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }
        // Return a new Date representing local midnight of the extracted date
        // This ensures the visual date is preserved across all timezones
        return new Date(year, month, day, 0, 0, 0, 0);
    }

    /**
     * Detects whether a Date object originated from ISO string parsing.
     *
     * **Detection Pattern:**
     * ISO dates like "2025-04-01" are parsed by JavaScript as UTC midnight (00:00:00 UTC).
     * When a non-UTC timezone is active, the browser applies an offset, creating a distinctive pattern:
     * - UTC time IS midnight (the parsed UTC value)
     * - Local time is NOT midnight (timezone offset applied)
     *
     * This pattern is unique to ISO-parsed dates and doesn't occur with:
     * - Local constructor dates: new Date(2025, 3, 1) → UTC offset is applied backward
     * - Explicit times: getUTCHours() ≠ 0 → not UTC midnight
     *
     * **Examples (IST timezone, UTC+5:30):**
     *
     * ISO-parsed (returns true):
     * ```
     * new Date("2025-04-01")
     * → UTC: 2025-04-01 00:00:00.000 ✓ (midnight)
     * → Local: 2025-04-01 05:30:00 ✓ (NOT midnight, offset applied)
     * ```
     *
     * Local constructor (returns false):
     * ```
     * new Date(2025, 3, 1)
     * → UTC: 2025-03-31 18:30:00.000 ✗ (NOT midnight)
     * → Local: 2025-04-01 00:00:00 (midnight)
     * ```
     *
     * Explicit time (returns false):
     * ```
     * new Date("2025-04-01T14:30:00Z")
     * → UTC: 2025-04-01 14:30:00.000 ✗ (NOT midnight)
     * → Local: 2025-04-01 20:00:00
     * ```
     *
     * @param {Date} date - The Date object to analyze
     * @returns {boolean} true if Date originated from ISO string parsing, false otherwise
     *
     * @private
     */
    private isISODateObject(date: Date): boolean {
        // Check 1: UTC time must be midnight (00:00:00.000)
        const isUTCMidnight: boolean = (
            date.getUTCHours() === 0 &&
            date.getUTCMinutes() === 0 &&
            date.getUTCSeconds() === 0 &&
            date.getUTCMilliseconds() === 0
        );
        // Check 2: Local time must NOT be midnight (indicates timezone offset was applied)
        const isLocalNotMidnight: boolean = !(
            date.getHours() === 0 &&
            date.getMinutes() === 0 &&
            date.getSeconds() === 0
        );
        // Both conditions indicate ISO origin: UTC is midnight but local is not
        return isUTCMidnight && isLocalNotMidnight;
    }
    /**
     * @returns {void} .
     * @private
     */
    public updateContainerHeight(): void {
        if (this.eventMarkersContainer) {
            this.eventMarkersContainer.style.height = formatUnit(this.parent.getContentHeight());
        }
    }
}
