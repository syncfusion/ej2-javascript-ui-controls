
/**
 * Specifies the StackingColumn series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType, ChartRangePadding, ValueType } from '../../../src/chart/utils/enum';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { unbindResizeEvents } from '../base/data.spec';
import { Axis } from '../../../src/chart/axis/axis';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { tooltipData21, tooltipData22, datetimeData21, negativeDataPoint, seriesData1, rotateData1, rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';

Chart.Inject(LineSeries, StackingColumnSeries, DateTime, Category, DataLabel, ColumnSeries);
let data: any = tooltipData21;
let data2: any = tooltipData22;
let dateTime: any = datetimeData21;
let point: Points[];
export interface Arg {
    chart: Chart;
}

describe('Chart Control', () => {
    describe('Chart StackingColumn series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let dataLabel: HTMLElement;
        let marker: HTMLElement;


        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',

                    },
                    {
                        dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',

                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with default points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with axis maximum as based on stacking series endvalues', (done: Function) => {
            loaded = (args: Arg): void => {
               let series2: Series = <Series>args.chart.series[1];
               expect(series2.yMax > 100).toBe(true);
               done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with each point percentage value', (done: Function) => {
            loaded = (args: Arg): void => {
               let point: Points = args.chart.visibleSeries[0].points[0];
               expect(point.percentage != null).toBe(true);
               expect(point.percentage).toBe(48.95);
               done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with axis maximum as based on stacking 100 series endvalues', (done: Function) => {
            loaded = (args: Arg): void => {
               let series2: Series = <Series>args.chart.series[1];
               expect(series2.yMax === 100).toBe(true);
               done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_5');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn';
            chartObj.series[1].type = 'StackingColumn';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[1].dataSource[5].y = null;
            chartObj.refresh();
        });
        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                let axisLabel = document.getElementById('container1_AxisLabel_6');
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect((series1.points[1].regions[0].y) + series1.points[0].regions[0].height > parseFloat(axisLabel.getAttribute('y'))).toBe(true);
                expect((series2.points[4].regions[0].y) + series2.points[4].regions[0].height > parseFloat(axisLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking with different stackingGroup', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.points[1].regions[0].x < series2.points[1].regions[0].x).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].dataSource[3].y = 70;
            chartObj.series[1].dataSource[5].y = 60;
            chartObj.series[0].stackingGroup = 'a';
            chartObj.series[1].stackingGroup = 'b';
            chartObj.refresh();

        });
        it('Checking with default DataLabel ', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0')
                expect(dataLabel.textContent === '70').toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(dataLabel.textContent === '73').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].stackingGroup = '';
            chartObj.series[1].stackingGroup = '';
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.refresh();

        });
        it('Checking data label shape without fill', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_TextShape_0');
                expect(marker.getAttribute('stroke') === 'grey').toBe(true);
                expect(marker.getAttribute('stroke-width') === '2').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.series[0].marker.dataLabel.border.color = 'grey';
            chartObj.refresh();
        });
        it('Checking data label shape without fill for stackingcolumn100', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_TextShape_0');
                expect(marker.getAttribute('stroke') === 'grey').toBe(true);
                expect(marker.getAttribute('stroke-width') === '2').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.series[0].marker.dataLabel.border.color = 'grey';
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking font color saturation for stackingcolumn100', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'black';
            chartObj.chartArea.border.color = '';
            chartObj.refresh();
        });
        it('Checking font color saturation for StackingColumn', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'black';
            chartObj.chartArea.border.color = '';
            chartObj.series[0].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking font color saturation', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartArea.background = 'white';
            chartObj.refresh();

        });
        it('Checking with DataLabel bottom position', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y + series1.points[0].regions[0].height >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);

                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y + series2.points[0].regions[0].height >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();

        });
        it('Checking with DataLabel bottom position for stackingcolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y + series1.points[0].regions[0].height >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);

                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y + series2.points[0].regions[0].height >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.refresh();

        });
        it('Checking with DataLabel middle position for stackingcolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect((series1.points[0].regions[0].y + series1.points[0].regions[0].height) / 2 <=
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect((series2.points[0].regions[0].y + series2.points[0].regions[0].height) / 2 <=
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Checking with DataLabel middle position for StackingColumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect((series1.points[0].regions[0].y + series1.points[0].regions[0].height) / 2 <=
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect((series2.points[0].regions[0].y + series2.points[0].regions[0].height) / 2 <=
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.series[0].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking with DataLabel top position for stackingcolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });
        it('Checking with DataLabel top position for stackingcolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking with DataLabel outer position for stackingcolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.refresh();
        });
        it('Checking with DataLabel outer position for stackingcolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            chartObj.series[0].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and labelAlignment Near for stackingclolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');;
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and labelAlignment Near for stackingclolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');;
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and LabelAlignment far stackingclolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y > parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and LabelAlignment far stackingclolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y > parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and labelAlignment center for stackingcolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and labelAlignment center for stackingcolumn100', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.refresh();
        });
        it('Checking with datalabel Bottom position and labelAlignment Near for stackingcolumn100', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(dataLabel != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = seriesData1;
            chartObj.series[1].dataSource = seriesData1;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh();
        });
        it('Checking with datalabel Bottom position and labelAlignment Near for stackingcolumn', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(dataLabel != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn';
            chartObj.refresh();
        });
        it('checking with datalabel Bottom and LabelAlignment far for stackingcolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect((series1.points[0].regions[0].y + series1.points[0].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('checking with datalabel custom labelFormat', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(dataLabel.textContent === '70%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.primaryYAxis.labelFormat = '{value}%';
            chartObj.refresh();
        });
        it('checking with datalabel bottom position and LabelAlignment center', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect((series1.points[0].regions[0].y + series1.points[0].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.primaryYAxis.labelFormat = '';
            chartObj.refresh();
        });
        it('Checking with DataLabel top position for negative points', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                svg = document.getElementById('container_Series_0_Point_2');
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                expect((series1.points[2].regions[0].y + series1.points[2].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);

                svg = document.getElementById('container_Series_1_Point_5');
                dataLabel = document.getElementById('container_Series_1_Point_5_Text_0');
                expect((series2.points[5].regions[0].y + series2.points[5].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[1].marker.dataLabel.position = 'Top';
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking with DataLabel outer position for negative points', (done: Function) => {
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[1].marker.dataLabel.position = 'Outer';
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                expect((series1.points[2].regions[0].y + series1.points[2].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_5_Text_0');
                expect((series2.points[5].regions[0].y + series2.points[5].regions[0].height) >
                    parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with DataLabel bottom position for negative points', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(series1.points[2].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);

                dataLabel = document.getElementById('container_Series_1_Point_5_Text_0');
                expect(series2.points[5].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[1].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });
        it('Checking with DataLabel Middle position for negative points', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(series1.points[2].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_5_Text_0');
                expect(series2.points[5].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.series[1].marker.dataLabel.alignment = 'Center';
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[1].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Checking with border', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg.getAttribute('stroke') === 'green').toBe(true);
                expect(svg.getAttribute('stroke-width') === '2').toBe(true);
                svg = document.getElementById('container_Series_1_Point_3');
                expect(svg.getAttribute('stroke') === 'black');
                expect(svg.getAttribute('stroke-width') === '2').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].border.width = 2;
            chartObj.series[0].border.color = 'green';
            chartObj.series[1].border.width = 2;
            chartObj.series[1].border.color = 'black';
            chartObj.refresh();
        });
        it('Checking with empty data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].dataSource[3].x = null;
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);

                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'red', type: 'StackingColumn',
                animation: { enable: false }
            },
            {
                dataSource: data2, name: 'Gold', xName: 'x', yName: 'y', fill: 'rgba(135,206,235,1)', type: 'StackingColumn',
                animation: { enable: false }
            }];
            chartObj.refresh();
        });
        it('Checking with multiple series and stackingGroup', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                svg = document.getElementById('container_Series_2_Point_0');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                svg = document.getElementById('container_Series_3_Point_0');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'rgba(135,206,235,1)',
                type: 'StackingColumn', animation: { enable: false },
            },
            {
                dataSource: data2, name: 'Gold', xName: 'x', yName: 'y', fill: 'red', type: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'a',
            },
            {
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'green', type: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'a'
            },
            {
                dataSource: data2, name: 'Gold', xName: 'x', yName: 'y', fill: 'blue', type: 'StackingColumn',
                animation: { enable: false },
            }];
            chartObj.refresh();
        });
        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                svg = document.getElementById('container_Series_2_Point_0');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                svg = document.getElementById('container_Series_3_Point_0');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.height = '600';
            chartObj.series[1].yAxisName = 'yAxis1';
            chartObj.series[2].yAxisName = 'yAxis1';
            chartObj.rows = [{ border: { width: 4, color: 'red' }, height: '300' },
            { border: { width: 4, color: 'blue' } },];
            chartObj.refresh();
        });
        it('Checking animation', (done: Function) => {

           let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.series[3].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();

        });
        it('Checking animation for stackingcolumn100 series', (done: Function) => {

           let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                done();
            };
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.series[2].type = 'StackingColumn100';
            chartObj.series[3].type = 'StackingColumn100';
            chartObj.animationComplete = animate;
            chartObj.refresh();

        });
        it('Checking Events', (done: Function) => {
            loaded = (args: Object): void => {
                /*let element: HTMLElement = document.getElementById('container_Series_0_Point_2');
                expect(element.getAttribute('fill') == 'brown').toBe(true);
                element = document.getElementById('container_Series_0_Point_0');
                expect(element == null).toBe(true);*/
                done();
            };
            chartObj.pointRender =  (args : IPointRenderEventArgs) => {
              if (args.point.index === 0) {
                args.cancel = true;
              }
              if (args.point.index === 2) {
                   args.fill = 'brown';
              }
            };
            chartObj.loaded = loaded;
            chartObj.title = 'Events Changed';
            chartObj.dataBind();
         });
    });
});
describe('Chart Control', () => {
    describe('Chart column series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Months', edgeLabelPlacement: 'Shift',
                    },
                    primaryYAxis:
                    { title: 'Temperature (Celcius)', labelFormat: '{value}°C' },
                    axes: [{
                        rowIndex: 0, columnIndex: 0, name: 'yAxis1', title: 'YAxis1'
                    },
                    { rowIndex: 0, columnIndex: 0, name: 'yAxis2', title: 'YAxis2' },
                    { rowIndex: 1, columnIndex: 0, name: 'yAxis3', title: 'YAxis3' },
                    { rowIndex: 1, columnIndex: 0, name: 'yAxis4', title: 'YAxis4' },
                    { rowIndex: 0, columnIndex: 1, name: 'yAxis6', title: 'YAxis6', opposedPosition: true },
                    { rowIndex: 0, columnIndex: 1, name: 'yAxis5', title: 'YAxis5', opposedPosition: true },
                    { rowIndex: 1, columnIndex: 1, name: 'yAxis7', title: 'YAxis7', opposedPosition: true },
                    { rowIndex: 1, columnIndex: 1, name: 'yAxis8', title: 'YAxis8', opposedPosition: true, },
                    { columnIndex: 0, rowIndex: 0, name: 'xAxis1', interval: 1, minimum: 1, title: 'Xaxis1' },
                    { columnIndex: 0, rowIndex: 0, name: 'xAxis2', interval: 1, minimum: 1, title: 'Xaxis2' },
                    { columnIndex: 1, rowIndex: 0, name: 'xAxis3', interval: 1, minimum: 1, title: 'Xaxis3' },
                    { columnIndex: 1, rowIndex: 0, name: 'xAxis4', minimum: 1, interval: 1, title: 'Xaxis4' },
                    { columnIndex: 0, rowIndex: 1, name: 'xAxis5', interval: 1, minimum: 1, title: 'Xaxis5', opposedPosition: true },
                    { columnIndex: 0, rowIndex: 1, name: 'xAxis6', interval: 1, minimum: 1, title: 'Xaxis6', opposedPosition: true },
                    { columnIndex: 1, rowIndex: 1, name: 'xAxis7', interval: 1, minimum: 1, title: 'Xaxis7', opposedPosition: true },
                    { columnIndex: 1, rowIndex: 1, interval: 1, name: 'xAxis8', title: 'Xaxis8', minimum: 1, opposedPosition: true },
                    ],
                    series: [{
                        dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column',
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column',
                        name: 'ChartSeriesNameGold1', fill: 'black',
                        xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'Column',
                        name: 'ChartSeriesNameDiamond', fill: 'blue',
                        xAxisName: 'xAxis2', yAxisName: 'yAxis2',
                    }],
                    rows: [{ height: '300', border: { width: 2, color: 'red' } },
                    { height: '300', border: { width: 2, color: 'red' } }],
                    columns: [{ width: '300', border: { width: 2, color: 'black' } },
                    { width: '300', border: { width: 2, color: 'black' } }],
                    height: '600'
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        }); 
        it('Checking with multiple axes with two columns', (done: Function) => {
            loaded = (args: Arg): void => {
                let axis: Axis[] = args.chart.horizontalAxes;
                let series1: Series[] = axis[0].series;
                let rectcount: number = series1[0].rectCount;
                expect(rectcount === 2).toBe(true);
                done();
            };
            chartObj.axes = [{
                rowIndex: 0, columnIndex: 0, name: 'yAxis1', title: 'YAxis1',
            },
            {
                rowIndex: 0, columnIndex: 0, name: 'yAxis2', title: 'YAxis2',
            },

            {
                rowIndex: 0, columnIndex: 1,  name: 'yAxis3', title: 'YAxis3',
            },
            {
                rowIndex: 0, columnIndex: 1, name: 'yAxis4', title: 'YAxis4',
            }];
            chartObj.series = [{
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis1', stackingGroup: 'a'
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameGold1', fill: 'black',
                xAxisName: 'yAxis1', 
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameGold2', fill: 'red',
                xAxisName: 'yAxis1', 
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameGold3', fill: 'green',
                xAxisName: 'yAxis1'
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameDiamond', fill: 'blue',
                xAxisName: 'yAxis2', stackingGroup: 'a'
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameDiamond', fill: 'rgba(135,206,235,1)',
                xAxisName: 'yAxis2',
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameDiamond1', fill: 'yellow',
                xAxisName: 'yAxis2'
            },
            {
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameSilver', fill: 'blue',
                xAxisName: 'yAxis3', stackingGroup: 'a'
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingColumn',
                name: 'ChartSeriesNameSilver1', fill: 'black',
                xAxisName: 'yAxis3',
            },
            {
                dataSource: seriesData1, xName: 'x', yName: 'y', animation: { enable: false },
                type: 'StackingColumn',
                name: 'ChartSeriesNameRuby', fill: 'red',
                xAxisName: 'yAxis4', stackingGroup: 'a'
            }];
            chartObj.rows = [{}];
            chartObj.loaded = loaded;
            chartObj.refresh();
        }); 
    });
    describe('stacking column Series Inversed axis', () => {
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
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', isInversed: true },
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'StackingColumn', fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    },
                    {
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                        { x: 3000, y: 90 }, { x: 4000, y: 50 },
                        { x: 5000, y: 50 }, { x: 6000, y: 60 },
                        { x: 7000, y: -40 }, { x: 8000, y: -70 }], xName: 'x', yName: 'y',
                        type: 'StackingColumn',
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
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Auto';
            chart.refresh();

        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.series[1].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[1].marker.dataLabel.position = 'Top';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let point : Points = (<Points>(<Series>chart.series[0]).points[1]);
                pointY = point.regions[0].x + point.regions[0].width;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                point = (<Points>(<Series>chart.series[0]).points[0]);
                pointY = point.regions[0].x;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.series[1].marker.dataLabel.position = 'Bottom';
            chart.refresh();

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
            chart.series[1].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });
    });
        describe('checking rotated stackingColumn chart', () => {
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
                    { type: 'StackingColumn', name: 'columnSeries1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false }},
                    { type: 'StackingColumn', name: 'columnSeries2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false } }
                ],
                title: 'rotated Stacking Column Chart'
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
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.refresh();
        });
        it('checking with datalabel Middle position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) < (point.symbolLocations[0].x + point.regions[0].width / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                //position yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x - point.regions[0].width).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x + point.regions[0].width).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
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
        it('checking with tooltip negative values', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')));
                done();
            };
            chart.loaded = loaded;
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
});
export interface series1 {
    series: Series;
}

