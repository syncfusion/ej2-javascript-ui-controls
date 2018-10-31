/**
 * Stacking column, bar and Area 100% Series Spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { dragComplete } from '../../../src/common/model/constants';
import { StackingBarSeries } from '../../../src/chart/series/stacking-bar-series';
import { StackingAreaSeries } from '../../../src/chart/series/stacking-area-series';
import { Axis } from '../../../src/chart/axis/axis';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { tooltipData11, tooltipData12, datetimeData11, negativeDataPoint, categoryData1, track3, seriesData1 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { Legend } from '../../../src/chart/legend/legend';
import { ILoadedEventArgs, IDragCompleteEventArgs } from '../../../src/common/model/interface';
Chart.Inject(DateTime, Category, DataLabel, StackingColumnSeries, StackingBarSeries, ColumnSeries, Legend,
    StackingAreaSeries, Logarithmic, BarSeries, AreaSeries, LineSeries, Tooltip, Crosshair, Zoom, Selection);

export interface Arg {
    chart: Chart;
}

let trigger: MouseEvents = new MouseEvents();
let data: any = tooltipData11;
let data2: any = tooltipData12;
let negativPoint: any = negativeDataPoint;
let dateTime: any = datetimeData11;
describe('Chart Control', () => {
    describe('Chart StackingColumn100 series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;

        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
           
        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with fill', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with dynamic series changing y axis label format', (done: Function) => {
            loaded = (args: Arg): void => {
                let series: Series = <Series>args.chart.series[0];
                expect(series.yAxis.isStack100 === false).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Line';
            chartObj.series[1].type = 'Line';
            chartObj.refresh();
        });
        it('Checking Legend Shape ', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('container_chart_legend_shape_0');
                let path: string = legendElement.getAttribute('d');
                expect(path !== '').toBe(true);
                expect(path !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking with point percentage value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Points = chartObj.visibleSeries[0].points[0];
                expect(point.percentage != null).toBe(true);
                expect(point.percentage).toBe(48.95);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_5');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[1].dataSource[5].y = null;
            chartObj.refresh();
        });
        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                let axisLabel = document.getElementById('container1_AxisLabel_6');
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect((series1.points[1].regions[0].y) + series1.points[0].regions[0].height > parseFloat(axisLabel.getAttribute('y'))).toBe(true);
                expect((series2.points[4].regions[0].y) + series2.points[4].regions[0].height > parseFloat(axisLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking with different stackingGroup', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                expect(series1.points[1].regions[0].x < series2.points[1].regions[0].x).toBe(true);
                expect(series1.points[1].regions[0].y + series1.points[1].regions[0].height === parseFloat(chartArea.getAttribute('y')));
                expect(series2.points[1].regions[0].y + series2.points[1].regions[0].height === parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = 70;
            chartObj.series[1].dataSource[5].y = 60;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[1].stackingGroup = 'b';
            chartObj.refresh();

        });
        it('Checking with default DataLabel ', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(dataLabel.textContent).toEqual('70');
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(dataLabel.textContent).toEqual('73');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].stackingGroup = '';
            chartObj.series[1].stackingGroup = '';
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.refresh();

        });
        it('Checking with bar Seris', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'Bar';
            chartObj.refresh();

        });
        it('Checking with Column Series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount === 2).toBe(true);
                let series2: Series = <Series>args.chart.series[0];
                expect(series1.rectCount === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'Column';
            chartObj.refresh();
        });
        it('Checking with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('containerSeriesGroup1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = dateTime;
            chartObj.series[1].dataSource = dateTime;
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking with datetime axis and log axis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('containerSeriesGroup1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking with category axis and different series ', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.rectCount === 1).toBe(true);
                expect(series2.rectCount === 1).toBe(true);
                expect(series1.stackedValues.endValues[0] === 100).toBe(true);
                expect(series2.stackedValues.endValues[0] === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = track3;
            chartObj.series[1].dataSource = categoryData1;
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                let axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent === 'Jan').toBe(true);
                let axisStart = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) < parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks'
            chartObj.refresh();
        });
        it('Checking with stackingColumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[1].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('checking with log axis for primary x axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: HTMLElement = document.getElementById('containerSeriesGroup0');
                expect(series1 !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking with StackingArea', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'StackingArea';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with stackingbar100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
        });
        it('Checking with empty point', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = null;
            chartObj.series[0].dataSource[0].y = null;
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = 1000;
            chartObj.series[0].dataSource[0].y = 70;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                    name: 'ChartSeriesNameGold',
                }
            ]
            chartObj.refresh();
        });
        it('Checking with multiple axes two row', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }];
            chartObj.rows = [
                { border: { width: 4, color: 'red' }, height: '300' },
                { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.series[0].yAxisName = 'yAxis';
            chartObj.series[1].yAxisName = 'yAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axis two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{}];
            chartObj.rows = [{}];
            chartObj.axes = [{
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.columns = [
                { border: { width: 4, color: 'red' }, width: '300' },
                { border: { width: 4, color: 'red' }, width: '300' }];
            chartObj.series[0].yAxisName = null;
            chartObj.series[1].yAxisName = null;
            chartObj.series[0].xAxisName = 'xAxis';
            chartObj.series[1].xAxisName = 'xAxis';
            chartObj.series[2].xAxisName = 'xAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axis two row and two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[0];
                let series1: Series[] = axis.series;
                let rectcount: number = series1[0].rectCount;
                expect(series1.length === 2).toBe(true);
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }, {
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.rows = [{ border: { width: 4, color: 'red' }, height: '300' },
            { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.series[2].xAxisName = null;
            chartObj.series[2].yAxisName = 'yAxis';
            chartObj.series[3].yAxisName = 'yAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axes for each axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[1].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.axes = [{
                rowIndex: 0, columnIndex: 0, name: 'yAxis1', title: 'YAxis1',
            },
            {
                rowIndex: 0, columnIndex: 0, name: 'yAxis2', title: 'YAxis2',
            },

            {
                rowIndex: 0, columnIndex: 1, name: 'yAxis3', title: 'YAxis3',
            },
            {
                rowIndex: 0, columnIndex: 1, name: 'yAxis4', title: 'YAxis4',
            }];
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis1'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameGold1', fill: 'black',
                xAxisName: 'yAxis1',
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameGold2', fill: 'red',
                xAxisName: 'yAxis1',
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameGold3', fill: 'green',
                xAxisName: 'yAxis1'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameDiamond', fill: 'blue',
                xAxisName: 'yAxis2'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameDiamond', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis2',
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameDiamond1', fill: 'yellow',
                xAxisName: 'yAxis2'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameSilver', fill: 'blue',
                xAxisName: 'yAxis3'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                name: 'ChartSeriesNameSilver1', fill: 'black',
                xAxisName: 'yAxis3',
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false },
                type: 'StackingColumn100',
                name: 'ChartSeriesNameRuby', fill: 'red',
                xAxisName: 'yAxis4'
            }];
            chartObj.rows = [{}];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with stackingGroup and multiple axes', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[1].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[1].stackingGroup = 'a';
            chartObj.refresh();
        });
    });
    describe('Chart StackingBar100 Series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;

        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
           
        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with fill', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Legend Shape ', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('container_chart_legend_shape_0');
                let path: string = legendElement.getAttribute('d');
                expect(path !== '').toBe(true);
                expect(path !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_5');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[1].dataSource[5].y = null;
            chartObj.refresh();
        });
        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                let axisLabel = document.getElementById('container1_AxisLabel_6');
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect((series1.points[1].regions[0].y) < parseFloat(axisLabel.getAttribute('x'))).toBe(true);
                expect((series2.points[4].regions[0].y) < parseFloat(axisLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking with different stackingGroup', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.rectCount === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = 70;
            chartObj.series[1].dataSource[5].y = 60;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[1].stackingGroup = 'b';
            chartObj.refresh();

        });
        it('Checking with default DataLabel ', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0')
                expect(dataLabel.textContent === '70').toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(dataLabel.textContent === '73').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].stackingGroup = '';
            chartObj.series[1].stackingGroup = '';
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.refresh();

        });
        it('Checking with bar Seris', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'Bar';
            chartObj.refresh();

        });
        it('Checking with datetime axis', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = dateTime;
            chartObj.series[1].dataSource = dateTime;
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
        });
        it('Checking with datetime axis and log axis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking with category axis and different series ', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.rectCount === 1).toBe(true);
                expect(series2.rectCount === 1).toBe(true);
                expect(series1.stackedValues.endValues[0] === 100).toBe(true);
                expect(series2.stackedValues.endValues[0] === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = track3;
            chartObj.series[1].dataSource = categoryData1;
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                let axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent === 'Jan').toBe(true);
                let axisStart = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) < parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking with stackingbar', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: HTMLElement = document.getElementById('containerSeriesGroup');
                expect(series2 === null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount == 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[1].type = 'StackingBar';
            chartObj.refresh();
        });
        it('checking with log axis for primary x axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: HTMLElement = document.getElementById('containerSeriesGroup0');
                expect(series1 !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking with empty point', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = null;
            chartObj.series[0].dataSource[0].y = null;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.rectCount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = 1000;
            chartObj.series[0].dataSource[0].y = 70;
            chartObj.series = [
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                    name: 'ChartSeriesNameGold',
                }, {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                    name: 'ChartSeriesNameGold',
                }
            ];
            chartObj.refresh();
        });
        it('Checking with multiple axes two row', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }];
            chartObj.rows = [
                { border: { width: 4, color: 'red' }, height: '300' },
                { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.series[0].xAxisName = 'yAxis';
            chartObj.series[1].xAxisName = 'yAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axis two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{}];
            chartObj.rows = [{}];
            chartObj.axes = [{
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.columns = [
                { border: { width: 4, color: 'red' }, width: '300' },
                { border: { width: 4, color: 'red' }, width: '300' }];
            chartObj.series[0].xAxisName = null;
            chartObj.series[1].xAxisName = null;
            chartObj.series[0].yAxisName = 'xAxis';
            chartObj.series[1].yAxisName = 'xAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axis two row and two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[1];
                let series1: Series[] = axis.series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }, {
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.series[2].xAxisName = 'yAxis';
            chartObj.series[3].xAxisName = 'yAxis';
            chartObj.rows = [{ border: { width: 4, color: 'red' }, height: '200' },
            { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.refresh();
        });
        it('Checking with multiple axes for each axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[1].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 1).toBe(true);
                done();
            };
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.axes = [{
                rowIndex: 0, columnIndex: 0, name: 'yAxis1', title: 'YAxis1',
            },
            {
                rowIndex: 0, columnIndex: 0, name: 'yAxis2', title: 'YAxis2',
            },

            {
                rowIndex: 0, columnIndex: 1, name: 'xAxis3', title: 'YAxis3',
            },
            {
                rowIndex: 0, columnIndex: 1, name: 'xAxis4', title: 'YAxis4',
            }];
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis1'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameGold1', fill: 'black',
                xAxisName: 'yAxis1'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameDiamond', fill: 'blue',
                xAxisName: 'yAxis2'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameDiamond', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis2'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameSilver', fill: 'blue',
                yAxisName: 'xAxis3'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar100',
                name: 'ChartSeriesNameSilver1', fill: 'black',
                yAxisName: 'xAxis3'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false },
                type: 'StackingBar100',
                name: 'ChartSeriesNameRuby', fill: 'red',
                yAxisName: 'xAxis4'
            }];
            chartObj.rows = [{}];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with stackingGroup and multiple axes', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[0];
                let series1: Series[] = axis.series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[1].stackingGroup = 'a';
            chartObj.refresh();
        });
    });
    describe('Chart StackingArea100 series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;

        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
           
        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with fill', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Legend Shape ', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('container_chart_legend_shape_0');
                let path: string = legendElement.getAttribute('d');
                expect(path !== '').toBe(true);
                expect(path !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking stacking end values for last series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: Series = <Series>args.chart.series[1];
                expect(Math.round(series2.stackedValues.endValues[0]) === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with log axis for primary x axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: HTMLElement = document.getElementById('containerSeriesGroup0');
                expect(series1 !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('checking with stackingarea series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series2: Series = <Series>args.chart.series[1];
                expect(Math.round(series2.stackedValues.endValues[0]) === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'StackingArea';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('checking with stackingcolumn series', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[1];
                expect(Math.round(series1.stackedValues.endValues[0]) === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                let series: Series = <Series>args.chart.series[4];
                expect(series.stackedValues.endValues[0] === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                name: 'ChartSeriesNameGold'
            }, {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                name: 'ChartSeriesNameGold'
            }, {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                name: 'ChartSeriesNameGold'
            }, {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                name: 'ChartSeriesNameGold'
            }, {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea100',
                name: 'ChartSeriesNameGold'
            }];
            chartObj.refresh();
        });
        it('Checking with multiple axes two row', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[0];
                expect(axis.series.length === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }];
            chartObj.rows = [
                { border: { width: 4, color: 'red' }, height: '200' },
                { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.series[0].yAxisName = 'yAxis';
            chartObj.series[1].yAxisName = 'yAxis';
            chartObj.series[0].type = 'StackingArea100';
            chartObj.refresh();
        });
        it('Checking with multiple axis two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[0];
                let series1: Series[] = axis.series;
                expect(series1.length === 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{}];
            chartObj.rows = [{}];
            chartObj.axes = [{
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.columns = [
                { border: { width: 4, color: 'red' }, width: '300' },
                { border: { width: 4, color: 'red' }, width: '300' }];
            chartObj.series[0].yAxisName = null;
            chartObj.series[1].yAxisName = null;
            chartObj.series[0].xAxisName = 'xAxis';
            chartObj.series[1].xAxisName = 'xAxis';
            chartObj.series[2].xAxisName = 'xAxis';
            chartObj.refresh();
        });
        it('Checking with multiple axis two row and two column', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis = <Axis>args.chart.axes[0];
                let series1: Series[] = axis.series;
                expect(series1.length === 2).toBe(true);
                axis = <Axis>args.chart.axes[1];
                series1 = axis.series;
                expect(series1.length === 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis'
            }, {
                columnIndex: 1, name: 'xAxis'
            }];
            chartObj.rows = [{ border: { width: 4, color: 'red' }, height: '300' },
            { border: { width: 4, color: 'red' }, height: '300' }];
            chartObj.series[2].xAxisName = null;
            chartObj.series[2].yAxisName = 'yAxis';
            chartObj.series[3].yAxisName = 'yAxis';
            chartObj.refresh();
        });
    });
    describe('chart stacking percent series with user interaction', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;

        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn100',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
           
        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('checking with Tooltip for stackingcolumn100 series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });
        it('checking with Tooltip for stackingbar100 series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
        });
        it('checking with Tooltip for stackingarea100 series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.series[0].marker.visible = true;
            chartObj.series[1].marker.visible = true;
            chartObj.refresh();
        });
        it('checking with Tooltip for stackingarea series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea';
            chartObj.series[1].type = 'StackingArea';
            chartObj.refresh();
        });
        it('checking with Tooltip for Srea series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Area';
            chartObj.series[1].type = 'Area';
            chartObj.refresh();
        });
        it('Checking with track ball for stackingbar100 series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[6].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[6].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip = document.getElementById('container_tooltip_group');
                expect(tooltip.childElementCount).toEqual(5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });
        it('Checking with track ball for stackingcolumn100 series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_6');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[6].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[6].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip = document.getElementById('container_tooltip_group');
                expect(tooltip.childElementCount).toEqual(5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Default Crosshair for stackingcolumn100', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                let x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '4502.776' || element1.textContent == '4502.791').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '49.964' || element1.textContent == '49.818').toBe(true);

                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_svg').lastChild;
                expect(crosshair.childNodes.length == 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = false;
            chartObj.tooltip.enable = false;
            chartObj.crosshair.enable = true;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
           
        });
        it('Default Crosshair for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                let x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '4497.153' || element1.textContent == '4485.476').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '50.035' || element1.textContent == '50.104').toBe(true);


                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_svg').lastChild;
                expect(crosshair.childNodes.length == 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
           
        });
        it('Default Crosshair for stackingarea100', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                let x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
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
                expect(element1.textContent == '4502.429' || element1.textContent == '4502.442').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '49.964' || element1.textContent == '49.818').toBe(true);

                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_svg').lastChild;
                expect(crosshair.childNodes.length == 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.refresh();
           
        });
        it('Single point selection for stackingcolumn100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = false;
            chartObj.refresh();
        });
        it('Single point selection for stackingbar100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_0');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
        });
        it('Single point multi selection for stackingbar100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Single point multi selection for stackingcolumn100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('series selection for stackingcolumn100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4');
                let series = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(series).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.selectionMode = 'Series';
            chartObj.isMultiSelect = false;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('series selection for stackingbar100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4');
                let series = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(series).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('series selection for stackingarea100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0');
                let series = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(series).toBe(<HTMLElement>selected[0]);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Cluster selection for stackingarea100 series', (done: Function) => {
            loaded = () => {
                let element = document.getElementById('container_Series_0_Point_4_Symbol');
                let element1 = document.getElementById('container_Series_1_Point_4_Symbol');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                let selected1 = document.getElementsByClassName('container_ej2_chart_selection_series_1');
                expect(element1).toBe(<HTMLElement>selected1[0]);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Drag selection for stackingbar100 series', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(elem, 100, 100, 500, 300);
                let selection: string = 'container_ej2_chart_selection_series_0';
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('class') === selection).toBe(true);
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('class') === selection).toBe(true);
                svg = document.getElementById('container_Series_0_Point_2');
                expect(svg.getAttribute('class') === selection).toBe(true);
                svg = document.getElementById('container_Series_0_Point_4');
                expect(svg.getAttribute('class') === selection).toBe(true);
                svg = document.getElementById('container_Series_0_Point_5');
                expect(svg.getAttribute('class') === selection).toBe(true);
                svg = document.getElementById('container_Series_0_Point_6');
                expect(svg.getAttribute('class') === selection).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragX';
            chartObj.isMultiSelect = true;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Checking default selection zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                let resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.zoomSettings.enableDeferredZooming = true;
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('mouseWheel zooming - checking tool elements', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                let resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 8).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.refresh();
        });
    });
    describe('stacking100 Series Inversed axis', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let dataLabelY; let pointY;
        let dataLabelX; let pointX;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', isInversed: true },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'StackingColumn100', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    },
                    {
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 90 }, { x: 4000, y: 50 },
                        { x: 5000, y: 50 }, { x: 6000, y: 60 },
                        { x: 7000, y: -40 }, { x: 8000, y: -70 }], xName: 'x', yName: 'y',
                        type: 'StackingColumn100',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chart.appendTo('#container');

        });

        afterAll((): void => {
            chart.destroy();
            element.remove();
        });

        it(' StackingColum100 With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.refresh();

        });

        it('StackingColum100 With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.series[1].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('StackingColum100  With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[1].marker.dataLabel.position = 'Top';
            chart.refresh();

        });
        it('StackingColum100 With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point : Points = (<Points>(<Series>chart.series[0]).points[1]);
                pointY = point.regions[0].x + point.regions[0].width;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                point = (<Points>(<Series>chart.series[0]).points[0]);
                pointY = point.regions[0].x;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.series[1].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });
        it('StackingColum100 With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelY: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelY + labelHeight / 2).toEqual(point.regions[0].y + point.regions[0].height / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.series[1].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });

        it('StackinBar100 With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.series[1].marker.dataLabel.position = 'Auto';
            chart.series[0].type = 'StackingBar100';
            chart.series[1].type = 'StackingBar100';
            chart.refresh();

        });

        it('StackinBar100 With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.series[1].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('StackinBar100 With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[1].marker.dataLabel.position = 'Top';
            chart.refresh();

        });
        it('StackinBar100 With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                pointX = point.regions[0].x - point.regions[0].width;
                expect(dataLabelX > pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                point = (<Points>(<Series>chart.series[0]).points[0]);
                pointX = point.regions[0].x + point.regions[0].width;
                expect(dataLabelX < pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.series[1].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });

        it('StackinBar100 With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelX: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('width');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelX + labelHeight / 2).toEqual(point.regions[0].x + point.regions[0].width / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.series[1].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });

        it(' StackingArea100 With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].type = 'StackingArea100';
            chart.series[0].dataSource = seriesData1;
            chart.series[1].type = 'StackingArea100';
            chart.series[1].dataSource = seriesData1;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.series[1].marker.dataLabel.position = 'Auto';
            chart.refresh();

        });

        it('StackingArea100 With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[1].marker.dataLabel.position = 'Top';
            chart.refresh();

        });
        it('StackingArea100 With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.series[1].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });
        it('StackingArea100 With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelY: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelY + labelHeight / 2).toEqual(point.regions[0].y + point.regions[0].height / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.series[1].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });
    });
});
