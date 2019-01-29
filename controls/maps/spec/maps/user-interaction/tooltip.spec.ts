/**
 * Tooltip testing
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { usMap } from '../data/data.spec';
import { electiondata, populationData } from '../data/us-data.spec';
import { ITooltipRenderEventArgs, Bubble, MapsTooltip, Marker, LayerSettingsModel, MapLocation } from '../../../src/maps/index';
import { MouseEvents } from '../base/events.spec';
import { getElement, timeout } from '../../../src/maps/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
Maps.Inject(Bubble, MapsTooltip, Marker);
export function getShape(i: number): string {
    return 'mapst_LayerIndex_0_shapeIndex_' + i + '_dataIndex_undefined';
}
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('tooltip Map layer testing', () => {
        let id: string = 'mapst';
        let tooltip: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let tooltipElements: HTMLCollection;
        let tooltipElement: HTMLElement;
        let bubbleId: string = id + '_LayerIndex_0_BubbleIndex_0_dataIndex_';
        let markerId: string = id + '_LayerIndex_0_MarkerIndex_0_dataIndex_';
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            tooltip = new Maps({
                //  format: 'n0',
                enableRtl: false,
                layers: [{
                    tooltipSettings: {
                        visible: true,
                        format: '${State} <br> Vote Counts ${Electors} <br> Winner: ${Candidate}',
                        valuePath: 'Electors',
                        border: { color: '', width: 0 }
                    },
                    shapeData: usMap,
                    dataSource: electiondata,
                    markerSettings: [
                        {
                            visible: true,
                            tooltipSettings: {
                                visible: true,
                                valuePath: 'Name',
                                format: '${Name} <br> Lat ${latitude} <br> Marker',
                            },
                            height: 30,
                            width: 30,
                            shape: 'Triangle',
                            dataSource: [
                                { Name: 'California', latitude: 36.7783, longitude: -119.4179 },
                                { Name: 'Colorado', latitude: 39.5501, longitude: -105.7821 },
                                { Name: 'New York', latitude: 40.7128, longitude: -74.0060 },
                            ]
                        }
                    ],
                    shapeDataPath: 'State',
                    shapePropertyPath: 'name',
                    bubbleSettings: [{
                        visible: true,
                        dataSource: electiondata,
                        fill: 'orange',
                        animationDuration: 1,
                        valuePath: 'Electors',
                        colorValuePath: 'color',
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'Electors',
                            format: '${Electors}'
                        },
                    }],
                    shapeSettings: {
                        autofill: true,
                    }
                }]
            });
        });
        afterAll(() => {
            tooltip.destroy();
            tooltip.mapsTooltipModule = new MapsTooltip(tooltip);
            tooltip.mapsTooltipModule.destroy(tooltip);
            remove(ele);
        });
        it('tooltip checking', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('€9.00');
                // expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltip.appendTo('#' + id);
        });
        it('tooltip theme material checking', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_path');
                let fill: string = tooltipElement.getAttribute('fill');
                expect(fill).toBe('#FFFFFF');
                done();
            };
            tooltip.theme = 'Highcontrast';
            tooltip.refresh();
        });
        it('tooltip format checking for layer', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('€9.00');
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltip.layers[0].tooltipSettings.template = null;
            tooltip.layers[0].tooltipSettings.format = null;
            tooltip.layers[0].tooltipSettings.format = ' ${Electors}';
            tooltip.refresh();
        });
        it('tooltip format and usergroup checking for layer', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('€9.00');
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltip.format = 'c';
            tooltip.useGroupingSeparator = true;
            tooltip.refresh();
        });
        it('tooltip checking format for bubble', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                let event: PointerEvent = <PointerEvent>trigger.onPointerMove(spec, 140, 230, 1, 'touch');
                (tooltip.mapsTooltipModule['renderTooltip'])(event);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('Alabama  Vote Counts €9.00  Bubble');
                done();
            };
            tooltip.format = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.format = '${State} <br> Vote Counts ${Electors} <br> Bubble';
            tooltip.refresh();
        });
        it('tooltip checking format for bubble', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('Alabama  Vote Counts €9.00  Bubble');
                done();
            };
            tooltip.format = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.format = '${State} <br> Vote Counts ${Electors} <br> Bubble';
            tooltip.refresh();
        });
        it('tooltip checking format for marker', () => {
            spec = getElement(markerId + 1);
            trigger.mousemoveEvent(spec, 0, 0, 190, 230);
            tooltip.mapsTooltipModule['isTouch'] = false;
            trigger.mousemoveEvent(spec, 0, 0, 190, 230);
            trigger.mousemoveEvent(spec, 0, 0, 190, 230);
            trigger.mousemoveEvent(spec, 0, 0, 190, 230);
            tooltipElement = document.getElementById('mapst_mapsTooltip_text');
            expect(tooltipElement.textContent).toBe('Colorado  Lat 39.5501  Marker');
        });
        it('tooltip checking format for Shape', () => {
            spec = getElement(getShape(23));
            trigger.mousemoveEvent(spec, 10, 10, 120, 360);
            trigger.mousemoveEvent(spec, 10, 10, 120, 360);
            trigger.mousemoveEvent(spec, 10, 10, 120, 360);
            tooltipElement = document.getElementById('mapst_mapsTooltip_text');
            // expect(tooltipElement.textContent).toBe(' €38.00');
        });
        it('tooltip checking format for marker', () => {
            spec = getElement(markerId + 0);
            trigger.mousemoveEvent(spec, 120, 360, 70, 270);
            trigger.mousemoveEvent(spec, 120, 360, 70, 270);
            tooltipElement = document.getElementById('mapst_mapsTooltip_text');
            expect(tooltipElement.textContent).toBe('California  Lat 36.7783  Marker');
        });
        it('tooltip checking template for marker', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(markerId + 1);
                trigger.mousemoveEvent(spec, 0, 0, 191, 231);
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                tooltipElement = document.getElementById('mapst_mapsTooltipparent_template');
                expect(tooltipElement.textContent).toBe('marker_Colorado_39.5501');
                done();
            };
            let layer: LayerSettingsModel = tooltip.layers[0];
            layer.tooltipSettings.template = '<div class="black">shape_<div>${State}_</div><div>${Electors}</div></div>';
            layer.bubbleSettings[0].tooltipSettings.template = '<div class="black">bubble_<div>${State}_</div><div>${Electors}</div></div>';
            layer.markerSettings[0].tooltipSettings.template = '<div class="black">marker_<div>${Name}_</div><div>${latitude}</div></div>';
            layer.dataSource = electiondata;
            tooltip.refresh();
        });
        it('tooltip visible false checking for bubble', () => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 140, 230);
                tooltipElements = document.getElementsByClassName('mapst_Secondary_Element')
                expect(tooltipElements.length).toBe(0);
            };
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.visible = false;
            tooltip.refresh();
        });
        it('tooltip visible false checking for marker', () => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(markerId + 1);
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                tooltipElements = document.getElementsByClassName('mapst_Secondary_Element');
                expect(tooltipElements.length).toBe(0);
            };
            tooltip.layers[0].markerSettings[0].tooltipSettings.visible = false;
            tooltip.refresh();
        });
        it('tooltip visible false checking for shape', () => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(9));
                trigger.mousemoveEvent(spec, 0, 0, 190, 140);
                tooltipElements = document.getElementsByClassName('mapst_Secondary_Element')
                expect(tooltipElements.length).toBe(0);
            };
            tooltip.layers[0].tooltipSettings.visible = false;
            tooltip.refresh();
        });
        it('tooltip checking for null space title', (done: Function) => {
            tooltip.titleSettings.text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                let event: Object = {
                    target: spec,
                    changedTouches: [{ pageX: spec.getBoundingClientRect().left, pageY: spec.getBoundingClientRect().top }],
                    type: 'touch'
                };
                var value = tooltip.mapsTooltipModule.mouseUpHandler(event as PointerEvent);
                //let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                //expect(tooltipElement.textContent).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                expect(value).toBe(undefined);
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('title tooltip checking for wordwrap', (done: Function) => {
            tooltip.titleSettings.text = 'world map helloworldhelloo world map world map world map world map world map world map world map world map world map world map world map world map world map world map world map hello';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                trigger.mousemoveEvent(spec, 0, 0, 345, 13);
                let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                expect(tooltipElement.textContent).toBe('world map helloworldhelloo world map world map world map world map world map world map world map world map world map world map world map world map world map world map world map hello');
                //expect(tooltipElement.textContent.split('...').length).toBe(2);
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('title tooltip checking for right side tooltip', (done: Function) => {
            tooltip.titleSettings.text = 'world map helloworldhelloo world map world map world map world map world map world map world map world map world map';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                trigger.mousemoveEvent(spec, 0, 0, 10, 13);
                let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                expect(tooltipElement.textContent).toBe('world map helloworldhelloo world map world map world map world map world map world map world map world map world map');
                //expect(tooltipElement.textContent.split('...').length).toBe(2);
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('title tooltip checking for left side tooltip', (done: Function) => {
            tooltip.titleSettings.text = 'world map helloworldhelloo world map world map world map world map world map world map world map';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                trigger.mousemoveEvent(spec, 0, 0, 400, 13);
                let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                expect(tooltipElement.textContent).toBe('world map helloworldhelloo world map world map world map world map world map world map world map');
                //expect(tooltipElement.textContent.split('...').length).toBe(2);
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('title tooltip checking for height wrap', (done: Function) => {
            tooltip.titleSettings.text = 'map maps map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                trigger.mousemoveEvent(spec, 0, 0, 400, 13);
                let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                expect(tooltipElement.textContent).toBe('map maps map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map map');
                //expect(tooltipElement.textContent.split('...').length).toBe(2);
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('title tooltip checking for touch event', (done: Function) => {
            tooltip.titleSettings.text = 'world map helloworldhelloo world map world map world map world map world map world map world map world map world map world map world map world map';
            tooltip.loaded = (args: ILoadedEventArgs) => {
                let titleId: string = id + '_Map_title';
                spec = getElement(titleId);
                tooltip.mouseEndOnMap(<PointerEvent>trigger.onTouchEnd(spec, 0, 0, 0, 0, 400, 13));
                let tooltipElement: Element = document.getElementById('mapst_EJ2_Title_Tooltip');
                expect(tooltipElement.textContent).toBe('world map helloworldhelloo world map world map world map world map world map world map world map world map world map world map world map world map');
                //expect(tooltipElement.textContent.split('...').length).toBe(2);
                timeout('mapst_EJ2_Title_Tooltip');
                tooltip.titleSettings.text = '';
                done();
            };
            tooltip.refresh();
        });
        it('tooltip checking for bubble valuePath', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('Alabama');
                done();
            };
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.template = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.format = null;
            tooltip.layers[0].bubbleSettings[0].dataSource = electiondata;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.visible = true,
                tooltip.layers[0].bubbleSettings[0].tooltipSettings.valuePath = 'State';
            tooltip.refresh();
        });
        it('tooltip checking for layer valuePath', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(bubbleId + 0);
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('Alabama');
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltip.layers[0].tooltipSettings.template = null;
            tooltip.layers[0].tooltipSettings.format = null;
            tooltip.layers[0].tooltipSettings.visible = true;
            tooltip.layers[0].tooltipSettings.valuePath = 'Electors';
            tooltip.refresh();
        });
        it('tooltip checking for Marker valuePath', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(markerId + 1);
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                tooltip.mapsTooltipModule['isTouch'] = false;
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                trigger.mousemoveEvent(spec, 0, 0, 190, 230);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                expect(tooltipElement.textContent).toBe('Colorado');
                done();
            };
            tooltip.layers[0].markerSettings[0].tooltipSettings.template = null;
            tooltip.layers[0].markerSettings[0].tooltipSettings.format = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.visible = false;
            tooltip.layers[0].markerSettings[0].tooltipSettings.visible = true;
            tooltip.layers[0].markerSettings[0].tooltipSettings.valuePath = 'Name';
            tooltip.layers[0].markerSettings[0].dataSource = [
                { Name: 'California', latitude: 36.7783, longitude: -119.4179 },
                { Name: 'Colorado', latitude: 39.5501, longitude: -105.7821 },
                { Name: 'New York', latitude: 40.7128, longitude: -74.0060 },
            ]
            tooltip.refresh();
        });
        it('tooltip checking for Marker bubble valuePath', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltip.mapsTooltipModule['isTouch'] = false;
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                //expect(tooltipElement.childElementCount > 1).toBe(true);
                done();
            };
            tooltip.layers[0].markerSettings[0].tooltipSettings.template = null;
            tooltip.layers[0].markerSettings[0].tooltipSettings.format = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.visible = false;
            tooltip.layers[0].markerSettings[0].tooltipSettings.visible = false;
            tooltip.layers[0].dataSource = electiondata;
            tooltip.layers[0].tooltipSettings.template = null;
            tooltip.layers[0].tooltipSettings.visible = true;
            tooltip.refresh();
        });
        it('tooltip checking for shape Texas valuePath', (done: Function) => {
            tooltip.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltip.mapsTooltipModule['isTouch'] = false;
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                // expect(tooltipElement.childElementCount > 1).toBe(true);
                done();
            };
            tooltip.layers[0].markerSettings[0].tooltipSettings.template = null;
            tooltip.layers[0].markerSettings[0].tooltipSettings.format = null;
            tooltip.layers[0].bubbleSettings[0].tooltipSettings.visible = false;
            tooltip.layers[0].markerSettings[0].tooltipSettings.visible = false;
            tooltip.layers[0].dataSource = [{ name: "Texas" }];
            tooltip.layers[0].shapePropertyPath = 'name';
            tooltip.layers[0].shapeDataPath = 'name'
            tooltip.layers[0].tooltipSettings.template = null;
            tooltip.layers[0].tooltipSettings.visible = true;
            tooltip.layers[0].tooltipSettings.valuePath = 'name';
            tooltip.refresh();
        });
    });
    describe('tooltip testing', () => {
        let id: string = 'mapst';
        let tooltips: Maps;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLDivElement;
        let spec: Element;
        let tooltipElements: HTMLCollection;
        let tooltipElement: HTMLElement;
        let bubbleId: string = id + '_LayerIndex_0_BubbleIndex_0_dataIndex_';
        let markerId: string = id + '_LayerIndex_0_MarkerIndex_0_dataIndex_';
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            tooltips = new Maps({
                //  format: 'n0',
                enableRtl: false,
                layers: [{
                    tooltipSettings: {
                        visible: true,
                        format: 'Name: ${name} <br> Population ${population}',
                        valuePath: 'population',
                        border: { color: '', width: 0 }
                    },
                    shapeData: usMap,
                    dataSource: populationData,
                    shapeDataPath: 'name',
                    shapePropertyPath: ['name', 'admin'],
                    shapeSettings: {
                        autofill: true,
                    }
                }]
            }, '#' + id);
        });
        afterAll(() => {
            tooltips.destroy();
            tooltips.mapsTooltipModule = new MapsTooltip(tooltips);
            tooltips.mapsTooltipModule.destroy(tooltips);
            remove(ele);
        });
        it('tooltip format and usergroup checking for layer', (done: Function) => {
            tooltips.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                // expect(tooltipElement.childElementCount > 1).toBe(true);
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltips.format = 'c';
            tooltips.useGroupingSeparator = true;
            tooltips.refresh();
        });
        it('tooltip with valuepath for layer', (done: Function) => {
            tooltips.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                // expect(tooltipElement.childElementCount > 1).toBe(true);
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltips.format = 'c';
            tooltips.useGroupingSeparator = true;
            tooltips.layers[0].tooltipSettings.format = null;
            tooltips.layers[0].tooltipSettings.valuePath = 'name';
            tooltips.layers[0].dataSource = [];
            tooltips.refresh();
        });
        it('tooltip without valuepath for layer', (done: Function) => {
            tooltips.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                // expect(tooltipElement.childElementCount > 1).toBe(true);
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltips.format = 'c';
            tooltips.useGroupingSeparator = true;
            tooltips.layers[0].tooltipSettings.format = null;
            tooltips.layers[0].tooltipSettings.valuePath = 'null';
            tooltips.layers[0].dataSource = [];
            tooltips.refresh();
        });
        it('tooltip with format for layer', (done: Function) => {
            tooltips.loaded = (args: ILoadedEventArgs) => {
                spec = getElement(getShape(23));
                trigger.mousemoveEvent(spec, 0, 0, 345, 310);
                tooltipElement = document.getElementById('mapst_mapsTooltip_text');
                // expect(tooltipElement.childElementCount > 1).toBe(true);
                //expect(tooltipElement.textContent.length).toBe(1);
                done();
            };
            tooltips.format = 'c';
            tooltips.useGroupingSeparator = true;
            tooltips.layers[0].tooltipSettings.format =  'Name: ${name}';
            tooltips.layers[0].tooltipSettings.valuePath = name;
            tooltips.layers[0].dataSource = [];
            tooltips.refresh();
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
    });
});