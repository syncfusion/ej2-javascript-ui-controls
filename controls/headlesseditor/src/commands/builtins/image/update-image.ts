
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { UpdateImagePayload } from '../../../extensions/builtins/image';
import { PMEditorState, PMNode, PMTransaction, NodeSelection } from '../../../pm/pm-guard';

// Supported image node types.
const IMAGE_NODE_NAMES: readonly string[] = ['image', 'imageInline'];

/**
 * Image attributes updated directly from the payload.
 */
const DIRECT_PASSTHROUGH_KEYS: readonly (keyof UpdateImagePayload)[] = [
    'src', 'alt', 'title', 'width', 'height'
];

/**
 * Merges image updates with the existing image attributes.
 *
 * @param {*} existingAttributes Current image attributes.
 * @param {UpdateImagePayload} payload Image update payload.
 * @returns {*} Updated image attributes.
 */
function mergeImageAttrs(existingAttributes: Record<string, unknown>, payload: UpdateImagePayload): Record<string, unknown> {
    // Create a copy of the existing image attributes.
    const mergedAttributes: Record<string, unknown> = Object.assign({}, existingAttributes);
    // Apply each defined payload field directly.
    for (const key of DIRECT_PASSTHROUGH_KEYS) {
        const value: UpdateImagePayload[typeof key] = payload[key as string];
        if (value !== undefined) {
            mergedAttributes[key as string] = value;
        }
    }
    // Serialize custom attributes to a JSON string for storage.
    if (payload.attributes !== undefined) {
        mergedAttributes['attributes'] = payload.attributes ? JSON.stringify(payload.attributes) : '';
    }
    return mergedAttributes;
}

/**
 * Updates the selected image.
 *
 * This command updates image properties such as source,
 * alt text, title, and custom attributes.
 */
export const updateImageCommand: PMCommandInternal<UpdateImagePayload> = {
    name: 'updateImage',
    meta: { label: 'Update Image', category: 'media' },

    /**
     * Determines whether the selected image can be updated.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {UpdateImagePayload} _payload Image update payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, _payload: UpdateImagePayload): boolean {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; to: number; node?: PMNode | null } =
            pmState.selection as { from: number; to: number; node?: PMNode | null };
        // Get the selected image node.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        // Ensure the selected node is an image.
        return !!selectedNode && IMAGE_NODE_NAMES.indexOf(selectedNode.type.name) !== -1;
    },

    /**
     * Applies updates to the selected image.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {UpdateImagePayload} payload Image update payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: UpdateImagePayload): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const selection: { from: number; to: number; node?: PMNode | null } =
            pmState.selection as { from: number; to: number; node?: PMNode | null };
        // Get the selected image position.
        const targetPosition: number = selection.from;
        // Get the selected image node.
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(targetPosition);
        // Exit if the selected node is not an image.
        if (!selectedNode || IMAGE_NODE_NAMES.indexOf(selectedNode.type.name) === -1) {
            return;
        }
        // Merge the requested changes with the existing attributes.
        const mergedAttributes: Record<string, unknown> = mergeImageAttrs(selectedNode.attrs, payload);
        // Update the image node.
        const transaction: PMTransaction = pmState.tr.setNodeMarkup(targetPosition, selectedNode.type, mergedAttributes as Parameters<PMTransaction['setNodeMarkup']>[2]);
        // Keep the updated image selected.
        transaction.setSelection(NodeSelection.create(transaction.doc, targetPosition));
        // Apply the transaction.
        ctx.dispatch(wrapTransaction(transaction));
    }
};
