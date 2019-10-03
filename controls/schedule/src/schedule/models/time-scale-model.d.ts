import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class TimeScale
 */
export interface TimeScaleModel {

    /**
     * When set to `true`, allows the schedule to display the appointments accurately against the exact time duration.
     *  If set to `false`, all the appointments of a day will be displayed one below the other.

     */
    enable?: boolean;

    /**
     * Defines the time duration on which the time axis to be displayed either in 1 hour or 30 minutes interval and so on.
     *  It accepts the values in minutes.

     */
    interval?: number;

    /**
     * Decides the number of slot count to be split for the specified time interval duration.  

     */
    slotCount?: number;

    /**
     * The template option to be applied for minor time slot. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed
     *  onto the time cells. The time details can be accessed within this template. 

     */
    minorSlotTemplate?: string;

    /**
     * The template option to be applied for major time slot. Here, the
     *  template accepts either the string or HTMLElement as template design and then the parsed design is displayed
     *  onto the time cells. The time details can be accessed within this template.

     */
    majorSlotTemplate?: string;

}