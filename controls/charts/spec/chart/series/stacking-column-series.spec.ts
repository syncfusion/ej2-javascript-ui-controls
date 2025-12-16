
/**
 * Specifies the StackingColumn series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType } from '../../../src/chart/utils/enum';
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
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs, IAxisLabelRenderEventArgs, ITooltipRenderEventArgs } from '../../../src/chart/model/chart-interface';
import { Legend } from '../../../src/chart/legend/legend';

Chart.Inject(LineSeries, StackingColumnSeries, DateTime, Category, DataLabel, ColumnSeries, Legend);
let data: any = tooltipData21;
let data2: any = tooltipData22;
let dateTime: any = datetimeData21;
let point: Points[];
export interface Arg {
    chart: Chart;
}

describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
                expect(series2.points[0].regions[0].y > parseFloat(dataLabel.getAttribute('y'))).toBe(true);
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
                expect(series1.points[0].regions[0].y > parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                dataLabel = document.getElementById('container_Series_1_Point_0_Text_0');
                expect(series2.points[0].regions[0].y > parseFloat(dataLabel.getAttribute('y'))).toBe(true);
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
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.series[0].marker.dataLabel.alignment = 'Far';
            chartObj.refresh();
        });
        it('Checking with datalabel top position and LabelAlignment far stackingclolumn', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                dataLabel = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(series1.points[0].regions[0].y < parseFloat(dataLabel.getAttribute('y'))).toBe(true);
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
                expect((series2.points[5].regions[0].y + series2.points[5].regions[0].height) <
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
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg.childElementCount === 8 || svg.childElementCount === 9).toBe(true);
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
        it('Checking animation', async (): Promise<void> => {
            let animate: EmitType<IAnimationCompleteEventArgs>;
            loaded = (args: Object): void => {
                animate = (args: series1): void => {
                    let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                    expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                    //done();
                };
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.series[3].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);

        });
        it('Checking animation for stackingcolumn100 series', async (): Promise<void> => {
            let animate: EmitType<IAnimationCompleteEventArgs>;
            loaded = (args: Object): void => {
                animate = (args: series1): void => {
                    let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                    expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                    //done();
                };
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.series[2].type = 'StackingColumn100';
            chartObj.series[3].type = 'StackingColumn100';
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);

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
    async function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    describe('StackingColumn and StackingColumn100 Series in Cyliderical shape', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Vehicles Production (In Millions)', majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                    series: [
                        {
                            animation: { enable: false }, name: 'General Motors',
                            dataSource: [{ x: '2013', y: 9628912 },
                                { x: '2014', y: 9609326 },
                                { x: '2015', y: 7485587 },
                                { x: '2016', y: 7793066 },
                                { x: '2017', y: 6856880 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn', fill: 'skyblue'
                        },
                        {
                            animation: { enable: false }, name: 'Honda',
                            dataSource: [{ x: '2013', y: 4298390 },
                                { x: '2014', y: 4513769 },
                                { x: '2015', y: 4543838 },
                                { x: '2016', y: 4999266 },
                                { x: '2017', y: 5235842 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn', fill: 'orange'
                        },
                        {
                            animation: { enable: false }, name: 'BMW',
                            dataSource: [{ x: '2013', y: 2842133 },
                                { x: '2014', y: 3016710 },
                                { x: '2015', y: 3034081 },
                                { x: '2016', y: 2945295 },
                                { x: '2017', y: 3302336 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn', fill: 'pink'
                        }
                    ],
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Motor Vehicle Production by Manufacturer', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('StackingColumn Series type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_1_Point_2_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_1_Point_2_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_1_Point_2_Region_2').getAttribute('d');
                expect(region1 === 'M301.43,122.53484968749999a49.07000000000002,12.267500000000005 0 1,0 98.14000000000004,0a49.07000000000002,12.267500000000005 0 1,0 -98.14000000000004,0').toBe(true);
                expect(region2 === 'M301.43,199.38250986249997a49.07000000000002,12.267500000000005 0 1,0 98.14000000000004,0a49.07000000000002,12.267500000000005 0 1,0 -98.14000000000004,0').toBe(true);
                expect(region3 === 'M301.43,122.53484968749999a49.07000000000002,12.267500000000005 0 1,0 98.14000000000004,0l0 76.84766017499999a49.07000000000002,12.267500000000005 0 1,1 -98.14000000000004,0 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('ColumnFacet property as Cylinder with DataLabel', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_0_Point_3_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_0_Point_3_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_0_Point_3_Region_2').getAttribute('d');
                expect(region1 === 'M441.63,114.49378545833335a16.356666666666655,4.089166666666664 0 1,0 32.71333333333331,0a16.356666666666655,4.089166666666664 0 1,0 -32.71333333333331,0').toBe(true);
                expect(region2 === 'M441.63,334.16083333333336a16.356666666666655,4.089166666666664 0 1,0 32.71333333333331,0a16.356666666666655,4.089166666666664 0 1,0 -32.71333333333331,0').toBe(true);
                expect(region3 === 'M441.63,114.49378545833335a16.356666666666655,4.089166666666664 0 1,0 32.71333333333331,0l0 219.66704787499998a16.356666666666655,4.089166666666664 0 1,1 -32.71333333333331,0 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[1].marker.dataLabel.visible = true;
            chartObj.series[2].marker.dataLabel.visible = true;
            chartObj.series[0].type = 'Column';
            chartObj.series[1].type = 'Column';
            chartObj.series[2].type = 'Column';
            chartObj.refresh();
        });

        it('StackingColumn100 Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_0_Point_3_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_0_Point_3_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_0_Point_3_Region_2').getAttribute('d');
                expect(region1 === 'M460.53000000000003,157.96054671091775a51.16999999999999,12.792499999999997 0 1,0 102.33999999999997,0a51.16999999999999,12.792499999999997 0 1,0 -102.33999999999997,0').toBe(true);
                expect(region2 === 'M460.53000000000003,325.4575a51.16999999999999,12.792499999999997 0 1,0 102.33999999999997,0a51.16999999999999,12.792499999999997 0 1,0 -102.33999999999997,0').toBe(true);
                expect(region3 === 'M460.53000000000003,157.96054671091775a51.16999999999999,12.792499999999997 0 1,0 102.33999999999997,0l0 167.49695328908226a51.16999999999999,12.792499999999997 0 1,1 -102.33999999999997,0 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.series[2].type = 'StackingColumn100';
            chartObj.refresh();
        });

        it('Checking animation for stackingcolumn series in Cylindrical chart', async (): Promise<void> => {
            loaded = (args: Object): void => {
                animate = (args: IAnimationCompleteEventArgs): void => {
                    let point = document.getElementById('container_Series_' + args.series.index + '_Point_4_Region_2');
                    expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                    //done();
                };
            };
            chartObj.loaded = loaded;
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);
        });

        it('Checking animation for stackingcolumn100 series in Cylindrical chart', async (): Promise<void> => {
            loaded = (args: Object): void => {
                animate = (args: IAnimationCompleteEventArgs): void => {
                    let point = document.getElementById('container_Series_' + args.series.index + '_Point_4_Region_2');
                    expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                    //done();
                };
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingColumn100';
            chartObj.series[1].type = 'StackingColumn100';
            chartObj.series[2].type = 'StackingColumn100';
            chartObj.animationComplete = animate;
            chartObj.refresh();
            await wait(2000);
        });

    });

    describe('StackingColumn100 Series in Cyliderical shape', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Vehicles Production (In Millions)', majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                    series: [
                        {
                            animation: { enable: false }, name: 'General Motors',
                            dataSource: [{ x: '2013', y: 9628912 },
                                { x: '2014', y: 9609326 },
                                { x: '2015', y: 7485587 },
                                { x: '2016', y: 7793066 },
                                { x: '2017', y: 6856880 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn100', fill: 'purple'
                        },
                        {
                            animation: { enable: false }, name: 'Honda',
                            dataSource: [{ x: '2013', y: 4298390 },
                                { x: '2014', y: 4513769 },
                                { x: '2015', y: 4543838 },
                                { x: '2016', y: 4999266 },
                                { x: '2017', y: 5235842 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn100', fill: 'green'
                        },
                        {
                            animation: { enable: false }, name: 'BMW',
                            dataSource: [{ x: '2013', y: 2842133 },
                                { x: '2014', y: 3016710 },
                                { x: '2015', y: 3034081 },
                                { x: '2016', y: 2945295 },
                                { x: '2017', y: 3302336 }],
                            xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                            type: 'StackingColumn100', fill: 'yellow'
                        }
                    ],
                    height: '400', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Motor Vehicle Production by Manufacturer', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('ColumnFacet property as Cylinder with fill color', (done: Function) => {
            loaded = (args: Object): void => {
                let region1: string = document.getElementById('container_Series_2_Point_3_Region_1').getAttribute('d');
                let region2: string = document.getElementById('container_Series_2_Point_3_Region_0').getAttribute('d');
                let region3: string = document.getElementById('container_Series_2_Point_3_Region_2').getAttribute('d');
                expect(region1 === 'M441,12.25a49,12.25 0 1,0 98,0a49,12.25 0 1,0 -98,0' || region1 === 'M428.4,11.900000000000006a47.60000000000002,11.900000000000006 0 1,0 95.20000000000005,0a47.60000000000002,11.900000000000006 0 1,0 -95.20000000000005,0'
                    || region1 === 'M417.06,11.585a46.34,11.585 0 1,0 92.68,0a46.34,11.585 0 1,0 -92.68,0').toBe(true);
                expect(region2 === 'M441,41.69595282694144a49,12.25 0 1,0 98,0a49,12.25 0 1,0 -98,0' || region2 === 'M428.4,42.04595282694144a47.60000000000002,11.900000000000006 0 1,0 95.20000000000005,0a47.60000000000002,11.900000000000006 0 1,0 -95.20000000000005,0'
                    || region2 === 'M417.06,42.36095282694144a46.34,11.585 0 1,0 92.68,0a46.34,11.585 0 1,0 -92.68,0').toBe(true);
                expect(region3 === 'M441,12.25a49,12.25 0 1,0 98,0l0 29.445952826941443a49,12.25 0 1,1 -98,0 z' || region3 === 'M428.4,11.900000000000006a47.60000000000002,11.900000000000006 0 1,0 95.20000000000005,0l0 30.145952826941432a47.60000000000002,11.900000000000006 0 1,1 -95.20000000000005,0 z'
                    || region3 === 'M417.06,11.585a46.34,11.585 0 1,0 92.68,0l0 30.77595282694144a46.34,11.585 0 1,1 -92.68,0 z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Checking Cylindrical chart in Canvas Mode.', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'CanvasContainer' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                primaryYAxis: { title: 'Vehicles Production (In Millions)', majorGridLines: { width: 0 }, minorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelFormat: '{value}' },
                series: [
                    {
                        animation: { enable: false }, name: 'Honda',
                        dataSource: [{ x: '2013', y: 4298390 },
                            { x: '2014', y: 4513769 },
                            { x: '2015', y: 4543838 },
                            { x: '2016', y: 4999266 },
                            { x: '2017', y: 5235842 }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingColumn', fill: 'skyblue'
                    },
                    {
                        animation: { enable: false }, name: 'Suzuki',
                        dataSource: [{ x: '2013', y: 2842133 },
                            { x: '2014', y: 3016710 },
                            { x: '2015', y: 3034081 },
                            { x: '2016', y: 2945295 },
                            { x: '2017', y: 3302336 }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingColumn', fill: 'orange'
                    },
                    {
                        animation: { enable: false }, name: 'BMW',
                        dataSource: [{ x: '2013', y: 2006366  },
                            { x: '2014', y: 2165566  },
                            { x: '2015', y: 2279503  },
                            { x: '2016', y: 2359756  },
                            { x: '2017', y: 2505741  }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingColumn', fill: 'pink'
                    }
                ],
                width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                title: 'Motor Vehicle Production by Manufacturer', loaded: loaded
            });
            chart.appendTo('#CanvasContainer');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('Checking Cylindrical chart render in canvas mode to stackingcolumn series', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementsByTagName('canvas')[0].id).toEqual('CanvasContainer_canvas');
                done();
            };
            chart.enableCanvas = true;
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Checking Cylindrical chart render in canvas mode to stackingcolumn100 series', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementsByTagName('canvas')[0].id).toEqual('CanvasContainer_canvas');
                done();
            };
            chart.enableCanvas = true;
            chart.series[0].type = 'StackingColumn100';
            chart.series[1].type = 'StackingColumn100';
            chart.series[2].type = 'StackingColumn100';
            chart.loaded = loaded;
            chart.refresh();
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
                let series1: Series[] = axis[1].series;
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
                let series1: Series[] = axis[1].series;
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
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[0]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
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
                expect(+(dataLabel.getAttribute('x')) > point.symbolLocations[0].x).toBe(true);
                //negative yValues
                dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[1]);
                expect(+(dataLabel.getAttribute('x')) < point.symbolLocations[0].x).toBe(true);
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
        it('Stacking Column - Checking setData method', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1');
                expect(dataLabel !== null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            let seriesColumnData = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: -30 },
            { x: new Date(2004, 3, 6), y: 27 }, { x: new Date(2006, 3, 30), y: -65 },
            { x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }]
            chart.series[0].setData(seriesColumnData);
            chart.refresh();unbindResizeEvents(chart);
        });
    }); 
    describe('Staking Column - Checking legend click animation.', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let path: string[];
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            elem = createElement('div', { id: 'StackingColumncontainer' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                series: [
                    {
                        dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                        { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                        xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                        type: 'StackingColumn', animation: { enable: false },
                        marker: { visible: true, dataLabel: { visible: true } },
                        name:'Column1'
                    },
                    {
                        dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                        { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: 30 }, { x: 6, y: 20 }],
                        xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                        type: 'StackingColumn', animation: { enable: false },
                        marker: { visible: true, dataLabel: { visible: true } },
                        name:'Column2'
                    }
                ],
                legendSettings: { visible: true },
            });
            chartObj.appendTo('#StackingColumncontainer');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Stacking column - legend click animation', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('StackingColumncontainer_chart_legend_text_0');
                trigger.clickEvent(legendElement);
                expect(legendElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Stacking column - with transposed true and column width in pixel', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement = document.getElementById('StackingColumncontainer_chart_legend_text_0');
                trigger.clickEvent(legendElement);
                expect(legendElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].columnWidthInPixel = 15;
            chartObj.isTransposed = true;
            chartObj.refresh();
        });
        it('Checking StackLabels', (done: Function) => {
            loaded = (args: Object): void => {
                const stackLabel: Element = document.getElementById('StackingColumncontainer_StackLabel_3');
                const stackLabelRect: Element = document.getElementById('StackingColumncontainerStackLabel_TextShape_4');
                expect(stackLabel !== null).toBe(true);
                expect(stackLabel.innerHTML).toBe('50');
                expect(stackLabel.getAttribute('x') === '568.2857142857143' || stackLabel.getAttribute('x') === '525.4285714285714' 
                || stackLabel.getAttribute('x') === '541.1428571428571' || stackLabel.getAttribute('x') === '554').toBe(true);
                expect(stackLabel.getAttribute('y')).toBe('163.75');
                expect(stackLabel.getAttribute('transform') === 'rotate(270, 568.2857142857143, 163.75)' || stackLabel.getAttribute('transform') === 'rotate(270, 525.4285714285714, 158.75)'
                || stackLabel.getAttribute('transform') === 'rotate(270, 541.1428571428571, 163.75)' || stackLabel.getAttribute('transform') === 'rotate(270, 554, 163.75)').toBe(true);
                expect(stackLabelRect !== null).toBe(true);
                expect(stackLabelRect.getAttribute('x') === '660.6428571428571' || stackLabelRect.getAttribute('x') === '609.2142857142857' || stackLabelRect.getAttribute('x') === '628.0714285714286'
                || stackLabelRect.getAttribute('x') === '643.5').toBe(true);
                expect(stackLabelRect.getAttribute('y') === '69.5' || stackLabelRect.getAttribute('y') === '65.5' || stackLabelRect.getAttribute('x') === '643').toBe(true);
                expect(stackLabelRect.getAttribute('transform') === 'rotate(270, 671.6428571428571, 89.5)' || stackLabelRect.getAttribute('transform') === 'rotate(270, 620.2142857142857, 84.5)'
                || stackLabelRect.getAttribute('transform') === 'rotate(270, 639.0714285714286, 89.5)' || stackLabelRect.getAttribute('transform') === 'rotate(270, 654.5, 89.5)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.stackLabels.visible = true;
            chartObj.stackLabels.angle = 270;
            chartObj.stackLabels.border = { width: 1, color: 'black' };
            chartObj.refresh();
        });
        it('Checking StackLabels inversed', (done: Function) => {
            loaded = (args: Object): void => {
                const stackLabel: Element = document.getElementById('StackingColumncontainer_StackLabel_3');
                const stackLabelRect: Element = document.getElementById('StackingColumncontainerStackLabel_TextShape_4');
                expect(stackLabel !== null).toBe(true);
                expect(stackLabel.innerHTML).toBe('50');
                expect(stackLabel.getAttribute('x') == '439.9583333333333' || stackLabel.getAttribute('x') == '417.79166666666663' || parseInt(stackLabel.getAttribute('x')) == 428).toBe(true);
                expect(stackLabel.getAttribute('y')).toBe('25.25');
                expect(stackLabel.getAttribute('transform') == 'rotate(270, 439.9583333333333, 25.25)' || stackLabel.getAttribute('transform') == 'rotate(270, 417.79166666666663, 25.25)'
                || stackLabel.getAttribute('transform') == 'rotate(270, 428.29166666666663, 25.25)').toBe(true);
                expect(stackLabelRect !== null).toBe(true);
                expect(stackLabelRect.getAttribute('x') == '669.7916666666667' || stackLabelRect.getAttribute('x') == '634.9583333333333' || parseInt(stackLabelRect.getAttribute('x')) == 651).toBe(true);
                expect(stackLabelRect.getAttribute('y')).toBe('31.36538461538462');
                expect(stackLabelRect.getAttribute('transform') == 'rotate(270, 680.7916666666667, 51.36538461538462)' || stackLabelRect.getAttribute('transform') == 'rotate(270, 645.9583333333333, 51.36538461538462)'
                || stackLabelRect.getAttribute('transform') == 'rotate(270, 662.4583333333334, 51.36538461538462)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.stackLabels.visible = true;
            chartObj.stackLabels.font.textAlignment = 'Near';
            chartObj.stackLabels.angle = 270;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.series = [
                {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: -30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                    type: 'StackingColumn', animation: { enable: false },
                    marker: { visible: true, dataLabel: { visible: true } },
                    name: 'Column1'
                },
                {
                    dataSource: [{ x: 1, y: 10 }, { x: 2, y: null },
                    { x: 3, y: 15 }, { x: 4, y: 25 }, { x: 5, y: -30 }, { x: 6, y: 20 }],
                    xName: 'x', yName: 'y', emptyPointSettings: { mode: 'Average' },
                    type: 'StackingColumn', animation: { enable: false },
                    marker: { visible: true, dataLabel: { visible: true } },
                    name: 'Column2'
                }
            ];
            chartObj.refresh();
        });
    });
    describe('Staking Column - Checking datalabel.', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                series: [
                    {
                        trendlines: [],
                        dataSource: [
                            {
                                x: 'AA0',
                                y: 1,
                                text: '1.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'BB0',
                                y: 2,
                                text: '2.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'CC0',
                                y: 3,
                                text: '3.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'DD0',
                                y: 4,
                                text: '4.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'EE0',
                                y: 5,
                                text: '5.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'FF0',
                                y: 6,
                                text: '6.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'GG0',
                                y: 7,
                                text: '7.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'HH0',
                                y: 8,
                                text: '8.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'II0',
                                y: 9,
                                text: '9.00',
                                tooltip: '',
                                fill: null,
                            },
                            {
                                x: 'JJ0',
                                y: 10,
                                text: '10.00',
                                tooltip: '',
                                fill: null,
                            },
                        ],
                        xName: 'x',
                        yName: 'y',
                        type: 'StackingColumn',
                        columnFacet: 'Rectangle',
                        name: 'DRIVE',
                        xAxisName: null,
                        yAxisName: null,
                        pointColorMapping: 'fill',
                        visible: true,
                        border: {
                            color: 'transparent',
                            width: 0,
                        },
                        dashArray: '',
                        marker: {
                            border: {
                                color: 'Transparent',
                            },
                            visible: false,
                            shape: 'Circle',
                            width: 7.999999998,
                            height: 7.999999998,
                            dataLabel: {
                                font: {
                                    color: 'Black',
                                    fontFamily: 'Arial',
                                    fontStyle: 'normal',
                                    fontWeight: 'default',
                                    size: '11.423999786376953px',
                                },
                                border: {},
                                visible: true,
                                labelIntersectAction: 'None',
                                angle: 0,
                                fill: 'Transparent',
                                name: 'text',
                                alignment: 'Center',
                                position: 'Bottom',
                            },
                        },
                        fill: '#418cf0',
                        width: 1.3333,
                        animation: {
                            enable: true,
                        },
                        tooltipFormat: ' machine_name : ${point.x}<br/>DRIVE : ${point.text}',
                    },
                    {
                        trendlines: [],
                        dataSource: [
                            {
                                x: 'AA0',
                                y: 1,
                                text: '1.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'BB0',
                                y: 2,
                                text: '2.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'CC0',
                                y: 3,
                                text: '3.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'DD0',
                                y: 4,
                                text: '4.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'EE0',
                                y: 5,
                                text: '5.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'FF0',
                                y: 6,
                                text: '6.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'GG0',
                                y: 7,
                                text: '7.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'HH0',
                                y: 8,
                                text: '8.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'II0',
                                y: 9,
                                text: '9.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                            {
                                x: 'JJ0',
                                y: 10,
                                text: '10.00',
                                tooltip: '',
                                fill: '#ef5350',
                            },
                        ],
                        xName: 'x',
                        yName: 'y',
                        type: 'StackingColumn',
                        columnFacet: 'Rectangle',
                        name: 'HEATING',
                        xAxisName: null,
                        yAxisName: null,
                        pointColorMapping: 'fill',
                        visible: true,
                        border: {
                            color: 'transparent',
                            width: 0,
                        },
                        dashArray: '',
                        marker: {
                            border: {
                                color: 'Transparent',
                            },
                            visible: false,
                            shape: 'Circle',
                            width: 7.999999998,
                            height: 7.999999998,
                            dataLabel: {
                                font: {
                                    color: 'Black',
                                    fontFamily: 'Arial',
                                    fontStyle: 'normal',
                                    fontWeight: 'default',
                                    size: '11.423999786376953px',
                                },
                                border: {},
                                visible: true,
                                labelIntersectAction: 'None',
                                angle: 0,
                                fill: 'Transparent',
                                name: 'text',
                                alignment: 'Center',
                                position: 'Bottom',
                            },
                        },
                        fill: '#ef5350',
                        width: 1.3333,
                        animation: {
                            enable: true,
                        },
                        tooltipFormat: ' machine_name : ${point.x}<br/>HEATING : ${point.text}',
                    },
                ],
               
                primaryXAxis: {
                    titleStyle: {
                        color: 'Black',
                        size: '10.666666664px',
                        fontFamily: 'Segoe UI',
                        fontStyle: 'Default',
                    },
                    title: '',
                    labelStyle: {
                        color: 'Black',
                        fontFamily: 'Segoe UI',
                        size: '10.666666664px',
                        fontStyle: 'Normal',
                        fontWeight: 'Default',
                    },
                    border: {},
                    lineStyle: {
                        color: '#808080',
                        width: 0,
                    },
                    majorGridLines: {
                        width: 0,
                    },
                    minorGridLines: {
                        width: 0,
                    },
                    majorTickLines: {
                        width: 0,
                    },
                    minorTickLines: {
                        width: 0,
                    },
                    minorTicksPerInterval: 4,
                    multiLevelLabels: [],
                    stripLines: [],
                    edgeLabelPlacement: 'Shift',
                    isIndexed: false,
                    labelFormat: '',
                    tickPosition: 'Outside',
                    labelRotation: -45,
                    visible: true,
                    valueType: 'Category',
                },
                primaryYAxis: {
                    titleStyle: {
                        color: 'Black',
                        size: '10.666666664px',
                        fontFamily: 'Segoe UI',
                        fontStyle: 'Default',
                    },
                    title: '',
                    labelStyle: {
                        color: 'Black',
                        fontFamily: 'Segoe UI',
                        size: '10.666666664px',
                        fontStyle: 'Normal',
                        fontWeight: 'Default',
                    },
                    border: {},
                    lineStyle: {
                        color: '#808080',
                        width: 0,
                    },
                    majorGridLines: {
                        color: '#dcdcdc',
                        width: 1.3333,
                    },
                    minorGridLines: {
                        width: 0,
                    },
                    majorTickLines: {
                        width: 0,
                    },
                    minorTickLines: {
                        width: 0,
                    },
                    minorTicksPerInterval: 4,
                    multiLevelLabels: [],
                    stripLines: [],
                    edgeLabelPlacement: 'Shift',
                    labelFormat: '',
                    labelPlacement: 'OnTicks',
                    tickPosition: 'Outside',
                    labelIntersectAction: 'Trim',
                    visible: true,
                    plotOffset: 10,
                },
            });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Stacking column - datalabel position', function (done) {
            loaded = function (args) {
                let legendElement = document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('x');
                let legendElement1 = document.getElementById('container_Series_1_Point_0_Text_0').getAttribute('x');
                expect(legendElement).toBe('16');
                expect(legendElement1).toBe('16');
                legendElement = document.getElementById('container_Series_0_Point_0_Text_0').getAttribute('y');
                legendElement1 = document.getElementById('container_Series_1_Point_0_Text_0').getAttribute('y');
                expect(legendElement == '132.31040954589844' || legendElement == '129.3302459716797').toBe(true);
                expect(legendElement1 == '127.8333958943685' || legendElement1 == '124.95257110595703').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.height = '240px';
            chartObj.width = '336px';
            chartObj.refresh();
        });
    });
    describe('StackingColumn and StackingColumn100 Series in Cyliderical shape', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animate: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                         interval: 1,
                         valueType: 'Category',
                       },
                       //Initializing Primary Y Axis
                       primaryYAxis: {
                         maximum: 60,
                         interval: 10,
                       },
                       stackLabels: {
                         visible: true,
                         format: '{value}M',
                         font: {
                           size:  '12px',
                         },
                       },
                       //Initializing Chart Series
                       series: [
                         {
                           type: 'StackingColumn',
                           dataSource: [
                             { x: '2018', y: 24.5 },
                             { x: '2019', y: 25.6 },
                             { x: '2020', y: 29 },
                             { x: '2021', y: 28.5 },
                             { x: '2022', y: 30.6 },
                           ],
                           xName: 'x',
                           stackingGroup: 'Asia',
                           yName: 'y',
                           name: 'Iran',
                           columnWidth: 0.6,
                           marker: { dataLabel: { visible: true } },
                         },
                         {
                           type: 'StackingColumn',
                           dataSource: [
                             { x: '2018', y: 6.2 },
                             { x: '2019', y: 15.6 },
                             { x: '2020', y: 14.3 },
                             { x: '2021', y: 9.3 },
                             { x: '2022', y: 7.8 },
                           ],
                           xName: 'x',
                           stackingGroup: 'Asia',
                           yName: 'y',
                           name: 'Indonesia',
                           columnWidth: 0.6,
                           marker: { dataLabel: { visible: true } },
                         },
                         {
                           type: 'StackingColumn',
                           dataSource: [
                             { x: '2018', y: 24.5 },
                             { x: '2019', y: 23.2 },
                             { x: '2020', y: 20.4 },
                             { x: '2021', y: 23.2 },
                             { x: '2022', y: 24.5 },
                           ],
                           xName: 'x',
                           stackingGroup: 'Europe',
                           yName: 'y',
                           name: 'Italy',
                           columnWidth: 0.6,
                           marker: { dataLabel: { visible: true } },
                         },
                         {
                           type: 'StackingColumn',
                           dataSource: [
                             { x: '2018', y: 15.4 },
                             { x: '2019', y: 21.1 },
                             { x: '2020', y: 13.9 },
                             { x: '2021', y: 11.6 },
                             { x: '2022', y: 14.4 },
                           ],
                           xName: 'x',
                           stackingGroup: 'Europe',
                           yName: 'y',
                           name: 'France',
                           columnWidth: 0.6,
                           marker: { dataLabel: { visible: true } },
                         },
                       ],

                       //Initializing Chart title
                       title: 'Steel Production by Countries, Grouped by Continent',
                       //Initializing User Interaction Tooltip
                       tooltip: {
                         enable: true,
                         format: '${point.x} : <b>${point.y} Mmt',
                       },

                       legendSettings: {
                         visible: true,
                         enableHighlight: true,
                         shapeWidth: 9,
                         shapeHeight: 9,
                       },
                       load: (args: ILoadedEventArgs) => {

                       },
                       axisLabelRender: (args: IAxisLabelRenderEventArgs) => {
                         const value: number = parseInt(args.text.replace(/,/g, ''), 10);
                         if (value >= 1000) {
                           args.text = value / 1000 + 'K';
                         }
                       },
                       tooltipRender: (args: ITooltipRenderEventArgs) => {
                         if (args.text) {
                           let value: string = args.point.y.toLocaleString('en-US');
                           args.text = `${args.series.name}: <b>${value}</b>`;
                         }
                       },
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });
        it('Stacking column grouped - stacking label position', function (done) {
            loaded = function (args) {
                let stackLabel = document.getElementById('container_StackLabel_0').getAttribute('x');
                let stackLabel1 = document.getElementById('container_StackLabel_2').getAttribute('x');
                let stackLabel2 = document.getElementById('container_StackLabel_4').getAttribute('x');
                let stackContent = document.getElementById('container_StackLabel_2').textContent;
                expect(stackContent).toBe('43.3M');
                stackContent = document.getElementById('container_StackLabel_0').textContent;
                expect(stackContent).toBe('30.7M');
                stackContent = document.getElementById('container_StackLabel_4').textContent;
                expect(stackContent).toBe('38.4M');
                expect(stackLabel == '83.355' || stackLabel == '80.69500000000001' || stackLabel == '81.955').toBe(true);
                expect(stackLabel1 == '373.95500000000004' || stackLabel1 == '356.095' || stackLabel1 == '364.555').toBe(true);
                expect(stackLabel2 == '664.5550000000001' || stackLabel2 == '631.495' || stackLabel2 == '647.155').toBe(true);
                stackLabel = document.getElementById('container_StackLabel_0').getAttribute('y');
                stackLabel1 = document.getElementById('container_StackLabel_2').getAttribute('y');
                stackLabel2 = document.getElementById('container_StackLabel_4').getAttribute('y');
                expect(stackLabel).toBe('198.42875');
                expect(stackLabel1).toBe('127.39625000000004');
                expect(stackLabel2).toBe('155.01999999999998');
                done(); 
            };
            chartObj.loaded = loaded;
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
    });
});
export interface series1 {
    series: Series;
}

