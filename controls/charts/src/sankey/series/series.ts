import { Rect, Size, SvgRenderer, measureText } from '@syncfusion/ej2-svg-base';
import { RectOption, appendChildElement, isCollide, getAnimationFunction } from '../../common/utils/helper';
import { Animation, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Sankey } from '../sankey';
import { SankeyLabelRenderEventArgs, SankeyLinkRenderEventArgs, SankeyNodeLayout, SankeyNodeRenderEventArgs, SankeyTextStyle } from '../model/sankey-interface';
import { SankeyLink, SankeyNode } from '../model/sankey-base';
import { SankeyDataLabelModel, SankeyLabelSettingsModel, SankeyLinkSettingsModel, SankeyLinkModel, SankeyNodeSettingsModel } from '../model/sankey-base-model';
import { getNodeColor } from '../model/sankey-theme';

export class SankeySeries {
    private nodeWidth: number;
    private nodePadding: number;
    private linkOpacity: number;
    private linkCurvature: number;
    /** @private */
    public chart: Sankey;
    private dataLabelRects: Rect[] = [];

    /**
     * Renders the Sankey diagram by computing layout, creating clip path, and drawing links, nodes, and data labels.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering.
     * @returns {void}
     *
     * @private
     */
    public render(chart: Sankey): void {
        if (!chart.svgObject) { return; }
        // Process data source if available, otherwise use links array
        const sankeyLinks: SankeyLinkModel[] = chart.links;
        if (!sankeyLinks.length) { return; }
        const clipRect: Rect = chart.initialClipRect;
        if (!clipRect) { return; }

        this.nodeWidth = chart.nodeStyle.width;
        this.nodePadding = chart.nodeStyle.padding;
        this.linkOpacity = chart.linkStyle.opacity;
        this.linkCurvature = chart.linkStyle.curvature;
        this.chart = chart;

        const nodeLevels: number = this.assignLevels(chart.nodeLayoutMap, sankeyLinks);
        this.computeLayout(chart.nodeLayoutMap, nodeLevels, clipRect);
        this.renderGroups(chart);

        // Create a clipPath for Sankey rendering and apply to groups so we can animate reveal
        const clipId: string = chart.element.id + '_sankey_clip';
        const clipPathElement: Element = chart.renderer.createClipPath({ id: clipId });
        const clipRectOptions: RectOption = new RectOption(
            clipId + '_rect',
            '',
            {},
            1,
            new Rect(clipRect.x - 10, clipRect.y - 10, clipRect.width + 20, chart.availableSize.height + 20)
        );
        const clipRectElement: Element = chart.renderer.drawRectangle(clipRectOptions);
        clipPathElement.appendChild(clipRectElement);
        appendChildElement(false, chart.svgObject, clipPathElement, false);

        this.renderLinks(chart, sankeyLinks, chart.nodeLayoutMap);
        this.renderNodes(chart, chart.nodeLayoutMap);
        this.renderDataLabels(chart, chart.nodeLayoutMap);

        // Animate the clip rect to reveal Sankey elements
        if (chart.animation.enable && chart.animateSeries && chart.animation.duration > 0) {
            this.animateClipRect(clipRectElement as HTMLElement, clipRect, chart);
            chart.animateSeries = false;
        }

    }

    /**
     * Builds and returns a node layout map from the given links and user-defined node configuration.
     *
     * @param {SankeyLinkModel[]} links - Collection of Sankey links used to compute node in/out values.
     * @param {Sankey} chart - The Sankey chart instance that provides theme and user node definitions.
     * @returns {SankeyNodeLayout} returns node layout map for links and nodes.
     *
     * @private
     */
    public buildNodes(links: SankeyLinkModel[], chart: Sankey): { [key: string]: SankeyNodeLayout } {
        const nodeLayouts: { [key: string]: SankeyNodeLayout } = {};
        const colorPalette: string[] = getNodeColor(chart.theme);
        const userDefinedNodes: SankeyNode[] = Array.isArray(chart.nodes) ? chart.nodes as SankeyNode[] : [];
        let currentColorIndex: number = 0;

        const getNextColor: () => string = (): string => {
            const selectedColor: string = colorPalette[currentColorIndex % colorPalette.length];
            currentColorIndex++;
            return selectedColor;
        };

        const createNodeLayout: (nodeId: string, nodeColor?: string, nodeLabel?: string) => SankeyNodeLayout =
            (nodeId: string, nodeColor?: string, nodeLabel?: string): SankeyNodeLayout => {
                return {
                    id: nodeId,
                    value: 0,
                    inValue: 0,
                    outValue: 0,
                    level: 0,
                    x: 0,
                    y: 0,
                    height: 0,
                    outOffset: 0,
                    inOffset: 0,
                    color: nodeColor || getNextColor(),
                    label: nodeLabel
                };
            };

        for (const userNode of userDefinedNodes) {
            if (!userNode || !userNode.id) { continue; }
            nodeLayouts[userNode.id] = createNodeLayout(userNode.id, userNode.color, userNode.label.text);
            if (!isNullOrUndefined(userNode.offset)) {
                nodeLayouts[userNode.id].offset = userNode.offset as number;
            }
        }

        const getOrCreateNode: (nodeId: string) => SankeyNodeLayout = (nodeId: string): SankeyNodeLayout => {
            if (!nodeLayouts[nodeId as string]) {
                nodeLayouts[nodeId as string] = createNodeLayout(nodeId);
            }
            return nodeLayouts[nodeId as string];
        };

        for (const link of links) {
            const sourceNodeLayout: SankeyNodeLayout = getOrCreateNode(link.sourceId);
            const targetNodeLayout: SankeyNodeLayout = getOrCreateNode(link.targetId);
            sourceNodeLayout.outValue += link.value;
            targetNodeLayout.inValue += link.value;
        }

        const nodeIds: string[] = Object.keys(nodeLayouts);
        for (let index: number = 0; index < nodeIds.length; index++) {
            const nodeLayout: SankeyNodeLayout = nodeLayouts[nodeIds[index as number]];
            nodeLayout.value = nodeLayout.inValue > nodeLayout.outValue ? nodeLayout.inValue : nodeLayout.outValue;
        }
        return nodeLayouts;
    }

    /**
     * Assigns hierarchical levels to Sankey nodes using link direction and returns the total number of levels.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {SankeyLinkModel[]} links - Collection of links used to compute node levels.
     * @returns {number} returns total number of levels.
     *
     * @private
     */
    public assignLevels(nodes: { [key: string]: SankeyNodeLayout }, links: SankeyLinkModel[]): number {
        const nodeInDegreeMap: { [key: string]: number } = {};
        const nodeIds: string[] = Object.keys(nodes);

        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            nodeInDegreeMap[nodeIds[nodeIndex as number]] = 0;
        }

        for (const link of links) {
            nodeInDegreeMap[link.targetId] = (nodeInDegreeMap[link.targetId] || 0) + 1;
        }

        const processingQueue: string[] = [];
        const allNodeIds: string[] = Object.keys(nodeInDegreeMap);

