import { NodeModel, Diagram } from '@syncfusion/ej2-diagrams';
import { WorkflowPosition } from '../models/workflow-position';

/**
 * Strategy for staggering node placement.
 * - 'grid': arrange nodes in a grid layout with configurable columns
 * - 'diagonal': arrange nodes diagonally (legacy, not used by default)
 *
 * @private
 */
export type StaggerStrategy = 'diagonal';

/**
 * Configuration options for staggering node positioning.
 *
 * @private
 */
export interface StaggerOptions {
    /** Logical group name to keep independent sequences (e.g., 'sticky', 'step') */
    group?: string;
    /** Horizontal step in pixels for diagonal placement (default 16) */
    stepX?: number;
    /** Vertical step in pixels for diagonal placement (default 16) */
    stepY?: number;
    /** Strategy to place the next node (default 'diagonal') */
    strategy?: StaggerStrategy;
    /**
     * If true, derive index from existing nodes on the canvas (persistent across reloads)
     * by scanning addInfo.stagger.{group,index}. If false, use an in‑memory counter.
     * Default: true (more robust).
     */
    usePersistentIndex?: boolean;
}

/** Internal counters per Diagram instance and group (when not scanning the canvas). */
const counters: WeakMap<Diagram, Map<string, number>> = new WeakMap<Diagram, Map<string, number>>();

/**
 * Get the next counter value for a diagram and group.
 *
 * @param {Diagram} diagram The Diagram instance.
 * @param {string} group The group name.
 * @returns {number} The next counter value (starting from 0).
 * @private
 */
function nextCounter(diagram: Diagram, group: string): number {
    let map: Map<string, number> | undefined = counters.get(diagram);
    if (!map) {
        map = new Map();
        counters.set(diagram, map);
    }
    const current: number | undefined = map.get(group);
    const n: number = (current !== undefined && current !== null ? current : 0) + 1;
    map.set(group, n);
    return n - 1; // return index starting at 0
}

/**
 * Reset the counter for a specific diagram and group.
 * This is useful when nodes are deleted to reuse their positions.
 *
 * @param {Diagram} diagram The Diagram instance.
 * @param {string} group The group name.
 * @returns {void}
 * @private
 */
export function resetStaggerCounter(diagram: Diagram, group: string): void {
    const map: Map<string, number> | undefined = counters.get(diagram);
    if (map) {
        map.delete(group);
    }
}

/**
 * Compute the next staggered diagonal offset near a base point for the given group.
 * Returns { x, y, index } where index is the sequential number used for the offset.
 *
 * @param {Diagram} diagram The Diagram instance.
 * @param {number} baseX Base X coordinate.
 * @param {number} baseY Base Y coordinate.
 * @param {StaggerOptions} opts Stagger options for diagonal placement.
 * @returns {Object} Object containing x, y, and index properties.
 * @private
 */
export function getNextStaggeredOffset(
    diagram: Diagram,
    baseX: number,
    baseY: number,
    opts: StaggerOptions = {}
): { x: number; y: number; index: number } {
    const {
        group = 'default',
        stepX = 80,
        stepY = 80,
        usePersistentIndex = true
    } = opts;

    // Determine the next index
    let index: number = 0;
    if (usePersistentIndex) {
        // Scan the canvas for nodes that were previously auto-placed for this group
        const existing: NodeModel[] = (diagram.nodes || []).filter((n: NodeModel) => {
            const info: any = (n as any).addInfo;
            return info && info.stagger && info.stagger.group === group && typeof info.stagger.index === 'number';
        }) as NodeModel[];

        if (existing.length) {
            // next index = maxIndex + 1
            const maxIndex: number = Math.max(
                ...existing.map((n: NodeModel) => (n as any).addInfo.stagger.index as number)
            );
            index = maxIndex + 1;
        } else {
            index = 0;
        }
    } else {
        index = nextCounter(diagram, group);
    }

    // Compute diagonal offsets: each node is offset by (stepX, stepY) from the previous
    const dx: number = index * stepX;
    const dy: number = index * stepY;

    return { x: baseX + dx, y: baseY + dy, index };
}

/**
 * Helper to stamp addInfo with persistent stagger metadata.
 * Call this on the node before adding it to the diagram to persist group/index.
 *
 * @param {NodeModel} node The Diagram node to update.
 * @param {string} group The group name for this staggered node.
 * @param {number} index The sequential index for this node in the group.
 * @returns {void}
 * @private
 */
export function applyStaggerMetadata(
    node: NodeModel,
    group: string,
    index: number
): void {
    const addInfo: any = (node.addInfo !== undefined && node.addInfo !== null ? node.addInfo : {}) as any;
    addInfo.stagger = { group: group, index: index };
    addInfo.autoPlaced = true;
    node.addInfo = addInfo;
}

