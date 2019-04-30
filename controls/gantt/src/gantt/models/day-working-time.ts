/**
 * Defines working time of day in project
 */

import { Property, ChildProperty } from '@syncfusion/ej2-base';

export class DayWorkingTime extends ChildProperty<DayWorkingTime> {
    /**
     * Defines start time of working time range
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Defines end time of working time range
     */
    @Property(null)
    public to: number;
}