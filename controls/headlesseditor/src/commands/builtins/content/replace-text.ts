/**
 * replace-text.ts — Internal command: replace text in a range with new text.
 *
 * Payload:
 *   from — { nodeId, offset }
 *   to   — { nodeId, offset }
 *   text — replacement string
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PositionAdapter } from '../../../pm/adapters/position-adapter';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export interface ReplaceTextPayload {
    from: { nodeId: string; offset: number };
    to: { nodeId: string; offset: number };
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
        const pa: PositionAdapter = new PositionAdapter();

        let fromPos: number;
        let toPos: number;
        try {
            fromPos = pa.toPMPosition(
                { nodeId: payload.from.nodeId, offset: payload.from.offset },
                pmState.doc
            ).pmPos;
            toPos = pa.toPMPosition(
                { nodeId: payload.to.nodeId, offset: payload.to.offset },
                pmState.doc
            ).pmPos;
        } catch {
            return;
        }

        if (fromPos > toPos) { return; }

        const tr: PMTransaction = pmState.tr.insertText(payload.text, fromPos, toPos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
