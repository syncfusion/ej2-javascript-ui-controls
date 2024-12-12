import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class EventMarker
 */
export interface EventMarkerModel {

    /**
     * Specifies the date or day of the event marker.
     * The value can be a `Date` object or a date string.
     *
     * @default null
     */
    day?: Date | string;

    /**
     * Specifies the label for the event marker.
     *
     * @default null
     */
    label?: string;

    /**
     * Specifies a custom CSS class for the event marker.
     * This can be used to apply custom styles to the line and label of the marker.
     *
     * @default null
     */
    cssClass?: string;

}