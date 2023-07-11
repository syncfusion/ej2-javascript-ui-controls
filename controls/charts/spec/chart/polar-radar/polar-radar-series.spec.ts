/**
 * Specifies the  Scatter series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { getElement, ChartLocation } from '../../../src/common/utils/helper';
import { DataLabel } from '../../../src/chart/series/data-label';
import { PolarSeries } from '../../../src/chart/series/polar-series';
import { RadarSeries } from '../../../src/chart/series/radar-series';
import { SplineAreaSeries } from '../../../src/chart/series/spline-area-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { RangeColumnSeries } from '../../../src/chart/series/range-column-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { StackingAreaSeries } from '../../../src/chart/series/stacking-area-series';
import { ScatterSeries } from '../../../src/chart/series/scatter-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series } from '../../../src/chart/series/chart-series';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { SplineSeries } from '../../../src/chart/series/spline-series';
import { Legend } from '../../../src/chart/legend/legend';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { loaded, chartMouseUp, load } from '../../../src/common/model/constants';
import { tool1, tool2, datetimeData, negativeDataPoint } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/chart/model/chart-interface';
Chart.Inject(DateTime, SplineAreaSeries, ScatterSeries, StackingAreaSeries, Selection, RangeColumnSeries, LineSeries, Category, Tooltip, AreaSeries, Logarithmic, PolarSeries, RadarSeries, DataLabel, Legend, SplineSeries);
let data: any = tool1;
let data2: any = tool2;
let datetime: any = datetimeData;
export let categoryData: Object[] = [{ x: 'USA', y: 50 }, { x: 'China', y: 40 },
{ x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
{ x: 'France', y: 50 }, { x: 'Germany', y: null },
{ x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }];
export interface Arg {
    chart: Chart;
}

export interface series1 {
    series: Series;
}

export let categoryData1: any[] = [
    { x: 'USA', low: -12, high: 0 }, { x: 'China', low: 12, high: 10 },
    { x: 'Japan', low: 23, high: 10 }, { x: 'Australia', low: 202, high: 43 },
    { x: 'France1', low: 0, high: 10 }, { x: 'Germany1', low: -22, high: 34 },
    { x: 'Italy', low: -12, high: 23 }, { x: 'Sweden', low: 12, high: 40 }];

export let doubleData: any[] = [
    { x: 1, low: -12, high: 0 }, { x: 2, low: 12, high: 10 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 202, high: 43 },
    { x: 5, low: 0, high: 10 }, { x: 6, low: -22, high: 34 },
    { x: 7, low: -12, high: 23 }, { x: 8, low: 12, high: 40 }];
export let dateTimeData: any[] = [
    { x: new Date(1, 0, 2000), low: -12, high: 0 }, { x: new Date(1, 0, 2001), low: 12, high: 10 },
    { x: new Date(1, 0, 2002), low: 23, high: 10 }, { x: new Date(1, 0, 2003), low: 202, high: 43 },
    { x: new Date(1, 0, 2004), low: 0, high: 10 }, { x: new Date(1, 0, 2005), low: -22, high: 34 },
    { x: new Date(1, 0, 2006), low: -12, high: 23 }, { x: new Date(1, 0, 2007), low: 12, high: 40 }];

describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ele: HTMLElement;
    let elem: HTMLElement;
    let svg: HTMLElement;
    let trigger: MouseEvents = new MouseEvents();
    let text: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    let animationComplete: EmitType<IAnimationCompleteEventArgs>;
    describe('Polar-Radar series', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            elem = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    series: [{
                        dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Line', //name: 'Polar-Radar'
                    }],
                    legendSettings: { visible: true, position: 'Right' }
                },
            );
            chartObj.appendTo('#chartContainer');

        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with line series marker for polar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('touch Tooltip', (done: Function) => {

            loaded = (args: Arg): void => {
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let target: Element = getElement('chartContainer_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[1].regions[0].y + rect.top;
                let x: number = series.points[1].regions[0].x + rect.left;
                chartObj.isTouch = true;
                chartObj.mouseEnd(trigger.onTouchEnd(target, 0, 0, 150, 150, x, y) as PointerEvent);

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.legendSettings.visible = false;
            chartObj.refresh();
        });
        it('default Tooltip', (done: Function) => {

            chartObj.loaded = null;
            let rect: ClientRect = chartObj.element.getBoundingClientRect();
            let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_2_Symbol');
            let series: Series = <Series>chartObj.series[0];

            let y: number = series.points[2].regions[0].y + rect.top;
            let x: number = series.points[2].regions[0].x + rect.left;
            trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

            let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
            expect(tooltip !== null).toBe(true);

            target = document.getElementById('chartContainer_Series_0_Point_3_Symbol');
            series = <Series>chartObj.series[0];

            y= series.points[2].regions[0].y + rect.top;
            x  = series.points[2].regions[0].x + rect.left;
            trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

            tooltip = document.getElementById('chartContainer_tooltip');
            expect(tooltip !== null).toBe(true);
            trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
            done();
            
        });
        it('Shared Tooltip', (done: Function) => {

            loaded = (args: Arg): void => {
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[0].regions[0].y + rect.top;
                let x: number = series.points[0].regions[0].x + rect.left;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                let element: HTMLElement = document.getElementById('chartContainer_tooltip_path');
                expect(element.getAttribute('d') !== null).toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });
        it('Checking with line series marker for radar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                done();

            }; 
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].type = 'Radar';
            chartObj.tooltip.shared = false;
            chartObj.refresh();
        });
        it('Checking line series datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele.textContent === '70').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking line series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });
        it('Checking line series with null points', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5_Symbol');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking line series with null points and emptypointmode as drop', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele.getAttribute('d').indexOf('M') === 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Drop';
            chartObj.refresh();
        });
        it('Checking line series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking line series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking line series with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Symbol');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('cy') > Positivelabel.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking line series with isClosed false', (done: Function) => {
            loaded = (args: Object): void => {
                document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].isClosed = false;
            chartObj.refresh();
        });
        it('Checking line series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 5 }];
            chartObj.refresh();
        });
        it('Checking with spline series marker for polar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].drawType = 'Spline';
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('default spline Tooltip', (done: Function) => {

            loaded = (args: Arg): void => {
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_2_Symbol');
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[2].regions[0].y + rect.top;
                let x: number = series.points[2].regions[0].x + rect.left;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.legendSettings.visible = false;
            chartObj.refresh();
        });
        it('Shared spline Tooltip', (done: Function) => {

            loaded = (args: Arg): void => {
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[0].regions[0].y + rect.top;
                let x: number = series.points[0].regions[0].x + rect.left;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });
        it('Checking with spline series marker for radar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].type = 'Radar';
            chartObj.tooltip.shared = false;
            chartObj.refresh();
        });
        it('Checking spline series datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele.textContent === '70').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking spline series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });

        it('Checking spline series with null points', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5_Symbol');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Gap';
            chartObj.refresh();
        });
        it('Checking spline series with null points and emptypointmode as drop', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele.getAttribute('d').indexOf('M') === 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Drop';
            chartObj.refresh();
        });
        it('Checking spline series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking spline series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking spline series with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Symbol');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('cy') > Positivelabel.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking spline series with cartesian area type', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Line';
            chartObj.refresh();
        });
        it('Checking spline series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.series[0].dataSource = [{ x: 1, y: 5 }];
            chartObj.refresh();
        });
        it('Checking with area series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Symbol');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele.textContent === '70').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].drawType = 'Area';
            chartObj.refresh();
        });
        it('Checking with area as draw type', function (done) {
            loaded = function (args) {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele.getAttribute('d').indexOf('Z') > 0 ).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].drawType = 'Area';
            chartObj.refresh();
        });
        it('Checking area series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();
        });
        it('Checking area series with category axis and onticks placement', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer0_AxisLabel_1');
                expect(ele.textContent === 'China').toBe(true);
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking area series with null', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5_Symbol');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking area series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking area series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking area series with negative point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Symbol');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('cy') > Positivelabel.getAttribute('y')).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking area series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 4 }];
            chartObj.refresh();
        });


        it('Checking with stacking area series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Symbol');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele.textContent === '70').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].drawType = 'StackingArea';
            chartObj.refresh();
        });
        it('Checking stacking area series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();
        });
        it('Checking stacking area series with category axis and onticks placement', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer0_AxisLabel_1');
                expect(ele.textContent === 'China').toBe(true);
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking stacking area series with null', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5_Symbol');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking stacking area series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking stacking area series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking stacking area series with negative point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Symbol');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('cy') > Positivelabel.getAttribute('y')).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking stacking area series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 4 }];
            chartObj.refresh();
        });
        it('Checking with scatter series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'Scatter';
            chartObj.series[0].marker.visible = false;
            chartObj.series[0].dataSource = tool1;
            chartObj.refresh();
        });
        it('Checking with scatter series marker width height', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.height = 20;
            chartObj.series[0].marker.width = 20;
            chartObj.refresh();
        });
        it('Checking scatter series datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_2');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });
        it('Checking scatter series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });
        it('Checking scatter series with category axis on Ticks', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer0_AxisLabel_1');
                expect(ele.textContent === 'China').toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking scatter series with null', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5_Symbol');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking scatter series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking scatter series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking scatter series with negative point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('y') > Positivelabel.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking scatter series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 5 }];
            chartObj.refresh();
        });
        it('Checking with column series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].drawType = 'Column';
            chartObj.refresh();
        });
        it('default Tooltip for column', (done: Function) => {
            loaded = (args: Arg): void => {
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_6');
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[6].symbolLocations[0].y + rect.top;
                let x: number = series.points[6].symbolLocations[0].x + rect.left;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                expect(target.getAttribute('opacity') === '0.5').toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });
        it('Checking with column series rendering for radar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking column series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].type = 'Polar';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });
        it('Checking column series with category axis on Ticks', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking column series with null point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking column series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking column series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking column series with negative point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                let Positivelabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_3');
                expect(ele.getAttribute('y') > Positivelabel.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking datalabel for column outer', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Checking datalabel for column Top', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('Checking datalabel for column Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_1');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });
        it('Checking datalabel for column Middle', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Checking datalabel for column Auto', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 70;
            chartObj.refresh();
        });
        it('Checking datalabel and marker', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0_Symbol');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('Checking column series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.rangePadding = 'Normal';
            chartObj.series[0].marker.visible = false;
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 5 }];
            chartObj.refresh();
        });
        it('Checking datalabel with axis interval', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele.getAttribute('x') === '464.70201785076335' || ele.getAttribute('x') === '575.34846446017' 
                || ele.getAttribute('x') === '696.9949110695768' || ele.getAttribute('x') === '458.70201785076335'
                || ele.getAttribute('x') === '711.84846446017' || ele.getAttribute('x') === '464.20201785076335').toBe(true);
                expect(ele.getAttribute('y') === '154.67298214923667' || ele.getAttribute('y') ==='155.02653553982995' 
                || ele.getAttribute('y') === '155.3800889304232' || ele.getAttribute('y') === '153.92298214923667').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.primaryXAxis.interval = 2;
            chartObj.refresh();
        });
        it('Checking with rangecolumn series rendering', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.interval = null; 
            chartObj.series[0].dataSource = doubleData;
            chartObj.series[0].drawType = 'RangeColumn';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
            chartObj.refresh();
        });
        it('default Tooltip for rangecolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_4');
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[4].symbolLocations[0].y;
                let x: number = series.points[4].symbolLocations[0].x;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                expect(target.getAttribute('opacity') === '0.5').toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
        });
        it('Checking with rangecolumn series rendering for radar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking rangecolumn series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = categoryData1;
            chartObj.series[0].type = 'Polar';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.refresh();
        });
        it('Checking rangecolumn series with category axis on Ticks', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking rangecolumn series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking rangecolumn series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = dateTimeData;
            chartObj.refresh();
        });
        it('Checking datalabel for rangecolumn outer', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Checking datalabel for rangecolumn Top', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('Checking datalabel for rangecolumn Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_2');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_2_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });
        it('Checking datalabel for rangecolumn Middle', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Checking datalabel for rangecolumn Auto', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_0_Point_1_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 70;
            chartObj.refresh();
        });
        it('Checking with combination series', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainerSeriesGroup0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainerSeriesGroup1');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Line', drawType: 'StackingColumn', marker: { visible: true }
            }, {
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn', marker: { visible: true }
            }];
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with stackingcolumn series rendering', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                let series1: Series = <Series>args.chart.series[0];
                expect(series1.position === 0).toBe(true);
                series1 = <Series>args.chart.series[1];
                expect(series1.position === 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking datalabel for stacking column Outer', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_1_Point_0_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Checking datalabel for stacking column auto', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_1_Point_0_Text_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.position = 'Auto';
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 140;
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with stacking group', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.dataLabel.visible = false;
            chartObj.primaryYAxis.rangePadding = 'Normal';
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].stackingGroup = '';
            chartObj.series[1].dataSource = categoryData;
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with category axis for radar', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.series[1].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with category axis on Ticks', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.series[0].type = 'Polar';
            chartObj.series[1].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with null point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_5');
                expect(ele === null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_5');
                expect(ele === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with log axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with log axis for endvalue 0', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 'USA', y: 50 }, { x: 'China', y: 40 },
            { x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
            { x: 'France', y: 50 }, { x: 'Germany', y: 0 },
            { x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }];
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.series[1].dataSource = datetimeData;
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with negative point', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                ele = document.getElementById('chartContainer_Series_1_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with single point', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                let series: Series = <Series>args.chart.series[0];
                expect(series.points.length === 1).toBe(true);
                series = <Series>args.chart.series[1];
                expect(series.points.length === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 3 }];
            chartObj.series[1].dataSource = [{ x: 1, y: 7 }];
            chartObj.refresh();
        });
        it('Checking line series with legend shape', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
            }];
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
        it('Checking column series with legend shape', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'Column';
            chartObj.refresh();
        });
        it('Checking area series with legend shape', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'Area';
            chartObj.refresh();
        });
        it('Checking scatter series with legend shape', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'Scatter';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with legend shape', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with legend shape with right position', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.position = 'Right';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with legend shape with top position', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.position = 'Top';
            chartObj.refresh();
        });
        it('Checking stackingcolumn series with legend shape with left position', (done: Function) => {
            loaded = (args: Object): void => {
                ele = document.getElementById('chartContainer_chart_legend_shape_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.position = 'Left';
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
            }, {
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
            }, {
                dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
            }];
            chartObj.refresh();
        });
        it('default Tooltip for stackingcolumn with y axis inversed', (done: Function) => {
            loaded = (args: Arg): void => {
                let target: HTMLElement = document.getElementById('chartContainer_Series_0_Point_2');
                let rect: ClientRect = args.chart.element.getBoundingClientRect();
                let series: Series = <Series>chartObj.series[0];

                let y: number = series.points[2].symbolLocations[0].y + rect.top;
                let x: number = series.points[2].symbolLocations[0].x + rect.left;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('chartContainer_tooltip');
                expect(tooltip !== null).toBe(true);
                //  expect(target.getAttribute('opacity') === '0.5').toBe(true);
                trigger.mouseleavetEvent(target, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'StackingColumn';
            chartObj.series[1].drawType = 'StackingColumn';
            chartObj.series[2].drawType = 'StackingColumn';
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });
        it('Checking with multiple series for stacking group', (done: Function) => {
            loaded = (args: Arg): void => {
                ele = document.getElementById('chartContainer_Series_0_Point_0');
                expect(ele !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[0].drawType = 'StackingColumn';
            chartObj.series[1].stackingGroup = 'a';
            chartObj.series[1].drawType = 'StackingColumn';
            chartObj.series[2].drawType = 'StackingColumn';
            chartObj.primaryYAxis.isInversed = false;
            chartObj.refresh();
        });
        it('Checking animation', (done: Function) => {
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                chartObj.animationComplete = null;
                let point = document.getElementById('chartContainer_Series_0_Point_0');
                //expect(point.getAttribute('transform') === null).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();
        });
        it('Selection mode DragY', (done: Function) => {
            loaded = (args: Arg) => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                let element: HTMLElement = document.getElementById('chartContainer_ej2_drag_rect');
                expect(element === null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragY';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
         it('Selection mode DragXY', (done: Function) => {
            loaded = (args: Arg) => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                let element: HTMLElement = document.getElementById('chartContainer_ej2_drag_rect');
                expect(element === null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'DragXY';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with addSeries method', (done: Function) => {
            loaded = (args: Arg): void => {
                expect(args.chart.series.length === 5).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.addSeries([
                {
                    dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
                }, {
                    dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', name: 'Polar-Radar'
                },
            ]);
        });
        it('Checking with spline area draw type', (done: Function) => {
            loaded = (args: Arg): void => {
                expect(
                    document.getElementById('chartContainer_chart_legend_shape_0').getAttribute('d').indexOf('Q') > 0
                ).toBe(true)
                expect(
                    document.getElementById('chartContainer_chart_legend_shape_1').getAttribute('d').indexOf('Q') > 0
                ).toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'SplineArea';
            chartObj.series[1].drawType = 'SplineArea';
            chartObj.refresh();
        });
    });
    describe('Customer issue', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            elem = createElement('div', { id: 'customerIssue' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                primaryXAxis: { isInversed: true, valueType: 'Category', labelPlacement: 'OnTicks' },

                primaryYAxis: { title: 'Revenue in Millions', labelFormat: '{value}M', isInversed: true },

                series: [
                    {
                        type: 'Polar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product A', animation: { enable: false},
                        dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 }, { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
                    },
                    {
                        type: 'Polar', drawType: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Product A', animation: { enable: false},
                        dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 }, { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
                    }
                ],
                tooltip: { enable: true }, title: 'Average Sales (Inversed Polar)',
            });
            chartObj.appendTo('#customerIssue');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with ColumnSeries OnTicks label', () => {
           let point: Element = document.getElementById('customerIssue_Series_0_Point_1');
           expect(point.getAttribute('d')).toBe('M 290.375 225.125 A 94.125 94.125 0 0 1 317.9435076644237 158.56864077727528 L 273.5725127740395 114.19773462879215 A 156.875 156.875 1 0 0 227.625 225.12500000000003 Z');
        });
        it('checking columnSeries with between ticks', (done: Function) => {
            chartObj.loaded = () => {
                let point: Element = document.getElementById('customerIssue_Series_0_Point_1');
                expect(point.getAttribute('d')).toBe('M 317.94357422081623 291.68142577918377 A 94.125 94.125 0 0 1 290.37500000004707 225.12509412500003 L 227.62500000007844 225.12515687500004 A 156.875 156.875 1 0 0 273.5726237013604 336.0523762986396 Z');
                done();
            };
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.dataBind();
        });
    });
    describe('Customer issue: Radar chart with X axis label placement is OnTicks', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                //Initializing Primary X Axis
        primaryXAxis: {
           
            valueType: 'Category',
            interval: 1,
            labelPlacement: 'OnTicks',
        },
        
        //Initializing Primary Y Axis
        primaryYAxis:
        {
           minimum: 0, maximum: 700, interval: 100
        },
        width: "600",
        //Initializing Chart Series
        series: [
            {
                dataSource: [
                    { x: '1996', y: 130 }, { x: '1997', y: 167.46 },
                    { x: '1998', y: 100 }
                ],
                xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Radar',
                drawType: 'Column', visible: true, opacity:0.4
            },
            {
                dataSource: [
                    { x: '1996', y: 200 }, { x: '1997', y: 600 },
                    { x: '1998', y: 400 }
                ],
                xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Radar', fill:'red',
                drawType: 'Column', visible: true, opacity: 0.5
            },
        ],
        //Initializing Chart title
        title: 'Alaska Weather Statistics - 2016',
        //Initializing User Interaction Tooltip
        tooltip: {
            enable: true
        }
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with OnTicks label', () => {
           let point: Element = document.getElementById('container_Series_0_Point_0');
           expect(point.getAttribute('d')).toBe('M 274.7692777451016 210.5580357142857 L 299.9999708660714 195.991071428586 L 300 225.125 L 300 225.125 Z');
        });
        it('checking with between ticks', (done: Function) => {
            chartObj.loaded = () => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point.getAttribute('d')).toBe('M 300 195.99107142857142 L 325.2307076879215 210.55801048357074 L 300 225.125 L 300 225.125 Z');
                done();
            };
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.dataBind();
        });
    });
    describe('Polar Radar Smart Datalabel', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                //Initializing Primary X Axis
                primaryXAxis: {
                    title: 'Months',
                    valueType: 'Category',
                    labelPlacement: 'OnTicks',
                    interval: 2,
                },

                //Initializing Primary Y Axis
                primaryYAxis:
                {
                    title: 'Temperature (Celsius)',
                    minimum: -25, maximum: 25, interval: 2,
                    edgeLabelPlacement: 'Shift',
                    labelFormat: '{value}°C',
                },
                width: '600', height: '400',
                //Initializing Chart Series
                series: [
                    {
                        dataSource: [
                            { x: 'Jan', y: -7.1 }, { x: 'Feb', y: -3.7 },
                            { x: 'Mar', y: 0.8 }, { x: 'Apr', y: 6.3 },
                            { x: 'May', y: 13.3 }, { x: 'Jun', y: 18.0 },
                            { x: 'Jul', y: 19.8 }, { x: 'Aug', y: 18.1 },
                            { x: 'Sep', y: 13.1 }, { x: 'Oct', y: 4.1 },
                            { x: 'Nov', y: -3.8 }, { x: 'Dec', y: -6.8 },

                            { x: 'Jan1', y: -7.1 }, { x: 'Feb1', y: -3.7 },
                            { x: 'Mar1', y: 0.8 }, { x: 'Apr1', y: 6.3 },
                            { x: 'May1', y: 13.3 }, { x: 'Jun1', y: 18.0 },
                            { x: 'Jul1', y: 19.8 }, { x: 'Aug1', y: 18.1 },
                            { x: 'Sep1', y: 13.1 }, { x: 'Oct1', y: 4.1 },
                            { x: 'Nov1', y: -3.8 }, { x: 'Dec1', y: -6.8 },

                            { x: 'Jan2', y: -7.1 }, { x: 'Feb2', y: -3.7 },
                            { x: 'Mar2', y: 0.8 }, { x: 'Apr2', y: 6.3 },
                            { x: 'May2', y: 13.3 }, { x: 'Jun2', y: 18.0 },
                            { x: 'Jul2', y: 19.8 }, { x: 'Aug2', y: 18.1 },
                            { x: 'Sep2', y: 13.1 }, { x: 'Oct2', y: 4.1 },
                            { x: 'Nov2', y: -3.8 }, { x: 'Dec2', y: -6.8 },

                            { x: 'Jan3', y: -7.1 }, { x: 'Feb3', y: -3.7 },
                            { x: 'Mar3', y: 0.8 }, { x: 'Apr3', y: 6.3 },
                            { x: 'May3', y: 13.3 }, { x: 'Jun3', y: 18.0 },
                            { x: 'Jul3', y: 19.8 }, { x: 'Aug3', y: 18.1 },
                            { x: 'Sep3', y: 13.1 }, { x: 'Oct3', y: 4.1 },
                            { x: 'Nov3', y: -3.8 }, { x: 'Dec3', y: -6.8 },
                        ],
                        xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Polar',
                        marker: {
                            visible: true,
                            height: 10, width: 10,
                            shape: 'Pentagon',
                            dataLabel: {
                                visible: true,

                            }
                        },
                        animation: { enable: false }
                    }
                ],
                //Initializing Chart title
                title: 'Alaska Weather Statistics - 2016',
                //Initializing User Interaction Tooltip
                tooltip: {
                    enable: true
                }
            }, '#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Polar Chart: datalabel count check with X axis label outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 28 || datalabel.childElementCount === 31 || datalabel.childElementCount === 32 ).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Polar Chart: datalabel count check with X axis label inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 16 || datalabel.childElementCount === 19).toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Polar Chart: datalabel count check with Y axis label inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 14 || datalabel.childElementCount === 16 || datalabel.childElementCount === 17).toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Radar Chart: datalabel count check with X axis label outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 36 || datalabel.childElementCount === 28 || datalabel.childElementCount === 32).toBe(true);
                done();
            };
            chartObj.series[0].type = 'Radar';
            chartObj.primaryXAxis.labelPosition = chartObj.primaryYAxis.labelPosition = 'Outside';
            chartObj.refresh();
        });
        it('Radar Chart: datalabel count check with X axis label inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 16 || datalabel.childElementCount === 19).toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Radar Chart: datalabel count check with Y axis label inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let datalabel: Element = getElement("containerTextGroup0");
                expect(datalabel.childElementCount === 14 || datalabel.childElementCount === 16 || datalabel.childElementCount === 17).toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelPosition = 'Inside';
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
    })
});
