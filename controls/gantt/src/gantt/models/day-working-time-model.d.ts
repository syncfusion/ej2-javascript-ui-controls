import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class DayWorkingTime
 */
export interface DayWorkingTimeModel {

    /**
     * Defines start time of working time range.
     *
     * @default null
     * @blazorType double?
     * @blazorDefaultValue null
     */
    from?: number;

    /**
     * Defines end time of working time range.
     *
     * @default null
     * @blazorType double?
     * @blazorDefaultValue null
     */
    to?: number;

}