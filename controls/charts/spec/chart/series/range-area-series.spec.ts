/**
 * Range Area Series Spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { RangeAreaSeries } from '../../../src/chart/series/range-area-series';
import { RangeColumnSeries } from '../../../src/chart/series/range-column-series';
import { negativeDataPoint } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILegendRenderEventArgs } from '../../../src/common/model/interface';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IDragCompleteEventArgs } from '../../../src/common/model/interface';
Chart.Inject(
    LineSeries, DataLabel, Category, DateTime, RangeAreaSeries,
    RangeColumnSeries, Legend, Tooltip, Crosshair, Logarithmic, Selection);

let pointData: object[] = [
    { x: 'Jan', low: 0.7, high: 6.7 }, { x: 'Feb', low: 1.3, high: 6.3 }, { x: 'Mar', low: 1.9, high: 8.5 },
    { x: 'Apr', low: 3.1, high: 10.8 }, { x: 'May', low: 5.7, high: 14.40 }, { x: 'Jun', low: 8.4, high: 16.90 },
    { x: 'Jul', low: 10.6, high: 19.20 }, { x: 'Aug', low: 10.5, high: 18.9 }, { x: 'Sep', low: 8.5, high: 16.1 },
    { x: 'Oct', low: 6.0, high: 12.5 }, { x: 'Nov', low: 1.5, high: 6.9 }, { x: 'Dec', low: 5.1, high: 12.1 }
];

let data: object[] = [
    { x: 'Jan', high: 2.63, low: 3.63 },
    { x: 'Feb', high: 2.11, low: 3.14 },
    { x: 'Mar', high: 2.68, low: 2.31 },
    { x: 'Apr', high: 3.16, low: 2.24 },
    { x: 'May', high: 3.57, low: 2.02 },
    { x: 'Jun', high: 3.56, low: 1.05 },
    { x: 'Jul', high: 3.63, low: 1.24 },
    { x: 'Aug', high: 3.77, low: 1.15 },
    { x: 'Sep', high: 3.87, low: 1.14 },
    { x: 'Oct', high: 3.53, low: 1.17 },
    { x: 'Nov', high: 3.39, low: 1.14 },
    { x: 'Dec', high: 2.96, low: 1.50 }
];

export let categoryData: object[] = [
    { x: 'Jan', low: 0.7, high: 7.7 }, { x: 'Feb', low: 1.3, high: 8.1 }, { x: 'Mar', low: 1.9, high: 8.5 },
    { x: 'Apr', low: 3.1, high: 10.8 }, { x: 'May', low: 5.7, high: 14.40 }, { x: 'Jun', low: 8.4, high: 16.90 },
    { x: 'Jul', low: 10.6, high: 19.20 }, { x: 'Aug', low: 10.5, high: 18.9 }, { x: 'Sep', low: 8.5, high: 16.1 },
    { x: 'Oct', low: 6.0, high: 12.5 }, { x: 'Nov', low: 1.5, high: 6.9 }, { x: 'Dec', low: 5.1, high: 12.1 }];

export let doubleData: object[] = [
    { x: 1, low: -12, high: 0 }, { x: 2, low: 12, high: 10 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 202, high: 43 },
    { x: 5, low: 0, high: 10 }, { x: 6, low: -22, high: 34 },
    { x: 7, low: -12, high: 23 }, { x: 8, low: 12, high: 40 }];
export let dateTimeData: object[] = [
    { x: new Date(1, 0, 2000), low: -12, high: 0 }, { x: new Date(1, 0, 2001), low: 12, high: 10 },
    { x: new Date(1, 0, 2002), low: 23, high: 10 }, { x: new Date(1, 0, 2003), low: 202, high: 43 },
    { x: new Date(1, 0, 2004), low: 0, high: 10 }, { x: new Date(1, 0, 2005), low: -22, high: 34 },
    { x: new Date(1, 0, 2006), low: -12, high: 23 }, { x: new Date(1, 0, 2007), low: 12, high: 40 }];


export let doubleData1: object[] = [
    { x: 1, low: 8, high: 20 }, { x: 2, low: 2, high: 18 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 20, high: 43 },
];

export let doubleData2: object[] = [
    { x: 1, low: 80, high: 120 }, { x: 2, low: 70, high: 95 },
    { x: 3, low: 55, high: 77 }, { x: 4, low: 60, high: 80 },
];

export let doubleData3: object[] = [
    { x: 11, low: 8, high: 20 }, { x: 12, low: 2, high: 18 },
    { x: 13, low: 23, high: 10 }, { x: 14, low: 20, high: 43 },
];

let datatime: object[] = [
    { x: new Date(2000, 3, 21), high: 200.19, low: 130.37 },
    { x: new Date(2000, 6, 17), high: 203.23, low: 93.16 },
    { x: new Date(2000, 9, 18), high: 204.89, low: 104.23 },
    { x: new Date(2001, 3, 20), high: 152, low: 67 },
    { x: new Date(2001, 6, 25), high: 135.45, low: 70.23 },
    { x: new Date(2001, 9, 30), high: 200.12, low: 140.69 }];

let logdata: object[] = [
    { x: 1, high: 900.19, low: 200.37 },
    { x: 2, high: 1163.23, low: 809.16 },
    { x: 3, high: 5004.89, low: 2104.23 },
    { x: 4, high: 19152.35, low: 16967 },
    { x: 5, high: 19952.35, low: 17967 },
    { x: 6, high: 21152.35, low: 16967 },
    { x: 7, high: 23152.35, low: 18967 },
    { x: 8, high: 24152.35, low: 21967 },
];

let lineData: object[] = [
    { x: 1, y: 28 }, { x: 2, y: 25 }, { x: 3, y: 26 }, { x: 4, y: 27 },
    { x: 5, y: 32 }, { x: 6, y: 35 }, { x: 7, y: 30 }
];

export interface wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number
}
let prevent: Function = (): void => {
    //Prevent Function
};


describe('Chart', () => {
    let element: HTMLElement;
    let id: string = 'container';
    let draggedRectGroup: string = id + '_ej2_drag_rect';
    let closeId: string = id + '_ej2_drag_close';
    describe('Range Area Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart({
                primaryXAxis: {
                    title: 'Month',
                },
                primaryYAxis: {
                    title: 'Temperature(Celsius)'
                },
                series: [{
                    animation: { enable: false },
                    name: 'India',
                    type: 'RangeArea', marker: { visible: true }
                }],
                width: '800',
                title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: true }
            });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });
        it('Default Series Type without data Points', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('d') == '').toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true);
                done();
            };
            chartObj.loaded = loaded; chartObj.refresh();

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

        it('with Category dataSource', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(seriesElements == 2).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].fill = 'blueviolet';
            chartObj.series[0].border.color = 'red';
            chartObj.series[0].border.width = 2;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = -1;
            chartObj.primaryYAxis.maximum = 5;
            chartObj.primaryYAxis.interval = 0.5;
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
                expect(seriesElements.getAttribute('fill') == 'red').toBe(true);
                expect(seriesElements.getAttribute('stroke') == 'green').toBe(true);
                expect(seriesElements.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dashArray = null;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].border.width = 2;
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: number = document.getElementById('containerSymbolGroup0').childNodes.length;
                expect(series1 == 25).toBe(true);
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker.getAttribute('stroke') == 'red').toBe(true);
                expect(marker.getAttribute('rx') == '2.5').toBe(true);
                expect(marker.getAttribute('ry') == '2.5').toBe(true);
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

        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'Jan').toBe(true);
                let axisStart: Element = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) < parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });

        it('Checking with category axis BetweenTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'Jan').toBe(true);
                let axisStart = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) > parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });


        it('Checking with category axis with plotoffset', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('containerAxisLine_0');
                expect(point != null).toBe(true);
                expect(point.getAttribute('y1') == '355.5' || point.getAttribute('y1') == '360.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.primaryXAxis.plotOffset = 5;
            chartObj.refresh();
        });


        it('Default Series Type with chart width', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_svg');
                expect(svg.clientWidth == 1000).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.width = '1000px';
            chartObj.refresh();
        });

        it('Checking with valuetype as dateTime', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'May').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datatime;
            chartObj.primaryYAxis.minimum = 50;
            chartObj.primaryYAxis.maximum = 210;
            chartObj.primaryYAxis.interval = 10;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.height = '500px';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });

        it('Checking with Months and its Round rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerAxisLabels0').childNodes[0].textContent == 'Mar').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Round';
            chartObj.refresh();

        });

        it('Checking with valuetype as logarthimic with logbase8', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                let axisLabel: Element = document.getElementById('container1_AxisLabel_3');
                expect(axisLabel.textContent == '32768').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.logBase = 8; chartObj.primaryXAxis.rangePadding = 'None';
            chartObj.primaryYAxis.minimum = 190;
            chartObj.primaryYAxis.maximum = 20000;
            chartObj.primaryYAxis.interval = null;
            chartObj.series[0].dataSource = logdata;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });

        it('checking with datalabel outer position', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y > element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = pointData;
            chartObj.primaryYAxis.minimum = -1;
            chartObj.primaryYAxis.maximum = 25;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.primaryYAxis.interval = null;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.width = '1200px';
            chartObj.height = '700px';
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.shape = 'Diamond';
            chartObj.series[0].marker.border = { color: 'red', width: 2 };
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });

        it('checking with datalabel auto position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('8.5');
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();
        });

        it('checking with datalabel top position', (done: Function) => {
            loaded = (args: Object): void => {
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                expect((<Points>(<Series>chartObj.series[0]).points[2]).symbolLocations[0].y < element1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });


        it('series selection ', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0');
                let series: Element = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(series).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                done();
            };
            chartObj.selectionMode = 'Series';
            chartObj.isMultiSelect = false;
            chartObj.loaded = loaded;
            //    chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Single point selection and UnSelection', (done: Function) => {
            loaded = () => {
                element = document.getElementById('container_Series_0_Point_1_Symbol');
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
                element = document.getElementById('container');
                trigger.draganddropEvent(element, 300, 100, 500, 100);
                element = document.getElementById(draggedRectGroup);
                expect(element.getAttribute('x') == '292').toBe(true);
                expect(element.getAttribute('y') == '42.25' || element.getAttribute('y') == '45.25');
                expect(element.getAttribute('height') == '560.25' || element.getAttribute('height') == '568.25').toBe(true);
                expect(element.getAttribute('width')).toEqual('200');
                done();
            };
            chartObj.selectionMode = 'DragX';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Selection mode DragY', (done: Function) => {
            loaded = () => {
                element = document.getElementById('container');
                trigger.draganddropEvent(element, 300, 100, 500, 240);
                element = document.getElementById(draggedRectGroup);
                expect(element.getAttribute('x') == '73.5' || element.getAttribute('x') == '72.5' || element.getAttribute('x') == '53.5'
                    || element.getAttribute('x') == '68.5' || element.getAttribute('x') == '57.5').toBe(true);
                expect(element.getAttribute('y')).toEqual('92');
                expect(element.getAttribute('height') == '140').toBe(true);
                expect(element.getAttribute('width') == '1116.5' || element.getAttribute('width') == '1132.5'
                    || element.getAttribute('width') == '1117.5' || element.getAttribute('width') == '1121.5' ||
                    element.getAttribute('width') == '1136.5').toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('Selection mode DragXY', (done: Function) => {
            loaded = () => {
                element = document.getElementById('container');
                trigger.draganddropEvent(element, 300, 500, 700, 100);
                element = document.getElementById(draggedRectGroup);
                expect(element.getAttribute('x') == '292').toBe(true);
                expect(element.getAttribute('y')).toEqual('92');
                expect(element.getAttribute('height') == '400').toBe(true);
                expect(element.getAttribute('width')).toEqual('400');
                trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
                done();
            };
            chartObj.dragComplete = (args: IDragCompleteEventArgs) => {
                chartObj.dragComplete = null;
                expect(args.selectedDataValues.length).toBe(1);
            };
            chartObj.selectionMode = 'DragXY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('checking with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + 10 + parseFloat(chartArea.getAttribute('y')) + (element.offsetTop || 0);
                let x: number = series.points[1].regions[0].x + 15 + parseFloat(chartArea.getAttribute('x')) + (element.offsetLeft || 0);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('IndiaFebHigh : 6.3Low : 1.3');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });

        it('Tooltip with given label format', (done: Function) => {
            let target: Element;
            let tooltip: Element;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = false;
            chartObj.tooltip.fill = 'pink';
            chartObj.tooltip.textStyle.color = 'red';
            chartObj.tooltip.format = '${series.name}  <br/> x : ${point.x} <br/> High : ${point.high} <br/> Low : ${point.low} <br/>';
            chartObj.loaded = (args: Object): void => {
                let target: Element = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + 10 + parseFloat(chartArea.getAttribute('y')) + (element.offsetTop || 0);
                let x: number = series.points[1].regions[0].x + 15 + parseFloat(chartArea.getAttribute('x')) + (element.offsetLeft || 0);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: Element = <Element>tooltip.childNodes[0].childNodes[0];
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: Element = group.childNodes[1] as HTMLElement;
                expect(path.getAttribute('fill') == 'pink').toBe(true);
                expect((<HTMLElement>text1.childNodes[0]).getAttribute('fill') == 'red').toBe(true);
                done();
            };
            chartObj.refresh();

        });

        it('checking with track ball', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[3].regions[0].y + 10 + parseFloat(chartArea.getAttribute('y')) + (element.offsetTop || 0);
                let x: number = series.points[3].regions[0].x + 15 + parseFloat(chartArea.getAttribute('x')) + (element.offsetLeft || 0);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetTop < y + series.points[3].regions[0].height).toBe(true);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });

        it('checking with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + 10 + parseFloat(chartArea.getAttribute('y')) + (element.offsetTop || 0);
                let x: number = series.points[2].regions[0].x + 15 + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + (element.offsetLeft || 0);
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[4];
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') != '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') != '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                //expect(element1.textContent == '6.700' || element1.textContent == '6.708').toBe(true);
                expect(element1.textContent == '8.367' || element1.textContent == '8.321' || element1.textContent == '8.336' || element1.textContent == '8.326').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = null;
            chartObj.refresh();
        });

        it('Checking with category(high and low) null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource[4].high = null;
            chartObj.series[0].dataSource[4].low = null;
            chartObj.refresh();
        });

        it('Checking with low value higher than high value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0');
                expect(point != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.primaryYAxis.minimum = -30;
            chartObj.primaryYAxis.maximum = 250;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    name: 'series1', type: 'RangeArea', animation: { enable: false },
                },
            ];
            chartObj.series[0].dataSource[0].high = 44;
            chartObj.series[0].dataSource[0].low = 29;
            chartObj.refresh();
        });


        it('Checking data label for low > high for negative points', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(label.textContent).toEqual('-5');
                label = document.getElementById('container_Series_0_Point_3_Text_0');
                expect(label.textContent).toEqual('202');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.width = 10;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].dataSource[0].high = -19;
            chartObj.series[0].dataSource[0].low = -5;
            chartObj.refresh();
        });

        it('checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) !== series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    name: 'series1', type: 'RangeArea', animation: { enable: false }
                },
                {
                    dataSource: doubleData1, xName: 'x', high: 'high', low: 'low', fill: 'blueviolet', opacity: 0.5, border: { width: 1, color: 'pink' },
                    name: 'series2', type: 'RangeArea', animation: { enable: false }
                }
            ];
            chartObj.refresh();
        });

        it('Legend Shape type', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('path');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'RangeArea';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });

        it('Custom Legend Shape type', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('path');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'RangeArea';
            chartObj.series[0].legendShape = 'Diamond';
            chartObj.legendSettings = { visible: true, };
            chartObj.refresh();
        });
        it('Checking negativeDataPoint', (done: Function) => {
            loaded = (args: Object): void => {
                let series: Series = <Series>chartObj.series[0];
                let axisLabel: Element = document.getElementById('container1_AxisLabel_0');
                expect(series.points[1].regions[0].y < parseFloat(axisLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Legend Interaction with selection and non selection', (done: Function) => {
            loaded = (args: Object) => {
                chartObj.loaded = null;
                let element: HTMLElement = document.getElementById('container_chart_legend_text_0');
                trigger.clickEvent(element);
                let element1: number = document.getElementById('containerSeriesCollection').children.length;
                expect(element1 == 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Legend position', (done: Function) => {
            loaded = (args: Object) => {
                let legendElement: HTMLElement = document.getElementById('container_chart_legend_element');
                expect(parseInt(legendElement.getAttribute('y'), 10) == 46 ||
                    parseInt(legendElement.getAttribute('y'), 10) == 43).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });

        it('Legend alignment', (done: Function) => {
            loaded = (args: Object) => {
                let legendElement: HTMLElement = document.getElementById('container_chart_legend_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(10);
                expect(parseInt(legendElement.getAttribute('y'), 10) == 46 ||
                    parseInt(legendElement.getAttribute('y'), 10) == 43).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.alignment = 'Near';
            chartObj.refresh();
        });
       

        it('Checking with category axis with multiple panes- rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('y1') == '359.375').toBe(true);
                svg = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('y1') == '79.25' || svg.getAttribute('y1') == '75.25').toBe(true);
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
                    dataSource: doubleData1, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'RangeArea', animation: { enable: false },
                    fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    marker: {
                        visible: true,
                        height: 10, width: 10,
                        shape: 'Pentagon', border: { color: 'red', width: 2 },
                        dataLabel: { visible: true, position: 'Outer' }
                    },
                },
                {
                    dataSource: doubleData2, xName: 'x', high: 'high', low: 'low',
                    name: 'series2', type: 'RangeArea', animation: { enable: false }, yAxisName: 'yAxis1',
                    fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    marker: {
                        visible: true,
                        height: 10, width: 10,
                        shape: 'Pentagon', border: { color: 'red', width: 2 },
                        dataLabel: { visible: true, position: 'Outer' }
                    },
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
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryXAxis.minimum = -1;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.refresh();
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
            chartObj.legendSettings.alignment = 'Near';
            chartObj.refresh();
        });

        it('Animation enabling with isTransposed', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_svg');
                expect(svg.clientWidth == 1200).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.duration = 4000;
            chartObj.series[0].animation.delay = 300;

            chartObj.refresh();
        });

        it('Animation enabling without isTransposed', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_svg');
                expect(svg.clientWidth == 1200).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;

            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('checking with multiple different series ', (done: Function) => {

            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) !== series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.primaryXAxis.interval = 1;

            chartObj.primaryYAxis.minimum = -30;
            chartObj.primaryYAxis.maximum = 70;
            chartObj.primaryYAxis.interval = 5;

            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'RangeArea', animation: { enable: false },
                    fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    marker: {
                        visible: true,
                        height: 10, width: 10,
                        shape: 'Pentagon', border: { color: 'red', width: 2 },
                        dataLabel: { visible: true, position: 'Outer' }
                    },
                },
                {
                    dataSource: lineData, width: 2,
                    xName: 'x', yName: 'y',
                    name: 'India',
                    //Series type as line
                    type: 'Line',
                    fill: 'red', opacity: 0.5, border: { width: 1, color: 'green' },
                    marker: {
                        visible: true,
                        height: 10, width: 10,
                        shape: 'Pentagon', border: { color: 'red', width: 2 },
                        dataLabel: { visible: true, position: 'Outer' }
                    },
                }
            ];
            chartObj.refresh();
        });
    });
    describe('checking for multiple axes', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let marker0: HTMLElement;
        let dataLabel0: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();

        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    axes: [
                        { name: 'yAxis1', title: 'YAxis1', crosshairTooltip: { enable: true } },
                        { name: 'yAxis2', title: 'YAxis2', crosshairTooltip: { enable: true } },
                        { rowIndex: 1, name: 'yAxis3', title: 'YAxis3' },
                        { rowIndex: 1, name: 'yAxis4', title: 'YAxis4' },
                        { columnIndex: 1, name: 'yAxis6', title: 'YAxis6', opposedPosition: true },
                        { columnIndex: 1, name: 'yAxis5', title: 'YAxis5', opposedPosition: true },
                        { rowIndex: 1, columnIndex: 1, name: 'yAxis7', title: 'YAxis7', opposedPosition: true },
                        { rowIndex: 1, columnIndex: 1, name: 'yAxis8', title: 'YAxis8', opposedPosition: true },
                        { name: 'xAxis1', title: 'Xaxis1', crosshairTooltip: { enable: true } },
                        { name: 'xAxis2', title: 'Xaxis2', crosshairTooltip: { enable: true } },
                        { columnIndex: 1, name: 'xAxis3', title: 'Xaxis3' },
                        { columnIndex: 1, name: 'xAxis4', title: 'Xaxis4' },
                        { rowIndex: 1, name: 'xAxis5', title: 'Xaxis5', opposedPosition: true },
                        { rowIndex: 1, name: 'xAxis6', title: 'Xaxis6', opposedPosition: true },
                        { columnIndex: 1, rowIndex: 1, name: 'xAxis7', title: 'Xaxis7', opposedPosition: true },
                        { columnIndex: 1, rowIndex: 1, name: 'xAxis8', title: 'Xaxis8', opposedPosition: true, },
                    ],
                    series: [{
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameGold', fill: 'green',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', yName: 'low', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'red',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeArea',
                        name: 'ChartSeriesNameGold1', fill: 'black',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameSilver', fill: 'green',
                        xAxisName: 'xAxis6', yAxisName: 'yAxis3',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false },
                        type: 'RangeArea',
                        name: 'ChartSeriesNameRuby', fill: 'red',
                        xAxisName: 'xAxis5', yAxisName: 'yAxis4',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeArea',
                        name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)',
                        xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeArea',
                        name: 'ChartSeriesNameEmerald', fill: 'purple',
                        xAxisName: 'xAxis4', yAxisName: 'yAxis6',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNamePearl', fill: 'violet',
                        xAxisName: 'xAxis7', yAxisName: 'yAxis7'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false },
                        type: 'RangeColumn',
                        name: 'ChartSeriesNameCoral', fill: 'yellow',
                        xAxisName: 'xAxis8', yAxisName: 'yAxis8',

                    }
                    ],
                    rows: [
                        { height: '400', border: { width: 2, color: 'red' } },
                        { height: '400', border: { width: 2, color: 'red' } },

                    ],
                    columns: [
                        { width: '400', border: { width: 2, color: 'black' } },
                        { width: '400', border: { width: 2, color: 'black' } },
                    ], legendSettings: { visible: false },
                    title: 'Chart TS Title', height: '1000', width: '1000',

                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with axes', (done: Function) => {
            loaded = (args: Object): void => {
                let axis1: Element = document.getElementById('containerAxisLine_2');
                let axisCollection: Element = document.getElementById('containerAxisInsideCollection');
                expect(+axisCollection.childElementCount).toEqual(17);
                let seriesCollection: Element = document.getElementById('containerSeriesCollection');
                expect(+seriesCollection.childElementCount).toEqual(11);

                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[5];
                let clipRect0 = series0.clipRect.y;
                let clipRect1 = series1.clipRect.y;
                expect(+clipRect0 > +clipRect1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Inversed Range Area Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let element2: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element2);
            chartObj = new Chart({
                primaryXAxis: {
                    title: 'Month',
                },
                primaryYAxis: {
                    title: 'Temperature(Celsius)'
                },
                series: [{
                    dataSource: doubleData,
                    xName: 'x', low: 'low', high: 'high',
                    animation: { enable: false },
                    name: 'India',
                    type: 'RangeArea', marker: { visible: true, dataLabel: { visible: true } },
                }],
                width: '800',
                title: 'Chart TS Title', legendSettings: { visible: true }
            });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });
        it('Checking inversed range area series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                let bounds: ClientRect = svg.getBoundingClientRect();
                expect(Math.round(bounds.top) == 80 || Math.round(bounds.top) == 82).toBe(true);
                expect(bounds.left == 92.5 || bounds.left == 86.5).toBe(true);
                expect(bounds.width == 705.5 || bounds.width == 711.5).toBe(true);
                expect(Math.round(bounds.height) == 238 || Math.round(bounds.height) == 232).toBe(true);
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('y');
                expect(Math.round(element1) == 92 || Math.round(element1) == 91 || Math.round(element1) == 94).toBe(true);
                element1 = +document.getElementById('container_Series_0_Point_2_Text_1').getAttribute('y');
                expect(Math.round(element1) == 53 || Math.round(element1) == 56 || Math.round(element1) == 69 || Math.round(element1) == 67).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();

        });

        it('Checking transposed range area series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                let bounds: ClientRect = svg.getBoundingClientRect();
                expect(bounds.top == 50.25 || bounds.top == 53.25).toBe(true);
                expect(bounds.left == 110.62692260742188 || bounds.left == 109.69615173339844
                    || bounds.left == 106.90384674072266).toBe(true);
                expect(bounds.width == 636.2461547851562 || bounds.width == 637.107666015625
                    || bounds.width == 639.6922607421875).toBe(true);
                expect(bounds.height == 318.75 || bounds.height == 318.25 || bounds.height == 310.25).toBe(true);
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('x');
                expect(Math.round(element1) == 549 || Math.round(element1) == 552 || Math.round(element1) == 550).toBe(true);
                element1 = +document.getElementById('container_Series_0_Point_2_Text_1').getAttribute('x');
                expect(Math.round(element1) == 607 || Math.round(element1) == 608 || Math.round(element1) == 610 || Math.round(element1) == 613).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.refresh();

        });

        it('Checking inversed & transposed range area series', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container_Series_0');
                let bounds: ClientRect = svg.getBoundingClientRect();
                expect(bounds.top == 50.25 || bounds.top == 53.25).toBe(true);
                expect(bounds.left == 110.62692260742188 || bounds.left == 109.69615173339844
                    || bounds.left == 106.90384674072266).toBe(true);
                expect(bounds.width == 636.2461547851562 || bounds.width == 637.107666015625
                    || bounds.width == 639.6922607421875).toBe(true);
                expect(bounds.height == 318.75 || bounds.height == 318.25 || bounds.height == 310.25).toBe(true);
                let element1: number = +document.getElementById('container_Series_0_Point_2_Text_0').getAttribute('x');
                expect(Math.round(element1) == 549 || Math.round(element1) == 552 || Math.round(element1) == 550).toBe(true);
                element1 = +document.getElementById('container_Series_0_Point_2_Text_1').getAttribute('x');
                expect(Math.round(element1) == 607 || Math.round(element1) == 608 || Math.round(element1) == 610 || Math.round(element1) == 613).toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.isTransposed = true;
            chartObj.refresh();

        });
    });

});
