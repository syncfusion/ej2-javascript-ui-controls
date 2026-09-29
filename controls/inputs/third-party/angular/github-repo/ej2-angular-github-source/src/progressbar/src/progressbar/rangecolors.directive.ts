import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'end', 'start'];
let outputs: string[] = [];

@Directive({
    selector: 'e-rangecolors>e-rangecolor',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class RangeColorDirective extends ComplexBase<RangeColorDirective> {
    public directivePropList: any;
	


    /** 
     * color
     * @default null
     */
    public declare color: any;
    /** 
     * end
     * @default null
     */
    public declare end: any;
    /** 
     * start
     * @default null
     */
    public declare start: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RangeColor Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-progressbar>e-rangecolors',
    standalone: true,
    queries: {
        children: new ContentChildren(RangeColorDirective)
    },
})
export class RangeColorsDirective extends ArrayBase<RangeColorsDirective> {
    constructor() {
        super('rangecolors');
    }
}