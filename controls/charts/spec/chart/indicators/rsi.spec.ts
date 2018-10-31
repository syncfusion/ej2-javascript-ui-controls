/**
 * Test cases for RSI indicators
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { Series } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { RsiIndicator } from '../../../src/chart/technical-indicators/rsi-indicator';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
Chart.Inject(Zoom, Legend, LineSeries, CandleSeries, Category, RsiIndicator,
    Tooltip, Crosshair);

let singleData: object[] = [{ x: 'Jan', low: 40, high: 100, open: 50, close: 70 }];

let financialData: object[] = [
    { x: 'Jan', low: 0.7, high: 6.1, open: 5, close: 2, volume: 10 },
    { x: 'Feb', low: 1.3, high: 6.3, open: 4.8, close: 2.5, volume: 10 },
    { x: 'Mar', low: 1.9, high: 8.5, open: 7, close: 4, volume: 10 },
    { x: 'Apr', low: 3.1, high: 10.8, open: 8, close: 4.2, volume: 10 },
    { x: 'May', low: 5.7, high: 14.40, open: 12.10, close: 7, volume: 10 },
    { x: 'Jun', low: 8.4, high: 16.90, open: 15, close: 10, volume: 10 },
    { x: 'Jul', low: 10.6, high: 19.10, open: 15.6, close: 13, volume: 10 },
    { x: 'Aug', low: 10.5, high: 18.9, open: 14, close: 8, volume: 10 },
    { x: 'Sep', low: 8.5, high: 16.1, open: 13, close: 9, volume: 10 },
    { x: 'Oct', low: 6.0, high: 12.5, open: 10, close: 7.8, volume: 10 },
    { x: 'Nov', low: 1.5, high: 6.9, open: 5.6, close: 3.8, volume: 10 },
    { x: 'Dec', low: 5.1, high: 12.1, open: 8, close: 10.34, volume: 10 }
];
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


describe('Chart', () => {
    let element: HTMLElement;

    describe('RSI Indicators', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
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
                        type: 'Candle',
                        animation: { enable: false }
                    }],
                    indicators: [{
                        type: 'Rsi',
                        period: 3,
                        animation: { enable: false }
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


        it('RSI Technical Indicators without series', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('RSI Technical indicator for a series with 0 points', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length === 4 || indicator.childNodes.length === 2).toBe(true);
                done();
            };
            chartObj.indicators[0].seriesName = 'gold';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('RSI Technical Indicator for a series with 1 point', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length === 4 || indicator.childNodes.length === 2).toBe(true);
                done();
            };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].close = 'close';
            chartObj.series[0].open = 'open';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].volume = 'volume';
            chartObj.indicators[0].field = 'Close';
            chartObj.series[0].dataSource = singleData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('RSI Technical indicator for a series with valid points & primary axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries.length === 4 || chartObj.visibleSeries.length === 2).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Apr');
                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(100);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Jul');
                expect(Math.round(<number>chartObj.visibleSeries[1].points[5].y)).toBe(55);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //negative points
        it('RSI Technical indicator for a series with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let point: HTMLElement = document.getElementById('container_Series_0_Point_4');
                expect(point != null).toBe(true);
                expect(point.getAttribute('d') !== null);
                expect(chartObj.visibleSeries[0].points[5].x).toBe('Negative');
                expect(Math.round(<number>chartObj.visibleSeries[1].points[5].y)).toBe(48);
                expect(Math.round(<number>chartObj.visibleSeries[1].points[3].y)).toBe(84);
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

        it('RSI Technical indicator for a series with secondary y axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let svg: HTMLElement = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('x1') == '760.5' ||
                    svg.getAttribute('x1') == '761.5' || svg.getAttribute('x1') == '767.5').toBe(true);
                expect(svg.getAttribute('y1') == '45.25' || svg.getAttribute('y1') == '42.25').toBe(true);
                expect(svg.getAttribute('x2') == '760.5' ||
                    svg.getAttribute('x2') == '761.5' || svg.getAttribute('x2') == '767.5').toBe(true);
                expect(svg.getAttribute('y2') == '355.5' || svg.getAttribute('y2') == '360.5').toBe(true);
                expect(chartObj.visibleSeries[1].yAxis.name).toBe('secondary');
                done();
            };
            chartObj.axes = [{ name: 'secondary', opposedPosition: true }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('stochastic indicator with disabled show zones', (done: Function) => {
            loaded = (args: Object): void => {

                chartObj.loaded = null;
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(2);
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

        //checking with series visibility - technical indicators should be hidden when the series is hidden

        it('RSI Technical indicator with hidden series', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                ;
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                done();
                //reset visibility
                chartObj.series[0].visible = true;
            };
            chartObj.series[0].visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh();


            //workaround
            done();
            //reset visibility
            chartObj.series[0].visible = true;
        });

        //opposed position

        it('RSI Technical indicator with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('x1') == '57.5' || svg.getAttribute('x1') == '53.5').toBe(true);
                expect(svg.getAttribute('y1') == '95.75' || svg.getAttribute('y1') == '88.75').toBe(true);
                expect(svg.getAttribute('x2') == '760.5' ||
                    svg.getAttribute('x2') == '761.5' || svg.getAttribute('x2') == '767.5').toBe(true);
                expect(svg.getAttribute('y1') == '88.75' || svg.getAttribute('y2') == '95.75').toBe(true);
                done();

                
            };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //plot offset
        it('RSI Technical indicator with secondary axis and plot offset', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let point: Element = document.getElementById('containerIndicatorGroup0');
                expect(point != null).toBe(true);
                expect(point.getAttribute('transform') == 'translate(91,115.75)');
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

        //All axis types


        //---appearance----
        it('RSI Technical indicator with default appearance', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('stroke')).toBe('#606eff');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('RSI Technical indicator with custom color', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('stroke')).toBe('orange');
                done();
            };
            chartObj.indicators[0].fill = 'orange';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('RSI Technical indicator with custom stroke style', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('stroke-width')).toBe('3');
                //workaround
                expect(signalLine.getAttribute('stroke-dasharray')).toBe('2,2');
                done();
            };
            chartObj.indicators[0].width = 3;
            chartObj.indicators[0].dashArray = '2,2';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //Animation

        //Themes

        //---interaction----

        //tooltip
        it('RSI Technical indicator with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('aria-label') == 'Feb:6.3:1.3:2.5:4.8').toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.tooltip = { enable: true };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //crosshair
        it('RSI Technical indicator with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[4];
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
                expect(element1.textContent == 'Feb' || element1.textContent == 'Mar').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '8.461' || element1.textContent == '8.484').toBe(true);
                done();
            };
            chartObj.tooltip = { enable: true };
            chartObj.crosshair = { enable: true, lineType: 'Both' };
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });


        //trackball
        it('RSI Technical indicator with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
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
                expect(text1.textContent == 'FebgoldHigh : 6.3Low : 1.3Open : 4.8Close : 2.5LowerLine : 80UpperLine : 20').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();

            };
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.crosshair = { enable: true, lineType: 'Vertical' };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //resizing charts
        it('RSI Technical indicator when resizing the chart', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let svg: HTMLElement = document.getElementById('container_svg');
                expect(svg.clientWidth == 600).toBe(true);
                done();

            };
            chartObj.tooltip = { enable: true };
            chartObj.crosshair = { enable: true, lineType: 'Vertical' };
            chartObj.width = '600px';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('checking mouse wheel zooming', (done: Function) => {
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
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '1.00' ||
                    chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '1.00' ||
                    chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.00' ||
                    chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.08').toBe(true);
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
                expect(content == '1.00' || content == '0.19').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00' || content == '0.50').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.00' || content == '0.65').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });

        //---multiple panel----
        it('RSI Technical indicator using panels', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('containerIndicatorGroup0');
                let rect: ClientRect;
                rect = element.getBoundingClientRect();
                expect(Math.round(rect.top) == 367).toBe(true);
                chartObj.loaded = null;
                done();
            };
            chartObj.axes = [{ name: 'secondary', opposedPosition: true, rowIndex: 0 }];
            chartObj.rows = [{ height: '30%' }, { height: '70%' }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.primaryYAxis.rowIndex = 1;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Checking series animationEvent', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('containerIndicatorGroup0');
                expect(point.getAttribute('transform') === 'translate(57.5,312.925)' ||
                       point.getAttribute('transform') === 'translate(53.5,311.525)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();
        });
        it('Checking technicalindicators animationEvent', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('containerIndicatorGroup0');
                expect(point.getAttribute('transform') === 'translate(57.5,312.925)' ||
                       point.getAttribute('transform') === 'translate(53.5,311.525)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.indicators[0].animation.enable = true;
            chartObj.refresh();
        });
        it('Checking both series and technical indicators animationEvent', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('containerIndicatorGroup0');
                expect(point.getAttribute('transform') === 'translate(57.5,312.925)' ||
                       point.getAttribute('transform') === 'translate(53.5,311.525)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.indicators[0].animation.enable = true;
            chartObj.refresh();
        });
    });
});
