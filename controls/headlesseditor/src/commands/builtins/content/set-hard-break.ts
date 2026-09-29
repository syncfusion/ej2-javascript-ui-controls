/**
 * set-hard-break.ts — Insert a hard break (`<br>`) at the current selection.
 *
 * A hard break is an inline node that represents a line break. It is different
 * from splitting a block (which creates a new paragraph). Instead, it inserts
 * a semantic `<br>` node within the current block.
 *
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { PMEditorState, PMNode, PMNodeType, PMTransaction } from '../../../pm/pm-guard';

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

export const setHardBreakCommand: PMCommandInternal<void> = {
    name: 'setHardBreak',
    meta: { label: 'Hard Break', category: 'content' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const hardBreakType: PMNodeType | undefined = pmState.schema.nodes['hard_break'];
        if (!hardBreakType) { return false; }

        // Check if we're not in an isolating context
        const { $from } = pmState.selection;
        if ($from.parent.type.spec.isolating) {
            return false;
        }

        return true;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const hardBreakType: PMNodeType | undefined = pmState.schema.nodes['hard_break'];
        if (!hardBreakType) { return; }

        const { from } = pmState.selection;
        const hardBreakNode: PMNode = hardBreakType.create({ id: idGen.generate() });
        const tr: PMTransaction = pmState.tr.insert(from, hardBreakNode);
        ctx.dispatch(wrapTransaction(tr));
    }
};
