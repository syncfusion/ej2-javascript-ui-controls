/**
 * Test cases for technical indicators
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series } from '../../../src/chart/series/chart-series';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { AtrIndicator } from '../../../src/chart/technical-indicators/atr-indicator';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
Chart.Inject(Zoom, Legend, LineSeries, CandleSeries, Category, AtrIndicator, Tooltip, Crosshair);


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
let animationComplete: EmitType<IAnimationCompleteEventArgs>;
let singleData: object[] = [{ x: 'Jan', low: 40, high: 100, open: 50, close: 70 }];

let financialData: object[] = [
    { x: 'Jan', low: 0.7, high: 6.1, open: 5, close: 2 },
    { x: 'Feb', low: 1.3, high: 6.3, open: 4.8, close: 2.5 },
    { x: 'Mar', low: 1.9, high: 8.5, open: 7, close: 4 },
    { x: 'Apr', low: 3.1, high: 10.8, open: 8, close: 4.2 },
    { x: 'May', low: 5.7, high: 14.40, open: 12.20, close: 7 },
    { x: 'Jun', low: 8.4, high: 16.90, open: 15, close: 10 },
    { x: 'Jul', low: 10.6, high: 19.20, open: 15.6, close: 13 },
    { x: 'Aug', low: 10.5, high: 18.9, open: 14, close: 12 },
    { x: 'Sep', low: 8.5, high: 16.1, open: 13, close: 9 },
    { x: 'Oct', low: 6.0, high: 12.5, open: 10, close: 7.8 },
    { x: 'Nov', low: 1.5, high: 6.9, open: 5.6, close: 3.8 },
    { x: 'Dec', low: 5.1, high: 12.1, open: 8, close: 10.34 }
];

describe('Chart', () => {
    let element: HTMLElement;

    describe('ATR Technical Indicators', () => {
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
                        type: 'Candle',
                        animation: { enable: false }
                    }],
                    indicators: [{
                        type: 'Atr',
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

        it('ATR Technical Indicators without series', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('ATR Technical indicator for a series with 0 points', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(2);
                done();
            };
            chartObj.indicators[0].seriesName = 'gold';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('ATR Technical Indicator for a series with 1 point', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(2);
                done();
            };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].close = 'close';
            chartObj.series[0].open = 'open';
            chartObj.series[0].yName = 'y';
            chartObj.indicators[0].field = 'Low';
            chartObj.series[0].dataSource = singleData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('ATR Technical indicator for a series with valid points & primary axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries.length).toBe(2);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(5.666666666666667);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(8.38641975308642);
                expect(chartObj.visibleSeries[1].points[5].y).toBe(8.571742112482854);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(7.210145811106031);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });


        //negative points
        it('ATR Technical indicator for a series with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let point: HTMLElement = document.getElementById('container_Series_0_Point_4');
                expect(point != null).toBe(true);
                expect(point.getAttribute('d') !== null);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(5.666666666666667);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Negative');
                expect(chartObj.visibleSeries[1].points[4].y).toBe(11.802057613168722);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(11.753086419753087);
                done();
                //reset data source - removed negative point
                financialData.splice(5, 1);
                chartObj.series[0].dataSource = financialData;
            };
            financialData.splice(5, 0, { x: 'Negative', low: -10, high: 10, open: -5, close: 5 });
            chartObj.series[0].dataSource = financialData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('ATR Technical indicator for a series with secondary y axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let svg: HTMLElement = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('x1') == '766.5' || svg.getAttribute('x1') == '767.5').toBe(true);
                expect(svg.getAttribute('y1') == '42.25' || svg.getAttribute('y1') == '45.25').toBe(true);
                expect(svg.getAttribute('x2') == '766.5' || svg.getAttribute('x2') == '767.5').toBe(true);
                expect(svg.getAttribute('y2') == '355.5' || svg.getAttribute('y2') == '360.5').toBe(true);
                expect(chartObj.visibleSeries[1].yAxis.name).toBe('secondary');
                done();
            };
            chartObj.axes = [{ name: 'secondary', minimum: 0, maximum: 25, opposedPosition: true }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //checking with series visibility - technical indicators should be hidden when the series is hidden

        it('ATR Technical indicator with hidden series', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
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

        it('ATR Technical indicator with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('x1') == '57.5' || svg.getAttribute('x1') == '62.5' || svg.getAttribute('x1') == '53.5').toBe(true);
                expect(svg.getAttribute('y1') == '88.75' || svg.getAttribute('y1') == '95.75').toBe(true);
                expect(svg.getAttribute('x2') == '766.5' || svg.getAttribute('x2') == '767.5').toBe(true);
                expect(svg.getAttribute('y2') == '88.75' || svg.getAttribute('y2') == '95.75').toBe(true);
                done();
                
            };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //plot offset
        it('ATR Technical indicator with secondary axis and plot offset', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let point: Element = document.getElementById('container_Indicator_0_SignalLine');
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
        it('ATR Technical indicator with default appearance', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('stroke')).toBe('#606eff');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('ATR Technical indicator with custom color', (done: Function) => {
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

        it('ATR Technical indicator with custom stroke style', (done: Function) => {
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
        it('Checking animationEvent for series', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.indicators[0].animation.enable = false;
            chartObj.refresh();
        });
        it('Checking animation for indicators', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform')).toBeNull;
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = false;
            chartObj.indicators[0].animation.enable = true;
            chartObj.refresh();
        });
        it('Checking animation with both series and indicators', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();
        });

        //Themes

        //---interaction----

        //tooltip
        it('ATR Technical indicator with tooltip', (done: Function) => {
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
        it('ATR Technical indicator with cross hair', (done: Function) => {
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
                expect(element1.textContent).toEqual('Mar');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(Math.round(+element1.textContent) == 6 || Math.round(+element1.textContent) == 8).toBe(true);
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
        it('ATR Technical indicator with track ball', (done: Function) => {
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
                expect(text1.textContent == 'FebgoldHigh : 6.3Low : 1.3Open : 4.8Close : 2.5').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();

            };
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.crosshair = { enable: true, lineType: 'Vertical' };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //resizing charts
        it('ATR Technical indicator when resizing the chart', (done: Function) => {
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

        //---Moving average speific test cases----

        //default period
        it('ATR Technical indicator with default period', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(5.666666666666667);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(8.38641975308642);
                expect(chartObj.visibleSeries[1].points[5].y).toBe(8.571742112482854);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(7.210145811106031);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //custom period
        it('ATR Technical indicator with custom period', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Oct');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(7.65);
                expect(chartObj.visibleSeries[1].points[1].y).toBe(7.515000000000001);
                expect(chartObj.visibleSeries[1].points[2].y).toBe(7.593500000000001);
                done();
            };
            chartObj.indicators[0].period = 10;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //when the number of points is less than period
        it('Moving Average with number of points less than period', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).toBe('');
                //reset the period
                chartObj.indicators[0].period = 3;
                done();
            };
            chartObj.indicators[0].period = 50;
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
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00' ||
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.01' ||
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.02').toBe(true);
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
                expect(content == '1.00' || content == '0.23'  || content == '0.19').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00' || content == '0.63'  || content == '0.50').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.00'  ||content == '0.72' || content == '0.65').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });

        //---multiple panel----
        it('ATR Technical indicator using panels', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                let rect: ClientRect;
                rect = element.getBoundingClientRect();
                expect(Math.round(rect.top) == 333 || Math.round(rect.top) == 332).toBe(true);
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
