/**
 * outdent-code-block.ts — Internal command: strip up to `tabSize` leading
 * spaces from the start of the current line (empty selection) OR from the
 * start of every line in a non-empty range.
 *
 * Mirrors the Shift-Tab handler in `@tiptap/extension-code-block`. When a
 * line has fewer than `tabSize` leading spaces, ALL leading spaces are
 * removed (we never leave a partially-dedented line).
 *
 * Gating (canExecute): the immediate parent must be a `codeBlock`.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMEditorState,
    PMNodeType,
    PMTransaction,
    TextSelection
} from '../../../pm/pm-guard';

export interface OutdentCodeBlockPayload {
    /** Number of spaces to remove (capped per line). */
    tabSize?: number;
}

function resolveCodeBlockType(pmState: PMEditorState): PMNodeType | undefined {
    return pmState.schema.nodes['codeBlock'];
}

function countLeadingSpaces(line: string): number {
    const match: RegExpMatchArray | null = /^ */.exec(line);
    return match ? match[0].length : 0;
}

export const outdentCodeBlockCommand: PMCommandInternal<OutdentCodeBlockPayload> = {
    name: 'outdentCodeBlock',
    meta: { label: 'Outdent Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload?: OutdentCodeBlockPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = resolveCodeBlockType(pmState);
        if (!codeBlockType) { return false; }
        if (pmState.selection.$from.parent.type !== codeBlockType) { return false; }
        const tabSize: number = payload?.tabSize ?? 4;
        return tabSize > 0;
    },

    execute(ctx: PMCommandContext, payload?: OutdentCodeBlockPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const codeBlockType: PMNodeType | undefined = resolveCodeBlockType(pmState);
        if (!codeBlockType) { return; }
        if (pmState.selection.$from.parent.type !== codeBlockType) { return; }

        const tabSize: number = payload?.tabSize ?? 4;
        if (tabSize <= 0) { return; }

        const { selection } = pmState;
        const { $from, empty } = selection;

        if (empty) {
            // Reverse Tab at the cursor first. Tab inserts spaces at the
            // cursor, so Shift-Tab must remove that run even in the middle
            // or at the end of a line.
            const cursorOffset: number = $from.parentOffset;
            const textBeforeCursor: string = $from.parent.textContent.slice(0, cursorOffset);
            const lastLine: string = textBeforeCursor.split('\n').pop() ?? '';
            const trailingSpaces: number = countLeadingSpaces(
                lastLine.split('').reverse().join('')
            );
            const spacesBeforeCursor: number = Math.min(trailingSpaces, tabSize);

            if (spacesBeforeCursor > 0) {
                const deleteFrom: number = $from.pos - spacesBeforeCursor;
                const tr: PMTransaction = pmState.tr.delete(deleteFrom, $from.pos);
                tr.setSelection(TextSelection.create(tr.doc, deleteFrom, deleteFrom));
                ctx.dispatch(wrapTransaction(tr));
                return;
            }

            // If the cursor is in the code, fall back to removing indentation
            // from the start of the current line.
            const lineStartOffset: number = $from.parent.textContent.lastIndexOf(
                '\n',
                $from.parentOffset - 1
            ) + 1;
            const currentLine: string = $from.parent.textContent.slice(
                lineStartOffset,
                $from.parentOffset
            );
            const leadingSpaces: number = countLeadingSpaces(currentLine);
            const spacesToRemove: number = Math.min(leadingSpaces, tabSize);

            let tr: PMTransaction = pmState.tr;
            if (spacesToRemove > 0) {
                const lineStartPos: number = $from.start() + lineStartOffset;
                tr = tr.delete(lineStartPos, lineStartPos + spacesToRemove);

                const cursorPosInLine: number = $from.parentOffset - lineStartOffset;
                if (cursorPosInLine <= spacesToRemove) {
                    tr = tr.setSelection(
                        TextSelection.create(tr.doc, lineStartPos, lineStartPos)
                    );
                }
            }
            ctx.dispatch(wrapTransaction(tr));
            return;
        }

        // Non-empty selection: dedent every line in [from, to].
        const { from, to } = selection;
        const text: string = pmState.doc.textBetween(from, to, '\n', '\n');
        const lines: string[] = text.split('\n');
        const dedented: string = lines
            .map((line: string): string => {
                const leading: number = countLeadingSpaces(line);
                const toRemove: number = Math.min(leading, tabSize);
                return line.slice(toRemove);
            })
            .join('\n');
        const tr: PMTransaction = pmState.tr.replaceWith(
            from,
            to,
            pmState.schema.text(dedented)
        );
        ctx.dispatch(wrapTransaction(tr));
    }
};
