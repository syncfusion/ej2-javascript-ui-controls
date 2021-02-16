import { Property, Complex, ChildProperty} from '@syncfusion/ej2-base';
import { measureText, Rect, TextOption, Size, PathOption, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Chart, ILegendRegions } from '../../chart';
import { LegendSettingsModel, LocationModel } from './legend-model';
import { Font, Border, Margin, ContainerPadding } from '../model/base';
import { Theme } from '../model/theme';
import { MarginModel, FontModel, BorderModel, ContainerPaddingModel } from '../model/base-model';
import { subtractThickness, Thickness, drawSymbol, ChartLocation, titlePositionX, getTitle, textTrim } from '../utils/helper';
import { RectOption, textElement, stringToNumber } from '../utils/helper';
import { removeElement, showTooltip, getElement, appendChildElement } from '../utils/helper';
import { LegendPosition, LegendShape, ChartSeriesType, ChartShape } from '../../chart/utils/enum';
import { Legend } from '../../chart/legend/legend';
import { AccumulationType } from '../../accumulation-chart/model/enum';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccumulationLegend } from '../../accumulation-chart/renderer/legend';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { BulletChartLegend } from '../../bullet-chart/legend/legend';
import { Alignment, LegendTitlePosition } from '../utils/enum';
/**
 * Configures the location for the legend.
 */
export class Location extends ChildProperty<Location>  {
    /**
     * X coordinate of the legend in pixels.
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Y coordinate of the legend in pixels.
     * @default 0
     */
    @Property(0)
    public y: number;
}

/**
 * Configures the legends in charts.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {

    /**
     * If set to true, legend will be visible.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * The height of the legend in pixels.
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * The width of the legend in pixels.
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * Specifies the location of the legend, relative to the chart.
     * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     * * Custom: Displays the legend  based on the given x and y values.
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LegendPosition;

    /**
     * Option to customize the padding between legend items.
     * @default 8
     */
    @Property(8)
    public padding: number;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Options to customize the legend text.
     */
    @Complex<FontModel>(Theme.legendLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Shape height of the legend in pixels.
     * @default 10
     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Shape width of the legend in pixels.
     * @default 10
     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Options to customize the border of the legend.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */

    @Complex<MarginModel>({left: 0, right: 0, top: 0, bottom: 0}, Margin)
    public margin: MarginModel;

    /**
     *  Options to customize left, right, top and bottom padding for legend container of the chart.
     */

    @Complex<ContainerPaddingModel>({ left: 0, right: 0, top: 0, bottom: 0 }, ContainerPadding)
    public containerPadding: ContainerPaddingModel;

    /**
     * Padding between the legend shape and text.
     * @default 5
     */
    @Property(5)
    public shapePadding: number;

    /**
     * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Opacity of the legend.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * If set to true, series' visibility collapses based on the legend visibility.
     * @default true
     */
    @Property(true)
    public toggleVisibility: boolean;

    /**
     * Description for legends.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the legend.
     * @default 3
     */
    @Property(3)
    public tabIndex: number;

    /**
     * Title for legends.
     * @default null
     */
    @Property(null)
    public title: string;

    /**
     * Options to customize the legend title.
     */
    @Complex<FontModel>(Theme.legendTitleFont, Font)
    public titleStyle: FontModel;

    /**
     * legend title position
     * @default 'Top'
     */
    @Property('Top')
    public titlePosition: LegendTitlePosition;

    /**
     * maximum width for the legend title.
     * @default 100
     */
    @Property(100)
    public maximumTitleWidth: number;

    /**
     * If set to true, legend will be visible using pages.
     * @default true
     */
    @Property(true)
    public enablePages: boolean;
}
/**
 * Legend base class for Chart and Accumulation chart.
 * @private
 */
export class BaseLegend {

