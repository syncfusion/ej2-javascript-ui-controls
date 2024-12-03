/**
 * Tooltip spec document
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType } from '../../../src/chart/utils/enum';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';

import { MouseEvents } from '../base/events.spec';
import { categoryData, categoryData1, tooltipData1, datetimeData } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { DataEditing } from '../../../src/chart/user-interaction/data-editing';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs,  } from '../../../src/chart/model/chart-interface';
Chart.Inject(LineSeries, ColumnSeries, DateTime, Category, Tooltip, DataEditing);
Chart.Inject(Crosshair, AreaSeries);


describe('Chart Crosshair', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Chart Crosshair Default', () => {
        let chartObj: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>; let loaded1: Function;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            if (document.getElementById('container')) {
                document.getElementById('container').remove();
            }
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category', labelPlacement: 'OnTicks', crosshairTooltip: { enable: true } },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: 'C', crosshairTooltip: { enable: true } },

                    series: [{
                        dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: '#B82E3D', width: 2,
                        type: 'Column', marker: { visible: true, height: 8, width: 8 },
                    }, {
                        dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: 'blue', width: 2,
                        type: 'Column', marker: { visible: true, height: 8, width: 8 },
                    }
                    ],  width: '1000',
                    crosshair: { enable: true },
                    title: 'Export', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Default Crosshair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'France').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '$39.86' || element1.textContent == '$39.85').toBe(true);

                chartArea = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + elem.offsetTop + 1;
                x = parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft  + 1;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                crosshair = <Element>document.getElementById('container_svg').lastChild;
                expect(crosshair.childNodes.length == 3).toBe(true);
                done();
            };

            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Customizing Axis Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 4 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.getAttribute('fill') == 'red').toBe(true);
                expect(element1.getAttribute('font-size') == '16px').toBe(true);
                expect(element1.textContent == 'Japan').toBe(true);
                done();
            };
            chartObj.primaryYAxis.crosshairTooltip.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.textStyle.color = 'red';
            chartObj.primaryXAxis.crosshairTooltip.textStyle.size = '16px';
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('OnTicks and BetweenTicks', (done: Function) => {

            let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
            y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
            x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
            trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
            let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
            let element1: HTMLElement;
            element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
            expect(element1.textContent == 'Germany1').toBe(true);

            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'Germany1').toBe(true);
                done();
            };

            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks';
            chartObj.loaded = loaded; 
            chartObj.refresh();

        });
         it('Crosshair tooltip inside position', (done: Function) => {
            let element1: HTMLElement;
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'USA').toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
         it('Crosshair tooltip opposed label inside position', (done: Function) => {
            let element1: HTMLElement;
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'USA').toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Inversed Axis', (done: Function) => {
            let element1: HTMLElement;
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'USA').toBe(true);
                done();
            };
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Inversed Axis with tooltip', (done: Function) => {
            let element1: HTMLElement;
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 20;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                element1 = <HTMLElement>document.getElementById('container_axis_tooltip_text_0');
                expect(element1.textContent == 'USA').toBe(true);
                done();
            };
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.tooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Inversed Axis with tooltip enable crosshair at other than series regions', (done: Function) => {
            let element1: HTMLElement;
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) + elem.offsetLeft - 10;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                element1 = <HTMLElement>document.getElementById('container_axis_tooltip_text_0');
                expect(element1.textContent !== null).toBe(true);
                let change : any = {changedTouches :[{clientX : 200, clientY :200}]};
                chartObj.longPress({originalEvent: change });
                trigger.mousemovetEvent(chartArea, 250, 250);
                trigger.mouseupEvent(chartArea, 100, 100, 150, 150);
                chartObj.longPress();
                done();
            };
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.tooltip.enable = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Chart Crosshair Default', () => {
        let chartObj1: Chart;
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>; let loaded1: Function;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            if (document.getElementById('container')) {
                document.getElementById('container').remove();
            }
            document.body.appendChild(elem);
            chartObj1 = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category', labelPlacement: 'OnTicks', crosshairTooltip: { enable: true} },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: 'C', crosshairTooltip: { enable: true } },
                    axes: [
                        { name: 'xAxis1', opposedPosition: true, crosshairTooltip: { enable: true } },
                        { name: 'yAxis1', crosshairTooltip: { enable: true } }, { name: 'yAxis2', opposedPosition: true },
                        { name: 'xAxis2', valueType: 'DateTime', crosshairTooltip: { enable: true } },
                    ],
                    series: [{
                        dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'China', fill: '#B82E3D', width: 2, type: 'Line',
                    }, {
                        dataSource: tooltipData1, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: 'red', width: 2, type: 'Line', xAxisName: 'xAxis1', yAxisName: 'yAxis1'
                    },
                    {
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: 'blue', width: 2, type: 'Line', xAxisName: 'xAxis2', yAxisName: 'yAxis2'
                    }
                    ],  width: '1000',
                    crosshair: { enable: true },
                    title: 'Export', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj1.appendTo('#container');

        });
        afterAll((): void => {
            chartObj1.destroy();
            elem.remove();
        });
        it('Default Crosshair with different type of axis', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect((crosshair as HTMLElement).style.pointerEvents).toBe('none');
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 10).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == 'Australia').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent == '$59.81' || element1.textContent == '$59.74').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].lastChild;
                expect(element1.textContent == '2005').toBe(true);
                done();
            };

            chartObj1.loaded = loaded;
            chartObj1.refresh();
        });

        it('Changing the Visibility different axis', (done: Function) => {

            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];

                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 8).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                expect(element1.getAttribute('fill') == 'blue').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '$59.74' || element1.textContent == '$59.73').toBe(true);
                let elem1: HTMLElement = <HTMLElement>crosshair.childNodes[2].lastChild;
                expect(elem1.getAttribute('fill') == 'red').toBe(true);
                crosshair.innerHTML = '';
                done();
            };
            chartObj1.axes[0].crosshairTooltip.enable = false;
            chartObj1.axes[2].crosshairTooltip.enable = true;
            chartObj1.axes[3].crosshairTooltip.textStyle.color = 'red';
            chartObj1.primaryXAxis.crosshairTooltip.enable = false;
            chartObj1.primaryYAxis.crosshairTooltip.fill = 'blue';
            chartObj1.loaded = loaded;

            chartObj1.refresh();

        });

        it('Changing the Visibility different axis', (done: Function) => {

            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 3 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 3 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;

                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];

                expect(element1.textContent.indexOf('#') > -1).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[3];
                expect(element1.textContent.indexOf('$') > -1).toBe(true);
                done();
            };
            chartObj1.axes[0].crosshairTooltip.enable = true;
            chartObj1.axes[0].labelFormat = '{value}$';
            chartObj1.primaryYAxis.labelFormat = '#{value}';
            chartObj1.loaded = loaded;
            chartObj1.refresh();

        });
        it('crosshair with multiple axes', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[1];
                expect(element1.textContent == '104.7' || element1.textContent == '102.9').toBe(true);
                done();
            };
            chartObj1.primaryXAxis.crosshairTooltip.enable = true;
            chartObj1.axes = [{
                columnIndex: 1, valueType: 'DateTime', name: 'xAxis1',
                crosshairTooltip: { enable: true }
            }, {
                rowIndex: 1, name: 'yAxis1',
                crosshairTooltip: { enable: true }
            }, {
                rowIndex: 1, columnIndex: 1, name: 'yAxis2',
                crosshairTooltip: { enable: true }
            }];
            chartObj1.series = [{
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'China', fill: '#B82E3D', width: 2, type: 'Line',
                    }, {
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: 'red', width: 2, type: 'Line', yAxisName: 'yAxis2', xAxisName: 'xAxis1'
                    },
                    {
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Japan', fill: 'blue', width: 2, type: 'Line',  yAxisName: 'yAxis1',
                    }
                    ];
            chartObj1.rows = [{ height: '200', border: { width: 2, color: 'red' } },
            { height: '100', border: { width: 2, color: 'red' } }];
            chartObj1.columns = [{ width: '300', border: { width: 2, color: 'black' } },
            { width: '300', border: { width: 2, color: 'black' } }];
            chartObj1.primaryXAxis.valueType = 'DateTime';
            chartObj1.axes[0].labelFormat = '';
            chartObj1.primaryYAxis.labelFormat = '';
            chartObj1.loaded = loaded;
            chartObj1.refresh();

        });


        /*it('Changing the Visibility of crosshair', (done: Function) => {
            chartObj1.crosshair.visible = false;            
            let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
            y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
            x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + elem.offsetLeft;
            trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
            let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
            expect(crosshair.children.length == 0).toBe(true);

        });*/

    });

        /**
     * Cheacking point drag and drop with crosshair
     */
    describe('Line series point drag and drop with crosshair', () => {
        let chartObj: Chart; let x: number; let y: number;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let element1: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element1);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'DateTime',
                        labelFormat: 'y',
                        intervalType: 'Years',
                        crosshairTooltip: { enable: true },
                        edgeLabelPlacement: 'Shift',
                        majorGridLines: { width: 0 }
                    },
                
                    //Initializing Primary Y Axis
                    primaryYAxis:
                    {
                        labelFormat: '{value}%',
                        rangePadding: 'None',
                        minimum: 0,
                        maximum: 100,
                        interval: 20,
                        crosshairTooltip: { enable: true },
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 },
                        minorTickLines: { width: 0 }
                    },
                    chartArea: {
                        border: {
                            width: 0
                        }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Line',
                            dataSource: [
                                { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                                { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                                { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                                { x: new Date(2011, 0, 1), y: 70 }
                            ],
                            animation: { enable: false },
                            xName: 'x', width: 2, marker: {
                                visible: true,
                                width: 20,
                                height: 20
                            },
                            yName: 'y', name: 'Germany', dragSettings: { enable: true }
                        },
                        {
                            type: 'Line',
                            dataSource: [
                                { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                                { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                                { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                            ],
                            animation: { enable: false },
                            xName: 'x', width: 2, marker: {
                                visible: true,
                                width: 20,
                                height: 20
                            },
                            yName: 'y', name: 'England', dragSettings: { enable: true }
                        }
                    ],
                
                    //Initializing Chart title
                    title: 'Inflation - Consumer Price',
                    //Initializing User Interaction Tooltip
                    tooltip: { enable: true},
                    crosshair: { enable: true},
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            element1.remove();
        });

        it('line series drag and drop with crosshair', (done: Function) => {
            loaded = (): void => {
                let target: HTMLElement = document.getElementById('container_Series_1_Point_0_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + element1.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + element1.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                trigger.draganddropEvent(element1, Math.ceil(x), Math.ceil(y), Math.ceil(x), Math.ceil(y) - 108);
                let yValue: number = chartObj.visibleSeries[1].points[0].yValue;
                expect(yValue == 60.24 || yValue == 59.82).toBe(true);
                chartObj.loaded = null;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.shape = 'Circle';
            chartObj.refresh();
        });
    });

    describe('Crosshair customization', () => {
        let chartObj: Chart; let x: number; let y: number;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let elem: HTMLElement = createElement('div', { id: 'crosshairContainer' }); 
        let series1: Object[] = [];
        let point1: Object;
        let value: number = 80;
        let i: number;
        for (i = 1; i < 500; i++) {
            if (Math.random() > .5) {
                value += Math.random();
            } else {
                value -= Math.random();
            }
            point1 = { x: new Date(1910, i + 2, i), y: value.toFixed(1) };
            series1.push(point1);
        }
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    //Initializing Primary X Axis
                    primaryXAxis: {
                        majorGridLines: { width: 0 },
                        valueType: 'DateTime',
                        crosshairTooltip: { enable: true },
                    },
                    primaryYAxis:
                    {
                        minimum: 83, maximum: 95, interval: 1,
                        title: 'Millions in USD',
                        labelFormat: '{value}M',
                        rowIndex: 0,
                        crosshairTooltip: {
                            enable: true
                        }
                    },

                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Area',
                            dataSource: series1,
                            name: 'Product X',
                            xName: 'x',
                            yName: 'y',
                            border: { width: 0.5, color: 'black' },
                        },
                    ],
                    //Initializing Zooming

                    //Initializing Chart title
                    title: 'Sales History of Product X',
                    crosshair: { enable: true },
                });
            chartObj.appendTo('#crosshairContainer');

        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('X axis crosshair opacity checking', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('crosshairContainer_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 4 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('crosshairContainer_svg').lastChild;
                let element1: HTMLElement;
                let element2: HTMLElement;
                expect(crosshair.childNodes.length == 3 || crosshair.childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('opacity') == '0.5' || element1.getAttribute('opacity') == '1').toBe(true);
                element2 = <HTMLElement>crosshair.childNodes[1];
                expect(element2.getAttribute('opacity') == '0.5' || element2.getAttribute('opacity') == null).toBe(true);
                done();
            };
            chartObj.crosshair.opacity = 0.5;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Customizing crosshair color', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('crosshairContainer_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 4 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('crosshairContainer_svg').lastChild;
                let element1: HTMLElement;
                let element2: HTMLElement;
                expect(crosshair.childNodes.length == 3 || crosshair.childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                element2 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('fill') == 'red' || element1.getAttribute('fill') == 'transparent' ).toBe(true);
                expect(element2.getAttribute('fill') == 'green' || element2.getAttribute('fill') == null ).toBe(true); 
                done();
            };
            chartObj.crosshair.horizontalLineColor = 'red';
            chartObj.crosshair.verticalLineColor = 'green';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Crosshair color checking with Bootstrap5 theme', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('crosshairContainer_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 4 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('crosshairContainer_svg').lastChild;
                let element1: HTMLElement;
                let element2: HTMLElement;
                expect(crosshair.childNodes.length == 3 || crosshair.childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                element2 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('fill') == '#343A40' || element1.getAttribute('fill') == 'transparent' ).toBe(true);
                expect(element2.getAttribute('fill') == '#343A40' || element2.getAttribute('fill') == null ).toBe(true); 
                done();
            };
            chartObj.theme = 'Bootstrap5';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Crosshair color checking with Bootstrap5 dark theme', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('crosshairContainer_ChartAreaBorder');
                y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 4 + elem.offsetTop;
                x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 4 + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('crosshairContainer_svg').lastChild;
                let element1: HTMLElement;
                let element2: HTMLElement;
                expect(crosshair.childNodes.length == 3 || crosshair.childNodes.length == 2).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                element2 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('fill') == '#ADB5BD' || element1.getAttribute('fill') == 'transparent' ).toBe(true);
                expect(element2.getAttribute('fill') == '#ADB5BD' || element2.getAttribute('fill') == null ).toBe(true); 
                done();
            };
            chartObj.theme = 'Bootstrap5';
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
    })
});