import { ChartLocation, getUnicodeText, textTrim, withInBounds } from "../../common/utils/helper";
import { ILegendRegions } from '../../common/model/interface';
import { BaseLegend, LegendOptions, Location } from "../../common/legend/legend";
import { ChartDrawType, ChartSeriesType, LegendMode, LegendPosition } from "../../chart/utils/enum";
import { Alignment, LegendTitlePosition } from "../../common/utils/enum";
import { Size, measureText, Rect } from '@syncfusion/ej2-svg-base';
import { Series } from "../../chart/series/chart-series";
import { legendClick, legendRender, regSub, regSup } from "../../common/model/constants";
import { IStockLegendClickEventArgs, IStockLegendRenderEventArgs, StockChartBorder, StockChartFont, StockMargin } from "../model/base";
import { Browser } from "@syncfusion/ej2-base";
import { StockChart } from "../../stock-chart/index";
import { Axis } from '../../chart/axis/axis';
import { Property, Complex, ChildProperty} from '@syncfusion/ej2-base';
import { Theme } from "../../common/model/theme";
import { ContainerPadding } from '../../common/model/base';
import { ContainerPaddingModel } from '../../common/model/base-model';
import { StockChartLegendSettingsModel } from './legend-model';
import { StockChartFontModel, StockChartBorderModel, StockMarginModel } from '../model/base-model';
import { LocationModel } from "../../common";

