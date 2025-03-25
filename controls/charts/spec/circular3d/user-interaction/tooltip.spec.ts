/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement, EmitType, remove } from '@syncfusion/ej2-base';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { DataValue } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChartTooltip3D } from '../../../src/circularchart3d/user-interaction/tooltip';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChart3DEventArgs, CircularChart3DLoadedEventArgs, CircularChart3DPointEventArgs, CircularChart3DPointRenderEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { CircularChartHighlight3D } from '../../../src/circularchart3d/user-interaction/high-light';

CircularChart3D.Inject(
    CircularChartTooltip3D, CircularChartLegend3D, CircularChartHighlight3D
);

export const tooltipData1: DataValue[] = [
    { x: 1000, y: 70 }, { x: 2000, y: 40 },
    { x: 3000, y: 70 }, { x: 4000, y: 60 },
    { x: 5000, y: 50 }, { x: 6000, y: 40 },
    { x: 7000, y: 40 }, { x: 8000, y: 70 }
];

export const tooltipData2: DataValue[] = [
    { x: 1000, y: 73 }, { x: 2000, y: 40 },
    { x: 3000, y: 75 }, { x: 4000, y: 30 },
    { x: 5000, y: 56 }, { x: 6000, y: 60 },
    { x: 7000, y: 41 }, { x: 8000, y: 45 }
];

