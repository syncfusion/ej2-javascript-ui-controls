/**
 * Datetime spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { datetimeData, datetimeData1 } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Series } from '../../../src/chart/series/chart-series';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAxisLabelRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, DateTime, BarSeries, ColumnSeries);
export interface Arg {
    chart: Chart;
}

describe('Chart Control', () => {
    describe('Datetime Axis', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let loaded1: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        title: 'Sales Across Years', intervalType: 'Years', valueType: 'DateTime',
                        minimum: new Date(2000, 6, 1), maximum: new Date(2010, 6, 1), interval: 1
                    },
                    primaryYAxis: { title: 'Sales Amount in millions(USD)', rangePadding: 'Additional' },
                    series: [
                        {
                            name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, animation: { enable: false },
                            dataSource: datetimeData, xName: 'x', yName: 'y'
                        },
                    ],
                    height: '600', width: '900', legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });

        it('Checking year', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainerAxisLabels0');
                expect(svg.childNodes.length == 11).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#chartContainer');
        });
        it('Checking month label', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainerAxisLabels0');
                expect(svg.childNodes.length == 16).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis = {
                intervalType: 'Auto', minimum: null, maximum: null,
                rangePadding: 'Additional', valueType: 'DateTime', labelIntersectAction: 'None',
            };
            chart.series = [{ dataSource: datetimeData1, xName: 'x', yName: 'y', fill: '#ACE5FF', width: 2, animation: { enable: false } }]
            chart.refresh();
        });

        it('Checking the Labels with empty data', () => {
            chart.series = [];
            chart.primaryXAxis.zoomFactor = 0.7; chart.primaryXAxis.zoomPosition = 0.2;
            chart.primaryXAxis.rangePadding = 'None';
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.primaryYAxis.rangePadding = 'Normal';
            chart.loaded = null;
            chart.refresh();
            svg = document.getElementById('chartContainerAxisLabels0');
            expect(svg.childNodes.length == 8).toBe(true);
        });
        it('Checking Auto interval with hours', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainerAxisLabels0');
                expect(svg.childNodes.length == 15).toBe(true);
                expect(svg.childNodes[2].textContent == '02:00').toBe(true);
                done();
            };
            chart.primaryXAxis.rangePadding = 'Additional';
            chart.primaryXAxis.interval = null;
            chart.primaryXAxis.zoomFactor = 1;
            chart.primaryXAxis.zoomPosition = 0;
            chart.series = [{
                fill: '#ACE5FF', width: 2, animation: { enable: false }, xName: 'x', yName: 'y',
                dataSource: [{ x: new Date(2000, 3, 21), y: 10 }, { x: new Date(2000, 3, 22), y: 40 }]
            }];
            chart.loaded = loaded;
            chart.height = '450';
            chart.refresh();
        });
        it('Checking Auto interval with minutes', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('chartContainerAxisLabels0');
                expect(svg.childNodes.length == 13).toBe(true);
                expect(svg.childNodes[1].textContent == '03:05:00').toBe(true);
                done();
            };
            chart.primaryXAxis.rangePadding = 'Round';
            chart.series[0].dataSource = [{ x: new Date(2000, 3, 21, 3), y: 50 }, { x: new Date(2000, 3, 21, 4), y: 10 }];
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking Auto interval with seconds', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('chartContainerAxisLabels0');
                let content: string = svg.childNodes[2].textContent;
                expect(svg.childNodes.length == 12).toBe(true);
                expect(content == '03:02:20').toBe(true);
                done();
            };
            chart.primaryXAxis.rangePadding = 'Additional';
            chart.series[0].dataSource = [{ x: new Date(2000, 3, 21, 3, 2), y: 10 }, { x: new Date(2000, 3, 21, 3, 5), y: 45 }];
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking interval type with Months', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[2].textContent == '2001 May').toBe(true);
                done();
            };
            chart.series = [];
            chart.primaryXAxis.intervalType = 'Months';
            chart.primaryXAxis.minimum = new Date(2000, 6, 1);
            chart.primaryXAxis.maximum = new Date(2005, 7, 1);
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking interval type with Days', () => {
            chart.primaryXAxis.intervalType = 'Days';
            chart.primaryXAxis.minimum = new Date(2000, 6, 1);
            chart.primaryXAxis.maximum = new Date(2000, 9, 1);
            chart.loaded = null;
            chart.dataBind();
            expect(document.getElementById('chartContainerAxisLabels0').childNodes[2].textContent == '21').toBe(true);

        });
        it('Checking interval type with Hours', () => {
            chart.primaryXAxis.intervalType = 'Hours';
            chart.primaryXAxis.minimum = new Date(2000, 6, 1, 3);
            chart.primaryXAxis.maximum = new Date(2000, 7, 1);
            chart.dataBind();
            expect(document.getElementById('chartContainerAxisLabels0').childNodes[2].textContent == '11:00').toBe(true);

        });
        it('Checking interval type with minutes', () => {
            chart.primaryXAxis.intervalType = 'Minutes';
            chart.primaryXAxis.minimum = new Date(2000, 6, 1, 4);
            chart.primaryXAxis.maximum = new Date(2000, 6, 1, 6);
            chart.dataBind();
            expect(document.getElementById('chartContainerAxisLabels0').childNodes[2].textContent == '04:20:00').toBe(true);

        });
        it('Checking interval type with seconds', () => {
            chart.primaryXAxis.intervalType = 'Seconds';
            chart.primaryXAxis.minimum = new Date(2000, 6, 1, 1);
            chart.primaryXAxis.maximum = new Date(2000, 6, 1, 2);
            chart.dataBind();
            expect(document.getElementById('chartContainerAxisLabels0').childNodes[2].textContent == '01:16:40').toBe(true);
        });
        it('Checking with years and its Additional rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == '1999').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.skeleton = ''; chart.primaryXAxis.zoomFactor = 1; chart.primaryXAxis.zoomPosition = 0;
            chart.primaryXAxis.minimum = null; chart.primaryXAxis.maximum = null;
            chart.primaryXAxis.interval = null;
            chart.primaryXAxis.intervalType = 'Years';
            chart.primaryXAxis.rangePadding = 'Additional';
            chart.series = [{
                fill: '#ACE5FF', width: 2, animation: { enable: false }, xName: 'x', yName: 'y',
                dataSource: [{ x: new Date(2000, 3, 21), y: 14 }, { x: new Date(2010, 3, 21), y: 45 }]
            }];
            chart.refresh();
        });
        it('Checking with years and its Round rangePadding', (done: Function) => {
            loaded1 = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == '1999').toBe(true);
                done();
            };
            chart.loaded = loaded1;
            chart.primaryXAxis.rangePadding = 'Round';
            chart.refresh();
        });
        it('Checking with Months and its rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == 'Mar').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Months';
            chart.primaryXAxis.rangePadding = 'Additional';
            chart.series = [{
                fill: '#ACE5FF', width: 2, animation: { enable: false }, xName: 'x', yName: 'y',
                dataSource: [{ x: new Date(2000, 3, 21), y: 14 }, { x: new Date(2002, 3, 21), y: 45 }]
            }];
            chart.refresh();

        });
        it('Checking with Months and its Round rangePadding', (done: Function) => {
            loaded1 = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == 'Mar').toBe(true);
                done();
            };
            chart.loaded = loaded1;
            chart.primaryXAxis.rangePadding = 'Round';
            chart.refresh();
        });
        it('Checking with Days and its rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == '20').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Days';
            chart.primaryXAxis.rangePadding = 'Additional';
            chart.series = [{
                fill: '#ACE5FF', width: 2, animation: { enable: false }, xName: 'x', yName: 'y',
                dataSource: [{ x: new Date(2000, 7, 21), y: 14 }, { x: new Date(2000, 9, 21), y: 45 }]
            }];
            chart.refresh();
        });
        it('Checking with Days and its Round rangePadding', (done: Function) => {
            loaded1 = (args: Object): void => {
                expect(document.getElementById('chartContainerAxisLabels0').childNodes[0].textContent == '25cus').toBe(true);
                done();
            };
            chart.loaded = loaded1;
            chart.primaryXAxis.rangePadding = 'Round';
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                args.text = args.text + 'cus';
            }
            chart.refresh();
        });
        it('Checking with edgelabelplacement and labelintersect action', (done: Function) => {
            loaded1 = (args: Object): void => {
                svg = document.getElementById('chartContainer0_AxisLabel_0');
                expect(svg === null);
                done();
            };
            chart.loaded = loaded1;
            chart.primaryXAxis.edgeLabelPlacement = 'Hide';
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.primaryXAxis.intervalType = 'Months';
            chart.width = '700';
            chart.dataBind();
        });
        it('Checking with Bar series', (done: Function) => {
            loaded1 = (args: Object): void => {
                svg = document.getElementById('chartContainerAxisLabels0');
                expect(svg.childNodes.length === 1);
                done();
            };
            chart.series[0].type = 'Bar';
            chart.primaryYAxis.rangePadding = 'Auto';
            chart.primaryXAxis.rangePadding = 'Auto';
            chart.primaryXAxis.zoomFactor = 0.7;
            chart.primaryXAxis.enableAutoIntervalOnZooming = false;
            chart.primaryXAxis.skeleton = 'yMMM';
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('Checking with Bar series with datetime single point', (done: Function) => {
            loaded1 = (args: Arg): void => {
                let series: Series = <Series>args.chart.series[0];
                let value: number = series.points[0].symbolLocations[0].y;
                expect(Math.round(value) == 192 || Math.round(value) == 190).toBe(true);
                done();
            };
            chart.series[0].type = 'Bar';
            chart.primaryYAxis.rangePadding = 'Auto';
            chart.primaryXAxis.rangePadding = 'Auto';
            chart.primaryXAxis.zoomFactor = 1;
            chart.series[0].dataSource = [{ x: new Date(2016, 0, 1), y: 20 }];
            chart.primaryXAxis.enableAutoIntervalOnZooming = true;
            chart.primaryXAxis.skeleton = 'yMMM';
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('Checking with Line series with labelrotation -45 degree', (done: Function) => {
            loaded1 = (args: Object): void => {
                svg = document.getElementById('chartContainer_AxisTitle_0');
                let axis: HTMLElement = document.getElementById('chartContainer0_AxisLabel_3');
                expect(parseFloat(svg.getAttribute('y')) > parseFloat(axis.getAttribute('y'))).toBe(true);
                done();
            };
            chart.series[0].type = 'Line';
            chart.series[0].dataSource = null;
            chart.series[0].dataSource = datetimeData;
            chart.primaryXAxis.labelRotation = -45;
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('Checking with edgelabelplacement and labelrotation', (done: Function) => {
            loaded1 = (args: Object): void => {
                svg = document.getElementById('chartContainer_ChartAreaBorder');
                let axis: HTMLElement = document.getElementById('chartContainer0_AxisLabel_3');
                expect(parseFloat(svg.getAttribute('y')) + parseFloat(svg.getAttribute('height')) < parseFloat(axis.getAttribute('y'))).toBe(true);
                done();
            };
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('Checking with minorGridLines and minorTickLines', (done: Function) => {
            loaded1 = (args: Object): void => {
                svg = document.getElementById('chartContainer_MinorGridLine_0');
                let axis: HTMLElement = document.getElementById('chartContainer_MajorTickLine_0');
                expect(svg !== null).toBe(true);
                expect(axis !== null).toBe(true);
                done();
            };
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.primaryXAxis.labelRotation = 0;
            chart.primaryXAxis.minorTicksPerInterval = 3;
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('Checking with labelIntersectAction with edgeLabelPlacement', (done: Function) => {
            loaded1 = (args: Object): void => {
                let axisLabelFirst: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                let axisLabelLast: HTMLElement = document.getElementById('chartContainer0_AxisLabel_11');
                expect(axisLabelFirst.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
                expect(axisLabelLast.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
                done();
            };
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.primaryXAxis.interval = 7;
            chart.primaryXAxis.minorTicksPerInterval = 0;
            chart.loaded = loaded1;
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('checking x axis as inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('Aug 2000');
                let lastLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_16');
                expect(lastLabel.textContent).toEqual('Dec 2009');
                expect(+firstLabel.getAttribute('x') > (+lastLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.series = [{
                dataSource: datetimeData, xName: 'x', type: 'Line',
                yName: 'y', name: 'Gold', fill: 'rgba(135,206,235,1)'
            }];
            chart.axisLabelRender = null;
            chart.refresh();
        });
        it('checking custom label format isInversed and skeleton, type priority', (done: Function) => {
            chart.loaded = null;
            chart.primaryXAxis.labelFormat = 'd MMM y h : m a';
            chart.primaryXAxis.skeleton = 'medium';
            chart.primaryXAxis.skeletonType = 'Time';
            let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
            expect(label.textContent).toEqual('Aug 2000');
            chart.dataBind();
            label = document.getElementById('chartContainer0_AxisLabel_0');
            expect(label.textContent).toEqual('11 Aug 2000 12 : 0 AM');
            done();
        });
        it('checking custom label format isInversed false', (done: Function) => {
            chart.primaryXAxis.isInversed = false;
            let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
            expect(label.textContent).toEqual('11 Aug 2000 12 : 0 AM');
            chart.dataBind();
            label = document.getElementById('chartContainer0_AxisLabel_16');
            expect(label.textContent).toEqual('11 Dec 2009 12 : 0 AM');
            done();
        });
        it('checking custom label format and skeleton, type priority', (done: Function) => {
            chart.primaryXAxis.labelFormat = '';
            chart.primaryXAxis.skeleton = 'medium';
            chart.primaryXAxis.skeletonType = 'Date';
            let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_16');
            expect(label.textContent).toEqual('11 Dec 2009 12 : 0 AM');
            chart.dataBind();
            label = document.getElementById('chartContainer0_AxisLabel_0');
            expect(label.textContent).toEqual('Aug 11, 2000');
            done();
        });
    });
});