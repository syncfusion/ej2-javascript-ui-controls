import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class DayWorkingTime
 */
export interface DayWorkingTimeModel {

    /**
     * Defines the start time of the working time range for the day.
     *
     * @default null
     */
    from?: number;

    /**
     * Defines the end time of the working time range for the day.
     *
     * @default null
     */
    to?: number;

}