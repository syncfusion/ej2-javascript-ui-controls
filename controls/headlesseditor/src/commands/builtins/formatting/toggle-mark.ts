/**
 * toggle-mark.ts — Internal infrastructure command for toggling inline marks.
 *
 * This is NOT in typed-surface.d.ts. Public facades (toggle-bold, etc.)
 * delegate to this command with a fixed markType.
 *
 * Uses ProseMirror's `removeWhenPresent: false` ("all" semantics) for
 * range selections: the mark is only removed when EVERY node in the
 * selection already carries it. On a partially formatted ("mixed")
 * selection the command instead applies the mark across the whole
 * range, so toggling Bold over a paragraph that is half bold makes
 * the entire paragraph bold. The default "some" semantics would
 * strip the existing formatting instead — the exact defect this
 * prevents.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmToggleMark } from '../../../pm/pm-guard';
import { PMCommand, PMEditorState, PMTransaction, PMMarkType, PMSchema } from '../../../pm/pm-guard';

export interface ToggleMarkPayload {
    markType: string;
    attrs?: Record<string, unknown>;
}

/**
 * Options passed to ProseMirror's toggleMark for every toggle facade.
 * `removeWhenPresent: false` is the "all" toggle described above.
 */
const TOGGLE_OPTIONS: { removeWhenPresent: false } = { removeWhenPresent: false };

export const toggleMarkCommand: PMCommandInternal<ToggleMarkPayload> = {
    name: 'toggleMark',
    meta: { label: 'Toggle Mark', category: 'formatting' },

    canExecute(ctx: PMCommandContext, payload: ToggleMarkPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType = schema.marks[payload.markType];
        if (!markType) { return false; }
        const markAttrs: Record<string, unknown> | undefined = payload.attrs;
        const cmd: PMCommand = pmToggleMark(markType, markAttrs, TOGGLE_OPTIONS);
        return cmd(pmState);
    },

    execute(ctx: PMCommandContext, payload: ToggleMarkPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const markType: PMMarkType = schema.marks[payload.markType];
        if (!markType) { return; }

        const markAttrs: Record<string, unknown> | undefined = payload.attrs;
        const cmd: PMCommand = pmToggleMark(markType, markAttrs, TOGGLE_OPTIONS);
        cmd(pmState, (tr: PMTransaction) => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
