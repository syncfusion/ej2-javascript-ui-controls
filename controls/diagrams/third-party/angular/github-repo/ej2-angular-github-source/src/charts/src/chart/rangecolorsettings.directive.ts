import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['colors', 'end', 'label', 'start'];
let outputs: string[] = [];
/**
 * RangeColorSetting Directive
 * ```html
 * <e-rangeColorSettings><e-rangeColorSetting></e-rangeColorSetting><e-rangeColorSettings>
 * ```
 */
@Directive({
    selector: 'e-rangecolorsettings>e-rangecolorsetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class RangeColorSettingDirective extends ComplexBase<RangeColorSettingDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the fill colors for points that lie within the given range. If multiple colors are specified, a gradient will be applied.
     */
    public declare colors: any;
    /** 
     * Specifies the end value of the color mapping range.
     */
    public declare end: any;
    /** 
     * Specifies the name or label for the range mapping item.
     */
    public declare label: any;
    /** 
     * Specifies the start value of the color mapping range.
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
 * RangeColorSetting Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-chart>e-rangecolorsettings',
    standalone: true,
    queries: {
        children: new ContentChildren(RangeColorSettingDirective)
    },
})
export class RangeColorSettingsDirective extends ArrayBase<RangeColorSettingsDirective> {
    constructor() {
        super('rangecolorsettings');
    }
}