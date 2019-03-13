/**
 * Defines mapping property to get task details from data source
 */

import { Property, ChildProperty } from '@syncfusion/ej2-base';

export class TaskFields extends ChildProperty<TaskFields> {
    /**
     * Defines mapping property to get task id value from data source.
     * @default null
     */
    @Property(null)
    public id: string;

    /** 
     * Defines mapping property to get task name value from data source.
     * @default null     
     */
    @Property(null)
    public name: string;

    /**
     * Defines mapping property to get task's parent id value from data source.
     * @default null     
     */
    @Property(null)
    public parentId: string;

    /** 
     * Defines mapping property to get task name value from data source.
     * @default null      
     */
    @Property(null)
    public startDate: string;
    /**
     * Define end date mapping in Gantt
     * @default null     
     */
    @Property(null)
    public endDate: string;

    /**
     * Define taskDependency mapping in Gantt
     * @default null
     */
    @Property(null)
    public dependency: string;

    /**
     * Define progress mapping in Gantt
     * @default null
     */
    @Property(null)
    public progress: string;

    /**
     * Define child mapping in Gantt
     * @default null
     */
    @Property(null)
    public child: string;

    /**
     * Define Milestone mapping in Gantt
     * @default null
     */
    @Property(null)
    public milestone: string;

    /**
     * Define Milestone mapping in Gantt
     * @default null
     */
    @Property(null)
    public duration: string;

    /**
     * To map duration unit of task
     */
    @Property(null)
    public durationUnit: string;
    /**
     * To map custom css class of task
     */
    @Property(null)
    public cssClass: string;
    /**
     * To map baseline start date of task
     */
    @Property(null)
    public baselineStartDate: string;
    /**
     * To map baseline end date of task
     */
    @Property(null)
    public baselineEndDate: string;
    /**
     * To map assigned resources of task
     */
    @Property(null)
    public resourceInfo: string;
    /**
     * To map expand status of parent record
     */
    @Property(null)
    public expandState: string;
    /**
     * Define the Indicators of Gantt
     * @default null      
     */
    @Property(null)
    public indicators: string;
    /**
     * To map note of task
     * @default null
     */
    @Property(null)
    public notes: string;
}