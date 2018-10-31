
/**
 * Specifies Stackingarea series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import {
    ChartSeriesType, ChartRangePadding, ValueType,
    ChartShape, LabelPlacement
} from '../../../src/chart/utils/enum';
import { LineSeries } from '../../../src/chart/series/line-series';
import { StackingAreaSeries } from '../../../src/chart/series/stacking-area-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents } from '../base/data.spec';
import { tooltipData21, tooltipData22, datetimeData21, categoryData, negativeDataPoint, seriesData1, rotateData1, rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, StackingAreaSeries, StackingColumnSeries, AreaSeries, DateTime, Category, DataLabel);
let data: any = tooltipData21;
let data2: any = tooltipData22;
let datetime: any = datetimeData21;
export interface Arg {
    chart: Chart;
}
describe('Chart Control', () => {
    describe('Chart StackingArea series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let dataLabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let targetElement: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart({
                primaryXAxis: { title: 'PrimaryXAxis' },
                primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                series: [{
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea',
                    name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingArea',
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
                let series1: HTMLElement = document.getElementById('container_Series_0');
                expect(series1.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);

                let series2: HTMLElement = document.getElementById('container_Series_1');
                expect(series2.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.childNodes[3] == null).toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.childNodes[5] == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[1].dataSource[5].y = null;
            chartObj.refresh();
        });

        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') === 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[1].dataSource = negativeDataPoint;
            chartObj.refresh();
        });

        it('Checking with marker visible false', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg == null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].marker.visible = false;
            chartObj.series[1].marker.visible = false;
            chartObj.refresh();

        });
        it('Checking with marker size', (done: Function) => {
            loaded = (args: Arg): void => {
                let series1: Series = <Series>args.chart.series[0];
                let series2: Series = <Series>args.chart.series[1];
                expect(series1.marker.height === 10).toBe(true);
                expect(series1.marker.width === 10).toBe(true);
                expect(series2.marker.height === 10).toBe(true);
                expect(series2.marker.width === 10).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.series[0].marker.height = 10;
            chartObj.series[0].marker.width = 10;
            chartObj.series[1].marker.visible = true;
            chartObj.series[1].marker.height = 10;
            chartObj.series[1].marker.width = 10;
            chartObj.refresh();
        });
        it('Checking with marker with shape', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(svg.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.series[0].marker.fill = 'red';
            chartObj.series[1].marker.shape = 'Diamond';
            chartObj.series[1].marker.fill = 'black';
            chartObj.refresh();
        });
        it('Checking with marker with shape for stackingareaa100 series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                svg = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(svg.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.series[0].marker.fill = 'red';
            chartObj.series[1].marker.shape = 'Diamond';
            chartObj.series[1].marker.fill = 'black';
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.refresh();
        });
        it('checking with marker shape image', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg.getAttribute('href') === 'base/spec/img/img1.jpg').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea';
            chartObj.series[1].type = 'StackingArea';
            chartObj.series[0].marker.shape = 'Image';
            chartObj.series[0].marker.imageUrl = 'base/spec/img/img1.jpg';
            chartObj.refresh();

        });
        it('Checking marker with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[2].y = null;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();

        });
        it('Checking marker with null Points for stackingarea100 series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_2_Symbol');
                expect(svg === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.refresh();

        });
        it('Checking with add new element in data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_8_Symbol');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingArea';
            remove(document.getElementById('containerSeriesGroup0'));
            chartObj.series[0].dataSource = null;
            let length = Object.keys(data).length;
            length++;
            data[length - 1] = [];
            data[length - 1].y = 50;
            data[length - 1].x = 10000;
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });
        it('Checking with single data', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Additional';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[1].dataSource = null;
            chartObj.series[1].dataSource = [{ x: 4, y: 30 }];
            chartObj.refresh();

        });
        it('Checking with single data for stackingarea100 series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_Series_1_Point_0_Symbol');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.rangePadding = 'Additional';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[1].dataSource = null;
            chartObj.series[1].dataSource = [{ x: 4, y: 30 }];
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.refresh();

        });
        it('Checking with marker without animation', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data2;
            chartObj.series[0].marker.visible = true;
            chartObj.series[1].marker.visible = true;
            chartObj.series[0].type = 'StackingArea';
            chartObj.series[1].type = 'StackingArea';
            chartObj.refresh();

        });
        it('Checking with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[1].dataSource = categoryData;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();

        });
        it(' checking with fill and stroke', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                expect(svg.getAttribute('stroke') === 'green').toBe(true);
                expect(svg.getAttribute('stroke-width') === '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].border.width = 4;
            chartObj.refresh();

        });
        it(' checking with fill and stroke for stackingarea100 series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'red').toBe(true);
                expect(svg.getAttribute('stroke') === 'green').toBe(true);
                expect(svg.getAttribute('stroke-width') === '4').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = data;
            chartObj.series[1].dataSource = data;
            chartObj.series[0].fill = 'red';
            chartObj.series[0].border.color = 'green';
            chartObj.series[0].border.width = 4;
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.refresh();

        });
        it('Checking with category axis onticks', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[1].dataSource = categoryData;
            chartObj.series[0].type = 'StackingArea';
            chartObj.series[1].type = 'StackingArea';
            chartObj.refresh();

        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                svg = document.getElementById('container_Series_2');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                svg = document.getElementById('container_Series_3');
                expect(svg.getAttribute('fill') == 'blue').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, name: 'Gold', xName: 'x', yName: 'y', fill: 'rgba(135,206,235,1)',
                type: 'StackingArea', animation: { enable: false },
            },
            {
                dataSource: data2, name: 'silver', xName: 'x', yName: 'y', fill: 'red', type: 'StackingArea',
                animation: { enable: false },
            },
            {
                dataSource: data, name: 'Diamond', xName: 'x', yName: 'y', fill: 'green', type: 'StackingArea',
                animation: { enable: false },
            },
            {
                dataSource: data2, name: 'Gold', xName: 'x', yName: 'y', fill: 'blue', type: 'StackingArea',
                animation: { enable: false },
            }];
            chartObj.refresh(); 

        });
        
        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_1');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                svg = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1', minimum: 0,
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.height = '600';
            chartObj.series[2].yAxisName = 'yAxis1';
            chartObj.rows = [{ height: '300', border: { width: 4, color: 'red' } },
            { height: '300', border: { width: 4, color: 'blue' } },];
            chartObj.refresh(); 


        });

        it('Checking animation', (done: Function) => {

         let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                let point : Element =  <Element>document.getElementById('container_ChartSeriesClipRect_' + args.series.index).childNodes[0];
                expect(point.getAttribute('width') === document.getElementById('container_ChartAreaBorder').getAttribute('width')).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.series[1].animation.enable = true;
            chartObj.series[2].animation.enable = true;
            chartObj.series[3].animation.enable = true;
            chartObj.animationComplete = animate;
            chartObj.refresh();
        });
        it('Checking animation for stackingarea100 series', (done: Function) => {

         let animate: EmitType<IAnimationCompleteEventArgs> = (args: series1): void => {
                let point : Element =  <Element>document.getElementById('container_ChartSeriesClipRect_' + args.series.index).childNodes[0];
                expect(point.getAttribute('width') === document.getElementById('container_ChartAreaBorder').getAttribute('width')).toBe(true);
                done();
            };
            chartObj.series[0].type = 'StackingArea100';
            chartObj.series[1].type = 'StackingArea100';
            chartObj.series[2].type = 'StackingArea100';
            chartObj.series[3].type = 'StackingArea100';
            chartObj.animationComplete = animate;
            chartObj.refresh();

        });
    });
    describe('Stacking Areas Series Inversed axis', () => {
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
                        animation: { enable: false }, name: 'ChartSeriesNameGold', dataSource: seriesData1, xName: 'x', yName: 'y',
                        type: 'StackingArea', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    },
                    {
                        animation: { enable: false }, name: 'ChartSeriesNameSilver', dataSource: seriesData1, xName: 'x', yName: 'y',
                        type: 'StackingArea', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_1_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
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
            chart.refresh();

        });
    });
    describe('checking rotated area chart', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let animationComplete:  EmitType<IAnimationCompleteEventArgs>;
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis'},
                series: [
                    { type: 'StackingArea', name: 'area', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}},
                    { type: 'StackingArea', name: 'area', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}}
                ],
                title: 'rotated stackingarea Chart'
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
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.refresh();
        });
        it('checking with datalabel Top position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
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
                expect(+(dataLabel.getAttribute('y')) > (point.symbolLocations[0].y - point.regions[0].height / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();
        });
        it('checking with tooltip positive values', (done: Function) => {
            loaded = (args: Object): void => {
                //positive y yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Symbol');
                series = <Series>chart.series[0];
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
            chart.refresh();
        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1_Symbol');
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
        it('checking animation', (done: Function) => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                done();
            };
            chart.series[0].animation.enable = true;
            chart.series[1].animation.enable = true;
            chart.animationComplete = animationComplete;
            chart.refresh();
        });
    });
});

export interface series1 {
    series: Series;
}