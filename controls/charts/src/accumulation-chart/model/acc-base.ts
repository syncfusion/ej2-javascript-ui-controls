/**
 * AccumulationChart base file
 */
import { Property, ChildProperty, Complex, createElement, Browser, animationMode, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Border, Font, Animation, EmptyPointSettings, Connector } from '../../common/model/base';
import { Rect, Size, PathOption, measureText } from '@syncfusion/ej2-svg-base';
import { ChartLocation, stringToNumber, appendChildElement, subtractRect } from '../../common/utils/helper';
import { AccumulationType, AccumulationLabelPosition, PyramidModes } from '../model/enum';
import { IAccSeriesRenderEventArgs, IAccPointRenderEventArgs, IAccTextRenderEventArgs } from '../model/pie-interface';
import { LegendShape, SelectionPattern } from '../../common/utils/enum';
import { AccumulationDataLabelSettingsModel } from '../model/acc-base-model';
import { Data } from '../../common/model/data';
import { seriesRender, pointRender } from '../../common/model/constants';
import { getSeriesColor } from '../../common/model/theme';
import { FontModel, BorderModel, AnimationModel, ConnectorModel, EmptyPointSettingsModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { getElement, firstToLowerCase } from '../../common/utils/helper';
import { Units, Alignment, Regions, Position, SeriesCategories, LabelOverflow, TextWrap } from '../../common/utils/enum';
import { GroupModes } from './enum';
import { BaseSelection } from '../../common/user-interaction/selection';
import { LegendOptions } from '../../common/legend/legend';

/**
 * Configures the annotation settings for an accumulation chart.
 * Annotations are used to highlight or provide additional information about specific points or regions in the accumulation chart.
 */
export class AccumulationAnnotationSettings extends ChildProperty<AccumulationAnnotationSettings> {
    /**
     * The content of the annotation, which can also accept the ID of a custom element.
     *
     * @default null
     */
    @Property(null)
    public content: string;

    /**
     * If `coordinateUnit` is set to `Pixel`, x specifies the pixel value.
     * If `coordinateUnit` is set to `Point`, x specifies the data value.
     *
     * @default '0'
     */
    @Property('0')
    public x: string | Date | number;

    /**
     * If `coordinateUnit` is set to `Pixel`, y specifies the pixel value.
     * If `coordinateUnit` is set to `Point`, y specifies the data value.
     *
     * @default '0'
     */
    @Property('0')
    public y: string | number;

    /**
     * Specifies the coordinate units of the annotation.
     * The options are:
     * * Pixel - Renders the annotation based on x and y pixel values.
     * * Point - Renders the annotation based on x and y data values.
     *
     * @default 'Pixel'
     */

    @Property('Pixel')
    public coordinateUnits: Units;

    /**
     * Specifies the regions of the annotation.
     * The options are:
     * * Chart - Renders the annotation based on chart coordinates.
     * * Series - Renders the annotation based on series coordinates.
     *
     * @default 'Chart'
     */

    @Property('Chart')
    public region: Regions;

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

    @Property('Middle')
    public verticalAlignment: Position;

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

    @Property('Center')
    public horizontalAlignment: Alignment;

    /**
     * A description for the annotation that provides additional information about its content for screen readers.
     *
     * @default null
     */
    @Property(null)
    public description: string;

}

/**
 * This class provides options to customize the appearance and behavior of data labels within a series.
 */
export class AccumulationDataLabelSettings extends ChildProperty<AccumulationDataLabelSettings> {

    /**
     * If set to true, data labels for the series are render. By default, it is set to false.
     *
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * If set to true, the data label for zero values in the series will be rendered.
     *
     * @default true
     */

    @Property(true)
    public showZero: boolean;

    /**
     * Specifies the data source field that contains the data label value.
     *
     * @default null
     */

    @Property(null)
    public name: string;

    /**
     * The background color of the data label accepts hex and rgba values as valid CSS color strings.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public fill: string;

    /**
     * Specifies the position of the data label relative to the data point.
     * The available options are:
     * * Outside - Places the data label outside the data point, which is typically used to avoid overlap with the data point.
     * * Inside - Places the data label inside the data point, which is useful for displaying labels within the data point.
     *
     * @default 'Inside'
     */

    @Property('Inside')
    public position: AccumulationLabelPosition;

    /**
     * Specifies the X-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    @Property(5)
    public rx: number;

    /**
     * Specifies the Y-axis rounded corner radius for the data label.
     > Note that `border` values must not be null for this feature to work.
     *
     * @default 5
     */
    @Property(5)
    public ry: number;

    /**
     * Specifies the rotation angle of the data label.
     *
     * @default 0
     */
    @Property(0)
    public angle: number;

    /**
     * If set to true, the data label will be rotated according to the specified angle.
     *
     * @default false
     */

    @Property(false)
    public enableRotation: boolean;

    /**
     * Configures the appearance of the border lines with options for width and color properties.
     */

    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Customizes the appearance of the data label text with options for font size, color, style, weight, and family.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public font: FontModel;

    /**
     * Options to customize the connector line in the series.
     * By default, the connector length for the Pie series is set to '4%'. For other series, it is set to `null`.
     */
    @Complex<ConnectorModel>({}, Connector)
    public connectorStyle: ConnectorModel;

    /**
     * Custom template to format the content of the data label.
     * Use `${point.x}` and `${point.y}` as placeholders to display the corresponding data point values.
     *
     * @default null
     * @aspType string
     */

    @Property(null)
    public template: string | Function;

    /**
     * Used to format the data label, accepting global string formats like `C`, `n1`, `P`, etc.
     * It also supports placeholders, such as `{value}°C`, where `{value}` represent the point data label (e.g., 20°C).
     *
     * @default ''
     */
    @Property('')
    public format: string;

    /**
     * Use this property to limit the label width and apply wrapping or trimming.
     *
     * @default 'null'
     */

    @Property(null)
    public maxWidth: number;

    /**
     * Defines the text overflow behavior for the data label when the text exceeds the bounds.
     * Available options are:
     * * Clip - Truncates the data label when it overflows the bounds.
     * * Ellipsis - Displays an ellipsis ("...") at the end of the data label when it overflows the bounds.
     * Set the maximum width of the label using the `maxWidth` property.
     *
     * @default 'Ellipsis'
     */

    @Property('Ellipsis')
    public textOverflow: LabelOverflow;

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

    @Property('Normal')
    public textWrap: TextWrap;
}

/**
 * The `PieCenter` class provides options to set the center position for the Pie series in a chart.
 */
export class PieCenter extends ChildProperty<PieCenter> {

    /**
     * Specifies the x-coordinate of the center position for the Pie series in the chart.
     *
     * @default '50%'
     */
    @Property('50%')
    public x: string;

    /**
     * Specifies the y-coordinate of the center position for the Pie series in the chart.
     *
     * @default '50%'
     */
    @Property('50%')
    public y: string;

}

/**
 * The `AccPoints` class is used to define and manage the data points within a series of accumulation charts.
 *
 * @public
 */
export class AccPoints {
    /** Accumulation point x value. */
    public x: Object;
    /** Accumulation point y value. */
    public y: number;
    /** Accumulation point visibility. */
    public visible: boolean = true;
    /** Accumulation point text. */
    public text: string;
    /** Accumulation point tooltip. */
    public tooltip: string;
    /** Accumulation point slice radius. */
    public sliceRadius: string;
    /** Accumulation point original text. */
    public originalText: string;
    /** @private */
    public label: string;
    /** Accumulation point color. */
    public color: string;
    /** Accumulation point percentage value. */
    public percentage: number;
    /** Accumulation point symbol location. */
    public symbolLocation: ChartLocation = null;
    /** Accumulation point index. */
    public index: number;
    /** @private */
    public midAngle: number;
    /** @private */
    public startAngle: number;
    /** @private */
    public endAngle: number;
    /** @private */
    public labelAngle: number;
    /** @private */
    public region: Rect = null;
    /** @private */
    public labelRegion: Rect = null;
    /** @private */
    public labelVisible: boolean = true;
    /** @private */
    public labelPosition: AccumulationLabelPosition;
    /** @private */
    public yRatio: number;
    /** @private */
    public heightRatio: number;
    /** @private */
    public labelOffset: ChartLocation;
    public regions: Rect[] = null;
    /** @private */
    public isExplode: boolean = false;
    /** @private */
    public isClubbed: boolean = false;
    /** @private */
    public isSliced: boolean = false;
    /** @private */
    public start: number;
    /** @private */
    public degree: number;
    /** @private */
    public transform: string;
    /** @private */
    public separatorY: string;
    /** @private */
    public adjustedLabel: boolean;
    /** @private */
    public connectorLength: number;
    /** @private  */
    public argsData: IAccTextRenderEventArgs = null;
    /** @private  */
    public textSize: Size;
    /** @private */
    public isLabelUpdated: number = null;
    /** @private */
    public initialLabelRegion: Rect = null;
    /** @private */
    public templateElement: HTMLElement;
    /** @private */
    public legendImageUrl: string;
    /** @private */
    public labelCollection: string[];
}

/**
 * Configures the series in the accumulation chart.
 */

export class AccumulationSeries extends ChildProperty<AccumulationSeries> {

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

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies a query to select data from the data source. This property is applicable only when the data source is an `ej.DataManager`.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * The data source field that contains the x value.
     *
     * @default ''
     */

    @Property('')
    public xName: string;

    /**
     * The `name` property allows for setting a name for the series.
     *
     * @default ''
     */

    @Property('')
    public name: string;

    /**
     * The data source field that contains the value to be displayed in the tooltip.
     *
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * The data source field that contains the y value.
     *
     * @default ''
     */

    @Property('')
    public yName: string;

    /**
     * If set to true, the series will be visible. If set to false, the series will be hidden.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Options for customizing the border of the series.
     */

    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the animation of the series.
     * By default, animation is enabled with a duration of 1000 milliseconds (about 1 second). It can be disabled by setting enable to `false`.
     * The following properties are supported in animation:
     * * enable: If set to true, the series is animated on initial loading.
     * * duration: The duration of the animation in milliseconds.
     * * delay: The delay before the animation starts, in milliseconds.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

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

    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * The URL for the image to be displayed as a legend icon.
     > Note that `legendShape` must be set to `Image`.
     *
     * @default ''
     */

    @Property('')
    public legendImageUrl: string;

    /**
     * The data source field that contains the color value of a point.
     * It is applicable for series.
     *
     * @default ''
     */

    @Property('')
    public pointColorMapping: string;

    /**
     * When set to true, a different pattern is applied to each slice of the pie.
     *
     * @default false
     */
    @Property(false)
    public applyPattern: boolean;

    /**
     * The `selectionStyle` property is used to specify custom CSS styles for the selected series or points.
     *
     * @default null
     */
    @Property(null)
    public selectionStyle: string;

    /**
     * The y-values of the accumulation series that are less than `groupTo` are combined into a single slice named 'others'.
     *
     * @default null
     */
    @Property(null)
    public groupTo: string;

    /**
     * In the accumulation series, y-values less than `groupMode` are combined into a single slice named 'others'.
     *
     * @default Value
     */
    @Property('Value')
    public groupMode: GroupModes;

    /**
     * The data label property can be used to show the data label and customize its position and styling.
     */
    @Complex<AccumulationDataLabelSettingsModel>({}, AccumulationDataLabelSettings)
    public dataLabel: AccumulationDataLabelSettingsModel;

    /**
     * The `palettes` array defines a set of colors used for rendering the accumulation chart's points. Each color in the array is applied to each point in order.
     *
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Specifies the starting angle for the series, in degrees.
     *
     * @default 0
     */
    @Property(0)
    public startAngle: number;

    /**
     * Specifies the ending angle for the series, in degrees.
     *
     * @default null
     */
    @Property(null)
    public endAngle: number;

    /**
     * Specifies the radius of the pie series as a percentage of the chart's size.
     *
     * @default null
     */
    @Property(null)
    public radius: string;

    /**
     * When the `innerRadius` value is greater than 0%, a donut shape will appear in the pie series. It accepts only percentage values.
     *
     * @default '0'
     */
    @Property('0')
    public innerRadius: string;

    /**
     * Specifies the type of series in the accumulation chart.
     *
     * @default 'Pie'
     */
    @Property('Pie')
    public type: AccumulationType;

    /**
     * Controls whether the tooltip for the accumulation chart series is enabled or disabled. Set to true to display tooltips on hover, or false to hide them.
     *
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * If set to true, series points will explode on mouse click or touch.
     *
     * @default false
     */
    @Property(false)
    public explode: boolean;

    /**
     * Specifies the distance of the point from the center, which can be defined in both pixels and percentage.
     *
     * @default '30%'
     */
    @Property('30%')
    public explodeOffset: string;

    /**
     * If set to true, all the points in the series will explode on load.
     *
     * @default false
     */
    @Property(false)
    public explodeAll: boolean;

    /**
     * Index of the point in the series to be exploded on initial load.
     *
     * @default null
     *
     * @aspDefaultValueIgnore
     *
     * @blazorDefaultValue Double.NaN
     */
    @Property(null)
    public explodeIndex: number;

    /**
     * Customization options for the appearance of empty points in the series, where `null` or `undefined` values are considered as empty points.
     */
    @Complex<EmptyPointSettingsModel>({ mode: 'Drop' }, EmptyPointSettings)
    public emptyPointSettings: EmptyPointSettingsModel;

    /**
     * Defines the distance between the segments of a funnel or pyramid series.
     * The range is from 0 to 1.
     *
     * @default 0
     */
    @Property(0)
    public gapRatio: number;

    /**
     * Defines the width of the funnel or pyramid series relative to the chart area.
     *
     * @default '80%'
     */
    @Property('80%')
    public width: string;

    /**
     * Defines the height of the funnel or pyramid series relative to the chart area.
     *
     * @default '80%'
     */
    @Property('80%')
    public height: string;

    /**
     * Defines the width of the funnel neck relative to the chart area.
     *
     * @default '20%'
     */
    @Property('20%')
    public neckWidth: string;

    /**
     * Defines the height of the funnel neck relative to the chart area.
     *
     * @default '20%'
     */
    @Property('20%')
    public neckHeight: string;

    /**
     * Defines how the values are represented, either through the height or surface area of the segments.
     *
     * @default 'Linear'
     */
    @Property('Linear')
    public pyramidMode: PyramidModes;

    /**
     * Sets the opacity of the series, with a value between 0 and 1 where 0 is fully transparent and 1 is fully opaque.
     *
     * @default 1.
     */
    @Property(1)
    public opacity: number;

    /**
     * Defines the pattern of dashes and gaps for the series border.
     *
     * @default '0'
     */

    @Property('0')
    public dashArray: string;

    /** @private */
    public points: AccPoints[] = [];
    /** @private */
    public clubbedPoints: AccPoints[] = [];
    /** @private */
    public dataModule: Data;
    /** @private */
    public sumOfPoints: number = 0;
    /** @private */
    public index: number;
    /** @private */
    public sumOfClub: number;
    /** @private */
    public resultData: Object;
    /** @private */
    public lastGroupTo: string;
    /** @private */
    public isRectSeries: boolean = true;
    /** @private */
    public clipRect: Rect = new Rect(0, 0, 0, 0);
    /** @private */
    public category: SeriesCategories = 'Series';
    /** @private */
    public rightSidePoints: AccPoints[] = [];
    /** @private */
    public leftSidePoints: AccPoints[] = [];
    /**
     * To find the max bounds of the data label to place smart legend
     *
     * @private
     */
    public labelBound: Rect;
    /**
     * To find the max bounds of the accumulation segment to place smart legend
     *
     * @private
     */
    public accumulationBound: Rect;

    /**
     * The `triangleSize` property specifies the size of the triangle in the funnel series.
     *
     * @private
     */
    public triangleSize: Size;

    /**
     * The `neckSize` property specifies the dimensions of the neck in the funnel series.
     *
     * @private
     */
    public neckSize: Size;

    /** @private */
    public accumulation: AccumulationChart;

    /**
     * Option for customizing the border radius.
     *
     * @default 0
     */
    @Property(0)
    public borderRadius: number;

    /**
     * To refresh the Datamanager for series.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {boolean} render - Specifies whether to render the accumulation chart after refreshing the DataManager.
     * @returns {void}
     */
    public refreshDataManager(accumulation: AccumulationChart, render: boolean): void {
        this.accumulation = accumulation;
        this.radius = this.radius ? this.radius  : (Browser.isDevice && this.dataLabel.position === 'Outside') ? '40%' : '80%';
        const dateSource: Object | DataManager = this.dataSource || accumulation.dataSource;
        if (!(dateSource instanceof DataManager) && isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dateSource, count: (dateSource as Object[]).length }, accumulation, render);
            return;
        }
        const dataManager: Promise<Object> = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e, accumulation));
    }
    /**
     * To get points on dataManager is success.
     *
     * @private
     * @param {Object} e - The data manager result object.
     * @param {Object} e.result - The result of the data manager process.
     * @param {number} e.count - The count of items in the result.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {boolean} render - Specifies whether to render the accumulation chart after retrieving the points.
     * @returns {void}
     */
    public dataManagerSuccess(e: { result: Object, count: number }, accumulation: AccumulationChart, render: boolean = true): void {
        const argsData: IAccSeriesRenderEventArgs = {
            name: seriesRender, series: this, data: e.result
        };
        accumulation.allowServerDataBinding = false;
        accumulation.trigger(seriesRender, argsData);
        this.resultData = e.result !== '' ? e.result : [];
        if (!accumulation.isBlazor && !render) {
            this.getPoints(this.resultData, accumulation); // To update datasource using onPropertyChanged method. incident id: 290690
        }
        if ((++accumulation.seriesCounts === accumulation.visibleSeries.length && render)
            || (window['Blazor'] && !render && accumulation.seriesCounts === 1)) {
            this.getPoints(this.resultData, accumulation);
            accumulation.refreshChart();
        }
    }
    /**
     * To find points from result data.
     *
     * @private
     * @param {Object} result - The result of the process.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    public getPoints(result: Object, accumulation: AccumulationChart): void {
        const length: number = Object.keys(result).length;
        this.sumOfPoints = 0;
        if (length === 0) {
            // fix for Pie datalabels are not removed for empty datasource
            this.points = [];
            return null;
        }
        this.findSumOfPoints(result);
        this.points = [];
        this.clubbedPoints = [];
        this.sumOfClub = 0;
        let point: AccPoints;
        const colors: string[] = this.palettes.length ? this.palettes : getSeriesColor(accumulation.theme);
        const clubValue: number = stringToNumber(this.groupTo, this.sumOfPoints);
        for (let i: number = 0; i < length; i++) {
            point = this.setPoints(result, i, colors, accumulation);
            if (!this.isClub(point, clubValue, i)) {
                if (isNullOrUndefined(point.y)) {
                    point.visible = false;
                }
                this.pushPoints(point, colors);
            } else {
                point.index = this.clubbedPoints.length;
                point.isExplode = true;
                this.clubbedPoints.push(point);
                point.isSliced = true;
            }
        }
        this.lastGroupTo = this.groupTo;
        if (this.sumOfClub > 0) {
            const clubPoint: AccPoints = this.generateClubPoint();
            this.pushPoints(clubPoint, colors);
            const pointsLength: number = this.points.length - 1;
            this.clubbedPoints.map((point: AccPoints) => {
                point.index += pointsLength;
                point.color = clubPoint.color;
            });
        }
        if (
            this.clubbedPoints.length && this.explode && this.type === 'Pie'
            && (this.explodeAll || this.points[this.points.length - 1].index === this.explodeIndex)
        ) {
            this.points.splice(this.points.length - 1, 1);
            this.points = this.points.concat(this.clubbedPoints);
        }
    }

    public generateClubPoint(): AccPoints {
        const clubPoint: AccPoints = new AccPoints();
        clubPoint.isClubbed = true;
        clubPoint.x = 'Others';
        clubPoint.y = this.sumOfClub;
        clubPoint.text = clubPoint.originalText = clubPoint.x + ': ' + this.sumOfClub;
        clubPoint.sliceRadius = '80%';
        return clubPoint;
    }
    /**
     * Method to set point index and color.
     *
     * @param {AccPoints} point - The point data.
     * @param {string[]} colors - The array of colors used in the accumulation chart.
     * @returns {void}
     */
    private pushPoints(point: AccPoints, colors: string[]): void {
        point.index = this.points.length;
        point.isExplode = this.explodeAll || (point.index === this.explodeIndex);
        point.color = point.color || colors[point.index % colors.length];
        this.points.push(point);
    }
    /**
     * Method to find club point.
     *
     * @param {AccPoints} point - The point data.
     * @param {number} clubValue - The club value for accumulation chart.
     * @param {number} index - The index of the point in the data set.
     * @returns {boolean} - false
     */
    private isClub(point: AccPoints, clubValue: number, index: number): boolean {
        if (!isNullOrUndefined(clubValue)) {
            if (this.groupMode === 'Value' && Math.abs(point.y) <= clubValue) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            } else if (this.groupMode === 'Point' && index >= clubValue) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            }
        }
        return false;
    }
    /**
     * Method to find sum of points in the series.
     *
     * @param {Object} result - The result of the process.
     * @returns {void}
     */
    private findSumOfPoints(result: Object): void {
        const length: number = Object.keys(result).length;
        for (let i: number = 0; i < length; i++) {
            if (!isNullOrUndefined(result[i as number]) && !isNullOrUndefined(result[i as number][this.yName])
            && !isNaN(result[i as number][this.yName])) {
                this.sumOfPoints += Math.abs(result[i as number][this.yName]);
            }
        }
    }
    /**
     * Method to set points x, y and text from data source.
     *
     * @param {Object} data - The data containing information for the points.
     * @param {number} i - The index of the current point in the data set.
     * @param {string[]} colors - The array of colors used in the accumulation chart.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {AccPoints} - The point data retrieved from the specified index.
     */
    private setPoints(data: Object, i: number, colors: string[], accumulation?: AccumulationChart): AccPoints {
        const point: AccPoints = new AccPoints();
        point.x = getValue(this.xName, data[i as number]);
        point.y = getValue(this.yName, data[i as number]);
        point.legendImageUrl = getValue(this.legendImageUrl, data[i as number]);
        point.color = getValue(this.pointColorMapping, data[i as number]);
        point.text = point.originalText = getValue(this.dataLabel.name || '', data[i as number]);
        point.tooltip = getValue(this.tooltipMappingName || '', data[i as number]);
        point.sliceRadius = getValue(this.radius, data[i as number]);
        point.sliceRadius = isNullOrUndefined(point.sliceRadius) ? '80%' : point.sliceRadius;
        point.separatorY = accumulation.intl.formatNumber(point.y, { useGrouping: accumulation.useGroupingSeparator });
        this.setAccEmptyPoint(point, i, data);
        return point;
    }
    /**
     * Method render the series elements for accumulation chart.
     *
     * @private
     * @param {AccumulationChart} accumulation - The AccumulationChart control.
     * @param {boolean} redraw - Specifies whether to redraw the points.
     * @returns {void}
     */
    public renderSeries(accumulation: AccumulationChart, redraw?: boolean): void {

        const seriesGroup: Element = redraw ? getElement(accumulation.element.id + '_Series_' + this.index) :
            accumulation.renderer.createGroup({ id: accumulation.element.id + '_Series_' + this.index });


        this.renderPoints(accumulation, seriesGroup, redraw);

        let datalabelGroup: Element;

        if (accumulation.accumulationDataLabelModule && this.dataLabel.visible) {

            datalabelGroup = accumulation.renderer.createGroup({ id: accumulation.element.id + '_datalabel_Series_' + this.index });

            (datalabelGroup as HTMLElement).style.visibility =
            (((this.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && accumulation.animateSeries && this.type === 'Pie') ? 'hidden' : 'visible';

            this.renderDataLabel(accumulation, datalabelGroup, redraw);
        }
        if (this.type === 'Pie') {
            if (!accumulation.redraw) {
                this.findMaxBounds(this.labelBound, this.accumulationBound);
            }
            accumulation.pieSeriesModule.animateSeries(accumulation, this.animation, this, seriesGroup, this.borderRadius, this.points);
        }
        if (!accumulation.redraw && accumulation.accumulationLegendModule) {
            this.labelBound.x -= accumulation.explodeDistance;
            this.labelBound.y -= accumulation.explodeDistance;
            this.labelBound.height += (accumulation.explodeDistance - this.labelBound.y);
            this.labelBound.width += (accumulation.explodeDistance - this.labelBound.x);
        }
    }
    /**
     * Method render the points elements for accumulation chart series.
     *
     * @param {AccumulationChart} accumulation - The AccumulationChart control.
     * @param {Element} seriesGroup - The group element to contain the point elements.
     * @param {boolean} redraw - Specifies whether to redraw the points.
     * @param {boolean} previouRadius - Specifies the previous radius of the pie when animating the individual series point.
     * @param {boolean} previousCenter - Specifies the previous center of the pie when animating the individual series point.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    private renderPoints(accumulation: AccumulationChart, seriesGroup: Element, redraw?: boolean,
                         previouRadius?: number, previousCenter?: ChartLocation, pointAnimation?: boolean): void {
        const pointId: string = accumulation.element.id + '_Series_' + this.index + '_Point_';
        let option: PathOption;
        let patternFill: string;
        const patterns: SelectionPattern[] = ['Chessboard', 'Dots', 'DiagonalForward', 'Crosshatch', 'Pacman', 'DiagonalBackward', 'Grid', 'Turquoise', 'Star', 'Triangle', 'Circle', 'Tile', 'HorizontalDash', 'VerticalDash', 'Rectangle', 'Box', 'VerticalStripe', 'HorizontalStripe', 'Bubble'];
        for (const point of this.points) {
            point.percentage = (+(point.y / this.sumOfPoints * 100).toFixed(2));
            const argsData: IAccPointRenderEventArgs = {
                cancel: false, name: pointRender, series: this, point: point, fill: point.color,
                border: this.isEmpty(point) ? { width: this.emptyPointSettings.border.width, color: this.emptyPointSettings.border.color } :
                    { width: this.border.width, color: this.border.color }, pattern: this.applyPattern ? patterns[point.index % patterns.length] : 'None'
            };
            accumulation.trigger(pointRender, argsData);
            point.color = argsData.fill;
            patternFill = point.color;
            if (this.applyPattern) {
                const selection: BaseSelection = new BaseSelection(accumulation);
                patternFill = selection.pattern(accumulation, point.color, point.index, argsData.pattern, this.opacity);
            }
            option = new PathOption(
                pointId + point.index, patternFill, argsData.border.width || 1, argsData.border.color || point.color, this.opacity,
                argsData.series.dashArray, ''
            );
            accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].
                renderPoint(point, this, accumulation, option, seriesGroup, redraw, previouRadius, previousCenter, pointAnimation);
        }
        appendChildElement(false, accumulation.getSeriesElement(), seriesGroup, redraw);
    }
    /**
     * Method render the datalabel elements for accumulation chart.
     *
     * @param {AccumulationChart} accumulation - The AccumulationChart control.
     * @param {Element} datalabelGroup - The group element to contain the data label elements.
     * @param {boolean} redraw - Specifies whether to redraw the data labels.
     * @returns {void}
     */
    private renderDataLabel(accumulation: AccumulationChart, datalabelGroup: Element, redraw?: boolean): void {
        accumulation.accumulationDataLabelModule.findAreaRect();
        const element: HTMLElement = createElement('div', {
            id: accumulation.element.id + '_Series_0' + '_DataLabelCollections'
        });
        this.leftSidePoints = [];
        this.rightSidePoints = [];
        const firstQuarter: AccPoints[] = [];
        const secondQuarter: AccPoints[] = [];
        for (const point of this.points) {
            if (point.visible) {
                if (this.dataLabel.showZero || (!this.dataLabel.showZero && ((point.y !== 0) || (point.y === 0 &&
                    this.emptyPointSettings.mode === 'Zero')))) {
                    accumulation.accumulationDataLabelModule.renderDataLabel(
                        point, this.dataLabel, datalabelGroup, this.points, this.index, element,
                        redraw
                    );
                }
            }
            if (point.midAngle >= 90 && point.midAngle <= 270) {
                this.leftSidePoints.push(point);
            } else {
                if (point.midAngle >= 0 && point.midAngle <= 90) {
                    secondQuarter.push(point);
                } else {
                    firstQuarter.push(point);
                }
            }
        }
        firstQuarter.sort((a: AccPoints, b: AccPoints) => a.midAngle - b.midAngle);
        secondQuarter.sort((a: AccPoints, b: AccPoints) => a.midAngle - b.midAngle);
        this.leftSidePoints.sort((a: AccPoints, b: AccPoints) => a.midAngle - b.midAngle);
        this.rightSidePoints = firstQuarter.concat(secondQuarter);
        accumulation.accumulationDataLabelModule.drawDataLabels(this, this.dataLabel, datalabelGroup as HTMLElement, element, redraw);
        if (this.dataLabel.template !== null && element.childElementCount) {
            const dataLabelCallBack: Function = accumulation.accumulationDataLabelModule.drawDataLabels.bind(
                accumulation.accumulationDataLabelModule, this, this.dataLabel, datalabelGroup, element, redraw
            );
            if ((accumulation as any).isReact) { (accumulation as any).renderReactTemplates(dataLabelCallBack); }
            appendChildElement(
                false, getElement(accumulation.element.id + '_Secondary_Element'), element, redraw
            );
        }
        appendChildElement(false, accumulation.getSeriesElement(), datalabelGroup, redraw);
    }

    /**
     * To find maximum bounds for smart legend placing.
     *
     * @private
     * @param {Rect} totalbound - The total bounding rect.
     * @param {Rect} bound - The bounding rect to be compared.
     * @returns {void}
     */
    public findMaxBounds(totalbound: Rect, bound: Rect): void {
        totalbound.x = bound.x < totalbound.x ? bound.x : totalbound.x;
        totalbound.y = bound.y < totalbound.y ? bound.y : totalbound.y;
        totalbound.height = (bound.y + bound.height) > totalbound.height ? (bound.y + bound.height) : totalbound.height;
        totalbound.width = (bound.x + bound.width) > totalbound.width ? (bound.x + bound.width) : totalbound.width;
    }

    /**
     * Finds the maximum width of the labels for legend placement.
     *
     * @private
     * @returns {number} The maximum label width.
     */
    private findMaxLabelWidth(): number {
        let max: number;
        for (let i: number = 0; i < this.points.length; i++) {
            max = this.points[0].textSize.width;
            if (max < this.points[i as number].textSize.width) {
                max = this.points[i as number].textSize.width;
            }
        }
        return max;
    }
    /**
     * To set empty point value for null points.
     *
     * @private
     * @param {AccPoints} point - The point to set as empty.
     * @param {number} i - The index of the point in the data set.
     * @param {Object} data - The data object.
     * @returns {void}
     */
    public setAccEmptyPoint(point: AccPoints, i: number, data: Object): void {
        if (!(isNullOrUndefined(point.y) || isNaN(point.y))) {
            return null;
        }
        point.color = this.emptyPointSettings.fill || point.color;
        switch (this.emptyPointSettings.mode) {
        case 'Zero':
            point.y = 0;
            point.visible = true;
            break;
        case 'Average': {
            const previous: number = data[i - 1] ? (data[i - 1][this.yName] || 0) : 0;
            const next: number = data[i + 1] ? (data[i + 1][this.yName] || 0) : 0;
            point.y = (Math.abs(previous) + Math.abs(next)) / 2;
            this.sumOfPoints += point.y;
            point.visible = true;
            break;
        }
        default:
            point.visible = false;
            break;
        }
    }

    /**
     * Updates the data source for the series.
     *
     * @function setData
     * @param {Object} data – Updated data source for the series.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    public setData(data: Object[], duration?: number): void {
        if (!data) {
            return null;
        }
        let samePoints: boolean = false;
        if ((this.dataSource as object[]).length === data.length) {
            samePoints = true;
            for (let i: number = 0; i < data.length; i++) {
                if (this.dataSource[i as number][this.xName] === data[i as number][this.xName]) {
                    const point: AccPoints = this.points[i as number];
                    const existingPoint: number | string = this.dataSource[i as number];
                    if ((existingPoint[this.yName] !== data[i as number][this.yName])) {
                        point.y = data[i as number][this.yName as string];
                        this.dataSource[i as number] = data[i as number];
                    }
                }
                else {
                    samePoints = false;
                    break;
                }
            }
        }
        if (!samePoints) {
            this.dataSource = data;
        } else {
            this.sumOfPoints = 0;
            this.findSumOfPoints(this.dataSource);
            this.accumulation.redraw = this.borderRadius ? false : this.accumulation.enableAnimation;
            this.accumulation.animateSeries = false;
            const chartDuration: number = this.accumulation.duration;
            this.accumulation.duration = isNullOrUndefined(duration) ? 500 : duration;
            this.accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].initProperties(this.accumulation, this);
            this.renderPoints(this.accumulation, getElement(this.accumulation.element.id + '_Series_' + this.index), this.accumulation.redraw);
            if (this.accumulation.centerLabel.text) {
                this.accumulation.renderCenterLabel(true, true);
            }
            if (this.accumulation.annotationModule) {
                this.accumulation.annotationModule.renderAnnotations(getElement(this.accumulation.element.id + '_Secondary_Element'));
            }
            if (this.accumulation.accumulationDataLabelModule && this.dataLabel.visible) {
                this.renderDataLabel(this.accumulation, getElement(this.accumulation.element.id + '_datalabel_Series_' + this.index), this.accumulation.redraw);
            }
            this.accumulation.redraw = false;
            this.accumulation.duration = chartDuration;
        }
    }

    /**
     * Adds a data point to the data source for the series.
     *
     * @function addPoint
     * @param {Object} dataPoint - The data point to be added.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    public addPoint(dataPoint: Object, duration?: number): void {
        let maxWidth: number;
        if (this.accumulation.series[0].dataLabel.visible) {
            maxWidth = this.findMaxLabelWidth();
        }
        (this.dataSource as Object[]).push(dataPoint);
        this.resultData = this.dataSource;
        this.sumOfPoints = 0;
        const visiblepoints: Object[] = [];
        for (let i: number = 0; i < (this.resultData as object[]).length; i++) {
            if (this.points[i as number] && this.points[i as number].visible) {
                visiblepoints.push((this.resultData as object[])[i as number]);
            }
            else if (i === (this.resultData as object[]).length - 1) {
                visiblepoints.push((this.resultData as object[])[i as number]);
            }
        }
        this.findSumOfPoints(visiblepoints);
        const pointIndex: number = this.points.length === 0 ? 0 : this.points[this.points.length - 1].index + 1;
        const colors: string[] = this.palettes.length ? this.palettes : getSeriesColor(this.accumulation.theme);
        const point: AccPoints = this.setPoints(this.dataSource, pointIndex, colors, this.accumulation);
        this.pushPoints(point, colors);
        this.accumulation.redraw = this.borderRadius ? false : this.accumulation.enableAnimation;
        const chartDuration: number = this.accumulation.duration;
        this.accumulation.duration = isNullOrUndefined(duration) ? 500 : duration;
        this.updateSeries(getElement(this.accumulation.element.id + '_Series_' + this.index), maxWidth, 'addPoint');
        this.accumulation.redraw = false;
        this.accumulation.duration = chartDuration;
    }

    /**
     * Removes a data point from the series data source at the specified index.
     *
     * @function removePoint
     * @param {number} index – The index of the data point to be removed from the series.
     * @param {number} duration – The duration for the animation.
     * @returns {void}
     */
    public removePoint(index: number, duration?: number): void {
        const dataSource: Object[] = extend([], this.dataSource, null, true) as Object[];
        const chartDuration: number = this.accumulation.duration;
        if (dataSource.length > 0 && index >= 0 && index < dataSource.length) {
            this.sumOfPoints = 0;
            const removepoints: Object[] = [];
            for (let i: number = 0; i < (this.dataSource as object[]).length; i++) {
                if (i !== index && this.points[i as number] && this.points[i as number].visible) {
                    removepoints.push((this.dataSource as object[])[i as number]);
                }
            }
            dataSource.splice(index, 1);
            (this.dataSource as object[]).splice(index, 1);
            this.findSumOfPoints(removepoints);
            this.accumulation.redraw = this.borderRadius ? false : this.accumulation.enableAnimation;
            this.accumulation.duration = isNullOrUndefined(duration) ? 500 : duration;
            this.points.splice(index, 1);
            for (let i: number = index; i < this.points.length; i++) {
                const point: AccPoints = this.points[i as number];
                point.index = i;
                point.y = this.points[i as number].y;
            }
            const element: Element = getElement(this.accumulation.element.id + '_Series_0_Point_' + (this.points.length));
            if (element) {
                element.parentNode.removeChild(element);
            }
            this.updateSeries(getElement(this.accumulation.element.id + '_Series_' + this.index), undefined, 'removePoint', index);
            this.accumulation.redraw = false;
            this.accumulation.duration = chartDuration;
        }

    }

    /**
     * Update the series based on addPoint and removePoint function.
     *
     * @param {Element} seriesGroup - Series group needs to be update.
     * @param {number} maxLabelWidth - Specifies the maximum label width.
     * @param {string} updatePoint - Specifies remove or add point.
     * @param {number} index - specifies point index to remove.
     * @returns {void}
     */
    private updateSeries(seriesGroup: Element, maxLabelWidth?: number, updatePoint?: string, index?: number): void {
        const previousRadius: number = this.accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].radius;
        const previousCenter: ChartLocation = this.accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].center;
        let previousLegendBounds: Rect;
        if (this.accumulation.legendSettings.visible) {
            if (updatePoint === 'addPoint') {
                this.accumulation.accumulationLegendModule.
                    legendCollections.push(new LegendOptions(this.points[this.points.length - 1].x.toString(),
                                                             this.points[this.points.length - 1].color, this.legendShape,
                                                             this.points[this.points.length - 1].visible, this.type,
                                                             this.points[this.points.length - 1].legendImageUrl,
                                                             null, null, this.points[this.points.length - 1].index, this.index));
            }
            else {
                this.accumulation.accumulationLegendModule.legendCollections.splice(index, 1);
                for (let i: number = index; i < this.accumulation.accumulationLegendModule.legendCollections.length; i++) {
                    this.accumulation.accumulationLegendModule.legendCollections[i as number].pointIndex = i;
                }
            }
            if (this.accumulation.accumulationLegendModule.legendCollections.length >= 1) {
                previousLegendBounds = this.accumulation.accumulationLegendModule.legendBounds;
                this.accumulation.accumulationLegendModule.calculateLegendBounds(this.accumulation.initialClipRect,
                                                                                 this.accumulation.availableSize, null,
                                                                                 previousLegendBounds, true);

                if (this.dataLabel && this.dataLabel.position === 'Outside' && (this.accumulation.legendSettings.position === 'Bottom' || (this.accumulation.legendSettings.position === 'Top')) ? (previousLegendBounds.height !== this.accumulation.accumulationLegendModule.legendBounds.height) : (previousLegendBounds.width !== this.accumulation.accumulationLegendModule.legendBounds.width)) {
                    const titleHeight: number = (this.accumulation.title ? measureText(this.accumulation.title,
                                                                                       this.accumulation.titleStyle,
                                                                                       this.accumulation.themeStyle.chartTitleFont).height *
                        this.accumulation.titleCollection.length : 0);

                    const subTitleHeight: number = (this.accumulation.subTitle ?
                        (measureText(this.accumulation.subTitle, this.accumulation.subTitleStyle,
                                     this.accumulation.themeStyle.chartSubTitleFont).height *
                                     this.accumulation.subTitleCollection.length) : 0);

                    this.accumulation.initialClipRect = new Rect(this.accumulation.margin.left, this.accumulation.margin.top,
                                                                 this.accumulation.availableSize.width,
                                                                 this.accumulation.availableSize.height);

                    subtractRect(this.accumulation.initialClipRect, new Rect(0, (subTitleHeight
                        + titleHeight), this.accumulation.margin.right +
                    this.accumulation.margin.left, this.accumulation.margin.bottom + this.accumulation.margin.top));
                    this.accumulation.accumulationLegendModule.calculateLegendBounds(
                        this.accumulation.initialClipRect, this.accumulation.availableSize, null);
                }
            }
        }

        this.accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].initProperties(this.accumulation, this);
        this.renderPoints(this.accumulation, seriesGroup, this.accumulation.redraw, previousRadius, previousCenter, true);

        if (previousLegendBounds && ((this.accumulation.legendSettings.position === 'Bottom' || (this.accumulation.legendSettings.position === 'Top')) ? (previousLegendBounds.height !== this.accumulation.accumulationLegendModule.legendBounds.height) : (previousLegendBounds.width !== this.accumulation.accumulationLegendModule.legendBounds.width)) && this.accumulation.centerLabel.text) {
            this.accumulation.renderCenterLabel(true, true);
        }
        if (this.accumulation.annotationModule) {
            this.accumulation.annotationModule.renderAnnotations(getElement(this.accumulation.element.id + '_Secondary_Element'));
        }
        if (this.accumulation.accumulationDataLabelModule && this.dataLabel.visible) {
            const datalabelGroup: Element = this.accumulation.renderer.createGroup({ id: this.accumulation.element.id + '_datalabel_Series_' + this.index });
            this.renderDataLabel(this.accumulation, datalabelGroup, this.accumulation.redraw);
        }
        if (this.accumulation.legendSettings.visible) {
            if (this.type === 'Pie') {
                if (this.dataLabel.visible && this.points[this.points.length - 1] && this.points[this.points.length - 1].textSize.width > maxLabelWidth && this.accumulation.legendSettings.position !== 'Top' && this.accumulation.legendSettings.position !== 'Bottom') {
                    this.accumulation.visibleSeries[0].findMaxBounds(this.accumulation.visibleSeries[0].labelBound,
                                                                     this.points[this.points.length - 1].labelRegion);
                    this.findMaxBounds(this.labelBound, this.accumulationBound);
                    this.labelBound.x -= this.accumulation.explodeDistance;
                    this.labelBound.y -=  this.accumulation.explodeDistance;
                    this.labelBound.height += ( this.accumulation.explodeDistance - this.labelBound.y);
                    this.labelBound.width += ( this.accumulation.explodeDistance - this.labelBound.x);
                }
                this.accumulation.accumulationLegendModule.getSmartLegendLocation(this.accumulation.visibleSeries[0].labelBound,
                                                                                  this.accumulation.accumulationLegendModule.legendBounds,
                                                                                  this.accumulation.margin);
            }
            this.accumulation.accumulationLegendModule.renderLegend(this.accumulation, this.accumulation.legendSettings,
                                                                    this.accumulation.accumulationLegendModule.legendBounds,
                                                                    this.accumulation.redraw, true);
        }
    }

    /**
     * To find point is empty.
     *
     * @param {AccPoints} point - The point to check.
     * @returns {boolean} - True if the point is empty, otherwise false.
     */
    private isEmpty(point: AccPoints): boolean {
        return point.color === this.emptyPointSettings.fill;
    }
}
/**
 * method to get series from index.
 *
 * @private
 * @param {number} index - The index of the series to retrieve.
 * @param {AccumulationSeries[]} visibleSeries - The array of visible series in the chart.
 * @returns {AccumulationSeries} - The series retrieved from the specified index.
 */
export function getSeriesFromIndex(index: number, visibleSeries: AccumulationSeries[]): AccumulationSeries {
    for (const series of visibleSeries) {
        if (index === series.index) {
            return <AccumulationSeries>series;
        }
    }
    return <AccumulationSeries>visibleSeries[0];
}
/**
 * method to get point from index.
 *
 * @private
 * @param {number} index - The index of the point to retrieve.
 * @param {AccPoints[]} points - The array of points in the data set.
 * @returns {AccPoints} - The point retrieved from the specified index.
 */
export function pointByIndex(index: number, points: AccPoints[]): AccPoints {
    for (const point of points) {
        if (point.index === index) {
            return point;
        }
    }
    return null;
}
