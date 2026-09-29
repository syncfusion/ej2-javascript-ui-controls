/**
 * Registers indent/outdent commands and Tab/Shift+Tab keyboard handling.
 */
import { defineExtension } from '../define-extension';
import { PMSelection } from '../../pm/pm-guard';
import type { Command } from '../../commands/types';
import type { ExtensionDefinition, ExtensionScope } from '../types';
import { indentCommand, outdentCommand } from '../../commands/builtins/structure';

interface TabContext {
    inListItem: boolean;
    inTableCell: boolean;
    inIndentableShape: boolean;
    inPlainBlock: boolean;
    hasSelection: boolean;
    atBlockStart: boolean;
    insideActiveMark: boolean;
}

/** Visual tab-stop width in space characters (matches `tab-size: 4`). */
const TAB_WIDTH: number = 4;

/** String of `TAB_WIDTH` plain ASCII space characters for tab-stop insertion. */
const TAB_SPACE_STRING: string = ' '.repeat(TAB_WIDTH);

/** Unique extension identifier. */
const EXTENSION_NAME: string = 'indentOutdent';

// ── shape discrimination helpers ──────────────────────────

/**
 * Probe: cursor inside a list item.
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor is inside a list item.
 */
function isCursorInListItem(editor: ExtensionScope<object>['editor']): boolean {
    return editor.can().indentListItem() || editor.can().outdentListItem();
}

/**
 * Probe: cursor inside a table cell.
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor is inside a table cell.
 */
function isCursorInTableCell(editor: ExtensionScope<object>['editor']): boolean {
    return editor.can().moveToNextCell() || editor.can().insertRowAfter();
}

/**
 * Probe: cursor inside any indentable block (paragraph, heading, blockquote, listItem, tableCell, image, …).
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor is inside an indentable block.
 */
function isCursorInIndentableShape(editor: ExtensionScope<object>['editor']): boolean {
    return editor.can().indent();
}

/**
 * Probe: cursor inside a plain block (paragraph / heading / blockquote).
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor is inside a plain block.
 */
function isCursorInPlainBlock(editor: ExtensionScope<object>['editor']): boolean {
    return editor.can().setTextAlign({ align: 'left' });
}

/**
 * Probe: cursor sits inside a text leaf carrying any active mark (link / bold / …).
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor sits inside an active mark.
 */
function isCursorInsideActiveMark(editor: ExtensionScope<object>['editor']): boolean {
    return editor.getActiveMarks().size > 0;
}

/**
 * Probe: selection is a non-empty range (collapsed ⇒ false).
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the selection is non-empty.
 */
function hasNonEmptySelection(editor: ExtensionScope<object>['editor']): boolean {
    return !editor.getSelection().empty;
}

/**
 * Returns true when the cursor is at the start of the current block.
 *
 * @param {Object} editor - Editor instance.
 * @returns {boolean} `true` when the cursor is at the start of its block.
 */
function isCursorAtBlockStart(
    editor: ExtensionScope<object>['editor']
): boolean {
    const pmSelection: PMSelection = editor.integration.getState().selection;
    return pmSelection.empty
        && pmSelection.$from.parentOffset === 0;
}

// ── shared context helpers ──────────────────────────────────────────────────

/**
 * Builds a context object capturing common cursor/selection state.
 * Used by both Tab and Shift+Tab handlers to avoid repeated probe calls.
 *
 * @param {Object} editor - Editor instance.
 * @returns {TabContext} Context object with shape flags and selection state.
 */
function buildCursorContext(editor: ExtensionScope<object>['editor']): TabContext {
    return {
        inListItem: isCursorInListItem(editor),
        inTableCell: isCursorInTableCell(editor),
        inIndentableShape: isCursorInIndentableShape(editor),
        inPlainBlock: isCursorInPlainBlock(editor),
        hasSelection: hasNonEmptySelection(editor),
        atBlockStart: isCursorAtBlockStart(editor),
        insideActiveMark: isCursorInsideActiveMark(editor)
    };
}

// ── keymap handler factories ────────────────────────────────────────────────

/**
 * `Tab` handler — dispatches by active shape:
 *   listItem → `indentListItem()` (prioritized to work inside table cells);
 *   table cell → `moveToNextCell`, or if at end of table: `insertRowAfter` + `moveToNextCell`;
 *   indentable block → structural `indent()` (or 4-space insert when `enableTabKey` is true
 *   and structural indent declined mid-text); else fall through.
 *
 * @param {Object} editor - Editor instance.
 * @param {boolean} enableTabKey - Whether plain-block tab insertion is enabled.
 * @returns {Function} A keymap handler returning `true` to consume the key.
 */
