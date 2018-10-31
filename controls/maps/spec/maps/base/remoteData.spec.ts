import { Maps, ILoadedEventArgs, ILayerRenderingEventArgs, MapAjax } from '../../../src/index';
import { createElement, remove, Ajax } from '@syncfusion/ej2-base';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Zoom, Bubble, Marker, Annotations } from '../../../src/maps/index';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { World_Map } from '../data/data.spec';
Maps.Inject(Zoom, Marker, Bubble, Annotations);

/**
 * 
 */
describe('Remote Data testing', () => {
    describe('Get data from server using Ajax', () => {
        let id: string = 'container';
        let map: Maps;
        let shapeData: JSON[] = ({
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [
                                [0, 0],
                                [0, 20],
                                [20, 20],
                                [20, 0],
                                [0, 0]
                            ]
                        ],
                        [
                            [
                                [0, 22],
                                [0, 27],
                                [20, 27],
                                [20, 22],
                                [0, 22]
                            ]
                        ]
                    ]
                },
                "properties": {
                    "seatno": 19,
                    "fill": "gray"
                }
            }]
        } as Object) as JSON[];
        let prevent: Function = (): void => { };
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let template: string = '<script id=template type="text/x-template"><div id="tool">80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        let annotationDiv: HTMLElement = createElement('div', { id: 'annotation', innerHTML: 'Map' });
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: 'red',
                border: {
                    color: 'blue',
                    width: 2
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with data manager support for remote data', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = <Element>document.getElementById(map.element.id + '_LayerIndex_0_Polygon_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers = [
                {
                    shapeData: new DataManager(shapeData)
                }
            ];
            map.refresh();
        });

        it('Checking with ajax support for getting data', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = <Element>document.getElementById(map.element.id + '_LayerIndex_0_Polygon_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers = [
                {
                    shapeData: new MapAjax(location.origin + '/base/spec/maps/shapeData/Seat.json'),
                }
            ];
            map.refresh();
        });

        it('Checking with osm with sublayer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = <Element>document.getElementById(map.element.id + '_LayerIndex_1_Polygon_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers = [{
                layerType: 'OSM',
                markerSettings: [{
                    visible: true,
                    template: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    },
                    dataSource: [{
                        name: 'Tamil Nadu',
                        latitude: 11.127123,
                        longitude: 78.656891
                    }]
                }]
            },
            {
                type: 'SubLayer',
                dataSource: [
                    { color: '#ff6735', continent: 'North America' },
                    { color: '#f7e138', continent: 'South America' },
                    { color: '#37caf7', continent: 'Africa' },
                    { color: '#30d39a', continent: 'Europe' },
                    { color: '#ff495f', continent: 'Asia' },
                    { color: '#45ef59', continent: 'Australia' },
                ],
                shapeData: World_Map,
                shapeSettings: {
                    colorValuePath: 'color'
                }
            }];
            map.refresh();
        });

        it('Checking with zooming in osm', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let wheelArgs: Object = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                };
                map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
            };
            map.layers = [{
                layerType: 'OSM',
                markerSettings: [{
                    visible: true,
                    template: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                    tooltipSettings: {
                        visible: true,
                        valuePath: 'name'
                    },
                    dataSource: [{
                        name: 'Tamil Nadu',
                        latitude: 11.127123,
                        longitude: 78.656891
                    }]
                }]
            }];
            map.zoomSettings.enable = true;
            map.refresh();
        });
    });
});