
/**
 * Specifies the  Scatter series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { tool1, tool2, datetimeData, categoryData, negativeDataPoint, rotateData1, rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(ScatterSeries, LineSeries, DateTime, Category, Tooltip, DataLabel);
let data: any = tool1;
let data2: any = tool2;
let datetime: any = datetimeData;
export interface Arg {
    chart: Chart;
}

export interface series1 {
    series: Series;
}

describe('Chart Control', () => {
    describe('Chart Scatter series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let datalabel: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            if (document.getElementById('container')) {
                document.getElementById('container').remove();
            }
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                        name: 'ChartSeriesNameGold', fill: 'green',
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
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') === 'green').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('container1_AxisLabel_4');
                let series: Series = <Series>args.chart.series[0];
                marker = document.getElementById('container_Series_0_Point_1');
                expect(parseFloat(svg.getAttribute('y')) < series.points[1].symbolLocations[0].y).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = 60;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();

        });
        it('Checking with single Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 10 }];
            chartObj.refresh();
        });
        it('Checking with marker shape Circle without tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x + 50), Math.ceil(y + 50));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'black';
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].dataSource = data;
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });
        it('Checking with marker shape Circle', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'black';
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].dataSource = data;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });
        it('checking with marker shape diamond', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Diamond';
            chartObj.refresh();
        })
        it('checking with marker shape HorizontalLine', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'HorizontalLine';
            chartObj.refresh();
        });
        it('checking with marker shape InvertedTriangle', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'InvertedTriangle';
            chartObj.refresh();
        });
        it('checking with marker shape Pentagon', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Pentagon';
            chartObj.refresh();
        });
        it('checking with marker shape Triangle', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Triangle';
            chartObj.refresh();
        });
        it('checking with marker shape rectangle', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.refresh();
        });
        it('checking with marker shape verticalLine', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'VerticalLine';
            chartObj.refresh();
        });
        it('checking with marker shape Cross', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Cross';
            chartObj.refresh();
        });
        it('checking with marker shape image', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_2_Trackball_1');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Image';
            chartObj.series[0].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.refresh();
        });
        it('Checking with marker size', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let value: number = Math.round((<Series>chartObj.series[0]).points[2].regions[0].y);
                expect(value == 23 || value == 24).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.height = 20;
            chartObj.series[0].marker.width = 20;
            chartObj.refresh();
        });
        it('Checking with marker visible false', (done: Function) => {
            loaded = (args: Object): void => {
                datalabel = document.getElementById('container_Series_0_Point_0');
                expect(datalabel !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh();
        });
        it('Checking with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();

        });
        it('Checking with category axis onticks', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();

        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1_Point_1');
                expect(svg.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{ dataSource: data, xName: 'x', yName: 'y', name: 'Gold', fill: 'red', type: 'Scatter', animation: { enable: false } },
            { dataSource: data2, xName: 'x', name: 'silver', yName: 'y', fill: 'rgba(135,206,235,1)', type: 'Scatter', animation: { enable: false } }];
            chartObj.series[0].marker.visible = true;
            chartObj.series[1].marker.visible = true;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();

        });
        it('checking with dateTime', (done: Function) => {
            loaded = (args: Object): void => {
                let axislabel: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(axislabel.textContent === '2003').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = datetime;
            chartObj.series[1].dataSource = datetime;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.refresh();

        });

        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1_Point_1');
                expect(svg.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1', minimum: 20, maximum: 80, interval: 20,
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.height = '600';
            chartObj.series[1].yAxisName = 'yAxis1';
            chartObj.rows = [{ height: '300', border: { width: 4, color: 'red' } },
            { height: '300', border: { width: 4, color: 'blue' } }];
            chartObj.refresh();

        });
        it('Checking with axis with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let svg1: HTMLElement = document.getElementById('container2_AxisLabel_0');
                expect(parseFloat(svg.getAttribute('x')) + parseFloat(svg.getAttribute('width')) <
                    parseFloat(svg1.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes[0].opposedPosition = true;
            chartObj.refresh();

        });
        it('Checking animation', (done: Function) => {

            let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === null).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();

        });

    });
});

describe('checking for multiple axes', () => {
    let chartObj: Chart;
    let elem: HTMLElement = createElement('div', { id: 'container' });
    let targetElement: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    let marker0; HTMLElement;
    let dataLabel0: HTMLElement;

    beforeAll(() => {
        document.body.appendChild(elem);
        chartObj = new Chart(
            {
                //primaryXAxis: { title: 'PrimaryXAxis', rangePadding: ChartRangePadding.Additional },
                //primaryYAxis: { title: 'PrimaryYAxis' },
                axes: [{
                    rowIndex: 0,
                    columnIndex: 0,
                    name: 'yAxis1',
                    title: 'YAxis1',
                },
                {
                    rowIndex: 0,
                    columnIndex: 0,
                    name: 'yAxis2',
                    title: 'YAxis2',
                },

                {
                    rowIndex: 1,
                    columnIndex: 0,
                    name: 'yAxis3',
                    title: 'YAxis3',
                },
                {
                    rowIndex: 1,
                    columnIndex: 0,
                    name: 'yAxis4',
                    title: 'YAxis4'
                },
                {
                    rowIndex: 0,
                    columnIndex: 1,
                    name: 'yAxis6',
                    title: 'YAxis6',
                    opposedPosition: true,
                },
                {
                    rowIndex: 0,
                    columnIndex: 1,
                    name: 'yAxis5',
                    title: 'YAxis5',
                    opposedPosition: true,
                },

                {
                    rowIndex: 1,
                    columnIndex: 1,
                    name: 'yAxis7',
                    title: 'YAxis7',
                    opposedPosition: true,
                },
                {
                    rowIndex: 1,
                    columnIndex: 1,
                    name: 'yAxis8',
                    title: 'YAxis8',
                    opposedPosition: true,
                },
                {
                    columnIndex: 0,
                    rowIndex: 0,
                    name: 'xAxis1',
                    title: 'Xaxis1',

                },
                {
                    columnIndex: 0,
                    rowIndex: 0,
                    name: 'xAxis2',
                    title: 'Xaxis2',
                },
                {
                    columnIndex: 1,
                    rowIndex: 0,
                    name: 'xAxis3',
                    title: 'Xaxis3',

                },
                {
                    columnIndex: 1,
                    rowIndex: 0,
                    name: 'xAxis4',
                    title: 'Xaxis4',

                },
                {
                    columnIndex: 0,
                    rowIndex: 1,
                    name: 'xAxis5',
                    title: 'Xaxis5',
                    opposedPosition: true,

                },
                {
                    columnIndex: 0,
                    rowIndex: 1,
                    name: 'xAxis6',
                    title: 'Xaxis6',
                    opposedPosition: true,
                },
                {
                    columnIndex: 1,
                    rowIndex: 1,
                    name: 'xAxis7',
                    title: 'Xaxis7',
                    opposedPosition: true,

                },
                {
                    columnIndex: 1,
                    rowIndex: 1,
                    name: 'xAxis8',
                    title: 'Xaxis8',
                    opposedPosition: true,

                },
                ],
                series: [{
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNameGold', fill: 'green', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                },
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                    name: 'ChartSeriesNameGold', fill: 'red', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                },
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNameGold1', fill: 'black', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNameDiamond', fill: 'blue', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                },
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNameSilver', fill: 'green',
                    //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis5', yAxisName: 'yAxis3',
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false },
                    type: 'Scatter',
                    //marker: { visible: true, dataLabel: { visible: false } },
                    name: 'ChartSeriesNameRuby', fill: 'red',
                    xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                },
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNameEmerald', fill: 'purple', //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis4', yAxisName: 'yAxis6',
                },
                {
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Scatter',
                    name: 'ChartSeriesNamePearl', fill: 'violet',
                    //marker: { visible: true, dataLabel: { visible: true } },
                    xAxisName: 'xAxis7', yAxisName: 'yAxis7'
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false },
                    type: 'Scatter',
                    //marker: { visible: true, dataLabel: { visible: false } },
                    name: 'ChartSeriesNameCoral', fill: 'yellow',
                    xAxisName: 'xAxis8', yAxisName: 'yAxis8',

                }
                ],
                rows: [
                    { height: '400', border: { width: 2, color: 'red' } },
                    { height: '400', border: { width: 2, color: 'red' } },

                ],
                columns: [
                    { width: '400', border: { width: 2, color: 'black' } },
                    { width: '400', border: { width: 2, color: 'black' } },
                ], legendSettings: { visible: false },
                title: 'Chart TS Title', height: '1000', width: '1000',

            });
        chartObj.appendTo('#container');
       
    });
    afterAll((): void => {
        chartObj.destroy();
        elem.remove();
    });
    it('Checking with fill', (done: Function) => {
        loaded = (args: Object): void => {
            let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
            expect(svg.getAttribute('fill') === 'green').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.refresh();
    });
    it('Checking Events', (done: Function) => {
        loaded = (args: Object): void => {
            let element: HTMLElement = document.getElementById('container_Series_0_Point_2');
            expect(element.getAttribute('fill') == 'brown').toBe(true);
            element = document.getElementById('container_Series_0_Point_0');
            expect(element == null).toBe(true);
            done();
        };
        chartObj.pointRender = (args: IPointRenderEventArgs) => {
            if (args.point.index === 0) {
                args.cancel = true;
            }
            if (args.point.index === 2) {
                args.fill = 'brown';
            }
        }
        chartObj.loaded = loaded;
        chartObj.title = 'Events Changed';
        chartObj.refresh();
    });
    it('Checking pointRender event with cancel args', (done: Function) => {
        loaded = (args: Object): void => {
            let svg = document.getElementById('containerSeriesGroup0');
            expect(svg.childNodes.length).toBe(1);           
            done();
        };
        chartObj.pointRender = (args: IPointRenderEventArgs) => {
            args.cancel = true;
        }
        chartObj.loaded = loaded;
        chartObj.series[0].animation.enable = true;
        chartObj.title = 'Events Changed';
        chartObj.refresh();
    });

});
describe('Scatter Series Inversed axis', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let dataLabelY;
        let pointY;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', isInversed: true },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: data, xName: 'x', yName: 'y', size: 'size',
                        type: 'Scatter', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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

        it('With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('With Label position Outer', (done: Function) => {
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
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
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
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
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
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });
        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelY: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelY + labelHeight / 2).toEqual(point.regions[0].y + point.regions[0].height / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });
    });

    describe('checking rotated scatter chart', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis'},
                series: [
                    { type: 'Scatter', name: 'series1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}},
                    { type: 'Scatter', name: 'series2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}}
                ],
                title: 'rotated scatter Chart'
            });
            chart.appendTo('#container');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking without rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('checking with rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.isTransposed = true;
            chart.refresh();
        });
        it('checking with datalabel Auto position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.refresh();
        });
        it('checking with datalabel Top position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.refresh();
        });
        it('checking with datalabel Middle position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > (point.symbolLocations[0].y - point.regions[0].height / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();
        });
        it('checking with tooltip positive values', (done: Function) => {
            loaded = (args: Object): void => {
                //positive y yValues
                dataLabel = document.getElementById('container_Series_0_Point_2');
                series = <Series>chart.series[0];
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
            chart.refresh();
        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.shared = true;
            chart.refresh();
        });
    });