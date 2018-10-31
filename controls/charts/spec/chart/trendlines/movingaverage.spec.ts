/**
 * Test cases for moving average trendlines
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series } from '../../../src/chart/series/chart-series';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { SplineSeries } from '../../../src/chart/series/spline-series';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { Trendlines } from '../../../src/chart/trend-lines/trend-line';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
Chart.Inject(Legend, LineSeries, Trendlines, SplineSeries, ScatterSeries, Category, Tooltip, Crosshair);


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
let series1: Object[] = [];
let yValue: number[] = [7.66, 8.03, 8.41, 8.97, 8.77, 8.20, 8.16, 7.89, 8.68, 9.48, 10.11, 11.36, 12.34, 12.60, 12.95, 13.91, 16.21, 17.50, 22.72, 28.14, 31.26, 31.39, 32.43, 35.52, 36.36,
    41.33, 43.12, 45.00, 47.23, 48.62, 46.60, 45.28, 44.01, 45.17, 41.20, 43.41, 48.32, 45.65, 46.61, 53.34, 58.53];
let point1: Object;
let i: number; let j: number = 0;
for (i = 1973; i <= 2013; i++) {
    point1 = { x: i, y: yValue[j] };
    series1.push(point1);
    j++;
}

describe('Chart', () => {
    let element: HTMLElement;

    describe('MovingAverage Trendlines', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Months',
                    },
                    primaryYAxis: {
                        title: 'Rupees against Dollars',
                        interval: 5
                    },
                    height: '600px',
                    width: '850px',
                    series: [{
                        type: 'Scatter',
                        name: 'moving',
                        xName: 'x',
                        yName: 'y',
                        animation: { enable: false },
                        dataSource: [],
                        trendlines: []
                    }],
                    title: 'Online trading'
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('MovingAverage Trendlines without series points and with trendline emptycollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 3).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('MovingAverage Trendlines without series points and with trendline validcollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 3).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines = [{ type: 'MovingAverage' }];
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with series points and with trendline emptycollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 42).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 9).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 14).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = series1;
            chartObj.series[0].trendlines = [];
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with series points and with trendline validcollection', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1974);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(8);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines = [{ type: 'MovingAverage', animation: { enable: false } }];
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with default appearance', (done: Function) => {
            loaded = (args: Object): void => {
                let stroke: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('stroke');
                expect(stroke === 'blue');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with custom appearance', (done: Function) => {
            loaded = (args: Object): void => {
                let stroke: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('stroke');
                expect(stroke === 'orange');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].fill = 'orange';
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with marker', (done: Function) => {
            loaded = (args: Object): void => {
                let markerelement: Element = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(markerelement !== null);
                let stroke: string = document.getElementById('container_Series_0_Point_0_Symbol').getAttribute('stroke');
                expect(stroke === 'red');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].marker.visible = true;
            chartObj.series[0].trendlines[0].marker.fill = 'red';
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with default period values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1974);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(8);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with custom period positive values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1977);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(8);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].period = 5;
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with period negative values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1974);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(8);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].period = -5;
            chartObj.refresh();
        });

        it('MovingAverage Trendlines with enableLegend', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_g_1');
                expect(legendElement !== null);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with disableLegend', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_g_1');
                expect(legendElement === null);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = false;
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.visibleSeries[1];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('MovingAverage1975 : 8.220');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].name = 'MovingAverage';
            chartObj.tooltip = { enable: true };
            chartObj.refresh();
        });
        it('MovingAverage Trendlines with trackball', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let series: Series = <Series>chartObj.visibleSeries[1];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip = { shared: true };
            chartObj.refresh();
        });
    });
});
