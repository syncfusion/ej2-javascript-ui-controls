/**
 * selection.ts — Syncfusion-owned, zero-PM selection types.
 */
import { EditorNode, TextNode } from './editor-node';
import { Position } from './position';

/** Discriminant for the kind of selection. */
export enum SelectionType {
    Text  = 'text',
    Node  = 'node',
    Cell  = 'cell',
    Block = 'block',
    All   = 'all'
}

/**
 * Selection — the cursor / highlighted range in the Syncfusion model.
 *
 * `anchor` is the fixed end of a range; `head` is the moving end.
 * For a collapsed cursor anchor === head (or head is omitted).
 * For `SelectionType.All` both anchor and head are undefined.
 */
export interface Selection {
    type: SelectionType;
    anchor?: Position;
    head?: Position;
}

/**
 * CellSelection — a selection spanning one or more table cells.
 *
 * `anchorCellId` is the stable UUID of the first selected cell (where the
 * selection started). `headCellId` is the UUID of the last selected cell
 * (where the selection currently ends). When a single cell is selected,
 * both fields refer to the same cell.
 *
 * The containing table is resolved via ancestor lookup when required —
 * no `tableId` is stored here to avoid duplication.
 */
export interface CellSelection extends Selection {
    /** Always `SelectionType.Cell`. */
    readonly type: SelectionType.Cell;
    /** UUID of the anchor (first) cell in the selection. */
    readonly anchorCellId: string;
    /** UUID of the head (last) cell in the selection. */
    readonly headCellId: string;
}

/**
 * SelectedNode — A selected node with its corresponding DOM element.
 *
 * Use the DOM element for positioning toolbars and contextual menus.
 * Use the model node for structural inspection, serialization, or commands.
 */
export interface SelectedNode {
    /**
     * The selected EditorNode or TextNode. PM-free, suitable for any
     * model-layer operation (inspection, attribute reads, serialization).
     */
    node: EditorNode | TextNode;

    /**
     * Live DOM element that renders this node in the editor.
     * Null when the editor is not mounted or when the node is not currently
     * rendered (e.g., inside a collapsed view).
     *
     * Products use this to position quick toolbars or contextual menus.
     */
    dom: HTMLElement | null;

    /**
     * The ProseMirror position of this node's start (0-based offset in the
     * flattened document). Stable for this node as long as no mutations remove
     * the node itself.
     *
     * Useful for:
     *   - Positioning in-editor UI relative to the node
     *   - Computing a bounding rect via pmView.coordsAtPos(pos)
     *   - Building a range for a sibling insert
     *
     * Not exported; internal PM boundary use only.
     */
    readonly pmPos?: number;

    /**
     * Discriminant: which selection shape surfaced this node.
     *   - 'node'   → NodeSelection (image, hr, hardBreak selected as an atom)
     *   - 'block'  → TextSelection/BlockSelection, and we walked up to an enclosing block
     *   - 'cell'   → CellSelection; this is the anchor cell
     *   - 'text'   → TextSelection covering a range; first fully-contained block in the range
     */
    source: 'node' | 'block' | 'cell' | 'text';
}

/**
 * SelectedCell — Cell-specific info for table interactions.
 *
 * Extends SelectedNode with row/column coordinates and references to
 * the containing row and table. Allows products to build column-aware and
 * table-aware toolbar actions.
 */
export interface SelectedCell extends SelectedNode {
    /** Always 'cell' for SelectedCell. */
    source: 'cell';

    /** Zero-based column index of this cell within its row. */
    colIndex: number;

    /** Zero-based row index of this cell within its table. */
    rowIndex: number;

    /** The row (tableRow) EditorNode containing this cell. */
    row: EditorNode;

    /** The containing table EditorNode. */
    table: EditorNode;
}


/** Snapshot lifecycle marker. */
export type SelectionSnapshotStatus = 'pending' | 'restored' | 'consumed' | 'stale' | 'partial';

/**
 * PM-free selection snapshot.
 *
 * A `pending` snapshot will be auto-applied to the live PM state by the
 * framework immediately before the next command execution. After application
 * the status becomes `restored`, and after the surrounding command returns
 * it becomes `consumed`. The snapshot stays inspectable (via
 * `editor.savedSelection`) until a new `saveSelection()` replaces it or
 * `discardSavedSelection()` is called.
 */
export interface SelectionSnapshot {
    /** 'text' | 'node' | 'cell' | 'block' | 'all' */
    readonly type: SelectionType;
    /** Text / Block only: anchor position. Null for Node, Cell, and All. */
    readonly anchor: { nodeId: string; offset: number } | null;
    /** Text / Block only: head position. Null for Node, Cell, and All. */
    readonly head: { nodeId: string; offset: number } | null;
    /** Node only: target node UUID. Null otherwise. */
    readonly nodeId: string | null;
    /** Cell only: anchor + head cell UUIDs. Null otherwise. */
    readonly cellRange: { anchorCellId: string; headCellId: string } | null;
    /** Schema version of the document at capture time. */
    readonly schemaVersion: number;
    /** Epoch ms at capture. */
    readonly capturedAt: number;
    /** Lifecycle status. */
    readonly status: SelectionSnapshotStatus;

    /**
     * Returns the underlying Syncfusion Selection shape.
     * Used by SelectionAdapter.toPMSelection when restoring.
     */
    toSelection(): Selection;
}

/* Functions */

/**
 * Type guard: returns `true` when `sel` is a {@link CellSelection}.
 *
 * @param {Selection} sel - The selection to test.
 * @returns {boolean} `true` if sel is a CellSelection.
 */
export function isCellSelection(sel: Selection): sel is CellSelection {
    return sel.type === SelectionType.Cell;
}

export function createSnapshot(
    sel: Selection,
    schemaVersion: number,
    now: number = Date.now()
): SelectionSnapshot {
    if (sel.type === SelectionType.Cell) {
        const cellSel: CellSelection = sel as CellSelection;
        return {
            type: SelectionType.Cell,
            anchor: null,
            head: null,
            nodeId: null,
            cellRange: {
                anchorCellId: cellSel.anchorCellId,
                headCellId: cellSel.headCellId
            },
            schemaVersion,
            capturedAt: now,
            status: 'pending',
            toSelection(): Selection { return sel; }
        };
    }

    if (sel.type === SelectionType.Node) {
        const anchorNodeId: string | null = sel.anchor ? sel.anchor.nodeId : null;
        return {
            type: SelectionType.Node,
            anchor: null,
            head: null,
            nodeId: anchorNodeId,
            cellRange: null,
            schemaVersion,
            capturedAt: now,
            status: 'pending',
            toSelection(): Selection { return sel; }
        };
    }

    if (sel.type === SelectionType.All) {
        return {
            type: SelectionType.All,
            anchor: null,
            head: null,
            nodeId: null,
            cellRange: null,
            schemaVersion,
            capturedAt: now,
            status: 'pending',
            toSelection(): Selection { return { type: SelectionType.All }; }
        };
    }

    // Text / Block
    return {
        type: sel.type,
        anchor: sel.anchor ? { nodeId: sel.anchor.nodeId, offset: sel.anchor.offset } : null,
        head: sel.head ? { nodeId: sel.head.nodeId, offset: sel.head.offset } : null,
        nodeId: null,
        cellRange: null,
        schemaVersion,
        capturedAt: now,
        status: 'pending',
        toSelection(): Selection { return sel; }
    };
}

export function withStatus(snap: SelectionSnapshot, status: SelectionSnapshotStatus): SelectionSnapshot {
    if (snap.status === status) { return snap; }
    return { ...snap, status };
}
