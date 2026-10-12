import { Sankey } from '../sankey';
import { SankeyTooltipSettingsModel } from '../model/sankey-base-model';
import { Tooltip as SVGTooltip, Rect } from '@syncfusion/ej2-svg-base';
import { ChartLocation, getElement, withInBounds } from '../../common/utils/helper';
import { SankeyNodeAggregates, SankeyNodeLayout, SankeyTooltipRenderEventArgs, tooltipConfigurationOptions } from '../model/sankey-interface';
import { SankeyLink, SankeyNode } from '../model/sankey-base';
import { Browser } from '@syncfusion/ej2-base';

/**
 * Tooltip rendering module for Sankey Chart.
 */
export class SankeyTooltip {
    /** @private */
    public sankey: Sankey;
    /** @private */
    public svgTooltip: SVGTooltip;
    private tooltipTimer: number;

    /**
     * Constructor.
     *
     * @param {Sankey} sankey - Sankey chart instance.
     */
    constructor(sankey: Sankey) {
        this.sankey = sankey;
        this.wireEvents();
    }


    /**
     * Wires all tooltip-related event listeners to the Sankey chart instance.
     *
     * This method attaches pointer, touch, mouse, and click events required for
     * tooltip rendering and lifecycle management.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        const sankeyChart: Sankey = this.sankey;
        if (!sankeyChart || sankeyChart.isDestroyed) {
            return;
        }
        const pointerLeaveEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        sankeyChart.on(Browser.touchMoveEvent, this.handlePointerMove, this);
        sankeyChart.on(Browser.touchEndEvent, this.handlePointerUp, this);
        sankeyChart.on(pointerLeaveEvent, this.handlePointerLeave, this);
        sankeyChart.on('click', this.handleChartClick, this);
    }

    /**
     * Unwires all tooltip-related event listeners from the Sankey chart instance.
     *
     * @returns {void}
     */
    private unwireEvents(): void {
        const sankeyChart: Sankey = this.sankey;
        if (!sankeyChart || sankeyChart.isDestroyed) { return; }

        const pointerLeaveEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';

        sankeyChart.off(Browser.touchMoveEvent, this.handlePointerMove);
        sankeyChart.off(Browser.touchEndEvent, this.handlePointerUp);
        sankeyChart.off(pointerLeaveEvent, this.handlePointerLeave);
        sankeyChart.off('click', this.handleChartClick);
    }

    /**
     * Acts as a proxy to forward pointer and touch move events
     * to the existing handleMouseMove method.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event.
     * @returns {void}
     */
    private handlePointerMove(event: PointerEvent | TouchEvent): void {
        // setMouseXY is already handled before notify, so mouse coordinates are available
        this.handleMouseMove(event as PointerEvent);
    }

    /**
     * Handles chart click events to hideTooltip the tooltip when fade-out mode is set to click.
     *
     * @param {Event} event - The click event triggered on the chart.
     * @returns {void}
     * @private
     */
    public handleChartClick(event: Event): void {
        const sankeyChart: Sankey = this.sankey;

        if (sankeyChart.tooltip.fadeOutMode === 'Click') {
            this.hideTooltip(0);
        }
    }

    /**
     * Listens mouse move events inside the Sankey chart.
     *
     * @param {PointerEvent} event - The mouse or pointer move event within the chart.
     * @returns {void}
     * @private
     */
    public handleMouseMove(event: PointerEvent): void {
        const sankeyChart: Sankey = this.sankey;

        if (!sankeyChart.tooltip.enable || sankeyChart.disableTrackTooltip) { return; }

        if (withInBounds(sankeyChart.mouseX, sankeyChart.mouseY, sankeyChart.initialClipRect)) {
            this.renderTooltip(false, event);
        } else if (sankeyChart.tooltip.fadeOutMode === 'Move') {
            this.hideTooltip();
        }
    }

