/**
 * position-adapter.ts — Converts between public Position and PM integer positions.
 *
 * Syncfusion documents carry no persistent node IDs. A public Position is a
 * `{ path, offset }` pair resolved to a target node, then translated to the
 * absolute PM integer position via a tree walk on `pmDoc`.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 */
import { PMNode, PMResolvedPos, Mapping, PMMapResult } from '../pm-guard';
import { Position } from '../../core/model/selection';
import { InternalPosition } from '../types/internal-position';

// ── Adapter ───────────────────────────────────────────────────────────────────

export class PositionAdapter {

    // ── Resolve position ──────────────────────────────────────────────────────

    /**
     * Converts a public Position to an InternalPosition carrying the resolved
     * absolute PM integer position.
     *
     * Walks the PM doc along `pos.path` to find the target node, then
     * advances `pos.offset` characters into its content.
     *
     * @param {Position} pos - The public position to convert.
     * @param {PMNode} pmDoc - The PM document to resolve against.
     * @returns {InternalPosition} The internal position with the resolved PM offset.
     */
    public toPMPosition(pos: Position, pmDoc: PMNode): InternalPosition {
        const resolved: number = resolvePathToPMPos(pmDoc, pos.path, pos.offset);
        return { offset: pos.offset, pmPos: resolved };
    }

    /**
     * Converts an absolute PM integer position back to a public Position.
     *
     * @param {number} pmPos - The absolute PM integer position to convert.
     * @param {PMNode} pmDoc - The current PM document used to derive the path.
     * @returns {Position} The corresponding public Position.
     */
    public fromPMPosition(pmPos: number, pmDoc: PMNode): Position {
        return { ...derivePathFromPMPos(pmDoc, pmPos), offset: pmPos };
    }

    /**
     * Remaps a public Position through a PM Mapping (produced by a transaction)
     * so callers can track positions as the document mutates.
     *
     * Returns null when the position was deleted by the mapping.
     *
     * @param {Position} pos - The public position to remap.
     * @param {Mapping} mapping - The PM mapping produced by the transaction.
     * @param {PMNode} pmDoc - The PM document after the transaction (used to
     *                          rebuild the path from the remapped integer).
     * @returns {Position} The remapped public position, or null if it was deleted.
     */
    public mapAfterTransaction(
        pos: Position,
        mapping: Mapping,
        pmDoc: PMNode
    ): Position | null {
        const mapped: PMMapResult = mapping.mapResult(pos.offset);
        if (mapped.deleted) { return null; }
        return { ...derivePathFromPMPos(pmDoc, mapped.pos), offset: mapped.pos };
    }
}

// ── Local helpers ─────────────────────────────────────────────────────────────

/**
 * Resolve a path+offset to an absolute PM integer position by walking the
 * PM doc. Returns 0 when the path is empty.
 *
 * @param {PMNode} pmDoc The PM document to descend into.
 * @param {number[]} path Path from document root to the target node.
 * @param {number} offset Character offset within the resolved node.
 * @returns {number} The absolute PM integer position.
 */
function resolvePathToPMPos(pmDoc: PMNode, path: number[], offset: number): number {
    let node: PMNode = pmDoc;
    let absPos: number = 0;
    for (let depth: number = 0; depth < path.length; depth++) {
        const idx: number = path[depth as number];
        if (!node.content || idx < 0 || idx >= node.childCount) {
            return absPos;
        }
        let childPos: number = -1;
        let target: PMNode | null = null;
        node.content.forEach((child: PMNode, cp: number) => {
            if (target) { return false; }
            if (cp === idx) {
                target = child;
                childPos = cp;
                return false;
            }
            return undefined as never;
        });
        if (!target) { return absPos; }
        absPos = absPos + childPos + 1;
        node = target;
    }
    // `offset` is interpreted as character offset from start of resolved node's content.
    return absPos + offset;
}

/**
 * Derive a path from an absolute PM integer position by walking the resolved
 * position back up to the root and recording the child index at each depth.
 *
 * @param {PMNode} pmDoc The PM document to read from.
 * @param {number} pmPos Absolute PM integer position.
 * @returns {{ path: number[] }} The derived path from document root.
 */
function derivePathFromPMPos(pmDoc: PMNode, pmPos: number): { path: number[] } {
    const $pos: PMResolvedPos = pmDoc.resolve(pmPos);
    const path: number[] = [];
    for (let depth: number = $pos.depth; depth >= 0; depth--) {
        const idx: number = $pos.index(depth);
        if (idx >= 0) { path.unshift(idx); }
    }
    return { path };
}
