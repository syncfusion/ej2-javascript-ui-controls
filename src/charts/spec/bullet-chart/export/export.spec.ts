/**
 * Specifies the print spec.
 */
import { createElement } from '@syncfusion/ej2-base';
import { BulletChart, IBulletLoadedEventArgs } from '../../../src/index';
import { IPrintEventArgs } from '../../../src/chart/model/chart-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';


describe('Bullet Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Print Utils for BulletChart', () => {
        let chartObj: BulletChart;
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
            chartObj = new BulletChart(
                {
                    dataSource: [{ value: 4, target: 4 }],
                    valueField: 'value', targetField: 'target',
                    minimum: 0, maximum: 20, interval: 5,
                    animation: {enable: false},
                    ranges:[{end: 5, color: 'red'}, {end: 15, color: 'yellow'}, {end: 20, color: 'green'}],
                    loaded: (args: IBulletLoadedEventArgs)=>{
                        chartObj.print();
                    }
                });
            chartObj.appendTo('#exportContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking comparative bar content', (done: Function) => {            
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_svg_ComparativeMeasure_0') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        
        it('Checking argument cancel', (done: Function) => {            
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                args.cancel = true;
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_svg_ComparativeMeasure_0') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking to print in multiple element', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                chartObj.print(['exportContainer', 'exportContainer']);
            }       
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('exportContainer_svg_ComparativeMeasure_0') > -1).toBe(true);
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