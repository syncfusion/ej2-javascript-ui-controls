import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';

/**
 * Interface for a class Resources
 */
export interface ResourcesModel {

    /**
     * A value that binds to the resource field of event object.
     * @default null
     */
    field?: string;

    /**
     * It holds the title of the resource field to be displayed on the schedule event editor window.
     * @default null
     */
    title?: string;

    /**
     * It represents a unique resource name for differentiating various resource objects while grouping.
     * @default null
     */
    name?: string;

    /**
     * When set to true, allows multiple selection of resource names, thus creating multiple instances of same appointment for the
     *  selected resources.
     * @default false
     */
    allowMultiple?: boolean;

    /**
     * Assigns the resource dataSource
     * The data can be passed either as an array of JavaScript objects, 
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property. 
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing. 
     * @default []
     * @isGenericType true
     */
    dataSource?: Object[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with the data processing.    
     * @default null
     * @blazorType Syncfusion.Blazor.Data.Query
     */
    query?: Query;

    /**
     * It maps the `id` field from the dataSource and is used to uniquely identify the resources.
     * @default 'Id'
     */
    idField?: string;

    /**
     * It maps the `text` field from the dataSource, which is used to specify the resource names.
     * @default 'Text'
     */
    textField?: string;

    /**
     * It maps the `expanded` field from the dataSource, which is used to specify whether each resource levels
     * in timeline view needs to be maintained in an expanded or collapsed state by default.
     * @default 'Expanded'
     */
    expandedField?: string;

    /**
     * It maps the `groupID` field from the dataSource, which is used to specify under which parent resource,
     *  the child should be grouped.
     * @default 'GroupID'
     */
    groupIDField?: string;

    /**
     * It maps the `color` field from the dataSource, which is used to specify colors for the resources.
     * @default 'Color'
     */
    colorField?: string;

    /**
     * It maps the `startHour` field from the dataSource, which is used to specify different work start hour for each resources.
     * @default 'StartHour'
     */
    startHourField?: string;

    /**
     * It maps the `endHour` field from the dataSource, which is used to specify different work end hour for each resources.
     * @default 'EndHour'
     */
    endHourField?: string;

    /**
     * It maps the working days field from the dataSource, which is used to specify different working days for each resources.
     * @default 'WorkDays'
     */
    workDaysField?: string;

    /**
     * It maps the `cssClass` field from the dataSource, which is used to specify different styles to each resource appointments.
     * @default 'CssClass'
     */
    cssClassField?: string;

}