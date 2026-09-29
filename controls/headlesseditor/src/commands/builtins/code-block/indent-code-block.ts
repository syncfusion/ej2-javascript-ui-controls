/**
 * indent-code-block.ts — Internal command: insert `tabSize` spaces at the
 * start of the current line (empty selection) OR prefix every line in a
 * non-empty range with `tabSize` spaces.
 *
 * Mirrors the Tab handler in `@tiptap/extension-code-block`. The `tabSize`
 * value is provided in the payload so the keyboard handler can pass the
 * extension's resolved option (consumers can configure `tabSize` per
 * instance).
 *
 * Gating (canExecute): the immediate parent must be a `codeBlock`. This
 * matches Tiptap: `$from.parent.type !== this.type` → return false.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMEditorState,
    PMNodeType,
    PMTransaction
} from '../../../pm/pm-guard';

export interface IndentCodeBlockPayload {
    /** Number of spaces to insert at the line start(s). */
    tabSize?: number;
}

function resolveCodeBlockType(pmState: PMEditorState): PMNodeType | undefined {
    return pmState.schema.nodes['codeBlock'];
}

export const indentCodeBlockCommand: PMCommandInternal<IndentCodeBlockPayload> = {
    name: 'indentCodeBlock',
    meta: { label: 'Indent Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload?: IndentCodeBlockPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = resolveCodeBlockType(pmState);
        if (!codeBlockType) { return false; }
        if (pmState.selection.$from.parent.type !== codeBlockType) { return false; }
        const tabSize: number = payload?.tabSize ?? 4;
        return tabSize > 0;
    },

    execute(ctx: PMCommandContext, payload?: IndentCodeBlockPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = resolveCodeBlockType(pmState);
        if (!codeBlockType) { return; }
        if (pmState.selection.$from.parent.type !== codeBlockType) { return; }

        const tabSize: number = payload?.tabSize ?? 4;
        if (tabSize <= 0) { return; }

        const indent: string = ' '.repeat(tabSize);
        const { selection } = pmState;
        const { $from, empty } = selection;

        if (empty) {
            // Empty selection: insert `indent` at the cursor position.
            // Use `state.schema.text(indent)` so the inserted run is a
            // valid text node (not a generic string).
            const tr: PMTransaction = pmState.tr.insert(
                $from.pos,
                pmState.schema.text(indent)
            );
            ctx.dispatch(wrapTransaction(tr));
            return;
        }

        // Non-empty selection: prefix every line in [from, to] with
        // `indent`. PM's `textBetween(..., '\n', '\n')` already splits
        // on hard breaks.
        const { from, to } = selection;
        const text: string = pmState.doc.textBetween(from, to, '\n', '\n');
        const lines: string[] = text.split('\n');
        const indented: string = lines.map((line: string): string => indent + line).join('\n');
        const tr: PMTransaction = pmState.tr.replaceWith(
            from,
            to,
            pmState.schema.text(indented)
        );
        ctx.dispatch(wrapTransaction(tr));
    }
};
