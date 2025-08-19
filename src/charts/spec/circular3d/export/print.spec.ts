/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChart3DExportEventArgs, CircularChart3DLoadedEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { removeElement } from '@syncfusion/ej2-svg-base';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChartSelection3D } from '../../../src/circularchart3d/user-interaction/selection';
import { CircularChartHighlight3D} from '../../../src/circularchart3d/user-interaction/high-light';
import { CircularChartTooltip3D } from '../../../src/circularchart3d/user-interaction/tooltip';
import { CircularChartExport3D } from '../../../src/circularchart3d/print-export/export';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D, CircularChartSelection3D, CircularChartLegend3D, 
                       CircularChartHighlight3D, CircularChartTooltip3D, CircularChartExport3D);

const categoryData1: Object[] = [
    { x: 'USA', y: 70 }, { x: 'China', y: 60 },
    { x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
    { x: 'France', y: 45 }, { x: 'Germany', y: 30 },
    { x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 },
    { x: 'India', y: 45 }, { x: 'Pakistan', y: 30 },
    { x: 'America', y: 35 }, { x: 'Afghanistan', y: 25 }];

describe('Circular3D Chart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/tslint/config, @typescript-eslint/no-explicit-any
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
        let ele: HTMLElement;
        const id: string = 'pie';
        let element: Element;
        const highlight: string = id + '_ej2_chart_highlight_series_';
        let circular3D: CircularChart3D;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            circular3D = new CircularChart3D({
                series: [
                    {
                        dataSource: categoryData1,
                        xName: 'x',
                        yName: 'y',
                        animation: { enable: false },
                        innerRadius: '0%',
                        dataLabel: {
                            visible: true, name: 'data', position: 'Inside',
                            border: { width: 1, color: 'violet' },
                            connectorStyle: { length: '10%' }
                        },
                        explode: false
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }, enableExport: true
            });
            circular3D.appendTo('#' + id);
        });

        afterAll((): void => {
            circular3D.destroy();
            ele.remove();
        });
        it('Checking a PDF with circular3d', (): void => {
            circular3D.afterExport = (args: CircularChart3DExportEventArgs): void => {
                args.cancel = false;
            };
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
                element = document.getElementById('pie-svg-chart-3d');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            circular3D.export('PDF', 'Chart');
            circular3D.refresh();
        });
        it('Checking a pdfExport with circular3d', (): void => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
                element = document.getElementById('pie-svg-chart-3d');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            circular3D.pdfExport('Chart');
            circular3D.refresh();
        });
        it('Checking a pdfExport with circular3d', (): void => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
                const element: Element = document.getElementById('pie-svg-chart-3d');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            circular3D.pdfExport('Chart', 0, [circular3D]);
            circular3D.refresh();
        });
        it('Checking a PDF with circular3d with event', (): void => {
            circular3D.beforeExport = (args: CircularChart3DExportEventArgs): void => {
                args.cancel = true;
            };
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
                element = document.getElementById('pie-svg-chart-3d');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            circular3D.export('PDF', 'Chart');
            circular3D.refresh();
        });
        it('Checking a pdfExport with circular3d with event', (): void => {
            circular3D.beforeExport = (args: CircularChart3DExportEventArgs): void => {
                args.cancel = true;
            };
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
                element = document.getElementById('pie-svg-chart-3d');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            circular3D.pdfExport('Chart');
            circular3D.refresh();
        });
    it('Checking a pdfExport with circular3d with event', (): void => {
        circular3D.beforePrint = (args: CircularChart3DExportEventArgs): void => {
            args.cancel = true;
        };
        circular3D.loaded = (args: CircularChart3DLoadedEventArgs): void => {
            element = document.getElementById('pie-svg-chart-3d');
            expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            args.chart.chartMouseLeave(<PointerEvent>trigger.onTouchEnd(element, 100, 100, 100, 100, 100, 100));
        };
        circular3D.print();
        circular3D.title = 'Print';
        circular3D.subTitle = 'Print';
        circular3D.titleStyle.textAlignment = 'Far';
        circular3D.series[0].animation = { enable: true, duration: 0 };
        circular3D.refresh();
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
