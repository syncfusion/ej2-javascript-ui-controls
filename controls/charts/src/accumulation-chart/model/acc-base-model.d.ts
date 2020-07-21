import { Property, ChildProperty, Complex, createElement } from '@syncfusion/ej2-base';import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Border, Font, Animation, Index, EmptyPointSettings, Connector } from '../../common/model/base';import { Rect, Size, PathOption } from '@syncfusion/ej2-svg-base';import { ChartLocation, stringToNumber, appendChildElement } from '../../common/utils/helper';import { AccumulationType, AccumulationLabelPosition, PyramidModes } from '../model/enum';import { IAccSeriesRenderEventArgs, IAccPointRenderEventArgs, IAccTextRenderEventArgs } from '../model/pie-interface';import { LegendShape } from '../../chart/utils/enum';import { Data } from '../../common/model/data';import { seriesRender, pointRender } from '../../common/model/constants';import { getSeriesColor } from '../../common/model/theme';import { FontModel, BorderModel, AnimationModel, EmptyPointSettingsModel, ConnectorModel } from '../../common/model/base-model';import { AccumulationChart } from '../accumulation';import { getElement, firstToLowerCase } from '../../common/utils/helper';import { Units, Alignment, Regions, Position, SeriesCategories } from '../../common/utils/enum';import { GroupModes } from './enum';

/**
 * Interface for a class AccumulationAnnotationSettings
 */
export interface AccumulationAnnotationSettingsModel {

    /**
     * Content of the annotation, which accepts the id of the custom element.
     * @default null
     */
    content?: string;

    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default '0'
     */
    x?: string | Date | number;

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate
     * @default '0'
     */
    y?: string | number;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.
     * @default 'Pixel'
     */

    coordinateUnits?: Units;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.
     * @default 'Chart'
     */

    region?: Regions;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.
     * @default 'Middle'
     * @deprecated
     */

    verticalAlignment?: Position;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as top side.
     * * Far - Align the annotation element as bottom side.
     * * Center - Align the annotation element as mid point.
     * @default 'Center'
     * @deprecated
     */

    horizontalAlignment?: Alignment;

    /**
     * Information about annotation for assistive technology.
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class AccumulationDataLabelSettings
 */
export interface AccumulationDataLabelSettingsModel {

    /**
     * If set true, data label for series gets render.
     * @default false
     */

    visible?: boolean;

    /**
     * If set true, data label for zero values in series gets render.
     * @default true
     */

    showZero?: boolean;

    /**
     * The DataSource field which contains the data label value.
     * @default null
     */

    name?: string;

    /**
     * The background color of the data label, which accepts value in hex, rgba as a valid CSS color string.
     * @default 'transparent'
     */

    fill?: string;

    /**
     * Specifies the position of data label. They are.
     * * Outside - Places label outside the point.
     * * Inside - Places label inside the point.
     * @default 'Inside'
     */

    position?: AccumulationLabelPosition;

    /**
     * The roundedCornerX for the data label. It requires `border` values not to be null.
     * @default 5
     */
    rx?: number;

    /**
     * The roundedCornerY for the data label. It requires `border` values not to be null.
     * @default 5
     */
    ry?: number;

    /**
     * Specifies angle for data label.
     * @default 0
     */
    angle?: number;

    /**
     * Enables rotation for data label.
     * @default false
     */

    enableRotation?: boolean;

    /**
     * Option for customizing the border lines.
     */

    border?: BorderModel;

    /**
     * Option for customizing the data label text.
     */

    font?: FontModel;

    /**
     * Options for customize the connector line in series.
     * This property is applicable for Pie, Funnel and Pyramid series.
     * The default connector length for Pie series is '4%'. For other series, it is null.
     */
    connectorStyle?: ConnectorModel;

    /**
     * Custom template to format the data label content. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     * @default null
     */

    template?: string;

}

/**
 * Interface for a class PieCenter
 */
export interface PieCenterModel {

    /**
     * X value of the center.
     * @default '50%'
     */
    x?: string;

    /**
     * Y value of the center.
     * @default '50%'
     */
    y?: string;

}

/**
 * Interface for a class AccPoints
 */
export interface AccPointsModel {

}

/**
 * Interface for a class AccumulationSeries
 */
export interface AccumulationSeriesModel {

