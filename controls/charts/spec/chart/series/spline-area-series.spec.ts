/**
 * Specifies the  Spline Area series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import {
    ChartSeriesType, ChartRangePadding, ValueType,
    ChartShape, LabelPlacement
} from '../../../src/chart/utils/enum';
import { SplineSeries } from '../../../src/chart/series/spline-series';
import { SplineAreaSeries } from '../../../src/chart/series/spline-area-series';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { StepLineSeries } from '../../../src/chart/series/step-line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { DataLabel } from '../../../src/chart/series/data-label'
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Legend } from '../../../src/chart/legend/legend';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { tooltipData1, tooltipData2, datetimeData, categoryData1, negativeDataPoint, spline1, rotateData1 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IPointRenderEventArgs, ILegendRenderEventArgs, IDragCompleteEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { getElement, removeElement } from '../../../src/chart/index';

export interface Series1 {
    series: Series
}

Chart.Inject(SplineSeries, SplineAreaSeries, ScatterSeries, StepLineSeries, LineSeries, Category, DateTime, AreaSeries,
    DataLabel, Legend, Tooltip, Crosshair, Logarithmic, Selection, );
let data: any = tooltipData1;
let data2: any = tooltipData2;
let datetime: any = datetimeData;

export interface Arg {
    chart: Chart;
}
let prevent: Function = (): void => {
    //Prevent Function
};
export interface Wheel {
    preventDefault: Function;
    wheelDelta: number;
    detail: number;
    clientX: number;
    clientY: number;
}
export let chartData: any[] = [{ x: 2002, y: 2.2 }, { x: 2003, y: 3.4 }, { x: 2004, y: 2.8 }, { x: 2005, y: 1.6 },
{ x: 2006, y: 2.3 }, { x: 2007, y: 2.5 }, { x: 2008, y: 2.9 }, { x: 2009, y: 3.8 }, { x: 2010, y: 1.4 }, { x: 2011, y: 3.1 }];

export let emptyPointsData1: any[] = [
    { x: 1000, y: 70 }, { x: 2000, y: 40 },
    { x: 3000, y: null }, { x: 4000, y: 60 },
    { x: 5000, y: 50 }, { x: 6000, y: 90 },
    { x: 7000, y: 40 }];
describe('Chart Control', () => {
    describe('Chart Spline Area series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let datalabel: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: chartData, xName: 'x', yName: 'y', animation: { enable: false }, type: 'SplineArea',
                        name: 'Gold', fill: 'green',
                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking without range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg.getAttribute('stroke') === 'transparent').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('series selection ', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0');
                let series: Element = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(2);
                done();
            };
            chartObj.selectionMode = 'Series';
            chartObj.isMultiSelect = false;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'black';
            chartObj.series[0].marker.visible = true;
            chartObj.loaded = loaded;
            //    chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Single point selection and UnSelection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_1_Symbol');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = false;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Selection mode DragX', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                let element: HTMLElement = document.getElementById('container_ej2_drag_rect');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragX';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Selection mode DragY', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                let element: HTMLElement = document.getElementById('container_ej2_drag_rect');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Selection mode DragXY', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                let element: HTMLElement = document.getElementById('container_ej2_drag_rect');
                expect(element != null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragXY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Point Rendering Event', (done: Function) => {
            loaded = (args: Object) => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(element.getAttribute('fill')).toBe('pink');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.pointRender = (args: IPointRenderEventArgs): void => {
                if (args.point.index === 0) {
                    args.fill = 'pink';
                }
            }
            chartObj.legendSettings.alignment = 'Near';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Legend Rendering Event', (done: Function) => {
            loaded = (args: Object) => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.getAttribute('fill')).toEqual('blue');
                expect(legendShape.getAttribute('d') != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendRender = (args: ILegendRenderEventArgs): void => {
                args.fill = 'blue';
            };
            chartObj.series[0].name = 'series1';
            chartObj.legendSettings = { visible: true, position: 'Top', alignment: 'Near' };
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });


        it('Checking with marker shape Circle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'black';
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking with marker shape diamond', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Diamond';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with marker visible false', (done: Function) => {
            loaded = (args: Object): void => {
                datalabel = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(datalabel === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        it('Checking with undefined Points', (done: Function) => {
            loaded = (args: Object): void => {
                let path = document.getElementById('container_Series_0');
                let id: string = path.getAttribute('d');
                expect(id.indexOf('NaN') < 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = undefined;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(svg === null).toBe(true);
                let path = document.getElementById('container_Series_0');
                let id: string = path.getAttribute('d');
                let check: number = id.lastIndexOf('M');
                expect(check !== 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('container1_AxisLabel_5');
                let series: Series = <Series>args.chart.series[0];
                expect(parseFloat(svg.getAttribute('y')) > series.points[4].symbolLocations[0].y).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with single Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 1000 }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData1;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        it('Checking with category axis onticks', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.series[0].dataSource = categoryData1;
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                { dataSource: data, xName: 'x', yName: 'y', name: 'Gold', fill: 'red', opacity: 0.5, type: 'SplineArea', animation: { enable: false } },
                { dataSource: data2, xName: 'x', yName: 'y', name: 'silver', fill: 'rgba(135,206,235,1)', opacity: 0.5, type: 'SplineArea', animation: { enable: false } },
            ];
            chartObj.series[0].marker.visible = true;
            chartObj.series[1].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        
        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') === 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double',
                chartObj.series = [
                    {
                        dataSource: spline1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'SplineArea',
                        name: 'Gold', fill: 'red', opacity: 0.5,
                    },
                    {
                        dataSource: spline1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'SplineArea',
                        name: 'Silver', fill: 'blue', opacity: 0.5,
                    },
                    {
                        dataSource: spline1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'SplineArea',
                        name: 'Ruby', fill: 'green', opacity: 0.5,
                    },
                    {
                        dataSource: spline1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'SplineArea',
                        name: 'diamond', fill: 'black', opacity: 0.5,
                    },
                ]


            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            },
            {
                columnIndex: 1, name: 'xAxis1',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.height = '650';
            chartObj.width = '800';
            chartObj.series[1].yAxisName = 'yAxis1';
            chartObj.series[2].xAxisName = 'xAxis1';
            chartObj.series[3].yAxisName = 'yAxis1';
            chartObj.series[3].xAxisName = 'xAxis1';

            chartObj.rows = [{ height: '300', border: { width: 4, color: 'red' } },
            { height: '300', border: { width: 4, color: 'blue' } }];
            chartObj.columns = [{ width: '400', border: { width: 4, color: 'red' } }, { width: '400', border: { width: 4, color: 'red' } }];
            chartObj.refresh(); unbindResizeEvents(chartObj);

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
            chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        it('Checking with category axis with multiple panes- column', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('x2') == '457.5' || svg.getAttribute('x2') == '453.5').toBe(true);
                let svg1: HTMLElement = document.getElementById('container_AxisBottom_Column0');
                expect(svg1.getAttribute('stroke') == 'red').toBe(true);
                svg = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('x1') == '57.5' || svg.getAttribute('x1') == '53.5').toBe(true);
                svg1 = document.getElementById('container_AxisBottom_Column1');
                expect(svg1.getAttribute('stroke') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;

            chartObj.columns = [
                {
                    width: '400', border: { width: 4, color: 'red' }
                },
                {
                    width: '400', border: { width: 4, color: 'blue' }
                }
            ];
            chartObj.series = [
                {
                    dataSource: spline1, xName: 'x', yName: 'y',
                    name: 'series1', type: 'SplineArea', animation: { enable: false }
                },
                {
                    dataSource: spline1, xName: 'x', yName: 'y',
                    name: 'series2', type: 'SplineArea', animation: { enable: false }, xAxisName: 'yAxis1',
                }
            ];

            chartObj.axes[0].columnIndex = 1;
            chartObj.axes[0].name = 'yAxis1';
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with category axis with multiple panes- rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');

                expect(svg.getAttribute('y1') == '589.5' || svg.getAttribute('y1') == '593.5').toBe(true);
                svg = document.getElementById('containerAxisLine_1');

                expect(svg.getAttribute('y1') == '334.375' || svg.getAttribute('y1') == '499.375').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rows = [{
                height: '50%'
            }, {
                height: '50%'
            }];
            chartObj.series = [
                {
                    dataSource: spline1, xName: 'x', yName: 'y',
                    name: 'series1', type: 'SplineArea', animation: { enable: false }
                },
                {
                    dataSource: spline1, xName: 'x', yName: 'y',
                    name: 'series2', type: 'SplineArea', animation: { enable: false }, yAxisName: 'yAxis1',
                }
            ];
            chartObj.axes[0].rowIndex = 1;
            chartObj.axes[0].opposedPosition = true;
            chartObj.axes[0].name = 'yAxis1';
            chartObj.axes[0].minimum = 50;
            chartObj.axes[0].maximum = 130;
            chartObj.axes[0].interval = 10;
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking mouse wheel zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let wheelArgs: Wheel = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 300
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.10').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00' ||
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.01').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking  zooming with touch', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                let areaElement = document.getElementById('container_svg');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                let content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.33' || content == '0.32').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.77' || content == '0.87' || content == '0.78').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });
    });
    describe('Spline Area Series Inversed axis', () => {
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
                        name: 'Gold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: 50 }, { x: 6000, y: 40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y', size: 'size',
                        type: 'SplineArea', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY !== pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY !== pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
            unbindResizeEvents(chart);
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
            unbindResizeEvents(chart);
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
            unbindResizeEvents(chart);
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
    describe('checking spline area chart', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let pathElement: Element = null;
        let markerElement: Element = null;
        let pointElement: Element = null;
        let path: string = null;
        let temp: number;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart({
                primaryXAxis: { title: 'primaryXAxis' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                    {
                        type: 'SplineArea', name: 'splinearea', dataSource: emptyPointsData1, xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    }
                ],
                title: 'rotated area Chart'
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });
        it('Empty Point with Line Series Gap mode', (done: Function) => {
            loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement('container_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Empty Point with Line Series Zero mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement('container_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(3);
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Zero', fill: 'blue', border: { width: 2, color: 'purple' } };
            chartObj.refresh();
        });
        it('Empty Point with Line Series Average Mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement('container_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(3);
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Average' };
            chartObj.refresh();
        });
        it('Empty Point with Line Series Drop Mode', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                pathElement = getElement('container_Series_0');
                path = pathElement.getAttribute('d');
                let pathLength: number = path.split('L').length;
                expect(pathLength).toBe(5);
                done();
            };
            chartObj.series[0].emptyPointSettings = { mode: 'Drop' };
            chartObj.refresh();
        });
    });
    describe('checking rotated spline area chart', () => {
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
                        type: 'SplineArea', name: 'spline1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    }
                ],
                title: 'rotated spline Chart'
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
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with datalabel Outer position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
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
            chart.refresh(); unbindResizeEvents(chart);
        });
    });
    describe('checking spline types  with spline Area chart', () => {
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
                        type: 'SplineArea', name: 'spline1', dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    }
                ],
                title: 'Types spline Chart'
            });
            chart.appendTo('#container');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking with cardinal dateTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.series[0].cardinalSplineTension = 0.8;
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with cardinal dateTime axis(Months)', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.primaryXAxis.intervalType = 'Months';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with cardinal dateTime axis(Days)', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.primaryXAxis.intervalType = 'Days';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with cardinal dateTime axis(hours)', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.series[0].cardinalSplineTension = -0.2;
            chart.primaryXAxis.intervalType = 'Hours';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with cardinal dateTime axis(seconds)', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.series[0].cardinalSplineTension = 1.2;
            chart.primaryXAxis.intervalType = 'Seconds';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with cardinal dateTime axis(minutes)', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Cardinal';
            chart.primaryXAxis.intervalType = 'Minutes';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with monotonic dateTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Monotonic';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with clamped dateTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Clamped';
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with clamped dateTime axis with consecutive same x values', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].splineType = 'Clamped';
            chart.series[0].dataSource = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2000, 6, 11), y: 20 },
            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: -65 },
            { x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }];
            chart.refresh(); unbindResizeEvents(chart);
        });
        it('checking with maximum value at first', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg).not.toEqual(null);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.valueType = 'Double';
            chart.series = [{
                dataSource: [{ x: 1, y: 100 }, { x: 2, y: 20 }, { x: 3, y: 65 }], xName: 'x', yName: 'y', animation: { enable: false },
                type: 'SplineArea', marker: { visible: true }
            }];
            chart.refresh(); unbindResizeEvents(chart);
        });
    });

    describe('Spline Area Series with animation', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        animation: { enable: true, duration: 1500 }, name: 'Gold',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 70 }, { x: 4000, y: -60 },
                        { x: 5000, y: 50 }, { x: 6000, y: 40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }
                        ], xName: 'x', yName: 'y',
                        type: 'SplineArea', fill: 'rgba(135,206,235,1)',
                        marker: { visible: true }
                    }, {
                        animation: { enable: true, duration: 1500 }, name: 'Silver',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 70 }, { x: 4000, y: -60 },
                        { x: 5000, y: 50 }, { x: 6000, y: 40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }
                        ], xName: 'x', yName: 'y',
                        type: 'SplineArea', fill: 'rgba(135,206,235,1)',
                        marker: { visible: true }
                    }, {
                        animation: { enable: true, duration: 1500 }, name: 'Bronze',
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 70 }, { x: 4000, y: -60 },
                        { x: 5000, y: 50 }, { x: 6000, y: 40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }
                        ], xName: 'x', yName: 'y',
                        type: 'SplineArea', fill: 'rgba(135,206,235,1)',
                        marker: { visible: true }
                    }],

                    width: '800',
                    legendSettings: { visible: false },
                    title: 'Chart TS Title',

                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Default animation', (done: Function) => {
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: Series1): void => {
                let series: Series = args.series;
                let element: HTMLElement = document.getElementById('container_ChartSeriesClipRect_0').childNodes[0] as HTMLElement;
                expect(series.clipRect.width === parseFloat(element.getAttribute('width'))).toBe(true);
                done();
            };
            chartObj.animationComplete = animate;
        });
        it('Checking vertical mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.isTransposed = true;
            chartObj.series[0].animation.enable = false;
            chartObj.series[1].animation.enable = false;
            chartObj.series[2].animation.enable = false;
            chartObj.refresh();
        });

        it('Checking remove series', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                expect(chartObj.visibleSeriesCount).toBe(2);
                expect(chartObj.visibleSeries[0].name).toBe('Gold');
                expect(chartObj.visibleSeries[1].name).toBe('Bronze');
                done();
            }
            chartObj.removeSeries(1);
        });
    });
});