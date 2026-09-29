import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMTransaction, NodeSelection } from '../../../pm/pm-guard';

/**
 * Data used to update the width/height of the selected image.
 */
export interface SetImageDimensionPayload {
    // Target image width.
    width?: number | null;
    // Target image height.
    height?: number | null;
}

/**
 * Determines whether the specified node is an image node.
 *
 * @param {PMNode} node Editor node.
 * @returns {boolean} Indicates whether the node is an image.
 */
function isImageNode(node: PMNode): boolean {
    return node.type.name === 'image' || node.type.name === 'imageInline';
}

/**
 * Updates the width/height of the selected image.
 */
export const setImageDimensionCommand: PMCommandInternal<SetImageDimensionPayload> = {
    name: 'setImageDimension',
    meta: { label: 'Set Image Dimension', category: 'media' },

    /**
     * Determines whether the image dimensions can be updated.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageDimensionPayload} _payload Image dimension payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, _payload: SetImageDimensionPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const selection: { from: number; to: number; node?: PMNode | null } =
        pmState.selection as { from: number; to: number; node?: PMNode | null };
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(selection.from);
        return !!selectedNode && isImageNode(selectedNode);
    },

    /**
     * Applies width/height updates to the selected image.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageDimensionPayload} payload Image dimension payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: SetImageDimensionPayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const selection: { from: number; to: number; node?: PMNode | null } =
        pmState.selection as { from: number; to: number; node?: PMNode | null };
        const targetPosition: number = selection.from;
        const selectedNode: PMNode | null = selection.node ?? pmState.doc.nodeAt(targetPosition);
        if (!selectedNode || !isImageNode(selectedNode)) {
            return;
        }
        let transaction: PMTransaction = pmState.tr;
        if (payload.width !== undefined) {
            transaction = transaction.setNodeAttribute(targetPosition, 'width', payload.width);
        }
        if (payload.height !== undefined) {
            transaction = transaction.setNodeAttribute(targetPosition, 'height', payload.height);
        }
        transaction.setSelection(NodeSelection.create(transaction.doc, targetPosition));
        ctx.dispatch(wrapTransaction(transaction));
    }
};
