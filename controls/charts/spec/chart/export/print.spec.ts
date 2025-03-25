/**
 * Specifies the print spec.
 */
import { Browser, createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { ChartAnnotation } from '../../../src/chart/annotation/annotation';
import { DataLabel } from '../../../src/chart/series/data-label';
import { unbindResizeEvents } from '../base/data.spec';
import { IPrintEventArgs } from '../../../src/chart/model/chart-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { Export} from '../../../src/chart/print-export/export';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { IExportEventArgs } from '../../../src/common/model/interface';
Chart.Inject(DataLabel, ColumnSeries, ChartAnnotation, Legend, Export);



describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Print Utils for Chart', () => {
        let chartObj: Chart;
        let element: Element;
        let chartElement: Element;
        let temp: Element;
        chartElement = createElement('div', { id: 'container' });
        temp = createElement('div', { id: 'tempElement' });
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'print_template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<div id='templateWrap' style='background-color:#4472c4;border-radius: 3px;'>" +
                "<img src='../base/spec/img/img1.jpg' style='border-radius: 0px;width: 24px;height: 24px;padding: 2px;' />" +
                "<div style='color:white;float: right;padding: 2px;line-height: 20px; text-align: center; font-family:Roboto; font-style: medium; fontp-size:14px;'><span>Print</span></div></div>";
            document.body.appendChild(chartElement);
            document.body.appendChild(temp);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeries', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y',
                        type: 'Column', fill: 'rgba(135,206,235,1)',
                        marker: { visible: true }
                    }],
                    width: '800',
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    enableExport: true,
                    annotations: [{
                        content: '#print_template',
                        region: 'Series',
                        x: '50%',
                        y: '50%'
                    }],
                    loaded: (args: Object): void => {
                        chartObj.print();
                    }
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
            temp.remove();
            remove(document.getElementById('template'));
            remove(document.getElementById('template1'));
        });

        it('Checking annotation content', (done: Function) => {
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container_Annotation_0"') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking data label content', (done: Function) => {
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container_Series_0_DataLabel_0"') > -1).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.series[0].marker.dataLabel.template = '#print_template';
            chartObj.refresh();
        });

        it('Checking legend content', (done: Function) => {
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<g id="container_chart_legend_g">') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking argument cancel', (done: Function) => {
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                args.cancel = true;
                expect(args.htmlContent.outerHTML.indexOf('<div id="container_Annotation_0"') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking annotation style', (done: Function) => {
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('style="background-color:#4472c4;border-radius: 3px;"') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking to print in multiple element', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                chartObj.print(['container', 'tempElement']);
            }
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('tempElement') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });

        it('Checking to print direct element', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                chartObj.print(document.getElementById('container'));
            }
            chartObj.beforePrint = (args: IPrintEventArgs): void => {
                expect(args.htmlContent.outerHTML.indexOf('<div id="container_Annotation_0"') > -1).toBe(true);
                done();
            };
            chartObj.refresh();
        });
        it('Checking a PDF', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('PDF', 'Chart');
            chartObj.refresh();
        });
        it('Checking a CSV Export ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('CSV', 'Chart');
            chartObj.refresh();
        });
        it('Checking a JPEG export', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('JPEG', 'Chart');
            chartObj.refresh();
        });
        it('Checking a Print', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('Print', 'Chart');
            chartObj.refresh();
        });
        it('Checking a PNG Export ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('PNG', 'Chart');
            chartObj.refresh();
        });
        it('Checking a SVG export', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('SVG', 'Chart');
            chartObj.refresh();
        });
        it('Export: Checking a JPEG export with browser', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('JPEG', 'Chart');
            chartObj.refresh();
        });
        it('Checking a XLSX export', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.export('XLSX', '');
            chartObj.refresh();
            Browser.info.name = 'msie';
        });
        it('Export: Checking a PDF with browser ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            Browser.info.name = 'msie';
            chartObj.export('PDF', 'Chart');
            chartObj.refresh();
        });
        it('Export: Checking a CSV Export with browser ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            Browser.info.name = 'msie';
            chartObj.export('CSV', 'Chart');
            chartObj.refresh();
        });
        it('Export: Checking a XLSX export with browser', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            Browser.info.name = 'msie';
            chartObj.export('XLSX', '');
            chartObj.width = '85%';
            chartObj.refresh();
        });
        it('Export: Checking a PDF with vertical ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            Browser.info.name = 'msie';
            const header = {
                content: 'Chart Header',
                fontSize: 15
            };
        
            const footer = {
                content: 'Chart Footer',
                fontSize: 15,
            };
            chartObj.exportModule.export('PDF', 'Chart', 1, [chartObj], 80, null, true, header, footer, true);
            chartObj.refresh();
        });
        it('Export: Checking a PDF with vertical wit event ', (): void => {
            chartObj.loaded = (args: Object): void => {
                element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.beforeExport = (args: IExportEventArgs): void => {
                args.cancel = true;
            }
            chartObj.exportModule.export('PDF', 'Chart');
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