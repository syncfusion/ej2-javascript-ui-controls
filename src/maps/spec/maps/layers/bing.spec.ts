/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs, ILoadEventArgs, BingMap } from '../../../src/index';
import { createElement, remove } from '@syncfusion/ej2-base';

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0","t1","t2","t3"];
let zoomMax: string = "21";
describe('Map layer testing', () => {
    describe('Bing Map layer testing', () => {
        let id: string = 'bing-map';
        let bingmap: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            bingmap = new Maps({
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
            bingmap.destroy();
        });
        it('Bing Map basic testing spec', (done: Function) => {
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                expect(spec.childNodes.length).toBe(4);
                expect((spec.childNodes[3] as HTMLDivElement).innerHTML.indexOf('<img ') > -1).toBe(true);
                expect(spec.childNodes[0].childNodes.length).toBe(1);
                let size: ClientRect = (spec.childNodes[0].childNodes[0] as Element).getBoundingClientRect();
                expect(size.height).toBe(256);
                expect(size.width).toBe(256);
                done();
            };
            bingmap.layers[0].layerType = 'Bing';
            bingmap.refresh();

        });
        it('Bing Map AJAX spec', (done: Function) => {            
            bingmap.layers[0].layerType = 'Bing';
            bingmap.refresh();
            done();
        });
        it('Bing Map Aerial type testing spec', (done: Function) => {
            spec = getElementByID(id + '_tile_parent');
            let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
            expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
            done();
        });
        it('Bing Map AerialWithLabel type testing spec', (done: Function) => {
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
                expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
                done();
            };
            bingmap.layers[0].bingMapType = 'AerialWithLabel';
            bingmap.refresh();
        });
        it('Bing Map Road type testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
                expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
                done();
            };
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            bingmap.layers[0].bingMapType = 'Road';
            bingmap.refresh();
        });
        it('Bing Map Zoom level 2 testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec.childNodes.length).toBe(4);
                done();
            };
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            ele.setAttribute('style', 'height: 2048px; width: 2048px;');
            bingmap.zoomSettings.zoomFactor = 2;
            bingmap.refresh();
        });
        it('Bing Map Zoom level 3 testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec.childNodes.length).toBe(4);
                done();
            };
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            bingmap.zoomSettings.zoomFactor = 3;
            bingmap.refresh();
        });
        it('Bing Map sublayer testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec.childNodes.length).toBe(8);
                done();
            };
            bingmap.load = (args: ILoadEventArgs) =>{                
                let bing: BingMap = new BingMap(bingmap);
                bing.imageUrl = imageUrl;
                bing.maxZoom = zoomMax;
                bing.subDomains = subDomains;
                bingmap.mapLayerPanel["bing"] = bing;
            };
            bingmap.zoomSettings.zoomFactor = 1;
            bingmap.layers = [
                {
                    layerType: 'Bing'
                },
                {
                    layerType: 'Bing',
                    type: 'SubLayer'
                }
            ];
            ele.setAttribute('style', 'height: 512px; width: 512px;');
            bingmap.refresh();
        });
    });
    describe('OSM Map layer testing', () => {
        let id: string = 'osm-map';
        let osm: Maps;
        let ele: HTMLDivElement;
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            osm = new Maps({
                layers: [
                    {
                        layerType: 'OSM',
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            osm.destroy();
        });
        it('OSM Map basic testing spec', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                expect(spec.childNodes.length).toBe(4);
                expect((spec.childNodes[3] as HTMLDivElement).innerHTML.indexOf('<img ') > -1).toBe(true);
                expect(spec.childNodes[0].childNodes.length).toBe(1);
                let size: ClientRect = (spec.childNodes[0].childNodes[0] as Element).getBoundingClientRect();
                expect(size.height).toBe(256);
                expect(size.width).toBe(256);
                done();
            };
            osm.layers[0].layerType = 'OSM';
            osm.refresh();
        });
        it('OSM Map Zoom level 3 testing spec', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec.childNodes.length).toBe(4);
                done();
            };
            ele.setAttribute('style', 'height: 2048px; width: 2048px;');
            osm.zoomSettings.zoomFactor = 3;
            osm.refresh();
        });
        it('OSM Map sublayer testing spec', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec.childNodes.length).toBe(8);
                done();
            };
            osm.zoomSettings.zoomFactor = 1;
            osm.layers = [
                {
                    layerType: 'OSM'
                },
                {
                    layerType: 'OSM',
                    type: 'SubLayer'
                }
            ];
            ele.setAttribute('style', 'height: 512px; width: 512px;');
            osm.refresh();
        });
    });
});
