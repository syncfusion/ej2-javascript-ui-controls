/**
 * Test cases for line style and trendlines visibility
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { Trendlines } from '../../../src/chart/trend-lines/trend-line';
import { EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs, ILegendClickEventArgs } from '../../../src/chart/model/chart-interface';
import { Category } from '../../../src/chart/axis/category-axis';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
Chart.Inject(Legend, Trendlines, LineSeries, ScatterSeries, Category);

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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let element: HTMLElement;

    describe('LineStyle and Visbility', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let legendClick: EmitType<ILegendClickEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let legendElement: Element;
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
                    series: [{
                        dataSource: series1,
                        xName: 'x', yName: 'y',
                        name: 'Apple Inc',
                        fill: '#0066FF',
                        type: 'Scatter',
                        trendlines: [{ type: 'Linear', forwardForecast: 5, name: 'Linear' }]
                    }],
                    title: 'Online trading'
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Trendline with line style', (done: Function) => {
            loaded = (args: Object): void => {
                let dasharray: string = document.getElementById('container_Series_0_TrendLine_0').getAttribute('stroke-dasharray');
                expect(dasharray === '4,5');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].dashArray = '4,5';
            chartObj.series[0].trendlines[0].fill = 'red';
            chartObj.series[0].trendlines[0].width = 1.5;
            chartObj.refresh();
        });

        it('Trendline visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let stroke: string = document.getElementById('container_chart_legend_shape_1').getAttribute('stroke');
                expect(stroke === '#D3D3D3');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].visible = false;
            chartObj.refresh();
        });

        it('Checking trendline legend text visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let fill: string = document.getElementById('container_chart_legend_text_1').getAttribute('fill');
                expect(fill === '#353535');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].trendlines[0].visible = true;
            chartObj.refresh();
        });

        it('Check fill color after legend click', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                chartObj.loaded = null;
                legendElement = document.getElementById('container_chart_legend_shape_1');
                trigger.clickEvent(legendElement);
                expect(legendElement.getAttribute('fill') === '#D3D3D3').toBe(true);
                done();
            };
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
