import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['dayOfWeek', 'timeRange'];
let outputs: string[] = [];
/**
 * `e-week-working-times` directive represent a working time ranges in a day. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'> 
 *   <e-week-working-times>
 *     <e-week-working-time dayOfWeek='Monday'></e-week-working-time>
 *     <e-week-working-time dayOfWeek='Monday'></e-week-working-time>
 *   </e-week-working-times>
 * </ejs-gantt>
 * ```
 */
@Directive({
    selector: 'ejs-gantt>e-week-working-times>e-week-working-time',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class WeekWorkingTimeDirective extends ComplexBase<WeekWorkingTimeDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the day of the week to apply customized working time.
     * @default null
     */
    public declare dayOfWeek: any;
    /** 
     * Defines the time range for each day of the week.
     * @default []
     * @asptype List<GanttDayWorkingTime>

     */
    public declare timeRange: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * WeekWorkingTime Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-gantt>e-week-working-times',
    standalone: true,
    queries: {
        children: new ContentChildren(WeekWorkingTimeDirective)
    },
})
export class WeekWorkingTimesDirective extends ArrayBase<WeekWorkingTimesDirective> {
    constructor() {
        super('weekworkingtime');
    }
}