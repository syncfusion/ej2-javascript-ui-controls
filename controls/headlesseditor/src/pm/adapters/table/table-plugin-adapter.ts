/**
 * table-plugin-adapter.ts — Wraps prosemirror-tables plugins.
 *
 * Sealed inside src/pm/. Nothing outside src/pm/ may import from this file.
 * Exported via src/pm/adapters/table/index.ts using PM-free type (PMPlugin).
 */
import { PMPlugin, tableEditing, columnResizing } from '../../pm-guard';

/**
 * Creates the prosemirror-tables editing plugin.
 *
 * @returns {PMPlugin} The configured table editing plugin.
 * @hidden
 */
export function createTableEditingPlugin(): PMPlugin {
    return tableEditing();
}

/**
 * Creates the prosemirror-tables column resize plugin.
 *
 * @returns {PMPlugin} The configured column resize plugin.
 * @hidden
 */
export function createColumnResizePlugin(): PMPlugin {
    return columnResizing();
}
