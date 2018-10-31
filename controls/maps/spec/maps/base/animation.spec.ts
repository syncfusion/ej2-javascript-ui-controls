/**
 * Maps Animation spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { Maps, removeElement, Zoom, Marker, Bubble, DataLabel, NavigationLine, getElement } from '../../../src/index';
import { MouseEvents } from './events.spec';
import { World_Map, usMap } from '../data/data.spec';
Maps.Inject(Zoom, Marker, Bubble, DataLabel, NavigationLine);
export function getIdElement(id: string): Element {
    return document.getElementById(id);
}
describe('Maps Component Base Spec', () => {

    describe('Maps testing spec', () => {
        let element: Element;
        let maps: Maps;
        let id: string = 'maps-animation';
        let trigger: MouseEvents = new MouseEvents();
        let css: string = '.map_size {height: 400px; width: 700px;} .mark { border: 2px solid rebeccapurple; } .label { border: 2px solid palegreen; }';
        let style: HTMLStyleElement = document.createElement('style');
        style.type = 'text/css';
        style.id = 'tooltipStyle';
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);
        let layerG: HTMLElement;
        let tempElement: Element;
        let scale: number;
        let transform: string[];
        // let preScale: number;
        // let preX: number;
        // let preY: number;
        // let curX: number;
        // let curY: number;
        let tempX: number;
        let tempY: number;
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '800px';
            (element as HTMLDivElement).style.height = '500px';
            document.body.appendChild(element);
            maps = new Maps({
                zoomSettings: {
                    enable: true,
                    toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
                    zoomOnClick: true,
                    doubleClickZoom: false,
                    zoomFactor: 6
                },
                centerPosition: {
                    latitude: 24,
                    longitude: 77
                },
                mapsArea: {
                    background: 'skyblue'
                },
                layers: [
                    {
                        animationDuration: 400,
                        shapeData: World_Map,
                        dataLabelSettings: {
                            visible: true,
                            labelPath: 'label',
                            smartLabelMode: 'Hide',
                            template: '<div class="label">{{:label}}</div>'
                        },
                        navigationLineSettings: [{
                            visible: true,
                            angle: 0,
                            latitude: [24, 40],
                            longitude: [77, -74]
                        }],
                        bubbleSettings: [{
                            visible: true,
                            animationDuration: 0,
                            valuePath: 'value',
                            bubbleType: 'Circle',
                            dataSource: [
                                { name: 'India', value: 50 },
                                { name: 'Mexico', value: 20 },
                                { name: 'South Africa', value: 40 },
                                { name: 'Canada', value: 30 },
                            ]
                        }]
                    }, {
                        type: 'SubLayer',
                        visible: true,
                        animationDuration: 400,
                        shapeData: usMap,
                        shapeSettings: {
                            autofill: true
                        },
                        markerSettings: [{
                            visible: true,
                            shape: 'Star',
                            template: '<div class="mark">{{:name}}</div>',
                            dataSource: [
                                { latitude: 46, longitude: -76, name: 'New York' },
                                { latitude: 31.9686, longitude: -99.9018, name: 'Texas' },
                            ]
                        }],
                    }]
            }, '#' + id);
        });
        afterAll(() => {
            maps.destroy();
            removeElement(id);
        });

        it('Maps checking with Initial animation', (done: Function) => {
            setTimeout(() => {
                layerG = <HTMLElement>getIdElement('maps-animation_LayerIndex_0_Polygon_Group');
                transform = layerG.getAttribute('transform').split(' ');
                scale = Number(transform[1]);
                tempX = Number(transform[4]);
                tempY = Number(transform[5]);
                expect(maps.previousScale < scale && scale <= maps.scale).toBe(true);
                expect(maps.previousPoint.x > tempX && tempX <= maps.translatePoint.x).toBe(true);
                expect(maps.previousPoint.y > tempY && tempY <= maps.translatePoint.y).toBe(true);
                done();
            }, 200);
        });
        it('Maps checking with zoom Reset animation', (done: Function) => {
            tempElement = getElement('maps-animation_Zooming_ToolBar_Reset_Rect');
            let eventObj: Object = {
                target: tempElement,
                type: 'touchstart',
                stopImmediatePropagation: (): void => { },
                pageX: tempElement.getBoundingClientRect().left,
                pageY: tempElement.getBoundingClientRect().top
            };
            maps.zoomModule.performToolBarAction(<PointerEvent>eventObj);
            setTimeout(() => {
                layerG = <HTMLElement>getIdElement('maps-animation_LayerIndex_0_Polygon_Group');
                transform = layerG.getAttribute('transform').split(' ');
                scale = Number(transform[1]);
                tempX = Number(transform[4]);
                tempY = Number(transform[5]);
                expect(maps.scale >= 1).toBe(true);
                expect(tempX >= maps.translatePoint.x).toBe(true);
                expect(tempY >= maps.translatePoint.y).toBe(true);
                done();
            }, 200);
        });
        it('Maps checking with zoom in datalabel and marker', (done: Function) => {
            maps.loaded = () => {
                tempElement = getElement('maps-animation_Zooming_ToolBar_ZoomIn_Rect');
                let eventObj: Object = {
                    target: tempElement,
                    type: 'touchstart',
                    stopImmediatePropagation: (): void => { },
                    pageX: tempElement.getBoundingClientRect().left,
                    pageY: tempElement.getBoundingClientRect().top
                };
                maps.zoomModule.performToolBarAction(<PointerEvent>eventObj);
                setTimeout(() => {
                    layerG = <HTMLElement>getIdElement('maps-animation_LayerIndex_0_Polygon_Group');
                    transform = layerG.getAttribute('transform').split(' ');
                    scale = Number(transform[1]);
                    tempX = Number(transform[4]);
                    tempY = Number(transform[5]);
                    expect(maps.scale >= 1).toBe(true);
                    expect(tempX >= maps.translatePoint.x).toBe(true);
                    expect(tempY >= maps.translatePoint.y).toBe(true);
                    done();
                }, 200);
            };
            maps.layers[0].dataLabelSettings.template = '';
            maps.layers[1].markerSettings[0].template = null;
            maps.refresh();
        });
    });
});