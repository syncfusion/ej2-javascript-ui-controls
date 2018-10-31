/**
 * Line and Area Series Spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { LineSeries } from '../../../src/chart/series/line-series';
import { StepLineSeries } from '../../../src/chart/series/step-line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents, rotateData1, rotateData2 } from '../base/data.spec';
import { tooltipData11, tooltipData12, datetimeData11, negativeDataPoint, seriesData1 } from '../base/data.spec';
import { firstSeries, secondSeries, thirdSeries, fourthSeries } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs, ITextRenderEventArgs } from '../../../src/common/model/interface';

Chart.Inject(LineSeries, ColumnSeries, AreaSeries, DateTime, Category, DataLabel, StepLineSeries);

export interface series1 {
    series: Series;
}

let data: any = tooltipData11;
let data2: any = tooltipData12;
let negativPoint: any = negativeDataPoint;
let dateTime: any = datetimeData11;

let india: any = firstSeries;
let germany: any = secondSeries;
let england: any = thirdSeries;
let france: any = fourthSeries;

describe('Chart Control Series', () => {
    /**
     * Marker Spec started here
     */
    describe('Line Series - Marker', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', minimum: 2005, maximum: 2011, interval: 1 },
                    primaryYAxis: { title: 'PrimaryYAxis', minimum: 25, maximum: 50, interval: 5, rangePadding: 'None' },
                    series: [{
                        animation: { enable: false },
                        dataSource: india, xName: 'x', yName: 'y', name: 'India',
                        fill: '#E94649', type: 'Line', marker: { visible: true }
                    }, {
                        animation: { enable: false },
                        dataSource: germany, xName: 'x', yName: 'y', name: 'germany', fill: '#F6B53F',
                        type: 'Line', marker: { visible: true }
                    }, {
                        animation: { enable: false },
                        type: 'Line', dataSource: england, xName: 'x', yName: 'y',
                        name: 'England', fill: '#6FAAB0', marker: { visible: true }
                    }, {
                        animation: { enable: false },
                        dataSource: france, name: 'France', xName: 'x', yName: 'y',
                        fill: '#C4C24A', type: 'Line', marker: { visible: true }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: number = document.getElementById('containerSymbolGroup1').childNodes.length;
                expect(series1 == 8).toBe(true);
                let marker: HTMLElement = document.getElementById('container_Series_3_Point_0_Symbol');
                expect(marker.getAttribute('stroke') == '#C4C24A').toBe(true);
                expect(marker.getAttribute('fill') == '#ffffff').toBe(true);
                expect(marker.getAttribute('rx') == '2.5').toBe(true);
                expect(marker.getAttribute('ry') == '2.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Changing visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('containerSymbolGroup1');
                expect(series1 == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.visible = false;
            chartObj.refresh();
        });
        it('Changing size', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_1_Point_3_Symbol');
                expect(series1.getAttribute('rx') == '5').toBe(true);
                expect(series1.getAttribute('ry') == '5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.visible = true;
            chartObj.series[1].marker.width = 10;
            chartObj.series[1].marker.height = 10;
            chartObj.refresh();
        });

        it('Changing size default', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement;
                series1 = document.getElementById('container_Series_1_Point_3_Symbol');
                expect(series1.getAttribute('rx') == '0').toBe(true);
                expect(series1.getAttribute('ry') == '0').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.width = 0;
            chartObj.series[1].marker.height = 0;
            chartObj.refresh();
        });

        it('Checking specify marker color', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1.getAttribute('fill') == 'violet').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.fill = 'violet';
            chartObj.refresh();
        });

        it('with checking column series marker visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1 !== null).toBe(true);
                 done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Column';
            chartObj.refresh();
        });

        it('Changing marker shape 1', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_3_Point_1_Symbol');
                let element: Element = new SvgRenderer('').createGroup({});
                let direction: string = series1.getAttribute('d');
                expect(direction.indexOf('z') > 0).toBe(true);
                series1 = document.getElementById('container_Series_2_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') == -1).toBe(true);
                series1 = document.getElementById('container_Series_1_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') > 0).toBe(true);
                series1 = document.getElementById('container_Series_0_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') == -1).toBe(true);
                series1 = document.getElementById('container_Series_2_Point_2_Symbol');
                expect(series1 == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Line';
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.width = 10;
            chartObj.series[1].marker.height = 10;
            chartObj.series[1].marker.width = 10;
            chartObj.series[2].marker.height = 10;
            chartObj.series[2].marker.width = 10;
            chartObj.series[3].marker.height = 10;
            chartObj.series[3].marker.width = 10;
            chartObj.series[0].marker.shape = 'Cross';
            chartObj.series[1].marker.shape = 'Diamond';
            chartObj.series[2].marker.shape = 'HorizontalLine';
            chartObj.series[3].marker.shape = 'InvertedTriangle';
            chartObj.pointRender = (args : IPointRenderEventArgs) => {
                if (args.point.index === 2 ) {
                    args.cancel = true;
                }
            };
            chartObj.refresh();
        });
        it('Changing marker shape 2', (done: Function) => {
            loaded = (args: Object): void => {
                let direction: string;
                let series1: HTMLElement;
                series1 = document.getElementById('container_Series_3_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') <= -1).toBe(true);
                series1 = document.getElementById('container_Series_2_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') > 0).toBe(true);
                series1 = document.getElementById('container_Series_1_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') > 0).toBe(true);
                series1 = document.getElementById('container_Series_0_Point_1_Symbol');
                direction = series1.getAttribute('d');
                expect(direction.indexOf('z') <= -1).toBe(true); done();
            };
            chartObj.loaded = loaded;

            chartObj.series[0].marker.shape = 'Pentagon';
            chartObj.series[1].marker.shape = 'Rectangle';
            chartObj.series[2].marker.shape = 'Triangle';
            chartObj.series[3].marker.shape = 'VerticalLine';
            chartObj.pointRender = null;
            chartObj.refresh();
        });
        it('with image', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(series1.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.shape = 'Image';
            chartObj.series[1].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.series[1].marker.height = 20;
            chartObj.series[1].marker.width = 20;
            chartObj.refresh();
        });

        it('with marker properties', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_2_Point_2_Symbol');
                expect(series1.getAttribute('fill') == 'green').toBe(true);
                expect(series1.getAttribute('opacity') == '0.1').toBe(true);
                expect(series1.getAttribute('stroke') == 'red').toBe(true);
                expect(series1.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[2].marker.fill = 'green';
            chartObj.series[2].marker.opacity = 0.1;
            chartObj.series[2].marker.border = {
                width: 4,
                color: 'red'
            };
            chartObj.refresh();

        });
    });

    /**
     * Default Line Series
     */

    describe('Line Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element1: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element1);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold',
                        fill: 'rgba(135,206,235,1)',
                        xName: 'x',
                        yName: 'y',
                        marker: {
                            visible: false
                        }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element1.remove();
        });

        it('Default Series Type without data Points', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true);
                let xAxisLabelCollection = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('With single data point', (done: Function) => {
            loaded = (args: Object): void => {

                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 1,
                y: 10
            }];
            chartObj.refresh();

        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 3).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 5).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 2;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 8;
            chartObj.primaryYAxis.maximum = 12;
            chartObj.primaryYAxis.interval = 1;
            chartObj.refresh();
        });

        it('Checking series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesCollection').childNodes.length;
                expect(seriesElements == 1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = false;
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.primaryYAxis.interval = null;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.refresh();
        });

        it('with data source', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesCollection').childNodes.length;
                expect(seriesElements == 2).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.primaryYAxis.interval = null;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('with range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.primaryXAxis.minimum = null;
                chartObj.primaryXAxis.maximum = null;
                chartObj.primaryXAxis.interval = null;
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let path: string = seriesElements.getAttribute('d');
                expect((path.match(/M/g) || []).length == 1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 10000;
            chartObj.primaryXAxis.interval = 1000;
            chartObj.refresh();
        });

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '2').toBe(true);
                let labelElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '2003').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[0].width = 2;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.refresh();
        });
        it('with dash array', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let stroke: string = seriesElements.getAttribute('stroke-dasharray');
                expect(stroke == '4').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dashArray = '4';
            chartObj.refresh();
        });

        it('with fill and stroke', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements = document.getElementById('container_Series_0');
                expect(seriesElements.getAttribute('stroke') == 'red').toBe(true);
                expect(seriesElements.getAttribute('stroke') != 'green').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') != '4').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') == '10').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dashArray = null;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].width = 10;
            chartObj.series[0].border.width = 4;
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });

        it('Animation', (done: Function) => {
            animate = (args: IAnimationCompleteEventArgs): void => {
                let pathLength: number = (<SVGPathElement>args.series.pathElement).getTotalLength();
                expect(pathLength >= 700).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].marker.visible = true;

            chartObj.animationComplete = animate;
            chartObj.refresh();

        });

        /*   it('within xAxis range', (done: Function) => {
               loaded = (args: Object): void => {
                   let svgLength: number = (<SVGPathElement>(<Series>chartObj.series[0]).pathElement).getTotalLength();
                   expect((Math.round(svgLength)) != 362).toBe(true); done();
               };
               chartObj.loaded = loaded;
               chartObj.primaryXAxis.minimum = 4500;
               chartObj.primaryXAxis.maximum = 6500;
               chartObj.primaryXAxis.interval = 500;
               chartObj.refresh();
           }); */
    });

    /**
     * Default Area Series
     */

    describe('Area Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element1: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element1);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold',
                        fill: 'rgba(135,206,235,1)',
                        type: 'Area',
                        xName: 'x',
                        yName: 'y',
                        marker: {
                            visible: false
                        }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element1.remove();
        });

        it('Default Series Type without data Points', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true);
                let xAxisLabelCollection = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('With single data point', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 1,
                y: 10
            }];
            chartObj.refresh();

        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 3).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 5).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 2;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 8;
            chartObj.primaryYAxis.maximum = 12;
            chartObj.primaryYAxis.interval = 1;
            chartObj.refresh();
        });

        it('Checking series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesCollection').childNodes.length;
                expect(seriesElements == 1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = false;
            chartObj.refresh();
        });

        it('with data source', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesCollection').childNodes.length;
                expect(seriesElements == 2).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.primaryYAxis.interval = null;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('with range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.primaryXAxis.minimum = null;
                chartObj.primaryXAxis.maximum = null;
                chartObj.primaryXAxis.interval = null;
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let path: string = seriesElements.getAttribute('d');
                expect((path.match(/M/g) || []).length == 1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 10000;
            chartObj.primaryXAxis.interval = 1000;
            chartObj.refresh();
        });

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '0').toBe(true);
                let labelElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '2003').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: null },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[0].width = 2;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.refresh();
        });


        it('with dash array', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0');
                let stroke: string = seriesElements.getAttribute('stroke-dasharray');
                expect(stroke == '4').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dashArray = '4';
            chartObj.refresh();
        });

        it('with fill and stroke', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements = document.getElementById('container_Series_0');
                expect(seriesElements.getAttribute('stroke') == 'green').toBe(true);
                expect(seriesElements.getAttribute('stroke') != 'red').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') != '10').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') == '4').toBe(true);
                expect(seriesElements.getAttribute('opacity') == '0.6').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].dashArray = null;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].width = 10;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].border.width = 4;
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });

        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {                
                let path = document.getElementById('container_Series_0');
                let id: string = path.getAttribute('d');
                let check: number = id.lastIndexOf('M');               
                expect(check !== 0).toBe(true);
                chartObj.destroy();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
    });

    describe('Line Series - Data Label', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    primaryYAxis: { rangePadding: 'None' },
                    series: [{
                        animation: { enable: false },
                        xName: 'x', yName: 'y',
                        name: 'India', fill: '#E94649',
                        marker: { visible: false, dataLabel: { visible: false } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('With single data point', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }];
            chartObj.refresh();

        });

        it('Showing default data label', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element.textContent == '65').toBe(true);
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });
        it('Showing default marker shape', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element.textContent == '65').toBe(true);
                expect(element.getAttribute('fill') == 'white').toBe(true);
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 6).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = '#E94649';
            chartObj.refresh();
        });

        it('checking visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = false;
            chartObj.refresh();
        });

        it('with marker visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element != null).toBe(true);
                let marker: number = +document.getElementById('container_Series_0_Point_3_Symbol').getAttribute('cy');
                let label: number = +document.getElementById('container_Series_0_Point_3_Text_0').getAttribute('y');
                expect(marker > label).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });

        it('with marker size without marker visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(marker == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });

        it('Checking edge dataLabel', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_5_Text_0');
                let location: number = (+marker.getAttribute('x')) + (+marker.getAttribute('width'));
                let clipRectWidth: number = 757.5;
                expect(location < clipRectWidth).toBe(true);
                marker = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(+marker.getAttribute('x') > 0).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking auto position', (done: Function) => {
            loaded = (args: Object): void => {
                let point0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                let point1: number = +document.getElementById('container_Series_0_Point_1_Text_0').getAttribute('y');
                let point2: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                let point3: number = +document.getElementById('container_Series_0_Point_3_Text_0').getAttribute('y');
                let point4: number = +document.getElementById('container_Series_0_Point_4_Text_0').getAttribute('y');
                let point5: number = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].y;
                let point1Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let point2Location: number = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                let point3Location: number = (<Points>(<Series>chartObj.series[0]).points[3]).symbolLocations[0].y;
                let point4Location: number = (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y;
                let point5Location: number = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;


                expect(point0 < point0Location).toBe(true);
                expect(point1 < point1Location).toBe(true);
                expect(point2 < point2Location).toBe(true);
                expect(point3 < point3Location).toBe(true);
                expect(point4 > point4Location).toBe(true);
                expect(point5 > point5Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Adding another series', (done: Function) => {

            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Line', fill: '#ACE5FF', width: 3,
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 45 },
                    { x: new Date(2002, 3, 7), y: 40 },
                    { x: new Date(2004, 3, 6), y: 45 },
                    { x: new Date(2006, 3, 30), y: 40 },
                    { x: new Date(2008, 3, 8), y: 45 },
                    { x: new Date(2010, 3, 8), y: 20 }
                ], xName: 'x', yName: 'y',
                marker: {
                    dataLabel: {
                        visible: true
                    }
                }
            }];
            chartObj.refresh();
        });

        it('Checking default data label position with multiple series', (done: Function) => {

            loaded = (args: Object): void => {
                let point0: number = +document.getElementById('container_Series_1_Point_0_Text_0').getAttribute('y');
                let point1: number = +document.getElementById('container_Series_1_Point_1_Text_0').getAttribute('y');
                let point2: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                let point3: number = +document.getElementById('container_Series_1_Point_3_Text_0').getAttribute('y');
                let point4: number = +document.getElementById('container_Series_1_Point_4_Text_0').getAttribute('y');
                let point5: number = +document.getElementById('container_Series_1_Point_5_Text_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[1]).points[0]).symbolLocations[0].y;
                let point1Location: number = (<Points>(<Series>chartObj.series[1]).points[1]).symbolLocations[0].y;
                let point2Location: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let point3Location: number = (<Points>(<Series>chartObj.series[1]).points[3]).symbolLocations[0].y;
                let point4Location: number = (<Points>(<Series>chartObj.series[1]).points[4]).symbolLocations[0].y;
                let point5Location: number = (<Points>(<Series>chartObj.series[1]).points[5]).symbolLocations[0].y;
                
                expect(point0 < point0Location).toBe(true);
                
               // expect(point1 < point1Location).toBe(true);
               
                expect(point2 < point2Location).toBe(true);
                
                expect(point3 > point3Location).toBe(true);
                 
                expect(point4 < point4Location).toBe(true);
                
                expect(point5 > point5Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking data label shape without fill', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_1_Point_2_TextShape_0');
                expect(marker.getAttribute('stroke') == 'grey').toBe(true);
                expect(marker.getAttribute('stroke-width') == '2').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.border.width = 2;
            chartObj.series[1].marker.dataLabel.border.color = 'grey';
            chartObj.refresh();
        });


        it('Checking font color saturation - background black', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_1_Point_3_Text_0');
                expect(marker.getAttribute('fill') == 'white').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'black';
            chartObj.chartArea.border = {
                color: ''
            };
            chartObj.refresh();
        });

        it('Checking font color saturation - background white', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_1_Point_3_Text_0');
                expect(marker.getAttribute('fill') == 'black').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'white';
            chartObj.refresh();
        });
        it('Checking dataLabel positions Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                let hiddenText: HTMLElement = document.getElementById('container_Series_1_Point_1_Text_0');
                expect(hiddenText == null).toBe(true);
                expect(hiddenShape == null).toBe(true);
                let element: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y < element).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y > element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let element: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                let locationY: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let height: number = document.getElementById('container_Series_1_Point_2_Text_0').getBoundingClientRect().height;
                expect(locationY == (element - (height / 4))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Outer', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y > element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Checking font color saturation with font color', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(marker.getAttribute('fill') == 'green').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.font.color = 'green';
            chartObj.refresh();
        });
        it('Checking Data label format', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(marker.textContent == 'This is 65').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'This is {value}';
            chartObj.refresh();
        });
        it('Checking Data label format with globalize format', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(marker.textContent == '65.00').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'n2';
            chartObj.refresh();
        });
        it('Checking Datalabel alignment with position auto - alignment near', (done: Function) => {
            let svg: number;
            loaded = (args: Object): void => {
                svg = +document.getElementById('container_Series_0_Point_4_TextShape_0').getAttribute('y');
                expect(svg > (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y).toBe(true);
                done();
            };
            svg = +document.getElementById('container_Series_0_Point_4_TextShape_0').getAttribute('y');
            expect(svg > (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y).toBe(true);
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Datalabel alignment with position auto - alignment far', (done: Function) => {
            let svg: number;
            loaded = (args: Object): void => {
                svg = +document.getElementById('container_Series_0_Point_4_TextShape_0').getAttribute('y');
                expect(svg > (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking Data label alignment except Auto position in Bottom Position - near', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.series[1].marker.visible = false;
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position in Bottom Position - far', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let elementHeight: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('height');
                let symbolLocation = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY < (symbolLocation + elementHeight)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position in Bottom Position - center', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });
        it('Checking Datalabel alignment except Auto position in Outer Position - near', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape == null).toBe(true);
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                elementY = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                symbolLocation = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let elementHeight: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('height');
                expect(elementY > (symbolLocation - elementHeight - elementHeight)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Datalabel alignment except Auto position in Outer Position - far', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY < (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });

        it('Checking Datalabel alignment except Auto position in Outer Position - middle', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY < (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position in Top Position', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape == null).toBe(true);
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY > (symbolLocation)).toBe(true);
                elementY = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                symbolLocation = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let elementHeight: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('height');
                expect(elementY > (symbolLocation - elementHeight - elementHeight)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position in Middle Position - near', (done: Function) => {
            loaded = (args: Object): void => {
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY > (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position in Middle Position - far', (done: Function) => {
            loaded = (args: Object): void => {
                let elementY: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementY < (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking Data label alignment except Auto position in Middle Position - center', (done: Function) => {
            loaded = (args: Object): void => {
                let elementY: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let height: number = document.getElementById('container_Series_1_Point_2_Text_0').getBoundingClientRect().height;
                expect((elementY - (height / 4)) == (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });

        it('Checking margin', (done: Function) => {
            loaded = (args: Object): void => {
                let shape = document.getElementById('container_Series_0_Point_2_TextShape_0');
                let shapeY = + shape.getAttribute('y');
                let shapeX = + shape.getAttribute('x');
                let shapeWidth = + shape.getAttribute('width');
                let shapeHeight = + shape.getAttribute('height');
                let text = document.getElementById('container_Series_0_Point_2_Text_0');
                let textX = + text.getAttribute('x');
                let textY = + text.getAttribute('y');
                expect(textX > (shapeX + 20)).toBe(true);
                expect(textY > (shapeY + 25)).toBe(true);
                expect(textY < (shapeY + shapeHeight - 5)).toBe(true);
                expect(textX < (shapeX + shapeWidth - 10)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.margin = {
                left: 20,
                right: 10,
                top: 25,
                bottom: 5
            }
            chartObj.refresh();
        })

        it('Checking Overlap data', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup2').childNodes.length == 3).toBe(true);
                expect(document.getElementById('container_Series_2_Point_0_TextShape_0') == null).toBe(true);
                expect(document.getElementById('container_Series_2_Point_2_TextShape_0') == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.margin = {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
            }
            chartObj.series = [chartObj.series[0], chartObj.series[1], {
                name: 'series1', type: 'Line', fill: 'violet', width: 4,
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 45 },
                    { x: new Date(2002, 3, 7), y: 60 },
                    { x: new Date(2004, 3, 6), y: 45 },
                    { x: new Date(2006, 3, 30), y: 60 },
                    { x: new Date(2008, 3, 8), y: 40 },
                    { x: new Date(2010, 3, 8), y: 85 }
                ],
                xName: 'x', yName: 'y',
                marker: { dataLabel: { visible: true, fill: 'black', opacity: 0.6 } }
            }];
            chartObj.refresh();
        })
        it('Changing series Type', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup2').childNodes.length == 6).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[2].type = 'Column';
            chartObj.refresh();
        });
        it('Checking properties', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                expect(document.getElementById('container_Series_0_Point_3_Text_0').textContent == '65.00').toBe(true);
                let element = document.getElementById('container_Series_1_Point_2_TextShape_0');
                expect(element.getAttribute('fill') == 'transparent').toBe(true);
                expect(element.getAttribute('stroke') == 'green').toBe(true);
                expect(element.getAttribute('stroke-width') == '2').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'transparent';
            chartObj.series[1].marker.dataLabel.fill = 'transparent';
            chartObj.series[1].marker.dataLabel.border = {
                width: 2,
                color: 'green'
            };
            chartObj.series[0].marker.dataLabel.rx = 10;
            chartObj.series[0].marker.dataLabel.ry = 10;
            chartObj.series[2].marker.dataLabel.rx = 10;
            chartObj.series[2].marker.dataLabel.ry = 10;
            chartObj.refresh();
        });
        it('checking auto position for scope', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let series0: Object = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            let series1: Object = [
                { x: new Date(2000, 6, 11), y: 45 },
                { x: new Date(2002, 3, 7), y: 40 },
                { x: new Date(2004, 3, 6), y: 45 },
                { x: new Date(2006, 3, 30), y: 40 },
                { x: new Date(2008, 3, 8), y: 45 },
                { x: new Date(2010, 3, 8), y: 20 }
            ];
            let series2: Object = [
                { x: new Date(2000, 6, 11), y: 45 },
                { x: new Date(2002, 3, 7), y: 60 },
                { x: new Date(2004, 3, 6), y: 45 },
                { x: new Date(2006, 3, 30), y: 60 },
                { x: new Date(2008, 3, 8), y: 40 },
                { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[1].marker.dataLabel.position = 'Auto';
            chartObj.series[2].marker.dataLabel.position = 'Auto';
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.series[0].type = 'Line';
            chartObj.series[1].type = 'Line';
            chartObj.series[2].type = 'Line';
            series1[1].y = null;
            series1[4].y = null;
            series0[4].y = null;
            series0[3].y = null;
            series0[1].y = null;
            series2[4].y = null;
            chartObj.series[0].dataSource = series0;
            chartObj.series[1].dataSource = series1;
            chartObj.series[2].dataSource = series2;
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 97;
            chartObj.primaryYAxis.interval = 44;
            chartObj.refresh();
        });
        it('checking auto position for scope - top', (done: Function) => {
            let series0: Object = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(svg != null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            series0[4].y = 45;
            chartObj.series[0].dataSource = series0;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('checking dataLabel Top edge', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(svg != null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = 25;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.primaryYAxis.interval = 5;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series = [{
                animation: { enable: false },
                dataSource: [{
                    x: 2005,
                    y: 30
                }, {
                    x: 2006,
                    y: 40
                }, {
                    x: 2007,
                    y: 40
                }, {
                    x: 2008,
                    y: 48
                }, {
                    x: 2009,
                    y: 25
                }, {
                    x: 2010,
                    y: 39
                }],
                xName: 'x', yName: 'y',
                name: 'India',
                fill: '#E94649',
                marker: {
                    visible: false,
                    dataLabel: {
                        visible: true,
                        position: 'Top',
                        fill: ''
                    }
                }
            }];
            chartObj.refresh();
        });
        it('checking stepline Top edge', (done: Function) => {
            loaded = (args: Object): void => {
                let element: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                let location: number = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].y;
                expect(element < location).toBe(true);
                element = +document.getElementById('container_Series_0_Point_1_Text_0').getAttribute('y');
                location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(element < location).toBe(true);
                element = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                location = (<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y;
                expect(element < location).toBe(true);
                element = +document.getElementById('container_Series_0_Point_3_Text_0').getAttribute('y');
                location = (<Points>(<Series>chartObj.series[0]).points[3]).symbolLocations[0].y;
                expect(element > location).toBe(true);
                element = +document.getElementById('container_Series_0_Point_4_Text_0').getAttribute('y');
                location = (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y;
                expect(element > location).toBe(true);
                element = +document.getElementById('container_Series_0_Point_5_Text_0').getAttribute('y');
                location = (<Points>(<Series>chartObj.series[0]).points[5]).symbolLocations[0].y;
                expect(element < location).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.primaryYAxis.interval = 5;
            chartObj.primaryXAxis.minimum = 2004;
            chartObj.primaryXAxis.maximum = 2014;
            chartObj.primaryXAxis.interval = 2;
            chartObj.series[0].type = 'StepLine';
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();
        });
    });

    describe('Data Label with Event checking', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let text: EmitType<ITextRenderEventArgs>;
        let element: Element;
        beforeAll((): void => {
            element = createElement('div', { id: 'datalabelcontainer' });
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                        lineStyle: { width: 2 },
                        valueType: 'DateTime'
                    },

                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [
                        {
                            name: 'series1', type: 'Line', fill: '#663AB6', width: 1,
                            marker: { visible: true, dataLabel: { visible: true, fill: 'transparent' } },
                            animation: { enable: false }, dataSource: [
                                { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                                { x: new Date(2004, 3, 6), y: -15 }, { x: new Date(2006, 3, -30), y: -65 },
                                { x: new Date(2007, 3, 8), y: 90 }, { x: new Date(2008, 3, 8), y: 85 }],
                            xName: 'x',
                            yName: 'y'
                        }
                    ], title: 'Chart TS Title'
                });
            chart.appendTo('#datalabelcontainer');

        });

        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking text render event', (done: Function) => {
            loaded = (args: Object): void => {
                let element: Element = document.getElementById('datalabelcontainer_Series_0_Point_4_TextShape_0');
                expect(document.getElementById('datalabelcontainer_Series_0_Point_3_TextShape_0') == null).toBe(true);
                expect(element != null).toBe(true);
                expect(element.getAttribute('fill') == 'transparent').toBe(true);
                expect(document.getElementById('datalabelcontainer_Series_0_Point_5_TextShape_0') == null).toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_5_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_2_TextShape_0');
                expect(element.getAttribute('fill') == 'red').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_2_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_3_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_5_Text_0');
                expect(element.textContent == '5th').toBe(true);
                done();
            };
            text = (args: ITextRenderEventArgs): void => {
                if (args.point.index == 4) {
                    args.border.color = 'green';
                    args.border.width = 2;
                }
                if (args.point.index == 2) {
                    args.color = 'red';
                    args.border.color = 'green';
                    args.border.width = 2;
                }
                if (args.point.index == 5) {
                    args.text = '5th';
                }
            };
            chart.loaded = loaded;
            chart.textRender = text;
            chart.refresh();
        });
        it('checking top corner text color', (done: Function) => {
            loaded = (args: Object): void => {
                let element: Element = document.getElementById('datalabelcontainer_Series_0_Point_0_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                element = document.getElementById('datalabelcontainer_Series_0_Point_1_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.textRender = null;
            chart.series[0].type = 'Column';
            chart.series[0].fill = 'black';
            chart.series[0].marker.visible = false;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.primaryYAxis.minimum = 9;
            chart.primaryYAxis.maximum = 75;
            chart.refresh();
        });
    });
    describe('Area Series Inversed axis', () => {
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
                        name: 'ChartSeriesNameGold', dataSource: seriesData1, xName: 'x', yName: 'y', 
                        type: 'Area', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
        it('With Label position Top', (done: Function) => {
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
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
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

        describe('checking rotated area chart', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let animationComplete:  EmitType<IAnimationCompleteEventArgs>;
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
                    { type: 'Area', name: 'area', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}},
                    { type: 'Area', name: 'area', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}}
                ],
                title: 'rotated area Chart'
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
        it('checking animation', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                done();
            };
            chart.series[0].animation.enable = true;
            chart.series[1].animation.enable = true;
            chart.animationComplete = animationComplete;
            chart.refresh();
        });
    });


});