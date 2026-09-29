import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['angle', 'arrowSettings', 'color', 'dashArray', 'highlightSettings', 'latitude', 'longitude', 'selectionSettings', 'visible', 'width'];
let outputs: string[] = [];
/**
 * Represents the directive to define the navigation lines in the maps.
 * ```html
 * <e-layers>
 * <e-layer>
 * <e-navigationLineSettings>
 * <e-navigationLineSetting>
 * </e-navigationLineSetting>
 * </e-navigationLineSettings>
 * </e-layer>
 * </e-layers>
 * ```
 */
@Directive({
    selector: 'e-layer>e-navigationLineSettings>e-navigationLineSetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        tooltipSettings_template: new ContentChild('tooltipSettingsTemplate')
    }
})
export class NavigationLineDirective extends ComplexBase<NavigationLineDirective> {
    public directivePropList: any;
	


    /** 
     * Gets or sets the angle of the curve connecting different locations in maps.
     * @default 0
     */
    public declare angle: any;
    /** 
     * Gets or sets the options to customize the arrow for the navigation line in maps.
     */
    public declare arrowSettings: any;
    /** 
     * Gets or sets the color for the navigation lines in maps.
     * @default 'black'
     */
    public declare color: any;
    /** 
     * Gets or sets the dash-array for the navigation lines drawn in maps.
     * @default ''
     */
    public declare dashArray: any;
    /** 
     * Gets or sets the highlight settings of the navigation line in maps.
     */
    public declare highlightSettings: any;
    /** 
     * Gets or sets the latitude value for the navigation lines to be drawn in maps.
     * @default []
     */
    public declare latitude: any;
    /** 
     * Gets or sets the longitude for the navigation lines to be drawn in maps.
     * @default []
     */
    public declare longitude: any;
    /** 
     * Gets or sets the selection settings of the navigation line in maps.
     */
    public declare selectionSettings: any;
    /** 
     * Enables or disables the navigation lines to be drawn in maps.
     * @default false
     */
    public declare visible: any;
    /** 
     * Gets or sets the width of the navigation lines in maps.
     * @default 1
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(NavigationLineDirective.prototype, 'tooltipSettings_template');

/**
 * NavigationLine Array Directive
 * @private
 */
@Directive({
    selector: 'e-layer>e-navigationLineSettings',
    standalone: true,
    queries: {
        children: new ContentChildren(NavigationLineDirective)
    },
})
export class NavigationLinesDirective extends ArrayBase<NavigationLinesDirective> {
    constructor() {
        super('navigationlinesettings');
    }
}