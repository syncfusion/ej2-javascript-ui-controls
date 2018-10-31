/**
 * AccumulationChart legend
 */
import { extend, isNullOrUndefined, Animation, AnimationOptions, isVisible } from '@syncfusion/ej2-base';
import { AccumulationSeries, AccPoints, pointByIndex } from '../model/acc-base';
import { MarginModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { AccumulationType } from '../model/enum';
import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { Rect, Size, measureText, ChartLocation, textTrim, getElement} from '../../common/utils/helper';
import { IAccLegendRenderEventArgs } from '../../common/model/interface';
import { Indexes } from '../../common/model/base';

/**
 * AccumulationLegend module used to render `Legend` for Accumulation chart.
 */
export class AccumulationLegend extends BaseLegend {
    public titleRect: Rect;
    private totalRowCount: number;
    private maxColumnWidth: number;
    /**
     * Constructor for Accumulation Legend.
     * @param chart 
     */
    constructor(chart: AccumulationChart) {
        super(chart);
        this.library = this;
        this.titleRect = new Rect(0, chart.margin.top, 0, 0);
    }
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    public getLegendOptions(chart: AccumulationChart, series: AccumulationSeries[]): void {
        this.legendCollections = [];
        for (let i: number = 0; i < 1; i++) {
            let seriesType: AccumulationType = series[i].type;
            if (seriesType === 'Pie' || seriesType === <AccumulationType>'Doughnut') {
                seriesType = (series[i].innerRadius !== '0' && series[i].innerRadius !== '0%') ?
                    <AccumulationType>'Doughnut' : 'Pie';
            }
            for (let point of series[i].points) {
                if (!isNullOrUndefined(point.x) && !isNullOrUndefined(point.y)) {
                    this.legendCollections.push(new LegendOptions(
                        point.x.toString(), point.color, series[i].legendShape, point.visible, seriesType, null, null,
                        point.index, series[i].index
                    ));
                }
            }
        }
    }
    /**
     * To find legend bounds for accumulation chart.
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        let extraWidth: number = 0;
        let extraHeight: number = 0;
        let padding: number = legend.padding;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        let shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let shapeWidth: number = legend.shapeWidth;
        let rowWidth: number = 0;
        let rowCount: number = 0;
        let columnWidth: number[] = [];
        let columnHeight: number = 0;
        let legendWidth: number = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let legendEventArgs: IAccLegendRenderEventArgs;
        let render: boolean = false;
        for (let legendOption of this.legendCollections) {
            legendEventArgs = { fill: legendOption.fill, text : legendOption.text, shape : legendOption.shape,
                                name: 'legendRender', cancel: false };
            this.chart.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                if (this.isVertical) {
                    ++rowCount;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    if ((rowCount * (this.maxItemHeight + padding)) + padding > legendBounds.height) {
                        columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding);
                        rowWidth = rowWidth + maximumWidth;
                        columnWidth.push(maximumWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        maximumWidth = 0;
                        rowCount = 1;
                    }
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                } else {
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    }
                }
            }
        }
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            if (columnWidth[columnWidth.length - 1] !== maximumWidth) {
                columnWidth.push(maximumWidth);
            }
        } else {
            this.isPaging = legendBounds.height < columnHeight;
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        }
        this.maxColumns = 0; // initialization for max columns
        let width: number = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
        Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /**
     * To find maximum column size for legend
     */
    private getMaxColumn(columns: number[], width: number, padding: number, rowWidth: number): number {
        let maxPageColumn: number = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (let column of columns) {
            maxPageColumn += this.maxColumnWidth;
            this.maxColumns++;
            if (maxPageColumn + padding > width) {
                maxPageColumn -= this.maxColumnWidth;
                this.maxColumns--;
                break;
            }
        }
        this.isPaging = (maxPageColumn < rowWidth) && (this.totalPages > 1);
        if (maxPageColumn === padding) {
            maxPageColumn = width;
        }
        this.maxColumns = Math.max(1, this.maxColumns);
        this.maxWidth = maxPageColumn;
        return maxPageColumn;
    }
    /**
     * To find available width from legend x position.
     */
    private getAvailWidth(tx: number, width: number, legendX: number): number {
        if (this.isVertical) {
            width = this.maxWidth;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    }
    /**
     * To find legend rendering locations from legend options.
     * @private
     */
    public getRenderPoint(legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
                          rect: Rect, count: number, firstLegend: number): void {
        let padding: number = this.legend.padding;
        if (this.isVertical) {
            if (count === firstLegend || (prevLegend.location.y + (this.maxItemHeight * 1.5) + (padding * 2) > rect.y + rect.height )) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : this.maxColumnWidth);
                legendOption.location.y = start.y;
                this.pageXCollections.push(legendOption.location.x - (this.legend.shapeWidth / 2) - padding);
                this.totalPages++;
            } else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + this.maxItemHeight + padding;
            }
        } else {
            let previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
            if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2)) {
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.maxItemHeight + padding;
                legendOption.location.x = start.x;
            } else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
            this.totalPages = this.totalRowCount;
        }
        let availablewidth: number = this.getAvailWidth(legendOption.location.x, this.legendBounds.width, this.legendBounds.x);
        legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /**
     * finding the smart legend place according to positions.
     * @return {void}
     * @private
     */
    public getSmartLegendLocation(labelBound: Rect, legendBound: Rect, margin: MarginModel): void {
        let space: number;
        switch (this.position) {
            case 'Left':
                space = ((labelBound.x - legendBound.width) - margin.left) / 2;
                legendBound.x = (labelBound.x - legendBound.width) < margin.left ? legendBound.x :
                (labelBound.x - legendBound.width) - space;
            break;
            case 'Right':
                space = ((this.chart.availableSize.width - margin.right) - (labelBound.x + labelBound.width + legendBound.width)) / 2;
                legendBound.x = (labelBound.x + labelBound.width + legendBound.width) > (this.chart.availableSize.width - margin.right) ?
                legendBound.x : (labelBound.x + labelBound.width + space);
            break;
            case 'Top':
                this.getTitleRect(this.chart as AccumulationChart);
                space = ((labelBound.y - legendBound.height) - (this.titleRect.y + this.titleRect.height)) / 2;
                legendBound.y = (labelBound.y - legendBound.height) < margin.top ? legendBound.y :
                (labelBound.y - legendBound.height) - space;
            break;
            case 'Bottom':
                space = ((this.chart.availableSize.height - margin.bottom) - (labelBound.y + labelBound.height + legendBound.height)) / 2;
                legendBound.y = labelBound.y + labelBound.height + legendBound.height > (this.chart.availableSize.height - margin.bottom) ?
                legendBound.y : (labelBound.y + labelBound.height) + space;
            break;
        }
    }
    /**
     * To get title rect.
     */
    private getTitleRect(accumulation: AccumulationChart): void {
        if (!accumulation.title) {
            return null;
        }
        let titleSize: Size = measureText(accumulation.title, accumulation.titleStyle);
        this.titleRect = new Rect(
            accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
    }
    /**
     * To get legend by index
     */
    private legendByIndex(index: number, legendCollections: LegendOptions[]): LegendOptions {
        for (let legend of legendCollections) {
            if (legend.pointIndex === index) {
                return legend;
            }
        }
        return null;
    }
    /**
     * To show or hide the legend on clicking the legend. 
     * @return {void}
     */
    public click(event: Event): void {
        let targetId: string = (<HTMLElement>event.target).id;
        let chart: AccumulationChart = this.chart as AccumulationChart;
        let legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_',
        this.legendID + '_shape_marker_'];
        let selectedDataIndexes: Indexes[] = [];
        if ((<AccumulationChart>this.chart).accumulationSelectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], (<AccumulationChart>this.chart).accumulationSelectionModule.selectedDataIndexes,
                                                    null, true);
        }
        this.chart.animateSeries = false;
        for (let id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                let pointIndex: number = parseInt(targetId.split(id)[1], 10);
                if (this.chart.legendSettings.toggleVisibility) {
                    let currentSeries: AccumulationSeries = (<AccumulationChart>this.chart).visibleSeries[0];
                    let point: AccPoints = pointByIndex(pointIndex, currentSeries.points);
                    let legendOption: LegendOptions = this.legendByIndex(pointIndex, this.legendCollections);
                    point.visible = !point.visible;
                    legendOption.visible = point.visible;
                    currentSeries.sumOfPoints += point.visible ? point.y : -point.y;
                    chart.redraw = chart.enableAnimation;
                    this.sliceVisibility(pointIndex, point.visible);
                    chart.removeSvg();
                    (<AccumulationChart>this.chart).refreshPoints(currentSeries.points);
                    (<AccumulationChart>this.chart).renderElements();
                } else if ((<AccumulationChart>this.chart).accumulationSelectionModule) {
                    (<AccumulationChart>this.chart).accumulationSelectionModule.legendSelection(
                        <AccumulationChart>this.chart, 0, pointIndex);
                }
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        chart.redraw = false;
    }

    /**
     * To translate the point elements by index and position
     */
    private sliceVisibility(index: number, isVisible: boolean): void {
        let sliceId: string = this.chart.element.id + '_Series_0_Point_';
        if ((this.chart.visibleSeries[0] as AccumulationSeries).dataLabel.visible) {
            sliceId = this.chart.element.id + '_datalabel_Series_0_';
            this.sliceAnimate(getElement(sliceId + 'g_' + index), isVisible);
        }
    }

    /**
     * Slice animation
     * @param element 
     * @param name 
     * @param isVisible 
     */
    private sliceAnimate(element: Element, isVisible: boolean): void {
        if (!element) {
            return null;
        }
        new Animation({}).animate(<HTMLElement>element, {
            duration: 300,
            delay: 0,
            name: isVisible ? 'FadeIn' : 'FadeOut',
            end: (args: AnimationOptions): void => {
                args.element.style.visibility = isVisible ? 'visible' : 'hidden';
            },
        });
    }
    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'AccumulationLegend';
    }

    /**
     * To destroy the Legend. 
     * @return {void}
     * @private
     */
    public destroy(chart: AccumulationChart): void {
        /**
         * Destroy method calling here
         */
    }
}