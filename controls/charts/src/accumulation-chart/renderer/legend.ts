/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * AccumulationChart legend
 */
import { extend, isNullOrUndefined, Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { AccumulationSeries, AccPoints, pointByIndex } from '../model/acc-base';
import { MarginModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { AccumulationType } from '../model/enum';
import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { ChartLocation, textTrim, getElement, blazorTemplatesReset} from '../../common/utils/helper';
import { IAccLegendRenderEventArgs } from '../../accumulation-chart/model/pie-interface';
import { Indexes } from '../../common/model/base';
import { LegendTitlePosition } from '../../common/utils/enum';

/**
 * AccumulationLegend module used to render `Legend` for Accumulation chart.
 */
export class AccumulationLegend extends BaseLegend {
    public titleRect: Rect;
    private totalRowCount: number;
    private maxColumnWidth: number;
    /**
     * Constructor for Accumulation Legend.
     *
     * @param {AccumulationChart} chart Get a chart as a parameter.
     */
    constructor(chart: AccumulationChart) {
        super(chart);
        this.library = this;
        this.titleRect = new Rect(0, chart.margin.top, 0, 0);
    }
    /**
     * Get the legend options.
     *
     * @returns {void} Legend options.
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
            for (const point of series[i].points) {
                if (!isNullOrUndefined(point.x) && !isNullOrUndefined(point.y)) {
                    this.legendCollections.push(new LegendOptions(
                        point.x.toString(), point.color, series[i].legendShape, point.visible, seriesType, point.legendImageUrl, null, null,
                        point.index, series[i].index
                    ));
                }
            }
        }
    }
    /**
     * To find legend bounds for accumulation chart.
     *
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        let extraWidth: number = 0;
        let extraHeight: number = 0;
        const padding: number = legend.padding;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let titlePlusArrowSpace: number = 0;
        const arrowWidth: number = this.arrowWidth;
        const arrowHeight: number = legend.enablePages ? 0 : this.arrowHeight;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        const shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        const shapeWidth: number = legend.shapeWidth;
        let rowWidth: number = 0;
        let rowCount: number = 0;
        const columnWidth: number[] = [];
        let columnHeight: number = 0;
        let legendWidth: number = 0;
        let titleHeight: number = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let legendEventArgs: IAccLegendRenderEventArgs;
        let render: boolean = false;
        for (const legendOption of this.legendCollections) {
            legendEventArgs = { fill: legendOption.fill, text : legendOption.text, shape : legendOption.shape,
                name: 'legendRender', cancel: false };
            this.chart.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = ((legendEventArgs.text.indexOf('&') > -1) ?
                this.convertHtmlEntities(legendEventArgs.text) : legendEventArgs.text);
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                if (this.isVertical) {
                    ++rowCount;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + this.legendTitleSize.height + arrowHeight;
                    if ((rowCount * (this.maxItemHeight + padding)) + padding + arrowHeight > legendBounds.height) {
                        columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding + arrowHeight);
                        rowWidth = rowWidth + maximumWidth;
                        columnWidth.push(maximumWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        maximumWidth = 0;
                        rowCount = 1;
                    }
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                } else {
                    if (!legend.enablePages) { // For new legend navigation support
                        titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                        titlePlusArrowSpace += arrowWidth;
                    }
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + this.legendTitleSize.height;
                    }
                }
            }
        }
        titleHeight = titlePosition === 'Top' ? this.legendTitleSize.height : 0;
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding + arrowHeight);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            if (columnWidth[columnWidth.length - 1] !== maximumWidth) {
                columnWidth.push(maximumWidth);
            }
        } else {
            this.isPaging = legendBounds.height < columnHeight;
            columnHeight = !legend.enablePages && this.isPaging ? (this.maxItemHeight + padding) + padding + titleHeight : columnHeight;
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleHeight);
            if (!this.isPaging) { // For title left and right position
                rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
            }
        }
        this.maxColumns = 0; // initialization for max columns
        const width: number = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
            Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /**
     * To find html entities value for legend
     *
     * @returns {string} converts the entities to normal string.
     */
    public convertHtmlEntities(legendText: string): string {
        let text: string = (legendText).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&nbsp;', ' ').replace('&cent;', '¢').replace('&pound;', '£').replace('&yen;', '¥').replace('&euro;', '€').replace('&copy;', '©').replace('&reg;', '®');
        text = (text).replace('&#38;', '&').replace('&#60;', '<').replace('&#62;', '>').replace('&#34;', '"').replace('&#160;', ' ').
            replace('&#162;', '¢').replace('&#163;', '£').replace('&#165;', '¥').replace('&#8364;', '€').replace('&#169;', '©').replace('&#174;', '®');
        return text;
    }
    /**
     * To find maximum column size for legend
     *
     * @returns {number} Get a maximum columns.
     */
    private getMaxColumn(columns: number[], width: number, padding: number, rowWidth: number): number {
        let maxPageColumn: number = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (const column of columns) {
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
     *
     * @returns {number} Get a available width.
     */
    private getAvailWidth(tx: number, width: number): number {
        if (this.isVertical) {
            width = this.maxWidth;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    }
    /**
     * To find legend rendering locations from legend options.
     *
     * @private
     */
    public getRenderPoint(legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
                          rect: Rect, count: number, firstLegend: number): void {
        const padding: number = this.legend.padding;
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
            const previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
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
        const availablewidth: number = this.getAvailWidth(legendOption.location.x, this.legendBounds.width);
        legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /**
     * finding the smart legend place according to positions.
     *
     * @returns {void}
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
     *
     * @returns {void} Get a title rect.
     */
    private getTitleRect(accumulation: AccumulationChart): void {
        if (!accumulation.title) {
            return null;
        }
        const titleSize: Size = measureText(accumulation.title, accumulation.titleStyle);
        this.titleRect = new Rect(
            accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
    }
    /**
     * To get legend by index
     *
     * @returns {LegendOptions} Return legend index.
     */
    private legendByIndex(index: number, legendCollections: LegendOptions[]): LegendOptions {
        for (const legend of legendCollections) {
            if (legend.pointIndex === index) {
                return legend;
            }
        }
        return null;
    }
    /**
     * To show or hide the legend on clicking the legend.
     *
     * @returns {void}
     */
    public click(event: Event): void {
        const targetId: string = (<HTMLElement>event.target).id;
        const chart: AccumulationChart = this.chart as AccumulationChart;
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_', this.legendID + '_shape_marker_'];
        if ((<AccumulationChart>this.chart).accumulationSelectionModule) {
            const selectedDataIndexes : Indexes[] =
                <Indexes[]>extend([], (<AccumulationChart>this.chart).accumulationSelectionModule.selectedDataIndexes, null, true);
        }
        this.chart.animateSeries = false;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                const pointIndex: number = parseInt(targetId.split(id)[1], 10);
                if ((this.chart as AccumulationChart).legendSettings.toggleVisibility && !isNaN(pointIndex)) {
                    const currentSeries: AccumulationSeries = (<AccumulationChart>this.chart).visibleSeries[0];
                    const point: AccPoints = pointByIndex(pointIndex, currentSeries.points);
                    const legendOption: LegendOptions = this.legendByIndex(pointIndex, this.legendCollections);
                    point.visible = !point.visible;
                    legendOption.visible = point.visible;
                    currentSeries.sumOfPoints += point.visible ? point.y : -point.y;
                    chart.redraw = chart.enableAnimation;
                    this.sliceVisibility(pointIndex, point.visible);
                    chart.removeSvg();
                    //To remove the blazor templates
                    blazorTemplatesReset(chart);
                    (<AccumulationChart>this.chart).refreshPoints(currentSeries.points);
                    (<AccumulationChart>this.chart).renderElements();
                } else if ((<AccumulationChart>this.chart).accumulationSelectionModule && !isNaN(pointIndex)) {
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
        if (((this.chart as AccumulationChart).visibleSeries[0] as AccumulationSeries).dataLabel.visible) {
            sliceId = this.chart.element.id + '_datalabel_Series_0_';
            this.sliceAnimate(getElement(sliceId + 'g_' + index), isVisible);
        }
    }

    /**
     * Slice animation
     *
     * @param {Element} element slice element.
     * @param {boolean} isVisible boolean value of slice.
     * @returns {void} slice animation method.
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
            }
        });
    }
    /**
     * Get module name
     *
     * @returns {string} Return module name.
     */
    protected getModuleName(): string {
        return 'AccumulationLegend';
    }

    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }
}
