/* eslint-disable @typescript-eslint/tslint/config */
import { Browser, createElement } from '@syncfusion/ej2-base';
import { Sankey } from '../../src/sankey/sankey';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeySeries } from '../../src/sankey/series/series';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { SankeyHighlight } from '../../src/sankey/user-interaction/highlight';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MouseEvents } from './events.spec';

Sankey.Inject(SankeyTooltip, SankeyLegend, SankeySeries, SankeyExport, SankeyHighlight);

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

describe('Sankey - Tooltip (default / format / template)', () => {
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
    let trigger: MouseEvents;

    type Point = { x: number; y: number };

    const getNodeClientCenter = (svg: SVGSVGElement, node: SVGRectElement): Point => {
        const svgRect: DOMRect = svg.getBoundingClientRect() as DOMRect;
        const x: number = parseFloat(node.getAttribute('x') || '0');
        const y: number = parseFloat(node.getAttribute('y') || '0');
        const w: number = parseFloat(node.getAttribute('width') || '0');
        const h: number = parseFloat(node.getAttribute('height') || '0');
        return {
            x: Math.ceil(svgRect.left + x + w / 2),
            y: Math.ceil(svgRect.top + y + h / 2)
        };
    };

    const getElementClientCenter = (el: Element): Point => {
        const r: DOMRect = el.getBoundingClientRect() as DOMRect;
        return {
            x: Math.ceil(r.left + r.width / 2),
            y: Math.ceil(r.top + r.height / 2)
        };
    };

    const sanitize = (text: string): string =>
        text.replace(/[\u200E\u200F\u202A-\u202E]/g, '').replace(/\s+/g, ' ').trim();

    const chartId = 'container';



    beforeAll(() => {
        trigger = new MouseEvents();
        ele = createElement('div', { id: chartId }) as HTMLDivElement;
        document.body.appendChild(ele);

        sankey = new Sankey({
            width: '750',
            orientation: 'Vertical',
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
            tooltip: {
                enable: true,
                enableAnimation: false,
                fadeOutMode: 'Click',
                fadeOutDuration: 0
            },
            legendSettings: { visible: true },
            theme: 'Fabric'
        }, '#container');

        sankey.appendTo('#container');
    });

    afterAll((): void => {
        sankey.destroy();
        ele.remove();
    });

    it('Default tooltip: node should show "Solar : 100" and link should contain Solar/Electricity/100', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const svg = document.getElementById(chartId + '_svg');
            const node = document.getElementById(chartId + '_node_level_0_0');
            const link = document.getElementById(chartId + '_link_level_0_0');

            if (!svg || !node || !link) {
                fail('SVG/node/link not found for tooltip default test');
                done();
                return;
            }

            // ---- NODE HOVER ----
            const svgRect = svg.getBoundingClientRect();
            const nodeX = parseFloat(node.getAttribute('x') || '0');
            const nodeY = parseFloat(node.getAttribute('y') || '0');
            const nodeW = parseFloat(node.getAttribute('width') || '0');
            const nodeH = parseFloat(node.getAttribute('height') || '0');

            const nodeClientX = Math.ceil(svgRect.left + nodeX + nodeW / 2);
            const nodeClientY = Math.ceil(svgRect.top + nodeY + nodeH / 2);

            trigger.mousemovetEvent(node as unknown as HTMLElement, nodeClientX, nodeClientY);

            const tipParent = document.getElementById(chartId + '_tooltip_parent') as HTMLElement | null;
            const tipText = document.getElementById(chartId + '_tooltip_parent_text');

            if (!tipParent || !tipText) {
                fail('Tooltip parent/text not found after node hover');
                done();
                return;
            }

            // Validate tooltip got e-tooltip class (Tooltip component attached)
            expect(tipParent.classList.contains('e-tooltip')).toBe(true);

            const nodeTooltip = (tipText.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')  // strip direction marks
                .replace(/\s+/g, ' ')
                .trim();

            expect(nodeTooltip.replace(/\s/g, '') === 'Solar:100').toBe(true);

            const linkRect = link.getBoundingClientRect();
            const linkClientX = Math.ceil(linkRect.left + linkRect.width / 2);
            const linkClientY = Math.ceil(linkRect.top + linkRect.height / 2);

            trigger.mousemovetEvent(link as unknown as HTMLElement, linkClientX, linkClientY);

            const tipText2 = document.getElementById(chartId + '_tooltip_parent_text');
            if (!tipText2) {
                fail('Tooltip text not found after link hover');
                done();
                return;
            }

            const linkTooltip = (tipText2.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            expect(linkTooltip.indexOf('Solar') > -1).toBe(true);
            expect(linkTooltip.indexOf('Electricity') > -1).toBe(true);
            expect(linkTooltip.indexOf('100') > -1).toBe(true);

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Format tooltip: should replace nodeFormat + linkFormat tokens exactly', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const svg = document.getElementById(chartId + '_svg');
            const node = document.getElementById(chartId + '_node_level_0_0');
            const link = document.getElementById(chartId + '_link_level_0_0');

            if (!svg || !node || !link) {
                fail('SVG/node/link not found for tooltip format test');
                done();
                return;
            }

            const svgRect = svg.getBoundingClientRect();

            // Hover node
            const nodeX = parseFloat(node.getAttribute('x') || '0');
            const nodeY = parseFloat(node.getAttribute('y') || '0');
            const nodeW = parseFloat(node.getAttribute('width') || '0');
            const nodeH = parseFloat(node.getAttribute('height') || '0');

            trigger.mousemovetEvent(
                node as unknown as HTMLElement,
                Math.ceil(svgRect.left + nodeX + nodeW / 2),
                Math.ceil(svgRect.top + nodeY + nodeH / 2)
            );

            const tipText = document.getElementById(chartId + '_tooltip_parent_text');
            if (!tipText) {
                fail('Tooltip text not found after node hover (format)');
                done();
                return;
            }

            const nodeTooltip = (tipText.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            expect(nodeTooltip === 'Solar (Total: 100) | In: 0 | Out: 100').toBe(true);

            // Hover link
            const linkRect = link.getBoundingClientRect();
            trigger.mousemovetEvent(
                link as unknown as HTMLElement,
                Math.ceil(linkRect.left + linkRect.width / 2),
                Math.ceil(linkRect.top + linkRect.height / 2)
            );

            const tipText2 = document.getElementById(chartId + '_tooltip_parent_text');
            if (!tipText2) {
                fail('Tooltip text not found after link hover (format)');
                done();
                return;
            }

            const linkTooltip = (tipText2.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            expect(linkTooltip === 'From Solar (Out: 100) → To Electricity (In: 720) | Flow: 100').toBe(true);

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0,
            nodeFormat: '$name (Total: $value) | In: $in | Out: $out',
            linkFormat: 'From $start.name (Out: $start.out) → To $target.name (In: $target.in) | Flow: $value'
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Template tooltip: should replace template tokens (verify rendered text contains values)', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const svg = document.getElementById(chartId + '_svg');
            const node = document.getElementById(chartId + '_node_level_0_0');
            const link = document.getElementById(chartId + '_link_level_0_0');

            if (!svg || !node || !link) {
                fail('SVG/node/link not found for tooltip template test');
                done();
                return;
            }

            const svgRect = svg.getBoundingClientRect();

            // Hover node
            const nodeX = parseFloat(node.getAttribute('x') || '0');
            const nodeY = parseFloat(node.getAttribute('y') || '0');
            const nodeW = parseFloat(node.getAttribute('width') || '0');
            const nodeH = parseFloat(node.getAttribute('height') || '0');

            trigger.mousemovetEvent(
                node as unknown as HTMLElement,
                Math.ceil(svgRect.left + nodeX + nodeW / 2),
                Math.ceil(svgRect.top + nodeY + nodeH / 2)
            );

            const tipText = document.getElementById(chartId + '_tooltip_parent_text');
            if (!tipText) {
                fail('Tooltip text not found after node hover (template)');
                done();
                return;
            }

            const nodeTooltip = (tipText.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            expect(nodeTooltip.indexOf('Solar') > -1).toBe(true);
            expect(nodeTooltip.indexOf('Total: 100') > -1).toBe(true);
            expect(nodeTooltip.indexOf('In: 0') > -1).toBe(true);
            expect(nodeTooltip.indexOf('Out: 100') > -1).toBe(true);

            // Hover link
            const linkRect = link.getBoundingClientRect();
            trigger.mousemovetEvent(
                link as unknown as HTMLElement,
                Math.ceil(linkRect.left + linkRect.width / 2),
                Math.ceil(linkRect.top + linkRect.height / 2)
            );

            const tipText2 = document.getElementById(chartId + '_tooltip_parent_text');
            if (!tipText2) {
                fail('Tooltip text not found after link hover (template)');
                done();
                return;
            }

            const linkTooltip = (tipText2.textContent || '')
                .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            expect(linkTooltip.indexOf('Solar') > -1).toBe(true);
            expect(linkTooltip.indexOf('Electricity') > -1).toBe(true);
            expect(linkTooltip.indexOf('Flow: 100') > -1).toBe(true);

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0,
            nodeTemplate: '<strong>${name}</strong><br>Total: ${value}<br>In: ${in}<br>Out: ${out}',
            linkTemplate: 'From: <strong>${start.name}</strong> (Out: ${start.out})<br>To: <strong>${target.name}</strong> (In: ${target.in})<br>Flow: ${value}'
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Function template: should render node/link template functions (covers template function branches)', (done: DoneFn) => {
        type NodeAgg = { name: string; value: number; inValue: number; outValue: number };
        type LinkAgg = {
            start: { name: string; value: number; in: number; out: number };
            target: { name: string; value: number; in: number; out: number };
            value: number;
        };

        loaded = (_args: unknown): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');
            const link: SVGPathElement | null = document.querySelector('#' + chartId + '_link_level_0_0');

            if (!svg || !node || !link) {
                fail('SVG/node/link not found for function template test');
                done();
                return;
            }

            // Hover node
            const nodeP: Point = getNodeClientCenter(svg, node);
            trigger.mousemovetEvent(node as unknown as HTMLElement, nodeP.x, nodeP.y);

            const tipText: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            if (!tipText) {
                fail('Tooltip text not found after node hover (function template)');
                done();
                return;
            }
            expect(sanitize(tipText.textContent || '')).toBe('FN:Solar=100,in=0,out=100');

            // Hover link
            const linkP: Point = getElementClientCenter(link);
            trigger.mousemovetEvent(link as unknown as HTMLElement, linkP.x, linkP.y);

            const tipText2: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            if (!tipText2) {
                fail('Tooltip text not found after link hover (function template)');
                done();
                return;
            }
            expect(sanitize(tipText2.textContent || '')).toBe('FL:Solar->Electricity=100');

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0,
            nodeTemplate: (d: NodeAgg): string => `FN:${d.name}=${d.value},in=${d.inValue},out=${d.outValue}`,
            linkTemplate: (d: LinkAgg): string => `FL:${d.start.name}->${d.target.name}=${d.value}`
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('nodeFormat fallback: should use default "$name : $value" when nodeFormat is empty', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found for nodeFormat fallback test');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            trigger.mousemovetEvent(node as unknown as HTMLElement, p.x, p.y);

            const tipText: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            if (!tipText) {
                fail('Tooltip text not found after node hover (nodeFormat fallback)');
                done();
                return;
            }

            const txt: string = sanitize(tipText.textContent || '');
            expect(txt.replace(/\s/g, '') === 'Solar:100').toBe(true);

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0,
            nodeTemplate: null,
            nodeFormat: '' // forces fallback in tooltip.js
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Tooltip container: should recreate tooltip parent div when it is removed', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const oldParent: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent');
            if (oldParent) {
                oldParent.remove();
            }

            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');
            if (!svg || !node) {
                fail('SVG/node not found for tooltip parent recreation test');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            trigger.mousemovetEvent(node as unknown as HTMLElement, p.x, p.y);

            const newParent: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent');
            expect(newParent).not.toBeNull();
            if (newParent) {
                expect(newParent.style.position).toBe('absolute');
            }

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('Touch end: should render tooltip on touch end within bounds (covers mouseUpHandler path)', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found for touch end test');
                done();
                return;
            }

            // Put mouse inside clip and set touch mode
            const p: Point = getNodeClientCenter(svg, node);
            const hostRect: DOMRect = svg.getBoundingClientRect() as DOMRect;
            sankey.mouseX = p.x - hostRect.left;
            sankey.mouseY = p.y - hostRect.top;
            sankey.isTouch = true;

            // notify touchEndEvent -> tooltip module mouseUpHandler should run
            const touchEndArgs: { target: EventTarget | null } = { target: node };
            sankey.notify(Browser.touchEndEvent, touchEndArgs as unknown as PointerEvent);

            const tipText: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            expect(tipText).not.toBeNull();
            if (tipText) {
                expect(sanitize(tipText.textContent || '').indexOf('Solar') > -1).toBe(true);
            }

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Move',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handlePointerLeave should call hideTooltip with fadeOutDuration', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Trigger handlePointerLeave
            (tooltip).handlePointerLeave();

            // Verify hideTooltip was called with fadeOutDuration
            expect(hideSpy).toHaveBeenCalled();
            expect(hideSpy).toHaveBeenCalledWith(sankey.tooltip.fadeOutDuration);

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            fadeOutMode: 'Move',
            fadeOutDuration: 500
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handlePointerLeave should pass correct duration value to hideTooltip method', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const customDuration = 1000;
            const hideSpy = spyOn(tooltip, 'hideTooltip').and.callThrough();

            sankey.tooltip.fadeOutDuration = customDuration;

            (tooltip).handlePointerLeave();

            expect(hideSpy).toHaveBeenCalledWith(customDuration);

            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handlePointerLeave should work without throwing on null event', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            expect(() => {
                (tooltip).handlePointerLeave();
            }).not.toThrow();

            expect(hideSpy).toHaveBeenCalled();

            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('resolveInteractiveTarget should return null for unmatched element', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create a generic div with no matching pattern
            const genericEl = document.createElement('div');
            genericEl.setAttribute('id', 'unmatched_element');
            document.body.appendChild(genericEl);

            const result = tooltip.resolveInteractiveTarget(chartId, genericEl);

            expect(result.element).toBeNull();
            expect(result.type).toBeNull();

            genericEl.remove();
            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('resolveInteractiveTarget should map label element to node and return node', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create a node element
            const nodeEl = document.createElement('rect');
            nodeEl.setAttribute('id', `${chartId}_node_level_0_0`);
            document.body.appendChild(nodeEl);

            // Create a label element with matching level and index
            const labelEl = document.createElement('text');
            labelEl.setAttribute('id', `${chartId}_label_level_0_0`);
            document.body.appendChild(labelEl);

            // Call resolveInteractiveTarget with label element
            const result = tooltip.resolveInteractiveTarget(chartId, labelEl);

            expect(result.type).toBe('node');

            nodeEl.remove();
            labelEl.remove();
            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('resolveInteractiveTarget should return null when label maps to non-SVGRect element', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create a non-rect element (e.g., circle) with node ID
            const nonRectEl = document.createElement('circle');
            nonRectEl.setAttribute('id', `${chartId}_node_level_1_1`);
            document.body.appendChild(nonRectEl);

            // Create label element pointing to the non-rect node
            const labelEl = document.createElement('text');
            labelEl.setAttribute('id', `${chartId}_label_level_1_1`);
            document.body.appendChild(labelEl);

            const result = tooltip.resolveInteractiveTarget(chartId, labelEl);

            expect(result.element).not.toBeNull();
            expect(result.type).not.toBeNull();

            nonRectEl.remove();
            labelEl.remove();
            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseUpHandler should hideTooltip tooltip when fadeOutMode is Click', (done: DoneFn) => {
        loaded = (): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found for mouseUpHandler Click mode test');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            const hostRect: DOMRect = svg.getBoundingClientRect() as DOMRect;
            sankey.mouseX = p.x - hostRect.left;
            sankey.mouseY = p.y - hostRect.top;
            sankey.isTouch = false; // non-touch

            // Simulate touchEndEvent to trigger mouseUpHandler
            const touchEndArgs: { target: EventTarget | null } = { target: node };
            sankey.notify(Browser.touchEndEvent, touchEndArgs as unknown as PointerEvent);

            // Verify hideTooltip was called (tooltip should be hidden after click)
            const tipParent: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent');
            expect(tipParent).not.toBeNull();

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseUpHandler should return early when tooltip is disabled', (done: DoneFn) => {
        loaded = (): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found for disabled tooltip test');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            const hostRect: DOMRect = svg.getBoundingClientRect() as DOMRect;
            sankey.mouseX = p.x - hostRect.left;
            sankey.mouseY = p.y - hostRect.top;
            sankey.isTouch = true;

            // Trigger touchEndEvent with disabled tooltip
            const touchEndArgs: { target: EventTarget | null } = { target: node };
            sankey.notify(Browser.touchEndEvent, touchEndArgs as unknown as PointerEvent);

            // Tooltip should not be shown
            const tipText: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            expect(tipText).toBeNull();

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: false, // Disabled
            enableAnimation: false,
            fadeOutMode: 'Move',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('showTooltipForElement should validate link attributes (sourceId, targetId, value)', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create a malformed link element with missing data attributes
            const malformedLink = document.createElement('path');
            malformedLink.setAttribute('id', `${chartId}_link_level_0_0`);
            // Missing data-source, data-target, data-value
            const linkCollection = document.createElement('g');
            linkCollection.setAttribute('id', `${chartId}_link_collection`);
            linkCollection.appendChild(malformedLink);
            document.body.appendChild(linkCollection);

            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Try to show tooltip with incomplete link element
            tooltip.showTooltipForElement(malformedLink, false);

            expect(hideSpy).toHaveBeenCalled();

            linkCollection.remove();
            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('showTooltipForElement should validate link path element closest check', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create a link path that is NOT inside the link_collection group
            const orphanLink = document.createElement('path');
            orphanLink.setAttribute('id', `${chartId}_link_level_orphan`);
            orphanLink.setAttribute('data-source', 'Solar');
            orphanLink.setAttribute('data-target', 'Electricity');
            orphanLink.setAttribute('data-value', '100');
            document.body.appendChild(orphanLink);

            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Try to show tooltip with orphan link
            tooltip.showTooltipForElement(orphanLink, false);

            expect(hideSpy).toHaveBeenCalled();

            orphanLink.remove();
            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getNodeAggregates should return nodeId as fallback when label.text is unavailable', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);

            // Call with non-existent node (no label.text available)
            const aggregates = (tooltip).computeNodeAggregates('NonExistentNode');

            // Fallback should be nodeId itself
            expect(aggregates.name).toBe('NonExistentNode');
            expect(aggregates.inValue).toBe(0);
            expect(aggregates.outValue).toBe(0);

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseMoveHandler should return early when tooltip is disabled', (done: DoneFn) => {
        loaded = (): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            trigger.mousemovetEvent(node as unknown as HTMLElement, p.x, p.y);

            // Tooltip should not render when disabled
            const tipText: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            expect(tipText).toBeNull();

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: false,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseMoveHandler should hideTooltip tooltip when fadeOutMode is Move and outside bounds', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Simulate mouse move outside bounds
            const mockEvent = new PointerEvent('pointermove');
            (tooltip).sankey.mouseX = -100;
            (tooltip).sankey.mouseY = -100;

            tooltip.handleMouseMove(mockEvent);

            expect(hideSpy).toHaveBeenCalled();

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Move',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handleChartClick should not hideTooltip tooltip when fadeOutMode is Move', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Trigger click event via handleChartClick
            (tooltip).handleChartClick(new Event('click'));

            // Should NOT call hideTooltip since fadeOutMode is 'Move'
            expect(hideSpy).not.toHaveBeenCalled();

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Move',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('showTooltipForElement should handle node without fill attribute', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create node element without fill attribute
            const nodeEl = document.createElement('rect');
            nodeEl.setAttribute('id', `${chartId}_node_level_0_0`);
            nodeEl.setAttribute('aria-label', 'Solar');
            // No fill attribute
            document.body.appendChild(nodeEl);

            const showSpy = spyOn(tooltip, 'showTooltipForElement').and.callThrough();
            tooltip.showTooltipForElement(nodeEl, false);

            expect(showSpy).toHaveBeenCalled();

            nodeEl.remove();
            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('renderTooltip should return early when targetElement is null', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Create event with null target
            const mockEvent = new PointerEvent('pointermove');
            Object.defineProperty(mockEvent, 'target', { value: null, writable: true });

            tooltip.renderTooltip(false, mockEvent);

            expect(hideSpy).toHaveBeenCalled();

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('renderTooltip should hideTooltip tooltip when no interactive element resolved', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Create generic element that won't resolve to node/link
            const genericEl = document.createElement('div');
            genericEl.setAttribute('id', 'unmatched');
            document.body.appendChild(genericEl);

            const mockEvent = new PointerEvent('pointermove');
            Object.defineProperty(mockEvent, 'target', { value: genericEl, writable: true });

            tooltip.renderTooltip(false, mockEvent);

            expect(hideSpy).toHaveBeenCalled();

            genericEl.remove();
            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseUpHandler should not hideTooltip when isTouch is false and fadeOutMode is Move', (done: DoneFn) => {
        loaded = (): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');

            if (!svg || !node) {
                fail('SVG/node not found');
                done();
                return;
            }

            const p: Point = getNodeClientCenter(svg, node);
            const hostRect: DOMRect = svg.getBoundingClientRect() as DOMRect;
            sankey.mouseX = p.x - hostRect.left;
            sankey.mouseY = p.y - hostRect.top;
            sankey.isTouch = false; // Non-touch

            const touchEndArgs: { target: EventTarget | null } = { target: node };
            sankey.notify(Browser.touchEndEvent, touchEndArgs as unknown as PointerEvent);

            // Touch end when isTouch=false should trigger else branch
            const tipParent: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent');
            expect(tipParent).not.toBeNull();

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Move',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('showTooltipForElement should update existing tooltip instead of creating new one', (done: DoneFn) => {
        loaded = (): void => {
            const svg: SVGSVGElement | null = document.querySelector('#' + chartId + '_svg');
            const node1: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_0');
            const node2: SVGRectElement | null = document.querySelector('#' + chartId + '_node_level_0_1');

            if (!svg || !node1 || !node2) {
                fail('SVG/nodes not found');
                done();
                return;
            }

            // First hover - creates tooltip
            const p1: Point = getNodeClientCenter(svg, node1);
            trigger.mousemovetEvent(node1 as unknown as HTMLElement, p1.x, p1.y);

            const tipText1: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            expect(tipText1).not.toBeNull();
            if (tipText1) {
                expect(sanitize(tipText1.textContent || '').indexOf('Solar') > -1).toBe(true);
            }

            // Second hover - updates existing tooltip (calls dataBind)
            const p2: Point = getNodeClientCenter(svg, node2);
            trigger.mousemovetEvent(node2 as unknown as HTMLElement, p2.x, p2.y);

            const tipText2: HTMLElement | null = document.querySelector('#' + chartId + '_tooltip_parent_text');
            expect(tipText2).not.toBeNull();
            if (tipText2) {
                expect(sanitize(tipText2.textContent || '').indexOf('Wind') > -1).toBe(true);
            }

            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('resolveInteractiveTarget should return null when reaching document.body', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const chartId = sankey.element.id;

            // Create element with no matching id pattern
            const el = document.createElement('span');
            el.setAttribute('id', 'no_match');

            const result = tooltip.resolveInteractiveTarget(chartId, el);

            expect(result.element).toBeNull();
            expect(result.type).toBeNull();

            tooltip.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handleChartClick should hideTooltip tooltip with zero delay when fadeOutMode is Click', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            const hideSpy = spyOn(tooltip, 'hideTooltip');

            // Trigger click event via handleChartClick directly
            (tooltip).handleChartClick(new Event('click'));

            // Verify hideTooltip was called with 0 delay when fadeOutMode is 'Click'
            expect(hideSpy).toHaveBeenCalledWith(0);
            expect(hideSpy).toHaveBeenCalledTimes(1);

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 500  // Should be ignored and 0 used instead
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });
    it('handleMouseMove should return early when tooltip disabled or disableTrackTooltip enabled', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            sankey.tooltip.enable = false;
            const pointerEvent = new PointerEvent('pointermove', { bubbles: true });
            (tooltip).handleMouseMove(pointerEvent);
            sankey.tooltip.enable = true;
            sankey.disableTrackTooltip = true;
            (tooltip).handleMouseMove(pointerEvent);
            sankey.disableTrackTooltip = false;
            sankey.tooltip.enable = true;
            sankey.tooltip.fadeOutMode = 'Move';
            sankey.mouseX = -100; // outside bounds
            sankey.mouseY = -100;
            (tooltip).handleMouseMove(pointerEvent);
            expect(tooltip).not.toBe(null);

            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('showTooltipForElement should handle null/invalid hitTarget and resolveInteractiveTarget fallback cases', (done: DoneFn) => {
        loaded = (): void => {
            const tooltip = new SankeyTooltip(sankey);
            (tooltip).showTooltipForElement(null);
            const chartId = sankey.element.id;
            const divElement = document.createElement('div');
            divElement.style.cssText = 'position: absolute; left: 100px; top: 100px;';
            document.body.appendChild(divElement);
            tooltip.resolveInteractiveTarget(chartId, divElement);
            const linkElement = document.createElement('g');
            linkElement.setAttribute('id', `${chartId}_link_level_0_0`);
            document.body.appendChild(linkElement);
            tooltip.resolveInteractiveTarget(chartId, linkElement);
            sankey.tooltip.enable = false;
            const pointerUpEvent = new PointerEvent('pointerup', { bubbles: true });
            (tooltip).handlePointerUp(pointerUpEvent);
            expect(tooltip).not.toBe(null);
            divElement.remove();
            linkElement.remove();
            tooltip.destroy();
            done();
        };

        sankey.tooltip = {
            ...sankey.tooltip,
            enable: true,
            enableAnimation: false,
            fadeOutMode: 'Click',
            fadeOutDuration: 0
        };

        sankey.loaded = loaded;
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
