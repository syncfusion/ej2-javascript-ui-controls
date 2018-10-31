/**
 * Test cases for power trendlines
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
import { EmitType } from '@syncfusion/ej2-base';
import { Trendlines } from '../../../src/chart/trend-lines/trend-line';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
Chart.Inject(Legend, Trendlines, LineSeries, SplineSeries, ScatterSeries, Category, Tooltip, Crosshair);


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
let series1: any[] = [
    { x: 1, y: 10 }, { x: 2, y: 50 }, { x: 3, y: 80 }, { x: 4, y: 110 },
    { x: 5, y: 180 }, { x: 6, y: 220 }, { x: 7, y: 300 }, { x: 8, y: 370 }, { x: 9, y: 490 }, { x: 10, y: 500 }
];
describe('Chart', () => {
    let element: HTMLElement;

    describe('Power Trendlines', () => {
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
                        interval: 50
                    },
                    height: '600px',
                    width: '850px',
                    series: [{
                        type: 'Scatter',
                        name: 'power',
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

        it('Power Trendlines without series points and with trendline emptycollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 2).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Power Trendlines without series points and with trendline validcollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 2).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines = [{ type: 'Power' }];
            chartObj.refresh();
        });

        it('Power Trendlines with series points and with trendline emptycollection', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 11).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 10).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 12).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = series1;
            chartObj.series[0].trendlines = [];
            chartObj.refresh();
        });

        it('Power Trendlines with series points and with trendline validcollection', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(12);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines = [{ type: 'Power', animation: { enable: false } }];
            chartObj.refresh();
        });

        it('Power Trendlines with default appearance', (done: Function) => {
            loaded = (args: Object): void => {
                let stroke: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('stroke');
                expect(stroke === 'blue');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Power Trendlines with custom appearance', (done: Function) => {
            loaded = (args: Object): void => {
                let stroke: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('stroke');
                expect(stroke === 'orange');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].fill = 'orange';
            chartObj.refresh();
        });


        it('Power Trendlines with marker', (done: Function) => {
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
        it('Power Trendlines with default forecast values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(12);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Power Trendlines with custom forwardforecast positive values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(12);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].forwardForecast = 5;
            chartObj.refresh();
        });
        it('Power Trendlines with forwardforecast negative values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(1);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(12);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].forwardForecast = -5;
            chartObj.refresh();
        });
        it('Power Trendlines with backward forecast positive values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(0);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(0);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].backwardForecast = 4;
            chartObj.refresh();
        });
        it('Power Trendlines with backward forecast negative values', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('d');
                expect(path !== null).toBe(true);
                expect(chartObj.visibleSeries[1].points[0].x).toBe(5);

                expect(Math.round(<number>chartObj.visibleSeries[1].points[0].y)).toBe(173);


                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].backwardForecast = -4;
            chartObj.refresh();
        });
        it('Power Trendlines with enableLegend', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_g_1');
                expect(legendElement !== null);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Power Trendlines with disableLegend', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_g_1');
                expect(legendElement === null);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = false;
            chartObj.refresh();
        });
        it('Power Trendlines with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.visibleSeries[1];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('Power5 : 173.233');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].name = 'Power';
            chartObj.tooltip = { enable: true };
            chartObj.refresh();
        });
        it('Power Trendlines with trackball', (done: Function) => {
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
