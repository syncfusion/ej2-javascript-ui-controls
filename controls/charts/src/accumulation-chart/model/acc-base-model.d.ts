import { Property, ChildProperty, Complex, createElement, Browser, animationMode, extend } from '@syncfusion/ej2-base';import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Border, Font, Animation, EmptyPointSettings, Connector, Accessibility } from '../../common/model/base';import { Rect, Size, PathOption, measureText } from '@syncfusion/ej2-svg-base';import { ChartLocation, stringToNumber, appendChildElement, subtractRect } from '../../common/utils/helper';import { AccumulationType, AccumulationLabelPosition, PyramidModes } from '../model/enum';import { IAccSeriesRenderEventArgs, IAccPointRenderEventArgs, IAccTextRenderEventArgs } from '../model/pie-interface';import { LegendShape, SelectionPattern } from '../../common/utils/enum';import { Data } from '../../common/model/data';import { seriesRender, pointRender } from '../../common/model/constants';import { getSeriesColor } from '../../common/model/theme';import { FontModel, BorderModel, AnimationModel, ConnectorModel, EmptyPointSettingsModel, AccessibilityModel } from '../../common/model/base-model';import { AccumulationChart } from '../accumulation';import { getElement, firstToLowerCase } from '../../common/utils/helper';import { Units, Alignment, Regions, Position, SeriesCategories, LabelOverflow, TextWrap } from '../../common/utils/enum';import { GroupModes } from './enum';import { BaseSelection } from '../../common/user-interaction/selection';import { LegendOptions } from '../../common/legend/legend';

/**
 * Interface for a class AccumulationAnnotationSettings
 */
export interface AccumulationAnnotationSettingsModel {

    /**
     * The content of the annotation, which can also accept the ID of a custom element.
     *
     * @default null
     */
    content?: string;

    /**
     * If `coordinateUnit` is set to `Pixel`, x specifies the pixel value.
     * If `coordinateUnit` is set to `Point`, x specifies the data value.
     *
     * @default '0'
     */
    x?: string | Date | number;

    /**
     * If `coordinateUnit` is set to `Pixel`, y specifies the pixel value.
     * If `coordinateUnit` is set to `Point`, y specifies the data value.
     *
     * @default '0'
     */
    y?: string | number;

    /**
     * Specifies the coordinate units of the annotation.
     * The options are:
     * * Pixel - Renders the annotation based on x and y pixel values.
     * * Point - Renders the annotation based on x and y data values.
     *
     * @default 'Pixel'
     */

    coordinateUnits?: Units;

    /**
     * Specifies the regions of the annotation.
     * The options are:
     * * Chart - Renders the annotation based on chart coordinates.
     * * Series - Renders the annotation based on series coordinates.
     *
     * @default 'Chart'
     */

    region?: Regions;

    /**
     * Specifies the position of the annotation.
     * The options are
     * * Top - Aligns the annotation element to the top side.
     * * Bottom - Aligns the annotation element to the bottom side.
     * * Middle - Aligns the annotation element to the midpoint.
     *
     * @default 'Middle'
     * @deprecated
     */

    verticalAlignment?: Position;

    /**
     * Specifies the alignment of the annotation.
     * The options are:
     * * Near - Aligns the annotation element to the top side.
     * * Far - Aligns the annotation element to the bottom side.
     * * Center - Aligns the annotation element to the midpoint.
     *
     * @default 'Center'
     * @deprecated
     */

    horizontalAlignment?: Alignment;

    /**
     * A description for the annotation that provides additional information about its content for screen readers.
     *
     * @default null
     */
    description?: string;

}

/**
 * Interface for a class AccumulationDataLabelSettings
 */
export interface AccumulationDataLabelSettingsModel {

    /**
     * If set to true, data labels for the series are render. By default, it is set to false.
     *
     * @default false
     */

    visible?: boolean;

    /**
     * If set to true, the data label for zero values in the series will be rendered.
     *
     * @default true
     */

    showZero?: boolean;

    /**
     * Specifies the data source field that contains the data label value.
     *
     * @default null
     */

    name?: string;

    /**
     * The background color of the data label accepts hex and rgba values as valid CSS color strings.
     *
     * @default 'transparent'
     */

    fill?: string;

    /**
     * Specifies the position of the data label relative to the data point.
     * The available options are:
     * * Outside - Places the data label outside the data point, which is typically used to avoid overlap with the data point.
     * * Inside - Places the data label inside the data point, which is useful for displaying labels within the data point.
     *
     * @default 'Inside'
     */

    position?: AccumulationLabelPosition;

    /**
     * Specifies the X-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    rx?: number;

    /**
     * Specifies the Y-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    ry?: number;

    /**
     * Specifies the rotation angle of the data label.
     *
     * @default 0
     */
    angle?: number;

    /**
     * If set to true, the data label will be rotated according to the specified angle.
     *
     * @default false
     */

