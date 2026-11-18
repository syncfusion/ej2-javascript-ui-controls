/**
 * Cartesian chart renderer for financial chart
 */
import { Chart } from '../../chart/chart';
import { Series } from '../../chart/series/chart-series';
import { StockChart } from '../stock-chart';
import { Size } from '@syncfusion/ej2-svg-base';
import { Axis } from '../../chart/axis/axis';
import { remove, extend } from '@syncfusion/ej2-base';
import { StockSeriesModel } from '../model/base-model';
import { ITooltipRenderEventArgs, IAxisLabelRenderEventArgs, IZoomCompleteEventArgs } from '../../chart/model/chart-interface';
import { ISeriesRenderEventArgs, IPointEventArgs, IZoomingEventArgs } from '../../chart/model/chart-interface';
import { StockSeries } from '../model/base';
import { onZooming } from '../../common/model/constants';
import { getElement } from '../../common/utils/helper';
import { MarginModel } from '../../common/model/base-model';
import { BaseLegend } from '../../common/legend/legend';
import { StockLegend } from '../legend/legend';
import { DataUtil } from '@syncfusion/ej2-data';
import { VisibleRangeModel, ICrosshairLabelRenderEventArgs  } from '../../common/model/interface';

interface Range {
    start: number;
    end: number;
}

/** @private */
export class CartesianChart {

    //Module Declaration of Chart.
    /**
     * `legendModule` is used to manipulate and add legend to the chart.
     */
    public stockLegendModule: StockLegend;

