import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['animation', 'dataLabel', 'dataSource', 'emptyPointSettings', 'enableTooltip', 'explode', 'explodeAll', 'explodeIndex', 'explodeOffset', 'innerRadius', 'legendImageUrl', 'legendShape', 'name', 'opacity', 'palettes', 'pointColorMapping', 'query', 'radius', 'tooltipMappingName', 'visible', 'xName', 'yName'];
let outputs: string[] = [];
/**
 * Circular3D Series Directive
 * ```html
 * <e-circular3d-series-collection>
 * <e-circular3d-series></e-circular3d-series>
 * </e-circular3d-series-collection>
 * ```
 */
@Directive({
    selector: 'e-circularchart3d-series-collection>e-circularchart3d-series',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        dataLabel_template: new ContentChild('dataLabelTemplate')
    }
})
export class CircularChart3DSeriesDirective extends ComplexBase<CircularChart3DSeriesDirective> {
    public directivePropList: any;
	


    /** 
     * Options for customizing the animation of the series.
     */
    public declare animation: any;
    /** 
     * The data label settings for the circular 3D series.
     */
    public declare dataLabel: any;
    /** 
     * Specifies the dataSource for the series. It can be an array of JSON objects or an instance of DataManager. 
     * 
     * @default ''
     */
    public declare dataSource: any;
    /** 
     * Options to customize the appearance of empty points in the circular 3D series.
     */
    public declare emptyPointSettings: any;
    /** 
     * Specifies whether the tooltip is enabled or disabled for the circular 3D series.
     * @default true
     */
    public declare enableTooltip: any;
    /** 
     * If set true, series points will be exploded on mouse click or touch.
     * @default false
     */
    public declare explode: any;
    /** 
     * If set true, all the points in the series will get exploded on load.
     * @default false
     */
    public declare explodeAll: any;
    /** 
     * Index of the point to be exploded on load. Set to `null` for no explosion.
     * @default null
     */
    public declare explodeIndex: any;
    /** 
     * Distance of the point from the center, which takes values in both pixels and percentage.
     * @default '30%'
     */
    public declare explodeOffset: any;
    /** 
     * When the innerRadius value is greater than 0 percentage, a donut will appear in the pie series. It takes values only in percentage.
     * @default '0'
     */
    public declare innerRadius: any;
    /** 
     * The URL for the image that is to be displayed as a legend icon. It requires `legendShape` value to be an `Image`.
     * @default ''
     */
    public declare legendImageUrl: any;
    /** 
     * The shape of the legend. Each series has its own legend shape. Available shapes: 
     * * Circle - Renders a circle. 
     * * Rectangle - Renders a rectangle. 
     * * Triangle - Renders a triangle. 
     * * Diamond - Renders a diamond. 
     * * Cross - Renders a cross. 
     * * HorizontalLine - Renders a horizontal line. 
     * * VerticalLine - Renders a vertical line. 
     * * Pentagon - Renders a pentagon. 
     * * InvertedTriangle - Renders an inverted triangle. 
     * * SeriesType -Render a legend shape based on series type. 
     * * Image - Render an image. *
     * @default 'SeriesType'
     */
    public declare legendShape: any;
    /** 
     * The name of the series as displayed in the legend.
     * @default ''
     */
    public declare name: any;
    /** 
     * The opacity of the series.
     * @default 1.
     */
    public declare opacity: any;
    /** 
     * Palette configuration for the points in the circular 3D series.
     * @default []
     */
    public declare palettes: any;
    /** 
     * The DataSource field that contains the point colors.
     * @default ''
     */
    public declare pointColorMapping: any;
    /** 
     * Specifies the query to select data from the dataSource. This property is applicable only when the dataSource is `ej.DataManager`.
     * @default null
     */
    public declare query: any;
    /** 
     * Specifies the radius of the pie series in percentage. Set to `null` for default.
     * @default null
     */
    public declare radius: any;
    /** 
     * The data source field that contains the tooltip value.
     * @default ''
     */
    public declare tooltipMappingName: any;
    /** 
     * Specifies the visibility of the series.
     * @default true
     */
    public declare visible: any;
    /** 
     * The DataSource field that contains the x value
     * @default ''
     */
    public declare xName: any;
    /** 
     * The DataSource field that contains the y value.
     * @default ''
     */
    public declare yName: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(CircularChart3DSeriesDirective.prototype, 'dataLabel_template');

/**
 * CircularChart3DSeries Array Directive
 * @private
 */
@Directive({
    selector: 'ej-circularchart3d>e-circularchart3d-series-collection',
    standalone: true,
    queries: {
        children: new ContentChildren(CircularChart3DSeriesDirective)
    },
})
export class CircularChart3DSeriesCollectionDirective extends ArrayBase<CircularChart3DSeriesCollectionDirective> {
    constructor() {
        super('series');
    }
}