    // Internal variables
    protected chart: Chart | AccumulationChart | BulletChart;
    protected legend: LegendSettingsModel;
    protected maxItemHeight: number;
    protected isPaging: boolean;
    private clipPathHeight: number;
    public totalPages: number;
    protected isVertical: boolean;
    protected fivePixel: number = 5;
    private rowCount: number = 0; // legend row counts per page
    private columnCount: number = 0; // legend column counts per page
    protected pageButtonSize: number = 8;
    protected pageXCollections: number[] = []; // pages of x locations
    protected maxColumns: number = 0;
    private isTrimmed: boolean = false;
    public maxWidth: number = 0;
    protected legendID: string;
    private clipRect: Element;
    private legendTranslateGroup: Element;
    protected currentPage: number = 1;
    protected backwardArrowOpacity: number = 0;
    protected forwardArrowOpacity: number = 1;
    private isChartControl: boolean;
    private isBulletChartControl: boolean;
    private accessbilityText: string;
    protected arrowWidth: number = (2 * (this.fivePixel + this.pageButtonSize + this.fivePixel));
    protected arrowHeight: number = this.arrowWidth;
    protected library: Legend | AccumulationLegend | BulletChartLegend;
    /**  @private */
    public position: LegendPosition;
    /**
     * Gets the legend bounds in chart.
     * @private
     */
    public legendBounds: Rect;
    /** @private */
    public legendCollections: LegendOptions[];
    private legendTitleCollections: string[] = [];
    protected legendTitleSize: Size;
    private isTop: boolean = false;
    protected isTitle: boolean = false;
    /** @private */
    public clearTooltip: number;
    //this variable stores the legend clipRect co-oridinates and used to render clipRect in canvas mode.
    protected pagingClipRect: RectOption;
    protected currentPageNumber: number = 1;
    protected legendRegions: ILegendRegions[] = [];
    protected pagingRegions: Rect[] = [];
    protected totalNoOfPages: number;
    /** @private */
    public calTotalPage: boolean;
    private bulletChart: BulletChart;

