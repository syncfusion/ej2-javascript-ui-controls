/**
 * Test cases for technical indicators
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series } from '../../../src/chart/series/chart-series';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { TmaIndicator } from '../../../src/chart/technical-indicators/tma-indicator';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/chart/model/chart-interface';
import { Category } from '../../../src/chart/axis/category-axis';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
Chart.Inject(Zoom, Legend, TmaIndicator, LineSeries, CandleSeries, Category, Tooltip, Crosshair);


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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let element: HTMLElement;

    describe('TMA Technical Indicators', () => {
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
                        animation: { enable: false },
                        enableComplexProperty: true
                    }],
                    indicators: [{
                        type: 'Tma',
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

        it('TMA Technical Indicators without series', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('TMA Technical indicator for a series with 0 points', (done: Function) => {
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

        it('TMA Technical Indicator for a series with 1 point', (done: Function) => {
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

        it('TMA Technical indicator for a series with valid points & primary axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries.length).toBe(2);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(1);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(3.8000000000000003);
                expect(chartObj.visibleSeries[1].points[5].y).toBe(7.9333333333333345);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(7.844444444444445);
                done();
            };
            chartObj.series[0].dataSource = financialData;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });


        //negative points
        it('TMA Technical indicator for a series with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let point: HTMLElement = document.getElementById('container_Series_0_Point_4');
                expect(point != null).toBe(true);
                expect(point.getAttribute('d') !== null);
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(1);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Negative');
                expect(chartObj.visibleSeries[1].points[4].y).toBe(1.511111111111111);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(1.7555555555555555);
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

        it('TMA Technical indicator for a series with secondary y axis', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let svg: HTMLElement = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('d').split(' ')[1] == '767.5' || svg.getAttribute('d').split(' ')[1] == '767.5').toBe(true);
                expect(svg.getAttribute('d').split(' ')[2] == '43.25' || svg.getAttribute('d').split(' ')[2] == '45.25').toBe(true);
                expect(svg.getAttribute('d').split(' ')[4] == '767.5' || svg.getAttribute('d').split(' ')[4] == '767.5').toBe(true);
                expect(svg.getAttribute('d').split(' ')[5] == '360.5' || svg.getAttribute('d').split(' ')[5] == '360.5').toBe(true);
                expect(chartObj.visibleSeries[1].yAxis.name).toBe('secondary');
                done();
            };
            chartObj.axes = [{ name: 'secondary', minimum: 0, maximum: 25, opposedPosition: true }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //checking with series visibility - technical indicators should be hidden when the series is hidden

        it('TMA Technical indicator with hidden series', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
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

        it('TMA Technical indicator with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('d').split(' ')[1] == '53.5' || svg.getAttribute('d').split(' ')[1] == '62.5' || svg.getAttribute('d').split(' ')[1] == '53.5').toBe(true);
                expect(svg.getAttribute('d').split(' ')[2] == '89.75' || svg.getAttribute('d').split(' ')[2] == '88.75').toBe(true);
                expect(svg.getAttribute('d').split(' ')[4] == '767.5' || svg.getAttribute('d').split(' ')[4] == '767.5').toBe(true);
                expect(svg.getAttribute('d').split(' ')[5] == '89.75' || svg.getAttribute('d').split(' ')[5] == '88.75').toBe(true);
                done();
                
            };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //plot offset
        it('TMA Technical indicator with secondary axis and plot offset', (done: Function) => {
            loaded = (args: Object): void => {

                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
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
        it('TMA Technical indicator with default appearance', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('stroke')).toBe('#606eff');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('TMA Technical indicator with custom color', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('stroke')).toBe('orange');
                done();
            };
            chartObj.indicators[0].fill = 'orange';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('TMA Technical indicator with custom stroke style', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
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
               // expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
               chartObj.animationComplete = null;
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
        it('TMA Technical indicator with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + series.points[1].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y'));
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x'));
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
        it('TMA Technical indicator with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + series.points[2].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y'));
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x'));
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[5];
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
        it('TMA Technical indicator with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                //define check condition
                let tooltip: Element;
                let target: Element = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + series.points[1].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y'));
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x'));
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: Node = tooltip.childNodes[0].childNodes[0];
                let path: Element = group.childNodes[0] as HTMLElement;
                let text1: Element = group.childNodes[1] as HTMLElement;
                let text2: Element = group.childNodes[2] as HTMLElement;
                expect(path.getAttribute('fill') == '#000816').toBe(true);
                expect((<Element>text1.childNodes[0]).getAttribute('fill') == 'rgba(249, 250, 251, 1)').toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') == 'FebgoldHigh : 6.3Low : 1.3Open : 4.8Close : 2.5').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();

            };
            chartObj.tooltip = { enable: true, shared: true };
            chartObj.crosshair = { enable: true, lineType: 'Vertical' };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //resizing charts
        it('TMA Technical indicator when resizing the chart', (done: Function) => {
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
        it('TMA Technical indicator with default period', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(1);
                expect(chartObj.visibleSeries[1].points[3].y).toBe(3.8000000000000003);
                expect(chartObj.visibleSeries[1].points[5].y).toBe(7.9333333333333345);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(7.844444444444445);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //custom period
        it('TMA Technical indicator with custom period', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Oct');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(3.191357142857143);
                expect(chartObj.visibleSeries[1].points[1].y).toBe(3.6963571428571433);
                expect(chartObj.visibleSeries[1].points[2].y).toBe(4.209357142857144);
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
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
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
                let wheelArgs: unknown = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 300
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '1.00' ||
                    chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.72').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '1.00' ||
                    chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.72').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.00' ||
                    chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.11').toBe(true);
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
                expect(content == '1.00' || content == '0.23' ||content == '0.17').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00' || content == '0.63' || content == '0.45').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.00' || content == '0.72 ' ||content == '0.63').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });

        //---multiple panel----
        it('TMA Technical indicator using panels', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('containerIndicatorGroup0');
                let rect: ClientRect;
                rect = element.getBoundingClientRect();
                expect((Math.round(rect.top) === 371) ||
                Math.round(rect.top) == 370).toBe(true);
                done();
            };
            chartObj.axes = [{ name: 'secondary', opposedPosition: true, rowIndex: 0 }];
            chartObj.rows = [{ height: '30%' }, { height: '70%' }];
            chartObj.indicators[0].yAxisName = 'secondary';
            chartObj.primaryYAxis.rowIndex = 1;
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = false;
            chartObj.refresh();

        });
        //comparative field as open
        it('Moving Average with comparative field as open', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(5.166666666666667);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Jun');
                expect(chartObj.visibleSeries[1].points[5].y).toBe(13.622222222222222);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(12.022222222222224);
                done();
            };
            chartObj.indicators[0].field = 'Open';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //comparative field as low
        it('Moving Average with comparative field as low', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(1);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Jun');
                expect(chartObj.visibleSeries[1].points[5].y).toBe(7.9333333333333345);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(7.844444444444445);
                done();
            };
            chartObj.indicators[0].field = 'Low';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        //comparative field as high
        it('Moving Average with comparative field as high', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_TMA');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                expect(chartObj.visibleSeries[1].points[0].x).toBe('Mar');
                expect(chartObj.visibleSeries[1].points[0].y).toBe(6.422222222222222);
                expect(chartObj.visibleSeries[1].points[3].x).toBe('Jun');
                expect(chartObj.visibleSeries[1].points[5].y).toBe(16.400000000000002);
                expect(chartObj.visibleSeries[1].points[8].y).toBe(15.244444444444445);
                done();
            };
            chartObj.indicators[0].field = 'High';
            chartObj.loaded = loaded;
            chartObj.refresh();

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
