/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { getElement } from '../../../src/maps/utils/helper';
import { Marker, ILoadEventArgs, BingMap } from '../../../src/maps/index';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
Maps.Inject(Marker);

let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0","t1","t2","t3"];
let zoomMax: string = "21";

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}

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
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let trigger: MouseEvents = new MouseEvents();
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
                let element: Element = <Element>document.getElementById(map.element.id + '_LayerIndex_0_MarkerIndex_1_dataIndex_0').firstChild;
                let triger: MouseEvents = new MouseEvents();
                triger.clickEvent(element);
                expect(element.getAttribute('fill')).toBe('blueviolet');
                let transform: string = element.getAttribute('transform');
                //     expect(transform.indexOf('translate(135') > -1).toBe(true);
                //     expect(transform.indexOf(', 178') > -1).toBe(true);
                //     expect(transform.indexOf('scale(0.44') > -1).toBe(true);
                //     expect(transform.indexOf(', 0.33') > -1).toBe(true);
            };
            map.addMarker(0, [{
                animationDuration: 1, visible: true, fill: 'blueviolet', dataSource: [
                    { Name: 'USA', latitude: 38.8833, longitude: -77.0167 }
                ]
            }]);
        });
        it('checking the marker clustering', () => {
            map.loaded = (args: ILoadEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                spec = getElement(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_5_cluster_2');
                trigger.clickEvent(spec);
                spec = getElement(map.element.id + '_LayerIndex_0_MarkerIndex_0_dataIndex_5_cluster_2');
                trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            }
            map.layers[0].markerClusterSettings= {
                allowClustering: true,
                shape: 'Image',
                height:30,
                width:30,
                fill: 'blue',
                opacity: 0.5, 
                imageUrl :'./images/cluster_icon.svg'                            
            },
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno'},
                            { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel'},
                            { latitude: 40.7424509, longitude: -74.0081468, name: 'New York'},
                            { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris'},
                            { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai'},
                            { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato'},
                            { latitude: 51.5326602, longitude: -0.1262422, name: 'London'}
                    ]
                },
                {
                    visible: true,
                    template: '<div id="marker1" class="markerTemplate">Asia' +
                        '</div>',
                    dataSource: [
                        { latitude: 50.32087157990324, longitude: 90.015625 }
                    ],
                    animationDuration: 0
                },
            ]
            map.refresh();
        })
        it('checking the marker clustering template', () => {
            map.loaded = (args: ILoadEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
                
            }
            map.layers[0].markerClusterSettings= {
                allowClustering: true,
                shape: 'Image',
                height:30,
                width:30,
                fill: 'blue',
                opacity: 0.5, 
                imageUrl :'./images/cluster_icon.svg'                            
            },
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno'}
                    ]
                },
                {
                    visible: true,
                    tooltipSettings: {
                        visible: true
                    },
                    template: '<div id="marker1" class="markerTemplate">Asia' +
                        '</div>',
                    dataSource: [
                        { latitude: 50.32087157990324, longitude: 90.015625 }
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker2" class="markerTemplate">Australia' +
                        '</div>',
                    dataSource: [
                        { latitude: -25.88583769986199, longitude: 134.296875 }
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker3" class="markerTemplate">Africa' +
                        '</div>',
                    dataSource: [
                        { latitude: 16.97274101999902, longitude: 16.390625 }
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker4" class="markerTemplate">Europe' +
                        '</div>',
                    dataSource: [
                        { latitude: 49.95121990866204, longitude: 18.468749999999998 }
                    ],
                    animationDuration: 0,
                },
                {
                    visible: true,
                    template: '<div id="marker5" class="markerTemplate" style="width:50px">North America' +
                        '</div>',
                    dataSource: [
                        { latitude: 59.88893689676585, longitude: -109.3359375 }
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker6" class="markerTemplate" style="width:50px">South America' +
                        '</div>',
                    dataSource: [
                        { latitude: -6.64607562172573, longitude: -55.54687499999999 }
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker1" class="markerTemplate">Arizona' +
                        '</div>',
                    dataSource: [
                        { latitude: 34.0864548, longitude: -116.4242, name: 'Arizona' },
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker2" class="markerTemplate">las vegas' +
                        '</div>',
                    dataSource: [
                        { latitude: 36.1246737, longitude: -115.4551968, name: 'las vegas' },
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker3" class="markerTemplate">Nevada' +
                        '</div>',
                    dataSource: [
                        { latitude: 38.4161464, longitude: -121.5160838, name: 'Nevada' },
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker5" class="markerTemplate" style="width:50px">San Bruno' +
                        '</div>',
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' },
                    ],
                    animationDuration: 0
                },
                {
                    visible: true,
                    template: '<div id="marker6" class="markerTemplate" style="width:50px">Laguna Niguel' +
                        '</div>',
                    dataSource: [
                        { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' },
                    ],
                    animationDuration: 0
                },
            ]
            map.refresh();
        })

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
        it('Marker template checking with OSM map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].markerClusterSettings = {
                allowClustering: true,
                shape: 'Image',
                height:30,
                width:30,
                fill: 'blue',
                opacity: 0.5, 
                imageUrl :'./images/cluster_icon.svg'                            
            },
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno'},
                            { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel'},
                            { latitude: 40.7424509, longitude: -74.0081468, name: 'New York'},
                            { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro'},
                            { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto'},
                            { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris'},
                            { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin'},
                            { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai'},
                            { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato'},
                            { latitude: 51.5326602, longitude: -0.1262422, name: 'London'}
                    ]
                },
                {
                    visible: true,
                    template: '<div id="marker1" class="markerTemplate">Asia' +
                        '</div>',
                    dataSource: [
                        { latitude: 50.32087157990324, longitude: 90.015625 }
                    ],
                    animationDuration: 0
                },];
            map.layers[0].layerType = 'OSM';
            map.refresh();
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