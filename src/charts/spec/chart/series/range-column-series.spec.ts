/**
 * Range Column Series Spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { ChartSeriesType, ChartRangePadding } from '../../../src/chart/utils/enum';
import { ValueType } from '../../../src/chart/utils/enum';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { RangeColumnSeries } from '../../../src/chart/series/range-column-series';
import { tooltipData1, negativeDataPoint, doubleRangeColumnData } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DataLabel, Category, DateTime, RangeColumnSeries, Legend, Tooltip, Crosshair, Logarithmic, Selection);

export let categoryData: any[] = [
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


describe('Chart', () => {
    let element: HTMLElement;

    describe('Range Column Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;' });
            document.body.appendChild(template);
            template.innerHTML = '<div>80</div>';
            let template1: Element = createElement('div', { id: 'template1', styles: 'display: none;' });
            document.body.appendChild(template1);
            template1.innerHTML = '<div>${point.high}:${point.low}</div>';
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold',
                        type: 'RangeColumn', fill: 'rgba(135,206,235,1)',
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }

                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
            remove(document.getElementById('template'));
            remove(document.getElementById('template1'));
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
                expect(stroke == '0').toBe(true);
                let labelElement: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '26').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series = [{
                dataSource: dateTimeData, xName: 'x', low: 'low', high: 'high',
                animation: { enable: false }, type: 'RangeColumn',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            }];

            chartObj.refresh();

        });
        it('Checking with dateTime any one null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = null;
            chartObj.refresh();
        });
        it('Checking with dateTime any  null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = null;
            chartObj.series[0].dataSource[0].low = null;
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
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks'
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
            chartObj.primaryXAxis.labelPlacement = 'OnTicks'
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
        it('Checking with category  null points', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_0_Point_0');
                expect(point == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].high = null;
            chartObj.series[0].dataSource[0].low = null;
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


        it('Checking animation', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point: Element = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.animationComplete = animationComplete;
            chartObj.series[0].animation.enable = true;
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
            chartObj.series[0].type = 'RangeColumn';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) == series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };

            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low',
                    name: 'series1', type: 'RangeColumn', animation: { enable: false }
                },
                {
                    dataSource: doubleData, xName: 'x', high: 'high',
                    low: 'low', name: 'series2', type: 'RangeColumn', animation: { enable: false }
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
        it('checking with tooltip', (done: Function) => {
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
               
                expect( Math.round(+element1.textContent) == 23 || Math.round(+element1.textContent) == 22).toBe(true);
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
                    type: 'RangeColumn', name: 'Series1', xName: 'x', low: 'low', high: 'high',
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
                    type: 'RangeColumn', name: 'Series1', xName: 'x', low: 'low', high: 'high',
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

        it('checking with datalabel top position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].height / 2;
                expect(svg > (point0Location - height)).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let pointLocation1: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg1 < pointLocation1 + height).toBe(true); done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Top';
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
        it('checking with datalabel Middle(turns to auto) position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].height / 2;
                expect(svg < (point0Location - height)).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let pointLocation1: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg1 > pointLocation1 + height).toBe(true); done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('checking with datalabel bottom(turns to auto) position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point0Location: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                let height: number = (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].height / 2;
                expect(svg < (point0Location - height)).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_1').getAttribute('y');
                let pointLocation1: number = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].y;
                expect(svg1 > pointLocation1 + height).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('Checking data label for low > high for negative points', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(label.textContent).toEqual('-5K');
                label = document.getElementById('container_Series_0_Point_0_Text_1');
                expect(label.textContent).toEqual('-19K');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].dataSource[0].high = -19;
            chartObj.series[0].dataSource[0].low = -5;
            chartObj.refresh();
        });

        it('checking elements counts without using template', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element != null).toBe(true);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(0);
                done();
            };
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();

        });
        it('checking elements counts with using template without element', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(0);
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element).toBe(null);
                done();
            };
            chartObj.series[0].marker.dataLabel.template = 'label';
            chartObj.chartArea.background = 'transparent';
            chartObj.refresh();

        });
        it('checking elements counts and datalabel with using template as html string', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(1);
                expect(element.children[0].id).toBe('container_Series_0_DataLabelCollections');
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element.childElementCount).toBe(16);
                element = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('-22');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '<div>${point.low}</div>';
            chartObj.refresh();

        });
        it('checking template as point x value and cheecking style', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('34 : -22');
                expect(element.style.backgroundColor).toBe('transparent');
                expect(element.style.color).toBe('black');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '<div>${point.high} : ${point.low}</div>';
            chartObj.refresh();

        });
        it('checking template using script element', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_DataLabel_5');
                expect(element.children[0].innerHTML).toBe('80');
                expect(element.style.backgroundColor).toBe('transparent');
                expect(element.style.color).toBe('black');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '#template';
            chartObj.refresh();

        });
        it('checking template using script element as format', (done: Function) => {
            chartObj.loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_4_Text_0');
                expect(element).toBe(null);
                element = document.getElementById('container_Secondary_Element');
                expect(element.childElementCount).toBe(1);
                expect(element.children[0].id).toBe('container_Series_0_DataLabelCollections');
                element = document.getElementById('container_Series_0_DataLabelCollections');
                expect(element.childElementCount).toBe(16);
                element = document.getElementById('container_Series_0_DataLabel_6');
                expect(element.children[0].innerHTML).toBe('23:-12');
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '#template1';
            chartObj.refresh();

        });

        it('Checking with column series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect(Math.round(series1.points[2].regions[0].x) ==
                    Math.round(series0.points[2].regions[0].width + series0.points[2].regions[0].x)).toBe(true);
                done();
            };
            chartObj.series = [
                {
                    dataSource: doubleData, xName: 'x', high: 'high', low: 'low', name: 'series1',
                    type: 'RangeColumn', animation: { enable: false }
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
          //  chartObj.storedPoints = [];
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
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameGold1', fill: 'black',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNameSilver', fill: 'green',
                        xAxisName: 'xAxis5', yAxisName: 'yAxis3',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false },
                        type: 'RangeColumn',
                        name: 'ChartSeriesNameRuby', fill: 'red',
                        xAxisName: 'xAxis6', yAxisName: 'yAxis4',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
                        name: 'ChartSeriesNamePlatinum', fill: 'rgba(135,000,235,1)',
                        xAxisName: 'xAxis3', yAxisName: 'yAxis5',
                    },
                    {
                        dataSource: doubleData, xName: 'x', low: 'low', high: 'high', animation: { enable: false }, type: 'RangeColumn',
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
        it('checking with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: Element = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + series.clipRect.y / 2 +
                    parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                let crossHairAxis = crosshair.childNodes[2] as HTMLElement;
                expect(crossHairAxis.childElementCount).toEqual(8);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.refresh();

        });
    });
    describe('Range column Series with Inversed axis', () => {
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
                        name: 'ChartSeriesNameGold', dataSource:doubleData, xName: 'x', low: 'low', high: 'high',
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

     describe('checking rotated range column chart', () => {
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
                    { type: 'RangeColumn', name: 'columnSeries1', dataSource: doubleRangeColumnData, 
                      xName: 'x', low: 'low', high: 'high', animation: { enable: false }},
                    { type: 'RangeColumn', name: 'columnSeries2', dataSource: doubleRangeColumnData, 
                      xName: 'x', low: 'low', high: 'high' , animation: { enable: false } }
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
        it('checking with datalabel Auto position', (done: Function) => {
            loaded = (args: Object): void => {
                //positive yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
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
                expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
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
    describe('Range Column Series - Marker', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                {type: 'RangeColumn', name: 'column series', dataSource: dateTimeData, xName: 'x', yName: 'y', low: 'low', high: 'high',
                animation: { enable: false }, marker: { visible: true }
             },
                ],
                width: '700'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default marker', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker !== null).toBe(true);
                marker = document.getElementById('container_Series_0_Point_1_Symbol1');
                expect(marker !== null).toBe(true);
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
                series1 = document.getElementById('container_Series_0_Point_3_Symbol1');
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
        it('Checking specify marker color', (done: Function) => {
            loaded = (args: Object): void => {
                let series1: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(series1.getAttribute('fill') == 'violet').toBe(true);
                let series2: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol1');
                expect(series2.getAttribute('fill') == 'violet').toBe(true); 
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.fill = 'violet';
            chartObj.refresh();
        });
        it('with image', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(series1.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true);
                let series2 = document.getElementById('container_Series_0_Point_1_Symbol1');
                expect(series2.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true);  
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Image';
            chartObj.series[0].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.series[0].marker.height = 20;
            chartObj.series[0].marker.width = 20;
            chartObj.refresh();
        });

        it('with marker properties', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(series1.getAttribute('fill') == 'green').toBe(true);
                expect(series1.getAttribute('opacity') == '0.1').toBe(true);
                expect(series1.getAttribute('stroke') == 'red').toBe(true);
                expect(series1.getAttribute('stroke-width') == '4').toBe(true);
                let series2 = document.getElementById('container_Series_0_Point_2_Symbol1');
                expect(series2.getAttribute('fill') == 'green').toBe(true);
                expect(series2.getAttribute('opacity') == '0.1').toBe(true);
                expect(series2.getAttribute('stroke') == 'red').toBe(true);
                expect(series2.getAttribute('stroke-width') == '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'green';
            chartObj.series[0].marker.opacity = 0.1;
            chartObj.series[0].marker.border = {
                width: 4,
                color: 'red'
            };
            chartObj.refresh();
        });
        it('with marker and datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                let series1 = document.getElementById('container_Series_0_Point_1_Symbol');
                let datalabel = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(datalabel.getAttribute('y')) < +(series1.getAttribute('cy'))).toBe(true);
                let series2 = document.getElementById('container_Series_0_Point_1_Symbol1');
                let datalabel2 = document.getElementById('container_Series_0_Point_1_Text_1');
                expect(+(datalabel2.getAttribute('y')) > +(series2.getAttribute('cy'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        });
});
