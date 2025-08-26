/* eslint-disable @typescript-eslint/no-unused-vars */

import { createElement, EmitType } from '@syncfusion/ej2-base';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { DataValue } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChartTooltip3D } from '../../../src/circularchart3d/user-interaction/tooltip';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChart3DEventArgs, CircularChart3DLoadedEventArgs, CircularChart3DPointEventArgs, CircularChart3DPointRenderEventArgs, CircularChart3DSeriesRenderEventArgs, CircularChart3DTooltipRenderEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { CircularChartHighlight3D } from '../../../src/circularchart3d/user-interaction/high-light';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';

CircularChart3D.Inject(CircularChartTooltip3D, CircularChartLegend3D, CircularChartHighlight3D, CircularChartDataLabel3D);

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
        const elem: HTMLElement = createElement('div', { id: 'circularChart3DchartContainer' });
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
            chartObj.appendTo('#circularChart3DchartContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Load event', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('circularChart3DchartContainer-svg-10-region-series-0-point-7').getAttribute('opacity')).toBe('0.5');
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

                targetElement = chartObj.element.querySelector('#circularChart3DchartContainer-svg-10-region-series-0-point-7') as HTMLElement;
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
        const elem: HTMLElement = createElement('div', { id: 'circularChart3DchartContainer' });
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
            chartObj.appendTo('#circularChart3DchartContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Point render event', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('circularChart3DchartContainer-svg-10-region-series-0-point-0').getAttribute('fill')).toBe('#ff0000');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('Circular3D Events Checking', () => {
        let chartObj: CircularChart3D;
        const chartElement: HTMLElement = createElement('div', { id: 'circularChart3DchartContainer' });
        let targetElement: HTMLElement;
        let loaded: EmitType<CircularChart3DEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        let rect: DOMRect | ClientRect;
        let x: number;
        let y: number;
        beforeAll(() => {
            document.body.appendChild(chartElement);
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
            chartObj.appendTo('#circularChart3DchartContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });
        it('Tooltip render event', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#circularChart3DchartContainer-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('circularChart3DchartContainer_tooltip') !== null).toBe(true);
                expect(document.getElementById('circularChart3DchartContainer_tooltip_text').children[1].innerHTML).toBe('Tooltip');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Series render event', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = chartObj.element.querySelector('#circularChart3DchartContainer-svg-0-region-series-0-point-1') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('circularChart3DchartContainer_tooltip') !== null).toBe(true);
                expect(document.getElementById('circularChart3DchartContainer_tooltip_text').children[1].innerHTML).toBe('Tooltip');
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
                targetElement = chartObj.element.querySelector('#circularChart3DchartContainer-border') as HTMLElement;
                rect = targetElement.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mouseuptEvent(targetElement, Math.ceil(x), Math.ceil(y));
                expect(document.getElementById('circularChart3DchartContainer_tooltip') === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.circular3DPolygon[0].vectorPoints = null;
                args.chart.polygon.draw(args.chart.circular3DPolygon[0], args.chart);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements panel name', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.circular3DPolygon[0].name = null;
                args.chart.polygon.draw(args.chart.circular3DPolygon[0], args.chart);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements panel text', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.circular3DPolygon[0].name = null;
                args.chart.isTouch = true;
                args.chart.polygon.draw(args.chart.circular3DPolygon[0], args.chart);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements poly line', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                let points: any = [args.chart.circular3DPolygon[0].vectorPoints[0], args.chart.circular3DPolygon[0].vectorPoints[1]];
                args.chart.polygon.createPolyline(points, args.chart.circular3DPolygon[0].element);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements calculate normal', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.polygon.calculateNormal(args.chart.circular3DPolygon[0].vectorPoints[0], args.chart.circular3DPolygon[0].vectorPoints[1], args.chart.circular3DPolygon[0].vectorPoints[2], args.chart.circular3DPolygon[0]);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.checkColorFormat('rgb(255, 0, 0)');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format with alpha value', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.checkColorFormat('rgb(255, 0, 0, 0.5)');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D elements with empty color values', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.checkColorFormat('rgb(255, 0, red,5,20, 0.5)');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format with hex color', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                let RGB = { red: 255, green: 0, blue: 0, alpha: 0.5 };
                args.chart.svg3DRenderer.hexColor(RGB);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format with hex color to value', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.hexToValue('rgb(255, 0, 0)');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format with hex color to value with alpha', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.hexToValue('rgba(255, 0, 0, 0.5)');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular color format with hex color to value', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.hexToValue('rgb(');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular color format with hex color to value with alpha', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.hexToValue('rgba(');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements check color format with hex color to value with empty value', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.svg3DRenderer.hexToValue('');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Check circular 3D rotate elements draw text', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.isTouch = true;
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D chart element with out id', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.isTouch = true;
                expect(document.getElementById('circularChart3DchartContainer') === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.element.id = '';
            chartObj.refresh();
        });
        it('Checking circular 3D classify polygone', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.circular3DPolygon[0].points = null;
                args.chart.bspTreeObj.classifyPolygon(null, args.chart.circular3DPolygon[0]);
                args.chart.polygon.getNormal(null, null);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.element.id = 'circularChart3DchartContainer';
            chartObj.refresh();
        });
        it('Checking circular 3D view polygone', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.graphics.view(null, args.chart);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D view polygone with rotation', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.graphics.view(null, args.chart, 90);
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D view destroy', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                chartObj.loaded = null;
                args.chart.export('CSV', 'Sample');
                args.chart.pdfExport('Sample');
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D secondary element', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                if (document.getElementById('circularChart3DchartContainer_Secondary_Element')) {
                    document.getElementById('circularChart3DchartContainer_Secondary_Element').remove()
                };
                args.chart.setSecondaryElementPosition();
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D highlight animation method', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                args.chart.visibleSeries[0].opacity = 0;
                args.chart.highlightAnimation(document.getElementById('circularChart3DchartContainer'), 0, 0)
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D load event data', (done: Function) => {
            chartObj.load = (args: CircularChart3DLoadedEventArgs): void => {
                args.cancel = true;
                expect(document.getElementById('circularChart3DchartContainer') !== null).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Checking circular 3D chartMouseDown event', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('circularChart3DchartContainer');
                args.chart.chartMouseDown(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.load = (args: CircularChart3DLoadedEventArgs) => {
                args.cancel = false;
            }
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking circular 3D chartMouseUp event', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('circularChart3DchartContainer');
                args.chart.chartMouseUp(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });
        it('Checking circular 3D chartMouseLeave event', (done: Function) => {
            loaded = (args: CircularChart3DLoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('circularChart3DchartContainer');
                args.chart.circularChartTooltip3DModule.control = args.chart;
                args.chart.circularChartTooltip3DModule.element = args.chart.element;
                args.chart.chartMouseLeave(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
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
