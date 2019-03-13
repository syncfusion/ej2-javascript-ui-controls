import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class TaskFields
 */
export interface TaskFieldsModel {

    /**
     * Defines mapping property to get task id value from data source.
     * @default null
     */
    id?: string;

    /**
     * Defines mapping property to get task name value from data source.
     * @default null     
     */
    name?: string;

    /**
     * Defines mapping property to get task's parent id value from data source.
     * @default null     
     */
    parentId?: string;

    /**
     * Defines mapping property to get task name value from data source.
     * @default null      
     */
    startDate?: string;

    /**
     * Define end date mapping in Gantt
     * @default null     
     */
    endDate?: string;

    /**
     * Define taskDependency mapping in Gantt
     * @default null
     */
    dependency?: string;

    /**
     * Define progress mapping in Gantt
     * @default null
     */
    progress?: string;

    /**
     * Define child mapping in Gantt
     * @default null
     */
    child?: string;

    /**
     * Define Milestone mapping in Gantt
     * @default null
     */
    milestone?: string;

    /**
     * Define Milestone mapping in Gantt
     * @default null
     */
    duration?: string;

    /**
     * To map duration unit of task
     */
    durationUnit?: string;

    /**
     * To map custom css class of task
     */
    cssClass?: string;

    /**
     * To map baseline start date of task
     */
    baselineStartDate?: string;

    /**
     * To map baseline end date of task
     */
    baselineEndDate?: string;

    /**
     * To map assigned resources of task
     */
    resourceInfo?: string;

    /**
     * To map expand status of parent record
     */
    expandState?: string;

    /**
     * Define the Indicators of Gantt
     * @default null      
     */
    indicators?: string;

    /**
     * To map note of task
     * @default null
     */
    notes?: string;

}