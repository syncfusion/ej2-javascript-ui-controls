/**
 * Stock chart toolbar spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { DateTime, TrendlineTypes, Tooltip, RangeTooltip } from '../../src/index';
import { StockChart } from '../../src/stock-chart/index';
import { chartData } from './indicatordata.spec';
import { MouseEvents } from '../chart/base/events.spec';
import { IStockChartEventArgs } from '../../src/stock-chart/model/base';
import { LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines } from '../../src/index';
import { EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator } from '../../src/index';
import { AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator } from '../../src/index';
StockChart.Inject(DateTime, Tooltip, RangeTooltip);
StockChart.Inject(LineSeries, CandleSeries);

describe('Stock chart', () => {
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
                enablePeriodSelector: true
            });
            chart.appendTo('#stock1');
        });
        afterAll((): void => {
            chart.destroy();
            chartElement.remove();
        });
        it('checking with Series button click', (done: Function) => {
            element = document.getElementById('seriesType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[0];
           // expect(list.textContent).toBe('Line');
            done();
        });
        it('checking with Hilo series selection', (done: Function) => {
            list = document.getElementsByClassName('e-item')[1];
            trigger.clickEvent(list);
            expect(chart.series[0].type == 'Hilo').toBe(true);
            done();
        });
        it('checking with HiloOpenClose series selection', (done: Function) => {
            element = document.getElementById('seriesType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[2];
            trigger.clickEvent(list);
            expect(chart.series[0].type == 'HiloOpenClose').toBe(true);
            done();
        });
        it('checking with Candle series selection', (done: Function) => {
            element = document.getElementById('seriesType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[3];
            trigger.clickEvent(list);
            expect(chart.series[0].type == 'Candle').toBe(true);
            expect(chart.series[0].enableSolidCandles == false).toBe(true);
            done();
        });
        it('checking with Spline series selection', (done: Function) => {
            element = document.getElementById('seriesType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[4];
            trigger.clickEvent(list);
            expect(chart.series[0].type == 'Spline').toBe(true);
            done();
        });
        it('checking with Candle series selection', (done: Function) => {
            element = document.getElementById('seriesType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[5];
            trigger.clickEvent(list);
            expect(chart.series[0].type == 'Candle').toBe(true);
            done();
        });
        it('checking with Ema Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[0];
            trigger.clickEvent(list);
            expect(chart.indicators[0].type == 'Ema').toBe(true);
            done();
        });
        it('checking with Tma Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[1];
            trigger.clickEvent(list);
            expect(chart.indicators[1].type == 'Tma').toBe(true);
            done();
        });
        it('checking with Sma Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[2];
            trigger.clickEvent(list);
            expect(chart.indicators[2].type == 'Sma').toBe(true);
            done();
        });
        it('checking with Momentum Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[3];
            trigger.clickEvent(list);
            expect(chart.indicators[3].type == 'Momentum').toBe(true);
            done();
        });
        it('checking with Atr Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[4];
            trigger.clickEvent(list);
            expect(chart.indicators[4].type == 'Atr').toBe(true);
            done();
        });
        it('checking with AccumulationDistribution Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[5];
            trigger.clickEvent(list);
            expect(chart.indicators[5].type == 'AccumulationDistribution').toBe(true);
            done();
        });
        it('checking with BollingerBands Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[6];
            trigger.clickEvent(list);
            expect(chart.indicators[6].type == 'BollingerBands').toBe(true);
            done();
        });
        it('checking with Macd Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[7];
            trigger.clickEvent(list);
            expect(chart.indicators[7].type == 'Macd').toBe(true);
            done();
        });
        it('checking with Stochastic Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[8];
            trigger.clickEvent(list);
            expect(chart.indicators[8].type == 'Stochastic').toBe(true);
            done();
        });
        it('checking with Rsi Indicator selection', (done: Function) => {
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[9];
            trigger.clickEvent(list);
            expect(chart.indicators[9].type == 'Rsi').toBe(true);
            done();
        });
        it('checking with tick mark in Ema Indicator while selected', (done: Function) => {
            element = document.getElementById('indicatorType');
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
            element = document.getElementById('indicatorType');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[7];
            trigger.clickEvent(list);
            expect(list.textContent !== 'Macd').toBe(true);
            done();
        });
        it('checking with export type', (done: Function) => {
            element = document.getElementById('export');
            trigger.clickEvent(element);
            list = document.getElementsByClassName('e-item')[0];
            //expect(list.textContent == 'PNG').toBe(true);
            done();
        });
        it('checking with print type', (done: Function) => {
            element = document.getElementById('print');
            expect(element.textContent == 'Print').toBe(true);
            done();
        });
        it('checking with reset', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                chart.loaded = null;
                element = document.getElementById('resetClick');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.refresh();
        });
        it('checking with periodselector', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('indicatorType');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.periods = [{ text: 'all', selected: true }];
            chart.refresh();
        });
        it('checking with periodselector', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = document.getElementById('indicatorType');
                trigger.clickEvent(element);
                expect(chart.series[0].type == 'Candle').toBe(true);
                done();
            }
            chart.periods = [{ text: '3M', selected: true }];
            chart.refresh();
        });
    });
});
