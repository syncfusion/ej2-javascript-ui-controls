import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'endRange', 'opacity', 'startRange'];
let outputs: string[] = [];

@Directive({
    selector: 'e-rangeBandSettings>e-rangeBandSetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class RangeBandSettingDirective extends ComplexBase<RangeBandSettingDirective> {
    public directivePropList: any;
	


    /** 
     * To configure sparkline rangeband color.
     */
    public declare color: any;
    /** 
     * To configure sparkline end range.
     * @aspdefaultvalueignore 
     */
    public declare endRange: any;
    /** 
     * To configure sparkline rangeband opacity.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * To configure sparkline start range.
     * @aspdefaultvalueignore 
     */
    public declare startRange: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RangeBandSetting Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-sparkline>e-rangeBandSettings',
    standalone: true,
    queries: {
        children: new ContentChildren(RangeBandSettingDirective)
    },
})
export class RangeBandSettingsDirective extends ArrayBase<RangeBandSettingsDirective> {
    constructor() {
        super('rangebandsettings');
    }
}