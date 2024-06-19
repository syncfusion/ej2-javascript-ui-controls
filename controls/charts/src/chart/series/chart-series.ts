import { Property, ChildProperty, Complex, Collection, DateFormatOptions, getValue, animationMode } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { DataLabelSettingsModel, MarkerSettingsModel, TrendlineModel, ChartSegmentModel, ParetoOptionsModel } from '../series/chart-series-model';
import { StackValues, RectOption, ControlPoints, PolarArc, appendChildElement, appendClipElement, getElement } from '../../common/utils/helper';
import { ErrorBarSettingsModel, ErrorBarCapSettingsModel } from '../series/chart-series-model';
import { firstToLowerCase, ChartLocation, CircleOption, IHistogramValues, getColorByValue} from '../../common/utils/helper';
import { Rect, SvgRenderer, CanvasRenderer, Size } from '@syncfusion/ej2-svg-base';
import { ChartSeriesType, ChartShape, SeriesValueType, SplineType, StepPosition } from '../utils/enum';
import { ChartDrawType, DataLabelIntersectAction } from '../utils/enum';
import { BorderModel, FontModel, MarginModel, AnimationModel, EmptyPointSettingsModel, OffsetModel } from '../../common/model/base-model';
import { ConnectorModel } from '../../common/model/base-model';
import { CornerRadiusModel, DragSettingsModel } from '../../common/model/base-model';
import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes } from '../utils/enum';
import { Border, Font, Margin, Animation, EmptyPointSettings, CornerRadius, Connector, DragSettings } from '../../common/model/base';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { Chart } from '../chart';
import { Axis, Column, Row } from '../axis/axis';
import { Data } from '../../common/model/data';
import { Offset } from '../../common/model/base';
import { ISeriesRenderEventArgs } from '../../chart/model/chart-interface';
import { seriesRender } from '../../common/model/constants';
import { Alignment, EmptyPointMode, LabelPosition, LegendShape, SeriesCategories, ShapeType } from '../../common/utils/enum';
import { BoxPlotMode, Segment } from '../utils/enum';
import { getVisiblePoints, setRange, findClipRect } from '../../common/utils/helper';
import { Browser } from '@syncfusion/ej2-base';
import { StockSeries } from '../../stock-chart/index';
import { CartesianAxisLayoutPanel } from '../axis/cartesian-panel';

/**
 * Configures the data label in the series.
 */

export class DataLabelSettings extends ChildProperty<DataLabelSettings> {

    /**
     * If set true, data label for series renders.
     *
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * If set true, data label for zero values in series renders.
     *
     * @default true
     */

    @Property(true)
    public showZero: boolean;

    /**
     * The DataSource field that contains the data label value.
     *
     * @default null
     */

    @Property(null)
    public name: string;

    /**
     * The background color of the data label accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public fill: string;

    /**
     * Used to format the point data label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the point data label, e.g, 20°C.
     *
     * @default null
     */

    @Property(null)
    public format: string;

    /**
     * The opacity for the background.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * Specifies angle for data label.
     *
     * @default 0
     */

    @Property(0)
    public angle: number;

    /**
     * Enables rotation for data label.
     *
     * @default false
     */

    @Property(false)
    public enableRotation: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * Outer: Positions the label outside the point.
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     * * Auto: Positions the label based on series.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public position: LabelPosition;

    /**
     * The roundedCornerX for the data label. It requires `border` values not to be null.
     *
     * @default 5
     */
    @Property(5)
    public rx: number;

    /**
     * The roundedCornerY for the data label. It requires `border` values not to be null.
     *
     * @default 5
     */
    @Property(5)
    public ry: number;

    /**
     * Specifies the alignment for data Label. They are,
     * * Near: Aligns the label to the left of the point.
     * * Center: Aligns the label to the center of the point.
     * * Far: Aligns the label to the right of the point.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Option for customizing the border lines.
     */

    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Margin configuration for the data label.
     */

    @Complex<MarginModel>({ left: 5, right: 5, top: 5, bottom: 5 }, Margin)
    public margin: MarginModel;

    /**
     * Option for customizing the data label text.
     */

    @Complex<FontModel>({ size: null, color: null, fontStyle: null, fontWeight: null, fontFamily: null }, Font)
    public font: FontModel;

    /**
     * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Show Datalabel Even two Data Labels Are Overflow.
     *
     * @default 'Hide'
     */

    @Property('Hide')
    public labelIntersectAction: DataLabelIntersectAction;

}


/**
 *  Configures the marker in the series.
 */

export class MarkerSettings extends ChildProperty<MarkerSettings> {

    /**
     * If set to true the marker for series is rendered. This is applicable only for line and area type series.
     *
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * The different shape of a marker:
     * * Circle
     * * Rectangle
     * * Triangle
     * * Diamond
     * * HorizontalLine
     * * VerticalLine
     * * Pentagon
     * * InvertedTriangle
     * * Image
     *
     * @default null
     */

    @Property(null)
    public shape: ChartShape;


    /**
     * The URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
     *
     * @default ''
     */

    @Property('')
    public imageUrl: string;

    /**
     * The height of the marker in pixels.
     *
     * @default 5
     */

    @Property(5)
    public height: number;

    /**
     *If set true , marker get filled with series color.
     *
     * @default false
     */

    @Property(false)
    public isFilled: boolean;

    /**
     * The width of the marker in pixels.
     *
     * @default 5
     */

    @Property(5)
    public width: number;

    /**
     * Options for customizing the border of a marker.
     */

    @Complex<BorderModel>({ width: 2, color: null }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the marker position.
     */

    @Complex<OffsetModel>({ x: 0, y: 0 }, Offset)
    public offset: OffsetModel;

    /**
     *  The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. By default, it will take series' color.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Trackball is enabled by default when the mouse moves, but it can be disabled by setting "false" to the marker's "allowHighlight" property.
     *
     * @default true
     */

    @Property(true)
    public allowHighlight: boolean;

    /**
     * The opacity of the marker.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * The data label for the series.
     */

    @Complex<DataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabel: DataLabelSettingsModel;

}

/**
 *  Configures the pareto in the series.
 */

export class ParetoOptions extends ChildProperty<ParetoOptions> {

    /**
     * The fill color of the pareto line that accepts value in hex and rgba as a valid CSS color string. By default, it will take color based on theme.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * Defines the width of the pareto line series.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * Defines the pattern of dashes and gaps to stroke.
     *
     * @default '0'
     */

    @Property('0')
    public dashArray: string;

    /**
     * Options for displaying and customizing markers for individual points in a pareto line.
     */

    @Complex<MarkerSettingsModel>(null, MarkerSettings)
    public marker: MarkerSettingsModel;

    /**
     * By default, the axis for the Pareto line will be displayed, but this can be disabled by using the 'showAxis' property.
     *
     * @default true
     */

    @Property(true)
    public showAxis: boolean;
}

/**
 * Points model for the series.
 *
 * @public
 */
export class Points {
    /** point x. */
    public x: Object;
    /** point y. */
    public y: Object;
    /** point visibility. */
    public visible: boolean;
    /** point text. */
    public text: string;
    /** point tooltip. */
    public tooltip: string;
    /** point color. */
    public color: string;
    /** point open value. */
    public open: Object;
    /** point close value. */
    public close: Object;
    /** point symbol location. */
    public symbolLocations: ChartLocation[] = null;
    /** point x value. */
    public xValue: number;
    /** point y value. */
    public yValue: number;
    /** point color mapping column. */
    public colorValue: number;
    /** point index value. */
    public index: number;
    /** point region. */
    public regions: Rect[] = null;
    /** point percentage value. */
    public percentage: number = null;
    /** point high value. */
    public high: Object;
    /** point low value. */
    public low: Object;
    /** point volume value. */
    public volume: Object;
    /** point size value. */
    public size: Object;
    /** point empty checking. */
    public isEmpty: boolean;
    /** point region data. */
    public regionData: PolarArc = null;
    /** point minimum value. */
    public minimum: number;
    /** point maximum value. */
    public maximum: number;
    /** point upper quartile value. */
    public upperQuartile: number;
    /** point lower quartile value. */
    public lowerQuartile: number;
    /** point median value. */
    public median: number;
    /** point outliers value. */
    public outliers: number[];
    /** point average value. */
    public average: number;
    /** point error value. */
    public error: number | string;
    /** point interior value. */
    public interior: string;
    /** To know the point is selected. */
    public isSelect: boolean = false;
    /** point x. */
    public series: Object;
    /** point marker. */
    public marker: MarkerSettingsModel = {
        visible: false
    };
    /**
     * To identify point y value with in the range.
     *
     * @private
     */
    public isPointInRange: boolean = true;

    /** Color for the point error bar. */
    public errorBarColor: string;
    /** vertical error value for the point. */
    public verticalError: number = null;
    /** vertical negative error value for the point. */
    public verticalNegativeError: number = null;
    /** horizontal error value for the point. */
    public horizontalError: number = null;
    /** horizontal negative error value for the point. */
    public horizontalNegativeError: number = null;
    /** vertical positive error value for the point. */
    public verticalPositiveError: number = null;
    /** horizontal positive error value for the point. */
    public horizontalPositiveError: number = null;
}

/**
 * Defines the behavior of the Trendlines
 */
export class Trendline extends ChildProperty<Trendline> {
    /**
     * Defines the name of trendline.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines the pattern of dashes and gaps to stroke.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Specifies the visibility of trendline.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Defines the type of the trendline.
     *
     * @default 'Linear'
     */
    @Property('Linear')
    public type: TrendlineTypes;

    /**
     * Defines the period, the price changes over which will be considered to predict moving average trend line.
     *
     * @default 2
     */
    @Property(2)
    public period: number;

    /**
     * Defines the polynomial order of the polynomial trendline.
     *
     * @default 2
     */
    @Property(2)
    public polynomialOrder: number;

    /**
     * Defines the period, by which the trend has to backward forecast.
     *
     * @default 0
     */
    @Property(0)
    public backwardForecast: number;

    /**
     * Defines the period, by which the trend has to forward forecast.
     *
     * @default 0
     */
    @Property(0)
    public forwardForecast: number;


    /**
     * Options to customize the animation for trendlines.
     */
    @Complex<AnimationModel>({}, Animation)
    public animation: AnimationModel;

    /**
     * Options to customize the marker for trendlines.
     *
     * @deprecated
     */
    @Complex<MarkerSettingsModel>({}, MarkerSettings)
    public marker: MarkerSettingsModel;

    /**
     * Enables/disables tooltip for trendlines.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;


    /**
     * Defines the intercept of the trendline.
     *
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public intercept: number;

    /**
     * Defines the fill color of trendline.
     *
     * @default ''
     */
    @Property('')
    public fill: string;

    /**
     * Defines the width of the trendline.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Sets the legend shape of the trendline.
     *
     * @default 'SeriesType'
     */
    @Property('SeriesType')
    public legendShape: LegendShape;


    /** @private */
    public targetSeries: Series;

    /** @private */
    public trendLineElement: Element;

