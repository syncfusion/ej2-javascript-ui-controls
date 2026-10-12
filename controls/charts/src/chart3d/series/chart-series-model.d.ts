import { Property, ChildProperty, Complex, DateFormatOptions } from '@syncfusion/ej2-base';import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';import { getVisiblePoints, StackValues } from '../../common/utils/helper';import { firstToLowerCase } from '../../common/utils/helper';import { Rect } from '@syncfusion/ej2-svg-base';import { BorderModel, MarginModel, AnimationModel } from '../../common/model/base-model';import { Border, Margin, Animation } from '../../common/model/base';import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';import { Chart3DAxis, Chart3DColumn, Chart3DRow } from '../axis/axis';import { Data } from '../../common/model/data';import { seriesRender } from '../../common/model/constants';import { EmptyPointMode, LegendShape, SeriesCategories, ShapeType } from '../../common/utils/enum';import { setRange } from '../../common/utils/helper';import { Chart3D } from '../chart3D';import { Chart3DSeriesRenderEventArgs, Chart3DStyleOptions, Chart3DLocation, Chart3DRangeValues, Chart3DRectPosition, Chart3DDepthInfoType, Chart3DTextFont } from '../model/chart3d-Interface';import { Chart3DSeriesType, Chart3DDataLabelPosition } from '../utils/enum';import { getMinPointsDeltaValue } from '../utils/chart3dRender';import { Chart3DTextFontModel } from '../model/chart3d-Interface-model';

/**
 * Interface for a class Chart3DDataLabelSettings
 */
export interface Chart3DDataLabelSettingsModel {

    /**
     * If set true, data label for series renders.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * The DataSource field that contains the data label value.
     *
     * @default null
     */
    name?: string;

    /**
     * The background color of the data label accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */
    fill?: string;

    /**
     * Used to format the point data label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the point data label, e.g, 20°C.
     *
     * @default null
     */
    format?: string;

    /**
     * The opacity for the background.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Specifies angle for data label.
     *
     * @default 0
     */
    angle?: number;

    /**
     * Enables rotation for data label.
     *
     * @default false
     */
    enableRotation?: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     *
     * @default 'Middle'
     */
    position?: Chart3DDataLabelPosition;

    /**
     * Option for customizing the border lines.
     */
    border?: BorderModel;

    /**
     * Margin configuration for the data label.
     */
    margin?: MarginModel;

    /**
     * Option for customizing the data label text.
     */
    font?: Chart3DTextFontModel;

    /**
     * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

}

/**
 * Interface for a class Chart3DEmptyPointSettings
 */
export interface Chart3DEmptyPointSettingsModel {

    /**
     * To customize the fill color of empty points.
     *
     * @default null
     */

    fill?: string;

    /**
     * To customize the mode of empty points.
     *
     * @default Gap
     */

    mode?: EmptyPointMode;

}

/**
 * Interface for a class Chart3DPoint
 */
export interface Chart3DPointModel {

}

/**
 * Interface for a class Chart3DSeries
 */
export interface Chart3DSeriesModel {

    /**
     * The DataSource field that contains the x value.
     *
     * @default ''
     */
    xName?: string;

    /**
     * The DataSource field that contains the point colors.
     *
     * @default ''
     */
    pointColorMapping?: string;

    /**
     * Specifies the visibility of series.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     *
     * @default null
     */
    xAxisName?: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     *
     * @default null
     */
    yAxisName?: string;

    /**
     * Options to customizing animation for the series.
     */
    animation?: AnimationModel;

    /**
     * The fill color for the series, which can accept values in hex or rgba as a valid CSS color string.
     *
     * @default null
     */
    fill?: string;

    /**
     * Specifies the data source for the series. It can be an array of JSON objects or an instance of DataManager.
     *
     *
     * @default ''
     */
    dataSource?: Object | DataManager;

    /**
     * Specifies a query to select data from the DataSource. This property is applicable only when the DataSource is an `ej.DataManager`.
     *
     * @default ''
     */
    query?: Query;

    /**
     * The data label for the series.
     */
    dataLabel?: Chart3DDataLabelSettingsModel;

    /**
     * The name of the series as displayed in the legend.
     *
     * @default ''
     */
    name?: string;

    /**
     * The DataSource field that contains the y value.
     *
     * @default ''
     */
    yName?: string;

    /**
     * The DataSource field that contains the size value of y
     *
     * @default ''
     */
    size?: string;

    /**
     * This property allows grouping series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     *
     * @default ''
     */
    stackingGroup?: string;

    /**
     * The opacity of the series.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Defines the name that specifies the chart series are mutually exclusive and can be overlaid.
     * The axis in the same group shares the same baseline and location on the corresponding axis.
     *
     * @default ''
     */
    groupName?: string;

    /**
     * Specifies the type of the series in the 3D chart. Available options include:
     * - Column
     * - Bar
     * - StackingColumn
     * - StackingBar
     * - StackingColumn100
     * - StackingBar100
     *
     * @default 'Column'
     */
    type?: Chart3DSeriesType;

    /**
     * Enable tooltip for the chart series.
     *
     * @default true
     */
    enableTooltip?: boolean;

    /**
     * Format of the tooltip content.
     *
     * @default ''
     */
    tooltipFormat?: string;

    /**
     * The data source field that contains the tooltip value.
     *
     * @default ''
     */
    tooltipMappingName?: string;

    /**
     * The shape of the legend. Each series has its own legend shape, which can be one of the following:
     * * Circle
     * * Rectangle
     * * Triangle
     * * Diamond
     * * Cross
     * * HorizontalLine
     * * VerticalLine
     * * Pentagon
     * * InvertedTriangle
     * * SeriesType
     * * Image
     *
     * @default 'SeriesType'
     */
    legendShape?: LegendShape;

    /**
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     *
     * @default ''
     */
    legendImageUrl?: string;

    /**
     * options to customize the empty points in series.
     */
    emptyPointSettings?: Chart3DEmptyPointSettingsModel;

    /**
     * Render the column series points with a particular column width.
     *
     * @default null
     */
    columnWidth?: number;

    /**
     * Defines the shape of the data in a column and bar chart.
     * Rectangle: Displays the data in a column and bar chart in a rectangle shape.
     * Cylinder: Displays the data in a column and bar chart in a cylinder shape.
     *
     * @default 'Rectangle'
     */
    columnFacet?: ShapeType;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     *
     * @default 0.1
     */
    columnSpacing?: number;

}