    /**
     * Shows tooltip for a given SVG element using the current chart mouse coordinates or a fallback position.
     *
     * @param {Element} targetElement - The SVG target element to show the tooltip for (node <rect> or link <path>).
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {ChartLocation} [fallbackPosition] - Optional fallback position to place the tooltip when mouse coordinates are not applicable.
     * @returns {void}
     *
     * @private
     */
    public showTooltipForElement(targetElement: Element, isInitialRender: boolean = false, fallbackPosition?: ChartLocation): void {
        clearTimeout(this.tooltipTimer);

        const sankeyChart: Sankey = this.sankey;
        const tooltipSettings: SankeyTooltipSettingsModel = sankeyChart.tooltip;

        const POINTER_PADDING: number = 4;
        let location: ChartLocation;

        // Hit-test
        let hitTarget: HTMLElement | null = null;
        if (targetElement) {
            hitTarget = targetElement as HTMLElement; // Use event.target (direct)
        }
        if (!hitTarget) { return this.hideTooltip(); }

        if (fallbackPosition) {
            location = fallbackPosition;
        } else {
            // Mouse hover → use current mouse position
            const adjustedX: number = sankeyChart.mouseX - sankeyChart.initialClipRect.x + (POINTER_PADDING * 2);
            const adjustedY: number = sankeyChart.mouseY - sankeyChart.initialClipRect.y + POINTER_PADDING;
            location = { x: adjustedX, y: adjustedY } as ChartLocation;
        }

        // Detect node or link
        const nodeElementIdPrefix: string = `${sankeyChart.element.id}_node_`;
        const linkCollectionId: string = `${sankeyChart.element.id}_link_collection`;
        let content: string = '';
        let template: string | Function = null;

        let tooltipData: SankeyNodeAggregates;
        const isNodeElement: boolean = hitTarget.id.indexOf('_node_level_') > -1 && hitTarget instanceof SVGRectElement;

        if (isNodeElement) {
            // Node
            const nodeId: string = hitTarget.getAttribute('aria-label') as string;
            const nodeAggregates: SankeyNodeAggregates = this.computeNodeAggregates(nodeId, hitTarget.getAttribute('fill'));
            tooltipData = {
                name: nodeAggregates.name,
                value: nodeAggregates.value,
                inValue: nodeAggregates.inValue,
                outValue: nodeAggregates.outValue
            };
            template = tooltipSettings.nodeTemplate || null;

            if (template) {
                if (typeof template === 'string') {
                    // Interpolate placeholders in string template
                    content = template
                        .replace(/\${name}/g, tooltipData.name)
                        .replace(/\${value}/g, tooltipData.value.toString())
                        .replace(/\${in}/g, tooltipData.inValue.toString())
                        .replace(/\${out}/g, tooltipData.outValue.toString());
                } else if (typeof template === 'function') {
                    // Call function with tooltipData
                    content = template(tooltipData);
                }
            } else {
                // Fallback to default format
                let defaultFormat: string = tooltipSettings.nodeFormat || '$name : $value';
                defaultFormat = defaultFormat
                    .replace(/\$\{name\}/g, '$name')
                    .replace(/\$\{value\}/g, '$value')
                    .replace(/\$\{in\}/g, '$in')
                    .replace(/\$\{out\}/g, '$out');
                content = defaultFormat
                    .replace(/\$name/g, nodeAggregates.name)
                    .replace(/\$value/g, nodeAggregates.value.toString())
                    .replace(/\$in/g, nodeAggregates.inValue.toString())
                    .replace(/\$out/g, nodeAggregates.outValue.toString());
            }
        } else if (
            hitTarget.tagName.toLowerCase() === 'path' &&
            hitTarget.closest(`[id="${linkCollectionId}"]`)
        ) {
            const linkPathElement: SVGPathElement | null = (hitTarget as Element).closest('path') as SVGPathElement | null;

            const sourceId: string = linkPathElement.getAttribute('data-source') as string;
            const targetId: string = linkPathElement.getAttribute('data-target') as string;
            const valueText: string | null = linkPathElement.getAttribute('data-value');

            if (!sourceId || !targetId || valueText == null) {
                return this.hideTooltip();
            }

            const value: number = +valueText;

            const sourceAggregates: SankeyNodeAggregates = this.computeNodeAggregates(sourceId);
            const targetAggregates: SankeyNodeAggregates = this.computeNodeAggregates(targetId);

            tooltipData = {
                start: {
                    name: sourceAggregates.name,
                    value: sourceAggregates.value,
                    in: sourceAggregates.inValue,
                    out: sourceAggregates.outValue
                },
                target: {
                    name: targetAggregates.name,
                    value: targetAggregates.value,
                    in: targetAggregates.inValue,
                    out: targetAggregates.outValue
                },
                value
            } as SankeyNodeAggregates; // structure used downstream for templating

            template = tooltipSettings.linkTemplate || null;

            if (template) {
                if (typeof template === 'string') {
                    // Interpolate placeholders in string template
                    content = template
                        .replace(/\${start\.name}/g, (tooltipData as { start: { name: string } }).start.name)
                        .replace(/\${start\.value}/g, (tooltipData as { start: { value: number } }).start.value.toString())
                        .replace(/\${start\.in}/g, (tooltipData as { start: { in: number } }).start.in.toString())
                        .replace(/\${start\.out}/g, (tooltipData as { start: { out: number } }).start.out.toString())
                        .replace(/\${target\.name}/g, (tooltipData as { target: { name: string } }).target.name)
                        .replace(/\${target\.value}/g, (tooltipData as { target: { value: number } }).target.value.toString())
                        .replace(/\${target\.in}/g, (tooltipData as { target: { in: number } }).target.in.toString())
                        .replace(/\${target\.out}/g, (tooltipData as { target: { out: number } }).target.out.toString())
                        .replace(/\${value}/g, (tooltipData as { value: number }).value.toString());
                } else if (typeof template === 'function') {
                    // Call function with tooltipData
                    content = template(tooltipData);
                }
            } else {
                // Fallback to default format
                let defaultFormat: string = tooltipSettings.linkFormat || '$start.name → $target.name : $value';
                // Support both ${...} and $... placeholders
                defaultFormat = defaultFormat
                    .replace(/\$\{start\.name\}/g, '$start.name')
                    .replace(/\$\{start\.value\}/g, '$start.value')
                    .replace(/\$\{start\.in\}/g, '$start.in')
                    .replace(/\$\{start\.out\}/g, '$start.out')
                    .replace(/\$\{target\.name\}/g, '$target.name')
                    .replace(/\$\{target\.value\}/g, '$target.value')
                    .replace(/\$\{target\.in\}/g, '$target.in')
                    .replace(/\$\{target\.out\}/g, '$target.out')
                    .replace(/\$\{value\}/g, '$value');
                content = defaultFormat
                    .replace(/\$start\.name/g, sourceAggregates.name)
                    .replace(/\$start\.value/g, sourceAggregates.value.toString())
                    .replace(/\$start\.in/g, sourceAggregates.inValue.toString())
                    .replace(/\$start\.out/g, sourceAggregates.outValue.toString())
                    .replace(/\$target\.name/g, targetAggregates.name)
                    .replace(/\$target\.value/g, targetAggregates.value.toString())
                    .replace(/\$target\.in/g, targetAggregates.inValue.toString())
                    .replace(/\$target\.out/g, targetAggregates.outValue.toString())
                    .replace(/\$value/g, value.toString());
            }
        } else {
            return this.hideTooltip();
        }

        // Trigger tooltipRendering event
        let eventNode: SankeyNode | null = null;
        let eventLink: SankeyLink | null = null;

        if (hitTarget.id.indexOf(nodeElementIdPrefix) === 0) {
            const nodeId: string = hitTarget.getAttribute('aria-label');
            let matchedNode: SankeyNode | null = null;
            const nodesArray: SankeyNode[] = (sankeyChart.nodes as SankeyNode[]);
            for (let i: number = 0; i < nodesArray.length; i++) {
                const candidate: SankeyNode | null = nodesArray[i as number];
                if (candidate && (candidate as SankeyNode).id === nodeId) {
                    matchedNode = candidate;
                    break;
                }
            }
            eventNode = matchedNode;
        } else if (hitTarget.tagName.toLowerCase() === 'path' && hitTarget.closest(`[id="${linkCollectionId}"]`)) {
            const sourceAttr: string = (hitTarget as HTMLElement).getAttribute('data-source');
            const targetAttr: string = (hitTarget as HTMLElement).getAttribute('data-target');
            let matchedLink: SankeyLink | null = null;
            const linksArray: SankeyLink[] = (sankeyChart.links as SankeyLink[]);
            for (let i: number = 0; i < linksArray.length; i++) {
                const candidate: SankeyLink | null = linksArray[i as number];
                if (candidate && (candidate as SankeyLink).sourceId === sourceAttr && (candidate as SankeyLink).targetId === targetAttr) {
                    matchedLink = candidate;
                    break;
                }
            }
            eventLink = matchedLink;
        }

        const tooltipRenderArgs: SankeyTooltipRenderEventArgs = {
            text: content,
            node: eventNode,
            link: eventLink
        };
        sankeyChart.trigger('tooltipRendering', tooltipRenderArgs);
        content = tooltipRenderArgs.text;

        // Container
        let tooltipContainer: HTMLElement | null = document.getElementById(`${sankeyChart.element.id}_tooltip_parent`);
        if (!tooltipContainer) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.id = `${sankeyChart.element.id}_tooltip_parent`;
            tooltipContainer.style.cssText = 'position:absolute; left:0; top:0; pointer-events:none; z-index:100;';
            (sankeyChart.element as HTMLElement).appendChild(tooltipContainer); // attach to chart root for consistent offsets
        }

