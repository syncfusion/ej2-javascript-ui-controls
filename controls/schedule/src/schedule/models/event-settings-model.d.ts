import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Query, DataManager } from '@syncfusion/ej2-data';import { Field } from './fields';import { FieldModel } from './fields-model';

/**
 * Interface for a class EventSettings
 */
export interface EventSettingsModel {

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying
     *  it onto the event background. All the event fields mapped to Schedule from dataSource can be accessed within this template code.
     * {% codeBlock src="schedule/event-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    template?: string;

    /**
     * With this property, the event data will be bound to Schedule.
     * The event data can be passed either as an array of JavaScript objects, 
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
     * Defines the collection of default event fields to be bind to the Schedule. 
     * @default null    
     */
    fields?: FieldModel;

    /**
     * When set to `true` will display the normal tooltip over the events with its subject, location, start and end time.
     * @default false
     */
    enableTooltip?: boolean;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto tooltip.
     *  All the event fields mapped with Schedule dataSource can be accessed within this template code.
     * {% codeBlock src="schedule/tooltip-template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    tooltipTemplate?: string;

    /**
     * Defines the resource name, to decides the color of which particular resource level is to be applied on appointments, when
     *  grouping is enabled on scheduler.
     * {% codeBlock src="schedule/resource-color-field-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    resourceColorField?: string;

    /**
     * When set to `true` will edit the future events only instead of editing entire series.
     * @default false
     */
    editFollowingEvents?: boolean;

    /**
     * When set to `false` the add action will be restricted.
     * @default true
     */
    allowAdding?: boolean;

    /**
     * When set to `false` the edit action will be restricted.
     * @default true
     */
    allowEditing?: boolean;

    /**
     * When set to `false` the delete action will be restricted.
     * @default true
     */
    allowDeleting?: boolean;

    /**
     * It enables the event to occupy the full height of the cell without the header of the cell.
     * @default false
     */
    enableMaxHeight?: boolean;

    /**
     * This property enables the event to occupy the full height that remaining from the header and more indicator.
     * More than one appointment are available on the cell the more indicator is created.
     * @default false
     */
    enableIndicator?: boolean;

    /**
     * This property ignores or include the Events element bottom white space.
     * @default false
     */
    ignoreWhitespace?: boolean;

}