import { createElement, EmitType } from '@syncfusion/ej2-base';
import { Chart3DLoadedEventArgs, Chart3DLegendClickEventArgs, Chart3DExportEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../base/events.spec';
import { Chart3DSeriesModel } from '../../../src/chart3d/series/chart-series-model';
import { firstSeries, secondSeries, thirdSeries } from '../../chart/base/data.spec';
import { Selection3D } from '../../../src/chart3d/user-interaction/selection';
import { IPrintEventArgs } from '../../../src/chart/model/chart-interface';
import { Export3D } from '../../../src/chart3d/print-export/export';
import { IExportEventArgs } from '../../../src/common/model/interface';

Chart3D.Inject(
    ColumnSeries3D, BarSeries3D, Highlight3D, Legend3D, Selection3D, Export3D
);
let seriesCollection: Chart3DSeriesModel[] = [];
const colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
seriesCollection = [
    {
        name: 'First',
        animation: { enable: false },
        fill: colors[0],
        dataSource: firstSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Second',
        visible: true,
        animation: { enable: false },
        fill: colors[5],
        dataSource: secondSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Third',
        animation: { enable: false },
        fill: colors[8],
        dataSource: thirdSeries, xName: 'x', yName: 'y',
        type: 'Column'
    }
];
describe('3DChart Control Selection ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    const id: string = 'ej2Container';
    const selection: string = id + '_ej2_chart_selection_series_';
    let chartObj: Chart3D;
    let element: HTMLElement;
    let selected: HTMLCollection;
    let i: number = 0;
    let j: number = 0;
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    const trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    const draggedRectGroup: string = id + '_ej2_drag_rect';
    const closeId: string = id + '_ej2_drag_close';
    beforeAll(() => {
        chartContainer = createElement('div', { id: id });
        document.body.appendChild(chartContainer);
        document.body.appendChild(createElement('style', {
            innerHTML: ' .selection { stroke-width: 5; fill: lime; stroke: red; opacity: 1; } '
        }));
        chartObj = new Chart3D({
            series: seriesCollection,
            primaryXAxis: { minimum: 2004, maximum: 2012 },
            //    primaryYAxis: { rangePadding: 'None' },
            height: '500',
            width: '800',
            loaded: loaded,
            selectionMode: 'Point',
            enableExport: true,
            enableSideBySidePlacement: true,
            isMultiSelect: false
        });
        chartObj.appendTo('#' + id);

    });
    afterAll(() => {
        chartObj.destroy();
        chartContainer.remove();
    });
    it('Print', (done: Function) => {
        chartObj.beforePrint = (args: IPrintEventArgs): void => {
            args.cancel = true;
            expect(args.htmlContent.outerHTML.indexOf('<div id="container_Annotation_0"') === -1).toBe(true);
            done();
        };
        chartObj.print();
    });

    it('Checking a PDF', (): void => {
        chartObj.afterExport = (args: Chart3DExportEventArgs): void => {
            args.cancel = false;
        };
        chartObj.loaded = (args: Chart3DLoadedEventArgs): void => {
            let element: Element = document.getElementById('ej2Container-svg-chart-3d');
            expect(element.childElementCount).toBeGreaterThanOrEqual(1);
        };
        chartObj.export('PDF', 'Chart');
        chartObj.refresh();
    });

    it('Checking a pdfExport ', (): void => {
        chartObj.loaded = (args: Chart3DLoadedEventArgs): void => {
            let element: Element = document.getElementById('ej2Container-svg-chart-3d');
            expect(element.childElementCount).toBeGreaterThanOrEqual(1);
        };
        chartObj.export3DModule.pdfExport('Chart');
        chartObj.refresh();
    });
    it('Checking a pdfExport with chart3d', (): void => {
        chartObj.loaded = (args: Chart3DLoadedEventArgs): void => {
            const element: Element = document.getElementById('ej2Container-svg-chart-3d');
            expect(element.childElementCount).toBeGreaterThanOrEqual(1);
        };
        chartObj.export3DModule.pdfExport('Chart', 0, [chartObj]);
        chartObj.refresh();
    });
    it('Checking a pdfExport with export event', (): void => {
        chartObj.loaded = (args: Chart3DLoadedEventArgs): void => {
            const element: Element = document.getElementById('ej2Container');
            expect(element !== null).toBe(true);
        };
        chartObj.beforeExport = (args: IExportEventArgs): void => { args.cancel = true; };
        chartObj.export3DModule.pdfExport('Chart', 0, [chartObj]);
        chartObj.refresh();
    });
    it('Checking chart export with event', (): void => {
        chartObj.loaded = (args: Chart3DLoadedEventArgs): void => {
            const element: Element = document.getElementById('ej2Container');
            expect(element !== null).toBe(true);
            args.chart.animate(0);
        };
        chartObj.beforeExport = (args: IExportEventArgs): void => { args.cancel = true; };
        chartObj.export3DModule.export('PNG', 'chart3d');
        chartObj.refresh();
    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
