/**
 * Bing map layer testing
 */
import { Maps, ILoadedEventArgs, ILoadEventArgs, BingMap } from '../../../src/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { createElement, remove } from '@syncfusion/ej2-base';

export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
let imageUrl: string = "http:\/\/ecn.{subdomain}.tiles.virtualearth.net\/tiles\/a{quadkey}.jpeg?g=6465";
let subDomains: string[] = ["t0", "t1", "t2", "t3"];
let zoomMax: string = "21";
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
                        urlTemplate: 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=14527'
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            bingmap.destroy();
        });
        it('Bing Map basic testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(6);
                // expect((spec.childNodes[3] as HTMLDivElement).innerHTML.indexOf('<img ') > -1).toBe(true);
                // expect(spec.childNodes[0].childNodes.length).toBe(1);
                // let size: ClientRect = (spec.childNodes[0].childNodes[0] as Element).getBoundingClientRect();
                // expect(size.height).toBe(256);
                // expect(size.width).toBe(256);
                done();
            };
            bingmap.refresh();

        });
        it('Bing Map AJAX spec', (done: Function) => {
            bingmap.refresh();
            done();
        });
        it('Bing Map Aerial type testing spec', (done: Function) => {
            spec = getElementByID(id + '_tile_parent');
            expect(spec).not.toBe(null);
            // let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
            // expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
            done();
        });
        it('Bing Map AerialWithLabel type testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
                // expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
                done();
            };
            bingmap.layers[0].urlTemplate = 'https://{subdomain}.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=A,G,L&og=2489&n=z';
            bingmap.refresh();
        });
        it('Bing Map Road type testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // let img: Element = (spec.childNodes[0].childNodes[0].childNodes[0] as HTMLImageElement);
                // expect(img.getAttribute('src').indexOf('virtualearth') > -1).toBe(true);
                done();
            };
            bingmap.layers[0].urlTemplate = 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=14527&mkt={culture}&shading=hill';
            bingmap.refresh();
        });
        it('Bing Map Zoom level 2 testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(36);
                done();
            };
            ele.setAttribute('style', 'height: 2048px; width: 2048px;');
            bingmap.zoomSettings.zoomFactor = 2;
            bingmap.refresh();
        });
        it('Bing Map Zoom level 3 testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(72);
                done();
            };
            bingmap.zoomSettings.zoomFactor = 3;
            bingmap.refresh();
        });
        it('Bing Map sublayer testing spec', (done: Function) => {
            bingmap.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(18);
                done();
            };
            bingmap.zoomSettings.zoomFactor = 1;
            bingmap.layers = [
                {
                    urlTemplate: 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=14527'
                },
                {
                    type: 'SubLayer',
                    urlTemplate: 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=14527'
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
                        urlTemplate: 'https://a.tile.openstreetmap.org/level/tileX/tileY.png',
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
                // expect(spec.childNodes.length).toBe(6);
                // expect((spec.childNodes[3] as HTMLDivElement).innerHTML.indexOf('<img ') > -1).toBe(true);
                // expect(spec.childNodes[0].childNodes.length).toBe(1);
                // let size: ClientRect = (spec.childNodes[0].childNodes[0] as Element).getBoundingClientRect();
                // expect(size.height).toBe(256);
                // expect(size.width).toBe(256);
                done();
            };
            osm.layers[0].urlTemplate = 'https://a.tile.openstreetmap.org/level/tileX/tileY.png';
            osm.refresh();
        });
        it('OSM Map Zoom level 3 testing spec', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(72);
                done();
            };
            ele.setAttribute('style', 'height: 2048px; width: 2048px;');
            osm.zoomSettings.zoomFactor = 3;
            osm.refresh();
        });
        it('OSM Map sublayer testing spec', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                // expect(spec.childNodes.length).toBe(18);
                done();
            };
            osm.zoomSettings.zoomFactor = 1;
            osm.layers = [
                {
                    urlTemplate: 'https://a.tile.openstreetmap.org/level/tileX/tileY.png'
                },
                {
                    urlTemplate: 'https://a.tile.openstreetmap.org/level/tileX/tileY.png',
                    type: 'SubLayer'
                }
            ];
            ele.setAttribute('style', 'height: 512px; width: 512px;');
            osm.refresh();
        });
        it('bing map url template', (done: Function) => {
            osm.loaded = (args: ILoadedEventArgs) => {
                spec = getElementByID(id + '_tile_parent');
                expect(spec).not.toBe(null);
                done();
            };
            osm.zoomSettings.zoomFactor = 1;
            osm.layers = [
                {
                    urlTemplate: 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=12305',
                },
            ];
            ele.setAttribute('style', 'height: 512px; width: 512px;');
            osm.refresh();
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
