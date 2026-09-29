import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['animationDelay', 'animationDuration', 'border', 'clusterSettings', 'colorValuePath', 'dashArray', 'dataSource', 'enableDrag', 'fill', 'height', 'heightValuePath', 'highlightSettings', 'imageUrl', 'imageUrlValuePath', 'initialMarkerSelection', 'latitudeValuePath', 'legendText', 'longitudeValuePath', 'offset', 'opacity', 'query', 'selectionSettings', 'shape', 'shapeValuePath', 'template', 'tooltipSettings', 'visible', 'width', 'widthValuePath'];
let outputs: string[] = [];
/**
 * Represents the directive to define the markers in the maps.
 * ```html
 * <e-layers>
 * <e-layer>
 * <e-markerSettings>
 * <e-markerSetting>
 * </e-markerSetting>
 * </e-markerSettings>
 * </e-layer>
 * </e-layers>
 * ```
 */
@Directive({
    selector: 'e-layer>e-markerSettings>e-markerSetting',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template'),
        tooltipSettings_template: new ContentChild('tooltipSettingsTemplate')
    }
})
export class MarkerDirective extends ComplexBase<MarkerDirective> {
    public directivePropList: any;
	


    /** 
     * Gets or sets the delay time for the animation in marker.
     * @default 0
     */
    public declare animationDelay: any;
    /** 
     * Gets or sets the duration time for animating the marker.
     * @default 1000
     */
    public declare animationDuration: any;
    /** 
     * Gets or sets the options for customizing the style properties of the border of the marker in maps.
     */
    public declare border: any;
    /** 
     * Gets or sets the options for customizing the clustering of markers on the map. 
     * This property is used to cluster markers based on the current marker settings, and it is applied only when the `allowClustering` property is enabled.
     */
    public declare clusterSettings: any;
    /** 
     * Gets or sets the field name from the marker data source based on which the color is applied for the marker.
     * @default null
     */
    public declare colorValuePath: any;
    /** 
     * Gets or sets the dash-array for the marker.
     */
    public declare dashArray: any;
    /** 
     * Gets or sets the data source for the marker. 
     * The data source for the marker will contain latitude and longitude values to specify the location 
     * of the marker. 
     * The data source can contain data such as color, shape, and other details that can be bound to the color, shape, 
     * and tooltip of the marker.
     * @isobservable true
     * @default []
     */
    public declare dataSource: any;
    /** 
     * Enables or disables marker drag and drop functionality at any location on the map.
     * @default false
     */
    public declare enableDrag: any;
    /** 
     * Gets or sets the color for the marker in maps.
     * @default '#FF471A'
     */
    public declare fill: any;
    /** 
     * Gets or sets the height of the marker in maps.
     * @default 10
     */
    public declare height: any;
    /** 
     * Gets or sets the field name from the data source that determines the marker height.
     * @default null
     */
    public declare heightValuePath: any;
    /** 
     * Gets or sets the options to customize the marker when the mouse hovers over the markers in maps.
     */
    public declare highlightSettings: any;
    /** 
     * Gets or sets the URL for rendering the marker as image. This property acts as image source for all the markers in a marker settings.
     */
    public declare imageUrl: any;
    /** 
     * Gets or sets the field name from the marker data source based on which the image source for the image type marker is got individually.
     * @default null
     */
    public declare imageUrlValuePath: any;
    /** 
     * Gets or sets the options to select the markers at the initial rendering time of the maps. 
     * The initial selection of markers will be performed only when the selection functionality of marker is enabled.
     */
    public declare initialMarkerSelection: any;
    /** 
     * Defines the field name from the marker data source for setting latitude for a set of markers.
     */
    public declare latitudeValuePath: any;
    /** 
     * Gets or sets the field name from the marker data source to render legend item text for the marker legend.
     * @default ''
     */
    public declare legendText: any;
    /** 
     * Defines the field name from the marker data source for setting longitude for a set of markers.
     */
    public declare longitudeValuePath: any;
    /** 
     * Gets or sets the offset value from which the marker must be rendered from the intended position.
     */
    public declare offset: any;
    /** 
     * Gets or sets the opacity for the marker in maps.
     * @default 1
     */
    public declare opacity: any;
    /** 
     * Gets or sets the query to select particular data from the marker data source. 
     * This property is applicable only when the data source is created by data manager.
     * @default null
     */
    public declare query: any;
    /** 
     * Gets or sets the options to customize the marker while selecting the marker in maps.
     */
    public declare selectionSettings: any;
    /** 
     * Gets or sets the shape of the marker in maps.
     * @default Balloon
     */
    public declare shape: any;
    /** 
     * Gets or sets the field name from the marker data source based on which the shape for individual markers are set.
     * @default null
     */
    public declare shapeValuePath: any;
    /** 
     * Gets or sets the options to customize the tooltip of the marker in maps.
     */
    public declare tooltipSettings: any;
    /** 
     * Enables or disables the visibility of the markers in maps.
     * @default false
     */
    public declare visible: any;
    /** 
     * Gets or sets the width of the marker in maps.
     * @default 10
     */
    public declare width: any;
    /** 
     * Gets or sets the field name from the data source that determines the marker width.
     * @default null
     */
    public declare widthValuePath: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(MarkerDirective.prototype, 'template');
Template()(MarkerDirective.prototype, 'tooltipSettings_template');

/**
 * Marker Array Directive
 * @private
 */
@Directive({
    selector: 'e-layer>e-markerSettings',
    standalone: true,
    queries: {
        children: new ContentChildren(MarkerDirective)
    },
})
export class MarkersDirective extends ArrayBase<MarkersDirective> {
    constructor() {
        super('markersettings');
    }
}