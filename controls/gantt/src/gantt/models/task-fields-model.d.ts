import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class TaskFields
 */
export interface TaskFieldsModel {

    /**
     * To map id of task from data source.
     *
     * @default null
     */
    id?: string;

    /**
     * To map name of task from data source.
     *
     * @default null
     */
    name?: string;

    /**
     * To map parent id of task from data source.
     *
     * @default null
     */
    parentID?: string;

    /**
     * Gets or sets a field name of data object in data source that specifies whether the current record has child records.
     *
     * @default null
     */
    hasChildMapping?: string;

    /**
     * To map start date of task from data source.
     *
     * @default null
     */
    startDate?: string;

    /**
     * To map end date of task from data source.
     *
     * @default null
     */
    endDate?: string;

    /**
     * To map dependency of task from data source.
     *
     * @default null
     */
    dependency?: string;

    /**
     * To map progress of task from data source.
     *
     * @default null
     */
    progress?: string;

    /**
     * To map child of task from data source.
     *
     * @default null
     */
    child?: string;

    /**
     * To map milestone of task from data source.
     *
     * @default null
     */
    milestone?: string;

    /**
     * To map duration of task from data source.
     *
     * @default null
     */
    duration?: string;

    /**
     * To map duration unit of task from data source.
     *
     */
    durationUnit?: string;

    /**
     * To map custom css class of task from data source.
     *
     */
    cssClass?: string;

    /**
     * To map baseline start date of task from data source.
     *
     */
    baselineStartDate?: string;

    /**
     * To map baseline end date of task from data source.
     *
     */
    baselineEndDate?: string;

    /**
     * To map baseline duration of task from data source.
     *
     */
    baselineDuration?: string;

    /**
     * To map assigned resources of task from data source.
     *
     */
    resourceInfo?: string;

    /**
     * To map expand status of parent record from data source.
     *
     */
    expandState?: string;

    /**
     * To map indicators of task from data source.
     *
     * @default null
     */
    indicators?: string;

    /**
     * To map notes value of task from data source.
     *
     * @default null
     */
    notes?: string;

    /**
     * To map work of task from data source.
     *
     * @default null
     */
    work?: string;

    /**
     * To map schedule mode of task from data source.
     *
     * @default null
     */
    manual?: string;

    /**
     * To map taskType value of task from data source.
     *
     * @default null
     */
    type?: string;

    /**
     * To map segments details of a task from data source.
     *
     * @default null
     */
    segments?: string;

    /**
     * To map segment id details of a task from data source.
     *
     * @default null
     */
    segmentId?: string;

    /**
     * Maps the constraint type value from the data source for each task.
     * This property determines how and when a task should be scheduled based on the defined constraint rule.
     *
     * The value can be provided either as a number (e.g., `constraintType: 0`) or a stringified number (e.g., `constraintType: "0"`),
     * and it is used to assign the appropriate constraint type for the task.
     *
     * Refer to the [`ConstraintType`](./constrainttype) enumeration for the list of supported constraint types.
     *
     * @default null
     */
    constraintType?: string;

    /**
     * Maps the constraint date value from the data source for each task.
     *
     * This date is used along with the `constraintType` mapping to control how the task is scheduled.
     * The date value can be a valid `Date` object or a date string.
     *
     * @default null
     */
    constraintDate?: string;

    /**
     * Maps the calendar field from the data source to assign custom calendars to tasks.
     *
     * This property allows each task to reference a specific calendar by its ID, enabling support for non-working days,
     * holidays, and custom working time configurations per task.
     *
     * @default null
     */
    calendarId?: string;

}