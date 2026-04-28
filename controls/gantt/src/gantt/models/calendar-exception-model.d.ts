import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';

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

}