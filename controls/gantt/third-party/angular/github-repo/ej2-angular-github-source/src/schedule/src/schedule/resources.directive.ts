import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['allowMultiple', 'colorField', 'cssClassField', 'dataSource', 'endHourField', 'expandedField', 'field', 'groupIDField', 'idField', 'name', 'query', 'startHourField', 'textField', 'title', 'workDaysField'];
let outputs: string[] = [];
/**
 * `e-resources` directive represent a resources of the Angular Schedule. 
 * It must be contained in a Schedule component(`ejs-schedule`). 
 * ```html
 * <ejs-schedule>
 *   <e-resources>
 *    <e-resource field='RoomId' name='Rooms'></e-resource>
 *    <e-resource field='OwnerId' name='Owners'></e-resource>
 *   </e-resources>
 * </ejs-schedule>
 * ```
 */
@Directive({
    selector: 'e-resources>e-resource',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ResourceDirective extends ComplexBase<ResourceDirective> {
    public directivePropList: any;
	


    /** 
     * When set to true, allows multiple selection of resource names, thus creating multiple instances of same appointment for the 
     *  selected resources.
     * @default false
     */
    public declare allowMultiple: any;
    /** 
     * It maps the `color` field from the dataSource, which is used to specify colors for the resources.
     * @default 'Color'
     */
    public declare colorField: any;
    /** 
     * It maps the `cssClass` field from the dataSource, which is used to specify different styles to each resource appointments.
     * @default 'CssClass'
     */
    public declare cssClassField: any;
    /** 
     * Assigns the resource dataSource 
     * The data can be passed either as an array of JavaScript objects, 
     * or else can create an instance of [`DataManager`](https://ej2.syncfusion.com/documentation/api/data/datamanager.html) 
     * in case of processing remote data and can be assigned to the `dataSource` property. 
     * With the remote data assigned to dataSource, check the available 
     *  [adaptors](http://ej2.syncfusion.com/documentation/data/adaptors.html) to customize the data processing.
     * @default []
     */
    public declare dataSource: any;
    /** 
     * It maps the `endHour` field from the dataSource, which is used to specify different work end hour for each resources.
     * @default 'EndHour'
     */
    public declare endHourField: any;
    /** 
     * It maps the `expanded` field from the dataSource, which is used to specify whether each resource levels 
     * in timeline view needs to be maintained in an expanded or collapsed state by default.
     * @default 'Expanded'
     */
    public declare expandedField: any;
    /** 
     * A value that binds to the resource field of event object.
     * @default null
     */
    public declare field: any;
    /** 
     * It maps the `groupID` field from the dataSource, which is used to specify under which parent resource, 
     *  the child should be grouped.
     * @default 'GroupID'
     */
    public declare groupIDField: any;
    /** 
     * It maps the `id` field from the dataSource and is used to uniquely identify the resources.
     * @default 'Id'
     */
    public declare idField: any;
    /** 
     * It represents a unique resource name for differentiating various resource objects while grouping.
     * @default null
     */
    public declare name: any;
    /** 
     * Defines the external [`query`](https://ej2.syncfusion.com/documentation/api/data/query.html) 
     * that will be executed along with the data processing.
     * @default null
     */
    public declare query: any;
    /** 
     * It maps the `startHour` field from the dataSource, which is used to specify different work start hour for each resources.
     * @default 'StartHour'
     */
    public declare startHourField: any;
    /** 
     * It maps the `text` field from the dataSource, which is used to specify the resource names.
     * @default 'Text'
     */
    public declare textField: any;
    /** 
     * It holds the title of the resource field to be displayed on the schedule event editor window.
     * @default null
     */
    public declare title: any;
    /** 
     * It maps the working days field from the dataSource, which is used to specify different working days for each resources.
     * @default 'WorkDays'
     */
    public declare workDaysField: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Resource Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-schedule>e-resources',
    standalone: true,
    queries: {
        children: new ContentChildren(ResourceDirective)
    },
})
export class ResourcesDirective extends ArrayBase<ResourcesDirective> {
    constructor() {
        super('resources');
    }
}