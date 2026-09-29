/**
 * set-code-block.ts — Public facade: convert the current block to a code block.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSetBlockType } from '../../../pm/pm-guard';
import { PMEditorState, PMTransaction, PMNodeType } from '../../../pm/pm-guard';

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
        const codeBlockType: PMNodeType = pmState.schema.nodes['codeBlock'];
        if (!codeBlockType) { return; }

        const attrs: { language?: string } | undefined = payload?.language
            ? { language: payload.language }
            : undefined;
        pmSetBlockType(codeBlockType, attrs)(pmState, (tr: PMTransaction) => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
