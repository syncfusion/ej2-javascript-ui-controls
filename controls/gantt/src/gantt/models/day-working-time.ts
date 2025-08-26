import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines the working time of the day in the project.
 */

export class DayWorkingTime extends ChildProperty<DayWorkingTime> {
    /**
     * Defines the start time of the working time range for the day.
     *
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Defines the end time of the working time range for the day.
     *
     * @default null
     */
    @Property(null)
    public to: number;
}
