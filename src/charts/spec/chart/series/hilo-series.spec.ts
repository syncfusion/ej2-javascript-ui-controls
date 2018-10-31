/**
 * Test cases for Hilo Series
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Axis } from '../../../src/chart/axis/axis';
import { Legend } from '../../../src/chart/legend/legend';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { RangeColumnSeries } from '../../../src/chart/series/range-column-series';
import { HiloSeries } from '../../../src/chart/series/hilo-series';
import { negativeDataPoint } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import {
    ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs,
    ILegendRenderEventArgs
} from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DataLabel, Category, DateTime, RangeColumnSeries, Legend, Tooltip, Crosshair, Logarithmic, Selection,
    HiloSeries);

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

export let categoryData: object[] = [
    { x: 'USA', low: -12, high: 0 }, { x: 'China', low: 12, high: 10 },
    { x: 'Japan', low: 23, high: 10 }, { x: 'Australia', low: 202, high: 43 },
    { x: 'France1', low: 0, high: 10 }, { x: 'Germany1', low: -22, high: 34 },
    { x: 'Italy', low: -12, high: 23 }, { x: 'Sweden', low: 12, high: 40 }];

export let doubleData: object[] = [
    { x: 1, low: -12, high: 0 }, { x: 2, low: 12, high: 10 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 202, high: 43 },
    { x: 5, low: 0, high: 10 }, { x: 6, low: -22, high: 34 },
    { x: 7, low: 12, high: 23 }, { x: 8, low: 12, high: 40 }];
export let doubleData2: object[] = [
    { x: 1, low: 16, high: 30 }, { x: 2, low: 2, high: 10 },
    { x: 3, low: 3, high: 20 }, { x: 4, low: 20, high: 53 },
    { x: 5, low: 5, high: 15 }, { x: 6, low: 22, high: 44 },
    { x: 7, low: 2, high: 13 }, { x: 8, low: 20, high: 30 }];
export let doubleData1: object[] = [
    { x: 1, low: 20, high: 40 }, { x: 2, low: 8, high: 20 },
    { x: 3, low: 15, high: 30 }, { x: 4, low: 20, high: 43 },
    { x: 5, low: 10, high: 25 }, { x: 6, low: 15, high: 34 },
    { x: 7, low: 2, high: 13 }, { x: 8, low: 2, high: 15 }];
export let dateTimeData: object[] = [
    { x: new Date(1, 0, 2000), low: -12, high: 0 }, { x: new Date(1, 0, 2001), low: 12, high: 10 },
    { x: new Date(1, 0, 2002), low: 23, high: 10 }, { x: new Date(1, 0, 2003), low: 202, high: 43 },
    { x: new Date(1, 0, 2004), low: 0, high: 10 }, { x: new Date(1, 0, 2005), low: -22, high: 34 },
    { x: new Date(1, 0, 2006), low: -12, high: 23 }, { x: new Date(1, 0, 2007), low: 12, high: 40 }];
export let doubleRangeColumnData: object[] = [
    { x: 1, low: -12, high: 0 }, { x: 2, low: 12, high: 10 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 202, high: 43 },
    { x: 5, low: 0, high: 10 }, { x: 6, low: -22, high: 34 },
    { x: 7, low: -12, high: 23 }, { x: 8, low: 12, high: 40 }];


describe('Chart', () => {
    let element: HTMLElement;

    describe('HiloSeries', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold',
                        type: 'Hilo', fill: 'rgba(135,206,235,1)',
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
            chartObj.series[0].dataSource = [{
                x: 1,
                low: 10,
                high: 20
            }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
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
        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 3).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 5).toBe(true); done();
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

        it('Checking with null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource[0].high = null;
            chartObj.series[0].dataSource[0].low = null;
            chartObj.refresh();
        });

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '2' || stroke == '0').toBe(true);
                let labelElement: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '26 Tue' || labelElement.textContent == '26').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series = [{
                dataSource: dateTimeData, xName: 'x', low: 'low', high: 'high',
                animation: { enable: false }, type: 'Hilo',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            }];

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
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].low = 'low';
            chartObj.series[0].high = 'high';
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
        it('Checking with Category any one null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = null;
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
            chartObj.series[0].type = 'Hilo';
            chartObj.legendSettings = { visible: true };
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
            chartObj.series[0].type = 'Hilo';
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
            chartObj.series[0].type = 'Hilo';
            chartObj.legendSettings = { visible: true, alignment: 'Near' };
            chartObj.refresh();
        });
        it('Legend Interaction with selection and non selection', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                args.chart.loaded = null;
                let element: HTMLElement = document.getElementById('container_chart_legend_text_0');
                trigger.clickEvent(element);
                let element1: number = document.getElementById('containerSeriesCollection').children.length;
                expect(element1 == 1 || element1 == 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) >= series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    low: 'low', name: 'series2', type: 'Hilo', animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
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
        it('Single point selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_4');
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
                let element: Element = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                element = document.getElementById('container_Series_0_Point_5');
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
                let element: Element = document.getElementById('container_Series_0_Point_4');
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
                let element: Element = document.getElementById('container_Series_0_Point_4');
                let element1: Element = document.getElementById('container_Series_1_Point_4');
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
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });
        it('checking with tooltip without Format', (done: Function) => {
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
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('series12High : 10Low : 12');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.tooltip.enable = true;
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
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent).toEqual('3');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(Math.round(+element1.textContent) == 22 || Math.round(+element1.textContent) == 23).toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
        });
        it('checking with log axis with dataTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container1_AxisLabel_1');
                expect(axisLabel.textContent == '10').toBe(true);
                let axisLabelLast: Element = document.getElementById('container1_AxisLabel_5');
                expect(axisLabelLast.textContent == '100000').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.series = [
                {
                    type: 'Hilo', name: 'Series1', xName: 'x', low: 'low', high: 'high',
                    dataSource: [
                        { x: new Date(1, 0, 2000), low: 100, high: 10000 }, { x: new Date(1, 0, 2001), low: 120, high: 2000 },
                        { x: new Date(1, 0, 2002), low: 232, high: 1233 }, { x: new Date(1, 0, 2003), low: 202, high: 4003 },
                        { x: new Date(1, 0, 2004), low: 0, high: 10342 }, { x: new Date(1, 0, 2005), low: 4622, high: 340 },
                        { x: new Date(1, 0, 2006), low: 120, high: 2300 }, { x: new Date(1, 0, 2007), low: 1223, high: 4000 }]
                }];
            chartObj.refresh();

        });
        it('checking with log axis in both axis', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container1_AxisLabel_1');
                expect(axisLabel.textContent == '10').toBe(true);
                let axisLabelLast: Element = document.getElementById('container1_AxisLabel_5');
                expect(axisLabelLast.textContent == '100000').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.series = [
                {
                    type: 'Hilo', name: 'Series1', xName: 'x', low: 'low', high: 'high',
                    dataSource: [
                        { x: 100, low: 100, high: 10000 }, { x: 200, low: 120, high: 2000 },
                        { x: 300, low: 232, high: 1233 }, { x: 1000, low: 202, high: 4003 },
                        { x: 10000, low: 0, high: 10342 }, { x: 1500, low: 4622, high: 340 },
                        { x: 2000, low: 120, high: 2300 }, { x: 8000, low: 1223, high: 4000 }]
                }];
            chartObj.refresh();

        });

        it('checking with datalabel outer position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].height / 2;
                expect(label.textContent).toEqual('12K');
                expect(svg < (point0Location - height)).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let label2: Element = document.getElementById('container_Series_0_Point_1_Text_1');
                expect(label2.textContent).toEqual('10K');
                expect(svg1 > point0Location + height).toBe(true);
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
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].marker.dataLabel.border.color = 'red';
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.refresh();
        });
        it('checking with datalabel auto position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].height / 2;
                expect(svg < (point0Location - height)).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let pointLocation1: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg1 > pointLocation1 + height).toBe(true); done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();

        });

        it('Checking with column series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect(Math.round(series1.points[2].regions[0].x) >=
                    Math.round(series0.points[2].regions[0].width + series0.points[2].regions[0].x)).toBe(true);
                done();
            };
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', name: 'series1',
                    type: 'Hilo', animation: { enable: false }
                },
                { dataSource: doubleData, xName: 'x', yName: 'high', name: 'series2', type: 'Column', animation: { enable: false } }
            ];
            chartObj.loaded = loaded;
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
                expect(text1.textContent == 'series1#2High : 10CLow : 12C').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();
            };
            chartObj.refresh();

        });
        it('Changing the trackball', (done: Function) => {
            let tooltip: Element;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = true;
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
                let group: Node = tooltip.childNodes[0].childNodes[0];
                let path: Element = group.childNodes[0] as HTMLElement;
                let text1: Element = group.childNodes[1] as HTMLElement;
                let text2: Element = group.childNodes[2] as HTMLElement;
                expect(path.getAttribute('fill') == 'pink').toBe(true);
                expect((<HTMLElement>text1.childNodes[0]).getAttribute('fill') == 'red').toBe(true);
                expect(text1.textContent == '#2series1High : 10CLow : 12Cseries2 : 10C').toBe(true);
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y + 50));
                done();
            };
            chartObj.refresh();

        });
        it('Checking with template', (done: Function) => {
            let tooltip: Element;
            remove(document.getElementById('container_tooltip'));
            loaded = (args: Object): void => {
                let target: Element = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip.childNodes[0].childNodes[0].textContent).toEqual('#2');
                expect(tooltip.childNodes[0].childNodes[1].textContent).toEqual('10C');
                expect(tooltip.childNodes[0].childNodes[2].textContent).toEqual('12C');
                expect(tooltip != null).toBe(true);
                y = parseFloat(chartArea.getAttribute('height')) + parseFloat(chartArea.getAttribute('y')) + 200 + element.offsetTop;
                x = parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mouseleavetEvent(element, Math.ceil(x), Math.ceil(y));
                done();
            };
            //chartObj.storedPoints = [];
            chartObj.tooltip.template = '<div>${x}</div><div>${high}</div><div>${low}</div>';
            chartObj.tooltip.shared = false;
            chartObj.title = 'Template';
            chartObj.loaded = loaded;
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
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNameGold', fill: 'green',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', yName: 'low', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'red',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'

                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNameGold1', fill: 'black',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNameSilver', fill: 'green',
                        xAxisName: 'xAxis5', yAxisName: 'yAxis3',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false },
                        type: 'Hilo',
                        name: 'ChartSeriesNameRuby', fill: 'red',
                        xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)',
                        xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNameEmerald', fill: 'purple',
                        xAxisName: 'xAxis4', yAxisName: 'yAxis6',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'Hilo',
                        name: 'ChartSeriesNamePearl', fill: 'violet',
                        xAxisName: 'xAxis7', yAxisName: 'yAxis7'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false },
                        type: 'Hilo',
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
        it('checking with Plot Offset', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('containerSeriesGroup1');
                expect(point != null).toBe(true);
                expect(point.getAttribute('transform') == 'translate(160.5,462.5)' ||
                    point.getAttribute('transform') == 'translate(151.5,471.5)').toBe(true);
                done();
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryYAxis.plotOffset = 20;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    low: 'low', name: 'series2', type: 'Hilo', animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with opposedPosition', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) >= series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    low: 'low', name: 'series2', type: 'Hilo', animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with category axis with multiple panes- column', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('x1') == '101' || svg.getAttribute('x1') == '95').toBe(true);
                let svg1: HTMLElement = document.getElementById('container_AxisBottom_Column0');
                expect(svg1.getAttribute('stroke') == 'red').toBe(true);
                svg = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('x1') == '845.5' || svg.getAttribute('x1') == '854.5').toBe(true);
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
                    dataSource: doubleData1, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData2, xName: 'x', high: 'high', low: 'low',
                    name: 'series2', type: 'Hilo', animation: { enable: false }, xAxisName: 'yAxis1',
                }
            ];

            chartObj.axes[0].columnIndex = 1;
            chartObj.axes[0].name = 'yAxis1';
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 50;
            chartObj.refresh();
        });

        it('Checking with category axis with multiple panes- rows', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(svg.getAttribute('y1') == '851.5' || svg.getAttribute('y1') == '842.5').toBe(true);
                svg = document.getElementById('containerAxisLine_1');
                expect(svg.getAttribute('y1') == '498.375' || svg.getAttribute('y1') == '499.375').toBe(true);
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
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData2, xName: 'x', high: 'high', low: 'low',
                    name: 'series2', type: 'Hilo', animation: { enable: false }, yAxisName: 'yAxis1',
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
        it('checking with Multiple Series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) >= series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'Hilo', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    low: 'low', name: 'series2', type: 'RangeColumn', animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
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
                    chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.01').toBe(true);
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
                expect(content == '0.33' || content == '0.32').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.77' || content == '0.78').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });
        it('Checking with Months and its Round rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerAxisLabels0').childNodes[0].textContent == '5.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Round';
            chartObj.refresh();
        });
    });
    describe('Hilo Series with Inversed axis', () => {
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
                        name: 'ChartSeriesNameGold', dataSource: doubleData, xName: 'x', low: 'low', high: 'high',
                        type: 'RangeColumn', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                let point0Location: number = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chart.series[0]).points[1]).regions[0].height / 2;
                expect(svg > (point0Location + height)).toBe(true);
                let svg2: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let label2: Element = document.getElementById('container_Series_0_Point_1_Text_1');
                expect(svg2 < point0Location).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.refresh();

        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                let point0Location: number = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chart.series[0]).points[1]).regions[0].height / 2;
                expect(svg > (point0Location + height)).toBe(true);
                let svg2: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let label2: Element = document.getElementById('container_Series_0_Point_1_Text_1');
                expect(svg2 < point0Location).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                let point0Location: number = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chart.series[0]).points[1]).regions[0].height / 2;
                expect(svg < (point0Location + height)).toBe(true);
                let svg2: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let label2: Element = document.getElementById('container_Series_0_Point_1_Text_1');
                expect(svg2 > point0Location).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.refresh();

        });
    });

    describe('checking rotated Hilo chart', () => {
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
                primaryXAxis: { title: 'primaryXAxis' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                    {
                        type: 'Hilo', name: 'columnSeries1', dataSource: doubleRangeColumnData,
                        xName: 'x', low: 'low', high: 'high', animation: { enable: false }
                    },
                    {
                        type: 'Hilo', name: 'columnSeries2', dataSource: doubleRangeColumnData,
                        xName: 'x', low: 'low', high: 'high', animation: { enable: false }
                    }
                ],
                title: 'rotated Bar Chart'
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

    });
});
