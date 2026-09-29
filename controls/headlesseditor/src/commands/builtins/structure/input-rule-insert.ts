import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMNodeType, PMEditorState, PMTransaction } from '../../../pm/pm-guard';

export interface InputRuleInsertPayload {
    nodeType: string;
    attrs?: Record<string, unknown>;
    matchStart: number;
    matchEnd: number;
}

export const inputRuleInsertCommand: PMCommandInternal<InputRuleInsertPayload> = {
    name: 'inputRuleInsert',
    meta: { label: 'Apply Input Rule Node', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: InputRuleInsertPayload): boolean {
        return !!ctx.pmState.schema.nodes[payload.nodeType];
    },

    execute(ctx: PMCommandContext, payload: InputRuleInsertPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const nodeType: PMNodeType = pmState.schema.nodes[payload.nodeType];
        const tr: PMTransaction = pmState.tr;
        tr.delete(payload.matchStart, payload.matchEnd);
        if (payload.nodeType === 'codeBlock') {
            // Code blocks are text blocks. Transform the current block so the
            // input rule does not insert a second block or move the cursor to
            // a following node.
            tr.setBlockType(tr.selection.from, tr.selection.to, nodeType, payload.attrs);
        } else {
            tr.replaceSelectionWith(nodeType.create(payload.attrs));
        }
        ctx.dispatch(wrapTransaction(tr));
    }
};
