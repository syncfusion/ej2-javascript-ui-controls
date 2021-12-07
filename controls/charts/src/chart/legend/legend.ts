/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * Chart legend
 */
import { remove, Browser, extend } from '@syncfusion/ej2-base';
import { Series } from '../series/chart-series';
import { Indexes } from '../../common/model/base';
import { ChartSeriesType, ChartDrawType } from '../utils/enum';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart, Points } from '../../chart';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { textTrim, ChartLocation, removeElement, RectOption, withInBounds, blazorTemplatesReset} from '../../common/utils/helper';
import { getUnicodeText} from '../../common/utils/helper';
import { Size, measureText, Rect, CanvasRenderer, getElement } from '@syncfusion/ej2-svg-base';
import { ILegendRegions } from '../../common/model/interface';
import { ILegendRenderEventArgs, ILegendClickEventArgs } from '../../chart/model/chart-interface';
import { legendRender, legendClick, regSub, regSup} from '../../common/model/constants';
import { Axis } from '../axis/axis';
import { LegendTitlePosition } from '../../common/utils/enum';
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
            if ((<Chart>this.chart).highlightModule && (<Chart>this.chart).highlightMode !== 'None') {
                this.click(e);
            }
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
     *
     * @returns {void}
     * @private
     */
    public getLegendOptions(visibleSeriesCollection: Series[], chart: Chart): void {
        this.legendCollections = [];
        let seriesType: ChartDrawType | ChartSeriesType;
        let fill: string;
        const colors: string[] = [];
        if (visibleSeriesCollection.length > 1) {
            this.legend.mode = 'Series';
        }
        for (const series of visibleSeriesCollection) {
            if (this.legend.mode === 'Series') {
                if (series.category !== 'Indicator') {
                    seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                        <ChartSeriesType>series.type;
                    // To set legend color when use pointColorMapping
                    fill = (series.pointColorMapping && series.points.length > 0) ?
                        (series.points[0].interior ? series.points[0].interior : series.interior) : series.interior;
                    this.legendCollections.push(new LegendOptions(
                        series.name, fill, series.legendShape, (series.category === 'TrendLine' ?
                            (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : series.visible),
                        seriesType, series.legendImageUrl, series.marker.shape, series.marker.visible
                    ));
                }
            } else if (this.legend.mode === 'Point') {
                for (const points of series.points) {
                    seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                        <ChartSeriesType>series.type;
                    fill = points.interior ? points.interior : series.interior;
                    if (this.legendCollections.filter((i: LegendOptions) => i.text === points.x.toString()).length === 0) {
                        this.legendCollections.push(new LegendOptions(
                            points.x.toString(), fill, series.legendShape, (series.category === 'TrendLine' ?
                                (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : points.visible),
                            seriesType, '', series.marker.shape, series.marker.visible
                        ));
                    }
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
                                seriesType, '', series.marker.shape, series.marker.visible
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
    }
    /** @private */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        const padding: number = legend.padding;
        const titlePosition: LegendTitlePosition = legend.titlePosition;
        let extraHeight: number = 0;
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
        const shapeWidth: number = legend.shapeWidth;
        const shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let rowWidth: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        let rowCount: number = 0;
        let titlePlusArrowSpace: number = 0;
        let legendEventArgs: ILegendRenderEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let render: boolean = false;
        for (const legendOption of this.legendCollections) {
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
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render) {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                rowWidth = rowWidth + legendWidth;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - (this.isVertical ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical ? 0 : legendWidth;
                    rowCount++;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + titleSpace + verticalArrowSpace;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleSpace);
        this.isPaging = legendBounds.height < columnHeight;
        if (this.isPaging && !legend.enablePages) {
            if (this.isVertical) {
                // eslint-disable-next-line no-self-assign
                columnHeight = columnHeight;
            } else {
                columnHeight = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = rowCount;
        if (!this.isPaging && !this.isVertical) {
            rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
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
        const padding: number = this.legend.padding;
        const previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            legendOption.location.x = start.x;
            legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        } else {
            legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOption.location.y = prevLegend.location.y;
        }
        const availwidth: number = (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /** @private */
    public LegendClick(index: number, event: Event | PointerEvent): void {
        const chart: Chart = <Chart>this.chart;
        const seriesIndex: number = chart.legendSettings.mode === 'Series' ? index : 0;
        const series: Series = chart.visibleSeries[seriesIndex];
        const legend: LegendOptions = this.legendCollections[index];
        const changeDetection: string = 'isProtectedOnChange';
        if (chart.legendSettings.mode === 'Series') {
            const legendClickArgs: ILegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                chart: chart.isBlazor ? {} as Chart : chart, series: series, points: series.points, name: legendClick, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            series.legendShape = legendClickArgs.legendShape;
            if (series.fill !== null) {
                chart.visibleSeries[index].interior = series.fill;
            }
            if (chart.legendSettings.toggleVisibility) {
                if (series.category === 'TrendLine') {
                    if (!chart.series[series.sourceIndex].trendlines[series.index].visible) {
                        chart.series[series.sourceIndex].trendlines[series.index].visible = true;
                    } else {
                        chart.series[series.sourceIndex].trendlines[series.index].visible = false;
                    }
                } else {
                    series.chart[changeDetection] = true;
                    this.changeSeriesVisiblity(series, series.visible);
                }
                legend.visible = series.category === 'TrendLine' ? chart.series[series.sourceIndex].trendlines[series.index].visible :
                    (series.visible);
                this.refreshLegendToggle(chart, series);
            } else if (chart.selectionModule) {
                chart.selectionModule.legendSelection(chart, index, event);
            } else if (chart.highlightModule) {
                chart.highlightModule.legendSelection(chart, index, event);
            }
            series.chart[changeDetection] = false;
        } else if (chart.legendSettings.mode === 'Point') {
            const point: Points = series.points[index];
            const legendClickArgs: ILegendClickEventArgs = {
                legendText: legend.text, legendShape: legend.shape,
                chart: chart.isBlazor ? {} as Chart : chart, series: series, points: [point], name: legendClick, cancel: false
            };
            this.chart.trigger(legendClick, legendClickArgs);
            if (chart.legendSettings.toggleVisibility) {
                point.visible = !point.visible;
                const legendOption: LegendOptions = this.legendCollections[index];
                legendOption.visible = point.visible;
                this.refreshLegendToggle(chart, series);
            }
        } else if (chart.legendSettings.mode === 'Range') {
            const points: Points[] = [];
            const legendOption: LegendOptions = this.legendCollections[index];
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
            if (chart.legendSettings.toggleVisibility) {
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
        chart.rotatedDataLabelCollections = [];
        removeElement(getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]);
        blazorTemplatesReset(chart);
        this.redrawSeriesElements(series, chart);
        chart.removeSvg();
        chart.refreshAxis();
        series.refreshAxisLabel();
        this.refreshSeries(chart.visibleSeries);
        chart.markerRender.removeHighlightedMarker();
        chart.refreshBound();
        chart.trigger('loaded', { chart: chart });
        if (selectedDataIndexes.length > 0) {
            chart.selectionModule.selectedDataIndexes = selectedDataIndexes;
            chart.selectionModule.redrawSelection(chart, chart.selectionMode);
        }
        if (chart.highlightModule && chart.highlightMode !== 'None') {
            chart.highlightModule.redrawSelection(chart, chart.highlightMode);
        }
        chart.redraw = false;
    }

    private changeSeriesVisiblity(series: Series, visibility: boolean): void {
        series.visible = !visibility;
        if (this.isSecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some((value: Series) => (value.visible));
        }
        if (this.isSecondaryAxis(series.yAxis)) {
            series.yAxis.internalVisibility = series.yAxis.series.some((value: Series) => (value.visible));
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
            
            series.position = undefined;
        }
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
        const pageX: number = this.chart.mouseX;
        const pageY: number = this.chart.mouseY;
        let legendRegion: ILegendRegions[] = [];
        const targetId: string = (<HTMLElement>event.target).id;
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
            return (withInBounds(pageX, (pageY + (this.isPaging ? (this.currentPageNumber - 1) * this.translatePage(null, 1, 2) : 0)),
                                 region.rect));
        });
        if (legendRegion.length && (this.chart as Chart).enableCanvas) {
            this.LegendClick(legendRegion[0].index, event);
        }
    }
    /**
     * To check click position is within legend bounds
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
            // pagedown calculations are performing here
            if (--this.currentPageNumber > 0) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transparent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            } else {
                ++this.currentPageNumber;
            }
            return null;
        }
        if (withInBounds(pageX, pageY, this.pagingRegions[1])) {
            // pageUp calculations are performing here
            if (++this.currentPageNumber > 0 && this.currentPageNumber <= this.totalNoOfPages) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transpaent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            } else {
                --this.currentPageNumber;
            }
            return null;
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
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }

}