    /**
     * Constructor for the dateTime module.
     * @private
     */
    constructor(chart?: Chart | AccumulationChart | BulletChart) {
        this.chart = chart;
        this.legend = chart.legendSettings;
        this.legendID = chart.element.id + '_chart_legend';
        this.isChartControl = (chart.getModuleName () === 'chart');
        this.isBulletChartControl = (chart.getModuleName() === 'bulletChart');
        this.bulletChart = this.chart as BulletChart;
    }
    /**
     * Calculate the bounds for the legends.
     * @return {void}
     * @private
     */
    public calculateLegendBounds(rect: Rect, availableSize: Size, maxLabelSize: Size): void {
        let legend: LegendSettingsModel = this.legend;
        this.getPosition(legend.position, availableSize);
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        let defaultValue: string = (this.isBulletChartControl) ? '40%' : '20%';
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(
                legend.height, availableSize.height - (rect.y - this.chart.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || defaultValue, availableSize.width);
        } else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || defaultValue, availableSize.height);
        }
        this.library.getLegendBounds(availableSize, this.legendBounds, legend);
        if (!this.isBulletChartControl) {
            this.legendBounds.width += (this.legend.containerPadding.left + this.legend.containerPadding.right);
            this.legendBounds.height += (this.legend.containerPadding.top + this.legend.containerPadding.bottom);
        }
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize, maxLabelSize);
    }
    /**
     * To find legend position based on available size for chart and accumulation chart
     */
    private getPosition(position: LegendPosition, availableSize: Size): void {
        let chart: Chart =  this.chart as Chart;
        let accumulation: AccumulationChart = this.chart as AccumulationChart;
        if (this.isChartControl || this.isBulletChartControl) {
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
     */
    protected setBounds(computedWidth: number, computedHeight: number, legend: LegendSettingsModel, legendBounds: Rect): void {
        let titleHeight: number = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        if (this.isVertical && this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
            titleHeight += (this.pageButtonSize + this.fivePixel);
        }
        computedWidth = Math.min(computedWidth, legendBounds.width);
        computedHeight = Math.min(computedHeight, legendBounds.height);
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
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
     */
    private getLocation(
        position: LegendPosition, alignment: Alignment, legendBounds: Rect, rect: Rect, availableSize: Size, maxLabelSize: Size
        ): void {
        let padding: number = this.legend.border.width;
        let isBulletChart: boolean = this.isBulletChartControl;
        let bulletChart: BulletChart =  this.bulletChart;
        let labelIns: boolean = bulletChart.labelPosition === 'Inside';
        let ticklIns: boolean = bulletChart.tickPosition === 'Inside';
        let isVertical: boolean = bulletChart.orientation === 'Vertical';
        // tslint:disable-next-line:max-line-length
        let categoryFieldValue: number = (isBulletChart && bulletChart.categoryField !== '') ? maxLabelSize.width + this.chart.border.width + padding * 3 : 0;
        let legendHeight: number = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom ;
        let legendWidth: number = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right ;
        let marginBottom: number = this.chart.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            // tslint:disable-next-line:max-line-length
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            legendBounds.y += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns
            // tslint:disable-next-line:max-line-length
            //tslint:disable-next-line:max-line-length
            && !isVertical) ? bulletChart.majorTickLines.height + marginBottom + this.legend.border.width + padding * 2 :
            (isVertical && bulletChart.categoryField !== '')  ? maxLabelSize.height + padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, 0, legendHeight));
        } else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            legendBounds.y -= (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
            // // tslint:disable-next-line:max-line-length
            !isVertical) ? bulletChart.majorTickLines.height + this.chart.margin.top : 0;
            legendHeight -= (isBulletChart) ? -padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, legendHeight, 0));
        } else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) - this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            legendWidth += (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
            isVertical) ? (
            this.chart.margin.left + this.chart.margin.right + bulletChart.majorTickLines.height) : 0;
            subtractThickness(rect, new Thickness(0, legendWidth, 0, 0));
        } else if (position === 'Left') {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            legendWidth += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns  &&
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            isVertical) ?  (legendBounds.x - this.chart.margin.left + padding + bulletChart.majorTickLines.height) :
            (bulletChart.orientation !== 'Vertical' && bulletChart.categoryField !== '')  ?  categoryFieldValue : 0;
            subtractThickness(rect, new Thickness(legendWidth, 0, 0, 0));
        } else {
            legendBounds.x = this.legend.location.x;
            legendBounds.y = this.legend.location.y;
            subtractThickness(rect, new Thickness(0, 0, 0, 0));
        }
    }

    /**
     * To find legend alignment for chart and accumulation chart
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
     * @return {void}
     * @private
     */
    public renderLegend(
        chart: Chart | AccumulationChart | BulletChart, legend: LegendSettingsModel, legendBounds: Rect, redraw?: boolean
    ): void {
        let firstLegend: number = this.findFirstLegendPosition(this.legendCollections);
        let padding: number = legend.padding; let titleHeight: number = 0; let titlePlusArrowWidth: number = 0;
        let isPaging: boolean = legend.enablePages;
        let titlePosition: LegendTitlePosition = legend.titlePosition;
        let upArrowHeight: number = this.isPaging && !legend.enablePages && this.isVertical ? this.pageButtonSize : 0;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollections[0].textSize.height, legend.shapeHeight);
        let legendGroup: Element = chart.renderer.createGroup({ id: this.legendID + '_g' });
        let legendTranslateGroup: Element = this.createLegendElements(chart, legendBounds, legendGroup, legend, this.legendID, redraw);
        // For new legend navigation
        if (!isPaging && this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = !this.isTitle ? 0 : titlePosition === 'Left' ? this.legendTitleSize.width : 0;
            titlePlusArrowWidth += (this.pageButtonSize + (2 * this.fivePixel));
        } else if (!this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = this.isTitle && titlePosition === 'Left' ? (this.fivePixel + this.legendTitleSize.width) : 0;
        }
        titleHeight = !this.isTitle ? 0 : (this.isTop || this.isVertical ? this.legendTitleSize.height : 0);
        let pagingLegendBounds: Rect = new Rect(0, 0, 0, 0);
        let requireLegendBounds: Rect = new Rect(0, 0, 0, 0);
        if (firstLegend !== this.legendCollections.length) {
            let legendSeriesGroup: Element; // legendItem group for each series group element
            let start: ChartLocation; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new ChartLocation(
                this.isBulletChartControl ? legendBounds.x + titlePlusArrowWidth + padding + (legend.shapeWidth / 2) :
                    legendBounds.x + titlePlusArrowWidth + padding + (legend.shapeWidth / 2) + legend.containerPadding.left,
                this.isBulletChartControl ? legendBounds.y + titleHeight + upArrowHeight + padding + (this.maxItemHeight / 2) :
                    legendBounds.y + titleHeight + upArrowHeight + padding + (this.maxItemHeight / 2) + legend.containerPadding.top
            );
            let anchor: string = (chart as Chart).isRtlEnabled ? 'end' : 'start';
            let textOptions: TextOption = new TextOption('', start.x, start.y, anchor);
            //  initialization for totalPages legend click totalpage again calculate
            this.totalPages = this.totalPages = (this.isChartControl || this.isBulletChartControl) ? this.totalPages : 0;
            let textPadding: number = legend.shapePadding + padding + legend.shapeWidth;
            let count: number = 0;
            this.pageXCollections = [];
            this.legendCollections[firstLegend].location = start;
            let previousLegend: LegendOptions = this.legendCollections[firstLegend];
            if (!legend.enablePages && this.isPaging) {
                let x: number = start.x - this.fivePixel;
                let y: number = start.y - this.fivePixel;
                let rightSpace: number = this.isTitle && !this.isVertical && titlePosition === 'Right' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                let leftSpace: number = this.isTitle && !this.isVertical && titlePosition === 'Left' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                rightSpace += this.isVertical ? 0 : (this.fivePixel + this.pageButtonSize + this.fivePixel);
                let bottomSapce: number = this.isVertical ? (this.pageButtonSize) + Math.abs(y - legendBounds.y) : 0;
                pagingLegendBounds = new Rect(x, y, legendBounds.width - rightSpace - leftSpace, legendBounds.height - bottomSapce);
                requireLegendBounds = pagingLegendBounds;
            } else {
                requireLegendBounds = legendBounds;
            }
            for (let legendOption of this.legendCollections) {
                if (this.chart.getModuleName() === 'accumulationchart') {
                    // tslint:disable-next-line:max-line-length
                    legendOption.fill = (this.chart as Chart || this.chart as AccumulationChart).visibleSeries[0].points[legendOption.pointIndex].color;
                }
                this.accessbilityText = (this.isBulletChartControl) ?  'Legend of bullet chart' + '' + legendOption.text
                : 'Click to show or hide the ' + legendOption.text + ' series';
                if (legendOption.render && legendOption.text !== '') {
                    legendSeriesGroup = chart.renderer.createGroup({
                        id: this.legendID + this.generateId(legendOption, '_g_', count)});
                    if  (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('tabindex', legend.tabIndex.toString());
                        legendSeriesGroup.setAttribute('aria-label', legend.description ||
                        this.accessbilityText);
                    }
                    this.library.getRenderPoint(legendOption, start, textPadding, previousLegend, requireLegendBounds, count, firstLegend);

                    this.renderSymbol(legendOption, legendSeriesGroup, count);

                    this.renderText(chart, legendOption, legendSeriesGroup, textOptions, count);

                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute(
                            'style', 'cursor: ' + ((!legend.toggleVisibility && ((chart as Chart).selectionMode === 'None' ||
                                (chart as Chart).highlightMode === 'None' ||
                                (chart as AccumulationChart).selectionMode === 'None') || this.isBulletChartControl) ? 'auto' : 'pointer')
                        );
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendSeriesGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(chart, legendBounds, textOptions, legendGroup);
            } else {
                this.totalPages = 1;
            }
        }
        appendChildElement((chart as Chart).enableCanvas, chart.svgObject, legendGroup, redraw);
    }
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    private findFirstLegendPosition(legendCollection: LegendOptions[]): number {
        let count: number = 0;
        for ( let legend of legendCollection) {
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    }
    /**
     * To get the legend title text width and height.
     * @param legend
     * @param legendBounds
     */
    protected calculateLegendTitle(legend: LegendSettingsModel, legendBounds: Rect): void {
        if (legend.title) {
            this.isTop = legend.titlePosition === 'Top';
            let padding: number = legend.titleStyle.textOverflow === 'Trim' ? 2 * legend.padding : 0;
            if (this.isTop || this.isVertical) {
                this.legendTitleCollections = getTitle(legend.title, legend.titleStyle, (legendBounds.width - padding));
            } else {
                this.legendTitleCollections[0] = textTrim(legend.maximumTitleWidth, legend.title, legend.titleStyle);
            }
            let text: string = this.isTop ? legend.title : this.legendTitleCollections[0];
            this.legendTitleSize = measureText(text, legend.titleStyle);
            this.legendTitleSize.height *= this.legendTitleCollections.length;
        } else {
            this.legendTitleSize = new Size(0, 0);
        }
    }
    /**
     * Render the legend title
     * @param chart 
     * @param legend 
     * @param legendBounds 
     * @param legendGroup 
     */
    private renderLegendTitle(
        chart: Chart | AccumulationChart | BulletChart, legend: LegendSettingsModel, legendBounds: Rect, legendGroup: Element
    ): void {
        let padding: number = legend.padding;
        this.isTop = legend.titlePosition === 'Top';
        let alignment: Alignment = legend.titleStyle.textAlignment;
        let anchor: string = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        anchor = this.isTop || this.isVertical ? anchor : '';
        let x: number = titlePositionX(legendBounds, legend.titleStyle);
        x = alignment === 'Near' ? (x + padding) : alignment === 'Far' ? (x - padding) : x;
        x = (this.isTop || this.isVertical) ? x : ((legendBounds.x) + (legend.titlePosition === 'Left' ? 5 :
            (legendBounds.width - this.legendTitleSize.width - 5)));
        let topPadding: number = (legendBounds.height / 2) + (this.legendTitleSize.height / 4);
        let y: number = legendBounds.y + (!this.isTop && !this.isVertical ? topPadding :
            (this.legendTitleSize.height / this.legendTitleCollections.length));
        let legendTitleTextOptions: TextOption = new TextOption(this.legendID + '_title', x, y, anchor, this.legendTitleCollections);
        textElement(chart.renderer, legendTitleTextOptions, legend.titleStyle, legend.titleStyle.color, legendGroup);
    }
    /**
     * To create legend rendering elements for chart and accumulation chart
     * @param chart 
     * @param legendBounds 
     * @param legendGroup 
     * @param legend 
     * @param id 
     * @param redraw 
     */
    private createLegendElements(
    chart: Chart | AccumulationChart | BulletChart, legendBounds: Rect, legendGroup: Element, legend: LegendSettingsModel,
    id: string, redraw?: boolean
    ): Element {
        let padding: number = legend.padding;
        let options: RectOption = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        legendGroup ? legendGroup.appendChild(chart.renderer.drawRectangle(options)) : chart.renderer.drawRectangle(options);
        if (legend.title) {
            this.renderLegendTitle(chart, legend, legendBounds, legendGroup);
        }
        let legendItemsGroup: Element = chart.renderer.createGroup({ id: id + '_collections' });
        let isCanvas: boolean = (chart as Chart).enableCanvas;
        if (!isCanvas) {
        legendGroup.appendChild(legendItemsGroup);
        }
        this.legendTranslateGroup = chart.renderer.createGroup({ id: id + '_translate_g' });
        if (!isCanvas) {
        legendItemsGroup.appendChild(this.legendTranslateGroup);
        }
        let clippath: Element = chart.renderer.createClipPath({ id: id + '_clipPath' });
        options.y += padding + (this.isTop ? this.legendTitleSize.height : 0);
        options.id += '_clipPath_rect';
        options.width = (
            (!this.isChartControl && chart.getModuleName() !== 'bulletChart'
            ) && this.isVertical) ? this.maxWidth - padding + legend.containerPadding.left + legend.containerPadding.right
            : legendBounds.width;
        if (!isCanvas) {
            this.clipRect = chart.renderer.drawRectangle(options);
            clippath.appendChild(this.clipRect);
        } else {
            this.pagingClipRect = options;
        }
        appendChildElement(isCanvas, chart.svgObject, clippath, redraw);
        if (!isCanvas) {
        legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
        return this.legendTranslateGroup;
    }
    /**
     * To render legend symbols for chart and accumulation chart
     */
    protected renderSymbol(legendOption: LegendOptions, group: Element, i: number): void {
        let borderColor: string;
        let control: BulletChart = this.isBulletChartControl ? this.chart as BulletChart : null;
        let symbolColor: string = legendOption.visible ? legendOption.fill : '#D3D3D3';
        let shape: string = (legendOption.shape === 'SeriesType') ? legendOption.type : legendOption.shape;
        shape = shape === 'Scatter' ? legendOption.markerShape : shape;
        let isStrokeWidth: boolean = (this.chart.getModuleName() === 'chart' && (legendOption.shape === 'SeriesType') &&
            (legendOption.type.toLowerCase().indexOf('line') > -1) && (legendOption.type.toLowerCase().indexOf('area') === -1));
        let strokewidth: number = isStrokeWidth ? (this.chart as Chart).visibleSeries[i].width :
        (this.isBulletChartControl && legendOption.shape === 'Multiply') ? 4 : 1;
        let isCustomBorder: boolean = this.chart.getModuleName() === 'chart' &&
            (legendOption.type === 'Scatter' || legendOption.type === 'Bubble');
        if (isCustomBorder && i < (this.chart as Chart).visibleSeries.length) {
            let seriesBorder: BorderModel = (this.chart as Chart).visibleSeries[i].border;
            borderColor = seriesBorder.color ? seriesBorder.color : symbolColor;
            strokewidth = seriesBorder.width ? seriesBorder.width : 1;
        }
        let symbolOption: PathOption = new PathOption(
            this.legendID + this.generateId(legendOption, '_shape_', i), symbolColor, strokewidth,
            (isCustomBorder ? borderColor : symbolColor), 1, '', '');
        let regionPadding: number;
        let isCanvas: boolean = (this.chart as Chart).enableCanvas;
        if (!isCanvas) {
            group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '',
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line:align
                symbolOption, this.accessbilityText , this.chart.renderer, null,
                this.isBulletChartControl, control
            ));
        } else {
            regionPadding = -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber);
            drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '',
                // tslint:disable-next-line:align
                symbolOption, this.accessbilityText, this.chart.renderer,
                this.currentPageNumber ? new Rect(0, regionPadding, 0, 0) : null, this.isBulletChartControl, control);
            this.legendRegions.push({
                rect: new Rect(legendOption.location.x, legendOption.location.y,
                    // tslint:disable-next-line:align
                    this.legend.shapeWidth, this.legend.shapeHeight + regionPadding), index: i
            });
        }
        if (shape === 'Line' && legendOption.markerVisibility && legendOption.markerShape !== 'Image' ||
            legendOption.type === <AccumulationType>'Doughnut') {
            symbolOption.id = this.legendID + this.generateId(legendOption, '_shape_marker_', i);
            shape = legendOption.type === <AccumulationType>'Doughnut' ? 'Circle' : legendOption.markerShape;
            symbolOption.fill = legendOption.type === <AccumulationType>'Doughnut' ? '#FFFFFF' : symbolOption.fill;
            if (!isCanvas) {
                // tslint:disable-next-line:max-line-length
                group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                    // tslint:disable-next-line:align
                    '', symbolOption, this.accessbilityText, null, null,
                    this.isBulletChartControl, control));
            } else {
                drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                    // tslint:disable-next-line:align
                    '', symbolOption, this.accessbilityText, this.chart.renderer,
                    this.currentPageNumber ?
                        new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) : null,
                    this.isBulletChartControl, control);

            }
        }
    }
    /**
     * To render legend text for chart and accumulation chart
     */
    protected renderText(
        chart: Chart | AccumulationChart | BulletChart, legendOption: LegendOptions, group: Element, textOptions: TextOption,
        i: number): void {
        let legend: LegendSettingsModel = chart.legendSettings;
        let hiddenColor: string = '#D3D3D3';
        textOptions.id = this.legendID + this.generateId(legendOption, '_text_', i);
        let fontcolor: string = legendOption.visible ? legend.textStyle.color || chart.themeStyle.legendLabel : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        let isCanvas: boolean = (this.chart as Chart).enableCanvas;
        let element : Element =
        textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false,
                    null, this.currentPageNumber &&  isCanvas ?
                    new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber ), 0, 0) : null);
        if (element) {
            element.setAttribute('aria-label', legend.description || this.accessbilityText);
        }
        if (isCanvas) {
            let textSize: Size = measureText(textOptions.text, legend.textStyle);
            this.legendRegions[i].rect.y = textOptions.y < this.legendRegions[i].rect.y ? textOptions.y : this.legendRegions[i].rect.y;
            this.legendRegions[i].rect.width += textSize.width;
            this.legendRegions[i].rect.height = textSize.height;
            this.legendRegions[i].rect.y -= textSize.height * 0.5;
        }
    }
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    // tslint:disable-next-line:max-func-body-length
    private renderPagingElements(
        chart: Chart | AccumulationChart | BulletChart, bounds: Rect, textOption: TextOption, legendGroup: Element): void {
        let paginggroup: Element = chart.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        let pageTextElement: Element;
        let isCanvas: boolean = (chart as Chart).enableCanvas;
        let titleHeight: number = this.isBulletChartControl ? 0 : this.legendTitleSize.height;
        this.backwardArrowOpacity = this.currentPage !== 1 ? 1 : 0;
        this.forwardArrowOpacity = this.currentPage === this.totalPages ? 0 : 1;
        if (!isCanvas) {
        legendGroup.appendChild(paginggroup);
        }
        let grayColor: string = '#545454';
        let legend: LegendSettingsModel = chart.legendSettings; // to solve parameter lint error, legend declaration is here
        let padding: number = 8; // const padding for paging elements
        if (this.isChartControl || this.isBulletChartControl || !this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        } else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        let symbolOption: PathOption = new PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        let iconSize: number = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        let rowCount: number = !legend.enablePages && this.isPaging && !this.isVertical && !this.isBulletChartControl ? 1 :
            (this.rowCount - 1);
        this.clipPathHeight = rowCount * (this.maxItemHeight + legend.padding);
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
        let titleWidth: number = this.isTitle && legend.titlePosition === 'Left' ? this.legendTitleSize.width : 0;
        let x: number = (bounds.x + iconSize / 2);
        let y: number = bounds.y + this.clipPathHeight + ((titleHeight + bounds.height - this.clipPathHeight) / 2);
        if (this.isPaging && !legend.enablePages && !this.isVertical && !this.isBulletChartControl) {
            x = (bounds.x + this.fivePixel + this.pageButtonSize + titleWidth);
            y = legend.title && this.isTop ? (bounds.y + padding + titleHeight + (iconSize / 1) + 0.5) :
                (bounds.y + padding + iconSize + 0.5);
        }
        let size: Size = measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + (iconSize / 2) + padding + titleHeight;
                symbolOption.opacity = this.backwardArrowOpacity;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'UpArrow', new Size(iconSize, iconSize), '', symbolOption, 'UpArrow'));
            } else {
                symbolOption.opacity = this.isBulletChartControl ? symbolOption.opacity :
                    (legend.enablePages ? 1 : this.backwardArrowOpacity);
                paginggroup.appendChild(
                    drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow')
                );
            }
        } else {
            drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow', this.chart.renderer,
                       new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));

        }
        this.pagingRegions.push(new Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5,
                                         y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        if (isCanvas && this.totalNoOfPages) {
            textOption.text = this.currentPageNumber  + '/' + this.totalNoOfPages;
        }
        if (legend.enablePages || this.isBulletChartControl) {
            pageTextElement = textElement(
                chart.renderer, textOption, legend.textStyle, legend.textStyle.color, paginggroup,
                false, false, false, false, null,
                new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0)
            );
        }
        // Page right arrow rendering calculation started here
        x = textOption.x + padding + (iconSize / 2) + size.width;
        if (this.isPaging && !legend.enablePages && !this.isVertical) {
            x = (bounds.x + bounds.width - this.fivePixel - this.pageButtonSize - (legend.title && legend.titlePosition === 'Right' ?
                this.legendTitleSize.width + this.fivePixel : 0));
        }
        symbolOption.id = this.legendID + '_pagedown';
        symbolOption.opacity = !legend.enablePages ? this.forwardArrowOpacity : 1;
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + bounds.height - (iconSize / 2) - padding;
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
                       new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5),
                                         y - iconSize * 0.5, iconSize, iconSize));
        if (!isCanvas && (legend.enablePages || this.isBulletChartControl)) {
        //placing the navigation buttons and page numbering in legend right corner
        paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
        padding + size.width)) + ', ' + 0 + ')');
        } else {
            if (this.currentPageNumber === 1 && this.calTotalPage && (legend.enablePages || this.isBulletChartControl)) {
                this.totalNoOfPages = this.totalPages;
                this.calTotalPage = false;
            }
            if (!legend.enablePages && !this.isBulletChartControl) { // For new legend page navigation
                this.translatePage(null, this.currentPage - 1, this.currentPage, legend);
            }
        }
        if (legend.enablePages || this.isBulletChartControl) {
            this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage, legend);
        }
    }
    /**
     * To translate legend pages for chart and accumulation chart
     */
    protected translatePage(pagingText: Element, page: number, pageNumber: number, legend?: LegendSettingsModel): number {
        let size: number = (this.clipPathHeight) * page;
        let translate: string = 'translate(0,-' + size + ')';
        if (!this.isChartControl && !this.isBulletChartControl && this.isVertical) {
            let pageLength: number = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
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
     */
    protected changePage(event: Event, pageUp: boolean): void {
        let legend: LegendSettingsModel = (this.chart as Chart).legendSettings;
        let backwardArrow: Element = document.getElementById(this.legendID + '_pageup');
        let forwardArrow: Element = document.getElementById(this.legendID + '_pagedown');
        let pageText: Element = (legend.enablePages || this.isBulletChartControl) ?
            document.getElementById(this.legendID + '_pagenumber') : null;
        let page: number = (legend.enablePages || this.isBulletChartControl) ? parseInt(pageText.textContent.split('/')[0], 10) :
            this.currentPage;
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1), legend);
        } else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1), legend);
        }
        if (this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            this.currentPage === this.totalPages ? this.hideArrow(forwardArrow) : this.showArrow(forwardArrow);
            this.currentPage === 1 ? this.hideArrow(backwardArrow) : this.showArrow(backwardArrow);
        }
    }
    /**
     * To hide the backward and forward arrow
     * @param arrowElement
     */
    private hideArrow(arrowElement: Element): void {
        arrowElement.setAttribute('opacity', '0');
    }
    /**
     * To show the  backward and forward arrow
     * @param arrowElement
     */
    private showArrow(arrowElement: Element): void {
        arrowElement.setAttribute('opacity', '1');
    }
    /**
     * To find legend elements id based on chart or accumulation chart
     * @private
     */
    public generateId(option: LegendOptions, prefix: string, count: number, ): string {
        if (this.isChartControl) {
           return prefix + count;
        } else {
           return prefix + option.pointIndex;
        }
    }

    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    public move(event: Event): void {
        let x: number = this.chart.mouseX;
        let y: number = this.chart.mouseY;
        if ((<HTMLElement>event.target).textContent.indexOf('...') > -1) {
            let targetId: string[] = (<HTMLElement>event.target).id.split(this.legendID + '_text_');
            if (targetId.length === 2) {
                let index: number = parseInt(targetId[1], 10);
                let element: HTMLElement = this.chart.element;
                if (!isNaN(index)) {
                    if (this.chart.isTouch) {
                        removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    }
                    if (this.isChartControl) {
                        showTooltip(
                            (<Chart>this.chart).series[index].name, x, y, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip',
                            getElement(this.chart.element.id + '_Secondary_Element')
                        );
                    } else {
                        showTooltip(
                            (<AccumulationChart>this.chart).visibleSeries[0].points[index].x.toString(), x + 10, y + 10,
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
            this.clearTooltip = setTimeout(() => { removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
        }
    }
}
/**
 * Class for legend options
 * @private
 */
export class LegendOptions {
    public render: boolean;
    public text: string;
    public fill: string;
    public shape: LegendShape;
    public visible: boolean;
    public type: ChartSeriesType | AccumulationType;
    public textSize: Size;
    public location: ChartLocation = { x: 0, y: 0 };
    public pointIndex?: number;
    public seriesIndex?: number;
    public markerShape?: ChartShape;
    public markerVisibility?: boolean;
    constructor(
        text: string, fill: string, shape: LegendShape, visible: boolean, type: ChartSeriesType | AccumulationType,
        markerShape?: ChartShape, markerVisibility?: boolean, pointIndex?: number, seriesIndex?: number
        ) {
        this.text =  text;
        this.fill = fill;
        this.shape = shape;
        this.visible =  visible;
        this.type = type;
        this.markerVisibility = markerVisibility;
        this.markerShape = markerShape;
        this.pointIndex = pointIndex;
        this.seriesIndex = seriesIndex;
    }
}