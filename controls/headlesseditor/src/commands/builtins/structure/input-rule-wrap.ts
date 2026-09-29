import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, findWrapping, canJoin , PMNode, PMNodeRange, PMResolvedPos } from '../../../pm/pm-guard';

export interface InputRuleWrapPayload {
    nodeType: string;
    attrs?: Record<string, unknown>;
    matchStart: number;
    matchEnd: number;
}

export const inputRuleWrapCommand: PMCommandInternal<InputRuleWrapPayload> = {
    name: 'inputRuleWrap',
    meta: { label: 'Apply Input Rule Wrapping', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: InputRuleWrapPayload): boolean {
        return !!ctx.pmState.schema.nodes[payload.nodeType];
    },

    execute(ctx: PMCommandContext, payload: InputRuleWrapPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const nodeType: PMNodeType = pmState.schema.nodes[payload.nodeType];
        if (!nodeType) {
            return;
        }
        const tr: PMTransaction = pmState.tr;
        // Remove markdown trigger
        tr.delete(payload.matchStart, payload.matchEnd);
        // Recompute against updated document
        const $start: PMResolvedPos = tr.doc.resolve(payload.matchStart);
        const blockRange: PMNodeRange = $start.blockRange();
        if (!blockRange) {
            return;
        }
        const wrapping: readonly {
            type: PMNodeType;
            attrs?: Record<string, unknown>;
        }[] | null = findWrapping(blockRange, nodeType, payload.attrs);
        if (!wrapping) {
            return;
        }
        tr.wrap(
            blockRange,
            wrapping
        );
        if (payload.nodeType === 'taskList' && payload.attrs?.checked === true) {
            tr.doc.descendants((node: PMNode, pos: number) => {
                if (node.type.name === 'taskItem') {
                    tr.setNodeMarkup(
                        pos,
                        undefined,
                        { ...node.attrs, checked: true }
                    );
                    return false;
                }
                return true;
            });
        }
        // Preserve old join behavior
        const joinPos: number = payload.matchStart - 1;
        if (joinPos > 0 && canJoin(tr.doc, joinPos)) {
            const before: PMNode = tr.doc.resolve(joinPos).nodeBefore;
            if (before && before.type === nodeType) {
                tr.join(joinPos);
            }
        }
        ctx.dispatch(wrapTransaction(tr));
    }
};
