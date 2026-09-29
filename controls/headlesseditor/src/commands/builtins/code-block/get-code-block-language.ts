/**
 * get-code-block-language.ts — Public facade: read the language attribute
 * of the currently focused code block.
 *
 * Read-only command registered in the same namespace as
 * `setCodeBlockLanguage`. Consumers can dispatch the query through the
 * standard command pipeline AND retrieve the value through the public
 * `getCodeBlockLanguage(editor)` query helper. Both share the same
 * implementation path so they cannot drift.
 *
 * Read-only command:
 *   - `canExecute` returns true when the cursor is inside a code block.
 *   - `execute` does NOT mutate the document and emits no
 *     `documentChanged` event. The returned `void` matches the
 *     `PMCommandInternal` contract; callers wanting the actual value
 *     should use the query helper exported alongside.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import {
    PMEditorState,
    PMNodeType,
    PMResolvedPos
} from '../../../pm/pm-guard';

/** Payload is empty — the command acts on the current selection. */
export type GetCodeBlockLanguagePayload = void;

/**
 * Returns the depth of the nearest `codeBlock` ancestor of `$pos`,
 * or `-1` when not inside one.
 *
 * @param {PMResolvedPos} $pos - Resolved document position to inspect.
 * @returns {number} Depth of the nearest `codeBlock` ancestor, or `-1`.
 */
function findCodeBlockDepth($pos: PMResolvedPos): number {
    for (let d: number = $pos.depth; d >= 0; d--) {
        if ($pos.node(d).type.name === 'codeBlock') { return d; }
    }
    return -1;
}

/**
 * Reads the `language` attribute of the code block at the current selection.
 *
 * Resolution order matches `setCodeBlockLanguage`: we first honor the
 * selection context, and if the cursor is not inside a code block we
 * fall back to the first code block in the document. The fallback is
 * what allows the NodeView's header UI (Copy button, language
 * dropdown) to read the language even when Syncfusion's widget wrapper
 * owns focus and the editor selection has not been moved into the
 * code block on the current tick.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {string} Language of the resolved code block, or '' if none exists.
 */
export function readCodeBlockLanguage(pmState: PMEditorState): string {
    const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
    if (!codeBlockType) { return ''; }

    const depth: number = findCodeBlockDepth(pmState.selection.$from);
    if (depth !== -1) {
        const node: { attrs?: Record<string, unknown> } | null = pmState.selection.$from.node(depth);
        if (!node || !node.attrs) { return ''; }
        const language: unknown = node.attrs['language'];
        return typeof language === 'string' ? language : '';
    }

    // Fallback: walk the doc for the first codeBlock and read its
    // language attribute. This mirrors `setCodeBlockLanguage` /
    // `readCodeBlockContent` so all three header surfaces stay
    // consistent when the cursor sits outside the code block.
    let found: { pos: number } | null = null;
    pmState.doc.descendants((node: { type: { name: string } }, pos: number): boolean => {
        if (node.type.name === 'codeBlock') {
            found = { pos };
            return false; // stop the walk on first hit
        }
        return true;
    });
    if (!found) { return ''; }

    const target: { attrs?: Record<string, unknown> } | null =
        pmState.doc.nodeAt(found.pos) as { attrs?: Record<string, unknown> } | null;
    if (!target || !target.attrs) { return ''; }
    const language: unknown = target.attrs['language'];
    return typeof language === 'string' ? language : '';
}

export const getCodeBlockLanguageCommand: PMCommandInternal<GetCodeBlockLanguagePayload> = {
    name: 'getCodeBlockLanguage',
    meta: { label: 'Get Code Block Language', category: 'read' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return false; }
        return findCodeBlockDepth(pmState.selection.$from) !== -1;
    },

    execute(_ctx: PMCommandContext): void {
        // No-op: command-pipeline entry exists for canExecute gating,
        // namespace parity, and dispatcher coverage. Use the
        // `getCodeBlockLanguage(editor)` query helper to retrieve
        // the actual value.
    }
};
