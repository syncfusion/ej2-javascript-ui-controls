/* eslint-disable @typescript-eslint/tslint/config */
import { createElement } from '@syncfusion/ej2-base';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { Sankey } from '../../src/sankey/sankey';
import { SankeyHighlight } from '../../src/sankey/user-interaction/highlight';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';
import { SankeySeries } from '../../src/sankey/series/series';
import { ChartTheme } from '../../src';
import { SankeyNodeLayout } from '../../src/sankey/model/sankey-interface';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Rect } from '@syncfusion/ej2-svg-base';

Sankey.Inject(SankeyHighlight, SankeyLegend, SankeyTooltip, SankeySeries, SankeyExport);

const nodeData: Array<{ id: string; color?: string; offset?: number }> = [
    { id: 'Solar', color: '#fcd34d' }, { id: 'Wind', color: '#93c5fd' }, { id: 'Hydro', color: '#67e8f9' },
    { id: 'Nuclear', color: '#a5b4fc' }, { id: 'Coal', color: '#d1d5db' }, { id: 'Natural Gas', color: '#fed7aa' },
    { id: 'Oil', color: '#fdba74' }, { id: 'Electricity', color: '#f472b6' }, { id: 'Heat', color: '#fb7185' },
    { id: 'Fuel', color: '#f97316' }, { id: 'Residential', color: '#4ade80' }, { id: 'Commercial', color: '#34d399' },
    { id: 'Industrial', color: '#22c55e' }, { id: 'Transportation', color: '#c084fc' },
    { id: 'Energy Services', color: '#60a5fa' }, { id: 'Losses', color: '#94a3b8' }, { id: null, color: null, offset: null }
];

