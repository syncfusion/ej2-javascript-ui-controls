/**
 * selection.ts — Syncfusion-owned, zero-PM selection types.
 *
 * Syncfusion documents do not carry persistent node IDs; selection anchors
 * and cell references therefore use sibling/parent paths instead of UUIDs.
 */
import { EditorNode, TextNode } from './editor-node';

// ── Selection kinds ───────────────────────────────────────────────────────────

/**
 * SelectionType — Discriminant for the kind of selection in the editor.
 *
 * Distinguishes between different selection modes:
 * - **Text** — Cursor or highlighted text within a node
 * - **Node** — Single inline node selected (e.g., image, link)
 * - **Cell** — Table cell or cell range selected
 * - **Block** — Entire block-level node selected (e.g., paragraph, heading)
 * - **All** — Entire document selected
 *
 * @public
 */
export enum SelectionType {
    /**
     * Text selection — cursor or highlighted range within a node.
     * ```props
     * Text :- Cursor or text range selection within a paragraph or other text container
     * ```
     */
    Text  = 'text',

    /**
     * Node selection — single inline node selected as a whole.
     * ```props
     * Node :- Complete inline element (e.g., image, link) selected atomically
     * ```
     */
    Node  = 'node',

    /**
     * Cell selection — table cell or range of cells selected.
     * ```props
     * Cell :- Single or multiple table cells selected for copy/cut/formatting
     * ```
     */
    Cell  = 'cell',

    /**
     * Block selection — entire block-level node selected.
     * ```props
     * Block :- Complete block element (paragraph, heading, list item) selected
     * ```
     */
    Block = 'block',

    /**
     * All selection — entire document selected.
     * ```props
     * All :- Ctrl+A equivalent; all content in the document selected
     * ```
     */
    All   = 'all'
}

/**
 * Selection — the cursor / highlighted range in the Syncfusion model.
 */
export interface Selection {
    type: SelectionType;
    anchor?: Position;
    head?: Position;
}

/**
 * Position relative to the document tree.
 *
 * A path is the sequence of child indices from the root down to the target
 * node; an empty path points at the document root itself. `offset` carries
 * any character offset inside the resolved node. Together they uniquely
 * identify a cursor location without requiring persistent node IDs.
 */
export interface Position {
    /** Path from document root to target: each element is a child index. */
    path: number[];
    /** Zero-based character offset within the resolved node. */
    offset: number;
}

/**
 * CellSelection — a selection spanning one or more table cells.
 */
export interface CellSelection extends Selection {
    /** Always `SelectionType.Cell`. */
    readonly type: SelectionType.Cell;
    /** Path to the anchor (first) cell in the selection. */
    readonly anchorCellPath: number[];
    /** Path to the head (last) cell in the selection. */
    readonly headCellPath: number[];
}

// ── Selected node views ───────────────────────────────────────────────────────

/**
 * SelectedNode — A selected node with its corresponding DOM element.
 */
export interface SelectedNode {
    /** The selected EditorNode or TextNode. PM-free. */
    node: EditorNode | TextNode;

    /** Live DOM element that renders this node in the editor. */
    dom: HTMLElement | null;

    /** The ProseMirror position of this node's start (0-based offset). */
    readonly pmPos?: number;

    /** Discriminant: which selection shape surfaced this node. */
    source: 'node' | 'block' | 'cell' | 'text';
}

/**
 * SelectedCell — Cell-specific info for table interactions.
 */
export interface SelectedCell extends SelectedNode {

    /** Zero-based column index of this cell within its row. */
    colIndex: number;

    /** Zero-based row index of this cell within its table. */
    rowIndex: number;
}


/**
 * Lifecycle status of a selection snapshot.
 *
 * Describes the snapshot's position in the save-restore workflow:
 * - `'pending'`: Snapshot captured; waiting to be applied to live PM state before next command
 * - `'restored'`: Snapshot has been applied to the live PM state
 * - `'consumed'`: Command that used this snapshot has completed; snapshot is archived but inspectable
 * - `'stale'`: Document structure has changed since snapshot was captured; restore may fail
 * - `'partial'`: Snapshot partially restored (e.g., some nodes were deleted); restore succeeded partially
 *
 * @public
 */
