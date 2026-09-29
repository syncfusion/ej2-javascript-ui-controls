import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { NodeSelection } from 'prosemirror-state';
import { PMNode, PMNodeType, PMSchema, PMTransaction, ResolvedPos, PMFragment, PMEditorState } from '../../../pm/pm-guard';

/**
 * Data used to update the display mode of the selected image.
 */
export interface SetImageDisplayPayload {
    // Target image display mode.
    readonly mode: 'block' | 'inline';
}

/**
 * Determines whether the specified node is an image node.
 *
 * @param {PMNode} node Editor node.
 * @returns {boolean} Indicates whether the node is an image.
 */
function isImageNode(node: PMNode): boolean {
    // Both node types represent images; their type determines block or inline layout.
    return node.type.name === 'image' || node.type.name === 'imageInline';
}

/**
 * Finds a node's current document position after transaction steps have run.
 *
 * @param {PMNode} doc Document containing the target node.
 * @param {PMNode} targetNode Node whose position should be resolved.
 * @returns {number} The node position, or -1 when the node is not present.
 */
function resolveNodePosition(doc: PMNode, targetNode: PMNode): number {
    // Use a sentinel until the node is found in the transaction's updated document.
    let targetPosition: number = -1;
    // Walk the document because transaction steps can change the original position.
    doc.descendants((node: PMNode, position: number): boolean => {
        // Match the exact node instance created by the conversion.
        if (node === targetNode) {
            targetPosition = position;
            // Stop traversal as soon as the target position is known.
            return false;
        }
        // Continue searching through the remaining document descendants.
        return true;
    });
    // Return the resolved position, or -1 when the node is no longer present.
    return targetPosition;
}

/**
 * Converts the selected image between block and inline display modes.
 */
