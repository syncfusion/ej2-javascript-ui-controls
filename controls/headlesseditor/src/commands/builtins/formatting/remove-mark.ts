/**
 * remove-mark.ts — Internal infrastructure command: remove a mark type
 * from the current selection.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMSchema, PMMarkType } from '../../../pm/pm-guard';

export interface RemoveMarkPayload {
    markType: string;
}

export const removeMarkCommand: PMCommandInternal<RemoveMarkPayload> = {
    name: 'removeMark',
    meta: { label: 'Remove Mark', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: RemoveMarkPayload): boolean {
        return ctx.pmState.schema.marks[payload.markType] !== undefined;
    },

    execute(ctx: PMCommandContext, payload: RemoveMarkPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType | undefined = schema.marks[payload.markType];
        if (!markType) { return; }

        const { from, to } = pmState.selection;
        const tr: PMTransaction = pmState.tr.removeMark(from, to, markType);
        ctx.dispatch(wrapTransaction(tr));
    }
};
