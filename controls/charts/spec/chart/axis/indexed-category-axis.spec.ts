/**
 * Indexed Category axis spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { Legend } from '../../../src/chart/legend/legend';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { indexedCategoryData } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Category, DataLabel, Crosshair, Legend);

export interface Arg {
    chart: Chart;
}
describe('Chart Control', () => {
    describe('Indexed Category Axis', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', isIndexed: true, labelIntersectAction :'Hide' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{ dataSource: indexedCategoryData,
                        xName: 'x', yName: 'y', name: 'Gold', animation: { enable: false } }],
                    height: '400', width: '900',
                    loaded: loaded, legendSettings: { visible: false }
                });
            
        });

        afterAll((): void => {
            
            chart.destroy();
            ele.remove();
        });
        it('Checking the single series Labels', (done: Function) => {
            loaded = (args: Arg): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 7).toBe(true);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday').toBe(true);
                svg = document.getElementById('container0_AxisLabel_6');
                expect(svg.textContent == 'Monday').toBe(true);
                expect(args.chart.visibleSeries[0].points[6].xValue == 6).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#container');
        });
        it('Checking indexed false', (done: Function) => {
            loaded = (args: Arg): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 5).toBe(true);
                expect(args.chart.visibleSeries[0].points[6].xValue == 0).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isIndexed = false;
            chart.refresh();
            
        });
        it('Checking the multiple series Labels', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 7).toBe(true);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                svg = document.getElementById('container0_AxisLabel_6');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isIndexed = true;
            chart.series = [
                { dataSource: indexedCategoryData,
                    xName: 'x', yName: 'y', name: 'Gold', animation: { enable: false } },
                    { dataSource: indexedCategoryData,
                        xName: 'x', yName: 'y', name: 'silver',  animation: { enable: false } }
            ];
            chart.refresh();
            
        });
        it('Checking with two rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 7).toBe(true);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                svg = document.getElementById('container0_AxisLabel_6');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.rows = [{height: '50%'}, { height: '50%'}];
            chart.axes = [{ rowIndex: 1, name: 'yAxis'}];
            chart.series[0].yAxisName = 'yAxis';
            chart.refresh();
            
        });
        it('Checking with two columns', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.rows = [{}];
            chart.columns = [{width: '50%'}, { width: '50%'}];
            chart.axes = [{ columnIndex: 1, name: 'xAxis', valueType: 'Category'}];
            chart.series[0].yAxisName = null;
            chart.series[0].xAxisName = 'xAxis';
            chart.refresh();
            
        });
        it('Checking with two columns with multiple series and second column is indexed false', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                svg = document.getElementById('containerAxisLabels2');
                svg = document.getElementById('container2_AxisLabel_0');
                expect(svg.textContent == 'Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series = [
                { dataSource: indexedCategoryData, xAxisName: 'xAxis',
                    xName: 'x', yName: 'y', name: 'series1', animation: { enable: false } },
                { dataSource: indexedCategoryData, xAxisName: 'xAxis',
                    xName: 'x', yName: 'y', name: 'series2', animation: { enable: false } },
                { dataSource: indexedCategoryData,
                    xName: 'x', yName: 'y', name: 'series3',  animation: { enable: false } },
                { dataSource: indexedCategoryData,
                    xName: 'x', yName: 'y', name: 'series4', animation: { enable: false } }
            ];
            chart.refresh();
            
        });
        it('Checking with two columns and second column also indexed true', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels2');
                svg = document.getElementById('container2_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].labelIntersectAction = 'Hide';
            chart.axes[0].isIndexed = true;
            chart.refresh();
            
        });
        it('Checking with two columns and spanning', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels2');
                svg = document.getElementById('container2_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.span = 2;
            chart.refresh();
            
        });
        it('Checking axis labels after Legend click', (done: Function) => {
            loaded = (args: Arg): void => {
                chart.loaded = null;
                let legendElement: Element;
                legendElement = document.getElementById('container_chart_legend_text_2');
                trigger.clickEvent(legendElement);
                expect(chart.series[2].visible).toBe(false);
                expect(args.chart.axisCollections[0].labels[0] == 'Monday').toBe(true);
                done();
            };
            chart.legendSettings = { visible: true };
            chart.loaded = loaded;
            chart.primaryXAxis.span = 1;
            chart.refresh(); 
        });
        it('Checking with multiple axis and oppposed position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'Monday, Monday').toBe(true);
                svg = document.getElementById('containerAxisLabels2');
                svg = document.getElementById('container2_AxisLabel_0');
                expect(svg.textContent == 'Monday').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.columns = [{}];
            chart.rows = [{ height: '50%'}, { height: '50%'}];
            chart.axes = [{ rowIndex: 0, name: 'xAxis', valueType: 'Category', isIndexed: true, opposedPosition: true },
            { rowIndex: 0, name: 'xAxis1', valueType: 'Category', isIndexed: true, opposedPosition: false },]
            chart.series = [
                { dataSource: indexedCategoryData, xAxisName: 'xAxis',
                    xName: 'x', yName: 'y', name: 'series1', animation: { enable: false } },
                { dataSource: indexedCategoryData, xAxisName: 'xAxis1',
                    xName: 'x', yName: 'y', name: 'series2', animation: { enable: false } },
                { dataSource: indexedCategoryData,
                    xName: 'x', yName: 'y', name: 'series3',  animation: { enable: false } },
                { dataSource: indexedCategoryData,
                    xName: 'x', yName: 'y', name: 'series4', animation: { enable: false } }
            ];
            chart.refresh();
            
        });
    });
});