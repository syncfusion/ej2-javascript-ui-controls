import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode, NodeSelection } from '../../../pm/pm-guard';

/**
 * Data used to update the alignment of the selected image.
 */
export interface SetImageAlignPayload {
    // Target image alignment.
    align: 'left' | 'center' | 'right' | 'none';
}

/**
 * Updates the alignment of the selected image.
 */
export const setImageAlignCommand: PMCommandInternal<SetImageAlignPayload> = {
    name: 'setImageAlign',
    meta: { label: 'Set Image Align', category: 'media' },

    /**
     * Determines whether the image alignment can be updated.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageAlignPayload} _payload Image alignment payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, _payload: SetImageAlignPayload): boolean {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; node?: PMNode | null } = pmState.selection as { from: number; node?: PMNode | null };
        // Get the selected image node.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        // Ensure the selected node is an image.
        return !!selectedNode && (selectedNode.type.name === 'image' || selectedNode.type.name === 'imageInline');
    },

    /**
     * Updates the alignment of the selected image.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageAlignPayload} payload Image alignment payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: SetImageAlignPayload): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number } = pmState.selection as { from: number };
        // Get the selected image position.
        const targetPosition: number = selection.from;
        // Create a transaction for the update.
        let transaction: PMTransaction = pmState.tr;
        // Update the image alignment.
        transaction = transaction.setNodeAttribute(targetPosition, 'align', payload.align);
        // Clear text wrapping when alignment is applied.
        transaction = transaction.setNodeAttribute(targetPosition, 'wrap', 'none');
        // Keep the updated image selected.
        transaction.setSelection(NodeSelection.create(transaction.doc, targetPosition));
        // Apply the transaction.
        ctx.dispatch(wrapTransaction(transaction));
    }
};
