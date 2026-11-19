import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction, NodeSelection, TextSelection } from '../../../pm/pm-guard';
import { convertToBlock } from './set-image-display';

/**
 * Payload for caption commands.
 */
export interface CaptionPayload {
    caption?: string;
}

/**
 * Returns the selected image and its document position.
 *
 * @param {PMEditorState} state Current editor state.
 * @returns {{node: PMNode, position: number} | null} Selected image or null.
 */
function getSelectedImage(state: PMEditorState): { node: PMNode; position: number } | null {
    const selection: { from: number; node?: PMNode | null } = state.selection as { from: number; node?: PMNode | null };
    const node: PMNode | null = selection.node ?? state.doc.nodeAt(selection.from);
    return node && (node.type.name === 'image' || node.type.name === 'imageInline')
        ? { node, position: selection.from }
        : null;
}

/**
 * Returns the selected block image and its document position.
 *
 * @param {PMEditorState} state Current editor state.
 * @returns {{node: PMNode, position: number} | null} Selected block image or null.
 */
function getSelectedBlockImage(state: PMEditorState): { node: PMNode; position: number } | null {
    const selected: { node: PMNode; position: number } | null = getSelectedImage(state);
    return selected?.node.type.name === 'image' ? selected : null;
}

/**
 * Returns whether the image already has caption content.
 *
 * @param {{node: PMNode}} selected Selected image.
 * @param {PMNode} selected.node Selected image node.
 * @returns {boolean} Whether caption content exists.
 */
function hasCaption(selected: { node: PMNode }): boolean {
    return selected.node.attrs['caption'] === true || selected.node.content.size > 0;
}

/**
 * Updates the caption for the selected image.
 *
 * @param {PMCommandContext} ctx Command context.
 * @param {string} caption Caption text.
 * @param {boolean} captionState Whether the caption attribute is enabled.
 * @param {{node: PMNode, position: number}} [selected] Selected block image.
 * @param {PMNode} [selected.node] Selected block image node.
 * @param {number} [selected.position] Selected block image position.
 * @returns {void}
 */
function updateCaption(ctx: PMCommandContext, caption: string, captionState: boolean,
                       selected?: { node: PMNode; position: number }): void {
    // Get the currently selected image and its position.
    const selectedImage: { node: PMNode; position: number } | null = selected ?? getSelectedBlockImage(ctx.pmState);
    // Exit if no image is selected.
    if (!selectedImage) {
        return;
    }
    const transaction: PMTransaction = ctx.pmState.tr;
    const contentStart: number = selectedImage.position + 1;
    transaction.delete(contentStart, contentStart + selectedImage.node.content.size);
    if (caption.length > 0) {
        transaction.insertText(caption, contentStart);
    }
    transaction.setNodeMarkup(selectedImage.position, selectedImage.node.type, {
        ...selectedImage.node.attrs,
        caption: captionState
    });
    // Place the cursor at the end of the caption text.
    if (caption.length > 0) {
        transaction.setSelection(TextSelection.create(transaction.doc, contentStart + caption.length, contentStart + caption.length));
    } else {
        // Select the image node when no caption exists.
        transaction.setSelection(NodeSelection.create(transaction.doc, selectedImage.position));
    }
    // Apply the transaction to the editor.
    ctx.dispatch(wrapTransaction(transaction));
}

/**
 * Command to add a caption to the selected image.
 */
export const addCaptionCommand: PMCommandInternal<CaptionPayload> = {
    name: 'addCaption',
    meta: { label: 'Add Caption', category: 'media', focusAfterDispatch: true },

    /**
     * Checks whether a caption can be added to the selected image.
     *
     * @param {PMCommandContext} ctx Command context.
     * @returns {boolean} True if the selected image does not already have a caption.
     */
    canExecute(ctx: PMCommandContext): boolean {
        // Get the currently selected image.
        const selected: { node: PMNode; position: number } | null = getSelectedImage(ctx.pmState);
        // Allow execution only when an image is selected and has no caption.
        return !!selected && !hasCaption(selected);
    },
    /**
     * Adds a caption to the selected image.
     *
     * @param {PMCommandContext} ctx Command context.
     * @param {CaptionPayload} [payload={}] Caption payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: CaptionPayload = {}): void {
        const selected: { node: PMNode; position: number } | null = getSelectedImage(ctx.pmState);
        if (!selected) {
            return;
        }
        if (selected.node.type.name === 'imageInline') {
            const transaction: PMTransaction = ctx.pmState.tr;
            const blockPosition: number = convertToBlock(
                transaction,
                selected.position,
                selected.node,
                { ...selected.node.attrs },
                transaction.doc.resolve(selected.position)
            );
            const blockNode: PMNode | null = transaction.doc.nodeAt(blockPosition);
            if (!blockNode) {
                return;
            }
            const caption: string = payload.caption?.trim() || 'Insert caption';
            const contentStart: number = blockPosition + 1;
            transaction.insertText(caption, contentStart);
            transaction.setNodeMarkup(blockPosition, blockNode.type, {
                ...blockNode.attrs,
                caption: true
            });
            transaction.setSelection(TextSelection.create(transaction.doc, contentStart + caption.length, contentStart + caption.length));
            ctx.dispatch(wrapTransaction(transaction));
            return;
        }
        updateCaption(ctx, payload.caption?.trim() || 'Insert caption', true, selected);
    }
};

/**
 * Command to remove the caption from the selected image.
 */
export const removeCaptionCommand: PMCommandInternal<void> = {
    name: 'removeCaption',
    meta: { label: 'Remove Caption', category: 'media' },

    /**
     * Checks whether the selected image has a caption.
     *
     * @param {PMCommandContext} ctx Command context.
     * @returns {boolean} True if the selected image contains a caption.
     */
    canExecute(ctx: PMCommandContext): boolean {
        // Get the currently selected image.
        const selected: { node: PMNode; position: number } | null = getSelectedBlockImage(ctx.pmState);
        // Allow execution only when the image has a caption.
        return !!selected && hasCaption(selected);
    },
    /**
     * Executes the command to remove the caption from the selected image.
     *
     * @param {PMCommandContext} ctx Command context.
     * @returns {void}
     */
    execute(ctx: PMCommandContext): void {
        // Clear the caption content and disable the caption state.
        updateCaption(ctx, '', false);
    }
};

/**
 * Command to add or remove a caption from the selected image.
 */
export const toggleCaptionCommand: PMCommandInternal<CaptionPayload> = {
    name: 'toggleCaption',
    meta: { label: 'Toggle Caption', category: 'media', focusAfterDispatch: true },
    /**
     * Checks whether an image is currently selected.
     *
     * @param {PMCommandContext} ctx Command context.
     * @returns {boolean} True if a block image is selected; otherwise, false.
     */
    canExecute(ctx: PMCommandContext): boolean {
        return !!getSelectedImage(ctx.pmState);
    },
    /**
     * Toggles the caption state of the selected image.
     *
     * @param {PMCommandContext} ctx Command context.
     * @param {CaptionPayload} [payload={}] Caption payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: CaptionPayload = {}): void {
        // Get the currently selected image.
        const selected: { node: PMNode; position: number } | null = getSelectedImage(ctx.pmState);
        // Exit if no image is selected.
        if (!selected) {
            return;
        }
        // Remove the caption if one already exists.
        if (hasCaption(selected)) {
            removeCaptionCommand.execute(ctx);
        } else {
            // Add a caption when none exists.
            addCaptionCommand.execute(ctx, payload);
        }
    }
};
