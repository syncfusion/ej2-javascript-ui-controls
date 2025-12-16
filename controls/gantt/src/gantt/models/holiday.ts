import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Defines a holiday in the project calendar.
 *
 * Holidays are treated as non-working days and visually highlighted in the Gantt chart.
 * You can customize their appearance using label, color, icon, and CSS class.
 */
export class Holiday extends ChildProperty<Holiday> {
    /**
     * Specifies the start date of the holiday.
     *
     * Accepts a `Date` object or ISO-formatted string.
     *
     * @default null
     */
    @Property(null)
    public from: Date | string;
    /**
     * Specifies the end date of the holiday.
     *
     * Accepts a `Date` object or ISO-formatted string.
     * If omitted, the holiday is treated as a single-day event.
     *
     * @default null
     */
    @Property(null)
    public to: Date | string;
    /**
     * Defines a label or description for the holiday.
     *
     * Useful for tooltips, annotations, and export metadata.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Defines a custom CSS class for styling the holiday marker and label.
     *
     * Use this to apply custom background, borders, or font styles.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
}
