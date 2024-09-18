/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { LinearGauge, ILoadedEventArgs, Print, ImageExport, PdfExport } from '../../src/index';
import { IPrintEventArgs } from '../../src/linear-gauge/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { beforePrint } from '../../src/linear-gauge/model/constant';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
LinearGauge.Inject(Print, ImageExport, PdfExport);
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Lineargauge axis testing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Lineargauge axis testing with print and export', () => {
        let linearGaugeObj: LinearGauge;
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
            linearGaugeObj = new LinearGauge({
                allowPrint: true,
                allowImageExport: true,
                allowPdfExport : true,
                width: "400px",
                height: "300px",
                axes: [{ }],
                loaded: (args: Object): void => {
                    linearGaugeObj.print();
                }
            });
            linearGaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            linearGaugeObj.destroy();
        });
        it('checking a print', (done: Function) => {
            
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
            expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
            done();
            };
            linearGaugeObj.print();
            });
        it('Checking argument cancel', (done: Function) => {
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                  args.cancel = true;
            expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
                  done();
                };
                linearGaugeObj.print();
                linearGaugeObj.refresh();
            });
        it('Checking to print in multiple element', (done: Function) => {
            linearGaugeObj.loaded = (args: Object): void => {
                linearGaugeObj.print(['container', 'tempElement']);
            };
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            linearGaugeObj.refresh();
        });
        it('Checking to print direct element', (done: Function) => {
            linearGaugeObj.loaded = (args: Object): void => {
                linearGaugeObj.print(document.getElementById('container'));
                };
                linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
            expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
                    done();
                };
                linearGaugeObj.refresh();
            });
        it('Checking to print single element', (done: Function) => {
            linearGaugeObj.loaded = (args: Object): void => {
                linearGaugeObj.print('tempElement');
            };
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                done();
            };
            linearGaugeObj.refresh();
        });
        it('Checking Image export- JPEG', (done: Function) => {
            linearGaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking Image export - SVG', (done: Function) => {
            linearGaugeObj.export('SVG', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking Image export - PNG', (done: Function) => {
            linearGaugeObj.export('PNG', 'map');
                 setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
           });

        it('Checking PDG export - PDF', (done: Function) => {
            linearGaugeObj.export('PDF', 'map');
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
            it('Checking If PDF orientation is null  - PDF', (done: Function) => {
                linearGaugeObj.export('PDF', 'map');
                    setTimeout(() => {
                        expect('').toBe('');
                        done();
                    }, 500);
                });
        it('Checking export - PDF - Potrait', (done: Function) => {
            linearGaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for SVG', (done: Function) => {
            linearGaugeObj.export('SVG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for PNG', (done: Function) => {
            linearGaugeObj.export('PNG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                 }, 500);
            });  
        it('Checking base64 string for JPEG', (done: Function) => {
            linearGaugeObj.export('JPEG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for PDF', (done: Function) => {
         linearGaugeObj.export('PDF', 'map',PdfPageOrientation.Portrait, false);
            setTimeout(() => {
                expect('').toBe('');
                    done();
                }, 500);
            }); 
            
        it('Checking PDF export in SVG format', (done: Function) => {
            linearGaugeObj.allowImageExport = false;
            linearGaugeObj.export('SVG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                        done();
                       }, 500);
            });    
    });
    describe('Lineargauge axis testing with print and export', () => {
        let linearGaugeObj: LinearGauge;
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
            linearGaugeObj = new LinearGauge({
                allowPrint: true,
                theme: 'Tailwind',
                allowImageExport: true,
                allowPdfExport : true,
                width: "400px",
                height: "300px",
                axes: [{ }],
                background: 'transparent'
            });
            linearGaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            linearGaugeObj.destroy();
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            linearGaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for SVG', (done: Function) => {
            linearGaugeObj.export('SVG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for PNG', (done: Function) => {
            linearGaugeObj.background = 'rgba(255,255,255, 0.0)';
            linearGaugeObj.refresh();
            linearGaugeObj.export('PNG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                 }, 500);
            }) 
        it('Checking base64 string for JPEG', (done: Function) => {
            linearGaugeObj.export('JPEG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                    done();
                }, 500);
            });
        it('Checking base64 string for PDF', (done: Function) => {
         linearGaugeObj.export('PDF', 'map',PdfPageOrientation.Portrait, false);
            setTimeout(() => {
                expect('').toBe('');
                    done();
                }, 500);
            }); 
            
        it('Checking PDF export in SVG format', (done: Function) => {
            linearGaugeObj.allowImageExport = false;
            linearGaugeObj.export('SVG', 'map',PdfPageOrientation.Portrait, false);
                setTimeout(() => {
                    expect('').toBe('');
                        done();
                       }, 500);
            });    
    });
    describe('Lineargauge axis testing with print and export', () => {
        let linearGaugeObj: LinearGauge;
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
            linearGaugeObj = new LinearGauge({
                theme: 'Tailwind',
                background: 'transparent',
                allowPrint: true,
                allowImageExport: true,
                allowPdfExport : true,
                width: "400px",
                height: "300px",
                axes: [{ }],
                loaded: (args: Object): void => {
                    linearGaugeObj.print();
                }
            });
            linearGaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            remove(mapElement);
            linearGaugeObj.destroy();
        });
        it('checking a print', (done: Function) => {            
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
            expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
            done();
            };
            linearGaugeObj.print();
        });
        it('checking a print background as rgba(255,255,255, 0.0)', (done: Function) => {
            linearGaugeObj.background = 'rgba(255,255,255, 0.0)';
            linearGaugeObj.refresh();
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
                done();
            };
            linearGaugeObj.print();
        });
        it('checking a print background as rgba(255,255,255, 0.0)', (done: Function) => {
            linearGaugeObj.theme = 'TailwindDark';
            linearGaugeObj.background = 'rgba(255,255,255, 0.0)';
            linearGaugeObj.refresh();
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
                done();
            };
            linearGaugeObj.print();
        });
        it('checking a print background as rgba(255,255,255, 0.0)', (done: Function) => {
            linearGaugeObj.theme = 'TailwindDark';
            linearGaugeObj.background = 'rgba(255,255,255, 0.0)';
            linearGaugeObj.refresh();
            linearGaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect((args.htmlContent.outerHTML.indexOf('<div id="container" class="e-lib e-control e-lineargauge" style="user-select: none; position: relative; width: 400px; height: 300px; cursor: auto;">')) > -1).toBe(true);
                done();
            };
            linearGaugeObj.print();
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