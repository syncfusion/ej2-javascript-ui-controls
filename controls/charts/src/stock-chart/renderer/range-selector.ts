/**
 * Render range navigator for financial chart
 */
import { RangeNavigator } from '../../range-navigator/range-navigator';
import { RangeNavigatorSeriesModel } from '../../range-navigator/model/range-base-model';
import { RangeValueType } from '../../range-navigator/utils/enum';
import { IChangedEventArgs } from '../../range-navigator/model/range-navigator-interface';
import { remove } from '@syncfusion/ej2-base';
import { StockChart } from '../stock-chart';
import { StockSeriesModel } from '../model/base-model';
import { MarginModel } from '../../common/model/base-model';
import { getElement } from '../../common/utils/helper';
import { IRangeChangeEventArgs } from '../model/base';
import { Size } from '@syncfusion/ej2-svg-base';

/** @private */
export class RangeSelector {
    private stockChart: StockChart;
    constructor(stockChart: StockChart) {
        this.stockChart = stockChart;
    }

    public initializeRangeNavigator(): void {
        const stockChart: StockChart = this.stockChart;
        if (!stockChart.selectorObject) {
            stockChart.selectorObject = stockChart.renderer.createGroup({
                id: stockChart.element.id + '_stockChart_rangeSelector',
                transform: 'translate(' + 0 + ',' + stockChart.cartesianChart.cartesianChartSize.height + ')'
            });
            stockChart.mainObject.appendChild(stockChart.selectorObject);
        } else {
            const chartElement: Element = document.getElementById(stockChart.selectorObject.id);
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
            valueType: stockChart.primaryXAxis.valueType as RangeValueType,
            theme: this.stockChart.theme,
            series: this.findSeriesCollection(stockChart.series),
            height: this.calculateChartSize().height.toString(),
            value: [new Date(stockChart.startValue), new Date(stockChart.endValue)],
            margin : this.findMargin(),
            tooltip: { enable: stockChart.tooltip.enable, displayMode: 'Always' },
            dataSource: stockChart.dataSource,
            changed: (args: IChangedEventArgs) => {
                const arg: IRangeChangeEventArgs = {
                    name: 'rangeChange',
                    end : args.end,
                    selectedData : args.selectedData,
                    start : args.start,
                    zoomFactor : args.zoomFactor,
                    zoomPosition : args.zoomPosition,
                    data: undefined
                };
                this.stockChart.trigger('rangeChange', arg );
                this.stockChart.startValue = args.start  as number; this.stockChart.endValue = args.end as number;
                if (!this.stockChart.zoomChange) {
                    this.stockChart.cartesianChart.cartesianChartRefresh(this.stockChart, arg.data);
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

    private findMargin() : MarginModel {
        const margin : MarginModel = {};
        margin.top = 5;
        margin.left = 0;
        margin.right = 0;
        margin.bottom = 0;
        return margin;
    }

    private findSeriesCollection(series : StockSeriesModel[]) : RangeNavigatorSeriesModel[] {
        const chartSeries : RangeNavigatorSeriesModel[] = [];
        for (let i: number = 0, len: number = series.length; i < len; i++) {
            chartSeries.push(<RangeNavigatorSeriesModel>series[i as number]);
            chartSeries[i as number].xName = series[i as number].xName;
            chartSeries[i as number].yName = series[i as number].yName === '' ? series[i as number].close :  series[i as number].yName;
        }
        return chartSeries;
    }

    private calculateChartSize(): Size {
        const stockChart: StockChart = this.stockChart;
        return (
            new Size(stockChart.availableSize.width, (stockChart.enableSelector) ? 80 : 0)
        );
    }

    /**
     * Performs slider change
     *
     * @param {number} start slider start value
     * @param {number} end slider end value
     * @returns {void}
     */
    public sliderChange(start: number, end: number): void {
        this.stockChart.rangeNavigator.rangeSlider.performAnimation(start, end, this.stockChart.rangeNavigator, 0);
    }
}
