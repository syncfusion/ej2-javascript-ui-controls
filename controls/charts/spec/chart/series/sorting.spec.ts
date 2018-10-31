/**
 * Category spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { sort } from '../../../src/common/utils/helper';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Category, DataLabel, StackingColumnSeries, ColumnSeries);

export let data: Object[] = [
    { country: 'USA', gold: 50, gold1: 55 },
    { country: 'China', gold: 40, gold1: 45 },
    { country: 'Japan', gold: 70, gold1: 75 },
    { country: 'Australia', gold: 60, gold1: 65 },
    { country: 'France', gold: 50, gold1: 55 },
    { country: 'Germany', gold: 40, gold1: 45 },
    { country: 'Italy', gold: 40, gold1: 45 },
    { country: 'Sweden', gold: 30, gold1: 35 }
];
export let data1: any[] = [
    { country: 'USA', gold: 55 },
    { country: 'China', gold: 50 },
    { country: 'Japan', gold: 75 },
    { country: 'Australia', gold: 65 },
    { country: 'France', gold: 60 },
    { country: 'Germany', gold: 45 },
    { country: 'Italy', gold: 40 },
    { country: 'Sweden', gold: 35 }
];
describe('Chart Control', () => {
    describe('Sorting', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal', labelIntersectAction :'Hide' },
                    series: [{
                        dataSource: data, xName: 'country', yName: 'gold', name: 'Gold', fill: 'red',
                        animation: { enable: false }, type: 'Column'
                    }],
                    legendSettings: { visible: false }
                });
            chart.appendTo('#container');
            unbindResizeEvents(chart);
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('X axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Australia').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'USA').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['country'], false);
            chart.refresh();
            unbindResizeEvents(chart);
        });
        it('X axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Australia').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['country'], true);
            chart.refresh();           
        });
        it('Y axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Sweden').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Japan').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold'], false);
            chart.refresh();
        });
        it('Y axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Japan').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Sweden').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold'], true);
            chart.refresh();
        });
        it('Multiple series x axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Australia').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'USA').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series = [
                {
                    dataSource: sort(data, ['country'], false), xName: 'country', yName: 'gold', name: 'Gold', fill: 'red',
                    animation: { enable: false }
                },
                {
                    dataSource: sort(data, ['country'], false), xName: 'country', yName: 'gold1', name: 'Gold', fill: 'red',
                    animation: { enable: false }
                }
            ];
            chart.refresh();
        });
        it('Multiple series X axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Australia').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['country'], true);
            chart.refresh();
        });
        it('Multiple series y axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Sweden').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Japan').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold', 'gold1'], false);
            chart.refresh();
        });
        it('Multiple series Y axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Japan').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Sweden').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold', 'gold1'], true);
            chart.refresh();
        });
        it('Stacking column series X axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Australia').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'USA').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].type = 'StackingColumn';
            chart.series[1].type = 'StackingColumn';
            chart.series[0].dataSource = sort(data, ['country'], false);
            chart.refresh();
        });
        it('Stacking column series X axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Australia').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['country'], true);
            chart.refresh();
        });
        it('Stacking column series y axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Sweden').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Japan').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold', 'gold1'], false);
            chart.refresh();
        });
        it('Stacking column series Y axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Japan').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Sweden').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['gold', 'gold1'], true);
            chart.refresh();
        });
        it('indexed category axis ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Australia, Australia').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'USA, USA').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].type = 'Column';
            chart.series[1].type = 'Column';
            chart.primaryXAxis.isIndexed = true;
            chart.series[0].dataSource = sort(data, ['country'], false);
           chart.refresh();
        });
        it('indexed category axis descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA, Australia').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Australia, USA').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = sort(data, ['country'], true);
            chart.refresh();
        });
    });
});