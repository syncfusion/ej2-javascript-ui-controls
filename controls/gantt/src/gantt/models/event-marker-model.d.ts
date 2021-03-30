import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class EventMarker
 */
export interface EventMarkerModel {

    /**
     * Defines day of event marker.
     *
     * @default null
     */
    day?: Date | string;

    /**
     * Defines label of event marker.
     *
     * @default null
     */
    label?: string;

    /**
     * Define custom css class for event marker to customize line and label.
     *
     * @default null
     */
    cssClass?: string;

}