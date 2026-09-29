/**
 * cell-selection-adapter.ts — Converts between Syncfusion CellSelection and PM CellSelection.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 *
 * Conversion strategy:
 *   - Syncfusion CellSelection stores stable cell node UUIDs (anchorCellId, headCellId).
 *   - PM CellSelection stores resolved document positions ($anchorCell, $headCell).
 *   - This adapter walks the PM document to find cells by their `id` attr, converting
 *     nodeId → pmPos and pmPos → nodeId.
 */
import { PMNode, PMCellSelection } from '../../pm-guard';
import { CellSelection, SelectionType } from '../../../model/selection';

// ── Conversion helpers ────────────────────────────────────────────────────────

/**
 * Find the absolute PM position of a cell node by its `id` attribute.
 * Walks the entire document tree; returns -1 if not found.
 *
 * @param {PMNode} pmDoc - The PM document to search.
 * @param {string} cellId - The cell node UUID to locate.
 * @returns {number} Absolute PM position of the cell node, or -1 if not found.
 */
function findCellPosByNodeId(pmDoc: PMNode, cellId: string): number {
    let found: number = -1;

    pmDoc.descendants((node: PMNode, pos: number): boolean => {
        if (found !== -1) { return false; }
        const nodeId: unknown = node.attrs ? node.attrs['id'] : null;
        if (nodeId !== null && nodeId !== undefined && String(nodeId) === cellId) {
            found = pos;
            return false;
        }
        return true;
    });

    return found;
}

function extractCellIdFromPos($pos: ReturnType<PMNode['resolve']>): string | null {
    for (let depth: number = $pos.depth; depth >= 0; depth--) {
        const node: PMNode = $pos.node(depth);
        if (node.type.name === 'tableCell') {
            const id: unknown = node.attrs ? node.attrs['id'] : null;
            return id !== null && id !== undefined ? String(id) : null;
        }
    }
    return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Convert a Syncfusion {@link CellSelection} to a PM {@link PMCellSelection}.
 *
 * Walks the PM document to resolve cell nodeIds to absolute PM positions,
 * then creates a `PMCellSelection` from those positions.
 *
 * Returns `null` if either cell cannot be found in the current document.
 *
 * @param {CellSelection} sel - The Syncfusion cell selection to convert.
 * @param {PMNode} pmDoc - The current PM document.
 * @returns {PMCellSelection | null} The PM cell selection, or null if cells not found.
 */
export function toPMCellSelection(
    sel: CellSelection,
    pmDoc: PMNode
): PMCellSelection | null {
    const anchorPos: number = findCellPosByNodeId(pmDoc, sel.anchorCellId);
    if (anchorPos === -1) { return null; }

    const headPos: number = findCellPosByNodeId(pmDoc, sel.headCellId);
    if (headPos === -1) { return null; }

    try {
        return PMCellSelection.create(pmDoc, anchorPos, headPos);
    } catch {
        return null;
    }
}

/**
 * Convert a PM {@link PMCellSelection} to a Syncfusion {@link CellSelection}.
 *
 * Extracts cell nodeIds from the resolved positions stored in the PM selection.
 *
 * Returns `null` if either cell nodeId cannot be extracted.
 *
 * @param {PMCellSelection} pmSel - The PM cell selection to convert.
 * @returns {CellSelection | null} The Syncfusion cell selection, or null on failure.
 */
export function fromPMCellSelection(pmSel: PMCellSelection): CellSelection | null {
    const anchorCellId: string | null = extractCellIdFromPos(pmSel.$anchorCell);
    if (!anchorCellId) { return null; }

    const headCellId: string | null = extractCellIdFromPos(pmSel.$headCell);
    if (!headCellId) { return null; }

    return {
        type: SelectionType.Cell,
        anchorCellId,
        headCellId
    };
}

/**
 * Remap a Syncfusion {@link CellSelection} through a PM mapping.
 *
 * Attempts to locate both cells in the new document. If either cell was
 * deleted by the mapping, returns `null` to indicate the selection is invalid.
 *
 * @param {CellSelection} sel - The cell selection to remap.
 * @param {PMNode} newPMDoc - The PM document after the transaction.
 * @returns {CellSelection | null} The remapped cell selection, or null if cells deleted.
 */
export function remapCellSelection(
    sel: CellSelection,
    newPMDoc: PMNode
): CellSelection | null {
    const anchorPos: number = findCellPosByNodeId(newPMDoc, sel.anchorCellId);
    const headPos: number = findCellPosByNodeId(newPMDoc, sel.headCellId);

    // If the anchor was deleted, the selection is invalid
    if (anchorPos === -1) { return null; }

    // If only the head was deleted, collapse selection to anchor
    const resolvedHeadId: string = headPos !== -1 ? sel.headCellId : sel.anchorCellId;

    return {
        type: SelectionType.Cell,
        anchorCellId: sel.anchorCellId,
        headCellId: resolvedHeadId
    };
}
