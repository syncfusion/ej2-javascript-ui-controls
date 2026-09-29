/**
 * get-code-block-content.ts — Public facade: read the text content of
 * the currently focused code block.
 *
 * Read-only command registered in the same namespace as
 * `setCodeBlockLanguage`. Consumers can dispatch the query through
 * the standard command pipeline AND retrieve the value through the
 * public `getCodeBlockContent(editor)` query helper. Both share the
 * same implementation path so they cannot drift.
 *
 * Read-only command:
 *   - `canExecute` returns true when the cursor is inside a code block.
 *   - `execute` does NOT mutate the document and emits no
 *     `documentChanged` event. The returned `void` matches the
 *     `PMCommandInternal` contract; callers wanting the actual text
 *     should use the query helper exported from
 *     `src/extensions/builtins/code-block-queries.ts`.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import {
    PMEditorState,
    PMNodeType,
    PMResolvedPos
} from '../../../pm/pm-guard';

/** Payload is empty — the command acts on the current selection. */
export type GetCodeBlockContentPayload = void;

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
 * Reads the text content of the code block at the current selection.
 *
 * Resolution order matches `setCodeBlockLanguage`: we first honor the
 * selection context, and if the cursor is not inside a code block we
 * fall back to the first code block in the document. The fallback is
 * what allows the NodeView's header UI (Copy button, language
 * dropdown) to read content even when Syncfusion's widget wrapper
 * owns focus and the editor selection has not been moved into the
 * code block on the current tick.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {string} Text content of the resolved code block, or '' if none exists.
 */
export function readCodeBlockContent(pmState: PMEditorState): string {
    const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
    if (!codeBlockType) { return ''; }

    const depth: number = findCodeBlockDepth(pmState.selection.$from);
    if (depth !== -1) {
        const node: { textContent?: string } | null = pmState.selection.$from.node(depth);
        return node && typeof node.textContent === 'string' ? node.textContent : '';
    }

    // Fallback: walk the doc for the first codeBlock and read its
    // textContent. This consumes ProseMirror's resolved-position path
    // (`doc.nodeAt(pos).textContent`) so the same line-merging rules
    // that the editor uses internally apply — no risk of a hand-rolled
    // text concat duplicating separators or skipping hard-break nodes.
    let found: { pos: number } | null = null;
    pmState.doc.descendants((node: { type: { name: string } }, pos: number): boolean => {
        if (node.type.name === 'codeBlock') {
            found = { pos };
            return false; // stop the walk on first hit
        }
        return true;
    });
    if (!found) { return ''; }

    const target: { textContent?: string } | null = pmState.doc.nodeAt(found.pos) as { textContent?: string } | null;
    return target && typeof target.textContent === 'string' ? target.textContent : '';
}

export const getCodeBlockContentCommand: PMCommandInternal<GetCodeBlockContentPayload> = {
    name: 'getCodeBlockContent',
    meta: { label: 'Get Code Block Content', category: 'read' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return false; }
        return findCodeBlockDepth(pmState.selection.$from) !== -1;
    },

    execute(_ctx: PMCommandContext): void {
        // No-op: command-pipeline entry exists for canExecute gating,
        // namespace parity, and dispatcher coverage. Use the
        // `getCodeBlockContent(editor)` query helper to retrieve
        // the actual text.
    }
};
