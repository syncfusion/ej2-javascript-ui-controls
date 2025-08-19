/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable eqeqeq */
import { createElement, EmitType, remove } from '@syncfusion/ej2-base';
import { Chart3DLoadedEventArgs, Chart3DPointEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../base/events.spec';
import { Chart3DSeriesModel } from '../../../src/chart3d/series/chart-series-model';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { Tooltip3D } from '../../../src/chart3d/user-interaction/tooltip';
import { StackingBarSeries3D } from '../../../src/chart3d/series/stacking-bar-series';
import { DataValue } from '../../chart/base/data.spec';
import { Rect } from '@syncfusion/ej2-svg-base';
import { CircularChart3DLoadedEventArgs } from '../../../src';

Chart3D.Inject(
    ColumnSeries3D, BarSeries3D, DateTime3D, Category3D, Tooltip3D, StackingBarSeries3D, Highlight3D, Legend3D
);

export const tooltipData1: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];

export const tooltipData2: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];

export const datetimeData: DataValue[] = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
{ x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
{ x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];

const data: any = tooltipData1;
const data2: any = tooltipData2;

describe('3DChart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    // eslint-disable-next-line @typescript-eslint/indent
    describe('Chart Tooltip', () => {
        let chartObj: Chart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let pointEvent: EmitType<Chart3DPointEventArgs>;
        let loaded1: EmitType<Chart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },

                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)'
                    }], width: '800',
                    tooltip: { enable: true },
                    enableSideBySidePlacement: true,
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Point mouse move and click', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                trigger.clickEvent(targetElement);
                done();
            };
            pointEvent = (args: Chart3DPointEventArgs): void => {
                expect(args.pointIndex === 1).toBe(true);
                expect(args.seriesIndex === 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.pointClick = pointEvent;
            chartObj.pointMove = pointEvent;
            chartObj.refresh();
        });

        it('Default Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);

                const group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                const path: HTMLElement = group.childNodes[0] as HTMLElement;
                const text1: HTMLElement = group.childNodes[1] as HTMLElement;
                const text2: HTMLElement = group.childNodes[2] as HTMLElement;

                expect(path.localName === 'path').toBe(true);
                expect(path.getAttribute('d') !== '' || ' ').toBe(true);
                expect(group.childNodes.length === 4).toBe(true);
                expect(text1.childNodes.length === 5).toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') === 'ChartSeriesNameGold$2000.00 : 40').toBe(true);
                // expect(text1.childNodes[1].textContent.replace(/\u200E/g, '') == '$2000.00 : ').toBe(true);
                // expect(text1.childNodes[2].textContent.replace(/\u200E/g, '') == '40').toBe(true);
                expect((<HTMLElement>group.childNodes[2]).getAttribute('d') !== '' || ' ').toBe(true);
                done();
            };
            chartObj.pointClick = null;
            chartObj.pointMove = null;
            chartObj.selectionMode = 'None';
            chartObj.selectionPattern = 'None';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });


        it('Edge Tooltip', () => {

            targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-0') as HTMLElement;
            rect = targetElement.getBoundingClientRect();
            x = window.scrollX + rect.left + rect.width / 2;
            y = window.scrollY + rect.top;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));

            const tooltip: HTMLElement = document.getElementById('container_tooltip');
            expect(tooltip != null).toBe(true);

            const text2: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
            expect(text2.textContent.replace(/\u200E/g, '')).toEqual('ChartSeriesNameGold$1000.00 : 70');

            targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-7') as HTMLElement;

            rect = targetElement.getBoundingClientRect();
            x = window.scrollX + rect.left + rect.width / 2;
            y = window.scrollY + rect.top;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
            const text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;

            expect(text1.textContent.replace(/\u200E/g, '') === 'ChartSeriesNameGold$8000.00 : 70').toBe(true);
            expect((<HTMLElement>tooltip.childNodes[0].childNodes[0].childNodes[2]).getAttribute('d') !== '' || ' ').toBe(true);
        });

        it('Column Tooltip', (done: Function) => {

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                const series: Chart3DSeriesModel = <Chart3DSeriesModel>chartObj.series[0];
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                target = document.getElementById('container-svg-0-region-series-0-point-0');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '1').toBe(true);

                target = document.getElementById('container-svg-0-region-series-0-point-7');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('Tooltip with Highlight color', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                const series: Chart3DSeriesModel = <Chart3DSeriesModel>chartObj.series[0];
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);

                target = document.getElementById('container-svg-0-region-series-0-point-0');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);

                target = document.getElementById('container-svg-0-region-series-0-point-5');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') == '1').toBe(true);
                expect(target.getAttribute('fill') == 'rgba(135,206,235,1)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.highlightColor = 'red';
            chartObj.series[0].type = 'Column';
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('Tooltip for Negative point', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
                const series: Chart3DSeriesModel = <Chart3DSeriesModel>chartObj.series[0];
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);


                target = document.getElementById('container-svg-0-region-series-0-point-5');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            data[1].y = -40; data[5].y = -20;
            chartObj.series[0].dataSource = data;
            chartObj.highlightColor = '';
            chartObj.refresh();

        });


        it('Tooltip for datetime Axis', (done: Function) => {
            loaded = (args: Object): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                const text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold2006 : 65').toBe(true);
                remove(document.getElementById('container_tooltip'));
                done();
            };
            chartObj.tooltipRender = null;
            chartObj.loaded = loaded;
            chartObj.pointRender = null;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = '';
            chartObj.series[0].dataSource = datetimeData;
            chartObj.height = '470';
            chartObj.refresh();
        });

        it('Changing the visibility of tooltip', (done: Function) => {
            let target: HTMLElement; let tooltip: HTMLElement;
            loaded = (args: Object): void => {
                target = document.getElementById('container-svg-0-region-series-0-point-3');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });

        it('Changing the visibility of tooltip with axis label format', (done: Function) => {
            let target: HTMLElement; let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                target = document.getElementById('container-svg-0-region-series-0-point-2');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                const group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;

                const path: HTMLElement = group.childNodes[0] as HTMLElement;
                const text1: HTMLElement = group.childNodes[1] as HTMLElement;
                expect(path.getAttribute('fill') == 'pink').toBe(true);
                expect((<HTMLElement>text1.childNodes[0]).getAttribute('fill') == 'red').toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') == 'ChartSeriesNameGold#3000 : 70C').toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.tooltip.enable = true;
            chartObj.tooltip.fill = 'pink';
            chartObj.tooltip.textStyle.color = 'red';
            chartObj.tooltip.format = null;
            chartObj.primaryYAxis.labelFormat = '{value}C';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.labelFormat = '#{value}';
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });

        it('Checking with inverted axis series', (done: Function) => {
            let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                const target = document.getElementById('container-svg-0-region-series-0-point-2');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.series = [{
                type: 'Bar', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }
            }, { type: 'Bar', dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false } }];
            chartObj.refresh();
        });

        it('checking with headerText without header', (done: Function) => {
            loaded = (args: Object): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-6');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip_text');
                expect(tooltip.firstElementChild.innerHTML).toEqual('#7000 ');
                trigger.mousemovetEvent(target, Math.ceil(x + 10), Math.ceil(y + 10));
                done();
            };
            chartObj.loaded = loaded;
            // chartObj.tooltipRender = (args: ITooltipRenderEventArgs) => {
            //     args.headerText = '${point.x}';
            // };
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('checking with tooltipRender event with template', (done: Function) => {
            loaded = (args: Object): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-6');
                const target1: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-5');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>#7000</div><div>40C</div>');
                rect = target1.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target1, Math.ceil(x), Math.ceil(y));
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>#6000</div><div>-20C</div>');
                trigger.mouseuptEvent(target1, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip = { enable: true, fadeOutMode: 'Click' };
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.refresh();
        });
        it('chart tooltip format checking with keyboard navigation', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs) => {
                let element = document.getElementById('container-svg-0-region-series-0-point-0');
                trigger.keyboardEvent('keydown', element, 'Space', 'Space');
                trigger.keyboardEvent('keyup', element, 'ArrowUp', 'ArrowUp');
                trigger.keyboardEvent('keydown', element, 'Escape', 'Escape');
                trigger.keyboardEvent('keyup', element, 'ArrowDown', 'ArrowDown');
                trigger.keyboardEvent('keyup', element, 'ArrowLeft', 'ArrowLeft');
                trigger.keyboardEvent('keyup', element, 'ArrowRight', 'ArrowRight');
                trigger.keyboardEvent('keyup', element, 'Tab', 'Tab');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('checking with tooltipRender event with fixed location', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-6');
                const target1: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-5');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>#7000</div><div>40C</div>');
                rect = target1.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target1, Math.ceil(x), Math.ceil(y));
                expect(tooltip.firstElementChild.innerHTML).toEqual('<div>#6000</div><div>-20C</div>');
                args.chart.isTouch = true;
                trigger.mouseuptEvent(target1, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip = { enable: true, fadeOutMode: 'Click', enableMarker: true, location: { x: 100, y: 100 } };
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.refresh();
        });

    });

    describe('Chart template', () => {
        let chartObj: Chart3D;
        let elem: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let loaded1: EmitType<Chart3DLoadedEventArgs>;
        let rect: DOMRect | ClientRect;
        const trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal', labelFormat: '{value}°C' },

                    series: [{
                        dataSource: [
                            { x: 'Sun', y: 15 }, { x: 'Mon', y: 22 },
                            { x: 'Tue', y: 32 },
                            { x: 'Wed', y: 31 },
                            { x: 'Thu', y: 29 }, { x: 'Fri', y: 24 },
                            { x: 'Sat', y: 18 }
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)'
                    },
                    {
                        dataSource: [
                            { x: 'Sun', y: 10 }, { x: 'Mon', y: 18 },
                            { x: 'Tue', y: 28 },
                            { x: 'Wed', y: 28 },
                            { x: 'Thu', y: 26 }, { x: 'Fri', y: 20 },
                            { x: 'Sat', y: 15 }
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameSilver', fill: 'rgba(135,206,235,1)'
                    }], width: '800',
                    tooltip: { enable: true },enableSideBySidePlacement: false,
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with tooltip template', (done: Function) => {
            let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                let target: HTMLElement;
                target = document.getElementById('container-svg-0-region-series-0-point-1');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip !== null).toBe(true);
                done();
            };
            chartObj.tooltip.template = '<div>${x}</div><div>${y}</div>';
            chartObj.title = 'Template';
            chartObj.loaded = loaded1;
            chartObj.dataBind();
        });
        it('Checking cylinder series with tooltip template', (done: Function) => {
            loaded1 = (args: Object): void => {
                let target: HTMLElement;
                target = document.getElementById('container-svg-0-region-series-0-point-1');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.series[0].columnFacet='Cylinder';
            chartObj.refresh();
        });
        it('Checking cylinder column series with tooltip template', (done: Function) => {
            loaded1 = (args: Object): void => {
                let target: HTMLElement;
                target = document.getElementById('container-svg-19-region-series-0-point-1');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.series[0].type = 'Bar';
            chartObj.series[0].columnFacet = 'Cylinder';
            chartObj.refresh();
        });
    });

    describe('customer issue: Tooltip on property change console error checking', () => {
        let chartObj: Chart3D;
        const div: HTMLElement = createElement('div', { id: 'mainDiv' });
        const elem: HTMLElement = createElement('div', { id: 'container' });
        const button1: HTMLElement = createElement('button', { id: 'button1' });
        const button2: HTMLElement = createElement('button', { id: 'button2' });
        let targetElement: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            document.body.appendChild(div);
            div.appendChild(button1);
            div.appendChild(button2);
            div.appendChild(elem);
            chartObj = new Chart3D(
                {
                    //Initializing Primary X and Y Axis
                    primaryXAxis: {
                        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
                    },
                    primaryYAxis:
                    {
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 }, labelStyle: { color: 'transparent' }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Column', xName: 'x',  yName: 'y', name: 'Gold',
                            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }]
                        },
                        {
                            type: 'Column', xName: 'x', yName: 'y', name: 'Silver',
                            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }]
                        },
                        {
                            type: 'Column', xName: 'x', yName: 'y', name: 'Bronze',
                            dataSource: [{ x: 'USA', y: 38 }, { x: 'GBR', y: 17 }, { x: 'CHN', y: 26 }]
                        }
                    ],
                    //Initializing Chart title
                    width: '500px',enableSideBySidePlacement: false,
                    title: 'Olympic Medal Counts - RIO', tooltip: { enable: true }
                });
            chartObj.appendTo('#container');
            document.getElementById('button1').onclick = function () {
                chartObj.tooltip = { enable: false };
            };
            document.getElementById('button2').onclick = function () {
                chartObj.tooltip = { enable: true };
            };
        });
        afterAll((): void => {
            chartObj.destroy();
            div.remove();
        });

        it('Disable the tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('button1') as HTMLElement;
                trigger.clickEvent(targetElement);
                expect(chartObj.tooltip.enable === false).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Enable the tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('button2') as HTMLElement;
                trigger.clickEvent(targetElement);
                expect(chartObj.tooltip.enable === true).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Chart Back to Back column Tooltip', () => {
        let chartObj: Chart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let pointEvent: EmitType<Chart3DPointEventArgs>;
        let loaded1: EmitType<Chart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart3D(
                {
                primaryXAxis: {
                    valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 },
                    minorTickLines: { width: 0 },
                },
                //chartArea: { border: { width: 0 } },
                primaryYAxis:
                {
                    title: 'Fruits Count',
                    majorTickLines: { width: 0 },
                },
                // Initialize the chart series
                series: [
                    {
                        type: 'Column', xName: 'x', yName: 'y', name: 'Grapes',
                        dataSource: [{ x: 'Jamesh', y: 1 }, { x: 'Michael', y: 2 }, { x: 'John', y: 2 }, { x: 'Jack', y: 1 }, { x: 'Lucas', y: 1 }],
                        columnWidth: 0.2
                    },
                    {
                        type: 'Column', xName: 'x',  yName: 'y', name: 'Orange',
                        dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }, { x: 'Jack', y: 2 }, { x: 'Lucas', y: 3 }],
                        columnWidth: 0.3
                    },
                    {
                        type: 'Column', xName: 'x',  yName: 'y', name: 'Apple',
                        dataSource: [{ x: 'Jamesh', y: 5 }, { x: 'Michael', y: 4 }, { x: 'John', y: 5 }, { x: 'Jack', y: 5 }, { x: 'Lucas', y: 6 }],
                        columnWidth: 0.4
                    },
                    {
                        type: 'Column', xName: 'x',  yName: 'y', name: 'Total',
                        dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                        { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }, { x: 'Jack', y: 8, text: 'Total 8' }, { x: 'Lucas', y: 10, text: 'Total 10' }],
                        columnWidth: 0.5
                    }
                ],
                enableSideBySidePlacement: false,
                enableRotation: true,
                // Initialize the chart title
                title: 'Fruit Consumption', tooltip: { enable: true },
                legendSettings: { visible: true, enableHighlight: true },
            }
            );
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Back to back column tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg')
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Back to back column tooltip with fixed location', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                args.chart.isTouch = true;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg')
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.location = { x: 100, y: 100 };
            chartObj.tooltip.enableMarker = false;
            chartObj.refresh();
        });
        it('Back to back column tooltip with fixed location', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                args.chart.isTouch = true;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg')
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.location = { x: 100, y: 100 };
            chartObj.theme = 'Tailwind3';
            chartObj.tooltip.enableMarker = false;
            chartObj.refresh();
        });
        it('Back to back column tooltip with format and fixed location', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                trigger.mousemovetEvent(targetElement, 100, 100);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.format = '${point.x}';
            chartObj.theme = 'Tailwind3';
            chartObj.refresh();
        });

    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
