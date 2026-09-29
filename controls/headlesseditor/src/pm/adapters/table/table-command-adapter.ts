/**
 * table-command-adapter.ts — PM table command functions.
 *
 * Exports PM-command-style functions that follow the standard
 * `(state: PMEditorState, dispatch?: PMDispatch, ...args) => boolean` pattern.
 *
 * Uses prosemirror-tables utilities (TableMap, row/column ops) internally.
 * All PM imports come through pm-guard. No Syncfusion types are imported here.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 */
import {
    PMEditorState,
    PMTransaction,
    PMNode,
    PMNodeType,
    PMSchema,
    PMTableMap,
    pmAddColumnBefore,
    pmAddColumnAfter,
    pmDeleteColumn,
    pmAddRowBefore,
    pmAddRowAfter,
    pmDeleteRow,
    pmDeleteTable,
    pmToggleHeaderRow,
    pmToggleHeaderColumn,
    pmSetCellAttr,
    pmGoToNextCell,
    TextSelection
} from '../../pm-guard';

type PMDispatch = (tr: PMTransaction) => void;

// ── Table insertion ───────────────────────────────────────────────────────────

/**
 * Insert a new table at the current cursor position.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @param {number} rows - Number of rows for the new table (≥ 1).
 * @param {number} columns - Number of columns for the new table (≥ 1).
 * @returns {boolean} `true` if the operation was applicable.
 */
export function insertTable(
    state: PMEditorState,
    dispatch: PMDispatch | undefined,
    rows: number,
    columns: number
): boolean {
    const schema: PMSchema = state.schema;
    const tableType: PMNodeType | undefined = schema.nodes['table'];
    const rowType: PMNodeType | undefined = schema.nodes['tableRow'];
    const cellType: PMNodeType | undefined = schema.nodes['tableCell'];
    const paraType: PMNodeType | undefined = schema.nodes['paragraph'];

    if (!tableType || !rowType || !cellType || !paraType) { return false; }

    if (dispatch) {
        const tr: PMTransaction = state.tr;

        // Build table structure
        const tableRows: PMNode[] = [];
        for (let r: number = 0; r < rows; r++) {
            const cells: PMNode[] = [];
            for (let c: number = 0; c < columns; c++) {
                const para: PMNode = paraType.createAndFill() as PMNode;
                const cell: PMNode = cellType.createAndFill(
                    { colspan: 1, rowspan: 1 },
                    para
                ) as PMNode;
                cells.push(cell);
            }
            const row: PMNode = rowType.createAndFill({}, cells) as PMNode;
            tableRows.push(row);
        }

        const table: PMNode = tableType.createAndFill({}, tableRows) as PMNode;

        // Insert after current selection
        const insertPos: number = state.selection.to;
        tr.insert(insertPos, table);

        const firstTextPos: number = insertPos + 4;
        tr.setSelection(TextSelection.near(tr.doc.resolve(firstTextPos)));
        dispatch(tr.scrollIntoView());
    }

    return true;
}

// ── Row operations ────────────────────────────────────────────────────────────

/**
 * Insert a row before the current cursor row.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function insertRowBefore(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmAddRowBefore(state, dispatch);
}

/**
 * Insert a row after the current cursor row.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function insertRowAfter(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmAddRowAfter(state, dispatch);
}

/**
 * Delete the row containing the cursor.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function deleteRow(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmDeleteRow(state, dispatch);
}

// ── Column operations ─────────────────────────────────────────────────────────

/**
 * Insert a column before the current cursor column.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function insertColumnBefore(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmAddColumnBefore(state, dispatch);
}

/**
 * Insert a column after the current cursor column.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function insertColumnAfter(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmAddColumnAfter(state, dispatch);
}

/**
 * Delete the column containing the cursor.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function deleteColumn(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmDeleteColumn(state, dispatch);
}

// ── Table deletion ────────────────────────────────────────────────────────────

/**
 * Delete the entire table containing the cursor.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function deleteTablePM(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmDeleteTable(state, dispatch);
}

// ── Header operations ─────────────────────────────────────────────────────────

/**
 * Toggle the header status on the row containing the cursor.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function toggleHeaderRowPM(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmToggleHeaderRow(state, dispatch);
}

/**
 * Toggle the header status on the column containing the cursor.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function toggleHeaderColumnPM(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmToggleHeaderColumn(state, dispatch);
}

/**
 * Set a declared cell attribute on the cell(s) in the current selection.
 *
 * Thin delegation to prosemirror-tables' `setCellAttr`. Because all cell
 * attributes are declared in the schema (`tableCell` and `tableHeader`
 * expose the same allowlist), PM will reject any unknown key at runtime
 * — exactly the validation we want.
 *
 * @param {string} attrName - Declared attribute name (e.g. 'backgroundColor').
 * @param {unknown} value - The attribute value. Must match the attribute's
 *                          declared type in the schema.
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the operation was applicable.
 */
export function setCellAttribute(
    attrName: string,
    value: unknown,
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmSetCellAttr(attrName, value)(state, dispatch);
}

// ── Navigation ────────────────────────────────────────────────────────────────

/**
 * Navigate to the next cell (for Tab key).
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the cursor moved to a next cell.
 */
export function moveToNextCell(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmGoToNextCell(1)(state, dispatch);
}

/**
 * Navigate to the previous cell (for Shift+Tab key).
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if the cursor moved to a previous cell.
 */
export function moveToPreviousCell(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    return pmGoToNextCell(-1)(state, dispatch);
}

// ── TableMap access ───────────────────────────────────────────────────────────

/**
 * Get the {@link PMTableMap} for a given table PM node.
 *
 * Provides structural information (dimensions, cell positions) to callers
 * inside src/pm/ without exposing the TableMap type externally.
 *
 * @param {PMNode} tableNode - The table PM node.
 * @returns {PMTableMap} The computed table map.
 */
export function getTableMap(tableNode: PMNode): PMTableMap {
    return PMTableMap.get(tableNode);
}

/**
 * Check if the cursor is currently inside a table.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @returns {boolean} `true` if the cursor is inside a table node.
 */
export function isCursorInTable(state: PMEditorState): boolean {
    const { $from } = state.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'table') { return true; }
    }
    return false;
}

/**
 * Insert a paragraph inside the current table cell.
 * Used by the Enter key binding inside a cell — does not split the cell.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional dispatch function.
 * @returns {boolean} `true` if a paragraph was inserted.
 */
export function insertParagraphInCell(
    state: PMEditorState,
    dispatch?: PMDispatch
): boolean {
    const schema: PMSchema = state.schema;
    const paraType: PMNodeType | undefined = schema.nodes['paragraph'];
    if (!paraType) { return false; }

    // Only applies when cursor is inside a table cell
    if (!isCursorInTable(state)) { return false; }

    if (dispatch) {
        const tr: PMTransaction = state.tr;
        const para: PMNode = paraType.createAndFill() as PMNode;
        tr.replaceSelectionWith(para, false);
        dispatch(tr.scrollIntoView());
    }

    return true;
}