        for (let nodeIndex: number = 0; nodeIndex < allNodeIds.length; nodeIndex++) {
            const nodeId: string = allNodeIds[nodeIndex as number];
            if (nodeInDegreeMap[nodeId as string] === 0) { processingQueue.push(nodeId); }
        }

        const adjacencyList: { [key: string]: string[] } = {};
        for (const link of links) {
            if (!adjacencyList[link.sourceId]) { adjacencyList[link.sourceId] = []; }
            adjacencyList[link.sourceId].push(link.targetId);
        }

        let maximumLevel: number = 0;

        while (processingQueue.length) {
            const currentNodeId: string = processingQueue.shift() as string;
            const currentLevel: number = nodes[currentNodeId as string] ? nodes[currentNodeId as string].level : 0;
            const childNodeIds: string[] = adjacencyList[currentNodeId as string] || [];

            for (let childIndex: number = 0; childIndex < childNodeIds.length; childIndex++) {
                const childNodeId: string = childNodeIds[childIndex as number];
                const childNode: SankeyNodeLayout = nodes[childNodeId as string];

                if (childNode) {
                    childNode.level = childNode.level > (currentLevel + 1) ? childNode.level : (currentLevel + 1);
                    maximumLevel = maximumLevel > childNode.level ? maximumLevel : childNode.level;
                }

                nodeInDegreeMap[childNodeId as string] = (nodeInDegreeMap[childNodeId as string] || 0) - 1;
                if (nodeInDegreeMap[childNodeId as string] === 0) { processingQueue.push(childNodeId); }
            }
        }

