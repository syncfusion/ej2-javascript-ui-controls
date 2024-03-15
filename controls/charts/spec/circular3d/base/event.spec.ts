/* eslint-disable @typescript-eslint/no-unused-vars */

import { createElement, EmitType } from '@syncfusion/ej2-base';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { DataValue } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChartTooltip3D} from '../../../src/circularchart3d/user-interaction/tooltip';
import { CircularChartLegend3D} from '../../../src/circularchart3d/legend/legend';
import { CircularChart3DEventArgs, CircularChart3DLoadedEventArgs, CircularChart3DPointEventArgs, CircularChart3DPointRenderEventArgs, CircularChart3DSeriesRenderEventArgs, CircularChart3DTooltipRenderEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { CircularChartHighlight3D  } from '../../../src/circularchart3d/user-interaction/high-light';

CircularChart3D.Inject(CircularChartTooltip3D, CircularChartLegend3D, CircularChartHighlight3D);

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

describe('3DChart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Circular 3D event checking', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DEventArgs>;
        let pointEvent: EmitType<CircularChart3DPointRenderEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold'
                    }], width: '800',
                    tooltip: { enable: true },
                    title: 'Chart TS Title',
                    subTitle: 'In Percentage',
                    subTitleStyle: { textAlignment: 'Far' },
                    loaded: loaded, legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Load event', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('container-svg-10-region-series-0-point-7').getAttribute('opacity')).toBe('0.5');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.load = (args: CircularChart3DLoadedEventArgs) => {
                chartObj.series[0].opacity = 0.5;
            };
            chartObj.refresh();
        });
        it('Point click event', (done: Function) => {
            loaded = (args: Object): void => {

                targetElement = chartObj.element.querySelector('#container-svg-10-region-series-0-point-7') as HTMLElement;
                trigger.clickEvent(targetElement);
                done();
            };
            pointEvent = (args: CircularChart3DPointEventArgs) => {
                expect(args.pointIndex).toBe(7);
                expect(args.seriesIndex).toBe(0);
                done();
            };
            chartObj.pointClick = pointEvent;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('Circular3D Events Checking', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let loaded: EmitType<CircularChart3DEventArgs>;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new CircularChart3D(
                {
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold'
                    }], width: '800',
                    tooltip: { enable: true },
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false },
                    pointRender: (args: CircularChart3DPointRenderEventArgs) => {
                        if (args.point.index === 0) {
                            args.fill = 'red';
                        }
                    }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Point render event', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('container-svg-10-region-series-0-point-0').getAttribute('fill')).toBe('#ff0000');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('Circular3D Events Checking', () => {
        let chartObj: CircularChart3D;
        const elem: HTMLElement = createElement('div', { id: 'container' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DEventArgs>;
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
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false },
                    tooltipRender: (args: CircularChart3DTooltipRenderEventArgs) => {
                        args.text = 'Tooltip';
                    }
                });
            chartObj.appendTo('#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Tooltip render event', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip') !== null).toBe(true);
                expect(document.getElementById('container_tooltip_text').children[1].innerHTML).toBe('Tooltip');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Series render event', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip') !== null).toBe(true);
                expect(document.getElementById('container_tooltip_text').children[1].innerHTML).toBe('Tooltip');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.seriesRender = (args: CircularChart3DSeriesRenderEventArgs) => {
                expect(args.series.name === 'ChartSeriesNameGold').toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Check tooltip in mobile mode', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#container-border') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mouseuptEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('container_tooltip') === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
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
