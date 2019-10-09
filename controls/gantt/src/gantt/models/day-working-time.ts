import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines working time of day in project.
 */

export class DayWorkingTime extends ChildProperty<DayWorkingTime> {
    /**
     * Defines start time of working time range.
     * @default null
     * @blazorType double?
     * @blazorDefaultValue null
     */
    @Property(null)
    public from: number;
    /**
     * Defines end time of working time range.
     * @default null
     * @blazorType double?
     * @blazorDefaultValue null
     */
    @Property(null)
    public to: number;
}