/**
 * Get the stagger metadata from a node if it exists.
 *
 * @param {NodeModel} node The Diagram node to check.
 * @returns {any} The stagger metadata or null if not found.
 * @private
 */
export function getStaggerMetadata(node: NodeModel): any {
    const addInfo: any = (node as any).addInfo;
    if (addInfo && addInfo.stagger && typeof addInfo.stagger.group === 'string' && typeof addInfo.stagger.index === 'number') {
        return addInfo.stagger;
    }
    return null;
}

/**
 * Check if a node was auto-placed using stagger positioning.
 *
 * @param {NodeModel} node The Diagram node to check.
 * @returns {boolean} True if the node was auto-placed.
 * @private
 */
export function isAutoPlacedNode(node: NodeModel): boolean {
    const addInfo: any = (node as any).addInfo;
    return addInfo && addInfo.autoPlaced === true;
}

/**
 * Recompute stagger indices for all nodes in a group.
 * This consolidates positions after nodes are deleted to eliminate gaps.
 *
 * @param {Diagram} diagram The Diagram instance.
 * @param {string} group The group name to reindex.
 * @returns {void}
 * @private
 */
export function reindexStaggerGroup(diagram: Diagram, group: string): void {
    if (!diagram.nodes) {
        return;
    }

    const nodes: NodeModel[] = (diagram.nodes as NodeModel[])
        .filter((n: NodeModel) => {
            const metadata: any = getStaggerMetadata(n);
            return metadata && metadata.group === group;
        })
        .sort((a: NodeModel, b: NodeModel) => {
            const metaA: any = getStaggerMetadata(a);
            const metaB: any = getStaggerMetadata(b);
            return (metaA && metaA.index ? metaA.index : 0) - (metaB && metaB.index ? metaB.index : 0);
        });

    // Re-assign indices sequentially
    nodes.forEach((node: NodeModel, newIndex: number) => {
        const metadata: any = getStaggerMetadata(node);
        if (metadata) {
            applyStaggerMetadata(node, metadata.group, newIndex);
        }
    });
}

/**
 * Calculate position for a node that should be auto-placed in a staggered grid.
 * If the node already has a position, returns that position unchanged.
 *
 * @param {NodeModel} node The Diagram node to position.
 * @param {Diagram} diagram The Diagram instance.
 * @param {object} basePosition Optional base position (default uses diagram viewport center).
 * @param {string} group The group name for staggering.
 * @param {Partial<StaggerOptions>} options Additional stagger options.
 * @returns {WorkflowPosition} The WorkflowPosition to apply to the node.
 * @private
 */
export function getAutoPlacementPosition(
    node: NodeModel,
    diagram: Diagram,
    basePosition?: { x: number; y: number },
    group: string = 'paletteNode',
    options: Partial<StaggerOptions> = {}
): WorkflowPosition {
    // If node already has a position, keep it
    if (node.offsetX !== undefined && node.offsetX !== 0 && node.offsetY !== undefined && node.offsetY !== 0) {
        return { x: node.offsetX, y: node.offsetY };
    }

    // Default base position: center of viewport
    let baseX: number = (basePosition && basePosition.x ? basePosition.x : 300);
    let baseY: number = (basePosition && basePosition.y ? basePosition.y : 200);

    if (!basePosition && diagram.scrollSettings) {
        baseX = (diagram.scrollSettings.viewPortWidth ? diagram.scrollSettings.viewPortWidth : 600) / 3;
        baseY = (diagram.scrollSettings.viewPortHeight ? diagram.scrollSettings.viewPortHeight : 400) / 4;
    }

    // Calculate staggered diagonal position
    const { x, y, index } = getNextStaggeredOffset(diagram, baseX, baseY, {
        group: group,
        strategy: 'diagonal',
        stepX: options.stepX ? options.stepX : 160,
        stepY: options.stepY ? options.stepY : 160,
        usePersistentIndex: true
    });

    // Apply metadata
    applyStaggerMetadata(node, group, index);

    return { x, y };
}

/**
 * Cleanup stagger metadata when a node is removed.
 * This allows the position to be reused by the next node in the group.
 *
 * @param {NodeModel} node The Diagram node being removed.
 * @param {Diagram} diagram The Diagram instance.
 * @returns {void}
 * @private
 */
export function onNodeRemoved(node: NodeModel, diagram: Diagram): void {
    const metadata: any = getStaggerMetadata(node);
    if (metadata) {
        // Reindex the group to eliminate gaps
        reindexStaggerGroup(diagram, metadata.group);
    }
}
