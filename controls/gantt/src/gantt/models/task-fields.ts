import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines mapping property to get task details from data source.
 */
export class TaskFields extends ChildProperty<TaskFields> {
    /**
     * To map id of task from data source.
     *
     * @default null
     */
    @Property(null)
    public id: string;

    /**
     * To map name of task from data source.
     *
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * To map parent id of task from data source.
     *
     * @default null
     */
    @Property(null)
    public parentID: string;

    /**
     * Gets or sets a field name of data object in data source that specifies whether the current record has child records.
     *
     * @default null
     */
    @Property(null)
    public hasChildMapping: string;

    /**
     * To map start date of task from data source.
     *
     * @default null
     */
    @Property(null)
    public startDate: string;
    /**
     * To map end date of task from data source.
     *
     * @default null
     */
    @Property(null)
    public endDate: string;

    /**
     * To map dependency of task from data source.
     *
     * @default null
     */
    @Property(null)
    public dependency: string;

    /**
     * To map progress of task from data source.
     *
     * @default null
     */
    @Property(null)
    public progress: string;

    /**
     * To map child of task from data source.
     *
     * @default null
     */
    @Property(null)
    public child: string;

    /**
     * To map milestone of task from data source.
     *
     * @default null
     */
    @Property(null)
    public milestone: string;

    /**
     * To map duration of task from data source.
     *
     * @default null
     */
    @Property(null)
    public duration: string;

    /**
     * To map duration unit of task from data source.
     *
     */
    @Property(null)
    public durationUnit: string;
    /**
     * To map custom css class of task from data source.
     *
     */
    @Property(null)
    public cssClass: string;
    /**
     * To map baseline start date of task from data source.
     *
     */
    @Property(null)
    public baselineStartDate: string;
    /**
     * To map baseline end date of task from data source.
     *
     */
    @Property(null)
    public baselineEndDate: string;
    /**
     * To map baseline duration of task from data source.
     *
     */
    @Property(null)
    public baselineDuration: string;
    /**
     * To map assigned resources of task from data source.
     *
     */
    @Property(null)
    public resourceInfo: string;
    /**
     * To map expand status of parent record from data source.
     *
     */
    @Property(null)
    public expandState: string;
    /**
     * To map indicators of task from data source.
     *
     * @default null
     */
    @Property(null)
    public indicators: string;
    /**
     * To map notes value of task from data source.
     *
     * @default null
     */
    @Property(null)
    public notes: string;
    /**
     * To map work of task from data source.
     *
     * @default null
     */
    @Property(null)
    public work: string;
    /**
     * To map schedule mode of task from data source.
     *
     * @default null
     */
    @Property(null)
    public manual: string;
    /**
     * To map taskType value of task from data source.
     *
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * To map segments details of a task from data source.
     *
     * @default null
     */
    @Property(null)
    public segments: string;
    /**
     * To map segment id details of a task from data source.
     *
     * @default null
     */
    @Property(null)
    public segmentId: string;
    /**
     * Maps the constraint type value from the data source for each task.
     * This property determines how and when a task should be scheduled based on the defined constraint rule.
     *
     * The value can be provided either as a number (e.g., `constraintType: 0`) or a stringified number (e.g., `constraintType: "0"`),
     * and it is used to assign the appropriate constraint type for the task.
     *
     * Refer to the [`ConstraintType`](../constraintType) enumeration for the list of supported constraint types.
     *
     * @default null
     */
    @Property(null)
    public constraintType: string;
    /**
     * Maps the constraint date value from the data source for each task.
     *
     * This date is used along with the `constraintType` mapping to control how the task is scheduled.
     * The date value can be a valid `Date` object or a date string.
     *
     * @default null
     */
    @Property(null)
    public constraintDate: string;
}