export const datetimeData: DataValue[] = [
    { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
    { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
    { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];

const data: DataValue[] = tooltipData1;
const data2: DataValue[] = tooltipData2;
describe('3DChart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Chart Tooltip', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DEventArgs>;
        let pointEvent: EmitType<CircularChart3DPointRenderEventArgs>;
        let loaded1: EmitType<CircularChart3DEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold'
                    }], width: '800',
                    tooltip: { enable: true },
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
            pointEvent = (args: CircularChart3DPointEventArgs): void => {
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
                expect(path.localName === 'path').toBe(true);
                expect(path.getAttribute('d') !== '' || ' ').toBe(true);
                expect(group.childNodes.length === 4).toBe(true);
                expect(text1.childNodes.length === 5).toBe(true);
                expect(text1.textContent.replace(/\u200E/g, '') === 'ChartSeriesNameGold2000 : 40').toBe(true);
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
            expect(text2.textContent.replace(/\u200E/g, '')).toEqual('ChartSeriesNameGold1000 : 70');
            targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-7') as HTMLElement;
            rect = targetElement.getBoundingClientRect();
            x = window.scrollX + rect.left + rect.width / 2;
            y = window.scrollY + rect.top;
            trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
            const text1: HTMLElement = tooltip.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
            expect(text1.textContent.replace(/\u200E/g, '') === 'ChartSeriesNameGold8000 : 70').toBe(true);
            expect((<HTMLElement>tooltip.childNodes[0].childNodes[0].childNodes[2]).getAttribute('d') !== '' || ' ').toBe(true);
        });
        it('Column Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') === '1').toBe(true);
                target = document.getElementById('container-svg-0-region-series-0-point-0');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(target.getAttribute('opacity') === '1').toBe(true);
                target = document.getElementById('container-svg-0-region-series-0-point-7');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') === '1').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.refresh();
        });
        it('Tooltip for Negative point', (done: Function) => {
            remove(document.getElementById('container_tooltip'));

            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
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
        it('Checking with inverted axis series', (done: Function) => {
            let tooltip: HTMLElement;
            loaded1 = (args: Object): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
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
                dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }
            }, { dataSource: data2, xName: 'x', yName: 'y', animation: { enable: false } }];
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
                expect(tooltip.firstElementChild.innerHTML).toEqual('7000 ');
                trigger.mousemovetEvent(target, Math.ceil(x + 10), Math.ceil(y + 10));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
    });
    describe('Chart template', () => {
        let chartObj: CircularChart3D;
        let elem: HTMLElement;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        let loaded1: EmitType<CircularChart3DLoadedEventArgs>;
        let rect: DOMRect | ClientRect;
        const trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    series: [{
                        dataSource: [
                            { x: 'Sun', y: 15 }, { x: 'Mon', y: 22 },
                            { x: 'Tue', y: 32 },
                            { x: 'Wed', y: 31 },
                            { x: 'Thu', y: 29 }, { x: 'Fri', y: 24 },
                            { x: 'Sat', y: 18 }
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold'
                    },
                    {
                        dataSource: [
                            { x: 'Sun', y: 10 }, { x: 'Mon', y: 18 },
                            { x: 'Tue', y: 28 },
                            { x: 'Wed', y: 28 },
                            { x: 'Thu', y: 26 }, { x: 'Fri', y: 20 },
                            { x: 'Sat', y: 15 }
                        ], xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameSilver'
                    }], width: '800',
                    tooltip: { enable: true },
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking cylinder series with tooltip template', (done: Function) => {
            loaded1 = (args: Object): void => {
                const target: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded1;
            chartObj.tooltip.template = null;
            chartObj.refresh();
        });
    });
    describe('customer issue: Tooltip on property change console error checking', () => {
        let chartObj: CircularChart3D;
        const div: HTMLElement = createElement('div', { id: 'mainDiv' });
        const elem: HTMLElement = createElement('div', { id: 'container' });
        const button1: HTMLElement = createElement('button', { id: 'button1' });
        const button2: HTMLElement = createElement('button', { id: 'button2' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            document.body.appendChild(div);
            div.appendChild(button1);
            div.appendChild(button2);
            div.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    //Initializing Chart Series
                    series: [
                        {
                            xName: 'x', yName: 'y', name: 'Gold',
                            dataSource: [{ x: 'USA', y: 46 }, { x: 'GBR', y: 27 }, { x: 'CHN', y: 26 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Silver',
                            dataSource: [{ x: 'USA', y: 37 }, { x: 'GBR', y: 23 }, { x: 'CHN', y: 18 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Bronze',
                            dataSource: [{ x: 'USA', y: 38 }, { x: 'GBR', y: 17 }, { x: 'CHN', y: 26 }]
                        }
                    ],
                    //Initializing Chart title
                    width: '500px',
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
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    // Initialize the chart series
                    series: [
                        {
                            xName: 'x', yName: 'y', name: 'Grapes',
                            dataSource: [{ x: 'Jamesh', y: 1 }, { x: 'Michael', y: 2 }, { x: 'John', y: 2 }, { x: 'Jack', y: 1 }, { x: 'Lucas', y: 1 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }, { x: 'Jack', y: 2 }, { x: 'Lucas', y: 3 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Apple',
                            dataSource: [{ x: 'Jamesh', y: 5 }, { x: 'Michael', y: 4 }, { x: 'John', y: 5 }, { x: 'Jack', y: 5 }, { x: 'Lucas', y: 6 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Total',
                            dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                                { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }, { x: 'Jack', y: 8, text: 'Total 8' }, { x: 'Lucas', y: 10, text: 'Total 10' }]
                        }
                    ],
                    enableRotation: true,
                    // Initialize the chart title
                    title: 'Fruit Consumption', tooltip: { enable: true },
                    legendSettings: { visible: true, enableHighlight: true }
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
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

    });
    describe('Circular3d chart Tooltip', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    // Initialize the chart series
                    series: [
                        {
                            xName: 'x', yName: 'y', name: 'Grapes',
                            dataSource: [{ x: 'Jamesh', y: 1 }, { x: 'Michael', y: 2 }, { x: 'John', y: 2 }, { x: 'Jack', y: 1 }, { x: 'Lucas', y: 1 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }, { x: 'Jack', y: 2 }, { x: 'Lucas', y: 3 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Apple',
                            dataSource: [{ x: 'Jamesh', y: 5 }, { x: 'Michael', y: 4 }, { x: 'John', y: 5 }, { x: 'Jack', y: 5 }, { x: 'Lucas', y: 6 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Total',
                            dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                                { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }, { x: 'Jack', y: 8, text: 'Total 8' }, { x: 'Lucas', y: 10, text: 'Total 10' }]
                        }
                    ],
                    enableRotation: true,
                    // Initialize the chart title
                    title: 'Fruit Consumption', tooltip: { enable: true },
                    legendSettings: { visible: true, enableHighlight: true }
                }
            );
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Default tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Tooltip with format', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.format = '${point.x} : <b>${point.y} cal</b>';
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('Tooltip with fill', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_path').getAttribute('fill')).toBe('red');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.fill = 'red';
            chartObj.tooltip.format = null;
            chartObj.refresh();
        });
        it('Tooltip with Material3 theme', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_text').getAttribute('font-family')).toBe('Roboto');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.fill = null;
            chartObj.theme = 'Material3';
            chartObj.refresh();
        });
        it('Tooltip with custom style', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_text').getAttribute('font-family')).toBe('Cursive');
                expect(document.getElementById('container_tooltip_text').getAttribute('font-size')).toBe('10px');
                expect(document.getElementById('container_tooltip_text').getAttribute('font-style')).toBe('Italic');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.theme = 'Material';
            chartObj.tooltip.textStyle.fontFamily = 'Cursive';
            chartObj.tooltip.textStyle.fontStyle = 'Italic';
            chartObj.tooltip.textStyle.size = '10px';
            chartObj.refresh();
        });
        it('Donut - Default tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.textStyle.fontFamily = '';
            chartObj.tooltip.textStyle.fontStyle = '';
            chartObj.tooltip.textStyle.size = '';
            chartObj.refresh();
        });
        it('Donut - Tooltip with format', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.format = '${point.x} : <b>${point.y} cal</b>';
            chartObj.tooltip.header = '';
            chartObj.refresh();
        });
        it('Donut - Tooltip with fill', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_path').getAttribute('fill')).toBe('red');
                done();
            };
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.fill = 'red';
            chartObj.tooltip.format = '';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Donut - Tooltip with Material3 theme', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_text').getAttribute('font-family')).toBe('Roboto');
                done();
            };
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.fill = null;
            chartObj.theme = 'Material3';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Donut - Tooltip with custom style', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip_text').getAttribute('font-family')).toBe('Cursive');
                expect(document.getElementById('container_tooltip_text').getAttribute('font-size')).toBe('10px');
                expect(document.getElementById('container_tooltip_text').getAttribute('font-style')).toBe('Italic');
                done();
            };
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.textStyle.fontFamily = 'Cursive';
            chartObj.tooltip.textStyle.fontStyle = 'Italic';
            chartObj.tooltip.textStyle.size = '10px';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Tooltip with template', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.template = '<div id="templateWrap"> <table style="width:100%;  border: 1px solid black;"><tr><th colspan="2" bgcolor="#00FFFF">Unemployment</th></tr><tr><td bgcolor="#00FFFF">${x}:</td><td bgcolor="#00FFFF">${y}</td></tr></table></div>';
            chartObj.refresh();
        });
        it('Donut - Tooltip with template', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.series[0].innerRadius = '40';
            chartObj.tooltip.template = '<div id="templateWrap"> <table style="width:100%;  border: 1px solid black;"><tr><th colspan="2" bgcolor="#00FFFF">Unemployment</th></tr><tr><td bgcolor="#00FFFF">${x}:</td><td bgcolor="#00FFFF">${y}</td></tr></table></div>';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Donut - Tooltip with data label', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = document.getElementById('container-svg-data-label-text-2') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container-svg-data-label-series-0-shape-1');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                done();
            };
            chartObj.series[0].innerRadius = '40';
            chartObj.series[0].dataLabel = {
                visible: true,
                name: 'x',
                position: 'Inside',
                font: {
                    fontWeight: '600',
                },
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('Circular3d chart Tooltip', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    // Initialize the chart series
                    series: [
                        {
                            xName: 'x', yName: 'y', name: 'Grapes',
                            dataSource: [{ x: 'Jamesh', y: 1 }, { x: 'Michael', y: 2 }, { x: 'John', y: 2 }, { x: 'Jack', y: 1 }, { x: 'Lucas', y: 1 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }, { x: 'Jack', y: 2 }, { x: 'Lucas', y: 3 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Apple',
                            dataSource: [{ x: 'Jamesh', y: 5 }, { x: 'Michael', y: 4 }, { x: 'John', y: 5 }, { x: 'Jack', y: 5 }, { x: 'Lucas', y: 6 }]
                        },
                        {
                            xName: 'x', yName: 'y', name: 'Total',
                            dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                                { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }, { x: 'Jack', y: 8, text: 'Total 8' }, { x: 'Lucas', y: 10, text: 'Total 10' }]
                        }
                    ],
                    enableRotation: true,
                    // Initialize the chart title
                    title: 'Fruit Consumption', tooltip: { enable: true, location: { x: 15, y: 25 } },
                    legendSettings: { visible: true, enableHighlight: true }
                }
            );
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Fixed Position', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.opacity = 0.5;
            chartObj.refresh();
        });
        it('Fixed Position', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip_path');
                expect(tooltip.getAttribute('opacity')).toBe('0.5');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { 'x': 'Chrome', y: 5900 },
                { 'x': 'UC Browser', y: 4000 },
                { 'x': 'Opera', y: 3000 },
                { 'x': 'Sogou Explorer', y: 100 },
                { 'x': 'Safari', y: 4000 },
                { 'x': 'Internet Explorer', y: 6000 }
            ];
            chartObj.useGroupingSeparator = true;
            chartObj.refresh();
        });
        it('Fixed Position', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                const tooltip: HTMLElement = document.getElementById('container_tooltip');
                const group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                const text1: HTMLElement = group.childNodes[1] as HTMLElement;
                expect(text1.textContent.replace(/\u200E/g, '') === 'GrapesUC Browser : 4,000').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enableMarker = false;
            chartObj.refresh();
        });
        it('Without enable marker', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                const tooltipMarker: HTMLElement = document.getElementById('container_tooltip_trackball_group');
                expect(tooltipMarker).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.enableHighlight = true;
            chartObj.tooltip.enableTextWrap = true;
            chartObj.refresh();
        });
        it('With hilight module', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                targetElement = document.getElementById('container_svg');
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                const tooltipMarker: HTMLElement = document.getElementById('container_tooltip_trackball_group');
                expect(tooltipMarker).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('chart tooltip format checking with keyboard navigation', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                const element: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                trigger.keyboardEvent('keydown', element, 'Space', 'Space');
                chartObj.theme = 'HighContrastLight';
                trigger.keyboardEvent('keyup', element, 'ArrowUp', 'ArrowUp');
                chartObj.theme = 'HighContrast';
                trigger.keyboardEvent('keydown', element, 'Escape', 'Escape');
                chartObj.theme = 'MaterialDark';
                trigger.keyboardEvent('keyup', element, 'ArrowDown', 'ArrowDown');
                chartObj.theme = 'FabricDark';
                trigger.keyboardEvent('keyup', element, 'ArrowLeft', 'ArrowLeft');
                chartObj.theme = 'Bootstrap';
                trigger.keyboardEvent('keyup', element, 'ArrowRight', 'ArrowRight');
                chartObj.theme = 'Bootstrap4';
                trigger.keyboardEvent('keyup', element, 'Tab', 'Tab');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.highlightMode = 'Point';
            chartObj.highlightPattern = 'Box';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();
        });
        it('Checking with keyboard navigation', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                const element: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                trigger.keyboardEvent('keyup', element, 'ArrowUp', 'ArrowUp');
                chartObj.theme = 'TailwindDark';
                trigger.keyboardEvent('keydown', element, 'Escape', 'Escape');
                chartObj.theme = 'Bootstrap5';
                trigger.keyboardEvent('keyup', element, 'ArrowDown', 'ArrowDown');
                chartObj.theme = 'Bootstrap5Dark';
                trigger.keyboardEvent('keyup', element, 'ArrowLeft', 'ArrowLeft');
                chartObj.theme = 'Fluent';
                trigger.keyboardEvent('keyup', element, 'ArrowRight', 'ArrowRight');
                chartObj.theme = 'FluentDark';
                trigger.keyboardEvent('keyup', element, 'Tab', 'Tab');
                chartObj.theme = 'Fluent2';
                trigger.keyboardEvent('keydown', element, 'Escape', 'Escape');
                chartObj.theme = 'Fluent2Dark';
                trigger.keyboardEvent('keyup', element, 'ArrowDown', 'ArrowDown');
                chartObj.theme = 'Fluent2HighContrast';
                trigger.keyboardEvent('keyup', element, 'ArrowLeft', 'ArrowLeft');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.theme = 'Tailwind';
            chartObj.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
