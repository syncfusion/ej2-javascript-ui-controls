import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, randomcountriesData, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Legend, Marker } from '../../../src/maps/index';
Maps.Inject(Legend, Marker);

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
/**
 * Legend spec
 */
let MapData: Object = World_Map;
describe('Map marker properties tesing', () => {
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
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_64_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_167_dataIndex_2');
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_0_DataIndex_0');
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
});