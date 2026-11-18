/**
 * table-service.ts — PM-free table context resolution service.
 *
 * All public methods perform pure tree walks on the Syncfusion document model.
 * No PM imports. No PM types on any public API. Syncfusion nodes carry no
 * persistent IDs; cell and ancestor references are expressed as paths and
 * (row, col) coordinates.
 */
import { DocumentRoot, EditorNode } from '../../../core/model/editor-node';
import { Selection, SelectionType, CellSelection, isCellSelection } from '../../../core/model/selection';

// ── Context types ─────────────────────────────────────────────────────────────

/**
 * Resolved context for a table node in the document.
 */
export interface TableContext {
    /** The table EditorNode. */
    readonly node: EditorNode;
}

/**
 * Resolved context for a single table cell.
 */
export interface CellContext {
    /** The tableCell EditorNode. */
    readonly cellNode: EditorNode;
    /** Zero-based row index within the table. */
    readonly row: number;
    /** Zero-based column index within the row. */
    readonly col: number;
    /** Path from the document root to the cell. */
    readonly cellPath: number[];
}

// ── Cell path helpers ─────────────────────────────────────────────────────────

/**
 * Parse a cell path into (row, col) coordinates and the original path.
 * Cell paths have the form `[..tablePath, rowIdx, colIdx]`.
 *
 * @param {number[]} cellPath Path from document root to a tableCell.
 * @returns {CoordsObject | null} Coordinates and the path, or null when malformed.
 *
 */