        return maximumLevel + 1;
    }

    /**
     * Computes node layout using vertical or horizontal strategy based on the chart orientation.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     */
    private computeLayout(nodes: { [key: string]: SankeyNodeLayout }, levelCount: number, rect: Rect): void {
        const isVerticalLayout: boolean = (this as SankeySeries).chart && (this as SankeySeries).chart.orientation === 'Vertical';

        if (isVerticalLayout) {
            this.computeVerticalLayout(nodes, levelCount, rect);
        } else {
            this.computeHorizontalLayout(nodes, levelCount, rect);
        }
    }

    /**
     * Computes the horizontal layout positions and sizes for nodes across levels within the given rectangle.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     *
     * @private
     */
    public computeHorizontalLayout(nodes: { [key: string]: SankeyNodeLayout }, levelCount: number, rect: Rect): void {
        const horizontalGapBetweenLevels: number = (levelCount > 1) ? (rect.width - this.nodeWidth) / (levelCount - 1) : 0;
        const nodesGroupedByLevel: { [level: number]: SankeyNodeLayout[] } = {};
        const nodeIds: string[] = Object.keys(nodes);

        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const currentNodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];
            if (currentNodeLayout) {
                const nodesAtCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[currentNodeLayout.level] || [];
                nodesAtCurrentLevel.push(currentNodeLayout);
                nodesGroupedByLevel[currentNodeLayout.level] = nodesAtCurrentLevel;
            }
        }

        // Prepare global scaling: compute totals per level and use the largest-level total to derive a global scale.
        const levelTotals: number[] = [];
        let maxTotalValue: number = 0;
        let maxNodesInLevel: number = 0;

        for (let levelIndex: number = 0; levelIndex < levelCount; levelIndex++) {
            const nodesInCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[levelIndex as number] || [];
            let totalValueInLevel: number = 0;

            for (let nodeIndex: number = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                totalValueInLevel += nodesInCurrentLevel[nodeIndex as number].value;
            }

            levelTotals[levelIndex as number] = totalValueInLevel;

            if (totalValueInLevel > maxTotalValue) { maxTotalValue = totalValueInLevel; }
            if (nodesInCurrentLevel.length > maxNodesInLevel) { maxNodesInLevel = nodesInCurrentLevel.length; }
        }

        const maxTotalPadding: number = Math.max(maxNodesInLevel - 1, 0) * this.nodePadding;
        const globalValueToHeightScale: number = maxTotalValue > 0 ? (rect.height - maxTotalPadding) / maxTotalValue : 0;

        for (let levelIndex: number = 0; levelIndex < levelCount; levelIndex++) {
            const nodesInCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[levelIndex as number] || [];
            const valueToHeightScale: number = globalValueToHeightScale;

            // compute heights for this level
            const nodeHeights: number[] = nodesInCurrentLevel.map((nodeLayout: SankeyNodeLayout): number =>
                Math.max(1, nodeLayout.value * valueToHeightScale)
            );

            const totalNodeHeights: number = nodeHeights.reduce((sum: number, height: number): number => sum + height, 0);
            const occupiedHeight: number = totalNodeHeights + Math.max(0, nodeHeights.length - 1) * this.nodePadding;

            // center the level vertically inside rect
            let startY: number = rect.y;
            if (occupiedHeight < rect.height) {
                startY = rect.y + (rect.height - occupiedHeight) / 2;
            }

            let currentYPosition: number = startY;

            for (let nodeIndex: number = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                const currentNodeLayout: SankeyNodeLayout = nodesInCurrentLevel[nodeIndex as number];

                // Position nodes left-to-right normally; if RTL enabled, position right-to-left.
                if (this.chart && (this.chart as Sankey).enableRtl) {
                    currentNodeLayout.x = rect.x + rect.width - (levelIndex * horizontalGapBetweenLevels) - this.nodeWidth;
                } else {
                    currentNodeLayout.x = rect.x + levelIndex * horizontalGapBetweenLevels;
                }

                currentNodeLayout.height = nodeHeights[nodeIndex as number];
                currentNodeLayout.y = currentYPosition;
                currentNodeLayout.outOffset = 0;
                currentNodeLayout.inOffset = 0;

                // Apply user-specified offset (pixels or percentage string)
                if (!isNullOrUndefined(currentNodeLayout.offset)) {
                    currentNodeLayout.y += (currentNodeLayout.offset as number);
                }

                currentYPosition += currentNodeLayout.height + this.nodePadding;
            }
        }
    }

    /**
     * Computes the vertical layout positions and sizes for nodes across levels within the given rectangle.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     *
     * @private
     */
    public computeVerticalLayout(nodes: { [key: string]: SankeyNodeLayout }, levelCount: number, rect: Rect): void {
        const verticalGapBetweenLevels: number = (levelCount > 1) ? (rect.height - this.nodeWidth) / (levelCount - 1) : 0;
        const nodesGroupedByLevel: { [level: number]: SankeyNodeLayout[] } = {};
        const nodeIds: string[] = Object.keys(nodes);

        // Group nodes by their level
        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const currentNodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];
            if (currentNodeLayout) {
                const nodesAtCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[currentNodeLayout.level] || [];
                nodesAtCurrentLevel.push(currentNodeLayout);
                nodesGroupedByLevel[currentNodeLayout.level] = nodesAtCurrentLevel;
            }
        }

        // Position nodes for each level (vertical orientation). Use global scaling similar to horizontal mode
        const levelTotalsVertical: number[] = [];
        let maxTotalValueVertical: number = 0;
        let maxNodesInLevelVertical: number = 0;

        for (let levelIndex: number = 0; levelIndex < levelCount; levelIndex++) {
            const nodesInCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[levelIndex as number] || [];
            let totalValueInLevel: number = 0;

            for (let nodeIndex: number = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                totalValueInLevel += nodesInCurrentLevel[nodeIndex as number].value;
            }

            levelTotalsVertical[levelIndex as number] = totalValueInLevel;
            if (totalValueInLevel > maxTotalValueVertical) { maxTotalValueVertical = totalValueInLevel; }
            if (nodesInCurrentLevel.length > maxNodesInLevelVertical) { maxNodesInLevelVertical = nodesInCurrentLevel.length; }
        }

        const maxTotalPaddingV: number = Math.max(maxNodesInLevelVertical - 1, 0) * this.nodePadding;
        const globalValueToWidthScale: number = maxTotalValueVertical > 0 ? (rect.width - maxTotalPaddingV) / maxTotalValueVertical : 0;

        for (let levelIndex: number = 0; levelIndex < levelCount; levelIndex++) {
            const nodesInCurrentLevel: SankeyNodeLayout[] = nodesGroupedByLevel[levelIndex as number] || [];
            const levelY: number = rect.y + levelIndex * verticalGapBetweenLevels;

            // compute widths (stored in height) for this level
            const nodeSpanWidths: number[] = nodesInCurrentLevel.map((nodeLayout: SankeyNodeLayout): number =>
                Math.max(1, nodeLayout.value * globalValueToWidthScale)
            );

            const totalNodeWidths: number = nodeSpanWidths.reduce((sum: number, width: number): number => sum + width, 0);
            const occupiedWidth: number = totalNodeWidths + Math.max(0, nodeSpanWidths.length - 1) * this.nodePadding;

            // center horizontally inside rect
            let startX: number = rect.x;
            if (occupiedWidth < rect.width) {
                startX = rect.x + (rect.width - occupiedWidth) / 2;
            }

            let currentXPosition: number = startX;

            for (let nodeIndex: number = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                const currentNodeLayout: SankeyNodeLayout = nodesInCurrentLevel[nodeIndex as number];
                currentNodeLayout.y = levelY;
                currentNodeLayout.x = currentXPosition;
                currentNodeLayout.height = nodeSpanWidths[nodeIndex as number];
                currentNodeLayout.outOffset = 0;
                currentNodeLayout.inOffset = 0;

                // Apply user-specified offset (pixels or percentage string) horizontally in vertical layout
                if (!isNullOrUndefined(currentNodeLayout.offset)) {
                    currentNodeLayout.x += (currentNodeLayout.offset as number);
                }

                currentXPosition += currentNodeLayout.height + this.nodePadding;
            }
        }
    }

    /**
     * Creates and appends SVG groups for links, nodes, and labels with a clip-path applied.
     *
     * @param {Sankey} chart - The Sankey chart instance used to create and attach rendering groups.
     * @returns {void}
     */
    private renderGroups(chart: Sankey): void {
        const chartElementId: string = chart.element.id;
        const linkGroupId: string = chartElementId + '_link_collection';
        const nodeGroupId: string = chartElementId + '_node_collection';
        const labelGroupId: string = chartElementId + '_label_collection';
        const clipId: string = chart.element.id + '_sankey_clip';

        const existingLinkGroup: HTMLElement | null = document.getElementById(linkGroupId);
        if (existingLinkGroup && existingLinkGroup.parentNode) { existingLinkGroup.parentNode.removeChild(existingLinkGroup); }

        const existingNodeGroup: HTMLElement | null = document.getElementById(nodeGroupId);
        if (existingNodeGroup && existingNodeGroup.parentNode) { existingNodeGroup.parentNode.removeChild(existingNodeGroup); }

        const existingLabelGroup: HTMLElement | null = document.getElementById(labelGroupId);
        if (existingLabelGroup && existingLabelGroup.parentNode) { existingLabelGroup.parentNode.removeChild(existingLabelGroup); }

        const svgRenderer: SvgRenderer = chart.renderer;
        const linkCollectionGroup: Element = svgRenderer.createGroup({ id: linkGroupId, 'clip-path': 'url(#' + clipId + ')' });
        const nodeCollectionGroup: Element = svgRenderer.createGroup({ id: nodeGroupId, 'clip-path': 'url(#' + clipId + ')' });
        const labelCollectionGroup: Element = svgRenderer.createGroup({ id: labelGroupId, 'clip-path': 'url(#' + clipId + ')' });

        // Append nodes first so links draw on top of nodes, then labels on top
        appendChildElement(false, chart.svgObject, nodeCollectionGroup, false);
        appendChildElement(false, chart.svgObject, linkCollectionGroup, false);
        appendChildElement(false, chart.svgObject, labelCollectionGroup, false);
    }

    /**
     * Renders Sankey data labels near nodes with collision handling and label rendering event support.
     *
     * @param {Sankey} chart - The Sankey chart instance used to render node labels.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     */
    private renderDataLabels(chart: Sankey, nodes: { [key: string]: SankeyNodeLayout }): void {
        const labelSettings: SankeyLabelSettingsModel = chart.labelSettings;
        if (!(labelSettings).visible) { return; }

        let labelPadding: number;
        const labelFontSize: string = String((labelSettings).fontSize);
        const labelFontFamily: string = (labelSettings).fontFamily ? String((labelSettings).fontFamily) : '';
        const labelFontWeight: string = String((labelSettings).fontWeight);
        const labelFontStyle: string = String((labelSettings).fontStyle);
        const defaultLabelColor: string = String(
            (labelSettings).color ||
            (chart.themeStyle && chart.themeStyle.datalabelFont && (chart.themeStyle.datalabelFont.color as string)) ||
            ((chart.theme && /Dark|HighContrast/i.test(String(chart.theme))) ? '#FFFFFF' : '#334155')
        );

        // Store for use in label rendering event
        const labelStyle: SankeyLabelSettingsModel = labelSettings;

        // Build totals for each node: prefer inValue (total incoming), else outValue
        const nodeTotals: { [id: string]: number } = {};
        const nodeIds: string[] = Object.keys(nodes);
        let maxLevel: number = -1;

        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const nodeId: string = nodeIds[nodeIndex as number];
            const nodeLayout: SankeyNodeLayout = nodes[nodeId as string];
            nodeTotals[nodeId as string] = nodeLayout.inValue > 0 ? nodeLayout.inValue : nodeLayout.outValue;
            if (nodeLayout.level > maxLevel) { maxLevel = nodeLayout.level; }
        }

        this.dataLabelRects = [];

        // Ensure per-level label groups inside label collection
        const labelCollection: HTMLElement = document.getElementById(chart.element.id + '_label_collection') as HTMLElement;
        labelCollection.setAttribute('aria-hidden', 'true');

        const ensureLevelLabelGroup: (lvl: number) => HTMLElement = (level: number): HTMLElement => {
            let levelGroup: HTMLElement = document.getElementById(`${chart.element.id}_label_level_${level}_g`) as HTMLElement;
            if (!levelGroup) {
                levelGroup = chart.renderer.createGroup({ id: `${chart.element.id}_label_level_${level}_g` }) as HTMLElement;
                appendChildElement(false, labelCollection, levelGroup, false);
            }
            return levelGroup;
        };

        const isVertical: boolean = chart.orientation === 'Vertical';

        // Render labels next to nodes
        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const nodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];
            const textElement: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGTextElement;

            // Use custom label if available, otherwise use node ID
            const displayName: string = nodeLayout.label || nodeLayout.id;
            let labelText: string = displayName + ' ' + (nodeTotals[nodeLayout.id]);
            let labelColor: string = defaultLabelColor;

            let eventNode: SankeyNode | null = null;
            let eventLink: SankeyLink | null = null;

            const userNodes: SankeyNode[] = Array.isArray(chart.nodes) ? (chart.nodes as SankeyNode[]) : [];
            for (let userNodeIndex: number = 0; userNodeIndex < userNodes.length; userNodeIndex++) {
                const userNode: SankeyNode = userNodes[userNodeIndex as number];
                if (userNode && (userNode as SankeyNode).id === nodeLayout.id) { eventNode = userNode; break; }
            }

            const userLinks: SankeyLink[] = Array.isArray(chart.links) ? (chart.links as SankeyLink[]) : [];
            for (let userLinkIndex: number = 0; userLinkIndex < userLinks.length; userLinkIndex++) {
                const userLink: SankeyLink = userLinks[userLinkIndex as number];
                if (userLink && ((userLink as SankeyLink).sourceId === nodeLayout.id)) { eventLink = userLink; break; }
            }

            // Prefer node-level label settings over chart-level labelSettings
            const nodeLabelSettings: SankeyDataLabelModel = eventNode ? (eventNode as SankeyNode).label : null;
            labelPadding = (nodeLabelSettings && !isNullOrUndefined(nodeLabelSettings.padding)) ? nodeLabelSettings.padding :
                (labelSettings).padding;

            const labelRenderArgs: SankeyLabelRenderEventArgs = {
                text: labelText,
                node: eventNode,
                link: eventLink,
                labelStyle: labelStyle as SankeyTextStyle
            };
            const beforeLabelRendering: string = labelText;

            chart.trigger('labelRendering', labelRenderArgs);
            if (beforeLabelRendering !== labelRenderArgs.text) {
                nodeLayout.label = labelRenderArgs.text;
            }
            labelText = labelRenderArgs.text;
            labelColor = labelRenderArgs.labelStyle.color || defaultLabelColor;

            const levelGroup: HTMLElement = ensureLevelLabelGroup(nodeLayout.level);
            const childIndex: number = levelGroup.childElementCount;

            textElement.setAttribute('id', `${chart.element.id}_label_level_${nodeLayout.level}_${childIndex}`);
            textElement.setAttribute('fill', labelColor);
            textElement.setAttribute('font-size', labelFontSize);
            if (labelFontFamily) { textElement.setAttribute('font-family', labelFontFamily); }
            if (labelFontWeight) { textElement.setAttribute('font-weight', labelFontWeight); }
            if (labelFontStyle) { textElement.setAttribute('font-style', labelFontStyle); }
            textElement.textContent = labelText;

            const fontModel: {
                size: string;
                fontFamily: string;
                fontWeight: string;
                fontStyle: string;
            } = {
                size: labelFontSize,
                fontFamily: labelFontFamily,
                fontWeight: labelFontWeight,
                fontStyle: labelFontStyle
            };

            const textSize: Size = measureText(labelText, fontModel, chart.themeStyle.datalabelFont);

            const labelWidth: number = textSize.width;
            const labelHeight: number = textSize.height;

            let xPos: number;
            let yPos: number;

            let rectX: number;
            let rectY: number;

            // Make isLastColumn available outside the branch so collision-shift can reuse the RTL-aware value
            let isLastColumn: boolean = false;

            if (isVertical) {
                isLastColumn = nodeLayout.level === maxLevel;
                const isLastRow: boolean = isLastColumn;

                yPos = isLastRow ? (nodeLayout.y - labelPadding) : (nodeLayout.y + this.nodeWidth + labelPadding);
                xPos = nodeLayout.x + nodeLayout.height / 2;

                const anchor: string = isLastRow ? 'end' : 'start';

                textElement.setAttribute('x', String(xPos));
                textElement.setAttribute('y', String(yPos));
                textElement.setAttribute('dominant-baseline', anchor === 'end' ? 'baseline' : 'hanging');
                textElement.setAttribute('text-anchor', 'middle');

                if (isLastRow) {
                    rectY = yPos - labelHeight;
                } else {
                    rectY = yPos;
                }
                rectX = xPos - labelWidth / 2;
            } else {
                isLastColumn = isVertical ? (nodeLayout.level === maxLevel) : ((chart.enableRtl) ? (nodeLayout.level === 0)
                    : (nodeLayout.level === maxLevel));
                xPos = isLastColumn ? (nodeLayout.x - labelPadding) : (nodeLayout.x + this.nodeWidth + labelPadding);
                yPos = nodeLayout.y + nodeLayout.height / 2;

                const anchor: string = isLastColumn ? 'end' : 'start';

                // Flip start/end anchor semantics for RTL so text alignment matches direction
                const anchorText: string = (chart && (chart as Sankey).enableRtl) ? (anchor === 'end' ? 'start' : (anchor === 'start' ? 'end' : anchor)) : anchor;

                textElement.setAttribute('x', String(xPos));
                textElement.setAttribute('y', String(yPos));
                textElement.setAttribute('dominant-baseline', 'middle');
                textElement.setAttribute('text-anchor', anchorText);

                if (isLastColumn) {
                    rectX = xPos - labelWidth;
                } else {
                    rectX = xPos;
                }
                rectY = yPos - labelHeight / 2;
            }

            const labelRect: Rect = new Rect(
                rectX,
                rectY,
                labelWidth,
                labelHeight
            );

            let tries: number = 0;
            const maxTries: number = 6;
            const step: number = 10;

            while (isCollide(labelRect, this.dataLabelRects, { x: 0, y: 0, width: 0, height: 0 }) && tries < maxTries) {
                tries++;
                if (isVertical) {
                    labelRect.y += (nodeLayout.level === maxLevel) ? -step : step;
                    yPos += (nodeLayout.level === maxLevel) ? -step : step;
                    textElement.setAttribute('y', String(yPos));
                } else {
                    // use the RTL-aware isLastColumn (declared above) when shifting to avoid LTR-only logic
                    labelRect.x += isLastColumn ? -step : step;
                    xPos += isLastColumn ? -step : step;
                    textElement.setAttribute('x', String(xPos));
                }
            }

            if (!isCollide(labelRect, this.dataLabelRects, { x: 0, y: 0, width: 0, height: 0 })) {
                levelGroup.appendChild(textElement);
                this.dataLabelRects.push(labelRect);
            }
        }
    }

    /**
     * Renders Sankey node rectangles into level-based SVG groups using configured node styles and rendering events.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering nodes.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     *
     * @private
     */
    public renderNodes(chart: Sankey, nodes: { [key: string]: SankeyNodeLayout }): void {
        const nodeCollectionGroup: HTMLElement = document.getElementById(chart.element.id + '_node_collection') as HTMLElement;
        if (!nodeCollectionGroup) { return; }

        const nodeStyle: SankeyNodeSettingsModel = chart.nodeStyle ? chart.nodeStyle : {};
        const nodeStroke: string = nodeStyle.stroke;
        const nodeStrokeWidth: number = typeof nodeStyle.strokeWidth === 'number' ? nodeStyle.strokeWidth : 1;
        const nodeOpacity: number = typeof nodeStyle.opacity === 'number' ? nodeStyle.opacity : 1;
        const nodeFill: string = nodeStyle.fill;
        const isVertical: boolean = chart.orientation === 'Vertical';

        const nodeIds: string[] = Object.keys(nodes);
        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const currentNodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];

            // ensure level group exists
            const levelGroupId: string = `${chart.element.id}_node_level_${currentNodeLayout.level}_g`;
            let levelGroup: Element = document.getElementById(levelGroupId) as Element;
            if (!levelGroup) {
                levelGroup = chart.renderer.createGroup({ id: levelGroupId });
                appendChildElement(false, nodeCollectionGroup, levelGroup, false);
            }

            let fillColor: string = nodeFill || currentNodeLayout.color;

            // Trigger nodeRendering event
            let eventNode: SankeyNode = null;
            const userNodes: SankeyNode[] = (chart.nodes as SankeyNode[]) || [];
            for (let userNodeIndex: number = 0; userNodeIndex < userNodes.length; userNodeIndex++) {
                const userNode: SankeyNode = userNodes[userNodeIndex as number];
                if (userNode && (userNode as SankeyNode).id === currentNodeLayout.id) { eventNode = userNode; break; }
            }

            const nodeRenderArgs: SankeyNodeRenderEventArgs = {
                node: eventNode,
                fill: fillColor
            };
            chart.trigger('nodeRendering', nodeRenderArgs);
            fillColor = nodeRenderArgs.fill;

            let nodeWidth: number = this.nodeWidth;
            let nodeHeight: number = currentNodeLayout.height;
            if (isVertical) {
                nodeWidth = currentNodeLayout.height;
                nodeHeight = this.nodeWidth;
            }

            const nodeRectOptions: RectOption = new RectOption(
                '',
                fillColor,
                { color: nodeStroke, width: nodeStrokeWidth },
                1,
                new Rect(currentNodeLayout.x, currentNodeLayout.y, nodeWidth, nodeHeight)
            );

            const nodeRectElement: HTMLElement = chart.renderer.drawRectangle(nodeRectOptions) as HTMLElement;

            // assign level-based sequential id: <chartId>_node_level_<level>_<index>
            const levelChildCount : number = levelGroup.childElementCount;
            const nodeElementId: string = `${chart.element.id}_node_level_${currentNodeLayout.level}_${levelChildCount }`;

            nodeRectElement.setAttribute('id', nodeElementId);
            nodeRectElement.setAttribute('aria-label', currentNodeLayout.id);
            nodeRectElement.setAttribute('role', 'region');
            nodeRectElement.setAttribute('tabindex', '-1');  // Readable, non-focusable
            nodeRectElement.setAttribute('aria-hidden', 'false');

            // Apply opacity
            if (nodeOpacity < 1) {
                nodeRectElement.setAttribute('opacity', nodeOpacity.toString());
            }

            appendChildElement(false, levelGroup, nodeRectElement, false);
        }
    }

    /**
     * Renders Sankey links into the link collection group with ordering, styling, and link rendering event support.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering links.
     * @param {SankeyLinkModel[]} links - Collection of link models used to create rendered link paths.
     * @param { SankeyNodeLayout } nodes - Map of node id to its computed layout object.
     * @returns {void}
     *
     * @private
     */
    public renderLinks(chart: Sankey, links: SankeyLinkModel[], nodes: { [key: string]: SankeyNodeLayout }): void {
        const linkCollectionGroup: HTMLElement =
            document.getElementById(chart.element.id + '_link_collection') as HTMLElement;
        if (!linkCollectionGroup) { return; }

        const linkStyle: SankeyLinkSettingsModel = chart.linkStyle;
        const effectiveLinkOpacity: number =
            typeof linkStyle.opacity === 'number' ? linkStyle.opacity : this.linkOpacity;

        const isVertical: boolean = chart.orientation === 'Vertical';

        const gapBetweenLevels: number = isVertical ?
            this.getVerticalGapBetweenLevels(nodes, chart.initialClipRect) :
            this.getHorizontalGapBetweenLevels(nodes, chart.initialClipRect);

        // Sort links to produce tidy stacking
        const sortedLinks: SankeyLinkModel[] = links.slice().sort((linkA: SankeyLinkModel, linkB: SankeyLinkModel): number => {
            const sourceA: SankeyNodeLayout = nodes[linkA.sourceId];
            const sourceB: SankeyNodeLayout = nodes[linkB.sourceId];
            const targetA: SankeyNodeLayout = nodes[linkA.targetId];
            const targetB: SankeyNodeLayout = nodes[linkB.targetId];

            if (isVertical) {
                const levelA: number = sourceA ? sourceA.level : 0;
                const levelB: number = sourceB ? sourceB.level : 0;
                if (levelA !== levelB) { return levelA - levelB; }

                const sourceXDiff: number = (sourceA ? sourceA.x : 0) - (sourceB ? sourceB.x : 0);
                if (sourceXDiff !== 0) { return sourceXDiff; }

                return (targetA ? targetA.x : 0) - (targetB ? targetB.x : 0);
            } else {
                const isrtl: boolean = !!(this.chart && (this.chart as Sankey).enableRtl);
                const sourceXA: number = sourceA ? sourceA.x : 0;
                const sourceXB: number = sourceB ? sourceB.x : 0;
                const primary: number = isrtl ? (sourceXB - sourceXA) : (sourceXA - sourceXB);
                if (primary !== 0) { return primary; }

                const targetYA: number = targetA ? targetA.y : 0;
                const targetYB: number = targetB ? targetB.y : 0;
                return targetYA - targetYB;
            }
        });

        const userLinks: SankeyLink[] = (chart.links as SankeyLink[]) || [];
        const colorType: string = chart.linkStyle && (chart.linkStyle).colorType;

        for (let linkIndex: number = 0; linkIndex < sortedLinks.length; linkIndex++) {
            const currentLink: SankeyLinkModel = sortedLinks[linkIndex as number];
            const sourceNodeLayout: SankeyNodeLayout = nodes[currentLink.sourceId];
            const targetNodeLayout: SankeyNodeLayout = nodes[currentLink.targetId];
            if (!sourceNodeLayout || !targetNodeLayout) { continue; }

            // Find matching user link for event payload (if any)
            let eventLink: SankeyLink | null = null;
            for (let j: number = 0; j < userLinks.length; j++) {
                const ul: SankeyLink = userLinks[j as number];
                if (ul && ul.sourceId === currentLink.sourceId && ul.targetId === currentLink.targetId) {
                    eventLink = ul;
                    break;
                }
            }

            // Determine default link color based on configured colorType: Blend, Source, or Target
            let defaultLinkColor: string;

            if (colorType === 'Target') {
                defaultLinkColor = targetNodeLayout.color;
            } else if (colorType === 'Blend') {
                // Use gradient id
                const gradId: string = this.getOrCreateLinkGradient(
                    chart,
                    sourceNodeLayout.color,
                    targetNodeLayout.color,
                    /* isHorizontal */ !isVertical,
                    /* isRtl */ !!(chart as Sankey).enableRtl,
                    /* index */ linkIndex,
                    currentLink.sourceId,
                    currentLink.targetId
                );
                defaultLinkColor = gradId; // renderer will convert to url(#id)
            } else {
                // 'Source' or fallback
                defaultLinkColor = sourceNodeLayout.color;
            }

            const linkRenderArgs: SankeyLinkRenderEventArgs = {
                // Prefer the user-facing link object; fall back to model if needed
                link: (eventLink) || (currentLink as SankeyLink),
                fill: defaultLinkColor
            };

            chart.trigger('linkRendering', linkRenderArgs);

            const finalFill: string =
                (linkRenderArgs && linkRenderArgs.fill) ? linkRenderArgs.fill : defaultLinkColor;

            if (isVertical) {
                this.renderVerticalLink(
                    linkCollectionGroup,
                    currentLink,
                    sourceNodeLayout,
                    targetNodeLayout,
                    gapBetweenLevels,
                    effectiveLinkOpacity,
                    linkIndex,
                    finalFill
                );
            } else {
                this.renderHorizontalLink(
                    linkCollectionGroup,
                    currentLink,
                    sourceNodeLayout,
                    targetNodeLayout,
                    gapBetweenLevels,
                    effectiveLinkOpacity,
                    linkIndex,
                    finalFill
                );
            }
        }
    }

    /**
     * Renders a horizontal Sankey link path between source and target nodes and appends it into a level-based SVG group.
     *
     * @param {Element} linkCollectionGroup - The parent SVG group that holds all rendered link groups.
     * @param {SankeyLinkModel} currentLink - The current link model used to compute the rendered path and metadata.
     * @param {SankeyNodeLayout} sourceNode - The source node layout used to compute link start position and thickness.
     * @param {SankeyNodeLayout} targetNode - The target node layout used to compute link end position and thickness.
     * @param {number} gapBetweenLevels - The horizontal gap between node levels used for bezier curvature calculation.
     * @param {number} linkOpacity - The opacity value applied to the rendered link path.
     * @param {number} index - The link index used to generate a stable link key attribute.
     * @param {string} fill - The fill colcor based on the selected theme style.
     * @returns {void}
     *
     * @private
     */
    public renderHorizontalLink(linkCollectionGroup: Element, currentLink: SankeyLinkModel, sourceNode: SankeyNodeLayout,
                                targetNode: SankeyNodeLayout, gapBetweenLevels: number, linkOpacity: number,
                                index: number, fill: string): void {
        const outgoingLinkHeight: number = sourceNode.value > 0 ? (currentLink.value / sourceNode.value) * sourceNode.height : 0;
        const incomingLinkHeight: number = targetNode.value > 0 ? (currentLink.value / targetNode.value) * targetNode.height : 0;
        const linkHeight: number = Math.max(0, Math.min(outgoingLinkHeight, incomingLinkHeight));

        const isRtl: boolean = this.chart && (this.chart as Sankey).enableRtl;

        // In RTL mode: source connects from left, target connects to right
        // In LTR mode: source connects from right, target connects to left
        const sourceX: number = isRtl ? sourceNode.x : (sourceNode.x + this.nodeWidth);
        const sourceY: number = sourceNode.y + sourceNode.outOffset + linkHeight / 2;
        const targetX: number = isRtl ? (targetNode.x + this.nodeWidth) : targetNode.x;
        const targetY: number = targetNode.y + targetNode.inOffset + linkHeight / 2;
        sourceNode.outOffset += linkHeight;
        targetNode.inOffset += linkHeight;

        const curvatureOffset: number = gapBetweenLevels * this.linkCurvature;
        const pointX: number = isRtl ? (sourceX - curvatureOffset) : (sourceX + curvatureOffset);
        const pointY: number = isRtl ? (targetX + curvatureOffset) : (targetX - curvatureOffset);

        // Build closed ribbon path (top edge -> target top -> target bottom -> source bottom -> close)
        const sourceTop: number = (sourceY - linkHeight / 2) || 0;
        const sourceBottom: number = (sourceY + linkHeight / 2) || 0;
        const targetTop: number = (targetY - linkHeight / 2) || 0;
        const targetBottom: number = (targetY + linkHeight / 2 ) || 0;

        const pathD: string =
            'M ' + sourceX + ' ' + sourceTop +
            ' C ' + pointX + ' ' + sourceTop + ', ' + pointY + ' ' + targetTop + ', ' + targetX + ' ' + targetTop +
            ' L ' + targetX + ' ' + targetBottom +
            ' C ' + pointY + ' ' + targetBottom + ', ' + pointX + ' ' + sourceBottom + ', ' + sourceX + ' ' + sourceBottom +
            ' Z';

        const linkPathElement: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGPathElement;
        const levelGroupId: string = `${this.chart.element.id}_link_level_${sourceNode.level}_g`;
        let levelGroup: Element = document.getElementById(levelGroupId) as Element;

        if (!levelGroup) {
            levelGroup = this.chart.renderer.createGroup({ id: levelGroupId });
            appendChildElement(false, linkCollectionGroup, levelGroup, false);
        }

        const levelChildCount : number = levelGroup.childElementCount;
        const generatedLinkId: string = `${this.chart.element.id}_link_level_${sourceNode.level}_${levelChildCount }`;

        linkPathElement.setAttribute('id', generatedLinkId);
        linkPathElement.setAttribute('d', pathD);
        // Use gradient URL if grad id provided, otherwise color fill
        if (fill && fill.indexOf('gradient-') === 0) {
            linkPathElement.setAttribute('fill', `url(#${fill})`);
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        } else if (fill && fill.indexOf('url(') === 0) {
            linkPathElement.setAttribute('fill', fill);
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        } else {
            linkPathElement.setAttribute('fill', fill || sourceNode.color);
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        }
        linkPathElement.setAttribute('opacity', linkOpacity ? linkOpacity.toString() : '1');
        linkPathElement.setAttribute('data-source', currentLink.sourceId);
        linkPathElement.setAttribute('data-target', currentLink.targetId);
        linkPathElement.setAttribute('data-value', currentLink.value.toString());
        linkPathElement.setAttribute(
            'data-link-key',
            `${currentLink.sourceId}__${currentLink.targetId}__${index}`
        );
        linkPathElement.setAttribute('role', 'link');

        const linkDescription: string = this.chart.accessibility.accessibilityDescription ||
            `From ${currentLink.sourceId} to ${currentLink.targetId}: Value ${currentLink.value}`;
        linkPathElement.setAttribute('aria-label', linkDescription);
        linkPathElement.setAttribute('tabindex', '-1');

        appendChildElement(false, levelGroup, linkPathElement, false);
    }

    /**
     * Renders a vertical Sankey link as a filled ribbon path between source and target nodes and appends it into a level-based SVG group.
     *
     * @param {Element} linkCollectionGroup - The parent SVG group that holds all rendered link groups.
     * @param {SankeyLinkModel} currentLink - The current link model used to compute the rendered ribbon path and metadata.
     * @param {SankeyNodeLayout} sourceNode - The source node layout used to compute ribbon start position and thickness.
     * @param {SankeyNodeLayout} targetNode - The target node layout used to compute ribbon end position and thickness.
     * @param {number} gapBetweenLevels - The vertical gap between node levels used for curvature calculation.
     * @param {number} linkOpacity - The opacity value applied to the rendered ribbon path.
     * @param {number} index - The link index used to generate a stable link key attribute.
     * @param {string} fill - The fill color of link based on theme color selected.
     * @returns {void}
     *
     * @private
     */
    public renderVerticalLink(linkCollectionGroup: Element, currentLink: SankeyLinkModel, sourceNode: SankeyNodeLayout,
                              targetNode: SankeyNodeLayout, gapBetweenLevels: number, linkOpacity: number,
                              index: number, fill: string ): void {

        const outBandWidth: number = sourceNode.value > 0 ? (currentLink.value / sourceNode.value) * sourceNode.height : 0;
        const inBandWidth: number = targetNode.value > 0 ? (currentLink.value / targetNode.value) * targetNode.height : 0;
        const linkBaseWidt: number = Math.min(outBandWidth, inBandWidth);

        // Clamp to remaining band on each node so the last link closes cleanly
        const sourceRemainingWidth: number = Math.max(0, sourceNode.height - sourceNode.outOffset);
        const targetRemainingWidth: number = Math.max(0, targetNode.height - targetNode.inOffset);
        let linkWidth: number = Math.max(0, Math.min(linkBaseWidt, sourceRemainingWidth, targetRemainingWidth));

        if (sourceRemainingWidth - linkWidth < 0.5 || targetRemainingWidth - linkWidth < 0.5) {
            linkWidth = Math.min(sourceRemainingWidth, targetRemainingWidth);
        }

        // Left/right edges on source and target nodes (in vertical layout, node.height represents horizontal span)
        const sourceLeftX: number = sourceNode.x + sourceNode.outOffset;
        const sourceRightX: number = sourceLeftX + linkWidth;

        const targetLeftX: number = targetNode.x + targetNode.inOffset;
        const targetRightX: number = targetLeftX + linkWidth;

        // Y coordinates: from bottom of source row to top of target row
        const y1: number = sourceNode.y + this.nodeWidth;  // bottom of source node (row thickness = nodeWidth)
        const y2: number = targetNode.y;                   // top of target node

        // Update offsets AFTER we compute this band
        sourceNode.outOffset += linkWidth;
        targetNode.inOffset += linkWidth;

        // Curvature clamped to half the gap
        const rawCurv: number = gapBetweenLevels * this.linkCurvature;
        const vGap: number = Math.max(0, y2 - y1);
        const curve: number = Math.min(rawCurv, Math.max(0, vGap / 2 - 1));

        const c1Y: number = y1 + curve;
        const c2Y: number = y2 - curve;

        // Build closed ribbon path
        const pathD: string =
            'M ' + sourceLeftX + ' ' + y1 +
            ' C ' + sourceLeftX + ' ' + c1Y + ', ' + targetLeftX + ' ' + c2Y + ', ' + targetLeftX + ' ' + y2 +
            ' L ' + targetRightX + ' ' + y2 +
            ' C ' + targetRightX + ' ' + c2Y + ', ' + sourceRightX + ' ' + c1Y + ', ' + sourceRightX + ' ' + y1 +
            ' Z';

        const linkPathElement: SVGPathElement =
            document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGPathElement;

        const levelGroupId: string = `${this.chart.element.id}_link_level_${sourceNode.level}_g`;
        let levelGroup: Element = document.getElementById(levelGroupId) as Element;

        if (!levelGroup) {
            levelGroup = this.chart.renderer.createGroup({ id: levelGroupId });
            appendChildElement(false, linkCollectionGroup, levelGroup, false);
        }

        const levelChildCount : number = levelGroup.childElementCount;
        const generatedLinkId: string = `${this.chart.element.id}_link_level_${sourceNode.level}_${levelChildCount }`;

        linkPathElement.setAttribute('id', generatedLinkId);
        linkPathElement.setAttribute('d', pathD);

        // Use gradient URL if grad id provided, otherwise color fill
        if (fill && fill.indexOf('gradient-') === 0) {
            linkPathElement.setAttribute('fill', `url(#${fill})`);
        } else if (fill && fill.indexOf('url(') === 0) {
            linkPathElement.setAttribute('fill', fill);
        } else {
            linkPathElement.setAttribute('fill', fill || sourceNode.color);
        }

        linkPathElement.setAttribute('opacity', linkOpacity.toString());
        linkPathElement.setAttribute('data-source', currentLink.sourceId);
        linkPathElement.setAttribute('data-target', currentLink.targetId);
        linkPathElement.setAttribute('data-value', currentLink.value.toString());
        linkPathElement.setAttribute('data-link-key', `${currentLink.sourceId}__${currentLink.targetId}__${index}`);
        linkPathElement.setAttribute('role', 'link');

        const linkDescription: string = this.chart.accessibility.accessibilityDescription ||
            `From ${currentLink.sourceId} to ${currentLink.targetId}: Value ${currentLink.value}`;
        linkPathElement.setAttribute('aria-label', linkDescription);
        linkPathElement.setAttribute('tabindex', '-1');

        appendChildElement(false, levelGroup, linkPathElement, false);
    }

    /**
     * Calculates the horizontal gap between node levels based on the minimum and maximum levels present.
     *
     * @param { SankeyNodeLayout } nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    public getHorizontalGapBetweenLevels(nodes: { [key: string]: SankeyNodeLayout }, rect: Rect): number {
        let minimumLevel: number = 9007199254740991; // Number.MAX_SAFE_INTEGER alternative
        let maximumLevel: number = -1;
        const nodeIds: string[] = Object.keys(nodes);

        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const currentNodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];
            minimumLevel = minimumLevel < currentNodeLayout.level ? minimumLevel : currentNodeLayout.level;
            maximumLevel = maximumLevel > currentNodeLayout.level ? maximumLevel : currentNodeLayout.level;
        }

        const totalLevels: number = (maximumLevel - minimumLevel > 0 ? (maximumLevel - minimumLevel) : 0) + 1;
        return (totalLevels > 1) ? (rect.width - this.nodeWidth) / (totalLevels - 1) : rect.width;
    }

    /**
     * Calculates the vertical gap between node levels based on the minimum and maximum levels present.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    public getVerticalGapBetweenLevels(nodes: { [key: string]: SankeyNodeLayout }, rect: Rect): number {
        let minimumLevel: number = 9007199254740991; // Number.MAX_SAFE_INTEGER alternative
        let maximumLevel: number = -1;
        const nodeIds: string[] = Object.keys(nodes);

        for (let nodeIndex: number = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            const currentNodeLayout: SankeyNodeLayout = nodes[nodeIds[nodeIndex as number]];
            minimumLevel = minimumLevel < currentNodeLayout.level ? minimumLevel : currentNodeLayout.level;
            maximumLevel = maximumLevel > currentNodeLayout.level ? maximumLevel : currentNodeLayout.level;
        }

        const totalLevels: number = (maximumLevel - minimumLevel > 0 ? (maximumLevel - minimumLevel) : 0) + 1;
        return (totalLevels > 1) ? (rect.height - this.nodeWidth) / (totalLevels - 1) : rect.height;
    }

    /**
     * Sanitizes a string value into a DOM-safe identifier by replacing unsupported characters with underscores.
     *
     * @param {string} text - The input text to be sanitized for DOM id usage.
     * @returns {string} return string of Id.
     */
    private sanitizeId(text: string): string {
        return text.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    /**
     * Creates (or reuses) an SVG <linearGradient> definition for a link that transitions from startColor to endColor.
     *
     * @param {Sankey} chart - The Sankey chart instance used to access the SVG root and renderer.
     * @param {string} startColor - The gradient start color applied at 0% offset.
     * @param {string} endColor - The gradient end color applied at 100% offset.
     * @param {boolean} isHorizontal - Indicates whether the link gradient should be applied horizontally.
     * @param {boolean} isRtl - Indicates whether the gradient direction should be reversed for RTL layouts.
     * @param {number} index - The link index used to generate a stable unique gradient id.
     * @param {string} sourceId - The source node id used to generate a stable unique gradient id.
     * @param {string} targetId - The target node id used to generate a stable unique gradient id.
     * @returns {string} The id of the created/reused gradient, or a fallback solid color when SVG is unavailable.
     *
     * @private
     */
    public getOrCreateLinkGradient(chart: Sankey, startColor: string, endColor: string, isHorizontal: boolean,
                                   isRtl: boolean, index: number, sourceId: string, targetId: string): string {
        const svgRootElement: SVGSVGElement | null = chart.svgObject as SVGSVGElement | null;
        if (!svgRootElement) { return startColor || endColor || '#000000'; }

        // Use renderer to create defs to match existing patterns in the codebase
        let defsElement: Element | null = svgRootElement.querySelector('defs');
        if (!defsElement) {
            defsElement = chart.renderer.createDefs();
            svgRootElement.append(defsElement);
        }

        const gradientId: string =
            `gradient-${this.sanitizeId(chart.element.id)}_` +
            `${this.sanitizeId(String(sourceId))}_` +
            `${this.sanitizeId(String(targetId))}_` +
            `${index}`;

        if (defsElement.querySelector(`#${gradientId}`)) { return gradientId; }

        const svgNamespaceUri: string = 'http://www.w3.org/2000/svg';
        const linearGradientElement: SVGLinearGradientElement =
            document.createElementNS(svgNamespaceUri, 'linearGradient') as SVGLinearGradientElement;

        linearGradientElement.setAttribute('id', gradientId);

        if (isHorizontal) {
            if (isRtl) {
                linearGradientElement.setAttribute('x1', '100%');
                linearGradientElement.setAttribute('y1', '0%');
                linearGradientElement.setAttribute('x2', '0%');
                linearGradientElement.setAttribute('y2', '0%');
            } else {
                linearGradientElement.setAttribute('x1', '0%');
                linearGradientElement.setAttribute('y1', '0%');
                linearGradientElement.setAttribute('x2', '100%');
                linearGradientElement.setAttribute('y2', '0%');
            }
        } else {
            linearGradientElement.setAttribute('x1', '0%');
            linearGradientElement.setAttribute('y1', '0%');
            linearGradientElement.setAttribute('x2', '0%');
            linearGradientElement.setAttribute('y2', '100%');
        }

        const startStopElement: SVGStopElement =
            document.createElementNS(svgNamespaceUri, 'stop') as SVGStopElement;
        startStopElement.setAttribute('offset', '0%');
        startStopElement.setAttribute('stop-color', startColor);
        startStopElement.setAttribute('stop-opacity', '1');

        const endStopElement: SVGStopElement =
            document.createElementNS(svgNamespaceUri, 'stop') as SVGStopElement;
        endStopElement.setAttribute('offset', '100%');
        endStopElement.setAttribute('stop-color', endColor);
        endStopElement.setAttribute('stop-opacity', '1');

        linearGradientElement.appendChild(startStopElement);
        linearGradientElement.appendChild(endStopElement);
        defsElement.appendChild(linearGradientElement);

        return gradientId;
    }

    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    constructor(chart: Sankey) { this.chart = chart; }

    /**
     * To destroy the series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'SankeySeries';
    }

    /**
     * Animate the clip rect for Sankey reveal.
     *
     * @param {HTMLElement} clipElement - The clip rectangle element used to reveal Sankey elements.
     * @param {Rect} rect - The clipping rectangle bounds used to compute the reveal transform.
     * @param {Sankey} chart - The Sankey chart instance used to resolve animation settings and orientation.
     * @returns {void}
     */
    private animateClipRect(clipElement: HTMLElement, rect: Rect, chart: Sankey): void {
        const animationEffect: Function = getAnimationFunction('Linear');
        const duration: number = (chart.animation).duration;
        clipElement.style.visibility = 'hidden';
        new Animation({}).animate(clipElement, {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                clipElement.style.visibility = 'visible';
                if (chart.orientation === 'Vertical') {
                    const animatedValue: number = animationEffect(args.timeStamp, 0, rect.height, args.duration);
                    const xAnchor: number = rect.x + rect.width / 2;
                    const yAnchor: number = rect.y + rect.height; // anchor at bottom
                    clipElement.setAttribute(
                        'transform',
                        'translate(' + xAnchor + ' ' + yAnchor + ') scale(1,' + (animatedValue / rect.height) + ') translate(' + (-xAnchor) + ' ' + (-yAnchor) + ')'
                    );
                } else {
                    const animatedValue: number = animationEffect(args.timeStamp, 0, rect.width, args.duration);
                    // For RTL, anchor at right edge so reveal runs right->left
                    const isRtl: boolean = chart && (chart as Sankey).enableRtl;
                    const xAnchor: number = isRtl ? (rect.x + rect.width) : rect.x;
                    const yAnchor: number = rect.y + rect.height / 2;
                    const scaleX: number = (animatedValue / rect.width);
                    // when anchoring at right we still scale from 0->1; transform sequence centers on anchor
                    clipElement.setAttribute(
                        'transform',
                        'translate(' + xAnchor + ' ' + yAnchor + ') scale(' + (scaleX) + ',1) translate(' + (-xAnchor) + ' ' + (-yAnchor) + ')'
                    );
                }
            },
            end: (): void => {
                clipElement.setAttribute('transform', 'translate(0,0)');
                if ((chart).trigger) { chart.trigger('animationComplete', {}); }
            }
        });
    }
}
