import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMMarkType, PMSchema } from '../../../pm/pm-guard';
export interface InputRuleMarkPayload {
    markType: string;
    text: string;
    matchStart: number;
    matchEnd: number;
    attrs?: Record<string, unknown>;
}

export const inputRuleMarkCommand: PMCommandInternal<InputRuleMarkPayload> = {
    name: 'inputRuleMark',
    meta: { label: 'Apply Input Rule Mark', category: 'formatting' },
    canExecute(ctx: PMCommandContext, payload: InputRuleMarkPayload): boolean {
        const schema: PMSchema = ctx.pmState.schema;
        return !!schema.marks[
            payload.markType
        ];
    },

    execute(ctx: PMCommandContext, payload: InputRuleMarkPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const markType: PMMarkType = pmState.schema.marks[payload.markType];
        if (!markType) {
            return;
        }
        const tr: PMTransaction = pmState.tr;
        tr.insertText(payload.text, payload.matchStart, payload.matchEnd);
        tr.addMark(
            payload.matchStart,
            payload.matchStart + payload.text.length,
            markType.create(payload.attrs)
        );
        tr.removeStoredMark(markType);
        ctx.dispatch(wrapTransaction(tr));
    }
};