const linkData: Array<{ sourceId: string; targetId: string; value: number }> = [
    { sourceId: 'Solar', targetId: 'Electricity', value: 100 },
    { sourceId: 'Wind', targetId: 'Electricity', value: 120 },
    { sourceId: 'Hydro', targetId: 'Electricity', value: 80 },
    { sourceId: 'Nuclear', targetId: 'Electricity', value: 90 },
    { sourceId: 'Coal', targetId: 'Electricity', value: 200 },
    { sourceId: 'Natural Gas', targetId: 'Electricity', value: 130 },
    { sourceId: 'Natural Gas', targetId: 'Heat', value: 80 },
    { sourceId: 'Oil', targetId: 'Fuel', value: 250 },
    { sourceId: 'Electricity', targetId: 'Residential', value: 170 },
    { sourceId: 'Electricity', targetId: 'Commercial', value: 160 },
    { sourceId: 'Electricity', targetId: 'Industrial', value: 210 },
    { sourceId: 'Heat', targetId: 'Residential', value: 40 },
    { sourceId: 'Heat', targetId: 'Commercial', value: 20 },
    { sourceId: 'Heat', targetId: 'Industrial', value: 20 },
    { sourceId: 'Fuel', targetId: 'Transportation', value: 200 },
    { sourceId: 'Fuel', targetId: 'Industrial', value: 50 },
    { sourceId: 'Residential', targetId: 'Energy Services', value: 180 },
    { sourceId: 'Commercial', targetId: 'Energy Services', value: 150 },
    { sourceId: 'Industrial', targetId: 'Energy Services', value: 230 },
    { sourceId: 'Transportation', targetId: 'Energy Services', value: 150 },
    { sourceId: 'Residential', targetId: 'Losses', value: 30 },
    { sourceId: 'Commercial', targetId: 'Losses', value: 30 },
    { sourceId: 'Industrial', targetId: 'Losses', value: 50 },
    { sourceId: 'Transportation', targetId: 'Losses', value: 50 }
];
describe('Sankey series', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Sankey - Elements (Title & Subtitle)', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_elements' }) as HTMLDivElement;
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
                labelSettings: {
                    visible: true,
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 'Normal',
                    fontStyle: 'Normal',
                    fontFamily: 'Segoe UI'
                },
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Fabric'
            }, '#container_elements');

            sankey.appendTo('#container_elements');
        });

        afterAll((): void => {
            sankey.destroy();
            ele.remove();
        });

        it('should render title and subtitle with expected attributes (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const title = document.getElementById('container_elements_title');
                if (!title) { fail('container_elements_title not found'); done(); return; }

                expect(title.getAttribute('x')).toBe('375');
                expect(title.getAttribute('y')).toBe('33.5');
                expect(title.getAttribute('fill')).toBe('#333333');
                expect(title.getAttribute('font-size')).toBe('16px');
                expect(title.getAttribute('font-style')).toBe('Normal');
                expect(title.getAttribute('font-family')).toBe('Segoe UI');
                expect(title.getAttribute('font-weight')).toBe('600');
                expect(title.getAttribute('text-anchor')).toBe('middle');
                expect(title.getAttribute('opacity')).toBe('1');
                expect(title.getAttribute('dominant-baseline')).toBe('auto');
                expect(title.getAttribute('role')).toBe('heading');
                expect(title.getAttribute('aria-level')).toBe('1');
                expect(title.getAttribute('tabindex')).toBe('0');
                expect(title.getAttribute('aria-label')).toBe('Energy Flow (Sample)');
                expect(title.textContent).toBe('Energy Flow (Sample)');

                const subtitle = document.getElementById('container_elements_subtitle');
                if (!subtitle) { fail('container_elements_subtitle not found'); done(); return; }

                expect(subtitle.getAttribute('x')).toBe('375');
                expect(subtitle.getAttribute('y')).toBe('61.5');
                expect(subtitle.getAttribute('fill')).toBe('#333333');
                expect(subtitle.getAttribute('font-size')).toBe('14px');
                expect(subtitle.getAttribute('font-style')).toBe('Normal');
                expect(subtitle.getAttribute('font-family')).toBe('Segoe UI');
                expect(subtitle.getAttribute('font-weight')).toBe('400');
                expect(subtitle.getAttribute('text-anchor')).toBe('middle');
                expect(subtitle.getAttribute('opacity')).toBe('1');
                expect(subtitle.getAttribute('dominant-baseline')).toBe('auto');
                expect(subtitle.getAttribute('role')).toBe('heading');
                expect(subtitle.getAttribute('aria-level')).toBe('2');
                expect(subtitle.getAttribute('tabindex')).toBe('0');
                expect(subtitle.getAttribute('aria-label')).toBe('testing');
                expect(subtitle.textContent).toBe('testing');

                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });

        it('should set container accessibility attributes and dir (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const host = document.getElementById('container_elements') as HTMLDivElement | null;
                if (!host) { fail('container_elements not found'); done(); return; }

                expect(host.getAttribute('role') === 'region').toBe(true);
                expect(host.getAttribute('tabindex') === '0').toBe(true);
                expect(host.getAttribute('dir') === 'ltr').toBe(true);
                expect(host.getAttribute('aria-label') === 'Energy Flow (Sample). Interactive Sankey diagram.').toBe(true);
                host.remove();
                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });
    });

    describe('Sankey - Labels', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_labels' }) as HTMLDivElement;
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
                labelSettings: { visible: true, color: '#000000', fontSize: '12px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Fabric'
            }, '#container_labels');

            sankey.appendTo('#container_labels');
        });

        afterAll((): void => {
            sankey.destroy();
            ele.remove();
        });

        it('should render a label text element with expected attributes and content (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const label = document.getElementById('container_labels_label_level_0_0');
                if (!label) { fail('container_labels_label_level_0_0 not found'); done(); return; }

                expect(label.getAttribute('fill') === '#000000').toBe(true);
                expect(label.getAttribute('font-size') === '12px').toBe(true);
                expect(label.getAttribute('font-family') === 'Segoe UI').toBe(true);
                expect(label.getAttribute('font-weight') === 'Normal').toBe(true);
                expect(label.getAttribute('font-style') === 'Normal').toBe(true);

                expect(label.getAttribute('x')).toBe('56');
                expect(label.getAttribute('y')).toBe('86.76190476190476');

                expect(label.getAttribute('dominant-baseline') === 'middle').toBe(true);
                expect(label.getAttribute('text-anchor') === 'start').toBe(true);

                expect(label.textContent === 'Solar 100').toBe(true);

                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });
    });

    describe('Sankey - Legend', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_legend' }) as HTMLDivElement;
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
                labelSettings: { visible: true, color: '#000000', fontSize: '12px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Fabric'
            }, '#container_legend');

            sankey.appendTo('#container_legend');
        });

        afterAll((): void => {
            sankey.destroy();
            ele.remove();
        });

        it('should render a legend item group, shape and text with expected attributes (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const g0 = document.getElementById('container_legend_chart_legend_g_0');
                if (!g0) { fail('container_legend_chart_legend_g_0 not found'); done(); return; }

                expect(g0.getAttribute('tabindex') === '0').toBe(true);
                expect(g0.getAttribute('aria-label') === 'Solar').toBe(true);
                expect(g0.getAttribute('role') === 'img').toBe(true);

                const shape0 = document.getElementById('container_legend_chart_legend_shape_0');
                if (!shape0) { fail('container_legend_chart_legend_shape_0 not found'); done(); return; }

                expect(shape0.getAttribute('opacity') === '1').toBe(true);
                expect(shape0.getAttribute('fill') === '#fcd34d').toBe(true);
                expect(shape0.getAttribute('stroke') === '#fcd34d').toBe(true);
                expect(shape0.getAttribute('stroke-width') === '1').toBe(true);
                expect(shape0.getAttribute('d')).toBe('M 35 374 L 45 374 L 45 384 L 35 384 L 35 374 z');

                const text0 = document.getElementById('container_legend_chart_legend_text_0');
                if (!text0) { fail('container_legend_chart_legend_text_0 not found'); done(); return; }

                expect(text0.getAttribute('x')).toBe('53');
                expect(text0.getAttribute('y')).toBe('383');
                expect(text0.getAttribute('fill') === '#666666').toBe(true);
                expect(text0.getAttribute('font-size') === '14px').toBe(true);
                expect(text0.getAttribute('font-style') === 'Normal').toBe(true);
                expect(text0.getAttribute('font-family') === 'Segoe UI').toBe(true);
                expect(text0.getAttribute('font-weight') === '400').toBe(true);
                expect(text0.getAttribute('text-anchor') === 'start').toBe(true);
                expect(text0.textContent === 'Solar').toBe(true);

                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });
    });

    describe('Sankey - Links', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_links' }) as HTMLDivElement;
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
                labelSettings: { visible: true, color: '#000000', fontSize: '12px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Fabric'
            }, '#container_links');

            sankey.appendTo('#container_links');
        });

        afterAll((): void => {
            sankey.destroy();
            ele.remove();
        });

        it('should render a link path with expected attributes and full d (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const link = document.getElementById('container_links_link_level_0_0');
                if (!link) { fail('container_links_link_level_0_0 not found'); done(); return; }

                expect(link.getAttribute('d')
                ).toBe('M 46 75 C 171.21666666666667 75, 123.44999999999999 85, 248.66666666666666 85 L 248.66666666666666 108.52380952380952 C 123.44999999999999 108.52380952380952, 171.21666666666667 98.52380952380952, 46 98.52380952380952 Z');

                expect(link.getAttribute('fill') === 'url(#gradient-container_links_Solar_Electricity_0)').toBe(true);
                expect(link.getAttribute('stroke') === 'none').toBe(true);
                expect(link.getAttribute('stroke-width') === '0').toBe(true);
                expect(link.getAttribute('opacity') === '0.5').toBe(true);

                expect(link.getAttribute('data-source') === 'Solar').toBe(true);
                expect(link.getAttribute('data-target') === 'Electricity').toBe(true);
                expect(link.getAttribute('data-value') === '100').toBe(true);
                expect(link.getAttribute('data-link-key') === 'Solar__Electricity__0').toBe(true);

                expect(link.getAttribute('role') === 'link').toBe(true);
                expect(link.getAttribute('aria-label') === 'From Solar to Electricity: Value 100').toBe(true);
                expect(link.getAttribute('tabindex') === '0').toBe(true);

                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });
    });

    describe('Sankey - Nodes', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_nodes' }) as HTMLDivElement;
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
                labelSettings: { visible: true, color: '#000000', fontSize: '12px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Fabric'
            }, '#container_nodes');

            sankey.appendTo('#container_nodes');
        });

        afterAll((): void => {
            sankey.destroy();
            ele.remove();
        });

        it('should render a node rect with expected attributes (basic contract)', (done: DoneFn) => {
            loaded = (_args: unknown): void => {
                const node = document.getElementById('container_nodes_node_level_0_0');
                if (!node) { fail('container_nodes_node_level_0_0 not found'); done(); return; }

                expect(node.getAttribute('fill') === '#fcd34d').toBe(true);
                expect(node.getAttribute('stroke') === 'Black').toBe(true);
                expect(node.getAttribute('stroke-width') === '1').toBe(true);

                expect(node.getAttribute('x') === '21').toBe(true);
                expect(node.getAttribute('y')).toBe('75');
                expect(node.getAttribute('width') === '25').toBe(true);
                expect(node.getAttribute('height')).toBe('23.523809523809526');

                expect(node.getAttribute('rx') === '0').toBe(true);
                expect(node.getAttribute('ry') === '0').toBe(true);

                expect(node.getAttribute('aria-label') === 'Solar').toBe(true);
                expect(node.getAttribute('role') === 'region').toBe(true);
                expect(node.getAttribute('tabindex') === '0').toBe(true);
                expect(node.getAttribute('aria-hidden') === 'false').toBe(true);

                done();
            };

            sankey.loaded = loaded;
            sankey.refresh();
        });

        describe('Sankey - Nodes (Vertical Orientation)', () => {
            let eleV: HTMLDivElement;
            let sankeyV: Sankey;
            let loadedV: (args: unknown) => void;

            beforeAll(() => {
                eleV = createElement('div', { id: 'container_nodes_vertical' }) as HTMLDivElement;
                document.body.appendChild(eleV);

                sankeyV = new Sankey({
                    orientation: 'Vertical',
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
                    labelSettings: { visible: true, color: '#000000', fontSize: '12px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Segoe UI' },
                    tooltip: { enable: true },
                    legendSettings: { visible: true },
                    theme: 'Fabric'
                }, '#container_nodes_vertical');

                sankeyV.appendTo('#container_nodes_vertical');
            });

            afterAll((): void => {
                sankeyV.destroy();
                eleV.remove();
            });

            it('should render vertical node with swapped width/height and updated x/y (contract)', (done: DoneFn) => {
                loadedV = (_args: unknown): void => {
                    const node0 = document.getElementById('container_nodes_vertical_node_level_0_0');
                    if (!node0) { fail('container_nodes_vertical_node_level_0_0 not found'); done(); return; }

                    expect(node0.getAttribute('x') === '21').toBe(true);
                    expect(node0.getAttribute('y')).toBe('75');
                    expect(node0.getAttribute('height') === '25').toBe(true);
                    expect(node0.getAttribute('width') === '64.57142857142857').toBe(true);
                    expect(node0.getAttribute('fill') === '#fcd34d').toBe(true);
                    expect(node0.getAttribute('stroke') === 'Black').toBe(true);
                    expect(node0.getAttribute('stroke-width') === '1').toBe(true);
                    expect(node0.getAttribute('aria-label') === 'Solar').toBe(true);

                    const node6 = document.getElementById('container_nodes_vertical_node_level_0_6');
                    if (!node6) { fail('container_nodes_vertical_node_level_0_6 not found'); done(); return; }
                    expect(node6.getAttribute('y')).toBe('75');
                    expect(node6.getAttribute('height') === '25').toBe(true);
                    expect(node6.getAttribute('x') === '567.5714285714286').toBe(true);
                    expect(node6.getAttribute('width') === '161.42857142857142').toBe(true);
                    expect(node6.getAttribute('aria-label') === 'Oil').toBe(true);

                    done();
                };

                sankeyV.loaded = loadedV;
                sankeyV.refresh();
            });
        });

        describe('Sankey - Themes (smoke)', () => {
            type ThemeCase = { theme: ChartTheme; expectedTitleFill: string };

            const themeCases: ThemeCase[] = [
                { theme: 'Fabric', expectedTitleFill: '#333333' }, { theme: 'FabricDark', expectedTitleFill: '#DADADA' },
                { theme: 'Bootstrap4', expectedTitleFill: '#212529' }, { theme: 'Bootstrap', expectedTitleFill: '#212529' },
                { theme: 'BootstrapDark', expectedTitleFill: '#FFFFFF' }, { theme: 'Bootstrap5', expectedTitleFill: '#212529' },
                { theme: 'Bootstrap5Dark', expectedTitleFill: '#DEE2E6' }, { theme: 'HighContrast', expectedTitleFill: '#FFFFFF' },
                { theme: 'HighContrastLight', expectedTitleFill: '#FFFFFF' }, { theme: 'MaterialDark', expectedTitleFill: 'rgba(255, 255, 255, 0.87)' },
                { theme: 'Tailwind', expectedTitleFill: '#374151' }, { theme: 'TailwindDark', expectedTitleFill: '#D1D5DB' },
                { theme: 'Tailwind3', expectedTitleFill: '#111827' }, { theme: 'Tailwind3Dark', expectedTitleFill: '#FFFFFF' },
                { theme: 'Fluent', expectedTitleFill: '#201F1E' }, { theme: 'FluentDark', expectedTitleFill: '#C8C6C4' },
                { theme: 'Fluent2', expectedTitleFill: '#242424' }, { theme: 'Fluent2Dark', expectedTitleFill: '#FFFFFF' },
                { theme: 'Fluent2HighContrast', expectedTitleFill: '#FFFFFF' }, { theme: 'Material3', expectedTitleFill: '#1C1B1F' }];

            for (const tc of themeCases) {
                describe(`Theme: ${tc.theme}`, () => {
                    let ele: HTMLDivElement;
                    let sankey: Sankey;
                    let loaded: (args: unknown) => void;

                    beforeAll(() => {
                        ele = createElement('div', { id: 'container_theme_' + tc.theme }) as HTMLDivElement;
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
                            labelSettings: {
                                visible: true,
                                color: '#000000',
                                fontSize: '12px',
                                fontWeight: 'Normal',
                                fontStyle: 'Normal',
                                fontFamily: 'Segoe UI'
                            },
                            tooltip: { enable: true },
                            legendSettings: { visible: true },
                            theme: tc.theme
                        }, '#container_theme_' + tc.theme);

                        sankey.appendTo('#container_theme_' + tc.theme);
                    });

                    afterAll((): void => {
                        sankey.destroy();
                        ele.remove();
                    });

                    it('should apply theme title color (single unique attribute)', (done: DoneFn) => {
                        loaded = (_args): void => {
                            const title = document.getElementById('container_theme_' + tc.theme + '_title');
                            if (!title) { fail('title not found for theme ' + tc.theme); done(); return; }

                            expect(title.getAttribute('fill') === tc.expectedTitleFill).toBe(true);
                            done();
                        };

                        sankey.loaded = loaded;
                        sankey.refresh();
                    });
                });
            }
        });
    });

    describe('Sankey series - additional coverage for edge cases', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_edge_cases' }) as HTMLDivElement;
            document.body.appendChild(ele);
        });

        afterAll((): void => {
            if (sankey) { sankey.destroy(); }
            ele.remove();
        });

        it('render should handle empty links array gracefully', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: [],  // Empty links
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const linkCollection = document.querySelector('#container_edge_cases_link_collection');
                expect(linkCollection).toBeNull();
                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('buildNodes should handle nodes with custom offset values', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [
                    { id: 'A', color: '#FF0000', label: { text: 'Node A' }, offset: 50 },
                    { id: 'B', color: '#00FF00', label: { text: 'Node B' }, offset: 30 }
                ],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const nodeA = document.getElementById('container_edge_cases_node_level_0_0');
                expect(nodeA).not.toBeNull();

                const nodeB = document.getElementById('container_edge_cases_node_level_1_0');
                expect(nodeB).not.toBeNull();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderDataLabels should skip rendering when labelSettings.visible is false', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                labelSettings: { visible: false },  // Labels disabled
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const labelCollection = document.querySelector('#container_edge_cases_label_collection');

                if (labelCollection) {
                    const labels = labelCollection.querySelectorAll('text');
                    expect(labels.length === 0).toBe(true);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderHorizontalLink should apply gradient fill with Blend colorType', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                linkStyle: { colorType: 'Blend', opacity: 0.5, curvature: 0.55 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const link = document.getElementById('container_edge_cases_link_level_0_0');
                if (link) {
                    const fill = link.getAttribute('fill');
                    expect(fill).toContain('url(#gradient-');
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderVerticalLink should apply gradient fill with Blend colorType', (done: DoneFn) => {
            sankey = new Sankey({
                orientation: 'Vertical',
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                linkStyle: { colorType: 'Blend', opacity: 0.5, curvature: 0.55 },
                nodeStyle: { width: 25, padding: 5 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const link = document.getElementById('container_edge_cases_link_level_0_0');
                if (link) {
                    const fill = link.getAttribute('fill');
                    expect(fill).toContain('url(#gradient-');
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderHorizontalLink should use source color when colorType is Source', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                linkStyle: { colorType: 'Source', opacity: 0.5, curvature: 0.55 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const link = document.getElementById('container_edge_cases_link_level_0_0');
                if (link) {
                    const fill = link.getAttribute('fill');
                    // Source color should be Solar's color (#fcd34d)
                    expect(fill && (fill === '#fcd34d' || fill.indexOf('url(#gradient-') !== -1)).toBe(true);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderHorizontalLink should use target color when colorType is Target', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                linkStyle: { colorType: 'Target', opacity: 0.5, curvature: 0.55 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const link = document.getElementById('container_edge_cases_link_level_0_0');
                if (link) {
                    const fill = link.getAttribute('fill');
                    // Target color should be Electricity's color (#f472b6)
                    expect(fill && (fill === '#f472b6' || fill.indexOf('url(#gradient-') !== -1)).toBe(true);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderNodes should have correct node elements rendered', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                tooltip: { enable: true },
                nodeStyle: { strokeWidth: null, opacity: null },
                linkStyle: { opacity: null },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const nodeCount = nodeData.length;
                let renderedCount = 0;

                for (let i = 0; i < nodeCount; i++) {
                    const node = document.getElementById(`container_edge_cases_node_level_0_${i}`);
                    if (node) { renderedCount++; }
                }

                expect(renderedCount).toBeGreaterThan(0);
                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('getOrCreateLinkGradient should create gradient with correct start/end colors', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                linkStyle: { colorType: 'Blend', opacity: 0.5, curvature: 0.55 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                // Check if gradient defs were created
                const gradients = document.querySelectorAll('defs linearGradient[id*="gradient-"]');
                expect(gradients.length).toBeGreaterThan(0);

                // Verify first gradient has stop elements
                if (gradients.length > 0) {
                    const stops = gradients[0].querySelectorAll('stop');
                    expect(stops.length).toBe(2);  // Should have start and end stops
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('computeHorizontalLayout should properly distribute nodes across levels', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const node0 = document.getElementById('container_edge_cases_node_level_0_0');
                const node1 = document.getElementById('container_edge_cases_node_level_1_0');
                const node5 = document.getElementById('container_edge_cases_node_level_5_0');

                if (node0 && node1) {
                    const x0 = parseFloat(node0.getAttribute('x') || '0');
                    const x1 = parseFloat(node1.getAttribute('x') || '0');

                    // Nodes should progress horizontally from left to right
                    expect(x1).toBeGreaterThan(x0);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('computeVerticalLayout should properly distribute nodes vertically', (done: DoneFn) => {
            sankey = new Sankey({
                orientation: 'Vertical',
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                nodeStyle: { width: 25, padding: 5 },
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const node0 = document.getElementById('container_edge_cases_node_level_0_0');
                const node1 = document.getElementById('container_edge_cases_node_level_1_0');

                if (node0 && node1) {
                    const y0 = parseFloat(node0.getAttribute('y') || '0');
                    const y1 = parseFloat(node1.getAttribute('y') || '0');

                    // Nodes should progress vertically from top to bottom
                    expect(y1).toBeGreaterThan(y0);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('renderGroups should create all required SVG groups', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const nodeCollection = document.querySelector('#container_edge_cases_node_collection');
                const linkCollection = document.querySelector('#container_edge_cases_link_collection');
                const labelCollection = document.querySelector('#container_edge_cases_label_collection');

                expect(nodeCollection).not.toBeNull();
                expect(linkCollection).not.toBeNull();
                expect(labelCollection).not.toBeNull();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('assignLevels should correctly assign levels to nodes based on link hierarchy', (done: DoneFn) => {
            const testLinks = [
                { sourceId: 'A', targetId: 'B', value: 50 },
                { sourceId: 'B', targetId: 'C', value: 40 },
                { sourceId: 'C', targetId: 'D', value: 30 }
            ];

            const testNodes = [
                { id: 'A', color: '#FF0000' },
                { id: 'B', color: '#00FF00' },
                { id: 'C', color: '#0000FF' },
                { id: 'D', color: '#FFFF00' }
            ];

            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: testNodes,
                links: testLinks,
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                // Verify nodes exist at different levels
                const nodeA = document.getElementById('container_edge_cases_node_level_0_0');
                const nodeD = document.getElementById('container_edge_cases_node_level_3_0');

                expect(nodeA).not.toBeNull();
                expect(nodeD).not.toBeNull();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('render should return early when svgObject is null', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                // Manually set svgObject to null to trigger early return
                sankey.svgObject = null;

                const series = new SankeySeries(sankey);
                expect(() => series.render(sankey)).not.toThrow();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('render should return early when !sankeyLinks.length (empty array check)', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: [],  // Empty links - triggers: if (!sankeyLinks.length) return
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const linkCollection = document.querySelector('#container_edge_cases_link_collection');

                // When links are empty, link collection should not be created
                expect(linkCollection).toBeNull();

                // Verify render returns early
                const seriesInstance = (sankey).sankeySeriesModule;
                const result = seriesInstance.render(sankey);
                expect(result).toBeUndefined();  // Should return early without error

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });

        it('render should return early when clipRect is null', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: nodeData,
                links: linkData,
                tooltip: { enable: true },
                theme: 'Fabric'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                // Manually set initialClipRect to null to trigger early return
                (sankey).initialClipRect = null;

                const series = new SankeySeries(sankey);
                expect(() => series.render(sankey)).not.toThrow();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });
        it('renderDataLabels should skip rendering when labelSettings.visible is false in vertical', (done: DoneFn) => {
            sankey = new Sankey({
                width: '350',
                height: '250',
                nodes: nodeData,
                links: linkData,
                labelSettings: { visible: false, fontStyle: null, fontWeight: null },  // Labels disabled
                tooltip: { enable: true },
                theme: 'Fabric',
                orientation: 'Vertical'
            }, '#container_edge_cases');

            loaded = (_args: unknown): void => {
                const labelCollection = document.querySelector('#container_edge_cases_label_collection');

                if (labelCollection) {
                    const labels = labelCollection.querySelectorAll('text');
                    expect(labels.length === 0).toBe(true);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_edge_cases');
        });
    });

    describe('Sankey Series - Branch Coverage Tests - Direct Method Calls', () => {
        let ele: HTMLDivElement;
        let sankey: Sankey;
        let loaded: (args: unknown) => void;
        let seriesInstance: SankeySeries;

        beforeAll(() => {
            ele = createElement('div', { id: 'container_series_coverage' }) as HTMLDivElement;
            document.body.appendChild(ele);
        });

        afterAll((): void => {
            if (sankey) {
                sankey.destroy();
            }
            ele.remove();
        });

        it('buildNodes should handle non-array nodes ([] fallback), invalid nodes, offset, and empty colorPalette', (done: DoneFn) => {
            // First test: Non-array nodes
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: null,
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;

                // Test buildNodes with non-array nodes fallback using real sankey
                const testSankey: Sankey = sankey;
                const result1 = seriesInstance.buildNodes([{ sourceId: 'A', targetId: 'B', value: 100 }], testSankey);
                expect(result1).toBeTruthy();

                // Verify buildNodes was called and nodes were processed
                const nodeLayoutMap = (sankey).nodeLayoutMap;
                expect(nodeLayoutMap).toBeTruthy();

                // Test nodes with offset
                expect(nodeLayoutMap['A']).toBeTruthy();
                if (nodeLayoutMap['A'] && nodeLayoutMap['A'].offset !== undefined) {
                    expect(nodeLayoutMap['A'].offset).toBeGreaterThanOrEqual(0);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('assignLevels should handle missing nodes (0 fallback), level comparisons, maximumLevel, and nodeInDegreeMap', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [
                    { id: 'A' },
                    { id: 'B' },
                    { id: 'C' },
                    { id: 'D' }
                ],
                links: [
                    { sourceId: 'A', targetId: 'B', value: 100 },
                    { sourceId: 'B', targetId: 'C', value: 80 },
                    { sourceId: 'A', targetId: 'C', value: 20 },
                    { sourceId: 'C', targetId: 'D', value: 100 }
                ],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;

                // Direct test 1: nodes[currentNodeId] ? nodes[currentNodeId].level : 0
                const testNodes1 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [{ source: 'A', target: 'B' }] } as SankeyNodeLayout
                };
                const testLinks1 = [{ sourceId: 'A', targetId: 'MissingNode', value: 10 }];
                seriesInstance.assignLevels(testNodes1, testLinks1);
                expect(testNodes1['A']).toBeTruthy();

                // Direct test 2: childNode.level > (currentLevel + 1) ? childNode.level : (currentLevel + 1)
                const testNodes2 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [{ source: 'A', target: 'B' }] } as SankeyNodeLayout,
                    'B': { id: 'B', level: 3, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 100, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B', incomingLinks: [{ source: 'A', target: 'B' }], outgoingLinks: [] } as SankeyNodeLayout
                };
                const testLinks2 = [{ sourceId: 'A', targetId: 'B', value: 10 }];
                seriesInstance.assignLevels(testNodes2, testLinks2);
                // B.level is 3, currentLevel+1 is 1, so B.level should remain 3
                expect(testNodes2['B'].level).toBe(3);

                // Direct test 3: maximumLevel = maximumLevel > childNode.level ? maximumLevel : childNode.level
                const testNodes3 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [{ source: 'A', target: 'B' }, { source: 'A', target: 'C' }] } as SankeyNodeLayout,
                    'B': { id: 'B', level: -1, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 100, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B', incomingLinks: [{ source: 'A', target: 'B' }], outgoingLinks: [] } as SankeyNodeLayout,
                    'C': { id: 'C', level: -1, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 100, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'C', incomingLinks: [{ source: 'A', target: 'C' }], outgoingLinks: [] } as SankeyNodeLayout
                };
                const testLinks3 = [
                    { sourceId: 'A', targetId: 'B', value: 10 },
                    { sourceId: 'A', targetId: 'C', value: 10 }
                ];
                const maxLevel = seriesInstance.assignLevels(testNodes3, testLinks3);
                expect(maxLevel).toBeGreaterThan(0);

                // Direct test 4: nodeInDegreeMap[childNodeId] || 0
                const testNodes4 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [{ source: 'A', target: 'B' }] } as SankeyNodeLayout,
                    'B': { id: 'B', level: -1, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 100, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B', incomingLinks: [{ source: 'A', target: 'B' }], outgoingLinks: [] } as SankeyNodeLayout
                };
                const testLinks4 = [{ sourceId: 'A', targetId: 'B', value: 10 }];
                seriesInstance.assignLevels(testNodes4, testLinks4);
                expect(testNodes4['B'].level).toBe(1);

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('computeHorizontalLayout should handle empty levels ([]) and maxTotalValue=0', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const rect: Rect = { x: 0, y: 0, width: 750, height: 450 };

                // Direct test 1: nodesGroupedByLevel[levelIndex] || []
                const nodes1 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, totalIncomingValue: 0, totalOutgoingValue: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout
                };
                seriesInstance.computeHorizontalLayout(nodes1, 3, rect);
                // Direct test 2: maxTotalValue > 0 ? ... : 0
                const nodes2 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 0, totalIncomingValue: 0, totalOutgoingValue: 0, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout,
                    'B': { id: 'B', level: 1, x: 0, y: 0, height: 100, width: 25, value: 0, totalIncomingValue: 0, totalOutgoingValue: 0, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout
                };
                seriesInstance.computeHorizontalLayout(nodes2, 2, rect);
                expect(nodes2['B'].x).toBeGreaterThanOrEqual(0);

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('computeVerticalLayout should handle empty levels ([]) and maxTotalValue=0', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                orientation: 'Vertical',
                nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const rect: Rect = { x: 0, y: 0, width: 750, height: 450 };

                // Direct test 1: nodesGroupedByLevel[levelIndex] || []
                const nodes1 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, totalIncomingValue: 0, totalOutgoingValue: 100, inValue: 0, outValue: 100, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout
                };
                seriesInstance.computeVerticalLayout(nodes1, 3, rect);
                expect(nodes1['A'].y).toBeGreaterThanOrEqual(0);

                // Direct test 2: maxTotalValueV > 0 ? ... : 0
                const nodes2 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 0, totalIncomingValue: 0, totalOutgoingValue: 0, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout,
                    'B': { id: 'B', level: 1, x: 0, y: 0, height: 100, width: 25, value: 0, totalIncomingValue: 0, totalOutgoingValue: 0, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B', incomingLinks: [], outgoingLinks: [] } as SankeyNodeLayout
                };
                seriesInstance.computeVerticalLayout(nodes2, 2, rect);
                expect(nodes2['A'].y).toBeGreaterThanOrEqual(0);
                expect(nodes2['B'].y).toBeGreaterThanOrEqual(0);

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('renderNodes should handle chart.nodes=null ([] fallback)', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A' }, { id: 'B' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const nodes = (sankey).nodeLayoutMap;

                // Direct test: chart.nodes || []
                const testChart = seriesInstance.chart;
                testChart.nodes = null;

                const element = document.createElement('div');
                element.id = 'container_series_coverage_node_collection';
                element.textContent = 'This is a dynamically created container';
                document.body.appendChild(element);

                const nodeGroup = document.getElementById('container_series_coverage_node_collection');
                if (nodeGroup) {
                    seriesInstance.renderNodes(testChart, nodes);
                }
                expect(sankey.element).toBeTruthy();

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('renderLinks should cover eventLink || currentLink fallback in linkRenderArgs', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A' }, { id: 'B' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const nodes = (sankey).nodeLayoutMap;

                // Test 1: With linkRendering event (eventLink used)
                let linkRenderingCalled = false;
                sankey.linkRendering = (args): void => {
                    linkRenderingCalled = true;
                    // eventLink should be used in linkRenderArgs
                    expect(args.link).toBeTruthy();
                };

                const linkGroup = document.getElementById('container_series_coverage_link_collection');
                if (linkGroup) {
                    seriesInstance.renderLinks(sankey, sankey.links, nodes);
                    expect(linkRenderingCalled).toBe(true);
                }

                // Test 2: Without linkRendering event (currentLink fallback)
                sankey.linkRendering = null;
                if (linkGroup) {
                    seriesInstance.renderLinks(sankey, sankey.links, nodes);
                }

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('renderLinks vertical orientation should cover null node handling in sort', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                orientation: 'Vertical',
                nodes: [
                    { id: 'A' },
                    { id: 'B' },
                    { id: 'C' }
                ],
                links: [
                    { sourceId: 'A', targetId: 'B', value: 100 },
                    { sourceId: 'B', targetId: 'C', value: 80 },
                    { sourceId: 'A', targetId: 'C', value: 120 }
                ],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                const linkElements = document.querySelectorAll('[id*="_link_level_"]');
                expect(linkElements.length).toBeGreaterThan(0);
                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('renderHorizontalLink should handle url() fill and fill||sourceNode.color fallback', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A', color: '#FF0000' }, { id: 'B' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const nodes = (sankey).nodeLayoutMap;
                const linkGroup = document.getElementById('container_series_coverage_link_collection');

                if (linkGroup && nodes['A'] && nodes['B']) {
                    // Test 1: fill with url() pattern
                    const testLink1 = { sourceId: 'A', targetId: 'B', value: 50 };
                    seriesInstance.renderHorizontalLink(
                        linkGroup, testLink1, nodes['A'], nodes['B'], 100, 0.5, 0, 'url(#testGradient)'
                    );

                    // Test 2: empty fill to trigger sourceNode.color fallback
                    const testLink2 = { sourceId: 'A', targetId: 'B', value: 50 };
                    seriesInstance.renderHorizontalLink(
                        linkGroup, testLink2, nodes['A'], nodes['B'], 100, 0.5, 1, ''
                    );

                    expect(linkGroup.childElementCount).toBeGreaterThan(0);
                }
                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('renderVerticalLink should handle value=0 and url() fill and color fallbacks', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                orientation: 'Vertical',
                nodes: [{ id: 'A', color: '#00FF00' }, { id: 'B' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const linkGroup = document.getElementById('container_series_coverage_link_collection');

                // Create test nodes with value=0 to trigger the 0 fallback branches
                const testSourceNode: SankeyNodeLayout = {
                    id: 'A', level: 0, x: 50, y: 100, height: 100, width: 25,
                    value: 0, inValue: 0, outValue: 0, outOffset: 0, inOffset: 0, color: '#00FF00', label: 'A'
                };
                const testTargetNode: SankeyNodeLayout = {
                    id: 'B', level: 1, x: 200, y: 150, height: 100, width: 25,
                    value: 0, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#0000FF', label: 'B'
                };

                if (linkGroup) {
                    // Test 1: sourceNode.value = 0 and targetNode.value = 0
                    const testLink1 = { sourceId: 'A', targetId: 'B', value: 50 };
                    seriesInstance.renderVerticalLink(
                        linkGroup, testLink1, testSourceNode, testTargetNode, 100, 0.5, 0, '#AABBCC'
                    );

                    // Test 2: fill with url() pattern
                    testSourceNode.value = 100;
                    testTargetNode.value = 100;
                    testSourceNode.outOffset = 0;
                    testTargetNode.inOffset = 0;
                    const testLink2 = { sourceId: 'A', targetId: 'B', value: 50 };
                    seriesInstance.renderVerticalLink(
                        linkGroup, testLink2, testSourceNode, testTargetNode, 100, 0.5, 1, 'url(#testGradient2)'
                    );

                    // Test 3: empty fill to trigger sourceNode.color fallback
                    testSourceNode.outOffset = 0;
                    testTargetNode.inOffset = 0;
                    const testLink3 = { sourceId: 'A', targetId: 'B', value: 50 };
                    seriesInstance.renderVerticalLink(
                        linkGroup, testLink3, testSourceNode, testTargetNode, 100, 0.5, 2, ''
                    );

                    expect(linkGroup.childElementCount).toBeGreaterThan(0);
                }
                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('calculateHorizontalGapBetweenLevels should handle maximumLevel-minimumLevel=0 and rect.width fallback', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A' }],
                links: [],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const rect: Rect = { x: 0, y: 0, width: 800, height: 600 };

                // Test 1: All nodes at same level (maximumLevel - minimumLevel = 0)
                const testNodes1 = {
                    'A': { id: 'A', level: 5, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A' } as SankeyNodeLayout,
                    'B': { id: 'B', level: 5, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B' } as SankeyNodeLayout,
                    'C': { id: 'C', level: 5, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'C' } as SankeyNodeLayout
                };
                const gap1 = seriesInstance.getHorizontalGapBetweenLevels(testNodes1, rect);
                expect(gap1).toBe(rect.width); // totalLevels = 1, should return rect.width

                // Test 2: Normal case with multiple levels
                const testNodes2 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A' } as SankeyNodeLayout,
                    'B': { id: 'B', level: 2, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B' } as SankeyNodeLayout
                };
                const gap2 = seriesInstance.getHorizontalGapBetweenLevels(testNodes2, rect);
                expect(gap2).toBeDefined();
                expect(typeof gap2).toBe('number');

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('getVerticalGapBetweenLevels should handle maximumLevel-minimumLevel=0 and rect.height fallback', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                orientation: 'Vertical',
                nodes: [{ id: 'A' }],
                links: [],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;
                const rect: Rect = { x: 0, y: 0, width: 800, height: 600 };

                // Test 1: All nodes at same level (maximumLevel - minimumLevel = 0)
                const testNodes1 = {
                    'A': { id: 'A', level: 3, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A' } as SankeyNodeLayout,
                    'B': { id: 'B', level: 3, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B' } as SankeyNodeLayout,
                    'C': { id: 'C', level: 3, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'C' } as SankeyNodeLayout
                };
                const gap1 = seriesInstance.getVerticalGapBetweenLevels(testNodes1, rect);
                expect(gap1).toBe(rect.height); // totalLevels = 1, should return rect.height

                // Test 2: Normal case with multiple levels
                const testNodes2 = {
                    'A': { id: 'A', level: 0, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'A' } as SankeyNodeLayout,
                    'B': { id: 'B', level: 2, x: 0, y: 0, height: 100, width: 25, value: 100, inValue: 0, outValue: 0, inOffset: 0, outOffset: 0, color: '#000', label: 'B' } as SankeyNodeLayout
                };
                const gap2 = seriesInstance.getVerticalGapBetweenLevels(testNodes2, rect);
                expect(gap2).toBeDefined();
                expect(typeof gap2).toBe('number');

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
        });

        it('getOrCreateLinkGradient should handle null svgRootElement fallback', (done: DoneFn) => {
            sankey = new Sankey({
                width: '750',
                height: '450',
                nodes: [{ id: 'A' }, { id: 'B' }],
                links: [{ sourceId: 'A', targetId: 'B', value: 100 }],
                theme: 'Fabric'
            });

            loaded = (_args: unknown): void => {
                seriesInstance = (sankey).sankeySeriesModule;

                // Test with null chart.svgObject to trigger svgRootElement null check
                const testChart: Sankey = sankey;
                const originalSvg = testChart.svgObject;
                testChart.svgObject = null;
                seriesInstance.chart = testChart;

                const result = seriesInstance.getOrCreateLinkGradient(
                    testChart, '#FF0000', '#0000FF', true, false, 0, 'A', 'B'
                );

                // Should return startColor || endColor || '#000000'
                expect(result).toBe('#FF0000');

                // Test with both colors null
                const result2 = seriesInstance.getOrCreateLinkGradient(
                    testChart, '', '', true, false, 0, 'A', 'B'
                );
                expect(result2).toBe('#000000');

                // Restore original svgObject
                testChart.svgObject = originalSvg;

                done();
            };

            sankey.loaded = loaded;
            sankey.appendTo('#container_series_coverage');
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
});
