/**
 * toggle-block-structure.ts — Internal infrastructure command for toggling
 * block wrappers (blockquote, callout).
 *
 * Uses `pmWrapIn` to wrap and `pmLift` to unwrap.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmWrapIn, pmLift } from '../../../pm/pm-guard';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { PMCommand, PMEditorState, PMTransaction, PMNodeType, PMSchema } from '../../../pm/pm-guard';

export interface ToggleBlockStructurePayload {
    blockType: 'blockquote' | 'callout';
    attrs?: Record<string, unknown>;
}

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

/**
 * Returns true when the selection's nearest ancestor matches the given block type.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @param {string} nodeTypeName - The block-type name to match.
 * @returns {boolean} True when the selection lives inside a node of that type.
 */
function isWrappedIn(pmState: PMEditorState, nodeTypeName: string): boolean {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === nodeTypeName) { return true; }
    }
    return false;
}

export const toggleBlockStructureCommand: PMCommandInternal<ToggleBlockStructurePayload> = {
    name: 'toggleBlockStructure',
    meta: { label: 'Toggle Block Structure', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ToggleBlockStructurePayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const nodeType: PMNodeType = schema.nodes[payload.blockType];
        if (!nodeType) { return false; }

        if (isWrappedIn(pmState, payload.blockType)) {
            return pmLift(pmState);
        }
        const cmd: PMCommand = pmWrapIn(nodeType, {
            ...(payload.attrs ?? {}),
            id: idGen.generate()
        } as Parameters<PMNodeType['create']>[0]);
        return cmd(pmState);
    },

    execute(ctx: PMCommandContext, payload: ToggleBlockStructurePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const nodeType: PMNodeType = schema.nodes[payload.blockType];
        if (!nodeType) { return; }

        if (isWrappedIn(pmState, payload.blockType)) {
            // Unwrap
            pmLift(pmState, (tr: PMTransaction): void => {
                ctx.dispatch(wrapTransaction(tr));
            });
            return;
        }

        // Wrap
        const cmd: PMCommand = pmWrapIn(nodeType, {
            ...(payload.attrs ?? {}),
            id: idGen.generate()
        } as Parameters<PMNodeType['create']>[0]);
        cmd(pmState, (tr: PMTransaction): void => {
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
