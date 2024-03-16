import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, randomcountriesData, topPopulation, populationDetails, internetUsers, internetUser } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Legend, Marker, ILegendRenderingEventArgs } from '../../../src/maps/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { mapSalesData } from '../data/us-data.spec';
Maps.Inject(Legend, Marker);

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
/**
 * Legend spec
 */
let MapData: Object = World_Map;
describe('Map marker properties tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Osm Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: false,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'Sales',
                            colorMapping: [{
                                from: 100, to: 200, color: 'orange'
                            },
                            {
                                from: 200, to: 300, color: 'yellow', showLegend: false
                            },
                            {
                                from: 300, to: 400, color: 'blueviolet'
                            },
                            {
                                from: 400, to: 500, color: 'teal'
                            },
                            {
                                from: 500, to: 600, color: 'aqua'
                            }]
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Legend visibility', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBe(5);
            };
        });

        it('Legend position as top', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                if (element) {
                    expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                    done();
                }
            };
            map.legendSettings.position = 'Top';
            map.refresh();
        });

        it('Legend position as left', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                done();
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Legend position as right', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                done();
            };
            map.legendSettings.position = 'Right';
            map.refresh();
        });

        it('Legend position as Bottom', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Bottom';
            map.refresh();
        });
        it('Checking text customization in legendRendering event', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Text_Index_0');
                expect(element.innerHTML === '1,00 - 2,00').toBe(true);
            };
            map.legendRendering = (args: ILegendRenderingEventArgs) => {
               args.text = args.text.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",");
            };
            map.refresh();
        });

        it('Legend alignment as Near - bottom position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.alignment = 'Near';
            map.refresh();
        });

        it('Legend alignment as Far - bottom position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.alignment = 'Far';
            map.refresh();
        });

        it('Legend alignment as Far - Left position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Legend alignment as Near - left position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.alignment = 'Near';
            map.refresh();
        });

        it('Checking with legend size - left position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.height = '100';
            map.legendSettings.width = '200';
            map.refresh();
        });


        it('Checking with legend size - top position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Top';
            map.legendSettings.height = '100';
            map.legendSettings.width = '300';
            map.refresh();
        });

        it('Checking with legend orientation', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.orientation = 'Vertical';
            map.legendSettings.fill = 'Red';
            map.legendSettings.position = 'Top';
            map.legendSettings.height = '100';
            map.legendSettings.width = '100';
            map.refresh();
        });        
        it('Maps area customization checking', () => {
            map.mapsArea = {
                background: 'lightgray',
                border: { color: 'gray', width: 3 }
            };
            map.legendSettings = {
                visible: true,
                position: 'Right'
            };
            map.titleSettings = {
                text: 'World Map'
            };
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_MapAreaBorder');
                expect(element.getAttribute('fill')).toBe('lightgray');
                expect(element.getAttribute('stroke')).toBe('gray');
                expect(element.getAttribute('stroke-width')).toBe('3');
                expect(element.getAttribute('x')).toBe('10');
                expect(element.getAttribute('y')).toBe('28');
                expect(element.getAttribute('height')).toBe('412');
                expect(element.getAttribute('width') === '743' || element.getAttribute('width') === '749').toBe(true);
            };
            map.refresh();
        });
        it('Legend with gradient color check', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[1].shapeSettings.colorMapping[0].from = 500;
            map.layers[1].shapeSettings.colorMapping[0].to = 600;
            map.layers[1].shapeSettings.colorMapping[0].value = 'Oceania';
            map.layers[1].shapeSettings.colorMapping[0].color = ['red', 'blue'];
            map.refresh();
        });

    });
    describe('Osm Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                legendSettings: {
                    visible: true,
                    type: 'Bubbles',
                    showLegendPath: 'legendVisibility',
                    valuePath: 'valuePath',
                    removeDuplicateLegend: true
                },
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeDataPath: 'name',
                        shapePropertyPath: 'name',
                        shapeData: World_Map,
                        shapeSettings: {
                            fill: '#E5E5E5'
                        },
                        bubbleSettings: [
                            {
                                visible: true,
                                valuePath: 'value',
                                colorValuePath: 'color',
                                animationDuration: 0,
                                minRadius: 3,
                                maxRadius: 70,
                                opacity: 0.8,
                                dataSource: internetUser,
                                tooltipSettings: {
                                    visible: true,
                                    valuePath: 'population',
                                    template: '#template'
                                },
                            }
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Bubble Legend visibility', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBe(3);
            };
        });

    });
    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                legendSettings: {
                    visible: true,
                    type: 'Markers',
                    showLegendPath: 'legendVisibility',
                    removeDuplicateLegend: true
                },
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        dataSource: topPopulation,
                        shapeSettings: {
                            fill: '#C3E6ED'
                        },
                        markerSettings: [
                            {
                                legendText: 'name',
                                dataSource: topPopulation,
                                visible: true,
                                animationDuration: 0,
                                shape: 'Circle',
                                fill: '#285255',
                                width: 3,
                                border: { width: 2, color: '#285255' },
                                tooltipSettings: {
                                    template: '#template',
                                    visible: true,
                                    valuePath: 'population',
                                }
                            },
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Marker Legend visibility', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBe(4);
            };
        });

    });
    describe('OSM Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: false,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'Sales',
                            colorMapping: [{
                                from: 100, to: 200, color: 'orange'
                            },
                            {
                                from: 200, to: 300, color: 'yellow'
                            },
                            {
                                from: 300, to: 400, color: 'blueviolet'
                            },
                            {
                                from: 400, to: 500, color: 'teal'
                            },
                            {
                                from: 500, to: 600, color: 'aqua'
                            }]
                        }
                    }
                ],
                legendSettings: {
                    visible: true,
                    mode: 'Interactive'
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Legend position as left', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                done();
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Legend position as right', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                done();
            };
            map.legendSettings.position = 'Right';
            map.refresh();
        });

        it('Legend position as right', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].shapeSettings.colorValuePath = 'CategoryName';
            map.layers[0].shapeSettings.colorMapping = [{
                value: 'Books', color: 'orange'
            },
            {
                value: 'Games', color: 'yellow'
            }];
            map.refresh();
        });

        it('datasource mapping legend', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[1].shapeSettings.colorValuePath = 'color';
            map.layers[1].shapeSettings.colorMapping = [];
            map.refresh();
        });
        it('checking interactive mode with height', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.height = '100px'
            map.refresh();
        });
        it('checking interactive mode with width', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.width = '50px'
            map.refresh();
        });
    });

    describe('Osm Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: false,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'Sales',
                            colorMapping: [{
                                from: 100, to: 200, color: 'orange'
                            },
                            {
                                from: 200, to: 300, color: 'yellow'
                            },
                            {
                                from: 300, to: 400, color: 'blueviolet'
                            },
                            {
                                from: 400, to: 500, color: 'teal'
                            },
                            {
                                from: 500, to: 600, color: 'aqua'
                            }]
                        }
                    }
                ],
                legendSettings: {
                    visible: true,
                    mode: 'Interactive'
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with legend title', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.title.text = 'Map Legend';
            map.refresh();
        });


        it('Check with interactive legend as top position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_shapeIndex_64_dataIndex_2');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.position = 'Top';
            map.refresh();
        });

        it('Check with interactive legend as top position - inverter pointer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_shapeIndex_64_dataIndex_2');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.invertedPointer = true;
            map.refresh();
        });

        it('Check with interactive legend a left position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_shapeIndex_64_dataIndex_2');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Check with interactive legend as left position - inverter pointer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_shapeIndex_64_dataIndex_2');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.invertedPointer = false;
            map.refresh();
        });

        it('Check with legend next and previous page', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Right_Page_Rect');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.changeNextPage(<PointerEvent>eventObj);
                element = document.getElementById(map.element.id + '_Left_Page_Rect');
                eventObj = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.changeNextPage(<PointerEvent>eventObj);
            };
            map.legendSettings.position = 'Top';
            map.legendSettings.height = '100';
            map.legendSettings.width = '100';
            map.legendSettings.mode = 'Default';
            map.refresh();
        });
    });

    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: false,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'color',
                        }
                    }
                ],
                legendSettings: {
                    visible: true,
                    mode: 'Interactive'
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with interactive legend and data source color mapping', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_shapeIndex_167_dataIndex_2');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.orientation = 'Vertical';
            map.refresh();
        });

        it('Check with legend percentage width', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.width = '30%';
            map.refresh();
        });

        it('Check with legend percentage height', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.height = '20%';
            map.refresh();
        });

        it('Check with legend shape height', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shapeHeight = 40;
            map.refresh();
        });

        it('Check with legend shape border', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shapeBorder.width = 2;
            map.legendSettings.shapeBorder.color = 'red';
            map.refresh();
        });

        it('Check with rendering legend columnwise ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.orientation = 'Vertical';
            map.legendSettings.height = '100';
            map.refresh();
        });


        it('Check with rendering legend rowwise ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.orientation = 'Horizontal';
            map.legendSettings.width = '300';
            map.refresh();
        });
    });

    describe('Legend Testing in OSM SubLayer', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType:'OSM'
                    },
                    {
                        type:'SubLayer',
                        shapeData: World_Map,
                        shapeDataPath: 'Country',
                        shapePropertyPath: 'name',
                        dataSource: [
                            { Country: 'China', Membership: 'Permanent' },
                            { Country: 'France', Membership: 'Permanent' },
                            { Country: 'Russia', Membership: 'Permanent' },
                            { Country: 'United Kingdom', Membership: 'Permanent' },
                            { Country: 'United States', Membership: 'Permanent' },
                            { Country: 'Bolivia', Membership: 'Non-Permanent' },
                            { Country: 'Eq. Guinea', Membership: 'Non-Permanent' },
                            { Country: 'Ethiopia', Membership: 'Non-Permanent' },
                            { Country: "Côte d'Ivoire", Membership: 'Permanent' },
                            { Country: 'Kazakhstan', Membership: 'Non-Permanent' },
                            { Country: 'Kuwait', Membership: 'Non-Permanent' },
                            { Country: 'Netherlands', Membership: 'Non-Permanent' },
                            { Country: 'Peru', Membership: 'Non-Permanent' },
                            { Country: 'Poland', Membership: 'Non-Permanent' },
                            { Country: 'Sweden', Membership: 'Non-Permanent' }
                        ],
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'Country',
                        },
                        shapeSettings: {
                            fill: '#E5E5E5',
                            colorMapping: [
                                {
                                    value: 'Permanent',
                                    color: '#EDB46F'
                                },
                                {
                                    color: '#F1931B',
                                    value: 'Non-Permanent'
                                }
                            ],
                            colorValuePath: 'Membership'
                        }
                    }
                ],
                legendSettings: {
                    visible: true,
                    mode: 'Interactive'
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with default legend in OSM sublayer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBe(3);
            };
            map.legendSettings.mode = 'Default';
            map.refresh();
        });
    });

    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: true,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                            colorValuePath: 'color'
                        }, {
                            visible: false
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ],
                legendSettings: {
                    visible: true,
                    mode: 'Interactive'
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with bubble legend', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_BubbleIndex_0_dataIndex_3');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.type = 'Bubbles';
            map.refresh();
        });
    });

    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        markerSettings: [{
                            visible: true,
                            height: 30,
                            width: 30,
                            shape: 'Circle',
                            // template: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                            legendText: 'Name',
                            imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                            dataSource: [
                                { "Name": "USA", "latitude": 38.8833, "longitude": -77.0167 },
                                { "Name": "Brazil", "latitude": -15.7833, "longitude": -47.8667 },
                                { "Name": "India", "latitude": 21.0000, "longitude": 78.0000 },
                                { "Name": "China", "latitude": 35.0000, "longitude": 103.0000 },
                                { "Name": "Indonesia", "latitude": -6.1750, "longitude": 106.8283 }
                            ]
                        }],
                        bubbleSettings: [{
                            visible: false,
                            dataSource: randomcountriesData,
                            valuePath: 'Sales',
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                            colorValuePath: 'color'
                        }],
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with marker legend', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_1_MarkerIndex_0_dataIndex_0');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.legendModule.interactiveHandler(<PointerEvent>eventObj);
            };
            map.legendSettings.type = 'Markers';
            map.legendSettings.mode = 'Interactive';
            map.refresh();
        });
    });

    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'color'
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with text size which is greater than shape', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.legendSettings.shapeHeight = 15;
            map.legendSettings.textStyle.size = '30px';
            map.legendSettings.height = '100px';
            map.legendSettings.width = '200px';
            map.legendSettings.mode = 'Default';
            map.refresh();
        });

        it('Check with legend label position as before - RowWise ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.layers[1].shapeSettings.colorValuePath = 'Sales';
            map.layers[1].shapeSettings.colorMapping = [{
                from: 100, to: 200, color: 'orange'
            },
            {
                from: 200, to: 300, color: 'yellow'
            },
            {
                from: 300, to: 400, color: 'blueviolet'
            },
            {
                from: 400, to: 500, color: 'teal'
            },
            {
                from: 500, to: 600, color: 'aqua'
            }];
            map.legendSettings.height = '100px';
            map.legendSettings.width = '100px';
            map.legendSettings.orientation = 'Horizontal';
            map.legendSettings.labelPosition = 'Before';
            map.legendSettings.mode = 'Interactive';
            map.refresh();
        });

        it('Check with legend label position as before - ColoumnWise ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.legendSettings.orientation = 'Vertical';
            map.legendSettings.labelPosition = 'Before';
            map.legendSettings.mode = 'Interactive';
            map.refresh();
        });

        it('Check with legend label intersect action as trim', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.legendSettings.orientation = 'Horizontal';
            map.legendSettings.labelDisplayMode = 'Trim';
            map.legendSettings.mode = 'Interactive';
            map.refresh();
        });

        it('Check with legend label intersect action as hide', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.legendSettings.labelDisplayMode = 'Hide';
            map.refresh();
        });
    });


    describe('Marker testing', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        shapeSettings: {
                            autofill: true,
                            fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'color'
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check with legend item empty range color mapping', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.layers[1].shapeSettings.colorValuePath = 'Sales';
            map.layers[1].shapeSettings.colorMapping = [
                {
                    from: 0, to: 10, color: 'red'
                },
                {
                    from: 100, to: 200, color: 'orange'
                },
                {
                    from: 200, to: 300, color: 'yellow'
                },
                {
                    from: 300, to: 400, color: 'blueviolet'
                },
                {
                    from: 400, to: 500, color: 'teal'
                },
                {
                    from: 500, to: 600, color: 'aqua'
                }];
            map.refresh();
        });

        it('Check with legend item empty equal color mapping', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.layers[1].shapeSettings.colorValuePath = 'CategoryName';
            map.layers[1].shapeSettings.colorMapping = [
                {
                    value: 'Toys', color: 'red'
                },
                {
                    value: 'Books', color: 'orange'
                },
                {
                    value: 'Games', color: 'yellow'
                }]
            map.refresh();
        });
    });
    describe('Theme Support', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                theme: 'BootstrapDark',
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: true
                        },
                        shapeSettings: {
                            // autofill: true,
                            //fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'Sales',
                            colorMapping: [{
                                from: 100, to: 200, color: 'orange'
                            },
                            {
                                from: 200, to: 300, color: 'yellow', showLegend: false
                            },
                            {
                                from: 300, to: 400, color: 'blueviolet'
                            },
                            {
                                from: 400, to: 500, color: 'teal'
                            },
                            {
                                from: 500, to: 600, color: 'aqua'
                            }]
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Legend visibility theme color', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Text_Index_3');
                expect(element.getAttribute('fill')).toBe('#DADADA');
            };
        });
    });
    describe('Legend Equal Color Mapping ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                theme: 'FabricDark',
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: true
                        },
                        shapeSettings: {
                            // autofill: true,
                            //fill: 'grey',
                            border: {
                                width: 1,
                                color: 'white'
                            },
                            colorValuePath: 'continent',
                            colorMapping: [{
                                value: 'Europe', color: 'orange', label: 'Europe Continent'
                            },
                            {
                                value: 'Asia', color: 'yellow', showLegend: false
                            },
                            {
                                value: 'South America', color: 'blueviolet', label: 'South America Continent'
                            },
                            {
                                value: 'Asia', color: 'teal', label: 'Asia Continent'
                            },
                            {
                                value: 'Oceania', color: 'aqua', label: 'Oceania Continent'
                            },
                            {
                                value: 'Africa', color: 'blue', label: 'Africa Continent'
                            },
                            {
                                value: 'North America', color: 'blue', label: 'North America Continent'
                            }
                            ]
                        }
                    }
                ],
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Legend with gradient color check', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[1].shapeSettings.colorMapping[0].value = 'Asia'
            map.layers[1].shapeSettings.colorMapping[0].label = 'Asia continents'
            map.refresh();
        });
    });
    describe('Legend and toggle for Marker feature', () => {
        let id: string = 'legend';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                legendSettings: {
                    visible: true,
                    type: 'Markers',
                    showLegendPath: 'legendVisibility',
                    removeDuplicateLegend: true,
                    toggleLegendSettings: {
                        enable: true,
                        applyShapeSettings: false,
                        fill: "yellow",
                        opacity: 0.1         
                    }
                },
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        dataSource: topPopulation,
                        shapeSettings: {
                            fill: '#C3E6ED'
                        },
                        markerSettings: [
                            {
                                dataSource: [
                                    { name: 'Tokyo', latitude: 35.6894875, longitude: 139.6917064, population: 33200000, Country: 'Japan', Continent: 'Asia', color: 'red', shape: 'Pentagon' },
                                    { name: 'New York', latitude: 40.7127753,longitude: -74.0059728, population: 17800000, Country: 'United States', Continent: 'North America', color: 'green',shape: 'Diamond' },
                                    { name: 'Sao Paulo', latitude: -23.5505199,longitude: -46.6333094,population: 17700000,Country: 'Brazil', Continent: 'South America',color: 'orange',shape: 'InvertedTriangle'},
                                    { name: 'Seoul/Incheon', latitude: 37.566535,longitude: 126.9779692,population: 17500000, Country: 'South Korea',Continent: 'Asia', color: 'red', shape: 'Pentagon'}
                                ],
                                visible: true,
                                animationDuration: 0,
                                shape: 'Circle',
                                fill: '#285255',
                                width: 3,
                                border: { width: 2, color: '#285255' },
                                colorValuePath: 'color',
                                legendText: 'Country',
                            },
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Marker Legend visibility', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBe(4);
            };
        });
        it('Toggle legend property for marker color', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(5);
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_0')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_0");
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_0')
                trigger.clickEvent(spec);
            }
            map.refresh();
        });
        it('Toggle legend property for second marker color', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(5);
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_1')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_1");
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_1')
                trigger.clickEvent(spec);
            }
            map.refresh();
        });
        it('Toggle legend property for shapeSettings for default', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(5);
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_0')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("#C3E6ED");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_0");
                expect(spec.getAttribute('fill')).toBe("#C3E6ED");
                spec = document.getElementById(map.element.id + '_Legend_Shape_Index_0')
                trigger.clickEvent(spec);
            }
            map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
            map.refresh();
        });
        it('Toggle legend property for marker color for interactive', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(9);
                spec = document.getElementById(map.element.id + '_Legend_Index_0')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_0");
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + '_Legend_Index_0')
                trigger.clickEvent(spec);
            }
            map.legendSettings.mode = 'Interactive';
            map.legendSettings.toggleLegendSettings.applyShapeSettings = false;
            map.refresh();
        });
        it('Toggle legend property for second marker color for interactive', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(9);
                spec = document.getElementById(map.element.id + '_Legend_Index_1')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_1");
                expect(spec.getAttribute('fill')).toBe("yellow");
                spec = document.getElementById(map.element.id + '_Legend_Index_1')
                trigger.clickEvent(spec);
            }
            map.legendSettings.mode = 'Interactive';
            map.legendSettings.toggleLegendSettings.applyShapeSettings = false;
            map.refresh();
        });
        it('Toggle legend property for shapeSettings for interactive', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_Legend_Group');
                expect(spec.childElementCount).toBe(9);
                spec = document.getElementById(map.element.id + '_Legend_Index_0')
                trigger.clickEvent(spec);
                expect(spec.getAttribute('fill')).toBe("#C3E6ED");
                spec = document.getElementById(map.element.id + "_LayerIndex_1_MarkerIndex_0_dataIndex_0");
                expect(spec.getAttribute('fill')).toBe("#C3E6ED");
                spec = document.getElementById(map.element.id + '_Legend_Index_0')
                trigger.clickEvent(spec);
            }
            map.legendSettings.mode = 'Interactive';
            map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
            map.refresh();
        });

    });
    describe('Toggle legend settings', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'Population density (per square kilometers) - 2015',
                    textStyle: {
                        size: '16px'
                    }
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    toggleLegendSettings: {
                        enable: true,
                        applyShapeSettings: false,
                        fill: "yellow",
                        opacity: 0.1         
                    }
                },
                layers: [
                    {
                        layerType: 'OSM'
                    },
                    {
                        type: 'SubLayer',
                        shapeData: World_Map,
                        shapeDataPath: 'name',
                        shapePropertyPath: 'name',
                        dataSource: populationDetails,
                        tooltipSettings: {
                            visible: true,
                            valuePath: 'name',
                            format: '${name} : ${density} per square kms'
                        },
                        shapeSettings: {
                            colorValuePath: 'density',
                            fill: '#E5E5E5',
                            colorMapping: [
                                {
                                    from: 0.00001, to: 100, color: 'rgb(153,174,214)', label: '<100'
                                },
                                {
                                    from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                                },
                                {
                                    from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                                },
                                {
                                    from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                                },
                            ]
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Toggle legend property for shape color', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('fill')).toBe("yellow");
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("yellow");
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                }
                map.refresh();
            })
            it('Toggle legend property for shapeSettings', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                }
                map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                map.refresh();
            })
            it('Toggle legend property for shapeSettings after call refresh', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                }
                map.refresh();
            })
            it('Checking without toggleshapeSettings', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                }
                map.legendSettings.toggleLegendSettings.enable = false;
                map.refresh();
            })
            it('Checking without toggleshapeSettings', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute("fill")).toBe("rgb(153,174,214)")
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    expect(spec.getAttribute('stroke')).toBe("#000000");
                    expect(spec.getAttribute('stroke-width')).toBe("0");
                    expect(spec.getAttribute("fill-opacity")).toBe("1");
                }
                map.legendSettings.toggleLegendSettings.enable = true;
                map.refresh();
            })
            it('Checking the shape with null', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                    spec = document.getElementById("container_LayerIndex_1_shapeIndex_134_dataIndex_125");
                    expect(spec !== null).toBe(false);
                }
                map.refresh();
            })
            it('Checking the legends with datasource set as null', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                }
                map.layers[0].shapeDataPath = 'name';
                map.layers[0].shapePropertyPath = 'name';
                map.layers[0].highlightSettings.enable = true;
                map.layers[0].highlightSettings.fill = '#4c515b';
                map.layers[0].dataSource = [{color: '#2e9bff', name: '', value: 32460264}]
                map.layers[0].shapeSettings = { colorValuePath: 'color'};
                map.refresh();
            })
        });
        describe('Toggle legend settings for Layers', () => {
            let id: string = 'container';
            let map: Maps;
            let ele: HTMLDivElement;
            let trigger: MouseEvents = new MouseEvents();
            let spec: Element;
            beforeAll(() => {
                ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                document.body.appendChild(ele);
                map = new Maps({
                    titleSettings: {
                        text: 'Population density (per square kilometers) - 2015',
                        textStyle: {
                            size: '16px'
                        }
                    },
                    legendSettings: {
                        visible: true,
                        position: 'Top',
                        mode: "Interactive",
                        toggleLegendSettings: {
                            enable: true,
                            applyShapeSettings: false,
                            fill: "yellow",
                            opacity: 0.1         
                        }
                    },
                    layers: [
                        {
                            layerType: 'OSM'
                        },
                        {
                            type: 'SubLayer',
                            shapeData: World_Map,
                            shapeDataPath: 'name',
                            shapePropertyPath: 'name',
                            dataSource: populationDetails,
                            tooltipSettings: {
                                visible: true,
                                valuePath: 'name',
                                format: '${name} : ${density} per square kms'
                            },
                            shapeSettings: {
                                colorValuePath: 'density',
                                fill: '#E5E5E5',
                                colorMapping: [
                                    {
                                        from: 0.00001, to: 100, color: 'rgb(153,174,214)', label: '<100'
                                    },
                                    {
                                        from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                                    },
                                    {
                                        from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                                    },
                                    {
                                        from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                                    },
                                ]
                            }
                        }
                    ]
                }, '#' + id);
            });
            afterAll(() => {
                remove(ele);
                map.destroy();
            });
    
            it('Toggle legend property for Interactive shape color', () => {
                    map.loaded = (args: ILoadedEventArgs) => {
                        spec = document.getElementById('container_Legend_Group');
                        expect(spec.childElementCount).toBe(9);
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('fill')).toBe("yellow");
                        spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("yellow");
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                    }
                    map.refresh();
                })
                it('Checking without toggleshapeSettings for Interactive', () => {
                    map.loaded = (args: ILoadedEventArgs) => {
                        spec = document.getElementById('container_Legend_Group');
                        expect(spec.childElementCount).toBe(9);
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                        spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    }
                    map.legendSettings.toggleLegendSettings.enable = false;
                    map.refresh();
                })
                it('Checking with toggleshapeSettings for Interactive', () => {
                    map.loaded = (args: ILoadedEventArgs) => {
                        spec = document.getElementById('container_Legend_Group');
                        expect(spec.childElementCount).toBe(9);
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute("fill")).toBe("rgb(153,174,214)")
                        spec = document.getElementById("container_LayerIndex_1_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                        expect(spec.getAttribute('stroke')).toBe("#000000");
                        expect(spec.getAttribute('stroke-width')).toBe("0");
                        expect(spec.getAttribute("fill-opacity")).toBe("1");
                    }
                    map.legendSettings.toggleLegendSettings.enable = true;
                    map.refresh();
                })
            });
            describe('Toggle legend settings for bubble', () => {
                let id: string = 'container';
                let map: Maps;
                let ele: HTMLDivElement;
                let trigger: MouseEvents = new MouseEvents();
                let spec: Element;
                beforeAll(() => {
                    ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                    document.body.appendChild(ele);
                    map = new Maps({
                        format: 'n',
                        useGroupingSeparator: true,
                        zoomSettings: {
                            enable: true,
                            horizontalAlignment: 'Near',
                            toolBarOrientation: 'Vertical',
                            pinchZooming: true
                        },
                        titleSettings: {
                            text: 'Top 30 countries with highest Internet users',
                            textStyle: {
                                size: '16px'
                            }
                        },
                        legendSettings: {
                            visible: true,
                            type: "Bubbles",
                            position: 'Bottom',
                            height: '10',
                            width: '80%',
                            toggleLegendSettings: {
                                enable: true,
                                applyShapeSettings: false,
                                fill : "lightgreen",
                                opacity: 0.5,
                                border: {
                                    color: "green",
                                    width: 2
                                }
                            },
                            textStyle: {
                                color: "grey"
                            }
                            
                        },
                        layers: [
                            {
                                layerType: 'OSM'
                            },
                            {
                                type: 'SubLayer',
                                shapeDataPath: 'name',
                                shapePropertyPath: 'name',
                                shapeData: World_Map,
                                shapeSettings: {
                                    fill: '#E5E5E5'
                                },
                                bubbleSettings: [
                                    {
                                        visible: true,
                                        valuePath: 'value',
                                        colorValuePath: 'rank',
                                        animationDuration:0,
                                        minRadius: 3,
                                        maxRadius: 70,
                                        opacity: 0.8,
                                        dataSource: internetUsers,
                                        tooltipSettings: {
                                            visible: true,
                                            valuePath: 'population',
                                            template: '#template'
                                        },
                                        colorMapping: [
                                            {
                                                from: 1, to: 15, color: "green", label: "10-20"
                                            },
                                            {
                                                from: 15, to: 30, color: "yellow", label: "20-30"
                                            }]
                                    }
                                ]
                            }
                        ]
                    }, '#' + id);
                });
                afterAll(() => {
                    remove(ele);
                    map.destroy();
                });        
                it('Toggle legend property shape color for Default', () => {
                        map.loaded = (args: ILoadedEventArgs) => {
                            spec = document.getElementById('container_Legend_Shape_Index_0')
                            trigger.clickEvent(spec);
                            expect(spec.getAttribute('fill')).toBe("lightgreen");
                            spec = document.getElementById("container_LayerIndex_1_BubbleIndex_0_dataIndex_3");
                            expect(spec.getAttribute('fill')).toBe("lightgreen");
                        }
                        map.refresh();
                    })
                    it('Toggle legend property for shapeSettings for Default', () => {
                        map.loaded = (args: ILoadedEventArgs) => {
                            spec = document.getElementById('container_Legend_Shape_Index_0')
                            trigger.clickEvent(spec);
                            expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                            trigger.clickEvent(spec);
                            spec = document.getElementById("container_LayerIndex_1_BubbleIndex_0_dataIndex_3");
                            expect(spec.getAttribute('fill')).toBe("green");
                        }
                        map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                        map.refresh();
                    })
                    it('Toggle legend text property for shapeSettings for Default', () => {
                        map.loaded = (args: ILoadedEventArgs) => {
                            spec = document.getElementById('container_Legend_Text_Index_0')
                            trigger.clickEvent(spec);
                            expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                            trigger.clickEvent(spec);
                            spec = document.getElementById("container_LayerIndex_1_BubbleIndex_0_dataIndex_3");
                            expect(spec.getAttribute('fill')).toBe("green");
                        }
                        map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                        map.refresh();
                    })                   
                });
                describe('Toggle legend settings for bubble for Interactive', () => {
                    let id: string = 'container';
                    let map: Maps;
                    let ele: HTMLDivElement;
                    let trigger: MouseEvents = new MouseEvents();
                    let spec: Element;
                    beforeAll(() => {
                        ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                        document.body.appendChild(ele);
                        map = new Maps({
                            format: 'n',
                            useGroupingSeparator: true,
                            zoomSettings: {
                                enable: true,
                                horizontalAlignment: 'Near',
                                toolBarOrientation: 'Vertical',
                                pinchZooming: true
                            },
                            titleSettings: {
                                text: 'Top 30 countries with highest Internet users',
                                textStyle: {
                                    size: '16px'
                                }
                            },
                            legendSettings: {
                                visible: true,
                                type: "Bubbles",
                                position: 'Bottom',
                                height: '10',
                                width: '80%',
                                mode: "Interactive",
                                toggleLegendSettings: {
                                    enable: true,
                                    applyShapeSettings: false,
                                    fill : "lightgreen",
                                    opacity: 0.5,
                                    border: {
                                        color: "green",
                                        width: 2
                                    }
                                },
                                titleStyle: {
                                    size: '18px'
                                },
                                title: {
                                    text: 'Inches'
                                },
                                
                            },
                            layers: [
                                {
                                    layerType: 'OSM'
                                },
                                {
                                    type: 'SubLayer',
                                    shapeDataPath: 'name',
                                    shapePropertyPath: 'name',
                                    shapeData: World_Map,
                                    shapeSettings: {
                                        fill: '#E5E5E5'
                                    },
                                    bubbleSettings: [
                                        {
                                            visible: true,
                                            valuePath: 'value',
                                            colorValuePath: 'rank',
                                            animationDuration:0,
                                            minRadius: 3,
                                            maxRadius: 70,
                                            opacity: 0.8,
                                            dataSource: internetUsers,
                                            tooltipSettings: {
                                                visible: true,
                                                valuePath: 'population',
                                                template: '#template'
                                            },
                                            colorMapping: [
                                                {
                                                    from: 1, to: 15, color: "green", label: "10-20"
                                                },
                                                {
                                                    from: 15, to: 30, color: "yellow", label: "20-30"
                                                }]
                                        }
                                    ]
                                }
                            ]
                        }, '#' + id);
                    });
                    afterAll(() => {
                        remove(ele);
                        map.destroy();
                    });        
                    it('Toggle legend property shape color for Interactive', () => {
                            map.loaded = (args: ILoadedEventArgs) => {
                                spec = document.getElementById('container_Legend_Index_0')
                                trigger.clickEvent(spec);
                                expect(spec.getAttribute('fill')).toBe("lightgreen");
                                spec = document.getElementById("container_LayerIndex_1_BubbleIndex_0_dataIndex_3");
                                expect(spec.getAttribute('fill')).toBe("lightgreen");
                            }
                            map.refresh();
                        })
                        it('Toggle legend property for shapeSettings for Interactve', () => {
                            map.loaded = (args: ILoadedEventArgs) => {
                                spec = document.getElementById('container_Legend_Index_0')
                                trigger.clickEvent(spec);
                                expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                                trigger.clickEvent(spec);
                                spec = document.getElementById("container_LayerIndex_1_BubbleIndex_0_dataIndex_3");
                                expect(spec.getAttribute('fill')).toBe("green");
                            }
                            map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                            map.refresh();
                        })                   
                    });
                    describe('Legend selection and toggle with legend paging', () => {
                        let id: string = 'container';
                        let map: Maps;
                        let ele: HTMLDivElement;
                        let trigger: MouseEvents = new MouseEvents();
                        let spec: Element;
                        beforeAll(() => {
                            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
                            document.body.appendChild(ele);
                            map = new Maps({
                                titleSettings: {
                                    text: 'Population density (per square kilometers) - 2015',
                                    textStyle: {
                                        size: '16px'
                                    }
                                },
                                legendSettings: {
                                    visible: true,
                                    position: 'Top',
                                    width: '30%',
                                    height: '3%',
                                    toggleLegendSettings: {
                                        enable: true,
                                        applyShapeSettings: false,
                                        fill: "yellow",
                                        opacity: 0.1         
                                    }
                                },
                                layers: [
                                    {
                                        layerType: 'OSM'
                                    },
                                    {
                                        type: 'SubLayer',
                                        shapeData: World_Map,
                                        shapeDataPath: 'name',
                                        shapePropertyPath: 'name',
                                        dataSource: populationDetails,
                                        tooltipSettings: {
                                            visible: true,
                                            valuePath: 'name',
                                            format: '${name} : ${density} per square kms'
                                        },
                                        selectionSettings: {
                                            enable: true,
                                            enableMultiSelect: true
                                        },
                                        highlightSettings: {
                                            enable: false,
                                        },
                                        shapeSettings: {
                                            colorValuePath: 'density',
                                            fill: '#E5E5E5',
                                            colorMapping: [
                                                {
                                                    from: 0.00001, to: 25, color: 'rgb(153,174,214)', label: '<25'
                                                },
                                                {
                                                    from: 25, to: 50, color: 'rgb(153,174,214)', label: '25 - 50'
                                                },
                                                {
                                                    from: 50, to: 100, color: 'rgb(153,174,214)', label: '50 - 100'
                                                },
                                                {
                                                    from: 100, to: 200, color: 'rgb(115,143,199)', label: '100 - 200'
                                                },
                                                {
                                                    from: 200, to: 300, color: 'rgb(77,112,184)', label: '200 - 300'
                                                },
                                                {
                                                    from: 300, to: 500, color: 'rgb(38,82,168)', label: '300 - 500'
                                                },
                                            ]
                                        }
                                    }
                                ]
                            }, '#' + id);
                        });
                        afterAll(() => {
                            remove(ele);
                            map.destroy();
                        });
                        it('Shape selection with corresonding legend is in another page', () => {
                                map.loaded = (args: ILoadedEventArgs) => {
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_72_dataIndex_67')
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe("ShapeselectionMapStyle");
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_93_dataIndex_140');
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe("ShapeselectionMapStyle");
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe(null);
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe("ShapeselectionMapStyle");
                                }
                                map.refresh();
                            })
                            it('Shape selection with corresonding legend is in another page without enable multi select', () => {
                                map.loaded = (args: ILoadedEventArgs) => {
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_81_dataIndex_75');
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe("ShapeselectionMapStyle");
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe(null);
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('class')).toBe("ShapeselectionMapStyle");
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_72_dataIndex_67')
                                    expect(spec.getAttribute('class')).toBe(null);
                                }
                                map.layers[0].selectionSettings.enableMultiSelect = false;
                                map.refresh();
                            })
                            it('Toggle legend after selection', () => {
                                map.loaded = (args: ILoadedEventArgs) => {
                                    spec = document.getElementById('container_Legend_Shape_Index_0')
                                    trigger.clickEvent(spec);
                                    expect(spec.getAttribute('fill')).toBe("yellow");
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_64_dataIndex_58')
                                    expect(spec.getAttribute('fill')).toBe("yellow");
                                }
                                map.refresh();
                            })
                            it('Check toggle state after call refresh', () => {
                                map.loaded = (args: ILoadedEventArgs) => {
                                    spec = document.getElementById('container_Legend_Shape_Index_0')
                                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_64_dataIndex_58')
                                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                                }
                                map.refresh();
                            })
                            it('Check the legend height', () => {
                                map.loaded = (args: ILoadedEventArgs) => {
                                    spec = document.getElementById('container_Legend_Shape_Index_0')
                                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                                    spec = document.getElementById('container_LayerIndex_1_shapeIndex_64_dataIndex_58')
                                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                                }
                                map.legendSettings.title.text = '';
                                map.refresh();
                            })
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