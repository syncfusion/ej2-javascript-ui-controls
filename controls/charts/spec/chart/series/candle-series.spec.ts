/**
 * Candle Series Spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { ChartSeriesType, ChartRangePadding } from '../../../src/chart/utils/enum';
import { ValueType } from '../../../src/chart/utils/enum';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { tooltipData1, negativeDataPoint } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, ILegendRenderEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(ColumnSeries, CandleSeries, DataLabel, Category, DateTime, Legend, Tooltip, Crosshair, Logarithmic, Selection);
let prevent: Function = (): void => {
    //Prevent Function
};
export interface wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number
}
export let categoryData: any[] = [
    { x: 'USA', high: 125, low: 70, open: 115, close: 90 }, { x: 'China', high: 125, low: 70, open: 115, close: 90 },
    { x: 'Japan', high: 125, low: 70, open: 115, close: 90 }, { x: 'Australia', high: 125, low: 70, open: 115, close: 90 },
    { x: 'France1', high: 125, low: 70, open: 115, close: 90 }, { x: 'Germany1', high: 125, low: 70, open: 115, close: 90 },
    { x: 'Italy', high: 125, low: 70, open: 115, close: 90 }, { x: 'Sweden', high: 125, low: 70, open: 115, close: 90 }];
export let categoryDatarange: any[] = [
    { x: 'USA', low: -12, high: 0 }, { x: 'China', low: 12, high: 10 },
    { x: 'Japan', low: 23, high: 10 }, { x: 'Australia', low: 202, high: 43 },
    { x: 'France1', low: 0, high: 10 }, { x: 'Germany1', low: -22, high: 34 },
    { x: 'Italy', low: -12, high: 23 }, { x: 'Sweden', low: 12, high: 40 }];
export let doubleData: any[] = [
    { x: 1, low: -12, open: -5, close: -10, high: 0 }, { x: 2, low: 12, high: 10, open: 6, close: 15 },
    { x: 3, low: 23, high: 10, open: 15, close: 20 }, { x: 4, low: 202, high: 43, open: 130, close: 180 },
    { x: 5, low: 0, high: 10, open: 25, close: 35 }, { x: 6, low: -22, high: 34, open: -11, close: 44 },
    { x: 7, low: -12, high: 23, open: -6, close: 34 }, { x: 8, low: 12, high: 40, open: 24, close: 30 }];
export let logdata: any[] = [
    { x: new Date(1950, 1, 12), low: 100, open: 500, close: 700, high: 10000 },
    { x: new Date(1953, 1, 12), low: 232, open: 644, close: 878, high: 1233 },
    { x: new Date(2006, 1, 12), low: 0, open: 4500, close: 6000, high: 10342 },
    { x: new Date(2008, 1, 12), low: 120, open: 1200, close: 1900, high: 2300 },];
export let dateTimeData: any[] = [
    { x: new Date(1950, 1, 12), high: 125, low: 70, open: 115, close: 90 },
    { x: new Date(1953, 1, 12), high: 150, low: 60, open: 120, close: 70 },
    { x: new Date(2006, 1, 12), high: 170, low: 90, open: 140, close: 110 },
    { x: new Date(2008, 1, 12), high: 200, low: 100, open: 180, close: 120 }];

export let solidCandleData: any[] = [
    { x: 1, low: 40, open: 55, close: 70, high: 80 }, { x: 2, low: 30, high: 70, open: 55, close: 65 },
    { x: 3, low: 50, high: 90, open: 65, close: 80 }, { x: 4, low: 45, high: 90, open: 65, close: 75 },
];

describe('Candle Series ', () => {
    let element: HTMLElement;
    /**,
     * Default Candle Series
     */

    describe('Candle Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelIntersectAction :'Hide' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold',
                        type: 'Candle', fill: 'rgba(135,206,235,1)',
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
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                title: 'Subjects',
                valueType: 'Category',
                interval: 1
            };
            chartObj.primaryYAxis = {
                title: 'Marks',
                minimum: 10,
                maximum: 100,
                interval: 10
            };
            chartObj.series[0].dataSource = [
                { x: 3, high: 60, low: 20, open: 35, close: 50 },
            ];
            chartObj.series[0].high = 'high';
            chartObj.series[0].low = 'low';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].marker.dataLabel = { visible: true };
            chartObj.refresh();
        });

        it('With single data point', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('with datalabel normal position', (done: Function) => {
            loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                expect(Math.round(x0) === 363 || Math.round(x0) === 365).toBe(true);
                expect(Math.round(y0) === 148 || Math.round(y0) === 144).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 363 || Math.round(x1) === 365).toBe(true);
                expect(Math.round(y1) === 326 || Math.round(y1) === 322).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 363 || Math.round(x2) === 365).toBe(true);
                expect(Math.round(y2) === 209 || Math.round(y2) === 208).toBe(true);
                let x3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('x');
                let y3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('y');
                expect(Math.round(x3) === 363 || Math.round(x3) === 365).toBe(true);
                expect(Math.round(y3) === 246 || Math.round(y3) === 240).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('with yInversed datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                expect(Math.round(x0) === 363 || Math.round(x0) === 365).toBe(true);
                expect(Math.round(y0) === 209 || Math.round(y0) === 208).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 363 || Math.round(x1) === 365).toBe(true);
                expect(Math.round(y1) === 31 || Math.round(y1) === 30 || Math.round(y1) === 32).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 363 || Math.round(x2) === 365).toBe(true);
                expect(Math.round(y2) === 148 || Math.round(y2) === 144).toBe(true);
                let x3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('x');
                let y3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('y');
                expect(Math.round(x3) === 363 || Math.round(x3) === 365).toBe(true);
                expect(Math.round(y3) === 112 || Math.round(y3) === 114).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });

        it('with inverted datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                expect(Math.round(x0) === 421 || Math.round(x0) === 422 || Math.round(x0) === 423).toBe(true);
                expect(Math.round(y0) === 179 || Math.round(y0) === 176).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 71 || Math.round(x1) === 72).toBe(true);
                expect(Math.round(y1) === 179 || Math.round(y1) === 176).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 317 || Math.round(x2) === 318 || Math.round(x2) === 320).toBe(true);
                expect(Math.round(y2) === 179 || Math.round(y2) === 176).toBe(true);
                let x3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('x');
                let y3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('y');
                expect(Math.round(x3) === 216 || Math.round(x3) === 217).toBe(true);
                expect(Math.round(y3) === 179 || Math.round(y3) === 176).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.refresh();
        });

        it('with inverted and inversed datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                expect(Math.round(x0) === 317 || Math.round(x0) === 318 || Math.round(x0) === 320).toBe(true);
                expect(Math.round(y0) === 179 || Math.round(y0) === 176).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 667 || Math.round(x1) === 668 || Math.round(x1) === 671).toBe(true);
                expect(Math.round(y1) === 179 || Math.round(y1) === 176).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 421 || Math.round(x2) === 422 || Math.round(x2) === 423).toBe(true);
                expect(Math.round(y2) === 179 || Math.round(y2) === 176).toBe(true);
                let x3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('x');
                let y3: number = +document.getElementById('container_Series_0_Point_0_Text_3').getAttribute('y');
                expect(Math.round(x3) === 522 || Math.round(x3) === 523 || Math.round(x3) === 526).toBe(true);
                expect(Math.round(y3) === 179 || Math.round(y3) === 176).toBe(true);
                chartObj.loaded = null;
                chartObj.isTransposed = false;
                chartObj.primaryYAxis.isInversed = false;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });


        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 1).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 6).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 10;
            chartObj.primaryYAxis.maximum = 60;
            chartObj.primaryYAxis.interval = 10;
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


        it('With dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '1').toBe(true);
                let labelElement: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(labelElement.textContent == '1949').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                title: 'Date', valueType: 'DateTime', interval: 1, minimum: new Date(1949, 1, 1),
                maximum: new Date(2009, 1, 1), intervalType: 'Years'
            };
            chartObj.primaryYAxis =
                {
                    title: 'Price in Dollars', minimum: 0, maximum: 250, interval: 50, labelFormat: '${value}'
                };
            chartObj.series = [{
                dataSource: dateTimeData, xName: 'x', low: 'low', high: 'high',
                open: 'open', close: 'close',
                animation: { enable: false }, type: 'Candle',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            }];

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
                chartObj.series[0].animation.enable = false;
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.delay = 200;
            chartObj.refresh();
        });

        it('With default bearfillColor and bullfillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let fill: string = seriesElements.getAttribute('fill');
                expect(fill == '#2ecd71').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });


        it('Custom  bearfillColor and bullfillColor', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let seriesElements2: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let fill1: string = seriesElements1.getAttribute('fill');
                let fill2: string = seriesElements2.getAttribute('fill');
                expect(fill1 == 'blue').toBe(true);
                expect(fill2 == 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].bearFillColor = 'blue';
            chartObj.series[0].bullFillColor = 'red';
            chartObj.refresh();
        });

        it('With dash array', (done: Function) => {
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
        it('With enableSolidCandles', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let seriesElements2: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let fill1: string = seriesElements1.getAttribute('fill');
                let fill2: string = seriesElements2.getAttribute('fill');
                expect(fill1 == 'blue').toBe(true);
                expect(fill2 == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = { valueType: 'Double', minimum: 0, maximum: 5 };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].type = 'Candle';
            chartObj.series[0].dashArray = '';
            chartObj.series[0].dataSource = solidCandleData;
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].enableSolidCandles = true;
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
            chartObj.series[0].dataSource = categoryData;
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].enableSolidCandles = false;
            chartObj.primaryXAxis = {
                title: 'Subjects',
                valueType: 'Category',
                interval: 1
            };
            chartObj.primaryYAxis = {
                title: 'Marks',
                minimum: 10,
                maximum: 100,
                interval: 10
            };
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
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();
        });

        it('With empty point(y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = dateTimeData;
            dataSource[3].high = null;
            dataSource[3].low = null;
            dataSource[3].open = null;
            dataSource[3].close = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });

        it('With empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = dateTimeData;
            dataSource[3].high = 10;
            dataSource[3].low = 10;
            dataSource[3].open = 10;
            dataSource[3].close = 10;
            dataSource[3].x = null;

            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('With empty point(x and y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            let dataSource: any = dateTimeData;
            dataSource[3].high = null;
            dataSource[3].low = null;
            dataSource[3].open = null;
            dataSource[3].close = null;
            dataSource[3].x = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('With  stroke width', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_2');
                expect(seriesElements.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = doubleData;
            chartObj.series[0].dashArray = null;
            chartObj.series[0].border.width = 4;
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });

        it('Default legend shapes', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('path');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });

        it('Custom legend shapes', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('ellipse');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].legendShape = 'Circle';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });

        it('Single point selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_0');
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
            chartObj.refresh();
        });

        it('Single point multi selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_0');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                element = document.getElementById('container_Series_0_Point_1');
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

        it('Series selection ', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_0');
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
                let element: Element = document.getElementById('container_Series_0_Point_0');
                let element1: Element = document.getElementById('container_Series_1_Point_0');
                trigger.clickEvent(element);
                let selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                let selected1 = document.getElementsByClassName('container_ej2_chart_selection_series_1 ');
                expect(element1).toBe(<HTMLElement>selected1[0]);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = {
                title: 'Subjects',
                valueType: 'Double',
                maximum: 6,
                minimum: 0,
                interval: 1
            };
            chartObj.primaryYAxis = {
                title: 'Marks',
                minimum: 10,
                maximum: 100,
                interval: 10
            };
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    open: 'open', close: 'close',
                    type: 'Candle', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    open: 'open', close: 'close',
                    low: 'low', type: 'Candle', animation: { enable: false }
                }
            ];
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Checking with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('2High : $10Low : $12Open : $6Close : $15');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });

        it('Changing the visibility of tooltip with axis label format', (done: Function) => {
            let target: Element;
            let tooltip: Element;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = false;
            chartObj.tooltip.fill = 'pink';
            chartObj.tooltip.textStyle.color = 'red';
            chartObj.tooltip.format = null;
            chartObj.primaryYAxis.labelFormat = '{value}C';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.labelFormat = '#{value}';
            chartObj.loaded = (args: Object): void => {
                let target: Element = document.getElementById('container_Series_0_Point_1');
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
                expect(text1.textContent == '#2High : 10CLow : 12COpen : 6CClose : 15C').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();
            };
            chartObj.refresh();

        });

        it('Checking with track ball', (done: Function) => {
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
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

        it('Checking with low value higher than high value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = 44;
            chartObj.series[0].dataSource[0].low = 29;
            chartObj.refresh();
        });

        it('Checking with low value higher equal to high value', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point.getAttribute('d')).not.toBeNull();
                expect(point != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = 44;
            chartObj.series[0].dataSource[0].low = 44;
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

        it('Checking with datalabel outer position', (done: Function) => {
            loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');                
                expect(Math.round(x0) === 99).toBe(true);
                expect(Math.round(y0) === 203 || Math.round(y0) === 198).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 99).toBe(true); 
                expect(Math.round(y1) === 239 || Math.round(y1) === 237).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 99).toBe(true); 
                expect(Math.round(y2) === 430 || Math.round(y2) === 424).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = doubleData;
            chartObj.primaryYAxis.labelFormat = '{value}K';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].marker.dataLabel.border.color = 'red';
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.refresh();
        });

        it('Checking with datalabel auto position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let x0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let y0: number = +document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                expect(Math.round(x0) === 99).toBe(true);
                expect(Math.round(y0) === 203 || Math.round(y0) === 198).toBe(true);
                let x1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('x');
                let y1: number = +document.getElementById('container_Series_0_Point_0_Text_1').getAttribute('y');
                expect(Math.round(x1) === 99).toBe(true);
                expect(Math.round(y1) === 239 || Math.round(y1) === 237).toBe(true);
                let x2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('x');
                let y2: number = +document.getElementById('container_Series_0_Point_0_Text_2').getAttribute('y');
                expect(Math.round(x2) === 99).toBe(true);
                expect(Math.round(y2) === 422 || Math.round(y2) === 421 || Math.round(y2) === 414).toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = doubleData;
            chartObj.primaryYAxis.labelFormat = '{value}K';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.series[0].open = 'open';
            chartObj.series[0].close = 'close';
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.series[0].marker.dataLabel.border.color = 'red';
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.refresh();

        });

        it('Checking data label for low > high for negative points', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(label.textContent).toEqual('-5K');
                label = document.getElementById('container_Series_0_Point_0_Text_1');
                expect(label.textContent).toEqual('-19K');
                label = document.getElementById('container_Series_0_Point_0_Text_2');
                expect(label.textContent).toEqual('-9K');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].dataSource[0].high = -19;
            chartObj.series[0].dataSource[0].open = -9;
            chartObj.series[0].dataSource[0].close = -14;
            chartObj.series[0].dataSource[0].low = -5;
            chartObj.refresh();
        });

        it('Checking with cross hair', (done: Function) => {
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
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent).toEqual('#3');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent === '22.979K' || element1.textContent === '22.976K').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
        });

        it('Legend Interaction with selection and non selection', (done: Function) => {
            loaded = (args: Object) => {
                let element1: number = document.getElementById('containerSeriesCollection').children.length;
                expect(element1 === 4).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].name = 'series1';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });

        it('Default Series Type with chart width', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_svg');
                expect(svg.clientWidth == 800).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.width = '800px';
            chartObj.refresh();
        });

        it('Legend With Position', (done: Function) => {
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
            chartObj.series[0].type = 'Candle';
            chartObj.legendSettings = { visible: true, position: 'Top' };
            chartObj.refresh();
        });

        it('Legend With Alignment', (done: Function) => {
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
            chartObj.series[0].type = 'Candle';
            chartObj.legendSettings = { visible: true, alignment: 'Near' };
            chartObj.refresh();
        });

        it('Point Rendering Event', (done: Function) => {
            loaded = (args: Object) => {
                let element: HTMLElement = document.getElementById('container_Series_1_Point_0');
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
            chartObj.refresh();
        });

        it('Legend Rendering Event', (done: Function) => {
            loaded = (args: Object) => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                let legendtext: Element = document.getElementById('container_chart_legend_text_0');
                expect(legendtext.textContent === 'smkfrom');
                let legendshape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendshape.getAttribute('d') != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendRender = (args: ILegendRenderEventArgs): void => {
                args.text = 'smkfrom';
            };
            chartObj.legendSettings = { visible: true, alignment: 'Far' };
            chartObj.refresh();
        });


        it('Checking with category axis with multiple panes- rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('y1') == '389.5' || svg.getAttribute('y1') == '393.5').toBe(true);
                svg = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('y1') == '234.375').toBe(true);

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
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'Candle', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series2', type: 'Candle', animation: { enable: false }, yAxisName: 'yAxis1',
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
                expect(svg.getAttribute('x1') == '64.5' || svg.getAttribute('x1') == '62.5').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);

                svg = document.getElementById('container_AxisBottom_Column1');
                expect(svg.getAttribute('x1') == '464.5' || svg.getAttribute('x1') == '462.5').toBe(true);
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
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series1', type: 'Candle', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close',
                    name: 'series2', type: 'Candle', animation: { enable: false }, xAxisName: 'yAxis1',
                }
            ];

            chartObj.axes[0].columnIndex = 1;
            chartObj.axes[0].name = 'yAxis1';
            chartObj.axes[0].opposedPosition = true;
            chartObj.axes[0].minimum = 50;
            chartObj.axes[0].maximum = 130;
            chartObj.axes[0].interval = 10;
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.refresh();
        });

        it('Checking with category axis with plotoffset', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('containerSeriesGroup1');
                expect(point != null).toBe(true);
                expect(point.getAttribute('transform') == 'translate(464.5,259.625)' ||
                    point.getAttribute('transform') == 'translate(462.5,257.625)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.primaryXAxis.plotOffset = 5;
            chartObj.series[0].dataSource = doubleData;
            chartObj.refresh();
        });

        describe('Checking for multiple axes', () => {
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
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNameGold', fill: 'green',
                            xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                        },
                        {
                            dataSource: doubleData, xName: 'x', yName: 'low', animation: { enable: false }, type: 'Line',
                            name: 'ChartSeriesNameGold', fill: 'red',
                            xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNameGold1', fill: 'black',
                            xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNameDiamond', fill: 'blue',
                            xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNameSilver', fill: 'green',
                            xAxisName: 'xAxis5', yAxisName: 'yAxis3',
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false },
                            type: 'Candle',
                            name: 'ChartSeriesNameRuby', fill: 'red',
                            xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)',
                            xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNameEmerald', fill: 'purple',
                            xAxisName: 'xAxis4', yAxisName: 'yAxis6',
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false }, type: 'Candle',
                            name: 'ChartSeriesNamePearl', fill: 'violet',
                            xAxisName: 'xAxis7', yAxisName: 'yAxis7'
                        },
                        {
                            dataSource: doubleData, xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close',
                            animation: { enable: false },
                            type: 'Candle',
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

            it('Checking mouse wheel zooming', (done: Function) => {
                loaded = (args: Object): void => {
                    chartObj.loaded = null;
                    let wheelArgs: wheel = {
                        preventDefault: prevent,
                        wheelDelta: 120,
                        detail: 3,
                        clientX: 210,
                        clientY: 300
                    };
                    chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                    expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '1.00').toBe(true);
                    expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '1.00').toBe(true);
                    expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                    expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                    done();
                };
                chartObj.zoomSettings.enableMouseWheelZooming = true;
                chartObj.loaded = loaded;
                chartObj.refresh();
            });

            it('Checking  zooming with touch', (done: Function) => {
                loaded = (args: Object): void => {
                    chartObj.loaded = null;
                    let touchStartArgs: Object;
                    let areaElement = document.getElementById('container_svg');
                    chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                    chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                    chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                    let content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                    expect(content == '1.00').toBe(true);
                    content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                    expect(content == '1.00').toBe(true);
                    content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                    expect(content == '0.00' || content == '0.00').toBe(true);
                    chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.zoomSettings.enablePinchZooming = true;
                chartObj.refresh();
            });
        });
        describe('Checking for multiple series type', () => {
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
                        primaryXAxis: {
                            title: 'Date',
                            valueType: 'DateTime',
                            interval: 20,
                            minimum: new Date(1949, 1, 1),
                            maximum: new Date(2009, 1, 1),
                            intervalType: 'Years'
                        },
                        primaryYAxis: {
                            title: 'Price in Dollars',
                            minimum: 0,
                            maximum: 250,
                            interval: 50,
                            labelFormat: '${value}'
                        },
                        series: [
                            {
                                dataSource: [{ x: new Date(1950, 1, 12), high: 125, low: 70, open: 115, close: 90 },
                                { x: new Date(1953, 1, 12), high: 150, low: 60, open: 120, close: 70 },
                                { x: new Date(1956, 1, 12), high: 200, low: 140, open: 160, close: 190 },
                                { x: new Date(1959, 1, 12), high: 160, low: 90, open: 140, close: 110 },
                                { x: new Date(1962, 1, 12), high: 200, low: 100, open: 180, close: 120 },
                                { x: new Date(1965, 1, 12), high: 100, low: 45, open: 70, close: 50 },
                                { x: new Date(1968, 1, 12), high: 150, low: 70, open: 140, close: 130 },
                                { x: new Date(1971, 1, 12), high: 90, low: 60, open: 65, close: 80 },
                                { x: new Date(1974, 1, 12), high: 225, low: 170, open: 175, close: 220 },
                                { x: new Date(1977, 1, 12), high: 250, low: 180, open: 223, close: 190 },
                                { x: new Date(1980, 1, 12), high: 200, low: 140, open: 160, close: 190 },
                                { x: new Date(1983, 1, 12), high: 160, low: 90, open: 140, close: 110 },
                                { x: new Date(1986, 1, 12), high: 200, low: 100, open: 180, close: 120 },
                                { x: new Date(1989, 1, 1), high: 130, low: 95, open: 120, close: 100 },
                                { x: new Date(1991, 1, 12), high: 100, low: 70, open: 92, close: 75 },
                                { x: new Date(1994, 1, 12), high: 50, low: 85, open: 65, close: 80 },
                                { x: new Date(1997, 1, 12), high: 185, low: 110, open: 130, close: 170 },
                                { x: new Date(2000, 1, 12), high: 90, low: 30, open: 80, close: 50 },
                                { x: new Date(2003, 1, 12), high: 200, low: 140, open: 160, close: 190 },
                                { x: new Date(2006, 1, 12), high: 170, low: 90, open: 140, close: 110 },
                                { x: new Date(2008, 1, 12), high: 200, low: 100, open: 180, close: 120 }], xName: 'x', high: 'high', low: 'low',
                                open: 'open', close: 'close', type: 'Candle', animation: { enable: false }
                            },
                            {
                                dataSource: [{ x: new Date(1950, 1, 12), y: 50 }, { x: new Date(1953, 1, 12), y: 20 },
                                { x: new Date(2006, 1, 12), y: 80 },
                                { x: new Date(2008, 1, 12), y: 90 },], xName: 'x', yName: 'y',
                                type: 'Column', animation: { enable: false }
                            }
                        ]

                    });
                chartObj.appendTo('#container');
            });

            afterAll((): void => {
                chartObj.destroy();
                elem.remove();
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
                chartObj.refresh();
            });

            it('Checking with Months and its Round rangePadding', (done: Function) => {
                loaded = (args: Object): void => {
                    expect(document.getElementById('containerAxisLabels0').childNodes[0].textContent == '1949').toBe(true);
                    done();
                };
                chartObj.loaded = loaded;
                chartObj.primaryXAxis.rangePadding = 'Round';
                chartObj.refresh();
            });
        });
    });
});
export interface series1 {
    series: Series;
}