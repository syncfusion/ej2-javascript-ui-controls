/**
 * List Keymap Extension
 *
 * Single-source owner of every list-aware keyboard shortcut:
 *   - `Tab`        → sink the current list item (indent)
 *   - `Shift-Tab`  → lift the current list item (outdent)
 *   - `Enter`      → split the current list item at the cursor
 *   - `Backspace`  → handled in stages:
 *                     1. Paragraph/heading after a list → merge into the
 *                        previous item (inline, or as last child).
 *                     2. Fall through to the base keymap.
 *   - `Delete`     → handled in branches:
 *                     1. Next block is a listItem → join forward.
 *                     2. Next block is a list wrapper → join forward + backward.
 *                     3. Otherwise fall through to the base keymap.
 *   - `Mod-Delete` and `Mod-Backspace` mirror Backspace and Delete
 *     respectively (Tiptap pattern).
 * All list types (bullet, ordered, task) get identical behaviour.
 *
 */

import { defineExtension } from '../define-extension';
import {
    ExtensionDefinition,
    ExtensionOptions,
    ExtensionScope
} from '../types';

/**
 * A list-type configuration: pairs a list-item type name with the names
 * of the list-container node types it can live inside.
 *
 * Mirrors Tiptap's `listTypes: Array<{ itemName, wrapperNames }>` option.
 */
export interface ListKeymapTypeEntry {
    readonly itemName: string;
    readonly wrapperNames: readonly string[];
}

/**
 * Options accepted by the List Keymap extension.
 */
export interface ListKeymapExtensionOptions extends ExtensionOptions {
    /**
     * List-type configurations. Each entry pairs an item node name with
     * the list wrappers it can live in. The keymap iterates the entries
     * in order and stops at the first one whose schema types exist and
     * whose commands succeed.
     */
    readonly listTypes?: readonly ListKeymapTypeEntry[];
}

/**
 * Default list-type configuration matching the built-in list extensions.
 * `listItem` lives in `bulletList` and `orderedList`; `taskItem` lives in
 * `taskList`.
 */
const DEFAULT_LIST_TYPES: readonly ListKeymapTypeEntry[] = [
    { itemName: 'listItem', wrapperNames: ['bulletList', 'orderedList'] },
    { itemName: 'taskItem', wrapperNames: ['taskList'] }
];

/**
 * List Keymap built-in extension.
 */
export const listKeymapExtension: ExtensionDefinition<ListKeymapExtensionOptions> = defineExtension({
    name: 'listKeymap',

    /**
     * Lower priority than the list/task-list extensions so they register
     * first. The compiler merges keymaps in registration order, so by
     * registering last our bindings win.
     */
    priority: 5,

    defineOptions(): ListKeymapExtensionOptions {
        return { listTypes: DEFAULT_LIST_TYPES };
    },


    keyboardShortcuts(this: ExtensionScope<ListKeymapExtensionOptions>): Record<string, () => boolean> {
        const listTypes: readonly ListKeymapTypeEntry[] =
            (this.options?.listTypes as readonly ListKeymapTypeEntry[] | undefined) ?? DEFAULT_LIST_TYPES;

        // ── Backspace ─────────────────────────────────────────────────────
        // Stage 1 — paragraph/heading after a list → merge into previous
        // item (inline merge, or move as the item's last child when the
        // last child is not a textblock).
        // Stage 2 — fall through to the base keymap.
        const onBackspace: () => boolean = (): boolean => {
            if (this.editor.commands.joinListBackward()) { return true; }
            return false;
        };

        // ── Delete ────────────────────────────────────────────────────────
        // Stage 1 — next block is a list item / wrapper → handleDelete.
        // Stage 2 — otherwise fall through.
        const onDelete: () => boolean = (): boolean => {
            if (this.editor.commands.deleteListItem()) { return true; }
            return false;
        };

        // ── Tab ───────────────────────────────────────────────────────────
        // Sink the current list item. Tiptap stops at the first handled
        // list type so a single Tab cannot sink the block twice.
        const onTab: () => boolean = (): boolean => {
            for (const _ of listTypes) {
                if (this.editor.commands.indentListItem()) { return true; }
            }
            return false;
        };

        // ── Shift-Tab ─────────────────────────────────────────────────────
        const onShiftTab: () => boolean = (): boolean => {
            for (const _ of listTypes) {
                if (this.editor.commands.outdentListItem()) { return true; }
            }
            return false;
        };

        // ── Enter ─────────────────────────────────────────────────────────
        const onEnter: () => boolean = (): boolean => {
            if (this.editor.commands.splitListItem()) { return true; }
            return false;
        };

        return {
            'Backspace': onBackspace,
            'Mod-Backspace': onBackspace,
            'Delete': onDelete,
            'Mod-Delete': onDelete,
            'Tab': onTab,
            'Shift-Tab': onShiftTab,
            'Enter': onEnter
        };
    }
});

export default listKeymapExtension;
