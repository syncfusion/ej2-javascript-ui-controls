/**
 * Series spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Chart } from '../../../src/chart/chart';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { seriesData1, seriesData2, data, rotateData1, rotateData2 } from '../base/data.spec';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs, IPointRenderEventArgs, IAnimationCompleteEventArgs, ISeriesRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Tooltip, ColumnSeries, BarSeries, DataLabel);

describe('Chart Control', () => {
    let ele: HTMLElement;
    let svg: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    let dataManager: DataManager = new DataManager({
        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
    });
    let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
    describe('series in chart', () => {
        let chart: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart({
                border: { width: 1, color: 'red' },
                primaryXAxis: {
                    title: 'PrimaryXAxis', lineStyle: { color: 'blue', width: 2 },
                    minorTicksPerInterval: 4, minorGridLines: { width: 0 }, minorTickLines: { width: 1 }
                },
                primaryYAxis: { title: 'PrimaryYAxis', lineStyle: { color: 'blue', width: 2 } },
                series: [
                    {
                        name: 'series1', type: 'Line', fill: '#ACE5FF', width: 3,
                        dataSource: seriesData1, animation: { enable: false }, xName: 'x', yName: 'y'
                    },
                    {
                        name: 'series2', type: 'Line', fill: '#F6B53F', width: 2,
                        dataSource: seriesData2, animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ],
                height: '600', legendSettings: { visible: false }
            }, '#container');

        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking with Line series with data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('stroke') == '#ACE5FF').toBe(true);
                expect(svg.getAttribute('stroke-width') == '3').toBe(true);

                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('stroke') == '#F6B53F').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking with Line series with fill in seriesRender Event', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('stroke') == 'pink').toBe(true);

                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('stroke') == '#F6B53F').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.seriesRender = (argsData: ISeriesRenderEventArgs): void => {
                if (argsData.series.index == 0) {
                    argsData.fill = 'pink';
                }
            };
            chart.refresh();
        });
    });

    describe('Checking with Line and Bar Combination', () => {
        let chartObj: Chart;
        beforeAll(() => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                series: [
                    {
                        name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, animation: { enable: false },
                        dataSource: [{ x: 10, y: 30 }, { x: 20, y: 40 }, { x: 30, y: 20 }, { x: 40, y: 15 }, { x: 50, y: 45 }],
                        xName: 'x', yName: 'y'
                    },
                    {
                        name: 'series1', type: 'Bar', fill: 'red', width: 2, animation: { enable: false },
                        dataSource: [{ x: 10, y: 30 }, { x: 20, y: 40 }, { x: 30, y: 20 }, { x: 40, y: 15 }, { x: 50, y: 45 }],
                        xName: 'x', yName: 'y'
                    }
                ], legendSettings: { visible: false }
            }, '#container');
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking with Line series with points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesCollection');
                expect(svg.childNodes.length == 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });



    describe('Line series with remote dataSource', () => {
        let chartEle1: Chart;
        beforeAll(() => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartEle1 = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [
                        {
                            name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2,
                            dataSource: [{'id': 1, 'Estimate': 10}], xName: 'Id', yName: 'Estimate'//, query: query
                        },
                    ],
                    height: '600', legendSettings: { visible: false }
                });
            chartEle1.appendTo('#container');


        });
        afterAll((): void => {
            chartEle1.destroy();
            ele.remove();
        });
        it('Checking the series', (done: Function) => {
            loaded = (args: Object): void => {
                let text: HTMLElement = document.getElementById('container0_AxisLabel_0');
                //expect(text.textContent != null).toBe(true);
                done();
            };
            chartEle1.loaded = loaded;
            chartEle1.refresh();
        });
    });

    describe('Multiple series with dataSource', () => {
        let chartEle: Chart;
        beforeAll(() => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            let query: Query = new Query().take(5);
            chartEle = new Chart(
                {
                    series: [
                        {
                            name: 'dataSource', type: 'Line', fill: 'yellow', width: 2,
                            dataSource: data, xName: 'EmployeeID', yName: 'Freight', query: query, animation: { enable: true }
                        },
                        {
                            name: 'data', type: 'Line', fill: 'red', width: 2,
                            dataSource: [{ x: 1, y: 30 }, { x: 5, y: 40 }, { x: 7, y: 20 }, { x: 9, y: 15 }, { x: 11, y: 45 }],
                            xName: 'x', yName: 'y', animation: { enable: true, delay: 300 }
                        },
                    ], legendSettings: { visible: false }
                });
            chartEle.appendTo('#container');


        });
        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('Checking the series data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('stroke') == 'yellow').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.refresh();
        });
    });
    describe('marker in line chart', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let marker: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                border: { width: 1, color: 'red' },
                primaryXAxis: {
                    title: 'PrimaryXAxis', lineStyle: { color: 'blue', width: 2 },
                    minorTicksPerInterval: 4, minorGridLines: { width: 0 }, minorTickLines: { width: 1 }
                },
                primaryYAxis: { title: 'PrimaryYAxis', lineStyle: { color: 'blue', width: 2 } },
                series: [
                    {
                        name: 'series1', type: 'Line', fill: 'red',
                        dataSource: seriesData1, animation: { enable: false }, xName: 'x', yName: 'y',
                        marker: {
                            visible: true,
                            shape: 'Circle',
                            fill: 'black', height: 10, width: 10
                        }
                    },
                ],
                height: '400', width: '600', legendSettings: { visible: false }
            }, '#container');
            ;
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking with marker shape Circle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };

            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with marker shape diamond', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Diamond';
            chartObj.refresh();
        })
        it('checking with marker shape HorizontalLine', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'HorizontalLine';
            chartObj.refresh();
        });
        it('checking with marker shape InvertedTriangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'InvertedTriangle';
            chartObj.refresh();
        });
        it('checking with marker shape Pentagon', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_4_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Pentagon';
            chartObj.refresh();
        });
        it('checking with marker shape Triangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Triangle';
            chartObj.refresh();
        });
        it('checking with marker shape rectangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(marker.getAttribute('stroke') === chartObj.series[0].fill).toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.series[0].marker.fill = null;
            chartObj.refresh();
        });
        it('checking with marker shape verticalLine', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'brown').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'VerticalLine';
            chartObj.series[0].marker.fill = 'brown';
            chartObj.refresh();
        });
        it('checking with marker shape verticalLine', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'brown').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Cross';
            chartObj.refresh();
        });
        it('checking with null point', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(marker === null).toBe(true);
                marker = document.getElementById('container_Series_0_Point_5_Symbol');
                expect(marker.getAttribute('fill') === 'pink').toBe(true);
                expect(marker.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.pointRender = (argsData: IPointRenderEventArgs): void => {
                argsData.fill = 'pink';
                if (argsData.point.index == 6) {
                    argsData.cancel = true;
                }
            };
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].marker.shape = 'Cross';
            chartObj.refresh();
            ;
        });
        it('checking with animation', (done: Function) => {
            let animate: EmitType<IAnimationCompleteEventArgs>;
            animate = (args: IAnimationCompleteEventArgs): void => {
                let pathLength: number = (<SVGPathElement>args.series.pathElement).getTotalLength();
                expect(pathLength >= 400).toBe(true);
                done();
            };
            chartObj.loaded = chartObj.pointRender = null;
            chartObj.series[0].animation = { enable: true, delay: 1000 };
            chartObj.animationComplete = animate;
            chartObj.series[0].dashArray = '2';
            chartObj.refresh();
        });
        it('checking single point with negative data', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container1_AxisLabel_0');
                expect(marker.textContent == '-63.2').toBe(true);
                marker = document.getElementById('container1_AxisLabel_35');
                expect(marker.textContent == '-56.200').toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ 'x': 1, 'y': -60 }];
            chartObj.refresh();
        });
    });
    describe('Checking Tooltip with Column', () => {
        let chartEle: Chart;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryYAxis: { minimum: -10, maximum: 40 },
                    series: [
                        {
                            name: 'data', type: 'Column', fill: 'red', width: 2,
                            dataSource: [{ x: 1, y: 15 }, { x: 5, y: 40 }, { x: 7, y: -20 }, { x: 9, y: 30 }, { x: 11, y: 45 }],
                            xName: 'x', yName: 'y', animation: { enable: false, delay: 300 },
                            marker: { visible: true }
                        },
                    ], legendSettings: { visible: false }, tooltip: { enable: true }
                });
            chartEle.appendTo('#container');

        });
        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('Checking the series data', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(marker != null).toBe(true);
                let series: Series = <Series>chartEle.series[0];
                let target: HTMLElement = document.getElementById('container_Series_0_Point_4');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[4].regions[0].y + parseFloat(chartArea.getAttribute('y')) + ele.offsetTop + 60;
                let x: number = series.points[4].regions[0].x + parseFloat(chartArea.getAttribute('x')) + ele.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.refresh();
        });
    });
    describe('Checking Tooltip with Bar', () => {
        let chartEle: Chart;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryYAxis: { minimum: -10, maximum: 40 },
                    series: [
                        {
                            name: 'data', type: 'Bar', fill: 'red', width: 2,
                            dataSource: [{ x: 1, y: 15 }, { x: 5, y: 40 }, { x: 7, y: -20 }, { x: 9, y: 30 }, { x: 11, y: 45 }],
                            xName: 'x', yName: 'y', animation: { enable: false, delay: 300 },
                            marker: { visible: true }
                        },
                    ], legendSettings: { visible: false }, tooltip: { enable: true }
                });
            chartEle.appendTo('#container');

        });
        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('Checking the series data', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(marker != null).toBe(true);
                let series: Series = <Series>chartEle.series[0];
                let target: HTMLElement = document.getElementById('container_Series_0_Point_4');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[4].regions[0].y + parseFloat(chartArea.getAttribute('y')) + ele.offsetTop;
                let x: number = series.points[4].regions[0].x + parseFloat(chartArea.getAttribute('x')) + ele.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.refresh();
        });
    });
    describe('Line Series Inversed axis', () => {
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
                        name: 'ChartSeriesNameGold', dataSource: seriesData1, xName: 'x', yName: 'y', size: 'size',
                        type: 'Line', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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

    describe('checking rotated line chart', () => {
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
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                    {
                        type: 'Line', name: 'area', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    },
                    {
                        type: 'Line', name: 'area', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    }
                ],
                title: 'rotated line Chart'
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
                dataLabel = document.getElementById('container_Series_0_Point_2_Symbol');
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
                dataLabel = document.getElementById('container_Series_0_Point_1_Symbol');
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
        it('checking with column series', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 = document.getElementById('container_Series_0_Point_0');
                let point2 = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(point2 != null).toBe(true);
                expect(point1 != null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].type = 'Column';
            chart.refresh();
        });
        it('checking with column series with NaN number', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 = document.getElementById('container_Series_0_Point_0');
                expect(point1 === null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: NaN }, { x: new Date(2002, 3, 7), y: -30 },
                { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: -65 },
                { x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }];
            chart.refresh();
        });
    });
}); 