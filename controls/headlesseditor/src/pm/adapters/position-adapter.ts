/**
 * position-adapter.ts — Converts between public Position and PM integer positions.
 *
 * PositionAdapter maintains a per-state cache (CachedNodeInfo keyed by nodeId)
 * so that multiple operations in one transaction batch can resolve positions
 * without repeated document traversals.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 */
import { PMNode, Mapping, PMMapResult } from '../pm-guard';
import { Position } from '../../model/position';
import { InternalPosition } from '../types/internal-position';

// ── Cache type ────────────────────────────────────────────────────────────────

/**
 * Precomputed node geometry for a single document state.
 * `pmBefore` / `pmAfter` are the absolute PM positions immediately before/after
 * the node's content (i.e. the token positions of the node's open/close tags).
 */
export interface CachedNodeInfo {
    /** Absolute PM position of the node-open token. */
    pmBefore: number;
    /** Absolute PM position of the node-close token. */
    pmAfter: number;
    /** Total size in PM position units (content + 2 for block nodes, 0 for text). */
    nodeSize: number;
    /** First content position inside the node (pmBefore + 1 for block nodes). */
    start: number;
    /** Last content position inside the node. */
    end: number;
}

// ── Adapter ───────────────────────────────────────────────────────────────────

export class PositionAdapter {
    private cache: Map<string, CachedNodeInfo>;

    constructor() {
        this.cache = new Map<string, CachedNodeInfo>();
    }

    // ── Cache management ──────────────────────────────────────────────────────

    /**
     * Clears all cached node geometry.
     * Must be called after every PM transaction dispatch so stale positions
     * are not reused across document states.
     *
     * @returns {void}
     */
    public invalidateCache(): void {
        this.cache.clear();
    }

    // ── Resolve position ──────────────────────────────────────────────────────

    /**
     * Converts a public Position to an InternalPosition carrying the resolved
     * absolute PM integer position.
     *
     * Traverses the PM document once per unique nodeId per transaction
     * (subsequent lookups hit the cache).
     *
     * @param {Position} pos - The public position to convert.
     * @param {PMNode} pmDoc - The current PM document used for context.
     * @returns {InternalPosition} The internal position with the resolved PM offset.
     * @throws Error if the nodeId does not exist in the current PM document.
     */
    public toPMPosition(pos: Position, pmDoc: PMNode): InternalPosition {
        const info: CachedNodeInfo = this.getNodeInfo(pos.nodeId, pmDoc);
        const pmPos: number = info.start + pos.offset;
        return { nodeId: pos.nodeId, offset: pos.offset, pmPos };
    }

    /**
     * Converts an absolute PM integer position back to a public Position.
     *
     * Walks the document to find the node whose content range contains
     * `pmPos` and computes the local offset within it.
     *
     * @param {number} pmPos - The absolute PM integer position to convert.
     * @param {PMNode} pmDoc - The current PM document used for context.
     * @returns {Position} The corresponding public Position.
     * @throws Error if `pmPos` does not resolve to a known node.
     */
    public fromPMPosition(pmPos: number, pmDoc: PMNode): Position {
        let found: { nodeId: string; offset: number } | null = null;

        pmDoc.nodesBetween(pmPos, pmPos, (node: PMNode, pos: number) => {
            if (found) { return false; }
            const nodeId: string | null = node.attrs ? node.attrs['id'] : null;
            if (!nodeId) { return true; }

            const start: number = pos + 1; // first content position inside node
            if (pmPos >= start && pmPos <= start + node.content.size) {
                found = { nodeId: String(nodeId), offset: pmPos - start };
                return false;
            }
            return true;
        });

        if (!found) {
            throw new Error('PositionAdapter.fromPMPosition: no node contains pmPos=' + pmPos);
        }
        return found as Position;
    }

    /**
     * Remaps a public Position through a PM Mapping (produced by a transaction)
     * so callers can track positions as the document mutates.
     *
     * Returns null when the position was deleted by the mapping.
     *
     * @param {Position} pos - The public position to remap.
     * @param {PMNode} pmDoc - The current PM document used for context.
     * @param {Mapping} mapping - The PM mapping produced by the transaction.
     * @returns {Position} The remapped public position, or null if it was deleted.
     */
    public mapAfterTransaction(
        pos: Position,
        pmDoc: PMNode,
        mapping: Mapping
    ): Position | null {
        let internal: InternalPosition;
        try {
            internal = this.toPMPosition(pos, pmDoc);
        } catch (e) {
            return null;
        }

        const mapped: PMMapResult = mapping.mapResult(internal.pmPos);
        if (mapped.deleted) { return null; }

        // Re-resolve the mapped PM position back to a public Position
        try {
            return this.fromPMPosition(mapped.pos, pmDoc);
        } catch (e) {
            return null;
        }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private getNodeInfo(nodeId: string, pmDoc: PMNode): CachedNodeInfo {
        const cached: CachedNodeInfo | undefined = this.cache.get(nodeId);
        if (cached) { return cached; }

        const info: CachedNodeInfo | null = this.findNode(nodeId, pmDoc);
        if (!info) {
            throw new Error('PositionAdapter: nodeId "' + nodeId + '" not found in document.');
        }
        this.cache.set(nodeId, info);
        return info;
    }

    private findNode(nodeId: string, pmDoc: PMNode): CachedNodeInfo | null {
        let result: CachedNodeInfo | null = null;

        pmDoc.descendants((node: PMNode, pos: number) => {
            if (result) { return false; }
            const id: string | null = node.attrs ? node.attrs['id'] : null;
            if (!id || String(id) !== nodeId) { return true; }

            const pmBefore: number = pos;
            const nodeSize: number = node.nodeSize;
            const pmAfter: number = pos + nodeSize;
            const start: number = node.isText ? pos : pos + 1;
            const end: number = node.isText ? pos + nodeSize : pos + nodeSize - 1;

            result = { pmBefore, pmAfter, nodeSize, start, end };
            return false;
        });

        return result;
    }
}
