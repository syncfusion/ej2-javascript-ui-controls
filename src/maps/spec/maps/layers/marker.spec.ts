/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Marker, ILoadEventArgs, BingMap } from '../../../src/maps/index';
Maps.Inject(Marker);

let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0","t1","t2","t3"];
let zoomMax: string = "21";

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}

let MapData: Object = World_Map;
describe('Map marker properties tesing', () => {
    describe('Marker testing', () => {
        let id: string = 'container';
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
                        shapeData: MapData
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Marker shape checking with Triangle', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Triangle',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Triangle',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Triangle',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Triangle',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Triangle',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ];
            map.refresh();
        });


        it('Marker shape checking with Circle', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Circle',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Circle',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Circle',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Circle',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Circle',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with Rectangle', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Rectangle',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Rectangle',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Rectangle',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Rectangle',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Rectangle',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with Star', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Star',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Star',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Star',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Star',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Star',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with Cross', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Cross',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Cross',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Cross',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Cross',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Cross',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with Diamond', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Diamond',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Diamond',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Diamond',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Diamond',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Diamond',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });


        it('Marker shape checking with Balloon', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Balloon',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Balloon',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Balloon',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Balloon',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Balloon',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });


        it('Marker shape checking with HorizontalLine', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'HorizontalLine',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'HorizontalLine',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'HorizontalLine',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'HorizontalLine',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'HorizontalLine',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with VerticalLine', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'VerticalLine',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'VerticalLine',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'VerticalLine',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'VerticalLine',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'VerticalLine',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });

        it('Marker shape checking with Image', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    shape: 'Image',
                    imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 }]
                },
                {
                    visible: true,
                    shape: 'Image',
                    imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                    dataSource: [{ Name: "Brazil", latitude: -15.7833, longitude: -47.8667 }]
                },
                {
                    visible: true,
                    shape: 'Image',
                    imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                    dataSource: [{ Name: "India", latitude: 21.0000, longitude: 78.0000 }]
                },
                {
                    visible: true,
                    shape: 'Image',
                    imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                    dataSource: [{ Name: "China", latitude: 35.0000, longitude: 103.0000 }]
                },
                {
                    visible: true,
                    shape: 'Image',
                    imageUrl: 'http://js.syncfusion.com/demos/web/Images/map/pin.png',
                    dataSource: [{ Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
                }
            ]
            map.refresh();
        });
        it('checking with marker template', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    template: '<div id="marker1"><p>{{:Name}}</p></div>',
                    dataSource: [
                        { Name: "USA", latitude: 38.8833, longitude: -77.0167 },
                        { Name: "Brazil", latitude: -15.7833, longitude: -47.8667 },
                        { Name: "India", latitude: 21.0000, longitude: 78.0000 },
                        { Name: "China", latitude: 35.0000, longitude: 103.0000 },
                        { Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }
                    ]
                }]
            map.refresh();
        });

        it('checking with add marker method', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = <Element>document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_1_DataIndex_0').firstChild;
                let triger: MouseEvents = new MouseEvents();
                triger.clickEvent(element);
                expect(element.getAttribute('fill')).toBe('blueviolet');
                let transform: string = element.getAttribute('transform');
                //     expect(transform.indexOf('translate(135') > -1).toBe(true);
                //     expect(transform.indexOf(', 178') > -1).toBe(true);
                //     expect(transform.indexOf('scale(0.44') > -1).toBe(true);
                //     expect(transform.indexOf(', 0.33') > -1).toBe(true);
            };
            map.addMarker(0, {
                animationDuration: 1, visible: true, fill: 'blueviolet', dataSource: [
                    { Name: 'USA', latitude: 38.8833, longitude: -77.0167 }
                ]
            });
        });
    });

    describe('Marker Checking with bing and osm ', () => {
        let id: string = 'container';
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
                        layerType: 'Bing',
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Marker checking with Bing map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Markers_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].markerSettings = [{
                visible: true,
                height: 30,
                width: 30,
                dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 },
                { Name: "Brazil", latitude: -15.7833, longitude: -47.8667 },
                { Name: "India", latitude: 21.0000, longitude: 78.0000 },
                { Name: "China", latitude: 35.0000, longitude: 103.0000 },
                { Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
            }]
            map.refresh();
        });

        it('Marker template checking with OSM map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerSettings = [{
                visible: true,
                height: 30,
                width: 30,
                template: "<div><img src=http://js.syncfusion.com/demos/web/Images/map/pin.png></img></div>",
                dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 },
                { Name: "Brazil", latitude: -15.7833, longitude: -47.8667 },
                { Name: "India", latitude: 21.0000, longitude: 78.0000 },
                { Name: "China", latitude: 35.0000, longitude: 103.0000 },
                { Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }]
            }];
            map.layers[0].layerType = 'OSM';
            map.refresh();
        });
    });
});