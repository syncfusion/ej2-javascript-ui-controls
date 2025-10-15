import { Property, Complex, ChildProperty, extend, getValue} from '@syncfusion/ej2-base';
import { measureText, Rect, TextOption, Size, PathOption, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Chart, ILegendRegions } from '../../chart';
import { LegendSettingsModel } from './legend-model';
import { Font, Border, Margin, Location, ContainerPadding, Accessibility } from '../model/base';
import { MarginModel, FontModel, BorderModel, LocationModel, ContainerPaddingModel, AccessibilityModel } from '../model/base-model';
import { subtractThickness, Thickness, drawSymbol, ChartLocation, titlePositionX, getTitle, textTrim, getTextAnchor } from '../utils/helper';
import { RectOption, textElement, stringToNumber } from '../utils/helper';
import { removeElement, showTooltip, getElement, appendChildElement } from '../utils/helper';
import { ChartSeriesType, ChartShape, LegendMode } from '../../chart/utils/enum';
import { Series } from '../../chart/series/chart-series';
import { Legend } from '../../chart/legend/legend';
import { AccumulationType } from '../../accumulation-chart/model/enum';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccumulationLegend } from '../../accumulation-chart/renderer/legend';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { BulletChartLegend } from '../../bullet-chart/legend/legend';
import { Alignment, LegendTitlePosition, TextWrap, LabelOverflow, LegendShape, LegendPosition, LegendLayout} from '../utils/enum';
import { StockChart } from '../../stock-chart';
import { StockLegend } from '../../stock-chart/legend/legend';
import { Chart3D } from '../../chart3d';
import { Legend3D } from '../../chart3d/legend/legend';
import { Chart3DLegendSettingsModel } from '../../chart3d/legend/legend-model';
import { CircularChartLegend3D } from '../../circularchart3d/legend/legend';
import { CircularChart3D } from '../../circularchart3d';
/**
 * Configures the appearance and behavior of legends in charts.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {

    /**
     * If set to true, the legend will be displayed for the chart.
     *
     * @default true
     */

    @Property(true)
    public visible: boolean;

    /**
     * Specifies the height of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * Specifies the width of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * Specifies the location of the legend relative to the chart.
     * If x is 20, the legend moves 20 pixels to the right of the chart.
     > Note that the `position` must be set to `Custom` for this feature to work.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   legendSettings: {
     *           visible: true,
     *           position: 'Custom',
     *           location: { x: 100, y: 150 }
     *   }
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */

    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Sets the position of the legend in the chart.
     * Available options include:
     * * Auto - Places the legend according to the area type.
     * * Top - Displays the legend at the top of the chart.
     * * Left - Displays the legend on the left side of the chart.
     * * Bottom - Displays the legend at the bottom of the chart.
     * * Right - Displays the legend to the right of the chart.
     * * Custom - Displays the legend according to the given x and y position values.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public position: LegendPosition;

    /**
     * Defines the mode for displaying legend items.
     * * Series - Legend items are generated based on the count of series.
     * * Point - Legend items are created according to each unique data point.
     * * Range - Legend items are generated based on the range color mapping property.
     * * Gradient - Displays a single linear bar that represents the range color mapping property.
     > Note that this property is applicable only for the chart component.
     */
    @Property('Series')
    public mode: LegendMode;

    /**
     * Option to customize the padding around the legend items.
     *
     * @default 8
     */

    @Property(8)
    public padding: number;

    /**
     * Option to customize the padding between legend items.
     *
     * @default null
     */

    @Property(null)
    public itemPadding: number;

    /**
     * Defines the alignment of the legend in the chart.
     * The options are:
     * * Near - Aligns the legend to the left of the chart.
     * * Center - Aligns the legend to the center of the chart.
     * * Far - Aligns the legend to the right of the chart.
     *
     * @default 'Center'
     */

    @Property('Center')
    public alignment: Alignment;

    /**
     * The `textStyle` property provides options to customize the appearance of the text in the legend, including the font family, size, style, weight, and color.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public textStyle: FontModel;

    /**
     * Specify the height of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeHeight: number;

    /**
     * Specify the width of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeWidth: number;

    /**
     * Options for customizing the border of the legend.
     */

    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Options for customizing the left, right, top, and bottom margins of the chart.
     */

    @Complex<MarginModel>({left: 0, right: 0, top: 0, bottom: 0}, Margin)
    public margin: MarginModel;

    /**
     * Options to customize the left, right, top, and bottom padding for the chart legend container.
     */

    @Complex<ContainerPaddingModel>({ left: 0, right: 0, top: 0, bottom: 0 }, ContainerPadding)
    public containerPadding: ContainerPaddingModel;

    /**
     * Padding between the legend shape and text.
     *
     * @default 8
     */

    @Property(8)
    public shapePadding: number;

    /**
     * The background color of the legend, which accepts values in hex and rgba as valid CSS color strings.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * Customizes the opacity of the legend.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * If set to true, the series visibility will collapse based on the legend's visibility.
     *
     * @default true
     */

    @Property(true)
    public toggleVisibility: boolean;

    /**
     * If set to true, the series will be highlighted when hovering over the legend.
     *
     * @default false
     */

    @Property(false)
    public enableHighlight: boolean;

    /**
     * A description of the legend that provides additional information for screen readers.
     *
     * @default null
     * @deprecated
     */

    @Property(null)
    public description: string;

    /**
     * The `tabIndex` property determines the order in which the legend receives focus when navigating through elements with the keyboard.
     *
     * @default 3
     * @deprecated
     */

    @Property(3)
    public tabIndex: number;

    /**
     * Specifies the title of the legend.
     *
     * @default null
     */

    @Property(null)
    public title: string;

    /**
     * The `titleStyle` property configures the font settings for the legend title, including font family, size, style, weight, and color.
     */

    @Complex<FontModel>({fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null}, Font)
    public titleStyle: FontModel;

    /**
     * The `titlePosition` property specifies the position of the legend title.
     * Available options are:
     * * Top - Aligns the title to the top of the legend.
     * * Left - Aligns the title to the left of the legend.
     * * Right - Aligns the title to the right of the legend.
     *
     * @default 'Top'
     */

    @Property('Top')
    public titlePosition: LegendTitlePosition;

    /**
     * Defines the text wrap behavior for the legend text when it overflows.
     * Available options are:
     * * `Normal` - Specifies that words should only break at allowed break points.
     * * `Wrap` - Specifies that a word should break if it is too long to fit on a line by itself.
     * * `AnyWhere` - Specifies to break a word at any point if there are no acceptable break points in the line.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public textWrap : TextWrap;

    /**
     * Defines the behavior for handling the overflow of legend text.
     * * `Clip` - Specifies that the text is clipped and not accessible.
     * * `Ellipsis` - Specifies an ellipsis (“...”) for the clipped text.
     *
     * @default 'Ellipsis'
     */

    @Property('Ellipsis')
    public textOverflow  : LabelOverflow;

    /**
     * Specifies the maximum width of the legend title.
     *
     * @default 100
     */

    @Property(100)
    public maximumTitleWidth: number;

    /**
     * Specifies the maximum width of the legend text labels.
     *
     * @default null
     */

    @Property(null)
    public maximumLabelWidth : number;

    /**
     * If set to true, the legend will be displayed using pages.
     *
     * @default true
     */

    @Property(true)
    public enablePages: boolean;

    /**
     * If `isInversed` is set to true, it inverses the legend item content (image and text).
     *
     * @default false.
     */

    @Property(false)
    public isInversed: boolean;

    /**
     * If `reverse` is set to true, it reverses the order of the legend items.
     *
     * @default false
     */

    @Property(false)
    public reverse: boolean;

    /**
     * Specifies the layout of the legend items in the chart.
     * Available options are:
     * * `Vertical`: Legend items are arranged in a single column. If the legend items exceed the available space, paging is automatically applied to allow the user to navigate through the legend.
     * * `Horizontal`: Legend items are arranged in a single row. If the legend items exceed the available space, paging is automatically applied to allow the user to navigate through the legend.
     * * `Auto` (default): Legend items are placed based on the available space.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public layout: LegendLayout;

    /**
     * Specifies the maximum number of columns to allow in the available space when the layout is set to 'Auto'.
     *
     * @default null
     */

    @Property(null)
    public maximumColumns: number;

    /**
     * When set to true, all legend items are rendered with an equal width, which is the maximum width of all items.
     *
     * @default false
     */
    @Property(false)
    public fixedWidth: boolean;

    /**
     * Options to improve accessibility for legend elements.
     */
    @Complex<AccessibilityModel>({}, Accessibility)
    public accessibility: AccessibilityModel;

}
/**
 * Legend base class for Chart and Accumulation chart.
 *
 * @private
 */

export class BaseLegend {

