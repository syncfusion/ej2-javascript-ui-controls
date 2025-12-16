
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
import { getMemoryProfile, inMB, profile } from '../../common.spec';
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
    describe('Staking line  Checking animation on data changes', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let path: string[];
        beforeAll(() => {
            elem = createElement('div', { id: 'StackingLinecontainer' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                series: [
                    {
                        dataSource: [{ x: 1, y: 10 }, { x: 2, y: 20 },
                        { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                        xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                        type: 'StackingLine', animation: { enable: false },
                        marker: { visible: true, dataLabel: { visible: true } },
                    }]
            });
            chartObj.appendTo('#StackingLinecontainer');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Stacking Line checking setData method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: HTMLElement = document.getElementById('StackingLinecontainer_Series_0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let seriesData = [{ x: 1, y: 10 }, { x: 2, y: 20 },
            { x: 3, y: 15 }, { x: 4, y: 30 }, { x: 5, y: 30 }, { x: 6, y: 20 }];
            chartObj.series[0].setData(seriesData);
            chartObj.refresh();
        });
        it('Stacking Line  checking addPoint method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: HTMLElement = document.getElementById('StackingLinecontainer_Series_0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].addPoint(1, 10);
            chartObj.refresh();
        });
        it('Checking StackLabels', (done: Function) => {
            loaded = (args: Object): void => {
                const stackLabel: Element = document.getElementById('StackingLinecontainer_StackLabel_3');
                const stackLabel1: Element = document.getElementById('StackingLinecontainer_StackLabel_5');
                const stackLabelRect: Element = document.getElementById('StackingLinecontainerStackLabel_TextShape_1');
                expect(stackLabel !== null).toBe(true);
                expect(stackLabel1.innerHTML).toBe('20.00');
                expect(stackLabel.innerHTML).toBe('75.00');
                expect(stackLabel.getAttribute('x') === '470.8' || stackLabel.getAttribute('x') === '434.8' || stackLabel.getAttribute('x') === '458.8' || stackLabel.getAttribute('x') === '448').toBe(true);
                expect(stackLabel.getAttribute('y') === '288.5208333333333' || stackLabel.getAttribute('y') === '275.0208333333333').toBe(true);
                expect(stackLabel.getAttribute('transform') === 'rotate(270, 470.8, 288.5208333333333)' || stackLabel.getAttribute('transform') === 'rotate(270, 470.8, 275.0208333333333)'
                || stackLabel.getAttribute('transform') === 'rotate(270, 448, 275.0208333333333)' || stackLabel.getAttribute('transform') === 'rotate(270, 458.8, 275.0208333333333)').toBe(true);
                expect(stackLabelRect !== null).toBe(true);
                expect(stackLabelRect.getAttribute('x') === '161.1' || stackLabelRect.getAttribute('x') === '157.1' || stackLabelRect.getAttribute('x') === '149.1' || stackLabelRect.getAttribute('x') === '153.5').toBe(true);
                expect(stackLabelRect.getAttribute('y')).toBe('313.78125');
                expect(stackLabelRect.getAttribute('transform') === 'rotate(270, 182.6, 333.78125)' || stackLabelRect.getAttribute('transform') === 'rotate(270, 175, 333.78125)'
                || stackLabelRect.getAttribute('transform') === 'rotate(270, 178.6, 333.78125)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                type: 'StackingLine', animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } },
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
                { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: -20 }],
                xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Zero' },
                type: 'StackingLine', animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } }
            }];
            chartObj.stackLabels.visible = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.stackLabels.format = 'n2';
            chartObj.stackLabels.angle = 270;
            chartObj.stackLabels.border = { width: 1, color: 'black' };
            chartObj.refresh();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });
});