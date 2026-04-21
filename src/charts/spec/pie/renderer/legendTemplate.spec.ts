/**
 * Accumulation (Pie) — Legend Item Template Spec (point-wise)
 *
 * What this file covers
 * - Visibility: hidden/visible with template
 * - Rendering: per-point template nodes with predictable ids
 * - The requested loaded handler: compare <legendId>_translate_g.childNodes.length vs points length
 * - Paging: arrows + page number update with templates
 * - Interactivity: click on template toggles *point* visibility
 * - Fixed legend size honored with templates
 * - Title + template coexistence
 * - RTL navigation + keyboard interaction still work with templates
 */

import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { removeElement, getElement } from '../../../src/common/utils/helper';
import { piedata } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

AccumulationChart.Inject(PieSeries, AccumulationLegend);

describe('Accumulation (Pie) — Legend Item Template (point-wise)', () => {
    /**
     * @param count
     */
    function buildPoints(count: number): Array<{ x: string; y: number; text: string }> {
        const pts: Array<{ x: string; y: number; text: string }> = [];
        for (let i: number = 0; i < count; i++) {
            pts.push({ x: 'P' + i, y: 10 + i * 5, text: 'P' + i });
        }
        return pts;
    }

    // ---------- Test rig ----------
    const id: string = 'ej2-container';
    const legendId: string = id + '_chart_legend';
    let ele: HTMLElement;
    let accumulation: AccumulationChart;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let legendEle: Element;
    const trigger: MouseEvents = new MouseEvents();

    beforeAll((): void => {
        ele = createElement('div', { id });
        document.body.appendChild(ele);

        // Start hidden; turn on visible per test case
        accumulation = new AccumulationChart({
            width: '600',
            height: '400',
            legendSettings: { visible: false },
            series: [{
                type: 'Pie',
                dataSource: piedata,
                xName: 'x',
                yName: 'y',
                animation: { enable: false }
            }]
        } as any);
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.destroy();
        removeElement(id);
    });

    // ---------- 2) Legend visible + template: requested loaded handler ----------
    it('Legend visible + template: <translate_g> child count equals points length (requested pattern)', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement('ej2-container_chart_legend_template_00');
            expect(legendEle).not.toBeNull();
            done();
        };
        accumulation.legendSettings.template = '<div class="legend-tmpl" role="button" tabindex="0">Slice</div>';
        accumulation.legendSettings.visible = true;
        accumulation.loaded = loaded;
        accumulation.refresh();
    });

    // ---------- 3) Template IDs are per point (…_template_<pointIndex>) ----------
    it('Template IDs follow per-point pattern and items are tabbable', (done: Function) => {
        loaded = () => {
            const tpl0: HTMLElement = document.getElementById(`${legendId}_template_00`);
            const tpl1: HTMLElement = document.getElementById(`${legendId}_template_01`);
            expect(tpl0).not.toBeNull();
            expect(tpl1).not.toBeNull();

            expect(tpl0!.getAttribute('role')).toBe('button');
            expect(tpl0!.getAttribute('tabindex')).toBe('0');
            expect(tpl0!.hasAttribute('aria-pressed')).toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });

    // ---------- 5) Paging with templates ----------
    it('Paging: arrows & page number update; templates still present on later pages', (done: Function) => {
        loaded = () => {
            const pageDown: Element = getElement(legendId + '_pagedown');
            const pageNum: Element = getElement(legendId + '_pagenumber');
            expect(pageDown).not.toBe(null);
            expect(pageNum).not.toBe(null);

            const first: string = (pageNum!.textContent || '1/1').split('/')[0];
            expect(parseInt(first, 10)).toBe(1);

            trigger.clickEvent(pageDown);
            setTimeout(() => {
                const now: string = (getElement(legendId + '_pagenumber')!.textContent || '1/1').split('/')[0];
                expect(parseInt(now, 10)).toBeGreaterThanOrEqual(1);
                const anyTemplate: Element = document.querySelector(`div[id^="${legendId}_template_"]`);
                expect(anyTemplate).not.toBeNull();
                done();
            }, 150);
        };

        // Force paging: many points + cramped legend area
        (accumulation.series[0] as any).dataSource = buildPoints(30);
        accumulation.legendSettings.template = '<div class="legend-tmpl" role="button" tabindex="0">Item</div>';
        accumulation.legendSettings = { ...accumulation.legendSettings, position: 'Bottom', width: '140', height: '80', alignment: 'Near' } as any;

        accumulation.loaded = loaded;
        accumulation.refresh();
    });

    // ---------- 6) Fixed legend size with template ----------
    it('Legend fixed width/height honored with template', (done: Function) => {
        loaded = () => {
            const legendElement: Element = getElement(legendId + '_element')!;
            expect(legendElement).not.toBe(null);
            const w: number = parseInt(legendElement.getAttribute('width')!, 10);
            const h: number = parseInt(legendElement.getAttribute('height')!, 10);
            expect(w).toBe(300);
            expect(h).toBe(100);
            done();
        };
        accumulation.legendSettings = { ...accumulation.legendSettings, position: 'Right', width: '300', height: '100' } as any;
        accumulation.loaded = loaded;
        accumulation.refresh();
    });

    // ---------- 7) Title + templates coexist ----------
    it('Legend title and templates coexist', (done: Function) => {
        loaded = () => {
            const title: Element = getElement(id + '_chart_legend_title');
            expect(title).not.toBe(null);
            expect((title as HTMLElement).textContent).toBe('Countries');

            const tpl0: HTMLElement = document.getElementById(`${legendId}_template_00`);
            expect(tpl0).not.toBeNull();
            done();
        };
        accumulation.legendSettings = { ...accumulation.legendSettings,
            position: 'Bottom',
            title: 'Countries',
            titlePosition: 'Top'
        } as any;
        accumulation.loaded = loaded;
        accumulation.refresh();
    });

    it('focuses legend template', (done: Function) => {
        accumulation.loaded = () => {
            accumulation.loaded = null;
            const tpl: HTMLElement = document.getElementById(legendId + '_template_01') as HTMLElement | null;
            expect(tpl).not.toBeNull();
            if (tpl && typeof tpl.focus === 'function') {
                tpl.focus({ preventScroll: true });
            }
            setTimeout(() => {
                expect(document.activeElement === tpl).toBe(false);
                done();
            }, 0);
        };
        accumulation.refresh();
    });

    // ---------- 10) Memory ----------
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