export type SelectionSnapshotStatus = 'pending' | 'restored' | 'consumed' | 'stale' | 'partial';

/**
 * PM-free selection snapshot.
 */
export interface SelectionSnapshot {
    readonly type: SelectionType;
    readonly anchor: { path: number[]; offset: number } | null;
    readonly head: { path: number[]; offset: number } | null;
    readonly nodePath: number[] | null;
    readonly cellRange: { anchorCellPath: number[]; headCellPath: number[] } | null;
    readonly schemaVersion: number;
    readonly capturedAt: number;
    readonly status: SelectionSnapshotStatus;

    toSelection(): Selection;
}

/* Functions */

/**
 * Type guard: returns `true` when `sel` is a {@link CellSelection}.
 *
 * @param {Selection} sel - The selection to test.
 * @returns {boolean} `true` if sel is a CellSelection.
 *
 * @hidden
 */
export function isCellSelection(sel: Selection): sel is CellSelection {
    return sel.type === SelectionType.Cell;
}

/**
 * Captures a selection as a PM-free snapshot.
 *
 * Creates a {@link SelectionSnapshot} from a Syncfusion {@link Selection} object.
 * The snapshot is initialized in the `'pending'` state, indicating it will be auto-applied
 * to the live ProseMirror state before the next command execution.
 *
 * Use this to save the user's cursor position before an operation that would blur the editor
 * (e.g., toolbar interactions), then restore it afterward via {@link HeadlessEditor.restoreSelection}.
 *
 * @param {Selection} sel - The selection to capture.
 * @param {number} schemaVersion - The schema version at capture time (enables version compatibility checks).
 * @param {number} [now=Date.now()] - Epoch milliseconds at capture time; defaults to current time.
 *
 * @returns {SelectionSnapshot} A PM-free snapshot with `status: 'pending'`.
 *
 * @example
 * const snapshot = createSnapshot(editor.getSelection(), 1);
 * // ... do something that blurs the editor ...
 * editor.restoreSelection(snapshot);
 *
 * @public
 */
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
            nodePath: null,
            cellRange: {
                anchorCellPath: [...cellSel.anchorCellPath],
                headCellPath: [...cellSel.headCellPath]
            },
            schemaVersion,
            capturedAt: now,
            status: 'pending',
            toSelection(): Selection { return sel; }
        };
    }

    if (sel.type === SelectionType.Node) {
        const anchorPath: number[] | null = sel.anchor ? [...sel.anchor.path] : null;
        return {
            type: SelectionType.Node,
            anchor: null,
            head: null,
            nodePath: anchorPath,
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
            nodePath: null,
            cellRange: null,
            schemaVersion,
            capturedAt: now,
            status: 'pending',
            toSelection(): Selection { return { type: SelectionType.All }; }
        };
    }

    return {
        type: sel.type,
        anchor: sel.anchor ? { path: [...sel.anchor.path], offset: sel.anchor.offset } : null,
        head: sel.head ? { path: [...sel.head.path], offset: sel.head.offset } : null,
        nodePath: null,
        cellRange: null,
        schemaVersion,
        capturedAt: now,
        status: 'pending',
        toSelection(): Selection { return sel; }
    };
}

/**
 * Creates a new snapshot with an updated lifecycle status.
 *
 * Returns the input snapshot unchanged if its current status already matches the requested status.
 * Otherwise, creates a shallow copy with the new status. Used internally by the framework to advance
 * snapshot state through its lifecycle (pending → restored → consumed).
 *
 * @param {SelectionSnapshot} snap - The snapshot to update.
 * @param {SelectionSnapshotStatus} status - The new lifecycle status.
 *
 * @returns {SelectionSnapshot} A snapshot with the requested status. If already at that status, returns the input unchanged.
 *
 * @example
 * const pending = createSnapshot(sel, 1);
 * const restored = withStatus(pending, 'restored');
 * const consumed = withStatus(restored, 'consumed');
 *
 * @public
 */
export function withStatus(
    snap: SelectionSnapshot,
    status: SelectionSnapshotStatus
): SelectionSnapshot {
    return { ...snap, status };
}
