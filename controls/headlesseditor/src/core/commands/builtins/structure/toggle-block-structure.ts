/**
 * toggle-block-structure.ts — Internal infrastructure command for toggling
 * block wrappers (blockquote, callout).
 *
 * Uses `pmWrapIn` to wrap and `pmLift` to unwrap.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../../pm/adapters/editor-state-adapter';
import { pmWrapIn, pmLift } from '../../../../pm/pm-guard';
import { PMCommand, PMEditorState, PMTransaction, PMNode, PMNodeType, PMSchema } from '../../../../pm/pm-guard';
import { safeNodeAt } from '../../shared/safe-node-at';
import { appendTrailingParagraphIfFinal } from '../../../../extensions';

export interface ToggleBlockStructurePayload {
    blockType: 'blockquote' | 'callout';
    attrs?: Record<string, unknown>;
}

function findWrappedNode(pmState: PMEditorState, nodeTypeName: string): { pos: number; node: PMNode } | null {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === nodeTypeName) {
            const pos: number = $from.before(d);
            const node: PMNode | null = safeNodeAt(pmState.doc, pos) as PMNode | null;
            return node ? { pos, node } : null;
        }
    }
    return null;
}

export const toggleBlockStructureCommand: PMCommandInternal<ToggleBlockStructurePayload> = {
    name: 'toggleBlockStructure',
    meta: { label: 'Toggle Block Structure', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ToggleBlockStructurePayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const nodeType: PMNodeType = schema.nodes[payload.blockType];
        if (!nodeType) { return false; }

        const wrapped: { pos: number; node: PMNode } | null = findWrappedNode(pmState, payload.blockType);
        if (wrapped && payload.blockType === 'callout' &&
            wrapped.node.attrs['variant'] !== (payload.attrs['variant'])) {
            return true;
        }
        if (wrapped) {
            return pmLift(pmState);
        }
        const cmd: PMCommand = pmWrapIn(nodeType, {
            ...(payload.attrs ?? {})
        } as Parameters<PMNodeType['create']>[0]);
        return cmd(pmState);
    },

    execute(ctx: PMCommandContext, payload: ToggleBlockStructurePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const nodeType: PMNodeType = schema.nodes[payload.blockType];
        if (!nodeType) { return; }

        const wrapped: { pos: number; node: PMNode } | null = findWrappedNode(pmState, payload.blockType);
        if (wrapped && payload.blockType === 'callout' &&
            wrapped.node.attrs['variant'] !== (payload.attrs['variant'])) {
            const tr: PMTransaction = pmState.tr.setNodeMarkup(wrapped.pos, nodeType, {
                ...wrapped.node.attrs,
                ...(payload.attrs ?? {})
            });
            ctx.dispatch(wrapTransaction(tr));
            return;
        }
        if (wrapped) {
            pmLift(pmState, (tr: PMTransaction): void => {
                ctx.dispatch(wrapTransaction(tr));
            });
            return;
        }

        const cmd: PMCommand = pmWrapIn(nodeType, {
            ...(payload.attrs ?? {})
        } as Parameters<PMNodeType['create']>[0]);
        cmd(pmState, (tr: PMTransaction): void => {
            // If the wrapped block is the final top-level child, append a trailing paragraph.
            // Do not override focus; pmWrapIn already maps the selection into the wrapped block.
            const last: PMNode = tr.doc.child(tr.doc.childCount - 1);
            if (last && last.type === nodeType) {
                const lastPos: number = tr.doc.content.size - last.nodeSize;
                appendTrailingParagraphIfFinal(tr, pmState.schema, lastPos);
            }
            ctx.dispatch(wrapTransaction(tr));
        });
    }
};