    // Internal variables
    protected chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D;
    protected legend: LegendSettingsModel;
    protected maxItemHeight: number = 0;
    protected rowHeights: number[] = [];
    protected pageHeights: number[] = [];
    protected columnHeights: number[] = [];
    protected isPaging: boolean;
    private clipPathHeight: number;
    public totalPages: number;
    protected isVertical: boolean;
    protected fivePixel: number;
    private rowCount: number; // legend row counts per page
    protected pageButtonSize: number;
    protected pageXCollections: number[] = []; // pages of x locations
    protected maxColumns: number;
    public maxWidth: number;
    protected legendID: string;
    private clipRect: Element;
    private legendTranslateGroup: Element;
    protected currentPage: number;
    protected backwardArrowOpacity: number;
    protected forwardArrowOpacity: number;
    private isChartControl: boolean;
    private isAccChartControl: boolean;
    private isBulletChartControl: boolean;
    private isStockChartControl: boolean;
    private accessbilityText: string;
    protected arrowWidth: number;
    protected arrowHeight: number;
    protected library: Legend | AccumulationLegend | BulletChartLegend | StockLegend | Legend3D | CircularChartLegend3D;
    /**  @private */
    public position: LegendPosition;
    public chartRowCount : number = 1;
    /**
     * Gets the legend bounds in chart.
     *
     * @private
     */

    public legendBounds: Rect;
    /** @private */
    public legendCollections: LegendOptions[];
    private legendTitleCollections: string[] = [];
    protected legendTitleSize: Size;
    private isTop: boolean;
    protected isTitle: boolean;
    /** @private */
    public clearTooltip: number;
    //this variable stores the legend clipRect co-oridinates and used to render clipRect in canvas mode.
    protected pagingClipRect: RectOption;
    protected currentPageNumber: number;
    protected legendRegions: ILegendRegions[] = [];
    protected pagingRegions: Rect[] = [];
    protected totalNoOfPages: number;
    /** @private */
    public calTotalPage: boolean;
    private bulletChart: BulletChart;
    protected isRtlEnable: boolean;
    protected isReverse: boolean;
    protected itemPadding: number;
    /**
     * Constructor for the dateTime module.
     *
     * @private
     */

    constructor(chart?: Chart | AccumulationChart | BulletChart | StockChart  | Chart3D | CircularChart3D) {
        this.chart = chart;
        this.legend = chart.legendSettings;
        this.legendID = chart.element.id + '_chart_legend';
        this.isChartControl = (chart.getModuleName() === 'chart' || chart.getModuleName() === 'chart3d');
        this.isAccChartControl = (chart.getModuleName () === 'accumulationchart' || chart.getModuleName () === 'circularchart3d');
        this.isBulletChartControl = (chart.getModuleName() === 'bulletChart');
        this.isStockChartControl = (chart.getModuleName() === 'stockChart');
        this.bulletChart = this.chart as BulletChart;
        this.fivePixel = 5;
        this.rowCount = 0;
        this.pageButtonSize = 8;
        this.maxColumns = 0;
        this.maxWidth = 0;
        this.currentPage = 1;
        this.backwardArrowOpacity = 0;
        this.forwardArrowOpacity = 1;
        this.arrowWidth = (2 * (this.fivePixel + this.pageButtonSize + this.fivePixel));
        this.arrowHeight = this.arrowWidth;
        this.isTop = false;
        this.isTitle = false;
        this.currentPageNumber = 1;
    }
    /**
     * Calculate the bounds for the legends.
     *
     * @returns {void}
     * @private
     */

