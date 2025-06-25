import { Component, Property, NotifyPropertyChanges, Internationalization, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { ModuleDeclaration, L10n, setValue, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';import { TapEventArgs, EmitType, ChildProperty } from '@syncfusion/ej2-base';import { remove, extend } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Browser, Touch } from '@syncfusion/ej2-base';import { Event, EventHandler, Complex, Collection } from '@syncfusion/ej2-base';import { findClipRect, showTooltip, ImageOption, removeElement, appendChildElement, blazorTemplatesReset, withInBounds, getValueXByPoint, getValueYByPoint } from '../common/utils/helper';import { textElement, RectOption, createSvg, firstToLowerCase, titlePositionX, PointData, redrawElement, getTextAnchor } from '../common/utils/helper';import { appendClipElement, ChartLocation } from '../common/utils/helper';import { MarginModel, BorderModel, TooltipSettingsModel, IndexesModel, titleSettingsModel, ChartAreaModel, AccessibilityModel } from '../common/model/base-model';import { getSeriesColor, getThemeColor } from '../common/model/theme';import { Margin, Border, TooltipSettings, Indexes, ChartArea, titleSettings, Accessibility } from '../common/model/base';import { AxisModel, RowModel, ColumnModel } from './axis/axis-model';import { Row, Column, Axis } from './axis/axis';import { Highlight } from './user-interaction/high-light';import { CartesianAxisLayoutPanel } from './axis/cartesian-panel';import { DateTime } from './axis/date-time-axis';import { Category } from './axis/category-axis';import { DateTimeCategory } from './axis/date-time-category-axis';import { CandleSeries } from './series/candle-series';import { ErrorBar } from './series/error-bar';import { Logarithmic } from './axis/logarithmic-axis';import { Rect, measureText, TextOption, Size, SvgRenderer, BaseAttibutes, CanvasRenderer } from '@syncfusion/ej2-svg-base';import { ChartData } from './utils/get-data';import { LineType, ZoomMode, ToolbarItems } from './utils/enum';import { SelectionMode, HighlightMode, ChartTheme } from '../common/utils/enum';import { Points, Series, SeriesBase } from './series/chart-series';import { LastValueLabelSettingsModel, SeriesModel } from './series/chart-series-model';import { Data } from '../common/model/data';import { LineSeries } from './series/line-series';import { AreaSeries } from './series/area-series';import { BarSeries } from './series/bar-series';import { HistogramSeries } from './series/histogram-series';import { StepLineSeries } from './series/step-line-series';import { StepAreaSeries } from './series/step-area-series';import { ColumnSeries } from './series/column-series';import { ParetoSeries } from './series/pareto-series';import { StackingColumnSeries } from './series/stacking-column-series';import { StackingBarSeries } from './series/stacking-bar-series';import { StackingAreaSeries } from './series/stacking-area-series';import { StackingStepAreaSeries } from './series/stacking-step-area-series';import { StackingLineSeries } from './series/stacking-line-series';import { ScatterSeries } from './series/scatter-series';import { SplineSeries } from './series/spline-series';import { SplineAreaSeries } from './series/spline-area-series';import { RangeColumnSeries } from './series/range-column-series';import { PolarSeries } from './series/polar-series';import { RadarSeries } from './series/radar-series';import { HiloSeries } from './series/hilo-series';import { HiloOpenCloseSeries } from './series/hilo-open-close-series';import { WaterfallSeries } from './series/waterfall-series';import { BubbleSeries } from './series/bubble-series';import { RangeAreaSeries } from './series/range-area-series';import { RangeStepAreaSeries } from './series/range-step-area-series';import { SplineRangeAreaSeries } from './series/spline-range-area-series';import { Tooltip } from './user-interaction/tooltip';import { Crosshair } from './user-interaction/crosshair';import { DataEditing } from './user-interaction/data-editing';import { Marker, markerShapes } from './series/marker';import { LegendSettings } from '../common/legend/legend';import { LegendSettingsModel } from '../common/legend/legend-model';import { Legend } from './legend/legend';import { Zoom } from './user-interaction/zooming';import { Selection } from './user-interaction/selection';import { DataLabel } from './series/data-label';import { LastValueLabel } from './series/last-value-label';import { StripLine } from './axis/strip-line';import { MultiLevelLabel } from './axis/multi-level-labels';import { BoxAndWhiskerSeries } from './series/box-and-whisker-series';import { PolarRadarPanel } from './axis/polar-radar-panel';import { StripLineSettingsModel, ToolbarPositionModel, StackLabelSettingsModel } from './model/chart-base-model';import { Trendline } from './series/chart-series';import { Trendlines } from './trend-lines/trend-line';import { TechnicalIndicator } from './technical-indicators/technical-indicator';import { SmaIndicator } from './technical-indicators/sma-indicator';import { EmaIndicator } from './technical-indicators/ema-indicator';import { TmaIndicator } from './technical-indicators/tma-indicator';import { AccumulationDistributionIndicator } from './technical-indicators/ad-indicator';import { AtrIndicator } from './technical-indicators/atr-indicator';import { BollingerBands } from './technical-indicators/bollinger-bands';import { MomentumIndicator } from './technical-indicators/momentum-indicator';import { StochasticIndicator } from './technical-indicators/stochastic-indicator';import { MacdIndicator } from './technical-indicators/macd-indicator';import { RsiIndicator } from './technical-indicators/rsi-indicator';import { TechnicalIndicatorModel } from './technical-indicators/technical-indicator-model';import { ILegendRenderEventArgs, IAxisLabelRenderEventArgs, ITextRenderEventArgs, IResizeEventArgs } from '../chart/model/chart-interface';import { IAnnotationRenderEventArgs, IAxisMultiLabelRenderEventArgs, IThemeStyle, IScrollEventArgs } from '../chart/model/chart-interface';import { IPointRenderEventArgs, ISeriesRenderEventArgs, ISelectionCompleteEventArgs } from '../chart/model/chart-interface';import { IDragCompleteEventArgs, ITooltipRenderEventArgs } from '../chart/model/chart-interface';import { IZoomCompleteEventArgs, ILoadedEventArgs, IZoomingEventArgs, IAxisLabelClickEventArgs } from '../chart/model/chart-interface';import { IMultiLevelLabelClickEventArgs, ILegendClickEventArgs, ISharedTooltipRenderEventArgs } from '../chart/model/chart-interface';import { IAnimationCompleteEventArgs, IMouseEventArgs, IPointEventArgs, IBeforeResizeEventArgs } from '../chart/model/chart-interface';import { chartMouseClick, chartDoubleClick, pointClick, pointDoubleClick, axisLabelClick, beforeResize } from '../common/model/constants';import { chartMouseDown, chartMouseMove, chartMouseUp, load, pointMove, chartMouseLeave, resized } from '../common/model/constants';import { IPrintEventArgs, IAxisRangeCalculatedEventArgs, IDataEditingEventArgs } from '../chart/model/chart-interface';import { ChartAnnotationSettingsModel } from './model/chart-base-model';import { ChartAnnotationSettings, StackLabelSettings, ToolbarPosition } from './model/chart-base';import { ChartAnnotation } from './annotation/annotation';import { getElement, getTitle } from '../common/utils/helper';import { Alignment, ExportType, SelectionPattern } from '../common/utils/enum';import { MultiColoredLineSeries } from './series/multi-colored-line-series';import { MultiColoredAreaSeries } from './series/multi-colored-area-series';import { ScrollBar } from '../common/scrollbar/scrollbar';import { DataManager } from '@syncfusion/ej2-data';import { StockChart } from '../stock-chart/stock-chart';import { Export } from './print-export/export';import { PrintUtils } from '../common/utils/print';import { IAfterExportEventArgs, IExportEventArgs } from '../common/model/interface';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RangeColorSetting
 */
export interface RangeColorSettingModel {

    /**
     * Specifies the start value of the color mapping range.
     */
    start?: number;

    /**
     * Specifies the end value of the color mapping range.
     */
    end?: number;

    /**
     * Specifies the fill colors for points that lie within the given range. If multiple colors are specified, a gradient will be applied.
     */
    colors?: string[];

    /**
     * Specifies the name or label for the range mapping item.
     */
    label?: string;

}

/**
 * Interface for a class CrosshairSettings
 */
export interface CrosshairSettingsModel {

    /**
     * If set to true, the crosshair line becomes visible.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies the pattern of dashes and gaps used to stroke the crosshair line.
     *
     * @default ''
     */
    dashArray?: string;

    /**
     * The `line` property allows defining the appearance of the crosshair line, including its color and width.
     */
    line?: BorderModel;

    /**
     * Specifies the line type for the crosshair.
     * The available modes are:
     * * None: Both vertical and horizontal crosshair lines are hidden.
     * * Both: Displays both the vertical and horizontal crosshair lines.
     * * Vertical: Shows only the vertical crosshair line.
     * * Horizontal: Shows only the horizontal crosshair line.
     *
     * @default Both
     */
    lineType?: LineType;

    /**
     * The color of the vertical crosshair line accepts values in hex and rgba as valid CSS color strings.
     *
     * @default ''
     */
    verticalLineColor?: string;

    /**
     * The color of the horizontal crosshair line accepts values in hex and rgba as valid CSS color strings.
     *
     * @default ''
     */
    horizontalLineColor?: string;

    /**
     * Specifies the opacity level for the crosshair, which controls its transparency.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * If set to `true`, the horizontal crosshair snaps to the nearest data point.
     *
     * @default false
     */
    snapToData?: boolean;

    /**
     * If set to true, highlights the entire category range when hovered over.
     * This property applies only to category axes.
     *
     * @default false
     */
    highlightCategory?: boolean;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * If set to true, the chart can be zoomed in by selecting a rectangular region on the plot area.
     *
     * @default false
     */

    enableSelectionZooming?: boolean;

    /**
     * If set to true, the chart can be pinched to zoom in and out.
     *
     * @default false
     */

    enablePinchZooming?: boolean;

    /**
     * If set to true, the chart is rendered with a toolbar on initial load.
     *
     * @default false
     */

    showToolbar?: boolean;

    /**
     * If set to true, the chart can be zoomed using the mouse wheel.
     *
     * @default false
     */

    enableMouseWheelZooming?: boolean;

    /**
     * If set to true, zooming will be performed on mouse up.
     > Note that `enableDeferredZooming` requires `enableSelectionZooming` to be true.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      enableDeferredZooming: false
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default true
     */

    enableDeferredZooming?: boolean;

    /**
     * Specifies whether to allow zooming vertically, horizontally, or in both ways.
     * Available options are:
     * * XY: Chart can be zoomed both vertically and horizontally.
     * * X: Chart can be zoomed horizontally.
     * * Y: Chart can be zoomed vertically.
     > Note that `enableSelectionZooming` must be set to true for this feature to work.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *    zoomSettings: {
     *      enableSelectionZooming: true,
     *      mode: 'XY'
     *    }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default 'XY'
     */
    mode?: ZoomMode;

    /**
     * Specifies the toolkit options for zooming as follows:
     * * Zoom - Enables the zooming tool to select and zoom into a specific region of the chart.
     * * ZoomIn - Provides a button to zoom in on the chart.
     * * ZoomOut - Provides a button to zoom out from the chart.
     * * Pan - Allows panning across the chart to explore different regions.
     * * Reset - Resets the zoom level to the default view of the chart.
     *
     * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
     */

    toolbarItems?: ToolbarItems[];

    /**
     * If set to true, the chart can be panned without requiring toolbar items. If set to false, panning is disabled, and the toolbar options must be used to pan the chart.
     *
     * @default false.
     */

    enablePan?: boolean;

    /**
     * Specifies whether the axis should have a scrollbar.
     *
     * @default false.
     */

    enableScrollbar?: boolean;

    /**
     * If set to true, the chart will animate when zooming.
     *
     * @default false.
     */

    enableAnimation?: boolean;

    /**
     * Allows customization of the zoom toolbar position. Users can set the horizontal and vertical alignment of the toolbar, as well as specify offsets for precise placement.
     */
    toolbarPosition?: ToolbarPositionModel;

    /**
     * Options to improve accessibility for zoom toolkit elements.
     */
    accessibility?: AccessibilityModel;

}

/**
 * Interface for a class Chart
 */
export interface ChartModel extends ComponentModel{

    /**
     * The width of the chart as a string, accepting input such as '100px' or '100%'.
     * If specified as '100%', the chart renders to the full width of its parent element.
     *
     * @default null
     */

    width?: string;

    /**
     * The height of the chart as a string, accepting input such as '100px' or '100%'.
     * If specified as '100%', the chart renders to the full height of its parent element.
     *
     * @default null
     */

    height?: string;

    /**
     * The title is displayed at the top of the chart to provide information about the plotted data.
     *
     * @default ''
     */

    title?: string;

    /**
     * Specifies the data source for the chart. It can be an array of JSON objects, or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *    url: 'https://services.syncfusion.com/js/production/api/orders'
     * });
     * let query: Query = new Query().take(5);
     * let chart: Chart = new Chart({
     * ...
     * dataSource: dataManager,
     *   series: [{
     *        type: 'Column',
     *        xName: 'CustomerID',
     *        yName: 'Freight',
     *        query: query
     *    }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default ''
     */

    dataSource?: Object | DataManager;

    /**
     * Options for customizing the appearance of the title, which displays information about the plotted data.
     * Use the `fontFamily`, `size`, `fontStyle`, `fontWeight`, and `color` properties in `titleSettings` to adjust the title's appearance.
     */

    titleStyle?: titleSettingsModel;

    /**
     * The subtitle is positioned below the main title and provides additional details about the data represented in the chart.
     *
     * @default ''
     */

    subTitle?: string;

    /**
     * Options for customizing the appearance of the subtitle, which displays information about the plotted data below the main title.
     * Use the `fontFamily`, `size`, `fontStyle`, `fontWeight`, and `color` properties in `titleSettings` to adjust the subtitle's appearance.
     */

    // eslint-disable-next-line max-len
    subTitleStyle?: titleSettingsModel;

    /**
     * Options to customize the margins around the chart, including the left, right, top, and bottom margins.
     * These margins refer to the space between the outer edge of the chart and its chart area.
     */

    margin?: MarginModel;

    /**
     * Options for customizing the appearance of the border in the chart by using the `color` and `width` properties in the `border`.
     */

    border?: BorderModel;

    /**
     * The background color of the chart accepts values in hex and rgba formats as valid CSS color strings.
     *
     * @default null
     */
    background?: string;

    /**
     * Configuration options for the chart area's border and background.
     */

    chartArea?: ChartAreaModel;

    /**
     * Specifies whether to display or remove the untrusted HTML values in the Chart component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * The `primaryXAxis` property configures the horizontal axis of the chart, including settings for axis labels, tick marks, grid lines, and axis ranges.
     */

    primaryXAxis?: AxisModel;

    /**
     * The `primaryYAxis` property configures the vertical axis of the chart, including settings for axis labels, tick marks, grid lines, and axis ranges.
     */

    primaryYAxis?: AxisModel;

    /**
     * Options to split the chart into multiple plotting areas horizontally.
     * Each object in the collection represents a separate plotting area (row) in the chart, allowing multiple data series to be displayed in distinct horizontal sections.
     */

    rows?: RowModel[];

    /**
     * Options to split the chart into multiple plotting areas vertically.
     * Each object in the collection represents a separate plotting area (column) in the chart, allowing multiple data series to be displayed in distinct vertical sections.
     */

    columns?: ColumnModel[];

    /**
     * Configuration options for the secondary axis in the chart.
     * Each object in the collection represents an additional axis, allowing for the plotting of multiple data series with different scales.
     */

    axes?: AxisModel[];

    /**
     * Configuration options for the chart's series.
     * Each object in the `series` collection represents a distinct data series displayed in the chart. Customize various aspects of each series such as data, type, and appearance.
     */

    series?: SeriesModel[];

    /**
     * Annotations are used to highlight specific data points or areas in the chart, providing additional context and information.
     */

    annotations?: ChartAnnotationSettingsModel[];

    /**
     * The `palettes` array defines a set of colors used for rendering the chart's series. Each color in the array is applied to the series in order.
     *
     * @default []
     */
    palettes?: string[];

    /**
     * The theme applied to the chart for visual styling.
     * Choose from predefined themes to change the overall look and feel of the chart.
     * The available themes are:
     * * Fabric
     * * FabricDark
     * * Bootstrap4
     * * Bootstrap
     * * BootstrapDark
     * * HighContrastLight
     * * HighContrast
     * * Tailwind
     * * TailwindDark
     * * Bootstrap5
     * * Bootstrap5Dark
     * * Fluent
     * * FluentDark
     * * Fluent2
     * * Fluent2Dark
     * * Fluent2HighContrast
     * * Material3
     * * Material3Dark
     * * Material
     * * MaterialDark
     *
     * @default 'Material'
     */
    theme?: ChartTheme;

    /**
     * Configuration options for the chart's tooltip, which displays details about the points when hovering over them.
     */

    tooltip?: TooltipSettingsModel;

    /**
     * The crosshair displays lines on the chart that follow the mouse cursor and show the axis values of the data points.
     */
    crosshair?: CrosshairSettingsModel;

    /**
     * The legend provides descriptive information about the data series displayed in the chart, helping to understand what each series represents.
     */
    legendSettings?: LegendSettingsModel;

    /**
     * The `rangeColorSettings` property specifies a set of rules for applying different colors to points based on their value ranges.
     */
    rangeColorSettings?: RangeColorSettingModel[];

    /**
     * Options to enable and configure the zooming feature in the chart.
     */
    zoomSettings?: ZoomSettingsModel;

    /**
     * Defines the color used to highlight a data point on mouse hover.
     *
     * @default ''
     */

    highlightColor?: string;

    /**
     * The `selectionMode` property determines how data points or series can be highlighted or selected.
     * The available options are:
     * * 'None': Disables any form of highlight or selection.
     * * 'Series': Highlights or selects an entire series of data points.
     * * 'Point': Highlights or selects a single data point.
     * * 'Cluster': Highlights or selects a group of data points that belong to the same cluster.
     * * 'DragXY': Selects points by dragging with respect to both horizontal and vertical axes.
     * * 'DragX': Selects points by dragging with respect to horizontal axis.
     * * 'DragY': Selects points by dragging with respect to vertical axis.
     * * 'Lasso': Selects points by dragging with respect to free form.
     *
     * @default None
     */
    selectionMode?: SelectionMode;

    /**
     * The `highlightMode` property determines how a series or individual data points are highlighted in the chart.
     * The available options are:
     * * 'None': Disables highlighting.
     * * 'Series': Highlights an entire series of data points.
     * * 'Point': Highlights a single data point.
     * * 'Cluster': Highlights a group of data points that belong to the same cluster.
     *
     * @default None
     */
    highlightMode?: HighlightMode;

    /**
     * The `selectionPattern` property determines how the selected data points or series are visually represented.
     * The available options are:
     * * 'None': No selection pattern is applied.
     * * 'Chessboard': Applies a chessboard pattern as the selection effect.
     * * 'Dots': Applies a dot pattern as the selection effect.
     * * 'DiagonalForward': Applies a forward diagonal line pattern as the selection effect.
     * * 'Crosshatch': Applies a crosshatch pattern as the selection effect.
     * * 'Pacman': Applies a Pacman pattern as the selection effect.
     * * 'DiagonalBackward': Applies a backward diagonal line pattern as the selection effect.
     * * 'Grid': Applies a grid pattern as the selection effect.
     * * 'Turquoise': Applies a turquoise pattern as the selection effect.
     * * 'Star': Applies a star pattern as the selection effect.
     * * 'Triangle': Applies a triangle pattern as the selection effect.
     * * 'Circle': Applies a circle pattern as the selection effect.
     * * 'Tile': Applies a tile pattern as the selection effect.
     * * 'HorizontalDash': Applies a horizontal dash pattern as the selection effect.
     * * 'VerticalDash': Applies a vertical dash pattern as the selection effect.
     * * 'Rectangle': Applies a rectangle pattern as the selection effect.
     * * 'Box': Applies a box pattern as the selection effect.
     * * 'VerticalStripe': Applies a vertical stripe pattern as the selection effect.
     * * 'HorizontalStripe': Applies a horizontal stripe pattern as the selection effect.
     * * 'Bubble': Applies a bubble pattern as the selection effect.
     *
     * @default None
     */
    selectionPattern?: SelectionPattern;

    /**
     * The `highlightPattern` property determines how the data points or series are visually highlighted.
     * The available options are:
     * * 'None': No highlighting pattern.
     * * 'Chessboard': Applies a chessboard pattern for highlighting.
     * * 'Dots': Applies a dot pattern for highlighting.
     * * 'DiagonalForward': Applies a forward diagonal line pattern for highlighting.
     * * 'Crosshatch': Applies a crosshatch pattern for highlighting.
     * * 'Pacman': Applies a Pacman pattern for highlighting.
     * * 'DiagonalBackward': Applies a backward diagonal line pattern for highlighting.
     * * 'Grid': Applies a grid pattern for highlighting.
     * * 'Turquoise': Applies a turquoise pattern for highlighting.
     * * 'Star': Applies a star pattern for highlighting.
     * * 'Triangle': Applies a triangle pattern for highlighting.
     * * 'Circle': Applies a circle pattern for highlighting.
     * * 'Tile': Applies a tile pattern for highlighting.
     * * 'HorizontalDash': Applies a horizontal dash pattern for highlighting.
     * * 'VerticalDash': Applies a vertical dash pattern for highlighting.
     * * 'Rectangle': Applies a rectangle pattern for highlighting.
     * * 'Box': Applies a box pattern for highlighting.
     * * 'VerticalStripe': Applies a vertical stripe pattern for highlighting.
     * * 'HorizontalStripe': Applies a horizontal stripe pattern for highlighting.
     * * 'Bubble': Applies a bubble pattern for highlighting.
     *
     * @default None
     */
    highlightPattern?: SelectionPattern;

    /**
     * When set to true, it allows selecting multiple data points, series, or clusters.
     > Note that the `selectionMode` must be set to `Point`, `Series`, or `Cluster` for multi-selection to be enabled.
     *
     * @default false
     */
    isMultiSelect?: boolean;

    /**
     * If set to true, enables multi-drag selection in the chart.
     * This feature allows selecting multiple data points by dragging a selection box.
     > Note that the `selectionMode` to be set to `DragX`, `DragY`, or `DragXY` for this feature to work.
     *
     * @default false
     */
    allowMultiSelection?: boolean;

    /**
     * When set to true, it enables exporting the chart to various formats such as `JPEG`, `PNG`, `SVG`, `PDF`, `XLSX`, or `CSV`.
     *
     * @default true
     */
    enableExport?: boolean;

    /**
     * To enable export feature in blazor chart.
     *
     * @default false
     */
    allowExport?: boolean;

    /**
     * Specifies the point indexes to be selected when a chart is initially loaded.
     > Note that `selectionMode` or `highlightMode` must be set to `Point`, `Series`, or `Cluster` for this feature to work.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   selectionMode: 'Point',
     *   selectedDataIndexes: [ { series: 0, point: 1},
     *                          { series: 2, point: 3} ],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default []
     */
    selectedDataIndexes?: IndexesModel[];

    /**
     * When set to true, a grouping separator will be used for numbers to separate groups of thousands in the chart.
     *
     * @default false
     */
    useGroupingSeparator?: boolean;

    /**
     * If set to true, the intervals for all the axes will be calculated automatically based on the zoomed range.
     *
     * @default false
     */
    enableAutoIntervalOnBothAxis?: boolean;

    /**
     * When set to true, the chart will render in a transposed manner, where the X and Y axes are interchanged.
     *
     * @default false
     */
    isTransposed?: boolean;

    /**
     * When set to true, the chart will render using a canvas.
     *
     * @default false
     */
    enableCanvas?: boolean;

    /**
     * The background image of the chart accepts a string value as a URL link or the location of an image.
     *
     * @default null
     */
    backgroundImage?: string;

    /**
     * Technical indicators assist in evaluating market conditions and identifying trends for making trading decisions.
     */
    indicators?: TechnicalIndicatorModel[];

    /**
     * If set to true, animation effects will be enabled for chart elements such as axis labels, gridlines, series, markers, and data labels when the legend is clicked, or the data source is updated.
     *
     * @default true
     */
    enableAnimation?: boolean;

    /**
     * A description for the chart that provides additional information about its content for screen readers.
     *
     * @default null
     * @deprecated
     */
    description?: string;

    /**
     * The `tabIndex` value determines the order in which the chart container receives focus during keyboard navigation.
     *
     * @default 1
     * @deprecated
     */
    tabIndex?: number;

    /**
     * This property controls whether columns for different series appear next to each other in a column chart.
     *
     * @default true
     */
    enableSideBySidePlacement?: boolean;

    /**
     * Options to improve accessibility for chart elements.
     */
    accessibility?: AccessibilityModel;

    /**
     * Customize the focus border color.
     * If not specified, the element will use the default focus border color.
     *
     * @default null
     */
    focusBorderColor?: string;

    /**
     * Customize the focus border width.
     * If not specified, the element will use the default focus border width.
     *
     * @default 1.5
     */
    focusBorderWidth?: number;

    /**
     * Customize the focus border margin.
     * If not specified, the element will use the default focus border margin.
     *
     * @default 0
     */
    focusBorderMargin?: number;

    /**
     * Configuration options for stack labels in the chart.
     * Stack labels display the total value for stacked series, including customization options for appearance and positioning, and other visual elements to enhance chart readability.
     * This property allows users to modify how stack labels are rendered in a stacked chart.
     */
    stackLabels?: StackLabelSettingsModel;

    /**
     * Triggers after the chart is resized.
     *
     * @event resized
     * @blazorProperty 'Resized'
     */
    resized?: EmitType<IResizeEventArgs>;

    /**
     * Triggers before the chart is resized. This event allows for modifications to the chart size before resizing occurs.
     *
     * @event beforeResize
     * @blazorProperty 'BeforeResize'
     */
    beforeResize?: EmitType<IBeforeResizeEventArgs>;

    /**
     * Triggers before the annotation gets rendered. This event allows for modifications of the annotation content and its location before it is rendered on the chart.
     *
     * @event annotationRender
     * @deprecated
     */

    annotationRender?: EmitType<IAnnotationRenderEventArgs>;

    /**
     * Triggers before the printing process starts. This event allows for the modification of the chart's HTML content before it is sent to the printer.
     *
     * @event beforePrint
     * @blazorProperty 'OnPrint'
     */

    beforePrint?: EmitType<IPrintEventArgs>;

    /**
     * Triggers after the chart has fully loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the export process begins. This event allows for the customization of export settings before the chart is exported.
     *
     * @event beforeExport
     */
    beforeExport?: EmitType<IExportEventArgs>;

    /**
     * Triggers after the export is completed.
     *
     * @event afterExport
     * @blazorProperty 'AfterExport'
     */
    afterExport?: EmitType<IAfterExportEventArgs>;

    /**
     * Triggers before the chart loads. This event allows for customization and configuration before the chart is rendered.
     *
     * @event load
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after the animation for the series is completed.
     *
     * @event animationComplete
     * @blazorProperty 'OnAnimationComplete'
     */
    animationComplete?: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Triggers before the legend is rendered. This allows the customization of legend before rendering on the chart.
     *
     * @event legendRender
     * @deprecated
     */
    legendRender?: EmitType<ILegendRenderEventArgs>;

    /**
     * Triggers before the data label for the series is rendered. This allows customization of data labels before they are rendered on the chart.
     *
     * @event textRender
     * @deprecated
     */

    textRender?: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers before each point in the series is rendered. This allows for the customization of each data point before it is rendered on the chart.
     *
     * @event pointRender
     * @deprecated
     */

    pointRender?: EmitType<IPointRenderEventArgs>;

    /**
     * Triggers before the series is rendered. This event allows for the customization of series properties before they are rendered on the chart.
     *
     * @event seriesRender
     * @deprecated
     */

    seriesRender?: EmitType<ISeriesRenderEventArgs>;

    /**
     * Triggers before each axis label is rendered. This event allows for the customization of axis label and its font style before rendering on the chart.
     *
     * @event axisLabelRender
     * @deprecated
     */
    axisLabelRender?: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * Triggers when the x-axis label is clicked.
     *
     * @event axisLabelClick
     * @deprecated
     */
    axisLabelClick?: EmitType<IAxisLabelClickEventArgs>;

    /**
     * Triggers before each axis range is rendered. This event allows modification of the axis range and interval that are calculated based on data.
     *
     * @event axisRangeCalculated
     * @deprecated
     */
    axisRangeCalculated?: EmitType<IAxisRangeCalculatedEventArgs>;

    /**
     * Triggers before each axis multi-label is rendered. This event allows modification of multi-labels on the axis before they are rendered.
     *
     * @event axisMultiLabelRender
     * @deprecated
     */
    axisMultiLabelRender?: EmitType<IAxisMultiLabelRenderEventArgs>;

    /**
     * Triggers after clicking on a legend item.
     *
     * @event legendClick
     */
    legendClick?: EmitType<ILegendClickEventArgs>;

    /**
     * Triggers after clicking on a multi-level label.
     *
     * @event multiLevelLabelClick
     */
    multiLevelLabelClick?: EmitType<IMultiLevelLabelClickEventArgs>;

    /**
     * Triggers before the tooltip for the series is rendered. This event allows customization of the tooltip properties such as text, style, and template before it is rendered on the chart.
     *
     * @event tooltipRender
     */

    tooltipRender?: EmitType<ITooltipRenderEventArgs>;

    /**
     * Triggers before the shared tooltip for the series is rendered. This event allows customization of the shared tooltip properties such as text, style, and template before it is rendered on the chart.
     *
     * @event sharedTooltipRender
     */

    sharedTooltipRender?: EmitType<ISharedTooltipRenderEventArgs>;

    /**
     * Triggers on hovering over the chart.
     *
     * @event chartMouseMove
     * @blazorProperty 'OnChartMouseMove'
     */

    chartMouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when clicking on the chart.
     *
     * @event chartMouseClick
     * @blazorProperty 'OnChartMouseClick'
     */

    chartMouseClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers when double-clicking the chart.
     *
     * @event chartDoubleClick
     * @blazorProperty 'OnChartDoubleClick'
     */

    chartDoubleClick?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on point click.
     *
     * @event pointClick
     * @blazorProperty 'OnPointClick'
     */

    pointClick?: EmitType<IPointEventArgs>;

    /**
     * Triggers on point double-click.
     *
     * @event pointDoubleClick
     * @blazorProperty 'OnPointDoubleClick'
     */

    pointDoubleClick?: EmitType<IPointEventArgs>;

    /**
     * Triggers when a data point is hovered.
     *
     * @event pointMove
     * @blazorProperty 'PointMoved'
     */

    pointMove?: EmitType<IPointEventArgs>;

    /**
     * Triggers when the cursor leaves the chart.
     *
     * @event chartMouseLeave
     * @blazorProperty 'OnChartMouseLeave'
     */

    chartMouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse down.
     *
     * @event chartMouseDown
     * @blazorProperty 'OnChartMouseDown'
     */

    chartMouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Triggers on mouse up.
     *
     * @event chartMouseUp
     * @blazorProperty 'OnChartMouseUp'
     */

    chartMouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Triggers after the drag selection is completed.
     *
     * @event dragComplete
     * @blazorProperty 'OnDragComplete'
     */

    dragComplete?: EmitType<IDragCompleteEventArgs>;

    /**
     * Triggers after the selection is completed.
     *
     * @event selectionComplete
     * @blazorProperty 'OnSelectionComplete'
     */

    selectionComplete?: EmitType<ISelectionCompleteEventArgs>;

    /**
     * Triggers after the zoom selection is completed.
     *
     * @event zoomComplete
     * @deprecated
     */

    zoomComplete?: EmitType<IZoomCompleteEventArgs>;

    /**
     * Triggers when the zoom selection started.
     *
     * @event onZooming
     */
    onZooming?: EmitType<IZoomingEventArgs>;

    /**
     * Triggers when the scroll action starts.
     *
     * @event scrollStart
     * @blazorProperty 'OnScrollStart'
     */
    scrollStart?: EmitType<IScrollEventArgs>;

    /**
     * Triggers after the scroll action ends.
     *
     * @event scrollEnd
     * @blazorProperty 'OnScrollEnd'
     */
    scrollEnd?: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the scroll position changes.
     *
     * @event scrollChanged
     * @blazorProperty 'ScrollChanged'
     */
    scrollChanged?: EmitType<IScrollEventArgs>;

    /**
     * Triggers when the drag operation for a point starts.
     *
     * @event dragStart
     */
    dragStart?: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point is being dragged.
     *
     * @event drag
     */
    drag?: EmitType<IDataEditingEventArgs>;

    /**
     * Triggers when the point drag operation ends.
     *
     * @event dragEnd
     */
    dragEnd?: EmitType<IDataEditingEventArgs>;

    /**
     * Specifies the currency code format to use for displaying values in the chart.
     *
     * @private
     * @aspType string
     */
    currencyCode?: string;

}