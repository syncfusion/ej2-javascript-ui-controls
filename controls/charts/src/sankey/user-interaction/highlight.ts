import { Browser, Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { Sankey } from '../sankey';
import { SankeyLinkSettingsModel, SankeyNodeSettingsModel } from '../model/sankey-base-model';

/**
 * Highlight behavior module for Sankey Chart.
 */
export class SankeyHighlight {
    private chart: Sankey;
    private lastHoveredId: string | null = null;
    private animationTimeoutId: number | null = null;

    /** Default animation duration for highlight removal in milliseconds. */
    private readonly DEFAULT_ANIMATION_DURATION: number = 400;

    /** Minimum animation duration to ensure smooth transitions. */
    private readonly MIN_ANIMATION_DURATION: number = 50;

    /** Epsilon value for floating point opacity comparison. */
    private readonly OPACITY_EPSILON: number = 0.001;

    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    constructor(chart: Sankey) {
        this.chart = chart;
        this.wireEvents();
    }

    /**
     * Wires legend interaction events to the chart for hover, move, click, and touch end behaviors.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(cancelEvent, this.handleMouseLeave, this);
        this.chart.on(Browser.touchMoveEvent, this.handleMouseMove, this);
        // clear highlight on touch end / pointer up (chart notifies this event)
        this.chart.on(Browser.touchEndEvent, this.handleMouseMove, this);
    }

    /**
     * Unwires legend interaction events from the chart to release handlers and avoid memory leaks.
     *
     * @returns {void}
     */
    private unwireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.handleMouseMove);
        this.chart.off(Browser.touchEndEvent, this.handleMouseMove);
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.off(cancelEvent, this.handleMouseLeave);
    }

    /**
     * Retrieves all label elements from the chart's label collection.
     *
     * @returns {HTMLElement[]} - Array of label text elements, empty array if collection not found.
     * @private
     */
    public getLabelElements(): HTMLElement[] {
        const labelCollection: HTMLElement | null = document.getElementById(this.chart.element.id + '_label_collection');
        return labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) as HTMLElement[] : [];
    }

    /**
     * Clears active highlight when the pointer leaves the chart surface.
     *
     * @param {Event} _event - The leave event (unused).
     * @returns {void}
     * @private
     */
    public handleMouseLeave(_event: Event): void {
        this.clearHighlights();
    }

    /**
     * Tracks pointer/touch movement to identify interactive nodes/links and apply the corresponding highlight.
     * Uses debouncing to prevent duplicate highlight updates from multiple event sources.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event used to detect the hovered element.
     * @returns {void}
     * @private
     */
    public handleMouseMove(event: PointerEvent | TouchEvent): void {
        const targetElement: Element = (event && (event.target as Element));
        if (!targetElement) { this.clearHighlights(); return; }

        const hitElement: { type: string; id?: string; source?: string; target?: string }
            = this.getInteractiveTarget(targetElement);
        if (!hitElement) { this.clearHighlights(); return; }

        if (hitElement.type === 'node' && hitElement.id) {
            if (this.lastHoveredId === 'node:' + hitElement.id) { return; }
            if (this.animationTimeoutId !== null) {
                clearTimeout(this.animationTimeoutId);
                this.animationTimeoutId = null;
            }
            this.stopAllAnimations();
            this.lastHoveredId = 'node:' + hitElement.id;
            this.highlightForNode(hitElement.id);
        } else if (hitElement.type === 'link') {
            if (this.lastHoveredId === 'link:' + (hitElement.id)) { return; }
            if (this.animationTimeoutId !== null) {
                clearTimeout(this.animationTimeoutId);
                this.animationTimeoutId = null;
            }
            this.stopAllAnimations();
            this.lastHoveredId = 'link:' + (hitElement.id);
            this.highlightForLink(hitElement.source, hitElement.target);
        } else {
            this.clearHighlights(true);
        }
    }

    /**
     * Walks up the DOM tree to find the nearest interactive Sankey element (node, link, label, or legend item).
     *
     * @param {Element} element - The starting DOM element from the event target.
     * @returns {Element | null} - returns element if found, or null.
     * @private
     */
    public getInteractiveTarget(element: Element): { type: string, id?: string, source?: string, target?: string } | null {
        let currentElement: Element | null = element;

        while (currentElement && currentElement !== document.body) {
            const elementId: string | null = currentElement.getAttribute('id');

            if (elementId) {
                if (elementId.indexOf('_node_level_') > -1) {
                    // node element
                    const nodeId: string = currentElement.getAttribute('aria-label');
                    return { type: 'node', id: nodeId };
                }
                else if (elementId.indexOf('_link_level_') > -1) {
                    const sourceId: string = currentElement.getAttribute('data-source');
                    const targetId: string = currentElement.getAttribute('data-target');
                    return { type: 'link', id: elementId, source: sourceId, target: targetId };
                }
                else if (elementId.indexOf('_label_level_') > -1) {
                    // labels map to node by level/index pattern
                    const splitIdParts: string[] = elementId.split('_');
                    const level: string = splitIdParts[splitIdParts.length - 2];
                    const index: string = splitIdParts[splitIdParts.length - 1];
                    const nodeElementId: string = `${this.chart.element.id}_node_level_${level}_${index}`;
                    const nodeElement: HTMLElement | null = document.getElementById(nodeElementId);

                    if (nodeElement) {
                        const nodeLabel: string = nodeElement.getAttribute('aria-label');
                        return { type: 'node', id: nodeLabel };
                    }
                }
                else if (elementId.indexOf('_legend_') > -1 && this.chart.legendSettings.enableHighlight) {
                    let legendHighlightElement: Element;

                    if (elementId.indexOf('_shape_') > -1 || elementId.indexOf('_text_') > -1) {
                        legendHighlightElement = currentElement.parentElement as Element;
                    }
                    else {
                        legendHighlightElement = currentElement;
                    }

                    const nodeId: string = legendHighlightElement.getAttribute('aria-label');
                    return { type: 'node', id: nodeId };
                }
            }

            currentElement = currentElement.parentElement;
        }

        return null;
    }

    /**
     * Highlights the hovered node along with its directly connected neighbor nodes and links by applying active/inactive opacities.
     *
     * @param {string} nodeId - The node id whose related nodes and links should be highlighted.
     * @returns {void}
     * @private
     */
    public highlightForNode(nodeId: string): void {
        const chart: Sankey = this.chart;
        const linkCollection: HTMLElement | null = document.getElementById(chart.element.id + '_link_collection');
        const nodeCollection: HTMLElement | null = document.getElementById(chart.element.id + '_node_collection');
        const labelCollection: HTMLElement | null = document.getElementById(chart.element.id + '_label_collection');
        if (!linkCollection || !nodeCollection) { return; }

        const linkElements: SVGElement[] = Array.prototype.slice.call(linkCollection.querySelectorAll('path')) as SVGElement[];
        const nodeElements: SVGElement[] = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect')) as SVGElement[];
        const labelElements: SVGElement[] = labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) as SVGElement[] : [];

        // collect neighbor node ids connected to hovered node
        const neighborNodeMap: { [id: string]: boolean } = {};

        const highlightOpacity: number = (chart.linkStyle && (chart.linkStyle as SankeyLinkSettingsModel).highlightOpacity);
        const inactiveOpacity: number = (chart.linkStyle && (chart.linkStyle as SankeyLinkSettingsModel).inactiveOpacity);
        const nodeHighlightOpacity: number = (chart.nodeStyle && (chart.nodeStyle as SankeyNodeSettingsModel).highlightOpacity);
        const nodeInactiveOpacity: number = (chart.nodeStyle && (chart.nodeStyle as SankeyNodeSettingsModel).inactiveOpacity);

        for (const linkElement of linkElements) {
            const sourceId: string | null = linkElement.getAttribute('data-source');
            const targetId: string | null = linkElement.getAttribute('data-target');
            if (sourceId === nodeId || targetId === nodeId) {
                // matched link
                linkElement.setAttribute('opacity', String(highlightOpacity));
                // mark the neighbor node (other end)
                const otherNodeId: string | null = (sourceId === nodeId) ? targetId : sourceId;
                if (otherNodeId) { neighborNodeMap[otherNodeId as string] = true; }
            } else {
                linkElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }

        for (const nodeElement of nodeElements) {
            const nodeElementId: string | null = nodeElement.getAttribute('aria-label');

            if (nodeElementId === nodeId || (nodeElementId && neighborNodeMap[nodeElementId as string])) {
                nodeElement.setAttribute('opacity', String(nodeHighlightOpacity));
            } else {
                nodeElement.setAttribute('opacity', String(nodeInactiveOpacity));
            }
        }

        this.highlightLabelsForNodes([nodeId, ...Object.keys(neighborNodeMap)], labelElements, inactiveOpacity);
    }

    /**
     * Highlights the hovered link and its source/target nodes by applying active/inactive opacities.
     *
     * @param {string | null} source - The source node id of the hovered link.
     * @param {string | null} target - The target node id of the hovered link.
     * @returns {void}
     * @private
     */
    public highlightForLink(source: string | null, target: string | null): void {
        const chart: Sankey = this.chart;
        const linkCollection: HTMLElement | null = document.getElementById(chart.element.id + '_link_collection');
        const nodeCollection: HTMLElement | null = document.getElementById(chart.element.id + '_node_collection');
        const labelCollection: HTMLElement | null = document.getElementById(chart.element.id + '_label_collection');
        if (!linkCollection || !nodeCollection) { return; }

        const linkElements: SVGElement[] = Array.prototype.slice.call(linkCollection.querySelectorAll('path')) as SVGElement[];
        const nodeElements: SVGElement[] = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect')) as SVGElement[];
        const labelElements: SVGElement[] = labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) as SVGElement[] : [];

        const highlightOpacity: number = (chart.linkStyle && (chart.linkStyle as SankeyLinkSettingsModel).highlightOpacity);
        const inactiveOpacity: number = (chart.linkStyle && (chart.linkStyle as SankeyLinkSettingsModel).inactiveOpacity);
        const nodeHighlightOpacity: number = (chart.nodeStyle && (chart.nodeStyle as SankeyNodeSettingsModel).highlightOpacity);
        const nodeInactiveOpacity: number = (chart.nodeStyle && (chart.nodeStyle as SankeyNodeSettingsModel).inactiveOpacity);

        for (const linkElement of linkElements) {
            const sourceId: string | null = linkElement.getAttribute('data-source');
            const targetId: string | null = linkElement.getAttribute('data-target');

            if (sourceId === source && targetId === target) {
                linkElement.setAttribute('opacity', String(highlightOpacity));
            } else {
                linkElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }

        for (const nodeElement of nodeElements) {
            const nodeElementId: string | null = nodeElement.getAttribute('aria-label');

            if (nodeElementId === source || nodeElementId === target) {
                nodeElement.setAttribute('opacity', String(nodeHighlightOpacity));
            } else {
                nodeElement.setAttribute('opacity', String(nodeInactiveOpacity));
            }
        }

        const highlightedNodeIds: string[] = [];
        if (source) { highlightedNodeIds.push(source); }
        if (target) { highlightedNodeIds.push(target); }
        this.highlightLabelsForNodes(highlightedNodeIds, labelElements, inactiveOpacity);
    }

    /**
     * Clears active node/link highlight and restores default link and node opacity values.
     * Uses smooth animation for opacity transitions when truly leaving the chart.
     * Set animate to false for immediate clearing (e.g., on chart destruction).
     *
     * @param {boolean} [animate=true] - Whether to use animation for the clear transition.
     *                                    True: smooth fade over DEFAULT_ANIMATION_DURATION ms.
     *                                    False: immediate opacity reset to defaults.
     * @returns {void}
     * @private
     */
    public clearHighlights(animate: boolean = true): void {
        if (this.lastHoveredId === null) { return; }

        this.lastHoveredId = null;

        if (animate) {
            this.performClearHighlightsWithAnimation();
        }
    }

    /**
     * Stops all ongoing animations on link, node, and label elements without changing their opacity.
     * Used when switching between highlights to allow new highlight values to be applied immediately.
     *
     * @returns {void}
     * @private
     */
    public stopAllAnimations(): void {
        const chart: Sankey = this.chart;

        const linkCollection: HTMLElement | null = document.getElementById(chart.element.id + '_link_collection');
        const nodeCollection: HTMLElement | null = document.getElementById(chart.element.id + '_node_collection');
        if (!linkCollection || !nodeCollection) { return; }

        const linkElements: HTMLElement[] = Array.prototype.slice.call(linkCollection.querySelectorAll('path')) as HTMLElement[];
        const nodeElements: HTMLElement[] = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect')) as HTMLElement[];
        const labelElements: HTMLElement[] = this.getLabelElements();

        for (const linkElement of linkElements) {
            if (linkElement.hasAttribute('e-animate')) {
                linkElement.removeAttribute('e-animate');
                Animation.stop(linkElement as HTMLElement);
            }
        }

        for (const nodeElement of nodeElements) {
            if (nodeElement.hasAttribute('e-animate')) {
                nodeElement.removeAttribute('e-animate');
                Animation.stop(nodeElement as HTMLElement);
            }
        }

        for (const labelElement of labelElements) {
            if (labelElement.hasAttribute('e-animate')) {
                labelElement.removeAttribute('e-animate');
                Animation.stop(labelElement as HTMLElement);
            }
        }
    }

    /**
     * Performs the clearing of highlights with smooth animation for opacity values.
     * Animates all link, node, and label opacity changes to the default values.
     *
     * @returns {void}
     * @private
     */
    public performClearHighlightsWithAnimation(): void {
        if (this.chart.isDestroyed) { return; }

        const chart: Sankey = this.chart;

        const linkCollection: HTMLElement | null = document.getElementById(chart.element.id + '_link_collection');
        const nodeCollection: HTMLElement | null = document.getElementById(chart.element.id + '_node_collection');
        if (!linkCollection || !nodeCollection) { return; }

        const linkElements: HTMLElement[] = Array.prototype.slice.call(linkCollection.querySelectorAll('path')) as HTMLElement[];
        const nodeElements: HTMLElement[] = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect')) as HTMLElement[];
        const labelElements: HTMLElement[] = this.getLabelElements();

        const defaultLinkOpacity: number = (chart.linkStyle && (chart.linkStyle as SankeyLinkSettingsModel).opacity);
        const defaultNodeOpacity: number = (chart.nodeStyle && (chart.nodeStyle as SankeyNodeSettingsModel).opacity);

        for (const linkElement of linkElements) {
            const currentOpacity: number = parseFloat(linkElement.getAttribute('opacity'));
            if (currentOpacity && Math.abs(currentOpacity - defaultLinkOpacity) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(linkElement, currentOpacity, defaultLinkOpacity, this.DEFAULT_ANIMATION_DURATION);
            }
        }

        for (const nodeElement of nodeElements) {
            const currentOpacity: number = parseFloat(nodeElement.getAttribute('opacity'));
            if (currentOpacity && Math.abs(currentOpacity - defaultNodeOpacity) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(nodeElement, currentOpacity, defaultNodeOpacity, this.DEFAULT_ANIMATION_DURATION);
            }
        }
        for (const labelElement of labelElements) {
            const currentOpacity: number = parseFloat(labelElement.getAttribute('opacity') || '1');
            if (Math.abs(currentOpacity - 1) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(labelElement, currentOpacity, 1, this.DEFAULT_ANIMATION_DURATION, true);
            }
        }
        if (this.DEFAULT_ANIMATION_DURATION > 0) {
            this.animationTimeoutId = window.setTimeout(() => {
                this.animationTimeoutId = null;
            }, Math.max(this.DEFAULT_ANIMATION_DURATION, this.MIN_ANIMATION_DURATION));
        }
    }

    /**
     * Animates opacity change from start value to end value for an element.
     * Includes proper cleanup on chart destruction.
     *
     * @param {HTMLElement} element - The element to animate.
     * @param {number} startOpacity - The starting opacity value.
     * @param {number} endOpacity - The ending opacity value.
     * @param {number} duration - The animation duration in milliseconds.
     * @param {boolean} removeAttribute - Whether to remove the opacity attribute at the end (for labels).
     * @returns {void}
     * @private
     */
    public animateOpacityChange(element: HTMLElement | null, startOpacity: number,
                                endOpacity: number, duration: number, removeAttribute?: boolean): void {
        if (!element) { return; }

        const effectiveDuration: number = Math.max(duration, this.MIN_ANIMATION_DURATION);

        if (duration === 0) {
            if (removeAttribute) {
                element.removeAttribute('opacity');
            } else if (endOpacity < 1) {
                element.setAttribute('opacity', String(endOpacity));
            } else {
                element.removeAttribute('opacity');
            }
            return;
        }

        element.setAttribute('e-animate', 'true');

        new Animation({}).animate(element, {
            duration: effectiveDuration,
            progress: (args: AnimationOptions): void => {
                // Stop animation if chart was destroyed
                if (this.chart.isDestroyed) {
                    Animation.stop(element as HTMLElement);
                    return;
                }
                element.style.animation = '';
                const progress: number = Math.min(args.timeStamp / args.duration, 1);
                const currentOpacity: number = startOpacity + (endOpacity - startOpacity) * progress;
                element.setAttribute('opacity', String(parseFloat(currentOpacity.toFixed(3))));
            },
            end: (): void => {
                // Only apply final opacity if animation was not interrupted (e-animate marker exists)
                if (element.hasAttribute('e-animate')) {
                    if (removeAttribute) {
                        element.removeAttribute('opacity');
                    } else if (endOpacity < 1) {
                        element.setAttribute('opacity', String(endOpacity));
                    } else {
                        element.removeAttribute('opacity');
                    }
                    element.removeAttribute('e-animate');
                }
            }
        });
    }

    /**
     * Highlights labels for the specified nodes and dims all other labels.
     *
     * @param {string[]} highlightedNodeIds - Array of node ids whose labels should be highlighted.
     * @param {SVGElement[]} labelElements - Array of all label text elements in the chart.
     * @param {number} inactiveOpacity - The opacity value to apply to non-highlighted labels.
     * @returns {void}
     * @private
     */
    public highlightLabelsForNodes(highlightedNodeIds: string[], labelElements: SVGElement[], inactiveOpacity: number): void {
        for (const labelElement of labelElements) {
            const labelElementId: string | null = labelElement.getAttribute('id');
            if (!labelElementId) { continue; }
            const nodeLabel: string | null = this.getNodeLabelFromLabelElement(labelElement);

            if (nodeLabel && highlightedNodeIds.indexOf(nodeLabel) > -1) {
                labelElement.removeAttribute('opacity');
            } else {
                labelElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }
    }

    /**
     * Extracts the node label/id from a label text element by finding the corresponding node.
     *
     * @param {SVGElement} labelElement - The label text element to extract the node id from.
     * @returns {string | null} returns the node id if found, else null.
     * @private
     */
    public getNodeLabelFromLabelElement(labelElement: SVGElement): string | null {
        const labelElementId: string | null = labelElement.getAttribute('id');
        if (!labelElementId) { return null; }
        const match: RegExpMatchArray | null = labelElementId.match(/_label_level_(\d+)_(\d+)$/);
        if (!match) { return null; }

        const level: string = match[1];
        const index: string = match[2];

        const chartId: string = this.chart.element.id;
        const nodeElementId: string = `${chartId}_node_level_${level}_${index}`;
        const nodeElement: HTMLElement | null = document.getElementById(nodeElementId);

        if (nodeElement) {
            return nodeElement.getAttribute('aria-label');
        }

        return null;
    }

    /**
     * Gets the module name for the Sankey highlight component.
     *
     * @returns {string} returns module name
     * @private
     */
    public getModuleName(): string { return 'SankeyHighlight'; }

    /**
     * Destroys the highlight module by unwiring events and cleaning up any pending animations.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.animationTimeoutId !== null) {
            clearTimeout(this.animationTimeoutId);
            this.animationTimeoutId = null;
        }
        this.unwireEvents();
    }
}
