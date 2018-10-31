/**
 * Specifies the  Scatter series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { DataLabel } from '../../../src/chart/series/data-label';
import { PolarSeries } from '../../../src/chart/series/polar-series';
import { RadarSeries } from '../../../src/chart/series/radar-series';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Axis } from '../../../src/chart/axis/axis';
import { CoefficientToVector, valueToPolarCoefficient } from '../../../src/common/utils/helper';
import { ChartLocation } from '../../../src/common/utils/helper';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Legend } from '../../../src/chart/legend/legend';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { tool1, tool2, datetimeData, categoryData, negativeDataPoint } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(DateTime, Category, Tooltip, Logarithmic, PolarSeries, RadarSeries, DataLabel, Legend);
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
                let element = document.getElementById('chartContainer_MajorGridLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking x axis gridLines and tickLines for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Polar';
            chartObj.refresh();
        });
         it('Checking both axis tickLines inside for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0');
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
                let element = document.getElementById('chartContainer_MinorGridLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minorTicksPerInterval = 2;
            chartObj.refresh();
        });
        it('Checking x axis minorGridLines and TickLines for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MinorGridLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0');
                expect(element.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Radar';
            chartObj.refresh();
        });
        it('Checking startAngle with TickLines for y Axis for radar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1');
                expect(element !== null).toBe(true);
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.startAngle = 90;
            chartObj.refresh();
        });
        it('Checking startAngle with TickLines for y Axis for polar axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1');
                expect(element !== null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1');
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
                let element = document.getElementById('chartContainer_MajorGridLine_0');
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
                let element: HTMLElement = document.getElementById('chartContainer_MajorGridLine_0');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_0');
                done();

            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.majorGridLines.width = 0;
            chartObj.primaryXAxis.majorTickLines.width = 0;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking y axis majorGridLines and majorticklines visible false for polar axis', (done: Function) => {
            loaded = (args: Arg): void => {
                let element = document.getElementById('chartContainer_MajorGridLine_1');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MajorTickLine_1');
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
                let element: HTMLElement = document.getElementById('chartContainer_MinorGridLine_0');
                expect(element === null).toBe(true);
                element = document.getElementById('chartContainer_MinorTickLine_0');
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
});