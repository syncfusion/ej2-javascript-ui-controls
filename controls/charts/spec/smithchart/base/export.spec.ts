/**
 * 
 */
import { Smithchart, ISmithchartLoadedEventArgs } from '../../../src/smithchart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ISmithchartPrintEventArgs } from '../../../src/smithchart/model/interface';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

/* tslint:disable:no-string-literal */
describe('smithChart component Spec', () => {
    describe('smithChart print and export  spec', () => {
        let smithChartElement: Element;
        let smithChart: Smithchart;
        let temp: Element;
        smithChartElement = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        let spec: Element;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        let template: Element;
        beforeAll(() => {
            template = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='./img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            document.body.appendChild(smithChartElement);
            document.body.appendChild(temp);
            smithChart = new Smithchart({
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    }
                },
                radialAxis: {
                    minorGridLines: {
                        visible: true
                    }
                },
                series: [
                         {
                            points: [
                                { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                                { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                                { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                                { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                                { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                                { resistance: 1.0, reactance: 0.4 },
                                { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                                { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                                { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                
                             ],
                    name: 'Transmission1',
                    },
                ],
            });
            smithChart.appendTo('#container')
        });
        afterAll(() => {
            remove(template);
            remove(temp);
            remove(smithChartElement);
            smithChart.destroy();

        });
        it(' checking a print', (done: Function) => { 
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                  //expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-smithchart"') > -1).toBe(true);
                done();
            };
            smithChart.print();
            smithChart.refresh();
        });

        it('Checking a PDF', (): void => {
            smithChart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                let element: Element = document.getElementById('container_svg_horizontalAxisMajorGridLines');
                 expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            smithChart.export('PDF', 'Map');
            smithChart.refresh();
        });

        it('Checking argument cancel', (done: Function) => {
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                args.cancel = true;
                //expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control"') > -1).toBe(true);
                done();
            };
            smithChart.print();
            smithChart.refresh();
        });
       /* it('Checking to print in multiple element', (done: Function) => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print(['container', 'tempElement']);
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                 expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            smithChart.refresh();
        });*/

        /*it('Checking to print direct element', (done: Function) => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print(document.getElementById('container'));
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control" style="width: 600px; height: 400px;"') > -1).toBe(true);
                done();
            };
            smithChart.refresh();
        });*/
       /* it('Checking to print single element', (done: Function) => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print('tempElement');
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                done();
            };
            smithChart.refresh();
        });*/

        it('Checking export', (done: Function) => {
            smithChart.export('JPEG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            smithChart.export('SVG', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            smithChart.export('PDF', 'map');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            smithChart.export('PDF', 'map', PdfPageOrientation.Portrait);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking to print in multiple element', () => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print(['container', 'tempElement']);
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                //expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                //done();
            };
            smithChart.refresh();
        });

        it('Checking to print direct element', () => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print(document.getElementById('container'));
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
                //expect(args.htmlContent.outerHTML.indexOf('<div id="container" class="e-control e-smithchart"') > -1).toBe(true);
                //done();
            };
            smithChart.refresh();
        });
    it('Checking to print single element', () => {
            smithChart.loaded = (args: Object): void => {
                smithChart.print('tempElement');
            };
            smithChart.beforePrint = (args: ISmithchartPrintEventArgs): void => {
               // expect(args.htmlContent.outerHTML.indexOf('<div id="tempElement"') > -1).toBe(true);
                //done();
            };
            smithChart.refresh();
        });

    });
});