function buildTabKeyHandler(
    editor: ExtensionScope<object>['editor'],
    enableTabKey: boolean
): () => boolean {
    return (): boolean => {
        if (!editor) { return false; }

        const ctx: TabContext = buildCursorContext(editor);

        // Priority 1: List item indentation
        if (ctx.inListItem) {
            if (!enableTabKey) {
                return false;
            }
            if (ctx.hasSelection || ctx.atBlockStart) {
                return editor.commands.indentListItem();
            }
            return editor.commands.insertText({ text: TAB_SPACE_STRING });
        }

        // Priority 2: Table cell navigation (with row insertion at end)
        if (ctx.inTableCell) {
            if (editor.commands.moveToNextCell()) {
                return true;
            }
            if (!editor.can().insertRowAfter()) {
                return false;
            }
            return editor.commands.insertRowAfter() && editor.commands.moveToNextCell();
        }

        // Priority 3: Indentable block structural indent or fallback
        if (ctx.inIndentableShape) {
            if (!enableTabKey) {
                return false;
            }
            if (ctx.insideActiveMark || ctx.hasSelection || ctx.atBlockStart) {
                return editor.commands.indent();
            }
            if (ctx.inPlainBlock) {
                return editor.commands.insertText({ text: TAB_SPACE_STRING });
            }
            return false;
        }

        // Priority 4: Plain block tab insertion (standalone fallback)
        if (enableTabKey
            && ctx.inPlainBlock
            && !ctx.insideActiveMark
            && !ctx.hasSelection) {
            return editor.commands.insertText({ text: TAB_SPACE_STRING });
        }

        return false;
    };
}

/**
 * `Shift+Tab` handler — inverse of `Tab`:
 *   listItem → `outdentListItem()` (prioritized to work inside table cells);
 *   table cell → `moveToPreviousCell`; indentable block → structural `outdent()`
 *   (or strip trailing spaces when `enableTabKey` is true mid-text);
 *   else fall through.
 *
 * @param {Object} editor - Editor instance.
 * @param {boolean} _enableTabKey - Unused; included for handler signature consistency.
 * @returns {Function} A keymap handler returning `true` to consume the key.
 */
function buildShiftTabKeyHandler(
    editor: ExtensionScope<object>['editor'],
    _enableTabKey: boolean
): () => boolean {
    return (): boolean => {
        if (!editor) { return false; }

        const ctx: TabContext = buildCursorContext(editor);
        const selection: { from: number; to: number; empty: boolean } = editor.getSelection();

        // Attempt to strip trailing tab-space outside table cells (before any structural change)
        if (selection.empty && !ctx.inTableCell) {
            const pmSelection: PMSelection = editor.integration.getState().selection;
            const textBeforeCursor: string = pmSelection.$from.parent.textBetween(0, pmSelection.$from.parentOffset, '', '');
            if (textBeforeCursor.endsWith(TAB_SPACE_STRING)) {
                return editor.commands.deleteRange({
                    from: selection.from - TAB_WIDTH,
                    to: selection.from
                });
            }
        }

        // Priority 1: List item outdentation
        if (ctx.inListItem) {
            return editor.commands.outdentListItem();
        }

        // Priority 2: Table cell navigation
        if (ctx.inTableCell) {
            editor.commands.moveToPreviousCell();
            return true;
        }

        // Priority 3: Structural outdent for indentable blocks
        if (ctx.inIndentableShape) {
            return editor.commands.outdent();
        }

        return false;
    };
}

// ── public extension definition ─────────────────────────────────────────────

/**
 * `indentOutdentExtension` — registers `indentCommand` +
 * `outdentCommand` and wires the `Tab` / `Shift+Tab` policy.
 */
export const indentOutdentExtension: ExtensionDefinition<object> = defineExtension({
    name: EXTENSION_NAME,
    // LATER than `listKeymapExtension` (priority 5) so this extension's
    // Tab / Shift-Tab bindings win on registration order; the handlers
    // route back to the list subsystem for `<li>` cursors.
    priority: 6,

    commands(): Command[] {
        return [indentCommand, outdentCommand];
    },

    keyboardShortcuts(this: ExtensionScope<object>): Record<string, () => boolean> {
        const editor: ExtensionScope<object>['editor'] = this.editor;
        const enableTabKey: boolean = this.editorConfig?.enableTabKey ?? false;
        if (!editor) {
            return {};
        }
        return {
            'Tab': buildTabKeyHandler(editor, enableTabKey),
            'Shift-Tab': buildShiftTabKeyHandler(editor, enableTabKey)
        };
    }
});

export default indentOutdentExtension;