    public calculateLegendBounds(rect: Rect, availableSize: Size, maxLabelSize: Size,
                                 previousLegendBounds?: Rect, pointAnimation?: boolean): void {
        const legend: LegendSettingsModel = this.legend;
        const defaultValue: string = (this.isBulletChartControl || ((this.chart.getModuleName () === 'accumulationchart' || this.chart.getModuleName () === 'chart') && (this.legend.layout !== 'Auto' || this.legend.maximumColumns > 0))) ? '40%' : '20%';
        this.getPosition(legend.position, availableSize);
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        this.itemPadding = this.legend.itemPadding ? this.legend.itemPadding : this.isVertical ? 8 : 20 ;
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(
                legend.height, availableSize.height - (rect.y - this.chart.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || defaultValue, availableSize.width);
        } else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || defaultValue, availableSize.height);
        }
        if (this.chart.getModuleName() === 'chart3d') {
            (this.library as Legend3D).get3DLegendBounds(availableSize, this.legendBounds, (legend as Chart3DLegendSettingsModel));
        } else {
            (this.library as Legend | BulletChartLegend | AccumulationLegend |
            StockLegend).getLegendBounds(availableSize, this.legendBounds, legend);
        }
        if (!this.isBulletChartControl) {
            this.legendBounds.width += (this.legend.containerPadding.left + this.legend.containerPadding.right);
            this.legendBounds.height += (this.legend.containerPadding.top + this.legend.containerPadding.bottom);
        }
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize,
                         maxLabelSize, previousLegendBounds, pointAnimation);
    }
    /**
     * To find legend position based on available size for chart and accumulation chart
     *
     * @param position
     * @param availableSize
     * @param position
     * @param availableSize
     * @returns {void}
     */

    private getPosition(position: LegendPosition, availableSize: Size): void {
        const chart: Chart =  this.chart as Chart;
        const accumulation: AccumulationChart = this.chart as AccumulationChart;
        if (this.isChartControl || this.isBulletChartControl || this.isStockChartControl) {
            this.position = (position !== 'Auto') ? position : 'Bottom';
        } else {
            if (position === 'Auto' && ((chart || accumulation).visibleSeries && (
                chart || accumulation).visibleSeries[0].type === 'Funnel' || (
                chart || accumulation).visibleSeries[0].type === 'Pyramid'
            )) {
                position = 'Top';
            }
            this.position = (position !== 'Auto') ? position :
                (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        }
    }
    /**
     * To set bounds for chart and accumulation chart
     *
     * @param computedWidth
     * @param computedHeight
     * @param legend
     * @param legendBounds
     * @param computedWidth
     * @param computedHeight
     * @param legend
     * @param legendBounds
     * @param computedWidth
     * @param computedHeight
     * @param legend
     * @param legendBounds
     * @param computedWidth
     * @param computedHeight
     * @param legend
     * @param legendBounds
     * @returns {void}
     */

    protected setBounds(computedWidth: number, computedHeight: number, legend: LegendSettingsModel, legendBounds: Rect): void {
        let titleHeight: number = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        if (this.isVertical && this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
            titleHeight += (this.pageButtonSize + this.fivePixel);
        }
        computedWidth = Math.min(computedWidth, legendBounds.width);
        computedHeight = Math.min(computedHeight, legendBounds.height);
        if (legend.mode === 'Gradient') {
            legendBounds.width = legend.width ? legendBounds.width : this.isVertical ? computedWidth : 0.75 * legendBounds.width;
            legendBounds.height = legend.height ? legendBounds.height : this.isVertical ? 0.75 * legendBounds.height : computedHeight;
        } else {
            legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
            legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        }
        if (!this.isBulletChartControl) {
            if (this.isTop && legend.titleStyle.textOverflow !== 'None') {
                this.calculateLegendTitle(legend, legendBounds);
                legendBounds.height += legend.titleStyle.textOverflow === 'Wrap' && this.legendTitleCollections.length > 1 ?
                    (this.legendTitleSize.height - (this.legendTitleSize.height / this.legendTitleCollections.length)) : 0;
            }
        }
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding - titleHeight) /
            (this.maxItemHeight + legend.padding)));
    }
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     *
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     * @param position
     * @param alignment
     * @param legendBounds
     * @param rect
     * @param availableSize
     * @param maxLabelSize
     */

    private getLocation(
        position: LegendPosition, alignment: Alignment, legendBounds: Rect, rect: Rect, availableSize: Size,
        maxLabelSize: Size, previousLegendBounds?: Rect, pointAnimation?: boolean): void {
        const padding: number = this.legend.border.width;
        const isBulletChart: boolean = this.isBulletChartControl;
        const bulletChart: BulletChart =  this.bulletChart;
        const labelIns: boolean = bulletChart.labelPosition === 'Inside';
        const ticklIns: boolean = bulletChart.tickPosition === 'Inside';
        const isVertical: boolean = bulletChart.orientation === 'Vertical';
        const categoryFieldValue: number = (isBulletChart && bulletChart.categoryField !== '') ?
            maxLabelSize.width + this.chart.border.width + padding * 3 : 0;
        const marginBottom: number = this.chart.margin.bottom;
        let legendHeight: number = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom ;
        let legendWidth: number = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right ;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = (previousLegendBounds && (legendBounds.height === previousLegendBounds.height || (this.chart as AccumulationChart).series[0].type !== 'Pie')) ? previousLegendBounds.y : rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            legendBounds.y += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns
            && !isVertical) ? bulletChart.majorTickLines.height + marginBottom + this.legend.border.width + padding * 2 :
                (isVertical && bulletChart.categoryField !== '')  ? maxLabelSize.height + padding * 2 : 0;
            if ((!pointAnimation || (legendBounds.height !== previousLegendBounds.height))) {
                {subtractThickness(rect, new Thickness(0, 0, 0, legendHeight)); }
            }
        } else if (position === 'Top') {
            let axisTextSize: Size;
            if (this.isChartControl) { axisTextSize = measureText('100', (this.chart as Chart).verticalAxes[0].labelStyle, this.chart.themeStyle.legendLabelFont); }
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = (previousLegendBounds && (legendBounds.height === previousLegendBounds.height || (this.chart as AccumulationChart).series[0].type !== 'Pie')) ? previousLegendBounds.y : rect.y + padding + this.legend.margin.top;
            legendBounds.y -= (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
            !isVertical) ? bulletChart.majorTickLines.height + this.chart.margin.top : 0;
            legendHeight -= (isBulletChart) ? -padding * 2 : (this.isChartControl ? -padding * 2 - axisTextSize.height / 2 : 0);
            if (!pointAnimation || (legendBounds.height !== previousLegendBounds.height)) {
                subtractThickness(rect, new Thickness(0, 0, legendHeight, 0));
            }
        } else if (position === 'Right') {
            legendBounds.x = (previousLegendBounds && (legendBounds.width === previousLegendBounds.width || (this.chart as AccumulationChart).series[0].type !== 'Pie')) ? previousLegendBounds.x : rect.x + (rect.width - legendBounds.width) - this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            legendWidth += (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
            isVertical) ? (
                    this.chart.margin.left + this.chart.margin.right + bulletChart.majorTickLines.height) : 0;
            if (!pointAnimation || (legendBounds.width !== previousLegendBounds.width)) {
                subtractThickness(rect, new Thickness(0, legendWidth, 0, 0));
            }
        } else if (position === 'Left') {
            legendBounds.x = (previousLegendBounds && (legendBounds.width === previousLegendBounds.width || (this.chart as AccumulationChart).series[0].type !== 'Pie')) ? previousLegendBounds.x : legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            legendWidth += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns  &&
            isVertical) ?  (legendBounds.x - this.chart.margin.left + padding + bulletChart.majorTickLines.height) :
                (bulletChart.orientation !== 'Vertical' && bulletChart.categoryField !== '')  ?  categoryFieldValue : 0;
            if (!pointAnimation || (legendBounds.width !== previousLegendBounds.width)) {
                subtractThickness(rect, new Thickness(legendWidth, 0, 0, 0));
            }
        } else {
            legendBounds.x = this.legend.location.x;
            legendBounds.y = this.legend.location.y;
            subtractThickness(rect, new Thickness(0, 0, 0, 0));
        }
    }

    /**
     * To find legend alignment for chart and accumulation chart
     *
     * @param start
     * @param size
     * @param legendSize
     * @param alignment
     * @param start
     * @param size
     * @param legendSize
     * @param alignment
     * @param start
     * @param size
     * @param legendSize
     * @param alignment
     * @param start
     * @param size
     * @param legendSize
     * @param alignment
     */

    private alignLegend(start: number, size: number, legendSize: number, alignment: Alignment): number {
        switch (alignment) {
        case 'Far':
            start = (size - legendSize) - start;
            break;
        case 'Center':
            start = ((size - legendSize) / 2);
            break;
        }
        return start;
    }

    /**
     * Renders the legend.
     *
     * @param chart
     * @param legend
     * @param legendBounds
     * @param redraw
     * @param chart
     * @param legend
     * @param legendBounds
     * @param redraw
     * @param chart
     * @param legend
     * @param legendBounds
     * @param redraw
     * @param chart
     * @param legend
     * @param legendBounds
     * @param redraw
     * @returns {void}
     * @private
     */

    public renderLegend(
        chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D, legend: LegendSettingsModel,
        legendBounds: Rect, redraw?: boolean, pointAnimation?: boolean): void {
        let titleHeight: number = 0; let titlePlusArrowWidth: number = 0;
        let pagingLegendBounds: Rect = new Rect(0, 0, 0, 0);
        let requireLegendBounds: Rect = new Rect(0, 0, 0, 0);
        let xValue: string;
        let yValue: string;
        if (pointAnimation) {
            xValue = getElement(this.legendID + '_element').getAttribute('x');
            yValue = getElement(this.legendID + '_element').getAttribute('y');
        }
        const firstLegend: number = this.findFirstLegendPosition(this.legendCollections);
        const padding: number = legend.padding;
        this.itemPadding = this.isBulletChartControl ? legend.padding : this.itemPadding;
        const isPaging: boolean = legend.enablePages;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        const upArrowHeight: number = this.isPaging && !legend.enablePages && this.isVertical && ((chart.getModuleName() !== 'accumulationchart' && chart.getModuleName() !== 'chart') || this.legend.layout === 'Auto') ? this.pageButtonSize : 0;
        const legendGroup: Element = chart.renderer.createGroup({ id: this.legendID + '_g' });
        const legendTranslateGroup: Element = this.createLegendElements(chart, legendBounds, legendGroup, legend, this.legendID, redraw);
        this.legendRegions = [];
        this.chartRowCount = 1;
        let maxHeight: number = 0;
        titleHeight = !this.isTitle ? 0 : (this.isTop || this.isVertical ? this.legendTitleSize.height : 0);
        if (this.isChartControl || (this.isAccChartControl && (!this.isVertical || (legend.layout && legend.layout !== 'Auto')))) {
            let pageCount: number = 1;
            let rowHeights: number = this.rowHeights[0] + ((this.isVertical || (this.rowHeights.length > 1 && this.legend.itemPadding && this.chart.getModuleName() === 'chart')) ? this.itemPadding : padding);
            for (let i: number = 1; i < this.rowHeights.length; i++) {
                if ((rowHeights + this.rowHeights[i as number] + (((this.isVertical || (this.rowHeights.length > 1 && this.chart.getModuleName() === 'chart')) && this.legend.itemPadding) ? this.itemPadding : padding))
                    > (this.legendBounds.height - this.pageButtonSize - this.maxItemHeight / 2) - this.legend.containerPadding.top -
                    this.legend.containerPadding.bottom) {
                    this.pageHeights[pageCount - 1] = rowHeights + titleHeight;
                    pageCount++;
                    rowHeights = 0;
                }
                rowHeights += (this.rowHeights[i as number] + ((this.isVertical || (this.rowHeights.length > 1 && this.legend.itemPadding && this.chart.getModuleName() === 'chart')) ? this.itemPadding : padding));
            }
            this.pageHeights[pageCount - 1] = rowHeights + titleHeight;
            this.totalPages = pageCount;
        }
        for (let i: number = 0; i < this.legendCollections.length; i++) {
            if (this.legendCollections[i as number].text !== '') {
                maxHeight = Math.max(this.legendCollections[i as number].textSize.height, maxHeight);
                break;
            } else {
                continue;
            }
        }
        if (!this.isChartControl && !this.isAccChartControl) {
            this.maxItemHeight = Math.max(maxHeight, legend.shapeHeight);
        }
        // For new legend navigation
        if (!isPaging && this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = !this.isTitle ? 0 : titlePosition === 'Left' ? this.legendTitleSize.width : 0;
            titlePlusArrowWidth += (this.pageButtonSize + (2 * this.fivePixel));
        } else if (this.isTitle && !this.isVertical) {
            titlePlusArrowWidth = titlePosition === ((!this.isRtlEnable) ? 'Left' : 'Right') ? (this.fivePixel + this.legendTitleSize.width) : 0;
        }
        if ((chart as Chart).legendSettings.mode === 'Gradient' && this.legendCollections.length > 1) {
            this.getLinearLegend(legendBounds, chart, legend, legendTranslateGroup);
            this.totalPages = 1;
        } else if (firstLegend !== this.legendCollections.length) {
            let legendSeriesGroup: Element; // legendItem group for each series group element
            let count: number = 0;
            let previousLegend: LegendOptions = this.legendCollections[firstLegend as number];
            // starting shape center x,y position && to resolve lint error used new line for declaration
            const startPadding: number = this.isBulletChartControl ? padding : titlePlusArrowWidth + padding +
            (legend.shapeWidth / 2) + legend.containerPadding.left;
            const xLocation: number = (this.isBulletChartControl && !this.isRtlEnable) ? legendBounds.x + titlePlusArrowWidth +
            padding + (legend.shapeWidth / 2) :
                (!this.isRtlEnable) ? legendBounds.x + startPadding : legendBounds.x + ((this.chart.getModuleName() === 'accumulationchart' && this.isVertical && legend.layout === 'Auto' && !(legend.maximumColumns > 0)) ? this.maxWidth : legendBounds.width) - startPadding;
            const start: ChartLocation = new ChartLocation(
                xLocation,
                this.isBulletChartControl ? legendBounds.y + titleHeight + upArrowHeight + padding + (this.maxItemHeight / 2) :
                    legendBounds.y + titleHeight + upArrowHeight + padding + (this.maxItemHeight / 2) + legend.containerPadding.top
            );
            const anchor: string = (chart as Chart).isRtlEnabled || (chart as Chart).enableRtl ? 'end' : 'start';
            const textOptions: TextOption = new TextOption('', start.x, start.y, anchor);
            const textPadding: number = legend.shapePadding + this.itemPadding + legend.shapeWidth;
            //  initialization for totalPages legend click totalpage again calculate
            this.totalPages = this.totalPages = (this.isAccChartControl || this.isChartControl || this.isBulletChartControl ||
                this.isStockChartControl) ? this.totalPages : 0;
            this.pageXCollections = [];
            this.legendCollections[firstLegend as number].location = start;
            let legendIndex: number;
            if (!legend.enablePages && this.isPaging) {
                const x: number = start.x - this.fivePixel;
                const y: number = start.y - this.fivePixel;
                const leftSpace: number = this.isTitle && !this.isVertical && titlePosition === 'Left' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                const bottomSapce: number = this.isVertical ? (this.pageButtonSize) + Math.abs(y - legendBounds.y) : 0;
                let rightSpace: number = this.isTitle && !this.isVertical && titlePosition === 'Right' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                rightSpace += this.isVertical ? 0 : (this.fivePixel + this.pageButtonSize + this.fivePixel);
                pagingLegendBounds = new Rect(x, y, legendBounds.width - rightSpace - leftSpace, legendBounds.height - bottomSapce);
                requireLegendBounds = pagingLegendBounds;
            } else {
                requireLegendBounds = legendBounds;
            }
            let legendOption : LegendOptions;
            for (let i: number = 0; i < this.legendCollections.length; i++) {
                legendOption = this.legendCollections[i as number];
                legendIndex = !this.isReverse ? count : (this.legendCollections.length - 1) -  count;
                if (this.chart.getModuleName() === 'accumulationchart' && (this.chart as AccumulationChart).accumulationLegendModule.legendRenderArgFill.indexOf(i as number) === -1) {
                    legendOption.fill = (this.chart as Chart || this.chart as AccumulationChart || this.chart as StockChart ||
                        this.chart as Chart3D).visibleSeries[0].points[legendOption.pointIndex].color;
                }
                if (this.chart.getModuleName() === 'stockChart'){
                    legendOption.type = (this.chart as StockChart).visibleSeries[count as number].type;
                }
                this.accessbilityText = (this.isBulletChartControl) ?  'Legend of bullet chart' + '' + legendOption.text
                    : 'Click to show or hide the ' + legendOption.text + ' series';
                if (legendOption.render && legendOption.text && legendOption.text !== '') {
                    legendSeriesGroup = chart.renderer.createGroup({
                        id: this.legendID + this.generateId(legendOption, '_g_', legendIndex)});
                    if (legendSeriesGroup && (this.chart.getModuleName() === 'chart' || this.chart.getModuleName() === 'accumulationchart')) {
                        legendSeriesGroup.setAttribute('tabindex', (i === 0 && legend.accessibility.focusable) ? String(legend.accessibility.tabIndex) : '');
                        (legendSeriesGroup as HTMLElement).style.outline = 'none';
                        legendSeriesGroup.setAttribute('aria-label', legend.accessibility.accessibilityDescription ? legend.accessibility.accessibilityDescription : (legendOption.text + ' series is ' + (legendOption.visible ? 'showing, press enter to hide the ' : 'hidden, press enter to show the ') + legendOption.text + ' series'));
                        legendSeriesGroup.setAttribute('role', legend.accessibility.accessibilityRole ? legend.accessibility.accessibilityRole : 'button');
                        legendSeriesGroup.setAttribute('aria-pressed', legendOption.visible ? 'true' : 'false');
                    }
                    else if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('tabindex', i === 0 ? '0' : '');
                        (legendSeriesGroup as HTMLElement).style.outline = 'none';
                        legendSeriesGroup.setAttribute('aria-label', legend.description || (legendOption.text + ' series is ' + (legendOption.visible ? 'showing, press enter to hide the ' : 'hidden, press enter to show the ') + legendOption.text + ' series'));
                        legendSeriesGroup.setAttribute('role', 'button');
                        legendSeriesGroup.setAttribute('aria-pressed', legendOption.visible ? 'true' : 'false');
                    }
                    this.library.getRenderPoint(legendOption, start, textPadding, previousLegend, requireLegendBounds, count, firstLegend);

                    this.renderSymbol(legendOption, legendSeriesGroup, legendIndex);

                    this.renderText(chart, legendOption, legendSeriesGroup, textOptions, count, legendIndex);

                    if (legendSeriesGroup) {
                        (legendSeriesGroup as HTMLElement).style.cssText =
                            'pointer-events: bounding-box; cursor: ' + ((!legend.toggleVisibility && ((chart as Chart).selectionMode === 'None' ||
                                (chart as Chart).highlightMode === 'None' ||
                                (chart as AccumulationChart).selectionMode === 'None') || this.isBulletChartControl) ? 'auto' : 'pointer');
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendSeriesGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            this.totalPages = (this.isPaging && !this.isBulletChartControl && !this.legend.enablePages && !this.isVertical &&
                this.totalPages > this.chartRowCount) ? this.chartRowCount : this.totalPages;
            this.currentPage = this.currentPage > 1 && this.currentPage > this.totalPages ? this.totalPages : this.currentPage;
            if (this.isPaging && this.totalPages > 1) {
                this.renderPagingElements(chart, legendBounds, textOptions, legendGroup);
            } else {
                this.totalPages = 1;
            }
        }
        if (pointAnimation) {
            const translateX: string = `translate(${this.rowCount > 1 ? 0 : Math.round(Number(xValue)) - Math.round(this.legendBounds.x)} 
              + ',' + ${Math.round(Number(yValue)) - Math.round(this.legendBounds.y)})`;
            const translateY: string =  `translate(${Math.round(Number(xValue)) - Math.round(this.legendBounds.x)}, ${Math.round(Number(yValue)) - Math.round(this.legendBounds.y)})`;

            appendChildElement((chart as Chart).enableCanvas, chart.svgObject, legendGroup, redraw, true,
                               'x', 'y', undefined, undefined, undefined, undefined, undefined, (chart as Chart).duration,
                               undefined, undefined, new ChartLocation(0, 0),
                               this.position === 'Top' || this.position === 'Bottom' ? translateX : translateY);
        }
        else {
            appendChildElement((chart as Chart).enableCanvas, chart.svgObject, legendGroup, redraw);
        }
    }

    /**
     * To get linear legend.
     *
     * @param {Rect} legendBounds - The bounds of the legend.
     * @param {Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D} chart - The chart instance.
     * @param {LegendSettingsModel} legend - The legend settings.
     * @param {Element} legendTranslateGroup - The group element to translate the legend.
     * @returns {void}
     * @private
     */
    private getLinearLegend(
        legendBounds: Rect, chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D,
        legend: LegendSettingsModel, legendTranslateGroup: Element
    ): void {
        const xmlns: string = 'http://www.w3.org/2000/svg';
        const previousLegend: LegendOptions = this.legendCollections[0];
        const nextLegend: LegendOptions = this.legendCollections[1];
        const defElement: Element = this.chart.renderer.createDefs();
        const gradientLegendCount: number = 0;
        const linerGradientEle: Element = document.createElementNS(xmlns, 'linearGradient');
        const opacity: number = 1;
        const fillColors: string[] = [];
        const numberItems: number[] = [];
        if (legend.title) {
            if (!this.isVertical) {
                if (legend.titlePosition === 'Left') {
                    legendBounds.x += this.legendTitleSize.width;
                    legendBounds.width -= this.legendTitleSize.width;
                } else if (legend.titlePosition === 'Right') {
                    legendBounds.width -= this.legendTitleSize.width;
                } else if (legend.titlePosition === 'Top') {
                    legendBounds.y += this.legendTitleSize.height;
                    legendBounds.height -= this.legendTitleSize.height;
                }
            } else {
                legendBounds.y += this.legendTitleSize.height;
                legendBounds.height -= this.legendTitleSize.height;
            }
        }
        for (const colorMap of (this.chart as Chart).rangeColorSettings) {
            if (numberItems.indexOf(colorMap.start) < 0) {
                numberItems.push(colorMap.start);
            }
            if (colorMap.colors.length > 2) {
                let diffValue: number = (colorMap.end - colorMap.start);
                const colorsLength: number = colorMap.colors.length - 1;
                if (diffValue > 0) {
                    diffValue = diffValue / colorsLength;
                    for (let index: number = 1; index < colorsLength; index++) {
                        const calculatedValue: number = colorMap.start + (diffValue * index);
                        numberItems.push(calculatedValue);
                    }
                } else {
                    for (let index: number = 1; index < colorsLength; index++) {
                        numberItems.push(colorMap.start);
                    }
                }
            }
            if (numberItems.indexOf(colorMap.end) < 0) {
                numberItems.push(colorMap.end);
            }
            for (const fillColor of colorMap.colors) {
                if (fillColors.indexOf(fillColor) < 0) {
                    fillColors.push(fillColor);
                }
            }
            if (colorMap.colors.length > 0 && colorMap.colors.length < 2) {
                fillColors.push(colorMap.colors[0]);
            }
        }
        const x1: string = this.isRtlEnable && !this.isVertical ? '100%' : '0%';
        const x2: string = this.isVertical || this.isRtlEnable ? '0%' : '100%';
        const y2: string = this.isVertical ? '100%' : '0%';
        linerGradientEle.setAttribute('id', this.generateId(previousLegend, 'linearGradient', gradientLegendCount));
        linerGradientEle.setAttribute('x1', x1);
        linerGradientEle.setAttribute('y1', '0%');
        linerGradientEle.setAttribute('x2', x2);
        linerGradientEle.setAttribute('y2', y2);
        const full: number = numberItems[numberItems.length - 1] - numberItems[0];
        for (let b: number = 0; b < fillColors.length; b++) {
            let offsetValue: number = numberItems[b as number] - numberItems[0];
            offsetValue = offsetValue / full;
            const stopEle: Element = document.createElementNS(xmlns, 'stop');
            stopEle.setAttribute('offset', offsetValue.toString());
            stopEle.setAttribute('stop-color', fillColors[b as number]);
            stopEle.setAttribute('stop-opacity', opacity.toString());
            linerGradientEle.appendChild(stopEle);
        }
        const startLabel: string = previousLegend.text.toString();
        const endLabel: string = nextLegend.text.toString();
        const startTextSize: Size = measureText(startLabel, legend.textStyle, this.chart.themeStyle.legendLabelFont);
        const endTextSize: Size = measureText(endLabel, legend.textStyle, this.chart.themeStyle.legendLabelFont);
        const textWidth: number = startTextSize.width > endTextSize.width ? startTextSize.width : endTextSize.width;
        const textHeight: number = startTextSize.height > endTextSize.height ? startTextSize.height : endTextSize.height;
        let otherSpaces: number = (2 * textWidth) + (4 * legend.padding);
        let linearBarWidth: number = legendBounds.width;
        let linearBarHeight: number = legendBounds.height;
        let xValue: number = legendBounds.x + textWidth + (2 * legend.padding);
        let yValue: number = legendBounds.y + legend.padding;
        let startLabelY: number;
        let endLabelY: number;
        let startLabelX: number;
        let endLabelX: number;
        if (this.isVertical) {
            otherSpaces = (2 * textHeight) + (4 * legend.padding);
            linearBarWidth = legendBounds.width - (2 * legend.padding);
            linearBarHeight = legendBounds.height - otherSpaces;
            xValue = legendBounds.x + legend.padding;
            yValue = legendBounds.y + textHeight + (2 * legend.padding);
            startLabelY = legendBounds.y + legend.padding + textHeight;
            endLabelY = yValue + linearBarHeight + textHeight;
            startLabelX = (legendBounds.x + (legendBounds.width * 0.5)) - (textWidth * 0.5);
            endLabelX = startLabelX;
            if (linearBarWidth > 30) {
                const diffWidth: number = linearBarWidth - 30;
                linearBarWidth = 30;
                xValue = xValue + (diffWidth / 2);
            }
        } else {
            linearBarWidth = legendBounds.width - otherSpaces;
            linearBarHeight = legendBounds.height - (2 * legend.padding);
            startLabelX = legendBounds.x + ((!this.isRtlEnable) ? legend.padding + (textWidth - startTextSize.width) :
                linearBarWidth + (3 * legend.padding) + textWidth);
            endLabelX = legendBounds.x + ((!this.isRtlEnable) ? linearBarWidth + (3 * legend.padding) + textWidth :
                legend.padding + (textWidth - endTextSize.width));
            startLabelY = legendBounds.y + (legendBounds.height * 0.5) + (textHeight * 0.25);
            endLabelY = startLabelY;
            if (linearBarHeight > 30) {
                const diffHeight: number = linearBarHeight - 30;
                linearBarHeight = 30;
                yValue = yValue + (diffHeight / 2);
            }
        }
        const anchor : string = chart.enableRtl ? 'end' : '';
        let textOptions: TextOption = new TextOption('', startLabelX, startLabelY, anchor, startLabel);
        const hiddenColor: string = '#D3D3D3';
        textOptions.id = this.legendID + this.generateId(previousLegend, '_text_', 1);
        const fontcolor: string = previousLegend.visible ? legend.textStyle.color || chart.themeStyle.legendLabelFont.color : hiddenColor;
        const isCanvas: boolean = this.isStockChartControl ? false : (this.chart as Chart).enableCanvas;
        textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, legendTranslateGroup, false, false, false, false,
                    null, this.currentPageNumber && isCanvas ?
                        new Rect(0, -this.translatePage(isCanvas, null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) :
                        null, null, null, null, null, this.chart.themeStyle.legendLabelFont);

        textOptions = new TextOption('', endLabelX, endLabelY, anchor, endLabel);
        textOptions.id = this.legendID + this.generateId(previousLegend, '_text_', 2);
        textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, legendTranslateGroup, false, false, false, false,
                    null, this.currentPageNumber && isCanvas ?
                        new Rect(0, -this.translatePage(isCanvas, null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) :
                        null, null, null, null, null, this.chart.themeStyle.legendLabelFont);
        const gradientLegend: Element = chart.renderer.drawRectangle({
            width: linearBarWidth,
            height: linearBarHeight,
            x: xValue,
            y: yValue,
            fill: 'url(#' + this.generateId(previousLegend, 'linearGradient', gradientLegendCount) + ')'
        });
        defElement.appendChild(linerGradientEle);
        legendTranslateGroup.appendChild(defElement);
        legendTranslateGroup.appendChild(gradientLegend);
    }
    /**
     * To find first valid legend text index for chart and accumulation chart
     *
     * @param legendCollection
     * @returns {number}
     * @private
     */

    private findFirstLegendPosition(legendCollection: LegendOptions[]): number {
        let count: number = 0;
        for ( const legend of legendCollection) {
            if (legend.render && legend.text && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    }
    /**
     * To get the legend title text width and height.
     *
     * @param legend
     * @param legendBounds
     */

    protected calculateLegendTitle(legend: LegendSettingsModel, legendBounds: Rect): void {
        if (legend.title) {
            this.isTop = legend.titlePosition === 'Top';
            const padding: number = legend.titleStyle.textOverflow === 'Trim' ? 2 * legend.padding : 0;
            if (this.isTop || this.isVertical) {
                this.legendTitleCollections = getTitle(legend.title, legend.titleStyle, (legendBounds.width - padding),
                                                       this.chart.enableRtl, this.chart.themeStyle.legendTitleFont);
            } else {
                this.legendTitleCollections[0] = textTrim(legend.maximumTitleWidth, legend.title, legend.titleStyle,
                                                          this.chart.enableRtl, this.chart.themeStyle.legendTitleFont);
            }
            const text: string = this.isTop ? legend.title : this.legendTitleCollections[0];
            this.legendTitleSize = measureText(text, legend.titleStyle, this.chart.themeStyle.legendTitleFont);
            this.legendTitleSize.height *= this.legendTitleCollections.length;
        } else {
            this.legendTitleSize = new Size(0, 0);
        }
    }
    /**
     * Render the legend title
     *
     * @param chart
     * @param legend
     * @param legendBounds
     * @param legendGroup
     */

    private renderLegendTitle(
        chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D, legend: LegendSettingsModel,
        legendBounds: Rect, legendGroup: Element
    ): void {
        const padding: number = legend.padding;
        const alignment: Alignment = legend.titleStyle.textAlignment;
        this.isTop = legend.titlePosition === 'Top';
        let anchor: string = getTextAnchor(legend.titleStyle.textAlignment, chart.enableRtl);
        let x: number = titlePositionX(legendBounds, legend.titleStyle);
        anchor = this.isTop || this.isVertical ? anchor : (chart.enableRtl) ? 'end' : '';
        x = alignment === 'Near' ? (x + padding) : alignment === 'Far' ? (x - padding) : x;
        x = (this.isTop || this.isVertical) ? x : ((legendBounds.x) + (legend.titlePosition === 'Left' ? 5 :
            (legendBounds.width - this.legendTitleSize.width - 5)));
        const topPadding: number = (legendBounds.height / 2) + (this.legendTitleSize.height / 4);
        const y: number = legendBounds.y + (!this.isTop && !this.isVertical ? topPadding :
            (this.legendTitleSize.height / this.legendTitleCollections.length));
        const legendTitleTextOptions: TextOption = new TextOption(this.legendID + '_title', x, y, anchor, this.legendTitleCollections);
        textElement(chart.renderer, legendTitleTextOptions, legend.titleStyle, legend.titleStyle.color ||
            this.chart.themeStyle.legendTitleFont.color, legendGroup, null, null, null, null, null, null,
                    null, null, null, null, this.chart.themeStyle.legendTitleFont);
    }
    /**
     * To create legend rendering elements for chart and accumulation chart
     *
     * @param chart
     * @param legendBounds
     * @param legendGroup
     * @param legend
     * @param id
     * @param redraw
     */

    private createLegendElements(
        chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D |CircularChart3D, legendBounds: Rect,
        legendGroup: Element, legend: LegendSettingsModel, id: string, redraw?: boolean
    ): Element {
        const padding: number = legend.padding;
        const options: RectOption = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds, 0, 0, '', this.legend.border.dashArray);
        const legendItemsGroup: Element = chart.renderer.createGroup({ id: id + '_collections' });
        const isCanvas: boolean = this.isStockChartControl ? false : (chart as Chart).enableCanvas;
        const clippath: Element = chart.renderer.createClipPath({ id: id + '_clipPath' });
        options.width = (this.isRtlEnable && this.chart.getModuleName() === 'accumulationchart' && this.isVertical  && legend.layout === 'Auto' && !(legend.maximumColumns > 0)) ? this.maxWidth : legendBounds.width;
        if (legendGroup) {
            legendGroup.appendChild(chart.renderer.drawRectangle(options));
        } else {
            chart.renderer.drawRectangle(options);
        }
        if (legend.title) {
            this.renderLegendTitle(chart, legend, legendBounds, legendGroup);
        }
        if (!isCanvas) {
            legendGroup.appendChild(legendItemsGroup);
        }
        this.legendTranslateGroup = chart.renderer.createGroup({ id: id + '_translate_g' });
        if (!isCanvas) {
            legendItemsGroup.appendChild(this.legendTranslateGroup);
        }
        options.y += (this.isTop ? this.legendTitleSize.height : 0) + (!this.isBulletChartControl ? legend.containerPadding.top : 0);
        options.height -= (this.isTop && (this.isChartControl || !this.isVertical || legend.layout !== 'Auto') ? this.legendTitleSize.height : 0) + (this.isBulletChartControl ? 0 : legend.containerPadding.top);
        options.id += '_clipPath_rect';
        options.width = (
            (!this.isChartControl && chart.getModuleName() !== 'bulletChart' && !this.isStockChartControl && !(chart.getModuleName() === 'accumulationchart' && (legend.layout !== 'Auto' || legend.maximumColumns > 0))
            ) && this.isVertical) ? this.maxWidth - padding + legend.containerPadding.left + legend.containerPadding.right
            : legendBounds.width;
        options.width = (chart.legendSettings as LegendSettings).titlePosition === 'Right' ? (options.width - this.legendTitleSize.width - padding) : options.width;
        if (!isCanvas) {
            this.clipRect = chart.renderer.drawRectangle(options);
            clippath.appendChild(this.clipRect);
        } else {
            this.pagingClipRect = options;
        }
        appendChildElement(isCanvas, chart.svgObject, clippath, redraw);
        if (!isCanvas) {
            (legendItemsGroup as HTMLElement).style.cssText = 'clip-path:url(#' + clippath.id + ')';
        }
        return this.legendTranslateGroup;
    }
    /**
     * To render legend symbols for chart and accumulation chart
     *
     * @param legendOption
     * @param group
     * @param i
     * @param legendOption
     * @param group
     * @param i
     * @param legendOption
     * @param group
     * @param i
     */

    protected renderSymbol(legendOption: LegendOptions, group: Element, legendIndex: number): void {
        const control: BulletChart = this.isBulletChartControl ? this.chart as BulletChart : null;
        const symbolColor: string = legendOption.visible ? legendOption.fill : '#D3D3D3';
        const isStrokeWidth: boolean = (this.chart.getModuleName() === 'chart' || this.chart.getModuleName() === 'stockChart') && (((legendOption.shape === 'SeriesType') &&
            (legendOption.type.toLowerCase().indexOf('line') > -1) && (legendOption.type.toLowerCase().indexOf('area') === -1)) ||
            ((legendOption.shape === 'HorizontalLine') || (legendOption.shape === 'VerticalLine') || (legendOption.shape === 'Cross')));
        const isCustomBorder: boolean = (this.chart.getModuleName() === 'chart' || this.chart.getModuleName() === 'stockChart') &&
            (legendOption.type === 'Scatter' || legendOption.type === 'Bubble');
        const isCanvas: boolean = this.isStockChartControl ? false : (this.chart as Chart).enableCanvas;
        let borderColor: string;
        let shape: string = (legendOption.shape === 'SeriesType') ? legendOption.type : legendOption.shape;
        let strokewidth: number = isStrokeWidth ? (this.legend.mode === 'Series' ?
            (this.chart as Chart).visibleSeries[legendIndex as number].width : (this.chart as Chart).visibleSeries[0].width) :
            (this.isBulletChartControl && legendOption.shape === 'Multiply') ? 4 : 1;
        let regionPadding: number;
        shape = shape === 'Scatter' ? legendOption.markerShape : shape;
        if (isCustomBorder && legendIndex < (this.chart as Chart).visibleSeries.length) {
            const series: Series = (this.chart as Chart).visibleSeries[legendIndex as number];
            const seriesBorder: BorderModel = series.border;
            const isLineShapemarker: boolean = (shape as ChartShape) === 'HorizontalLine' || (shape as ChartShape) === 'VerticalLine';
            borderColor = isLineShapemarker ? symbolColor : seriesBorder.color ? seriesBorder.color : symbolColor;
            strokewidth = isLineShapemarker ? series.width : seriesBorder.width ? seriesBorder.width : 1;
        }
        const symbolOption: PathOption = new PathOption(
            this.legendID + this.generateId(legendOption, '_shape_', legendIndex), symbolColor, strokewidth,
            (isCustomBorder ? borderColor : symbolColor), this.legend.opacity, legendOption.dashArray, '');
        const textSize: Size = measureText(legendOption.text, this.legend.textStyle, this.chart.themeStyle.legendLabelFont);
        let maxWidth: number = 0;
        for (const text of legendOption.textCollection) {
            const size: Size = measureText(text, this.legend.textStyle, this.chart.themeStyle.legendLabelFont);
            if (size.width > maxWidth) {
                maxWidth = size.width;
            }
        }
        const x: number = this.legend.isInversed && !this.isRtlEnable ? legendOption.location.x + (this.legend.textWrap === 'Wrap'
            && legendOption.textCollection.length > 1 ? maxWidth : textSize.width) + this.legend.shapePadding
            : legendOption.location.x;
        const y: number = legendOption.location.y;
        if (!isCanvas) {
            group.appendChild(drawSymbol({ x: x, y: y }, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight),
                                         legendOption.url, symbolOption, this.accessbilityText, this.chart.renderer, null,
                                         this.isBulletChartControl, control
            ));
        } else {
            regionPadding = -this.translatePage(isCanvas, null, this.currentPageNumber - 1, this.currentPageNumber);
            drawSymbol({ x: x, y: y }, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '',
                       symbolOption, this.accessbilityText, this.chart.renderer,
                       this.currentPageNumber ? new Rect(0, regionPadding, 0, 0) : null, this.isBulletChartControl, control);
            this.legendRegions.push({
                rect: new Rect(legendOption.location.x - this.legend.shapeWidth, legendOption.location.y,
                               this.legend.shapeWidth + this.legend.shapePadding, this.legend.shapeHeight + regionPadding),
                index: legendIndex
            });
        }
        if (shape === 'Line' && legendOption.markerVisibility && legendOption.markerShape !== 'Image' ||
            (legendOption.type === <AccumulationType>'Doughnut' && shape === 'Doughnut')) {
            symbolOption.id = this.legendID + this.generateId(legendOption, '_shape_marker_', legendIndex);
            shape = legendOption.type === <AccumulationType>'Doughnut' ? 'Circle' : legendOption.markerShape;
            symbolOption.fill = legendOption.type === <AccumulationType>'Doughnut' ? '#FFFFFF' : symbolOption.fill;
            if (!isCanvas) {
                group.appendChild(drawSymbol({ x: x, y: y }, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                                             '', symbolOption, this.accessbilityText, null, null,
                                             this.isBulletChartControl, control));
            } else {
                drawSymbol({ x: x, y: y }, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                           '', symbolOption, this.accessbilityText, this.chart.renderer,
                           this.currentPageNumber ?
                               new Rect(0, -this.translatePage(isCanvas, null, this.currentPageNumber - 1,
                                                               this.currentPageNumber), 0, 0) : null,
                           this.isBulletChartControl, control);

            }
        }
    }
    /**
     * To render legend text for chart and accumulation chart
     *
     * @param chart
     * @param legendOption
     * @param group
     * @param textOptions
     * @param i
     * @param chart
     * @param legendOption
     * @param group
     * @param textOptions
     * @param i
     * @param chart
     * @param legendOption
     * @param group
     * @param textOptions
     * @param i
     * @param chart
     * @param legendOption
     * @param group
     * @param textOptions
     * @param i
     * @param chart
     * @param legendOption
     * @param group
     * @param textOptions
     * @param i
     */

    protected renderText(
        chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D,
        legendOption: LegendOptions, group: Element, textOptions: TextOption,
        i: number, legendIndex: number): void {
        const legend: LegendSettingsModel = chart.legendSettings;
        const hiddenColor: string = '#D3D3D3';
        const fontcolor: string = legendOption.visible ? legend.textStyle.color || chart.themeStyle.legendLabelFont.color : hiddenColor;
        const isCanvas: boolean = this.isStockChartControl ? false : (this.chart as Chart).enableCanvas;
        textOptions.id = this.legendID + this.generateId(legendOption, '_text_', legendIndex);
        textOptions.text = legendOption.textCollection.length > 0 ? legendOption.textCollection : legendOption.text;
        if (legend.isInversed && !this.isRtlEnable) {
            textOptions.x = legendOption.location.x - (legend.shapeWidth / 2);
        }
        else if (this.isRtlEnable) {
            const isMultiLine: boolean = legendOption.textCollection.length > 1;
            const textWidth: number = isMultiLine
                ? Math.max(...legendOption.textCollection.map((line: string) =>
                    measureText(line, legend.textStyle, this.chart.themeStyle.legendLabelFont).width))
                : measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont).width;
            textOptions.x = this.chart.getModuleName() === 'bulletChart'
                ? legendOption.location.x - legend.shapeWidth
                : legendOption.location.x - (textWidth + legend.shapeWidth / 2 + legend.shapePadding);
        }
        else {
            textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        }
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false,
                    null, this.currentPageNumber && isCanvas ?
                        new Rect(0, -this.translatePage(isCanvas, null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) :
                        null, null, null, null, null, this.chart.themeStyle.legendLabelFont);
        if (isCanvas) {
            const textSize: Size = measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            let region: ILegendRegions;
            for (let j: number = 0; j < this.legendRegions.length; j++) {
                if (this.legendRegions[j as number].index === i) {
                    region = this.legendRegions[j as number];
                    break;
                }
            }
            region.rect.y = textOptions.y < region.rect.y ? textOptions.y : region.rect.y;
            region.rect.width += textSize.width;
            region.rect.height = textSize.height;
            region.rect.y -= textSize.height * 0.5;
            region.rect.x -= (this.isRtlEnable) ? region.rect.width : 0 ;
        }
    }
    /**
     * To render legend paging elements for chart and accumulation chart
     *
     * @param chart
     * @param bounds
     * @param textOption
     * @param legendGroup
     * @param chart
     * @param bounds
     * @param textOption
     * @param legendGroup
     * @param chart
     * @param bounds
     * @param textOption
     * @param legendGroup
     * @param chart
     * @param bounds
     * @param textOption
     * @param legendGroup
     */

    private renderPagingElements(
        chart: Chart | AccumulationChart | BulletChart | StockChart | Chart3D | CircularChart3D,
        bounds: Rect, textOption: TextOption, legendGroup: Element): void {
        const paginggroup: Element = chart.renderer.createGroup({ id: this.legendID + '_navigation' });
        const isCanvas: boolean = this.isStockChartControl ? false : (chart as Chart).enableCanvas;
        const titleHeight: number = this.isBulletChartControl ? 0 : this.legendTitleSize.height;
        const grayColor: string = (this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('Contrast') > -1) ? '#FFFFFF' : '#545454';
        const legend: LegendSettingsModel = chart.legendSettings; // to solve parameter lint error, legend declaration is here
        const padding: number = 8; // const padding for paging elements
        const pageUp: string = this.legendID + (!this.isRtlEnable ? '_pageup' : '_pagedown');
        const pageDown: string = this.legendID + (!this.isRtlEnable ? '_pagedown' : '_pageup');
        const symbolOption: PathOption = new PathOption(pageUp, 'transparent', 5, grayColor, 1, '', '');
        const iconSize: number = chart.availableSize.width < 110 || chart.availableSize.height < 190 ? 4 : this.pageButtonSize;
        const legendFontSize: FontModel = <FontModel>(extend({}, getValue('properties', legend.textStyle), null, true));
        legendFontSize.size = (chart.availableSize.width < 110 || chart.availableSize.height < 190 && !this.isBulletChartControl && this.chart.getModuleName() === 'accumulationchart') ? '8px' : legend.textStyle.size;
        // Page left arrow drawing calculation started here
        const rowCount: number = !legend.enablePages && this.isPaging && !this.isVertical && !this.isBulletChartControl ? 1 :
            (this.rowCount - 1);
        const titleWidth: number = this.isTitle && legend.titlePosition === 'Left' ? this.legendTitleSize.width : 0;
        this.pagingRegions = [];
        this.backwardArrowOpacity = this.currentPage !== 1 ? 1 : 0;
        this.forwardArrowOpacity = this.currentPage === this.totalPages ? 0 : 1;
        if (!isCanvas) {
            legendGroup.appendChild(paginggroup);
        }
        if (!this.isChartControl && !this.isAccChartControl) {
            if (this.isBulletChartControl || this.isStockChartControl || !this.isVertical) {
                this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
            } else {
                this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
            }
        }
        if (paginggroup) {
            (paginggroup as HTMLElement).style.cursor = 'pointer';
        }
        if ((this.isChartControl || this.isAccChartControl) && !(!legend.enablePages && this.isPaging)) {
            this.clipPathHeight = this.pageHeights[0] - (this.isTitle && this.isTop && (this.isChartControl || !this.isVertical || legend.layout !== 'Auto') ? this.legendTitleSize.height : 0) -
            legend.containerPadding.top - legend.containerPadding.bottom;
        } else {
            this.clipPathHeight = (rowCount * (this.maxItemHeight + legend.padding));
        }
        //this.clipPathHeight = !(this.isChartControl) ? (rowCount * (this.maxItemHeight + legend.padding)) : this.columnHeights[0];
        if (!isCanvas) {
            this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        } else {
            //paging clipRect only for canvas mode
            this.pagingClipRect.height = this.legendBounds.height - this.clipPathHeight -
                                        (this.pagingClipRect.y - this.legendBounds.y) - legend.border.width;
            this.pagingClipRect.y = this.pagingClipRect.y + this.clipPathHeight;
            this.pagingClipRect.x += legend.border.width;
            this.pagingClipRect.width -= (legend.border.width + legend.border.width / 2);
            (this.chart.renderer as CanvasRenderer).clearRect(new Rect(this.pagingClipRect.x, this.pagingClipRect.y,
                                                                       this.pagingClipRect.width, this.pagingClipRect.height));
        }
        let pageTextElement: Element;
        let x: number = (bounds.x + iconSize / 2);
        let y: number = bounds.y + this.clipPathHeight + ((titleHeight + bounds.height - this.clipPathHeight) / 2);
        if (this.isPaging && !legend.enablePages && !this.isVertical && !this.isBulletChartControl) {
            x = (bounds.x + this.pageButtonSize + titleWidth);
            y = legend.title && this.isTop ? (bounds.y + padding + titleHeight + (iconSize / 1) + 0.5) :
                (bounds.y + padding + iconSize + 0.5);
        }
        const size: Size = measureText(this.totalPages + '/' + this.totalPages, legendFontSize, this.chart.themeStyle.legendLabelFont);
        const translateX: number = (this.isRtlEnable) ?  legend.border.width + (iconSize / 2) :
            bounds.width - (2 * (iconSize + padding) + padding + size.width);
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + (iconSize / 2) + (padding / 2) + titleHeight;
                symbolOption.opacity = this.backwardArrowOpacity;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'UpArrow', new Size(iconSize, iconSize), '', symbolOption, 'UpArrow'));
            } else {
                symbolOption.opacity = this.isBulletChartControl ? symbolOption.opacity :
                    (legend.enablePages ? 1 : !this.isRtlEnable ? this.backwardArrowOpacity : this.forwardArrowOpacity);
                paginggroup.appendChild(
                    drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow')
                );
            }
        } else {
            drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow', this.chart.renderer,
                       new Rect(translateX, 0, 0, 0));

        }
        this.pagingRegions.push(new Rect(!this.isRtlEnable ? x + bounds.width -
            (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5 : x, y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = !this.isRtlEnable ? '1/' + this.totalPages : this.totalPages + '/1';
        const color: string = (this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('Contrast') > -1) ? '#FFFFFF' : legend.textStyle.color || this.chart.theme === 'Tailwind3' ? '#111827' : this.chart.theme === 'Tailwind3Dark' ? '#FFFFFF' : this.chart.themeStyle.legendLabelFont.color;
        if (isCanvas && this.totalNoOfPages) {
            textOption.text = !this.isRtlEnable ? this.currentPageNumber  + '/' + this.totalNoOfPages : this.totalNoOfPages + '/' +  this.currentPageNumber;
        }
        if (legend.enablePages || this.isBulletChartControl) {
            pageTextElement = textElement(
                chart.renderer, textOption, legendFontSize, color, paginggroup,
                false, false, false, false, null,
                new Rect(translateX, 0, 0, 0), null, null, null, null, this.chart.themeStyle.legendLabelFont
            );
        }
        // Page right arrow rendering calculation started here
        x = textOption.x + padding + (iconSize / 2) + size.width;
        if (this.isPaging && !legend.enablePages && !this.isBulletChartControl  && !this.isVertical) {
            x = (bounds.x + bounds.width - (this.isBulletChartControl ? this.fivePixel : 0) - this.pageButtonSize - (legend.title && legend.titlePosition === 'Right' ?
                this.legendTitleSize.width + this.fivePixel : 0));
        }
        symbolOption.id = pageDown;
        symbolOption.opacity = !legend.enablePages ? !this.isRtlEnable ? this.forwardArrowOpacity : this.backwardArrowOpacity : 1;
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + bounds.height - (iconSize / 2);
                paginggroup.appendChild(
                    drawSymbol({ x: x, y: y }, 'DownArrow', new Size(iconSize, iconSize), '', symbolOption, 'DownArrow')
                );
            } else {
                paginggroup.appendChild(
                    drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption, 'RightArrow')
                );
            }
        } else {
            drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption,
                       'RightArrow', this.chart.renderer,
                       new Rect(translateX, 0, 0, 0));
        }
        this.pagingRegions.push(new Rect(!this.isRtlEnable ? x + (bounds.width -
            (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5) : x, y - iconSize * 0.5, iconSize, iconSize));
        if (!isCanvas && (legend.enablePages || this.isBulletChartControl)) {
        //placing the navigation buttons and page numbering in legend right corner
            paginggroup.setAttribute('transform', 'translate(' + translateX + ', ' + 0 + ')');
        } else {
            if (this.currentPageNumber === 1 && this.calTotalPage && (legend.enablePages || this.isBulletChartControl)) {
                this.totalNoOfPages = this.totalPages;
                this.calTotalPage = false;
            }
            if (!legend.enablePages && !this.isBulletChartControl) { // For new legend page navigation
                this.translatePage(isCanvas, null, this.currentPage - 1, this.currentPage, legend);
            }
        }
        if (legend.enablePages || this.isBulletChartControl) {
            this.translatePage(isCanvas, pageTextElement, this.currentPage - 1, this.currentPage, legend);
        }
    }
    private getPageHeight(pageHeights : number[], pageCount : number) : number {
        let sum : number = 0;
        for (let i: number = 0; i < pageCount; i++) {
            sum += pageHeights[i as number] - ((this.isTitle && this.isTop) ? this.legendTitleSize.height : 0);
        }
        return sum;
    }
    /**
     * To translate legend pages for chart and accumulation chart
     *
     * @param pagingText
     * @param page
     * @param pageNumber
     * @param legend
     * @param pagingText
     * @param page
     * @param pageNumber
     * @param legend
     * @param pagingText
     * @param page
     * @param pageNumber
     * @param legend
     * @param pagingText
     * @param page
     * @param pageNumber
     * @param legend
     */

    protected translatePage(isCanvas: boolean, pagingText: Element, page: number, pageNumber: number,
                            legend?: LegendSettingsModel): number {
        let size: number = (this.isChartControl || this.isAccChartControl) ?
            (page ? this.getPageHeight(this.pageHeights, page) : 0) : ((this.clipPathHeight) * page);
        if (!isCanvas && (this.isChartControl || this.isAccChartControl)) {
            this.clipRect.setAttribute('height', (this.pageHeights[page as number] - (this.isTitle && this.isTop && (this.isChartControl || !this.isVertical || legend.layout !== 'Auto') ? this.legendTitleSize.height : 0) - legend.containerPadding.top - legend.containerPadding.bottom).toString());
            if (this.isAccChartControl && this.isPaging && !legend.enablePages && this.isVertical && (this.chart.getModuleName() !== 'accumulationchart' || legend.layout === 'Auto')) {
                this.clipRect.setAttribute('height', this.legendBounds.height.toString());
            }
        }
        let translate: string = 'translate(0,-' + size + ')';
        if (!this.isChartControl && !this.isBulletChartControl && !this.isStockChartControl && !(this.chart.getModuleName() === 'accumulationchart' && legend.layout !== 'Auto') && this.isVertical) {
            const pageX : number = this.pageXCollections[page * this.maxColumns];
            size = (!this.isRtlEnable) ? pageX - this.legendBounds.x : (this.legendBounds.x + this.maxWidth) - pageX;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = ((!this.isRtlEnable) ? 'translate(-' : 'translate(') + size + ',0)';
        }
        if (!(this.chart as Chart).enableCanvas) {
            this.legendTranslateGroup.setAttribute('transform', translate);
        }
        if (!(this.chart as Chart).enableCanvas && (legend.enablePages || this.isBulletChartControl)) {
            pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        }
        this.currentPage = pageNumber;
        return size;
    }
    /**
     * To change legend pages for chart and accumulation chart
     *
     * @param event
     * @param pageUp
     * @param event
     * @param pageUp
     */

    protected changePage(event: Event, pageUp: boolean): void {
        const legend: LegendSettingsModel = (this.chart as Chart).legendSettings;
        const backwardArrow: Element = document.getElementById(this.legendID + '_pageup');
        const forwardArrow: Element = document.getElementById(this.legendID + '_pagedown');
        const isCanvas: boolean = this.isStockChartControl ? false : (this.chart as Chart).enableCanvas;
        const pageText: Element = (legend.enablePages || this.isBulletChartControl) ?
            document.getElementById(this.legendID + '_pagenumber') : null;
        const page: number = (legend.enablePages || this.isBulletChartControl) ? parseInt(pageText.textContent.split('/')[0], 10) :
            this.currentPage;
        if (pageUp && page > 1) {
            this.translatePage(isCanvas, pageText, (page - 2), (page - 1), legend);
        } else if (!pageUp && page < this.totalPages) {
            this.translatePage(isCanvas, pageText, page, (page + 1), legend);
        }
        if (this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            if (this.currentPage === this.totalPages) {
                this.hideArrow(forwardArrow);
            }
            else {
                this.showArrow(forwardArrow);
            }
            if (this.currentPage === 1) {
                this.hideArrow(backwardArrow);
            }
            else {
                this.showArrow(backwardArrow);
            }
            // this.currentPage === this.totalPages ? this.hideArrow(forwardArrow) : this.showArrow(forwardArrow);
            // this.currentPage === 1 ? this.hideArrow(backwardArrow) : this.showArrow(backwardArrow);
        }
    }
    /**
     * To hide the backward and forward arrow
     *
     * @param arrowElement
     */

    private hideArrow(arrowElement: Element): void {
        arrowElement.setAttribute('opacity', '0');
    }
    /**
     * To show the  backward and forward arrow
     *
     * @param arrowElement
     */

    private showArrow(arrowElement: Element): void {
        arrowElement.setAttribute('opacity', '1');
    }
    /**
     * To find legend elements id based on chart or accumulation chart
     *
     * @param option
     * @param prefix
     * @param count
     * @param option
     * @param prefix
     * @param count
     * @param option
     * @param prefix
     * @param count
     * @private
     */

    public generateId(option: LegendOptions, prefix: string, count: number): string {
        if (this.isChartControl || this.isStockChartControl) {
            return prefix + count;
        } else {
            return prefix + option.pointIndex;
        }
    }

    /**
     * To show or hide trimmed text tooltip for legend.
     *
     * @param event
     * @returns {void}
     * @private
     */

    public move(event: Event): void {
        const x: number = this.chart.mouseX;
        const y: number = this.chart.mouseY;
        if ((<HTMLElement>event.target).textContent.indexOf('...') > -1) {
            const targetId: string[] = (<HTMLElement>event.target).id.split(this.legendID + '_text_');
            if (targetId.length === 2) {
                const index: number = parseInt(targetId[1], 10);
                const element: HTMLElement = this.chart.element;
                if (!isNaN(index)) {
                    if (this.chart.isTouch) {
                        removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    }
                    if (this.isChartControl) {
                        showTooltip(
                            (<Chart>this.chart).series[index as number].name, x, y, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip',
                            getElement(this.chart.element.id + '_Secondary_Element'), null, null, this.legendBounds
                        );
                    } else {
                        const legendIndex: number = this.isReverse ? ((this.legendCollections.length - 1) - index as number)
                            : index as number;
                        const tooltipText: string = (this.chart.getModuleName() === 'accumulationchart' ?
                            this.legendCollections[legendIndex as number].originalText
                            : (<CircularChart3D>this.chart).visibleSeries[0].points[index as number].x.toString());
                        showTooltip(
                            tooltipText, x + 10, y + 10,
                            element.offsetWidth, element.id + '_EJ2_Legend_Tooltip',
                            getElement(this.chart.element.id + '_Secondary_Element')
                        );
                    }
                }
            }
        } else {
            removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
        if (this.chart.isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = +setTimeout(() => { removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
        }
    }
}
/**
 * Class for legend options
 *
 * @private
 */

export class LegendOptions {
    public render: boolean;
    public originalText: string;
    public text: string;
    public fill: string;
    public shape: LegendShape;
    public visible: boolean;
    public type: ChartSeriesType | AccumulationType;
    public textSize: Size;
    public location: ChartLocation = { x: 0, y: 0 };
    public url?: string;
    public pointIndex?: number;
    public seriesIndex?: number;
    public markerShape?: ChartShape;
    public markerVisibility?: boolean;
    public textCollection?: string[] = [];
    public dashArray?: string;
    constructor(
        text: string, fill: string, shape: LegendShape, visible: boolean, type: ChartSeriesType | AccumulationType, url?: string,
        markerShape?: ChartShape, markerVisibility?: boolean, pointIndex?: number, seriesIndex?: number, dashArray?: string,
        originalText?: string
    ) {
        this.text =  text;
        this.fill = fill;
        this.shape = shape;
        this.url = url;
        this.visible =  visible;
        this.type = type;
        this.markerVisibility = markerVisibility;
        this.markerShape = markerShape;
        this.pointIndex = pointIndex;
        this.seriesIndex = seriesIndex;
        this.dashArray = dashArray;
        this.originalText = originalText;
    }
}
