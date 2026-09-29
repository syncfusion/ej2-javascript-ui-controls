/**
 * table-service.ts — PM-free table context resolution service.
 *
 * All public methods perform pure tree walks on the Syncfusion document model.
 * No PM imports. No PM types on any public API.
 */
import { DocumentRoot, EditorNode } from '../../../model/editor-node';
import { Selection, SelectionType } from '../../../model/selection';
import { isCellSelection, CellSelection } from '../../../model/selection';

// ── Context types ─────────────────────────────────────────────────────────────

/**
 * Resolved context for a table node in the document.
 */
export interface TableContext {
    /** The table EditorNode. */
    readonly node: EditorNode;
    /** Stable UUID of the table node. */
    readonly nodeId: string;
}

/**
 * Resolved context for a single table cell.
 */
export interface CellContext {
    /** The tableCell EditorNode. */
    readonly cellNode: EditorNode;
    /** Stable UUID of the tableCell node. */
    readonly cellNodeId: string;
    /** Zero-based row index within the table. */
    readonly row: number;
    /** Zero-based column index within the row. */
    readonly col: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Walk the document tree depth-first and find the first node whose `id`
 * matches the given nodeId.
 *
 * @param {EditorNode} root - The root node to search from.
 * @param {string} nodeId - The target node UUID.
 * @returns {EditorNode | null} The found node, or null if not present.
 */
export function findNodeById(root: EditorNode, nodeId: string): EditorNode | null {
    if (root.id === nodeId) { return root; }
    for (const child of root.children) {
        const found: EditorNode | null = findNodeById(child, nodeId);
        if (found) { return found; }
    }
    return null;
}

/**
 * Find the nearest ancestor of `nodeId` that has a given type,
 * walking the document from the root.
 *
 * @param {EditorNode} root - Document root to search from.
 * @param {string} nodeId - UUID of the node whose ancestor we are seeking.
 * @param {string} ancestorType - The `type` name of the sought ancestor.
 * @returns {EditorNode | null} The ancestor node or null if not found.
 */
export function findAncestorByType(
    root: EditorNode,
    nodeId: string,
    ancestorType: string
): EditorNode | null {
    const walk: (node: EditorNode, closestAncestor: EditorNode | null) => { found: boolean; ancestor: EditorNode | null } = (
        node: EditorNode,
        closestAncestor: EditorNode | null
    ): { found: boolean; ancestor: EditorNode | null } => {
        const updatedAncestor: EditorNode | null =
            node.type === ancestorType ? node : closestAncestor;

        if (node.id === nodeId) {
            return { found: true, ancestor: updatedAncestor };
        }

        for (const child of node.children) {
            const result: { found: boolean; ancestor: EditorNode | null } =
                walk(child, updatedAncestor);
            if (result.found) { return result; }
        }

        return { found: false, ancestor: null };
    };

    const result: { found: boolean; ancestor: EditorNode | null } = walk(root, null);
    return result.found ? result.ancestor : null;
}

/**
 * Resolve the cursor node ID from a selection.
 * Uses anchor position's nodeId if available.
 *
 * @param {Selection} sel - The current selection.
 * @returns {string | null} The nodeId at the cursor, or null if unavailable.
 */
export function getCursorNodeId(sel: Selection): string | null {
    if (isCellSelection(sel)) {
        return sel.anchorCellId;
    }
    return sel.anchor?.nodeId ?? null;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a {@link CellSelection} value object from two cell node IDs.
 *
 * @param {string} anchorCellId - UUID of the anchor (first) cell.
 * @param {string} headCellId - UUID of the head (last) cell.
 * @returns {CellSelection} A new CellSelection value.
 */
export function createCellSelection(
    anchorCellId: string,
    headCellId: string
): CellSelection {
    return {
        type: SelectionType.Cell,
        anchorCellId,
        headCellId
    };
}

// ── Ancestor lookup ───────────────────────────────────────────────────────────

/**
 * Finds the nearest table ancestor of a cell node by ID.
 *
 * Performs a depth-first tree walk on the document to locate the cell, then
 * walks up the ancestor chain to find the enclosing table node.
 *
 * Returns `null` if the cell is not found or has no table ancestor.
 *
 * @param {string} cellNodeId - The UUID of the cell whose table ancestor is sought.
 * @param {DocumentRoot} doc - The Syncfusion document root to search.
 * @returns {EditorNode | null} The table EditorNode, or null if not found.
 */
export function findTableAncestor(
    cellNodeId: string,
    doc: DocumentRoot
): EditorNode | null {
    const cell: EditorNode | null = findNodeById(doc, cellNodeId);
    if (!cell) { return null; }
    return findAncestorByType(doc, cellNodeId, 'table');
}

// ── Selection narrowing ───────────────────────────────────────────────────────

/**
 * Narrows a generic {@link Selection} to {@link CellSelection} or returns null.
 *
 * Convenience wrapper around the `isCellSelection` type guard for use in
 * contexts that need an explicit null check rather than a type predicate.
 *
 * @param {Selection} sel - The selection to narrow.
 * @returns {CellSelection | null} The cell selection, or null if not applicable.
 */
export function asCellSelection(sel: Selection): CellSelection | null {
    return isCellSelection(sel) ? sel : null;
}

// ── TableService ──────────────────────────────────────────────────────────────

/**
 * TableService — resolves table, row, and cell context from the headless document.
 *
 * All methods perform pure tree walks (no PM imports). Complex structural
 * operations (e.g. TableMap, colspan-aware coordinates) are delegated to PM
 * adapters inside src/pm/ by commands at the PM boundary.
 */
export class TableService {

    /**
     * Find the table containing the cursor / anchor of the current selection.
     * Performs a tree walk from the document root.
     *
     * @param {DocumentRoot} doc - The current Syncfusion document.
     * @param {Selection} selection - The current selection.
     * @returns {TableContext | null} Table context, or null if cursor is not inside a table.
     */
    public getCurrentTable(
        doc: DocumentRoot,
        selection: Selection
    ): TableContext | null {
        const nodeId: string | null = getCursorNodeId(selection);
        if (!nodeId) { return null; }

        const table: EditorNode | null = findAncestorByType(doc, nodeId, 'table');
        if (!table) { return null; }

        return { node: table, nodeId: table.id };
    }

    /**
     * Find the tableCell containing the cursor / anchor of the current selection.
     * Performs a tree walk from the document root.
     *
     * @param {DocumentRoot} doc - The current Syncfusion document.
     * @param {Selection} selection - The current selection.
     * @returns {CellContext | null} Cell context, or null if cursor is not inside a cell.
     */
    public getCurrentCell(
        doc: DocumentRoot,
        selection: Selection
    ): CellContext | null {
        const nodeId: string | null = getCursorNodeId(selection);
        if (!nodeId) { return null; }

        const cell: EditorNode | null = findAncestorByType(doc, nodeId, 'tableCell');
        if (!cell) { return null; }

        const coords: { row: number; col: number } | null =
            this._resolveCellCoordinatesById(doc, cell.id);

        if (!coords) { return null; }

        return {
            cellNode: cell,
            cellNodeId: cell.id,
            row: coords.row,
            col: coords.col
        };
    }

    /**
     * Get all cells included in a CellSelection range.
     * Returns an empty array when the selection is not a CellSelection.
     *
     * @param {DocumentRoot} doc - The current Syncfusion document.
     * @param {Selection} selection - The current selection.
     * @returns {CellContext[]} Array of cell contexts in the selection.
     */
    public getSelectedCells(
        doc: DocumentRoot,
        selection: Selection
    ): CellContext[] {
        if (!isCellSelection(selection)) { return []; }

        const cellSel: CellSelection = selection;
        const anchorCell: EditorNode | null = findNodeById(doc, cellSel.anchorCellId);
        const headCell: EditorNode | null = findNodeById(doc, cellSel.headCellId);

        if (!anchorCell || !headCell) { return []; }

        // Find the containing table
        const table: EditorNode | null = findAncestorByType(doc, cellSel.anchorCellId, 'table');
        if (!table) { return []; }

        const anchorCoords: { row: number; col: number } | null =
            this.resolveCellCoordinates(anchorCell, table);
        const headCoords: { row: number; col: number } | null =
            this.resolveCellCoordinates(headCell, table);

        if (!anchorCoords || !headCoords) { return []; }

        // Determine the rectangular selection bounds
        const minRow: number = Math.min(anchorCoords.row, headCoords.row);
        const maxRow: number = Math.max(anchorCoords.row, headCoords.row);
        const minCol: number = Math.min(anchorCoords.col, headCoords.col);
        const maxCol: number = Math.max(anchorCoords.col, headCoords.col);

        const result: CellContext[] = [];

        table.children.forEach((row: EditorNode, rowIdx: number) => {
            if (rowIdx < minRow || rowIdx > maxRow) { return; }
            row.children.forEach((cell: EditorNode, colIdx: number) => {
                if (colIdx < minCol || colIdx > maxCol) { return; }
                result.push({
                    cellNode: cell,
                    cellNodeId: cell.id,
                    row: rowIdx,
                    col: colIdx
                });
            });
        });

        return result;
    }

    /**
     * Resolve the (row, col) coordinates of a cell within its parent table.
     *
     * This is a basic structural walk that does not account for rowspan/colspan
     * overlaps — those are handled by PM adapters (TableMap) at the command boundary.
     *
     * @param {EditorNode} cellNode - The tableCell node to locate.
     * @param {EditorNode} tableNode - The parent table node.
     * @returns {object} Zero-based coordinates, or null if not found.
     */
    public resolveCellCoordinates(
        cellNode: EditorNode,
        tableNode: EditorNode
    ): { row: number; col: number } | null {
        for (let rowIdx: number = 0; rowIdx < tableNode.children.length; rowIdx++) {
            const row: EditorNode = tableNode.children[rowIdx as number];
            for (let colIdx: number = 0; colIdx < row.children.length; colIdx++) {
                if (row.children[colIdx as number].id === cellNode.id) {
                    return { row: rowIdx, col: colIdx };
                }
            }
        }
        return null;
    }

    /**
     * Find the table ancestor of a cell by its nodeId, then resolve coordinates.
     *
     * @param {DocumentRoot} doc - The document root to search.
     * @param {string} cellId - UUID of the cell to locate.
     * @returns {object} Coordinates or null.
     * @hidden
     */
    private _resolveCellCoordinatesById(
        doc: DocumentRoot,
        cellId: string
    ): { row: number; col: number } | null {
        const table: EditorNode | null = findAncestorByType(doc, cellId, 'table');
        if (!table) { return null; }

        const cell: EditorNode | null = findNodeById(table, cellId);
        if (!cell) { return null; }

        return this.resolveCellCoordinates(cell, table);
    }
}
