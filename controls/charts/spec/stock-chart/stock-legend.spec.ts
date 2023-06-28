/**
 * Stock chart test cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { CandleSeries, DateTime, getElement, Tooltip, RangeTooltip, Zoom} from '../../src/index';
import { HiloOpenCloseSeries, HiloSeries, LineSeries, SplineAreaSeries, SplineSeries, StockChart, StockLegend } from '../../src/stock-chart/index';
import { chartData} from './indicatordata.spec';
import { IStockChartEventArgs, IRangeChangeEventArgs } from '../../src/stock-chart/model/base';
import { MouseEvents } from '../chart/base/events.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
StockChart.Inject(CandleSeries, DateTime, Tooltip, RangeTooltip, Zoom, StockLegend);
StockChart.Inject(HiloOpenCloseSeries, HiloSeries, SplineAreaSeries, SplineSeries, LineSeries);
describe('Stock Chart with Legend', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    // eslint-disable-next-line @typescript-eslint/indent
    describe('stock chart', () => {
        let chart: StockChart;
        let chartElement: Element = createElement('div', { id: 'stock' });
        let trigger: MouseEvents = new MouseEvents();
        let seriesCollection: HTMLElement;
        let seriesElement: HTMLElement;
        let textElement: HTMLElement;
        let shapeElement: HTMLElement;
        let element: Element;
        let titleElement: Element;
        let xValue: string;
        let yValue: string;
        let id: string = 'stock';
        let legendId: string = id + '_chart_legend';
        let legendElement: Element;
        let prevent: Function = (): void => {
        };
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chart = new StockChart({
                primaryXAxis: { valueType: 'DateTime' },
                series: [{
                    xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    dataSource: chartData, type: 'Candle', yName: 'close'
                }],
            });
        });
        afterAll((): void => {
            chart.destroy();
            chartElement.remove();
        });
        it('Checking accumulation instance creation', (done: Function) => {
            chart.loaded = (args: Object): void => {
                expect(chart != null).toBe(true);
                done();
            };
            chart.appendTo('#stock');
        });
        it('checking with legend visible as False', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(2);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Candle', yName: 'close'
            }];
            chart.legendSettings.visible = false;
            chart.refresh();
        });
        it('checking with legend visible as True', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Candle', yName: 'close', name: 'StockChart'
            }];
            chart.legendSettings.visible = true;
            chart.refresh();
        });
        it('checking with series type as Candle', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Candle', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with series type as Hilo', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Hilo', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with series type as HiloOpenClose', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'HiloOpenClose', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with series type as Line', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Line', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with series type as Spline', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Spline', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with series type as SplineArea', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'SplineArea', yName: 'close', name: 'StockChart'
            }];
            chart.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                element = getElement('stock_stockChart_svg');
                expect(element.childElementCount).toEqual(4);
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Line', yName: 'high', name: 'StockChart-1'
            },
            {
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Spline', yName: 'close', name: 'StockChart-2'
            }];
            chart.refresh();
        });
        it('checking with legend shape as Circle ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('ellipse');
                expect(legendElement.getAttribute('rx')).toEqual('5');
                expect(legendElement.getAttribute('ry')).toEqual('5');
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Spline', yName: 'close', name: 'StockChart'
            }];
            chart.series[0].legendShape = 'Circle';
            chart.refresh();
        });
        it('checking with legend shape as Rectangle ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'Rectangle';
            chart.refresh();
        });
        it('checking with legend shape as Cross ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'Cross';
            chart.refresh();
        });
        it('checking with legend shape as Diamond ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'Diamond';
            chart.refresh();
        });
        it('checking with legend shape as HorizontalLine ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'HorizontalLine';
            chart.refresh();
        });
        it('checking with legend shape as VerticalLine ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'VerticalLine';
            chart.refresh();
        });
        it('checking with legend shape as Triangle ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'Triangle';
            chart.refresh();
        });
        it('checking with legend shape as InvertedTriangle ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'InvertedTriangle';
            chart.refresh();
        });
        it('checking with legend shape as Pentagon ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_shape_0');
                expect(legendElement.tagName).toEqual('path');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                done();
            };
            chart.series[0].legendShape = 'Pentagon';
            chart.refresh();
        });
        it('checking with legend with Height only ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('height'), 10)).toEqual(100);
                done();
            };
            chart.series[0].legendShape = 'SeriesType';
            chart.legendSettings.border.color = 'red';
            chart.legendSettings.border.width = 1;
            chart.legendSettings = {height: '100'};
            chart.refresh();
        });
        it('checking with legend with Width only ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('width'), 10)).toEqual(240);
                done();
            };
            chart.legendSettings = {height: null, width: '240'};
            chart.refresh();
        });
        it('checking with legend with Width and Height ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('width'), 10)).toEqual(240);
                expect(parseInt(legendElement.getAttribute('height'), 10)).toEqual(100);
                done();
            };
            chart.legendSettings = {height: '100', width: '240'};
            chart.refresh();
        });
        it('checking with legend in position Bottom and alignment Near ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '0.5' || xValue === '1').toBe(true);
                expect(yValue === '374' || yValue === '375').toBe(true);
                done();
            };
            chart.legendSettings = {height: null, width: null};
            chart.legendSettings.border.color = '';
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.alignment = 'Near';
            chart.refresh();
        });
        it('checking with legend in position Bottom and alignment Center ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '703.5' || xValue === '336').toBe(true);
                expect(yValue === '374' || yValue === '375').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.alignment = 'Center';
            chart.refresh();
        });
        it('checking with legend in position Bottom and alignment Far ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1406' || xValue === '671').toBe(true);
                expect(yValue === '374' || yValue === '375').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.alignment = 'Far';
            chart.refresh();
        });
        it('checking with legend in position Top and alignment Near ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1').toBe(true);
                expect(yValue === '2.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.alignment = 'Near';
            chart.refresh();
        });
        it('checking with legend in position Top and alignment Center ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '703.5' || xValue === '336').toBe(true);
                expect(yValue === '2.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.alignment = 'Center';
            chart.refresh();
        });
        it('checking with legend in position Top and alignment Far ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1406' || xValue === '671').toBe(true);
                expect(yValue === '2.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.alignment = 'Far';
            chart.refresh();
        });
        it('checking with legend in position Left and alignment Near ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1').toBe(true);
                expect(yValue === '1.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.alignment = 'Near';
            chart.refresh();
        });
        it('checking with legend in position Left and alignment Center ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1').toBe(true);
                expect(yValue === '183.25' || yValue === '183.75').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.alignment = 'Center';
            chart.refresh();
        });
        it('checking with legend in position Left and alignment Far ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1').toBe(true);
                expect(yValue === '365' || yValue === '366').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.alignment = 'Far';
            chart.refresh();
        });
        it('checking with legend in position Right and alignment Near ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1406' || xValue === '671').toBe(true);
                expect(yValue === '1.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.alignment = 'Near';
            chart.refresh();
        });
        it('checking with legend in position Right and alignment Center ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1406' || xValue === '671').toBe(true);
                expect(yValue === '183.25' || yValue === '183.75').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.alignment = 'Center';
            chart.refresh();
        });
        it('checking with legend in position Right and alignment Far ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                legendElement = document.getElementById(legendId + '_element');
                xValue = legendElement.getAttribute('x');
                yValue = legendElement.getAttribute('y');
                expect(xValue === '1406' || xValue === '671').toBe(true);
                expect(yValue === '365' || yValue === '366').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.alignment = 'Far';
            chart.refresh();
        });
        it('checking with legend title content ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                expect(titleElement.textContent === 'Legend Title').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.alignment = 'Center';
            chart.legendSettings.title = 'Legend Title';
            chart.legendSettings.titlePosition = 'Top';
            chart.refresh();
        });
        it('checking with legend bottom and title Top ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '632' || xValue === '379' || xValue === '384.5').toBe(true);
                expect(yValue === '369' || yValue === '370').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.titlePosition = 'Top';
            chart.refresh();
        });
        it('checking with legend bottom and title Right ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '764.5' || xValue === '395.5').toBe(true);
                expect(yValue === '394.75'|| yValue === '395').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.titlePosition = 'Right';
            chart.refresh();
        });
        it('checking with legend bottom and title Left ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '668.5' || xValue === '298.5').toBe(true);
                expect(yValue === '394.75'|| yValue === '395').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Bottom';
            chart.legendSettings.titlePosition = 'Left';
            chart.refresh();
        });
        it('checking with legend Top and title Top ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '632' || xValue === '379' || xValue === '384.5').toBe(true);
                expect(yValue === '18.5' || yValue === '19.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.titlePosition = 'Top';
            chart.refresh();
        });
        it('checking with legend Top and title Left ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '668.5' || xValue === '298.5').toBe(true);
                expect(yValue === '22.25' || yValue === '23.25' || yValue === '22.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.titlePosition = 'Left';
            chart.refresh();
        });
        it('checking with legend Top and title Right ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '764.5' || xValue === '395.5').toBe(true);
                expect(yValue === '22.25' || yValue === '23.25' || yValue === '22.5').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Top';
            chart.legendSettings.titlePosition = 'Right';
            chart.refresh();
        });
        it('checking with legend Right and title Top ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '1454' || xValue === '719.5').toBe(true);
                expect(yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.titlePosition = 'Top';
            chart.refresh();
        });
        it('checking with legend Right and title Left ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '1454' || xValue === '719.5').toBe(true);
                expect(yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.titlePosition = 'Left';
            chart.refresh();
        });
        it('checking with legend Right and title Right ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '1454' || xValue === '719.5').toBe(true);
                expect(yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Right';
            chart.legendSettings.titlePosition = 'Right';
            chart.refresh();
        });
        it('checking with legend Left and title Top ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '49.5' || xValue === '47.5').toBe(true);
                expect(yValue === '188.75' || yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.titlePosition = 'Top';
            chart.refresh();
        });
        it('checking with legend Left and title Left ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '49.5' || xValue === '47.5').toBe(true);
                expect(yValue === '188.75' || yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.titlePosition = 'Left';
            chart.refresh();
        });
        it('checking with legend Left and title Right ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                titleElement = document.getElementById('stock_chart_legend_title');
                xValue = titleElement.getAttribute('x');
                yValue = titleElement.getAttribute('y');
                expect(xValue === '49.5' || xValue === '47.5').toBe(true);
                expect(yValue === '188.75' || yValue === '189.25').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Left';
            chart.legendSettings.titlePosition = 'Right';
            chart.refresh();
        });
        it('checking with legend in Inversed ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                let legendText : Element = document.getElementById('stock_chart_legend_text_0');
                xValue = legendText.getAttribute('x');
                yValue = legendText.getAttribute('y');
                expect(xValue === '711.5' || xValue === '344').toBe(true);
                expect(yValue === '394.75' || yValue === '395').toBe(true);
                done();
            };
            chart.legendSettings.position = 'Auto';
            chart.legendSettings.title = null;
            chart.legendSettings.isInversed = true;
            chart.refresh();
        });
        it('checking series before legend click ', (done: Function) => {
            chart.loaded = (args: IStockChartEventArgs) => {
                seriesElement = document.getElementById('stock_stockChart_chartSeriesGroup1') as HTMLElement;
                seriesCollection = document.getElementById('stock_stockChart_chartSeriesCollection') as HTMLElement;
                done();
            };
            chart.series = [{
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Line', yName: 'high', name: 'StockChart-1'
            },
            {
                xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                dataSource: chartData, type: 'Spline', yName: 'close', name: 'StockChart-2'
            }];
            chart.legendSettings.isInversed = false;
            chart.refresh();
        });
        it('checking with legend click to deselect series', (done: Function) => {
            legendElement = document.getElementById('stock_chart_legend_text_1');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                seriesElement = document.getElementById('stock_stockChart_chartSeriesGroup1') as HTMLElement;
                seriesCollection = document.getElementById('stock_stockChart_chartSeriesCollection') as HTMLElement;
                expect(seriesCollection.childElementCount).toEqual(2);
                expect(seriesElement).toEqual(null);
                done();
            }, 301);
        });
        it('checking with legend click to deselect series', (done: Function) => {
            legendElement = document.getElementById('stock_chart_legend_text_1');
            trigger.clickEvent(legendElement);
            setTimeout(() => {
                seriesElement = document.getElementById('stock_stockChart_chartSeriesGroup1') as HTMLElement;
                seriesCollection = document.getElementById('stock_stockChart_chartSeriesCollection') as HTMLElement;
                expect(seriesCollection.childElementCount).toEqual(3);
                done();
            }, 301);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});