    /**
     * Specifies the dataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let pie: AccumulationChart = new AccumulationChart({
     * ...
     *     series: [{
     *        dataSource: dataManager,
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Specifies Query to select data from dataSource. This property is applicable only when the dataSource is `ej.DataManager`.
     * @default null
     */
    query?: Query;

    /**
     * The DataSource field which contains the x value.
     * @default ''
     */

    xName?: string;

    /**
     * Specifies the series name
     * @default ''
     */

    name?: string;

    /**
     * The provided value will be considered as a Tooltip Mapping name
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * The DataSource field which contains the y value.
     * @default ''
     */

    yName?: string;

    /**
     * Specifies the series visibility.
     * @default true
     */

    visible?: boolean;

    /**
     * Options for customizing the border of the series.
     */

    border?: BorderModel;

    /**
     * Options for customizing the animation for series.
     */

    animation?: AnimationModel;

    /**
     * The shape of the legend. Each series has its own legend shape. They are
     * * Circle - Renders a circle.
     * * Rectangle - Renders a rectangle.
     * * Triangle - Renders a triangle.
     * * Diamond - Renders a diamond.
     * * Cross - Renders a cross.
     * * HorizontalLine - Renders a horizontalLine.
     * * VerticalLine - Renders a verticalLine.
     * * Pentagon - Renders a pentagon.
     * * InvertedTriangle - Renders a invertedTriangle.
     * * SeriesType -Render a legend shape based on series type.
     * @default 'SeriesType'
     */

    legendShape?: LegendShape;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series
     * @default ''
     */

    pointColorMapping?: string;

    /**
     * Custom style for the selected series or points.
     * @default null
     */
    selectionStyle?: string;

    /**
     * AccumulationSeries y values less than groupTo are combined into single slice named others
     * @default null
     */
    groupTo?: string;

    /**
     * AccumulationSeries y values less than groupMode are combined into single slice named others
     * @default Value
     */
    groupMode?: GroupModes;

    /**
     * The data label for the series.
     */
    dataLabel?: AccumulationDataLabelSettingsModel;

    /**
     * Palette for series points.
     * @default []
     */
    palettes?: string[];

    /**
     * Start angle for a series.
     * @default 0
     */
    startAngle?: number;

    /**
     * End angle for a series.
     * @default null
     */
    endAngle?: number;

    /**
     * Radius of the pie series and its values in percentage.
     * @default '80%'
     */
    radius?: string;

    /**
     * When the innerRadius value is greater than 0 percentage, a donut will appear in pie series. It takes values only in percentage.
     * @default '0'
     */
    innerRadius?: string;

    /**
     * Specify the type of the series in accumulation chart.
     * @default 'Pie'
     */
    type?: AccumulationType;

    /**
     * To enable or disable tooltip for a series.
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * If set true, series points will be exploded on mouse click or touch.
     * @default false
     */
    explode?: boolean;

    /**
     * Distance of the point from the center, which takes values in both pixels and percentage.
     * @default '30%'
     */
    explodeOffset?: string;

    /**
     * If set true, all the points in the series will get exploded on load.
     * @default false
     */
    explodeAll?: boolean;

    /**
     * Index of the point, to be exploded on load.
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    explodeIndex?: number;

    /**
     * options to customize the empty points in series
     */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
     * Defines the distance between the segments of a funnel/pyramid series. The range will be from 0 to 1
     * @default 0
     */
    gapRatio?: number;

    /**
     * Defines the width of the funnel/pyramid with respect to the chart area
     * @default '80%'
     */
    width?: string;

    /**
     * Defines the height of the funnel/pyramid with respect to the chart area
     * @default '80%'
     */
    height?: string;

    /**
     * Defines the width of the funnel neck with respect to the chart area
     * @default '20%'
     */
    neckWidth?: string;

    /**
     * Defines the height of the funnel neck with respect to the chart area
     * @default '20%'
     */
    neckHeight?: string;

    /**
     * Defines how the values have to be reflected, whether through height/surface of the segments
     * @default 'Linear'
     */
    pyramidMode?: PyramidModes;

    /**
     * The opacity of the series.
     * @default 1.
     */
    opacity?: number;

}