/**
 * Main table extension definition.
 *
 * Assembles all table capabilities: schema nodes, commands, keyboard bindings,
 * PM plugins, DOM specs.
 *
 */
import { defineExtension } from '../define-extension';
import type { ExtensionDefinition, ExtensionDOMSpecs, ContributorContext, ExtensionOptions } from '../types';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { Command } from '../../commands/types';

// ── Options ───────────────────────────────────────────────────────────────────

/**
 * Top-level configuration options consumed by the Table extension.
 */
export interface TableOptions {
    /**
     * Enable or disable table column resizing via drag handles. Default `true`.
     *
     * When `true`, table columns can be resized by dragging the column separator
     * handles in the header row. When `false`, column resize handles are not rendered.
     */
    resize?: boolean;
}

// ── Schema ────────────────────────────────────────────────────────────────────
import { tableNodeDef } from '../table/schema/table-node';
import { tableRowNodeDef } from '../table/schema/row-node';
import { tableCellNodeDef } from '../table/schema/cell-node';
import { tableHeaderNodeDef } from '../table/schema/header-cell-node';

// ── Commands ──────────────────────────────────────────────────────────────────
import {
    insertTableCommand,
    deleteTableCommand,
    insertRowBeforeCommand,
    insertRowAfterCommand,
    deleteRowCommand,
    insertColumnBeforeCommand,
    insertColumnAfterCommand,
    deleteColumnCommand,
    insertParagraphInCellCommand,
    toggleHeaderRowCommand,
    toggleHeaderColumnCommand,
    setCellAttributeCommand,
    moveToNextCellCommand,
    moveToPreviousCellCommand
} from '../table/commands';

// ── Plugins ───────────────────────────────────────────────────────────────────
import { createTableEditingPlugin, createColumnResizePlugin } from '../../pm/adapters/table/table-plugin-adapter';

// ── DOM specs ─────────────────────────────────────────────────────────────────
import { tableDOMSpecs } from '../table/dom';

// ── Extension ─────────────────────────────────────────────────────────────────

/**
 * tableExtension — full table editing capability for the Syncfusion headless
 * editor.
 *
 * @remarks
 * Use this extension instead of the legacy `tableExtension` stub from
 * `src/extensions/builtins/table.ts`. The legacy stub is preserved for
 * backwards compatibility but contributes no commands.
 */
export const tableExtension: ExtensionDefinition<TableOptions> = defineExtension({
    name: 'table',

    /**
     * Tier 3 — all four table nodes (`table`, `tableRow`, `tableCell`, `tableHeader`)
     * are recursive structural containers. `table` is in the `block` group with
     * `tableRow+` content; `tableCell`/`tableHeader` have `block+` content
     * (enabling nested tables). Both cell types are required so that
     * toggleHeaderRow / toggleHeaderColumn can swap node types.
     * Must be registered after Tier 1 primary fillers to prevent `fillBefore`
     * infinite recursion when auto-filling block+ content.
     */
    priority: 10,

    /**
     * Provides default {@link TableOptions} when the host doesn't supply them.
     *
     * @returns {TableOptions} Default table extension options.
     */
    defineOptions(): TableOptions {
        return {
            resize: true
        };
    },

    // ── Nodes ─────────────────────────────────────────────────────────────────

    nodes(): NodeDefinition[] {
        return [tableNodeDef, tableRowNodeDef, tableCellNodeDef, tableHeaderNodeDef];
    },

    // ── Commands ──────────────────────────────────────────────────────────────

    commands(): Command[] {
        return [
            insertTableCommand as unknown as Command,
            deleteTableCommand as unknown as Command,
            insertRowBeforeCommand as unknown as Command,
            insertRowAfterCommand as unknown as Command,
            deleteRowCommand as unknown as Command,
            insertColumnBeforeCommand as unknown as Command,
            insertColumnAfterCommand as unknown as Command,
            deleteColumnCommand as unknown as Command,
            insertParagraphInCellCommand as unknown as Command,
            toggleHeaderRowCommand as unknown as Command,
            toggleHeaderColumnCommand as unknown as Command,
            setCellAttributeCommand as unknown as Command,
            moveToNextCellCommand as unknown as Command,
            moveToPreviousCellCommand as unknown as Command
        ];
    },

    // ── Plugins ───────────────────────────────────────────────────────────────

    plugins(ctx: ContributorContext): readonly unknown[] {
        const plugins: unknown[] = [createTableEditingPlugin()];

        // Conditionally include resize plugin based on options
        if (this.options.resize) {
            plugins.push(createColumnResizePlugin());
        }

        return plugins;
    },

    // ── DOM specs ─────────────────────────────────────────────────────────────

    domSpecs(): ExtensionDOMSpecs {
        return tableDOMSpecs;
    }
});

export default tableExtension;

// Legacy payload type aliases preserved for API compatibility.
export type { InsertTablePayload } from '../table/commands/insert-table';
export type { SetCellAttributePayload } from '../table/commands/set-cell-attribute';
