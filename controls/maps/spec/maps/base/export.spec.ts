/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Maps, ILoadedEventArgs, DataLabel } from '../../../src/index';
import { usMap } from '../../maps/data/data.spec';
import { IPrintEventArgs } from '../../../src/maps/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { beforePrint } from '../../../src/maps/model/constants';
import { Legend, Annotations } from '../../../src/maps/index';
import { profile, inMB, getMemoryProfile } from '../common.spec';
Maps.Inject(Legend, Annotations, DataLabel);
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Map layer testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' Map layer testing', () => {
        let mapObj: Maps;
        let mapElement: Element;
        let temp: Element;
        mapElement = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='./img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            document.body.appendChild(mapElement);
            document.body.appendChild(temp);
            mapObj = new Maps({
                layers: [{
                    shapeSettings: {
                        fill: '#C3E6ED',
                    },
                    dataLabelSettings: {
                        visible: true,
                        labelPath: 'name',
                    },
                    shapeData: usMap,
                },
                ],
                annotations: [{
                    content: '#template',
                    x: '50%',
                    y: '50%'
                }],
                loaded: (args: Object): void => {
                    mapObj.print();
                }
            });
            mapObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            mapObj.destroy();
        });
        it(' checking a print', (done: Function) => {
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps e-lib" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
                done();
            };
            mapObj.print();
        });
        it('Checking a PDF', (): void => {
            mapObj.loaded = (args: ILoadedEventArgs): void => {
                let element: Element = document.getElementById(mapObj.element.id + '_Annotations_Group');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            mapObj.export('PDF', 'Map');
            mapObj.refresh();
        });
        it('Checking argument cancel', (done: Function) => {
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                args.cancel = true;
                expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps e-lib" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
                done();
            };
            mapObj.print();
            mapObj.refresh();
        });
        it('Checking to print in multiple element', (done: Function) => {
            mapObj.loaded = (args: Object): void => {
                mapObj.print(['container', 'tempElement']);
            };
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            mapObj.refresh();
        });
        it('Checking annotation style', (done: Function) => {
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('style="background-color:#4472c4;border-radius: 3px;"') > -1).toBe(true);
                done();
            };
            mapObj.refresh();
        });
        it('Checking to print direct element', (done: Function) => {
            mapObj.loaded = (args: Object): void => {
                mapObj.print(document.getElementById('container'));
            };
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-maps e-lib" aria-label="Maps Element" tabindex="1"') > -1).toBe(true);
                done();
            };
            mapObj.refresh();
        });
        it('Checking to print single element', (done: Function) => {
            mapObj.loaded = (args: Object): void => {
                mapObj.print('tempElement');
            };
            mapObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                done();
            };
            mapObj.refresh();
        });
        it('Checking export', (done: Function) => {
            mapObj.export('JPEG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            mapObj.export('SVG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            mapObj.export('PDF', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            mapObj.export('PDF', 'map', PdfPageOrientation.Portrait);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking to return base64 for png', (done: Function) => {
            mapObj.export('PNG', 'map', PdfPageOrientation.Portrait, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking to return base64 for SVG', (done: Function) => {
            mapObj.export('SVG', 'map', PdfPageOrientation.Portrait, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking to return base64 for PDF', (done: Function) => {
            mapObj.export('PDF', 'map', PdfPageOrientation.Portrait, false);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    describe('Map Tile layer testing', () => {
        let mapObj: Maps;
        let mapElement: Element;
        let temp: Element;
        mapElement = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='./img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            document.body.appendChild(mapElement);
            document.body.appendChild(temp);
            mapObj = new Maps({
                zoomSettings: {
                    enable: true
                },
                titleSettings: {
                    text: 'Open Street Map',
                    textStyle: {
                        size: '13px'
                    }
                },
                layers: [{
                    layerType: 'OSM',
                    markerSettings: [
                        {
                            visible: true,
                            dataSource: [
                                { latitude: 37.6276571, longitude: -122.4276688, name: 'San Bruno' },
                                { latitude: 33.5302186, longitude: -117.7418381, name: 'Laguna Niguel' },
                            ],
                            shape: 'Circle', height: 20, width: 20,
                            animationDuration: 0
                        },
                    ]
                },
                {
                    type: 'SubLayer',
                    shapeData: usMap
                }
                ],
            });
            mapObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            mapObj.destroy();
        });
        it('Checking export for Tile map - SVG', (done: Function) => {
            mapObj.export('SVG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export for Tile map - PNG', (done: Function) => {
            mapObj.export('PNG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export for Tile map - JPEG', (done: Function) => {
            mapObj.export('JPEG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export to base64 for Tile map - JPEG', (done: Function) => {
            mapObj.export('JPEG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export for Tile map - JPEG', (done: Function) => {
            mapObj.export('PDF', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export base64 for Tile map - JPEG', (done: Function) => {
            mapObj.export('PDF', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});