/**
 * Pareto Series Spec
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
import { ParetoSeries } from '../../../src/chart/series/pareto-series';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { tooltipData1, negativeDataPoint, rotateData1, rotateData2, categoryData, categoryData1 } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { getElement } from '../../../src/index';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ParetoSeries, DataLabel, Category, DateTime, Tooltip, Crosshair);
export interface Arg {
    chart: Chart;
}

export interface series {
    series: Series;
}
describe('chart control', () => {
    let element: HTMLElement;
    /**
     * Default Pareto Series
     */
    describe('pareto Series', () => {
        let chartObj: Chart;
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
        let element1: Element;
        // let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            var data = [
                { 'x': 'UC Browser', y: 37, },
                { 'x': 'Chrome', y: 40, },
                { 'x': 'Android', y: 3, },
                { 'x': 'Mozila', y: 2, },
                { 'x': 'Micromax', y: 1, },
                { 'x': 'iPhone', y: 32, },
                { 'x': 'Others', y: 26, },
                { 'x': 'Opera', y: 8, },
            ];
            chartObj = new Chart(
                {

                    primaryXAxis: {
                        valueType: 'Category',
                        title: 'Browser'
                    },
                    primaryYAxis: {
                        title: 'Values',
                        minimum: 0,
                        maximum: 150,
                        interval: 30,
                    },
                    series: [
                        {
                            xName: 'x',
                            yName: 'y', dataSource: data, name: 'Browser', type: 'Pareto',
                            marker: { dataLabel: { visible: true }, visible: true, width: 10, height: 10 }
                        },
                    ],

                    legendSettings: {
                        position: 'Top',
                        border: { width: 1, color: 'red' }
                    },
                    tooltip: { enable: true, format: '${point.x}:<b> ${point.y}<b>', enableAnimation: true },
                    title: 'Mobile Browser Statistics',
                    border: { width: 2, color: 'blue' },
                    chartArea: { border: { width: 2, color: 'red' } }

                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Animation', (done: Function) => {
            chartObj.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let pathLength: number = (<SVGPathElement>args.series.pathElement).getTotalLength();
                expect(pathLength >= 200).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();

        });
        it('Checking with axis with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container1_AxisLabel_0');
                let svg1: HTMLElement = document.getElementById('container2_AxisLabel_0');
                expect(parseFloat(svg.getAttribute('x')) <
                    parseFloat(svg1.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = false;
            chartObj.axes[0].opposedPosition = true;
            chartObj.refresh();

        });

        it('Showing default data label', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0_Point_3_Text_0');
                expect((+element.textContent) == 26).toBe(true);
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });
        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_0_Point_4_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[0]).points[4]).symbolLocations[0].y < element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let element: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                let locationY: number = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].y;
                let height: number = document.getElementById('container_Series_0_Point_0_Text_0').getBoundingClientRect().height;
                expect(locationY != element).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Outer', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y > element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element1 = getElement('containerSeriesCollection');
                expect(element1.childElementCount).toBe(6);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                element1 = getElement('containerSymbolGroupPareto');
                expect(element1.childElementCount).toBe(9);
                let marker: HTMLElement = document.getElementById('container_Series_Pareto_Point_0_Symbol');
                expect(marker.getAttribute('stroke') == '#000000').toBe(true);
                expect(marker.getAttribute('fill') == '#ffffff').toBe(true);
                expect(marker.getAttribute('rx') == '5').toBe(true);
                expect(marker.getAttribute('ry') == '5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking the last text value as 100', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('container_Series_Pareto_Point_7_Text_0').textContent).toBe(100 + '%');
                done();
            }
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking line series marker color', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: HTMLElement = document.getElementById('container_Series_Pareto_Point_2_Symbol');
                expect(element1.getAttribute('fill') == '#ffffff').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Checking column series in descending order', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: HTMLElement = document.getElementById('container_Series_0_Point_3_Text_0');
                let element2: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(parseFloat(element1.getAttribute('y')) <
                    parseFloat(element2.getAttribute('y'))).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Checking line series in ascending order', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: HTMLElement = document.getElementById('container_Series_Pareto_Point_1_Text_0');
                let element2: HTMLElement = document.getElementById('container_Series_Pareto_Point_2_Text_0');
                expect(parseFloat(element1.getAttribute('y')) >
                    parseFloat(element2.getAttribute('y'))).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Checking the legend', (done: Function) => {
            loaded = (args: Object): void => {
                element1 = getElement('container_chart_legend_translate_g');
                expect(element1.childElementCount).toBe(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Changing marker shape ', (done: Function) => {
            loaded = (args: Object): void => {
                let direction: string;
                let series1: HTMLElement;
                series1 = document.getElementById('container_Series_Pareto_Point_1_Symbol');
                //direction = series1.getAttribute('d');
                expect(series1 != null).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.refresh();
        });

        it('Checking line series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                let path = document.getElementById('container_Series_Pareto');
                let id: string = path.getAttribute('d');
                let check: number = id.indexOf('z');
                expect(check !== 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.refresh();
        });

        it('Changing marker size', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_Pareto_Point_2_Symbol');
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

        it('Changing datalabel color', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(series1.getAttribute('fill') == 'white').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = "blue";
            chartObj.refresh();
        });

    });
    describe('multiple Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let series: Series;
        let element1: Element;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            var data = [
                { x: 'Traffic', y: 56 }, { x: 'Child Care', y: 44.8 },
                { x: 'Transport', y: 87.2 }, { x: 'Weather', y: 19.6 },
                { x: 'Emergency', y: 6.6 }
            ];
            var data1= [
                { x: 'Traffic', y: 56 }, { x: 'Child Care', y: 44.8 },
                { x: 'Transport', y: 37.2 }, { x: 'Weather', y: 19.6 },
                { x: 'Emergency', y: 6.6 }
            ];
            chartObj = new Chart(
                {

                    primaryXAxis: {
                        valueType: 'Category',
                        title: 'Browser'
                    },
                    primaryYAxis: {
                        title: 'Values',
                        minimum: 0,
                        maximum: 150,
                        interval: 30,
                    },
                    axes: [{
                        minimum: 0,
                        name: '', 
                        opposedPosition: true,
                        maximum: 100,
                        interval: 30,
                        rowIndex: 1,
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 }, majorGridLines: { width: 1 },
                        minorGridLines: { width: 1 }, minorTickLines: { width: 0 }
                    }],
                    series: [
                        {
                            xName: 'x',
                            yName: 'y', dataSource: data, name: 'Browser', type: 'Pareto',
                            marker: { dataLabel: { visible: true }, visible: true, width: 10, height: 10 }
                        },
                        {
                            xName: 'x',
                            yName: 'y', dataSource: data1, name: 'Browser', type: 'Pareto',
                            marker: { dataLabel: { visible: true }, visible: true, width: 10, height: 10, }
                        },

                    ],

                    legendSettings: {
                        position: 'Top',
                        border: { width: 1, color: 'red' }
                    },
                    tooltip: { enable: true, format: '${point.x}:<b> ${point.y}<b>', enableAnimation: true },
                    title: 'Mobile Browser Statistics',
                    border: { width: 2, color: 'blue' },
                    chartArea: { border: { width: 2, color: 'red' } }

                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Checking with multiple series type', (done: Function) => {
            loaded = (args: Object): void => {
                let element: Element = document.getElementById('container_Series_0_Point_0');
                let element1: Element = document.getElementById('container_Series_1_Point_0');
                expect(element.getAttribute('d') != '').toBe(true);
                expect(element1.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = false;
            chartObj.series[1].animation.enable = false;
            chartObj.refresh();
        });
        it('Checking with axes', function (done) {
            loaded = function (args) {
                var element = document.getElementById('containerAxisLine_0');
                var element1 = document.getElementById('containerAxisLine_1');
                expect(element.getAttribute('y1') == '388.5');
                expect(element1.getAttribute('y1') == '234.75');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].yAxisName='secondary';
            chartObj.axes[0].name=chartObj.series[1].yAxisName;
            chartObj.rows = [{
                height: '50%'
            }, {
                height: '50%'
            }];

            chartObj.refresh();
        });

    });
});