    /** @private */
    public points: Points[];

    /** @private */
    public clipRectElement: Element;

    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);

    /** @private */
    public polynomialSlopes: number[];

    /** @private */
    public sourceIndex: number;

    /** @private */
    public index: number;

    /**
     * Sets the data source for the specified series in the provided chart.
     *
     * @private
     * @param {Series} series - The series for which the data source is set.
     * @param {Chart} chart - The chart in which the data source is set.
     * @returns {void}
     */
    public setDataSource(series: Series, chart: Chart): void {
        if (series) {
            this.points = (series as Series).points;
        }
        chart.trendLineModule.initDataSource(this);
        chart.visibleSeriesCount++;
    }
}

/**
 * Configures Error bar in series.
 */

export class ErrorBarCapSettings extends ChildProperty<ErrorBarCapSettings> {

    /**
     * The width of the error bar in pixels.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The length of the error bar in pixels.
     *
     * @default 10
     */

    @Property(10)
    public length: number;

    /**
     *  The stroke color of the cap, which accepts value in hex, rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * The opacity of the cap.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

}

export class ChartSegment extends ChildProperty<ChartSegment> {

    /**
     * Defines the starting point of region.
     *
     * @default null
     */

    @Property(null)
    public value: Object;

    /**
     * Defines the color of a region.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * Defines the pattern of dashes and gaps to stroke.
     *
     * @default '0'
     */

    @Property('0')
    public dashArray: string;

    /** @private */
    public startValue: number;

    /** @private */
    public endValue: number;

}
/**
 * Error bar settings
 *
 * @public
 */
export class ErrorBarSettings extends ChildProperty<ErrorBarSettings> {

    /**
     * If set true, error bar for data gets rendered.
     *
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * The type of the error bar . They are
     * * Fixed -  Renders a fixed type error bar.
     * * Percentage - Renders a percentage type error bar.
     * * StandardDeviation - Renders a standard deviation type error bar.
     * * StandardError -Renders a standard error type error bar.
     * * Custom -Renders a custom type error bar.
     *
     * @default 'Fixed'
     */

    @Property('Fixed')
    public type: ErrorBarType;

    /**
     * The direction of the error bar . They are
     * * both -  Renders both direction of error bar.
     * * minus - Renders minus direction of error bar.
     * * plus - Renders plus direction error bar.
     *
     * @default 'Both'
     */

    @Property('Both')
    public direction: ErrorBarDirection;

    /**
     * The mode of the error bar . They are
     * * Vertical -  Renders a vertical error bar.
     * * Horizontal - Renders a horizontal error bar.
     * * Both - Renders both side error bar.
     *
     * @default 'Vertical'
     */

    @Property('Vertical')
    public mode: ErrorBarMode;

    /**
     *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
     *
     * @default null
     */

    @Property(null)
    public color: string;

    /**
     * The vertical error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    @Property(1)
    public verticalError: number | string;

    /**
     * The stroke width of the error bar..
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * The horizontal error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    @Property(1)
    public horizontalError: number | string;

    /**
     * The vertical positive error of the point can be mapped from the data source as well.
     *
     * @default 3
     * @aspType Object
     */

    @Property(3)
    public verticalPositiveError: number | string;

    /**
     * The vertical negative error of the point can be mapped from the data source as well.
     *
     * @default 3
     * @aspType Object
     */

    @Property(3)
    public verticalNegativeError: number | string;

    /**
     * The horizontal positive error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    @Property(1)
    public horizontalPositiveError: number | string;

    /**
     * The horizontal negative error of the point can be mapped from the data source as well.
     *
     * @default 1
     * @aspType Object
     */

    @Property(1)
    public horizontalNegativeError: number | string;

    /**
     * Options for customizing the cap of the error bar.
     */
    @Complex<ErrorBarCapSettingsModel>(null, ErrorBarCapSettings)
    public errorBarCap: ErrorBarCapSettingsModel;

    /**
     * Defines the color for the error bar, which is mapped with the mapping name of the data source.
     *
     * @default ''
     */
    @Property('')
    public errorBarColorMapping: string;

}

/**
 * Defines the common behavior of Series and Technical Indicators
 */
export class SeriesBase extends ChildProperty<SeriesBase> {
    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public xName: string;

    /**
     * The Data Source field that contains the color mapping value.
     * It is applicable for range color mapping properly.
     */
    @Property('')
    public colorName: string;

    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public high: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public low: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public open: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public close: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators
     *
     * @default ''
     */

    @Property('')
    public volume: string;

    /**
     * The DataSource field that contains the color value of point.
     * It is applicable for series.
     *
     * @default ''
     */

    @Property('')
    public pointColorMapping: string;

    /**
     * Specifies the visibility of the series.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1,
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                xAxisName: 'xAxis 1',
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default null
     */

    @Property(null)
    public xAxisName: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1,
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                yAxisName: 'yAxis 1'
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default null
     */

    @Property(null)
    public yAxisName: string;

    /**
     * Options to customizing animation for the series.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * The fill color for the series, which can accept values in hex or rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.
     *
     * @default null
     */

    @Property(null)
    public fill: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.
     *
     * @default 1
     */

    @Property(1)
    public width: number;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
     *
     * @default ''
     */

    @Property('')
    public dashArray: string;

    /**
     * Specifies the data source for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let dataManager: DataManager = new DataManager({
     *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
     * });
     * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
     * let chart: Chart = new Chart({
     * ...
     *     series: [{
     *        dataSource: dataManager,
     *        xName: 'Id',
     *        yName: 'Estimate',
     *        query: query
     *    }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     *
     * @default ''
     */

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies a query to select data from the DataSource. This property is applicable only when the DataSource is an `ej.DataManager`.
     *
     * @default ''
     */
    @Property()
    public query: Query;

    /**
     * Defines the collection of regions that helps to differentiate a line series.
     */
    @Collection<ChartSegmentModel>([], ChartSegment)
    public segments: ChartSegmentModel[];

    /**
     * Defines the axis, based on which the line series will be split.
     */
    @Property('X')
    public segmentAxis: Segment;

    /**
     * This property used to improve chart performance via data mapping for series dataSource.
     *
     * @default false
     */
    @Property(false)
    public enableComplexProperty: boolean;

    public rangeColorPoints: string[] = [];

    private isAdvancedColor: boolean = undefined;
    /**
     * Process data for the series.
     *
     * @hidden
     * @returns {void}
     */
    public processJsonData(): void {
        let i: number = 0;
        const point: Points = new Points();
        const xName: string = (this instanceof Series && this.type === 'Histogram') ? 'x' : this.xName;
        const textMappingName: string = this instanceof Series && this.marker.dataLabel.name ?
            this.marker.dataLabel.name : '';
        if (this instanceof Series) {
            if ((this.type === 'Waterfall' || this.type === 'Histogram')) {
                this.currentViewData = this.chart[firstToLowerCase(this.type) + 'SeriesModule'].
                    processInternalData(extend([], this.currentViewData, null, true) as Object[], this);
            }
            if (this.category === 'Pareto') {
                this.currentViewData = extend([], this.currentViewData, null, true) as Object[];
                if (this.type === 'Line') {
                    this.currentViewData = this.chart.paretoSeriesModule.performCumulativeCalculation(
                        this.currentViewData, this);
                }
            }
            this.isRectTypeSeries = this.type.indexOf('Column') > -1 || this.type.indexOf('Bar') > -1
                                    || this.type.indexOf('Histogram') > -1;
        }
        const len: number = (this.currentViewData as object[] || []).length;
        this.points = [];
        this.xMin = Infinity; this.xMax = -Infinity;
        this.yMin = Infinity; this.yMax = -Infinity;
        this.sizeMax = -Infinity;
        this.getSeriesType();
        if (this.xAxis.valueType === 'Category') {
            while (i < len) {
                this.pushCategoryPoint(point, i, textMappingName, xName);
                i++;
            }

        } else if (this.xAxis.valueType.indexOf('DateTime') > -1) {
            const option: DateFormatOptions = {
                skeleton: 'full',
                type: 'dateTime'
            };
            const dateParser: Function = this.chart.intl.getDateParser(option);
            const dateFormatter: Function = this.chart.intl.getDateFormat(option);
            while (i < len) {
                this.pushDateTimePoint(point, i, textMappingName, xName, dateParser, dateFormatter);
                i++;
            }
        } else {
            while (i < len) {
                this.pushDoublePoint(point, i, textMappingName, xName);
                i++;
            }
        }
        this.updateSplineValue();
    }

    /**
     * Pushes a category point to the data collection.
     *
     * @param {Points} point -The point to be pushed.
     * @param {number} index -The index of the point.
     * @param {string} textMappingName -The name of the text mapping.
     * @param {string} xName -The name of the x-coordinate.
     * @returns {void}
     * @private
     */
    public pushCategoryPoint(point: Points, index: number, textMappingName: string, xName: string): void {
        point = this.dataPoint(index, textMappingName, xName);
        this.pushCategoryData(point, index, <string>point.x);
        this.pushData(point, index);
        this.setEmptyPoint(point, index);
        this.rangeColorsInterior(point);
    }

    /**
     * Pushes a double point to the data collection.
     *
     * @param {Points} point -The point to be pushed.
     * @param {number} index -The index of the point.
     * @param {string} textMappingName -The name of the text mapping.
     * @param {string} xName -The name of the x-coordinate.
     * @returns {void}
     * @private
     */
    public pushDoublePoint(point: Points, index: number, textMappingName: string, xName: string): void {
        point = this.dataPoint(index, textMappingName, xName);
        point.xValue = <number>point.x;
        this.pushData(point, index);
        this.setEmptyPoint(point, index);
    }

    /**
     * Pushes a DateTime point to the data collection.
     *
     * @param {Points} point -The point to be pushed.
     * @param {number} index -The index of the point.
     * @param {string} textMappingName -The name of the text mapping.
     * @param {string} xName -The name of the x-coordinate.
     * @param {Function} dateParser -The date parser function.
     * @param {Function} dateFormatter -The date formatter function.
     * @returns {void}
     * @private
     */
    public pushDateTimePoint(point: Points, index: number, textMappingName: string, xName: string,
                             dateParser: Function, dateFormatter: Function): void {
        point = this.dataPoint(index, textMappingName, xName);
        if (!isNullOrUndefined(point.x) && point.x !== '') {
            point.x = new Date(
                DataUtil.parse.parseJson({ val: point.x }).val
            );
            if (this.xAxis.valueType === 'DateTime') {
                point.xValue = Date.parse(point.x.toString());
            } else {
                if (this.chart.isBlazor) {
                    this.pushCategoryData(point, index, Date.parse(point.x.toString()).toString());
                }
                else {
                    this.pushCategoryData(point, index, Date.parse(dateParser(dateFormatter(point.x))).toString());
                }
            }
            this.pushData(point, index);
            this.setEmptyPoint(point, index);
        } else {
            point.visible = false;
        }
    }

