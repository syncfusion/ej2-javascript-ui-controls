/**
 * set-horizontal-rule.ts — Public facade: insert a horizontal rule
 * at the current selection.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMNodeType, PMTransaction } from '../../../pm/pm-guard';
import { appendTrailingParagraphIfFinal, focusAfterBlock } from '../../common';

/**
 * Returns true when the document is the canonical empty state: a single
 * empty top-level paragraph.
 *
 * @param  {object} doc Current PM editor state's document.
 * @returns {boolean}   `true` for the canonical empty doc.
 */
function isOnlyEmptyParagraph(doc: { childCount: number; child: (n: number) => PMNode }): boolean {
    if (doc.childCount !== 1) { return false; }
    const first: PMNode = doc.child(0);
    return first.type.name === 'paragraph' && first.childCount === 0;
}

export const setHorizontalRuleCommand: PMCommandInternal<void> = {
    name: 'setHorizontalRule',
    meta: { label: 'Horizontal Rule', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        return pmState.schema.nodes['horizontalRule'] !== undefined;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const horizontalRuleType: PMNodeType | undefined = pmState.schema.nodes['horizontalRule'];
        if (!horizontalRuleType) { return; }

        const horizontalRuleNode: PMNode = horizontalRuleType.create();
        // Get the doc-level trailing empty paragraph range when the caret is inside it.
        // This paragraph was likely created by a prior special-block insertion and should
        // be consumed by the new Divider. Returns -1 when the expected shape is absent.
        const trailingParaRange: { start: number; end: number } | -1 = ((): { start: number; end: number } | -1 => {
            const doc: { childCount: number; content: { size: number }; child: (n: number) => PMNode } = pmState.doc;
            if (doc.childCount < 1) { return -1; }
            const last: PMNode = doc.child(doc.childCount - 1);
            if (last.type.name !== 'paragraph' || last.childCount !== 0) { return -1; }
            // The trailing empty paragraph occupies positions
            // [doc.content.size - last.nodeSize, doc.content.size).
            const endPos: number = doc.content.size;
            const startPos: number = endPos - last.nodeSize;
            const caret: number = pmState.selection.from;
            if (caret < startPos || caret > endPos) { return -1; }
            return { start: startPos, end: endPos };
        })();

        let tr: PMTransaction;
        if (isOnlyEmptyParagraph(pmState.doc)) {
            // Replace the empty paragraph with the Divider, then append the trailing paragraph.
            tr = pmState.tr.replaceWith(0, pmState.doc.content.size, horizontalRuleNode);
            appendTrailingParagraphIfFinal(tr, pmState.schema, 0);
            focusAfterBlock(tr, 0, 'trailing-paragraph');
        } else if (trailingParaRange !== -1) {
            // Replace the trailing empty paragraph with the Divider, then append and focus a fresh trailing paragraph.
            tr = pmState.tr.replaceWith(
                trailingParaRange.start,
                trailingParaRange.end,
                horizontalRuleNode
            );
            appendTrailingParagraphIfFinal(tr, pmState.schema, trailingParaRange.start);
            focusAfterBlock(tr, trailingParaRange.start, 'trailing-paragraph');
        } else {
            // Non-empty path: keep the existing insert behaviour.
            const { from } = pmState.selection;
            tr = pmState.tr.insert(from, horizontalRuleNode);
            // Helper is a no-op when the inserted node is not the last
            // top-level child — i.e. when another node already follows.
            const appended: boolean = appendTrailingParagraphIfFinal( tr, pmState.schema, from );
            if (appended) {
                focusAfterBlock( tr, from, 'trailing-paragraph' );
            }
        }
        ctx.dispatch(wrapTransaction(tr));
    }
};
