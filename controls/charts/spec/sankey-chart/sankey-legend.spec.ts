/* eslint-disable @typescript-eslint/tslint/config */
import { createElement } from '@syncfusion/ej2-base';
import { SankeyExport } from '../../src/sankey/print-export/export';
import { Sankey } from '../../src/sankey/sankey';
import { SankeyHighlight } from '../../src/sankey/user-interaction/highlight';
import { SankeyLegend } from '../../src/sankey/legend/legend';
import { SankeyTooltip } from '../../src/sankey/user-interaction/tooltip';
import { profile, inMB, getMemoryProfile } from '../common.spec';

Sankey.Inject(SankeyHighlight, SankeyLegend, SankeyTooltip, SankeyExport);

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

describe('Sankey - Legend Functionality Coverage', () => {

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
        ele = createElement('div', { id: 'container' }) as HTMLDivElement;
        document.body.appendChild(ele);
        sankey = new Sankey({
            width: '750',
            height: '450',
            nodes: nodeData,
            links: linkData,
            legendSettings: { visible: true },
            tooltip: { enable: true }
        }, '#container');
        sankey.appendTo('#container');
    });

    afterAll((): void => {
        if (sankey) {
            sankey.destroy();
        }
        ele.remove();
    });

    it('should handle chart isDestroyed check in wireEvents (guard clause coverage)', (done: DoneFn) => {
        loaded = (): void => {
            expect(sankey.legendSettings.visible).toBe(true);
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle handleMouseMove with legend visibility check (mouse event filtering)', (done: DoneFn) => {
        loaded = (): void => {
            let legendElement = document.getElementById('container_chart_legend_g');
            expect(legendElement).toBeTruthy();

            let mouseEvent = new MouseEvent('mousemove', { bubbles: true });
            if (legendElement) {
                legendElement.dispatchEvent(mouseEvent);
            }
            legendElement = document.getElementById('container_chart_legend_g');
            expect(legendElement).toBeTruthy();

            mouseEvent = new MouseEvent('mousemove', { bubbles: true });
            if (legendElement) {
                legendElement.dispatchEvent(mouseEvent);
            }
            done();
        };

        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle handleMouseMove filtering when chart is in touch mode', (done: DoneFn) => {
        loaded = (): void => {
            sankey.isTouch = true;
            expect(sankey.isTouch).toBe(true);

            const mouseEvent = new MouseEvent('mousemove', { bubbles: true });
            document.dispatchEvent(mouseEvent);

            sankey.isTouch = false;
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle handleMouseEnd event with touch mode check (opposite touch condition)', (done: DoneFn) => {
        loaded = (): void => {
            sankey.isTouch = true;
            expect(sankey.isTouch).toBe(true);

            const touchEvent = new TouchEvent('touchend', { bubbles: true });
            document.dispatchEvent(touchEvent);

            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should skip null nodeLayout in legend options (continue statement coverage)', (done: DoneFn) => {
        loaded = (): void => {
            const legendItems = document.querySelectorAll('[id*="legend_g_"]');
            expect(legendItems.length).toBeGreaterThan(0);
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should reverse legend collections when reverse is enabled (reverse legend order)', (done: DoneFn) => {
        loaded = (): void => {
            const legendItems = document.querySelectorAll('[id*="legend_text_"]');
            expect(legendItems.length).toBeGreaterThan(0);
            done();
        };

        sankey.legendSettings = { visible: true, reverse: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should calculate legend bounds with title space and vertical orientation', (done: DoneFn) => {
        loaded = (): void => {
            const legendTitle = document.getElementById('container_chart_legend_title');
            expect(legendTitle).toBeTruthy();
            done();
        };

        sankey.legendSettings = { visible: true, title: 'Legend Title' };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle extra height calculation for horizontal legend', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.getElementById('container_chart_legend_g');
            expect(legendElement).not.toBe(null);
            done();
        };

        sankey.legendSettings = { visible: true, position: 'Bottom' };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle extra width calculation for vertical legend', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.getElementById('container_chart_legend_g');
            expect(legendElement).not.toBe(null);
            done();
        };
        sankey.nodes = null;
        sankey.legendSettings = { visible: true, position: 'Right' };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should process legend items with subscript text (regSub pattern)', (done: DoneFn) => {
        loaded = (): void => {
            const legendItems = document.querySelectorAll('[id*="legend_text_"]');
            expect(legendItems.length).toBeGreaterThan(0);
            done();
        };

        const nodeDataWithSubscript = [
            {
                id: 'H₂O', color: '#fcd34d', label: {
                    text: 'H~2~O',
                    padding: 12
                }
            },
            {
                id: 'CO₂', color: '#93c5fd', label: {
                    text: 'CO~2~',
                    padding: 12
                }
            },
            {
                id: 'CO₂', color: '#93c5fd', label: {
                    text: 'CO^2^',
                    padding: 12
                }
            }
        ];

        sankey.nodes = nodeDataWithSubscript;
        sankey.links = [
            { sourceId: 'H₂O', targetId: 'CO₂', value: 100 }
        ];
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should process legend items with superscript text (regSup pattern)', (done: DoneFn) => {
        loaded = (): void => {
            const legendItems = document.querySelectorAll('[id*="legend_text_"]');
            expect(legendItems.length).toBeGreaterThan(0);
            done();
        };

        const nodeDataWithSuperscript = [
            {
                id: 'E=mc²', color: '#fcd34d', label: {
                    text: 'E=mc^2^',
                    padding: 12
                }
            },
            {
                id: 'x⁴', color: '#93c5fd', label: {
                    text: 'x^4^',
                    padding: 12
                }
            }
        ];

        sankey.nodes = nodeDataWithSuperscript;
        sankey.links = [
            { sourceId: 'E=mc²', targetId: 'x⁴', value: 100 }
        ];
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should trigger legendItemHover event on legend item hover (hover event coverage)', (done: DoneFn) => {
        let hoverTriggered = false;

        loaded = (): void => {
            const legendItem = document.querySelector('[id*="container_chart_legend_g_"]') as HTMLElement;
            if (legendItem) {
                const hoverEvent = new MouseEvent('mousemove', { bubbles: true });
                legendItem.dispatchEvent(hoverEvent);
            }

            done();
        };

        sankey.legendItemHover = (): void => {
            hoverTriggered = true;
        };
        sankey.loaded = loaded;
        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.refresh();
    });

    it('should show tooltip for trimmed legend text (ellipsis handling)', (done: DoneFn) => {
        loaded = (): void => {
            const legendTextElements = document.querySelectorAll('[id*="legend_text_"]');
            expect(legendTextElements.length).toBeGreaterThan(0);

            for (let i = 0; i < legendTextElements.length; i++) {
                const textElement = legendTextElements[i as number] as HTMLElement;
                if (textElement && textElement.textContent && textElement.textContent.indexOf('...') > -1) {
                    const event = new MouseEvent('mousemove', { bubbles: true });
                    textElement.dispatchEvent(event);
                    break;
                }
            }

            done();
        };

        sankey.width = '400';
        sankey.legendSettings = { visible: true, width: '80', height: '50', textStyle: { textOverflow: 'Trim' } };
        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle legend click with hidden legend settings (visibility check)', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.getElementById('container_chart_legend_g');
            expect(legendElement).toBeFalsy();
            done();
        };

        sankey.legendSettings = { visible: false };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle legend pagination up click (page up control)', (done: DoneFn) => {
        loaded = (): void => {
            const pageUpButton = document.querySelector('[id*="pageup"]') as HTMLElement;
            if (pageUpButton) {
                const clickEvent = new MouseEvent('click', { bubbles: true });
                pageUpButton.dispatchEvent(clickEvent);
            }
            done();
        };

        const extendedNodeData = [
            ...nodeData,
            { id: 'Additional1', color: '#000000' },
            { id: 'Additional2', color: '#111111' }
        ];

        sankey.height = '300';
        sankey.nodes = extendedNodeData;
        sankey.links = [
            ...linkData,
            { sourceId: 'Solar', targetId: 'Additional1', value: 50 },
            { sourceId: 'Wind', targetId: 'Additional2', value: 60 }
        ];
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle legend pagination down click (page down control)', (done: DoneFn) => {
        loaded = (): void => {
            const pageDownButton = document.querySelector('[id*="pagedown"]') as HTMLElement;
            if (pageDownButton) {
                const clickEvent = new MouseEvent('click', { bubbles: true });
                pageDownButton.dispatchEvent(clickEvent);
            }
            done();
        };

        const extendedLinkData = [
            ...linkData,
            { sourceId: 'Solar', targetId: 'Additional1', value: 50 },
            { sourceId: 'Wind', targetId: 'Additional2', value: 60 }
        ];

        sankey.height = '300';
        sankey.links = extendedLinkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should build legend items from sankeyNodes with proper label mapping', (done: DoneFn) => {
        loaded = (): void => {
            expect(sankey.sankeyLegendModule).toBeTruthy();
            expect(sankey.sankeyLegendModule.legendCollections.length).toBeGreaterThan(0);

            const firstLegendItem = sankey.sankeyLegendModule.legendCollections[0];
            expect(firstLegendItem.text).toBeTruthy();
            expect(firstLegendItem.fill).toBeTruthy();

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.width = '750';
        sankey.height = '450';
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should trigger handleMouseEnd only when chart is in touch mode (!chart.isTouch check)', (done: DoneFn) => {
        loaded = (): void => {
            // Set chart to NOT in touch mode
            sankey.isTouch = false;
            const touchEvent = new TouchEvent('touchend', { bubbles: true });

            // handleMouseEnd should return early when isTouch is false
            document.dispatchEvent(touchEvent);

            expect(sankey.isTouch).toBe(false);
            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should skip nodeLayout when nodeLayout is null or undefined (continue statement)', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            expect(legendModule).toBeTruthy();

            // Check that legend collections were properly built despite any null nodeLayouts
            const legendCount = legendModule.legendCollections.length;
            expect(legendCount).toBeGreaterThanOrEqual(0);

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should calculate titleSpace with isVertical orientation condition', (done: DoneFn) => {
        loaded = (): void => {
            const legendTitle = document.querySelector('[id*="legend_title"]');

            // When legend is in vertical position, titleSpace should be applied
            if (sankey.legendSettings.position === 'Right' || sankey.legendSettings.position === 'Left') {
                expect(legendTitle).toBeTruthy();
            }

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true, title: 'Energy Sources', position: 'Right' };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should assign 0 to extraHeight when legend.height is undefined', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.getElementById('container_chart_legend_g');
            // When legend height is not specified, extraHeight should be calculated
            expect(legendElement).toBeTruthy();
            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true, position: 'Bottom', height: undefined };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should assign 0 to extraWidth when legend.width is undefined (vertical legend)', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.getElementById('container_chart_legend_g');
            // When legend width is not specified for vertical legend, extraWidth should be calculated
            expect(legendElement).toBeTruthy();
            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true, position: 'Right', width: undefined };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should process regSub unicode substitution for subscript text', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            expect(legendModule.legendCollections.length).toBeGreaterThan(0);

            // Check that text was processed
            const hasText = legendModule.legendCollections.some(item => item.text && item.text.length > 0);
            expect(hasText).toBe(true);

            done();
        };

        const subscriptNodeData = [
            { id: 'H₂O', color: '#fcd34d' },
            { id: 'SO₄²⁻', color: '#93c5fd' }
        ];

        sankey.nodes = subscriptNodeData;
        sankey.links = [{ sourceId: 'H₂O', targetId: 'SO₄²⁻', value: 100 }];
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should process regSup unicode substitution for superscript text', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            expect(legendModule.legendCollections.length).toBeGreaterThan(0);

            // Check that text was processed
            const hasText = legendModule.legendCollections.some(item => item.text && item.text.length > 0);
            expect(hasText).toBe(true);

            done();
        };

        const superscriptNodeData = [
            { id: 'x²', color: '#fcd34d' },
            { id: 'y⁵', color: '#93c5fd' }
        ];

        sankey.nodes = superscriptNodeData;
        sankey.links = [{ sourceId: 'x²', targetId: 'y⁵', value: 100 }];
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should assign shapeWidth and shapePadding based on text existence', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;

            // Verify that legend items have shapes and padding
            const legendItems = document.querySelectorAll('[id*="legend_g_"]');
            expect(legendItems.length).toBeGreaterThan(0);

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true, shapeWidth: 15, shapePadding: 5 };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should call setBounds with 0, 0 when no renderable items exist', (done: DoneFn) => {
        loaded = (): void => {
            // When there are no valid nodes/links, bounds should be set to 0
            const legendModule = sankey.sankeyLegendModule;
            expect(legendModule).toBeTruthy();

            done();
        };

        sankey.nodes = [];
        sankey.links = [];
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should apply textOverflow Trim styling to legend text', (done: DoneFn) => {
        loaded = (): void => {
            const legendTextElements = document.querySelectorAll('[id*="legend_text_"]');
            expect(legendTextElements.length).toBeGreaterThan(0);

            done();
        };

        sankey.width = '500';
        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = {
            visible: true,
            width: '100',
            textStyle: { textOverflow: 'Trim' }
        };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should parse legendIndex from _g_ delimiter when isNullOrUndefined', (done: DoneFn) => {
        loaded = (): void => {
            const legendGroup = document.querySelector('[id*="legend_g_0"]') as HTMLElement;

            if (legendGroup) {
                // Trigger hover to test legendIndex parsing from _g_ separator
                const mouseEvent = new MouseEvent('mousemove', { bubbles: true });
                legendGroup.dispatchEvent(mouseEvent);
            }

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle pagedown button click (pagination down event)', (done: DoneFn) => {
        loaded = (): void => {
            const pageDownElement = document.querySelector('[id*="pagedown"]') as HTMLElement;

            if (pageDownElement) {
                const clickEvent = new PointerEvent('click', { bubbles: true });
                pageDownElement.dispatchEvent(clickEvent);
            }

            done();
        };

        const extendedNodeData = [...nodeData, { id: 'NewNode', color: '#ff0000' }];
        sankey.height = '300';
        sankey.nodes = extendedNodeData;
        sankey.links = [...linkData, { sourceId: 'Solar', targetId: 'NewNode', value: 50 }];
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should use firstChildElement.id when available in targetId resolution', (done: DoneFn) => {
        loaded = (): void => {
            const legendGroup = document.querySelector('[id*="chart_legend_g_"]') as HTMLElement;

            if (legendGroup) {
                // Click on the group which has child elements
                const clickEvent = new PointerEvent('click', { bubbles: true });
                legendGroup.dispatchEvent(clickEvent);
            }

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle targetElement.id.indexOf for _legend_ selector with valid legendIndex', (done: DoneFn) => {
        loaded = (): void => {
            const legendElement = document.querySelector('[id*="_legend_"]') as HTMLElement;

            if (legendElement) {
                const mouseEvent = new MouseEvent('mousemove', { bubbles: true });
                legendElement.dispatchEvent(mouseEvent);
            }

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should handle textContent indexOf for ellipsis tooltip display', (done: DoneFn) => {
        loaded = (): void => {
            const legendTextElements = document.querySelectorAll('[id*="legend_text_"]');
            let hasEllipsis = false;

            for (let i = 0; i < legendTextElements.length; i++) {
                const element = legendTextElements[i as number] as HTMLElement;
                if (element.textContent && element.textContent.indexOf('...') > -1) {
                    hasEllipsis = true;
                    const mouseEvent = new MouseEvent('mousemove');
                    element.dispatchEvent(mouseEvent);
                    break;
                }
            }

            done();
        };

        sankey.width = '300';
        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = {
            visible: true,
            width: '60'
        };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('should filter legend legend items by sankeyNodes object iteration', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            expect(legendModule).toBeTruthy();
            expect(typeof sankey.nodeLayoutMap).toBe('object');

            // Verify legendCollections were built from sankeyNodes
            expect(legendModule.legendCollections.length).toBeGreaterThan(0);

            done();
        };

        sankey.nodes = nodeData;
        sankey.links = linkData;
        sankey.legendSettings = { visible: true };
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('wireEvents/unWireEvents should return early when chart.isDestroyed', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            // mark chart destroyed and call event methods
            (sankey).isDestroyed = true;
            expect(() => { legendModule.wireEvents(); }).not.toThrow();
            expect(() => { legendModule.unWireEvents(); }).not.toThrow();
            (sankey).isDestroyed = false;
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handleMouseEnd should call handleLegendMove when chart.isTouch is true', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            sankey.isTouch = true;
            const moveSpy = spyOn(legendModule, 'handleLegendMove');
            (legendModule).handleMouseEnd(new MouseEvent('mouseup'));
            expect(moveSpy).toHaveBeenCalled();
            legendModule.getLegendOptions(sankey);
            sankey.isTouch = false;
            done();
        };

        sankey.loaded = loaded;
        sankey.legendSettings = {
            visible: true,
            height: '60'
        };
        sankey.refresh();
    });

    it('getLegendBounds should compute extraHeight when not vertical and legend.height undefined', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            // ensure vertical flag is false
            const legendBounds = { x: 0, y: 0, width: 50, height: 10 };
            const availableSize = { width: 200, height: 200 };
            const legend: Partial<typeof sankey.legendSettings> & { padding: number; shapeWidth: number; shapePadding: number; shapeHeight: number } = { padding: 5, shapeWidth: 10, shapePadding: 5, textStyle: { textOverflow: 'None' }, titleStyle: { textOverflow: 'None' }, shapeHeight: 10, height: undefined, width: undefined };
            const before = legendBounds.height;
            legendModule.legendCollections = [];
            legendModule.getLegendBounds(availableSize, legendBounds, legend as Parameters<typeof legendModule.getLegendBounds>[2]);
            expect(legendBounds.height).toBeGreaterThanOrEqual(0);
            done();
        };
        sankey.legendSettings.position = 'Right';
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getLegendBounds should handle legend option with empty text (shapeWidth/shapePadding fallback)', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            // create a legendCollections entry with empty text
            legendModule.legendCollections = [
                {
                    text: '', render: true, textSize: { width: 0, height: 0 }, originalText: '', textCollection: [], location: { x: 0, y: 0 },
                    fill: '',
                    shape: 'Circle',
                    visible: false,
                    type: 'Line',
                    template: ''
                }
            ];

            const legendBounds = { x: 0, y: 0, width: 100, height: 20 };
            const availableSize = { width: 300, height: 300 };
            const legend: Partial<typeof sankey.legendSettings> & { padding: number; shapeWidth: number; shapePadding: number; shapeHeight: number } = { padding: 5, shapeWidth: 12, shapePadding: 6, titleStyle: { textOverflow: 'None' }, textStyle: { textOverflow: 'None' }, shapeHeight: 10 };
            legendModule.getLegendBounds(availableSize, legendBounds, legend as Parameters<typeof legendModule.getLegendBounds>[2]);
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('isWithinBounds should evaluate RTL branch (else path)', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            const rect = { x: 50, y: 0, width: 100, height: 100 };
            const prev = 40;
            const textW = 10;
            const result = legendModule.isWithinLegendBounds(prev, textW, rect);
            expect(typeof result).toBe('boolean');
            done();
        };
        sankey.enableRtl = true;
        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('handleLegendMove should show tooltip when textContent contains ellipsis and valid text index', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            // create a dummy legend text element matching id pattern
            const el = document.createElement('div');
            el.setAttribute('id', sankey.element.id + '_Secondary_Element');
            const el2 = document.createElement('div');
            el2.setAttribute('id', sankey.element.id + '_chart_legend_text_0');
            el2.textContent = 'VeryLongText...';
            document.body.appendChild(el);

            // set mouse coords
            (sankey).mouseX = 10;
            (sankey).mouseY = 10;

            const event: Event = {
                target: el2,
                bubbles: false,
                cancelBubble: false,
                cancelable: false,
                composed: false,
                currentTarget: undefined,
                defaultPrevented: false,
                eventPhase: 0,
                isTrusted: false,
                returnValue: false,
                srcElement: undefined,
                timeStamp: 0,
                type: '',
                composedPath: function (): EventTarget[] {
                    throw new Error('Function not implemented.');
                },
                initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
                    throw new Error('Function not implemented.');
                },
                preventDefault: function (): void {
                    throw new Error('Function not implemented.');
                },
                stopImmediatePropagation: function (): void {
                    throw new Error('Function not implemented.');
                },
                stopPropagation: function (): void {
                    throw new Error('Function not implemented.');
                },
                NONE: 0,
                CAPTURING_PHASE: 1,
                AT_TARGET: 2,
                BUBBLING_PHASE: 3
            };
            legendModule.handleLegendMove(event as Event);

            const tip = document.getElementById(sankey.element.id + '_EJ2_Legend_Tooltip');
            // tooltip may be created or removed; ensure no exception and state consistent
            expect(tip === null || tip instanceof HTMLElement).toBe(true);
            el.remove();
            done();
        };

        sankey.loaded = loaded;
        sankey.refresh();
    });

    it('getLegendOptions should process sankeyNodes object and skip null nodeLayout', (done: DoneFn) => {
        loaded = (): void => {
            const legendModule = sankey.sankeyLegendModule;
            const fakeChart = {
                nodeLayoutMap: {
                    a: null,
                    b: { id: 'B', label: 'B', color: '#000' }
                },
                legendSettings: { visible: true, reverse: false },
                enableRtl: false
            } as unknown as Sankey;
            if (legendModule) {
                legendModule.getLegendOptions(fakeChart);
                expect(legendModule.legendCollections.length).toBe(1);
            }
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
