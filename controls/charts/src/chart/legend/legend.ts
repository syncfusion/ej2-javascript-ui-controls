/**
 * Chart legend
 */
import { remove, Browser, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Series } from '../series/chart-series';
import { ChartSeriesType, ChartDrawType } from '../utils/enum';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart, Indexes, Points } from '../../chart';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { textTrim, ChartLocation, removeElement, RectOption, withInBounds, blazorTemplatesReset} from '../../common/utils/helper';
import { getUnicodeText} from '../../common/utils/helper';
import { Size, measureText, Rect, CanvasRenderer, getElement } from '@syncfusion/ej2-svg-base';
import { ILegendRegions } from '../../common/model/interface';
import { ILegendRenderEventArgs, ILegendClickEventArgs } from '../../chart/model/chart-interface';
import { legendRender, legendClick, regSub, regSup} from '../../common/model/constants';
import { Axis } from '../axis/axis';
import { LegendTitlePosition } from '../../common/utils/enum';
import { textWrap } from '../../common/utils/helper';
import { TrendlineModel } from '../series/chart-series-model';
/**
 * The `Legend` module is used to render the legend for the chart.
 */
export class Legend extends BaseLegend {
    constructor(chart: Chart) {
        super(chart);
        this.library = this;
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
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
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
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
            if ((<Chart>this.chart).highlightModule && ((<Chart>this.chart).highlightMode !== 'None' || (<Chart>this.chart).legendSettings.enableHighlight)) {
                const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
                    this.legendID + '_shape_', this.legendID + '_g_'];
                const targetId: string = (<HTMLElement>e.target).id;
                let index: number;
                for (const id of legendItemsId) {
                    if (targetId.indexOf(id) > -1) {
                        index = parseInt(targetId.split(id)[1], 10);
                        (<Chart>this.chart).highlightModule.legendSelection((<Chart>this.chart), index, e.target as Element, e.type);
                        break;
                    }

                }
                // this.click(e);
            }
        }
    }
    /**
     * To handle mosue end for legend module.
     *
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Retrieves the legend options based on the visible series collection and chart.
     *
     * @param {Series[]} visibleSeriesCollection - The collection of visible series.
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     * @private
     */
    public getLegendOptions(visibleSeriesCollection: Series[], chart: Chart): void {
        this.legendCollections = [];
        let seriesType: ChartDrawType | ChartSeriesType;
        let fill: string;
        let dashArray: string;
        const colors: string[] = [];
        this.isRtlEnable = chart.enableRtl;
        this.isReverse = !this.isRtlEnable && chart.legendSettings.reverse;
        if (visibleSeriesCollection.length > 1) {
            this.legend.mode = 'Series';
        }
        for (const series of visibleSeriesCollection) {
            if (this.legend.mode === 'Series') {
                if (series.category !== 'Indicator') {
                    seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                        <ChartSeriesType>series.type;
                    dashArray = !series.marker.visible && (seriesType.indexOf('Line') > -1 && seriesType.indexOf('Area') === -1) ? series.dashArray : '';
                    // To set legend color when use pointColorMapping
                    fill = (series.pointColorMapping && series.points.length > 0) ?
                        (series.points[0].interior ? series.points[0].interior : series.interior) : series.interior;
                    this.legendCollections.push(new LegendOptions(
                        series.name, fill, series.legendShape, (series.category === 'TrendLine' ?
                            (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : series.visible),
                        seriesType, series.legendImageUrl ? series.legendImageUrl : (series.type === 'Scatter' && series.marker.shape === 'Image' ?
                            series.marker.imageUrl : ''),
                        series.marker.shape, series.marker.visible, null, null, dashArray
                    ));
                }
            } else if (this.legend.mode === 'Point') {
                for (const points of series.points) {
                    seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                        <ChartSeriesType>series.type;
                    fill = points.interior ? points.interior : series.interior;
                    this.legendCollections.push(new LegendOptions(
                        points.x.toString(), fill, series.legendShape, (series.category === 'TrendLine' ?
                            (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : points.visible),
                        seriesType, (series.type === 'Scatter' && series.marker.shape === 'Image') ? series.marker.imageUrl : '',
                        series.marker.shape, series.marker.visible
                    ));
                }
            } else if (this.legend.mode === 'Range') {
                for (const points of series.points) {
                    seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                        <ChartSeriesType>series.type;
                    fill = points.interior ? points.interior : series.interior;
                    let legendLabel: string = 'Others';
                    if (colors.indexOf(fill) < 0) {
                        colors.push(fill);
                        if (chart.rangeColorSettings.length >= 1 && chart.rangeColorSettings[0].colors.length === 1) {
                            for (const rangeMap of chart.rangeColorSettings) {
                                if (rangeMap.colors[0] === fill) {
                                    legendLabel = rangeMap.label;
                                }
                            }
                            this.legendCollections.push(new LegendOptions(
                                legendLabel, fill, series.legendShape, (series.category === 'TrendLine' ?
                                    (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : points.visible),
                                seriesType, (series.type === 'Scatter' && series.marker.shape === 'Image') ? series.marker.imageUrl : '',
                                series.marker.shape, series.marker.visible
                            ));
                        }
                    }
                }
            } else {
                if (this.legendCollections.length === 0 && chart.rangeColorSettings.length > 0) {
                    const startLabel: string = chart.rangeColorSettings[0].start.toString();
                    const endLabel: string = chart.rangeColorSettings[chart.rangeColorSettings.length - 1].end.toString();
                    this.legendCollections.push(new LegendOptions(
                        startLabel, series.interior, 'Rectangle', true,
                        seriesType, '', series.marker.shape, series.marker.visible
                    ));
                    this.legendCollections.push(new LegendOptions(
                        endLabel, series.interior, 'Rectangle', true,
                        seriesType, '', series.marker.shape, series.marker.visible
                    ));
                }
            }
        }
        if (this.isReverse && chart.legendSettings.mode !== 'Gradient') {
            this.legendCollections.reverse();
        }
    }
    /**
     * Calculates the legend bounds based on the available size and legend settings.
     *
     * @param {Size} availableSize - The available size for the legend.
     * @param {Rect} legendBounds - The current bounds of the legend.
     * @param {LegendSettingsModel} legend - The legend settings.
     * @returns {void}
     * @private
     */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        this.chartRowCount = 1;
        this.rowHeights = [];
        this.columnHeights = [];
        this.pageHeights = [];
        const padding: number = legend.padding;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let extraHeight: number = 0;
        let legendOption : LegendOptions;
        let extraWidth: number = 0;
        const arrowWidth: number = this.arrowWidth;
        const arrowHeight: number = this.arrowHeight;
        const verticalArrowSpace: number = this.isVertical && !legend.enablePages ? arrowHeight : 0;
        let titleSpace: number = this.isTitle && titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        titleSpace = this.isTitle && this.isVertical && titlePosition !== 'Top' ? this.legendTitleSize.height + this.fivePixel : titleSpace;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.height += (extraHeight);
        legendBounds.width += extraWidth;
        let shapeWidth: number = legend.shapeWidth;
        let shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let rowWidth: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        let columnCount : number = 0;
        let rowCount: number = 0;
        let titlePlusArrowSpace: number = 0;
        let legendEventArgs: ILegendRenderEventArgs;
        let render: boolean = false;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle, this.chart.themeStyle.legendLabelFont).height, legend.shapeHeight);
        const maxColumn: boolean = legend.layout === 'Auto' && legend.maximumColumns > 0;
        if (legend.fixedWidth) {
            for (let i: number = 0; i < this.legendCollections.length; i++) {
                const textWidth: number = shapeWidth + shapePadding + (!this.isVertical ? (i === 0) ? padding : this.itemPadding
                    : padding) + (legend.maximumLabelWidth ? legend.maximumLabelWidth :
                    measureText(this.legendCollections[i as number].text, legend.textStyle, this.chart.themeStyle.legendLabelFont).width);
                this.maxWidth = Math.max(this.maxWidth, textWidth);
            }
        }
        for (let i: number = 0; i < this.legendCollections.length; i++) {
            legendOption = this.legendCollections[i as number];
            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
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
            legendOption.textSize = measureText(legendOption.text, legend.textStyle, this.chart.themeStyle.legendLabelFont);
            shapeWidth = legendOption.text ? legend.shapeWidth : 0;
            shapePadding = legendOption.text ? legend.shapePadding : 0;
            if (legendOption.render && legendOption.text) {
                render = true;
                legendWidth = legend.fixedWidth ? this.maxWidth : shapeWidth + shapePadding +
                (legend.maximumLabelWidth ? legend.maximumLabelWidth : legendOption.textSize.width) +
                ((!this.isVertical || legend.layout === 'Horizontal') ? (i === 0 || (columnCount === 1 && rowCount > 0 && legend.layout === 'Horizontal')) ? padding : this.itemPadding : padding);
                rowWidth = rowWidth + legendWidth;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                this.getLegendHeight(legendOption, legend, legendBounds, rowWidth, this.maxItemHeight, padding);
                if (maxColumn ? columnCount === legend.maximumColumns : legend.layout === 'Vertical' || (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace)) || (this.isVertical && legend.layout === 'Auto')) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - (this.isVertical &&
                        this.legend.layout === 'Auto' ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical && this.legend.layout === 'Auto' ? 0 : legendWidth;
                    rowCount++;
                    columnCount = 0;
                    columnHeight = verticalArrowSpace;
                    //columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + titleSpace + verticalArrowSpace;
                }
                const len: number = (rowCount > 0 ? (rowCount - 1) : 0);
                this.rowHeights[len as number] = Math.max((this.rowHeights[len as number] ?
                    this.rowHeights[len as number] : 0), Math.max(legendOption.textSize.height, legend.shapeHeight));
                // this.maxItemHeight = Math.max(this.maxItemHeight, legendOption.textSize.height);
                this.columnHeights[columnCount as number] = (this.columnHeights[columnCount as number] ?
                    this.columnHeights[columnCount as number] : 0) + Math.max(legendOption.textSize.height, legend.shapeHeight) +
                    ((this.isVertical || (rowCount > 0 && this.legend.itemPadding)) ? (i === 0) ? padding : this.itemPadding : padding);
                columnCount++;
            }
        }
        columnHeight = Math.max.apply(null, this.columnHeights) +  padding + titleSpace;
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleSpace);
        if (legend.layout === 'Horizontal') {
            columnHeight = this.maxItemHeight + (padding * 2) + titleSpace + this.pageButtonSize + legend.border.width;
        }
        this.isPaging = (legendBounds.height < columnHeight || (legend.layout === 'Horizontal' && this.rowHeights.length > 1)) && !maxColumn;
        if (this.isPaging && !legend.enablePages) {
            if (!this.isVertical) {
                columnHeight = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = rowCount;
        if (maxColumn && this.maxWidth && legend.fixedWidth) {
            rowWidth = this.maxWidth * legend.maximumColumns;
            this.isPaging = false;
        }
        if ((!this.isPaging || this.legend.layout !== 'Auto') && !this.isVertical) {
            rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
        if (render) {
            this.setBounds(Math.max((rowWidth + padding), maximumWidth), columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /**
     * Calculates the height of the legend based on the legend options, settings, and available space.
     *
     * @param {LegendOptions} legendOption - The legend options.
     * @param {LegendSettingsModel} legend - The legend settings.
     * @param {Rect} legendBounds - The current bounds of the legend.
     * @param {number} rowWidth - The width of the legend rows.
     * @param {number} legendHeight - The current height of the legend.
     * @param {number} padding - The padding around the legend items.
     * @returns {void}
     * @private
     */
    public getLegendHeight(legendOption: LegendOptions, legend: LegendSettingsModel, legendBounds: Rect,
                           rowWidth: number, legendHeight : number, padding : number): void  {
        const legendWidth: number = legendOption.textSize.width;
        const textPadding: number = legend.shapePadding + (padding * 2) + legend.shapeWidth;
        switch (legend.textWrap) {
        case 'Wrap':
        case 'AnyWhere':
            if (legendWidth > legend.maximumLabelWidth || legendWidth + rowWidth > legendBounds.width) {
                legendOption.textCollection = textWrap(
                    legendOption.text,
                    (legend.maximumLabelWidth ? Math.min(legend.maximumLabelWidth, (legendBounds.width - textPadding)) :
                        (legendBounds.width - textPadding)), legend.textStyle, this.chart.enableRtl,
                    null, null, this.chart.themeStyle.legendLabelFont
                );
            } else {
                legendOption.textCollection.push(legendOption.text);
            }
            legendOption.textSize.height = (legendHeight * legendOption.textCollection.length);
            break;
        }
    }
    /**
     * Calculates the rendering point for the legend item based on various parameters.
     *
     * @param {LegendOptions} legendOption - The legend options.
     * @param {ChartLocation} start - The starting location for the legend.
     * @param {number} textPadding - The padding around the legend text.
     * @param {LegendOptions} previousLegend - The options of the previous legend item.
     * @param {Rect} rect - The bounding rectangle for the legend.
     * @param {number} count - The count of legend items.
     * @param {number} firstLegend - The index of the first legend item.
     * @returns {void}
     * @private
     */
    public getRenderPoint(
        legendOption: LegendOptions, start: ChartLocation, textPadding: number, previousLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        const padding: number = this.legend.padding;
        const textWidth: number = this.legend.fixedWidth ? this.maxWidth : textPadding + (this.legend.maximumLabelWidth ?
            this.legend.maximumLabelWidth : previousLegend.textSize.width);
        const previousBound: number = previousLegend.location.x + ((!this.isRtlEnable) ? textWidth : -textWidth);
        if (this.legend.layout === 'Auto' && this.legend.maximumColumns > 0 ? count % this.legend.maximumColumns === 0 : this.legend.layout === 'Vertical' || this.isWithinBounds(previousBound, (this.legend.maximumLabelWidth ?
            this.legend.maximumLabelWidth : legendOption.textSize.width) + textPadding - this.itemPadding, rect) || (this.isVertical && this.legend.layout === 'Auto')) {
            legendOption.location.x = start.x;
            if (count !== firstLegend) {
                this.chartRowCount++;
            }
            legendOption.location.y = (count === firstLegend) ? previousLegend.location.y :
                previousLegend.location.y + (this.isVertical && this.legend.layout !== 'Horizontal' && !(this.legend.maximumColumns > 0) ? Math.max(previousLegend.textSize.height, this.legend.shapeHeight) :
                    this.rowHeights[(this.chartRowCount - 2)]) + ((this.isVertical || (this.chartRowCount > 1 &&
                        this.legend.itemPadding)) ? this.itemPadding : padding);
        } else {
            legendOption.location.x = (count === firstLegend) ? previousLegend.location.x : previousBound;
            legendOption.location.y = previousLegend.location.y;
        }
        let availwidth: number = (!this.isRtlEnable) ? (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.itemPadding - this.legend.shapeWidth / 2) : (legendOption.location.x - textPadding + this.itemPadding +
                (this.legend.shapeWidth / 2)) - this.legendBounds.x;
        if (!this.isVertical && this.isPaging && !this.legend.enablePages) {
            availwidth = this.legendBounds.width - legendOption.location.x - this.fivePixel;
        }
        availwidth = this.legend.maximumLabelWidth ? Math.min(this.legend.maximumLabelWidth, availwidth) : availwidth;
        if (this.legend.textOverflow === 'Ellipsis' && this.legend.textWrap === 'Normal') {
            legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text, this.legend.textStyle,
                                         this.chart.enableRtl, this.chart.themeStyle.legendLabelFont);
        }

    }

    private isWithinBounds(previousBound : number, textWidth : number, rect: Rect) : boolean
    {
        if (!this.isRtlEnable)
        {
            return (previousBound + textWidth) > (rect.x + rect.width + (this.legend.shapeWidth / 2));
        }
        else
        {
            return (previousBound - textWidth) < (rect.x - (this.legend.shapeWidth / 2));
        }
    }
    /**
     * Handles the click event for a legend item.
     *
     * @param {number} index - The index of the clicked legend item.
     * @param {Event | PointerEvent} event - The click event.
     * @returns {void}
     * @private
     */
    public LegendClick(index: number, event: Event | PointerEvent): void {
        const chart: Chart = <Chart>this.chart;
        const seriesIndex: number = chart.legendSettings.mode === 'Series' ? index : 0;
        const legendIndex: number = !this.isReverse ?  index : (this.legendCollections.length - 1) - index;
        const series: Series = chart.visibleSeries[seriesIndex as number];
        const legend: LegendOptions = this.legendCollections[legendIndex as number];
        const changeDetection: string = 'isProtectedOnChange';
        if (chart.legendSettings.mode === 'Series') {
            const legendClickArgs: ILegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                chart: chart.isBlazor ? {} as Chart : chart, series: series, points: series.points, name: legendClick, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            series.legendShape = legendClickArgs.legendShape;
            if (!legendClickArgs.cancel) {
                if (series.fill !== null) {
                    chart.visibleSeries[index as number].interior = series.fill;
                }
                if (chart.legendSettings.toggleVisibility) {
                    series.chart[changeDetection as string] = true;
                    if (series.category === 'TrendLine') {
                        if (!chart.series[series.sourceIndex].trendlines[series.index].visible &&
                            chart.series[series.sourceIndex].visible) {
                            chart.series[series.sourceIndex].trendlines[series.index].visible = true;
                        } else {
                            chart.series[series.sourceIndex].trendlines[series.index].visible = false;
                        }
                    } else {
                        this.changeSeriesVisiblity(series, series.visible);
                    }
                    legend.visible = series.category === 'TrendLine' ? chart.series[series.sourceIndex].trendlines[series.index].visible :
                        (series.visible);
                    this.refreshLegendToggle(chart, series);
                    if (chart.highlightModule && chart.legendSettings.enableHighlight) {
                        chart.highlightModule.legendSelection(chart, index, event.target as Element, 'mousemove');
                    }
                } else if (chart.highlightModule) {
                    chart.highlightModule.legendSelection(chart, index, event.target as Element, event.type);
                } else if (chart.selectionModule) {
                    chart.selectionModule.legendSelection(chart, index, event.target as Element, event.type);
                }
                series.chart[changeDetection as string] = false;
            }
        } else if (chart.legendSettings.mode === 'Point') {
            const point: Points = series.points[index as number];
            const legendClickArgs: ILegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                chart: chart.isBlazor ? {} as Chart : chart, series: series, points: [point], name: legendClick, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            if (chart.legendSettings.toggleVisibility && !legendClickArgs.cancel) {
                point.visible = !point.visible;
                const legendOption: LegendOptions = this.legendCollections[index as number];
                legendOption.visible = point.visible;
                this.refreshLegendToggle(chart, series);
            }
        } else if (chart.legendSettings.mode === 'Range') {
            const points: Points[] = [];
            const legendOption: LegendOptions = this.legendCollections[index as number];
            for (const point of series.points) {
                if (legendOption.fill === (point.interior || series.interior)) {
                    points.push(point);
                }
            }
            const legendClickArgs: ILegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                chart: chart.isBlazor ? {} as Chart : chart, series: series, points: points, name: legendClick, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            if (chart.legendSettings.toggleVisibility && !legendClickArgs.cancel) {
                legendOption.visible = !legendOption.visible;
                for (const point of points) {
                    point.visible = !point.visible;
                }
                this.refreshLegendToggle(chart, series);
            }
        }
    }

    private refreshLegendToggle(chart: Chart, series: Series): void {
        let selectedDataIndexes: Indexes[] = [];
        if (chart.selectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], chart.selectionModule.selectedDataIndexes, null, true);
        }
        if ((chart.svgObject.childNodes.length > 0) && !chart.enableAnimation && !chart.enableCanvas) {
            while (chart.svgObject.lastChild) {
                chart.svgObject.removeChild(chart.svgObject.lastChild);
            }
            remove(chart.svgObject);
        }
        chart.animateSeries = false;
        chart.redraw = chart.enableAnimation;
        series.isLegendClicked = true;
        chart.rotatedDataLabelCollections = [];
        removeElement(getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]);
        blazorTemplatesReset(chart);
        this.redrawSeriesElements(series, chart);
        chart.removeSvg();
        chart.refreshAxis();
        series.refreshAxisLabel();
        this.refreshSeries(chart.visibleSeries);
        for (const series of chart.visibleSeries) {
            if (!isNullOrUndefined(series)) {
                chart.markerRender.removeHighlightedMarker(series, null, true);
            }
        }
        chart.refreshBound();
        chart.trigger('loaded', { chart: chart });
        if (selectedDataIndexes.length > 0) {
            chart.selectionModule.selectedDataIndexes = selectedDataIndexes;
            chart.selectionModule.redrawSelection(chart, chart.selectionMode);
        }
        if (!chart.enableCanvas && chart.highlightModule && (chart.highlightMode !== 'None' || chart.legendSettings.enableHighlight)) {
            chart.highlightModule.redrawSelection(chart, chart.highlightMode);
        }
        chart.redraw = false;
        series.isLegendClicked = false;
    }

    private changeSeriesVisiblity(series: Series, visibility: boolean): void {
        series.visible = !visibility;
        if (this.isSecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some((value: Series) => (value.visible));
        }
        if (this.isSecondaryAxis(series.yAxis) || (series.category === 'Pareto' && series.type === 'Line')) {
            series.yAxis.internalVisibility = series.yAxis.series.some((value: Series) => (value.visible));
        }
        if (series.trendlines.length && series.visible) {
            series.trendlines.forEach((trendline: TrendlineModel) => {
                trendline.visible = true;
            });
        }
    }
    private isSecondaryAxis(axis: Axis): boolean {
        return((this.chart as Chart).axes.indexOf(axis) > -1);
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
        for (const series of seriesCollection) {
            if (series.type.indexOf('Spline') > -1 ) {
                const isArea: boolean = (series.type.indexOf('Area') > -1 || series.drawType.indexOf('Area') > -1);
                const isRange: boolean = series.type.indexOf('Range') > -1;
                this.chart[
                    'spline' + (isArea ? isRange ? 'RangeArea' : 'Area' : '') + 'SeriesModule'
                ].findSplinePoint(series);
            }
            if (series.visible) {
                series.position = undefined;
            }
        }
    }
    /**
     * Handles the click event for showing tooltip on trimmed text in legend.
     *
     * @param {Event | PointerEvent} event - The click event.
     * @returns {void}
     * @private
     */
    public click(event: Event | PointerEvent): void {
        if (!this.chart.legendSettings.visible) {
            return;
        }
        const pageX: number = this.chart.mouseX;
        const pageY: number = this.chart.mouseY;
        let legendRegion: ILegendRegions[] = [];
        const targetId: string = (<HTMLElement>event.target).id.indexOf('_chart_legend_g_') > -1 ?
            (event.target as HTMLElement).firstChild['id'] : (<HTMLElement>event.target).id;
        const legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
            this.legendID + '_shape_'];
        let seriesIndex: number;
        for (const id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.LegendClick(seriesIndex, event);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        if ((this.chart as Chart).enableCanvas && this.pagingRegions.length) {
            this.checkWithinBounds(pageX, pageY);
        }

        legendRegion = this.legendRegions.filter((region: ILegendRegions) => {
            return (withInBounds(pageX, (pageY + (this.isPaging ? (this.currentPageNumber - 1) *
            this.translatePage((this.chart as Chart).enableCanvas, null, 1, 2) : 0)),
                                 region.rect));
        });
        if (legendRegion.length && (this.chart as Chart).enableCanvas) {
            this.LegendClick(legendRegion[0].index, event);
        }
    }
    /**
     * Checks whether the provided coordinates are within the bounds.
     *
     * @param {number} pageX - The x-coordinate of the mouse pointer.
     * @param {number} pageY - The y-coordinate of the mouse pointer.
     * @returns {void}
     * @protected
     */
    protected checkWithinBounds(pageX: number , pageY: number): void {
        const cRender: CanvasRenderer = this.chart.renderer as CanvasRenderer;
        const bounds: Rect = this.legendBounds;
        const borderWidth: number = this.chart.legendSettings.border.width;
        const canvasRect: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        canvasRect.x = canvasRect.x - borderWidth / 2;
        canvasRect.y = canvasRect.y - borderWidth / 2;
        canvasRect.width = canvasRect.width + borderWidth;
        canvasRect.height = canvasRect.height + borderWidth;
        if (withInBounds(pageX, pageY, this.pagingRegions[0])) {
        // pageDown calculations are performing here
            if (!this.isRtlEnable) {
                this.canvasPageDown(cRender, canvasRect, bounds);
            }
            else {
                this.canvasPageUp(cRender, canvasRect, bounds);
            }
            return null;
        }
        if (withInBounds(pageX, pageY, this.pagingRegions[1])) {
            // pageUp calculations are performing here
            if (!this.isRtlEnable) {
                this.canvasPageUp(cRender, canvasRect, bounds);
            }
            else {
                this.canvasPageDown(cRender, canvasRect, bounds);
            }
            return null;
        }
    }

    private canvasPageDown(cRender : CanvasRenderer, canvasRect : Rect, bounds : Rect) : void {
        if (--this.currentPageNumber > 0) {
            this.legendRegions = [];
            cRender.clearRect(canvasRect);
            cRender.canvasClip(new RectOption('legendClipPath', 'transparent', { width: 0, color: '' }, null, canvasRect));
            this.renderLegend(this.chart, this.legend, bounds);
            cRender.canvasRestore();
        } else {
            ++this.currentPageNumber;
        }
    }

    private canvasPageUp(cRender : CanvasRenderer, canvasRect : Rect, bounds : Rect) : void {
        if (++this.currentPageNumber > 0 && this.currentPageNumber <= this.totalNoOfPages) {
            this.legendRegions = [];
            cRender.clearRect(canvasRect);
            cRender.canvasClip(new RectOption('legendClipPath', 'transpaent', { width: 0, color: '' }, null, canvasRect));
            this.renderLegend(this.chart, this.legend, bounds);
            cRender.canvasRestore();
        } else {
            --this.currentPageNumber;
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'Legend';
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
