
/**
 * Specifies the Bar series spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType } from '../../../src/chart/utils/enum';
import { LineSeries } from '../../../src/chart/series/line-series';
import { StackingBarSeries } from '../../../src/chart/series/stacking-bar-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { BarSeries } from '../../../src/chart/series/bar-series';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents } from '../base/data.spec';
import { tooltipData1, tooltipData2, datetimeData, categoryData, categoryData1, negativeDataPoint, rotateData1, rotateData2, stackedBarData } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { IAnimationCompleteEventArgs, ILoadedEventArgs, IPointRenderEventArgs } from '../../../src/chart/model/chart-interface';
Chart.Inject(LineSeries, StackingBarSeries, ColumnSeries, DateTime, Category, BarSeries, DataLabel);
let data: any = tooltipData1;
let data2: any = tooltipData2;
let dateTime: any = datetimeData;
let stackBar: any = stackedBarData;
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
    describe('Chart stackingBar series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let point1: HTMLElement;
        let point2: HTMLElement;
        let point3: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let done: Function;
        let dataLabel1: HTMLElement;
        let dataLabel2: HTMLElement;
        let dataLabel3: HTMLElement;

        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)', stackingGroup: ''
                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                        name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)', stackingGroup: ''
                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                        name: 'ChartSeriesNameRuby', fill: 'rgba(135,000,000,1)', stackingGroup: ''
                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with default points', (done: Function) => {
            loaded = (args: Object): void => {
                point1 = document.getElementById('container_Series_0_Point_0');
                expect(point1.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                point2 = document.getElementById('container_Series_1_Point_1');
                expect(point2.getAttribute('fill') == 'rgba(135,000,235,1)').toBe(true);
                point3 = document.getElementById('container_Series_2_Point_1');
                expect(point3.getAttribute('fill') == 'rgba(135,000,000,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking percentage value for points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Points = chartObj.visibleSeries[0].points[0];
                expect(point.percentage != null).toBe(true);
                expect(point.percentage).toBe(32.41);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.enableSideBySidePlacement = true;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].columnWidthInPixel = null;
            chartObj.refresh();
        });


        it('Checking with single Points', (done: Function) => {

            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Additional';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[1].dataSource = null;
            chartObj.series[1].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[2].dataSource = null;
            chartObj.series[2].dataSource = [{ x: 4, y: 30 }];
            chartObj.refresh();
        });
        it('Checking with single Points for stackingbar100 series', (done: Function) => {

            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Additional';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[1].dataSource = null;
            chartObj.series[1].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[2].dataSource = null;
            chartObj.series[2].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();
        });


        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                let zeroLabel = document.getElementById('container1_AxisLabel_3');
                let series1: Series = <Series>args.chart.series[0];

                expect(series1.points[1].regions[0].y < parseFloat(zeroLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar';
            chartObj.series[1].type = 'StackingBar';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });

        it('checking multiple series chart', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.points[2].regions[0].y == series2.points[2].regions[0].height + series2.points[2].regions[0].y).toBe(true);
                done();
            }
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)', stackingGroup: 'a'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)', stackingGroup: 'b'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,000,1)',
            }
            ];

            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking multiple series with diff orientation(horizontal) ', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 = document.getElementById('container_Series_0_Point_0');
                let point2 = document.getElementById('container_Series_1_Point_0');
                expect(point2 == null).toBe(true);
                done();
            }
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,000,1)',
            }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it(' checking with category  axis', (done: Function) => {
            loaded = (args: Object): void => {
                point1 = document.getElementById("container_Series_0_Point_1");
                let point2 = document.getElementById("container_Series_1_Point_1")
                expect(point1.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series = [{
                dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            },
            {
                dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)',
            },
            {
                dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameRuby', fill: 'rgba(135,000,000,1)',
            }],

                chartObj.refresh();
        });
        it(' checking with datetime  axis', (done: Function) => {
            loaded = (args: Object): void => {
                point1 = document.getElementById("container_Series_0_Point_1");
                let point2 = document.getElementById("container_Series_1_Point_1")
                expect(point1.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series = [{
                dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)'
            },
            {
                dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(000,206,235,1)'
            }],
                chartObj.refresh();
        });
        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                point1 = document.getElementById('container_Series_0_Point_0');
                expect(point1.getAttribute('fill') === 'red').toBe(true);
                point2 = document.getElementById('container_Series_1_Point_1');
                expect(point2.getAttribute('fill') === 'rgba(135,000,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.axes = [{
                columnIndex: 1, name: 'xAxis1', title: 'AdditionalAxis',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameGold', fill: 'red'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameSilver', fill: 'rgba(135,000,235,1)'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNamePearl', fill: 'rgba(135,000,000,1)'
            },
            {
                dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingBar',
                name: 'ChartSeriesNameRuby', fill: 'rgba(135,000,000,1)',
            }];
            chartObj.width = '800';
            chartObj.series[1].yAxisName = 'xAxis1';
            chartObj.series[2].yAxisName = 'xAxis1';
            chartObj.columns = [{ width: '400', border: { width: 4, color: 'red' } },
            { width: '400', border: { width: 4, color: 'blue' } }];
            chartObj.refresh();
        });
        it('Checking animation for stackingbar100 series', async (): Promise<void> => {
            chartObj.loaded = null;
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.series[3].animation.enable = true;
            chartObj.animationComplete = (args: series1): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') == 'translate(0,0)').toBe(true);
                //done();
            };
            chartObj.refresh();
            await wait(2000);

        });
    });
    async function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    describe('StackingBar Series with data label', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', rangePadding: 'Normal' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: negativeDataPoint, xName: 'x', yName: 'y',
                        type: 'StackingBar', fill: 'rgba(135,206,235,1)', stackingGroup: 'a',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    },
                    {
                        animation: { enable: false },
                        name: 'ChartSeriesNameSilver', dataSource: data2, xName: 'x', yName: 'y',
                        type: 'StackingBar', fill: 'green', stackingGroup: 'a',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'black' } }
                    },
                    {
                        animation: { enable: false },
                        name: 'ChartSeriesNameSilver', dataSource: data2, xName: 'x', yName: 'y',
                        type: 'StackingBar', fill: 'yellow', stackingGroup: 'b',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'black' } }
                    },
                    ],
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

        it('With negative location with auto position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x;
                expect(svg > point0Location).toBe(true);
                svg = +document.getElementById('container_Series_2_Point_6_TextShape_0').getAttribute('x');
                point0Location = (<Points>(<Series>chartObj.series[2]).points[6]).regions[0].x;
                expect(svg == (point0Location + 5)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('With negative location with auto position for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x;
                expect(svg > point0Location).toBe(true);
                svg = +document.getElementById('container_Series_2_Point_6_TextShape_0').getAttribute('x');
                point0Location = (<Points>(<Series>chartObj.series[2]).points[6]).regions[0].x;
                expect(svg == 459.01874999999995).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();

        });
        it('With Label position Top for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 < point0Location1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();

        });
        it('With Label position Top for stackingbar', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 < point0Location1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[0].type = 'StackingBar';
            chartObj.series[1].type = 'StackingBar';
            chartObj.refresh();

        });
        it('With Label position Outer for stackingbar', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 > point0Location1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();

        });
        it('With Label position Outer for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 < point0Location1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();

        });
        it('With Label position Top and alignment near for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 < point0Location1).toBe(true); done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();

        });
        it('With Label position Top and alignment near for stackingbar', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg > point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg1 < point0Location1).toBe(true); done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.series[0].type = 'StackingBar';
            chartObj.series[1].type = 'StackingBar';
            chartObj.refresh();

        });
        it('With Label position Bottom for stackingbar', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x +
                    (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].width;
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).regions[0].x;
                expect(svg1 > point0Location1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.series[2].marker.dataLabel.position = 'Bottom';

            chartObj.refresh();

        });
        it('With Label position Bottom for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x +
                    (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].width;
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).regions[0].x;
                expect(svg1 > point0Location1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.series[2].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.refresh();

        });
        it('With Label position Middle for stackingbar100', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let svgHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.series[2].marker.dataLabel.position = 'Middle';
            chartObj.refresh();

        });
        it('With Label position Middle for stackingbar', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let svgHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg < point0Location).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.series[2].marker.dataLabel.position = 'Middle';
            chartObj.series[0].type = 'StackingBar';
            chartObj.series[1].type = 'StackingBar';
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
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
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
    describe('Stacking Bar Series Inversed axis', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let dataLabelX;
        let pointX;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', isInversed: true },
                    series: [{
                        animation: { enable: false },  name: 'seriesFirst',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 }, { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },{ x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'StackingBar', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    },
                     {
                        animation: { enable: false }, name: 'seriesSecond',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 }, { x: 3000, y: 90 }, { x: 4000, y: 50 },
                        { x: 5000, y: 50 }, { x: 6000, y: 60 }, { x: 7000, y: -40 }, { x: 8000, y: -70 }], xName: 'x', yName: 'y',
                        type: 'StackingBar',   marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
            chart.refresh();

        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelX = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].x;
                expect(dataLabelX > pointX).toBe(true);
                dataLabelX = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                pointX = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].x;
                expect(dataLabelX < pointX).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
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
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
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
            chart.refresh();

        });

        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelX: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('width');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelX + labelHeight / 2).toEqual(point.regions[0].x + point.regions[0].width / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });
    });
    describe('checking rotated stacking bar chart', () => {
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
                {type: 'StackingBar', name: 'barSeries1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false }},
                {type: 'StackingBar', name: 'barSeries2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false }}
                ],
                title: 'rotated StackingBar Chart',
                width: '700'
            });
            chart.appendTo('#container');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking without rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('checking with rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryYAxis;
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
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
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
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
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
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
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
                expect(+(dataLabel.getAttribute('y')) > (point.symbolLocations[0].y + point.regions[0].height / 2)).toBe(true);
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
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y + point.regions[0].height).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y - point.regions[0].height).toBe(true);
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
                expect(parseFloat(tooltip.style.top) < series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));


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
                expect(parseFloat(tooltip.style.top) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
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
    describe('StackingBar and StackingBar100 Series in Cyliderical shape', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', maximum: 100, interval: 10, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                    series: [
                        {
                            animation: { enable: false }, name: 'Gold',
                            dataSource: stackBar,
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingBar', fill: 'skyblue'
                        },
                        {
                            animation: { enable: false }, name: 'Silver',
                            dataSource: stackBar,
                            xName: 'x', yName: 'y1', columnFacet: 'Cylinder',
                            type: 'StackingBar', fill: 'orange'
                        },
                        {
                            animation: { enable: false }, name: 'Bronze',
                            dataSource: stackBar,
                            xName: 'x', yName: 'y2', columnFacet: 'Cylinder',
                            type: 'StackingBar', fill: 'pink'
                        }
                    ],
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('StackingBar Series type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_1_Point_2_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_1_Point_2_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_1_Point_2_Region_2').getAttribute('d');
                expect(region1 === 'M57.03244318181818,235.42386363636365a2.527556818181818,10.110227272727272 0 1,0 0,20.220454545454544a2.527556818181818,10.110227272727272 0 1,0 0,-20.220454545454544').toBe(true);
                expect(region2 === 'M138.9274431818182,235.42386363636365a2.527556818181818,10.110227272727272 0 1,0 0,20.220454545454544a2.527556818181818,10.110227272727272 0 1,0 0,-20.220454545454544').toBe(true);
                expect(region3 === 'M57.03244318181818,235.42386363636365a2.527556818181818,10.110227272727272 0 1,0 0,20.220454545454544l81.89500000000001 0a2.527556818181818,10.110227272727272 0 1,1 0,-20.220454545454544 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('StackingBar100 Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_0_Point_3_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_0_Point_3_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_0_Point_3_Region_2').getAttribute('d');
                expect(region1 === 'M2.5275568181818215,206.53749999999997a2.5275568181818215,10.110227272727286 0 1,0 0,20.220454545454572a2.5275568181818215,10.110227272727286 0 1,0 0,-20.220454545454572').toBe(true);
                expect(region2 === 'M263.1025568181818,206.53749999999997a2.5275568181818215,10.110227272727286 0 1,0 0,20.220454545454572a2.5275568181818215,10.110227272727286 0 1,0 0,-20.220454545454572').toBe(true);
                expect(region3 === 'M2.5275568181818215,206.53749999999997a2.5275568181818215,10.110227272727286 0 1,0 0,20.220454545454572l260.575 0a2.5275568181818215,10.110227272727286 0 1,1 0,-20.220454545454572 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.series[2].type = 'StackingBar100';
            chartObj.refresh();
        });

        it('Checking animation for stackingbar series in Cylindrical chart', async (): Promise<void> => {
            animate = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_4_Region_2');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                //done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);
        });

        it('Checking animation for stackingbar100 series in Cylindrical chart', async (): Promise<void> => {
            animate = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_4_Region_2');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                //done();
            };
            chartObj.series[0].type = 'StackingBar100';
            chartObj.series[1].type = 'StackingBar100';
            chartObj.series[2].type = 'StackingBar100';
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);
        });

    });

    describe('Checking Cylindrical chart in Canvas Mode.', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'CanvasContainer' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                primaryYAxis: { title: 'Medal Count', maximum: 100, interval: 10, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                series: [
                    {
                        animation: { enable: false }, name: 'Gold',
                        dataSource: stackBar,
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingBar', fill: 'skyblue'
                    },
                    {
                        animation: { enable: false }, name: 'Bronze',
                        dataSource: stackBar,
                        xName: 'x', yName: 'y2', columnFacet: 'Cylinder',
                        type: 'StackingBar', fill: 'pink'
                    }
                ],
                width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                title: 'Olympic Medal Counts - RIO', loaded: loaded
            });
            chart.appendTo('#CanvasContainer');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('Checking Cylindrical chart render in canvas mode to stackingbar series', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementsByTagName('canvas')[0].id).toEqual('CanvasContainer_canvas');
                done();
            };
            chart.enableCanvas = true;
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Checking Cylindrical chart render in canvas mode to stackingbar100 series', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementsByTagName('canvas')[0].id).toEqual('CanvasContainer_canvas');
                done();
            };
            chart.enableCanvas = true;
            chart.series[0].type = 'StackingBar100';
            chart.series[1].type = 'StackingBar100';
            chart.loaded = loaded;
            chart.refresh();
        });
    });

    describe('StackingBar - checking animation on data changes.', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'StackingBarcontainer' });
        let dataSource = [
            { x: 'GBR', y: 17 }, { x: 'CHN', y: 16, }, { x: 'AUS', y: 8 },
            { x: 'RUS', y: 14 }, { x: 'GER', y: 17 }, { x: 'UA', y: 2 }, { x: 'ES', y: 7 },
            { x: 'UZB', y: 4 }, { x: 'JPN', y: 12 }, { x: 'NL', y: 8 }, { x: 'USA', y: 26 }
        ];
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', maximum: 100, interval: 10, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                    series: [
                        {
                            animation: { enable: false }, name: 'Gold',
                            dataSource: dataSource,
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingBar', fill: 'skyblue',
                            marker: { visible: true, dataLabel: { visible: true } }
                        }
                    ],
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#StackingBarcontainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Stacking bar - Checking setData method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement = document.getElementById('StackingBarcontainer_Series_0_Point_1');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource = [
                { x: 'GBR', y: 17 }, { x: 'CHN', y: 16, }, { x: 'AUS', y: 8 },
                { x: 'RUS', y: 16 }, { x: 'GER', y: 17 }, { x: 'UA', y: 9 }, { x: 'ES', y: 7 },
                { x: 'UZB', y: 4 }, { x: 'JPN', y: 12 }, { x: 'NL', y: 8 }, { x: 'USA', y: 26 }
            ];
            chartObj.series[0].setData(dataSource);
            chartObj.refresh();
        });
    });
    describe('Staking Bar - Checking legend click animation.', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let path: string[];
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            elem = createElement('div', { id: 'Stackingbarcontainer' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                series: [
                    {
                        dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                        { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                        xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                        type: 'StackingBar', animation: { enable: false },
                        marker: { visible: true, dataLabel: { visible: true } },
                        name:'Column1'
                    },
                    {
                        dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                        { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                        xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                        type: 'StackingBar', animation: { enable: false },
                        marker: { visible: true, dataLabel: { visible: true } },
                        name:'Column2'
                    }
                ],
                legendSettings: { visible: true },
            });
            chartObj.appendTo('#Stackingbarcontainer');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Stacking Bar - legend click animation', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('Stackingbarcontainer_chart_legend_text_0');
                trigger.clickEvent(legendElement);
                expect(legendElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Stacking bar - with transposed true and column width in pixel', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('Stackingbarcontainer_chart_legend_text_0');
                trigger.clickEvent(legendElement);
                expect(legendElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].columnWidthInPixel = 15;
            chartObj.isTransposed = true;
            chartObj.refresh();
        });
        it('Checking StackLabels', (done: Function) => {
            loaded = (args: Object): void => {
                const stackLabel: HTMLElement = document.getElementById('Stackingbarcontainer_StackLabel_3');
                const stackLabelRect: HTMLElement = document.getElementById('StackingbarcontainerStackLabel_TextShape_1');
                expect(stackLabel !== null).toBe(true);
                expect(stackLabel.innerHTML).toBe('50');
                expect(stackLabel.getAttribute('x') === '470' || stackLabel.getAttribute('x') === '432.4' || stackLabel.getAttribute('x') === '447.2'  || stackLabel.getAttribute('x') === '458').toBe(true);
                expect(stackLabel.getAttribute('y')).toBe('28.80769230769229');
                expect(stackLabel.getAttribute('transform') === 'rotate(0, 470, 28.80769230769229)' || stackLabel.getAttribute('transform') === 'rotate(0, 432.4, 106.32142857142857)'
                || stackLabel.getAttribute('transform') === 'rotate(0, 447.2, 28.80769230769229)' || stackLabel.getAttribute('transform') === 'rotate(0, 458, 28.80769230769229)').toBe(true);
                expect(stackLabelRect !== null).toBe(true);
                expect(stackLabelRect.getAttribute('x') === '170' || stackLabelRect.getAttribute('x') === '154.8' || stackLabelRect.getAttribute('x') === '162.4' || stackLabelRect.getAttribute('x') === '166').toBe(true);
                expect(stackLabelRect.getAttribute('y') === '80.2019230769231' || stackLabelRect.getAttribute('y') === '219.91071428571425').toBe(true);
                expect(stackLabelRect.getAttribute('transform') === 'rotate(0, 181, 100.2019230769231)' || stackLabelRect.getAttribute('transform') === 'rotate(0, 165.8, 238.91071428571425)'
                || stackLabelRect.getAttribute('transform') === 'rotate(0, 173.4, 100.2019230769231)' || stackLabelRect.getAttribute('transform') === 'rotate(0, 177, 100.2019230769231)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: -30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                    type: 'StackingBar', animation: { enable: false },
                    marker: { visible: true, dataLabel: { visible: true } },
                    name: 'Column1'
                },
                {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: -30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                    type: 'StackingBar', animation: { enable: false },
                    marker: { visible: true, dataLabel: { visible: true } },
                    name: 'Column2'
                }
            ];
            chartObj.primaryYAxis.isInversed = false;
            chartObj.stackLabels.visible = true;
            chartObj.stackLabels.border = { width: 1, color: 'black' };
            chartObj.refresh();
        });
        it('Checking StackLabels with inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                const stackLabel: HTMLElement = document.getElementById('Stackingbarcontainer_StackLabel_3');
                const stackLabelRect: HTMLElement = document.getElementById('StackingbarcontainerStackLabel_TextShape_1');
                expect(stackLabel !== null).toBe(true);
                expect(stackLabel.innerHTML).toBe('50S');
                expect(stackLabel.getAttribute('x') == '88.34615384615381' || stackLabel.getAttribute('x') == '85.42307692307688' || stackLabel.getAttribute('x') == '86.80769230769226').toBe(true);
                expect(stackLabel.getAttribute('y')).toBe('169.9375');
                expect(stackLabel.getAttribute('transform') == 'rotate(0, 88.34615384615381, 169.9375)' || stackLabel.getAttribute('transform') == 'rotate(0, 85.42307692307688, 169.9375)'
                || stackLabel.getAttribute('transform') == 'rotate(0, 86.80769230769226, 169.9375)').toBe(true);
                expect(stackLabelRect !== null).toBe(true);
                expect(stackLabelRect.getAttribute('x') == '214.71153846153848' || stackLabelRect.getAttribute('x') == '204.48076923076925' || stackLabelRect.getAttribute('x') == '209.3269230769231').toBe(true);
                expect(stackLabelRect.getAttribute('y')).toBe('273.6875');
                expect(stackLabelRect.getAttribute('transform') == 'rotate(0, 229.21153846153848, 293.6875)' || stackLabelRect.getAttribute('transform') == 'rotate(0, 218.98076923076925, 293.6875)'
                || stackLabelRect.getAttribute('transform') == 'rotate(0, 223.8269230769231, 293.6875)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.stackLabels.font.textAlignment = 'Far'
            chartObj.stackLabels.visible = true;
            chartObj.isTransposed = false;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.stackLabels.format = '{value}S';
            chartObj.refresh();
        });
        
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


export interface series1 {
    series: Series;
}