    public updateSplineValue(): void {
        if (this instanceof Series && !(this.chart.stockChart && this.xAxis.valueType === 'DateTimeCategory')) {
            if (this.type.indexOf('Spline') > -1 || (this.drawType.indexOf('Spline') > -1 && this.chart.chartAreaType === 'PolarRadar')) {
                const isArea: boolean = (this.type.indexOf('Area') > -1 || this.drawType.indexOf('Area') > -1);
                const isRange: boolean = this.type.indexOf('Range') > -1;
                this.chart[
                    'spline' + (isArea ? isRange ? 'RangeArea' : 'Area' : '') + 'SeriesModule'
                ].findSplinePoint(this);
            } else if (this.type.indexOf('Histogram') > -1 && (this.xAxis.maximum || this.xAxis.minimum)) {
                this.chart['histogramSeriesModule'].calculateBinValues(this);
            }
            if (this.type.indexOf('Histogram') > -1 && this.points.length === 1) {
                this.xMin = this.xMin - this.histogramValues.binWidth;
                this.xMax = this.xMax + this.histogramValues.binWidth;
            }
        }
    }

    private rangeColorsInterior(point: Points): void {
        if (this.chart.rangeColorSettings && this.chart.rangeColorSettings.length > 0 && this.chart.visibleSeries.length === 1 &&
            (this.chart.series[0].type === 'Column' || this.chart.series[0].type === 'Bar' ||
                this.chart.series[0].type === 'Scatter' || this.chart.series[0].type === 'Bubble')) {
            if (!this.rangeColorPoints[point.interior]) {
                this.rangeColorPoints[point.interior] = [];
            }
            else if (this.rangeColorPoints[point.interior] !== undefined) {
                this.rangeColorPoints[point.interior].push(point);
            }
        }
    }

    /**
     * Sets the empty point values.
     *
     * @param {Points} point - The point to be set.
     * @param {number} i - The index of the point.
     * @private
     * @returns {void}
     */
    public pushData(point: Points, i: number): void {
        point.index = i;
        point.yValue = <number>point.y;
        point.series = this;
        // To find the min, max for the axis range.
        this.xMin = Math.min(this.xMin, point.xValue);
        this.xMax = Math.max(this.xMax, point.xValue);
        this.xData.push(point.xValue);
    }
    /**
     * Retrieves the data point at the specified index with the given text mapping name and x-name.
     *
     * @protected
     * @param {number} i - The index of the data point to retrieve.
     * @param {string} textMappingName - The name used to map text data.
     * @param {string} xName - The name used for the x-axis.
     * @returns {Points} - The data point at the specified index.
     * @private
     */
    protected dataPoint(i: number, textMappingName: string, xName: string): Points {
        this.points[i as number] = new Points();
        const point: Points = <Points>this.points[i as number];
        const currentViewData: Object = this.currentViewData[i as number];
        const getObjectValueByMappingString: Function = this.enableComplexProperty ? getValue : this.getObjectValue;
        point.x = getObjectValueByMappingString(xName, currentViewData);
        point.high = getObjectValueByMappingString(this.high, currentViewData);
        point.low = getObjectValueByMappingString(this.low, currentViewData);
        point.open = getObjectValueByMappingString(this.open, currentViewData);
        point.close = getObjectValueByMappingString(this.close, currentViewData);
        point.volume = getObjectValueByMappingString(this.volume, currentViewData);
        point.interior = getObjectValueByMappingString(this.pointColorMapping, currentViewData) as string;
        if (this instanceof Series) {
            if (this.errorBar.visible) {
                point.errorBarColor = getObjectValueByMappingString(this.errorBar.errorBarColorMapping, currentViewData) as string;
                point.verticalError = typeof this.errorBar.verticalError == 'string' ? getObjectValueByMappingString(this.errorBar.verticalError, currentViewData) : this.errorBar.verticalError;
                point.horizontalError = typeof this.errorBar.horizontalError == 'string' ? getObjectValueByMappingString(this.errorBar.horizontalError, currentViewData) : this.errorBar.horizontalError;
                point.verticalNegativeError = typeof this.errorBar.verticalNegativeError == 'string' ? getObjectValueByMappingString(this.errorBar.verticalNegativeError, currentViewData) : this.errorBar.verticalNegativeError;
                point.verticalPositiveError = typeof this.errorBar.verticalPositiveError == 'string' ? getObjectValueByMappingString(this.errorBar.verticalPositiveError, currentViewData) : this.errorBar.verticalPositiveError;
                point.horizontalNegativeError = typeof this.errorBar.horizontalNegativeError == 'string' ? getObjectValueByMappingString(this.errorBar.horizontalNegativeError, currentViewData) : this.errorBar.horizontalNegativeError;
                point.horizontalPositiveError = typeof this.errorBar.horizontalPositiveError == 'string' ? getObjectValueByMappingString(this.errorBar.horizontalPositiveError, currentViewData) : this.errorBar.horizontalPositiveError;
            }
            point.y = getObjectValueByMappingString(this.yName, currentViewData);
            point.size = getObjectValueByMappingString(this.size, currentViewData);
            point.text = getObjectValueByMappingString(textMappingName, currentViewData) as string;
            point.tooltip = getObjectValueByMappingString(this.tooltipMappingName, currentViewData) as string;
            if (this.isAdvancedColorSupported()) {
                this.rangeColorName = this.colorName.length > 0 ? this.colorName : this.yName;
                point.colorValue = getObjectValueByMappingString(this.rangeColorName, currentViewData);
                point.interior = this.getPointFillColor(point.interior, point.colorValue);
            }
        }
        return point;
    }

    private isAdvancedColorSupported(): boolean {
        if (isNullOrUndefined(this.isAdvancedColor)) {
            if (this.chart.rangeColorSettings && this.chart.rangeColorSettings.length > 0 &&
                (this.chart.series[0].type === 'Column' || this.chart.series[0].type === 'Bar' ||
                    this.chart.series[0].type === 'Scatter' || this.chart.series[0].type === 'Bubble')) {
                this.isAdvancedColor = true;
            } else {
                this.isAdvancedColor = false;
            }
        }
        return this.isAdvancedColor;
    }

    private getPointFillColor(pointFill: string, value: number): string {
        let color: string = pointFill;
        if (value && this.chart.rangeColorSettings && this.chart.rangeColorSettings.length > 0) {
            for (const rangeMap of this.chart.rangeColorSettings) {
                if (value >= rangeMap.start && value <= rangeMap.end) {
                    if (rangeMap.colors.length > 1) {
                        color = getColorByValue(rangeMap, value);
                    } else {
                        color = rangeMap.colors[0];
                    }
                }
            }
        }
        return color;
    }

    /**
     * Pushes a category point to the data collection.
     *
     * @param {string} mappingName - The name of the mapping.
     * @param {Object} data - The data to be pushed.
     * @returns {Object} - The data point at the specified index.
     * @private
     */
    public getObjectValue(mappingName: string, data: Object): Object {
        return data[mappingName as string];
    }
    /**
     * Sets the specified data point as an empty point at the given index.
     *
     * @private
     * @param {Points} point - The data point to set as empty.
     * @param {number} i - The index of the data point.
     * @returns {void}
     */
    public setEmptyPoint(point: Points, i: number): void {
        if (!this.findVisibility(point)) {
            point.visible = true;
            return null;
        }
        point.isEmpty = true;
        const mode: EmptyPointMode = this instanceof Series && point.isPointInRange ? this.emptyPointSettings.mode : 'Drop';
        switch (mode) {
        case 'Zero':
            point.visible = true;
            if (this instanceof Series && this.seriesType.indexOf('HighLow') > -1) {
                point.high = point.low = 0;
                if (this.seriesType.indexOf('HighLowOpenClose') > -1) {
                    point.open = point.close = 0;
                }
            } else {
                point.y = point.yValue = this.yData[i as number] = 0;
            }
            break;
        case 'Average':
            if (this instanceof Series) {
                if (this.seriesType.indexOf('HighLow') > -1) {
                    point.high = (isNullOrUndefined(point.high) || isNaN(+point.high)) ? this.getAverage(this.high, i) : point.high;
                    point.low = (isNullOrUndefined(point.low) || isNaN(+point.low)) ? this.getAverage(this.low, i) : point.low;
                    if (this.seriesType.indexOf('HighLowOpenClose') > -1) {
                        point.open = (isNullOrUndefined(point.open) || isNaN(+point.open)) ? this.getAverage(this.open, i) : point.open;
                        point.close = (isNullOrUndefined(point.close) || isNaN(+point.close)) ? this.getAverage(this.close, i) :
                            point.close;
                    }
                } else {
                    point.y = point.yValue = this.yData[i as number] = this.getAverage(this.yName, i);
                }
            }
            point.visible = true;
            break;
        case 'Drop':
        case 'Gap':
            this.yData[i as number] = null;
            point.visible = false;
            break;
        }
    }

