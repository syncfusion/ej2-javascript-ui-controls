import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'from', 'label', 'maxOpacity', 'minOpacity', 'showLegend', 'to', 'value'];
let outputs: string[] = [];
/**
 * Represents the directive to define the bubble color mapping in the maps.
 * ```html
 * <e-layers>
 * <e-layer>
 * <e-bubbleSettings>
 * <e-colorMappings>
 * <e-colorMapping>
 * </e-colorMapping>
 * </e-colorMappings>
 * </e-bubbleSettings>
 * </e-layer>
 * </e-layers>
 * ```
 */
@Directive({
    selector: 'e-bubbleSettings>e-colorMappings>e-colorMapping',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ColorMappingDirective extends ComplexBase<ColorMappingDirective> {
    public directivePropList: any;
	


    /** 
     * Gets or sets the color for the color-mapping in maps.
     * @default null
     */
    public declare color: any;
    /** 
     * Gets or sets the value from where the range for the color-mapping starts.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare from: any;
    /** 
     * Gets or sets the label for the color-mapping to display in the legend item text.
     * @default null
     */
    public declare label: any;
    /** 
     * Gets or sets the maximum opacity for the color-mapping in maps.
     * @default null
     */
    public declare maxOpacity: any;
    /** 
     * Gets or sets the minimum opacity for the color-mapping in maps.
     * @default null
     */
    public declare minOpacity: any;
    /** 
     * Enables or disables the visibility of legend for the corresponding color-mapped shapes in maps.
     * @default true
     */
    public declare showLegend: any;
    /** 
     * Gets or sets the value to where the range for the color-mapping ends.
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare to: any;
    /** 
     * Gets or sets the value from the data source to map the corresponding colors to the shapes.
     * @default null
     */
    public declare value: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * ColorMapping Array Directive
 * @private
 */
@Directive({
    selector: 'e-bubbleSettings>e-colorMappings',
    standalone: true,
    queries: {
        children: new ContentChildren(ColorMappingDirective)
    },
})
export class ColorMappingsDirective extends ArrayBase<ColorMappingsDirective> {
    constructor() {
        super('colormapping');
    }
}