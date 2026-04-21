import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Represents a calendar exception that overrides default working time or marks non-working periods.
 *
 * Used to define one-off or recurring deviations from the standard calendar, such as holidays, adjusted work hours, or blackout dates.
 */
export class CalendarException extends ChildProperty<CalendarException> {
    /**
     * Specifies the start date of the calendar exception.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    @Property(null)
    public from: Date | string;
    /**
     * Specifies the end date of the calendar exception.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    @Property(null)
    public to: Date | string;
    /**
     * Defines a label or description for the exception.
     *
     * Useful for display purposes or export annotations (e.g., "Diwali Break", "Maintenance Window").
     *
     * @default null
     */
    @Property(null)
    public label: string;
}