    private findVisibility(point: Points): boolean {
        const type: SeriesValueType = this instanceof Series ? this.seriesType : 'HighLowOpenClose';
        let yValues: number[];
        const yAxisMin: number = <number>this.yAxis.minimum;
        const yAxisMax: number = <number>this.yAxis.maximum;
        switch (type) {
        case 'XY':
            if (this.chart.chartAreaType === 'PolarRadar' && ((!isNullOrUndefined(yAxisMin) && point.yValue < yAxisMin) ||
                    (!isNullOrUndefined(yAxisMax) && point.yValue > yAxisMax))) {
                point.isPointInRange = false;
                return true;
            }
            this.setXYMinMax(point.yValue);
            this.yData.push(point.yValue);
            if (this instanceof Series && this.type === 'Bubble') {
                this.sizeMax = Math.max(this.sizeMax, (isNullOrUndefined(<number>point.size) || isNaN(+point.size)) ? this.sizeMax
                    : <number>point.size);
            }
            return isNullOrUndefined(point.x) || (isNullOrUndefined(point.y) || isNaN(+point.y));
        case 'HighLow':
            this.setHiloMinMax(<number>point.high, <number>point.low);
            return isNullOrUndefined(point.x) || (isNullOrUndefined(point.low) || isNaN(+point.low)) ||
                    (isNullOrUndefined(point.high) || isNaN(+point.high));
        case 'HighLowOpenClose':
            this.setHiloMinMax(<number>point.high, <number>point.low);
            return isNullOrUndefined(point.x) || (isNullOrUndefined(point.low) || isNaN(+point.low)) ||
                    (isNullOrUndefined(point.open) || isNaN(+point.open)) || (isNullOrUndefined(point.close) || isNaN(+point.close))
                    || (isNullOrUndefined(point.high) || isNaN(+point.high));
        case 'BoxPlot':
            yValues = (point.y as number[] || [null]).filter((value: number) => {
                return !isNullOrUndefined(value) && !isNaN(value);
            }).sort((a: number, b: number) => {
                return a - b;
            });
            point.y = yValues;
            this.yMin = Math.min(this.yMin, Math.min(...yValues));
            this.yMax = Math.max(this.yMax, Math.max(...yValues));
            return !yValues.length;
        }
    }
    /**
     * To get Y min max for the provided point seriesType XY.
     *
     * @param {number} yValue - The y value used to determine the minimum and maximum values for the x and y coordinates.
     * @returns {void}
     */
    private setXYMinMax(yValue: number): void {
        const isLogAxis: boolean = (this.yAxis.valueType === 'Logarithmic' || this.xAxis.valueType === 'Logarithmic');
        const isNegativeValue: boolean = yValue < 0 || this.yAxis.rangePadding === 'None';
        let seriesMinY: number;
        if (this.isRectTypeSeries && !setRange(this.yAxis)) {
            seriesMinY = ((isLogAxis ? (yValue) : isNegativeValue ? yValue : 0));
        } else {
            seriesMinY = yValue;
        }
        this.yMin = isLogAxis ?
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY) || (seriesMinY === 0) ||
                (seriesMinY.toString() === '0') || (seriesMinY.toString() === '')) ? this.yMin : seriesMinY) :
            Math.min(this.yMin, (isNullOrUndefined(seriesMinY) || isNaN(seriesMinY)) ? this.yMin : seriesMinY);
        this.yMax = Math.max(this.yMax, (isNullOrUndefined(yValue) || isNaN(yValue)) ? this.yMax : yValue);
    }
    /**
     * Sets the minimum and maximum values for the high and low values.
     *
     * @private
     * @param {number} high - The high value used to determine the maximum value.
     * @param {number} low - The low value used to determine the minimum value.
     * @returns {void}
     */
    private setHiloMinMax(high: number, low: number): void {
        this.yMin = Math.min(this.yMin, Math.min((isNullOrUndefined(low) || isNaN(low)) ? this.yMin : low,
                                                 (isNullOrUndefined(high) || isNaN(high)) ? this.yMin : high));
        this.yMax = Math.max(this.yMax, Math.max((isNullOrUndefined(low) || isNaN(low)) ? this.yMax : low,
                                                 (isNullOrUndefined(high) || isNaN(high)) ? this.yMax : high));
    }
    /**
     * Finds the type of the series.
     *
     * @private
     * @returns {void}
     */
    private getSeriesType(): void {
        let type: SeriesValueType;
        if (this instanceof Series) {
            const seriesType: string = this.chart.chartAreaType === 'PolarRadar' ? this.drawType : this.type;
            if (seriesType) {
                switch (seriesType) {
                case 'RangeColumn':
                case 'RangeArea':
                case 'RangeStepArea':
                case 'SplineRangeArea':
                case 'Hilo':
                    type = 'HighLow';
                    break;
                case 'HiloOpenClose':
                case 'Candle':
                    type = 'HighLowOpenClose';
                    break;
                case 'BoxAndWhisker':
                    type = 'BoxPlot';
                    break;
                default:
                    type = 'XY';
                }
            }
        }
        this.seriesType = type;
    }
    /**
     * Pushes category data into the series points.
     *
     * @protected
     * @param {Points} point - The point to which category data will be pushed.
     * @param {number} index - The index of the data point.
     * @param {string} pointX - The x-value of the point.
     * @returns {void}
     * @private
     */
    protected pushCategoryData(point: Points, index: number, pointX: string): void {
        if (!this.chart.tooltip.shared) {
            if (!this.visible) {
                return null;
            }
        }
        if (!this.xAxis.isIndexed) {
            if (this.xAxis.indexLabels[pointX as string] === undefined) {
                this.xAxis.indexLabels[pointX as string] = this.xAxis.labels.length;
                this.xAxis.labels.push(pointX as string);
            }
            point.xValue = this.xAxis.indexLabels[pointX as string];
        } else {
            if (this.xAxis.labels[index as number]) {
                this.xAxis.labels[index as number] += ', ' + pointX;
            }
            else {
                this.xAxis.labels.push(pointX);
            }
            // this.xAxis.labels[index as number] ? this.xAxis.labels[index as number] += ', ' + pointX :
            //     this.xAxis.labels.push(pointX);
            point.xValue = index;
        }
    }
    /**
     * Gets the average value of a member in the specified data array or current view data.
     *
     * @param {string} member - The member whose average is to be calculated.
     * @param {number} i - The index of the data point.
     * @param {Object} data - The data array from which to calculate the average. Defaults to the current view data.
     * @returns {number} - The average value of the specified member.
     */
    private getAverage(member: string, i: number, data: Object = this.currentViewData): number {
        const previous: number = data[i - 1] ? (data[i - 1][member as string] || 0) : 0;
        const next: number = data[i + 1] ? (data[i + 1][member as string] || 0) : 0;
        return (previous + next) / 2;
    }

    /**
     * Refreshes the data manager for the provided chart.
     *
     * @param {Chart} chart - The chart whose data manager is to be refreshed.
     * @returns {void}
     * @private
     */
    public refreshDataManager(chart: Chart): void {
        this.chart = chart;
        let dataSource: Object | DataManager;
        const isAngular: string = 'isAngular';
        if (chart[isAngular as string]) {
            dataSource = Object.keys(this.dataSource).length ? this.dataSource : chart.dataSource;
        } else {
            dataSource = this.dataSource || chart.dataSource;
        }
        if (!(dataSource instanceof DataManager) && isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dataSource, count: (dataSource as Object[]).length }, false);
            return;
        }

        const dataManager: Promise<Object> = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e));

    }

    private dataManagerSuccess(e: { result: Object, count: number }, isRemoteData: boolean = true): void {
        this.currentViewData = e.count ? e.result : [];
        this.chart.allowServerDataBinding = false;
        if (this instanceof Series) {
            if (this.chart.stockChart) {
                (this.chart.stockChart.series[this.index] as StockSeries).localData = this.currentViewData;
            }
            const argsData: ISeriesRenderEventArgs = {
                name: seriesRender, series: this, data: this.currentViewData, fill: this.interior
            };
            this.chart.trigger(seriesRender, argsData);
            this.interior = argsData.fill;
            this.currentViewData = argsData.data;
        }
        if (this.chart.stockChart && !(this instanceof Series)) {
            this.currentViewData = this.chart.stockChart.findCurrentData(
                (this.chart.stockChart.series[0] as StockSeries).localData,
                (this.chart.stockChart.series[0] as StockSeries).xName
            );
        }
        this.processJsonData();
        this.recordsCount = e.count;
        this.refreshChart(isRemoteData);
        this.currentViewData = null;
    }

    private refreshChart(isRemoteData: boolean): void {
        const chart: Chart = this.chart;
        if (this instanceof Series) {
            chart.visibleSeriesCount += isRemoteData ? 1 : 0;
        }
        chart.refreshTechnicalIndicator(this);
        if (this instanceof Series && this.category !== 'TrendLine') {
            for (const trendline of this.trendlines) {
                (trendline as Trendline).setDataSource(this, chart);
            }
        }
        //if (chart.visibleSeries.length === (chart.visibleSeriesCount - chart.indicators.length)) {
        if (chart.visibleSeries.length === (chart.visibleSeriesCount)) {
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart.isBlazor ? {} : chart });
            if (this.chart.stockChart && this.chart.stockChart.initialRender) {
                this.chart.stockChart.initialRender = false;
                this.chart.stockChart.stockChartDataManagerSuccess();
            }
        }
        if (this instanceof Series) {
            chart.visibleSeriesCount += isRemoteData ? 0 : 1;
        }
    }

    /** @private */
    public xMin: number;
    /** @private */
    public xMax: number;
    /** @private */
    public yMin: number;
    /** @private */
    public yMax: number;
    /** @private */
    public xAxis: Axis;
    /** @private */
    public yAxis: Axis;
    /** @private */
    public chart: Chart;
    /** @private */
    public currentViewData: Object = [];
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
    /** @private */
    public xData: number[];
    /** @private */
    public yData: number[];
    /** @private */
    public index: number;
    /** @private */
    public dataModule: Data;
    /** @private */
    public points: Points[];
    /** @private */
    public visiblePoints: Points[];
    /** @private */
    public seriesType: SeriesValueType = 'XY';
    /** @private */
    public sizeMax: number;
    /** @private */
    private recordsCount: number;
    private isRectTypeSeries: boolean = false;
    public removedPointIndex: number = null;
    /** @private */
    public isLegendClicked: boolean = false;
}

/**
 * Configures the series in charts.
 *
 * @public
 */

export class Series extends SeriesBase {

    /**
     * The name of the series as displayed in the legend.
     *
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * The DataSource field that contains the y value.
     *
     * @default ''
     */

    @Property('')
    public yName: string;

    /**
     * Type of series to be drawn in radar or polar series. They are
     *  'Line'
     *  'Column'
     *  'Area'
     *  'Scatter'
     *  'Spline'
     *  'StackingColumn'
     *  'StackingArea'
     *  'RangeColumn'
     *  'SplineArea'
     *
     * @default 'Line'
     */
    @Property('Line')
    public drawType: ChartDrawType;

    /**
     * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
     *
     * @default true
     */
    @Property(true)
    public isClosed: boolean;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is less than the closing price.
     *
     * @default null
     */

    @Property(null)
    public bearFillColor: string;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is higher than the closing price.
     *
     * @default null
     */

    @Property(null)
    public bullFillColor: string;

    /**
     * This property is applicable for candle series.
     * It enables/disables to visually compare the current values with the previous values in stock.
     *
     * @default false
     */
    @Property(false)
    public enableSolidCandles: boolean;

    /**
     * The DataSource field that contains the size value of y
     *
     * @default ''
     */

    @Property('')
    public size: string;

    /**
     * The bin interval of each histogram points.
     *
     * @default null
     * @aspDefaultValueIgnore
     */

    @Property(null)
    public binInterval: number;

    /**
     * The normal distribution of histogram series.
     *
     * @default false
     */

    @Property(false)
    public showNormalDistribution: boolean;

    /**
     * This property allows grouping series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     *
     * @default ''
     */

    @Property('')
    public stackingGroup: string;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */

    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * The opacity of the series.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * The z order of the series.
     *
     * @default 0
     */
    @Property(0)
    public zOrder: number;

    /**
     * Defines the name that specifies the chart series are mutually exclusive and can be overlaid.
     * The axis in the same group shares the same baseline and location on the corresponding axis.
     *
     * @default ''
     */

    @Property('')
    public groupName: string;


    /**
     * The type of the series are
     * * Line
     * * Column
     * * Area
     * * Bar
     * * Histogram
     * * StackingColumn
     * * StackingArea
     * * StackingBar
     * * StepLine
     * * StepArea
     * * Scatter
     * * Spline
     * * StackingColumn100
     * * StackingBar100
     * * StackingArea100
     * * RangeColumn
     * * Hilo
     * * HiloOpenClose
     * * Waterfall
     * * RangeArea
     * * SplineRangeArea
     * * Bubble
     * * Candle
     * * Polar
     * * Radar
     * * BoxAndWhisker
     * * Pareto
     *
     * @default 'Line'
     */

    @Property('Line')
    public type: ChartSeriesType;

