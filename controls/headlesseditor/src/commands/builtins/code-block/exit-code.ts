/**
 * exit-code.ts — Public command for exiting a code block.
 *
 * The command preserves the existing exit behavior for all code-block exit
 * paths. Keyboard-specific trigger detection lives in the code-block
 * extension.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMEditorState,
    PMNode,
    PMNodeType,
    PMResolvedPos,
    PMSelection,
    PMTransaction,
    TextSelection
} from '../../../pm/pm-guard';

function findCodeBlockDepth($pos: PMResolvedPos): number {
    for (let d: number = $pos.depth; d >= 0; d--) {
        if ($pos.node(d).type.name === 'codeBlock') { return d; }
    }
    return -1;
}

export const exitCodeCommand: PMCommandInternal<void> = {
    name: 'exitCode',
    meta: { label: 'Exit Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        return ctx.pmState.selection.$from.parent.type.name === 'codeBlock';
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const $from: PMResolvedPos = pmState.selection.$from;

        if ($from.parent.type.name !== 'codeBlock') { return; }

        // ArrowUp at the document boundary exits above the code block.
        if ($from.parentOffset === 0 && $from.pos === 1) {
            const paragraphType: PMNodeType | undefined = pmState.schema.nodes['paragraph'];
            if (!paragraphType) { return; }
            const newParagraph: PMNode = paragraphType.createAndFill() as PMNode;
            let tr: PMTransaction = pmState.tr.insert(0, newParagraph);
            tr = tr.setSelection(TextSelection.create(tr.doc, 1, 1));
            ctx.dispatch(wrapTransaction(tr));
            return;
        }

        const depth: number = findCodeBlockDepth($from);
        if (depth === -1) { return; }

        const after: number | undefined = $from.after(depth);
        if (after === undefined) { return; }

        const nodeAfter: PMNode | null = pmState.doc.nodeAt(after);
        let tr: PMTransaction = pmState.tr;

        if (nodeAfter !== null) {
            tr = tr.setSelection(PMSelection.near(pmState.doc.resolve(after)));
        } else {
            const paragraphType: PMNodeType | undefined = pmState.schema.nodes['paragraph'];
            if (!paragraphType) { return; }
            const newParagraph: PMNode = paragraphType.createAndFill() as PMNode;
            tr = tr.insert(after, newParagraph);
            const targetPos: number = after + 1;
            const safePos: number = Math.min(targetPos, tr.doc.content.size);
            tr = tr.setSelection(TextSelection.create(tr.doc, safePos, safePos));
        }

        ctx.dispatch(wrapTransaction(tr));
    }
};
