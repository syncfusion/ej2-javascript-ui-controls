import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { InsertImagePayload, ImageDisplayMode } from '../../../extensions/builtins/image';
import { PMEditorState, PMNode, PMNodeType, PMSchema, PMTransaction, NodeSelection, PMResolvedPos } from '../../../pm/pm-guard';

// Generates unique identifiers for image nodes.
const idGen: DefaultIdGenerator = new DefaultIdGenerator();

// Supported insert image payload formats.
type PayloadInput = InsertImagePayload | readonly InsertImagePayload[];

/**
 * Checks whether the payload contains multiple images.
 *
 * @param {PayloadInput} payload Image payload.
 * @returns {boolean} Indicates whether the payload is an array.
 */
function isArrayPayload(payload: PayloadInput): payload is readonly InsertImagePayload[] {
    // Accept either one image payload or a batch of image payloads.
    return Array.isArray(payload);
}

/**
 * Creates image node attributes from the insert image payload.
 *
 * @param {InsertImagePayload} payload Image insert payload.
 * @param {string} id Unique image identifier.
 * @returns {*} Image node attributes.
 */
function buildImageAttrs(payload: InsertImagePayload, id: string): Record<string, unknown> {
    // Convert custom image attributes into a JSON string.
    const customAttributes: string = payload.attributes ? JSON.stringify(payload.attributes) : '';
    return {
        // Unique image identifier.
        id,
        // Image source URL, blob URL, or Base64 data URI.
        src: payload.src,
        // Alternative text for accessibility.
        alt: payload.alt ?? '',
        // Image title text.
        title: payload.title ?? '',
        // Image width.
        width: typeof payload.width === 'number' ? payload.width : null,
        // Image height.
        height: typeof payload.height === 'number' ? payload.height : null,
        // Image display mode.
        display: payload.display ?? 'block',
        // Image alignment.
        align: payload.align ?? 'none',
        // Image text wrapping mode.
        wrap: payload.wrap ?? 'none',
        // Serialized custom HTML attributes.
        attributes: customAttributes
    };
}

/**
 * Returns the image node type for the specified display mode.
 *
 * @param {PMSchema} schema Editor schema.
 * @param {ImageDisplayMode} mode Image display mode.
 * @returns {PMNodeType | null} Matching image node type.
 */
function resolveImageType(schema: PMSchema, mode: ImageDisplayMode): PMNodeType | null {
    // Block and inline images use separate schema node types.
    return mode === 'inline' ? (schema.nodes['imageInline'] ?? null) : (schema.nodes['image'] ?? null);
}

/**
 * Finds the first valid NodeSelection position for the inserted image nodes.
 * The raw insertion offset is not always a valid node boundary, especially when
 * inserting at the end of the document or after a collapsed selection, so we
 * resolve against the actual node instance that was inserted.
 *
 * @param {PMNode} doc Document containing the inserted nodes.
 * @param {number} anchor Approximate position where the image was inserted.
 * @param {*} insertedNodes Nodes inserted by the command.
 * @returns {number} Valid position for selecting the first inserted node.
 */
function resolveInsertedNodeSelection(doc: PMNode, anchor: number, insertedNodes: readonly PMNode[]): number {
    // Find the inserted image's actual position after the document changes so it can be selected.
    // Check the anchor and adjacent positions while keeping each position within the document.
    // Math.min prevents positions beyond the document end; Math.max prevents negative positions.
    const nearbyPositions: readonly number[] = [
        Math.max(0, Math.min(doc.content.size, anchor)),
        Math.max(0, Math.min(doc.content.size, anchor - 1)),
        Math.max(0, Math.min(doc.content.size, anchor + 1))
    ];
    for (const position of nearbyPositions) {
        // Resolve the position against the final document structure.
        const resolved: PMResolvedPos = doc.resolve(position);
        const nodeAfter: PMNode | null = resolved.nodeAfter;
        if (nodeAfter && insertedNodes.some((node: PMNode): boolean => node === nodeAfter)) {
            // The inserted node begins at this position.
            return position;
        }
        const nodeBefore: PMNode | null = resolved.nodeBefore;
        if (nodeBefore && insertedNodes.some((node: PMNode): boolean => node === nodeBefore)) {
            // Convert a position after the node into the node's start position.
            return Math.max(0, position - nodeBefore.nodeSize);
        }
    }
    // Fall back to a full document walk if nearby positions were not boundaries.
    let insertedPos: number = -1;
    doc.descendants((node: PMNode, position: number): void => {
        // Keep the first matching inserted node position.
        if (insertedPos === -1 && insertedNodes.some((insertedNode: PMNode): boolean => insertedNode === node)) {
            insertedPos = position;
        }
    });
    // Use the original anchor only when the inserted node cannot be found.
    return insertedPos >= 0 ? insertedPos : Math.max(0, Math.min(doc.content.size, anchor));
}

/**
 * Ensures block images at the document end have a textblock after them.
 *
 * @param {PMTransaction} transaction Current image insertion transaction.
 * @param {PMSchema} schema Editor schema used to create the trailing block.
 * @param {PMNode[]} insertedNodes Nodes inserted by the command.
 * @returns {void}
 */