    /**
     * Options for displaying and customizing error bar for individual point in a series.
     */
    @Complex<ErrorBarSettingsModel>(null, ErrorBarSettings)
    public errorBar: ErrorBarSettingsModel;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    @Complex<MarkerSettingsModel>(null, MarkerSettings)
    public marker: MarkerSettingsModel;

    /**
     * Options for customizing the pareto line series.
     */
    @Complex<ParetoOptionsModel>(null, ParetoOptions)
    public paretoOptions: ParetoOptionsModel;

    /**
     * Options to customize the drag settings for series
     */
    @Complex<DragSettingsModel>({}, DragSettings)
    public dragSettings: DragSettingsModel;

    /**
     * Defines the collection of trendlines that are used to predict the trend
     */
    @Collection<TrendlineModel>([], Trendline)
    public trendlines: TrendlineModel[];

    /**
     * Enable tooltip for the chart series.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Format of the tooltip content.
     *
     * @default ''
     */
    @Property('')
    public tooltipFormat: string;

    /**
     * The data source field that contains the tooltip value.
     *
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

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

    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * The URL for the Image that is to be displayed as a Legend icon.  It requires  `legendShape` value to be an `Image`.
     *
     * @default ''
     */

    @Property('')
    public legendImageUrl: string;

    /**
     * Custom style for the selected series or points.
     *
     * @default null
     */
    @Property(null)
    public selectionStyle: string;

    /**
     * Custom style for the deselected series or points.
     *
     * @default null
     */
    @Property(null)
    public unSelectedStyle: string;

    /**
     * Custom style for the non-highlighted series or points.
     *
     * @default null
     */
    @Property(null)
    public nonHighlightStyle: string;

    /**
     * Minimum radius
     *
     * @default 1
     */
    @Property(1)
    public minRadius: number;

    /**
     * Maximum radius
     *
     * @default 3
     */
    @Property(3)
    public maxRadius: number;

    /**
     * Defines type of spline to be rendered.
     *
     * @default 'Natural'
     */
    @Property('Natural')
    public splineType: SplineType;
    /**
     * It defines tension of cardinal spline types.
     *
     * @default 0.5
     */
    @Property(0.5)
    public cardinalSplineTension: number;

    /**
     * options to customize the empty points in series.
     */
    @Complex<EmptyPointSettingsModel>(null, EmptyPointSettings)
    public emptyPointSettings: EmptyPointSettingsModel;

    /**
     * If set true, the mean value for box and whisker will be visible.
     *
     * @default true
     */
    @Property(true)
    public showMean: boolean;

    /**
     * The mode of the box and whisker char series. They are,
     * Exclusive
     * Inclusive
     * Normal
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public boxPlotMode: BoxPlotMode;

    /**
     * Render the column series points with a particular column width. If the series type is histogram the
     * default value is 1 otherwise 0.7.
     *
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    @Property(null)
    public columnWidth: number;

    /**
     * To render the column series points with particular column width as pixel.
     *
     * @default null
     * @aspDefaultValueIgnore
     * @blazorDefaultValue Double.NaN
     */
    @Property(null)
    public columnWidthInPixel: number;

    /**
     * Defines the shape of the data in a column and bar chart.
     * Rectangle: Displays the data in a column and bar chart in a rectangle shape.
     * Cylinder: Displays the data in a column and bar chart in a cylinder shape.
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public columnFacet: ShapeType;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.
     *
     * @default 0
     */
    @Property(0)
    public columnSpacing: number;


    /**
     * Defines the visual representation of the negative changes in waterfall charts.
     *
     * @default '#C64E4A'
     */
    @Property('#C64E4A')
    public negativeFillColor: string;

    /**
     * Defines the visual representation of the summaries in waterfall charts.
     *
     * @default '#4E81BC'
     */
    @Property('#4E81BC')
    public summaryFillColor: string;

    /**
     * Defines the collection of indexes of the intermediate summary columns in waterfall charts.
     *
     * @default []
     * @aspType int[]
     */
    @Property()
    public intermediateSumIndexes: number[];

    /**
     * Defines the collection of indexes of the overall summary columns in waterfall charts.
     *
     * @default []
     * @aspType int[]
     */
    @Property()
    public sumIndexes: number[];

    /**
     * Defines the position for the steps in the step line, step area, and step range area chart types.
     * * Left: Steps start from the left side of the 2nd point.
     * * Center: Steps start between the data points.
     * * Right: Steps start from the right side of the 1st point. 
     *
     * @default 'Left'
     */
    @Property('Left')
    public step: StepPosition;

    /**
     * Defines the appearance of line connecting adjacent points in waterfall charts.
     */

    @Complex<ConnectorModel>({ color: 'black', width: 2 }, Connector)
    public connector: ConnectorModel;


    /**
     * To render the column series points with particular rounded corner.
     */
    @Complex<CornerRadiusModel>(null, CornerRadius)
    public cornerRadius: CornerRadiusModel;

