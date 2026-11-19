/**
 * replace-text.ts — Internal command: replace text in a range with new text.
 *
 * Payload:
 *   from — { offset }
 *   to   — { offset }
 *   text — replacement string
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';

export interface ReplaceTextPayload {
    from: { offset: number };
    to: { offset: number };
    text: string;
}

export const replaceTextCommand: PMCommandInternal<ReplaceTextPayload> = {
    name: 'replaceText',
    meta: { label: 'Replace Text', category: 'content' },

    canExecute(): boolean {
        return true;
    },

    execute(ctx: PMCommandContext, payload: ReplaceTextPayload): void {
        const pmState: PMEditorState = ctx.pmState;

        const fromPos: number = payload.from.offset;
        const toPos: number = payload.to.offset;

        if (fromPos > toPos) { return; }

        const tr: PMTransaction = pmState.tr.insertText(payload.text, fromPos, toPos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
