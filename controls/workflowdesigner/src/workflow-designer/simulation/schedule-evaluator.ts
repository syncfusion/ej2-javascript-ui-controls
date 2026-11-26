/**
 * Schedule calculations for Scheduled Trigger steps.
 * Manual run is gated until due; a 1s watcher auto-fires when the next occurrence arrives.
 *
 * @private
 */
import { L10n } from '@syncfusion/ej2-base';
import { LocaleContext } from '../localization/locale-context';
import { localeDefaults } from '../localization/locale-defaults';

export type ScheduleType = 'Once' | 'Recurring' | 'Cron';
/**
 * Schedule Interval Unit.
 *
 * @private
 */
export type ScheduleIntervalUnit = 'Minutes' | 'Hours' | 'Days' | 'Weeks';

/**
 * Schedule Props.
 *
 * @private
 */
export interface ScheduleProps {
    scheduleType?: unknown;
    startDateTime?: unknown;
    interval?: unknown;
    intervalUnit?: unknown;
    endDateTime?: unknown;
    maxOccurrences?: unknown;
    cronExpression?: unknown;
    /**
     * IANA time zone (for example `'UTC'` or `'Asia/Kolkata'`) for dates without an offset and for
     * cron fields. Defaults to `'UTC'` so the designer and a backend runtime agree.
     */
    timeZone?: unknown;
}

/**
 * Parsed cron fields.
 *
 * @private
 */
interface CronRules {
    minute: { any: boolean; values: Set<number> };
    hour: { any: boolean; values: Set<number> };
    day: { any: boolean; values: Set<number> };
    month: { any: boolean; values: Set<number> };
    weekday: { any: boolean; values: Set<number> };
}

/**
 * Schedule Fire Result.
 *
 * @private
 */
export interface ScheduleFireResult {
    scheduleType: ScheduleType;
    /** ISO time when this run should fire (next / current occurrence). */
    fireAt: string;
    /** Milliseconds from `now` until fire (0 if due immediately). */
    waitMs: number;
    /** True when fire time is already due or past. */
    isDue: boolean;
    endDateTime?: string;
    maxOccurrences?: number;
    /** 0-based occurrence index for recurring. */
    occurrence?: number;
    cronExpression?: string;
    interval?: number;
    intervalUnit?: ScheduleIntervalUnit;
    startDateTime?: string;
}

/**
 * Schedule Validation Issue.
 *
 * @private
 */
export interface ScheduleValidationIssue {
    code: string;
    message: string;
    propertyPath?: string;
}

/**
 * Schedule Run Status.
 *
 * @private
 */
export interface ScheduleRunStatus {
    canRun: boolean;
    message: string;
}

/**
 * Schedule Occurrence.
 *
 * @private
 */
export interface ScheduleOccurrence {
    /** Epoch ms of the occurrence. */
    time: number;
    /** Stable key for auto-run de-dupe. */
    key: string;
    /** Local display label. */
    label: string;
    scheduleType: ScheduleType;
    occurrence?: number;
}

/**
 * Pure schedule helpers (no DOM / timer side effects).
 *
 * @private
 */
export class ScheduleEvaluator {


    /**
     * Resolves a translation key against the shared L10n instance.
     * Diagnostic codes (`SCHEDULE_START`, `CRON_INVALID`, ...) live on the
     * `code` field of `ScheduleValidationIssue` and never travel through this
     * method. Technical tokens (`Once`, `Recurring`, `Cron`, the 5-field
     * cron shape description, `{0}` placeholders for inline `startDateTime`
     * values) are preserved verbatim inside the resolved strings.
     *
     * @param {string} key - The localization key to resolve.
     * @param {L10n} l10n - Optional localization provider.
     * @returns {string} The translated string, or the English fallback.
     * @private
     */
    private static t(key: string, l10n?: L10n): string {
        return LocaleContext.text(key, localeDefaults[`${key}`], l10n);
    }

    /**
     * Convenience helper to format a `ScheduleValidationIssue` error message
     * from a translation key, preserving the technical tokens in the source.
     *
     * @param {string} key - The localization key for the surrounding prose.
     * @param {string} inline - The technical token to inline (e.g. a date).
     * @returns {string} The formatted message.
     * @private
     */
    private static inline(key: string, inline: string): string {
        const template: string = ScheduleEvaluator.t(key);
        return template.indexOf('{0}') === -1 ? template : template.replace('{0}', inline);
    }
    /**
     * Next fire metadata for a run that is already allowed to execute.
     * Does not throw for "not due yet" — callers use getRunStatus / nextOccurrence for gating.
     *
     * @param {ScheduleProps} props - provide the schedule props.
     * @param {Date} [now] - provide the current time.
     * @returns {ScheduleFireResult} Used to return the next fire metadata.
     * @private
     */
    public static evaluate(props: ScheduleProps, now: Date = new Date()): ScheduleFireResult {
        const scheduleType: ScheduleType = ScheduleEvaluator.normalizeType(props.scheduleType);
        const nowMs: number = now.getTime();

        if (scheduleType === 'Once') {
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                throw ScheduleEvaluator.validationError('SCHEDULE_START', ScheduleEvaluator.t('validationScheduleStartOnce'));
            }
            const waitMs: number = Math.max(0, start.getTime() - nowMs);
            return {
                scheduleType: 'Once',
                fireAt: start.toISOString(),
                waitMs,
                isDue: waitMs === 0,
                startDateTime: start.toISOString(),
                occurrence: 0
            };
        }

