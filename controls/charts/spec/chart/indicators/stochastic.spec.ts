/**
 * Test cases for Stochastic indicators
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { StochasticIndicator } from '../../../src/chart/technical-indicators/stochastic-indicator';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series } from '../../../src/chart/series/chart-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Zoom } from '../../../src/chart/user-interaction/zooming';

Chart.Inject(Legend, LineSeries, CandleSeries, Category, Tooltip, StochasticIndicator, Crosshair, Zoom);

let singleData: object[] = [{ x: 'Jan', low: 40, high: 100, open: 50, close: 70 }];

let prevent: Function = (): void => {
    //Prevent Function
};
export interface Wheel {
    preventDefault: Function;
    wheelDelta: number;
    detail: number;
    clientX: number;
    clientY: number;
}

let financialData: object[] = [
    { x: 'Jan', high: 125.45, low: 70.23, open: 125.22, close: 90.44 },
    { x: 'Feb', high: 150.99, low: 60.23, open: 120.55, close: 70.90 },
    { x: 'Mar', high: 200.19, low: 130.37, open: 160.13, close: 190.78 },
    { x: 'Apr', high: 160.23, low: 90.16, open: 140.38, close: 110.24 },
    { x: 'May', high: 200.89, low: 100.23, open: 180.90, close: 120.29 },
    { x: 'Jun', high: 100, low: 45, open: 70, close: 50 },
    { x: 'Jul', high: 150, low: 70, open: 140, close: 130 },
    { x: 'Aug', high: 90, low: 60, open: 65, close: 80 },
    { x: 'Sep', high: 225, low: 170, open: 175, close: 220 },
    { x: 'Oct', high: 250, low: 180, open: 223, close: 190 },
    { x: 'Nov', high: 200.12, low: 140.69, open: 160.74, close: 190.28 },
    { x: 'Dec', high: 160.17, low: 90.67, open: 140.26, close: 110.34 }
];

describe('Chart', () => {
    let element: HTMLElement;

    describe('Stochastic Indicators', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        name: 'gold',
                        type: 'Candle', animation: { enable: false }
                    }],
                    indicators: [{
                        type: 'Stochastic',
                        period: 3, animation: { enable: false }
                    }],
                    width: '800',
                    title: 'Chart TS Title'

                });
            chartObj.appendTo('#container');
            
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('stochastic Indicators without series', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator for a series with 0 points', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                done();
            };
            chartObj.indicators[0].seriesName = 'gold';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic Indicator for a series with 1 point', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                let seriesElements: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(seriesElements == 2).toBe(true);
                done();
            };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.indicators[0].field = 'Close';
            chartObj.series[0].dataSource = singleData;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('Stochastic indicator for a series with negative points', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                let point: HTMLElement = document.getElementById('container_Series_0_Point_4');
                expect(point != null).toBe(true);
                expect(chartObj.visibleSeries[3].points[2].y).toBe(80);
                expect(chartObj.visibleSeries[4].points[3].y).toBe(20);
                expect(point.getAttribute('d') !== null);
                done();

                //reset data source - removed negative point
                financialData.splice(5, 1);
                chartObj.series[0].dataSource = financialData;
            };
            financialData.splice(5, 0, { x: 'Negative', low: -10, high: 10, open: -5, close: 5, volume: 10 });
            chartObj.series[0].dataSource = financialData;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator for a series with valid points & primary axis', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(chartObj.visibleSeries[3].points[0].y).toBe(80);
                expect(chartObj.visibleSeries[4].points[0].y).toBe(20);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Jun');
                expect(chartObj.visibleSeries[2].points[0].x).toBe('Apr');
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.series[0].close = 'close';
            chartObj.indicators[0].kPeriod = 2;
            chartObj.indicators[0].dPeriod = 3;
            chartObj.indicators[0].showZones = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator with disabled show zones', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(3);
                let line: Element = document.getElementById('container_Indicator_0_UpperLine');
                expect(line).toBe(null);
                line = document.getElementById('container_Indicator_0_LowerLine');
                expect(line).toBe(null);
                chartObj.indicators[0].showZones = true;
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.series[0].close = 'close';
            chartObj.indicators[0].kPeriod = 2;
            chartObj.indicators[0].dPeriod = 3;
            chartObj.indicators[0].showZones = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator for a series indicator period ', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(chartObj.visibleSeries[3].points[0].y).toBe(80);
                expect(chartObj.visibleSeries[4].points[0].y).toBe(20);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Jul');
                expect(chartObj.visibleSeries[2].points[0].x).toBe('May');
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].period = 4;
            chartObj.series[0].close = 'close';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator upperLine appearance ', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(indicator.children[3].children[0].getAttribute('stroke') == 'blue').toBe(true);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].upperLine.color = 'blue';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator lower appearance ', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(indicator.children[4].children[0].getAttribute('stroke') == 'green').toBe(true);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].lowerLine.color = 'green';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator showZones ', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(3);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].showZones = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator signalLine appearance ', (done: Function) => {
            loaded = (args: Object): void => {

                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(indicator.children[1].children[0].getAttribute('stroke') == 'red').toBe(true);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].showZones = true;
            chartObj.indicators[0].fill = 'red';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator periodLine appearance ', (done: Function) => {
            loaded = (args: Object): void => {

                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(indicator.children[2].children[0].getAttribute('stroke') == 'yellow').toBe(true);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].periodLine.color = 'yellow';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator overbought ', (done: Function) => {
            loaded = (args: Object): void => {

                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(chartObj.visibleSeries[3].points[0].y).toBe(150);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].overBought = 150;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });


        it('stochastic indicator over sold ', (done: Function) => {
            loaded = (args: Object): void => {

                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(5);
                expect(chartObj.visibleSeries[4].points[0].y).toBe(30);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.indicators[0].overSold = 30;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator with hidden series ', (done: Function) => {
            loaded = (args: Object): void => {

                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(3);
                expect(indicator.children[1].getAttribute('stroke') == 'blue').toBe(true);
                done();
                //reset visibility
                chartObj.series[0].visible = true;
            };
            chartObj.series[0].visible = false;
            chartObj.refresh();
            

            done();
            //reset visibility
            chartObj.series[0].visible = true;
        });

        it('stochastic indicator for a series with secondary y axis', (done: Function) => {
            loaded = (args: Object): void => {

                let svg: HTMLElement = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('x1') == '760.5' || svg.getAttribute('x1') == '761.5').toBe(true);
                expect(svg.getAttribute('y1') == '45.25' || svg.getAttribute('y1') == '42.25').toBe(true);
                expect(svg.getAttribute('x2') == '760.5' || svg.getAttribute('x2') == '761.5').toBe(true);
                expect(svg.getAttribute('y2') == '355.5' || svg.getAttribute('y2') == '360.5').toBe(true);

                //define check condition
                expect(chartObj.visibleSeries[1].yAxis.name).toBe('secondary');
                done();
            };
            chartObj.axes = [{ name: 'secondary', minimum: 0, maximum: 125, opposedPosition: true }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator with opposed position', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect((signalLine).getAttribute('d')).not.toBeNull();
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('x1') == '63.5' || svg.getAttribute('x1') == '59.5').toBe(true);
                expect(svg.getAttribute('y1') == '88.75' || svg.getAttribute('y1') == '95.75').toBe(true);
                expect(svg.getAttribute('x2') == '760.5' || svg.getAttribute('x2') == '761.5').toBe(true);
                expect(svg.getAttribute('y2') == '88.75' || svg.getAttribute('y2') == '95.75').toBe(true);
                done();
                
            };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator with secondary axis and plot offset', (done: Function) => {
            loaded = (args: Object): void => {


                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let point: Element = document.getElementById('containerIndicatorGroup0');
                expect(point != null).toBe(true);
                expect(point.getAttribute('transform') == 'translate(103,115.75)');
                done();

                //reset plot offset
                chartObj.axes[0].plotOffset = 0;
            };
            //reset opposed position
            chartObj.axes[0].opposedPosition = false;
            chartObj.axes[0].plotOffset = 30;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('stochastic indicator with tooltip', (done: Function) => {
            loaded = (args: Object): void => {

                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('aria-label') == 'Feb:150.99:60.23:70.9:120.55').toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();

            };
            chartObj.tooltip = { enable: true };
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        //crosshair
        it('stochastic indicator with cross hair', (done: Function) => {
            loaded = (args: Object): void => {

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[7];
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') != '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') != '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent).toEqual('Mar');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                done();
            };
            chartObj.tooltip = { enable: false };
            chartObj.crosshair = { enable: true, lineType: 'Both' };
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });


        //trackball
        it('stochastic indicator with track ball', (done: Function) => {
            loaded = (args: Object): void => {

                let tooltip: Element;
                let target: Element = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: Node = tooltip.childNodes[0].childNodes[0];
                let path: Element = group.childNodes[0] as HTMLElement;
                let text1: Element = group.childNodes[1] as HTMLElement;
                let text2: Element = group.childNodes[2] as HTMLElement;
                expect(path.getAttribute('fill') == 'rgba(0, 8, 22, 0.75)').toBe(true);
                expect((<Element>text1.childNodes[0]).getAttribute('fill') == '#ffffff').toBe(true);
                expect(text1.textContent == 'FebgoldHigh : 150.99Low : 60.23Open : 120.55Close : 70.9UpperLine : 150LowerLine : 30').toBe(true);
                //expect(text2.textContent == 'UpperLine : 150').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();

            };
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.crosshair = { enable: true, lineType: 'Vertical' };
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        //zooming
        it('stochastic indicator with mouse wheel  zooming', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let wheelArgs: Wheel = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 300
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.06').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.02' ||
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.01').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('checking  zooming with touch', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let touchStartArgs: Object;
                let areaElement = document.getElementById('container_svg');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                let content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect( content == '0.23' || content == '0.19').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.63' ||content == '0.50').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.72' ||content == '0.46').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });

        //---multiple panel----
        it('stochastic indicator using panels', (done: Function) => {
            loaded = (args: Object): void => {

                let element: HTMLElement = document.getElementById('containerIndicatorGroup0');
                let rect: ClientRect;
                rect = element.getBoundingClientRect();
                expect((Math.round(rect.top) === 380) || Math.round(rect.top) === 379).toBe(true);
                done();
            };
            chartObj.axes = [{ name: 'secondary', opposedPosition: true, rowIndex: 0 }];
            chartObj.rows = [{ height: '30%' }, { height: '70%' }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.primaryYAxis.rowIndex = 1;
            chartObj.loaded = loaded;
            chartObj.refresh();
            

        });

    });
});
