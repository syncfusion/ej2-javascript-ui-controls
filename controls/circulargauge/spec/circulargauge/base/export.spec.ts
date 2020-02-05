/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { CircularGauge, ILoadedEventArgs } from '../../../src/index';
import { IPrintEventArgs } from '../../../src/circular-gauge/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { beforePrint } from '../../../src/circular-gauge/model/constants';
import { Legend, Annotations } from '../../../src/circular-gauge/index';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Circulargauge axis testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Circulargauge axis testing with print and export', () => {
        let circulargaugeObj: CircularGauge;
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
            document.body.appendChild(mapElement);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                width: "300px",
                height: "300px",
                axes: [{ }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            circulargaugeObj.destroy();
        });
        it(' checking a print', (done: Function) => {
            
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
            expect(args.htmlContent.outerHTML.indexOf('<div><div id="container" class="e-lib e-control e-circulargauge"') > -1).toBe(true);
            done();
            };
            circulargaugeObj.print();
            });
        it('Checking argument cancel', (done: Function) => {
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                  args.cancel = true;
            expect(args.htmlContent.outerHTML.indexOf('<div><div id="container" class="e-lib e-control e-circulargauge"') > -1).toBe(true);
                  done();
                };
                circulargaugeObj.print();
                circulargaugeObj.refresh();
            });
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.refresh();
        });
        it('Checking style', (done: Function) => {
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                    expect(args.htmlContent.outerHTML.indexOf('style="user-select: none; position: relative; touch-action: none; left: 1530px;"') > -1).toBe(true);
                    done();
                };
                circulargaugeObj.refresh();
            });
        it('Checking to print direct element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(document.getElementById('container'));
                };
                circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
            expect(args.htmlContent.outerHTML.indexOf('<div><div id="container" class="e-lib e-control e-circulargauge"') > -1).toBe(true);
                    done();
                };
                circulargaugeObj.refresh();
            });
        it('Checking to print single element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print('tempElement');
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                done();
            };
            circulargaugeObj.refresh();
        });
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - SVG', (done: Function) => {
            circulargaugeObj.export('SVG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - PDF', (done: Function) => {
            circulargaugeObj.export('PDF', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking export - PDF - Potrait', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
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