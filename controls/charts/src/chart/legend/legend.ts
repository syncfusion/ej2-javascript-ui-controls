/**
 * Chart legend
 */
import { remove, Browser } from '@syncfusion/ej2-base';
import { extend} from '@syncfusion/ej2-base';
import { Series } from '../series/chart-series';
import { Indexes } from '../../common/model/base';
import { ChartSeriesType, ChartDrawType } from '../utils/enum';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart } from '../../chart';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { Rect, Size, measureText, textTrim, ChartLocation, removeElement, getElement } from '../../common/utils/helper';
import { ILegendRenderEventArgs } from '../../common/model/interface';
import { legendRender } from '../../common/model/constants';
/**
 * `Legend` module is used to render legend for the chart.
 */
export class Legend extends BaseLegend {
    constructor(chart: Chart) {
        super(chart);
        this.library = this;
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
    }
    /**
     * UnBinding events for legend module.
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
    }
    /**
     * To handle mosue move for legend module
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * To handle mosue end for legend module
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    public getLegendOptions(visibleSeriesCollection: Series[], chart : Chart): void {
        this.legendCollections = [];
        let seriesType: ChartDrawType | ChartSeriesType;
        for (let series of visibleSeriesCollection) {
            if (series.category !== 'Indicator') {
                seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                    <ChartSeriesType>series.type;
                this.legendCollections.push(new LegendOptions(
                    series.name, series.interior, series.legendShape, series.visible, seriesType, series.marker.shape, series.marker.visible
                ));
            }
        }
    }
    /** @private */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        let padding: number = legend.padding;
        let extraHeight: number = 0;
        let extraWidth: number = 0;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.height += extraHeight;
        legendBounds.width += extraWidth;
        let shapeHeight: number = legend.shapeHeight;
        let shapeWidth: number = legend.shapeWidth;
        let shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let rowWidth: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        let rowCount: number = 0;
        let legendEventArgs: ILegendRenderEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let render: boolean = false;
        for (let legendOption of this.legendCollections) {
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                markerShape: legendOption.markerShape, name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.markerShape = legendEventArgs.markerShape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                rowWidth = rowWidth + legendWidth;
                if (legendBounds.width < (padding + rowWidth) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding - (this.isVertical ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical ? 0 : legendWidth;
                    rowCount++;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        this.isPaging = legendBounds.height < columnHeight;
        this.totalPages = rowCount;
        if (render) {
            this.setBounds(Math.max((rowWidth + padding), maximumWidth), columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /** @private */
    public getRenderPoint(
        legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        let padding: number = this.legend.padding;
        let previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            legendOption.location.x = start.x;
            legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        } else {
            legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOption.location.y = prevLegend.location.y;
        }
        let availwidth: number = (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /** @private */
    public LegendClick(seriesIndex: number): void {
        let chart: Chart = <Chart>this.chart;
        let series: Series = chart.visibleSeries[seriesIndex];
        let legend: LegendOptions = this.legendCollections[seriesIndex];
        let selectedDataIndexes: Indexes[] = [];
        if (chart.selectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], chart.selectionModule.selectedDataIndexes, null, true);
        }
        if (chart.legendSettings.toggleVisibility) {
            if (!series.visible) {
                series.visible = true;
            } else {
                series.visible = false;
            }
            legend.visible = (series.visible);
            if (chart.svgObject.childNodes.length > 0 && !chart.enableAnimation) {
                while (chart.svgObject.lastChild) {
                    chart.svgObject.removeChild(chart.svgObject.lastChild);
                }
                remove(chart.svgObject);
            }
            chart.animateSeries = false;
            chart.redraw = chart.enableAnimation;
            removeElement(
                getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]
            );
            this.redrawSeriesElements(series, chart);
            chart.removeSvg();
            chart.refreshAxis();
            series.refreshAxisLabel();
            this.refreshSeries(chart.visibleSeries);
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart });
            if (selectedDataIndexes.length > 0) {
                chart.selectionModule.selectedDataIndexes = selectedDataIndexes;
                chart.selectionModule.redrawSelection(chart, chart.selectionMode);
            }
            chart.redraw = false;
        } else if (chart.selectionModule) {
            chart.selectionModule.legendSelection(chart, seriesIndex);
        }
    }
    private redrawSeriesElements(series: Series, chart: Chart): void {
        if (!chart.redraw) {
            return null;
        }
        removeElement(
            chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) +
            '_DataLabelCollections'
        );
    }
    private refreshSeries(seriesCollection: Series[]): void {
        for (let series of seriesCollection) {
            series.position = undefined;
        }
    }
    /**
     * To show the tooltip for the trimmed text in legend.
     * @return {void}
     */
    public click(event: Event): void {
        if (!this.chart.legendSettings.visible) {
            return;
        }
        let targetId: string = (<HTMLElement>event.target).id;
        let legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
        this.legendID + '_shape_'];
        let seriesIndex: number;
        for (let id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.LegendClick(seriesIndex);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'Legend';
    }

    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        this.removeEventListener();
    }

}