    /** @private */
    public legend: BaseLegend;
    private stockChart: StockChart;
    public cartesianChartSize: Size;
    constructor(chart: StockChart) {
        this.stockChart = chart;
    }
    public initializeChart(chartArgsData ?: object[]): void {
        const stockChart: StockChart = this.stockChart;
        const isProtect: string = 'isProtectedOnChange';
        let startValue: number = null;
        let endValue: number = null;
        stockChart[isProtect as string]  = true;
        if (!stockChart.chartObject) {
            stockChart.chartObject = stockChart.renderer.createGroup({
                id: stockChart.element.id + '_stockChart_chart'
            });
            stockChart.mainObject.appendChild(stockChart.chartObject);
        } else {
            const chartElement: Element = document.getElementById(stockChart.chartObject.id);
            while (chartElement.firstChild) {
                chartElement.removeChild(chartElement.firstChild);
            }
            if (getElement(stockChart.chartObject + '_tooltip')) {
                remove(getElement(stockChart.chartObject + '_tooltip'));
            }
        }

        this.stockChart.isDateTimeCategory = this.stockChart.primaryXAxis.valueType === 'DateTimeCategory';
        if (this.stockChart.isDateTimeCategory && !this.stockChart.sortedData.length) {
            for (const series of this.stockChart.series) {
                const dataSource: object[] = series.dataSource as object[];
                const xName: string = series.xName;
                for (const dataItem of dataSource) {
                    const currentData: number = Date.parse(
                        new Date(DataUtil.parse.parseJson({ val: dataItem[xName as string] }).val).toString()
                    );
                    if (this.stockChart.sortedData.indexOf(currentData) === -1) {
                        this.stockChart.sortedData.push(currentData);
                    }
                }
            }
            this.stockChart.sortedData.sort((a: number, b: number) => a - b);
        }
        this.cartesianChartSize = this.calculateChartSize();
        stockChart.chart = new Chart({
            chartArea : stockChart.chartArea,
            margin : this.findMargin(stockChart),
            primaryXAxis: this.copyObject(stockChart.primaryXAxis),
            primaryYAxis: this.copyObject(stockChart.primaryYAxis),
            rows: stockChart.rows,
            indicators: stockChart.indicators,
            axes: stockChart.axes,
            tooltipRender : (args : ITooltipRenderEventArgs) => {
                this.stockChart.trigger('tooltipRender', args);
            },
            axisLabelRender : (args : IAxisLabelRenderEventArgs) => {
                this.stockChart.trigger('axisLabelRender', args);
            },
            crosshairLabelRender : (args: ICrosshairLabelRenderEventArgs) => {
                this.stockChart.trigger('crosshairLabelRender', args);
            },
            seriesRender : (args : ISeriesRenderEventArgs) => {
                const _startValue: number = this.stockChart.startValue;
                const _endValue: number = this.stockChart.endValue;
                startValue = (_startValue != null && this.stockChart.isDateTimeCategory) ?
                    this.stockChart.sortedData[Math.floor(_startValue)] : _startValue;
                endValue = (_endValue != null && this.stockChart.isDateTimeCategory) ?
                    this.stockChart.sortedData[Math.floor(_endValue)] : _endValue;
                // PERF: resolve visible X range with explicit null checks
                // (the original used truthy `startValue && endValue`,
                // which would treat 0/wrong-type as falsy and silently
                // skip filtering — keep that semantic by treating
                // non-number as 'no filter').
                const hasStart: boolean = startValue != null && !isNaN(Number(startValue));
                const hasEnd: boolean = endValue != null && !isNaN(Number(endValue));
                if (args.data && hasStart && hasEnd) {
                    const numStart: number = Number(startValue);
                    const numEnd: number = Number(endValue);
                    const source: Object[] = (args.series.liveCompleteData as Object[]) || (args.data as Object[]);
                    const xName: string = args.series.xName;
                    const hasJsonParse: boolean = !!(DataUtil && DataUtil.parse && typeof DataUtil.parse.parseJson === 'function');
                    // PERF: All-range fast path. When the supplied range
                    // already covers the full extent of the source
                    // collection, assign the source directly instead of
                    // materialising a fresh 525,600-item filtered array.
                    // Guard: numeric X, ascending data, first and last
                    // samples bracket [numStart, numEnd]. Anything else
                    // (Date objects, ISO strings, partial ranges, empty
                    // source) falls through to the dispatching loop.
                    let isAllRange: boolean = false;
                    if (source.length > 0
                        && typeof numStart === 'number'
                        && typeof numEnd === 'number'
                        && !isNaN(numStart)
                        && !isNaN(numEnd)) {
                        const firstRawX: any = source[0][xName as string];
                        const lastRawX: any = source[source.length - 1][xName as string];
                        const firstTime: number | null = (typeof firstRawX === 'number') ? firstRawX
                            : (firstRawX instanceof Date) ? firstRawX.getTime()
                                : null;
                        const lastTime: number | null = (typeof lastRawX === 'number') ? lastRawX
                            : (lastRawX instanceof Date) ? lastRawX.getTime()
                                : null;
                        // PERF: All-range no-filter pass-through is only
                        // valid when the data range [firstTime, lastTime]
                        // is contained within the visible range
                        // [numStart, numEnd]. If the visible range is
                        // NARROWER than the data, points outside the
                        // range would leak through.
                        if (firstTime !== null
                            && lastTime !== null
                            && numStart <= firstTime
                            && numEnd >= lastTime) {
                            isAllRange = true;
                        }
                    }
                    if (isAllRange) {
                        args.data = source;
                    } else {
                        // PERF: collapse the per-row
                        //   new Date(DataUtil.parse.parseJson({val:x}).val).getTime()
                        // chain to a fast numeric dispatch. Avoids JSON
                        // serialization per row and avoids one Date + a
                        // getTime() call for the numeric / Date cases.
                        const filtered: Object[] = [];
                        for (const data of source) {
                            const rawX: any = data[xName as string];
                            let time: number;
                            if (typeof rawX === 'number') {
                                time = rawX;
                            } else if (rawX instanceof Date) {
                                time = rawX.getTime();
                            } else if (hasJsonParse) {
                                time = new Date(DataUtil.parse.parseJson({ val: rawX }).val).getTime();
                            } else {
                                time = new Date(rawX).getTime();
                            }
                            if (time >= numStart && time <= numEnd) {
                                filtered.push(data);
                            }
                        }
                        args.data = filtered;
                    }
                }
                args.data = chartArgsData ? chartArgsData : args.data;
                //args.data = this.stockChart.findCurrentData(args.data ,args.series.xName);
                this.stockChart.trigger('seriesRender', args);
            },
            onZooming: (args: IZoomingEventArgs) => { this.stockChart.trigger(onZooming, args); },
            pointClick: (args: IPointEventArgs) => {
                this.stockChart.trigger('pointClick', args);
            },
            pointMove: (args: IPointEventArgs) => {
                this.stockChart.trigger('pointMove', args);
            },
            dataSource: stockChart.dataSource,
            series: this.findSeriesCollection(stockChart.series),
            zoomSettings: this.copyObject(stockChart.zoomSettings),
            tooltip: stockChart.tooltip,
            crosshair: stockChart.crosshair,
            height: this.cartesianChartSize.height.toString(),
            selectedDataIndexes: stockChart.selectedDataIndexes,
            selectionMode: stockChart.selectionMode,
            isMultiSelect: stockChart.isMultiSelect,
            annotations: stockChart.annotations,
            theme: stockChart.theme,
            legendSettings: { visible: false},
            enableRtl: stockChart.enableRtl,
            zoomComplete: (args: IZoomCompleteEventArgs) => {
                if (args.axis.valueType.indexOf('DateTime') !== -1 && stockChart.rangeNavigator) {
                    this.stockChart.zoomChange = true;
                    const newRange: Range = this.calculateUpdatedRange(args.currentZoomFactor, args.currentZoomPosition, <Axis>args.axis);
                    stockChart.rangeSelector.sliderChange(newRange.start, newRange.end);
                }

                // Capture zoom state to preserve the user's zoom range while
                // live points are added. currentZoomFactor < 1 means the user
                // is zoomed in; >= 1 means zoomed out (back to full range).
                if (typeof args.currentZoomFactor !== 'undefined' && args.currentZoomFactor < 1) {
                    stockChart.activeSelectionMethod = 'zoom';
                    stockChart.isUserZoomed = true;
                    stockChart.isPeriodSelectorChange = false;
                    if (args.axis && args.axis.name === 'primaryXAxis') {
                        stockChart.savedZoomStart = (args.axis as Axis).visibleRange.min as number;
                        stockChart.savedZoomEnd = (args.axis as Axis).visibleRange.max as number;
                    } else if (stockChart.rangeNavigator && args.axis.name === 'primaryXAxis') {
                        stockChart.savedZoomStart = Number(stockChart.rangeNavigator.rangeSlider.currentStart);
                        stockChart.savedZoomEnd = Number(stockChart.rangeNavigator.rangeSlider.currentEnd);
                    }
                } else if (typeof args.currentZoomFactor !== 'undefined' && args.axis.name === 'primaryXAxis' && args.currentZoomFactor >= 1) {
                    stockChart.activeSelectionMethod = null;
                    stockChart.isUserZoomed = false;
                    stockChart.savedZoomStart = null;
                    stockChart.savedZoomEnd = null;
                }
            }
        });
        if (stockChart.indicators.length !== 0) {
            if (stockChart.isSelect) {
                for (let i: number = 0; i < stockChart.indicators.length; i++) {
                    stockChart.chart.indicators[i as number].animation.enable = false;
                    stockChart.chart.indicators[i as number].dataSource = extend([], stockChart.chart.series[0].dataSource, null, true);
                }
            }
            stockChart.isSelect = true;
        }
        stockChart.chart.stockChart = stockChart;
        stockChart.chart.appendTo(stockChart.chartObject as HTMLElement);
        stockChart[isProtect as string] = false;
        if (stockChart.onPanning) {
            getElement(this.stockChart.element.id + '_stockChart_chart').setAttribute('cursor', 'pointer');
            stockChart.chart.mouseMove(stockChart.mouseMoveEvent);
        }
    }

