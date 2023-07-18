/**
 * Datetime spec document
 */
import { createElement, EmitType } from '@syncfusion/ej2-base';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import {
    Chart, DateTime, DateTimeCategory, LineSeries, BarSeries,
    Series, ColumnSeries, ChartAnnotation, getElement, StripLine
} from '../../../src/chart/index';
import { datetimeData, datetimeCategoryYearData1, datetimeCategoryYearData, dateTimedataInterval } from '../base/data.spec';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';

Chart.Inject(LineSeries, DateTime, BarSeries, DateTimeCategory, ColumnSeries, ChartAnnotation, StripLine);
export interface Arg {
    chart: Chart;
}


describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ele: HTMLElement;
    let svg: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    describe('Datetime category Axis', () => {
        let chart: Chart;
        let axisLine: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        title: 'Sales Across Years', intervalType: 'Years', valueType: 'DateTimeCategory',
                    },
                    primaryYAxis: { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                    series: [
                        {
                            name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, animation: { enable: false },
                            dataSource: datetimeData, xName: 'x', yName: 'y', marker: { visible: true },
                        },
                    ],
                    height: '600', width: '900', legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking axis label length', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chart.series[0];
                svg = document.getElementById('containerAxisLabels0');
                expect(svg.childElementCount).toEqual(series0.points.length);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#container');
        });
        it('Checking month label', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.innerHTML).toEqual('Jul 11');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Months';
            chart.refresh();
        });
        it('Checking Auto interval with hours', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 2).toBe(true);
                expect(svg.childNodes[0].textContent == 'Fri 00:00').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Auto';
            chart.series = [{
                fill: '#ACE5FF', width: 2, animation: { enable: false }, xName: 'x', yName: 'y', marker: { visible: true },
                dataSource: [{ x: new Date(2000, 3, 21), y: 10 }, { x: new Date(2000, 3, 22), y: 40 }]
            }];
            chart.height = '450';
            chart.refresh();
        });
        it('Checking Auto interval with minutes', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(2);
                expect(svg.childNodes[0].textContent == '03:00:00').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2000, 3, 21, 3), y: 50 }, { x: new Date(2000, 3, 21, 4), y: 10 }];
            chart.refresh();
        });
        it('Checking interval with Hours', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(2);
                expect(svg.childNodes[0].textContent == 'Fri 03:00').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Hours';
            chart.series[0].dataSource = [{ x: new Date(2000, 3, 21, 3), y: 50 }, { x: new Date(2000, 3, 21, 4), y: 10 }];
            chart.refresh();
        });
        it('Checking Auto interval with seconds', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(2);
                expect(svg.childNodes[0].textContent == '03:10:10').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Auto';
            chart.series[0].dataSource = [{ x: new Date(2000, 3, 21, 3, 10, 10), y: 50 }, { x: new Date(2000, 3, 21, 4, 10, 10), y: 10 }];
            chart.refresh();
        });

        it('Checking labels for years', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(3);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = datetimeCategoryYearData1;
            chart.primaryXAxis.intervalType = 'Years';
            chart.refresh();
        });
        it('Checking multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(4);
                done();
            };
            chart.loaded = loaded;
            chart.series = [
                {
                    animation: { enable: false }, dataSource: datetimeCategoryYearData, xName: 'x', yName: 'y', marker: { visible: true },
                },
                {
                    animation: { enable: false }, dataSource: datetimeCategoryYearData1, xName: 'x', yName: 'y', marker: { visible: true },
                },
            ];
            chart.primaryXAxis.intervalType = 'Years';
            chart.refresh();
        });
        it('Checking with column series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(4);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].type = 'Column'; chart.series[1].type = 'Column';
            chart.refresh();
        });
        it('Checking with column series opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_ChartAreaBorder');
                axisLine = document.getElementById('containerAxisLine_0');
                expect(+svg.getAttribute('x')).toEqual(+axisLine.getAttribute('d').split(' ')[1]);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = true;
            chart.series[0].type = 'Column'; chart.series[1].type = 'Column';
            chart.refresh();
        });
        it('Checking with bar series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(4);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = false;
            chart.series[0].type = 'Bar'; chart.series[1].type = 'Bar';
            chart.refresh();
        });
        it('Checking with bar series with opposed postion', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_ChartAreaBorder');
                axisLine = document.getElementById('containerAxisLine_0');
                expect(+svg.getAttribute('y')).toEqual(+axisLine.getAttribute('d').split(' ')[2]);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = true;
            chart.refresh();
        });
        it('Checking intervalType as Days', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length).toEqual(6);
                expect(svg.childNodes[0].textContent).toEqual('4/17/2000');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Days';
            chart.refresh();
        });
        it('Checking with dateTime axis on ticks', () => {
            chart.primaryXAxis.labelPlacement = 'OnTicks';
            chart.dataBind();
            let svg: any = document.getElementById('containerAxisLabels0').childNodes[0];
            axisLine = document.getElementById('containerAxisLine_0');
            expect(+svg.getAttribute('x') > (+axisLine.getAttribute('x1'))).toBe(true);
        });
        it('checking with  vertical axis edge label placement', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_ChartAreaBorder');
                let label1: any = document.getElementById('containerAxisLabels0').childNodes[0];
                let label2: any = document.getElementById('containerAxisLabels0').childNodes[5];
                expect(parseInt(label1.getAttribute('y'))).toEqual((parseInt(svg.getAttribute('y')) + parseInt(svg.getAttribute('height'))));
                // expect(+label2.getAttribute('y')).toEqual(+svg.getAttribute('y'));
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.primaryXAxis.opposedPosition = false;
            chart.refresh();
        });
        it('checking with  horizontal axis edge label placement', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_ChartAreaBorder');
                let label1: any = document.getElementById('containerAxisLabels0').childNodes[0];
                let label2: any = document.getElementById('containerAxisLabels0').childNodes[5];
                expect(+label1.getAttribute('x') > +svg.getAttribute('x'));
                // expect(+label2.getAttribute('x')).toEqual(+svg.getAttribute('x') + +svg.getAttribute('width'));
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.series[0].type = 'Line'; chart.series[1].type = 'Column';
            chart.refresh();
        });
        it('checking with label formats custom', (done: Function) => {
            loaded = (args: Object): void => {
                let label1: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label1.innerHTML).toEqual('Monday, April 17, 2000');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.skeleton = 'full';
            chart.primaryXAxis.skeletonType = 'Date';
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.refresh();
        });
        it('checking with label formats custom with intervalType as Year', (done: Function) => {
            loaded = (args: Object): void => {
                let label1: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label1.innerHTML === 'Monday, April 17, 2000 at 12:00:00 AM GMT+05:30' ||
                    label1.innerHTML === 'Monday, April 17, 2000 at 12:00:00 AM GMT').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.skeleton = 'full';
            chart.primaryXAxis.skeletonType = 'DateTime';
            chart.primaryXAxis.intervalType = 'Years';
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.refresh();
        });
        it('checking with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                let label1: any = document.getElementById('containerAxisLabels0').childNodes[0];
                let label2: any = document.getElementById('containerAxisLabels0').childNodes[5];
                expect(+label1.getAttribute('x') > +label2.getAttribute('x')).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.primaryXAxis.intervalType = 'Days';
            chart.primaryXAxis.skeleton = '';
            chart.primaryXAxis.skeletonType = 'DateTime';
            chart.refresh();
        });
        it('checking with inversed with edge label Hide', () => {
            chart.loaded = null;
            chart.primaryXAxis.edgeLabelPlacement = 'Hide';
            chart.dataBind();
            svg = document.getElementById('container_ChartAreaBorder');
            let labels: any = document.getElementById('containerAxisLabels0');
            expect(labels.childElementCount).toEqual(6);
        });
        it('checking with inversed with edge label none', () => {
            chart.primaryXAxis.edgeLabelPlacement = 'None';
            chart.dataBind();
            let label1: any = document.getElementById('containerAxisLabels0').childNodes[5];
            svg = document.getElementById('container_ChartAreaBorder');
            expect(+label1.getAttribute('x') > +svg.getAttribute('x')).toBe(true);

        });
        it('checking non linear interval', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount).toEqual(2);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.intervalType = 'Years';
            chart.series[0].dataSource = dateTimedataInterval;
            chart.series[1].dataSource = dateTimedataInterval;
            chart.refresh();
        });
        it('checking with minor grid lines', () => {
            chart.primaryXAxis.minorTicksPerInterval = 3;
            chart.loaded = null;
            chart.dataBind();
            svg = document.getElementById('container_MinorGridLine_0_0');
            let path: string = document.getElementById('container_MinorGridLine_0_0').getAttribute('d');
            expect(path.match(/M/gi).length).toEqual(3);
        });
        it('checking minor grid with changing interval type', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_MinorGridLine_0_0').getAttribute('d');
                expect(path.match(/M/gi).length).toEqual(3);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Months';
            chart.refresh();
        });
        it('checking multiple axis', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string = document.getElementById('container_MinorGridLine_0_0').getAttribute('d');
                expect(path.match(/M/gi).length).toEqual(3);
                done();
            };
            chart.loaded = loaded;
            chart.axes = [{ valueType: 'DateTimeCategory', title: 'secondary axis', name: 'axis2', labelPlacement: 'OnTicks' }];
            chart.series[1].xAxisName = 'axis2';
            chart.refresh();
        });
        it('checking with interval', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount).toEqual(6);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.interval = 1;
            chart.refresh();
        });
        it('checking with minor grid for between ticks', () => {
            chart.primaryXAxis.labelPlacement = 'BetweenTicks';
            chart.axes[0].labelPlacement = 'BetweenTicks';
            chart.dataBind();
            let svg: any = document.getElementById('containerAxisLabels0').childNodes[0];
            axisLine = document.getElementById('containerAxisLine_0');
            expect(+svg.getAttribute('x') > (+axisLine.getAttribute('x1'))).toBe(true);
            expect(3 == 3).toBe(true);
        });
        it('checking datetime category axis with single points', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount).toEqual(1);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2000, 10, 10), y: 12 }];
            chart.series[1].dataSource = [{ x: new Date(2000, 10, 10), y: 13 }];
            chart.refresh();
        });
        it('checking datetime category axis with single points on ticks', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: any = document.getElementById('containerAxisLabels0').childNodes[0];
                axisLine = document.getElementById('containerAxisLine_0');
                expect(+svg.getAttribute('x') < (+axisLine.getAttribute('d').split(' ')[1])).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelPlacement = 'OnTicks';
            chart.axes[0].labelPlacement = 'OnTicks';
            chart.refresh();
        });
        it('checking with months with same type', (done: Function) => {
            loaded = (args: Object): void => {
                // let svg: any = document.getElementById('containerAxisLabels0').childNodes[0];
                // axisLine = document.getElementById('containerAxisLine_0');
                // expect(+svg.getAttribute('x') < (+axisLine.getAttribute('x1'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2017, 10, 2), y: 23 }, { x: new Date(2017, 10, 3), y: 45 },
            { x: new Date(2017, 10, 4), y: 76 }, { x: new Date(2018, 10, 4), y: 76 }];
            chart.primaryXAxis.intervalType = 'Months';
            chart.refresh();
        });
        it('checking with days with same type', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label.textContent).toEqual('11/2/2017');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2017, 10, 2, 3), y: 23 }, { x: new Date(2017, 10, 2, 7), y: 45 },
            { x: new Date(2017, 10, 2, 4), y: 76 }, { x: new Date(2018, 10, 4), y: 76 }];
            chart.primaryXAxis.intervalType = 'Days';
            chart.refresh();
        });
        it('checking with hours with same type', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label.textContent).toEqual('Thu 01:02');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2017, 10, 2, 1, 2), y: 23 }, { x: new Date(2017, 10, 2, 3, 4), y: 45 },
            { x: new Date(2017, 10, 2, 3, 34), y: 76 }, { x: new Date(2018, 10, 4), y: 76 }];
            chart.primaryXAxis.intervalType = 'Hours';
            chart.refresh();
        });
        it('checking with minutes with same type', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label.textContent).toEqual('03:02:12');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2017, 10, 2, 3, 2, 12), y: 23 }, { x: new Date(2017, 10, 2, 3, 2, 14), y: 45 },
            { x: new Date(2017, 10, 2, 3, 2, 20), y: 76 }, { x: new Date(2018, 10, 4), y: 76 }];
            chart.primaryXAxis.intervalType = 'Minutes';
            chart.refresh();
        });
        it('checking with seconds with same type', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('containerAxisLabels0').childNodes[0];
                expect(label.textContent).toEqual('03:02:12');
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource = [{ x: new Date(2017, 10, 2, 3, 2, 12), y: 23 }, { x: new Date(2017, 10, 2, 3, 2, 14), y: 45 },
            { x: new Date(2017, 10, 2, 3, 2, 14), y: 76 }, { x: new Date(2018, 10, 4), y: 76 }];
            chart.primaryXAxis.intervalType = 'Seconds';
            chart.refresh();
        });
        it('checking with annotation', (done: Function) => {
            let element: any;
            chart.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).not.toEqual(null);
                let left: string = (element as HTMLElement).style.left;
                let top: string = (element as HTMLElement).style.top;
                expect(left == '7.39844px' || left == '3.39844px').toBe(true);
                expect(top == '249.167px' || top == '255.389px' || top == '246.312px').toBe(true);
                done();
            };
            chart.annotations = [{
                x: new Date(2017, 10, 2, 3, 2, 12), y: 20, region: 'Series',
                coordinateUnits: 'Point', content: '<div>AnnotationText</div>'
            }];
            chart.refresh();
        });
        it('checking with strip lines', (done: Function) => {
            loaded = (args: Object) => {
                let stripLineElement = document.getElementById('container_stripline_Behind_rect_primaryXAxis_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById('container_stripline_Over_rect_primaryXAxis_0');
                expect(stripLineElement).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Years';
            chart.axes = [];
            chart.series = [{ dataSource: datetimeCategoryYearData1, xName: 'x', yName: 'y', name: 'striplLine' }];
            chart.primaryXAxis.stripLines = [
                {
                    startFromAxis: false, start: new Date(2000, 3, 17), size: 2,
                    verticalAlignment: 'End', opacity: 0.5,
                    color: 'red', zIndex: 'Behind', text: 'Behind'
                },
                {
                    start: new Date(2001, 3, 25), end: new Date(2002, 3, 30), opacity: 0.3,
                    color: 'blue', textStyle: { color: '#ffffff' },
                    text: 'Over', zIndex: 'Over'
                }];
            chart.refresh();
        });
        it('checking with strip lines', (done: Function) => {
            loaded = (args: Object) => {
                let stripLineElement: HTMLElement = document.getElementById('container_stripline_Over_rect_primaryXAxis_0');

                expect(stripLineElement).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.intervalType = 'Years';
            chart.primaryXAxis.minimum = null; chart.primaryXAxis.maximum = null;
            chart.primaryXAxis.interval = null;
            chart.axes = [];
            chart.series = [{ dataSource: datetimeCategoryYearData1, xName: 'x', yName: 'y', name: 'striplLine' }];
            chart.primaryXAxis.stripLines = [
                {
                    end: new Date(2002, 3, 30), opacity: 0.3,
                    color: 'blue', textStyle: { color: '#ffffff' },
                    text: 'Over', zIndex: 'Over'
                }];
            chart.refresh();
        });
        // it('checking with axis interval', (done: Function) => {
        //     loaded = (args: Object) => {
        //         let axisGroup = document.getElementById('containerAxisLabels0');
        //         expect(axisGroup.childElementCount).toEqual(2);
        //         done();
        //     };
        //     chart.loaded = loaded;
        //     chart.primaryXAxis.interval = 2;
        //     chart.refresh();
        // });
        it('checking with axis minimum', (done: Function) => {
            loaded = (args: Object) => {
                let axisGroup = document.getElementById('containerAxisLabels0');
                expect(axisGroup.childElementCount).toEqual(4);
                expect(axisGroup.childNodes[0].textContent).toEqual('4/18/2000');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.minimum = 2; chart.primaryXAxis.intervalType = 'Days';
            chart.primaryXAxis.interval = null;
            chart.refresh();
        });
        it('checking with axis maximum', (done: Function) => {
            loaded = (args: Object) => {
                let axisGroup = document.getElementById('containerAxisLabels0');
                expect(axisGroup.childElementCount).toEqual(5);
                expect(axisGroup.childNodes[0].textContent).toEqual('4/21/2000');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.maximum = 4;
            chart.primaryXAxis.minimum = null;
            chart.primaryXAxis.interval = null;
            chart.refresh();
        });
    });
    describe('Checking Column Definition', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer'});
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTimeCategory' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    axes: [
                        {
                            columnIndex: 1, name: 'yAxis1', title: 'Axis2', rangePadding: 'None', valueType: 'DateTimeCategory',
                            titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828' },
                            labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828' }
                        }
                    ],
                    series: [
                        {
                            name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2,
                            dataSource: datetimeCategoryYearData, xName: 'x', yName: 'y', animation: { enable: false }
                        },
                        {
                            name: 'series2', type: 'Line', fill: 'red', width: 2, xAxisName: 'yAxis1',
                            dataSource: datetimeCategoryYearData1, xName: 'x', yName: 'y', animation: { enable: false }
                        },
                    ],
                    height: '600', width: '900', title: 'Chart TS Title',
                    columns: [
                        {
                            width: '400', border: { width: 4, color: 'red' }
                        },
                        {
                            width: '400', border: { width: 4, color: 'blue' }
                        }
                    ], legendSettings: { visible: false }
                });
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking the bottom line', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('chartContainer_AxisBottom_Column0');

                expect(svg.getAttribute('x1') == '57.5' || svg.getAttribute('x1') == '53.5').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                svg = document.getElementById('chartContainer_AxisBottom_Column1');

                expect(svg.getAttribute('x1') == '457.5' || svg.getAttribute('x1') == '453.5').toBe(true);
                expect(svg.getAttribute('stroke') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#chartContainer');
        });
    });
    describe('Datetime category Axis label with line break', () => {
        let chart: Chart;
        let axisLine: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container'});
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'DateTimeCategory',
                    },
                    primaryYAxis: {},
                    series: [
                        {
                            type: 'Line', animation: { enable: false },
                            dataSource: [
                                { x: new Date(2017, 11, 20), y: 21 }, { x: new Date(2017, 11, 21), y: 24 },
                                { x: new Date(2017, 11, 22), y: 24 }, { x: new Date(2017, 11, 26), y: 70 },
                                { x: new Date(2017, 11, 27), y: 75 }, { x: new Date(2018, 0, 2), y: 82 },
                                { x: new Date(2018, 0, 3), y: 53 }, { x: new Date(2018, 0, 4), y: 54 },
                                { x: new Date(2018, 0, 5), y: 53 }, { x: new Date(2018, 0, 8), y: 45 }
                            ], xName: 'x', yName: 'y'
                        },
                    ],
                    height: '600', width: '900', legendSettings: { visible: false }
                }, '#container');
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking line break label with datatimecategory axis', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 10).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 2).toBe(true);
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 155).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelFormat = 'dd<br>MMM<br>yyyy';
            chart.refresh();
        });
        it('Checking line break labels with inversed datetimecategory axis', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_1');
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 755).toBe(true);
                expect(label.childElementCount == 2).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.refresh();
        });
        it('datetimecategory line break labels with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 10).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 2).toBe(true);
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 155).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.opposedPosition = true;
            chart.refresh();
        });
    });
    // describe('Checking IsIndex true', () => {
    //     let chartDTCObj: Chart;
    //     beforeAll((): void => {
    //         ele = createElement('div', { id: 'datetimecategory1' });
    //         document.body.appendChild(ele);
    //         chartDTCObj = new Chart(
    //             {
    //                 primaryXAxis: {
    //                     valueType: 'DateTimeCategory',
    //                     labelFormat: 'HH:mm:ss',
    //                     intervalType: 'Hours',
    //                     interval: 1,
    //                     majorGridLines: { width: 0 },
    //                     labelPlacement: 'OnTicks',
    //                     isIndexed: true,
    //                 },
    //                 //Initializing Primary X Axis
    //                 primaryYAxis: {
    //                     labelFormat: '{value}%',
    //                     rangePadding: 'None',
    //                     minimum: 0,
    //                     maximum: 100,
    //                     interval: 20,
    //                     lineStyle: { width: 0 },
    //                     majorTickLines: { width: 0 },
    //                     minorTickLines: { width: 0 }
    //                 },
    //                 chartArea: {
    //                     border: {
    //                         width: 0
    //                     }
    //                 },
    //                 //Initializing Chart Series
    //                 series: [
    //                     {
    //                         type: 'Line',
    //                         dataSource: [
    //                             { x: '2019-07-05T11:00:00+02:00', y: 21 },
    //                             { x: '2019-07-05T23:00:00+02:00', y: 24 },
    //                             { x: '2019-07-06T11:00:00+02:00', y: 36 },
    //                             { x: '2019-07-06T12:00:00+02:00', y: 38 },
    //                             { x: '2019-07-06T14:00:00+02:00', y: 54 },
    //                             { x: '2019-07-07T11:00:00+02:00', y: 57 },
    //                             { x: '2019-07-07T23:00:00+02:00', y: 70 }
    //                         ],
    //                         xName: 'x', width: 2,
    //                         marker: {
    //                             visible: true,
    //                             width: 10,
    //                             height: 10
    //                         },
    //                         yName: 'y', name: 'Germany',
    //                     },
    //                     {
    //                         type: 'Line',
    //                         dataSource: [
    //                             { x: '2019-07-05T16:00:00+02:00', y: 15 },
    //                             { x: '2019-07-05T22:00:00+02:00', y: 18 },
    //                             { x: '2019-07-06T13:00:00+02:00', y: 20 },
    //                             { x: '2019-07-06T15:00:00+02:00', y: 25 },
    //                             { x: '2019-07-06T17:00:00+02:00', y: 29 },
    //                             { x: '2019-07-07T18:00:00+02:00', y: 40 },
    //                             { x: '2019-07-07T20:00:00+02:00', y: 60 }
    //                         ],
    //                         xName: 'x', width: 2,
    //                         marker: {
    //                             visible: true,
    //                             width: 10,
    //                             height: 10
    //                         },
    //                         yName: 'y', name: 'England',
    //                     }
    //                 ],
    //                 title: 'DateTimeCategory Axis Index based',
    //                 width: '100%'
    //             });
    //     });

    //     afterAll((): void => {
    //         chartDTCObj.destroy();
    //         ele.remove();
    //     });
    //     it('Checking Axis labels', (done: Function) => {
    //         loaded = (args: ILoadedEventArgs): void => {
    //             let label: HTMLElement = document.getElementById('datetimecategory10_AxisLabel_1');
    //             expect(label.textContent).toBe('23:00:00, 22:00:00');
    //             expect(parseInt(label.getAttribute('x'), 10)).toBeLessThan(200);
    //             done();
    //         };
    //         chartDTCObj.loaded = loaded;
    //         chartDTCObj.appendTo('#datetimecategory1');
    //     });
    //     it('Checking Axis labels Inversed axis', (done: Function) => {
    //         loaded = (args: ILoadedEventArgs): void => {
    //             let label: HTMLElement = document.getElementById('datetimecategory10_AxisLabel_1');
    //             expect(label.textContent).toBe('23:00:00, 22:00:00');
    //             expect(parseInt(label.getAttribute('x'), 10)).toBeGreaterThan(500);
    //             done();
    //         };
    //         chartDTCObj.loaded = loaded;
    //         chartDTCObj.primaryXAxis.isInversed = true;
    //         chartDTCObj.dataBind();
    //     });
    // });
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