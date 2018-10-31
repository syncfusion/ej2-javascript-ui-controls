
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
import { ILoadedEventArgs } from '../../../src/common/model/interface';
import { categoryData1 } from '../polar-radar/polar-radar-series.spec';
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
                expect(svg.getAttribute('x') === '156.14285714285717' || svg.getAttribute('x') === '191.14285714285717' ||
                    svg.getAttribute('x') === '226' || svg.getAttribute('x') === '154.2857142857143').toBe(true);
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
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '335.4333190917969' || svg.getAttribute('y') === '321.359375').toBe(true);
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
                    svg.getAttribute('y') === '123.81668090820312' || svg.getAttribute('y') === '114.390625').toBe(true);
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
                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '115.75' || svg.getAttribute('y') === '114.75' ||
                    svg.getAttribute('y') === '118.25' || svg.getAttribute('y') === '108.25').toBe(true);
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
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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

                expect(svg.getAttribute('x') === '186.96875' || svg.getAttribute('x') === '232.90625' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '185.78125').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
             
                expect(svg.getAttribute('x') === '310.9375' || svg.getAttribute('x') === '402.8125' ||
                    svg.getAttribute('x') === '494.3125' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '312.5625').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
                
                expect(svg.getAttribute('x') === '63' || svg.getAttribute('x') === '62' ||
                    svg.getAttribute('x') === '278.65625' || svg.getAttribute('x') === '188' || svg.getAttribute('x') === '59').toBe(true);
                expect(svg.getAttribute('y') === '87.75' || svg.getAttribute('y') === '86.75' ||
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '89.25' || svg.getAttribute('y') === '81.25').toBe(true);
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
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '76.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '76.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                    svg.getAttribute('y') === '84.25' || svg.getAttribute('y') === '76.25').toBe(true);
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
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
                svg = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = false;
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
                    svg.getAttribute('x') === '1171' || svg.getAttribute('x') === '695').toBe(true);
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
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0');
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
                svg = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.border.type = 'Rectangle';
            chartObj.refresh();
        });
    });
});
