import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, randomcountriesData, topPopulation, populationDetails, internetUsers, internetUser } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Legend, Marker } from '../../../src/maps/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
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

        it('Legend position as top', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Top';
            map.refresh();
        });

        it('Legend position as left', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Legend position as right', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
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

        it('Legend position as float', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Float';
            map.legendSettings.location = { x: 100, y: 100 };
            map.refresh();
        });

        it('Legend shape as Star ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Star';
            map.refresh();
        });

        it('Legend shape as Cross ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Cross';
            map.refresh();
        });

        it('Legend shape as HorizontalLine ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'HorizontalLine';
            map.refresh();
        });

        it('Legend shape as VerticalLine ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.mode = 'Default';
            map.legendSettings.shape = 'VerticalLine';
            map.refresh();
        });

        it('Legend shape as Diamond ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Diamond';
            map.refresh();
        });

        it('Legend shape as Rectangle ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Rectangle';
            map.refresh();
        });


        it('Legend shape as Triangle ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Triangle';
            map.refresh();
        });

        it('Legend shape as InvertedTriangle ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'InvertedTriangle';
            map.refresh();
        });

        it('Legend shape as Pentagon ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.shape = 'Pentagon';
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
                expect(element.getAttribute('height')).toBe('474');
                expect(element.getAttribute('width')).toBe('492');
            };
            map.refresh();
        });
        it('Legend with gradient color check', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].shapeSettings.colorMapping[0].from = 500;
            map.layers[0].shapeSettings.colorMapping[0].to = 600;
            map.layers[0].shapeSettings.colorMapping[0].value = 'Oceania';
            map.layers[0].shapeSettings.colorMapping[0].color = ['red', 'blue'];
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
                legendSettings: {
                    visible: true,
                    type: 'Bubbles',
                    showLegendPath: 'legendVisibility',
                    valuePath: 'valuePath',
                    removeDuplicateLegend: true
                },
                layers: [
                    {
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

        it('Legend position as left', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.legendSettings.position = 'Left';
            map.refresh();
        });

        it('Legend position as right', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Legend_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
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
            map.layers[0].shapeSettings.colorValuePath = 'color';
            map.layers[0].shapeSettings.colorMapping = [];
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_167_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_BubbleIndex_0_dataIndex_3');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_0');
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

        it('Check with marker template', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount > 0).toBe(true);
            };
            map.layers[0].markerSettings[0].template = '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>';
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
            map.layers[0].shapeSettings.colorValuePath = 'Sales';
            map.layers[0].shapeSettings.colorMapping = [{
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
            map.layers[0].shapeSettings.colorValuePath = 'Sales';
            map.layers[0].shapeSettings.colorMapping = [
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
            map.layers[0].shapeSettings.colorValuePath = 'CategoryName';
            map.layers[0].shapeSettings.colorMapping = [
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
            map.layers[0].shapeSettings.colorMapping[0].value = 'Asia'
            map.layers[0].shapeSettings.colorMapping[0].label = 'Asia continents'
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
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                    spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("yellow");
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
                    spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                }
                map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                map.refresh();
            })
            it('Checking without toggleshapeSettings', () => {
                map.loaded = (args: ILoadedEventArgs) => {
                    spec = document.getElementById('container_Legend_Group');
                    expect(spec.childElementCount).toBe(5);
                    spec = document.getElementById('container_Legend_Shape_Index_0')
                    trigger.clickEvent(spec);
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
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
                    spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                    expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                    expect(spec.getAttribute('stroke')).toBe("#000000");
                    expect(spec.getAttribute('stroke-width')).toBe("0");
                    expect(spec.getAttribute("opacity")).toBe("1");
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
                    spec = document.getElementById("container_LayerIndex_0_shapeIndex_134_dataIndex_125");
                    expect(spec !== null).toBe(false);
                }
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
                        expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                        spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("yellow");
                    }
                    map.refresh();
                })
                it('Toggle legend property for shapeSettings for Interactive', () => {
                    map.loaded = (args: ILoadedEventArgs) => {
                        spec = document.getElementById('container_Legend_Group');
                        expect(spec.childElementCount).toBe(9);
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                        spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                    }
                    map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
                    map.refresh();
                })
                it('Checking without toggleshapeSettings for Interactive', () => {
                    map.loaded = (args: ILoadedEventArgs) => {
                        spec = document.getElementById('container_Legend_Group');
                        expect(spec.childElementCount).toBe(9);
                        spec = document.getElementById('container_Legend_Index_0')
                        trigger.clickEvent(spec);
                        expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                        spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
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
                        spec = document.getElementById("container_LayerIndex_0_shapeIndex_64_dataIndex_58");
                        expect(spec.getAttribute('fill')).toBe("rgb(153,174,214)");
                        expect(spec.getAttribute('stroke')).toBe("#000000");
                        expect(spec.getAttribute('stroke-width')).toBe("0");
                        expect(spec.getAttribute("opacity")).toBe("1");
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
                            expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                            spec = document.getElementById("container_LayerIndex_0_BubbleIndex_0_dataIndex_3");
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
                            spec = document.getElementById("container_LayerIndex_0_BubbleIndex_0_dataIndex_3");
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
                            spec = document.getElementById("container_LayerIndex_0_BubbleIndex_0_dataIndex_3");
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
                                expect(spec.getAttribute('fill')).toBe("#E5E5E5");
                                spec = document.getElementById("container_LayerIndex_0_BubbleIndex_0_dataIndex_3");
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
                                spec = document.getElementById("container_LayerIndex_0_BubbleIndex_0_dataIndex_3");
                                expect(spec.getAttribute('fill')).toBe("green");
                            }
                            map.legendSettings.toggleLegendSettings.applyShapeSettings = true;
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