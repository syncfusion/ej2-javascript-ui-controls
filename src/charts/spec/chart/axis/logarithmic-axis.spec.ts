
/**
 * Specifies the logarithmic spec.
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { unbindResizeEvents } from '../base/data.spec';
import { seriesData1, datetimeData } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAxisLabelRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Logarithmic, ColumnSeries, AreaSeries, BarSeries, DateTime);
let data: any = seriesData1;
let datetime: any = datetimeData;
export interface Arg {
    chart: Chart;
}
describe('Chart Control', () => {
    describe('Chart Logarithmic axis', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis',
                        valueType: 'Logarithmic'
                    },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'None'  },
                    series: [{
                        dataSource: [
                            { y: 18, x: 1 }, { y: 29, x: 2 }, { y: 30, x: 3 }, { y: 41, x: 4 },
                            { y: 52, x: 5 }, { y: 62, x: 6 },
                            { y: 74, x: 7 }, { y: 85, x: 8 }, { y: 96, x: 9 }, { y: 102, x: 10 }
                        ], xName: 'x', yName: 'y', animation: { enable: false }, type: 'Line',
                        name: 'ChartSeriesNameGold', fill: 'green',
                    },
                    ],  width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false}
                });

        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with labels for primaryXAxis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById("containerAxisLabels0");
                expect(svg.childNodes.length == 2).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#container');
        });
        it('Checking with axis labels for primaryXAxis with logBase 2', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length === 5).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.logBase = 2;
            chartObj.primaryXAxis.interval = null;
            chartObj.refresh();

        });
        it('checking axis labels for primaryXAxis with range', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length === 6).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 1;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.refresh();

        });
        it('checking axis labels for primaryXAxis', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text.textContent === "1").toBe(true);
                text = document.getElementById("container0_AxisLabel_1");
                expect(text.textContent === "10").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.logBase = 10;
            chartObj.refresh();

        });
        it('checking axis labels for primaryXAxis with minorGridLine', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById("container_MinorGridLine_0");
                expect(svg.getAttribute("stroke") == "#eaeaea").toBe(true);
                expect(svg.getAttribute("stroke-width") == "2").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minorGridLines.width = 2;
            chartObj.primaryXAxis.minorTicksPerInterval = 3;
            chartObj.refresh();

        });
        it('Checking axis labels for primaryXAxis with interval', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text.textContent == "1").toBe(true);
                text = document.getElementById("container0_AxisLabel_1");
                expect(text.textContent == "100").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 1;
            chartObj.primaryXAxis.interval = 2;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.refresh();

        });
        it('Checking axis labels for primary YAxis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById("containerAxisLabels1");
                expect(svg.childNodes.length == 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();


        });
        it('Checking with nagative points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById("container1_AxisLabel_0");
                expect(svg.textContent === '1').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].y = -20;
            chartObj.refresh();
        });
        it('checking axis labels for primary YAxis with logBase', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerAxisLabels1');
                expect(svg.childNodes.length === 4).toBe(true);
                svg = document.getElementById('container_Series_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.logBase = 2;
            chartObj.series[0].dataSource[0].y = 18;
            chartObj.refresh();

        });
        it('checking axis labels for primary YAxis with range', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container1_AxisLabel_0");
                expect(text.textContent == "1").toBe(true);
                text = document.getElementById("container1_AxisLabel_1");
                expect(text.textContent == "2").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = 1;
            chartObj.primaryYAxis.maximum = 260;
            chartObj.primaryYAxis.logBase = 2;
            chartObj.refresh();

        });
        it('checking axis labels for primary YAxis with label', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container1_AxisLabel_0");
                expect(text.textContent == "1").toBe(true);
                text = document.getElementById("container1_AxisLabel_1");
                expect(text.textContent == "10").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.logBase = 10;
            chartObj.refresh();

        });
        it('checking axis labels for primary YAxis with minorGridLine', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById("container_MinorGridLine_1");
                expect(svg.getAttribute("stroke") == "#eaeaea").toBe(true);
                expect(svg.getAttribute("stroke-width") == "2").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minorGridLines.width = 2;
            chartObj.primaryYAxis.minorTicksPerInterval = 3;
            chartObj.refresh();

        });
        it('checking axis labels for primary YAxis with interval', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container1_AxisLabel_0");
                expect(text.textContent == "1").toBe(true);
                text = document.getElementById("container1_AxisLabel_1");
                expect(text.textContent == "4").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.interval = 2;
            chartObj.primaryYAxis.logBase = 2;
            chartObj.refresh();

        });
        it('checking with bar Series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg.childElementCount - 1 == 10).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Bar';
            chartObj.refresh();

        });
        it('checking with bar Series with datetime and logarithmic', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                let value: number = Math.round((<Series>args.chart.series[0]).points[1].regions[0].y);
                expect(value == 253 || value == 248).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Bar';
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.series[0].dataSource = datetime;
            chartObj.primaryYAxis.interval = 1;
            chartObj.primaryYAxis.logBase = 10;
            chartObj.refresh();

        });
        it('checking with Column Series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg.childElementCount - 1 == 10).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.primaryXAxis.minimum = 1;
            chartObj.primaryXAxis.interval = 2;
            chartObj.primaryXAxis.maximum = 20;
            chartObj.primaryYAxis.interval = 2;
            chartObj.primaryYAxis.logBase = 2;
            chartObj.series[0].dataSource = [
                { y: 18, x: 1 }, { y: 29, x: 2 }, { y: 30, x: 3 }, { y: 41, x: 4 },
                { y: 52, x: 5 }, { y: 62, x: 6 },
                { y: 74, x: 7 }, { y: 85, x: 8 }, { y: 96, x: 9 }, { y: 102, x: 10 }];
            chartObj.series[0].type = 'Column';
            chartObj.refresh();

        });
        it('checking with Area Series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Area';
            chartObj.refresh();

        });
        it('checking with range', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text.textContent == "0.1").toBe(true);
                text = document.getElementById("container0_AxisLabel_1");
                expect(text.textContent == "10").toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Line';
            chartObj.primaryXAxis.minimum = 0.2;
            chartObj.refresh();

        });
       it('checking with large data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSeriesGroup0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                {
                    dataSource: [{ x: 1, y: 8 }, { x: 2, y: 10000 }, { x: 3, y: 400 }, { x: 4, y: 600 },
                    { x: 5, y: 900 }, { x: 6, y: 1400 }, { x: 7, y: 2000 }, { x: 8, y: 4000 },
                    { x: 9, y: 6000 }, { x: 10, y: 8000 }, { x: 10, y: 9000 }],
                    name: 'Gold', xName: 'x', yName: 'y', fill: 'rgba(135,206,235,1)', type: 'Line',
                    animation: { enable: false }
                }];
            chartObj.primaryXAxis.minorGridLines.width = 0;
            chartObj.primaryYAxis.minorGridLines.width = 0;
            chartObj.primaryXAxis.minorTickLines.width = 0;
            chartObj.primaryYAxis.minorTickLines.width = 0;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.logBase = 10;
            chartObj.primaryYAxis.minimum = 1;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryXAxis.minimum = 1;
            chartObj.primaryYAxis.maximum = null;
            chartObj.refresh();

        });
        it('checking with edgelabelplacement', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text === null).toBe(true);
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                text = document.getElementById('container1_AxisLabel_0');
                expect(parseFloat(text.getAttribute('y')) === parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = null;
            chartObj.primaryXAxis.edgeLabelPlacement = 'Hide';
            chartObj.primaryYAxis.edgeLabelPlacement = 'Shift';
            chartObj.refresh();

        });
        it('checking with edgelabelplacement Hide', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                text = document.getElementById('container1_AxisLabel_0');
                expect(text.textContent === '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = null;
            chartObj.primaryYAxis.edgeLabelPlacement = 'Hide';
            chartObj.refresh();

        });
        it('checking with labelFormat', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text.textContent === '$1.00').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.edgeLabelPlacement = 'None';
            chartObj.primaryYAxis.edgeLabelPlacement = 'None';
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.series[0].dataSource = data;
            chartObj.primaryXAxis.labelFormat = 'C';
            chartObj.refresh();

        });
        it('Checking the zoomFactor and zoomPosition', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text !== null).toBe(true);
                text = document.getElementById("container1_AxisLabel_1");
                expect(text !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.primaryXAxis.zoomFactor = 0.5; chartObj.primaryXAxis.zoomPosition = 0.5;
            chartObj.refresh();

        });
        it('Checking the enableAutoIntervalOnZooming false', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById("container0_AxisLabel_0");
                expect(text !== null).toBe(true);
                text = document.getElementById("container1_AxisLabel_1");
                expect(text !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.enableAutoIntervalOnZooming = false;
            chartObj.refresh();

        });
        it('checking with multiple axes', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container2_AxisLabel_0');
                expect(svg.textContent === '10@').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'red', type: 'Line',
                animation: { enable: false }
            },
            {
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'rgba(135,206,235,1)', type: 'Line',
                animation: { enable: false }
            }];
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1', valueType: 'Logarithmic', labelFormat : '{value}@',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.series[0].yAxisName = 'yAxis1';
            chartObj.rows = [{ border: { width: 4, color: 'red' }, height: '300', },
            { border: { width: 4, color: 'blue' } }];
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.enableAutoIntervalOnZooming = true;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.refresh();

        });
        it('Checking the Labels with empty data', () => {
            chartObj.series = [];
            chartObj.primaryXAxis.zoomFactor = 0.7; chartObj.primaryXAxis.zoomPosition = 0.2;
             chartObj.axisLabelRender = (args : IAxisLabelRenderEventArgs) => {
                args.text =  args.text + 'cus';
             }
            chartObj.loaded = null;
            chartObj.refresh();

            svg = document.getElementById('containerAxisLabels0');
            expect(svg.childNodes.length == 1).toBe(true);
            expect(svg.childNodes[0].textContent.indexOf('cus') > -1).toBe(true);
        });
        it('checking x axis as inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1');
                let secondLabel = document.getElementById('container0_AxisLabel_2');
                expect(secondLabel.textContent).toEqual('100');
                expect(+firstLabel.getAttribute('x') > (+secondLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.axisLabelRender = null;

            chartObj.primaryXAxis.desiredIntervals = null;
            chartObj.refresh();
        });
    });
});
