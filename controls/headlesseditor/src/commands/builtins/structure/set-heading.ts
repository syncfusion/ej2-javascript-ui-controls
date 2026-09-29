/**
 * set-heading.ts — Public facade: convert the current block to a heading.
 *
 * Delegates to PM `setBlockType` with the 'heading' node type, but layers
 * the new `level` attribute on top of the source block's existing
 * `align` / `indent` values so paragraph-format settings survive the
 * block-type transformation.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSetBlockType } from '../../../pm/pm-guard';
import { PMCommand, PMEditorState, PMTransaction, PMNodeType, PMNode } from '../../../pm/pm-guard';
import { preserveBlockFormat } from '../../common';

export interface SetHeadingPayload {
    level: number;
}

/**
 * Build the `attrs` function passed to `prosemirror-commands.setBlockType`.
 * The returned callback preserves the source block's `align` and `indent`
 * values and overlays the new `level` attribute.
 *
 * @param {SetHeadingPayload} payload - Heading attributes to apply.
 * @returns {Function} Callback that returns the new node attrs.
 */
function attrsProvider(payload: SetHeadingPayload): (oldNode: PMNode) => Record<string, unknown> {
    return (oldNode: PMNode): Record<string, unknown> =>
        preserveBlockFormat(oldNode, { level: payload.level });
}

export const setHeadingCommand: PMCommandInternal<SetHeadingPayload> = {
    name: 'setHeading',
    meta: { label: 'Heading', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: SetHeadingPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const headingType: PMNodeType = pmState.schema.nodes['heading'];
        if (!headingType) { return false; }
        const cmd: PMCommand = pmSetBlockType(headingType, attrsProvider(payload));
        return cmd(pmState);
    },

    execute(ctx: PMCommandContext, payload: SetHeadingPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const headingType: PMNodeType = pmState.schema.nodes['heading'];
        if (!headingType) { return; }

        const cmd: PMCommand = pmSetBlockType(headingType, attrsProvider(payload));
        cmd(pmState, (tr: PMTransaction) => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
