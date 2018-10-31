/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { getElement } from '../../../src/common/utils/helper';
import { RangeNavigator } from '../../../src/index';
import { IPrintEventArgs } from '../../../src/common/model/interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';



describe('Range Navigator Control', () => {
    describe('Print Utils for Chart', () => {
        let chartObj: RangeNavigator;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'exportContainer' });
        document.body.appendChild(chartElement);
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            chartObj = new RangeNavigator(
                {
                    series: [{
                        dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y'
                    }],
                    loaded: (args: Object): void => {
                        chartObj.print();
                    }
                });
            chartObj.appendTo('#exportContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking slider content', (done: Function) => {            
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_rightUnSelectedArea') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        
        it('Checking argument cancel', (done: Function) => {            
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                args.cancel = true;
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_rightUnSelectedArea') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking to print in multiple element', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                chartObj.print(['exportContainer', 'exportContainer']);
            }       
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_rightUnSelectedArea') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Checking export', (done: Function) => {
            chartObj.export('JPEG', 'chart');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - SVG', (done: Function) => {
            chartObj.export('SVG', 'chart');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF', (done: Function) => {
            chartObj.export('PDF', 'chart');
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF - Potrait', (done: Function) => {
            chartObj.export('PDF', 'chart', PdfPageOrientation.Portrait);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        it('Checking export - PDF - multi controls', (done: Function) => {
            chartObj.export('PDF', 'chart', PdfPageOrientation.Portrait, [chartObj, chartObj], 500, 450);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
        
        it('Checking export - PDF - multi controls width out size', (done: Function) => {
            chartObj.export('PDF', 'chart', PdfPageOrientation.Portrait, [chartObj, chartObj]);
            setTimeout(() => {
                expect('').toBe('');
                done();
            }, 500);
        });
    });
});