function ensureTrailingTextblock(transaction: PMTransaction, schema: PMSchema, insertedNodes: readonly PMNode[]): void {
    // Nothing is required when no block images were inserted.
    if (insertedNodes.length === 0 || transaction.doc.childCount < insertedNodes.length) {
        return;
    }
    // The inserted batch would occupy the final top-level document positions.
    const firstInsertedIndex: number = transaction.doc.childCount - insertedNodes.length;
    let insertedNodesAreAtDocumentEnd: boolean = true;
    insertedNodes.forEach((insertedNode: PMNode, index: number): void => {
        // Compare node identity to ensure this is the batch just inserted.
        if (transaction.doc.child(firstInsertedIndex + index) !== insertedNode) {
            insertedNodesAreAtDocumentEnd = false;
        }
    });
    if (!insertedNodesAreAtDocumentEnd) {
        // Do not append a paragraph when other document content follows.
        return;
    }
    // Create a valid paragraph for continued editing after trailing images.
    const paragraphType: PMNodeType | undefined = schema.nodes['paragraph'];
    const trailingTextblock: PMNode | null = paragraphType?.createAndFill() ?? null;
    if (trailingTextblock) {
        // Append the paragraph at the end of the document.
        transaction.insert(transaction.doc.content.size, trailingTextblock);
    }
}

// Command for inserting images.
export const insertImageCommand: PMCommandInternal<PayloadInput> = {
    name: 'insertImage',
    meta: { label: 'Insert Image', category: 'media' },

    /**
     * Determines whether the image insert operation can be executed.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {PayloadInput} payload Image insert payload.
     * @returns {boolean} Indicates whether the command can be executed.
     */
    canExecute(ctx: PMCommandContext, payload: PayloadInput): boolean {
        // Normalize the payload into an array.
        const images: readonly InsertImagePayload[] = isArrayPayload(payload) ? payload : [payload];
        // Ensure at least one image was provided.
        if (images.length === 0) {
            return false;
        }
        // Ensure all images have a valid source.
        for (const image of images) {
            if (!image.src || image.src.trim() === '') {
                return false;
            }
        }
        return true;
    },

    /**
     * Inserts images at the current selection.
     *
     * @param {PMCommandContext} ctx Command execution context.
     * @param {PayloadInput} payload Image insert payload.
     * @returns {void}
     */
    execute(ctx: PMCommandContext, payload: PayloadInput): void {
        // Get the current editor state.
        const pmState: PMEditorState = ctx.pmState;
        // Get the editor schema.
        const schema: PMSchema = pmState.schema;
        // Create a transaction for the insert operation.
        const transaction: PMTransaction = pmState.tr;
        // Normalize the payload into an array.
        const images: readonly InsertImagePayload[] = isArrayPayload(payload) ? payload : [payload];
        // Collect image nodes to insert.
        const nodesToInsert: PMNode[] = [];
        // Create image nodes.
        for (const image of images) {
            // Get the image display mode.
            const displayMode: ImageDisplayMode = image.display ?? 'block';
            // Resolve the image node type.
            const imageNodeType: PMNodeType | null = resolveImageType(schema, displayMode);
            // Exit if the image node type is unavailable.
            if (!imageNodeType) {
                // Stop without dispatching a partial batch if the schema is incomplete.
                return;
            }
            // Create image node attributes.
            const imageAttributes: Record<string, unknown> = buildImageAttrs(image, idGen.generate());
            // Create and queue the image node.
            const caption: string = imageNodeType === schema.nodes['image']
                ? (image.caption?.trim() ?? '')
                : '';
            // Captions are supported only by block images.
            if (imageNodeType === schema.nodes['image'] && caption.length > 0) {
                imageAttributes['caption'] = true;
            }
            // Store caption text as content inside the block image node.
            nodesToInsert.push(imageNodeType.create(
                imageAttributes,
                caption ? schema.text(caption) : undefined
            ));
        }
        // Insert block images as siblings of the current textblock.
        const { from, to, $from } = pmState.selection;
        const isBlockImage: boolean = images[0]?.display !== 'inline';
        const isOnlyBlockContent: boolean = nodesToInsert.every((node: PMNode): boolean => node.isBlock);
        // Handle block-image insertion from a textblock cursor.
        if (isBlockImage && from === to && isOnlyBlockContent && $from.parent.isTextblock && !$from.parent.type.spec.code) {
            // Start with the current cursor position as the replacement range.
            let posStart: number = from;
            let posEnd: number = to;
            if ($from.parent.childCount === 0) {
                // Replace the entire empty textblock with the block image.
                posStart = $from.before();
                posEnd = $from.after();
            } else if ($from.parentOffset === 0) {
                // At the textblock start, insert the image before the textblock.
                posStart = Math.max(0, from - 1);
            }
            // Replace the cursor position with the block image nodes.
            transaction.replaceWith(posStart, posEnd, nodesToInsert);
            // Keep the document editable after images inserted at its end.
            ensureTrailingTextblock(transaction, schema, nodesToInsert);
            // Resolve the actual inserted node boundary after ProseMirror adjusts the document.
            const selectionPosition: number = resolveInsertedNodeSelection(transaction.doc, posStart, nodesToInsert);
            // Select the first inserted image node.
            transaction.setSelection(NodeSelection.create(transaction.doc, selectionPosition));
            // Dispatch the completed insertion transaction.
            ctx.dispatch(wrapTransaction(transaction));
            return;
        }
        let insertionPosition: number = from;
        if (from !== to) {
            // Remove the selected content before inserting the new images.
            transaction.delete(from, to);
            // Map the original position through the deletion step.
            insertionPosition = transaction.mapping.map(from);
        }
        // Insert inline images or block images at the resolved position.
        transaction.insert(insertionPosition, nodesToInsert);
        if (isBlockImage && isOnlyBlockContent) {
            // Add a trailing paragraph when the inserted block images end the document.
            ensureTrailingTextblock(transaction, schema, nodesToInsert);
        }
        // Find the actual node boundary after insertion and select the image.
        const selectionPosition: number = resolveInsertedNodeSelection(transaction.doc, insertionPosition, nodesToInsert);
        transaction.setSelection(NodeSelection.create(transaction.doc, selectionPosition));
        // Dispatch the transaction through the editor's command pipeline.
        ctx.dispatch(wrapTransaction(transaction));
    }
};
