/**
 * HiloOpenClose Series Spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { HiloOpenCloseSeries } from '../../../src/chart/series/hilo-open-close-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { MouseEvents } from '../base/events.spec';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Legend } from '../../../src/chart/legend/legend';
import { ILegendRenderEventArgs } from '../../../src/common/model/interface';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents, tooltipData1 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DataLabel, Category, DateTime, Legend, HiloOpenCloseSeries, Tooltip, Crosshair, Logarithmic, Selection);

export let doubleData: any[] = [
    { x: 1, low: -12, high: 0, open: -1.22, close: -8.44 }, { x: 2, low: 12, high: 1, open: 5, close: 9 },
    { x: 3, low: 23, high: 10, open: 13, close: 20.44 }, { x: 4, low: 20, high: 43, open: 33.22, close: 21.44 },
    { x: 5, low: 0, high: 10, open: 5, close: 9 }, { x: 6, low: -22, high: 34, open: 3, close: 22 },
    { x: 7, low: -12, high: 23, open: 12, close: 4 }, { x: 8, low: 12, high: 40, open: 32, close: 15 }];

export let doubleData1: any[] = [
    { x: 1, low: 8, high: 20, open: 18, close: 12 }, { x: 2, low: 2, high: 18, open: 15, close: 9 },
    { x: 3, low: 23, high: 10, open: 13, close: 20.44 }, { x: 4, low: 20, high: 43, open: 33.22, close: 21.44 },
];

export let doubleData2: any[] = [
    { x: 1, low: 80, high: 120, open: 110, close: 90 }, { x: 2, low: 70, high: 95, open: 89, close: 82 },
    { x: 3, low: 55, high: 77, open: 73.22, close: 63.44 }, { x: 4, low: 60, high: 80, open: 77, close: 69 },
];

export let doubleData3: any[] = [
    { x: 11, low: 8, high: 20, open: 18, close: 12 }, { x: 12, low: 2, high: 18, open: 15, close: 9 },
    { x: 13, low: 23, high: 10, open: 13, close: 20.44 }, { x: 14, low: 20, high: 43, open: 33.22, close: 21.44 },
];

export let categoryData: any[] = [
    { x: 'USA', high: 125.45, low: 70.23, open: 112.22, close: 90.44 },
    { x: 'Austria', high: 150.99, low: 60.23, open: 120.55, close: 70.90 },
    { x: 'Germany', high: 200.19, low: 130.37, open: 160.13, close: 190.78 },
    { x: 'Swedan', high: 160.23, low: 90.16, open: 140.38, close: 110.24 },
    { x: 'France', high: 200.89, low: 100.23, open: 180.90, close: 120.29 },
    { x: 'China', high: 100, low: 45, open: 70, close: 50 },
    { x: 'Japan', high: 150, low: 70, open: 140, close: 130 },
    { x: 'London', high: 90, low: 60, open: 65, close: 80 },
    { x: 'Saudi', high: 225, low: 170, open: 175, close: 220 },
    { x: 'India', high: 250, low: 180, open: 223, close: 190 },
    { x: 'UK', high: 200.12, low: 140.69, open: 160.74, close: 190.28 },
];

let datatime: any[] = [
    { x: new Date(2000, 3, 21), high: 200.19, low: 130.37, open: 162.13, close: 178 },
    { x: new Date(2000, 6, 17), high: 163.23, low: 93.16, open: 133, close: 110.24 },
    { x: new Date(2000, 9, 18), high: 204.89, low: 104.23, open: 182.91213750, close: 114.29 },
    { x: new Date(2001, 3, 20), high: 152, low: 67, open: 143, close: 133 },
    { x: new Date(2001, 6, 25), high: 135.45, low: 70.23, open: 109.2234212222, close: 103.44 },
    { x: new Date(2001, 9, 30), high: 200.12, low: 140.69, open: 160.74, close: 180.28 }];

let logdata: any[] = [
    { x: 1, high: 900.19, low: 200.37, open: 762.13, close: 378 },
    { x: 2, high: 1163.23, low: 809.16, open: 1033, close: 909.24 },
    { x: 3, high: 5004.89, low: 2104.23, open: 4182.91213750, close: 2999.29 },
    { x: 4, high: 19152.35, low: 16967, open: 18043, close: 17133 },
];

let lineData: any[] = [
    { x: 1, y: 28 }, { x: 2, y: 25 }, { x: 3, y: 26 }, { x: 4, y: 27 },
    { x: 5, y: 32 }, { x: 6, y: 35 }, { x: 7, y: 30 }
];

export interface Wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number
}
let prevent: Function = (): void => {
    //Prevent Function
};

describe('Chart Control Series', () => {
    let element: HTMLElement;
    let trigger: MouseEvents = new MouseEvents();
    let legendRendering: EmitType<ILegendRenderEventArgs>;
    let animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * Default HiloOpenClose Series
     */

    describe('HiloOpenClose Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                    },
                    primaryYAxis: {
                        title: 'PrimaryYAxis',
                    },
                    series: [{
                        animation: { enable: false },
                        name: 'HiloOpenClose',
                        type: 'HiloOpenClose', fill: 'rgba(135,206,235,1)',
                    }],
                    width: '800',
                    title: 'Financial Analysis', loaded: loaded,
                    legendSettings: { visible: false, }

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
            chartObj.loaded = loaded; chartObj.refresh();

        });

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                title: 'Subjects',
                valueType: 'Category',
            };
            chartObj.primaryYAxis = {
                title: 'Marks',
                minimum: 10,
                maximum: 100,
                interval: 10
            };
            chartObj.series[0].dataSource = [
                { x: 'Science', high: 60, low: 20, open: 35, close: 45 },
            ];
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].marker.dataLabel = { visible: false };
            chartObj.refresh();
        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 1).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 6).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 1000;
            chartObj.series[0].dataSource = [
                { x: 'science', high: 3060, low: 220, open: 2335, close: 1945 },
            ];
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
                expect(seriesElements == 12).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = -100;
            chartObj.primaryYAxis.maximum = 260;
            chartObj.primaryYAxis.labelFormat = '${value}';
            chartObj.refresh();
        });

        it('checking with datalabel outer position', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(label.textContent).toEqual('$150.99');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });

        it('checking with datalabel auto position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('$200.19');
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();
        });

        it('Checking animationEvent', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();
        });

        it('Checking animation with duration', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.duration = 2000;
            chartObj.refresh();
        });

        it('Checking animation with delay', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.delay = 200;
            chartObj.refresh();
        });

        it('Checking with Category with default bullFillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container_Series_0_Point_0');
                let stroke: string = seriesElements.getAttribute('stroke');
                expect(stroke == '#e74c3d').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = false;
            chartObj.refresh();
        });

        it('Checking with category with default bearFillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container_Series_0_Point_2');
                let stroke: string = seriesElements.getAttribute('stroke');
                expect(stroke == '#2ecd71').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking with category with custom bearFillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container_Series_0_Point_2');
                let stroke: string = seriesElements.getAttribute('stroke');
                expect(stroke == 'yellow').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].bearFillColor = 'yellow';
            chartObj.refresh();
        });

        it('Checking with category with custom bullFillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container_Series_0_Point_0');
                let stroke: string = seriesElements.getAttribute('stroke');
                expect(stroke == 'orange').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].bullFillColor = 'orange';
            chartObj.refresh();
        });

        it('checking with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('HiloOpenCloseAustriaHigh : $150.99Low : $60.23Open : $120.55Close : $70.9');
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
            chartObj.tooltip.format = '${series.name}  <br/> x : ${point.x} <br/> High : ${point.high} <br/> Low : ${point.low} <br/> Open : ${point.open} <br/> Close: ${point.close}';
            chartObj.loaded = (args: Object): void => {
                let target: Element = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
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
                let target: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[3].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[3].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
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
                let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
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
                done();
            };
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
        });

        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'USA').toBe(true);
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
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'USA').toBe(true);
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
                expect(point.getAttribute('y1') == '393.5' || point.getAttribute('y1') == '389.5').toBe(true);
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
                let point: Element = document.getElementById('container_Series_0_Point_0');
                //    expect(point).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'May').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datatime;
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 1000;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
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
                let point: Element = document.getElementById('container_Series_0_Point_0');
                //  expect(point).toBe(true);
                let axisLabel: Element = document.getElementById('container1_AxisLabel_3');
                expect(axisLabel.textContent == '$512').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.logBase = 8; chartObj.primaryXAxis.rangePadding = 'None';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 20000;
            chartObj.series[0].dataSource = logdata;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = null;
            chartObj.refresh();
        });

        it('Checking with category(high and low) null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_1');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource[1].high = null;
            chartObj.series[0].dataSource[1].low = null;
            chartObj.refresh();
        });

        it('Checking with category (open and close) null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_2');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[2].open = null;
            chartObj.series[0].dataSource[2].close = null;
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
            chartObj.series[0].visible = true;
            chartObj.refresh();
        });

        it('checking with multiple series', (done: Function) => {
            chartObj.loaded = loaded;
            loaded = (args: Object): void => {
                let element: Element = document.getElementById('container_Series_0_Point_0');
                let element1: Element = document.getElementById('container_Series_1_Point_0');
                expect(element.getAttribute('d') != '').toBe(true);
                expect(element1.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.primaryYAxis.minimum = -30;
            chartObj.primaryYAxis.maximum = 100;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'HiloOpenClose', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series2', type: 'HiloOpenClose', animation: { enable: false }
                }
            ];
            chartObj.refresh();
        });

        it('Single point selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_5');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0');
                expect(element).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Single point multi selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_5');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                element = document.getElementById('container_Series_0_Point_3');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(2);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('series selection ', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_5');
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
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Cluster selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_5');
                let element1: Element = document.getElementById('container_Series_1_Point_5');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                let selected1: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_1 ');
                expect(element1).toBe(<HTMLElement>selected1[0]);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Checking with low value higher than high value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = 44;
            chartObj.series[0].dataSource[0].low = 29;
            chartObj.series[0].dataSource[0].open = 40;
            chartObj.series[0].dataSource[0].close = 32;
            chartObj.refresh();
        });

        it('Checking with low value higher equal to high value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = 44;
            chartObj.series[0].dataSource[0].low = 44;
            chartObj.series[0].dataSource[0].open = 44;
            chartObj.series[0].dataSource[0].close = 44;
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
            chartObj.series[0].type = 'HiloOpenClose';
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
            chartObj.series[0].type = 'HiloOpenClose';
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
                expect(legendElement.getAttribute('y') === '46.25' || legendElement.getAttribute('y') === '43.25').toBe(true);
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
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.alignment = 'Near';
            chartObj.refresh();
        });

       

        it('with yInversed datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });

        it('with inverted datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.refresh();
        });

        it('with inverted and inversed datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });

        it('resetting inverted and inversed datalabel changes', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.refresh();
        });



        it('Checking with category axis with multiple panes- rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('y1') == '234.375' || svg.getAttribute('y1') == '234.125').toBe(true);
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
                    dataSource: doubleData1, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'HiloOpenClose', animation: { enable: false }
                },
                {
                    dataSource: doubleData2, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series2', type: 'HiloOpenClose', animation: { enable: false }, yAxisName: 'yAxis1',
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
            chartObj.refresh();
        });

        it('Checking with category axis with multiple panes- column', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_AxisBottom_Column0');
                expect(svg.getAttribute('x1') == '59.5' || svg.getAttribute('x1') == '63.5').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);

                svg = document.getElementById('container_AxisBottom_Column1');
                expect(svg.getAttribute('x1') == '459.5' || svg.getAttribute('x1') == '463.5').toBe(true);
                expect(svg.getAttribute('stroke') == 'blue').toBe(true);
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
                    dataSource: doubleData1, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'HiloOpenClose', animation: { enable: false }
                },
                {
                    dataSource: doubleData3, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series2', type: 'HiloOpenClose', animation: { enable: false }, xAxisName: 'xAxis',
                }
            ];

            chartObj.axes[0].columnIndex = 1;
            chartObj.axes[0].name = 'xAxis';
            chartObj.axes[0].minimum = 11;
            chartObj.axes[0].maximum = 20;
            chartObj.axes[0].interval = 1;
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.refresh();
        });

        it('Point Rendering Event', (done: Function) => {
            loaded = (args: Object) => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_1');
                expect(element.getAttribute('fill')).toBe('#e74c3d');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.pointRender = (args: IPointRenderEventArgs): void => {
                if (args.point.index === 0) {
                    args.fill = 'red';
                }
            }
            chartObj.legendSettings.alignment = 'Near';
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

        it('checking with log axis with dataTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let axisLabelLast: Element = document.getElementById('container0_AxisLabel_4');
                expect(axisLabelLast.textContent == '27').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50000;
            chartObj.series = [
                {
                    type: 'HiloOpenClose', name: 'Series1', xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                    dataSource: [
                        { x: new Date(1, 0, 2000), low: 100, high: 900, open: 725.22, close: 190.44 },
                        { x: new Date(1, 0, 2001), low: 1020, high: 2000, open: 1725.22, close: 1290.44 },
                        { x: new Date(1, 0, 2002), low: 3032, high: 6233, open: 5125.22, close: 3330.44 },
                        { x: new Date(1, 0, 2003), low: 5002, high: 10003, open: 8025.22, close: 6990.44 },
                        { x: new Date(1, 0, 2004), low: 5000, high: 15342, open: 11125.22, close: 7890.44 }],
                }];
            chartObj.refresh();

        });

        it('checking with multiple different series ', (done: Function) => {
            chartObj.loaded = loaded;
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect(series0.type === 'HiloOpenClose' || series1.type === 'Line').toBe(true);
                done();
            };

            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryYAxis.minimum = -30;
            chartObj.primaryYAxis.maximum = 70;
            chartObj.primaryYAxis.interval = 5;
            chartObj.loaded = loaded;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'HiloOpenClose', animation: { enable: false }
                },
                {
                    dataSource: lineData, width: 2,
                    xName: 'x', yName: 'y',
                    name: 'India',
                    //Series type as line
                    type: 'Line'
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
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNameGold', fill: 'green',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', yName: 'low', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'red',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNameGold1', fill: 'black',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNameSilver', fill: 'green',
                        xAxisName: 'xAxis5', yAxisName: 'yAxis3',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false },
                        type: 'HiloOpenClose',
                        name: 'ChartSeriesNameRuby', fill: 'red',
                        xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)',
                        xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNameEmerald', fill: 'purple',
                        xAxisName: 'xAxis4', yAxisName: 'yAxis6',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false }, type: 'HiloOpenClose',
                        name: 'ChartSeriesNamePearl', fill: 'violet',
                        xAxisName: 'xAxis7', yAxisName: 'yAxis7'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close', animation: { enable: false },
                        type: 'HiloOpenClose',
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
        it('checking with Multiple Series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect(series0.type === 'HiloOpenClose' || series1.type === 'Column').toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                    name: 'series1', type: 'HiloOpenClose', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                    name: 'series2', type: 'Column', animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
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
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.05').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
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
                expect(content == '0.33' || content == '0.35' || content == '0.34').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00' || content == '0.88' || content === '0.86').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.72' || content == '0.71' || content == '0.73').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });


    });

});
