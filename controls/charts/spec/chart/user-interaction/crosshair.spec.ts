/**
 * Tooltip spec document
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartSeriesType, ChartRangePadding, ValueType, LabelPlacement, } from '../../../src/chart/utils/enum';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';

import { MouseEvents } from '../base/events.spec';
import { categoryData, categoryData1, tooltipData1, datetimeData } from '../base/data.spec';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs,  } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, ColumnSeries, DateTime, Category, Tooltip);
Chart.Inject(Crosshair);


describe('Chart Crosshair', () => {

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
                expect(element1.textContent == '$39.97' || element1.textContent == '$39.85').toBe(true);

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
            expect(element1.textContent == 'France1').toBe(true);

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
                expect(element1.textContent == '$59.81' || element1.textContent == '$59.73').toBe(true);
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
                expect(element1.textContent == '$59.81' || element1.textContent == '$59.73').toBe(true);
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
                expect(element1.textContent == '105.3' || element1.textContent == '102.9').toBe(true);
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
});