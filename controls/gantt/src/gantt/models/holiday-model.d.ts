import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Holiday
 */
export interface HolidayModel {

    /**
     * Specifies the start date of the holiday.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    from?: Date | string;

    /**
     * Specifies the end date of the holiday.
     *
     * Accepts a `Date` object or ISO-formatted string.
     * If omitted, the holiday is treated as a single-day event.
     *
     * @default null
     */
    to?: Date | string;

    /**
     * Defines a label or description for the holiday.
     *
     * Useful for tooltips, annotations, and export metadata.
     *
     * @default null
     */
    label?: string;

    /**
     * Defines a custom CSS class for styling the holiday marker and label.
     *
     * Use this to apply custom background, borders, or font styles.
     *
     * @default null
     */
    cssClass?: string;

}