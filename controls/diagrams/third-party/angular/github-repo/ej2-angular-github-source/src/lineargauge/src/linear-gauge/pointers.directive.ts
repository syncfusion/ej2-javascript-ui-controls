import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['animationDuration', 'border', 'color', 'description', 'enableDrag', 'height', 'imageUrl', 'linearGradient', 'markerType', 'offset', 'opacity', 'placement', 'position', 'radialGradient', 'roundedCornerRadius', 'text', 'textStyle', 'type', 'value', 'width'];
let outputs: string[] = [];
/**
 * Represents the directive to render and customize the pointers in an axis of linear gauge.
 * ```html
 * <e-pointers><e-pointer></e-pointer></e-pointers>
 * ```
 */
@Directive({
    selector: 'e-pointers>e-pointer',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class PointerDirective extends ComplexBase<PointerDirective> {
    public directivePropList: any;
	


    /** 
     * Sets and gets the type of pointer in axis. There are two types of pointers: Marker and Bar.
     * @default Marker
     */
    public declare type: any;
    /** 
     * Sets and gets the duration of animation in pointer.
     * @default 0
     */
    public declare animationDuration: any;
    /** 
     * Sets and gets the options to customize the style properties of the border for pointers.
     */
    public declare border: any;
    /** 
     * Sets and gets the color of the pointer.
     * @default null
     */
    public declare color: any;
    /** 
     * Sets and gets the description for the pointer.
     * @default null
     */
    public declare description: any;
    /** 
     * Enables or disables the drag movement of pointer to update the pointer value.
     * @default false
     */
    public declare enableDrag: any;
    /** 
     * Sets and gets the height of the pointer.
     * @default 20
     */
    public declare height: any;
    /** 
     * Sets and gets the URL path for the image in marker when the marker type is set as image.
     * @default null
     */
    public declare imageUrl: any;
    /** 
     * Sets and gets the properties to render a linear gradient for the pointer. 
     * If both linear and radial gradient is set, then the linear gradient will be rendered in the pointer.
     * @default null
     */
    public declare linearGradient: any;
    /** 
     * Sets and gets the type of the marker for pointers in axis.
     * @default InvertedTriangle
     */
    public declare markerType: any;
    /** 
     * Sets and gets the value to position the pointer from the axis.
     * @default '0'
     */
    public declare offset: any;
    /** 
     * Sets and gets the opacity of pointer in linear gauge.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * Sets and gets the place of the pointer.
     * @default Far
     */
    public declare placement: any;
    /** 
     * Sets and gets the position of the pointer.
     * @default Auto
     */
    public declare position: any;
    /** 
     * Sets and gets the properties to render a radial gradient for the pointer.
     * @default null
     */
    public declare radialGradient: any;
    /** 
     * Sets and gets the corner radius for pointer.
     * @default 10
     */
    public declare roundedCornerRadius: any;
    /** 
     * Specifies the text that will be displayed as the pointer in Linear Gauge. To display the text pointer, the `markerType` property must be set to `Text`.
     * @default ''
     */
    public declare text: any;
    /** 
     * Defines the font properties such as font-size, font family and others for the text pointer.
     */
    public declare textStyle: any;
    /** 
     * Sets and gets the value of the pointer in axis.
     * @default null
     */
    public declare value: any;
    /** 
     * Sets and gets the width of the pointer.
     * @default 20
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Pointer Array Directive
 * @private
 */
@Directive({
    selector: 'ej-linear-gauge>e-axes>e-axis>e-pointers',
    standalone: true,
    queries: {
        children: new ContentChildren(PointerDirective)
    },
})
export class PointersDirective extends ArrayBase<PointersDirective> {
    constructor() {
        super('pointers');
    }
}