
/**
 * Specifies the logarithmic spec.
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { MultiLevelLabel } from '../../../src/chart/axis/multi-level-labels';
import { Legend } from '../../../src/chart/legend/legend';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { seriesData1, datetimeData, categoryData } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { categoryData1 } from '../polar-radar/polar-radar-series.spec';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { IMultiLevelLabelClickEventArgs } from '../../../src';
import { MouseEvents } from '../base/events.spec';
import { Browser } from '@syncfusion/ej2-base';
Chart.Inject(LineSeries, Logarithmic, ColumnSeries, AreaSeries, BarSeries, DateTime, Category, Legend, MultiLevelLabel);
let data: any = seriesData1;
let datetime: any = datetimeData;
export interface Arg {
    chart: Chart;
}
let chartData1: any[] = [
    { x: 1000, y: 0 },
    { x: 2000, y: 10 },
    { x: 3000, y: 30 },
    { x: 4000, y: 50 },
    { x: 5000, y: 60 },
    { x: 6000, y: 20 },
    { x: 7000, y: 5 },
    { x: 8000, y: 15 }
];
describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Chart Multiple labels - category axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                        valueType: 'Category',
                        multiLevelLabels: [
                            {
                                categories: [{
                                    text: 'Quater 1', start: -0.5, end: 2.5
                                },
                                {
                                    text: 'Quater 2', start: 2.5, end: 5.5
                                },
                                {
                                    text: 'Quater 3', start: 5.5, end: 7.5
                                }]
                            }
                        ]
                    },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [{
                        dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green',
                    }], legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking multilevel labels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking multilevel labels with onTicks', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '296.8571428571429' || svg.getAttribute('x') === '154.2857142857143').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking multilevel labels with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '618.53125' || svg.getAttribute('x') === '817.59375' ||
                    svg.getAttribute('x') === '1015.84375' || svg.getAttribute('x') === '626.71875').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' || svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryXAxis.border.width = 1;
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });
        it('Checking multilevel labels with transposed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '63.5' || svg.getAttribute('x') === '62.5' ||
                    svg.getAttribute('x') === '63.5' || svg.getAttribute('x') === '58.5').toBe(true);
                expect(svg.getAttribute('y') === '322.390625' || svg.getAttribute('y') === '323.203125' ||
                    svg.getAttribute('y') === '321.828125' || svg.getAttribute('y') === '325.390625').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.isTransposed = true;
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '377.5' || svg.getAttribute('y') === '378.5' ||
                    svg.getAttribute('y') === '376' || svg.getAttribute('y') === '382').toBe(true);
                let level_2_Elements: HTMLElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_1_Text_0');
                expect(parseFloat(level_2_Elements.getAttribute('y')) > parseFloat(svg.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.primaryXAxis.border.width = 0;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.multiLevelLabels = [
                {
                    categories: [{
                        text: 'Quater 1', start: -0.5, end: 2.5
                    },
                    {
                        text: 'Quater 2', start: 2.5, end: 5.5
                    },
                    {
                        text: 'Quater 3', start: 5.5, end: 7.5
                    }],
                }, {
                    categories: [
                        {
                            text: '2010', start: -0.5, end: 5.5,
                        },
                        {
                            text: '2011', start: 5.5, end: 7.5,
                        }]
                }
            ];
            chartObj.refresh();
        });
        it('Checking multilevel labels with title and legend', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '343.5' || svg.getAttribute('y') === '343.5' ||
                    svg.getAttribute('y') === '341' || svg.getAttribute('y') === '349').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.title = 'Multi Level Labels';
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking multilevel labels with border color', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg.getAttribute('stroke') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].border.color = 'red';
            chartObj.primaryXAxis.multiLevelLabels[1].border.color = 'blue';
            chartObj.refresh();
        });
        it('Checking multilevel labels with label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '343.5' || svg.getAttribute('y') === '343.5' ||
                    svg.getAttribute('y') === '341' || svg.getAttribute('y') === '349').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 90;
            chartObj.refresh();
        });
        it('Checking multilevel labels with label rotation and label positioon inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '185.78125' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '313.59375' || svg.getAttribute('y') === '336.703125' ||
                    svg.getAttribute('y') === '335.4333190917969' || svg.getAttribute('y') === '321.359375' ||
                    svg.getAttribute('y') === '321.34375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Checking multilevel labels opposedPosition', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '185.78125' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '145.65625' || svg.getAttribute('y') === '135.890625' ||
                    svg.getAttribute('y') === '123.81668090820312' || svg.getAttribute('y') === '114.390625' ||
                    svg.getAttribute('y') === '136.90625').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('Checking multilevel labels opposedPosition and label outside position', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '185.78125' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '115.75' || svg.getAttribute('y') === '114.75' ||
                    svg.getAttribute('y') === '118.25' || svg.getAttribute('y') === '109.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.labelPosition = 'Outside';
            chartObj.refresh();
        });
        it('Checking multilevel labels with text alignment far and maximumTextWidth', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '310.9375' || svg.getAttribute('x') === '402.8125' ||
                    svg.getAttribute('x') === '494.3125' || svg.getAttribute('x') === '312.5625').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels = [
                {
                    categories: [
                        {
                            text: 'Quater 1', start: -0.5, end: 2.5,
                        },
                        {
                            text: 'Quater 2', start: 2.5, end: 5.5,
                        },
                        {
                            text: 'Quater 3', start: 5.5, end: 7.5, maximumTextWidth: 30,
                        }],
                    alignment: 'Far'
                }
            ];
            chartObj.refresh();
        });
        it('Checking multilevel labels with text alignment far and maximumTextWidth', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '310.9375' || svg.getAttribute('x') === '402.8125' ||
                    svg.getAttribute('x') === '494.3125' || svg.getAttribute('x') === '312.5625').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].overflow = 'Trim';
            chartObj.refresh();
        });
        it('Checking multilevel labels with text alignment near', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '63' || svg.getAttribute('x') === '62' ||
                    svg.getAttribute('x') === '63' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Near';
            chartObj.primaryXAxis.multiLevelLabels[0].overflow = 'Wrap';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type brace', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '185.78125' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels = [
                {
                    categories: [{
                        text: 'Quater 1', start: -0.5, end: 2.5,
                    },
                    {
                        text: 'Quater 2', start: 2.5, end: 5.5,
                    },
                    {
                        text: 'Quater 3', start: 5.5, end: 8.5,
                    }],
                    border: { type: 'Brace' }
                }
            ];
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type brace with alignment far', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '312.5625' || svg.getAttribute('x') === '402.8125' ||
                    svg.getAttribute('x') === '494.3125' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '312.5625').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type brace with alignment near', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '63' || svg.getAttribute('x') === '59' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Near';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type brace with opposedposition false', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
               
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '371.5' || svg.getAttribute('y') === '371.5' ||
                    svg.getAttribute('y') === '370' || svg.getAttribute('y') === '376').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Center';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type withoutborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.multiLevelLabels[0].border.type = 'WithoutBorder';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type withoutTopandBottomBorder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].border.type = 'WithoutTopandBottomBorder';
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type withoutTopBorder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '82.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].border.type = 'WithoutTopBorder';
            chartObj.width = null;
            chartObj.refresh();
        });
        it('Checking multilevel labels with border type withoutTopBorder with opposedposition false', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '371.5' || svg.getAttribute('y') === '371.5' ||
                    svg.getAttribute('y') === '370' || svg.getAttribute('y') === '376').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.primaryXAxis.multiLevelLabels[0].border.type = 'WithoutTopBorder';
            chartObj.width = null;
            chartObj.refresh();
        });
        it('Checking primary axis labels with border type withoutBorder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.border.type = 'WithoutBorder';
            chartObj.refresh();
        });
        it('Checking primary axis labels with border type withouttopandbottomborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.border.type = 'WithoutTopandBottomBorder';
            chartObj.primaryXAxis.border.width = 1;
            chartObj.refresh();
        });
        it('Checking primary axis labels with border type withouttopborder and label position inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.border.type = 'WithoutTopBorder';
            chartObj.refresh();
        });
        it('Checking primary axis labels with border type rectangle and label position inside and opposedposition', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
        it('Checking primary axis labels with border type rectangle and label position outside and opposedposition', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPosition = 'Outside';
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
        it('Checking border type curlybrace with alignment center', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '82.75' || svg.getAttribute('y') === '81.75' ||
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '77.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].border.type = 'CurlyBrace';
            chartObj.refresh();
        });
        it('Checking border type curlybrace with alignment far', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '310.9375' || svg.getAttribute('x') === '402.8125' ||
                    svg.getAttribute('x') === '494.3125' || svg.getAttribute('x') === '312.5625').toBe(true);
                expect(svg.getAttribute('y') === '82.75' || svg.getAttribute('y') === '81.75' ||
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '77.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking border type curlybrace with alignment near', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '63' || svg.getAttribute('x') === '62' ||
                    svg.getAttribute('x') === '63' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '82.75' || svg.getAttribute('y') === '81.75' ||
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '77.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = 'Near';
            chartObj.refresh();
        });
        it('Checking border type curlybrace with opposedPosition false', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '63' || svg.getAttribute('x') === '62' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '371.5' || svg.getAttribute('y') === '371.5' ||
                    svg.getAttribute('y') === '370' || svg.getAttribute('y') === '376').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.refresh();
        });
        it('Checking multilevel labels with onTicks and far', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '1707.7142857142856'|| svg.getAttribute('x') === '425.1428571428572').toBe(true);
                expect(svg.getAttribute('y') === '425.1428571428572' || svg.getAttribute('y') === '376' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.primaryXAxis.multiLevelLabels[0].alignment = "Far";
            chartObj.appendTo('#container');
            chartObj.refresh();
        });
    });

    describe('Chart Multiple labels click - Category axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let labelElement: Element;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        let multilevellabelclick: EmitType<IMultiLevelLabelClickEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        border: { width: 0, type: 'Rectangle' },
                        isIndexed: true, interval: 1, majorGridLines: { width: 0 },
                        multiLevelLabels : (Browser.isDevice ? ([
                            {
                                border: { type: 'Rectangle', width: 10 },
                                categories: [
                                    { start: -0.5, end: 2.5, text: 'In Season' },
                                    { start: 2.5, end: 5.5, text: 'Out of Season' },
                                    { start: 5.5, end: 7.5, text: 'In Season' },
                                    { start: 7.5, end: 9.5, text: 'Out of Season' },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: -0.5, end: 5.5, text: 'Fruits', },
                                    { start: 5.5, end: 9.5, text: 'Vegetables', },
                                ]
                            }]) : [
                                {
                                    border: { type: 'Rectangle' },
                                    categories: [
                                        { start: -0.5, end: 0.5, text: 'Seedless', customAttributes: { load: 'sesson1', pass: 'through1'} },
                                        { start: 0.5, end: 2.5, text: 'Seeded', customAttributes: { load: 'sesson2', pass: 'through2'}},
                                        { start: 2.5, end: 3.5, text: 'Seedless', customAttributes: { load: 'sesson3', pass: 'through3'} },
                                        { start: 3.5, end: 5.5, text: 'Seeded', customAttributes: { load: 'sesson4', pass: 'through4'}},
                                        { start: 5.5, end: 6.5, text: 'Seedless', customAttributes: { load: 'sesson5', pass: 'through5'}},
                                        { start: 6.5, end: 7.5, text: 'Seeded', customAttributes: { load: 'sesson6', pass: 'through6'}},
                                        { start: 7.5, end: 8.5, text: 'Seedless', customAttributes: { load: 'sesson7', pass: 'through7'}},
                                        { start: 8.5, end: 9.5, text: 'Seeded', customAttributes: { load: 'sesson8', pass: 'through8'}}
                                    ]
                                }, {
                                    border: { type: 'Rectangle' },
                                    categories: [
                                        { start: -0.5, end: 2.5, text: 'In Season', customAttributes: { load: 'In Season1', pass: 'through'}  },
                                        { start: 2.5, end: 5.5, text: 'Out of Season', customAttributes: { load: 'Out of Season2', pass: 'through'} },
                                        { start: 5.5, end: 7.5, text: 'In Season', customAttributes: { load: 'sesson3', pass: 'through'} },
                                        { start: 7.5, end: 9.5, text: 'Out of Season', customAttributes: { load: 'sesson4', pass: 'through'} },
                                    ]
                                }, {
                                    border: { type: 'Rectangle' },
                                    textStyle: { fontWeight: 'Bold' },
                                    categories: [
                                        { start: -0.5, end: 5.5, text: 'Fruits', customAttributes: { startDate: new Date(2005, 0, 1) , endDate: new Date(2006, 0, 1)} },
                                        { start: 5.5, end: 9.5, text: 'Vegetables', customAttributes: { load: 'sesson2', pass: 'through'}},
                                    ]
                                }])
                    },
                    chartArea: {
                        border: { width: 0 }
                    },
                    //Initializing Primary Y Axis
                    primaryYAxis:
                        {
                            minimum: 0, maximum: 120, interval: 30,
                            majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' },
                            multiLevelLabels: ( Browser.isDevice ? ([{
                                border: { type: 'Rectangle' },
                                categories: [{ start: 0, end: 30, text: 'Half Yearly 1', maximumTextWidth: 50 },
                                { start: 30, end: 60, text: 'Half Yearly 2', maximumTextWidth: 50 },
                                { start: 60, end: 90, text: 'Half Yearly 3', maximumTextWidth: 50 },
                                { start: 90, end: 120, text: 'Half Yearly 4', maximumTextWidth: 50 }],
                            }]) : [
                                {
                                border: { type: 'Rectangle' },
                                    categories: [
                                        { start: 0, end: 20, text: 'Seedless', customAttributes: { load: 'ysesson1', pass: 'through'} },
                                        { start: 20, end: 40, text: 'Seeded', customAttributes: { load: 'ysesson2', pass: 'through'}},
                                        { start: 40, end: 60, text: 'Seedless', customAttributes: { load: 'ysesson3', pass: 'through'} },
                                        { start: 60, end: 80, text: 'Seeded', customAttributes: { load: 'ysesson4', pass: 'through'} },
                                        { start: 80, end: 100, text: 'Seedless', customAttributes: { load: 'ysesson5', pass: 'through'} },
                                        { start: 100, end: 120, text: 'Seeded', customAttributes: { load: 'ysesson6', pass: 'through'} },
                                    ]
                                },
                                {
                                    border: { type: 'Rectangle' },
                                    categories: [{ start: 0, end: 30, text: 'Half Yearly 1', maximumTextWidth: 50,
                                    customAttributes: { load: 'Half Yearly 1', pass: 'through1'} },
                                    { start: 30, end: 60, text: 'Half Yearly 2', maximumTextWidth: 50,
                                    customAttributes: { load: 'Half Yearly 2', pass: 'through2'} },
                                    { start: 60, end: 90, text: 'Half Yearly 3', maximumTextWidth: 50,
                                    customAttributes: { load: 'Half Yearly 3', pass: 'through3'} },
                                    { start: 90, end: 120, text: 'Half Yearly 4', maximumTextWidth: 50,
                                    customAttributes: { load: 'Half Yearly 4', pass: 'through4'} }],
                                }
                            ])
                        },
                    // Initializing Chart Series data: { vg: 'Half Yearly 1', ggj: []}
                    series: [
                        {
                            type: 'Column', xName: 'x', yName: 'y',
                            dataSource: [
                                { x: 'Grapes', y: 28 }, { x: 'Apples', y: 87 },
                                { x: 'Pears', y: 42 }, { x: 'Grapes', y: 13 },
                                { x: 'Apples', y: 13 }, { x: 'Pears', y: 10 },
                                { x: 'Tomato', y: 31 }, { x: 'Potato', y: 96 },
                                { x: 'Cucumber', y: 41 }, { x: 'Onion', y: 59 }],
                            marker: {
                                dataLabel: {
                                    visible: true, position: 'Outer'
                                }
                            }
                        },
                    ],
                    // Initializing Chart title
                    title: 'Fruits and Vegetables - Season',
                });
                chartObj.appendTo('#container');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking the multi level labels after click event in x axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('Seedless');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('sesson1');
                expect((Object as any).values(object)[1]).toBe('through1');

            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event in y axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container1_Axis_MultiLevelLabel_Level_1_Text_2');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('HalfYearly 3');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('Half Yearly 3');
                expect((Object as any).values(object)[1]).toBe('through3');
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event, date access in custom objects', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_2_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('Fruits');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                let startDate: Date = new Date((Object as any).values(object)[0]);
                let endDate: Date = new Date((Object as any).values(object)[1]);
                expect(startDate.getFullYear()).toBe(2005);
                expect(endDate.getFullYear()).toBe(2006);
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
    });
    describe('Chart Multi Level labels click event - DateTime axis and Logarithmic axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let labelElement: Element;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        let multilevellabelclick: EmitType<IMultiLevelLabelClickEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'DateTime',
                        border: { width: 0, type: 'Rectangle' },
                        isIndexed: true, interval: 2, majorGridLines: { width: 0 },
                        multiLevelLabels: (Browser.isDevice ? ([
                            {
                                border: { type: 'Rectangle', width: 10 },
                                categories: [
                                    { start: new Date(1994, 6, 11), end: new Date(1999, 3, 6), text: 'In Season', },
                                    { start: new Date(1999, 3, 6), end: new Date(2005, 3, 12), text: 'Out of Season', },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: new Date(1994, 6, 11), end: new Date(1999, 3, 6), text: 'Fruits', },
                                    { start: new Date(1999, 3, 6), end: new Date(2005, 3, 12), text: 'Vegetables', },
                                ]
                            }
                        ]) : [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: new Date(1994, 6, 11), end: new Date(1999, 3, 6),
                                         text: 'In Season', customAttributes: { load: 'In Season1', pass: 'through' } },
                                    { start: new Date(1999, 3, 6), end: new Date(2005, 3, 12),
                                         text: 'Out of Season', customAttributes: { load: 'Out of Season2', pass: 'through' } },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: new Date(1994, 6, 11), end: new Date(1999, 3, 6), text: 'Fruits', customAttributes: { startDate: new Date(2005, 0, 1) , endDate: new Date(2006, 0, 1)} },
                                    { start: new Date(1999, 3, 6), end: new Date(2005, 3, 12), text: 'Vegetables', customAttributes: { load: 'sesson2', pass: 'through' } },
                                ]
                            }
                        ])
                    },
                    chartArea: {
                        border: { width: 0 }
                    },
                    primaryYAxis: {
                        valueType: 'Logarithmic',
                        minimum: 0, maximum: 12000, interval: 1000,
                        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' },
                        multiLevelLabels: (Browser.isDevice ? ([{
                                border: { type: 'Rectangle' },
                                categories: [{ start: 0, end: 1.25, text: 'Half Yearly 1', maximumTextWidth: 50 },
                                    { start: 1.25, end: 2.5, text: 'Half Yearly 2', maximumTextWidth: 50 },
                                    { start: 2.5, end: 3.75, text: 'Half Yearly 3', maximumTextWidth: 50 },
                                    { start: 3.75, end: 5, text: 'Half Yearly 4', maximumTextWidth: 50 }],
                            }]) : [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: 0, end: 1, text: 'Seedless', customAttributes: { load: 'ysesson1', pass: 'through' } },
                                    { start: 1, end: 2, text: 'Seeded', customAttributes: { load: 'ysesson2', pass: 'through' } },
                                    { start: 2, end: 3, text: 'Seedless', customAttributes: { load: 'ysesson3', pass: 'through' } },
                                    { start: 3, end: 4, text: 'Seeded', customAttributes: { load: 'ysesson4', pass: 'through' } },
                                    { start: 4, end: 5, text: 'Seedless', customAttributes: { load: 'ysesson5', pass: 'through' } },
                                ]
                            },
                            {
                                border: { type: 'Rectangle' },
                                categories: [{ start: 0, end: 1.25, text: 'Half Yearly 1', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 1', pass: 'through' } },
                                    { start: 1.25, end: 2.5, text: 'Half Yearly 2', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 2', pass: 'through' } },
                                    { start: 2.5, end: 3.75, text: 'Half Yearly 3', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 3', pass: 'through' } },
                                    { start: 3.75, end: 5, text: 'Half Yearly 4', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 4', pass: 'through' } }],
                            }
                        ])
                    },
                    series: [
                        {
                            type: 'Column', xName: 'x', yName: 'y',
                            dataSource: [{ x: new Date(1995, 0, 1), y: 80 }, { x: new Date(1996, 0, 1), y: 200 },
                                { x: new Date(1997, 0, 1), y: 400 }, { x: new Date(1998, 0, 1), y: 600 },
                                { x: new Date(1999, 0, 1), y: 700 }, { x: new Date(2000, 0, 1), y: 1400 },
                                { x: new Date(2001, 0, 1), y: 2000 }, { x: new Date(2002, 0, 1), y: 4000 },
                                { x: new Date(2003, 0, 1), y: 6000 }, { x: new Date(2004, 0, 1), y: 8000 },
                                { x: new Date(2005, 0, 1), y: 11000 }],
                            marker: {
                                dataLabel: {
                                    visible: true, position: 'Outer'
                                }
                            }
                        },
                    ],
                    title: 'Fruits and Vegetables - Season',
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking the multi level labels after click event in x axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('In Season');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('In Season1');
                expect((Object as any).values(object)[1]).toBe('through');

            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event in y axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container1_Axis_MultiLevelLabel_Level_1_Text_2');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('HalfYearly 3');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('Half Yearly 3');
                expect((Object as any).values(object)[1]).toBe('through');
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event, date access in custom objects', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_1_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('Fruits');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                let startDate: Date = new Date((Object as any).values(object)[0]);
                let endDate: Date = new Date((Object as any).values(object)[1]);
                expect(startDate.getFullYear()).toBe(2005);
                expect(endDate.getFullYear()).toBe(2006);
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
    });
    describe('Chart Multi Level labels click event - Double', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let labelElement: Element;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        let multilevellabelclick: EmitType<IMultiLevelLabelClickEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Double',
                        border: { width: 0, type: 'Rectangle' },
                        isIndexed: true, interval: 1, majorGridLines: { width: 0 },
                        multiLevelLabels: (Browser.isDevice ? ([
                            {
                                border: { type: 'Rectangle', width: 10 },
                                categories: [
                                    { start: 0.5, end: 3.5, text: 'In Season', },
                                    { start: 3.5, end: 5.5, text: 'Out of Season', },
                                    { start: 5.5, end: 7.5, text: 'In Season', },
                                    { start: 7.5, end: 10, text: 'Out of Season', },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: 0.5, end: 5, text: 'Fruits', },
                                    { start: 5, end: 10, text: 'Vegetables', },
                                ]
                            }
                        ]) : [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: 0.5, end: 2.5, text: 'Seedless', customAttributes: { load: 'sesson1', pass: 'through' } },
                                    { start: 2.5, end: 4.5, text: 'Seeded', customAttributes: { load: 'sesson2', pass: 'through' } },
                                    { start: 4.5, end: 6.5, text: 'Seedless', customAttributes: { load: 'sesson3', pass: 'through' } },
                                    { start: 6.5, end: 8.5, text: 'Seeded', customAttributes: { load: 'sesson4', pass: 'through' } },
                                    { start: 8.5, end: 10, text: 'Seedless', customAttributes: { load: 'sesson5', pass: 'through' } },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: 0.5, end: 3.5, text: 'In Season', customAttributes: { load: 'In Season1', pass: 'through' } },
                                    { start: 3.5, end: 5.5, text: 'Out of Season', customAttributes: { load: 'Out of Season2', pass: 'through' } },
                                    { start: 5.5, end: 7.5, text: 'In Season', customAttributes: { load: 'sesson3', pass: 'through' } },
                                    { start: 7.5, end: 10, text: 'Out of Season', customAttributes: { load: 'sesson4', pass: 'through' } },
                                ]
                            }, {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: 0.5, end: 5, text: 'Fruits', customAttributes: { startDate: new Date(2005, 0, 1) , endDate: new Date(2006, 0, 1)} },
                                    { start: 5, end: 10, text: 'Vegetables', customAttributes: { load: 'sesson2', pass: 'through' } },
                                ]
                            }
                        ])
                    },
                    chartArea: {
                        border: { width: 0 }
                    },
                    primaryYAxis: {
                        valueType: 'Double',
                        minimum: 0, maximum: 120, interval: 10,
                        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' },
                        multiLevelLabels: (Browser.isDevice ? ([{
                                border: { type: 'Rectangle' },
                                categories: [{ start: 0, end: 25, text: 'Half Yearly 1', maximumTextWidth: 50 },
                                    { start: 25, end: 50, text: 'Half Yearly 2', maximumTextWidth: 50 },
                                    { start: 50, end: 75, text: 'Half Yearly 3', maximumTextWidth: 50 },
                                    { start: 75, end: 100, text: 'Half Yearly 4', maximumTextWidth: 50 },
                                    { start: 100, end: 120, text: 'Half Yearly 5', maximumTextWidth: 50 }],
                            }]) : [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: 0, end: 25, text: 'Seedless', customAttributes: { load: 'ysesson1', pass: 'through' } },
                                    { start: 25, end: 50, text: 'Seeded', customAttributes: { load: 'ysesson2', pass: 'through' } },
                                    { start: 50, end: 75, text: 'Seedless', customAttributes: { load: 'ysesson3', pass: 'through' } },
                                    { start: 75, end: 100, text: 'Seeded', customAttributes: { load: 'ysesson4', pass: 'through' } },
                                    { start: 100, end: 120, text: 'Seedless', customAttributes: { load: 'ysesson5', pass: 'through' } },
                                ]
                            },
                            {
                                border: { type: 'Rectangle' },
                                categories: [{ start: 0, end: 25, text: 'Half Yearly 1', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 1', pass: 'through' } },
                                    { start: 25, end: 50, text: 'Half Yearly 2', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 2', pass: 'through' } },
                                    { start: 50, end: 75, text: 'Half Yearly 3', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 3', pass: 'through' } },
                                    { start: 75, end: 100, text: 'Half Yearly 4', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 4', pass: 'through' } },
                                    { start: 100, end: 120, text: 'Half Yearly 5', maximumTextWidth: 50,
                                        customAttributes: { load: 'Half Yearly 5', pass: 'through' } }],
                            }
                        ])
                    },
                    series: [
                        {
                            type: 'Column', xName: 'x', yName: 'y',
                            dataSource: [{ y: 18, x: 1 }, { y: 29, x: 2 }, { y: 30, x: 3 }, { y: 41, x: 4 },
                                { y: 52, x: 5 }, { y: 62, x: 6 },
                                { y: 74, x: 7 }, { y: 85, x: 8 }, { y: 96, x: 9 }, { y: 102, x: 10 }],
                            marker: {
                                dataLabel: {
                                    visible: true, position: 'Outer'
                                }
                            }
                        },
                    ],
                    title: 'Fruits and Vegetables - Season',
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking the multi level labels after click event in x axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('Seedless');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('sesson1');
                expect((Object as any).values(object)[1]).toBe('through');

            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event in y axis', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container1_Axis_MultiLevelLabel_Level_1_Text_2');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('HalfYearly 3');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                expect((Object as any).values(object)[0]).toBe('Half Yearly 3');
                expect((Object as any).values(object)[1]).toBe('through');
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
        it('Checking the multi level labels after click event, date access in custom objects', (done: Function) => {
            let elem1: HTMLElement;
            loaded = (args: Object): void => {
                labelElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_2_Text_0');
                trigger.clickEvent(labelElement);
                expect(labelElement.textContent).toBe('Fruits');
                done();
            };
            multilevellabelclick = (args: IMultiLevelLabelClickEventArgs): void => {
                let object: Object = args.customAttributes;
                let startDate: Date = new Date((Object as any).values(object)[0]);
                let endDate: Date = new Date((Object as any).values(object)[1]);
                expect(startDate.getFullYear()).toBe(2005);
                expect(endDate.getFullYear()).toBe(2006);
            };
            chartObj.loaded = loaded;
            chartObj.multiLevelLabelClick = multilevellabelclick;
            chartObj.refresh();
        });
    });
    describe('Chart Multiple labels - DateTime axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                        valueType: 'DateTime',
                        multiLevelLabels: [
                            {
                                categories: [{
                                    text: 'Quater 1', start: new Date(2000, 6, 11), end: new Date(2004, 3, 6)
                                },
                                {
                                    text: 'Quater 2', start: new Date(2004, 3, 6), end: new Date(2010, 3, 8)
                                }]
                            }
                        ]
                    },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [{
                        dataSource: datetime, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green',
                    }], legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking multilevel labels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '189.95257166947724' || svg.getAttribute('x') === '236.9487774030354' ||
                    svg.getAttribute('x') === '283.75316188870147' || svg.getAttribute('x') === '188.82989038785834').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking multilevel labels with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);

                expect(svg.getAttribute('x') === '615.5474283305227' || svg.getAttribute('x') === '813.5512225969646' ||
                    svg.getAttribute('x') === '1010.7468381112985' || svg.getAttribute('x') === '623.6701096121417').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' || svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);

                expect(svg.getAttribute('x') === '189.95257166947724' || svg.getAttribute('x') === '236.9487774030354' ||
                    svg.getAttribute('x') === '283.75316188870147' || svg.getAttribute('x') === '188.82989038785834').toBe(true);
                expect(svg.getAttribute('y') === '377.5' || svg.getAttribute('y') === '378.5' ||
                    svg.getAttribute('y') === '376' || svg.getAttribute('y') === '382').toBe(true);
                let level_2_Elements: HTMLElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_1_Text_0');
                expect(parseFloat(level_2_Elements.getAttribute('y')) > parseFloat(svg.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.multiLevelLabels = [
                {
                    categories: [{
                        text: 'Quater 1', start: new Date(2000, 6, 11), end: new Date(2004, 3, 6)
                    },
                    {
                        text: 'Quater 2', start: new Date(2004, 3, 6), end: new Date(2010, 3, 8)
                    }],
                }, {
                    categories: [{
                        text: 'Years', start: new Date(2000, 6, 11), end: new Date(2010, 3, 8),
                    }]
                }
            ];
            chartObj.refresh();
        });
        
    });
    describe('Chart Multiple labels - Double', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                        valueType: 'Double',
                        multiLevelLabels: [
                            {
                                categories: [{
                                    text: 'Quater 1', start: 1, end: 4
                                },
                                {
                                    text: 'Quater 2', start: 4, end: 7
                                },
                                {
                                    text: 'Quater 3', start: 7, end: 10
                                }]
                            }
                        ]
                    },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None' },
                    series: [{
                        dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green',
                    }], legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking multilevel labels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);

                expect(svg.getAttribute('x') === '172.58333333333331' || svg.getAttribute('x') === '213.41666666666666' ||
                    svg.getAttribute('x') === '254.08333333333331' || svg.getAttribute('x') === '171.08333333333331').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking multilevel labels with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
            
                expect(svg.getAttribute('x') === '632.9166666666667' || svg.getAttribute('x') === '837.0833333333334' ||
                    svg.getAttribute('x') === '1040.4166666666667' || svg.getAttribute('x') === '641.4166666666667').toBe(true);
                expect(svg.getAttribute('y') === '405.5' || svg.getAttribute('y') === '406.5' || svg.getAttribute('y') === '405' ||
                svg.getAttribute('y') === '413' || svg.getAttribute('y') === '409').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
             
                expect(svg.getAttribute('x') === '172.58333333333331' || svg.getAttribute('x') === '213.41666666666666' ||
                    svg.getAttribute('x') === '254.08333333333331' || svg.getAttribute('x') === '171.08333333333331').toBe(true);
                expect(svg.getAttribute('y') === '377.5' || svg.getAttribute('y') === '378.5' ||
                    svg.getAttribute('y') === '376' || svg.getAttribute('y') === '382').toBe(true);
                let level_2_Elements: HTMLElement = document.getElementById('container0_Axis_MultiLevelLabel_Level_1_Text_0');
                expect(parseFloat(level_2_Elements.getAttribute('y')) > parseFloat(svg.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.multiLevelLabels = [
                {
                    categories: [{
                        text: 'Quater 1', start: 1, end: 4
                    },
                    {
                        text: 'Quater 2', start: 4, end: 7
                    },
                    {
                        text: 'Quater 3', start: 7, end: 10
                    }]
                }, {
                    categories: [{
                        text: '2017', start: 1, end: 10
                    }]
                }
            ];
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels and diff axis border type rectangle', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.border.width = 1;
            chartObj.primaryXAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels and diff axis border type withouttopandbottomborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.border.type = 'WithoutTopandBottomBorder';
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels and diff axis border type withouttopborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.border.type = 'WithoutTopBorder';
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('Checking multilevel labels with levels and diff axis border type withouttopborder labelPosition inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = false;
            chartObj.primaryXAxis.border.type = 'WithoutTopBorder';
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
    });
    describe('Chart Multiple labels - multiple axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    axes: [{
                        rowIndex: 0, columnIndex: 0,
                        name: 'yAxis1', title: 'YAxis1', majorGridLines: { width: 0 },
                    },
                    {
                        rowIndex: 1, columnIndex: 0, labelFormat: '{value}k',
                        name: 'yAxis2', title: 'YAxis2', majorGridLines: { width: 0 },
                    },
                    {
                        rowIndex: 0, columnIndex: 1, majorGridLines: { width: 0 },
                        name: 'yAxis3', title: 'YAxis3',
                    },
                    {
                        rowIndex: 1, columnIndex: 1, majorGridLines: { width: 0 },
                        name: 'yAxis4', title: 'YAxis4',
                    },
                    {
                        columnIndex: 0, rowIndex: 0, majorGridLines: { width: 0 },
                        name: 'xAxis1', title: 'xAxis1',
                        border: { width: 1 },
                    },
                    {
                        columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
                        name: 'xAxis2', title: 'xAxis2', border: { width: 1 },
                        labelPosition: 'Inside'
                    },
                    {
                        columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
                        name: 'xAxis3', title: 'xAxis3',
                        opposedPosition: true, border: { width: 1 },
                        labelPosition: 'Inside'
                    },
                    {
                        columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
                        name: 'xAxis4', title: 'xAxis4',
                        opposedPosition: true, border: { width: 1 }
                    }, {
                        columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
                        name: 'xAxis5', title: 'xAxis5',
                        border: { width: 1 }, tickPosition: 'Inside'
                    }, {
                        columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
                        name: 'xAxis6', title: 'xAxis6',
                        border: { width: 1 }, tickPosition: 'Inside', opposedPosition: true
                    },],
                    series: [
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis1', yAxisName: 'yAxis1',
                            border: { width: 2, color: 'black' },
                            emptyPointSettings: { mode: 'Drop' }, animation: { enable: false }
                        },
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis3', yAxisName: 'yAxis2',
                            animation: { enable: false }
                        },
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis2', yAxisName: 'yAxis3',
                            animation: { enable: false }
                        },
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis4', yAxisName: 'yAxis4',
                            animation: { enable: false }
                        },
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis5', yAxisName: 'yAxis4',
                            animation: { enable: false }
                        },
                        {
                            dataSource: chartData1, xName: 'x', yName: 'y',
                            xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                            animation: { enable: false }
                        },
                    ],
                    rows: [
                        { height: '50%', border: { width: 2, color: 'red' } },
                        { height: '50%', border: { width: 2, color: 'red' } },

                    ],
                    columns: [
                        { width: '50%', border: { width: 2, color: 'black' } },
                        { width: '50%', border: { width: 2, color: 'black' } },
                    ],
                });
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking multilevel labels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_4');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container_BorderLine_5');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container_BorderLine_6');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container_BorderLine_7');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container_BorderLine_8');
                expect(svg !== null).toBe(true);
                svg = document.getElementById('container_BorderLine_9');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
    });
    describe('Chart Multiple labels Vertical- Double', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                    },
                    primaryYAxis: {
                        rangePadding: 'None',
                        multiLevelLabels: [
                            {
                                categories: [{
                                    text: 'Low', start: 0, end: 20
                                },
                                {
                                    text: 'Medium', start: 20, end: 40
                                },
                                {
                                    text: 'High', start: 40, end: 60
                                }]
                            }, {
                                categories: [{
                                    text: 'Overall', start: 0, end: 60
                                }]
                            }
                        ]
                    },
                    series: [{
                        dataSource: chartData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green',
                    }], legendSettings: { visible: false }
                });
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking multilevel labels', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '82.5' || svg.getAttribute('x') === '82.5' ||
                    svg.getAttribute('x') === '83.5' || svg.getAttribute('x') === '80').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                let level_2_Elements: HTMLElement = document.getElementById('container1_Axis_MultiLevelLabel_Level_1_Text_0');
                expect(parseFloat(level_2_Elements.getAttribute('x')) < parseFloat(svg.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking multilevel labels with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);

                expect(svg.getAttribute('x') === '82.5' || svg.getAttribute('x') === '82.5' ||
                    svg.getAttribute('x') === '83.5' || svg.getAttribute('x') === '80').toBe(true);
                expect(svg.getAttribute('y') === '77.45833333333331' || svg.getAttribute('y') === '77.62499999999999' ||
                    svg.getAttribute('y') === '77.54166666666666' || svg.getAttribute('y') === '77.87499999999999').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });
        it('diff axis border type rectangle', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.border.width = 1;
            chartObj.primaryYAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
        it('diff axis border type withouttopandbottomborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.border.type = 'WithoutTopandBottomBorder';
            chartObj.refresh();
        });
        it('diff axis border type withouttopborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.primaryYAxis.border.type = 'WithoutTopBorder';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('diff axis border type withouttopborder labelPosition inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_1');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.primaryYAxis.border.type = 'WithoutTopBorder';
            chartObj.primaryYAxis.opposedPosition = false;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('multi level labels with border type withouttopandbottomborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '61.5' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'WithoutTopandBottomBorder';
            chartObj.refresh();
        });
        it('multi level labels with border type withouttopborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '61.5' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'WithoutTopBorder';
            chartObj.refresh();
        });
        it('multi level labels with border type withouttopborder with label Position inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '61.5' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('multi level labels with border type withouttopborder with label Position inside and opposed position ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '696.5' || svg.getAttribute('x') === '942' ||
                    svg.getAttribute('x') === '1186' || svg.getAttribute('x') === '710').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('multi level labels with border type withouttopborder with label Position outside and opposed position ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '675.5' || svg.getAttribute('x') === '920.5' ||
                    svg.getAttribute('x') === '1164.5' || svg.getAttribute('x') === '689').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Outside';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });

        it('multi level labels with border type brace', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '82.5' || svg.getAttribute('x') === '82.5' ||
                    svg.getAttribute('x') === '83.5' || svg.getAttribute('x') === '80').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.opposedPosition = false;
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'Brace';
            chartObj.refresh();
        });
        it('multi level labels with border type brace with label Position inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '61.5' || svg.getAttribute('x') === '59' ||
                    svg.getAttribute('x') === '58.5' || svg.getAttribute('x') === '58.5').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('multi level labels with border type brace and label positon outside and opposedposition', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '675.5' || svg.getAttribute('x') === '920.5' ||
                    svg.getAttribute('x') === '1164.5' || svg.getAttribute('x') === '689').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Outside';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('multi level labels with border type brace with label Position inside and opposed position ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '696.5' || svg.getAttribute('x') === '942' ||
                    svg.getAttribute('x') === '1186' || svg.getAttribute('x') === '710').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });

        it('multi level labels with border type curlybrace', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '76.5' || svg.getAttribute('x') === '76' ||
                    svg.getAttribute('x') === '76' || svg.getAttribute('x') === '74').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.opposedPosition = false;
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'CurlyBrace';
            chartObj.refresh();
        });
        it('multi level labels with border type curlybrace with far alignment', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '76.5' || svg.getAttribute('x') === '76' ||
                    svg.getAttribute('x') === '76' || svg.getAttribute('x') === '74').toBe(true);
                expect(svg.getAttribute('y') === '381.5' || svg.getAttribute('y') === '382.5' ||
                    svg.getAttribute('y') === '380' || svg.getAttribute('y') === '386').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].alignment = 'Far';
            chartObj.refresh();
        });
        it('multi level labels with border type curlybrace with near alignment', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '76.5' || svg.getAttribute('x') === '76' ||
                    svg.getAttribute('x') === '76' || svg.getAttribute('x') === '74').toBe(true);
                expect(svg.getAttribute('y') === '279.08333333333337' || svg.getAttribute('y') === '279.75' ||
                    svg.getAttribute('y') === '279.41666666666663' || svg.getAttribute('y') === '280.75').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].alignment = 'Near';
            chartObj.refresh();
        });
        it('multi level labels with border type curlybrace with label Position inside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '76.5' || svg.getAttribute('x') === '76' ||
                    svg.getAttribute('x') === '76' || svg.getAttribute('x') === '74').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.multiLevelLabels[0].alignment = 'Center';
            chartObj.refresh();
        });
        it('multi level labels with border type curlybrace and opposed positon and label position outside', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '680.5' || svg.getAttribute('x') === '925.5' ||
                    svg.getAttribute('x') === '1169.5' || svg.getAttribute('x') === '694').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Outside';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.refresh();
        });
        it('multi level labels with border type curlybrace with label Position inside and opposed position ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '681.5' || svg.getAttribute('x') === '927' ||
                    svg.getAttribute('x') === '1171' || svg.getAttribute('x') === '695').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Checking with maximumTextWidth', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '681.5' || svg.getAttribute('x') === '927' ||
                    svg.getAttribute('x') === '1171' || svg.getAttribute('x') === '695' || svg.getAttribute('x') === '716.5').toBe(true);  
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].categories[0].maximumTextWidth = 10;
            chartObj.primaryYAxis.multiLevelLabels[0].overflow = 'Trim';
            chartObj.refresh();
        });
        it('Checking with without border type', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '696.5' || svg.getAttribute('x') === '942' ||
                    svg.getAttribute('x') === '1186' || svg.getAttribute('x') === '710').toBe(true);
                expect(svg.getAttribute('y') === '330.2916666666667' || svg.getAttribute('y') === '331.125' ||
                    svg.getAttribute('y') === '329.7083333333333' || svg.getAttribute('y') === '333.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].categories[0].maximumTextWidth = null;
            chartObj.primaryYAxis.multiLevelLabels[0].overflow = 'Wrap';
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'WithoutBorder';
            chartObj.refresh();
        });
        it('Checking with start range less than axis visible range', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                expect(svg !== null).toBe(true);
                expect(svg.getAttribute('x') === '681.5' || svg.getAttribute('x') === '927' ||
                    svg.getAttribute('x') === '1171' || svg.getAttribute('x') === '695').toBe(true);
                expect(svg.getAttribute('y') === '336.61249999999995' || svg.getAttribute('y') === '337.4625' ||
                    svg.getAttribute('y') === '336.01250000000005' || svg.getAttribute('y') === '339.7625').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].categories[0].maximumTextWidth = null;
            chartObj.primaryYAxis.multiLevelLabels[0].categories[0].start = -2;
            chartObj.primaryYAxis.multiLevelLabels[0].border.type = 'CurlyBrace';
            chartObj.refresh();
        });
        it('Checking with zoom factor for withouttopborder border type', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.multiLevelLabels[0].categories[0].start = 0;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.border.type = 'WithoutTopBorder';
            chartObj.series[0].dataSource = chartData1;
            chartObj.primaryYAxis.zoomFactor = 0.8;
            chartObj.isTransposed = false;
            chartObj.refresh();
        });
        it('Checking with zoom factor for rectangle border type', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
    });
    describe('Chart Multiple labels - Line break labels', () => {
        let chart: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chart = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        multiLevelLabels:[{ categories: [
                            {
                                start: -0.5, end: 2.5,
                                text: 'Half Yearly 1',
                            },
                            { start: 2.5, end: 5.5, text: 'Half Yearly 2'},
                        ]}]
                    },
                    primaryYAxis: { },
                    series: [{
                        dataSource: [{ x: "aaaaaaaaaaaaaaa<br>11111111111<br>2222222222", y: 10 },
                        { x: "bbbb", y: 20 },
                        { x: "cccc", y: 30 },
                        { x: "dddd", y: 40 },
                        { x: "eeee", y: 50 },
                        { x: "ffff", y: 60 }
                    ], xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                    }], legendSettings: { visible: false }
                },'#container');
        });
        afterAll((): void => {
            elem.remove();
            chart.destroy();
        });
        it('default line break checking with multi level labels', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 6).toBe(true);
                label = document.getElementById('container0_AxisLabel_0');
                expect(label.childElementCount == 2).toBe(true);
                expect(label.childNodes[0].textContent == 'aaaaaaaaaaaaaaa').toBe(true);
                expect(label.childNodes[1].textContent == '11111111111').toBe(true);
                expect(label.childNodes[2].textContent == '2222222222').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('multi level labels-line break labels with inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 6).toBe(true);
                label = document.getElementById('container0_AxisLabel_0');
                expect(label.childElementCount == 2).toBe(true);
                expect(label.childNodes[0].textContent == 'aaaaaaaaaaaaaaa').toBe(true);
                expect(label.childNodes[1].textContent == '11111111111').toBe(true);
                expect(label.childNodes[2].textContent == '2222222222').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.refresh();
        });
        it('Multi level labels-line break labels with opposed position true', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 6).toBe(true);
                label= document.getElementById('container0_AxisLabel_0');
                expect(label.childElementCount == 2).toBe(true);
                expect(label.childNodes[0].textContent == '2222222222').toBe(true);
                expect(label.childNodes[1].textContent == '11111111111').toBe(true);
                expect(label.childNodes[2].textContent == 'aaaaaaaaaaaaaaa').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.opposedPosition = true;
            chart.refresh();
        });
        it('Multi level labels-line break labels with 90 deg rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 6).toBe(true);
                label= document.getElementById('container0_AxisLabel_0');
                expect(label.childElementCount == 2).toBe(true);
                expect(label.childNodes[0].textContent == 'aaaaaaaaaaaaaaa').toBe(true);
                expect(label.childNodes[1].textContent == '11111111111').toBe(true);
                expect(label.childNodes[2].textContent == '2222222222').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.opposedPosition = false;
            chart.primaryXAxis.labelRotation = 90;
            chart.refresh();
        });
        it('Checking border type with category type', (done: Function) => {
            loaded = (args: Object): void => {
                let firstPath: string = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_0').getAttribute('d');
                expect(firstPath.indexOf('C') !== -1).toBe(true);
                let secondPath: string = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_1').getAttribute('d');
                expect(secondPath.indexOf('C') === -1).toBe(true);
                let thirdPath: HTMLElement = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0_2');
                expect(thirdPath === null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = false;
            chart.primaryXAxis.multiLevelLabels = [
                {
                    border: {type: 'CurlyBrace'},
                    categories: [{
                        text: 'Quater 1', start: -0.5, end: 2.5
                    },
                    {
                        text: 'Quater 2', start: 2.5, end: 5.5, type: 'Rectangle'
                    },
                    {
                        text: 'Quater 3', start: 5.5, end: 7.5, type: 'WithoutBorder'
                    },
                    ]
                }
            ];
            chart.refresh();
        });
    });
    describe('Chart Multiple labels - Bar series type', () => {
        let chart: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chart = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        //title: 'Food',
                        interval: 1,
                        border: { width: 1, type: 'WithoutTopandBottomBorder' },
                        majorGridLines: { width: 0 },
                        multiLevelLabels: [
                          {
                            border: { type: 'WithoutTopBorder' },
                            categories: [
                              { start: -0.5, end: 0.5, text: 'Seedless', },
                              { start: 0.5, end: 1.5, text: 'Seeded', },
                              { start: 1.5, end: 2.5, text: 'Seedless', },
                              { start: 2.5, end: 3.5, text: 'Seeded', }
                            ]
                          },
                          {
                            border: { type: 'WithoutTopBorder' },
                            categories: [
                              { start: -0.5, end: 1.5, text: 'In Season', },
                              { start: 1.5, end: 3.5, text: 'Out of Season', },
                            ]
                          }, {
                            border: { type: 'WithoutTopBorder' },
                            textStyle: { fontWeight: 'Bold' },
                            categories: [
                              { start: -0.5, end: 3.5, text: 'Fruits', }
                            ]
                          }]
                      },
                      primaryYAxis:
                      {
                        labelFormat: '{value}B',
                        edgeLabelPlacement: 'Shift',
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 },
                        lineStyle: { width: 0 },
                        labelStyle: {
                          color: 'transparent'
                        }
                      },
                      chartArea: {
                        border: {
                          width: 0
                        }
                      },
                      //Initializing Chart Series
                      series: [
                        {
                          type: 'Bar',
                          dataSource: [
                            { x: 'Egg', y: 2.2 }, { x: 'Fish', y: 2.4 },
                            { x: 'Misc', y: 3 }, { x: 'Tea', y: 3.1 }
                          ],
                          xName: 'x', width: 2,
                          yName: 'y', name: 'Imports', marker: {
                            dataLabel: {
                              visible: true,
                              position: 'Top',
                              font: {
                                fontWeight: '600', color: '#ffffff'
                              }
                            }
                          }
                        },
                        {
                          type: 'Bar',
                          dataSource: [
                            { x: 'Egg', y: 1.2 }, { x: 'Fish', y: 1.3 },
                            { x: 'Misc', y: 1.5 }, { x: 'Tea', y: 2.2 }
                          ],
                          xName: 'x', width: 2,
                          yName: 'y', name: 'Exports', marker: {
                            dataLabel: {
                              visible: true,
                              position: 'Top',
                              font: {
                                fontWeight: '600', color: '#ffffff'
                              }
                            }
                          }
                        }
                      ],
                      // Initializing the tooltip
                      tooltip: {
                        enable: true
                      },
                },
                '#container');
        });
        afterAll((): void => {
            elem.remove();
            chart.destroy();
        });
        it('Checking primary axis labels with border type withouttopandbottomborder', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_BorderLine_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.border.type = 'WithoutTopandBottomBorder';
            chart.primaryXAxis.border.width = 1;
            chart.refresh();
        });
        it('Checking primary axis labels with border alignment', (done: Function) => {
            loaded = (args: Object): void => {
                let path: string;
                let checkPath: string[] = [];
                svg = document.getElementById('container_BorderLine_0');
                path = svg.getAttribute('d');
                checkPath = path.split(' ');
                expect(checkPath[8] === '287.5' || checkPath[8] === '289').toBe(true);
                expect(checkPath[30] === '102.5' || checkPath[30] === '103').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.border.type = 'WithoutTopandBottomBorder';
            chart.primaryXAxis.border.width = 1;
            chart.refresh();
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
describe('Chart Multiple labels - label placement OnTicks', () => {
    let chart: Chart;
    let elemt: HTMLElement;
    let svg: HTMLElement;
    let text: HTMLElement;
    let datalabel: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    beforeAll(() => {
        elemt = createElement('div', { id: 'MultiLevelcontainer' });
        document.body.appendChild(elemt);
        chart = new Chart(
            {
                primaryXAxis: {
                    valueType: 'Category',
                    border: { width: 1, type: 'Rectangle' },
                    isIndexed: true,
                    interval: 1,
                    labelPlacement: 'OnTicks',
                    edgeLabelPlacement: 'Shift',
                    majorGridLines: { width: 0 },
                    multiLevelLabels: Browser.isDevice
                        ? [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: -0.5, end: 2.5, text: 'In Season' },
                                    { start: 2.5, end: 5.5, text: 'Out of Season' },
                                    { start: 5.5, end: 7.5, text: 'In Season' },
                                    { start: 7.5, end: 9.5, text: 'Out of Season' },
                                ],
                            },
                            {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: -0.5, end: 5.5, text: 'Fruits' },
                                    { start: 5.5, end: 9.5, text: 'Vegetables' },
                                ],
                            },
                        ]
                        : [
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: -0.5, end: 0.5, text: 'Seedless' },
                                    { start: 0.5, end: 2.5, text: 'Seeded' },
                                    { start: 2.5, end: 3.5, text: 'Seedless' },
                                    { start: 3.5, end: 5.5, text: 'Seeded' },
                                    { start: 5.5, end: 6.5, text: 'Seedless' },
                                    { start: 6.5, end: 7.5, text: 'Seeded' },
                                    { start: 7.5, end: 8.5, text: 'Seedless' },
                                    { start: 8.5, end: 9.5, text: 'Seeded' },
                                ],
                            },
                            {
                                border: { type: 'Rectangle' },
                                categories: [
                                    { start: -0.5, end: 2.5, text: 'In Season' },
                                    { start: 2.5, end: 5.5, text: 'Out of Season' },
                                    { start: 5.5, end: 7.5, text: 'In Season' },
                                    { start: 7.5, end: 9.5, text: 'Out of Season' },
                                ],
                            },
                            {
                                border: { type: 'Rectangle' },
                                textStyle: { fontWeight: 'Bold' },
                                categories: [
                                    { start: -0.5, end: 5.5, text: 'Fruits' },
                                    { start: 5.5, end: 9.5, text: 'Vegetables' },
                                ],
                            },
                        ],
                },
                chartArea: {
                    border: {
                        width: 0
                    }
                },
                primaryYAxis: {
                    minimum: 0,
                    maximum: 120,
                    interval: 30,
                    majorTickLines: { width: 0 },
                    lineStyle: { width: 0 },
                    labelStyle: { color: 'transparent' },
                },
                width: Browser.isDevice ? '100%' : '80%',
                //Initializing Chart Series
                series: [
                    {
                        type: 'Column',
                        xName: 'x',
                        yName: 'y',
                        dataSource: [
                            { x: 'Apple', y: 28 },
                            { x: 'Tomato', y: 87 },
                            { x: 'Pears', y: 42 },
                            { x: 'Grapes', y: 13 },
                            { x: 'Apples', y: 13 },
                            { x: 'Pears', y: 10 },
                            { x: 'Tomato', y: 31 },
                            { x: 'Potato', y: 96 },
                            { x: 'Cucumber', y: 41 },
                            { x: 'Onion', y: 59 },
                        ],
                        marker: {
                            dataLabel: {
                                visible: true,
                                position: 'Outer',
                            },
                        },
                    },
                ],
            },
            '#MultiLevelcontainer');
    });
    afterAll((): void => {
        elemt.remove();
        chart.destroy();
    });
    it('checking edge label Placement is Shift', (done: Function) => {
        loaded = (args: Object): void => {
            let firstlabel = document.getElementById('MultiLevelcontainer0_Axis_MultiLevelLabel_Level_0_Text_0').getAttribute('x');
            let lastlabel = document.getElementById('MultiLevelcontainer0_Axis_MultiLevelLabel_Level_0_Text_7').getAttribute('x');
            done();
        };
        chart.loaded = loaded;
        chart.primaryXAxis.labelPlacement = 'OnTicks';
        chart.primaryXAxis.edgeLabelPlacement = 'Shift';
        chart.refresh();
    });
});