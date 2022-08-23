/**
 * Specifies the print spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { getElement } from '../../../src/common/utils/helper';
import { RangeNavigator } from '../../../src/index';
import { IPrintEventArgs } from '../../../src/chart/model/chart-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';


describe('Range Navigator Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});