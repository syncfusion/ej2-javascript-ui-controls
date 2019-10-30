/**
 * Specifies the  Scatter series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { DataLabel } from '../../../src/chart/series/data-label';
import { PolarSeries } from '../../../src/chart/series/polar-series';
import { RadarSeries } from '../../../src/chart/series/radar-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Axis } from '../../../src/chart/axis/axis';
import { CoefficientToVector, valueToPolarCoefficient, getElement } from '../../../src/common/utils/helper';
import { ChartLocation } from '../../../src/common/utils/helper';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Legend } from '../../../src/chart/legend/legend';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { tool1, tool2, datetimeData, categoryData, negativeDataPoint } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IPointRenderEventArgs } from '../../../src/chart/model/chart-interface';
Chart.Inject(DateTime, Category, Tooltip, Logarithmic, PolarSeries, LineSeries, RadarSeries, DataLabel, Legend);
let data: any = tool1;
let data2: any = tool2;
let datetime: any = datetimeData;
export interface Arg {
    chart: Chart;
}

export interface series1 {
    series: Series;
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
    let ele: HTMLElement;
    let svg: HTMLElement;
    let text: HTMLElement;
    let loaded: EmitType<ILoadedEventArgs>;
    describe('Polar Axis', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    series: [{
                        dataSource: tool1, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Line', animation: { enable: true}
                    }],
                }
            );
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('chartContainer').remove();
        });
        it('Checking the centerX, centerY and radius and labels', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let centerY: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.y;
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(label.getAttribute('x') === (centerX).toString()).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY - args.chart.radius)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#chartContainer');
        });
        it('Checking axis visible false', (done: Function) => {
            loaded = (args: Arg): void => {
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(label === null).toBe(true);
                label = document.getElementById('chartContainer1_AxisLabel_0');
                expect(label === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.visible = false;
            chartObj.primaryYAxis.visible = false;
            chartObj.refresh();
        });
        it('Checking y axis linestyle visible false', (done: Function) => {
            loaded = (args: Arg): void => {
                let label: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(label === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.visible = true;
            chartObj.primaryYAxis.visible = true;
            chartObj.primaryYAxis.lineStyle.width = 0;
            chartObj.refresh();
        });
        it('Checking labels with startAngle for axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let centerY: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.y;
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                let axis: Axis = args.chart.axisCollections[0];
                let vector: ChartLocation = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), args.chart.primaryXAxis.startAngle);
                expect(parseInt(label.getAttribute('x')) > (centerX + args.chart.radius * vector.x)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY + args.chart.radius * vector.y)).toBe(true);
                label = document.getElementById('chartContainer1_AxisLabel_0');
                expect(parseInt(label.getAttribute('x')) < (centerX)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.startAngle = 45;
            chartObj.primaryYAxis.lineStyle.width = 1;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking labels with startAngle for axis for radar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let centerY: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.y;
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                let axis: Axis = args.chart.axisCollections[0];
                let vector: ChartLocation = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), args.chart.primaryXAxis.startAngle);
                expect(parseInt(label.getAttribute('x')) > (centerX + args.chart.radius * vector.x)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY + args.chart.radius * vector.y)).toBe(true);
                label = document.getElementById('chartContainer1_AxisLabel_0');
                expect(parseInt(label.getAttribute('x')) < (centerX)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking negative startAngle for axis for radar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let centerY: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.y;
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                let axis: Axis = args.chart.axisCollections[0];
                let vector: ChartLocation = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), args.chart.primaryXAxis.startAngle);
                expect(parseInt(label.getAttribute('x')) < (centerX + args.chart.radius * vector.x)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY + args.chart.radius * vector.y)).toBe(true);
                label = document.getElementById('chartContainer1_AxisLabel_0');
                expect(parseInt(label.getAttribute('x')) < (centerX)).toBe(true);
                expect(parseInt(label.getAttribute('y')) > (centerY)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.startAngle = -45;
            chartObj.refresh();
        });
        it('Checking negative startAngle for axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let centerY: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.y;
                let label: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                let axis: Axis = args.chart.axisCollections[0];
                let vector: ChartLocation = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), args.chart.primaryXAxis.startAngle);
                expect(parseInt(label.getAttribute('x')) < (centerX + args.chart.radius * vector.x)).toBe(true);
                expect(parseInt(label.getAttribute('y')) < (centerY + args.chart.radius * vector.y)).toBe(true);
                label = document.getElementById('chartContainer1_AxisLabel_0');
                expect(parseInt(label.getAttribute('x')) < (centerX)).toBe(true);
                expect(parseInt(label.getAttribute('y')) > (centerY)).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking Axis line for y axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainerAxisLine_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainerAxisLine_0');
                expect(element === null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.startAngle = 0;
            chartObj.refresh();

        });
        it('Checking Axis line for y axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
               let element = document.getElementById('chartContainerAxisLine_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainerAxisLine_0');
                expect(element === null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();

        });
        it('Checking x axis gridLines and tickLines for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking x axis gridLines and tickLines for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
         it('Checking both axis tickLines inside for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.primaryXAxis.tickPosition = 'Inside';
            chartObj.primaryYAxis.tickPosition = 'Inside';
            chartObj.refresh();
        });
        it('Checking x axis minorGridLines and TickLines for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MinorGridLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minorTicksPerInterval = 2;
            chartObj.refresh();
        });
        it('Checking x axis minorGridLines and TickLines for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MinorGridLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking startAngle with TickLines for y Axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1_1');
                expect(element !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.startAngle = 90;
            chartObj.refresh();
        });
        it('Checking startAngle with TickLines for y Axis for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1_1');
                expect(element !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking y axis label for log axis for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_1');
                expect(element.textContent === '100').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.primaryXAxis.startAngle = 0;
            chartObj.refresh();
        });
        it('Checking y axis label for log axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_1');
                expect(element.textContent === '100').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking x axis label for datetime axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element.textContent === '2000').toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking x axis label for datetime axis for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element.textContent === '2000').toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking x axis label category axis and between ticks placement for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_1');
                expect(element.textContent === 'China').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh();
        });
        it('Checking x axis label category axis and between ticks placement for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_1');
                expect(element.textContent === 'China').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking x axis label category axis and onticks placement for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_1');
                expect(element.textContent === 'China').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking x axis label category axis and onticks placement for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_1');
                expect(element.textContent === 'China').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking y axis rangepadding for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_0');
                expect(element.textContent === '40');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = tool1;
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.refresh();
        })
        it('Checking y axis rangepadding for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_0');
                expect(element.textContent === '40');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = tool1;
            chartObj.primaryYAxis.rangePadding = 'None';
            chartObj.refresh();
        });
        it('Checking y axis negative values for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_0');
                expect(element.textContent === '-50');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.refresh();
        });
        it('Checking y axis negative values for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer1_AxisLabel_0');
                expect(element.textContent === '-50');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
        it('Checking x axis negative values for double axis for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element.textContent === '-1000');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[0].x = -1000;
            chartObj.refresh();
        });
        it('Checking x axis negative values for double axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element.textContent === '-1000');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking majorGridLines visible false for polar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0_0');
                expect(element === null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.series[0].dataSource[0].x = 1000;
            chartObj.primaryXAxis.majorGridLines.width = 0;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking majorGridLines and majorticklines visible false for polar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element: HTMLElement = document.getElementById('chartContainer_MajorGridLine_0_0');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0_0');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.majorGridLines.width = 0;
            chartObj.primaryXAxis.majorTickLines.width = 0;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking y axis majorGridLines and majorticklines visible false for polar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1_1');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1_1');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.majorGridLines.width = 1;
            chartObj.primaryXAxis.majorTickLines.width = 1;
            chartObj.primaryYAxis.majorGridLines.width = 0;
            chartObj.primaryYAxis.majorTickLines.width = 0;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking minorGridLines and minorTicklines visible false', (done: Function) => {
            loaded = (args: Arg): void => {
                let element: HTMLElement = document.getElementById('chartContainer_MinorGridLine_0_0');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0_0');
                expect(element === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.majorGridLines.width = 1;
            chartObj.primaryYAxis.majorTickLines.width = 1;
            chartObj.primaryXAxis.minorGridLines.width = 0;
            chartObj.primaryXAxis.minorTickLines.width = 0;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking with inveresd axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element !== null).toBe(true);
                expect(element.getAttribute('text-anchor') === 'middle').toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });
        it('Checking with inveresd axis for column ', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainer0_AxisLabel_0');
                expect(element !== null).toBe(true);
                let series: Series = <Series>(args.chart.series[0]);
                let centerX: number = series.clipRect.x + args.chart.radius;
                expect(centerX > series.points[1].symbolLocations[0].x).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].drawType = 'Column';
            chartObj.refresh();
        });
        it('Checking with chart title for polar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let element = document.getElementById('chartContainer_ChartTitle');
                //expect(element.getAttribute('x')).toEqual('352');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.title = 'Chart Title';
            chartObj.refresh();
        });
        it('Checking with chart title for radar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let centerX: number = args.chart.chartAxisLayoutPanel.seriesClipRect.width / 2 + args.chart.chartAxisLayoutPanel.seriesClipRect.x;
                let element = document.getElementById('chartContainer_ChartTitle');
               // expect(element.getAttribute('x')).toEqual('352');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking with coEfficient for primary X axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainerAxisGroup0');
                expect(element !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.coefficient = 80;
            chartObj.refresh();
        });
        it('Checking with log axis for negetive points', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainerAxisGroup1');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        it('Checking with log axis for negetive points primary x axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainerAxisGroup0');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: -1000, y: 70 }, { x: 2000, y: -40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: -50 }, { x: 6000, y: -40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.refresh();
        });
        
    });
    
    describe('Polar Axis: Smart Labels', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Months',
                        valueType: 'Category',
                        labelPlacement: 'OnTicks',
                        interval: 1,
                        labelIntersectAction: "None"
                    },
                    margin: {
                        
                    },
                    //Initializing Primary Y Axis
                    primaryYAxis:
                    {
                        title: 'Temperature (Celsius)',
                        minimum: -25, maximum: 25, interval: 1,
                        edgeLabelPlacement: 'Shift',
                        labelFormat: '{value}°C',
                        labelIntersectAction: "None"
                    },
                    chartArea: {
                        border: {width:1, color: 'red'}
                    },
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
                            },
                            
                        }
                    ],
                    //Initializing Chart title
                    title: 'Alaska Weather Statistics - 2016',
                    //Initializing User Interaction Tooltip
                    tooltip: {
                        enable: true
                    }
                },'#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Default Polar Chart', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let chart: Element = document.getElementById('container');
                expect(chart !== null).toBe(true);
                expect(args.chart.series[0].type === 'Polar').toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Default Radar Chart', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let chart: Element = document.getElementById('container');
                expect(chart !== null).toBe(true);
                expect(args.chart.series[0].type === 'Radar').toBe(true);
                done();
            };
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });

        it('Check default X axis labels count', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels0');
                expect(ele.childElementCount == 48).toBe(true);
                done();
            };
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });

        it('Check default Y axis labels count', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels1');
                expect(ele.childElementCount == 51).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Check X axis labels count after hide', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels0');
                expect(ele.childElementCount == 37 || ele.childElementCount == 38).toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelIntersectAction = 'Hide';
            chartObj.refresh();
        });

        it('Check Y axis labels count after hide', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels1');
                expect(ele.childElementCount == 9 || ele.childElementCount == 11).toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelIntersectAction = 'Hide';
            chartObj.refresh();
        });

        it('Check X axis labels hide with label position inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels0');
                expect(ele.childElementCount == 32).toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });

        it('Check Y axis labels count when X axis label inside and Y axis intersect action none', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels1');
                expect(ele.childElementCount == 51).toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelIntersectAction = 'None';
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });

        it('Check Y axis labels count when X axis label inside and Y axis intersect action hide', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels1');
                expect(ele.childElementCount == 7 || ele.childElementCount == 9).toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelIntersectAction = 'Hide';
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });

        it('Check X axis labels with start angle and label position outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels0');
                expect(ele.childElementCount == 37 || ele.childElementCount == 38).toBe(true);
                let anchor: string = getElement("container0_AxisLabel_0").getAttribute("text-anchor");
                expect(anchor === 'start').toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelIntersectAction = 'Hide';
            chartObj.primaryXAxis.labelPosition = 'Outside';
            chartObj.primaryXAxis.startAngle = 90;
            chartObj.refresh();
        });

        it('Check X axis labels with start angle and label position inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('containerAxisLabels0');
                expect(ele.childElementCount == 33).toBe(true);
                let anchor: string = getElement("container0_AxisLabel_0").getAttribute("text-anchor");
                expect(anchor === 'start').toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelIntersectAction = 'Hide';
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.startAngle = 90;
            chartObj.refresh();
        });
    });

    describe('Customer issue: Polar Radar Category axis gridline not split equally', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        labelPlacement: 'OnTicks',
                        interval:6,
                        coefficient:  80 ,
                    },
                    primaryYAxis: {
                        title: 'Revenue in Millions',
                        labelIntersectAction : 'Hide'
                        //labelFormat: '{value}'
                    },
                    width: '600', height: '400',
                    series: [
                        {
                            dataSource: [{ x: "k", y: 0.0 }, { x: "Alfreds Futterkiste", y: 2517.6 }, { x: "Ana Trujillo Emparedados y helados", y: 1839.54 }, { x: "Antonio Moreno Taquería", y: 4003.74 }, { x: "Around the Horn", y: 8682.83999999999 }, { x: "B's Beverages", y: 3378.9 }, { x: "Berglunds snabbköp", y: 29011.08 }, { x: "Blauer See Delikatessen", y: 2108.46 }, { x: "Blondesddsl père et fils", y: 11880.0 }, { x: "Bólido Comidas preparadas", y: 2664.6 }, { x: "Bon app'", y: 23715.9 }, { x: "Bottom-Dollar Markets", y: 13031.82 }, { x: "Cactus Comidas para llevar", y: 952.800000000001 }, { x: "Centro comercial Moctezuma", y: 39.0 }, { x: "Chop-suey Chinese", y: 5642.64 }, { x: "Comércio Mineiro", y: 2813.04 }, { x: "Consolidated Holdings", y: 698.7 }, { x: "Die Wandernde Kuh", y: 7244.88000000001 }, { x: "Drachenblut Delikatessen", y: 3575.04 }, { x: "Du monde entier", y: 945.66 }, { x: "Eastern Connection", y: 14170.62 }, { x: "Ernst Handel", y: 147221.52 }, { x: "Familia Arquibaldo", y: 3980.34 }, { x: "Folies gourmandes", y: 15002.7 }, { x: "Folk och fä HB", y: 31865.64 }, { x: "France restauration", y: 1508.16 }, { x: "Franchi S.p.A.", y: 875.280000000001 }, { x: "Frankenversand", y: 29587.86 }, { x: "Furia Bacalhau e Frutos do Mar", y: 5363.34 }, { x: "Galería del gastrónomo", y: 409.02 }, { x: "Godos Cocina Típica", y: 10209.36 }, { x: "Gourmet Lanchonetes", y: 5297.7 }, { x: "Great Lakes Food Market", y: 14732.58 }, { x: "GROSELLA-Restaurante", y: 813.6 }, { x: "Hanari Carnes", y: 9323.09999999999 }, { x: "HILARION-Abastos", y: 20504.28 }, { x: "Hungry Coyote Import Store", y: 1817.22 }, { x: "Hungry Owl All-Night Grocers", y: 43286.9400000001 }, { x: "Island Trading", y: 6848.39999999999 }, { x: "Königlich Essen", y: 18199.5 }, { x: "La corne d'abondance", y: 1574.7 }, { x: "La maison d'Asie", y: 9145.26000000001 }, { x: "Laughing Bacchus Wine Cellars", y: 172.92 }, { x: "Lazy K Kountry Store", y: 116.4 }, { x: "Lehmanns Marktstand", y: 17628.66 }, { x: "Let's Stop N Shop", y: 3279.78 }, { x: "LILA-Supermercado", y: 13288.2 }, { x: "LINO-Delicateses", y: 12628.56 }, { x: "Lonesome Pine Restaurant", y: 1087.5 }, { x: "Magazzini Alimentari Riuniti", y: 7248.84 }, { x: "Maison Dewey", y: 6513.12 }, { x: "Mère Paillarde", y: 24726.66 }, { x: "Morgenstern Gesundkost", y: 5389.08 }, { x: "North/South", y: 618.72 }, { x: "Océano Atlántico Ltda.", y: 6535.02 }, { x: "Old World Delicatessen", y: 15569.28 }, { x: "Ottilies Käseladen", y: 15595.42 }, { x: "Pericles Comidas clásicas", y: 4750.92 }, { x: "Piccolo und mehr", y: 19167.12 }, { x: "Princesa Isabel Vinhos", y: 5315.96 }, { x: "Que Delícia", y: 6013.62 }, { x: "Queen Cozinha", y: 41798.64 }, { x: "QUICK-Stop", y: 125166.78 }, { x: "Rancho grande", y: 3148.2 }, { x: "Rattlesnake Canyon Grocery", y: 40659.6699999999 }, { x: "Reggiani Caseifici", y: 4529.22 }, { x: "Ricardo Adocicados", y: 10525.32 }, { x: "Richter Supermarkt", y: 17835.48 }, { x: "Romero y tomillo", y: 1232.52 }, { x: "Santé Gourmet", y: 5382.3 }, { x: "Save-a-lot Markets", y: 159203.1 }, { x: "Seven Seas Imports", y: 16545.0 }, { x: "Simons bistro", y: 9001.02000000001 }, { x: "Spécialités du monde", y: 1698.24 }, { x: "Split Rail Beer & Ale", y: 9911.57999999999 }, { x: "Suprêmes délices", y: 19113.06 }, { x: "The Big Cheese", y: 3119.46 }, { x: "The Cracker Box", y: 2217.78 }, { x: "Toms Spezialitäten", y: 1524.06 }, { x: "Tortuga Restaurante", y: 8743.86000000001 }, { x: "Tradição Hipermercados", y: 4510.8 }, { x: "Trail's Head Gourmet Provisioners", y: 1443.78 }, { x: "Vaffeljernet", y: 16717.86 }, { x: "Victuailles en stock", y: 9400.56 }, { x: "Vins et alcools Chevalier", y: 694.02 }, { x: "Wartian Herkku", y: 15671.58 }, { x: "Wellington Importadora", y: 3281.76 }, { x: "White Clover Markets", y: 24103.92 }, { x: "Wilman Kala", y: 1767.24 }, { x: "Wolski  Zajazd", y: 2769.18 }],
                            xName: 'x', width: 2, yName: 'y', name: 'Warmest', type: 'Radar',
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
                    title: 'Alaska Weather Statistics - 2016',
                    tooltip: {
                        enable: true
                    }
                },'#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Check last gridline path in radar chart', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let path: Element = document.getElementById('container_MajorGridLine_0_14');
                let d: string = path.getAttribute("d");
                expect(d === "M 300 200.125 L 258.06545209888503 105.93846331704785" || d === "M 300 199.625 L 256.9265894982728 102.88053603564855").toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Check last gridline path in polar chart', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let path: Element = document.getElementById('container_MajorGridLine_0_14');
                let d: string = path.getAttribute("d");
                expect(d === "M 300 200.125 L 258.06545209888503 105.93846331704785" || d === "M 300 199.625 L 256.9265894982728 102.88053603564855").toBe(true);
                done();
            };
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });

        
    });
    describe('Polar Axis: Trim Axis Labels', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'trimContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        labelIntersectAction:'None'
                    },
                    width: '400',
                    series: [
                        {
                            dataSource: [
                                { x: "North North North North North", y: 42 },
                                { x: "NorthEast NortEast NorthEast", y: 28 },
                                { x: "East East East East", y: 40 },
                                { x: "SouthEast SouthEast", y: 45 },
                                { x: "South South South South", y: 20 },
                                { x: "SouthWest SouthWest SouthWest", y: 40 },
                                { x: "West West West West", y: 25 },
                                { x: "NorthWest NorthWest NorthWest", y: 40 }
                            ],
                            border: { width: 1, color: 'white' },
                            name: 'Series1', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
                            fill: '#3d5ee0'
                        },
                    ]
                },'#trimContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('trimContainer').remove();
        });

        it('Check X axis labels trim with label position outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('trimContainer0_AxisLabel_0');
                expect(Math.round(ele.getBoundingClientRect().width) > 34).toBe(true);
                done();
            };
            chartObj.primaryXAxis.enableTrim = true;
            chartObj.refresh();
        });
        it('Check X axis labels without trim for label position outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('trimContainer0_AxisLabel_3');
                expect(ele.innerHTML.indexOf('...') !== -1).toBe(false);
                done();
            };
            chartObj.primaryXAxis.enableTrim = true;
            chartObj.refresh();
        });
        it('Check X axis labels trim with label position outside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('trimContainer0_AxisLabel_4');
                expect(Math.round(ele.getBoundingClientRect().width) > 34).toBe(true);
                done();
            };
            chartObj.primaryXAxis.enableTrim = true;
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.refresh();
        });
        it('Check X axis labels without trim for label position inside', (done: Function) => {
            chartObj.loaded = (args: Arg): void => {
                let ele: Element = document.getElementById('trimContainer0_AxisLabel_6');
                expect(ele.innerHTML.indexOf('...') !== -1).toBe(false);
                done();
            };
            chartObj.primaryXAxis.enableTrim = true;
            chartObj.primaryXAxis.labelPosition = 'Inside';
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