        if (scheduleType === 'Recurring') {
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                throw ScheduleEvaluator.validationError('SCHEDULE_START', ScheduleEvaluator.t('validationScheduleStartRecurring'));
            }
            const unit: ScheduleIntervalUnit = ScheduleEvaluator.normalizeUnit(props.intervalUnit);
            const intervalMs: number = ScheduleEvaluator.intervalToMs(props.interval, unit);
            if (intervalMs <= 0) {
                throw ScheduleEvaluator.validationError('SCHEDULE_INTERVAL', ScheduleEvaluator.t('validationScheduleInterval'));
            }
            const startMs: number = start.getTime();
            // Occurrence = floor((now-start)/interval) when now > start, else 0.
            const occurrence: number = nowMs <= startMs ? 0 : Math.floor((nowMs - startMs) / intervalMs);
            const fireMs: number = startMs + occurrence * intervalMs;
            const waitMs: number = Math.max(0, fireMs - nowMs);
            const interval: number = Number(props.interval);
            const result: ScheduleFireResult = {
                scheduleType: 'Recurring',
                fireAt: new Date(fireMs).toISOString(),
                waitMs,
                isDue: waitMs === 0,
                startDateTime: start.toISOString(),
                interval: isFinite(interval) ? interval : undefined,
                intervalUnit: unit,
                occurrence
            };
            const end: Date | null = ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props));
            if (end) {
                result.endDateTime = end.toISOString();
            }
            const maxOccurrences: number | undefined = ScheduleEvaluator.readPositiveInt(props.maxOccurrences);
            if (maxOccurrences !== undefined) {
                result.maxOccurrences = maxOccurrences;
            }
            return result;
        }

        // Cron fires on the current minute when it matches; otherwise isDue=false at minute start.
        const expression: string = String(props.cronExpression || '').trim();
        if (!expression || !ScheduleEvaluator.isValidCronExpression(expression)) {
            throw ScheduleEvaluator.validationError(
                'CRON_INVALID',
                ScheduleEvaluator.t('validationCronFields')
            );
        }
        const minuteStart: number = Math.floor(nowMs / 60000) * 60000;
        const matches: boolean = ScheduleEvaluator.cronMatchesDate(expression, new Date(minuteStart), ScheduleEvaluator.zone(props));
        return {
            scheduleType: 'Cron',
            fireAt: new Date(minuteStart).toISOString(),
            waitMs: 0,
            isDue: matches,
            cronExpression: expression
        };
    }

    /**
     * Run status for Scheduled Trigger props; gates manual Execute.
     *
     * @param {ScheduleProps} props - provide the schedule props.
     * @param {Date} [now] - provide the current time.
     * @returns {ScheduleRunStatus} Used to describe whether the run can start.
     * @private
     */
    public static getRunStatus(props: ScheduleProps, now: Date = new Date()): ScheduleRunStatus {
        const scheduleType: unknown = props.scheduleType || 'Once';
        const nowMs: number = now.getTime();

        if (scheduleType === 'Once') {
            if (props.startDateTime === undefined || props.startDateTime === null || props.startDateTime === '') {
                return { canRun: false, message: ScheduleEvaluator.t('scheduledTriggerMissingRunAt') };
            }
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                return { canRun: false, message: ScheduleEvaluator.t('scheduledTriggerInvalidRunAt') };
            }
            if (nowMs < start.getTime()) {
                return {
                    canRun: false,
                    message: ScheduleEvaluator.inline('scheduledTriggerNotDue', ScheduleEvaluator.formatLabel(start.getTime(), ScheduleEvaluator.zone(props)))
                };
            }
            return {
                canRun: true,
                message: ScheduleEvaluator.inline('scheduledTriggerDue', ScheduleEvaluator.formatLabel(start.getTime(), ScheduleEvaluator.zone(props)))
            };
        }

        if (scheduleType === 'Recurring') {
            const hasStart: boolean = props.startDateTime !== undefined && props.startDateTime !== null && props.startDateTime !== '';
            if (!hasStart) {
                return {
                    canRun: false,
                    message: ScheduleEvaluator.t('recurringNeedsStart')
                };
            }
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                return { canRun: false, message: ScheduleEvaluator.t('recurringInvalidStart') };
            }
            const startMs: number = start.getTime();
            const unit: ScheduleIntervalUnit = ScheduleEvaluator.tryUnit(props.intervalUnit) || 'Minutes';
            const intervalMs: number = ScheduleEvaluator.intervalToMs(props.interval, unit);
            if (intervalMs <= 0) {
                return { canRun: false, message: ScheduleEvaluator.t('recurringNeedsInterval') };
            }
            if (nowMs < startMs) {
                return {
                    canRun: false,
                    message: ScheduleEvaluator.inline('recurringNotStarted', ScheduleEvaluator.formatLabel(startMs, ScheduleEvaluator.zone(props)))
                };
            }
            const occurrence: number = Math.floor((nowMs - startMs) / intervalMs);
            const limit: { stopped: boolean; message?: string } =
                ScheduleEvaluator.recurringLimitStatus(props, occurrence, nowMs);
            if (limit.stopped) {
                return { canRun: false, message: limit.message || ScheduleEvaluator.t('recurringStopped') };
            }
            return {
                canRun: true,
                message: ScheduleEvaluator.inline('recurringActive', String(occurrence + 1))
            };
        }

        if (scheduleType === 'Cron') {
            if (!props.cronExpression) {
                return { canRun: false, message: ScheduleEvaluator.t('cronNeedsExpression') };
            }
            const end: Date | null = ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props));
            if (end && nowMs > end.getTime()) {
                return {
                    canRun: false,
                    message: ScheduleEvaluator.inline('cronEnded', ScheduleEvaluator.formatLabel(end.getTime(), ScheduleEvaluator.zone(props)))
                };
            }
            return {
                canRun: true,
                message: ScheduleEvaluator.inline('cronSimulation', String(props.cronExpression))
            };
        }

        return { canRun: false, message: ScheduleEvaluator.t('scheduleTypeInvalid') };
    }

    /**
     * Next scheduled occurrence; used by the 1-second auto-run watcher.
     *
     * @param {ScheduleProps} props - provide the schedule props.
     * @param {Date} [now] - provide the current time.
     * @returns {ScheduleOccurrence | null} Used to return the next occurrence or null.
     * @private
     */
    public static nextOccurrence(props: ScheduleProps, now: Date = new Date()): ScheduleOccurrence | null {
        const scheduleType: unknown = props.scheduleType || 'Once';
        const nowMs: number = now.getTime();

        if (scheduleType === 'Once') {
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                return null;
            }
            return {
                time: start.getTime(),
                key: start.toISOString(),
                label: ScheduleEvaluator.formatLabel(start.getTime(), ScheduleEvaluator.zone(props)),
                scheduleType: 'Once',
                occurrence: 0
            };
        }

        if (scheduleType === 'Recurring') {
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                return null;
            }
            const startMs: number = start.getTime();
            const unit: ScheduleIntervalUnit = ScheduleEvaluator.tryUnit(props.intervalUnit) || 'Minutes';
            const intervalMs: number = ScheduleEvaluator.intervalToMs(props.interval, unit);
            if (intervalMs <= 0 || !isFinite(startMs)) {
                return null;
            }
            const occurrence: number = nowMs <= startMs ? 0 : Math.floor((nowMs - startMs) / intervalMs);
            const limit: { stopped: boolean } = ScheduleEvaluator.recurringLimitStatus(props, occurrence, nowMs);
            if (limit.stopped) {
                return null;
            }
            const time: number = startMs + occurrence * intervalMs;
            return {
                time,
                key: String(occurrence),
                label: ScheduleEvaluator.formatLabel(time, ScheduleEvaluator.zone(props)),
                scheduleType: 'Recurring',
                occurrence
            };
        }

        if (scheduleType === 'Cron') {
            const expression: string = String(props.cronExpression || '').trim();
            if (!ScheduleEvaluator.isValidCronExpression(expression)) {
                return null;
            }
            const end: Date | null = ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props));
            // Include the current minute only when it has not already passed.
            let candidate: number = Math.floor(nowMs / 60000) * 60000;
            if (nowMs > candidate) {
                candidate += 60000;
            }
            return ScheduleEvaluator.findNextCronOccurrence(expression, candidate, end, ScheduleEvaluator.zone(props));
        }

        return null;
    }

    /**
     * Returns the first occurrence strictly after a completed run.
     * Existing Once and Recurring calculations are preserved.
     *
     * @param {ScheduleProps} props Schedule configuration.
     * @param {number} afterTime Completed-run timestamp in epoch milliseconds.
     * @returns {ScheduleOccurrence | null} Next future occurrence.
     */
    public static nextOccurrenceAfter(props: ScheduleProps, afterTime: number): ScheduleOccurrence | null {
        const scheduleType: unknown = props.scheduleType || 'Once';
        const afterMs: number = isFinite(afterTime) ? afterTime : Date.now();
        if (scheduleType === 'Recurring') {
            const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
            if (!start) {
                return null;
            }
            const unit: ScheduleIntervalUnit = ScheduleEvaluator.tryUnit(props.intervalUnit) || 'Minutes';
            const intervalMs: number = ScheduleEvaluator.intervalToMs(props.interval, unit);
            if (intervalMs <= 0) {
                return null;
            }
            const occurrence: number = afterMs < start.getTime()
                ? 0
                : Math.floor((afterMs - start.getTime()) / intervalMs) + 1;
            const time: number = start.getTime() + occurrence * intervalMs;
            if (ScheduleEvaluator.recurringLimitStatus(props, occurrence, time).stopped) {
                return null;
            }
            return { time, key: String(occurrence), label: ScheduleEvaluator.formatLabel(time, ScheduleEvaluator.zone(props)), scheduleType: 'Recurring', occurrence };
        }
        if (scheduleType === 'Cron') {
            const expression: string = String(props.cronExpression || '').trim();
            if (!ScheduleEvaluator.isValidCronExpression(expression)) {
                return null;
            }
            const firstFutureMinute: number = Math.floor(afterMs / 60000) * 60000 + 60000;
            return ScheduleEvaluator.findNextCronOccurrence(
                expression,
                firstFutureMinute,
                ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props)),
                ScheduleEvaluator.zone(props)
            );
        }
        return ScheduleEvaluator.nextOccurrence(props, new Date(afterMs + 1));
    }

    /**
     * De-dupe key for auto-fired runs.
     *
     * @param {string} stepId - provide the trigger step id.
     * @param {ScheduleProps} props - provide the schedule props.
     * @param {string} occurrenceKey - provide the occurrence key.
     * @returns {string} Used to build the de-dupe key.
     * @private
     */
    public static runKey(stepId: string, props: ScheduleProps, occurrenceKey: string): string {
        return [
            stepId || 'trigger',
            'ScheduledTrigger',
            String(props.scheduleType || ''),
            String(props.startDateTime || ''),
            String(props.interval || ''),
            String(props.intervalUnit || ''),
            String(props.endDateTime || ''),
            String(props.maxOccurrences || ''),
            String(props.cronExpression || ''),
            occurrenceKey || ''
        ].join(':');
    }

    /**
     * Collects validation issues for ScheduledTrigger props (cron syntax, dates, bounds).
     *
     * @param {ScheduleProps} props - provide the schedule props.
     * @returns {ScheduleValidationIssue[]} Used to return validation issues.
     * @private
     */
    public static validate(props: ScheduleProps): ScheduleValidationIssue[] {
        const issues: ScheduleValidationIssue[] = [];
        const scheduleType: unknown = props.scheduleType;
        if (scheduleType !== 'Once' && scheduleType !== 'Recurring' && scheduleType !== 'Cron') {
            if (scheduleType !== undefined && scheduleType !== null && scheduleType !== '') {
                issues.push({
                    code: 'SCHEDULE_TYPE',
                    message: ScheduleEvaluator.t('validationScheduleType'),
                    propertyPath: 'props.scheduleType'
                });
            }
            return issues;
        }

        if (props.timeZone !== undefined && props.timeZone !== null && String(props.timeZone).trim() !== ''
            && !ScheduleEvaluator.isValidTimeZone(ScheduleEvaluator.zone(props))) {
            issues.push({
                code: 'SCHEDULE_TIME_ZONE',
                message: ScheduleEvaluator.t('validationScheduleTimeZone'),
                propertyPath: 'props.timeZone'
            });
            return issues;
        }

        if (scheduleType === 'Once' || scheduleType === 'Recurring') {
            if (props.startDateTime !== undefined && props.startDateTime !== null && props.startDateTime !== '') {
                if (!ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props))) {
                    issues.push({
                        code: 'SCHEDULE_START',
                        message: ScheduleEvaluator.t('validationScheduleStartInvalid'),
                        propertyPath: 'props.startDateTime'
                    });
                }
            }
        }

        if (scheduleType === 'Recurring') {
            if (props.interval !== undefined && props.interval !== null && props.interval !== '') {
                const interval: number = Number(props.interval);
                if (!isFinite(interval) || interval <= 0) {
                    issues.push({
                        code: 'SCHEDULE_INTERVAL',
                        message: ScheduleEvaluator.t('validationScheduleInterval'),
                        propertyPath: 'props.interval'
                    });
                }
            }
            if (props.intervalUnit !== undefined && props.intervalUnit !== null && props.intervalUnit !== '') {
                const unit: string = String(props.intervalUnit);
                if (['Minutes', 'Hours', 'Days', 'Weeks'].indexOf(unit) === -1) {
                    issues.push({
                        code: 'SCHEDULE_INTERVAL_UNIT',
                        message: ScheduleEvaluator.t('validationScheduleIntervalUnit'),
                        propertyPath: 'props.intervalUnit'
                    });
                }
            }
            if (props.endDateTime !== undefined && props.endDateTime !== null && props.endDateTime !== '') {
                if (!ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props))) {
                    issues.push({
                        code: 'SCHEDULE_END',
                        message: ScheduleEvaluator.t('validationScheduleStartInvalid'),
                        propertyPath: 'props.endDateTime'
                    });
                } else {
                    const start: Date | null = ScheduleEvaluator.parseDate(props.startDateTime, ScheduleEvaluator.zone(props));
                    const end: Date | null = ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props));
                    if (start && end && end.getTime() < start.getTime()) {
                        issues.push({
                            code: 'SCHEDULE_END_BEFORE_START',
                            message: ScheduleEvaluator.t('validationScheduleEndBeforeStart'),
                            propertyPath: 'props.endDateTime'
                        });
                    }
                }
            }
            if (props.maxOccurrences !== undefined && props.maxOccurrences !== null && props.maxOccurrences !== '') {
                const max: number = Number(props.maxOccurrences);
                if (!isFinite(max) || max < 1 || Math.floor(max) !== max) {
                    issues.push({
                        code: 'SCHEDULE_MAX_OCCURRENCES',
                        message: ScheduleEvaluator.t('validationScheduleMaxOccurrences'),
                        propertyPath: 'props.maxOccurrences'
                    });
                }
            }
        }

        if (scheduleType === 'Cron') {
            if (props.cronExpression !== undefined && props.cronExpression !== null && props.cronExpression !== '') {
                if (!ScheduleEvaluator.isValidCronExpression(String(props.cronExpression))) {
                    issues.push({
                        code: 'CRON_INVALID',
                        message: ScheduleEvaluator.t('validationCronFields'),
                        propertyPath: 'props.cronExpression'
                    });
                }
            }
            if (props.endDateTime !== undefined && props.endDateTime !== null && props.endDateTime !== '') {
                if (!ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props))) {
                    issues.push({
                        code: 'SCHEDULE_END',
                        message: ScheduleEvaluator.t('validationScheduleStartInvalid'),
                        propertyPath: 'props.endDateTime'
                    });
                }
            }
        }

        return issues;
    }

    /**
     * Is Valid Cron Expression.
     *
     * @param {string} expression The expression.
     * @returns {boolean} The result.
     * @private
     */
    public static isValidCronExpression(expression: string): boolean {
        const trimmed: string = (expression || '').trim();
        if (!trimmed) {
            return false;
        }
        const parts: string[] = trimmed.split(/\s+/);
        if (parts.length !== 5) {
            return false;
        }
        const minute: string = parts[0];
        const hour: string = parts[1];
        const dayOfMonth: string = parts[2];
        const month: string = parts[3];
        const dayOfWeek: string = parts[4];

        if (!ScheduleEvaluator.isValidCronField(minute, 0, 59)) {
            return false;
        }
        if (!ScheduleEvaluator.isValidCronField(hour, 0, 23)) {
            return false;
        }
        if (!ScheduleEvaluator.isValidCronField(dayOfMonth, 1, 31)) {
            return false;
        }
        if (!ScheduleEvaluator.isValidCronField(month, 1, 12)) {
            return false;
        }
        if (!ScheduleEvaluator.isValidCronField(dayOfWeek, 0, 6)) {
            return false;
        }
        return true;
    }

    /**
     * Parses ISO, datetime-local (YYYY-MM-DDTHH:mm), and Date instances.
     * datetime-local values without Z are treated as local wall time.
     *
     * @param {unknown} value - provide the value to parse.
     * @param {string} timeZone - IANA time zone used for local wall time.
     * @returns {Date | null} Used to return a parsed Date or null.
     * @private
     */
    public static parseDate(value: unknown, timeZone?: string): Date | null {
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }
        if (value === undefined || value === null || value === '') {
            return null;
        }
        if (typeof value === 'number' && isFinite(value)) {
            const fromNumber: Date = new Date(value);
            return isNaN(fromNumber.getTime()) ? null : fromNumber;
        }
        const raw: string = String(value).trim();
        if (!raw) {
            return null;
        }
        const localParts: string[] = raw.split('T');
        if (localParts.length === 2) {
            const dateParts: string[] = localParts[0].split('-');
            const timeParts: string[] = localParts[1].split(':');
            if (dateParts.length === 3 && timeParts.length >= 2 && timeParts.length <= 3) {
                const year: number = Number(dateParts[0]);
                const month: number = Number(dateParts[1]);
                const day: number = Number(dateParts[2]);
                const hour: number = Number(timeParts[0]);
                const minute: number = Number(timeParts[1]);
                const second: number = timeParts[2] !== undefined ? Number(timeParts[2]) : 0;
                if (
                    isFinite(year) && isFinite(month) && isFinite(day) &&
                    isFinite(hour) && isFinite(minute) && isFinite(second)
                ) {
                    // A date without an offset is a wall-clock time in the schedule's time zone.
                    const wall: number = Date.UTC(year, month - 1, day, hour, minute, second, 0);
                    if (isFinite(wall)) {
                        return new Date(ScheduleEvaluator.wallTimeToEpoch(wall, timeZone || 'UTC'));
                    }
                }
            }
        }
        const parsed: Date = new Date(raw);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    /**
     * Converts a recurring interval to milliseconds.
     *
     * @param {unknown} value - provide the interval value.
     * @param {string} unit - provide the interval unit.
     * @returns {number} Used to return the interval in milliseconds.
     * @private
     */
    public static intervalToMs(value: unknown, unit: string): number {
        const amount: number = Number(value || 0);
        if (!isFinite(amount) || amount <= 0) {
            return 0;
        }
        switch (unit) {
        case 'Minutes': return amount * 60000;
        case 'Hours': return amount * 3600000;
        case 'Days': return amount * 86400000;
        case 'Weeks': return amount * 604800000;
        default: return amount * 60000;
        }
    }

    /**
     * Cron Matches Date.
     *
     * @param {string} expression The expression.
     * @param {Date} date The date.
     * @param {string} timeZone The IANA time zone.
     * @returns {boolean} The result.
     * @private
     */
    public static cronMatchesDate(expression: string, date: Date, timeZone: string = 'UTC'): boolean {
        const rules: CronRules | null = ScheduleEvaluator.parseCron(expression);
        if (!rules) {
            return false;
        }
        const wall: Date = new Date(date.getTime() + ScheduleEvaluator.offsetMs(timeZone, date.getTime()));
        return ScheduleEvaluator.dayMatches(rules, wall) && ScheduleEvaluator.timeMatches(rules, wall);
    }

    private static parseCron(expression: string): CronRules | null {
        const parts: string[] = String(expression || '').trim().split(/\s+/);
        if (parts.length !== 5) {
            return null;
        }
        return {
            minute: ScheduleEvaluator.parseCronField(parts[0], 0, 59),
            hour: ScheduleEvaluator.parseCronField(parts[1], 0, 23),
            day: ScheduleEvaluator.parseCronField(parts[2], 1, 31),
            month: ScheduleEvaluator.parseCronField(parts[3], 1, 12),
            weekday: ScheduleEvaluator.parseCronField(parts[4], 0, 6)
        };
    }

    /**
     * Checks whether the cron day fields match a wall-clock date.
     *
     * @param {CronRules} rules The parsed cron rules.
     * @param {Date} wall The wall-clock time represented in UTC fields.
     * @returns {boolean} Whether the day fields match.
     * @private
     */
    private static dayMatches(rules: CronRules, wall: Date): boolean {
        const ok: (rule: { any: boolean; values: Set<number> }, value: number) => boolean =
            (rule: { any: boolean; values: Set<number> }, value: number): boolean => rule.any || rule.values.has(value);
        return ok(rules.day, wall.getUTCDate()) && ok(rules.month, wall.getUTCMonth() + 1) && ok(rules.weekday, wall.getUTCDay());
    }

    private static timeMatches(rules: CronRules, wall: Date): boolean {
        return (rules.minute.any || rules.minute.values.has(wall.getUTCMinutes()))
            && (rules.hour.any || rules.hour.values.has(wall.getUTCHours()));
    }

    /**
     * The schedule's time zone, `'UTC'` when not set.
     *
     * @param {ScheduleProps} props - The schedule props.
     * @returns {string} The IANA time zone.
     * @private
     */
    public static zone(props: ScheduleProps): string {
        const value: string = props && props.timeZone !== undefined && props.timeZone !== null ? String(props.timeZone).trim() : '';
        return value || 'UTC';
    }

    /**
     * Whether a time zone name is understood by the browser.
     *
     * @param {string} timeZone - The IANA time zone.
     * @returns {boolean} `true` when valid.
     * @private
     */
    public static isValidTimeZone(timeZone: string): boolean {
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timeZone }).format(0);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Formats an occurrence for the execution log, in the schedule's time zone.
     *
     * @param {number} epoch - The occurrence time.
     * @param {string} timeZone - The IANA time zone.
     * @returns {string} The label.
     * @private
     */
    public static formatLabel(epoch: number, timeZone: string): string {
        return ScheduleEvaluator.formatLabelImpl(epoch, timeZone);
    }

    /**
     * Whether a value is a date and time without an offset, such as `2026-03-01T09:00` or
     * `2026-03-01T09:00:30.5`.
     *
     * @param {string} value - The value.
     * @returns {boolean} `true` for a wall-clock time.
     * @private
     */
    private static isWallTime(value: string): boolean {
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
            return false;
        }
        const rest: string = value.substring(16);
        return rest === '' || /^:\d{2}$/.test(rest) || /^:\d{2}\.\d+$/.test(rest);
    }

    /**
     * Converts a stored schedule date to the wall-clock time it stands for in a time zone, as
     * `YYYY-MM-DDTHH:mm`. A value without an offset is already a wall-clock time and is returned as
     * it is; a value with an offset (or a `Date`) is converted.
     *
     * @param {unknown} value - The stored value.
     * @param {string} timeZone - The IANA time zone.
     * @returns {string} The wall-clock time, or an empty string for an empty or invalid value.
     * @private
     */
    public static toWallTime(value: unknown, timeZone: string): string {
        if (value === undefined || value === null || value === '') {
            return '';
        }
        if (typeof value === 'string' && ScheduleEvaluator.isWallTime(value.trim())) {
            return value.trim().substring(0, 16);
        }
        const date: Date | null = ScheduleEvaluator.parseDate(value, timeZone);
        if (!date) {
            return '';
        }
        const wall: Date = new Date(date.getTime() + ScheduleEvaluator.offsetMs(timeZone || 'UTC', date.getTime()));
        return wall.toISOString().substring(0, 16);
    }

    private static formatLabelImpl(epoch: number, timeZone: string): string {
        try {
            return new Date(epoch).toLocaleString(undefined, { timeZone: timeZone }) + ' (' + timeZone + ')';
        } catch {
            return new Date(epoch).toISOString();
        }
    }

    private static formatters: { [zone: string]: Intl.DateTimeFormat } = {};

    /**
     * Offset of a time zone from UTC at an instant, in milliseconds (wall clock minus UTC).
     *
     * @param {string} timeZone - The IANA time zone.
     * @param {number} epoch - The instant.
     * @returns {number} The offset.
     */
    private static offsetMs(timeZone: string, epoch: number): number {
        if (!timeZone || timeZone === 'UTC') {
            return 0;
        }
        let format: Intl.DateTimeFormat = ScheduleEvaluator.formatters[`${timeZone}`];
        if (!format) {
            try {
                format = new Intl.DateTimeFormat('en-US', {
                    timeZone: timeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
            } catch {
                return 0;
            }
            ScheduleEvaluator.formatters[`${timeZone}`] = format;
        }
        // en-US with 2-digit fields formats as "MM/DD/YYYY, HH:mm:ss". format() is used rather than
        // formatToParts(), which is missing from the ES2015 lib the package compiles against.
        const digits: number[] = (format.format(new Date(epoch)).match(/\d+/g) || []).map(Number);
        if (digits.length < 6) {
            return 0;
        }
        const wall: number = Date.UTC(digits[2], digits[0] - 1, digits[1], digits[3] % 24, digits[4], digits[5]);
        return wall - Math.floor(epoch / 1000) * 1000;
    }

    /**
     * Converts a wall-clock time (held in UTC fields) in a time zone to an instant.
     *
     * @param {number} wall - The wall-clock time as a UTC epoch.
     * @param {string} timeZone - The IANA time zone.
     * @returns {number} The instant.
     */
    private static wallTimeToEpoch(wall: number, timeZone: string): number {
        // Try the offsets in force half a day either side. A time that occurs twice (clocks going
        // back) takes the earlier occurrence; a time that doesn't exist (clocks going forward) moves
        // forward by the size of the jump.
        const day: number = 12 * 60 * 60 * 1000;
        const before: number = ScheduleEvaluator.offsetMs(timeZone, wall - day);
        const after: number = ScheduleEvaluator.offsetMs(timeZone, wall + day);
        const valid: number[] = [wall - before, wall - after].filter((instant: number) =>
            wall - ScheduleEvaluator.offsetMs(timeZone, instant) === instant);
        return valid.length ? Math.min.apply(null, valid) : wall - before;
    }

    private static findNextCronOccurrence(
        expression: string,
        startMinute: number,
        end: Date | null,
        timeZone: string = 'UTC'
    ): ScheduleOccurrence | null {
        const rules: CronRules | null = ScheduleEvaluator.parseCron(expression);
        if (!rules) {
            return null;
        }
        let candidate: number = startMinute;
        // Five years safely covers normal five-field cron schedules without an unbounded loop.
        const searchEnd: number = candidate + 5 * 366 * 24 * 60 * 60000;
        let offset: number = ScheduleEvaluator.offsetMs(timeZone, candidate);
        let offsetCheckedAt: number = candidate;
        while (candidate <= searchEnd) {
            if (end && candidate > end.getTime()) {
                return null;
            }
            // Time-zone offsets change at most on the hour; refresh hourly instead of per minute.
            if (candidate - offsetCheckedAt >= 3600000) {
                offset = ScheduleEvaluator.offsetMs(timeZone, candidate);
                offsetCheckedAt = candidate;
            }
            const wall: Date = new Date(candidate + offset);
            if (!ScheduleEvaluator.dayMatches(rules, wall)) {
                // Skip to the next wall-clock midnight instead of testing every minute of the day.
                const minutesLeft: number = 24 * 60 - (wall.getUTCHours() * 60 + wall.getUTCMinutes());
                candidate += minutesLeft * 60000;
                continue;
            }
            if (ScheduleEvaluator.timeMatches(rules, wall)) {
                return {
                    time: candidate,
                    key: new Date(candidate).toISOString(),
                    label: ScheduleEvaluator.formatLabel(candidate, timeZone),
                    scheduleType: 'Cron'
                };
            }
            candidate += 60000;
        }
        return null;
    }

    private static recurringLimitStatus(
        props: ScheduleProps,
        occurrence: number,
        nowMs: number
    ): { stopped: boolean; message?: string } {
        const end: Date | null = ScheduleEvaluator.parseDate(props.endDateTime, ScheduleEvaluator.zone(props));
        if (end && nowMs > end.getTime()) {
            return {
                stopped: true,
                message: ScheduleEvaluator.inline('recurringEndedAt', ScheduleEvaluator.formatLabel(end.getTime(), ScheduleEvaluator.zone(props)))
            };
        }
        const max: number = Number(props.maxOccurrences || 0);
        if (max > 0 && occurrence >= max) {
            return {
                stopped: true,
                message: ScheduleEvaluator.inline('recurringMaxReached', String(max))
            };
        }
        return { stopped: false };
    }

    private static parseCronField(part: string, min: number, max: number): { any: boolean; values: Set<number> } {
        if (part === '*') {
            return { any: true, values: new Set<number>() };
        }
        const values: Set<number> = new Set<number>();
        String(part || '').split(',').forEach((tokenRaw: string) => {
            const token: string = tokenRaw.trim();
            if (!token) {
                return;
            }
            if (token.indexOf('*/') === 0) {
                const step: number = Number(token.slice(2));
                if (step > 0) {
                    for (let i: number = min; i <= max; i += step) {
                        values.add(i);
                    }
                }
                return;
            }
            if (token.indexOf('-') >= 0) {
                const bits: string[] = token.split('-');
                const a: number = Number(bits[0]);
                const b: number = Number(bits[1]);
                if (isFinite(a) && isFinite(b)) {
                    const from: number = Math.max(min, a);
                    const to: number = Math.min(max, b);
                    for (let i: number = from; i <= to; i++) {
                        values.add(i);
                    }
                }
                return;
            }
            let n: number = Number(token);
            if (isFinite(n)) {
                if (n === 7 && max === 6) {
                    n = 0;
                }
                values.add(n);
            }
        });
        return { any: false, values };
    }

    private static isValidCronField(field: string, min: number, max: number): boolean {
        if (!field) {
            return false;
        }
        if (field === '*') {
            return true;
        }
        const segments: string[] = field.split(',');
        for (const segment of segments) {
            if (segment.indexOf('*/') === 0) {
                const step: number = Number(segment.slice(2));
                if (!isFinite(step) || step < 1 || Math.floor(step) !== step) {
                    return false;
                }
                continue;
            }
            const stepParts: string[] = segment.split('/');
            if (stepParts.length > 2) {
                return false;
            }
            const rangePart: string = stepParts[0];
            if (stepParts.length === 2) {
                const step: number = Number(stepParts[1]);
                if (!isFinite(step) || step < 1 || Math.floor(step) !== step) {
                    return false;
                }
            }
            if (rangePart === '*') {
                continue;
            }
            const rangeBits: string[] = rangePart.split('-');
            if (rangeBits.length > 2) {
                return false;
            }
            const start: number = Number(rangeBits[0]);
            const end: number = rangeBits.length === 2 ? Number(rangeBits[1]) : start;
            if (!isFinite(start) || !isFinite(end) || Math.floor(start) !== start || Math.floor(end) !== end) {
                return false;
            }
            if (start < min || end > max || start > end) {
                // Allow weekday 7 as Sunday alias.
                if (!(max === 6 && start === 7 && end === 7)) {
                    return false;
                }
            }
        }
        return true;
    }

    private static normalizeType(value: unknown): ScheduleType {
        if (value === 'Once') {
            return 'Once';
        }
        if (value === 'Recurring') {
            return 'Recurring';
        }
        if (value === 'Cron') {
            return 'Cron';
        }
        throw ScheduleEvaluator.validationError('SCHEDULE_TYPE', 'scheduleType must be Once, Recurring, or Cron.');
    }

    private static normalizeUnit(value: unknown): ScheduleIntervalUnit {
        const unit: ScheduleIntervalUnit | null = ScheduleEvaluator.tryUnit(value);
        if (unit) {
            return unit;
        }
        throw ScheduleEvaluator.validationError(
            'SCHEDULE_INTERVAL_UNIT',
            'Recurring schedules require intervalUnit (Minutes, Hours, Days, or Weeks).'
        );
    }

    private static tryUnit(value: unknown): ScheduleIntervalUnit | null {
        const unit: string = String(value || '');
        if (unit === 'Minutes' || unit === 'Hours' || unit === 'Days' || unit === 'Weeks') {
            return unit;
        }
        return null;
    }

    private static readPositiveInt(value: unknown): number | undefined {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        const n: number = Number(value);
        if (!isFinite(n) || n < 1 || Math.floor(n) !== n) {
            return undefined;
        }
        return n;
    }

    /**
     * Creates a standard validation error object.
     *
     * @param {string} code - provide the validation code.
     * @param {string} message - provide the error message.
     * @returns {Error} Used to return a validation error.
     */
    private static validationError(code: string, message: string): Error {
        const error: Error & { type?: string; code?: string } = new Error(message);
        error.type = 'Validation';
        error.code = code;
        return error;
    }
}