    public visibleSeriesCount: number = 0;
    /** @private */
    public position: number;
    /** @private */
    public rectCount: number;
    /** @private */
    public seriesElement: Element;
    /** @private */
    public errorBarElement: Element;
    /** @private */
    public symbolElement: Element;
    /** @private */
    public shapeElement: Element;
    /** @private */
    public textElement: Element;
    /** @private */
    public pathElement: Element;
    /** @private */
    public sourceIndex: number;
    /** @private */
    public category: SeriesCategories = 'Series';
    /** @private */
    public isRectSeries: boolean = false;
    /** @private */
    public clipRectElement: Element;
    /** @private */
    public stackedValues: StackValues;
    /** @private */
    public interior: string;
    /** @private */
    public histogramValues: IHistogramValues;
    /** @private */
    public drawPoints: ControlPoints[] = [];
    /** @private */
    public lowDrawPoints: ControlPoints[] = [];
    /** @private */
    public delayedAnimation: boolean = false;
    /** @private */
    public rangeColorName: string = this.colorName.length > 0 ? this.colorName : this.yName;
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }

    /**
     * Refresh the axis label.
     *
     * @returns {void}
     * @private
     */
    public refreshAxisLabel(): void {
        if (this.xAxis.valueType.indexOf('Category') === -1) {
            return null;
        }
        this.xAxis.labels = [];
        this.xAxis.indexLabels = {};
        const option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        const dateParser: Function = this.chart.intl.getDateParser(option);
        const dateFormatter: Function = this.chart.intl.getDateFormat(option);
        for (const item of this.xAxis.series) {
            if (item.visible && item.category !== 'TrendLine') {
                item.xMin = Infinity; item.xMax = -Infinity;
                for (const point of item.points) {
                    item.pushCategoryData(point, point.index, this.xAxis.valueType === "DateTimeCategory" ? Date.parse(dateParser(dateFormatter(point.x))).toString() : <string>point.x);
                    item.xMin = Math.min(item.xMin, point.xValue);
                    item.xMax = Math.max(item.xMax, point.xValue);
                }
            }
        }
    }
    /**
     * To get the series collection.
     *
     * @returns {void}
     * @private
     */

    public findSeriesCollection(column: Column, row: Row, isStack: boolean): Series[] {
        const seriesCollection: Series[] = [];
        for (const rowAxis of row.axes) {
            for (const rowSeries of rowAxis.series) {
                for (const axis of column.axes) {
                    for (const series of axis.series) {
                        if (series === rowSeries && series.visible && this.rectSeriesInChart(series, isStack)) {
                            seriesCollection.push(series);
                        }
                    }
                }
            }
        }
        return seriesCollection;
    }
    /**
     * Checks if the series in the chart are rectangular.
     *
     * @param {Series} series - The series to be checked.
     * @param {boolean} isStack - Specifies whether the series are stacked.
     * @returns {boolean} - Returns true if the series in the chart are rectangular, otherwise false.
     */
    private rectSeriesInChart(series: Series, isStack: boolean): boolean {
        const type: string = (series.type).toLowerCase();
        return (
            type.indexOf('column') !== -1 || type.indexOf('bar') !== -1 || type.indexOf('histogram') !== -1 ||
            type.indexOf('hiloopenclose') !== -1 || type.indexOf('candle') !== -1 || type.indexOf('pareto') !== -1 ||
            type.indexOf('hilo') !== -1 || series.drawType.indexOf('Column') !== -1 ||
            type.indexOf('waterfall') !== -1 || type.indexOf('boxandwhisker') !== -1 || isStack
        );
    }
    /**
     * Calculates the stacked value for the chart.
     *
     * @param {boolean} isStacking100 - Specifies whether the stacking is 100%.
     * @param {Chart} chart - The chart for which the stacked value is calculated.
     * @returns {void}
     * @private
     */
    public calculateStackedValue(isStacking100: boolean, chart: Chart): void {
        for (const columnItem of chart.columns) {
            for (const item of chart.rows) {
                this.calculateStackingValues(this.findSeriesCollection(<Column>columnItem, <Row>item, true), isStacking100);
            }
        }
    }



    private calculateStackingValues(seriesCollection: Series[], isStacking100: boolean): void {
        let startValues: number[];
        let endValues: number[];
        let yValues: number[] = [];
        const lastPositive: number[] = [];
        const lastNegative: number[] = [];
        let stackingGroup: string;
        let lastValue: number;
        let value: number;
        let frequencies: number[] = [];
        if (isStacking100) {
            frequencies = <number[]>this.findFrequencies(seriesCollection);
        }
        const groupingValues: string[] = [];
        let visiblePoints: Points[] = [];
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const series: Series = seriesCollection[i as number];
            if (!groupingValues[series.stackingGroup]) {
                groupingValues[series.stackingGroup] = [];
                groupingValues[series.stackingGroup].push(series);
            }
            else if (groupingValues[series.stackingGroup] !== undefined) {
                groupingValues[series.stackingGroup].push(series);
            }
        }
        const keys: string[] = Object.keys(groupingValues);
        for (let k: number = 0; k < keys.length; k++) {
            const stackingSeies: Series[] = [];
            const stackedValues: number[] = [];
            const seriesCollection: Series[] = groupingValues[keys[k as number]];
            for (const series of seriesCollection) {
                if (series.type.indexOf('Stacking') !== -1 || (series.drawType.indexOf('Stacking') !== -1 &&
                    (series.chart.chartAreaType === 'PolarRadar'))) {
                    stackingGroup = (series.type.indexOf('StackingArea') !== -1) ? 'StackingArea100' :
                        (series.type.indexOf('StackingLine') !== -1) ? 'StackingLine100' : series.stackingGroup;
                    if (!lastPositive[stackingGroup as string]) {
                        lastPositive[stackingGroup as string] = [];
                        lastNegative[stackingGroup as string] = [];
                    }
                    yValues = series.yData;
                    startValues = [];
                    endValues = [];
                    stackingSeies.push(series);
                    visiblePoints = getVisiblePoints(series);
                    for (let j: number = 0, pointsLength: number = visiblePoints.length; j < pointsLength; j++) {
                        lastValue = 0;
                        value = +yValues[j as number]; // Fix for chart not rendering while y value is given as string issue
                        if (lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                            lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                        }
                        if (lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                            lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                        }
                        if (isStacking100) {
                            value = value / frequencies[stackingGroup as string][visiblePoints[j as number].xValue] * 100;
                            value = !isNaN(value) ? value : 0;
                            visiblePoints[j as number].percentage = +(value.toFixed(2));
                        } else {
                            stackedValues[j as number] = stackedValues[j as number] ?
                                stackedValues[j as number] + Math.abs(value) : Math.abs(value);
                        }
                        if (value >= 0) {
                            lastValue = lastPositive[stackingGroup as string][visiblePoints[j as number].xValue];
                            lastPositive[stackingGroup as string][visiblePoints[j as number].xValue] += value;
                        } else {
                            lastValue = lastNegative[stackingGroup as string][visiblePoints[j as number].xValue];
                            lastNegative[stackingGroup as string][visiblePoints[j as number].xValue] += value;
                        }
                        startValues.push(lastValue);
                        endValues.push(value + lastValue);
                        if (isStacking100 && (endValues[j as number] > 100)) {
                            endValues[j as number] = 100;
                        }
                    }
                    series.stackedValues = new StackValues(startValues, endValues);
                    const isLogAxis: boolean = series.yAxis.valueType === 'Logarithmic';
                    const isColumnBarType: boolean = (series.type.indexOf('Column') !== -1 || series.type.indexOf('Bar') !== -1);
                    series.yMin = isLogAxis && isColumnBarType && series.yMin < 1 ? series.yMin : (series.yAxis.startFromZero && series.yAxis.rangePadding === 'Auto' && series.yMin >= 0) ? 0 : parseFloat((Math.min.apply(0, isStacking100 ? startValues : endValues)).toFixed(10));
                    series.yMax = Math.max.apply(0, endValues);
                    if (series.yMin > Math.min.apply(0, endValues)) {
                        series.yMin = (isStacking100) ? -100 :
                            isLogAxis && isColumnBarType && series.yMin < 1 ? series.yMin : Math.min.apply(0, endValues);
                    }
                    if (series.yMax < Math.max.apply(0, startValues)) {
                        series.yMax = 0;
                    }
                }
            }
            this.findPercentageOfStacking(stackingSeies, stackedValues, isStacking100);
        }
    }
    private findPercentageOfStacking(stackingSeies: Series[], values: number[], isStacking100: boolean): void {
        for (const item of stackingSeies) {
            if (isStacking100) {
                return null;
            }
            for (const point of getVisiblePoints(item)) {
                point.percentage = Math.abs(+(<number>point.y / values[point.index] * 100).toFixed(2));
            }
        }
    }
    private findFrequencies(seriesCollection: Series[]): number[] {
        const frequencies: number[] = [];
        let stackingGroup: string;
        let visiblePoints: Points[] = [];
        for (const series of seriesCollection) {
            series.yAxis.isStack100 = series.type.indexOf('100') !== -1 ? true : false;
            visiblePoints = getVisiblePoints(series);
            if (series.type.indexOf('Stacking') !== -1) {
                stackingGroup = (series.type.indexOf('StackingArea') !== -1) ? 'StackingArea100' :
                    (series.type.indexOf('StackingLine') !== -1) ? 'StackingLine100' : series.stackingGroup;
                if (!frequencies[stackingGroup as string]) {
                    frequencies[stackingGroup as string] = [];
                }
                for (let j: number = 0, pointsLength: number = visiblePoints.length; j < pointsLength; j++) {
                    if (frequencies[stackingGroup as string][visiblePoints[j as number].xValue] === undefined) {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] = 0;
                    }
                    if (series.yData[j as number] > 0) {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] += series.yData[j as number];
                    } else {
                        frequencies[stackingGroup as string][visiblePoints[j as number].xValue] -= series.yData[j as number];
                    }
                }
            }
        }
        return frequencies;
    }
    /* private dataManagerFailure(e: { result: Object[] }): void {
         this.currentViewData = [];
         this.refreshChart();
     }*/

    /**
     * Renders the series on the chart.
     *
     * @param {Chart} chart - The chart on which the series is rendered.
     * @returns {void}
     * @private
     */
    public renderSeries(chart: Chart): void {
        if (this.chart.stockChart && this.xAxis.valueType === 'DateTimeCategory') {
            for (let i: number = 0; i < this.points.length; i++) {
                const index: number = this.xAxis.labels.indexOf(Date.parse(this.points[i as number].x.toString()).toString());
                this.points[i as number].xValue = index;
                if (chart.series.length > 1) {
                    this.xData[i as number] = index;
                    this.xMin = (this.xMin > index) ? index : this.xMin;
                    this.xMax = (this.xMax < index) ? index : this.xMax;
                }
            }
            if (this instanceof Series && this.type.indexOf('Spline') > -1) {
                const isArea: boolean = this.type.indexOf('Area') > -1;
                const isRange: boolean = this.type.indexOf('Range') > -1;
                this.chart[
                    'spline' + (isArea ? isRange ? 'RangeArea' : 'Area' : '') + 'SeriesModule'
                ].findSplinePoint(this);
            }
        }
        let seriesType: string = firstToLowerCase(this.type);
        seriesType = seriesType.replace('100', '');
        if (chart[seriesType + 'SeriesModule']) {
            if (this.category !== 'Indicator' && this.category !== 'TrendLine') {
                this.createSeriesElements(chart);
            }
            this.visiblePoints = getVisiblePoints(this);
            chart[seriesType + 'SeriesModule'].render(this, this.xAxis, this.yAxis, chart.requireInvertedAxis);
            if (this.category !== 'Indicator') {
                if (this.errorBar.visible) {
                    this.chart.errorBarModule.render(this);
                }
                if (this.marker.dataLabel.visible) {
                    chart.dataLabelModule.render(this, this.chart, this.marker.dataLabel);
                }
                this.appendSeriesElement(chart.seriesElements, chart);
            }
            if (!this.chart.enableCanvas) {
                this.performAnimation(chart, seriesType, this.errorBar, this.marker, this.marker.dataLabel);
            }
        }
    }

    /**
     * Creates elements for the series on the chart.
     *
     * @param {Chart} chart - The chart for which series elements are created.
     * @returns {void}
     * @private
     */
    public createSeriesElements(chart: Chart): void {
        if (this.category !== 'Indicator') {
            const elementId: string = chart.element.id;
            // 8 for extend border value 5 for extend size value
            const explodeValue: number = this.marker.border.width + 8 + 5;
            const render: SvgRenderer | CanvasRenderer = (this.type === 'Bubble') || (!this.marker.visible && chart.tooltip.shared && chart.enableCanvas) ?
                chart.svgRenderer : chart.renderer;
            const index: string | number = this.index === undefined ? this.category : this.index;
            let markerHeight: number;
            let markerWidth: number;
            let options: CircleOption | RectOption;
            if (this.type === 'Scatter' || this.drawType === 'Scatter') {
                markerHeight = (this.marker.height + explodeValue) / 2;
                markerWidth = (this.marker.width + explodeValue) / 2;
            } else {
                markerHeight = 0;
                markerWidth = 0;
            }
            if (chart.chartAreaType === 'PolarRadar') {
                const markerMaxValue: number = (this.drawType === 'Scatter') ? Math.max(this.marker.width, this.marker.height) : 0;
                options = new CircleOption(
                    elementId + '_ChartSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
                    this.clipRect.width / 2 + this.clipRect.x, this.clipRect.height / 2 + this.clipRect.y, chart.radius + markerMaxValue
                );
                this.clipRectElement = appendClipElement(chart.redraw, options, render as SvgRenderer, 'drawCircularClipPath');
            } else {
                options = new RectOption(
                    elementId + '_ChartSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
                    {
                        x: (this.xAxis.columnIndex === 0) ? -markerWidth : 0, y:
                        (this.yAxis.rowIndex === chart.rows.length - 1) ? -markerHeight : 0,
                        width: this.clipRect.width + (this.xAxis.columnIndex === chart.columns.length - 1 ? markerWidth * 2 : markerWidth),
                        height: this.clipRect.height + (this.yAxis.rowIndex === 0 ?  markerHeight * 2 : markerHeight)
                    });
                this.clipRectElement = appendClipElement(chart.redraw, options, render as SvgRenderer);
            }
            const transform: string = chart.chartAreaType === 'Cartesian' ? 'translate(' + this.clipRect.x + ',' + (this.clipRect.y) + ')' : '';
            this.symbolElement = null;
            this.seriesElement = render.createGroup({
                'id': elementId + 'SeriesGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + elementId + '_ChartSeriesClipRect_' + index + ')'
            });
            if (this.seriesElement) {
                this.seriesElement.setAttribute('role', 'region');
                this.seriesElement.setAttribute('aria-label', (this.name + ',' + this.type + ' series with ' + this.points.length + ' data points'));
                this.seriesElement.setAttribute('aria-hidden', 'false');
            }
            if (!this.chart.enableCanvas || this.type === 'Bubble') {
                this.seriesElement.setAttribute('tabindex', index === 0 ? '0' : !this.checkTabindex(chart.visibleSeries, index as number) ? '0' : '');
                this.seriesElement.setAttribute('style', 'outline: none');
                this.seriesElement.appendChild(this.clipRectElement);
            }
        }
    }

    private checkTabindex(visibleSeries: Series[], index: number): boolean {
        for (let i: number = 0; i < index; i++) {
            if (visibleSeries[i as number].visible) {
                return true;
            }
        }
        return false;
    }
    /**
     * Appends a series element to the chart.
     *
     * @param {Element} element - The series element to append.
     * @param {Chart} chart - The chart to which the series element will be appended.
     * @returns {void}
     * @private
     */
    public appendSeriesElement(element: Element, chart: Chart): void {
        const marker: MarkerSettingsModel = this.marker;
        const dataLabel: DataLabelSettingsModel = marker.dataLabel;
        const redraw: boolean = chart.redraw;
        if (this.category !== 'TrendLine') {
            appendChildElement(chart.enableCanvas, chart.seriesElements, this.seriesElement, redraw);
            const errorBar: ErrorBarSettingsModel = this.errorBar;
            if (errorBar.visible) {
                if (chart.chartAreaType === 'PolarRadar') {
                    appendChildElement(chart.enableCanvas, chart.seriesElements, this.seriesElement, redraw);
                } else {
                    appendChildElement(chart.enableCanvas, chart.seriesElements, this.errorBarElement, redraw);
                }
            }
        }
        if (
            marker.visible && (chart.chartAreaType === 'Cartesian' ||
                ((this.drawType !== 'Scatter') && chart.chartAreaType === 'PolarRadar')) && this.type !== 'Scatter' &&
            this.type !== 'Bubble' && this.type !== 'Candle' && this.type !== 'Hilo' && this.type !== 'HiloOpenClose' && this.symbolElement
        ) {
            appendChildElement(chart.enableCanvas, chart.seriesElements, this.symbolElement, redraw);
        }
        if (dataLabel.visible && this.textElement) {
            appendChildElement(chart.enableCanvas, chart.dataLabelElements, this.shapeElement, redraw);
            appendChildElement(chart.enableCanvas, chart.dataLabelElements, this.textElement, redraw);
        }
        if (!chart.enableCanvas && chart.dataLabelElements.hasChildNodes()) {
            chart.seriesElements.appendChild(chart.dataLabelElements);
        }
    }
    /**
     * Performs animation for the specified chart elements.
     *
     * @param {Chart} chart - The chart for which animation is performed.
     * @param {string} type - The type of animation to be performed.
     * @param {ErrorBarSettingsModel} errorBar - The error bar settings for the animation.
     * @param {MarkerSettingsModel} marker - The marker settings for the animation.
     * @param {DataLabelSettingsModel} dataLabel - The data label settings for the animation.
     * @returns {void}
     * @private
     */
    public performAnimation(
        chart: Chart, type: string, errorBar: ErrorBarSettingsModel,
        marker: MarkerSettingsModel, dataLabel: DataLabelSettingsModel
    ): void {
        if (((this.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && chart.animateSeries && (!chart.stockChart || !chart.stockChart.isStockChartRendered)) {
            chart[type + 'SeriesModule'].doAnimation(this);
            if (errorBar.visible) {
                chart.errorBarModule.doErrorBarAnimation(this);
            }
            if (marker.visible) {
                chart.markerRender.doMarkerAnimation(this);
            }
            //to datalabel animation disabled for edge and IE
            if (dataLabel.visible && Browser.info.name !== 'edge' && !Browser.isIE) {
                chart.dataLabelModule.doDataLabelAnimation(this);
            }
        }
    }

    /**
     * Sets the color of a data point.
     *
     * @param {Points} point - The data point.
     * @param {string} color - The color to set.
     * @returns {string} - The updated color.
     * @private
     */
    public setPointColor(point: Points, color: string): string {
        color = point.interior || color;
        return point.isEmpty ? (this.emptyPointSettings.fill || color) : color;
    }
    /**
     * Sets the border color of a data point.
     *
     * @param {Points} point - The data point.
     * @param {BorderModel} border - The border color to set.
     * @returns {BorderModel} - The updated border color.
     * @private
     */
    public setBorderColor(point: Points, border: BorderModel): BorderModel {
        border.width = point.isEmpty ? (this.emptyPointSettings.border.width || border.width) : border.width;
        border.color = point.isEmpty ? (this.emptyPointSettings.border.color || border.color) : border.color;
        return border;
    }

    /**
     * Adds a data point to the data source.
     *
     * @function addPoint
     * @param {Object} dataPoint - The data point to be added.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    public addPoint(dataPoint: Object, duration?: number ): void {
        const yMin: number = this.yMin;
        const yMax: number = this.yMax;
        this.removeTrackballElements();
        (this.dataSource as Object[]).push(dataPoint);
        if (this.type === 'Radar' || this.type === 'Polar') {
            return this.chart.refresh();
        }
        if (this.type === 'Histogram') {
            this.currentViewData = this.chart[firstToLowerCase(this.type) + 'SeriesModule'].
                processInternalData(extend([], this.dataSource, null, true) as Object[], this);
            for (let i: number = 0; i < (this.currentViewData as Object[]).length; i++) {
                this.updatePoint(i);
            }
        } else {
            this.currentViewData = this.dataSource;
            const pointIndex: number = this.points.length === 0 ? 0 : this.points[this.points.length - 1].index + 1;
            this.updatePoint(pointIndex);
        }
        if (this.category === 'Pareto') {
            const dataSource: Object[] = extend([], this.dataSource, null, true) as Object[];
            const series: Series = this.chart.visibleSeries[this.index + this.chart.series.length];
            series.currentViewData = this.chart.paretoSeriesModule.performCumulativeCalculation(dataSource, this);
            for (let i: number = 0; i < (series.currentViewData as Object[]).length; i++) {
                if (!series.points[i as number]) {
                    series.updatePoint(i);
                }
                series.points[i as number].y = series.points[i as number].yValue = series.currentViewData[i as number][series.yName];
            }
        }
        this.updateSplineValue();
        this.chart.calculateStackValues();
        this.chart.redraw = this.chart.enableAnimation;
        const chartDuration: number = this.chart.duration;
        this.chart.duration = isNullOrUndefined(duration) ? 500 : duration;
        this.chart.animateSeries = false;
        this.chart.pointsAdded = true;
        if (this.chart.enableAnimation && (!(this.isRectSeries || this.type === 'Bubble' || this.type === 'Scatter')) && (this.type.indexOf('step') === -1)) {
            if (this.marker && this.marker.visible && this.visible) {
                for (let i: number = this.points.length - 2; i >= 0; i--) {
                    if (this.points[i as number] && this.points[i as number].symbolLocations[0] !== undefined) {
                        this.chart.markerRender.renderMarker(this, this.points[this.points.length - 2],
                                                             this.points[i as number].symbolLocations[0], null, true);
                        break;
                    }
                }
            }
        }
        if (this.yMin >= yMin && this.yMax <= yMax) {
            if (!setRange(this.xAxis)) {
                this.xAxis.baseModule.calculateRangeAndInterval(new Size(this.xAxis.rect.width, this.chart.availableSize.height),
                                                                this.xAxis);
                this.xAxis.updateAxis();
            }
            this.chart.pointsAdded = false;
            this.updateSeries(true , false);
        }
        if (this.yMin < yMin || this.yMax > yMax) {
            this.updateChartAxis();
            this.chart.pointsAdded = false;
            this.updateSeries(true , true);
        }
        this.chart.redraw = false;
        this.chart.duration = chartDuration;
    }

    /**
     * Removes a data point from the series data source at the specified index.
     *
     * @function removePoint
     * @param {number} index - The index of the data point to be removed.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    public removePoint(index: number, duration?: number): void {
        const dataSource: Object[] = extend([], this.dataSource, null, true) as Object[];
        const chartDuration: number = this.chart.duration;
        if (dataSource.length > 0 && index >= 0 && index < dataSource.length) {
            dataSource.splice(index, 1);
            (this.dataSource as object[]).splice(index, 1);
            this.removeTrackballElements(index);
            if (this.type === 'Radar' || this.type === 'Polar') {
                return this.chart.refresh();
            }
            this.chart.redraw = this.chart.enableAnimation; this.chart.animateSeries = false;
            this.chart.pointsAdded = true;
            this.chart.duration = isNullOrUndefined(duration) ? 500 : duration;
            if (this.type === 'Histogram') {
                const length: number = this.points.length;
                this.points = []; this.visiblePoints = [];
                this.currentViewData = this.chart[firstToLowerCase(this.type) + 'SeriesModule'].
                    processInternalData(extend([], this.dataSource, null, true) as Object[], this);
                for (let i: number = 0; i < (this.currentViewData as Object[]).length; i++) {
                    this.updatePoint(i as number);
                }
                if (length > this.points.length) {
                    this.removedPointIndex = index;
                }
            } else {
                this.removedPointIndex = index;
                this.points.splice(index, 1);
                this.visiblePoints.splice(index, 1);
            }
            this.yData = []; this.xData = [];
            const yMin: number = this.yMin;
            const yMax: number = this.yMax;
            this.yMin = Infinity; this.xMin = Infinity;
            this.yMax = -Infinity; this.xMax = -Infinity;
            if (this.xAxis.valueType.indexOf('Category') > -1 && this.chart.series.length === 1) {
                this.xAxis.labels = []; this.xAxis.indexLabels = {};
            }
            if (index === 0) { this.chart.pointsRemoved = this.chart.enableAnimation; }
            for (let i: number = 0; i < this.points.length; i++) {
                this.updatePointsAfterRemoval(i as number);
            }
            if (this.category === 'Pareto') {
                const series: Series = this.chart.visibleSeries[this.index + this.chart.series.length];
                series.yMin = Infinity; series.xMin = Infinity; series.yMax = -Infinity; series.xMax = -Infinity;
                series.points.splice(index, 1); series.visiblePoints.splice(index, 1);
                series.currentViewData = this.chart.paretoSeriesModule.performCumulativeCalculation(this.dataSource, this);
                for (let i: number = 0; i < (series.currentViewData as Object[]).length; i++) {
                    series.points[i as number].y = series.points[i as number].yValue = series.currentViewData[i as number][series.yName];
                    series.updatePointsAfterRemoval(i as number);
                }
            }
            this.updateSplineValue();
            this.chart.calculateStackValues();

            if (!setRange(this.xAxis) && yMax === this.yMax && yMin === this.yMin) {
                this.xAxis.baseModule.calculateRangeAndInterval(new Size(this.xAxis.rect.width, this.chart.availableSize.height),
                                                                this.xAxis);
                this.xAxis.updateAxis();
                this.createSeriesElements(this.chart);
                this.chart.pointsAdded = false;
                this.updateSeries(true, false);
            }
            else if (yMax < this.yMax || yMin > this.yMin || yMax > this.yMax || yMin < this.yMin) {
                this.updateChartAxis();
                this.createSeriesElements(this.chart);
                this.chart.pointsAdded = false;
                this.updateSeries(true, true);
            }
        }
        appendChildElement(this.chart.enableCanvas, this.chart.seriesElements, this.seriesElement, true);
        this.chart.redraw = false;
        this.chart.duration = chartDuration;
        this.chart.pointsRemoved = false;
        this.removedPointIndex = null;
    }

    private updatePointsAfterRemoval(index: number): void {
        const point: Points = this.points[index as number];
        const option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        const dateParser: Function = this.chart.intl.getDateParser(option);
        const dateFormatter: Function = this.chart.intl.getDateFormat(option);
        if (this.xAxis.valueType === 'Category' && this.chart.series.length === 1) {
            this.pushCategoryData(point, index, <string>point.x);
        } else if (this.xAxis.valueType === 'DateTimeCategory' && this.chart.series.length === 1) {
            this.pushCategoryData(point, index, Date.parse(dateParser(dateFormatter(point.x))).toString());
        }
        this.pushData(point, index);
        this.setEmptyPoint(this.points[index as number], index);
    }

    /**
     * Removes trackball elements from the series.
     *
     * @param {number} index - The index of the data point.
     * @returns {void}
     */
    private removeTrackballElements(index?: number): void {
        if (this.marker.visible) {
            if (index !== undefined) {
                const baseId: string = this.chart.element.id + '_Series_' + this.index + '_Point_' + index + '_Trackball_';
                const trackball0: Element = getElement(baseId + '0');
                if (trackball0) { trackball0.remove(); }
                const trackball1: Element = getElement(baseId + '1');
                if (trackball1) { trackball1.remove(); }
                const symbolElement: Element = getElement(this.chart.element.id + '_Series_' + this.index + '_Point_' + index + '_Symbol');
                if (symbolElement) {
                    symbolElement.setAttribute('visibility', 'visible');
                }
            } else {
                const baseClassPattern: string = this.chart.element.id + '_EJ2-Trackball_Series_' + this.index + '_Point_';
                const elements: NodeListOf<Element> = document.querySelectorAll(`[class*="${baseClassPattern}"]`);
                if (elements[0]) {
                    const pointIndexMatch: RegExpMatchArray = elements[0].id.match(/_Point_(\d+)_/);
                    const pointIndex: number = pointIndexMatch ? parseInt(pointIndexMatch[1], 10) : null;
                    elements[0].remove();
                    const symbolElement: Element = getElement(this.chart.element.id + '_Series_' + this.index + '_Point_' + pointIndex + '_Symbol');
                    if (symbolElement) {
                        symbolElement.setAttribute('visibility', 'visible');
                    }
                }
                if (elements[1]) { elements[1].remove(); }
            }
        }
        if (this.chart.tooltip.enable) {
            this.chart.tooltipModule.previousPoints = [];
            const tooltipElement: Element = getElement(this.chart.element.id + '_tooltip');
            if (tooltipElement) { tooltipElement.remove(); }
        }
    }

    /**
     * Sets the data source with the provided data.
     *
     * @function setData
     * @param {Object[]} data - An array of objects representing the data points.
     * @param {number} duration - The duration for the animation.
     * @returns {void}
     */
    public setData(data: Object[], duration?: number): void {

        if (!data) {
            return null;
        }
        const yMin: number = this.yMin;
        const yMax: number = this.yMax;
        this.yMin = Infinity; this.yMax = -Infinity;
        const pointList: number[] = [];
        let samePoints: boolean = false;
        if ((this.dataSource as Object[]).length === data.length && !(this.type === 'Radar' || this.type === 'Polar')) {
            samePoints = true;
            this.yData = [];
            if (this.type === 'Histogram' && (this.dataSource as Object[]).length === data.length) {
                const newHistogramData: Object[] = this.chart[firstToLowerCase(this.type) + 'SeriesModule'].
                    processInternalData(extend([], data, null, true) as Object[], this);
                this.currentViewData = newHistogramData;
                for (let j: number = 0; j < newHistogramData.length; j++) {
                    this.updatePoint(j);
                }
            } else {
                for (let i: number = 0; i < data.length; i++) {
                    let newData: number | string = data[i as number][this.xName];
                    let existingData: number | string = this.dataSource[i as number][this.xName];
                    if (data[i as number][this.xName] instanceof Date) {
                        newData = data[i as number][this.xName].getTime();
                        existingData = this.dataSource[i as number][this.xName].getTime();
                    }
                    if (existingData === newData) {
                        const point: Points = this.points[i as number];
                        const getObjectValueByMappingString: Function = this.enableComplexProperty ? getValue : this.getObjectValue;
                        const existingPoint: Object = this.dataSource[i as number]; const newPoint: Object = data[i as number];
                        if ((this.seriesType === 'XY' || this.seriesType === 'BoxPlot') && (existingPoint[this.yName] !== newPoint[this.yName] || existingPoint[this.size] !== newPoint[this.size])) {
                            point.y = getObjectValueByMappingString(this.yName, newPoint);
                            if (this.type === 'Bubble' && existingPoint[this.size] !== newPoint[this.size]) {
                                point.size = getObjectValueByMappingString(this.size, newPoint);
                            }
                            pointList.push(i);
                        } else if (existingPoint[this.high] !== newPoint[this.high] || existingPoint[this.low] !== newPoint[this.low] ||
                             existingPoint[this.open] !== newPoint[this.open] || existingPoint[this.close] !== newPoint[this.close] ||
                             existingPoint[this.volume] !== newPoint[this.volume]) {
                            point.high = getObjectValueByMappingString(this.high, newPoint);
                            point.low = getObjectValueByMappingString(this.low, newPoint);
                            point.open = getObjectValueByMappingString(this.open, newPoint);
                            point.close = getObjectValueByMappingString(this.close, newPoint);
                            point.volume = getObjectValueByMappingString(this.volume, newPoint);
                            pointList.push(i);
                        }
                        point.yValue = <number>point.y;
                        this.setEmptyPoint(point, i);
                        this.dataSource[i as number] = data[i as number];
                    }
                    else {
                        samePoints = false;
                        break;
                    }
                }
            }
        }
        if (!samePoints) {
            this.dataSource = data;
        } else {
            this.chart.redraw = this.chart.enableAnimation; this.chart.animateSeries = false;
            this.chart.pointsAdded = true;
            const chartDuration: number = this.chart.duration;
            this.chart.duration = isNullOrUndefined(duration) ? 500 : duration;
            this.chart.calculateStackValues();
            this.updateSplineValue();
            if (yMax === this.yMax && yMin === this.yMin && this.visible) {
                this.chart.pointsAdded = false;
                this.chart[firstToLowerCase((this.category === 'Pareto' ? 'Column' : this.type.replace('100', ''))) + 'SeriesModule'].updateDirection(this, pointList, this.chart.requireInvertedAxis);
                if (this.chart.annotationModule) {
                    this.chart.annotationModule.renderAnnotations(getElement((this.chart.element.id) + '_Secondary_Element'));
                }
            }
            else if ((yMax < this.yMax || yMin > this.yMin || yMax > this.yMax || yMin < this.yMin) && this.visible) {
                const maximumLabelWidth: number = this.yAxis.maxLabelSize.width;
                this.yAxis.baseModule.calculateRangeAndInterval(
                    new Size(this.chart.availableSize.width, this.yAxis.rect.height),
                    this.yAxis);
                if (maximumLabelWidth < this.yAxis.maxLabelSize.width) {
                    this.chart.calculateBounds();
                    this.chart.axisCollections.forEach(function (axis: Axis): void {
                        if (!setRange(axis)) { axis.updateAxis(); }
                    });
                    (this.chart.chartAxisLayoutPanel as CartesianAxisLayoutPanel).drawPaneLines(this.chart);
                    this.chart.renderAreaBorder();
                }
                else {
                    if (!setRange(this.yAxis)) {
                        this.yAxis.updateAxis();
                    }
                    if (this.type === 'Histogram' && !setRange(this.xAxis)) {
                        this.xAxis.baseModule.calculateRangeAndInterval(new Size(this.xAxis.rect.width,
                                                                                 this.chart.availableSize.height), this.xAxis);
                        this.xAxis.updateAxis();
                    }
                }
                this.chart.pointsAdded = false;
                this.updateSeries(false, true);
                if (this.marker.dataLabel.visible && this.chart.dataLabelModule) {
                    this.chart.dataLabelModule.doDataLabelAnimation(this);
                }
                if (this.chart.stripLineModule) {
                    this.chart.stripLineModule.renderStripLine(this.chart, 'Behind', this.chart.axisCollections);
                }
            }
            this.chart.redraw = false; this.chart.pointsRemoved = false;
            this.chart.duration = chartDuration;
        }
    }

    /**
     * Updates the chart axes based on current data and axis bounds.
     *
     * @returns {void}
     */
    private updateChartAxis(): void {
        const maximumLabelWidth: number = this.yAxis.maxLabelSize.width;
        this.yAxis.baseModule.calculateRangeAndInterval(new Size(this.chart.availableSize.width, this.yAxis.rect.height), this.yAxis);
        if (maximumLabelWidth < this.yAxis.maxLabelSize.width) {
            this.chart.calculateBounds();
            this.chart.axisCollections.forEach((axis: Axis) => {
                if (!setRange(axis)) { axis.updateAxis(); }
            });
            (this.chart.chartAxisLayoutPanel as CartesianAxisLayoutPanel).drawPaneLines(this.chart);
            this.chart.renderAreaBorder();
        }
        else {
            if (!setRange(this.xAxis)) {
                this.xAxis.baseModule.calculateRangeAndInterval(new Size(this.xAxis.rect.width,
                                                                         this.chart.availableSize.height), this.xAxis);
                this.xAxis.updateAxis();
            }
            if (!setRange(this.yAxis)) {
                this.yAxis.updateAxis();
            }
        }
        if (this.chart.stripLineModule) {
            this.chart.stripLineModule.renderStripLine(this.chart, 'Behind', this.chart.axisCollections);
        }
    }

    private updateSeries(xAxis: boolean, yAxis: boolean): void {
        let seriesCollection: Series[] = [];
        if (xAxis && yAxis) {
            const set: Set<Series> = new Set(this.xAxis.series.concat(this.yAxis.series));
            set.forEach((series: Series) => {
                seriesCollection.push(series);
            });
        }
        else {
            seriesCollection = xAxis ? this.xAxis.series.slice() : this.yAxis.series.slice();
        }
        for (const series of seriesCollection) {
            if (series.visible) {
                findClipRect(series, this.chart.enableCanvas);
                const transform: string = 'translate(' + this.clipRect.x + ',' + (this.clipRect.y) + ')';
                series.seriesElement.setAttribute('transform', transform);
                series.chart[firstToLowerCase(series.type.replace('100', '')) + 'SeriesModule'].render(series, series.xAxis, series.yAxis, series.chart.requireInvertedAxis, series.chart.enableAnimation);
                if (series.marker.visible && (series.chart.chartAreaType === 'Cartesian') && series.type !== 'Scatter' && series.type !== 'Bubble'
                    && series.type !== 'Candle' && series.type !== 'Hilo' && series.type !== 'HiloOpenClose' && series.symbolElement) {
                    series.symbolElement.setAttribute('transform', transform);
                    appendChildElement(series.chart.enableCanvas, series.chart.seriesElements, series.symbolElement, true);
                }
                if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                    series.chart.dataLabelCollections = [];
                    series.chart.dataLabelModule.render(series, series.chart, series.marker.dataLabel);
                    if (series.textElement) {
                        if (series.shapeElement) { series.shapeElement.setAttribute('transform', transform); }
                        appendChildElement(series.chart.enableCanvas, series.chart.dataLabelElements, series.shapeElement, true);
                        series.textElement.setAttribute('transform', transform);
                        appendChildElement(series.chart.enableCanvas, series.chart.dataLabelElements, series.textElement, true);
                    }
                }
                if (series.chart.annotationModule) {
                    series.chart.annotationModule.renderAnnotations(getElement((series.chart.element.id) + '_Secondary_Element'));
                }
            }
        }
    }
    private updatePoint(index: number): void {
        const point: Points = new Points();
        const textMappingName: string = this instanceof Series && this.marker.dataLabel.name ?
            this.marker.dataLabel.name : '';
        const xName: string = (this instanceof Series && this.type === 'Histogram') ? 'x' : this.xName;

        if (this.xAxis.valueType === 'Category') {
            this.pushCategoryPoint(point, index, textMappingName, xName);
        }
        else if (this.xAxis.valueType.indexOf('DateTime') > -1) {
            const point: Points = this.points[index as number];
            const option: DateFormatOptions = {
                skeleton: 'full',
                type: 'dateTime'
            };
            const dateParser: Function = this.chart.intl.getDateParser(option);
            const dateFormatter: Function = this.chart.intl.getDateFormat(option);
            this.pushDateTimePoint(point, index, textMappingName, xName, dateParser, dateFormatter);
        }
        else {
            this.pushDoublePoint(point, index, textMappingName, xName);
        }
    }
}