    enableRotation?: boolean;

    /**
     * Configures the appearance of the border lines with options for width and color properties.
     */

    border?: BorderModel;

    /**
     * Customizes the appearance of the data label text with options for font size, color, style, weight, and family.
     */

    font?: FontModel;

    /**
     * Options to customize the connector line in the series.
     * By default, the connector length for the Pie series is set to '4%'. For other series, it is set to `null`.
     */
    connectorStyle?: ConnectorModel;

    /**
     * Custom template to format the content of the data label.
     * Use `${point.x}` and `${point.y}` as placeholders to display the corresponding data point values.
     *
     * @default null
     * @aspType string
     */

    template?: string | Function;

    /**
     * Used to format the data label, accepting global string formats like `C`, `n1`, `P`, etc.
     * It also supports placeholders, such as `{value}°C`, where `{value}` represent the point data label (e.g., 20°C).
     *
     * @default ''
     */
    format?: string;

    /**
     * Use this property to limit the label width and apply wrapping or trimming.
     *
     * @default 'null'
     */

    maxWidth?: number;

    /**
     * Defines the text overflow behavior for the data label when the text exceeds the bounds.
     * Available options are:
     * * Clip - Truncates the data label when it overflows the bounds.
     * * Ellipsis - Displays an ellipsis ("...") at the end of the data label when it overflows the bounds.
     * Set the maximum width of the label using the `maxWidth` property.
     *
     * @default 'Ellipsis'
     */

    textOverflow?: LabelOverflow;

    /**
     * Defines the text wrap behavior for the data label when it overflows the bounds.
     * Available options are:
     * * Normal - Truncates the data label when it overflows the bounds.
     * * Wrap - Breaks the data label into multiple lines when it is too long to fit on a single line.
     * * AnyWhere - Breaks the data label at any point if there are no otherwise acceptable break points.
     * Set the maximum width of the label using the `maxWidth` property.
     *
     * @default 'Normal'
     */

    textWrap?: TextWrap;

}

/**
 * Interface for a class PieCenter
 */
export interface PieCenterModel {

    /**
     * Specifies the x-coordinate of the center position for the Pie series in the chart.
     *
     * @default '50%'
     */
    x?: string;

    /**
     * Specifies the y-coordinate of the center position for the Pie series in the chart.
     *
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
     * Specifies the data source for the series. It can be an array of JSON objects, or an instance of DataManager.
     * ```html
     * <div id='Pie'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *    url: 'https://services.syncfusion.com/js/production/api/orders'
     * });
     * let query: Query = new Query().take(5);
     * let pie: AccumulationChart = new AccumulationChart({
     * ...
     *     series: [{
     *        dataSource: dataManager,
     *        xName: 'CustomerID',
     *        yName: 'Freight',
     *        query: query
     *    }],
     * ...
     * });
     * pie.appendTo('#Pie');
     * ```
     *
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Specifies a query to select data from the data source. This property is applicable only when the data source is an `ej.DataManager`.
     *
     * @default null
     */
    query?: Query;

    /**
     * The data source field that contains the x value.
     *
     * @default ''
     */

    xName?: string;

    /**
     * The `name` property allows for setting a name for the series.
     *
     * @default ''
     */

    name?: string;

    /**
     * The data source field that contains the value to be displayed in the tooltip.
     *
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * The data source field that contains the y value.
     *
     * @default ''
     */

    yName?: string;

    /**
     * If set to true, the series will be visible. If set to false, the series will be hidden.
     *
     * @default true
     */

    visible?: boolean;

    /**
     * Options for customizing the border of the series.
     */

    border?: BorderModel;

    /**
     * Options for customizing the animation of the series.
     * By default, animation is enabled with a duration of 1000 milliseconds (about 1 second). It can be disabled by setting enable to `false`.
     * The following properties are supported in animation:
     * * enable: If set to true, the series is animated on initial loading.
     * * duration: The duration of the animation in milliseconds.
     * * delay: The delay before the animation starts, in milliseconds.
     */

    animation?: AnimationModel;

    /**
     * Specifies the shape of the legend icon for each data point.
     * Available shapes for legend:
     * * Circle - Renders a circular icon.
     * * Rectangle - Renders a rectangular icon.
     * * Triangle - Renders a triangular icon.
     * * Diamond - Renders a diamond-shaped icon.
     * * Cross - Renders a cross-shaped icon.
     * * HorizontalLine - Renders a horizontal line icon.
     * * VerticalLine - Renders a vertical line icon.
     * * Pentagon - Renders a pentagon-shaped icon.
     * * InvertedTriangle - Renders an inverted triangle-shaped icon.
     * * SeriesType - Uses the default icon shape based on the series type.
     * * Image - Renders a custom image for the legend icon.
     *
     * @default 'SeriesType'
     */

    legendShape?: LegendShape;

