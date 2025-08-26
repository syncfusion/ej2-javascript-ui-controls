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
import { Print} from '../../../src/circular-gauge/model/print';
import {ImageExport } from '../../../src/circular-gauge/model/image-export';
import {PdfExport } from '../../../src/circular-gauge/model/pdf-export';
CircularGauge.Inject(Print, ImageExport, PdfExport);

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
        let mapElements: Element;
        let tempElement: Element;
        mapElements = createElement('div', { id: 'container' });
        tempElement = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(tempElement);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPrint:true,
                allowPdfExport:true,
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
            remove(mapElements);    
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
            circulargaugeObj.print(['container', 'tempElement']);
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
            circulargaugeObj.export('JPEG', 'map', 1, true);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();
            });
        it('Checking export - SVG', (done: Function) => {
            circulargaugeObj.export('SVG', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            });
        it('Checking export - PDF', (done: Function) => {
            circulargaugeObj.export('PDF', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            });
        it('Checking export - PDF - Potrait', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait, true);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            });
    });

    describe('Testing the print and export with considering orientation and download option', () => {
        let circulargaugeObj: CircularGauge;
        let mapElements: Element;
        let temp: Element;
        mapElements = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPdfExport:true,
                allowPrint:true,
                width: "300px",
                height: "300px",
                axes: [{
                    radius: '80%',
                    startAngle: 230,
                    endAngle: 130,
                    majorTicks: {
                        width: 0
                    },
                    lineStyle: { width: 8, color: '#E0E0E0' },
                    minorTicks: {
                        width: 0
                    },
                    labelStyle: {
                        font: {
                            color: '#424242',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '75%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:6,
                        needleEndWidth:10,
                       cap:
                       {
                           radius:8
                       },
                        needleTail: {
                            length: '25%',
                         
                        }
                      
                    }]
                 }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            circulargaugeObj.destroy();
            remove(mapElements);           
        });
       
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.print(['container', 'tempElement']);
            circulargaugeObj.refresh();
        });             
        
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map',1, false);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();            
            });
        it('Checking export - SVG', (done: Function) => {
            circulargaugeObj.export('SVG', 'map', 1, false);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();        
            });
        it('Checking export - PDF', (done: Function) => {
            circulargaugeObj.export('PNG', 'map',1, false);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();  
            });
        it('Checking export - PDF - Potrait', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();
            });

        it('Checking export - PDF - Potrait', (done: Function) => {
                circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,false);
                let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                    setTimeout(() => {
                        expect(element.getAttribute("height")).toBe("300");
                        done();
                    }, 500);
                circulargaugeObj.refresh();
            });
            it('Checking the height property after export', (done: Function) => {
                circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
                let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                    setTimeout(() => {
                        expect(element.getAttribute("height")).toBe("300");
                        done();
                    }, 500);
                circulargaugeObj.refresh();   
            });
            it('Checking the width property after export', (done: Function) => {
                circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
                let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                    setTimeout(() => {
                        expect(element.getAttribute("width")).toBe("300");
                        done();
                    circulargaugeObj.refresh();
                    }, 500);
            });
            it('Checking the opacity after export', (done: Function) => {
                circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
                let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                    setTimeout(() => {
                        expect(element.getAttribute("opacity")).toBe("null");
                        done();
                    circulargaugeObj.refresh();
                    }, 500);
            });
            it('Checking the Fill Property after export', (done: Function) => {
                circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
                let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                    setTimeout(() => {
                        expect(element.getAttribute("fill")).toBe("#FFFFFF");
                        done();
                    }, 500);
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
                circulargaugeObj.print('tempElement');
                circulargaugeObj.refresh();
            });
          
    });
    describe('Testing the print and export with theme as material3 and background as transparent', () => {
        let circulargaugeObj: CircularGauge;
        let mapElements: Element;
        let temp: Element;
        mapElements = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPdfExport:true,
                background: 'transparent',
                theme: 'Material3',
                allowPrint:true,
                width: "300px",
                height: "300px",
                axes: [{
                    radius: '80%',
                    startAngle: 230,
                    endAngle: 130,
                    majorTicks: {
                        width: 0
                    },
                    lineStyle: { width: 8, color: '#E0E0E0' },
                    minorTicks: {
                        width: 0
                    },
                    labelStyle: {
                        font: {
                            color: '#424242',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '75%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:6,
                        needleEndWidth:10,
                       cap:
                       {
                           radius:8
                       },
                        needleTail: {
                            length: '25%',
                         
                        }
                      
                    }]
                 }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            circulargaugeObj.destroy();
            remove(mapElements);           
        });
       
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.print(['container', 'tempElement']);
            circulargaugeObj.refresh();
        });
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();            
        });
        it('Checking the height property after export', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
            let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                setTimeout(() => {
                    expect(element.getAttribute("height")).toBe("300");
                    done();
                }, 500);
            circulargaugeObj.refresh();   
        });    
    });
    describe('Testing the print and export with theme as material3 and background as rgba(255,255,255, 0.0)', () => {
        let circulargaugeObj: CircularGauge;
        let mapElements: Element;
        let temp: Element;
        mapElements = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPdfExport:true,
                background: 'rgba(255,255,255, 0.0)',
                theme: 'Material3',
                allowPrint:true,
                width: "300px",
                height: "300px",
                axes: [{
                    radius: '80%',
                    startAngle: 230,
                    endAngle: 130,
                    majorTicks: {
                        width: 0
                    },
                    lineStyle: { width: 8, color: '#E0E0E0' },
                    minorTicks: {
                        width: 0
                    },
                    labelStyle: {
                        font: {
                            color: '#424242',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '75%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:6,
                        needleEndWidth:10,
                       cap:
                       {
                           radius:8
                       },
                        needleTail: {
                            length: '25%',
                         
                        }
                      
                    }]
                 }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            circulargaugeObj.destroy();
            remove(mapElements);           
        });
       
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.print(['container', 'tempElement']);
            circulargaugeObj.refresh();
        });
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();            
        });
        it('Checking the height property after export', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
            let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                setTimeout(() => {
                    expect(element.getAttribute("height")).toBe("300");
                    done();
                }, 500);
            circulargaugeObj.refresh();   
        });
    });
    describe('Testing the print and export with theme as material3 and background as transparent', () => {
        let circulargaugeObj: CircularGauge;
        let mapElements: Element;
        let temp: Element;
        mapElements = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPdfExport:true,
                background: 'transparent',
                theme: 'Material3Dark',
                allowPrint:true,
                width: "300px",
                height: "300px",
                axes: [{
                    radius: '80%',
                    startAngle: 230,
                    endAngle: 130,
                    majorTicks: {
                        width: 0
                    },
                    lineStyle: { width: 8, color: '#E0E0E0' },
                    minorTicks: {
                        width: 0
                    },
                    labelStyle: {
                        font: {
                            color: '#424242',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '75%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:6,
                        needleEndWidth:10,
                       cap:
                       {
                           radius:8
                       },
                        needleTail: {
                            length: '25%',
                         
                        }
                      
                    }]
                 }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            circulargaugeObj.destroy();
            remove(mapElements);           
        });
       
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.print(['container', 'tempElement']);
            circulargaugeObj.refresh();
        });
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();            
        });
        it('Checking the height property after export', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
            let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                setTimeout(() => {
                    expect(element.getAttribute("height")).toBe("300");
                    done();
                }, 500);
            circulargaugeObj.refresh();   
        });
    });
    describe('Testing the print and export with theme as material3 and background as rgba(255,255,255, 0.0)', () => {
        let circulargaugeObj: CircularGauge;
        let mapElements: Element;
        let temp: Element;
        mapElements = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            document.body.appendChild(mapElements);
            document.body.appendChild(temp);
            circulargaugeObj = new CircularGauge({
                allowImageExport:true,
                allowPdfExport:true,
                background: 'rgba(255,255,255, 0.0)',
                theme: 'Material3Dark',
                allowPrint:true,
                width: "300px",
                height: "300px",
                axes: [{
                    radius: '80%',
                    startAngle: 230,
                    endAngle: 130,
                    majorTicks: {
                        width: 0
                    },
                    lineStyle: { width: 8, color: '#E0E0E0' },
                    minorTicks: {
                        width: 0
                    },
                    labelStyle: {
                        font: {
                            color: '#424242',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '75%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:6,
                        needleEndWidth:10,
                       cap:
                       {
                           radius:8
                       },
                        needleTail: {
                            length: '25%',
                         
                        }
                      
                    }]
                 }],
                loaded: (args: Object): void => {
                    circulargaugeObj.print();
                }
            });
            circulargaugeObj.appendTo('#container');
        });
        afterAll((): void => {
            circulargaugeObj.destroy();
            remove(mapElements);           
        });
       
        it('Checking to print in multiple element', (done: Function) => {
            circulargaugeObj.loaded = (args: Object): void => {
                circulargaugeObj.print(['container', 'tempElement']);
            };
            circulargaugeObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            circulargaugeObj.print(['container', 'tempElement']);
            circulargaugeObj.refresh();
        });
        it('Checking export', (done: Function) => {
            circulargaugeObj.export('JPEG', 'map');
                setTimeout(() => {
                    expect('').toBe("");
                    done();
                }, 500);
            circulargaugeObj.refresh();            
        });
        it('Checking the height property after export', (done: Function) => {
            circulargaugeObj.export('PDF', 'map', PdfPageOrientation.Portrait,true);
            let element: Element =document.getElementById("container_CircularGaugeBorder");                   
                setTimeout(() => {
                    expect(element.getAttribute("height")).toBe("300");
                    done();
                }, 500);
            circulargaugeObj.refresh();   
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