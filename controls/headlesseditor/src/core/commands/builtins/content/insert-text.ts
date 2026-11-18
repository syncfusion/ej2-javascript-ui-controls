/**
 * insert-text.ts — Internal command: insert a plain text string at the
 * current selection (or at an explicit position when `at` is given).
 *
 * Payload:
 *   text — the string to insert
 *   at   — optional { offset }; defaults to selection anchor
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction } from '../../../../pm/pm-guard';

export interface InsertTextPayload {
    text: string;
    at?: { offset: number };
}

export const insertTextCommand: PMCommandInternal<InsertTextPayload> = {
    name: 'insertText',
    meta: { label: 'Insert Text', category: 'content' },

    canExecute(ctx: PMCommandContext, payload: InsertTextPayload): boolean {
        if (!payload.text || payload.text.length === 0) { return false; }
        return ctx.editorState.isMounted || true;
    },

    execute(ctx: PMCommandContext, payload: InsertTextPayload): void {
        if (!payload.text || payload.text.length === 0) { return; }

        const pmState: PMEditorState = ctx.pmState;
        const tr: PMTransaction = pmState.tr;
        const pos: number = payload.at ? payload.at.offset : pmState.selection.from;
        tr.insertText(payload.text, pos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
