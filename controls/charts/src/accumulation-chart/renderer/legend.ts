/**
 * AccumulationChart legend
 */
import { Browser, isNullOrUndefined, Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { AccumulationSeries, AccPoints, pointByIndex } from '../model/acc-base';
import { MarginModel } from '../../common/model/base-model';
import { AccumulationChart } from '../accumulation';
import { AccumulationType } from '../model/enum';
import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { ChartLocation, textTrim, getElement} from '../../common/utils/helper';
import { IAccLegendRenderEventArgs, IAccLegendClickEventArgs } from '../../accumulation-chart/model/pie-interface';
import { LegendTitlePosition } from '../../common/utils/enum';
import { textWrap } from '../../common/utils/helper';
import { legendClick } from '../../common/model/constants';
/**
 * The `AccumulationLegend` module is used to render the `Legend` for the Accumulation chart.
 */
export class AccumulationLegend extends BaseLegend {
    public titleRect: Rect;
    private totalRowCount: number;
    private maxColumnWidth: number;
    public legendRenderArgFill: number[] = [];
    /**
     * Constructor for Accumulation Legend.
     *
     * @param {AccumulationChart} chart Get a chart as a parameter.
     */
    constructor(chart: AccumulationChart) {
        super(chart);
        this.library = this;
        this.titleRect = new Rect(0, chart.margin.top, 0, 0);
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     *
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on('click', this.click, this);
    }
    /**
     * UnBinding events for legend module.
     *
     * @returns {void}
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
    }
    /**
     * To handle mosue move for legend module.
     *
     * @param {MouseEvent} e - The mouse move event for legend module.
     * @returns {void}
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            if ((<AccumulationChart>this.chart).accumulationHighlightModule && (<AccumulationChart>this.chart).highlightMode !== 'None') {
                if (!(<AccumulationChart>this.chart).legendSettings.toggleVisibility) { this.click(e); }
                const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
                    this.legendID + '_shape_', this.legendID + '_g_'];
                const targetId: string = (<HTMLElement>e.target).id;
                let index: number;
                for (const id of legendItemsId) {
                    if (targetId.indexOf(id) > -1) {
                        index = parseInt(targetId.split(id)[1], 10);
                        (<AccumulationChart>this.chart).accumulationHighlightModule.legendSelection((<AccumulationChart>this.chart),
                                                                                                    0, index, e.target as Element, e.type);
                        break;
                    }
                }
            }
        }
    }
    /**
     * To handle mosue end for legend module.
     *
     * @param {MouseEvent} e - The mouse end event for legend module.
     * @returns {void}
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Get the legend options.
     *
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {AccumulationSeries[]} series - The array of series in the accumulation chart.
     * @returns {void}
     * @private
     */
    public getLegendOptions(chart: AccumulationChart, series: AccumulationSeries[]): void {
        this.legendCollections = [];
        this.isRtlEnable = chart.enableRtl;
        this.isReverse = !this.isRtlEnable && chart.legendSettings.reverse;
        for (let i: number = 0; i < 1; i++) {
            let seriesType: AccumulationType = series[i as number].type;
            if (seriesType === 'Pie' || seriesType === <AccumulationType>'Doughnut') {
                seriesType = (series[i as number].innerRadius !== '0' && series[i as number].innerRadius !== '0%') ?
                    <AccumulationType>'Doughnut' : 'Pie';
            }
            for (const point of series[i as number].points) {
                if (!isNullOrUndefined(point.x) && !isNullOrUndefined(point.y)) {
                    this.legendCollections.push(new LegendOptions(
                        (chart.useGroupingSeparator && typeof point.x === 'number') ? chart.intl.formatNumber(point.x as number, { useGrouping: true })
                            : point.x.toString(), point.color,
                        series[i as number].legendShape, point.visible,
                        seriesType, point.legendImageUrl, null, null,
                        point.index, series[i as number].index, null, point.x.toString()
                    ));
                }
            }
            if (this.isReverse) {
                this.legendCollections.reverse();
            }
        }
    }
    /**
     * To find legend bounds for accumulation chart.
     *
     * @param {Size} availableSize - The available size for the legend.
     * @param {Rect} legendBounds - The boundary of the legend.
     * @param {LegendSettingsModel} legend - The legend settings.
     * @returns {void}
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        let extraWidth: number = 0;
        let extraHeight: number = 0;
        let legendOption : LegendOptions;
        this.chartRowCount = 1;
        this.rowHeights = [];
        this.columnHeights = [];
        this.pageHeights = [];
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
        let maximumWidth: number = legend.maximumLabelWidth ? legend.maximumLabelWidth : 0;
        const shapeWidth: number = legend.shapeWidth;
        let rowWidth: number = 0;
        let columnCount : number = 0;
        let rowCount: number = 0;
        const columnWidth: number[] = [];
        const pageWidth : number[] = [];
        let pageRowWidth : number = 0;
        let previousRowCount : number = 0;
        let columnHeight: number = 0;
        let legendWidth: number = 0;
        let titleHeight: number = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height, legend.shapeHeight);
        let legendEventArgs: IAccLegendRenderEventArgs;
        let render: boolean = false;
        const maxColumn: boolean = legend.layout === 'Auto' && legend.maximumColumns > 0;
        if (legend.fixedWidth) {
            for (let i: number = 0; i < this.legendCollections.length; i++) {
                const textWidth: number = shapeWidth + shapePadding + (!this.isVertical ? (i === 0) ? padding : this.itemPadding :
                    padding) + (legend.maximumLabelWidth ? legend.maximumLabelWidth :
                    measureText(this.legendCollections[i as number].text, legend.textStyle, this.chart.themeStyle.legendLabelFont).width);
                this.maxColumnWidth = this.maxColumnWidth > textWidth ? this.maxColumnWidth : textWidth;
            }
        }
        for (let i: number = 0; i < this.legendCollections.length; i++) {
            legendOption = this.legendCollections[i as number];
            legendEventArgs = { fill: legendOption.fill, text : legendOption.text, shape : legendOption.shape,
                name: 'legendRender', cancel: false };
            this.chart.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendOption.originalText = ((legendEventArgs.text.indexOf('&') > -1) ?
                this.convertHtmlEntities(legendEventArgs.text) : legendEventArgs.text);
            if (legendOption.fill !== legendEventArgs.fill) {
                this.legendRenderArgFill.push(i as number);
            }
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = legend.fixedWidth ? this.maxColumnWidth : shapeWidth + shapePadding +
                    (legend.maximumLabelWidth ? legend.maximumLabelWidth : legendOption.textSize.width)
                    + (!this.isVertical || legend.layout === 'Horizontal' ? (i === 0 || (columnCount === 1 && rowCount > 0 && legend.layout === 'Horizontal')) ? padding : this.itemPadding : padding);
                this.getLegendHeight(legendOption, legend, legendBounds, rowWidth, this.maxItemHeight, padding);
                if (this.isVertical && legend.layout === 'Auto' && !maxColumn) {
                    columnHeight += Math.max(legendOption.textSize.height, legend.shapeHeight) + ((i === 0) ? padding : this.itemPadding);
                    if (columnHeight + this.itemPadding + (arrowHeight / this.pageButtonSize) > (legendBounds.height)) {
                        //columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding + arrowHeight);
                        rowWidth = rowWidth + maximumWidth;
                        pageRowWidth = this.getPageWidth(pageWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        if  ((rowWidth - pageRowWidth + legendWidth) > legendBounds.width) {
                            pageWidth.push(rowWidth - pageRowWidth);
                            rowCount =  this.rowHeights.length;
                            previousRowCount = rowCount;
                        }
                        else {
                            rowCount = previousRowCount;
                        }
                        columnWidth.push(maximumWidth);
                        maximumWidth = 0;
                        columnHeight = Math.max(legendOption.textSize.height, legend.shapeHeight) + padding;
                        columnCount++;
                    }
                    this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                        this.columnHeights[columnCount as number] : 0) + Math.max(legendOption.textSize.height, legend.shapeHeight)
                         + ((i === 0) ? padding : this.itemPadding);
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                    this.rowHeights[rowCount as number] = Math.max((this.rowHeights[rowCount as number] ?
                        this.rowHeights[rowCount as number] : 0), Math.max(legendOption.textSize.height, legend.shapeHeight));
                    rowCount++;
                } else {
                    if (!legend.enablePages) { // For new legend navigation support
                        titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                        titlePlusArrowSpace += arrowWidth;
                    }
                    rowWidth = rowWidth + legendWidth;
                    if (maxColumn ? legend.maximumColumns === columnCount : legendBounds.width < (padding + rowWidth + titlePlusArrowSpace) || (this.legend.layout === 'Vertical' && columnCount === 1)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnCount  = 0;
                    //  columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + this.legendTitleSize.height;
                    }
                    const len: number = rowCount ? (rowCount - 1) : rowCount;
                    this.rowHeights[len as number] = Math.max((this.rowHeights[len as number] ? this.rowHeights[len as number] : 0),
                                                              Math.max(legendOption.textSize.height, legend.shapeHeight));
                    this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                        this.columnHeights[columnCount as number] : 0) +
                        Math.max(legendOption.textSize.height, legend.shapeHeight) + padding;
                    if (maxColumn && this.columnHeights[columnCount as number] > legendBounds.height) {
                        this.columnHeights[columnCount as number] -= Math.max(legendOption.textSize.height, legend.shapeHeight) + padding;
                    }
                    columnCount++;
                }
            }
        }
        titleHeight = titlePosition === 'Top' ? this.legendTitleSize.height : 0;
        if (this.isVertical && legend.layout === 'Auto' && !maxColumn) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max.apply(null, this.columnHeights) +  padding + arrowHeight + titleHeight;
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding + arrowHeight);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            columnWidth.push(maximumWidth);
        } else {
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max.apply(null, this.columnHeights) +  padding + arrowHeight + titleHeight;
            this.isPaging = (legendBounds.height < columnHeight || (legend.layout === 'Horizontal' && this.rowHeights.length > 1)) && !maxColumn;
            columnHeight = !legend.enablePages && this.isPaging && legend.layout !== 'Vertical' ? (this.maxItemHeight + padding) + padding + titleHeight : columnHeight;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleHeight);
            if (legend.layout === 'Horizontal') {
                columnHeight = (this.maxItemHeight) + (padding * 2) + titleHeight + this.pageButtonSize + legend.border.width;
            }
            if (!this.isPaging) { // For title left and right position
                rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
            }
        }
        this.maxColumns = 0; // initialization for max columns
        let width: number;
        if (maxColumn && this.maxColumnWidth && legend.fixedWidth) {
            width = (this.maxColumnWidth * legend.maximumColumns) + padding;
            this.isPaging = false;
        }
        else {
            width = (this.isVertical && legend.layout === 'Auto' && !maxColumn) ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
                Math.max(rowWidth + padding, maximumWidth);
        }
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }

    private getPageWidth(pageWidth : number[]) : number {
        let sum : number = 0;
        for (let i: number = 0; i < pageWidth.length; i++) {
            sum += pageWidth[i as number];
        }
        return sum;
    }

    /** @private */

    public getLegendHeight(option: LegendOptions, legend: LegendSettingsModel, bounds: Rect, rowWidth: number,
                           legendHeight: number, padding: number): void {
        const legendWidth: number = option.textSize.width;
        const textPadding: number = legend.shapePadding + (padding * 2) + legend.shapeWidth;
        switch (legend.textWrap) {
        case 'Wrap':
        case 'AnyWhere':
            if (legendWidth > legend.maximumLabelWidth || legendWidth + rowWidth > bounds.width) {
                option.textCollection = textWrap(
                    option.text,
                    (legend.maximumLabelWidth ? Math.min(legend.maximumLabelWidth, (bounds.width - textPadding)) :
                        (bounds.width - textPadding)), legend.textStyle, this.chart.enableRtl, legend.textWrap === 'AnyWhere', null, this.chart.themeStyle.legendLabelFont
                );
            } else {
                option.textCollection.push(option.text);
            }
            option.textSize.height = (legendHeight * option.textCollection.length);
            break;
        }
    }
    /**
     * To find html entities value for legend.
     *
     * @param {string} legendText - The text of the legend item.
     * @returns {string} - Converts the entities to normal string.
     * @private
     */
    public convertHtmlEntities(legendText: string): string {
        let text: string = (legendText).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&nbsp;', ' ').replace('&cent;', '¢').replace('&pound;', '£').replace('&yen;', '¥').replace('&euro;', '€').replace('&copy;', '©').replace('&reg;', '®');
        text = (text).replace('&#38;', '&').replace('&#60;', '<').replace('&#62;', '>').replace('&#34;', '"').replace('&#160;', ' ').
            replace('&#162;', '¢').replace('&#163;', '£').replace('&#165;', '¥').replace('&#8364;', '€').replace('&#169;', '©').replace('&#174;', '®');
        return text;
    }
    /**
     * To find maximum column size for legend.
     *
     * @param {number[]} columns - Array containing the number of legend items in each column.
     * @param {number} width - The total width available.
     * @param {number} padding - The padding between legend items.
     * @param {number} rowWidth - The width of each row of legend items.
     * @returns {number} - Get a maximum columns.
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
        let columnWidth : number = this.maxColumnWidth + padding;
        let prevPage : number = 0;
        const columnCount: number = this.columnHeights.length;
        if (this.isPaging && this.isVertical) {
            for (let i: number = 1; i < columnCount; i++) {
                columnWidth += (this.maxColumnWidth + padding);
                if (columnWidth > width) {
                    this.pageHeights.push(((prevPage !== i - 1) ? Math.max.apply(null, this.columnHeights.slice(prevPage, i - 1)) :
                        this.columnHeights[prevPage as number]));
                    columnWidth = this.maxColumnWidth + padding;
                    prevPage = i;
                }
            }
            this.pageHeights.push(((prevPage !== columnCount - 1) ?
                Math.max.apply(null, this.columnHeights.slice(prevPage, columnCount - 1)) : this.columnHeights[prevPage as number]));
            this.totalPages = this.pageHeights.length;
        }
        return maxPageColumn;
    }
    /**
     * To find available width from legend x position.
     *
     * @param {number} tx - The x-coordinate of the legend.
     * @param {number} width - The total width available.
     * @returns {number} - Get a available width.
     */
    private getAvailWidth(tx: number, width: number): number {
        if (this.isVertical && this.legend.layout === 'Auto' && !(this.legend.maximumColumns > 0)) {
            width = this.maxWidth;
        } else if (!this.isVertical && this.legend.layout !== 'Vertical' && !(this.legend.maximumColumns > 0) && this.isPaging && !this.legend.enablePages) {
            return width - tx - this.fivePixel;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    }
    /**
     * To find legend rendering locations from legend items.
     *
     * @param {LegendOptions} legendOption - The legend options.
     * @param {ChartLocation} start - The starting location for legend rendering.
     * @param {number} textPadding - The padding between legend text items.
     * @param {LegendOptions} prevLegend - The previous legend options.
     * @param {Rect} rect - The bounding of the legend.
     * @param {number} count - The count of legend items.
     * @param {number} firstLegend - The index of the first legend item.
     * @returns {void}
     * @private
     */
    public getRenderPoint(legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
                          rect: Rect, count: number, firstLegend: number): void {
        const padding: number = this.legend.padding;
        const previousLocation: number = prevLegend.location.y + this.maxItemHeight / 4 + (prevLegend.textCollection.length > 0 ?
            ((prevLegend.textCollection.length - 1) * this.maxItemHeight) : 0);
        if (this.isVertical && this.legend.layout === 'Auto' && !(this.legend.maximumColumns > 0)) {
            if (count === firstLegend || (previousLocation + Math.max(legendOption.textSize.height, this.legend.shapeHeight)
                + padding > (rect.y + rect.height))) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : (!this.isRtlEnable) ?
                    this.maxColumnWidth : -this.maxColumnWidth);
                legendOption.location.y = start.y;
                const textStartLoc: number = (this.legend.shapeWidth / 2) + padding;
                this.pageXCollections.push(legendOption.location.x + ((!this.isRtlEnable) ? -textStartLoc : textStartLoc));
            } else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + Math.max(prevLegend.textSize.height, this.legend.shapeHeight)
                + this.itemPadding;
            }
        } else {
            const textWidth: number = this.legend.fixedWidth ? this.maxColumnWidth : textPadding + (this.legend.maximumLabelWidth ?
                this.legend.maximumLabelWidth : prevLegend.textSize.width);
            const previousBound: number = prevLegend.location.x + ((!this.isRtlEnable) ? textWidth : -textWidth);
            if (this.legend.layout === 'Auto' && this.legend.maximumColumns > 0 ? count % this.legend.maximumColumns === 0 :
                this.isWithinBounds(previousBound, (this.legend.maximumLabelWidth ? this.legend.maximumLabelWidth :
                    legendOption.textSize.width) + textPadding - this.itemPadding, rect, this.legend.shapeWidth / 2) || this.legend.layout === 'Vertical') {
                if (count !== firstLegend) {
                    this.chartRowCount++;
                }
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.rowHeights[(this.chartRowCount - 2)] + padding;
                legendOption.location.x = start.x;
            } else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
        }
        let availablewidth: number = this.getAvailWidth(legendOption.location.x, this.legendBounds.width);
        availablewidth = this.legend.maximumLabelWidth ? Math.min(this.legend.maximumLabelWidth, availablewidth) : availablewidth;
        if (this.legend.textOverflow === 'Ellipsis' && this.legend.textWrap === 'Normal') {
            legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle,
                                         this.chart.enableRtl, this.chart.themeStyle.legendLabelFont);
        }
    }

    /**
     * Check whether legend group within legend bounds or not.
     *
     * @param {number} previousBound - The previous bound value.
     * @param {number} textWidth - The width of the legend text.
     * @param {Rect} legendBounds - The bounding of the legend.
     * @param {number} shapeWidth - The width of the legend shape.
     * @returns {boolean} - A boolean indicating whether the legend group is within the legend bounds.
     */
    private isWithinBounds(previousBound: number, textWidth: number, legendBounds: Rect, shapeWidth: number): boolean {
        if (!this.isRtlEnable) {
            return (previousBound + textWidth) > (legendBounds.x + legendBounds.width + shapeWidth);
        }
        else {
            return (previousBound - textWidth) < (legendBounds.x - shapeWidth);
        }
    }

    /**
     * Finding the smart legend place according to positions.
     *
     * @param {Rect} labelBound - The bounding of the label.
     * @param {Rect} legendBound - The bounding of the legend.
     * @param {MarginModel} margin - The margin of the legend.
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
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    private getTitleRect(accumulation: AccumulationChart): void {
        if (!accumulation.title) {
            return null;
        }
        const titleSize: Size = measureText(accumulation.title, accumulation.titleStyle, this.chart.themeStyle.legendTitleFont);
        this.titleRect = new Rect(
            accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
    }
    /**
     * To get legend by index.
     *
     * @param {number} index - The index of the legend.
     * @param {LegendOptions[]} legendCollections - The array of legend options.
     * @returns {LegendOptions} - Return legend index.
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
     * @param {Event} event - The click event.
     * @returns {void}
     * @private
     */
    public click(event: Event): void {
        const targetId: string = (<HTMLElement>event.target).id.indexOf('_chart_legend_g_') > -1 ?
            (event.target as HTMLElement).firstChild['id'] : (<HTMLElement>event.target).id;
        const chart: AccumulationChart = this.chart as AccumulationChart;
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_', this.legendID + '_shape_marker_'];
        // if ((<AccumulationChart>this.chart).accumulationSelectionModule) {
        //     // const selectedDataIndexes: Indexes[] = <Indexes[]>extend([], (<AccumulationChart>this.chart)
        //     //     .accumulationSelectionModule.selectedDataIndexes, null, true);
        // }
        (this.chart as AccumulationChart).animateSeries = false;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                const pointIndex: number = parseInt(targetId.split(id)[1], 10);
                if ((this.chart as AccumulationChart).legendSettings.toggleVisibility && !isNaN(pointIndex)) {
                    const currentSeries: AccumulationSeries = (<AccumulationChart>this.chart).visibleSeries[0];
                    const point: AccPoints = pointByIndex(pointIndex, currentSeries.points);
                    const legendOption: LegendOptions = this.legendByIndex(pointIndex, this.legendCollections);
                    const legendClickArgs: IAccLegendClickEventArgs = {
                        legendText: legendOption.text, legendShape: legendOption.shape,
                        chart: chart, series: currentSeries, point: point,
                        name: legendClick, cancel: false
                    };
                    this.chart.trigger(legendClick, legendClickArgs);
                    if (!legendClickArgs.cancel) {
                        point.visible = !point.visible;
                        legendOption.visible = point.visible;
                        currentSeries.sumOfPoints += point.visible ? point.y : -point.y;
                        chart.redraw = chart.enableAnimation;
                        this.sliceVisibility(pointIndex, point.visible);
                        chart.removeSvg();
                        //To remove the blazor templates
                        (<AccumulationChart>this.chart).refreshPoints(currentSeries.points);
                        (<AccumulationChart>this.chart).calculateBounds();
                        const borderElement: Element = document.getElementById(this.chart.element.id + 'PointHover_Border');
                        if (borderElement) {
                            (<AccumulationChart>this.chart).pieSeriesModule.removeBorder(borderElement, 0);
                        }
                        if ((<AccumulationChart>this.chart).accumulationTooltipModule) {
                            (<AccumulationChart>this.chart).accumulationTooltipModule.removeTooltip(0);
                        }
                        (<AccumulationChart>this.chart).renderElements();
                    }
                } else if ((<AccumulationChart>this.chart).accumulationSelectionModule && !isNaN(pointIndex)) {
                    (<AccumulationChart>this.chart).accumulationSelectionModule.legendSelection(
                        <AccumulationChart>this.chart, 0, pointIndex, event.target as Element, event.type);
                } else if ((<AccumulationChart>this.chart).accumulationHighlightModule && !isNaN(pointIndex)) {
                    (<AccumulationChart>this.chart).accumulationHighlightModule.legendSelection(
                        <AccumulationChart>this.chart, 0, pointIndex, event.target as Element, event.type);
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
     * To translate the point elements by index and position.
     *
     * @param {number} index - The index of the point element.
     * @param {boolean} isVisible - A boolean value indicating whether the point is visible.
     * @returns {void}
     */
    private sliceVisibility(index: number, isVisible: boolean): void {
        let sliceId: string = this.chart.element.id + '_Series_0_Point_';
        if (((this.chart as AccumulationChart).visibleSeries[0] as AccumulationSeries).dataLabel.visible) {
            sliceId = this.chart.element.id + '_datalabel_Series_0_';
            this.sliceAnimate(getElement(sliceId + 'g_' + index), isVisible);
        }
    }

    /**
     * Slice animation.
     *
     * @param {Element} element - slice element.
     * @param {boolean} isVisible - boolean value of slice.
     * @returns {void}
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
     * Get module name.
     *
     * @returns {string} - Return module name.
     * @private
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
         * Destroy method calling here.
         */
        this.removeEventListener();
    }
}
