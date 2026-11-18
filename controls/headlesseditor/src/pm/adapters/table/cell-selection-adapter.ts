/**
 * cell-selection-adapter.ts — Converts between Syncfusion CellSelection and PM CellSelection.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 *
 * Conversion strategy:
 *   - Syncfusion CellSelection stores paths (anchorCellPath, headCellPath).
 *     Each path is `[..tablePath, rowIdx, colIdx]`.
 *   - PM CellSelection stores resolved document positions ($anchorCell, $headCell).
 *   - This adapter converts paths ↔ PM positions by descending through the
 *     PM tree one child-at-a-time using the integer path indices.
 */
import { PMNode, PMResolvedPos, PMCellSelection, PMFragment } from '../../pm-guard';
import { CellSelection, SelectionType } from '../../../core/model/selection';

// ── Path → PM position ────────────────────────────────────────────────────────

/**
 * Resolve a Syncfusion cell path to an absolute PM position.
 *
 * Walks the document by descending through the path indices; returns -1 when
 * the path does not resolve.
 *
 * @param {PMNode} pmDoc The PM document to descend into.
 * @param {number[]} cellPath Path from document root to a tableCell.
 * @returns {number} The absolute PM integer position, or -1 if not resolved.
 */
function resolveCellPath(pmDoc: PMNode, cellPath: number[]): number {
    if (cellPath.length < 3) { return -1; }
    let node: PMNode = pmDoc;
    let absPos: number = 0;

    for (let depth: number = 0; depth < cellPath.length; depth++) {
        const idx: number = cellPath[depth as number];
        const isLast: boolean = depth === cellPath.length - 1;

        if (!node.content || idx < 0 || idx >= node.childCount) {
            return -1;
        }

        // Advance absPos past each prior sibling at this level
        const siblings: PMFragment = node.content;
        let advanced: number = 0;
        let target: PMNode | null = null;
        let childPos: number = -1;
        siblings.forEach((child: PMNode, cp: number) => {
            if (target) { return false; }
            if (advanced === idx) {
                target = child;
                childPos = cp;
                return false;
            }
            advanced += child.nodeSize;
            return undefined as never;
        });

        if (!target) { return -1; }

        if (isLast) {
            // Position is the cell's open token: current absPos + 1
            return absPos + childPos + 1;
        }

        // For nested containers, move into the child and keep walking.
        absPos = absPos + childPos + target.nodeSize - /*descending into a container - don't double count*/ 0;

        // Recompute: descend step. After moving past (childIdx) preceding siblings
        // we land at the open token of `target`; we then need `+1` to enter the
        // container's content. Update absPos accordingly.
        const before: number = absPos + childPos;
        // Replace previous line — recompute properly:
        absPos = childPos + 1; // open token, on the inside
        node = target;
        void before;
    }

    return absPos;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Convert a Syncfusion {@link CellSelection} to a PM {@link PMCellSelection}.
 *
 * @param {CellSelection} sel - The Syncfusion cell selection to convert.
 * @param {PMNode} pmDoc - The current PM document.
 * @returns {PMCellSelection | null} The PM cell selection, or null if cells not found.
 */
export function toPMCellSelection(
    sel: CellSelection,
    pmDoc: PMNode
): PMCellSelection | null {
    const anchorPos: number = resolveCellPath(pmDoc, sel.anchorCellPath);
    if (anchorPos < 0) { return null; }

    const headPos: number = resolveCellPath(pmDoc, sel.headCellPath);
    if (headPos < 0) { return null; }

    try {
        return PMCellSelection.create(pmDoc, anchorPos, headPos);
    } catch {
        return null;
    }
}

/**
 * Convert a PM {@link PMCellSelection} to a Syncfusion {@link CellSelection}.
 *
 * @param {PMCellSelection} pmSel - The PM cell selection to convert.
 * @returns {CellSelection | null} The Syncfusion cell selection, or null on failure.
 */
export function fromPMCellSelection(pmSel: PMCellSelection): CellSelection | null {
    const anchorPath: number[] | null = extractCellPathFromPos(pmSel.$anchorCell);
    if (!anchorPath) { return null; }
    const headPath: number[] | null = extractCellPathFromPos(pmSel.$headCell);
    if (!headPath) { return null; }

    return {
        type: SelectionType.Cell,
        anchorCellPath: anchorPath,
        headCellPath: headPath
    };
}

/**
 * Walk from a PM resolved position up to the root, returning the child-index
 * path that ends at the first tableCell ancestor.
 *
 * @param {PMResolvedPos} $pos The resolved PM position to read from.
 * @returns {number[] | null} The cell path, or null when no tableCell ancestor exists.
 */
function extractCellPathFromPos($pos: PMResolvedPos): number[] | null {
    const path: number[] = [];
    let found: boolean = false;
    for (let depth: number = $pos.depth; depth >= 0; depth--) {
        const node: PMNode = $pos.node(depth);
        if (depth > 0) {
            const parent: PMNode = $pos.node(depth - 1);
            let idx: number = 0;
            let matched: boolean = false;
            parent.content.forEach((sibling: PMNode) => {
                if (matched) { return false; }
                if (sibling === node) { matched = true; return false; }
                idx += 1;
                return undefined as never;
            });
            path.unshift(idx);
        }
        if (node.type.name === 'tableCell') {
            found = true;
            break;
        }
    }
    return found ? path : null;
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
    const anchorPos: number = resolveCellPath(newPMDoc, sel.anchorCellPath);
    if (anchorPos < 0) { return null; }

    const headPos: number = resolveCellPath(newPMDoc, sel.headCellPath);
    const resolvedHeadPath: number[] = headPos >= 0 ? sel.headCellPath : sel.anchorCellPath;

    return {
        type: SelectionType.Cell,
        anchorCellPath: sel.anchorCellPath,
        headCellPath: resolvedHeadPath
    };
}