    private findMargin(stockChart: StockChart): MarginModel {
        const margin: MarginModel = {};
        margin.top = stockChart.stockLegendModule && stockChart.legendSettings.visible && stockChart.legendSettings.position === 'Top' ?
            stockChart.margin.top : stockChart.margin.top * 2;
        margin.left = stockChart.margin.left;
        margin.right = stockChart.margin.right;
        margin.bottom = stockChart.margin.bottom;
        return margin;
    }

    private findSeriesCollection(series: StockSeriesModel[]) : Series[] {
        const chartSeries : Series[] = [];
        for (let i: number = 0, len: number = series.length; i < len; i++) {
            chartSeries.push(<Series>series[i as number]);
            chartSeries[i as number].high = series[i as number].high;
            chartSeries[i as number].low = series[i as number].low;
            chartSeries[i as number].open = series[i as number].open;
            chartSeries[i as number].close = series[i as number].close;
            chartSeries[i as number].xName = series[i as number].xName;
            chartSeries[i as number].volume = series[i as number].volume;
            chartSeries[i as number].animation = series[i as number].animation;
            if ((series[i as number] as StockSeries).localData) {
                chartSeries[i as number].dataSource = (series[i as number] as StockSeries).localData;
            }
            chartSeries[i as number].yName = series[i as number].yName === '' ? series[i as number].close :  series[i as number].yName;
            chartSeries[i as number].splineType = chartSeries[i as number].type === 'Spline' ? 'Cardinal' : 'Natural';
        }
        return chartSeries;
    }

    public calculateChartSize(): Size {
        const stockChart: StockChart = this.stockChart;
        return (
            new Size(
                stockChart.availableSize.width, (stockChart.enablePeriodSelector && stockChart.enableSelector) ?
                    ((stockChart.availableSize.height - stockChart.toolbarHeight - 51)) :
                    (stockChart.enableSelector && !stockChart.enablePeriodSelector) ? (stockChart.availableSize.height - 51) :
                        (stockChart.enablePeriodSelector && !stockChart.enableSelector) ?
                            stockChart.availableSize.height - stockChart.toolbarHeight : stockChart.availableSize.height)
        );
    }

    private calculateUpdatedRange(zoomFactor: number, zoomPosition: number, axis: Axis): Range {
        let start: number;
        let end: number;
        //if (zoomFactor < 1 || zoomPosition > 0) {
        const chartRange: VisibleRangeModel = axis.actualRange;
        const inversed: boolean = false;
        if (!inversed) {
            start = chartRange.min + zoomPosition * chartRange.delta;
            end = start + zoomFactor * chartRange.delta;
        } else {
            start = chartRange.max - (zoomPosition * chartRange.delta);
            end = start - (zoomFactor * chartRange.delta);
        }
        //}
        if (this.stockChart.isDateTimeCategory) {
            start = this.stockChart.sortedData.indexOf(parseInt(axis.labels[Math.floor(start)], 10));
            end = this.stockChart.sortedData.indexOf(parseInt(axis.labels[Math.floor(end)], 10));
        }
        const result: Range = { start: start, end: end };
        return result;
    }

    /**
     * Cartesian chart refreshes based on start and end value
     *
     * @param {StockChart} stockChart stock chart instance
     * @param {Object[]} data stock chart data
     * @returns {void}
     */
    public cartesianChartRefresh(stockChart: StockChart, data?: Object[]): void {
        stockChart.cartesianChart.initializeChart(data);
    }

    private copyObject(originalObject: Object): Object {
        return (extend({}, originalObject, {}, true));
    }
}