/**
 * Configures the legends in charts.
 */
 export class StockChartLegendSettings extends ChildProperty<StockChartLegendSettings> {

    /**
     * If set to true, legend will be visible.
     *
     * @default false
     */

    @Property(false)
    public visible: boolean;

    /**
     * The height of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public height: string;

    /**
     * The width of the legend in pixels.
     *
     * @default null
     */

    @Property(null)
    public width: string;

    /**
     * Specifies the location of the legend, relative to the Stock chart.
     * If x is 20, legend moves by 20 pixels to the right of the Stock chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='StockChart'></div>
     * ```
     * ```typescript
     * let stockChart: StockChart = new StockChart({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * stockChart.appendTo('#StockChart');
     * ```
     */
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Position of the legend in the Stock chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the stock chart.
     * * Left: Displays the legend at the left of the stock chart.
     * * Bottom: Displays the legend at the bottom of the stock chart.
     * * Right: Displays the legend at the right of the stock chart.
     * * Custom: Displays the legend  based on the given x and y values.
     *
     * @default 'Auto'
     */

    @Property('Auto')
    public position: LegendPosition;

    /**
    * Mode of legend items
    * * Series: Legend items generated based on series count.
    * * Point: Legend items generated based on unique data points. 
    * * Range: Legend items generated based on range color mapping property. 
    * * Gradient: Single linear bar generated based on range color mapping property.
    * This property is applicable for chart component only.
    */
    @Property('Series')
    public mode: LegendMode;

    /**
     * Option to customize the padding between legend items.
     *
     * @default 8
     */

    @Property(8)
    public padding: number;

    /**
     * Legend in stock chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the stock chart.
     * * Center: Aligns the legend to the center of the stock chart.
     * * Far: Aligns the legend to the right of the stock chart.
     *
     * @default 'Center'
     */

    @Property('Center')
    public alignment: Alignment;

    /**
     * Options to customize the legend text.
     */
    @Complex<StockChartFontModel>(Theme.legendLabelFont, StockChartFont)
    public textStyle: StockChartFontModel;

    /**
     * Shape height of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeHeight: number;

    /**
     * Shape width of the legend in pixels.
     *
     * @default 10
     */

    @Property(10)
    public shapeWidth: number;

    /**
     * Options to customize the border of the legend.
     */
    @Complex<StockChartBorderModel>({}, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     *  Options to customize left, right, top and bottom margins of the stock chart.
     */

    @Complex<StockMarginModel>({left: 0, right: 0, top: 0, bottom: 0}, StockMargin)
    public margin: StockMarginModel;

    /**
     *  Options to customize left, right, top and bottom padding for legend container of the stock chart.
     */

    @Complex<ContainerPaddingModel>({ left: 0, right: 0, top: 0, bottom: 0 }, ContainerPadding)
    public containerPadding: ContainerPaddingModel;

    /**
     * Padding between the legend shape and text in stock chart.
     *
     * @default 5
     */

    @Property(5)
    public shapePadding: number;

    /**
     * The background color of the legend that accepts value in hex and rgba as a valid CSS color string in stock chart.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * Opacity of the legend in stock chart.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * If set to true, series' visibility collapses based on the legend visibility in stock chart.
     *
     * @default true
     */

    @Property(true)
    public toggleVisibility: boolean;

    /**
     * Description for legends in stock chart.
     *
     * @default null
     */

    @Property(null)
    public description: string;

    /**
     * TabIndex value for the legend in stock chart.
     *
     * @default 3
     */

    @Property(3)
    public tabIndex: number;

    /**
     * Title for legends in stock chart.
     *
     * @default null
     */

    @Property(null)
    public title: string;

    /**
     * Options to customize the legend title in stock chart.
     */
    @Complex<StockChartFontModel>(Theme.legendTitleFont, StockChartFont)
    public titleStyle: StockChartFontModel;

    /**
     * legend title position in stock chart
     *
     * @default 'Top'
     */

    @Property('Top')
    public titlePosition: LegendTitlePosition;

    /**
     * maximum width for the legend title in stock chart.
     *
     * @default 100
     */

    @Property(100)
    public maximumTitleWidth: number;

    /**
     * If set to true, legend will be visible using pages in stock chart.
     *
     * @default true
     */

    @Property(true)
    public enablePages: boolean;

    /**
     * If set to true, legend will be Reversed in stock chart.
     *
     * @default false
     */

     @Property(false)
     public isInversed: boolean;
}

/**
 * `Legend` module is used to render legend for the stockchart.
 */
export class StockLegend extends BaseLegend {

    constructor(chart: StockChart) {
        super(chart);
        this.library = this;
        this.addEventListener();
    }

    /**
     * Binding events for Stocklegend module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
    }
    /**
     * UnBinding events for Stocklegend module.
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
    }
    /**
     * To handle mosue move for Stocklegend module
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * To handle mosue end for Stocklegend module
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }

    public getLegendOptions(visibleSeriesCollection: Series[], chart: StockChart): void {
        this.legendCollections = [];
        let seriesType: ChartDrawType | ChartSeriesType;
        let fillColor: string;
        if (visibleSeriesCollection.length > 1) {
            this.legend.mode = 'Series';
        }
        for (const series of visibleSeriesCollection) {
            if (this.legend.mode === 'Series') {
                series
                if (series.category !== 'Indicator') {
                    seriesType = <ChartSeriesType>series.type;
                    fillColor = (series.pointColorMapping && series.points.length > 0) ?
                        (series.points[0].interior ? series.points[0].interior : series.interior) : series.interior;
                    this.legendCollections.push(new LegendOptions(
                        series.name, fillColor, series.legendShape, (series.category === 'TrendLine' ?
                            (this.chart as StockChart).series[series.sourceIndex].trendlines[series.index].visible : series.visible),
                        seriesType, series.legendImageUrl, series.marker.shape, series.marker.visible
                    ));
                }
            }
        }
    }
    /** @private */
    public getLegendBounds(availableSize: Size, legendBound: Rect, legend: StockChartLegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBound);
        const padding: number = legend.padding;
        this.isTitle = legend.title ? true : false;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let extraWidth: number = 0;
        let extraHeight: number = 0;
        const arrowHeight: number = this.arrowHeight;
        const arrowWidth: number = this.arrowWidth;
        const verticalArrowSpace: number = this.isVertical && !legend.enablePages ? arrowHeight : 0;
        let titleSpace: number = this.isTitle && titlePosition === 'Top' ? this.fivePixel + this.legendTitleSize.height : 0;
        titleSpace = this.isTitle && this.isVertical && titlePosition !== 'Top' ? this.fivePixel + this.legendTitleSize.height : titleSpace;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBound.height += (extraHeight);
        legendBound.width += extraWidth;
        const shapePadding: number = legend.shapePadding;
        const shapeWidth: number = legend.shapeWidth;
        let maximum_Width: number = 0;
        let row_Width: number = 0;
        let legend_Width: number = 0;
        let column_Height: number = 0;
        let row_Count: number = 0;
        let titlePlusArrowSpace: number = 0;
        let legendEventArgs: IStockLegendRenderEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let render: boolean = false;
        for (const legendOption of this.legendCollections) {
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                markerShape: legendOption.markerShape, name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            legendOption.text = legendEventArgs.text;
            legendOption.render = !legendEventArgs.cancel;
            legendOption.shape = legendEventArgs.shape;
            legendOption.fill = legendEventArgs.fill;
            legendOption.markerShape = legendEventArgs.markerShape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render) {
                render = true;
                legend_Width = shapePadding + shapeWidth + legendOption.textSize.width + padding;
                row_Width = row_Width + legend_Width;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                if (legendBound.width < (padding + row_Width + titlePlusArrowSpace) || this.isVertical) {
                    maximum_Width = Math.max(maximum_Width, (row_Width + padding + titlePlusArrowSpace - (this.isVertical ? 0 : legend_Width)));
                    if (row_Count === 0 && (legend_Width !== row_Width)) {
                        row_Count = 1;
                    }
                    row_Width = this.isVertical ? 0 : legend_Width;
                    row_Count++;
                    column_Height = (row_Count * (this.maxItemHeight + padding)) + padding + titleSpace + verticalArrowSpace;
                }
            }
        }
        column_Height = Math.max(column_Height, (this.maxItemHeight + padding) + padding + titleSpace);
        this.isPaging = legendBound.height < column_Height;
        if (this.isPaging && !legend.enablePages) {
            if (this.isVertical) {
                // eslint-disable-next-line no-self-assign
                column_Height = column_Height;
            } else {
                column_Height = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = row_Count;
        if (!this.isPaging && !this.isVertical) {
            row_Width += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
        if (render) {
            this.setBounds(Math.max((row_Width + padding), maximum_Width), column_Height, legend, legendBound);
        } else {
            this.setBounds(0, 0, legend, legendBound);
        }
    }
    /** @private */
    public getRenderPoint(
        legendOptions: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        const previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        const padding: number = this.legend.padding;
        if ((previousBound + (legendOptions.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            legendOptions.location.x = start.x;
            legendOptions.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        } else {
            legendOptions.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOptions.location.y = prevLegend.location.y;
        }
        const availwidth: number = (this.legendBounds.width + this.legendBounds.x) - (legendOptions.location.x +
            textPadding - this.legend.shapeWidth / 2);
        legendOptions.text = textTrim(+availwidth.toFixed(4), legendOptions.text, this.legend.textStyle);
    }
    /** @private */
    public legendClick(index: number, event: Event | PointerEvent): void {
        const chart: StockChart = <StockChart>this.chart;
        const seriesIndex: number = chart.legendSettings.mode === 'Series' ? index : 0;
        const targetSeries: Series = chart.visibleSeries[seriesIndex];
        const targetLegend: LegendOptions = this.legendCollections[index];
        const legendClickArgs: IStockLegendClickEventArgs = {
            legendText: targetLegend.text, legendShape: targetLegend.shape,
            chart: chart, series: targetSeries, name: legendClick, cancel: false
        };
        this.chart.trigger(legendClick, legendClickArgs);
        targetSeries.legendShape = legendClickArgs.legendShape;
        if (targetSeries.fill !== null) {
            chart.visibleSeries[index].interior = targetSeries.fill;
        }
        if (chart.legendSettings.toggleVisibility) {
            this.changeSeriesVisiblity(targetSeries, targetSeries.visible);
            targetLegend.visible = targetSeries.category === 'TrendLine' ? chart.series[targetSeries.sourceIndex].trendlines[targetSeries.index].visible :
                (targetSeries.visible);
            this.refreshLegendToggle(chart, targetSeries);
        }
    }

    private refreshLegendToggle(chart: StockChart, series: Series): void {
        const bounds: Rect = chart.stockLegendModule.legendBounds;
        chart.stockLegendModule.renderLegend(chart, chart.legendSettings, bounds);
        chart.cartesianChart.cartesianChartRefresh(chart);
    }

    private changeSeriesVisiblity(series: Series, visibility: boolean): void {
        series.visible = !visibility;
        if (this.SecondaryAxis(series.yAxis)) {
            series.yAxis.internalVisibility = series.yAxis.series.some((value: Series) => (value.visible));
        }
        if (this.SecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some((value: Series) => (value.visible));
        }
    }
    private SecondaryAxis(axis: Axis): boolean {
        return ((this.chart as StockChart).axes.indexOf(axis) > -1);
    }

    /**
     * To show the tooltip for the trimmed text in legend.
     *
     * @returns {void}
     */
    public click(event: Event | PointerEvent): void {
        if (!this.chart.legendSettings.visible) {
            return;
        }
        const pageY: number = this.chart.mouseY;
        const pageX: number = this.chart.mouseX;
        let legendRegion: ILegendRegions[] = [];
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
        this.legendID + '_shape_'];
        const targetId: string = (<HTMLElement>event.target).id;
        let seriesIndex: number;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.legendClick(seriesIndex, event);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        } else if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
        legendRegion = this.legendRegions.filter((region: ILegendRegions) => {
            return (withInBounds(pageX, (pageY + (this.isPaging ? (this.currentPageNumber - 1) * this.translatePage(false, null, 1, 2) : 0)),
                region.rect));
        });
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'StockLegend';
    }

    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }
}