function parseCellPath(
    cellPath: number[]
): CoordsObject | null {
    if (cellPath.length < 3) { return null; }
    const col: number = cellPath[cellPath.length - 1];
    const row: number = cellPath[cellPath.length - 2];
    if (col < 0 || row < 0) { return null; }
    return { row, col, path: cellPath };
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a {@link CellSelection} value object from two cell paths.
 *
 * @param {number[]} anchorCellPath Path to the anchor (first) cell.
 * @param {number[]} headCellPath Path to the head (last) cell.
 * @returns {CellSelection} A new CellSelection value object.
 *
 * @hidden
 */
export function createCellSelection(
    anchorCellPath: number[],
    headCellPath: number[]
): CellSelection {
    return {
        type: SelectionType.Cell,
        anchorCellPath,
        headCellPath
    };
}

/**
 * Narrows a generic {@link Selection} to {@link CellSelection} or returns null.
 *
 * @param {Selection} sel The selection to narrow.
 * @returns {CellSelection | null} The cell selection, or null when `sel` is not a CellSelection.
 *
 * @hidden
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
     * @param {DocumentRoot} doc The document root to search.
     * @param {Selection} selection The current selection.
     * @returns {TableContext | null} The resolved table context, or null when no table contains the anchor.
     */
    public getCurrentTable(
        doc: DocumentRoot,
        selection: Selection
    ): TableContext | null {
        const anchorPath: number[] | null = getAnchorPath(selection);
        if (!anchorPath) { return null; }

        const table: EditorNode | null = findAncestorByType(doc, anchorPath, 'table');
        if (!table) { return null; }
        return { node: table };
    }

    /**
     * Find the tableCell containing the cursor / anchor of the current selection.
     * Performs a tree walk from the document root.
     *
     * @param {DocumentRoot} doc The document root to search.
     * @param {Selection} selection The current selection.
     * @returns {CellContext | null} The resolved cell context, or null when no tableCell contains the anchor.
     */
    public getCurrentCell(
        doc: DocumentRoot,
        selection: Selection
    ): CellContext | null {
        const anchorPath: number[] | null = getAnchorPath(selection);
        if (!anchorPath) { return null; }

        const coords: CoordsObject | null =
            findCellCoordsAtPath(doc, anchorPath);
        if (!coords) { return null; }

        const cell: EditorNode | null = getNodeAtPath(doc, coords.path);
        if (!cell) { return null; }

        return {
            cellNode: cell,
            cellPath: coords.path,
            row: coords.row,
            col: coords.col
        };
    }

    /**
     * Get all cells included in a CellSelection range.
     * Returns an empty array when the selection is not a CellSelection.
     *
     * @param {DocumentRoot} doc The document root to search.
     * @param {Selection} selection The current selection.
     * @returns {CellContext[]} All cells included in the rectangular range, row-major.
     */
    public getSelectedCells(
        doc: DocumentRoot,
        selection: Selection
    ): CellContext[] {
        if (!isCellSelection(selection)) { return []; }

        const cellSel: CellSelection = selection;
        const anchorCoords: CoordsObject | null =
            findTableCoordsForCell(doc, cellSel.anchorCellPath);
        const headCoords: CoordsObject | null =
            findTableCoordsForCell(doc, cellSel.headCellPath);

        if (!anchorCoords || !headCoords) { return []; }

        const tablePath: number[] = anchorCoords.path.slice(0, -2);
        const table: EditorNode | null = getNodeAtPath(doc, tablePath);
        if (!table) { return []; }

        const minRow: number = Math.min(anchorCoords.row, headCoords.row);
        const maxRow: number = Math.max(anchorCoords.row, headCoords.row);
        const minCol: number = Math.min(anchorCoords.col, headCoords.col);
        const maxCol: number = Math.max(anchorCoords.col, headCoords.col);

        const result: CellContext[] = [];
        table.children.forEach((row: EditorNode, rowIdx: number) => {
            if (rowIdx < minRow || rowIdx > maxRow) { return; }
            row.children.forEach((cell: EditorNode, colIdx: number) => {
                if (colIdx < minCol || colIdx > maxCol) { return; }
                const cellPath: number[] = [...tablePath, rowIdx, colIdx];
                result.push({
                    cellNode: cell,
                    cellPath,
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
     * @param {EditorNode} cellNode The cell EditorNode to locate.
     * @param {EditorNode} tableNode The table EditorNode that owns the row.
     * @returns {object} Coordinates, or null when the cell is not inside the table.
     */
    public resolveCellCoordinates(
        cellNode: EditorNode,
        tableNode: EditorNode
    ): { row: number; col: number } | null {
        for (let rowIdx: number = 0; rowIdx < tableNode.children.length; rowIdx++) {
            const row: EditorNode = tableNode.children[rowIdx as number];
            const colIdx: number = row.children.indexOf(cellNode);
            if (colIdx !== -1) {
                return { row: rowIdx, col: colIdx };
            }
        }
        return null;
    }
}

type CoordsObject = { row: number; col: number; path: number[] }

// ── Local pure-tree helpers ───────────────────────────────────────────────────

/**
 * Extract the anchor path from a generic Selection.
 *
 * @param {Selection} selection The selection to read.
 * @returns {number[] | null} The anchor path, or null when none is available.
 */
function getAnchorPath(selection: Selection): number[] | null {
    if (isCellSelection(selection)) {
        return selection.anchorCellPath;
    }
    return selection.anchor ? selection.anchor.path : null;
}

/**
 * Descend into the tree along `path` and return the node at that location.
 *
 * @param {DocumentRoot} root The document root.
 * @param {number[]} path Path from document root to the target node.
 * @returns {EditorNode | null} The node at the path, or null when the path is invalid.
 */
function getNodeAtPath(root: DocumentRoot, path: number[]): EditorNode | null {
    let node: EditorNode = root;
    for (const idx of path) {
        if (!node.children || idx < 0 || idx >= node.children.length) {
            return null;
        }
        node = node.children[idx as number];
    }
    return node;
}

/**
 * Walk the document tree to find the cell-path equivalent of a given anchor path.
 * For selections inside cells, the anchor path itself is the cell path.
 *
 * @param {DocumentRoot} doc The document root.
 * @param {number[]} anchorPath Path from document root to the selection anchor.
 * @returns {CoordsObject | null} Cell coords, or null when not inside a cell.
 */
function findCellCoordsAtPath(
    doc: DocumentRoot,
    anchorPath: number[]
): CoordsObject | null {
    return findTableCoordsForCell(doc, anchorPath);
}

/**
 * Validate that a path leads to a tableCell and return its (row, col).
 *
 * @param {DocumentRoot} doc The document root.
 * @param {number[]} cellPath Path from document root to a candidate tableCell.
 * @returns {CoordsObject | null} Coords, or null when the path is invalid.
 */
function findTableCoordsForCell(
    doc: DocumentRoot,
    cellPath: number[]
): CoordsObject | null {
    const coords: CoordsObject | null = parseCellPath(cellPath);
    if (!coords) { return null; }
    const cell: EditorNode | null = getNodeAtPath(doc, cellPath);
    // Both `tableCell` and `tableHeader` are valid cell nodes; the public
    // getSelectedCells contract covers both.
    if (!cell || (cell.type !== 'tableCell' && cell.type !== 'tableHeader')) { return null; }
    return coords;
}

/**
 * Walk the document tree to find the ancestor of `descendantPath` whose
 * node type matches `ancestorType`. Returns that ancestor EditorNode.
 *
 * @param {EditorNode} root The tree root to search from.
 * @param {number[]} descendantPath Path from `root` to a descendant node.
 * @param {string} ancestorType The node type name to match.
 * @returns {EditorNode | null} The matching ancestor EditorNode, or null.
 */
function findAncestorByType(
    root: EditorNode,
    descendantPath: number[],
    ancestorType: string
): EditorNode | null {
    for (let depth: number = descendantPath.length - 1; depth > 0; depth--) {
        const candidatePath: number[] = descendantPath.slice(0, depth);
        const candidate: EditorNode | null = getNodeAtPath(root as DocumentRoot, candidatePath);
        if (candidate && candidate.type === ancestorType) {
            return candidate;
        }
    }
    if (root.type === ancestorType) {
        return root;
    }
    return null;
}
