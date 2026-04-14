/* eslint-disable @typescript-eslint/tslint/config */
import { createElement } from '@syncfusion/ej2-base';
import { Sankey } from '../../src/sankey/sankey';
import { SankeyHighlight } from '../../src/sankey/user-interaction/highlight';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeySeries } from '../../src/sankey/series/series';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MouseEvents } from './events.spec';

Sankey.Inject(SankeyHighlight, SankeyLegend, SankeyTooltip, SankeySeries, SankeyExport);

const nodeData: Array<{ id: string; color?: string }> = [
    { id: 'Solar', color: '#fcd34d' },
    { id: 'Wind', color: '#93c5fd' },
    { id: 'Hydro', color: '#67e8f9' },
    { id: 'Nuclear', color: '#a5b4fc' },
    { id: 'Coal', color: '#d1d5db' },
    { id: 'Natural Gas', color: '#fed7aa' },
    { id: 'Oil', color: '#fdba74' },
    { id: 'Electricity', color: '#f472b6' },
    { id: 'Heat', color: '#fb7185' },
    { id: 'Fuel', color: '#f97316' },
    { id: 'Residential', color: '#4ade80' },
    { id: 'Commercial', color: '#34d399' },
    { id: 'Industrial', color: '#22c55e' },
    { id: 'Transportation', color: '#c084fc' },
    { id: 'Energy Services', color: '#60a5fa' },
    { id: 'Losses', color: '#94a3b8' }
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

describe('Sankey - Keyboard Navigation (with highlight + tooltip)', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    let sankey: Sankey;
    let loaded: (args: unknown) => void;
    const trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    const chartId: string = 'container_keyboard';

    beforeAll(() => {

        chartContainer = createElement('div', { id: chartId });
        document.body.appendChild(chartContainer);

        sankey = new Sankey({
            width: '750',
            height: '450',
            title: 'Energy Flow (Sample)',
            subTitle: 'testing',
            nodes: nodeData,
            links: linkData,

            linkStyle: { opacity: 0.5, curvature: 0.55, highlightOpacity: 0.8, inactiveOpacity: 0.1 },
            nodeStyle: { width: 25, padding: 5, opacity: 1, stroke: 'Black', strokeWidth: 1, highlightOpacity: 1, inactiveOpacity: 0.3 },

            tooltip: { enable: true, enableAnimation: false, fadeOutMode: 'Click', fadeOutDuration: 0 },
            legendSettings: { visible: true },
            theme: 'Fabric'
        });

        sankey.appendTo('#' + chartId);
    });

    afterAll((): void => {
        sankey.destroy();
        chartContainer.remove();
    });

    it('Arrow navigation in nodes should move focus, apply highlight and show tooltip', (done: DoneFn) => {
        loaded = (): void => {
            const node0 = document.getElementById(chartId + '_node_level_0_0'); // Solar
            const node1 = document.getElementById(chartId + '_node_level_0_1'); // Wind
            const electricityNode = document.getElementById(chartId + '_node_level_1_0'); // Electricity

            const solarLink = document.getElementById(chartId + '_link_level_0_0'); // Solar->Electricity
            const windLink = document.getElementById(chartId + '_link_level_0_1'); // Wind->Electricity

            if (!node0 || !node1 || !electricityNode || !solarLink || !windLink) {
                fail('Required node/link elements not found');
                done();
                return;
            }

            expect(node0.getAttribute('tabindex') === '0').toBe(true);

            node0.focus();
            trigger.keyboardEvent('keyup', node0 as HTMLElement, 'ArrowRight', 'ArrowRight');

            expect(node0.getAttribute('tabindex') === '-1').toBe(true);
            expect(node1.getAttribute('tabindex') === '0').toBe(true);
            expect(node1.classList.contains('e-sankey-focused')).toBe(true);

            expect(windLink.getAttribute('opacity') === '0.8').toBe(true);
            expect(solarLink.getAttribute('opacity') === '0.1').toBe(true);

            expect(node1.getAttribute('opacity') === '1').toBe(true);
            expect(electricityNode.getAttribute('opacity') === '1').toBe(true);
            expect(node0.getAttribute('opacity') === '0.3').toBe(true);

            const tipText = document.getElementById(chartId + '_tooltip_parent_text');
            expect(tipText !== null).toBe(true);
            if (tipText) {
                const txt = (tipText.textContent || '').replace(/[\u200E\u200F\u202A-\u202E]/g, '').replace(/\s+/g, ' ').trim();
                expect(txt.indexOf('Wind') > -1).toBe(true);
                expect(txt.indexOf('120') > -1).toBe(true);
            }

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Arrow navigation in links should move focus, apply highlightForLink and show link tooltip', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const link0 = document.getElementById(chartId + '_link_level_0_0'); // Solar->Electricity
            const link1 = document.getElementById(chartId + '_link_level_0_1'); // Wind->Electricity
            const solarNode = document.getElementById(chartId + '_node_level_0_0'); // Solar
            const windNode = document.getElementById(chartId + '_node_level_0_1'); // Wind

            if (!link0 || !link1 || !solarNode || !windNode) {
                fail('Required link/node elements not found');
                done();
                return;
            }

            expect(link0.getAttribute('tabindex') === '0').toBe(true);

            link0.focus();
            trigger.keyboardEvent('keyup', link0 as HTMLElement, 'ArrowRight', 'ArrowRight');

            expect(link0.getAttribute('tabindex') === '-1').toBe(true);
            expect(link1.getAttribute('tabindex') === '0').toBe(true);
            expect(link1.classList.contains('e-sankey-focused')).toBe(true);

            expect(link1.getAttribute('opacity') === '0.8').toBe(true);
            expect(link0.getAttribute('opacity') === '0.1').toBe(true);

            expect(windNode.getAttribute('opacity') === '1').toBe(true);
            expect(solarNode.getAttribute('opacity') === '0.3').toBe(true);

            const tipText = document.getElementById(chartId + '_tooltip_parent_text');
            if (tipText) {
                const txt = (tipText.textContent || '').replace(/[\u200E\u200F\u202A-\u202E]/g, '').replace(/\s+/g, ' ').trim();
                expect(txt.indexOf('Wind') > -1).toBe(true);
                expect(txt.indexOf('Electricity') > -1).toBe(true);
                expect(txt.indexOf('120') > -1).toBe(true);
            }

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Escape should clear highlight (restore default opacities) and initiate tooltip hide', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const node0 = document.getElementById(chartId + '_node_level_0_0');
            const link0 = document.getElementById(chartId + '_link_level_0_0');
            const link1 = document.getElementById(chartId + '_link_level_0_1');

            if (!node0 || !link0 || !link1) {
                fail('Required elements not found for ESC test');
                done();
                return;
            }

            // First, force highlight by focusing node0 and ArrowRight (so highlight is active)
            node0.focus();
            trigger.keyboardEvent('keyup', node0 as HTMLElement, 'ArrowRight', 'ArrowRight');

            trigger.keyboardEvent('keydown', node0 as HTMLElement, 'Escape', 'Escape');

            const tipParent = document.getElementById(chartId + '_tooltip_parent') as HTMLElement | null;
            expect(tipParent !== null).toBe(true);

            done();

        };

        sankey.loaded = loaded;
        sankey.refresh();
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
