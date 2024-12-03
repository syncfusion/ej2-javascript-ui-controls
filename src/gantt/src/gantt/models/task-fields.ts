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
     * To map taskType value of task from data source
     *
     * @default null
     */
    @Property(null)
    public type: string;
    /**
     * To map segments details of a task from data source
     *
     * @default null
     */
    @Property(null)
    public segments: string;
    /**
     * To map segment id details of a task from data source
     *
     * @default null
     */
    @Property(null)
    public segmentId: string;
}
