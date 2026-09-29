import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType } from '../../../pm/pm-guard';

export interface InputRuleTransformPayload {
    nodeType: string;
    attrs?: Record<string, unknown>;
    matchStart: number;
    matchEnd: number;
}

export const inputRuleTransformCommand: PMCommandInternal<InputRuleTransformPayload> = {
    name: 'inputRuleTransform',
    meta: { label: 'Apply Input Rule Text Block', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: InputRuleTransformPayload): boolean {
        return !!ctx.pmState.schema.nodes[payload.nodeType];
    },

    execute(ctx: PMCommandContext, payload: InputRuleTransformPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const nodeType: PMNodeType = pmState.schema.nodes[payload.nodeType];
        const tr: PMTransaction = pmState.tr;
        tr.delete(payload.matchStart, payload.matchEnd);
        tr.setBlockType(tr.selection.from, tr.selection.to, nodeType, payload.attrs);
        ctx.dispatch(wrapTransaction(tr));
    }
};
