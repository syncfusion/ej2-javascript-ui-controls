import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['end', 'label', 'start'];
let outputs: string[] = [];
/**
 * 'e-presets' directive represent a presets of angular daterangepicker 
 * It must be contained in a daterangepicker component(`ej-daterangepicker`). 
 * ```html
 * <ejs-daterangepicker id='range'> 
 *   <e-presets>
 *    <e-preset label='Last Week' [start]=new Date('06/07/2018') [end]= new Date('06/01/2018')></e-preset>
 *    <e-preset label='Last Month' [start]=new Date('06/07/2018') [end]= new Date('05/07/2018')></e-preset>
 *   </e-presets>
 * </ejs-daterangepicker>
 * ```
 */
@Directive({
    selector: 'e-presets>e-preset',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class PresetDirective extends ComplexBase<PresetDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the end date of the preset range
     */
    public declare end: any;
    /** 
     * Defines the label string of the preset range.
     */
    public declare label: any;
    /** 
     * Defines the start date of the preset range.
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
 * Preset Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-daterangepicker>e-presets',
    standalone: true,
    queries: {
        children: new ContentChildren(PresetDirective)
    },
})
export class PresetsDirective extends ArrayBase<PresetsDirective> {
    constructor() {
        super('presets');
    }
}