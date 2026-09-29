/**
 * toggle-code-block.ts — Public facade: toggle the current block between
 * a paragraph and a code block.
 *
 * Delegates to `setCodeBlock` for the wrap direction and to
 * `setParagraph` for the unwrap direction.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { setCodeBlockCommand, SetCodeBlockPayload } from './set-code-block';
import { setParagraphCommand } from './set-paragraph';
import { PMEditorState, PMNode, PMNodeType } from '../../../pm/pm-guard';

export type ToggleCodeBlockPayload = SetCodeBlockPayload;

function isInsideCodeBlock(pmState: PMEditorState): boolean {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d > 0; d--) {
        const ancestor: PMNode = $from.node(d);
        if (ancestor.type.name === 'codeBlock') { return true; }
    }
    const codeBlockType: PMNodeType | undefined = pmState.schema.nodes['codeBlock'];
    return codeBlockType ? $from.parent.type === codeBlockType : false;
}

export const toggleCodeBlockCommand: PMCommandInternal<ToggleCodeBlockPayload> = {
    name: 'toggleCodeBlock',
    meta: { label: 'Toggle Code Block', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ToggleCodeBlockPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        if (isInsideCodeBlock(pmState)) {
            return setParagraphCommand.canExecute?.(ctx) ?? false;
        }
        return setCodeBlockCommand.canExecute?.(ctx, payload ?? {}) ?? false;
    },

    execute(ctx: PMCommandContext, payload: ToggleCodeBlockPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        if (isInsideCodeBlock(pmState)) {
            setParagraphCommand.execute(ctx);
            return;
        }
        setCodeBlockCommand.execute(ctx, payload ?? {});
    }
};
