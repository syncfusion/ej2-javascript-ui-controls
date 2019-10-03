import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';

/**  
 * A class that represents the resource related configurations and its data binding options.
 */
export class Resources extends ChildProperty<Resources> {
    /** 
     * A value that binds to the resource field of event object.

     */
    @Property()
    public field: string;

    /** 
     * It holds the title of the resource field to be displayed on the schedule event editor window.

     */
    @Property()
    public title: string;

    /** 
     * It represents a unique resource name for differentiating various resource objects while grouping.

     */
    @Property()
    public name: string;

    /** 
     * When set to true, allows multiple selection of resource names, thus creating multiple instances of same appointment for the
     *  selected resources.

     */
    @Property(false)
    public allowMultiple: boolean;

    /**
     * Assigns the resource dataSource
     * The data can be passed either as an array of JavaScript objects, 
     * or else can create an instance of [`DataManager`](http://ej2.syncfusion.com/documentation/data/api-dataManager.html)
     * in case of processing remote data and can be assigned to the `dataSource` property. 
     * With the remote data assigned to dataSource, check the available
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing. 


     */
    @Property([])
    public dataSource: Object[] | DataManager;

    /**
     * Defines the external [`query`](http://ej2.syncfusion.com/documentation/data/api-query.html) 
     * that will be executed along with the data processing.    

     */
    @Property()
    public query: Query;

    /** 
     * It maps the `id` field from the dataSource and is used to uniquely identify the resources.

     */
    @Property('Id')
    public idField: string;

    /** 
     * It maps the `text` field from the dataSource, which is used to specify the resource names.

     */
    @Property('Text')
    public textField: string;

    /** 
     * It maps the `expanded` field from the dataSource, which is used to specify whether each resource levels
     * in timeline view needs to be maintained in an expanded or collapsed state by default.

     */
    @Property('Expanded')
    public expandedField: string;

    /** 
     * It maps the `groupID` field from the dataSource, which is used to specify under which parent resource,
     *  the child should be grouped.

     */
    @Property('GroupID')
    public groupIDField: string;

    /** 
     * It maps the `color` field from the dataSource, which is used to specify colors for the resources.

     */
    @Property('Color')
    public colorField: string;

    /** 
     * It maps the `startHour` field from the dataSource, which is used to specify different work start hour for each resources.

     */
    @Property('StartHour')
    public startHourField: string;

    /** 
     * It maps the `endHour` field from the dataSource, which is used to specify different work end hour for each resources.

     */
    @Property('EndHour')
    public endHourField: string;

    /** 
     * It maps the working days field from the dataSource, which is used to specify different working days for each resources.

     */
    @Property('WorkDays')
    public workDaysField: string;

    /** 
     * It maps the `cssClass` field from the dataSource, which is used to specify different styles to each resource appointments.

     */
    @Property('CssClass')
    public cssClassField: string;
}