export const setImageDisplayCommand: PMCommandInternal<SetImageDisplayPayload> = {
    name: 'setImageDisplay',
    meta: { label: 'Set Image Display Mode', category: 'media' },

    /**
     * Determines whether the image display mode can be updated.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageDisplayPayload} _payload Display mode payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, _payload: SetImageDisplayPayload): boolean {
        // The command currently needs no payload validation; execution validates the mode.
        void _payload;
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the current selection.
        const { selection } = pmState;
        // Check whether an image node is directly selected.
        if (selection instanceof NodeSelection && isImageNode(selection.node)) {
            // A directly selected image can be converted immediately.
            return true;
        }
        // Search for an image node within the selected range.
        let hasImage: boolean = false;
        pmState.doc.nodesBetween(selection.from, selection.to, (node: PMNode): boolean => {
            if (isImageNode(node)) {
                hasImage = true;
                // Stop scanning once an image is found.
                return false;
            }
            // Continue scanning until an image is found or the range is exhausted.
            return true;
        }
        );
        // The command is available only when the selection contains an image.
        return hasImage;
    },

    /**
     * Updates the display mode of the selected image.
     *
     * Converts the image between block and inline node types
     * while preserving the existing image attributes.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {SetImageDisplayPayload} payload Display mode payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: SetImageDisplayPayload): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the editor schema.
        const schema: PMSchema = pmState.schema;
        // Create a transaction for the update operation.
        const transaction: PMTransaction = pmState.tr;
        // Get the current selection.
        const { selection } = pmState;
        // Track the selected image node and its document position.
        let targetPosition: number = -1;
        let currentNode: PMNode | null = null;
        // Resolve the selected image node.
        if (selection instanceof NodeSelection && isImageNode(selection.node)) {
            // Use the directly selected image and its current document position.
            targetPosition = selection.from;
            currentNode = selection.node;
        } else {
            // Find the first image node within the selection range.
            pmState.doc.nodesBetween(selection.from, selection.to, (node: PMNode, pos: number): boolean => {
                if (isImageNode(node)) {
                    targetPosition = pos;
                    currentNode = node;
                    // Stop scanning after the first image is found.
                    return false;
                }
                return true;
            }
            );
        }
        // Exit if no image node was found.
        if (targetPosition === -1 || !currentNode) {
            // Silently do nothing when the selection contains no image.
            return;
        }
        // Get the block and inline image node types.
        const imageBlockType: PMNodeType | null = schema.nodes['image'] ?? null;
        const imageInlineType: PMNodeType | null = schema.nodes['imageInline'] ?? null;
        // Exit if the required image node types are unavailable.
        if (!imageBlockType || !imageInlineType) {
            // A conversion is impossible unless both schema node types exist.
            return;
        }
        // Exit if the image already uses the requested display mode.
        if (
            (payload.mode === 'block' && currentNode.type === imageBlockType) ||
            (payload.mode === 'inline' && currentNode.type === imageInlineType)
        ) {
            // Avoid creating a transaction when the image already has the requested type.
            return;
        }
        // Copy the current image attributes.
        const baseAttributes: Record<string, unknown> = {
            ...currentNode.attrs
        };
        // Resolve the image position within the document.
        const resolvedPosition: ResolvedPos = transaction.doc.resolve(targetPosition);
        // Convert the image to the requested display mode.
        if (payload.mode === 'block') {
            // Block conversion may require splitting the current text container.
            convertToBlock(transaction, targetPosition, currentNode, baseAttributes, resolvedPosition);
        } else {
            // Inline conversion inserts the image into an inline-content container.
            convertToInline(transaction, targetPosition, currentNode, baseAttributes, resolvedPosition, schema);
        }
        // Apply the transaction.
        ctx.dispatch(wrapTransaction(transaction));
    }
};

/**
 * Converts an inline image into a block image.
 *
 * If the image is the only child in its parent container,
 * the parent is replaced entirely. Otherwise, the parent
 * content is split and the block image is inserted between
 * the leading and trailing content.
 *
 * @param {PMTransaction} transaction Transaction used to update the document.
 * @param {number} targetPosition Position of the selected image in the document.
 * @param {PMNode} currentNode Currently selected image node.
 * @param {*} baseAttributes Existing image attributes.
 * @param {ResolvedPos} resolvedPosition Resolved position of the image node.
 * @returns {void}
 */
function convertToBlock(transaction: PMTransaction, targetPosition: number, currentNode: PMNode, baseAttributes: Record<string, unknown>,
                        resolvedPosition: ResolvedPos): void {
    // Get the block image node type.
    const imageBlockType: PMNodeType = transaction.doc.type.schema.nodes['image'];
    // Create the target block image attributes.
    const targetBlockAttributes: Record<string, unknown> = {
        ...baseAttributes,
        display: 'block',
        wrap: 'none',
        // Block captions are represented by content inside the block image node.
        caption: currentNode.content.size > 0
    };
    // Create the block image node.
    const targetBlockNode: PMNode = imageBlockType.createChecked(targetBlockAttributes);
    // Get the parent container that currently contains the image.
    const parentBlockNode: PMNode = resolvedPosition.parent;
    // Get the parent container boundaries.
    const parentStart: number = resolvedPosition.before(resolvedPosition.depth);
    const parentEnd: number = resolvedPosition.after(resolvedPosition.depth);
    // Get the parent node type.
    const parentBlockType: PMNodeType = parentBlockNode.type;
    // Replace the entire parent container when it only contains the image.
    if (parentBlockNode.childCount === 1) {
        // Replace the whole parent when it contains only the image.
        transaction.replaceWith(parentStart, parentEnd, targetBlockNode);
        // Select the newly inserted block image.
        transaction.setSelection(NodeSelection.create(transaction.doc, parentStart));
    } else {
        // Keep surrounding inline content by splitting the parent around the image.
        // Calculate the image position within the parent container.
        const offsetInParent: number = targetPosition - parentStart - 1;
        // Get the content before the image.
        const leadingContent: PMFragment = parentBlockNode.content.cut(0, offsetInParent);
        // Get the content after the image.
        const trailingContent: PMFragment = parentBlockNode.content.cut(offsetInParent + currentNode.nodeSize);
        // Build the replacement node collection.
        const fragmentNodes: PMNode[] = [];
        // Preserve the content before the image.
        if (leadingContent.size > 0) {
            // Rebuild the leading part using the original parent node type.
            fragmentNodes.push(parentBlockType.createChecked(null, leadingContent));
        }
        // Insert the block image.
        fragmentNodes.push(targetBlockNode);
        // Preserve the content after the image.
        if (trailingContent.size > 0) {
            // Rebuild the trailing part using the original parent node type.
            fragmentNodes.push(parentBlockType.createChecked(null, trailingContent));
        }
        // Replace the parent container with the split content.
        transaction.replaceWith(parentStart, parentEnd, fragmentNodes);
        // Select the inserted block image.
        const targetBlockInsertionIndex: number = leadingContent.size > 0 ? parentStart + leadingContent.size + 2 : parentStart;
        transaction.setSelection(NodeSelection.create(transaction.doc, targetBlockInsertionIndex)
        );
    }
}

/**
 * Converts a block image into an inline image.
 *
 * The image is inserted into a nearby inline-content container
 * when available. If no suitable container exists, a new
 * paragraph is created.
 *
 * @param {PMTransaction} transaction Transaction used to update the document.
 * @param {number} targetPosition Position of the selected image.
 * @param {PMNode} currentNode Selected image node.
 * @param {*} baseAttributes Existing image attributes.
 * @param {ResolvedPos} resolvedPosition Resolved image position.
 * @param {PMSchema} schema Editor schema.
 * @returns {void}
 */
function convertToInline(transaction: PMTransaction, targetPosition: number, currentNode: PMNode, baseAttributes: Record<string, unknown>,
                         resolvedPosition: ResolvedPos, schema: PMSchema): void {
    // Get the inline image node type.
    const imageInlineType: PMNodeType = schema.nodes['imageInline'];
    // Create the target inline image attributes.
    const targetInlineAttributes: Record<string, unknown> = {
        ...baseAttributes,
        display: 'inline',
        align: 'none',
        // Inline images cannot contain block captions.
        caption: false
    };
    // Create the inline image node.
    const targetInlineNode: PMNode = imageInlineType.createChecked(targetInlineAttributes);
    if (resolvedPosition.parent.inlineContent) {
        // Replace directly when the current parent already accepts inline content.
        transaction.replaceWith(targetPosition, targetPosition + currentNode.nodeSize, targetInlineNode);
    } else {
        // Put the inline image in a nearby text block, or create a paragraph when needed.
        const parent: PMNode = resolvedPosition.parent;
        const parentStart: number = resolvedPosition.start(resolvedPosition.depth);
        const parentIndex: number = resolvedPosition.index(resolvedPosition.depth);
        const previousSibling: PMNode | null = parentIndex > 0 ? parent.child(parentIndex - 1) : null;
        const nextSibling: PMNode | null = parentIndex < parent.childCount - 1
            ? parent.child(parentIndex + 1)
            : null;
        let previousOffset: number = 0;
        for (let index: number = 0; index < parentIndex; index++) {
            previousOffset += parent.child(index).nodeSize;
        }
        const currentStart: number = parentStart + previousOffset;
        if (previousSibling?.isTextblock && !isImageNode(previousSibling)) {
            // Prefer appending to a preceding text block when one is available.
            const mergedPrevious: PMNode = previousSibling.copy(
                previousSibling.content.append(PMFragment.from(targetInlineNode))
            );
            transaction.replaceWith(
                currentStart - previousSibling.nodeSize,
                currentStart + currentNode.nodeSize,
                mergedPrevious
            );
        } else if (nextSibling?.isTextblock && !isImageNode(nextSibling)) {
            // Otherwise prepend to a following text block when possible.
            const nextStart: number = currentStart + currentNode.nodeSize;
            const mergedNext: PMNode = nextSibling.copy(
                PMFragment.from(targetInlineNode).append(nextSibling.content)
            );
            transaction.replaceWith(
                currentStart,
                nextStart + nextSibling.nodeSize,
                mergedNext
            );
        } else {
            // If no suitable sibling exists, create a paragraph around the inline image.
            transaction.replaceWith(
                targetPosition,
                targetPosition + currentNode.nodeSize,
                schema.nodes['paragraph'].createChecked(null, targetInlineNode)
            );
        }
    }
    const inlinePosition: number = resolveNodePosition(transaction.doc, targetInlineNode);
    if (inlinePosition >= 0) {
        // Keep the converted image selected after transaction positions change.
        transaction.setSelection(NodeSelection.create(transaction.doc, inlinePosition));
    }
}
