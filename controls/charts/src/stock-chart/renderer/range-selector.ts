/**
 * Render range navigator for financial chart
 */
import { RangeNavigator, RangeNavigatorSeriesModel, IChangedEventArgs, Size, getElement } from '../../index';
import { remove } from '@syncfusion/ej2-base';
import { StockChart } from '../stock-chart';
import { StockSeriesModel } from '../model/base-model';
import { MarginModel } from '../../chart';

export class RangeSelector {
    private stockChart: StockChart;
    constructor(stockChart: StockChart) {
        this.stockChart = stockChart;
    }

    public initializeRangeNavigator(): void {
        let stockChart: StockChart = this.stockChart;
        if (!stockChart.selectorObject) {
            stockChart.selectorObject = stockChart.renderer.createGroup({
                id: stockChart.element.id + '_stockChart_rangeSelector',
                transform: 'translate(' + 0 + ',' + stockChart.cartesianChart.cartesianChartSize.height + ')'
            });
            stockChart.mainObject.appendChild(stockChart.selectorObject);
        } else {
            let chartElement: Element = document.getElementById(stockChart.selectorObject.id);
            while (chartElement.firstChild) {
                chartElement.removeChild(chartElement.firstChild);
            }
            if (getElement(stockChart.selectorObject.id + '_leftTooltip')) {
                remove(getElement(stockChart.selectorObject.id + '_leftTooltip'));
            }
            if (getElement(stockChart.selectorObject.id + '_rightTooltip')) {
                remove(getElement(stockChart.selectorObject.id + '_rightTooltip'));
            }
        }
        stockChart.rangeNavigator = new RangeNavigator({
            locale: 'en',
            valueType: 'DateTime',
            theme: this.stockChart.theme,
            series: this.findSeriesCollection(stockChart.series),
            height: this.calculateChartSize().height.toString(),
            value: [new Date(stockChart.startValue), new Date(stockChart.endValue)],
            margin : this.findMargin(stockChart),
            tooltip: { enable: stockChart.tooltip.enable, displayMode: 'Always' },
            changed: (args: IChangedEventArgs) => {
                this.stockChart.startValue = args.start  as number; this.stockChart.endValue = args.end as number;
                if (!this.stockChart.zoomChange) {
                    this.stockChart.cartesianChart.cartesianChartRefresh(this.stockChart, args.start as number, args.end as number);
                }
                if (stockChart.periodSelector && stockChart.periodSelector.datePicker) {
                    stockChart.periodSelector.datePicker.startDate = new Date(args.start as number);
                    stockChart.periodSelector.datePicker.endDate = new Date(args.end as number);
                    stockChart.periodSelector.datePicker.dataBind();

                }
            }
        });
        stockChart.rangeNavigator.stockChart = stockChart;
        stockChart.rangeNavigator.appendTo(stockChart.selectorObject as HTMLElement);
    }

    private findMargin(stockChart: StockChart) : MarginModel {
        let margin : MarginModel = {};
        margin.top = 5;
        margin.left = 0;
        margin.right = 0;
        margin.bottom = 0;
        return margin;
    }

    private findSeriesCollection(series : StockSeriesModel[]) : RangeNavigatorSeriesModel[] {
        let chartSeries : RangeNavigatorSeriesModel[] = [];
        for (let i: number = 0, len: number = series.length; i < len; i++) {
            chartSeries.push(<RangeNavigatorSeriesModel>series[i]);
            chartSeries[i].xName = series[i].xName;
            chartSeries[i].yName = series[i].yName === '' ? series[i].close :  series[i].yName;
        }
        return chartSeries;
    }

    private calculateChartSize(): Size {
        let stockChart: StockChart = this.stockChart;
        return (
            new Size(stockChart.availableSize.width, (stockChart.enableSelector) ? 80 : 0)
        );
    }

    /**
     * Performs slider change
     * @param start 
     * @param end 
     */
    public sliderChange(start: number, end: number): void {
        this.stockChart.rangeNavigator.rangeSlider.performAnimation(start, end, this.stockChart.rangeNavigator, 0);
    }
}