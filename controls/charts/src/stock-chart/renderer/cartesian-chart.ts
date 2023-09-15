/**
 * Cartesian chart renderer for financial chart
 */
import { Chart } from '../../chart/chart';
import { Series } from '../../chart/series/chart-series';
import { StockChart } from '../stock-chart';
import { Size } from '@syncfusion/ej2-svg-base';
import { Axis, VisibleRangeModel } from '../../chart/axis/axis';
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
            seriesRender : (args : ISeriesRenderEventArgs) => {
                startValue = (this.stockChart.startValue != null && this.stockChart.isDateTimeCategory) ?
                    this.stockChart.sortedData[Math.floor(this.stockChart.startValue)] : this.stockChart.startValue;
                endValue = (this.stockChart.endValue != null && this.stockChart.isDateTimeCategory) ?
                    this.stockChart.sortedData[Math.floor(this.stockChart.endValue)] : this.stockChart.endValue;
                if (args.data && startValue && endValue) {
                    args.data = (args.data as Object[])
                        .filter((data: Object) => {
                            return (
                                new Date( DataUtil.parse.parseJson({ val: (data[args.series.xName]) }).val
                                ).getTime() >= startValue &&
                                new Date( DataUtil.parse.parseJson({ val: (data[args.series.xName]) }).val
                                ).getTime() <= endValue
                            );
                        });
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
            zoomComplete: (args: IZoomCompleteEventArgs) => {
                if (args.axis.valueType.indexOf('DateTime') !== -1 && stockChart.rangeNavigator) {
                    this.stockChart.zoomChange = true;
                    const newRange: Range = this.calculateUpdatedRange(args.currentZoomFactor, args.currentZoomPosition, <Axis>args.axis);
                    stockChart.rangeSelector.sliderChange(newRange.start, newRange.end);
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
