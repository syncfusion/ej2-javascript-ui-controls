
/**
 * Specifies the  Bubble series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Legend } from '../../../src/chart/legend/legend';
import { BubbleSeries } from '../../../src/chart/series/bubble-series';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { tool1, datetimeData,rotateData1,rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(BarSeries, BubbleSeries, LineSeries, Category, Tooltip, DateTime, Logarithmic,
    Legend, DataLabel, Selection, Zoom, Crosshair);

let datetime: any = datetimeData;
let trigger: MouseEvents = new MouseEvents();
let seriesColor: string[] = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
    '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
let borderWidth: number[] = [0.5, 1, 1.3, 2.5, 3, 1.5, 1.9, 1.24];
let opacity: number[] = [0.1, 0.2, 1, 0.3, 0.4, 0.5, 0.1, 0.3];
let labelRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
    args.fill = seriesColor[args.point.index];
    args.border.width = borderWidth[args.point.index];
};


export let data: any[] = [
    { x: 1000, y: 2, size: 5000 }, { x: 2000, y: 89, size: 6000, }, { x: 3000, y: 3, size: -30000 }, { x: 4000, y: 15, size: 14000 },
    { x: 5000, y: 16, size: -30000 }, { x: 6000, y: 10, size: 13000 },
    { x: 7000, y: -60, size: 18000 }, { x: 8000, y: 90, size: 12000 }, { x: 9000, y: 23, size: 10000 }, { x: 10000, y: 41, size: 15000 }
];

export let dataText: any[] = [
    { x: 1000, y: 2, size: 5000 }, { x: 2000, y: 89, size: 6000, text: 'Australia is the greatest country' },
    { x: 3000, y: 3, size: -30000 }, { x: 4000, y: 15, size: 14000 },
    { x: 5000, y: 16, size: -30000, text: 'America is the greatest country' }, { x: 6000, y: 10, size: 13000 },
    { x: 7000, y: -60, size: 18000 }, { x: 8000, y: 21, size: 12000, text: 'Somalia is the greatest country' },
    { x: 9000, y: 22, size: 10000, text: 'Japan is the greatest country' }, { x: 10000, y: 41, size: 15000 }
];
export let data2: any[] = [
    { x: 1000, y: 12, size: 5000 }, { x: 2000, y: 8, size: 6000 }, { x: 3000, y: 30, size: -30000 }, { x: 4000, y: 60, size: 14000 },
    { x: 5000, y: 25, size: -30000 }, { x: 6000, y: 34, size: 13000 },
    { x: 7000, y: -60, size: 18000 }, { x: 8000, y: 51, size: 12000 }, { x: 9000, y: 49, size: 10000 }, { x: 10000, y: 42, size: 15000 }
];

export let Datedata: any[] = [
    { x: new Date(0, 0, 2000), y: 2, size: 5000 }, { x: new Date(0, 0, 2001), y: 89, size: 6000 },
    { x: new Date(0, 0, 2002), y: 3, size: -30000 }, { x: new Date(0, 0, 2003), y: 0, size: 14000 },
    { x: new Date(0, 0, 2004), y: 16, size: -30000 }, { x: new Date(0, 0, 2005), y: 0, size: 13000 },
    { x: new Date(0, 0, 2006), y: -60, size: 18000 }, { x: new Date(0, 0, 2007), y: 21, size: 12000 },
    { x: new Date(0, 0, 2008), y: 23, size: 10000 }, { x: new Date(0, 0, 2009), y: 41, size: 15000 }
];

export let categorySize: any[] = [
    { x: 'USA', y: 70, size: 0.01 }, { x: 'China', y: 60, size: 0.1 },
    { x: 'Japan', y: 60, size: 0.08 }, { x: 'Australia', y: 56, size: 0.15 },
    { x: 'France1', y: 45, size: 0.121 }, { x: 'Germany1', y: 30, size: -0.01 },
    { x: 'Italy', y: 35, size: 0.2 }, { x: 'Sweden', y: 25, size: 0.3 }];

export let logData: any[] = [
    { x: 1000, y: 2, size: 5000, }, { x: 2000, y: 89, size: 6000 }, { x: 3000, y: 3, size: 30000 }, { x: 4000, y: 0, size: 14000 },
    { x: 4100, y: 10, size: 14000 }, { x: 5000, y: 16, size: 30000 }, { x: 6000, y: 0, size: 13000 }, { x: 7000, y: 60, size: 18000 },
    { x: 8000, y: 21, size: 12000 }, { x: 9000, y: 23, size: 10000 }, { x: 10000, y: 41, size: 15000 }
];
export interface Arg {
    chart: Chart;
}

export interface series1 {
    series: Series;
}

describe('Chart Control', () => {
    describe('Chart Bubble series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let svg: HTMLElement;
        let datalabel: HTMLElement;
        let series: Series;
        let radius: number;
        let targetElement: HTMLElement;
        let point: HTMLElement;
        let axisLabel: HTMLElement;
        let labelText: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let x: number; let y: number;
        let elementSelect: HTMLElement;
        let selected;
        let tooltip: HTMLElement;
        let tooltipY: number;
        let dataLabelY: number;
        beforeAll(() => {
            if (document.getElementById('container')) {
                document.getElementById('container').remove();
            }
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', },
                    primaryYAxis: { title: 'PrimaryYAxis', },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', size: 'size', animation: { enable: false }, type: 'Bubble',
                        name: 'ChartSeriesNameGold', fill: 'green', minRadius: null, maxRadius: null,
                    },
                    ],
                    title: 'Chart TS Title', legendSettings: { visible: true },
                    selectionMode: 'Point',
                    tooltip: {
                        enable: true,
                        enableAnimation: true
                    }
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with fill', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg.getAttribute('fill')).toEqual('green');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with opacity', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(parseFloat(svg.getAttribute('opacity'))).toEqual(0.5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].opacity = 0.5;
            chartObj.series[0].maxRadius = 2;
            chartObj.refresh();

        });
        it('Checking with undefined size', (done: Function) => {
            loaded = (args: Arg): void => {
                expect((<Series>(args.chart.series[0])).sizeMax !== undefined).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].dataSource[0].size = undefined;
            chartObj.refresh();


        });
        it('Checking with null Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].dataSource[3].y = null;
            chartObj.series[0].dataSource[0].size = 5000;
            chartObj.refresh();


        });

        it('Checking with negative Points', (done: Function) => {
            loaded = (args: Arg): void => {
                svg = document.getElementById('container1_AxisLabel_4');
                series = <Series>args.chart.series[0];
                expect(parseFloat(svg.getAttribute('y')) < series.points[6].symbolLocations[0].y).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();

        });
        it('Checking with single Points', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesGroup: HTMLElement = document.getElementById('containerSeriesGroup0');
                expect(seriesGroup.childElementCount === 2).toBe(true);
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 10, size: 200 }];
            chartObj.series[0].minRadius = 2;
            chartObj.series[0].maxRadius = 4;
            chartObj.refresh();
        });

        it('Checking with size as negative value', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1, y: 10, size: -200 }];
            chartObj.refresh();


        });

        it('Checking with single Points with radius change', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                radius = parseFloat(svg.getAttribute('rx'));
                expect(+radius.toFixed(2) > 19).toBe(true);
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 10, size: 200 }];
            chartObj.series[0].minRadius = 1;
            chartObj.series[0].maxRadius = 6;
            chartObj.refresh();
        });

        it('Checking without size given', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                expect(+point.getAttribute('rx') > 3).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = tool1;
            chartObj.refresh();
        });

        it('Checking with category axis BetweenTicks', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent).toEqual('USA');
                let axisStart: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(+(axisLabel.getAttribute('x')) > +(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks'
            chartObj.series[0].dataSource = categorySize;
            chartObj.series[0].minRadius = 1;
            chartObj.series[0].maxRadius = 3;
            chartObj.refresh();
        });

        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(point != null).toBe(true);
                axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent).toEqual('USA');
                let axisStart: HTMLElement = document.getElementById('containerAxisLine_0');
                expect(+(axisLabel.getAttribute('x')) < +(axisStart.getAttribute('x1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks'
            chartObj.series[0].dataSource = categorySize;
            chartObj.refresh();
        });

        it('Checking with DateTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0');
                expect(svg != null).toBe(true);
                axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent === '23' || axisLabel.textContent === '24').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.series[0].dataSource = Datedata;
            chartObj.refresh();
        });

        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('fill')).toEqual('red');
                svg = document.getElementById('container_Series_1_Point_1');
                expect(svg.getAttribute('fill')).toEqual('rgba(135,206,235,1)');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', size: 'size', name: 'Gold', fill: 'red',
                type: 'Bubble', animation: { enable: false }
            },
            {
                dataSource: data2, xName: 'x', name: 'silver', yName: 'y', size: 'size', fill: 'rgba(135,206,235,1)',
                type: 'Bubble', animation: { enable: false }
            }];
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with multiple series with other series', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('fill')).toEqual('red');
                svg = document.getElementById('container_Series_1_Point_1');
                expect(svg).toEqual(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                dataSource: data, xName: 'x', yName: 'y', size: 'size', name: 'Gold', fill: 'red',
                type: 'Bubble', animation: { enable: false }
            },
            {
                dataSource: data2, xName: 'x', name: 'silver', yName: 'y', size: 'size', fill: 'rgba(135,206,235,1)',
                type: 'Bar', animation: { enable: false }
            }];
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with Logarithmic axis ', (done: Function) => {
            loaded = (args: Object): void => {
                axisLabel = document.getElementById('container1_AxisLabel_1');
                expect(axisLabel.textContent).toEqual('10');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.series[0].dataSource = logData;
            chartObj.series.length = 1;
            chartObj.refresh();
        });

        it('Checking with Logarithmic axis in xAxis ', (done: Function) => {
            loaded = (args: Object): void => {
                axisLabel = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent).toEqual('100');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Logarithmic';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.series[0].dataSource = logData;
            chartObj.series.length = 1;
            chartObj.refresh();
        });
        it('Checking with border', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(+(point.getAttribute('stroke-width'))).toEqual(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].border.color = 'red';
            chartObj.series[0].border.width = 2;
            chartObj.refresh();
        });

        it('checking with fill for points using events', (done: Function) => {
            let series2: Series = <Series>chartObj.series[0];
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_0');
                expect(point.getAttribute('fill')).toEqual('#00bdae');
                point = document.getElementById('container_Series_0_Point_2');
                expect(point.getAttribute('fill')).toEqual('#357cd2');
                expect(+(point.getAttribute('opacity'))).toEqual(1);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.pointRender = labelRender;
            chartObj.refresh();
        });

        it('checking marker visible as true', (done: Function) => {
            loaded = (args: Object): void => {
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker).toEqual(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
        });

        it('checking with datalabel position as default', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_1');
                labelText = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(point.getAttribute('cy')) - +(point.getAttribute('ry')) > +(labelText.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryYAxis.valueType = 'Double';
            chartObj.series[0].dataSource = dataText;
            chartObj.series[0].marker.dataLabel.name = 'text';
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh();
        });

        it('checking with datalabel position as Top', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_1');
                labelText = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(point.getAttribute('cy')) - +(point.getAttribute('ry')) > +(labelText.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
        });



        it('checking with datalabel position as Middle', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_1');
                labelText = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(point.getAttribute('cx'))).toEqual(+(labelText.getAttribute('x')));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('checking with datalabel position as Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                point = document.getElementById('container_Series_0_Point_1');
                labelText = document.getElementById('container_Series_0_Point_1_Text_0');
                expect(+(point.getAttribute('cy')) + +(point.getAttribute('ry')) < +(labelText.getAttribute('y'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('checking with datalabel position as Bottom with border', (done: Function) => {
            loaded = (args: Object): void => {
                let shape: HTMLElement = document.getElementById('container_Series_0_Point_0_TextShape_0');
                expect(shape).not.toEqual(null);
                expect(shape.getAttribute('stroke')).toEqual('blue');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.series[0].marker.dataLabel.border.color = 'blue';
            chartObj.series[0].marker.dataLabel.border.width = 1;
            chartObj.refresh();
        });

        it('Checking Legend Shape ', (done: Function) => {
            loaded = (args: Object): void => {
                let legendElement: HTMLElement = document.getElementById('container_chart_legend_shape_0');
                expect(legendElement.tagName).toEqual('ellipse');
                expect(legendElement.getAttribute('rx')).toEqual('5');
                expect(legendElement.getAttribute('ry')).toEqual('5');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('bubble Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_2');
                series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let trackSymbol: HTMLElement = document.getElementById('containerSeriesGroup0').lastChild as HTMLElement;
                expect(trackSymbol != null).toBe(true);
                expect(targetElement.getAttribute('opacity')).toEqual('1');
                expect(parseFloat(tooltip.style.top) > series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));

                targetElement = document.getElementById('container_Series_0_Point_0');
                y = series.points[0].regions[0].y + series.points[0].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y')) +
                    elem.offsetTop;
                x = series.points[0].regions[0].x + series.points[0].regions[0].width / 2 + parseFloat(chartArea.getAttribute('x')) +
                    elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(targetElement.getAttribute('opacity')).toEqual('1');
                expect(+(tooltip.style.left) > series.points[0].regions[0].width / 2 + series.points[0].regions[0].x +
                    +(chartArea.getAttribute('x')));

                targetElement = document.getElementById('container_Series_0_Point_7');
                y = series.points[7].regions[0].y + series.points[7].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y')) +
                    elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(tooltip != null).toBe(true);
                expect(targetElement.getAttribute('opacity')).toEqual('1');
                targetElement = document.getElementById('container_tooltip_text');
                expect(targetElement.textContent).toEqual('Gold8000 : 90  Size : 12000');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh();
        });

        it('Checking tooltip with datalabel position as Middle', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_2');
                series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip).not.toEqual(null);
                done();
            };

            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking tooltip with datalabel position as Middle and border', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_2');
                series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip).not.toEqual(null);
                tooltipY = parseFloat(tooltip.style.top);
                labelText = document.getElementById('container_Series_0_Point_2_TextShape_0');
                dataLabelY = parseFloat(labelText.getAttribute('y'));
              
                expect(tooltipY != dataLabelY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.series[0].marker.dataLabel.border.width = 2;
            chartObj.series[0].marker.dataLabel.border.color = 'pink';
            chartObj.refresh();
        });

        it('Checking tooltip  bottom with datalabel position as Middle', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_6');
                series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[6].regions[0].y + series.points[6].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y')) +
                    elem.offsetTop;
                x = series.points[6].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip).not.toBe(null);
                tooltipY = parseFloat(tooltip.style.top);
                labelText = document.getElementById('container_Series_0_Point_6_Text_0');
                dataLabelY = parseFloat(labelText.getAttribute('y'));

                expect(tooltipY > dataLabelY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[6].y = 90;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh();
        });
        it('Checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_6');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[6].regions[0].y + series.points[6].regions[0].height / 2 + parseFloat(chartArea.getAttribute('y')) +
                    elem.offsetTop;
                x = series.points[6].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

                tooltip = document.getElementById('container_tooltip_group');
                expect(tooltip.childElementCount).toEqual(5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [
                { dataSource: data, type: 'Bubble', xName: 'x', yName: 'y', size: 'size', name: 'series1' },
                { dataSource: data2, xName: 'x', yName: 'y', name: 'series2', size: 'size', type: 'Bubble' }
            ];
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });

        it('Default Crosshair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                let element1: HTMLElement;
                expect(crosshair.childNodes.length).toEqual(3);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length).toEqual(4);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d')).not.toEqual('');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d')).not.toEqual('');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '5503.287'|| element1.textContent == '5509.650').toBe(true);
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_UserInteraction');
                expect(crosshair.childNodes.length).toEqual(3);
                done();
            };

            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = false;
            chartObj.tooltip.enable = false;
            chartObj.crosshair.enable = true;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();

        });

        it('Single point selection', (done: Function) => {
            loaded = () => {
                elementSelect = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(elementSelect);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(elementSelect).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(elementSelect);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = false;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh();
        });

        it('Single point multi selection', (done: Function) => {
            loaded = () => {
                elementSelect = document.getElementById('container_Series_0_Point_4');
                trigger.clickEvent(elementSelect);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(elementSelect).toBe(<HTMLElement>selected[0]);
                elementSelect = document.getElementById('container_Series_0_Point_5');
                trigger.clickEvent(elementSelect);
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
                elementSelect = document.getElementById('container_Series_0_Point_4');
                let series: HTMLElement = document.getElementById('containerSeriesGroup0');
                trigger.clickEvent(elementSelect);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(series).toBe(<HTMLElement>selected[0]);
                trigger.clickEvent(elementSelect);
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
                elementSelect = document.getElementById('container_Series_0_Point_4');
                let element1: HTMLElement = document.getElementById('container_Series_1_Point_4');
                trigger.clickEvent(elementSelect);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(elementSelect).toBe(<HTMLElement>selected[0]);
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
        it('Checking with datalabel position auto(Middle) and tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container_Series_0_Point_0');
                series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[0].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[0].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip).not.toEqual(null);
               // tooltipY = parseFloat(tooltip.style.top);
                //labelText = document.getElementById('container_Series_0_Point_0_TextShape_0');
                //dataLabelY = parseFloat(labelText.getAttribute('y'));
                //expect(tooltipY > dataLabelY).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 2005;
            chartObj.primaryXAxis.maximum = 2007;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 5;
            chartObj.primaryYAxis.maximum = 12;
            chartObj.primaryYAxis.interval = 1;
            chartObj.series = [{
                dataSource: [{ x: 2006, y: 7.8, size: 11 }], type: 'Bubble', xName: 'x', yName: 'y', size: 'size', name: 'series1',
                marker: { dataLabel: { visible: true, position: 'Auto', border: { width: 2, color: 'red' } } }
            }];
            chartObj.tooltip.enable = true;
            chartObj.height = '200';
            chartObj.refresh();
        });



        it('Checking with multiple axes ', (done: Function) => {
            loaded = (args: Object): void => {
                let axis1 = document.getElementById('containerAxisLine_2');
                let axisCollection = document.getElementById('containerAxisInsideCollection');
                expect(+axisCollection.childElementCount).toEqual(5);

                let axis2 = document.getElementById('containerAxisLine_1');
                expect(+axis1.getAttribute('x2')).toEqual(+axis2.getAttribute('x1'));

                let series0: Series = <Series>chartObj.series[0];
                let series1 = <Series>chartObj.series[1];
                let clipRect0 = series0.clipRect.y;
                let clipRect1 = series1.clipRect.y;
                expect(+clipRect0 > +clipRect1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series = [
                {
                    dataSource: data, xName: 'x', yName: 'y', size: 'size', animation: { enable: false }, type: 'Bubble',
                    name: 'ChartSeriesNameGold', fill: 'red'
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', size: 'size', animation: { enable: false }, type: 'Bubble',
                    name: 'ChartSeriesNameSilver', fill: 'blue'
                },
                {
                    dataSource: data, xName: 'x', yName: 'y', size: 'size', animation: { enable: false }, type: 'Bubble',
                    name: 'ChartSeriesNameRuby', fill: 'green'
                },
                {
                    dataSource: data2, xName: 'x', yName: 'y', size: 'size', animation: { enable: false }, type: 'Bubble',
                    name: 'ChartSeriesNamediamond', fill: 'black'
                },
            ];


            chartObj.axes = [{
                rowIndex: 1, name: 'yAxis1',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            },
            {
                columnIndex: 1, name: 'xAxis1',
                titleStyle: { size: '14px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                labelStyle: { size: '12px', fontWeight: 'Regular', color: '#282828', fontStyle: 'Normal', fontFamily: 'Segoe UI' }
            }];
            chartObj.height = '650';
            chartObj.width = '800';
            chartObj.series[1].yAxisName = 'yAxis1';
            chartObj.series[2].xAxisName = 'xAxis1';
            chartObj.series[3].yAxisName = 'yAxis1';
            chartObj.series[3].xAxisName = 'xAxis1';

            chartObj.rows = [{ height: '300', border: { width: 4, color: 'red' } },
            { height: '300', border: { width: 4, color: 'blue' } }];
            chartObj.columns = [{ width: '400', border: { width: 4, color: 'red' } }, { width: '400', border: { width: 4, color: 'red' } }];
            chartObj.refresh();

        });
        it('Checking multiple axes with crosshair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                let element1: HTMLElement;
                expect(crosshair.childNodes.length).toEqual(3);
                expect(crosshair.childNodes[2].childNodes.length).toEqual(4);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d')).not.toEqual('');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d')).not.toEqual('');
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '2006.832' || element1.textContent == '2006.842').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '10.938' || element1.textContent == '11.032').toBe(true);
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_UserInteraction');
                expect(crosshair.childNodes.length).toEqual(3);
                done();
            };

            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = false;
            chartObj.tooltip.enable = false;
            chartObj.crosshair.enable = true;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();

        });
        it('Checking with axis with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_ChartAreaBorder');
                let svg1: HTMLElement = document.getElementById('container2_AxisLabel_0');
                expect(parseFloat(svg.getAttribute('x')) + parseFloat(svg.getAttribute('width')) <
                    parseFloat(svg1.getAttribute('x'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.axes[0].opposedPosition = true;
            chartObj.refresh();
        });
    });

    describe('Checking Zooming ', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let resetElement: HTMLElement;
        let x: number; let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'n1' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },

                    series: [{
                        type: 'Bubble',
                        dataSource: data, xName: 'x', yName: 'y', size: 'size', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            visible: false
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '800',
                    zoomSettings: {
                        enableDeferredZooming: true
                    }

                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking default selection zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.refresh();

        });
        it('mouseWheel zooming - checking tool elements', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length).toEqual(8);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.refresh();
        });

        it('checking zooming with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length).toEqual(8);
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                let element1: HTMLElement = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '3224.4' || element1.textContent == '3187.0').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '38.1' || element1.textContent == '37.8').toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.crosshair.enable = true;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.series[0].dataSource[3].y = 0;
            chartObj.refresh();
        });

        it('checking zooming with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length).toEqual(8);
                targetElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(targetElement.getAttribute('opacity')).toEqual('1');
                targetElement = document.getElementById('container_tooltip_text');
                expect(targetElement.textContent).toEqual('ChartSeriesNameGold3000.0 : 3.0  Size : -30000');
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.tooltip.enable = true;
            chartObj.crosshair.enable = true;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();
        });
    });
    describe('Checking with multiple series ', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let resetElement: HTMLElement;
        let x: number; let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {


                    series: [{
                        type: 'Bubble',
                        dataSource: [{ x: 92.2, y: 7.8, size: 1 },
                        { x: 74, y: 6.5, size: 3 },
                        { x: 90.4, y: 6.0, size: 0.238 },
                        { x: 99.4, y: 2.2, size: 0.312 },
                        { x: 88.6, y: 1.3, size: 0.197 },
                        ], xName: 'x', yName: 'y', size: 'size', minRadius : null, maxRadius : null,
                    }, {
                        type: 'Bubble', minRadius : null, maxRadius : null,
                        dataSource: [{ x: 92.2, y: 7.8, size: 1 },
                        { x: 74, y: 6.5, size: 4 },
                        { x: 90.4, y: 6.0, size: 0.238 },
                        { x: 99.4, y: 2.2, size: 0.312 },
                        { x: 88.6, y: 1.3, size: 0.197 },
                        ], xName: 'x', yName: 'y', size: 'size',  
                    }, {
                        type: 'Bubble',
                        dataSource: [{ x: 92.2, y: 7.8, size: 2 },
                        { x: 74, y: 6.5, size: 3 },
                        { x: 90.4, y: 6.0, size: 0.238 },
                        { x: 99.4, y: 2.2, size: 0.312 },
                        { x: 88.6, y: 1.3, size: 0.197 },
                        ], xName: 'x', yName: 'y', size: 'size', minRadius : null, maxRadius : null,
                    },
                    {
                        type: 'Bubble', visible : false,
                        dataSource: [{ x: 92.2, y: 7.8, size: 2 },
                        { x: 74, y: 6.5, size: 3 },
                        { x: 90.4, y: 6.0, size: 0.238 },
                        { x: 99.4, y: 2.2, size: 0.312 },
                        { x: 88.6, y: 1.3, size: 0.197 },
                        ], xName: 'x', yName: 'y', size: 'size', minRadius : null, maxRadius : null,
                    }
                    ],


                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking default rendering', (done: Function) => {
            loaded = (args: Object): void => {
                let svg : Element = document.getElementById('container_Series_0_Point_0');
                expect(svg !== null).toBe(true);
                svg  = document.getElementById('container_Series_1_Point_0');
                expect(svg !== null).toBe(true);
                svg  = document.getElementById('container_Series_2_Point_0');
                expect(svg !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
    });
    describe('Bubble Series Inversed axis', () => {
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
                        name: 'ChartSeriesNameGold', dataSource: data, xName: 'x', yName: 'y', size: 'size',
                        type: 'Bubble', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
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
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();

        });

        it('With Label position Outer', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Outer';
            chart.refresh();

        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[1]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
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
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
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
    describe('checking rotated bubble chart', () => {
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
                primaryYAxis: { title: 'PrimaryYAxis'},
                series: [
                    { type: 'Bubble', name: 'series1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}},
                    { type: 'Bubble', name: 'series2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}}
                ],
                title: 'rotated bubble Chart'
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
                dataLabel = document.getElementById('container_Series_0_Point_2');
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

