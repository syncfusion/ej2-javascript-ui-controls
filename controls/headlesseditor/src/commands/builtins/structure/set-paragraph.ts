/**
 * set-paragraph.ts — Public facade: convert the current block to a paragraph.
 *
 * Preserves the source block's `align` / `indent` attributes so converting
 * a heading (or any other alignable block) back to a paragraph does not
 * silently strip its formatting.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSetBlockType } from '../../../pm/pm-guard';
import { PMNodeType, PMEditorState, PMTransaction, PMNode, PMCommand } from '../../../pm/pm-guard';
import { preserveBlockFormat } from '../../common';

export const setParagraphCommand: PMCommandInternal<void> = {
    name: 'setParagraph',
    meta: { label: 'Paragraph', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const paraType: PMNodeType = pmState.schema.nodes['paragraph'];
        if (!paraType) { return false; }
        return pmSetBlockType(paraType, (oldNode: PMNode) => preserveBlockFormat(oldNode, undefined))(pmState);
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const paraType: PMNodeType = pmState.schema.nodes['paragraph'];
        if (!paraType) { return; }

        const cmd: PMCommand = pmSetBlockType(
            paraType,
            (oldNode: PMNode) => preserveBlockFormat(oldNode, undefined)
        );
        cmd(pmState, (tr: PMTransaction): void => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
