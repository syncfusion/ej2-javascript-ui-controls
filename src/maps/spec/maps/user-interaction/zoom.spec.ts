/**
 * Zooming spec
 */
import { Maps, ILoadedEventArgs, ITouches, BingMap, ILoadEventArgs } from '../../../src/index';
import { createElement, remove, Browser } from '@syncfusion/ej2-base';
import { World_Map, usMap, africa } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Zoom, Bubble, Marker } from '../../../src/maps/index';
import { getElementByID } from '../layers/colormapping.spec';
import { randomcountriesData } from '../data/us-data.spec';
import { Rect, getElement } from '../../../src/maps/utils/helper';
import { profile, inMB, getMemoryProfile } from '../common.spec';
Maps.Inject(Zoom, Marker, Bubble);

let MapData: Object = World_Map;
let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0", "t1", "t2", "t3"];
let zoomMax: string = "21";
describe('Zoom feature tesing for map control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking tool bar zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let prevent: Function = (): void => {
        };
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings: {
                    enable: true,
                    toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset']
                },
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ]
            }, '#' + id);
            let bing: BingMap = new BingMap(map);
            bing.imageUrl = imageUrl;
            bing.maxZoom = zoomMax;
            bing.subDomains = subDomains;
            map.mapLayerPanel["bing"] = bing;
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with Zoom in button -geometry ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 5; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.refresh();
        });
        it('Checking with Zoom in button -geometry with persistence ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 5; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.enablePersistence = true;
            map.mapsArea.border.width = 0;
            map.refresh();
        });

        it('Checking with Zoom out button -geometry ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mousedown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 5; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.width = '400px';
            map.height = '400px';
            map.refresh();
        });

        it('Checking with pan button', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mouseup',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                eventObj['target'] = element;
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                element = getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect');
                eventObj['target'] = element;
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.refresh();
        });

        it('Checking with zoom button', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Zoom_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.refresh();
        });

        it('Checking with reset button', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Reset_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.refresh();
        });
        it('Checking with Zoom using public method', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_LayerIndex_0_Polygon_Group");
                expect(element.getAttribute("transform")).toBe("scale( 4.180794305632649 ) translate( -187.70715126367102 -99.21828842120752 ) ");
            };
            map.zoomToCoordinates(19.1555762, 13.4107368, 52.4643089, 72.8849595);
        });
        it('Checking with Zoom using public method', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_LayerIndex_0_Polygon_Group");
                expect(element.getAttribute("transform")).toBe("scale( 10 ) translate( -246.93412391666658 -149.3926670651955 ) ");
            };
            map.zoomToCoordinates(19.1555762, 72.8849595, null, null);
        });
        it('Checking with reset button with persistence', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Reset_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.enablePersistence = true;
            map.refresh();
        });
      
        it('Checking with pan button', () => {
          map.loaded = (args: ILoadedEventArgs) => {
              let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect');
              let eventObj: Object = {
                  target: element,
                  type: 'mouseup',
                  stopImmediatePropagation: prevent,
                  pageX: element.getBoundingClientRect().left,
                  pageY: element.getBoundingClientRect().top
              };
              map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
              element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
              eventObj['target'] = element;
              map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
              element = getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect');
              eventObj['target'] = element;
              map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
          };
          map.layers[0].layerType = "OSM";
          map.refresh();
      });

        it('Checking with Zoom in button - bing map ', () => {
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.layers[0].layerType = 'Bing';
            map.layers[0].navigationLineSettings = [{
                dashArray: '5,1',
                width: 10,
                visible: true,
                color: '#15c6f2',
                latitude: [23.6445, 34.0522],
                longitude: [-102.832, -118.2437]
            }];
            map.layers[0].markerSettings = [{
                visible: !0,
                template: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png"' +
                    'style="height:30px;width:20px;"></img></div>',
                tooltipSettings: {
                    visible: true,
                    valuePath: 'name'
                },
                latitudeValuePath: null,
                longitudeValuePath: null,
                dataSource: [{
                    name: 'Manhattan, New York, USA',
                    latitude: 40.7489,
                    longitude: -74.968
                }]
            }];
            map.refresh();
        });

        it('Checking with zoom out button - bing map ', () => {
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });
        it('Checking with public methode zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
            };
            map.zoomToCoordinates(52.4643089, 13.4107368, 19.1555762, 72.8849595);
        });
        it('Checking with double tab zooming ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                let eventObj: Object = {
                    target: element,
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: element.getBoundingClientRect().top + map.mapAreaRect.y + (map.mapAreaRect.height / 2)
                };
                map.zoomModule.doubleClick(<PointerEvent>eventObj);
            };
            map.layers[0].layerType = 'Geometry';
            map.zoomSettings.doubleClickZoom = true;
            map.refresh();
        });
    });

    describe('Checking with mouse wheel zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('mouse wheel zoom in with geometry layer', () => {
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
        });

        it('mouse wheel zoom out with geometry layer', () => {
            let element: Element = document.getElementById(map.element.id);
            let rect: ClientRect = element.getBoundingClientRect();
            let wheelArgs: Object = {
                preventDefault: prevent,
                wheelDelta: -180,
                detail: 3,
                clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
            };
            map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
        });

        it('mouse wheel zoom in with bing map', () => {
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
            map.layers[0].layerType = 'Bing';
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
            }
            map.refresh();
        });

        it('mouse wheel zoom out with bing map', () => {
            let element: Element = document.getElementById(map.element.id);
            let rect: ClientRect = element.getBoundingClientRect();
            let wheelArgs: Object = {
                preventDefault: prevent,
                wheelDelta: -180,
                detail: 3,
                clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
            };
            map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
        });
        it('To zoom the marker clustering', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomByPosition({ latitude: 33.5302186, longitude: -117.7418381 }, 5);
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layersCollection[0].layerType = 'OSM';
            map.layers[0].markerClusterSettings = {
                allowClustering: true,
                shape: 'Image',
                height: 30,
                width: 30,
                fill: 'blue',
                opacity: 0.5,
                imageUrl: './images/cluster_icon.svg'
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    latitudeValuePath: null,
                    longitudeValuePath: null,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' },
                        { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' },
                        { latitude: 40.7424509, longitude: -74.0081468, name: 'New York' },
                        { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro' },
                        { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto' },
                        { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris' },
                        { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin' },
                        { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai' },
                        { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato' },
                        { latitude: 51.5326602, longitude: -0.1262422, name: 'London' }
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
            map.scale = 1;
            map.refresh();
        });
    });

    describe('Checking with mouse panning', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check pannning with geometry layer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                let wheelArgs: Object;
                for (let i: number = 0; i < 10; i++) {
                        wheelArgs = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
                map.zoomModule.mouseDownPoints = { x: (rect.left + 100), y: (rect.top + 100) };
                map.zoomModule.mouseMovePoints = { x: (rect.left + 200), y: (rect.top + 100) };
                map.zoomModule.panning('None', null, null, <PointerEvent | TouchEvent>wheelArgs);
            };
            map.refresh();
        });

        it('Check - panning with bing map ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
                let wheelArgs: Object; let delta: number = 130;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: delta++,
                    detail: 3,
                    clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                };
                map.zoomModule.mouseDownPoints = { x: (rect.left + 100), y: (rect.top + 100) };
                map.zoomModule.mouseMovePoints = { x: (rect.left + 200), y: (rect.top + 100) };
                map.scale = 2;
                map.tileZoomLevel = 2;
                map.zoomModule.panning('None', null, null, <PointerEvent | TouchEvent>wheelArgs);
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();

        });
        it('Check - panning with OSM map ', () => {
          map.loaded = (args: ILoadedEventArgs) => {
              let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
              let wheelArgs: Object; let delta: number = 130;
              wheelArgs = {
                  preventDefault: prevent,
                  wheelDelta: delta++,
                  detail: 3,
                  clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                  clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                  pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                  pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
              };
              map.zoomModule.mouseDownPoints = { x: (rect.left + 100), y: (rect.top + 100) };
              map.zoomModule.mouseMovePoints = { x: (rect.left + 200), y: (rect.top + 100) };
              map.scale = 2;
              map.tileZoomLevel = 2;
              map.zoomModule.panning('None', null, null, <PointerEvent | TouchEvent>wheelArgs);
          };
          map.load = (args: ILoadEventArgs) => {
              let bing: BingMap = new BingMap(map);
              bing.imageUrl = imageUrl;
              bing.maxZoom = zoomMax;
              bing.subDomains = subDomains;
          };
          map.layers[0].layerType = 'OSM';
          map.refresh();

      });
    });

    describe('Checking with toolbar alignment', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            // Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomOnClick: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with toolbar alignment is vertical', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.toolBarOrientation = 'Vertical';
            map.refresh();
        });

        it('Checking with toolbar alignment is Near', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.verticalAlignment = 'Near';
            map.refresh();
        });

        it('Checking with toolbar alignment is Center', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.verticalAlignment = 'Center';
            map.refresh();
        });

        it('Checking with toolbar alignment is Far', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.verticalAlignment = 'Far';
            map.refresh();
        });

        it('Checking with toolbar horizontal alignment is Near', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.horizontalAlignment = 'Near';
            map.refresh();
        });

        it('Checking with toolbar horizontal alignment is Center', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.horizontalAlignment = 'Center';
            map.refresh();
        });

        it('Checking with toolbar horizontal alignment is Far', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.horizontalAlignment = 'Far';
            map.refresh();
        });
    });

    //Code coverage for spec
    describe('Checking with pich zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomOnClick: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with pinch zooming - zoom in', () => {
            let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            let down: ITouches[] = [{ pageX: rect.left + 100, pageY: rect.top + 100 }, { pageX: rect.left + 200, pageY: rect.top + 200 }];
            let move: ITouches[] = [
                { pageX: rect.left - 100, pageY: (rect.top + 200) },
                { pageX: (rect.left + 300), pageY: rect.top - 200 }
            ];
            map.zoomModule.touchStartList = down;
            map.zoomModule.touchMoveList = move;
            map.isTileMap = false;
            map.zoomModule.performPinchZooming(<TouchEvent>{});
            move = [{ pageX: rect.left - 200, pageY: (rect.top + 300) }, { pageX: (rect.left + 400), pageY: rect.top - 300 }];
            map.zoomModule.touchMoveList = move;
            map.zoomModule.performPinchZooming(<TouchEvent>{});
            map.zoomModule.firstMove = false;
            map.zoomSettings.pinchZooming = true;
            let eventObj: Object = {
                target: map.element,
                type: 'touchmove',
                preventDefault: prevent,
                touches: move
            };
            map.zoomModule.mouseMoveHandler(<PointerEvent | TouchEvent>eventObj);
        });

        it('Checking with pinch zooming - zoom out', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
                let down: ITouches[] = [
                    { pageX: rect.left + 100, pageY: rect.top + 100 },
                    { pageX: rect.left + 200, pageY: rect.top + 200 }
                ];
                let move: ITouches[] = [
                    { pageX: rect.left - 100, pageY: (rect.top + 100) },
                    { pageX: (rect.left - 200), pageY: rect.top + 200 }
                ];
                map.zoomModule.touchStartList = down;
                map.zoomModule.touchMoveList = move;
                map.zoomModule.performPinchZooming(<TouchEvent>{});
            };
            map.refresh();
        });

        it('Checking with smooth pinch', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
                let x: number = rect.left + (rect.width / 2);
                let y: number = rect.top + (rect.height / 2);
                let down: ITouches[] = [{ pageX: x, pageY: y }, { pageX: (x + 50), pageY: (y + 50) }];
                let move: ITouches[] = [{ pageX: (x - 100), pageY: y }, { pageX: (x + 200), pageY: (y + 50) }];
                map.zoomModule.touchStartList = down;
                map.zoomModule.touchMoveList = move;
                map.zoomModule.performPinchZooming(<TouchEvent>{});
                move = down;
                map.zoomModule.performPinchZooming(<TouchEvent>{});
            };
            map.refresh();
        });

        it('Checking with pinch zooming - zoom in', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
                let down: ITouches[] = [
                    { pageX: rect.left + 100, pageY: rect.top + 100 },
                    { pageX: rect.left + 200, pageY: rect.top + 200 }
                ];
                let move: ITouches[] = [
                    { pageX: rect.left + 100, pageY: (rect.top + 100) },
                    { pageX: (rect.left - 200), pageY: rect.top + 200 }
                ];
                map.zoomModule.touchStartList = down;
                map.zoomModule.touchMoveList = move;
                map.zoomModule.currentScale = 1;
                map.zoomModule.performPinchZooming(<TouchEvent>{});
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });
    });

    describe('Checking with mouse selection zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4',
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomOnClick: true,
                    toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset']
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking seletion with geometry layer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                trigger.dragAndDropEvent(element, (rect.left + (rect.width / 2)), (rect.top + (rect.height / 2)),
                    (rect.left + rect.width), (rect.top + rect.height), '', map);
            };
            map.refresh();
        });
        it('Checking seletion with bing map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                trigger.dragAndDropEvent(element, (rect.left + (rect.width / 2)), (rect.top + (rect.height / 2)),
                    (rect.left + rect.width), (rect.top + rect.height), '', map);
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });

        it('Checking seletion with dragging', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                trigger.mousemoveEvent(element, (rect.left + 50), (rect.top + 50),
                    (rect.left + 100), (rect.top + 100));
                trigger.mousemoveEvent(element, (rect.left + 50), (rect.top + 50),
                    (rect.left + 150), (rect.top + 150));
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });

        it('Checking seletion with minimum', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                trigger.mousemoveEvent(element, (rect.left + 150), (rect.top + 150),
                    (rect.left + 120), (rect.top + 120));
                trigger.mouseupEvent(element, (rect.left + 150), (rect.top + 150),
                    (rect.left + 120), (rect.top + 120));
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });
    });

    describe('Checking with mouse selection zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true,
                    pinchZooming: true,
                    zoomOnClick: true,
                    toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset']
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with mouse down event with touch', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let eventObj: Object = {
                target: element,
                type: 'touchstart',
                touches: [{ clientX: rect.left + 100, clientY: rect.top + 100 }],
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomModule.mouseDownHandler(<PointerEvent>eventObj);
        });

        it('Checking with mouse move event with touch', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let down: ITouches[] = [{ pageX: rect.left + 100, pageY: rect.top + 100 }, { pageX: rect.left + 200, pageY: rect.top + 200 }]
            map.zoomModule.isPanning = true;
            map.zoomModule.touchStartList = down;
            let eventObj: Object = {
                target: element,
                type: 'touchmove',
                preventDefault: prevent,
                touches: [{ clientX: rect.left - 100, clientY: rect.top + 100 }, { clientX: rect.left + 300, clientY: rect.top + 200 }],
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomModule.mouseMoveHandler(<PointerEvent>eventObj);
        });

        it('Checking with mouse up event', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let eventObj: Object = {
                target: element,
                type: 'touchend',
                touches: [{ clientX: rect.left + 100, clientY: rect.top + 100 }],
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomSettings.enable = true;
            let selection = document.getElementById(map.element.id + '_Secondary_Element').appendChild(
                createElement('div', { id: map.element.id + '_Selection_Rect_Zooming' })
            );
            map.zoomModule.zoomingRect = { x: 0, y: 0, height: 0, width: 0 };
            map.zoomModule.mouseUpHandler(<PointerEvent>eventObj);
        });

        it('Checking with mouse cancel event', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let eventObj: Object = {
                target: element,
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomModule.mouseCancelHandler(<PointerEvent>eventObj);
        });

        it('Checking with Zoom in tooltip', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.showTooltip(<PointerEvent>eventObj);
                map.zoomModule.removeTooltip();
            };
            map.isTouch = true;
            map.refresh();
        });

        it('Checking with mouse hover on zooming kit', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_KitCollection');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.mouseMoveHandler(<PointerEvent>eventObj);
            };
            map.refresh();
        });
    });

    describe('Checking with center position', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
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
                ],
                zoomSettings: {
                    enable: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('To zoom the geometry layer with center position ', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let eventObj: Object = {
                target: element,
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomByPosition({ latitude: 21, longitude: 78 }, 5);
            map.panByDirection('Left', <PointerEvent>eventObj);
            map.panByDirection('Right', <PointerEvent>eventObj);
        });

        it('To zoom the geometry layer without center position ', () => {
            let element: Element = getElementByID(map.element.id + '_svg');
            let rect: ClientRect = element.getBoundingClientRect();
            let eventObj: Object = {
                target: element,
                pageX: element.getBoundingClientRect().left,
                pageY: element.getBoundingClientRect().top
            };
            map.zoomByPosition(null, 2);
            map.panByDirection('Top', <PointerEvent>eventObj);
            map.panByDirection('Bottom', <PointerEvent>eventObj);
        });
        it('To zoom the OSM layer with center position ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomByPosition({ latitude: 21, longitude: 78 }, 5);
            };
            map.layersCollection[0].layerType = 'OSM';
            map.refresh();
        });
        it('To zoom the OSM layer with center position and marker clustering', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomByPosition({ latitude: 33.5302186, longitude: -117.7418381 }, 5);
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layersCollection[0].layerType = 'OSM';
            map.layers[0].markerClusterSettings = {
                allowClustering: true,
                shape: 'Image',
                height: 30,
                width: 30,
                fill: 'blue',
                opacity: 0.5,
                imageUrl: './images/cluster_icon.svg'
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    latitudeValuePath: null,
                    longitudeValuePath: null,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' },
                        { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' },
                        { latitude: 40.7424509, longitude: -74.0081468, name: 'New York' },
                        { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro' },
                        { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto' },
                        { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris' },
                        { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin' },
                        { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai' },
                        { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato' },
                        { latitude: 51.5326602, longitude: -0.1262422, name: 'London' }
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
            map.refresh();
        });
        it('Checking with Zoom using public methode', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('container_LayerIndex_0_Markers_Template_Group');
                expect(element.childElementCount).toBe(1);
            };
            map.zoomToCoordinates(19.1555762, 13.4107368, 52.4643089, 72.8849595);
        });
    });

    describe('Checking OSM maps with zoomFactor', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let zoomEle: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                layers: [
                    {
                       layerType: 'OSM',
                       markerSettings: [{
                        visible: true,
                        shape: 'Diamond',
                        height: 15,
                        fill: "green",
                        width: 15,
                        dataSource: [
                            {
                                latitude: 37.0000, longitude: -120.0000, name: 'California',
                            },
                            {
                                latitude: 40.7127, longitude: -74.0059, name: "New York"
                            },
                            {
                                latitude: 42, longitude: -93, name: 'Iowa'
                            }
                        ]
                    }]
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomFactor: 3
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Checking zoom factor value as 0', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_svg");
                expect(element.childElementCount).toBe(2);
            };
            map.zoomSettings.zoomFactor = 0;
            map.refresh();
        });
        it('Checking zoom factor value as 1', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_svg");
                expect(element.childElementCount).toBe(2);
            };
            map.zoomSettings.zoomFactor = 1;
            map.refresh();
        });
        it('Checking zoom factor value as 3', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_svg");
                expect(element.childElementCount).toBe(2);
            };
            map.zoomSettings.zoomFactor = 3;
            map.refresh();
        });
        it('Checking with shouldZoomInitially as true', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_svg");
                expect(element.childElementCount).toBe(2);
            };
            map.zoomSettings.shouldZoomInitially = true;
            map.zoomSettings.zoomFactor = 1;
            map.refresh();
        });
    });

    describe('Checkzoom center position after screen resize ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let zoomEle: Element;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L'
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomOnClick: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Check map center position', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                zoomEle = getElement('container_LayerIndex_0_Polygon_Group');
                expect(zoomEle.getAttribute('transform') === 'scale( 1.03 ) translate( 49.324999999999875 -15.570708890365978 ) ' || 
                zoomEle.getAttribute('transform') === 'scale( 1.03 ) translate( 52.324999999999875 -15.570708890365978 ) ').toBe(true);
            };
            map.refresh();
        });

        it('Check center position after change container size in shape type layer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                zoomEle = getElement('container_LayerIndex_0_Polygon_Group');
                expect(zoomEle.getAttribute('transform')).toBe('scale( 1 ) translate( 10 63.596017495087295 ) ');
            }
            map.width = '412px';
            map.height = '412px';
            map.refresh();
        });
        it('Check center position in OSM type layer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                zoomEle = getElement('container_tile_parent');
                expect(zoomEle).not.toBe(null);
                // expect(zoomEle.childElementCount).toBe(1);
                zoomEle = getElement('tile0');
                // expect(zoomEle.getAttribute('style')).toBe('position:absolute;left: -0.5px;top: 19.5px;height: 256px;width: 256px;');
            }
            map.width = '512px';
            map.height = '512px';
            map.layers[0].layerType = "OSM";
            map.refresh();
        });
        it('Check center position after container resize in OSM type layer', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                zoomEle = getElement('container_tile_parent');
                expect(zoomEle).not.toBe(null);
                // expect(zoomEle.childElementCount).toBe(1);
                zoomEle = getElement('tile0');
                // expect(zoomEle.getAttribute('style')).toBe('position:;left: -154px;top: -134px;height: 256px;width: 256px;');
            }
            map.width = '206px';
            map.height = '206px';
            map.refresh();
        });
    });

    describe('Checking with mouse canel event ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                baseLayerIndex: 0,
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ],
                zoomSettings: {
                    enable: true,
                    zoomOnClick: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking mouse selection out in element', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let rect: ClientRect = element.getBoundingClientRect();
                let eventObj: Object = {
                    target: element,
                    preventDefault: prevent,
                    pageX: element.getBoundingClientRect().left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: element.getBoundingClientRect().top + map.mapAreaRect.y + (map.mapAreaRect.height / 2)
                };
                map.zoomModule.mouseDownPoints = {
                    x: element.getBoundingClientRect().left + map.mapAreaRect.x,
                    y: element.getBoundingClientRect().top + map.mapAreaRect.y
                };
                map.zoomModule.rectZoomingStart = true;
                map.zoomModule.mouseMoveHandler(<PointerEvent>eventObj);
                map.zoomModule.mouseCancelHandler(<PointerEvent>eventObj);
            };
            map.refresh();
        });

        it('Checking mouse double click', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_svg');
                let eventObj: Object = {
                    target: element,
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: element.getBoundingClientRect().top + map.mapAreaRect.y + (map.mapAreaRect.height / 2)
                };
                map.mapsOnDoubleClick(<PointerEvent>eventObj);
            }
            map.refresh();
        });
    });

    describe('Checking with mouse canel event ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: '#f4f4f4',
                width: '800px',
                height: '450px',
                border: {
                    color: 'black',
                    width: 1
                },
                titleSettings: {
                    text: 'World Map - Demo'
                },
                zoomSettings: {
                    enable: true
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Map Legend'
                    },
                    textStyle: {
                        size: '20px'
                    },
                    position: 'Top',
                    invertedPointer: true,
                    border: { color: '#4286f4', width: 2 }
                },
                layers: [
                    {
                        shapeData: World_Map,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                        shapePropertyPath: 'continent',
                        shapeDataPath: 'continent',
                        dataSource: randomcountriesData,
                        tooltipSettings: {
                            visible: false
                        },
                        bubbleSettings: [{
                            visible: true,
                            valuePath: 'Sales',
                            dataSource: randomcountriesData,
                            minRadius: 20,
                            maxRadius: 30,
                            fill: '#379F64',
                            tooltipSettings: {
                                visible: false
                            },
                            colorValuePath: 'Sales',
                            colorMapping: [
                                { from: 100, to: 200, color: '#66ff33' },
                                { from: 200, to: 300, color: '#0066ff' },
                                { from: 300, to: 400, color: '#ff33cc' },
                                { from: 400, to: 500, color: '#ff9900' },
                                { from: 500, to: 600, color: '#cc00cc' },
                            ]
                        }],
                        markerSettings: [{
                            visible: true,
                            height: 30,
                            width: 30,
                            template: '<div id="template"><p>{{:Name}}</p></div>',
                            dataSource: [
                                { 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167 },
                                { 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667 },
                                { 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000 },
                                { 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000 },
                                { 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283 }
                            ]
                        }],
                        shapeSettings: {
                            autofill: false,
                            fill: 'lightgrey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with marker template and bubble while zooming', () => {
            let element: Element = document.getElementById(map.element.id);
            let rect: ClientRect = element.getBoundingClientRect();
            let delta: number = 130;
            for (let i: number = 0; i < 10; i++) {
                let wheelArgs: Object = {
                    preventDefault: prevent,
                    wheelDelta: delta++,
                    detail: 3,
                    clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                    pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                };
                map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
            }
        });
        it('Checking with marker while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.layers[0].markerSettings = [{
                visible: true,
                height: 30,
                width: 30,
                latitudeValuePath: null,
                longitudeValuePath: null,
                dataSource: [
                    { 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167 },
                    { 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667 },
                    { 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000 },
                    { 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000 },
                    { 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283 }
                ]
            }];
            map.scale = 1;
            map.refresh();
        });
        it('Checking with marker while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.layers[0].markerSettings = [{
                visible: true,
                height: 30,
                width: 30,
                dataSource: [
                    { 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167 },
                    { 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667 },
                    { 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000 },
                    { 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000 },
                    { 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283 }
                ],
                animationDuration: 2
            }];
            map.scale = 1;
            map.refresh();
        });
        it('Checking with marker enableComplexProperty while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.layers[0].markerSettings = [{
                visible: true,
                height: 30,
                width: 30,
                latitudeValuePath: 'data.latitude',
                longitudeValuePath: 'data: longtitude',
                colorValuePath: "data.color",
                shapeValuePath: "data.shape",
                dataSource: [
                    { 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167, color: "red", shape: 'Circle', data: { shape: 'Rectangle', color: "red", 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167 } },
                    { 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667, color: "blue", shape: 'Circle', data: { shape: 'Rectangle', color: "blue", 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667 } },
                    { 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000, color: "green", shape: 'Circle', data: { shape: 'Rectangle', color: "green", 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000 } },
                    { 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000, color: "yellow", shape: 'Circle', data: { shape: 'Rectangle', color: "yellow", 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000 } },
                    { 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283, color: "black", shape: 'Circle', data: { shape: 'Rectangle', color: "black", 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283 } }
                ],
                animationDuration: 2
            },
            {
                visible: true,
                height: 30,
                width: 30,
                latitudeValuePath: 'latitude',
                longitudeValuePath: 'longtitude',
                colorValuePath: "color",
                shapeValuePath: "shape",
                dataSource: [
                    { 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167, color: "red", shape: 'Circle', data: { shape: 'Rectangle', color: "red", 'Name': 'USA', 'latitude': 38.8833, 'longitude': -77.0167 } },
                    { 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667, color: "blue", shape: 'Circle', data: { shape: 'Rectangle', color: "blue", 'Name': 'Brazil', 'latitude': -15.7833, 'longitude': -47.8667 } },
                    { 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000, color: "green", shape: 'Circle', data: { shape: 'Rectangle', color: "green", 'Name': 'India', 'latitude': 21.0000, 'longitude': 78.0000 } },
                    { 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000, color: "yellow", shape: 'Circle', data: { shape: 'Rectangle', color: "yellow", 'Name': 'China', 'latitude': 35.0000, 'longitude': 103.0000 } },
                    { 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283, color: "black", shape: 'Circle', data: { shape: 'Rectangle', color: "black", 'Name': 'Indonesia', 'latitude': -6.1750, 'longitude': 106.8283 } }
                ],
                animationDuration: 2
            }
            ];
            map.scale = 1;
            map.refresh();
        });
        it('Checking with marker clustering while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.layers[0].markerClusterSettings = {
                allowClustering: true,
                shape: 'Image',
                height: 30,
                width: 30,
                fill: 'blue',
                opacity: 0.5,
                imageUrl: './images/cluster_icon.svg'
            };
            map.layers[0].markerSettings = [
                {
                    visible: true,
                    dataSource: [
                        { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' },
                        { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' },
                        { latitude: 40.7424509, longitude: -74.0081468, name: 'New York' },
                        { latitude: -23.5268201, longitude: -46.6489927, name: 'Bom Retiro' },
                        { latitude: 43.6533855, longitude: -79.3729994, name: 'Toronto' },
                        { latitude: 48.8773406, longitude: 2.3299627, name: 'Paris' },
                        { latitude: 52.4643089, longitude: 13.4107368, name: 'Berlin' },
                        { latitude: 19.1555762, longitude: 72.8849595, name: 'Mumbai' },
                        { latitude: 35.6628744, longitude: 139.7345469, name: 'Minato' },
                        { latitude: 51.5326602, longitude: -0.1262422, name: 'London' }
                    ],
                    animationDuration: 0
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
            map.scale = 1;
            map.refresh();
        });
    });

    describe('Checking with mouse cancel event ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: '#f4f4f4',
                width: '800px',
                height: '450px',
                border: {
                    color: 'black',
                    width: 1
                },
                titleSettings: {
                    text: 'World Map - Demo'
                },
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        shapeData: usMap,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                        tooltipSettings: {
                            visible: false
                        },
                        dataLabelSettings: {
                            visible: true,
                            labelPath: 'name'
                        },
                        shapeSettings: {
                            autofill: false,
                            fill: 'lightgrey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with data label while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.refresh();
        });

        it('Checking with data label template while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.scale = 1;
            map.layers[0].dataLabelSettings.template = '<div id="marker1"><p>{{:name}}</p></div>';
            map.refresh();
        });

        it('Checking with Click event', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_26_dataIndex_undefined');
                let rect: ClientRect = element.getBoundingClientRect();
                let event: Object = {
                    type: 'click',
                    target: element,
                    pageX: rect.left,
                    pageY: rect.top
                };
                map.zoomModule.zoomColor = '#e61576';
                map.zoomModule.click(<PointerEvent>event);
            };
            map.zoomSettings.toolbars = ['ZoomIn', 'Zoom', 'ZoomOut', 'Pan', 'Reset'];
            map.zoomSettings.doubleClickZoom = false;
            map.zoomSettings.zoomOnClick = true;
            map.refresh();
        });
        it('Checking with center position zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.zoomFactor = 2;
            map.centerPosition = { latitude: 77, longitude: 21 };
            map.refresh();
        });
        it('Checking with bing map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomModule['zoomingRect'] = new Rect(0, 0, 100, 200);
                map.zoomModule.performRectZooming();
                map.zoomModule.isPanning = true;
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'pointerdown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(eventObj as PointerEvent);
                eventObj['target'] = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                map.zoomModule.performToolBarAction(eventObj as PointerEvent);
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
            map.refresh();
        });
        it('Checking with OSM map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                map.zoomModule['zoomingRect'] = new Rect(0, 0, 100, 200);
                map.zoomModule.performRectZooming();
                map.zoomModule.isPanning = true;
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_Reset_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'pointerdown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(eventObj as PointerEvent);
                eventObj['target'] = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                map.zoomModule.performToolBarAction(eventObj as PointerEvent);
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'OSM';
            map.refresh();
        });
        it('Checking panning', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performZoomingByToolBar('pan');
            };
            map.load = (args: ILoadEventArgs) => {
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.refresh();
        });
    });

    describe('Checking with mouse wheel event in Mozilla', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: '#f4f4f4',
                width: '800px',
                height: '450px',
                border: {
                    color: 'black',
                    width: 1
                },
                titleSettings: {
                    text: 'World Map - Demo'
                },
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        shapeData: World_Map,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                        tooltipSettings: {
                            visible: false
                        },
                        shapeSettings: {
                            autofill: false,
                            fill: 'lightgrey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with mozilla mouse wheel zooming - Zoom In', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: -3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            Browser.info.name = 'mozilla';
            map.refresh();
        });

        it('Checking with mozilla mouse wheel zooming - Zoom Out', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id);
                let rect: ClientRect = element.getBoundingClientRect();
                let delta: number = 130;
                for (let i: number = 0; i < 10; i++) {
                    let wheelArgs: Object = {
                        preventDefault: prevent,
                        wheelDelta: delta++,
                        detail: 3,
                        clientX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        clientY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                        pageX: rect.left + map.mapAreaRect.x + (map.mapAreaRect.width / 2),
                        pageY: rect.top + map.mapAreaRect.y + (map.mapAreaRect.height / 2),
                    };
                    map.zoomModule.mapMouseWheel(<WheelEvent>wheelArgs);
                }
            };
            map.refresh();
        });
    });

    describe('Checking with OSM and Geometry sub layer', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'Location of Africa continent in the World map',
                    textStyle: {
                        size: '16px'
                    }
                },
                zoomSettings: {
                    enable: true
                },
                annotations: [{
                    content: '<div style="height:18px;width:170px;background:white;text-align:center">' +
                        '<a href="https://www.openstreetmap.org/copyright"  target = "_blank" > © OpenStreetMap contributors </a></div > ',
                    verticalAlignment: 'Far',
                    zIndex: '1',
                    x: '-40',
                    y: '-20',
                    horizontalAlignment: 'Far'
                }],
                layers: [{
                    layerType: 'OSM',
                },
                {
                    type: 'SubLayer',
                    animationDuration: 0,
                    shapeData: africa,
                    shapeSettings: {
                        fill: '#5100a3',
                        opacity: 0.5
                    }
                }]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with sub layer rendering on osm map', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_svg');
                let eventObj: Object = {
                    target: element,
                    type: 'mouseup'
                };
                map.zoomModule['distanceX'] = 40;
                map.zoomModule.mouseUpHandler(eventObj as PointerEvent);
            };
            map.refresh();
        });
        it('Checking with sub layer rendering on osm map with persistence', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_svg');
                let eventObj: Object = {
                    target: element,
                    type: 'mouseup'
                };
                map.zoomModule['distanceX'] = 40;
                map.zoomModule.mouseUpHandler(eventObj as PointerEvent);
            };
            map.enablePersistence = true;
            map.refresh();
        });
        it('Checking with Zoom using public methode', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('container_Annotations_Group');
                expect(element.childElementCount).toBe(1);
            };
            map.zoomToCoordinates(19.1555762, 13.4107368, 52.4643089, 72.8849595);
        });
    });

    describe('Checking with Zoom Factor with Center Position', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                titleSettings: {
                    text: 'Location of Africa continent in the World map',
                    textStyle: {
                        size: '16px'
                    }
                },
                zoomSettings: {
                    enable: true,
                    zoomFactor: 4
                },
                layers: [{
                    shapeData: World_Map,
                    shapePropertyPath: 'continent',
                    shapeDataPath: 'continent',
                    shapeSettings: {
                        autofill: true,
                        colorValuePath: 'color'
                    },
                    dataSource: randomcountriesData
                },
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Checking zoom factor with different projection type', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.zoomFactor = 3;
            map.refresh();
        });
        it('Checking zoom factor zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {

                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);

            };
            map.previousProjection = 'Mercator';
            map.refresh();
        });
        it('Checking zoom factor with different projection type', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.zoomFactor = 3;
            map.projectionType = 'Miller';
            map.refresh();
        });
        it('Checking zoom factor with different projection type', () => {
            map.loaded = (args: ILoadedEventArgs) => {

            };
            map.zoomSettings.zoomFactor = 5;
            map.refresh();
        });
    });

    describe('Checking with datalabel properties ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: '#f4f4f4',
                width: '800px',
                height: '450px',
                border: {
                    color: 'black',
                    width: 1
                },
                titleSettings: {
                    text: 'World Map - Demo'
                },
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        shapeData: usMap,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                        tooltipSettings: {
                            visible: false
                        },
                        dataLabelSettings: {
                            visible: true,
                            labelPath: 'name'
                        },
                        shapeSettings: {
                            autofill: false,
                            fill: 'lightgrey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.layers[0].dataLabelSettings.smartLabelMode = "None";
            map.layers[0].dataLabelSettings.intersectionAction = "Hide"
            map.refresh();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                let element1: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj1: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element1.getBoundingClientRect().left,
                    pageY: element1.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj1);
            };
            map.layers[0].dataLabelSettings.smartLabelMode = "Trim";
            map.refresh();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                let element1: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj1: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element1.getBoundingClientRect().left,
                    pageY: element1.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj1);
            };
            map.layers[0].dataLabelSettings.smartLabelMode = "Hide";
            map.refresh();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.layers[0].dataLabelSettings.intersectionAction = "Trim";
            map.refresh();
        });
    });
    describe('Checking with datalabel properties ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                background: '#f4f4f4',
                width: '800px',
                height: '450px',
                border: {
                    color: 'black',
                    width: 1
                },
                titleSettings: {
                    text: 'World Map - Demo'
                },
                zoomSettings: {
                    enable: true
                },
                layers: [
                    {
                        shapeData: usMap,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                        tooltipSettings: {
                            visible: false
                        },
                        dataLabelSettings: {
                            visible: true,
                            labelPath: 'name'
                        },
                        shapeSettings: {
                            autofill: false,
                            fill: 'lightgrey',
                            border: {
                                width: 1,
                                color: 'white'
                            }
                        }
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mousedown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.layers[0].dataLabelSettings.smartLabelMode = "Trim";
            map.layers[0].dataLabelSettings.intersectionAction = "Trim";
            map.refresh();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mousedown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.scale = 1;
            map.layers[0].dataLabelSettings.smartLabelMode = "Trim";
            map.refresh();
        });
        it('Checking with data label properties while zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mousedown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.scale = 1;
            map.layers[0].dataLabelSettings.smartLabelMode = "Hide";
            map.refresh();
        });
        it('Checking with while zooming with persistence', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_ZoomOut_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'mousedown',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            };
            map.scale = 1;
            map.enablePersistence = true;
            map.refresh();
        });
    });
    describe('Checking public methode zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let prevent: Function = (): void => {
        };
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings: {
                    enable: true,
                },
                layers: [
                    {
                        shapeData: MapData,
                        key: 'AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L',
                    }
                ]
            }, '#' + id);
            let bing: BingMap = new BingMap(map);
            bing.imageUrl = imageUrl;
            bing.maxZoom = zoomMax;
            bing.subDomains = subDomains;
            map.mapLayerPanel["bing"] = bing;
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('Checking with Zoom using public method', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById("container_LayerIndex_0_Polygon_Group");
                expect(element.getAttribute("transform") === 'scale( 4.180794305632649 ) translate( -308.55595860551506 -195.7908353585998 ) ' ||
                element.getAttribute("transform") === 'scale( 4.180794305632649 ) translate( -307.8383916120951 -195.7908353585998 ) ').toBe(true);
            };
            map.zoomToCoordinates(19.1555762, 13.4107368, 52.4643089, 72.8849595);
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
