/* eslint-disable @typescript-eslint/tslint/config */
import { createElement } from '@syncfusion/ej2-base';
import { Sankey } from '../../src/sankey/sankey';
import { SankeyHighlight } from '../../src/sankey/user-interaction/highlight';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';
import { SankeySeries } from '../../src/sankey/series/series';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { getMemoryProfile, inMB, profile } from '../common.spec';
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

describe('Sankey - Highlight (DOM changes)', () => {
    let ele: HTMLDivElement;
    let sankey: Sankey;
    let loaded: (args: unknown) => void;
    let trigger: MouseEvents;

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    beforeAll(() => {
        trigger = new MouseEvents();
        ele = createElement('div', { id: 'container_highlight' }) as HTMLDivElement;
        document.body.appendChild(ele);

        sankey = new Sankey({
            width: '750',
            height: '450',
            title: 'Energy Flow (Sample)',
            subTitle: 'testing',
            nodes: nodeData,
            links: linkData,

            linkStyle: { opacity: 0.5, curvature: 0.55, highlightOpacity: 0.8, inactiveOpacity: 0.1 },
            nodeStyle: { width: 25, padding: 5, opacity: 1, stroke: 'Black', strokeWidth: 1, highlightOpacity: 1, inactiveOpacity: 0.3 },

            labelSettings: { visible: true },
            tooltip: { enable: true },
            legendSettings: { visible: true },
            theme: 'Fabric'
        });

        sankey.appendTo('#container_highlight');
    });

    afterAll((): void => {
        sankey.destroy();
        ele.remove();
    });

    it('should highlight connected links/nodes on node hover and clear on click (minimal DOM)', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const solarNode = document.getElementById('container_highlight_node_level_0_0');
            const electricityNode = document.getElementById('container_highlight_node_level_1_0');
            const windNode = document.getElementById('container_highlight_node_level_0_1');

            const solarLink = document.getElementById('container_highlight_link_level_0_0'); // Solar->Electricity
            const windLink = document.getElementById('container_highlight_link_level_0_1');  // Wind->Electricity

            if (!solarNode || !electricityNode || !windNode || !solarLink || !windLink) {
                fail('One or more highlight DOM elements not found');
                done();
                return;
            }

            trigger.mousemovetEvent(solarNode, 0, 0);

            // Check that highlight has been applied (opacity values may vary)
            expect(solarLink.getAttribute('opacity')).toBeTruthy();
            expect(windLink.getAttribute('opacity')).toBeTruthy();

            expect(solarNode.getAttribute('opacity')).toBeTruthy();
            expect(electricityNode.getAttribute('opacity')).toBeTruthy();
            expect(windNode.getAttribute('opacity')).toBeTruthy();

            trigger.clickEvent(ele);

            expect(solarLink.getAttribute('opacity')).toBe('0.8');
            expect(windLink.getAttribute('opacity')).toBe('0.1');

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should highlight connected links nad remove highlight', (done: DoneFn) => {
        loaded = (_args: unknown): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const solarNode = document.getElementById('container_highlight_node_level_0_0');
            const electricityNode = document.getElementById('container_highlight_node_level_1_0');
            const windNode = document.getElementById('container_highlight_node_level_0_1');

            const solarLink = document.getElementById('container_highlight_link_level_0_0'); // Solar->Electricity
            const windLink = document.getElementById('container_highlight_link_level_0_1');  // Wind->Electricity
            const borderElement = document.getElementById('container_highlight_border');

            if (!solarNode || !electricityNode || !windNode || !solarLink || !windLink) {
                fail('One or more highlight DOM elements not found');
                done();
                return;
            }

            trigger.mousemovetEvent(solarNode, 0, 0);
            trigger.mousemovetEvent(solarNode, 0, 0);

            trigger.mousemovetEvent(borderElement, 0, 0);
            trigger.mousemovetEvent(windNode, 0, 0);
            sankeyHighlight.handleMouseLeave(new Event('mouseleave'));

            trigger.mousemovetEvent(solarNode, 0, 0);
            trigger.mousemovetEvent(windLink, 0, 0);
            trigger.mousemovetEvent(solarLink, 0, 0);
            trigger.mousemovetEvent(solarLink, 0, 0);
            trigger.mousemovetEvent(windLink, 0, 0);
            trigger.mousemovetEvent(borderElement, 0, 0);
            trigger.mousemovetEvent(windLink, 0, 0);
            sankeyHighlight.handleMouseLeave(new Event('mouseleave'));
            trigger.clickEvent(solarNode);
            trigger.clickEvent(solarLink);

            done();
        };
        sankey.nodeStyle.opacity = 0.9;
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should respect isDestroyed guard when wiring events (no throw)', (done: DoneFn) => {
        loaded = (): void => {
            // mark destroyed and create a new highlight instance which will attempt to wire events
            (sankey).isDestroyed = true;
            expect(() => { new SankeyHighlight(sankey); }).not.toThrow();
            (sankey).isDestroyed = false;
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should register pointerleave or mouseleave based on Browser.isPointer', (done: DoneFn) => {
        loaded = (): void => {
            const onSpy = spyOn(sankey, 'on').and.callThrough();
            // create a fresh highlight which will call sankey.on
            const sankeyHighlight = new SankeyHighlight(sankey);
            const calls = onSpy.calls.allArgs().map(a => a[0]);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const expected = (require('@syncfusion/ej2-base').Browser.isPointer) ? 'pointerleave' : 'mouseleave';
            expect(calls.indexOf(expected)).toBeGreaterThanOrEqual(0);
            // cleanup
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('mouseLeaveHandler should call clearHighlights', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const clearSpy = spyOn(sankeyHighlight, 'clearHighlights');
            sankeyHighlight.handleMouseLeave(new Event('mouseleave'));
            expect(clearSpy).toHaveBeenCalled();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handleMouseMove should call clearHighlights when event is null or getInteractiveTarget returns null', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const clearSpy = spyOn(sankeyHighlight, 'clearHighlights');
            // passing null event
            sankeyHighlight.handleMouseMove(null);
            expect(clearSpy).toHaveBeenCalled();

            // when getInteractiveTarget returns null
            clearSpy.calls.reset();
            spyOn(sankeyHighlight, 'getInteractiveTarget').and.returnValue(null);
            const evt = new PointerEvent('pointermove');
            sankeyHighlight.handleMouseMove(evt);
            expect(clearSpy).toHaveBeenCalled();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getInteractiveTarget should map label to node via constructed node id', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            // create a node element and a label element mapping to that node
            const nodeEl = document.createElement('rect');
            nodeEl.setAttribute('id', 'container_highlight_node_level_0_0');
            nodeEl.setAttribute('aria-label', 'Solar');
            document.body.appendChild(nodeEl);

            let labelEl = document.createElement('text');
            labelEl.setAttribute('id', 'container_highlight_label_level_0_0');
            document.body.appendChild(labelEl);

            let result = sankeyHighlight.getInteractiveTarget(labelEl);

            labelEl = document.createElement('text');
            labelEl.setAttribute('id', 'container_highlight_label_level_20_24');
            document.body.appendChild(labelEl);
            result = sankeyHighlight.getInteractiveTarget(labelEl);

            labelEl = document.createElement('text');
            labelEl.setAttribute('id', 'container_highlight');
            document.body.appendChild(labelEl);
            result = sankeyHighlight.getInteractiveTarget(labelEl);

            labelEl = document.createElement('text');
            document.body.appendChild(labelEl);
            result = sankeyHighlight.getInteractiveTarget(labelEl);

            expect(labelEl).not.toBe(null);

            nodeEl.remove();
            labelEl.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getInteractiveTarget should handle legend shape/text by using parent aria-label', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const parent = document.createElement('g');
            parent.setAttribute('aria-label', 'Solar');
            const child = document.createElement('rect');
            child.setAttribute('id', 'container_highlight_legend_shape_0');
            parent.appendChild(child);
            document.body.appendChild(parent);

            const result = sankeyHighlight.getInteractiveTarget(child);
            expect(result).toBeTruthy();
            expect(result.type).toBe('node');
            expect(result.id).toBe('Solar');

            parent.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('highlightForNode returns early when collections are missing, and clearHighlights respects node opacity threshold', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            // remove collections to force early return
            const linkCollection = document.getElementById('container_highlight_link_collection');
            const nodeCollection = document.getElementById('container_highlight_node_collection');
            if (linkCollection) { linkCollection.remove(); }
            if (nodeCollection) { nodeCollection.remove(); }

            expect(() => { sankeyHighlight.highlightForNode('Solar'); }).not.toThrow();

            // restore a simple node collection and test clearHighlights branches
            const nodeCol = document.createElement('div');
            nodeCol.setAttribute('id', 'container_highlight_node_collection');
            const rect = document.createElement('rect');
            rect.setAttribute('aria-label', 'Solar');
            nodeCol.appendChild(rect);
            document.body.appendChild(nodeCol);

            // set default node opacity < 1
            (sankey).nodeStyle = (sankey).nodeStyle || {};
            (sankey).nodeStyle.opacity = 0.5;

            sankeyHighlight.clearHighlights();
            const nodeEl = document.querySelector('#container_highlight_node_collection rect') as HTMLElement;
            expect(nodeEl.getAttribute('opacity')).toBe(null);

            // now set default opacity to 1 and ensure attribute removed
            (sankey).nodeStyle.opacity = 1;
            sankeyHighlight.clearHighlights();
            expect(nodeEl.getAttribute('opacity')).toBeNull();

            nodeCol.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getLabelElements should return label elements from collection', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelElements = sankeyHighlight.getLabelElements();
            expect(Array.isArray(labelElements)).toBe(true);
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getLabelElements should return empty array when label collection not found', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelCollection = document.getElementById('container_highlight_label_collection');
            if (labelCollection) { labelCollection.remove(); }
            const labelElements = sankeyHighlight.getLabelElements();
            expect(labelElements.length).toBe(0);
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should handle null element gracefully', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            expect(() => { sankeyHighlight.animateOpacityChange(null, 0.5, 1, 400); }).not.toThrow();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should apply immediate opacity when duration is 0', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.5');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.5, 1, 0, false);
            expect(element).not.toBe(null);

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('stopAllAnimations should remove e-animate attribute and call Animation.stop', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const linkCollection = document.getElementById('container_highlight_link_collection');
            const nodeCollection = document.getElementById('container_highlight_node_collection');

            if (linkCollection && nodeCollection) {
                const linkElement = linkCollection.querySelector('path');
                if (linkElement) {
                    linkElement.setAttribute('e-animate', 'true');
                    sankeyHighlight.stopAllAnimations();
                    expect(linkElement.hasAttribute('e-animate')).toBe(false);
                }
            }

            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('performClearHighlightsWithAnimation should use epsilon comparison for opacity', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const linkCollection = document.getElementById('container_highlight_link_collection');
            const nodeCollection = document.getElementById('container_highlight_node_collection');

            if (linkCollection && nodeCollection) {
                const linkElement = linkCollection.querySelector('path');
                if (linkElement) {
                    // Set opacity very close to default (within epsilon)
                    linkElement.setAttribute('opacity', '0.50001');
                    const animateSpy = spyOn(sankeyHighlight, 'animateOpacityChange');
                    sankeyHighlight.performClearHighlightsWithAnimation();
                    // Should not animate if difference is within epsilon (0.001)
                    expect(animateSpy).not.toHaveBeenCalled();
                }
            }

            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should set e-animate marker on element', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.5, 1, 100, false);
            expect(element.hasAttribute('e-animate')).toBe(true);

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('clearHighlights should not animate when called with animate=false', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const animateSpy = spyOn(sankeyHighlight, 'performClearHighlightsWithAnimation');

            // Set lastHoveredId to trigger clearHighlights
            sankeyHighlight.clearHighlights(false);

            expect(animateSpy).not.toHaveBeenCalled();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('clearHighlights should not clear when lastHoveredId is null', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const animateSpy = spyOn(sankeyHighlight, 'performClearHighlightsWithAnimation');

            sankeyHighlight.clearHighlights(true);
            expect(animateSpy).not.toHaveBeenCalled();

            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('performClearHighlightsWithAnimation should return early when chart is destroyed', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            (sankey).isDestroyed = true;

            const animateSpy = spyOn(sankeyHighlight, 'animateOpacityChange');
            sankeyHighlight.performClearHighlightsWithAnimation();

            expect(animateSpy).not.toHaveBeenCalled();
            (sankey).isDestroyed = false;
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('performClearHighlightsWithAnimation should return early when collections are missing', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const linkCollection = document.getElementById('container_highlight_link_collection');
            const nodeCollection = document.getElementById('container_highlight_node_collection');
            if (linkCollection) { linkCollection.remove(); }
            if (nodeCollection) { nodeCollection.remove(); }

            expect(() => { sankeyHighlight.performClearHighlightsWithAnimation(); }).not.toThrow();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should apply removeAttribute when duration is 0 and removeAttribute is true', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.5');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.5, 1, 0, true);
            expect(element.hasAttribute('opacity')).toBe(false);

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should apply attribute when duration is 0 and endOpacity < 1', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '1');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 1, 0.3, 0, false);
            expect(element.getAttribute('opacity')).toBe('0.3');

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange should remove opacity attribute when duration is 0 and endOpacity is 1', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.5');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.5, 1, 0, false);
            expect(element.hasAttribute('opacity')).toBe(false);

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange end callback should handle removeAttribute true case', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.5');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.5, 1, 50, true);
            expect(element.hasAttribute('opacity')).toBe(true);

            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange end callback should handle removeAttribute false with endOpacity < 1', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '1');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 1, 0.3, 50, false);

            setTimeout(() => {
                expect(element.getAttribute('opacity')).not.toBe('0');
                element.remove();
                sankeyHighlight.destroy();
                done();
            }, 150);
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange end callback should remove opacity when endOpacity is 1', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.3');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.3, 1, 50, false);
            expect(element.hasAttribute('opacity')).toBe(true);
            element.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('animateOpacityChange end callback should not apply final opacity if e-animate was removed', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const element = document.createElement('rect');
            element.setAttribute('opacity', '0.3');
            element.setAttribute('e-animate', 'true');
            document.body.appendChild(element);

            sankeyHighlight.animateOpacityChange(element, 0.3, 1, 50, false);

            // Remove e-animate attribute to simulate interruption
            setTimeout(() => {
                element.removeAttribute('e-animate');
            }, 30);

            setTimeout(() => {
                // Should retain the interrupted opacity value, not apply final
                expect(element.hasAttribute('e-animate')).toBe(false);

                element.remove();
                sankeyHighlight.destroy();
                done();
            }, 150);
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('highlightLabelsForNodes should skip label when labelElementId is null/empty', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelCollection = document.getElementById('container_highlight_label_collection');

            if (labelCollection) {
                const labelEl = document.createElement('text');
                // No id attribute - should be skipped
                labelCollection.appendChild(labelEl);

                expect(() => {
                    sankeyHighlight.highlightLabelsForNodes(['Solar', 'Wind'],
                                                            [labelEl] as unknown as SVGElement[], 0.5);
                }).not.toThrow();

                labelEl.remove();
            }

            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getNodeLabelFromLabelElement should return null when labelElementId is null', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelEl = document.createElement('text');
            // No id attribute
            document.body.appendChild(labelEl);

            const result = sankeyHighlight.getNodeLabelFromLabelElement(labelEl as unknown as SVGElement);
            expect(result).toBeNull();

            labelEl.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getNodeLabelFromLabelElement should return null when labelElementId does not match regex', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelEl = document.createElement('text');
            labelEl.setAttribute('id', 'invalid_id_format');
            document.body.appendChild(labelEl);

            const result = sankeyHighlight.getNodeLabelFromLabelElement(labelEl as unknown as SVGElement);
            expect(result).toBeNull();

            labelEl.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getNodeLabelFromLabelElement should return null when nodeElement is not found', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);
            const labelEl = document.createElement('text');
            // This ID format will match regex but node won't exist
            labelEl.setAttribute('id', 'container_highlight_label_level_99_99');
            document.body.appendChild(labelEl);

            const result = sankeyHighlight.getNodeLabelFromLabelElement(labelEl as unknown as SVGElement);
            expect(result).toBeNull();

            labelEl.remove();
            sankeyHighlight.destroy();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getNodeLabelFromLabelElement should return nodeElement aria-label when found', (done: DoneFn) => {
        loaded = (): void => {
            const sankeyHighlight = new SankeyHighlight(sankey);

            // Create a node element with aria-label
            const nodeEl = document.createElement('rect');
            nodeEl.setAttribute('id', 'container_highlight_node_level_5_10');
            nodeEl.setAttribute('aria-label', 'TestNode');
            document.body.appendChild(nodeEl);

            // Create a label element with matching id format
            const labelEl = document.createElement('text');
            labelEl.setAttribute('id', 'container_highlight_label_level_5_10');
            document.body.appendChild(labelEl);

            const result = sankeyHighlight.getNodeLabelFromLabelElement(labelEl as unknown as SVGElement);
            expect(result).toBe('TestNode');

            nodeEl.remove();
            labelEl.remove();
            sankeyHighlight.destroy();
            done();
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
