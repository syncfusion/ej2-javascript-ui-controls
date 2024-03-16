/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Marker, Zoom, MapsTooltip, Polygon, Selection, Highlight } from '../../../src/maps/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
Maps.Inject(Marker, Zoom, MapsTooltip, Polygon, Selection, Highlight);

let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0", "t1", "t2", "t3"];
let zoomMax: string = "21";

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}

let MapData: Object = World_Map;
describe('Map polygon properties tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('polygon testing', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        let prevent: Function = (): void => {
        };
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings:{
                    enable: true,
                },
                layers: [
                    {
                        shapeData: MapData,
                        
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });

        it('default polygon setting', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Polygons_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].polygonSettings = {
                    polygons: [
                        {
                            points: [
                                { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                                { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                                { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                                { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                                { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                                { longitude: 78.458446486326, latitude: 32.61816437431272 },
                                { longitude: 78.738894484374, latitude: 31.515906073527056 },
                                { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                                { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                                { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                                { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                                { longitude: 81.057202589852, latitude: 28.416095282499036 },
                                { longitude: 81.99998742058496, latitude: 27.925479234319987 },
                                { longitude: 83.30424889519954, latitude: 27.364505723575554 },
                                { longitude: 84.67501793817377, latitude: 27.23490123138753 },
                                { longitude: 85.25177859898335, latitude: 26.726198431906337 },
                                { longitude: 86.02439293817915, latitude: 26.630984605408567 },
                                { longitude: 87.22747195836628, latitude: 26.39789805755607 },
                                { longitude: 88.0602376647498, latitude: 26.414615383402484 },
                                { longitude: 88.1748043151409, latitude: 26.810405178325944 },
                                { longitude: 88.0431327656612, latitude: 27.445818589786818 },
                                { longitude: 88.12044070836984, latitude: 27.876541652939586 },
                                { longitude: 88.73032596227853, latitude: 28.08686473236751 },
                                { longitude: 88.81424848832054, latitude: 27.29931590423936 },
                                { longitude: 88.83564253128937, latitude: 27.098966376243755 },
                                { longitude: 89.74452762243884, latitude: 26.71940298105995 },
                                { longitude: 89.74452762243884, latitude: 26.71940298105995 },
                                { longitude: 90.37327477413406, latitude: 26.875724188742872 },
                                { longitude: 91.2175126484864, latitude: 26.80864817962802 },
                                { longitude: 92.03348351437508, latitude: 26.838310451763554 },
                                { longitude: 92.10371178585973, latitude: 27.4526140406332 },
                                { longitude: 91.69665652869665, latitude: 27.77174184825166 },
                                { longitude: 92.50311893104362, latitude: 27.896876329046442 },
                                { longitude: 93.41334760943266, latitude: 28.64062938080722 },
                                { longitude: 94.56599043170293, latitude: 29.277438055939978 },
                                { longitude: 95.40480228066461, latitude: 29.031716620392125 },
                                { longitude: 96.117678664131, latitude: 29.45280202892246 },
                                { longitude: 96.58659061074748, latitude: 28.830979519154337 },
                                { longitude: 96.24883344928776, latitude: 28.411030992134435 },
                                { longitude: 97.32711388549001, latitude: 28.26158274994633 },
                                { longitude: 97.40256147663612, latitude: 27.88253611908544 },
                                { longitude: 97.05198855996807, latitude: 27.699058946233144 },
                                { longitude: 97.13399905801528, latitude: 27.08377350514996 },
                                { longitude: 96.41936567585094, latitude: 27.26458934173922 },
                                { longitude: 95.12476769407493, latitude: 26.573572089132295 },
                                { longitude: 95.15515343626257, latitude: 26.001307277932078 },
                                { longitude: 94.60324913938535, latitude: 25.1624954289704 },
                                { longitude: 94.55265791217161, latitude: 24.67523834889033 },
                                { longitude: 94.10674197792505, latitude: 23.850740871673477 },
                                { longitude: 93.32518761594277, latitude: 24.078556423432197 },
                                { longitude: 93.28632693885925, latitude: 23.043658352138998 },
                                { longitude: 93.0602942240146, latitude: 22.703110663335565 },
                                { longitude: 93.16612755734836, latitude: 22.2784595809771 },
                                { longitude: 92.67272098182555, latitude: 22.041238918541247 },
                                { longitude: 92.1460347839068, latitude: 23.62749868417259 },
                                { longitude: 91.8699276061713, latitude: 23.62434642180278 }
                            ],
                        }
                    ],
                    highlightSettings: {
                        enable: true
                    },
                    selectionSettings:{
                        enable: true,
                        enableMultiSelect: false
                    },
                }
            map.refresh();
        });
        it('Selection checking', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                spec = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                trigger.clickEvent(spec);
                expect(spec.getAttribute('class')).toBe('PolygonselectionMapStyle');
                done();
            };
            map.appendTo('#' + id);
        });
        it('Checking unselect using click', (done: Function) => {
            spec = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
            trigger.clickEvent(spec);
            expect(spec.getAttribute('class')).toBe(null);
            done();
        });
        it('Highlight polygon element', (done: Function) => {
            spec = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
            trigger.mousemoveEvent(spec, 0 , 0, 0, 0);
            expect(spec.getAttribute('class')).toBe('highlightMapStyle');
            done();
        });
        it('polygon shape border color', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('stroke')).toBe('blue');
                done();
            };
            map.layers[0].polygonSettings.polygons[0].borderColor = "blue";         
            map.refresh();
        });
        it('polygon shape border opacity', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('stroke-opacity')).toBe("0.5");
            };
            map.layers[0].polygonSettings.polygons[0].borderOpacity = 0.5;         
            map.refresh();
        });
        it('polygon shape fill', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill')).toBe('red');
                done();
            };
            map.layers[0].polygonSettings.polygons[0].fill = "red";         
            map.refresh();
        });
        it('polygon shape fill opacity', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill-opacity')).toBe('0.5');
            };
            map.layers[0].polygonSettings.polygons[0].opacity = 0.5;         
            map.refresh();
        });
        it('polygon shape with zoom factor', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill-opacity')).toBe('0.5');
            };
            map.layers[0].polygonSettings.polygons[0].opacity = 0.5;
            map.zoomSettings.zoomFactor = 2;      
            map.refresh();
        });
        it('Checking polygon with zooming', () => {
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
                element = document.getElementById(map.element.id + '_LayerIndex_0_Polygons_Group');
                expect(element.childElementCount === 1).toBe(true);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true, height: 20, width: 20,
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 },
                    { Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }],
                    template: '<div>{{:Name}}</div>'
                }
            ];
            map.refresh();
        });
        it('Checking single click zooming', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_Zooming_ToolBar_Reset_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                element = document.getElementById(map.element.id + '_LayerIndex_0_shapeIndex_134_dataIndex_undefined');
                map.zoomModule.isSingleClick = true;
                eventObj = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                expect(map.scale === 1.03).toBe(true);
                map.zoomModule.click(<PointerEvent>eventObj);
                expect(map.scale === 2.0300000000000002).toBe(true);
            };
            map.zoomSettings.zoomOnClick = true;
            map.layers[0].layerType = 'Geometry';
            map.refresh();
        });
        it('Checking with Zoom in button with shouldZoomInitially as true', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 1; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.zoomSettings.zoomFactor = 3;
            map.refresh(); 
        });
        it('Checking with Zoom in button', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 2; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.zoomSettings.zoomFactor = 3;
            map.layers[0].polygonSettings.polygons = [ {
                    points: [
                        { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                        { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                        { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                        { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                        { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                        { longitude: 78.458446486326, latitude: 32.61816437431272 },
                        { longitude: 78.738894484374, latitude: 31.515906073527056 },
                        { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                        { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                        { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                        { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                        { longitude: 81.057202589852, latitude: 28.416095282499036 },
                    ],
                }
            ]
            map.refresh(); 
        });
        it('Checking reset button with zooming after shouldZoomInitially as false', () => {
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
            map.layers[0].polygonSettings.polygons = [
                {
                    points: [
                        { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                        { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                        { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                        { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                        { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                        { longitude: 78.458446486326, latitude: 32.61816437431272 },
                        { longitude: 78.738894484374, latitude: 31.515906073527056 },
                        { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                        { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                        { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                        { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                        { longitude: 81.057202589852, latitude: 28.416095282499036 },
                    ],
                },
                {
                points: [
                    { longitude: 92.10371178585973, latitude: 27.4526140406332 },
                    { longitude: 91.69665652869665, latitude: 27.77174184825166 },
                    { longitude: 92.50311893104362, latitude: 27.896876329046442 },
                    { longitude: 93.41334760943266, latitude: 28.64062938080722 },
                    { longitude: 94.56599043170293, latitude: 29.277438055939978 },
                    { longitude: 95.40480228066461, latitude: 29.031716620392125 },
                    { longitude: 96.117678664131, latitude: 29.45280202892246 },
                    { longitude: 96.58659061074748, latitude: 28.830979519154337 },
                    { longitude: 96.24883344928776, latitude: 28.411030992134435 },
                    { longitude: 97.32711388549001, latitude: 28.26158274994633 },
                    { longitude: 97.40256147663612, latitude: 27.88253611908544 },
                    { longitude: 97.05198855996807, latitude: 27.699058946233144 },
                    { longitude: 97.13399905801528, latitude: 27.08377350514996 },
                    { longitude: 96.41936567585094, latitude: 27.26458934173922 },
                    { longitude: 95.12476769407493, latitude: 26.573572089132295 },
                    { longitude: 95.15515343626257, latitude: 26.001307277932078 },
                    { longitude: 94.60324913938535, latitude: 25.1624954289704 },
                    { longitude: 94.55265791217161, latitude: 24.67523834889033 },
                    { longitude: 94.10674197792505, latitude: 23.850740871673477 },
                    { longitude: 93.32518761594277, latitude: 24.078556423432197 },
                    { longitude: 93.28632693885925, latitude: 23.043658352138998 },
                    { longitude: 93.0602942240146, latitude: 22.703110663335565 },
                    { longitude: 93.16612755734836, latitude: 22.2784595809771 },
                    { longitude: 92.67272098182555, latitude: 22.041238918541247 },
                    { longitude: 92.1460347839068, latitude: 23.62749868417259 },
                    { longitude: 91.8699276061713, latitude: 23.62434642180278 }
                ],
            }
        ]
        map.refresh();
        });
    });
    describe('polygon Checking with bing and osm ', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let prevent: Function = (): void => {
            //Prevent Function
        };
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            map = new Maps({
                zoomSettings:{
                    enable: true,
                },
                baseLayerIndex: 0,
                layers: [
                    {
                        layerType: 'OSM',
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            map.destroy();
        });
        it('default polygon setting', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_Polygons_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.layers[0].polygonSettings.polygons = [
                {
                    points: [
                        { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                        { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                        { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                        { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                        { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                        { longitude: 78.458446486326, latitude: 32.61816437431272 },
                        { longitude: 78.738894484374, latitude: 31.515906073527056 },
                        { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                        { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                        { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                        { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                        { longitude: 81.057202589852, latitude: 28.416095282499036 },
                        { longitude: 81.99998742058496, latitude: 27.925479234319987 },
                        { longitude: 83.30424889519954, latitude: 27.364505723575554 },
                        { longitude: 84.67501793817377, latitude: 27.23490123138753 },
                        { longitude: 85.25177859898335, latitude: 26.726198431906337 },
                        { longitude: 86.02439293817915, latitude: 26.630984605408567 },
                        { longitude: 87.22747195836628, latitude: 26.39789805755607 },
                        { longitude: 88.0602376647498, latitude: 26.414615383402484 },
                        { longitude: 88.1748043151409, latitude: 26.810405178325944 },
                        { longitude: 88.0431327656612, latitude: 27.445818589786818 },
                        { longitude: 88.12044070836984, latitude: 27.876541652939586 },
                        { longitude: 88.73032596227853, latitude: 28.08686473236751 },
                        { longitude: 88.81424848832054, latitude: 27.29931590423936 },
                        { longitude: 88.83564253128937, latitude: 27.098966376243755 },
                        { longitude: 89.74452762243884, latitude: 26.71940298105995 },
                        { longitude: 89.74452762243884, latitude: 26.71940298105995 },
                        { longitude: 90.37327477413406, latitude: 26.875724188742872 },
                        { longitude: 91.2175126484864, latitude: 26.80864817962802 },
                        { longitude: 92.03348351437508, latitude: 26.838310451763554 },
                        { longitude: 92.10371178585973, latitude: 27.4526140406332 },
                        { longitude: 91.69665652869665, latitude: 27.77174184825166 },
                        { longitude: 92.50311893104362, latitude: 27.896876329046442 },
                        { longitude: 93.41334760943266, latitude: 28.64062938080722 },
                        { longitude: 94.56599043170293, latitude: 29.277438055939978 },
                        { longitude: 95.40480228066461, latitude: 29.031716620392125 },
                        { longitude: 96.117678664131, latitude: 29.45280202892246 },
                        { longitude: 96.58659061074748, latitude: 28.830979519154337 },
                        { longitude: 96.24883344928776, latitude: 28.411030992134435 },
                        { longitude: 97.32711388549001, latitude: 28.26158274994633 },
                        { longitude: 97.40256147663612, latitude: 27.88253611908544 },
                        { longitude: 97.05198855996807, latitude: 27.699058946233144 },
                        { longitude: 97.13399905801528, latitude: 27.08377350514996 },
                        { longitude: 96.41936567585094, latitude: 27.26458934173922 },
                        { longitude: 95.12476769407493, latitude: 26.573572089132295 },
                        { longitude: 95.15515343626257, latitude: 26.001307277932078 },
                        { longitude: 94.60324913938535, latitude: 25.1624954289704 },
                        { longitude: 94.55265791217161, latitude: 24.67523834889033 },
                        { longitude: 94.10674197792505, latitude: 23.850740871673477 },
                        { longitude: 93.32518761594277, latitude: 24.078556423432197 },
                        { longitude: 93.28632693885925, latitude: 23.043658352138998 },
                        { longitude: 93.0602942240146, latitude: 22.703110663335565 },
                        { longitude: 93.16612755734836, latitude: 22.2784595809771 },
                        { longitude: 92.67272098182555, latitude: 22.041238918541247 },
                        { longitude: 92.1460347839068, latitude: 23.62749868417259 },
                        { longitude: 91.8699276061713, latitude: 23.62434642180278 }
                    ],
                }
            ]; 
            map.refresh();
        });
        it('polygon shape border color', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('stroke')).toBe('blue');
                done();
            };
            map.layers[0].polygonSettings.polygons[0].borderColor = "blue";         
            map.refresh();
        });
        it('polygon shape border opacity', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('stroke-opacity')).toBe("0.5");
            };
            map.layers[0].polygonSettings.polygons[0].borderOpacity = 0.5;         
            map.refresh();
        });
        it('polygon shape border width', (done: Function) => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(Math.round(parseInt(element.getAttribute('stroke-width'))) == 4).toBe(true);
                done();
            };
            map.layers[0].polygonSettings.polygons[0].borderWidth = 4;         
            map.refresh();
        });
        it('polygon shape fill', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill')).toBe('red');
            };
            map.layers[0].polygonSettings.polygons[0].fill = "red";         
            map.refresh();
        });
        it('polygon shape fill opacity', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill-opacity')).toBe('0.5');
            };
            map.layers[0].polygonSettings.polygons[0].opacity = 0.5;         
            map.refresh();
        });
        it('polygon shape with zoom factor', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(map.element.id + '_LayerIndex_0_PolygonIndex_0');
                expect(element.getAttribute('fill-opacity')).toBe('0.5');
            };
            map.layers[0].polygonSettings.polygons[0].opacity = 0.5;
            map.zoomSettings.zoomFactor = 2;      
            map.refresh();
        });
        it('Checking polygon with zooming', () => {
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
                element = document.getElementById(map.element.id + '_LayerIndex_0_Polygons_Group');
                expect(element.childElementCount === 1).toBe(true);
            };
            map.layers[0].markerSettings = [
                {
                    visible: true, height: 20, width: 20,
                    dataSource: [{ Name: "USA", latitude: 38.8833, longitude: -77.0167 },
                    { Name: "Indonesia", latitude: -6.1750, longitude: 106.8283 }],
                    template: '<div>{{:Name}}</div>'
                }
            ];
            map.layers[0].markerClusterSettings.allowClustering = true;
            map.refresh();
        });
        it('Checking with Zoom in button', () => {
            map.loaded = (args: ILoadedEventArgs) => {
                let element: Element = getElementByID(map.element.id + '_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: element,
                    type: 'touchstart',
                    stopImmediatePropagation: prevent,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                for (let i: number = 0; i < 2; i++) {
                    map.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                }
            };
            map.zoomSettings.zoomFactor = 3;
            map.layers[0].polygonSettings.polygons = [ {
                    points: [
                        { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                        { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                        { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                        { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                        { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                        { longitude: 78.458446486326, latitude: 32.61816437431272 },
                        { longitude: 78.738894484374, latitude: 31.515906073527056 },
                        { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                        { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                        { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                        { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                        { longitude: 81.057202589852, latitude: 28.416095282499036 },
                    ],
                }
            ]
            map.refresh(); 
        });
        it('Checking reset button with zooming after shouldZoomInitially as false', () => {
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
            map.layers[0].polygonSettings.polygons = [
                {
                    points: [
                        { longitude: 77.83745079947455, latitude: 35.49400950778776 },
                        { longitude: 78.91226891471321, latitude: 34.32193634697578 },
                        { longitude: 78.81108646028572, latitude: 33.506198025032404 },
                        { longitude: 79.20889163606857, latitude: 32.99439463961371 },
                        { longitude: 79.1761287779955, latitude: 32.483779812137705 },
                        { longitude: 78.458446486326, latitude: 32.61816437431272 },
                        { longitude: 78.738894484374, latitude: 31.515906073527056 },
                        { longitude: 79.72136681510709, latitude: 30.882714748654724 },
                        { longitude: 81.11125613802929, latitude: 30.1834809433134 },
                        { longitude: 80.47672122591737, latitude: 29.729865220655334 },
                        { longitude: 80.08842451367626, latitude: 28.794470119740136 },
                        { longitude: 81.057202589852, latitude: 28.416095282499036 },
                    ],
                },
                {
                points: [
                    { longitude: 92.10371178585973, latitude: 27.4526140406332 },
                    { longitude: 91.69665652869665, latitude: 27.77174184825166 },
                    { longitude: 92.50311893104362, latitude: 27.896876329046442 },
                    { longitude: 93.41334760943266, latitude: 28.64062938080722 },
                    { longitude: 94.56599043170293, latitude: 29.277438055939978 },
                    { longitude: 95.40480228066461, latitude: 29.031716620392125 },
                    { longitude: 96.117678664131, latitude: 29.45280202892246 },
                    { longitude: 96.58659061074748, latitude: 28.830979519154337 },
                    { longitude: 96.24883344928776, latitude: 28.411030992134435 },
                    { longitude: 97.32711388549001, latitude: 28.26158274994633 },
                    { longitude: 97.40256147663612, latitude: 27.88253611908544 },
                    { longitude: 97.05198855996807, latitude: 27.699058946233144 },
                    { longitude: 97.13399905801528, latitude: 27.08377350514996 },
                    { longitude: 96.41936567585094, latitude: 27.26458934173922 },
                    { longitude: 95.12476769407493, latitude: 26.573572089132295 },
                    { longitude: 95.15515343626257, latitude: 26.001307277932078 },
                    { longitude: 94.60324913938535, latitude: 25.1624954289704 },
                    { longitude: 94.55265791217161, latitude: 24.67523834889033 },
                    { longitude: 94.10674197792505, latitude: 23.850740871673477 },
                    { longitude: 93.32518761594277, latitude: 24.078556423432197 },
                    { longitude: 93.28632693885925, latitude: 23.043658352138998 },
                    { longitude: 93.0602942240146, latitude: 22.703110663335565 },
                    { longitude: 93.16612755734836, latitude: 22.2784595809771 },
                    { longitude: 92.67272098182555, latitude: 22.041238918541247 },
                    { longitude: 92.1460347839068, latitude: 23.62749868417259 },
                    { longitude: 91.8699276061713, latitude: 23.62434642180278 }
                ],
            }
        ]
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
