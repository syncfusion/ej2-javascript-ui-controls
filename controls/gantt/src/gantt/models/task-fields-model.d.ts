import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class TaskFields
 */
export interface TaskFieldsModel {

    /**
     * To map id of task from data source.
     * @default null
     */
    id?: string;

    /**
     * To map name of task from data source.
     * @default null     
     */
    name?: string;

    /**
     * To map parent id of task from data source.
     * @default null     
     */
    parentID?: string;

    /**
     * To map start date of task from data source.
     * @default null      
     */
    startDate?: string;

    /**
     * To map end date of task from data source.
     * @default null     
     */
    endDate?: string;

    /**
     * To map dependency of task from data source.
     * @default null
     */
    dependency?: string;

    /**
     * To map progress of task from data source.
     * @default null
     */
    progress?: string;

    /**
     * To map child of task from data source.
     * @default null
     */
    child?: string;

    /**
     * To map milestone of task from data source.
     * @default null
     */
    milestone?: string;

    /**
     * To map duration of task from data source.
     * @default null
     */
    duration?: string;

    /**
     * To map duration unit of task from data source.
     */
    durationUnit?: string;

    /**
     * To map custom css class of task from data source.
     */
    cssClass?: string;

    /**
     * To map baseline start date of task from data source.
     */
    baselineStartDate?: string;

    /**
     * To map baseline end date of task from data source.
     */
    baselineEndDate?: string;

    /**
     * To map assigned resources of task from data source.
     */
    resourceInfo?: string;

    /**
     * To map expand status of parent record from data source.
     */
    expandState?: string;

    /**
     * To map indicators of task from data source.
     * @default null      
     */
    indicators?: string;

    /**
     * To map notes value of task from data source.
     * @default null
     */
    notes?: string;

}