import { Maps, ILoadedEventArgs, ITouches } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { World_Map, usMap, CustomPathData, flightRoutes, intermediatestops1 } from '../data/data.spec';
import { MouseEvents } from '../../../spec/maps/base/events.spec';
import { Zoom, Bubble, Marker, Annotations } from '../../../src/maps/index';
import { getElementByID } from '../layers/colormapping.spec';
import { electiondata, randomcountriesData } from '../data/us-data.spec';
import { Point } from '../../../src/maps/utils/helper';
Maps.Inject(Zoom, Marker, Bubble, Annotations);

let MapData: Object = World_Map;
describe('Zoom feature tesing for map control', () => {
    describe('Checking tool bar zooming', () => {
        let id: string = 'container';
        let map: Maps;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let template: string = '<script id=template type="text/x-template"><div id="tool">80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        let annotationDiv: HTMLElement = createElement('div', { id: 'annotation', innerHTML: 'Map' });
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

        it('Checking annotation element', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>'
            }];
            map.refresh();
        });

        it('Checking annotation without specifying div element', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '#annotation'
            }];
            map.refresh();
        });

        it('Checking annotation with percentage value', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                x: '50%',
                y: '50%'
            }];
            map.refresh();
        });

        it('Checking annotation with near alignment in both orientation', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                verticalAlignment: 'Near',
                horizontalAlignment: 'Near'
            }];
            map.refresh();
        });

        it('Checking annotation with Center alignment in both orientation', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                verticalAlignment: 'Center',
                horizontalAlignment: 'Center'
            }];
            map.refresh();
        });

        it('Checking annotation with Far alignment in both orientation', (): void => {
            map.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(map.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            map.annotations = [{
                content: '<div><img src="http://js.syncfusion.com/demos/web/Images/map/pin.png" style="height:30px;width:30px;"></img></div>',
                verticalAlignment: 'Far',
                horizontalAlignment: 'Far'
            }];
            map.refresh();
        });

    });
});