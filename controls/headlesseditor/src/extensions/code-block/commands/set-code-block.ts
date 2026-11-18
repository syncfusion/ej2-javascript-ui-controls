/**
 * set-code-block.ts — Public facade: convert the current block to a code block.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, PMNode, pmSetBlockType } from '../../../pm/pm-guard';
import { appendTrailingParagraphIfFinal, focusAfterBlock } from '../../common';

export interface SetCodeBlockPayload {
    language?: string;
}

export const setCodeBlockCommand: PMCommandInternal<SetCodeBlockPayload> = {
    name: 'setCodeBlock',
    meta: { label: 'Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: SetCodeBlockPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return false; }
        const attrs: { language?: string } | undefined = payload?.language
            ? { language: payload.language }
            : undefined;
        return pmSetBlockType(codeBlockType, attrs)(pmState);
    },

    execute(ctx: PMCommandContext, payload: SetCodeBlockPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return; }

        const attrs: { language?: string } | undefined = payload?.language
            ? { language: payload.language }
            : undefined;
        const originalSelectionEmpty: boolean = pmState.selection.empty;
        pmSetBlockType(codeBlockType, attrs)(pmState, (tr: PMTransaction) => {
            const last: PMNode | undefined = tr.doc.child(tr.doc.childCount - 1)
                ?? undefined;
            if (last && last.type === codeBlockType) {
                const lastPos: number = tr.doc.content.size - last.nodeSize;
                appendTrailingParagraphIfFinal(tr, pmState.schema, lastPos);
                // Only override the focus when the user's original selection was collapsed.
                if (originalSelectionEmpty) {
                    focusAfterBlock(tr, lastPos, 'block-deep-first-text-pos');
                }
            }
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
