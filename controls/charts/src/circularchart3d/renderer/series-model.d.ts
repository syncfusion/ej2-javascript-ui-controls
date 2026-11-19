import { Browser, ChildProperty, Complex, Property, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';import { AnimationModel } from '../../common/model/base-model';import { Animation } from '../../common/model/base';import { ChartLocation, appendChildElement, stringToNumber } from '../../common/utils/helper';import { Rect, Size } from '@syncfusion/ej2-svg-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { EmptyPointMode, LegendShape } from '../../common/utils/enum';import { Data } from '../../common/model/data';import { CircularChart3D } from '../circularchart3d';import { pointRender, seriesRender } from '../../common/model/constants';import { getCircular3DSeriesColor } from '../model/theme';import { CircularChart3DPointRenderEventArgs, CircularChart3DSeriesRenderEventArgs, CircularChart3DTextRenderEventArgs } from '../model/pie-interface';import { CircularChart3DDataLabelSettings } from './dataLabel';import { CircularChart3DDataLabelSettingsModel } from './dataLabel-model';import { CircularChart3DLegendSettingsModel } from '../legend/legend-model';import { CircularChart3DPolygon, CircularChart3DSegments, CircularChart3DSeriesStyle, CircularChart3DSymbolLocation, CircularChart3DTitlePosition, CircularChart3DVector } from '../model/circular3d-base';

/**
 * Interface for a class CircularChart3DPoints
 */
export interface CircularChart3DPointsModel {

}

/**
 * Interface for a class CircularChart3DEmptyPointSettings
 */
export interface CircularChart3DEmptyPointSettingsModel {

    /**
     * Customize the fill color of empty points.
     *
     * @default null
     */
    fill?: string;

    /**
     * Customize the mode of empty points.
     *
     * @default Gap
     */
    mode?: EmptyPointMode;

}

/**
 * Interface for a class CircularChart3DSeries
 */
export interface CircularChart3DSeriesModel {

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
     * let pie: CircularChart3D = new CircularChart3D({
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
     *
     * @default ''
     */
    dataSource?: Object | DataManager;

    /**
     * Specifies the query to select data from the dataSource. This property is applicable only when the dataSource is `ej.DataManager`.
     *
     * @default null
     */
    query?: Query;

    /**
     * The DataSource field that contains the x value
     *
     * @default ''
     */
    xName?: string;

    /**
     * The name of the series as displayed in the legend.
     *
     * @default ''
     */
    name?: string;

    /**
     * The data source field that contains the tooltip value.
     *
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * The DataSource field that contains the y value.
     *
     * @default ''
     */
    yName?: string;

    /**
     * Specifies the visibility of the series.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Options for customizing the animation of the series.
     */
    animation?: AnimationModel;

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
     *
     * @default 'SeriesType'
     */

    legendShape?: LegendShape;

    /**
     * The URL for the image that is to be displayed as a legend icon. It requires `legendShape` value to be an `Image`.
     *
     * @default ''
     */
    legendImageUrl?: string;

    /**
     * The DataSource field that contains the point colors.
     *
     * @default ''
     */
    pointColorMapping?: string;

    /**
     * The data label settings for the circular 3D series.
     */
    dataLabel?: CircularChart3DDataLabelSettingsModel;

    /**
     * Palette configuration for the points in the circular 3D series.
     *
     * @default []
     */
    palettes?: string[];

    /**
     * Specifies the radius of the pie series in percentage. Set to `null` for default.
     *
     * @default null
     */
    radius?: string;

    /**
     * When the innerRadius value is greater than 0 percentage, a donut will appear in the pie series. It takes values only in percentage.
     *
     * @default '0'
     */
    innerRadius?: string;

    /**
     * Specifies whether the tooltip is enabled or disabled for the circular 3D series.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * If set true, series points will be exploded on mouse click or touch.
     *
     * @default false
     */
    explode?: boolean;

    /**
     * Distance of the point from the center, which takes values in both pixels and percentage.
     *
     * @default '30%'
     */
    explodeOffset?: string;

    /**
     * If set true, all the points in the series will get exploded on load.
     *
     * @default false
     */
    explodeAll?: boolean;

    /**
     * Index of the point to be exploded on load. Set to `null` for no explosion.
     *
     * @default null
     */
    explodeIndex?: number;

    /**
     * Options to customize the appearance of empty points in the circular 3D series.
     */
    emptyPointSettings?: CircularChart3DEmptyPointSettingsModel;

    /**
     * The opacity of the series.
     *
     * @default 1.
     */
    opacity?: number;

}

/**
 * Interface for a class PieSeries3D
 */
export interface PieSeries3DModel {

}