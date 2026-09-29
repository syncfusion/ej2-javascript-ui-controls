/**
 * insert-text.ts — Internal command: insert a plain text string at the
 * current selection (or at an explicit position when `at` is given).
 *
 * Payload:
 *   text — the string to insert
 *   at   — optional { nodeId, offset }; defaults to selection anchor
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PositionAdapter } from '../../../pm/adapters/position-adapter';
import { PMEditorState, PMTransaction } from '../../../pm/pm-guard';
import { InternalPosition } from '../../../pm/types/internal-position';

export interface InsertTextPayload {
    text: string;
    at?: { nodeId: string; offset: number };
}

export const insertTextCommand: PMCommandInternal<InsertTextPayload> = {
    name: 'insertText',
    meta: { label: 'Insert Text', category: 'content' },

    canExecute(ctx: PMCommandContext, payload: InsertTextPayload): boolean {
        if (!payload.text || payload.text.length === 0) { return false; }
        return ctx.editorState.isMounted || true; // always executable when text provided
    },

    execute(ctx: PMCommandContext, payload: InsertTextPayload): void {
        if (!payload.text || payload.text.length === 0) { return; }

        const pmState: PMEditorState = ctx.pmState;
        const tr: PMTransaction = pmState.tr;

        let pos: number;
        if (payload.at) {
            const pa: PositionAdapter = new PositionAdapter();
            try {
                const internal: InternalPosition = pa.toPMPosition(
                    { nodeId: payload.at.nodeId, offset: payload.at.offset },
                    pmState.doc
                );
                pos = internal.pmPos;
            } catch {
                return;
            }
        } else {
            pos = pmState.selection.from;
        }

        tr.insertText(payload.text, pos);
        ctx.dispatch(wrapTransaction(tr));
    }
};
