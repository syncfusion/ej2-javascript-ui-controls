/**
 * Waterfall Series Spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { WaterfallSeries } from '../../../src/chart/series/waterfall-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs, ILegendRenderEventArgs } from '../../../src/common/model/interface';
// import { MouseEvents } from '../../../src/chart/base/events.spec';
Chart.Inject(LineSeries, ColumnSeries, WaterfallSeries, Logarithmic, DataLabel, Category,
    DateTime, Legend, Selection, Tooltip, Crosshair, Zoom);

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

let material: string[] = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
    '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
let fabric: string[] = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
    '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
let paletteColor: string[] = ['#005378', '#006691', '#007EB5', '#0D97D4', '#00AEFF',
    '#14B9FF', '#54CCFF', '#87DBFF', '#ADE5FF', '#C5EDFF'];

describe('Waterfall Series', () => {
    let element: HTMLElement;
    /**
     * Default Waterfall Series
     */
    describe('Waterfall Series', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        let chartData: any[] = [
            { x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -427 },
            { x: 'Research', y: -588 }, { x: 'Development', y: -688 },
            { x: 'other Revenue', y: 1030 }, { x: 'Administrative', y: -780 },
            { x: 'Other expense', y: -361 }, { x: 'Income tax', y: -695 },
        ];
        let dateTimeData: any[] = [
            { x: new Date(1, 0, 2000), y: 4711 }, { x: new Date(1, 0, 2001), y: -427 },
            { x: new Date(1, 0, 2002), y: -588 }, { x: new Date(1, 0, 2003), y: -688 },
            { x: new Date(1, 0, 2004), y: 1030 }, { x: new Date(1, 0, 2005), y: -780 },
            { x: new Date(1, 0, 2006), y: -361 }, { x: new Date(1, 0, 2007), y: -695 }];

        beforeAll(() => {
            document.body.appendChild(element);

            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false }, name: 'ChartSeriesNameGold', dataSource: [],
                        type: 'Waterfall', fill: '#93C952',
                    }],
                    title: 'Company Revenue and Profit', loaded: loaded, legendSettings: { visible: false }

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
                expect(svg == 2).toBe(true);
                let xAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(xAxisLabelCollection.childNodes.length == 11).toBe(true);
                let yAxisLabelCollection: HTMLElement = document.getElementById('containerAxisLabels1');
                expect(yAxisLabelCollection.childNodes.length == 7).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
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

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 'Income',
                y: 4711
            }];
            chartObj.series[0].border = { color: '#5D843A' };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });
        it('checcking with undefined values', (done: Function) => {
            loaded = (args: Object): void => {
                let label: any = document.getElementById('container_Series_0_Point_6_Text_0');
                expect(label.textContent).not.toEqual(NaN);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].intermediateSumIndexes = [2, 6];
            chartObj.series[0].dataSource = [
                { x: 'Income', y: 4711 }, { x: 'Sales', y: -1015 },
                { x: 'Development', y: -688 },
                { x: 'Revenue', y: 1030 }, { x: 'Balance' },
                { x: 'Expense', y: -361 }, { x: 'Tax', y: -695 },
                { x: 'Net Profit' }
            ];
            chartObj.series[0].marker = { dataLabel: { visible: true}};
            chartObj.refresh();
        });
        it('Added data Source with negative axis', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 'Income',
                y: -4711
            }];
            chartObj.series[0].border = { color: '#5D843A' };
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryYAxis.maximum = 100;
            chartObj.primaryXAxis.valueType = 'Category';
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
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 1000;
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

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Point_3');
                let stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke == '0').toBe(true);
                let labelElement: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(labelElement.textContent == '26').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = null;
            chartObj.series = [{
                dataSource: dateTimeData, xName: 'x', yName: 'y',
                animation: { enable: false }, type: 'Waterfall',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
            }];
            chartObj.refresh();
        });

        it('checking with log axis with DateTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container1_AxisLabel_1');
                expect(axisLabel.textContent == '$100M').toBe(true);
                let axisLabelLast: Element = document.getElementById('container1_AxisLabel_4');
                expect(axisLabelLast.textContent == '$100000M').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.title = 'Years';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.title = 'Profit';
            chartObj.series = [
                {
                    type: 'Waterfall', name: 'Series1', xName: 'x', yName: 'y',
                    dataSource: [
                        { x: new Date(1995, 0, 1), y: 80 }, { x: new Date(1996, 0, 1), y: 200 },
                        { x: new Date(1997, 0, 1), y: 400 }, { x: new Date(1998, 0, 1), y: 600 },
                        { x: new Date(1999, 0, 1), y: 700 }, { x: new Date(2000, 0, 1), y: 1400 },
                        { x: new Date(2001, 0, 1), y: 2000 }, { x: new Date(2002, 0, 1), y: 4000 },
                        { x: new Date(2003, 0, 1), y: 6000 }, { x: new Date(2004, 0, 1), y: 8000 },
                        { x: new Date(2005, 0, 1), y: 11000 }], animation: { enable: false }
                }];
            chartObj.refresh();
        });

        it('with data source', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(seriesElements == 10).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 500;
            chartObj.refresh();
        });

        it('with connector appearence', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container_Series_0_Connector_');
                expect(seriesElements.getAttribute('stroke') === 'green').toBe(true); 
                expect(seriesElements.getAttribute('stroke-dasharray') === '3').toBe(true);done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].connector.color = 'green';
            chartObj.series[0].connector.width = 3;
            chartObj.series[0].connector.dashArray = '3';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 500;
            chartObj.refresh();
        });

        it('data source with intermediatesumIndexes', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: HTMLCollection = document.getElementById('containerSeriesGroup0').children;
                expect((seriesElement[5]).getAttribute('fill') === '#00bdae').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].intermediateSumIndexes = [5];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.primaryXAxis.labelIntersectAction = 'Rotate45';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 500;
            chartObj.refresh();
        });

        it('data source with sum Index', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLCollection = document.getElementById('containerSeriesGroup0').children;
                expect((seriesElements[8] as HTMLElement).getAttribute('fill') === '#4E81BC').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].sumIndexes = [7];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.labelIntersectAction = 'Rotate45';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 500;
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
        it('checking with marker', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(label === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = chartData;
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.animationComplete = null;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });
        it('checking with datalabel outer position', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(label.textContent).toEqual('$-427M');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = chartData;
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.animationComplete = null;
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('checking with datalabel top position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('$-588M');
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('checking with datalabel auto position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('$-588M');
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();
        });

        it('checking with datalabel Middle(turns to auto) position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('$-588M');
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('checking with datalabel bottom(turns to auto) position', (done: Function) => {
            loaded = (args: Object): void => {
                let label: Element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(label.textContent).toEqual('$-588M');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('data source with empty points', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: number = document.getElementById('containerSeriesGroup0').childNodes.length;
                expect(seriesElements == 4).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -427 },
                { x: 'Research', }]
            }]
            chartObj.series[0].type = 'Waterfall';
            chartObj.series[0].visible = true;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].intermediateSumIndexes = undefined;
            chartObj.series[0].sumIndexes = undefined;
            chartObj.series[0].animation.enable = true;
            chartObj.primaryXAxis.labelIntersectAction = 'Rotate45';
            chartObj.primaryYAxis.labelFormat = '${value}M';
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.primaryYAxis.interval = 500;
            chartObj.refresh();
        });

        it('checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                let series0: Series = <Series>chartObj.series[0];
                let series1: Series = <Series>chartObj.series[1];
                expect((series1.points[2].regions[0].x) == series0.points[2].regions[0].width + series0.points[2].regions[0].x).toBe(true);
                done();
            };
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series = [
                {
                    dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -607 },
                    { x: 'Research', y: -588 }, { x: 'dhehk', y: 1030 }], xName: 'x', yName: 'y', marker: {
                        visible: true,
                        width: 10, height: 10,
                        shape: 'Diamond'
                    },
                    name: 'series1', type: 'Waterfall', animation: { enable: false }
                },
                {
                    dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -427 },
                    { x: 'Research', y: -588 }, { x: 'dhehk', y: 1030 }], marker: {
                        visible: true,
                        width: 10, height: 10,
                        shape: 'Diamond'
                    }, xName: 'x', yName: 'y', name: 'series2', type: 'Waterfall',
                    animation: { enable: false }
                }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Legend Shape type', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: Element = document.getElementById('container_chart_legend_element');
                expect(legendElement.tagName).toEqual('rect');
                expect(legendElement.getAttribute('d')).not.toEqual(null);
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('ellipse');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Waterfall';
            chartObj.series[0].legendShape = 'Circle';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });

        it('Single point selection', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_1');
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
                let element: Element = document.getElementById('container_Series_0_Point_1');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                element = document.getElementById('container_Series_1_Point_1');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_1 ');
                expect(selected.length).toBe(1);
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
                let element: Element = document.getElementById('container_Series_0_Point_1');
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
                let element: Element = document.getElementById('container_Series_0_Point_1');
                let element1: Element = document.getElementById('container_Series_1_Point_1');
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

        it('chart click event with selection enable', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById('container_Series_0_Point_1');
                trigger.clickEvent(element);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(element).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                trigger.mouseupEvent(element, 20, 20, 100, 100);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('checking with tooltip without format', (done: Function) => {
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
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('Marketting and Sales : $-607M');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].sumIndexes = [2, 5];
            chartObj.series[1].sumIndexes = [2, 5];

            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.tooltip.enable = true;
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('checking with tooltip with format', (done: Function) => {
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
                expect(tooltip.childNodes[0].childNodes[0].childNodes[1].textContent).toEqual('series1 Marketting and Sales : $-607M');
                expect(parseFloat(tooltip.style.top) < (series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y'))));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.tooltip.enable = true;
            chartObj.tooltip.format = '${series.name} ${point.x} : ${point.y}';
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('checking with track ball', (done: Function) => {
            let tooltip: Element;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = true;
            chartObj.primaryYAxis.labelFormat = '{value}C';
            chartObj.primaryXAxis.valueType = 'Category';
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
                expect(path.getAttribute('fill') == 'rgba(0, 8, 22, 0.75)').toBe(true);
                expect((<HTMLElement>text1.childNodes[0]).getAttribute('fill') == '#dbdbdb').toBe(true);
                expect(text1.childNodes[0].textContent == 'series1 Marketting and Sales : -607C').toBe(true);
                expect(text1.childNodes[1].textContent == 'series2 Marketting and Sales : -427C').toBe(true);
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
                expect(tooltip.childNodes[0].childNodes[0].textContent).toEqual('Marketting and Sales');
                expect(tooltip.childNodes[0].childNodes[1].textContent).toEqual('-607C');
                expect(tooltip != null).toBe(true);
                y = parseFloat(chartArea.getAttribute('height')) + parseFloat(chartArea.getAttribute('y')) + 200 + element.offsetTop;
                x = parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mouseleavetEvent(element, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.tooltip.shared = false;
            chartObj.title = 'Template';
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });

        it('Legend position', (done: Function) => {
            loaded = (args: Object) => {
                let legendElement: HTMLElement = document.getElementById('container_chart_legend_element');
                expect((parseInt(legendElement.getAttribute('x'), 10)) == (337) || (parseInt(legendElement.getAttribute('x'), 10)) == (334)).toBe(true);
                expect((parseInt(legendElement.getAttribute('y'), 10)) == (46) ||
                       (parseInt(legendElement.getAttribute('y'), 10)) == (43)).toBe(true);
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
                expect((parseInt(legendElement.getAttribute('y'), 10)) == (46) ||
                       (parseInt(legendElement.getAttribute('y'), 10)) == (43)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.alignment = 'Near';
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
            chartObj.legendSettings.alignment = 'Near';
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
            chartObj.series[1].marker.visible = false;
            chartObj.refresh();
        });

        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_1_Point_0');
                expect(point != null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'income').toBe(true);
                let axisStart: Element = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) < parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks'
            chartObj.series[0].dataSource = chartData;
            chartObj.refresh();
        });

        it('Checking with category axis BetweenTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container_Series_1_Point_0');
                expect(point != null).toBe(true);
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'income').toBe(true);
                let axisStart = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) > parseInt(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.series[0].dataSource = chartData;
            chartObj.refresh();
        });

        it('Checking with category axis with plotoffset', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('containerSeriesGroup1');
                expect(point != null).toBe(true);
                expect(point.getAttribute('transform') == 'translate(82.5,79.25)' ||
                      point.getAttribute('transform') == 'translate(78.5,75.25)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.primaryXAxis.plotOffset = 5;
            chartObj.series[0].dataSource = chartData;
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
                let svg: HTMLElement = document.getElementById('containerSeriesGroup1');
                expect(svg.getAttribute('transform') == 'translate(77.5,79.25)' ||
                        svg.getAttribute('transform') == 'translate(73.5,75.25)' ).toBe(true);
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
                    dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -607 },
                    { x: 'Research', y: -588 }, { x: 'dhehk', y: 1030 }], xName: 'x', yName: 'y',
                    name: 'series1', type: 'Waterfall', sumIndexes: [2, 5], animation: { enable: false }
                },
                {
                    dataSource: [{ x: 'income', y: 9000 }, { x: 'Marketting and Sales', y: -427 },
                    { x: 'Research', y: -588 }, { x: 'dhehk', y: 1030 }], yAxisName: 'yAxis1',
                    xName: 'x', yName: 'y', name: 'series2', type: 'Waterfall', sumIndexes: [2, 5],
                    animation: { enable: false }
                }
            ];
            chartObj.axes[0].rowIndex = 1;
            chartObj.axes[0].opposedPosition = true;
            chartObj.axes[0].name = 'yAxis1';
            chartObj.axes[0].minimum = 5000;
            chartObj.axes[0].maximum = 10000;
            chartObj.axes[0].interval = 500;
            chartObj.axes[0].title = 'Axis2';
            chartObj.primaryXAxis.plotOffset = 0;
            //chartObj.primaryYAxis.maximum = 5000;
            chartObj.refresh();
        });

        it('Checking with category axis with multiple panes- column', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerSeriesGroup1');
                expect(svg.getAttribute('transform').indexOf('translate(477.5,296.69200897216797') > -1 ||
                       svg.getAttribute('transform') === 'translate(473.5,257.625)').toBe(true);
                svg = document.getElementById('container_AxisBottom_Column0');
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                svg = document.getElementById('containerAxisLine_2');
                expect(svg.getAttribute('x1') == '477.5' || svg.getAttribute('x1') == '478.5' || svg.getAttribute('x1') == '473.5').toBe(true);               
                svg = document.getElementById('container_AxisBottom_Column1');
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
                    dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: -607 },
                    { x: 'Research', y: -588 }, { x: 'dhehk', y: 1030 }], xName: 'x', yName: 'y',
                    name: 'series1', type: 'Waterfall', sumIndexes: [2, 5], animation: { enable: false }
                },
                {
                    dataSource: [{ x: 'income', y: 4711 }, { x: 'Marketting and Sales', y: 3500 },
                    { x: 'Research', y: 2008 }, { x: 'dhehk', y: 1030 }], xAxisName: 'xAxis1',
                    xName: 'x', yName: 'y', name: 'series2', type: 'Column', sumIndexes: [2, 5],
                    animation: { enable: false }
                }
            ];
            chartObj.axes[0].columnIndex = 1;
            chartObj.axes[0].name = 'xAxis1';
            chartObj.axes[0].valueType = 'Category';
            chartObj.axes[0].minimum = null;
            chartObj.axes[0].maximum = null;
            chartObj.axes[0].interval = null;
            chartObj.axes[0].labelIntersectAction = 'Rotate45';
            chartObj.axes[0].title = 'Axis3';
            chartObj.primaryYAxis.minimum = 0;
            chartObj.primaryYAxis.maximum = 5000;
            chartObj.refresh();
        });

        it('Checking with Months and its Round rangePadding', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('containerAxisLabels0').childNodes[0].textContent == 'income').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Round';
            chartObj.refresh();
        });

        it('Checking with fabric theme color', (done: Function) => {
            loaded = (args: Object): void => {
                let prefix: string = 'container_Series_';
                let suffix: string = '_Point_';
                expect(document.getElementById(prefix + 0 + suffix + 1).getAttribute('fill')).toBe(fabric[1]);
                expect(document.getElementById(prefix + 0 + suffix + 3).getAttribute('fill')).toBe(fabric[4]);
                done();
            };
            chartObj.theme = 'Fabric';
            chartObj.series[0].fill = fabric[4];
            chartObj.series[0].negativeFillColor = fabric[1];
            chartObj.series[0].summaryFillColor = fabric[2];
            chartObj.palettes = fabric;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking mouse wheel zooming', (done: Function) => {
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
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.10').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking pinch zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                let areaElement = document.getElementById('container_svg');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                let content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '1.00' || content == '0.33' || content == '0.34').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.83' || content == '0.84').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enablePinchZooming = true;
            chartObj.dataBind();
        });
    });
});

export interface series1 {
    series: Series;
}