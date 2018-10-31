/**
 * Zooming spec
 */
import { Maps, ILoadedEventArgs, ITouches, BingMap, ILoadEventArgs } from '../../../src/index';
import { createElement, remove, Browser } from '@syncfusion/ej2-base';
import { World_Map, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Zoom, Bubble, Marker } from '../../../src/maps/index';
import { getElementByID } from '../layers/colormapping.spec';
import { electiondata, randomcountriesData } from '../data/us-data.spec';
import { Point, Rect } from '../../../src/maps/utils/helper';
Maps.Inject(Zoom, Marker, Bubble);

let MapData: Object = World_Map;
let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0","t1","t2","t3"];
let zoomMax: string = "21";
describe('Zoom feature tesing for map control', () => {
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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

        it('Checking with Zoom in button - bing map ', () => {
            map.load = (args: ILoadEventArgs) =>{
                debugger
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
                dataSource: [{
                    name: 'Manhattan, New York, USA',
                    latitude: 40.7489,
                    longitude: -74.968
                }]
            }];            
            map.refresh();
        });

        it('Checking with zoom out button - bing map ', () => {
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",                         
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
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
                map.zoomModule.mouseDownPoints = { x: (rect.left + 100), y: (rect.top + 100) };
                map.zoomModule.mouseMovePoints = { x: (rect.left + 200), y: (rect.top + 100) };
                map.zoomModule.panning();
            };
            map.refresh();
        });

        it('Check - panning with bing map ', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let rect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
                map.zoomModule.mouseDownPoints = { x: (rect.left + 100), y: (rect.top + 100) };
                map.zoomModule.mouseMovePoints = { x: (rect.left + 200), y: (rect.top + 100) };
                map.scale = 2;
                map.tileZoomLevel = 2;
                map.zoomModule.panning();
            };
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
            let move: ITouches[] = [{ pageX: rect.left - 100, pageY: (rect.top + 200) }, { pageX: (rect.left + 300), pageY: rect.top - 200 }];
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
                let down: ITouches[] = [{ pageX: rect.left + 100, pageY: rect.top + 100 }, { pageX: rect.left + 200, pageY: rect.top + 200 }];
                let move: ITouches[] = [{ pageX: rect.left - 100, pageY: (rect.top + 100) }, { pageX: (rect.left - 200), pageY: rect.top + 200 }];
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
                let down: ITouches[] = [{ pageX: rect.left + 100, pageY: rect.top + 100 }, { pageX: rect.left + 200, pageY: rect.top + 200 }];
                let move: ITouches[] = [{ pageX: rect.left + 100, pageY: (rect.top + 100) }, { pageX: (rect.left - 200), pageY: rect.top + 200 }];
                map.zoomModule.touchStartList = down;
                map.zoomModule.touchMoveList = move;
                map.zoomModule.currentScale = 1;
                map.zoomModule.performPinchZooming(<TouchEvent>{});
            };
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
            map.load = (args: ILoadEventArgs) =>{
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
            map.load = (args: ILoadEventArgs) =>{
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
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
            let selection = document.getElementById(map.element.id + "_Secondary_Element").appendChild(
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
                    }
                ],
                zoomSettings: {
                    enable: true,
                    pinchZooming: true,
                    zoomOnClick: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('Checking with zooming public method ', () => {
            let centerPosition = { latitude: 84, longitude: 45 };
            map.zoomByPosition(centerPosition, 5);
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
                map.mapsOnDoubleClick(<PointerEvent>{});
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
                                { "Name": "USA", "latitude": 38.8833, "longitude": -77.0167 },
                                { "Name": "Brazil", "latitude": -15.7833, "longitude": -47.8667 },
                                { "Name": "India", "latitude": 21.0000, "longitude": 78.0000 },
                                { "Name": "China", "latitude": 35.0000, "longitude": 103.0000 },
                                { "Name": "Indonesia", "latitude": -6.1750, "longitude": 106.8283 }
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
                dataSource: [
                    { "Name": "USA", "latitude": 38.8833, "longitude": -77.0167 },
                    { "Name": "Brazil", "latitude": -15.7833, "longitude": -47.8667 },
                    { "Name": "India", "latitude": 21.0000, "longitude": 78.0000 },
                    { "Name": "China", "latitude": 35.0000, "longitude": 103.0000 },
                    { "Name": "Indonesia", "latitude": -6.1750, "longitude": 106.8283 }
                ]
            }];
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_ShapeIndex_26_dataIndex_undefined');
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
            map.load = (args: ILoadEventArgs) =>{
                let bing: BingMap = new BingMap(map);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                map.mapLayerPanel["bing"] = bing;
            };
            map.layers[0].layerType = 'Bing';
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
            map.load = (args: ILoadEventArgs) =>{
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
                        key: "AmfB8BVuEu-ep0xaTvL6s44TbnCQplA0CSoNAfe3MI7AoEwvqFjz9FSQ6tLFzx4L",
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
});
