import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';import { DayWorkingTimeModel } from './day-working-time-model';import { DayWorkingTime } from '../models/day-working-time';

/**
 * Interface for a class CalendarException
 */
export interface CalendarExceptionModel {

    /**
     * Specifies the start date of the calendar exception.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    from?: Date | string;

    /**
     * Specifies the end date of the calendar exception.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    to?: Date | string;

    /**
     * Defines a label or description for the exception.
     *
     * Useful for display purposes or export annotations (e.g., "Diwali Break", "Maintenance Window").
     *
     * @default null
     */
    label?: string;

    /**
     * Overrides the default working time for the specified date range.
     *
     * If defined, this replaces the standard working hours with custom time blocks (e.g., extended shifts or partial workdays).
     *
     * @default []
     */
    exceptionWorkingTime?: DayWorkingTimeModel[];

}