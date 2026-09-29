/**
 * src/pm/adapters/table/index.ts — Public surface of the PM table adapter layer.
 *
 * Exports only PM-free function signatures (no PM types on public API).
 * Used by the Table Extension's commands and services.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 */
export { createTableEditingPlugin } from './table-plugin-adapter';

export {
    insertTable,
    insertRowBefore,
    insertRowAfter,
    deleteRow,
    insertColumnBefore,
    insertColumnAfter,
    deleteColumn,
    deleteTablePM,
    toggleHeaderRowPM,
    toggleHeaderColumnPM,
    setCellAttribute,
    moveToNextCell,
    moveToPreviousCell,
    getTableMap,
    isCursorInTable,
    insertParagraphInCell
} from './table-command-adapter';

export {
    toPMCellSelection,
    fromPMCellSelection,
    remapCellSelection
} from './cell-selection-adapter';
