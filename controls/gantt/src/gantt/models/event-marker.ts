import { Property, ChildProperty } from '@syncfusion/ej2-base';
/**
 * Defines event marker collection in Gantt.
 */
export class EventMarker extends ChildProperty<EventMarker> {
    /**
     * Specifies the date or day of the event marker.
     * The value can be a `Date` object or a date string.
     *
     * @default null
     */
    @Property(null)
    public day: Date | string;
    /**
     * Specifies the label for the event marker.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies a custom CSS class for the event marker.
     * This can be used to apply custom styles to the line and label of the marker.
     *
     * @default null
     */
    @Property(null)
    public cssClass: string;
    /**
     * Vertical offset of the label from the timeline top.
     * Must be in pixels (e.g., '50px'). Invalid values default to '50px'.
     * Negative values are normalized to '50px'.
     * @default '50px'
     */
    @Property('50px')
    public top: string;
}
