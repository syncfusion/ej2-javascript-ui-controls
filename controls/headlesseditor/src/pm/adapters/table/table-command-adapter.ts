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
import { appendTrailingParagraphIfFinal } from '../../../extensions/common/insert-trailing-paragraph';
import {
    PMEditorState,
    PMTransaction,
    PMNode,
    PMNodeType,
    PMResolvedPos,
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

interface TableCellContext {
    tablePos: number;
    table: PMNode;
    cellPos: number;
    tableMap: PMTableMap;
    cellRect: ReturnType<PMTableMap['findCell']>;
}

/**
 * Resolve the table and cell context for the current selection.
 *
 * Walks up the current selection's resolved position to find the enclosing
 * table and table cell/header, then calculates the cell position and
 * rectangular coordinates from the table map.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @returns {TableCellContext | null} The enclosing table and cell context,
 * or `null` when the selection is not inside a table cell.
 */
function findTableCellContext(
    state: PMEditorState
): TableCellContext | null {
    const { $from } = state.selection;
    let tableDepth: number = -1;
    let cellDepth: number = -1;
    for (let depth: number = $from.depth; depth > 0; depth--) {
        const node: PMNode = $from.node(depth);
        if (cellDepth === -1 && (node.type.name === 'tableCell' || node.type.name === 'tableHeader')) {
            cellDepth = depth;
        }
        if (node.type.name === 'table') {
            tableDepth = depth;
            break;
        }
    }
    if (tableDepth === -1 || cellDepth === -1) {
        return null;
    }
    const table: PMNode = $from.node(tableDepth);
    const tablePos: number = $from.before(tableDepth);
    const tableStart: number = $from.start(tableDepth);
    const cellDocPos: number = $from.before(cellDepth);
    const cellPos: number = cellDocPos - tableStart;
    const tableMap: PMTableMap = PMTableMap.get(table);
    return {
        tablePos,
        table,
        cellPos,
        tableMap,
        cellRect: tableMap.findCell(cellPos)
    };
}

/**
 * Set a text cursor inside the specified table cell.
 *
 * Maps the original table position through the transaction, resolves the
 * target cell using the updated table map, and places a text selection
 * inside that cell.
 *
 * @param {PMTransaction} tr - Current PM transaction.
 * @param {number} tablePos - Position immediately before the table node.
 * @param {number} row - Zero-based target row index.
 * @param {number} column - Zero-based target column index.
 * @returns {void}
 */
function setCursorInTableCell(
    tr: PMTransaction,
    tablePos: number,
    row: number,
    column: number
): void {
    const mappedTablePos: number = tr.mapping.map(tablePos, 1);
    const table: PMNode | null = tr.doc.nodeAt(mappedTablePos);
    if (!table) {
        return;
    }
    const tableMap: PMTableMap = PMTableMap.get(table);
    const cellPos: number = tableMap.positionAt(row, column, table);
    // tablePos = position before the table node.
    // +1 = table content start.
    // cellPos = position before the target cell relative to table content.
    // +1 = position inside the cell.
    const cellStart: number = mappedTablePos + 1 + cellPos;
    tr.setSelection(
        TextSelection.near(tr.doc.resolve(cellStart + 1))
    );
}

type PMTableCommand = (
    state: PMEditorState,
    dispatch?: PMDispatch
) => boolean;

/**
 * Execute a table command and restore the cursor to a target cell.
 *
 * Resolves the current table-cell context before executing the supplied
 * command. When dispatching, the target cell is calculated from the
 * original cell context and the cursor is restored after the table
 * modification using the updated transaction state.
 *
 * @param {PMEditorState} state - Current PM editor state.
 * @param {PMDispatch} [dispatch] - Optional transaction dispatch function.
 * @param {PMTableCommand} command - PM table command to execute.
 * @param {Function} getTargetCell - Calculates the row and column where the
 * cursor should be placed after the command.
 * @returns {boolean} `true` if the command was applicable and executed;
 * otherwise `false`.
 */
function executeTableCellCommand(
    state: PMEditorState,
    dispatch: PMDispatch | undefined,
    command: PMTableCommand,
    getTargetCell: (
        context: TableCellContext
    ) => { row: number; column: number }
): boolean {
    const context: TableCellContext | null = findTableCellContext(state);
    if (!context) {
        return false;
    }
    return command(
        state,
        dispatch
            ? (tr: PMTransaction): void => {
                const target: { row: number; column: number } =
                    getTargetCell(context);
                setCursorInTableCell(
                    tr,
                    context.tablePos,
                    target.row,
                    target.column
                );
                dispatch(tr);
            }
            : undefined
    );
}

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

        // Consume the trailing empty paragraph with the new Table, then append
        // a fresh paragraph so the document remains editable. Also matches the
        // empty-doc case where the sole paragraph IS the trailing paragraph —
        // replaces the entire doc content with the Table, producing
        // [Table, freshParagraph] consistent with the HR insertion contract.
        const trailingPara: { start: number; size: number } | null = ((): { start: number; size: number } | null => {
            const doc: { childCount: number; content: { size: number }; child: (n: number) => PMNode } = state.doc;
            if (doc.childCount < 1) { return null; }
            const last: PMNode = doc.child(doc.childCount - 1);
            if (last.type.name !== 'paragraph' || last.childCount !== 0) { return null; }
            const endPos: number = doc.content.size;
            const startPos: number = endPos - last.nodeSize;
            // Empty-doc: the sole paragraph occupies the entire doc content;
            // caret position is irrelevant since there's only one valid place.
            const isSoleContent: boolean = doc.childCount === 1;
            if (!isSoleContent) {
                const caret: number = state.selection.from;
                if (caret < startPos || caret > endPos) { return null; }
            }
            return { start: startPos, size: last.nodeSize };
        })();

        let tablePos: number;

        if (trailingPara !== null) {
            const trailingParaStart: number = trailingPara.start;
            tr.replaceWith(
                trailingParaStart,
                trailingParaStart + trailingPara.size,
                table
            );
            tablePos = trailingParaStart;
        } else {
            tablePos = state.selection.to;
            tr.insert(tablePos, table);
        }

        appendTrailingParagraphIfFinal(tr, schema, tablePos);

        tr.setSelection(TextSelection.near(tr.doc.resolve(tablePos + 4)));
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
    return executeTableCellCommand(
        state,
        dispatch,
        pmAddRowBefore,
        ({ cellRect }: { cellRect: ReturnType<PMTableMap['findCell']>; }) => ({
            row: cellRect.top,
            column: cellRect.left
        })
    );
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
    return executeTableCellCommand(
        state,
        dispatch,
        pmAddRowAfter,
        ({ cellRect }: { cellRect: ReturnType<PMTableMap['findCell']>; }) => ({
            // TableMap rectangles are half-open, so bottom is the
            // first row after the current cell.
            row: cellRect.bottom,
            column: cellRect.left
        })
    );
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
    const tableContext: TableCellContext | null =
        findTableCellContext(state);
    if (!tableContext) {
        return false;
    }
    const tableMap: PMTableMap = PMTableMap.get(tableContext.table);
    const cellRect: ReturnType<PMTableMap['findCell']> =
        tableMap.findCell(tableContext.cellPos);
    // Keep the same column.
    // After deletion, the next row takes the deleted row's index.
    // If the deleted row is the last row, use the previous row.
    const targetRow: number =
        Math.min(cellRect.top, tableMap.height - 2);
    return pmDeleteRow(
        state,
        dispatch
            ? (tr: PMTransaction): void => {
                const mappedTablePos: number =
                    tr.mapping.map(tableContext.tablePos, 1);
                const table: PMNode | null =
                    tr.doc.nodeAt(mappedTablePos);
                if (table && targetRow >= 0) {
                    const newTableMap: PMTableMap =
                        PMTableMap.get(table);
                    if (targetRow < newTableMap.height) {
                        setCursorInTableCell(
                            tr,
                            tableContext.tablePos,
                            targetRow,
                            Math.min(
                                cellRect.left,
                                newTableMap.width - 1
                            )
                        );
                    }
                }
                dispatch(tr);
            }
            : undefined
    );
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
    return executeTableCellCommand(
        state,
        dispatch,
        pmAddColumnBefore,
        ({ cellRect }: { cellRect: ReturnType<PMTableMap['findCell']>; }) => ({
            row: cellRect.top,
            column: cellRect.left
        })
    );
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
    return executeTableCellCommand(
        state,
        dispatch,
        pmAddColumnAfter,
        ({ cellRect }: { cellRect: ReturnType<PMTableMap['findCell']>; }) => ({
            // TableMap rectangles are half-open, so right is the
            // first column after the current cell.
            row: cellRect.top,
            column: cellRect.right
        })
    );
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
    const tableContext: TableCellContext | null =
        findTableCellContext(state);
    if (!tableContext) {
        return false;
    }
    const tableMap: PMTableMap = PMTableMap.get(tableContext.table);
    const cellRect: ReturnType<PMTableMap['findCell']> =
        tableMap.findCell(tableContext.cellPos);
    // Keep the same row.
    // After deletion, the next column takes the deleted column's index.
    // If the deleted column is the last column, use the previous column.
    const targetColumn: number =
        Math.min(cellRect.left, tableMap.width - 2);
    return pmDeleteColumn(
        state,
        dispatch
            ? (tr: PMTransaction): void => {
                const mappedTablePos: number =
                    tr.mapping.map(tableContext.tablePos, 1);
                const table: PMNode | null =
                    tr.doc.nodeAt(mappedTablePos);
                if (table && targetColumn >= 0) {
                    const newTableMap: PMTableMap =
                        PMTableMap.get(table);
                    if (targetColumn < newTableMap.width) {
                        setCursorInTableCell(
                            tr,
                            tableContext.tablePos,
                            cellRect.top,
                            Math.min(
                                targetColumn,
                                newTableMap.width - 1
                            )
                        );
                    }
                }
                dispatch(tr);
            }
            : undefined
    );
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
        const { from } = tr.selection;
        tr.replaceSelectionWith(para, false);
        const insertedParagraphPos: number = from;
        tr.setSelection(TextSelection.near(tr.doc.resolve(insertedParagraphPos + 1)));
        dispatch(tr.scrollIntoView());
    }

    return true;
}
