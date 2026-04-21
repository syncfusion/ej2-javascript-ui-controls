/* eslint-disable @typescript-eslint/tslint/config */
import { createElement } from '@syncfusion/ej2-base';
import { Sankey, SankeyHighlight, SankeySeries } from '../../src/sankey/index';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';

// IMPORTANT: ExportUtils is used inside SankeyExport. We spy on its prototype methods.
import { ExportUtils } from '../../src/common/utils/export';
import { profile, inMB, getMemoryProfile } from '../common.spec';

Sankey.Inject(SankeyHighlight, SankeyLegend, SankeyTooltip, SankeySeries, SankeyExport);

const nodeData: Array<{ id: string; color?: string }> = [
    { id: 'Solar', color: '#fcd34d' }, { id: 'Wind', color: '#93c5fd' }, { id: 'Hydro', color: '#67e8f9' },
    { id: 'Nuclear', color: '#a5b4fc' }, { id: 'Coal', color: '#d1d5db' }, { id: 'Natural Gas', color: '#fed7aa' },
    { id: 'Oil', color: '#fdba74' }, { id: 'Electricity', color: '#f472b6' }, { id: 'Heat', color: '#fb7185' },
    { id: 'Fuel', color: '#f97316' }, { id: 'Residential', color: '#4ade80' }, { id: 'Commercial', color: '#34d399' },
    { id: 'Industrial', color: '#22c55e' }, { id: 'Transportation', color: '#c084fc' },
    { id: 'Energy Services', color: '#60a5fa' }, { id: 'Losses', color: '#94a3b8' }
];

const linkData: Array<{ sourceId: string; targetId: string; value: number }> = [
    { sourceId: 'Solar', targetId: 'Electricity', value: 100 },
    { sourceId: 'Wind', targetId: 'Electricity', value: 120 },
    { sourceId: 'Hydro', targetId: 'Electricity', value: 80 },
    { sourceId: 'Nuclear', targetId: 'Electricity', value: 90 },
    { sourceId: 'Coal', targetId: 'Electricity', value: 200 },
    { sourceId: 'Natural Gas', targetId: 'Electricity', value: 130 },
    { sourceId: 'Natural Gas', targetId: 'Heat', value: 80 },
    { sourceId: 'Oil', targetId: 'Fuel', value: 250 }
];

describe('Sankey - Print and Export', () => {

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ele: HTMLDivElement;
    let sankey: Sankey;
    let loaded: (args: unknown) => void;

    beforeAll(() => {
        ele = createElement('div', { id: 'container_export' }) as HTMLDivElement;
        document.body.appendChild(ele);

        sankey = new Sankey({
            width: '750',
            height: '450',
            title: 'Energy Flow (Sample)',
            subTitle: 'testing',
            background: 'transparent',
            margin: { left: 20, right: 20, top: 20, bottom: 20 },
            border: { color: '#E0E0E0', width: 1 },
            nodes: nodeData,
            links: linkData,
            linkStyle: { opacity: 0.5, curvature: 0.55 },
            nodeStyle: { width: 25, padding: 5, opacity: 1, stroke: 'Black', strokeWidth: 1 },
            tooltip: { enable: true },
            legendSettings: { visible: true },
            theme: 'Fabric',
            enableExport: true
        }, '#container_export');

        sankey.appendTo('#container_export');
    });

    afterAll((): void => {
        sankey.destroy();
        ele.remove();
    });

    it('Print should trigger beforePrint and allow cancel', (done: DoneFn) => {
        sankey.beforePrint = (args): void => {
            // We only need to ensure event fires and args has htmlContent.
            const a = args as { cancel: boolean; htmlContent?: HTMLElement };
            a.cancel = true;
            expect(a.htmlContent !== undefined).toBe(true);
            done();
        };

        sankey.print();
    });

    it('Export should not call ExportUtils.export when beforeExport', (done: DoneFn) => {
        const exportSpy = spyOn(ExportUtils.prototype, 'export').and.callThrough();

        sankey.beforeExport = (args): void => {
            const a = args as { cancel: boolean; width: number | null; height: number | null };
            a.cancel = true;
            expect(a.width === null).toBe(true);
            expect(a.height === null).toBe(true);
        };

        loaded = (_args): void => {
            expect(exportSpy.calls.count() === 0).toBe(true);
            // cleanup
            sankey.beforeExport = undefined;
            done();
        };

        sankey.loaded = loaded;
        sankey.export('PNG', 'sankey');
        sankey.refresh();
    });

    it('pdfExport should pass width/height from beforeExport args into ExportUtils.export', (done: DoneFn) => {
        const exportSpy = spyOn(ExportUtils.prototype, 'export').and.stub();

        sankey.beforeExport = (args): void => {
            const a = args as { cancel: boolean; width: number | null; height: number | null };
            a.cancel = false;
            a.width = 400;
            a.height = 300;
        };

        loaded = (_args): void => {
            expect(exportSpy.calls.count() > 0).toBe(true);
            sankey.beforeExport = undefined;
            done();
        };

        sankey.loaded = loaded;
        (sankey as { sankeyExportModule?: { pdfExport: Function } }).sankeyExportModule.pdfExport('sankey_pdf');
        sankey.refresh();
    });

    it('getDataUrl should return a non-empty string', (done: DoneFn) => {
        const dataUrlSpy = spyOn(ExportUtils.prototype, 'getDataUrl').and.returnValue('data:image/png;base64,AAA');

        loaded = (_args): void => {
            // access export module the same way as above
            const exportModule = (sankey).sankeyExportModule;
            if (!exportModule) {
                fail('sankeyExportModule not available');
                done();
                return;
            }

            const url = exportModule.getDataUrl(sankey);
            expect(typeof url === 'string').toBe(true);
            expect(dataUrlSpy.calls.count() === 1).toBe(true);

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Export should not call ExportUtils.export when beforeExport is cancelled', (done: DoneFn) => {
        const exportSpy = spyOn(ExportUtils.prototype, 'export').and.callThrough();

        sankey.beforeExport = (args): void => {
            const a = args as { cancel: boolean; width: number | null; height: number | null };
            a.cancel = false;
            expect(a.width === null).toBe(true);
            expect(a.height === null).toBe(true);
        };

        loaded = (_args): void => {
            expect(exportSpy.calls.count()).not.toBe(0);
            // cleanup
            sankey.beforeExport = undefined;
            done();
        };

        sankey.loaded = loaded;
        sankey.export('PNG', 'sankey');
        sankey.refresh();
    });

    it('pdfExport should pass width/height from beforeExport', (done: DoneFn) => {
        const exportSpy = spyOn(ExportUtils.prototype, 'export').and.stub();

        sankey.beforeExport = (args): void => {
            const a = args as { cancel: boolean; width: number | null; height: number | null };
            a.cancel = true;
            a.width = 400;
            a.height = 300;
        };

        loaded = (_args): void => {

            expect(exportSpy.calls.count()).toBe(0);

            sankey.beforeExport = undefined;
            done();
        };

        sankey.loaded = loaded;
        (sankey as { sankeyExportModule?: { pdfExport: Function } }).sankeyExportModule.pdfExport('sankey_pdf', 'Vertical', sankey);
        sankey.refresh();
    });

    it('memory leak', () => {
        profile.sample();
        const average = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
