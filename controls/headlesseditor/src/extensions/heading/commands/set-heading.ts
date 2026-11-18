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
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmSetBlockType } from '../../../pm/pm-guard';
import { PMCommand, PMEditorState, PMTransaction, PMNodeType, PMNode } from '../../../pm/pm-guard';
import { preserveBlockFormat } from '../../../core/commands/common';

/**
 * Payload for the `setHeading` command.
 *
 * Converts the current paragraph or block element to a semantic heading at the specified level (1-6).
 * Preserves existing block-level formatting such as text alignment and indentation across the transformation.
 * If no block is selected or the selection spans multiple blocks, the command applies the heading level
 * to the block containing the selection anchor.
 *
 * @interface SetHeadingPayload
 *
 * @example
 * ```typescript
 * // Convert selection to heading level 1 (h1)
 * editor.commands.setHeading({ level: 1 });
 *
 * // Convert selection to heading level 3 (h3)
 * editor.commands.setHeading({ level: 3 });
 *
 * // Convert to heading level 2, preserving alignment
 * editor.commands.setHeading({ level: 2 });
 * ```
 */
export interface SetHeadingPayload {
    /**
     * The heading level to apply: 1 (h1), 2 (h2), 3 (h3), 4 (h4), 5 (h5), or 6 (h6).
     *
     * Determines the semantic heading rank in the resulting DOM. All values 1-6 map to standard HTML heading elements.
     *
     * @type {number}
     * @default 1
     */
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
