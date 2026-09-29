import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction, NodeSelection } from '../../../pm/pm-guard';

// Supported image node types.
const IMAGE_NODE_NAMES: readonly string[] = ['image', 'imageInline'];

/**
 * Removes the currently selected image.
 */
export const removeImageCommand: PMCommandInternal<void> = {
    name: 'removeImage',
    meta: { label: 'Remove Image', category: 'media' },

    /**
     * Determines whether the image can be removed.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext): boolean {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; to: number; node?: PMNode | null } =
            pmState.selection as { from: number; to: number; node?: PMNode | null };
        // Get the selected image node or the node at the cursor position.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        // Validate that the selected node is an image.
        return !!selectedNode && IMAGE_NODE_NAMES.indexOf(selectedNode.type.name) !== -1;
    },

    /**
     * Removes the selected image.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @returns {void}
     */
    execute(ctx: PMCommandContext): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; to: number; node?: PMNode | null } =
            pmState.selection as { from: number; to: number; node?: PMNode | null };
        // Get the selected image node or the node at the cursor position.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        // Create a transaction that selects the image node.
        const transaction: PMTransaction = pmState.tr.setSelection(
            NodeSelection.create(pmState.doc, selection.from)
        );
        // Remove the selected image node.
        transaction.delete(selection.from, selection.from + selectedNode.nodeSize);
        // Apply the transaction.
        ctx.dispatch(wrapTransaction(transaction));
    }
};
