import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['from', 'to'];
let outputs: string[] = [];
/**
 * `e-day-working-time-collection` directive represent a working time ranges in a day. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'> 
 *   <e-day-working-time-collection>
 *     <e-day-working-time from='8' to='12'></e-day-working-time>
 *     <e-day-working-time from='13' to='17'></e-day-working-time>
 *   </e-day-working-time-collection>
 * </ejs-gantt>
 * ```
 */
@Directive({
    selector: 'ejs-gantt>e-day-working-time-collection>e-day-working-time',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class DayWorkingTimeDirective extends ComplexBase<DayWorkingTimeDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the start time of the working time range for the day.
     * @default null
     */
    public declare from: any;
    /** 
     * Defines the end time of the working time range for the day.
     * @default null
     */
    public declare to: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * DayWorkingTime Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-gantt>e-day-working-time-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(DayWorkingTimeDirective)
    },
})
export class DayWorkingTimeCollectionDirective extends ArrayBase<DayWorkingTimeCollectionDirective> {
    constructor() {
        super('dayworkingtime');
    }
}