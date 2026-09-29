import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['cssClass', 'from', 'label', 'to'];
let outputs: string[] = [];
/**
 * `e-holidays` directive represent a holidays collection in Gantt. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'> 
 *   <e-holidays>
 *     <e-holiday from='02/20/2018' label='Holiday 1'></e-holiday>
 *     <e-holiday from='05/15/2018' label='Holiday 2'></e-holiday>
 *   </e-holidays>
 * </ejs-gantt>
 * ```
 */
@Directive({
    selector: 'ejs-gantt>e-holidays>e-holidays',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class HolidayDirective extends ComplexBase<HolidayDirective> {
    public directivePropList: any;
	


    /** 
     * Defines a custom CSS class for styling the holiday marker and label.
     * 
     * Use this to apply custom background, borders, or font styles.
     *     
     * @default null
     */
    public declare cssClass: any;
    /** 
     * Specifies the start date of the holiday.
     * 
     * Accepts a `Date` object or ISO-formatted string.
     *     
     * @default null
     */
    public declare from: any;
    /** 
     * Defines a label or description for the holiday.
     * 
     * Useful for tooltips, annotations, and export metadata.
     *     
     * @default null
     */
    public declare label: any;
    /** 
     * Specifies the end date of the holiday.
     * 
     * Accepts a `Date` object or ISO-formatted string.
     *If omitted, the holiday is treated as a single-day event.
     *     
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
 * Holiday Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-gantt>e-holidays',
    standalone: true,
    queries: {
        children: new ContentChildren(HolidayDirective)
    },
})
export class HolidaysDirective extends ArrayBase<HolidaysDirective> {
    constructor() {
        super('holidays');
    }
}