/**
 * Cartesian chart renderer for financial chart
 */
import { Chart, Series, getElement } from '../../index';
import { StockChart } from '../stock-chart';
import { Size } from '@syncfusion/ej2-svg-base';
import { IZoomCompleteEventArgs, Axis, VisibleRangeModel, ILoadedEventArgs, IPointEventArgs } from '../../chart/index';
import { remove, extend } from '@syncfusion/ej2-base';
import { StockSeriesModel } from '../model/base-model';
import { ITooltipRenderEventArgs, IAxisLabelRenderEventArgs, ISeriesRenderEventArgs } from '../../chart/model/chart-interface';
import { MarginModel } from '../../chart';
import { DataManager } from '@syncfusion/ej2-data';

interface Range {
    start: number;
    end: number;
}
/** @private */
export class CartesianChart {
    private stockChart: StockChart;
    public cartesianChartSize: Size;
    constructor(chart: StockChart) {
        this.stockChart = chart;
    }
    public initializeChart(): void {
        let stockChart: StockChart = this.stockChart;
        if (!stockChart.chartObject) {
            stockChart.chartObject = stockChart.renderer.createGroup({
                id: stockChart.element.id + '_stockChart_chart'
            });
            stockChart.mainObject.appendChild(stockChart.chartObject);
        } else {
            let chartElement: Element = document.getElementById(stockChart.chartObject.id);
            while (chartElement.firstChild) {
                chartElement.removeChild(chartElement.firstChild);
            }
            if (getElement(stockChart.chartObject + '_tooltip')) {
                remove(getElement(stockChart.chartObject + '_tooltip'));
            }
        }

        this.cartesianChartSize = this.calculateChartSize();
        stockChart.chart = new Chart({
            load: (args: ILoadedEventArgs) => {
                if (stockChart.tooltip.header === null) {
                    args.chart.tooltip.header = '<b>${point.x}</b>';
                }
                if (stockChart.tooltip.format === null) {
                    args.chart.tooltip.format = 'High : <b>${point.high}</b><br/>Low :' +
                        ' <b>${point.low}</b><br/>Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b>';
                    if (stockChart.series[0].volume !== '') {
                        args.chart.tooltip.format += '<br/>Volume : <b>${point.volume}</b>';
                    }
                }
            },
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
                this.stockChart.trigger('seriesRender', args);
            },
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
                if (args.axis.valueType === 'DateTime' && stockChart.rangeNavigator) {
                    this.stockChart.zoomChange = true;
                    let newRange: Range = this.calculateUpdatedRange(args.currentZoomFactor, args.currentZoomPosition, <Axis>args.axis);
                    stockChart.rangeSelector.sliderChange(newRange.start, newRange.end);
                }
            },
        });
        if (stockChart.indicators.length !== 0) {
            if (stockChart.isSelect) {
                for (let i: number = 0; i < stockChart.indicators.length; i++) {
                    stockChart.chart.indicators[i].animation.enable = false;
                    stockChart.chart.indicators[i].dataSource = extend([], stockChart.chart.series[0].dataSource, null, true);
                }
            }
            stockChart.isSelect = true;
        }
        stockChart.chart.stockChart = stockChart;
        stockChart.chart.appendTo(stockChart.chartObject as HTMLElement);
    }

    private findMargin(stockChart: StockChart) : MarginModel {
        let margin : MarginModel = {};
        margin.top = stockChart.margin.top * 2;
        margin.left = stockChart.margin.left;
        margin.right = stockChart.margin.right;
        margin.bottom = stockChart.margin.bottom;
        return margin;
    }

    private findSeriesCollection(series: StockSeriesModel[]) : Series[] {
        let chartSeries : Series[] = [];
        for (let i: number = 0, len: number = series.length; i < len; i++) {
            chartSeries.push(<Series>series[i]);
            chartSeries[i].high = series[i].high;
            chartSeries[i].low = series[i].low;
            chartSeries[i].open = series[i].open;
            chartSeries[i].close = series[i].close;
            chartSeries[i].xName = series[i].xName;
            chartSeries[i].volume = series[i].volume;
            if (chartSeries[i].type !== 'HiloOpenClose' && chartSeries[i].type !== 'Candle' && chartSeries[i].yName === 'volume') {
                chartSeries[i].enableTooltip = false;
            }
        }
        return chartSeries;
    }

    public calculateChartSize(): Size {
        let stockChart: StockChart = this.stockChart;
        return (
            new Size(
                stockChart.availableSize.width, (stockChart.enablePeriodSelector && stockChart.enableSelector) ?
                ((stockChart.availableSize.height - stockChart.toolbarHeight - 80)) :
                (stockChart.enableSelector && !stockChart.enablePeriodSelector) ? (stockChart.availableSize.height - 80) :
                (stockChart.enablePeriodSelector && !stockChart.enableSelector) ?
                    stockChart.availableSize.height - stockChart.toolbarHeight : stockChart.availableSize.height)
        );
    }

    private calculateUpdatedRange(zoomFactor: number, zoomPosition: number, axis: Axis): Range {
        let start: number;
        let end: number;
        //if (zoomFactor < 1 || zoomPosition > 0) {
        let chartRange: VisibleRangeModel = axis.actualRange;
        let inversed: boolean = false;
        if (!inversed) {
            start = chartRange.min + zoomPosition * chartRange.delta;
            end = start + zoomFactor * chartRange.delta;
        } else {
            start = chartRange.max - (zoomPosition * chartRange.delta);
            end = start - (zoomFactor * chartRange.delta);
        }
        //}
        let result: Range = { start: start, end: end };
        return result;
    }

    /**
     * Cartesian chart refreshes based on start and end value
     * @param stockChart
     * @param start
     * @param end
     */
    public cartesianChartRefresh(stockChart: StockChart, start: number, end: number, data?: Object[]): void {
        stockChart.chart.series.forEach((series: Series) => {
            series.dataSource = data ? data : ((stockChart.blazorDataSource[series.index] ||
                this.checkDataSource(stockChart.tempDataSource[series.index]) || this.checkDataSource(stockChart.dataSource)) as Object[])
            .filter((data: Object) => {
                return (
                    new Date(Date.parse(data[series.xName])).getTime() >= start &&
                    new Date(Date.parse(data[series.xName])).getTime() <= end
                    );
            });
            series.animation.enable = false;
            if (series.trendlines.length !== 0) {
                for ( let trendLine of series.trendlines) {
                    trendLine.animation.enable = false;
                }
            }
        });
        stockChart.cartesianChart.initializeChart();
    }

    private checkDataSource(data: Object[] | DataManager | Object): Object[] {
        if (data instanceof DataManager) {
            return(data.dataSource.json);
        } else {
            return data as Object[];
        }
    }

    private copyObject(originalObject: Object): Object {
        return (extend({}, originalObject, {}, true));
    }
}