        // Assemble config - Note: Set template to undefined to use content as HTML
        const tooltipConfig: tooltipConfigurationOptions = {
            opacity: tooltipSettings.opacity,
            header: '',
            content: [content],
            fill: tooltipSettings.fill,
            location: location,
            offset: 0,
            enableAnimation: tooltipSettings.enableAnimation,
            shared: false,
            crosshair: false,
            clipBounds: sankeyChart.initialClipRect as Rect,
            areaBounds: sankeyChart.initialClipRect as Rect,
            template: undefined,
            theme: sankeyChart.theme,
            textStyle: tooltipSettings.textStyle,
            isCanvas: false,
            isFixed: false,
            controlName: 'Sankey',
            enableRTL: sankeyChart.enableRtl,
            arrowPadding: 0,
            availableSize: sankeyChart.availableSize
        };

        // Show or update
        if (isInitialRender || !this.svgTooltip) {
            this.svgTooltip = new SVGTooltip(tooltipConfig);
            this.svgTooltip.appendTo(tooltipContainer);
        } else {
            for (const key in tooltipConfig) {
                if (Object.prototype.hasOwnProperty.call(tooltipConfig, key)) {
                    (this.svgTooltip)[key as string] = (tooltipConfig)[key as string];
                }
            }
            this.svgTooltip.dataBind();
        }
    }

    /**
     * Triggers tooltip rendering logic when a mouse or pointer release
     * action occurs inside the Sankey chart series area.
     *
     * @param {PointerEvent} event - The mouse or pointer up event within the chart.
     * @returns {void}
     *
     * @private
     */
    public handlePointerUp(event: PointerEvent): void {
        const sankeyChart: Sankey = this.sankey;

        if (!sankeyChart.tooltip.enable) { return; }

        if (sankeyChart.isTouch && withInBounds(sankeyChart.mouseX, sankeyChart.mouseY, sankeyChart.initialClipRect)) {
            this.renderTooltip(true, event);

            if (sankeyChart.tooltip.fadeOutMode === 'Move') {
                this.hideTooltip(sankeyChart.tooltip.fadeOutDuration);
            }
        } else if (sankeyChart.tooltip.fadeOutMode === 'Click') {
            this.hideTooltip(0);
        }
    }

    /**
     * Resolves the nearest interactive SVG element (node or link) starting from the given element.
     *
     * @param {string} chartId - The root chart element id used to construct node ids from label ids.
     * @param {Element | null} startElement - The starting element to inspect and traverse from.
     * @returns {Element | null }} The resolved element and its type ('node' or 'link').
     *
     * @private
     */
    public resolveInteractiveTarget(
        chartId: string,
        startElement: Element | null
    ): { element: Element | null; type: 'node' | 'link' | null } {
        let currentElement: Element | null = startElement;

        while (currentElement && currentElement !== document.body) {
            const elementId: string = currentElement.getAttribute('id') || '';

            if (elementId.indexOf('_node_level_') > -1 && currentElement instanceof SVGRectElement) {
                return { element: currentElement, type: 'node' };
            }

            if (elementId.indexOf('_link_level_') > -1) {
                const pathElement: Element | null = currentElement.closest('path');
                return { element: pathElement || currentElement, type: 'link' };
            }

            if (elementId.indexOf('_label_level_') > -1) {
                const idParts: string[] = elementId.split('_');
                const level: string = idParts[idParts.length - 2];
                const index: string = idParts[idParts.length - 1];
                const nodeId: string = `${chartId}_node_level_${level}_${index}`;
                const nodeElement: HTMLElement | null = document.getElementById(nodeId);
                if (nodeElement instanceof SVGRectElement) {
                    return { element: nodeElement, type: 'node' };
                }
            }

            currentElement = currentElement.parentElement;
        }
        return { element: null, type: null };
    }

    /**
     * Triggers tooltip hiding if mouse away from chart series area.
     *
     * @returns {void}
     * @private
     */
    public handlePointerLeave(): void {
        this.hideTooltip(this.sankey.tooltip.fadeOutDuration);
    }

    /**
     * Triggers tooltip rendering logic when a mouse or pointer action
     * occurs within the Sankey chart series area.
     *
     * Determines the nearest interactive Sankey element (node or link)
     * based on the event target and renders or hideTooltips the tooltip accordingly.
     *
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {PointerEvent} event - The mouse or pointer event occurring inside the chart.
     * @returns {void}
     * @private
     */
    public renderTooltip(isInitialRender: boolean, event: PointerEvent): void {
        const targetElement: Element | null = event.target as Element | null;
        if (!targetElement) {
            this.hideTooltip();
            return;
        }

        const resolvedElement: {
            element: Element;
            type: 'link' | 'node';
        } = this.resolveInteractiveTarget(this.sankey.element.id, targetElement);
        const interactiveElement: Element | null = resolvedElement.element;

        if (interactiveElement) {
            this.showTooltipForElement(interactiveElement, isInitialRender);
        } else {
            // Hide tooltip only when the pointer is outside interactive Sankey element
            this.hideTooltip(this.sankey.tooltip.fadeOutDuration);
        }
    }

    /**
     * Computes aggregated metrics for a Sankey node to be used in tooltip content.
     *
     * Calculates total inbound and outbound values for the given node id,
     * and resolves its display name and color (if provided).
     *
     * @param {string} nodeId - The Sankey node identifier to aggregate values for.
     * @param {string} [color] - Optional color associated with the node.
     * @returns {SankeyNodeAggregates} Aggregated values for the specified node.
     * @private
     */
    public computeNodeAggregates(nodeId: string, color?: string): SankeyNodeAggregates {
        let inValue: number = 0;
        let outValue: number = 0;

        // Sum inbound and outbound values for the node
        for (const link of this.sankey.links as SankeyLink[]) {
            if (link.targetId === nodeId) { inValue += link.value; }
            if (link.sourceId === nodeId) { outValue += link.value; }
        }

        // Find matching node metadata (for display name / color)
        let matchedNode: SankeyNode | null = null;
        const nodesArray: SankeyNode[] = this.sankey.nodes as SankeyNode[];

        for (let i: number = 0; i < nodesArray.length; i++) {
            if (nodesArray[i as number].id === nodeId) {
                matchedNode = nodesArray[i as number];
                break;
            }
        }
        const matchedNodeLayout: SankeyNodeLayout = this.sankey.nodeLayoutMap[matchedNode && matchedNode.id];
        return {
            id: nodeId,
            name: (matchedNode && matchedNode.label.text) ? matchedNode.label.text : (matchedNodeLayout && matchedNodeLayout.label) ?
                matchedNodeLayout.label : nodeId,
            inValue,
            outValue,
            value: Math.max(inValue, outValue),
            color
        };
    }

    /**
     * Hides the tooltip after the specified delay.
     *
     * @param {number} delay - The delay in milliseconds before hiding the tooltip.
     * @returns {void}
     * @private
     */
    public hideTooltip(delay: number = this.sankey.tooltip.fadeOutDuration): void {
        clearTimeout(this.tooltipTimer);

        if (this.svgTooltip) {
            this.tooltipTimer = window.setTimeout((): void => {
                if (this.svgTooltip) {
                    this.svgTooltip.fadeOut();
                }
                setTimeout((): void => {
                    this.svgTooltip = null; // Ensure tooltip reference is cleared after animation
                }, 400);
            }, delay);
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'SankeyTooltip';
    }

    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unwireEvents(); // ensure detach
    }
}
