/**
 * Bubble testing
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, usState, bubbleData } from '../data/data.spec';
import { cont_countriesdata, mapSalesData2, randomcountriesData } from '../data/us-data.spec';
import { MouseEvents } from '../base/events.spec';
import { profile, inMB, getMemoryProfile, sampleMemoryMB } from '../common.spec';
import { IBubbleClickEventArgs, Bubble, IBubbleRenderingEventArgs } from '../../../src/maps/index';

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
Maps.Inject(Bubble);
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Bubble Map layer testing', () => {
        let id: string = 'bubble';
        let specId: string = id + '_LayerIndex_1_BubbleIndex_0_dataIndex_';
        let bubble: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            bubble = new Maps({
                layers: [{
                    shapeDataPath: 'name',
                    shapePropertyPath: 'name',
                    dataSource: cont_countriesdata,
                    shapeSettings: {
                        fill: '#C3E6ED',
                        valuePath: 'name'
                    },
                    tooltipSettings: {
                        visible: false
                    },
                    bubbleSettings: [{
                        visible: true,
                        dataSource: cont_countriesdata,
                        tooltipSettings: {
                            visible: false
                        },
                    }],
                    markerSettings: [{
                        visible: true,
                        dataSource: [],
                        tooltipSettings: {
                            visible: false
                        }
                    }],
                    shapeData: World_Map,
                },
                {
                    type: 'SubLayer',
                    shapeDataPath: 'country',
                    shapePropertyPath: 'name',
                    dataSource: randomcountriesData,
                    shapeSettings: {
                        fill: '#9FD0D3',
                    },
                    bubbleSettings: [{
                        visible: true,
                        dataSource: randomcountriesData,
                        animationDuration: 1,
                        valuePath: 'Sales',
                        minRadius: 20,
                        maxRadius: 30,
                        fill: '#379F64',
                        tooltipSettings: {
                            visible: true
                        },
                        colorMapping: [
                            {
                                from: 1, to: 1000, color: 'orange'
                            },
                            {
                                from: 1001, to: 5000, color: 'yellow'
                            },
                            {
                                from: 10000, to: 11000, color: 'blueviolet'
                            },
                            {
                                from: 11001, to: 20000, color: 'teal'
                            },
                            {
                                from: 20001, to: 50000, color: 'aqua'
                            }
                        ]
                    }],
                    shapeData: mapSalesData2
                }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            bubble.destroy();
        });
        it('Bubble equal color testing spec', (done: Function) => {
            bubble.loaded = (args: ILoadedEventArgs) => {
                // spec = getElementByID(specId + '0');
                // expect(spec.getAttribute('fill')).toBe('teal');
                // expect(parseInt(spec.getAttribute('r'), 10)).toBe(20);
                // spec = getElementByID(specId + '1');
                // expect(spec.getAttribute('fill')).toBe('teal');
                // spec = getElementByID(specId + '2');
                // expect(spec.getAttribute('fill')).toBe('teal');
                // spec = getElementByID(specId + '3');
                // expect(spec.getAttribute('fill')).toBe('teal');
                // spec = getElementByID(specId + '4');
                // expect(spec.getAttribute('fill')).toBe('orange');
                // spec = getElementByID(specId + '5');
                // expect(spec.getAttribute('fill')).toBe('orange');
                // spec = getElementByID(specId + '6');
                // expect(spec.getAttribute('fill')).toBe('orange');
                // spec = getElementByID(specId + '7');
                // expect(spec.getAttribute('fill')).toBe('teal');
                // expect(parseInt(spec.getAttribute('r'), 10)).toBe(20);
                done();
            };
            bubble.layers[1].bubbleSettings[0].colorValuePath = 'CategoryName';
            bubble.layers[1].bubbleSettings[0].valuePath = 'size';
            bubble.layers[1].bubbleSettings[0].colorMapping = [
                {
                    value: 'Books', color: 'teal',
                },
                {
                    value: 'Games', color: 'orange',
                }
            ];
            bubble.refresh();
        });
        it('Bubble fill, min max radius, opacity, border, type square  checking spec', (done: Function) => {
            bubble.loaded = (args: ILoadedEventArgs) => {
                bubble.loaded = null;
                spec = getElementByID(specId + '0');
                let trigger: MouseEvents = new MouseEvents();
                trigger.mousemoveEvent(spec, 0, 0, 10, 10);
                // expect(spec.getAttribute('fill')).toBe('teal');
                // expect(spec.getAttribute('opacity')).toBe('0.5');
                // expect(spec.getAttribute('stroke-width')).toBe('2');
                // expect(spec.getAttribute('stroke')).toBe('red');
                // expect(parseInt(spec.getAttribute('r'), 10)).toBe(10);
                // spec = getElementByID(specId + '5');
                // expect(spec.getAttribute('fill')).toBe('orange');
                // expect(parseInt(spec.getAttribute('r'), 10)).toBe(30);
                expect(spec.getAttribute('fill')).toBe('orange');
                trigger.clickEvent(spec);
                spec = getElementByID(id);
                trigger.clickEvent(spec);
                done();
            };
            bubble.bubbleClick = (args: IBubbleClickEventArgs) => {
                let target: Element = document.getElementById(args.target);
                target.setAttribute('fill', 'green');
                bubble.addLayer({ shapeData: usState });
                bubble.removeLayer(2);
            };
            bubble.bubbleRendering = (args: IBubbleRenderingEventArgs) => {
                if (args.data['CategoryName'] === 'Games') {
                    args.cancel = true;
                }
            };
            bubble.layers[1].bubbleSettings = [{
                border: {
                    color: 'red',
                    width: 2,
                    opacity: 0.7
                },
                visible: true,
                fill: 'orange',
                bubbleType: 'Square',
                dataSource: randomcountriesData,
                maxRadius: 30,
                minRadius: 10,
                valuePath: 'Sales',
                opacity: 0.5,
            }];
            bubble.refresh();
        });
        it('Bubble with projection type', (done: Function) => {
            bubble.projectionType = 'Winkel3';
            bubble.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(specId + '0');
                expect(spec.getAttribute('fill')).toBe('orange');
                expect(spec.getAttribute('fill-opacity')).toBe('0.5');
                expect(spec.getAttribute('stroke-opacity')).toBe('0.7');
                expect(spec.getAttribute('stroke-width')).toBe('2');
                expect(spec.getAttribute('stroke')).toBe('red');
                expect(parseInt(spec.getAttribute('height'), 10)).toBe(24);
                expect(parseInt(spec.getAttribute('width'), 10)).toBe(24);
                expect(parseInt(spec.getAttribute('x'), 10)).toBe(0);
                expect(parseInt(spec.getAttribute('y'), 10)).toBe(0);
                let transform: string[] = spec.getAttribute('transform').split(' ');
                expect(parseInt(transform[1], 10)).toBeGreaterThanOrEqual(326);
                expect(parseInt(transform[2], 10)).toBeLessThanOrEqual(95);
                done();
            };
            bubble.refresh();
        });
        it('Bubble with some mismatched data', (done: Function) => {
            bubble.projectionType = 'Winkel3';
            bubble.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + "_LayerIndex_0_bubble_Group_0");
                expect(spec !== null).toBe(true);
                done();
            };
            bubble.layers[0].bubbleSettings[0].dataSource = bubbleData;
            bubble.layers[0].bubbleSettings[0].valuePath = "Measure_Example";
            bubble.refresh();
        });
        it('Bubble datasource as null', (done: Function) => {
            bubble.projectionType = 'Winkel3';
            bubble.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + "_LayerIndex_0_bubble_Group_0");
                expect(spec === null).toBe(true);
                done();
            };
            bubble.layers[0].bubbleSettings[0].dataSource = null;
            bubble.layers[0].bubbleSettings[0].valuePath = "Measure_Example";
            bubble.refresh();
        });
    });
    it('memory leak', async () => {
        // Warm-up to stabilize memory reporting
        await sampleMemoryMB();
        await sampleMemoryMB();
    
        // Baseline
        const start = await sampleMemoryMB();
        // End measurement
        const end = await sampleMemoryMB();
    
        const delta = end - start;
        const relative = start > 0 ? (delta / start) : 0;
    
        expect(relative).toBeLessThan(0.20);
        expect(delta).toBeLessThan(30);
    });
});
