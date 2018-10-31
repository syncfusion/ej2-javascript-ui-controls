/**
 * Column Series Spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { ChartSeriesType, ChartRangePadding } from '../../../src/chart/utils/enum';
import { ValueType } from '../../../src/chart/utils/enum';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { tooltipData1, negativeDataPoint, rotateData1, rotateData2 } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DataLabel, Category, DateTime, Tooltip, Crosshair);

describe('Column Series', () => {
    let element: HTMLElement;
    /**
     * Default Column Series
     */

    describe('Column Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold', dataSource : [],
                        type: 'Column', fill: 'rgba(135,206,235,1)',
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }

                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Default Series Type without data Points', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svg == 1).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true);
                 done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 1,
                y: 10
            }];
            chartObj.series[0].name = 'Changed';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.refresh();
        });
        it('checking datasource in Chart', (done: Function) => {
            chartObj.series[0].dataSource = null;
            chartObj.loaded = (args: Object) => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.dataSource = [{
                x: 10,
                y: 10.5
            }];
            chartObj.dataBind();
        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
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
                expect(seriesElements == 1).toBe(true);
                done();
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
                let seriesElements: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(seriesElements != null).toBe(true);
                 done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.refresh();
        });

        it('with range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.primaryXAxis.minimum = null;
                chartObj.primaryXAxis.maximum = null;
                chartObj.primaryXAxis.interval = null;
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
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
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '0').toBe(true);
                let labelElement: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '2003').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[0].width = 2;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = null;
            chartObj.refresh();
        });

        it('with dash array', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let stroke: string = seriesElements.getAttribute('stroke-dasharray');
                expect(stroke == '4,3').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dashArray = '4,3';
            chartObj.refresh();
        });

        it('with empty point(y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = [{ x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
            { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
            { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource[3].y = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = [{ x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
            { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
            { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource[3].y = 10;
            dataSource[3].x = null;

            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with empty point(x and y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let seriesElements1: HTMLElement = document.getElementById('container_Series_0_Point_5');
                expect(seriesElements == null).toBe(true);
                expect(seriesElements1 == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = [{ x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
            { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
            { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }];
            dataSource[3].y = null;
            dataSource[3].x = null;
            dataSource[5].y = null;
            dataSource[5].x = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

       it('with fill and stroke', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements.getAttribute('stroke') == 'green').toBe(true);
                expect(seriesElements.getAttribute('stroke') != 'red').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') != '10').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource =  [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].dashArray = null;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].width = 10;
            chartObj.series[0].border.width = 4;
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });
        it('checking with border', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0_Point_1');
                let path = svg.getAttribute('d');
                let count = path.indexOf('Z');
                expect(count !== -1).toBe(true);
                expect(svg.getAttribute('stroke') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].border.color = 'red';
            chartObj.series[0].border.width = 4;
            chartObj.refresh();
        });

        it('within xAxis range', (done: Function) => {
            loaded = (args: Object): void => {
                let svgLength: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(svgLength == 5).toBe(true); done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.minimum = 4500;
            chartObj.primaryXAxis.maximum = 6500;
            chartObj.primaryXAxis.interval = 500;
            chartObj.refresh();
        });
    });

    describe('Column Series with negative', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationCOmplete: EmitType<IAnimationCompleteEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTime' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold',
                        dataSource: [{ x: new Date(2000, 6, -11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                        { x: new Date(2004, 3, 6), y: -15 }, { x: new Date(2006, 3, 30), y: 65 },
                        { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
                        ], xName: 'x', yName: 'y',
                        type: 'Column', fill: 'rgba(135,206,235,1)',
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }

                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Default Series Type with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let seriesElements1: HTMLElement = document.getElementById('container_Series_0_Point_5');
                expect(seriesElements != null).toBe(true);
                expect(seriesElements1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking animation', (done: Function) => {

            animationCOmplete = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };

            chartObj.series[0].animation.enable = true;


            chartObj.animationComplete = animationCOmplete;

            chartObj.refresh();

        });
    });

    describe('DataLabel', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    primaryYAxis: { rangePadding: 'None' },
                    series: [{
                        animation: { enable: false },
                        dataSource: [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                        { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                        { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }], xName: 'x', yName: 'y', name: 'India',
                        fill: '#E94649', type: 'Column', marker: { visible: false, dataLabel: { visible: false } }
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

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element.textContent == '65').toBe(true);
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.loaded = loaded;
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
                expect(element == null).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('with marker visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(element != null).toBe(true);
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                let label: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(marker !== null).toBe(true); done();
            };
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });


        it('with marker size without marker visibility', (done: Function) => {
            loaded = (args: Object): void => {
            let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
            expect(marker == null).toBe(true); 
            //Checking edge dataLabel
            marker = document.getElementById('container_Series_0_Point_5_Text_0');
            let location: number = (+marker.getAttribute('x')) + (+marker.getAttribute('width'));
            let clipRectWidth: number = 757.5;
            expect(location < clipRectWidth).toBe(true);
            marker = document.getElementById('container_Series_0_Point_0_Text_0');
            expect(+marker.getAttribute('x') > 0).toBe(true); 
            //Checking auto position
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
            expect(point5 > point5Location).toBe(true); 
            done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });

        it('Added another series', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Column', fill: '#ACE5FF', width: 3,
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 45 },
                    { x: new Date(2002, 3, 7), y: 40 },
                    { x: new Date(2004, 3, 6), y: 45 },
                    { x: new Date(2006, 3, 30), y: 40 },
                    { x: new Date(2008, 3, 8), y: 45 },
                    { x: new Date(2010, 3, 8), y: 20 }
                ],
                xName: 'x', yName: 'y',
                marker: { dataLabel: { visible: true } }
            }];
            chartObj.loaded = loaded;
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
                expect(point1 < point1Location).toBe(true);
                expect(point2 < point2Location).toBe(true);
                expect(point3 < point3Location).toBe(true);
                expect(point4 < point4Location).toBe(true);
                expect(point5 < point5Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings = { visible: false };
            chartObj.tooltip.enable = false;
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

        it('Checking dataLabel positions Default', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                let hiddenText: HTMLElement = document.getElementById('container_Series_1_Point_1_Text_0');
                expect(hiddenText != null).toBe(true);
                expect(hiddenShape != null).toBe(true);
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
                expect((<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y < element1).toBe(true);
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
                expect(locationY != element).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Outer', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_1_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y > element1).toBe(true); done();
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

        it('Checking Data label format with globalize format', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(marker.textContent == '65.00').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'n2';
            chartObj.refresh();
        });

        it('Checking Data label alignment with position auto - near alignment', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_4_TextShape_0').getAttribute('y');
                expect(svg > (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });
        it('Checking Data label alignment with position auto - far alignment', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_4_TextShape_0').getAttribute('y');
                expect(svg > (<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking Data label alignment except Auto position - bottom Position alignment near', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position - bottom Position alignment far', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementY: HTMLElement = document.getElementById('container_Series_1_Point_2_TextShape_0');
                expect(elementY != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });

      /*  it('Checking Data label alignment except Auto position - bottom Position alignment center', (done: Function) => {
            loaded = (args: Object): void => {
                let xLocation: number = +document.getElementById('container_Series_1_Point_5_TextShape_0').getAttribute('x');
                let width: number = +document.getElementById('container_ChartAreaBorder').getAttribute('width');
               // expect(xLocation > width).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });*/
        it('Checking Data label alignment except Auto position - Outer Position  - alignment near', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementYLocation: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementYLocation > (symbolLocation)).toBe(true);
                elementYLocation = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                symbolLocation = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementYLocation > (symbolLocation)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position - Outer Position  - alignment far', (done: Function) => {
            loaded = (args: Object): void => {
                let xLocation = +document.getElementById('container_Series_1_Point_5_TextShape_0').getAttribute('x');
                let width = +document.getElementById('container_ChartAreaBorder').getAttribute('width');
              //  expect(xLocation > width).toBe(true);
                let elementYLocation: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementYLocation < (symbolLocation)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });

        it('Checking Data label alignment except Auto position - Outer Position - alignment center', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementYLocation: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementYLocation < (symbolLocation)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });
        it('Checking Data label alignment except Auto position - Top Position', (done: Function) => {
            loaded = (args: Object): void => {
                let hiddenShape: HTMLElement = document.getElementById('container_Series_1_Point_1_TextShape_0');
                expect(hiddenShape != null).toBe(true);
                let elementYLocation: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                let symbolLocation: number = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                expect(elementYLocation > (symbolLocation)).toBe(true);
                elementYLocation = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                symbolLocation = (<Points>(<Series>chartObj.series[1]).points[2]).symbolLocations[0].y;
                let elementHeight: number = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('height');
                expect(elementYLocation != (symbolLocation - elementHeight - 5)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.series[1].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });

        it('Checking margin', (done: Function) => {
            loaded = (args: Object): void => {
                let shape: HTMLElement = document.getElementById('container_Series_0_Point_2_TextShape_0');
                let shapeY: number = + shape.getAttribute('y');
                let shapeX: number = + shape.getAttribute('x');
                let shapeWidth: number = + shape.getAttribute('width');
                let shapeHeight: number = + shape.getAttribute('height');
                let text: HTMLElement = document.getElementById('container_Series_0_Point_2_Text_0');
                let textX: number = + text.getAttribute('x');
                let textY: number = + text.getAttribute('y');
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
            };
            chartObj.refresh();
        })
        it('Checking Overlap data', (done: Function) => {            
            chartObj.loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup2').childNodes.length == 6).toBe(true);
                expect(document.getElementById('container_Series_2_Point_0_TextShape_0') != null).toBe(true);
                expect(document.getElementById('container_Series_2_Point_2_TextShape_0') != null).toBe(true); done();
            };
            chartObj.series[0].marker.dataLabel.margin = {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
            }
            chartObj.series = [chartObj.series[0], chartObj.series[1], {
                name: 'series1', type: 'Column', fill: 'violet', width: 4,
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 45 },
                    { x: new Date(2002, 3, 7), y: 60 },
                    { x: new Date(2004, 3, 6), y: 45 },
                    { x: new Date(2006, 3, 30), y: 60 },
                    { x: new Date(2008, 3, 8), y: 40 },
                    { x: new Date(2010, 3, 8), y: 85 }
                ], xName: 'x', yName: 'y',
                marker: { dataLabel: { visible: true, fill: 'black', opacity: 0.6 } }
            }];
            chartObj.refresh();

        })
        it('Changing series Type', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup2').childNodes.length > 4).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[2].type = 'Line';
            chartObj.refresh();
        });
        it('Checking properties', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                expect(document.getElementById('container_Series_0_Point_3_Text_0').textContent == '65.00').toBe(true);
                let element: HTMLElement = document.getElementById('container_Series_1_Point_2_TextShape_0');
                expect(element.getAttribute('fill') == 'transparent').toBe(true);
                expect(element.getAttribute('stroke') == 'green').toBe(true);
                expect(element.getAttribute('stroke-width') == '2').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'transparent';
            chartObj.series[1].marker.dataLabel.fill = 'transparent';
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
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

        it('Series Visible', (done: Function) => {
            loaded = (args: Object): void => {
                let trigger: MouseEvents = new MouseEvents();
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let id: string = 'container';
                let legendId: string = id + '_chart_legend';

                let legendElement: HTMLElement = document.getElementById(legendId + '_text_' + 0);
                chartObj.loaded= null;
                trigger.clickEvent(legendElement);

                target = document.getElementById('container_Series_1_Point_1');
                series = <Series>chartObj.series[1];
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');

                let seriesElements: number = document.getElementById('containerSeriesCollection').childNodes.length;
                expect(seriesElements == 4).toBe(true);              
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings = { visible: true };
            chartObj.tooltip.enable =true;
            chartObj.refresh();
        });
    });

    /**
     * Data Label negative point
     */
    describe('Column Series with negative point data label', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'Column', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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

        it('With negative location', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg > point0Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true);
                let rect: number = +document.getElementById('container_Series_0_Point_1').getAttribute('y');
                let rectHeight: number = +document.getElementById('container_Series_0_Point_1').getAttribute('height');
                expect(svg == (rect + 5)); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });
        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let svgHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true);
                let rect: number = +document.getElementById('container_Series_0_Point_1').getAttribute('y');
                let rectHeight: number = +document.getElementById('container_Series_0_Point_1').getAttribute('height');
                expect(svg == (rect - svgHeight + rectHeight / 2)); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Color saturation middle position', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Color saturation fill as transparent', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'transparent';
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Color saturation with chart area background black', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'black';
            chartObj.chartArea.border = {
                color: ''
            };
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Color saturation with top position', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('Color saturation with data label fill color', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element.getAttribute('fill') == 'white').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.series[0].marker.dataLabel.position = 'Outer';
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
            chartObj.dataBind();
        });
    });
    describe('column Series Inversed axis', () => {
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
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', isInversed: true },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'Column', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chart.appendTo('#container');
            unbindResizeEvents(chart);
        });

        afterAll((): void => {
            chart.destroy();
            element.remove();
        });

        it('With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.refresh();
            unbindResizeEvents(chart);
        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();
            unbindResizeEvents(chart);
        });

        it('With Label position Top', (done: Function) => {
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
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();
            unbindResizeEvents(chart);
        });
        it('With Label position Bottom', (done: Function) => {
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
            chart.refresh();
            unbindResizeEvents(chart);
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
            unbindResizeEvents(chart);
        });
    });
    describe('checking Column rotated chart', () => {
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
                    { type: 'Column', name: 'columnSeries1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false }},
                    { type: 'Column', name: 'columnSeries2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false } }
                ],
                title: 'rotated Column Chart'
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
                //positive yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.refresh();
        });
        it('checking with datalabel Outer position', (done: Function) => {
            loaded = (args: Object): void => {
                //positive yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();
        });
        it('checking with datalabel Top position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) < (point.symbolLocations[0].x + point.regions[0].width / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                //position yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x - point.regions[0].width).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x + point.regions[0].width).toBe(true);
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
                expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')));


                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
            chart.refresh();
        });
        it('checking with tooltip negative values', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')));
                y = (parseFloat(chartArea.getAttribute('height')) + element.offsetTop) / 2 + 10;
                x = (parseFloat(chartArea.getAttribute('width')) + element.offsetLeft) / 2 + 60;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                done();
            };
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: Object): void => {
                let tooltip: HTMLElement = document.getElementById('container_Series_0_Point_1');
                expect(tooltip.getAttribute('opacity') === '1').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.animationComplete = animate;
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
            chart.animationComplete = null;
            chart.tooltip.shared = true;
            chart.refresh();
        });
    });
    describe('checking Column Width and Spacing', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let chartId: string = 'column-chart';
        let element: HTMLElement = createElement('div', { id: chartId });
        let point: Element;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                //Initializing Primary Y Axis
                primaryYAxis: {
                    labelFormat: '{value}%',
                    rangePadding: 'Normal',
                    minimum: 20, maximum: 45, interval: 5
                },
                enableSideBySidePlacement: false,
                //Initializing Chart Series
                series: [
                    {
                        type: 'Column', name: 'India', xName: 'x', yName: 'y', fill: 'skyblue', visible: true,
                        dataSource: [
                            { x: 2005, y: 28 }, { x: 2006, y: 25 },{ x: 2007, y: 26 }, { x: 2008, y: 27 }
                        ], animation: { enable: false},
                        marker: { visible: true, dataLabel: { visible: true}}
                    },
                    {
                        type: 'Column', name: 'Germany', xName: 'x', yName: 'y', fill: 'purple', visible: true,
                        opacity: 0.8,
                        dataSource: [
                            { x: 2005, y: 31 }, { x: 2006, y: 28 },{ x: 2007, y: 30 }, { x: 2008, y: 36 }
                        ], animation: { enable: false},
                        marker: { visible: true, dataLabel: { visible: true}}
                    },
                    {
                        type: 'Column', name: 'Italy', xName: 'x', yName: 'y', fill: 'lightgreen', visible: true,
                        dataSource: [
                            { x: 2005, y: 26 }, { x: 2006, y: 30 },{ x: 2007, y: 28 }, { x: 2008, y: 32 }
                        ], animation: { enable: false},
                        marker: { visible: true, dataLabel: { visible: true}}
                    }
                ],
                legendSettings: { visible: false},
                width: '800px',
                height: '400px'
            });
            chart.appendTo('#' + chartId);
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('side by side placement false checking', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById(chartId + '_Series_0_Point_1');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x).toBe(214);
                point = document.getElementById(chartId + '_Series_1_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(214);
                point = document.getElementById(chartId + '_Series_2_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(214);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('side by side placing enable true', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById(chartId + '_Series_0_Point_1');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x).toBe(214);
                point = document.getElementById(chartId + '_Series_1_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(258);
                point = document.getElementById(chartId + '_Series_2_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 302 || x === 301).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.enableSideBySidePlacement = true;
            chart.refresh();
        });
        it('Column width and spacing checking', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById(chartId + '_Series_0_Point_1');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x).toBe(202);
                point = document.getElementById(chartId + '_Series_1_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(264);
                point = document.getElementById(chartId + '_Series_2_Point_1');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 327 || x === 326).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].columnWidth = 1;
            chart.series[0].columnSpacing = 0.5;
            chart.series[1].columnWidth = 1;
            chart.series[1].columnSpacing = 0.5;
            chart.series[2].columnWidth = 1;
            chart.series[2].columnSpacing = 0.5;
            chart.refresh();
        });
        it('Column Corner Radius Rounded rect checking', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById(chartId + '_Series_0_Point_2');
                let path: string[] = point.getAttribute('d').split(' ');
                let x1: number = parseInt(path[4], 10);
                let y1: number = parseInt(path[5], 10);
                let x2: number = parseInt(path[6], 10);
                let y2: number = parseInt(path[7], 10);
                expect(x1 === 389 || x1 === 388).toBe(true);
                expect(y1 === 269 || y1 === 268).toBe(true);
                expect(x2 === 394 || x2 === 393).toBe(true);
                expect(y2 === 269 || y2 === 268).toBe(true);
                expect(y1 == y2).toBe(true);
                x1 = parseInt(path[12], 10);
                y1 = parseInt(path[13], 10);
                x2 = parseInt(path[14], 10);
                y2 = parseInt(path[15], 10);
                expect(x1 === 420 || x1 === 419).toBe(true);
                expect(y1 === 269 || y1 === 268).toBe(true);
                expect(x2 === 420 || x2 === 419).toBe(true);
                expect(y2 === 279 || y2 === 278).toBe(true);
                expect(x1 == x2).toBe(true);
                x1 = parseInt(path[20], 10);
                y1 = parseInt(path[21], 10);
                x2 = parseInt(path[22], 10);
                y2 = parseInt(path[23], 10);
                expect(x1 === 420 || x1 === 419).toBe(true);
                expect(y1 === 354 || y1 === 353).toBe(true);
                expect(x2 === 415 || x2 === 414).toBe(true);
                expect(y2 === 354 || y2 === 353).toBe(true);
                expect(y1 == y2).toBe(true);
                x1 = parseInt(path[28], 10);
                y1 = parseInt(path[29], 10);
                x2 = parseInt(path[30], 10);
                y2 = parseInt(path[31], 10);
                expect(x1 === 389 || x1 === 388).toBe(true);
                expect(y1 === 354 || y1 === 353).toBe(true);
                expect(x2 === 389 || x2 === 388).toBe(true);
                expect(y2 === 344 || y2 === 343).toBe(true);
                expect(x1 == x2).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].cornerRadius = {
                topLeft: 5, topRight: 10,
                bottomLeft: 10, bottomRight: 5
            };
            chart.series[1].cornerRadius = {
                topLeft: 5, topRight: 10,
                bottomLeft: 10, bottomRight: 5
            };
            chart.series[2].cornerRadius = {
                topLeft: 5, topRight: 10,
                bottomLeft: 10, bottomRight: 5
            };
            chart.refresh();
        });

        it('side by side placing for combination series', (done: Function) => {
            expect(chart.visibleSeries[0].position).toBe(0);
            expect(chart.visibleSeries[0].rectCount).toBe(3);
            expect(chart.visibleSeries[1].position).toBe(1);
            expect(chart.visibleSeries[1].rectCount).toBe(3);
            expect(chart.visibleSeries[2].position).toBe(2);
            expect(chart.visibleSeries[2].rectCount).toBe(3);
            loaded = (args: Object): void => {
                expect(chart.visibleSeries[1].position).toBe(0);
                expect(chart.visibleSeries[1].rectCount).toBe(2);
                expect(chart.visibleSeries[2].position).toBe(1);
                expect(chart.visibleSeries[2].rectCount).toBe(2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].columnSpacing = 0;
            chart.series[1].columnSpacing = 0;
            chart.series[2].columnSpacing = 0;
            chart.series[0].columnWidth = 0.8;
            chart.series[1].columnWidth = 0.8;
            chart.series[2].columnWidth = 0.8;
            chart.series[0].type = 'Line';
            chart.refresh();
        });
    });
    describe('Column Series - Marker', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                {type: 'Column', name: 'column series', dataSource: rotateData1, xName: 'x', yName: 'y', 
                animation: { enable: false }, marker: { visible: true }
             },
                ],
                width: '700'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Changing visibility', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('containerSymbolGroup0');
                expect(series1 == null).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh();
        });
        it('Changing size', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1.getAttribute('rx') == '5').toBe(true);
                expect(series1.getAttribute('ry') == '5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.height = 10;
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
        it('with image', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(series1.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Image';
            chartObj.series[0].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.series[0].marker.height = 20;
            chartObj.series[0].marker.width = 20;
            chartObj.refresh();
        });

        it('with marker properties', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(series1.getAttribute('fill') == 'green').toBe(true);
                expect(series1.getAttribute('opacity') == '0.1').toBe(true);
                expect(series1.getAttribute('stroke') == 'red').toBe(true);
                expect(series1.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'green';
            chartObj.series[0].marker.opacity = 0.1;
            chartObj.series[0].marker.border = {
                width: 4,
                color: 'red'
            };
            chartObj.refresh();
        });
        it('with marker and datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_0_Symbol');
                let datalabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(+(datalabel.getAttribute('y')) < +(series1.getAttribute('cy'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('with marker and datalabel color contrast', (done: Function) => {
            loaded = (args: Object): void => {
                let datalabel = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(datalabel.getAttribute('fill') === 'white').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].fill = '#404041';
            chartObj.refresh();
        });
        
    });
});

export interface series1 {
    series: Series;
}