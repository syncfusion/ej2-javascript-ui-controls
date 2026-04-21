/**
 * Stock chart toolbar spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { DateTime, TrendlineTypes, Tooltip, RangeTooltip } from '../../src/index';
import { StockChart } from '../../src/stock-chart/index';
import { chartData } from './indicatordata.spec';
import { MouseEvents } from '../chart/base/events.spec';
import { IStockChartEventArgs } from '../../src/stock-chart/model/base';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines } from '../../src/index';
import { EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator } from '../../src/index';
import { AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator } from '../../src/index';
StockChart.Inject(DateTime, Tooltip, RangeTooltip, EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator);
StockChart.Inject(LineSeries, CandleSeries, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator);

describe('Stock chart', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
     }
    });
    describe('default stock chart', () => {
        let chart: StockChart;
        let chartElement: Element = createElement('div', { id: 'stock1' });
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let list: Element;
        document.body.appendChild(chartElement);
        beforeAll(() => {
            chart = new StockChart({
                primaryXAxis: { valueType: 'DateTime' },
                series: [{
                    xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close', volume: 'volume',
                    dataSource: chartData, type: 'Candle', yName: 'close', name: 'Apple Inc',
                }],
                enablePeriodSelector: true,
                seriesType : ['Line', 'Hilo', 'HiloOpenClose', 'Spline', 'Candle']
            });
            chart.appendTo('#stock1');
        });
        afterAll((): void => {
            chart.destroy();
            chartElement.remove();
        });
        it('checking with date range selection', (done: Function) => {
            element = document.getElementById('stock1customRange');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-cell')[3];
            trigger.clickEvent(list);
            list = document.getElementsByClassName('e-cell')[20];
            trigger.clickEvent(list);
            expect(element != null).toBe(true);
            done();
        });
        it('checking with Ema Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[0];
            trigger.clickEvent(list);
            expect(chart.indicators[0].type == 'Ema').toBe(true);
            done();
        });
        it('checking with mouse leave', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.mousemoveEvent(element,0,0,5,5);
            trigger.mouseLeaveEvent(element);
            done();
        });
        it('checking with Tma Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[1];
            trigger.clickEvent(list);
            expect(chart.indicators[1].type == 'Tma').toBe(true);
            done();
        });
        it('checking with Sma Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[2];
            trigger.clickEvent(list);
            expect(chart.indicators[2].type == 'Sma').toBe(true);
            done();
        });
        it('checking with Momentum Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[3];
            trigger.clickEvent(list);
            expect(chart.indicators[3].type == 'Momentum').toBe(true);
            done();
        });
        it('checking with Atr Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[4];
            trigger.clickEvent(list);
            expect(chart.indicators[4].type == 'Atr').toBe(true);
            done();
        });
        it('checking with AccumulationDistribution Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[5];
            trigger.clickEvent(list);
            expect(chart.indicators[5].type == 'AccumulationDistribution').toBe(true);
            done();
        });
        it('checking with BollingerBands Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[6];
            trigger.clickEvent(list);
            expect(chart.indicators[6].type == 'BollingerBands').toBe(true);
            done();
        });
        it('checking with Macd Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[7];
            trigger.clickEvent(list);
            expect(chart.indicators[7].type == 'Macd').toBe(true);
            done();
        });
        it('checking with Stochastic Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[8];
            trigger.clickEvent(list);
            expect(chart.indicators[8].type == 'Stochastic').toBe(true);
            done();
        });
        it('checking with Rsi Indicator selection', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[9];
            trigger.clickEvent(list);
            expect(chart.indicators[9].type == 'Rsi').toBe(true);
            done();
        });
        it('checking with tick mark in Ema Indicator while selected', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[0];
            expect(list.textContent !== 'Ema').toBe(true);
            done();
        });
        it('checking with tick mark in Ema Indicator while unselected', (done: Function) => {
            list = document.getElementsByClassName('e-item')[0];
            trigger.clickEvent(list);
            expect(list.textContent !== 'Ema').toBe(true);
            done();
        });
        it('checking with tick mark in Macd Indicator while unselected', (done: Function) => {
            element = document.getElementById('stock1_indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[7];
            trigger.clickEvent(list);
            expect(list.textContent !== 'Macd').toBe(true);
            done();
        });
        // it('checking with export type', (done: Function) => {
        //     element = document.getElementById('stock1_export');
        //     console.log( 'Export element:' + element);
        //     if (element) {
        //         trigger.clickEvent(element);
        //     }
        //     let element2 = document.getElementsByClassName('e-item')[0];
        //     console.log('Export element:' + element2);
        //     if (element2) {
        //         trigger.clickEvent(element2);
        //     }
        //     expect(element!=null).toBe(true);
        //     done();
        // });
        it('checking with periodselector', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('stock1_indicatorType');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.periods = [{ text: 'all', selected: true }];
            chart.refresh();
        });
        it('checking with periodselector', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('stock1_indicatorType');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.periods = [{ text: '3M', selected: true }];
            chart.refresh();
        });
        it('checking with trendline type', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('stock1_indicatorType');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.periods = [{ text: '3M', selected: true }];
            chart.trendlineType = ['Linear', 'Exponential', 'Polynomial', 'Power', 'Logarithmic', 'MovingAverage'];
            chart.refresh();
        });
        it('checking with trendline type', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                let element = document.getElementById('stock1_seriesType');
                let index = 64 
                trigger.clickEvent(element);
                index = document.getElementsByClassName('e-item')[70]?70:index;
                list = document.getElementsByClassName('e-item')[index]
                trigger.clickEvent(list);
                expect(element!=null).toBe(true);                   
                done();
            }
            chart.refresh();
        });
        it('checking with stock chart trendline', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                element = document.getElementById('stock1_trendType');
                var exportArgument = { item: { text: 'CSV' } };
                if (document.getElementById('stock1_export')) {
                    (document.getElementById('stock1_export') as any).ej2_instances[0].select(exportArgument);
                }
                expect(chart !== null).toBe(true);
                done();
            }
            chart.legendSettings = { visible: true };
            chart.series[0].animation = { enable: false, duration: 0 };
            chart.background = 'Red';
            chart.trendlineType = ['Linear', 'Exponential', 'Polynomial', 'Power', 'Logarithmic', 'MovingAverage'];
            chart.refresh();
        });
        it('checking with stock toolbar print', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                element = document.getElementById('stock1_trendType');
                var exportArgument = { item: { text: 'Print' } };
                if (document.getElementById('stock1_export')) {
                    (document.getElementById('stock1_export') as any).ej2_instances[0].select(exportArgument);
                }
                expect(chart !== null).toBe(true);
                done();
            }
            chart.refresh();
        });
        it('checking with stock chart toolbar trend ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                var exportArgument: any = { item: { text: '&nbsp;&nbsp;&nbsp;Linear' } };
                if (document.getElementById('stock1_trendType')) {
                    exportArgument.item.parentObj = (document.getElementById('stock1_trendType') as any).ej2_instances[0];
                    (document.getElementById('stock1_trendType') as any).ej2_instances[0].select(exportArgument);
                }
                expect(chart !== null).toBe(true);
                done();
            }
            chart.legendSettings = { visible: true };
            chart.series[0].animation = { enable: false, duration: 0 };
            chart.background = 'Red';
            chart.trendlineType = ['Linear', 'Exponential', 'Polynomial', 'Power', 'Logarithmic', 'MovingAverage'];
            chart.seriesType = ['Line', 'Hilo', 'HiloOpenClose', 'Spline', 'Candle'];
            chart.refresh();
        });
        it('checking with stock chart toolbar series ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                var exportArgument: any = { item: { text: '&nbsp;&nbsp;&nbsp;Line' } };
                if (document.getElementById('stock1_seriesType')) {
                    exportArgument.item.parentObj = (document.getElementById('stock1_seriesType') as any).ej2_instances[0];
                    (document.getElementById('stock1_seriesType') as any).ej2_instances[0].select(exportArgument);
                }
                expect(chart !== null).toBe(true);
                done();
            }
            chart.legendSettings = { visible: true };
            chart.series[0].animation = { enable: false, duration: 0 };
            chart.background = 'Red';
            chart.trendlineType = ['Linear', 'Exponential', 'Polynomial', 'Power', 'Logarithmic', 'MovingAverage'];
            chart.seriesType = ['Line', 'Hilo', 'HiloOpenClose', 'Spline', 'Candle'];
            chart.refresh();
        });
        it('checking with toolbar range ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                args.stockChart.toolbarSelector.findRange(30, 30);
                args.stockChart.toolbarSelector.findRange(0, 15770000000);
                args.stockChart.toolbarSelector.findRange(0, 86400004);
                var tick: any = { item: { parentObj: { items: [] }, text: '1M' } };
                args.stockChart.toolbarSelector.tickMark(tick);
                expect(chart !== null).toBe(true);
                done();
            }
            chart.refresh();
        });
        it('checked with custom range', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('stock1customRange');
                expect(element).not.toEqual(null);
                if (element) {
                    trigger.clickEvent(element);
                }
                list = document.getElementsByClassName('e-day')[44];
                if (list) {
                    trigger.clickEvent(list);
                }
                list = document.getElementsByClassName('e-day')[60];
                if (list) {
                    trigger.clickEvent(list);
                }
                list = document.getElementsByClassName('e-footer')[0].getElementsByClassName('e-apply')[0];
                if (list) {
                    trigger.clickEvent(list);
                }
                done();
            };
            chart.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average !== null).toBe(true);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
