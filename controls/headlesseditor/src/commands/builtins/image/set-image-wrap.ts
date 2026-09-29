import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode, NodeSelection } from '../../../pm/pm-guard';

/**
 * Data used to update the text wrapping of the selected image.
 */
export interface SetImageWrapPayload {
    // Target text wrapping mode.
    wrap: 'left' | 'right' | 'none';
}

// Supported image node types.
const VALID_IMAGE_NODES: readonly string[] = ['image', 'imageInline'];

/**
 * Updates the text wrapping of the selected image.
 */
export const setImageWrapCommand: PMCommandInternal<SetImageWrapPayload> = {
    name: 'setImageWrap',
    meta: { label: 'Set Image Wrap', category: 'media' },

    /**
     * Determines whether image text wrapping can be updated.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageWrapPayload} _payload Image wrap payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, _payload: SetImageWrapPayload): boolean {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; node?: PMNode | null } = pmState.selection as { from: number; node?: PMNode | null };
        // Get the selected image node.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        // Ensure the selected node is an image.
        return !!selectedNode && VALID_IMAGE_NODES.indexOf(selectedNode.type.name) !== -1;
    },

    /**
     * Updates the text wrapping of the selected image.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageWrapPayload} payload Image wrap payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: SetImageWrapPayload): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number } = pmState.selection as { from: number };
        // Get the selected image position.
        const targetPosition: number = selection.from;
        // Create a transaction for the update.
        let transaction: PMTransaction = pmState.tr;
        // Update the image text wrapping.
        transaction = transaction.setNodeAttribute(targetPosition, 'wrap', payload.wrap);
        // Clear image alignment when floating is enabled.
        if (payload.wrap !== 'none') {
            transaction = transaction.setNodeAttribute(targetPosition, 'align', 'none');
        }
        // Keep the updated image selected.
        transaction.setSelection(NodeSelection.create(transaction.doc, targetPosition));
        // Apply the transaction.
        ctx.dispatch(wrapTransaction(transaction));
    }
};