    /**
     * The URL for the image to be displayed as a legend icon.
     > Note that `legendShape` must be set to `Image`.
     *
     * @default ''
     */

    legendImageUrl?: string;

    /**
     * The data source field that contains the color value of a point.
     * It is applicable for series.
     *
     * @default ''
     */

    pointColorMapping?: string;

    /**
     * When set to true, a different pattern is applied to each slice of the pie.
     *
     * @default false
     */
    applyPattern?: boolean;

    /**
     * The `selectionStyle` property is used to specify custom CSS styles for the selected series or points.
     *
     * @default null
     */
    selectionStyle?: string;

    /**
     * The y-values of the accumulation series that are less than `groupTo` are combined into a single slice named 'others'.
     *
     * @default null
     */
    groupTo?: string;

    /**
     * In the accumulation series, y-values less than `groupMode` are combined into a single slice named 'others'.
     *
     * @default Value
     */
    groupMode?: GroupModes;

    /**
     * The data label property can be used to show the data label and customize its position and styling.
     */
    dataLabel?: AccumulationDataLabelSettingsModel;

    /**
     * The `palettes` array defines a set of colors used for rendering the accumulation chart's points. Each color in the array is applied to each point in order.
     *
     * @default []
     */
    palettes?: string[];

    /**
     * Specifies the starting angle for the series, in degrees.
     *
     * @default 0
     */
    startAngle?: number;

    /**
     * Specifies the ending angle for the series, in degrees.
     *
     * @default null
     */
    endAngle?: number;

    /**
     * Specifies the radius of the pie series as a percentage of the chart's size.
     *
     * @default null
     */
    radius?: string;

    /**
     * When the `innerRadius` value is greater than 0%, a donut shape will appear in the pie series. It accepts only percentage values.
     *
     * @default '0'
     */
    innerRadius?: string;

    /**
     * Specifies the type of series in the accumulation chart.
     *
     * @default 'Pie'
     */
    type?: AccumulationType;

    /**
     * Controls whether the tooltip for the accumulation chart series is enabled or disabled. Set to true to display tooltips on hover, or false to hide them.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * If set to true, series points will explode on mouse click or touch.
     *
     * @default false
     */
    explode?: boolean;

    /**
     * Specifies the distance of the point from the center, which can be defined in both pixels and percentage.
     *
     * @default '30%'
     */
    explodeOffset?: string;

    /**
     * If set to true, all the points in the series will explode on load.
     *
     * @default false
     */
    explodeAll?: boolean;

    /**
     * Index of the point in the series to be exploded on initial load.
     *
     * @default null
     *
     * @aspDefaultValueIgnore
     *
     * @blazorDefaultValue Double.NaN
     */
    explodeIndex?: number;

    /**
     * Customization options for the appearance of empty points in the series, where `null` or `undefined` values are considered as empty points.
     */
    emptyPointSettings?: EmptyPointSettingsModel;

    /**
     * Defines the distance between the segments of a funnel or pyramid series.
     * The range is from 0 to 1.
     *
     * @default 0
     */
    gapRatio?: number;

    /**
     * Defines the width of the funnel or pyramid series relative to the chart area.
     *
     * @default '80%'
     */
    width?: string;

    /**
     * Defines the height of the funnel or pyramid series relative to the chart area.
     *
     * @default '80%'
     */
    height?: string;

    /**
     * Defines the width of the funnel neck relative to the chart area.
     *
     * @default '20%'
     */
    neckWidth?: string;

    /**
     * Defines the height of the funnel neck relative to the chart area.
     *
     * @default '20%'
     */
    neckHeight?: string;

    /**
     * Defines how the values are represented, either through the height or surface area of the segments.
     *
     * @default 'Linear'
     */
    pyramidMode?: PyramidModes;

    /**
     * Sets the opacity of the series, with a value between 0 and 1 where 0 is fully transparent and 1 is fully opaque.
     *
     * @default 1.
     */
    opacity?: number;

    /**
     * Defines the pattern of dashes and gaps for the series border.
     *
     * @default '0'
     */

    dashArray?: string;

    /**
     * Options to improve accessibility for series elements.
     */
    accessibility?: AccessibilityModel;

    /**
     * Option for customizing the border radius.
     *
     * @default 0
     */
    borderRadius?: number;

    /**
     * Updates the data source for the series.
     *
     * @function setData
     * @param {Object} data – Updated data source for the series.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    setData?(data: Object[], duration?: number) : void

    /**
     * Adds a data point to the data source for the series.
     *
     * @function addPoint
     * @param {Object} dataPoint - The data point to be added.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    addPoint?(dataPoint: Object, duration?: number) : void

    /**
     * Removes a data point from the series data source at the specified index.
     *
     * @function removePoint
     * @param {number} index – The index of the data point to be removed from the series.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    removePoint?(index: number, duration?: number) : void

}