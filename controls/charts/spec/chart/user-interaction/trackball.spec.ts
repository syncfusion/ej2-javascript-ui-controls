/**
 * Tooltip spec document
 */
import { createElement, remove, TapEventArgs, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType, ChartRangePadding, ValueType, ChartShape, LabelPlacement, LineType } from '../../../src/chart/utils/enum';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { track1, track2, track3, track4, unbindResizeEvents } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Category } from '../../../src/chart/axis/category-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, ITooltipRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DateTime, Category);
Chart.Inject(Crosshair, Tooltip);


describe('Chart Trackball', () => {

    describe('Chart Trackball Default', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>; let loaded1: Function;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category', crosshairTooltip: { enable: true } },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: 'C', crosshairTooltip: { enable: true } },

                    series: [{
                        dataSource: track1, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: '#B82E3D', width: 2,
                        type: 'Line', marker: { visible: true, height: 8, width: 8 },
                    }, {
                        dataSource: track2, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan1', fill: 'blue', width: 2,
                        type: 'Line', marker: { visible: true, height: 8, width: 8 },
                    },
                    {
                        dataSource: track3, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan2', fill: 'aqua', width: 2,
                        type: 'Line', marker: { visible: true, height: 8, width: 8 },
                    },
                    {
                        dataSource: track4, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan3', fill: 'red', width: 2,
                        type: 'Line', marker: { visible: true, height: 8, width: 8 },
                    }
                    ], width: '1000',
                    tooltip: { enable: true, shared: true },
                    crosshair: { enable: true },
                    title: 'Export', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
            remove(document.getElementById('container_tooltip'));
        });

        it('Default Trackball with shared tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container_Series_0_Point_1_Symbol') as HTMLElement;

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                expect(crosshair.childNodes.length == 3).toBe(true);
                let element1: HTMLElement;
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);

                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];

                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);

                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text: HTMLElement = group.childNodes[1] as HTMLElement;
                let headerPath: HTMLElement = group.childNodes[2] as HTMLElement;
                let Icons: HTMLElement = group.childNodes[4] as HTMLElement;


                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(headerPath.getAttribute('d') != '' || ' ').toBe(true);
                expect(Icons.childNodes.length == 4).toBe(true);
                expect(text.textContent === 'FebJapan : -$1.00Japan1 : $3.50Japan2 : $8.00Japan3 : $10.00').toBe(true);


                let trackSymbol: HTMLElement = document.getElementById('containerSymbolGroup0').lastChild as HTMLElement;
                expect(trackSymbol.id.indexOf('Trackball') > 0).toBe(true);
                trackSymbol = document.getElementById('containerSymbolGroup1').lastChild as HTMLElement;
                expect(trackSymbol.id.indexOf('Trackball') > 0).toBe(true);
                trackSymbol = document.getElementById('containerSymbolGroup2').lastChild as HTMLElement;
                expect(trackSymbol.id.indexOf('Trackball') > 0).toBe(true);
                trackSymbol = document.getElementById('containerSymbolGroup3').lastChild as HTMLElement;
                expect(trackSymbol.id.indexOf('Trackball') > 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('With Column type series', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                expect(crosshair.childNodes.length == 3).toBe(true);
                let element1: HTMLElement;
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d') == '').toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);

                expect(crosshair.childNodes[2].childNodes[1].textContent == 'Mar').toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 2).toBe(true);

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);

                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 5).toBe(true);
                expect(group.childNodes[1].childNodes.length == 9).toBe(true);

                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(document.getElementById('container_Series_1_Point_2').getAttribute('opacity') == '0.5').toBe(true);
                expect(document.getElementById('container_Series_2_Point_2').getAttribute('opacity') == '0.5').toBe(true);
                expect(document.getElementById('container_Series_3_Point_2').getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.series[0].type = 'Column';
            chartObj.series[1].type = 'Column';
            chartObj.series[2].type = 'Column';
            chartObj.series[3].type = 'Column';
            chartObj.primaryYAxis.crosshairTooltip.enable = false;
            chartObj.crosshair.lineType = 'Vertical';

            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking the visibility of series with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_4');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetLeft > x).toBe(true);

                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                expect(group.childNodes[1].childNodes.length == 7).toBe(true);
                done();
            };
            chartObj.series[2].visible = false;
            chartObj.crosshair.lineType = 'Horizontal';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking the with null points', (done: Function) => {
            track1[4].y = null;
            track1[7].y = null;
            track2[5].y = null;
            track2[8].y = null;
            track2[track2.length - 1].y = null;
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container_Series_1_Point_4_Symbol') as HTMLElement;

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));


                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetLeft < x).toBe(true);

                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                expect(group.childNodes[4].childNodes.length == 1).toBe(true);
                expect(group.childNodes[1].childNodes.length == 3).toBe(true);

                targetElement = chartObj.element.querySelector('#container_Series_0_Point_11_Symbol') as HTMLElement;
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.series = [];
            chartObj.series = [{
                dataSource: track1, xName: 'x', yName: 'y', animation: { enable: false },
                name: 'Japan', fill: '#B82E3D', width: 2,
                type: 'Line', marker: { visible: true, height: 8, width: 8 },
            }, {
                dataSource: track2, xName: 'x', yName: 'y', animation: { enable: false },
                name: 'Japan', fill: 'blue', width: 2,
                type: 'Line', marker: { visible: true, height: 8, width: 8 },
            }];
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.refresh();
        });
        it('Checking the areabounds', (done: Function) => {
            let animate: EmitType<IAnimationCompleteEventArgs> = (args: Object): void => {
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.crosshair.lineType = 'Both';
            chartObj.animationComplete = animate;
            chartObj.dataBind();
            targetElement = chartObj.element.querySelector('#container_Series_0_Point_0_Symbol') as HTMLElement;

            let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
            y = parseFloat(chartArea.getAttribute('height')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
            x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
        });
        it('Checking the single series', (done: Function) => {
            track1[4].y = 24;
            track1[7].y = -16;
            track2[5].y = 23;
            track2[8].y = -11;
            track2[track2.length - 1].y = null;
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container_Series_0_Point_0_Symbol') as HTMLElement;

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetLeft + elem.offsetLeft - 0.5 == x).toBe(true);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.series = [];
            chartObj.series = [{
                dataSource: track1, xName: 'x', yName: 'y', animation: { enable: false },
                name: 'Japan', fill: '#B82E3D', width: 2,
                type: 'Line', marker: { visible: true, height: 8, width: 8 },
            }];
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.tooltip.format = '${point.x}';
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('Checking the single series with column series', (done: Function) => {
            track1[4].y = 24;
            track1[7].y = -16;
            track2[5].y = 23;
            track2[8].y = -11;
            track2[track2.length - 1].y = null;
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_7');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[7].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[7].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.offsetTop < y + series.points[7].regions[0].height).toBe(true);

                target = document.getElementById('container_Series_0_Point_1');
                series = <Series>chartObj.series[0];
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let change: any = { changedTouches: [{ clientX: 100, clientY: 100 }] };
                chartObj.longPress({ originalEvent: change });
                chartObj.longPress();
                done();
            };
            chartObj.series[0].type = 'Column';
            chartObj.loaded = loaded;
            chartObj.tooltipRender = (args: ITooltipRenderEventArgs) => {
                args.text = args.text + 'custom';
                if (args.point.index == 1) {
                    args.cancel = true;
                }
            }
            chartObj.primaryXAxis.labelPlacement = 'OnTicks';
            chartObj.tooltip.format = '${point.y}';
            chartObj.refresh();
        });
    });

    describe('Chart Trackball Default', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>; let loaded1: Function;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category', crosshairTooltip: { enable: true } },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: 'C', crosshairTooltip: { enable: true } },

                    series: [{
                        dataSource: [{ x: 'Jan', y: -1, color: 'red' }, { x: 'Feb', y: -1, color: 'blue' }, { x: 'Mar', y: 2, color: 'green' }, { x: 'Apr', y: 8 },
                        { x: 'May', y: 13, color: 'orange' }, { x: 'Jun', y: 18, color: 'purple' }, { x: 'Jul', y: 21, color: 'pink' }, { x: 'yellow', y: 20, color: 'red' },
                        { x: 'Sep', y: 16, color: 'teal' }, { x: 'Oct', y: 10, color: 'violet' }, { x: 'Nov', y: 4, color: 'black' }, { x: 'Dec', y: 0, color: 'whitesmoke' }],
                        xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: '#B82E3D', width: 2,
                        type: 'Line', pointColorMapping: 'color'
                    }
                    ], width: '1000',
                    crosshair: {
                        enable: true,
                        lineType: 'Vertical'
                    },
                    tooltip: { enable: true, shared: true },
                    title: 'Export', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
            remove(document.getElementById('container_tooltip'));
        });

        it('Default Trackball with shared tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[5].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[5].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(elem, Math.ceil(x), Math.ceil(y));
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_5_Trackball_0');
                expect(marker.getAttribute('fill')).toBe('transparent');
                expect(marker.getAttribute('stroke')).toBe('rgba(128,0,128,0.2)');
                marker = document.getElementById('container_Series_0_Point_5_Trackball_1');
                expect(marker.getAttribute('fill')).toBe('#ffffff');
                expect(marker.getAttribute('stroke')).toBe('purple');
                y = series.points[0].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[0].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(elem, Math.ceil(x), Math.ceil(y));
                marker = document.getElementById('container_Series_0_Point_0_Trackball_1');
                expect(marker.getAttribute('fill')).toBe('#ffffff');
                expect(marker.getAttribute('stroke')).toBe('red');
                y = series.points[11].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[11].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(elem, Math.ceil(x), Math.ceil(y));
                marker = document.getElementById('container_Series_0_Point_11_Trackball_1');
                expect(marker.getAttribute('fill')).toBe('#ffffff');
                expect(marker.getAttribute('stroke')).toBe('whitesmoke');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

          it('Default Trackball with shared tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[5].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[5].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(elem, Math.ceil(x), Math.ceil(y));
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_5_Trackball_0');
                expect(marker).toBe(null);
                marker = document.getElementById('container_Series_1_Point_5_Trackball_0');
                expect(marker !== null);
                done();
            };
            chartObj.series[0].enableTooltip = false;
            chartObj.loaded = loaded;
            chartObj.addSeries([{
                        dataSource: [{ x: 'Jan', y: 11, color: 'red' }, { x: 'Feb', y: -1, color: 'blue' }, { x: 'Mar', y: 2, color: 'green' }, { x: 'Apr', y: -8 },
                        { x: 'May', y: 15, color: 'orange' }, { x: 'Jun', y: 14, color: 'purple' }, { x: 'Jul', y: 31, color: 'pink' }, { x: 'yellow', y: 23, color: 'red' },
                        { x: 'Sep', y: 17, color: 'teal' }, { x: 'Oct', y: 19, color: 'violet' }, { x: 'Nov', y: 14, color: 'black' }, { x: 'Dec', y: 10, color: 'whitesmoke' }],
                        xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: '#B82E3D', width: 2,
                        type: 'Column', pointColorMapping: 'color'
                    }]);
             
        });
        it('Trackball with shared tooltip and marker false for column series', (done: Function) => {
            loaded = (args: Object): void => {
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[5].symbolLocations[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[5].symbolLocations[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(elem, Math.ceil(x), Math.ceil(y));
                let marker: HTMLElement = document.getElementById('container_Series_0_Point_5_Trackball_0');
                expect(marker).toBe(null);
                marker = document.getElementById('container_Series_1_Point_5_Trackball_0');
                expect(marker).toBe(null);
                done();
            };
            chartObj.series[0].enableTooltip = true;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.shared = true;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].marker.visible = false;
            chartObj.series[1].marker.visible = false;
            chartObj.loaded = loaded;  
            chartObj.refresh();
        });
    });
});