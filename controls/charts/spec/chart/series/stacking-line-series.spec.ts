
/**
 * Specifies Stackingline series spec.
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { StackingLineSeries } from '../../../src/chart/series/stacking-line-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { PolarSeries } from '../../../src/chart/index';
Chart.Inject(StackingLineSeries, PolarSeries, DateTime, Category, DataLabel);
export interface Arg {
    chart: Chart;
}

describe('Chart Control', () => {
    describe('Chart StackingLine series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let path: string[];
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                series: [{
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                    type: 'StackingLine', animation: { enable: false },
                    marker: { visible: true, dataLabel: { visible: true}},
                }, {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: 30 },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: null }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Drop' },
                    type: 'StackingLine', animation: { enable: true },
                }, {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: 30 },
                    { x: 3, y: 15 }, { x: 4, y: null }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Gap' },
                    type: 'StackingLine', animation: { enable: false },
                }, {
                    dataSource: [{ x: 1, y: null }, { x: 2, y: 30 },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Zero' },
                    type: 'StackingLine', animation: { enable: false },
                }]
            });

        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with default points for stacking line', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                series1 = document.getElementById('container_Series_1');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(5);
                series1 = document.getElementById('container_Series_2');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(5);
                series1 = document.getElementById('container_Series_3');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking with default points for stacking line 100%', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                series1 = document.getElementById('container_Series_1');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(5);
                series1 = document.getElementById('container_Series_2');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(5);
                series1 = document.getElementById('container_Series_3');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingLine100';
            chartObj.series[1].type = 'StackingLine100';
            chartObj.series[2].type = 'StackingLine100';
            chartObj.series[3].type = 'StackingLine100';
            chartObj.refresh();
        });
        it('Checking with default points for polar stacking line', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(7);
                series1 = document.getElementById('container_Series_1');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                series1 = document.getElementById('container_Series_2');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(6);
                series1 = document.getElementById('container_Series_3');
                path = series1.getAttribute('d').split('L');
                expect(path.length).toBe(7);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.series[0].drawType = 'StackingLine';
            chartObj.series[1].type = 'Polar';
            chartObj.series[1].drawType = 'StackingLine';
            chartObj.series[2].type = 'Polar';
            chartObj.series[2].drawType = 'StackingLine';
            chartObj.series[3].type = 'Polar';
            chartObj.series[3].drawType = 'StackingLine';
            chartObj.refresh();
        });
    });
});